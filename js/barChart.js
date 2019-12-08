// horizontal bar chart
class BarChart {

    constructor(data) {
        this.data = data;
        this.margin = {top: 20, right: 20, bottom: 30, left: 40};
        this.barwidth = 700 - this.margin.left - this.margin.right;
        this.barheight = 500 - this.margin.top - this.margin.bottom;
        this.hbarx = d3.scaleLinear()
            .range([0, this.barwidth-100]);
        this.hbary = d3.scaleBand()
            .range([this.barheight - 80, 0])
            .paddingInner(0.1);
        this.hbar = d3.select("#horizontal-bar")
            .append("svg")
            .attr("width", this.barwidth + this.margin.left + this.margin.right)
            .attr("height", this.barheight)
            .append("g")
            .attr("transform",
                "translate(" + (this.margin.left + 90) + "," + (this.margin.top) + ")");

        // Add axis labels
        this.hbar.append("text")
            .attr("x", 140)
            .attr("y", 420)
            .text("Intergenerational Earning Elasticity");
        this.hbar.append("text")
            .attr("x", -60)
            .attr("y", -8)
            .text("Country");

        // Add the X axis
        this.hbar.append("g")
            .style("font-size", "14px")
            .attr("transform", "translate(0," + (this.barheight - 80) + ")")
            .transition().duration(1000).call(d3.axisBottom(this.hbarx));

        this.hbar.append("g")
            .attr("class", "axis y-axis")
            .style("font-size", "14px");
        this.updateVis("Highest to Lowest")
    }

    updateVis() {
        const vis = this;

        const val = document.getElementById("selection").value;
        if (val === "Alphabetical") {
            vis.data.sort(function(a,b) {
                const textA = a["country"]
                const textB = b["country"]
                return textB.localeCompare(textA)})
        }
        else if (val === "Highest to Lowest") {
            vis.data.sort(function(a,b) {return a["earning"] - b['earning']})
        }
        else {
            vis.data.sort(function(a,b) {return b['earning'] - a['earning']})
        }

        vis.hbarx.domain([0, d3.max(vis.data, function(d){return d.earning;})]);
        vis.hbary.domain(vis.data.map(function(d) {return d.country;}));

        var hbars = vis.hbar.selectAll(".hbar")
            .data(vis.data)

        var hbaradd = hbars.enter().append("rect")
            .attr("class", "hbar")

        // Tooltips and highlight on mouseover
        var div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        hbaradd.on("mouseover", function(d) {
            d3.select(this).transition()
                .duration('50')
                .style("fill", colors.blue);

            div.transition()
                .duration(1000)
                .style("opacity", .9);
            div.html(d.country + "<br/>"  + "Earning Elasticity: " + d.earning)
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 28) + "px");
        })
            .on("mouseout", function(d, i) {
                d3.select(this).transition()
                    .duration('50')
                    .style("fill", d => d.country === "United States" ? colors.brightOrange : colors.lightBlue);
                div.transition()
                    .duration(200)
                    .style("opacity", 0);
            });

        hbars.merge(hbaradd).transition().duration(1000)
            .attr("x", 0)
            .attr("width", function(d) {return vis.hbarx(d.earning)})
            .attr("y", function(d) { return vis.hbary(d.country);})
            .attr("height", vis.hbary.bandwidth())
            .style("fill", d => d.country === "United States" ? colors.brightOrange : colors.lightBlue);

        const yAxisbar = d3.axisLeft(vis.hbary);

        // add the y Axis
        d3.select(".y-axis").transition().duration(1000).call(yAxisbar);
        hbars.exit().remove()
    }
}