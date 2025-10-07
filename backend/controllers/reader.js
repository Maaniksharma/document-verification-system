import { createToken } from "../utils/jwt.js";
import { Readable } from "stream";
import readers from "../models/readers.js";
import bcrypt from "bcrypt";
import documentRequests from "../models/documentRequests.js";
import extractFields from "../utils/extractFields.js";
import checkRequiredFields from "../utils/checkRequiredFields.js";
import validateFields from "../utils/validateFields.js";
import { excludedFields } from "../constants/fieldFilters.js";
import { status } from "../constants/status.js";
import { generateDocxFromTemplate } from "../utils/generateDocxFromTemplate.js";
import courts from "../models/courts.js";
import officers from "../models/officers.js";

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

    if (!validFields) {
      return res.status(404).json({ message: "Document request not found" });
    }

    const name = fieldAndValues?.name || fieldAndValues?.Name;
    if (!name) {
      return res.status(400).json({
        message: "Name of document is not given",
      });
    }

    if ("name" in fieldAndValues) {
      delete fieldAndValues.name;
    } else if ("Name" in fieldAndValues) {
      delete fieldAndValues.Name;
    }

    const fields = Object.keys(fieldAndValues);

    if (!validateFields(fields, validFields)) {
      return res.status(400).json({
        message: "Invalid Fields",
      });
    }

    const validValues = validFields.map((field) => fieldAndValues[field]);

    const updateResult = await documentRequests.findOneAndUpdate(
      { _id: reqId },
      {
        $push: {
          values: {
            name,
            data: validValues,
          },
        },
      },
      { new: true }
    );
    const insertedDocument = updateResult.values.at(-1);
    res.json({
      message: "Document inserted successfully",
      id: insertedDocument._id,
    });
  } catch (e) {
    next(e);
  }
}

export async function fetchDocuments(req, res, next) {
  try {
    const { reqId } = req.params;
    const { values } = await documentRequests
      .findOne({ _id: reqId })
      .populate("values.assigned-officer", "email");
    const formattedValues = values.map((value) => {
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

export async function downloadDocument(req, res, next) {
  try {
    const { reqId, docId } = req.params;
    const docRequest = await documentRequests.findOne(
      { _id: reqId, "values._id": docId },
      {
        fields: 1,
        "template-path": 1,
        "values.$": 1,
      }
    );

    const { data } = docRequest.values[0];
    const fields = docRequest.fields;
    const documentData = {};
    for (let i = 0; i < fields.length; i++) {
      documentData[fields[i]] = data[i];
    }
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${docRequest.values[0].name}.docx`
    );

    const buffer = await generateDocxFromTemplate(
      docRequest["template-path"],
      documentData
    );
    const stream = Readable.from(buffer);
    stream.pipe(res);
  } catch (error) {
    next(error);
  }
}

export async function getOfficers(req, res, next) {
  try {
    const { id } = req.params;

    const court = await courts.findOne({
      readers: { $in: [id] },
    });

    if (!court) {
      return res.status(404).json({ error: "Court not found" });
    }

    const { officers: officersIds } = court;

    const officersData = await officers.find({
      _id: { $in: officersIds },
    });

    const formattedData = officersData.map((officer) => ({
      id: officer._id,
      email: officer.email,
    }));

    res.json({
      officers: formattedData,
    });
  } catch (e) {
    next(e);
  }
}

export async function assignOfficer(req, res, next) {
  try {
    const { reqId, docId } = req.params;
    const { officerId } = req.body;
    const result = await documentRequests.updateOne(
      {
        _id: reqId,
        "values._id": docId,
      },
      {
        $set: {
          "values.$.status": 1,
          "values.$.assigned-officer": officerId,
        },
      }
    );

    res.status(200).json({ message: "officer assigned successfully", result });
  } catch (e) {
    next(e);
  }
}
