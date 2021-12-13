import Toast from 'react-native-simple-toast';

export const ToastShort = msg => Toast.show(msg);
export const ToastLong = msg => Toast.show(msg, Toast.LONG);
export const FixImage = file => {
  if (file) {
    file = file.replace(':433', '');
  }
  return file;
};

export const Capitalize = string => {
  string = string.replace(/(^\w|\s\w)(\S*)/g, (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase());
  return string;
};

export const SentenceCase = (str) => {
  // console.log(str
  //     .split(/[.\!\?]/g))
  return str
      .split(/[.\!\?]/g)
      .map((word) => word.trim() && word.trim()[0] && word.trim().slice(1) ? word.trim()[0].toUpperCase() + word.trim().slice(1).toLowerCase() : "")
      .join('. ');
}

export const SpaceCard = num => {
  /* let data = num.replace(/(\d{4}(?!\s))/g, '$1-');
  return data; */
  return num;
};

export const randomString = length => {
  return Math.round(Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))
    .toString(36)
    .slice(1);
};

export const validateEmail = (email) => {
  return /\S+@\S+\.\S+/.test(email)
}

export const currencyFormat = (amount) => {
  return new Intl.NumberFormat('en-US').format(amount)
}
