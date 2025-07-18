import { createToken } from "../utils/jwt.js";
import courts from "../models/courts.js";
import documentRequests from "../models/documentRequests.js";
import readers from "../models/readers.js";
import officers from "../models/officers.js";
import { hashPassword } from "../utils/bcrypt.js";
import { ObjectId } from "mongodb";

export function Login(req, res, next) {
  const { email, password } = req.body;
  if (email != "admin@gmail.com") {
    res.status(401).json({ message: "Invalid email" });
    return;
  }
  if (password != "123456") {
    res.status(401).json({ message: "Invalid password" });
    return;
  }
  const payload = { email, role: "admin" };
  const jwtToken = createToken({ payload, config: { expiresIn: "30s" } });
  res.cookie("token", jwtToken, { httpOnly: true });
  res.json({ message: "success" });
}

export async function createCourt(req, res, next) {
  const courtDetail = {
    name: req.body["court-name"],
    location: req.body.location,
    description: req.body.description,
  };
  try {
    const { _id } = await courts.insertOne(courtDetail);
    res
      .status(201)
      .json({
        message: "court created successfully",
        courtDetail: { ...courtDetail, id: _id },
      });
  } catch (e) {
    next(e);
  }
}

export async function fetchCourtsPages(req, res, next) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

  try {
    const [results, totalItems] = await Promise.all([
      courts
        .find()
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit),
      courts.countDocuments(),
    ]);
    const formattedData = await Promise.all(
      results.map(async (courtData) => {
        const courtSignatures = await documentRequests.find({
          "reader-id": {
            $in: courtData.readers,
          },
          status: 2,
        });
        return {
          id: courtData._id,
          name: courtData.name,
          description: courtData.description,
          totalReaders: courtData.readers.length,
          totalOfficers: courtData.officers.length,
          documentsSigned: courtSignatures.length,
        };
      })
    );
    res.json({
      data: formattedData,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        pageSize: limit,
        hasNextPage: page * limit < totalItems,
        hasPrevPage: page > 1,
      },
    });
  } catch (e) {
    next(e);
  }
}

export async function fetchAdminStats(req, res, next) {
  try {
    const [totalCourts, totalReaders, totalOfficers, totalSignatures] =
      await Promise.all([
        courts.countDocuments(),
        readers.countDocuments(),
        officers.countDocuments(),
        documentRequests.countDocuments({ status: 2 }),
      ]);
    res.json({
      totalCourts,
      totalReaders,
      totalOfficers,
      totalSignatures,
    });
  } catch (e) {
    next(e);
  }
}

export async function createMember(req, res, next) {
  const role = req.body.role;
  const courtId = req.body.courtId;
  try {
    if (role == "officer") {
      const { _id: insertedId } = await officers.insertOne({
        email: req.body.email,
        password: await hashPassword(req.body.password),
      });
      await courts.updateOne(
        { _id: new ObjectId(courtId) },
        { $push: { officers: insertedId } }
      );
    } else if (role == "reader") {
      const { _id: insertedId } = await readers.insertOne({
        email: req.body.email,
        password: await hashPassword(req.body.password),
      });
      await courts.updateOne(
        { _id: new ObjectId(courtId) },
        { $push: { readers: insertedId } }
      );
    }
    res.json({
      message: `${role}  created successfully`,
    });
  } catch (e) {
    next(e);
  }
}

export async function fetchCourtDetails(req, res, next) {
  const id = req.params.id;
  try {
    const courtDetails = await courts.findOne({ _id: id });
    if (!courtDetails) {
      return res.status(404).json({ message: "Court not found" });
    }
    const [documentSigned, documentsYetToSigned] = await Promise.all([
      documentRequests.countDocuments({
        "reader-id": { $in: courtDetails.readers },
        status: 2,
      }),
      documentRequests.countDocuments({
        "reader-id": { $in: courtDetails.readers },
        status: 1,
      }),
    ]);

    res.json({
      name: courtDetails.name,
      location: courtDetails.location,
      description: courtDetails.description,
      totalReaders: courtDetails.readers.length,
      totalOfficers: courtDetails.officers.length,
      documentSigned,
      documentsYetToSigned,
    });
  } catch (e) {
    next(e);
  }
}

export async function fetchReaderPages(req, res, next) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
  const courtId = req.params.id;
  if (!courtId) {
    res.status(400).json({ message: "court id not provided" });
    return;
  }
  try {
    const court = await courts.findById(courtId);
    const readersArray = court.readers;
    const totalItems = readersArray.length;
    const readersData = await readers
      .find({
        _id: {
          $in: readersArray,
        },
      })
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);
    const formattedData = await Promise.all(
      readersData.map(async (readerData) => {
        const documentsIssued = await documentRequests.countDocuments({
          "reader-id": readerData._id,
        });
        const documentsVerified = await documentRequests.countDocuments({
          "reader-id": readerData._id,
          status: 2,
        });

        return {
          id: readerData._id,
          joiningDate: readerData.createdAt,
          documentsIssued,
          documentsVerified,
          email: readerData.email,
        };
      })
    );

    res.json({
      data: formattedData,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        pageSize: limit,
        hasNextPage: page * limit < totalItems,
        hasPrevPage: page > 1,
      },
    });
  } catch (e) {
    next(e);
  }
}

export async function fetchOfficerPages(req, res, next) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const sortBy = req.query.sortBy || "createdAt";
  const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
  const courtId = req.params.id;
  if (!courtId) {
    res.status(400).json({ message: "court id not provided" });
    return;
  }
  try {
    const court = await courts.findById(courtId);
    const officersArray = court.officers;
    const totalItems = officersArray.length;
    const officersData = await officers
      .find({
        _id: {
          $in: officersArray,
        },
      })
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limit);
    const formattedData = await Promise.all(
      officersData.map(async (officerData) => {
        const documentsSigned = await documentRequests.countDocuments({
          "reader-id": officerData._id,
          status: 2,
        });

        return {
          id: officerData._id,
          joiningDate: officerData.createdAt,
          documentsSigned,
          email: officerData.email,
        };
      })
    );

    res.json({
      data: formattedData,
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
        pageSize: limit,
        hasNextPage: page * limit < totalItems,
        hasPrevPage: page > 1,
      },
    });
  } catch (e) {
    next(e);
  }
}
