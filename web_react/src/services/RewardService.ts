import api from "./api";

export const RewardService = {
  async getMyPoints() {
    const response = await api.get("/api/rewards/me");
    return response.data; // List<RewardPoint>
  },

  async usePoints(points: number, description: string) {
    return await api.post("/api/rewards/use", {
      params: {
        points,
        description,
      },
    });
  },
  
};
