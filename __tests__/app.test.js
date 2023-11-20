const app = require("../app/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const { topicData, userData, articleData, commentData } = require("../db/data/test-data/index");
const fs = require("fs/promises")
const endpoints = require("../endpoints.json")

beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => db.end());

describe("ANY not a path", () => {
  test("404: sends an appropriate status and error message when given a non-existent endpoint", () => {
    return request(app)
      .get("/notapath")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("path not found");
      });
  });
});

describe("GET /api/topics", () => {
  test("200: should return array of all topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toHaveLength(3);
        body.topics.forEach((topic) => {
          expect(topic).toMatchObject({
            description: expect.any(String),
            slug: expect.any(String),
          });
        });
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("200: sends a single article to the client", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article[0]).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
        });
      });
  });
  test("400: sends appropriate status and error message when requested with a valid but non-existent id", () => {
    return request(app)
      .get("/api/articles/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("article not found");
      });
  });
  test("404: sends appropriate status and error message when requested with an invalid id", () => {
    return request(app)
      .get("/api/articles/notanid")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("GET /api", () => {
  test('200: should respond with an object describing all the API endpoints', () => {
    return request(app)
    .get("/api")
    .expect(200)
    .then(({body}) => {
      const numberOfRoutes = Object.keys(endpoints).length
      expect(Object.keys(body.endpoints)).toHaveLength(numberOfRoutes)
      for (const endpoint in body.endpoints) {
        expect(body.endpoints[endpoint]).toMatchObject({
          description: expect.any(String),
          queries: expect.any(Array),
          requestBodyFormat: expect.any(Object),
          exampleResponse: expect.any(Object)
        })
      }
    })
  });
})
