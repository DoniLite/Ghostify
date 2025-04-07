import mailClient, { MailDataRequired } from '@sendgrid/mail';
import process from "node:process";

mailClient.setApiKey(process.env.SENDGRID_API_KEY!);

export const mailDraft = (
  data: MailDataRequired | { html: string | string[]; to: string },
) => {
  const aditionnal = {};
  const msg = {
    to: 'nogbedziyaomessan13@gmail.com', // Change to your recipient
    from: 'ghostify@ghostify.site', // Change to your verified sender
    subject: 'Sending with SendGrid is Fun',
    text: 'and easy to do anywhere, even with Node.js',
  };
  if ('to' in data && 'from' in data && 'subject' in data && 'text' in data) {
    return {
      ...data,
      ...aditionnal,
    };
  }
  return {
    ...data,
    ...msg,
    ...aditionnal,
  };
};

export const clientSender = mailClient;
