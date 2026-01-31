import { Router , Request , Response} from "express";

const EmployeesRouter = Router();

EmployeesRouter.get('/' , (req : Request , res : Response ) =>{
    res.send('Hello From Employee')
})

export default EmployeesRouter;