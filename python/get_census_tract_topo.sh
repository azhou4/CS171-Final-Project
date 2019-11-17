#!/bin/bash

# U.S. Albers
PROJECTION='d3.geoAlbersUsa().scale(1280).translate([480, 300])'

# The state FIPS codes.
STATES="01 02 04 05 06 08 09 10 11 12 13 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39 40 41 42 44 45 46 47 48 49 50 51 53 54 55 56"

# The ACS 5-Year Estimate vintage.
YEAR=2014

# The display size.
WIDTH=960
HEIGHT=680

# Download the census tract boundaries.
# Extract the shapefile (.shp) and dBASE (.dbf).
for STATE in ${STATES}; do
  if [ ! -f cb_${YEAR}_${STATE}_tract_500k.shp ]; then
    curl -o cb_${YEAR}_${STATE}_tract_500k.zip \
      "https://www2.census.gov/geo/tiger/GENZ${YEAR}/shp/cb_${YEAR}_${STATE}_tract_500k.zip"
    unzip -o \
      cb_${YEAR}_${STATE}_tract_500k.zip \
      cb_${YEAR}_${STATE}_tract_500k.shp \
      cb_${YEAR}_${STATE}_tract_500k.dbf
  fi
done

# Construct TopoJSON.
if [ ! -f census_tract_topo.json ]; then
  geo2topo -n \
    tracts=<(for STATE in ${STATES}; do \
          shp2json -n cb_${YEAR}_${STATE}_tract_500k.shp \
            | geoproject -n "${PROJECTION}" \
            | ndjson-map 'd.id = d.properties.GEOID, d'
      done) \
    | topomerge -k 'd.id.slice(0, 5)' counties=tracts \
    | topomerge -k 'd.id.slice(0, 2)' states=counties \
    | topomerge --mesh -f 'a !== b' counties=counties \
    | topomerge --mesh -f 'a !== b' states=states \
    | toposimplify -p 1 -f \
    | topoquantize 1e5 \
    > census_tract_topo.json
fi

