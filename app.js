import request from 'request';
import cheerio from 'cheerio';
import puppeteer from 'puppeteer';
import TelegramApi from 'node-telegram-bot-api';
import * as dotenv from 'dotenv'
dotenv.config()
import { client, addNewUser, increaseUserDownloads } from './db.js'

//db connection
client.connect((err) => {
    if (err) {
        console.log(err.message)
    }
    console.log('connected to db')
})

const token = process.env.BOT_API_KEY;

const bot = new TelegramApi(token, { polling: true, port: 3001 });
var images = [];

//output
const output = async (images, chatId) => {
    for await (const img of images) {
        bot.sendDocument(chatId, img)
    }
}

//olx function
const olx = async function olx(url, chatId) {
    bot.sendMessage(chatId, '>_<\nOLX чуть довше, ждіті')
    const browser = await puppeteer.launch({ args: ['--no-sandbox'], headless: true });
    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080 })

    await page.goto(url)

    var images = [];
    var img = await page.evaluate(() => document.querySelector('.swiper-slide-active > div >img').src)
    images.push(img)

    //10 clicks
    await page.click('.swiper-button-next')
    await page.click('.swiper-button-next')
    await page.click('.swiper-button-next')
    await page.click('.swiper-button-next')
    await page.click('.swiper-button-next')
    await page.click('.swiper-button-next')
    await page.click('.swiper-button-next')
    await page.click('.swiper-button-next')
    await page.click('.swiper-button-next')
    await page.click('.swiper-button-next')

    var kartinkas = await page.evaluate(() => Array.from(document.querySelectorAll('.swiper-zoom-container >img')).map((x) => x.src))
    var images = [...new Set(kartinkas)];

    output(images, chatId)
    increaseUserDownloads('olx', chatId, images.length)
    await browser.close()
}

//dom.ria function
const domRia = async function (url, chatId) {
    bot.sendMessage(chatId, '>_<\ndom.ria грузітісь,ждіті')
    request(url, function (err, res, body) {
        if (!err && res.statusCode === 200) {
            var $ = cheerio.load(body);
            images = [];
            $('img', 'picture.slideImage').each(function () {
                var img = $(this).attr('src');
                images.push(img);
            })
        }
        output(images, chatId)
        increaseUserDownloads('domria', chatId, images.length)
    })
}


//Кнопочки для документіків
const showDocs = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{ text: 'Договір оренди та акт', callback_data: 'doc1' }],
            [{ text: 'Ексклюзивний договір та акти', callback_data: 'doc2' }],
        ]
    })
}


bot.setMyCommands([
    { command: '/start', description: 'Починає роботу з ботом' },
    { command: '/docs', description: 'Список доступних документів' },
    { command: '/o1', description: '1-кімнатна квартира | оренда' },
    { command: '/o2', description: '2-кімнатна квартира | оренда' },
    { command: '/o3', description: '3-кімнатна квартира | оренда' },
    { command: '/constr', description: 'Конструктор описів' },
    { command: '/m1', description: 'Макети на розклейку | Анастасія' },
    { command: '/m2', description: 'Макети на розклейку | Тетяна' },
    { command: '/stats', description: 'Показує статистику по закачкам' }
])




bot.on('callback_query', async (msg) => {
    const data = msg.data;
    const chatId = msg.message.chat.id;

    if (data === 'doc1') {
        return [bot.sendDocument(chatId, 'BQACAgIAAxkBAAIgAmNjCf2OT6SgWbs_S83ge21YVWI9AAKFKAACuq0ZS82l5gJbUCyQKgQ'),
        bot.sendDocument(chatId, 'BQACAgIAAxkBAAIM0mKwu9Gg8LfPa3J_ndLiNpz8qZ9qAAJGGwACmEqJSShZUOdMxBuPKAQ')]
    } else if (data === 'doc2') {
        return bot.sendDocument(chatId, "BQACAgIAAxkBAAIM02Kwu-BEdEcpzI54rwABUK2L4bivCQACRxsAAphKiUmj8ojC96GUKigE")
    }
})


