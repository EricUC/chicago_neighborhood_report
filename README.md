# Chicago Neighborhood Brief

## Team: Han-Ji-Ji, March 14, 2017

### File structure

------Project Management: Folder of past submitted and presentation docs.
  |
  |
   ---Data Processing: Folder of scripts about offline Crime SQL databases.
  |
  |
   ---Website: Client side and server side, including API and scrawler scripts.

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


### How to run the website

Make sure you have redis,
1. In terminal, at this directory, run command "redis-server"
2. Open one terminal and run "python3 manage.py runserver"
3. Open at least another four terminals, at the same directory, run "python3 manage.py handletask" separately
4. Visit localhost: 8000/

### Note: Running time trade-off in comparison mode

Please note that searching in comparison mode is more time-consuming than what you would expect from a standard commercial website, usually half a minute when we are testing.

The reason behind is that our free API key issued by Google is limited by the number of requests per second. When the calls are exceeding the limit, the application has to pause for 2 seconds for the next request. This happens when trying to get more than 20 results using the token it returned to us. So as a trade-off of resulting numbers and speed, we felt 20 results is inadequate for our report service, thus we sacrifice time for a more fulfilled result.

Please see more details in this document:
https://developers.google.com/maps/premium/previous-licenses/articles/usage-limits


