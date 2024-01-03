/* eslint-disable */
const { getEddsaCompressedPublicKey, eddsaSign } = require('../dist/node/index');

(async () => {
  console.log('getEddsaCompressedPublicKey', await getEddsaCompressedPublicKey('xx'));
  console.log('eddsaSign:', await eddsaSign('xcvxcv', 'hello world'));
})();
