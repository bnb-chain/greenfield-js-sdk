const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export function encodeBase64(data, pad = true) {
  const len = data.length;
  const extraBytes = len % 3;
  const parts = [];

  const len2 = len - extraBytes;
  for (let i = 0; i < len2; i += 3) {
    const tmp = ((data[i] << 16) & 0xff0000) + ((data[i + 1] << 8) & 0xff00) + (data[i + 2] & 0xff);

    const triplet =
      base64Chars.charAt((tmp >> 18) & 0x3f) +
      base64Chars.charAt((tmp >> 12) & 0x3f) +
      base64Chars.charAt((tmp >> 6) & 0x3f) +
      base64Chars.charAt(tmp & 0x3f);

    parts.push(triplet);
  }

  if (extraBytes === 1) {
    const tmp = data[len - 1];
    const a = base64Chars.charAt(tmp >> 2);
    const b = base64Chars.charAt((tmp << 4) & 0x3f);

    parts.push(`${a}${b}`);
    if (pad) {
      parts.push('==');
    }
  } else if (extraBytes === 2) {
    const tmp = (data[len - 2] << 8) + data[len - 1];
    const a = base64Chars.charAt(tmp >> 10);
    const b = base64Chars.charAt((tmp >> 4) & 0x3f);
    const c = base64Chars.charAt((tmp << 2) & 0x3f);
    parts.push(`${a}${b}${c}`);
    if (pad) {
      parts.push('=');
    }
  }

  return parts.join('');
}
