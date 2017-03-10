# CS122: Course Search Engine Part 1
#
# Shen Han
#

import re
import util
import bs4
import queue
import json
import sys
import csv

INDEX_IGNORE = set(['a',  'also',  'an',  'and',  'are', 'as',  'at',  'be',
                    'but',  'by',  'course',  'for',  'from',  'how', 'i',
                    'ii',  'iii',  'in',  'include',  'is',  'not',  'of',
                    'on',  'or',  's',  'sequence',  'so',  'social',  'students',
                    'such',  'that',  'the',  'their',  'this',  'through',  'to',
                    'topics',  'units', 'we', 'were', 'which', 'will', 'with', 'yet'])


def read_course_map(course_map_filename):
    '''
    Read course_map and returns it to a dictionary.
    '''

    course_map_json = open(course_map_filename, 'r').read()
    return json.loads(course_map_json)


def build_index(soup, INDEX_IGNORE, cmap_dict, index_dict):
    '''
    Build index from a soup.

    Inputs:
        soup: a soup object
        INDEX_IGNORE: set
        cmap_dict: dict, course id dictionary
        index_dict: dict

    Return:
        index_dict: dict, words as keys, set of course id's as values
    '''
    
    c_tags = soup.find_all('div', class_= re.compile(r'courseblock.+'))

    for c_tag in c_tags:
        title_desc_ls = c_tag.find_all('p', class_=re.compile(
                                             r'courseblock(title|desc)'))

        title_str = title_desc_ls[0].text
        course_code_ls = re.findall(r'(^[A-Z]{4}|(?:[1-9]\d{4}))', title_str)

        c_code_ls = []
        for code in course_code_ls[1:]:
            c_code_ls.append(course_code_ls[0] + ' ' + code)

        c_id_ls = []
        for c_code in c_code_ls:
                c_id_ls.append(cmap_dict[c_code])

        all_str = title_str + ' ' + title_desc_ls[1].text

        all_word_set = set([word.lower() for word in re.findall(
                           r'([a-zA-Z][a-zA-Z0-9]*)', all_str) 
                           if word.lower() not in INDEX_IGNORE])

        for word in all_word_set:
            for c_id in c_id_ls:
                if word in index_dict:
                    index_dict[word].add(c_id)
                else:
                    index_dict[word] = set([c_id])

    return index_dict


def write_csv(index_dict, index_filename):
    '''
    Write the data into csv file with certain format.

    Inputs:
        index_dict: dict
        index_filename: str, the filename of csv
    '''

    index_key_ls = sorted(list(index_dict.keys()))
    
    with open(index_filename, 'w', newline='') as csvfile:
        writer = csv.writer(csvfile)
        for word in index_key_ls:
            for c_id in index_dict[word]:
                writer.writerow([str(c_id) + '|' + word])


def go(num_pages_to_crawl, course_map_filename, index_filename):
    '''
    Crawl the college catalog and generates a CSV file with an index.

    Inputs:
        num_pages_to_crawl: the number of pages to process during the crawl
        course_map_filename: the name of a JSON file that contains the mapping
          course codes to course identifiers
        index_filename: the name for the CSV of the index.

    Outputs: 
        CSV file of the index index.
    '''

    starting_url = "http://www.classes.cs.uchicago.edu/archive/2015/winter/12200-1/new.collegecatalog.uchicago.edu/index.html"
    limiting_domain = "classes.cs.uchicago.edu"

    visit_count, index_dict, visited_ls, queue_ls = 0, {}, [], [starting_url]

    cmap_dict = read_course_map(course_map_filename)

    while queue_ls and visit_count < num_pages_to_crawl:

        url_current = queue_ls.pop(0)

        request = util.get_request(url_current)

        if request != None:
            # Check for redirecting
            url_current = util.get_request_url(request)

            visited_ls.append(url_current)

            html_str = util.read_request(request)
            soup = bs4.BeautifulSoup(html_str, 'html5lib')
            anchor_tags = soup.find_all('a')

            for anchor_tag in anchor_tags:

                if anchor_tag.has_attr('href'):
                    href_str = util.remove_fragment(anchor_tag['href'])
                    href_str = util.convert_if_relative_url(url_current, 
                                                            href_str)

                    if href_str != None:
                        if util.is_url_ok_to_follow(href_str, limiting_domain)\
                           and href_str not in visited_ls \
                           and href_str not in queue_ls:

                            queue_ls.append(href_str)

            index_dict = build_index(soup, INDEX_IGNORE, cmap_dict, index_dict)

        visit_count = len(visited_ls)

    write_csv(index_dict, index_filename)


if __name__ == "__main__":
    usage = "python3 crawl.py <number of pages to crawl>"
    args_len = len(sys.argv)
    course_map_filename = "course_map.json"
    index_filename = "catalog_index.csv"
    if args_len == 1:
        num_pages_to_crawl = 1000
    elif args_len == 2:
        try:
            num_pages_to_crawl = int(sys.argv[1])
        except ValueError:
            print(usage)
            sys.exit(0)
    else:
        print(usage)    
        sys.exit(0)


    go(num_pages_to_crawl, course_map_filename, index_filename)



