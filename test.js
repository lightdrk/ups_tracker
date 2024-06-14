const express = require('express');
const {track} = require('./utils/tracker');
const browserPool = require('./utils/browserPool');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// creation of pool
const poolSize = 10;
const pool = new browserPool(poolSize);
(async () => {await pool.init();})();
app.use(express.static(path.join(__dirname,'pdf_download')));
app.use(bodyParser.json());
app.use(cors());

// for index.html request 

app.get('/', (req,res)=>{
	res.sendFile(path.join(__dirname, 'public', 'frontend.html'));
});


app.post('/api/generate-pod', async (req, res)=>{
	let browser ;
	while (! ( browser = pool.getBrowser() )) {
		await new Promise(resolve => setTimeout(resolve, 100)); // wait for retry
	}
	console.log(browser);
	const query = req.body;
	res.setHeader('Access-Controll-Allow-Origin', '*');
	try{
		await track(query.numbers,browser,query.name);
	}catch(err){
		return res.status(500).send('Internal error');
	}

	pool.releaseBrowser(browser);

	return res.status(200).json({"status": "success"});
});

app.post('/api/download-pod/ups_pod.pdf', async (req, res)=>{
	const name = req.body.name;
	const filePath = path.join(__dirname,'pdf_download',`${name}merged.pdf`);
	res.download(filePath,(err)=>{
		if (err) {
			console.error('Error while downloading', err);
			res.status(404).send('file not found');
		}
	});

});


const server = app.listen(PORT,'0.0.0.0', async()=>{
	console.log('url:',`http://localhost:${PORT}`);
	const open = (await import('open')).default;
	await open(`http://localhost:${PORT}`);
});

const shutdown = async () => {
    console.log('Shutting down server...');
    await pool.destroy();
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

