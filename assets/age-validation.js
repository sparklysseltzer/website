/* ICAO 9303 local plausibility checks; these do not authenticate identity. */
(() => {
  const profiles = Object.freeze({
    'ch-id': { format: 'TD1', country: 'CHE' },
    'li-id': { format: 'TD1', country: 'LIE' },
    'ch-passport': { format: 'TD3', country: 'CHE' },
    'li-passport': { format: 'TD3', country: 'LIE' },
    'international-passport': { format: 'TD3' },
  });
  const normalize = (value) => String(value ?? '').toUpperCase().replace(/\s/g, '');
  function digit(value) {
    if (!/^[A-Z0-9<]+$/.test(value)) return null;
    return String([...value].reduce((sum, char, index) => {
      const number = char === '<' ? 0 : /\d/.test(char) ? Number(char) : char.charCodeAt(0) - 55;
      return sum + number * [7, 3, 1][index % 3];
    }, 0) % 10);
  }
  function validDate(year, month, day) {
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
  }
  function today(now = new Date()) {
    const parts = Object.fromEntries(new Intl.DateTimeFormat('en', { timeZone: 'Europe/Zurich', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now).map(({ type, value }) => [type, value]));
    return [Number(parts.year), Number(parts.month), Number(parts.day)];
  }
  function validate(input, requiredAge, now = new Date()) {
    const profile = profiles[input.profile];
    if (!profile || !Number.isInteger(requiredAge) || requiredAge < 1 || requiredAge > 120) return { ok: false, field: 'profile', error: 'unsupported' };
    const fields = Object.fromEntries(['number', 'numberDigit', 'birth', 'expiry', 'optional', 'optionalDigit', 'tail', 'birthYear'].map((key) => [key, normalize(input[key])]));
    const fail = (field, error) => ({ ok: false, field, error });
    if (profile.format === 'TD3' && (fields.numberDigit === '<' || /</.test(fields.birth + fields.expiry))) return fail(fields.numberDigit === '<' ? 'numberDigit' : /</.test(fields.birth) ? 'birth' : 'expiry', 'unsupported');
    const numberPattern = input.profile === 'ch-id' ? /^[A-Z0-9]{8}$/ : profile.format === 'TD3' ? /^(?=.*[A-Z0-9])[A-Z0-9<]{1,9}$/ : /^[A-Z0-9]{1,9}$/;
    if (!numberPattern.test(fields.number)) return fail('number', 'number');
    if (profile.country === 'CHE' && /[OI]/.test(fields.number)) return fail('number', 'number');
    const number = fields.number.padEnd(9, '<');
    if (!/^\d$/.test(fields.numberDigit) || digit(number) !== fields.numberDigit) return fail('numberDigit', 'checksum');
    for (const field of ['birth', 'expiry']) {
      if (!/^\d{7}$/.test(fields[field])) return fail(field, 'dateFormat');
      if (digit(fields[field].slice(0, 6)) !== fields[field][6]) return fail(field, 'checksum');
    }
    const month = Number(fields.birth.slice(2, 4));
    const day = Number(fields.birth.slice(4, 6));
    const [currentYear, currentMonth, currentDay] = today(now);
    const currentKey = currentYear * 10000 + currentMonth * 100 + currentDay;
    const ageAt = (year) => currentYear - year - (currentMonth < month || (currentMonth === month && currentDay < day) ? 1 : 0);
    const candidates = [];
    for (let year = 1800 + Number(fields.birth.slice(0, 2)); year <= currentYear; year += 100) {
      if (validDate(year, month, day) && year * 10000 + month * 100 + day <= currentKey) candidates.push(year);
    }
    let year;
    if (fields.birthYear) {
      year = Number(fields.birthYear);
      if (!/^\d{4}$/.test(fields.birthYear) || !candidates.includes(year)) return fail('birthYear', 'year');
    } else if (!candidates.length) {
      return fail('birth', 'dateFormat');
    }
    const expiryYear = Number(fields.expiry.slice(0, 2));
    const expiryMonth = Number(fields.expiry.slice(2, 4));
    const expiryDay = Number(fields.expiry.slice(4, 6));
    // Expired documents are accepted. A real calendar date is still required.
    if (![1900, 2000].some((century) => validDate(century + expiryYear, expiryMonth, expiryDay))) return fail('expiry', 'dateFormat');
    let composite;
    if (profile.format === 'TD1') {
      if (!/^[A-Z0-9<]{15}$/.test(fields.optional)) return fail('optional', 'optional');
      if (!/^[A-Z0-9<]{11}\d$/.test(fields.tail)) return fail('tail', 'tail');
      composite = number + fields.numberDigit + fields.optional + fields.birth + fields.expiry + fields.tail.slice(0, 11);
    } else {
      if (input.optionalDigit !== undefined) {
        if (!/^[A-Z0-9<]{14}$/.test(fields.optional)) return fail('optional', 'passportOptional');
        if (!/^[0-9<]$/.test(fields.optionalDigit) || !(fields.optional === '<'.repeat(14) && fields.optionalDigit === '<') && digit(fields.optional) !== fields.optionalDigit) return fail('optionalDigit', 'checksum');
        if (!/^\d$/.test(fields.tail)) return fail('tail', 'tail');
        fields.tail = fields.optional + fields.optionalDigit + fields.tail;
      }
      if (!/^[A-Z0-9<]{14}[0-9<]\d$/.test(fields.tail)) return fail('tail', 'tail');
      const optional = fields.tail.slice(0, 14);
      const optionalDigit = fields.tail[14];
      if (!(optional === '<'.repeat(14) && optionalDigit === '<') && digit(optional) !== optionalDigit) return fail('tail', 'checksum');
      composite = number + fields.numberDigit + fields.birth + fields.expiry + fields.tail.slice(0, 15);
    }
    if (digit(composite) !== fields.tail.at(-1)) return fail('tail', 'checksum');
    // Ask for the century only after all document checks pass, and only if it changes eligibility.
    if (year === undefined) {
      const outcomes = candidates.map((candidate) => ageAt(candidate) >= requiredAge);
      if (outcomes.some(Boolean) && !outcomes.every(Boolean)) return fail('birthYear', 'century');
      year = candidates.at(-1);
    }
    if (ageAt(year) < requiredAge) return fail('birth', 'underage');
    return { ok: true, threshold: requiredAge };
  }
  function reusable(record, policy, now = Date.now()) {
    return Boolean(record && policy && !policy.unknown && Number.isInteger(record.threshold) && record.threshold >= policy.age && record.context === policy.context && record.version === policy.version && Number.isFinite(record.created) && record.created <= now && record.expires > now && record.expires <= record.created + 12 * 60 * 60 * 1000);
  }
  const api = { profiles, normalize, digit, validate, reusable };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else window.SparklysAgeValidation = api;
})();
