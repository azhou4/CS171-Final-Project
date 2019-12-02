// set the dimensions and margins of the graph
var margin = {top: 30, right: 10, bottom: 10, left: 0},
    width = 500 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const pcpsvg = d3.select("#pcp-chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// Parse the Data
d3.csv("data/cars.csv", function(data) {
    console.log("data", data);
    // Extract the list of dimensions we want to keep in the plot. Here I keep all except the column called Species
    const dimensions = d3.keys(data[0]).filter(function(d) { return d !== "name" });

    // For each dimension, I build a linear scale. I store all in a y object
    const y = {};
    for (const i in dimensions) {
        const name = dimensions[i];

        if (name === "Gender") {
            y[name] = d3.scaleBand()
                .domain(["Male", "Female"])
                .range([height, 0]);
            console.log("checking where Female maps", y["Gender"]("Female"));
        } else if (name === "Parental Income %") {
            const calculate = d3.extent([0, 400]);
            //console.log("calculate", calculate)
            y[name] = d3.scaleLinear()
                .domain(calculate)
                .range([height, 0])
        } else if (name === "Race") {
            y[name] = d3.scaleBand()
                .domain(["something", "Native", "Asian", "White", "Black", "Hispanic", "Other"])
                .range([height, 0])
        } else if (name === "% Rank (Income)") {
            //console.log("HELLO")
            const calculate = d3.extent([0, 150]);
            //console.log("calculate", calculate)
            y[name] = d3.scaleLinear()
                .domain(calculate)
                .range([height, 0])
        }
    }

    // Build the X scale -> it find the best position for each Y axis
    const x = d3.scalePoint()
        .range([0, width])
        .padding(1)
        .domain(dimensions);

    //console.log("test", x[1], y[1]("Native"))
    // Highlight the specie that is hovered
    const highlight = function (d) {

        selected_specie = d.Gender

        // first every group turns grey
        d3.selectAll(".line")
            .transition().duration(200)
            .style("stroke", "lightgrey")
            .style("opacity", "0.2")
        // Second the hovered specie takes its color
        d3.selectAll("." + selected_specie)
            .transition().duration(200)
            .style("stroke", color(selected_specie))
            .style("opacity", "1")
    };

    // Unhighlight
    const doNotHighlight = function (d) {
        d3.selectAll(".line")
            .transition().duration(200).delay(1000)
            .style("stroke", function (d) {
                return (color(d.Gender))
            })
            .style("opacity", "1")
    };


    // The path function take a row of the csv as input, and return x and y coordinates of the line to draw for this raw.
    function path(d) {
        return d3.line()(dimensions.map(function (p) {
            console.log("deline", p, d[p], [x(p), y[p](d[p])])
            if (p === "Gender" || p === "Race") {
                return [x(p), y[p](d[p]) + y[p].bandwidth() / 2];
            }
            return [x(p), y[p](d[p])];
        }));
    }
    // Draw the lines
    pcpsvg
        .selectAll("myPath")
        .data(data)
        .enter().append("path")
        .attr("d",  path)
        .style("fill", "none")
        .style("stroke", function (d) {
            if (d["cylinders"] === "4") {
                return "#4997B3"
            }
            else if (d["cylinders"] === "6") {
                return "#9CE5FF"
            }
            else {
                return "#B37029"
            }

        })
        .style("opacity", 0.5)
        .on("mouseover", highlight)
        .on("mouseleave", doNotHighlight )


    // Draw the axis:
    pcpsvg.selectAll("myAxis")
    // For each dimension of the dataset I add a 'g' element:
        .data(dimensions).enter()
        .append("g")
        // I translate this element to its right position on the x axis
        .attr("transform", function(d) { return "translate(" + x(d) + ")"; })
        // And I build the axis with the call function
        .each(function(d) {
            console.log("dddd", d);
            d3.select(this).call(d3.axisLeft().scale(y[d])); })
        // Add axis title
        .append("text")
        .style("text-anchor", "middle")
        .attr("y", -9)
        .text(function(d) {
            console.log("text", d);
            return d; })
        .style("fill", "black")
});

