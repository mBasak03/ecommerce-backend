const express= require("express");
const { createUser, loginUserCtrl, getallUser, getaUser, deleteaUser, updateUser, blockuser, unblockUser, handleRefreshToken, logout, updatePassword, forgotpasswordToken, resetPassword, loginAdmin, getWishList, saveAddress, userCart, getUserCart, emptycart, applyCoupon, createOrder, getOrders, updateOrderStatus } = require("../controller/userCtrl");
const {authMiddleware, isAdmin} = require("../middlewares/authMiddleware");
const router= express.Router();

//POST:     http://localhost:5000/api/user/register
router.post("/register", createUser); 

// POST:    http://localhost:5000/api/user/forgot-password-token
router.post("/forgot-password-token", forgotpasswordToken)


//POST:     http://localhost:5000/api/user/reset-password/e8d4023d73b4ccf318e1bb3045fd1c94973f9950a1b01fff1006dbb42b425d11
router.post("/reset-password/:token", resetPassword)
router.put("/order/update-order/:id", authMiddleware, isAdmin, updateOrderStatus)



// PUT:     http://localhost:5000/api/user/password
router.put("/password", authMiddleware, updatePassword)

//POST:     http://localhost:5000/api/user/login
router.post("/login", loginUserCtrl);   

// POST:   http://localhost:5000/api/user/admin-login
router.post("/admin-login", loginAdmin);   

// POST:    http://localhost:5000/api/user/cart
router.post("/cart", authMiddleware, userCart);

router.post("/cart/apply-coupon", authMiddleware, applyCoupon)

router.post("/cart/cash-order", authMiddleware, createOrder)



router.get("/all-users", getallUser)
router.get("/get-orders", authMiddleware, getOrders)
// GET: http://localhost:5000/api/user/refresh
router.get("/refresh", handleRefreshToken)

// GET: http://localhost:5000/api/user/logout
router.get("/logout", logout)

router.get("/wishlist", authMiddleware, getWishList)
router.get("/wishlist", authMiddleware, getUserCart)
router.get("/:id", authMiddleware, isAdmin, getaUser)
router.delete("/empty-cart", authMiddleware, emptycart)
router.delete("/:id", deleteaUser)
router.put("/update", authMiddleware, updateUser)
router.put("/save-address", authMiddleware, saveAddress)


// PUT: http://localhost:5000/api/user/block-user/65e852caab0eb332cf4f3bae
router.put("/block-user/:id", authMiddleware, isAdmin, blockuser)


// PUT: http://localhost:5000/api/user/unblock-user/65e852caab0eb332cf4f3bae
router.put("/unblock-user/:id", authMiddleware, isAdmin, unblockUser)

module.exports= router;