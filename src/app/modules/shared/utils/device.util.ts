export class DeviceUtil {
  static vibrate(val: number) {
    const navigator = window.navigator as any;

    if ('vibrate' in navigator) {
      return navigator.vibrate(val);
    }

    if ('oVibrate' in navigator) {
      // noinspection TypeScriptUnresolvedFunction
      return navigator.oVibrate(val);
    }

    if ('mozVibrate' in navigator) {
      // noinspection TypeScriptUnresolvedFunction
      return navigator.mozVibrate(val);
    }

    if ('webkitVibrate' in navigator) {
      // noinspection TypeScriptUnresolvedFunction
      return navigator.webkitVibrate(val);
    }
  }
}
