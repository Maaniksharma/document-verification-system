import officers from "../models/officers.js";
import bcrypt from "bcrypt";
import documentRequests from "../models/documentRequests.js";
import { createToken } from "../utils/jwt.js";
import courts from "../models/courts.js";
import mongoose from "mongoose";
import { status } from "../constants/status.js";

export async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const officer = await officers.findOne({ email });
    if (!officer) {
      res.status(401).json({ message: "Invalid Email" });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, officer.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Password" });
    }
    const payload = { email, role: "officer" };
    const jwtToken = createToken({ payload, config: { expiresIn: "30h" } });
    res.cookie("token", jwtToken, { httpOnly: true });
    res.json({ message: "login successfull", id: officer._id });
  } catch (e) {
    next(e);
  }
}

export async function createSignature(req, res, next) {
  try {
    const { id } = req.params;
    const path = req.file.path;
    await officers.updateOne(
      { _id: id },
      {
        $push: {
          "uploaded-signs": {
            path,
          },
        },
      }
    );
    res.json({ message: "signature created Successfully" });
  } catch (e) {
    next(e);
  }
}

export async function getSignatures(req, res, next) {
  try {
    const { id } = req.params;
    const result = await officers.findOne({ _id: id });
    res.json({ signatures: result["uploaded-signs"] });
  } catch (e) {
    next(e);
  }
}

export async function getAssignedDocRequests(req, res, next) {
  const { id } = req.params;
  const officerId = new mongoose.Types.ObjectId(id);
  const assignedDocRequests = await documentRequests.aggregate([
    {
      $match: {
        values: {
          $elemMatch: {
            "assigned-officer": officerId,
          },
        },
      },
    },
    {
      $project: {
        name: 1,
        description: 1,
        fields: 1,
        "reader-id": 1,
        createdAt: 1,
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
        from: "readers",
        localField: "reader-id",
        foreignField: "_id",
        as: "reader",
      },
    },
    {
      $unwind: "$reader",
    },
    {
      $project: {
        name: 1,
        fields: 1,
        createdAt: 1,
        values: 1,
        reader: {
          email: 1,
        },
      },
    },
  ]);
  const formattedData = assignedDocRequests.map((docRequest) => {
    const totalDocumentsLeft = docRequest.values.filter(
      (value) => value.status == 1
    ).length;
    const totalDocumentsSigned = docRequest.values.filter(
      (value) => value.status == 2
    ).length;

    return {
      id: docRequest._id,
      name: docRequest.name,
      readerEmail: docRequest.reader.email,
      totalDocumentsSigned,
      totalDocumentsLeft,
      creationDate: docRequest.createdAt,
    };
  });
  res.json({ assignedDocRequests: formattedData });
}

export async function fetchAssignedDocRequestDetails(req, res) {
  const { reqId, id } = req.params;
  try {
    let docRequest = await documentRequests.findOne({
      _id: reqId,
    });

    const totalAssignedDocuments = docRequest.values.filter(
      (value) => value.status == 1 && value["assigned-officer"] == id
    ).length;
    const totalDocumentsSigned = docRequest.values.filter(
      (value) => value.status == 2 && value["assigned-officer"] == id
    ).length;
    res.json({
      id: docRequest._id,
      name: docRequest.name,
      description: docRequest.description,
      creationDate: docRequest.createdAt,
      totalAssignedDocuments,
      totalDocumentsSigned,
      totalFields: docRequest.fields.length,
    });
  } catch (e) {
    next(e);
  }
}

export async function fetchAssignedDocuments(req, res, next) {
  try {
    const { reqId } = req.params;
    const { values } = await documentRequests
      .findOne({ _id: reqId })
      .populate("values.assigned-officer", "email");
    const filteredValues = values.filter(
      (value) => value["assigned-officer"] == id
    );
    const formattedValues = filteredValues.map((value) => {
      return {
        name: value.name,
        status: status[value.status],
        id: value._id,
        creationDate: value.createdAt,
        assignedOfficer: value["assigned-officer"]?.email || "",
      };
    });
    res.json({ documents: formattedValues });
  } catch (e) {
    next(e);
  }
}
