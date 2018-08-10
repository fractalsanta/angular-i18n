module Administration.DataLoad {

    interface IDataLoadControllerScope extends ng.IScope {
        fileModel: any;
        onFileSelect(any);
        upload();
    }

    class DataLoadController {

        constructor(
            private $scope: IDataLoadControllerScope,
            private dataLoadService: Administration.DataLoad.Api.IDataLoadService,
            private $upload
            ) {

                $scope.onFileSelect = function ($files) {
                    //$files: an array of files selected, each file has name, size, and type.
                    for (var i = 0; i < $files.length; i++) {
                        var file = $files[i];

                        ////Form Data ??????
                        //dataLoadService.PostFormData(file).then((result) => {
                        //});

                        $scope.upload = $upload.upload({
                            url: 'Administration/DataLoad/Api/DataLoad', //upload.php script, node.js route, or servlet url
                            // method: POST or PUT,
                            // headers: {'headerKey': 'headerValue'}, withCredential: true,
                            data: { myObj: $scope.fileModel },
                            file: file,
                            // file: $files, //upload multiple files, this feature only works in HTML5 FromData browsers
                            /* set file formData name for 'Content-Desposition' header. Default: 'file' */
                            //fileFormDataName: myFile,
                            /* customize how data is added to formData. See #40#issuecomment-28612000 for example */
                            //formDataAppender: function(formData, key, val){} 
                        }).progress(function (evt) {
                            }).success(function (data, status, headers, config) {
                                // file is uploaded successfully
                            });
                        //.error(...)
                        //.then(success, error, progress); 
                    }
                };


        }
    }

    Core.NG.AdministrationDataLoadModule.RegisterRouteController("", "Templates/DataLoad.html", DataLoadController, Core.NG.$typedScope<IDataLoadControllerScope>()
        , Administration.DataLoad.Api.$dataLoadService
        , Core.NG.$upload);
}   