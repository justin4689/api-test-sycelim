const express = require("express");
const router = express.Router();
const configCtrl = require("../controllers/config.controller");

router.get("/", configCtrl.getEntityList);
router.get("/:id", configCtrl.getEntityConfigById);
router.get("/name/:name", configCtrl.getEntityConfigByName); 

router.put("/:id", configCtrl.updateEntityConfig);

module.exports = router;