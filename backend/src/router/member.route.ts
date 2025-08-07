
import { UserController } from '@/di/controller.di'
import { validate } from '@/middleware/validate.middleware'
import JWTvalidateTocken from '@/middleware/varify-tocken'
import {Router} from 'express'
const router=Router()

router.get('/me',JWTvalidateTocken('member'),UserController.getProfile.bind(UserController))
router.post('/book/:id',JWTvalidateTocken('member'),UserController.buyAbook.bind(UserController))
router.post('/return-book',JWTvalidateTocken('member'),UserController.returnBook.bind(UserController))
router.get('/my-records',JWTvalidateTocken(),UserController.BorrowdRecords.bind(UserController))
export default router