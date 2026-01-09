// @see https://blog.logrocket.com/send-emails-nodejs-nodemailer/
import { createTransport } from 'nodemailer';
import hbs from 'nodemailer-express-handlebars';
import path from 'path';
import configs from '../configs.js';
import LogUtils from '../utils/LogUtils.js';

const mailerService = configs.mailer.service;
const mailerUsername = configs.mailer.user;
const mailerPassword = configs.mailer.pass;

// initialize nodemailer
const transporter = createTransport({
  ...(configs.mailer.host
    ? {
        host: configs.mailer.host,
        port: configs.mailer.port,
        secure: configs.mailer.secure
      }
    : {
        service: mailerService
      }),
  auth: { user: mailerUsername, pass: mailerPassword }
});

const templateDir = path.resolve('public/mail-template');

// point to the template folder
const handlebarOptions = {
  viewEngine: {
    partialsDir: templateDir,
    defaultLayout: false
  },
  viewPath: templateDir
};

// use a template file with nodemailer
transporter.use('compile', hbs(handlebarOptions));

export const sendMailSync = async (receiver, subject, templateName, context, attachments) => {
  if (typeof receiver === 'string') {
    receiver = [receiver];
  }

  return transporter.sendMail({
    from: mailerUsername,
    to: receiver,
    subject,
    template: templateName,
    context,
    attachments
  });
};

// need to custom template
export const sendMail = (receiver, subject, title, content) => {
  if (typeof receiver === 'string') {
    receiver = [receiver];
  }

  const mailOptions = {
    from: configs.mailer.user, // sender address
    to: receiver,
    subject,
    template: 'verification', // public/mail-template/verification.hbs
    context: {
      logoHref: 'https://mern-ecommerce-b848d.web.app/',
      description: 'Welcome to HK Mobile',
      title,
      content
    },
    attachments: [
      {
        filename: 'hk.png',
        path: `${templateDir}/img/hk.png`,
        cid: 'logo'
      },
      {
        filename: 'facebook.png',
        path: `${templateDir}/img/facebook.png`,
        cid: 'facebook'
      },
      {
        filename: 'twitter.png',
        path: `${templateDir}/img/twitter.png`,
        cid: 'twitter'
      },
      {
        filename: 'instagram.png',
        path: `${templateDir}/img/instagram.png`,
        cid: 'instagram'
      },
      {
        filename: 'github.png',
        path: `${templateDir}/img/github.png`,
        cid: 'github'
      }
    ]
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      LogUtils.error('MAILER', 'Error sending mail', err);
    } else {
      LogUtils.info('MAILER', 'Mail sent', info);
    }
  });
};


export const sendWithOtpTemplate = async (receiver, otp, language = 'vi') => {
  let subject;
  let templateName = 'otp' + '.' + language;
  if (language === 'en') {
    subject = `Email verification code: ${otp}`;
  } else {
    subject = `Mã xác minh của bạn là: ${otp}`;
  }

  return sendMailSync(receiver, subject, templateName, {
    logoHref: 'https://mern-ecommerce-b848d.web.app/',
    otpCode: otp,
  }, [
    {
      filename: 'hk.png',
      path: `${templateDir}/img/hk.png`,
      cid: 'logo'
    },
    {
      filename: 'facebook.png',
      path: `${templateDir}/img/facebook.png`,
      cid: 'facebook'
    },
    {
      filename: 'twitter.png',
      path: `${templateDir}/img/twitter.png`,
      cid: 'twitter'
    },
    {
      filename: 'instagram.png',
      path: `${templateDir}/img/instagram.png`,
      cid: 'instagram'
    },
    {
      filename: 'github.png',
      path: `${templateDir}/img/github.png`,
      cid: 'github'
    }
  ]);
}


export const sendPasswordResetEmail = async (email, token, resetBaseUrl) => {
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'https://mern-ecommerce-b848d.web.app';
    const resetUrl = resetBaseUrl
      ? `${resetBaseUrl}?token=${token}`
      : `${frontendUrl}/reset-password?token=${token}`;

    const mailOptions = {
      from: configs.mailer.user,
      to: email,
      subject: 'Đặt lại mật khẩu - VanhShop',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 20px;">
             <img src="cid:logo" alt="VanhShop" style="height: 50px;" />
          </div>
          <h2>Đặt lại mật khẩu</h2>
          <p>Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản VanhShop của mình.</p>
          <p>Vui lòng click vào link bên dưới để đặt lại mật khẩu:</p>
          <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
            Đặt lại mật khẩu
          </a>
          <p>Hoặc copy link sau vào trình duyệt:</p>
          <p style="word-break: break-all; color: #666;">${resetUrl}</p>
          <p style="color: #666; font-size: 14px; margin-top: 24px;">
            Link này sẽ hết hạn sau 15 phút.<br>
            Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
          </p>
        </div>
      `,
      attachments: [{
        filename: 'vanhshop-logo.png',
        path: path.resolve('public/mail-template/img/vanhshop-logo.png'),
        cid: 'logo'
      }]
    };

    const info = await transporter.sendMail(mailOptions);
    LogUtils.info('MAILER', 'Password reset email sent', info);
    return info;
  } catch (err) {
    LogUtils.error('MAILER', 'Error sending password reset email', err);
    throw err;
  }
};

export const sendVerificationEmail = async (email, token) => {
  try {
    const frontendUrl = process.env.FRONTEND_URL || 'https://mern-ecommerce-b848d.web.app';
    const verifyUrl = `${frontendUrl}/verify-email?token=${token}`;

    const mailOptions = {
      from: configs.mailer.user,
      to: email,
      subject: 'Xác thực tài khoản - VanhShop',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="text-align: center; margin-bottom: 20px;">
             <img src="cid:logo" alt="VanhShop" style="height: 50px;" />
          </div>
          <h2>Xác thực tài khoản</h2>
          <p>Cảm ơn bạn đã đăng ký tài khoản VanhShop!</p>
          <p>Vui lòng click vào link bên dưới để xác thực email của bạn:</p>
          <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2196F3; color: white; text-decoration: none; border-radius: 4px; margin: 16px 0;">
            Xác thực email
          </a>
          <p>Hoặc copy link sau vào trình duyệt:</p>
          <p style="word-break: break-all; color: #666;">${verifyUrl}</p>
        </div>
      `,
      attachments: [{
        filename: 'vanhshop-logo.png',
        path: path.resolve('public/mail-template/img/vanhshop-logo.png'),
        cid: 'logo'
      }]
    };

    const info = await transporter.sendMail(mailOptions);
    LogUtils.info('MAILER', 'Verification email sent', info);
    return info;
  } catch (err) {
    LogUtils.error('MAILER', 'Error sending verification email', err);
    throw err;
  }
};
