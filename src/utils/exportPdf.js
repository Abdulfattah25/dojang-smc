import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { toastError } from './swal.js';

export function exportMembersToPdf(members, filterInfo = {}) {
  if (!members || !members.length) {
    toastError('Tidak ada data untuk diekspor.');
    return;
  }

  // Landscape A4 for wide table data
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // 1. Header Banner
  doc.setFillColor(22, 19, 17); // Obsidian Core #161311
  doc.rect(0, 0, pageWidth, 26, 'F');

  // Scarlet Red accent line under header
  doc.setFillColor(229, 46, 28); // Scarlet Red #E52E1C
  doc.rect(0, 26, pageWidth, 2, 'F');

  // Club Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(201, 168, 91); // Antique Gold #C9A85B
  doc.text('TAEKWONDO SATRIA MUDA CLUB', 14, 12);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(248, 250, 252); // Canvas Dobok #F8FAFC
  doc.text('Sistem Informasi Registrasi & Manajemen Anggota Dojang | Rekap Data Resmi', 14, 19);

  // Print Date in WITA (UTC+8 / Makassar)
  const now = new Date();
  const printDateStr = now.toLocaleDateString('id-ID', {
    timeZone: 'Asia/Makassar',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }) + ' ' + now.toLocaleTimeString('id-ID', {
    timeZone: 'Asia/Makassar',
    hour: '2-digit',
    minute: '2-digit',
  }) + ' WITA';
  doc.setFontSize(8);
  doc.text(`Dicetak: ${printDateStr}`, pageWidth - 14, 19, { align: 'right' });

  // 2. Filter Summary Subtitle
  let subtitle = 'Semua Periode Pendaftaran';
  if (filterInfo.startDate && filterInfo.endDate) {
    subtitle = `Periode: ${filterInfo.startDate} s/d ${filterInfo.endDate}`;
  }
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`DAFTAR REKAPITULASI ANGGOTA (${members.length} Orang)`, 14, 36);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 116, 139);
  doc.text(subtitle, 14, 41);

  // 3. Table Rows (Tanpa Kolom Kode Registrasi)
  const tableData = members.map((m, idx) => [
    idx + 1,
    m.full_name || '-',
    m.gender === 'Laki-laki' ? 'L' : 'P',
    m.phone_number || '-',
    m.belt_rank || 'Putih',
    m.registration_status === 'verified' ? 'Verified' : (m.registration_status === 'rejected' ? 'Rejected' : 'Pending'),
    m.payment_status === 'paid' ? 'Lunas' : 'Belum',
    m.payment_amount ? `Rp ${Number(m.payment_amount).toLocaleString('id-ID')}` : '-',
    m.payment_method || '-',
    m.created_at ? m.created_at.substring(0, 10) : '-',
  ]);

  autoTable(doc, {
    startY: 46,
    head: [[
      'No',
      'Nama Lengkap',
      'L/P',
      'WhatsApp',
      'Sabuk',
      'Status Reg',
      'Status Bayar',
      'Nominal',
      'Metode',
      'Tgl Daftar'
    ]],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [22, 19, 17],
      textColor: [201, 168, 91],
      fontStyle: 'bold',
      fontSize: 8,
      halign: 'center',
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [15, 23, 42],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 12, halign: 'center' },
      1: { cellWidth: 58, fontStyle: 'bold' },
      2: { cellWidth: 14, halign: 'center' },
      3: { cellWidth: 32 },
      4: { cellWidth: 26 },
      5: { cellWidth: 24, halign: 'center' },
      6: { cellWidth: 24, halign: 'center' },
      7: { cellWidth: 30, halign: 'right' },
      8: { cellWidth: 24, halign: 'center' },
      9: { cellWidth: 25, halign: 'center' },
    },
    margin: { left: 14, right: 14 },
    didDrawPage: (data) => {
      // Footer page numbers
      const pageNumber = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Halaman ${data.pageNumber} dari ${pageNumber} | Taekwondo Satria Muda Club Official`,
        pageWidth / 2,
        doc.internal.pageSize.getHeight() - 8,
        { align: 'center' }
      );
    }
  });

  // 4. Signatures at final page bottom if room permits
  const finalY = doc.lastAutoTable?.finalY || 160;
  if (finalY + 35 < doc.internal.pageSize.getHeight()) {
    const sigY = finalY + 12;
    doc.setFontSize(9);
    doc.setTextColor(15, 23, 42);
    doc.text('Mengetahui,', pageWidth - 60, sigY);
    doc.text('Pelatih Kepala / Pengurus SMC', pageWidth - 60, sigY + 5);
    doc.text('(..........................................)', pageWidth - 60, sigY + 24);
  }

  doc.save(`Laporan_Anggota_SMC_${new Date().toISOString().substring(0, 10)}.pdf`);
}
