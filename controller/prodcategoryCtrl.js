const Category= require("../models/productCategoryModel")
const asyncHandler= require("express-async-handler")
const validateMongoDbId= require("../utils/validateMongodbId")

const createCategory= asyncHandler(async(req, res)=>{
    try{
        const newCategory= await Category.create({title: req.body.title});
        res.json(newCategory)
    }catch(error){
        throw new Error(error)
    }
})
const updateCategory= asyncHandler(async(req, res)=>{
    const {id}= req.params;
    validateMongoDbId(id)
    try{
        const updatedCategory= await Category.findByIdAndUpdate(id, req.body, {new: true})
        res.json(updatedCategory)
    }catch(error){
        throw new Error(error);
    }
})
const deleteCategory= asyncHandler(async(req, res)=>{
    const {id}= req.params;
    validateMongoDbId(id);
    try{
        const deletedCategory= await Category.findByIdAndDelete(id)
        res.json(deletedCategory)
    }catch(error){
        throw new Error(error);
    }
})

const getCategory= asyncHandler(async(req, res)=>{
    const {id}= req.params;
    try{
        const getaCategory= await Category.findById(id);
        validateMongoDbId(id);
        res.json(getaCategory)
    }catch(error){
        throw new Error(error)
    }
})
const getallCategory= asyncHandler(async(req, res)=>{
    try{
        const getallCategory= await Category.find({});
        res.json(getallCategory)
    }catch(error){
        throw new Error(error)
    }
})


module.exports= {createCategory, updateCategory, deleteCategory, getCategory, getallCategory}