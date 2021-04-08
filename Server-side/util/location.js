const axios = require("axios");
const got = require("got");
const HttpError = require("../models/http-error");
const { urlencoded } = require("body-parser");


const API_KEY = "pk.65d2a5e545a5bbc1be48fc96d2a88f9a";

async function getCoordsFromAddress(address){

    const params = {
        access_key:API_KEY,
        query:address
    }
let response;
    try {
 response = await axios.get(
  "https://us1.locationiq.com/v1/search.php?key=" + API_KEY + "&q=" + encodeURIComponent(address) + "&format=json"
);

    }catch(e){
        throw new HttpError("Couldn't find place",404)
    }
    
    const data = response.data;
    if(!data || data.length == 0){
        const error = new HttpError("Could not find coordinates for the specified address.", 422)
        throw error
    }

    const lat = data[0].lat
    const lng = data[0].lon

    return {lat,lng}
    
    

}



module.exports = getCoordsFromAddress