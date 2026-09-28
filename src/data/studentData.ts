import { Student } from '../types';

export const getXepLoai = (gpa: number): string => {
  if (gpa >= 8.5) return 'Giỏi';
  if (gpa >= 7.0) return 'Khá';
  if (gpa >= 5.0) return 'Trung bình';
  return 'Yếu';
};

export const INITIAL_STUDENTS: Student[] = [
  {
    id: '1',
    maSV: 'SV001',
    hoTen: 'Nguyễn Văn An',
    ngaySinh: '15/03/2003',
    gioiTinh: 'Nam',
    email: 'an.nguyen@student.edu.vn',
    soDienThoai: '0912345678',
    lop: 'CNTT01',
    khoa: 'Công nghệ thông tin',
    gpa: 8.7,
    xepLoai: 'Giỏi',
  },
  {
    id: '2',
    maSV: 'SV002',
    hoTen: 'Trần Thị Bình',
    ngaySinh: '22/07/2003',
    gioiTinh: 'Nữ',
    email: 'binh.tran@student.edu.vn',
    soDienThoai: '0987654321',
    lop: 'CNTT02',
    khoa: 'Công nghệ thông tin',
    gpa: 7.5,
    xepLoai: 'Khá',
  },
  {
    id: '3',
    maSV: 'SV003',
    hoTen: 'Lê Quang Cường',
    ngaySinh: '08/11/2002',
    gioiTinh: 'Nam',
    email: 'cuong.le@student.edu.vn',
    soDienThoai: '0934567890',
    lop: 'KT01',
    khoa: 'Kinh tế',
    gpa: 6.2,
    xepLoai: 'Trung bình',
  },
  {
    id: '4',
    maSV: 'SV004',
    hoTen: 'Phạm Thị Dung',
    ngaySinh: '30/01/2004',
    gioiTinh: 'Nữ',
    email: 'dung.pham@student.edu.vn',
    soDienThoai: '0923456789',
    lop: 'CNTT01',
    khoa: 'Công nghệ thông tin',
    gpa: 9.1,
    xepLoai: 'Giỏi',
  },
  {
    id: '5',
    maSV: 'SV005',
    hoTen: 'Hoàng Văn Em',
    ngaySinh: '14/05/2003',
    gioiTinh: 'Nam',
    email: 'em.hoang@student.edu.vn',
    soDienThoai: '0956789012',
    lop: 'XD01',
    khoa: 'Xây dựng',
    gpa: 4.8,
    xepLoai: 'Yếu',
  },
  {
    id: '6',
    maSV: 'SV006',
    hoTen: 'Võ Thị Phương',
    ngaySinh: '19/09/2003',
    gioiTinh: 'Nữ',
    email: 'phuong.vo@student.edu.vn',
    soDienThoai: '0978901234',
    lop: 'CNTT03',
    khoa: 'Công nghệ thông tin',
    gpa: 8.0,
    xepLoai: 'Khá',
  },
];
