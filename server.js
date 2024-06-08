const express = require('express');
const {track} = require('./tracker');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(cors());

app.post('/api/generate-pod', async (req, res)=>{
	console.log(req);
	const query = req.body;
	console.log(query);
	await track(query.numbers);
	res.setHeader('Access-Controll-Allow-Origin', '*');
	return res.status(200).json({"status": "success"});
});

app.listen(PORT,'0.0.0.0',()=>{
	console.log(`${PORT}`);
});
