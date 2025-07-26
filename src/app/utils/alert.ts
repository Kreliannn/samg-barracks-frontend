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




export const passwordPromptAlert = (correctPassword: string, onSuccess: () => void
  ) => {
    Swal.fire({
      title:  "Enter Pin",
      input: 'password',
      inputPlaceholder: 'enter password',
      inputAttributes: {
        autocapitalize: 'off',
        autocorrect: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Confirm',
      confirmButtonColor: '#22c55e',
      cancelButtonColor: '#d33',
      preConfirm: (input) => {
        if (!input) {
          Swal.showValidationMessage('Password is required');
          return;
        }
        if (input !== correctPassword) {
          Swal.showValidationMessage('Incorrect password');
          return;
        }
        return input; // ✅ pass input forward to .then
      }
    }).then((result) => {
      if (result.isConfirmed && result.value === correctPassword) {
        onSuccess(); // ✅ now this will run correctly
      }
    });
  };