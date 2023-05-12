const MOCK_SIGNATURE = '1234567812345678123456781234567812345678123456781234567812345678';
const NORMAL_ERROR_CODE = 404;
const METHOD_GET = 'GET';
const METHOD_POST = 'POST';
const METHOD_PUT = 'PUT';

function timeoutAfter(duration: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('request time out'));
    }, duration);
  });
}

const fetchWithTimeout = async (fetchUrl = '', fetchOptions: any = {}, duration = 30000) => {
  try {
    const response = await Promise.race([timeoutAfter(duration), fetch(fetchUrl, fetchOptions)]);
    return response as Promise<Response>;
  } catch (error) {
    return Promise.reject(error);
  }
};

export { MOCK_SIGNATURE, NORMAL_ERROR_CODE, METHOD_GET, METHOD_POST, METHOD_PUT, fetchWithTimeout };
