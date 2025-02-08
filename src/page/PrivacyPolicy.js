import React from 'react';
import { sopra_full } from '../config/icon';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <div className='bg-gray-50 p-4 w-full'>
            <div className='flex flex-row justify-between items-center'>
                <p className='font-bold text-[20px]'>Kebijakan Privasi SOPRA HRIS</p>
                <Link className='flex justify-end' to={'/login'}>
                    <img className='w-[20%]' alt="logo" src={sopra_full} />
                </Link>
            </div>
            <ol>
                <li className='py-2'>
                    <p className='font-bold text-sm pb-1'>1. Pendahuluan</p>
                    <p className='text-xs w-[400px]'>
                        Kami menghormati dan melindungi privasi pengguna SOPRA HRIS (Human Resource Information System). Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, mengungkapkan, dan melindungi informasi pribadi pengguna.
                    </p>
                </li>
                <li className='py-2'>
                    <p className='font-bold text-sm pb-1'>2. Informasi yang Dikumpulkan</p>
                    <p className='text-xs w-[400px]'>
                        Kami dapat mengumpulkan informasi berikut:
                    </p>
                    <ul className='text-xs list-disc pl-6' style={{listStyleType: 'circle'}}>
                        <li>Data identitas (nama, NIK, No. KTP, jenis kelamin, email, no. telepon, tempat lahir, tanggal lahir, agama, alamat domisili, alamat KTP)</li>
                        <li>Data kepegawaian (jabatan, departemen, tanggal masuk kerja, riwayat pekerjaan)</li>
                        <li>Informasi keuangan (nomor rekening, slip gaji, pajak)</li>
                        <li>Data absensi dan aktivitas kerja</li>
                        <li>Data lainnya yang relevan dengan pengelolaan sumber daya manusia</li>
                    </ul>
                </li>
                <li className='py-2'>
                    <p className='font-bold text-sm pb-1'>3. Penggunaan Informas</p>
                    <p className='text-xs w-[400px]'>
                        Informasi yang dikumpulkan digunakan untuk:
                    </p>
                    <ul className='text-xs list-disc pl-6' style={{listStyleType: 'circle'}}>
                        <li>Manajemen kepegawaian dan administrasi</li>
                        <li>Pemrosesan gaji dan tunjangan</li>
                        <li>Pemantauan kehadiran dan kinerja</li>
                        <li>Kepatuhan terhadap peraturan ketenagakerjaan</li>
                        <li>Meningkatkan layanan HRIS</li>
                    </ul>
                </li>
                <li className='py-2'>
                    <p className='font-bold text-sm pb-1'>4. Perlindungan Data</p>
                    <p className='text-xs w-[400px]'>
                        Kami menerapkan langkah-langkah keamanan teknis dan organisasi untuk melindungi informasi dari akses tidak sah, perubahan, atau pengungkapan yang tidak sah.
                    </p>
                </li>
                <li className='py-2'>
                    <p className='font-bold text-sm pb-1'>5. Berbagi Informasi</p>
                    <p className='text-xs w-[400px]'>
                        Kami tidak akan membagikan informasi pribadi pengguna kepada pihak ketiga tanpa persetujuan, kecuali dalam kasus:
                    </p>
                    <ul className='text-xs list-disc pl-6' style={{listStyleType: 'circle'}}>
                        <li>Kepatuhan terhadap hukum atau peraturan pemerintah</li>
                        <li>Penyedia layanan yang bekerja sama dalam operasional SOPRA HRIS dengan perjanjian perlindungan data</li>
                    </ul>
                </li>
                <li className='py-2'>
                    <p className='font-bold text-sm pb-1'>6. Hak Pengguna</p>
                    <p className='text-xs w-[400px]'>
                        Pengguna memiliki hak untuk:
                    </p>
                    <ul className='text-xs list-disc pl-6' style={{listStyleType: 'circle'}}>
                        <li>Mengakses data pribadi mereka</li>
                        <li>Meminta penghapusan data dalam batas yang diizinkan hukum</li>
                        <li>Menolak pemrosesan tertentu berdasarkan kebijakan privasi ini</li>
                    </ul>
                </li>
                <li className='py-2'>
                    <p className='font-bold text-sm pb-1'>7. Perubahan Kebijakan</p>
                    <p className='text-xs w-[400px]'>
                        Kami dapat memperbarui Kebijakan Privasi ini sewaktu-waktu. Perubahan akan diinformasikan melalui sistem HRIS atau kanal komunikasi resmi lainnya.
                    </p>
                </li>
            </ol>
        </div>
    );
  };

export default PrivacyPolicy;