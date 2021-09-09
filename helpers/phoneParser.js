function phoneParser(phone) {
  try {
    let replace = '62' + phone.substr(1);
    return replace;
  } catch (err) {
    return null;
  }
}

module.exports = phoneParser;
