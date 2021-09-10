const phoneParser = require('../helpers/phoneParser');

function orderMessage(body) {
  const { whatsapp, phone, name, title } = body;
  return `
NEW ORDER COMING UP!\n
Name: ${name}\n
Whatsapp: <a href="https://wa.me/${phoneParser(whatsapp)}">${whatsapp}</a>\n
Phone: <a href="tel:+${phoneParser(phone)}">${phone}</a>\n
Produk: ${title}
  `;
};

module.exports = orderMessage;
