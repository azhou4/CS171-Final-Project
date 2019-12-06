const piewidth = 460,
    pieheight = 400,
    chartRadius = pieheight / 2 - 40;

const color2 = d3.scaleOrdinal(d3.schemeCategory10);

let piesvg = d3.select('#pie').append('svg')
    .attr('width', piewidth)
    .attr('height', pieheight)
    .append('g')
    .attr('transform', 'translate(' + piewidth / 2 + ',' + pieheight / 2 + ')');

let tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip');

const PI = Math.PI,
    arcMinRadius = 10,
    arcPadding = 10,
    labelPadding = -5,
    numTicks = 10;


d3.csv('data/energy.csv', (error, data) => {
    console.log("ENERGY", data)
    let scale = d3.scaleLinear()
        .domain([0, 100])
        .range([0, 2 * PI]);

    let ticks = scale.ticks(numTicks).slice(0, -1);
    let keys = data.map((d, i) => d.name);
    //number of arcs
    const numArcs = keys.length;
    const arcWidth = (chartRadius - arcMinRadius - numArcs * arcPadding) / numArcs;

    let arc = d3.arc()
        .innerRadius((d, i) => getInnerRadius(i))
        .outerRadius((d, i) => getOuterRadius(i))
        .startAngle(0)
        .endAngle((d, i) => scale(d))

    let radialAxis = piesvg.append('g')
        .attr('class', 'r axis')
        .selectAll('g')
        .data(data)
        .enter().append('g');

    radialAxis.append('circle')
        .attr('r', (d, i) => getOuterRadius(i) + arcPadding);

    radialAxis.append('text')
        .attr('x', labelPadding)
        .attr('y', (d, i) => -getOuterRadius(i) + arcPadding)
        .text(d => d.name);

    let axialAxis = piesvg.append('g')
        .attr('class', 'a axis')
        .selectAll('g')
        .data(ticks)
        .enter().append('g')
        .attr('transform', d => 'rotate(' + (rad2deg(scale(d)) - 90) + ')');

    axialAxis.append('line')
        .attr('x2', chartRadius);

    axialAxis.append('text')
        .attr('x', chartRadius + 10)
        .style('text-anchor', d => (scale(d) >= PI && scale(d) < 2 * PI ? 'end' : null))
        .attr('transform', d => 'rotate(' + (90 - rad2deg(scale(d))) + ',' + (chartRadius + 10) + ',0)')
        .text(d => d);

    //data arcs
    let arcs = piesvg.append('g')
        .attr('class', 'data')
        .selectAll('path')
        .data(data)
        .enter().append('path')
        .attr('class', 'arc')
        .style('fill', (d, i) => color2(i))

    arcs.transition()
        .delay((d, i) => i * 200)
        .duration(1000)
        .attrTween('d', arcTween);

    arcs.on('mousemove', showTooltip)
    arcs.on('mouseout', hideTooltip)


    function arcTween(d, i) {
        let interpolate = d3.interpolate(0, d.value);
        return t => arc(interpolate(t), i);
    }

    function showTooltip(d) {
        tooltip.style('left', (d3.event.pageX + 10) + 'px')
            .style('top', (d3.event.pageY - 25) + 'px')
            .style('display', 'inline-block')
            .html(d.value);
    }

    function hideTooltip() {
        tooltip.style('display', 'none');
    }

    function rad2deg(angle) {
        return angle * 180 / PI;
    }

    function getInnerRadius(index) {
        return arcMinRadius + (numArcs - (index + 1)) * (arcWidth + arcPadding);
    }

    function getOuterRadius(index) {
        return getInnerRadius(index) + arcWidth;
    }
});

