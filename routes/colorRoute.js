const express= require("express");
const router= express.Router();
const {authMiddleware, isAdmin}= require("../middlewares/authMiddleware")
const { createColor, updateColor, deleteColor, getColor, getallColor } = require("../controller/colorCtrl");

// POST:    http://localhost:5000/api/color
router.post("/", authMiddleware, isAdmin, createColor)

// PUT:     http://localhost:5000/api/color/65eaa851532dfaa475e76cc2
router.put("/:id", authMiddleware, isAdmin, updateColor)

// DELETE:  http://localhost:5000/api/color/65eaa851532dfaa475e76cc2
router.delete("/:id", authMiddleware, isAdmin, deleteColor)


// GET:  http://localhost:5000/api/color/65eaa851532dfaa475e76cc2
router.get("/:id", authMiddleware, isAdmin, getColor)

// GET:  http://localhost:5000/api/color
router.get("/", authMiddleware, isAdmin, getallColor)
module.exports= router