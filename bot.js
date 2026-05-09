const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const shops = require('./shops.json');

const app = express();

const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Scan the QR code above');
});

client.on('ready', () => {
    console.log('WhatsApp Bot is Ready ✅');
});

client.on('message', async (message) => {

    const text = message.body.toLowerCase().trim();

    console.log('Message:', text);

    // If customer asks for shoes
    if (text.includes('shoes')) {

        message.reply('Please share your pincode 😊');

    }

    // If message is a 6-digit pincode
    else if (/^\d{6}$/.test(text)) {

        const matchingShops = shops.filter(
            shop => shop.pincode === text
        );

        if (matchingShops.length > 0) {

            let reply = 'Best nearby shops 😊\n\n';

            matchingShops.forEach((shop, index) => {

                reply += `${index + 1}. ${shop.name}
₹${shop.price} onwards
${shop.link}

`;

            });

            message.reply(reply);

        }

        else {

            message.reply('No nearby shops found 😔');

        }

    }

    // Default reply
    else {

        message.reply(
            'Welcome to ShopLocalHub 🚀\n\nType:\n"I want shoes"'
        );

    }

});
client.initialize();

app.get('/', (req, res) => {
    res.send('Bot Running ✅');
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});