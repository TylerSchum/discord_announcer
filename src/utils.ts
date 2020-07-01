import fs from 'fs';
import path from 'path';

type ReadJson = <T>(filePath: string) => Promise<T>;

type SaveJson = (filePath: string, jsonData: any) => Promise<void>;

export const readJson: ReadJson = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(path.resolve(filePath), { encoding: 'utf-8' }, (err, data) => {
      if (err) return reject(err);
      const returnValue = JSON.parse(data);
      resolve(returnValue);
    });
  });
};

export const saveJson: SaveJson = (filePath, jsonData) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.resolve(filePath), JSON.stringify(jsonData), (err) => {
      if (err) return reject(err);
      resolve();
    });
  });
};
