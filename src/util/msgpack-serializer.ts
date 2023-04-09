import { convertAll } from '.';

const keepType = Symbol('keep');
type TypeArg<Value> = (new (input: ArrayLike<unknown> | Record<string, unknown>) => Value) | Converter<never, Value> | typeof keepType;

function doConvertValue<T>(typeArg: TypeArg<T>, value: unknown): T {
    if (typeArg === keepType) {
        return value as T;
    }

    if (typeArg instanceof Converter) {
        return typeArg.convert(value as never);
    }

    if (messagePackObject in typeArg) {
        return new typeArg(value as (ArrayLike<unknown> | Record<string, unknown>));
    }

    throw new TypeError('typeArg is not a Converter or constructable MessagePackObject');
}

class MessagePackProperty {
    private key?: string | number;
    private converter?: TypeArg<unknown>;

    setKey(key: string | number) {
        this.key = key;
    }

    setTypeOrConverter(typeOrConverter: TypeArg<unknown>) {
        this.converter = typeOrConverter;
    }

    deserialize(input: ArrayLike<unknown> | Record<string, unknown>): unknown {
        if (this.key === undefined) return undefined;

        let value = (input as Record<string | number, unknown>)[this.key];

        if (value === null || value === undefined) {
            return value;
        }

        if (this.converter) {
            value = doConvertValue(this.converter, value);
        }

        return value;
    }
}

class MessagePackSettings {
    private static readonly configs = new WeakMap<NewableFunction, MessagePackSettings>();

    private readonly properties: Record<string, MessagePackProperty> = {};

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

export const messagePackObject = Symbol('messagePackObject');
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

type AnyKey = string | number | symbol;

export function type<This extends MessagePackObject, PropertyName extends keyof This & string, Value extends This[PropertyName]>(type: TypeArg<Value> | 'keep') {
    return function (target: This, propertyName: PropertyName): void {
        if (type === 'keep') return;

        MessagePackSettings.get(target, propertyName).setTypeOrConverter(type);
    };
}

export function array<T>(elementType: TypeArg<T> | 'keep') {
    return new ArrayConverter(consumeKeep(elementType));
}

export function record<TK extends AnyKey = never, TV = never>(keyType: TypeArg<TK> | 'keep', valueType: TypeArg<TV> | 'keep') {
    return new RecordConverter(consumeKeep(keyType), consumeKeep(valueType));
}

function consumeKeep<T>(arg: TypeArg<T> | 'keep'): TypeArg<T> {
    return arg === 'keep' ? keepType : arg;
}

abstract class Converter<TIn, TOut> {
    abstract convert(input: TIn): TOut;
}

export class CustomConverter<TIn, TOut> extends Converter<TIn, TOut> {
    constructor(private readonly convertFunc: (input: TIn) => TOut) {
        super();
    }

    convert(input: TIn): TOut {
        return this.convertFunc(input);
    }
}

class ArrayConverter<T> extends Converter<unknown[], T[]> {
    private readonly convertFunc: (e: unknown) => T;

    constructor(elementType: TypeArg<T>) {
        super();
        this.convertFunc = e => doConvertValue(elementType, e);
    }

    convert(input: unknown[]): T[] {
        return input.map(this.convertFunc);
    }
}

class RecordConverter<TK extends AnyKey, TV> extends Converter<Record<AnyKey, unknown>, Record<TK, TV>> {
    private readonly convertFunc: (k: unknown, v: unknown) => [TK, TV];

    constructor(keyType: TypeArg<TK>, valueType: TypeArg<TV>) {
        super();
        this.convertFunc = (k, v) => [doConvertValue(keyType, k), doConvertValue(valueType, v)];
    }

    convert(input: Record<AnyKey, unknown>): Record<TK, TV> {
        return convertAll(input, this.convertFunc);
    }
}
