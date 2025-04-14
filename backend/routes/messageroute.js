const express=require('express');
const isLogin = require('../middleware/isLogin');
const router=express.Router()
const{sendmessage,getmessages}=require('../controllers/messageController')

router.post('/send/:id',sendmessage)
router.get('/user',getmessages)


module.exports=router