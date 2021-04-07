const HttpError = require("../models/http-error");
const { v4: uuidv4 } = require("uuid");


let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Canton Tower",
    description:
      "The Canton Tower, formally Guangzhou TV Astronomical and Sightseeing Tower, is a 604-meter-tall multipurpose observation tower in the Haizhu District of Guangzhou. The tower was topped out in 2009 and it became operational on 29 September 2010 for the 2010 Asian Games",
    image: "https://www.chinadiscovery.com/assets/images/travel-guide/guangzhou/canton-tower/canton-tower-768-1.jpg",
    address: "Yuejiang W Rd, Haizhu District, Guangzhou, Guangdong Province, China",
    location: {
      lat: 23.10748,
      lng: 113.3226476,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Canton Tower",
    description:
      "The Canton Tower, formally Guangzhou TV Astronomical and Sightseeing Tower, is a 604-meter-tall multipurpose observation tower in the Haizhu District of Guangzhou. The tower was topped out in 2009 and it became operational on 29 September 2010 for the 2010 Asian Games",
    image: "https://www.chinadiscovery.com/assets/images/travel-guide/guangzhou/canton-tower/canton-tower-768-1.jpg",
    address: "Yuejiang W Rd, Haizhu District, Guangzhou, Guangdong Province, China",
    location: {
      lat: 23.10748,
      lng: 113.3226476,
    },
    creator: "u2",
  },
];



const getPlaceByID = (req, res, next) => {
  const placeID = req.params.pid;

  const place = DUMMY_PLACES.find((p) => {
    return p.id === placeID;
  });

  if (!place) {
    throw new HttpError("Could not find a place for the provided ID", 404);
  }

  console.log("Get req in places like this");
  res.json({ place });
};



const getPlacesByUserID = (req, res, next) => {
  const uID = req.params.uid;
  const places = DUMMY_PLACES.filter((p) => {
    return p.creator === uID;
  });

  if (!places || places.length === 0) {
    return next(new HttpError("Could not find a place for the provided user ID", 404));
  }

  res.json({ places });
};


const createPlace = (req,res,next)=>{
    const {title,description,coordinates,address,creator} = req.body;

    const createdPlace = {
      id: uuidv4(),
      title,
      description,
      location: coordinates,
      address,
      creator,
    };

    DUMMY_PLACES.push(createdPlace);

    res.status(201).json({place:createdPlace})

}

const patchPlace = (req,res,next)=>{

  const { title, description} = req.body;
  const placeId = req.params.pid

  const updatePlace = {...DUMMY_PLACES.find(p=>{return p.id === placeId})}
  const placeIndex = DUMMY_PLACES.findIndex(p=>p.id===placeId)
  updatePlace.title = title
  updatePlace.description = description;

  DUMMY_PLACES[placeIndex] = updatePlace;

res.status(200).json({ place: updatePlace });



}


const deletePlace = (req,res,next)=>{

    const placeID = req.params.pid
    DUMMY_PLACES = DUMMY_PLACES.filter((p) => p.id != placeID);

    res.status(200).json({message:"Place Deleted"})

}


exports.getPlaceByID = getPlaceByID;
exports.getPlacesByUserID = getPlacesByUserID;
exports.createPlace = createPlace;
exports.patchPlace = patchPlace;
exports.deletePlace = deletePlace;



