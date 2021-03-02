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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2QzRnVuY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9pbnRlcnByZXRhdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVzZXQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlYXJjaC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGVzL2luZGV4LnNjc3M/YzgwNyJdLCJuYW1lcyI6WyJkM0Z1bmN0aW9uIiwidHJhY2siLCJ0cmFja0lkIiwiZmVhdHVyZXMiLCIkIiwiZ2V0IiwiZGF0YSIsImltZyIsImF0dHIiLCJhbGJ1bSIsImltYWdlcyIsInVybCIsImFwcGVuZFRvIiwiYXJ0aXN0IiwiYXJ0aXN0cyIsIm5hbWUiLCJpZCIsImQzQ2xvdWQiLCJkMyIsInNlbGVjdCIsInNlbGVjdEFsbCIsImJvZHkiLCJnZW5yZXMiLCJlbnRlciIsImFwcGVuZCIsInRleHQiLCJkIiwiZDNEYXRhIiwiT2JqZWN0IiwiZW50cmllcyIsImZpbHRlciIsImVsIiwiaW5jbHVkZXMiLCJkM0RhdGFJbnRlcnByZXRlZCIsImRhdGFJbnRlcnByZXRhdGlvbiIsInJhZGlhbFNjYWxlIiwic2NhbGVMaW5lYXIiLCJkb21haW4iLCJyYW5nZSIsInRpY2tzIiwic3ZnIiwiZm9yRWFjaCIsInQiLCJ0b1N0cmluZyIsImFuZ2xlVG9Db29yZGluYXRlIiwiYW5nbGUiLCJ2YWx1ZSIsIngiLCJNYXRoIiwiY29zIiwieSIsInNpbiIsImkiLCJsZW5ndGgiLCJmdF9uYW1lIiwiUEkiLCJsaW5lX2Nvb3JkaW5hdGUiLCJsYWJlbF9jb29yZGluYXRlIiwibGluZSIsImdldFBhdGhDb29yZGluYXRlcyIsImRhdGFfcG9pbnQiLCJjb29yZGluYXRlcyIsInB1c2giLCJjb2xvciIsImRhdHVtIiwiZGl2U2VsZWN0aW9uIiwid2luZG93IiwiYWRkRXZlbnRMaXN0ZW5lciIsInJlc3VsdCIsIm1hcCIsImFjb3VzdGljbmVzcyIsImRhbmNlYWJpbGl0eSIsImVuZXJneSIsImluc3RydW1lbnRhbG5lc3MiLCJrZXkiLCJmbG9vciIsInZhbGVuY2UiLCJkYXRhUmVzZXQiLCJyZW1vdmUiLCJnZW5yZSIsImRhdGFDb250YWluZXIiLCJkb2N1bWVudCIsImdldEVsZW1lbnRCeUlkIiwiZXZlbnQiLCJwcmV2ZW50RGVmYXVsdCJdLCJtYXBwaW5ncyI6IjtRQUFBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBOzs7UUFHQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMENBQTBDLGdDQUFnQztRQUMxRTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLHdEQUF3RCxrQkFBa0I7UUFDMUU7UUFDQSxpREFBaUQsY0FBYztRQUMvRDs7UUFFQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0EseUNBQXlDLGlDQUFpQztRQUMxRSxnSEFBZ0gsbUJBQW1CLEVBQUU7UUFDckk7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSwyQkFBMkIsMEJBQTBCLEVBQUU7UUFDdkQsaUNBQWlDLGVBQWU7UUFDaEQ7UUFDQTtRQUNBOztRQUVBO1FBQ0Esc0RBQXNELCtEQUErRDs7UUFFckg7UUFDQTs7O1FBR0E7UUFDQTs7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUFBO0FBQUE7O0FBRUEsSUFBTUEsVUFBVSxHQUFHLFNBQWJBLFVBQWEsQ0FBU0MsS0FBVCxFQUFnQjtBQUNqQyxNQUFJQyxPQUFPLEdBQUcsRUFBZDtBQUNBLE1BQU1DLFFBQVEsR0FBRyxDQUFDLGNBQUQsRUFBaUIsUUFBakIsRUFBMkIsS0FBM0IsRUFBa0MsU0FBbEMsRUFBNkMsT0FBN0MsQ0FBakI7QUFFQUMsR0FBQyxDQUFDQyxH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QUFDLENBQUMsOEJBQUQsQ0FBYjtBQUNBMkUsT0FBSyxDQUFDbkUsUUFBTixDQUFlLE9BQWY7QUFDQSxNQUFJTixJQUFJLEdBQUdGLENBQUMsQ0FBQyw0QkFBRCxDQUFaO0FBQ0FFLE1BQUksQ0FBQ00sUUFBTCxDQUFjLE9BQWQ7QUFDQSxNQUFJb0UsYUFBYSxHQUFHNUUsQ0FBQyxDQUFDLGlDQUFELENBQXJCO0FBQ0E0RSxlQUFhLENBQUNwRSxRQUFkLENBQXVCLE9BQXZCO0FBQ0gsQ0FWRDs7QUFZZWlFLHdFQUFmLEU7Ozs7Ozs7Ozs7OztBQ1pBO0FBQUE7QUFBQTtBQUFBO0FBQ0E7QUFFQVgsTUFBTSxDQUFDQyxnQkFBUCxDQUF3QixrQkFBeEIsRUFBNEMsWUFBTTtBQUNsRGMsVUFBUSxDQUFDQyxjQUFULENBQXdCLGNBQXhCLEVBQXdDZixnQkFBeEMsQ0FBeUQsT0FBekQsRUFBa0UsWUFBTTtBQUNwRWdCLFNBQUssQ0FBQ0MsY0FBTjtBQUNBUCwwREFBUztBQUNUN0UsK0RBQVUsQ0FBQ2lGLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixRQUF4QixFQUFrQ3BDLEtBQW5DLENBQVY7QUFDSCxHQUpEO0FBS0MsQ0FORCxFOzs7Ozs7Ozs7OztBQ0hBLHVDIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9kaXN0L1wiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC5qc1wiKTtcbiIsImltcG9ydCBkYXRhSW50ZXJwcmV0YXRpb24gZnJvbSBcIi4vaW50ZXJwcmV0YXRpb25cIjtcblxuY29uc3QgZDNGdW5jdGlvbiA9IGZ1bmN0aW9uKHRyYWNrKSB7XG4gIGxldCB0cmFja0lkID0gXCJcIjtcbiAgY29uc3QgZmVhdHVyZXMgPSBbXCJkYW5jZWFiaWxpdHlcIiwgXCJlbmVyZ3lcIiwgXCJrZXlcIiwgXCJ2YWxlbmNlXCIsIFwidGVtcG9cIl0gXG4gICAgXG4gICQuZ2V0KGAvdHJhY2tzZWFyY2gvJHt0cmFja31gLCAoZGF0YSkgPT4ge1xuICAgIC8vIERpc3BsYXkgdGhlIGFsYnVtIGFydCBhbmQgYXJ0aXN0IGluZm9ybWF0aW9uXG4gICAgbGV0IGltZyA9ICQoJzxpbWcgaWQ9XCJhbGJ1bWFydFwiLz4nKTtcbiAgICBpbWcuYXR0cignc3JjJywgZGF0YS5hbGJ1bS5pbWFnZXNbMF0udXJsKTtcbiAgICBpbWcuYXBwZW5kVG8oJyN0cmFjay1pbWFnZScpO1xuICAgIGxldCBhcnRpc3QgPSAkKGA8ZGl2IGlkPVwiYXJ0aXN0LWluZm9cIj5cbiAgICAgICAgPGRpdj5BcnRpc3Q6ICR7ZGF0YS5hcnRpc3RzWzBdLm5hbWV9PC9kaXY+XG4gICAgICAgIDxkaXY+VHJhY2s6ICR7ZGF0YS5uYW1lfTwvZGl2PlxuICAgICAgICA8L2Rpdj5gKTtcbiAgICBhcnRpc3QuYXBwZW5kVG8oJyN0cmFjay1pbWFnZScpO1xuXG4gICAgLy9nZXRzIGdlbnJlcyBmcm9tIGFydGlzdFxuICAgICQuZ2V0KGAvYWxidW0vJHtkYXRhLmFydGlzdHNbMF0uaWR9YCwgKGRhdGEpID0+IHtcbiAgICAgIC8vY3JlYXRlcyBhIGNsb3VkIG9mIGdlbnJlc1xuICAgICAgbGV0IGQzQ2xvdWQgPSBkMy5zZWxlY3QoJyNnZW5yZS1jbG91ZCcpLnNlbGVjdEFsbCgnZGl2Jyk7XG4gICAgICAgIGQzQ2xvdWQuZGF0YShkYXRhLmJvZHkuZ2VucmVzKS5lbnRlcigpLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAudGV4dCgoZCkgPT4ge3JldHVybiBkfSk7ICAgIFxuICAgIH0pO1xuXG5cbiAgICBcbiAgICAvLyBnZXRzIHRyYWNrYW5hbHlzaXMgZnJvbSBzZWFyY2hlZCB0cmFja0lkXG4gICAgdHJhY2tJZCA9IGRhdGEuaWQ7XG4gICAgJC5nZXQoYC90cmFja2FuYWx5c2lzLyR7dHJhY2tJZH1gLCAoZGF0YSkgPT4ge1xuICAgICAgICAgIGxldCBkM0RhdGEgPSBPYmplY3QuZW50cmllcyhkYXRhLmJvZHkpXG4gICAgICAgICAgIC5maWx0ZXIoZWwgPT4gZmVhdHVyZXMuaW5jbHVkZXMoZWxbMF0pKTtcbiAgICAgICAgICBsZXQgZDNEYXRhSW50ZXJwcmV0ZWQgPSBkYXRhSW50ZXJwcmV0YXRpb24oZDNEYXRhKTtcblxuICAgICAgICBcbiAgICAvLyBEMyBsb2dpYyAtLSBncmF0ZWZ1bCB0byB5YW5nZGFubnk5Ny5naXRodWIuaW8gZm9yIHRoZSB0dXRvcmlhbFxuICAgICAgICBsZXQgcmFkaWFsU2NhbGUgPSBkMy5zY2FsZUxpbmVhcigpXG4gICAgICAgICAgLmRvbWFpbihbMCwxMF0pXG4gICAgICAgICAgLnJhbmdlKFswLDI1MF0pO1xuICAgICAgICBsZXQgdGlja3MgPSBbMiw0LDYsOCwxMF07XG5cbiAgICAgICAgbGV0IHN2ZyA9IGQzLnNlbGVjdChcIiNkYXRhLWNvbnRhaW5lclwiKS5hcHBlbmQoXCJzdmdcIilcbiAgICAgICAgICAuYXR0cihcIndpZHRoXCIsIDcwMClcbiAgICAgICAgICAuYXR0cihcImhlaWdodFwiLCA3MDApO1xuICAgICAgICBcbiAgICAgICAgICB0aWNrcy5mb3JFYWNoKHQgPT5cbiAgICAgICAgICAgIHN2Zy5hcHBlbmQoXCJjaXJjbGVcIilcbiAgICAgICAgICAgIC5hdHRyKFwiY3hcIiwgMzAwKVxuICAgICAgICAgICAgLmF0dHIoXCJjeVwiLCAzMDApXG4gICAgICAgICAgICAuYXR0cihcImZpbGxcIiwgXCJub25lXCIpXG4gICAgICAgICAgICAuYXR0cihcInN0cm9rZVwiLCBcImdyYXlcIilcbiAgICAgICAgICAgIC5hdHRyKFwiclwiLCByYWRpYWxTY2FsZSh0KSlcbiAgICAgICAgKTtcblxuICAgICAgICB0aWNrcy5mb3JFYWNoKHQgPT5cbiAgICAgICAgICBzdmcuYXBwZW5kKFwidGV4dFwiKVxuICAgICAgICAgIC5hdHRyKFwieFwiLCAzMDUpXG4gICAgICAgICAgLmF0dHIoXCJ5XCIsIDMwMCAtIHJhZGlhbFNjYWxlKHQpKVxuICAgICAgICAgIC50ZXh0KHQudG9TdHJpbmcoKSlcbiAgICAgICk7XG5cbiAgICAgIGZ1bmN0aW9uIGFuZ2xlVG9Db29yZGluYXRlKGFuZ2xlLCB2YWx1ZSl7XG4gICAgICAgIGxldCB4ID0gTWF0aC5jb3MoYW5nbGUpICogcmFkaWFsU2NhbGUodmFsdWUpO1xuICAgICAgICBsZXQgeSA9IE1hdGguc2luKGFuZ2xlKSAqIHJhZGlhbFNjYWxlKHZhbHVlKTtcbiAgICAgICAgcmV0dXJuIHtcInhcIjogMzAwICsgeCwgXCJ5XCI6IDMwMCAtIHl9O1xuICAgICAgfTtcblxuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmZWF0dXJlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgZnRfbmFtZSA9IGZlYXR1cmVzW2ldO1xuICAgICAgICBsZXQgYW5nbGUgPSAoTWF0aC5QSSAvIDIpICsgKDIgKiBNYXRoLlBJICogaSAvIGZlYXR1cmVzLmxlbmd0aCk7XG4gICAgICAgIGxldCBsaW5lX2Nvb3JkaW5hdGUgPSBhbmdsZVRvQ29vcmRpbmF0ZShhbmdsZSwgMTApO1xuICAgICAgICBsZXQgbGFiZWxfY29vcmRpbmF0ZSA9IGFuZ2xlVG9Db29yZGluYXRlKGFuZ2xlLCAxMS41NSk7XG4gICAgICBcbiAgICAgICAgc3ZnLmFwcGVuZChcImxpbmVcIilcbiAgICAgICAgICAuYXR0cihcIngxXCIsIDMwMClcbiAgICAgICAgICAuYXR0cihcInkxXCIsIDMwMClcbiAgICAgICAgICAuYXR0cihcIngyXCIsIGxpbmVfY29vcmRpbmF0ZS54KVxuICAgICAgICAgIC5hdHRyKFwieTJcIiwgbGluZV9jb29yZGluYXRlLnkpXG4gICAgICAgICAgLmF0dHIoXCJzdHJva2VcIixcImJsYWNrXCIpO1xuICAgICAgICBcbiAgICAgIH07XG5cbiAgICBsZXQgbGluZSA9IGQzLmxpbmUoKVxuICAgICAgLngoZCA9PiBkLngpXG4gICAgICAueShkID0+IGQueSk7XG5cbiAgICBmdW5jdGlvbiBnZXRQYXRoQ29vcmRpbmF0ZXMoZGF0YV9wb2ludCl7XG4gICAgICBsZXQgY29vcmRpbmF0ZXMgPSBbXTtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmVhdHVyZXMubGVuZ3RoOyBpKyspe1xuICAgICAgICAgIGxldCBhbmdsZSA9IChNYXRoLlBJIC8gMikgKyAoMiAqIE1hdGguUEkgKiBpIC8gZmVhdHVyZXMubGVuZ3RoKTtcbiAgICAgICAgICBjb29yZGluYXRlcy5wdXNoKGFuZ2xlVG9Db29yZGluYXRlKGFuZ2xlLCAoZGF0YV9wb2ludFtpXVszXSkpKTtcbiAgICAgIH07XG4gICAgICByZXR1cm4gY29vcmRpbmF0ZXM7XG4gICAgfTtcblxuICAgXG4gICAgICBsZXQgY29sb3IgPSBcImRhcmtvcmFuZ2VcIjtcbiAgICAgIGxldCBjb29yZGluYXRlcyA9IGdldFBhdGhDb29yZGluYXRlcyhkM0RhdGFJbnRlcnByZXRlZCk7XG4gIFxuICAgICAgc3ZnLmFwcGVuZChcInBhdGhcIilcbiAgICAgIC5kYXR1bShjb29yZGluYXRlcylcbiAgICAgIC5hdHRyKFwiZFwiLGxpbmUpXG4gICAgICAuYXR0cihcInN0cm9rZS13aWR0aFwiLCAzKVxuICAgICAgLmF0dHIoXCJzdHJva2VcIiwgY29sb3IpXG4gICAgICAuYXR0cihcImZpbGxcIiwgY29sb3IpXG4gICAgICAuYXR0cihcInN0cm9rZS1vcGFjaXR5XCIsIDEpXG4gICAgICAuYXR0cihcIm9wYWNpdHlcIiwgMC41KTtcblxuICAgICAgLy8gZGlzcGxheXMgdGhlIGRhdGEgdGV4dCB3aXRoIFxuICAgICAgbGV0IGRpdlNlbGVjdGlvbiA9IGQzLnNlbGVjdCgnI2RhdGEtYmFycycpLnNlbGVjdEFsbCgnZGl2Jyk7XG5cbiAgICAgICAgICBkaXZTZWxlY3Rpb24uZGF0YShkM0RhdGFJbnRlcnByZXRlZCkuZW50ZXIoKS5hcHBlbmQoXCJkaXZcIilcbiAgICAgICAgICAudGV4dCgoZCkgPT4ge1xuICAgICAgICAgIHJldHVybiBkWzBdICsgXCI6IFwiICsgZFsyXTt9KVxuICAgICAgfSk7XG4gIH0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IGQzRnVuY3Rpb24iLCJpbXBvcnQgXCIuL3N0eWxlcy9pbmRleC5zY3NzXCI7XG5pbXBvcnQgXCIuL3NlYXJjaFwiO1xuaW1wb3J0IGQzRnVuY3Rpb24gZnJvbSBcIi4vZDNGdW5jdGlvblwiO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xuIGQzRnVuY3Rpb24oKTtcbn0pO1xuXG4iLCIvL3RoZXNlIGZ1bmN0aW9ucyBpbnRlcnByZXQgYW5kIG5vcm1hbGl6ZSB0aGUgZGF0YSBcblxuY29uc3QgZGF0YUludGVycHJldGF0aW9uID0gKGRhdGEpID0+IHtcbiAgXG4gICAgbGV0IHJlc3VsdCA9IGRhdGEubWFwKChlbCkgPT4ge1xuICAgICAgaWYgKGVsWzBdID09IFwiYWNvdXN0aWNuZXNzXCIpIHtcbiAgICAgIGVsLnB1c2goYWNvdXN0aWNuZXNzKGVsWzFdKSk7XG4gICAgICBlbC5wdXNoKGVsWzFdICogMTApO1xuICAgICAgcmV0dXJuIGVsO1xuICAgICAgfSBlbHNlIGlmIChlbFswXSA9PSBcImRhbmNlYWJpbGl0eVwiKSB7XG4gICAgICAgIGVsLnB1c2goZGFuY2VhYmlsaXR5KGVsWzFdKSk7XG4gICAgICAgIGVsLnB1c2goZWxbMV0gKiAxMCk7XG4gICAgICAgIHJldHVybiBlbDtcbiAgICAgIH0gZWxzZSBpZiAoZWxbMF0gPT0gXCJlbmVyZ3lcIikge1xuICAgICAgICBlbC5wdXNoKGVuZXJneShlbFsxXSkpO1xuICAgICAgICBlbC5wdXNoKGVsWzFdICogMTApO1xuICAgICAgICByZXR1cm4gZWw7XG4gICAgICB9IGVsc2UgaWYgKGVsWzBdID09IFwiaW5zdHJ1bWVudGFsbmVzc1wiKSB7XG4gICAgICAgIGVsLnB1c2goaW5zdHJ1bWVudGFsbmVzcyhlbFsxXSkpO1xuICAgICAgICBlbC5wdXNoKGVsWzFdICogMTApO1xuICAgICAgICByZXR1cm4gZWw7XG4gICAgICB9IGVsc2UgaWYgKGVsWzBdID09IFwia2V5XCIpIHtcbiAgICAgICAgZWwucHVzaChrZXkoZWxbMV0pKTtcbiAgICAgICAgZWwucHVzaChlbFsxXSk7XG4gICAgICAgIHJldHVybiBlbDtcbiAgICAgIH0gZWxzZSBpZiAoZWxbMF0gPT0gXCJ0ZW1wb1wiKSB7XG4gICAgICAgIGVsLnB1c2goTWF0aC5mbG9vcihlbFsxXSkpO1xuICAgICAgICBlbC5wdXNoKChlbFsxXS01MCkvMTUpO1xuICAgICAgICByZXR1cm4gZWw7XG4gICAgICB9IGVsc2UgaWYgKGVsWzBdID09IFwidmFsZW5jZVwiKSB7XG4gICAgICAgIGVsLnB1c2godmFsZW5jZShlbFsxXSkpO1xuICAgICAgICBlbC5wdXNoKGVsWzFdICogMTApO1xuICAgICAgICByZXR1cm4gZWw7XG4gICAgICB9O1xuICAgICAgXG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xuICB9O1xuICBcbiAgY29uc3QgYWNvdXN0aWNuZXNzID0gKGRhdHVtKSA9PiB7XG4gICAgaWYgKGRhdHVtIDwgMC4yKSB7XG4gICAgICByZXR1cm4gXCJBY291c3RpY1wiXG4gICAgfSBlbHNlIGlmIChkYXR1bSA8IDAuNCApIHtcbiAgICAgIHJldHVybiBcIk1vc3RseSBhY291c3RpY1wiXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIk5vdCBhY291c3RpY1wiXG4gICAgfVxuICB9O1xuICBcbiAgY29uc3QgZGFuY2VhYmlsaXR5ID0gKGRhdHVtKSA9PiB7XG4gICAgaWYgKGRhdHVtIDwgMC4yKSB7XG4gICAgICByZXR1cm4gXCJOb3QgZGFuY2VhYmxlXCJcbiAgICB9IGVsc2UgaWYgKGRhdHVtIDwgMC40KSB7XG4gICAgICByZXR1cm4gXCJTbG93IERhbmNlXCJcbiAgICB9IGVsc2UgaWYgKGRhdHVtIDwgMC42KSB7XG4gICAgICByZXR1cm4gXCJHb3QgYSBiZWF0XCJcbiAgICB9IGVsc2UgaWYgKGRhdHVtIDwgMC44KSB7XG4gICAgICByZXR1cm4gXCJVcGJlYXRcIlxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJCYW5nZXJcIlxuICAgIH07XG4gIH07XG4gIFxuICBjb25zdCBlbmVyZ3kgPSAoZGF0dW0pID0+IHtcbiAgICBpZiAoZGF0dW0gPCAwLjIpIHtcbiAgICAgIHJldHVybiBcIlJlbGF4aW5nXCJcbiAgICB9IGVsc2UgaWYgKGRhdHVtIDwgMC40KSB7XG4gICAgICByZXR1cm4gXCJMb3cgZW5lcmd5XCJcbiAgICB9IGVsc2UgaWYgKGRhdHVtIDwgMC42KSB7XG4gICAgICByZXR1cm4gXCJBbmRhbnRlXCIgXG4gICAgfSBlbHNlIGlmIChkYXR1bSA8IDAuOCkge1xuICAgICAgcmV0dXJuIFwiSGlnaCBlbmVyZ3lcIlxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJJdCBzbGFwc1wiXG4gICAgfTtcbiAgfTtcbiAgXG4gIGNvbnN0IGluc3RydW1lbnRhbG5lc3MgPSAoZGF0dW0pID0+IHtcbiAgICBpZiAoZGF0dW0gPCAwLjkpIHtcbiAgICAgIHJldHVybiBcIk5vdCBpbnN0cnVtZW50YWxcIlxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJJbnN0cnVtZW50YWxcIlxuICAgIH07XG4gIH07XG4gIFxuICBjb25zdCBrZXkgPSAoZGF0dW0pID0+IHtcbiAgICBpZiAoZGF0dW0gPT0gMCkge1xuICAgICAgcmV0dXJuIFwiS2V5IG9mIENcIlxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPT0gMSkge1xuICAgICAgcmV0dXJuIFwiS2V5IG9mIEPima8sIETima1cIlxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPT0gMikge1xuICAgICAgcmV0dXJuIFwiS2V5IG9mIERcIlxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPT0gMykge1xuICAgICAgcmV0dXJuIFwiS2V5IG9mIETima8sIEXima1cIlxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPT0gNCkge1xuICAgICAgcmV0dXJuIFwiS2V5IG9mIEVcIlxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPT0gNSkge1xuICAgICAgcmV0dXJuIFwiS2V5IG9mIEZcIlxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPT0gNikge1xuICAgICAgcmV0dXJuIFwiS2V5IG9mIEbima8sIEfima1cIlxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPT0gNykge1xuICAgICAgcmV0dXJuIFwiS2V5IG9mIEdcIiBcbiAgICB9IGVsc2UgaWYgKGRhdHVtID09IDgpIHtcbiAgICAgIHJldHVybiBcIktleSBvZiBH4pmvLCBB4pmtXCIgXG4gICAgfSBlbHNlIGlmIChkYXR1bSA9PSA5KSB7XG4gICAgICByZXR1cm4gXCJLZXkgb2YgQVwiIFxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPT0gMTApIHtcbiAgICAgIHJldHVybiBcIktleSBvZiBB4pmvLCBC4pmtXCIgXG4gICAgfSBlbHNlIGlmIChkYXR1bSA9PSAxMSkge1xuICAgICAgcmV0dXJuIFwiS2V5IG9mIEJcIiBcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiTm8ga2V5XCIgXG4gICAgfTtcbiAgfTtcbiAgXG4gIGNvbnN0IHZhbGVuY2UgPSAoZGF0dW0pID0+IHtcbiAgICBpZiAoZGF0dW0gPCAwLjIpIHtcbiAgICAgIHJldHVybiBcIkJsZWFrXCJcbiAgICB9IGVsc2UgaWYgKGRhdHVtIDwgMC40KSB7XG4gICAgICByZXR1cm4gXCJNZWxhbmNob2xpY1wiXG4gICAgfSBlbHNlIGlmIChkYXR1bSA8IDAuNikge1xuICAgICAgcmV0dXJuIFwiU2VyZW5lXCIgXG4gICAgfSBlbHNlIGlmIChkYXR1bSA8IDAuOCkge1xuICAgICAgcmV0dXJuIFwiSGFwcHlcIlxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJFdXBob3JpY1wiXG4gICAgfTt9O1xuXG4gICAgZXhwb3J0IGRlZmF1bHQgZGF0YUludGVycHJldGF0aW9uOyIsImNvbnN0IGRhdGFSZXNldCA9IGZ1bmN0aW9uICgpIHtcbiAgICBkMy5zZWxlY3QoXCIjbWFpblwiKS5zZWxlY3RBbGwoXCIqXCIpLnJlbW92ZSgpO1xuICAgIGxldCBpbWcgPSAkKCc8ZGl2IGlkPVwidHJhY2staW1hZ2VcIj48L2Rpdj4nKTtcbiAgICBpbWcuYXBwZW5kVG8oXCIjbWFpblwiKTtcbiAgICBsZXQgZ2VucmUgPSAkKCc8ZGl2IGlkPVwiZ2VucmUtY2xvdWRcIj48L2Rpdj4nKTtcbiAgICBnZW5yZS5hcHBlbmRUbyhcIiNtYWluXCIpO1xuICAgIGxldCBkYXRhID0gJCgnPGRpdiBpZD1cImRhdGEtYmFyc1wiPjwvZGl2PicpO1xuICAgIGRhdGEuYXBwZW5kVG8oXCIjbWFpblwiKVxuICAgIGxldCBkYXRhQ29udGFpbmVyID0gJCgnPGRpdiBpZD1cImRhdGEtY29udGFpbmVyXCI+PC9kaXY+Jyk7XG4gICAgZGF0YUNvbnRhaW5lci5hcHBlbmRUbyhcIiNtYWluXCIpXG59XG5cbmV4cG9ydCBkZWZhdWx0IGRhdGFSZXNldCIsImltcG9ydCBkM0Z1bmN0aW9uIGZyb20gJy4vZDNGdW5jdGlvbic7XG5pbXBvcnQgZGF0YVJlc2V0IGZyb20gJy4vcmVzZXQnO1xuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xuZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFyY2hidXR0b25cIikuYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIsICgpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpXG4gICAgZGF0YVJlc2V0KCk7XG4gICAgZDNGdW5jdGlvbihkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInNlYXJjaFwiKS52YWx1ZSk7XG59KTtcbn0pOyIsIi8vIGV4dHJhY3RlZCBieSBtaW5pLWNzcy1leHRyYWN0LXBsdWdpbiJdLCJzb3VyY2VSb290IjoiIn0=