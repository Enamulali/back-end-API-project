const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");

beforeEach(() => seed(testData));

afterAll(() => {
  db.end();
});

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

describe("GET /api/articles/:articleid", () => {
  test("status: 200, responds with a single matching article", () => {
    const articleid = 2;
    const secondArticle = {
      article_id: 2,
      title: "Sony Vaio; or, The Laptop",
      topic: "mitch",
      author: "icellusedkars",
      body: "Call me Mitchell. Some years ago—never mind how long precisely—having little or no money in my purse, and nothing particular to interest me on shore, I thought I would buy a laptop about a little and see the codey part of the world. It is a way I have of driving off the spleen and regulating the circulation. Whenever I find myself growing grim about the mouth; whenever it is a damp, drizzly November in my soul; whenever I find myself involuntarily pausing before coffin warehouses, and bringing up the rear of every funeral I meet; and especially whenever my hypos get such an upper hand of me, that it requires a strong moral principle to prevent me from deliberately stepping into the street, and methodically knocking people’s hats off—then, I account it high time to get to coding as soon as I can. This is my substitute for pistol and ball. With a philosophical flourish Cato throws himself upon his sword; I quietly take to the laptop. There is nothing surprising in this. If they but knew it, almost all men in their degree, some time or other, cherish very nearly the same feelings towards the the Vaio with me.",
      created_at: "2020-10-16T05:03:00.000Z",
      votes: 0,
    };
    return request(app)
      .get(`/api/articles/${articleid}`)
      .expect(200)
      .then((result) => {
        expect(result.body.article).toEqual(secondArticle);
      });
  });

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
