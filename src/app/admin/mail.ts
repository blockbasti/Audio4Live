export class Mail {
  constructor(
    public to: string = '',
    public from: string = '',
    public cc: string = '',
    public bcc: string = '',
    public message : {
      subject: string,
      html: string,
    }
  ) {}
}
