const { Router } = require("express");
const passwordController = require("../controllers/passwordController");

const router = Router();

// Rota: GET /api/passwords
router.get("/passwords", passwordController.getPasswords);

module.exports = router;