const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const config = require('./config/key');

const { User } = require('./models/User');

app.use(express.urlencoded({extended:true}));
app.use(express.json());

const mongoose = require('mongoose');
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(()=> console.log('MongoDB Connected...'))
  .catch(err => console.log)

app.get('/', (req, res) => {
  res.send('Hello World! 할 수 있다!')
});

app.post('/register',(req,res)=>{
// 회원가입시 필요한 정보를 클라이언트에서 가져와서 디비에 넣어준다

const user = new User(req.body)

user.save((err,userInfo)=>{
    if(err) return res.json({success:false, err})
     return res.status(200).json({
         success:true
     })
   })
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
});