const express = require("express")
const { check } = require("express-validator")
const fileUpload = require("../middleware/file-upload")
const placesControllers = require("../controllers/places-controller")
const checkAuth = require("../middleware/check-auth")

const router = express.Router()



router.get("/:pid", placesControllers.getPlaceByID);


router.get("/user/:uid", placesControllers.getPlacesByUserID);


router.use(checkAuth);

router.post(
  "/",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 }), check("address").not().isEmpty()],
  placesControllers.createPlace
);

router.patch("/:pid", [check("title").not().isEmpty(),check("description").isLength({min:5})], placesControllers.patchPlace);

router.delete("/:pid", placesControllers.deletePlace);

module.exports = router