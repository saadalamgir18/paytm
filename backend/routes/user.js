const express = require('express');
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { User, Account } = require('../db');
const {JWT_SECRET} = require("../config");
const { authMiddleware } = require('./middleware');
const router = express.Router();

const signupSchema = zod.object({
    username: zod.string().email(),
    firstname: zod.string(),
    lastname: zod.string(),
    password: zod.string()
})

router.post("/signup",async (req, res)=>{
    const data = req.body;
    const zodresponse = signupSchema.safeParse(data)
    if (!zodresponse.success){
        return res.status(411).json({
            message: "inputs are not correct"
        })
    }
    const existUser = await User.findOne({
        username: req.body.username
    })
    if (existUser){
        return res.status(411).json({
            message: "Email already taken / Incorrect inputs"
        })
    }
    try{
    const user = await User.create({
        username: req.body.username,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password
    })

    const userId = user._id
    
    await Account.create({
        userID: userId,
        balance: 1 + Math.random() * 10000

    })
    const token = jwt.sign({
        userId
    }, JWT_SECRET)

    return res.json({
        message: "User created successfully",
        token: token
    })
    }catch(error){
    return res.json({
        message: error.message
    })}
})

const singinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6)
})
router.post("/signin", async(req, res)=>{
    const {success} = singinSchema.safeParse(req.body)
    if (!success){
        return res.status(411).json({
            message: "Error while logging in"
        })
    }

    const user = User.findOne({
        username: req.body.username,
        password: req.body.passowrd
    })
    if(user){

        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET)

        return res.status(200).json({
            token: token
        })
    }else{
        return res.status(411).json({
            message: "User doest not exits"
        })
    }
})

const updateUser = zod.object({
    password: zod.string().optional(),
    firstname: zod.string().optional(),
    lastname: zod.string().optional()
})

router.put("/", authMiddleware, async(req, res)=>{

    const {success} = updateUser.safeParse(req.body)
    if(!success){
        return res.status(411).json({
            message: "Error while updating information input is incorrect"
        })
    }
    await User.updateOne({
        _id: req.userId
    }, req.body)

    return res.json({
        message: "Updated successfully"
    })
})

router.get("/bulk", authMiddleware, async (req, res)=>{
    const filter = req.query.filter || "";
    const users = User.find({$or: [{"firstname": {
        "$regex": filter
    }}, 
    {"lastname": {
        "$regex": filter
    }}]})

    return res.json({
        user: (await users).map(user=>({
            username: user.username,
            firstname: user.firstname,
            lastname: user.lastname,
            _id: user._id
        }))
    })
})

module.exports = router;
