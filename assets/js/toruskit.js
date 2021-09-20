(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.TORUS = {}));
}(this, (function (exports) { 'use strict';

  /**
   * ------------------------------------------------------------------------
   * Global namespace
   * ------------------------------------------------------------------------
   */

  var TORUS = TORUS || {};

  /**
   * ------------------------------------------------------------------------
   * Predefined CSS properties. Example: `[data-tor="bg-opacity()"]`
   * ------------------------------------------------------------------------
   */

  const CSS_PREDEFINED_PROPERTIES = [
    "bg",
    "bg-opacity",
    "bg-lighten",
    "bg-darken",
    "bg-brightness",
    "block",
    "border",
    "border-opacity",
    "blur",
    "blur.to",
    "blur.from",
    "mask",
    "push.up",
    "push.down",
    "push.left",
    "push.right",
    "pull.up",
    "pull.left",
    "pull.right",
    "pull.down",
    "fade.in",
    "fade.out",
    "fade.to",
    "fade.from",
    "opacity",
    "reveal",
    "reveal.hide",
    "rotate.to",
    "rotate.from",
    "rotateX.to",
    "rotateX.from",
    "rotateY.to",
    "rotateY.from",
    "scale.to",
    "scale.from",
    "scaleX.to",
    "scaleX.from",
    "scaleY.to",
    "scaleY.from",
    "shadow",
    "shadow-offset.down",
    "shadow-offset.up",
    "shadow-offset.left",
    "shadow-offset.right",
    "shadow-intensity",
    "skew.to",
    "skew.from",
    "skewX.to",
    "skewX.from",
    "skewY.to",
    "skewY.from",
    "text",
    "text-opacity",
    "delay",
    "duration",
    "top",
    "bottom",
    "up",
    "down",
    "left",
    "right",
    "shift.up",
    "shift.right",
    "shift.down",
    "shift.left",
    "originX",
    "originY",
    "wait",
  ];

  /**
   * ------------------------------------------------------------------------
   * Differents
   * ------------------------------------------------------------------------
   */

  const CSS_DIFFERENTS = {
    activeValue: {
      "block": "var(--tor-block);",
      "fade.in": "0;",
      "fade.out": "0;",
      "mask": "var(--tor-mask-idle);",
      "block": "var(--tor-block-idle);",
      "reveal": "var(--tor-reveal-idle);",
      "reveal.hide": "var(--tor-reveal-idle);",
    },
    additionalRules: {
      "block": "--tor-block-scale: var(--tor-block-scale-idle); --tor-clip-delay: calc(var(--tor-duration-all) + var(--tor-delay-all, 0ms)); --tor-block-delay: var(--tor-delay-all, 0ms); --tor-block: var(--tor-block-idle);",
      "reveal": "--tor-translateX: var(--tor-translateX-idle); --tor-translateY: var(--tor-translateY-idle);",
      "reveal.hide": "--tor-translateX: var(--tor-translateX-idle); --tor-translateY: var(--tor-translateY-idle);",
    },
    alias: {
      "blur*": "blur",
      "push*": "push-pull",
      "pull*": "push-pull",
      "shadow-offset*": "shadow-offset",
    },
    calc: {
      "push.up": -1,
      "push.left": -1,
      "pull.down": -1,
      "pull.right": -1,
      "shadow-offset.up": -1,
      "shadow-offset.left": -1,
      "shift.up": -1,
      "shift.left": -1,
    },
    propertyAlias: {
      "bg": "background-color",
      "bg-lighten": "--tor-bg-lightness",
      "bg-darken": "--tor-bg-lightness",
      "bg-brightness": "--tor-bg-lightness",
      "border": "border-color",
      "push.up": "--tor-translateY",
      "push.down": "--tor-translateY",
      "push.left": "--tor-translateX",
      "push.right": "--tor-translateX",
      "pull.up": "--tor-translateY",
      "pull.down": "--tor-translateY",
      "pull.left": "--tor-translateX",
      "pull.right": "--tor-translateX",
      "fade*": "--tor-opacity",
      "shadow": "box-shadow",
      "shadow-offset.down": "--tor-shadow-offsetY",
      "shadow-offset.up": "--tor-shadow-offsetY",
      "shadow-offset.left": "--tor-shadow-offsetX",
      "shadow-offset.right": "--tor-shadow-offsetX",
      "text": "color",
      "shift.up": "--tor-shiftY",
      "shift.down": "--tor-shiftY",
      "shift.left": "--tor-shiftX",
      "shift.right": "--tor-shiftX",
    },
    cssNot: [
      "blur.from",
      "block",
      "pull*",
      "mask",
      "fade.in",
      "reveal",
      "rotate.from",
      "rotateX.from",
      "rotateY.from",
      "scale.from",
      "scaleX.from",
      "scaleY.from",
      "skew.from",
      "skewX.from",
      "skewY.from",
    ],
    percentage: [
      "bg-opacity",
      "bg-brightness",
      "fade.to",
      "fade.from",
      "opacity",
      "scale*",
      "scaleX*",
      "scaleY*",
      "text-opacity",
    ],
  };

  /**
   * ------------------------------------------------------------------------
   * Create object from `CSS_PREDEFINED_PROPERTIES`, compare with `CSS_DIFFERENTS`
   * and return the new object
   * ------------------------------------------------------------------------
   */

  const createPredefinedCSSObject = () => {
    const cssProperties = {};

    for (const propertyName of CSS_PREDEFINED_PROPERTIES) {
      cssProperties[propertyName] = {};

      /** If property has `.` dot, extract everything before. Example: `fade.out` */
      let exec = /^(.*?)\./.exec(propertyName);
      /** Assign extracted `exec` or default `property` */
      let item = exec ? exec[1] : propertyName;
      /** Add to object */
      cssProperties[propertyName].propertyAlias = `--tor-${item}`;

      addToPredefinedObject("propertyAlias", propertyName);
      addToPredefinedObject("activeValue", propertyName);
      addToPredefinedObject("additionalRules", propertyName);
      addToPredefinedObject("alias", propertyName);
      addToPredefinedObject("calc", propertyName);
      addToPredefinedObject("percentage", propertyName);
      addToPredefinedObject("cssNot", propertyName);
    }

    function addToPredefinedObject(object, propertyName) {
      let isArray = CSS_DIFFERENTS[object] instanceof Array ? true : false;

      for (const [key, value] of Object.entries(CSS_DIFFERENTS[object])) {
        let itemKey = isArray ? value : key;
        let itemValue = isArray ? true : value;

        /** If CSS_DIFFERENTS definition contains a `*` wildcard */
        if (/\*/g.test(itemKey)) {
          let matchKey = /^(.*?)\*/.exec(itemKey)[1];
          let matchName = /^(.*?)\./.exec(propertyName);

          if (matchName && matchKey === matchName[1]) {
            cssProperties[propertyName][object] = itemValue;
          }
        } else if (itemKey === propertyName) {
          cssProperties[propertyName][object] = itemValue;
        }
      }
    }

    return cssProperties;
  };

  /**
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   * WINDOW object
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   */

  const WINDOW = {
    computedStyle: window.getComputedStyle(document.documentElement, null),
    height: window.innerHeight || document.documentElement.clientHeight,
    width: window.innerWidth || document.documentElement.clientWidth,
    resolution: {},
    resizing: false,
    scroll: {
      running: false,
      tick: 0,
    },
    mouse: {
      running: false,
      tick: 0,
    },
    idleCallback: window.requestIdleCallback ? true : false,
    isUnsupportedSVG: !!window.chrome || /AppleWebKit/i.test(navigator.userAgent),
    isSafari: /AppleWebKit/i.test(navigator.userAgent),
  };

  // console.log(/AppleWebKit/i.test(navigator.userAgent));

  /**
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   * UTILITIES
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Get current resolution
   * ------------------------------------------------------------------------
   */

  const getCurrentResolution = () => {
    for (const [name, value] of Object.entries(CSS_BREAKPOINTS)) {
      if (WINDOW.width >= value.value) {
        WINDOW.resolution.name = name;
        WINDOW.resolution.value = value.value;
        break;
      }
    }
  };

  /**
   * ------------------------------------------------------------------------
   * Create iterable elements from given parameter
   * ------------------------------------------------------------------------
   */

  const getIterableElement = (elements) => {
    if (typeof elements === "string") {
      elements = [...document.querySelectorAll(elements)];
    }

    if (elements instanceof Node) {
      elements = [elements];
    }

    if (elements instanceof NodeList) {
      elements = [].slice.call(elements);
    }

    if (elements instanceof Set) {
      elements = [...elements];
    }

    if (!elements.length) {
      return;
    }

    if (elements.length) {
      return elements;
    }
    else {
      return false;
    }
  };

  /**
   * ------------------------------------------------------------------------
   * Initialize Class
   * ------------------------------------------------------------------------
   */

  const initClass = (params) => {
    if (!params.elements) return;

    for (const element of params.elements) {
      if (!element.TORUS) {
        element.TORUS = element.TORUS || {};
      }
      element.TORUS[params.name] = new TORUS[params.name](element, params.options);
    }
  };

  /**
   * ------------------------------------------------------------------------
   * Replace all with regex
   * ------------------------------------------------------------------------
   */

   String.prototype.replaceAll = function (value) {
    var replacedString = this;
    for (let x in value) {
      replacedString = replacedString.replace(new RegExp(x, "g"), value[x]);
    }
    return replacedString;
  };

  /**
   * ------------------------------------------------------------------------
   * Optimize given attributes
   * ------------------------------------------------------------------------
   */

  const optimizeAttribute = (attribute, shortcuts) => {
    if (!attribute) {
      return "";
    }

    /**
     * Find `@parallax` and `@tilt` shortcuts
     */

    if (shortcuts) {
      shortcuts = attribute.match(/(scroll|mouse|mouseX|mouseY|sensorX|sensorY)(.*?):(.*?)(@parallax|@tilt)\(.*?\)/g);

      if (shortcuts) {
        for (const shortcut of shortcuts) {
          let replace = /@(.*?)\)/.exec(shortcut)[0];
          let value = /\((.*?)\)/.exec(replace)[1];
          let transforms = {
            "@parallax": {
              name: "translate",
              method: "continuous",
              unit: "px",
              events: {
                mouseX: "X",
                mouseY: "Y",
                scroll: "Y",
              },
            },
            "@tilt": {
              name: "rotate",
              method: "self-continuous",
              unit: "deg",
              events: {
                mouseX: "Y",
                mouseY: "X",
              },
            },
          };

          for (const [type, values] of Object.entries(transforms)) {
            for (let [event, axis] of Object.entries(values.events)) {
              let test = new RegExp(`${event}(.*?)${type}`);

              /** Only one direction: `mouseX, mouseY, scroll` */
              if (test.test(shortcut)) {
                let symbol = (type === "@tilt" && event === "mouseY") ? "" : "-";
                attribute = attribute.replace(replace, `@T=${values.name}${axis}(${symbol}${value}${values.unit};0${values.unit},{method:${values.method}})`);
              }
              else { /** Two directions: `mouse` */
                test = new RegExp("mouse");

                if (test.test(shortcut)) {
                  let arr = [];
                  let re = new RegExp(`(mouse)(.*?)(${replace.replace(/\(/g, "\\(").replace(/\)/g, "\\)")})`, "g");
                  let exec = re.exec(shortcut);

                  for (const [event, axis] of Object.entries(values.events)) {
                    let symbol = (type === "@tilt" && event === "mouseY") ? "" : "-";
                    arr.push(exec[1].replace(exec[1], event) + exec[2] + `@T=${values.name}${axis}(${symbol}${value}${values.unit};0${values.unit}, {method:${values.method}})`);
                  }
                  attribute = attribute.replace(shortcut, arr.join(" "));
                }
              }

            }
          }
        }
      }
    }

    /**
     * Optimize
     */

    let optimized = removeSpaces (
      attribute
        .replace(/\s\s+/g, " ")
        .replace(/ $/g, ""),
        // .replace(/ xs::| sm::| md::| lg::| xl::| xxl::/g, match => match.replace(" ", "⠀"))
        // .replace(/::+/g, "："),
      "\\[ | \\]|{ | }| { | : |: | :| ; |; | ;| ,|, | , |\\( | \\)|\\(\\( | \\(\\(| \\(\\( | \\)\\)| =>|=> | => | \\+| \\+ |\\+ | ~| ~ |~ | \\(")
      .replace(/\((.*?)\)+/g, match => match.replace(/ +/g, "░"))
      .replace(/\\/g, "")
      .replace(/@T=/g, "@transform=")
      .replace(/@F=/g, "@filter=")
      .trim();

    return optimized;
  };

  /**
   * ------------------------------------------------------------------------
   * Get resolution and value from
   * ------------------------------------------------------------------------
   */

  const getResolution = (value) => {
    let resolution = null;
    value = value;

    if (/(xs|sm|md|lg|xl|xxl)::/g.test(value)) {
      let split = value.split("::");
      resolution = split[0];
      value = split[1];
    }

    return {
      resolution,
      value,
    };
  };

  /**
   * ------------------------------------------------------------------------
   * Get data from such as `value`, `unit`...
   * ------------------------------------------------------------------------
   */

  const getValueData = (value) => {
    let unit = null;

    // if (!/^@/.test(value) && /^(-|\+|\/\+|\/-|\/~|)\d/g.test(value) && !Number(value)) {
    if (!/^@/.test(value) && /^(-|\+|\/\+|\/-|\/~|\.|.*?)\d/g.test(value) && !Number(value)) {
      let unitMatch = /(?!\d)(px|deg|%|cm|mm|in|pt|pc|em|ex|ch|rem|vw|vh|vmin|vmax|ms|s)+/g.exec(value.replace(/\/+/g, ""));
      if (unitMatch) {
        unit = unitMatch[1];
        value = value.replace(unit, "");
      }
    }

    value = parseValue(value);

    return {
      value,
      unit,
    };
  };

  /**
   * ------------------------------------------------------------------------
   * Helper function that returns CSS `var(--tor-*)` property
   * ------------------------------------------------------------------------
   */

  const getCSSVariable = (params) => {
    let property = params.property;
    let value = params.value;
    let unit = params.unit ? params.unit : "";
    let wrap = params.wrap;

    let CSSVariable;
    let tempProperty;

    /** If value is from predefined ones */
    if (CSS_PREDEFINED_VARIABLES.includes(value)) {
      /** If there is alias for property. Example `push.up` has `push` alias */
      if (CSS_PROPERTIES[property] && CSS_PROPERTIES[property].alias) {
        tempProperty = CSS_PROPERTIES[property].alias ? CSS_PROPERTIES[property].alias : property;
      }
      else {
        tempProperty = property;
      }

      /** Check for `calc`. Some properties needs to be calculated in reversed direction. Example: `push.up` has `calc: -1` */
      if (CSS_PROPERTIES[property] && CSS_PROPERTIES[property].calc) {
        CSSVariable = `calc(var(--tor-${tempProperty}-${value}) * ${CSS_PROPERTIES[property].calc})`;
      }
      else {
        CSSVariable = `var(--tor-${tempProperty}-${value})`;
      }
    }
    /** It's a custom value */
    else {
      if (CSS_PROPERTIES[property] && CSS_PROPERTIES[property].calc) {
        CSSVariable = `${value * CSS_PROPERTIES[property].calc}${unit}`;
      }
      else {
        CSSVariable = wrap ? `${wrap}(${value}${unit})` : `${value}${unit}`;
      }
    }

    /** If has active value, that has to be added immediately. Example: `fade.in` has `activeValue = 0` (opacity: 0) */
    if (CSS_PROPERTIES[property] && CSS_PROPERTIES[property].activeValue) {
      CSSVariable = CSS_PROPERTIES[property].activeValue;
    }

    return CSSVariable;
  };

  /**
   * ------------------------------------------------------------------------
   * Expand cluster defined by `[]`
   * Example: active:[opacity(50%) bg(red)] -> active:opacity(50%) active:bg(red)
   * ------------------------------------------------------------------------
   */

  const expandCluster = (attributes) => {
    let matches = attributes.match(/\b([^\s]+)\[(.*?)\]/g);

    if (matches) {
      /** Loop trough all matches */
      for (let match of matches) {
        let attributesArray = [];
        let original = match;

        /** Extract options defined by `{<options>}` */
        // let options = /,{(?:.(?!,{))+(?=\])$/g.exec(match);
        let options = /,{(?:.(?!,{))+}(?=\])/g.exec(match);

        if (options) {
          match = match.replace(options[0], "");
          options = /,{(.*?)}/.exec(options[0])[1];
        }

        /** Extract trigger defined by `trigger-name` and colon `:` */
        let trigger = /^(.*?)\:/.exec(match)[1];

        /** Extract everything between curly brackets `{}` and split by the space */
        let contents = /\[(.*?)\]+/g.exec(match)[1].split(" ");

        /** Combine every single content (attribute) with its trigger */
        for (let content of contents) {
          /** If has priority defined by `!` */
          if (/^!/.test(content)) {
            attributesArray.push(`!${trigger}:${getContent(options, content.replace("!", ""))}`);
            // console.log(`!${trigger}:${getContent(options, content.replace("!", ""))}`);
          }
          else {
            attributesArray.push(`${trigger}:${getContent(options, content)}`);
          }
        }

        /** Replace original attribute cluster with separated attributes */
        attributes = attributes.replace(original, attributesArray.join(" "));
      }
    }

    function getContent(options, content) {
      if (options) {
        if (/}\)/.test(content)) {
          content = content.replace("})", `,${options}})`);
        } else {
          content = content.replace(")", `,{${options}})`);
        }
      }
      return content;
    }

    return attributes;
  };

  /**
   * ------------------------------------------------------------------------
   * Parse value. string/integer/float
   * ------------------------------------------------------------------------
   */

  const parseValue = (value) => {
    /** Check if number is float */
    if (/(^(\d.*?)|^()|^(-\d.*?))\.(\d)+/g.test(value)) {
      value = parseFloat(/((-|\+|)[0-9]*[.])?[0-9]+/g.exec(value)[0]);
    }
    /** Number is integer */
    else if (/^[-+]?\d+$/.test(value)) {
      value = parseInt(/[+-]?(\d)+/g.exec(value)[0]);
    }
    /** Number is string (or contains number with non-number character) */
    else {
      value = value;
    }

    return value;
  };

  /**
   * ------------------------------------------------------------------------
   * Remove unnecessary spaces and unify them, remove tabs, etc
   * ------------------------------------------------------------------------
   */

  const removeSpaces = (string, replacement) => {
    let oldString = string;
    let newString, re, replacedPattern;

    for (const pattern of replacement.split("|")) {
      replacedPattern = pattern.replace(/ /g, "");
      re = new RegExp(pattern, "g");
      newString = oldString.replace(re, replacedPattern);
      oldString = newString.replace(/\\+/g, "");
    }

    return newString;
  };

  /**
   * ------------------------------------------------------------------------
   * Join all values in CSS_SET and add to CSS_SET.styles
   * ------------------------------------------------------------------------
   */

  // TODO: Add CSS only on corresponding media - remove/add on resize

  const addStylesheet = () => {
    for (const [breakpoint, set] of Object.entries(CSS_SET.breakpoints)) {
      if (set.size) {
        CSS_SET.styles.add(`@media (min-width: ${CSS_BREAKPOINTS[breakpoint].value}${CSS_BREAKPOINTS[breakpoint].unit}) { ${[...set].join(" ")} }`);
      }
    }
  };

  /**
   * ------------------------------------------------------------------------
   * Calculate percents based on mouse move
   * ------------------------------------------------------------------------
   */

  /**
   *
   * @param {object} _this Object contains element bounds
   * @param {string} origin Origin for mouse position calculation
   * @returns {number}
   */

  const getPercents = (_this, params) => {
    let percents = {};

    switch (params.event) {
      /**
       * Mouse
       */
      case "mouse": {
        switch (params.options.method) {
          case "middle": {
            percents = {
              x: 1 - Math.abs((WINDOW.width / 2 - WINDOW.mouse.x) / (WINDOW.width / 2)),
              y: (1 - Math.abs((WINDOW.height / 2 - WINDOW.mouse.y) / (WINDOW.height / 2))),
              all: (1 - Math.sqrt(Math.pow(WINDOW.width / 2 - WINDOW.mouse.x, 2) + Math.pow(WINDOW.height / 2 - WINDOW.mouse.y, 2)) / Math.sqrt(Math.pow(WINDOW.width / 2, 2) + Math.pow(WINDOW.height / 2, 2))),
            };
            break;
          }
          case "continuous": {
            percents = {
              x: (1 - (WINDOW.width / 2 - WINDOW.mouse.x) / (WINDOW.width / 2)),
              y: (1 - (WINDOW.height / 2 - WINDOW.mouse.y) / (WINDOW.height / 2)),
            };
            break;
          }
          case "self": {
            percents = {
              x: _this && 1 - Math.abs((WINDOW.mouse.x - _this.bounds.centerX) / _this.bounds.maxXSide),
              y: _this && 1 - Math.abs((WINDOW.mouse.y - _this.bounds.centerY) / _this.bounds.maxYSide),
              all: _this && (getMouseHoverPosition(_this, _this.bounds.centerX, _this.bounds.centerY))
            };
            break;
          }
          case "self-continuous": {
            percents = {
              x: _this && 1 + ((WINDOW.mouse.x - _this.bounds.centerX) / _this.bounds.maxXSide),
              y: _this && 1 + ((WINDOW.mouse.y - _this.bounds.centerY) / _this.bounds.maxYSide),
              // all:  _this && (getMouseHoverPosition(_this, _this.bounds.centerX/_this.bounds.maxXSide, _this.bounds.centerY/_this.bounds.maxYSide))
            };
            break;
          }
          case "parallax": {
            percents = {
              x: ((WINDOW.mouse.x - WINDOW.width / 2) / (WINDOW.width / 2)),
              y: ((WINDOW.mouse.y - WINDOW.height / 2) / (WINDOW.height / 2))
            };
            break;
          }
        }
        break;
      }
      /**
       * Scroll
       */
      case "scroll": {
        let start;
        let end;
        let x;
        let y;
        let shiftStart = 0;
        let shiftEnd = 0;

        let optionsEnd = params.options.end;
        let optionsStart = params.options.start;

        if (optionsEnd === "middle") {
          shiftEnd = _this.bounds.height / 2;
          optionsEnd = 50;
        }
        if (optionsStart === "shifted") {
          optionsStart = 0;
          shiftStart = _this.bounds.height / 2;
          shiftEnd = 0;
        }

        start = (WINDOW.height / 100) * optionsStart + shiftStart;
        end = ((WINDOW.height / 100) * (optionsEnd - optionsStart)) + shiftEnd;

        x = null;
        y = (WINDOW.height + WINDOW.scroll.y - _this.bounds.offsetTop - start) / end;

        // console.log(WINDOW.height, WINDOW.scroll.y, _this.bounds.offsetTop);

        // let usingOffsetAmount = (end || start) ? true : false;
        // // let usingScrollAmount = (afterScrolledStart || afterScrolledEnd) ? true : false;
        // let usingScrollAmount = false;

        // if (usingScrollAmount) {
        //   if (!afterScrolledStart) {
        //     afterEnd = afterScrolledEnd;
        //   } else {
        //     afterStart = afterScrolledEnd;
        //     afterEnd = afterScrolledStart;
        //   }

        //   if (afterScrolledStart && afterScrolledEnd) {
        //     afterScrollDifference = afterScrolledEnd - afterScrolledStart;
        //   }
        // }

        // let _x = null;
        // let _y = (-0.0001 + WINDOW.height - (_this.bounds.offsetTop - WINDOW.scroll.y + offsetA)) / (((WINDOW.height + (end === "middle" ? _this.bounds.height : 0)) / 100) * ((end === "middle" ? 49.99 : end) - offsetB));

        switch (params.options.method) {
          case "continuous": {
            percents = {
              x: x,
              y: y,
            };
            break;
          }

          case "regular": {
            // if (usingOffsetAmount) {
              percents = {
                x: x,
                y: Math.min(1, Math.max(0, y)),
              };
            // }
            // if (usingScrollAmount) {
            //   percents = {
            //     x: _x,
            //     y: (WINDOW.scroll.y - afterEnd) / (afterScrollDifference || (WINDOW.height / 2)),
            //   }
            // }
            break;
          }
        }
        break;
      }
    }

    return {
      x: Math.round(percents.x * 1000) / 1000,
      y: Math.round(percents.y * 1000) / 1000,
      all: Math.round(percents.all * 1000) / 1000,
    };
  };

  /**
   * ------------------------------------------------------------------------
   * Calculate the longest distance from element center to one of the screen corners
   * ------------------------------------------------------------------------
   */

  const getMaxSide = (_this) => {
    let lt = Math.sqrt(Math.pow(_this.bounds.centerX, 2) + Math.pow(_this.bounds.centerY, 2));
    let lb = Math.sqrt(Math.pow(_this.bounds.centerX, 2) + Math.pow(WINDOW.height - _this.bounds.centerY, 2));
    let rt = Math.sqrt(Math.pow(WINDOW.width - _this.bounds.centerX, 2) + Math.pow(_this.bounds.centerY, 2));
    let rb = Math.sqrt((Math.pow(WINDOW.width - _this.bounds.centerX, 2) + Math.pow(WINDOW.height - _this.bounds.centerY, 2)));
    let ls = _this.bounds.centerX;
    let rs = WINDOW.width - _this.bounds.centerX;
    let ts = _this.bounds.centerY;
    let bs = WINDOW.height - _this.bounds.centerY;
    let corner = Math.max(...[lt, lb, rt, rb]);
    let xSide = Math.max(...[ls, rs]);
    let ySide = Math.max(...[ts, bs]);

    return { corner, xSide, ySide };
  };

  /**
   * ------------------------------------------------------------------------
   * Get the shortest distance from given centerX, centerY to mouse pointer
   * ------------------------------------------------------------------------
   */

  const getMouseHoverPosition = (_this, centerX, centerY) => {
    return 1 - Math.abs(Math.sqrt(Math.pow(Math.abs(centerX - WINDOW.mouse.x), 2) + Math.pow(Math.abs(centerY - WINDOW.mouse.y), 2)) / _this.bounds.maxDiagonal);
  };

  /**
   * ------------------------------------------------------------------------
   * Get scroll values
   * ------------------------------------------------------------------------
   */

  const getWindowScroll = () => {
    WINDOW.scroll.y = window.scrollY;
    WINDOW.scroll.x = window.scrollX;
  };

  /**
   * ------------------------------------------------------------------------
   * Run on browser idle
   * ------------------------------------------------------------------------
   */

  const onIdle = (entry, svgRect, parentRect) => {
    let target = svgRect ? entry : entry.target;
    let rect = svgRect ? svgRect : entry.boundingClientRect;

    if (WINDOW.idleCallback) {
      requestIdleCallback(() => {
        bounds();
      });
    } else {
      requestAnimationFrame(() => {
        setTimeout(() => {
          bounds();
          // (entry.target.TORUS && entry.target.TORUS.Main) && entry.target.TORUS.Main.set.bounds(entry.boundingClientRect);
        }, 0);
      });
    }

    function bounds() {
      if (target.TORUS && target.TORUS.Main) {
        if (svgRect) {
          target.TORUS.Main.set.bounds(rect, parentRect);
        } else {
          target.TORUS.Main.set.bounds(rect);
        }
      }
    }
  };

  /**
   * ------------------------------------------------------------------------
   * Return counting value
   * ------------------------------------------------------------------------
   */

  const getCounting = (count, value) => {
    value = value.replace(/\//g, "");

    /** Beginning value - defines the starting value of counting */
    let begin = /(.).*?(?=\+|-|~)/.exec(value);
    if (begin) {
      value = value.replace(begin[0], "");
      begin = getValueData(begin[0]).value;
    }

    let symbol = /\+|-|~/.exec(value);
    if (symbol) {
      symbol = symbol[0];
      value = value.replace(symbol, "");
    }

    let countValue = getValueData(value).value;
    let countUnit = getValueData(value).unit;

    switch (symbol) {
      case "+":
        count = count;
        break;

      case "-":
        count = -count;
        break;

      case "~":
        count = 1;
        countValue = (Math.round(Math.random() * (countValue - 0) + 0));
        break;
    }


    return `${begin + (count * countValue)}${countUnit ? countUnit : ""}`;
  };

  /**
   * ------------------------------------------------------------------------
   * Call given function in TORUS element
   * ------------------------------------------------------------------------
   */

  const callFunction = (params) => {
    if (!params.elements) return;

    for (const element of getIterableElement(params.elements)) {
      if (element.TORUS && element.TORUS[params.object]) {
        element.TORUS[params.object][params.fn](params.argument);
      }
    }
  };

  /**
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   * GLOBALS
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Generated predefined CSS variables
   * ------------------------------------------------------------------------
   */

  const CSS_PREDEFINED_VARIABLES = WINDOW.computedStyle.getPropertyValue("--tor-predefined-values").trim().split(",");

  /**
   * ------------------------------------------------------------------------
   * Breakpoints names with their resolutions
   * ------------------------------------------------------------------------
   */

  const CSS_BREAKPOINTS = {};
  const cssBreakpoints = WINDOW.computedStyle.getPropertyValue("--tor-resolutions").replace(/"| +/g, "").split(",");
  let cssBreakpointsLength = cssBreakpoints.length - 1;

  for (const breakpoint of cssBreakpoints) {
    let split = breakpoint.split(":");
    let data = getValueData(split[1]);

    CSS_BREAKPOINTS[split[0]] = {};
    CSS_BREAKPOINTS[split[0]].value = data.value;
    CSS_BREAKPOINTS[split[0]].unit = data.unit;
    CSS_BREAKPOINTS[split[0]].id = cssBreakpointsLength--;
  }

  getCurrentResolution();

  /**
   * ------------------------------------------------------------------------
   * Trigger aliases used to defined a CSS rule
   * ------------------------------------------------------------------------
   */

  const CSS_TRIGGER_ALIAS = {
    inview: ".inview",
    active: ".active",
    show: ".show",
    hover: ":hover",
    focus: ":focus",
  };

  /**
   * ------------------------------------------------------------------------
   * Property alias for default CSS rule definition
   * ------------------------------------------------------------------------
   */

  const CSS_PROPERTIES = createPredefinedCSSObject();

  /**
   * ------------------------------------------------------------------------
   * Create <style> element
   * ------------------------------------------------------------------------
   */

  const STYLE = document.createElement("style");


  /**
   * ------------------------------------------------------------------------
   * Individual attribute properties
   * ------------------------------------------------------------------------
   */

  const ATTRIBUTE_SEGMENTS = {
    priority: {
      indexReplace: 0,
      indexValue: 0,
      regex: /^!(.*?)/,
    },
    trigger: {
      indexReplace: 0,
      indexValue: 0,
      regex: /^((?:.)(?:(?!::)))*?:/,
      // regex: /^((?:(?!\().)(?:(?!::)))*?:/,
      // regex: /^(?:(?!\().)*?:/,
      // indexValue: 2,
      // regex: /^(!|)(.*?):/,
    },
    resolution: {
      indexReplace: 0,
      indexValue: 2,
      regex: /^(<|=|)(xs|sm|md|lg|xl|xxl)(.*?)::/,
      // regex: /(<|=|)(xs|sm|md|lg|xl|xxl)(.*?)::/,
    },
    property: {
      indexReplace: 1,
      indexValue: 1,
      regex: /^(?:@|)(.*?)(\(|$)/,
      // regex: /^(.*?)(\(|$)/,
    },
    values: {
      indexReplace: 0,
      indexValue: 1,
      regex: /^\((.*?)\)$/,
      // regex: /\((.*?)\)$/,
    },
  };

  /**
   * ------------------------------------------------------------------------
   * Properties object
   * ------------------------------------------------------------------------
   */

  const createPropertiesObject = (_this, array, group) => {
    let temp = {};
    _this.attributes[group] = _this.attributes[group] || {};

    /**
     * Sort attributes by their <group> and <trigger>
     */

    for (const item of array) {
      // let trigger = /^(.*?)(?=:)/g.exec(item);
      let triggerGroup;
      let trigger = /^((?:.)(?:(?!::)))*?(?=:)/g.exec(item);
      _this.attributes[group] = _this.attributes[group] || {};

      if (trigger) {
        trigger = trigger[0].replace("!", "");
        temp[group] = temp[group] || {};

        if (/^(mouse|scroll|sensor)/.test(trigger)) {
          triggerGroup = /^.*?(?=(X|Y))/.exec(trigger);
          triggerGroup = triggerGroup ? triggerGroup[0] : trigger;

          _this.attributes[group][triggerGroup] = _this.attributes[group][triggerGroup] || {};
          _this.attributes[group][triggerGroup][trigger] = _this.attributes[group][triggerGroup][trigger] || {};

          temp[group][triggerGroup] = temp[group][triggerGroup] || {};
          temp[group][triggerGroup][trigger] = temp[group][triggerGroup][trigger] || [];
          temp[group][triggerGroup][trigger].push(item);
        } else {
          _this.attributes[group][trigger] = _this.attributes[group][trigger] || {};

          temp[group][trigger] = temp[group][trigger] || [];
          temp[group][trigger].push(item);
        }
      } else {
        _this.attributes[group].idle = _this.attributes[group].idle || {};
        temp[group] = temp[group] || {};
        temp[group].idle = temp[group].idle || [];
        temp[group].idle.push(item);
      }
    }

    /**
     * Call the `createSegment` function in loop
     */

    for (const [group, object] of Object.entries(temp)) {
      for (const [trigger, array] of Object.entries(object)) {
        if (/mouse|scroll|sensor/.test(trigger)) {
          for (const [specificTrigger, item] of Object.entries(array)) {
            createSegment(_this, group, trigger, item, specificTrigger);
          }
        } else {
          createSegment(_this, group, trigger, array);
        }
      }
    }

    /**
     * Create segment
     */

    function createSegment(_this, group, trigger, array, specificTrigger) {
      for (const [i, dataAttribute] of Object.entries(array)) {
        let temp = dataAttribute;
        let attribute;
        // let attribute = _this.attributes[group][trigger][i] = {};

        if (specificTrigger) {
          attribute = _this.attributes[group][trigger][specificTrigger][i] = {};
        } else {
          attribute = _this.attributes[group][trigger][i] = {};
        }

        /** Original [data-attribute] */
        attribute.original = dataAttribute;

        /** Check for custom property defined by `@`. Example: `hover:@opacity(0; 0.5)` */
        if (/@/.test(temp)) {
          attribute.isCustom = true;
          temp = temp.replace("@", "");
        }

        /** Loop through all `ATTRIBUTE_SEGMENTS` (priority, trigger, property...) */
        for (let [segmentName, segmentValue] of Object.entries(ATTRIBUTE_SEGMENTS)) {
          let exec = segmentValue.regex.exec(temp);

          if (exec) {
            temp = temp.replace(exec[segmentValue.indexReplace], "");
            createSegmentObject(_this, attribute, exec, segmentName, segmentValue);
          } else {
            createSegmentObject(_this, attribute, exec, `${segmentName}:default`, segmentValue);
          }
        }
      }
    }
  };

  /**
   * ------------------------------------------------------------------------
   * Segments
   * ------------------------------------------------------------------------
   */

  const createSegmentObject = (_this, attribute, exec, segmentName, segmentValue) => {
    switch (segmentName) {
      case "priority":
        attribute.priority = true;
        break;

      case "trigger":
        attribute.trigger = {};
        let temp = exec[segmentValue.indexValue].replace(":", "");

        /** Check for trigger argument. @example: `hover(p):fade.in` */
        let argument = /\((.*?)\)/.exec(temp);

        if (argument) {
          attribute.trigger.name = temp.replace(argument[0], "");
          attribute.trigger.argument = argument[1];

          if (argument[1] === "p") {
            attribute.trigger.argument = "parent";
          }
          if (/^#/.test(argument[1])) {
            TORUS.Parent.init(document.querySelector(argument[1]), { trigger: attribute.trigger.name });
          }
        } else {
          attribute.trigger.name = temp;
        }

        attribute.trigger.alias = CSS_TRIGGER_ALIAS[attribute.trigger.name];

        /** Direction. @example: `mouseX:`. direction = "x" */
        let match = /X$|Y$/i.exec(attribute.trigger.name);
        if (match) {
          attribute.trigger.direction = match[0].toLowerCase();
        } else {
          attribute.trigger.direction = "all";
        }

        if (attribute.trigger.name === "scroll") {
          attribute.trigger.direction = "y";
        }
        break;

      case "resolution":
        attribute.resolution = exec[segmentValue.indexValue];
        break;

      case "property":
        attribute.property = {};
        attribute.property.name = exec[segmentValue.indexValue];

        if (/=/.test(attribute.property.name)) {
          let split = attribute.property.name.split("=");
          attribute.property.cssFunction = split[0];
          attribute.property.name = split[1];
        }

        checkPredefined(_this, attribute);
        break;

      case "values":
        createValues(_this, attribute, exec, segmentValue);

        switch (attribute.property.name) {
          case "offset":
            _this.is.inviewOffset = attribute.values.all.end.value;
            break;
        }
        break;

      case "resolution:default":
        attribute.resolution = "all";
        break;
    }
  };

  /**
   * ------------------------------------------------------------------------
   * Check for predefined properties
   * ------------------------------------------------------------------------
   */

  const checkPredefined = (_this, attribute) => {
    let predefined = CSS_PROPERTIES[attribute.property.name];

    if (predefined) {
      attribute.property.alias = predefined.propertyAlias || "";

      /** If defined, replace the original triggerAlias with `:not(<trigger>)` */
      if (predefined.cssNot && attribute.trigger) {
        attribute.trigger.alias = `:not(${CSS_TRIGGER_ALIAS[attribute.trigger.name]})`;
      }
    } else {
      /** Don't process the attribute, but only if it's not a custom one */
      if (!attribute.isCustom) {
        attribute.noCSSProcess = true;

        switch (attribute.original) {
          case "inview:revert":
            _this.is.inviewRevert = true;
            break;
        }
      }
    }
  };

  /**
   * ------------------------------------------------------------------------
   * Create <values> object
   * ------------------------------------------------------------------------
   */

  const createValues = (_this, attribute, exec, segmentValue) => {
    let valueSplit;
    let optionList;
    let tempValue;
    let valueObject = {};

    attribute.values = {};
    attribute.values.all = attribute.values.all || {};

    if (/\.\.\./.test(attribute.original)) {
      attribute.values.multi = true;
      let cssFunction = /\((.*?)\(/.exec(attribute.original);

      if (cssFunction) {
        attribute.values.cssFunction = cssFunction[1];
      }
    }

    tempValue = exec[segmentValue.indexValue];

    if (/'(.*?)'/.test(tempValue)) {
      let exec = /'(.*?)'/.exec(tempValue);
      tempValue = tempValue.replace(exec[0], exec[0].replace(/,+/g, "|").replace(/'+/g, ""));
    }

    /**
     * <options>
     * If value has options defined by `{}`
     */

    attribute.options = {};

    /** Default options */
    if (attribute.trigger) {
      if (/mouse/.test(attribute.original)) {
        attribute.options.method = "middle";
      }
      if (/scroll(?!(.*?)class)/.test(attribute.original)) {
        attribute.options.start = 0;
        attribute.options.end = "middle";
        attribute.options.method = "regular";
      }
    }

    optionList = /(,{|^{)(.*?)}/.exec(tempValue);

    if (optionList) {
      for (const option of optionList[2].split(",")) {
        let split = option.split(":");
        let optionName = split[0];
        let optionValue = split[1];

        switch (optionName) {
          case "target":
            optionValue = optionValue.replace(/\|+/g, ",");
            attribute.options[optionName] = document.querySelectorAll(optionValue);
            break;

          default:
            let isPredefined = CSS_PREDEFINED_VARIABLES.includes(optionValue);
            if (isPredefined) {
              attribute.options[optionName] = `var(--tor-${optionValue})`;
            } else {
              attribute.options[optionName] = /^--/.test(optionValue) ? `var(${optionValue})` : optionValue;
            }
            break;
        }
      }

      tempValue = tempValue.replace(optionList[0], "");
    }

    /** Check for <start> and <end> values */
    valueSplit = tempValue.split(";");
    valueObject.end = valueSplit[1];

    if (valueObject.end) {
      valueObject.start = checkMultiValues(valueSplit[0]);
      valueObject.end = checkMultiValues(valueSplit[1]);
    } else {
      if (attribute.isCustom) {
        valueObject.start = "0";
      } else {
        valueObject.start = null;
      }
      valueObject.end = valueSplit[0];
    }

    /**
     * <resolutions>
     * Value has resolutions defined by `::`. Example: `hover:scale.to(2 lg::3)`
     */

    for (const type of ["start", "end"]) {
      if (valueObject[type]) {
        if (/(xs|sm|md|lg|xl|xxl)::/g.test(valueObject[type])) {
          for (const value of valueObject[type].split("░")) {
            const GR = getResolution(value);
            let data = checkPercentage(getValueData(GR.value));

            if (GR.resolution) {
              attribute.values[GR.resolution] = attribute.values[GR.resolution] || {};
              addData(GR.resolution, type, data);
            }
            else {
              addData("all", type, data);
            }
          }
        } else {
          /** Value has no resolutions */
          addData("all", type, checkPercentage(getValueData(valueObject[type])) );
        }
      }
    }

    /**
     * Check if it's `class-actions` attribute
     */

    if (/:class./.test(attribute.original)) {
      if (!attribute.options.target) {
        attribute.options.target = _this.element;
      }
    }

    /** Helper function */

    function addData(resolution, type, data) {
      attribute.values[resolution][type] = {};
      attribute.values[resolution].original = tempValue;

      for (const [key, value] of Object.entries({ value: data.value, unit: data.unit })) {
        attribute.values[resolution][type][key] = (value || value === 0) ? value : null;
      }
    }

    /**
    * <percentage>
    * If value has `percentage` flag - the input value is in percents. Example `opacity(50%)` -> opacity: .5
    */

    function checkPercentage(params) {
      let value;
      let unit;

      if (CSS_PROPERTIES[attribute.property.name] && CSS_PROPERTIES[attribute.property.name].percentage) {
        value = params.unit === "%" ? params.value / 100 : params.value;
        unit = null;
      } else {
        value = params.value;
        unit = params.unit;
      }

      return {
        value,
        unit
      };
    }

    /**
     * Check for multi values defined by `...`
     * @param {string} original
     * @returns {object or string}
     */

    function checkMultiValues(original) {
      let temp = original;

      if (/\.\.\./.test(temp)) {
        temp = {};
        original = original.replace("...", "");
        original = attribute.values.cssFunction ? original.replace(attribute.values.cssFunction, "").replace(/\(|\)/g, "") : original;

        for (const [i, value] of Object.entries(original.split(",") ) ) {
          let GVD = getValueData(value);
          temp[i] = {};
          temp[i].value = GVD.value;
          temp[i].unit = GVD.unit;
        }
      }

      return temp;
    }
  };

  /**
   * ------------------------------------------------------------------------
   * Get values
   * ------------------------------------------------------------------------
   */

  const getValuesForCurrentResolution = (attribute, percents, index) => {
    if (!attribute.values) {
      return {
        value: null,
        unit: null,
      };
    }

    let unit;
    let start = 0;
    let end;
    let value;

    for (let i = 0; i <= CSS_BREAKPOINTS[WINDOW.resolution.name].id; i++) {
      let breakpoints = Object.keys(CSS_BREAKPOINTS).find(key => CSS_BREAKPOINTS[key].id === i);
      let available = attribute.values[breakpoints];

      if (available) {
        if (available.start) {
          start = index ? available.start.value[index].value : available.start.value;
        }
        if (available.end) {
          end = index ? available.end.value[index].value : available.end.value;

          if (index) {
            unit = available.end.value[index].unit ? available.end.value[index].unit : "";
          } else {
            unit = available.end.unit ? available.end.unit : "";
          }
        }
      }

      if (typeof start === "string" || typeof end === "string")  {
        value = percents < 1 ? start : end;
      } else {
        value = Math.round((start + ((end - start) * percents)) * 1000) / 1000;
      }
    }

    return {
      value,
      unit,
      start,
      end,
    }
  };

  /**
   * ------------------------------------------------------------------------
   * Wrap element
   * ------------------------------------------------------------------------
   */

  const wrapElement = (elements, wrapper, elementClass) => {
    if(elements instanceof Node) {
      elements = [elements];
    }

    if (wrapper instanceof Object) {
      let newElement = document.createElement("div");
      for (const element of elements) {
        newElement.appendChild(element);
      }

      wrapper.appendChild(newElement);
      elementClass && newElement.classList.add(elementClass);
    }
    else {
      for(let element of elements) {
        let newElement;
        let parentElement;
        let nextElement;

        nextElement = element.nextElementSibling;

        if(wrapper === "svg") {
          newElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
          newElement.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        }
        else {
          newElement = document.createElement(wrapper);
        }

        parentElement = element.parentElement;
        newElement.appendChild(element);
        elementClass && newElement.classList.add(elementClass);
        parentElement.insertBefore(newElement, nextElement);
      }
    }
  };

  /**
   * ------------------------------------------------------------------------
   * Transform string to camel case
   * ------------------------------------------------------------------------
   */

   String.prototype.toCamelCase = function () {
    return this.replace(/[-_]+/g, " ").replace(/ (.)/g, function ($1) { return $1.toUpperCase(); }).replace(/ /g, "");
  };

  /**
   * ------------------------------------------------------------------------
   * Check if SVG element (including <g> element) is in viewport
   * ------------------------------------------------------------------------
   */

  const SVGIntersection = (bounds, method) => {
    let addition = 0;

    if (method === "intersecting") {
      addition = WINDOW.height/2;
    }

    return WINDOW.scroll.y + WINDOW.height + addition >= bounds.offsetTop &&
           WINDOW.scroll.y + WINDOW.height - addition <= bounds.offsetTop + bounds.height + WINDOW.height
  };

  /**
   * ------------------------------------------------------------------------
   * Calculate SVG elements bounds (Chrome only)
   * ------------------------------------------------------------------------
   */

  const SVGBounds = (entry) => {
    if (WINDOW.idleCallback) {
      requestIdleCallback(() => {
        bounds(entry);
      });
    } else {
      requestAnimationFrame(() => {
        setTimeout(() => {
          bounds(entry);
        }, 0);
      });
    }

    function bounds(entry) {
      if (/svg/i.test(entry.target.nodeName)) {
        entry.target.TORUS = entry.target.TORUS || {};
        entry.target.TORUS.svg = entry.target.TORUS.svg || {};

        let rect = entry.boundingClientRect;
        let target = entry.target.TORUS.svg;
        let realWidth = entry.target.width.baseVal.value;
        let viewBoxWidth = entry.target.viewBox.baseVal.width ? entry.target.viewBox.baseVal.width : realWidth;

        target.rect = {
          offsetLeft: rect.left + WINDOW.scroll.x,
          offsetTop: rect.top + WINDOW.scroll.y,
        };

        // console.log(target.rect, rect.top);

        for (const _this of target.children) {
          _this.set.bounds(_this.element.getBBox(), { rect: target.rect, ratio: realWidth / viewBoxWidth });
          _this.set.intersecting(SVGIntersection(_this.bounds, "intersecting"));

          if (_this.is.inviewElement) {
            _this.set.inview(SVGIntersection(_this.bounds, "inview"));
          }
        }
        target.calculated = true;
      }
    }
  };

  /**
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   * SETS
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * CSS
   * ------------------------------------------------------------------------
   */

  const CSS_SET = {};

  CSS_SET.breakpoints = {};
  CSS_SET.styles = new Set();

  for (const breakpoint of Object.keys(CSS_BREAKPOINTS)) {
    CSS_SET.breakpoints[breakpoint] = new Set();
  }

  /**
   * ------------------------------------------------------------------------
   * ELements sets
   * ------------------------------------------------------------------------
   */

  const INVIEW_ELEMENTS = new Set();
  const SCROLL_ELEMENTS = new Set();
  const MOUSE_ELEMENTS = new Set();
  const GROUP_ELEMENTS = new Set();
  const CLASS_SCROLL_ELEMENTS = new Set();
  const SVG_ELEMENTS = new Set();

  /**
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   * OBSERVERS
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   */

  /**
   * ------------------------------------------------------------------------
   * Intersection observer
   * ------------------------------------------------------------------------
   */

  const onIntersect = (entries, observer) => {
    for (const entry of entries) {
      const _this = entry.target.TORUS;

      if(_this) {
        if (_this.Main) {
          /** Calculate the element bounds. Run only once */
          if (!_this.Main.bounds.calculated) {

            /** ScrollY is not undefined */
            if (WINDOW.scroll.y !== undefined) {

              /** Element is intersecting */
              if (!_this.Main.is.svgChild) {
                if (entry.isIntersecting) {
                  /** Set bounds */
                  _this.Main.set.bounds(entry.boundingClientRect);

                  /** Check intersecting */
                  _this.Main.set.intersecting(entry.isIntersecting);

                  /** Check inview */
                  if (_this.Main.is.inviewElement) {
                    _this.Main.run.inview();
                  }
                } else {
                  onIdle(entry);
                }
              }
            }
          }

          if (/ 50%/.test(observer.rootMargin)) {
            if (!_this.Main.is.svgChild) {
              _this.Main.set.intersecting(entry.isIntersecting);
              _this.Main.set.bounds(entry.boundingClientRect);
            }
          }

          if (/ 0%/.test(observer.rootMargin)) {
            _this.Main.set.inview(entry.isIntersecting);
          }
        }

        if (_this.Parent) {
          if (_this.Parent.is.inviewElement) {
            _this.Parent.run.inview();
          }
          if (/ 0%/.test(observer.rootMargin)) {
            _this.Parent.set.inview(entry.isIntersecting);
          }
        }

        /**
         * Slider dimensions
         */

        if (_this.Slider) {
          if (!_this.Slider.bounds.calculated) {
            _this.Slider.set.bounds(entry.boundingClientRect);
          }
        }

        /**
         * Chrome bug
         *
         * `intersectionObserver` doesn't work in Chrome, so we need to get the parent SVG rect
         * and use them on `getIntersectionList` function later
         */

        if (WINDOW.isUnsupportedSVG && _this.svg) {
          SVGBounds(entry);
        }
      }
    }

    if (WINDOW.scroll.y === undefined) {
      for (const entry of entries) {
        onIdle(entry);
      }
    }

  };

  const INTERSECTION_OBSERVER = new IntersectionObserver(onIntersect, {root: null, rootMargin: "50%"});
  const INVIEW_OBSERVER = new IntersectionObserver(onIntersect, {root: null, rootMargin: "0%"});

  /**
   * ------------------------------------------------------------------------
   * Mutation
   * ------------------------------------------------------------------------
   */

  const MUTATION = () => {
    let elements = [];
    let groups = [];

    /** Append new <style> to <head> */
    document.head.appendChild(STYLE);

    const callback = function (mutationsList, observer) {
      for (const mutation of mutationsList) {
        /** When observer find the <script>, then re-run the mutation to prevent the observer from break  */
        if (/script/i.test(mutation.target)) {
          MUTATION();
        } else {
          if (mutation.type === "childList") {
            const element = mutation.addedNodes[0];

            if (element.nodeType === 1) {
              if (element.dataset.tor) {
                elements.push(element);
              }
              if (element.dataset.torGroup) {
                groups.push(element);
              }
            }

          }
        }
      }

      /**
       * Initialize the Group function
       */

      TORUS.Group.init(groups);

      /**
       * Initialize `data-tor-parent`
       */

       TORUS.Parent.init();

      /**
       * Initialize the Main function
       */

      TORUS.Main.init(elements);

      /**
       * Add the CSS rules to <style>
       */

      for (const css of CSS_SET.styles) {
        STYLE.sheet.insertRule(css);
        // console.log(css);
      }

      observer.disconnect();
    };

    const observer = new MutationObserver(callback);

    observer.observe(document, { childList: true, subtree: true });
  };

  /**
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   * LISTENER HANDLERS
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   */

  function ON_RESIZE() {
    let tick = 0;

    if (!WINDOW.resizing) {
      requestAnimationFrame(raf);
      WINDOW.resizing = true;
    }

    function raf() {
      if (tick >= 50) {
        WINDOW.resizing = false;
        cancelAnimationFrame(raf);

        WINDOW.height = window.innerHeight || document.documentElement.clientHeight;
        WINDOW.width = window.innerWidth || document.documentElement.clientWidth;
        getCurrentResolution();

        if (TORUS.Main) {
          INTERSECTION_OBSERVER.disconnect();
          TORUS.Main.refresh();
        }

        if (TORUS.Loop) {
          TORUS.Loop.refresh();
        }

        if (TORUS.Slider) {
          TORUS.Slider.refresh();
        }
      }
      else {
        tick = tick + 1;
        requestAnimationFrame(raf);
      }
    }
  }

  /**
   * ------------------------------------------------------------------------
   * On Scroll
   * ------------------------------------------------------------------------
   */

  const ON_SCROLL = () => {
    let scroll = WINDOW.scroll;

    scroll.tick = 0;
    scroll.y = window.scrollY;
    scroll.x = window.scrollX;

    if (!scroll.running) {
      requestAnimationFrame(ON_RAF);
      scroll.running = true;
    }
  };

  /**
   * ------------------------------------------------------------------------
   * On Mouse
   * ------------------------------------------------------------------------
   */

  const ON_MOUSE = (e) => {
    let mouse = WINDOW.mouse;

    mouse.tick = 0;
    mouse.x = e.clientX;
    mouse.y = e.clientY;

    if (!mouse.running) {
      requestAnimationFrame(ON_RAF);
      mouse.running = true;
    }
  };

  /**
   * ------------------------------------------------------------------------
   * On RequestAnimationFrame
   * ------------------------------------------------------------------------
   */

  const ON_RAF = () => {
    let scrollActive = checkScroll(WINDOW.scroll).running;
    let mouseActive = checkMouse(WINDOW.mouse).running;

    if (mouseActive) {
      for (const _this of MOUSE_ELEMENTS) {
        _this.run.event("mouse");
      }
    }

    if (scrollActive) {
      for (const _this of SCROLL_ELEMENTS) {
        _this.run.event("scroll");
      }

      for (const _this of CLASS_SCROLL_ELEMENTS) {
        _this.run.classScroll();
      }

      if (WINDOW.isUnsupportedSVG) {
        for (const _this of SVG_ELEMENTS) {
          _this.set.intersecting(SVGIntersection(_this.bounds, "intersecting"));
          if (_this.is.inviewElement) {
            _this.set.inview(SVGIntersection(_this.bounds, "inview"));
          }
        }
      }

      for (const _this of INVIEW_ELEMENTS) {
        if (_this.is.intersecting && _this.is.inviewOffset) {
          let scrolled = ((WINDOW.scroll.y + WINDOW.height - _this.bounds.offsetTop) / WINDOW.height) * 100;
          if (scrolled >= _this.is.inviewOffset) {
            !_this.is.inview && _this.set.inview(true, true);
          } else {
            _this.is.inview && _this.set.inview(false, true);
          }
        } else {
          INVIEW_OBSERVER.observe(_this.element);
        }
      }
    }

    if (scrollActive || mouseActive) {
      requestAnimationFrame(ON_RAF);
    } else {
      cancelAnimationFrame(ON_RAF);
    }

  };

  function checkScroll(e) {
    if (e.tick >= 10) {
      e.running = false;
    } else {
      e.tick += 1;
    }
    return e;
  }

  function checkMouse(e) {
    if (e.tick >= 5) {
      e.running = false;
    } else {
      e.tick += 1;
    }
    return e;
  }

  /**
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   * LISTENERS
   * ------------------------------------------------------------------------------------------------------------------------------------------------
   */

  window.addEventListener("scroll", ON_SCROLL, { passive: true });
  window.addEventListener("mousemove", ON_MOUSE, { passive: true });
  window.addEventListener("resize", ON_RESIZE);
  window.addEventListener("DOMContentLoaded", getWindowScroll);
  window.addEventListener("mouseover", ON_MOUSE);

  TORUS.Group = class {
    constructor(element) {
      /** this element */
      this.element = element;

      /** Optimize and replace original [data-tor] attribute */
      this.element.dataset.torGroup = optimizeAttribute(this.element.dataset.torGroup);

      /** Replace all ` ` spaces in (<value>) definition and split into an array */
      this.dataset = this.element.dataset.torGroup.replace(/\((.*?)\)+/g, match => match.replace(/ +/g, "░"));

      /** Create store objects */
      this.attributes = this.attributes || {};

      this._sortAttributes();
      this._assignAttributes();

    }

    _sortAttributes() {
      let group = this.dataset.match(/(.*?);(?![^()]*\))/g);

      if (!group) {
        console.error("Missing semicolon at the end of " + this.dataset);
        return;
      }

      for (const item of group) {
        let target = /^(.*?)=>/.exec(item)[1];
        let attributes = /=>(.*?)$/.exec(item)[1].replace(/;$/, "").replace(/\s+(?=[^[\]]*\])/g, "░");

        this.attributes[target] = this.attributes[target] || {};

        for (const [i, attribute] of Object.entries(attributes.split(" "))) {
          this.attributes[target][i] = attribute;
        }
      }
    }

    _assignAttributes() {
      for (const [targets, attributes] of Object.entries(this.attributes)) {
        let count = 0;
        let allTargets = this.element.querySelectorAll(targets);

        for (const target of allTargets) {
          let tempAttributes = [];
          count += 1;

          for (let attribute of Object.values(attributes)) {
            attribute = attribute.replace(/░+/g, " ");

            /** Has counting */
            if (/\/(.*?)\//.test(attribute)) {
              tempAttributes.push(this._counting(count, attribute));
            } else {
              tempAttributes.push(attribute);
            }
          }

          if (target.dataset.tor) {
            target.dataset.tor = target.dataset.tor + " " + tempAttributes.join(" ");
          } else {
            target.dataset.tor = tempAttributes.join(" ");
          }
          GROUP_ELEMENTS.add(target);
        }
      }
    }

    _counting(count, attribute) {
      let startFinal;
      let endFinal;

      const original = attribute.match(/\/(.*?)\/+/g);

      for (const match of original) {
        const split = match.split(";");
        let start = split[0];
        let end = split[1];

        /** Only <start> and no <end> value */
        if (!end) {
          end = start;
          start = null;
        }

        /** Check if <start> value has counting defined by `//` */
        if (/\/(.*?)\//.test(start)) {
          startFinal = getCounting(count, start);
        } else {
          startFinal = start;
        }

        /** Check if <end> value has counting defined by `//` */
        if (/\/(.*?)\//.test(end)) {
          endFinal = getCounting(count, end);
        } else {
          endFinal = end;
        }
        attribute = attribute.replace(match, `${startFinal ? startFinal + ";" : ""}${endFinal}`);
      }

      return attribute;
    }

    /**
     * ------------------------------------------------------------------------
     * Initialization
     * ------------------------------------------------------------------------
     */

    static init(elements) {
      elements = getIterableElement(elements || "[data-tor-group]");
      initClass({ name: "Group", elements: elements });

      /** When groups scripting is done, initialize the Main */
      if (GROUP_ELEMENTS) {
        TORUS.Main.init(GROUP_ELEMENTS);
      }
    }

  };

  var group = TORUS.Group;

  TORUS.Parent = class {
    constructor(element, options) {
      /** this element */
      this.element = element;

      if (options) {
        if (options.trigger) {
          this.element.dataset.torParent = this.element.dataset.torParent ? this.element.dataset.torParent + " " + options.trigger : options.trigger;
        }
      }

      /** Optimize and replace original [data-tor-parent] attribute */
      this.element.dataset.torParent = expandCluster(optimizeAttribute(this.element.dataset.torParent, true));

      /** Replace all ` ` spaces in (<value>) definition and split into an array */
      this.dataset = this.element.dataset.torParent.replace(/\((.*?)\)+/g, match => match.replace(/ +/g, "░")).split(" ");

      /** Create store objects */
      this.is = this.is || {};
      this.has = this.has || {};
      this.attributes = this.attributes || {};
    }

    /**
     * ------------------------------------------------------------------------
     * Define getter and setter functions
     * ------------------------------------------------------------------------
     */

    _getterSetter() {
      /** Setter */
      this.set = {
        inview: (status, force) => {
          if (!this.is.inviewOffset || force) {
            this.is.inview = status;

            if (status) {
              this.element.classList.add("inview");
            } else {
              if (this.is.inviewRevert) {
                this.element.classList.remove("inview");
              }
            }
          }
        },
      };

      /** Runner */
      this.run = {
        inview: () => {
          INVIEW_OBSERVER.observe(this.element);
        },
      };

    }

    /**
     * ------------------------------------------------------------------------
     * Sort attributes
     * ------------------------------------------------------------------------
     */

    _sortAttributes() {
      let temp = {};

      for (const dataAttribute of this.dataset) {
        temp.static = temp.static || [];
        temp.static.push(dataAttribute);
      }

      for (const [group, array] of Object.entries(temp)) {
        createPropertiesObject(this, array, group);
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Add element to corresponding set
     * ------------------------------------------------------------------------
     */

    _addToElementsSet() {
      if (/inview/.test(this.dataset)) {
        this.is.inviewElement = true;
        INVIEW_ELEMENTS.add(this);
      }
    }

    /**
     * ------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialization
     * ------------------------------------------------------------------------------------------------------------------------------------------------
     */

    static init(elements, options) {
      elements = getIterableElement(elements || "[data-tor-parent~='inview']");
      initClass({ name: "Parent", elements: elements, options: options });

      for (const fn of ["_getterSetter", "_sortAttributes", "_addToElementsSet"]) {
        callFunction({
          elements: elements,
          object: "Parent",
          fn: fn,
        });
      }
    }
  };

  var parent = TORUS.Parent;

  TORUS.Main = class {
    constructor(element) {
      /** this element */
      this.element = element;

      /** Optimize and replace original [data-tor] attribute */
      this.element.dataset.tor = expandCluster(optimizeAttribute(this.element.dataset.tor, true));

      /** Replace all ` ` spaces in (<value>) definition and split into an array */
      this.dataset = this.element.dataset.tor.replace(/\((.*?)\)+/g, match => match.replace(/ +/g, "░")).split(" ");

      /** Create store objects */
      this.is = this.is || {};
      this.has = this.has || {};
      this.attributes = this.attributes || {};
      this.bounds = this.bounds || {};

      // /** Getters and Setters init */
      // this._getterSetter();

      // /** Call functions */
      // this._sortAttributes();
      // this.get.bounds();
      // this._addToElementsSet();
    }

    /**
     * ------------------------------------------------------------------------
     * Define getter and setter functions
     * ------------------------------------------------------------------------
     */

    _getterSetter() {
      /** Getter */
      this.get = {
        bounds: () => {
          this._getBounds();
        }
      };

      /** Setter */
      this.set = {
        bounds: (bounds, svgParentRect) => {
          this._setBounds(bounds, svgParentRect);
        },

        intersecting: (status) => {
          this.is.intersecting = status;
        },

        inview: (status, force) => {
          if (!this.is.inviewOffset || force) {
            this.is.inview = status;

            if (status) {
              this.element.classList.add("inview");
            } else {
              if (this.is.inviewRevert) {
                this.element.classList.remove("inview");
              }
            }
          }
        },
      };

      /** Runner */
      this.run = {
        inview: () => {
          INVIEW_OBSERVER.observe(this.element);
        },
        event: (event, params) => {
          this._runEvent(event, params);
        },
        classScroll: () => {
          this._onClassScroll();
        },
      };

    }

    /**
     * ------------------------------------------------------------------------
     * Sort attributes
     * ------------------------------------------------------------------------
     */

    _sortAttributes() {
      let temp = {};

      for (const dataAttribute of this.dataset) {
        if (/class./.exec(dataAttribute)) {
          temp.class = temp.class || [];
          temp.class.push(dataAttribute);
        } else if (/mouse|scroll|sensor/.test(dataAttribute)) {
          temp.dynamic = temp.dynamic || [];
          temp.dynamic.push(dataAttribute);
          this.is.dynamicAttribute = true;
        } else if (/loop:/.test(dataAttribute)) {
          temp.loop = temp.loop || [];
          temp.loop.push(dataAttribute);
        } else {
          temp.static = temp.static || [];
          temp.static.push(dataAttribute);
        }
      }

      for (const [group, array] of Object.entries(temp)) {
        createPropertiesObject(this, array, group);

        group === "static" && this._CSSAddToSet(this.attributes.static);
        group === "loop"   && this._LOOPCreate(this.attributes.loop);
        group === "class"  && this._CLASSAddListeners(array);
      }

      if (this.attributes.dynamic && this.is.dynamicAttribute) {
        this.attributes.dynamic.styles = {};
        this.attributes.dynamic.currentStyles = new Set();
        // this.element.style.setProperty("visibility", "hidden", "important");
        this.element.classList.add("tor-hidden");
      }

      // /** Create hover hit area for some effects */
      // if (/hover:(.*?)(push|pull|rotate)/.test(this.dataset)) {
      //   if (!this.element.querySelector(".tor-hit-area")) {
      //     const hit = document.createElement("span");
      //     hit.classList.add("tor-hit-area");
      //     this.element.appendChild(hit);
      //   }
      // }
    }

    /**
     * ------------------------------------------------------------------------
     * Create CSS looped animations rules
     * ------------------------------------------------------------------------
     */

    _LOOPCreate(attributes) {
      let names = [];
      let durations = [];
      let timings = [];
      let directions = [];
      let delays = [];
      let pauses = {};
      let hasPause = false;
      let indexes = {};

      for (const [i, attribute] of Object.entries(attributes.loop)) {
        let name = `loop-${attribute.property.name.replace(/\./g, "-")}`;
        let duration = `calc(var(--tor-${name}-duration) * var(--tor-${name}-speed,1))`;
        let timing = `var(--tor-${name}-timing)`;
        let direction = `var(--tor-${name}-direction)`;

        let currentEnd = getValuesForCurrentResolution(attribute, 1);
        let currentStart = getValuesForCurrentResolution(attribute, 1).start;

        pauses[name] = {
          index: Number(i),
          pause: null,
          iterations: 0,
          currentIteration: 0,
        };

        indexes[i] = false;

        if (currentEnd.value) {
          this.element.style.setProperty(`--tor-${name}-value`, `${currentEnd.value}${currentEnd.unit}`);
        }

        if (currentStart) {
          this.element.style.setProperty(`--tor-${name}-value-start`, `${currentStart}${currentEnd.unit}`);
        }

        if (attribute.options) {
          for (const [key, value] of Object.entries(attribute.options)) {
            switch (key) {
              case "pause":
                let temp = getValueData(attribute.options.pause);
                pauses[name].pause = temp.unit === "s" ? temp.value * 1000 : temp.value;
                hasPause = true;
                break;

              case "iterations":
                pauses[name].iterations = Number(attribute.options.iterations);
                break;

              case "delay":
                delays.push(`var(--tor-${name}-delay)`);
                this.element.style.setProperty(`--tor-${name}-delay`, `${value}`);
                break;

              default:
                this.element.style.setProperty(`--tor-${name}-${key}`, `${value}`);
                break;
            }
          }
        }

        names.push(name);
        durations.push(duration);
        timings.push(timing);
        directions.push(direction);
      }

      this.element.style.setProperty("animation-name", names.join(", "));
      this.element.style.setProperty("animation-duration", durations.join(", "));
      this.element.style.setProperty("animation-timing-function", timings.join(", "));
      this.element.style.setProperty("animation-direction", directions.join(", "));
      delays.length && this.element.style.setProperty("animation-delay", delays.join(", "));

      if (hasPause) {
        /** Do on animation iteration */
        this.element.onanimationiteration = (e) => {

          /** Do only it it's current element */
          if (e.target === this.element) {

            /** If loop has `iterations` option, add to `currentIteration` counter */
            if (pauses[e.animationName].iterations) {
              pauses[e.animationName].currentIteration++;
            }

            /** If `currentIteration` equals the predefined iteration */
            if (pauses[e.animationName].iterations === pauses[e.animationName].currentIteration) {
              pauses[e.animationName].currentIteration = 0;

              if (pauses[e.animationName].pause) {
                let pause = pauses[e.animationName].pause;
                indexes[pauses[e.animationName].index] = true;

                let states = [...Object.values(indexes)].map(item => { return item ? "paused" : "running" });
                this.element.style.setProperty("animation-play-state", states.join(", "));

                let time = setTimeout(() => {
                  indexes[pauses[e.animationName].index] = false;
                  states = [...Object.values(indexes)].map(item => { return !item ? "running" : "paused" });
                  this.element.style.setProperty("animation-play-state", states.join(", "));
                  clearTimeout(time);
                }, pause);
              }
            }
          }
        };
      }

      // /**
      //  * Chrome bug
      //  *
      //  * Browser will not update the animation when using CSS variables
      //  */
      // this.element.style.setProperty("animation-name", "none");
      // requestAnimationFrame(() => {
      //   this.element.style.removeProperty("animation-name");
      // });
    }

    /**
     * ------------------------------------------------------------------------
     * Create `@media` CSS rules and add to global CSS_SET
     * ------------------------------------------------------------------------
     */

    _CSSAddToSet(attributes) {
      for (const items of Object.values(attributes)) {
        for (const attribute of Object.values(items)) {
          if (attribute.noCSSProcess) {
            continue;
          }

          let CSSOptions = "";
          let CSSAdditional = "";
          let CSSParent = "";
          let tempOptions = [];
          let CSSWrap = null;

          let CSSTrigger = attribute.trigger ? `-${attribute.trigger.name}` : "";
          let CSSTriggerAlias = attribute.trigger ? attribute.trigger.alias : "";
          let CSSPriority = attribute.priority ? " !important" : "";
          let CSSPropertyName = attribute.property.name;
          let CSSPropertyAlias = attribute.property.alias;

          /** Default if no values */
          if (!attribute.values) {
            attribute.values = {
              all: {
                end: {
                  value: "0%",
                }
              }
            };
          }

          if (attribute.trigger && attribute.trigger.argument) {
            if (attribute.trigger.argument === "parent") {
              CSSParent = `[data-tor-parent~="${attribute.trigger.name}"]`;
            } else {
              CSSParent = `${attribute.trigger.argument}`;
            }
          }

          if (attribute.property.cssFunction) {
            CSSWrap = CSSPropertyName;
            CSSPropertyName = attribute.property.cssFunction;
          }

          /**
           * ---
           * If it's <custom> attribute. Example: `hover@padding(3rem)`
           * ---
           */

          if (attribute.isCustom) {
            /** Responsive <effect>. Example: `hover:xl::@margin(50%)` */
            for (const type of ["start", "end"]) {

              /** If attribute has <start> or <end> values */
              if (attribute.values.all[type]) {

                let triggerAlias = (type === "end") ? CSSTriggerAlias : "";
                let parent = CSSParent ? CSSParent + triggerAlias : "";

                /** default (start) value */
                addCSSRules({
                  triggerAlias: triggerAlias,
                  rule: CSSPropertyName,
                  value: attribute.values.all[type].value,
                  unit: attribute.values.all[type].unit,
                  cssParent: parent,
                });

                /** Responsive <values>. Example: `hover:opacity(10% xl::50%)` */
                for (const [breakpoint, value] of Object.entries(attribute.values)) {
                  addCSSRules({
                    resolution: breakpoint,
                    triggerAlias: triggerAlias,
                    rule: CSSPropertyName,
                    value: value[type].value,
                    unit: value[type].unit,
                    cssParent: parent,
                  });
                }
              }
            }
          } else {
            /**
             * ---
             * Else, it's <static> attribute. Example: `hover:blur(sm)`
             * ---
             */

            let CSSValue = attribute.values ? attribute.values.all.end.value : "";
            let CSSUnit = attribute.values ? (attribute.values.all.end.unit ? attribute.values.all.end.unit : "") : "";

            /**
             * Create CSS variables from options and push them to array
             */

            if (attribute.options) {
              for (const [key, value] of Object.entries(attribute.options)) {
                if (key !== "target") {
                  tempOptions.push(`--tor-${attribute.property.name}-${key}: ${getCSSVariable({ property: key, value: value })}`);
                }
              }
              CSSOptions = `${tempOptions.join(";")}`;
            }

            /**
             * Add additional CSS rules if applicable
             */

            if (CSS_PROPERTIES[attribute.property.name].additionalRules) {
              CSSAdditional = CSS_PROPERTIES[attribute.property.name].additionalRules;
            }

            /**
            * Add <default> CSS rule
            */

            let parent = CSSParent ? CSSParent + CSSTriggerAlias : "";

            addCSSRules({
              trigger: CSSTrigger,
              triggerAlias: CSSTriggerAlias,
              rule: CSSPropertyAlias,
              value: CSSValue,
              unit: CSSUnit,
              cssParent: parent,
            });

            /**
            * Add <custom> CSS rule
            * Responsive <values>. Example: `hover:opacity(10% xl::50%)`
            */

            for (const [breakpoint, value] of Object.entries(attribute.values)) {
              if (breakpoint !== "all") {
                addCSSRules({
                  resolution: breakpoint,
                  triggerAlias: CSSTriggerAlias,
                  rule: CSSPropertyAlias,
                  value: value.end.value,
                  unit: value.end.unit,
                  cssParent: parent,
                });
              }
            }
          }

          /**
           * Create and add CSS rules to CSS_SET
           */

          function addCSSRules(_) {
            let css =
              `${_.cssParent ? _.cssParent : ""} [data-tor${_.selector || "~"}="${_.original || attribute.original}"]${!_.cssParent ? _.triggerAlias : ""} {
              ${_.rule}: ${getCSSVariable({
              property: _.propertyName || CSSPropertyName,
              value: _.value,
              unit: _.unit,
              wrap: CSSWrap
            })}${_.priority || CSSPriority};
              ${_.options || CSSOptions}
              ${_.additional || CSSAdditional}
            }`.replace(/ +/g, " ").replace(/\t|\n|\r+/g, "").replace(/\s*{\s*/g, "{").replace(/\s*}\s*/g, "}");

            CSS_SET.breakpoints[_.resolution || attribute.resolution].add(css);
          }
        }
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Get element bounds
     * ------------------------------------------------------------------------
     */

    _getBounds() {
      this.bounds.calculated = false;
      let svgParent = this.element.ownerSVGElement;

      /**
       * Chrome bug
       *
       * `intersectionObserver` doesn't work in Chrome, so we need to get the parent SVG rect
       */

      if (WINDOW.isUnsupportedSVG && svgParent) {
        if (svgParent) {
          let svg;

          svgParent.TORUS = svgParent.TORUS || {};
          svgParent.TORUS.svg = svgParent.TORUS.svg || {};

          this.is.svgChild = true;
          this.has.svgParent = svgParent;

          svg = svgParent.TORUS.svg;
          svg.children = svg.children || new Set();
          svg.children.add(this);

          if (WINDOW.isSafari) {
            requestAnimationFrame(() => {
              setTimeout(() => {
                INTERSECTION_OBSERVER.observe(svgParent);
              }, 50);
            });
          } else {
            INTERSECTION_OBSERVER.observe(svgParent);
          }
        }
      } else {
        INTERSECTION_OBSERVER.observe(this.element);
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Set element bounds
     * ------------------------------------------------------------------------
     */

    _setBounds(bounds, svgParentRect) {
      let B = this.bounds;
      let ratio = 1;
      let scrollLeft = WINDOW.scroll.x;
      let scrollTop = WINDOW.scroll.y;

      if (WINDOW.isUnsupportedSVG && svgParentRect) {
        ratio = svgParentRect.ratio;
        scrollLeft = svgParentRect.rect.offsetLeft;
        scrollTop = svgParentRect.rect.offsetTop;
      }

      B.calculated  = true;
      B.rect        = bounds;
      B.width       = B.rect.width * ratio;
      B.height      = B.rect.height * ratio;
      B.top         = B.rect.y * ratio;
      B.left        = B.rect.x * ratio;
      B.right       = B.rect.right || B.left + B.width;
      B.bottom      = B.rect.bottom || B.top + B.height;
      B.offsetLeft  = B.left + scrollLeft;
      B.offsetTop   = B.top + scrollTop;
      B.centerX     = B.offsetLeft + B.width / 2 - WINDOW.scroll.x;
      B.centerY     = B.offsetTop + B.height / 2 - WINDOW.scroll.y;

      let max = getMaxSide(this);
      this.bounds.maxDiagonal = Math.round(max.corner);
      this.bounds.maxXSide = max.xSide;
      this.bounds.maxYSide = max.ySide;

      this._runAllEvents();

      // this.element.style.removeProperty("visibility");
      this.element.classList.remove("tor-hidden");
    }

    /**
     * ------------------------------------------------------------------------
     * Add element to corresponding set
     * ------------------------------------------------------------------------
     */

    _addToElementsSet() {
      if (/scroll(?!(.*?)class)/.test(this.dataset)) {
        SCROLL_ELEMENTS.add(this);
      }
      if (/scroll(.*?)class/.test(this.dataset)) {
        CLASS_SCROLL_ELEMENTS.add(this);
      }
      if (/mouse/.test(this.dataset)) {
        MOUSE_ELEMENTS.add(this);
      }
      if (/inview(?!\()/.test(this.dataset)) {
        this.is.inviewElement = true;
        INVIEW_ELEMENTS.add(this);
      }
      if (this.element.ownerSVGElement) {
        SVG_ELEMENTS.add(this);
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Run all events in loop to set the starting value immediately
     * ------------------------------------------------------------------------
     */

    _runAllEvents() {
      for (const event of ["mouse", "scroll", "sensor", "inview"]) {
        if (this.attributes.dynamic && this.attributes.dynamic[event]) {
          this.run.event(event, true);
        }
        if (event === "inview" && this.is.inviewElement) {
          this.run.inview();
        }
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Run events for dynamic attributes
     * @example: `scroll:@scale(0;1)`
     * ------------------------------------------------------------------------
     */

    _runEvent(event, force) {
      if (!this.is.intersecting) {
        if(!force) {
          return;
        }
      }

      let cssName;
      let fullValue;
      let wrap = [];
      let dynamic = this.attributes.dynamic;

      dynamic.allStyles = dynamic.allStyles || {};

      /**
       * Create `styles` object that stores the `live` CSS values
       */

      for (const group of Object.values(dynamic[event])) {
        for (const attribute of Object.values(group)) {
          let all;
          let percents = getPercents(this, { event: event, options: attribute.options })[attribute.trigger.direction];

          dynamic.styles[attribute.resolution] = dynamic.styles[attribute.resolution] || {};
          dynamic.styles[attribute.resolution][attribute.property.name] = dynamic.styles[attribute.resolution][attribute.property.name] || {};

          /**
           * Declare CSS styles
           */

          /** Attribute has multi values defined by `...` */
          if (attribute.values.multi) {
            all = [];

            for (let i in attribute.values.all.start.value) {
              let GV = getValuesForCurrentResolution(attribute, percents, i);
              all.push(`${GV.value}${GV.unit}`);
            }

            all = attribute.values.cssFunction ? `${attribute.values.cssFunction}(${all.join(" ")})` : all.join(" ");
          } else {
            let GV = getValuesForCurrentResolution(attribute, percents);
            dynamic.styles[attribute.resolution][attribute.property.name].cssFunction = attribute.property.cssFunction;
            all = `${GV.value}${GV.unit}`;
            // console.log(all);
          }

          dynamic.styles[attribute.resolution][attribute.property.name][`${event}${attribute.trigger.direction}`] = all;
          dynamic.styles[attribute.resolution][attribute.property.name].targets = attribute.options.target;
        }
      }

      /**
       * Loop trough all breakpoints from the current one down, and find the first object from the `styles`, that matches
       * the resolution from the loop
       */

      for (let i = CSS_BREAKPOINTS[WINDOW.resolution.name].id; i >= 0; i--) {
        let availableBreakpoints = Object.keys(CSS_BREAKPOINTS).find(key => CSS_BREAKPOINTS[key].id === i);

        if (dynamic.styles[availableBreakpoints]) {
          dynamic.currentStyles.add(Object.keys(dynamic.styles[availableBreakpoints])[0]);
          dynamic.allStyles[Object.keys(dynamic.styles[availableBreakpoints])[0]] = dynamic.styles[availableBreakpoints];
          break;
        } else {
          dynamic.currentStyles.clear();
        }
      }

      /**
       * Loop trough <all> available styles for the attribute and find if the <currentStyle> is used or not
       */

      for (const [name, style] of Object.entries(dynamic.allStyles)) {
        if (dynamic.currentStyles.has(name)) {
          assignCSS.call(this, style, "add");
        } else {
          assignCSS.call(this, style, "remove");
        }
      }

      /**
       * Add or remove the CSS style from the target element
       */

      function assignCSS(style, method) {
        for (const [name, value] of Object.entries(style)) {
          let tempValue = [];
          cssName = name;

          switch (method) {
            case "add": {
              for (const event of ["mouseall", "mousex", "mousey", "scrollall", "scrollx", "scrolly", "sensorall", "sensorx", "sensory"]) {
                value[event] && tempValue.push(value[event]);
              }

              fullValue = tempValue.length > 1 ? `calc(${tempValue.join(" + ")})` : tempValue[0];

              if (value.cssFunction) {
                cssName = value.cssFunction;
                // let perspective = /rotate/.test(name) ? " perspective(1000px)" : "";
                wrap.push(`${name}(${fullValue})`);
              }

              if (value.targets) {
                for (const target of value.targets) {
                  target.style.setProperty(cssName, value.cssFunction ? wrap.join(" ") : fullValue);
                }
              } else {
                this.element.style.setProperty(cssName, value.cssFunction ? wrap.join(" ") : fullValue);
              }
              break;
            }

            case "remove": {
              if (value.targets) {
                for (const target of value.targets) {
                  if (value.cssFunction) {
                    target.style.this.element.style[value.cssFunction] = target.style[value.cssFunction].replace(target.style[value.cssFunction], "");
                  }
                  target.style.removeProperty(cssName);
                }
              } else {
                if (value.cssFunction) {
                  this.element.style[value.cssFunction] = this.element.style[value.cssFunction].replace(this.element.style[value.cssFunction], "");
                }
                this.element.style.removeProperty(cssName);
              }

              delete dynamic.allStyles[cssName];
              break;
            }
          }
        }
      }
    }

    /**
     * ------------------------------------------------------------------------------------------------
     * CLASS ACTIONS
     * ------------------------------------------------------------------------------------------------
     */

    /**
     * ------------------------------------------------------------------------
     * Class: Add event listeners
     * ------------------------------------------------------------------------
     */

     _CLASSAddListeners(array) {
      this._CLASSCreateActions();

      if (array.some(item => /click:/.test(item))) {
        this.element.addEventListener("click", this._onClassClick.bind(this));
      }
      if (array.some(item => /hover:/.test(item))) {
        this.element.addEventListener("mouseenter", this._onClassMouseEnter.bind(this));
        this.element.addEventListener("mouseleave", this._onClassMouseLeave.bind(this));
      }
      if (array.some(item => /timeout:/.test(item))) {
        this._onClassTimeout();
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Class: Create `actions` object that stores the necessary data that
     * will be used when user performs a <trigger>
     * ------------------------------------------------------------------------
     */

    _CLASSCreateActions() {
      for (const attributes of Object.values(this.attributes.class)) {
        for (const attribute of Object.values(attributes)) {
          let start = null;
          let end = null;

          if (attribute.options.start) {
            start = getValueData(attribute.options.start).value;
          }
          if (attribute.options.end) {
            end = getValueData(attribute.options.end).value;
          }

          switch (attribute.trigger) {
            case "timeout":
              start = start.unit === "s" ? start.value * 1000 : start.value;
              end = end.unit === "s" ? end.value * 1000 : end.value;
          }

          attribute.actions = {
            method: /class\.(.*?)$/.exec(attribute.property.name)[1],
            classes: attribute.values.all.end.value.split("░"),
            target: attribute.options.target,
            trigger: attribute.trigger.name,
            start: start,
            end: end,
          };
        }
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Class: On click
     * ------------------------------------------------------------------------
     */

    _onClassClick() {
      for (const attribute of Object.values(this.attributes.class.click)) {
        this._CLASSTriggerNewState(attribute);
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Class: On mouse enter (hover)
     * ------------------------------------------------------------------------
     */

    _onClassMouseEnter() {
      for (const attribute of Object.values(this.attributes.class.hover)) {
        this._CLASSTriggerNewState(attribute);
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Class: On mouse leave (hover out)
     * ------------------------------------------------------------------------
     */

    _onClassMouseLeave() {
      for (const attribute of Object.values(this.attributes.class.hover)) {
        if (attribute.actions.method === "toggle") {
          this._CLASSTriggerOldState(attribute);
        }
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Class: On time out
     * ------------------------------------------------------------------------
     */

    _onClassTimeout() {
      for (const attribute of Object.values(this.attributes.class.timeout)) {
        // start = start.unit === "s" ? start.value * 1000 : start.value;
        // end = end.unit === "s" ? end.value * 1000 : end.value;

        attribute.time = setTimeout(() => {
          /** Trigger active state */
          this._CLASSTriggerNewState(attribute);

          /** If timeOut has end value */
          if (end) {
            attribute.time = setTimeout(() => {

              /** Trigger state back to inactive (original) */
              this._CLASSTriggerOldState(attribute);

              clearTimeout(attribute.time);
            }, end);
          }
          else {
            clearTimeout(attribute.time);
          }

        }, start);

      }
    }

    /**
     * ------------------------------------------------------------------------
     * Class: On scroll
     * ------------------------------------------------------------------------
     */

     _onClassScroll() {
      for (const attribute of Object.values(this.attributes.class.scroll)) {
        if (attribute.actions.end) {
          if (WINDOW.scroll.y >= attribute.actions.start && WINDOW.scroll.y <= attribute.actions.end) {
            checkScroll.call(this, attribute, "in");
          } else {
            checkScroll.call(this, attribute, "out");
          }
        } else {
          if (WINDOW.scroll.y >= attribute.actions.start) {
            checkScroll.call(this, attribute, "in");
          } else {
            if (attribute.actions.method === "toggle") {
              attribute.actions.done && toggle.call(this, attribute, true);
            }
          }
        }
      }

      function checkScroll(attribute, method) {
        switch (method) {
          case "in":
            if (attribute.actions.method === "toggle") {
              !attribute.actions.done && toggle.call(this, attribute, false);
            } else {
              toggle.call(this, attribute, false);
            }
            break;

          case "out":
            if (attribute.actions.method === "toggle") {
              attribute.actions.done && toggle.call(this, attribute, true);
            } else {
              toggle.call(this, attribute, true);
            }
            break;
        }
      }

      function toggle(attribute, done) {
        if (!done) {
          this._CLASSTriggerNewState(attribute);
          attribute.actions.done = true;
        }
        if (done) {
          this._CLASSTriggerOldState(attribute);
          attribute.actions.done = false;
        }
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Class: Trigger new state (add/remove/toggle class)
     * ------------------------------------------------------------------------
     */

    _CLASSTriggerNewState(attribute) {
      for (const target of getIterableElement(attribute.actions.target)) {
        if (attribute.priority) {
          setTimeout(() => {
            [...attribute.actions.classes].map(_class => target.classList[attribute.actions.method](_class) );
          }, 10);
        } else {
          [...attribute.actions.classes].map(_class => target.classList[attribute.actions.method](_class) );
        }
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Class: Trigger old state (revert classList back to original)
     * ------------------------------------------------------------------------
     */

    _CLASSTriggerOldState(attribute) {
      let newMethod;

      switch (attribute.actions.method) {
        case "add":
          newMethod = "remove";
          break;

        case "remove":
          newMethod = "add";
          break;

        default:
          newMethod = "toggle";
          break;
      }

      for (const target of getIterableElement(attribute.actions.target)) {
        [...attribute.actions.classes].map(_class => target.classList[newMethod](_class) );
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Refresh
     * ------------------------------------------------------------------------
     */

    _refresh() {
      this.get.bounds();
      this._runAllEvents();
    }

    /**
     * ------------------------------------------------------------------------------------------------------------------------------------------------
     * Public functions
     * ------------------------------------------------------------------------------------------------------------------------------------------------
     */

    static refresh(elements) {
      callFunction({
        elements: getIterableElement(elements || "[data-tor]"),
        object: "Main",
        fn: "_refresh",
      });
    }

    /**
     * ------------------------------------------------------------------------------------------------------------------------------------------------
     * Initialization
     * ------------------------------------------------------------------------------------------------------------------------------------------------
     */

    static init(elements) {
      elements = getIterableElement(elements || "[data-tor]");
      initClass({ name: "Main", elements: elements });

      for (const fn of ["_getterSetter", "_sortAttributes", "_getBounds", "_addToElementsSet"]) {
        callFunction({
          elements: elements,
          object: "Main",
          fn: fn,
        });
      }

      addStylesheet();
    }

  };

  MUTATION();

  var main = TORUS.Main;

  /**
   * ------------------------------------------------------------------------
   * Slider
   * (c) Torus Kit
   * ------------------------------------------------------------------------
   */

  TORUS.Slider = class {

    constructor(element, options) {
      /** Main parent element */
      this.parent = element;

      /** Optimize and replace original [data-tor] attribute */
      this.parent.dataset.torSlider = optimizeAttribute(this.parent.dataset.torSlider);

      /** Replace all ` ` spaces in (<value>) definition and split into an array */
      this.dataset = this.parent.dataset.torSlider.replace(/\((.*?)\)+/g, match => match.replace(/ +/g, "░")).split(" ");

      /** Create store objects */
      this.attributes = this.attributes || {};
      this.bounds = this.bounds || {};

      /** Getters and Setters init */
      this._getterSetter();

      this.setOptions(options);
      // this.setDimensions();
      this.get.bounds();
    }

    _createSlider() {
      this.wrapItems();

      if(!this.slider || !this.itemsElements) {
        return;
      }

      /**
       * Defaults
       */

      this.activeSlide = 0;                     // Default active slide
      this.isDown = false;                      // If pointer (mouse or touch) is pressed
      this.dragging = false;                    // If user drags the slider by mouse our touch event
      this.scrolling = false;                   // Slider is scrolling/translating
      this.differenceX = 0;                     // How fast pointer moves. Calculated when pointer is down (_onDown())
      this.distanceX = 0;                       // How far the slider moves while pointer is down (_onDown())
      this.startX = 0;                          // Current start position when pointer is down (_onDown())

      this.slider.translateLeft = 0;            // Amount of CSS translateX in px
      this.lastTranslateLeft = 0;               // The last slider position form the left
      this.slider.translateTop = 0;             // Amount of CSS translateY in px
      this.lastTranslateTop = 0;                // The last slider position form the top
      this.offsetLeft = this.parent.offsetLeft; // Element's offsetLeft from the screen edge
      this.offsetTop = this.parent.offsetTop;   // Element's offsetLeft from the screen edge
      this.leftBoundsReached = true;            // If the slider reaches the first slide (start). True when initialized
      this.rightBoundsReached = false;          // If the slider reaches the last slide (end)
      this.topBoundsReached = true;
      this.bottomBoundsReached = false;

      this.allItemsCount = this.itemsElements.length;		// How many .slide-item elements slider contains

      /** Firefox hack to prevent from returning 0 for some properties (clientWidth) immediately after document load */
      setTimeout(() => {
        this.setProperties();
        this.setNavigation();
        this.addEventListeners();

        /** Set .active class to currently visible items */
        this.setActiveItems(true);

        /** Set .show class to currently visible items */
        this.setShowItems();
      }, 10);
    }

    /**
     * ------------------------------------------------------------------------
     * Define getter and setter functions
     * ------------------------------------------------------------------------
     */

    _getterSetter() {
      /** Getter */
      this.get = {
        bounds: () => {
          this._getBounds();
        }
      };

      /** Setter */
      this.set = {
        bounds: (bounds) => {
          this._setBounds(bounds);
        },
      };
    }

    //
    // ------------------------------------------------------------------------
    // Set slider dimensions
    // ------------------------------------------------------------------------
    //

    setDimensions() {
      if(!this.options.autoHeight) {
        this.parent.style.setProperty("--tor-slider-height", `${this.bounds.height}px`);
      }
      this.parent.style.setProperty("--tor-slider-width", `${this.bounds.width}px`);

      this._createSlider();
    }

    /**
     * ------------------------------------------------------------------------
     * Set defaults
     * ------------------------------------------------------------------------
     */

    setDefaults() {
      if(!this.slider || !this.itemsElements) {
        return;
      }

      /**
       * Defaults
       */

      this.activeSlide = 0;                     // Default active slide
      this.isDown = false;                      // If pointer (mouse or touch) is pressed
      this.dragging = false;                    // If user drags the slider by mouse our touch event
      this.scrolling = false;                   // Slider is scrolling/translating
      this.differenceX = 0;                     // How fast pointer moves. Calculated when pointer is down (_onDown())
      this.distanceX = 0;                       // How far the slider moves while pointer is down (_onDown())
      this.startX = 0;                          // Current start position when pointer is down (_onDown())

      this.slider.translateLeft = 0;            // Amount of CSS translateX in px
      this.lastTranslateLeft = 0;               // The last slider position form the left
      this.slider.translateTop = 0;             // Amount of CSS translateY in px
      this.lastTranslateTop = 0;                // The last slider position form the top
      this.offsetLeft = this.parent.offsetLeft; // Element's offsetLeft from the screen edge
      this.offsetTop = this.parent.offsetTop;   // Element's offsetLeft from the screen edge
      this.leftBoundsReached = true;            // If the slider reaches the first slide (start). True when initialized
      this.rightBoundsReached = false;          // If the slider reaches the last slide (end)
      this.topBoundsReached = true;
      this.bottomBoundsReached = false;

      this.allItemsCount = this.itemsElements.length;		// How many .slide-item elements slider contains
    }

    //
    // ------------------------------------------------------------------------
    // Wrap inner slider elements into corresponding classes
    // ------------------------------------------------------------------------
    //

    wrapItems() {
      if (this.initialized) {
        return;
      }

      /** Wrap first child into `.tor-slider-item` wrapper (if it's not already) */
      for (const item of this.parent.children) {
        if (!item.classList.value.includes("tor-slider-item")) {
          wrapElement(item, "div", "tor-slider-item");
        }
      }

      /** .tor-slider-item elements */
      this.itemsElements = this.parent.querySelectorAll(".tor-slider-item");

      /** Wrap all `.tor-slider-item` elements into `.tor-slider-items` parent */
      wrapElement(this.itemsElements, this.parent, "tor-slider-items");

      /** Select parent of all .tor-slider-item elements */
      this.slider = this.parent.querySelector(".tor-slider-items");

      /** Wrap the `.tor-slider-items` elements into `.tor-slider-inner` parent */
      wrapElement(this.slider, "div", "tor-slider-inner");

      /** Select `.tor-slider-inner` element */
      this.sliderInner = this.parent.querySelector(".tor-slider-inner");

      this.initialized = true;
    }

    /**
     * ------------------------------------------------------------------------
     * Set options
     * ------------------------------------------------------------------------
     */

    setOptions(options) {
      /** Options defined in [data-tor-slider] attribute */
      createPropertiesObject(this, this.dataset, "slider");

      /**
       * Default Options
       */

      this.defaults = {
        count: 1,                   // Number of visible items per slide
        margin: 0,                  // Margin (space) between the items
        pullArea: 10,               // If the slider doesn't exceed this area when dragging, it reverses back
        stretchOnDrag: true,        // Stretch space between items on bounds when dragging
        stretchOnClick: false,      // Stretch space between items on bounds on click next/prev button
        addTrigger: false,          // Add parent `[data-tor-parent]` to `.tor-slider-item`
        slide: true,                // Enable slider sliding
        vertical: false,
        drag: true,
      };

      /** Merge user options with defaults */
      this.options = Object.assign(this.defaults, options);

      /** If there are additional options defined in `[data-tor-slider]`, create them or replace the default ones */
      for (const attribute of Object.values(this.attributes.slider.idle)) {
        if (attribute.values) {
          let GV = getValuesForCurrentResolution(attribute, 1);
          this.options[attribute.property.name.toCamelCase()] = GV.value;
        }
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Set properties
     * ------------------------------------------------------------------------
     */

    setProperties() {
      let lastOffsetTop = 0;

      this.parent.style.setProperty("--tor-slides-margin", `${this.options.margin}px`);
      this.parent.style.setProperty("--tor-slides-count", this.options.count);

      this.parent.classList.add("tor-done");

      this.sliderFullWidth = 0;

      /** Object that contains .tor-slider-item nodes */
      this.items = this.items || {};

      /** Loop trough all .tor-slider-item elements and define the element properties */
      for(let [i, item] of Object.entries(this.itemsElements)) {
        this.items[i] = this.items[i] || {};	// Create an object
        this.items[i].element = item;			    // Item element
        this.items[i].id = Number(i);			    // Number of the slide. Starting from 0

        let slideWidth = this.items[i].element.clientWidth;
        // let slideWidth = this.bounds.width / this.options.count;

        this.items[i].positionLeft = Number(i) + 1;                   // Position number of the item from the left: 1st, 2nd ... n+1
        this.items[i].positionRight = this.allItemsCount - Number(i); // Position number of the item from the right: n-1 ... 2nd, 1st
  			this.sliderFullWidth += slideWidth;        // Counts all items widths together to get the slider width

        /** Item offset from the left side of the slider */
        this.items[i].offsetLeft = Number(i * (slideWidth + this.options.margin));
  			// this.items[i].offsetTop = Number(i * (this.items[i].element.clientHeight + this.options.margin));

        this.items[i].offsetTop = lastOffsetTop;
        lastOffsetTop = lastOffsetTop + this.items[i].element.clientHeight + this.options.margin;

        /** Set data attribute for the single .tor-slider-item with the unique ID */
        this.items[i].element.setAttribute("data-tor-slider-item-id", this.items[i].id);

        /** Add parent fx triggers to `.tor-slider-item` */
        if(this.options.addTrigger) {
          this.items[i].element.setAttribute("data-tor-parent", this.options.addTrigger.replace(/,+/g, " "));
        }

        /** If item isn't the first, define the left pullArea */
        if(item.previousElementSibling) {
          this.items[i].pullAreaLeft_Start = this.items[i].offsetLeft - item.previousElementSibling.clientWidth - this.options.margin + this.options.pullArea;
          this.items[i].pullAreaLeft_End = this.items[i].offsetLeft + this.options.pullArea;

          this.items[i].pullAreaTop_Start = this.items[i].offsetTop - item.previousElementSibling.clientHeight - this.options.margin + this.options.pullArea;
          this.items[i].pullAreaTop_End = this.items[i].offsetTop + this.options.pullArea;
        }
        else {
          this.items[i].pullAreaLeft_Start = 0;
          this.items[i].pullAreaLeft_End = this.options.pullArea;

          this.items[i].pullAreaTop_Start = 0;
          this.items[i].pullAreaTop_End = this.options.pullArea;
        }

        /** Defined the right pullArea */
        this.items[i].pullAreaRight_Start = this.items[i].offsetLeft + slideWidth + this.options.margin - this.options.pullArea;
        this.items[i].pullAreaRight_End = this.items[i].offsetLeft - this.options.pullArea;

        this.items[i].pullAreaBottom_Start = this.items[i].offsetTop + this.items[i].element.clientHeight + this.options.margin - this.options.pullArea;
  			this.items[i].pullAreaBottom_End = this.items[i].offsetTop - this.options.pullArea;

  			// this.items[i].element.style.setProperty("--tor-item-height", `${this.items[i].element.clientHeight}px`);
  			this.items[i].height = this.items[i].element.clientHeight;
      }

      this.sliderClientWidth = this.bounds.width;
      this.sliderClientHeight = this.bounds.height;
      this.sliderScrollWidth = this.slider.scrollWidth;
      this.sliderScrollHeight = this.slider.scrollHeight;

      /** How far can slider move (translate) */
      this.maxScrollX = this.options.slide ? this.slider.scrollWidth - this.sliderClientWidth : 0;
      this.maxScrollY = this.options.slide ? this.slider.scrollHeight - this.sliderClientHeight : 0;

      /** Set width for slider drag area */
  		if (!this.options.vertical) {
        this.parent.style.setProperty("--tor-slider-area-width", `${this.sliderFullWidth}px`);
      }

      if(this.options.addTrigger) ;

    }

    /**
     * ------------------------------------------------------------------------
     * Create navigation
     * ------------------------------------------------------------------------
     */

    setNavigation() {
      this.navigation = this.navigation || {};	// Navigation object
      this.createControls();						// Next/Prev controls
      this.createIndicators();					// Dot indicators
    }

    /**
     * ------------------------------------------------------------------------
     * Event listeners
     * ------------------------------------------------------------------------
     */

    addEventListeners() {
      // document.addEventListener("pointerup", this._onUp.bind(this));
      // document.addEventListener("pointermove", this._onMove.bind(this));
      // this.slider.addEventListener("pointerdown", this._onDown.bind(this));

      document.addEventListener("mouseup", this._onUp.bind(this));
      document.addEventListener("touchend", this._onUp.bind(this), {passive: true});
      document.addEventListener("mousemove", this._onMove.bind(this));
      document.addEventListener("touchmove", this._onMove.bind(this), {passive: true});

      if (this.options.drag) {
        this.slider.addEventListener("mousedown", this._onDown.bind(this));
        this.slider.addEventListener("touchstart", this._onDown.bind(this), { passive: true });
      }

      this.slider.addEventListener("dragstart", this._onDragStart.bind(this));
      this.slider.addEventListener("click", this._onClickSlider.bind(this));
      this.slider.addEventListener("transitionend", this._onTransitionEnd.bind(this), {passive: true});
    }

    /**
     * ------------------------------------------------------------------------
     * On pointer down (mouse pressed or touch start)
     * ------------------------------------------------------------------------
     */

    _onDown(e) {

      if(!this.options.slide || !this.options.drag) {
        return;
      }

      window.requestAnimationFrame(() => {
        this.isDown = true;

        /** Determinate the main pointer device */
        if(e.pageX) {
          this.pointerDevice = "pointer";
        }
        if(e.touches) {
          this.pointerDevice = "touch";
        }

        /** Pointer position immediately on pointer down */
        this.startX = this._page(e).x + this.slider.translateLeft;
        this.startY = this._page(e).y + this.slider.translateTop;

        /** How far the slider moves while pointer is down */
        this.distanceX = 0;
        this.distanceY = 0;

        /** Do white pointer is down */
        let count = function () {
          if(this.isDown) {
            /** Dynamic difference. Used to calculate "bounce" from slider edge. If pointer is not moving, difference is 0 */
            this.differenceX = this.slider.translateLeft - this.lastTranslateLeft;
            this.lastTranslateLeft = this.slider.translateLeft;

            this.differenceY = this.slider.translateTop - this.lastTranslateTop;
            this.lastTranslateTop = this.slider.translateTop;

            this.parent.classList.add("dragging");

            window.requestAnimationFrame(count);
          }
        }.bind(this);

        count();

      });
    }

    /**
     * ------------------------------------------------------------------------
     * On pointer move
     * ------------------------------------------------------------------------
     */

    _onMove(e) {

      if (!this.options.slide || !this.options.drag) {
        return;
      }

      window.requestAnimationFrame(() => {
        if (!this.isDown) {
          return;
        }

        this.dragging = true;
        this.dragMove = true;

        /** Original startX minus current startX */
        this.distanceX = (this.startX - (this._page(e).x + this.slider.translateLeft)) / 2;
        this.distanceY = (this.startY - (this._page(e).y + this.slider.translateTop)) / 2;

        /** (+) <--- Slider moving to left */
        if (this.distanceX > 0 && this.rightBoundsReached) {
          this.distanceX = 0;
        }

        /** (-) ---> Slider moving to right */
        if (this.distanceX < 0 && this.leftBoundsReached) {
          this.distanceX = 0;
        }

        /** (+) Slider moving to top */
        if (this.distanceY > 0 && this.bottomBoundsReached) {
          this.distanceY = 0;
        }

        /** (-) Slider moving to bottom */
        if (this.distanceY < 0 && this.topBoundsReached) {
          this.distanceY = 0;
        }

        /** Add current traveled distance into parent slider CSS translateX */
        this.slider.translateLeft += this.distanceX;
        this.slider.translateTop += this.distanceY;

        if (this.options.vertical) {
          this.slider.style.setProperty("transform", `translate3d(0px, ${-this.slider.translateTop}px, 0px)`);
        }
        else {
          this.slider.style.setProperty("transform", `translate3d(${-this.slider.translateLeft}px, 0px, 0px)`);
        }

        /** Check if left or right bounds are reached */
        this.checkBounds();

        /**
         * Expand items when bounds reached
         */

        /** Do only when dragging */
        if (this.dragging) {
          if (this.options.vertical) {
            if (this.topBoundsReached) {
              this.slider.translateTop = 0;
              this.slider.style.setProperty("transform", `translate3d(0px, ${this.slider.translateTop}px, 0px)`);
            }

            if (this.bottomBoundsReached) {
              this.maxScrollY = this.slider.scrollHeight - this.slider.clientHeight;
              this.slider.translateTop = this.maxScrollY;
              this.slider.style.setProperty("transform", `translate3d(0px, ${-this.slider.translateTop}px, 0px)`);
            }
          }
          else {
          /** Do only when left bounds reached (translateLeft is 0) and slider is scrolling from the left bound */
            if (this.leftBoundsReached) {
              this.slider.translateLeft = 0;
              this.slider.style.setProperty("transform", `translate3d(${this.slider.translateLeft}px, 0px, 0px)`);

              if (this.options.stretchOnDrag) {
                this.stretchOnBounds("positionLeft", ((this.startX - this._page(e).x) / 500), false);
              }
            }

            /** Do only when right bounds reached (translateLeft is greater than slider width) and slider is scrolling from the right bound */
            if (this.rightBoundsReached) {
              this.slider.translateLeft = this.maxScrollX;
              this.slider.style.setProperty("transform", `translate3d(${-this.slider.translateLeft}px, 0px, 0px)`);

              if (this.options.stretchOnDrag) {
                this.stretchOnBounds("positionRight", ((this.startX - (this._page(e).x + this.slider.translateLeft)) / 500), false);
              }
            }
          }
        }

      });
    }

    /**
     * ------------------------------------------------------------------------
     * On pointer up (mouse released or touch end)
     * ------------------------------------------------------------------------
     */

    _onUp() {

      if (!this.options.slide || !this.options.drag) {
        return;
      }

      window.requestAnimationFrame(() => {
        this.isDown = false;

        if(this.dragging) {
          /**
           * Slider snap
           * Add automatic scroll easing to the nearest item's snap area
           */

          if (this.options.vertical) {
            /** +1 Direction: Slider is dragged from bottom to top */
            if (this.distanceY >= 0) {
              /** Find corresponding item with top pull area that includes current translateTop */
              for (let i in this.items) {
                if (this.slider.translateTop >= this.items[i].pullAreaTop_Start && this.slider.translateTop <= this.items[i].pullAreaTop_End) {
                  this.translate(this.items[this.items[i].id].offsetTop);
                }
              }
            }

            /** -1 Direction: Slider is dragged from top to bottom */
            if (this.distanceY < 0) {

              /** Find corresponding item with bottom pull area that includes current translateTop */
              for (let i in this.items) {
                if (this.slider.translateTop <= this.items[i].pullAreaBottom_Start && this.slider.translateTop >= this.items[i].pullAreaBottom_End) {
                  this.translate(this.items[this.items[i].id].offsetTop);
                }
              }

            }
          }
          else {
            /** +1 Direction: Slider is dragged from right to left */
            if (this.distanceX >= 0) {

              /** Find corresponding item with left pull area that includes current translateLeft */
              for (let i in this.items) {
                if (this.slider.translateLeft >= this.items[i].pullAreaLeft_Start && this.slider.translateLeft <= this.items[i].pullAreaLeft_End) {
                  this.translate(this.items[this.items[i].id].offsetLeft);
                }
              }
            }

            /** -1 Direction: Slider is dragged from left to right */
            if (this.distanceX < 0) {

              /** Find corresponding item with right pull area that includes current translateLeft */
              for (let i in this.items) {
                if (this.slider.translateLeft <= this.items[i].pullAreaRight_Start && this.slider.translateLeft >= this.items[i].pullAreaRight_End) {
                  this.translate(this.items[this.items[i].id].offsetLeft);
                }
              }
            }
          }

          /** Set .active class to currently visible items */
          this.setActiveItems();

          /** Revert all transforms (if there is any) back to 0px on mouse button release */
          if(this.options.vertical) {
            if (this.topBoundsReached || this.bottomBoundsReached) {
              for (let i in this.items) {
                this.items[i].element.style.setProperty("transform", "translate3d(0px, 0px, 0px)");
              }
            }
          }
          else {
            if (this.leftBoundsReached || this.rightBoundsReached) {
              for (let i in this.items) {
                this.items[i].element.style.setProperty("transform", "translate3d(0px, 0px, 0px)");
              }
            }
          }

        }

        /** Set dragMove (slider dragging and moving together) to false
         * Used in _onClickSlider() to prevent from link opening on pointer end (mouse up)
         * if item contains <a href> element
         */
        setTimeout(() => {
          this.dragMove = false;
        }, 50);

        this.parent.classList.remove("dragging");
        this.dragging = false;
      });
    }


    /**
     * ------------------------------------------------------------------------
     * Click events
     * ------------------------------------------------------------------------
     */

    /**
     * Click on Previous navigation button
     */

    _onClickPrev(e) {
      e.preventDefault();

      if(this.scrolling) {
        return;
      }

      this.slideTo("prev");
    }

    /**
     * Click on Next navigation button
     */

    _onClickNext(e) {
      e.preventDefault();

      if(this.scrolling) {
        return;
      }

      this.slideTo("next");
    }

    /**
     * Click on dot indicators
     */

    _onClickIndicators(e) {
      e.preventDefault();

      /** Match only [data-tor-slide-to] element as click target */
      if(e.target.matches("[data-tor-slide-to]")) {
        this.slideTo(Number(e.target.getAttribute("data-tor-slide-to")));
      }
    }

    /**
     * Click on whole slider (parent slider or any inner element)
     */

    _onClickSlider(e) {
      /** Disable any click events while pointer is dragging and moving a slider to prevent from link opening */
      if(this.dragMove) {
        e.preventDefault();
        e.stopPropagation();
      }
    }

    /**
     * ------------------------------------------------------------------------
     * On drag start
     *
     * Disable browser dragging behavior when pointer starts to drag a slider
     * ------------------------------------------------------------------------
     */

    _onDragStart(e) {
      e.preventDefault();
      e.stopPropagation();
    }

    /**
     * ------------------------------------------------------------------------
     * On transition end
     * ------------------------------------------------------------------------
     */

    _onTransitionEnd(e) {
      window.requestAnimationFrame(() => {
        /** Wait for the transition end on `.tor-slider-items` element */
        if(e.target.classList.contains("tor-slider-items") && e.propertyName.match("transform")) {
          this.sliding = false;
          this.parent.classList.remove("sliding");
          this.parent.classList.remove("translating");
          this.setShowItems();
        }
      });
    }

    /**
     * ------------------------------------------------------------------------
     * Check bounds
     * ------------------------------------------------------------------------
     */

    checkBounds() {
      this.leftBoundsReached = this.slider.translateLeft <= 0 ? true : false;
      this.rightBoundsReached = this.sliderClientWidth + this.slider.translateLeft >= this.sliderScrollWidth - 1 ? true : false;

      this.topBoundsReached = this.slider.translateTop <= 0 ? true : false;
      this.bottomBoundsReached = this.sliderClientHeight + this.slider.translateTop >= this.sliderScrollHeight - 1 ? true : false;
    }

    /**
     * ------------------------------------------------------------------------
     * Controls
     * ------------------------------------------------------------------------
     */

    /**
     * Create Next/prev controls
     */

    createControls() {
      if(!this.options.controls) {
        return;
      }

      if(this.navigation.controlsElement) {
        this.navigation.controlsElement.remove();
      }

      let controls = {
        prev: "Prev",
        next : "Next",
      };

      this.navigation.controlsElement = document.createElement("nav");
      this.navigation.controlsElement.classList.add("slider-controls");
      this.sliderInner.appendChild(this.navigation.controlsElement);

      for(let [key, value] of Object.entries(controls)) {
        let control;

        control = document.createElement("a");
        control.addEventListener("click", this[`_onClick${value}`].bind(this));
        control.classList.add(`slider-${key}`, "tor-slider-internal");
        control.setAttribute("role", "button");
        control.setAttribute("aria-label", `Slider ${key} button`);
        control.setAttribute("href", "#");
        control.setAttribute("data-tor-slide-to", key);
        this.navigation.controlsElement.appendChild(control);
      }
    }

    /**
     * Create dot indicators
     */

    createIndicators() {
      if(!this.options.indicators) {
        return;
      }

      if(this.navigation.indicatorsElement) {
        this.navigation.indicatorsElement.remove();
      }

      this.navigation.indicatorsElement = document.createElement("nav");
      this.navigation.indicatorsElement.classList.add("slider-indicators");
      this.parent.appendChild(this.navigation.indicatorsElement);
      this.navigation.indicatorsElement.addEventListener("click", this._onClickIndicators.bind(this));
      this.navigation.indicatorsCount = this.allItemsCount / this.options.count;

      for(let i=0; i<this.navigation.indicatorsCount; i++) {
        let indicator;

        indicator = document.createElement("a");
        indicator.setAttribute("href", "#");
        indicator.setAttribute("role", "button");
        indicator.setAttribute("aria-label", `Show the number ${i * this.options.count} slide button`);
        indicator.setAttribute("data-tor-slide-to", i * this.options.count);
        indicator.classList.add("slider-indicator", "tor-slider-internal");
        this.navigation.indicatorsElement.appendChild(indicator);
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Return pageX
     * ------------------------------------------------------------------------
     */

    _page(e) {
      let pageX;
      let pageY;

      switch (this.pointerDevice) {
        case "pointer":
          pageX = e.pageX;
          pageY = e.pageY;
          break;

        case "touch":
          pageX = e.touches[0].pageX;
          pageY = e.touches[0].pageY;
          break;
      }

      // return pageX;
      return {
        x: pageX,
        y: pageY,
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Slide to specific item
     * ------------------------------------------------------------------------
     */

    slideTo(direction) {
      window.requestAnimationFrame(() => {
        let lastSlide = this.activeSlide;

        if(direction === "next") {
          this.distanceX = 0;
          this.distanceY = 0;

          if(this.activeSlide < (this.allItemsCount - this.options.count)) {
            this.parent.classList.add("sliding");
            this.activeSlide++;

            /** Translate the slider to left. Enabled by default */
            if(this.options.slide) {
              // this.translate(this.items[this.activeSlide].offsetLeft);
              // console.log(this.items[this.activeSlide].offsetTop);
              this.options.vertical ? this.translate(this.items[this.activeSlide].offsetTop) : this.translate(this.items[this.activeSlide].offsetLeft);
            }
          }
          else {
            if(this.options.stretchOnClick) {
              this.stretchOnBounds("positionRight", 3, true);
            }
          }
        }

        if(direction === "prev") {
          this.distanceX = 0;

          if(this.activeSlide > 0) {
            this.parent.classList.add("sliding");
            this.activeSlide--;

            /** Translate the slider to right. Enabled by default */
            if(this.options.slide) {
              // this.translate(this.items[this.activeSlide].offsetLeft);
              this.options.vertical ? this.translate(this.items[this.activeSlide].offsetTop) : this.translate(this.items[this.activeSlide].offsetLeft);
            }
          }
          else {
            if(this.options.stretchOnClick) {
              this.stretchOnBounds("positionLeft", -3, true);
            }
          }
        }

        /** SLide to specific item number */
        if(Number(direction) || direction === 0 || direction === "0") {
          // let lastSlide = this.activeSlide;
          direction = Number(direction);
          this.distanceX = 0;
          this.activeSlide = direction;

          /** Only do when user doesn't click on the active dot */
          if(lastSlide !== this.activeSlide) {

            this.parent.classList.add("sliding");

            /** If desired item has offsetLeft greater that maximum scroll, than scroll only to this maximum */
            if (this.items[this.activeSlide]) {

              if (this.options.vertical) {
                if (this.items[this.activeSlide].offsetTop >= this.maxScrollY) {
                  this.translate(this.maxScrollY);
                }
                /** Else scroll to desired offsetLeft of the active item */
                else {
                  this.translate(this.items[this.activeSlide].offsetTop);
                }
              }
              else {
                if (this.items[this.activeSlide].offsetLeft >= this.maxScrollX) {
                  this.translate(this.maxScrollX);
                }
                /** Else scroll to desired offsetLeft of the active item */
                else {
                  this.translate(this.items[this.activeSlide].offsetLeft);
                }
              }

            }
            else {
              console.warn("It looks like you are pointing to non-existing slide in this slider:", this.parent);
            }
          }
        }

        // console.log(this.activeSlide, this.items[this.activeSlide].offsetTop, this.items[this.activeSlide].height);

        /** Set .active class immediately */
        if(lastSlide !== this.activeSlide) {
          this.setActiveItems();
        }

        // if(this.options.slide === false) {
          // this.setShowItems();
        // }

      });
    }

    /**
     * ------------------------------------------------------------------------
     * Translate a slider
     * ------------------------------------------------------------------------
     */

    translate(offset) {
      if (this.options.vertical) {
        this.slider.translateTop = offset;
        this.slider.style.setProperty("transform", `translate3d(0px, ${-this.slider.translateTop}px, 0px)`);
      }
      else {
        this.slider.translateLeft = offset;
        this.slider.style.setProperty("transform", `translate3d(${-this.slider.translateLeft}px, 0px, 0px)`);
      }

      if (this.options.vertical) {
        if (!this.topBoundsReached || !this.bottomBoundsReached) {
          this.parent.classList.add("translating");
        }
        if (this.topBoundsReached || this.bottomBoundsReached) {
          this.parent.classList.remove("translating");
        }
      }
      else {
        if (!this.leftBoundsReached || !this.rightBoundsReached) {
          this.parent.classList.add("translating");
        }
        if (this.leftBoundsReached || this.rightBoundsReached) {
          this.parent.classList.remove("translating");
        }
      }

    }

    /**
     * ------------------------------------------------------------------------
     * Set .show class on visible items
     * ------------------------------------------------------------------------
     */

    setShowItems() {
      for(let i in this.items) {
        this.items[i].element.classList.remove("show");
      }

      /** Add .show class to all visible items */
      for(let i=0; i<this.options.count; i++) {
        if((this.activeSlide + i) < this.allItemsCount) {
          this.items[this.activeSlide + i].element.classList.add("show");
        }
      }

      // this.controlsClicked = false;
    }

    /**
     * ------------------------------------------------------------------------
     * Set active items
     * Find visible items based on pull area
     * ------------------------------------------------------------------------
     */

    setActiveItems(recalculate) {
  		let maxHeight = [];
      this.sliding = true;

      /** Remove all .active class first */
      for(let i in this.items) {
        this.items[i].element.classList.remove("active");

        if(!this.options.slide) {
          this.items[i].element.classList.remove("show");
        }
      }

      for(let i in this.items) {
        this.items[i].element.classList.remove("active");

        if (this.options.vertical) {
          if (this.slider.translateTop >= this.items[i].pullAreaTop_Start && this.slider.translateTop <= this.items[i].pullAreaTop_End || this.slider.translateTop <= this.items[i].pullAreaBottom_Start && this.slider.translateTop >= this.items[i].pullAreaBottom_End) {
            this.activeSlide = this.items[i].id;
          }
        }
        else {
          if (this.slider.translateLeft >= this.items[i].pullAreaLeft_Start && this.slider.translateLeft <= this.items[i].pullAreaLeft_End || this.slider.translateLeft <= this.items[i].pullAreaRight_Start && this.slider.translateLeft >= this.items[i].pullAreaRight_End) {
            this.activeSlide = this.items[i].id;
          }
        }
      }

      if(recalculate) {
        this.slider.translateLeft = this.items[this.activeSlide].offsetLeft;
        this.slider.style.setProperty("transform", `translate3d(${-this.slider.translateLeft}px, 0px, 0px)`);
      }

      /** Add .active class to all visible items */
      for(let i=0; i<this.options.count; i++) {
        if((this.activeSlide + i) < this.allItemsCount) {

  				maxHeight.push(this.items[this.activeSlide + i].height);

          /** Small delay before adding new class so the browser will not apply an `active` state immediately */
          setTimeout(() => {
            this.items[this.activeSlide + i].element.classList.add("active");
          }, 10);

          /** If the sliding is disabled by `slide(false)` */
          if(!this.options.slide) {
            setTimeout(() => {
              this.items[this.activeSlide + i].element.classList.add("show");
            }, 10);
          }
        }
  		}

  		if (this.options.autoHeight) {
        let sum = 0;
        let margin = (this.options.count - 1) * this.options.margin;

        for (let item of maxHeight) {
          sum = item + sum;
        }

        this.parent.style.setProperty("--tor-slider-height", `${ this.options.vertical ? sum + margin : Math.max(...maxHeight) }px`);
  		}

      if(this.options.indicators) {
        for(let indicator of this.navigation.indicatorsElement.querySelectorAll("[data-tor-slide-to]")) {
          indicator.classList.remove("active");
        }

        if(this.activeSlide + this.options.count < this.allItemsCount) {
          this.navigation.indicatorsElement.querySelector(`[data-tor-slide-to="${parseInt(this.activeSlide / this.options.count) * this.options.count}"]`).classList.add("active");
        }
        else {
          this.navigation.indicatorsElement.querySelector(`[data-tor-slide-to]:last-child`).classList.add("active");
        }
      }

    }

    /**
     * Left/right bounds has reached while dragging
     */

    compressOnBounds(distance, direction, autoResetPosition) {
      let t;
      let ease;
      let boundDistance;

      t = (1 - (1 + this.distanceX * (direction))) / 1000;
      ease = TORUS.Util.easing.easeOutQuad(t);
      boundDistance = (distance * (direction)) * ease;

      for(let i in this.items) {
        if(direction === 1) {
          this.items[i].element.style.setProperty("transform", `translate3d(${boundDistance - ((this.items[i].positionLeft*(distance/5))*ease) }px, 0px, 0px)`);
        }
        if(direction === -1) {
          this.items[i].element.style.setProperty("transform", `translate3d(${boundDistance + ((this.items[i].positionRight*(distance/5))*ease) }px, 0px, 0px)`);
        }
      }

      if(autoResetPosition) {
        setTimeout(() => {
          for(let i in this.items) {
            this.items[i].element.style.setProperty("transform", `translate3d(0px, 0px, 0px)`);
          }
        }, 200);
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Stretch on bounds
     *
     * Stretch space between items while dragging when left/right bound has been reached
     * ------------------------------------------------------------------------
     */

    stretchOnBounds(position, value, autoResetPosition) {
      for(let i in this.items) {
        this.items[i].element.style.setProperty("transform", `translate3d(${(-value)*( this.items[i][position] * this.items[i][position])}px, 0px, 0px)`);
      }

      if(autoResetPosition) {
        for(let i in this.items) {
          setTimeout(() => {
            this.items[i].element.style.setProperty("transform", `translate3d(0px, 0px, 0px)`);
          }, 200);
        }
      }
    }

    /**
     * ------------------------------------------------------------------------
     * Get element bounds
     * ------------------------------------------------------------------------
     */

    _getBounds() {
      this.bounds.calculated = false;
      INTERSECTION_OBSERVER.observe(this.parent);
    }

    /**
     * ------------------------------------------------------------------------
     * Set element bounds
     * ------------------------------------------------------------------------
     */

    _setBounds(bounds) {
      let B = this.bounds;

      B.calculated  = true;
      B.rect        = bounds;
      B.top         = B.rect.top;
      B.right       = B.rect.right;
      B.bottom      = B.rect.bottom;
      B.left        = B.rect.left;
      B.offsetLeft  = B.left + WINDOW.scroll.x;
      B.offsetTop   = B.top + WINDOW.scroll.y;
      B.width       = B.rect.width;
      B.height       = B.rect.height;

      // this.element.style.removeProperty("visibility");

      this.setDimensions();
    }


    /**
     * ------------------------------------------------------------------------
     * Refresh
     * ------------------------------------------------------------------------
     */

    _refresh() {
      this.get.bounds();
      this.setDimensions();
      this.setProperties();
      this.setNavigation();
      this.setActiveItems(true);
      this.setShowItems();
    }

    /**
     * ------------------------------------------------------------------------
     * Public methods
     * ------------------------------------------------------------------------
     */

    /**
     * Refresh slider
     */

    static refresh(elements) {
      callFunction({elements: getIterableElement(elements || ".tor-slider"), object: "Slider", fn: "_refresh"});
    }

    /**
     * Slide to
     */

    static slideTo(elements, direction) {
      callFunction({elements: getIterableElement(elements || ".tor-slider"), object: "Slider", fn: "slideTo", argument: direction});
    }

    /**
     * External controls
     */

    static createExternalControls() {
      for (const control of document.querySelectorAll("[data-tor-slide-to]:not(.tor-slider-internal)")) {
        let targets;

        if (control.hasAttribute("data-tor-slide-target")) {
          targets = document.querySelectorAll(control.getAttribute("data-tor-slide-target"));
        }
        else {
          targets = document.querySelectorAll(/[^\/]+$/.exec(control.href)[0]);
        }
        // let targets = document.querySelectorAll(control.getAttribute("data-tor-slide-target")) || document.querySelectorAll(/[^\/]+$/.exec(control.href)[0]);
        let slideTo = control.getAttribute("data-tor-slide-to");

        control.addEventListener("click", (e) => {
          e.preventDefault();
          for (const target of targets) {
            TORUS.Slider.slideTo(target, slideTo);
          }
        });
      }
    }

    /**
     * Init
     */

    static init(elements, options) {
      elements = getIterableElement(elements || ".tor-slider");
      initClass({name: "Slider", elements: elements, options: options});

      this.createExternalControls();
    }
  };

  // TORUS.Slider.init();
  // onLoad("Slider", "load", getIterableElement(".tor-slider"))
  window.addEventListener("load", () => { TORUS.Slider.init(); });

  var slider = TORUS.Slider;

  exports.group = group;
  exports.main = main;
  exports.parent = parent;
  exports.slider = slider;

  Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=toruskit.js.map
