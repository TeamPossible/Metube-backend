const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');
const Like = require('../lib/models/Like');
const Media = require('../lib/models/Media');
const Comment = require('../lib/models/Comment');

const mockUser = {
  email: 'test@example.com',
  password: '12345',
  username: 'bob',
};

const registerAndLogin = async (userProps = {}) => {
  const password = userProps.password ?? mockUser.password;
  const username = 'bob';
  const agent = request.agent(app);

  await UserService.create({ ...mockUser, ...userProps });

  const res = await agent
    .post('/api/v1/users/sessions')
    .send({ email: mockUser.email, password, username });
  const user = res._body.profile;

  return [agent, user];
};

const fakeUpload = async (agent, user) => {
  const upload = await agent.post('/api/v1/media').send({
    user_id: user.id,
    title: 'Thor Love and Thunder',
    description:
      'this video is the trailer for the new thor movie premiering july 8th, 2022',
    video_url:
      'https://quwukbuqxqtapoxrimqd.supabase.in/storage/v1/object/public/videos/9bd2afa6-1ad7-4b06-9733-74577063994e/thorTrailer.mp4',
  });

  return upload;
};

describe('github-oauth routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it.skip('creates a description via Post', async () => {
    const [agent, user] = await registerAndLogin(mockUser);

    const { body } = await agent.post('/api/v1/media').send({
      user_id: user.id,
      title: 'Thor Love and Thunder',
      description:
        'this video is the trailer for the new thor movie premiering july 8th, 2022',
      video_url:
        'https://quwukbuqxqtapoxrimqd.supabase.in/storage/v1/object/public/videos/9bd2afa6-1ad7-4b06-9733-74577063994e/thorTrailer.mp4',
    });

    const newMedia = new Media({
      user_id: user.id,
      title: 'Thor Love and Thunder',
      description:
        'this video is the trailer for the new thor movie premiering july 8th, 2022',
      video_id: '1',
      video_url:
        'https://quwukbuqxqtapoxrimqd.supabase.in/storage/v1/object/public/videos/9bd2afa6-1ad7-4b06-9733-74577063994e/thorTrailer.mp4',
    });
    expect(body).toEqual(newMedia);
  });

  it.skip('creates a comment via Video', async () => {
    const [agent, user] = await registerAndLogin(mockUser);
    await fakeUpload(agent, user);

    const response = await agent.post('/api/v1/comment').send({
      user_id: user.id,
      comment: 'I cant wait for this movie',
      video_id: '1',
      username: 'bob',
    });

    expect(response.body).toEqual({
      user_id: expect.any(String),
      comment: 'I cant wait for this movie',
      video_id: expect.any(String),
      username: 'bob',
    });
  });

  it.skip('sets a like to true', async () => {
    const [agent, user] = await registerAndLogin(mockUser);

    await fakeUpload(agent, user);
    const response = await agent.post('/api/v1/like').send({
      user_id: user.id,
      is_liked: true,
      video_id: '1',
    });

    expect(response.body).toEqual({
      user_id: expect.any(String),
      is_liked: true,
      video_id: expect.any(String),
    });
  });

  it.skip('should be able to update a like by id', async () => {
    const [agent, user] = await registerAndLogin(mockUser);
    await fakeUpload(agent, user);
    const like = await Like.insert({
      user_id: user.id,
      is_liked: true,
      video_id: '1',
    });
    // await fakeUpload(agent, user);
    const response = await agent.patch(`/api/v1/like/${like.user_id}`).send({
      user_id: user.id,
      is_liked: true,
      video_id: '1',
    });

    const expected = {
      user_id: expect.any(String),
      is_liked: true,
      video_id: expect.any(String),
    };

    expect(response.body).toEqual(expected);

    expect(await Like.getById(like.user_id)).toEqual(expected);
  });

  it.skip('Should return a list of videos', async () => {
    const [agent, user] = await registerAndLogin(mockUser);
    await fakeUpload(agent, user);
    const response = await agent.get('/api/v1/media/videos');

    const expected = [
      {
        description:
          'this video is the trailer for the new thor movie premiering july 8th, 2022',
        title: 'Thor Love and Thunder',
        user_id: expect.any(String),
        video_id: '1',
        video_url:
          'https://quwukbuqxqtapoxrimqd.supabase.in/storage/v1/object/public/videos/9bd2afa6-1ad7-4b06-9733-74577063994e/thorTrailer.mp4',
      },
    ];

    expect(response.body).toEqual(expected);
  });

  it.skip('Should return a single video selected by id', async () => {
    const [agent, user] = await registerAndLogin(mockUser);
    const upload = await fakeUpload(agent, user);
    const response = await agent.get(
      `/api/v1/media/videos/${upload._body.video_id}`
    );

    const expected = {
      description:
        'this video is the trailer for the new thor movie premiering july 8th, 2022',
      title: 'Thor Love and Thunder',
      user_id: expect.any(String),
      video_id: '1',
      video_url:
        'https://quwukbuqxqtapoxrimqd.supabase.in/storage/v1/object/public/videos/9bd2afa6-1ad7-4b06-9733-74577063994e/thorTrailer.mp4',
    };

    expect(response.body).toEqual(expected);
  });

  it.skip('we should be able to return all of the video data', async () => {
    const [agent, user] = await registerAndLogin(mockUser);
    await fakeUpload(agent, user);
    await Like.insert({ user_id: user.id, is_liked: true, video_id: '1' });
    await Comment.insert({
      user_id: user.id,
      comment: 'I cant wait for this movie',
      video_id: '1',
      username: 'bob',
    });
    const response = await agent.get('/api/v1/media');

    const expected = {
      user_id: expect.any(String),
      title: 'Thor Love and Thunder',
      video_id: expect.any(String),
      username: 'bob',
      description:
        'this video is the trailer for the new thor movie premiering july 8th, 2022',
      comment: 'I cant wait for this movie',
      is_liked: true,
      video_url:
        'https://quwukbuqxqtapoxrimqd.supabase.in/storage/v1/object/public/videos/9bd2afa6-1ad7-4b06-9733-74577063994e/thorTrailer.mp4',
      created_at: expect.any(String),
    };

    expect(response.body).toEqual(expected);
  });
});
