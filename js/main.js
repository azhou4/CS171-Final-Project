// Constants
const races = ['white', 'black', 'hisp', 'asian', 'natam', 'other'];
const genders = ['male', 'female'];
const pctiles = ['p1', 'p25', 'p50', 'p75', 'p100'];
const colors = {
    darkOrange: "#B37029",
    gray: "#756966",
    blue: "#4997B3",
    lightBlue: "#9CE5FF",
    brightOrange: "#FFAA4D"
};

let map;
let pcp;
let barChart;

// Load data
queue()
    .defer(d3.csv, "data/internationalmobility.csv")
    .defer(d3.json, "data/sankey-formatted.json")
    .defer(d3.json, "data/kir_top20_county.json")
    .defer(d3.json, "data/kir_county.json")
    .await(function(error, internationalMobility, sankeyData, top20KirData, aveKirData){
        sankeyDiagram = new SankeyDiagram(sankeyData);
        barChart = new BarChart(internationalMobility);
        map = new MapVis(top20KirData);
        pcp = new PcpVis(aveKirData);
    });

const updateBarChart = () => barChart.updateVis();
const updateVis = point => map.updateVis(point);
const updatePcp = () => pcp.updateVis(null);

function updateHometown() {
    document.getElementById("amy").innerHTML = "You are currently viewing " + document.getElementById("hometown").value + "."
}

const myLayout = new fullpage('#fullpage', {
    //options here
    anchors:['home', 'section1', 'section2', 'section3', 'section4', 'section5', 'section6', 'section7', 'section8', 'section9', 'section10'],
    menu: "#mainNav",
    navigation: true,
    navigationPosition: 'right',
    showActiveTooltip: false,
    navigationTooltips: [],
    licenseKey: 'OPEN-SOURCE-GPLV3-LICENSE',
    normalScrollElements: '.dropdown-container, .dropdown-container2',
    autoScrolling:false,
    scrollHorizontally: true,
    fitToSection: true,
    fitToSectionDelay: 1000,
    paddingTop: '3em',
    paddingBottom: '10px',
    responsiveWidth: 0,
    responsiveHeight: 0,
    responsiveSlides: false,
});

fullpage_api.setAllowScrolling(true);