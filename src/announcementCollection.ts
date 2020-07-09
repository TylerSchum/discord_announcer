import { Announcement, SavedAnnouncement } from './announcement';
import { saveJson, readJson } from './utils';
import { Client } from 'discord.js';
import path from 'path';

const filePath = path.resolve('./announcements.json');

interface SavedAnnouncementCollection {
  [key: string]: SavedAnnouncement;
}

export class AnnouncementCollection {
  private collection: { [key: string]: Announcement } = {};
  constructor(private _client: Client) {}
  get client() {
    return this._client;
  }
  async save() {
    const jsonData = Object.keys(this.collection).reduce((acc, key) => {
      const announcement = this.collection[key];
      acc[key] = announcement.getSaveData();
      return acc;
    }, {} as SavedAnnouncementCollection);
    await saveJson(filePath, jsonData);
  }
  async load() {
    const collection = await readJson<SavedAnnouncementCollection>(filePath);
    Object.keys(collection).forEach((key) => {
      const { name, message, status, cronDefinition, channel } = collection[key];
      const cleanedName = name.toLowerCase();
      if (this.collection[cleanedName])
        throw new Error('An announcement wit hthat name already exists');
      this.collection[cleanedName] = new Announcement(
        cleanedName,
        this._client,
        message,
        channel,
        cronDefinition,
        status,
      );
    });
  }
  async addAnnouncement(name: string, message: string, cronDefinition: string, channel: string) {
    const cleanedName = name.toLowerCase();
    if (this.collection[cleanedName])
      throw new Error('An announcement with that name already exists.');
    this.collection[cleanedName] = new Announcement(
      cleanedName,
      this._client,
      message,
      channel,
      cronDefinition,
    );
    await this.save();
  }
  getAnnouncement(name: string): Announcement {
    const cleanedName = name.toLowerCase();
    const announcement = this.collection[cleanedName];
    if (!announcement) throw new Error('There is no announcement with that name.');
    return announcement;
  }
  async removeAnnouncement(name: string) {
    const cleanedName = name.toLowerCase();
    const announcement = this.getAnnouncement(cleanedName);
    announcement.destroy();
    delete this.collection[cleanedName];
    await this.save();
  }
  async setName(oldName: string, newName: string) {
    const oldAnnouncement = this.getAnnouncement(oldName);
    const { message, channel, cronDefinition, status } = oldAnnouncement;
    this.collection[newName] = new Announcement(
      newName,
      this._client,
      message,
      channel,
      cronDefinition,
      status,
    );
    await this.removeAnnouncement(oldName);
  }
  async setChannel(name: string, channel: string) {
    const announcement = this.getAnnouncement(name);
    announcement.channel = channel;
    await this.save();
  }
  async setCronDefinition(name: string, cronDefinition: string) {
    const announcement = this.getAnnouncement(name);
    announcement.cronDefinition = cronDefinition;
    await this.save();
  }
  async setMessage(name: string, message: string) {
    const announcement = this.getAnnouncement(name);
    announcement.message = message;
    await this.save();
  }
  async stop(name: string) {
    const announcement = this.getAnnouncement(name);
    announcement.stop();
  }
  async start(name: string) {
    const announcement = this.getAnnouncement(name);
    announcement.start();
  }
}
