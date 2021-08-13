import moment from 'moment';

export const apiDateFormat = (date) => {
  //return moment(date).format("YYYY-MM-DD");
};

export function isLoggedIn() {
  return localStorage.getItem("isLoggedIn");
}
export function handleInvalidToken() {
  //clearToken();
  clearUserData();
  window.location.href = "/login";
}

export function clearUserData() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("accountData");
  localStorage.removeItem("userData");
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("temp_signup_data");
}
export function getAccountData() {
  return localStorage.getItem("accountData");
}
export function setAccountData(payload) {
  setDateFormat(payload.date_format);
  setTimeFormat(payload.time_format);
  return localStorage.setItem("accountData", JSON.stringify(payload));
}

export function getUser() {
  return JSON.parse(localStorage.getItem("userData"));
}

export function setUser(payload) {
  return localStorage.setItem("userData", JSON.stringify(payload));
}

export function setToken(access_token) {
  localStorage.setItem("access_token", access_token);
  localStorage.setItem("isLoggedIn", true);
}

export function getToken() {
  let token = localStorage.getItem("access_token");
  if (token) {
    return token;
  }
  return false;
}
export function logoutCompletely() {
  clearUserData();
}

export function setTempData(payload) {
  localStorage.setItem("temp_signup_data",  JSON.stringify(payload));
}
export function removeTempData() {
  localStorage.removeItem("temp_signup_data");
}

export function getTempData() {
  return JSON.parse(localStorage.getItem("temp_signup_data"));
}

export function getLoggedinUserId() {
  return getUser()?.id;
}

export function setDateFormat(dateFormat) {
  switch (dateFormat) {
    case 'mm/dd/yyyy':
      dateFormat = 'MM/DD/YYYY';
      break;
    case 'yyyy/mm/dd':
      dateFormat = 'YYYY/MM/DD';
      break;
    case 'dd/mm/yyyy':
      dateFormat = 'DD/MM/YYYY';
      break;
    default:
      dateFormat = "YYYY/MM/DD";
      break;
  }
  localStorage.setItem('dateFormat', dateFormat);
  return true;
}


export function getDateFormat() {
  let dateFormat = localStorage.getItem('dateFormat')
  if (dateFormat) {
    return dateFormat;
  } else
    return "YYYY/MM/DD";
}


export function showFormattedDate(date, showTime, specifiedFormat) {
  showTime = showTime || false;
  specifiedFormat = specifiedFormat || ''
  const dateFormat = getDateFormat(); // todo : get it from localstorage
  const timeFormat = getTimeFormat(); // todo : get it from localstorage

  let userFormat = getDateFormat(); // do not change this
  let returnFormat = getDateFormat();
  let defDate = '';

  if (date === "0000-00-00 00:00:00" || date === "0000-00-00" || date === "0000/00/00 00:00:00" || date === "0000/00/00") {
    return "";
  }

  if (date === '' || date === undefined || date === null) {
    if (specifiedFormat != '') {
      returnFormat = specifiedFormat;
    }
    defDate = moment(moment(), userFormat).format(returnFormat);
    defDate = defDate.split(' ')[0];
    date = defDate;
    return date
  }

  if (date && dateFormat && timeFormat) {
    if (showTime) {
      userFormat = dateFormat + ' ' + timeFormat;
      returnFormat = userFormat;
    } else {
      userFormat = dateFormat;
      returnFormat = dateFormat;
    }

    if (specifiedFormat != '') {
      returnFormat = specifiedFormat;
    }

    if (date.indexOf('/') > -1 || date.indexOf('-') > -1) {

      // Additional code - START
      let dateTimeArray = date.split(' ');
      let dateArray = dateTimeArray[0]
      if (dateArray.indexOf('/') !== -1) {
        dateArray = dateArray.split('/');
      } else {
        dateArray = dateArray.split('-');
      }

      if (dateFormat == 'DD/MM/YYYY') {
        return moment(date).format(returnFormat);
      }
      return moment(date).format(returnFormat);
    } else {
      return moment.unix(date).format(returnFormat);
    }
  }
}


export function setTimeFormat(timeFormat) {
  switch (timeFormat) {
    case '12 Hours':
      timeFormat = 'hh:mm A';
      break;
    case '24 Hours':
      timeFormat = 'HH:mm';
      break;
    default:
      timeFormat = 'hh:mm A';
      break;
  }
  localStorage.setItem('timeFormat', timeFormat);
  return true;
}

export function formatTime(time) {
  let timeFormat = getTimeFormat();
  return moment(time, "HH:mm:ss").format(timeFormat);
}

export function getTimeFormat() {
  let timeFormat = localStorage.getItem('timeFormat')
  if (timeFormat) {
    return timeFormat;
  } else
    return 'HH:mm';
}

export function formatDate(date,fragment,isTime=false) {
  if(date && fragment == 1){
   return  moment(date).format("DD");
  }
  if(date && fragment == 2){
    return  moment(date).format("MMM, YYYY");
  }
  if(date && fragment == 3){
    return  moment(date).format("DD MMM YYYY");
  }
  if(date && fragment == 4){
    return  moment(date).format("h:mm A");
  }
} 

/*
  style = 'currency', 'decimal' or 'percent'
*/
export function numberFormat(amount, style, minimumFractionDigits, maximumFractionDigits) {
  let locale                = 'en'; // todo
  let currency              = "INR"; //'usd'; // todo
  style                     = style || 'decimal';
  maximumFractionDigits     = maximumFractionDigits || 2;

  var options               = {style: style, currency: currency,currencyDisplay: 'code', maximumFractionDigits: maximumFractionDigits, minimumFractionDigits: minimumFractionDigits};
  var formatter             = new Intl.NumberFormat(locale, options);
  if ( amount && amount !== null && amount !== '' && amount > 0 ) {
    return formatter.format(amount);
    //return givenNumber.toString().match(/^-?\d+(?:\.\d{0,2})?/)[0];
  }

  return formatter.format(0);
}