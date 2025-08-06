import { createClient } from "redis";
import { env } from "./env.config";
export const redisServer=createClient({
    url:env.REDISURL
})