const express = require("express")
const {check} = require("express-validator")
const fileUpload = require("../middleware/file-upload")

const usersControllers = require("../controllers/users-controller")

const router = express.Router()

router.get("/", usersControllers.getUsers);

router.post(
  "/signup",
  fileUpload.single("image"),
  [
    (check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 8, max: 16 }),
    check("name").not().isEmpty())
  ],
  usersControllers.createUser
);

router.post("/login",  usersControllers.userLogin);


module.exports = router