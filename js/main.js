/* main JS file */
// Taken from https://dev.to/afewminutesofcode/how-to-convert-an-array-into-an-object-in-javascript-25a4
const convertArrayToObject = (array, key) => {
    const initialValue = {};
    return array.reduce((obj, item) => {
        return {
            ...obj,
            [item[key]]: item,
        };
    }, initialValue);
};

d3.json("data/kir.json", data => {
    // data = convertArrayToObject(data, 'tract');
    // console.log("new data:", data);
    const map = new MapVis(data);
    // map.initVis();
});
console.log("Hello JS world!");
