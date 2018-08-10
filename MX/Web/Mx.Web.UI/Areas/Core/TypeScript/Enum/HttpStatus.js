var Core;
(function (Core) {
    "use strict";
    (function (HttpStatus) {
        HttpStatus[HttpStatus["Canceled"] = 0] = "Canceled";
        HttpStatus[HttpStatus["OK"] = 200] = "OK";
        HttpStatus[HttpStatus["Created"] = 201] = "Created";
        HttpStatus[HttpStatus["Accepted"] = 202] = "Accepted";
        HttpStatus[HttpStatus["BadRequest"] = 400] = "BadRequest";
        HttpStatus[HttpStatus["Unauthorized"] = 401] = "Unauthorized";
        HttpStatus[HttpStatus["Forbidden"] = 403] = "Forbidden";
        HttpStatus[HttpStatus["NotFound"] = 404] = "NotFound";
        HttpStatus[HttpStatus["Conflict"] = 409] = "Conflict";
        HttpStatus[HttpStatus["InternalServerError"] = 500] = "InternalServerError";
        HttpStatus[HttpStatus["NotImplemented"] = 501] = "NotImplemented";
        HttpStatus[HttpStatus["ServiceUnavailable"] = 503] = "ServiceUnavailable";
        HttpStatus[HttpStatus["ERROR_INTERNET_OUT_OF_HANDLES"] = 12001] = "ERROR_INTERNET_OUT_OF_HANDLES";
        HttpStatus[HttpStatus["ERROR_INTERNET_TIMEOUT"] = 12002] = "ERROR_INTERNET_TIMEOUT";
        HttpStatus[HttpStatus["ERROR_INTERNET_EXTENDED_ERROR"] = 12003] = "ERROR_INTERNET_EXTENDED_ERROR";
        HttpStatus[HttpStatus["ERROR_INTERNET_INTERNAL_ERROR"] = 12004] = "ERROR_INTERNET_INTERNAL_ERROR";
        HttpStatus[HttpStatus["ERROR_INTERNET_INVALID_URL"] = 12005] = "ERROR_INTERNET_INVALID_URL";
        HttpStatus[HttpStatus["ERROR_INTERNET_UNRECOGNIZED_SCHEME"] = 12006] = "ERROR_INTERNET_UNRECOGNIZED_SCHEME";
        HttpStatus[HttpStatus["ERROR_INTERNET_NAME_NOT_RESOLVED"] = 12007] = "ERROR_INTERNET_NAME_NOT_RESOLVED";
        HttpStatus[HttpStatus["ERROR_INTERNET_PROTOCOL_NOT_FOUND"] = 12008] = "ERROR_INTERNET_PROTOCOL_NOT_FOUND";
        HttpStatus[HttpStatus["ERROR_INTERNET_INVALID_OPTION"] = 12009] = "ERROR_INTERNET_INVALID_OPTION";
        HttpStatus[HttpStatus["ERROR_INTERNET_BAD_OPTION_LENGTH"] = 12010] = "ERROR_INTERNET_BAD_OPTION_LENGTH";
        HttpStatus[HttpStatus["ERROR_INTERNET_OPTION_NOT_SETTABLE"] = 12011] = "ERROR_INTERNET_OPTION_NOT_SETTABLE";
        HttpStatus[HttpStatus["ERROR_INTERNET_SHUTDOWN"] = 12012] = "ERROR_INTERNET_SHUTDOWN";
        HttpStatus[HttpStatus["ERROR_INTERNET_INCORRECT_USER_NAME"] = 12013] = "ERROR_INTERNET_INCORRECT_USER_NAME";
        HttpStatus[HttpStatus["ERROR_INTERNET_INCORRECT_PASSWORD"] = 12014] = "ERROR_INTERNET_INCORRECT_PASSWORD";
        HttpStatus[HttpStatus["ERROR_INTERNET_LOGIN_FAILURE"] = 12015] = "ERROR_INTERNET_LOGIN_FAILURE";
        HttpStatus[HttpStatus["ERROR_INTERNET_INVALID_OPERATION"] = 12016] = "ERROR_INTERNET_INVALID_OPERATION";
        HttpStatus[HttpStatus["ERROR_INTERNET_OPERATION_CANCELLED"] = 12017] = "ERROR_INTERNET_OPERATION_CANCELLED";
        HttpStatus[HttpStatus["ERROR_INTERNET_INCORRECT_HANDLE_TYPE"] = 12018] = "ERROR_INTERNET_INCORRECT_HANDLE_TYPE";
        HttpStatus[HttpStatus["ERROR_INTERNET_INCORRECT_HANDLE_STATE"] = 12019] = "ERROR_INTERNET_INCORRECT_HANDLE_STATE";
        HttpStatus[HttpStatus["ERROR_INTERNET_NOT_PROXY_REQUEST"] = 12020] = "ERROR_INTERNET_NOT_PROXY_REQUEST";
        HttpStatus[HttpStatus["ERROR_INTERNET_REGISTRY_VALUE_NOT_FOUND"] = 12021] = "ERROR_INTERNET_REGISTRY_VALUE_NOT_FOUND";
        HttpStatus[HttpStatus["ERROR_INTERNET_BAD_REGISTRY_PARAMETER"] = 12022] = "ERROR_INTERNET_BAD_REGISTRY_PARAMETER";
        HttpStatus[HttpStatus["ERROR_INTERNET_NO_DIRECT_ACCESS"] = 12023] = "ERROR_INTERNET_NO_DIRECT_ACCESS";
        HttpStatus[HttpStatus["ERROR_INTERNET_NO_CONTEXT"] = 12024] = "ERROR_INTERNET_NO_CONTEXT";
        HttpStatus[HttpStatus["ERROR_INTERNET_NO_CALLBACK"] = 12025] = "ERROR_INTERNET_NO_CALLBACK";
        HttpStatus[HttpStatus["ERROR_INTERNET_REQUEST_PENDING"] = 12026] = "ERROR_INTERNET_REQUEST_PENDING";
        HttpStatus[HttpStatus["ERROR_INTERNET_INCORRECT_FORMAT"] = 12027] = "ERROR_INTERNET_INCORRECT_FORMAT";
        HttpStatus[HttpStatus["ERROR_INTERNET_ITEM_NOT_FOUND"] = 12028] = "ERROR_INTERNET_ITEM_NOT_FOUND";
        HttpStatus[HttpStatus["ERROR_INTERNET_CANNOT_CONNECT"] = 12029] = "ERROR_INTERNET_CANNOT_CONNECT";
        HttpStatus[HttpStatus["ERROR_INTERNET_CONNECTION_ABORTED"] = 12030] = "ERROR_INTERNET_CONNECTION_ABORTED";
        HttpStatus[HttpStatus["ERROR_INTERNET_CONNECTION_RESET"] = 12031] = "ERROR_INTERNET_CONNECTION_RESET";
        HttpStatus[HttpStatus["ERROR_INTERNET_FORCE_RETRY"] = 12032] = "ERROR_INTERNET_FORCE_RETRY";
        HttpStatus[HttpStatus["ERROR_INTERNET_INVALID_PROXY_REQUEST"] = 12033] = "ERROR_INTERNET_INVALID_PROXY_REQUEST";
        HttpStatus[HttpStatus["ERROR_INTERNET_HANDLE_EXISTS"] = 12036] = "ERROR_INTERNET_HANDLE_EXISTS";
        HttpStatus[HttpStatus["ERROR_INTERNET_SEC_CERT_DATE_INVALID"] = 12037] = "ERROR_INTERNET_SEC_CERT_DATE_INVALID";
        HttpStatus[HttpStatus["ERROR_INTERNET_SEC_CERT_CN_INVALID"] = 12038] = "ERROR_INTERNET_SEC_CERT_CN_INVALID";
        HttpStatus[HttpStatus["ERROR_INTERNET_HTTP_TO_HTTPS_ON_REDIR"] = 12039] = "ERROR_INTERNET_HTTP_TO_HTTPS_ON_REDIR";
        HttpStatus[HttpStatus["ERROR_INTERNET_HTTPS_TO_HTTP_ON_REDIR"] = 12040] = "ERROR_INTERNET_HTTPS_TO_HTTP_ON_REDIR";
        HttpStatus[HttpStatus["ERROR_INTERNET_MIXED_SECURITY"] = 12041] = "ERROR_INTERNET_MIXED_SECURITY";
        HttpStatus[HttpStatus["ERROR_INTERNET_CHG_POST_IS_NON_SECURE"] = 12042] = "ERROR_INTERNET_CHG_POST_IS_NON_SECURE";
        HttpStatus[HttpStatus["ERROR_INTERNET_POST_IS_NON_SECURE"] = 12043] = "ERROR_INTERNET_POST_IS_NON_SECURE";
        HttpStatus[HttpStatus["ERROR_HTTP_HEADER_NOT_FOUND"] = 12150] = "ERROR_HTTP_HEADER_NOT_FOUND";
        HttpStatus[HttpStatus["ERROR_HTTP_DOWNLEVEL_SERVER"] = 12151] = "ERROR_HTTP_DOWNLEVEL_SERVER";
        HttpStatus[HttpStatus["ERROR_HTTP_INVALID_SERVER_RESPONSE"] = 12152] = "ERROR_HTTP_INVALID_SERVER_RESPONSE";
        HttpStatus[HttpStatus["ERROR_HTTP_INVALID_HEADER"] = 12153] = "ERROR_HTTP_INVALID_HEADER";
        HttpStatus[HttpStatus["ERROR_HTTP_INVALID_QUERY_REQUEST"] = 12154] = "ERROR_HTTP_INVALID_QUERY_REQUEST";
        HttpStatus[HttpStatus["ERROR_HTTP_HEADER_ALREADY_EXISTS"] = 12155] = "ERROR_HTTP_HEADER_ALREADY_EXISTS";
        HttpStatus[HttpStatus["ERROR_HTTP_REDIRECT_FAILED"] = 12156] = "ERROR_HTTP_REDIRECT_FAILED";
    })(Core.HttpStatus || (Core.HttpStatus = {}));
    var HttpStatus = Core.HttpStatus;
})(Core || (Core = {}));
