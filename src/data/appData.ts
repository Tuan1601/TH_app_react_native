import { SinhVien, MonHoc, BuoiHoc, BaiTap } from '../types';

export const NAM_HOC = '2025-2026';


export const SINH_VIEN: SinhVien = {
  maSV: 'B23DCCC171',
  hoTen: 'Nguyễn Anh Tuấn',
  ngaySinh: '17/01/2005',
  gioiTinh: 'Nam',
  email: 'tuan.naB23cc171@ptit.edu.vn',
  soDienThoai: '0912 345 678',
  lop: 'D23CNPM02',
  nganh: 'Công nghệ thông tin định hướng ứng dụng',
  khoaHoc: '2023 - 2027',
  gpa: 3.45,
};


export const MON_HOC_LIST: MonHoc[] = [
  {
    id: '1',
    maMon: 'Chưa cập nhật',
    tenMon: 'Lịch Sử Đảng',
    soTinChi: 2,
    giangVien: 'Nguyễn Thị Thơm',
    phong: '101_HQV',
    lich: 'Thứ 2 - 07:00-09:00',
    hocKy: `Năm học ${NAM_HOC}`,
    moTa: 'Thông tin mô tả môn học chưa được cập nhật.',
    mauSac: '#4F46E5',
    icon: 'book-open-page-variant',
  },
  {
    id: '2',
    maMon: 'Chưa cập nhật',
    tenMon: 'Lập Trình Web Nâng Cao',
    soTinChi: 3,
    giangVien: 'Ngô Văn Nhận',
    phong: '101_HQV',
    lich: 'Thứ 2 - 09:00-12:00',
    hocKy: `Năm học ${NAM_HOC}`,
    moTa: 'Thông tin mô tả môn học chưa được cập nhật.',
    mauSac: '#06B6D4',
    icon: 'web',
  },
  {
    id: '3',
    maMon: 'Chưa cập nhật',
    tenMon: 'Đảm bảo chất lượng phần mềm',
    soTinChi: 3,
    giangVien: 'Phạm Đình Chung',
    phong: '101_HQV',
    lich: 'Thứ 3 - 07:00-09:00',
    hocKy: `Năm học ${NAM_HOC}`,
    moTa: 'Thông tin mô tả môn học chưa được cập nhật.',
    mauSac: '#10B981',
    icon: 'check-decagram-outline',
  },
  {
    id: '4',
    maMon: 'Chưa cập nhật',
    tenMon: 'Phát triển phần mềm hướng dịch vụ',
    soTinChi: 3,
    giangVien: 'Nguyễn Việt Dũng',
    phong: '101_HQV',
    lich: 'Thứ 3 - 09:00-12:00',
    hocKy: `Năm học ${NAM_HOC}`,
    moTa: 'Thông tin mô tả môn học chưa được cập nhật.',
    mauSac: '#F59E0B',
    icon: 'cloud-cog-outline',
  },
  {
    id: '5',
    maMon: 'Chưa cập nhật',
    tenMon: 'Phát triển ứng dụng di động đa nền tảng',
    soTinChi: 3,
    giangVien: 'Trần Quang Đại',
    phong: '102_HQV',
    lich: 'Thứ 4 - 07:00-09:00',
    hocKy: `Năm học ${NAM_HOC}`,
    moTa: 'Thông tin mô tả môn học chưa được cập nhật.',
    mauSac: '#EF4444',
    icon: 'cellphone',
  },
  {
    id: '6',
    maMon: 'Chưa cập nhật',
    tenMon: 'Phân tích nghiệp vụ',
    soTinChi: 3,
    giangVien: 'Vũ Văn Thương',
    phong: '102_HQV',
    lich: 'Thứ 4 - 09:00-12:00',
    hocKy: `Năm học ${NAM_HOC}`,
    moTa: 'Thông tin mô tả môn học chưa được cập nhật.',
    mauSac: '#8B5CF6',
    icon: 'clipboard-text-search-outline',
  },
];




