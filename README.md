# ChatApp — Ứng dụng Chat 1-1 Realtime (React Native CLI + TypeScript + Firebase)

Ứng dụng nhắn tin cá nhân 1-1 Realtime xây dựng bằng **React Native CLI**, **TypeScript**, **Firebase Authentication**, **Firebase Realtime Database**, **React Navigation** và **@react-native-community/geolocation**.

---

## 1. Cấu trúc thư mục dự án

```text
ChatApp/
├── src/
│   ├── assets/
│   │   └── images/
│   ├── components/
│   │   ├── AppHeader.tsx
│   │   ├── Avatar.tsx
│   │   ├── ChatBubble.tsx
│   │   ├── ContactItem.tsx
│   │   ├── ConversationItem.tsx
│   │   ├── EmptyState.tsx
│   │   ├── Loading.tsx
│   │   └── OnlineIndicator.tsx
│   ├── constants/
│   │   ├── colors.ts
│   │   └── config.ts
│   ├── contexts/
│   │   └── AuthContext.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useContacts.ts
│   │   ├── useConversations.ts
│   │   └── useMessages.ts
│   ├── navigation/
│   │   ├── AuthNavigator.tsx
│   │   ├── MainTabNavigator.tsx
│   │   ├── RootNavigator.tsx
│   │   └── types.ts
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── chat/
│   │   │   └── ChatScreen.tsx
│   │   └── main/
│   │       ├── ContactsScreen.tsx
│   │       ├── HomeScreen.tsx
│   │       ├── NotificationsScreen.tsx
│   │       └── SettingsScreen.tsx
│   ├── services/
│   │   ├── authService.ts
│   │   ├── chatService.ts
│   │   ├── firebase.ts
│   │   ├── locationService.ts
│   │   ├── notificationService.ts
│   │   ├── presenceService.ts
│   │   └── userService.ts
│   ├── types/
│   │   ├── conversation.ts
│   │   ├── message.ts
│   │   ├── notification.ts
│   │   └── user.ts
│   └── utils/
│       ├── chatUtils.ts
│       ├── dateUtils.ts
│       ├── errorUtils.ts
│       └── validation.ts
├── App.tsx
└── database.rules.json
```

---

## 2. Cấu hình Firebase trước khi chạy

1. Mở [src/constants/config.ts](./src/constants/config.ts) và thay thế toàn bộ giá trị `YOUR_...` trong `FIREBASE_CONFIG` bằng thông tin Web App từ Firebase Console.
2. Trong Firebase Console:
   - **Authentication → Sign-in method**: Bật **Email/Password**.
   - **Realtime Database → Rules**: Dán toàn bộ nội dung file [database.rules.json](./database.rules.json) và nhấn **Publish**.

---

## 3. Lệnh chạy ứng dụng (PowerShell trên Windows)

```powershell
# 1. Di chuyển vào thư mục dự án
cd D:\Androids\ChatApp

# 2. Kiểm tra TypeScript và ESLint
npx tsc --noEmit
npx eslint App.tsx src --ext .ts,.tsx

# 3. Khởi chạy Metro Bundler (Terminal 1)
npx react-native start --reset-cache

# 4. Build và cài lên máy ảo Android (Terminal 2)
npx react-native run-android
```

---

## 4. Hướng dẫn kiểm thử trên 2 máy ảo Android

1. Mở **Android Studio → Virtual Device Manager** và khởi động **2 máy ảo** (ví dụ `emulator-5554` và `emulator-5556`).
2. Kiểm tra danh sách thiết bị đang kết nối:
   ```powershell
   & "$env:LOCALAPPDATA\Android\Sdk\platform-tools\adb.exe" devices
   ```
3. Chạy lệnh `npx react-native run-android` — ứng dụng sẽ được cài đặt lên các máy ảo đang mở.
4. Trên **Máy ảo 1**: Đăng ký tài khoản **User A** (`a@gmail.com`).
5. Trên **Máy ảo 2**: Đăng ký tài khoản **User B** (`b@gmail.com`).
6. Cấu hình tọa độ GPS cho máy ảo để test gửi vị trí:
   - Nhấn nút **`...` (Extended Controls)** trên thanh công cụ bên cạnh máy ảo → chọn **Location** → chọn một điểm trên bản đồ (ví dụ Hồ Hoàn Kiếm `21.0285, 105.8542`) → nhấn **Set Location**.
