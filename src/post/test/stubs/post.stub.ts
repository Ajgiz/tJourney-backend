import { PostModel } from './../../model/post.model';

export const postStub = (): Omit<PostModel, 'createdAt' | 'updatedAt'> => {
  return {
    body: [
      'С самого начала мы заметили, что самое сложное на пути использования WebSocket API — это сам процесс подключения к серверу WebSocket API.',
    ],
    tags: ['postman', 'websocket'],
    title: 'WebScoket & Postman',
    views: 0,
  };
};
