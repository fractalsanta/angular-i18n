var pageStateHash = '';
var lastQuoteState = 'open';
var lastWorkOrderState = 'open';

function ShowCompletedWorkOrders() {
    var rows = $(".workOrdersTable tbody").find("tr").hide(0);

    $("#showCompletedWorkOrdersLink").css('display', 'none');
    $("#showPendingWorkOrdersLink").css('display', 'block');
    $('#WorkOrdersPageHeader').text('Closed Work Orders');

    $(".workOrdersTable .open").hide(0);
    $(".workOrdersTable .closed").show(0);

    if ($(".workOrdersTable .closed").length > 0) {
        $(".workOrdersTable .hiddenRow").hide(0);
    }
    else {
        $(".workOrdersTable .hiddenRow").show(0);
    }

    pageStateHash = 'woClosed';
    lastWorkOrderState = 'closed';
}
function ShowPendingWorkOrders() {
    var rows = $(".workOrdersTable tbody").find("tr").show(0);

    $("#showCompletedWorkOrdersLink").css('display', 'block');
    $("#showPendingWorkOrdersLink").css('display', 'none');
    $('#WorkOrdersPageHeader').text('Open Work Orders');

    $(".workOrdersTable .closed").hide(0);
    $(".workOrdersTable .open").show(0);

    if ($(".workOrdersTable .open").length > 0) {
        $(".workOrdersTable .hiddenRow").hide(0);
    }
    else {
        $(".workOrdersTable .hiddenRow").show(0);
    }

    pageStateHash = 'woOpen';
    lastWorkOrderState = 'open';
}
function ShowCompletedQuotes() {
    var rows = $(".quotesTable tbody").find("tr").hide(0);

    $("#showCompletedQuotesLink").css('display', 'none');
    $("#showPendingQuotesLink").css('display', 'block');
    $('#QuotesPageHeader').text('Closed Quotes');

    $(".quotesTable .open").hide(0);
    $(".quotesTable .closed").show(0);

    if ($(".quotesTable .closed").length > 0) {
        $(".quotesTable .hiddenRow").hide(0);
    }
    else {
        $(".quotesTable .hiddenRow").show(0);
    }

    pageStateHash = 'quClosed';
    lastQuoteState = 'closed';
}
function ShowPendingQuotes() {
    var rows = $(".quotesTable tbody").find("tr").show(0);

    $("#showCompletedQuotesLink").css('display', 'block');
    $("#showPendingQuotesLink").css('display', 'none');
    $('#QuotesPageHeader').text('Open Quotes');

    $(".quotesTable .closed").hide(0);
    $(".quotesTable .open").show(0);

    if ($(".quotesTable .open").length > 0) {
        $(".quotesTable .hiddenRow").hide(0);
    }
    else {
        $(".quotesTable .hiddenRow").show(0);
    }

    pageStateHash = 'quOpen';
    lastQuoteState = 'open';
}
function ShowWorkOrders() {
    $("#showWorkOrdersLink").hide(0);
    $("#showQuotesLink").show(0);

    $("#quotesDiv").hide(0);
    $("#workOrdersDiv").show(0);

    $("#pageHeader").text("Work Orders");

    if (pageStateHash == 'woOpen' || pageStateHash == 'woClosed') {
        if (lastQuoteState == 'closed')
            pageStateHash = 'quClosed';
        else
            pageStateHash = 'quOpen';
    }
}
function ShowQuotes() {
    $("#showQuotesLink").hide(0);
    $("#showWorkOrdersLink").show(0);

    $("#workOrdersDiv").hide(0);
    $("#quotesDiv").show(0);

    $("#pageHeader").text("Quotes");

    if (pageStateHash == 'woOpen' || pageStateHash == 'woClosed') {
        if(lastQuoteState == 'closed')
            pageStateHash = 'quClosed';
        else
            pageStateHash = 'quOpen';
    }
}