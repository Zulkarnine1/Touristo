const express = require("express")

const usersControllers = require("../controllers/users-controller")

const router = express.Router()

router.get("/", usersControllers.getUsers);

router.post("/signup", usersControllers.createUser)

router.post("/login", usersControllers.userLogin);


module.exports = router