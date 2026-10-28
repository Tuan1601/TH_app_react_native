Bạn là Senior React Native Developer, có kinh nghiệm xây dựng ứng dụng React Native CLI bằng TypeScript, React Navigation và AsyncStorage. Hãy trực tiếp xây dựng cho tôi một ứng dụng di động quản lý thư viện sách hoàn chỉnh, giao diện đẹp, code sạch, ít lỗi và đáp ứng tối đa tất cả tiêu chí chấm điểm của đề bài bên dưới.

## 1. BỐI CẢNH DỰ ÁN

Tôi đã tạo dự án React Native CLI và cài đặt các thư viện cần thiết, bao gồm:

- @react-navigation/native
- @react-navigation/native-stack
- react-native-screens
- react-native-safe-area-context
- @react-native-async-storage/async-storage
- react-native-vector-icons

Yêu cầu bắt buộc:
- Làm việc trực tiếp trên dự án hiện tại.
- Trước khi code, kiểm tra cấu trúc thư mục, package.json, phiên bản React Native và các file đang có.
- Tận dụng thư viện đã cài, không tự ý cài lại toàn bộ thư viện.
- Không chuyển sang Expo.
- Không sử dụng thư viện bên thứ ba không cần thiết.
- Sử dụng TypeScript (.tsx, .ts) nếu dự án hiện tại đã dùng TypeScript.
- Nếu dự án đang dùng JavaScript, giữ nguyên JavaScript và không chuyển đổi toàn bộ dự án.
- Không viết code giả lập, pseudocode, TODO hoặc bỏ trống chức năng.
- Không thay thế yêu cầu bằng giao diện demo không có logic thật.
- Không xóa các cấu hình hiện có nếu chưa xác định chúng không cần thiết.
- Mọi import, export, đường dẫn file và kiểu dữ liệu phải nhất quán.
- Không dùng API lỗi thời nếu phiên bản hiện tại đã có API thay thế.
- Không chỉnh sửa Android native tùy tiện khi không cần thiết.

## 2. MỤC TIÊU ỨNG DỤNG

Xây dựng ứng dụng quản lý thư viện sách dành cho thủ thư, gồm 3 màn hình chính:

1. Danh sách sách.
2. Thêm/Sửa sách dùng chung một form.
3. Chi tiết sách và chức năng mượn/trả.

Sử dụng React Navigation Native Stack để chuyển màn hình.

Thiết kế theo phong cách ứng dụng quản lý thư viện hiện đại, chuyên nghiệp, dễ sử dụng, giao diện đồng nhất trên Android.

## 3. MÔ HÌNH DỮ LIỆU

Tạo kiểu dữ liệu Book thống nhất trong toàn bộ ứng dụng:

- id: string
- title: string, bắt buộc.
- author: string, bắt buộc.
- category: một trong các giá trị:
  - Giáo trình
  - Tiểu thuyết
  - Khoa học
  - Thiếu nhi
- year: number, từ 1900 đến năm hiện tại.
- quantity: number, số nguyên lớn hơn 0.
- borrowed: number, số nguyên không âm, mặc định bằng 0.

ID tự sinh bằng Date.now().toString() hoặc cơ chế an toàn hơn nếu cần tránh trùng ID.

Quy tắc nghiệp vụ:
- Số sách còn lại = quantity - borrowed.
- borrowed không được âm.
- borrowed không được lớn hơn quantity.
- quantity không được nhỏ hơn borrowed.
- Không được cho mượn khi số sách còn lại bằng 0.
- Không được nhận trả khi borrowed bằng 0.
- Không được xóa sách đang có người mượn.

Khi chạy lần đầu, tự động khởi tạo ít nhất 5 sách mẫu thuộc nhiều thể loại khác nhau.

Chỉ khởi tạo dữ liệu mẫu khi chưa có dữ liệu lưu trữ. Không được ghi đè dữ liệu của người dùng khi khởi động lại ứng dụng.

## 4. CÂU 1 – MÀN HÌNH DANH SÁCH SÁCH

Dùng FlatList để hiển thị danh sách sách.

Mỗi sách phải được hiển thị trong một card riêng, bao gồm:
- Tên sách nổi bật, font đậm.
- Tác giả.
- Thể loại, trình bày bằng badge.
- Năm xuất bản.
- Số lượng tổng.
- Số lượng đang mượn.
- Số lượng còn lại = quantity - borrowed.
- Nhãn “Hết sách” màu đỏ khi số lượng còn lại bằng 0.

