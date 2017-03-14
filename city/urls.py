#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from django.conf.urls import url
from . import views


urlpatterns = [
    url(r'^$', views.index, name='index'),
    url(r'^safety/$', views.safetyview, name='safety'),
    url(r'^rank/$', views.rankview, name='safety'),
    url(r'^test/$', views.test, name = 'test'),
    url(r'^base/$', views.base, name = 'base'),
    url(r'^FAQs/$', views.FAQs, name = 'FAQs'),
    url(r'^contact/$', views.contact, name = 'contact'),
]
