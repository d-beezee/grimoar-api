import app from "@src/index";
import Game, { IGame } from "@src/models/Game";
import typed, * as mockingooseDefault from "mockingoose";
import { Document } from "mongoose";
import request from "supertest";

// @ts-ignore
const mockingoose = mockingooseDefault as typeof typed;

jest.mock("@src/config/passport/strategy/jwt");

describe("GET /games/", () => {
  it("should return 200 OK", async () => {
    const res = await request(app)
      .get("/games")
      .set("Authorization", "Bearer user");
    expect(res.status).toBe(200);
  });

  describe("with a list of games", () => {
    beforeAll(() => {
      mockingoose(Game).toReturn(
        [
          {
            name: "D&D",
            publishYear: 1983,
            description: "Dungeons and Dragons",
            image: "https://example.com/dnd.jpg",
          },
          {
            name: "Vampire",
            publishYear: 1991,
            description: "Vampire: The Masquerade",
            image: "https://example.com/vtm.jpg",
          },
        ] satisfies Omit<IGame, keyof Document>[],
        "find"
      );
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
