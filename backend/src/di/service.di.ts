import { redisService,authServices, nodemaileService } from '@/services/implementation';
import { NodemailerProvider, RedisProvider, } from './provider.di';

export const RedisService=new redisService(RedisProvider)
export const Nodemailservice=new nodemaileService(NodemailerProvider)
export const Authservices=new authServices(RedisService,Nodemailservice)
