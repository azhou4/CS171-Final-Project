
class MapVis {

    constructor(data) {
        this.data = data;
        this.width = 800;
        this.height = 550;
        const svg = d3.select("#map")
            .append("svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .call(d3.zoom().on("zoom", function () {
                svg.attr("transform", d3.event.transform)
            }))
            .append("g");
        this.svg = svg;

        this.path = d3.geoPath()
            .projection(null);
        const lowColor = "#4997B3";
        const highColor = "#B37029";
        this.colorScale = d3.scaleLinear()
            .domain([0,1])
            .range([lowColor, highColor])
            .interpolate(d3.interpolateLab);
        this.legendWidth = 200;
        const divisions = 100;
        this.sectionWidth = Math.floor(this.legendWidth / divisions);
        this.legendData = [];
        for (let i = 0; i < this.legendWidth; i += this.sectionWidth) {
            this.legendData.push(i);
        }
        this.legendColorScale = d3.scaleLinear()
            .domain([0, this.legendData.length - 1])
            .range([lowColor, highColor])
            .interpolate(d3.interpolateLab);

        this.initVis();
    }



    initVis() {
        const vis = this;

        d3.json("data/census_tract_topo.json", function(error, us) {
            if (error) throw error;
            const tracts = us.objects.tracts;
            vis.map = vis.svg.append("g")
                .selectAll("path")
                .data(topojson.feature(us, tracts).features);
            vis.updateVis();
            vis.createLegend();
        });
    }

    updateVis() {
        const loading = $("#loading");
        loading.show();
        const vis = this;
        console.log("updating vis");
        const race = $("select#race").val();
        const gender = $("select#gender").val();
        vis.map.enter().append("path")
            .attr("class", "tract")
            .attr("d", vis.path)
            .attr("fill", d => {
                if (vis.data[parseInt(d.properties.TRACTCE)]) {
                    return vis.colorScale(vis.data[parseInt(d.properties.TRACTCE)]["kir_" + race + "_" + gender + "_p100"]);
                } else {
                    return "gray";
                }
            });
        loading.hide();
    }

    createLegend() {
        const vis = this;
        const legend = vis.svg.append("g")
            .attr("class", "legend")
            .attr("transform", "translate(300, 0)");
        legend.selectAll('rect')
            .data(vis.legendData)
            .enter()
            .append('rect')
            .attr("x", function(d) { return d; })
            .attr("y", 10)
            .attr("height", 10)
            .attr("width", vis.sectionWidth)
            .attr('fill', function(d, i) { return vis.legendColorScale(i)});
        legend.append("text").text(() => "0%")
            .attr("transform","translate(0,30)")
            .style("fill", "black")
            .style("font-size", "10px");
        legend.append("text").text(() => "100%")
            .attr("transform","translate("+(vis.legendWidth-20)+",30)")
            .style("font-size", "10px");
    }
}


