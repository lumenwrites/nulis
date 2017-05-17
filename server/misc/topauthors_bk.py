import os, sys
import json
import pickle
import praw
from praw.models import Comment, User
from datetime import datetime 
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


# Convert timestamp to age
def age(timestamp):
    dt1 = datetime.fromtimestamp(timestamp)
    dt2 = datetime.now()
    rd = relativedelta(dt2, dt1)
    age =  "%d days, %d hours" % (rd.days, rd.hours)
    return age

# Execute a function, retry if fails, and save results into a file
@retry(stop_max_attempt_number=10)
def cache(function, argument_dict, filename, refetch=False):
    if os.path.isfile(filename) and not refetch:
        # If there's a file, and I'm not telling it to refetch, I just read from file
        print("Reading from file " + filename)
        with open (filename, 'rb') as fp:
            results = pickle.load(fp)
        return results
    else:
        # On the first run, or if I want to refetch - execute the passed function
        # And save results into a file
        print("Refetched, writing to file " + filename)            
        results = function(**argument_dict)
        with open(filename, 'wb') as fp:
            pickle.dump(results, fp)
        return results


        
# Grab top posts
def fetch_top_posts(limit=10, time_filter='week'):
    top_posts=list(r.subreddit('writingprompts').top(time_filter=time_filter, limit=limit))
    return top_posts


# Get comments from the top posts, and sort them
def fetch_top_comments(top_posts, limit=2500):
    all_comments = []
    number_of_posts = len(top_posts)
    for index, post in enumerate(top_posts):
        # Looping through posts, taking their comments, adding them all into one list
        real_comments = [c for c in post.comments if isinstance(c, Comment)]
        all_comments += real_comments
        print("Added comments from post: " + str(index) + "/" + str(number_of_posts))

    # Sort comments by score
    sorted_comments = sorted(all_comments, key=lambda x: x.score, reverse=True)
    print("Comments sorted!")

    return sorted_comments

# Put authors of all comments into one list
def extract_authors(comments):
    all_authors = []
    number_of_comments = len(comments)
    for index, comment in enumerate(comments):
        author = comment.author
        # Add author to the list if he's not there yet
        if author and not author in all_authors:
            print("Added to authors: " + author.name)
            print(str(index) + "/" + str(number_of_comments))
            all_authors.append(author)

    print("Authors extracted!")
    return all_authors


def is_in_list(word, filename):
    try:
        with open(filename, 'r') as f:
            if (str(word) in [x.strip() for x in f.readlines()]):
                print(word + " already in the list!")
                return 1
            else:
                print(word + " not in the list!")
                return 0
    except IOError as e:
        # catch non-existing file
        if e.errno == 2:
            return 0

def add_to_list(word, filename):
    if not is_in_list(word, filename):
        with open(filename, 'a') as f:
            f.write(str(word))
            f.write('\n')        

# @retry(stop_max_attempt_number=10)
def calculate_karma(author, time_filter='week', limit=1000):
    if (time_filter=='week'):
        filename = 'processed_authors_week.pkl'
    else:
        filename = 'processed_authors_all.pkl'
    if (time_filter=='week'):
        namesfile = 'processed_authors_names_week.db'
    else:
        namesfile = 'processed_authors_names_all.db'        

    # Create cache file if it doesn't exist
    if not os.path.isfile(filename):
        print("Creating processed_authors file")
        processed_authors = []
        with open(filename, 'wb') as fp:
            pickle.dump(processed_authors, fp)

    # Open already processed authors
    with open (filename, 'rb') as fp:
        processed_authors = pickle.load(fp)

    # If author is not among the processed authors - calculate his karma/stories
    if not is_in_list(author.name, namesfile):
        author.wpscore = 0
        author.beststories = []
        # Combine stories score, collect the best stories.
        comments = author.comments.top(time_filter=time_filter, limit=limit)
        for comment in comments:
            if comment.subreddit.display_name == "WritingPrompts" and comment.is_root:
                author.wpscore += comment.score
                author.beststories.append(comment)

        # Append author to the list and save the file
        processed_authors.append(author)
        with open(filename, 'wb') as fp:
            pickle.dump(processed_authors, fp)
        print(author.name + " processed, returning.")
        add_to_list(author.name, namesfile)
        return author
    else:
        print(author.name + " has been processed before, reading from file and returning.")
        # If author has already been processed - find him and return him
        for processed_author in processed_authors:
            if author.name == processed_author.name:
                return processed_author


