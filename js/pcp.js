
class PcpVis {

    constructor(data) {
        this.data = data;
        const margin = {top: 30, right: 10, bottom: 10, left: 0};
        this.width = 800 - margin.left - margin.right;
        this.height = 400 - margin.top - margin.bottom;
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
    }

    updateVis(county) {
        const vis = this;
        // The path function returns x and y coordinates of the line
        const path = d => d3.line()(Object.keys(vis.y).map(p =>
            p === "Gender" || p === "Race" ?
                [vis.x(p), vis.y[p](d[p]) + vis.y[p].bandwidth() / 2] :
                [vis.x(p), vis.y[p](d[p])]));
        let avePercentiles = [];
        for (const race of races) {
            console.log(race);
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
        console.log("avepercentiles", avePercentiles);
        // Draw the lines
        vis.svg.selectAll("myPath")
            .data(avePercentiles)
            .enter().append("path")
            .attr("d",  path)
            .attr("class", "pcp-line")
            .style("fill", "none")
            .style("stroke", "#B37029")
        // .style("opacity", 0.5);
        // .on("mouseover", highlight)
        // .on("mouseleave", doNotHighlight );


        // Draw the axis:
        vis.svg.selectAll("myAxis")
        // For each dimension of the dataset I add a 'g' element:
            .data(Object.keys(vis.y)).enter()
            .append("g")
            // I translate this element to its right position on the x axis
            .attr("transform", d => "translate(" + vis.x(d) + ")")
            // And I build the axis with the call function
            .each(function(d) {
                d3.select(this).call(d3.axisLeft().scale(vis.y[d])); })
            // Add axis title
            .append("text")
            .style("text-anchor", "middle")
            .attr("y", -9)
            .text(d => d)
            .style("fill", "black")
        console.log("updating pcp");
    }

    //console.log("test", x[1], y[1]("Native"))
    // Highlight the specie that is hovered
    // const highlight = function (d) {
    //
    //     selected_specie = d.Gender
    //
    //     // first every group turns grey
    //     d3.selectAll(".line")
    //         .transition().duration(200)
    //         .style("stroke", "lightgrey")
    //         .style("opacity", "0.2")
    //     // Second the hovered specie takes its color
    //     d3.selectAll("." + selected_specie)
    //         .transition().duration(200)
    //         .style("stroke", color(selected_specie))
    //         .style("opacity", "1")
    // };

    // Unhighlight
    // const doNotHighlight = function (d) {
    //     d3.selectAll(".line")
    //         .transition().duration(200).delay(1000)
    //         .style("stroke", function (d) {
    //             return (color(d.Gender))
    //         })
    //         .style("opacity", "1")
    // };
}