export const THOI_KHOA_BIEU: BuoiHoc[] = [
  {
    id: 'tkb1',
    monHocId: '1',
    tenMon: 'Lịch Sử Đảng',
    thu: 'T2',
    tietBatDau: 1,
    soTiet: 2,
    phong: '101_HQV',
    giangVien: 'Nguyễn Thị Thơm',
    loai: 'LT',
    mauSac: '#4F46E5',
  },
  {
    id: 'tkb2',
    monHocId: '2',
    tenMon: 'Lập Trình Web Nâng Cao',
    thu: 'T2',
    tietBatDau: 3,
    soTiet: 3,
    phong: '101_HQV',
    giangVien: 'Ngô Văn Nhận',
    loai: 'TH',
    mauSac: '#06B6D4',
  },
  {
    id: 'tkb3',
    monHocId: '3',
    tenMon: 'Đảm bảo chất lượng phần mềm',
    thu: 'T3',
    tietBatDau: 1,
    soTiet: 2,
    phong: '101_HQV',
    giangVien: 'Phạm Đình Chung',
    loai: 'LT',
    mauSac: '#10B981',
  },
  {
    id: 'tkb4',
    monHocId: '4',
    tenMon: 'Phát triển phần mềm hướng dịch vụ',
    thu: 'T3',
    tietBatDau: 3,
    soTiet: 3,
    phong: '101_HQV',
    giangVien: 'Nguyễn Việt Dũng',
    loai: 'LT',
    mauSac: '#F59E0B',
  },
  {
    id: 'tkb5',
    monHocId: '5',
    tenMon: 'Phát triển ứng dụng di động đa nền tảng',
    thu: 'T4',
    tietBatDau: 1,
    soTiet: 2,
    phong: '102_HQV',
    giangVien: 'Trần Quang Đại',
    loai: 'TH',
    mauSac: '#EF4444',
  },
  {
    id: 'tkb6',
    monHocId: '6',
    tenMon: 'Phân tích nghiệp vụ',
    thu: 'T4',
    tietBatDau: 3,
    soTiet: 3,
    phong: '102_HQV',
    giangVien: 'Vũ Văn Thương',
    loai: 'LT',
    mauSac: '#8B5CF6',
  },
];


export const BAI_TAP_LIST: BaiTap[] = [
  {
    id: 'bt1',
    monHocId: '1',
    tenMon: 'Lịch Sử Đảng',
    tieuDe: 'Tiểu luận: Vai trò lãnh đạo của Đảng qua các thời kỳ',
    moTa:
      'Trình bày một giai đoạn hoặc sự kiện tiêu biểu trong lịch sử Đảng Cộng sản Việt Nam. Phân tích bối cảnh, chủ trương, kết quả và ý nghĩa lịch sử; trích dẫn tài liệu tham khảo.',
    hanNop: '2026-10-18T23:59:00',
    trangThai: 'dang_lam',
    loai: 'bai_tap',
    mauSac: '#4F46E5',
    uuTien: 'cao',
  },
  {
    id: 'bt2',
    monHocId: '2',
    tenMon: 'Lập Trình Web Nâng Cao',
    tieuDe: 'Xây dựng ứng dụng web quản lý dữ liệu',
    moTa:
      'Phát triển ứng dụng web có giao diện responsive và các chức năng xem, thêm, sửa, xóa dữ liệu. Kết nối giao diện với API, kiểm tra dữ liệu đầu vào và xử lý các trạng thái tải/lỗi.',
    hanNop: '2026-10-20T23:59:00',
    trangThai: 'chua_lam',
    loai: 'bai_tap',
    mauSac: '#06B6D4',
    uuTien: 'cao',
  },
  {
    id: 'bt3',
    monHocId: '3',
    tenMon: 'Đảm bảo chất lượng phần mềm',
    tieuDe: 'Lập kế hoạch kiểm thử cho một chức năng phần mềm',
    moTa:
      'Chọn một chức năng phần mềm, xác định yêu cầu và rủi ro, sau đó lập kế hoạch kiểm thử. Viết các test case gồm dữ liệu đầu vào, bước thực hiện và kết quả mong đợi; phân loại kiểm thử phù hợp.',
    hanNop: '2026-11-30T23:59:00',
    trangThai: 'dang_lam',
    loai: 'do_an',
    mauSac: '#10B981',
    uuTien: 'cao',
  },
  {
    id: 'bt4',
    monHocId: '4',
    tenMon: 'Phát triển phần mềm hướng dịch vụ',
    tieuDe: 'Thiết kế dịch vụ REST cho hệ thống bán hàng',
    moTa:
      'Đề xuất các dịch vụ cho hệ thống bán hàng, mô tả trách nhiệm và API của từng dịch vụ. Thiết kế endpoint REST, cấu trúc request/response và cách xử lý lỗi; trình bày cách các dịch vụ trao đổi dữ liệu.',
    hanNop: '2026-10-25T23:59:00',
    trangThai: 'chua_lam',
    loai: 'do_an',
    mauSac: '#F59E0B',
    uuTien: 'trung_binh',
  },
  {
    id: 'bt5',
    monHocId: '5',
    tenMon: 'Phát triển ứng dụng di động đa nền tảng',
    tieuDe: 'Xây dựng ứng dụng di động đa nền tảng',
    moTa:
      'Xây dựng ứng dụng chạy trên iOS và Android bằng framework đa nền tảng. Tạo các màn hình và điều hướng, quản lý trạng thái, gọi API và xử lý dữ liệu phù hợp trên thiết bị di động.',
    hanNop: '2026-10-22T07:00:00',
    trangThai: 'chua_lam',
    loai: 'do_an',
    mauSac: '#EF4444',
    uuTien: 'cao',
  },
  {
    id: 'bt6',
    monHocId: '6',
    tenMon: 'Phân tích nghiệp vụ',
    tieuDe: 'Phân tích yêu cầu cho hệ thống quản lý đăng ký học phần',
    moTa:
      'Xác định các bên liên quan, phạm vi và yêu cầu của hệ thống. Mô tả quy trình nghiệp vụ hiện tại/đề xuất, lập danh sách yêu cầu chức năng và phi chức năng, đồng thời xây dựng use case hoặc user story.',
    hanNop: '2026-10-05T23:59:00',
    trangThai: 'da_nop',
    loai: 'tieu_luan',
    diem: 9.5,
    mauSac: '#8B5CF6',
    uuTien: 'thap',
  },
  {
    id: 'bt7',
    monHocId: '2',
    tenMon: 'Lập Trình Web Nâng Cao',
    tieuDe: 'Kiểm tra xác thực và phân quyền trên ứng dụng web',
    moTa:
      'Bổ sung đăng nhập và phân quyền cho ứng dụng web. Kiểm tra các luồng đăng nhập hợp lệ/không hợp lệ, bảo vệ các chức năng theo quyền và hiển thị thông báo phù hợp.',
    hanNop: '2026-10-08T23:59:00',
    trangThai: 'da_nop',
    loai: 'bai_tap',
    diem: 8.0,
    mauSac: '#06B6D4',
    uuTien: 'thap',
  },
];


