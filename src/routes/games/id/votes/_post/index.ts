import Game from "@src/models/Game";
import Vote from "@src/models/Vote";
import { operations } from "@src/schema";
import { Request, Response } from "express";

type RequestParams = operations["post-games-id-votes"]["parameters"]["path"];

type RequestBody = NonNullable<
  operations["post-games-id-votes"]["requestBody"]
>["content"]["application/json"];

const route = async (
  req: Request<RequestParams, any, RequestBody>,
  res: Response<
    | operations["post-games-id-votes"]["responses"]["201"]["content"]["application/json"]
    | operations["post-games-id-votes"]["responses"]["404"]["content"]["application/json"]
  >
) => {
  if (!(await gameExists())) {
    res.status(404).json({ message: "Game not found" });
    return;
  }

  const vote = await submitVote();

  res.status(201).json({
    vote: vote.value,
  });
  return;

  async function gameExists() {
    return await Game.exists({ _id: req.params.id });
  }

  async function submitVote() {
    if (!req.user) throw new Error("User not found");
    await Vote.updateOne(
      { game: req.params.id, user: req.user._id },
      { $set: { value: req.body.vote } },
      { upsert: true }
    );

    const res = await Vote.findOne({
      game: req.params.id,
      user: req.user._id,
    });

    if (!res) throw new Error("Vote not found");
    return res;
  }
};

export default route;
