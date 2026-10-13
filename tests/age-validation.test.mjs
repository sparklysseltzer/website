import test from 'node:test';
import assert from 'node:assert/strict';
import validation from '../assets/age-validation.js';
const { digit, validate, reusable } = validation;
const now = new Date('2026-09-08T10:00:00Z');
function fixture(profile = 'ch-id', birth = '100908', birthYear = '2010') {
  const input = { profile, number: 'S1A00E77', numberDigit: digit('S1A00E77<'), birth: birth + digit(birth), birthYear, expiry: '200101' + digit('200101'), optional: '<'.repeat(15) };
  const td1 = profile.endsWith('-id');
  const tail = td1 ? '<'.repeat(11) : '<'.repeat(14) + '0';
  input.tail = tail + digit(input.number.padEnd(9, '<') + input.numberDigit + (td1 ? input.optional : '') + input.birth + input.expiry + tail);
  return input;
}
test('published ICAO check-digit vectors', () => {
  assert.equal(digit('520727'), '3');
  assert.equal(digit('L898902C3'), '6');
  assert.equal(digit('ZE184226B<<<<<'), '1');
  assert.equal(digit('bad!'), null);
});
test('official Swiss 2023 ID specimen passes without collecting names', () => {
  const result = validate({ profile: 'ch-id', number: 'S1A00E77', numberDigit: '3', birth: '9508015', birthYear: '1995', expiry: '3302026', optional: '<'.repeat(15), tail: '<'.repeat(11) + '0' },16,now);
  assert.deepEqual(result, { ok: true, threshold: 16 });
});
test('published ICAO passport lower-line fixture checks composite and optional data', () => {
  const result = validate({ profile:'international-passport',number:'L898902C3',numberDigit:'6',birth:'7408122',birthYear:'1974',expiry:'1204159',tail:'ZE184226B<<<<<10' },16,now);
  assert.equal(result.ok, true);
});
test('all document choices accept an expired, structurally valid document at exact birthday', () => {
  for (const profile of Object.keys(validation.profiles)) assert.equal(validate(fixture(profile),16,now).ok,true,profile);
});
test('underage even one day before birthday; century explicitly matched', () => {
  assert.equal(validate(fixture('ch-id','100909'),16,now).error,'underage');
  assert.equal(validate(fixture('ch-id','100908','2009'),16,now).error,'year');
  assert.equal(validate(fixture('ch-id','100908','2110'),16,now).error,'year');
});
test('impossible dates cannot pass merely because their checksum is correct', () => {
  assert.equal(validate(fixture('ch-id','110229','2011'),16,now).error,'year');
  const input = fixture(); input.expiry='230229'+digit('230229');
  assert.equal(validate(input,16,now).error,'dateFormat');
});
test('leap birthdays use March 1 in non-leap years; Zurich date boundary', () => {
  assert.equal(validate(fixture('ch-id','080229','2008'),17,new Date('2025-02-28T12:00:00Z')).error,'underage');
  assert.equal(validate(fixture('ch-id','080229','2008'),17,new Date('2025-02-28T23:00:00Z')).ok,true);
});
test('every check digit and composite is actually checked', () => {
  for (const field of ['numberDigit','birth','expiry','tail']) {
    const input=fixture();input[field]=input[field].slice(0,-1)+String((Number(input[field].at(-1))+1)%10);
    assert.equal(validate(input,16,now).error,'checksum',field);
  }
  const input=fixture('international-passport'); input.tail='B'+input.tail.slice(1);
  assert.equal(validate(input,16,now).error,'checksum');
});
test('unsupported profiles, long document numbers and partial values do not pass', () => {
  assert.equal(validate({...fixture(),profile:'foreign-id'},16,now).error,'unsupported');
  assert.equal(validate({...fixture(),number:'1234567890'},16,now).error,'number');
  assert.equal(validate({...fixture(),optional:'<'},16,now).error,'optional');
});
test('remembered result ignores quantities/discounts but expires or resets for context/policy', () => {
  const policy={age:16,context:'guest',version:'1',unknown:false};
  const record={threshold:16,context:'guest',version:'1',created:100,expires:1000};
  assert.equal(reusable(record,policy,500),true);
  for(const change of [{age:18},{context:'123'},{version:'2'},{unknown:true}])assert.equal(reusable(record,{...policy,...change},500),false);
  assert.equal(reusable(record,policy,1000),false);
  assert.equal(reusable(record,policy,50),false);
});


test('omitted century passes when every possible birth year meets the threshold', () => {
  for (const profile of Object.keys(validation.profiles)) {
    assert.equal(validate(fixture(profile, '950801', ''), 16, now).ok, true);
    assert.equal(validate(fixture(profile, '100908', ''), 16, now).ok, true);
  }
});
test('ambiguous century requests clarification rather than approving a minor', () => {
  const input = fixture('ch-id', '100909', '');
  assert.deepEqual(validate(input, 16, now), { ok: false, field: 'birthYear', error: 'century' });
  assert.equal(validate({ ...input, birthYear: '2010' }, 16, now).error, 'underage');
  assert.equal(validate({ ...input, birthYear: '1910' }, 16, now).ok, true);
  assert.equal(validate({ ...input, birthYear: '2011' }, 16, now).error, 'year');
  assert.equal(validate({ ...input, tail: '<' }, 16, now).error, 'tail');
});
test('inferred centuries respect calendar validity and do not invent future births', () => {
  assert.equal(validate(fixture('ch-id', '110229', ''), 16, now).error, 'dateFormat');
  assert.equal(validate(fixture('ch-id', '000229', ''), 16, now).ok, true);
  assert.equal(validate(fixture('ch-id', '991231', ''), 16, now).ok, true);
});

