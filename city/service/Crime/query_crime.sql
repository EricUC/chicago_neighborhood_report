SELECT case_id, primary_desc, distance_within(?, crime.lat, crime.lng, ?)
FROM crime
WHERE distance_within < ?
