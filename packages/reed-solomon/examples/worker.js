/* eslint-disable */
importScripts('https://www.unpkg.com/workerpool@9.0.3/dist/workerpool.js');

// calacute function
function log(data) {
  console.log(data);
  return data;
}

workerpool.worker({
  log: log,
});
