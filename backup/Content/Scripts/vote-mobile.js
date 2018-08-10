function allMotionsValid() {
    var form = $("#votingForm");
    console.log('validating');
    if (form.valid())
        return true;
    else return false;
}

function toggleBody(e, motion) {
    var body = $(motion).parent().next();
    var otherBodies = $('.motion-body');
    otherBodies.each(function () {
        if (($(this).html() !== body.html()) && !$(this).is(':hidden')) {
            $(this).hide();
        }
    });
    if (body) {
        body.toggle({ duration: 250 });
    }
}

function submitVote() {
    if ($("#proxy").is(':checked') && $("#ProxyName").val().trim() == '') {
        $("#ProxyName").css("background-color", "#ffcccc");
        $("#ProxyName").focus();
    } else {
        $('#votingForm').submit()
    }

}