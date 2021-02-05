/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/dist/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/d3Function.js":
/*!***************************!*\
  !*** ./src/d3Function.js ***!
  \***************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _interpretation__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./interpretation */ "./src/interpretation.js");


var d3Function = function d3Function(track) {
  console.log(track);
  var trackId = "";
  var features = ["danceability", "energy", "key", "valence", "tempo"];
  $.get("/tracksearch/".concat(track), function (data) {
    // Display the album art and artist information
    var img = $('<img id="albumart"/>');
    img.attr('src', data.album.images[0].url);
    img.appendTo('#track-image');
    var artist = $("<div id=\"artist-info\">\n        <div>Artist: ".concat(data.artists[0].name, "</div>\n        <div>Track: ").concat(data.name, "</div>\n        </div>"));
    artist.appendTo('#track-image'); //gets genres from artist

    $.get("/album/".concat(data.artists[0].id), function (data) {
      //creates a cloud of genres
      var d3Cloud = d3.select('#genre-cloud').selectAll('div');
      d3Cloud.data(data.body.genres).enter().append("div").text(function (d) {
        return d;
      });
    }); // gets trackanalysis from searched trackId

    trackId = data.id;
    $.get("/trackanalysis/".concat(trackId), function (data) {
      var d3Data = Object.entries(data.body).filter(function (el) {
        return features.includes(el[0]);
      });
      var d3DataInterpreted = Object(_interpretation__WEBPACK_IMPORTED_MODULE_0__["default"])(d3Data); // D3 logic -- grateful to yangdanny97.github.io for the tutorial

      var radialScale = d3.scaleLinear().domain([0, 10]).range([0, 250]);
      var ticks = [2, 4, 6, 8, 10];
      var svg = d3.select("#data-container").append("svg").attr("width", 700).attr("height", 700);
      ticks.forEach(function (t) {
        return svg.append("circle").attr("cx", 300).attr("cy", 300).attr("fill", "none").attr("stroke", "gray").attr("r", radialScale(t));
      });
      ticks.forEach(function (t) {
        return svg.append("text").attr("x", 305).attr("y", 300 - radialScale(t)).text(t.toString());
      });

      function angleToCoordinate(angle, value) {
        var x = Math.cos(angle) * radialScale(value);
        var y = Math.sin(angle) * radialScale(value);
        return {
          "x": 300 + x,
          "y": 300 - y
        };
      }

      ;

      for (var i = 0; i < features.length; i++) {
        var ft_name = features[i];
        var angle = Math.PI / 2 + 2 * Math.PI * i / features.length;
        var line_coordinate = angleToCoordinate(angle, 10);
        var label_coordinate = angleToCoordinate(angle, 11.55);
        svg.append("line").attr("x1", 300).attr("y1", 300).attr("x2", line_coordinate.x).attr("y2", line_coordinate.y).attr("stroke", "black");
        svg.append("text").attr("x", label_coordinate.x).attr("y", label_coordinate.y).text(ft_name);
      }

      ;
      var line = d3.line().x(function (d) {
        return d.x;
      }).y(function (d) {
        return d.y;
      });

      function getPathCoordinates(data_point) {
        var coordinates = [];

        for (var i = 0; i < features.length; i++) {
          var _angle = Math.PI / 2 + 2 * Math.PI * i / features.length;

          coordinates.push(angleToCoordinate(_angle, data_point[i][3]));
        }

        ;
        return coordinates;
      }

      ;
      var color = "darkorange";
      var coordinates = getPathCoordinates(d3DataInterpreted);
      svg.append("path").datum(coordinates).attr("d", line).attr("stroke-width", 3).attr("stroke", color).attr("fill", color).attr("stroke-opacity", 1).attr("opacity", 0.5); // displays the data text with 

      var divSelection = d3.select('#data-bars').selectAll('div');
      divSelection.data(d3DataInterpreted).enter().append("div").text(function (d) {
        return d[0] + ": " + d[2];
      });
    });
  });
};

/* harmony default export */ __webpack_exports__["default"] = (d3Function);

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_index_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles/index.scss */ "./src/styles/index.scss");
/* harmony import */ var _styles_index_scss__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_styles_index_scss__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _search__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./search */ "./src/search.js");
/* harmony import */ var _d3Function__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./d3Function */ "./src/d3Function.js");



window.addEventListener("DOMContentLoaded", function () {
  Object(_d3Function__WEBPACK_IMPORTED_MODULE_2__["default"])();
});

/***/ }),

