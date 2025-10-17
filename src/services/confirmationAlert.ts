import Swal from "sweetalert2";
import "sweetalert2/src/sweetalert2.scss";
const confirmationAlert = () => {
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
export default confirmationAlert;
