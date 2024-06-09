import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import nodemailer from "nodemailer";
import Mailgen from "mailgen";
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

app.use(express.json());

const mailPort = Number(process.env.EMAIL_PORT) || 465;

app.post("/auth-email", (req: Request, res: Response) => {
  const config = {
    host: process.env.EMAIL_HOST,
    port: mailPort,
    secure: mailPort == 465,
    auth: {
      user: process.env.EMAIL_LOGIN,
      pass: process.env.EMAIL_PASSWORD,
    },
  };
  const transporter = nodemailer.createTransport(config);

  const MailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: process.env.SERVICE_NAME as string,
      link: process.env.DOMAIN as string,
    },
  });

  const response = {
    body: {
      signature: false,
      greeting: req.body.name || "Здравствуйте",
      intro: `Ваш код подтверждения: ${req.body.code}`,
    },
  };

  const mail = MailGenerator.generate(response);

  const message = {
    from: `"Авторизация" <${process.env.EMAIL_LOGIN}>`,
    to: req.body.email,
    subject: `Ваш код подтверждения на сайте ${process.env.DOMAIN}`,
    html: mail,
  };

  transporter
    .sendMail(message)
    .then((info) => {
      return res.json({
        msg: "Емейл отправлен",
        info: info.messageId,
        preview: nodemailer.getTestMessageUrl(info),
      });
    })
    .catch((err: Error) => {
      return res.status(500).json({ msg: err });
    });
});

app.listen(port, () => {
  console.log(`[server]: Сервис запущен на порту ${port}`);
});
