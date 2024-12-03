import app from "@src/index";
import User from "@src/models/User";
import request from "supertest";

// @ts-ignore

jest.mock("@src/config/passport/strategy/jwt");
jest.mock("@src/features/db");

describe("GET /users/me", () => {
  describe("Without image", () => {
    beforeEach(async () => {
      const myUser = new User({
        email: "example@example.com",
        name: "Example",
      });
      await myUser.save();
    });
    afterEach(async () => {
      await User.deleteMany({});
    });

    it("Should return 200", async () => {
      const res = await request(app)
        .get("/users/me")
        .set("Authorization", "Bearer user");

      expect(res.status).toBe(200);
    });
    it("Should return name", async () => {
      const res = await request(app)
        .get("/users/me")
        .set("Authorization", "Bearer user");

      expect(res.body).toEqual(expect.objectContaining({ name: "Example" }));
    });
    it("Should return email", async () => {
      const res = await request(app)
        .get("/users/me")
        .set("Authorization", "Bearer user");

      expect(res.body).toEqual(
        expect.objectContaining({ email: "example@example.com" })
      );
    });
    it("Should return image fallback", async () => {
      const res = await request(app)
        .get("/users/me")
        .set("Authorization", "Bearer user");

      expect(res.body).toEqual(
        expect.objectContaining({ image: "https://place-hold.it/100" })
      );
    });
  });

  describe("With image", () => {
    beforeEach(async () => {
      const myUser = new User({
        email: "example@example.com",
        name: "Example",
        image: "https://example.com/image.jpg",
      });
      await myUser.save();
    });
    afterEach(async () => {
      await User.deleteMany({});
    });

    it("Should return image fallback", async () => {
      const res = await request(app)
        .get("/users/me")
        .set("Authorization", "Bearer user");

      expect(res.body).toEqual(
        expect.objectContaining({ image: "https://example.com/image.jpg" })
      );
    });
  });
});
