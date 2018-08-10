var Workforce;
(function (Workforce) {
    var MySchedule;
    (function (MySchedule) {
        describe("MyScheduleDetailController", function () {
            var q;
            var rootScope;
            var scope;
            var controller;
            var popupMessageService;
            var myScheduleServiceMock;
            var modalService;
            var translationService;
            beforeEach(function () {
                angular.mock.module(Core.NG.WorkforceMyScheduleModule.Module().name);
                inject(function ($q, $rootScope) {
                    q = $q;
                    rootScope = $rootScope;
                    myScheduleServiceMock = new MySchedule.MyScheduleServiceMock($q).Object;
                    modalService = (new Core.Tests.ModalServiceMock($q, null)).Object;
                    translationService = (new Core.Tests.TranslationServiceMock($q)).Object;
                });
                scope = rootScope.$new(false);
                controller = new MySchedule.MyScheduleDetailController(scope, new Core.Tests.AuthServiceMock().Object, translationService, myScheduleServiceMock, popupMessageService, modalService);
            });
            it("MyScheduleService Mock is set up properly", function () {
                expect(myScheduleServiceMock.GetCachedShifts()).toEqual(Workforce.MySchedule.ShiftsMock);
            });
            it("Shifts / Managers / Teams returned correctly", function () {
                var selectedShift = Workforce.MySchedule.ShiftsMock[0];
                myScheduleServiceMock.SetSelectedShift(selectedShift);
                expect(scope.GetShift().EmployeeId).toEqual(selectedShift.EmployeeId);
                expect(scope.GetManagerShifts().length).toEqual(2);
                expect(scope.GetTeamShifts().length).toEqual(selectedShift.TeamShifts.length - scope.GetManagerShifts().length);
            });
        });
    })(MySchedule = Workforce.MySchedule || (Workforce.MySchedule = {}));
})(Workforce || (Workforce = {}));
