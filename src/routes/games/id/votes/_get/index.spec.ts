import app from "@src/index";
import Game from "@src/models/Game";
import User from "@src/models/User";
import Vote from "@src/models/Vote";
import request from "supertest";

// @ts-ignore

jest.mock("@src/config/passport/strategy/jwt");
jest.mock("@src/features/db");

describe("POST /games/{id}/votes", () => {
  it("should return 404", async () => {
    const res = await request(app)
      .get("/games/673f93271fd83bd6e538e168/votes")
      .set("Authorization", "Bearer user");
    expect(res.status).toBe(404);
  });

  describe("with game existing", () => {
    beforeAll(async () => {
      const DnD = new Game({
        _id: "673f93271fd83bd6e538e168",
        name: "D&D",
        publishYear: 1983,
        description: "Dungeons and Dragons",
        image: "https://example.com/dnd.jpg",
      });
      await DnD.save();
    });
    afterAll(async () => {
      await Game.deleteMany({});
    });

    it("should return 404", async () => {
      const res = await request(app)
        .get("/games/673f93271fd83bd6e538e168/votes")
        .set("Authorization", "Bearer user");
      expect(res.status).toBe(404);
    });

    describe("if current user voted", () => {
      beforeAll(async () => {
        const user = new User({
          _id: "000000000000000000000000",
          email: "example@example.com",
        });
        await user.save();
        const vote = new Vote({
          game: "673f93271fd83bd6e538e168",
          value: 3,
          user: user._id,
        });
        await vote.save();
      });
      afterAll(async () => {
        await Vote.deleteMany({});
      });

      it("should return 200", async () => {
        const res = await request(app)
          .get("/games/673f93271fd83bd6e538e168/votes")
          .set("Authorization", "Bearer user");
        expect(res.status).toBe(200);
      });

      it("should return the vote", async () => {
        const res = await request(app)
          .get("/games/673f93271fd83bd6e538e168/votes")
          .set("Authorization", "Bearer user");
        expect(res.body).toEqual(expect.objectContaining({ vote: 3 }));
      });
    });
  });
});
