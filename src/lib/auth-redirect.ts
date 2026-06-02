export const LOGIN_PATH = '/auth/login'
export const RESERVATION_PATH = '/reservation'

export function getLoginUrl(redirectPath = RESERVATION_PATH): string {
  return `${LOGIN_PATH}?redirect=${encodeURIComponent(redirectPath)}`
}