def process_authors(authors, time_filter='week'):
    authors = authors[:800]
    numberofauthors = len(authors)
    for index, author in enumerate(authors):
        try:
            processed_author = calculate_karma(author, time_filter)
            print("/r/WPs karma calculated: " + processed_author.name + " - " + str(processed_author.wpscore))
            print(str(index) + "/" + str(numberofauthors))
        except:
            pass

    print("All karma calculated.")

def sort_authors(authors, time_filter='week', reprocess=False):
    # Calculate combined karma from all stories and sort by it
    # And attach a list of user's best stories
    # Here, limit is the number of user's comments to calculate karma from

    if reprocess:
        # Loop through all authors, calculate stories/karma, write into a file
        process_authors(authors, time_filter)

    authorsdata = []
    # Open already processed authors
    if (time_filter=='week'):
            filename = 'processed_authors_week.pkl'
    else:
        filename = 'processed_authors_all.pkl'
    with open (filename, 'rb') as fp:
        print("Loading processed authors")
        authorsdata = pickle.load(fp)

    print("Total authors: " + str(len(authorsdata)))
    print("Last author's karma " + str(authorsdata[-1].wpkarma))
    # Sort authors by their /r/WritingPrompts karma
    sorted_authors = sorted(authorsdata, key=lambda x: x.wpscore, reverse=True)
    sorted_authors = sorted_authors[:100]
    print("Authors sorted!")
    
    return sorted_authors

def authors_to_json(sorted_authors, filename):
    authors_list = []

    for index, author in  enumerate(sorted_authors):
        # print("Author " + author.name)
        author_dict = {}
        author_dict['username'] = author.name
        author_dict['karma'] = author.wpscore

        author_dict['beststories'] = []
        for index, story in enumerate(author.beststories[:5]):
            # print("Story score " + str(story.score))
            story_dict = {}
            story_dict['url'] = story.link_url + story.id
            story_dict['prompt'] = story.link_title.replace('[WP]', '')
            # Append story to author's stories
            author_dict['beststories'].append(story_dict)
        # Append author to author's list
        authors_list.append(author_dict)
    # Generate json out of author's list
    authors_json = json.dumps(authors_list)
    print("JSON generated for " + str(len(authors_list)))
    with open(filename, "w") as text_file:
        text_file.write(authors_json)


def top_authors_week():
    limit = 1000

    top_posts = cache(
        fetch_top_posts, {'limit': limit, 'time_filter':'week'},
        'top_posts_week.pkl', refetch=False
    )

    # Combine and sort their comments
    sorted_comments = cache(
        fetch_top_comments, {'top_posts':top_posts[:limit]},
        'top_comments_week.pkl', refetch=False
    )
    # Get comment's authors
    all_authors = cache(
        extract_authors, {'comments':sorted_comments},
                        'all_authors_week.pkl', refetch=False
    )
    # Sort them in order of combined story karma
    sorted_authors = cache(
        sort_authors, {'authors':all_authors[:2000],
                       'time_filter':'week',
                       'reprocess':False},
        'sorted_authors_week.pkl', refetch=True
    )

    authors_to_json(sorted_authors, 'top_authors_week.json')

def top_authors_all():
    limit = 1000

    top_posts = cache(
        fetch_top_posts, {'limit': limit, 'time_filter':'all'},
        'top_posts_all.pkl', refetch=False
    )

    # Combine and sort their comments
    sorted_comments = cache(
        fetch_top_comments, {'top_posts':top_posts[:limit]},
        'top_comments_all.pkl', refetch=False
    )
    print("Top comments " + str(len(sorted_comments)))
    # Get comment's authors (considering only 5k top stories ever)
    all_authors = cache(
        extract_authors, {'comments':sorted_comments[:5000]},
                        'all_authors_all.pkl', refetch=False
    )
    print("Top authors " + str(len(all_authors)))
    # Sort them in order of combined story karma (considering only first 1k authors)
    sorted_authors = cache(
        sort_authors, {'authors':all_authors[:5000],
                       'time_filter':'all',
                       'reprocess':True},
        'sorted_authors_all.pkl', refetch=True
    )

    authors_to_json(sorted_authors, 'top_authors_all.json')


# Doing stuff
r = connect()
subreddit = r.subreddit('writingprompts')
top_authors_week()
# top_authors_all()

# sorted_authors = calculate_karma(authors)
# write_authors_to_file(sorted_authors)            
# user = r.redditor('raymestalez')
# prompts = list(subreddit.top(time_filter='week', limit=10))
# prompt = prompts[0]
# print(age(prompt.created_utc))



