const HttpError = require("../models/http-error");
const {validationResult} = require("express-validator")
const getCoordsFromAddress = require("../util/location")
const Place = require("../models/place")
const User = require("../models/user");
const mongooseUniqueValidator = require("mongoose-unique-validator");
const mongoose = require("mongoose")




const getPlaceByID = async (req, res, next) => {
  const placeID = req.params.pid;

  let place
  try{

    place = await Place.findById(placeID);
    
  }catch(e){
    const error =  new HttpError("Something went wrong, couldn't find the place for the requested ID",500)
    return next(error)
  }

  if (!place) {
    const error = new HttpError("Could not find a place for the provided ID", 404);
    return next(error);
  }

  console.log("Get req in places like this");
  res.json({ place:place.toObject({getters:true}) });
};



const getPlacesByUserID = async (req, res, next) => {
  const userId = req.params.uid;

  // let places;
  let userWithPlaces;
  try {
    userWithPlaces = await User.findById(userId).populate("places");
  } catch (err) {
    const error = new HttpError("Fetching places failed, please try again later.", 500);
    return next(error);
  }

  // if (!places || places.length === 0) {
  if (!userWithPlaces ) {
    return next(new HttpError("Could not find places for the provided user id.", 404));
  }

  res.json({ places: userWithPlaces.places.map((place) => place.toObject({ getters: true })) });
};


const createPlace = async (req,res,next)=>{

  const errors = validationResult(req);

  if (!errors.isEmpty()){
    console.log(errors)
     return next (new HttpError("Invalid input passed, please check your data.", 422))
  }

    const {title,description,address,creator} = req.body;

   

      let coords
      try {
        coords = await getCoordsFromAddress(address);
      } catch (error) {
        return next( new HttpError("Couldn't find place"),404)
      }
    
      let test = {
        lat:coords.lat,
        lng:coords.lng,
      }

    const createdPlace = new Place({
      title,
      description,
      address,
      location: test,
      image: "https://i.pinimg.com/originals/e8/c7/c4/e8c7c4d4e14a9e3b21faf3d7b37c5b03.jpg",
      creator,
    });


    let user
    try {
        user = await User.findById(creator)
    } catch (error) {
      const err = new HttpError("Creating place failed please try again",500)
      return next(err)
    }

    if (!user){
      const err = new HttpError("Couldn't find user for given ID", 404)
      return next(err)
    }


    try{
      const sess = await mongoose.startSession();
      sess.startTransaction()
      await createdPlace.save({session:sess})
      user.places.push(createdPlace)
      await user.save({session:sess})
      sess.commitTransaction();

    }catch(e){
      
      console.log(e);
      const error = new HttpError("Creating place failed, please try again.",500)
      return next(error)
    }

    

    res.status(201).json({place:createdPlace})

}

const patchPlace = async (req,res,next)=>{


  const errors = validationResult(req);

  if(!errors.isEmpty()){
    const err = new HttpError("Invalid input data passed, please check your data.", 422)
    return next(err)
  }

  const { title, description} = req.body;
  const placeId = req.params.pid


  let place;
  try{
    place = await Place.findById(placeId);

  }catch(e){
    const err = new HttpError("Something went wrong, couldn't update places.",500)
    return next(err)
  }

 
  place.title = title
  place.description = description;
  
  try{
    await place.save()
  }catch(e){
    const err = new HttpError("Something went wrong, couldn't update places.", 500)
    return next(err)
  }
  

res.status(200).json({ place: place.toObject({getters:true}) });



}


const deletePlace = async (req,res,next)=>{

    const placeID = req.params.pid

    let place

    try{
      place = await Place.findById(placeID).populate('creator')
    }catch(e){
      const err = new HttpError("Something went wrong, couldn't delete place.",500)
      return next(err)
    }

    if(!place){
      const err = new HttpError("Couldn't find place for this ID",404)
      return next(err)
    }
    
    try {
      const sess = await mongoose.startSession()
      sess.startTransaction()
      await place.remove({session:sess})
      place.creator.places.pull(place);
      await place.creator.save({ session: sess });
      await sess.commitTransaction();

    } catch (error) {
      const err = new HttpError("Something went wrong, couldn't delete place.", 500);
      return next(err)
    }
    console.log("Place deleted");
    res.status(200).json({message:"Place Deleted"})



}


exports.getPlaceByID = getPlaceByID;
exports.getPlacesByUserID = getPlacesByUserID;
exports.createPlace = createPlace;
exports.patchPlace = patchPlace;
exports.deletePlace = deletePlace;



