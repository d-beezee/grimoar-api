import app from "@src/index";
import Game from "@src/models/Game";
import Vote from "@src/models/Vote";
import request from "supertest";

// @ts-ignore

jest.mock("@src/config/passport/strategy/jwt");
jest.mock("@src/features/db");

describe("POST /games/{id}/votes", () => {
  it("should return 404", async () => {
    const res = await request(app)
      .post("/games/673f93271fd83bd6e538e168/votes")
      .send({ vote: 1 })
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

    afterEach(async () => {
      await Vote.deleteMany({});
    });

    it("should return 201", async () => {
      const res = await request(app)
        .post("/games/673f93271fd83bd6e538e168/votes")
        .send({ vote: 1 })
        .set("Authorization", "Bearer user");
      expect(res.status).toBe(201);
    });
    it("should return inserted vote", async () => {
      const res = await request(app)
        .post("/games/673f93271fd83bd6e538e168/votes")
        .send({ vote: 5 })
        .set("Authorization", "Bearer user");

      expect(res.body).toEqual(expect.objectContaining({ vote: 5 }));
    });
    it("should add vote to votelist", async () => {
      await request(app)
        .post("/games/673f93271fd83bd6e538e168/votes")
        .send({ vote: 5 })
        .set("Authorization", "Bearer user");

      const res = await request(app)
        .get("/games/673f93271fd83bd6e538e168")
        .set("Authorization", "Bearer user");

      expect(res.body).toEqual(expect.objectContaining({ vote: 5 }));
    });
    it("should add vote as current user", async () => {
      await request(app)
        .post("/games/673f93271fd83bd6e538e168/votes")
        .send({ vote: 3 })
        .set("Authorization", "Bearer user");

      const res = await request(app)
        .get("/games/673f93271fd83bd6e538e168/votes")
        .set("Authorization", "Bearer user");

      expect(res.body).toEqual(expect.objectContaining({ vote: 3 }));
    });

    it("should overwrite vote when called twice", async () => {
      await request(app)
        .post("/games/673f93271fd83bd6e538e168/votes")
        .send({ vote: 3 })
        .set("Authorization", "Bearer user");

      const firstRunSingle = await request(app)
        .get("/games/673f93271fd83bd6e538e168/votes")
        .set("Authorization", "Bearer user");

      expect(firstRunSingle.body).toEqual(expect.objectContaining({ vote: 3 }));

      const firstRunAverage = await request(app)
        .get("/games/673f93271fd83bd6e538e168")
        .set("Authorization", "Bearer user");

      expect(firstRunAverage.body).toEqual(
        expect.objectContaining({ vote: 3 })
      );

      await request(app)
        .post("/games/673f93271fd83bd6e538e168/votes")
        .send({ vote: 5 })
        .set("Authorization", "Bearer user");

      const secondRunSingle = await request(app)
        .get("/games/673f93271fd83bd6e538e168/votes")
        .set("Authorization", "Bearer user");

      expect(secondRunSingle.body).toEqual(
        expect.objectContaining({ vote: 5 })
      );

      const secondRunAverage = await request(app)
        .get("/games/673f93271fd83bd6e538e168")
        .set("Authorization", "Bearer user");

      expect(secondRunAverage.body).toEqual(
        expect.objectContaining({ vote: 5 })
      );
    });
  });
});
