import Swal from 'sweetalert2'

const defaultConfig = {
  confirmButtonColor: '#9a3412',
  cancelButtonColor: '#fb923c',
  customClass: {
    popup: 'rounded-lg',
    confirmButton: 'rounded-lg',
    cancelButton: 'rounded-lg',
  },
}

export const showAlert = {
  success: (title: string, text?: string) => {
    return Swal.fire({
      icon: 'success',
      title,
      text,
      ...defaultConfig,
    })
  },

  error: (title: string, text?: string) => {
    return Swal.fire({
      icon: 'error',
      title,
      text,
      ...defaultConfig,
    })
  },

  confirm: async (title: string, text?: string): Promise<boolean> => {
    const result = await Swal.fire({
      icon: 'question',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
      ...defaultConfig,
    })
    return result.isConfirmed
  },

  warning: async (title: string, text?: string): Promise<boolean> => {
    const result = await Swal.fire({
      icon: 'warning',
      title,
      text,
      showCancelButton: true,
      confirmButtonText: 'Yes, proceed',
      cancelButtonText: 'Cancel',
      ...defaultConfig,
    })
    return result.isConfirmed
  },
}
