#!/usr/bin/env python3
# -*- coding: utf-8 -*-


import json
from django.core.management.base import BaseCommand, CommandError
from city import views
from city.views import query_crime
from city.service.Noise import crawl_noise
import redis
import datetime

def time_str():
    return datetime.datetime.now().strftime('%Y-%m-%d %H:%M:%S')


class Command(BaseCommand):
    help = """
        connect the redis
        read the data
        call they service
        return the data to redis
    """
    def handle(self, *args, **option):
        while True:
            redis_client = redis.StrictRedis()
            key, value = redis_client.blpop('task')
            # the value should look like this:
            """
            {
                'type': 'crime_result',
                'params': {
                    'address': 'string',
                    'radius': int,
                },
                'return_key': 'ewjfksdfjreith',
            }
            """
            data = json.loads(value.decode('utf-8'))
            if data['type'] == 'crime_result':
                print('get task crime_result %s' % time_str())
                crime_result = query_crime.query_crime_within(address=data['params']['address'], radius=data['params']['radius'])
                redis_client.rpush(data['return_key'], json.dumps(crime_result))
                print('task crime_result done %s' % time_str())
            if data['type'] == 'noise_int':
                print('get task noise_int %s' % time_str())
                noise_int = crawl_noise.crawl_noise_all(data['params']['address'])
                redis_client.rpush(data['return_key'], json.dumps(noise_int))
                print('task noise_int done %s' % time_str())
            if data['type'] == 'life_result':
                print('get task life_result %s' % time_str())
                life_result = views.get_life_result(data['params']['address'], data['params']['radius'])
                redis_client.rpush(data['return_key'], json.dumps(life_result))
                print('task life_result done %s' % time_str())
            # the code below will cause the system to wait the key foreve when the city count is larger than the process running python3 manage.py handletask
            # if data['type'] == 'city_info':
            #     keys = []
            #     print('get task city info %s' % time_str())
            #     location = data['params']['address']
            #     radius = data['params']['radius']
            #     # create the task
            #     print('create the crime task %s' % time_str())
            #     crime_result_key = views.get_crime_result_lazy(location, radius)
            #     print('create the noise task %s' % time_str())
            #     noise_int_key = views.get_noise_int_lazy(location)

            #     # get the crime result
            #     print('get the crime result %s' % time_str())
            #     result_data = redis_client.blpop(crime_result_key)[1].decode('utf-8')
            #     city_info = json.loads(result_data)
            #     print('get the noise result %s' % time_str())
            #     noise_int = int(redis_client.blpop(noise_int_key)[1].decode('utf-8'))
            #     city_info['noise'] = noise_int

            #     # city_info = views.get_city_info(location=data['params']['address'], radius=data['params']['radius'])
            #     redis_client.rpush(data['return_key'], json.dumps(city_info))
            #     print('task city info done %s' % time_str())
