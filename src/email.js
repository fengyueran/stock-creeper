const nodemailer = require('nodemailer');
const emailConfig = require('./email-config.json');

const fillTemplate = (info) => {
  const { baseInfo, stockInfo } = info;
  const makeKeyValue = (key, value) => {
    return `<h3>${key}：<span style="font-size: 16px;color: blue;">${value}</span></h3>`;
  };
  const keyInfos = [
    { key: '股票名', value: stockInfo.stockName },
    { key: '股票代码', value: stockInfo.stockCode },
    { key: '当前股价', value: stockInfo.now },
    { key: '最高股价', value: stockInfo.high },
    { key: '最低股价', value: stockInfo.low },
    { key: '行情', value: baseInfo.cnt },
    { key: '评分', value: baseInfo.score.score },
    { key: '评论', value: baseInfo.score.comment },
  ];
  return `
  <div>
    ${keyInfos.map(({ key, value }) => makeKeyValue(key, value)).join('')}
    <div>----------------------分割线-----------------------</div>
  </div>`;
};

const sendEmail = (subject, html) => {
  const mailTransport = nodemailer.createTransport({
    service: 'qq',
    port: 465,
    auth: {
      user: emailConfig.user,
      pass: emailConfig.pass,
    },
  });
  const options = {
    from: `<${emailConfig.user}>`,
    to: `<${emailConfig.to}>`,
    subject,
    html,
  };

  mailTransport.sendMail(options, function (err, msg) {
    if (err) {
      console.log(err);
    } else {
      console.log(msg);
    }
  });
};

const makeEmailSubject = (keyStocks) => {
  const formatted = keyStocks.map(({ stockInfo }) => {
    return `${stockInfo.stockName}:${stockInfo.now}`;
  });
  const subject = formatted.join(';');
  return subject;
};

const makeEmailContent = (keyStocks) => {
  const formatted = keyStocks.map((stockInfo) => fillTemplate(stockInfo));
  const content = formatted.join('\n');
  return content;
};

const makeEmailAndSend = (keyStocks) => {
  const subject = makeEmailSubject(keyStocks);
  const content = makeEmailContent(keyStocks);
  sendEmail(subject, content);
};

exports.makeEmailAndSend = makeEmailAndSend;
