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

describe("API", () => {
  test("404: Route not found", () => {
    return request(app)
      .get("/api/notARoute")
      .expect(404)
      .then(({body}) => {
        expect(body).toHaveProperty("msg", "Route not found");
      });
  });
});
describe("GET", () => {
  test("200: Responds with an array of topic objects, each of which has properties - 'slug', 'description'", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({body}) => {
        expect(Array.isArray(body)).toBe(true);
        expect(body.length).toBe(3);
        body.forEach((topic) => {
          expect(topic).toHaveProperty("slug", expect.any(String));
          expect(topic).toHaveProperty("description", expect.any(String));
        });
      });
  });
});
