import { createToken } from "../utils/jwt.js";
import readers from "../models/readers.js";
import bcrypt from "bcrypt";
import documentRequests from "../models/documentRequests.js";
import extractFields from "../utils/extractFields.js";
import checkRequiredFields from "../utils/checkRequiredFields.js";
import validateFields from "../utils/validateFields.js";
import { excludedFields } from "../constants/fieldFilters.js";

export async function login(req, res, next) {
  const { email, password } = req.body;
  try {
    const reader = await readers.findOne({ email });
    if (!reader) {
      res.status(401).json({ message: "Invalid Email" });
      return;
    }
    const isPasswordValid = await bcrypt.compare(password, reader.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid Password" });
    }
    const payload = { email, role: "reader" };
    const jwtToken = createToken({ payload, config: { expiresIn: "30h" } });
    res.cookie("token", jwtToken, { httpOnly: true });
    res.json({ message: "login successfull", id: reader._id });
  } catch (e) {
    next(e);
  }
}

export async function createDocRequest(req, res, next) {
  const { name, description, id } = req.body;
  const { path } = req.file;
  try {
    const fields = await extractFields(path);
    if (!checkRequiredFields(fields)) {
      res.status(400).json({ message: "Invalid Document" });
      return;
    }

    const filteredFields = fields.filter(
      (field) => !excludedFields.includes(field.toLowerCase())
    );
    const { _id } = await documentRequests.insertOne({
      "reader-id": id,
      name,
      description,
      "template-path": path,
      fields: filteredFields,
    });
    await readers.updateOne(
      { _id: id },
      {
        $push: {
          "doc-requests": _id,
        },
      }
    );
    res.status(201).json({
      message: "Document verification request submitted successfully",
      docRequestDetail: {
        insertedId: _id,
      },
    });
  } catch (e) {
    next(e);
  }
}

export async function fetchDocRequests(req, res, next) {
  const { id } = req.params;

  try {
    let docRequests = await documentRequests.find({
      "reader-id": id,
    });
    docRequests = docRequests.map((docRequest) => {
      const totalSignedDocuments = docRequest.values.filter(
        (value) => value.status == 2
      ).length;
      return {
        id: docRequest._id,
        name: docRequest.name,
        creationDate: docRequest.createdAt,
        totalDocuments: docRequest.values.length,
        totalSignedDocuments,
      };
    });
    res.json(docRequests);
  } catch (e) {
    next(e);
  }
}

export async function fetchDocRequestDetails(req, res, next) {
  const { reqId } = req.params;
  try {
    let docRequest = await documentRequests.findOne({
      _id: reqId,
    });

    const totalSignedDocuments = docRequest.values.filter(
      (value) => value.status == 2
    ).length;
    const totalDocumentsSent = docRequest.values.filter(
      (value) => value.status == 1
    ).length;
    res.json({
      id: docRequest._id,
      name: docRequest.name,
      description: docRequest.description,
      creationDate: docRequest.createdAt,
      totalDocuments: docRequest.values.length,
      totalDocumentsSent,
      totalSignedDocuments,
      totalFields: docRequest.fields.length,
    });
  } catch (e) {
    next(e);
  }
}

export async function fetchDocRequestFields(req, res, next) {
  const { reqId } = req.params;
  try {
    let docRequestFields = await documentRequests
      .findOne({
        _id: reqId,
      })
      .select("fields");
    const formattedDocRequestFields = docRequestFields.fields.filter(
      (item) =>
        item.toLowerCase() !== "signature" && item.toLowerCase() !== "qr code"
    );
    res.json(formattedDocRequestFields);
  } catch (e) {
    next(e);
  }
}

export async function createDocument(req, res, next) {
  const { fieldAndValues } = req.body;
  const { reqId } = req.params;

  try {
    const { fields: validFields } = await documentRequests
      .findById(reqId)
      .select("fields");
    const fields = Object.keys(fieldAndValues);
    if (!validateFields(fields, validFields)) {
      res.status(400).json({
        message: "Invalid Fields",
      });
      return;
    }
    const validValues = [];
    for (let key of validFields) {
      validValues.push(fieldAndValues[key]);
    }
    await documentRequests.updateOne(
      { _id: reqId },
      {
        $push: {
          values: {
            data: validValues,
          },
        },
      }
    );
    res.send({ message: "Document inserted successfully" });
  } catch (e) {
    next(e);
  }
}

export async function fetchDocuments(req, res, next) {
  const { id, reqId } = req.params;
  const documents = req.params;
}
