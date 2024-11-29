import app from "@src/index";
import User from "@src/models/User";
import request from "supertest";

// @ts-ignore

jest.mock("@src/config/passport/strategy/jwt");
jest.mock("@src/features/db");

describe("DELETE /users/me", () => {
  beforeEach(async () => {
    const myUser = new User({
      email: "example@example.com",
    });
    await myUser.save();
  });
  afterEach(async () => {
    await User.deleteMany({});
  });

  it("Should return 200", async () => {
    const res = await request(app)
      .delete("/users/me")
      .set("Authorization", "Bearer user");

    expect(res.status).toBe(200);
  });
  it("Should delete user", async () => {
    const res = await request(app)
      .delete("/users/me")
      .set("Authorization", "Bearer user");

    expect(res.status).toBe(200);

    expect(await User.findOne({ email: "example@example.com" })).toBeNull();
  });
});
