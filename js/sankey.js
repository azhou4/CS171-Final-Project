// Sankey diagram of USA Races and Income Percentiles
// Referenced from https://bost.ocks.org/mike/sankey/
class SankeyDiagram {

    constructor(data) {
        this.data = data;
        // predefined color scale used for sankey diagram buckets
        this.scale_color = d3.scaleOrdinal(d3.schemeCategory20c);
        const margin = {top: 15, right: 15, bottom: 15, left: 15};
        this.width = 880 - margin.left - margin.right;
        this.height = 480 - margin.top - margin.bottom;
        this.svg = d3.select("#pipeline2").append("svg")
            .attr("width", this.width + margin.left + margin.right)
            .attr("height", this.height + margin.top + margin.bottom)
            .append("g")
            .attr("transform","translate(" + margin.left + ","+ margin.top + ")")
        // Using d3 sankey library - set properties and layout - predefined
        this.sankey = d3.sankey()
            .nodeWidth(36)
            .nodePadding(40)
            .size([this.width, this.height]);
        // sankey.link creates path between buckets
        this.direction = this.sankey.link();
        this.sankey
            .nodes(this.data.nodes)
            .links(this.data.links)
            .layout(25);
        this.flow = this.makeLinks();
        this.createBuckets();
    }

    makeLinks() {
        const vis = this;
        // Define the div for the tooltip
        const div = d3.select("body").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);
        // create the links that flow between the buckets
        const flow = vis.svg.append("g").selectAll(".link")
            .data(vis.data.links)
            .enter().append("path")
            .attr("class", "flow")
            .attr("d", vis.direction)
            .style("stroke-width", function(d) { return Math.max(1, d.dy); })
            .sort(function(begin, end) { return end.dy - begin.dy; });

        // add tooltip functionality
        flow.on("mouseover", function(d) {
            d3.select(this).transition()
                .duration('25')

            div.transition()
                .duration(900)
                .style("opacity", .9);
            div.html( d.value + "% of " + d.source.race + " people land in the  " + d.target.race + "<br/>" )
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
        return flow;
    }

    createBuckets() {
        const vis = this;
        // create the nodes to represent each race and income percentile bucket
        const buckets = vis.svg.append("g").selectAll(".node")
            .data(vis.data.nodes)
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
            .attr("width", vis.sankey.nodeWidth())
            .style("fill", function(d) {
                return d.scale_color = vis.scale_color(d.race.replace(/ .*/, "")); })
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
            .filter(function(d) { return d.x < vis.width / 2; })
            .attr("x", 6 + vis.sankey.nodeWidth())
            .attr("text-anchor", "start");

        // the function for moving the buckets up and down and left to right
        function bucketSlide(a) {
            d3.select(this).attr("transform",
                "translate(" + (a.x = Math.max(0, Math.min(width - a.dx, d3.event.x))) + "," + (
                    a.y = Math.max(0, Math.min(vis.height - a.dy, d3.event.y))) + ")");
            vis.sankey.relayout();
            vis.flow.attr("d", vis.direction);
        }
    }
}