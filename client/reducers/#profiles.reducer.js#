import moment from 'moment';


function calculateStreak(calendar) {
    var currentStreak = 0;
    /* Order days starting with the most recent one  */
    var days = [...calendar];
    days.reverse();
    /* console.log("days " + JSON.stringify(days));*/
    /* Loop through days */
    for (var i = 0; i < days.length; i++) {
	var d = days[i];
	if (d.wordcount > 99) {
	    /* Increment the streak if this habit is completed */
	    currentStreak += 1;
	} else {
	    break;
	};
    };
    console.log("Setting state currentStreak " + currentStreak);
    return currentStreak;
}


function generateCalendar(savedWordcounts) {
    /* This function generates a calendar for the past 10 days,
       and inserts the information from saved wordcounts into it */
    var today = moment();
    var days = [];

    /* Loop through the past several days */
    for (var i = 0; i < 10; i++) {
	var date = today.format('YYYY-MM-DD');
	/* Default wordcount */
	var wordcount = 0;

	/* Search through all the saved wordcounts */
	savedWordcounts.map((c)=>{
	    /* If I found a saved wordcount for today */
	    if (c.date === date) {
		/* I set it's wordcount */
		wordcount = c.wordcount;
	    }
	});

	/* Add day to the list */
	days.push({
	    date: date,
	    wordcount: wordcount,
	})
	/* Previous day */
	today.subtract(1,'days');
    }
    console.log(days);
    /* Return wordcounts in reverse order */
    return days.reverse();
}




var INITIAL_STATE = {
    user: "",
    error: ""
}
export default function(state=INITIAL_STATE, action) {
    switch(action.type) {
	case 'AUTH_USER':
	    var user = action.payload;
	    console.log(user);
	    var fullCalendar = generateCalendar(user.stats.calendar);
	    user.stats.calendar = fullCalendar;
	    user.stats.streak = calculateStreak(fullCalendar);
	    return {...state, user: user, error: "" };
	case 'UNAUTH_USER':
	    return {...state, user: "", error: "" };
	case 'AUTH_ERROR':
	    return {...state, error: action.payload };	    
	case 'ADD_WORD':
	    var calendar = state.user.stats.calendar;
	    calendar = [...calendar];
	    var today = calendar[calendar.length - 1];
	    today.wordcount += 1;
	    
	    return {...state, user: {
		...state.user,
		stats:{
		    ...state.user.stats,
		    calendar: calendar,
		    streak: calculateStreak(calendar)
		}}};	    

    }

    return state;
}
