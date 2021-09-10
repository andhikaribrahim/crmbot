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
const bot = new TelegramBot(token, { polling: true });

const order = require('./api/order')(bot);
const index = require('./api/index');

const app = express();

const server = process.env.NODE_ENV === 'development' && https.createServer({ key: key, cert: cert }, app);

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));

app.use('/', index)
app.use('/', order);

// app.post('/api/bot/message', async (req, res) => {
//   bot.sendMessage(process.env.GROUP_ID, 'hello world');
//   res.sendStatus(200);
// });

// app.get(`/api/bot/updates`, async (req, res) => {
//   bot.getUpdates({ limit: 10 });
//   res.sendStatus(200);
// });

if (process.env.NODE_ENV === 'development') {
  server.listen(port, () => {
    console.log(`listening on ${port}`);
  });
} else {
  app.listen(port, () => {
    console.log(`listening on ${port}`);
  });
}

/* Ping bot */
bot.on('message', context => {
  if (process.env.NODE_ENV === 'development') {
    bot.sendMessage(context.chat.id, 'Hello sir!');
  }
});

/* Callback listener */
bot.on('callback_query', (query) => {
  console.log(query);
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
