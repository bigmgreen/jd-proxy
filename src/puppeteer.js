const path = require('path');
const puppeteer = require('puppeteer-core')

// 事件池
const Events = {
    store: {},

    on(type, fn) {
        if (!this.store[type]) {
            this.store[type] = fn
        }
    },

    emit(type, data) {
        if (this.store[type]) {
            this.store[type](data)
            delete this.store[type]
        }
    }
}

const Puppeteer = {
    browser: null,

    page: null,

    async create() {
        this.browser = await puppeteer.launch({
            executablePath: path.resolve(__dirname, '../chrome-win/chrome.exe'),
            // headless: true,
            headless: false
        });

        this.page = await this.browser.newPage()

        await this.page.goto('https://www.jd.com', { waitUntil: 'networkidle2' })

        await this.page.on('response', async(response) => {
            if (response.url().indexOf('https://dd-search.jd.com/?terminal') !== -1) {
                const res = await response.text()

                console.log(res)

                Events.emit('search', res)
            }
        })

        console.log('-----------------opened-----------------');
    },

    async _search(kw = '硬盘') {
        await this.page.$eval('#key', (el) => {
            el.value = ''
        })

        await this.page.focus('#key')

        await this.page.keyboard.sendCharacter(kw)

        await this.page.keyboard.down('Tab')
    },

    async getMain(kw) {
        return await this._search(kw)
    },

    async getSearch(kw) {
        this._search(kw)

        return new Promise((resolve) => {
            Events.on('search', (data) => {
                resolve(data);
            })
        })
    },
}

module.exports = Puppeteer