
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
        this.lat = 36;
        this.lon = 120;
        this.projection = d3.geoAlbers()
            // .center([0, this.lat])
            // .rotate([this.lon, 0])
            // .parallels([40, 45])
            .translate([this.width/2, this.height/2])
            .scale(1000);
        // this.projection = null;
        this.path = d3.geoPath()
            .projection(this.projection);
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
        vis.createLegend();
        d3.json("data/counties-10m.json", function(error, us) {
            if (error) throw error;
            vis.us = us;
            vis.map = vis.svg.append("g")
                .selectAll("path");
            vis.updateVis(null);
        });
    }

    updateVis(point) {
        const loading = $("#loading");
        loading.show();
        const vis = this;
        vis.map.data(topojson.feature(vis.us, vis.us.objects.states).features).enter().append("path")
            .attr("class", "state")
            .attr("d", vis.path)
            .attr("stroke", "white");
        const race = $("select#race").val();
        const gender = $("select#gender").val();
        const tool_tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([0, 0])
            .html(function(d) {
                let html = "<div class=''><h4>" + d.properties.name + " County</h4><table>";
                for (let raceCode of ['asian', 'black', 'hisp', 'natam', 'white']) {
                    html += "<tr><td>" + translateRaceCode(raceCode) + "</td><td>";
                    if (vis.data["kir_top20_" + raceCode + "_" + gender + "_p100"][d.id]) {
                        html += Math.floor(100 * vis.data["kir_top20_" + raceCode + "_" + gender + "_p100"][d.id]) + "%</td></tr>"
                    } else {
                        html += "NA</td></tr>";
                    }
                }
                html += "</table></div>";
                return html
            });
        vis.svg.call(tool_tip);
        vis.map.data(topojson.feature(vis.us, vis.us.objects.counties).features).enter().append("path")
            .attr("class", "tract")
            .attr("d", vis.path)
            .attr("fill", d => {
                if (point && d3.geoContains(d, point)) {
                    // Call the PCP diagram with this county's data
                    return "black";
                } else if (vis.data["kir_top20_" + race + "_" + gender + "_p100"][d.id]) {
                    return vis.colorScale(vis.data["kir_top20_" + race + "_" + gender + "_p100"][d.id]);
                } else {
                    return "gray";
                }
            })
            .attr("stroke", "white")
            .on("mouseover", tool_tip.show)
            .on("mouseout", tool_tip.hide);
        loading.hide();
        // helpful link for markers https://stackoverflow.com/questions/21397608/put-markers-to-a-map-generated-with-topojson-and-d3-js
        const marks = [{long: -75, lat: 43},{long: -78, lat: 41},{long: -70, lat: 53}];
        vis.svg.selectAll(".mark")
            .data(marks)
            .enter()
            .append("image")
            .attr('class','mark')
            .attr('width', 20)
            .attr('height', 20)
            .attr("xlink:href",'https://cdn3.iconfinder.com/data/icons/softwaredemo/PNG/24x24/DrawingPin1_Blue.png')
            .attr("transform", d => `translate(${vis.projection([d.long,d.lat])})`);
    }

    createLegend() {
        const vis = this;
        const legend = d3.select("#map-container")
            .append("svg")
            .attr("width", 300)
            .attr("height", 50)
            .append("g")
            .attr("class", "legend")
            .attr("transform", "translate(0, 0)");
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