Phần đầu màn hình cần có:
- Tiêu đề “Quản lý thư viện”.
- Tổng số đầu sách, tính bằng books.length.
- Tổng số cuốn đang được mượn, tính bằng tổng borrowed của tất cả sách.
- Nút “+ Thêm sách”.

Yêu cầu:
- FlatList có keyExtractor ổn định theo id.
- Tối ưu render bằng React.memo hoặc useCallback khi thực sự cần thiết.
- Không tạo key bằng index.
- Có trạng thái loading khi khôi phục dữ liệu nếu cần.
- Có giao diện empty state khi danh sách rỗng hoặc không có kết quả tìm kiếm.
- Nhấn vào card sẽ mở màn hình Chi tiết.
- Nhấn giữ card bằng onLongPress sẽ kích hoạt quy trình xóa sách.
- Không để thao tác nhấn giữ đồng thời vô tình mở màn hình chi tiết.

## 5. CÂU 2 – THÊM VÀ SỬA SÁCH

Tạo một BookFormScreen dùng chung cho cả thêm và sửa.

Sử dụng Stack Navigation để điều hướng từ danh sách đến form.

Chế độ thêm:
- Các trường nhập ban đầu để trống, trừ giá trị mặc định hợp lý nếu cần.
- Tự sinh id.
- borrowed mặc định bằng 0.

Chế độ sửa:
- Truyền id sách qua route params.
- Tự động tìm sách theo id và điền dữ liệu cũ vào form.
- Không tạo bản ghi mới khi sửa.
- Giữ nguyên borrowed hiện tại.
- Không được làm mất dữ liệu mượn/trả trong quá trình cập nhật.

Các trường form:
1. Tên sách.
2. Tác giả.
3. Thể loại: dùng danh sách lựa chọn gồm đúng 4 thể loại.
4. Năm xuất bản.
5. Tổng số cuốn.

Validation:
- Tên sách không được để trống.
- Tác giả không được để trống.
- Năm xuất bản phải là số nguyên từ 1900 đến năm hiện tại.
- Số lượng phải là số nguyên lớn hơn 0.
- Khi sửa, quantity không được nhỏ hơn borrowed hiện tại.
- Không chấp nhận NaN, Infinity, số thập phân hoặc chuỗi chỉ chứa khoảng trắng.
- Chuẩn hóa khoảng trắng đầu/cuối cho tên sách và tác giả.
- Không cho lưu nếu có lỗi.

Hiển thị thông báo lỗi ngay bên dưới trường tương ứng.

Khi trường sai:
- Viền input chuyển màu đỏ.
- Hiển thị thông báo dễ hiểu bằng tiếng Việt.
- Khi người dùng sửa dữ liệu hợp lệ, cập nhật lỗi phù hợp.
- Không chỉ dùng Alert để báo lỗi validation.

Form cần có:
- Nút “Lưu sách”.
- Nút “Hủy”.
- Chặn việc bấm lưu nhiều lần liên tiếp.
- Hiển thị trạng thái đang lưu nếu phù hợp.

Sử dụng KeyboardAvoidingView và ScrollView để bàn phím không che nội dung.

Dùng keyboardType phù hợp:
- Năm xuất bản: numeric hoặc number-pad.
- Số lượng: numeric hoặc number-pad.
- Tên sách, tác giả: bàn phím văn bản.

Không cho người dùng sửa trực tiếp borrowed trong form thông thường.

## 6. CÂU 3 – XÓA SÁCH

Nhấn giữ một card trong FlatList bằng onLongPress để xóa.

Mọi thao tác xóa phải có Alert xác nhận với:
- Tiêu đề: “Xác nhận xóa”.
- Nội dung thông báo tên sách sẽ bị xóa.
- Hai lựa chọn “Hủy” và “Xóa”.

Quy tắc:
- Nếu borrowed > 0, không cho xóa.
- Khi không thể xóa, hiển thị Alert thông báo sách đang có người mượn.
- Nếu borrowed = 0, chỉ xóa sau khi người dùng xác nhận.
- Khi xóa, cập nhật state và AsyncStorage.
- Không xóa nhầm sách khi danh sách thay đổi.
- Nếu sách đang được mở ở màn hình chi tiết và bị xóa bởi một luồng hợp lệ khác, phải xử lý trạng thái không còn tồn tại an toàn.

## 7. CÂU 4 – CHI TIẾT VÀ MƯỢN/TRẢ

Tạo BookDetailScreen hiển thị đầy đủ thông tin:
- Tên sách.
- Tác giả.
- Thể loại.
- Năm xuất bản.
- Tổng số lượng.
- Số lượng đang được mượn.
- Số lượng còn lại.
- Trạng thái còn sách hoặc hết sách.

