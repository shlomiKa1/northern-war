import fs from "fs/promises";

export async function loadJson(fileName = "map.js") {
  const data = JSON.parse(await fs.readFile(fileName, "utf-8"));
  return data;
}
