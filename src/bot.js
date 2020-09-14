// loads up all environment variables that are in the .env file
require('dotenv').config();

// demonstrate accessing env variable
// console.log(process.env.DISCORDJS_BOT_TOKEN);

// Import class from discord.js
const { Client } = require('discord.js');

// create client object which is an instance of the Client class
const client = new Client();

// Event listeners
client.on('ready', () => {
	console.log(`${client.user.tag} is ready`);
});

client.on('message', message => {
	// handle bot messages (discord best practice)
	if (message.author.bot) return;
	// e
	console.log(`Message:${message.content}, Author: ${message.author}`);

	// Reply to a specific string
	if (message.content === 'hello') {
		message.reply(`Hello, ${message.author}`);
	}
});

// reference login method from Client class using client object with reference to the environment variable (the bot token) passed as a parameter
client.login(process.env.DISCORDJS_BOT_TOKEN);
