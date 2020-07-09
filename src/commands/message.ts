import { CommandFile, announcementCollection } from '..';

const command: CommandFile = {
  name: 'message',
  example: '!announcer message <name> <message>',
  description: 'use this command to set a new message for the announcement',
  async execute(msg, args) {
    const name = args[0];
    if (!name) return msg.author.send(`Please pass in a name like "${this.example}"`);
    const message = args.slice(1).join(' ');
    if (!message) return msg.author.send(`Please pass in a message like "${this.example}"`);
    await announcementCollection.setMessage(name, message);
    msg.author.send(`Successfully changed message of ${name} to "${message}"`);
  },
};

export default command;
