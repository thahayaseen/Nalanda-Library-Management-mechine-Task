import { redisService,authServices, nodemaileService } from '@/services/implementation';
import { NodemailerProvider, RedisProvider, } from './provider.di';
import { userServices } from '@/services/implementation/user.services';
import { UserRepository } from './repository.di';
export const UserServices =new userServices(UserRepository)
export const RedisService=new redisService(RedisProvider)
export const Nodemailservice=new nodemaileService(NodemailerProvider)
export const Authservices=new authServices(RedisService,Nodemailservice)
