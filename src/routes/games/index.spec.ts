import app from "@src/index";
import Game from "@src/models/Game";
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
        name: "D&D",
        publishYear: 1983,
        description: "Dungeons and Dragons",
        image: "https://example.com/dnd.jpg",
      });
      await DnD.save();
      const Vampire = new Game({
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
  });
});
