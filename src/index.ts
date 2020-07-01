import Discord from 'discord.js';
import { readJson } from './utils';

const executeCommand = '!announcer';

const client = new Discord.Client();

client.on('ready', () => {
  if (client.user) {
    console.log(`Logged in as ${client.user.tag}!`);
  } else {
    console.log(`User not defined for this client`);
  }
});

client.on('message', (msg) => {
  if (!msg.content.startsWith(executeCommand) || msg.author.bot) return;
  const args = msg.content.slice(executeCommand.length + 1).split(/ +/);
  const command = args.shift()?.toLowerCase();
  if (command === executeCommand) {
    msg.reply('Thanks for reaching out!');
  }
});

const init = async () => {
  const data = await readJson<{ token: string }>('./init.json');
  await client.login(data.token);
};

init();

console.log('Hello World');
