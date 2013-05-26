function title_case(str){
    return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}

// *********************
// Calculate Differences
// *********************

var date_format = "MM/DD/YYYY"

// Convert into moments
timeline.start_moment = moment(timeline.start, date_format);
timeline.end_moment = moment(timeline.end, date_format);
timeline.now_moment = moment();

// Calculate diffs
timeline.total_days = timeline.end_moment.diff(timeline.start_moment, "days", true);
timeline.days_left = timeline.end_moment.diff(timeline.now_moment, "days", true);
timeline.days_complete = timeline.now_moment.diff(timeline.start_moment, "days", true);

// Process all the dates
for (var i = 0; i < timeline.events.length; i++){
    timeline.events[i].date_moment = moment(timeline.events[i].date, date_format);
    timeline.events[i].days_until = timeline.events[i].date_moment.diff(timeline.now_moment, "days", true);
}

// ******
// Render
// ******

$(document).ready(function (){
    // Basics 
    $("#counting-until").html(timeline.counting);
    var progress_bar_percent = (timeline.days_complete / timeline.total_days) * 100;
    $('#progress-bar-fill').css('width', progress_bar_percent + "%");
    $('#top-counter').html(title_case(moment.duration(timeline.days_left, "days").humanize()));
    $('#bottom-counter').html(Math.ceil(moment.duration(timeline.days_left, "days").asDays()));

    // Events
    var alternate = false;

    for (var i = 0; i < timeline.events.length; i++){
        // Do all the math that is left
        var days_until_from_start = timeline.events[i].date_moment.diff(timeline.start_moment, "days", true);
        var percent = (days_until_from_start / timeline.total_days) * 100;
        var title = timeline.events[i].title + ' - ' + timeline.events[i].date_moment.format("MMMM Do") + " (" + moment.duration(timeline.events[i].days_until, "days").humanize(true) + ")"; 

        // Render the event
        $('<div class="event"></div>')
            .html('<img src="img/icons/' + timeline.events[i].icon + '" alt="' +  title + '" title="' + title + '" />')
            .css('left', percent + '%')
            .addClass((alternate ? 'type-a' : 'type-b'))
            .appendTo('#progress-bar');

        // flip 
        alternate = !alternate;
    }
});