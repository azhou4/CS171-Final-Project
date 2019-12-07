
class PcpVis {

    constructor(data) {
        this.data = data;
        const margin = {top: 30, right: 10, bottom: 10, left: 0};
        this.width = 1300 - margin.left - margin.right;
        this.height = 600 - margin.top - margin.bottom;
        this.svg = d3.select("#pcp-chart")
            .append("svg")
            .attr("width", this.width + margin.left + margin.right)
            .attr("height", this.height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
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
        this.defaultCounty = {countyName: "Suffolk", countyCode: "25025"}
        // Initialize with Boston
        this.updateVis(this.defaultCounty)
    }

    updateVis(county) {
        const vis = this;
        // Current Selections
        if (!county) {
            county = this.defaultCounty;
        }
        // county = vis.defaultCounty;
        // const genderInput = document.getElementById("pcp-gender").value;
        const genderInput = () => $("#pcp-gender").val();
        const raceInput =  () => document.getElementById("pcp-race").value;
        const incomeInput = () => document.getElementById("pcp-income").value;

        // The path function returns x and y coordinates of the line
        const path = d => d3.line()(Object.keys(vis.y).map(p =>
            p === "Gender" || p === "Race" ?
                [vis.x(p), vis.y[p](d[p]) + vis.y[p].bandwidth() / 2] :
                [vis.x(p), vis.y[p](d[p])]));
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
        // Draw the lines
        const paths = vis.svg.selectAll(".pcp-line")
            .data(avePercentiles, d => d);

        const shouldBeHighlighted = (d) =>
        {
            console.log(genderInput());
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

        paths.exit().remove();
        paths.enter().append("path")
            .attr("d",  path)
            .attr("class", "pcp-line")
            .style("fill", "none")
            .style("font-size", "14px")
            .style("stroke", d => shouldBeHighlighted(d) ? "#B37029" : "#756966")
            .style("opacity", d => shouldBeHighlighted(d) ? .8 : .2)
            .style("stroke-width", d => shouldBeHighlighted(d) ? "2px" : "1px")
            .on("mouseover", function(d) {
                console.log(d, shouldBeHighlighted(d));
                d3.select(this).style("stroke-width", "4px").style("stroke", "#000000").style("opacity", 0.5)
            })
            .on("mouseleave", function(d) {
                if (shouldBeHighlighted(d)) {
                    d3.select(this).style("stroke-width", "2px").style("stroke", "#B37029").style("opacity", 0.8)}
                else {
                    d3.select(this).style("stroke-width", "1px").style("stroke", "#756966").style("opacity", 0.2)
                }});

        // Draw the axis
        vis.svg.selectAll("myAxis")
        // For each dimension of the dataset I add a 'g' element:
            .data(Object.keys(vis.y)).enter()
            .append("g")
            .style("font-size", "18px")
            // I translate this element to its right position on the x axis
            .attr("transform", d => "translate(" + vis.x(d) + ")")
            // And I build the axis with the call function
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
}