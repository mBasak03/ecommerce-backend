const { generateToken } = require("../config/jwtToken");
const User= require("../models/userModel")
const Product= require("../models/productModel")
const Cart= require("../models/cartModel")
const Coupon= require("../models/couponModel")
const Order= require("../models/orderModel")
const uniqid= require("uniqid")
const asyncHandler= require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");
const { generateRefreshToken } = require("../config/refreshtoken");
const crypto= require("crypto")
const jwt= require("jsonwebtoken");
const { sendEmail } = require("./emailCtrl");
const dotenv= require("dotenv").config();
const createUser= asyncHandler(async(req, res)=>{
    const email= req.body.email;
    const findUser= await User.findOne({email})
    if(!findUser){
        // create a new user
        const newUser= await User.create(req.body);
        res.json(newUser)
    }
    else{
        throw new Error("User Already Exists");
    }
})
const loginUserCtrl= asyncHandler(async(req, res)=>{
    const {email, password}= req.body;
    // check if user exists or not
    const findUser= await User.findOne({email})
    if(findUser && await findUser.isPasswordMatched(password)){
        const refreshToken=  generateRefreshToken(findUser?._id)
        const updateuser= await User.findOneAndUpdate(
            findUser._id, {
                refreshToken: refreshToken
            },
            {new: true}
        )
        res.cookie('refreshToken', refreshToken,{
         httpOnly: true,
         maxAge: 72*60*60*1000})
        res.json({
            _id: findUser?._id,
            id: findUser.id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            mobile: findUser?.mobile,
            token: generateToken(findUser?.id)
        });
    }
    else{
        throw new Error("Invalid credentials")
    }
})

const loginAdmin= asyncHandler(async(req, res)=>{
    const {email, password}= req.body;
    // check if user exists or not
    const findAdmin= await User.findOne({email})
    if(findAdmin.role!== "admin") throw new Error("Not authorized")
    if(findAdmin && await findAdmin.isPasswordMatched(password)){
        const refreshToken=  generateRefreshToken(findAdmin?._id)
        const updateuser= await User.findOneAndUpdate(
            findAdmin._id, {
                refreshToken: refreshToken
            },
            {new: true}
        )
        res.cookie('refreshToken', refreshToken,{
         httpOnly: true,
         maxAge: 72*60*60*1000})
        res.json({
            _id: findAdmin?._id,
            id: findAdmin.id,
            firstname: findAdmin?.firstname,
            lastname: findAdmin?.lastname,
            mobile: findAdmin?.mobile,
            token: generateToken(findAdmin?.id)
        });
    }
    else{
        throw new Error("Invalid credentials")
    }
})


// handle refresh token
const handleRefreshToken= asyncHandler(async(req, res)=>{
    const cookie= req.cookies;
    if(!cookie?.refreshToken) throw new Error("No refresh token in cookies")
    const refreshToken= cookie.refreshToken;
console.log(refreshToken);
const user= await User.findOne({refreshToken})
console.log(user)
if(!user) throw new Error("No refresh token present in db or not matched")
jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded)=>{
    if(err || user.id !== decoded.id){
        throw new Error("There is somthing wrong with refresh token")
    }
    const accessToken= generateToken(user?._id)
    res.json({accessToken});
})

})

// logout functionality
const logout= asyncHandler(async(req, res)=>{
    const cookie= req.cookies;
    if(!cookie?.refreshToken) throw new Error("No refresh token in cookies")
    const refreshToken= cookie.refreshToken;
    const user= await User.findOne({refreshToken})
    if(user){
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
        })
        return res.sendStatus(204); // forbidden
    }
    await User.findByIdAndUpdate(refreshToken, {
        refreshToken: ""
    }, {new: true})
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: true
    })
    res.sendStatus(204); // forbidden


})
//  Update a user
const updateUser= asyncHandler(async(req, res)=>{
    const {_id}= req.user;
    validateMongoDbId(_id)
    try{
        const updateUser= await User.findByIdAndUpdate(
            _id, {
                firstname: req?.body?.firstname,
                lastname: req?.body?.lastname,
                email: req?.body?.email,
                mobile: req?.body?.mobile
            }, {
                new: true
            }
            )
            res.json(updateUser)
        }catch(error){
            throw new Error(error)
        }
    })

    // save address
