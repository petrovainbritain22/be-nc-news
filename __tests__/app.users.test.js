const request = require("supertest");
const app = require("../app");

const testData = require("../db/data/test-data/index");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");

beforeEach(() => {
  return seed(testData);
});
afterAll(() => {
  return db.end();
});

describe("GET", () => {
  test("200: /api/users - Responds with an array of topic objects, each object has properties 'username', 'name', avatar_url", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({body}) => {
        expect(body).toHaveProperty("users");
        expect(body.users).toBeInstanceOf(Array);
        expect(body.users.length).toBe(4);
        body.users.forEach((user) => {
          expect(user).toEqual(
            expect.objectContaining({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.any(String),
            })
          );
        });
      });
  });
});
