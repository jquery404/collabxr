# from scholarly import scholarly

# file_in = open('Input.txt', 'r')
# Lines = file_in.readlines()
# file_out = open("Output.txt", "w")

# count = 0
# for line in Lines:
#     count += 1
#     print("Line{}: {}".format(count, line.strip()))
#     search_query = scholarly.search_pubs(line.strip())
#     response = next(search_query)
#     # print(response['pub_url'], response['bib']['author'])
#     file_out.write("%s\n" % response['pub_url'])
  
# file_out.close()

import requests
# from scholarly import scholarly
import re

def urlify(s):

    # Remove all non-word characters (everything except numbers and letters)
    s = re.sub(r"[^\w\s]", '', s)

    # Replace all runs of whitespace with a single dash
    s = re.sub(r"\s+", '-', s)

    return s


url = 'https://scholar.google.com/scholar'
sstr = "density-based point cloud"
pub_url = "https://scholar.google.com/scholar?oi=gsb95&q="+urlify(sstr)+"&output=gsb&hl=en"
response = requests.get(pub_url)
print(response.text)