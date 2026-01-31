const express = require('express');

const app = express();


const port = 3000;

app.get('/' , (req : any , res:any)=>{
  
    res.send("You are at HomePage");
})

app.get('/contact-us' , (req:any , res :any)=>{
    res.send("Contact me at svnbenet");
})

app.get('/tweet' , (res: any , req : any) =>{
    res.send("Here is you Tweet")
})

app.post('/tweet' , (req:any , res:any)=>{
    res.status(201).send("Tweet was created");
})


app.listen(port , () =>{
    console.log(`listening at post ${port}`);
})