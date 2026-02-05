import express from 'express';
import { Request , Response } from 'express';
import { ensureAuthenticated, restrictToRole } from '../middleswares/auth.middleware';
import {db} from '../db/index';
import { usersTable } from '../db/schema';


const router = express.Router();

router.use(ensureAuthenticated);
router.use(restrictToRole('ADMIN'));
router.get('/users', async(req: Request, res: Response) =>{

    // first authenticate the admin.
    // if(!req.user){
    //     return res.status(400).json({error :"You must be authenticated to see this data"})
    // }   this part is taken case by ensureAuthenticated middleware

    const users = await db.select(
       { id : usersTable.id,
        name : usersTable.name,
        email : usersTable.email
    }).from(usersTable);
    return res.json({users});
} )


export { router as adminRouter };