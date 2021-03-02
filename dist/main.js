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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2QzRnVuY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9pbnRlcnByZXRhdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVzZXQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlYXJjaC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGVzL2luZGV4LnNjc3MiXSwibmFtZXMiOlsiZDNGdW5jdGlvbiIsInRyYWNrIiwidHJhY2tJZCIsImZlYXR1cmVzIiwiJCIsImdldCIsImRhdGEiLCJpbWciLCJhdHRyIiwiYWxidW0iLCJpbWFnZXMiLCJ1cmwiLCJhcHBlbmRUbyIsImFydGlzdCIsImFydGlzdHMiLCJuYW1lIiwiaWQiLCJkM0Nsb3VkIiwiZDMiLCJzZWxlY3QiLCJzZWxlY3RBbGwiLCJib2R5IiwiZ2VucmVzIiwiZW50ZXIiLCJhcHBlbmQiLCJ0ZXh0IiwiZCIsImQzRGF0YSIsIk9iamVjdCIsImVudHJpZXMiLCJmaWx0ZXIiLCJlbCIsImluY2x1ZGVzIiwiZDNEYXRhSW50ZXJwcmV0ZWQiLCJkYXRhSW50ZXJwcmV0YXRpb24iLCJyYWRpYWxTY2FsZSIsInNjYWxlTGluZWFyIiwiZG9tYWluIiwicmFuZ2UiLCJ0aWNrcyIsInN2ZyIsImZvckVhY2giLCJ0IiwidG9TdHJpbmciLCJhbmdsZVRvQ29vcmRpbmF0ZSIsImFuZ2xlIiwidmFsdWUiLCJ4IiwiTWF0aCIsImNvcyIsInkiLCJzaW4iLCJpIiwibGVuZ3RoIiwiZnRfbmFtZSIsIlBJIiwibGluZV9jb29yZGluYXRlIiwibGFiZWxfY29vcmRpbmF0ZSIsImxpbmUiLCJnZXRQYXRoQ29vcmRpbmF0ZXMiLCJkYXRhX3BvaW50IiwiY29vcmRpbmF0ZXMiLCJwdXNoIiwiY29sb3IiLCJkYXR1bSIsImRpdlNlbGVjdGlvbiIsIndpbmRvdyIsImFkZEV2ZW50TGlzdGVuZXIiLCJyZXN1bHQiLCJtYXAiLCJhY291c3RpY25lc3MiLCJkYW5jZWFiaWxpdHkiLCJlbmVyZ3kiLCJpbnN0cnVtZW50YWxuZXNzIiwia2V5IiwiZmxvb3IiLCJ2YWxlbmNlIiwiZGF0YVJlc2V0IiwicmVtb3ZlIiwiZ2VucmUiLCJkYXRhQ29udGFpbmVyIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImV2ZW50IiwicHJldmVudERlZmF1bHQiXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFBOztBQUVBLElBQU1BLFVBQVUsR0FBRyxTQUFiQSxVQUFhLENBQVNDLEtBQVQsRUFBZ0I7QUFDakMsTUFBSUMsT0FBTyxHQUFHLEVBQWQ7QUFDQSxNQUFNQyxRQUFRLEdBQUcsQ0FBQyxjQUFELEVBQWlCLFFBQWpCLEVBQTJCLEtBQTNCLEVBQWtDLFNBQWxDLEVBQTZDLE9BQTdDLENBQWpCO0FBRUFDLEdBQUMsQ0FBQ0MsR0FBRix3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QUFDLDhCQUFELENBQWI7QUFDQTJFLE9BQUssQ0FBQ25FLFFBQU4sQ0FBZSxPQUFmO0FBQ0EsTUFBSU4sSUFBSSxHQUFHRixDQUFDLENBQUMsNEJBQUQsQ0FBWjtBQUNBRSxNQUFJLENBQUNNLFFBQUwsQ0FBYyxPQUFkO0FBQ0EsTUFBSW9FLGFBQWEsR0FBRzVFLENBQUMsQ0FBQyxpQ0FBRCxDQUFyQjtBQUNBNEUsZUFBYSxDQUFDcEUsUUFBZCxDQUF1QixPQUF2QjtBQUNILENBVkQ7O0FBWWVpRSx3RUFBZixFOzs7Ozs7Ozs7Ozs7QUNaQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBRUFYLE1BQU0sQ0FBQ0MsZ0JBQVAsQ0FBd0Isa0JBQXhCLEVBQTRDLFlBQU07QUFDbERjLFVBQVEsQ0FBQ0MsY0FBVCxDQUF3QixjQUF4QixFQUF3Q2YsZ0JBQXhDLENBQXlELE9BQXpELEVBQWtFLFlBQU07QUFDcEVnQixTQUFLLENBQUNDLGNBQU47QUFDQVAsMERBQVM7QUFDVDdFLCtEQUFVLENBQUNpRixRQUFRLENBQUNDLGNBQVQsQ0FBd0IsUUFBeEIsRUFBa0NwQyxLQUFuQyxDQUFWO0FBQ0gsR0FKRDtBQUtDLENBTkQsRTs7Ozs7Ozs7Ozs7QUNIQSx1QyIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiIFx0Ly8gVGhlIG1vZHVsZSBjYWNoZVxuIFx0dmFyIGluc3RhbGxlZE1vZHVsZXMgPSB7fTtcblxuIFx0Ly8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbiBcdGZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblxuIFx0XHQvLyBDaGVjayBpZiBtb2R1bGUgaXMgaW4gY2FjaGVcbiBcdFx0aWYoaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0pIHtcbiBcdFx0XHRyZXR1cm4gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0uZXhwb3J0cztcbiBcdFx0fVxuIFx0XHQvLyBDcmVhdGUgYSBuZXcgbW9kdWxlIChhbmQgcHV0IGl0IGludG8gdGhlIGNhY2hlKVxuIFx0XHR2YXIgbW9kdWxlID0gaW5zdGFsbGVkTW9kdWxlc1ttb2R1bGVJZF0gPSB7XG4gXHRcdFx0aTogbW9kdWxlSWQsXG4gXHRcdFx0bDogZmFsc2UsXG4gXHRcdFx0ZXhwb3J0czoge31cbiBcdFx0fTtcblxuIFx0XHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cbiBcdFx0bW9kdWxlc1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cbiBcdFx0Ly8gRmxhZyB0aGUgbW9kdWxlIGFzIGxvYWRlZFxuIFx0XHRtb2R1bGUubCA9IHRydWU7XG5cbiBcdFx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcbiBcdFx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xuIFx0fVxuXG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlcyBvYmplY3QgKF9fd2VicGFja19tb2R1bGVzX18pXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm0gPSBtb2R1bGVzO1xuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZSBjYWNoZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5jID0gaW5zdGFsbGVkTW9kdWxlcztcblxuIFx0Ly8gZGVmaW5lIGdldHRlciBmdW5jdGlvbiBmb3IgaGFybW9ueSBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQgPSBmdW5jdGlvbihleHBvcnRzLCBuYW1lLCBnZXR0ZXIpIHtcbiBcdFx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhleHBvcnRzLCBuYW1lKSkge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBuYW1lLCB7IGVudW1lcmFibGU6IHRydWUsIGdldDogZ2V0dGVyIH0pO1xuIFx0XHR9XG4gXHR9O1xuXG4gXHQvLyBkZWZpbmUgX19lc01vZHVsZSBvbiBleHBvcnRzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIgPSBmdW5jdGlvbihleHBvcnRzKSB7XG4gXHRcdGlmKHR5cGVvZiBTeW1ib2wgIT09ICd1bmRlZmluZWQnICYmIFN5bWJvbC50b1N0cmluZ1RhZykge1xuIFx0XHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBTeW1ib2wudG9TdHJpbmdUYWcsIHsgdmFsdWU6ICdNb2R1bGUnIH0pO1xuIFx0XHR9XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCAnX19lc01vZHVsZScsIHsgdmFsdWU6IHRydWUgfSk7XG4gXHR9O1xuXG4gXHQvLyBjcmVhdGUgYSBmYWtlIG5hbWVzcGFjZSBvYmplY3RcbiBcdC8vIG1vZGUgJiAxOiB2YWx1ZSBpcyBhIG1vZHVsZSBpZCwgcmVxdWlyZSBpdFxuIFx0Ly8gbW9kZSAmIDI6IG1lcmdlIGFsbCBwcm9wZXJ0aWVzIG9mIHZhbHVlIGludG8gdGhlIG5zXG4gXHQvLyBtb2RlICYgNDogcmV0dXJuIHZhbHVlIHdoZW4gYWxyZWFkeSBucyBvYmplY3RcbiBcdC8vIG1vZGUgJiA4fDE6IGJlaGF2ZSBsaWtlIHJlcXVpcmVcbiBcdF9fd2VicGFja19yZXF1aXJlX18udCA9IGZ1bmN0aW9uKHZhbHVlLCBtb2RlKSB7XG4gXHRcdGlmKG1vZGUgJiAxKSB2YWx1ZSA9IF9fd2VicGFja19yZXF1aXJlX18odmFsdWUpO1xuIFx0XHRpZihtb2RlICYgOCkgcmV0dXJuIHZhbHVlO1xuIFx0XHRpZigobW9kZSAmIDQpICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcgJiYgdmFsdWUgJiYgdmFsdWUuX19lc01vZHVsZSkgcmV0dXJuIHZhbHVlO1xuIFx0XHR2YXIgbnMgPSBPYmplY3QuY3JlYXRlKG51bGwpO1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLnIobnMpO1xuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkobnMsICdkZWZhdWx0JywgeyBlbnVtZXJhYmxlOiB0cnVlLCB2YWx1ZTogdmFsdWUgfSk7XG4gXHRcdGlmKG1vZGUgJiAyICYmIHR5cGVvZiB2YWx1ZSAhPSAnc3RyaW5nJykgZm9yKHZhciBrZXkgaW4gdmFsdWUpIF9fd2VicGFja19yZXF1aXJlX18uZChucywga2V5LCBmdW5jdGlvbihrZXkpIHsgcmV0dXJuIHZhbHVlW2tleV07IH0uYmluZChudWxsLCBrZXkpKTtcbiBcdFx0cmV0dXJuIG5zO1xuIFx0fTtcblxuIFx0Ly8gZ2V0RGVmYXVsdEV4cG9ydCBmdW5jdGlvbiBmb3IgY29tcGF0aWJpbGl0eSB3aXRoIG5vbi1oYXJtb255IG1vZHVsZXNcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubiA9IGZ1bmN0aW9uKG1vZHVsZSkge1xuIFx0XHR2YXIgZ2V0dGVyID0gbW9kdWxlICYmIG1vZHVsZS5fX2VzTW9kdWxlID9cbiBcdFx0XHRmdW5jdGlvbiBnZXREZWZhdWx0KCkgeyByZXR1cm4gbW9kdWxlWydkZWZhdWx0J107IH0gOlxuIFx0XHRcdGZ1bmN0aW9uIGdldE1vZHVsZUV4cG9ydHMoKSB7IHJldHVybiBtb2R1bGU7IH07XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18uZChnZXR0ZXIsICdhJywgZ2V0dGVyKTtcbiBcdFx0cmV0dXJuIGdldHRlcjtcbiBcdH07XG5cbiBcdC8vIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbFxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5vID0gZnVuY3Rpb24ob2JqZWN0LCBwcm9wZXJ0eSkgeyByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iamVjdCwgcHJvcGVydHkpOyB9O1xuXG4gXHQvLyBfX3dlYnBhY2tfcHVibGljX3BhdGhfX1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5wID0gXCIvZGlzdC9cIjtcblxuXG4gXHQvLyBMb2FkIGVudHJ5IG1vZHVsZSBhbmQgcmV0dXJuIGV4cG9ydHNcbiBcdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKF9fd2VicGFja19yZXF1aXJlX18ucyA9IFwiLi9zcmMvaW5kZXguanNcIik7XG4iLCJpbXBvcnQgZGF0YUludGVycHJldGF0aW9uIGZyb20gXCIuL2ludGVycHJldGF0aW9uXCI7XG5cbmNvbnN0IGQzRnVuY3Rpb24gPSBmdW5jdGlvbih0cmFjaykge1xuICBsZXQgdHJhY2tJZCA9IFwiXCI7XG4gIGNvbnN0IGZlYXR1cmVzID0gW1wiZGFuY2VhYmlsaXR5XCIsIFwiZW5lcmd5XCIsIFwia2V5XCIsIFwidmFsZW5jZVwiLCBcInRlbXBvXCJdIFxuICAgIFxuICAkLmdldChgL3RyYWNrc2VhcmNoLyR7dHJhY2t9YCwgKGRhdGEpID0+IHtcbiAgICAvLyBEaXNwbGF5IHRoZSBhbGJ1bSBhcnQgYW5kIGFydGlzdCBpbmZvcm1hdGlvblxuICAgIGxldCBpbWcgPSAkKCc8aW1nIGlkPVwiYWxidW1hcnRcIi8+Jyk7XG4gICAgaW1nLmF0dHIoJ3NyYycsIGRhdGEuYWxidW0uaW1hZ2VzWzBdLnVybCk7XG4gICAgaW1nLmFwcGVuZFRvKCcjdHJhY2staW1hZ2UnKTtcbiAgICBsZXQgYXJ0aXN0ID0gJChgPGRpdiBpZD1cImFydGlzdC1pbmZvXCI+XG4gICAgICAgIDxkaXY+QXJ0aXN0OiAke2RhdGEuYXJ0aXN0c1swXS5uYW1lfTwvZGl2PlxuICAgICAgICA8ZGl2PlRyYWNrOiAke2RhdGEubmFtZX08L2Rpdj5cbiAgICAgICAgPC9kaXY+YCk7XG4gICAgYXJ0aXN0LmFwcGVuZFRvKCcjdHJhY2staW1hZ2UnKTtcblxuICAgIC8vZ2V0cyBnZW5yZXMgZnJvbSBhcnRpc3RcbiAgICAkLmdldChgL2FsYnVtLyR7ZGF0YS5hcnRpc3RzWzBdLmlkfWAsIChkYXRhKSA9PiB7XG4gICAgICAvL2NyZWF0ZXMgYSBjbG91ZCBvZiBnZW5yZXNcbiAgICAgIGxldCBkM0Nsb3VkID0gZDMuc2VsZWN0KCcjZ2VucmUtY2xvdWQnKS5zZWxlY3RBbGwoJ2RpdicpO1xuICAgICAgICBkM0Nsb3VkLmRhdGEoZGF0YS5ib2R5LmdlbnJlcykuZW50ZXIoKS5hcHBlbmQoXCJkaXZcIilcbiAgICAgICAgLnRleHQoKGQpID0+IHtyZXR1cm4gZH0pOyAgICBcbiAgICB9KTtcblxuXG4gICAgXG4gICAgLy8gZ2V0cyB0cmFja2FuYWx5c2lzIGZyb20gc2VhcmNoZWQgdHJhY2tJZFxuICAgIHRyYWNrSWQgPSBkYXRhLmlkO1xuICAgICQuZ2V0KGAvdHJhY2thbmFseXNpcy8ke3RyYWNrSWR9YCwgKGRhdGEpID0+IHtcbiAgICAgICAgICBsZXQgZDNEYXRhID0gT2JqZWN0LmVudHJpZXMoZGF0YS5ib2R5KVxuICAgICAgICAgICAuZmlsdGVyKGVsID0+IGZlYXR1cmVzLmluY2x1ZGVzKGVsWzBdKSk7XG4gICAgICAgICAgbGV0IGQzRGF0YUludGVycHJldGVkID0gZGF0YUludGVycHJldGF0aW9uKGQzRGF0YSk7XG5cbiAgICAgICAgXG4gICAgLy8gRDMgbG9naWMgLS0gZ3JhdGVmdWwgdG8geWFuZ2Rhbm55OTcuZ2l0aHViLmlvIGZvciB0aGUgdHV0b3JpYWxcbiAgICAgICAgbGV0IHJhZGlhbFNjYWxlID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgICAgIC5kb21haW4oWzAsMTBdKVxuICAgICAgICAgIC5yYW5nZShbMCwyNTBdKTtcbiAgICAgICAgbGV0IHRpY2tzID0gWzIsNCw2LDgsMTBdO1xuXG4gICAgICAgIGxldCBzdmcgPSBkMy5zZWxlY3QoXCIjZGF0YS1jb250YWluZXJcIikuYXBwZW5kKFwic3ZnXCIpXG4gICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCA3MDApXG4gICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgNzAwKTtcbiAgICAgICAgXG4gICAgICAgICAgdGlja3MuZm9yRWFjaCh0ID0+XG4gICAgICAgICAgICBzdmcuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAuYXR0cihcImN4XCIsIDMwMClcbiAgICAgICAgICAgIC5hdHRyKFwiY3lcIiwgMzAwKVxuICAgICAgICAgICAgLmF0dHIoXCJmaWxsXCIsIFwibm9uZVwiKVxuICAgICAgICAgICAgLmF0dHIoXCJzdHJva2VcIiwgXCJncmF5XCIpXG4gICAgICAgICAgICAuYXR0cihcInJcIiwgcmFkaWFsU2NhbGUodCkpXG4gICAgICAgICk7XG5cbiAgICAgICAgdGlja3MuZm9yRWFjaCh0ID0+XG4gICAgICAgICAgc3ZnLmFwcGVuZChcInRleHRcIilcbiAgICAgICAgICAuYXR0cihcInhcIiwgMzA1KVxuICAgICAgICAgIC5hdHRyKFwieVwiLCAzMDAgLSByYWRpYWxTY2FsZSh0KSlcbiAgICAgICAgICAudGV4dCh0LnRvU3RyaW5nKCkpXG4gICAgICApO1xuXG4gICAgICBmdW5jdGlvbiBhbmdsZVRvQ29vcmRpbmF0ZShhbmdsZSwgdmFsdWUpe1xuICAgICAgICBsZXQgeCA9IE1hdGguY29zKGFuZ2xlKSAqIHJhZGlhbFNjYWxlKHZhbHVlKTtcbiAgICAgICAgbGV0IHkgPSBNYXRoLnNpbihhbmdsZSkgKiByYWRpYWxTY2FsZSh2YWx1ZSk7XG4gICAgICAgIHJldHVybiB7XCJ4XCI6IDMwMCArIHgsIFwieVwiOiAzMDAgLSB5fTtcbiAgICAgIH07XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmVhdHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IGZ0X25hbWUgPSBmZWF0dXJlc1tpXTtcbiAgICAgICAgbGV0IGFuZ2xlID0gKE1hdGguUEkgLyAyKSArICgyICogTWF0aC5QSSAqIGkgLyBmZWF0dXJlcy5sZW5ndGgpO1xuICAgICAgICBsZXQgbGluZV9jb29yZGluYXRlID0gYW5nbGVUb0Nvb3JkaW5hdGUoYW5nbGUsIDEwKTtcbiAgICAgICAgbGV0IGxhYmVsX2Nvb3JkaW5hdGUgPSBhbmdsZVRvQ29vcmRpbmF0ZShhbmdsZSwgMTEuNTUpO1xuICAgICAgXG4gICAgICAgIHN2Zy5hcHBlbmQoXCJsaW5lXCIpXG4gICAgICAgICAgLmF0dHIoXCJ4MVwiLCAzMDApXG4gICAgICAgICAgLmF0dHIoXCJ5MVwiLCAzMDApXG4gICAgICAgICAgLmF0dHIoXCJ4MlwiLCBsaW5lX2Nvb3JkaW5hdGUueClcbiAgICAgICAgICAuYXR0cihcInkyXCIsIGxpbmVfY29vcmRpbmF0ZS55KVxuICAgICAgICAgIC5hdHRyKFwic3Ryb2tlXCIsXCJibGFja1wiKTtcbiAgICAgICAgXG4gICAgICB9O1xuXG4gICAgbGV0IGxpbmUgPSBkMy5saW5lKClcbiAgICAgIC54KGQgPT4gZC54KVxuICAgICAgLnkoZCA9PiBkLnkpO1xuXG4gICAgZnVuY3Rpb24gZ2V0UGF0aENvb3JkaW5hdGVzKGRhdGFfcG9pbnQpe1xuICAgICAgbGV0IGNvb3JkaW5hdGVzID0gW107XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGZlYXR1cmVzLmxlbmd0aDsgaSsrKXtcbiAgICAgICAgICBsZXQgYW5nbGUgPSAoTWF0aC5QSSAvIDIpICsgKDIgKiBNYXRoLlBJICogaSAvIGZlYXR1cmVzLmxlbmd0aCk7XG4gICAgICAgICAgY29vcmRpbmF0ZXMucHVzaChhbmdsZVRvQ29vcmRpbmF0ZShhbmdsZSwgKGRhdGFfcG9pbnRbaV1bM10pKSk7XG4gICAgICB9O1xuICAgICAgcmV0dXJuIGNvb3JkaW5hdGVzO1xuICAgIH07XG5cbiAgIFxuICAgICAgbGV0IGNvbG9yID0gXCJkYXJrb3JhbmdlXCI7XG4gICAgICBsZXQgY29vcmRpbmF0ZXMgPSBnZXRQYXRoQ29vcmRpbmF0ZXMoZDNEYXRhSW50ZXJwcmV0ZWQpO1xuICBcbiAgICAgIHN2Zy5hcHBlbmQoXCJwYXRoXCIpXG4gICAgICAuZGF0dW0oY29vcmRpbmF0ZXMpXG4gICAgICAuYXR0cihcImRcIixsaW5lKVxuICAgICAgLmF0dHIoXCJzdHJva2Utd2lkdGhcIiwgMylcbiAgICAgIC5hdHRyKFwic3Ryb2tlXCIsIGNvbG9yKVxuICAgICAgLmF0dHIoXCJmaWxsXCIsIGNvbG9yKVxuICAgICAgLmF0dHIoXCJzdHJva2Utb3BhY2l0eVwiLCAxKVxuICAgICAgLmF0dHIoXCJvcGFjaXR5XCIsIDAuNSk7XG5cbiAgICAgIC8vIGRpc3BsYXlzIHRoZSBkYXRhIHRleHQgd2l0aCBcbiAgICAgIGxldCBkaXZTZWxlY3Rpb24gPSBkMy5zZWxlY3QoJyNkYXRhLWJhcnMnKS5zZWxlY3RBbGwoJ2RpdicpO1xuXG4gICAgICAgICAgZGl2U2VsZWN0aW9uLmRhdGEoZDNEYXRhSW50ZXJwcmV0ZWQpLmVudGVyKCkuYXBwZW5kKFwiZGl2XCIpXG4gICAgICAgICAgLnRleHQoKGQpID0+IHtcbiAgICAgICAgICByZXR1cm4gZFswXSArIFwiOiBcIiArIGRbMl07fSlcbiAgICAgIH0pO1xuICB9KVxufVxuXG5leHBvcnQgZGVmYXVsdCBkM0Z1bmN0aW9uIiwiaW1wb3J0IFwiLi9zdHlsZXMvaW5kZXguc2Nzc1wiO1xuaW1wb3J0IFwiLi9zZWFyY2hcIjtcbmltcG9ydCBkM0Z1bmN0aW9uIGZyb20gXCIuL2QzRnVuY3Rpb25cIjtcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHtcbiBkM0Z1bmN0aW9uKCk7XG59KTtcblxuIiwiLy90aGVzZSBmdW5jdGlvbnMgaW50ZXJwcmV0IGFuZCBub3JtYWxpemUgdGhlIGRhdGEgXG5cbmNvbnN0IGRhdGFJbnRlcnByZXRhdGlvbiA9IChkYXRhKSA9PiB7XG4gIFxuICAgIGxldCByZXN1bHQgPSBkYXRhLm1hcCgoZWwpID0+IHtcbiAgICAgIGlmIChlbFswXSA9PSBcImFjb3VzdGljbmVzc1wiKSB7XG4gICAgICBlbC5wdXNoKGFjb3VzdGljbmVzcyhlbFsxXSkpO1xuICAgICAgZWwucHVzaChlbFsxXSAqIDEwKTtcbiAgICAgIHJldHVybiBlbDtcbiAgICAgIH0gZWxzZSBpZiAoZWxbMF0gPT0gXCJkYW5jZWFiaWxpdHlcIikge1xuICAgICAgICBlbC5wdXNoKGRhbmNlYWJpbGl0eShlbFsxXSkpO1xuICAgICAgICBlbC5wdXNoKGVsWzFdICogMTApO1xuICAgICAgICByZXR1cm4gZWw7XG4gICAgICB9IGVsc2UgaWYgKGVsWzBdID09IFwiZW5lcmd5XCIpIHtcbiAgICAgICAgZWwucHVzaChlbmVyZ3koZWxbMV0pKTtcbiAgICAgICAgZWwucHVzaChlbFsxXSAqIDEwKTtcbiAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgfSBlbHNlIGlmIChlbFswXSA9PSBcImluc3RydW1lbnRhbG5lc3NcIikge1xuICAgICAgICBlbC5wdXNoKGluc3RydW1lbnRhbG5lc3MoZWxbMV0pKTtcbiAgICAgICAgZWwucHVzaChlbFsxXSAqIDEwKTtcbiAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgfSBlbHNlIGlmIChlbFswXSA9PSBcImtleVwiKSB7XG4gICAgICAgIGVsLnB1c2goa2V5KGVsWzFdKSk7XG4gICAgICAgIGVsLnB1c2goZWxbMV0pO1xuICAgICAgICByZXR1cm4gZWw7XG4gICAgICB9IGVsc2UgaWYgKGVsWzBdID09IFwidGVtcG9cIikge1xuICAgICAgICBlbC5wdXNoKE1hdGguZmxvb3IoZWxbMV0pKTtcbiAgICAgICAgZWwucHVzaCgoZWxbMV0tNTApLzE1KTtcbiAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgfSBlbHNlIGlmIChlbFswXSA9PSBcInZhbGVuY2VcIikge1xuICAgICAgICBlbC5wdXNoKHZhbGVuY2UoZWxbMV0pKTtcbiAgICAgICAgZWwucHVzaChlbFsxXSAqIDEwKTtcbiAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgfTtcbiAgICAgIFxuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbiAgfTtcbiAgXG4gIGNvbnN0IGFjb3VzdGljbmVzcyA9IChkYXR1bSkgPT4ge1xuICAgIGlmIChkYXR1bSA8IDAuMikge1xuICAgICAgcmV0dXJuIFwiQWNvdXN0aWNcIlxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPCAwLjQgKSB7XG4gICAgICByZXR1cm4gXCJNb3N0bHkgYWNvdXN0aWNcIlxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJOb3QgYWNvdXN0aWNcIlxuICAgIH1cbiAgfTtcbiAgXG4gIGNvbnN0IGRhbmNlYWJpbGl0eSA9IChkYXR1bSkgPT4ge1xuICAgIGlmIChkYXR1bSA8IDAuMikge1xuICAgICAgcmV0dXJuIFwiTm90IGRhbmNlYWJsZVwiXG4gICAgfSBlbHNlIGlmIChkYXR1bSA8IDAuNCkge1xuICAgICAgcmV0dXJuIFwiU2xvdyBEYW5jZVwiXG4gICAgfSBlbHNlIGlmIChkYXR1bSA8IDAuNikge1xuICAgICAgcmV0dXJuIFwiR290IGEgYmVhdFwiXG4gICAgfSBlbHNlIGlmIChkYXR1bSA8IDAuOCkge1xuICAgICAgcmV0dXJuIFwiVXBiZWF0XCJcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiQmFuZ2VyXCJcbiAgICB9O1xuICB9O1xuICBcbiAgY29uc3QgZW5lcmd5ID0gKGRhdHVtKSA9PiB7XG4gICAgaWYgKGRhdHVtIDwgMC4yKSB7XG4gICAgICByZXR1cm4gXCJSZWxheGluZ1wiXG4gICAgfSBlbHNlIGlmIChkYXR1bSA8IDAuNCkge1xuICAgICAgcmV0dXJuIFwiTG93IGVuZXJneVwiXG4gICAgfSBlbHNlIGlmIChkYXR1bSA8IDAuNikge1xuICAgICAgcmV0dXJuIFwiQW5kYW50ZVwiIFxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPCAwLjgpIHtcbiAgICAgIHJldHVybiBcIkhpZ2ggZW5lcmd5XCJcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiSXQgc2xhcHNcIlxuICAgIH07XG4gIH07XG4gIFxuICBjb25zdCBpbnN0cnVtZW50YWxuZXNzID0gKGRhdHVtKSA9PiB7XG4gICAgaWYgKGRhdHVtIDwgMC45KSB7XG4gICAgICByZXR1cm4gXCJOb3QgaW5zdHJ1bWVudGFsXCJcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiSW5zdHJ1bWVudGFsXCJcbiAgICB9O1xuICB9O1xuICBcbiAgY29uc3Qga2V5ID0gKGRhdHVtKSA9PiB7XG4gICAgaWYgKGRhdHVtID09IDApIHtcbiAgICAgIHJldHVybiBcIktleSBvZiBDXCJcbiAgICB9IGVsc2UgaWYgKGRhdHVtID09IDEpIHtcbiAgICAgIHJldHVybiBcIktleSBvZiBD4pmvLCBE4pmtXCJcbiAgICB9IGVsc2UgaWYgKGRhdHVtID09IDIpIHtcbiAgICAgIHJldHVybiBcIktleSBvZiBEXCJcbiAgICB9IGVsc2UgaWYgKGRhdHVtID09IDMpIHtcbiAgICAgIHJldHVybiBcIktleSBvZiBE4pmvLCBF4pmtXCJcbiAgICB9IGVsc2UgaWYgKGRhdHVtID09IDQpIHtcbiAgICAgIHJldHVybiBcIktleSBvZiBFXCJcbiAgICB9IGVsc2UgaWYgKGRhdHVtID09IDUpIHtcbiAgICAgIHJldHVybiBcIktleSBvZiBGXCJcbiAgICB9IGVsc2UgaWYgKGRhdHVtID09IDYpIHtcbiAgICAgIHJldHVybiBcIktleSBvZiBG4pmvLCBH4pmtXCJcbiAgICB9IGVsc2UgaWYgKGRhdHVtID09IDcpIHtcbiAgICAgIHJldHVybiBcIktleSBvZiBHXCIgXG4gICAgfSBlbHNlIGlmIChkYXR1bSA9PSA4KSB7XG4gICAgICByZXR1cm4gXCJLZXkgb2YgR+KZrywgQeKZrVwiIFxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPT0gOSkge1xuICAgICAgcmV0dXJuIFwiS2V5IG9mIEFcIiBcbiAgICB9IGVsc2UgaWYgKGRhdHVtID09IDEwKSB7XG4gICAgICByZXR1cm4gXCJLZXkgb2YgQeKZrywgQuKZrVwiIFxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPT0gMTEpIHtcbiAgICAgIHJldHVybiBcIktleSBvZiBCXCIgXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIk5vIGtleVwiIFxuICAgIH07XG4gIH07XG4gIFxuICBjb25zdCB2YWxlbmNlID0gKGRhdHVtKSA9PiB7XG4gICAgaWYgKGRhdHVtIDwgMC4yKSB7XG4gICAgICByZXR1cm4gXCJCbGVha1wiXG4gICAgfSBlbHNlIGlmIChkYXR1bSA8IDAuNCkge1xuICAgICAgcmV0dXJuIFwiTWVsYW5jaG9saWNcIlxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPCAwLjYpIHtcbiAgICAgIHJldHVybiBcIlNlcmVuZVwiIFxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPCAwLjgpIHtcbiAgICAgIHJldHVybiBcIkhhcHB5XCJcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiRXVwaG9yaWNcIlxuICAgIH07fTtcblxuICAgIGV4cG9ydCBkZWZhdWx0IGRhdGFJbnRlcnByZXRhdGlvbjsiLCJjb25zdCBkYXRhUmVzZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgZDMuc2VsZWN0KFwiI21haW5cIikuc2VsZWN0QWxsKFwiKlwiKS5yZW1vdmUoKTtcbiAgICBsZXQgaW1nID0gJCgnPGRpdiBpZD1cInRyYWNrLWltYWdlXCI+PC9kaXY+Jyk7XG4gICAgaW1nLmFwcGVuZFRvKFwiI21haW5cIik7XG4gICAgbGV0IGdlbnJlID0gJCgnPGRpdiBpZD1cImdlbnJlLWNsb3VkXCI+PC9kaXY+Jyk7XG4gICAgZ2VucmUuYXBwZW5kVG8oXCIjbWFpblwiKTtcbiAgICBsZXQgZGF0YSA9ICQoJzxkaXYgaWQ9XCJkYXRhLWJhcnNcIj48L2Rpdj4nKTtcbiAgICBkYXRhLmFwcGVuZFRvKFwiI21haW5cIilcbiAgICBsZXQgZGF0YUNvbnRhaW5lciA9ICQoJzxkaXYgaWQ9XCJkYXRhLWNvbnRhaW5lclwiPjwvZGl2PicpO1xuICAgIGRhdGFDb250YWluZXIuYXBwZW5kVG8oXCIjbWFpblwiKVxufVxuXG5leHBvcnQgZGVmYXVsdCBkYXRhUmVzZXQiLCJpbXBvcnQgZDNGdW5jdGlvbiBmcm9tICcuL2QzRnVuY3Rpb24nO1xuaW1wb3J0IGRhdGFSZXNldCBmcm9tICcuL3Jlc2V0Jztcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHtcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoYnV0dG9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGRhdGFSZXNldCgpO1xuICAgIGQzRnVuY3Rpb24oZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFyY2hcIikudmFsdWUpO1xufSk7XG59KTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iXSwic291cmNlUm9vdCI6IiJ9