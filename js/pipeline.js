var page_margin = {top: 10, right: 10, bottom: 10, left: 10},
    sankey_width = 450 - page_margin.left - page_margin.right,
    sankey_height = 480 - page_margin.top - page_margin.bottom;

// append the svg object to the body of the page
var sankeysvg = d3.select("#pipeline").append("svg")
    .attr("height", sankey_height + page_margin.top + page_margin.bottom + 100)
    .attr("width", sankey_width + page_margin.left + page_margin.right + 200 )
    .append("g")
    .attr("transform",
        "translate(" + page_margin.left + "," + page_margin.top + ")");

// Color scale used
var color = d3.scaleOrdinal(d3.schemeCategory20);

// Set the sankey diagram properties
var sankey = d3.sankey()
    .nodePadding(10)
    .nodeWidth(36)
    .size([sankey_width, sankey_height]);

// load the data
d3.json("data/pipelineData.json", function(error, graph) {


    //use the default settings for sankey

    sankey
        .nodes(graph.nodes)
        .links(graph.links)
        .layout(1);

    // create the buckets
    var node = sankeysvg.append("g")
        .selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("transform", function(a) { return "translate(" + a.x + "," + a.y + ")"; })
        .call(d3.drag()
            .subject(function(a) { return a; })
            .on("start", function() { this.parentNode.appendChild(this); })
            .on("drag", nodeSlide));

    // create the links between the buckets of data
    var flow = sankeysvg.append("g")
        .selectAll(".link")
        .data(graph.links)
        .enter()
        .append("path")
        .attr("class", "flow")
        .attr("d", sankey.link() )
        .style("stroke-width", function(d) { return Math.max(1, d.dy); })
        .sort(function(begin, end) { return end.dy - begin.dy; });



    // add the rectangles for the nodes and create text that hovers
    node
        .append("rect")
        .attr("height", function(d) { return d.dy - 20; })
        .attr("width", sankey.nodeWidth())
        .style("fill", function(x) { return x.color = color(x.race.replace(/ .*/, "")); })
        .style("stroke", function(x) { return d3.rgb(x.color); })
        .text(function(a) { return a.race + "\n"  + a.value })
        .append("title");

    function nodeSlide(d) {
        d3.select(this)
            .attr("transform", "translate("  + (d.x) + ","  + (d.y = Math.max(0, Math.min(sankey_height - d.dy + 300, d3.event.y))
            ) + ")");
        sankey.relayout();
        flow.attr("d", sankey.link() );
    }

    // add in the title for the nodes
    node
        .append("text")
        .attr("x", -5)
        .attr("y", function(a) { return a.dy / 2; })
        .attr("dy", ".35em")
        .attr("text-anchor", "end")
        .attr("transform", null)
        .text(function(a) { return a.race; })
        .filter(function(a) { return a.x < sankey_width / 2; })
        .attr("x", 5 + sankey.nodeWidth())
        .attr("text-anchor", "start");

    // the function for moving the nodes


});