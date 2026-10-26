import { BASE_URL, TIMEOUT } from '../config';
import type { ApiError, HttpMethod } from '../types/models';

function makeError(type: ApiError['type'], status: number | null, message: string): ApiError {
  return { type, status, message };
}

export function isApiError(value: unknown): value is ApiError {
  return typeof value === 'object' && value !== null && 'type' in value && 'message' in value;
}

/**
 * Hàm gọi API chung.
 * - Timeout 10 giây (TIMEOUT trong config).
 * - Kiểm tra mã HTTP.
 * - Khi lỗi luôn throw { type: 'network' | 'timeout' | 'http', status, message }.
 */
export async function request<T = unknown>(
  method: HttpMethod,
  url: string,
  body?: unknown,
): Promise<T> {
  const controller = new AbortController();
  let timedOut = false;
  const timeoutId = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, TIMEOUT);

  try {
    let response: Response;
    try {
      response = await fetch(`${BASE_URL}${url}`, {
        method,
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });
    } catch {
      throw timedOut
        ? makeError('timeout', null, 'Máy chủ phản hồi quá lâu. Vui lòng thử lại.')
        : makeError('network', null, 'Không thể kết nối tới máy chủ. Hãy kiểm tra mạng hoặc json-server.');
    }

    if (!response.ok) {
      const message =
        response.status === 404
          ? 'Không tìm thấy dữ liệu yêu cầu (404).'
          : `Máy chủ trả về lỗi (${response.status}).`;
      throw makeError('http', response.status, message);
    }

    if (response.status === 204) {
      return null as T;
    }
    const text = await response.text();
    return (text ? JSON.parse(text) : null) as T;
  } finally {
    clearTimeout(timeoutId);
  }
}
