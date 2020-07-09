import cron from 'node-cron';
import Discord, { TextChannel } from 'discord.js';

export interface SavedAnnouncement {
  name: string;
  message: string;
  channel: string;
  cronDefinition: string;
  status: 'started' | 'stopped';
}

export class Announcement {
  private cronTask: cron.ScheduledTask;
  constructor(
    public name: string,
    private _client: Discord.Client,
    public message: string,
    public channel: string,
    private _cronDefinition: string,
    public status: 'started' | 'stopped' = 'started',
  ) {
    this.name = name;
    this._client = _client;
    this.message = message;
    this.channel = channel;
    this._cronDefinition = _cronDefinition;
    this.cronTask = cron.schedule(this._cronDefinition, this.announce.bind(this));
  }
  set cronDefinition(cronDefinition: string) {
    if (!cron.validate(cronDefinition)) throw new Error('Invalid cron expression');
    if (this.cronTask) {
      this.stop();
      this.cronTask.destroy();
    }
    this._cronDefinition = cronDefinition;
    this.cronTask = cron.schedule(this._cronDefinition, this.announce.bind(this));
  }
  announce() {
    const channel = this._client.channels.cache.get(this.channel);
    if (channel && channel instanceof TextChannel) {
      channel.send(this.message || `Please set a message`);
    } else {
      console.log(`couldn't find channel: ${this.channel}`);
    }
  }
  start() {
    this.status = 'started';
    this.cronTask.start();
  }
  stop() {
    this.status = 'stopped';
    this.cronTask.stop();
  }
  destroy() {
    this.stop();
    this.cronTask.destroy();
  }
  getSaveData() {
    const savedData: SavedAnnouncement = {
      name: this.name,
      message: this.message,
      channel: this.channel,
      cronDefinition: this._cronDefinition,
      status: this.status,
    };
    return savedData;
  }
}
