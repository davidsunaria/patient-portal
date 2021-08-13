export const isNotEmpty = value => {
  return !(!value || /^\s*$/.test(value));
};

export const validateEmail = mail => {
  mail = mail.toLowerCase();
  if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*\.(\w{2,4}|capital)$/.test(mail)) {
    return true;
  }
  return false;
};

export const matchValues = (first, second) => {
  return first === second ? true : false;
};

export const validateUrl = str => {
  try {
    new URL(str);
  } catch (_) {
    return false;
  }
  return true;
};
