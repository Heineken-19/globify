import api from "./api";
import { UserProfile } from "../types";

export const getUserProfile = async (): Promise<UserProfile> => {
  const response = await api.get<UserProfile>("/api/users/profile");
  return response.data;
};

export const updateUserProfile = async (profileData: Partial<UserProfile>): Promise<UserProfile> => {
  const response = await api.put<UserProfile>("/api/users/profile", profileData, {
    headers: { "Content-Type": "application/json" }
  });
  return response.data;
};
