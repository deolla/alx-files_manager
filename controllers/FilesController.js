import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';
import { promises as fs } from 'fs';
import { ObjectID } from 'mongodb';
import mime from 'mime-types';
import Queue from 'bull';

const FOLDER_PATH = process.env.FOLDER_PATH || '/tmp/files_manager';
const fileQueue = new Queue('fileQueue');

class FilesController {
    static async getUser(user) {
        const userKey = `user:${user}`;
        const userExists = await redisClient.exists(userKey);
        if (userExists) {
        const userData = await redisClient.hgetall(userKey);
        return userData;
        }
        const userData = await dbClient.users.findOne({ _id: ObjectID(user) });
        if (!userData) return null;
        delete userData.password;
        await redisClient.hmset(userKey, userData);
        return userData;
    }

    static async postUpload(req, res) {
        const { name, type, parentId, isPublic, data } = req.body;
        if (!name) return res.status(400).send({ error: 'Missing name' });
        if (!type) return res.status(400).send({ error: 'Missing type' });
        if (!data) return res.status(400).send({ error: 'Missing data' });

        const user = req.user.id;
        const folder = parentId || 0;
        const isPublicFile = isPublic || false;
        const realType = mime.extension(type);
        const filePath = `${FOLDER_PATH}/${uuidv4()}.${realType}`;

        try {
        await fs.writeFile(filePath, data, 'base64');
        } catch (error) {
        return res.status(500).send({ error: 'Cannot write file' });
        }

        const fileData = {
        userId: ObjectID(user),
        name,
        type,
        isPublic: isPublicFile,
        parentId: ObjectID(folder),
        localPath: filePath,
        };

        const file = await dbClient.files.insertOne(fileData);
        const { ops } = file;
        const newFile = ops[0];
        delete newFile.localPath;

        if (isPublicFile) {
        redisClient.hset('files', newFile.id, 0);
        }

        fileQueue.add({
        userId: user,
        fileId: newFile._id,
        });

        return res.status(201).send(newFile);
    }

    static async getShow(req, res) {
        const fileId = req.params.id;
        const file = await dbClient.files.findOne({ _id: ObjectID(fileId) });
        if (!file) return res.status(404).send({ error: 'Not found' });
        if (file.isPublic === false && file.userId.toString() !== req.user.id) {
        return res.status(403).send({ error: 'Not authorized' });
        }
        return res.status(200).send(file);
    }

    static async getIndex(req, res) {
        const parentId = req.query.parentId || 0;
        const files = await dbClient.files.find({ parentId: ObjectID(parentId) }).toArray();
        return res.status(200).send(files);
    }
};

export default FilesController;
