"use strict";

var relatedTemplateString = '' +
  '<li class="result doc<%= gravitas %>" data-score="<%= score %>" id="<%= key %>">' +
    '<%= key %>' +
  '</li>';

var resultTemplateString = '' +
  '<div class="result<%= type %><%= gravitas %> clearfix" data-score="<%= score %>" data-pub="<%= fullPub %>">' +
    '<% if ( type === " content" ) { %>' +
    '<div class="text clearfix">' +
      '<% if ( parts && concatText ) { %>' +
        '<span class="combined"><%= concatText %><br/></span>' +
        '<span class="parts"><%  var i = 0, count = parts.length;' +
            'for (; i < count; ++i) {' +
              'if ( count > 1 || concatText.length > parts[0].length ) { %>' +
                '<q>...<%= parts[i] %>...</q>' +
              '<% } else { %>' +
                '<%= parts[0] %>' +
              '<% } %>' +
            '<% } %></span>' +
        '<% if ( count > 1 || concatText.length > parts[0].length ) { %><a href="#" class="reveal-text clickable">expand</a><% } %>' +
      '<% } else { %>' +
        '<span class="combined"><%= rawText %></span>' +
        '<span class="parts"></span>' +
        '<a href="#" class="reveal-text btn clickable">expand</a>' +
      '<% } %>' +
      '</div>' +
      '<div class="meta">' +
        '<div class="details">' +
          '<a class="number btn clickable" href="/<%= fullPub %>/<%= sub %>"><%= sub %></a><br/>' +
          '<% if ( details && details.chapter && details.chapterTitle ) { %>' +
          '<span class="chapter">Chapter <%= details.chapter %><br/><span class="title"><%= details.chapterTitle %></span></span><br/>' +
          '<% } if ( details && details.section && details.sectionTitle ) { %>' +
          '<span class="section">Section <%= details.section %><br/><span class="title"><%= details.sectionTitle %></span></span><br/>' +
          '<% } %>' +
        '</div>' +
        '<a class="info clickable" href="<%= url %>" title="<%= date %>" download="<%= fullPub %>.pdf" target="_blank" onclick="downloader(this);>' +
          '<span class="pub"><%= fullPub %></span><br/>' +
          '<span class="title"><%= title %></span>' +
        '</a>' +
      '</div>' +
    '<% } else { %>' +
    '<a class="info clickable" href="<%= url %>" title="<%= date %>" download="<%= fullPub %>.pdf" target="_blank" onclick="downloader(this);">' +
      '<span class="pub"><%= fullPub %></span><br/>' +
      '<span class="title"><%= title %></span>' +
    '</a>' +
    '<% } %>' +
  '</div>';

app.resultTemplate = _.template(resultTemplateString);
app.relatedTemplate = _.template(relatedTemplateString);
/*
function LoaderElement () {
  var loadFrag = document.createDocumentFragment(),
    loader = document.createElement("div"),
    pulse = document.createElement("div"),
    block = document.createElement("i");

  loader.id = "loader";
  loader.style.opacity = 0.8;

  pulse.className = "pulse";
  block.className = "fa fa-square";
  rect2.className = "rect2";
  rect3.className = "rect3";

  spinner.appendChild(top);
  spinner.appendChild(bottom);
  spinner.appendChild(left);
  spinner.appendChild(moveBlob);
  loader.appendChild(spinner);

  return loadFrag.appendChild(loader);
}*/

/*'<div class="number2">' +
 '<p><%= sub %></p>' +
 '<span class="reveal climb-up">climb up</span>' +
 '<span class="reveal look-inside">look inside</span>' +
 '<span class="reveal do-both">do both</span>' +
 '</div>' +*/
