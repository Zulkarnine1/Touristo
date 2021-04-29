const HttpError = require("../models/http-error")
const {validationResult} = require("express-validator")
const User = require("../models/user")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const mediaManager = require("../util/media-manager")
const fs = require("fs")






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

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12)
      
    } catch (error) {
      const err = new HttpError("Signing up failed, please try again later.", 500);
      return next(err);
    }
    
    let link;
    try {
      link = await mediaManager.uploadFile(req.files.image.tempFilePath, {
        folder: "touristo/user",
      });
    } catch (error) {
      
      return next(error);
    }

    const newUser = new User({
      name,
      email,
      image: link.url,
      password: hashedPassword,
      places: [],
    });
    

    try {
      await newUser.save();
    } catch (e) {
      console.log(e);
      const error = new HttpError("Signing up failed, please try again.", 500);

      return next(error);
    }

    let token;

    try {
      token = jwt.sign({ userId: newUser.id, email: newUser.email}, process.env.JWT_KEY,{expiresIn:"1h"});
      
    } catch (error) {
      const err = new HttpError("Signing up failed, please try again.", 500);
      return next(err);
    }


    res.status(201).json({ userId:newUser.id, email:newUser.email, token: token});

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

    if(!existingUser){
      const err = new HttpError("Invalid credentials,signing in failed",401)
      return next(err)
    }

    let isValidPassword = false;
    try {
      
      isValidPassword = await bcrypt.compare(password, existingUser.password)
    } catch (error) {
      const err = new HttpError("Signing in failed, please try again.", 500);
      return next(err);
    }

    if (!isValidPassword) {
      const err = new HttpError("Invalid credentials,signing in failed", 401);
      return next(err);
    }

    let token;

    try {
      token = jwt.sign({ userId: existingUser.id, email: existingUser.email }, process.env.JWT_KEY, {
        expiresIn: "1h",
      });
    } catch (error) {
      const err = new HttpError("Signing in failed, please try again.", 500);
      return next(err);
    }

    
    res.json({ userId: existingUser.id, email: existingUser.email, token: token });

};


exports.getUsers = getUsers
exports.createUser = createUser;
exports.userLogin = userLogin;