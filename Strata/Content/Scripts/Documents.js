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
    if (index == -1) {
        index = url.indexOf("#");
    }
    if (index == -1)
        return url;
    return url.substring(0, index);
}

function startGetReport() {
    $.ajax({
        url: 'StartGetReport',
        type: 'POST',
        data: JSON.stringify({ 'notUsed': 'notUsed' }),
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        beforeSend: function () {
            onReportBegin();
        },
        success: function (data, textStatus, jqXHR) {
            onReportSuccess(data, textStatus, jqXHR);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            onError(jqXHR, textStatus, errorThrown);
        },
        complete: function (jqXhr, textStatus) {
            onReportComplete(jqXhr, textStatus);
        }
    });         // ajax    
}

function GetDocument(path) {

    var url = '';

    if (location.port.length == 0)
        url = 'http://' + location.hostname + path;
    else
        url = 'http://' + location.hostname + ':' + location.port + path;

    // url = url + reportName + "Run?ownerCorpIndex=" + index;
    window.location.replace(url);
    startGetReport();
}
