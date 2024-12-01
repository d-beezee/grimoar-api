import app from "@src/index";
import Game from "@src/models/Game";
import Vote from "@src/models/Vote";
import request from "supertest";

// @ts-ignore

jest.mock("@src/config/passport/strategy/jwt");
jest.mock("@src/features/db");

describe("GET /games/", () => {
  it("should return 200 OK", async () => {
    const res = await request(app)
      .get("/games")
      .set("Authorization", "Bearer user");
    expect(res.status).toBe(200);
  });

  describe("with a list of games", () => {
    beforeAll(async () => {
      const DnD = new Game({
        _id: "5f8f8b3b7f3b4b001f3f4b1b",
        name: "D&D",
        publishYear: 1983,
        description: "Dungeons and Dragons",
        image: "https://example.com/dnd.jpg",
      });
      await DnD.save();
      const Vampire = new Game({
        _id: "5f8f8b3b7f3b4b001f3f4b1c",
        name: "Vampire",
        publishYear: 1991,
        description: "Vampire: The Masquerade",
        image: "https://example.com/vtm.jpg",
      });
      await Vampire.save();
    });
    it("should return the list of games", async () => {
      const res = await request(app)
        .get("/games")
        .set("Authorization", "Bearer user");

      expect(res.body).toHaveLength(2);
    });
    it("should return the game names", async () => {
      const res = await request(app)
        .get("/games")
        .set("Authorization", "Bearer user");

      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ name: "D&D" }),
          expect.objectContaining({ name: "Vampire" }),
        ])
      );
    });

    it("should return the game publish year", async () => {
      const res = await request(app)
        .get("/games")
        .set("Authorization", "Bearer user");

      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ year: 1983 }),
          expect.objectContaining({ year: 1991 }),
        ])
      );
    });

    it("should return the game description", async () => {
      const res = await request(app)
        .get("/games")
        .set("Authorization", "Bearer user");

      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ description: "Dungeons and Dragons" }),
          expect.objectContaining({ description: "Vampire: The Masquerade" }),
        ])
      );
    });
    it("should return the game cover image", async () => {
      const res = await request(app)
        .get("/games")
        .set("Authorization", "Bearer user");

      expect(res.body).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ image: "https://example.com/dnd.jpg" }),
          expect.objectContaining({ image: "https://example.com/vtm.jpg" }),
        ])
      );
    });

    describe("with a voted game", () => {
      beforeAll(async () => {
        const vote1 = new Vote({
          game: "5f8f8b3b7f3b4b001f3f4b1b",
          user: "000000000000000000000001",
          value: 5,
        });
        await vote1.save();
        const vote2 = new Vote({
          game: "5f8f8b3b7f3b4b001f3f4b1b",
          user: "000000000000000000000001",
          value: 4,
        });
        await vote2.save();
      });

      it("should return the game votes average", async () => {
        const res = await request(app)
          .get("/games")
          .set("Authorization", "Bearer user");

        expect(res.body).toEqual(
          expect.arrayContaining([
            expect.objectContaining({ name: "D&D" }),
            expect.objectContaining({ name: "Vampire" }),
          ])
        );
        const dnd = res.body.find((game: any) => game.name === "D&D");
        expect(dnd).toHaveProperty("vote", 4.5);
        const vampire = res.body.find((game: any) => game.name === "Vampire");
        expect(vampire).not.toHaveProperty("vote");
      });
    });
  });
});
