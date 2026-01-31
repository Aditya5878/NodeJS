import express , {Request , Response} from 'express'
import EmployeesRouter from './api/empl/Employee.route';


const port = 3000;
export class Server {
    private app = express();
    startServer(){
        // this.app.get('/hello' ,(req: Request, res: Response) => {
        //     res.send('Hello!!')
        // })

        this.app.use('employees' , EmployeesRouter)

        this.app.listen(port, ()=> {
            console.log('Listening on port ' +  port)
        })
        
    }
}



new Server().startServer()