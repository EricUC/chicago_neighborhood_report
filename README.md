# Chicago Neighborhood Brief

## Team: Han-Ji-Ji

### Project introduction

Here you have Chicago Neighborhood Brief, an neighborhood evaluation system that aims to help apartment seekers finalize their rental decision. We  Chicago Neighborhood Brief allows user to define a radius of one address based as the neighborhood, then analyze the safety, convenience, and noise-level of that neighborhood. This system also allows multiple location comparison.

### Data sources

1. Coogle API-Convenience data

API: Google Maps Geocoding API, Google Places API Web Service, Google Maps Distance Matrix API: https://developers.google.com/places/web-service/

2. City of Chicago Data Portal-Crime data

3. Howloud.com-Noise data

### Procedures

Task Required
1. Data gathering and cleaning from above data source
a. Tools: Python script and corresponding libraries, HTML
b. Subtasks: data cleaning and munging
2. Data storing and joining data from different sources
a. Tools: SQL, perhaps JavaScript
3. Data analysis and query realization
a. Tools: Python, SQL
b. Subtasks: Apartment evaluation model and ordering algorithms based on the data
4. Data visualization
a. Tools: Map API, Python, SQL, HTML, perhaps JavaScript
b. Subtasks: UI, other necessary charts or lists




### How to run the website:

Make sure you have redis
1. in terminal, at this directory, run command "redis-server"
2. Open another terminal, at the same directory, run "python3 manage.py handletask &" four times, then run "python3 manage.py runserver"
3. Visit localhost: 8000/#
