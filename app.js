const fs = require('fs');
const https = require('https');
const path = require('path');
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');
const orderMessage = require('./messaging/order');

const port = 3000;

require('dotenv').config({
  path: process.env.NODE_ENV === 'development'
    ? path.resolve(__dirname, './.env')
    : path.resolve(__dirname, `./.env.${process.env.NODE_ENV}`)
});

const key = fs.readFileSync(path.resolve(__dirname, './certs/key.pem'));
const cert = fs.readFileSync(path.resolve(__dirname, './certs/cert.pem'));

const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

const app = express();

const server = https.createServer({ key: key, cert: cert }, app);

app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));

app.post('/bot/message', async (req, res) => {
  bot.sendMessage(process.env.GROUP_ID, 'hello world');
  res.sendStatus(200);
});

app.get(`/bot/updates`, async (req, res) => {
  bot.getUpdates({ limit: 10 });
  res.sendStatus(200);
});

app.post(`/bot/order`, async (req, res) => {
  bot.sendMessage(
    process.env.GROUP_ID,
    orderMessage(req.body),
    {
      parse_mode: 'HTML',
      reply_markup: {
        one_time_keyboard: true,
        resize_keyboard: true,
        inline_keyboard: [
          [
            {
              text: 'Tackle',
              callback_data: 'tackled'
            }
          ]
        ]
      }
    }
  );
  res.sendStatus(200);
});

server.listen(port, () => {
  console.log(`listening on ${port}`);
});

/* Ping bot */
// bot.on('message', context => {
//   if (process.env.NODE_ENV === 'development') {
//     bot.sendMessage(context.chat.id, 'Hello sir!');
//   }
// });

/* Callback listener */
bot.on('callback_query', (query) => {
  if (query.data === 'tackled') {
    const from = query.from.first_name.toUpperCase();
    const { text, message_id: messageId } = query.message;
    const chatId = query.message.chat.id;

    bot.editMessageText(
      text + `\n\nTackled by <b>${from}</b>`,
      {
        message_id: messageId,
        chat_id: chatId,
        reply_markup: null,
        parse_mode: 'HTML'
      }
    );
  }
});
