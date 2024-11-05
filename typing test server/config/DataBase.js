const mongoose = require("mongoose")
mongoose.connect("mongodb+srv://Sadiq53:ZX7t5iTyKPCNcMOE@cluster0.cunxumm.mongodb.net/typingtest", { useNewUrlParser: true, useUnifiedTopology: true });


mongoose.connection.on("connected", ()=>{
    console.log("connected")
})
mongoose.connection.on("error", (err)=>{
    console.log(err)
})



module.exports = mongoose;