const saveAddress= asyncHandler(async(req, res, next)=>{
    const {_id}= req.user;
    validateMongoDbId(_id)
    try{
        const updateUser= await User.findByIdAndUpdate(
            _id, {
                address: req?.body?.address,
            }, {
                new: true
            }
            )
            res.json(updateUser)
        }catch(error){
            throw new Error(error)
        }

})
// get all users
const getallUser= asyncHandler(async(req, res)=>{
    try{
        const getUsers= await User.find({})
        res.json(getUsers);
    }catch(error){
        throw new Error(error)
    }
})
const getaUser= asyncHandler(async(req, res)=>{
    const {id}= req.params;
    validateMongoDbId(id)
    try{
        const getaUser= await User.findById(id)
        
        res.json({
            getaUser
        });
    }
    catch(error){
        throw new Error(error)
    }
})

const deleteaUser= asyncHandler(async(req, res)=>{
    const {id}= req.params;
    validateMongoDbId(id)
    try{
        const getaUser= await User.findByIdAndDelete(id)

        res.json({
            getaUser
        });
    }
    catch(error){
        throw new Error(error)
    }
})


    const blockuser= asyncHandler(async(req, res)=>{
        const {id}= req.params;
        validateMongoDbId(id)
        try{
            const blockedUser = await User.findByIdAndUpdate(id, {
                isBlocked: true
            }, {new: true})
            res.json({mssg: "User is blocked", blockedUser})
        }catch(error){
            throw new Error(error);
        }
    })
    const unblockUser= asyncHandler(async(req, res)=>{
        const {id}= req.params;
        validateMongoDbId(id)
        try{
            const unblockedUser = await User.findByIdAndUpdate(id, {
            isBlocked: false
        }, {new: true})
        res.json({mssg: "User is unblocked", unblockedUser})
    }catch(error){
        throw new Error(error);
    }
})

const updatePassword= asyncHandler(async(req, res)=>{
    const {_id}= req.user;
    const {password}= req.body;
    validateMongoDbId(_id);
    const user=  await User.findById(_id);
    if(password){
        user.password= password;
        const updatedPassword= await user.save();
        res.json(updatedPassword);
    }
    else{
        res.json(user);
    }
})

const forgotpasswordToken= asyncHandler(async(req, res)=>{
    const {email}= req.body;
    const user= await User.findOne({email});
    if(!user) throw new Error("User not found with this email");
    try{
        const token= await user.createPasswordResetToken();
        await user.save();
        const resetURL= `Hii, Please follow this link to reset Your Password. This Link is valid till 10 minutes from now. <a href="http://localhost:5000/api/user/reset-password/${token}">Click Here</a>`
        const data= {
            to: email,
            text: "Hey User",
            subject: "Forgot Password Link",
            html: resetURL
        }
        sendEmail(data);
        res.json(token);
    }catch(error){
        throw new Error(error);
    }
})
const resetPassword= asyncHandler(async(req, res)=>{
    const {password}= req.body;
    const {token}= req.params;
    const hashedToken= crypto.createHash("sha256").update(token).digest("hex")
    const user=  await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: {$gt:Date.now()}
    })
    if(!user) throw new Error("Token expired, Please try again later");
    user.password= password;
    user.passwordResetToken= undefined,
    user.passwordResetExpires= undefined;
    await user.save();
    res.json(user)

})
const getWishList= asyncHandler(async(req, res)=>{
    const {_id}= req.user;

    try{
        const findUser= await User.findById(_id).populate("wishList");
        res.json(findUser)
    }catch(error){
        throw new Error(error);
    }
})

const userCart= asyncHandler(async(req, res)=>{
    const {cart}= req.body;
    const {_id}= req.user;
    validateMongoDbId(_id);
    try{
        let products= [];
        const user= await User.findById(_id);
        // check if user already have product in cart
        const alreadyExistCart= await Cart.findOne({orderBy: user._id})
        if(alreadyExistCart){
            alreadyExistCart.remove();
        }
        for(let i= 0; i< cart.length; i++){
            let object= {};
            object.product= cart[i]._id;
            object.count= cart[i].count;
            object.color= cart[i].color;
            let getPrice= await Product.findById(cart[i]._id).select("price").exec();
            object.price= getPrice.price;
            products.push(object)
            
        }
        let cartTotal= 0;
        for(let i= 0; i< products.length; i++){
            cartTotal= cartTotal+products[i].price*products[i].count;
        }
        console.log(products, cartTotal)
        let newCart= await Cart.create({
            products,
            cartTotal,
            orderBy: user?._id
        })
        res.json(newCart);


    }catch(error){
        throw new Error(error);
    }
})

