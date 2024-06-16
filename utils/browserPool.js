const puppeteer = require('puppeteer');

class browserPool{
	constructor(size){
		this.size = size;
		this.pool = [];
	}
	
	async init(){
		for (let i=0; i<this.size; i++){
			const browser = await puppeteer.launch({
				headless: true,
				defaultViewport: null,
				args: ['--no-sandbox', '--disable-setuid-sandbox', '--start-maximized'],
				executablePath: '/app/.apt/opt/google/chrome/chrome',
			  });
			console.log(browser, "up");
			this.pool.push({browser, busy: false});
		}
	}

	getBrowser(){
		for (let browserObj of this.pool){
			if (!browserObj.busy){
				browserObj.busy = true;
				return browserObj.browser;
			}
		}
		return null;
	}

	releaseBrowser(releasedBrowser){
		for (let browserObj of this.pool){
			if (browserObj.browser === releasedBrowser ){
				browserObj.busy = false;
				break;
			}
		}
	
	}

	async destroy(){
		for (const browserObj of this.pool){
			await browserObj.browser.close();
		}
	}
}

module.exports = browserPool ;
