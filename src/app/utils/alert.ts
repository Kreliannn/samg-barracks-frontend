import Swal from "sweetalert2"
import { toast } from "sonner"

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

export const successAlert = (text: string) => {
    toast.success("Success", {
      description: text,
    });
  };
  

export const errorAlert = (text : string) => {
    toast.error("Error", {
        description: text,
      });
}

