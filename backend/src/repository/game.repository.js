export default function (collection) {
  async function findOne(filter) {
    return await collection.findOne(filter);
  }

  async function create(data) {
    return await collection.insertOne(data);
  }
  return { findOne, create };
}
