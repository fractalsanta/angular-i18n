declare module angular.external.fileupload {
    interface IFileUpload {
        sendHttp(): ng.IHttpPromise<any>;
        upload(): ng.IHttpPromise<any>;
        http(): ng.IHttpPromise<any>;
    }
} 