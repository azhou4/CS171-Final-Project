// gets the width of the bounding div element
var graph_width = d3.select('div#graph-ws').node().getBoundingClientRect().width,

// include an SVG to hold the stats
var stats_width = d3.select('div.percentile').node().getBoundingClientRect().width,

// dimensions for the HTML Canvas element
var canvas = { w: graph_width, h: 12 * graph_width/16 },
var margin = { left: 10, bottom: 10, right: 10, top: 10 },
var text_container = {w: 120, h: 64};


var div_mr = d3.select('#graph-mr')
    .append('div')
    .style('position', 'relative')
    .style('left', '0px')
    .style('top', '0px')
    .style('width', canvas.w + 'px')
    .style('height', canvas.h + 'px')
    .style('display', 'inline-block');

// Initialize a canvas element
var regl = createREGL({container: div_mr.node()});

// Origination of the pipe to the destination of the pipe
// we use the element ID's to target the locations
var origination = d3.select('#stats-origin-mr')
    .append('svg')
    .attr('height', canvas.h)
    .attr('width', stats_width/2)
    .style('display', 'inline');

var destination = d3.select('#stats-mr')
    .append('svg')
    .attr('height', canvas.h)
    .attr('width', stats_width)
    .style('display', 'inline');

//Use this to calculate the size of the pixels on the screen
var dpi = window.devicePixelRatio;

// Have yet to link to dataset


function graph_flow(a,race, child, parent ) {
    current_percentile = parent;

}

function income_scale();