/***/ "./src/interpretation.js":
/*!*******************************!*\
  !*** ./src/interpretation.js ***!
  \*******************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
//these functions interpret and normalize the data 
var dataInterpretation = function dataInterpretation(data) {
  var result = data.map(function (el) {
    if (el[0] == "acousticness") {
      el.push(acousticness(el[1]));
      el.push(el[1] * 10);
      return el;
    } else if (el[0] == "danceability") {
      el.push(danceability(el[1]));
      el.push(el[1] * 10);
      return el;
    } else if (el[0] == "energy") {
      el.push(energy(el[1]));
      el.push(el[1] * 10);
      return el;
    } else if (el[0] == "instrumentalness") {
      el.push(instrumentalness(el[1]));
      el.push(el[1] * 10);
      return el;
    } else if (el[0] == "key") {
      el.push(key(el[1]));
      el.push(el[1]);
      return el;
    } else if (el[0] == "tempo") {
      el.push(Math.floor(el[1]));
      el.push((el[1] - 50) / 15);
      return el;
    } else if (el[0] == "valence") {
      el.push(valence(el[1]));
      el.push(el[1] * 10);
      return el;
    }

    ;
  });
  return result;
};

var acousticness = function acousticness(datum) {
  if (datum < 0.2) {
    return "Acoustic";
  } else if (datum < 0.4) {
    return "Mostly acoustic";
  } else {
    return "Not acoustic";
  }
};

var danceability = function danceability(datum) {
  if (datum < 0.2) {
    return "Not danceable";
  } else if (datum < 0.4) {
    return "Slow Dance";
  } else if (datum < 0.6) {
    return "Got a beat";
  } else if (datum < 0.8) {
    return "Upbeat";
  } else {
    return "Banger";
  }

  ;
};

var energy = function energy(datum) {
  if (datum < 0.2) {
    return "Relaxing";
  } else if (datum < 0.4) {
    return "Low energy";
  } else if (datum < 0.6) {
    return "Andante";
  } else if (datum < 0.8) {
    return "High energy";
  } else {
    return "It slaps";
  }

  ;
};

var instrumentalness = function instrumentalness(datum) {
  if (datum < 0.9) {
    return "Not instrumental";
  } else {
    return "Instrumental";
  }

  ;
};

var key = function key(datum) {
  if (datum == 0) {
    return "Key of C";
  } else if (datum == 1) {
    return "Key of C♯, D♭";
  } else if (datum == 2) {
    return "Key of D";
  } else if (datum == 3) {
    return "Key of D♯, E♭";
  } else if (datum == 4) {
    return "Key of E";
  } else if (datum == 5) {
    return "Key of F";
  } else if (datum == 6) {
    return "Key of F♯, G♭";
  } else if (datum == 7) {
    return "Key of G";
  } else if (datum == 8) {
    return "Key of G♯, A♭";
  } else if (datum == 9) {
    return "Key of A";
  } else if (datum == 10) {
    return "Key of A♯, B♭";
  } else if (datum == 11) {
    return "Key of B";
  } else {
    return "No key";
  }

  ;
};

var valence = function valence(datum) {
  if (datum < 0.2) {
    return "Bleak";
  } else if (datum < 0.4) {
    return "Melancholic";
  } else if (datum < 0.6) {
    return "Serene";
  } else if (datum < 0.8) {
    return "Happy";
  } else {
    return "Euphoric";
  }

  ;
};

/* harmony default export */ __webpack_exports__["default"] = (dataInterpretation);

/***/ }),

/***/ "./src/reset.js":
/*!**********************!*\
  !*** ./src/reset.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var dataReset = function dataReset() {
  d3.select("#main-container").selectAll("*").remove();
  var img = $('<div id="track-image"></div>');
  img.appendTo("#main-container");
  var genre = $('<div id="genre-cloud"></div>');
  genre.appendTo("#main-container");
  var data = $('<div id="data-bars"></div>');
  data.appendTo("#main-container");
};

/* harmony default export */ __webpack_exports__["default"] = (dataReset);

/***/ }),

/***/ "./src/search.js":
/*!***********************!*\
  !*** ./src/search.js ***!
  \***********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _d3Function__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./d3Function */ "./src/d3Function.js");
/* harmony import */ var _reset__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./reset */ "./src/reset.js");


window.addEventListener("DOMContentLoaded", function () {
  document.getElementById("searchbutton").addEventListener("click", function () {
    event.preventDefault();
    Object(_reset__WEBPACK_IMPORTED_MODULE_1__["default"])();
    Object(_d3Function__WEBPACK_IMPORTED_MODULE_0__["default"])(document.getElementById("search").value);
  });
});

/***/ }),

