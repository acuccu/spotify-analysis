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
  d3.select("#main").selectAll("*").remove();
  var img = $('<div id="track-image"></div>');
  img.appendTo("#main");
  var genre = $('<div id="genre-cloud"></div>');
  genre.appendTo("#main");
  var data = $('<div id="data-bars"></div>');
  data.appendTo("#main");
  var dataContainer = $('<div id="data-container"></div>');
  dataContainer.appendTo("#main");
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2QzRnVuY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9pbnRlcnByZXRhdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVzZXQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlYXJjaC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGVzL2luZGV4LnNjc3M/YzgwNyJdLCJuYW1lcyI6WyJkM0Z1bmN0aW9uIiwidHJhY2siLCJjb25zb2xlIiwibG9nIiwidHJhY2tJZCIsImZlYXR1cmVzIiwiJCIsImdldCIsImRhdGEiLCJpbWciLCJhdHRyIiwiYWxidW0iLCJpbWFnZXMiLCJ1cmwiLCJhcHBlbmRUbyIsImFydGlzdCIsImFydGlzdHMiLCJuYW1lIiwiaWQiLCJkM0Nsb3VkIiwiZDMiLCJzZWxlY3QiLCJzZWxlY3RBbGwiLCJib2R5IiwiZ2VucmVzIiwiZW50ZXIiLCJhcHBlbmQiLCJ0ZXh0IiwiZCIsImQzRGF0YSIsIk9iamVjdCIsImVudHJpZXMiLCJmaWx0ZXIiLCJlbCIsImluY2x1ZGVzIiwiZDNEYXRhSW50ZXJwcmV0ZWQiLCJkYXRhSW50ZXJwcmV0YXRpb24iLCJyYWRpYWxTY2FsZSIsInNjYWxlTGluZWFyIiwiZG9tYWluIiwicmFuZ2UiLCJ0aWNrcyIsInN2ZyIsImZvckVhY2giLCJ0IiwidG9TdHJpbmciLCJhbmdsZVRvQ29vcmRpbmF0ZSIsImFuZ2xlIiwidmFsdWUiLCJ4IiwiTWF0aCIsImNvcyIsInkiLCJzaW4iLCJpIiwibGVuZ3RoIiwiZnRfbmFtZSIsIlBJIiwibGluZV9jb29yZGluYXRlIiwibGFiZWxfY29vcmRpbmF0ZSIsImxpbmUiLCJnZXRQYXRoQ29vcmRpbmF0ZXMiLCJkYXRhX3BvaW50IiwiY29vcmRpbmF0ZXMiLCJwdXNoIiwiY29sb3IiLCJkYXR1bSIsImRpdlNlbGVjdGlvbiIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZXN1bHQiLCJtYXAiLCJhY291c3RpY25lc3MiLCJkYW5jZWFiaWxpdHkiLCJlbmVyZ3kiLCJpbnN0cnVtZW50YWxuZXNzIiwia2V5IiwiZmxvb3IiLCJ2YWxlbmNlIiwiZGF0YVJlc2V0IiwicmVtb3ZlIiwiZ2VucmUiLCJkYXRhQ29udGFpbmVyIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImV2ZW50IiwicHJldmVudERlZmF1bHQiXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFBOztBQUVBLElBQU1BLFVBQVUsR0FBRyxTQUFiQSxVQUFhLENBQVNDLEtBQVQsRUFBZ0I7QUFFL0JDLFNBQU8sQ0FBQ0MsR0FBUixDQUFZRixLQUFaO0FBQ0YsTUFBSUcsT0FBTyxHQUFHLEVBQWQ7QUFDQSxNQUFNQyxRQUFRLEdBQUcsQ0FBQyxjQUFELEVBQWlCLFFBQWpCLEVBQTJCLEtBQTNC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QyxTQUFTLEdBQUcsU0FBWkEsU0FBWSxHQUFZO0FBQzFCM0QsSUFBRSxDQUFDQyxNQUFILENBQVUsT0FBVixFQUFtQkMsU0FBbkIsQ0FBNkIsR0FBN0IsRUFBa0MwRCxNQUFsQztBQUNBLE1BQUl2RSxHQUFHLEdBQUdILENBQUMsQ0FBQyw4QkFBRCxDQUFYO0FBQ0FHLEtBQUcsQ0FBQ0ssUUFBSixDQUFhLE9BQWI7QUFDQSxNQUFJbUUsS0FBSyxHQUFHM0UsQ0FBQyxDQUFDLDhCQUFELENBQWI7QUFDQTJFLE9BQUssQ0FBQ25FLFFBQU4sQ0FBZSxPQUFmO0FBQ0EsTUFBSU4sSUFBSSxHQUFHRixDQUFDLENBQUMsNEJBQUQsQ0FBWjtBQUNBRSxNQUFJLENBQUNNLFFBQUwsQ0FBYyxPQUFkO0FBQ0EsTUFBSW9FLGFBQWEsR0FBRzVFLENBQUMsQ0FBQyxpQ0FBRCxDQUFyQjtBQUNBNEUsZUFBYSxDQUFDcEUsUUFBZCxDQUF1QixPQUF2QjtBQUNILENBVkQ7O0FBWWVpRSx3RUFBZixFOzs7Ozs7Ozs7Ozs7QUNaQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBRUFYLE1BQU0sQ0FBQ0MsZ0JBQVAsQ0FBd0Isa0JBQXhCLEVBQTRDLFlBQU07QUFDbERjLFVBQVEsQ0FBQ0MsY0FBVCxDQUF3QixjQUF4QixFQUF3Q2YsZ0JBQXhDLENBQXlELE9BQXpELEVBQWtFLFlBQU07QUFDcEVnQixTQUFLLENBQUNDLGNBQU47QUFDQVAsMERBQVM7QUFDVC9FLCtEQUFVLENBQUNtRixRQUFRLENBQUNDLGNBQVQsQ0FBd0IsUUFBeEIsRUFBa0NwQyxLQUFuQyxDQUFWO0FBQ0gsR0FKRDtBQUtDLENBTkQsRTs7Ozs7Ozs7Ozs7QUNIQSx1QyIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvZGlzdC9cIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXguanNcIik7XG4iLCJpbXBvcnQgZGF0YUludGVycHJldGF0aW9uIGZyb20gXCIuL2ludGVycHJldGF0aW9uXCI7XG5cbmNvbnN0IGQzRnVuY3Rpb24gPSBmdW5jdGlvbih0cmFjaykge1xuICAgIFxuICAgIGNvbnNvbGUubG9nKHRyYWNrKTtcbiAgbGV0IHRyYWNrSWQgPSBcIlwiO1xuICBjb25zdCBmZWF0dXJlcyA9IFtcImRhbmNlYWJpbGl0eVwiLCBcImVuZXJneVwiLCBcImtleVwiLCBcInZhbGVuY2VcIiwgXCJ0ZW1wb1wiXSBcbiAgICBcbiAgJC5nZXQoYC90cmFja3NlYXJjaC8ke3RyYWNrfWAsIChkYXRhKSA9PiB7XG4gICAgLy8gRGlzcGxheSB0aGUgYWxidW0gYXJ0IGFuZCBhcnRpc3QgaW5mb3JtYXRpb25cbiAgICBsZXQgaW1nID0gJCgnPGltZyBpZD1cImFsYnVtYXJ0XCIvPicpO1xuICAgIGltZy5hdHRyKCdzcmMnLCBkYXRhLmFsYnVtLmltYWdlc1swXS51cmwpO1xuICAgIGltZy5hcHBlbmRUbygnI3RyYWNrLWltYWdlJyk7XG4gICAgbGV0IGFydGlzdCA9ICQoYDxkaXYgaWQ9XCJhcnRpc3QtaW5mb1wiPlxuICAgICAgICA8ZGl2PkFydGlzdDogJHtkYXRhLmFydGlzdHNbMF0ubmFtZX08L2Rpdj5cbiAgICAgICAgPGRpdj5UcmFjazogJHtkYXRhLm5hbWV9PC9kaXY+XG4gICAgICAgIDwvZGl2PmApO1xuICAgIGFydGlzdC5hcHBlbmRUbygnI3RyYWNrLWltYWdlJyk7XG5cbiAgICAvL2dldHMgZ2VucmVzIGZyb20gYXJ0aXN0XG4gICAgJC5nZXQoYC9hbGJ1bS8ke2RhdGEuYXJ0aXN0c1swXS5pZH1gLCAoZGF0YSkgPT4ge1xuICAgICAgLy9jcmVhdGVzIGEgY2xvdWQgb2YgZ2VucmVzXG4gICAgICBsZXQgZDNDbG91ZCA9IGQzLnNlbGVjdCgnI2dlbnJlLWNsb3VkJykuc2VsZWN0QWxsKCdkaXYnKTtcbiAgICAgICAgZDNDbG91ZC5kYXRhKGRhdGEuYm9keS5nZW5yZXMpLmVudGVyKCkuYXBwZW5kKFwiZGl2XCIpXG4gICAgICAgIC50ZXh0KChkKSA9PiB7cmV0dXJuIGR9KTsgICAgXG4gICAgfSk7XG5cblxuICAgIFxuICAgIC8vIGdldHMgdHJhY2thbmFseXNpcyBmcm9tIHNlYXJjaGVkIHRyYWNrSWRcbiAgICB0cmFja0lkID0gZGF0YS5pZDtcbiAgICAkLmdldChgL3RyYWNrYW5hbHlzaXMvJHt0cmFja0lkfWAsIChkYXRhKSA9PiB7XG4gICAgICAgICAgbGV0IGQzRGF0YSA9IE9iamVjdC5lbnRyaWVzKGRhdGEuYm9keSlcbiAgICAgICAgICAgLmZpbHRlcihlbCA9PiBmZWF0dXJlcy5pbmNsdWRlcyhlbFswXSkpO1xuICAgICAgICAgIGxldCBkM0RhdGFJbnRlcnByZXRlZCA9IGRhdGFJbnRlcnByZXRhdGlvbihkM0RhdGEpO1xuXG4gICAgICAgIFxuICAgIC8vIEQzIGxvZ2ljIC0tIGdyYXRlZnVsIHRvIHlhbmdkYW5ueTk3LmdpdGh1Yi5pbyBmb3IgdGhlIHR1dG9yaWFsXG4gICAgICAgIGxldCByYWRpYWxTY2FsZSA9IGQzLnNjYWxlTGluZWFyKClcbiAgICAgICAgICAuZG9tYWluKFswLDEwXSlcbiAgICAgICAgICAucmFuZ2UoWzAsMjUwXSk7XG4gICAgICAgIGxldCB0aWNrcyA9IFsyLDQsNiw4LDEwXTtcblxuICAgICAgICBsZXQgc3ZnID0gZDMuc2VsZWN0KFwiI2RhdGEtY29udGFpbmVyXCIpLmFwcGVuZChcInN2Z1wiKVxuICAgICAgICAgIC5hdHRyKFwid2lkdGhcIiwgNzAwKVxuICAgICAgICAgIC5hdHRyKFwiaGVpZ2h0XCIsIDcwMCk7XG4gICAgICAgIFxuICAgICAgICAgIHRpY2tzLmZvckVhY2godCA9PlxuICAgICAgICAgICAgc3ZnLmFwcGVuZChcImNpcmNsZVwiKVxuICAgICAgICAgICAgLmF0dHIoXCJjeFwiLCAzMDApXG4gICAgICAgICAgICAuYXR0cihcImN5XCIsIDMwMClcbiAgICAgICAgICAgIC5hdHRyKFwiZmlsbFwiLCBcIm5vbmVcIilcbiAgICAgICAgICAgIC5hdHRyKFwic3Ryb2tlXCIsIFwiZ3JheVwiKVxuICAgICAgICAgICAgLmF0dHIoXCJyXCIsIHJhZGlhbFNjYWxlKHQpKVxuICAgICAgICApO1xuXG4gICAgICAgIHRpY2tzLmZvckVhY2godCA9PlxuICAgICAgICAgIHN2Zy5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgICAgICAgLmF0dHIoXCJ4XCIsIDMwNSlcbiAgICAgICAgICAuYXR0cihcInlcIiwgMzAwIC0gcmFkaWFsU2NhbGUodCkpXG4gICAgICAgICAgLnRleHQodC50b1N0cmluZygpKVxuICAgICAgKTtcblxuICAgICAgZnVuY3Rpb24gYW5nbGVUb0Nvb3JkaW5hdGUoYW5nbGUsIHZhbHVlKXtcbiAgICAgICAgbGV0IHggPSBNYXRoLmNvcyhhbmdsZSkgKiByYWRpYWxTY2FsZSh2YWx1ZSk7XG4gICAgICAgIGxldCB5ID0gTWF0aC5zaW4oYW5nbGUpICogcmFkaWFsU2NhbGUodmFsdWUpO1xuICAgICAgICByZXR1cm4ge1wieFwiOiAzMDAgKyB4LCBcInlcIjogMzAwIC0geX07XG4gICAgICB9O1xuXG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZlYXR1cmVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCBmdF9uYW1lID0gZmVhdHVyZXNbaV07XG4gICAgICAgIGxldCBhbmdsZSA9IChNYXRoLlBJIC8gMikgKyAoMiAqIE1hdGguUEkgKiBpIC8gZmVhdHVyZXMubGVuZ3RoKTtcbiAgICAgICAgbGV0IGxpbmVfY29vcmRpbmF0ZSA9IGFuZ2xlVG9Db29yZGluYXRlKGFuZ2xlLCAxMCk7XG4gICAgICAgIGxldCBsYWJlbF9jb29yZGluYXRlID0gYW5nbGVUb0Nvb3JkaW5hdGUoYW5nbGUsIDExLjU1KTtcbiAgICAgIFxuICAgICAgICBzdmcuYXBwZW5kKFwibGluZVwiKVxuICAgICAgICAgIC5hdHRyKFwieDFcIiwgMzAwKVxuICAgICAgICAgIC5hdHRyKFwieTFcIiwgMzAwKVxuICAgICAgICAgIC5hdHRyKFwieDJcIiwgbGluZV9jb29yZGluYXRlLngpXG4gICAgICAgICAgLmF0dHIoXCJ5MlwiLCBsaW5lX2Nvb3JkaW5hdGUueSlcbiAgICAgICAgICAuYXR0cihcInN0cm9rZVwiLFwiYmxhY2tcIik7XG4gICAgICAgIFxuICAgICAgICBzdmcuYXBwZW5kKFwidGV4dFwiKVxuICAgICAgICAgIC5hdHRyKFwieFwiLCBsYWJlbF9jb29yZGluYXRlLngpXG4gICAgICAgICAgLmF0dHIoXCJ5XCIsIGxhYmVsX2Nvb3JkaW5hdGUueSlcbiAgICAgICAgICAudGV4dChmdF9uYW1lKTtcbiAgICAgIH07XG5cbiAgICBsZXQgbGluZSA9IGQzLmxpbmUoKVxuICAgICAgLngoZCA9PiBkLngpXG4gICAgICAueShkID0+IGQueSk7XG5cbiAgICBmdW5jdGlvbiBnZXRQYXRoQ29vcmRpbmF0ZXMoZGF0YV9wb2ludCl7XG4gICAgICBsZXQgY29vcmRpbmF0ZXMgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmVhdHVyZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgIGxldCBhbmdsZSA9IChNYXRoLlBJIC8gMikgKyAoMiAqIE1hdGguUEkgKiBpIC8gZmVhdHVyZXMubGVuZ3RoKTtcbiAgICAgICAgICBjb29yZGluYXRlcy5wdXNoKGFuZ2xlVG9Db29yZGluYXRlKGFuZ2xlLCAoZGF0YV9wb2ludFtpXVszXSkpKTtcbiAgICAgIH07XG4gICAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG4gICAgfTtcblxuICAgXG4gICAgICBsZXQgY29sb3IgPSBcImRhcmtvcmFuZ2VcIjtcbiAgICAgIGxldCBjb29yZGluYXRlcyA9IGdldFBhdGhDb29yZGluYXRlcyhkM0RhdGFJbnRlcnByZXRlZCk7XG4gIFxuICAgICAgc3ZnLmFwcGVuZChcInBhdGhcIilcbiAgICAgIC5kYXR1bShjb29yZGluYXRlcylcbiAgICAgIC5hdHRyKFwiZFwiLGxpbmUpXG4gICAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLCAzKVxuICAgICAgLmF0dHIoXCJzdHJva2VcIiwgY29sb3IpXG4gICAgICAuYXR0cihcImZpbGxcIiwgY29sb3IpXG4gICAgICAuYXR0cihcInN0cm9rZS1vcGFjaXR5XCIsIDEpXG4gICAgICAuYXR0cihcIm9wYWNpdHlcIiwgMC41KTtcblxuICAgICAgLy8gZGlzcGxheXMgdGhlIGRhdGEgdGV4dCB3aXRoIFxuICAgICAgbGV0IGRpdlNlbGVjdGlvbiA9IGQzLnNlbGVjdCgnI2RhdGEtYmFycycpLnNlbGVjdEFsbCgnZGl2Jyk7XG5cbiAgICAgICAgICBkaXZTZWxlY3Rpb24uZGF0YShkM0RhdGFJbnRlcnByZXRlZCkuZW50ZXIoKS5hcHBlbmQoXCJkaXZcIilcbiAgICAgICAgICAudGV4dCgoZCkgPT4ge1xuICAgICAgICAgIHJldHVybiBkWzBdICsgXCI6IFwiICsgZFsyXTt9KVxuICAgICAgfSk7XG4gIH0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IGQzRnVuY3Rpb24iLCJpbXBvcnQgXCIuL3N0eWxlcy9pbmRleC5zY3NzXCI7XG5pbXBvcnQgXCIuL3NlYXJjaFwiO1xuaW1wb3J0IGQzRnVuY3Rpb24gZnJvbSBcIi4vZDNGdW5jdGlvblwiO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xuIGQzRnVuY3Rpb24oKTtcbn0pO1xuXG4iLCIvL3RoZXNlIGZ1bmN0aW9ucyBpbnRlcnByZXQgYW5kIG5vcm1hbGl6ZSB0aGUgZGF0YSBcblxuY29uc3QgZGF0YUludGVycHJldGF0aW9uID0gKGRhdGEpID0+IHtcbiAgXG4gICAgbGV0IHJlc3VsdCA9IGRhdGEubWFwKChlbCkgPT4ge1xuICAgICAgaWYgKGVsWzBdID09IFwiYWNvdXN0aWNuZXNzXCIpIHtcbiAgICAgIGVsLnB1c2goYWNvdXN0aWNuZXNzKGVsWzFdKSk7XG4gICAgICBlbC5wdXNoKGVsWzFdICogMTApO1xuICAgICAgcmV0dXJuIGVsO1xuICAgICAgfSBlbHNlIGlmIChlbFswXSA9PSBcImRhbmNlYWJpbGl0eVwiKSB7XG4gICAgICAgIGVsLnB1c2goZGFuY2VhYmlsaXR5KGVsWzFdKSk7XG4gICAgICAgIGVsLnB1c2goZWxbMV0gKiAxMCk7XG4gICAgICAgIHJldHVybiBlbDtcbiAgICAgIH0gZWxzZSBpZiAoZWxbMF0gPT0gXCJlbmVyZ3lcIikge1xuICAgICAgICBlbC5wdXNoKGVuZXJneShlbFsxXSkpO1xuICAgICAgICBlbC5wdXNoKGVsWzFdICogMTApO1xuICAgICAgICByZXR1cm4gZWw7XG4gICAgICB9IGVsc2UgaWYgKGVsWzBdID09IFwiaW5zdHJ1bWVudGFsbmVzc1wiKSB7XG4gICAgICAgIGVsLnB1c2goaW5zdHJ1bWVudGFsbmVzcyhlbFsxXSkpO1xuICAgICAgICBlbC5wdXNoKGVsWzFdICogMTApO1xuICAgICAgICByZXR1cm4gZWw7XG4gICAgICB9IGVsc2UgaWYgKGVsWzBdID09IFwia2V5XCIpIHtcbiAgICAgICAgZWwucHVzaChrZXkoZWxbMV0pKTtcbiAgICAgICAgZWwucHVzaChlbFsxXSk7XG4gICAgICAgIHJldHVybiBlbDtcbiAgICAgIH0gZWxzZSBpZiAoZWxbMF0gPT0gXCJ0ZW1wb1wiKSB7XG4gICAgICAgIGVsLnB1c2goTWF0aC5mbG9vcihlbFsxXSkpO1xuICAgICAgICBlbC5wdXNoKChlbFsxXS01MCkvMTUpO1xuICAgICAgICByZXR1cm4gZWw7XG4gICAgICB9IGVsc2UgaWYgKGVsWzBdID09IFwidmFsZW5jZVwiKSB7XG4gICAgICAgIGVsLnB1c2godmFsZW5jZShlbFsxXSkpO1xuICAgICAgICBlbC5wdXNoKGVsWzFdICogMTApO1xuICAgICAgICByZXR1cm4gZWw7XG4gICAgICB9O1xuICAgICAgXG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBcbiAgY29uc3QgYWNvdXN0aWNuZXNzID0gKGRhdHVtKSA9PiB7XG4gICAgaWYgKGRhdHVtIDwgMC4yKSB7XG4gICAgICByZXR1cm4gXCJBY291c3RpY1wiXG4gICAgfSBlbHNlIGlmIChkYXR1bSA8IDAuNCApIHtcbiAgICAgIHJldHVybiBcIk1vc3RseSBhY291c3RpY1wiXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIk5vdCBhY291c3RpY1wiXG4gICAgfVxuICB9O1xuICBcbiAgY29uc3QgZGFuY2VhYmlsaXR5ID0gKGRhdHVtKSA9PiB7XG4gICAgaWYgKGRhdHVtIDwgMC4yKSB7XG4gICAgICByZXR1cm4gXCJOb3QgZGFuY2VhYmxlXCJcbiAgICB9IGVsc2UgaWYgKGRhdHVtIDwgMC40KSB7XG4gICAgICByZXR1cm4gXCJTbG93IERhbmNlXCJcbiAgICB9IGVsc2UgaWYgKGRhdHVtIDwgMC42KSB7XG4gICAgICByZXR1cm4gXCJHb3QgYSBiZWF0XCJcbiAgICB9IGVsc2UgaWYgKGRhdHVtIDwgMC44KSB7XG4gICAgICByZXR1cm4gXCJVcGJlYXRcIlxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJCYW5nZXJcIlxuICAgIH07XG4gIH07XG4gIFxuICBjb25zdCBlbmVyZ3kgPSAoZGF0dW0pID0+IHtcbiAgICBpZiAoZGF0dW0gPCAwLjIpIHtcbiAgICAgIHJldHVybiBcIlJlbGF4aW5nXCJcbiAgICB9IGVsc2UgaWYgKGRhdHVtIDwgMC40KSB7XG4gICAgICByZXR1cm4gXCJMb3cgZW5lcmd5XCJcbiAgICB9IGVsc2UgaWYgKGRhdHVtIDwgMC42KSB7XG4gICAgICByZXR1cm4gXCJBbmRhbnRlXCIgXG4gICAgfSBlbHNlIGlmIChkYXR1bSA8IDAuOCkge1xuICAgICAgcmV0dXJuIFwiSGlnaCBlbmVyZ3lcIlxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJJdCBzbGFwc1wiXG4gICAgfTtcbiAgfTtcbiAgXG4gIGNvbnN0IGluc3RydW1lbnRhbG5lc3MgPSAoZGF0dW0pID0+IHtcbiAgICBpZiAoZGF0dW0gPCAwLjkpIHtcbiAgICAgIHJldHVybiBcIk5vdCBpbnN0cnVtZW50YWxcIlxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJJbnN0cnVtZW50YWxcIlxuICAgIH07XG4gIH07XG4gIFxuICBjb25zdCBrZXkgPSAoZGF0dW0pID0+IHtcbiAgICBpZiAoZGF0dW0gPT0gMCkge1xuICAgICAgcmV0dXJuIFwiS2V5IG9mIENcIlxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPT0gMSkge1xuICAgICAgcmV0dXJuIFwiS2V5IG9mIEPima8sIETima1cIlxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPT0gMikge1xuICAgICAgcmV0dXJuIFwiS2V5IG9mIERcIlxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPT0gMykge1xuICAgICAgcmV0dXJuIFwiS2V5IG9mIETima8sIEXima1cIlxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPT0gNCkge1xuICAgICAgcmV0dXJuIFwiS2V5IG9mIEVcIlxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPT0gNSkge1xuICAgICAgcmV0dXJuIFwiS2V5IG9mIEZcIlxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPT0gNikge1xuICAgICAgcmV0dXJuIFwiS2V5IG9mIEbima8sIEfima1cIlxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPT0gNykge1xuICAgICAgcmV0dXJuIFwiS2V5IG9mIEdcIiBcbiAgICB9IGVsc2UgaWYgKGRhdHVtID09IDgpIHtcbiAgICAgIHJldHVybiBcIktleSBvZiBH4pmvLCBB4pmtXCIgXG4gICAgfSBlbHNlIGlmIChkYXR1bSA9PSA5KSB7XG4gICAgICByZXR1cm4gXCJLZXkgb2YgQVwiIFxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPT0gMTApIHtcbiAgICAgIHJldHVybiBcIktleSBvZiBB4pmvLCBC4pmtXCIgXG4gICAgfSBlbHNlIGlmIChkYXR1bSA9PSAxMSkge1xuICAgICAgcmV0dXJuIFwiS2V5IG9mIEJcIiBcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiTm8ga2V5XCIgXG4gICAgfTtcbiAgfTtcbiAgXG4gIGNvbnN0IHZhbGVuY2UgPSAoZGF0dW0pID0+IHtcbiAgICBpZiAoZGF0dW0gPCAwLjIpIHtcbiAgICAgIHJldHVybiBcIkJsZWFrXCJcbiAgICB9IGVsc2UgaWYgKGRhdHVtIDwgMC40KSB7XG4gICAgICByZXR1cm4gXCJNZWxhbmNob2xpY1wiXG4gICAgfSBlbHNlIGlmIChkYXR1bSA8IDAuNikge1xuICAgICAgcmV0dXJuIFwiU2VyZW5lXCIgXG4gICAgfSBlbHNlIGlmIChkYXR1bSA8IDAuOCkge1xuICAgICAgcmV0dXJuIFwiSGFwcHlcIlxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJFdXBob3JpY1wiXG4gICAgfTt9O1xuXG4gICAgZXhwb3J0IGRlZmF1bHQgZGF0YUludGVycHJldGF0aW9uOyIsImNvbnN0IGRhdGFSZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICBkMy5zZWxlY3QoXCIjbWFpblwiKS5zZWxlY3RBbGwoXCIqXCIpLnJlbW92ZSgpO1xuICAgIGxldCBpbWcgPSAkKCc8ZGl2IGlkPVwidHJhY2staW1hZ2VcIj48L2Rpdj4nKTtcbiAgICBpbWcuYXBwZW5kVG8oXCIjbWFpblwiKTtcbiAgICBsZXQgZ2VucmUgPSAkKCc8ZGl2IGlkPVwiZ2VucmUtY2xvdWRcIj48L2Rpdj4nKTtcbiAgICBnZW5yZS5hcHBlbmRUbyhcIiNtYWluXCIpO1xuICAgIGxldCBkYXRhID0gJCgnPGRpdiBpZD1cImRhdGEtYmFyc1wiPjwvZGl2PicpO1xuICAgIGRhdGEuYXBwZW5kVG8oXCIjbWFpblwiKVxuICAgIGxldCBkYXRhQ29udGFpbmVyID0gJCgnPGRpdiBpZD1cImRhdGEtY29udGFpbmVyXCI+PC9kaXY+Jyk7XG4gICAgZGF0YUNvbnRhaW5lci5hcHBlbmRUbyhcIiNtYWluXCIpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGRhdGFSZXNldCIsImltcG9ydCBkM0Z1bmN0aW9uIGZyb20gJy4vZDNGdW5jdGlvbic7XG5pbXBvcnQgZGF0YVJlc2V0IGZyb20gJy4vcmVzZXQnO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFyY2hidXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZGF0YVJlc2V0KCk7XG4gICAgZDNGdW5jdGlvbihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXJjaFwiKS52YWx1ZSk7XG59KTtcbn0pOyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiJdLCJzb3VyY2VSb290IjoiIn0=