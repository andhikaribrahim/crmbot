const fs = require('fs');
const https = require('https');
const path = require('path');
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config({
  path: process.env.NODE_ENV === 'development'
    ? path.resolve(__dirname, './.env')
    : path.resolve(__dirname, `./.env.${process.env.NODE_ENV}`)
});
const port = process.env.PORT;

const key = process.env.NODE_ENV === 'development' ? fs.readFileSync(path.resolve(__dirname, './certs/key.pem')) : null;
const cert = process.env.NODE_ENV === 'development' ? fs.readFileSync(path.resolve(__dirname, './certs/cert.pem')) : null;

const token = process.env.TOKEN;

let bot;
if (process.env.NODE_ENV === 'production') {
  bot = new TelegramBot(token);
  // bot.setWebHook(process.env.WEBHOOK_URL + token);
} else {
  bot = new TelegramBot(token, { polling: true });
}

const webhook = require('./api/webhook')(bot);
const order = require('./api/order')(bot);

const app = express();

const server = process.env.NODE_ENV === 'development' && https.createServer({ key: key, cert: cert }, app);

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

app.use('/', webhook);
app.use('/', order);

if (process.env.NODE_ENV === 'development') {
  server.listen(port, () => {
    console.log(`listening on ${port}`);
  });
} else {
  app.listen(port, () => {
    console.log(`listening on ${port}`);
    bot.setWebHook(process.env.WEBHOOK_URL + process.env.TOKEN);
  });
}

/* Ping bot */
bot.on('message', context => {
  if (process.env.NODE_ENV === 'development') {
    // bot.sendMessage(context.chat.id, 'Hello sir!');
    // console.log(context);
  }
});

/* Callback listener */
bot.on('callback_query', (query) => {
  // console.log(query);
  if (query.data === 'tackled') {
    const from = query.from.first_name.toUpperCase();
    const { text, message_id: messageId } = query.message;
    const chatId = query.message.chat.id;
    const whatsappUrl = query.message.entities[0].url;

    bot.editMessageText(
      text + `\n\nTackled by <b>${from}</b>\nContact customer by using <a href="${whatsappUrl}">this link</a>`,
      {
        message_id: messageId,
        chat_id: chatId,
        reply_markup: null,
        parse_mode: 'HTML'
      }
    );
  }
});
