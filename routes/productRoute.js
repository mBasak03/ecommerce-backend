const express= require("express");
const { createProduct, getaProduct, getAllProduct, updateProduct, deleteProduct, addToWishList, rating, uploadImages } = require("../controller/productCtrl");
const {isAdmin, authMiddleware}= require("../middlewares/authMiddleware");
const { uploadPhoto, productImgResize } = require("../middlewares/uploadImages");

const router= express.Router();

// POST:   http://localhost:5000/api/product
router.post("/", authMiddleware, isAdmin,  createProduct)

router.put("/upload", authMiddleware, isAdmin, uploadPhoto.array("images", 10), productImgResize, uploadImages)

// GET:    http://localhost:5000/api/product/65e9c4273acb21fed4095246
router.get("/:id",  getaProduct);

// PUT:     http://localhost:5000/api/product/wishlist
router.put("/wishlist", authMiddleware, addToWishList)


router.put("/rating", authMiddleware, rating)


// PUT:    http://localhost:5000/api/product/65e9c6a76f5680cd1bc74b1f
router.put("/:id", authMiddleware,isAdmin, updateProduct)

// DELETE: http://localhost:5000/api/product/65e9c4273acb21fed4095246
router.delete("/:id", authMiddleware, isAdmin, deleteProduct)

// GET:    http://localhost:5000/api/product
// GET:    http://localhost:5000/api/product?brand=Hp
// GET:    http://localhost:5000/api/product?brand=Hp&color=yellow
// GET:    http://localhost:5000/api/product?price[gte]=1500
// GET:    http://localhost:5000/api/product?price[gte]=1500&price[lte]=42000
// GET:    http://localhost:5000/api/product?sort=category,brand
// GET:    http://localhost:5000/api/product?sort=-price
// GET:    http://localhost:5000/api/product?category=watch&sort=-price
// GET:    http://localhost:5000/api/product?fields=title,price,category
// GET:    http://localhost:5000/api/product?page=1&limit=3
// GET:    http://localhost:5000/api/product?page=2&limit=3
router.get("/",  getAllProduct);



module.exports= router;