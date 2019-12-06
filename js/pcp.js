
class PcpVis {

    constructor(data) {
        this.data = data;
        const margin = {top: 30, right: 10, bottom: 10, left: 0};
        this.width = 900 - margin.left - margin.right;
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

        // Initialize with Boston
        this.updateVis({countyName: "Suffolk", countyCode: "25025"})
    }

    updateVis(county) {
        // Current Selections
        console.log("selected", county)
        if (county == null) {
            console.log("YES it's null")
            county = getLatLong("hometown");
        }
        console.log("CHANGE IS HERE", county)
        const genderInput = document.getElementById("pcp-gender").value;
        const raceInput = document.getElementById("pcp-race").value;
        const incomeInput = document.getElementById("pcp-income").value;

        // Encoding what the selections mean
        const selectedValues = [];
        if (genderInput == "All Genders") {
            selectedValues.push("Female")
            selectedValues.push("Male")
        }
        else {
            selectedValues.push(genderInput)
        }

        if (raceInput == "All Races") {
            selectedValues.push("White")
            selectedValues.push("Black")
            selectedValues.push("Asian")
            selectedValues.push("Native American")
            selectedValues.push("Hispanic")
            selectedValues.push("Other")
        }
        else {
            selectedValues.push(raceInput)
        }

        if (incomeInput == "all") {
            selectedValues.push(1)
            selectedValues.push(25)
            selectedValues.push(50)
            selectedValues.push(75)
            selectedValues.push(100)
        }
        else {
            selectedValues.push(parseInt(incomeInput.slice(1)))
        }

        console.log("selection values", genderInput, raceInput, incomeInput, selectedValues)

        d3.select("#pcp-chart").selectAll("svg").remove()

        this.svg = d3.select("#pcp-chart")
            .append("svg")
            .attr("width", this.width + margin.left + margin.right)
            .attr("height", this.height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        const vis = this;
        // The path function returns x and y coordinates of the line
        const path = d => d3.line()(Object.keys(vis.y).map(p =>
            p === "Gender" || p === "Race" ?
                [vis.x(p), vis.y[p](d[p]) + vis.y[p].bandwidth() / 2] :
                [vis.x(p), vis.y[p](d[p])]));
        let avePercentiles = [];
        for (const race of races) {
            //console.log(race);
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
        //
        //console.log("avepercentiles", avePercentiles);
        // Draw the lines
        vis.svg.selectAll("myPath")
            .data(avePercentiles)
            .enter().append("path")
            .attr("d",  path)
            .attr("class", "pcp-line")
            .style("fill", "none")
            .style("font-size", "14px")
            .style("stroke", function(d) {
                console.log(d)
                if (selectedValues.includes(d.Gender) && selectedValues.includes(d.Race) && selectedValues.includes(d["Parent Income Percentile"])) {
                    console.log("this person has been selected!!")
                    return"#B37029"}
                else {
                    return "#756966"
                }}
                )
            .style("opacity", function(d) {
                    console.log(d)
                    if (selectedValues.includes(d.Gender) && selectedValues.includes(d.Race) && selectedValues.includes(d["Parent Income Percentile"])) {
                        console.log("this person has been selected!!")
                        return 0.9}
                    else {
                        return 0.2
                    }})
            .style("stroke-width", function(d) {
                console.log(d)
                if (selectedValues.includes(d.Gender) && selectedValues.includes(d.Race) && selectedValues.includes(d["Parent Income Percentile"])) {
                    console.log("this person has been selected!!")
                    return "3px"}
                else {
                    return "1px"
                }})
            .on("mouseover", function(d) {
                d3.select(this).style("stroke-width", "4px").style("stroke", "#000000").style("opacity", 0.5)
            })
            .on("mouseleave", function(d) {
                if (selectedValues.includes(d.Gender) && selectedValues.includes(d.Race) && selectedValues.includes(d["Parent Income Percentile"])) {
                    console.log("this person has been selected!!")
                    d3.select(this).style("stroke-width", "3px").style("stroke", "#B37029").style("opacity", 0.9)}
                else {
                    d3.select(this).style("stroke-width", "1px").style("stroke", "#756966")
                }}
                )
        // .on("mouseleave", doNotHighlight );


        // Draw the axis:
        vis.svg.selectAll("myAxis")
        // For each dimension of the dataset I add a 'g' element:
            .data(Object.keys(vis.y)).enter()
            .append("g")
            .style("font-size", "14px")
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
        // d3.selectAll("#pcp-chart > *").remove()
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