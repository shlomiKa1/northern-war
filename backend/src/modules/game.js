import z from "zod";

export const schemaNewGame = z.object({
  playerName: z.string().trim().min(1),
});

export const schemaReinforce = z.object({
  territoryId: z.number().int(),
});
