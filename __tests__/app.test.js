const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data");
const db = require("../db/connection");
const app = require("../app");
const request = require("supertest");
require("jest-sorted");

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
            expect(topic).toEqual(
              expect.objectContaining({
                description: expect.any(String),
                slug: expect.any(String),
              })
            );
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

  describe("GET /api/articles", () => {
    test("status: 200, should respond with an array of all articles", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((result) => {
          expect(result.body.articles).toBeInstanceOf(Array);
          expect(result.body.articles).toHaveLength(12);
          result.body.articles.forEach((article) => {
            expect(article).toEqual(
              expect.objectContaining({
                article_id: expect.any(Number),
                title: expect.any(String),
                topic: expect.any(String),
                author: expect.any(String),
                body: expect.any(String),
                created_at: expect.any(String),
                votes: expect.any(Number),
                comment_count: expect.any(Number),
              })
            );
          });
        });
    });
    test("status: 200, should return all articles default sorted in order of descending date", () => {
      return request(app)
        .get("/api/articles")
        .expect(200)
        .then((result) => {
          expect(result.body.articles).toBeSortedBy("created_at", {
            descending: true,
          });
        });
    });
  });
  describe("GET /api/articles/:articleid/comments", () => {
    test("status: 200, should return an array of comments for chosen article", () => {
      const articleid = 3;
      const thirdArticle = [
        {
          comment_id: 10,
          body: "git push origin master",
          article_id: 3,
          author: "icellusedkars",
          votes: 0,
          created_at: "2020-06-20T07:24:00.000Z",
        },
        {
          comment_id: 11,
          body: "Ambidextrous marsupial",
          article_id: 3,
          author: "icellusedkars",
          votes: 0,
          created_at: "2020-09-19T23:10:00.000Z",
        },
      ];
      return request(app)
        .get(`/api/articles/${articleid}/comments`)
        .expect(200)
        .then((result) => {
          expect(result.body.comments).toBeInstanceOf(Array);
          expect(result.body.comments).toHaveLength(2);
          result.body.comments.forEach((comment) => {
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
          expect(result.body.comments).toEqual(thirdArticle);
        });
    });
    test("status: 200, should return an empty array if no comments exist for chosen article", () => {
      const articleid = 7;
      return request(app)
        .get(`/api/articles/${articleid}/comments`)
        .expect(200)
        .then((result) => {
          expect(result.body.comments).toBeInstanceOf(Array);
          expect(result.body.comments).toHaveLength(0);
        });
    });
  });
  describe("GET /api/articles/:articleid/comments ERRORS", () => {
    test("status: 404, should respond with error message article not found if incorrect endpoint", () => {
      const articleid = 983;
      return request(app)
        .get(`/api/articles/${articleid}/comments`)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe(
            `article with id: ${articleid} does not exist`
          );
          expect(res.body.detail).toBe(`please enter valid article number`);
        });
    });
    test("status: 400, should respond with error message bad request when given invalid data type", () => {
      const articleid = "incorrect_path";
      return request(app)
        .get(`/api/articles/${articleid}/comments`)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("bad request");
          expect(res.body.detail).toBe(
            "invalid data type, please enter a valid data type"
          );
        });
    });
  });

  describe("POST /api/articles/:articleid/comments", () => {
    test("status: 201, should add comment and respond with posted comment", () => {
      const articleid = 7;
      const newComment = {
        username: "icellusedkars",
        body: "This is a new comment",
      };
      return request(app)
        .post(`/api/articles/${articleid}/comments`)
        .send(newComment)
        .expect(201)
        .then((result) => {
          expect(result.body.addedComment).toEqual(
            expect.objectContaining({
              comment_id: 19,
              body: "This is a new comment",
              article_id: 7,
              author: "icellusedkars",
              votes: 0,
              created_at: expect.any(String),
            })
          );
        });
    });
    test("status: 201, should respond with posted comment only with the specified keys, user should not be able to manipulate additonal keys", () => {
      const articleid = 7;
      const newComment = {
        username: "icellusedkars",
        body: "This is a new comment",
        votes: 100,
      };
      return request(app)
        .post(`/api/articles/${articleid}/comments`)
        .send(newComment)
        .expect(201)
        .then((result) => {
          expect(result.body.addedComment.votes).toBe(0);
          expect(result.body.addedComment.body).toBe("This is a new comment");
          expect(result.body.addedComment.author).toBe("icellusedkars");
        });
    });

    test("status: 400, should return error when missing input values", () => {
      const missingUsernameInput = {
        username: "icellusedkars",
      };

      return request(app)
        .post("/api/articles/7/comments")
        .send(missingUsernameInput)
        .then((res) => {
          expect(res.body.msg).toBe("bad request");
          expect(res.body.detail).toBe(
            "invalid data type, please enter a valid data type"
          );
        });
    });
    test("status: 400, should return error when input incorrect values", () => {
      const incorrectBodyComment = {
        username: "icellusedkars",
        body: ["incorrect", "input", "data"],
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(incorrectBodyComment)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("bad request");
          expect(res.body.detail).toBe(
            "invalid data type, please enter a valid data type"
          );
        });
    });
    test("status: 404, should return error when username does not exist ", () => {
      const commentFromUnknownUser = {
        username: "notausername",
        body: "This is the test body",
      };
      return request(app)
        .post("/api/articles/1/comments")
        .send(commentFromUnknownUser)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("not found");
          expect(res.body.detail).toBe("does the item exist?");
        });
    });

    test("status: 404, should respond with error message article not found if incorrect endpoint", () => {
      const articleid = 983;
      const newComment = {
        username: "icellusedkars",
        body: "This is a new comment",
      };
      return request(app)
        .post(`/api/articles/${articleid}/comments`)
        .send(newComment)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe("not found");
          expect(res.body.detail).toBe(`does the item exist?`);
        });
    });
    test("status: 400, should respond with error message bad request when given invalid data type", () => {
      const articleid = "incorrect_path";
      const newComment = {
        username: "icellusedkars",
        body: "This is a new comment",
      };
      return request(app)
        .post(`/api/articles/${articleid}/comments`)
        .send(newComment)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("bad request");
          expect(res.body.detail).toBe(
            "invalid data type, please enter a valid data type"
          );
        });
    });
  });

  describe("GET QUERIES /api/articles", () => {
    test("status: 200, should return the articles sorted by votes", () => {
      return request(app)
        .get("/api/articles?sort_by=votes")
        .expect(200)
        .then((result) => {
          expect(result.body.articles).toBeSortedBy("votes", {
            descending: true,
          });
        });
    });
    test("status: 200, should return the articles sorted by author", () => {
      return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then((result) => {
          expect(result.body.articles).toBeSortedBy("author", {
            descending: true,
          });
        });
    });
    test("status: 200, should return the articles sorted by title", () => {
      return request(app)
        .get("/api/articles?sort_by=title")
        .expect(200)
        .then((result) => {
          expect(result.body.articles).toBeSortedBy("title", {
            descending: true,
          });
        });
    });
    test("ERROR: 400, should respond with bad request error if given invalid sort by query", () => {
      return request(app)
        .get("/api/articles?sort_by=invalid_query")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("bad request");
          expect(res.body.detail).toBe(
            "invalid data type, please enter a valid data type"
          );
        });
    });
    test("status: 200, should return the articles ordered in ascending order", () => {
      return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then((result) => {
          expect(result.body.articles).toBeSortedBy("created_at", {
            ascending: true,
          });
        });
    });
    test("status: 200, should return the articles sorted by votes ordered in ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=votes&order=asc")
        .expect(200)
        .then((result) => {
          expect(result.body.articles).toBeSortedBy("votes", {
            ascending: true,
          });
        });
    });
    test("status: 200, should return the articles sorted by author ordered in ascending order", () => {
      return request(app)
        .get("/api/articles?sort_by=author&order=asc")
        .expect(200)
        .then((result) => {
          expect(result.body.articles).toBeSortedBy("author", {
            ascending: true,
          });
        });
    });
    test("ERROR: 400, should respond with bad request error if given invalid order query", () => {
      return request(app)
        .get("/api/articles?order=invalid_query")
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("bad request");
          expect(res.body.detail).toBe(
            "invalid data type, please enter a valid data type"
          );
        });
    });
    test("status: 200, should respond with all articles by topic queried", () => {
      return request(app)
        .get("/api/articles?topic=mitch")
        .expect(200)
        .then((result) => {
          result.body.articles.forEach((article) => {
            expect(article.topic).toBe("mitch");
          });
        });
    });
    test("status: 200, should respond with empty array if topic exists but has no articles associated with it", () => {
      return request(app)
        .get("/api/articles?topic=paper")
        .expect(200)
        .then((result) => {
          expect(result.body.articles).toBeInstanceOf(Array);
          expect(result.body.articles).toHaveLength(0);
        });
    });
    test("ERROR: 400, should respond with bad request error message if topic query contains invalid data type", () => {
      return request(app)
        .get(`/api/articles?topic=${1234}`)
        .expect(400)
        .then((res) => {
          expect(res.body.msg).toBe("bad request");
          expect(res.body.detail).toBe(
            "invalid data type, please enter a valid data type"
          );
        });
    });
    test("ERROR: 404, should respond with topic does not exist if passed topic which does not exist", () => {
      const nonexistentTopic = "pigeons";
      return request(app)
        .get(`/api/articles?topic=${nonexistentTopic}`)
        .expect(404)
        .then((res) => {
          expect(res.body.msg).toBe(
            `topic: ${nonexistentTopic} does not exist`
          );
          expect(res.body.detail).toBe("please provide a different topic");
        });
    });
  });
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
