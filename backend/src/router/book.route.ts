import { uploads } from "@/config";
import { BookController } from "@/di/controller.di";
import { validate } from "@/middleware/validate.middleware";
import JWTvalidateTocken from "@/middleware/varify-tocken";

import { Router } from "express";
const router = Router();
router.post(
  "/create",
  JWTvalidateTocken("admin"),
  uploads.single("image"),
  BookController.createBook.bind(BookController)
);
router.put(
  "/update/:ISBN",
  JWTvalidateTocken("admin"),

  BookController.updateBook.bind(BookController)
);
router.get(
  "/",
  JWTvalidateTocken(),
  BookController.getAllbooks.bind(BookController)
);

router.get(
  "/most-active",
  JWTvalidateTocken(),
  BookController.Mostactiveusers.bind(BookController)
);
router.get(
  "/most-borrowd",
  JWTvalidateTocken(),
  BookController.monstBorrowdBook.bind(BookController)
);
router.get(
  "/s/:ISBN",
  JWTvalidateTocken(),
  BookController.getSelected.bind(BookController)
);
export default router;
