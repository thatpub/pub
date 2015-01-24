var App = function ( _ ) {
  'use strict';
  var regMini = / ?mini ?/g,
      months = {
        '01': 'Jan',
        '02': 'Feb',
        '03': 'Mar',
        '04': 'Apr',
        '05': 'May',
        '06': 'Jun',
        '07': 'Jul',
        '08': 'Aug',
        '09': 'Sep',
        '10': 'Oct',
        '11': 'Nov',
        '12': 'Dec'
      };

  function filterOutliers ( someArray ) {
    /* Thanks to jpau for the outlier function
     * http://stackoverflow.com/a/20811670/2780033
     */
    var values = someArray.concat();
    values.sort( function ( a, b ) {
      return a - b;
    });
    var q1 = values[Math.floor((values.length / 4))];
    var q3 = values[Math.ceil((values.length * (3 / 4)))];
    var iqr = q3 - q1;
    var maxValue = q3 + iqr*1.5;
    var filteredValues = values.filter( function ( x ) {
        return (x > maxValue);
    });
    return filteredValues;
  }

  return {
    placeContent: document.cookie.placeContent || '',
    placeMeta: document.cookie.placeMeta || '',
    traveling: false,
    regMini: regMini,
    term: ''
  };
}
