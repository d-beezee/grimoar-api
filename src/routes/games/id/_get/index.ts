import Game from "@src/models/Game";
import { operations } from "@src/schema";
import { Request, Response } from "express";

const route = async (
  req: Request,
  res: Response<
    | operations["get-games-id"]["responses"]["200"]["content"]["application/json"]
    | operations["get-games-id"]["responses"]["404"]["content"]["application/json"]
  >
) => {
  const game = await getGame();

  if (!game) {
    res.status(404).json({ message: "Game not found" });
    return;
  }

  res.json({
    id: game.id,
    name: game.name,
    year: game.publishYear,
    description: game.description,
    image: game.image,
    fullImage: game.imageFull ? game.imageFull : game.image,
    longDescription: game.longDescription,
    tags: game.tags ? game.tags.map((tag) => tag.name) : undefined,
    publisher: game.publisher ? game.publisher.name : "Unknown",
  });
  return;

  async function getGame() {
    const game = await Game.findOne({ _id: req.params.id })
      .populate("tags")
      .populate("publisher");
    console.log(game);
    if (!game) return false;
    return game;
  }
};

export default route;
