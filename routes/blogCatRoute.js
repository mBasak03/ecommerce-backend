const express= require("express");
const router= express.Router();
const {authMiddleware, isAdmin}= require("../middlewares/authMiddleware")
const { createCategory, updateCategory, deleteCategory, getCategory, getallCategory } = require("../controller/blogCatCtrl");

// POST:    http://localhost:5000/api/blogcategory
router.post("/", authMiddleware, isAdmin, createCategory)

// PUT:     http://localhost:5000/api/blogcategory/65eaa851532dfaa475e76cc2
router.put("/:id", authMiddleware, isAdmin, updateCategory)

// DELETE:  http://localhost:5000/api/blogcategory/65eaa851532dfaa475e76cc2
router.delete("/:id", authMiddleware, isAdmin, deleteCategory)


// GET:  http://localhost:5000/api/blogcategory/65eaa851532dfaa475e76cc2
router.get("/:id", authMiddleware, isAdmin, getCategory)

// GET:  http://localhost:5000/api/blogcategory
router.get("/", authMiddleware, isAdmin, getallCategory)
module.exports= router