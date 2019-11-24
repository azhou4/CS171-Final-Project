
class MapVis {

    constructor(data) {
        this.data = data;
        this.width = 1000;
        this.height = 1000;
        this.svg = d3.select("#map")
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height);
        this.path = d3.geoPath()
            .projection(null);
        const lowColor = "#4997B3";
        const highColor = "#B37029";
        this.colorScale = d3.scaleLinear()
            .domain([0,1])
            .range([lowColor, highColor])
            .interpolate(d3.interpolateLab);
        this.initVis();
    }

    initVis() {
        const vis = this;
        // console.log(vis.data);

        d3.json("data/census_tract_topo.json", function(error, us) {
            if (error) throw error;
            const tracts = us.objects.tracts;
            const map = vis.svg.append("g")
                .selectAll("path")
                .data(topojson.feature(us, tracts).features);
            map.enter().append("path")
                .attr("class", "tract")
                .attr("d", vis.path)
                .attr("fill", d => {
                    // console.log(vis.data[parseInt(d.properties.TRACTCE)]);
                    if (vis.data[parseInt(d.properties.TRACTCE)]) {
                        return vis.colorScale(vis.data[parseInt(d.properties.TRACTCE)]["kir_white_pooled_p100"])
                    } else {
                        return "gray";
                    }
                })
                // .append("title")
                // .text(function(d, i) { return d.id; });

            // vis.svg.append("path")
            //     .attr("class", "tract-border")
            //     .datum(topojson.mesh(us, tracts, function(a, b) { return a !== b; }))
            //     .attr("d", vis.path);
        });
    }
}


