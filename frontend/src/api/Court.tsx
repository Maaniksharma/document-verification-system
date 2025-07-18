import { message } from "antd";
import axiosInstance from "./axiosInstance";
import { handleAxiosError } from "./generic";
import type { StatsData } from "../pages/Courts";
import type { Credentials } from "./auth";

export interface CourtDetail {
  "court-name": string;
  location: string;
  description: string;
}
export async function createCourt(courtDetail: CourtDetail) {
  try {
    const response = await axiosInstance.post(
      "/admin/createcourt",
      courtDetail
    );
    message.success("Court created successfully");
    return response.data;
  } catch (e: unknown) {
    handleAxiosError(e);
  }
}

export async function fetchAdminStats(): Promise<StatsData | undefined> {
  try {
    const response = await axiosInstance.get("/admin/stats");
    return response.data;
  } catch (e: unknown) {
    handleAxiosError(e);
  }
}

export async function fetchCourtsPages(page: number) {
  try {
    const response = await axiosInstance.get(
      `/admin/courts?page=${page}&sortBy=dateCreated&sortOrder=asc`
    );
    return response.data;
  } catch (e: unknown) {
    handleAxiosError(e);
  }
}
interface MemberData extends Credentials {
  courtId: string;
}
export async function createMember(memberData: MemberData) {
  try {
    const response = await axiosInstance.post(
      `/admin/createmember`,
      memberData
    );
    message.success("Member created successfully");
    return response.data;
  } catch (e: unknown) {
    handleAxiosError(e);
  }
}
export async function fetchCourtDetails(id: string) {
  try {
    const response = await axiosInstance.get(`/admin/courts/${id}`);
    return response.data;
  } catch (e: unknown) {
    handleAxiosError(e);
  }
}

export async function fetchReaderPages(page: number, id: string) {
  try {
    const response = await axiosInstance.get(
      `/admin/${id}/members/readers/?page=${page}&sortBy=dateCreated&sortOrder=asc`
    );
    return response.data;
  } catch (e: unknown) {
    handleAxiosError(e);
  }
}
export async function fetchOfficerPages(page: number, id: string) {
  try {
    const response = await axiosInstance.get(
      `/admin/${id}/members/officers/?page=${page}&sortBy=dateCreated&sortOrder=asc`
    );
    return response.data;
  } catch (e: unknown) {
    handleAxiosError(e);
  }
}
