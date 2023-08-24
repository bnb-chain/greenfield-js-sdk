import fetch from 'cross-fetch';

export function delayMs(duration: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('request time out'));
    }, duration);
  });
}

const fetchWithTimeout = async (fetchUrl = '', fetchOptions: any = {}, duration = 30000) => {
  try {
    const response = (await Promise.race([
      delayMs(duration),
      fetch(fetchUrl, fetchOptions),
    ])) as Response;
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
};

export { fetchWithTimeout };
