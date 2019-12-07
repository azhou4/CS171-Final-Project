// Constants
const races = ['white', 'black', 'hisp', 'asian', 'natam', 'other'];
const genders = ['male', 'female'];
const pctiles = ['p1', 'p25', 'p50', 'p75', 'p100'];
const colors = {
    orange: "#B37029"
}

let map;
let pcp;
let pie;
queue()
    .defer(d3.json, "data/kir_top20_county.json")
    .defer(d3.json, "data/kir_county.json")
    .await(function(error, top20KirData, aveKirData){
        map = new MapVis(top20KirData);
        pcp = new PcpVis(aveKirData);
    });

const updateVis = point => map.updateVis(point);
const updatePcp = () => pcp.updateVis(null);

function updateHometown() {
    console.log("update hometown")
    console.log(document.getElementById("amy"))
    document.getElementById("amy").innerHTML = "You are currently viewing " + document.getElementById("hometown").value + "."
}


//console.log("You are currently viewing " + document.getElementById("hometown").value)


var myLayout = new fullpage('#fullpage', {
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

//methods
fullpage_api.setAllowScrolling(true);

//Autocomplete
//
// function autocomplete(inp, arr) {
//     /*the autocomplete function takes two arguments,
//     the text field element and an array of possible autocompleted values:*/
//     var currentFocus;
//     /*execute a function when someone writes in the text field:*/
//     inp.addEventListener("input", function (e) {
//         var a, b, i, val = this.value;
//         /*close any already open lists of autocompleted values*/
//         closeAllLists();
//         if (!val) {
//             return false;
//         }
//         currentFocus = -1;
//         /*create a DIV element that will contain the items (values):*/
//         a = document.createElement("DIV");
//         a.setAttribute("id", this.id + "autocomplete-list");
//         a.setAttribute("class", "autocomplete-items");
//         /*append the DIV element as a child of the autocomplete container:*/
//         this.parentNode.appendChild(a);
//         /*for each item in the array...*/
//         for (i = 0; i < arr.length; i++) {
//             /*check if the item starts with the same letters as the text field value:*/
//             if (arr[i].substr(0, val.length).toUpperCase() == val.toUpperCase()) {
//                 /*create a DIV element for each matching element:*/
//                 b = document.createElement("DIV");
//                 /*make the matching letters bold:*/
//                 b.innerHTML = "<strong>" + arr[i].substr(0, val.length) + "</strong>";
//                 b.innerHTML += arr[i].substr(val.length);
//                 /*insert a input field that will hold the current array item's value:*/
//                 b.innerHTML += "<input type='hidden' value='" + arr[i] + "'>";
//                 /*execute a function when someone clicks on the item value (DIV element):*/
//                 b.addEventListener("click", function (e) {
//                     /*insert the value for the autocomplete text field:*/
//                     inp.value = this.getElementsByTagName("input")[0].value;
//                     /*close the list of autocompleted values,
//                     (or any other open lists of autocompleted values:*/
//                     closeAllLists();
//                 });
//                 a.appendChild(b);
//             }
//         }
//     });
//     /*execute a function presses a key on the keyboard:*/
//     inp.addEventListener("keydown", function (e) {
//         var x = document.getElementById(this.id + "autocomplete-list");
//         if (x) x = x.getElementsByTagName("div");
//         if (e.keyCode == 40) {
//             /*If the arrow DOWN key is pressed,
//             increase the currentFocus variable:*/
//             currentFocus++;
//             /*and and make the current item more visible:*/
//             addActive(x);
//         } else if (e.keyCode == 38) { //up
//             /*If the arrow UP key is pressed,
//             decrease the currentFocus variable:*/
//             currentFocus--;
//             /*and and make the current item more visible:*/
//             addActive(x);
//         } else if (e.keyCode == 13) {
//             /*If the ENTER key is pressed, prevent the form from being submitted,*/
//             e.preventDefault();
//             if (currentFocus > -1) {
//                 /*and simulate a click on the "active" item:*/
//                 if (x) x[currentFocus].click();
//             }
//         }
//     });
//
//     function addActive(x) {
//         /*a function to classify an item as "active":*/
//         if (!x) return false;
//         /*start by removing the "active" class on all items:*/
//         removeActive(x);
//         if (currentFocus >= x.length) currentFocus = 0;
//         if (currentFocus < 0) currentFocus = (x.length - 1);
//         /*add class "autocomplete-active":*/
//         x[currentFocus].classList.add("autocomplete-active");
//     }
//
//     function removeActive(x) {
//         /*a function to remove the "active" class from all autocomplete items:*/
//         for (var i = 0; i < x.length; i++) {
//             x[i].classList.remove("autocomplete-active");
//         }
//     }
//
//     function closeAllLists(elmnt) {
//         /*close all autocomplete lists in the document,
//         except the one passed as an argument:*/
//         var x = document.getElementsByClassName("autocomplete-items");
//         for (var i = 0; i < x.length; i++) {
//             if (elmnt != x[i] && elmnt != inp) {
//                 x[i].parentNode.removeChild(x[i]);
//             }
//         }
//     }
//
//     /*execute a function when someone clicks in the document:*/
//     document.addEventListener("click", function (e) {
//         closeAllLists(e.target);
//     });
// }
//
//
// var race = ["Asian", "White", "Black", "Hispanic", "Other"];
// var income = ["0 - 20k", "20 - 40k", "40 - 60k", "60 - 80k", "80 - 100k", "100 - 120k", "120 - 140k", "140 - 200k", "200k+"];
// var hometown = ["New York", "Chicago", "San Francisco", "Boston"];
// autocomplete(document.getElementById("myInput"), race);
// autocomplete(document.getElementById("Input3"), income);
// autocomplete(document.getElementById("Input2"), hometown);
