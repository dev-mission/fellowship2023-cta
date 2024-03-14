import assert from 'assert';
import { StatusCodes } from 'http-status-codes';
import _ from 'lodash';
import session from 'supertest-session';

import helper from '../../helper.js';
import app from '../../../app.js';

describe('/api/users', () => {
  let testSession;

  beforeEach(async () => {
    await helper.loadFixtures(['users']);
    testSession = session(app);
  });

  context('admin authenticated', () => {
    beforeEach(async () => {
      await testSession
        .post('/api/auth/login')
        .set('Accept', 'application/json')
        .send({ email: 'admin.user@test.com', password: 'abcd1234' })
        .expect(StatusCodes.OK);
    });

    describe('GET /', () => {
      it('returns a list of Users ordered by last name, first name, email', async () => {
        /// request user list
        const response = await testSession.get('/api/users').set('Accept', 'application/json').expect(StatusCodes.OK);
        assert.deepStrictEqual(response.body?.length, 5);
        const users = response.body;
        assert.deepStrictEqual(users[0].firstName, 'Admin');
        assert.deepStrictEqual(users[1].firstName, 'Admin');
        assert.deepStrictEqual(users[2].firstName, 'CTA');
        assert.deepStrictEqual(users[3].firstName, 'Inventory');
        assert.deepStrictEqual(users[4].firstName, 'Regular');
      });
    });

    describe('GET /:id', () => {
      it('returns a User by its id', async () => {
        /// request user list
        const response = await testSession.get('/api/users/222221').set('Accept', 'application/json').expect(StatusCodes.OK);
        console.log(response.body);
        assert.deepStrictEqual(response.body, {
          id: 222221,
          firstName: 'CTA',
          lastName: 'User',
          email: 'cta.user@test.com',
          role: 'CTA',
          isAdmin: false,
          picture: null,
          pictureUrl: null,
          role: 'CTA',
        });
      });
    });

    describe('GET /:id where id=3', () => {
      it('returns a User by its id and checking its role', async () => {
        /// request user list
        const response = await testSession.get('/api/users/3').set('Accept', 'application/json').expect(StatusCodes.OK);
        assert.deepStrictEqual(response.body, {
          id: 3,
          firstName: 'Kevin',
          lastName: 'Li',
          email: 'KevinLi@gmail.com',
          role: 'CTA',
          isAdmin: false,
          picture: null,
          pictureUrl: null,
        });
      });
    });

    describe('PATCH /:id', () => {
      it('updates a User by its id', async () => {
        const response = await testSession
          .patch('/api/users/222221')
          .set('Accept', 'application/json')
          .send({
            firstName: 'Normal',
            lastName: 'Person',
            email: 'normal.person@test.com',
            role: null,
          })
          .expect(StatusCodes.OK);

        assert.deepStrictEqual(response.body, {
          id: 222221,
          firstName: 'Normal',
          lastName: 'Person',
          email: 'normal.person@test.com',
          isAdmin: false,
          picture: null,
          pictureUrl: null,
          role: 'CTA',
        });
      });

      it('validates required fields', async () => {
        const response = await testSession
          .patch('/api/users/222221')
          .set('Accept', 'application/json')
          .send({
            firstName: '',
            lastName: '',
            email: '',
            password: 'foo',
          })
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        const error = response.body;
        assert.deepStrictEqual(error.status, StatusCodes.UNPROCESSABLE_ENTITY);
        assert.deepStrictEqual(error.errors.length, 4);
        assert(
          _.find(error.errors, {
            path: 'firstName',
            message: 'First name cannot be blank',
          }),
        );
        assert(
          _.find(error.errors, {
            path: 'lastName',
            message: 'Last name cannot be blank',
          }),
        );
        assert(
          _.find(error.errors, {
            path: 'email',
            message: 'Email cannot be blank',
          }),
        );
        assert(
          _.find(error.errors, {
            path: 'password',
            message: 'Minimum eight characters, at least one letter and one number',
          }),
        );
      });

      it('validates email is not already registered', async () => {
        const response = await testSession
          .patch('/api/users/222221')
          .set('Accept', 'application/json')
          .send({
            email: 'admin.user@test.com',
          })
          .expect(StatusCodes.UNPROCESSABLE_ENTITY);

        const error = response.body;
        assert.deepStrictEqual(error.status, StatusCodes.UNPROCESSABLE_ENTITY);
        assert.deepStrictEqual(error.errors.length, 1);
        assert(
          _.find(error.errors, {
            path: 'email',
            message: 'Email already registered',
          }),
        );
      });
    });
  });
});
