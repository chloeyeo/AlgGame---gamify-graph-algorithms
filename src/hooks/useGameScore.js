import { useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { BACKEND_URL } from "@/constants/constants";

const API_URL = BACKEND_URL;

export const useGameScore = () => {
  const { token } = useSelector((state) => state.auth);

  const submitScore = useCallback(
    async (scoreData) => {
      try {
        const response = await axios.post(`${API_URL}/api/scores`, scoreData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
      } catch (error) {
        console.error("Error submitting score:", error);
        throw error;
      }
    },
    [token]
  );

  return { submitScore };
};
