import Game from "@src/models/Game";
import Vote from "@src/models/Vote";
import { operations } from "@src/schema";
import { Request, Response } from "express";
import mongoose from "mongoose";

const route = async (
  req: Request,
  res: Response<
    | operations["get-games-id"]["responses"]["200"]["content"]["application/json"]
    | operations["get-games-id"]["responses"]["404"]["content"]["application/json"]
  >
) => {
  const game = await getGame();
  const vote = await getVote();

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
    vote: vote?.vote,
    voteDistribution: vote?.distribution,
  });
  return;

  async function getGame() {
    const game = await Game.findOne({ _id: req.params.id })
      .populate("tags")
      .populate("publisher");
    if (!game) return false;
    return game;
  }

  async function getVote() {
    const votes = await Vote.aggregate([
      {
        $match: {
          game: new mongoose.Types.ObjectId(req.params.id), // Filtro per il game specifico
        },
      },
      {
        $group: {
          _id: null, // Gruppo unico, dato che ci interessa solo la media
          averageValue: { $avg: "$value" }, // Calcola la media dei valori
          voteDistribution: {
            $push: "$value",
          },
        },
      },
    ]);

    if (!votes.length) return undefined;

    const distribution: Record<1 | 2 | 3 | 4 | 5, number> = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    votes[0].voteDistribution.forEach((value: number) => {
      if ([1, 2, 3, 4, 5].includes(value))
        distribution[value as 1 | 2 | 3 | 4 | 5]++;
    });

    return {
      vote: parseFloat(votes[0].averageValue.toFixed(1)),
      distribution,
    };
  }
};

export default route;
