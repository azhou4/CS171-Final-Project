
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
        this.initVis();
    }

    initVis() {
        const vis = this;
        d3.json("data/census_tract_topo.json", function(error, us) {
            if (error) throw error;

            const tracts = us.objects.tracts;

            vis.svg.append("g")
                .selectAll("path")
                .data(topojson.feature(us, tracts).features)
                .enter().append("path")
                .attr("class", "tract")
                .attr("d", vis.path)
                .append("title")
                .text(function(d, i) { return d.id; });

            // vis.svg.append("path")
            //     .attr("class", "tract-border")
            //     .datum(topojson.mesh(us, tracts, function(a, b) { return a !== b; }))
            //     .attr("d", vis.path);
        });
    }
}


