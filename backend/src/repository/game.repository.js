import { ObjectId } from "mongodb";

export default function createGameRepository(collection) {
  async function findOne(filter) {
    return await collection.findOne(filter);
  }

  async function create(data) {
    return await collection.insertOne(data);
  }

  async function update(id, data) {
    return await collection.findOneAndUpfate(
      { _id: new ObjectId(id) },
      { $set: data },
    );
  }

  return { findOne, create, update };
}
