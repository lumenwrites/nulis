const fs = require('fs');
const snoowrap = require('snoowrap');

/* const config = JSON.parse(fs.readFileSync('../config.json','utf8'));*/

const r = new snoowrap({
    userAgent: 'Best /r/WritingPrompts prompts by /u/raymestalez',
    clientId: 'STVPWGT5kl4t7Q',
    clientSecret: 'CLLwhfaHzitTf0dZNcyI20Xfikg',
    username: 'raymestalez',
    password: 'Qwe1s1zxCrdt'
});


export default function get_prompts(fun) {
    r.getSubreddit('WritingPrompts').getNew({limit: 100}).then((newPrompts)=>{
	r.getSubreddit('WritingPrompts').getHot({limit: 50}).then((hotPrompts)=>{
	    var prompts = newPrompts.map((prompt)=>{
		/* Calculate age */
		var now = new Date().getTime();
		var created_at = new Date(prompt.created_utc*1000);
		var age_minutes = (now - created_at) / (1000 * 60);
		var age_hours = Math.round(age_minutes/60 * 10) / 10

		prompt.age = age_hours;
		prompt.num_comments -= 1;

		/* Prompts with >1 upvote, <3 replies, less than 5 hours old */
		if (prompt.score > 1
		    && prompt.num_comments < 3
		    && age_hours < 5
		    && !prompt.title.includes("[OT]")) {

		    prompt.position = 0;
		    /* Search for a prompt in the list of hot prompts,
		       to find out it's position on the front page */
		    hotPrompts.map((hotPrompt,i)=>{
			if (prompt.title == hotPrompt.title) {
			    prompt.position = i-1;
			}
		    });
		    prompt.title = prompt.title.replace("[WP]","").trim();
		    prompt.title = prompt.title.replace("[EU]","").trim();
		    /* Add prompt to the list of prompts */
		    return prompt;
		}
	    });

	    /* Sort by score */
	    prompts.sort((a,b)=>{
		return parseFloat(b.score) - parseFloat(a.score);
	    });

	    /* Return 15 prompts */
	    prompts = prompts.slice(0,10);
	    fun(prompts);
	});
    });	
}

/* 
var prompts = get_prompts((prompts)=>{
    console.log(prompts.length);
    prompts.map((p)=> console.log(p.score));
});
*/