/***/ "./src/styles/index.scss":
/*!*******************************!*\
  !*** ./src/styles/index.scss ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// extracted by mini-css-extract-plugin

/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2QzRnVuY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9pbnRlcnByZXRhdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVzZXQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlYXJjaC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGVzL2luZGV4LnNjc3M/YzgwNyJdLCJuYW1lcyI6WyJkM0Z1bmN0aW9uIiwidHJhY2siLCJjb25zb2xlIiwibG9nIiwidHJhY2tJZCIsImZlYXR1cmVzIiwiJCIsImdldCIsImRhdGEiLCJpbWciLCJhdHRyIiwiYWxidW0iLCJpbWFnZXMiLCJ1cmwiLCJhcHBlbmRUbyIsImFydGlzdCIsImFydGlzdHMiLCJuYW1lIiwiaWQiLCJkM0Nsb3VkIiwiZDMiLCJzZWxlY3QiLCJzZWxlY3RBbGwiLCJib2R5IiwiZ2VucmVzIiwiZW50ZXIiLCJhcHBlbmQiLCJ0ZXh0IiwiZCIsImQzRGF0YSIsIk9iamVjdCIsImVudHJpZXMiLCJmaWx0ZXIiLCJlbCIsImluY2x1ZGVzIiwiZDNEYXRhSW50ZXJwcmV0ZWQiLCJkYXRhSW50ZXJwcmV0YXRpb24iLCJyYWRpYWxTY2FsZSIsInNjYWxlTGluZWFyIiwiZG9tYWluIiwicmFuZ2UiLCJ0aWNrcyIsInN2ZyIsImZvckVhY2giLCJ0IiwidG9TdHJpbmciLCJhbmdsZVRvQ29vcmRpbmF0ZSIsImFuZ2xlIiwidmFsdWUiLCJ4IiwiTWF0aCIsImNvcyIsInkiLCJzaW4iLCJpIiwibGVuZ3RoIiwiZnRfbmFtZSIsIlBJIiwibGluZV9jb29yZGluYXRlIiwibGFiZWxfY29vcmRpbmF0ZSIsImxpbmUiLCJnZXRQYXRoQ29vcmRpbmF0ZXMiLCJkYXRhX3BvaW50IiwiY29vcmRpbmF0ZXMiLCJwdXNoIiwiY29sb3IiLCJkYXR1bSIsImRpdlNlbGVjdGlvbiIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZXN1bHQiLCJtYXAiLCJhY291c3RpY25lc3MiLCJkYW5jZWFiaWxpdHkiLCJlbmVyZ3kiLCJpbnN0cnVtZW50YWxuZXNzIiwia2V5IiwiZmxvb3IiLCJ2YWxlbmNlIiwiZGF0YVJlc2V0IiwicmVtb3ZlIiwiZ2VucmUiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCJdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUFBO0FBQUE7O0FBRUEsSUFBTUEsVUFBVSxHQUFHLFNBQWJBLFVBQWEsQ0FBU0MsS0FBVCxFQUFnQjtBQUUvQkMsU0FBTyxDQUFDQyxHQUFSLENBQVlGLEtBQVo7QUFDRixNQUFJRyxPQUFPLEdBQUcsRUFBZDtBQUNBLE1BQU1DLFFBQVEsR0FBRyxDQUFDLGNBQUQsRUFBaUIsUUFBakIsRUFBMkIsS0FBM0IsRUFBa0MsU0FBbEMsRUFB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QSxTQUFZLEdBQVk7QUFDMUIzRCxJQUFFLENBQUNDLE1BQUgsQ0FBVSxpQkFBVixFQUE2QkMsU0FBN0IsQ0FBdUMsR0FBdkMsRUFBNEMwRCxNQUE1QztBQUNBLE1BQUl2RSxHQUFHLEdBQUdILENBQUMsQ0FBQyw4QkFBRCxDQUFYO0FBQ0FHLEtBQUcsQ0FBQ0ssUUFBSixDQUFhLGlCQUFiO0FBQ0EsTUFBSW1FLEtBQUssR0FBRzNFLENBQUMsQ0FBQyw4QkFBRCxDQUFiO0FBQ0EyRSxPQUFLLENBQUNuRSxRQUFOLENBQWUsaUJBQWY7QUFDQSxNQUFJTixJQUFJLEdBQUdGLENBQUMsQ0FBQyw0QkFBRCxDQUFaO0FBQ0FFLE1BQUksQ0FBQ00sUUFBTCxDQUFjLGlCQUFkO0FBQ0gsQ0FSRDs7QUFVZWlFLHdFQUFmLEU7Ozs7Ozs7Ozs7OztBQ1ZBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFFQVgsTUFBTSxDQUFDQyxnQkFBUCxDQUF3QixrQkFBeEIsRUFBNEMsWUFBTTtBQUNsRGEsVUFBUSxDQUFDQyxjQUFULENBQXdCLGNBQXhCLEVBQXdDZCxnQkFBeEMsQ0FBeUQsT0FBekQsRUFBa0UsWUFBTTtBQUNwRWUsU0FBSyxDQUFDQyxjQUFOO0FBQ0FOLDBEQUFTO0FBQ1QvRSwrREFBVSxDQUFDa0YsUUFBUSxDQUFDQyxjQUFULENBQXdCLFFBQXhCLEVBQWtDbkMsS0FBbkMsQ0FBVjtBQUNILEdBSkQ7QUFLQyxDQU5ELEU7Ozs7Ozs7Ozs7O0FDSEEsdUMiLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIiBcdC8vIFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiL2Rpc3QvXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSBcIi4vc3JjL2luZGV4LmpzXCIpO1xuIiwiaW1wb3J0IGRhdGFJbnRlcnByZXRhdGlvbiBmcm9tIFwiLi9pbnRlcnByZXRhdGlvblwiO1xuXG5jb25zdCBkM0Z1bmN0aW9uID0gZnVuY3Rpb24odHJhY2spIHtcbiAgICBcbiAgICBjb25zb2xlLmxvZyh0cmFjayk7XG4gIGxldCB0cmFja0lkID0gXCJcIjtcbiAgY29uc3QgZmVhdHVyZXMgPSBbXCJkYW5jZWFiaWxpdHlcIiwgXCJlbmVyZ3lcIiwgXCJrZXlcIiwgXCJ2YWxlbmNlXCIsIFwidGVtcG9cIl0gXG4gICAgXG4gICQuZ2V0KGAvdHJhY2tzZWFyY2gvJHt0cmFja31gLCAoZGF0YSkgPT4ge1xuICAgIC8vIERpc3BsYXkgdGhlIGFsYnVtIGFydCBhbmQgYXJ0aXN0IGluZm9ybWF0aW9uXG4gICAgbGV0IGltZyA9ICQoJzxpbWcgaWQ9XCJhbGJ1bWFydFwiLz4nKTtcbiAgICBpbWcuYXR0cignc3JjJywgZGF0YS5hbGJ1bS5pbWFnZXNbMF0udXJsKTtcbiAgICBpbWcuYXBwZW5kVG8oJyN0cmFjay1pbWFnZScpO1xuICAgIGxldCBhcnRpc3QgPSAkKGA8ZGl2IGlkPVwiYXJ0aXN0LWluZm9cIj5cbiAgICAgICAgPGRpdj5BcnRpc3Q6ICR7ZGF0YS5hcnRpc3RzWzBdLm5hbWV9PC9kaXY+XG4gICAgICAgIDxkaXY+VHJhY2s6ICR7ZGF0YS5uYW1lfTwvZGl2PlxuICAgICAgICA8L2Rpdj5gKTtcbiAgICBhcnRpc3QuYXBwZW5kVG8oJyN0cmFjay1pbWFnZScpO1xuXG4gICAgLy9nZXRzIGdlbnJlcyBmcm9tIGFydGlzdFxuICAgICQuZ2V0KGAvYWxidW0vJHtkYXRhLmFydGlzdHNbMF0uaWR9YCwgKGRhdGEpID0+IHtcbiAgICAgIC8vY3JlYXRlcyBhIGNsb3VkIG9mIGdlbnJlc1xuICAgICAgbGV0IGQzQ2xvdWQgPSBkMy5zZWxlY3QoJyNnZW5yZS1jbG91ZCcpLnNlbGVjdEFsbCgnZGl2Jyk7XG4gICAgICAgIGQzQ2xvdWQuZGF0YShkYXRhLmJvZHkuZ2VucmVzKS5lbnRlcigpLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAudGV4dCgoZCkgPT4ge3JldHVybiBkfSk7ICAgIFxuICAgIH0pO1xuXG5cbiAgICBcbiAgICAvLyBnZXRzIHRyYWNrYW5hbHlzaXMgZnJvbSBzZWFyY2hlZCB0cmFja0lkXG4gICAgdHJhY2tJZCA9IGRhdGEuaWQ7XG4gICAgJC5nZXQoYC90cmFja2FuYWx5c2lzLyR7dHJhY2tJZH1gLCAoZGF0YSkgPT4ge1xuICAgICAgICAgIGxldCBkM0RhdGEgPSBPYmplY3QuZW50cmllcyhkYXRhLmJvZHkpXG4gICAgICAgICAgIC5maWx0ZXIoZWwgPT4gZmVhdHVyZXMuaW5jbHVkZXMoZWxbMF0pKTtcbiAgICAgICAgICBsZXQgZDNEYXRhSW50ZXJwcmV0ZWQgPSBkYXRhSW50ZXJwcmV0YXRpb24oZDNEYXRhKTtcblxuICAgICAgICBcbiAgICAvLyBEMyBsb2dpYyAtLSBncmF0ZWZ1bCB0byB5YW5nZGFubnk5Ny5naXRodWIuaW8gZm9yIHRoZSB0dXRvcmlhbFxuICAgICAgICBsZXQgcmFkaWFsU2NhbGUgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAgICAgLmRvbWFpbihbMCwxMF0pXG4gICAgICAgICAgLnJhbmdlKFswLDI1MF0pO1xuICAgICAgICBsZXQgdGlja3MgPSBbMiw0LDYsOCwxMF07XG5cbiAgICAgICAgbGV0IHN2ZyA9IGQzLnNlbGVjdChcIiNkYXRhLWNvbnRhaW5lclwiKS5hcHBlbmQoXCJzdmdcIilcbiAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIDcwMClcbiAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCA3MDApO1xuICAgICAgICBcbiAgICAgICAgICB0aWNrcy5mb3JFYWNoKHQgPT5cbiAgICAgICAgICAgIHN2Zy5hcHBlbmQoXCJjaXJjbGVcIilcbiAgICAgICAgICAgIC5hdHRyKFwiY3hcIiwgMzAwKVxuICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCAzMDApXG4gICAgICAgICAgICAuYXR0cihcImZpbGxcIiwgXCJub25lXCIpXG4gICAgICAgICAgICAuYXR0cihcInN0cm9rZVwiLCBcImdyYXlcIilcbiAgICAgICAgICAgIC5hdHRyKFwiclwiLCByYWRpYWxTY2FsZSh0KSlcbiAgICAgICAgKTtcblxuICAgICAgICB0aWNrcy5mb3JFYWNoKHQgPT5cbiAgICAgICAgICBzdmcuYXBwZW5kKFwidGV4dFwiKVxuICAgICAgICAgIC5hdHRyKFwieFwiLCAzMDUpXG4gICAgICAgICAgLmF0dHIoXCJ5XCIsIDMwMCAtIHJhZGlhbFNjYWxlKHQpKVxuICAgICAgICAgIC50ZXh0KHQudG9TdHJpbmcoKSlcbiAgICAgICk7XG5cbiAgICAgIGZ1bmN0aW9uIGFuZ2xlVG9Db29yZGluYXRlKGFuZ2xlLCB2YWx1ZSl7XG4gICAgICAgIGxldCB4ID0gTWF0aC5jb3MoYW5nbGUpICogcmFkaWFsU2NhbGUodmFsdWUpO1xuICAgICAgICBsZXQgeSA9IE1hdGguc2luKGFuZ2xlKSAqIHJhZGlhbFNjYWxlKHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHtcInhcIjogMzAwICsgeCwgXCJ5XCI6IDMwMCAtIHl9O1xuICAgICAgfTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmZWF0dXJlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgZnRfbmFtZSA9IGZlYXR1cmVzW2ldO1xuICAgICAgICBsZXQgYW5nbGUgPSAoTWF0aC5QSSAvIDIpICsgKDIgKiBNYXRoLlBJICogaSAvIGZlYXR1cmVzLmxlbmd0aCk7XG4gICAgICAgIGxldCBsaW5lX2Nvb3JkaW5hdGUgPSBhbmdsZVRvQ29vcmRpbmF0ZShhbmdsZSwgMTApO1xuICAgICAgICBsZXQgbGFiZWxfY29vcmRpbmF0ZSA9IGFuZ2xlVG9Db29yZGluYXRlKGFuZ2xlLCAxMS41NSk7XG4gICAgICBcbiAgICAgICAgc3ZnLmFwcGVuZChcImxpbmVcIilcbiAgICAgICAgICAuYXR0cihcIngxXCIsIDMwMClcbiAgICAgICAgICAuYXR0cihcInkxXCIsIDMwMClcbiAgICAgICAgICAuYXR0cihcIngyXCIsIGxpbmVfY29vcmRpbmF0ZS54KVxuICAgICAgICAgIC5hdHRyKFwieTJcIiwgbGluZV9jb29yZGluYXRlLnkpXG4gICAgICAgICAgLmF0dHIoXCJzdHJva2VcIixcImJsYWNrXCIpO1xuICAgICAgICBcbiAgICAgICAgc3ZnLmFwcGVuZChcInRleHRcIilcbiAgICAgICAgICAuYXR0cihcInhcIiwgbGFiZWxfY29vcmRpbmF0ZS54KVxuICAgICAgICAgIC5hdHRyKFwieVwiLCBsYWJlbF9jb29yZGluYXRlLnkpXG4gICAgICAgICAgLnRleHQoZnRfbmFtZSk7XG4gICAgICB9O1xuXG4gICAgbGV0IGxpbmUgPSBkMy5saW5lKClcbiAgICAgIC54KGQgPT4gZC54KVxuICAgICAgLnkoZCA9PiBkLnkpO1xuXG4gICAgZnVuY3Rpb24gZ2V0UGF0aENvb3JkaW5hdGVzKGRhdGFfcG9pbnQpe1xuICAgICAgbGV0IGNvb3JkaW5hdGVzID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZlYXR1cmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICBsZXQgYW5nbGUgPSAoTWF0aC5QSSAvIDIpICsgKDIgKiBNYXRoLlBJICogaSAvIGZlYXR1cmVzLmxlbmd0aCk7XG4gICAgICAgICAgY29vcmRpbmF0ZXMucHVzaChhbmdsZVRvQ29vcmRpbmF0ZShhbmdsZSwgKGRhdGFfcG9pbnRbaV1bM10pKSk7XG4gICAgICB9O1xuICAgICAgcmV0dXJuIGNvb3JkaW5hdGVzO1xuICAgIH07XG5cbiAgIFxuICAgICAgbGV0IGNvbG9yID0gXCJkYXJrb3JhbmdlXCI7XG4gICAgICBsZXQgY29vcmRpbmF0ZXMgPSBnZXRQYXRoQ29vcmRpbmF0ZXMoZDNEYXRhSW50ZXJwcmV0ZWQpO1xuICBcbiAgICAgIHN2Zy5hcHBlbmQoXCJwYXRoXCIpXG4gICAgICAuZGF0dW0oY29vcmRpbmF0ZXMpXG4gICAgICAuYXR0cihcImRcIixsaW5lKVxuICAgICAgLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgMylcbiAgICAgIC5hdHRyKFwic3Ryb2tlXCIsIGNvbG9yKVxuICAgICAgLmF0dHIoXCJmaWxsXCIsIGNvbG9yKVxuICAgICAgLmF0dHIoXCJzdHJva2Utb3BhY2l0eVwiLCAxKVxuICAgICAgLmF0dHIoXCJvcGFjaXR5XCIsIDAuNSk7XG5cbiAgICAgIC8vIGRpc3BsYXlzIHRoZSBkYXRhIHRleHQgd2l0aCBcbiAgICAgIGxldCBkaXZTZWxlY3Rpb24gPSBkMy5zZWxlY3QoJyNkYXRhLWJhcnMnKS5zZWxlY3RBbGwoJ2RpdicpO1xuXG4gICAgICAgICAgZGl2U2VsZWN0aW9uLmRhdGEoZDNEYXRhSW50ZXJwcmV0ZWQpLmVudGVyKCkuYXBwZW5kKFwiZGl2XCIpXG4gICAgICAgICAgLnRleHQoKGQpID0+IHtcbiAgICAgICAgICByZXR1cm4gZFswXSArIFwiOiBcIiArIGRbMl07fSlcbiAgICAgIH0pO1xuICB9KVxufVxuXG5leHBvcnQgZGVmYXVsdCBkM0Z1bmN0aW9uIiwiaW1wb3J0IFwiLi9zdHlsZXMvaW5kZXguc2Nzc1wiO1xuaW1wb3J0IFwiLi9zZWFyY2hcIjtcbmltcG9ydCBkM0Z1bmN0aW9uIGZyb20gXCIuL2QzRnVuY3Rpb25cIjtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHtcbiBkM0Z1bmN0aW9uKCk7XG59KTtcblxuIiwiLy90aGVzZSBmdW5jdGlvbnMgaW50ZXJwcmV0IGFuZCBub3JtYWxpemUgdGhlIGRhdGEgXG5cbmNvbnN0IGRhdGFJbnRlcnByZXRhdGlvbiA9IChkYXRhKSA9PiB7XG4gIFxuICAgIGxldCByZXN1bHQgPSBkYXRhLm1hcCgoZWwpID0+IHtcbiAgICAgIGlmIChlbFswXSA9PSBcImFjb3VzdGljbmVzc1wiKSB7XG4gICAgICBlbC5wdXNoKGFjb3VzdGljbmVzcyhlbFsxXSkpO1xuICAgICAgZWwucHVzaChlbFsxXSAqIDEwKTtcbiAgICAgIHJldHVybiBlbDtcbiAgICAgIH0gZWxzZSBpZiAoZWxbMF0gPT0gXCJkYW5jZWFiaWxpdHlcIikge1xuICAgICAgICBlbC5wdXNoKGRhbmNlYWJpbGl0eShlbFsxXSkpO1xuICAgICAgICBlbC5wdXNoKGVsWzFdICogMTApO1xuICAgICAgICByZXR1cm4gZWw7XG4gICAgICB9IGVsc2UgaWYgKGVsWzBdID09IFwiZW5lcmd5XCIpIHtcbiAgICAgICAgZWwucHVzaChlbmVyZ3koZWxbMV0pKTtcbiAgICAgICAgZWwucHVzaChlbFsxXSAqIDEwKTtcbiAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgfSBlbHNlIGlmIChlbFswXSA9PSBcImluc3RydW1lbnRhbG5lc3NcIikge1xuICAgICAgICBlbC5wdXNoKGluc3RydW1lbnRhbG5lc3MoZWxbMV0pKTtcbiAgICAgICAgZWwucHVzaChlbFsxXSAqIDEwKTtcbiAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgfSBlbHNlIGlmIChlbFswXSA9PSBcImtleVwiKSB7XG4gICAgICAgIGVsLnB1c2goa2V5KGVsWzFdKSk7XG4gICAgICAgIGVsLnB1c2goZWxbMV0pO1xuICAgICAgICByZXR1cm4gZWw7XG4gICAgICB9IGVsc2UgaWYgKGVsWzBdID09IFwidGVtcG9cIikge1xuICAgICAgICBlbC5wdXNoKE1hdGguZmxvb3IoZWxbMV0pKTtcbiAgICAgICAgZWwucHVzaCgoZWxbMV0tNTApLzE1KTtcbiAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgfSBlbHNlIGlmIChlbFswXSA9PSBcInZhbGVuY2VcIikge1xuICAgICAgICBlbC5wdXNoKHZhbGVuY2UoZWxbMV0pKTtcbiAgICAgICAgZWwucHVzaChlbFsxXSAqIDEwKTtcbiAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgfTtcbiAgICAgIFxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgXG4gIGNvbnN0IGFjb3VzdGljbmVzcyA9IChkYXR1bSkgPT4ge1xuICAgIGlmIChkYXR1bSA8IDAuMikge1xuICAgICAgcmV0dXJuIFwiQWNvdXN0aWNcIlxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPCAwLjQgKSB7XG4gICAgICByZXR1cm4gXCJNb3N0bHkgYWNvdXN0aWNcIlxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJOb3QgYWNvdXN0aWNcIlxuICAgIH1cbiAgfTtcbiAgXG4gIGNvbnN0IGRhbmNlYWJpbGl0eSA9IChkYXR1bSkgPT4ge1xuICAgIGlmIChkYXR1bSA8IDAuMikge1xuICAgICAgcmV0dXJuIFwiTm90IGRhbmNlYWJsZVwiXG4gICAgfSBlbHNlIGlmIChkYXR1bSA8IDAuNCkge1xuICAgICAgcmV0dXJuIFwiU2xvdyBEYW5jZVwiXG4gICAgfSBlbHNlIGlmIChkYXR1bSA8IDAuNikge1xuICAgICAgcmV0dXJuIFwiR290IGEgYmVhdFwiXG4gICAgfSBlbHNlIGlmIChkYXR1bSA8IDAuOCkge1xuICAgICAgcmV0dXJuIFwiVXBiZWF0XCJcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiQmFuZ2VyXCJcbiAgICB9O1xuICB9O1xuICBcbiAgY29uc3QgZW5lcmd5ID0gKGRhdHVtKSA9PiB7XG4gICAgaWYgKGRhdHVtIDwgMC4yKSB7XG4gICAgICByZXR1cm4gXCJSZWxheGluZ1wiXG4gICAgfSBlbHNlIGlmIChkYXR1bSA8IDAuNCkge1xuICAgICAgcmV0dXJuIFwiTG93IGVuZXJneVwiXG4gICAgfSBlbHNlIGlmIChkYXR1bSA8IDAuNikge1xuICAgICAgcmV0dXJuIFwiQW5kYW50ZVwiIFxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPCAwLjgpIHtcbiAgICAgIHJldHVybiBcIkhpZ2ggZW5lcmd5XCJcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiSXQgc2xhcHNcIlxuICAgIH07XG4gIH07XG4gIFxuICBjb25zdCBpbnN0cnVtZW50YWxuZXNzID0gKGRhdHVtKSA9PiB7XG4gICAgaWYgKGRhdHVtIDwgMC45KSB7XG4gICAgICByZXR1cm4gXCJOb3QgaW5zdHJ1bWVudGFsXCJcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiSW5zdHJ1bWVudGFsXCJcbiAgICB9O1xuICB9O1xuICBcbiAgY29uc3Qga2V5ID0gKGRhdHVtKSA9PiB7XG4gICAgaWYgKGRhdHVtID09IDApIHtcbiAgICAgIHJldHVybiBcIktleSBvZiBDXCJcbiAgICB9IGVsc2UgaWYgKGRhdHVtID09IDEpIHtcbiAgICAgIHJldHVybiBcIktleSBvZiBD4pmvLCBE4pmtXCJcbiAgICB9IGVsc2UgaWYgKGRhdHVtID09IDIpIHtcbiAgICAgIHJldHVybiBcIktleSBvZiBEXCJcbiAgICB9IGVsc2UgaWYgKGRhdHVtID09IDMpIHtcbiAgICAgIHJldHVybiBcIktleSBvZiBE4pmvLCBF4pmtXCJcbiAgICB9IGVsc2UgaWYgKGRhdHVtID09IDQpIHtcbiAgICAgIHJldHVybiBcIktleSBvZiBFXCJcbiAgICB9IGVsc2UgaWYgKGRhdHVtID09IDUpIHtcbiAgICAgIHJldHVybiBcIktleSBvZiBGXCJcbiAgICB9IGVsc2UgaWYgKGRhdHVtID09IDYpIHtcbiAgICAgIHJldHVybiBcIktleSBvZiBG4pmvLCBH4pmtXCJcbiAgICB9IGVsc2UgaWYgKGRhdHVtID09IDcpIHtcbiAgICAgIHJldHVybiBcIktleSBvZiBHXCIgXG4gICAgfSBlbHNlIGlmIChkYXR1bSA9PSA4KSB7XG4gICAgICByZXR1cm4gXCJLZXkgb2YgR+KZrywgQeKZrVwiIFxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPT0gOSkge1xuICAgICAgcmV0dXJuIFwiS2V5IG9mIEFcIiBcbiAgICB9IGVsc2UgaWYgKGRhdHVtID09IDEwKSB7XG4gICAgICByZXR1cm4gXCJLZXkgb2YgQeKZrywgQuKZrVwiIFxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPT0gMTEpIHtcbiAgICAgIHJldHVybiBcIktleSBvZiBCXCIgXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIk5vIGtleVwiIFxuICAgIH07XG4gIH07XG4gIFxuICBjb25zdCB2YWxlbmNlID0gKGRhdHVtKSA9PiB7XG4gICAgaWYgKGRhdHVtIDwgMC4yKSB7XG4gICAgICByZXR1cm4gXCJCbGVha1wiXG4gICAgfSBlbHNlIGlmIChkYXR1bSA8IDAuNCkge1xuICAgICAgcmV0dXJuIFwiTWVsYW5jaG9saWNcIlxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPCAwLjYpIHtcbiAgICAgIHJldHVybiBcIlNlcmVuZVwiIFxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPCAwLjgpIHtcbiAgICAgIHJldHVybiBcIkhhcHB5XCJcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiRXVwaG9yaWNcIlxuICAgIH07fTtcblxuICAgIGV4cG9ydCBkZWZhdWx0IGRhdGFJbnRlcnByZXRhdGlvbjsiLCJjb25zdCBkYXRhUmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgZDMuc2VsZWN0KFwiI21haW4tY29udGFpbmVyXCIpLnNlbGVjdEFsbChcIipcIikucmVtb3ZlKCk7XG4gICAgbGV0IGltZyA9ICQoJzxkaXYgaWQ9XCJ0cmFjay1pbWFnZVwiPjwvZGl2PicpO1xuICAgIGltZy5hcHBlbmRUbyhcIiNtYWluLWNvbnRhaW5lclwiKTtcbiAgICBsZXQgZ2VucmUgPSAkKCc8ZGl2IGlkPVwiZ2VucmUtY2xvdWRcIj48L2Rpdj4nKTtcbiAgICBnZW5yZS5hcHBlbmRUbyhcIiNtYWluLWNvbnRhaW5lclwiKTtcbiAgICBsZXQgZGF0YSA9ICQoJzxkaXYgaWQ9XCJkYXRhLWJhcnNcIj48L2Rpdj4nKTtcbiAgICBkYXRhLmFwcGVuZFRvKFwiI21haW4tY29udGFpbmVyXCIpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGRhdGFSZXNldCIsImltcG9ydCBkM0Z1bmN0aW9uIGZyb20gJy4vZDNGdW5jdGlvbic7XG5pbXBvcnQgZGF0YVJlc2V0IGZyb20gJy4vcmVzZXQnO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFyY2hidXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZGF0YVJlc2V0KCk7XG4gICAgZDNGdW5jdGlvbihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXJjaFwiKS52YWx1ZSk7XG59KTtcbn0pOyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiJdLCJzb3VyY2VSb290IjoiIn0=