declare interface PSEAttributes {
    // General
    /**
     * (Optional) A name for the Search Element object. A name is used to retrieve
     * an associated component by name, or to pair a searchbox
     * component with a searchresults component. If not supplied,
     * Programmable Search Engine will automatically generate a gname, based on
     * the order of components on the webpage. For example, the first unnamed
     * searchbox-only has the gname "searchbox-only0"
     * and the second has the gname "seachbox-only1", and so on.
     * Note that the automatically generated gname for a component in
     * two-column layout will be two-column. The following example
     * uses the gname storesearch to link a searchbox
     * component with a searchresults component:
     * <div class="gcse-searchbox" data-gname="storesearch"></div><div class="gcse-searchresults" data-gname="storesearch"></div>
     * When retrieving an object, if more than one component has the same
     * gname, Programmable Search Engine will use the last component on the
     * page.
     * [Any]
     */
    gname: string;
    /**
     * Specifies whether to execute a search by the query embedded in the URL
     * of the page that's loading. Note that a query string has to be present in the URL
     * to execute the auto search. Default: true.
     * [Any]
     */
    autoSearchOnLoad: boolean;
    /**
     * If true, enables history management for the browser Back
     * and Forward buttons. See a demo.
     * [searchboxsearchbox-only]
     */
    enableHistory: boolean;
    /**
     * The query parameter name—for example, q (default)
     * or query. This will be embedded in the URL (for example,
     * http://www.example.com?q=lady+gaga). Note that specifying the
     * query parameter name alone doesn't trigger auto-search on load. A query
     * string has to be present in the URL to execute the auto search.
     * [Any]
     */
    queryParameterName: string;
    /**
     * The URL of the results page. (Default is the Google-hosted page.)
     * [searchbox-only]
     */
    resultsUrl: url;
    /**
     * Specifies whether the results page opens in a new window.
     * Default: false.
     * [searchbox-only]
     */
    newWindow: boolean;
    /**
     *
     * Specifies whether users have consented to allowing the publisher to share personal
     * information with Google for the purpose of personalized advertising.
     * true Returns query targeted ads and some ads that may be targeted with the
     * user's Google cookies. If the user is located in the European Union, the user must first
     * consent to allowing your site to share personal information with Google for the purpose of
     * personalized advertising.
     *
     * false Returns only query targeted ads. This will not return any ads that are
     * targeted with the user's Google cookies. If a user has declined consent for allowing your
     * site to share personal information with Google for the purpose of personalized advertising,
     * you must set this value to
     * false.
     *
     * Default: true
     * Sample usage: <div class="gcse-search" data-personalizedAds="false"></div>
     *
     * [searchresults, searchresults-only]
     */
    personalizedAds: boolean;
    /**
     *
     * Specifies whether the mobile layout styles should be used for mobile devices.
     * enabled Uses the mobile layout for mobile devices only.
     * disabled Does not use the mobile layout for any devices.
     * forced Uses the mobile layout for all devices.
     * Default: enabled
     * Sample usage: <div class="gcse-search" data-mobileLayout="disabled"></div>
     *
     * [Any]
     */
    mobileLayout: string;
    // Autocomplete
    /**
     * Only available if autocomplete has been enabled in the Programmable Search Engine control panel.
     * true enables autocomplete.
     * [Any]
     */
    enableAutoComplete: boolean;
    /**
     * The maximum number of autocompletions to display.
     * [searchboxsearchbox-only]
     */
    autoCompleteMaxCompletions: integer;
    /**
     * The maximum number of promotions to display in autocomplete.
     * [searchboxsearchbox-only]
     */
    autoCompleteMaxPromotions: integer;
    /**
     * Comma-separated list of languages for which autocomplete should be
     * enabled.
     * Supported languages.
     * [searchboxsearchbox-only]
     */
    autoCompleteValidLanguages: string;
    // Refinements
    /**
     * Available only if refinements have been created in the
     * Programmable Search Engine control panel. Specifies the default refinement label to
     * display.Note: This attribute is not supported for Google Hosted layout.
     * [Any]
     */
    defaultToRefinement: string;
    /**
     * Acceptable values are tab (default) and link.
     * link is supported only if image search is disabled, or if
     * image search is enabled but web search is disabled.
     * [searchresults, searchresults-only]
     */
    refinementStyle: string;
    // Image search
    /**
     * Available only if
     * image search has been enabled in the Programmable Search Engine control panel.
     * If true, enables image search. Image results will be shown on a
     * separate tab.
     * [searchresults, searchresults-only]
     */
    enableImageSearch: boolean;
    /**
     * Available only if
     * image search has been enabled in the Programmable Search Engine control panel.
     * If true, search results page will display image search results
     * by default. Web results will be available on a separate tab.
     * [Any]
     */
    defaultToImageSearch: boolean;
    /**
     * Available only if
     * image search has been enabled in the Programmable Search Engine control panel.
     * Specifies the layout of the image search results page. Acceptable values
     * are classic, column, or popup.
     * [searchresults, searchresults-only]
     */
    imageSearchLayout: string;
    /**
     * Available only if
     * image search has been enabled in the Programmable Search Engine control panel.
     * Specifies the maximum size of the search results set for image search.
     * For example, large, small, filtered_cse, 10.
     * [Any]
     */
    imageSearchResultSetSize: integer, string;
    /**
     * Available only if
     * image search has been enabled in the Programmable Search Engine control panel.
     * Restricts results to files of a specified extension.
     * Supported extensions are jpg, gif, png, bmp, svg, webp, ico, raw.
     *
     * [Any]
     */
    image_as_filetype: string;
    /**
     * Available only if
     * image search has been enabled in the Programmable Search Engine control panel.
     * Filter search results using Logical OR.
     * Sample usage if you want search results that include either "term1" or "term2":<div class="gcse-search" data-image_as_oq="term1 term2"></div>
     *
     * [Any]
     */
    image_as_oq: string;
    /**
     * Available only if
     * image search has been enabled in the Programmable Search Engine control panel.
     * Filters based on licensing.
     * Supported values are cc_publicdomain, cc_attribute, cc_sharealike, cc_noncommercial, cc_nonderived, and combinations of these.
     * See typical combinations.
     *
     * [Any]
     */
    image_as_rights: string;
    /**
     * Available only if
     * image search has been enabled in the Programmable Search Engine control panel.
     * Restrict results to pages from a specific site.
     * Sample usage: <div class="gcse-search" data-image_as_sitesearch="example.com"></div>
     *
     * [Any]
     */
    image_as_sitesearch: string;
    /**
     * Available only if
     * image search has been enabled in the Programmable Search Engine control panel.
     * Restricts search to black and white (mono), grayscale, or color images.  Supported values are mono, gray, color.
     *
     * [Any]
     */
    image_colortype: string;
    /**
     * Available only if
     * image search has been enabled in the Programmable Search Engine control panel.
     * Restricts search results to documents originating in a particular country.
     * Supported values
     *
     * [Any]
     */
    image_cr: string;
    /**
     * Available only if
     * image search has been enabled in the Programmable Search Engine control panel.
     * Restricts search to images of a specific dominant color.
     * Supported values are red, orange, yellow, green, teal, blue, purple, pink, white, gray, black, brown.
     *
     * [Any]
     */
    image_dominantcolor: string;
    /**
     * Available only if
     * image search has been enabled in the Programmable Search Engine control panel.
     * Automatic filtering of search results.
     * Supported values: 0/1
     * Sample usage: <div class="gcse-search" data-image_filter="0"></div>
     *
     * [Any]
     */
    image_filter: string;
    /**
     * Available only if
     * image search has been enabled in the Programmable Search Engine control panel.
     * Boost search results whose country of origin matches the parameter value.
     * Supported values
     *
     * [Any]
     */
    image_gl: string;
    /**
     * Available only if
     * image search has been enabled in the Programmable Search Engine control panel.
     * Returns images of a specified size, where size can be one of: icon, small, medium, large, xlarge, xxlarge, or huge.
     *
     * [Any]
     */
    image_size: string;
    /**
     * Available only if
     * image search has been enabled in the Programmable Search Engine control panel.
     * Sort results using either date or other structured content.
     * To sort by relevance use an empty string (image_sort_by="").
     * Sample usage: <div class="gcse-search" data-image_sort_by="date"></div>
     *
     * [Any]
     */
    image_sort_by: string;
    /**
     * Available only if
     * image search has been enabled in the Programmable Search Engine control panel.
     * Restricts search to images of a specific type.
     * Supported values are clipart (Clip art), face (Faces of people), lineart (Line drawings), stock (Stock photos), photo (Photographs), and animated (Animated GIFs).
     *
     * [Any]
     */
    image_type: string;
    // Web search
    /**
     * If true, disables web search. Usually used only if
     *
     * image search has been enabled in the Programmable Search Engine control panel.
     * [searchresults, searchresults-only]
     */
    disableWebSearch: boolean;
    /**
     * Extra terms added to search query using logical OR.
     * Sample usage: <div class="gcse-search" data-webSearchQueryAddition="term1 term2"></div>
     * [Any]
     */
    webSearchQueryAddition: string;
    /**
     * The maximum size of the results set. Applies to
     * both image search and web search. The default depends on the layout and
     * whether the Programmable Search Engine is configured to search the whole web or only specified
     * sites. Acceptable values include:
     *
     * An integer from 1-20
     * small: requests a small results set, typically 4 results
     * per page.
     * large: requests a large results set, typically 8
     * results per page.
     * filtered_cse: requests up to 10 results per page, for a
     * maximum of 10 pages or 100 results.
     *
     *
     * [Any]
     */
    webSearchResultSetSize: integer, string;
    /**
     * Specifies if SafeSearch is enabled for websearch results. Accepted values
     * are moderate, off, and active.
     * [Any]
     */
    webSearchSafesearch: string;
    /**
     * Restricts results to files of a specified extension. A list of file types indexable by Google can be found in Search Console Help Center.
     *
     * [Any]
     */
    as_filetype: string;
    /**
     * Filter search results using Logical OR.
     * Sample usage if you want search results that include either "term1" or "term2":<div class="gcse-search" data-as_oq="term1 term2"></div>
     * [Any]
     */
    as_oq: string;
    /**
     * Filters based on licensing.
     * Supported values are cc_publicdomain, cc_attribute, cc_sharealike, cc_noncommercial, cc_nonderived, and combinations of these.
     * See https://wiki.creativecommons.org/wiki/CC_Search_integration for typicall combinations.
     *
     * [Any]
     */
    as_rights: string;
    /**
     * Restrict results to pages from a specific site.
     * Sample usage: <div class="gcse-search" data-as_sitesearch="example.com"></div>
     * [Any]
     */
    as_sitesearch: string;
    /**
     * Restricts search results to documents originating in a particular country.
     * Supported values
     * Sample usage: <div class="gcse-search" data-cr="countryFR"></div>
     * [Any]
     */
    cr: string;
    /**
     * Automatic filtering of search results.
     * Supported values:  0/1
     * Sample usage: <div class="gcse-search" data-filter="0"></div>
     * [Any]
     */
    filter: string;
    /**
     * Boost search results whose country of origin matches the parameter value.
     * This will only work in conjunction with the language value setting.
     * Supported values
     * Sample usage: <div class="gcse-search" data-gl="fr"></div>
     * [Any]
     */
    gl: string;
    /**
     * Restricts search results to documents written in a particular language.
     * Supported values
     * Sample usage: <div class="gcse-search" data-lr="lang_fr"></div>
     *
     * [Any]
     */
    lr: string;
    /**
     * Sort results using either date or other structured content. The attribute value must be one of the options provided in the Results Sorting settings of the programmable search egnine.
     * To sort by relevance use an empty string (sort_by="").
     * Sample usage: <div class="gcse-search" data-sort_by="date"></div>
     * [Any]
     */
    sort_by: string;
    // Search results
    /**
     * Enables the sorting of results by relevance, date, or label.
     * [Any]
     */
    enableOrderBy: boolean;
    /**
     * Sets the link target. Default: _blank.
     * [searchresults, searchresults-only]
     */
    linkTarget: string;
    /**
     * Specifies the default text to display when no results match the query.
     * The default result string can be used to display a localized string in all
     * supported languages, while the customized one does not.
     *
     * [searchresults, searchresults-only]
     */
    noResultsString: string;
    /**
     * The maximum size of the results set. For example, large,
     * small, filtered_cse, 10. The
     * default depends on the layout and whether the engine is configured to search
     * the whole web or only specified sites.
     * [Any]
     */
    resultSetSize: integer, string;
    /**
     * Specifies if
     * SafeSearch is enabled for both web and image search. Accepted values
     * are moderate, off, and active.
     * [Any]
     */
    safeSearch: string;
}