export const getTietTime = (tiet: number): string => {
  const TIET_TIMES: Record<number, string> = {
    1: '07:00',
    2: '08:00',
    3: '09:00',
    4: '10:00',
    5: '11:00',
    6: '12:00',
    7: '13:00',
    8: '14:00',
    9: '15:00',
    10: '16:00',
    11: '17:00',
    12: '18:00',
  };
  return TIET_TIMES[tiet] || '07:00';
};

export const getTietEndTime = (tietBatDau: number, soTiet: number): string => {
  const endTiet = tietBatDau + soTiet - 1;
  const startParts = getTietTime(endTiet).split(':');
  const endMinutes = parseInt(startParts[0]) * 60 + parseInt(startParts[1]) + 60;
  const h = Math.floor(endMinutes / 60);
  const m = endMinutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
};

export const getThuLabel = (thu: string): string => {
  const map: Record<string, string> = {
    T2: 'Thứ Hai',
    T3: 'Thứ Ba',
    T4: 'Thứ Tư',
    T5: 'Thứ Năm',
    T6: 'Thứ Sáu',
    T7: 'Thứ Bảy',
    CN: 'Chủ Nhật',
  };
  return map[thu] || thu;
};

export const formatHanNop = (dateStr: string): string => {
  const d = new Date(dateStr);
  const now = new Date();
  const diffMs = d.getTime() - now.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  const timeStr = `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  const dateFormatted = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

  if (diffDays < 0) return `Quá hạn (${dateFormatted})`;
  if (diffDays === 0) return `Hôm nay ${timeStr}`;
  if (diffDays === 1) return `Ngày mai ${timeStr}`;
  return `${dateFormatted} ${timeStr} (còn ${diffDays} ngày)`;
};

export const getLoaiBaiTapLabel = (loai: string): string => {
  const map: Record<string, string> = {
    bai_tap: 'Bài tập',
    bai_kiem_tra: 'Kiểm tra',
    do_an: 'Đồ án',
    tieu_luan: 'Tiểu luận',
  };
  return map[loai] || loai;
};

export const getTrangThaiLabel = (tt: string): string => {
  const map: Record<string, string> = {
    chua_lam: 'Chưa làm',
    dang_lam: 'Đang làm',
    da_nop: 'Đã nộp',
  };
  return map[tt] || tt;
};
