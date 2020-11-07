 var voteClosed = false;
function unloadBodyAndLogout(logOffUrl) {
    $('body').unload();
    location.replace(logOffUrl);
}
function allMotionsValid() {
    var form = $("#voting-form");
    
    if (form.valid() && !voteClosed)
        return true;
    return false;
}

function toggleBody(e, motion) {
    var body = $(motion).parent().next();
    var otherBodies = $('.agenda-item-body');
    otherBodies.each(function () {
        if (($(this).html() !== body.html()) && !$(this).is(':hidden')) {
            var resetState = $(this).parent().find('.motion-state');
            $(this).hide();
            resetState.html('<img src="/Content/Images/arrow-down.png" />');
        }
    });
    if (body) {
        var state = $(motion).find('.motion-state');
        var isCollapsed = body.is(':hidden');
        state.html(isCollapsed ? '<img src="/Content/Images/arrow-up.png" />' : '<img src="/Content/Images/arrow-down.png" />');
        body.toggle({ duration: 250 });
    }
}

function submitVote() {
    if($("#proxy").is(':checked') && $("#proxy-name").val().trim() == '') {
        $("#proxy-name").css("background-color", "#ffcccc");
        $("#proxy-name").focus();
        return false;
    }
    else {
        $('#DeclarationBy').val($('input[name="declaration-rb"]:checked').val());
        $('#ProxyName').val($('#proxy-name').val());
        $('#popupDeclaration').popup('close');
        $('#voting-form').trigger('submit');
    }
}
function cancelVote() {
    $('#popupDeclaration').popup('close');
}
function initVoteCountdown() {    
    var localSysDate = new Date();    
    var votingCutoffLocal = new Date($('#vote-cutoff-date').val() + ' UTC');
    checkVotingStatus(localSysDate, votingCutoffLocal);
    displayCountdown(votingCutoffLocal, $("#clock"), $("#submit-votes-button"));
}
function displayCountdown(date, el, buttonEl) {
    el.countdown(date, function (event) {
        $(this).html(event.strftime(''
            + '<span>%D</span> days '
            + '<span>%H</span> hr '
            + '<span>%M</span> min'));
    }).on('finish.countdown', function (event) {        
        $('#vote-closing-warning').hide();
        $('#vote-closed-warning').show();
        $('#time-warning-modal').popup('open');
        voteClosed = true;
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

$(document).on("pageshow", "#mainContentContainer", function (event) {
    $('#popupBasic').popup({
        afterclose: function (event, ui) {
            initVoteCountdown();

            if (!allMotionsValid()) {
                $('#submit-votes-button').attr('disabled', 'disabled');
            } else {
                $('#submit-votes-button').removeAttr('disabled');
            }
        }
    });
    $('#submit-votes-button').attr('disabled', 'disabled');
    $('#popupBasic').popup('open');
});
$(document).on("pageinit", "#mainContentContainer", function (event) {
    $("#voting-form").validate({ errorPlacement: function (error, element) { } });

    $('input:radio').on('change', function () {
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

                $("#grid-item-proxy").toggleClass("inactive");
                $("#grid-item-owner").toggleClass("inactive");
                $("#grid-item-proxy").toggleClass("highlighted");
                $("#grid-item-owner").toggleClass("highlighted");
            }
        });
  
    $('#submit-votes-button').off().on('click', function () {
        $('#popupDeclaration').popup({
            afterclose: function (event, ui) {
                $('#submit-votes-button').removeAttr('disabled');
            }
        });
        $('#submit-votes-button').attr('disabled', 'disabled');
        $('#popupDeclaration').popup('open');
    });
    $('#open-guidelines').off().on('click', function () {
        $('#popupBasic').popup({
            afterclose: function (event, ui) {
                $('#submit-votes-button').removeAttr('disabled');
                $('#vote-closing-warning').hide();
            }
        });
        $('#submit-votes-button').attr('disabled', 'disabled');
        $('#popupBasic').popup('open');
    });
    $('#close-guidelines').off().on('click', function () {
        $('#popupBasic').popup('close');
    });
    $('#close-time-warning').off().on('click', function () {
        $('#time-warning-modal').popup('close');
    });
});