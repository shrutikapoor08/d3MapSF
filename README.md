# Real time SF Muni locations

This app draws the real-time positions of San Francisco's buses and trains (SF Muni) using d3.js.
SF Muni locations are drawn from http://www.nextbus.com/xmlFeedDocs/NextBusXMLFeed.pdf.

## Dependencies
1. d3.js https://d3js.org/
2. topoJSON https://github.com/topojson/topojson
3. http-server

## Setup:
1. Clone repo
2. `npm install`
3. Run `http-server -p 8001 -c-1` to run your local server
4. Go to localhost:8001

## TODO:
1. Develop UI to allow user to input route
2. remove vehicle's previous position. In the absence of an animating marker,
 I am appending to svg as opposed to overwriting markers. This is to show that the data does update.
3. Update time `t`, the time when the data was last fetched from the Nextbus JSON feed.