bot.on('message', async msg => {

    const url = msg.text
    console.log(url)
    const userName = msg.from.username
    const chatId = msg.chat.id

    if (url === '/start') {
        try {
            addNewUser(chatId, userName)
        }
        catch (e) {
            console.log(e.message)
        }

        bot.sendMessage(chatId, 'Шалом Анастасія')
    }

    if (url === '/o1') {
        bot.sendMessage(chatId, 'Здам в оренду однокімнатну квартиру на довготривалий термін.\nКвартира тепла та затишна, поруч є все необхідне для комфортного проживання, магазини, супермаркети.\nКвартира здається лише на довгий термін, для порядних людей без шкідливих звичок.\nТихий та спокійний район міста.')
    }

    if (url === '/o2') {
        bot.sendMessage(chatId, 'Здам в оренду двокімнатну квартиру на довготривалий термін.\nКвартира тепла та затишна, поруч є все необхідне для комфортного проживання, магазини, супермаркети.\nКвартира здається лише на довгий термін, для порядних людей без шкідливих звичок.\nТихий та спокійний район міста.')
    }

    if (url === '/o3') {
        bot.sendMessage(chatId, 'Здам в оренду трикімнатну квартиру на довготривалий термін.\nКвартира тепла та затишна, поруч є все необхідне для комфортного проживання, магазини, супермаркети.\nКвартира здається лише на довгий термін, для порядних людей без шкідливих звичок.\nТихий та спокійний район міста.')
    }

    if (url === '/docs') {
        bot.sendMessage(chatId, 'От які є документікі:', showDocs)
    }

    if (url === '/constr') {
        bot.sendMessage(chatId, 'https://kazapanama.github.io/realty-constructor/')
    }

    if (url === '/stats') {

        client.query('SELECT * FROM users', (err, result) => {
            if (err) {
                return console.error('error running query', err);
            }
            const allStats = result.rows

            const userStats = allStats.find(item => item.userid === chatId)

            const totalDownloads = allStats.reduce((acc, item) => acc += (item.olx_total_saved + item.domria_total_saved), 0)

            const text = `
            Статистика по користувачу ${userName}:
            скачано з olx:${userStats.olx_total_saved}
            скачано з domria:${userStats.domria_total_saved}
            
            Всього ботом скачано:${totalDownloads} з моменту початку підрахунку
            `
            bot.sendMessage(chatId, text)
        })



    }

    if (url === '/m1') {
        bot.sendDocument(chatId, "BQACAgIAAxkBAAIM1GKwu_pKrvhMrwLMXolazbGqILZ-AAJJGwACmEqJSf9SkTrf2ozBKAQ")
        bot.sendDocument(chatId, "BQACAgIAAxkBAAIM1WKwvBIlz2N-ysd7-MVbxJLZxy6zAAJKGwACmEqJSeJ2W18viFbgKAQ")
    }

    if (url === '/m2') {
        bot.sendDocument(chatId, "BQACAgIAAxkBAAIM1mKwvCYaDw3em1G7Ai4ZQIP-_vufAAJLGwACmEqJSbwp7ihS6tpkKAQ")
        bot.sendDocument(chatId, "BQACAgIAAxkBAAIM12KwvDpLz9RfsvSHqyKovFwMsNWnAAJMGwACmEqJSZtF-lhptkSqKAQ")
    }

    if (url.indexOf('https') == 0) {

        //olx direct link
        if (url.indexOf('olx.ua') === 8 || url.indexOf('olx.ua') === 12) {
            olx(url, chatId)
            images = []
        }

        //dom.ria direct link
        if (url.indexOf('dom.ria') === 8 || url.indexOf('dom.ria') === 12) {
            domRia(url, chatId)
            images = []
        }

        //olx mobile link
        if (url.indexOf('m.') == 8) {
            olx('https://' + url.slice(10), chatId)
            images = []
        }
    } else {
        //copy pasted msg
        if (url.indexOf('https') > 3) {

            if (url.includes('https://dom.ria')) {
                domRia(url.slice(url.indexOf('https'), (url.indexOf('.html') + 5)), chatId)
                images = []
            }

            if (url.includes('https://m.olx.ua')) {
                olx('https://' + url.slice(url.indexOf('olx.ua')), chatId)

                images = []
            }

            if (url.includes('https://olx.ua') || url.includes('https://www.olx.ua')) {
                olx(url.slice(url.indexOf('https'), (url.indexOf('.html') + 5)), chatId)
                images = []
            }

        }

    }





})














