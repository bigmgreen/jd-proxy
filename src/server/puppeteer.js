const path = require('path');
const puppeteer = require('puppeteer-core')

const Puppeteer = {
    browser: null,

    page: null,

    async create() {
        this.browser = await puppeteer.launch({
            executablePath: path.resolve(__dirname, '../../chrome-win/chrome.exe'),
            headless: false
        });

        this.page = await this.browser.newPage();

        await this.page.goto('https://www.jd.com', { waitUntil: 'networkidle2' });

        await this.page.focus('#key');
        
        await this.page.keyboard.sendCharacter('硬盘');

        await this.page.on('response', async (response) => {    
            if (response.url().indexOf('https://dd-search.jd.com/?terminal') !== -1){
                console.log(await response.text()); 
            } 
        });

    },

    getMain() {
        return '66'
    },

    getSearch() {
        return '88'
    },
}

module.exports = Puppeteer