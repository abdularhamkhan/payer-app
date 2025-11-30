/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as audit_logs_log from "../audit_logs/log.js";
import type * as cards_create from "../cards/create.js";
import type * as cards_delete from "../cards/delete.js";
import type * as cards_freeze from "../cards/freeze.js";
import type * as cards_get from "../cards/get.js";
import type * as cards_pin from "../cards/pin.js";
import type * as cards_regenerate from "../cards/regenerate.js";
import type * as cards_unfreeze from "../cards/unfreeze.js";
import type * as notifications_list from "../notifications/list.js";
import type * as notifications_markAllRead from "../notifications/markAllRead.js";
import type * as notifications_markRead from "../notifications/markRead.js";
import type * as notifications_push from "../notifications/push.js";
import type * as qr_codes_expire from "../qr_codes/expire.js";
import type * as qr_codes_generate from "../qr_codes/generate.js";
import type * as qr_codes_generateInternal from "../qr_codes/generateInternal.js";
import type * as qr_codes_pay from "../qr_codes/pay.js";
import type * as requests_accept from "../requests/accept.js";
import type * as requests_listIncoming from "../requests/listIncoming.js";
import type * as requests_listOutgoing from "../requests/listOutgoing.js";
import type * as requests_reject from "../requests/reject.js";
import type * as requests_send from "../requests/send.js";
import type * as transactions_cashier from "../transactions/cashier.js";
import type * as transactions_credit from "../transactions/credit.js";
import type * as transactions_debit from "../transactions/debit.js";
import type * as transactions_list from "../transactions/list.js";
import type * as transactions_transfer from "../transactions/transfer.js";
import type * as user_settings_get from "../user_settings/get.js";
import type * as user_settings_toggleDarkMode from "../user_settings/toggleDarkMode.js";
import type * as user_settings_toggleNotifications from "../user_settings/toggleNotifications.js";
import type * as user_settings_update from "../user_settings/update.js";
import type * as users_create from "../users/create.js";
import type * as users_getByPhone from "../users/getByPhone.js";
import type * as users_me from "../users/me.js";
import type * as users_update from "../users/update.js";
import type * as users_uploadAvatar from "../users/uploadAvatar.js";
import type * as utils_getUser from "../utils/getUser.js";
import type * as utils_normalizePhone from "../utils/normalizePhone.js";
import type * as wallets_create from "../wallets/create.js";
import type * as wallets_get from "../wallets/get.js";
import type * as wallets_history from "../wallets/history.js";
import type * as wallets_topup from "../wallets/topup.js";
import type * as wallets_withdraw from "../wallets/withdraw.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "audit_logs/log": typeof audit_logs_log;
  "cards/create": typeof cards_create;
  "cards/delete": typeof cards_delete;
  "cards/freeze": typeof cards_freeze;
  "cards/get": typeof cards_get;
  "cards/pin": typeof cards_pin;
  "cards/regenerate": typeof cards_regenerate;
  "cards/unfreeze": typeof cards_unfreeze;
  "notifications/list": typeof notifications_list;
  "notifications/markAllRead": typeof notifications_markAllRead;
  "notifications/markRead": typeof notifications_markRead;
  "notifications/push": typeof notifications_push;
  "qr_codes/expire": typeof qr_codes_expire;
  "qr_codes/generate": typeof qr_codes_generate;
  "qr_codes/generateInternal": typeof qr_codes_generateInternal;
  "qr_codes/pay": typeof qr_codes_pay;
  "requests/accept": typeof requests_accept;
  "requests/listIncoming": typeof requests_listIncoming;
  "requests/listOutgoing": typeof requests_listOutgoing;
  "requests/reject": typeof requests_reject;
  "requests/send": typeof requests_send;
  "transactions/cashier": typeof transactions_cashier;
  "transactions/credit": typeof transactions_credit;
  "transactions/debit": typeof transactions_debit;
  "transactions/list": typeof transactions_list;
  "transactions/transfer": typeof transactions_transfer;
  "user_settings/get": typeof user_settings_get;
  "user_settings/toggleDarkMode": typeof user_settings_toggleDarkMode;
  "user_settings/toggleNotifications": typeof user_settings_toggleNotifications;
  "user_settings/update": typeof user_settings_update;
  "users/create": typeof users_create;
  "users/getByPhone": typeof users_getByPhone;
  "users/me": typeof users_me;
  "users/update": typeof users_update;
  "users/uploadAvatar": typeof users_uploadAvatar;
  "utils/getUser": typeof utils_getUser;
  "utils/normalizePhone": typeof utils_normalizePhone;
  "wallets/create": typeof wallets_create;
  "wallets/get": typeof wallets_get;
  "wallets/history": typeof wallets_history;
  "wallets/topup": typeof wallets_topup;
  "wallets/withdraw": typeof wallets_withdraw;
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
