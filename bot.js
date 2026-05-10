const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const shops = require('./shops.json');

const app = express();

const PORT = process.env.PORT || 3000;

// WhatsApp Client
const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
    headless: true,
    executablePath: '/opt/render/.cache/puppeteer/chrome/linux-*/chrome-linux64/chrome',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
}
});

// QR Code
client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
    console.log('Scan the QR code above');
});

// Bot Ready
client.on('ready', () => {
    console.log('WhatsApp Bot is Ready ✅');
});

// Messages
client.on('message', async (message) => {

    const text = message.body.toLowerCase().trim();

    console.log('Message:', text);

    // Shoes query
    if (text.includes('shoes')) {

        message.reply('Please share your pincode 😊');

    }

    // Pincode check
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

        } else {

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

// Initialize WhatsApp
client.initialize();

// Express Server
app.get('/', (req, res) => {
    res.send('Bot Running ✅');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});