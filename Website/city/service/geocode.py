# CS122 Project
#
# Team: Han-Ji-Ji
#
# Some helper functions

import sqlite3
import os
import time
import googlemaps
import time
from datetime import datetime
from math import radians, cos, sin, asin, sqrt

DATA_DIR = os.path.dirname("../Data/geo.db")
DATABASE_FILENAME = "geo.db"
#DATABASE_FILENAME = "crime_info.db"
address = '5455 S blackstone ave'
key = 'AIzaSyClpUpgzuNThH2Bsvuw7uKv2H6MQOU_tUg'
radius = 1500

def get_latlng(address, key):
    '''
    given an address string, return its latitude and longtitude.

    Input:
        address (str)
        key: google maps api key

    Return: lat, lon (tuple)
    '''
    gmaps = googlemaps.Client(key=key)
    geocode_result = gmaps.geocode(address)
    lat = geocode_result[0]['geometry']['location']['lat']
    lng = geocode_result[0]['geometry']['location']['lng']

    return (lat, lng)


def local_search(address, key, radius, type):
    '''
    Find the given type of important places in daily life around the range of
    radius around given location.

    Input:
        address: (string) our given location
        key: google maps api key
        radius: (int) distance in meters
        type: (string) kind of places around that location
        # rank_by: (string) Specifies the order in which results are listed.
                Possible values are: prominence (default), distance

    Output:
        rv: (json)requested places in required rank
    '''
    location = get_latlng(address, key)
    gmaps = googlemaps.Client(key)
    rv = googlemaps.places.places_nearby(gmaps, location, radius, type)

    return rv


def count_places(address, key, radius, type):
    '''
    Count the number of specific type of places around requested location.

    Input:
        address: (string) our given location
        key: google maps api key
        radius: (int) distance in meters
        type: (string) kind of places around that location
        rank_by: (string) Specifies the order in which results are listed.
                Possible values are: prominence (default), distance

    Output:
        counts: (int) the number of specific type of places
    '''
    location = get_latlng(address, key)
    gmaps = googlemaps.Client(key)
    counts = 0
    dataframe = googlemaps.places.places_nearby(gmaps, location, radius, type)
    counts += len(dataframe["results"])
    for i in range(4):
        if 'next_page_token' in dataframe:
            time.sleep(2)
            print("next page")
            next_page_token = dataframe['next_page_token']
            try:
                print('next_page_token: %s' % next_page_token[10:30])
            except:
                pass
            time.sleep(2)
            dataframe = googlemaps.places.places_nearby(gmaps, location, page_token=next_page_token)
            counts += len(dataframe['results'])
        else:
            print("no more page")

    return counts


def haversine(lat1, lon1, lat2, lon2):
    '''
    Calculate the circle distance between two points
    on the earth (specified in decimal degrees)
    (adapted from PA 3 haversine function)
    '''
    # convert decimal degrees to radians
    lon1, lat1, lon2, lat2 = map(radians, [lon1, lat1, lon2, lat2])

    # haversine formula
    dlon = lon2 - lon1
    dlat = lat2 - lat1
    a = sin(dlat/2)**2 + cos(lat1) * cos(lat2) * sin(dlon/2)**2
    c = 2 * asin(sqrt(a))
    #print(c)

    # 6367 km is the radius of the Earth
    km = 6367 * c
    m = km * 1000
    return m


if __name__ == '__main__':
    n = count_places(address, key, radius, 'food')
    print(n)
