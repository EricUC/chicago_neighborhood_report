.headers off
CREATE TABLE crime
(case_id CHAR(8),
date_occur VARCHAR(25),
primary_desc VARCHAR(32),
loc VARCHAR(100),
lat FLOAT,
lng FLOAT,
crime_type INT,
CONSTRAINT pk_case_id PRIMARY KEY (case_id));

.separator ,
.import crimes_01.csv crime
-- delete from crime where lat = 'lat'
