const Koa = require('koa2')
const cors = require('koa2-cors')
const app = new Koa()
const Router = require('koa-router')
const router = new Router()
const port = 5566
const puppeteer = require('./puppeteer')

puppeteer.create()

app.use(router.routes())

app.use(cors())

router.get('/', async(ctx) => {
    ctx.body = puppeteer.getMain()
})

router.get('/search', async(ctx, next) => {
    ctx.set("Content-Type", "application/json")
    ctx.body = await puppeteer.getSearch(ctx.query.kw)
    next()
})

router.get('/searchlist', async(ctx, next) => {
    ctx.set("Content-Type", "application/json")
    ctx.body = await puppeteer.getSearchList(ctx.query.kw)
    next()
})

app.listen(port)

console.log(`server running on: 127.0.0.1:${port}`);