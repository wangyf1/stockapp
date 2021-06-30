const { MongoClient } = require("mongodb")


function getClient() {
  return new MongoClient(
    "mongodb+srv://niubi:123@cluster0.lfrkz.mongodb.net/niubi?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
}


function query(client, dbName, cname, query) {
  const cursor = client.db(dbName).collection(cname).aggregate(query)
  return cursor
}


async function insert(client, dbName, cname, data, bulkInsert = false) {
  try {
    if (bulkInsert) {
      const res = await client.db(dbName).collection(cname).insertMany(
        data, { ordered: true }
      )
      // console.debug(`${res.insertedCount} documents were inserted to ${cname}`)
    } else {
      const res = await client.db(dbName).collection(cname).insertOne(data)
      // console.debug(`Document inserted to ${cname}`)
    }
  } catch (e) {
    console.error("Insert failed due to unexpected error: ", e.message)
  }
}


async function index(client, dbName, cname, indexes, isUnique = false) {
  try {
    const res = await client.db(dbName).collection(cname).createIndex(
      indexes, { unique: isUnique }
    )
    console.debug(`Index ${JSON.stringify(indexes)} created for ${cname}`)
  } catch (e) {
    console.error("Indexing failed to create index due to unexpected error: ", e.message)
  }
}


async function update(client, dbName, cname, filters, data, upsert = true) {
  try {
    const res = await client.db(dbName).collection(cname).updateOne(
      filters, { $set: data }, { upsert: upsert }
    )
    // console.debug(`Data has been updated for ${filters} in ${cname}`)
  } catch (e) {
    console.error("Update failed to update due to unexpected error: ", e)
  }
}


module.exports = {
  getClient: getClient,
  insert: insert,
  update: update,
  index: index,
  query: query,
}
