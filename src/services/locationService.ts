/**
 * locationService: xin quyền vị trí trên Android, lấy tọa độ GPS hiện tại
 * bằng @react-native-community/geolocation và mở Google Maps.
 */
import Geolocation from '@react-native-community/geolocation';
import { Linking, PermissionsAndroid, Platform } from 'react-native';
import { APP_CONFIG } from '../constants/config';
import type { LocationCoords } from '../types/message';

/**
 * Xin quyền truy cập vị trí trên Android (ACCESS_FINE_LOCATION / ACCESS_COARSE_LOCATION).
 * @returns true nếu người dùng đã cấp quyền.
 */
export async function requestLocationPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    const alreadyFine = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (alreadyFine) {
      return true;
    }

    const results = await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
    ]);

    const fineGranted =
      results[PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION] ===
      PermissionsAndroid.RESULTS.GRANTED;
    const coarseGranted =
      results[PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION] ===
      PermissionsAndroid.RESULTS.GRANTED;

    return fineGranted || coarseGranted;
  } catch {
    throw new Error('Không thể kiểm tra quyền truy cập vị trí.');
  }
}

/** Gọi Geolocation.getCurrentPosition gói trong Promise. */
function fetchPosition(enableHighAccuracy: boolean): Promise<LocationCoords> {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      position => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      error => {
        reject(error);
      },
      {
        enableHighAccuracy,
        timeout: APP_CONFIG.LOCATION_TIMEOUT_MS,
        maximumAge: APP_CONFIG.LOCATION_MAX_AGE_MS,
      },
    );
  });
}

/**
 * Lấy tọa độ GPS hiện tại của thiết bị.
 * Tự động xin quyền nếu chưa có. Thử độ chính xác cao trước, nếu timeout trên máy ảo
 * thì fallback sang độ chính xác mạng/coarse.
 */
export async function getCurrentLocation(): Promise<LocationCoords> {
  const granted = await requestLocationPermission();
  if (!granted) {
    throw new Error(
      'Bạn đã từ chối quyền truy cập vị trí. Vui lòng cấp quyền trong Cài đặt để gửi vị trí.',
    );
  }

  try {
    return await fetchPosition(true);
  } catch {
    try {
      return await fetchPosition(false);
    } catch (err) {
      const code = (err as { code?: number } | null)?.code;
      if (code === 1) {
        throw new Error('Quyền truy cập vị trí bị từ chối.');
      }
      if (code === 2) {
        throw new Error(
          'Không lấy được vị trí. Vui lòng bật GPS / Dịch vụ vị trí trên thiết bị.',
        );
      }
      if (code === 3) {
        throw new Error(
          'Quá thời gian lấy vị trí. Hãy kiểm tra tín hiệu GPS hoặc đặt điểm GPS trong Emulator.',
        );
      }
      throw new Error('Không thể lấy được vị trí hiện tại.');
    }
  }
}

/**
 * Mở tọa độ trong Google Maps hoặc trình duyệt theo đúng URL yêu cầu:
 * https://www.google.com/maps/search/?api=1&query=LATITUDE,LONGITUDE
 */
export async function openLocationInMaps(
  coords: LocationCoords,
): Promise<void> {
  const { latitude, longitude } = coords;
  const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  try {
    await Linking.openURL(url);
  } catch {
    throw new Error('Không thể mở ứng dụng bản đồ trên thiết bị này.');
  }
}

