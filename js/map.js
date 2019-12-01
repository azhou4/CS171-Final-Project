
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
        this.projection = d3.geoAlbersUsa()
            .translate([this.width/2, this.height/2])
            .scale(1500);
        // this.projection = null;
        this.path = d3.geoPath()
            .projection(this.projection);
        // TODO: rerender legend for different outcomes
        const lowColor = "#B37029";
        const highColor = "#4997B3";
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
        d3.json("data/counties-10m.json", function(error, us) {
            if (error) throw error;
            const counties = us.objects.counties;
            vis.map = vis.svg.append("g")
                .selectAll("path")
                .data(topojson.feature(us, counties).features);
            vis.updateVis();
            vis.createLegend();
        });
    }

    updateVis() {
        const loading = $("#loading");
        loading.show();
        const vis = this;
        const race = $("select#race").val();
        const gender = $("select#gender").val();
        vis.map.enter().append("path")
            .attr("class", "tract")
            .attr("d", vis.path)
            .attr("fill", d => {
                if (vis.data["kir_top20_" + race + "_" + gender + "_p100"][d.id]) {
                    return vis.colorScale(vis.data["kir_top20_" + race + "_" + gender + "_p100"][d.id]);
                } else {
                    return "gray";
                }
            })
            .attr("stroke", "white")
            .attr("stroke-width", .25);
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
        // TODO: rerender legend for different outcomes
        legend.append("text").text(() => "0%")
            .attr("transform","translate(0,30)")
            .style("fill", "black")
            .style("font-size", "10px");
        legend.append("text").text(() => "100%")
            .attr("transform","translate("+(vis.legendWidth-20)+",30)")
            .style("font-size", "10px");
    }
}


