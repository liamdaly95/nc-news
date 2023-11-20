const app = require("../app/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const { topicData, userData, articleData, commentData } = require("../db/data/test-data/index");
const fs = require("fs/promises")

beforeEach(() => seed({ topicData, userData, articleData, commentData }));
afterAll(() => db.end());

describe("ANY not a path", () => {
    test("404: sends an appropriate status and error message when given a non-existent endpoint", () => {
      return request(app)
        .get("/notapath")
        .expect(404)
        .then(({body}) => {
          expect(body.msg).toBe("path not found")
        })
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

describe("GET /api", () => {
  test('200: should respond with an object describing all the API endpoints', () => {
    return request(app)
    .get("/api")
    .expect(200)
    .then(({body}) => {
      const readEndpointsPromise = fs.readFile(`${__dirname}/../endpoints.JSON`,"utf-8")
      return Promise.all([body, readEndpointsPromise])
    })
    .then((array) => {
      const body = array[0];
      const contents = JSON.parse(array[1])
      const numberOfPaths = Object.keys(contents).length
      expect(Object.keys(body.endpoints)).toHaveLength(numberOfPaths)
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