// class PieVis {
//     constructor(college, communitycoll, highschool, graduation) {
//         this.collegedata = college;
//         this.commcolldata = communitycoll;
//         this.hsdata = highschool;
//         this.graddata = graduation;
//         const margin = {top: 30, right: 10, bottom: 10, left: 0};
//         this.width = 960 - margin.left - margin.right;
//         this.height = 500 - margin.top - margin.bottom;
//         this.chartRadius = this.height / 2 - 40;
//         this.color = d3.scaleOrdinal(d3.schemeCategory10);
//
//         this.svg = d3.select('pie').append('svg')
//             .attr('width', this.width)
//             .attr('height', this.height)
//             .append('g')
//             .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');
//
//         const PI = Math.PI,
//             arcMinRadius = 10,
//             arcPadding = 10,
//             labelPadding = -5,
//             numTicks = 10;
//
//         this.scale = d3.scaleLinear()
//             .domain([0, d3.max(data, d => d.value) * 1.1])
//             .range([0, 2 * PI]);
//
//         let ticks = this.scale.ticks(numTicks).slice(0, -1);
//         let keys = data.map((d, i) => d.name);
//         //number of arcs
//         const numArcs = keys.length;
//         const arcWidth = (chartRadius - arcMinRadius - numArcs * arcPadding) / numArcs;
//
//         let arc = d3.arc()
//             .innerRadius((d, i) => getInnerRadius(i))
//             .outerRadius((d, i) => getOuterRadius(i))
//             .startAngle(0)
//             .endAngle((d, i) => scale(d))
//
//         let radialAxis = svg.append('g')
//             .attr('class', 'r axis')
//             .selectAll('g')
//             .data(data)
//             .enter().append('g');
//
//         // unsure
//         this.tooltip = d3.select('body').append('div')
//             .attr('class', 'tooltip');
//     }
//
//     updateVis(county) {
//         const vis = this;
//
//     }
// }
//
//
//     radialAxis.append('circle')
//         .attr('r', (d, i) => getOuterRadius(i) + arcPadding);
//
//     radialAxis.append('text')
//         .attr('x', labelPadding)
//         .attr('y', (d, i) => -getOuterRadius(i) + arcPadding)
//         .text(d => d.name);
//
//     let axialAxis = svg.append('g')
//         .attr('class', 'a axis')
//         .selectAll('g')
//         .data(ticks)
//         .enter().append('g')
//         .attr('transform', d => 'rotate(' + (rad2deg(scale(d)) - 90) + ')');
//
//     axialAxis.append('line')
//         .attr('x2', chartRadius);
//
//     axialAxis.append('text')
//         .attr('x', chartRadius + 10)
//         .style('text-anchor', d => (scale(d) >= PI && scale(d) < 2 * PI ? 'end' : null))
//         .attr('transform', d => 'rotate(' + (90 - rad2deg(scale(d))) + ',' + (chartRadius + 10) + ',0)')
//         .text(d => d);
//
//     //data arcs
//     let arcs = svg.append('g')
//         .attr('class', 'data')
//         .selectAll('path')
//         .data(data)
//         .enter().append('path')
//         .attr('class', 'arc')
//         .style('fill', (d, i) => color(i))
//
//     arcs.transition()
//         .delay((d, i) => i * 200)
//         .duration(1000)
//         .attrTween('d', arcTween);
//
//     arcs.on('mousemove', showTooltip)
//     arcs.on('mouseout', hideTooltip)
//
//
//     function arcTween(d, i) {
//         let interpolate = d3.interpolate(0, d.value);
//         return t => arc(interpolate(t), i);
//     }
//
//     function showTooltip(d) {
//         tooltip.style('left', (d3.event.pageX + 10) + 'px')
//             .style('top', (d3.event.pageY - 25) + 'px')
//             .style('display', 'inline-block')
//             .html(d.value);
//     }
//
//     function hideTooltip() {
//         tooltip.style('display', 'none');
//     }
//
//     function rad2deg(angle) {
//         return angle * 180 / PI;
//     }
//
//     function getInnerRadius(index) {
//         return arcMinRadius + (numArcs - (index + 1)) * (arcWidth + arcPadding);
//     }
//
//     function getOuterRadius(index) {
//         return getInnerRadius(index) + arcWidth;
//     }
// });
