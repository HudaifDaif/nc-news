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

describe("\n/api", () => {
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

describe("\n/api/topics", () => {
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

describe("\n/api/articles", () => {
	describe("GET /api/articles", () => {
		it("200: should respond with an object with a key of articles containing all article objects", () => {
			return request(app)
				.get("/api/articles")
				.expect(200)
				.then(({ body }) => {
					body.articles.forEach((article) => {
						expect(article).toMatchObject({
							author: expect.any(String),
							title: expect.any(String),
							article_id: expect.any(Number),
							topic: expect.any(String),
							created_at: expect.any(String),
							votes: expect.any(Number),
							article_img_url: expect.any(String),
						});
					});
				});
		});
		it("200: should respond with each object containing a comment_count property which represents the number of comments with the corresponding article_id of each article", () => {
			return request(app)
				.get("/api/articles")
				.expect(200)
				.then(({ body }) => {
					body.articles.forEach((article) => {
						expect(Number(article.comment_count)).not.toBe(NaN);

						const verifyCommentCount = commentData.filter(
							(comment) => {
								return (
									comment.article_id === article.article_id
								);
							}
						).length;

						expect(Number(article.comment_count)).toBe(
							verifyCommentCount
						);
					});
				});
		});
		it("200: should return the articles sorted by date in descending order by default", () => {
			return request(app)
				.get("/api/articles")
				.expect(200)
				.then(({ body }) => {
					const dateCorrected = body.articles.map((article) => {
						article.created_at = Date.parse(article.created_at);
						return article;
					});
					expect(dateCorrected).toBeSortedBy("created_at", {
						descending: true,
					});
				});
		});
		it("200: should return the articles with no body property", () => {
			return request(app)
				.get("/api/articles")
				.expect(200)
				.then(({ body }) => {
					body.articles.forEach((article) => {
						expect(article).not.toHaveProperty("body");
					});
				});
		});
	});
	describe("Addition of sort_by and order queries", () => {
		describe("GET /api/articles?sort_by=", () => {
			it("200: should sort the response array by the column name given, defaulting to descending order ", () => {
				return request(app)
					.get("/api/articles?sort_by=title")
					.expect(200)
					.then(({ body }) => {
						expect(body.articles).toBeSortedBy("title", {
							descending: true,
						});
					});
			});
			it("400: should respond with a message of 'Bad Request' when given an invalid column name", () => {
				return request(app)
					.get("/api/articles?sort_by=str")
					.expect(400)
					.then(({ body }) => {
						expect(body.msg).toBe("Bad Request");
					});
			});
		});
		describe("GET /api/articles?order=", () => {
			it("200: should set the order to ascending (asc) or descending (desc)", () => {
				return request(app)
					.get("/api/articles?order=asc")
					.expect(200)
					.then(({ body }) => {
						const dateCorrected = body.articles.map((article) => {
							article.created_at = Date.parse(article.created_at);
							return article;
						});
						expect(dateCorrected).toBeSortedBy("created_at", {
							descending: false,
						});
					})
					.then(() => {
						return request(app)
							.get("/api/articles?order=desc")
							.expect(200)
							.then(({ body }) => {
								const dateCorrected = body.articles.map(
									(article) => {
										article.created_at = Date.parse(
											article.created_at
										);
										return article;
									}
								);
								expect(dateCorrected).toBeSortedBy(
									"created_at",
									{
										descending: true,
									}
								);
							});
					});
			});
			it("400: should respond with a message of 'Bad Request' when given an invalid order value", () => {
				return request(app)
					.get("/api/articles?order=str")
					.expect(400)
					.then(({ body }) => {
						expect(body.msg).toBe("Bad Request");
					});
			});
			describe("GET /api/articles?sort_by=&order=", () => {
				it("200: should work when giving both queries in combination", () => {
					return request(app)
						.get("/api/articles?sort_by=title&order=asc")
						.expect(200)
						.then(({ body }) => {
							const dateCorrected = body.articles.map(
								(article) => {
									article.created_at = Date.parse(
										article.created_at
									);
									return article;
								}
							);
							expect(dateCorrected).toBeSortedBy("title", {
								descending: false,
							});
						});
				});
				it("400: should respond with a message of 'Bad Request' when either query is invalid", () => {
					return request(app)
						.get("/api/articles?sort_by=str&order=asc")
						.expect(400)
						.then(({ body }) => {
							expect(body.msg).toBe("Bad Request");
						})
						.then(() => {
							return request(app)
								.get("/api/articles?sort_by=title&order=str")
								.expect(400)
								.then(({ body }) => {
									expect(body.msg).toBe("Bad Request");
								});
						})
						.then(() => {
							return request(app)
								.get("/api/articles?sort_by=str&order=str")
								.expect(400)
								.then(({ body }) => {
									expect(body.msg).toBe("Bad Request");
								});
						});
				});
			});
		});
	});
	describe("/api/articles/:article_id", () => {
		describe("GET api/articles/:article_id", () => {
			it("200: should respond with an object with a key of article, containing the corresponding article object", () => {
				return request(app)
					.get("/api/articles/12")
					.expect(200)
					.then(({ body }) => {
						expect(body.article).toMatchObject({
							author: expect.any(String),
							title: expect.any(String),
							article_id: 12,
							body: expect.any(String),
							topic: expect.any(String),
							created_at: expect.any(String),
							votes: expect.any(Number),
							article_img_url: expect.any(String),
						});
					});
			});
			it("404: should respond with a message of 'Not Found' if the article_id is valid but does not exist", () => {
				return request(app)
					.get("/api/articles/9999999")
					.expect(404)
					.then(({ body }) => {
						expect(body.msg).toBe("Not Found");
					});
			});
			it("400: should respond with a message of 'Bad Request' when given an invalid article_id", () => {
				return request(app)
					.get("/api/articles/str")
					.expect(400)
					.then(({ body }) => {
						expect(body.msg).toBe("Bad Request");
					});
			});
			describe("Addition of comment_count property", () => {
				it("200: should respond with a property of comment_count", () => {
					return request(app)
						.get("/api/articles/12")
						.expect(200)
						.then(({ body }) => {
							expect(body.article).toMatchObject({
								comment_count: expect.any(Number),
							});
						});
				});
			});
		});
	});

	describe("/api/articles/:article_id/comments", () => {
		describe("POST /api/articles/:article_id/comments", () => {
			it("200: should return a comment object for the posted comment", () => {
				return request(app)
					.post("/api/articles/3/comments")
					.send({
						username: "lurker",
						body: "Lorem ipsum",
					})
					.expect(200)
					.then(({ body }) => {
						expect(body.comment).toMatchObject({
							comment_id: expect.any(Number),
							body: "Lorem ipsum",
							votes: 0,
							author: "lurker",
							article_id: 3,
							created_at: expect.any(String),
						});
					});
			});
			it("200: should add the posted comment to the comments table", () => {
				return request(app)
					.post("/api/articles/3/comments")
					.send({
						username: "lurker",
						body: "-->This comment!!!<--",
					})
					.expect(200)
					.then(() => {
						return request(app)
							.get("/api/articles/3/comments")
							.expect(200)
							.then(({ body }) => {
								const [testComment] = body.comments.filter(
									(comment) => {
										return comment.author === "lurker" &&
											comment.body ===
												"-->This comment!!!<--"
											? comment
											: null;
									}
								);

								expect(testComment).toMatchObject({
									comment_id: expect.any(Number),
									body: "-->This comment!!!<--",
									votes: 0,
									author: "lurker",
									article_id: 3,
									created_at: expect.any(String),
								});
							});
					});
			});
			it("404: should respond with a message of 'Not Found' if the article_id is valid but does not exist", () => {
				return request(app)
					.post("/api/articles/999999/comments")
					.send({
						username: "lurker",
						body: "-->This comment!!!<--",
					})
					.expect(404)
					.then(({ body }) => {
						expect(body.msg).toBe("Not Found");
					});
			});
			it("400: should respond with a message of 'Bad Request' if the article_id is not valid", () => {
				return request(app)
					.post("/api/articles/str/comments")
					.send({
						username: "lurker",
						body: "-->This comment!!!<--",
					})
					.expect(400)
					.then(({ body }) => {
						expect(body.msg).toBe("Bad Request");
					});
			});
			it("404: should respond with a message of 'Not Found' if the username is not associated to a user", () => {
				return request(app)
					.post("/api/articles/3/comments")
					.send({
						username: "imdefinitelylurker",
						body: "-->This comment!!!<--",
					})
					.expect(404)
					.then(({ body }) => {
						expect(body.msg).toBe("Not Found");
					});
			});
			it("400: should return a message of Bad Request if any fields are missing", () => {
				return request(app)
					.post("/api/articles/3/comments")
					.send({
						body: "Lorem ipsum",
					})
					.expect(400)
					.then(({ body }) => {
						expect(body.msg).toBe("Bad Request");
					})
					.then(() => {
						return request(app)
							.post("/api/articles/3/comments")
							.send({
								username: "imdefinitelylurker",
							})
							.expect(400)
							.then(({ body }) => {
								expect(body.msg).toBe("Bad Request");
							});
					})
					.then(() => {
						return request(app)
							.post("/api/articles/3/comments")
							.send({
								name: "imdefinitelylurker",
								comment: "Lorem ipsum",
							})
							.expect(400)
							.then(({ body }) => {
								expect(body.msg).toBe("Bad Request");
							});
					});
			});
		});
		describe("GET /api/articles/:article_id/comments", () => {
			it("200: should respond with an object containing an array of comment objects on the key of comments", () => {
				return request(app)
					.get("/api/articles/1/comments")
					.expect(200)
					.then(({ body }) => {
						body.comments.forEach((comment) => {
							expect(comment).toMatchObject({
								comment_id: expect.any(Number),
								votes: expect.any(Number),
								created_at: expect.any(String),
								author: expect.any(String),
								body: expect.any(String),
								article_id: 1,
							});
						});
					});
			});
			it("200: should return the comments sorted by most recent first", () => {
				return request(app)
					.get("/api/articles/1/comments")
					.expect(200)
					.then(({ body }) => {
						const dateCorrected = body.comments.map((comment) => {
							comment.created_at = Date.parse(comment.created_at);
							return comment;
						});
						expect(dateCorrected).toBeSortedBy("created_at", {
							descending: true,
						});
					});
			});
			it("404: should respond with a message of 'Not Found' when given an article_id that does not exist in the table", () => {
				return request(app)
					.get("/api/articles/999999/comments")
					.expect(404)
					.then(({ body }) => {
						expect(body.msg).toBe("Not Found");
					});
			});
			it("200: should respond with an empty array on the comments key where the article_id exists but is not associated with any comments", () => {
				return request(app)
					.get("/api/articles/7/comments")
					.expect(200)
					.then(({ body }) => {
						expect(body).toMatchObject({ comments: [] });
					});
			});
			it("400: should respond with a message of 'Bad Request' when given an invalid article_id", () => {
				return request(app)
					.get("/api/articles/str/comments")
					.expect(400)
					.then(({ body }) => {
						expect(body.msg).toBe("Bad Request");
					});
			});

			describe("GET /api/articles?topic=", () => {
				it("200: should respond with an array of all of the articles which have a topic that matches the topic value given", () => {
					return request(app)
						.get("/api/articles?topic=mitch")
						.expect(200)
						.then(({ body }) => {
							body.articles.forEach((article) => {
								expect(article).toMatchObject({
									title: expect.any(String),
									author: expect.any(String),
									article_id: expect.any(Number),
									topic: "mitch",
									created_at: expect.any(String),
									votes: expect.any(Number),
									article_img_url: expect.any(String),
									comment_count: expect.any(String),
								});
							});
						});
				});
				it("404: should respond with a message of 'Not Found' if none of the articles' topics match the topic value given", () => {
					return request(app)
						.get("/api/articles?topic=notATopic")
						.expect(404)
						.then(({ body }) => {
							expect(body.msg).toBe("Not Found");
						});
				});
				it("200: should respond with an empty array if the topic exists but no articles have been created for it yet", () => {
					return request(app)
						.get("/api/articles?topic=paper")
						.expect(200)
						.then(({ body }) => {
							expect(body.articles).toEqual([]);
						});
				});
			});

			describe("GET /api/articles/:article_id/comments", () => {
				it("200: should respond with an object containing an array of comment objects on the key of comments", () => {
					return request(app)
						.get("/api/articles/1/comments")
						.expect(200)
						.then(({ body }) => {
							body.comments.forEach((comment) => {
								expect(comment).toMatchObject({
									comment_id: expect.any(Number),
									votes: expect.any(Number),
									created_at: expect.any(String),
									author: expect.any(String),
									body: expect.any(String),
									article_id: 1,
								});
							});
						});
				});
				it("200: should return the comments sorted by most recent first", () => {
					return request(app)
						.get("/api/articles/1/comments")
						.expect(200)
						.then(({ body }) => {
							const dateCorrected = body.comments.map(
								(comment) => {
									comment.created_at = Date.parse(
										comment.created_at
									);
									return comment;
								}
							);
							expect(dateCorrected).toBeSortedBy("created_at", {
								descending: true,
							});
						});
				});

				it("404: should respond with a message of 'Not Found' when given an article_id that does not exist in the table", () => {
					return request(app)
						.get("/api/articles/999999/comments")
						.expect(404)
						.then(({ body }) => {
							expect(body.msg).toBe("Not Found");
						});
				});
				it("200: should respond with an empty array on the comments key where the article_id exists but is not associated with any comments", () => {
					return request(app)
						.get("/api/articles/7/comments")
						.expect(200)
						.then(({ body }) => {
							expect(body).toMatchObject({ comments: [] });
						});
				});
				it("400: should respond with a message of 'Bad Request' when given an invalid article_id", () => {
					return request(app)
						.get("/api/articles/str/comments")
						.expect(400)
						.then(({ body }) => {
							expect(body.msg).toBe("Bad Request");
						});
				});
			});
		});
	});

	describe("PATCH /api/articles/:article_id", () => {
		it("200: should respond with an article object with the value of the request object's inc_votes property", () => {
			return request(app)
				.get("/api/articles/2")
				.expect(200)
				.then(({ body }) => {
					let getBody = body;

					return request(app)
						.patch("/api/articles/2")
						.send({
							inc_votes: 3,
						})
						.expect(200)
						.then(({ body }) => {
							let patchBody = body;

							expect(patchBody.article.votes).toBe(
								getBody.article.votes + 3
							);
						});
				});
		});
		it("200: should be able to decrement votes when given a negative value", () => {
			return request(app)
				.get("/api/articles/2")
				.expect(200)
				.then(({ body }) => {
					let getBody = body;

					return request(app)
						.patch("/api/articles/2")
						.send({
							inc_votes: -25,
						})
						.expect(200)
						.then(({ body }) => {
							let patchBody = body;

							expect(patchBody.article.votes).toBe(
								getBody.article.votes - 25
							);
						});
				});
		});
		it("404: should respond with a message of 'Not Found' if the article_id is valid but does not exist", () => {
			return request(app)
				.patch("/api/articles/999999")
				.expect(404)
				.send({
					inc_votes: 0,
				})
				.then(({ body }) => {
					expect(body.msg).toBe("Not Found");
				});
		});
		it("400: should respond with a message of 'Bad Request' when given an invalid article_id", () => {
			return request(app)
				.patch("/api/articles/str")
				.expect(400)
				.send({
					inc_votes: 0,
				})
				.then(({ body }) => {
					expect(body.msg).toBe("Bad Request");
				});
		});
		it("400: should respond with a message of 'Bad Request' when not given the correct object properties", () => {
			return request(app)
				.patch("/api/articles/2")
				.expect(400)
				.send({
					votes: 0,
				})
				.then(({ body }) => {
					expect(body.msg).toBe("Bad Request");
				});
		});
		it("400: should respond with a message of 'Bad Request' when given an incorrect data type on the correct key", () => {
			return request(app)
				.patch("/api/articles/2")
				.expect(400)
				.send({
					inc_votes: "str",
				})
				.then(({ body }) => {
					expect(body.msg).toBe("Bad Request");
				});
		});
	});
});

describe("\n/api/users", () => {
	describe("GET /api/users", () => {
		it("200: should return all users in database", () => {
			return request(app)
				.get("/api/users")
				.expect(200)
				.then(({ body }) => {
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
	describe("GET /api/users/:username", () => {
		it("200: should respond with a user object that matches the username given", () => {
			return request(app)
				.get("/api/users/lurker")
				.expect(200)
				.then(({ body }) => {
					expect(body.user).toEqual({
						username: "lurker",
						name: "do_nothing",
						avatar_url:
							"https://www.golenbock.com/wp-content/uploads/2015/01/placeholder-user.png",
					});
				});
		});
		it("404: should respond with a message of 'Not Found' when a user with the given username does not exist", () => {
			return request(app)
				.get("/api/users/!nobodyNobodyNobody!")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toBe("Not Found");
				});
		});
	});
});

describe("\n/api/comments", () => {
	describe("DELETE /api/comments/:comment_id", () => {
		it("204: delete the given comment by its id and respond with no content", () => {
			return request(app)
				.delete("/api/comments/1")
				.expect(204)
				.then(({ body }) => {
					expect(body).toEqual({});
				})
				.then(() => {
					return db.query(`
					SELECT * FROM comments
					WHERE comment_id = 1
					;`);
				})
				.then(({ rows }) => {
					expect(rows).toEqual([]);
				});
		});
		it("404: should respond with a message of 'Not Found' if the comment_id is valid but does not exist", () => {
			return request(app)
				.delete("/api/comments/999999")
				.expect(404)
				.then(({ body }) => {
					expect(body.msg).toEqual("Not Found");
				});
		});
		it("400: should respond with a message of 'Bad Request' when given an invalid comment_id", () => {
			return request(app)
				.delete("/api/comments/str")
				.expect(400)
				.then(({ body }) => {
					expect(body.msg).toEqual("Bad Request");
				});
		});
	});
});
