export class IdUtil {
  private static lastGeneratedId = 0;

  /**
   * Generates unique Id
   * @returns {string}
   */
  static generateUniqueId(): string {
    return ++IdUtil.lastGeneratedId + '_' + new Date().getTime();
  }
}
