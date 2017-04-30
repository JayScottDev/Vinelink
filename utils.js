const MILLIS_IN_SECOND = 1000
const SECONDS_IN_MINUTE = 60
const MINUTES_IN_HOUR = 60
const HOURS_IN_DAY = 24
const DAYS_IN_YEAR = 365
const CURRENT_OLDEST_PERSON = 117 //Violet Brown

const yearsToUnix = (numOfYears) => {
  const milliseconds = numOfYears * (MILLIS_IN_SECOND * SECONDS_IN_MINUTE * MINUTES_IN_HOUR * HOURS_IN_DAY * DAYS_IN_YEAR)
  return Date.now() - milliseconds
}

//generates a unix timestamp that is atleast 21 years ago. DoB is required for shipcompliant, but there is no way to get that info from shopify, so we're faking it.

// TODO: add 'I am atleast 21 years of age' checkbox to cart

module.exports = {
  generateDOB: function () {
    const max = yearsToUnix(21);
    const min =  yearsToUnix(CURRENT_OLDEST_PERSON);
    return Math.floor(Math.random() * (max - min)) + min;
  }
};
