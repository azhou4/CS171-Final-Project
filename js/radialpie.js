class PieVis {

    constructor(collData, comcollData, hsData, gradData) {
        this.collegedata = collData;
        this.comcolldata = comcollData;
        this.hsdata = hsData;
        this.graddata = gradData;
        const margin = {top: 30, right: 10, bottom: 10, left: 0};
        this.width = 450 - margin.left - margin.right;
        this.height = 400 - margin.top - margin.bottom;
        this.color = d3.scaleOrdinal(d3.schemeCategory10);
        this.chartRadius = this.height / 2 - 40;
        this.svg = d3.select("#radial-pie")
            .append("svg")
            .attr("width", this.width + margin.left + margin.right)
            .attr("height", this.height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        this.PI = Math.PI,
            this.arcMinRadius = 10,
            this.arcPadding = 10,
            this.labelPadding = -5,
            this.numTicks = 10;

        this.scale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, 2 * this.PI]);

        this.ticks = this.scale.ticks(this.numTicks).slice(0, -1);

        // this.keys = data.map((d, i) => d.name);

        //number of arcs
        this.numArcs = 4;
        this.arcWidth = (this.chartRadius - this.arcMinRadius - this.numArcs * this.arcPadding) / this.numArcs;

        function getInnerRadius(index) {
            return arcMinRadius + (this.numArcs - (index + 1)) * (this.arcWidth + this.arcPadding);
        }

        function getOuterRadius(index) {
            return getInnerRadius(index) + this.arcWidth;
        }

        this.arc = d3.arc()
            .innerRadius((d, i) => getInnerRadius(i))
            .outerRadius((d, i) => getOuterRadius(i))
            .startAngle(0)
            .endAngle((d, i) => this.scale(d))


        // Initialize with Boston
        this.updateVis({countyName: "Suffolk", countyCode: "25025"})
    }

    updateVis(county) {

        const vis = this;
        function getInnerRadius(index) {
            return arcMinRadius + (vis.numArcs - (index + 1)) * (vis.arcWidth + arcPadding);
        }

        function getOuterRadius(index) {
            return getInnerRadius(index) + vis.arcWidth;
        }

        function rad2deg(angle) {
            return angle * 180 / vis.PI;
        }

        function arcTween(d, i) {
            let interpolate = d3.interpolate(0, d.value);
            return t => vis.arc(interpolate(t), i);
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

        let avePercentiles = [];
        // high school rates
        let hsPercentiles = [];
        vis.hsavg;
        for (const race of races) {
            //console.log(race);
            for (const gender of genders) {
                for (const pctile of pctiles) {
                    const hsPercentile = vis.hsdata["hs_" + race + "_" + gender + '_' + pctile][county.countyCode];
                    if (hsPercentile) {hsPercentiles.push({
                        "Race": translateRaceCode(race),
                        "Gender": translateGenderCode(gender),
                        "Parent Income Percentile": parseInt(pctile.slice(1)),
                        "Predicted Income Percentile": Math.round(100 * hsPercentile)
                    });
                    vis.hsavg = vis.hsavg + Math.round(100 * hsPercentile)
                    }
                }
            }
        }

        // college rates
        let collPercentiles = [];
        vis.collavg;
        for (const race of races) {
            console.log(race);
            for (const gender of genders) {
                for (const pctile of pctiles) {
                    const collPercentile = vis.collegedata["coll_" + race + "_" + gender + '_' + pctile][county.countyCode];
                    if (collPercentile) {collPercentiles.push({
                        "Race": translateRaceCode(race),
                        "Gender": translateGenderCode(gender),
                        "Parent Income Percentile": parseInt(pctile.slice(1)),
                        "Predicted Income Percentile": Math.round(100 * collPercentile)
                    });
                    vis.collavg = vis.collavg + Math.round(100 * collPercentile)
                    }
                }
            }
        }

        // community college rates
        let comcollPercentiles = [];
        vis.comcollavg;
        for (const race of races) {
            //console.log(race);
            for (const gender of genders) {
                for (const pctile of pctiles) {
                    const comcollPercentile = vis.comcolldata["comcoll_" + race + "_" + gender + '_' + pctile][county.countyCode];
                    if (comcollPercentile) {comcollPercentiles.push({
                        "Race": translateRaceCode(race),
                        "Gender": translateGenderCode(gender),
                        "Parent Income Percentile": parseInt(pctile.slice(1)),
                        "Predicted Income Percentile": Math.round(100 * comcollPercentile)
                    });
                    vis.comcollavg = vis.comcollavg + Math.round(100 * comcollPercentile);
                    }
                }
            }
        }

        // grad rates
        let gradPercentiles = [];
        vis.gradavg;
        for (const race of races) {
            //console.log(race);
            for (const gender of genders) {
                for (const pctile of pctiles) {
                    const gradPercentile = vis.graddata["grad_" + race + "_" + gender + '_' + pctile][county.countyCode];
                    if (gradPercentile) {gradPercentiles.push({
                        "Race": translateRaceCode(race),
                        "Gender": translateGenderCode(gender),
                        "Parent Income Percentile": parseInt(pctile.slice(1)),
                        "Predicted Income Percentile": Math.round(100 * gradPercentile)
                    });
                    vis.gradavg = vis.gradavg + Math.round(100 * gradPercentile);
                    }
                }
            }
        }

        vis.hsavg = vis.hsavg / hsPercentiles.length;
        vis.collavg = vis.collavg / collPercentiles.length;
        vis.comcollavg = vis.comcollavg  / comcollPercentiles.length;
        vis.gradavg = vis.gradavg  / gradPercentiles.length;

        avePercentiles.push({
            "name": "High School", "value": vis.hsavg
        })
        avePercentiles.push({
            "name": "Community College Graduate", "value": vis.comcollavg
        })
        avePercentiles.push({
            "name": "College Graduate", "value": vis.collavg
        })
        avePercentiles.push({
            "name": "Graduate Degree", "value": vis.gradavg
        })

        console.log("AVE", avePercentiles)

        vis.radialAxis = vis.svg.append('g')
            .attr('class', 'r axis')
            .selectAll('g')
            .data(avePercentiles)
            .enter().append('g');

        vis.radialAxis.append('circle')
            .attr('r', (d, i) => getOuterRadius(i) + vis.arcPadding);

        vis.radialAxis.append('text')
            .attr('x', vis.labelPadding)
            .attr('y', (d, i) => -getOuterRadius(i) + vis.arcPadding)
            .text(d => d.name);


        vis.axialAxis = vis.svg.append('g')
            .attr('class', 'a axis')
            .selectAll('g')
            .data(vis.ticks)
            .enter().append('g')
            .attr('transform', d => 'rotate(' + (rad2deg(vis.scale(d)) - 90) + ')');

        vis.axialAxis.append('line')
            .attr('x2', vis.chartRadius);

        vis.axialAxis.append('text')
            .attr('x', vis.chartRadius + 10)
            .style('text-anchor', d => (vis.scale(d) >= vis.PI && vis.scale(d) < 2 * vis.PI ? 'end' : null))
            .attr('transform', d => 'rotate(' + (90 - rad2deg(vis.scale(d))) + ',' + (vis.chartRadius + 10) + ',0)')
            .text(d => d);

        //data arcs
        vis.arcs = vis.svg.append('g')
            .attr('class', 'data')
            .selectAll('path')
            .data(avePercentiles)
            .enter().append('path')
            .attr('class', 'arc')
            .style('fill', (d, i) => vis.color(i))

        vis.arcs.transition()
            .delay((d, i) => i * 200)
            .duration(1000)
            .attrTween('d', arcTween);

        vis.arcs.on('mousemove', showTooltip)
        vis.arcs.on('mouseout', hideTooltip)
    }

}