//Baesd on Pascal Sebah Algorithm

/*
** Pascal Sebah : September 1999
**
** Subject:
**
**    A very easy program to compute Pi with many digits.
**    No optimisations, no tricks, just a basic program to learn how
**    to compute in multiprecision.
**
** Formulae:
**
**    Pi/4 =    arctan(1/2)+arctan(1/3)                     (Hutton 1)
**    Pi/4 =  2*arctan(1/3)+arctan(1/7)                     (Hutton 2)
**    Pi/4 =  4*arctan(1/5)-arctan(1/239)                   (Machin)
**    Pi/4 = 12*arctan(1/18)+8*arctan(1/57)-5*arctan(1/239) (Gauss)
**
**      with arctan(x) =  x - x^3/3 + x^5/5 - ...
**
**    The Lehmer's measure is the sum of the inverse of the decimal
**    logarithm of the pk in the arctan(1/pk). The more the measure
**    is small, the more the formula is efficient.
**    For example, with Machin's formula:
**
**      E = 1/log10(5)+1/log10(239) = 1.852
**
** Data:
**
**    A big real (or multiprecision real) is defined in base B as:
**      X = x(0) + x(1)/B^1 + ... + x(n-1)/B^(n-1)
**      where 0<=x(i)<B
**
** Results: (PentiumII, 450Mhz)
**
**   Formula      :    Hutton 1  Hutton 2   Machin   Gauss
**   Lehmer's measure:   5.418     3.280      1.852    1.786
**
**  1000   decimals:     0.2s      0.1s       0.06s    0.06s
**  10000  decimals:    19.0s     11.4s       6.7s     6.4s
**  100000 decimals:  1891.0s   1144.0s     785.0s   622.0s
**
** With a little work it's possible to reduce those computation
** times by a factor 3 and more:
**
**     => Work with double instead of long and the base B can
**        be choosen as 10^8
**     => During the iterations the numbers you add are smaller
**        and smaller, take this in account in the +, *, /
**     => In the division of y=x/d, you may precompute 1/d and
**        avoid multiplications in the loop (only with doubles)
**     => MaxDiv may be increased to more than 3000 with doubles
**     => ...
*/

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

mess = "";
//10^11 seems to be the maximum
//too high a figure for the base introduces errors
Base = Math.pow(10, 11);

//num digits in each array item
cellSize = Math.floor(Math.log(Base) / Math.LN10);

//below is not used in this script
a = Number.MAX_VALUE;
MaxDiv = Math.floor(Math.sqrt(a));

function makeArray(n, aX, Integer) {
  var i = 0;
  for (i = 1; i < n; i++)
    aX[i] = null;
  aX[0] = Integer;
}

function isEmpty(aX) {
  var empty = true
  for (i = 0; i < aX.length; i++)
    if (aX[i])
  {
    empty = false;
    break;
  }
  return empty;
}

//junior school math

function Add(n, aX, aY) {
  carry = 0
  for (i = n - 1; i >= 0; i--) {
    aX[i] += Number(aY[i]) + Number(carry);
    if (aX[i] < Base)
      carry = 0;
    else {
      carry = 1;
      aX[i] = Number(aX[i]) - Number(Base);
    }
  }

}

//subtract

function Sub(n, aX, aY) {
  for (i = n - 1; i >= 0; i--) {
    aX[i] -= aY[i];
    if (aX[i] < 0) {
      if (i > 0) {
        aX[i] += Base;
        aX[i - 1]--;
      }
    }
  }
}

//multiply big number by "small" number

function Mul(n, aX, iMult) {
  carry = 0;
  for (i = n - 1; i >= 0; i--) {
    prod = (aX[i]) * iMult;
    prod += carry;
    if (prod >= Base) {
      carry = Math.floor(prod / Base);
      prod -= (carry * Base);
    } else
      carry = 0;
    aX[i] = prod;
  }
}

