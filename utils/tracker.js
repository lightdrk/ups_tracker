const puppeteer = require('puppeteer');
const path = require('path');
const { merge } = require('./merge');

async function track(tracks, browser, name){
	const page = await browser.newPage();

	const customUserAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36';
  	await page.setUserAgent(customUserAgent);
	const paths = []
	for (let track of tracks){
		console.log('At start', await browser.pages());
		try {
			await page.goto(`https://www.ups.com/track?track=yes&trackNums=${track}`, { waitUntil: 'load' });
		}catch(err){
			console.log('error opening site');
			console.error(err);
			throw err;
		}

		try{
			await page.waitForSelector('#stApp_btnProofOfDeliveryonDetails');
		}catch(err){
			console.log('id : stApp_btnProofOfDeliveryonDetails ,wait time exceeded ');
			await page.screenshot({path: 'error.png'});
			console.error(err);
			throw err;
		}
		
		try{
			await page.evaluate(()=> {
				let proof_of_delivery = document.getElementById('stApp_btnProofOfDeliveryonDetails');
				proof_of_delivery.click();
			});
		}catch(err){
			console.log('id:stApp_btnProofOfDeliveryonDetails unable to click');
			console.error(err);
			throw err;
		}
		
		try{
			await page.waitForSelector('#stApp_POD_btnPrint');
		}catch(err){
			console.log('error on line , waittime exceeded');
			console.error(err);
			throw err;
		}

		try{
			await page.evaluate(()=>{
				let print = document.getElementById('stApp_POD_btnPrint');
				print.click();
			});
		}catch(err){
			console.log('error on line 37, click failed');
			console.error(err);
			throw err;

		}
		let numberOfPages = await browser.pages();
		console.log(numberOfPages);
		const newPage = numberOfPages[2];
		await newPage.setUserAgent(customUserAgent);
		await newPage.bringToFront();
	//	let urls = null;
	//	try{
	//		urls = await newPage.evaluate(()=>{
	//			const links = [];
	//			for (let link of document.getElementsByTagName("link")){
	//				if (link.type === "text/css"){
	//					links.push(link.href);
	//				}
	//			}
	//			return links;

	//		});
	//	}catch (err){
	//		console.log('unable to grab links');
	//		console.error(err);
	//	}

	//	console.log("css file links ", urls);
	//	for (let css of urls){
	//		await page.addStyleTag({url: css});
	//	}


	//	try{
	//		await newPage.evaluate(() => {
	//			const old = window.close;
	//			window.close = function(){
	//				console.log('intercepted');
	//			}
	//		});
	//	}catch (err){
	//		console.log('intercept of window.close failed on line 58');
	//		console.error(err);
	//		throw err;
	//	}

		newPage.on('console', message=>{
			console.log(message.text());
		});

		await newPage.screenshot({path: 'screen.png'});
		await newPage.pdf({path: path.join(__dirname,'../','pdf_download',`${track}.pdf`), format: 'A4', printBackground: true, preferCSSPageSize: true });
		await newPage.close();
		paths.push(path.join(__dirname,'../', 'pdf_download', `${track}.pdf`));
	}
	await page.close();
	console.log(name);
	await merge(paths, path.join(__dirname,'../','pdf_download', `${name}merged.pdf`));

}

exports.track = track;
