
function translateRaceCode(raceCode) {
    switch(raceCode) {
        case "hisp":
            return "Hispanic";
        case "natam":
            return "Native American";
        default:
            return raceCode[0].toUpperCase() + raceCode.slice(1,);
    }
}