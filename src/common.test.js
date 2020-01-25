import * as common from "./common";

describe('phonecheck', function () {
  test('correct phone number', () => {
    expect(common.phonecheck('402-402-4020')).toBe(true);
  });

  test('with letter', () => {
    expect(common.phonecheck('402-40a-4020')).toBe(false);
  });

  test('using parenthesis', () => {
    expect(common.phonecheck('(402) 402-4020')).toBe(false);
  });

  test('without any spacing characters', () => {
    expect(common.phonecheck('4024024020')).toBe(false);
  });
});

describe('statecheck', function () {
  test('with correct state', () => {
    expect(common.statecheck('AA')).toBe(true);
  });

  test('with a space', () => {
    expect(common.statecheck(' AA')).toBe(false);
  });

  test('with numbers', () => {
    expect(common.statecheck('33')).toBe(false);
  });
});

describe('zipcheck', function () {
  let zips = ['00001', 12345, "12345"];
  test.each([zips])(
    "with correct zip '%i'",
    (zip) => {
      expect(common.zipcheck(zip)).toBe(true);
    },
  );

  zips = ['0000a1', 0xa12345, "123945", 0xAAAAA];
  test.each([zips])(
    "with incorrect zip '%i'",
    (zip) => {
      expect(common.zipcheck(zip)).toBe(false);
    },
  );

});

describe('emailcheck', function () {
  function makeid(length, recursive) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789._%+-@';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    if (!recursive && !result.includes('@')) {
      result += '@' + makeid(length, true);
    }
    if (!recursive && !result.includes('.')) {
      let num = Math.round(Math.random() * Math.round(Math.random() * 10)) + 2;
      result += '.' + makeid(num, true);
    }
    return result;
  }

  // for (let i = 0; i < 10; i++) {
  //   let emails = [];
  //   let num = Math.round(Math.random() * Math.round(Math.random() * 20)) + 3;
  //   console.log('num', num);

  //   let email = makeid(num);
  //   test('random 1: ' + email, () => {
  //     expect(common.emailcheck(email)).toBe(true);
  //   });

  //   test('random 2: ' + email, () => {
  //     expect(common.emailcheck2(email)).toBe(true);
  //   });
  // }

  let emails = ['adam@bobs.photos'];
  test.each([emails])(
    "with correct email '%s'",
    (email) => {
      expect(common.emailcheck(email)).toBe(true);
    },
  );
});
