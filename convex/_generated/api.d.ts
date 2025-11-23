/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as users_create from "../users/create.js";
import type * as users_getByPhone from "../users/getByPhone.js";
import type * as users_me from "../users/me.js";
import type * as users_update from "../users/update.js";
import type * as utils_phone from "../utils/phone.js";
import type * as wallets_create from "../wallets/create.js";
import type * as wallets_get from "../wallets/get.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "users/create": typeof users_create;
  "users/getByPhone": typeof users_getByPhone;
  "users/me": typeof users_me;
  "users/update": typeof users_update;
  "utils/phone": typeof utils_phone;
  "wallets/create": typeof wallets_create;
  "wallets/get": typeof wallets_get;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
