export class DatesUtil {
  /**
   * Get percent passed time from latest date to upcoming date
   * @param latest
   * @param upcoming
   * @returns {number}
   */
  static progressPercentBetweenDates(latest: Date | string, upcoming: Date | string): number {
    if (typeof latest === 'string') {
      latest = new Date(latest);
    }

    if (typeof upcoming === 'string') {
      upcoming = new Date(upcoming);
    }

    const drawsTimeDiff = (<Date>upcoming).getTime() - (<Date>latest).getTime();
    const currentTimeDiff = (new Date()).getTime() - (<Date>latest).getTime();

    return (currentTimeDiff * 100) / drawsTimeDiff;
  }

  /**
   * Get number of hours left to date
   * @param date
   * @returns {number}
   */
  static hoursLeftToDate(date: Date | string): number {
    if (typeof date === 'string') {
      date = new Date(date);
    }

    return Math.round((date.getTime() - new Date().getTime()) / 1000 / 60 / 60);
  }

  /**
   * Format Date like "13 October 2018"
   * @param date
   * @returns {string}
   */
  static formatDate(date: Date): string {
    const monthNames = [
      'January', 'February', 'March',
      'April', 'May', 'June', 'July',
      'August', 'September', 'October',
      'November', 'December'
    ];

    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    return day + ' ' + monthNames[monthIndex] + ' ' + year;
  }
}