Có nút “Cho mượn”:
- Tăng borrowed lên 1.
- Chỉ cho mượn khi quantity - borrowed > 0.
- Nếu hết sách, nút bị disabled và có màu xám.

Có nút “Nhận trả”:
- Giảm borrowed xuống 1.
- Chỉ cho nhận trả khi borrowed > 0.
- Nếu borrowed = 0, nút bị disabled và có màu xám.

Sau khi mượn/trả:
- Cập nhật state dùng chung.
- Cập nhật ngay số lượng trên màn hình chi tiết.
- Khi quay lại danh sách, thông tin phải được cập nhật chính xác.
- Lưu thay đổi xuống AsyncStorage.
- Không để borrowed âm hoặc lớn hơn quantity.
- Không dùng dữ liệu route params cũ làm nguồn dữ liệu duy nhất.
- Tìm sách hiện tại theo id từ state dùng chung.

Cần xử lý an toàn trường hợp sách không còn tồn tại.

## 8. CÂU 5 – TÌM KIẾM VÀ LỌC

Trên màn hình danh sách, tạo ô tìm kiếm theo:
- Tên sách.
- Tác giả.

Yêu cầu:
- Không phân biệt chữ hoa và chữ thường.
- Loại bỏ khoảng trắng thừa ở đầu/cuối khi so sánh.
- Tìm kiếm theo chuỗi con.
- Khi không có kết quả, hiển thị empty state rõ ràng.

Tạo hàng bộ lọc thể loại:
- Tất cả.
- Giáo trình.
- Tiểu thuyết.
- Khoa học.
- Thiếu nhi.

Yêu cầu:
- Nút đang chọn được làm nổi bật bằng màu nền và màu chữ.
- Các nút còn lại có giao diện trung tính.
- Có thể cuộn ngang nếu màn hình hẹp.
- Tìm kiếm và lọc thể loại phải hoạt động đồng thời.
- Khi chọn “Tất cả”, chỉ bỏ bộ lọc thể loại, không xóa từ khóa tìm kiếm.
- Không sửa hoặc xóa dữ liệu gốc khi lọc.
- Tổng số đầu sách và tổng số đang mượn phải tính trên toàn bộ thư viện, không tính riêng kết quả đã lọc.

## 9. CÂU 6 – LƯU TRỮ ASYNCSTORAGE

Sử dụng @react-native-async-storage/async-storage.

Yêu cầu:
- Có một key lưu trữ thống nhất, ví dụ @library_app/books.
- Khi khởi động, đọc dữ liệu từ AsyncStorage.
- Nếu chưa tồn tại dữ liệu, khởi tạo 5–8 sách mẫu và lưu lại.
- Nếu đã có dữ liệu, khôi phục đúng dữ liệu đó.
- Không tự động ghi đè dữ liệu có sẵn bằng dữ liệu mẫu.
- Nếu JSON bị lỗi khi parse, xử lý an toàn và không làm ứng dụng crash.
- Có xử lý try/catch cho thao tác đọc và ghi.
- Không ghi đè dữ liệu mới bằng kết quả đọc bất đồng bộ cũ.
- Sau mỗi thao tác thêm, sửa, xóa, mượn hoặc trả, dữ liệu phải được lưu.
- Đảm bảo các thao tác cập nhật không làm mất thay đổi trước đó do race condition.

Ưu tiên tạo custom hook useBooks hoặc một BookContext kết hợp useReducer để quản lý state dùng chung.

Hãy chọn một kiến trúc đơn giản, nhất quán và phù hợp với bài tập. Không triển khai Redux hoặc kiến trúc phức tạp không cần thiết.

Nếu dùng Context, cung cấp đầy đủ trạng thái, hàm xử lý và cách sử dụng cho cả 3 màn hình.

## 10. CÂU 7 – THIẾT KẾ GIAO DIỆN

Thiết kế giao diện đẹp, đồng nhất, có tính ứng dụng thực tế và phù hợp với ứng dụng quản lý thư viện.

Phong cách:
- Modern, clean, professional.
- Màu chủ đạo xanh navy hoặc xanh dương đậm, kết hợp nền sáng và màu nhấn phù hợp.
- Card bo góc, khoảng cách hợp lý, đổ bóng vừa phải.
- Phân cấp typography rõ ràng.
- Không dùng quá nhiều màu sắc.
- Hạn chế emoji; ưu tiên icon phù hợp từ thư viện đã cài.
- Không để giao diện trông như màn hình mặc định chưa được thiết kế.

