import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

export const getUtcZeroTimestamp = () => {
  dayjs.extend(utc);

  return dayjs().utc().valueOf();
};

export const convertTimeStampToDate = (utcTimestamp: number) => {
  dayjs.extend(utc);
  dayjs.extend(timezone);
  // utc-0 timezone
  const tz = 'Iceland';

  return dayjs(utcTimestamp).tz(tz).format();
};
