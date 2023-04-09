import { convertAll, convertValues } from ".";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DeserializeType = (new (input: ArrayLike<unknown> | Record<string, unknown>) => MessagePackObject) | CustomConverter<any, any>;

function deserializeWithConverter(value: unknown, converterOrType?: DeserializeType): unknown {
    if (converterOrType === undefined) {
        return value;
    }

    if (converterOrType instanceof CustomConverter) {
        return converterOrType.convert(value);
    }

    if (messagePackObject in converterOrType && converterOrType[messagePackObject]) {
        return new converterOrType(value as (ArrayLike<unknown> | Record<string, unknown>));
    }

    throw new TypeError('deserializeType is not a CustomConverter or subtype of MessagePackObject');
}

class MessagePackProperty {
    private key?: string | number;
    private converter?: DeserializeType;
    private propIsRecord = false;
    private propIsArray = false;

    setKey(key: string | number) {
        this.key = key;
    }

    setConverter(converter: DeserializeType) {
        this.converter = converter;
    }

    isRecord() {
        this.propIsRecord = true;
    }

    isArray() {
        this.propIsArray = true;
    }

    deserialize(input: ArrayLike<unknown> | Record<string, unknown>): unknown {
        if (this.key === undefined) return undefined;

        let value = (input as Record<string | number, unknown>)[this.key];

        if (value === null || value === undefined) {
            return value;
        }

        if (this.converter) {
            if (this.propIsRecord) {
                value = convertValues(value as Record<string, unknown>, v => deserializeWithConverter(v, this.converter));
            } else if (this.propIsArray) {
                value = (value as unknown[]).map(v => deserializeWithConverter(v, this.converter));
            } else {
                value = deserializeWithConverter(value, this.converter);
            }
        }

        return value;
    }
}

class MessagePackSettings {
    // eslint-disable-next-line @typescript-eslint/ban-types
    private static configs = new WeakMap<Function, MessagePackSettings>();

    private properties: Record<string, MessagePackProperty> = {};

    static get<This extends MessagePackObject, PropertyName extends keyof This & string>(target: This, propertyName: PropertyName) {
        let value = MessagePackSettings.configs.get(target.constructor);
        if (value === undefined) {
            MessagePackSettings.configs.set(target.constructor, value = new MessagePackSettings());
        }

        return value.getProperty(propertyName);
    }

    getProperty(propertyName: string): MessagePackProperty {
        return this.properties[propertyName] ??= new MessagePackProperty();
    }

    static runInitializers(object: object, input: ArrayLike<unknown> | Record<string, unknown>) {
        const config = MessagePackSettings.configs.get(object.constructor);
        if (config === undefined) return;

        for (const propertyName in config.properties) {
            if (!Object.hasOwn(config.properties, propertyName)) continue;

            const propertyConfig = config.properties[propertyName];
            (object as Record<string, unknown>)[propertyName] = propertyConfig.deserialize(input);
        }
    }
}

const messagePackObject = Symbol('messagePackObject');
export abstract class MessagePackObject {
    static [messagePackObject] = true;

    /** Serialization constructor */
    constructor(input: ArrayLike<unknown> | Record<string, unknown>) {
        MessagePackSettings.runInitializers(this, input);
    }
}

export function key<This extends MessagePackObject, PropertyName extends keyof This & string>(key: number | string) {
    return function (target: This, propertyName: PropertyName): void {
        MessagePackSettings.get(target, propertyName).setKey(key);
    };
}

export function converter<This extends MessagePackObject, PropertyName extends keyof This & string>(deserializeType: DeserializeType) {
    return function (target: This, propertyName: PropertyName): void {
        MessagePackSettings.get(target, propertyName).setConverter(deserializeType);
    };
}

export function record<This extends MessagePackObject, PropertyName extends keyof This & string>(target: This, propertyName: PropertyName) {
    MessagePackSettings.get(target, propertyName).isRecord();
}

export function array<This extends MessagePackObject, PropertyName extends keyof This & string>(target: This, propertyName: PropertyName) {
    MessagePackSettings.get(target, propertyName).isArray();
}

export class CustomConverter<TIn, TOut> {
    constructor(private readonly convertFunc: (input: TIn) => TOut) {
    }

    convert(input: TIn): TOut {
        return this.convertFunc(input);
    }
}
