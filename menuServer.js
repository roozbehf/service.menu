/* Menu Service
   PoC of a menu scarper based on a good tutorial on http://scotch.io
   Thank you Adnan Kukic!

   (c) Copyright 2015, Roozbeh Farahbod
*/

var express = require('express');
var fs = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();

function htmlify(menuData) {
    var result = "<div class='menu'>";
    result = result.concat(
      "<p class='menuTitle'><a href='", url, "'>", menuData.date, "</a></p>",
      "<ul>"
    );
    for (var i in menuData.items) {
      result = result.concat("<li>", menuData.items[i], "</li>");
    }
    result = result.concat("</ul></div>");

    return result;
};

// app.get('/menu/downstairs', function(req, res){
//
//   url = 'http://atrium.bebysodexo.com/be/menuplan.html';
//
//   var loadMenuPromise = new Promise(function(resolve, reject) {
//     request(url, function(error, response, html) {
//       if (!error) {
//         var $ = cheerio.load(html, {normalizeWhitespace: true});
//         var menu = {
//           date: "",
//           items: []
//         }
//
//         $('.planright').filter(function() {
//           var data = $(this);
//           menu.date = data.children().first().text();
//
//           data.children('p').each( function(i, elem) {
//             menu.items.push($(this).text().trim());
//           });
//
//           resolve(menu);
//         })
//       }
//
//     });
//   });
//
//   loadMenuPromise.then(function(value) {
//     res.send(htmlify(value));
//   });
// });
var downstairsScraper = function(req, res){

  url = 'http://atrium.bebysodexo.com/be/menuplan.html';

  var loadMenuPromise = new Promise(function(resolve, reject) {
    request(url, function(error, response, html) {
      if (!error) {
        var $ = cheerio.load(html, {normalizeWhitespace: true});
        var menu = {
          date: "",
          items: []
        }

        $('.planright').filter(function() {
          var data = $(this);
          menu.date = data.children().first().text();

          data.children('p').each( function(i, elem) {
            menu.items.push($(this).text().trim());
          });

          resolve(menu);
        })
      }

    });
  });

  loadMenuPromise.then(function(value) {
    res.send(htmlify(value));
  });
};

var menuServices = [
  {
    name: "downstairs",
    scraper: downstairsScraper
  }
];

// load menus
var menus = "<div class='menus'><ul>";
for (var menuIndex in menuServices) {
    var ms = menuServices[menuIndex];
    app.get('/menu/'.concat(ms.name), ms.scraper);
    menus = menus.concat("<li><a href='/menu/", ms.name, "'>", ms.name, "</a></li>");
}
menus = menus.concat("</ul></div>")

app.get('/menu', function(req, res) {
  res.send(menus);
});

app.listen('8089')
console.log('Menus are served on port 8089.');
exports = module.exports = app;
