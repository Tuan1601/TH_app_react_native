export interface Student {
  id: string;
  maSV: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: 'Nam' | 'Nữ';
  email: string;
  soDienThoai: string;
  lop: string;
  khoa: string;
  gpa: number;
  xepLoai: string;
}

export type RootStackParamList = {
  DanhSach: undefined;
  ChiTiet: { student: Student };
  ThemSinhVien: undefined;
  ChinhSua: { student: Student };
};
