var margin = {top: 20, right: 20, bottom: 30, left: 40},
    barwidth = 700 - margin.left - margin.right
    barheight = 500 - margin.top - margin.bottom;

var hbar = d3.select("#horizontal-bar")
    .append("svg")
    .attr("width", barwidth + margin.left + margin.right)
    .attr("height", barheight)
    .append("g")
    .attr("transform",
        "translate(" + (margin.left + 70) + "," + (margin.top) + ")");

var hbarx = d3.scaleLinear()
    .range([0, barwidth-100]);

var hbary = d3.scaleBand()
    .range([barheight - 80, 0])
    .paddingInner(0.1);

hbar.append("text")
    .attr("x", 140)
    .attr("y", 420)
    .text("Intergenerational Earning Elasticity");

hbar.append("text")
    .attr("x", -60)
    .attr("y", -8)
    .text("Country");

// Add the X axis

hbar.append("g")
    .style("font-size", "14px")
    .attr("transform", "translate(0," + (barheight - 80) + ")")
    .transition().duration(1000).call(d3.axisBottom(hbarx));

hbar.append("g")
    .attr("class", "axis y-axis")
    .style("font-size", "14px")

var hdata;

loadData();

// Define the div for the tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

function loadData() {
    d3.csv("data/internationalmobility.csv", function(error, data) {
        console.log("horizontal", data);
        if (error) throw error;

        hdata = data;
        updateHVis("Highest to Lowest");

    })

}

function updateHVis() {
    console.log("hdata", hdata);
    var val = document.getElementById("selection").value;
    console.log("VALLL", val)
    if (val == "Alphabetical") {
        hdata.sort(function(a,b) {
            var textA = a["country"]
            var textB = b["country"]
            return textB.localeCompare(textA)})
        console.log("hdataaa", hdata)
    }
    else if (val == "Highest to Lowest") {
        hdata.sort(function(a,b) {return a["earning"] - b['earning']})
    }
    else {
        hdata.sort(function(a,b) {return b['earning'] - a['earning']})
    }

    hbarx.domain([0, d3.max(hdata, function(d){return d.earning;})]);
    hbary.domain(hdata.map(function(d) {return d.country;}));

    var hbars = hbar.selectAll(".hbar")
        .data(hdata)

    var hbaradd = hbars.enter().append("rect")
        .attr("class", "hbar")


    hbaradd.on("mouseover", function(d) {
            d3.select(this).transition()
                .duration('50')
                .style("fill", "#4997B3");

            div.transition()
                .duration(1000)
                .style("opacity", .9);
            div.html(d.country + "<br/>"  + "Earning Elasticity: " + d.earning)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
        .on("mouseout", function(d, i) {
            d3.select(this).transition().duration('50').style("fill", function(d) {
                if (d.country == "United States") {
                    return "#FFAA4D"
                }
                else {
                    return "#9CE5FF"
                }});
            div.transition()
                .duration(200)
                .style("opacity", 0);

        });

    hbars.merge(hbaradd).transition().duration(1000)
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

    var yAxisbar = d3.axisLeft(hbary)

    // add the y Axis
    d3.select(".y-axis").transition().duration(1000).call(yAxisbar);



    hbars.exit().remove()


}
