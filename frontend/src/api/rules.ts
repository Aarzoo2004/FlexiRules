// src/api/rules.ts
import { apiClient } from "./client";
import type { RulesListResponse } from "../types/rule";

export interface GetRulesParams {
  page?: number;
  limit?: number;
  search?: string;
  active?: boolean;
}

export async function getRules(params?: GetRulesParams): Promise<RulesListResponse> {
  const response = await apiClient.get<RulesListResponse>("/rules", {
    params: {
      page: params?.page,
      limit: params?.limit,
      search: params?.search,
      // backend expects "active" as string "true"/"false" in query
      active:
        typeof params?.active === "boolean"
          ? String(params.active)
          : undefined,
    },
  });

  // We only return the data, not the whole axios response
  return response.data;
}
