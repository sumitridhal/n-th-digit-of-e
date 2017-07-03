"use strict"
const readline = require('readline');
var Decimal = require('decimal.js');

Decimal.config({precision: 10000});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

 function factiorial(x) {
       var rval = 1;
       for (var i = 2; i <= x; i++)
           rval = rval * i;
       return rval;
   }

 function euler(n){
   let zero = new Decimal(0);
   let one = new Decimal(1);
   let rval;

   for (let i = 0; i <= n; i++){
     let fval = new Decimal(factiorial(i));
     let invert = one.dividedBy(fval)
     zero = zero.plus(invert)
   }
   rval = zero.toFixed(Number(n))
   return rval;
 }


rl.question('Enter n value: ', (n) => {
  let e = euler(n)
  console.log(`E: ${e}`)
  rl.close()
});