export interface PSEElement {
    /**
     *  The name of the element object. If not supplied, Programmable Search Engine will automatically generate a gname for the object. More information.
     */
    gname: string;
    /**
     *  The type of element.
     */
    type: string;
    /**
     *  The final attributes used to render the element.
     */
    uiOptions: Partial<PSEAttributes>
    /**
     * - function(string): Executes a programmatic query.
     */
    execute(query: string): void;
    /**
     * - function(string): Prefills the searchbox with a query string without executing the query.
     */
    prefillQuery(query: string): void;
    /**
     * - function(): Gets the current value displayed in the input box.
     */
    getInputQuery(): string;
    /**
     * - function(): Clears the control by hiding everything but the search box, if any.
     */
    clearAllResults(): void;
}

declare interface PSEPromotion {
    content: string,
    image: {
        height: number,
        url: string,
        width: number,
    },
    title: string,
    url: string,
    visibleUrl: string,
}

declare interface PSEResult {
    content: string,
    contentNoFormatting: string,
    contextUrl: string, // For image search results only
    fileFormat: string,
    image: { // For image search reseults only
        height: number,
        url: string,
        width: number,
    },
    perResultLabels: Array<{
        anchor: string,
        label: string,
        labelWithOp: string,
    }>,
    richSnippet: object[], // For web search results only
    thumbnailImage: {
        height: number,
        url: string,
        width: number,
    },
    title: string,
    titleNoFormatting: string,
    url: string,
    visibleUrl: string,
}

