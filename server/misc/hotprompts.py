import os, sys
import json
import pickle
import praw
from praw.models import Comment, User
from datetime import datetime 
import pytz
from dateutil.relativedelta import relativedelta 
from retrying import retry



# Connect to praw
def connect():
    # Load config
    with open('config.json', 'r') as f:
        config = json.load(f)
    
    r = praw.Reddit(
        client_id = config["client_id"],
        client_secret = config["client_secret"],
        user_agent='Best /r/WritingPrompts authors by /u/raymestalez'
    )
    return r


def age(timestamp):
    created_at = datetime.utcfromtimestamp(timestamp)
    now = datetime.utcnow()
    age_in_minutes = int((now-created_at).total_seconds())/60    
    return age_in_minutes


def get_prompts():
    new_prompts = list(subreddit.new(limit=100))
    hot_prompts = list(subreddit.hot(limit=50))
    prompts = []

    # 5 hours to minutes
    max_age = 5*60
    # less than 5 replies, more than 1 upvote and less than max_age old
    for prompt in new_prompts:
        if (prompt.score > 1) \
           and ((prompt.num_comments-1) < 3) \
           and (age(prompt.created_utc) < max_age) \
           and ("[OT]" not in prompt.title):
                # print("New prompt" + str(prompt.__dict__))
                if prompt.num_comments > 0:
                    prompt.num_comments -= 1 # remove fake reply
                # Prompt age, like 3.5 hours
                prompt.age = round(age(prompt.created_utc)/60,1)
    
                # prompt position
                for index, p in enumerate(hot_prompts):
                    # Find a prompt on the front page
                    if prompt.title == p.title:
                        # prompt.position == index
                        setattr(prompt, "position", index-1)

                prompt.title = prompt.title.replace("[WP]", "", 1).strip()
                prompt.title = prompt.title.replace("[EU]", "", 1).strip()
                prompts.append(prompt)
    
        # sort by score
        prompts.sort(key=lambda p: p.score, reverse=True)
    

        # Save as json
        prompts_list = []
        for prompt in prompts[:10]:
            # print(prompt.title)
            prompt_dict = {}
            prompt_dict['title'] = prompt.title
            prompt_dict['url'] = prompt.url
            try:
                prompt_dict['position'] = prompt.position
            except:
                prompt.position = 0
            prompt_dict['score'] = prompt.score
            prompt_dict['num_comments'] = prompt.num_comments
            prompt_dict['age'] = prompt.age
            prompts_list.append(prompt_dict)
        prompts_json = json.dumps(prompts_list)                    
        with open('hotprompts.json', "w") as text_file:
            text_file.write(prompts_json)
            
    return prompts[:10]



r = connect()
subreddit = r.subreddit('writingprompts')
get_prompts()
