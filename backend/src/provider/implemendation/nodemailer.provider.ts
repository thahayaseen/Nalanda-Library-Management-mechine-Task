import nodemailerConfig from "@/config/nodemail.config";
import nodemailer from "nodemailer";
export class nodeMailerProvider implements InodemaileProvider{
  private transport;
  constructor() {
    this.transport = nodemailer.createTransport(nodemailerConfig);
  }
  async sendMail(to: string, subject: string, text: string, html?: string):Promise<void> {
    await this.transport.sendMail({
      from: nodemailerConfig.auth.user,
      to,
      subject,
      text,
      html,
    });
    return
  }
}
