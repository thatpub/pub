"use strict";
var makeTemplates = function ( template ) {
    var relatedTemplateString = [
        '<li class="result doc<%= gravitas %>" data-score="<%= score %>" id="<%= key %>">',
        '<%= key %>',
        '</li>'
    ];

    var resultTemplateString = [
        '<div class="result<%= type %><%= gravitas %> clearfix" data-score="<%= score %>" data-pub="<%= fullPub %>">',
        '<% if ( type === " content" ) { %>',
        '<div class="text clearfix">',
        '<% if ( parts && concatText ) { %>',
        '<span class="combined"><%= concatText %><br/></span>',
        '<span class="parts"><%  var i = 0, count = parts.length;',
        'for (; i < count;++i) {',
        'if ( count > 1 || concatText.length > parts[0].length ) { %>',
        '<q>...<%= parts[i] %>...</q>',
        '<% } else { %>',
        '<%= parts[0] %>',
        '<% } %>',
        '<% } %></span>',
        '<% if ( count > 1 || concatText.length > parts[0].length ) { %><a href="#" class="reveal-text clickable">expand</a><% } %>',
        '<% } else { %>',
        '<span class="combined"><%= rawText %></span>',
        '<span class="parts"></span>',
        '<a href="#" class="reveal-text clickable">expand</a>',
        '<% } %>',
        '</div>',
        '<div class="meta">',
        '<div class="details">',
        '<span class="number"><%= sub %></span><br/>',
        '<% if ( details && details.chapter && details.chapterTitle ) { %>',
        '<span class="chapter">Chapter <%= details.chapter %><br/><span class="title"><%= details.chapterTitle %></span></span><br/>',
        '<% } if ( details && details.section && details.sectionTitle ) { %>',
        '<span class="section">Section <%= details.section %><br/><span class="title"><%= details.sectionTitle %></span></span><br/>',
        '<% } %>',
        '</div>',
        '<a class="info clickable" href="<%= url %>" title="<%= date %>" download="<%= fullPub %>.pdf" target="_blank">',
        '<span class="pub"><%= fullPub %></span><br/>',
        '<span class="title"><%= title %></span>',
        '</a>',
        '</div>',
        '<% } else { %>',
        '<a class="info clickable" href="<%= url %>" title="<%= date %>" download="<%= fullPub %>.pdf" target="_blank">',
        '<span class="pub"><%= fullPub %></span><br/>',
        '<span class="title"><%= title %></span>',
        '</a>',
        '<% } %>',
        '</div>'
    ];

    return {
        "results": template(resultTemplateString.join('')),
        "related": template(relatedTemplateString.join(''))
    };
};
