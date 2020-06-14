module.exports = [
    {
        regExp: /^(.+)?-results\/(\d{4}-\d{2}-\d{2})$/,
        replacer: (match, g1, g2) => {
            return `${g1}/results/${g2}`;
        }
    },
    {
        regExp: /^(.+)?-results$/,
        replacer: (match, g1) => {
            return `${g1}/results`;
        }
    },
    {
        regExp: /^\/about-us(.*)$/,
        replacer: (match, g1) => {
          return `/about${g1}`;
        }
    }
];
