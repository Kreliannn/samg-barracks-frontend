import Swal from "sweetalert2"

export const confirmAlert = (text : string, buttonText : string, callback : () => void) => {
    Swal.fire({
        title: 'Are you sure?',
        text: text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#22c55e',
        cancelButtonColor: '#d33',
        confirmButtonText: buttonText
      }).then((result) => {
        if (result.isConfirmed) {
            callback()
        }
      })
} 

export const successAlert = (text : string) => {
    Swal.fire({
        title: 'Success!',
        text: text,
        icon: 'success',
        confirmButtonColor: '#22c55e', // Tailwind's green-500 hex
        confirmButtonText: 'OK',
        customClass: {
            confirmButton: 'w-40' // Tailwind: width of 10rem
          }
      });
}

export const errorAlert = (text : string) => {
    Swal.fire({
        title: 'Error!',
        text: text,
        icon: 'error',
        confirmButtonColor: '#22c55e', // Tailwind's green-500 hex
        confirmButtonText: 'OK',
        customClass: {
            confirmButton: 'w-40' // Tailwind: width of 10rem
          }
      });
}

