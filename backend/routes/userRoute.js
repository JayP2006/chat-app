const express=require('express')
const isLogin = require('../middleware/isLogin')
const { getUserBySearch, getCurrentChatters } = require('../controllers/userHandler')
const router=express.Router()

router.get('/search',getUserBySearch)
router.get('/currentchatters',getCurrentChatters)

module.exports=router