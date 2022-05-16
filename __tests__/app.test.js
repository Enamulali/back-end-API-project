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
        expect(res.body.detail).toBe("inavlid endpoint/method");
      });
  });
});
