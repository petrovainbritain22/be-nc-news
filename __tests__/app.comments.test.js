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
  test(`200: /api/articles/:article_id/comments - Responds with
  an array of comments for the given article_id. Each comment has properties:
    comment_id
    votes
    created_at
    author which is the username from the users table
    body`, () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({body}) => {
        expect(Array.isArray(body.comments)).toBe(true);
        body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
        expect(body.comments.length).toBe(11);
      });
  });
  test(`200: /api/articles/:article_idWithoutComments/comments - If there aren't any comments for the given article but article exists in db`, () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({body}) => {
        expect(body.comments).toEqual([]);
      });
  });
  test(`404: /api/articles/:article_idNotExist/comments - If the article doesn't exist in db`, () => {
    return request(app)
      .get("/api/articles/1000/comments")
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe("Article not found");
      });
  });
  test(`400: /api/articles/:notArticleId/comments - If invalid article_id`, () => {
    return request(app)
      .get("/api/articles/three/comments")
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Bad request");
      });
  });
});
