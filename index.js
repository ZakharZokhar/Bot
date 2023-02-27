const fetch = require('cross-fetch');
const { parse } = require('node-html-parser');
const memes = require("random-memes");
const google = require('googlethis');
const { Client, Events, GatewayIntentBits, EmbedBuilder } = require('discord.js');
require('dotenv').config();


const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages,] });

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

//Фильм
function film(msg) {
    fetch("https://www.kinopoisk.ru/chance/?item=true")
    .then(res => {
        if (res.status >= 400) {
            throw new Error("Bad response from server");
        }
        return res.json();
    })
    .then(async film => {
        const root = parse(film);
        const nameRaw = root.querySelector('.filmName a').textContent;
		const name = nameRaw.replace(/&nbsp;/g, ' ');
        const yearRaw = root.querySelector('.filmName span').textContent;
		const year = yearRaw.match(/\(\d{4}\)/)[0].slice(1, -1);
        const rating =
			Math.round(Number(root.querySelector('.WidgetStars').getAttribute('value')) * 10) / 10;
        let images;
        try {
            images = await google.image(name + ' ' + year + ' год', { safe: false });
        } catch {
            images = [];
        }

        const exampleEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle(name)
	.addFields(
		{ name: 'Рейтинг', value: rating.toString() },
        { name: 'Год', value: year.toString() },
	)
	.setImage(images[0].url)
	.setTimestamp()

    msg.channel.send({ embeds: [exampleEmbed] });
    })
    .catch(err => {
        console.error(err);
    });
}

//Коктейль
function cocktail(msg) {
    fetch("https://www.thecocktaildb.com/api/json/v1/1/random.php")
    .then(res => {
        if (res.status >= 400) {
            throw new Error("Bad response from server");
        }
        return res.json();
    })
    .then(async cocktail => {
        const exampleEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle(cocktail.drinks[0].strDrink)
	.addFields(
		{ name: 'Ingredients', value: ingredients([cocktail.drinks[0].strIngredient1, cocktail.drinks[0].strIngredient2, cocktail.drinks[0].strIngredient3,
            cocktail.drinks[0].strIngredient4, cocktail.drinks[0].strIngredient5, cocktail.drinks[0].strIngredient6, cocktail.drinks[0].strIngredient7, cocktail.drinks[0].strIngredient8, cocktail.drinks[0].strIngredient9, cocktail.drinks[0].strIngredient10,
            cocktail.drinks[0].strIngredient11, cocktail.drinks[0].strIngredient12, cocktail.drinks[0].strIngredient13, cocktail.drinks[0].strIngredient14, cocktail.drinks[0].strIngredient15]) },
        { name: 'Instruction', value: cocktail.drinks[0].strInstructions },
	)
	.setImage(cocktail.drinks[0].strDrinkThumb)
	.setTimestamp()

    msg.channel.send({ embeds: [exampleEmbed] });
    })
    .catch(err => {
        console.error(err);
    });
}

function ingredients(ingArray) {
    let str = ' ';
    for (let i = 0; i<ingArray.length; i++) {
        if (ingArray[i] != null) {
            str += ingArray[i] + ', '
        } else {
            break;
        }
    }
    return str;
}

//Аниме
function anime(msg) {
    fetch("https://animechan.vercel.app/api/random")
    .then(res => {
        if (res.status >= 400) {
            throw new Error("Bad response from server");
        }
        return res.json();
    })
    .then(async anime => {
        let images;
        try {
            images = await google.image(anime.anime + ' аниме', { safe: false });
        } catch {
            images = [];
        }

        const exampleEmbed = new EmbedBuilder()
	.setColor(0x0099FF)
	.setTitle(anime.anime)
	.addFields(
		{ name: 'Quote', value: anime.quote },
	)
	.setImage(images[0].url)
	.setTimestamp()

    msg.channel.send({ embeds: [exampleEmbed] });
    })
    .catch(err => {
        console.error(err);
    });
}

//Default
function bla(msg) {
    fetch("https://api.quotable.io/random")
    .then(res => {
        if (res.status >= 400) {
            throw new Error("Bad response from server");
        }
        return res.json();
    })
    .then(phrase => {
        msg.channel.send(phrase.content);
    })
    .catch(err => {
        console.error(err);
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
        case 'Что сегодня смотрим?':
            film(message);
            break;
        case 'Что сегодня выпить?':
            cocktail(message);
            break;
        case 'Посоветуйте аниме новичку':
            if (Math.random() > 0.9) {
                message.channel.send('твое имя');
            } else {
                anime(message);
            }
            break;
        case 'антон':
            message.channel.send('а?\nче звал ' + message.author.username +'?');
            break;
        default:
            if (Math.random() > 0.9) {
                bla(message);
            }
    }
})

client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(process.env.TOKEN_ID);