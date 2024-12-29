export interface ApiResponse {
  code: number;
  status: string;
  query: {
    page: string;
    query: string;
  };
  message: string;
  payload: StudentPayload[];
  total: number;
  is_similar: boolean;
}

export interface StudentPayload {
  name: string;
  nim_tpb: string;
  nim_jur: string;
  prodi: string;
}
