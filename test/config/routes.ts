/** External Dependencies */
import request, {Response} from 'supertest';
import {test, threw} from 'tap';

/** Internal Dependencies */
import {app} from '../../config/routes';

/** Resources */
import {data} from '../resources/constants';

/** Variables */
let response: Response;

/** Test the Routes */
test('routes', async (t) => {
  response = await request(app).get('/');
  t.same(response.status, 302, 'Successful Redirection');

  response = await request(app).get('/info');
  t.same(response.status, 200, 'Successful GET /info Request');
  t.same(response.body, {}, 'No JSON Response Body');
  t.not(response.text.length, 0, 'Non-Empty Response Text');

  response = await request(app).get('/packages/example');
  t.same(response.status, 200, 'Successful GET /packages/example Request');
  t.same(response.body, {}, 'No JSON Response Body');
  t.not(response.text.length, 0, 'Non-Empty Response Text');

  response = await request(app).post('/packages').send({});
  t.same(response.status, 400, 'Invalid Request Body');
  t.same(response.body, {
    error: 'Invalid Request Body',
    code: 'EINVALID',
  }, 'Invalid Request Body');

  response = await request(app).post('/packages').send(data);
  t.same(response.status, 200, 'Successful Package Creation');
  t.match(response.body, {
    message: String,
    id: String,
  }, 'Successful Package Creation');
  const id: string = response.body.id;
  t.match(response.body, {
    message: `Successfully Created ${id}`,
    id,
  }, 'Successful Package Creation');

  response = await request(app).get('/packages');
  t.same(response.status, 200, 'Successful Package Listing');
  t.match(response.body, [{
    ...data,
    id,
    created: Number,
    updated: Number,
  }], 'Successful Package Listing');

  response = await request(app).put(`/packages/${id}`).send({});
  t.same(response.status, 400, 'Invalid Request Body');
  t.same(response.body, {
    error: 'Invalid Request Body',
    code: 'EINVALID',
  }, 'Invalid Request Body');

  response = await request(app).put(`/packages/${id}`).send(data);
  t.same(response.status, 200, 'Successful Package Update');
  t.same(response.body, {
    message: `Successfully Updated ${id}`,
    id,
  }, 'Successful Package Update');

  response = await request(app).put(`/packages/${id.slice(0, 2)}`).send(data);
  t.same(response.status, 400, 'Failed Package Update');
  t.same(response.body, {
    error: 'Invalid Request Body',
    code: 'EINVALID',
  }, 'Failed Package Update');

  response = await request(app).get(`/packages/${id}`);
  t.same(response.status, 200, 'Successful Package Retrieval');
  t.match(response.body, {
    ...data,
    created: Number,
    updated: Number,
  }, 'Successful Package Retrieval');

  response = await request(app).get(`/packages/${id.slice(0, 2)}`);
  t.same(response.status, 400, 'Failed Package Retrieval');
  t.match(response.body, {
    error: `No Package Found for ${id.slice(0, 2)}`,
    code: 'ENOTFOUND',
  }, 'Failed Package Retrieval');

  response = await request(app).delete(`/packages/${id}`);
  t.same(response.status, 200, 'Successful Package Removal');
  t.same(response.body, {
    message: `Successfully Removed ${id}`,
    id,
  }, 'Successful Package Removal');
}).catch(threw);
