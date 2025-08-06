import { Authcontroller } from "@/controller/auth.controller";
import { authServices } from "@/services/implementation/AuthServices.services";
import { Router } from "express";
import { validate } from "@/middleware/validate.middleware";
import { signUpSchema } from "@/schema/signup.schema";
import { signIn } from "@/schema/sigin.schema";
import { Authservices } from "@/di/service.di";
import { otpSchema } from "@/schema/otp.schema";

const router = Router();

const authcontrller = new Authcontroller(Authservices);
router.post(
  "/signup",
  validate(signUpSchema),
  authcontrller.signUp.bind(authcontrller)
);
router.post(
  "/login",
  validate(signIn),

  authcontrller.signIn.bind(authcontrller)
);
router.post(
  "/varify-otp",
  validate(otpSchema),

  authcontrller.varifyotp.bind(authcontrller)
);
export default router;
