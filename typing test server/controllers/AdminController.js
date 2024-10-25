const route = require('express').Router();
const jwt = require('jsonwebtoken');
const sha = require('sha1')
const adminModel = require('../model/AdminSchema')
const userModel = require('../model/UserSchema')
const key = require('../config/token_Keys');

route.get('/', async(req, res) => {
    if(req.headers.authorization){
        let ID = jwt.decode(req.headers.authorization, key)
        let adminData = await adminModel.findOne({_id : ID?.id})
        adminData = {
            email : adminData?.email,
            username : adminData?.username
        }
        if(adminData) {
            res.send({ status : 200, adminData : adminData })
        }else{
            res.send({status : 403})
        }
    }
});

route.get('/get-user/:limit', async(req, res) => {
    if(req.headers.authorization){
        const limit = req.params.limit
        const getAllUsers = await userModel.find().imit(limit)
    }
});

route.post('/signin', async(req, res) => {
    const { signin, password, type } = req.body;
    // console.log(req.body)
    // return
    let isUserExist;
    if(type === 'username') {
        isUserExist = await adminModel.findOne({ username : signin }) 
    } else {
        isUserExist = await adminModel.findOne({ email : signin }) 
    }
    if(isUserExist) {
        if(sha(password) === isUserExist?.password) {
            const ID = {id : isUserExist?._id};
            const token = jwt.sign(ID, key)
            res.send({ status : 200, token : token, message : "Logged in Successfully", type : 'signin' })
        } else res.send({ status : 402, message : "Password is Incorrect", type : 'signin' })
    } else res.send({ status : 401, message : "Email ID is Invalid", type : 'signin' })
});

route.put('/', async(req, res) => {

});

route.delete('/', async(req, res) => {

});

module.exports = route;