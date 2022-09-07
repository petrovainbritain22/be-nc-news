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
        expect(body.article).toEqual(
          expect.objectContaining({
            title: expect.any(String),
            article_id: 4,
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
describe("PATCH", () => {
  test("200: /api/articles/:article_id - Request body accepts an object in the form { inc_votes: newVote } and returns updated article with incremented vote", () => {
    const incrementVote = {inc_votes: 1};
    // const decrementVote = {inc_votes: -100};
    const article_id = 2;
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(incrementVote)
      .expect(201)
      .then(({body}) => {
        expect(body.article).toHaveProperty("votes", 1);
        expect(body.article).toHaveProperty("article_id", 2);
      });
  });
  test("200: /api/articles/:article_id - returns updated article with decremented vote", () => {
    const decrementVote = {inc_votes: -100};
    const article_id = 1;
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(decrementVote)
      .expect(201)
      .then(({body}) => {
        expect(body.article).toHaveProperty("votes", 0);
        expect(body.article).toHaveProperty("article_id", 1);
      });
  });
  test("400: Missing required fields on request body", () => {
    const incrementVote = {};
    const article_id = 3;
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(incrementVote)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Missing required fields");
      });
  });
  test("400: Incorect type on request body", () => {
    const incrementVote = {inc_votes: "ten"};
    const article_id = 3;
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(incrementVote)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Incorrect type. Number is expected");
      });
  });
  test("400: Invalid article_id in request url", () => {
    const incrementVote = {inc_votes: 100};
    const article_id = "titleOfArticle";
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(incrementVote)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Bad request");
      });
  });
  test("404: Article_id is valid but it doesn't exist in database`, ", () => {
    const incrementVote = {inc_votes: 100};
    const article_id = 1000;
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(incrementVote)
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("Article not found");
      });
  });
});
