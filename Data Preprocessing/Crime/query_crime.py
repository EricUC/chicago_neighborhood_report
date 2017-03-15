# Functions used for query Chicago's previous year crime data.
#
# Han-Ji-Ji

from math import radians, cos, sin, asin, sqrt, pi
import sqlite3
import geocode_copy

CHICAGO_CITY_AREA = 234 # square miles
JIYE_KEY = 'AIzaSyCsFC0S-FSVg75hXh-GaATcjkN8uG_zkdM' # 嘘


def query_crime_within(address, radius = 0.25):
    '''
    Given an address string, Query crime cases within radius.

    Input:
        address: (str) e.g. "1405 E Hyde Park Blvd. Chicago, IL"
        radius: (float) optional parameter; unit is mile; default is 0.25.

    Return:
        crime_count: (dict) keys shown below.
    '''
    crime_count = {'area total': 0,
                    'city total average': 0,
                    'area residential': 0,
                    'area property': 0,
                    'area violence': 0,
                    'city residential average': 0,
                    'city violence average': 0,
                    'city property average': 0
                    }

    lat, lng = geocode_copy.get_latlng(address, JIYE_KEY)
    #print(lng, lat)
    conn = sqlite3.connect('mar4.db')
    c = conn.cursor()

    conn.create_function('haversine', 4, haversine)

    query_str = 'SELECT DISTINCT case_id, haversine(?, ?, crime.lng, crime.lat) AS dist FROM crime WHERE dist < ?'
    arg_tuple = (lng, lat, radius)
    c.execute(query_str, arg_tuple)
    result = c.fetchall()

    area_count = len(result)
    crime_count['area total'] = area_count

    #header_ls = get_header(c)
    query_city_crime = 'SELECT DISTINCT case_id FROM crime;'
    c.execute(query_city_crime)
    total_crime = c.fetchall()
    total_crime_count = len(total_crime)

    query_area = (radius ** 2) * pi
    city_avg = total_crime_count / (CHICAGO_CITY_AREA / query_area)

    crime_count['city total average'] = int(city_avg)

    # Three crime types:
    RESIDENTIAL = 1
    VIOLENCE = 2
    PROPERTY = 3

    query_city_residential = 'SELECT DISTINCT case_id FROM crime WHERE crime_type = 1;'
    query_city_violence = 'SELECT DISTINCT case_id FROM crime WHERE crime_type = 2;'
    query_city_property = 'SELECT DISTINCT case_id FROM crime WHERE crime_type = 3;'

    c.execute(query_city_residential)
    crime_count['city residential average'] = int(len(c.fetchall()) / (CHICAGO_CITY_AREA / query_area))
    c.execute(query_city_violence)
    crime_count['city violence average'] = int(len(c.fetchall()) / (CHICAGO_CITY_AREA / query_area))
    c.execute(query_city_property)
    crime_count['city property average'] = int(len(c.fetchall()) / (CHICAGO_CITY_AREA / query_area))

    query_area_residential = 'SELECT DISTINCT case_id, haversine(?, ?, crime.lng, crime.lat) AS dist FROM crime WHERE dist < ? AND crime_type = 1;'
    #args_area_residential = (lng, lat, radius)
    c.execute(query_area_residential, arg_tuple)
    crime_count['area residential'] = len(c.fetchall())

    query_area_violence = 'SELECT DISTINCT case_id, haversine(?, ?, crime.lng, crime.lat) AS dist FROM crime WHERE dist < ? AND crime_type = 2;'
    #args_area_violence = (lng, lat, radius)
    c.execute(query_area_violence, arg_tuple)
    crime_count['area violence'] = len(c.fetchall())


    query_area_property = 'SELECT DISTINCT case_id, haversine(?, ?, crime.lng, crime.lat) AS dist FROM crime WHERE dist < ? AND crime_type = 3;'
    #args_area_residential = (lng, lat, radius)
    c.execute(query_area_property, arg_tuple)
    crime_count['area property'] = len(c.fetchall())

    conn.close()

    return (crime_count)


### auxiliary functions

def haversine(lon1, lat1, lon2, lat2):
    '''
    Calculate the circle distance between two points
    on the earth (specified in decimal degrees)
    '''
    # convert decimal degrees to radians
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    # haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))

    # 6367 km is the radius of the Earth
    km = 6367 * c
    m = km * 1000
    return km


def get_header(cursor):
    '''
    Given a cursor object, returns the appropriate header (column names)
    '''
    desc = cursor.description
    header = ()

    for i in desc:
        header = header + (clean_header(i[0]),)

    return list(header)


def clean_header(s):
    '''
    Removes table name from header
    '''
    for i in range(len(s)):
        if s[i] == ".":
            s = s[i+1:]
            break

    return s




address = '1001 S. South State Street, Chicago, IL 60615'

test = query_crime_within(address)
