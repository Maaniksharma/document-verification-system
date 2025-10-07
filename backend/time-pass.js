/**
 * Usage:
 *   node testAssignedDocRequests.js <officerId> [mongoUri]
 *
 * Example:
 *   node testAssignedDocRequests.js 64b6f8c2a1e5f4d2c3e9b123 mongodb://localhost:27017/yourdb
 */

import mongoose from "mongoose";

const DOCUMENT_REQUESTS_COLL = "documentrequests"; // adjust if actual collection name differs (lowercased)
const READERS_COLL = "readers"; // usually model "Readers" maps to "readers"

async function main() {
  // const args = process.argv.slice(2);
  // if (args.length < 1) {
  //   console.error(
  //     "Usage: node testAssignedDocRequests.js <officerId> [mongoUri]"
  //   );
  //   process.exit(1);
  // }

  const officerIdRaw = "68808a61d0c5662b4019e2b2";
  const mongoUri = "mongodb://localhost:27017/Document-verification-system"; // fallback DB

  // Validate and convert officerId
  if (!mongoose.isValidObjectId(officerIdRaw)) {
    console.error("Invalid officerId:", officerIdRaw);
    process.exit(1);
  }
  const officerId = new mongoose.Types.ObjectId(officerIdRaw);

  // Connect
  await mongoose.connect(mongoUri, { autoIndex: false });
  const db = mongoose.connection.db;

  try {
    const pipeline = [
      {
        $match: {
          "values.assigned-officer": officerId,
        },
      },
      {
        $set: {
          values: {
            $filter: {
              input: "$values",
              as: "item",
              cond: { $eq: ["$$item.assigned-officer", officerId] },
            },
          },
        },
      },
      {
        $lookup: {
          from: READERS_COLL,
          let: { rid: "$reader-id" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$rid"] } } },
            { $project: { email: 1, _id: 0 } },
          ],
          as: "reader",
        },
      },
      {
        $unwind: { path: "$reader", preserveNullAndEmptyArrays: false },
      },
      {
        $project: {
          name: 1,
          fields: 1,
          values: 1,
          reader: 1,
        },
      },
      { $limit: 50 },
    ];

    console.log("Running aggregation with officerId =", officerId.toString());
    const cursor = db.collection(DOCUMENT_REQUESTS_COLL).aggregate(pipeline);
    const results = await cursor.toArray();

    if (results.length === 0) {
      console.log("No matching documents found.");
    } else {
      console.log("Results:");
      console.dir(results, { depth: 4, colors: true });
    }
  } catch (err) {
    console.error("Error during aggregation:", err);
  } finally {
    await mongoose.disconnect();
  }
}

main().catch((e) => {
  console.error("Fatal error:", e);
  process.exit(1);
});
