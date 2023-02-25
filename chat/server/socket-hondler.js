io = require("socket.io")();

const User = require("./models/user");
const Message = require("./models/message");
const auth = require("./middlewares/auth");

//تخزين حالة المستخدم
const users = {};

io.use(auth.socket);


//كل متصل يجب ان يحمل بطاقة تعريف
io.on("connection", socket => {
    onSocketConnected(socket);
    //استقبال الرسالة
    socket.on("message",data => onMessage(socket,data));

    socket.on("typing",receiver => onTyping(socket,receiver));

    socket.on("seen",sender => onSeen(socket,sender));

    //استدعاء التابع عند ورود اتصال جديد
    initalData(socket);

    socket.on("disconnect",() => onSocketDisconnected(socket));
    
});

const onSocketConnected = socket => {
    console.log("new client connected: " + socket.id);

    //ارسال رسالة الى المستخدمين
    socket.join(socket.user.id);
    //acount connected
    users[socket.user.id] = true;

    //انشاء عدد المتصلين
    let room = io.sockets.adapter.rooms[socket.user.id];

    if (!room ||room.length === 1) {
        io.emit("user_status",{
            [socket.user.id] : true
        })
    }
}

const onSocketDisconnected = socket => {
    let room = io.sockets.adapter.rooms[socket.user.id];
    if(!room || room.length < 1) {
        let lastSeen = new Date().getTime();
        users[socket.user.id] = lastSeen;
        io.emit("user_status",{
            [socket.user.id]: lastSeen
        });
    }
    console.log("client disconnected" + socket.user.username);
}

const onMessage = (socket,data) => {
    //المستخدمidطلب

    let sender = socket.user.id;
    //الطرف المستقبل او وجهة الرسالة
    let receiver = data.receiver;
    //الرسالة

    let message = {
        sender: sender,receiver:receiver,content: data.content, date:new Date().getTime()
    };
    //تخزين الرسالة في قاعدة البيانات
    Message.create(message);
    //توجيه الرسالة
    socket.to(receiver).to(sender).emit("message",message);
}

//التابع المسؤؤول عن جلب الرسائل
const getMessages = userId => {
    let where = [
        {sender:userId},{receiver:userId}

    ];
    //شرط الرسالة ان يكون المستخدم المسجل مرسل او مستقبل الرسالة
    return Message.find().or(where);
};

const onTyping = (socket,receiver) => {
    let sender = socket.user.id;
    socket.to(receiver).emit("typing",sender);
}

const onSeen = (socket,sender) => {
    let receiver = socket.user.id;
    //تحديث الرسائل المقروءة
    Message.updateMany({sender, receiver,seen:false},{seen:true},{multi:true}).exec();
}
//تابع الحصول على جهة الاتصال
const getUsers = userId => {
    let where = {
        _id: {$ne:userId}
    };
    return User.find(where).select("-password");
}

//استدعاء البيانات
const initalData = socket => {
    //استدعاء ملف المستخدم الشخصي
    let user = socket.user;
    //طلب الرسائل
    let messages = [];
    getMessages(user.id)

    .then(data => {
        messages = data;
        //جلب جهات الاتصال
        return getUsers(user.id)
    })
    .then(contacts => {
        //اؤسال البيانات الى العميل
        socket.emit("data",user,contacts,messages,users);
        //حصول خطا قطع الاتصال
    })
    .catch(() => socket.disconnect());
}