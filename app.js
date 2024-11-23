//app.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const QRCode = require('qrcode');


const app = express();
const port =  8081;

app.use(bodyParser.json());
app.use(cors());
app.use(router);

//controller.js


const router = express.Router();

router.post('/generate-qr', controller.generateQR);

module.exports = router;





exports.formatData = (data) => {
	const qrCodeText = `Product ID: ${data.id}, Price: $${data.price}`;
	return qrCodeText;
};

exports.generateQRCode = async (qrCodeText) => {
	const options = {
		errorCorrectionLevel: 'M',
		type: 'image/png',
		margin: 1
	};

	const qrCodeBuffer = await QRCode.toBuffer(qrCodeText, options);
	return qrCodeBuffer;
};

exports.generateQR = async (req, res) => {
	try {
		const { data } = req.body;

		const qrCodeText = service.formatData(data);

		const qrCodeBuffer = await service.generateQRCode(qrCodeText);

		res.setHeader('Content-Disposition', 'attachment; filename=qrcode.png');
		res.type('image/png').send(qrCodeBuffer);
	} catch (err) {
		console.error('Error generating QR code:', err);
		res.status(500).send({ error: 'Internal Server Error' });
	}
};


app.listen(port, () => {
	console.log(`Server listening on port ${port}`);
});