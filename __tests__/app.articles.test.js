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

describe(`GET - /api/articles`, () => {
  test(`200: responds with an object {articles : articles}, where the value 'articles' is an array of objects`, () => {
    return request(app)
      .get(`/api/articles`)
      .expect(200)
      .then(({body}) => {
        expect(Array.isArray(body.articles)).toBe(true);
        expect(body.articles.length).toBe(12);
      });
  });
  test(`200: each article object has the properties: 
        'author' 
        'title'
        'article_id'
        'topic'
        'created_at'
        'votes'
        'comment_count'`, () => {
    return request(app)
      .get(`/api/articles`)
      .expect(200)
      .then(({body}) => {
        body.articles.forEach((article) => {
          expect(article).toEqual(
            expect.objectContaining({
              author: expect.any(String),
              title: expect.any(String),
              article_id: expect.any(Number),
              topic: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              comment_count: expect.any(Number),
            })
          );
        });
      });
  });
});
describe(`GET - /api/articles (queries)`, () => {
  describe(`?topic=topicName`, () => {
    test(`200: returns articles filtered by the topic`, () => {
      return request(app)
        .get(`/api/articles?topic=mitch`)
        .expect(200)
        .then(({body}) => {
          expect(body.articles.length).toBe(11);
          body.articles.forEach((article) => {
            expect(article.topic).toBe(`mitch`);
          });
        });
    });
    test(`200: returns an empty array if there aren't articles about the topic but the topic exists in the database`, () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then(({body}) => {
          expect(body.articles).toEqual([]);
        });
    });
    test(`404: responds with an error message if the topic doesn't exist in the database`, () => {
      return request(app)
        .get("/api/articles?topic=topicNotExists")
        .expect(404)
        .then(({body}) => {
          expect(body.msg).toBe("Topic not found");
        });
    });
  });
  describe(`?sort_by=columnName`, () => {
    test(`200: returns sorted articles, defaults to date (created_at) descending`, () => {
      return request(app)
        .get(`/api/articles`)
        .expect(200)
        .then(({body}) => {
          expect(body.articles).toBeSortedBy("created_at", {descending: true});
        });
    });
    test(`200: returns sorted articles by author defaults to descending`, () => {
      return request(app)
        .get(`/api/articles?sort_by=author`)
        .expect(200)
        .then(({body}) => {
          expect(body.articles).toBeSortedBy("author", {descending: true});
        });
    });
    test(`200: returns sorted articles by title defaults to descending`, () => {
      return request(app)
        .get(`/api/articles?sort_by=title`)
        .expect(200)
        .then(({body}) => {
          expect(body.articles).toBeSortedBy("title", {descending: true});
        });
    });
    test(`200: returns sorted articles by topic defaults to descending`, () => {
      return request(app)
        .get(`/api/articles?sort_by=topic`)
        .expect(200)
        .then(({body}) => {
          expect(body.articles).toBeSortedBy("topic", {descending: true});
        });
    });
    test(`200: returns sorted articles by votes defaults to descending`, () => {
      return request(app)
        .get(`/api/articles?sort_by=votes`)
        .expect(200)
        .then(({body}) => {
          expect(body.articles).toBeSortedBy("votes", {descending: true});
        });
    });
    test(`200: returns sorted articles by comments defaults to descending`, () => {
      return request(app)
        .get(`/api/articles?sort_by=comment_count`)
        .expect(200)
        .then(({body}) => {
          expect(body.articles).toBeSortedBy("comment_count", {
            descending: true,
          });
        });
    });
    test(`200: order can be set to ascending`, () => {
      return request(app)
        .get(`/api/articles?sort_by=created_at&order=asc`)
        .expect(200)
        .then(({body}) => {
          expect(body.articles).toBeSortedBy("created_at", {descending: false});
        });
    });
    test(`200: order can be set to descending`, () => {
      return request(app)
        .get(`/api/articles?sort_by=topic&order=desc`)
        .expect(200)
        .then(({body}) => {
          expect(body.articles).toBeSortedBy("topic", {descending: true});
        });
    });
    test(`400: responds with an error message if the column doesn't exist in the database`, () => {
      return request(app)
        .get("/api/articles?sort_by=columnName")
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("Invalid criteria for sorting");
        });
    });
    test(`400: responds with an error message if the sort order is not asc or desc`, () => {
      return request(app)
        .get("/api/articles?sort_by=author&order=wrongOrder")
        .expect(400)
        .then(({body}) => {
          expect(body.msg).toBe("Invalid criteria for sorting");
        });
    });
  });
  test(`200: ?topic, ?sort_by and ?order can be used together`, () => {
    return request(app)
      .get(`/api/articles?topic=mitch&sort_by=title&order=asc`)
      .expect(200)
      .then(({body}) => {
        expect(body.articles.length).toBe(11);
        expect(body.articles).toBeSortedBy("title", {descending: false});
        body.articles.forEach((article) => {
          expect(article.topic).toBe("mitch");
        });
      });
  });
});

