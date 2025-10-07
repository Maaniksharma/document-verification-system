import axiosInstance from "./axiosInstance";
import { message } from "antd";
import { handleAxiosError } from "./generic";
import { type AxiosProgressEvent } from "axios";

export async function createSignature(id: string, newSignatureData: FormData) {
  try {
    const response = await axiosInstance.post(
      `/officer/${id}/createSignature`,
      newSignatureData,
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
    message.success("Signature created successfully");
    return response.data;
  } catch (e) {
    handleAxiosError(e);
  }
}

export async function fetchSignatures(officerId: string) {
  try {
    const response = await axiosInstance.get(
      `/officer/${officerId}/signatures`
    );
    return response.data;
  } catch (e) {
    handleAxiosError(e);
  }
}
export async function fetchAssignedDocRequests(officerId: string) {
  try {
    const response = await axiosInstance.get(
      `/officer/${officerId}/assignedDocRequests`
    );
    return response.data;
  } catch (e) {
    handleAxiosError(e);
  }
}

export async function fetchAssignedDocRequestDetails(
  officerId: string,
  reqId: string
) {
  try {
    const response = await axiosInstance.get(
      `/officer/${officerId}/assignedDocRequests/${reqId}`
    );
    return response.data;
  } catch (e) {
    handleAxiosError(e);
  }
}

export async function fetchAssignedDocuments(officerId: string, reqId: string) {
  try {
    const response = await axiosInstance.get(
      `/officer/${officerId}/assignedDocRequests/${reqId}/documents`
    );
    return response.data;
  } catch (e) {
    handleAxiosError(e);
  }
}
