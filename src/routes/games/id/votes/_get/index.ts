import Game from "@src/models/Game";
import Vote from "@src/models/Vote";
import { operations } from "@src/schema";
import { Request, Response } from "express";

const route = async (
  req: Request,
  res: Response<
    | operations["get-games-id-votes"]["responses"]["200"]["content"]["application/json"]
    | operations["get-games-id-votes"]["responses"]["404"]["content"]["application/json"]
  >
) => {
  if (!(await gameExists())) {
    res.status(404).json({ message: "Game not found" });
    return;
  }
  const vote = await getCurrentUserVote();
  if (!vote) {
    res.status(404).json({ message: "Vote not found" });
    return;
  }
  res.status(200).json({
    vote: vote.value,
  });
  return;

  async function gameExists() {
    return await Game.exists({ _id: req.params.id });
  }

  async function getCurrentUserVote() {
    if (!req.user) return undefined;
    return await Vote.findOne({
      game: req.params.id,
      user: req.user._id,
    });
  }
};

export default route;
