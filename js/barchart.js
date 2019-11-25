var margin = {top: 20, right: 20, bottom: 30, left: 40},
    barwidth = 600 - margin.left - margin.right,
    barheight = 400 - margin.top - margin.bottom;

// set the ranges
var barx = d3.scaleBand()
    .range([0, barwidth])
    .padding(0.1);
var bary = d3.scaleLinear()
    .range([barheight, 0]);

// append the svg object to the body of the page
// append a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var barsvg = d3.select("#bar-chart").append("svg")
    .attr("width", barwidth + margin.left + margin.right)
    .attr("height", barheight + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");




    // get the data
    d3.csv("data/sales.csv", function(error, data) {
        console.log("sales", data)
        if (error) throw error;

        // format the data
        data.forEach(function (d) {
            d.sales = +d.sales;
        });

        barx.domain(data.map(function(d) { return d.salesperson; }));
        bary.domain([0, d3.max(data, function(d) { return d.sales; })]);

        // append the rectangles for the bar chart
        barsvg.selectAll(".bar")
            .data(data)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return barx(d.salesperson); })
            .attr("width", barx.bandwidth())
            .attr("y", function(d) { return bary(d.sales); })
            .attr("height", function(d) { return barheight - bary(d.sales); })
            .style("fill", "#4997B3")
            .on("mouseover", function() {
                d3.select(this).select("rect")  //Selects the rect in this group
                    .attr("fill", "#82E0AA");
            })
            .on("mouseout", function() {
                d3.select(this).select("rect")  //Selects the rect in this group
                    .attr("fill", function(d) {
                        if (d > 20) {
                            return "DarkOrange";
                        }
                        return "#AED6F1";
                    });
            });;

        // add the x Axis
        barsvg.append("g")
            .attr("transform", "translate(0," + barheight + ")")
            .call(d3.axisBottom(barx));

        // add the y Axis
        barsvg.append("g")
            .call(d3.axisLeft(bary));

        barsvg.append("text")
            .attr("x", 250)
            .attr("y", 380)
            .text("Race");

        barsvg.append("text")
            .attr("x", -40)
            .attr("y", -8)
            .text("Income Percentile");

    })



    // Scale the range of the data in the domains



