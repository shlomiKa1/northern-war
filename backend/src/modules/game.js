import z from "zod";

export const schemaNewGame = z.object({
  playerName: z.string().trim().min(1),
});

export const schemaReinforce = z.object({
  territoryId: z.number().int(),
});

export const schemaAttack = z.object({
  fromId: z.number().int().default(null),
  toId: z.number().int().default(null),
  soldiers: z.number().int().min(1).default(null),
  skip: z.boolean().default(false),
});

export const schemaMove = z.object({
  fromId: z.number().int(),
  toId: z.number().int(),
  soldiers: z.number().int().min(1),
});
