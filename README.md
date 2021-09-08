# crmbot

## Why?
I have some free time and my brother need some CRM bot so they can maintain their business easier.

#### Telegram require us to use https in our development environment, so you need to create your own SSL certificate to use this. Use below script to generate:
```bash
$ mkdir certs && cd certs
$ openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365
$ openssl rsa -in keytmp.pem -out key.pem
```
