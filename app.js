var request = require('request');
var cheerio = require('cheerio');
require('dotenv').config();
const token = process.env.BOT_API_KEY;
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
    const browser = await puppeteer.launch({args: ['--no-sandbox'],headless:true});
    const page = await browser.newPage();
    await page.setViewport({width:1366,height:766})
    

    await page.goto(url)
    
   
    var images = [];
    
    
    var img = await page.evaluate(()=>document.querySelector('.swiper-slide-active > div >img').src)

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
    
   
    
  
    var kartinkas = await page.evaluate(()=>Array.from(document.querySelectorAll('.swiper-zoom-container >img')).map((x)=>x.src))
    var images = [...new Set(kartinkas)];
    
    output(images,chatId)
    await browser.close()
    
    
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


//Кнопочки для документіків
const showDocs = {
    reply_markup: JSON.stringify({
        inline_keyboard: [
            [{text: 'Договір оренди та акт', callback_data: 'doc1'}],
            [{text: 'Ексклюзивний договір та акти', callback_data: 'doc2'}],
        ]
    })
}






bot.setMyCommands([
    {command:'/start', description:'Починає роботу з ботом'},
    {command:'/docs', description:'Список доступних документів'},
    {command:'/o1', description:'1-кімнатна квартира | оренда'},
    {command:'/o2', description:'2-кімнатна квартира | оренда'},
    {command:'/o3', description:'3-кімнатна квартира | оренда'},
    {command:'/constr', description:'Конструктор описів'},
    {command:'/m1', description:'Макети на розклейку | Анастасія'},
    {command:'/m2', description:'Макети на розклейку | Тетяна'}
])




bot.on('callback_query', async (msg)=>{
    
    const data = msg.data;
    const chatId = msg.message.chat.id;

    const fileOptions = {
        // Explicitly specify the file name.
        filename: 'casdasda',
        // Explicitly specify the MIME type.
        contentType: 'application/javascript',
      };



    if (data === 'doc1'){
       return  [bot.sendDocument(chatId,'BQACAgIAAxkBAAIM0WKwu7wbBjoh6LD12P1h73tr0s-WAAJFGwACmEqJSaFWiHRdwpdpKAQ'),
                bot.sendDocument(chatId,'BQACAgIAAxkBAAIM0mKwu9Gg8LfPa3J_ndLiNpz8qZ9qAAJGGwACmEqJSShZUOdMxBuPKAQ')]
    } else if (data === 'doc2'){
        return  bot.sendDocument(chatId,"BQACAgIAAxkBAAIM02Kwu-BEdEcpzI54rwABUK2L4bivCQACRxsAAphKiUmj8ojC96GUKigE")
    } 
})






bot.on('message', msg =>{
    const url = msg.text
    console.log(url)
    const chatId = msg.chat.id
    
    if (url === '/start'){
        bot.sendMessage(chatId,'Шалом Анастасія')
    } 


    if(url === '/o1'){
        bot.sendMessage(chatId,'Здам в оренду однокімнатну квартиру на довготривалий термін.\nКвартира тепла та затишна, поруч є все необхідне для комфортного проживання, магазини, супермаркети.\nКвартира здається лише на довгий термін, для порядних людей без шкідливих звичок.\nТихий та спокійний район міста.')
    }

    if(url === '/o2'){
        bot.sendMessage(chatId,'Здам в оренду двокімнатну квартиру на довготривалий термін.\nКвартира тепла та затишна, поруч є все необхідне для комфортного проживання, магазини, супермаркети.\nКвартира здається лише на довгий термін, для порядних людей без шкідливих звичок.\nТихий та спокійний район міста.')
    }

    if(url === '/o3'){
        bot.sendMessage(chatId,'Здам в оренду трикімнатну квартиру на довготривалий термін.\nКвартира тепла та затишна, поруч є все необхідне для комфортного проживання, магазини, супермаркети.\nКвартира здається лише на довгий термін, для порядних людей без шкідливих звичок.\nТихий та спокійний район міста.')
    }

    if(url === '/docs'){
        bot.sendMessage(chatId,'От які є документікі:',showDocs)
    }

    if(url === '/constr'){
        bot.sendMessage(chatId,'https://kazapanama.github.io/realty-constructor/')
    }

    if(url === '/m1'){
        bot.sendDocument(chatId,"BQACAgIAAxkBAAIM1GKwu_pKrvhMrwLMXolazbGqILZ-AAJJGwACmEqJSf9SkTrf2ozBKAQ")
        bot.sendDocument(chatId,"BQACAgIAAxkBAAIM1WKwvBIlz2N-ysd7-MVbxJLZxy6zAAJKGwACmEqJSeJ2W18viFbgKAQ")
    }

    if(url === '/m2'){
        bot.sendDocument(chatId,"BQACAgIAAxkBAAIM1mKwvCYaDw3em1G7Ai4ZQIP-_vufAAJLGwACmEqJSbwp7ihS6tpkKAQ")
        bot.sendDocument(chatId,"BQACAgIAAxkBAAIM12KwvDpLz9RfsvSHqyKovFwMsNWnAAJMGwACmEqJSZtF-lhptkSqKAQ")
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
   
   
   











