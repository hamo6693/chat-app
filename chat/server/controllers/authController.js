//استدعاء الوحدة
const User = require("../models/user");
const createError = require("http-errors");


exports.login = (req,res,next) => {
    const {username,password} = req.body;
    User.findOne({username}).then(user => {
        if(!username || !user.checkPassword(password)) {
            throw createError(401,"الرجاء التحقق من اسم المستخدم او كلمة المرور")
        }
        res.json(user.signJwt());
    })
    .catch(next);
}

//
exports.register = (req,res,next) => {
    let data = {name ,username , password} = req.body;
    User.findOne({username})

    .then(user => {
        if(user) throw createError(422,"اسم المستخدم موجود مسبقا ");
        return User.create(data);
    })
    .then(user => {
        res.json(user.signJwt());
    })

}

//تابع لانشاء الحساب
exports.register = (req, res, next) => {
    let data = {name, username, password} = req.body;

    User.create(data)

    .then(user => {
        res.json(user.signJwt());
        //استدعاء التابع بعد التسجيل
        sendNewUser(user);
    })
    .catch(next);
}

//استدعاء المستخدم بعد تسجيل الدخول
const sendNewUser = user => {
    let data = {name,username,avatar} = user;
    //ارسال المعلومات الى المستخدمين
    io.emit("new_user",data);

}