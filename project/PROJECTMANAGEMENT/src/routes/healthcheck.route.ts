import { Router , Response , Request } from "express";
import { healthCheck } from "../controllers/healthcheck.controller";
const router = Router();

// router.get("/" , healthCheck);  // it will also work..
router.route("/").get(healthCheck);

export default router;