import app from "@src/index";
import Game from "@src/models/Game";
import GameTag from "@src/models/GameTag";
import Publisher from "@src/models/Publisher";
import User from "@src/models/User";
import Vote from "@src/models/Vote";
import mongoose from "mongoose";
import request from "supertest";

// @ts-ignore

jest.mock("@src/config/passport/strategy/jwt");
jest.mock("@src/features/db");

describe("GET /games/{id}", () => {
  it("should return 404", async () => {
    const res = await request(app)
      .get("/games/673f93271fd83bd6e538e168")
      .set("Authorization", "Bearer user");
    expect(res.status).toBe(404);
  });

  describe("with base game data", () => {
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

    it("should return 200", async () => {
      const res = await request(app)
        .get("/games/673f93271fd83bd6e538e168")
        .set("Authorization", "Bearer user");
      expect(res.status).toBe(200);
    });
    it("should return a game", async () => {
      const res = await request(app)
        .get("/games/673f93271fd83bd6e538e168")
        .set("Authorization", "Bearer user");

      expect(res.body).toBeInstanceOf(Object);
    });
    it("should return the game name", async () => {
      const res = await request(app)
        .get("/games/673f93271fd83bd6e538e168")
        .set("Authorization", "Bearer user");

      expect(res.body).toEqual(expect.objectContaining({ name: "D&D" }));
    });

    it("should return the game publish year", async () => {
      const res = await request(app)
        .get("/games/673f93271fd83bd6e538e168")
        .set("Authorization", "Bearer user");

      expect(res.body).toEqual(expect.objectContaining({ year: 1983 }));
    });

    it("should return the game description", async () => {
      const res = await request(app)
        .get("/games/673f93271fd83bd6e538e168")
        .set("Authorization", "Bearer user");

      expect(res.body).toEqual(
        expect.objectContaining({ description: "Dungeons and Dragons" })
      );
    });
    it("should return the game cover image", async () => {
      const res = await request(app)
        .get("/games/673f93271fd83bd6e538e168")
        .set("Authorization", "Bearer user");

      expect(res.body).toEqual(
        expect.objectContaining({ image: "https://example.com/dnd.jpg" })
      );
    });

    it("should return the game cover image as full as fallback", async () => {
      const res = await request(app)
        .get("/games/673f93271fd83bd6e538e168")
        .set("Authorization", "Bearer user");

      expect(res.body).toEqual(
        expect.objectContaining({
          fullImage: "https://example.com/dnd.jpg",
        })
      );
    });
    it("should not return the game long description", async () => {
      const res = await request(app)
        .get("/games/673f93271fd83bd6e538e168")
        .set("Authorization", "Bearer user");

      expect(res.body).not.toHaveProperty("longDescription");
    });
  });

  describe("with complete data", () => {
    beforeAll(async () => {
      const TSR = new Publisher({
        _id: "673f93271fd83bd6e538e160",
        name: "TSR",
      });
      await TSR.save();
      const DnD = new Game({
        _id: "673f93271fd83bd6e538e168",
        name: "D&D",
        publishYear: 1983,
        description: "Dungeons and Dragons",
        image: "https://example.com/dnd.jpg",
        imageFull: "https://example.com/dnd-full.jpg",
        longDescription: "A long description",
        publisher: TSR._id,
      });
      await DnD.save();
    });
    afterAll(async () => {
      await Game.deleteMany({});
    });

    it("should return the full image", async () => {
      const res = await request(app)
        .get("/games/673f93271fd83bd6e538e168")
        .set("Authorization", "Bearer user");

      expect(res.body).toEqual(
        expect.objectContaining({
          fullImage: "https://example.com/dnd-full.jpg",
        })
      );
    });
    it("should return the long description", async () => {
      const res = await request(app)
        .get("/games/673f93271fd83bd6e538e168")
        .set("Authorization", "Bearer user");

      expect(res.body).toEqual(
        expect.objectContaining({
          longDescription: "A long description",
        })
      );
    });
    it("should return the publisher", async () => {
      const res = await request(app)
        .get("/games/673f93271fd83bd6e538e168")
        .set("Authorization", "Bearer user");

      expect(res.body).toEqual(
        expect.objectContaining({
          publisher: "TSR",
        })
      );
    });
  });

  describe("with tags", () => {
    beforeAll(async () => {
      const tag = new GameTag({
        _id: "673f93271fd83bd6e538e169",
        name: "Fantasy",
      });
      await tag.save();
      const DnD = new Game({
        _id: "673f93271fd83bd6e538e168",
        name: "D&D",
        publishYear: 1983,
        description: "Dungeons and Dragons",
        image: "https://example.com/dnd.jpg",
        imageFull: "https://example.com/dnd-full.jpg",
        longDescription: "A long description",
        tags: [tag._id],
      });
      await DnD.save();
    });
    afterAll(async () => {
      await Game.deleteMany({});
      await GameTag.deleteMany({});
    });

    it("should return tags", async () => {
      const res = await request(app)
        .get("/games/673f93271fd83bd6e538e168")
        .set("Authorization", "Bearer user");

      expect(res.body).toEqual(
        expect.objectContaining({
          tags: ["Fantasy"],
        })
      );
    });
  });
  describe("with votes", () => {
    beforeAll(async () => {
      const { user1, user2, user3 } = {
        user1: new mongoose.Types.ObjectId(),
        user2: new mongoose.Types.ObjectId(),
        user3: new mongoose.Types.ObjectId(),
      };
      await User.create([
        { id: user1, email: "one@example.com" },
        { id: user2, email: "two@example.com" },
        { id: user3, email: "three@example.com" },
      ]);
      await Vote.create([
        { value: 1, game: "673f93271fd83bd6e538e168", user: user1 },
        { value: 4, game: "673f93271fd83bd6e538e168", user: user2 },
        { value: 5, game: "673f93271fd83bd6e538e168", user: user3 },
      ]);
      const DnD = new Game({
        _id: "673f93271fd83bd6e538e168",
        name: "D&D",
        publishYear: 1983,
        description: "Dungeons and Dragons",
        image: "https://example.com/dnd.jpg",
        imageFull: "https://example.com/dnd-full.jpg",
        longDescription: "A long description",
      });
      await DnD.save();
    });
    afterAll(async () => {
      await Game.deleteMany({});
      await User.deleteMany({});
      await Vote.deleteMany({});
    });

    it("should return vote average", async () => {
      const res = await request(app)
        .get("/games/673f93271fd83bd6e538e168")
        .set("Authorization", "Bearer user");

      expect(res.body).toEqual(
        expect.objectContaining({
          vote: 3.3,
        })
      );
    });
  });
});
