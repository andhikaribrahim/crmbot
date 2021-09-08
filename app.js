const fs = require('fs');
const https = require('https');
const path = require('path');
const express = require('express');
const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
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

app.post('/bot/message', async (req, res) => {
  bot.sendMessage(process.env.GROUP_ID, 'hello world');
  res.sendStatus(200);
});

app.get(`/bot/updates`, async (req, res) => {
  bot.getUpdates({ limit: 10 });
  res.sendStatus(200);
});

server.listen(port, () => {
  console.log(`listening on ${port}`);
});

/* Ping bot */
bot.on('message', context => {
  bot.sendMessage(context.chat.id, 'Hello sir!');
});
