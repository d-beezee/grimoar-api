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
    const voteAverages = await Vote.aggregate([
      {
        $group: {
          _id: "$game",
          averageVote: { $avg: "$value" },
        },
      },
    ]);

    // Crea una mappa per accedere velocemente alla media
    const voteMap = voteAverages.reduce((map, vote) => {
      map[vote._id.toString()] = vote.averageVote;
      return map;
    }, {} as Record<string, number>);

    // Step 2: Recupera tutti i giochi e aggiungi la media
    const games = await Game.find();
    if (!games) return [];
    return games.map((game) => ({
      id: game.id,
      name: game.name,
      description: game.description,
      year: game.publishYear,
      image: game.image,
      vote: voteMap[game.id] ?? undefined, // undefined se non ci sono voti
    }));
  }
};

export default route;
