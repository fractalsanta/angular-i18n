var Administration;
(function (Administration) {
    var DataLoad;
    (function (DataLoad) {
        var DataLoadController = (function () {
            function DataLoadController($scope, dataLoadService, $upload) {
                this.$scope = $scope;
                this.dataLoadService = dataLoadService;
                this.$upload = $upload;
                $scope.onFileSelect = function ($files) {
                    for (var i = 0; i < $files.length; i++) {
                        var file = $files[i];
                        $scope.upload = $upload.upload({
                            url: 'Administration/DataLoad/Api/DataLoad',
                            data: { myObj: $scope.fileModel },
                            file: file
                        }).progress(function (evt) {
                        }).success(function (data, status, headers, config) {
                        });
                    }
                };
            }
            return DataLoadController;
        }());
        Core.NG.AdministrationDataLoadModule.RegisterRouteController("", "Templates/DataLoad.html", DataLoadController, Core.NG.$typedScope(), Administration.DataLoad.Api.$dataLoadService, Core.NG.$upload);
    })(DataLoad = Administration.DataLoad || (Administration.DataLoad = {}));
})(Administration || (Administration = {}));
