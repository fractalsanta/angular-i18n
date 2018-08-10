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

function RunReport(reportName, planId) {
    
    var url = '';

    if (location.port.length == 0)
        url = 'http://' + location.hostname + '/Reports/GetParameterlessReport?reportName=' + reportName + '&planId=' + planId;
    else
        url = 'http://' + location.hostname + ':' + location.port + '/Reports/GetParameterlessReport?reportName=' + reportName + '&planId=' + planId;
    
    window.location.replace(url);
}

function RunCurrentOwnerAccountReport(reportName, planId, ownerId) {
    var url = '';

    if (location.port.length == 0)
        url = 'http://' + location.hostname + '/Reports/rptCurrentOwnerAccountRun?planId=' + planId + '&ownerId=' + ownerId;
    else
        url = 'http://' + location.hostname + ':' + location.port + '/Reports/rptCurrentOwnerAccountRun?planId=' + planId + '&ownerId=' + ownerId;

    window.location.replace(url);
}

function GetURLParameter(name, urlSearch) {
    /// <summary>Extracts a query string value from the url.</summary>
    /// <param name="name" type="String">The name fo the query string parameter.</param>
    /// <param name="urlSearch" type="String">Pass in location.search.</param>
    /// <returns type="Number">The querystring paramater value.</returns>
    
    return decodeURI(
        (RegExp(name + '=' + '(.+?)(&|$)').exec(urlSearch) || [, null])[1]
    );
}

function runFinancialPerformance() {
    // var index = $('#rptFinancialPerformanceOwnerCorpIndex').val();
    var planId = incomeExpenditurePlanId;
    var period = $('#comparativePeriod').val();
    var reportName = $("#ReportName").val();

    var url = '';

    if (location.port.length === 0)
        url = 'http://' + location.hostname + '/Reports/' + reportName + 'Run?planId=' + planId + '&comparativePeriod=' + period;
    else
        url = 'http://' + location.hostname + ':' + location.port + '/Reports/' + reportName + 'Run?planId=' + planId + '&comparativePeriod=' + period;

    window.location.replace(url);
}

function runBudgetReport() {
    var index = $('#budgetIndex').val();
    var reportName = $("#ReportName").val();
    var planId = $('#PlanId').val();

    var url = '';

    if (location.port.length === 0)
        url = 'http://' + location.hostname + '/Reports/' + reportName + 'Run?budgetIndex=' + index + '&planId=' + planId;
    else
        url = 'http://' + location.hostname + ':' + location.port + '/Reports/' + reportName + 'Run?budgetIndex=' + index + '&planId=' + planId;

    // $('#waitingDiv').attr('style', 'display: block');

    window.location.replace(url);
}

$(window).load(function () {
    var result = getParameterByName('found');
    if (result == 'false') {
        alert('Sorry, failed to retrieve report. Please try again later.');
    }
});

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(window.location.href);
    if (results == null)
        return "";
    else
        return decodeURIComponent(results[1].replace(/\+/g, " "));
}
