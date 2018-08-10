var mode = '';

$(document).ready(function () {
    loadScheduledMeetings();

    let params = (new URL(document.location)).searchParams;

    if (params.has('mode')){
        mode = params.get('mode');
        if (mode === 'closed') {
            $('#vote-close-date').text('Voting has closed');
            $('#vote-closed-date').addClass('voting-closed');
            $('#submit-votes-button').attr('disabled', 'disabled');
        }
    }

    $('input:radio[name="voter-type"]').change(
        function(){
            if ($(this).is(':checked')) {
                    $("#grid-item-proxy").toggleClass("inactive");
                    $("#grid-item-owner").toggleClass("inactive");
                
            } 
        });
    
    // if (mode === ''){
    //     $('#voting-guide-dlg').modal();
    // }
})

function loadScheduledMeetings() {
    var meetings = [
        { 
            index: 1, 
            title: "Minutes of the previous meeting held somewhere else", 
            description: "" 
        },
        { 
            index: 2, 
            title: "Installation of new security gate", 
            description: "The current security gate is unreliable & in need of being replaced" 
        },
        { 
            index: 3, 
            title: "External painting levy fund contributions", 
            description: "Need to institute a levy fund increase in order to cover costs of" +
                " painting the external walls of the complex"
        },
        { 
            index: 4, 
            title: "Policy update to allow tenants with pets", 
            description: "A number of tenants have requested permission to keep pets"
        },
        { 
            index: 5, 
            title: "Obtain quotes to replace all battery operated smoke alarms to hard wired units. This is 100 chars..", 
            description: 
                "Please refer to Addendum #2 in the attachments of the Agenda to this meeting. This is " + 
                "an essential change, so we are voting on whether to start the process of obtaining quotes " + 
                "now or whether we should wait until the new financial year"
        },
        { 
            index: 6, 
            title: "Minutes of the previous meeting held somewhere else", 
            description: "" 
        },
        { 
            index: 7, 
            title: "Installation of new security gate", 
            description: "The current security gate is unreliable & in need of being replaced"
        },
        { 
            index: 8, 
            title: "External painting levy fund contributions", 
            description: "Need to institute a levy fund increase in order to cover costs of" +
                " painting the external walls of the complex"
        },
        { 
            index: 9, 
            title: "Policy update to allow tenants with pets", 
            description: "A number of tenants have requested permission to keep pets"
        },
        { 
            index: 10, 
            title: "Obtain quotes to replace all battery operated smoke alarms to hard wired units", 
            description: 
                "Please refer to Addendum #2 in the attachments of the Agenda to this meeting. This is " + 
                "an essential change, so we are voting on whether to start the process of obtaining quotes " + 
                "now or whether we should wait until the new financial year"
        }
    ];
    var template = $('#agenda-templ').html();
    
    $('#agenda').empty();

    meetings.forEach(function(meeting) {
        var rendered = Mustache.render(template, meeting);
        $('#agenda').append(rendered);
    });
}

function toggleItem(e, item){
    var body = $(item).parent().next();
    var otherBodies = $('.agenda-item-body');

    otherBodies.each(function() {
        if ($(this).html() !== body.html()){
            if (!$(this).is(':hidden')) {
                $(this).hide();
            }
        }
    });

    if (body){
        body.toggle({ duration: 250 });
    }   
}