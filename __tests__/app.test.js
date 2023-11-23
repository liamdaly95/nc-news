const app = require("../app/app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const request = require("supertest");
const { topicData, userData, articleData, commentData } = require("../db/data/test-data/index");
const endpoints = require("../endpoints.json");
const sorted = require("jest-sorted");

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
  test("200: responds with a comment count for the article", () => {
    const article_id = "1";
    const comment_count = commentData.filter((comment) => {
      return comment.article_id === Number(article_id);
    }).length;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article[0].comment_count).toBe(comment_count.toString());
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
  test("200: should respond with an object describing all the API endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body }) => {
        const numberOfRoutes = Object.keys(endpoints).length;
        expect(Object.keys(body.endpoints)).toHaveLength(numberOfRoutes);
        for (const endpoint in body.endpoints) {
          expect(body.endpoints[endpoint]).toMatchObject({
            description: expect.any(String),
            queries: expect.any(Array),
            requestBodyFormat: expect.any(Object),
            exampleResponse: expect.any(Object),
          });
        }
      });
  });
});

describe("GET /api/articles", () => {
  test("200: sends an array of articles to the client with the appropriate fields (no body field)", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(13);
        body.articles.forEach((article) => {
          expect(article.body).toBe(undefined);
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("the comment count field sums up the correct number of comments for the article", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const index = body.articles.findIndex((article) => {
          return article.article_id === 1;
        });
        expect(body.articles[index].comment_count).toBe("11");
      });
  });
  test("articles should be sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSorted({ key: "created_at", descending: true });
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: returns array of comments with given related article_id", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then(({ body }) => {
        expect(body.comments).toHaveLength(11);
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            body: expect.any(String),
            votes: expect.any(Number),
            author: expect.any(String),
            article_id: expect.any(Number),
            created_at: expect.any(String),
          });
        });
      });
  });
  test("200: the comments should be sorted by created_at in descending order", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .then(({ body }) => {
        expect(body.comments).toBeSorted({ key: "created_at", descending: true });
      });
  });
  test("200: responds with an empty array if the article_id exists but there are no comments for that article", () => {
    return request(app)
      .get("/api/articles/4/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toEqual([]);
      });
  });
  test("404: responds with an appropriate error message if the article_id does not exist", () => {
    return request(app)
      .get("/api/articles/200/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("400: responds with an appropriate error message if the article_id is invalid", () => {
    return request(app)
      .get("/api/articles/notanid/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: posts new comment to the relevant article and sends the comment back to the client", () => {
    const newComment = {
      body: "this is a new well thought out comment",
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(201)
      .then(({ body }) => {
        expect(body.comment).toMatchObject({
          comment_id: 19,
          body: "this is a new well thought out comment",
          votes: 0,
          author: "butter_bridge",
          article_id: 1,
          created_at: expect.any(String),
        });
      });
  });
  test("404: should return a not found error when passed an article_id that does not exist", () => {
    const newComment = {
      body: "this is a new well thought out comment",
      username: "butter_bridge",
    };

    return request(app)
      .post("/api/articles/200/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("404: should return a not found error when passed a username that does not exist", () => {
    const newComment = {
      body: "this is a new well thought out comment",
      username: "imposter",
    };

    return request(app)
      .post("/api/articles/1/comments")
      .send(newComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("400: should return a bad request error when passed an article_id that is invalid", () => {
    const newComment = {
      body: "this is a new well thought out comment",
      username: "butter_bridge",
    };

    return request(app)
      .post("/api/articles/nonNumber/comments")
      .send(newComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: should return a bad request error when not passed body field", () => {
    const missingBody = {
      username: "butter_bridge",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(missingBody)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: should return a bad request error when not passed username field", () => {
    const missingUsername = {
      body: "this is a new well thought out comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(missingUsername)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: updates the current vote by incrementing the value provided in the request", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -179 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          votes: -79,
        });
      });
  });
  test("400: responds with a bad request error if inc_votes property is missing from request", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: responds with a bad request error if inc_votes value is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "notNumber" })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("400: responds with a bad request error if article_id is not a number", () => {
    return request(app)
      .patch("/api/articles/notNumber")
      .send({ inc_votes: 179 })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("404: responds with a not found error if article_id is valid but does not exist", () => {
    return request(app)
      .patch("/api/articles/200")
      .send({ inc_votes: 179 })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: deletes the comment with the associated comment_id", () => {
    return request(app).delete("/api/comments/1").expect(204);
  });
  test("404: returns a not found error if comment_id is valid but does not exist", () => {
    return request(app)
      .delete("/api/comments/100")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  test("400: returns a bad request error if comment_id is not valid", () => {
    return request(app)
      .delete("/api/comments/notNumber")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
});
describe("GET /api/users", () => {
  test("200: should return array of all user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users).toHaveLength(4);
        body.users.forEach((user) => {
          expect(user).toMatchObject({
            username: expect.any(String),
            name: expect.any(String),
            avatar_url: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles? queries", () => {
  test("200: responds with array of articles all with the queried topic", () => {
    const topic = "mitch";
    return request(app)
      .get(`/api/articles?topic=${topic}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(12);
        body.articles.forEach((article) => {
          expect(article.body).toBe(undefined);
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: topic,
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
        });
      });
  });
  test("200: responds with an empty array if queried with a topic which exists but there are no articles with that topic", () => {
    const topic = "paper";
    return request(app)
      .get(`/api/articles?topic=${topic}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toEqual([]);
      });
  });
  test("404: responds with a not found error message if queried with a non-existent topic", () => {
    const topic = "scissors";
    return request(app)
      .get(`/api/articles?topic=${topic}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
  const validColumns = [
    "author",
    "article_id",
    "topic",
    "title",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];
  for (let i = 0; i < validColumns.length; i++) {
    test(`should be sorted by column ${validColumns[i]}`, () => {
      const sort_by = validColumns[i];
      return request(app)
        .get(`/api/articles?sort_by=${sort_by}`)
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSorted({ key: sort_by, descending: true, coerce: true });
        });
    });
  }

  test("400: should return a bad request error if queried with an invalid column to sort on", () => {
    const sort_by = "aaabbbb";
    return request(app)
      .get(`/api/articles?sort_by=${sort_by}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  const orders = { ASC: false, DESC: true };
  for (const key in orders) {
    test(`should be sorted in ${key} order`, () => {
      const order = key;
      return request(app)
        .get(`/api/articles?order=${order}`)
        .expect(200)
        .then(({ body }) => {
          expect(body.articles).toBeSorted({ key: "created_at", descending: orders[key] });
        });
    });
  }

  test("400: should return a bad request error if queried with an invalid order", () => {
    const order = "aaabbbb";
    return request(app)
      .get(`/api/articles?order=${order}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("200: responds with array of articles with multiple queries", () => {
    return request(app)
    .get(`/api/articles?topic=cats&sort_by=article_id&order=ASC`)
    .expect(200)
    .then(({body}) => {
      expect(body.articles).toBeSorted({key: "article_id", descending: false})
      body.articles.forEach(article => expect(article.topic).toBe("cats"))
    })
  })
});

describe("GET /api/users/:username", () => {
  test("200: sends a single user to the client", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        expect(body.user[0]).toMatchObject({
          username: 'butter_bridge',
          name: 'jonny',
          avatar_url:
            'https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg'  
        });
      });
  });
  test("400: sends appropriate status and error message when requested with a non-existent username", () => {
    return request(app)
      .get("/api/users/liam_daly")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("user not found");
      });
  });
});

