import { expect } from 'chai';
import { encodePath } from '../src/clients/spclient/auth';

describe('encodePaths', () => {
  it('encode english chars', () => {
    expect(encodePath('~!@#$%^&*()')).equals('~%21%40%23%24%25%5E%26%2A%28%29');

    expect(encodePath('-=_+`:;\'[]{}<>,./?\\|"')).equals(
      '-%3D_%2B%60%3A%3B%27%5B%5D%7B%7D%3C%3E%2C./%3F%5C%7C%22',
    );
  });

  it('encode chinese chars', () => {
    expect(encodePath('中文')).equals('%E4%B8%AD%E6%96%87');
  });

  it('encode complex utf-8 chars', () => {
    expect(
      encodePath(
        '（h～d…-o#y))$i…nla@)l！zq%ja.！m…)ug(z@a…*sd（tz.#(—$…!)-tz…*ko#$l&jz$bu…@q(cf+k()a）¥dya%！)(qo@raz@$d@d～rl.y…ga—)ep*#+mqmu¥…ril—)vde…@p……l+hif—%z～！%li～o（(kh%—%—#u)$zhunu@.～#t…#di.jfohw…!）@z…xm*…m—)gzop*q%…qxxzqrno%h-…k～&)～w)!%w.…u20230830112135_jim _255MB',
      ),
    ).equals(
      '%EF%BC%88h%EF%BD%9Ed%E2%80%A6-o%23y%29%29%24i%E2%80%A6nla%40%29l%EF%BC%81zq%25ja.%EF%BC%81m%E2%80%A6%29ug%28z%40a%E2%80%A6%2Asd%EF%BC%88tz.%23%28%E2%80%94%24%E2%80%A6%21%29-tz%E2%80%A6%2Ako%23%24l%26jz%24bu%E2%80%A6%40q%28cf%2Bk%28%29a%EF%BC%89%C2%A5dya%25%EF%BC%81%29%28qo%40raz%40%24d%40d%EF%BD%9Erl.y%E2%80%A6ga%E2%80%94%29ep%2A%23%2Bmqmu%C2%A5%E2%80%A6ril%E2%80%94%29vde%E2%80%A6%40p%E2%80%A6%E2%80%A6l%2Bhif%E2%80%94%25z%EF%BD%9E%EF%BC%81%25li%EF%BD%9Eo%EF%BC%88%28kh%25%E2%80%94%25%E2%80%94%23u%29%24zhunu%40.%EF%BD%9E%23t%E2%80%A6%23di.jfohw%E2%80%A6%21%EF%BC%89%40z%E2%80%A6xm%2A%E2%80%A6m%E2%80%94%29gzop%2Aq%25%E2%80%A6qxxzqrno%25h-%E2%80%A6k%EF%BD%9E%26%29%EF%BD%9Ew%29%21%25w.%E2%80%A6u20230830112135_jim%20_255MB',
    );
  });
});
