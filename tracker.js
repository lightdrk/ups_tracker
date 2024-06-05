const puppeteer = require('puppeteer');

async function track(track){
	const browser = await puppeteer.launch({ headless: 'new', defaultViewport: null, args: ['--start-maximized'],});
	const page = await browser.newPage();

	const customUserAgent = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36';
  	await page.setUserAgent(customUserAgent);

	await page.goto(`https://www.ups.com/track?track=yes&trackNums=${track}`, { waitUntil: 'load' });
	try{
		await page.waitForSelector('#stApp_btnProofOfDeliveryonDetails');
	}catch(err){
		console.log('id : stApp_btnProofOfDeliveryonDetails ,wait time exceeded ');
		await page.screenshot({path: 'error.png'});
		console.error(err);
	}
	try{
		await page.evaluate(()=> {
			let proof_of_delivery = document.getElementById('stApp_btnProofOfDeliveryonDetails');
			proof_of_delivery.click();
		});
	}catch(err){
		console.log('error on line 19, id:stApp_btnProofOfDeliveryonDetails unable to click');
		console.error(err);
	}
	
	try{
		await page.waitForSelector('#stApp_POD_btnPrint');
	}catch(err){
		console.log('error on line , waittime exceeded');
		console.error(err);
	}

	try{
		await page.evaluate(()=>{
			let print = document.getElementById('stApp_POD_btnPrint');
			print.click();
		});
	}catch(err){
		console.log('error on line 37, click failed');
		console.error(err);

	}
	let numberOfPages = await browser.pages();
	console.log(numberOfPages);
	const newPage = numberOfPages[2];
	await newPage.bringToFront();
	try{
		await newPage.evaluate(() => {
			const old = window.close;
			window.close = function(){
				console.log('intercepted');
			}
		});
	}catch (err){
		console.log('intercept of window.close failed on line 58');
		console.error(err);
	}
	await page.keyboard.press('Escape');
	await page.emulateMediaType('print');
//	try{
//		await page.setRequestInterception(true);
//	}catch(err){
//		console.log('error on line 27, Request intercept failed ')
//	}
//	page.on('request', interceptedRequest=> {
//		console.log(interceptedRequest.resourceType());
//		console.log(interceptedRequest.url());
//	});
	await newPage.screenshot({path: 'screen.png'});
	await newPage.pdf({path: 'screen.pdf', format: 'A4', printBackground: true, preferCSSPageSize: true });
	await browser.close();

}

track('1Z2285R50347274683');
