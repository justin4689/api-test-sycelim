const express = require("express");
const router = express.Router();
const configCtrl = require("../controllers/config.controller");

router.get("/", configCtrl.getEntityList);
router.get("/:id", configCtrl.getEntityConfigById);
router.get("/name/:name", configCtrl.getEntityConfigByName);

router.post("/", configCtrl.createEntityConfig);
router.put("/:id", configCtrl.updateEntityConfig);
router.delete("/:id", configCtrl.deleteEntityConfig);

module.exports = router;
