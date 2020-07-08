import cron from 'node-cron';
import Discord, { TextChannel } from 'discord.js';

export class Announcement {
  private cronTask: cron.ScheduledTask;
  public status: 'started' | 'stopped' = 'started';
  constructor(
    private client: Discord.Client,
    public message: string,
    public channel: string,
    private _cronDefinition: string,
  ) {
    this.client = client;
    this.message = message;
    this.channel = channel;
    this._cronDefinition = _cronDefinition;
    this.cronTask = cron.schedule(this._cronDefinition, this.announce.bind(this));
  }
  set cronDefinition(cronDefinition: string) {
    if (!cron.validate(cronDefinition)) throw new Error('Invalid cron expression');
    if (this.cronTask) this.cronTask.destroy();
    this._cronDefinition = cronDefinition;
    this.cronTask = cron.schedule(this._cronDefinition, this.announce.bind(this));
  }
  announce() {
    const channel = this.client.channels.cache.get(this.channel);
    if (channel && channel instanceof TextChannel) {
      channel.send(this.message || `Please set a message`);
    } else {
      console.log(`couldn't find channel: ${this.channel}`);
    }
  }
}
