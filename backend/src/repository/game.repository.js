export default function (collection) {
  async function findOne(filter) {
    return await collection.findOne(filter);
  }

  return { findOne };
}
