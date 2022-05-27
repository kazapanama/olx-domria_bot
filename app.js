var request = require('request');
var cheerio = require('cheerio');
const token = '5306003933:AAFs4w6cFDK9JDNLm6VofJW6CNmkga8dlBI';
const TelegramApi = require('node-telegram-bot-api');
const puppeteer = require('puppeteer');
const bot = new TelegramApi(token, {polling:true});
var images = [];

//output
const output = (images, chatId) =>{
    for(var i = 0; i<images.length; i++){
        bot.sendDocument(chatId,images[i])
       }
}


//olx function
const olx =  async function olx(url,chatId) {
    bot.sendMessage(chatId,'>_<\nOLX чуть довше, ждіті')
    const browser = await puppeteer.launch({headless:true});
    const page = await browser.newPage();

    await page.goto(url)
   
    var images = [];
    var i = 1;
    var repeat = await page.evaluate(()=>document.querySelector('.swiper-pagination-bullet').length)
    
    var img = await page.evaluate(()=>document.querySelector('.swiper-slide-active > div >img').src)
    images.push(img)
    
    //15 clicks
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
    await page.click('.swiper-button-next')
    await page.click('.swiper-button-next')
    await page.click('.swiper-button-next')
    await page.click('.swiper-button-next')
    await page.click('.swiper-button-next')
  
    var kartinkas = await page.evaluate(()=>Array.from(document.querySelectorAll('.swiper-zoom-container >img')).map((x)=>x.src))
    var images = [...new Set(kartinkas)];
    
    await browser.close()
    output(images,chatId)
    
}

//dom.ria function
const domRia = async function(url,chatId){
    bot.sendMessage(chatId,'>_<\ndom.ria грузітісь,ждіті')
    request(url, function(err,res,body){
    if(!err && res.statusCode === 200) {
       var $ = cheerio.load(body);
       images=[];
        $('img','picture.slideImage').each(function() {
           var img = $(this).attr('src');
           images.push(img);
       })
    }
    output(images,chatId)
})}


bot.on('message', msg =>{
    const url = msg.text
    console.log(url)
    const chatId = msg.chat.id
    
    if (url == '/start'){
        bot.sendMessage(chatId,'Шалом Анастасія')
    } 

    if (url.indexOf('https') == 0){

        //olx direct link
        if (url.indexOf('olx.ua') === 8 || url.indexOf('olx.ua') === 12){
                olx(url,chatId)
                images = []
        }

        //dom.ria direct link
        if (url.indexOf('dom.ria') === 8|| url.indexOf('dom.ria') === 12){
            domRia(url,chatId)
            images = []
        }

        //olx mobile link
        if (url.indexOf('m.') == 8){
                olx('https://' + url.slice(10),chatId)
                images = []
        }
    } else {
        //copy pasted msg
        if (url.indexOf('https') >3){
        
            if (url.includes('https://dom.ria')){
                domRia(url.slice(url.indexOf('https'), (url.indexOf('.html')+5)),chatId)
                images = []
            }
    
            if (url.includes('https://m.olx.ua') ){
                olx('https://' + url.slice(url.indexOf('olx.ua')),chatId)
                
                images = []
            }
        
            if (url.includes('https://olx.ua') || url.includes('https://www.olx.ua')){
                olx(url.slice(url.indexOf('https'), (url.indexOf('.html')+5)),chatId)
                images = []
            }
        
        }

    }

})
   
   
   











