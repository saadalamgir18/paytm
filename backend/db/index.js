const mongoos = require("mongoose")


mongoos.connect("mongodb+srv://saadalamgir18:x9K1XLrpMsXwwth2@cluster0.vqpdxmb.mongodb.net/paytm")

const UserSchema = new mongoos.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 30,
        lowercase: true,
        unique:true,
        
    },
    password: {
        type: String,
        required: true,
        minLength: 6
    },
    firstname: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    lastname: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    }
})

const AccountSchema = mongoos.Schema({
    userID: {
        type: mongoos.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
})
const User = mongoos.model('User', UserSchema)

const Account = mongoos.model("Account", AccountSchema)
module.exports = {
    User,
    Account
}