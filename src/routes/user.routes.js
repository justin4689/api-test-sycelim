const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user.controller");

router.post("/", userCtrl.createUser);
router.get("/", userCtrl.getUsers);
router.get("/:id", userCtrl.getUserById);
router.put("/:id", userCtrl.updateUser);
router.patch("/:id/disable", userCtrl.disableUser);

module.exports = router;
