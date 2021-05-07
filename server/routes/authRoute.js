const express = require('express')
const { authUser, getUsers, registerUser, getUserById } = require('../controllers/authController')


const router = express.Router()

router.post('/login', authUser)
router.route('/register').post(registerUser)

router.route('/').get(getUsers)

router
  .route('/:id')
  .get(getUserById)
 
module.exports = router;

