var Core;
(function (Core) {
    (function (PopupMessageTypeEnum) {
        PopupMessageTypeEnum[PopupMessageTypeEnum["Success"] = 1] = "Success";
        PopupMessageTypeEnum[PopupMessageTypeEnum["Warning"] = 2] = "Warning";
        PopupMessageTypeEnum[PopupMessageTypeEnum["Error"] = 3] = "Error";
    })(Core.PopupMessageTypeEnum || (Core.PopupMessageTypeEnum = {}));
    var PopupMessageTypeEnum = Core.PopupMessageTypeEnum;
})(Core || (Core = {}));
