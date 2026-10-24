import Swal from 'sweetalert2';

export const FirezoneSwal = Swal.mixin({
  confirmButtonColor: '#eb5314',
  cancelButtonColor: '#737373',
  customClass: {
    popup: 'rounded-2xl font-sans border border-neutral-200 shadow-2xl',
    title: 'text-xl font-bold text-neutral-900',
    htmlContainer: 'text-sm text-neutral-600',
    confirmButton: 'rounded-xl px-5 py-2.5 font-bold text-sm shadow-md shadow-brand-600/25',
    cancelButton: 'rounded-xl px-5 py-2.5 font-medium text-sm',
  },
});

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
    popup: 'rounded-xl font-sans shadow-lg text-sm',
  },
});

export const showSuccessAlert = (title: string, text: string) => {
  return FirezoneSwal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonText: 'Lanjutkan',
  });
};

export const showErrorAlert = (title: string, text: string) => {
  return FirezoneSwal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'Mengerti',
  });
};

export const showSuccessToast = (title: string) => {
  return Toast.fire({
    icon: 'success',
    title,
  });
};

export const showErrorToast = (title: string) => {
  return Toast.fire({
    icon: 'error',
    title,
  });
};
