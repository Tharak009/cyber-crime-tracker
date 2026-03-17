import { useCallback } from "react";
import api from "../services/api";
import useApi from "./useApi";

export function useUserComplaints() {
  const request = useCallback(async () => {
    const { data } = await api.get("/complaints/user");
    return data.data || [];
  }, []);
  return useApi(request);
}

export function useAssignedCases() {
  const request = useCallback(async () => {
    const { data } = await api.get("/cases/assigned");
    return data.data || [];
  }, []);
  return useApi(request);
}

export function useComplaintSearch() {
  const request = useCallback(async () => {
    const { data } = await api.get("/complaints/search");
    return data.data || [];
  }, []);
  return useApi(request);
}

export function useCreateComplaint() {
  return useCallback(async (payload) => {
    const { data } = await api.post("/complaints/create", payload);
    return data.data;
  }, []);
}
