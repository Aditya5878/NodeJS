import nodemailer from "nodemailer";
import Mailgen from "mailgen";

interface SendEmailOptions {
  email: string;
  subject: string;
  mailgenContent: Mailgen.Content;
}

const sendEmail = async (options: SendEmailOptions) => {
  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Task Manager",
      link: "https://taskmanagerlink.com",
    },
  });

  const emailText = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHtml = mailGenerator.generate(options.mailgenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMTP_HOST!,
    port: Number(process.env.MAILTRAP_SMTP_PORT!),
    auth: {
      user: process.env.MAILTRAP_SMTP_USERNAME!,
      pass: process.env.MAILTRAP_SMTP_PASSWORD!,
    },
  });

  await transporter.sendMail({
    from: '"Task Manager" <no-reply@taskmanager.com>',
    to: options.email,
    subject: options.subject,
    text: emailText,
    html: emailHtml,
  });
};



const emailVerificationMailgenContent = (
  username: string,
  verificationUrl: string,
) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our APP! we are excited to have you on board.",
      action: {
        instructions:
          "To verifiy your email please click on the following button",
        button: {
          color: "#1aae5aff",
          text: "Verify your Email",
          link: verificationUrl,
        },
      },
      outro:
        "Need help or have question please reply to this mail we would love to help you.",
    },
  };
};

const forgotPasswordMailgenContent = (
  username: string,
  passwordResetUrl: string,
) => {
  return {
    body: {
      name: username,
      intro: "We got the request to reset you password",
      action: {
        instructions:
          "To reset the password please click on the following button",
        button: {
          color: "#22BC66",
          text: "Reset Password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help or have question please reply to this mail we would love to help you.",
    },
  };
};

export { emailVerificationMailgenContent, forgotPasswordMailgenContent,sendEmail };
