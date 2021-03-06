const express = require('express');
const router = express.Router();

module.exports = function(bot) {
  return router.post(`/webhook/${process.env.TOKEN}`, async (req, res) => {
    console.log(req.body);
    bot.processUpdate(req.body);
    res.sendStatus(200);
  });
};
