var cloudinary = require("cloudinary").v2;
const fs = require("fs")

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const uploadFile = (file, options)=>{
return new Promise(function (resolve, reject) {
  cloudinary.uploader.upload(file, options, function (error, result) {
    if (error) {
      const err = new HttpError("Soemthing went wrong while saving the file on server.",500)
      fs.unlink(file, (err) => {
        console.log(err);
      });
      reject(err);
    } else {
        fs.unlink(file, (err) => {
          console.log(err);
        });
        
      resolve(result);

    }
  });
});
}




const deleteFile = (file) => {
    console.log(file);
    return new Promise(function (resolve, reject) {
      const linkarray = file.split("/")
      const pid = linkarray[linkarray.length-2] + "/" +linkarray[linkarray.length-2] +"/"+ linkarray[linkarray.length-1] 

      console.log(pid);

      cloudinary.uploader.destroy(pid, {}, function (error, result) {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
};


exports.uploadFile = uploadFile
exports.deleteFile = deleteFile;
