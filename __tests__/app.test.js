const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");

beforeEach(() => seed(testData));

afterAll(() => {
  db.end();
});

describe("/api/topics", () => {
  describe("GET /api/topics", () => {
    test("status: 200, should respond with all treasures", () => {
      return request(app)
        .get("/api/topics")
        .expect(200)
        .then((result) => {
          expect(result.body.topics).toHaveLength(3);
          result.body.topics.forEach((topic) => {
            expect(topic).toMatchObject({
              description: expect.any(String),
              slug: expect.any(String),
            });
          });
        });
    });
  });
  describe("GET /api/topics ERRORS", () => {
    test("status: 404, should respond with error message not found when given incorrect route", () => {
      return request(app)
        .get("/api/topice")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("not found");
          expect(res.body.detail).toBe("invalid endpoint/method");
        });
    });
  });
});
//make request for article with no commennts
describe("/api/articles", () => {
  describe("GET /api/articles/:articleid", () => {
    test("status: 200, responds with a single matching article", () => {
      const articleid = 1;
      const secondArticle = {
        article_id: 1,
        title: "Living in the shadow of a great man",
        topic: "mitch",
        author: "butter_bridge",
        body: "I find this existence challenging",
        created_at: "2020-07-09T20:11:00.000Z",
        votes: 100,
      };
      return request(app)
        .get(`/api/articles/${articleid}`)
        .expect(200)
        .then((result) => {
          expect(result.body.article).toEqual(
            expect.objectContaining(secondArticle)
          );
        });
    });
    //test for left join
  });
  describe("GET /api/articles/:articleid COMMENT COUNT", () => {
    test("status: 200, should return selected article, with a comment count", () => {
      const articleid = 3;
      const thirdArticle = {
        article_id: 3,
        title: "Eight pug gifs that remind me of mitch",
        topic: "mitch",
        author: "icellusedkars",
        body: "some gifs",
        created_at: "2020-11-03T09:12:00.000Z",
        votes: 0,
        comment_count: 2,
      };
      return request(app)
        .get(`/api/articles/${articleid}`)
        .expect(200)
        .then((result) => {
          expect(result.body.article).toEqual(thirdArticle);
          expect(result.body.article.comment_count).toBe(2);
        });
    });
    test("status: 200, should return selected article, if no comment for it exists", () => {
      const articleid = 7;
      const seventhArticle = {
        article_id: 7,
        title: "Z",
        topic: "mitch",
        author: "icellusedkars",
        body: "I was hungry.",
        created_at: "2020-01-07T14:08:00.000Z",
        votes: 0,
        comment_count: 0,
      };
      return request(app)
        .get(`/api/articles/${articleid}`)
        .expect(200)
        .then((result) => {
          expect(result.body.article).toEqual(seventhArticle);
          expect(result.body.article.comment_count).toBe(0);
        });
    });
  });
  describe("GET /api/articles/:articleid ERRORS", () => {
    test("status: 400, should respond with error message bad request when given invalid data type", () => {
      return request(app)
        .get("/api/articles/invalid_data")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("bad request");
          expect(res.body.detail).toBe(
            "invalid data type, please enter a valid data type"
          );
        });
    });
    test("status: 404, should respond with error message article not found", () => {
      const articleid = 983;
      return request(app)
        .get(`/api/articles/${articleid}`)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe(
            `article with id: ${articleid} does not exist`
          );
          expect(res.body.detail).toBe(`please enter valid article number`);
        });
    });
  });
  describe("PATCH /api/articles/:articleid", () => {
    test("status: 200, should respond with updated article", () => {
      const articleid = 2;
      return request(app)
        .patch(`/api/articles/${articleid}`)
        .send({ inc_votes: 1 })
        .expect(200)
        .then((result) => expect(result.body.article.votes).toEqual(1));
    });
    test("status: 200, should respond with updated article when passed negative vote count", () => {
      const articleid = 2;
      return request(app)
        .patch(`/api/articles/${articleid}`)
        .send({ inc_votes: -10 })
        .expect(200)
        .then((result) => expect(result.body.article.votes).toEqual(-10));
    });
  });
  describe("PATCH /api/articles/:articleid ERRORS", () => {
    test("status: 404, should respond with error message article not found if incorrect endpoint", () => {
      const articleid = 983;
      return request(app)
        .patch(`/api/articles/${articleid}`)
        .send({ inc_votes: -10 })
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe(
            `article with id: ${articleid} does not exist`
          );
          expect(res.body.detail).toBe(`please enter valid article number`);
        });
    });
    test("status: 400, should respond with error message bad request when given invalid data type", () => {
      const articleid = 2;
      return request(app)
        .patch(`/api/articles/${articleid}`)
        .send({ inc_votes: "ABC" })
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("bad request");
          expect(res.body.detail).toBe(
            "invalid data type, please enter a valid data type"
          );
        });
    });
    test("status: 400, should respond with error message bad request when given incorrect or missing data", () => {
      const articleid = 2;
      return request(app)
        .patch(`/api/articles/${articleid}`)
        .send({})
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("bad request");
          expect(res.body.detail).toBe(
            "invalid data type, please enter a valid data type"
          );
        });
    });
  });
  describe("GET /api/articles", () => {});
});

describe("/api/users", () => {
  describe("GET /api/users", () => {
    test("status: 200, should respond with all users", () => {
      return request(app)
        .get("/api/users")
        .expect(200)
        .then((result) => {
          expect(result.body.users).toHaveLength(4);
          result.body.users.forEach((user) => {
            expect(user).toMatchObject({
              username: expect.any(String),
              name: expect.any(String),
              avatar_url: expect.stringContaining("http"),
            });
          });
        });
    });
  });
  describe("GET /api/users ERRORS", () => {
    test("status: 404, should respond with error message not found when given incorrect route", () => {
      return request(app)
        .get("/api/bananas")
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("not found");
          expect(res.body.detail).toBe("invalid endpoint/method");
        });
    });
  });
});