const getUserCart= asyncHandler(async(req, res)=>{
    const {_id}= req.user;
    validateMongoDbId(_id);
    try{
        const cart= await Cart.findOne({orderBy: _id}).populate("products.product")
        res.json(cart)
    }catch(error){
        throw new Error(error);
    }
})
const emptycart = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id);
    try{
        const user= await User.findById(_id);
        const cart= await Cart.findOne({orderBy: user._id})
        const deletedCart= await Cart.findByIdAndDelete(cart._id);
        res.json(deletedCart)
    }catch(error){
        throw new Error(error)
    }
  });

  const applyCoupon= asyncHandler(async(req, res)=>{
    const {coupon}= req.body;
    try{
        const validCoupon= await Coupon.findOne({name: coupon})
        if(validCoupon== null){
            throw new Error("Invalid coupon");
        }
        if(validCoupon.expiry< Date.now()) throw new Error("Coupon is expired");
        const user= await User.findById(req.user._id);
        let {products, cartTotal}= await Cart.findOne({orderBy: user._id}).populate("products.product")
        let totalAfterDiscount= (cartTotal- ((cartTotal*validCoupon.discount)/100)).toFixed(2);
        await Cart.findOneAndUpdate({orderBy: user._id}, {totalAfterDiscount: totalAfterDiscount}, {new: true});
        res.json(totalAfterDiscount);
    }catch(error){
        throw new Error(error);
    }

  })


const createOrder= asyncHandler(async(req, res)=>{
    const {COD, couponApplied}= req.body;
    const {_id}= req.user;
    validateMongoDbId(_id);
    try{
        if(!COD) throw new Error("Create cash order failed")
        const user= await User.findById(_id);
        let userCart= await Cart.findOne({orderBy: user._id})
        let finalAmount= 0;
        if(couponApplied && userCart.totalAfterDiscount){
            finalAmount= userCart.totalAfterDiscount;
        }
        else{
            finalAmount= userCart.cartTotal
        }
        let newOrder= await new Order({
            products: userCart.products,
            paymentIntent: {
                id: uniqid(),
                method: "COD",
                amount: finalAmount,
                status: "Cash on Delivery",
                created: Date.now(),
                currency: "usd",
            },
            orderBy: user._id,
            orderStatus: "Cash on Delivery"
        }).save()
        let updatedUserCart= userCart.products.map((item)=>{
            return {
                updateOne: {
                    filter: {_id: item.product._id},
                    update: {$inc: {quantity: -item.count, sold: +item.count}},
                }
            }
        })
        const updated= await Product.bulkWrite(updatedUserCart, {})
        res.json({message: "success"})
    }catch(error){
        throw new Error(error);
    }
})

const getOrders= asyncHandler(async(req, res)=>{
    const {_id}= req.user;
    validateMongoDbId(_id)
    try{
        const userorders= await Order.findOne({orderBy: _id}).populate("products.product").exec();
        res.json(userorders)
    }catch(error){
        throw new Error(error)
    }
})

const updateOrderStatus= asyncHandler(async(req, res)=>{
    const {status}= req.body;
    const {id}= req.params;
    validateMongoDbId(id); 
    try{
        const statusTypes=["Not Processed", "Cash on Delivery", "Processing", "Dispatched", "Cancelled", "Delivered"]
        if(!statusTypes.includes(status)) throw new Error;
        const updatedOrderStatus= await Order.findByIdAndUpdate(id, {
            orderStatus: status,
            paymentIntent: {
                status: status
            }
        }, {new: true})
        res.json(updatedOrderStatus)
    }catch(error){
        throw new Error(error);
    }
})
module.exports= {createUser, loginUserCtrl, loginAdmin, getallUser, getaUser, deleteaUser, updateUser, blockuser, unblockUser, handleRefreshToken, logout, updatePassword, forgotpasswordToken, resetPassword, getWishList, saveAddress, userCart, getUserCart, emptycart, applyCoupon, createOrder, getOrders, updateOrderStatus}