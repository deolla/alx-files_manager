// this is the worker file for the files manager

import Queue from 'bull';
import { ObjectId } from 'mongodb';
import { promises as fs } from 'fs';
import dbClient from './utils/db'
import imageThumbnail from 'image-thumbnail';


const filesQueue = new Queue('filesQueue', 'redis://localhost:6379');
const usersQueue = new Queue('usersQueue', 'redis://localhost:6379');

async function createThumbnail(width, localPath) {
    const thumbnail = await imageThumbnail(localPath, { width });
    return thumbnail;
  }
  
  filesQueue.process(async (job, done) => {
    console.log('Processing...');
    const { fileId } = job.data;
    if (!fileId) {
      done(new Error('Missing fileId'));
    }
  
    const { userId } = job.data;
    if (!userId) {
      done(new Error('Missing userId'));
    }
  
    console.log(fileId, userId);
    const filesCollection = dbClient.db.collection('files');
    const idObject = new ObjectId(fileId);
    filesCollection.findOne({ _id: idObject }, async (err, file) => {
      if (!file) {
        console.log('Not found');
        done(new Error('File not found'));
      } else {
        const fileName = file.localPath;
        const thumbnail500 = await createThumbnail(500, fileName);
        const thumbnail250 = await createThumbnail(250, fileName);
        const thumbnail100 = await createThumbnail(100, fileName);
  
        console.log('Writing files to system');
        const image500 = `${file.localPath}_500`;
        const image250 = `${file.localPath}_250`;
        const image100 = `${file.localPath}_100`;
  
        await fs.writeFile(image500, thumbnail500);
        await fs.writeFile(image250, thumbnail250);
        await fs.writeFile(image100, thumbnail100);
        done();
      }
    });
  });
  
  usersQueue.process(async (job, done) => {
    const { userId } = job.data;
    if (!userId) done(new Error('Missing userId'));
    const usersCollection = dbClient.db.collection('users');
    const idObject = new ObjectId(userId);
    const user = await usersCollection.findOne({ _id: idObject });
    if (user) {
      console.log(`Welcome ${user.email}!`);
    } else {
      done(new Error('User not found'));
    }
  });
