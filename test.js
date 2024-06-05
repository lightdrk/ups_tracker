const puppeteer = require('puppeteer');

(async ()=>{
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto('https://google.com', {waituntil: 'load'});
	await page.screenshot({path: 'a.jpg'});
	await browser.close();
})();
