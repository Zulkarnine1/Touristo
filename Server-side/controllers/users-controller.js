const HttpError = require("../models/http-error")
const {validationResult} = require("express-validator")
const User = require("../models/user")






const getUsers = async (req,res,next)=>{

  let users

  try {
    users = await User.find({},'-password');
    
  } catch (error) {
    const err = new HttpError("Fetching users failed, please try again later")
    return next(err)
  }

  res.json({users:users.map(user =>{ return user.toObject({getters:true})})})
}

const createUser = async (req, res, next) => {
  

    const errors = validationResult(req);

    if(!errors.isEmpty()){
      const err = new HttpError("Invalid data passed, please check your data", 422)
      return next(err)
    }

    const {name, email, password} = req.body

    let existingUser; 
    try {
      existingUser = await User.findOne({email: email})
      
    } catch (error) {
      const err = new HttpError("Signing up failed, please try again later.",500)
      return next(err)
    }


    if (existingUser) {
      const err = new HttpError("Couldn't create user, user with same ID already exists", 422);
      return next(err)
    }

    const newUser = new User({
      name,
      email,
      image:req.file.path,
      password,
      places:[]
    });
    

    try {
      await newUser.save();
    } catch (e) {
      console.log(e);
      const error = new HttpError("Signing up failed, please try again.", 500);

      return next(error);
    }

    res.status(201).json({ message: "User created", user: newUser.toObject({getters:true}) });

};


const userLogin = async (req, res, next) => {

   

    const {email, password} = req.body

    let existingUser; 
    try {
      existingUser = await User.findOne({email: email})
      
    } catch (error) {
      const err = new HttpError("Signing in failed, please try again later.",500)
      return next(err)
    }

    if(!existingUser || existingUser.password != password){
      const err = new HttpError("Invalid credentials,signing in failed",401)
      return next(err)
    }
    
    res.json({message:"Logged in", user:existingUser.toObject({getters:true})})

};


exports.getUsers = getUsers
exports.createUser = createUser;
exports.userLogin = userLogin;