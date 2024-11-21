import app from "@src/index";
import User from "@src/models/User";
import typed, * as mockingooseDefault from "mockingoose";
import request from "supertest";

// @ts-ignore
const mockingoose = mockingooseDefault as typeof typed;

describe("POST /register", () => {
  it("should return 201 OK", async () => {
    const res = await request(app).post("/register").send({
      email: "davidnuke@gmail.com",
      password: "password",
    });

    mockingoose(User).toReturn([], "find");

    expect(res.status).toBe(201);
  });
});
