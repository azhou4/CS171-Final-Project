// Create the Parallel Coordinate Plot Vis

class PcpVis {

    constructor(data) {
        this.data = data;
        const margin = {top: 30, right: 10, bottom: 10, left: 0};
        this.width = 1000 - margin.left - margin.right;
        this.height = 600 - margin.top - margin.bottom;
        this.svg = d3.select("#pcp-chart")
            .append("svg")
            .attr("width", this.width + margin.left + margin.right)
            .attr("height", this.height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + 0 + "," + margin.top + ")");
        const calculate = d3.extent([0, 100]);
        const percentileScale = d3.scaleLinear()
            .domain(calculate)
            .range([this.height, 0]);
        // For each dimension store all scales in a y object
        this.y = {
            "Gender": d3.scaleBand()
                .domain(["Male", "Female"])
                .range([this.height, 0]),
            "Race": d3.scaleBand()
                .domain(races.map(translateRaceCode))
                .range([this.height, 0]),
            "Parent Income Percentile": percentileScale,
            "Predicted Income Percentile": percentileScale
        };
        this.x = d3.scalePoint()
            .range([0, this.width])
            .padding(1)
            .domain(Object.keys(this.y));
        this.defaultCounty = {countyName: "Suffolk", countyCode: "25025"};
        this.drawAxis();
        this.updateVis(this.defaultCounty)
    }

    getData(county) {
        const vis = this;
        let avePercentiles = [];
        for (const race of races) {
            for (const gender of genders) {
                for (const pctile of pctiles) {
                    const avePercentile = vis.data["kir_" + race + "_" + gender + '_' + pctile][county.countyCode];
                    if (avePercentile) {avePercentiles.push({
                        "Race": translateRaceCode(race),
                        "Gender": translateGenderCode(gender),
                        "Parent Income Percentile": parseInt(pctile.slice(1)),
                        "Predicted Income Percentile": Math.round(100 * avePercentile)
                    });}
                }
            }
        }
        return avePercentiles;
    }

    drawAxis() {
        const vis = this;
        vis.svg.selectAll("myAxis")
            .data(Object.keys(vis.y)).enter()
            .append("g")

            .style("font-size", "14px")
            .attr("transform", d => "translate(" + vis.x(d) + ")")
            .each(function(d) {
                d3.select(this).call(d3.axisLeft().scale(vis.y[d])); })
            // Add axis title
            .append("text")
            .style("text-anchor", "middle")
            .attr("class", "pcp-label")
            .attr("y", -15)
            .text(d => d)
            .style("fill", "black");
    }

    updateVis(county) {
        const vis = this;
        if (!county) {
            county = this.defaultCounty;
        }

        // The path function returns x and y coordinates of the line
        const path = d => d3.line()(Object.keys(vis.y).map(p =>
                p === "Gender" || p === "Race" ?
                    [vis.x(p), vis.y[p](d[p]) + vis.y[p].bandwidth() / 2] :
                    [vis.x(p), vis.y[p](d[p])]));

        // Draw the lines
        const paths = vis.svg.selectAll(".pcp-line")
            .data(vis.getData(county), d => d);
        paths.exit().remove();
        paths.enter().append("path")
            .attr("d",  d => path(d))
            .attr("class", "pcp-line")
            .style("fill", "none")
            .style("font-size", () => {
                return "14px";
            })
            .style("stroke", d => vis.shouldBeHighlighted(d) ? colors.darkOrange : colors.gray)
            .style("opacity", d => vis.shouldBeHighlighted(d) ? .8 : .2)
            .style("stroke-width", d => vis.shouldBeHighlighted(d) ? "2px" : "1px")
            .on("mouseover", function(d) {
                d3.select(this).style("stroke-width", "4px").style("stroke", colors.blue).style("opacity", 0.9)
            })
            .on("mouseleave", function(d) {
                if (vis.shouldBeHighlighted(d)) {
                    d3.select(this).style("stroke-width", "2px").style("stroke", colors.darkOrange).style("opacity", 0.8)}
                else {
                    d3.select(this).style("stroke-width", "1px").style("stroke", colors.gray).style("opacity", 0.2)
                }});
    }

    shouldBeHighlighted = (d) => {
        // Current Selections
        const genderInput = () => $("#pcp-gender").val();
        const raceInput =  () => $("#pcp-race").val();
        const incomeInput = () => $("#pcp-income").val();
        let highlightStatus = true;
        if (genderInput() !== "All") {
            highlightStatus = highlightStatus && d.Gender === genderInput();
        }
        if (raceInput() !== "All Races") {
            highlightStatus = highlightStatus && d.Race === raceInput();
        }
        if (incomeInput() !== "all") {
            highlightStatus = highlightStatus && d["Parent Income Percentile"] === parseInt(incomeInput().slice(1));
        }
        return highlightStatus;
    };
}