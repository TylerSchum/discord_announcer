import Discord from 'discord.js';
import { readJson } from './utils';
import fs from 'fs';
import path from 'path';
import { AnnouncementCollection } from './announcementCollection';

type Execute = (msg: Discord.Message, args: string[]) => Promise<any>;
export interface CommandFile {
  name: string;
  example: string;
  description: string;
  execute: Execute;
}

const executeCommand = '!announcer';

const client = Object.assign(new Discord.Client(), {
  commands: new Discord.Collection<string, CommandFile>(),
});

export const announcementCollection = new AnnouncementCollection(client);

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
  if (!command || !client.commands.has(command)) return;
  const executor = client.commands.get(command);
  if (!executor) return;
  executor.execute(msg, args);
});

const loadCommands = async () => {
  const commandFiles = fs.readdirSync(path.resolve('./src/commands'));
  for (const commandFile of commandFiles) {
    const command: CommandFile = (await import(`./commands/${commandFile}`)).default;
    client.commands.set(command.name, command);
  }
};

const init = async () => {
  try {
    await loadCommands();
    console.log('Finished loading commands');
    await announcementCollection.load();
    console.log('Finished loading announcements');
    const data = await readJson<{ token: string }>('./init.json');
    await client.login(data.token);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

init();
