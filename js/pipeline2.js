// Sankey diagram of USA Races and Income Percentiles
// Referenced from https://bost.ocks.org/mike/sankey/

// predefined color scale used for sankey diagram buckets
var scale_color = d3.scaleOrdinal(d3.schemeCategory20c);

//creation of graph margins
var sankey_margin = {top: 15, right: 15, bottom: 15, left: 15},
    width = 880 - sankey_margin.left - sankey_margin.right,
    height = 480 - sankey_margin.top - sankey_margin.bottom;

// appending the svg canvas to page
var svg = d3.select("#pipeline2").append("svg")
    .attr("width", width + sankey_margin.left + sankey_margin.right)
    .attr("height", height + sankey_margin.top + sankey_margin.bottom)
    .append("g")
    .attr("transform","translate(" + sankey_margin.left + ","+ sankey_margin.top + ")")


// Using d3 sankey library - set properties and layout - predefined
var sankey = d3.sankey()
    .nodeWidth(36)
    .nodePadding(40)
    .size([width, height]);

// sankey.link creates path between buckets
var direction = sankey.link();

// load the data provided by opportunity insights - json format
d3.json("data/sankey-formatted.json", function(info, grid) {

    sankey
        .nodes(grid.nodes)
        .links(grid.links)
        .layout(25);

// Define the div for the tooltip
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

// create the links that flow between the buckets
    var flow = svg.append("g").selectAll(".link")
        .data(grid.links)
        .enter().append("path")
        .attr("class", "flow")
        .attr("d", direction)
        .style("stroke-width", function(d) { return Math.max(1, d.dy); })
        .sort(function(begin, end) { return end.dy - begin.dy; });

    // add tooltip functionality
    flow.on("mouseover", function(d) {
        d3.select(this).transition()
            .duration('25')

        div.transition()
            .duration(900)
            .style("opacity", .9);
        div.html(d.source.race + " -> " + d.target.race + "<br/>" + d.value + "%")
            .style("left", (d3.event.pageX) + "px")
            .style("top", (d3.event.pageY - 40) + "px");
    })
        .on("mouseout", function(d, i) {
            d3.select(this).transition().duration('50')
            div.transition()
                .duration(200)
                .style("opacity", 0);

        });





// add titles to the link connections
    flow.append("title")
        .text(function(d) {return d.source.race + "→" + d.target.race + "\n" + (d.value); });

// create the nodes to represent each race and income percentile bucket
    var buckets = svg.append("g").selectAll(".node")
        .data(grid.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(a) {
            return "translate(" + a.x + "," + a.y + ")"; })
        .call(d3.drag().subject(function(a) { return a; })
            .on("start", function() {
                this.parentNode.appendChild(this); })
            .on("drag", bucketSlide));

// rectangles are created for the nodes of the sankey graph
    buckets.append("rect")
        .attr("height", function(d) { return d.dy; })
        .attr("width", sankey.nodeWidth())
        .style("fill", function(d) {
            return d.scale_color = scale_color(d.race.replace(/ .*/, "")); })
        .style("stroke", function(d) {return d3.rgb(d.scale_color).darker(23); })
        .append("title")
        .text(function(d) {
            return d.race + "\n" +  "100% Representation"; });

// titles for the nodes, races and income percentile labels
    buckets.append("text")
        .attr("x", -6)
        .attr("y", function(d) { return d.dy / 2; })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function(d) { return d.race; })
        .filter(function(d) { return d.x < width / 2; })
        .attr("x", 6 + sankey.nodeWidth())
        .attr("text-anchor", "start");

// the function for moving the buckets up and down and left to right
    function bucketSlide(a) {
        d3.select(this).attr("transform",
            "translate(" + (a.x = Math.max(0, Math.min(width - a.dx, d3.event.x))) + "," + (
                a.y = Math.max(0, Math.min(height - a.dy, d3.event.y))) + ")");
        sankey.relayout();
        flow.attr("d", direction);
    }

});
