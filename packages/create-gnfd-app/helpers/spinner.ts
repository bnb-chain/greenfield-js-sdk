import ora from 'ora';
import { red } from 'picocolors';

const spinner = ora();

export const startSpinner = (text?: string) => {
  const msg = `${text}...\n`;
  spinner.start(msg);
};

export const succeedSpiner = (text?: string) => {
  spinner.stopAndPersist({
    symbol: '🎉',
    text: `${text}\n`,
  });
};

export const failSpinner = (text?: string) => {
  spinner.fail(red(text));
};
