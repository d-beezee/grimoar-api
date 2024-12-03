import app from "@src/index";
import User from "@src/models/User";
import request from "supertest";

jest.mock("@src/config/passport/strategy/jwt");
jest.mock("@src/features/db");

describe("POST /register", () => {
  afterEach(async () => {
    await User.deleteMany({});
  });

  describe("when the email is not in use", () => {
    it("should return 201 OK", async () => {
      const res = await request(app).post("/register").send({
        email: "example@example.com",
        password: "password",
      });

      expect(res.status).toBe(201);
    });

    it("should create user", async () => {
      await request(app).post("/register").send({
        email: "example@example.com",
        password: "password",
      });

      const res = await request(app)
        .get("/users/me")
        .set("Authorization", "Bearer user");

      expect(res.body).toEqual(
        expect.objectContaining({ email: "example@example.com" })
      );
    });
    it("should create user with name equal to first part of email", async () => {
      await request(app).post("/register").send({
        email: "example@example.com",
        password: "password",
      });

      const res = await request(app)
        .get("/users/me")
        .set("Authorization", "Bearer user");

      expect(res.body).toEqual(expect.objectContaining({ name: "example" }));
    });
  });
  describe("when the email is already in use", () => {
    beforeEach(async () => {
      const user = new User({
        email: "example@example.com",
      });
      await user.save();
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
