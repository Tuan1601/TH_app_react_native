// ============================================================
// TYPES - Ứng dụng Quản Lý Học Tập Sinh Viên
// ============================================================

export * from './models';

// --- Sinh Viên ---
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
  xepLoai?: string;
}
export interface SinhVien {
  maSV: string;
  hoTen: string;
  ngaySinh: string;
  gioiTinh: 'Nam' | 'Nữ';
  email: string;
  soDienThoai: string;
  lop: string;
  nganh: string;
  khoaHoc: string;
  gpa: number;
}

// --- Môn Học ---
export interface MonHoc {
  id: string;
  maMon: string;
  tenMon: string;
  soTinChi: number | null;
  giangVien: string;
  phong: string;
  lich: string; // VD: "Thứ 2, 4 - Tiết 1-3"
  hocKy: string;
  moTa: string;
  mauSac: string;
  icon: string;
}

// --- Buổi Học (Thời Khóa Biểu) ---
export type ThuTrong = 'T2' | 'T3' | 'T4' | 'T5' | 'T6' | 'T7' | 'CN';

export interface BuoiHoc {
  id: string;
  monHocId: string;
  tenMon: string;
  thu: ThuTrong;
  tietBatDau: number;
  soTiet: number;
  phong: string;
  giangVien: string;
  loai: 'LT' | 'TH'; // Lý thuyết / Thực hành
  mauSac: string;
}

// --- Bài Tập ---
export type TrangThaiBaiTap = 'chua_lam' | 'dang_lam' | 'da_nop';

export interface BaiTap {
  id: string;
  monHocId: string;
  tenMon: string;
  tieuDe: string;
  moTa: string;
  hanNop: string; // ISO date string
  trangThai: TrangThaiBaiTap;
  loai: 'bai_tap' | 'bai_kiem_tra' | 'do_an' | 'tieu_luan';
  diem?: number;
  mauSac: string;
  uuTien: 'cao' | 'trung_binh' | 'thap';
}

// --- Navigation Param List ---
export type TabParamList = {
  TongQuan: undefined;
  MonHoc: undefined;
  ThoiKhoaBieu: undefined;
  BaiTap: undefined;
  CaNhan: undefined;
};

export type RootStackParamList = {
  MainTabs: undefined;
  ChiTietMonHoc: { monHoc: MonHoc };
  ChiTietBuoiHoc: { buoiHoc: BuoiHoc };
  ChiTietBaiTap: { baiTap: BaiTap };
  ChinhSuaCaNhan: { sinhVien: SinhVien };
};
