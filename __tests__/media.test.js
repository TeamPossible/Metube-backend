const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');


describe('github-oauth routes', () => {
  beforeEach(() => {
    return setup(pool);
  });
  
  afterAll(() => {
    pool.end();
  });

  it('creates a description via Post', async () => {
    const agent = request.agent(app);

    return agent
      .post('/api/v1/media')
      .send({ user_id:'9bd2afa6-1ad7-4b06-9733-74577063994e',
        title: 'Thor Love and Thunder',
        description:'this video is the trailer for the new thor movie premiering july 8th, 2022',
      });})
      .then((res) => {
        expect(res.body).toEqual({
          user_id:expect.any(String),
          title: 'Thor Love and Thunder',
          description:'this video is the trailer for the new thor movie premiering july 8th, 2022',
        });
      });

  });
});