test('Swiss ID requires eight document-number characters before the fixed filler', () => {
  for (const number of ['S1A00E7', 'S1A00E777']) {
    const input = { ...fixture(), number, numberDigit: digit(number.padEnd(9, '<')) };
    assert.deepEqual(validate(input, 16, now), { ok: false, field: 'number', error: 'number' });
  }
  assert.equal(validate(fixture(), 16, now).ok, true);
});

test('international passport preserves internal fillers and unrestricted Latin letters', () => {
  for (const number of ['OI12<3456', 'AB123', '123456789']) {
    for (const optional of ['<'.repeat(14), 'OI123456789<<<']) {
      for (const optionalDigit of optional.startsWith('<') ? ['0', '<'] : [digit(optional)]) {
        const input = fixture('international-passport', '950801', '1995');
        Object.assign(input, { number, numberDigit: digit(number.padEnd(9, '<')), optional, optionalDigit });
        input.tail = digit(number.padEnd(9, '<') + input.numberDigit + input.birth + input.expiry + optional + optionalDigit);
        assert.equal(validate(input, 16, now).ok, true);
        assert.equal(validate({ ...input, optional: optional.slice(1) }, 16, now).field, 'optional');
        assert.equal(validate({ ...input, optionalDigit: '9' }, 16, now).field, 'optionalDigit');
        assert.equal(validate({ ...input, tail: String((Number(input.tail) + 1) % 10) }, 16, now).error, 'checksum');
      }
    }
  }
});
test('international passport rejects unsupported incomplete dates and missing number checks', () => {
  for (const change of [{ birth: '95<<<<0' }, { expiry: '<<<<<<0' }, { numberDigit: '<' }]) {
    assert.equal(validate({ ...fixture('international-passport'), ...change }, 16, now).error, 'unsupported');
  }
  assert.equal(validate({ ...fixture('international-passport'), number: '<<<<<<<<<' }, 16, now).error, 'number');
});
test('ICAO passport specimen works with the separate displayed ending fields', () => {
  assert.equal(validate({ profile: 'international-passport', number: 'L898902C3', numberDigit: '6', birth: '7408122', expiry: '1204159', optional: 'ZE184226B<<<<<', optionalDigit: '1', tail: '0' }, 16, now).ok, true);
});

test('raising minimum age from 16 to 18 rejects a 17-year-old and the old remembered threshold', () => {
  const input = fixture('international-passport', '090908', '2009');
  assert.equal(validate(input, 16, now).ok, true);
  assert.equal(validate(input, 18, now).error, 'underage');
  assert.equal(validate(fixture('international-passport', '080908', '2008'), 18, now).ok, true);
  const record = { threshold:16, context:'guest', version:'1', created:100, expires:1000 };
  assert.equal(reusable(record, { age:18, context:'guest', version:'1' }, 500), false);
  assert.equal(reusable({ ...record, threshold:18 }, { age:18, context:'guest', version:'1' }, 500), true);
});

test('field feedback revalidates dependent check digits and calendar dates', () => {
  const input = fixture('ch-id', '900101', '1990');
  assert.equal(validation.fieldStates(input, 18, now).tail, true);
  input.number = 'S1A00E78';
  assert.equal(validation.fieldStates(input, 18, now).numberDigit, false);
  assert.equal(validation.fieldStates(input, 18, now).tail, false);
  input.birth = '900231' + digit('900231');
  assert.equal(validation.fieldStates(input, 18, now).birth, false);
});
test('field feedback cannot turn an underage result into successful verification', () => {
  const input = fixture();
  assert.equal(validation.fieldStates(input, 18, now).birth, false);
  assert.equal(validate(input, 18, now).error, 'underage');
});

test('Swiss passport filler reconstruction preserves the final checksum for 0 and <', () => {
  const original = fixture('ch-passport');
  const input = { ...original, optional: '<'.repeat(14), optionalDigit: '0', tail: original.tail.at(-1) };
  assert.equal(validate(input, 16, now).ok, true);
  assert.equal(validate({ ...input, optionalDigit: '<' }, 16, now).ok, true);
  assert.equal(validate({ ...input, tail: String((Number(input.tail) + 1) % 10) }, 16, now).error, 'checksum');
  for (const number of ['S1A00E7', 'S1A00E777', 'S1A00E77<']) {
    assert.equal(validate({ ...input, number }, 16, now).field, 'number');
    assert.equal(validation.fieldStates({ ...input, number }, 16, now).number, false);
  }
  assert.equal(validation.fieldStates(input, 16, now).number, true);
});

test('document choices are restricted to the three supported profiles', () => {
  assert.deepEqual(Object.keys(validation.profiles), ['ch-id', 'ch-passport', 'international-passport']);
});

test('full passport line maps the published specimen and rejects incomplete or malformed input', () => {
  const rawLine = 'L898902C36UTO7408122F1204159ZE184226B<<<<<10';
  const input = { profile: 'international-passport', rawLine };
  assert.equal(validate(input, 18, now).ok, true);
  assert.equal(validate({ ...input, rawLine: rawLine.toLowerCase().split('').join(' ') }, 18, now).ok, true);
  for (const line of [rawLine.slice(1), rawLine + '<', rawLine.replace('UTO', '123'), rawLine.replace('F', 'X')]) {
    assert.equal(validate({ ...input, rawLine: line }, 18, now).field, 'rawLine');
  }
  assert.equal(validate({ ...input, rawLine: rawLine.slice(0, -1) + '1' }, 18, now).error, 'checksum');
  assert.equal(validation.fieldStates(input, 18, now).rawLine, true);
});
