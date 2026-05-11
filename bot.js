const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const puppeteer = require('puppeteer');

const shops = require('./shops.json');

const app = express();

const PORT = process.env.PORT || 3000;

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
        puppeteer: {
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
}
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    }
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Scan the QR Code');
});

client.on('ready', () => {
    console.log('WhatsApp Bot Ready ✅');
});

client.on('message', async (message) => {

    const text = message.body.toLowerCase().trim();

    if (text.includes('shoes')) {

        message.reply('Please share your pincode 😊');

    } else if (/^\\d{6}$/.test(text)) {

        const matchingShops = shops.filter(
            shop => shop.pincode === text
        );

        if (matchingShops.length > 0) {

            let reply = 'Best nearby shops 😊\\n\\n';

            matchingShops.forEach((shop, index) => {

                reply += `${index + 1}. ${shop.name}
₹${shop.price} onwards
${shop.link}

`;

            });

            message.reply(reply);

        } else {

            message.reply('No nearby shops found 😔');

        }

    } else {

        message.reply(
            'Welcome to ShopLocalHub 🚀\\n\\nType: "I want shoes"'
        );

    }

});

client.initialize();

app.get('/', (req, res) => {
    res.send('Bot Running ✅');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});