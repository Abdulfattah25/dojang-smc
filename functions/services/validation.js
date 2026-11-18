/**
 * Validation utilities for file uploads and member registration.
 */

export function validateImageMagicBytes(arrayBuffer) {
  if (!arrayBuffer || arrayBuffer.byteLength < 12) {
    throw new Error('Ukuran berkas tidak valid atau terlalu kecil.');
  }

  const bytes = new Uint8Array(arrayBuffer.slice(0, 12));

  // 1. JPEG Signature: FF D8 FF
  const isJpeg = bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF;

  // 2. PNG Signature: 89 50 4E 47
  const isPng = bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4E && bytes[3] === 0x47;

  // 3. WebP Signature: RIFF....WEBP
  const isWebp = bytes[0] === 0x52 && bytes[1] === 0x49 && bytes[2] === 0x46 && bytes[3] === 0x46 &&
                 bytes[8] === 0x57 && bytes[9] === 0x45 && bytes[10] === 0x42 && bytes[11] === 0x50;

  if (!isJpeg && !isPng && !isWebp) {
    throw new Error('Format berkas tidak valid atau rusak. Hanya berkas JPEG, PNG, dan WebP yang diizinkan.');
  }

  if (isJpeg) return 'jpg';
  if (isPng) return 'png';
  if (isWebp) return 'webp';
  return 'bin';
}

export function sanitize(input) {
  if (typeof input !== 'string') return '';
  return input.trim();
}

export function validateRegistrationPayload(payload) {
  const errors = [];
  const fullName = sanitize(payload.full_name);
  const birthDate = sanitize(payload.birth_date);
  const gender = sanitize(payload.gender);
  const phoneNumber = sanitize(payload.phone_number);
  const address = sanitize(payload.address);
  const beltRank = sanitize(payload.belt_rank) || 'Putih';

  if (!fullName || fullName.length < 3) {
    errors.push('Nama lengkap wajib diisi minimal 3 karakter.');
  }
  if (!birthDate || !/^\d{4}-\d{2}-\d{2}$/.test(birthDate)) {
    errors.push('Format tanggal lahir harus YYYY-MM-DD.');
  }
  if (!['Laki-laki', 'Perempuan'].includes(gender)) {
    errors.push('Jenis kelamin harus dipilih (Laki-laki atau Perempuan).');
  }
  if (!phoneNumber || phoneNumber.length < 8) {
    errors.push('Nomor WhatsApp aktif wajib diisi.');
  }
  if (!address || address.length < 5) {
    errors.push('Alamat domisili lengkap wajib diisi.');
  }

  return {
    isValid: errors.length === 0,
    errors,
    data: {
      full_name: fullName,
      birth_date: birthDate,
      gender,
      phone_number: phoneNumber,
      address,
      belt_rank: beltRank,
    }
  };
}
