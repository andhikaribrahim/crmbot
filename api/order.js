const express = require('express');
const router = express.Router;
const orderMessage = require('../messaging/order');
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.TOKEN;
const bot = new TelegramBot(token, { polling: true });

router.post('/order', async (req, res) => {
  try {
    await bot.sendMessage(
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
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

module.exports = router;
