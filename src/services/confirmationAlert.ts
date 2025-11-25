import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
export const confirmationAlert = () => {
  return Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!",
    customClass: {
      icon: "confirmation-alert-icon",
    },
  });
};
export const changeStatusConfirmationAlert = async () => {
  return Swal.fire({
    title: "Are you sure?",
    text: "You want to change the status!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, change it!",
    customClass: {
      icon: "confirmation-alert-icon",
    },
  });
};
