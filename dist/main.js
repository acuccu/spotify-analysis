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
      var svg = d3.select("#main-container").append("svg").attr("width", 700).attr("height", 700);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vc3JjL2QzRnVuY3Rpb24uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9pbnRlcnByZXRhdGlvbi5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvcmVzZXQuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL3NlYXJjaC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvc3R5bGVzL2luZGV4LnNjc3MiXSwibmFtZXMiOlsiZDNGdW5jdGlvbiIsInRyYWNrIiwiY29uc29sZSIsImxvZyIsInRyYWNrSWQiLCJmZWF0dXJlcyIsIiQiLCJnZXQiLCJkYXRhIiwiaW1nIiwiYXR0ciIsImFsYnVtIiwiaW1hZ2VzIiwidXJsIiwiYXBwZW5kVG8iLCJhcnRpc3QiLCJhcnRpc3RzIiwibmFtZSIsImlkIiwiZDNDbG91ZCIsImQzIiwic2VsZWN0Iiwic2VsZWN0QWxsIiwiYm9keSIsImdlbnJlcyIsImVudGVyIiwiYXBwZW5kIiwidGV4dCIsImQiLCJkM0RhdGEiLCJPYmplY3QiLCJlbnRyaWVzIiwiZmlsdGVyIiwiZWwiLCJpbmNsdWRlcyIsImQzRGF0YUludGVycHJldGVkIiwiZGF0YUludGVycHJldGF0aW9uIiwicmFkaWFsU2NhbGUiLCJzY2FsZUxpbmVhciIsImRvbWFpbiIsInJhbmdlIiwidGlja3MiLCJzdmciLCJmb3JFYWNoIiwidCIsInRvU3RyaW5nIiwiYW5nbGVUb0Nvb3JkaW5hdGUiLCJhbmdsZSIsInZhbHVlIiwieCIsIk1hdGgiLCJjb3MiLCJ5Iiwic2luIiwiaSIsImxlbmd0aCIsImZ0X25hbWUiLCJQSSIsImxpbmVfY29vcmRpbmF0ZSIsImxhYmVsX2Nvb3JkaW5hdGUiLCJsaW5lIiwiZ2V0UGF0aENvb3JkaW5hdGVzIiwiZGF0YV9wb2ludCIsImNvb3JkaW5hdGVzIiwicHVzaCIsImNvbG9yIiwiZGF0dW0iLCJkaXZTZWxlY3Rpb24iLCJ3aW5kb3ciLCJhZGRFdmVudExpc3RlbmVyIiwicmVzdWx0IiwibWFwIiwiYWNvdXN0aWNuZXNzIiwiZGFuY2VhYmlsaXR5IiwiZW5lcmd5IiwiaW5zdHJ1bWVudGFsbmVzcyIsImtleSIsImZsb29yIiwidmFsZW5jZSIsImRhdGFSZXNldCIsInJlbW92ZSIsImdlbnJlIiwiZG9jdW1lbnQiLCJnZXRFbGVtZW50QnlJZCIsImV2ZW50IiwicHJldmVudERlZmF1bHQiXSwibWFwcGluZ3MiOiI7UUFBQTtRQUNBOztRQUVBO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7O1FBRUE7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTs7O1FBR0E7UUFDQTs7UUFFQTtRQUNBOztRQUVBO1FBQ0E7UUFDQTtRQUNBLDBDQUEwQyxnQ0FBZ0M7UUFDMUU7UUFDQTs7UUFFQTtRQUNBO1FBQ0E7UUFDQSx3REFBd0Qsa0JBQWtCO1FBQzFFO1FBQ0EsaURBQWlELGNBQWM7UUFDL0Q7O1FBRUE7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBO1FBQ0E7UUFDQTtRQUNBLHlDQUF5QyxpQ0FBaUM7UUFDMUUsZ0hBQWdILG1CQUFtQixFQUFFO1FBQ3JJO1FBQ0E7O1FBRUE7UUFDQTtRQUNBO1FBQ0EsMkJBQTJCLDBCQUEwQixFQUFFO1FBQ3ZELGlDQUFpQyxlQUFlO1FBQ2hEO1FBQ0E7UUFDQTs7UUFFQTtRQUNBLHNEQUFzRCwrREFBK0Q7O1FBRXJIO1FBQ0E7OztRQUdBO1FBQ0E7Ozs7Ozs7Ozs7Ozs7QUNsRkE7QUFBQTtBQUFBOztBQUVBLElBQU1BLFVBQVUsR0FBRyxTQUFiQSxVQUFhLENBQVNDLEtBQVQsRUFBZ0I7QUFFL0JDLFNBQU8sQ0FBQ0MsR0FBUixDQUFZRixLQUFaO0FBQ0YsTUFBSUcsT0FBTyxHQUFHLEVBQWQ7QUFDQSxNQUFNQyxRQUFRLEdBQUcsQ0FBQyxjQUFELEVBQWlCLFFBQWpCLEVBQTJCLEtBQTNCLEVBQWtDLFNBQWxDLEVBQTZDLE9B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WSxHQUFZO0FBQzFCM0QsSUFBRSxDQUFDQyxNQUFILENBQVUsaUJBQVYsRUFBNkJDLFNBQTdCLENBQXVDLEdBQXZDLEVBQTRDMEQsTUFBNUM7QUFDQSxNQUFJdkUsR0FBRyxHQUFHSCxDQUFDLENBQUMsOEJBQUQsQ0FBWDtBQUNBRyxLQUFHLENBQUNLLFFBQUosQ0FBYSxpQkFBYjtBQUNBLE1BQUltRSxLQUFLLEdBQUczRSxDQUFDLENBQUMsOEJBQUQsQ0FBYjtBQUNBMkUsT0FBSyxDQUFDbkUsUUFBTixDQUFlLGlCQUFmO0FBQ0EsTUFBSU4sSUFBSSxHQUFHRixDQUFDLENBQUMsNEJBQUQsQ0FBWjtBQUNBRSxNQUFJLENBQUNNLFFBQUwsQ0FBYyxpQkFBZDtBQUNILENBUkQ7O0FBVWVpRSx3RUFBZixFOzs7Ozs7Ozs7Ozs7QUNWQTtBQUFBO0FBQUE7QUFBQTtBQUNBO0FBRUFYLE1BQU0sQ0FBQ0MsZ0JBQVAsQ0FBd0Isa0JBQXhCLEVBQTRDLFlBQU07QUFDbERhLFVBQVEsQ0FBQ0MsY0FBVCxDQUF3QixjQUF4QixFQUF3Q2QsZ0JBQXhDLENBQXlELE9BQXpELEVBQWtFLFlBQU07QUFDcEVlLFNBQUssQ0FBQ0MsY0FBTjtBQUNBTiwwREFBUztBQUNUL0UsK0RBQVUsQ0FBQ2tGLFFBQVEsQ0FBQ0MsY0FBVCxDQUF3QixRQUF4QixFQUFrQ25DLEtBQW5DLENBQVY7QUFDSCxHQUpEO0FBS0MsQ0FORCxFOzs7Ozs7Ozs7OztBQ0hBLHVDIiwiZmlsZSI6Im1haW4uanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIi9kaXN0L1wiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC5qc1wiKTtcbiIsImltcG9ydCBkYXRhSW50ZXJwcmV0YXRpb24gZnJvbSBcIi4vaW50ZXJwcmV0YXRpb25cIjtcblxuY29uc3QgZDNGdW5jdGlvbiA9IGZ1bmN0aW9uKHRyYWNrKSB7XG4gICAgXG4gICAgY29uc29sZS5sb2codHJhY2spO1xuICBsZXQgdHJhY2tJZCA9IFwiXCI7XG4gIGNvbnN0IGZlYXR1cmVzID0gW1wiZGFuY2VhYmlsaXR5XCIsIFwiZW5lcmd5XCIsIFwia2V5XCIsIFwidmFsZW5jZVwiLCBcInRlbXBvXCJdIFxuICAgIFxuICAkLmdldChgL3RyYWNrc2VhcmNoLyR7dHJhY2t9YCwgKGRhdGEpID0+IHtcbiAgICAvLyBEaXNwbGF5IHRoZSBhbGJ1bSBhcnQgYW5kIGFydGlzdCBpbmZvcm1hdGlvblxuICAgIGxldCBpbWcgPSAkKCc8aW1nIGlkPVwiYWxidW1hcnRcIi8+Jyk7XG4gICAgaW1nLmF0dHIoJ3NyYycsIGRhdGEuYWxidW0uaW1hZ2VzWzBdLnVybCk7XG4gICAgaW1nLmFwcGVuZFRvKCcjdHJhY2staW1hZ2UnKTtcbiAgICBsZXQgYXJ0aXN0ID0gJChgPGRpdiBpZD1cImFydGlzdC1pbmZvXCI+XG4gICAgICAgIDxkaXY+QXJ0aXN0OiAke2RhdGEuYXJ0aXN0c1swXS5uYW1lfTwvZGl2PlxuICAgICAgICA8ZGl2PlRyYWNrOiAke2RhdGEubmFtZX08L2Rpdj5cbiAgICAgICAgPC9kaXY+YCk7XG4gICAgYXJ0aXN0LmFwcGVuZFRvKCcjdHJhY2staW1hZ2UnKTtcblxuICAgIC8vZ2V0cyBnZW5yZXMgZnJvbSBhcnRpc3RcbiAgICAkLmdldChgL2FsYnVtLyR7ZGF0YS5hcnRpc3RzWzBdLmlkfWAsIChkYXRhKSA9PiB7XG4gICAgICAvL2NyZWF0ZXMgYSBjbG91ZCBvZiBnZW5yZXNcbiAgICAgIGxldCBkM0Nsb3VkID0gZDMuc2VsZWN0KCcjZ2VucmUtY2xvdWQnKS5zZWxlY3RBbGwoJ2RpdicpO1xuICAgICAgICBkM0Nsb3VkLmRhdGEoZGF0YS5ib2R5LmdlbnJlcykuZW50ZXIoKS5hcHBlbmQoXCJkaXZcIilcbiAgICAgICAgLnRleHQoKGQpID0+IHtyZXR1cm4gZH0pOyAgICBcbiAgICB9KTtcblxuXG4gICAgXG4gICAgLy8gZ2V0cyB0cmFja2FuYWx5c2lzIGZyb20gc2VhcmNoZWQgdHJhY2tJZFxuICAgIHRyYWNrSWQgPSBkYXRhLmlkO1xuICAgICQuZ2V0KGAvdHJhY2thbmFseXNpcy8ke3RyYWNrSWR9YCwgKGRhdGEpID0+IHtcbiAgICAgICAgICBsZXQgZDNEYXRhID0gT2JqZWN0LmVudHJpZXMoZGF0YS5ib2R5KVxuICAgICAgICAgICAuZmlsdGVyKGVsID0+IGZlYXR1cmVzLmluY2x1ZGVzKGVsWzBdKSk7XG4gICAgICAgICAgbGV0IGQzRGF0YUludGVycHJldGVkID0gZGF0YUludGVycHJldGF0aW9uKGQzRGF0YSk7XG5cbiAgICAgICAgXG4gICAgLy8gRDMgbG9naWMgLS0gZ3JhdGVmdWwgdG8geWFuZ2Rhbm55OTcuZ2l0aHViLmlvIGZvciB0aGUgdHV0b3JpYWxcbiAgICAgICAgbGV0IHJhZGlhbFNjYWxlID0gZDMuc2NhbGVMaW5lYXIoKVxuICAgICAgICAgIC5kb21haW4oWzAsMTBdKVxuICAgICAgICAgIC5yYW5nZShbMCwyNTBdKTtcbiAgICAgICAgbGV0IHRpY2tzID0gWzIsNCw2LDgsMTBdO1xuXG4gICAgICAgIGxldCBzdmcgPSBkMy5zZWxlY3QoXCIjbWFpbi1jb250YWluZXJcIikuYXBwZW5kKFwic3ZnXCIpXG4gICAgICAgICAgLmF0dHIoXCJ3aWR0aFwiLCA3MDApXG4gICAgICAgICAgLmF0dHIoXCJoZWlnaHRcIiwgNzAwKTtcbiAgICAgICAgXG4gICAgICAgICAgdGlja3MuZm9yRWFjaCh0ID0+XG4gICAgICAgICAgICBzdmcuYXBwZW5kKFwiY2lyY2xlXCIpXG4gICAgICAgICAgICAuYXR0cihcImN4XCIsIDMwMClcbiAgICAgICAgICAgIC5hdHRyKFwiY3lcIiwgMzAwKVxuICAgICAgICAgICAgLmF0dHIoXCJmaWxsXCIsIFwibm9uZVwiKVxuICAgICAgICAgICAgLmF0dHIoXCJzdHJva2VcIiwgXCJncmF5XCIpXG4gICAgICAgICAgICAuYXR0cihcInJcIiwgcmFkaWFsU2NhbGUodCkpXG4gICAgICAgICk7XG5cbiAgICAgICAgdGlja3MuZm9yRWFjaCh0ID0+XG4gICAgICAgICAgc3ZnLmFwcGVuZChcInRleHRcIilcbiAgICAgICAgICAuYXR0cihcInhcIiwgMzA1KVxuICAgICAgICAgIC5hdHRyKFwieVwiLCAzMDAgLSByYWRpYWxTY2FsZSh0KSlcbiAgICAgICAgICAudGV4dCh0LnRvU3RyaW5nKCkpXG4gICAgICApO1xuXG4gICAgICBmdW5jdGlvbiBhbmdsZVRvQ29vcmRpbmF0ZShhbmdsZSwgdmFsdWUpe1xuICAgICAgICBsZXQgeCA9IE1hdGguY29zKGFuZ2xlKSAqIHJhZGlhbFNjYWxlKHZhbHVlKTtcbiAgICAgICAgbGV0IHkgPSBNYXRoLnNpbihhbmdsZSkgKiByYWRpYWxTY2FsZSh2YWx1ZSk7XG4gICAgICAgIHJldHVybiB7XCJ4XCI6IDMwMCArIHgsIFwieVwiOiAzMDAgLSB5fTtcbiAgICAgIH07XG5cbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZmVhdHVyZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IGZ0X25hbWUgPSBmZWF0dXJlc1tpXTtcbiAgICAgICAgbGV0IGFuZ2xlID0gKE1hdGguUEkgLyAyKSArICgyICogTWF0aC5QSSAqIGkgLyBmZWF0dXJlcy5sZW5ndGgpO1xuICAgICAgICBsZXQgbGluZV9jb29yZGluYXRlID0gYW5nbGVUb0Nvb3JkaW5hdGUoYW5nbGUsIDEwKTtcbiAgICAgICAgbGV0IGxhYmVsX2Nvb3JkaW5hdGUgPSBhbmdsZVRvQ29vcmRpbmF0ZShhbmdsZSwgMTEuNTUpO1xuICAgICAgXG4gICAgICAgIHN2Zy5hcHBlbmQoXCJsaW5lXCIpXG4gICAgICAgICAgLmF0dHIoXCJ4MVwiLCAzMDApXG4gICAgICAgICAgLmF0dHIoXCJ5MVwiLCAzMDApXG4gICAgICAgICAgLmF0dHIoXCJ4MlwiLCBsaW5lX2Nvb3JkaW5hdGUueClcbiAgICAgICAgICAuYXR0cihcInkyXCIsIGxpbmVfY29vcmRpbmF0ZS55KVxuICAgICAgICAgIC5hdHRyKFwic3Ryb2tlXCIsXCJibGFja1wiKTtcbiAgICAgICAgXG4gICAgICAgIHN2Zy5hcHBlbmQoXCJ0ZXh0XCIpXG4gICAgICAgICAgLmF0dHIoXCJ4XCIsIGxhYmVsX2Nvb3JkaW5hdGUueClcbiAgICAgICAgICAuYXR0cihcInlcIiwgbGFiZWxfY29vcmRpbmF0ZS55KVxuICAgICAgICAgIC50ZXh0KGZ0X25hbWUpO1xuICAgICAgfTtcblxuICAgIGxldCBsaW5lID0gZDMubGluZSgpXG4gICAgICAueChkID0+IGQueClcbiAgICAgIC55KGQgPT4gZC55KTtcblxuICAgIGZ1bmN0aW9uIGdldFBhdGhDb29yZGluYXRlcyhkYXRhX3BvaW50KXtcbiAgICAgIGxldCBjb29yZGluYXRlcyA9IFtdO1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBmZWF0dXJlcy5sZW5ndGg7IGkrKyl7XG4gICAgICAgICAgbGV0IGFuZ2xlID0gKE1hdGguUEkgLyAyKSArICgyICogTWF0aC5QSSAqIGkgLyBmZWF0dXJlcy5sZW5ndGgpO1xuICAgICAgICAgIGNvb3JkaW5hdGVzLnB1c2goYW5nbGVUb0Nvb3JkaW5hdGUoYW5nbGUsIChkYXRhX3BvaW50W2ldWzNdKSkpO1xuICAgICAgfTtcbiAgICAgIHJldHVybiBjb29yZGluYXRlcztcbiAgICB9O1xuXG4gICBcbiAgICAgIGxldCBjb2xvciA9IFwiZGFya29yYW5nZVwiO1xuICAgICAgbGV0IGNvb3JkaW5hdGVzID0gZ2V0UGF0aENvb3JkaW5hdGVzKGQzRGF0YUludGVycHJldGVkKTtcbiAgXG4gICAgICBzdmcuYXBwZW5kKFwicGF0aFwiKVxuICAgICAgLmRhdHVtKGNvb3JkaW5hdGVzKVxuICAgICAgLmF0dHIoXCJkXCIsbGluZSlcbiAgICAgIC5hdHRyKFwic3Ryb2tlLXdpZHRoXCIsIDMpXG4gICAgICAuYXR0cihcInN0cm9rZVwiLCBjb2xvcilcbiAgICAgIC5hdHRyKFwiZmlsbFwiLCBjb2xvcilcbiAgICAgIC5hdHRyKFwic3Ryb2tlLW9wYWNpdHlcIiwgMSlcbiAgICAgIC5hdHRyKFwib3BhY2l0eVwiLCAwLjUpO1xuXG4gICAgICAvLyBkaXNwbGF5cyB0aGUgZGF0YSB0ZXh0IHdpdGggXG4gICAgICBsZXQgZGl2U2VsZWN0aW9uID0gZDMuc2VsZWN0KCcjZGF0YS1iYXJzJykuc2VsZWN0QWxsKCdkaXYnKTtcblxuICAgICAgICAgIGRpdlNlbGVjdGlvbi5kYXRhKGQzRGF0YUludGVycHJldGVkKS5lbnRlcigpLmFwcGVuZChcImRpdlwiKVxuICAgICAgICAgIC50ZXh0KChkKSA9PiB7XG4gICAgICAgICAgcmV0dXJuIGRbMF0gKyBcIjogXCIgKyBkWzJdO30pXG4gICAgICB9KTtcbiAgfSlcbn1cblxuZXhwb3J0IGRlZmF1bHQgZDNGdW5jdGlvbiIsImltcG9ydCBcIi4vc3R5bGVzL2luZGV4LnNjc3NcIjtcbmltcG9ydCBcIi4vc2VhcmNoXCI7XG5pbXBvcnQgZDNGdW5jdGlvbiBmcm9tIFwiLi9kM0Z1bmN0aW9uXCI7XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiRE9NQ29udGVudExvYWRlZFwiLCAoKSA9PiB7XG4gZDNGdW5jdGlvbigpO1xufSk7XG5cbiIsIi8vdGhlc2UgZnVuY3Rpb25zIGludGVycHJldCBhbmQgbm9ybWFsaXplIHRoZSBkYXRhIFxuXG5jb25zdCBkYXRhSW50ZXJwcmV0YXRpb24gPSAoZGF0YSkgPT4ge1xuICBcbiAgICBsZXQgcmVzdWx0ID0gZGF0YS5tYXAoKGVsKSA9PiB7XG4gICAgICBpZiAoZWxbMF0gPT0gXCJhY291c3RpY25lc3NcIikge1xuICAgICAgZWwucHVzaChhY291c3RpY25lc3MoZWxbMV0pKTtcbiAgICAgIGVsLnB1c2goZWxbMV0gKiAxMCk7XG4gICAgICByZXR1cm4gZWw7XG4gICAgICB9IGVsc2UgaWYgKGVsWzBdID09IFwiZGFuY2VhYmlsaXR5XCIpIHtcbiAgICAgICAgZWwucHVzaChkYW5jZWFiaWxpdHkoZWxbMV0pKTtcbiAgICAgICAgZWwucHVzaChlbFsxXSAqIDEwKTtcbiAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgfSBlbHNlIGlmIChlbFswXSA9PSBcImVuZXJneVwiKSB7XG4gICAgICAgIGVsLnB1c2goZW5lcmd5KGVsWzFdKSk7XG4gICAgICAgIGVsLnB1c2goZWxbMV0gKiAxMCk7XG4gICAgICAgIHJldHVybiBlbDtcbiAgICAgIH0gZWxzZSBpZiAoZWxbMF0gPT0gXCJpbnN0cnVtZW50YWxuZXNzXCIpIHtcbiAgICAgICAgZWwucHVzaChpbnN0cnVtZW50YWxuZXNzKGVsWzFdKSk7XG4gICAgICAgIGVsLnB1c2goZWxbMV0gKiAxMCk7XG4gICAgICAgIHJldHVybiBlbDtcbiAgICAgIH0gZWxzZSBpZiAoZWxbMF0gPT0gXCJrZXlcIikge1xuICAgICAgICBlbC5wdXNoKGtleShlbFsxXSkpO1xuICAgICAgICBlbC5wdXNoKGVsWzFdKTtcbiAgICAgICAgcmV0dXJuIGVsO1xuICAgICAgfSBlbHNlIGlmIChlbFswXSA9PSBcInRlbXBvXCIpIHtcbiAgICAgICAgZWwucHVzaChNYXRoLmZsb29yKGVsWzFdKSk7XG4gICAgICAgIGVsLnB1c2goKGVsWzFdLTUwKS8xNSk7XG4gICAgICAgIHJldHVybiBlbDtcbiAgICAgIH0gZWxzZSBpZiAoZWxbMF0gPT0gXCJ2YWxlbmNlXCIpIHtcbiAgICAgICAgZWwucHVzaCh2YWxlbmNlKGVsWzFdKSk7XG4gICAgICAgIGVsLnB1c2goZWxbMV0gKiAxMCk7XG4gICAgICAgIHJldHVybiBlbDtcbiAgICAgIH07XG4gICAgICBcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG4gIH07XG4gIFxuICBjb25zdCBhY291c3RpY25lc3MgPSAoZGF0dW0pID0+IHtcbiAgICBpZiAoZGF0dW0gPCAwLjIpIHtcbiAgICAgIHJldHVybiBcIkFjb3VzdGljXCJcbiAgICB9IGVsc2UgaWYgKGRhdHVtIDwgMC40ICkge1xuICAgICAgcmV0dXJuIFwiTW9zdGx5IGFjb3VzdGljXCJcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIFwiTm90IGFjb3VzdGljXCJcbiAgICB9XG4gIH07XG4gIFxuICBjb25zdCBkYW5jZWFiaWxpdHkgPSAoZGF0dW0pID0+IHtcbiAgICBpZiAoZGF0dW0gPCAwLjIpIHtcbiAgICAgIHJldHVybiBcIk5vdCBkYW5jZWFibGVcIlxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPCAwLjQpIHtcbiAgICAgIHJldHVybiBcIlNsb3cgRGFuY2VcIlxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPCAwLjYpIHtcbiAgICAgIHJldHVybiBcIkdvdCBhIGJlYXRcIlxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPCAwLjgpIHtcbiAgICAgIHJldHVybiBcIlVwYmVhdFwiXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIkJhbmdlclwiXG4gICAgfTtcbiAgfTtcbiAgXG4gIGNvbnN0IGVuZXJneSA9IChkYXR1bSkgPT4ge1xuICAgIGlmIChkYXR1bSA8IDAuMikge1xuICAgICAgcmV0dXJuIFwiUmVsYXhpbmdcIlxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPCAwLjQpIHtcbiAgICAgIHJldHVybiBcIkxvdyBlbmVyZ3lcIlxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPCAwLjYpIHtcbiAgICAgIHJldHVybiBcIkFuZGFudGVcIiBcbiAgICB9IGVsc2UgaWYgKGRhdHVtIDwgMC44KSB7XG4gICAgICByZXR1cm4gXCJIaWdoIGVuZXJneVwiXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIkl0IHNsYXBzXCJcbiAgICB9O1xuICB9O1xuICBcbiAgY29uc3QgaW5zdHJ1bWVudGFsbmVzcyA9IChkYXR1bSkgPT4ge1xuICAgIGlmIChkYXR1bSA8IDAuOSkge1xuICAgICAgcmV0dXJuIFwiTm90IGluc3RydW1lbnRhbFwiXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIkluc3RydW1lbnRhbFwiXG4gICAgfTtcbiAgfTtcbiAgXG4gIGNvbnN0IGtleSA9IChkYXR1bSkgPT4ge1xuICAgIGlmIChkYXR1bSA9PSAwKSB7XG4gICAgICByZXR1cm4gXCJLZXkgb2YgQ1wiXG4gICAgfSBlbHNlIGlmIChkYXR1bSA9PSAxKSB7XG4gICAgICByZXR1cm4gXCJLZXkgb2YgQ+KZrywgROKZrVwiXG4gICAgfSBlbHNlIGlmIChkYXR1bSA9PSAyKSB7XG4gICAgICByZXR1cm4gXCJLZXkgb2YgRFwiXG4gICAgfSBlbHNlIGlmIChkYXR1bSA9PSAzKSB7XG4gICAgICByZXR1cm4gXCJLZXkgb2YgROKZrywgReKZrVwiXG4gICAgfSBlbHNlIGlmIChkYXR1bSA9PSA0KSB7XG4gICAgICByZXR1cm4gXCJLZXkgb2YgRVwiXG4gICAgfSBlbHNlIGlmIChkYXR1bSA9PSA1KSB7XG4gICAgICByZXR1cm4gXCJLZXkgb2YgRlwiXG4gICAgfSBlbHNlIGlmIChkYXR1bSA9PSA2KSB7XG4gICAgICByZXR1cm4gXCJLZXkgb2YgRuKZrywgR+KZrVwiXG4gICAgfSBlbHNlIGlmIChkYXR1bSA9PSA3KSB7XG4gICAgICByZXR1cm4gXCJLZXkgb2YgR1wiIFxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPT0gOCkge1xuICAgICAgcmV0dXJuIFwiS2V5IG9mIEfima8sIEHima1cIiBcbiAgICB9IGVsc2UgaWYgKGRhdHVtID09IDkpIHtcbiAgICAgIHJldHVybiBcIktleSBvZiBBXCIgXG4gICAgfSBlbHNlIGlmIChkYXR1bSA9PSAxMCkge1xuICAgICAgcmV0dXJuIFwiS2V5IG9mIEHima8sIELima1cIiBcbiAgICB9IGVsc2UgaWYgKGRhdHVtID09IDExKSB7XG4gICAgICByZXR1cm4gXCJLZXkgb2YgQlwiIFxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gXCJObyBrZXlcIiBcbiAgICB9O1xuICB9O1xuICBcbiAgY29uc3QgdmFsZW5jZSA9IChkYXR1bSkgPT4ge1xuICAgIGlmIChkYXR1bSA8IDAuMikge1xuICAgICAgcmV0dXJuIFwiQmxlYWtcIlxuICAgIH0gZWxzZSBpZiAoZGF0dW0gPCAwLjQpIHtcbiAgICAgIHJldHVybiBcIk1lbGFuY2hvbGljXCJcbiAgICB9IGVsc2UgaWYgKGRhdHVtIDwgMC42KSB7XG4gICAgICByZXR1cm4gXCJTZXJlbmVcIiBcbiAgICB9IGVsc2UgaWYgKGRhdHVtIDwgMC44KSB7XG4gICAgICByZXR1cm4gXCJIYXBweVwiXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBcIkV1cGhvcmljXCJcbiAgICB9O307XG5cbiAgICBleHBvcnQgZGVmYXVsdCBkYXRhSW50ZXJwcmV0YXRpb247IiwiY29uc3QgZGF0YVJlc2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIGQzLnNlbGVjdChcIiNtYWluLWNvbnRhaW5lclwiKS5zZWxlY3RBbGwoXCIqXCIpLnJlbW92ZSgpO1xuICAgIGxldCBpbWcgPSAkKCc8ZGl2IGlkPVwidHJhY2staW1hZ2VcIj48L2Rpdj4nKTtcbiAgICBpbWcuYXBwZW5kVG8oXCIjbWFpbi1jb250YWluZXJcIik7XG4gICAgbGV0IGdlbnJlID0gJCgnPGRpdiBpZD1cImdlbnJlLWNsb3VkXCI+PC9kaXY+Jyk7XG4gICAgZ2VucmUuYXBwZW5kVG8oXCIjbWFpbi1jb250YWluZXJcIik7XG4gICAgbGV0IGRhdGEgPSAkKCc8ZGl2IGlkPVwiZGF0YS1iYXJzXCI+PC9kaXY+Jyk7XG4gICAgZGF0YS5hcHBlbmRUbyhcIiNtYWluLWNvbnRhaW5lclwiKVxufVxuXG5leHBvcnQgZGVmYXVsdCBkYXRhUmVzZXQiLCJpbXBvcnQgZDNGdW5jdGlvbiBmcm9tICcuL2QzRnVuY3Rpb24nO1xuaW1wb3J0IGRhdGFSZXNldCBmcm9tICcuL3Jlc2V0Jztcblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJET01Db250ZW50TG9hZGVkXCIsICgpID0+IHtcbmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic2VhcmNoYnV0dG9uXCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJjbGlja1wiLCAoKSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKVxuICAgIGRhdGFSZXNldCgpO1xuICAgIGQzRnVuY3Rpb24oZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJzZWFyY2hcIikudmFsdWUpO1xufSk7XG59KTsiLCIvLyBleHRyYWN0ZWQgYnkgbWluaS1jc3MtZXh0cmFjdC1wbHVnaW4iXSwic291cmNlUm9vdCI6IiJ9