const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const Like = require('../lib/models/Like');


const mockUser = {
  email: 'test@example.com',
  password: '12345',
  username: 'bob',
};
  
const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;
  const username = 'bob';
  const agent = request.agent(app);
  

  const user = await UserService.create({ ...mockUser, ...userProps });

  
  const { email } = user;
  await agent.post('/api/v1/users/sessions').send({ email, password, username });
  return [agent, user];
};


describe('github-oauth routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  
  afterAll(() => {
    pool.end();
  });

  it('creates a description via Post', async () => {
    const [agent] = await registerAndLogin(mockUser);
    
    const response = await agent
      .post('/api/v1/media')
      .send({ user_id:'9bd2afa6-1ad7-4b06-9733-74577063994e',
        title: 'Thor Love and Thunder',
        description:'this video is the trailer for the new thor movie premiering july 8th, 2022',
        video_id: 1
      });

    expect(response.body).toEqual({
      user_id:expect.any(String),
      title: 'Thor Love and Thunder',
      description:'this video is the trailer for the new thor movie premiering july 8th, 2022',
      video_id: '1'
    });
  });

  it('creates a comment via Video', async () => {
    const [agent] = await registerAndLogin(mockUser);
    
    const response = await agent
      .post('/api/v1/comment')
      .send({ user_id:'9bd2afa6-1ad7-4b06-9733-74577063994e',
        comment: 'I cant wait for this movie',
        video_id: '1'
      });
    
    expect(response.body).toEqual({
      user_id: expect.any(String),
      comment: 'I cant wait for this movie',
      video_id: '1'
    });
  });

  it('sets a like to true', async () => {
    const [agent] = await registerAndLogin(mockUser);
    
    const response = agent
      .post('/api/v1/like')
      .send({
        user_id: '9bd2afa6-1ad7-4b06-9733-74577063994e',
        is_liked: true,
        video_id: '1'
      });
    expect(response._data).toEqual({
      user_id: expect.any(String),
      is_liked: true,
      video_id: '1'
    });
  });

  it('should be able to get a like by id', async () => {
    const [agent] = await registerAndLogin(mockUser);
    const like = await Like.insert({ user_id: '9bd2afa6-1ad7-4b06-9733-74577063994e', is_liked: true, video_id: '1' });
    const response = agent
      .post(`/api/v1/like/${like.user_id}`)
      .send({
        user_id: '9bd2afa6-1ad7-4b06-9733-74577063994e',
        is_liked: true,
        video_id: '1'
      });

    const expected = {
      user_id: expect.any(String),
      is_liked: true,
      video_id: '1'
    };

    expect(response._data).toEqual(expected);
    expect(await Like.getById(like.user_id)).toEqual(expected);
  });
}); 
