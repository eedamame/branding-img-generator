// assert

var assertnum = 0;


function assert(actual, expected) {
  assertnum++;
  console.log('テスト実行回数', assertnum);
  console.assert(actual === expected, '\nact: ' + actual + '\nexp: ' + expected);
}

function TestSum() {
  assert(1+2, 3);
  assert(1+3, 4);
  assert(1+3, 2);
  assert(1+3, 4);
}

// exec
TestSum();
