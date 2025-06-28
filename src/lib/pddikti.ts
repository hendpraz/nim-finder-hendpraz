export interface PDDIKTIMhsSearchResult {
  id: string;
  nama: string;
  nim: string;
  nama_pt: string;
  nama_prodi: string;
}

// ['id', 'nama_pt', 'kode_pt', 'kode_prodi', 'prodi', 'nama', 'nim', 'jenis_daftar', 'id_pt', 'id_sms', 'jenis_kelamin', 'jenjang', 'status_saat_ini', 'tahun_masuk']

export interface PDDIKTIMhsDetail {
  id: string;
  nama_pt: string;
  kode_pt?: string;
  kode_prodi?: string;
  prodi?: string;
  nama: string;
  nim: string;
  jenis_daftar?: string;
  id_pt?: string;
  id_sms?: string;
  jenis_kelamin?: string;
  jenjang?: string;
  status_saat_ini?: string;
  tahun_masuk?: string;
}

export async function searchMahasiswaPDDIKTI(
  query: string
): Promise<PDDIKTIMhsSearchResult[] | null> {
  try {
    const response = await fetch(
      `https://is7fhnd8d9.execute-api.ap-southeast-1.amazonaws.com/mahasiswa_pddikti?query=${query}`
    );
    const data = await response.json();
    return data;
  } catch (e: any) {
    return null;
  }
}