declare global {
    namespace google {
        export function setOnLoadCallback(callback: () => void, unknown: bool): void;
    }

    namespace google.search.cse.element {
        export function render(componentConfig: {
            div: string | Element,
            tag: 'search' | 'searchbox' | 'searchbox-only' | 'searchresults-only',
            gname?: string,
            attributes?: Partial<PSEAttributes>
        }, opt_componentConfig?: {
            div: string | Element,
            tag: 'searchresults',
            gname?: string,
            attributes?: Partial<PSEAttributes>
        });

        export function go(opt_container?: string | Element);

        export function getElement(gname: string): PSEElement | null;

        export function getAllElements(): { [gname: string]: PSEElement; };
    }

    interface Window {
        __gcse: Partial<{
            parsetags: 'onload' | 'explicit', // Defaults to 'onload'
            initializationCallback(): void,
            searchCallbacks: {
                image: {
                    starting(gname: string, query: string): string,
                    ready(gname: string, query: string, promos: PSEPromotion[], results: PSEResult[], div: Element): boolean,
                    rendered(gname: string, query: string, promoElts: Element[], resultElts: Element[]),
                },
                web: {
                    starting(gname: string, query: string): string,
                    ready(gname: string, query: string, promos: PSEPromotion[], results: PSEResult[], div: Element): boolean,
                    rendered(gname: string, query: string, promoElts: Element[], resultElts: Element[]),
                },
            },
        }> | undefined;
    }
}