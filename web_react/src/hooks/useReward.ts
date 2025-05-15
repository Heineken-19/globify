import { RewardService } from "../services/RewardService";
import { useState, useEffect } from "react";

export function useReward() {
  const [points, setPoints] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    RewardService.getMyPoints()
      .then((data) => {
        console.log("🏅 Pont adatok:", data);
        setPoints(data.balance);
      })
      .finally(() => setLoading(false));
  }, []);



  return {
    points,
    loading,
  };
}
