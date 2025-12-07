const {Router} = require("express");
const userController = require("../controllers/userController");

const router = Router();
router.post("/", userController.createUser);
router.post("/login", userController.loginUser);
router.get("/", userController.getUsers);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;