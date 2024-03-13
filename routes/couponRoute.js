const express= require("express");
const {authMiddleware, isAdmin}= require("../middlewares/authMiddleware")
const { createCoupon, getAllCoupons, updateCoupon, deleteCoupon } = require("../controller/couponCtrl");
const router= express.Router();

// POST:    http://localhost:5000/api/coupon
router.post("/", authMiddleware, isAdmin, createCoupon)

// GET:     http://localhost:5000/api/coupon
router.get("/", authMiddleware, isAdmin, getAllCoupons)

router.put("/:id", authMiddleware, isAdmin, updateCoupon)

router.delete("/:id", authMiddleware, isAdmin, deleteCoupon)

module.exports= router;