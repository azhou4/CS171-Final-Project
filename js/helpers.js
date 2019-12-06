
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

function translateGenderCode(genderCode) {
    return genderCode[0].toUpperCase() + genderCode.slice(1,);
}