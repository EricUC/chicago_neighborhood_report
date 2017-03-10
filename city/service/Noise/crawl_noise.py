import requests
import bs4
import urllib.parse


def crawl_noise(address):
    '''
    Input:
        address: str, keywords separated by white spaces

    Return:
        score: int, the SoundScore(TM)
    '''

    address_str = '%20'.join(address.split())
    response = requests.get(
        url='http://howloud.com/howloud_clean/widget-amazon.php',
        params={
            'address': address,
        }
    )

    url = 'http://howloud.com/howloud_clean/widget-amazon.php?address=' +\
          address_str +\
          '&amp;key=ZEnDYAsMxGKdnlGe'

    # html_str = requests.get(url).text.encode('iso-8859-1')

    soup = bs4.BeautifulSoup(response.text, 'html.parser')

    score_tag = soup.find_all('span', style = 'color: #000;')

    assert score_tag, 'Error: search failed'

    score = int(score_tag[0].contents[0])

    return score



# Test examples

address_test = '5455 S blackstone ave'

wrong_url_test = 'http://howloud.com/howloud_clean/widget-amazon.php?address=5455&amp;key=ZEnDYAsMxGKdnlGe'

url_test = 'http://howloud.com/howloud_clean/widget-amazon.php?address=5455%20s%20blackstone%20ave&amp;key=ZEnDYAsMxGKdnlGe'
