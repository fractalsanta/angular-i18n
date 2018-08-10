function unloadBodyAndLogout(logOffUrl) {
    $('body').unload();
    location.replace(logOffUrl);
}
function allMotionsValid() {
    var form = $("#motions-form");
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
$(document).on("pageinit", "#mainContentContainer", function (event) {
    console.log('votingpage load')
    $("#motions-form").validate({ errorPlacement: function (error, element) { } });

    if (!allMotionsValid()) {
        $('#submit-votes-button').attr('disabled', 'disabled');
    }

    $('input:radio').on('change', function () {
        if (!allMotionsValid()) {
            $('#submit-votes-button').attr('disabled', 'disabled');
        } else {
            $('#submit-votes-button').removeAttr('disabled');
        }
    });
    $('#submit-votes-button').off().on('click', function () {
        alert('Submit');
    });
});