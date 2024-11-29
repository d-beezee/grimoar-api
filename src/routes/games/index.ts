import Game from "@src/models/Game";
import { operations } from "@src/schema";
import { Request, Response } from "express";

const route = async (
  req: Request,
  res: Response<
    operations["get-games"]["responses"]["200"]["content"]["application/json"]
  >
) => {
  const games = await getGames();

  res.json(games);
  return;

  async function getGames() {
    const games = await Game.find();
    if (!games) return [];
    return games.map((game) => ({
      id: game.id,
      name: game.name,
      description: game.description,
      year: game.publishYear,
      image: game.image,
    }));
  }
};

export default route;
