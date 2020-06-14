import { CountdownOptionsInterface } from '../entities/interfaces/countdown-options.interface';
import { CountdownInterface } from '../entities/interfaces/countdown.interface';

export class CountdownHelper {
  static pad(num: number, size = 2): string {
    let str = num.toString();
    while (str.length < size) {
      str = '0' + str;
    }
    return str;
  }

  static countdown(date: Date | string, options: CountdownOptionsInterface): CountdownInterface {
    if (typeof date === 'string') {
      date = new Date(date);
    }

    const result: CountdownInterface = {
      days: '00',
      daysWord: 'days',
      hours: '00',
      hoursWord: 'hours',
      minutes: '00',
      minutesWord: 'mins',
      seconds: '00',
      secondsWord: 'secs',
      finished: false,
    };

    let days: number,
      hours: number,
      minutes: number,
      seconds: number;

    let timeDiff = Math.floor(((<Date>date).getTime() - new Date().getTime()) / 1000);

    if (timeDiff < 0) {
      result.finished = true;
      return result;
    }

    days = Math.floor(timeDiff / 86400);
    timeDiff -= days * 86400;

    hours = Math.floor(timeDiff / 3600) % 24;
    timeDiff -= hours * 3600;

    minutes = Math.floor(timeDiff / 60) % 60;
    timeDiff -= minutes * 60;

    seconds = timeDiff % 60;

    result.days = options.padDays ? CountdownHelper.pad(days) : days.toString();
    result.daysWord = (days === 1) ? 'Day' : 'Days';

    result.hours = options.padHours ? CountdownHelper.pad(hours) : hours.toString();
    result.hoursWord = (hours === 1) ? 'hour' : 'hrs';

    result.minutes = options.padMinutes ? CountdownHelper.pad(minutes) : minutes.toString();
    result.minutesWord = (minutes === 1) ? 'min' : 'mins';

    result.seconds = options.padSeconds ? CountdownHelper.pad(seconds) : seconds.toString();
    result.secondsWord = (seconds === 1) ? 'sec' : 'secs';

    return result;
  }
}
