import redis
from django.shortcuts import render
import json
import uuid
import redis
import datetime

from .service.Crime import query_crime
from .service import geocode
from .service.Noise import crawl_noise
from django.http import JsonResponse

# Create your views here.

key = 'AIzaSyClpUpgzuNThH2Bsvuw7uKv2H6MQOU_tUg'
address = '5455 S blackstone ave'

def time_str():
    return datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')

class LazyData(object):
    """ give me a key, return you the value"""
    def __init__(self, key):
        self.key = key


def index(request):
    return render(request, 'city/index.html', {})


def get_city_info(location, radius):
    # the old view is too slow
    # crime_result = query_crime.query_crime_within(address=location, radius=radius)

    # # get the noise information from crawl_noise api
    # noise_int = crawl_noise.crawl_noise(location)

    # # get the life information from 
    # life_result = {}
    # life_result = get_life_result(location, radius)

    # # collect the result
    # result = {}
    # # result['crimes'] = crimes
    # result['noise'] = noise_int
    # result['life_result'] = life_result
    # result.update(crime_result)
    # return result
    redis_client = redis.StrictRedis()
    keys = []
    print('get task city info %s' % time_str())
    # create the task
    print('create the crime task %s' % time_str())
    crime_result_key = get_crime_result_lazy(location, radius)
    print('create the noise task %s' % time_str())
    noise_int_key = get_noise_int_lazy(location)
    print('create the life_result task %s' % time_str())
    life_result_key = get_life_result_lazy(location, radius)

    # get the crime result
    print('get the crime result %s' % time_str())
    result_data = redis_client.blpop(crime_result_key)[1].decode('utf-8')
    city_info = json.loads(result_data)
    print('get the noise result %s' % time_str())
    noise_int = int(redis_client.blpop(noise_int_key)[1].decode('utf-8'))
    city_info['noise'] = noise_int
    print('get the life_result %s' % time_str())
    life_result = json.loads(redis_client.blpop(life_result_key)[1].decode('utf-8'))
    city_info['life_result'] = life_result
    return city_info


def get_life_result(location, radius):
    life_result = {}
    for type in ["transport", "restaurant", "shop"]:
        life_result[type] = geocode.count_places(location, key, radius * 1609, type)
    return life_result

def get_life_result_lazy(location, radius):
    r = redis.StrictRedis()
    key = uuid.uuid4().hex
    data = {
        'type': 'life_result',
        'params': {
            'address': location,
            'radius': radius,
        },
        'return_key': key,
    }
    r.rpush('task', json.dumps(data))
    return key
    
def get_city_info_lazy(location, radius):
    """
    given the location and radius, return a redis key as soon as possible
    you can get the result in redis after a period of time
    """
    r = redis.StrictRedis()
    key = uuid.uuid4().hex
    data = {
        'type': 'city_info',
        'params': {
            'address': location,
            'radius': radius,
        },
        'return_key': key,
    }
    r.rpush('task', json.dumps(data))
    return key

def get_crime_result_lazy(location, radius):
    """
    given the location and radius, return a redis key as soon as possible
    you can get the result in redis after a period of time
    """
    r = redis.StrictRedis()
    key = uuid.uuid4().hex
    data = {
        'type': 'crime_result',
        'params': {
            'address': location,
            'radius': radius,
        },
        'return_key': key,
    }
    r.rpush('task', json.dumps(data))
    return key

def get_noise_int_lazy(location):
    """
    given the location, return a redis key as soon as possible
    you can get the result in redis after a perioid of time
    """
    r = redis.StrictRedis()
    key = uuid.uuid4().hex
    data = {
        'type': 'noise_int',
        'params': {
            'address': location,
        },
        'return_key': key,
    }
    r.rpush('task', json.dumps(data))
    return key


def safetyview(request):
    """ get the safety info of a location """
    location = request.GET['location']
    radius = float(request.GET['radius'])

    # get the longitude and latitude from google api
    # longitude, latitude = geocode.get_latlng(location, key)

    # get the crime information from query_crime api
    # crimes = query_crime.query_crime_within(longitude, latitude, radius)[1]

    r = redis.StrictRedis()
    result = get_city_info(location, radius)
    return JsonResponse(result)


def rankview(request):
    print(request.body.decode('utf8'))
    data = json.loads(request.body.decode('utf8'))
    locations = data['locations']
    radius = float(data['radius'])
    results = []
    for location in locations:
        results.append(get_city_info(location, radius))
    response = {
        'results': results,
    }
    return JsonResponse(response)
