export interface PDDIKTIResult {
  id: string;
  nama: string;
  nim: string;
  nama_pt: string;
  nama_prodi: string;
  jenjang: string;
  status: string;
}

export async function searchMahasiswaPDDIKTI(
  query: string
): Promise<PDDIKTIResult[] | null> {
  try {
    const response = await fetch(
      `https://xg1kctvm70.execute-api.ap-southeast-1.amazonaws.com/mahasiswa_pddikti?query=${query}`
    );
    const data = await response.json();
    return data;
  } catch (e: any) {
    return null;
  }
}
