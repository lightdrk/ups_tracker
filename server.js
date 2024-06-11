const express = require('express');
const {track} = require('./utils/tracker');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname,'pdf_download')));
app.use(bodyParser.json());
app.use(cors());

// for index.html request 

app.get('/', (req,res)=>{
	res.sendFile(path.join(__dirname, 'public', 'frontend.html'));
});


app.post('/api/generate-pod', async (req, res)=>{
	const query = req.body;
	try{
		await track(query.numbers);
	}catch(error){
		return res.status(500);
	}
	res.setHeader('Access-Controll-Allow-Origin', '*');
	return res.status(200).json({"status": "success"});
});

app.get('/api/download-pod/ups_pod.pdf', async (req, res)=>{
	const filePath = path.join(__dirname,'pdf_download','merged.pdf');
	res.download(filePath,(err)=>{
		if (err) {
			console.error('Error while downloading', err);
			res.status(404).send('file not found');
		}
	});

});


app.listen(PORT,'0.0.0.0', async()=>{
	console.log('url:',`http://localhost:${PORT}`);
	const open = (await import('open')).default;
	await open(`http://localhost:${PORT}`);
});
