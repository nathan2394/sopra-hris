import Swal from 'sweetalert2';

export const handleConfirmation = (title, text, icon, handleActionSuccess) => {
    Swal.fire({
      title: title || 'Apakah anda yakin untuk menyimpan?',
      text: text || 'Data akan disimpan kedalam sistem. Tetap ingin menyimpan?',
      icon: icon || 'warning',
      showCancelButton: true,
      confirmButtonColor: '#369D00',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Lanjut',
      cancelButtonText: 'Batal',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('Sukses!', 'Data sudah berhasil tersimpan!', 'success');
        handleActionSuccess();
      }
    });
};

export const errorConfirmation = (text) => {
  Swal.fire('Error', text || 'Format Data tidak sesuai!', 'error');
}