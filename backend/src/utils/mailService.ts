import mailgun from "mailgun-js";

export async function sendEmail(to: string, subject: string, text: string): Promise<any> {
  const mg = mailgun({
    apiKey: process.env.MAILGUN_API_KEY as string,
    domain: process.env.MAILGUN_DOMAIN as string,
  });

  console.log("MAILGUN_API_KEY:", process.env.MAILGUN_API_KEY);
console.log("MAILGUN_DOMAIN:", process.env.MAILGUN_DOMAIN);


  const emailData = {
    from: `EPIC <no-reply@${process.env.MAILGUN_DOMAIN as string}>`,
    to,
    subject,
    text,
  };

  return new Promise((resolve, reject) => {
    mg.messages().send(emailData, (error: any, body: any) => {
      if (error) {
        console.error("Mailgun Error:", error);
        reject(error);
      } else {
        resolve(body);
      }
    });
  });
}
