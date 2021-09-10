const express = require('express');
const router = express.Router();
const orderMessage = require('../messaging/order');

module.exports = function(bot) {
  return router.post('/api/order', async (req, res) => {
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
};
