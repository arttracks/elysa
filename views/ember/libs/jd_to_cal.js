function cal_to_jd(y, m, d) { // Fast.  y += 7e8, result -= ...
  if (m<3) { m += 12 ; y-- }
  return -678973 + d + (((153*m-2)/5)|0) + // 153 = 13 + 5*28
    365*y + ((y/4)|0) - ((y/100)|0) + ((y/400)|0) +2400001; }

function jd_to_cal(X) { // X = CMJD
  if (!X) return null
  // http://www.hermetic.ch/cal_stud/jdn.htm via dateprox.pas
  var L = X + 68569               
  var N = Math.floor((4*L) / 146097)
  L = L - Math.floor((146097*N+3) / 4)
  var K = Math.floor((4000*(L+1)) / 1461001)
  L = L - Math.floor((1461*K) / 4) + 31
  var J = Math.floor((80*L) / 2447)
  var D = L - Math.floor((2447*J) / 80)
  L = Math.floor(J / 11)
  var M = J + 2 - 12*L
  var Y = 100*(N-49) + K + L
  var obj = [Y, M-1, D];
  console.log(obj);
  return moment.utc(obj);
}