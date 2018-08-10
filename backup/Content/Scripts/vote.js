$(document).ready(function () {
    $('#submit-votes-button').removeAttr('disabled');

    if (!allMotionsValid()) {
        $('#submit-votes-button').attr('disabled', 'disabled');
    }

    $('#submit-votes-button').off().on('click', function () {
        //alert('Submit');
    });
    $('.vote-options').on('change', function () {
        if (!allMotionsValid()) {
            $('#submit-votes-button').attr('disabled', 'disabled');
        } else {
            $('#submit-votes-button').removeAttr('disabled');
        }
    });

    $('input:radio[name="voter-type"]').change(
    function () {
        if ($(this).is(':checked')) {
            if($(this).is('#proxy')) $('#ProxyName').attr('disabled', false).focus();
        else $('#ProxyName').attr('disabled', true)
            $("#grid-item-proxy .confirm-inner").toggleClass("inactive");
            $("#grid-item-owner .confirm-inner").toggleClass("inactive");
            $("#grid-item-proxy").toggleClass("highlighted");
            $("#grid-item-owner").toggleClass("highlighted");
        }
    });
    
    });


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

function allMotionsValid() {
    var votes = $('.vote-options').toArray();
    if (votes.length === 0) {
        return false;
    }
    return votes.every(function (vote) {
        return $(vote).val() !== '';
    });
}

function submitVote() {
    if ($("#proxy").is(':checked') && $("#ProxyName").val().trim() == '') {
        $("#ProxyName").css("background-color", "#ffcccc");
        $("#ProxyName").focus();
    } else {
        $('#votingForm').submit()
    }

}