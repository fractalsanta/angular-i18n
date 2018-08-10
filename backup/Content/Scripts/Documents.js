function onReportBegin() {
    $('#waitingDiv').css('display', 'block');
    $('#waitingContents').css('display', 'block');
}

function onReportSuccess(data, textStatus, jqXHR) {
    $('#waitingDiv').css('display', 'none');
    $('#waitingContents').css('display', 'none');
}

function onReportComplete(jqXhr, textStatus) {
    $('#waitingDiv').css('display', 'none');
    $('#waitingContents').css('display', 'none');
}

function onError(jqXHR, textStatus, errorThrown) {
    $('#waitingDiv').css('display', 'none');
    $('#waitingContents').css('display', 'none');
}

function CompletedLoading() {
    $('#waitingDiv').css('display', 'none');
    $('#waitingContents').css('display', 'none');
}

function getUrlWithoutEndBits() {
    var url = window.location.toString();
    var index = url.indexOf("?");
    if (index === -1) {
        index = url.indexOf("#");
    }
    if (index === -1)
        return url;
    return url.substring(0, index);
}

