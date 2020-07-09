import { CommandFile, announcementCollection } from '..';
import { TextChannel } from 'discord.js';

const command: CommandFile = {
  name: 'channel',
  example: '!announcer channel <name> <#channel?>',
  description: `Use this command change announcement's channel to the specified channel, defaults to current channel.`,
  async execute(msg, args) {
    const name = args[0];
    if (!name) return msg.author.send(`Please pass in a name like "${this.example}"`);
    const channel = args[1];
    const channelId = channel ? channel.substr(2, channel.length - 3) : msg.channel.id;
    const channelObj = msg.client.channels.cache.get(channelId);
    if (!channelObj || !(channelObj instanceof TextChannel))
      return msg.author.send(`Please pass in a valid channel ID like ${this.example}`);
    const displayName = channelObj.name;
    await announcementCollection.setChannel(name, channelId);
    return msg.author.send(`Successfully changed channel for ${name} to "${displayName}"`);
  },
};

export default command;
