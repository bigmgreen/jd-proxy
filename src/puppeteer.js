const path = require('path');
const cheerio = require('cheerio')
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

// 搜索历史 TODO: 存库
const History = {}

let isRunning = false;

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

        await this.page.goto('https://www.jd.com', { waitUntil: 'load' })

        await this.page.on('response', async(response) => {
            if (response.url().indexOf('https://dd-search.jd.com/?terminal') !== -1) {
                const res = await response.text()

                // console.log(res)

                Events.emit('search', res.replace(/^jQuery\d*\(/, '').replace(/\)$/, ''))
            }

            if (response.url().indexOf('https://search.jd.com/Search') !== -1) {
                const htmlStr = await response.text()

                const $ = cheerio.load(htmlStr, { decodeEntities: false })

                // console.log(res) 
                // global.$ = $
                // global.a = $('#J_goodsList')

                let _shopname = ''
                
                const htmlJson = []

                $('#J_goodsList').find('.gl-item').map((i, el) => {

                    const node = $(el)

                    const imgurl = node.find('[source-data-lazy-img]').attr('source-data-lazy-img')
                    const price = node.find('.p-price strong i').first().text()
                    const title = node.find('.p-name em').first().html()
                    const shopname = node.find('.J_im_icon a').first().text() || _shopname
                    _shopname =  shopname

                    htmlJson.push({ imgurl, price, title, shopname })

                })

                // console.log(htmlJson);

                Events.emit('searchlist', htmlJson)
            }
        })

        isRunning = true

        console.log('-----------------opened-----------------');
    },

    async _search(kw = '') {
        await this.page.$eval('#key', (el) => {
            el.value = ''
        })

        await this.page.focus('#key')

        await this.page.keyboard.sendCharacter(kw)

        await this.page.keyboard.down('Tab')
    },

    async _doSearch(kw = '') {
        if (History[kw]) {
            // 关键字直接搜索
            await this.page.focus('#key')
            await this.page.keyboard.press('Enter')
        } else {
            // 联想词点击
            await this.page.click(`#shelper li[title="${kw}"]`)
        }
    },

    async getSearchList(kw) {
        if (!isRunning) {
            return Promise.resolve('服务未启动，请稍后...')
        }

        if (!kw) {
            return Promise.resolve('非法输入...')
        }

        // if (History[kw] && History[kw].list) {
        //     return Promise.resolve(History[kw].list)
        // }

        this._doSearch(kw)
        return new Promise((resolve) => {
            Events.on('searchlist', (data) => {

                History[kw] = { kw, list: data }

                resolve(data)
            })
        })
    },

    async getSearch(kw) {
        if (!isRunning) {
            return Promise.resolve('服务未启动，请稍后...')
        }

        if (!kw) {
            return Promise.resolve('非法输入...')
        }

        // if (History[kw] && History[kw].kw) {
        //     return Promise.resolve(History[kw].kw)
        // }

        this._search(kw)
        return new Promise((resolve) => {
            Events.on('search', (data) => {
                History[kw] = { kw: data }

                resolve(data)
            })
        })
    },
}

module.exports = Puppeteer