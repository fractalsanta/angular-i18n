/// <reference path="../../Typescript/Models/IConfirmation.ts" />
/// <reference path="../../Typescript/Models/IConfirmationCheckbox.ts" />
/// <reference path="../../Typescript/Interfaces/IConfirmationService.d.ts" />

module Core.Tests {
    export class ConfirmationServiceMock implements IConfirmationService {

        constructor(private q: ng.IQService) {
        }

        private _result = true;

        private _isCalled = false;

        SetConfirm(value: boolean): void {
            this._result = value;
        }

        IsCalled(): boolean {
            return this._isCalled;
        }


        Confirm(confirmationSettings: IConfirmation): ng.IPromise<boolean> {
            this._isCalled = true;

            var deferred = this.q.defer<Boolean>();
            deferred.resolve(this._result);
            return deferred.promise;

        }

        ConfirmCheckbox(confirmationSettings: IConfirmationCheckbox): ng.IPromise<boolean> {
            return this.Confirm(confirmationSettings);
        }
    }
}