describe(`GET - /api/articles/:article_id`, () => {
  test(`200: responds with an object {article : article}, where the value 'article' is an object'`, () => {
    return request(app)
      .get(`/api/articles/4`)
      .expect(200)
      .then(({body}) => {
        expect(body).toHaveProperty("article", expect.any(Object));
      });
  });
  test(`200: article object has the properties:
        'author' 
        'title'
        'article_id'
        'body'
        'topic'
        'created_at'
        'votes'
        'comment_count'`, () => {
    return request(app)
      .get(`/api/articles/4`)
      .expect(200)
      .then(({body}) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            title: expect.any(String),
            article_id: 4,
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(Number),
          })
        );
      });
  });
  test(`200: returns counted comments for the given article in the property 'comment-count'`, () => {
    return request(app)
      .get(`/api/articles/4`)
      .expect(200)
      .then(({body}) => {
        expect(body.article).toHaveProperty("comment_count", 0);
      });
  });
  test(`404: responds with an error message if article_id doesn't exist in the database but is valid`, () => {
    return request(app)
      .get(`/api/articles/1000`)
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe(`Article not found`);
      });
  });
  test(`400: responds with an error message if article_id is not valid`, () => {
    return request(app)
      .get(`/api/articles/four`)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe(`Invalid input`);
      });
  });
});

describe(`PATCH - /api/articles/:article_id`, () => {
  test(`200: responds with an object {article: article}, where the value 'article' is the updated article`, () => {
    const incrementVote = {inc_votes: 1};
    return request(app)
      .patch(`/api/articles/2`)
      .send(incrementVote)
      .expect(200)
      .then(({body}) => {
        expect(body).toHaveProperty("article", expect.any(Object));
        expect(body.article).toEqual(
          expect.objectContaining({
            author: expect.any(String),
            article_id: 2,
            title: expect.any(String),
            body: expect.any(String),
            topic: expect.any(String),
            created_at: expect.any(String),
          })
        );
      });
  });
  test(`200: increments the votes`, () => {
    const incrementVote = {inc_votes: 1};
    return request(app)
      .patch(`/api/articles/2`)
      .send(incrementVote)
      .expect(200)
      .then(({body}) => {
        expect(body.article).toHaveProperty("votes", 1);
      });
  });
  test(`200: decrements the votes`, () => {
    const decrementVote = {inc_votes: -100};
    return request(app)
      .patch(`/api/articles/1`)
      .send(decrementVote)
      .expect(200)
      .then(({body}) => {
        expect(body.article).toHaveProperty("votes", 0);
      });
  });
  test(`400: returns an error message if 'inc_votes' property on request body is missed`, () => {
    const incrementVote = {
      inc_comments: 1,
    };

    return request(app)
      .patch(`/api/articles/3`)
      .send(incrementVote)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe(`Required fields are missed`);
      });
  });

  test(`400: returns an error message if the value of inc_votes is not number`, () => {
    const incrementVote = {inc_votes: `ten`};
    const article_id = 3;
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(incrementVote)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe(`Incorrect type. Number is expected`);
      });
  });
  test(`400: returns an error message if the article_id is not valid`, () => {
    const incrementVote = {inc_votes: 100};
    const article_id = `titleOfArticle`;
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(incrementVote)
      .expect(400)
      .then(({body}) => {
        expect(body.msg).toBe(`Invalid input`);
      });
  });
  test(`404: returns an error message if the article_id doesn't exist in the database but is valid`, () => {
    const incrementVote = {inc_votes: 100};
    const article_id = 1000;
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send(incrementVote)
      .expect(404)
      .then(({body}) => {
        expect(body.msg).toBe(`Article not found`);
      });
  });
});
