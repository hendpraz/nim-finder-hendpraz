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
  jenis_kelamin: string;
  status: string;
  jenjang?: string; // Only for UI, UNPAD
}

export interface AllApiResponse {
  query: string;
  total: number;
  limit: number;
  offset: number;
  results: AllStudentPayload[];
}

export interface AllStudentPayload {
  nim: string;
  nama: string;
  prodi: string;
  jenjang: string;
  status: string;
  jenis_kelamin: string;
  universitas: string;
}
