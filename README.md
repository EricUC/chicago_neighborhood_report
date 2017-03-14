# Chicago Neighborhood Brief

## Team: Han-Ji-Ji

### Project introduction

Here you have Chicago Neighborhood Brief, an neighborhood evaluation system that aims to help apartment seekers finalize their rental decision. We  Chicago Neighborhood Brief allows user to define a radius of one address based as the neighborhood, then analyze the safety, convenience, and noise-level of that neighborhood. This system also allows multiple location comparison.

### Data sources

1. Convenience data: Coogle Maps Geocoding API, Google Places API Web Service, Google Maps Distance Matrix API

2. Crime data: City of Chicago Data Portal

3. Noise data: Howloud.com


Crime data is based on the one year crime case dataset from city of Chicago data portal, ranging from last week to a year prior. Convenience rating is based on google maps information, which updates daily. Noise level data is based on a patented service provided by howloud.com. There is no public information available on how current their data is.


### Procedures

1. Data gathering and cleaning from above data source
a. Tools: Python script and corresponding libraries, HTML
b. Subtasks: data cleaning and munging
2. Data storing and joining data from different sources
a. Tools: SQL, perhaps JavaScript
3. Data analysis and query realization
a. Tools: Python, SQL
b. Subtasks: Apartment evaluation model and ordering algorithms based on the data
4. Data visualization
a. Tools: Map API, Python, SQL, HTML, JavaScript, css
b. Subtasks: UI, Baidu Echart


### How to run the website:

Make sure you have redis
1. in terminal, at this directory, run command "redis-server"
2. Open another terminal, at the same directory, run "python3 manage.py handletask &" four times, then run "python3 manage.py runserver"
3. Visit localhost: 8000/#
