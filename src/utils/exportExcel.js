import * as XLSX from 'xlsx';
import { toastError } from './swal.js';
import { formatWitaDateTime } from './date.js';

export function exportMembersToExcel(members, filename = 'Rekap_Anggota_Satria_Muda_Club.xlsx') {
  if (!members || !members.length) {
    toastError('Tidak ada data untuk diekspor.');
    return;
  }

  const rows = members.map((m, idx) => ({
    'No': idx + 1,
    'Kode Registrasi': m.registration_code || '-',
    'Nama Lengkap': m.full_name || '-',
    'Tanggal Lahir': m.birth_date || '-',
    'Jenis Kelamin': m.gender || '-',
    'No. WhatsApp': m.phone_number || '-',
    'Alamat Domisili': m.address || '-',
    'Tingkatan Sabuk': m.belt_rank || 'Putih',
    'Status Registrasi': m.registration_status === 'verified' ? 'Terverifikasi' : (m.registration_status === 'rejected' ? 'Ditolak' : 'Menunggu'),
    'Status Pembayaran': m.payment_status === 'paid' ? 'Lunas' : 'Belum Bayar',
    'Nominal Bayar (Rp)': m.payment_amount ? Number(m.payment_amount).toLocaleString('id-ID') : '0',
    'Tanggal Bayar (WITA)': formatWitaDateTime(m.payment_date),
    'Metode Bayar': m.payment_method || '-',
    'Catatan Transaksi': m.payment_notes || '-',
    'Tanggal Daftar (WITA)': formatWitaDateTime(m.created_at),
  }));

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const columnWidths = [
    { wch: 5 },  // No
    { wch: 18 }, // Kode
    { wch: 25 }, // Nama
    { wch: 14 }, // Tgl Lahir
    { wch: 14 }, // Gender
    { wch: 16 }, // WA
    { wch: 30 }, // Alamat
    { wch: 16 }, // Sabuk
    { wch: 18 }, // Status Reg
    { wch: 18 }, // Status Bayar
    { wch: 18 }, // Nominal
    { wch: 18 }, // Tgl Bayar
    { wch: 14 }, // Metode
    { wch: 22 }, // Catatan
    { wch: 18 }, // Tgl Daftar
  ];
  worksheet['!cols'] = columnWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Anggota');

  XLSX.writeFile(workbook, filename);
}
