<?php

use Dedoc\Scramble\Http\Middleware\RestrictedDocsAccess;

return [

    /*
     * Your API path. By default, all routes starting with this path will be added to the docs.
     * If you need to change this behavior, you can add your custom routes resolver using `Scramble::routes()`.
     */
    'api_path' => 'api',

    /*
     * Your API domain. By default, app domain is used. This is also a part of the default API routes
     * matcher, so when implementing your own, make sure you use this config if needed.
     */
    'api_domain' => null,

    /*
     * The path where your OpenAPI specification will be exported.
     */
    'export_path' => 'api.json',

    /*
     * The path where Scramble will serve your API documentation UI.
     * Default is "docs/api", but you can change it to "doc/api" or any other route.
     */
    'docs_path' => 'doc/api',

    'info' => [
        /*
         * API version.
         */
        'version' => env('API_VERSION', '0.0.1'),

        /*
         * Description rendered on the home page of the API documentation.
         */
        'description' => '',
    ],

    /*
     * Customize Stoplight Elements UI
     */
    'ui' => [
        /*
         * Define the title of the documentation's website. App name is used when this config is `null`.
         */
        'title' => null,

        /*
         * Define the theme of the documentation. Available options are `light`, `dark`, and `system`.
         */
        'theme' => 'light',

        /*
         * Hide the `Try It` feature. Enabled by default.
         */
        'hide_try_it' => false,

        /*
         * Hide the schemas in the Table of Contents. Enabled by default.
         */
        'hide_schemas' => false,

        /*
         * URL to an image that displays as a small square logo next to the title, above the table of contents.
         */
        'logo' => '',

        /*
         * Use to fetch the credential policy for the Try It feature. Options are: omit, include (default), and same-origin
         */
        'try_it_credentials_policy' => 'include',

        /*
         * Layout options:
         * - sidebar (default) – Three-column design with resizable sidebar.
         * - responsive – Sidebar collapses on small screens.
         * - stacked – Single-column layout.
         */
        'layout' => 'responsive',
    ],

    /*
     * The list of servers of the API. By default, when `null`, server URL will be created from
     * `scramble.api_path` and `scramble.api_domain` config variables.
     */
    'servers' => null,

    /*
     * Determines how Scramble stores the descriptions of enum cases.
     * Available options:
     * - 'description'
     * - 'extension'
     * - false
     */
    'enum_cases_description_strategy' => 'description',

    /*
     * Middleware stack applied to Scramble docs routes.
     * By default, includes "web" and "RestrictedDocsAccess".
     */
    'middleware' => [
        'web',
        RestrictedDocsAccess::class,
    ],

    /*
     * You may register custom OpenAPI extensions here.
     */
    'extensions' => [],
];