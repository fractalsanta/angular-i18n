var voteClosed = false;
$(document).ready(function () {
    $('#submit-votes-button').removeAttr('disabled');    

    if (!allMotionsValid()) {
        $('#submit-votes-button').attr('disabled', 'disabled');
    }

    $('#submit-votes-button').off().on('click', function () {
        $('#vote-declaration-modal').modal();
    });

    $('.vote-options').on('change', function () {
        if (!allMotionsValid()) {
            $('#submit-votes-button').attr('disabled', 'disabled');
        } else {
            $('#submit-votes-button').removeAttr('disabled');
        }
    });

    $('input:radio[name="declaration-rb"]').change(
        function () {
            $("#proxy-name").css("background-color", "");
            if ($(this).is(':checked')) {
                if ($(this).is('#proxy')) $('#proxy-name').attr('disabled', false).focus();
                else $('#ProxyName').attr('disabled', true)

                $("#grid-item-proxy .confirm-inner").toggleClass("inactive");
                $("#grid-item-owner .confirm-inner").toggleClass("inactive");
                $("#grid-item-proxy").toggleClass("highlighted");
                $("#grid-item-owner").toggleClass("highlighted");
            }
        });

    $('#voting-form').off().on('submit', function (event) {
        if ($("#proxy").is(':checked') && $("#proxy-name").val().trim() == '') {
            $("#proxy-name").css("background-color", "#ffcccc");
            $("#proxy-name").focus();
            event.preventDefault();
        }
        else {
            $('#DeclarationBy').val($('input[name="declaration-rb"]:checked').val());
            $('#ProxyName').val($('#proxy-name').val());
            $.modal.close();
        }
    });

    $('#vote-guidelines-modal').on('modal:after-close', function (event, modal) {
        $('#vote-closing-warning').hide();
    });
    $('#vote-guidelines-modal').modal();
});
function toggleBody(e, motion) {
    var body = $(motion).parent().next();
    var otherBodies = $('.motion-body');
    otherBodies.each(function () {
        if (($(this).html() !== body.html()) && !$(this).is(':hidden')) {
            var resetState = $(this).parent().find('.motion-state');
            $(this).hide();
            resetState.html('<img src="/Content/Images/arrow-down.png" />');
        }
    });
    if (body) {        
        var state = $(motion).parent().find('.motion-state');
        var isCollapsed = body.is(':hidden');
        state.html(isCollapsed ? '<img src="/Content/Images/arrow-up.png" />' : '<img src="/Content/Images/arrow-down.png" />');
        body.toggle({ duration: 250 });
    }
}

function allMotionsValid() {
    var votes = $('.vote-options').toArray();
    if ((votes.length === 0) || voteClosed) {
        return false;
    }
    return votes.every(function (vote) {
        return $(vote).val() !== '';
    });
}

function submitVote() {
    $('#voting-form').trigger('submit');
}
function cancelVote() {
    $.modal.close();
}

function displayCountdown(date, el, buttonEl) {
    el.countdown(date, function (event) {
        $(this).html(event.strftime(''
            + '<span>%D</span> days '
            + '<span>%H</span> hr '
            + '<span>%M</span> min'));
    }).on('finish.countdown', function (event) {
        voteClosed = true;
        $('#vote-closing-warning').hide();
        $('#vote-closed-warning').show();
        $('#time-warning-modal').modal();
        buttonEl.attr('disabled', 'disabled');
    });
}
function checkVotingStatus(currentDate, cutoffDate) {
    var minsLeft = Math.floor(Math.abs(currentDate - cutoffDate) / 1000 / 60);

    $('#vote-closing-warning').hide();

    if (minsLeft <= 60) {
        $('#vote-closing-warning').show();
        $('#prompt-mins-remaining').html(minsLeft);
    }
}