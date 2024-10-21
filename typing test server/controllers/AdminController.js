const route = require('express').Router();
const jwt = require('jsonwebtoken');
const sha = require('sha1')
const adminModel = require('../model/AdminSchema')
const key = require('../config/token_Keys');

route.get('/:id', async(req, res) => {
    if(req.headers.authorization){
        let ID = jwt.decode(req.params.id, key)
        let adminData = await adminModel.findOne({_id : ID?.id})
        if(adminData) {
            res.send({ status : 200, adminData : adminData })
        }else{
            res.send({status : 403})
        }
    }
});

route.post('/signin', async(req, res) => {
    const { email, password } = req.body;
    const isAdminExist = await adminModel.findOne({ email : email }) 
    if(isAdminExist) {
        if(sha(password) === isAdminExist?.password) {
            const ID = {id : isAdminExist?._id};
            const token = jwt.sign(ID, key)
            res.send({ status : 200, token : token })
        } else res.send({ status : 402, message : "Password is Incorrect" })
    } else res.send({ status : 401, message : "Email ID is Invalid" })
});

route.put('/', async(req, res) => {

});

route.delete('/', async(req, res) => {

});

module.exports = route;