const User = require('../models/userModel.js')
const asyncHandler = require('express-async-handler')
const generateWebToken = require('../utility/generateWebToken.js')
const hashUserId = require('../service/hashing')
const bcrypt = require('bcryptjs')

// @desc   Auth user & get Token
//@route   POST /api/users/login
//@Access  Public
const authUser = asyncHandler (async (req, res) =>{
   const {email, password} = req.body;

   const user = await User.findOne({email})
   if (user && (await user.matchPassword(password))){
      res.json({
         _id : user._id,
         email: user.email,
         name: user.name,
         dateOfBirth: user.dateOfBirth,
         token: generateWebToken(user._id),
         hashedId: bcrypt.hashSync(JSON.stringify(user._id), 8)

      })
   }else{
      res.status(401);
      throw new Error('Invalid Email or/and Password')
   }
})

// @desc   register new user 
//@route   GET /api/users
//@Access  Public
const registerUser = asyncHandler (async (req, res) =>{
   const { name, email, password, dateOfBirth } = req.body;

   const userExist = await User.findOne({email})
   if(userExist) {
      res.status(400)
      throw new Error("User's already exist")
   }
   const user = await User.create({
      name,
      email,
      password,
      dateOfBirth
   })
   if (user){
      res.status(201).json({
         id : user._id,
         email: user.email,
         name: user.name,
         dateOfBirth: user.dateOfBirth,
         token: generateWebToken(user._id),
         hashedId: bcrypt.hashSync(JSON.stringify(user._id), 8)

      })
   }else{
      res.status(400)
      throw new Error('Incorrect Data')
   }
})

// @desc   find user by Id 
//@route   GET /api/users
//@Access  Public
const getUserById = asyncHandler (async (req, res) =>{
   
   const user = await User.findById(req.user._id)
   if(user)
   {
      res.json({
         id : user._id,
         email: user.email,
         name: user.name,
         dateOfBirth: user.dateOfBirth
      })

   }else{
      res.status(404)
      throw new Error('User not found')
   }

})
// @desc    Get all Users
// @route   GET /api/users
// @access  Public
const getUsers = asyncHandler(async (req, res) => {
   const users = await User.find({})

   res.json(users)
 
})

module.exports = { getUserById, getUsers, registerUser, authUser}