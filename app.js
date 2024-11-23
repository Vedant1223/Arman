const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const QRCode = require('qrcode');
const path = require('path');

const app = express();
const port = 8081;

// Middleware setup
app.use(bodyParser.json());
app.use(cors());

// Serve static client files
app.use(express.static(path.join(__dirname, 'client')));

// Helper function to format QR code text
const formatData = (data) => {
    return `Product ID: ${data.id}, Price: $${data.price}`;
};

// Helper function to generate QR code
const generateQRCode = async (qrCodeText) => {
    const options = {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        margin: 1,
    };

    return await QRCode.toBuffer(qrCodeText, options);
};

// Route to generate QR code
app.post('/generate-qr', async (req, res) => {
    try {
        const { data } = req.body;

        if (!data || !data.id || !data.price) {
            return res.status(400).send({ error: 'Invalid data provided' });
        }

        const qrCodeText = formatData(data);
        const qrCodeBuffer = await generateQRCode(qrCodeText);

        res.setHeader('Content-Disposition', 'attachment; filename=qrcode.png');
        res.type('image/png').send(qrCodeBuffer);
    } catch (err) {
        console.error('Error generating QR code:', err);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
    console.log(`Client is available at http://localhost:${port}/index.html`);
});
