import { useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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
