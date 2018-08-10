/// <reference path="../../../../Core/Tests/TestFramework.ts" />
/// <reference path="../../../../Core/Tests/Mocks/ModalServiceInstanceMock.ts" />
/// <reference path="../../../../Core/Tests/Mocks/ModalServiceMock.ts" />
/// <reference path="../../../../Core/Tests/Mocks/TranslationServiceMock.ts" />
/// <reference path="../../../../Core/Tests/Mocks/PopupMessageServiceMock.ts" />
/// <reference path="../../../../../Scripts/angular-ui/validate.ts" />
/// <reference path="../Interfaces/IMyScheduleDetailControllerScope.d.ts" />
/// <reference path="../Interfaces/IMyScheduleService.d.ts" />
/// <reference path="../Controllers/MyScheduleDetailController.ts" />
/// <reference path="MockMyScheduleService.ts" />
/// <reference path="Mocks.ts" />

module Workforce.MySchedule {
    describe("MyScheduleDetailController", () => {
        var q: ng.IQService;
        var rootScope: ng.IRootScopeService;
        var scope: IMyScheduleDetailControllerScope;
        var controller: MyScheduleDetailController;
        var popupMessageService: Core.IPopupMessageService;
        var myScheduleServiceMock: IMyScheduleService;
        var modalService: ng.ui.bootstrap.IModalService;
        var translationService: Core.ITranslationService;

        beforeEach(() => {
            angular.mock.module(Core.NG.WorkforceMyScheduleModule.Module().name);
            inject(($q: ng.IQService, $rootScope: ng.IRootScopeService) => {
                q = $q;
                rootScope = $rootScope;
                myScheduleServiceMock = new MyScheduleServiceMock($q).Object;
                modalService = (new Core.Tests.ModalServiceMock($q, null)).Object;
                translationService = (new Core.Tests.TranslationServiceMock($q)).Object;
            });

            scope = <IMyScheduleDetailControllerScope>rootScope.$new(false);
                     
            controller = new MyScheduleDetailController(
                scope,
                new Core.Tests.AuthServiceMock().Object,
                translationService,
                myScheduleServiceMock,
                popupMessageService,
                modalService                
                );
        });


        it("MyScheduleService Mock is set up properly", () => {                    
            expect(myScheduleServiceMock.GetCachedShifts()).toEqual(Workforce.MySchedule.ShiftsMock);            
        });

        it("Shifts / Managers / Teams returned correctly", () => {

            var selectedShift = Workforce.MySchedule.ShiftsMock[0];
            myScheduleServiceMock.SetSelectedShift(selectedShift);

            expect(scope.GetShift().EmployeeId).toEqual(selectedShift.EmployeeId);
            expect(scope.GetManagerShifts().length).toEqual(2);
            expect(scope.GetTeamShifts().length).toEqual(selectedShift.TeamShifts.length - scope.GetManagerShifts().length);
        });
       

    });
}