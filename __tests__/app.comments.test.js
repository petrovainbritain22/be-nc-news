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

describe(`GET - /api/articles/:article_id/comments`, () => {
  test(`200: responds with an object {comments: comments}, where the vallue 'comments' is an array of objects`, () => {
    return request(app)
      .get(`/api/articles/1/comments`)
      .expect(200)
      .then(({body}) => {
        expect(Array.isArray(body.comments)).toBe(true);
        expect(body.comments.length).toBe(11);
      });
  });
  test(`200: each comment object has properties:
        comment_id,
        votes,
        created_at,
        author (the username from users table),
        body`, () => {
    return request(app)
      .get(`/api/articles/1/comments`)
      .expect(200)
      .then(({body}) => {
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
      });
  });
  test(`200: returns an empty array if there aren't comments for the given article but the article exists in the ddatabase`, () => {
    return request(app)
      .get(`/api/articles/2/comments`)
      .expect(200)
      .then(({body}) => {
        expect(body.comments).toEqual([]);
      });
  });
  test(`404: responds with an error message if the article doesn't exist in the database`, () => {
    return request(app)
      .get(`/api/articles/1000/comments`)
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe(`Article not found`);
      });
  });
  test(`400: responds with an error message if the article_id is not valid`, () => {
    return request(app)
      .get(`/api/articles/three/comments`)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe(`Invalid input`);
      });
  });
});

describe("POST - /api/articles/:article_id/comments", () => {
  test(`201: responds with an object {comment: comment}, where the value 'comment' is the posted comment`, () => {
    const comment = {
      username: "butter_bridge",
      body: "Quite a lot of tickets in the project",
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(comment)
      .expect(201)
      .then(({body}) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
            article_id: 4,
            author: comment.username,
            body: comment.body,
            created_at: expect.any(String),
          })
        );
      });
  });
  test("201: inserts a posted comment in the database", () => {
    const comment = {
      username: "butter_bridge",
      body: "Quite a lot of tickets in the project",
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(comment)
      .expect(201)
      .then(({body}) => {
        expect(body.comment).toEqual(
          expect.objectContaining({
            comment_id: 19,
            votes: 0,
          })
        );
        return db.query(`SELECT * FROM comments;`);
      })
      .then(({rowCount}) => {
        expect(rowCount).toBe(19);
      });
  });
  test(`400: returns an error message if 'comment body' on the request body is missed`, () => {
    const commentWithoutBody = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(commentWithoutBody)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Required fields are missed");
      });
  });
  test(`400: returns an error message if 'comment username' on the request body is missed`, () => {
    const commentWithoutBody = {
      body: "Coding is fun",
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(commentWithoutBody)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Required fields are missed");
      });
  });
  test(`400: returns an error message if the username doesn't exist in the database`, () => {
    const commentFromNotSighedUpPerson = {
      username: "not_signed_up",
      body: "It takes longer to write tests than to write code",
    };
    return request(app)
      .post("/api/articles/4/comments")
      .send(commentFromNotSighedUpPerson)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("User with this name does not exist");
      });
  });
  test(`400: returns an error message if the article_id doesn't exist in the database but is valid`, () => {
    const comment = {
      username: "butter_bridge",
      body: "Quite a lot of tickets in the project",
    };
    return request(app)
      .post("/api/articles/1000/comments")
      .send(comment)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Article does not exist");
      });
  });
  test(`400: returns an error message if the article_id is not valid`, () => {
    const comment = {
      username: "butter_bridge",
      body: "Quite a lot of tickets in the project",
    };
    return request(app)
      .post("/api/articles/two/comments")
      .send(comment)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});
