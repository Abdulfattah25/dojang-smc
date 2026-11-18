import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

// Toast Notification yang otomatis close setelah 3 detik
export const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.onmouseenter = Swal.stopTimer;
    toast.onmouseleave = Swal.resumeTimer;
  },
  customClass: {
    popup: 'font-sans text-xs sm:text-sm rounded-lg shadow-lg border border-slate-200',
  }
});

export function toastSuccess(title, text = '') {
  return Toast.fire({
    icon: 'success',
    title,
    text,
  });
}

export function toastError(title, text = '') {
  return Toast.fire({
    icon: 'error',
    title,
    text,
  });
}

export function toastInfo(title, text = '') {
  return Toast.fire({
    icon: 'info',
    title,
    text,
  });
}

// Modal Konfirmasi SweetAlert2 dengan styling tema terang Satria Muda
export async function showConfirm({
  title = 'Konfirmasi Tindakan',
  text = 'Apakah Anda yakin ingin melanjutkan?',
  confirmButtonText = 'Ya, Lanjutkan',
  cancelButtonText = 'Batal',
  confirmButtonColor = '#059669', // Emerald success
  icon = 'warning',
}) {
  const result = await Swal.fire({
    title,
    text,
    icon,
    showCancelButton: true,
    confirmButtonColor,
    cancelButtonColor: '#94a3b8', // slate-400
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
    focusCancel: false,
    background: '#ffffff',
    color: '#0f172a', // slate-900
    customClass: {
      popup: 'rounded-xl border border-slate-200 shadow-xl font-sans',
      title: 'text-base sm:text-lg font-bold text-slate-900',
      htmlContainer: 'text-xs sm:text-sm text-slate-600',
      confirmButton: 'font-bold text-xs sm:text-sm px-4 py-2.5 rounded-[6px] shadow-sm',
      cancelButton: 'font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-[6px]',
    }
  });

  return result.isConfirmed;
}

export default Swal;
