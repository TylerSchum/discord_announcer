import { CommandFile } from '../index';

const command: CommandFile = {
  name: 'message',
  description: 'use this command to set a new message for the announcement',
  execute(message, args) {
    console.log(message.channel.id);
  },
};

export default command;
