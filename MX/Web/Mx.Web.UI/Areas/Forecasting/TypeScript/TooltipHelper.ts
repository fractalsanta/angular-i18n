module Forecasting {
    export var GetTooltipEvents: (events: string[]) => string;

    Core.NG.CoreModule.Module().run([
        Core.NG.$sanitize.name, ($sanitize: ng.sanitize.ISanitizeService) => {
            GetTooltipEvents = (events: string[]) => events.map((event: string) => "<tr><td colspan='2'><b>" + $sanitize(event) + "</b></td></tr>").join("");
        }
    ]);
}