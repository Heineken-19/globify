import { useState, useEffect } from "react";
import { getUserProfile, updateUserProfile } from "../services/UserService";
import { UserProfile } from "../types";

export const useUser = () => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getUserProfile();
        setUser(userData);
      } catch (err: any) {
        setError("Nem sikerült lekérni a felhasználói adatokat.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const updateUser = async (profileData: Partial<UserProfile>) => {
    try {
      // 🔹 Csak a módosított mezőket küldjük
      const filteredData = Object.fromEntries(
        Object.entries(profileData).filter(([_, value]) => value !== "")
      );
  
      const updatedUser = await updateUserProfile(filteredData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err: any) {
      setError("Nem sikerült frissíteni a profilt.");
    }
  };

  return { user, setUser, loading, error, updateUser, firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? ""};
};
