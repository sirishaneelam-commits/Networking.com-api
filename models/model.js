const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const userschema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    is_employee:{
        type:Boolean,
        default:false
    },
    is_employer:{
        type:Boolean,
        default:false
    }
})

const cardschema = new mongoose.Schema({
    title:{
        type:String,
        required:true 
    },
    description:{
        type:String,
        required:true 
    },
    phone_number:{
        type:String,
        required:true 
    },
    email:{
        type:String,
        required:true 
    }
})


userschema.pre('save', async function() {
     if(!this.isModified('password')) return

     const salt = await bcrypt.genSalt(10)
     this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userschema)
const Card = mongoose.model('Card', cardschema)

module.exports = { User, Card }

