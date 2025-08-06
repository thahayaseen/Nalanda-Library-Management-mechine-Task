interface InodemaileProvider{
    sendMail(to: string, subject: string, text: string, html?: string):Promise<void>
}