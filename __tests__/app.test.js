const app = require("../app/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const { topicData, userData, articleData, commentData } = require("../db/data/test-data/index");

beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => db.end());

describe("GET from non-existent endpoint", () => {
    test("404: sends an appropriate status and error message when given a non-existent endpoint", () => {
      return request(app)
        .get("/api")
        .expect(404)
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
