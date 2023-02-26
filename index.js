const fetch = require('cross-fetch');
const memes = require("random-memes");
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages ] });

const fuckYou = ['Пошел нахуй!', 'Смешнее только про твою маму', 'Это твое мнение', 'Кто ж виноват, что у тебя нет чувства юмора'];
// Внимание, анекдот!
function joke(msg) {
    fetch("https://v2.jokeapi.dev/joke/Any")
    .then(res => {
        if (res.status >= 400) {
            throw new Error("Bad response from server");
        }
        return res.json();
    })
    .then(anekdot => {
        if (anekdot.type == 'single'){
            msg.channel.send(anekdot.joke );
        } else {
            msg.channel.send(anekdot.setup + '\n' + anekdot.delivery);
        }
        
    })
    .catch(err => {
        console.error(err);
    });
}

//Не смешно
function notFunny(msg) {
    msg.channel.send(fuckYou[Math.floor(Math.random()*fuckYou.length)]);
}

//Дай пожрать
function generateCatOrDog(msg) {
    let isCat = Math.random() > 0.5
    let url = isCat ? 'https://api.thecatapi.com/v1/images/search' : 'https://random.dog/woof.json' 
    fetch(url)
    .then(res => {
        if (res.status >= 400) {
            throw new Error("Bad response from server");
        }
        return res.json();
    })
    .then(catOrDog => {
        if (isCat){
            msg.channel.send(catOrDog[0].url);
        } else {
            msg.channel.send(catOrDog.url);
        }
        
    })
    .catch(err => {
        console.error(err);
    });
}

//Хочу мем
function meme(msg) {
    memes.random().then(meme => {
        msg.channel.send(meme.image);
    });
}

client.on('messageCreate', (message) => {
    if (message.author.bot) return;

    switch (message.content) {
        case 'Внимание, анекдот!':
            joke(message);
            break;
        case 'Так не смешно же':
        case 'A посмешнее ничего нет?':
            notFunny(message);
            break;
        case 'Дай пожрать':
            generateCatOrDog(message);
            break;
        case 'Хочу мем':
            meme(message);
            break;

    }
})

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(token);