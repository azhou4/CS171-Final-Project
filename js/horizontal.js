var margin = {top: 20, right: 20, bottom: 30, left: 40},
    barwidth = 600 - margin.left - margin.right,
    barheight = 400 - margin.top - margin.bottom;

var hbarx = d3.scaleLinear()
    .range([0, barwidth]);

var hbary = d3.scaleBand()
    .range([barheight, 0])
    .paddingInner(0.1);

var hbar = d3.select("#horizontal-bar")
    .append("svg")
    .attr("width", barwidth + margin.left + margin.right)
    .attr("height", barheight + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

initVis();


function initVis() {
    d3.csv("data/internationalmobility.csv", function(error, data) {
        console.log("horizontal", data)
        if (error) throw error;

        hbarx.domain([0, d3.max(data, function(d){return d.earning;})]);
        hbary.domain(data.map(function(d) {return d.country;}));

        hbar.selectAll(".hbar")
            .data(data)
            .enter().append("rect")
            .attr("class", "hbar")
            .attr("x", function(d) {return 0;})
            .attr("width", function(d) {return hbarx(d.earning)})
            .attr("y", function(d) { return hbary(d.country);})
            .attr("height", hbary.bandwidth())
            .style("fill", function(d) {
                if (d.country == "United States") {
                    return "#FFAA4D"
                }
                else {
                    return "#9CE5FF"
                }
            })

        // Add the X axis
        hbar.append("g")
            .attr("transform", "translate(0," + barheight + ")")
            .call(d3.axisBottom(hbarx));

        // add the y Axis
        hbar.append("g")
            .call(d3.axisLeft(hbary));

        hbar.append("text")
            .attr("x", 250)
            .attr("y", 380)
            .text("Intergenerational Earning Elasticity");

        hbar.append("text")
            .attr("x", -40)
            .attr("y", -8)
            .text("Country");


    })

}