//divide big number by "small" number

function Div(n, aX, iDiv, aY) {
  carry = 0;
  for (i = 0; i < n; i++) {
    //add any previous carry
    currVal = Number(aX[i]) + Number(carry * Base);
    //divide
    theDiv = Math.floor(currVal / iDiv);
    //find next carry
    carry = currVal - theDiv * iDiv;
    //put the result of division in the current slot
    aY[i] = theDiv;
  }
}

//compute arctan

function arctan(iAng, n, aX) {
  iAng_squared = iAng * iAng;
  k = 3; //k is the coefficient in the series 2n-1, 3,5..
  sign = 0;
  makeArray(n, aX, 0); //aX is aArctan
  makeArray(n, aAngle, 1);
  Div(n, aAngle, iAng, aAngle); //aAngle = 1/iAng, eg 1/5
  Add(n, aX, aAngle); // aX = aAngle or long angle
  while (!isEmpty(aAngle)) {
    Div(n, aAngle, iAng_squared, aAngle); //aAngle=aAngle/iAng_squared, iAng_squared is iAng*iAng
    //mess+="iAng="+iAng+"; aAngle="+aAngle+"<br>";
    Div(n, aAngle, k, aDivK); /* aDivK = aAngle/k */
    if (sign)
      Add(n, aX, aDivK); /* aX = aX+aDivK */
    else Sub(n, aX, aDivK); /* aX = aX-aDivK */
    k += 2;
    sign = 1 - sign;
  }
  mess += "aArctan=" + aArctan + "<br>";
}

// Calculate pi

function calcPI(numDec) {
  numDec = Number(numDec);
  iAng = new Array(10);
  coeff = new Array(10);
  arrayLength = Math.ceil(1 + numDec / cellSize);
  aPI = new Array(arrayLength);
  aArctan = new Array(arrayLength);
  aAngle = new Array(arrayLength);
  aDivK = new Array(arrayLength);

  //Pi/4 = 4*arctan(1/5)-arctan(1/239)

  //coeff is an array of the coefficients

  //the last item is 0!

  coeff[0] = 4;
  coeff[1] = -1;
  coeff[2] = 0;

  //iAng holds the angles, 5 for 1/5, etc

  iAng[0] = 5;
  iAng[1] = 239;
  iAng[2] = 0;

  makeArray(arrayLength, aPI, 0);

  //Machin: Pi/4 = 4*arctan(1/5)-arctan(1/239)

  makeArray(arrayLength, aAngle, 0);
  makeArray(arrayLength, aDivK, 0);
  for (var i = 0; coeff[i] != 0; i++) {
    arctan(iAng[i], arrayLength, aArctan);
    //multiply by coefficients of arctan
    Mul(arrayLength, aArctan, Math.abs(coeff[i]));
    //mess+="mi="+coeff[i]+"<br>";
    if (coeff[i] > 0)
      Add(arrayLength, aPI, aArctan);
    else
      Sub(arrayLength, aPI, aArctan);
    //mess+="api="+aPI+"<br>";
  }

  //we have calculated pi/4, so need to finally multiply
  Mul(arrayLength, aPI, 4);
  //we have now calculated PI, and need to format the answer
  //to print it out
  sPI = "";
  tempPI = "";
  //put the figures in the array into the string tempPI
  for (i = 0; i < aPI.length; i++)
  {
    if (i > 0) {
      aPI[i] = String(aPI[i]);
      //ensure there are enough digits in each cell
      //if not, pad with leading zeros
      if (aPI[i].length < cellSize && i != 0) {
        while (aPI[i].length < cellSize)
          aPI[i] = "0" + aPI[i];
      }
      tempPI += aPI[i];
    }
  }
  return '3.' + tempPI;
}

rl.question('Enter n value: ', (n) => {
  let pi = calcPI(n)
  console.log(`PI: ${pi}`)
  rl.close()
});
