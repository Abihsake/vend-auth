export const REG_EXP = {
  EMAIL:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[()*&^%$#@!_+])[A-Za-z\d()*&^%$#@!_+]{8,}$/, // at least eight characters with one lowercase letter, one uppercase letter, one number and one special character
  PHONE: /^\d{10}$/,
  NAME: /^[a-zA-Z ]{2,30}$/,
  ADDRESS: /^[a-zA-Z0-9\s,.'-]{2,50}$/,
  CITY: /^[a-zA-Z ]{2,30}$/,
  ONLY_NUMBER: /^\d+$/,
  ONLY_LETTER: /^[a-zA-Z]+$/,
  ONLY_LETTER_AND_NUMBER: /^[a-zA-Z0-9]+$/,
  ONLY_LETTER_AND_NUMBER_AND_SPACE: /^[a-zA-Z0-9 ]+$/,
  ONLY_LETTER_AND_NUMBER_AND_SPACE_AND_SPECIAL_CHARACTER: /^[a-zA-Z0-9 !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]+$/,
  CONTAIN_SPECIAL_CHARACTER: /[ !@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/,
  CONTAIN_NUMBER: /\d/,
  CONTAIN_UPPERCASE: /[A-Z]/,
  CONTAIN_LOWERCASE: /[a-z]/
};
