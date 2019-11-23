/* main JS file */
d3.csv("data/cleaned_outcomes.csv", data => {
    console.log(data);
    const map = new MapVis(data);
    // map.initVis();
});
console.log("Hello JS world!");

var myLayout = new fullpage('#fullpage', {
    //options here
    anchors:['home', 'section1', 'section2', 'section3', 'section4', 'section5', 'section6'],
    menu: "#mainNav",
    navigation: true,
    navigationPosition: 'right',
    showActiveTooltip: false,
    navigationTooltips: [],
    licenseKey: 'OPEN-SOURCE-GPLV3-LICENSE',
    normalScrollElements: '.dropdown-container, .dropdown-container2',
    autoScrolling:true,
    scrollHorizontally: true
});

//methods
fullpage_api.setAllowScrolling(true);
