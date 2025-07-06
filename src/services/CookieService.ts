import Cookies from "js-cookie";

class CookieService {
  static setCookie(
    name: string,
    value: string,
    expires: number | Date | undefined,
  ) {
    Cookies.set(name, value, { expires: expires, secure: true });
  }

  static getCookie(name: string) {
    return Cookies.get(name);
  }

  static removeCookie(name: string) {
    Cookies.remove(name);
  }
}

export default CookieService;
