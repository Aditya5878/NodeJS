import express , {Response , Request} from "express"

const app = express();


const port = 8000;
// db

type diary ={
    name : string ,
    email : string,
    password : string
}

const Diary : Record<string,diary> = {};
const Emails = new Set<string>();   
// middleware
app.use(express.json());

// token
// 1769955548426

// sign up
app.post('/signup', (req:Request , res : Response)=>{

    const {name , email , password} = req.body;
    // if the email is already in diary or not .
    if(Emails.has(email)) {
        return res.status(404).json({error : "Already exist"});
    }

    const token: string = Date.now().toString();


    Diary[token] = { name , email , password};
    Emails.add(email);
    return res.status(200).json(`${token}`);
});

app.post('/me' ,(req: Request , res: Response)=>{
    const {token} = req.body;

    if(!token) {
        res.status(404).json({error : "Missing Token"});
    }

    if(!(token in Diary)){
        res.status(200).json({error :"Invalid Token"});
    }

    const entry : diary = Diary[token];
    return res.json(entry);
});

app.post('/private-data' , (req: Request , res: Response)=>{
   const {token} = req.body;

    if(!token) {
        res.status(404).json({error : "Missing Token"});
    }

    if(!(token in Diary)){
        res.status(200).json({error :"Invalid Token"});
    }

    const entry : diary = Diary[token];
    return res.json({data : {privateData :'Access Granted'}});  
})
app.listen(port ,()=>{
    console.log(`Listening at port ${port}`);
})