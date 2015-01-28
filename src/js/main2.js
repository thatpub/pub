var App = function ( _, undefined ) {
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
    searchWrap_: document.getElementById('search-wrap'),
    searchRestore_: document.getElementById('search-restore'),
    page_: document.getElementById('page'),
    results_: document.getElementById('results'),
    summary_: document.getElementById('summary'),
    term_: document.getElementById('term'),
    total_: document.getElementById('total'),
    query_: document.getElementById('query'),
    send_: document.getElementById('send'),
    moreMeta_: document.getElementById('more-meta'),
    moreContent_: document.getElementById('more-content'),
    related_: document.getElementById('related'),
    placeContent: document.cookie.placeContent||'',
    placeMeta: document.cookie.placeMeta||'',
    traveling: false,
    regMini: regMini,
    term: '',
    scoresContent: [],
    scoresRelatives: [],
    dataRender: function ( data, allScores ) {
      var output = {},
          regType = /chapter|section/,
          number,
          full,
          fullPub,
          text,
          date,
          highlights,
          fileFormat;
      if ( !data._source && data.key && data.score ) {
          /* This won't work without more fields in the aggregation to give me
              info to use.  Filetype is unknown, date, URL, etc. */
        output = {
          url: 'http://get.that.pub/' + data.key.toLowerCase() + '.pdf',
          key: data.key,
          score: data.score,
          gravitas: (
            _.contains(
              filterOutliers(allScores), data.score
            ) || data.score >= 1
          ) ? ' pretty' : ' boring'
        };
      }
      else if ( data._source.text ) {
        number = data._source.number;
        text = data.highlight.text;
        full = data._source.text;
        fullPub = data._source.productNo;
        highlights = Object.keys(data.highlight);
        fileFormat = ( data._type !== 'form' ) ? '.pdf' : '.xfdl';

        if ( /productNo(?:\.exact|\.raw)?(?=\:|$)/.test(highlights.join(':')) ) {
          fullPub = data.highlight['productNo.exact'] || data.highlight['productNo.raw'] || data.highlight.productNo;
          fullPub = fullPub.shift();
        }
        /* This is for when I have the results split up by XX characters each.*/
        /*full = "<span>" + (data.highlight.text||data._source.text||"") + "</span>";*/
        try {
          full = text[0]||full||null;
        } catch (badz) {
          full = full||null; /* This only happens if it's just the meta info */
        }

          date = ( data._source.releaseDate ) ?
                 data._source.releaseDate.substring(6, 8) + ' ' + months[data._source.releaseDate.substring(4, 6)] + ' ' + data._source.releaseDate.substring(0, 4) :
                 data._source.publishedDate.substring(0, 2) + ' ' + months[data._source.publishedDate.substring(2, 4)] + ' ' + data._source.publishedDate.substring(4, 8);

        if ( regType.test(data._type) && data._type.length === 7 ) {
          number = data._type.toTitle() + ' ' + data._source.number;
        }

        output = {
          score: data._score,
          gravitas: (
          _.contains(
            filterOutliers(allScores), data._score
          ) || data._score >= 1
          ) ? ' pretty' : ' boring',
          date: date,
          url: 'http://get.that.pub/' + data._source.productNo.toLowerCase() + fileFormat,
          pub: fullPub,
          rawPub: data._source.productNo,
          title: data.highlight.title || data._source.title || null,
          rawTitle: data._source.title,
          sub: ( full ) ? number : '',
          details: [
            {
              chapter: data._source.chapter && data._source.chapter.number || null,
              chapterTitle: data.highlight.chapter && data.highlight.chapter.title || data._source.chapter && data._source.chapter.title || null
            },
            {
              section: data._source.section && data._source.section.number || null,
              sectionTitle: data.highlight.section && data.highlight.section.title || data._source.section && data._source.section.title || null
            }
          ],
          fullText: full,
          partText: full.longToShort().before,
          partText2: full.longToShort().after,
          fileFormat: fileFormat,
          type: ( full ) ? ' content' : ' doc'
        };

      }
      return output || null;
    },
    querySetup: function ( term ) {
      return (function ( name ) {
        return {
          term: term,
          pubName: name.extract,
          noPubName: name.remove
        };
      })(term.toPubName());
    },
    addItem: function ( results, templateCode, allScores ) {
      var tmp = '',
          that = this;
      console.log(allScores, that[allScores]);
      _.forEach(results, function ( result ) {
        tmp += _.template(templateCode, that.dataRender(result, that[allScores]));
      });
      return tmp;
    }
  };
};
