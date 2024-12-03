/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
    "/": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Root */
        get: operations["get-root"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/protected": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Your GET endpoint */
        get: operations["get-protected"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Login with email and password */
        post: operations["post-auth-password"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Login with email and password */
        post: operations["post-auth-verify"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/auth/google": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Login with email and password */
        post: operations["post-auth-google"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** Your GET endpoint */
        get: operations["get-refresh"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get?: never;
        put?: never;
        /** Register a new user */
        post: operations["post-register"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/games": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        /** All games */
        get: operations["get-games"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/games/{id}": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        /** Your GET endpoint */
        get: operations["get-games-id"];
        put?: never;
        post?: never;
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/users/me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        get: operations["get-users-me"];
        put?: never;
        post?: never;
        delete: operations["delete-users-me"];
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
    "/games/{id}/votes": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        get: operations["get-games-id-votes"];
        put?: never;
        post: operations["post-games-id-votes"];
        delete?: never;
        options?: never;
        head?: never;
        patch?: never;
        trace?: never;
    };
}
export type webhooks = Record<string, never>;
export interface components {
    schemas: {
        GameBase: {
            id: string;
            name: string;
            description: string;
            year: number;
            image: string;
            vote?: components["schemas"]["Vote"];
        };
        /**
         * Vote
         * Format: float
         */
        Vote: number;
    };
    responses: {
        /** @description Example response */
        ErrorResponse: {
            headers: {
                [name: string]: unknown;
            };
            content: {
                "application/json": {
                    message?: string;
                };
            };
        };
    };
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}
export type $defs = Record<string, never>;
export interface operations {
    "get-root": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        message: string;
                    };
                };
            };
        };
    };
    "get-protected": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        message?: string;
                    };
                };
            };
        };
    };
    "post-auth-password": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    email: string;
                    password: string;
                };
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        token: string;
                    };
                };
            };
            400: components["responses"]["ErrorResponse"];
        };
    };
    "post-auth-verify": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie: {
                auth: string;
            };
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        token: string;
                        message?: string;
                    };
                };
            };
        };
    };
    "post-auth-google": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    accessToken: string;
                };
            };
        };
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        token: string;
                    };
                };
            };
        };
    };
    "get-refresh": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        token?: string;
                    };
                };
            };
        };
    };
    "post-register": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    email: string;
                    password: string;
                };
            };
        };
        responses: {
            /** @description Created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        token: string;
                        message: string;
                    };
                };
            };
            400: components["responses"]["ErrorResponse"];
            409: components["responses"]["ErrorResponse"];
            500: components["responses"]["ErrorResponse"];
        };
    };
    "get-games": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GameBase"][];
                };
            };
        };
    };
    "get-games-id": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": components["schemas"]["GameBase"] & {
                        fullImage: string;
                        longDescription?: string;
                        tags?: string[];
                        publisher: string;
                        voteDistribution?: {
                            1?: number;
                            2?: number;
                            3?: number;
                            4?: number;
                            5?: number;
                        };
                    };
                };
            };
            404: components["responses"]["ErrorResponse"];
        };
    };
    "get-users-me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        name: string;
                        email: string;
                        image: string;
                    };
                };
            };
            400: components["responses"]["ErrorResponse"];
            404: components["responses"]["ErrorResponse"];
        };
    };
    "delete-users-me": {
        parameters: {
            query?: never;
            header?: never;
            path?: never;
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        message?: string;
                    };
                };
            };
        };
    };
    "get-games-id-votes": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: never;
        responses: {
            /** @description OK */
            200: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        vote?: components["schemas"]["Vote"];
                    };
                };
            };
            404: components["responses"]["ErrorResponse"];
        };
    };
    "post-games-id-votes": {
        parameters: {
            query?: never;
            header?: never;
            path: {
                id: string;
            };
            cookie?: never;
        };
        requestBody?: {
            content: {
                "application/json": {
                    vote: components["schemas"]["Vote"];
                };
            };
        };
        responses: {
            /** @description Created */
            201: {
                headers: {
                    [name: string]: unknown;
                };
                content: {
                    "application/json": {
                        vote: components["schemas"]["Vote"];
                    };
                };
            };
            404: components["responses"]["ErrorResponse"];
        };
    };
}
