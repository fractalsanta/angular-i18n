var Core;
(function (Core) {
    (function (ConfirmationTypeEnum) {
        ConfirmationTypeEnum[ConfirmationTypeEnum["Positive"] = 1] = "Positive";
        ConfirmationTypeEnum[ConfirmationTypeEnum["Danger"] = 3] = "Danger";
    })(Core.ConfirmationTypeEnum || (Core.ConfirmationTypeEnum = {}));
    var ConfirmationTypeEnum = Core.ConfirmationTypeEnum;
})(Core || (Core = {}));
