
import { userController } from '@/controller/user.controller'
import { UserController } from '@/di/controller.di'
import { validate } from '@/middleware/validate.middleware'
import JWTvalidateTocken from '@/middleware/varify-tocken'
import {Router} from 'express'
const router=Router()

router.get('/me',JWTvalidateTocken('member'),UserController.getProfile.bind(userController))