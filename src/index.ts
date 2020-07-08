import Discord, { Message } from 'discord.js';
import { readJson } from './utils';
import fs from 'fs';
import path from 'path';
import { Announcement } from './announcement';

const executeCommand = '!announcer';

type Execute = (message: Message, args: string[]) => void;

export interface CommandFile {
  name: string;
  description: string;
  execute: Execute;
}

const client = Object.assign(new Discord.Client(), {
  commands: new Discord.Collection<string, CommandFile>(),
});

client.on('ready', () => {
  // const announcement = new Announcement(
  //   client,
  //   'Hello World',
  //   '392437423662956557',
  //   '* * * * *',
  // );
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
  await loadCommands();
  const data = await readJson<{ token: string }>('./init.json');
  await client.login(data.token);
};

init();
