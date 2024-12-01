import Game from "@src/models/Game";
import Vote from "@src/models/Vote";
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
    // Step 1: Ottieni la media dei voti per ogni gioco
    const voteStats = await Vote.aggregate([
      {
        $group: {
          _id: "$game",
          averageVote: { $avg: "$value" },
          voteDistribution: {
            $push: "$value",
          },
        },
      },
    ]);

    // Crea una mappa per accedere velocemente alla media
    const voteMap = voteStats.reduce((map, vote) => {
      map[vote._id.toString()] = parseFloat(vote.averageVote.toFixed(1));
      return map;
    }, {} as Record<string, number>);

    const distributionMap = voteStats.reduce((map, vote) => {
      const distribution: Record<1 | 2 | 3 | 4 | 5, number> = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };
      vote.voteDistribution.forEach((value: number) => {
        if ([1, 2, 3, 4, 5].includes(value))
          distribution[value as 1 | 2 | 3 | 4 | 5]++;
      });

      map[vote._id.toString()] = distribution;
      return map;
    }, {} as Record<string, { 1: number; 2: number; 3: number; 4: number; 5: number }>);

    // Step 2: Recupera tutti i giochi e aggiungi la media
    const games = await Game.find();
    if (!games) return [];
    return games.map((game) => ({
      id: game.id,
      name: game.name,
      description: game.description,
      year: game.publishYear,
      image: game.image,
      vote: voteMap[game.id] ?? undefined,
      voteDistribution: distributionMap[game.id] ?? undefined,
    }));
  }
};

export default route;
