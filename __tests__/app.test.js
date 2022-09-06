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
