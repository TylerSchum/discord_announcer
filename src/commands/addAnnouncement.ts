import { CommandFile, announcementCollection } from '..';

const command: CommandFile = {
  name: 'add',
  example: '!announcer add <name> <cronDefinition> <message>',
  description: 'use this command to create a new announcement',
  async execute(msg, args) {
    const name = args[0];
    if (!name) return msg.author.send(`Please pass in a name to use like "${this.example}"`);
    const cronDefinition = args.slice(1, 6).join(' ');
    if (!cronDefinition)
      return msg.author.send(`Please pass in a cron definition to use like "${this.example}"`);
    const message = args.slice(6).join(' ');
    if (!message) return msg.author.send(`Please pass in a message to use like "${this.example}"`);
    await announcementCollection.addAnnouncement(name, message, cronDefinition, msg.channel.id);
    return msg.author.send(`Created announcement: "${name}"`);
  },
};

export default command;
