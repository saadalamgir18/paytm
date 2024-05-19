const express = require('express');
const zod = require("zod");
const router = express.Router();
const { authMiddleware } = require('./middleware');
const { Account } = require('../db');
const { mongoose } = require('mongoose');



router.get("/balance", authMiddleware, async(req, res)=>{
    const account = await Account.findOne({
        userID: req.userId
    })
    res.status(200).json({
        balance: account.balance
    })

})

const transferSchema = zod.object({
    to: zod.string(),
    amount: zod.number()
})
router.post("/transfer",authMiddleware, async (req, res)=>{
    const session = await mongoose.startSession();

    session.startTransaction();

    const {success} = transferSchema.safeParse(req.body)
    if (!success){
        return res.status(400).json({
            message: "input not correct"
        })
    }
    const {amount, to} = req.body;
    

    const account = await Account.findOne({
        userID: req.userId
    }).session(session);


    if (!account || account.balance < amount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Insufficient balance"
        });
    }

    const toAccount = await Account.findOne({ userID: to }).session(session);
    if (!toAccount) {
        await session.abortTransaction();
        return res.status(400).json({
            message: "Invalid account"
        });
    }
    await Account.updateOne({ userId: req.userId }, { $inc: { balance: -amount } }).session(session);
    await Account.updateOne({ userId: to }, { $inc: { balance: amount } }).session(session);
    await session.commitTransaction();

    res.status(200).json({
        message: "Transfer successful"
    })
})
module.exports = router;



