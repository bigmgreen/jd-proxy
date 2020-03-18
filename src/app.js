const Koa = require('koa2')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
const port = 5566
const puppeteer = require('./puppeteer')

puppeteer.create()

app.use(router.routes())

router.get('/', async(ctx) => {
    ctx.body = puppeteer.getMain()
})

router.get('/search', async(ctx, next) => {
    ctx.body = await puppeteer.getSearch(ctx.query.kw)
    next()
})

app.listen(port)

console.log(`server running on: 127.0.0.1:${port}`);