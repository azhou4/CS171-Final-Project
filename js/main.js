/* main JS file */
d3.csv("data/cleaned_outcomes.csv", data => {
    console.log(data);
    const map = new MapVis(data);
    // map.initVis();
});
console.log("Hello JS world!");
