import app from "@src/index";
import User from "@src/models/User";
import typed, * as mockingooseDefault from "mockingoose";
import request from "supertest";

// @ts-ignore
const mockingoose = mockingooseDefault as typeof typed;

describe("POST /register", () => {
  describe("when the email is not in use", () => {
    beforeAll(() => {
      mockingoose(User).toReturn(null, "findOne");
    });
    it("should return 201 OK", async () => {
      const res = await request(app).post("/register").send({
        email: "example@example.com",
        password: "password",
      });

      expect(res.status).toBe(201);
    });
  });
  describe("when the email is already in use", () => {
    beforeAll(() => {
      mockingoose(User).toReturn({ email: "example@example.com" }, "findOne");
    });
    it("should return 409", async () => {
      const res = await request(app).post("/register").send({
        email: "example@example.com",
        password: "password",
      });

      expect(res.status).toBe(409);
    });
  });
});
