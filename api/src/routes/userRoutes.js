const {Router} = require("express");
const userController = require("../controllers/userController");

const router = Router();
router.post("/", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/", userController.getUsers);

module.exports = router;