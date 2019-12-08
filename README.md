# Social Mobility in America

Welcome to our Github Repository! Our website can be found [here](https://amymzhou.com/CS171-Final-Project/#home) and our screencast can be found [here](https://youtu.be/WXLtsKODIyU).

Our goal for this project was to create an interactive story describing the state of social mobility in America. We took datasets
from the [Opportunity Insights Project](https://opportunityinsights.org/), headed by Harvard's Professor Raj Chetty, and as well as an international mobility dataset from Economic Policy Institute. We coded this project using Javascript, D3, JQuery, and Python for data cleaning. For formatting and layout, we used Bootstrap and FullPage.

Our repository is divided into 6 folders and 2 files. 
1. `index.html`: contains the layout code for our website. It calls other supplemental files in order to show all the visualizations, the styling, the images and more. 
2. `config.js`: allows our visualizations to function, by including the public-facing API_KEY so that we are able to utilize Google Maps API.
3. `python` folder: contains the python scripts we used to clean our data and render it to the appropriate format for our visualizations. 
4. `img` folder: contains all of the images and icons present on our website. All images borrowed from online can be found in our References section. 
5. `fonts` folder: contains the three custom fonts used in our website: Gotham Bold, Gotham Light, and Robot Light. 
6. `data` folder: contains all of the datasets used in our visualizations. The `internationalmobility.csv` is used in our horizontal barchart visualization. The Sankey diagram utilizes `sankey-formatted.json`. The map visualization utilizes `counties-10m.json` (topojson describing U.S. counties), and `kir_top_20_county.json` (individual income percentile for different demographics for each county). The Parallel Coordinates Plot visualization uses `kir_county.json` (average income percentile for different demographics by county. 
7. `css` folder: contains all of the styling used in our project. We used Bootstrap and FullPage as libraries for layout and formatting. All of our custom formatting can be found in style.css. 
8. `js` folder: contains d3 code that generates the visualizations. We have a file for each of our visualizations: (1) `barChart.js` contains the code for our horizontal barchart, (2) `map.js` contains the code for our map visualization, (3) `pcp.js` contains the code for our parallel coordinates plot diagram, and (4) `sankey.js` contains the code for our Sankey diagram. Main.js contains global variables and functions, and is used for loading the data. `geocode.js` and `helpers.js` contain global functions used for the map and related visualizations. The JavaScript libraries we used are in the `libraries` folder. 

Through our project, we hope that you are able to explore and learn something about social mobility in America. We worked extremely hard on this project and learned so much about D3, data cleaning, and Javascript and truly hope you enjoy our work!
