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
  test(`200: /api/articles/:article_id - 
    Responds with an article object, which has properties:
        "author" which is the "username" from the users table
        "title"
        "article_id"
        "body"
        "topic"
        "created_at"
        "votes"`, () => {
    return request(app)
      .get("/api/articles/4")
      .expect(200)
      .then(({body}) => {
        expect(body).toEqual(
          expect.objectContaining({
            title: expect.any(String),
            article_id: expect.any(Number),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  test(`404: /api/articles/:article_id - if article_id is valid but it doesn't exist in database`, () => {
    return request(app)
      .get("/api/articles/1000")
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test(`400: /api/articles/:article_id - invalid article_id`, () => {
    return request(app)
      .get("/api/articles/notId")
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
