const request = require("supertest");
const app = require("../app");

const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
const {get} = require("../app");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  return db.end();
});

describe("API", () => {
  test(`200: Responds with JSON describing all the available endpoints on API`, () => {
    return request(app)
      .get(`/api`)
      .expect(200)
      .then(({body}) => {
        expect(body.endpoints).toEqual(
          expect.objectContaining({
            "GET /api": expect.any(Object),
            "GET /api/topics": expect.any(Object),
            "GET /api/articles": expect.any(Object),
          })
        );
      });
  });
  test(`404: Route not found`, () => {
    return request(app)
      .get(`/api/notARoute`)
      .expect(404)
      .then(({body}) => {
        expect(body).toHaveProperty(`msg`, `Route not found`);
      });
  });
});
