const express= require("express");
const router= express.Router();
const {authMiddleware, isAdmin}= require("../middlewares/authMiddleware")
const { createBrand, updateBrand, deleteBrand, getBrand, getallBrand } = require("../controller/brandCtrl");

// POST:    http://localhost:5000/api/Brand
router.post("/", authMiddleware, isAdmin, createBrand)

// PUT:     http://localhost:5000/api/Brand/65eaa851532dfaa475e76cc2
router.put("/:id", authMiddleware, isAdmin, updateBrand)

// DELETE:  http://localhost:5000/api/Brand/65eaa851532dfaa475e76cc2
router.delete("/:id", authMiddleware, isAdmin, deleteBrand)


// GET:  http://localhost:5000/api/Brand/65eaa851532dfaa475e76cc2
router.get("/:id", authMiddleware, isAdmin, getBrand)

// GET:  http://localhost:5000/api/Brand
router.get("/", authMiddleware, isAdmin, getallBrand)
module.exports= router