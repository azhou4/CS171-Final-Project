
class MapVis {

    constructor(data) {
        this.data = data;
        this.width = 800;
        this.height = 550;
        const svg = d3.select("#map")
            .append("svg")
            .attr("class", "map-svg")
            .attr("width", this.width)
            .attr("height", this.height)
            .call(d3.zoom().on("zoom", function () {
                svg.attr("transform", d3.event.transform)
            }))
            .append("g");
        this.svg = svg;
        this.projection = d3.geoAlbersUsa()
            .translate([this.width/2, this.height/2])
            .scale(1000);
        this.path = d3.geoPath()
            .projection(this.projection);
        const lowColor = colors.darkOrange;
        const highColor = colors.blue;
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
        // Load county TopoJson
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

        // Render state boundaries
        vis.map.data(topojson.feature(vis.us, vis.us.objects.states).features).enter().append("path")
            .attr("class", "state")
            .attr("d", vis.path)
            .attr("stroke", "white");

        // Get current selections
        const race = $("select#race").val();
        const gender = $("select#gender").val();
        const pctile = $("select#parent-percentile").val();
        const tool_tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([0, 0])
            .html(d => vis.getTooltipHtml(d, gender, pctile));
        vis.svg.call(tool_tip);

        // Render counties
        vis.map.data(topojson.feature(vis.us, vis.us.objects.counties).features).enter().append("path")
            .attr("class", "tract")
            .attr("d", vis.path)
            .attr("fill", d => {
                if (vis.data["kir_top20_" + race + "_" + gender + "_" + pctile][d.id]) {
                    return vis.colorScale(vis.data["kir_top20_" + race + "_" + gender + "_" + pctile][d.id]);
                } else {
                    return "gray";
                }
            })
            .attr("stroke",  "white")
            .attr("stroke-width", d => {
                if (point && d3.geoContains(d, point)) {
                    if (pcp) {
                        pcp.updateVis({countyName: d.properties.name, countyCode: d.id});
                    }
                    return 2;
                } else {
                    return .25;
                }
            })
            .on("mouseover", tool_tip.show)
            .on("mouseout", tool_tip.hide);
        loading.hide();
    }

    createLegend() {
        const vis = this;
        const legend = d3.select("#map-container")
            .append("svg")
            .attr("width", 300)
            .attr("height", 60)
            .append("g")
            .attr("class", "legend")
            .attr("transform", "translate(0, 0)");
        legend.selectAll('rect')
            .data(vis.legendData)
            .enter()
            .append('rect')
            .attr("x", function(d) { return d; })
            .attr("y", 15)
            .attr("height", 10)
            .attr("width", vis.sectionWidth)
            .attr('fill', function(d, i) { return vis.legendColorScale(i)});
        legend.append("text").text(() => "0%")
            .attr("transform","translate(0,40)")
            .style("fill", "black")
            .style("font-size", "10px");
        legend.append("text").text(() => "Probability of Reaching Top 20%")
            .attr("transform","translate(25,10)")
            .style("fill", "black")
            .style("font-size", "10px");
        legend.append("text").text(() => "100%")
            .attr("transform","translate("+(vis.legendWidth-20)+",40)")
            .style("font-size", "10px");
    }

    getTooltipHtml(d, gender, pctile) {
        const vis = this;
        let html = "<div class=''><h4>" + d.properties.name + " County</h4><table>";
        // Get statistics for each race
        for (let raceCode of races) {
            html += "<tr><td>" + translateRaceCode(raceCode) + "</td><td>";
            if (vis.data["kir_top20_" + raceCode + "_" + gender + "_" + pctile][d.id] !== null) {
                html += Math.floor(100 * vis.data["kir_top20_" + raceCode + "_" + gender + "_" + pctile][d.id]) + "%</td></tr>"
            } else {
                html += "NA</td></tr>";
            }
        }
        html += "</table></div>";
        return html
    }
}


