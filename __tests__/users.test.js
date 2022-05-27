const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const UserService = require('../lib/services/UserService');

const mockUser = {
  email: 'test@example.com',
  password: '12345',
  username: 'bob'
};

describe('alchemy-app routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('creates a new user', async() => {
    const res = await request(app).post('/api/v1/users').send(mockUser);
    const {  email, username } = mockUser;

    expect(res.body).toEqual({
      id: expect.any(String),
      email,
      username
    });
  });

  it('returns the current user', async () => {
    const agent = request.agent(app);

    const user = await UserService.create({ ...mockUser, });

    const { email } = user;
    const password = mockUser.password;

    const expected = {
      message: 'Signed in successfully!',
    };

    const res = await agent
      .post('/api/v1/users/sessions')
      .send({ email, password
      });
    expect(res.body).toEqual(expected);
    expect(res.status).toEqual(200);
  });

  it('should delete cookie from user object', async () => {
    await UserService.create({ ...mockUser, });

    const agent = request.agent(app);

    await agent
      .post('/api/v1/users/sessions')
      .send({ ...mockUser });

    const res = await agent.delete('/api/v1/users');

    expect(res.body).toEqual({
      success: true,
      message: 'Successfully signed out!',
    });
    expect(res.status).toEqual(200);

  });

});
