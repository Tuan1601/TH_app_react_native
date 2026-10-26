# Quản lý học tập

Ứng dụng React Native **CLI** (không dùng Expo) lấy dữ liệu từ mock REST API, có cache offline và hàng đợi thao tác chờ đồng bộ.

## Yêu cầu môi trường

- Node.js theo yêu cầu của React Native CLI trong `package.json`.
- Android Studio/Android SDK hoặc Xcode cho iOS.
- Điện thoại/emulator và máy chạy json-server cùng mạng khi dùng thiết bị thật.

## Chạy mock API

Từ thư mục dự án:

```sh
npm install
npm run server
```

json-server phục vụ dữ liệu trên cổng `3000`, host `0.0.0.0`, độ trễ 800 ms. Có thể kiểm tra `http://localhost:3000/courses`.

`src/config.js` đặt mặc định `http://10.0.2.2:3000` để Android Emulator truy cập máy chủ trên máy phát triển. Với điện thoại thật, sửa `BASE_URL` thành địa chỉ LAN của máy tính, ví dụ `http://192.168.1.20:3000`. iOS Simulator thường truy cập được qua `http://localhost:3000`.

## Chạy ứng dụng React Native CLI

Giữ json-server chạy trong terminal riêng, sau đó:

```sh
npm start
npm run android
```

Với iOS (macOS), cài Pods một lần/ sau khi thay đổi native dependency rồi chạy `npm run ios`.

## Luồng dữ liệu

```text
Màn hình → AppDataContext / useCachedQuery → Service → AsyncStorage cache
                                                   ↘ API json-server
Thao tác offline → AppDataContext → AsyncStorage Outbox → đồng bộ tuần tự khi online
```

GET đọc cache để hiển thị trước, sau đó lấy dữ liệu mới từ API khi có kết nối và ghi lại thời điểm cập nhật. Khi offline, các thay đổi bài tập và hồ sơ được áp dụng lạc quan trên giao diện và lưu theo thứ tự vào outbox. Khi mạng trở lại, ứng dụng gửi lần lượt; thao tác lỗi vẫn nằm trong hàng đợi để thử lại. Dữ liệu hồ sơ có `updatedAt`: trước khi áp dụng thay đổi hồ sơ trong outbox, ứng dụng so sánh thời điểm trên server với thời điểm thao tác offline. Nếu server mới hơn, giữ bản server, bỏ thao tác xung đột khỏi hàng đợi và thông báo cho người dùng.

## Kiểm thử

```sh
npm test
npm run lint
```

Tệp `db.json` gồm dữ liệu demo cho sinh viên, môn học, lịch học, bài tập và điểm số; thao tác POST/PATCH sẽ cập nhật trực tiếp tệp này khi json-server đang chạy.
