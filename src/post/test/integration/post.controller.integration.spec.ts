import { postStub } from './../stubs/post.stub';
import { DatabaseService } from './../../../database/database.service';
import { AppModule } from './../../../app.module';
import { Test } from '@nestjs/testing';
import { Connection } from 'mongoose';
import { HttpServer } from '@nestjs/common';
import * as request from 'supertest';
import { NestApplication } from '@nestjs/core';
import { ObjectId } from 'mongodb';

describe('PostController', () => {
  let dbConnection: Connection;
  let httpServer: HttpServer;
  let app: NestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    dbConnection = moduleRef
      .get<DatabaseService>(DatabaseService)
      .getDbConnection();
    httpServer = app.getHttpServer();
  });

  afterAll(async () => {
    await dbConnection.collection('posts').deleteMany({}); // очистить базу данных после всех тестов
    await app.close();
  });

  beforeEach(async () => {
    await dbConnection.collection('posts').deleteMany({});
  });

  describe('get new posts', () => {
    test('should return an array posts', async () => {
      await dbConnection.collection('posts').insertOne(postStub());
      const response = await request(httpServer).get('/post');
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject([postStub()]);
    });
  });

  describe('create a new post', () => {
    test('should create a new post', async () => {
      const response = await request(httpServer).post('/post/create').send({
        title: postStub().title,
        body: postStub().body,
        tags: postStub().tags,
      });
      expect(response.body).toMatchObject(postStub());
      expect(response.status).toBe(201);
    });
  });

  describe('search posts', () => {
    test('should return finded post', async () => {
      const posts = [
        {
          title: 'title 1',
          body: ['body 1'],
          tags: ['tag 1', 'tag 2'],
          views: 8,
        },
        {
          title: 'title 2',
          body: ['body 2'],
          tags: ['tags 3'],
          views: 10,
        },
        postStub(),
      ];
      await dbConnection.collection('posts').insertMany(posts);
      const response = await request(httpServer)
        .get('/post/search')
        .query({
          title: 'title',
          body: ['body'],
          views: 1,
        });
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject([posts[0], posts[1]]);
    });
  });

  describe('find post', () => {
    test('success', async () => {
      const mongoId = new ObjectId('507f191e810c19729de860ea');
      const neddedPost = {
        ...postStub(),
        _id: mongoId,
        title: 'title 1',
      };
      await dbConnection
        .collection('posts')
        .insertMany([neddedPost, postStub(), postStub()]);

      expect(
        await (
          await request(httpServer).get('/post/' + mongoId)
        ).body,
      ).toMatchObject({ ...neddedPost, views: 1 });
    });
  });

  describe('update post', () => {
    test('success', async () => {
      const mongoId = new ObjectId(32);
      const updatedPost = {
        title: 'new title',
        body: ['new body'],
        tags: [],
        views: 5,
      };
      await dbConnection
        .collection('posts')
        .insertOne({ ...postStub(), _id: mongoId });

      const response = await request(httpServer)
        .patch('/post/' + mongoId)
        .send(updatedPost);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(updatedPost);
    });
  });

  describe('delete post', () => {
    test('success', async () => {
      const mongoId = new ObjectId(16);
      const deletedPost = {
        ...postStub(),
        _id: mongoId,
      };
      await dbConnection
        .collection('posts')
        .insertMany([postStub(), postStub(), deletedPost]);

      const response = await request(httpServer).delete('/post/' + mongoId);
      expect(response.status).toBe(200);
      expect(response.body).toMatchObject(deletedPost);
      const countDocumets = await dbConnection
        .collection('posts')
        .countDocuments();
      expect(countDocumets).toBe(2);
    });
  });
});
