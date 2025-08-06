import { env } from "./env.config";

export default {
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: env.NodeMailEmail,
    pass: env.MAILPASS,
  },
};
