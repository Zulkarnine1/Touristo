const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const path = require("path")
const fs = require("fs")
const cors = require("cors")
const fileUpload = require("express-fileupload");


const placesRoutes = require("./routes/places-routes")
const usersRoutes = require("./routes/users-routes")
const HttpError = require("./models/http-error")

const app = express()

// file uploader
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
app.use(bodyParser.json());

// app.use((req,res,next)=>{
    
//     res.setHeader('Access-Control-Allow-Origin',"*")
//     res.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept, Authorization")
//     res.setHeader("Acces-Control-Allow-Methods","GET, POST, PATCH, DELETE")
    
//     next()
// })

// app.use("/uploads/images", express.static(path.join("uploads","images")));

app.use(cors());

app.use("/api/places", placesRoutes); // /api/places/...

app.use("/api/users", usersRoutes);

app.use((req,res,next)=>{
    const error = new HttpError("Could not find this route",404);
    throw error
});

// Middleware for error handling
app.use((error, req, res, next)=>{
    if(req.files){
      if(req.files.image){

        fs.unlink(req.files.image.tempFilePath, (err) => {
          console.log(err);
        });
      }
    }
    if(res.headerSent){
        return next(error)
    }
    res.status(error.code || 500)
    res.json({message: error.message || "An unknown error occured! "})

})


mongoose
  .connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ayjbu.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }
  )
  .then(() => {
    app.listen(process.env.PORT || 5000);
  })
  .catch((err) => {
    console.log(err);
  });

