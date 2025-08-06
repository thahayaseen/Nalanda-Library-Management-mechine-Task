import { Router } from "express";
const router = Router();
import AuthRouter from "@/router/auth.route";


router.use("/auth", AuthRouter);

export default router;
