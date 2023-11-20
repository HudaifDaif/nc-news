const app = require("../app");
const db = require("../db/connection");
const request = require("supertest");
const seed = require("../db/seeds/seed");
const {
	topicData,
	userData,
	articleData,
	commentData,
} = require("../db/data/test-data");

const endpoints = require("../endpoints.json");

beforeEach(() => seed(topicData, userData, articleData, commentData));

afterAll(() => db.end());

describe("/api/topics", () => {
	describe("GET /api/topics", () => {
		it("200: should respond with an object containing topic objects with keys of 'slug' and 'description'", () => {
			return request(app)
				.get("/api/topics")
				.expect(200)
				.then(({ body }) => {
					body.topics.forEach((topic) => {
						expect(topic).toMatchObject({
							slug: expect.any(String),
							description: expect.any(String),
						});
					});
				});
		});
		it("400: should respond with a message of 'Not Found' when the path is not a valid endpoint", () => {
			return request(app)
				.get("/api/topic")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not Found");
				});
		});
	});
});

describe("/api", () => {
	describe("GET /api", () => {
		it("200: should respond with an object describing all available endpoints of the api", () => {
			return request(app)
				.get("/api")
				.expect(200)
				.then(({ body }) => {
					expect(body).toMatchObject(endpoints);
				});
		});
	});
});
