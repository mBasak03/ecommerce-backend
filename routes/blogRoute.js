const express= require("express");
const { createBlog, updateBlog, getBlog, getAllBlogs, deleteBlog, liketheBlog, disliketheBlog } = require("../controller/blogCtrl");
const {authMiddleware, isAdmin}= require("../middlewares/authMiddleware");
const { uploadPhoto, blogImgResize } = require("../middlewares/uploadImages");
const { uploadImages } = require("../controller/productCtrl");

const router= express.Router();

// POST:    http://localhost:5000/api/blog
router.post("/", authMiddleware, isAdmin, createBlog)


router.put("/upload/:id", authMiddleware, isAdmin, uploadPhoto.array("images", 2), blogImgResize, uploadImages)


// PUT:     http://localhost:5000/api/blog/likes
router.put("/likes", authMiddleware, liketheBlog)

// PUT:     http://localhost:5000/api/blog/dislikes
router.put("/dislikes", authMiddleware, disliketheBlog)

// PUT:     http://localhost:5000/api/blog/65ea1cb6cccc5f28dcfe5a46
router.put("/:id", authMiddleware, isAdmin, updateBlog)

// GET:  http://localhost:5000/api/blog/65ea1cb6cccc5f28dcfe5a46   
router.get("/:id", authMiddleware, getBlog)

// GET:   http://localhost:5000/api/blog/
router.get("/", authMiddleware, getAllBlogs)

// delete:  http://localhost:5000/api/blog/65ea1cb6cccc5f28dcfe5a46 
router.delete("/:id", authMiddleware, isAdmin, deleteBlog)

module.exports= router;