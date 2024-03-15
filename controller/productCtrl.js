const Product= require("../models/productModel")
const User= require("../models/userModel")
const asyncHandler= require("express-async-handler")
const slugify= require("slugify") 
const validateMongoDbId= require("../utils/validateMongodbId")

const fs= require("fs")
const cloudinaryUploadImg = require("../utils/cloudinary")
require("dotenv").config();
const createProduct= asyncHandler(async(req, res)=>{
    try{
        if(req.body.title){
            req.body.slug= slugify(req.body.title)
        }
        const newProduct= await Product.create(req.body)
        console.log("Hello")
        res.json(newProduct)
    }catch(err){
        throw new Error(err);
    }
    
})
const updateProduct= asyncHandler(async(req, res)=>{
    const {id}= req.params;
    try {
        if(req.body.title){
            req.body.slug= slugify(req.body.title);
        }
        const updateProduct= await Product.findByIdAndUpdate(id, req.body,{new:true});
        res.json(updateProduct)
    } catch (error) {
        throw new Error(error)
    }
})

const deleteProduct= asyncHandler(async(req, res)=>{
    const {id}= req.params;
    try {
        const deleteProduct= await Product.findByIdAndDelete(id);
        res.json(deleteProduct)
    } catch (error) {
        throw new Error(error)
    }
})
const getaProduct= asyncHandler(async(req, res)=>{
    const {id}= req.params;
    try{
        const findProduct= await Product.findById(id);
        res.json(findProduct)
    }catch(error){

    }
})
const getAllProduct= asyncHandler(async(req, res)=>{
    console.log(req.query);
    try {

        // M1:
        // const getallproducts= await Product.find(req.query);

        // M2:
        // const getallproducts= await Product.find({
        //     brand: req.query.brand,
        //     category: req.query.category
        // });

        // M3
        // const getallproducts= await Product.where("category").equals(req.query.category)
        
        // M4: 


        // Filtering
        
        const queryObj= {...req.query};
        const excludeFields= ['page', 'sort', 'limit', 'fields'];
        excludeFields.forEach((el)=>delete queryObj[el]);
        console.log("modifiedquery: ", queryObj)
        console.log("original query: ", req.query)

        let queryStr= JSON.stringify(queryObj);
        queryStr= queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match=>`$${match}` )
        console.log(JSON.parse(queryStr))

        let query=  Product.find(JSON.parse(queryStr));

        // sorting
        if(req.query.sort){
            const sortBy= req.query.sort.split(',').join(' ');
            query= query.sort(sortBy)
        }else{
            query= query.sort("-createdAt")
        }
        
        // limiting the fields
        if(req.query.fields){
            const fields= req.query.fields.split(',').join(' ');
            query= query.select(fields)
        }
        else{
            query= query.select("-__v")
        }

        // pagination
        const page= req.query.page;
        const limit= req.query.limit;
        const skip= (page-1)*limit;
        query= query.skip(skip).limit(limit);
        if(req.query.page){
            const productCount= await Product.countDocuments();
            if(skip>= productCount) throw new Error("This page does not exist")
        }
        console.log(page, limit, skip);
        const product= await query;
        res.json(product)
    } catch (error) {
        throw new Error(error)
    }
})
const addToWishList= asyncHandler(async(req, res)=>{
    const {_id}= req.user;
    const {productId}= req.body;
    try {
        const user= await User.findById(_id);
        const alreadyAdded= user.wishList.find((id)=>id.toString()===productId);
        if(alreadyAdded){
            let user= await User.findByIdAndUpdate(_id, {
                $pull: {wishList: productId}
            }, {new: true})
            res.json(user);
        }
        else{
            let user= await User.findByIdAndUpdate(_id, {
                $push: {wishList: productId}
            }, {new: true})
            res.json(user);
        }
    } catch (error) {
        throw new Error(error);
    }
})
const rating= asyncHandler(async(req, res)=>{
    const {_id}= req.user;
    const {star, productId, comment }= req.body;
    try{

        const product= await Product.findById(productId);
        if(!product) throw new Error("There is not such product");
        let alreadyRated= product.ratings.find((userId)=>userId.postedby.toString()===_id.toString());
        if(alreadyRated){
            const updateRating= await Product.updateOne(
                {
                    ratings: {$elemMatch: alreadyRated},
                },
                {
                    $set: {"ratings.$.star": star, "ratings.$.comment":comment}
                },
                {
                    new: true
                }
            );
        }else{
            const rateProduct= await Product.findByIdAndUpdate(productId, {
                $push: {ratings: {
                    star: star,
                    comment: comment,
                    postedby: _id
                }}
            }, {new: true})
            
        }
        const getallratings= await Product.findById(productId);
        let totalRating= getallratings.ratings.length;
        let ratingsum= getallratings.ratings.map((item)=> item.star).reduce((prev, curr)=>prev+curr, 0)
        let actualRating= Math.round(ratingsum/totalRating);
        let finalProduct= await Product.findByIdAndUpdate(productId, {
            totalrating: actualRating
        }, {new: true})
        res.json(finalProduct);
    }catch(error){
        throw new Error(error);
    }
})







module.exports={createProduct, getaProduct, getAllProduct, updateProduct, deleteProduct, addToWishList, rating};