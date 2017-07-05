"use strict"
const readline = require('readline');
var Decimal = require('decimal.js');

Decimal.config({
  precision: 10000
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function factorial(n) {
  var i = 2,
    r = new Decimal(1);
  for (; i <= n; r = r.times(i++));
  return r;
}

function euler(n) {
  let zero = new Decimal(0);
  let one = new Decimal(1);
  let rval;

  for (let i = 0; i <= n; i++) {
    let fval = factorial(i);
    let invert = one.dividedBy(fval)
    zero = zero.plus(invert)
  }
  rval = zero.toFixed(Number(n))
  return rval;
}

console.time('time-taken');
rl.question('Enter n value: ', (n) => {
  let e = euler(n)
  console.log(`E: ${e}`)
  console.timeEnd('time-taken');
  rl.close()
});
