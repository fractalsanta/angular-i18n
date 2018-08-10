module Core {
    "use strict";
    export interface IFormatterService {
        CreateLocationDisplayName(location: Core.Api.Models.IEntityModel): string;
    }

   export class FormatterService implements IFormatterService {

       CreateLocationDisplayName(location: Core.Api.Models.IEntityModel): string {
           var displayName: string = "";
           if (location != null && location.Name && location.Number) {
               var name: string = location.Name;
               var num: string = location.Number;
               displayName = (name.indexOf(num) > -1) ? name : num + " - " + name;               
           }
           return displayName;
        }
    }

    export var $formatterService: NG.INamedDependency<IFormatterService> =
        NG.CoreModule.RegisterService("FormatterService", FormatterService);
}

