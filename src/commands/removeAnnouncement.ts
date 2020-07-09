import { CommandFile, announcementCollection } from '..';

const command: CommandFile = {
  name: 'remove',
  example: '!announcer remove <name>',
  description: 'use this command to remove an announcement',
  async execute(msg, args) {
    const name = args[0];
    if (!name) return msg.author.send(`Please pass in a name like "${this.example}"`);
    await announcementCollection.removeAnnouncement(name);
    msg.author.send(`Successfully removed announcement: ${name}`);
  },
};

export default command;
