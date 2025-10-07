import { message } from "antd";
import axiosInstance from "./axiosInstance";
import { handleAxiosError } from "./generic";
import { type AxiosProgressEvent } from "axios";
export interface AssignableOfficerData {
  email: string;
  id: string;
}
export async function fetchDocRequests(readerId: string) {
  try {
    const response = await axiosInstance.get(`/reader/${readerId}/docRequests`);
    return response.data;
  } catch (e) {
    handleAxiosError(e);
  }
}
export async function fetchDocRequestDetails(
  readerId: string,
  docReqId: string
) {
  try {
    const response = await axiosInstance.get(
      `/reader/${readerId}/docRequests/${docReqId}`
    );
    return response.data;
  } catch (e) {
    handleAxiosError(e);
  }
}

export async function createDocRequest(newDocReqData: FormData) {
  try {
    const response = await axiosInstance.post(
      "/reader/createDocRequest",
      newDocReqData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload Progress: ${percentCompleted}%`);
          }
        },
      }
    );
    message.success("Document request created successfully");
    return response.data;
  } catch (e) {
    handleAxiosError(e);
  }
}

export async function fetchDocRequestFields(
  readerId: string,
  docRequestId: string
) {
  try {
    const response = await axiosInstance.get(
      `/reader/${readerId}/docRequests/${docRequestId}/fields`
    );
    return response.data;
  } catch (e) {
    handleAxiosError(e);
  }
}

export async function createDocument(
  readerId: string,
  docRequestId: string,
  documentData: { [key: string]: unknown }
) {
  try {
    const response = await axiosInstance.post(
      `/reader/${readerId}/docRequests/${docRequestId}/documents`,
      { fieldAndValues: documentData }
    );
    return response.data;
  } catch (e) {
    handleAxiosError(e);
  }
}

export async function fetchDocuments(readerId: string, docRequestId: string) {
  try {
    const response = await axiosInstance.get(
      `/reader/${readerId}/docRequests/${docRequestId}/documents`
    );
    return response.data.documents;
  } catch (e) {
    handleAxiosError(e);
  }
}

export async function fetchAssignableOfficers(readerId: string) {
  try {
    const response = await axiosInstance.get(
      `/reader/${readerId}/assignableOfficers`
    );
    return response.data;
  } catch (e) {
    handleAxiosError(e);
  }
}

export async function assignOfficer(
  readerId: string,
  docReqId: string,
  docId: string,
  officerId: string
) {
  try {
    const response = await axiosInstance.put(
      `/reader/${readerId}/docRequests/${docReqId}/documents/${docId}/assignOfficer`,
      {
        officerId,
      }
    );
    return response.data;
  } catch (e) {
    handleAxiosError(e);
  }
}
