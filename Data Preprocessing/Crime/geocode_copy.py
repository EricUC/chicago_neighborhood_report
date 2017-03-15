# CS122 Project
#
# Team: Han-Ji-Ji
#
# Some helper functions

import sqlite3
import os
import googlemaps
from datetime import datetime
from math import radians, cos, sin, asin, sqrt
#from Crime import query_crime

#DATA_DIR = os.path.dirname("../Data/geo.db")
#DATABASE_FILENAME = "geo.db"
#DATABASE_FILENAME = "crime_info.db"

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
    radius = 10000
    location = get_latlng(address, key)
    gmaps = googlemaps.client(key)
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
    dataframe = local_search(address, key, radius, type)
    counts = len(dataframme["results"])

    return counts
