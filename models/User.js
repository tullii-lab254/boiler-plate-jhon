const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt= require('jsonwebtoken');

const userSchema =mongoose.Schema({
    name:{
        type:String,
        maxlength:50
    },
    email:{
        type:String,
        trim:true,
        unique:1
    },
    password:{
        type:String,
        minlength: 5
    },
    lastname:{
        type:String,
        maxlength:50
    },
    role:{
        type: Number,
        default: 0
    },
    Image: String,
    token:{
        type:String
    },
    tokenExp:{
        type:Number
    }
})

userSchema.pre('save',function(next){
    let user = this;
    //비밀번호를 암호화시키기
    if(user.isModified('password')){
        bcrypt.genSalt(saltRounds, function(err, salt) {
            if(err) return next(err);
            bcrypt.hash(user.password, salt, function(err, hash) {
                // Store hash in your password DB.
                if(err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
})


userSchema.methods.comparePassword = function(plainPassword,cb){
    //plainPassword()
    bcrypt.compare(plainPassword,this.password,function(err,isMatch){
        if(err) return cb(err);
        cb(null,isMatch)
    })
}

userSchema.methods.generateToken=function(cb){
    var user = this;
 //jsonwebtoken을 이용해서 token 생성하기
    var token = jwt.sign(user._id.toHexString(),'secretToken')

    user.token = token;
    user.save(function(err,user){
        if(err) return cb(err);
        cb(null, user);
    })
}


userSchema.statics.findByToken = function(token,cb) {
    var user = this;

    // user._id+''= token
    //복호화(decode)
    jwt.verify(token,'secretToken',function(err,decoded){
        //유저 아이디를 이용햐소 유저를 찾은 다음에
        //클라이언트에서 가조온 토큰과 디비에 보관된 토큰이 이리하는지 확인

        user.findOne({"_id":decoded, "token":token},function(err,user){
            if(err) return cb(err);
            cb(null,user);
        })
    })
}

const User = mongoose.model('User',userSchema)

module.exports = {User}