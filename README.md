# Chitown Analytics
We do some stuff with some Chicago Data

### Notes
- Add link to User Stories
- Add link wireframes


### Technologies Used
- Express
- MongoDB
~~- Backbone~~
- jQuery
- Passport
- Handlebars

### Installation Instructions
- npm install
- Run the POST route in Postman or similar for desired data. Currently set to receive homicides from 2001 to present.

### Unsolved Problems/Major hurdles
~~The initial goal was to pull Chicago data into our database and filter it via our schema, which would use some simple logic to remove unwanted attributes and add other derived attributes to make further analysis easier. From there, we would be able to query our own database for certain types of crimes within certain date ranges by creating a Backbone collection with the url containing those parameters. From there, that collection would then populate everything else, from the map to the graph to the crime cards.~~

~~That didn't happen. Because of time constraints (four days!), we had to pursue all the primary end products (ie map and chart) simultaneously, which resulted in overlapping yet incompatible technologies.~~

~~As such, only the graph is populated by our own API. The graph is populated by Chicago Open Data. The crime cards remain unpopulated. C'est la vie. We will complete it as we have time.~~

Additional functionality to add to this project include refinement of url-based queries to the API. Along those lines, additional query parameters should be added that include IUCR comparison for option to specify subtype. Further, more actual analysis should be performed on the numbers, such as yearly, monthly, weekly, and daily averages. Also welcome can be a queries based on neighborhood, wherein a lat/long boxes around a neighborhood (selected from another dropdown menu?) can be used to compare against incidents in the database.

### Future additions
- Account Management page
  - Change password
  - Email verification