Tạo file theme/colors và file theme/typography hoặc theme/index để quản lý:
- Bảng màu.
- Cỡ chữ.
- Font weight.
- Khoảng cách.
- Border radius.
- Các giá trị giao diện dùng chung.

Yêu cầu:
- Sử dụng StyleSheet.create cho style.
- Hạn chế style inline.
- Tái sử dụng component khi hợp lý.
- Card có elevation trên Android và shadow trên iOS nếu có hỗ trợ.
- Có trạng thái pressed cho nút.
- Nút disabled có màu sắc và độ tương phản khác biệt.
- Input sai có viền đỏ.
- Danh sách rỗng có icon, tiêu đề và hướng dẫn phù hợp.
- Các màn hình có cùng phong cách.
- Tôn trọng Safe Area, status bar và tai thỏ.
- Không để nội dung bị che bởi thanh trạng thái hoặc bàn phím.
- Các nút phải có vùng chạm đủ lớn.
- Nội dung dài phải xuống dòng hợp lý.
- Kiểm tra trên màn hình Android kích thước nhỏ.
- Không dùng màu chữ nhạt khó đọc trên nền sáng.

## 11. KIẾN TRÚC VÀ CẤU TRÚC THƯ MỤC

Hãy xem cấu trúc hiện có trước khi quyết định tổ chức file. Nếu dự án chưa có cấu trúc rõ ràng, có thể sử dụng cấu trúc gợi ý:

src/
  components/
    BookCard.tsx
    SearchBar.tsx
    CategoryFilter.tsx
    StatCard.tsx
    EmptyState.tsx
    AppButton.tsx
  context/
    BookContext.tsx
  hooks/
    useBooks.ts
  navigation/
    AppNavigator.tsx
    types.ts
  screens/
    BookListScreen.tsx
    BookFormScreen.tsx
    BookDetailScreen.tsx
  services/
    bookStorage.ts
  types/
    book.ts
  theme/
    colors.ts
    typography.ts
    spacing.ts
    index.ts

Có thể điều chỉnh cấu trúc để phù hợp dự án thực tế, nhưng phải giữ code dễ đọc, dễ kiểm tra và dễ bảo trì.

Yêu cầu:
- Khai báo kiểu dữ liệu Book.
- Khai báo kiểu route params cho Native Stack.
- Tránh dùng any nếu có thể.
- Không lặp lại logic lưu trữ ở nhiều màn hình.
- Tách logic nghiệp vụ ra khỏi giao diện khi hợp lý.
- Có một nguồn state thống nhất.
- Không tạo nhiều bản sao state dễ lệch dữ liệu.
- Không đặt toàn bộ ứng dụng vào một file quá dài.

## 12. YÊU CẦU VỀ ĐỘ ỔN ĐỊNH VÀ TÍNH ĐÚNG ĐẮN

Kiểm tra các tình huống sau:

1. Mở ứng dụng lần đầu: có sách mẫu.
2. Thêm sách hợp lệ: sách xuất hiện trong danh sách.
3. Thêm sách thiếu tên: không lưu và hiện lỗi đúng vị trí.
4. Thêm sách thiếu tác giả: không lưu và hiện lỗi đúng vị trí.
5. Nhập năm nhỏ hơn 1900: không lưu.
6. Nhập năm lớn hơn năm hiện tại: không lưu.
7. Nhập quantity bằng 0 hoặc số âm: không lưu.
8. Nhập quantity là số thập phân: không lưu.
9. Sửa tên sách: cập nhật đúng bản ghi.
10. Sửa quantity nhỏ hơn borrowed: không lưu.
11. Xóa sách không có người mượn: phải xác nhận trước khi xóa.
12. Xóa sách đang có người mượn: bị chặn.
13. Mượn sách còn hàng: borrowed tăng đúng 1.
14. Mượn sách hết hàng: bị chặn.
15. Trả sách đang được mượn: borrowed giảm đúng 1.
16. Trả sách có borrowed bằng 0: bị chặn.
17. Tìm kiếm theo tên và tác giả không phân biệt hoa thường.
18. Kết hợp tìm kiếm với lọc thể loại.
19. Tắt và mở lại ứng dụng: dữ liệu không mất.
20. Chỉnh sửa hoặc mượn/trả rồi quay lại danh sách: dữ liệu được đồng bộ.
21. Danh sách rỗng và tìm kiếm không có kết quả: giao diện vẫn hợp lệ.
22. Thao tác liên tục nhanh: không tạo dữ liệu sai hoặc ghi đè state.
23. Dữ liệu AsyncStorage lỗi: ứng dụng không crash.
24. Điều hướng và quay lại màn hình: không có lỗi route hoặc màn hình sử dụng dữ liệu cũ.

