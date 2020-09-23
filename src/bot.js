// loads up all environment variables that are in the .env file
require('dotenv').config();

// demonstrate accessing env variable
// console.log(process.env.DISCORDJS_BOT_TOKEN);

// import classes from discord.js
const { Client, WebhookClient } = require('discord.js');

// create client object which is an instance of the Client class
// partials are a discordjs concept that allow you to handle uncached data, allows you to use the event itself
const client = new Client({
	partials: ['MESSAGE', 'REACTION'],
});
// WebhookClient
const webhookClient = new WebhookClient(
	process.env.WEBHOOK_ID,
	process.env.WEBHOOK_TOKEN
);
// denotes dollar symbol as command prefix in Discord chat
const PREFIX = '$';

// event listeners

// bot is logged in
client.on('ready', () => {
	console.log(`${client.user.tag} has logged in`);
});

client.on('message', message => {
	// handle bot messages (discord best practice)
	if (message.author.bot) return;
	// handle $ commands
	if (message.content.startsWith(PREFIX)) {
		// identify the command and argument(s) using the destructuring and the spread operator
		const [CMD_NAME, ...args] = message.content
			.trim()
			.substring(PREFIX.length)
			.split(/\s+/);
		// protect against invalid commands
		const SAFE_COMMANDS = ['kick', 'ban', 'announce'];
		if (!SAFE_COMMANDS.includes(CMD_NAME))
			return message.reply(`"${CMD_NAME}" is an invalid command`);
		// pull the member's ID from the existing guild registry
		// also, cache is a Collection, which extends from the Map class, just adds more methods
		const member = message.guild.members.cache.get(args[0]);
		// logic for handling Kick and Ban
		switch (CMD_NAME) {
			case 'kick':
				// protect against valid commands with empty arguments
				if (args.length === 0) return message.reply('please provide an ID');
				if (member !== undefined) {
					member
						// methods like .kick() will return a promise, always handle errors
						.kick()
						.then(member => message.channel.send(`Kicked the user ${member}`))
						.catch(err => message.reply('I cannot kick that user'));
				} else {
					message.channel.send('That member was not found');
				}
				break;
			case 'ban':
				// protect against valid commands with empty arguments
				if (args.length === 0) return message.reply('please provide an ID');
				if (!message.member.hasPermission('BAN_MEMBERS'))
					return message.reply(
						'You do not have permission to use that command'
					);
				if (member !== undefined) {
					member
						.ban()
						.then(member => message.channel.send(`Banned the user ${member}`))
						.catch(err => {
							message.reply('I cannot ban that user');
						});
				} else {
					message.channel.send('That member was not found');
				}
				break;
			case 'announce':
				const msg = args.join(' ');
				webhookClient.send(msg);
				break;
			default:
				break;
		}
	}
});

// adding roles via reactions in an uncached message
client.on('messageReactionAdd', (reaction, user) => {
	const { name } = reaction.emoji;
	const member = reaction.message.guild.members.cache.get(user.id);
	if (reaction.message.id === '758200887725522975') {
		switch (name) {
			case '🍎': // Javascript
				member.roles.add('758202340955652096');
				break;
			case '🍌': // Python
				member.roles.add('758202583587487775');
				break;
			case '🍇': // C#
				member.roles.add('758202534534840326');
				break;
			case '🍑': // Java
				member.roles.add('758202445628964864');
				break;
			default:
				break;
		}
	}
});

// removing roles
client.on('messageReactionRemove', (reaction, user) => {
	const { name } = reaction.emoji;
	const member = reaction.message.guild.members.cache.get(user.id);
	if (reaction.message.id === '758200887725522975') {
		switch (name) {
			case '🍎': // Javascript
				member.roles.remove('758202340955652096');
				break;
			case '🍌': // Python
				member.roles.remove('758202583587487775');
				break;
			case '🍇': // C#
				member.roles.remove('758202534534840326');
				break;
			case '🍑': // Java
				member.roles.remove('758202445628964864');
				break;
			default:
				break;
		}
	}
});

// Reference login method from Client class using client object with reference to the environment variable (the bot token) passed as a parameter
client.login(process.env.DISCORDJS_BOT_TOKEN);
