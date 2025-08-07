import { Router } from "express";
const router = Router();
import AuthRouter from "@/router/auth.route";
import Bookrouter from "@/router/book.route";
import member from "@/router/member.route";


router.use("/", member);
router.use("/auth", AuthRouter);
router.use("/books", Bookrouter);

export default router;