## 13. QUY TRÌNH LÀM VIỆC BẮT BUỘC

Thực hiện theo các giai đoạn sau.

Giai đoạn 1 – Kiểm tra:
- Đọc cấu trúc thư mục dự án.
- Đọc package.json.
- Kiểm tra phiên bản và cách khởi tạo App hiện tại.
- Xác định thư viện đã cài.
- Phát hiện xung đột hoặc thiếu dependency nếu có.
- Chỉ ra những file cần tạo hoặc chỉnh sửa.

Giai đoạn 2 – Triển khai:
- Xây dựng mô hình dữ liệu và theme.
- Xây dựng service AsyncStorage.
- Xây dựng state management.
- Xây dựng Navigation.
- Xây dựng các component dùng chung.
- Xây dựng lần lượt 3 màn hình.
- Tích hợp toàn bộ logic và giao diện.
- Kiểm tra lại import, export và đường dẫn.

Giai đoạn 3 – Kiểm thử:
- Chạy TypeScript check nếu dự án dùng TypeScript.
- Chạy ESLint hoặc test nếu dự án đã có cấu hình phù hợp.
- Kiểm tra các lỗi cú pháp, kiểu dữ liệu, navigation và state.
- Sửa lỗi thực tế tìm thấy.
- Không tuyên bố ứng dụng đã chạy thành công nếu chưa thực sự chạy hoặc kiểm tra được.
- Nếu có thể sử dụng Android emulator, chạy ứng dụng và kiểm tra log.
- Nếu không thể chạy emulator, cung cấp chính xác lệnh để tôi tự chạy và nêu rõ phần chưa kiểm chứng.

Giai đoạn 4 – Bàn giao:
- Liệt kê các file đã tạo và sửa.
- Giải thích ngắn gọn kiến trúc và luồng dữ liệu.
- Cung cấp lệnh chạy ứng dụng phù hợp với dự án hiện tại.
- Cung cấp checklist tự kiểm tra đủ 7 câu của đề bài.
- Nêu những vấn đề còn tồn tại nếu có.

## 14. CÁCH THỰC HIỆN KHI DÙNG AI LẬP TRÌNH

Nếu đang làm việc trong Cursor hoặc môi trường có quyền đọc/ghi file:
- Hãy trực tiếp kiểm tra và chỉnh sửa các file trong workspace.
- Không chỉ trả lời bằng hướng dẫn hoặc ví dụ.
- Sau khi sửa, kiểm tra lại các file liên quan và chạy các lệnh kiểm tra khả thi.

Nếu chỉ làm việc qua cửa sổ chat và không thể truy cập dự án:
- Trước tiên yêu cầu tôi gửi cây thư mục dự án và nội dung package.json.
- Sau khi có thông tin, cung cấp từng file hoàn chỉnh với đường dẫn cụ thể.
- Mỗi file phải có đầy đủ nội dung, không dùng dấu ba chấm để bỏ qua code.
- Đảm bảo các file có thể kết nối với nhau trực tiếp.
- Nếu câu trả lời dài, chia thành các phần có đánh số và tiếp tục từ đúng vị trí, không viết lại hoặc thay đổi kiến trúc giữa chừng.

Ưu tiên code ổn định, dễ hiểu đối với sinh viên, dễ trình bày khi bảo vệ bài tập và dễ đối chiếu với rubric chấm điểm.

## 15. ĐIỀU KIỆN HOÀN THÀNH

Chỉ coi bài làm hoàn thành khi:
- Cả 3 màn hình hoạt động.
- Đủ chức năng thêm, sửa, xóa, chi tiết, mượn, trả, tìm kiếm và lọc.
- Validation chính xác.
- AsyncStorage hoạt động và dữ liệu tồn tại sau khi mở lại ứng dụng.
- Có tối thiểu 5 sách mẫu ở lần chạy đầu tiên.
- Đảm bảo các ràng buộc quantity và borrowed.
- UI đồng nhất, responsive và có phản hồi thao tác.
- Không có lỗi import hoặc route đã biết.
- Các lệnh kiểm tra khả thi đã được chạy và kết quả được báo cáo trung thực.

Bây giờ hãy bắt đầu bằng Giai đoạn 1: kiểm tra dự án hiện tại. Không tự ý tạo lại dự án và không bỏ qua bước kiểm tra trước khi code.