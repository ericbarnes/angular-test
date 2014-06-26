(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
module.exports = function($scope) {
    $scope.testVar = 'We are up and running!';
};

}).call(this,require("DF1urx"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/controllers/main.js","/controllers")
},{"DF1urx":10,"buffer":7}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var PostsCtrl = function($scope, $http) {
    $http.get('api/posts').success(function(data) {
        $scope.posts = data;
    });
};

module.exports = PostsCtrl;

}).call(this,require("DF1urx"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/controllers/posts.js","/controllers")
},{"DF1urx":10,"buffer":7}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
require('angular');
var router = require('angular-ui-router');

var app = angular.module('app', [router]);

app.config(function($stateProvider, $urlRouterProvider) {

    // For any unmatched url, redirect to home /
    $urlRouterProvider.otherwise("/");

    // Now set up the states
    $stateProvider
        .state('home', {
            url: "/",
            templateUrl: 'views/home.html',
            controller: require('./controllers/main')
        })
        .state('posts', {
            url: "/posts",
            templateUrl: "views/posts.html",
            controller: require('./controllers/posts')
        })
});

}).call(this,require("DF1urx"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_f05f890c.js","/")
},{"./controllers/main":1,"./controllers/posts":2,"DF1urx":10,"angular":5,"angular-ui-router":4,"buffer":7}],4:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/**
 * State-based routing for AngularJS
 * @version v0.2.10
 * @link http://angular-ui.github.com/
 * @license MIT License, http://www.opensource.org/licenses/MIT
 */

/* commonjs package manager support (eg componentjs) */
if (typeof module !== "undefined" && typeof exports !== "undefined" && module.exports === exports){
  module.exports = 'ui.router';
}

(function (window, angular, undefined) {
/*jshint globalstrict:true*/
/*global angular:false*/
'use strict';

var isDefined = angular.isDefined,
    isFunction = angular.isFunction,
    isString = angular.isString,
    isObject = angular.isObject,
    isArray = angular.isArray,
    forEach = angular.forEach,
    extend = angular.extend,
    copy = angular.copy;

function inherit(parent, extra) {
  return extend(new (extend(function() {}, { prototype: parent }))(), extra);
}

function merge(dst) {
  forEach(arguments, function(obj) {
    if (obj !== dst) {
      forEach(obj, function(value, key) {
        if (!dst.hasOwnProperty(key)) dst[key] = value;
      });
    }
  });
  return dst;
}

/**
 * Finds the common ancestor path between two states.
 *
 * @param {Object} first The first state.
 * @param {Object} second The second state.
 * @return {Array} Returns an array of state names in descending order, not including the root.
 */
function ancestors(first, second) {
  var path = [];

  for (var n in first.path) {
    if (first.path[n] !== second.path[n]) break;
    path.push(first.path[n]);
  }
  return path;
}

/**
 * IE8-safe wrapper for `Object.keys()`.
 *
 * @param {Object} object A JavaScript object.
 * @return {Array} Returns the keys of the object as an array.
 */
function keys(object) {
  if (Object.keys) {
    return Object.keys(object);
  }
  var result = [];

  angular.forEach(object, function(val, key) {
    result.push(key);
  });
  return result;
}

/**
 * IE8-safe wrapper for `Array.prototype.indexOf()`.
 *
 * @param {Array} array A JavaScript array.
 * @param {*} value A value to search the array for.
 * @return {Number} Returns the array index value of `value`, or `-1` if not present.
 */
function arraySearch(array, value) {
  if (Array.prototype.indexOf) {
    return array.indexOf(value, Number(arguments[2]) || 0);
  }
  var len = array.length >>> 0, from = Number(arguments[2]) || 0;
  from = (from < 0) ? Math.ceil(from) : Math.floor(from);

  if (from < 0) from += len;

  for (; from < len; from++) {
    if (from in array && array[from] === value) return from;
  }
  return -1;
}

/**
 * Merges a set of parameters with all parameters inherited between the common parents of the
 * current state and a given destination state.
 *
 * @param {Object} currentParams The value of the current state parameters ($stateParams).
 * @param {Object} newParams The set of parameters which will be composited with inherited params.
 * @param {Object} $current Internal definition of object representing the current state.
 * @param {Object} $to Internal definition of object representing state to transition to.
 */
function inheritParams(currentParams, newParams, $current, $to) {
  var parents = ancestors($current, $to), parentParams, inherited = {}, inheritList = [];

  for (var i in parents) {
    if (!parents[i].params || !parents[i].params.length) continue;
    parentParams = parents[i].params;

    for (var j in parentParams) {
      if (arraySearch(inheritList, parentParams[j]) >= 0) continue;
      inheritList.push(parentParams[j]);
      inherited[parentParams[j]] = currentParams[parentParams[j]];
    }
  }
  return extend({}, inherited, newParams);
}

/**
 * Normalizes a set of values to string or `null`, filtering them by a list of keys.
 *
 * @param {Array} keys The list of keys to normalize/return.
 * @param {Object} values An object hash of values to normalize.
 * @return {Object} Returns an object hash of normalized string values.
 */
function normalize(keys, values) {
  var normalized = {};

  forEach(keys, function (name) {
    var value = values[name];
    normalized[name] = (value != null) ? String(value) : null;
  });
  return normalized;
}

/**
 * Performs a non-strict comparison of the subset of two objects, defined by a list of keys.
 *
 * @param {Object} a The first object.
 * @param {Object} b The second object.
 * @param {Array} keys The list of keys within each object to compare. If the list is empty or not specified,
 *                     it defaults to the list of keys in `a`.
 * @return {Boolean} Returns `true` if the keys match, otherwise `false`.
 */
function equalForKeys(a, b, keys) {
  if (!keys) {
    keys = [];
    for (var n in a) keys.push(n); // Used instead of Object.keys() for IE8 compatibility
  }

  for (var i=0; i<keys.length; i++) {
    var k = keys[i];
    if (a[k] != b[k]) return false; // Not '===', values aren't necessarily normalized
  }
  return true;
}

/**
 * Returns the subset of an object, based on a list of keys.
 *
 * @param {Array} keys
 * @param {Object} values
 * @return {Boolean} Returns a subset of `values`.
 */
function filterByKeys(keys, values) {
  var filtered = {};

  forEach(keys, function (name) {
    filtered[name] = values[name];
  });
  return filtered;
}
/**
 * @ngdoc overview
 * @name ui.router.util
 *
 * @description
 * # ui.router.util sub-module
 *
 * This module is a dependency of other sub-modules. Do not include this module as a dependency
 * in your angular app (use {@link ui.router} module instead).
 *
 */
angular.module('ui.router.util', ['ng']);

/**
 * @ngdoc overview
 * @name ui.router.router
 * 
 * @requires ui.router.util
 *
 * @description
 * # ui.router.router sub-module
 *
 * This module is a dependency of other sub-modules. Do not include this module as a dependency
 * in your angular app (use {@link ui.router} module instead).
 */
angular.module('ui.router.router', ['ui.router.util']);

/**
 * @ngdoc overview
 * @name ui.router.state
 * 
 * @requires ui.router.router
 * @requires ui.router.util
 *
 * @description
 * # ui.router.state sub-module
 *
 * This module is a dependency of the main ui.router module. Do not include this module as a dependency
 * in your angular app (use {@link ui.router} module instead).
 * 
 */
angular.module('ui.router.state', ['ui.router.router', 'ui.router.util']);

/**
 * @ngdoc overview
 * @name ui.router
 *
 * @requires ui.router.state
 *
 * @description
 * # ui.router
 * 
 * ## The main module for ui.router 
 * There are several sub-modules included with the ui.router module, however only this module is needed
 * as a dependency within your angular app. The other modules are for organization purposes. 
 *
 * The modules are:
 * * ui.router - the main "umbrella" module
 * * ui.router.router - 
 * 
 * *You'll need to include **only** this module as the dependency within your angular app.*
 * 
 * <pre>
 * <!doctype html>
 * <html ng-app="myApp">
 * <head>
 *   <script src="js/angular.js"></script>
 *   <!-- Include the ui-router script -->
 *   <script src="js/angular-ui-router.min.js"></script>
 *   <script>
 *     // ...and add 'ui.router' as a dependency
 *     var myApp = angular.module('myApp', ['ui.router']);
 *   </script>
 * </head>
 * <body>
 * </body>
 * </html>
 * </pre>
 */
angular.module('ui.router', ['ui.router.state']);

angular.module('ui.router.compat', ['ui.router']);

/**
 * @ngdoc object
 * @name ui.router.util.$resolve
 *
 * @requires $q
 * @requires $injector
 *
 * @description
 * Manages resolution of (acyclic) graphs of promises.
 */
$Resolve.$inject = ['$q', '$injector'];
function $Resolve(  $q,    $injector) {
  
  var VISIT_IN_PROGRESS = 1,
      VISIT_DONE = 2,
      NOTHING = {},
      NO_DEPENDENCIES = [],
      NO_LOCALS = NOTHING,
      NO_PARENT = extend($q.when(NOTHING), { $$promises: NOTHING, $$values: NOTHING });
  

  /**
   * @ngdoc function
   * @name ui.router.util.$resolve#study
   * @methodOf ui.router.util.$resolve
   *
   * @description
   * Studies a set of invocables that are likely to be used multiple times.
   * <pre>
   * $resolve.study(invocables)(locals, parent, self)
   * </pre>
   * is equivalent to
   * <pre>
   * $resolve.resolve(invocables, locals, parent, self)
   * </pre>
   * but the former is more efficient (in fact `resolve` just calls `study` 
   * internally).
   *
   * @param {object} invocables Invocable objects
   * @return {function} a function to pass in locals, parent and self
   */
  this.study = function (invocables) {
    if (!isObject(invocables)) throw new Error("'invocables' must be an object");
    
    // Perform a topological sort of invocables to build an ordered plan
    var plan = [], cycle = [], visited = {};
    function visit(value, key) {
      if (visited[key] === VISIT_DONE) return;
      
      cycle.push(key);
      if (visited[key] === VISIT_IN_PROGRESS) {
        cycle.splice(0, cycle.indexOf(key));
        throw new Error("Cyclic dependency: " + cycle.join(" -> "));
      }
      visited[key] = VISIT_IN_PROGRESS;
      
      if (isString(value)) {
        plan.push(key, [ function() { return $injector.get(value); }], NO_DEPENDENCIES);
      } else {
        var params = $injector.annotate(value);
        forEach(params, function (param) {
          if (param !== key && invocables.hasOwnProperty(param)) visit(invocables[param], param);
        });
        plan.push(key, value, params);
      }
      
      cycle.pop();
      visited[key] = VISIT_DONE;
    }
    forEach(invocables, visit);
    invocables = cycle = visited = null; // plan is all that's required
    
    function isResolve(value) {
      return isObject(value) && value.then && value.$$promises;
    }
    
    return function (locals, parent, self) {
      if (isResolve(locals) && self === undefined) {
        self = parent; parent = locals; locals = null;
      }
      if (!locals) locals = NO_LOCALS;
      else if (!isObject(locals)) {
        throw new Error("'locals' must be an object");
      }       
      if (!parent) parent = NO_PARENT;
      else if (!isResolve(parent)) {
        throw new Error("'parent' must be a promise returned by $resolve.resolve()");
      }
      
      // To complete the overall resolution, we have to wait for the parent
      // promise and for the promise for each invokable in our plan.
      var resolution = $q.defer(),
          result = resolution.promise,
          promises = result.$$promises = {},
          values = extend({}, locals),
          wait = 1 + plan.length/3,
          merged = false;
          
      function done() {
        // Merge parent values we haven't got yet and publish our own $$values
        if (!--wait) {
          if (!merged) merge(values, parent.$$values); 
          result.$$values = values;
          result.$$promises = true; // keep for isResolve()
          resolution.resolve(values);
        }
      }
      
      function fail(reason) {
        result.$$failure = reason;
        resolution.reject(reason);
      }
      
      // Short-circuit if parent has already failed
      if (isDefined(parent.$$failure)) {
        fail(parent.$$failure);
        return result;
      }
      
      // Merge parent values if the parent has already resolved, or merge
      // parent promises and wait if the parent resolve is still in progress.
      if (parent.$$values) {
        merged = merge(values, parent.$$values);
        done();
      } else {
        extend(promises, parent.$$promises);
        parent.then(done, fail);
      }
      
      // Process each invocable in the plan, but ignore any where a local of the same name exists.
      for (var i=0, ii=plan.length; i<ii; i+=3) {
        if (locals.hasOwnProperty(plan[i])) done();
        else invoke(plan[i], plan[i+1], plan[i+2]);
      }
      
      function invoke(key, invocable, params) {
        // Create a deferred for this invocation. Failures will propagate to the resolution as well.
        var invocation = $q.defer(), waitParams = 0;
        function onfailure(reason) {
          invocation.reject(reason);
          fail(reason);
        }
        // Wait for any parameter that we have a promise for (either from parent or from this
        // resolve; in that case study() will have made sure it's ordered before us in the plan).
        forEach(params, function (dep) {
          if (promises.hasOwnProperty(dep) && !locals.hasOwnProperty(dep)) {
            waitParams++;
            promises[dep].then(function (result) {
              values[dep] = result;
              if (!(--waitParams)) proceed();
            }, onfailure);
          }
        });
        if (!waitParams) proceed();
        function proceed() {
          if (isDefined(result.$$failure)) return;
          try {
            invocation.resolve($injector.invoke(invocable, self, values));
            invocation.promise.then(function (result) {
              values[key] = result;
              done();
            }, onfailure);
          } catch (e) {
            onfailure(e);
          }
        }
        // Publish promise synchronously; invocations further down in the plan may depend on it.
        promises[key] = invocation.promise;
      }
      
      return result;
    };
  };
  
  /**
   * @ngdoc function
   * @name ui.router.util.$resolve#resolve
   * @methodOf ui.router.util.$resolve
   *
   * @description
   * Resolves a set of invocables. An invocable is a function to be invoked via 
   * `$injector.invoke()`, and can have an arbitrary number of dependencies. 
   * An invocable can either return a value directly,
   * or a `$q` promise. If a promise is returned it will be resolved and the 
   * resulting value will be used instead. Dependencies of invocables are resolved 
   * (in this order of precedence)
   *
   * - from the specified `locals`
   * - from another invocable that is part of this `$resolve` call
   * - from an invocable that is inherited from a `parent` call to `$resolve` 
   *   (or recursively
   * - from any ancestor `$resolve` of that parent).
   *
   * The return value of `$resolve` is a promise for an object that contains 
   * (in this order of precedence)
   *
   * - any `locals` (if specified)
   * - the resolved return values of all injectables
   * - any values inherited from a `parent` call to `$resolve` (if specified)
   *
   * The promise will resolve after the `parent` promise (if any) and all promises 
   * returned by injectables have been resolved. If any invocable 
   * (or `$injector.invoke`) throws an exception, or if a promise returned by an 
   * invocable is rejected, the `$resolve` promise is immediately rejected with the 
   * same error. A rejection of a `parent` promise (if specified) will likewise be 
   * propagated immediately. Once the `$resolve` promise has been rejected, no 
   * further invocables will be called.
   * 
   * Cyclic dependencies between invocables are not permitted and will caues `$resolve`
   * to throw an error. As a special case, an injectable can depend on a parameter 
   * with the same name as the injectable, which will be fulfilled from the `parent` 
   * injectable of the same name. This allows inherited values to be decorated. 
   * Note that in this case any other injectable in the same `$resolve` with the same
   * dependency would see the decorated value, not the inherited value.
   *
   * Note that missing dependencies -- unlike cyclic dependencies -- will cause an 
   * (asynchronous) rejection of the `$resolve` promise rather than a (synchronous) 
   * exception.
   *
   * Invocables are invoked eagerly as soon as all dependencies are available. 
   * This is true even for dependencies inherited from a `parent` call to `$resolve`.
   *
   * As a special case, an invocable can be a string, in which case it is taken to 
   * be a service name to be passed to `$injector.get()`. This is supported primarily 
   * for backwards-compatibility with the `resolve` property of `$routeProvider` 
   * routes.
   *
   * @param {object} invocables functions to invoke or 
   * `$injector` services to fetch.
   * @param {object} locals  values to make available to the injectables
   * @param {object} parent  a promise returned by another call to `$resolve`.
   * @param {object} self  the `this` for the invoked methods
   * @return {object} Promise for an object that contains the resolved return value
   * of all invocables, as well as any inherited and local values.
   */
  this.resolve = function (invocables, locals, parent, self) {
    return this.study(invocables)(locals, parent, self);
  };
}

angular.module('ui.router.util').service('$resolve', $Resolve);


/**
 * @ngdoc object
 * @name ui.router.util.$templateFactory
 *
 * @requires $http
 * @requires $templateCache
 * @requires $injector
 *
 * @description
 * Service. Manages loading of templates.
 */
$TemplateFactory.$inject = ['$http', '$templateCache', '$injector'];
function $TemplateFactory(  $http,   $templateCache,   $injector) {

  /**
   * @ngdoc function
   * @name ui.router.util.$templateFactory#fromConfig
   * @methodOf ui.router.util.$templateFactory
   *
   * @description
   * Creates a template from a configuration object. 
   *
   * @param {object} config Configuration object for which to load a template. 
   * The following properties are search in the specified order, and the first one 
   * that is defined is used to create the template:
   *
   * @param {string|object} config.template html string template or function to 
   * load via {@link ui.router.util.$templateFactory#fromString fromString}.
   * @param {string|object} config.templateUrl url to load or a function returning 
   * the url to load via {@link ui.router.util.$templateFactory#fromUrl fromUrl}.
   * @param {Function} config.templateProvider function to invoke via 
   * {@link ui.router.util.$templateFactory#fromProvider fromProvider}.
   * @param {object} params  Parameters to pass to the template function.
   * @param {object} locals Locals to pass to `invoke` if the template is loaded 
   * via a `templateProvider`. Defaults to `{ params: params }`.
   *
   * @return {string|object}  The template html as a string, or a promise for 
   * that string,or `null` if no template is configured.
   */
  this.fromConfig = function (config, params, locals) {
    return (
      isDefined(config.template) ? this.fromString(config.template, params) :
      isDefined(config.templateUrl) ? this.fromUrl(config.templateUrl, params) :
      isDefined(config.templateProvider) ? this.fromProvider(config.templateProvider, params, locals) :
      null
    );
  };

  /**
   * @ngdoc function
   * @name ui.router.util.$templateFactory#fromString
   * @methodOf ui.router.util.$templateFactory
   *
   * @description
   * Creates a template from a string or a function returning a string.
   *
   * @param {string|object} template html template as a string or function that 
   * returns an html template as a string.
   * @param {object} params Parameters to pass to the template function.
   *
   * @return {string|object} The template html as a string, or a promise for that 
   * string.
   */
  this.fromString = function (template, params) {
    return isFunction(template) ? template(params) : template;
  };

  /**
   * @ngdoc function
   * @name ui.router.util.$templateFactory#fromUrl
   * @methodOf ui.router.util.$templateFactory
   * 
   * @description
   * Loads a template from the a URL via `$http` and `$templateCache`.
   *
   * @param {string|Function} url url of the template to load, or a function 
   * that returns a url.
   * @param {Object} params Parameters to pass to the url function.
   * @return {string|Promise.<string>} The template html as a string, or a promise 
   * for that string.
   */
  this.fromUrl = function (url, params) {
    if (isFunction(url)) url = url(params);
    if (url == null) return null;
    else return $http
        .get(url, { cache: $templateCache })
        .then(function(response) { return response.data; });
  };

  /**
   * @ngdoc function
   * @name ui.router.util.$templateFactory#fromUrl
   * @methodOf ui.router.util.$templateFactory
   *
   * @description
   * Creates a template by invoking an injectable provider function.
   *
   * @param {Function} provider Function to invoke via `$injector.invoke`
   * @param {Object} params Parameters for the template.
   * @param {Object} locals Locals to pass to `invoke`. Defaults to 
   * `{ params: params }`.
   * @return {string|Promise.<string>} The template html as a string, or a promise 
   * for that string.
   */
  this.fromProvider = function (provider, params, locals) {
    return $injector.invoke(provider, null, locals || { params: params });
  };
}

angular.module('ui.router.util').service('$templateFactory', $TemplateFactory);

/**
 * @ngdoc object
 * @name ui.router.util.type:UrlMatcher
 *
 * @description
 * Matches URLs against patterns and extracts named parameters from the path or the search
 * part of the URL. A URL pattern consists of a path pattern, optionally followed by '?' and a list
 * of search parameters. Multiple search parameter names are separated by '&'. Search parameters
 * do not influence whether or not a URL is matched, but their values are passed through into
 * the matched parameters returned by {@link ui.router.util.type:UrlMatcher#methods_exec exec}.
 * 
 * Path parameter placeholders can be specified using simple colon/catch-all syntax or curly brace
 * syntax, which optionally allows a regular expression for the parameter to be specified:
 *
 * * `':'` name - colon placeholder
 * * `'*'` name - catch-all placeholder
 * * `'{' name '}'` - curly placeholder
 * * `'{' name ':' regexp '}'` - curly placeholder with regexp. Should the regexp itself contain
 *   curly braces, they must be in matched pairs or escaped with a backslash.
 *
 * Parameter names may contain only word characters (latin letters, digits, and underscore) and
 * must be unique within the pattern (across both path and search parameters). For colon 
 * placeholders or curly placeholders without an explicit regexp, a path parameter matches any
 * number of characters other than '/'. For catch-all placeholders the path parameter matches
 * any number of characters.
 * 
 * Examples:
 * 
 * * `'/hello/'` - Matches only if the path is exactly '/hello/'. There is no special treatment for
 *   trailing slashes, and patterns have to match the entire path, not just a prefix.
 * * `'/user/:id'` - Matches '/user/bob' or '/user/1234!!!' or even '/user/' but not '/user' or
 *   '/user/bob/details'. The second path segment will be captured as the parameter 'id'.
 * * `'/user/{id}'` - Same as the previous example, but using curly brace syntax.
 * * `'/user/{id:[^/]*}'` - Same as the previous example.
 * * `'/user/{id:[0-9a-fA-F]{1,8}}'` - Similar to the previous example, but only matches if the id
 *   parameter consists of 1 to 8 hex digits.
 * * `'/files/{path:.*}'` - Matches any URL starting with '/files/' and captures the rest of the
 *   path into the parameter 'path'.
 * * `'/files/*path'` - ditto.
 *
 * @param {string} pattern  the pattern to compile into a matcher.
 *
 * @property {string} prefix  A static prefix of this pattern. The matcher guarantees that any
 *   URL matching this matcher (i.e. any string for which {@link ui.router.util.type:UrlMatcher#methods_exec exec()} returns
 *   non-null) will start with this prefix.
 *
 * @property {string} source  The pattern that was passed into the contructor
 *
 * @property {string} sourcePath  The path portion of the source property
 *
 * @property {string} sourceSearch  The search portion of the source property
 *
 * @property {string} regex  The constructed regex that will be used to match against the url when 
 *   it is time to determine which url will match.
 *
 * @returns {Object}  New UrlMatcher object
 */
function UrlMatcher(pattern) {

  // Find all placeholders and create a compiled pattern, using either classic or curly syntax:
  //   '*' name
  //   ':' name
  //   '{' name '}'
  //   '{' name ':' regexp '}'
  // The regular expression is somewhat complicated due to the need to allow curly braces
  // inside the regular expression. The placeholder regexp breaks down as follows:
  //    ([:*])(\w+)               classic placeholder ($1 / $2)
  //    \{(\w+)(?:\:( ... ))?\}   curly brace placeholder ($3) with optional regexp ... ($4)
  //    (?: ... | ... | ... )+    the regexp consists of any number of atoms, an atom being either
  //    [^{}\\]+                  - anything other than curly braces or backslash
  //    \\.                       - a backslash escape
  //    \{(?:[^{}\\]+|\\.)*\}     - a matched set of curly braces containing other atoms
  var placeholder = /([:*])(\w+)|\{(\w+)(?:\:((?:[^{}\\]+|\\.|\{(?:[^{}\\]+|\\.)*\})+))?\}/g,
      names = {}, compiled = '^', last = 0, m,
      segments = this.segments = [],
      params = this.params = [];

  function addParameter(id) {
    if (!/^\w+(-+\w+)*$/.test(id)) throw new Error("Invalid parameter name '" + id + "' in pattern '" + pattern + "'");
    if (names[id]) throw new Error("Duplicate parameter name '" + id + "' in pattern '" + pattern + "'");
    names[id] = true;
    params.push(id);
  }

  function quoteRegExp(string) {
    return string.replace(/[\\\[\]\^$*+?.()|{}]/g, "\\$&");
  }

  this.source = pattern;

  // Split into static segments separated by path parameter placeholders.
  // The number of segments is always 1 more than the number of parameters.
  var id, regexp, segment;
  while ((m = placeholder.exec(pattern))) {
    id = m[2] || m[3]; // IE[78] returns '' for unmatched groups instead of null
    regexp = m[4] || (m[1] == '*' ? '.*' : '[^/]*');
    segment = pattern.substring(last, m.index);
    if (segment.indexOf('?') >= 0) break; // we're into the search part
    compiled += quoteRegExp(segment) + '(' + regexp + ')';
    addParameter(id);
    segments.push(segment);
    last = placeholder.lastIndex;
  }
  segment = pattern.substring(last);

  // Find any search parameter names and remove them from the last segment
  var i = segment.indexOf('?');
  if (i >= 0) {
    var search = this.sourceSearch = segment.substring(i);
    segment = segment.substring(0, i);
    this.sourcePath = pattern.substring(0, last+i);

    // Allow parameters to be separated by '?' as well as '&' to make concat() easier
    forEach(search.substring(1).split(/[&?]/), addParameter);
  } else {
    this.sourcePath = pattern;
    this.sourceSearch = '';
  }

  compiled += quoteRegExp(segment) + '$';
  segments.push(segment);
  this.regexp = new RegExp(compiled);
  this.prefix = segments[0];
}

/**
 * @ngdoc function
 * @name ui.router.util.type:UrlMatcher#concat
 * @methodOf ui.router.util.type:UrlMatcher
 *
 * @description
 * Returns a new matcher for a pattern constructed by appending the path part and adding the
 * search parameters of the specified pattern to this pattern. The current pattern is not
 * modified. This can be understood as creating a pattern for URLs that are relative to (or
 * suffixes of) the current pattern.
 *
 * @example
 * The following two matchers are equivalent:
 * ```
 * new UrlMatcher('/user/{id}?q').concat('/details?date');
 * new UrlMatcher('/user/{id}/details?q&date');
 * ```
 *
 * @param {string} pattern  The pattern to append.
 * @returns {ui.router.util.type:UrlMatcher}  A matcher for the concatenated pattern.
 */
UrlMatcher.prototype.concat = function (pattern) {
  // Because order of search parameters is irrelevant, we can add our own search
  // parameters to the end of the new pattern. Parse the new pattern by itself
  // and then join the bits together, but it's much easier to do this on a string level.
  return new UrlMatcher(this.sourcePath + pattern + this.sourceSearch);
};

UrlMatcher.prototype.toString = function () {
  return this.source;
};

/**
 * @ngdoc function
 * @name ui.router.util.type:UrlMatcher#exec
 * @methodOf ui.router.util.type:UrlMatcher
 *
 * @description
 * Tests the specified path against this matcher, and returns an object containing the captured
 * parameter values, or null if the path does not match. The returned object contains the values
 * of any search parameters that are mentioned in the pattern, but their value may be null if
 * they are not present in `searchParams`. This means that search parameters are always treated
 * as optional.
 *
 * @example
 * ```
 * new UrlMatcher('/user/{id}?q&r').exec('/user/bob', { x:'1', q:'hello' });
 * // returns { id:'bob', q:'hello', r:null }
 * ```
 *
 * @param {string} path  The URL path to match, e.g. `$location.path()`.
 * @param {Object} searchParams  URL search parameters, e.g. `$location.search()`.
 * @returns {Object}  The captured parameter values.
 */
UrlMatcher.prototype.exec = function (path, searchParams) {
  var m = this.regexp.exec(path);
  if (!m) return null;

  var params = this.params, nTotal = params.length,
    nPath = this.segments.length-1,
    values = {}, i;

  if (nPath !== m.length - 1) throw new Error("Unbalanced capture group in route '" + this.source + "'");

  for (i=0; i<nPath; i++) values[params[i]] = m[i+1];
  for (/**/; i<nTotal; i++) values[params[i]] = searchParams[params[i]];

  return values;
};

/**
 * @ngdoc function
 * @name ui.router.util.type:UrlMatcher#parameters
 * @methodOf ui.router.util.type:UrlMatcher
 *
 * @description
 * Returns the names of all path and search parameters of this pattern in an unspecified order.
 * 
 * @returns {Array.<string>}  An array of parameter names. Must be treated as read-only. If the
 *    pattern has no parameters, an empty array is returned.
 */
UrlMatcher.prototype.parameters = function () {
  return this.params;
};

/**
 * @ngdoc function
 * @name ui.router.util.type:UrlMatcher#format
 * @methodOf ui.router.util.type:UrlMatcher
 *
 * @description
 * Creates a URL that matches this pattern by substituting the specified values
 * for the path and search parameters. Null values for path parameters are
 * treated as empty strings.
 *
 * @example
 * ```
 * new UrlMatcher('/user/{id}?q').format({ id:'bob', q:'yes' });
 * // returns '/user/bob?q=yes'
 * ```
 *
 * @param {Object} values  the values to substitute for the parameters in this pattern.
 * @returns {string}  the formatted URL (path and optionally search part).
 */
UrlMatcher.prototype.format = function (values) {
  var segments = this.segments, params = this.params;
  if (!values) return segments.join('');

  var nPath = segments.length-1, nTotal = params.length,
    result = segments[0], i, search, value;

  for (i=0; i<nPath; i++) {
    value = values[params[i]];
    // TODO: Maybe we should throw on null here? It's not really good style to use '' and null interchangeabley
    if (value != null) result += encodeURIComponent(value);
    result += segments[i+1];
  }
  for (/**/; i<nTotal; i++) {
    value = values[params[i]];
    if (value != null) {
      result += (search ? '&' : '?') + params[i] + '=' + encodeURIComponent(value);
      search = true;
    }
  }

  return result;
};



/**
 * @ngdoc object
 * @name ui.router.util.$urlMatcherFactory
 *
 * @description
 * Factory for {@link ui.router.util.type:UrlMatcher} instances. The factory is also available to providers
 * under the name `$urlMatcherFactoryProvider`.
 */
function $UrlMatcherFactory() {

  /**
   * @ngdoc function
   * @name ui.router.util.$urlMatcherFactory#compile
   * @methodOf ui.router.util.$urlMatcherFactory
   *
   * @description
   * Creates a {@link ui.router.util.type:UrlMatcher} for the specified pattern.
   *   
   * @param {string} pattern  The URL pattern.
   * @returns {ui.router.util.type:UrlMatcher}  The UrlMatcher.
   */
  this.compile = function (pattern) {
    return new UrlMatcher(pattern);
  };

  /**
   * @ngdoc function
   * @name ui.router.util.$urlMatcherFactory#isMatcher
   * @methodOf ui.router.util.$urlMatcherFactory
   *
   * @description
   * Returns true if the specified object is a UrlMatcher, or false otherwise.
   *
   * @param {Object} object  The object to perform the type check against.
   * @returns {Boolean}  Returns `true` if the object has the following functions: `exec`, `format`, and `concat`.
   */
  this.isMatcher = function (o) {
    return isObject(o) && isFunction(o.exec) && isFunction(o.format) && isFunction(o.concat);
  };
  
  /* No need to document $get, since it returns this */
  this.$get = function () {
    return this;
  };
}

// Register as a provider so it's available to other providers
angular.module('ui.router.util').provider('$urlMatcherFactory', $UrlMatcherFactory);

/**
 * @ngdoc object
 * @name ui.router.router.$urlRouterProvider
 *
 * @requires ui.router.util.$urlMatcherFactoryProvider
 *
 * @description
 * `$urlRouterProvider` has the responsibility of watching `$location`. 
 * When `$location` changes it runs through a list of rules one by one until a 
 * match is found. `$urlRouterProvider` is used behind the scenes anytime you specify 
 * a url in a state configuration. All urls are compiled into a UrlMatcher object.
 *
 * There are several methods on `$urlRouterProvider` that make it useful to use directly
 * in your module config.
 */
$UrlRouterProvider.$inject = ['$urlMatcherFactoryProvider'];
function $UrlRouterProvider(  $urlMatcherFactory) {
  var rules = [], 
      otherwise = null;

  // Returns a string that is a prefix of all strings matching the RegExp
  function regExpPrefix(re) {
    var prefix = /^\^((?:\\[^a-zA-Z0-9]|[^\\\[\]\^$*+?.()|{}]+)*)/.exec(re.source);
    return (prefix != null) ? prefix[1].replace(/\\(.)/g, "$1") : '';
  }

  // Interpolates matched values into a String.replace()-style pattern
  function interpolate(pattern, match) {
    return pattern.replace(/\$(\$|\d{1,2})/, function (m, what) {
      return match[what === '$' ? 0 : Number(what)];
    });
  }

  /**
   * @ngdoc function
   * @name ui.router.router.$urlRouterProvider#rule
   * @methodOf ui.router.router.$urlRouterProvider
   *
   * @description
   * Defines rules that are used by `$urlRouterProvider to find matches for
   * specific URLs.
   *
   * @example
   * <pre>
   * var app = angular.module('app', ['ui.router.router']);
   *
   * app.config(function ($urlRouterProvider) {
   *   // Here's an example of how you might allow case insensitive urls
   *   $urlRouterProvider.rule(function ($injector, $location) {
   *     var path = $location.path(),
   *         normalized = path.toLowerCase();
   *
   *     if (path !== normalized) {
   *       return normalized;
   *     }
   *   });
   * });
   * </pre>
   *
   * @param {object} rule Handler function that takes `$injector` and `$location`
   * services as arguments. You can use them to return a valid path as a string.
   *
   * @return {object} $urlRouterProvider - $urlRouterProvider instance
   */
  this.rule =
    function (rule) {
      if (!isFunction(rule)) throw new Error("'rule' must be a function");
      rules.push(rule);
      return this;
    };

  /**
   * @ngdoc object
   * @name ui.router.router.$urlRouterProvider#otherwise
   * @methodOf ui.router.router.$urlRouterProvider
   *
   * @description
   * Defines a path that is used when an invalied route is requested.
   *
   * @example
   * <pre>
   * var app = angular.module('app', ['ui.router.router']);
   *
   * app.config(function ($urlRouterProvider) {
   *   // if the path doesn't match any of the urls you configured
   *   // otherwise will take care of routing the user to the
   *   // specified url
   *   $urlRouterProvider.otherwise('/index');
   *
   *   // Example of using function rule as param
   *   $urlRouterProvider.otherwise(function ($injector, $location) {
   *     ...
   *   });
   * });
   * </pre>
   *
   * @param {string|object} rule The url path you want to redirect to or a function 
   * rule that returns the url path. The function version is passed two params: 
   * `$injector` and `$location` services.
   *
   * @return {object} $urlRouterProvider - $urlRouterProvider instance
   */
  this.otherwise =
    function (rule) {
      if (isString(rule)) {
        var redirect = rule;
        rule = function () { return redirect; };
      }
      else if (!isFunction(rule)) throw new Error("'rule' must be a function");
      otherwise = rule;
      return this;
    };


  function handleIfMatch($injector, handler, match) {
    if (!match) return false;
    var result = $injector.invoke(handler, handler, { $match: match });
    return isDefined(result) ? result : true;
  }

  /**
   * @ngdoc function
   * @name ui.router.router.$urlRouterProvider#when
   * @methodOf ui.router.router.$urlRouterProvider
   *
   * @description
   * Registers a handler for a given url matching. if handle is a string, it is
   * treated as a redirect, and is interpolated according to the syyntax of match
   * (i.e. like String.replace() for RegExp, or like a UrlMatcher pattern otherwise).
   *
   * If the handler is a function, it is injectable. It gets invoked if `$location`
   * matches. You have the option of inject the match object as `$match`.
   *
   * The handler can return
   *
   * - **falsy** to indicate that the rule didn't match after all, then `$urlRouter`
   *   will continue trying to find another one that matches.
   * - **string** which is treated as a redirect and passed to `$location.url()`
   * - **void** or any **truthy** value tells `$urlRouter` that the url was handled.
   *
   * @example
   * <pre>
   * var app = angular.module('app', ['ui.router.router']);
   *
   * app.config(function ($urlRouterProvider) {
   *   $urlRouterProvider.when($state.url, function ($match, $stateParams) {
   *     if ($state.$current.navigable !== state ||
   *         !equalForKeys($match, $stateParams) {
   *      $state.transitionTo(state, $match, false);
   *     }
   *   });
   * });
   * </pre>
   *
   * @param {string|object} what The incoming path that you want to redirect.
   * @param {string|object} handler The path you want to redirect your user to.
   */
  this.when =
    function (what, handler) {
      var redirect, handlerIsString = isString(handler);
      if (isString(what)) what = $urlMatcherFactory.compile(what);

      if (!handlerIsString && !isFunction(handler) && !isArray(handler))
        throw new Error("invalid 'handler' in when()");

      var strategies = {
        matcher: function (what, handler) {
          if (handlerIsString) {
            redirect = $urlMatcherFactory.compile(handler);
            handler = ['$match', function ($match) { return redirect.format($match); }];
          }
          return extend(function ($injector, $location) {
            return handleIfMatch($injector, handler, what.exec($location.path(), $location.search()));
          }, {
            prefix: isString(what.prefix) ? what.prefix : ''
          });
        },
        regex: function (what, handler) {
          if (what.global || what.sticky) throw new Error("when() RegExp must not be global or sticky");

          if (handlerIsString) {
            redirect = handler;
            handler = ['$match', function ($match) { return interpolate(redirect, $match); }];
          }
          return extend(function ($injector, $location) {
            return handleIfMatch($injector, handler, what.exec($location.path()));
          }, {
            prefix: regExpPrefix(what)
          });
        }
      };

      var check = { matcher: $urlMatcherFactory.isMatcher(what), regex: what instanceof RegExp };

      for (var n in check) {
        if (check[n]) {
          return this.rule(strategies[n](what, handler));
        }
      }

      throw new Error("invalid 'what' in when()");
    };

  /**
   * @ngdoc object
   * @name ui.router.router.$urlRouter
   *
   * @requires $location
   * @requires $rootScope
   * @requires $injector
   *
   * @description
   *
   */
  this.$get =
    [        '$location', '$rootScope', '$injector',
    function ($location,   $rootScope,   $injector) {
      // TODO: Optimize groups of rules with non-empty prefix into some sort of decision tree
      function update(evt) {
        if (evt && evt.defaultPrevented) return;
        function check(rule) {
          var handled = rule($injector, $location);
          if (handled) {
            if (isString(handled)) $location.replace().url(handled);
            return true;
          }
          return false;
        }
        var n=rules.length, i;
        for (i=0; i<n; i++) {
          if (check(rules[i])) return;
        }
        // always check otherwise last to allow dynamic updates to the set of rules
        if (otherwise) check(otherwise);
      }

      $rootScope.$on('$locationChangeSuccess', update);

      return {
        /**
         * @ngdoc function
         * @name ui.router.router.$urlRouter#sync
         * @methodOf ui.router.router.$urlRouter
         *
         * @description
         * Triggers an update; the same update that happens when the address bar url changes, aka `$locationChangeSuccess`.
         * This method is useful when you need to use `preventDefault()` on the `$locationChangeSuccess` event, 
         * perform some custom logic (route protection, auth, config, redirection, etc) and then finally proceed 
         * with the transition by calling `$urlRouter.sync()`.
         *
         * @example
         * <pre>
         * angular.module('app', ['ui.router']);
         *   .run(function($rootScope, $urlRouter) {
         *     $rootScope.$on('$locationChangeSuccess', function(evt) {
         *       // Halt state change from even starting
         *       evt.preventDefault();
         *       // Perform custom logic
         *       var meetsRequirement = ...
         *       // Continue with the update and state transition if logic allows
         *       if (meetsRequirement) $urlRouter.sync();
         *     });
         * });
         * </pre>
         */
        sync: function () {
          update();
        }
      };
    }];
}

angular.module('ui.router.router').provider('$urlRouter', $UrlRouterProvider);

/**
 * @ngdoc object
 * @name ui.router.state.$stateProvider
 *
 * @requires ui.router.router.$urlRouterProvider
 * @requires ui.router.util.$urlMatcherFactoryProvider
 * @requires $locationProvider
 *
 * @description
 * The new `$stateProvider` works similar to Angular's v1 router, but it focuses purely
 * on state.
 *
 * A state corresponds to a "place" in the application in terms of the overall UI and
 * navigation. A state describes (via the controller / template / view properties) what
 * the UI looks like and does at that place.
 *
 * States often have things in common, and the primary way of factoring out these
 * commonalities in this model is via the state hierarchy, i.e. parent/child states aka
 * nested states.
 *
 * The `$stateProvider` provides interfaces to declare these states for your app.
 */
$StateProvider.$inject = ['$urlRouterProvider', '$urlMatcherFactoryProvider', '$locationProvider'];
function $StateProvider(   $urlRouterProvider,   $urlMatcherFactory,           $locationProvider) {

  var root, states = {}, $state, queue = {}, abstractKey = 'abstract';

  // Builds state properties from definition passed to registerState()
  var stateBuilder = {

    // Derive parent state from a hierarchical name only if 'parent' is not explicitly defined.
    // state.children = [];
    // if (parent) parent.children.push(state);
    parent: function(state) {
      if (isDefined(state.parent) && state.parent) return findState(state.parent);
      // regex matches any valid composite state name
      // would match "contact.list" but not "contacts"
      var compositeName = /^(.+)\.[^.]+$/.exec(state.name);
      return compositeName ? findState(compositeName[1]) : root;
    },

    // inherit 'data' from parent and override by own values (if any)
    data: function(state) {
      if (state.parent && state.parent.data) {
        state.data = state.self.data = extend({}, state.parent.data, state.data);
      }
      return state.data;
    },

    // Build a URLMatcher if necessary, either via a relative or absolute URL
    url: function(state) {
      var url = state.url;

      if (isString(url)) {
        if (url.charAt(0) == '^') {
          return $urlMatcherFactory.compile(url.substring(1));
        }
        return (state.parent.navigable || root).url.concat(url);
      }

      if ($urlMatcherFactory.isMatcher(url) || url == null) {
        return url;
      }
      throw new Error("Invalid url '" + url + "' in state '" + state + "'");
    },

    // Keep track of the closest ancestor state that has a URL (i.e. is navigable)
    navigable: function(state) {
      return state.url ? state : (state.parent ? state.parent.navigable : null);
    },

    // Derive parameters for this state and ensure they're a super-set of parent's parameters
    params: function(state) {
      if (!state.params) {
        return state.url ? state.url.parameters() : state.parent.params;
      }
      if (!isArray(state.params)) throw new Error("Invalid params in state '" + state + "'");
      if (state.url) throw new Error("Both params and url specicified in state '" + state + "'");
      return state.params;
    },

    // If there is no explicit multi-view configuration, make one up so we don't have
    // to handle both cases in the view directive later. Note that having an explicit
    // 'views' property will mean the default unnamed view properties are ignored. This
    // is also a good time to resolve view names to absolute names, so everything is a
    // straight lookup at link time.
    views: function(state) {
      var views = {};

      forEach(isDefined(state.views) ? state.views : { '': state }, function (view, name) {
        if (name.indexOf('@') < 0) name += '@' + state.parent.name;
        views[name] = view;
      });
      return views;
    },

    ownParams: function(state) {
      if (!state.parent) {
        return state.params;
      }
      var paramNames = {}; forEach(state.params, function (p) { paramNames[p] = true; });

      forEach(state.parent.params, function (p) {
        if (!paramNames[p]) {
          throw new Error("Missing required parameter '" + p + "' in state '" + state.name + "'");
        }
        paramNames[p] = false;
      });
      var ownParams = [];

      forEach(paramNames, function (own, p) {
        if (own) ownParams.push(p);
      });
      return ownParams;
    },

    // Keep a full path from the root down to this state as this is needed for state activation.
    path: function(state) {
      return state.parent ? state.parent.path.concat(state) : []; // exclude root from path
    },

    // Speed up $state.contains() as it's used a lot
    includes: function(state) {
      var includes = state.parent ? extend({}, state.parent.includes) : {};
      includes[state.name] = true;
      return includes;
    },

    $delegates: {}
  };

  function isRelative(stateName) {
    return stateName.indexOf(".") === 0 || stateName.indexOf("^") === 0;
  }

  function findState(stateOrName, base) {
    var isStr = isString(stateOrName),
        name  = isStr ? stateOrName : stateOrName.name,
        path  = isRelative(name);

    if (path) {
      if (!base) throw new Error("No reference point given for path '"  + name + "'");
      var rel = name.split("."), i = 0, pathLength = rel.length, current = base;

      for (; i < pathLength; i++) {
        if (rel[i] === "" && i === 0) {
          current = base;
          continue;
        }
        if (rel[i] === "^") {
          if (!current.parent) throw new Error("Path '" + name + "' not valid for state '" + base.name + "'");
          current = current.parent;
          continue;
        }
        break;
      }
      rel = rel.slice(i).join(".");
      name = current.name + (current.name && rel ? "." : "") + rel;
    }
    var state = states[name];

    if (state && (isStr || (!isStr && (state === stateOrName || state.self === stateOrName)))) {
      return state;
    }
    return undefined;
  }

  function queueState(parentName, state) {
    if (!queue[parentName]) {
      queue[parentName] = [];
    }
    queue[parentName].push(state);
  }

  function registerState(state) {
    // Wrap a new object around the state so we can store our private details easily.
    state = inherit(state, {
      self: state,
      resolve: state.resolve || {},
      toString: function() { return this.name; }
    });

    var name = state.name;
    if (!isString(name) || name.indexOf('@') >= 0) throw new Error("State must have a valid name");
    if (states.hasOwnProperty(name)) throw new Error("State '" + name + "'' is already defined");

    // Get parent name
    var parentName = (name.indexOf('.') !== -1) ? name.substring(0, name.lastIndexOf('.'))
        : (isString(state.parent)) ? state.parent
        : '';

    // If parent is not registered yet, add state to queue and register later
    if (parentName && !states[parentName]) {
      return queueState(parentName, state.self);
    }

    for (var key in stateBuilder) {
      if (isFunction(stateBuilder[key])) state[key] = stateBuilder[key](state, stateBuilder.$delegates[key]);
    }
    states[name] = state;

    // Register the state in the global state list and with $urlRouter if necessary.
    if (!state[abstractKey] && state.url) {
      $urlRouterProvider.when(state.url, ['$match', '$stateParams', function ($match, $stateParams) {
        if ($state.$current.navigable != state || !equalForKeys($match, $stateParams)) {
          $state.transitionTo(state, $match, { location: false });
        }
      }]);
    }

    // Register any queued children
    if (queue[name]) {
      for (var i = 0; i < queue[name].length; i++) {
        registerState(queue[name][i]);
      }
    }

    return state;
  }

  // Checks text to see if it looks like a glob.
  function isGlob (text) {
    return text.indexOf('*') > -1;
  }

  // Returns true if glob matches current $state name.
  function doesStateMatchGlob (glob) {
    var globSegments = glob.split('.'),
        segments = $state.$current.name.split('.');

    //match greedy starts
    if (globSegments[0] === '**') {
       segments = segments.slice(segments.indexOf(globSegments[1]));
       segments.unshift('**');
    }
    //match greedy ends
    if (globSegments[globSegments.length - 1] === '**') {
       segments.splice(segments.indexOf(globSegments[globSegments.length - 2]) + 1, Number.MAX_VALUE);
       segments.push('**');
    }

    if (globSegments.length != segments.length) {
      return false;
    }

    //match single stars
    for (var i = 0, l = globSegments.length; i < l; i++) {
      if (globSegments[i] === '*') {
        segments[i] = '*';
      }
    }

    return segments.join('') === globSegments.join('');
  }


  // Implicit root state that is always active
  root = registerState({
    name: '',
    url: '^',
    views: null,
    'abstract': true
  });
  root.navigable = null;


  /**
   * @ngdoc function
   * @name ui.router.state.$stateProvider#decorator
   * @methodOf ui.router.state.$stateProvider
   *
   * @description
   * Allows you to extend (carefully) or override (at your own peril) the 
   * `stateBuilder` object used internally by `$stateProvider`. This can be used 
   * to add custom functionality to ui-router, for example inferring templateUrl 
   * based on the state name.
   *
   * When passing only a name, it returns the current (original or decorated) builder
   * function that matches `name`.
   *
   * The builder functions that can be decorated are listed below. Though not all
   * necessarily have a good use case for decoration, that is up to you to decide.
   *
   * In addition, users can attach custom decorators, which will generate new 
   * properties within the state's internal definition. There is currently no clear 
   * use-case for this beyond accessing internal states (i.e. $state.$current), 
   * however, expect this to become increasingly relevant as we introduce additional 
   * meta-programming features.
   *
   * **Warning**: Decorators should not be interdependent because the order of 
   * execution of the builder functions in non-deterministic. Builder functions 
   * should only be dependent on the state definition object and super function.
   *
   *
   * Existing builder functions and current return values:
   *
   * - **parent** `{object}` - returns the parent state object.
   * - **data** `{object}` - returns state data, including any inherited data that is not
   *   overridden by own values (if any).
   * - **url** `{object}` - returns a {link ui.router.util.type:UrlMatcher} or null.
   * - **navigable** `{object}` - returns closest ancestor state that has a URL (aka is 
   *   navigable).
   * - **params** `{object}` - returns an array of state params that are ensured to 
   *   be a super-set of parent's params.
   * - **views** `{object}` - returns a views object where each key is an absolute view 
   *   name (i.e. "viewName@stateName") and each value is the config object 
   *   (template, controller) for the view. Even when you don't use the views object 
   *   explicitly on a state config, one is still created for you internally.
   *   So by decorating this builder function you have access to decorating template 
   *   and controller properties.
   * - **ownParams** `{object}` - returns an array of params that belong to the state, 
   *   not including any params defined by ancestor states.
   * - **path** `{string}` - returns the full path from the root down to this state. 
   *   Needed for state activation.
   * - **includes** `{object}` - returns an object that includes every state that 
   *   would pass a '$state.includes()' test.
   *
   * @example
   * <pre>
   * // Override the internal 'views' builder with a function that takes the state
   * // definition, and a reference to the internal function being overridden:
   * $stateProvider.decorator('views', function ($state, parent) {
   *   var result = {},
   *       views = parent(state);
   *
   *   angular.forEach(view, function (config, name) {
   *     var autoName = (state.name + '.' + name).replace('.', '/');
   *     config.templateUrl = config.templateUrl || '/partials/' + autoName + '.html';
   *     result[name] = config;
   *   });
   *   return result;
   * });
   *
   * $stateProvider.state('home', {
   *   views: {
   *     'contact.list': { controller: 'ListController' },
   *     'contact.item': { controller: 'ItemController' }
   *   }
   * });
   *
   * // ...
   *
   * $state.go('home');
   * // Auto-populates list and item views with /partials/home/contact/list.html,
   * // and /partials/home/contact/item.html, respectively.
   * </pre>
   *
   * @param {string} name The name of the builder function to decorate. 
   * @param {object} func A function that is responsible for decorating the original 
   * builder function. The function receives two parameters:
   *
   *   - `{object}` - state - The state config object.
   *   - `{object}` - super - The original builder function.
   *
   * @return {object} $stateProvider - $stateProvider instance
   */
  this.decorator = decorator;
  function decorator(name, func) {
    /*jshint validthis: true */
    if (isString(name) && !isDefined(func)) {
      return stateBuilder[name];
    }
    if (!isFunction(func) || !isString(name)) {
      return this;
    }
    if (stateBuilder[name] && !stateBuilder.$delegates[name]) {
      stateBuilder.$delegates[name] = stateBuilder[name];
    }
    stateBuilder[name] = func;
    return this;
  }

  /**
   * @ngdoc function
   * @name ui.router.state.$stateProvider#state
   * @methodOf ui.router.state.$stateProvider
   *
   * @description
   * Registers a state configuration under a given state name. The stateConfig object
   * has the following acceptable properties.
   *
   * <a id='template'></a>
   *
   * - **`template`** - {string|function=} - html template as a string or a function that returns
   *   an html template as a string which should be used by the uiView directives. This property 
   *   takes precedence over templateUrl.
   *   
   *   If `template` is a function, it will be called with the following parameters:
   *
   *   - {array.&lt;object&gt;} - state parameters extracted from the current $location.path() by
   *     applying the current state
   *
   * <a id='templateUrl'></a>
   *
   * - **`templateUrl`** - {string|function=} - path or function that returns a path to an html 
   *   template that should be used by uiView.
   *   
   *   If `templateUrl` is a function, it will be called with the following parameters:
   *
   *   - {array.&lt;object&gt;} - state parameters extracted from the current $location.path() by 
   *     applying the current state
   *
   * <a id='templateProvider'></a>
   *
   * - **`templateProvider`** - {function=} - Provider function that returns HTML content
   *   string.
   *
   * <a id='controller'></a>
   *
   * - **`controller`** - {string|function=} -  Controller fn that should be associated with newly 
   *   related scope or the name of a registered controller if passed as a string.
   *
   * <a id='controllerProvider'></a>
   *
   * - **`controllerProvider`** - {function=} - Injectable provider function that returns
   *   the actual controller or string.
   *
   * <a id='controllerAs'></a>
   * 
   * - **`controllerAs`** – {string=} – A controller alias name. If present the controller will be 
   *   published to scope under the controllerAs name.
   *
   * <a id='resolve'></a>
   *
   * - **`resolve`** - {object.&lt;string, function&gt;=} - An optional map of dependencies which 
   *   should be injected into the controller. If any of these dependencies are promises, 
   *   the router will wait for them all to be resolved or one to be rejected before the 
   *   controller is instantiated. If all the promises are resolved successfully, the values 
   *   of the resolved promises are injected and $stateChangeSuccess event is fired. If any 
   *   of the promises are rejected the $stateChangeError event is fired. The map object is:
   *   
   *   - key - {string}: name of dependency to be injected into controller
   *   - factory - {string|function}: If string then it is alias for service. Otherwise if function, 
   *     it is injected and return value it treated as dependency. If result is a promise, it is 
   *     resolved before its value is injected into controller.
   *
   * <a id='url'></a>
   *
   * - **`url`** - {string=} - A url with optional parameters. When a state is navigated or
   *   transitioned to, the `$stateParams` service will be populated with any 
   *   parameters that were passed.
   *
   * <a id='params'></a>
   *
   * - **`params`** - {object=} - An array of parameter names or regular expressions. Only 
   *   use this within a state if you are not using url. Otherwise you can specify your
   *   parameters within the url. When a state is navigated or transitioned to, the 
   *   $stateParams service will be populated with any parameters that were passed.
   *
   * <a id='views'></a>
   *
   * - **`views`** - {object=} - Use the views property to set up multiple views or to target views
   *   manually/explicitly.
   *
   * <a id='abstract'></a>
   *
   * - **`abstract`** - {boolean=} - An abstract state will never be directly activated, 
   *   but can provide inherited properties to its common children states.
   *
   * <a id='onEnter'></a>
   *
   * - **`onEnter`** - {object=} - Callback function for when a state is entered. Good way
   *   to trigger an action or dispatch an event, such as opening a dialog.
   *
   * <a id='onExit'></a>
   *
   * - **`onExit`** - {object=} - Callback function for when a state is exited. Good way to
   *   trigger an action or dispatch an event, such as opening a dialog.
   *
   * <a id='reloadOnSearch'></a>
   *
   * - **`reloadOnSearch = true`** - {boolean=} - If `false`, will not retrigger the same state 
   *   just because a search/query parameter has changed (via $location.search() or $location.hash()). 
   *   Useful for when you'd like to modify $location.search() without triggering a reload.
   *
   * <a id='data'></a>
   *
   * - **`data`** - {object=} - Arbitrary data object, useful for custom configuration.
   *
   * @example
   * <pre>
   * // Some state name examples
   *
   * // stateName can be a single top-level name (must be unique).
   * $stateProvider.state("home", {});
   *
   * // Or it can be a nested state name. This state is a child of the 
   * // above "home" state.
   * $stateProvider.state("home.newest", {});
   *
   * // Nest states as deeply as needed.
   * $stateProvider.state("home.newest.abc.xyz.inception", {});
   *
   * // state() returns $stateProvider, so you can chain state declarations.
   * $stateProvider
   *   .state("home", {})
   *   .state("about", {})
   *   .state("contacts", {});
   * </pre>
   *
   * @param {string} name A unique state name, e.g. "home", "about", "contacts". 
   * To create a parent/child state use a dot, e.g. "about.sales", "home.newest".
   * @param {object} definition State configuration object.
   */
  this.state = state;
  function state(name, definition) {
    /*jshint validthis: true */
    if (isObject(name)) definition = name;
    else definition.name = name;
    registerState(definition);
    return this;
  }

  /**
   * @ngdoc object
   * @name ui.router.state.$state
   *
   * @requires $rootScope
   * @requires $q
   * @requires ui.router.state.$view
   * @requires $injector
   * @requires ui.router.util.$resolve
   * @requires ui.router.state.$stateParams
   *
   * @property {object} params A param object, e.g. {sectionId: section.id)}, that 
   * you'd like to test against the current active state.
   * @property {object} current A reference to the state's config object. However 
   * you passed it in. Useful for accessing custom data.
   * @property {object} transition Currently pending transition. A promise that'll 
   * resolve or reject.
   *
   * @description
   * `$state` service is responsible for representing states as well as transitioning
   * between them. It also provides interfaces to ask for current state or even states
   * you're coming from.
   */
  // $urlRouter is injected just to ensure it gets instantiated
  this.$get = $get;
  $get.$inject = ['$rootScope', '$q', '$view', '$injector', '$resolve', '$stateParams', '$location', '$urlRouter', '$browser'];
  function $get(   $rootScope,   $q,   $view,   $injector,   $resolve,   $stateParams,   $location,   $urlRouter,   $browser) {

    var TransitionSuperseded = $q.reject(new Error('transition superseded'));
    var TransitionPrevented = $q.reject(new Error('transition prevented'));
    var TransitionAborted = $q.reject(new Error('transition aborted'));
    var TransitionFailed = $q.reject(new Error('transition failed'));
    var currentLocation = $location.url();
    var baseHref = $browser.baseHref();

    function syncUrl() {
      if ($location.url() !== currentLocation) {
        $location.url(currentLocation);
        $location.replace();
      }
    }

    root.locals = { resolve: null, globals: { $stateParams: {} } };
    $state = {
      params: {},
      current: root.self,
      $current: root,
      transition: null
    };

    /**
     * @ngdoc function
     * @name ui.router.state.$state#reload
     * @methodOf ui.router.state.$state
     *
     * @description
     * A method that force reloads the current state. All resolves are re-resolved, events are not re-fired, 
     * and controllers reinstantiated (bug with controllers reinstantiating right now, fixing soon).
     *
     * @example
     * <pre>
     * var app angular.module('app', ['ui.router']);
     *
     * app.controller('ctrl', function ($scope, $state) {
     *   $scope.reload = function(){
     *     $state.reload();
     *   }
     * });
     * </pre>
     *
     * `reload()` is just an alias for:
     * <pre>
     * $state.transitionTo($state.current, $stateParams, { 
     *   reload: true, inherit: false, notify: false 
     * });
     * </pre>
     */
    $state.reload = function reload() {
      $state.transitionTo($state.current, $stateParams, { reload: true, inherit: false, notify: false });
    };

    /**
     * @ngdoc function
     * @name ui.router.state.$state#go
     * @methodOf ui.router.state.$state
     *
     * @description
     * Convenience method for transitioning to a new state. `$state.go` calls 
     * `$state.transitionTo` internally but automatically sets options to 
     * `{ location: true, inherit: true, relative: $state.$current, notify: true }`. 
     * This allows you to easily use an absolute or relative to path and specify 
     * only the parameters you'd like to update (while letting unspecified parameters 
     * inherit from the currently active ancestor states).
     *
     * @example
     * <pre>
     * var app = angular.module('app', ['ui.router']);
     *
     * app.controller('ctrl', function ($scope, $state) {
     *   $scope.changeState = function () {
     *     $state.go('contact.detail');
     *   };
     * });
     * </pre>
     * <img src='../ngdoc_assets/StateGoExamples.png'/>
     *
     * @param {string} to Absolute state name or relative state path. Some examples:
     *
     * - `$state.go('contact.detail')` - will go to the `contact.detail` state
     * - `$state.go('^')` - will go to a parent state
     * - `$state.go('^.sibling')` - will go to a sibling state
     * - `$state.go('.child.grandchild')` - will go to grandchild state
     *
     * @param {object=} params A map of the parameters that will be sent to the state, 
     * will populate $stateParams. Any parameters that are not specified will be inherited from currently 
     * defined parameters. This allows, for example, going to a sibling state that shares parameters
     * specified in a parent state. Parameter inheritance only works between common ancestor states, I.e.
     * transitioning to a sibling will get you the parameters for all parents, transitioning to a child
     * will get you all current parameters, etc.
     * @param {object=} options Options object. The options are:
     *
     * - **`location`** - {boolean=true|string=} - If `true` will update the url in the location bar, if `false`
     *    will not. If string, must be `"replace"`, which will update url and also replace last history record.
     * - **`inherit`** - {boolean=true}, If `true` will inherit url parameters from current url.
     * - **`relative`** - {object=$state.$current}, When transitioning with relative path (e.g '^'), 
     *    defines which state to be relative from.
     * - **`notify`** - {boolean=true}, If `true` will broadcast $stateChangeStart and $stateChangeSuccess events.
     * - **`reload`** (v0.2.5) - {boolean=false}, If `true` will force transition even if the state or params 
     *    have not changed, aka a reload of the same state. It differs from reloadOnSearch because you'd
     *    use this when you want to force a reload when *everything* is the same, including search params.
     *
     * @returns {promise} A promise representing the state of the new transition.
     *
     * Possible success values:
     *
     * - $state.current
     *
     * <br/>Possible rejection values:
     *
     * - 'transition superseded' - when a newer transition has been started after this one
     * - 'transition prevented' - when `event.preventDefault()` has been called in a `$stateChangeStart` listener
     * - 'transition aborted' - when `event.preventDefault()` has been called in a `$stateNotFound` listener or
     *   when a `$stateNotFound` `event.retry` promise errors.
     * - 'transition failed' - when a state has been unsuccessfully found after 2 tries.
     * - *resolve error* - when an error has occurred with a `resolve`
     *
     */
    $state.go = function go(to, params, options) {
      return this.transitionTo(to, params, extend({ inherit: true, relative: $state.$current }, options));
    };

    /**
     * @ngdoc function
     * @name ui.router.state.$state#transitionTo
     * @methodOf ui.router.state.$state
     *
     * @description
     * Low-level method for transitioning to a new state. {@link ui.router.state.$state#methods_go $state.go}
     * uses `transitionTo` internally. `$state.go` is recommended in most situations.
     *
     * @example
     * <pre>
     * var app = angular.module('app', ['ui.router']);
     *
     * app.controller('ctrl', function ($scope, $state) {
     *   $scope.changeState = function () {
     *     $state.transitionTo('contact.detail');
     *   };
     * });
     * </pre>
     *
     * @param {string} to State name.
     * @param {object=} toParams A map of the parameters that will be sent to the state,
     * will populate $stateParams.
     * @param {object=} options Options object. The options are:
     *
     * - **`location`** - {boolean=true|string=} - If `true` will update the url in the location bar, if `false`
     *    will not. If string, must be `"replace"`, which will update url and also replace last history record.
     * - **`inherit`** - {boolean=false}, If `true` will inherit url parameters from current url.
     * - **`relative`** - {object=}, When transitioning with relative path (e.g '^'), 
     *    defines which state to be relative from.
     * - **`notify`** - {boolean=true}, If `true` will broadcast $stateChangeStart and $stateChangeSuccess events.
     * - **`reload`** (v0.2.5) - {boolean=false}, If `true` will force transition even if the state or params 
     *    have not changed, aka a reload of the same state. It differs from reloadOnSearch because you'd
     *    use this when you want to force a reload when *everything* is the same, including search params.
     *
     * @returns {promise} A promise representing the state of the new transition. See
     * {@link ui.router.state.$state#methods_go $state.go}.
     */
    $state.transitionTo = function transitionTo(to, toParams, options) {
      toParams = toParams || {};
      options = extend({
        location: true, inherit: false, relative: null, notify: true, reload: false, $retry: false
      }, options || {});

      var from = $state.$current, fromParams = $state.params, fromPath = from.path;
      var evt, toState = findState(to, options.relative);

      if (!isDefined(toState)) {
        // Broadcast not found event and abort the transition if prevented
        var redirect = { to: to, toParams: toParams, options: options };

        /**
         * @ngdoc event
         * @name ui.router.state.$state#$stateNotFound
         * @eventOf ui.router.state.$state
         * @eventType broadcast on root scope
         * @description
         * Fired when a requested state **cannot be found** using the provided state name during transition.
         * The event is broadcast allowing any handlers a single chance to deal with the error (usually by
         * lazy-loading the unfound state). A special `unfoundState` object is passed to the listener handler,
         * you can see its three properties in the example. You can use `event.preventDefault()` to abort the
         * transition and the promise returned from `go` will be rejected with a `'transition aborted'` value.
         *
         * @param {Object} event Event object.
         * @param {Object} unfoundState Unfound State information. Contains: `to, toParams, options` properties.
         * @param {State} fromState Current state object.
         * @param {Object} fromParams Current state params.
         *
         * @example
         *
         * <pre>
         * // somewhere, assume lazy.state has not been defined
         * $state.go("lazy.state", {a:1, b:2}, {inherit:false});
         *
         * // somewhere else
         * $scope.$on('$stateNotFound',
         * function(event, unfoundState, fromState, fromParams){
         *     console.log(unfoundState.to); // "lazy.state"
         *     console.log(unfoundState.toParams); // {a:1, b:2}
         *     console.log(unfoundState.options); // {inherit:false} + default options
         * })
         * </pre>
         */
        evt = $rootScope.$broadcast('$stateNotFound', redirect, from.self, fromParams);
        if (evt.defaultPrevented) {
          syncUrl();
          return TransitionAborted;
        }

        // Allow the handler to return a promise to defer state lookup retry
        if (evt.retry) {
          if (options.$retry) {
            syncUrl();
            return TransitionFailed;
          }
          var retryTransition = $state.transition = $q.when(evt.retry);
          retryTransition.then(function() {
            if (retryTransition !== $state.transition) return TransitionSuperseded;
            redirect.options.$retry = true;
            return $state.transitionTo(redirect.to, redirect.toParams, redirect.options);
          }, function() {
            return TransitionAborted;
          });
          syncUrl();
          return retryTransition;
        }

        // Always retry once if the $stateNotFound was not prevented
        // (handles either redirect changed or state lazy-definition)
        to = redirect.to;
        toParams = redirect.toParams;
        options = redirect.options;
        toState = findState(to, options.relative);
        if (!isDefined(toState)) {
          if (options.relative) throw new Error("Could not resolve '" + to + "' from state '" + options.relative + "'");
          throw new Error("No such state '" + to + "'");
        }
      }
      if (toState[abstractKey]) throw new Error("Cannot transition to abstract state '" + to + "'");
      if (options.inherit) toParams = inheritParams($stateParams, toParams || {}, $state.$current, toState);
      to = toState;

      var toPath = to.path;

      // Starting from the root of the path, keep all levels that haven't changed
      var keep, state, locals = root.locals, toLocals = [];
      for (keep = 0, state = toPath[keep];
           state && state === fromPath[keep] && equalForKeys(toParams, fromParams, state.ownParams) && !options.reload;
           keep++, state = toPath[keep]) {
        locals = toLocals[keep] = state.locals;
      }

      // If we're going to the same state and all locals are kept, we've got nothing to do.
      // But clear 'transition', as we still want to cancel any other pending transitions.
      // TODO: We may not want to bump 'transition' if we're called from a location change that we've initiated ourselves,
      // because we might accidentally abort a legitimate transition initiated from code?
      if (shouldTriggerReload(to, from, locals, options) ) {
        if ( to.self.reloadOnSearch !== false )
          syncUrl();
        $state.transition = null;
        return $q.when($state.current);
      }

      // Normalize/filter parameters before we pass them to event handlers etc.
      toParams = normalize(to.params, toParams || {});

      // Broadcast start event and cancel the transition if requested
      if (options.notify) {
        /**
         * @ngdoc event
         * @name ui.router.state.$state#$stateChangeStart
         * @eventOf ui.router.state.$state
         * @eventType broadcast on root scope
         * @description
         * Fired when the state transition **begins**. You can use `event.preventDefault()`
         * to prevent the transition from happening and then the transition promise will be
         * rejected with a `'transition prevented'` value.
         *
         * @param {Object} event Event object.
         * @param {State} toState The state being transitioned to.
         * @param {Object} toParams The params supplied to the `toState`.
         * @param {State} fromState The current state, pre-transition.
         * @param {Object} fromParams The params supplied to the `fromState`.
         *
         * @example
         *
         * <pre>
         * $rootScope.$on('$stateChangeStart',
         * function(event, toState, toParams, fromState, fromParams){
         *     event.preventDefault();
         *     // transitionTo() promise will be rejected with
         *     // a 'transition prevented' error
         * })
         * </pre>
         */
        evt = $rootScope.$broadcast('$stateChangeStart', to.self, toParams, from.self, fromParams);
        if (evt.defaultPrevented) {
          syncUrl();
          return TransitionPrevented;
        }
      }

      // Resolve locals for the remaining states, but don't update any global state just
      // yet -- if anything fails to resolve the current state needs to remain untouched.
      // We also set up an inheritance chain for the locals here. This allows the view directive
      // to quickly look up the correct definition for each view in the current state. Even
      // though we create the locals object itself outside resolveState(), it is initially
      // empty and gets filled asynchronously. We need to keep track of the promise for the
      // (fully resolved) current locals, and pass this down the chain.
      var resolved = $q.when(locals);
      for (var l=keep; l<toPath.length; l++, state=toPath[l]) {
        locals = toLocals[l] = inherit(locals);
        resolved = resolveState(state, toParams, state===to, resolved, locals);
      }

      // Once everything is resolved, we are ready to perform the actual transition
      // and return a promise for the new state. We also keep track of what the
      // current promise is, so that we can detect overlapping transitions and
      // keep only the outcome of the last transition.
      var transition = $state.transition = resolved.then(function () {
        var l, entering, exiting;

        if ($state.transition !== transition) return TransitionSuperseded;

        // Exit 'from' states not kept
        for (l=fromPath.length-1; l>=keep; l--) {
          exiting = fromPath[l];
          if (exiting.self.onExit) {
            $injector.invoke(exiting.self.onExit, exiting.self, exiting.locals.globals);
          }
          exiting.locals = null;
        }

        // Enter 'to' states not kept
        for (l=keep; l<toPath.length; l++) {
          entering = toPath[l];
          entering.locals = toLocals[l];
          if (entering.self.onEnter) {
            $injector.invoke(entering.self.onEnter, entering.self, entering.locals.globals);
          }
        }

        // Run it again, to catch any transitions in callbacks
        if ($state.transition !== transition) return TransitionSuperseded;

        // Update globals in $state
        $state.$current = to;
        $state.current = to.self;
        $state.params = toParams;
        copy($state.params, $stateParams);
        $state.transition = null;

        // Update $location
        var toNav = to.navigable;
        if (options.location && toNav) {
          $location.url(toNav.url.format(toNav.locals.globals.$stateParams));

          if (options.location === 'replace') {
            $location.replace();
          }
        }

        if (options.notify) {
        /**
         * @ngdoc event
         * @name ui.router.state.$state#$stateChangeSuccess
         * @eventOf ui.router.state.$state
         * @eventType broadcast on root scope
         * @description
         * Fired once the state transition is **complete**.
         *
         * @param {Object} event Event object.
         * @param {State} toState The state being transitioned to.
         * @param {Object} toParams The params supplied to the `toState`.
         * @param {State} fromState The current state, pre-transition.
         * @param {Object} fromParams The params supplied to the `fromState`.
         */
          $rootScope.$broadcast('$stateChangeSuccess', to.self, toParams, from.self, fromParams);
        }
        currentLocation = $location.url();

        return $state.current;
      }, function (error) {
        if ($state.transition !== transition) return TransitionSuperseded;

        $state.transition = null;
        /**
         * @ngdoc event
         * @name ui.router.state.$state#$stateChangeError
         * @eventOf ui.router.state.$state
         * @eventType broadcast on root scope
         * @description
         * Fired when an **error occurs** during transition. It's important to note that if you
         * have any errors in your resolve functions (javascript errors, non-existent services, etc)
         * they will not throw traditionally. You must listen for this $stateChangeError event to
         * catch **ALL** errors.
         *
         * @param {Object} event Event object.
         * @param {State} toState The state being transitioned to.
         * @param {Object} toParams The params supplied to the `toState`.
         * @param {State} fromState The current state, pre-transition.
         * @param {Object} fromParams The params supplied to the `fromState`.
         * @param {Error} error The resolve error object.
         */
        $rootScope.$broadcast('$stateChangeError', to.self, toParams, from.self, fromParams, error);
        syncUrl();

        return $q.reject(error);
      });

      return transition;
    };

    /**
     * @ngdoc function
     * @name ui.router.state.$state#is
     * @methodOf ui.router.state.$state
     *
     * @description
     * Similar to {@link ui.router.state.$state#methods_includes $state.includes},
     * but only checks for the full state name. If params is supplied then it will be 
     * tested for strict equality against the current active params object, so all params 
     * must match with none missing and no extras.
     *
     * @example
     * <pre>
     * $state.is('contact.details.item'); // returns true
     * $state.is(contactDetailItemStateObject); // returns true
     *
     * // everything else would return false
     * </pre>
     *
     * @param {string|object} stateName The state name or state object you'd like to check.
     * @param {object=} params A param object, e.g. `{sectionId: section.id}`, that you'd like 
     * to test against the current active state.
     * @returns {boolean} Returns true if it is the state.
     */
    $state.is = function is(stateOrName, params) {
      var state = findState(stateOrName);

      if (!isDefined(state)) {
        return undefined;
      }

      if ($state.$current !== state) {
        return false;
      }

      return isDefined(params) && params !== null ? angular.equals($stateParams, params) : true;
    };

    /**
     * @ngdoc function
     * @name ui.router.state.$state#includes
     * @methodOf ui.router.state.$state
     *
     * @description
     * A method to determine if the current active state is equal to or is the child of the 
     * state stateName. If any params are passed then they will be tested for a match as well.
     * Not all the parameters need to be passed, just the ones you'd like to test for equality.
     *
     * @example
     * <pre>
     * $state.$current.name = 'contacts.details.item';
     *
     * $state.includes("contacts"); // returns true
     * $state.includes("contacts.details"); // returns true
     * $state.includes("contacts.details.item"); // returns true
     * $state.includes("contacts.list"); // returns false
     * $state.includes("about"); // returns false
     * </pre>
     *
     * @description
     * Basic globing patterns will also work.
     *
     * @example
     * <pre>
     * $state.$current.name = 'contacts.details.item.url';
     *
     * $state.includes("*.details.*.*"); // returns true
     * $state.includes("*.details.**"); // returns true
     * $state.includes("**.item.**"); // returns true
     * $state.includes("*.details.item.url"); // returns true
     * $state.includes("*.details.*.url"); // returns true
     * $state.includes("*.details.*"); // returns false
     * $state.includes("item.**"); // returns false
     * </pre>
     *
     * @param {string} stateOrName A partial name to be searched for within the current state name.
     * @param {object} params A param object, e.g. `{sectionId: section.id}`, 
     * that you'd like to test against the current active state.
     * @returns {boolean} Returns true if it does include the state
     */

    $state.includes = function includes(stateOrName, params) {
      if (isString(stateOrName) && isGlob(stateOrName)) {
        if (doesStateMatchGlob(stateOrName)) {
          stateOrName = $state.$current.name;
        } else {
          return false;
        }
      }

      var state = findState(stateOrName);
      if (!isDefined(state)) {
        return undefined;
      }

      if (!isDefined($state.$current.includes[state.name])) {
        return false;
      }

      var validParams = true;
      angular.forEach(params, function(value, key) {
        if (!isDefined($stateParams[key]) || $stateParams[key] !== value) {
          validParams = false;
        }
      });
      return validParams;
    };


    /**
     * @ngdoc function
     * @name ui.router.state.$state#href
     * @methodOf ui.router.state.$state
     *
     * @description
     * A url generation method that returns the compiled url for the given state populated with the given params.
     *
     * @example
     * <pre>
     * expect($state.href("about.person", { person: "bob" })).toEqual("/about/bob");
     * </pre>
     *
     * @param {string|object} stateOrName The state name or state object you'd like to generate a url from.
     * @param {object=} params An object of parameter values to fill the state's required parameters.
     * @param {object=} options Options object. The options are:
     *
     * - **`lossy`** - {boolean=true} -  If true, and if there is no url associated with the state provided in the
     *    first parameter, then the constructed href url will be built from the first navigable ancestor (aka
     *    ancestor with a valid url).
     * - **`inherit`** - {boolean=false}, If `true` will inherit url parameters from current url.
     * - **`relative`** - {object=$state.$current}, When transitioning with relative path (e.g '^'), 
     *    defines which state to be relative from.
     * - **`absolute`** - {boolean=false},  If true will generate an absolute url, e.g. "http://www.example.com/fullurl".
     * 
     * @returns {string} compiled state url
     */
    $state.href = function href(stateOrName, params, options) {
      options = extend({ lossy: true, inherit: false, absolute: false, relative: $state.$current }, options || {});
      var state = findState(stateOrName, options.relative);
      if (!isDefined(state)) return null;

      params = inheritParams($stateParams, params || {}, $state.$current, state);
      var nav = (state && options.lossy) ? state.navigable : state;
      var url = (nav && nav.url) ? nav.url.format(normalize(state.params, params || {})) : null;
      if (!$locationProvider.html5Mode() && url) {
        url = "#" + $locationProvider.hashPrefix() + url;
      }

      if (baseHref !== '/') {
        if ($locationProvider.html5Mode()) {
          url = baseHref.slice(0, -1) + url;
        } else if (options.absolute){
          url = baseHref.slice(1) + url;
        }
      }

      if (options.absolute && url) {
        url = $location.protocol() + '://' + 
              $location.host() + 
              ($location.port() == 80 || $location.port() == 443 ? '' : ':' + $location.port()) + 
              (!$locationProvider.html5Mode() && url ? '/' : '') + 
              url;
      }
      return url;
    };

    /**
     * @ngdoc function
     * @name ui.router.state.$state#get
     * @methodOf ui.router.state.$state
     *
     * @description
     * Returns the state configuration object for any specific state or all states.
     *
     * @param {string|object=} stateOrName If provided, will only get the config for
     * the requested state. If not provided, returns an array of ALL state configs.
     * @returns {object|array} State configuration object or array of all objects.
     */
    $state.get = function (stateOrName, context) {
      if (!isDefined(stateOrName)) {
        var list = [];
        forEach(states, function(state) { list.push(state.self); });
        return list;
      }
      var state = findState(stateOrName, context);
      return (state && state.self) ? state.self : null;
    };

    function resolveState(state, params, paramsAreFiltered, inherited, dst) {
      // Make a restricted $stateParams with only the parameters that apply to this state if
      // necessary. In addition to being available to the controller and onEnter/onExit callbacks,
      // we also need $stateParams to be available for any $injector calls we make during the
      // dependency resolution process.
      var $stateParams = (paramsAreFiltered) ? params : filterByKeys(state.params, params);
      var locals = { $stateParams: $stateParams };

      // Resolve 'global' dependencies for the state, i.e. those not specific to a view.
      // We're also including $stateParams in this; that way the parameters are restricted
      // to the set that should be visible to the state, and are independent of when we update
      // the global $state and $stateParams values.
      dst.resolve = $resolve.resolve(state.resolve, locals, dst.resolve, state);
      var promises = [ dst.resolve.then(function (globals) {
        dst.globals = globals;
      }) ];
      if (inherited) promises.push(inherited);

      // Resolve template and dependencies for all views.
      forEach(state.views, function (view, name) {
        var injectables = (view.resolve && view.resolve !== state.resolve ? view.resolve : {});
        injectables.$template = [ function () {
          return $view.load(name, { view: view, locals: locals, params: $stateParams, notify: false }) || '';
        }];

        promises.push($resolve.resolve(injectables, locals, dst.resolve, state).then(function (result) {
          // References to the controller (only instantiated at link time)
          if (isFunction(view.controllerProvider) || isArray(view.controllerProvider)) {
            var injectLocals = angular.extend({}, injectables, locals);
            result.$$controller = $injector.invoke(view.controllerProvider, null, injectLocals);
          } else {
            result.$$controller = view.controller;
          }
          // Provide access to the state itself for internal use
          result.$$state = state;
          result.$$controllerAs = view.controllerAs;
          dst[name] = result;
        }));
      });

      // Wait for all the promises and then return the activation object
      return $q.all(promises).then(function (values) {
        return dst;
      });
    }

    return $state;
  }

  function shouldTriggerReload(to, from, locals, options) {
    if ( to === from && ((locals === from.locals && !options.reload) || (to.self.reloadOnSearch === false)) ) {
      return true;
    }
  }
}

angular.module('ui.router.state')
  .value('$stateParams', {})
  .provider('$state', $StateProvider);


$ViewProvider.$inject = [];
function $ViewProvider() {

  this.$get = $get;
  /**
   * @ngdoc object
   * @name ui.router.state.$view
   *
   * @requires ui.router.util.$templateFactory
   * @requires $rootScope
   *
   * @description
   *
   */
  $get.$inject = ['$rootScope', '$templateFactory'];
  function $get(   $rootScope,   $templateFactory) {
    return {
      // $view.load('full.viewName', { template: ..., controller: ..., resolve: ..., async: false, params: ... })
      /**
       * @ngdoc function
       * @name ui.router.state.$view#load
       * @methodOf ui.router.state.$view
       *
       * @description
       *
       * @param {string} name name
       * @param {object} options option object.
       */
      load: function load(name, options) {
        var result, defaults = {
          template: null, controller: null, view: null, locals: null, notify: true, async: true, params: {}
        };
        options = extend(defaults, options);

        if (options.view) {
          result = $templateFactory.fromConfig(options.view, options.params, options.locals);
        }
        if (result && options.notify) {
        /**
         * @ngdoc event
         * @name ui.router.state.$state#$viewContentLoading
         * @eventOf ui.router.state.$view
         * @eventType broadcast on root scope
         * @description
         *
         * Fired once the view **begins loading**, *before* the DOM is rendered.
         *
         * @param {Object} event Event object.
         * @param {Object} viewConfig The view config properties (template, controller, etc).
         *
         * @example
         *
         * <pre>
         * $scope.$on('$viewContentLoading',
         * function(event, viewConfig){
         *     // Access to all the view config properties.
         *     // and one special property 'targetView'
         *     // viewConfig.targetView
         * });
         * </pre>
         */
          $rootScope.$broadcast('$viewContentLoading', options);
        }
        return result;
      }
    };
  }
}

angular.module('ui.router.state').provider('$view', $ViewProvider);

/**
 * @ngdoc object
 * @name ui.router.state.$uiViewScrollProvider
 *
 * @description
 * Provider that returns the {@link ui.router.state.$uiViewScroll} service function.
 */
function $ViewScrollProvider() {

  var useAnchorScroll = false;

  /**
   * @ngdoc function
   * @name ui.router.state.$uiViewScrollProvider#useAnchorScroll
   * @methodOf ui.router.state.$uiViewScrollProvider
   *
   * @description
   * Reverts back to using the core [`$anchorScroll`](http://docs.angularjs.org/api/ng.$anchorScroll) service for
   * scrolling based on the url anchor.
   */
  this.useAnchorScroll = function () {
    useAnchorScroll = true;
  };

  /**
   * @ngdoc object
   * @name ui.router.state.$uiViewScroll
   *
   * @requires $anchorScroll
   * @requires $timeout
   *
   * @description
   * When called with a jqLite element, it scrolls the element into view (after a
   * `$timeout` so the DOM has time to refresh).
   *
   * If you prefer to rely on `$anchorScroll` to scroll the view to the anchor,
   * this can be enabled by calling {@link ui.router.state.$uiViewScrollProvider#methods_useAnchorScroll `$uiViewScrollProvider.useAnchorScroll()`}.
   */
  this.$get = ['$anchorScroll', '$timeout', function ($anchorScroll, $timeout) {
    if (useAnchorScroll) {
      return $anchorScroll;
    }

    return function ($element) {
      $timeout(function () {
        $element[0].scrollIntoView();
      }, 0, false);
    };
  }];
}

angular.module('ui.router.state').provider('$uiViewScroll', $ViewScrollProvider);

/**
 * @ngdoc directive
 * @name ui.router.state.directive:ui-view
 *
 * @requires ui.router.state.$state
 * @requires $compile
 * @requires $controller
 * @requires $injector
 * @requires ui.router.state.$uiViewScroll
 * @requires $document
 *
 * @restrict ECA
 *
 * @description
 * The ui-view directive tells $state where to place your templates.
 *
 * @param {string=} ui-view A view name. The name should be unique amongst the other views in the
 * same state. You can have views of the same name that live in different states.
 *
 * @param {string=} autoscroll It allows you to set the scroll behavior of the browser window
 * when a view is populated. By default, $anchorScroll is overridden by ui-router's custom scroll
 * service, {@link ui.router.state.$uiViewScroll}. This custom service let's you
 * scroll ui-view elements into view when they are populated during a state activation.
 *
 * *Note: To revert back to old [`$anchorScroll`](http://docs.angularjs.org/api/ng.$anchorScroll)
 * functionality, call `$uiViewScrollProvider.useAnchorScroll()`.*
 *
 * @param {string=} onload Expression to evaluate whenever the view updates.
 * 
 * @example
 * A view can be unnamed or named. 
 * <pre>
 * <!-- Unnamed -->
 * <div ui-view></div> 
 * 
 * <!-- Named -->
 * <div ui-view="viewName"></div>
 * </pre>
 *
 * You can only have one unnamed view within any template (or root html). If you are only using a 
 * single view and it is unnamed then you can populate it like so:
 * <pre>
 * <div ui-view></div> 
 * $stateProvider.state("home", {
 *   template: "<h1>HELLO!</h1>"
 * })
 * </pre>
 * 
 * The above is a convenient shortcut equivalent to specifying your view explicitly with the {@link ui.router.state.$stateProvider#views `views`}
 * config property, by name, in this case an empty name:
 * <pre>
 * $stateProvider.state("home", {
 *   views: {
 *     "": {
 *       template: "<h1>HELLO!</h1>"
 *     }
 *   }    
 * })
 * </pre>
 * 
 * But typically you'll only use the views property if you name your view or have more than one view 
 * in the same template. There's not really a compelling reason to name a view if its the only one, 
 * but you could if you wanted, like so:
 * <pre>
 * <div ui-view="main"></div>
 * </pre> 
 * <pre>
 * $stateProvider.state("home", {
 *   views: {
 *     "main": {
 *       template: "<h1>HELLO!</h1>"
 *     }
 *   }    
 * })
 * </pre>
 * 
 * Really though, you'll use views to set up multiple views:
 * <pre>
 * <div ui-view></div>
 * <div ui-view="chart"></div> 
 * <div ui-view="data"></div> 
 * </pre>
 * 
 * <pre>
 * $stateProvider.state("home", {
 *   views: {
 *     "": {
 *       template: "<h1>HELLO!</h1>"
 *     },
 *     "chart": {
 *       template: "<chart_thing/>"
 *     },
 *     "data": {
 *       template: "<data_thing/>"
 *     }
 *   }    
 * })
 * </pre>
 *
 * Examples for `autoscroll`:
 *
 * <pre>
 * <!-- If autoscroll present with no expression,
 *      then scroll ui-view into view -->
 * <ui-view autoscroll/>
 *
 * <!-- If autoscroll present with valid expression,
 *      then scroll ui-view into view if expression evaluates to true -->
 * <ui-view autoscroll='true'/>
 * <ui-view autoscroll='false'/>
 * <ui-view autoscroll='scopeVariable'/>
 * </pre>
 */
$ViewDirective.$inject = ['$state', '$injector', '$uiViewScroll'];
function $ViewDirective(   $state,   $injector,   $uiViewScroll) {

  function getService() {
    return ($injector.has) ? function(service) {
      return $injector.has(service) ? $injector.get(service) : null;
    } : function(service) {
      try {
        return $injector.get(service);
      } catch (e) {
        return null;
      }
    };
  }

  var service = getService(),
      $animator = service('$animator'),
      $animate = service('$animate');

  // Returns a set of DOM manipulation functions based on which Angular version
  // it should use
  function getRenderer(attrs, scope) {
    var statics = function() {
      return {
        enter: function (element, target, cb) { target.after(element); cb(); },
        leave: function (element, cb) { element.remove(); cb(); }
      };
    };

    if ($animate) {
      return {
        enter: function(element, target, cb) { $animate.enter(element, null, target, cb); },
        leave: function(element, cb) { $animate.leave(element, cb); }
      };
    }

    if ($animator) {
      var animate = $animator && $animator(scope, attrs);

      return {
        enter: function(element, target, cb) {animate.enter(element, null, target); cb(); },
        leave: function(element, cb) { animate.leave(element); cb(); }
      };
    }

    return statics();
  }

  var directive = {
    restrict: 'ECA',
    terminal: true,
    priority: 400,
    transclude: 'element',
    compile: function (tElement, tAttrs, $transclude) {
      return function (scope, $element, attrs) {
        var previousEl, currentEl, currentScope, latestLocals,
            onloadExp     = attrs.onload || '',
            autoScrollExp = attrs.autoscroll,
            renderer      = getRenderer(attrs, scope);

        scope.$on('$stateChangeSuccess', function() {
          updateView(false);
        });
        scope.$on('$viewContentLoading', function() {
          updateView(false);
        });

        updateView(true);

        function cleanupLastView() {
          if (previousEl) {
            previousEl.remove();
            previousEl = null;
          }

          if (currentScope) {
            currentScope.$destroy();
            currentScope = null;
          }

          if (currentEl) {
            renderer.leave(currentEl, function() {
              previousEl = null;
            });

            previousEl = currentEl;
            currentEl = null;
          }
        }

        function updateView(firstTime) {
          var newScope        = scope.$new(),
              name            = currentEl && currentEl.data('$uiViewName'),
              previousLocals  = name && $state.$current && $state.$current.locals[name];

          if (!firstTime && previousLocals === latestLocals) return; // nothing to do

          var clone = $transclude(newScope, function(clone) {
            renderer.enter(clone, $element, function onUiViewEnter() {
              if (angular.isDefined(autoScrollExp) && !autoScrollExp || scope.$eval(autoScrollExp)) {
                $uiViewScroll(clone);
              }
            });
            cleanupLastView();
          });

          latestLocals = $state.$current.locals[clone.data('$uiViewName')];

          currentEl = clone;
          currentScope = newScope;
          /**
           * @ngdoc event
           * @name ui.router.state.directive:ui-view#$viewContentLoaded
           * @eventOf ui.router.state.directive:ui-view
           * @eventType emits on ui-view directive scope
           * @description           *
           * Fired once the view is **loaded**, *after* the DOM is rendered.
           *
           * @param {Object} event Event object.
           */
          currentScope.$emit('$viewContentLoaded');
          currentScope.$eval(onloadExp);
        }
      };
    }
  };

  return directive;
}

$ViewDirectiveFill.$inject = ['$compile', '$controller', '$state'];
function $ViewDirectiveFill ($compile, $controller, $state) {
  return {
    restrict: 'ECA',
    priority: -400,
    compile: function (tElement) {
      var initial = tElement.html();
      return function (scope, $element, attrs) {
        var name      = attrs.uiView || attrs.name || '',
            inherited = $element.inheritedData('$uiView');

        if (name.indexOf('@') < 0) {
          name = name + '@' + (inherited ? inherited.state.name : '');
        }

        $element.data('$uiViewName', name);

        var current = $state.$current,
            locals  = current && current.locals[name];

        if (! locals) {
          return;
        }

        $element.data('$uiView', { name: name, state: locals.$$state });
        $element.html(locals.$template ? locals.$template : initial);

        var link = $compile($element.contents());

        if (locals.$$controller) {
          locals.$scope = scope;
          var controller = $controller(locals.$$controller, locals);
          if (locals.$$controllerAs) {
            scope[locals.$$controllerAs] = controller;
          }
          $element.data('$ngControllerController', controller);
          $element.children().data('$ngControllerController', controller);
        }

        link(scope);
      };
    }
  };
}

angular.module('ui.router.state').directive('uiView', $ViewDirective);
angular.module('ui.router.state').directive('uiView', $ViewDirectiveFill);

function parseStateRef(ref) {
  var parsed = ref.replace(/\n/g, " ").match(/^([^(]+?)\s*(\((.*)\))?$/);
  if (!parsed || parsed.length !== 4) throw new Error("Invalid state ref '" + ref + "'");
  return { state: parsed[1], paramExpr: parsed[3] || null };
}

function stateContext(el) {
  var stateData = el.parent().inheritedData('$uiView');

  if (stateData && stateData.state && stateData.state.name) {
    return stateData.state;
  }
}

/**
 * @ngdoc directive
 * @name ui.router.state.directive:ui-sref
 *
 * @requires ui.router.state.$state
 * @requires $timeout
 *
 * @restrict A
 *
 * @description
 * A directive that binds a link (`<a>` tag) to a state. If the state has an associated 
 * URL, the directive will automatically generate & update the `href` attribute via 
 * the {@link ui.router.state.$state#methods_href $state.href()} method. Clicking 
 * the link will trigger a state transition with optional parameters. 
 *
 * Also middle-clicking, right-clicking, and ctrl-clicking on the link will be 
 * handled natively by the browser.
 *
 * You can also use relative state paths within ui-sref, just like the relative 
 * paths passed to `$state.go()`. You just need to be aware that the path is relative
 * to the state that the link lives in, in other words the state that loaded the 
 * template containing the link.
 *
 * You can specify options to pass to {@link ui.router.state.$state#go $state.go()}
 * using the `ui-sref-opts` attribute. Options are restricted to `location`, `inherit`,
 * and `reload`.
 *
 * @example
 * Here's an example of how you'd use ui-sref and how it would compile. If you have the 
 * following template:
 * <pre>
 * <a ui-sref="home">Home</a> | <a ui-sref="about">About</a>
 * 
 * <ul>
 *     <li ng-repeat="contact in contacts">
 *         <a ui-sref="contacts.detail({ id: contact.id })">{{ contact.name }}</a>
 *     </li>
 * </ul>
 * </pre>
 * 
 * Then the compiled html would be (assuming Html5Mode is off):
 * <pre>
 * <a href="#/home" ui-sref="home">Home</a> | <a href="#/about" ui-sref="about">About</a>
 * 
 * <ul>
 *     <li ng-repeat="contact in contacts">
 *         <a href="#/contacts/1" ui-sref="contacts.detail({ id: contact.id })">Joe</a>
 *     </li>
 *     <li ng-repeat="contact in contacts">
 *         <a href="#/contacts/2" ui-sref="contacts.detail({ id: contact.id })">Alice</a>
 *     </li>
 *     <li ng-repeat="contact in contacts">
 *         <a href="#/contacts/3" ui-sref="contacts.detail({ id: contact.id })">Bob</a>
 *     </li>
 * </ul>
 *
 * <a ui-sref="home" ui-sref-opts="{reload: true}">Home</a>
 * </pre>
 *
 * @param {string} ui-sref 'stateName' can be any valid absolute or relative state
 * @param {Object} ui-sref-opts options to pass to {@link ui.router.state.$state#go $state.go()}
 */
$StateRefDirective.$inject = ['$state', '$timeout'];
function $StateRefDirective($state, $timeout) {
  var allowedOptions = ['location', 'inherit', 'reload'];

  return {
    restrict: 'A',
    require: '?^uiSrefActive',
    link: function(scope, element, attrs, uiSrefActive) {
      var ref = parseStateRef(attrs.uiSref);
      var params = null, url = null, base = stateContext(element) || $state.$current;
      var isForm = element[0].nodeName === "FORM";
      var attr = isForm ? "action" : "href", nav = true;

      var options = {
        relative: base
      };
      var optionsOverride = scope.$eval(attrs.uiSrefOpts) || {};
      angular.forEach(allowedOptions, function(option) {
        if (option in optionsOverride) {
          options[option] = optionsOverride[option];
        }
      });

      var update = function(newVal) {
        if (newVal) params = newVal;
        if (!nav) return;

        var newHref = $state.href(ref.state, params, options);

        if (uiSrefActive) {
          uiSrefActive.$$setStateInfo(ref.state, params);
        }
        if (!newHref) {
          nav = false;
          return false;
        }
        element[0][attr] = newHref;
      };

      if (ref.paramExpr) {
        scope.$watch(ref.paramExpr, function(newVal, oldVal) {
          if (newVal !== params) update(newVal);
        }, true);
        params = scope.$eval(ref.paramExpr);
      }
      update();

      if (isForm) return;

      element.bind("click", function(e) {
        var button = e.which || e.button;
        if ( !(button > 1 || e.ctrlKey || e.metaKey || e.shiftKey || element.attr('target')) ) {
          // HACK: This is to allow ng-clicks to be processed before the transition is initiated:
          $timeout(function() {
            $state.go(ref.state, params, options);
          });
          e.preventDefault();
        }
      });
    }
  };
}

/**
 * @ngdoc directive
 * @name ui.router.state.directive:ui-sref-active
 *
 * @requires ui.router.state.$state
 * @requires ui.router.state.$stateParams
 * @requires $interpolate
 *
 * @restrict A
 *
 * @description
 * A directive working alongside ui-sref to add classes to an element when the 
 * related ui-sref directive's state is active, and removing them when it is inactive.
 * The primary use-case is to simplify the special appearance of navigation menus 
 * relying on `ui-sref`, by having the "active" state's menu button appear different,
 * distinguishing it from the inactive menu items.
 *
 * @example
 * Given the following template:
 * <pre>
 * <ul>
 *   <li ui-sref-active="active" class="item">
 *     <a href ui-sref="app.user({user: 'bilbobaggins'})">@bilbobaggins</a>
 *   </li>
 * </ul>
 * </pre>
 * 
 * When the app state is "app.user", and contains the state parameter "user" with value "bilbobaggins", 
 * the resulting HTML will appear as (note the 'active' class):
 * <pre>
 * <ul>
 *   <li ui-sref-active="active" class="item active">
 *     <a ui-sref="app.user({user: 'bilbobaggins'})" href="/users/bilbobaggins">@bilbobaggins</a>
 *   </li>
 * </ul>
 * </pre>
 * 
 * The class name is interpolated **once** during the directives link time (any further changes to the 
 * interpolated value are ignored). 
 * 
 * Multiple classes may be specified in a space-separated format:
 * <pre>
 * <ul>
 *   <li ui-sref-active='class1 class2 class3'>
 *     <a ui-sref="app.user">link</a>
 *   </li>
 * </ul>
 * </pre>
 */
$StateActiveDirective.$inject = ['$state', '$stateParams', '$interpolate'];
function $StateActiveDirective($state, $stateParams, $interpolate) {
  return {
    restrict: "A",
    controller: ['$scope', '$element', '$attrs', function($scope, $element, $attrs) {
      var state, params, activeClass;

      // There probably isn't much point in $observing this
      activeClass = $interpolate($attrs.uiSrefActive || '', false)($scope);

      // Allow uiSref to communicate with uiSrefActive
      this.$$setStateInfo = function(newState, newParams) {
        state = $state.get(newState, stateContext($element));
        params = newParams;
        update();
      };

      $scope.$on('$stateChangeSuccess', update);

      // Update route state
      function update() {
        if ($state.$current.self === state && matchesParams()) {
          $element.addClass(activeClass);
        } else {
          $element.removeClass(activeClass);
        }
      }

      function matchesParams() {
        return !params || equalForKeys(params, $stateParams);
      }
    }]
  };
}

angular.module('ui.router.state')
  .directive('uiSref', $StateRefDirective)
  .directive('uiSrefActive', $StateActiveDirective);

/**
 * @ngdoc filter
 * @name ui.router.state.filter:isState
 *
 * @requires ui.router.state.$state
 *
 * @description
 * Translates to {@link ui.router.state.$state#methods_is $state.is("stateName")}.
 */
$IsStateFilter.$inject = ['$state'];
function $IsStateFilter($state) {
  return function(state) {
    return $state.is(state);
  };
}

/**
 * @ngdoc filter
 * @name ui.router.state.filter:includedByState
 *
 * @requires ui.router.state.$state
 *
 * @description
 * Translates to {@link ui.router.state.$state#methods_includes $state.includes('fullOrPartialStateName')}.
 */
$IncludedByStateFilter.$inject = ['$state'];
function $IncludedByStateFilter($state) {
  return function(state) {
    return $state.includes(state);
  };
}

angular.module('ui.router.state')
  .filter('isState', $IsStateFilter)
  .filter('includedByState', $IncludedByStateFilter);

/*
 * @ngdoc object
 * @name ui.router.compat.$routeProvider
 *
 * @requires ui.router.state.$stateProvider
 * @requires ui.router.router.$urlRouterProvider
 *
 * @description
 * `$routeProvider` of the `ui.router.compat` module overwrites the existing
 * `routeProvider` from the core. This is done to provide compatibility between
 * the UI Router and the core router.
 *
 * It also provides a `when()` method to register routes that map to certain urls.
 * Behind the scenes it actually delegates either to 
 * {@link ui.router.router.$urlRouterProvider $urlRouterProvider} or to the 
 * {@link ui.router.state.$stateProvider $stateProvider} to postprocess the given 
 * router definition object.
 */
$RouteProvider.$inject = ['$stateProvider', '$urlRouterProvider'];
function $RouteProvider(  $stateProvider,    $urlRouterProvider) {

  var routes = [];

  onEnterRoute.$inject = ['$$state'];
  function onEnterRoute(   $$state) {
    /*jshint validthis: true */
    this.locals = $$state.locals.globals;
    this.params = this.locals.$stateParams;
  }

  function onExitRoute() {
    /*jshint validthis: true */
    this.locals = null;
    this.params = null;
  }

  this.when = when;
  /*
   * @ngdoc function
   * @name ui.router.compat.$routeProvider#when
   * @methodOf ui.router.compat.$routeProvider
   *
   * @description
   * Registers a route with a given route definition object. The route definition
   * object has the same interface the angular core route definition object has.
   * 
   * @example
   * <pre>
   * var app = angular.module('app', ['ui.router.compat']);
   *
   * app.config(function ($routeProvider) {
   *   $routeProvider.when('home', {
   *     controller: function () { ... },
   *     templateUrl: 'path/to/template'
   *   });
   * });
   * </pre>
   *
   * @param {string} url URL as string
   * @param {object} route Route definition object
   *
   * @return {object} $routeProvider - $routeProvider instance
   */
  function when(url, route) {
    /*jshint validthis: true */
    if (route.redirectTo != null) {
      // Redirect, configure directly on $urlRouterProvider
      var redirect = route.redirectTo, handler;
      if (isString(redirect)) {
        handler = redirect; // leave $urlRouterProvider to handle
      } else if (isFunction(redirect)) {
        // Adapt to $urlRouterProvider API
        handler = function (params, $location) {
          return redirect(params, $location.path(), $location.search());
        };
      } else {
        throw new Error("Invalid 'redirectTo' in when()");
      }
      $urlRouterProvider.when(url, handler);
    } else {
      // Regular route, configure as state
      $stateProvider.state(inherit(route, {
        parent: null,
        name: 'route:' + encodeURIComponent(url),
        url: url,
        onEnter: onEnterRoute,
        onExit: onExitRoute
      }));
    }
    routes.push(route);
    return this;
  }

  /*
   * @ngdoc object
   * @name ui.router.compat.$route
   *
   * @requires ui.router.state.$state
   * @requires $rootScope
   * @requires $routeParams
   *
   * @property {object} routes - Array of registered routes.
   * @property {object} params - Current route params as object.
   * @property {string} current - Name of the current route.
   *
   * @description
   * The `$route` service provides interfaces to access defined routes. It also let's
   * you access route params through `$routeParams` service, so you have fully
   * control over all the stuff you would actually get from angular's core `$route`
   * service.
   */
  this.$get = $get;
  $get.$inject = ['$state', '$rootScope', '$routeParams'];
  function $get(   $state,   $rootScope,   $routeParams) {

    var $route = {
      routes: routes,
      params: $routeParams,
      current: undefined
    };

    function stateAsRoute(state) {
      return (state.name !== '') ? state : undefined;
    }

    $rootScope.$on('$stateChangeStart', function (ev, to, toParams, from, fromParams) {
      $rootScope.$broadcast('$routeChangeStart', stateAsRoute(to), stateAsRoute(from));
    });

    $rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
      $route.current = stateAsRoute(to);
      $rootScope.$broadcast('$routeChangeSuccess', stateAsRoute(to), stateAsRoute(from));
      copy(toParams, $route.params);
    });

    $rootScope.$on('$stateChangeError', function (ev, to, toParams, from, fromParams, error) {
      $rootScope.$broadcast('$routeChangeError', stateAsRoute(to), stateAsRoute(from), error);
    });

    return $route;
  }
}

angular.module('ui.router.compat')
  .provider('$route', $RouteProvider)
  .directive('ngView', $ViewDirective);
})(window, window.angular);
}).call(this,require("DF1urx"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../../node_modules/angular-ui-router/release/angular-ui-router.js","/../../../../node_modules/angular-ui-router/release")
},{"DF1urx":10,"buffer":7}],5:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
require('./lib/angular.min.js');

module.exports = angular;

}).call(this,require("DF1urx"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../../node_modules/angular/index-browserify.js","/../../../../node_modules/angular")
},{"./lib/angular.min.js":6,"DF1urx":10,"buffer":7}],6:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*
 AngularJS v1.2.18
 (c) 2010-2014 Google, Inc. http://angularjs.org
 License: MIT
*/
(function(T,V,s){'use strict';function t(b){return function(){var a=arguments[0],c,a="["+(b?b+":":"")+a+"] http://errors.angularjs.org/1.2.18/"+(b?b+"/":"")+a;for(c=1;c<arguments.length;c++)a=a+(1==c?"?":"&")+"p"+(c-1)+"="+encodeURIComponent("function"==typeof arguments[c]?arguments[c].toString().replace(/ \{[\s\S]*$/,""):"undefined"==typeof arguments[c]?"undefined":"string"!=typeof arguments[c]?JSON.stringify(arguments[c]):arguments[c]);return Error(a)}}function db(b){if(null==b||Ea(b))return!1;
var a=b.length;return 1===b.nodeType&&a?!0:C(b)||O(b)||0===a||"number"===typeof a&&0<a&&a-1 in b}function q(b,a,c){var d;if(b)if(Q(b))for(d in b)"prototype"==d||("length"==d||"name"==d||b.hasOwnProperty&&!b.hasOwnProperty(d))||a.call(c,b[d],d);else if(b.forEach&&b.forEach!==q)b.forEach(a,c);else if(db(b))for(d=0;d<b.length;d++)a.call(c,b[d],d);else for(d in b)b.hasOwnProperty(d)&&a.call(c,b[d],d);return b}function Wb(b){var a=[],c;for(c in b)b.hasOwnProperty(c)&&a.push(c);return a.sort()}function Sc(b,
a,c){for(var d=Wb(b),e=0;e<d.length;e++)a.call(c,b[d[e]],d[e]);return d}function Xb(b){return function(a,c){b(c,a)}}function eb(){for(var b=ja.length,a;b;){b--;a=ja[b].charCodeAt(0);if(57==a)return ja[b]="A",ja.join("");if(90==a)ja[b]="0";else return ja[b]=String.fromCharCode(a+1),ja.join("")}ja.unshift("0");return ja.join("")}function Yb(b,a){a?b.$$hashKey=a:delete b.$$hashKey}function J(b){var a=b.$$hashKey;q(arguments,function(a){a!==b&&q(a,function(a,c){b[c]=a})});Yb(b,a);return b}function Z(b){return parseInt(b,
10)}function Zb(b,a){return J(new (J(function(){},{prototype:b})),a)}function y(){}function Fa(b){return b}function $(b){return function(){return b}}function D(b){return"undefined"===typeof b}function B(b){return"undefined"!==typeof b}function U(b){return null!=b&&"object"===typeof b}function C(b){return"string"===typeof b}function yb(b){return"number"===typeof b}function Na(b){return"[object Date]"===wa.call(b)}function Q(b){return"function"===typeof b}function fb(b){return"[object RegExp]"===wa.call(b)}
function Ea(b){return b&&b.document&&b.location&&b.alert&&b.setInterval}function Tc(b){return!(!b||!(b.nodeName||b.prop&&b.attr&&b.find))}function Uc(b,a,c){var d=[];q(b,function(b,g,f){d.push(a.call(c,b,g,f))});return d}function Oa(b,a){if(b.indexOf)return b.indexOf(a);for(var c=0;c<b.length;c++)if(a===b[c])return c;return-1}function Pa(b,a){var c=Oa(b,a);0<=c&&b.splice(c,1);return a}function Ga(b,a,c,d){if(Ea(b)||b&&b.$evalAsync&&b.$watch)throw Qa("cpws");if(a){if(b===a)throw Qa("cpi");c=c||[];
d=d||[];if(U(b)){var e=Oa(c,b);if(-1!==e)return d[e];c.push(b);d.push(a)}if(O(b))for(var g=a.length=0;g<b.length;g++)e=Ga(b[g],null,c,d),U(b[g])&&(c.push(b[g]),d.push(e)),a.push(e);else{var f=a.$$hashKey;q(a,function(b,c){delete a[c]});for(g in b)e=Ga(b[g],null,c,d),U(b[g])&&(c.push(b[g]),d.push(e)),a[g]=e;Yb(a,f)}}else(a=b)&&(O(b)?a=Ga(b,[],c,d):Na(b)?a=new Date(b.getTime()):fb(b)?a=RegExp(b.source):U(b)&&(a=Ga(b,{},c,d)));return a}function ka(b,a){if(O(b)){a=a||[];for(var c=0;c<b.length;c++)a[c]=
b[c]}else if(U(b))for(c in a=a||{},b)!zb.call(b,c)||"$"===c.charAt(0)&&"$"===c.charAt(1)||(a[c]=b[c]);return a||b}function xa(b,a){if(b===a)return!0;if(null===b||null===a)return!1;if(b!==b&&a!==a)return!0;var c=typeof b,d;if(c==typeof a&&"object"==c)if(O(b)){if(!O(a))return!1;if((c=b.length)==a.length){for(d=0;d<c;d++)if(!xa(b[d],a[d]))return!1;return!0}}else{if(Na(b))return Na(a)&&b.getTime()==a.getTime();if(fb(b)&&fb(a))return b.toString()==a.toString();if(b&&b.$evalAsync&&b.$watch||a&&a.$evalAsync&&
a.$watch||Ea(b)||Ea(a)||O(a))return!1;c={};for(d in b)if("$"!==d.charAt(0)&&!Q(b[d])){if(!xa(b[d],a[d]))return!1;c[d]=!0}for(d in a)if(!c.hasOwnProperty(d)&&"$"!==d.charAt(0)&&a[d]!==s&&!Q(a[d]))return!1;return!0}return!1}function $b(){return V.securityPolicy&&V.securityPolicy.isActive||V.querySelector&&!(!V.querySelector("[ng-csp]")&&!V.querySelector("[data-ng-csp]"))}function Ab(b,a){var c=2<arguments.length?ya.call(arguments,2):[];return!Q(a)||a instanceof RegExp?a:c.length?function(){return arguments.length?
a.apply(b,c.concat(ya.call(arguments,0))):a.apply(b,c)}:function(){return arguments.length?a.apply(b,arguments):a.call(b)}}function Vc(b,a){var c=a;"string"===typeof b&&"$"===b.charAt(0)?c=s:Ea(a)?c="$WINDOW":a&&V===a?c="$DOCUMENT":a&&(a.$evalAsync&&a.$watch)&&(c="$SCOPE");return c}function ra(b,a){return"undefined"===typeof b?s:JSON.stringify(b,Vc,a?"  ":null)}function ac(b){return C(b)?JSON.parse(b):b}function Ra(b){"function"===typeof b?b=!0:b&&0!==b.length?(b=L(""+b),b=!("f"==b||"0"==b||"false"==
b||"no"==b||"n"==b||"[]"==b)):b=!1;return b}function ga(b){b=w(b).clone();try{b.empty()}catch(a){}var c=w("<div>").append(b).html();try{return 3===b[0].nodeType?L(c):c.match(/^(<[^>]+>)/)[1].replace(/^<([\w\-]+)/,function(a,b){return"<"+L(b)})}catch(d){return L(c)}}function bc(b){try{return decodeURIComponent(b)}catch(a){}}function cc(b){var a={},c,d;q((b||"").split("&"),function(b){b&&(c=b.split("="),d=bc(c[0]),B(d)&&(b=B(c[1])?bc(c[1]):!0,a[d]?O(a[d])?a[d].push(b):a[d]=[a[d],b]:a[d]=b))});return a}
function Bb(b){var a=[];q(b,function(b,d){O(b)?q(b,function(b){a.push(za(d,!0)+(!0===b?"":"="+za(b,!0)))}):a.push(za(d,!0)+(!0===b?"":"="+za(b,!0)))});return a.length?a.join("&"):""}function gb(b){return za(b,!0).replace(/%26/gi,"&").replace(/%3D/gi,"=").replace(/%2B/gi,"+")}function za(b,a){return encodeURIComponent(b).replace(/%40/gi,"@").replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,a?"%20":"+")}function Wc(b,a){function c(a){a&&d.push(a)}var d=[b],e,g,f=["ng:app",
"ng-app","x-ng-app","data-ng-app"],k=/\sng[:\-]app(:\s*([\w\d_]+);?)?\s/;q(f,function(a){f[a]=!0;c(V.getElementById(a));a=a.replace(":","\\:");b.querySelectorAll&&(q(b.querySelectorAll("."+a),c),q(b.querySelectorAll("."+a+"\\:"),c),q(b.querySelectorAll("["+a+"]"),c))});q(d,function(a){if(!e){var b=k.exec(" "+a.className+" ");b?(e=a,g=(b[2]||"").replace(/\s+/g,",")):q(a.attributes,function(b){!e&&f[b.name]&&(e=a,g=b.value)})}});e&&a(e,g?[g]:[])}function dc(b,a){var c=function(){b=w(b);if(b.injector()){var c=
b[0]===V?"document":ga(b);throw Qa("btstrpd",c);}a=a||[];a.unshift(["$provide",function(a){a.value("$rootElement",b)}]);a.unshift("ng");c=ec(a);c.invoke(["$rootScope","$rootElement","$compile","$injector","$animate",function(a,b,c,d,e){a.$apply(function(){b.data("$injector",d);c(b)(a)})}]);return c},d=/^NG_DEFER_BOOTSTRAP!/;if(T&&!d.test(T.name))return c();T.name=T.name.replace(d,"");Sa.resumeBootstrap=function(b){q(b,function(b){a.push(b)});c()}}function hb(b,a){a=a||"_";return b.replace(Xc,function(b,
d){return(d?a:"")+b.toLowerCase()})}function Cb(b,a,c){if(!b)throw Qa("areq",a||"?",c||"required");return b}function Ta(b,a,c){c&&O(b)&&(b=b[b.length-1]);Cb(Q(b),a,"not a function, got "+(b&&"object"==typeof b?b.constructor.name||"Object":typeof b));return b}function Aa(b,a){if("hasOwnProperty"===b)throw Qa("badname",a);}function fc(b,a,c){if(!a)return b;a=a.split(".");for(var d,e=b,g=a.length,f=0;f<g;f++)d=a[f],b&&(b=(e=b)[d]);return!c&&Q(b)?Ab(e,b):b}function Db(b){var a=b[0];b=b[b.length-1];if(a===
b)return w(a);var c=[a];do{a=a.nextSibling;if(!a)break;c.push(a)}while(a!==b);return w(c)}function Yc(b){var a=t("$injector"),c=t("ng");b=b.angular||(b.angular={});b.$$minErr=b.$$minErr||t;return b.module||(b.module=function(){var b={};return function(e,g,f){if("hasOwnProperty"===e)throw c("badname","module");g&&b.hasOwnProperty(e)&&(b[e]=null);return b[e]||(b[e]=function(){function b(a,d,e){return function(){c[e||"push"]([a,d,arguments]);return n}}if(!g)throw a("nomod",e);var c=[],d=[],l=b("$injector",
"invoke"),n={_invokeQueue:c,_runBlocks:d,requires:g,name:e,provider:b("$provide","provider"),factory:b("$provide","factory"),service:b("$provide","service"),value:b("$provide","value"),constant:b("$provide","constant","unshift"),animation:b("$animateProvider","register"),filter:b("$filterProvider","register"),controller:b("$controllerProvider","register"),directive:b("$compileProvider","directive"),config:l,run:function(a){d.push(a);return this}};f&&l(f);return n}())}}())}function Zc(b){J(b,{bootstrap:dc,
copy:Ga,extend:J,equals:xa,element:w,forEach:q,injector:ec,noop:y,bind:Ab,toJson:ra,fromJson:ac,identity:Fa,isUndefined:D,isDefined:B,isString:C,isFunction:Q,isObject:U,isNumber:yb,isElement:Tc,isArray:O,version:$c,isDate:Na,lowercase:L,uppercase:Ha,callbacks:{counter:0},$$minErr:t,$$csp:$b});Ua=Yc(T);try{Ua("ngLocale")}catch(a){Ua("ngLocale",[]).provider("$locale",ad)}Ua("ng",["ngLocale"],["$provide",function(a){a.provider({$$sanitizeUri:bd});a.provider("$compile",gc).directive({a:cd,input:hc,textarea:hc,
form:dd,script:ed,select:fd,style:gd,option:hd,ngBind:id,ngBindHtml:jd,ngBindTemplate:kd,ngClass:ld,ngClassEven:md,ngClassOdd:nd,ngCloak:od,ngController:pd,ngForm:qd,ngHide:rd,ngIf:sd,ngInclude:td,ngInit:ud,ngNonBindable:vd,ngPluralize:wd,ngRepeat:xd,ngShow:yd,ngStyle:zd,ngSwitch:Ad,ngSwitchWhen:Bd,ngSwitchDefault:Cd,ngOptions:Dd,ngTransclude:Ed,ngModel:Fd,ngList:Gd,ngChange:Hd,required:ic,ngRequired:ic,ngValue:Id}).directive({ngInclude:Jd}).directive(Eb).directive(jc);a.provider({$anchorScroll:Kd,
$animate:Ld,$browser:Md,$cacheFactory:Nd,$controller:Od,$document:Pd,$exceptionHandler:Qd,$filter:kc,$interpolate:Rd,$interval:Sd,$http:Td,$httpBackend:Ud,$location:Vd,$log:Wd,$parse:Xd,$rootScope:Yd,$q:Zd,$sce:$d,$sceDelegate:ae,$sniffer:be,$templateCache:ce,$timeout:de,$window:ee,$$rAF:fe,$$asyncCallback:ge})}])}function Va(b){return b.replace(he,function(a,b,d,e){return e?d.toUpperCase():d}).replace(ie,"Moz$1")}function Fb(b,a,c,d){function e(b){var e=c&&b?[this.filter(b)]:[this],m=a,h,l,n,p,r,
v;if(!d||null!=b)for(;e.length;)for(h=e.shift(),l=0,n=h.length;l<n;l++)for(p=w(h[l]),m?p.triggerHandler("$destroy"):m=!m,r=0,p=(v=p.children()).length;r<p;r++)e.push(Ba(v[r]));return g.apply(this,arguments)}var g=Ba.fn[b],g=g.$original||g;e.$original=g;Ba.fn[b]=e}function R(b){if(b instanceof R)return b;C(b)&&(b=aa(b));if(!(this instanceof R)){if(C(b)&&"<"!=b.charAt(0))throw Gb("nosel");return new R(b)}if(C(b)){var a=b;b=V;var c;if(c=je.exec(a))b=[b.createElement(c[1])];else{var d=b,e;b=d.createDocumentFragment();
c=[];if(Hb.test(a)){d=b.appendChild(d.createElement("div"));e=(ke.exec(a)||["",""])[1].toLowerCase();e=da[e]||da._default;d.innerHTML="<div>&#160;</div>"+e[1]+a.replace(le,"<$1></$2>")+e[2];d.removeChild(d.firstChild);for(a=e[0];a--;)d=d.lastChild;a=0;for(e=d.childNodes.length;a<e;++a)c.push(d.childNodes[a]);d=b.firstChild;d.textContent=""}else c.push(d.createTextNode(a));b.textContent="";b.innerHTML="";b=c}Ib(this,b);w(V.createDocumentFragment()).append(this)}else Ib(this,b)}function Jb(b){return b.cloneNode(!0)}
function Ia(b){lc(b);var a=0;for(b=b.childNodes||[];a<b.length;a++)Ia(b[a])}function mc(b,a,c,d){if(B(d))throw Gb("offargs");var e=la(b,"events");la(b,"handle")&&(D(a)?q(e,function(a,c){Wa(b,c,a);delete e[c]}):q(a.split(" "),function(a){D(c)?(Wa(b,a,e[a]),delete e[a]):Pa(e[a]||[],c)}))}function lc(b,a){var c=b[ib],d=Xa[c];d&&(a?delete Xa[c].data[a]:(d.handle&&(d.events.$destroy&&d.handle({},"$destroy"),mc(b)),delete Xa[c],b[ib]=s))}function la(b,a,c){var d=b[ib],d=Xa[d||-1];if(B(c))d||(b[ib]=d=++me,
d=Xa[d]={}),d[a]=c;else return d&&d[a]}function nc(b,a,c){var d=la(b,"data"),e=B(c),g=!e&&B(a),f=g&&!U(a);d||f||la(b,"data",d={});if(e)d[a]=c;else if(g){if(f)return d&&d[a];J(d,a)}else return d}function Kb(b,a){return b.getAttribute?-1<(" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ").indexOf(" "+a+" "):!1}function jb(b,a){a&&b.setAttribute&&q(a.split(" "),function(a){b.setAttribute("class",aa((" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ").replace(" "+aa(a)+" "," ")))})}
function kb(b,a){if(a&&b.setAttribute){var c=(" "+(b.getAttribute("class")||"")+" ").replace(/[\n\t]/g," ");q(a.split(" "),function(a){a=aa(a);-1===c.indexOf(" "+a+" ")&&(c+=a+" ")});b.setAttribute("class",aa(c))}}function Ib(b,a){if(a){a=a.nodeName||!B(a.length)||Ea(a)?[a]:a;for(var c=0;c<a.length;c++)b.push(a[c])}}function oc(b,a){return lb(b,"$"+(a||"ngController")+"Controller")}function lb(b,a,c){b=w(b);9==b[0].nodeType&&(b=b.find("html"));for(a=O(a)?a:[a];b.length;){for(var d=b[0],e=0,g=a.length;e<
g;e++)if((c=b.data(a[e]))!==s)return c;b=w(d.parentNode||11===d.nodeType&&d.host)}}function pc(b){for(var a=0,c=b.childNodes;a<c.length;a++)Ia(c[a]);for(;b.firstChild;)b.removeChild(b.firstChild)}function qc(b,a){var c=mb[a.toLowerCase()];return c&&rc[b.nodeName]&&c}function ne(b,a){var c=function(c,e){c.preventDefault||(c.preventDefault=function(){c.returnValue=!1});c.stopPropagation||(c.stopPropagation=function(){c.cancelBubble=!0});c.target||(c.target=c.srcElement||V);if(D(c.defaultPrevented)){var g=
c.preventDefault;c.preventDefault=function(){c.defaultPrevented=!0;g.call(c)};c.defaultPrevented=!1}c.isDefaultPrevented=function(){return c.defaultPrevented||!1===c.returnValue};var f=ka(a[e||c.type]||[]);q(f,function(a){a.call(b,c)});8>=S?(c.preventDefault=null,c.stopPropagation=null,c.isDefaultPrevented=null):(delete c.preventDefault,delete c.stopPropagation,delete c.isDefaultPrevented)};c.elem=b;return c}function Ja(b){var a=typeof b,c;"object"==a&&null!==b?"function"==typeof(c=b.$$hashKey)?c=
b.$$hashKey():c===s&&(c=b.$$hashKey=eb()):c=b;return a+":"+c}function Ya(b){q(b,this.put,this)}function sc(b){var a,c;"function"==typeof b?(a=b.$inject)||(a=[],b.length&&(c=b.toString().replace(oe,""),c=c.match(pe),q(c[1].split(qe),function(b){b.replace(re,function(b,c,d){a.push(d)})})),b.$inject=a):O(b)?(c=b.length-1,Ta(b[c],"fn"),a=b.slice(0,c)):Ta(b,"fn",!0);return a}function ec(b){function a(a){return function(b,c){if(U(b))q(b,Xb(a));else return a(b,c)}}function c(a,b){Aa(a,"service");if(Q(b)||
O(b))b=n.instantiate(b);if(!b.$get)throw Za("pget",a);return l[a+k]=b}function d(a,b){return c(a,{$get:b})}function e(a){var b=[],c,d,g,k;q(a,function(a){if(!h.get(a)){h.put(a,!0);try{if(C(a))for(c=Ua(a),b=b.concat(e(c.requires)).concat(c._runBlocks),d=c._invokeQueue,g=0,k=d.length;g<k;g++){var f=d[g],m=n.get(f[0]);m[f[1]].apply(m,f[2])}else Q(a)?b.push(n.invoke(a)):O(a)?b.push(n.invoke(a)):Ta(a,"module")}catch(l){throw O(a)&&(a=a[a.length-1]),l.message&&(l.stack&&-1==l.stack.indexOf(l.message))&&
(l=l.message+"\n"+l.stack),Za("modulerr",a,l.stack||l.message||l);}}});return b}function g(a,b){function c(d){if(a.hasOwnProperty(d)){if(a[d]===f)throw Za("cdep",d+" <- "+m.join(" <- "));return a[d]}try{return m.unshift(d),a[d]=f,a[d]=b(d)}catch(e){throw a[d]===f&&delete a[d],e;}finally{m.shift()}}function d(a,b,e){var g=[],k=sc(a),f,m,h;m=0;for(f=k.length;m<f;m++){h=k[m];if("string"!==typeof h)throw Za("itkn",h);g.push(e&&e.hasOwnProperty(h)?e[h]:c(h))}a.$inject||(a=a[f]);return a.apply(b,g)}return{invoke:d,
instantiate:function(a,b){var c=function(){},e;c.prototype=(O(a)?a[a.length-1]:a).prototype;c=new c;e=d(a,c,b);return U(e)||Q(e)?e:c},get:c,annotate:sc,has:function(b){return l.hasOwnProperty(b+k)||a.hasOwnProperty(b)}}}var f={},k="Provider",m=[],h=new Ya,l={$provide:{provider:a(c),factory:a(d),service:a(function(a,b){return d(a,["$injector",function(a){return a.instantiate(b)}])}),value:a(function(a,b){return d(a,$(b))}),constant:a(function(a,b){Aa(a,"constant");l[a]=b;p[a]=b}),decorator:function(a,
b){var c=n.get(a+k),d=c.$get;c.$get=function(){var a=r.invoke(d,c);return r.invoke(b,null,{$delegate:a})}}}},n=l.$injector=g(l,function(){throw Za("unpr",m.join(" <- "));}),p={},r=p.$injector=g(p,function(a){a=n.get(a+k);return r.invoke(a.$get,a)});q(e(b),function(a){r.invoke(a||y)});return r}function Kd(){var b=!0;this.disableAutoScrolling=function(){b=!1};this.$get=["$window","$location","$rootScope",function(a,c,d){function e(a){var b=null;q(a,function(a){b||"a"!==L(a.nodeName)||(b=a)});return b}
function g(){var b=c.hash(),d;b?(d=f.getElementById(b))?d.scrollIntoView():(d=e(f.getElementsByName(b)))?d.scrollIntoView():"top"===b&&a.scrollTo(0,0):a.scrollTo(0,0)}var f=a.document;b&&d.$watch(function(){return c.hash()},function(){d.$evalAsync(g)});return g}]}function ge(){this.$get=["$$rAF","$timeout",function(b,a){return b.supported?function(a){return b(a)}:function(b){return a(b,0,!1)}}]}function se(b,a,c,d){function e(a){try{a.apply(null,ya.call(arguments,1))}finally{if(v--,0===v)for(;I.length;)try{I.pop()()}catch(b){c.error(b)}}}
function g(a,b){(function ba(){q(x,function(a){a()});u=b(ba,a)})()}function f(){z=null;M!=k.url()&&(M=k.url(),q(ha,function(a){a(k.url())}))}var k=this,m=a[0],h=b.location,l=b.history,n=b.setTimeout,p=b.clearTimeout,r={};k.isMock=!1;var v=0,I=[];k.$$completeOutstandingRequest=e;k.$$incOutstandingRequestCount=function(){v++};k.notifyWhenNoOutstandingRequests=function(a){q(x,function(a){a()});0===v?a():I.push(a)};var x=[],u;k.addPollFn=function(a){D(u)&&g(100,n);x.push(a);return a};var M=h.href,F=a.find("base"),
z=null;k.url=function(a,c){h!==b.location&&(h=b.location);l!==b.history&&(l=b.history);if(a){if(M!=a)return M=a,d.history?c?l.replaceState(null,"",a):(l.pushState(null,"",a),F.attr("href",F.attr("href"))):(z=a,c?h.replace(a):h.href=a),k}else return z||h.href.replace(/%27/g,"'")};var ha=[],P=!1;k.onUrlChange=function(a){if(!P){if(d.history)w(b).on("popstate",f);if(d.hashchange)w(b).on("hashchange",f);else k.addPollFn(f);P=!0}ha.push(a);return a};k.baseHref=function(){var a=F.attr("href");return a?
a.replace(/^(https?\:)?\/\/[^\/]*/,""):""};var N={},ca="",E=k.baseHref();k.cookies=function(a,b){var d,e,g,k;if(a)b===s?m.cookie=escape(a)+"=;path="+E+";expires=Thu, 01 Jan 1970 00:00:00 GMT":C(b)&&(d=(m.cookie=escape(a)+"="+escape(b)+";path="+E).length+1,4096<d&&c.warn("Cookie '"+a+"' possibly not set or overflowed because it was too large ("+d+" > 4096 bytes)!"));else{if(m.cookie!==ca)for(ca=m.cookie,d=ca.split("; "),N={},g=0;g<d.length;g++)e=d[g],k=e.indexOf("="),0<k&&(a=unescape(e.substring(0,
k)),N[a]===s&&(N[a]=unescape(e.substring(k+1))));return N}};k.defer=function(a,b){var c;v++;c=n(function(){delete r[c];e(a)},b||0);r[c]=!0;return c};k.defer.cancel=function(a){return r[a]?(delete r[a],p(a),e(y),!0):!1}}function Md(){this.$get=["$window","$log","$sniffer","$document",function(b,a,c,d){return new se(b,d,a,c)}]}function Nd(){this.$get=function(){function b(b,d){function e(a){a!=n&&(p?p==a&&(p=a.n):p=a,g(a.n,a.p),g(a,n),n=a,n.n=null)}function g(a,b){a!=b&&(a&&(a.p=b),b&&(b.n=a))}if(b in
a)throw t("$cacheFactory")("iid",b);var f=0,k=J({},d,{id:b}),m={},h=d&&d.capacity||Number.MAX_VALUE,l={},n=null,p=null;return a[b]={put:function(a,b){if(h<Number.MAX_VALUE){var c=l[a]||(l[a]={key:a});e(c)}if(!D(b))return a in m||f++,m[a]=b,f>h&&this.remove(p.key),b},get:function(a){if(h<Number.MAX_VALUE){var b=l[a];if(!b)return;e(b)}return m[a]},remove:function(a){if(h<Number.MAX_VALUE){var b=l[a];if(!b)return;b==n&&(n=b.p);b==p&&(p=b.n);g(b.n,b.p);delete l[a]}delete m[a];f--},removeAll:function(){m=
{};f=0;l={};n=p=null},destroy:function(){l=k=m=null;delete a[b]},info:function(){return J({},k,{size:f})}}}var a={};b.info=function(){var b={};q(a,function(a,e){b[e]=a.info()});return b};b.get=function(b){return a[b]};return b}}function ce(){this.$get=["$cacheFactory",function(b){return b("templates")}]}function gc(b,a){var c={},d="Directive",e=/^\s*directive\:\s*([\d\w_\-]+)\s+(.*)$/,g=/(([\d\w_\-]+)(?:\:([^;]+))?;?)/,f=/^(on[a-z]+|formaction)$/;this.directive=function m(a,e){Aa(a,"directive");C(a)?
(Cb(e,"directiveFactory"),c.hasOwnProperty(a)||(c[a]=[],b.factory(a+d,["$injector","$exceptionHandler",function(b,d){var e=[];q(c[a],function(c,g){try{var f=b.invoke(c);Q(f)?f={compile:$(f)}:!f.compile&&f.link&&(f.compile=$(f.link));f.priority=f.priority||0;f.index=g;f.name=f.name||a;f.require=f.require||f.controller&&f.name;f.restrict=f.restrict||"A";e.push(f)}catch(m){d(m)}});return e}])),c[a].push(e)):q(a,Xb(m));return this};this.aHrefSanitizationWhitelist=function(b){return B(b)?(a.aHrefSanitizationWhitelist(b),
this):a.aHrefSanitizationWhitelist()};this.imgSrcSanitizationWhitelist=function(b){return B(b)?(a.imgSrcSanitizationWhitelist(b),this):a.imgSrcSanitizationWhitelist()};this.$get=["$injector","$interpolate","$exceptionHandler","$http","$templateCache","$parse","$controller","$rootScope","$document","$sce","$animate","$$sanitizeUri",function(a,b,l,n,p,r,v,I,x,u,M,F){function z(a,b,c,d,e){a instanceof w||(a=w(a));q(a,function(b,c){3==b.nodeType&&b.nodeValue.match(/\S+/)&&(a[c]=w(b).wrap("<span></span>").parent()[0])});
var g=P(a,b,a,c,d,e);ha(a,"ng-scope");return function(b,c,d,e){Cb(b,"scope");var f=c?Ka.clone.call(a):a;q(d,function(a,b){f.data("$"+b+"Controller",a)});d=0;for(var m=f.length;d<m;d++){var h=f[d].nodeType;1!==h&&9!==h||f.eq(d).data("$scope",b)}c&&c(f,b);g&&g(b,f,f,e);return f}}function ha(a,b){try{a.addClass(b)}catch(c){}}function P(a,b,c,d,e,g){function f(a,c,d,e){var g,h,l,r,n,p,v;g=c.length;var K=Array(g);for(n=0;n<g;n++)K[n]=c[n];v=n=0;for(p=m.length;n<p;v++)h=K[v],c=m[n++],g=m[n++],l=w(h),c?
(c.scope?(r=a.$new(),l.data("$scope",r)):r=a,l=c.transcludeOnThisElement?N(a,c.transclude,e):!c.templateOnThisElement&&e?e:!e&&b?N(a,b):null,c(g,r,h,d,l)):g&&g(a,h.childNodes,s,e)}for(var m=[],h,l,r,n,p=0;p<a.length;p++)h=new Lb,l=ca(a[p],[],h,0===p?d:s,e),(g=l.length?H(l,a[p],h,b,c,null,[],[],g):null)&&g.scope&&ha(w(a[p]),"ng-scope"),h=g&&g.terminal||!(r=a[p].childNodes)||!r.length?null:P(r,g?(g.transcludeOnThisElement||!g.templateOnThisElement)&&g.transclude:b),m.push(g,h),n=n||g||h,g=null;return n?
f:null}function N(a,b,c){return function(d,e,g){var f=!1;d||(d=a.$new(),f=d.$$transcluded=!0);e=b(d,e,g,c);if(f)e.on("$destroy",function(){d.$destroy()});return e}}function ca(a,b,c,d,f){var m=c.$attr,h;switch(a.nodeType){case 1:ba(b,ma(La(a).toLowerCase()),"E",d,f);var l,r,n;h=a.attributes;for(var p=0,v=h&&h.length;p<v;p++){var x=!1,I=!1;l=h[p];if(!S||8<=S||l.specified){r=l.name;n=ma(r);W.test(n)&&(r=hb(n.substr(6),"-"));var M=n.replace(/(Start|End)$/,"");n===M+"Start"&&(x=r,I=r.substr(0,r.length-
5)+"end",r=r.substr(0,r.length-6));n=ma(r.toLowerCase());m[n]=r;c[n]=l=aa(l.value);qc(a,n)&&(c[n]=!0);R(a,b,l,n);ba(b,n,"A",d,f,x,I)}}a=a.className;if(C(a)&&""!==a)for(;h=g.exec(a);)n=ma(h[2]),ba(b,n,"C",d,f)&&(c[n]=aa(h[3])),a=a.substr(h.index+h[0].length);break;case 3:t(b,a.nodeValue);break;case 8:try{if(h=e.exec(a.nodeValue))n=ma(h[1]),ba(b,n,"M",d,f)&&(c[n]=aa(h[2]))}catch(u){}}b.sort(D);return b}function E(a,b,c){var d=[],e=0;if(b&&a.hasAttribute&&a.hasAttribute(b)){do{if(!a)throw ia("uterdir",
b,c);1==a.nodeType&&(a.hasAttribute(b)&&e++,a.hasAttribute(c)&&e--);d.push(a);a=a.nextSibling}while(0<e)}else d.push(a);return w(d)}function A(a,b,c){return function(d,e,g,f,h){e=E(e[0],b,c);return a(d,e,g,f,h)}}function H(a,c,d,e,g,f,m,n,p){function x(a,b,c,d){if(a){c&&(a=A(a,c,d));a.require=G.require;a.directiveName=na;if(N===G||G.$$isolateScope)a=uc(a,{isolateScope:!0});m.push(a)}if(b){c&&(b=A(b,c,d));b.require=G.require;b.directiveName=na;if(N===G||G.$$isolateScope)b=uc(b,{isolateScope:!0});n.push(b)}}
function I(a,b,c,d){var e,g="data",f=!1;if(C(b)){for(;"^"==(e=b.charAt(0))||"?"==e;)b=b.substr(1),"^"==e&&(g="inheritedData"),f=f||"?"==e;e=null;d&&"data"===g&&(e=d[b]);e=e||c[g]("$"+b+"Controller");if(!e&&!f)throw ia("ctreq",b,a);}else O(b)&&(e=[],q(b,function(b){e.push(I(a,b,c,d))}));return e}function M(a,e,g,f,p){function x(a,b){var c;2>arguments.length&&(b=a,a=s);Ca&&(c=ca);return p(a,b,c)}var u,K,z,F,A,E,ca={},nb;u=c===g?d:ka(d,new Lb(w(g),d.$attr));K=u.$$element;if(N){var ba=/^\s*([@=&])(\??)\s*(\w*)\s*$/;
f=w(g);E=e.$new(!0);!H||H!==N&&H!==N.$$originalDirective?f.data("$isolateScopeNoTemplate",E):f.data("$isolateScope",E);ha(f,"ng-isolate-scope");q(N.scope,function(a,c){var d=a.match(ba)||[],g=d[3]||c,f="?"==d[2],d=d[1],m,l,n,p;E.$$isolateBindings[c]=d+g;switch(d){case "@":u.$observe(g,function(a){E[c]=a});u.$$observers[g].$$scope=e;u[g]&&(E[c]=b(u[g])(e));break;case "=":if(f&&!u[g])break;l=r(u[g]);p=l.literal?xa:function(a,b){return a===b};n=l.assign||function(){m=E[c]=l(e);throw ia("nonassign",u[g],
N.name);};m=E[c]=l(e);E.$watch(function(){var a=l(e);p(a,E[c])||(p(a,m)?n(e,a=E[c]):E[c]=a);return m=a},null,l.literal);break;case "&":l=r(u[g]);E[c]=function(a){return l(e,a)};break;default:throw ia("iscp",N.name,c,a);}})}nb=p&&x;P&&q(P,function(a){var b={$scope:a===N||a.$$isolateScope?E:e,$element:K,$attrs:u,$transclude:nb},c;A=a.controller;"@"==A&&(A=u[a.name]);c=v(A,b);ca[a.name]=c;Ca||K.data("$"+a.name+"Controller",c);a.controllerAs&&(b.$scope[a.controllerAs]=c)});f=0;for(z=m.length;f<z;f++)try{F=
m[f],F(F.isolateScope?E:e,K,u,F.require&&I(F.directiveName,F.require,K,ca),nb)}catch(G){l(G,ga(K))}f=e;N&&(N.template||null===N.templateUrl)&&(f=E);a&&a(f,g.childNodes,s,p);for(f=n.length-1;0<=f;f--)try{F=n[f],F(F.isolateScope?E:e,K,u,F.require&&I(F.directiveName,F.require,K,ca),nb)}catch(B){l(B,ga(K))}}p=p||{};for(var u=-Number.MAX_VALUE,F,P=p.controllerDirectives,N=p.newIsolateScopeDirective,H=p.templateDirective,ba=p.nonTlbTranscludeDirective,D=!1,J=!1,Ca=p.hasElementTranscludeDirective,t=d.$$element=
w(c),G,na,X,T=e,R,S=0,oa=a.length;S<oa;S++){G=a[S];var W=G.$$start,Y=G.$$end;W&&(t=E(c,W,Y));X=s;if(u>G.priority)break;if(X=G.scope)F=F||G,G.templateUrl||(L("new/isolated scope",N,G,t),U(X)&&(N=G));na=G.name;!G.templateUrl&&G.controller&&(X=G.controller,P=P||{},L("'"+na+"' controller",P[na],G,t),P[na]=G);if(X=G.transclude)D=!0,G.$$tlb||(L("transclusion",ba,G,t),ba=G),"element"==X?(Ca=!0,u=G.priority,X=E(c,W,Y),t=d.$$element=w(V.createComment(" "+na+": "+d[na]+" ")),c=t[0],ob(g,w(ya.call(X,0)),c),
T=z(X,e,u,f&&f.name,{nonTlbTranscludeDirective:ba})):(X=w(Jb(c)).contents(),t.empty(),T=z(X,e));if(G.template)if(J=!0,L("template",H,G,t),H=G,X=Q(G.template)?G.template(t,d):G.template,X=Z(X),G.replace){f=G;X=Hb.test(X)?w(aa(X)):[];c=X[0];if(1!=X.length||1!==c.nodeType)throw ia("tplrt",na,"");ob(g,t,c);oa={$attr:{}};X=ca(c,[],oa);var te=a.splice(S+1,a.length-(S+1));N&&tc(X);a=a.concat(X).concat(te);B(d,oa);oa=a.length}else t.html(X);if(G.templateUrl)J=!0,L("template",H,G,t),H=G,G.replace&&(f=G),M=
y(a.splice(S,a.length-S),t,d,g,D&&T,m,n,{controllerDirectives:P,newIsolateScopeDirective:N,templateDirective:H,nonTlbTranscludeDirective:ba}),oa=a.length;else if(G.compile)try{R=G.compile(t,d,T),Q(R)?x(null,R,W,Y):R&&x(R.pre,R.post,W,Y)}catch($){l($,ga(t))}G.terminal&&(M.terminal=!0,u=Math.max(u,G.priority))}M.scope=F&&!0===F.scope;M.transcludeOnThisElement=D;M.templateOnThisElement=J;M.transclude=T;p.hasElementTranscludeDirective=Ca;return M}function tc(a){for(var b=0,c=a.length;b<c;b++)a[b]=Zb(a[b],
{$$isolateScope:!0})}function ba(b,e,g,f,h,r,n){if(e===h)return null;h=null;if(c.hasOwnProperty(e)){var p;e=a.get(e+d);for(var v=0,x=e.length;v<x;v++)try{p=e[v],(f===s||f>p.priority)&&-1!=p.restrict.indexOf(g)&&(r&&(p=Zb(p,{$$start:r,$$end:n})),b.push(p),h=p)}catch(I){l(I)}}return h}function B(a,b){var c=b.$attr,d=a.$attr,e=a.$$element;q(a,function(d,e){"$"!=e.charAt(0)&&(b[e]&&b[e]!==d&&(d+=("style"===e?";":" ")+b[e]),a.$set(e,d,!0,c[e]))});q(b,function(b,g){"class"==g?(ha(e,b),a["class"]=(a["class"]?
a["class"]+" ":"")+b):"style"==g?(e.attr("style",e.attr("style")+";"+b),a.style=(a.style?a.style+";":"")+b):"$"==g.charAt(0)||a.hasOwnProperty(g)||(a[g]=b,d[g]=c[g])})}function y(a,b,c,d,e,g,f,h){var m=[],l,r,v=b[0],x=a.shift(),I=J({},x,{templateUrl:null,transclude:null,replace:null,$$originalDirective:x}),M=Q(x.templateUrl)?x.templateUrl(b,c):x.templateUrl;b.empty();n.get(u.getTrustedResourceUrl(M),{cache:p}).success(function(n){var p,u;n=Z(n);if(x.replace){n=Hb.test(n)?w(aa(n)):[];p=n[0];if(1!=
n.length||1!==p.nodeType)throw ia("tplrt",x.name,M);n={$attr:{}};ob(d,b,p);var z=ca(p,[],n);U(x.scope)&&tc(z);a=z.concat(a);B(c,n)}else p=v,b.html(n);a.unshift(I);l=H(a,p,c,e,b,x,g,f,h);q(d,function(a,c){a==p&&(d[c]=b[0])});for(r=P(b[0].childNodes,e);m.length;){n=m.shift();u=m.shift();var F=m.shift(),A=m.shift(),z=b[0];if(u!==v){var E=u.className;h.hasElementTranscludeDirective&&x.replace||(z=Jb(p));ob(F,w(u),z);ha(w(z),E)}u=l.transcludeOnThisElement?N(n,l.transclude,A):A;l(r,n,z,d,u)}m=null}).error(function(a,
b,c,d){throw ia("tpload",d.url);});return function(a,b,c,d,e){a=e;m?(m.push(b),m.push(c),m.push(d),m.push(a)):(l.transcludeOnThisElement&&(a=N(b,l.transclude,e)),l(r,b,c,d,a))}}function D(a,b){var c=b.priority-a.priority;return 0!==c?c:a.name!==b.name?a.name<b.name?-1:1:a.index-b.index}function L(a,b,c,d){if(b)throw ia("multidir",b.name,c.name,a,ga(d));}function t(a,c){var d=b(c,!0);d&&a.push({priority:0,compile:function(a){var b=a.parent().length;b&&ha(a.parent(),"ng-binding");return function(a,
c){var e=c.parent(),g=e.data("$binding")||[];g.push(d);e.data("$binding",g);b||ha(e,"ng-binding");a.$watch(d,function(a){c[0].nodeValue=a})}}})}function T(a,b){if("srcdoc"==b)return u.HTML;var c=La(a);if("xlinkHref"==b||"FORM"==c&&"action"==b||"IMG"!=c&&("src"==b||"ngSrc"==b))return u.RESOURCE_URL}function R(a,c,d,e){var g=b(d,!0);if(g){if("multiple"===e&&"SELECT"===La(a))throw ia("selmulti",ga(a));c.push({priority:100,compile:function(){return{pre:function(c,d,m){d=m.$$observers||(m.$$observers=
{});if(f.test(e))throw ia("nodomevents");if(g=b(m[e],!0,T(a,e)))m[e]=g(c),(d[e]||(d[e]=[])).$$inter=!0,(m.$$observers&&m.$$observers[e].$$scope||c).$watch(g,function(a,b){"class"===e&&a!=b?m.$updateClass(a,b):m.$set(e,a)})}}}})}}function ob(a,b,c){var d=b[0],e=b.length,g=d.parentNode,f,m;if(a)for(f=0,m=a.length;f<m;f++)if(a[f]==d){a[f++]=c;m=f+e-1;for(var h=a.length;f<h;f++,m++)m<h?a[f]=a[m]:delete a[f];a.length-=e-1;break}g&&g.replaceChild(c,d);a=V.createDocumentFragment();a.appendChild(d);c[w.expando]=
d[w.expando];d=1;for(e=b.length;d<e;d++)g=b[d],w(g).remove(),a.appendChild(g),delete b[d];b[0]=c;b.length=1}function uc(a,b){return J(function(){return a.apply(null,arguments)},a,b)}var Lb=function(a,b){this.$$element=a;this.$attr=b||{}};Lb.prototype={$normalize:ma,$addClass:function(a){a&&0<a.length&&M.addClass(this.$$element,a)},$removeClass:function(a){a&&0<a.length&&M.removeClass(this.$$element,a)},$updateClass:function(a,b){var c=vc(a,b),d=vc(b,a);0===c.length?M.removeClass(this.$$element,d):
0===d.length?M.addClass(this.$$element,c):M.setClass(this.$$element,c,d)},$set:function(a,b,c,d){var e=qc(this.$$element[0],a);e&&(this.$$element.prop(a,b),d=e);this[a]=b;d?this.$attr[a]=d:(d=this.$attr[a])||(this.$attr[a]=d=hb(a,"-"));e=La(this.$$element);if("A"===e&&"href"===a||"IMG"===e&&"src"===a)this[a]=b=F(b,"src"===a);!1!==c&&(null===b||b===s?this.$$element.removeAttr(d):this.$$element.attr(d,b));(c=this.$$observers)&&q(c[a],function(a){try{a(b)}catch(c){l(c)}})},$observe:function(a,b){var c=
this,d=c.$$observers||(c.$$observers={}),e=d[a]||(d[a]=[]);e.push(b);I.$evalAsync(function(){e.$$inter||b(c[a])});return b}};var Ca=b.startSymbol(),oa=b.endSymbol(),Z="{{"==Ca||"}}"==oa?Fa:function(a){return a.replace(/\{\{/g,Ca).replace(/}}/g,oa)},W=/^ngAttr[A-Z]/;return z}]}function ma(b){return Va(b.replace(ue,""))}function vc(b,a){var c="",d=b.split(/\s+/),e=a.split(/\s+/),g=0;a:for(;g<d.length;g++){for(var f=d[g],k=0;k<e.length;k++)if(f==e[k])continue a;c+=(0<c.length?" ":"")+f}return c}function Od(){var b=
{},a=/^(\S+)(\s+as\s+(\w+))?$/;this.register=function(a,d){Aa(a,"controller");U(a)?J(b,a):b[a]=d};this.$get=["$injector","$window",function(c,d){return function(e,g){var f,k,m;C(e)&&(f=e.match(a),k=f[1],m=f[3],e=b.hasOwnProperty(k)?b[k]:fc(g.$scope,k,!0)||fc(d,k,!0),Ta(e,k,!0));f=c.instantiate(e,g);if(m){if(!g||"object"!=typeof g.$scope)throw t("$controller")("noscp",k||e.name,m);g.$scope[m]=f}return f}}]}function Pd(){this.$get=["$window",function(b){return w(b.document)}]}function Qd(){this.$get=
["$log",function(b){return function(a,c){b.error.apply(b,arguments)}}]}function wc(b){var a={},c,d,e;if(!b)return a;q(b.split("\n"),function(b){e=b.indexOf(":");c=L(aa(b.substr(0,e)));d=aa(b.substr(e+1));c&&(a[c]=a[c]?a[c]+(", "+d):d)});return a}function xc(b){var a=U(b)?b:s;return function(c){a||(a=wc(b));return c?a[L(c)]||null:a}}function yc(b,a,c){if(Q(c))return c(b,a);q(c,function(c){b=c(b,a)});return b}function Td(){var b=/^\s*(\[|\{[^\{])/,a=/[\}\]]\s*$/,c=/^\)\]\}',?\n/,d={"Content-Type":"application/json;charset=utf-8"},
e=this.defaults={transformResponse:[function(d){C(d)&&(d=d.replace(c,""),b.test(d)&&a.test(d)&&(d=ac(d)));return d}],transformRequest:[function(a){return U(a)&&"[object File]"!==wa.call(a)&&"[object Blob]"!==wa.call(a)?ra(a):a}],headers:{common:{Accept:"application/json, text/plain, */*"},post:ka(d),put:ka(d),patch:ka(d)},xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN"},g=this.interceptors=[],f=this.responseInterceptors=[];this.$get=["$httpBackend","$browser","$cacheFactory","$rootScope",
"$q","$injector",function(a,b,c,d,n,p){function r(a){function b(a){var d=J({},a,{data:yc(a.data,a.headers,c.transformResponse)});return 200<=a.status&&300>a.status?d:n.reject(d)}var c={method:"get",transformRequest:e.transformRequest,transformResponse:e.transformResponse},d=function(a){function b(a){var c;q(a,function(b,d){Q(b)&&(c=b(),null!=c?a[d]=c:delete a[d])})}var c=e.headers,d=J({},a.headers),g,f,c=J({},c.common,c[L(a.method)]);b(c);b(d);a:for(g in c){a=L(g);for(f in d)if(L(f)===a)continue a;
d[g]=c[g]}return d}(a);J(c,a);c.headers=d;c.method=Ha(c.method);var g=[function(a){d=a.headers;var c=yc(a.data,xc(d),a.transformRequest);D(a.data)&&q(d,function(a,b){"content-type"===L(b)&&delete d[b]});D(a.withCredentials)&&!D(e.withCredentials)&&(a.withCredentials=e.withCredentials);return v(a,c,d).then(b,b)},s],f=n.when(c);for(q(u,function(a){(a.request||a.requestError)&&g.unshift(a.request,a.requestError);(a.response||a.responseError)&&g.push(a.response,a.responseError)});g.length;){a=g.shift();
var m=g.shift(),f=f.then(a,m)}f.success=function(a){f.then(function(b){a(b.data,b.status,b.headers,c)});return f};f.error=function(a){f.then(null,function(b){a(b.data,b.status,b.headers,c)});return f};return f}function v(c,g,f){function h(a,b,c,e){A&&(200<=a&&300>a?A.put(w,[a,b,wc(c),e]):A.remove(w));p(b,a,c,e);d.$$phase||d.$apply()}function p(a,b,d,e){b=Math.max(b,0);(200<=b&&300>b?u.resolve:u.reject)({data:a,status:b,headers:xc(d),config:c,statusText:e})}function v(){var a=Oa(r.pendingRequests,
c);-1!==a&&r.pendingRequests.splice(a,1)}var u=n.defer(),q=u.promise,A,H,w=I(c.url,c.params);r.pendingRequests.push(c);q.then(v,v);(c.cache||e.cache)&&(!1!==c.cache&&"GET"==c.method)&&(A=U(c.cache)?c.cache:U(e.cache)?e.cache:x);if(A)if(H=A.get(w),B(H)){if(H.then)return H.then(v,v),H;O(H)?p(H[1],H[0],ka(H[2]),H[3]):p(H,200,{},"OK")}else A.put(w,q);D(H)&&((H=Mb(c.url)?b.cookies()[c.xsrfCookieName||e.xsrfCookieName]:s)&&(f[c.xsrfHeaderName||e.xsrfHeaderName]=H),a(c.method,w,g,h,f,c.timeout,c.withCredentials,
c.responseType));return q}function I(a,b){if(!b)return a;var c=[];Sc(b,function(a,b){null===a||D(a)||(O(a)||(a=[a]),q(a,function(a){U(a)&&(a=ra(a));c.push(za(b)+"="+za(a))}))});0<c.length&&(a+=(-1==a.indexOf("?")?"?":"&")+c.join("&"));return a}var x=c("$http"),u=[];q(g,function(a){u.unshift(C(a)?p.get(a):p.invoke(a))});q(f,function(a,b){var c=C(a)?p.get(a):p.invoke(a);u.splice(b,0,{response:function(a){return c(n.when(a))},responseError:function(a){return c(n.reject(a))}})});r.pendingRequests=[];
(function(a){q(arguments,function(a){r[a]=function(b,c){return r(J(c||{},{method:a,url:b}))}})})("get","delete","head","jsonp");(function(a){q(arguments,function(a){r[a]=function(b,c,d){return r(J(d||{},{method:a,url:b,data:c}))}})})("post","put");r.defaults=e;return r}]}function ve(b){if(8>=S&&(!b.match(/^(get|post|head|put|delete|options)$/i)||!T.XMLHttpRequest))return new T.ActiveXObject("Microsoft.XMLHTTP");if(T.XMLHttpRequest)return new T.XMLHttpRequest;throw t("$httpBackend")("noxhr");}function Ud(){this.$get=
["$browser","$window","$document",function(b,a,c){return we(b,ve,b.defer,a.angular.callbacks,c[0])}]}function we(b,a,c,d,e){function g(a,b,c){var g=e.createElement("script"),f=null;g.type="text/javascript";g.src=a;g.async=!0;f=function(a){Wa(g,"load",f);Wa(g,"error",f);e.body.removeChild(g);g=null;var k=-1,v="unknown";a&&("load"!==a.type||d[b].called||(a={type:"error"}),v=a.type,k="error"===a.type?404:200);c&&c(k,v)};pb(g,"load",f);pb(g,"error",f);8>=S&&(g.onreadystatechange=function(){C(g.readyState)&&
/loaded|complete/.test(g.readyState)&&(g.onreadystatechange=null,f({type:"load"}))});e.body.appendChild(g);return f}var f=-1;return function(e,m,h,l,n,p,r,v){function I(){u=f;F&&F();z&&z.abort()}function x(a,d,e,g,f){P&&c.cancel(P);F=z=null;0===d&&(d=e?200:"file"==sa(m).protocol?404:0);a(1223===d?204:d,e,g,f||"");b.$$completeOutstandingRequest(y)}var u;b.$$incOutstandingRequestCount();m=m||b.url();if("jsonp"==L(e)){var M="_"+(d.counter++).toString(36);d[M]=function(a){d[M].data=a;d[M].called=!0};
var F=g(m.replace("JSON_CALLBACK","angular.callbacks."+M),M,function(a,b){x(l,a,d[M].data,"",b);d[M]=y})}else{var z=a(e);z.open(e,m,!0);q(n,function(a,b){B(a)&&z.setRequestHeader(b,a)});z.onreadystatechange=function(){if(z&&4==z.readyState){var a=null,b=null;u!==f&&(a=z.getAllResponseHeaders(),b="response"in z?z.response:z.responseText);x(l,u||z.status,b,a,z.statusText||"")}};r&&(z.withCredentials=!0);if(v)try{z.responseType=v}catch(s){if("json"!==v)throw s;}z.send(h||null)}if(0<p)var P=c(I,p);else p&&
p.then&&p.then(I)}}function Rd(){var b="{{",a="}}";this.startSymbol=function(a){return a?(b=a,this):b};this.endSymbol=function(b){return b?(a=b,this):a};this.$get=["$parse","$exceptionHandler","$sce",function(c,d,e){function g(g,h,l){for(var n,p,r=0,v=[],I=g.length,x=!1,u=[];r<I;)-1!=(n=g.indexOf(b,r))&&-1!=(p=g.indexOf(a,n+f))?(r!=n&&v.push(g.substring(r,n)),v.push(r=c(x=g.substring(n+f,p))),r.exp=x,r=p+k,x=!0):(r!=I&&v.push(g.substring(r)),r=I);(I=v.length)||(v.push(""),I=1);if(l&&1<v.length)throw zc("noconcat",
g);if(!h||x)return u.length=I,r=function(a){try{for(var b=0,c=I,f;b<c;b++){if("function"==typeof(f=v[b]))if(f=f(a),f=l?e.getTrusted(l,f):e.valueOf(f),null==f)f="";else switch(typeof f){case "string":break;case "number":f=""+f;break;default:f=ra(f)}u[b]=f}return u.join("")}catch(k){a=zc("interr",g,k.toString()),d(a)}},r.exp=g,r.parts=v,r}var f=b.length,k=a.length;g.startSymbol=function(){return b};g.endSymbol=function(){return a};return g}]}function Sd(){this.$get=["$rootScope","$window","$q",function(b,
a,c){function d(d,f,k,m){var h=a.setInterval,l=a.clearInterval,n=c.defer(),p=n.promise,r=0,v=B(m)&&!m;k=B(k)?k:0;p.then(null,null,d);p.$$intervalId=h(function(){n.notify(r++);0<k&&r>=k&&(n.resolve(r),l(p.$$intervalId),delete e[p.$$intervalId]);v||b.$apply()},f);e[p.$$intervalId]=n;return p}var e={};d.cancel=function(a){return a&&a.$$intervalId in e?(e[a.$$intervalId].reject("canceled"),clearInterval(a.$$intervalId),delete e[a.$$intervalId],!0):!1};return d}]}function ad(){this.$get=function(){return{id:"en-us",
NUMBER_FORMATS:{DECIMAL_SEP:".",GROUP_SEP:",",PATTERNS:[{minInt:1,minFrac:0,maxFrac:3,posPre:"",posSuf:"",negPre:"-",negSuf:"",gSize:3,lgSize:3},{minInt:1,minFrac:2,maxFrac:2,posPre:"\u00a4",posSuf:"",negPre:"(\u00a4",negSuf:")",gSize:3,lgSize:3}],CURRENCY_SYM:"$"},DATETIME_FORMATS:{MONTH:"January February March April May June July August September October November December".split(" "),SHORTMONTH:"Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec".split(" "),DAY:"Sunday Monday Tuesday Wednesday Thursday Friday Saturday".split(" "),
SHORTDAY:"Sun Mon Tue Wed Thu Fri Sat".split(" "),AMPMS:["AM","PM"],medium:"MMM d, y h:mm:ss a","short":"M/d/yy h:mm a",fullDate:"EEEE, MMMM d, y",longDate:"MMMM d, y",mediumDate:"MMM d, y",shortDate:"M/d/yy",mediumTime:"h:mm:ss a",shortTime:"h:mm a"},pluralCat:function(b){return 1===b?"one":"other"}}}}function Nb(b){b=b.split("/");for(var a=b.length;a--;)b[a]=gb(b[a]);return b.join("/")}function Ac(b,a,c){b=sa(b,c);a.$$protocol=b.protocol;a.$$host=b.hostname;a.$$port=Z(b.port)||xe[b.protocol]||null}
function Bc(b,a,c){var d="/"!==b.charAt(0);d&&(b="/"+b);b=sa(b,c);a.$$path=decodeURIComponent(d&&"/"===b.pathname.charAt(0)?b.pathname.substring(1):b.pathname);a.$$search=cc(b.search);a.$$hash=decodeURIComponent(b.hash);a.$$path&&"/"!=a.$$path.charAt(0)&&(a.$$path="/"+a.$$path)}function pa(b,a){if(0===a.indexOf(b))return a.substr(b.length)}function $a(b){var a=b.indexOf("#");return-1==a?b:b.substr(0,a)}function Ob(b){return b.substr(0,$a(b).lastIndexOf("/")+1)}function Cc(b,a){this.$$html5=!0;a=a||
"";var c=Ob(b);Ac(b,this,b);this.$$parse=function(a){var e=pa(c,a);if(!C(e))throw Pb("ipthprfx",a,c);Bc(e,this,b);this.$$path||(this.$$path="/");this.$$compose()};this.$$compose=function(){var a=Bb(this.$$search),b=this.$$hash?"#"+gb(this.$$hash):"";this.$$url=Nb(this.$$path)+(a?"?"+a:"")+b;this.$$absUrl=c+this.$$url.substr(1)};this.$$rewrite=function(d){var e;if((e=pa(b,d))!==s)return d=e,(e=pa(a,e))!==s?c+(pa("/",e)||e):b+d;if((e=pa(c,d))!==s)return c+e;if(c==d+"/")return c}}function Qb(b,a){var c=
Ob(b);Ac(b,this,b);this.$$parse=function(d){var e=pa(b,d)||pa(c,d),e="#"==e.charAt(0)?pa(a,e):this.$$html5?e:"";if(!C(e))throw Pb("ihshprfx",d,a);Bc(e,this,b);d=this.$$path;var g=/^\/[A-Z]:(\/.*)/;0===e.indexOf(b)&&(e=e.replace(b,""));g.exec(e)||(d=(e=g.exec(d))?e[1]:d);this.$$path=d;this.$$compose()};this.$$compose=function(){var c=Bb(this.$$search),e=this.$$hash?"#"+gb(this.$$hash):"";this.$$url=Nb(this.$$path)+(c?"?"+c:"")+e;this.$$absUrl=b+(this.$$url?a+this.$$url:"")};this.$$rewrite=function(a){if($a(b)==
$a(a))return a}}function Rb(b,a){this.$$html5=!0;Qb.apply(this,arguments);var c=Ob(b);this.$$rewrite=function(d){var e;if(b==$a(d))return d;if(e=pa(c,d))return b+a+e;if(c===d+"/")return c};this.$$compose=function(){var c=Bb(this.$$search),e=this.$$hash?"#"+gb(this.$$hash):"";this.$$url=Nb(this.$$path)+(c?"?"+c:"")+e;this.$$absUrl=b+a+this.$$url}}function qb(b){return function(){return this[b]}}function Dc(b,a){return function(c){if(D(c))return this[b];this[b]=a(c);this.$$compose();return this}}function Vd(){var b=
"",a=!1;this.hashPrefix=function(a){return B(a)?(b=a,this):b};this.html5Mode=function(b){return B(b)?(a=b,this):a};this.$get=["$rootScope","$browser","$sniffer","$rootElement",function(c,d,e,g){function f(a){c.$broadcast("$locationChangeSuccess",k.absUrl(),a)}var k,m,h=d.baseHref(),l=d.url(),n;a?(n=l.substring(0,l.indexOf("/",l.indexOf("//")+2))+(h||"/"),m=e.history?Cc:Rb):(n=$a(l),m=Qb);k=new m(n,"#"+b);k.$$parse(k.$$rewrite(l));g.on("click",function(a){if(!a.ctrlKey&&!a.metaKey&&2!=a.which){for(var e=
w(a.target);"a"!==L(e[0].nodeName);)if(e[0]===g[0]||!(e=e.parent())[0])return;var f=e.prop("href");U(f)&&"[object SVGAnimatedString]"===f.toString()&&(f=sa(f.animVal).href);if(m===Rb){var h=e.attr("href")||e.attr("xlink:href");if(0>h.indexOf("://"))if(f="#"+b,"/"==h[0])f=n+f+h;else if("#"==h[0])f=n+f+(k.path()||"/")+h;else{for(var l=k.path().split("/"),h=h.split("/"),p=0;p<h.length;p++)"."!=h[p]&&(".."==h[p]?l.pop():h[p].length&&l.push(h[p]));f=n+f+l.join("/")}}l=k.$$rewrite(f);f&&(!e.attr("target")&&
l&&!a.isDefaultPrevented())&&(a.preventDefault(),l!=d.url()&&(k.$$parse(l),c.$apply(),T.angular["ff-684208-preventDefault"]=!0))}});k.absUrl()!=l&&d.url(k.absUrl(),!0);d.onUrlChange(function(a){k.absUrl()!=a&&(c.$evalAsync(function(){var b=k.absUrl();k.$$parse(a);c.$broadcast("$locationChangeStart",a,b).defaultPrevented?(k.$$parse(b),d.url(b)):f(b)}),c.$$phase||c.$digest())});var p=0;c.$watch(function(){var a=d.url(),b=k.$$replace;p&&a==k.absUrl()||(p++,c.$evalAsync(function(){c.$broadcast("$locationChangeStart",
k.absUrl(),a).defaultPrevented?k.$$parse(a):(d.url(k.absUrl(),b),f(a))}));k.$$replace=!1;return p});return k}]}function Wd(){var b=!0,a=this;this.debugEnabled=function(a){return B(a)?(b=a,this):b};this.$get=["$window",function(c){function d(a){a instanceof Error&&(a.stack?a=a.message&&-1===a.stack.indexOf(a.message)?"Error: "+a.message+"\n"+a.stack:a.stack:a.sourceURL&&(a=a.message+"\n"+a.sourceURL+":"+a.line));return a}function e(a){var b=c.console||{},e=b[a]||b.log||y;a=!1;try{a=!!e.apply}catch(m){}return a?
function(){var a=[];q(arguments,function(b){a.push(d(b))});return e.apply(b,a)}:function(a,b){e(a,null==b?"":b)}}return{log:e("log"),info:e("info"),warn:e("warn"),error:e("error"),debug:function(){var c=e("debug");return function(){b&&c.apply(a,arguments)}}()}}]}function ea(b,a){if("constructor"===b)throw Da("isecfld",a);return b}function ab(b,a){if(b){if(b.constructor===b)throw Da("isecfn",a);if(b.document&&b.location&&b.alert&&b.setInterval)throw Da("isecwindow",a);if(b.children&&(b.nodeName||b.prop&&
b.attr&&b.find))throw Da("isecdom",a);}return b}function rb(b,a,c,d,e){e=e||{};a=a.split(".");for(var g,f=0;1<a.length;f++){g=ea(a.shift(),d);var k=b[g];k||(k={},b[g]=k);b=k;b.then&&e.unwrapPromises&&(ta(d),"$$v"in b||function(a){a.then(function(b){a.$$v=b})}(b),b.$$v===s&&(b.$$v={}),b=b.$$v)}g=ea(a.shift(),d);return b[g]=c}function Ec(b,a,c,d,e,g,f){ea(b,g);ea(a,g);ea(c,g);ea(d,g);ea(e,g);return f.unwrapPromises?function(f,m){var h=m&&m.hasOwnProperty(b)?m:f,l;if(null==h)return h;(h=h[b])&&h.then&&
(ta(g),"$$v"in h||(l=h,l.$$v=s,l.then(function(a){l.$$v=a})),h=h.$$v);if(!a)return h;if(null==h)return s;(h=h[a])&&h.then&&(ta(g),"$$v"in h||(l=h,l.$$v=s,l.then(function(a){l.$$v=a})),h=h.$$v);if(!c)return h;if(null==h)return s;(h=h[c])&&h.then&&(ta(g),"$$v"in h||(l=h,l.$$v=s,l.then(function(a){l.$$v=a})),h=h.$$v);if(!d)return h;if(null==h)return s;(h=h[d])&&h.then&&(ta(g),"$$v"in h||(l=h,l.$$v=s,l.then(function(a){l.$$v=a})),h=h.$$v);if(!e)return h;if(null==h)return s;(h=h[e])&&h.then&&(ta(g),"$$v"in
h||(l=h,l.$$v=s,l.then(function(a){l.$$v=a})),h=h.$$v);return h}:function(g,f){var h=f&&f.hasOwnProperty(b)?f:g;if(null==h)return h;h=h[b];if(!a)return h;if(null==h)return s;h=h[a];if(!c)return h;if(null==h)return s;h=h[c];if(!d)return h;if(null==h)return s;h=h[d];return e?null==h?s:h=h[e]:h}}function ye(b,a){ea(b,a);return function(a,d){return null==a?s:(d&&d.hasOwnProperty(b)?d:a)[b]}}function ze(b,a,c){ea(b,c);ea(a,c);return function(c,e){if(null==c)return s;c=(e&&e.hasOwnProperty(b)?e:c)[b];return null==
c?s:c[a]}}function Fc(b,a,c){if(Sb.hasOwnProperty(b))return Sb[b];var d=b.split("."),e=d.length,g;if(a.unwrapPromises||1!==e)if(a.unwrapPromises||2!==e)if(a.csp)g=6>e?Ec(d[0],d[1],d[2],d[3],d[4],c,a):function(b,g){var f=0,k;do k=Ec(d[f++],d[f++],d[f++],d[f++],d[f++],c,a)(b,g),g=s,b=k;while(f<e);return k};else{var f="var p;\n";q(d,function(b,d){ea(b,c);f+="if(s == null) return undefined;\ns="+(d?"s":'((k&&k.hasOwnProperty("'+b+'"))?k:s)')+'["'+b+'"];\n'+(a.unwrapPromises?'if (s && s.then) {\n pw("'+
c.replace(/(["\r\n])/g,"\\$1")+'");\n if (!("$$v" in s)) {\n p=s;\n p.$$v = undefined;\n p.then(function(v) {p.$$v=v;});\n}\n s=s.$$v\n}\n':"")});var f=f+"return s;",k=new Function("s","k","pw",f);k.toString=$(f);g=a.unwrapPromises?function(a,b){return k(a,b,ta)}:k}else g=ze(d[0],d[1],c);else g=ye(d[0],c);"hasOwnProperty"!==b&&(Sb[b]=g);return g}function Xd(){var b={},a={csp:!1,unwrapPromises:!1,logPromiseWarnings:!0};this.unwrapPromises=function(b){return B(b)?(a.unwrapPromises=!!b,this):a.unwrapPromises};
this.logPromiseWarnings=function(b){return B(b)?(a.logPromiseWarnings=b,this):a.logPromiseWarnings};this.$get=["$filter","$sniffer","$log",function(c,d,e){a.csp=d.csp;ta=function(b){a.logPromiseWarnings&&!Gc.hasOwnProperty(b)&&(Gc[b]=!0,e.warn("[$parse] Promise found in the expression `"+b+"`. Automatic unwrapping of promises in Angular expressions is deprecated."))};return function(d){var e;switch(typeof d){case "string":if(b.hasOwnProperty(d))return b[d];e=new Tb(a);e=(new bb(e,c,a)).parse(d);"hasOwnProperty"!==
d&&(b[d]=e);return e;case "function":return d;default:return y}}}]}function Zd(){this.$get=["$rootScope","$exceptionHandler",function(b,a){return Ae(function(a){b.$evalAsync(a)},a)}]}function Ae(b,a){function c(a){return a}function d(a){return f(a)}var e=function(){var f=[],h,l;return l={resolve:function(a){if(f){var c=f;f=s;h=g(a);c.length&&b(function(){for(var a,b=0,d=c.length;b<d;b++)a=c[b],h.then(a[0],a[1],a[2])})}},reject:function(a){l.resolve(k(a))},notify:function(a){if(f){var c=f;f.length&&
b(function(){for(var b,d=0,e=c.length;d<e;d++)b=c[d],b[2](a)})}},promise:{then:function(b,g,k){var l=e(),I=function(d){try{l.resolve((Q(b)?b:c)(d))}catch(e){l.reject(e),a(e)}},x=function(b){try{l.resolve((Q(g)?g:d)(b))}catch(c){l.reject(c),a(c)}},u=function(b){try{l.notify((Q(k)?k:c)(b))}catch(d){a(d)}};f?f.push([I,x,u]):h.then(I,x,u);return l.promise},"catch":function(a){return this.then(null,a)},"finally":function(a){function b(a,c){var d=e();c?d.resolve(a):d.reject(a);return d.promise}function d(e,
g){var f=null;try{f=(a||c)()}catch(k){return b(k,!1)}return f&&Q(f.then)?f.then(function(){return b(e,g)},function(a){return b(a,!1)}):b(e,g)}return this.then(function(a){return d(a,!0)},function(a){return d(a,!1)})}}}},g=function(a){return a&&Q(a.then)?a:{then:function(c){var d=e();b(function(){d.resolve(c(a))});return d.promise}}},f=function(a){var b=e();b.reject(a);return b.promise},k=function(c){return{then:function(g,f){var k=e();b(function(){try{k.resolve((Q(f)?f:d)(c))}catch(b){k.reject(b),
a(b)}});return k.promise}}};return{defer:e,reject:f,when:function(k,h,l,n){var p=e(),r,v=function(b){try{return(Q(h)?h:c)(b)}catch(d){return a(d),f(d)}},I=function(b){try{return(Q(l)?l:d)(b)}catch(c){return a(c),f(c)}},x=function(b){try{return(Q(n)?n:c)(b)}catch(d){a(d)}};b(function(){g(k).then(function(a){r||(r=!0,p.resolve(g(a).then(v,I,x)))},function(a){r||(r=!0,p.resolve(I(a)))},function(a){r||p.notify(x(a))})});return p.promise},all:function(a){var b=e(),c=0,d=O(a)?[]:{};q(a,function(a,e){c++;
g(a).then(function(a){d.hasOwnProperty(e)||(d[e]=a,--c||b.resolve(d))},function(a){d.hasOwnProperty(e)||b.reject(a)})});0===c&&b.resolve(d);return b.promise}}}function fe(){this.$get=["$window","$timeout",function(b,a){var c=b.requestAnimationFrame||b.webkitRequestAnimationFrame||b.mozRequestAnimationFrame,d=b.cancelAnimationFrame||b.webkitCancelAnimationFrame||b.mozCancelAnimationFrame||b.webkitCancelRequestAnimationFrame,e=!!c,g=e?function(a){var b=c(a);return function(){d(b)}}:function(b){var c=
a(b,16.66,!1);return function(){a.cancel(c)}};g.supported=e;return g}]}function Yd(){var b=10,a=t("$rootScope"),c=null;this.digestTtl=function(a){arguments.length&&(b=a);return b};this.$get=["$injector","$exceptionHandler","$parse","$browser",function(d,e,g,f){function k(){this.$id=eb();this.$$phase=this.$parent=this.$$watchers=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=null;this["this"]=this.$root=this;this.$$destroyed=!1;this.$$asyncQueue=[];this.$$postDigestQueue=[];
this.$$listeners={};this.$$listenerCount={};this.$$isolateBindings={}}function m(b){if(p.$$phase)throw a("inprog",p.$$phase);p.$$phase=b}function h(a,b){var c=g(a);Ta(c,b);return c}function l(a,b,c){do a.$$listenerCount[c]-=b,0===a.$$listenerCount[c]&&delete a.$$listenerCount[c];while(a=a.$parent)}function n(){}k.prototype={constructor:k,$new:function(a){a?(a=new k,a.$root=this.$root,a.$$asyncQueue=this.$$asyncQueue,a.$$postDigestQueue=this.$$postDigestQueue):(this.$$childScopeClass||(this.$$childScopeClass=
function(){this.$$watchers=this.$$nextSibling=this.$$childHead=this.$$childTail=null;this.$$listeners={};this.$$listenerCount={};this.$id=eb();this.$$childScopeClass=null},this.$$childScopeClass.prototype=this),a=new this.$$childScopeClass);a["this"]=a;a.$parent=this;a.$$prevSibling=this.$$childTail;this.$$childHead?this.$$childTail=this.$$childTail.$$nextSibling=a:this.$$childHead=this.$$childTail=a;return a},$watch:function(a,b,d){var e=h(a,"watch"),g=this.$$watchers,f={fn:b,last:n,get:e,exp:a,
eq:!!d};c=null;if(!Q(b)){var k=h(b||y,"listener");f.fn=function(a,b,c){k(c)}}if("string"==typeof a&&e.constant){var m=f.fn;f.fn=function(a,b,c){m.call(this,a,b,c);Pa(g,f)}}g||(g=this.$$watchers=[]);g.unshift(f);return function(){Pa(g,f);c=null}},$watchCollection:function(a,b){var c=this,d,e,f,k=1<b.length,h=0,m=g(a),l=[],n={},p=!0,q=0;return this.$watch(function(){d=m(c);var a,b;if(U(d))if(db(d))for(e!==l&&(e=l,q=e.length=0,h++),a=d.length,q!==a&&(h++,e.length=q=a),b=0;b<a;b++)e[b]!==e[b]&&d[b]!==
d[b]||e[b]===d[b]||(h++,e[b]=d[b]);else{e!==n&&(e=n={},q=0,h++);a=0;for(b in d)d.hasOwnProperty(b)&&(a++,e.hasOwnProperty(b)?e[b]!==d[b]&&(h++,e[b]=d[b]):(q++,e[b]=d[b],h++));if(q>a)for(b in h++,e)e.hasOwnProperty(b)&&!d.hasOwnProperty(b)&&(q--,delete e[b])}else e!==d&&(e=d,h++);return h},function(){p?(p=!1,b(d,d,c)):b(d,f,c);if(k)if(U(d))if(db(d)){f=Array(d.length);for(var a=0;a<d.length;a++)f[a]=d[a]}else for(a in f={},d)zb.call(d,a)&&(f[a]=d[a]);else f=d})},$digest:function(){var d,g,f,k,h=this.$$asyncQueue,
l=this.$$postDigestQueue,q,z,s=b,P,N=[],w,E,A;m("$digest");c=null;do{z=!1;for(P=this;h.length;){try{A=h.shift(),A.scope.$eval(A.expression)}catch(H){p.$$phase=null,e(H)}c=null}a:do{if(k=P.$$watchers)for(q=k.length;q--;)try{if(d=k[q])if((g=d.get(P))!==(f=d.last)&&!(d.eq?xa(g,f):"number"==typeof g&&"number"==typeof f&&isNaN(g)&&isNaN(f)))z=!0,c=d,d.last=d.eq?Ga(g,null):g,d.fn(g,f===n?g:f,P),5>s&&(w=4-s,N[w]||(N[w]=[]),E=Q(d.exp)?"fn: "+(d.exp.name||d.exp.toString()):d.exp,E+="; newVal: "+ra(g)+"; oldVal: "+
ra(f),N[w].push(E));else if(d===c){z=!1;break a}}catch(B){p.$$phase=null,e(B)}if(!(k=P.$$childHead||P!==this&&P.$$nextSibling))for(;P!==this&&!(k=P.$$nextSibling);)P=P.$parent}while(P=k);if((z||h.length)&&!s--)throw p.$$phase=null,a("infdig",b,ra(N));}while(z||h.length);for(p.$$phase=null;l.length;)try{l.shift()()}catch(t){e(t)}},$destroy:function(){if(!this.$$destroyed){var a=this.$parent;this.$broadcast("$destroy");this.$$destroyed=!0;this!==p&&(q(this.$$listenerCount,Ab(null,l,this)),a.$$childHead==
this&&(a.$$childHead=this.$$nextSibling),a.$$childTail==this&&(a.$$childTail=this.$$prevSibling),this.$$prevSibling&&(this.$$prevSibling.$$nextSibling=this.$$nextSibling),this.$$nextSibling&&(this.$$nextSibling.$$prevSibling=this.$$prevSibling),this.$parent=this.$$nextSibling=this.$$prevSibling=this.$$childHead=this.$$childTail=this.$root=null,this.$$listeners={},this.$$watchers=this.$$asyncQueue=this.$$postDigestQueue=[],this.$destroy=this.$digest=this.$apply=y,this.$on=this.$watch=function(){return y})}},
$eval:function(a,b){return g(a)(this,b)},$evalAsync:function(a){p.$$phase||p.$$asyncQueue.length||f.defer(function(){p.$$asyncQueue.length&&p.$digest()});this.$$asyncQueue.push({scope:this,expression:a})},$$postDigest:function(a){this.$$postDigestQueue.push(a)},$apply:function(a){try{return m("$apply"),this.$eval(a)}catch(b){e(b)}finally{p.$$phase=null;try{p.$digest()}catch(c){throw e(c),c;}}},$on:function(a,b){var c=this.$$listeners[a];c||(this.$$listeners[a]=c=[]);c.push(b);var d=this;do d.$$listenerCount[a]||
(d.$$listenerCount[a]=0),d.$$listenerCount[a]++;while(d=d.$parent);var e=this;return function(){c[Oa(c,b)]=null;l(e,1,a)}},$emit:function(a,b){var c=[],d,g=this,f=!1,k={name:a,targetScope:g,stopPropagation:function(){f=!0},preventDefault:function(){k.defaultPrevented=!0},defaultPrevented:!1},h=[k].concat(ya.call(arguments,1)),m,l;do{d=g.$$listeners[a]||c;k.currentScope=g;m=0;for(l=d.length;m<l;m++)if(d[m])try{d[m].apply(null,h)}catch(n){e(n)}else d.splice(m,1),m--,l--;if(f)break;g=g.$parent}while(g);
return k},$broadcast:function(a,b){for(var c=this,d=this,g={name:a,targetScope:this,preventDefault:function(){g.defaultPrevented=!0},defaultPrevented:!1},f=[g].concat(ya.call(arguments,1)),k,h;c=d;){g.currentScope=c;d=c.$$listeners[a]||[];k=0;for(h=d.length;k<h;k++)if(d[k])try{d[k].apply(null,f)}catch(m){e(m)}else d.splice(k,1),k--,h--;if(!(d=c.$$listenerCount[a]&&c.$$childHead||c!==this&&c.$$nextSibling))for(;c!==this&&!(d=c.$$nextSibling);)c=c.$parent}return g}};var p=new k;return p}]}function bd(){var b=
/^\s*(https?|ftp|mailto|tel|file):/,a=/^\s*(https?|ftp|file):|data:image\//;this.aHrefSanitizationWhitelist=function(a){return B(a)?(b=a,this):b};this.imgSrcSanitizationWhitelist=function(b){return B(b)?(a=b,this):a};this.$get=function(){return function(c,d){var e=d?a:b,g;if(!S||8<=S)if(g=sa(c).href,""!==g&&!g.match(e))return"unsafe:"+g;return c}}}function Be(b){if("self"===b)return b;if(C(b)){if(-1<b.indexOf("***"))throw ua("iwcard",b);b=b.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,
"\\x08").replace("\\*\\*",".*").replace("\\*","[^:/.?&;]*");return RegExp("^"+b+"$")}if(fb(b))return RegExp("^"+b.source+"$");throw ua("imatcher");}function Hc(b){var a=[];B(b)&&q(b,function(b){a.push(Be(b))});return a}function ae(){this.SCE_CONTEXTS=fa;var b=["self"],a=[];this.resourceUrlWhitelist=function(a){arguments.length&&(b=Hc(a));return b};this.resourceUrlBlacklist=function(b){arguments.length&&(a=Hc(b));return a};this.$get=["$injector",function(c){function d(a){var b=function(a){this.$$unwrapTrustedValue=
function(){return a}};a&&(b.prototype=new a);b.prototype.valueOf=function(){return this.$$unwrapTrustedValue()};b.prototype.toString=function(){return this.$$unwrapTrustedValue().toString()};return b}var e=function(a){throw ua("unsafe");};c.has("$sanitize")&&(e=c.get("$sanitize"));var g=d(),f={};f[fa.HTML]=d(g);f[fa.CSS]=d(g);f[fa.URL]=d(g);f[fa.JS]=d(g);f[fa.RESOURCE_URL]=d(f[fa.URL]);return{trustAs:function(a,b){var c=f.hasOwnProperty(a)?f[a]:null;if(!c)throw ua("icontext",a,b);if(null===b||b===
s||""===b)return b;if("string"!==typeof b)throw ua("itype",a);return new c(b)},getTrusted:function(c,d){if(null===d||d===s||""===d)return d;var g=f.hasOwnProperty(c)?f[c]:null;if(g&&d instanceof g)return d.$$unwrapTrustedValue();if(c===fa.RESOURCE_URL){var g=sa(d.toString()),l,n,p=!1;l=0;for(n=b.length;l<n;l++)if("self"===b[l]?Mb(g):b[l].exec(g.href)){p=!0;break}if(p)for(l=0,n=a.length;l<n;l++)if("self"===a[l]?Mb(g):a[l].exec(g.href)){p=!1;break}if(p)return d;throw ua("insecurl",d.toString());}if(c===
fa.HTML)return e(d);throw ua("unsafe");},valueOf:function(a){return a instanceof g?a.$$unwrapTrustedValue():a}}}]}function $d(){var b=!0;this.enabled=function(a){arguments.length&&(b=!!a);return b};this.$get=["$parse","$sniffer","$sceDelegate",function(a,c,d){if(b&&c.msie&&8>c.msieDocumentMode)throw ua("iequirks");var e=ka(fa);e.isEnabled=function(){return b};e.trustAs=d.trustAs;e.getTrusted=d.getTrusted;e.valueOf=d.valueOf;b||(e.trustAs=e.getTrusted=function(a,b){return b},e.valueOf=Fa);e.parseAs=
function(b,c){var d=a(c);return d.literal&&d.constant?d:function(a,c){return e.getTrusted(b,d(a,c))}};var g=e.parseAs,f=e.getTrusted,k=e.trustAs;q(fa,function(a,b){var c=L(b);e[Va("parse_as_"+c)]=function(b){return g(a,b)};e[Va("get_trusted_"+c)]=function(b){return f(a,b)};e[Va("trust_as_"+c)]=function(b){return k(a,b)}});return e}]}function be(){this.$get=["$window","$document",function(b,a){var c={},d=Z((/android (\d+)/.exec(L((b.navigator||{}).userAgent))||[])[1]),e=/Boxee/i.test((b.navigator||
{}).userAgent),g=a[0]||{},f=g.documentMode,k,m=/^(Moz|webkit|O|ms)(?=[A-Z])/,h=g.body&&g.body.style,l=!1,n=!1;if(h){for(var p in h)if(l=m.exec(p)){k=l[0];k=k.substr(0,1).toUpperCase()+k.substr(1);break}k||(k="WebkitOpacity"in h&&"webkit");l=!!("transition"in h||k+"Transition"in h);n=!!("animation"in h||k+"Animation"in h);!d||l&&n||(l=C(g.body.style.webkitTransition),n=C(g.body.style.webkitAnimation))}return{history:!(!b.history||!b.history.pushState||4>d||e),hashchange:"onhashchange"in b&&(!f||7<
f),hasEvent:function(a){if("input"==a&&9==S)return!1;if(D(c[a])){var b=g.createElement("div");c[a]="on"+a in b}return c[a]},csp:$b(),vendorPrefix:k,transitions:l,animations:n,android:d,msie:S,msieDocumentMode:f}}]}function de(){this.$get=["$rootScope","$browser","$q","$exceptionHandler",function(b,a,c,d){function e(e,k,m){var h=c.defer(),l=h.promise,n=B(m)&&!m;k=a.defer(function(){try{h.resolve(e())}catch(a){h.reject(a),d(a)}finally{delete g[l.$$timeoutId]}n||b.$apply()},k);l.$$timeoutId=k;g[k]=h;
return l}var g={};e.cancel=function(b){return b&&b.$$timeoutId in g?(g[b.$$timeoutId].reject("canceled"),delete g[b.$$timeoutId],a.defer.cancel(b.$$timeoutId)):!1};return e}]}function sa(b,a){var c=b;S&&(W.setAttribute("href",c),c=W.href);W.setAttribute("href",c);return{href:W.href,protocol:W.protocol?W.protocol.replace(/:$/,""):"",host:W.host,search:W.search?W.search.replace(/^\?/,""):"",hash:W.hash?W.hash.replace(/^#/,""):"",hostname:W.hostname,port:W.port,pathname:"/"===W.pathname.charAt(0)?W.pathname:
"/"+W.pathname}}function Mb(b){b=C(b)?sa(b):b;return b.protocol===Ic.protocol&&b.host===Ic.host}function ee(){this.$get=$(T)}function kc(b){function a(d,e){if(U(d)){var g={};q(d,function(b,c){g[c]=a(c,b)});return g}return b.factory(d+c,e)}var c="Filter";this.register=a;this.$get=["$injector",function(a){return function(b){return a.get(b+c)}}];a("currency",Jc);a("date",Kc);a("filter",Ce);a("json",De);a("limitTo",Ee);a("lowercase",Fe);a("number",Lc);a("orderBy",Mc);a("uppercase",Ge)}function Ce(){return function(b,
a,c){if(!O(b))return b;var d=typeof c,e=[];e.check=function(a){for(var b=0;b<e.length;b++)if(!e[b](a))return!1;return!0};"function"!==d&&(c="boolean"===d&&c?function(a,b){return Sa.equals(a,b)}:function(a,b){if(a&&b&&"object"===typeof a&&"object"===typeof b){for(var d in a)if("$"!==d.charAt(0)&&zb.call(a,d)&&c(a[d],b[d]))return!0;return!1}b=(""+b).toLowerCase();return-1<(""+a).toLowerCase().indexOf(b)});var g=function(a,b){if("string"==typeof b&&"!"===b.charAt(0))return!g(a,b.substr(1));switch(typeof a){case "boolean":case "number":case "string":return c(a,
b);case "object":switch(typeof b){case "object":return c(a,b);default:for(var d in a)if("$"!==d.charAt(0)&&g(a[d],b))return!0}return!1;case "array":for(d=0;d<a.length;d++)if(g(a[d],b))return!0;return!1;default:return!1}};switch(typeof a){case "boolean":case "number":case "string":a={$:a};case "object":for(var f in a)(function(b){"undefined"!=typeof a[b]&&e.push(function(c){return g("$"==b?c:c&&c[b],a[b])})})(f);break;case "function":e.push(a);break;default:return b}d=[];for(f=0;f<b.length;f++){var k=
b[f];e.check(k)&&d.push(k)}return d}}function Jc(b){var a=b.NUMBER_FORMATS;return function(b,d){D(d)&&(d=a.CURRENCY_SYM);return Nc(b,a.PATTERNS[1],a.GROUP_SEP,a.DECIMAL_SEP,2).replace(/\u00A4/g,d)}}function Lc(b){var a=b.NUMBER_FORMATS;return function(b,d){return Nc(b,a.PATTERNS[0],a.GROUP_SEP,a.DECIMAL_SEP,d)}}function Nc(b,a,c,d,e){if(null==b||!isFinite(b)||U(b))return"";var g=0>b;b=Math.abs(b);var f=b+"",k="",m=[],h=!1;if(-1!==f.indexOf("e")){var l=f.match(/([\d\.]+)e(-?)(\d+)/);l&&"-"==l[2]&&
l[3]>e+1?f="0":(k=f,h=!0)}if(h)0<e&&(-1<b&&1>b)&&(k=b.toFixed(e));else{f=(f.split(Oc)[1]||"").length;D(e)&&(e=Math.min(Math.max(a.minFrac,f),a.maxFrac));f=Math.pow(10,e+1);b=Math.floor(b*f+5)/f;b=(""+b).split(Oc);f=b[0];b=b[1]||"";var l=0,n=a.lgSize,p=a.gSize;if(f.length>=n+p)for(l=f.length-n,h=0;h<l;h++)0===(l-h)%p&&0!==h&&(k+=c),k+=f.charAt(h);for(h=l;h<f.length;h++)0===(f.length-h)%n&&0!==h&&(k+=c),k+=f.charAt(h);for(;b.length<e;)b+="0";e&&"0"!==e&&(k+=d+b.substr(0,e))}m.push(g?a.negPre:a.posPre);
m.push(k);m.push(g?a.negSuf:a.posSuf);return m.join("")}function Ub(b,a,c){var d="";0>b&&(d="-",b=-b);for(b=""+b;b.length<a;)b="0"+b;c&&(b=b.substr(b.length-a));return d+b}function Y(b,a,c,d){c=c||0;return function(e){e=e["get"+b]();if(0<c||e>-c)e+=c;0===e&&-12==c&&(e=12);return Ub(e,a,d)}}function sb(b,a){return function(c,d){var e=c["get"+b](),g=Ha(a?"SHORT"+b:b);return d[g][e]}}function Kc(b){function a(a){var b;if(b=a.match(c)){a=new Date(0);var g=0,f=0,k=b[8]?a.setUTCFullYear:a.setFullYear,m=
b[8]?a.setUTCHours:a.setHours;b[9]&&(g=Z(b[9]+b[10]),f=Z(b[9]+b[11]));k.call(a,Z(b[1]),Z(b[2])-1,Z(b[3]));g=Z(b[4]||0)-g;f=Z(b[5]||0)-f;k=Z(b[6]||0);b=Math.round(1E3*parseFloat("0."+(b[7]||0)));m.call(a,g,f,k,b)}return a}var c=/^(\d{4})-?(\d\d)-?(\d\d)(?:T(\d\d)(?::?(\d\d)(?::?(\d\d)(?:\.(\d+))?)?)?(Z|([+-])(\d\d):?(\d\d))?)?$/;return function(c,e){var g="",f=[],k,m;e=e||"mediumDate";e=b.DATETIME_FORMATS[e]||e;C(c)&&(c=He.test(c)?Z(c):a(c));yb(c)&&(c=new Date(c));if(!Na(c))return c;for(;e;)(m=Ie.exec(e))?
(f=f.concat(ya.call(m,1)),e=f.pop()):(f.push(e),e=null);q(f,function(a){k=Je[a];g+=k?k(c,b.DATETIME_FORMATS):a.replace(/(^'|'$)/g,"").replace(/''/g,"'")});return g}}function De(){return function(b){return ra(b,!0)}}function Ee(){return function(b,a){if(!O(b)&&!C(b))return b;a=Infinity===Math.abs(Number(a))?Number(a):Z(a);if(C(b))return a?0<=a?b.slice(0,a):b.slice(a,b.length):"";var c=[],d,e;a>b.length?a=b.length:a<-b.length&&(a=-b.length);0<a?(d=0,e=a):(d=b.length+a,e=b.length);for(;d<e;d++)c.push(b[d]);
return c}}function Mc(b){return function(a,c,d){function e(a,b){return Ra(b)?function(b,c){return a(c,b)}:a}function g(a,b){var c=typeof a,d=typeof b;return c==d?("string"==c&&(a=a.toLowerCase(),b=b.toLowerCase()),a===b?0:a<b?-1:1):c<d?-1:1}if(!O(a)||!c)return a;c=O(c)?c:[c];c=Uc(c,function(a){var c=!1,d=a||Fa;if(C(a)){if("+"==a.charAt(0)||"-"==a.charAt(0))c="-"==a.charAt(0),a=a.substring(1);d=b(a);if(d.constant){var f=d();return e(function(a,b){return g(a[f],b[f])},c)}}return e(function(a,b){return g(d(a),
d(b))},c)});for(var f=[],k=0;k<a.length;k++)f.push(a[k]);return f.sort(e(function(a,b){for(var d=0;d<c.length;d++){var e=c[d](a,b);if(0!==e)return e}return 0},d))}}function va(b){Q(b)&&(b={link:b});b.restrict=b.restrict||"AC";return $(b)}function Pc(b,a,c,d){function e(a,c){c=c?"-"+hb(c,"-"):"";d.removeClass(b,(a?tb:ub)+c);d.addClass(b,(a?ub:tb)+c)}var g=this,f=b.parent().controller("form")||vb,k=0,m=g.$error={},h=[];g.$name=a.name||a.ngForm;g.$dirty=!1;g.$pristine=!0;g.$valid=!0;g.$invalid=!1;f.$addControl(g);
b.addClass(Ma);e(!0);g.$addControl=function(a){Aa(a.$name,"input");h.push(a);a.$name&&(g[a.$name]=a)};g.$removeControl=function(a){a.$name&&g[a.$name]===a&&delete g[a.$name];q(m,function(b,c){g.$setValidity(c,!0,a)});Pa(h,a)};g.$setValidity=function(a,b,c){var d=m[a];if(b)d&&(Pa(d,c),d.length||(k--,k||(e(b),g.$valid=!0,g.$invalid=!1),m[a]=!1,e(!0,a),f.$setValidity(a,!0,g)));else{k||e(b);if(d){if(-1!=Oa(d,c))return}else m[a]=d=[],k++,e(!1,a),f.$setValidity(a,!1,g);d.push(c);g.$valid=!1;g.$invalid=
!0}};g.$setDirty=function(){d.removeClass(b,Ma);d.addClass(b,wb);g.$dirty=!0;g.$pristine=!1;f.$setDirty()};g.$setPristine=function(){d.removeClass(b,wb);d.addClass(b,Ma);g.$dirty=!1;g.$pristine=!0;q(h,function(a){a.$setPristine()})}}function qa(b,a,c,d){b.$setValidity(a,c);return c?d:s}function Ke(b,a,c){var d=c.prop("validity");U(d)&&b.$parsers.push(function(c){if(b.$error[a]||!(d.badInput||d.customError||d.typeMismatch)||d.valueMissing)return c;b.$setValidity(a,!1)})}function xb(b,a,c,d,e,g){var f=
a.prop("validity"),k=a[0].placeholder,m={};if(!e.android){var h=!1;a.on("compositionstart",function(a){h=!0});a.on("compositionend",function(){h=!1;l()})}var l=function(e){if(!h){var g=a.val();if(S&&"input"===(e||m).type&&a[0].placeholder!==k)k=a[0].placeholder;else if(Ra(c.ngTrim||"T")&&(g=aa(g)),d.$viewValue!==g||f&&""===g&&!f.valueMissing)b.$$phase?d.$setViewValue(g):b.$apply(function(){d.$setViewValue(g)})}};if(e.hasEvent("input"))a.on("input",l);else{var n,p=function(){n||(n=g.defer(function(){l();
n=null}))};a.on("keydown",function(a){a=a.keyCode;91===a||(15<a&&19>a||37<=a&&40>=a)||p()});if(e.hasEvent("paste"))a.on("paste cut",p)}a.on("change",l);d.$render=function(){a.val(d.$isEmpty(d.$viewValue)?"":d.$viewValue)};var r=c.ngPattern;r&&((e=r.match(/^\/(.*)\/([gim]*)$/))?(r=RegExp(e[1],e[2]),e=function(a){return qa(d,"pattern",d.$isEmpty(a)||r.test(a),a)}):e=function(c){var e=b.$eval(r);if(!e||!e.test)throw t("ngPattern")("noregexp",r,e,ga(a));return qa(d,"pattern",d.$isEmpty(c)||e.test(c),
c)},d.$formatters.push(e),d.$parsers.push(e));if(c.ngMinlength){var v=Z(c.ngMinlength);e=function(a){return qa(d,"minlength",d.$isEmpty(a)||a.length>=v,a)};d.$parsers.push(e);d.$formatters.push(e)}if(c.ngMaxlength){var q=Z(c.ngMaxlength);e=function(a){return qa(d,"maxlength",d.$isEmpty(a)||a.length<=q,a)};d.$parsers.push(e);d.$formatters.push(e)}}function Vb(b,a){b="ngClass"+b;return["$animate",function(c){function d(a,b){var c=[],d=0;a:for(;d<a.length;d++){for(var e=a[d],l=0;l<b.length;l++)if(e==
b[l])continue a;c.push(e)}return c}function e(a){if(!O(a)){if(C(a))return a.split(" ");if(U(a)){var b=[];q(a,function(a,c){a&&(b=b.concat(c.split(" ")))});return b}}return a}return{restrict:"AC",link:function(g,f,k){function m(a,b){var c=f.data("$classCounts")||{},d=[];q(a,function(a){if(0<b||c[a])c[a]=(c[a]||0)+b,c[a]===+(0<b)&&d.push(a)});f.data("$classCounts",c);return d.join(" ")}function h(b){if(!0===a||g.$index%2===a){var h=e(b||[]);if(!l){var r=m(h,1);k.$addClass(r)}else if(!xa(b,l)){var q=
e(l),r=d(h,q),h=d(q,h),h=m(h,-1),r=m(r,1);0===r.length?c.removeClass(f,h):0===h.length?c.addClass(f,r):c.setClass(f,r,h)}}l=ka(b)}var l;g.$watch(k[b],h,!0);k.$observe("class",function(a){h(g.$eval(k[b]))});"ngClass"!==b&&g.$watch("$index",function(c,d){var f=c&1;if(f!==(d&1)){var h=e(g.$eval(k[b]));f===a?(f=m(h,1),k.$addClass(f)):(f=m(h,-1),k.$removeClass(f))}})}}}]}var L=function(b){return C(b)?b.toLowerCase():b},zb=Object.prototype.hasOwnProperty,Ha=function(b){return C(b)?b.toUpperCase():b},S,
w,Ba,ya=[].slice,Le=[].push,wa=Object.prototype.toString,Qa=t("ng"),Sa=T.angular||(T.angular={}),Ua,La,ja=["0","0","0"];S=Z((/msie (\d+)/.exec(L(navigator.userAgent))||[])[1]);isNaN(S)&&(S=Z((/trident\/.*; rv:(\d+)/.exec(L(navigator.userAgent))||[])[1]));y.$inject=[];Fa.$inject=[];var O=function(){return Q(Array.isArray)?Array.isArray:function(b){return"[object Array]"===wa.call(b)}}(),aa=function(){return String.prototype.trim?function(b){return C(b)?b.trim():b}:function(b){return C(b)?b.replace(/^\s\s*/,
"").replace(/\s\s*$/,""):b}}();La=9>S?function(b){b=b.nodeName?b:b[0];return b.scopeName&&"HTML"!=b.scopeName?Ha(b.scopeName+":"+b.nodeName):b.nodeName}:function(b){return b.nodeName?b.nodeName:b[0].nodeName};var Xc=/[A-Z]/g,$c={full:"1.2.18",major:1,minor:2,dot:18,codeName:"ear-extendability"},Xa=R.cache={},ib=R.expando="ng"+(new Date).getTime(),me=1,pb=T.document.addEventListener?function(b,a,c){b.addEventListener(a,c,!1)}:function(b,a,c){b.attachEvent("on"+a,c)},Wa=T.document.removeEventListener?
function(b,a,c){b.removeEventListener(a,c,!1)}:function(b,a,c){b.detachEvent("on"+a,c)};R._data=function(b){return this.cache[b[this.expando]]||{}};var he=/([\:\-\_]+(.))/g,ie=/^moz([A-Z])/,Gb=t("jqLite"),je=/^<(\w+)\s*\/?>(?:<\/\1>|)$/,Hb=/<|&#?\w+;/,ke=/<([\w:]+)/,le=/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,da={option:[1,'<select multiple="multiple">',"</select>"],thead:[1,"<table>","</table>"],col:[2,"<table><colgroup>","</colgroup></table>"],tr:[2,"<table><tbody>",
"</tbody></table>"],td:[3,"<table><tbody><tr>","</tr></tbody></table>"],_default:[0,"",""]};da.optgroup=da.option;da.tbody=da.tfoot=da.colgroup=da.caption=da.thead;da.th=da.td;var Ka=R.prototype={ready:function(b){function a(){c||(c=!0,b())}var c=!1;"complete"===V.readyState?setTimeout(a):(this.on("DOMContentLoaded",a),R(T).on("load",a))},toString:function(){var b=[];q(this,function(a){b.push(""+a)});return"["+b.join(", ")+"]"},eq:function(b){return 0<=b?w(this[b]):w(this[this.length+b])},length:0,
push:Le,sort:[].sort,splice:[].splice},mb={};q("multiple selected checked disabled readOnly required open".split(" "),function(b){mb[L(b)]=b});var rc={};q("input select option textarea button form details".split(" "),function(b){rc[Ha(b)]=!0});q({data:nc,inheritedData:lb,scope:function(b){return w(b).data("$scope")||lb(b.parentNode||b,["$isolateScope","$scope"])},isolateScope:function(b){return w(b).data("$isolateScope")||w(b).data("$isolateScopeNoTemplate")},controller:oc,injector:function(b){return lb(b,
"$injector")},removeAttr:function(b,a){b.removeAttribute(a)},hasClass:Kb,css:function(b,a,c){a=Va(a);if(B(c))b.style[a]=c;else{var d;8>=S&&(d=b.currentStyle&&b.currentStyle[a],""===d&&(d="auto"));d=d||b.style[a];8>=S&&(d=""===d?s:d);return d}},attr:function(b,a,c){var d=L(a);if(mb[d])if(B(c))c?(b[a]=!0,b.setAttribute(a,d)):(b[a]=!1,b.removeAttribute(d));else return b[a]||(b.attributes.getNamedItem(a)||y).specified?d:s;else if(B(c))b.setAttribute(a,c);else if(b.getAttribute)return b=b.getAttribute(a,
2),null===b?s:b},prop:function(b,a,c){if(B(c))b[a]=c;else return b[a]},text:function(){function b(b,d){var e=a[b.nodeType];if(D(d))return e?b[e]:"";b[e]=d}var a=[];9>S?(a[1]="innerText",a[3]="nodeValue"):a[1]=a[3]="textContent";b.$dv="";return b}(),val:function(b,a){if(D(a)){if("SELECT"===La(b)&&b.multiple){var c=[];q(b.options,function(a){a.selected&&c.push(a.value||a.text)});return 0===c.length?null:c}return b.value}b.value=a},html:function(b,a){if(D(a))return b.innerHTML;for(var c=0,d=b.childNodes;c<
d.length;c++)Ia(d[c]);b.innerHTML=a},empty:pc},function(b,a){R.prototype[a]=function(a,d){var e,g,f=this.length;if(b!==pc&&(2==b.length&&b!==Kb&&b!==oc?a:d)===s){if(U(a)){for(e=0;e<f;e++)if(b===nc)b(this[e],a);else for(g in a)b(this[e],g,a[g]);return this}e=b.$dv;f=e===s?Math.min(f,1):f;for(g=0;g<f;g++){var k=b(this[g],a,d);e=e?e+k:k}return e}for(e=0;e<f;e++)b(this[e],a,d);return this}});q({removeData:lc,dealoc:Ia,on:function a(c,d,e,g){if(B(g))throw Gb("onargs");var f=la(c,"events"),k=la(c,"handle");
f||la(c,"events",f={});k||la(c,"handle",k=ne(c,f));q(d.split(" "),function(d){var g=f[d];if(!g){if("mouseenter"==d||"mouseleave"==d){var l=V.body.contains||V.body.compareDocumentPosition?function(a,c){var d=9===a.nodeType?a.documentElement:a,e=c&&c.parentNode;return a===e||!!(e&&1===e.nodeType&&(d.contains?d.contains(e):a.compareDocumentPosition&&a.compareDocumentPosition(e)&16))}:function(a,c){if(c)for(;c=c.parentNode;)if(c===a)return!0;return!1};f[d]=[];a(c,{mouseleave:"mouseout",mouseenter:"mouseover"}[d],
function(a){var c=a.relatedTarget;c&&(c===this||l(this,c))||k(a,d)})}else pb(c,d,k),f[d]=[];g=f[d]}g.push(e)})},off:mc,one:function(a,c,d){a=w(a);a.on(c,function g(){a.off(c,d);a.off(c,g)});a.on(c,d)},replaceWith:function(a,c){var d,e=a.parentNode;Ia(a);q(new R(c),function(c){d?e.insertBefore(c,d.nextSibling):e.replaceChild(c,a);d=c})},children:function(a){var c=[];q(a.childNodes,function(a){1===a.nodeType&&c.push(a)});return c},contents:function(a){return a.contentDocument||a.childNodes||[]},append:function(a,
c){q(new R(c),function(c){1!==a.nodeType&&11!==a.nodeType||a.appendChild(c)})},prepend:function(a,c){if(1===a.nodeType){var d=a.firstChild;q(new R(c),function(c){a.insertBefore(c,d)})}},wrap:function(a,c){c=w(c)[0];var d=a.parentNode;d&&d.replaceChild(c,a);c.appendChild(a)},remove:function(a){Ia(a);var c=a.parentNode;c&&c.removeChild(a)},after:function(a,c){var d=a,e=a.parentNode;q(new R(c),function(a){e.insertBefore(a,d.nextSibling);d=a})},addClass:kb,removeClass:jb,toggleClass:function(a,c,d){c&&
q(c.split(" "),function(c){var g=d;D(g)&&(g=!Kb(a,c));(g?kb:jb)(a,c)})},parent:function(a){return(a=a.parentNode)&&11!==a.nodeType?a:null},next:function(a){if(a.nextElementSibling)return a.nextElementSibling;for(a=a.nextSibling;null!=a&&1!==a.nodeType;)a=a.nextSibling;return a},find:function(a,c){return a.getElementsByTagName?a.getElementsByTagName(c):[]},clone:Jb,triggerHandler:function(a,c,d){c=(la(a,"events")||{})[c];d=d||[];var e=[{preventDefault:y,stopPropagation:y}];q(c,function(c){c.apply(a,
e.concat(d))})}},function(a,c){R.prototype[c]=function(c,e,g){for(var f,k=0;k<this.length;k++)D(f)?(f=a(this[k],c,e,g),B(f)&&(f=w(f))):Ib(f,a(this[k],c,e,g));return B(f)?f:this};R.prototype.bind=R.prototype.on;R.prototype.unbind=R.prototype.off});Ya.prototype={put:function(a,c){this[Ja(a)]=c},get:function(a){return this[Ja(a)]},remove:function(a){var c=this[a=Ja(a)];delete this[a];return c}};var pe=/^function\s*[^\(]*\(\s*([^\)]*)\)/m,qe=/,/,re=/^\s*(_?)(\S+?)\1\s*$/,oe=/((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg,
Za=t("$injector"),Me=t("$animate"),Ld=["$provide",function(a){this.$$selectors={};this.register=function(c,d){var e=c+"-animation";if(c&&"."!=c.charAt(0))throw Me("notcsel",c);this.$$selectors[c.substr(1)]=e;a.factory(e,d)};this.classNameFilter=function(a){1===arguments.length&&(this.$$classNameFilter=a instanceof RegExp?a:null);return this.$$classNameFilter};this.$get=["$timeout","$$asyncCallback",function(a,d){return{enter:function(a,c,f,k){f?f.after(a):(c&&c[0]||(c=f.parent()),c.append(a));k&&
d(k)},leave:function(a,c){a.remove();c&&d(c)},move:function(a,c,d,k){this.enter(a,c,d,k)},addClass:function(a,c,f){c=C(c)?c:O(c)?c.join(" "):"";q(a,function(a){kb(a,c)});f&&d(f)},removeClass:function(a,c,f){c=C(c)?c:O(c)?c.join(" "):"";q(a,function(a){jb(a,c)});f&&d(f)},setClass:function(a,c,f,k){q(a,function(a){kb(a,c);jb(a,f)});k&&d(k)},enabled:y}}]}],ia=t("$compile");gc.$inject=["$provide","$$sanitizeUriProvider"];var ue=/^(x[\:\-_]|data[\:\-_])/i,zc=t("$interpolate"),Ne=/^([^\?#]*)(\?([^#]*))?(#(.*))?$/,
xe={http:80,https:443,ftp:21},Pb=t("$location");Rb.prototype=Qb.prototype=Cc.prototype={$$html5:!1,$$replace:!1,absUrl:qb("$$absUrl"),url:function(a,c){if(D(a))return this.$$url;var d=Ne.exec(a);d[1]&&this.path(decodeURIComponent(d[1]));(d[2]||d[1])&&this.search(d[3]||"");this.hash(d[5]||"",c);return this},protocol:qb("$$protocol"),host:qb("$$host"),port:qb("$$port"),path:Dc("$$path",function(a){return"/"==a.charAt(0)?a:"/"+a}),search:function(a,c){switch(arguments.length){case 0:return this.$$search;
case 1:if(C(a))this.$$search=cc(a);else if(U(a))this.$$search=a;else throw Pb("isrcharg");break;default:D(c)||null===c?delete this.$$search[a]:this.$$search[a]=c}this.$$compose();return this},hash:Dc("$$hash",Fa),replace:function(){this.$$replace=!0;return this}};var Da=t("$parse"),Gc={},ta,cb={"null":function(){return null},"true":function(){return!0},"false":function(){return!1},undefined:y,"+":function(a,c,d,e){d=d(a,c);e=e(a,c);return B(d)?B(e)?d+e:d:B(e)?e:s},"-":function(a,c,d,e){d=d(a,c);e=
e(a,c);return(B(d)?d:0)-(B(e)?e:0)},"*":function(a,c,d,e){return d(a,c)*e(a,c)},"/":function(a,c,d,e){return d(a,c)/e(a,c)},"%":function(a,c,d,e){return d(a,c)%e(a,c)},"^":function(a,c,d,e){return d(a,c)^e(a,c)},"=":y,"===":function(a,c,d,e){return d(a,c)===e(a,c)},"!==":function(a,c,d,e){return d(a,c)!==e(a,c)},"==":function(a,c,d,e){return d(a,c)==e(a,c)},"!=":function(a,c,d,e){return d(a,c)!=e(a,c)},"<":function(a,c,d,e){return d(a,c)<e(a,c)},">":function(a,c,d,e){return d(a,c)>e(a,c)},"<=":function(a,
c,d,e){return d(a,c)<=e(a,c)},">=":function(a,c,d,e){return d(a,c)>=e(a,c)},"&&":function(a,c,d,e){return d(a,c)&&e(a,c)},"||":function(a,c,d,e){return d(a,c)||e(a,c)},"&":function(a,c,d,e){return d(a,c)&e(a,c)},"|":function(a,c,d,e){return e(a,c)(a,c,d(a,c))},"!":function(a,c,d){return!d(a,c)}},Oe={n:"\n",f:"\f",r:"\r",t:"\t",v:"\v","'":"'",'"':'"'},Tb=function(a){this.options=a};Tb.prototype={constructor:Tb,lex:function(a){this.text=a;this.index=0;this.ch=s;this.lastCh=":";for(this.tokens=[];this.index<
this.text.length;){this.ch=this.text.charAt(this.index);if(this.is("\"'"))this.readString(this.ch);else if(this.isNumber(this.ch)||this.is(".")&&this.isNumber(this.peek()))this.readNumber();else if(this.isIdent(this.ch))this.readIdent();else if(this.is("(){}[].,;:?"))this.tokens.push({index:this.index,text:this.ch}),this.index++;else if(this.isWhitespace(this.ch)){this.index++;continue}else{a=this.ch+this.peek();var c=a+this.peek(2),d=cb[this.ch],e=cb[a],g=cb[c];g?(this.tokens.push({index:this.index,
text:c,fn:g}),this.index+=3):e?(this.tokens.push({index:this.index,text:a,fn:e}),this.index+=2):d?(this.tokens.push({index:this.index,text:this.ch,fn:d}),this.index+=1):this.throwError("Unexpected next character ",this.index,this.index+1)}this.lastCh=this.ch}return this.tokens},is:function(a){return-1!==a.indexOf(this.ch)},was:function(a){return-1!==a.indexOf(this.lastCh)},peek:function(a){a=a||1;return this.index+a<this.text.length?this.text.charAt(this.index+a):!1},isNumber:function(a){return"0"<=
a&&"9">=a},isWhitespace:function(a){return" "===a||"\r"===a||"\t"===a||"\n"===a||"\v"===a||"\u00a0"===a},isIdent:function(a){return"a"<=a&&"z">=a||"A"<=a&&"Z">=a||"_"===a||"$"===a},isExpOperator:function(a){return"-"===a||"+"===a||this.isNumber(a)},throwError:function(a,c,d){d=d||this.index;c=B(c)?"s "+c+"-"+this.index+" ["+this.text.substring(c,d)+"]":" "+d;throw Da("lexerr",a,c,this.text);},readNumber:function(){for(var a="",c=this.index;this.index<this.text.length;){var d=L(this.text.charAt(this.index));
if("."==d||this.isNumber(d))a+=d;else{var e=this.peek();if("e"==d&&this.isExpOperator(e))a+=d;else if(this.isExpOperator(d)&&e&&this.isNumber(e)&&"e"==a.charAt(a.length-1))a+=d;else if(!this.isExpOperator(d)||e&&this.isNumber(e)||"e"!=a.charAt(a.length-1))break;else this.throwError("Invalid exponent")}this.index++}a*=1;this.tokens.push({index:c,text:a,literal:!0,constant:!0,fn:function(){return a}})},readIdent:function(){for(var a=this,c="",d=this.index,e,g,f,k;this.index<this.text.length;){k=this.text.charAt(this.index);
if("."===k||this.isIdent(k)||this.isNumber(k))"."===k&&(e=this.index),c+=k;else break;this.index++}if(e)for(g=this.index;g<this.text.length;){k=this.text.charAt(g);if("("===k){f=c.substr(e-d+1);c=c.substr(0,e-d);this.index=g;break}if(this.isWhitespace(k))g++;else break}d={index:d,text:c};if(cb.hasOwnProperty(c))d.fn=cb[c],d.literal=!0,d.constant=!0;else{var m=Fc(c,this.options,this.text);d.fn=J(function(a,c){return m(a,c)},{assign:function(d,e){return rb(d,c,e,a.text,a.options)}})}this.tokens.push(d);
f&&(this.tokens.push({index:e,text:"."}),this.tokens.push({index:e+1,text:f}))},readString:function(a){var c=this.index;this.index++;for(var d="",e=a,g=!1;this.index<this.text.length;){var f=this.text.charAt(this.index),e=e+f;if(g)"u"===f?(f=this.text.substring(this.index+1,this.index+5),f.match(/[\da-f]{4}/i)||this.throwError("Invalid unicode escape [\\u"+f+"]"),this.index+=4,d+=String.fromCharCode(parseInt(f,16))):d=(g=Oe[f])?d+g:d+f,g=!1;else if("\\"===f)g=!0;else{if(f===a){this.index++;this.tokens.push({index:c,
text:e,string:d,literal:!0,constant:!0,fn:function(){return d}});return}d+=f}this.index++}this.throwError("Unterminated quote",c)}};var bb=function(a,c,d){this.lexer=a;this.$filter=c;this.options=d};bb.ZERO=J(function(){return 0},{constant:!0});bb.prototype={constructor:bb,parse:function(a){this.text=a;this.tokens=this.lexer.lex(a);a=this.statements();0!==this.tokens.length&&this.throwError("is an unexpected token",this.tokens[0]);a.literal=!!a.literal;a.constant=!!a.constant;return a},primary:function(){var a;
if(this.expect("("))a=this.filterChain(),this.consume(")");else if(this.expect("["))a=this.arrayDeclaration();else if(this.expect("{"))a=this.object();else{var c=this.expect();(a=c.fn)||this.throwError("not a primary expression",c);a.literal=!!c.literal;a.constant=!!c.constant}for(var d;c=this.expect("(","[",".");)"("===c.text?(a=this.functionCall(a,d),d=null):"["===c.text?(d=a,a=this.objectIndex(a)):"."===c.text?(d=a,a=this.fieldAccess(a)):this.throwError("IMPOSSIBLE");return a},throwError:function(a,
c){throw Da("syntax",c.text,a,c.index+1,this.text,this.text.substring(c.index));},peekToken:function(){if(0===this.tokens.length)throw Da("ueoe",this.text);return this.tokens[0]},peek:function(a,c,d,e){if(0<this.tokens.length){var g=this.tokens[0],f=g.text;if(f===a||f===c||f===d||f===e||!(a||c||d||e))return g}return!1},expect:function(a,c,d,e){return(a=this.peek(a,c,d,e))?(this.tokens.shift(),a):!1},consume:function(a){this.expect(a)||this.throwError("is unexpected, expecting ["+a+"]",this.peek())},
unaryFn:function(a,c){return J(function(d,e){return a(d,e,c)},{constant:c.constant})},ternaryFn:function(a,c,d){return J(function(e,g){return a(e,g)?c(e,g):d(e,g)},{constant:a.constant&&c.constant&&d.constant})},binaryFn:function(a,c,d){return J(function(e,g){return c(e,g,a,d)},{constant:a.constant&&d.constant})},statements:function(){for(var a=[];;)if(0<this.tokens.length&&!this.peek("}",")",";","]")&&a.push(this.filterChain()),!this.expect(";"))return 1===a.length?a[0]:function(c,d){for(var e,g=
0;g<a.length;g++){var f=a[g];f&&(e=f(c,d))}return e}},filterChain:function(){for(var a=this.expression(),c;;)if(c=this.expect("|"))a=this.binaryFn(a,c.fn,this.filter());else return a},filter:function(){for(var a=this.expect(),c=this.$filter(a.text),d=[];;)if(a=this.expect(":"))d.push(this.expression());else{var e=function(a,e,k){k=[k];for(var m=0;m<d.length;m++)k.push(d[m](a,e));return c.apply(a,k)};return function(){return e}}},expression:function(){return this.assignment()},assignment:function(){var a=
this.ternary(),c,d;return(d=this.expect("="))?(a.assign||this.throwError("implies assignment but ["+this.text.substring(0,d.index)+"] can not be assigned to",d),c=this.ternary(),function(d,g){return a.assign(d,c(d,g),g)}):a},ternary:function(){var a=this.logicalOR(),c,d;if(this.expect("?")){c=this.ternary();if(d=this.expect(":"))return this.ternaryFn(a,c,this.ternary());this.throwError("expected :",d)}else return a},logicalOR:function(){for(var a=this.logicalAND(),c;;)if(c=this.expect("||"))a=this.binaryFn(a,
c.fn,this.logicalAND());else return a},logicalAND:function(){var a=this.equality(),c;if(c=this.expect("&&"))a=this.binaryFn(a,c.fn,this.logicalAND());return a},equality:function(){var a=this.relational(),c;if(c=this.expect("==","!=","===","!=="))a=this.binaryFn(a,c.fn,this.equality());return a},relational:function(){var a=this.additive(),c;if(c=this.expect("<",">","<=",">="))a=this.binaryFn(a,c.fn,this.relational());return a},additive:function(){for(var a=this.multiplicative(),c;c=this.expect("+",
"-");)a=this.binaryFn(a,c.fn,this.multiplicative());return a},multiplicative:function(){for(var a=this.unary(),c;c=this.expect("*","/","%");)a=this.binaryFn(a,c.fn,this.unary());return a},unary:function(){var a;return this.expect("+")?this.primary():(a=this.expect("-"))?this.binaryFn(bb.ZERO,a.fn,this.unary()):(a=this.expect("!"))?this.unaryFn(a.fn,this.unary()):this.primary()},fieldAccess:function(a){var c=this,d=this.expect().text,e=Fc(d,this.options,this.text);return J(function(c,d,k){return e(k||
a(c,d))},{assign:function(e,f,k){return rb(a(e,k),d,f,c.text,c.options)}})},objectIndex:function(a){var c=this,d=this.expression();this.consume("]");return J(function(e,g){var f=a(e,g),k=d(e,g),m;if(!f)return s;(f=ab(f[k],c.text))&&(f.then&&c.options.unwrapPromises)&&(m=f,"$$v"in f||(m.$$v=s,m.then(function(a){m.$$v=a})),f=f.$$v);return f},{assign:function(e,g,f){var k=d(e,f);return ab(a(e,f),c.text)[k]=g}})},functionCall:function(a,c){var d=[];if(")"!==this.peekToken().text){do d.push(this.expression());
while(this.expect(","))}this.consume(")");var e=this;return function(g,f){for(var k=[],m=c?c(g,f):g,h=0;h<d.length;h++)k.push(d[h](g,f));h=a(g,f,m)||y;ab(m,e.text);ab(h,e.text);k=h.apply?h.apply(m,k):h(k[0],k[1],k[2],k[3],k[4]);return ab(k,e.text)}},arrayDeclaration:function(){var a=[],c=!0;if("]"!==this.peekToken().text){do{if(this.peek("]"))break;var d=this.expression();a.push(d);d.constant||(c=!1)}while(this.expect(","))}this.consume("]");return J(function(c,d){for(var f=[],k=0;k<a.length;k++)f.push(a[k](c,
d));return f},{literal:!0,constant:c})},object:function(){var a=[],c=!0;if("}"!==this.peekToken().text){do{if(this.peek("}"))break;var d=this.expect(),d=d.string||d.text;this.consume(":");var e=this.expression();a.push({key:d,value:e});e.constant||(c=!1)}while(this.expect(","))}this.consume("}");return J(function(c,d){for(var e={},m=0;m<a.length;m++){var h=a[m];e[h.key]=h.value(c,d)}return e},{literal:!0,constant:c})}};var Sb={},ua=t("$sce"),fa={HTML:"html",CSS:"css",URL:"url",RESOURCE_URL:"resourceUrl",
JS:"js"},W=V.createElement("a"),Ic=sa(T.location.href,!0);kc.$inject=["$provide"];Jc.$inject=["$locale"];Lc.$inject=["$locale"];var Oc=".",Je={yyyy:Y("FullYear",4),yy:Y("FullYear",2,0,!0),y:Y("FullYear",1),MMMM:sb("Month"),MMM:sb("Month",!0),MM:Y("Month",2,1),M:Y("Month",1,1),dd:Y("Date",2),d:Y("Date",1),HH:Y("Hours",2),H:Y("Hours",1),hh:Y("Hours",2,-12),h:Y("Hours",1,-12),mm:Y("Minutes",2),m:Y("Minutes",1),ss:Y("Seconds",2),s:Y("Seconds",1),sss:Y("Milliseconds",3),EEEE:sb("Day"),EEE:sb("Day",!0),
a:function(a,c){return 12>a.getHours()?c.AMPMS[0]:c.AMPMS[1]},Z:function(a){a=-1*a.getTimezoneOffset();return a=(0<=a?"+":"")+(Ub(Math[0<a?"floor":"ceil"](a/60),2)+Ub(Math.abs(a%60),2))}},Ie=/((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/,He=/^\-?\d+$/;Kc.$inject=["$locale"];var Fe=$(L),Ge=$(Ha);Mc.$inject=["$parse"];var cd=$({restrict:"E",compile:function(a,c){8>=S&&(c.href||c.name||c.$set("href",""),a.append(V.createComment("IE fix")));if(!c.href&&!c.xlinkHref&&!c.name)return function(a,
c){var g="[object SVGAnimatedString]"===wa.call(c.prop("href"))?"xlink:href":"href";c.on("click",function(a){c.attr(g)||a.preventDefault()})}}}),Eb={};q(mb,function(a,c){if("multiple"!=a){var d=ma("ng-"+c);Eb[d]=function(){return{priority:100,link:function(a,g,f){a.$watch(f[d],function(a){f.$set(c,!!a)})}}}}});q(["src","srcset","href"],function(a){var c=ma("ng-"+a);Eb[c]=function(){return{priority:99,link:function(d,e,g){var f=a,k=a;"href"===a&&"[object SVGAnimatedString]"===wa.call(e.prop("href"))&&
(k="xlinkHref",g.$attr[k]="xlink:href",f=null);g.$observe(c,function(a){a&&(g.$set(k,a),S&&f&&e.prop(f,g[k]))})}}}});var vb={$addControl:y,$removeControl:y,$setValidity:y,$setDirty:y,$setPristine:y};Pc.$inject=["$element","$attrs","$scope","$animate"];var Qc=function(a){return["$timeout",function(c){return{name:"form",restrict:a?"EAC":"E",controller:Pc,compile:function(){return{pre:function(a,e,g,f){if(!g.action){var k=function(a){a.preventDefault?a.preventDefault():a.returnValue=!1};pb(e[0],"submit",
k);e.on("$destroy",function(){c(function(){Wa(e[0],"submit",k)},0,!1)})}var m=e.parent().controller("form"),h=g.name||g.ngForm;h&&rb(a,h,f,h);if(m)e.on("$destroy",function(){m.$removeControl(f);h&&rb(a,h,s,h);J(f,vb)})}}}}}]},dd=Qc(),qd=Qc(!0),Pe=/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/,Qe=/^[a-z0-9!#$%&'*+/=?^_`{|}~.-]+@[a-z0-9-]+(\.[a-z0-9-]+)*$/i,Re=/^\s*(\-|\+)?(\d+|(\d*(\.\d*)))\s*$/,Rc={text:xb,number:function(a,c,d,e,g,f){xb(a,c,d,e,g,f);e.$parsers.push(function(a){var c=
e.$isEmpty(a);if(c||Re.test(a))return e.$setValidity("number",!0),""===a?null:c?a:parseFloat(a);e.$setValidity("number",!1);return s});Ke(e,"number",c);e.$formatters.push(function(a){return e.$isEmpty(a)?"":""+a});d.min&&(a=function(a){var c=parseFloat(d.min);return qa(e,"min",e.$isEmpty(a)||a>=c,a)},e.$parsers.push(a),e.$formatters.push(a));d.max&&(a=function(a){var c=parseFloat(d.max);return qa(e,"max",e.$isEmpty(a)||a<=c,a)},e.$parsers.push(a),e.$formatters.push(a));e.$formatters.push(function(a){return qa(e,
"number",e.$isEmpty(a)||yb(a),a)})},url:function(a,c,d,e,g,f){xb(a,c,d,e,g,f);a=function(a){return qa(e,"url",e.$isEmpty(a)||Pe.test(a),a)};e.$formatters.push(a);e.$parsers.push(a)},email:function(a,c,d,e,g,f){xb(a,c,d,e,g,f);a=function(a){return qa(e,"email",e.$isEmpty(a)||Qe.test(a),a)};e.$formatters.push(a);e.$parsers.push(a)},radio:function(a,c,d,e){D(d.name)&&c.attr("name",eb());c.on("click",function(){c[0].checked&&a.$apply(function(){e.$setViewValue(d.value)})});e.$render=function(){c[0].checked=
d.value==e.$viewValue};d.$observe("value",e.$render)},checkbox:function(a,c,d,e){var g=d.ngTrueValue,f=d.ngFalseValue;C(g)||(g=!0);C(f)||(f=!1);c.on("click",function(){a.$apply(function(){e.$setViewValue(c[0].checked)})});e.$render=function(){c[0].checked=e.$viewValue};e.$isEmpty=function(a){return a!==g};e.$formatters.push(function(a){return a===g});e.$parsers.push(function(a){return a?g:f})},hidden:y,button:y,submit:y,reset:y,file:y},hc=["$browser","$sniffer",function(a,c){return{restrict:"E",require:"?ngModel",
link:function(d,e,g,f){f&&(Rc[L(g.type)]||Rc.text)(d,e,g,f,c,a)}}}],ub="ng-valid",tb="ng-invalid",Ma="ng-pristine",wb="ng-dirty",Se=["$scope","$exceptionHandler","$attrs","$element","$parse","$animate",function(a,c,d,e,g,f){function k(a,c){c=c?"-"+hb(c,"-"):"";f.removeClass(e,(a?tb:ub)+c);f.addClass(e,(a?ub:tb)+c)}this.$modelValue=this.$viewValue=Number.NaN;this.$parsers=[];this.$formatters=[];this.$viewChangeListeners=[];this.$pristine=!0;this.$dirty=!1;this.$valid=!0;this.$invalid=!1;this.$name=
d.name;var m=g(d.ngModel),h=m.assign;if(!h)throw t("ngModel")("nonassign",d.ngModel,ga(e));this.$render=y;this.$isEmpty=function(a){return D(a)||""===a||null===a||a!==a};var l=e.inheritedData("$formController")||vb,n=0,p=this.$error={};e.addClass(Ma);k(!0);this.$setValidity=function(a,c){p[a]!==!c&&(c?(p[a]&&n--,n||(k(!0),this.$valid=!0,this.$invalid=!1)):(k(!1),this.$invalid=!0,this.$valid=!1,n++),p[a]=!c,k(c,a),l.$setValidity(a,c,this))};this.$setPristine=function(){this.$dirty=!1;this.$pristine=
!0;f.removeClass(e,wb);f.addClass(e,Ma)};this.$setViewValue=function(d){this.$viewValue=d;this.$pristine&&(this.$dirty=!0,this.$pristine=!1,f.removeClass(e,Ma),f.addClass(e,wb),l.$setDirty());q(this.$parsers,function(a){d=a(d)});this.$modelValue!==d&&(this.$modelValue=d,h(a,d),q(this.$viewChangeListeners,function(a){try{a()}catch(d){c(d)}}))};var r=this;a.$watch(function(){var c=m(a);if(r.$modelValue!==c){var d=r.$formatters,e=d.length;for(r.$modelValue=c;e--;)c=d[e](c);r.$viewValue!==c&&(r.$viewValue=
c,r.$render())}return c})}],Fd=function(){return{require:["ngModel","^?form"],controller:Se,link:function(a,c,d,e){var g=e[0],f=e[1]||vb;f.$addControl(g);a.$on("$destroy",function(){f.$removeControl(g)})}}},Hd=$({require:"ngModel",link:function(a,c,d,e){e.$viewChangeListeners.push(function(){a.$eval(d.ngChange)})}}),ic=function(){return{require:"?ngModel",link:function(a,c,d,e){if(e){d.required=!0;var g=function(a){if(d.required&&e.$isEmpty(a))e.$setValidity("required",!1);else return e.$setValidity("required",
!0),a};e.$formatters.push(g);e.$parsers.unshift(g);d.$observe("required",function(){g(e.$viewValue)})}}}},Gd=function(){return{require:"ngModel",link:function(a,c,d,e){var g=(a=/\/(.*)\//.exec(d.ngList))&&RegExp(a[1])||d.ngList||",";e.$parsers.push(function(a){if(!D(a)){var c=[];a&&q(a.split(g),function(a){a&&c.push(aa(a))});return c}});e.$formatters.push(function(a){return O(a)?a.join(", "):s});e.$isEmpty=function(a){return!a||!a.length}}}},Te=/^(true|false|\d+)$/,Id=function(){return{priority:100,
compile:function(a,c){return Te.test(c.ngValue)?function(a,c,g){g.$set("value",a.$eval(g.ngValue))}:function(a,c,g){a.$watch(g.ngValue,function(a){g.$set("value",a)})}}}},id=va({compile:function(a){a.addClass("ng-binding");return function(a,d,e){d.data("$binding",e.ngBind);a.$watch(e.ngBind,function(a){d.text(a==s?"":a)})}}}),kd=["$interpolate",function(a){return function(c,d,e){c=a(d.attr(e.$attr.ngBindTemplate));d.addClass("ng-binding").data("$binding",c);e.$observe("ngBindTemplate",function(a){d.text(a)})}}],
jd=["$sce","$parse",function(a,c){return function(d,e,g){e.addClass("ng-binding").data("$binding",g.ngBindHtml);var f=c(g.ngBindHtml);d.$watch(function(){return(f(d)||"").toString()},function(c){e.html(a.getTrustedHtml(f(d))||"")})}}],ld=Vb("",!0),nd=Vb("Odd",0),md=Vb("Even",1),od=va({compile:function(a,c){c.$set("ngCloak",s);a.removeClass("ng-cloak")}}),pd=[function(){return{scope:!0,controller:"@",priority:500}}],jc={};q("click dblclick mousedown mouseup mouseover mouseout mousemove mouseenter mouseleave keydown keyup keypress submit focus blur copy cut paste".split(" "),
function(a){var c=ma("ng-"+a);jc[c]=["$parse",function(d){return{compile:function(e,g){var f=d(g[c]);return function(c,d){d.on(L(a),function(a){c.$apply(function(){f(c,{$event:a})})})}}}}]});var sd=["$animate",function(a){return{transclude:"element",priority:600,terminal:!0,restrict:"A",$$tlb:!0,link:function(c,d,e,g,f){var k,m,h;c.$watch(e.ngIf,function(g){Ra(g)?m||(m=c.$new(),f(m,function(c){c[c.length++]=V.createComment(" end ngIf: "+e.ngIf+" ");k={clone:c};a.enter(c,d.parent(),d)})):(h&&(h.remove(),
h=null),m&&(m.$destroy(),m=null),k&&(h=Db(k.clone),a.leave(h,function(){h=null}),k=null))})}}}],td=["$http","$templateCache","$anchorScroll","$animate","$sce",function(a,c,d,e,g){return{restrict:"ECA",priority:400,terminal:!0,transclude:"element",controller:Sa.noop,compile:function(f,k){var m=k.ngInclude||k.src,h=k.onload||"",l=k.autoscroll;return function(f,k,r,q,I){var s=0,u,w,F,z=function(){w&&(w.remove(),w=null);u&&(u.$destroy(),u=null);F&&(e.leave(F,function(){w=null}),w=F,F=null)};f.$watch(g.parseAsResourceUrl(m),
function(g){var m=function(){!B(l)||l&&!f.$eval(l)||d()},r=++s;g?(a.get(g,{cache:c}).success(function(a){if(r===s){var c=f.$new();q.template=a;a=I(c,function(a){z();e.enter(a,null,k,m)});u=c;F=a;u.$emit("$includeContentLoaded");f.$eval(h)}}).error(function(){r===s&&z()}),f.$emit("$includeContentRequested")):(z(),q.template=null)})}}}}],Jd=["$compile",function(a){return{restrict:"ECA",priority:-400,require:"ngInclude",link:function(c,d,e,g){d.html(g.template);a(d.contents())(c)}}}],ud=va({priority:450,
compile:function(){return{pre:function(a,c,d){a.$eval(d.ngInit)}}}}),vd=va({terminal:!0,priority:1E3}),wd=["$locale","$interpolate",function(a,c){var d=/{}/g;return{restrict:"EA",link:function(e,g,f){var k=f.count,m=f.$attr.when&&g.attr(f.$attr.when),h=f.offset||0,l=e.$eval(m)||{},n={},p=c.startSymbol(),r=c.endSymbol(),s=/^when(Minus)?(.+)$/;q(f,function(a,c){s.test(c)&&(l[L(c.replace("when","").replace("Minus","-"))]=g.attr(f.$attr[c]))});q(l,function(a,e){n[e]=c(a.replace(d,p+k+"-"+h+r))});e.$watch(function(){var c=
parseFloat(e.$eval(k));if(isNaN(c))return"";c in l||(c=a.pluralCat(c-h));return n[c](e,g,!0)},function(a){g.text(a)})}}}],xd=["$parse","$animate",function(a,c){var d=t("ngRepeat");return{transclude:"element",priority:1E3,terminal:!0,$$tlb:!0,link:function(e,g,f,k,m){var h=f.ngRepeat,l=h.match(/^\s*([\s\S]+?)\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?\s*$/),n,p,r,s,I,x,u={$id:Ja};if(!l)throw d("iexp",h);f=l[1];k=l[2];(l=l[3])?(n=a(l),p=function(a,c,d){x&&(u[x]=a);u[I]=c;u.$index=d;return n(e,
u)}):(r=function(a,c){return Ja(c)},s=function(a){return a});l=f.match(/^(?:([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\))$/);if(!l)throw d("iidexp",f);I=l[3]||l[1];x=l[2];var B={};e.$watchCollection(k,function(a){var f,k,l=g[0],n,u={},E,A,H,t,C,y,D=[];if(db(a))C=a,n=p||r;else{n=p||s;C=[];for(H in a)a.hasOwnProperty(H)&&"$"!=H.charAt(0)&&C.push(H);C.sort()}E=C.length;k=D.length=C.length;for(f=0;f<k;f++)if(H=a===C?f:C[f],t=a[H],t=n(H,t,f),Aa(t,"`track by` id"),B.hasOwnProperty(t))y=B[t],delete B[t],u[t]=
y,D[f]=y;else{if(u.hasOwnProperty(t))throw q(D,function(a){a&&a.scope&&(B[a.id]=a)}),d("dupes",h,t);D[f]={id:t};u[t]=!1}for(H in B)B.hasOwnProperty(H)&&(y=B[H],f=Db(y.clone),c.leave(f),q(f,function(a){a.$$NG_REMOVED=!0}),y.scope.$destroy());f=0;for(k=C.length;f<k;f++){H=a===C?f:C[f];t=a[H];y=D[f];D[f-1]&&(l=D[f-1].clone[D[f-1].clone.length-1]);if(y.scope){A=y.scope;n=l;do n=n.nextSibling;while(n&&n.$$NG_REMOVED);y.clone[0]!=n&&c.move(Db(y.clone),null,w(l));l=y.clone[y.clone.length-1]}else A=e.$new();
A[I]=t;x&&(A[x]=H);A.$index=f;A.$first=0===f;A.$last=f===E-1;A.$middle=!(A.$first||A.$last);A.$odd=!(A.$even=0===(f&1));y.scope||m(A,function(a){a[a.length++]=V.createComment(" end ngRepeat: "+h+" ");c.enter(a,null,w(l));l=a;y.scope=A;y.clone=a;u[y.id]=y})}B=u})}}}],yd=["$animate",function(a){return function(c,d,e){c.$watch(e.ngShow,function(c){a[Ra(c)?"removeClass":"addClass"](d,"ng-hide")})}}],rd=["$animate",function(a){return function(c,d,e){c.$watch(e.ngHide,function(c){a[Ra(c)?"addClass":"removeClass"](d,
"ng-hide")})}}],zd=va(function(a,c,d){a.$watch(d.ngStyle,function(a,d){d&&a!==d&&q(d,function(a,d){c.css(d,"")});a&&c.css(a)},!0)}),Ad=["$animate",function(a){return{restrict:"EA",require:"ngSwitch",controller:["$scope",function(){this.cases={}}],link:function(c,d,e,g){var f=[],k=[],m=[],h=[];c.$watch(e.ngSwitch||e.on,function(d){var n,p;n=0;for(p=m.length;n<p;++n)m[n].remove();n=m.length=0;for(p=h.length;n<p;++n){var r=k[n];h[n].$destroy();m[n]=r;a.leave(r,function(){m.splice(n,1)})}k.length=0;h.length=
0;if(f=g.cases["!"+d]||g.cases["?"])c.$eval(e.change),q(f,function(d){var e=c.$new();h.push(e);d.transclude(e,function(c){var e=d.element;k.push(c);a.enter(c,e.parent(),e)})})})}}}],Bd=va({transclude:"element",priority:800,require:"^ngSwitch",link:function(a,c,d,e,g){e.cases["!"+d.ngSwitchWhen]=e.cases["!"+d.ngSwitchWhen]||[];e.cases["!"+d.ngSwitchWhen].push({transclude:g,element:c})}}),Cd=va({transclude:"element",priority:800,require:"^ngSwitch",link:function(a,c,d,e,g){e.cases["?"]=e.cases["?"]||
[];e.cases["?"].push({transclude:g,element:c})}}),Ed=va({link:function(a,c,d,e,g){if(!g)throw t("ngTransclude")("orphan",ga(c));g(function(a){c.empty();c.append(a)})}}),ed=["$templateCache",function(a){return{restrict:"E",terminal:!0,compile:function(c,d){"text/ng-template"==d.type&&a.put(d.id,c[0].text)}}}],Ue=t("ngOptions"),Dd=$({terminal:!0}),fd=["$compile","$parse",function(a,c){var d=/^\s*([\s\S]+?)(?:\s+as\s+([\s\S]+?))?(?:\s+group\s+by\s+([\s\S]+?))?\s+for\s+(?:([\$\w][\$\w]*)|(?:\(\s*([\$\w][\$\w]*)\s*,\s*([\$\w][\$\w]*)\s*\)))\s+in\s+([\s\S]+?)(?:\s+track\s+by\s+([\s\S]+?))?$/,
e={$setViewValue:y};return{restrict:"E",require:["select","?ngModel"],controller:["$element","$scope","$attrs",function(a,c,d){var m=this,h={},l=e,n;m.databound=d.ngModel;m.init=function(a,c,d){l=a;n=d};m.addOption=function(c){Aa(c,'"option value"');h[c]=!0;l.$viewValue==c&&(a.val(c),n.parent()&&n.remove())};m.removeOption=function(a){this.hasOption(a)&&(delete h[a],l.$viewValue==a&&this.renderUnknownOption(a))};m.renderUnknownOption=function(c){c="? "+Ja(c)+" ?";n.val(c);a.prepend(n);a.val(c);n.prop("selected",
!0)};m.hasOption=function(a){return h.hasOwnProperty(a)};c.$on("$destroy",function(){m.renderUnknownOption=y})}],link:function(e,f,k,m){function h(a,c,d,e){d.$render=function(){var a=d.$viewValue;e.hasOption(a)?(F.parent()&&F.remove(),c.val(a),""===a&&x.prop("selected",!0)):D(a)&&x?c.val(""):e.renderUnknownOption(a)};c.on("change",function(){a.$apply(function(){F.parent()&&F.remove();d.$setViewValue(c.val())})})}function l(a,c,d){var e;d.$render=function(){var a=new Ya(d.$viewValue);q(c.find("option"),
function(c){c.selected=B(a.get(c.value))})};a.$watch(function(){xa(e,d.$viewValue)||(e=ka(d.$viewValue),d.$render())});c.on("change",function(){a.$apply(function(){var a=[];q(c.find("option"),function(c){c.selected&&a.push(c.value)});d.$setViewValue(a)})})}function n(e,f,g){function k(){var a={"":[]},c=[""],d,h,s,t,v;t=g.$modelValue;v=w(e)||[];var D=n?Wb(v):v,F,K,A;K={};s=!1;var E,J;if(r)if(x&&O(t))for(s=new Ya([]),A=0;A<t.length;A++)K[m]=t[A],s.put(x(e,K),t[A]);else s=new Ya(t);for(A=0;F=D.length,
A<F;A++){h=A;if(n){h=D[A];if("$"===h.charAt(0))continue;K[n]=h}K[m]=v[h];d=p(e,K)||"";(h=a[d])||(h=a[d]=[],c.push(d));r?d=B(s.remove(x?x(e,K):q(e,K))):(x?(d={},d[m]=t,d=x(e,d)===x(e,K)):d=t===q(e,K),s=s||d);E=l(e,K);E=B(E)?E:"";h.push({id:x?x(e,K):n?D[A]:A,label:E,selected:d})}r||(y||null===t?a[""].unshift({id:"",label:"",selected:!s}):s||a[""].unshift({id:"?",label:"",selected:!0}));K=0;for(D=c.length;K<D;K++){d=c[K];h=a[d];z.length<=K?(t={element:C.clone().attr("label",d),label:h.label},v=[t],z.push(v),
f.append(t.element)):(v=z[K],t=v[0],t.label!=d&&t.element.attr("label",t.label=d));E=null;A=0;for(F=h.length;A<F;A++)s=h[A],(d=v[A+1])?(E=d.element,d.label!==s.label&&E.text(d.label=s.label),d.id!==s.id&&E.val(d.id=s.id),d.selected!==s.selected&&E.prop("selected",d.selected=s.selected)):(""===s.id&&y?J=y:(J=u.clone()).val(s.id).attr("selected",s.selected).text(s.label),v.push({element:J,label:s.label,id:s.id,selected:s.selected}),E?E.after(J):t.element.append(J),E=J);for(A++;v.length>A;)v.pop().element.remove()}for(;z.length>
K;)z.pop()[0].element.remove()}var h;if(!(h=t.match(d)))throw Ue("iexp",t,ga(f));var l=c(h[2]||h[1]),m=h[4]||h[6],n=h[5],p=c(h[3]||""),q=c(h[2]?h[1]:m),w=c(h[7]),x=h[8]?c(h[8]):null,z=[[{element:f,label:""}]];y&&(a(y)(e),y.removeClass("ng-scope"),y.remove());f.empty();f.on("change",function(){e.$apply(function(){var a,c=w(e)||[],d={},h,k,l,p,t,u,v;if(r)for(k=[],p=0,u=z.length;p<u;p++)for(a=z[p],l=1,t=a.length;l<t;l++){if((h=a[l].element)[0].selected){h=h.val();n&&(d[n]=h);if(x)for(v=0;v<c.length&&
(d[m]=c[v],x(e,d)!=h);v++);else d[m]=c[h];k.push(q(e,d))}}else{h=f.val();if("?"==h)k=s;else if(""===h)k=null;else if(x)for(v=0;v<c.length;v++){if(d[m]=c[v],x(e,d)==h){k=q(e,d);break}}else d[m]=c[h],n&&(d[n]=h),k=q(e,d);1<z[0].length&&z[0][1].id!==h&&(z[0][1].selected=!1)}g.$setViewValue(k)})});g.$render=k;e.$watch(k)}if(m[1]){var p=m[0];m=m[1];var r=k.multiple,t=k.ngOptions,y=!1,x,u=w(V.createElement("option")),C=w(V.createElement("optgroup")),F=u.clone();k=0;for(var z=f.children(),J=z.length;k<J;k++)if(""===
z[k].value){x=y=z.eq(k);break}p.init(m,y,F);r&&(m.$isEmpty=function(a){return!a||0===a.length});t?n(e,f,m):r?l(e,f,m):h(e,f,m,p)}}}}],hd=["$interpolate",function(a){var c={addOption:y,removeOption:y};return{restrict:"E",priority:100,compile:function(d,e){if(D(e.value)){var g=a(d.text(),!0);g||e.$set("value",d.text())}return function(a,d,e){var h=d.parent(),l=h.data("$selectController")||h.parent().data("$selectController");l&&l.databound?d.prop("selected",!1):l=c;g?a.$watch(g,function(a,c){e.$set("value",
a);a!==c&&l.removeOption(c);l.addOption(a)}):l.addOption(e.value);d.on("$destroy",function(){l.removeOption(e.value)})}}}}],gd=$({restrict:"E",terminal:!0});T.angular.bootstrap?console.log("WARNING: Tried to load angular more than once."):((Ba=T.jQuery)&&Ba.fn.on?(w=Ba,J(Ba.fn,{scope:Ka.scope,isolateScope:Ka.isolateScope,controller:Ka.controller,injector:Ka.injector,inheritedData:Ka.inheritedData}),Fb("remove",!0,!0,!1),Fb("empty",!1,!1,!1),Fb("html",!1,!1,!0)):w=R,Sa.element=w,Zc(Sa),w(V).ready(function(){Wc(V,
dc)}))})(window,document);!window.angular.$$csp()&&window.angular.element(document).find("head").prepend('<style type="text/css">@charset "UTF-8";[ng\\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide{display:none !important;}ng\\:form{display:block;}.ng-animate-block-transitions{transition:0s all!important;-webkit-transition:0s all!important;}.ng-hide-add-active,.ng-hide-remove{display:block!important;}</style>');
//# sourceMappingURL=angular.min.js.map

}).call(this,require("DF1urx"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../../node_modules/angular/lib/angular.min.js","/../../../../node_modules/angular/lib")
},{"DF1urx":10,"buffer":7}],7:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */

var base64 = require('base64-js')
var ieee754 = require('ieee754')

exports.Buffer = Buffer
exports.SlowBuffer = Buffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192

/**
 * If `Buffer._useTypedArrays`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (compatible down to IE6)
 */
Buffer._useTypedArrays = (function () {
  // Detect if browser supports Typed Arrays. Supported browsers are IE 10+, Firefox 4+,
  // Chrome 7+, Safari 5.1+, Opera 11.6+, iOS 4.2+. If the browser does not support adding
  // properties to `Uint8Array` instances, then that's the same as no `Uint8Array` support
  // because we need to be able to add all the node Buffer API methods. This is an issue
  // in Firefox 4-29. Now fixed: https://bugzilla.mozilla.org/show_bug.cgi?id=695438
  try {
    var buf = new ArrayBuffer(0)
    var arr = new Uint8Array(buf)
    arr.foo = function () { return 42 }
    return 42 === arr.foo() &&
        typeof arr.subarray === 'function' // Chrome 9-10 lack `subarray`
  } catch (e) {
    return false
  }
})()

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (subject, encoding, noZero) {
  if (!(this instanceof Buffer))
    return new Buffer(subject, encoding, noZero)

  var type = typeof subject

  // Workaround: node's base64 implementation allows for non-padded strings
  // while base64-js does not.
  if (encoding === 'base64' && type === 'string') {
    subject = stringtrim(subject)
    while (subject.length % 4 !== 0) {
      subject = subject + '='
    }
  }

  // Find the length
  var length
  if (type === 'number')
    length = coerce(subject)
  else if (type === 'string')
    length = Buffer.byteLength(subject, encoding)
  else if (type === 'object')
    length = coerce(subject.length) // assume that object is array-like
  else
    throw new Error('First argument needs to be a number, array or string.')

  var buf
  if (Buffer._useTypedArrays) {
    // Preferred: Return an augmented `Uint8Array` instance for best performance
    buf = Buffer._augment(new Uint8Array(length))
  } else {
    // Fallback: Return THIS instance of Buffer (created by `new`)
    buf = this
    buf.length = length
    buf._isBuffer = true
  }

  var i
  if (Buffer._useTypedArrays && typeof subject.byteLength === 'number') {
    // Speed optimization -- use set if we're copying from a typed array
    buf._set(subject)
  } else if (isArrayish(subject)) {
    // Treat array-ish objects as a byte array
    for (i = 0; i < length; i++) {
      if (Buffer.isBuffer(subject))
        buf[i] = subject.readUInt8(i)
      else
        buf[i] = subject[i]
    }
  } else if (type === 'string') {
    buf.write(subject, 0, encoding)
  } else if (type === 'number' && !Buffer._useTypedArrays && !noZero) {
    for (i = 0; i < length; i++) {
      buf[i] = 0
    }
  }

  return buf
}

// STATIC METHODS
// ==============

Buffer.isEncoding = function (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.isBuffer = function (b) {
  return !!(b !== null && b !== undefined && b._isBuffer)
}

Buffer.byteLength = function (str, encoding) {
  var ret
  str = str + ''
  switch (encoding || 'utf8') {
    case 'hex':
      ret = str.length / 2
      break
    case 'utf8':
    case 'utf-8':
      ret = utf8ToBytes(str).length
      break
    case 'ascii':
    case 'binary':
    case 'raw':
      ret = str.length
      break
    case 'base64':
      ret = base64ToBytes(str).length
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = str.length * 2
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.concat = function (list, totalLength) {
  assert(isArray(list), 'Usage: Buffer.concat(list, [totalLength])\n' +
      'list should be an Array.')

  if (list.length === 0) {
    return new Buffer(0)
  } else if (list.length === 1) {
    return list[0]
  }

  var i
  if (typeof totalLength !== 'number') {
    totalLength = 0
    for (i = 0; i < list.length; i++) {
      totalLength += list[i].length
    }
  }

  var buf = new Buffer(totalLength)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

// BUFFER INSTANCE METHODS
// =======================

function _hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  assert(strLen % 2 === 0, 'Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var byte = parseInt(string.substr(i * 2, 2), 16)
    assert(!isNaN(byte), 'Invalid hex string')
    buf[offset + i] = byte
  }
  Buffer._charsWritten = i * 2
  return i
}

function _utf8Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf8ToBytes(string), buf, offset, length)
  return charsWritten
}

function _asciiWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(asciiToBytes(string), buf, offset, length)
  return charsWritten
}

function _binaryWrite (buf, string, offset, length) {
  return _asciiWrite(buf, string, offset, length)
}

function _base64Write (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(base64ToBytes(string), buf, offset, length)
  return charsWritten
}

function _utf16leWrite (buf, string, offset, length) {
  var charsWritten = Buffer._charsWritten =
    blitBuffer(utf16leToBytes(string), buf, offset, length)
  return charsWritten
}

Buffer.prototype.write = function (string, offset, length, encoding) {
  // Support both (string, offset, length, encoding)
  // and the legacy (string, encoding, offset, length)
  if (isFinite(offset)) {
    if (!isFinite(length)) {
      encoding = length
      length = undefined
    }
  } else {  // legacy
    var swap = encoding
    encoding = offset
    offset = length
    length = swap
  }

  offset = Number(offset) || 0
  var remaining = this.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }
  encoding = String(encoding || 'utf8').toLowerCase()

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexWrite(this, string, offset, length)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Write(this, string, offset, length)
      break
    case 'ascii':
      ret = _asciiWrite(this, string, offset, length)
      break
    case 'binary':
      ret = _binaryWrite(this, string, offset, length)
      break
    case 'base64':
      ret = _base64Write(this, string, offset, length)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leWrite(this, string, offset, length)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toString = function (encoding, start, end) {
  var self = this

  encoding = String(encoding || 'utf8').toLowerCase()
  start = Number(start) || 0
  end = (end !== undefined)
    ? Number(end)
    : end = self.length

  // Fastpath empty strings
  if (end === start)
    return ''

  var ret
  switch (encoding) {
    case 'hex':
      ret = _hexSlice(self, start, end)
      break
    case 'utf8':
    case 'utf-8':
      ret = _utf8Slice(self, start, end)
      break
    case 'ascii':
      ret = _asciiSlice(self, start, end)
      break
    case 'binary':
      ret = _binarySlice(self, start, end)
      break
    case 'base64':
      ret = _base64Slice(self, start, end)
      break
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      ret = _utf16leSlice(self, start, end)
      break
    default:
      throw new Error('Unknown encoding')
  }
  return ret
}

Buffer.prototype.toJSON = function () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function (target, target_start, start, end) {
  var source = this

  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (!target_start) target_start = 0

  // Copy 0 bytes; we're done
  if (end === start) return
  if (target.length === 0 || source.length === 0) return

  // Fatal error conditions
  assert(end >= start, 'sourceEnd < sourceStart')
  assert(target_start >= 0 && target_start < target.length,
      'targetStart out of bounds')
  assert(start >= 0 && start < source.length, 'sourceStart out of bounds')
  assert(end >= 0 && end <= source.length, 'sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length)
    end = this.length
  if (target.length - target_start < end - start)
    end = target.length - target_start + start

  var len = end - start

  if (len < 100 || !Buffer._useTypedArrays) {
    for (var i = 0; i < len; i++)
      target[i + target_start] = this[i + start]
  } else {
    target._set(this.subarray(start, start + len), target_start)
  }
}

function _base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function _utf8Slice (buf, start, end) {
  var res = ''
  var tmp = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    if (buf[i] <= 0x7F) {
      res += decodeUtf8Char(tmp) + String.fromCharCode(buf[i])
      tmp = ''
    } else {
      tmp += '%' + buf[i].toString(16)
    }
  }

  return res + decodeUtf8Char(tmp)
}

function _asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++)
    ret += String.fromCharCode(buf[i])
  return ret
}

function _binarySlice (buf, start, end) {
  return _asciiSlice(buf, start, end)
}

function _hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function _utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i+1] * 256)
  }
  return res
}

Buffer.prototype.slice = function (start, end) {
  var len = this.length
  start = clamp(start, len, 0)
  end = clamp(end, len, len)

  if (Buffer._useTypedArrays) {
    return Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    var newBuf = new Buffer(sliceLen, undefined, true)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
    return newBuf
  }
}

// `get` will be removed in Node 0.13+
Buffer.prototype.get = function (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` will be removed in Node 0.13+
Buffer.prototype.set = function (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

Buffer.prototype.readUInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  return this[offset]
}

function _readUInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    val = buf[offset]
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
  } else {
    val = buf[offset] << 8
    if (offset + 1 < len)
      val |= buf[offset + 1]
  }
  return val
}

Buffer.prototype.readUInt16LE = function (offset, noAssert) {
  return _readUInt16(this, offset, true, noAssert)
}

Buffer.prototype.readUInt16BE = function (offset, noAssert) {
  return _readUInt16(this, offset, false, noAssert)
}

function _readUInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val
  if (littleEndian) {
    if (offset + 2 < len)
      val = buf[offset + 2] << 16
    if (offset + 1 < len)
      val |= buf[offset + 1] << 8
    val |= buf[offset]
    if (offset + 3 < len)
      val = val + (buf[offset + 3] << 24 >>> 0)
  } else {
    if (offset + 1 < len)
      val = buf[offset + 1] << 16
    if (offset + 2 < len)
      val |= buf[offset + 2] << 8
    if (offset + 3 < len)
      val |= buf[offset + 3]
    val = val + (buf[offset] << 24 >>> 0)
  }
  return val
}

Buffer.prototype.readUInt32LE = function (offset, noAssert) {
  return _readUInt32(this, offset, true, noAssert)
}

Buffer.prototype.readUInt32BE = function (offset, noAssert) {
  return _readUInt32(this, offset, false, noAssert)
}

Buffer.prototype.readInt8 = function (offset, noAssert) {
  if (!noAssert) {
    assert(offset !== undefined && offset !== null,
        'missing offset')
    assert(offset < this.length, 'Trying to read beyond buffer length')
  }

  if (offset >= this.length)
    return

  var neg = this[offset] & 0x80
  if (neg)
    return (0xff - this[offset] + 1) * -1
  else
    return this[offset]
}

function _readInt16 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt16(buf, offset, littleEndian, true)
  var neg = val & 0x8000
  if (neg)
    return (0xffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt16LE = function (offset, noAssert) {
  return _readInt16(this, offset, true, noAssert)
}

Buffer.prototype.readInt16BE = function (offset, noAssert) {
  return _readInt16(this, offset, false, noAssert)
}

function _readInt32 (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  var len = buf.length
  if (offset >= len)
    return

  var val = _readUInt32(buf, offset, littleEndian, true)
  var neg = val & 0x80000000
  if (neg)
    return (0xffffffff - val + 1) * -1
  else
    return val
}

Buffer.prototype.readInt32LE = function (offset, noAssert) {
  return _readInt32(this, offset, true, noAssert)
}

Buffer.prototype.readInt32BE = function (offset, noAssert) {
  return _readInt32(this, offset, false, noAssert)
}

function _readFloat (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 3 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 23, 4)
}

Buffer.prototype.readFloatLE = function (offset, noAssert) {
  return _readFloat(this, offset, true, noAssert)
}

Buffer.prototype.readFloatBE = function (offset, noAssert) {
  return _readFloat(this, offset, false, noAssert)
}

function _readDouble (buf, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset + 7 < buf.length, 'Trying to read beyond buffer length')
  }

  return ieee754.read(buf, offset, littleEndian, 52, 8)
}

Buffer.prototype.readDoubleLE = function (offset, noAssert) {
  return _readDouble(this, offset, true, noAssert)
}

Buffer.prototype.readDoubleBE = function (offset, noAssert) {
  return _readDouble(this, offset, false, noAssert)
}

Buffer.prototype.writeUInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'trying to write beyond buffer length')
    verifuint(value, 0xff)
  }

  if (offset >= this.length) return

  this[offset] = value
}

function _writeUInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 2); i < j; i++) {
    buf[offset + i] =
        (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
            (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt16BE = function (value, offset, noAssert) {
  _writeUInt16(this, value, offset, false, noAssert)
}

function _writeUInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'trying to write beyond buffer length')
    verifuint(value, 0xffffffff)
  }

  var len = buf.length
  if (offset >= len)
    return

  for (var i = 0, j = Math.min(len - offset, 4); i < j; i++) {
    buf[offset + i] =
        (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeUInt32BE = function (value, offset, noAssert) {
  _writeUInt32(this, value, offset, false, noAssert)
}

Buffer.prototype.writeInt8 = function (value, offset, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset < this.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7f, -0x80)
  }

  if (offset >= this.length)
    return

  if (value >= 0)
    this.writeUInt8(value, offset, noAssert)
  else
    this.writeUInt8(0xff + value + 1, offset, noAssert)
}

function _writeInt16 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 1 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fff, -0x8000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt16(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt16(buf, 0xffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt16LE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt16BE = function (value, offset, noAssert) {
  _writeInt16(this, value, offset, false, noAssert)
}

function _writeInt32 (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifsint(value, 0x7fffffff, -0x80000000)
  }

  var len = buf.length
  if (offset >= len)
    return

  if (value >= 0)
    _writeUInt32(buf, value, offset, littleEndian, noAssert)
  else
    _writeUInt32(buf, 0xffffffff + value + 1, offset, littleEndian, noAssert)
}

Buffer.prototype.writeInt32LE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, true, noAssert)
}

Buffer.prototype.writeInt32BE = function (value, offset, noAssert) {
  _writeInt32(this, value, offset, false, noAssert)
}

function _writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 3 < buf.length, 'Trying to write beyond buffer length')
    verifIEEE754(value, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 23, 4)
}

Buffer.prototype.writeFloatLE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function (value, offset, noAssert) {
  _writeFloat(this, value, offset, false, noAssert)
}

function _writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    assert(value !== undefined && value !== null, 'missing value')
    assert(typeof littleEndian === 'boolean', 'missing or invalid endian')
    assert(offset !== undefined && offset !== null, 'missing offset')
    assert(offset + 7 < buf.length,
        'Trying to write beyond buffer length')
    verifIEEE754(value, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }

  var len = buf.length
  if (offset >= len)
    return

  ieee754.write(buf, value, offset, littleEndian, 52, 8)
}

Buffer.prototype.writeDoubleLE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function (value, offset, noAssert) {
  _writeDouble(this, value, offset, false, noAssert)
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (typeof value === 'string') {
    value = value.charCodeAt(0)
  }

  assert(typeof value === 'number' && !isNaN(value), 'value is not a number')
  assert(end >= start, 'end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  assert(start >= 0 && start < this.length, 'start out of bounds')
  assert(end >= 0 && end <= this.length, 'end out of bounds')

  for (var i = start; i < end; i++) {
    this[i] = value
  }
}

Buffer.prototype.inspect = function () {
  var out = []
  var len = this.length
  for (var i = 0; i < len; i++) {
    out[i] = toHex(this[i])
    if (i === exports.INSPECT_MAX_BYTES) {
      out[i + 1] = '...'
      break
    }
  }
  return '<Buffer ' + out.join(' ') + '>'
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer._useTypedArrays) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1)
        buf[i] = this[i]
      return buf.buffer
    }
  } else {
    throw new Error('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function (arr) {
  arr._isBuffer = true

  // save reference to original Uint8Array get/set methods before overwriting
  arr._get = arr.get
  arr._set = arr.set

  // deprecated, will be removed in node 0.13+
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

// slice(start, end)
function clamp (index, len, defaultValue) {
  if (typeof index !== 'number') return defaultValue
  index = ~~index;  // Coerce to integer.
  if (index >= len) return len
  if (index >= 0) return index
  index += len
  if (index >= 0) return index
  return 0
}

function coerce (length) {
  // Coerce length to a number (possibly NaN), round up
  // in case it's fractional (e.g. 123.456) then do a
  // double negate to coerce a NaN to 0. Easy, right?
  length = ~~Math.ceil(+length)
  return length < 0 ? 0 : length
}

function isArray (subject) {
  return (Array.isArray || function (subject) {
    return Object.prototype.toString.call(subject) === '[object Array]'
  })(subject)
}

function isArrayish (subject) {
  return isArray(subject) || Buffer.isBuffer(subject) ||
      subject && typeof subject === 'object' &&
      typeof subject.length === 'number'
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    var b = str.charCodeAt(i)
    if (b <= 0x7F)
      byteArray.push(str.charCodeAt(i))
    else {
      var start = i
      if (b >= 0xD800 && b <= 0xDFFF) i++
      var h = encodeURIComponent(str.slice(start, i+1)).substr(1).split('%')
      for (var j = 0; j < h.length; j++)
        byteArray.push(parseInt(h[j], 16))
    }
  }
  return byteArray
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(str)
}

function blitBuffer (src, dst, offset, length) {
  var pos
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length))
      break
    dst[i + offset] = src[i]
  }
  return i
}

function decodeUtf8Char (str) {
  try {
    return decodeURIComponent(str)
  } catch (err) {
    return String.fromCharCode(0xFFFD) // UTF 8 invalid char
  }
}

/*
 * We have to make sure that the value is a valid integer. This means that it
 * is non-negative. It has no fractional component and that it does not
 * exceed the maximum allowed value.
 */
function verifuint (value, max) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value >= 0, 'specified a negative value for writing an unsigned value')
  assert(value <= max, 'value is larger than maximum value for type')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifsint (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
  assert(Math.floor(value) === value, 'value has a fractional component')
}

function verifIEEE754 (value, max, min) {
  assert(typeof value === 'number', 'cannot write a non-number as a number')
  assert(value <= max, 'value larger than maximum allowed value')
  assert(value >= min, 'value smaller than minimum allowed value')
}

function assert (test, message) {
  if (!test) throw new Error(message || 'Failed assertion')
}

}).call(this,require("DF1urx"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/index.js","/../../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer")
},{"DF1urx":10,"base64-js":8,"buffer":7,"ieee754":9}],8:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS)
			return 62 // '+'
		if (code === SLASH)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

}).call(this,require("DF1urx"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/base64-js/lib/b64.js","/../../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/base64-js/lib")
},{"DF1urx":10,"buffer":7}],9:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
exports.read = function(buffer, offset, isLE, mLen, nBytes) {
  var e, m,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      nBits = -7,
      i = isLE ? (nBytes - 1) : 0,
      d = isLE ? -1 : 1,
      s = buffer[offset + i];

  i += d;

  e = s & ((1 << (-nBits)) - 1);
  s >>= (-nBits);
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8);

  m = e & ((1 << (-nBits)) - 1);
  e >>= (-nBits);
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8);

  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity);
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
};

exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c,
      eLen = nBytes * 8 - mLen - 1,
      eMax = (1 << eLen) - 1,
      eBias = eMax >> 1,
      rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0),
      i = isLE ? 0 : (nBytes - 1),
      d = isLE ? 1 : -1,
      s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0;

  value = Math.abs(value);

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }

    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8);

  e = (e << mLen) | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8);

  buffer[offset + i - d] |= s * 128;
};

}).call(this,require("DF1urx"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/ieee754/index.js","/../../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/buffer/node_modules/ieee754")
},{"DF1urx":10,"buffer":7}],10:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

}).call(this,require("DF1urx"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/process/browser.js","/../../../../node_modules/gulp-browserify/node_modules/browserify/node_modules/process")
},{"DF1urx":10,"buffer":7}]},{},[3])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZXJpYy9Db2RlL1NoYXJlZC9hbmd1bGFyLXRlc3Qvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2VyaWMvQ29kZS9TaGFyZWQvYW5ndWxhci10ZXN0L2FwcC9hc3NldHMvanMvYXBwL2NvbnRyb2xsZXJzL21haW4uanMiLCIvVXNlcnMvZXJpYy9Db2RlL1NoYXJlZC9hbmd1bGFyLXRlc3QvYXBwL2Fzc2V0cy9qcy9hcHAvY29udHJvbGxlcnMvcG9zdHMuanMiLCIvVXNlcnMvZXJpYy9Db2RlL1NoYXJlZC9hbmd1bGFyLXRlc3QvYXBwL2Fzc2V0cy9qcy9hcHAvZmFrZV9mMDVmODkwYy5qcyIsIi9Vc2Vycy9lcmljL0NvZGUvU2hhcmVkL2FuZ3VsYXItdGVzdC9ub2RlX21vZHVsZXMvYW5ndWxhci11aS1yb3V0ZXIvcmVsZWFzZS9hbmd1bGFyLXVpLXJvdXRlci5qcyIsIi9Vc2Vycy9lcmljL0NvZGUvU2hhcmVkL2FuZ3VsYXItdGVzdC9ub2RlX21vZHVsZXMvYW5ndWxhci9pbmRleC1icm93c2VyaWZ5LmpzIiwiL1VzZXJzL2VyaWMvQ29kZS9TaGFyZWQvYW5ndWxhci10ZXN0L25vZGVfbW9kdWxlcy9hbmd1bGFyL2xpYi9hbmd1bGFyLm1pbi5qcyIsIi9Vc2Vycy9lcmljL0NvZGUvU2hhcmVkL2FuZ3VsYXItdGVzdC9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvaW5kZXguanMiLCIvVXNlcnMvZXJpYy9Db2RlL1NoYXJlZC9hbmd1bGFyLXRlc3Qvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliL2I2NC5qcyIsIi9Vc2Vycy9lcmljL0NvZGUvU2hhcmVkL2FuZ3VsYXItdGVzdC9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanMiLCIvVXNlcnMvZXJpYy9Db2RlL1NoYXJlZC9hbmd1bGFyLXRlc3Qvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDekJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4cEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdk5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdmxDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpfXZhciBmPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChmLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGYsZi5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRzY29wZSkge1xuICAgICRzY29wZS50ZXN0VmFyID0gJ1dlIGFyZSB1cCBhbmQgcnVubmluZyEnO1xufTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJERjF1cnhcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9jb250cm9sbGVycy9tYWluLmpzXCIsXCIvY29udHJvbGxlcnNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgUG9zdHNDdHJsID0gZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCkge1xuICAgICRodHRwLmdldCgnYXBpL3Bvc3RzJykuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICRzY29wZS5wb3N0cyA9IGRhdGE7XG4gICAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBvc3RzQ3RybDtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJERjF1cnhcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9jb250cm9sbGVycy9wb3N0cy5qc1wiLFwiL2NvbnRyb2xsZXJzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xucmVxdWlyZSgnYW5ndWxhcicpO1xudmFyIHJvdXRlciA9IHJlcXVpcmUoJ2FuZ3VsYXItdWktcm91dGVyJyk7XG5cbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgW3JvdXRlcl0pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcblxuICAgIC8vIEZvciBhbnkgdW5tYXRjaGVkIHVybCwgcmVkaXJlY3QgdG8gaG9tZSAvXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZShcIi9cIik7XG5cbiAgICAvLyBOb3cgc2V0IHVwIHRoZSBzdGF0ZXNcbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAuc3RhdGUoJ2hvbWUnLCB7XG4gICAgICAgICAgICB1cmw6IFwiL1wiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9ob21lLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogcmVxdWlyZSgnLi9jb250cm9sbGVycy9tYWluJylcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdwb3N0cycsIHtcbiAgICAgICAgICAgIHVybDogXCIvcG9zdHNcIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3Bvc3RzLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4vY29udHJvbGxlcnMvcG9zdHMnKVxuICAgICAgICB9KVxufSk7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiREYxdXJ4XCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvZmFrZV9mMDVmODkwYy5qc1wiLFwiL1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qKlxuICogU3RhdGUtYmFzZWQgcm91dGluZyBmb3IgQW5ndWxhckpTXG4gKiBAdmVyc2lvbiB2MC4yLjEwXG4gKiBAbGluayBodHRwOi8vYW5ndWxhci11aS5naXRodWIuY29tL1xuICogQGxpY2Vuc2UgTUlUIExpY2Vuc2UsIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvTUlUXG4gKi9cblxuLyogY29tbW9uanMgcGFja2FnZSBtYW5hZ2VyIHN1cHBvcnQgKGVnIGNvbXBvbmVudGpzKSAqL1xuaWYgKHR5cGVvZiBtb2R1bGUgIT09IFwidW5kZWZpbmVkXCIgJiYgdHlwZW9mIGV4cG9ydHMgIT09IFwidW5kZWZpbmVkXCIgJiYgbW9kdWxlLmV4cG9ydHMgPT09IGV4cG9ydHMpe1xuICBtb2R1bGUuZXhwb3J0cyA9ICd1aS5yb3V0ZXInO1xufVxuXG4oZnVuY3Rpb24gKHdpbmRvdywgYW5ndWxhciwgdW5kZWZpbmVkKSB7XG4vKmpzaGludCBnbG9iYWxzdHJpY3Q6dHJ1ZSovXG4vKmdsb2JhbCBhbmd1bGFyOmZhbHNlKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIGlzRGVmaW5lZCA9IGFuZ3VsYXIuaXNEZWZpbmVkLFxuICAgIGlzRnVuY3Rpb24gPSBhbmd1bGFyLmlzRnVuY3Rpb24sXG4gICAgaXNTdHJpbmcgPSBhbmd1bGFyLmlzU3RyaW5nLFxuICAgIGlzT2JqZWN0ID0gYW5ndWxhci5pc09iamVjdCxcbiAgICBpc0FycmF5ID0gYW5ndWxhci5pc0FycmF5LFxuICAgIGZvckVhY2ggPSBhbmd1bGFyLmZvckVhY2gsXG4gICAgZXh0ZW5kID0gYW5ndWxhci5leHRlbmQsXG4gICAgY29weSA9IGFuZ3VsYXIuY29weTtcblxuZnVuY3Rpb24gaW5oZXJpdChwYXJlbnQsIGV4dHJhKSB7XG4gIHJldHVybiBleHRlbmQobmV3IChleHRlbmQoZnVuY3Rpb24oKSB7fSwgeyBwcm90b3R5cGU6IHBhcmVudCB9KSkoKSwgZXh0cmEpO1xufVxuXG5mdW5jdGlvbiBtZXJnZShkc3QpIHtcbiAgZm9yRWFjaChhcmd1bWVudHMsIGZ1bmN0aW9uKG9iaikge1xuICAgIGlmIChvYmogIT09IGRzdCkge1xuICAgICAgZm9yRWFjaChvYmosIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgaWYgKCFkc3QuaGFzT3duUHJvcGVydHkoa2V5KSkgZHN0W2tleV0gPSB2YWx1ZTtcbiAgICAgIH0pO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiBkc3Q7XG59XG5cbi8qKlxuICogRmluZHMgdGhlIGNvbW1vbiBhbmNlc3RvciBwYXRoIGJldHdlZW4gdHdvIHN0YXRlcy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gZmlyc3QgVGhlIGZpcnN0IHN0YXRlLlxuICogQHBhcmFtIHtPYmplY3R9IHNlY29uZCBUaGUgc2Vjb25kIHN0YXRlLlxuICogQHJldHVybiB7QXJyYXl9IFJldHVybnMgYW4gYXJyYXkgb2Ygc3RhdGUgbmFtZXMgaW4gZGVzY2VuZGluZyBvcmRlciwgbm90IGluY2x1ZGluZyB0aGUgcm9vdC5cbiAqL1xuZnVuY3Rpb24gYW5jZXN0b3JzKGZpcnN0LCBzZWNvbmQpIHtcbiAgdmFyIHBhdGggPSBbXTtcblxuICBmb3IgKHZhciBuIGluIGZpcnN0LnBhdGgpIHtcbiAgICBpZiAoZmlyc3QucGF0aFtuXSAhPT0gc2Vjb25kLnBhdGhbbl0pIGJyZWFrO1xuICAgIHBhdGgucHVzaChmaXJzdC5wYXRoW25dKTtcbiAgfVxuICByZXR1cm4gcGF0aDtcbn1cblxuLyoqXG4gKiBJRTgtc2FmZSB3cmFwcGVyIGZvciBgT2JqZWN0LmtleXMoKWAuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCBBIEphdmFTY3JpcHQgb2JqZWN0LlxuICogQHJldHVybiB7QXJyYXl9IFJldHVybnMgdGhlIGtleXMgb2YgdGhlIG9iamVjdCBhcyBhbiBhcnJheS5cbiAqL1xuZnVuY3Rpb24ga2V5cyhvYmplY3QpIHtcbiAgaWYgKE9iamVjdC5rZXlzKSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKG9iamVjdCk7XG4gIH1cbiAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gIGFuZ3VsYXIuZm9yRWFjaChvYmplY3QsIGZ1bmN0aW9uKHZhbCwga2V5KSB7XG4gICAgcmVzdWx0LnB1c2goa2V5KTtcbiAgfSk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbi8qKlxuICogSUU4LXNhZmUgd3JhcHBlciBmb3IgYEFycmF5LnByb3RvdHlwZS5pbmRleE9mKClgLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGFycmF5IEEgSmF2YVNjcmlwdCBhcnJheS5cbiAqIEBwYXJhbSB7Kn0gdmFsdWUgQSB2YWx1ZSB0byBzZWFyY2ggdGhlIGFycmF5IGZvci5cbiAqIEByZXR1cm4ge051bWJlcn0gUmV0dXJucyB0aGUgYXJyYXkgaW5kZXggdmFsdWUgb2YgYHZhbHVlYCwgb3IgYC0xYCBpZiBub3QgcHJlc2VudC5cbiAqL1xuZnVuY3Rpb24gYXJyYXlTZWFyY2goYXJyYXksIHZhbHVlKSB7XG4gIGlmIChBcnJheS5wcm90b3R5cGUuaW5kZXhPZikge1xuICAgIHJldHVybiBhcnJheS5pbmRleE9mKHZhbHVlLCBOdW1iZXIoYXJndW1lbnRzWzJdKSB8fCAwKTtcbiAgfVxuICB2YXIgbGVuID0gYXJyYXkubGVuZ3RoID4+PiAwLCBmcm9tID0gTnVtYmVyKGFyZ3VtZW50c1syXSkgfHwgMDtcbiAgZnJvbSA9IChmcm9tIDwgMCkgPyBNYXRoLmNlaWwoZnJvbSkgOiBNYXRoLmZsb29yKGZyb20pO1xuXG4gIGlmIChmcm9tIDwgMCkgZnJvbSArPSBsZW47XG5cbiAgZm9yICg7IGZyb20gPCBsZW47IGZyb20rKykge1xuICAgIGlmIChmcm9tIGluIGFycmF5ICYmIGFycmF5W2Zyb21dID09PSB2YWx1ZSkgcmV0dXJuIGZyb207XG4gIH1cbiAgcmV0dXJuIC0xO1xufVxuXG4vKipcbiAqIE1lcmdlcyBhIHNldCBvZiBwYXJhbWV0ZXJzIHdpdGggYWxsIHBhcmFtZXRlcnMgaW5oZXJpdGVkIGJldHdlZW4gdGhlIGNvbW1vbiBwYXJlbnRzIG9mIHRoZVxuICogY3VycmVudCBzdGF0ZSBhbmQgYSBnaXZlbiBkZXN0aW5hdGlvbiBzdGF0ZS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gY3VycmVudFBhcmFtcyBUaGUgdmFsdWUgb2YgdGhlIGN1cnJlbnQgc3RhdGUgcGFyYW1ldGVycyAoJHN0YXRlUGFyYW1zKS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBuZXdQYXJhbXMgVGhlIHNldCBvZiBwYXJhbWV0ZXJzIHdoaWNoIHdpbGwgYmUgY29tcG9zaXRlZCB3aXRoIGluaGVyaXRlZCBwYXJhbXMuXG4gKiBAcGFyYW0ge09iamVjdH0gJGN1cnJlbnQgSW50ZXJuYWwgZGVmaW5pdGlvbiBvZiBvYmplY3QgcmVwcmVzZW50aW5nIHRoZSBjdXJyZW50IHN0YXRlLlxuICogQHBhcmFtIHtPYmplY3R9ICR0byBJbnRlcm5hbCBkZWZpbml0aW9uIG9mIG9iamVjdCByZXByZXNlbnRpbmcgc3RhdGUgdG8gdHJhbnNpdGlvbiB0by5cbiAqL1xuZnVuY3Rpb24gaW5oZXJpdFBhcmFtcyhjdXJyZW50UGFyYW1zLCBuZXdQYXJhbXMsICRjdXJyZW50LCAkdG8pIHtcbiAgdmFyIHBhcmVudHMgPSBhbmNlc3RvcnMoJGN1cnJlbnQsICR0byksIHBhcmVudFBhcmFtcywgaW5oZXJpdGVkID0ge30sIGluaGVyaXRMaXN0ID0gW107XG5cbiAgZm9yICh2YXIgaSBpbiBwYXJlbnRzKSB7XG4gICAgaWYgKCFwYXJlbnRzW2ldLnBhcmFtcyB8fCAhcGFyZW50c1tpXS5wYXJhbXMubGVuZ3RoKSBjb250aW51ZTtcbiAgICBwYXJlbnRQYXJhbXMgPSBwYXJlbnRzW2ldLnBhcmFtcztcblxuICAgIGZvciAodmFyIGogaW4gcGFyZW50UGFyYW1zKSB7XG4gICAgICBpZiAoYXJyYXlTZWFyY2goaW5oZXJpdExpc3QsIHBhcmVudFBhcmFtc1tqXSkgPj0gMCkgY29udGludWU7XG4gICAgICBpbmhlcml0TGlzdC5wdXNoKHBhcmVudFBhcmFtc1tqXSk7XG4gICAgICBpbmhlcml0ZWRbcGFyZW50UGFyYW1zW2pdXSA9IGN1cnJlbnRQYXJhbXNbcGFyZW50UGFyYW1zW2pdXTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGV4dGVuZCh7fSwgaW5oZXJpdGVkLCBuZXdQYXJhbXMpO1xufVxuXG4vKipcbiAqIE5vcm1hbGl6ZXMgYSBzZXQgb2YgdmFsdWVzIHRvIHN0cmluZyBvciBgbnVsbGAsIGZpbHRlcmluZyB0aGVtIGJ5IGEgbGlzdCBvZiBrZXlzLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGtleXMgVGhlIGxpc3Qgb2Yga2V5cyB0byBub3JtYWxpemUvcmV0dXJuLlxuICogQHBhcmFtIHtPYmplY3R9IHZhbHVlcyBBbiBvYmplY3QgaGFzaCBvZiB2YWx1ZXMgdG8gbm9ybWFsaXplLlxuICogQHJldHVybiB7T2JqZWN0fSBSZXR1cm5zIGFuIG9iamVjdCBoYXNoIG9mIG5vcm1hbGl6ZWQgc3RyaW5nIHZhbHVlcy5cbiAqL1xuZnVuY3Rpb24gbm9ybWFsaXplKGtleXMsIHZhbHVlcykge1xuICB2YXIgbm9ybWFsaXplZCA9IHt9O1xuXG4gIGZvckVhY2goa2V5cywgZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB2YXIgdmFsdWUgPSB2YWx1ZXNbbmFtZV07XG4gICAgbm9ybWFsaXplZFtuYW1lXSA9ICh2YWx1ZSAhPSBudWxsKSA/IFN0cmluZyh2YWx1ZSkgOiBudWxsO1xuICB9KTtcbiAgcmV0dXJuIG5vcm1hbGl6ZWQ7XG59XG5cbi8qKlxuICogUGVyZm9ybXMgYSBub24tc3RyaWN0IGNvbXBhcmlzb24gb2YgdGhlIHN1YnNldCBvZiB0d28gb2JqZWN0cywgZGVmaW5lZCBieSBhIGxpc3Qgb2Yga2V5cy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYSBUaGUgZmlyc3Qgb2JqZWN0LlxuICogQHBhcmFtIHtPYmplY3R9IGIgVGhlIHNlY29uZCBvYmplY3QuXG4gKiBAcGFyYW0ge0FycmF5fSBrZXlzIFRoZSBsaXN0IG9mIGtleXMgd2l0aGluIGVhY2ggb2JqZWN0IHRvIGNvbXBhcmUuIElmIHRoZSBsaXN0IGlzIGVtcHR5IG9yIG5vdCBzcGVjaWZpZWQsXG4gKiAgICAgICAgICAgICAgICAgICAgIGl0IGRlZmF1bHRzIHRvIHRoZSBsaXN0IG9mIGtleXMgaW4gYGFgLlxuICogQHJldHVybiB7Qm9vbGVhbn0gUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIGtleXMgbWF0Y2gsIG90aGVyd2lzZSBgZmFsc2VgLlxuICovXG5mdW5jdGlvbiBlcXVhbEZvcktleXMoYSwgYiwga2V5cykge1xuICBpZiAoIWtleXMpIHtcbiAgICBrZXlzID0gW107XG4gICAgZm9yICh2YXIgbiBpbiBhKSBrZXlzLnB1c2gobik7IC8vIFVzZWQgaW5zdGVhZCBvZiBPYmplY3Qua2V5cygpIGZvciBJRTggY29tcGF0aWJpbGl0eVxuICB9XG5cbiAgZm9yICh2YXIgaT0wOyBpPGtleXMubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgayA9IGtleXNbaV07XG4gICAgaWYgKGFba10gIT0gYltrXSkgcmV0dXJuIGZhbHNlOyAvLyBOb3QgJz09PScsIHZhbHVlcyBhcmVuJ3QgbmVjZXNzYXJpbHkgbm9ybWFsaXplZFxuICB9XG4gIHJldHVybiB0cnVlO1xufVxuXG4vKipcbiAqIFJldHVybnMgdGhlIHN1YnNldCBvZiBhbiBvYmplY3QsIGJhc2VkIG9uIGEgbGlzdCBvZiBrZXlzLlxuICpcbiAqIEBwYXJhbSB7QXJyYXl9IGtleXNcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZXNcbiAqIEByZXR1cm4ge0Jvb2xlYW59IFJldHVybnMgYSBzdWJzZXQgb2YgYHZhbHVlc2AuXG4gKi9cbmZ1bmN0aW9uIGZpbHRlckJ5S2V5cyhrZXlzLCB2YWx1ZXMpIHtcbiAgdmFyIGZpbHRlcmVkID0ge307XG5cbiAgZm9yRWFjaChrZXlzLCBmdW5jdGlvbiAobmFtZSkge1xuICAgIGZpbHRlcmVkW25hbWVdID0gdmFsdWVzW25hbWVdO1xuICB9KTtcbiAgcmV0dXJuIGZpbHRlcmVkO1xufVxuLyoqXG4gKiBAbmdkb2Mgb3ZlcnZpZXdcbiAqIEBuYW1lIHVpLnJvdXRlci51dGlsXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiAjIHVpLnJvdXRlci51dGlsIHN1Yi1tb2R1bGVcbiAqXG4gKiBUaGlzIG1vZHVsZSBpcyBhIGRlcGVuZGVuY3kgb2Ygb3RoZXIgc3ViLW1vZHVsZXMuIERvIG5vdCBpbmNsdWRlIHRoaXMgbW9kdWxlIGFzIGEgZGVwZW5kZW5jeVxuICogaW4geW91ciBhbmd1bGFyIGFwcCAodXNlIHtAbGluayB1aS5yb3V0ZXJ9IG1vZHVsZSBpbnN0ZWFkKS5cbiAqXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCd1aS5yb3V0ZXIudXRpbCcsIFsnbmcnXSk7XG5cbi8qKlxuICogQG5nZG9jIG92ZXJ2aWV3XG4gKiBAbmFtZSB1aS5yb3V0ZXIucm91dGVyXG4gKiBcbiAqIEByZXF1aXJlcyB1aS5yb3V0ZXIudXRpbFxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogIyB1aS5yb3V0ZXIucm91dGVyIHN1Yi1tb2R1bGVcbiAqXG4gKiBUaGlzIG1vZHVsZSBpcyBhIGRlcGVuZGVuY3kgb2Ygb3RoZXIgc3ViLW1vZHVsZXMuIERvIG5vdCBpbmNsdWRlIHRoaXMgbW9kdWxlIGFzIGEgZGVwZW5kZW5jeVxuICogaW4geW91ciBhbmd1bGFyIGFwcCAodXNlIHtAbGluayB1aS5yb3V0ZXJ9IG1vZHVsZSBpbnN0ZWFkKS5cbiAqL1xuYW5ndWxhci5tb2R1bGUoJ3VpLnJvdXRlci5yb3V0ZXInLCBbJ3VpLnJvdXRlci51dGlsJ10pO1xuXG4vKipcbiAqIEBuZ2RvYyBvdmVydmlld1xuICogQG5hbWUgdWkucm91dGVyLnN0YXRlXG4gKiBcbiAqIEByZXF1aXJlcyB1aS5yb3V0ZXIucm91dGVyXG4gKiBAcmVxdWlyZXMgdWkucm91dGVyLnV0aWxcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqICMgdWkucm91dGVyLnN0YXRlIHN1Yi1tb2R1bGVcbiAqXG4gKiBUaGlzIG1vZHVsZSBpcyBhIGRlcGVuZGVuY3kgb2YgdGhlIG1haW4gdWkucm91dGVyIG1vZHVsZS4gRG8gbm90IGluY2x1ZGUgdGhpcyBtb2R1bGUgYXMgYSBkZXBlbmRlbmN5XG4gKiBpbiB5b3VyIGFuZ3VsYXIgYXBwICh1c2Uge0BsaW5rIHVpLnJvdXRlcn0gbW9kdWxlIGluc3RlYWQpLlxuICogXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCd1aS5yb3V0ZXIuc3RhdGUnLCBbJ3VpLnJvdXRlci5yb3V0ZXInLCAndWkucm91dGVyLnV0aWwnXSk7XG5cbi8qKlxuICogQG5nZG9jIG92ZXJ2aWV3XG4gKiBAbmFtZSB1aS5yb3V0ZXJcbiAqXG4gKiBAcmVxdWlyZXMgdWkucm91dGVyLnN0YXRlXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiAjIHVpLnJvdXRlclxuICogXG4gKiAjIyBUaGUgbWFpbiBtb2R1bGUgZm9yIHVpLnJvdXRlciBcbiAqIFRoZXJlIGFyZSBzZXZlcmFsIHN1Yi1tb2R1bGVzIGluY2x1ZGVkIHdpdGggdGhlIHVpLnJvdXRlciBtb2R1bGUsIGhvd2V2ZXIgb25seSB0aGlzIG1vZHVsZSBpcyBuZWVkZWRcbiAqIGFzIGEgZGVwZW5kZW5jeSB3aXRoaW4geW91ciBhbmd1bGFyIGFwcC4gVGhlIG90aGVyIG1vZHVsZXMgYXJlIGZvciBvcmdhbml6YXRpb24gcHVycG9zZXMuIFxuICpcbiAqIFRoZSBtb2R1bGVzIGFyZTpcbiAqICogdWkucm91dGVyIC0gdGhlIG1haW4gXCJ1bWJyZWxsYVwiIG1vZHVsZVxuICogKiB1aS5yb3V0ZXIucm91dGVyIC0gXG4gKiBcbiAqICpZb3UnbGwgbmVlZCB0byBpbmNsdWRlICoqb25seSoqIHRoaXMgbW9kdWxlIGFzIHRoZSBkZXBlbmRlbmN5IHdpdGhpbiB5b3VyIGFuZ3VsYXIgYXBwLipcbiAqIFxuICogPHByZT5cbiAqIDwhZG9jdHlwZSBodG1sPlxuICogPGh0bWwgbmctYXBwPVwibXlBcHBcIj5cbiAqIDxoZWFkPlxuICogICA8c2NyaXB0IHNyYz1cImpzL2FuZ3VsYXIuanNcIj48L3NjcmlwdD5cbiAqICAgPCEtLSBJbmNsdWRlIHRoZSB1aS1yb3V0ZXIgc2NyaXB0IC0tPlxuICogICA8c2NyaXB0IHNyYz1cImpzL2FuZ3VsYXItdWktcm91dGVyLm1pbi5qc1wiPjwvc2NyaXB0PlxuICogICA8c2NyaXB0PlxuICogICAgIC8vIC4uLmFuZCBhZGQgJ3VpLnJvdXRlcicgYXMgYSBkZXBlbmRlbmN5XG4gKiAgICAgdmFyIG15QXBwID0gYW5ndWxhci5tb2R1bGUoJ215QXBwJywgWyd1aS5yb3V0ZXInXSk7XG4gKiAgIDwvc2NyaXB0PlxuICogPC9oZWFkPlxuICogPGJvZHk+XG4gKiA8L2JvZHk+XG4gKiA8L2h0bWw+XG4gKiA8L3ByZT5cbiAqL1xuYW5ndWxhci5tb2R1bGUoJ3VpLnJvdXRlcicsIFsndWkucm91dGVyLnN0YXRlJ10pO1xuXG5hbmd1bGFyLm1vZHVsZSgndWkucm91dGVyLmNvbXBhdCcsIFsndWkucm91dGVyJ10pO1xuXG4vKipcbiAqIEBuZ2RvYyBvYmplY3RcbiAqIEBuYW1lIHVpLnJvdXRlci51dGlsLiRyZXNvbHZlXG4gKlxuICogQHJlcXVpcmVzICRxXG4gKiBAcmVxdWlyZXMgJGluamVjdG9yXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBNYW5hZ2VzIHJlc29sdXRpb24gb2YgKGFjeWNsaWMpIGdyYXBocyBvZiBwcm9taXNlcy5cbiAqL1xuJFJlc29sdmUuJGluamVjdCA9IFsnJHEnLCAnJGluamVjdG9yJ107XG5mdW5jdGlvbiAkUmVzb2x2ZSggICRxLCAgICAkaW5qZWN0b3IpIHtcbiAgXG4gIHZhciBWSVNJVF9JTl9QUk9HUkVTUyA9IDEsXG4gICAgICBWSVNJVF9ET05FID0gMixcbiAgICAgIE5PVEhJTkcgPSB7fSxcbiAgICAgIE5PX0RFUEVOREVOQ0lFUyA9IFtdLFxuICAgICAgTk9fTE9DQUxTID0gTk9USElORyxcbiAgICAgIE5PX1BBUkVOVCA9IGV4dGVuZCgkcS53aGVuKE5PVEhJTkcpLCB7ICQkcHJvbWlzZXM6IE5PVEhJTkcsICQkdmFsdWVzOiBOT1RISU5HIH0pO1xuICBcblxuICAvKipcbiAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAqIEBuYW1lIHVpLnJvdXRlci51dGlsLiRyZXNvbHZlI3N0dWR5XG4gICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIudXRpbC4kcmVzb2x2ZVxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogU3R1ZGllcyBhIHNldCBvZiBpbnZvY2FibGVzIHRoYXQgYXJlIGxpa2VseSB0byBiZSB1c2VkIG11bHRpcGxlIHRpbWVzLlxuICAgKiA8cHJlPlxuICAgKiAkcmVzb2x2ZS5zdHVkeShpbnZvY2FibGVzKShsb2NhbHMsIHBhcmVudCwgc2VsZilcbiAgICogPC9wcmU+XG4gICAqIGlzIGVxdWl2YWxlbnQgdG9cbiAgICogPHByZT5cbiAgICogJHJlc29sdmUucmVzb2x2ZShpbnZvY2FibGVzLCBsb2NhbHMsIHBhcmVudCwgc2VsZilcbiAgICogPC9wcmU+XG4gICAqIGJ1dCB0aGUgZm9ybWVyIGlzIG1vcmUgZWZmaWNpZW50IChpbiBmYWN0IGByZXNvbHZlYCBqdXN0IGNhbGxzIGBzdHVkeWAgXG4gICAqIGludGVybmFsbHkpLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gaW52b2NhYmxlcyBJbnZvY2FibGUgb2JqZWN0c1xuICAgKiBAcmV0dXJuIHtmdW5jdGlvbn0gYSBmdW5jdGlvbiB0byBwYXNzIGluIGxvY2FscywgcGFyZW50IGFuZCBzZWxmXG4gICAqL1xuICB0aGlzLnN0dWR5ID0gZnVuY3Rpb24gKGludm9jYWJsZXMpIHtcbiAgICBpZiAoIWlzT2JqZWN0KGludm9jYWJsZXMpKSB0aHJvdyBuZXcgRXJyb3IoXCInaW52b2NhYmxlcycgbXVzdCBiZSBhbiBvYmplY3RcIik7XG4gICAgXG4gICAgLy8gUGVyZm9ybSBhIHRvcG9sb2dpY2FsIHNvcnQgb2YgaW52b2NhYmxlcyB0byBidWlsZCBhbiBvcmRlcmVkIHBsYW5cbiAgICB2YXIgcGxhbiA9IFtdLCBjeWNsZSA9IFtdLCB2aXNpdGVkID0ge307XG4gICAgZnVuY3Rpb24gdmlzaXQodmFsdWUsIGtleSkge1xuICAgICAgaWYgKHZpc2l0ZWRba2V5XSA9PT0gVklTSVRfRE9ORSkgcmV0dXJuO1xuICAgICAgXG4gICAgICBjeWNsZS5wdXNoKGtleSk7XG4gICAgICBpZiAodmlzaXRlZFtrZXldID09PSBWSVNJVF9JTl9QUk9HUkVTUykge1xuICAgICAgICBjeWNsZS5zcGxpY2UoMCwgY3ljbGUuaW5kZXhPZihrZXkpKTtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiQ3ljbGljIGRlcGVuZGVuY3k6IFwiICsgY3ljbGUuam9pbihcIiAtPiBcIikpO1xuICAgICAgfVxuICAgICAgdmlzaXRlZFtrZXldID0gVklTSVRfSU5fUFJPR1JFU1M7XG4gICAgICBcbiAgICAgIGlmIChpc1N0cmluZyh2YWx1ZSkpIHtcbiAgICAgICAgcGxhbi5wdXNoKGtleSwgWyBmdW5jdGlvbigpIHsgcmV0dXJuICRpbmplY3Rvci5nZXQodmFsdWUpOyB9XSwgTk9fREVQRU5ERU5DSUVTKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBwYXJhbXMgPSAkaW5qZWN0b3IuYW5ub3RhdGUodmFsdWUpO1xuICAgICAgICBmb3JFYWNoKHBhcmFtcywgZnVuY3Rpb24gKHBhcmFtKSB7XG4gICAgICAgICAgaWYgKHBhcmFtICE9PSBrZXkgJiYgaW52b2NhYmxlcy5oYXNPd25Qcm9wZXJ0eShwYXJhbSkpIHZpc2l0KGludm9jYWJsZXNbcGFyYW1dLCBwYXJhbSk7XG4gICAgICAgIH0pO1xuICAgICAgICBwbGFuLnB1c2goa2V5LCB2YWx1ZSwgcGFyYW1zKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgY3ljbGUucG9wKCk7XG4gICAgICB2aXNpdGVkW2tleV0gPSBWSVNJVF9ET05FO1xuICAgIH1cbiAgICBmb3JFYWNoKGludm9jYWJsZXMsIHZpc2l0KTtcbiAgICBpbnZvY2FibGVzID0gY3ljbGUgPSB2aXNpdGVkID0gbnVsbDsgLy8gcGxhbiBpcyBhbGwgdGhhdCdzIHJlcXVpcmVkXG4gICAgXG4gICAgZnVuY3Rpb24gaXNSZXNvbHZlKHZhbHVlKSB7XG4gICAgICByZXR1cm4gaXNPYmplY3QodmFsdWUpICYmIHZhbHVlLnRoZW4gJiYgdmFsdWUuJCRwcm9taXNlcztcbiAgICB9XG4gICAgXG4gICAgcmV0dXJuIGZ1bmN0aW9uIChsb2NhbHMsIHBhcmVudCwgc2VsZikge1xuICAgICAgaWYgKGlzUmVzb2x2ZShsb2NhbHMpICYmIHNlbGYgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBzZWxmID0gcGFyZW50OyBwYXJlbnQgPSBsb2NhbHM7IGxvY2FscyA9IG51bGw7XG4gICAgICB9XG4gICAgICBpZiAoIWxvY2FscykgbG9jYWxzID0gTk9fTE9DQUxTO1xuICAgICAgZWxzZSBpZiAoIWlzT2JqZWN0KGxvY2FscykpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiJ2xvY2FscycgbXVzdCBiZSBhbiBvYmplY3RcIik7XG4gICAgICB9ICAgICAgIFxuICAgICAgaWYgKCFwYXJlbnQpIHBhcmVudCA9IE5PX1BBUkVOVDtcbiAgICAgIGVsc2UgaWYgKCFpc1Jlc29sdmUocGFyZW50KSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCIncGFyZW50JyBtdXN0IGJlIGEgcHJvbWlzZSByZXR1cm5lZCBieSAkcmVzb2x2ZS5yZXNvbHZlKClcIik7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIFRvIGNvbXBsZXRlIHRoZSBvdmVyYWxsIHJlc29sdXRpb24sIHdlIGhhdmUgdG8gd2FpdCBmb3IgdGhlIHBhcmVudFxuICAgICAgLy8gcHJvbWlzZSBhbmQgZm9yIHRoZSBwcm9taXNlIGZvciBlYWNoIGludm9rYWJsZSBpbiBvdXIgcGxhbi5cbiAgICAgIHZhciByZXNvbHV0aW9uID0gJHEuZGVmZXIoKSxcbiAgICAgICAgICByZXN1bHQgPSByZXNvbHV0aW9uLnByb21pc2UsXG4gICAgICAgICAgcHJvbWlzZXMgPSByZXN1bHQuJCRwcm9taXNlcyA9IHt9LFxuICAgICAgICAgIHZhbHVlcyA9IGV4dGVuZCh7fSwgbG9jYWxzKSxcbiAgICAgICAgICB3YWl0ID0gMSArIHBsYW4ubGVuZ3RoLzMsXG4gICAgICAgICAgbWVyZ2VkID0gZmFsc2U7XG4gICAgICAgICAgXG4gICAgICBmdW5jdGlvbiBkb25lKCkge1xuICAgICAgICAvLyBNZXJnZSBwYXJlbnQgdmFsdWVzIHdlIGhhdmVuJ3QgZ290IHlldCBhbmQgcHVibGlzaCBvdXIgb3duICQkdmFsdWVzXG4gICAgICAgIGlmICghLS13YWl0KSB7XG4gICAgICAgICAgaWYgKCFtZXJnZWQpIG1lcmdlKHZhbHVlcywgcGFyZW50LiQkdmFsdWVzKTsgXG4gICAgICAgICAgcmVzdWx0LiQkdmFsdWVzID0gdmFsdWVzO1xuICAgICAgICAgIHJlc3VsdC4kJHByb21pc2VzID0gdHJ1ZTsgLy8ga2VlcCBmb3IgaXNSZXNvbHZlKClcbiAgICAgICAgICByZXNvbHV0aW9uLnJlc29sdmUodmFsdWVzKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgXG4gICAgICBmdW5jdGlvbiBmYWlsKHJlYXNvbikge1xuICAgICAgICByZXN1bHQuJCRmYWlsdXJlID0gcmVhc29uO1xuICAgICAgICByZXNvbHV0aW9uLnJlamVjdChyZWFzb24pO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBTaG9ydC1jaXJjdWl0IGlmIHBhcmVudCBoYXMgYWxyZWFkeSBmYWlsZWRcbiAgICAgIGlmIChpc0RlZmluZWQocGFyZW50LiQkZmFpbHVyZSkpIHtcbiAgICAgICAgZmFpbChwYXJlbnQuJCRmYWlsdXJlKTtcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gTWVyZ2UgcGFyZW50IHZhbHVlcyBpZiB0aGUgcGFyZW50IGhhcyBhbHJlYWR5IHJlc29sdmVkLCBvciBtZXJnZVxuICAgICAgLy8gcGFyZW50IHByb21pc2VzIGFuZCB3YWl0IGlmIHRoZSBwYXJlbnQgcmVzb2x2ZSBpcyBzdGlsbCBpbiBwcm9ncmVzcy5cbiAgICAgIGlmIChwYXJlbnQuJCR2YWx1ZXMpIHtcbiAgICAgICAgbWVyZ2VkID0gbWVyZ2UodmFsdWVzLCBwYXJlbnQuJCR2YWx1ZXMpO1xuICAgICAgICBkb25lKCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBleHRlbmQocHJvbWlzZXMsIHBhcmVudC4kJHByb21pc2VzKTtcbiAgICAgICAgcGFyZW50LnRoZW4oZG9uZSwgZmFpbCk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIFByb2Nlc3MgZWFjaCBpbnZvY2FibGUgaW4gdGhlIHBsYW4sIGJ1dCBpZ25vcmUgYW55IHdoZXJlIGEgbG9jYWwgb2YgdGhlIHNhbWUgbmFtZSBleGlzdHMuXG4gICAgICBmb3IgKHZhciBpPTAsIGlpPXBsYW4ubGVuZ3RoOyBpPGlpOyBpKz0zKSB7XG4gICAgICAgIGlmIChsb2NhbHMuaGFzT3duUHJvcGVydHkocGxhbltpXSkpIGRvbmUoKTtcbiAgICAgICAgZWxzZSBpbnZva2UocGxhbltpXSwgcGxhbltpKzFdLCBwbGFuW2krMl0pO1xuICAgICAgfVxuICAgICAgXG4gICAgICBmdW5jdGlvbiBpbnZva2Uoa2V5LCBpbnZvY2FibGUsIHBhcmFtcykge1xuICAgICAgICAvLyBDcmVhdGUgYSBkZWZlcnJlZCBmb3IgdGhpcyBpbnZvY2F0aW9uLiBGYWlsdXJlcyB3aWxsIHByb3BhZ2F0ZSB0byB0aGUgcmVzb2x1dGlvbiBhcyB3ZWxsLlxuICAgICAgICB2YXIgaW52b2NhdGlvbiA9ICRxLmRlZmVyKCksIHdhaXRQYXJhbXMgPSAwO1xuICAgICAgICBmdW5jdGlvbiBvbmZhaWx1cmUocmVhc29uKSB7XG4gICAgICAgICAgaW52b2NhdGlvbi5yZWplY3QocmVhc29uKTtcbiAgICAgICAgICBmYWlsKHJlYXNvbik7XG4gICAgICAgIH1cbiAgICAgICAgLy8gV2FpdCBmb3IgYW55IHBhcmFtZXRlciB0aGF0IHdlIGhhdmUgYSBwcm9taXNlIGZvciAoZWl0aGVyIGZyb20gcGFyZW50IG9yIGZyb20gdGhpc1xuICAgICAgICAvLyByZXNvbHZlOyBpbiB0aGF0IGNhc2Ugc3R1ZHkoKSB3aWxsIGhhdmUgbWFkZSBzdXJlIGl0J3Mgb3JkZXJlZCBiZWZvcmUgdXMgaW4gdGhlIHBsYW4pLlxuICAgICAgICBmb3JFYWNoKHBhcmFtcywgZnVuY3Rpb24gKGRlcCkge1xuICAgICAgICAgIGlmIChwcm9taXNlcy5oYXNPd25Qcm9wZXJ0eShkZXApICYmICFsb2NhbHMuaGFzT3duUHJvcGVydHkoZGVwKSkge1xuICAgICAgICAgICAgd2FpdFBhcmFtcysrO1xuICAgICAgICAgICAgcHJvbWlzZXNbZGVwXS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgdmFsdWVzW2RlcF0gPSByZXN1bHQ7XG4gICAgICAgICAgICAgIGlmICghKC0td2FpdFBhcmFtcykpIHByb2NlZWQoKTtcbiAgICAgICAgICAgIH0sIG9uZmFpbHVyZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgaWYgKCF3YWl0UGFyYW1zKSBwcm9jZWVkKCk7XG4gICAgICAgIGZ1bmN0aW9uIHByb2NlZWQoKSB7XG4gICAgICAgICAgaWYgKGlzRGVmaW5lZChyZXN1bHQuJCRmYWlsdXJlKSkgcmV0dXJuO1xuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBpbnZvY2F0aW9uLnJlc29sdmUoJGluamVjdG9yLmludm9rZShpbnZvY2FibGUsIHNlbGYsIHZhbHVlcykpO1xuICAgICAgICAgICAgaW52b2NhdGlvbi5wcm9taXNlLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICB2YWx1ZXNba2V5XSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgZG9uZSgpO1xuICAgICAgICAgICAgfSwgb25mYWlsdXJlKTtcbiAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICBvbmZhaWx1cmUoZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIFB1Ymxpc2ggcHJvbWlzZSBzeW5jaHJvbm91c2x5OyBpbnZvY2F0aW9ucyBmdXJ0aGVyIGRvd24gaW4gdGhlIHBsYW4gbWF5IGRlcGVuZCBvbiBpdC5cbiAgICAgICAgcHJvbWlzZXNba2V5XSA9IGludm9jYXRpb24ucHJvbWlzZTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICB9O1xuICBcbiAgLyoqXG4gICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgKiBAbmFtZSB1aS5yb3V0ZXIudXRpbC4kcmVzb2x2ZSNyZXNvbHZlXG4gICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIudXRpbC4kcmVzb2x2ZVxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVzb2x2ZXMgYSBzZXQgb2YgaW52b2NhYmxlcy4gQW4gaW52b2NhYmxlIGlzIGEgZnVuY3Rpb24gdG8gYmUgaW52b2tlZCB2aWEgXG4gICAqIGAkaW5qZWN0b3IuaW52b2tlKClgLCBhbmQgY2FuIGhhdmUgYW4gYXJiaXRyYXJ5IG51bWJlciBvZiBkZXBlbmRlbmNpZXMuIFxuICAgKiBBbiBpbnZvY2FibGUgY2FuIGVpdGhlciByZXR1cm4gYSB2YWx1ZSBkaXJlY3RseSxcbiAgICogb3IgYSBgJHFgIHByb21pc2UuIElmIGEgcHJvbWlzZSBpcyByZXR1cm5lZCBpdCB3aWxsIGJlIHJlc29sdmVkIGFuZCB0aGUgXG4gICAqIHJlc3VsdGluZyB2YWx1ZSB3aWxsIGJlIHVzZWQgaW5zdGVhZC4gRGVwZW5kZW5jaWVzIG9mIGludm9jYWJsZXMgYXJlIHJlc29sdmVkIFxuICAgKiAoaW4gdGhpcyBvcmRlciBvZiBwcmVjZWRlbmNlKVxuICAgKlxuICAgKiAtIGZyb20gdGhlIHNwZWNpZmllZCBgbG9jYWxzYFxuICAgKiAtIGZyb20gYW5vdGhlciBpbnZvY2FibGUgdGhhdCBpcyBwYXJ0IG9mIHRoaXMgYCRyZXNvbHZlYCBjYWxsXG4gICAqIC0gZnJvbSBhbiBpbnZvY2FibGUgdGhhdCBpcyBpbmhlcml0ZWQgZnJvbSBhIGBwYXJlbnRgIGNhbGwgdG8gYCRyZXNvbHZlYCBcbiAgICogICAob3IgcmVjdXJzaXZlbHlcbiAgICogLSBmcm9tIGFueSBhbmNlc3RvciBgJHJlc29sdmVgIG9mIHRoYXQgcGFyZW50KS5cbiAgICpcbiAgICogVGhlIHJldHVybiB2YWx1ZSBvZiBgJHJlc29sdmVgIGlzIGEgcHJvbWlzZSBmb3IgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgXG4gICAqIChpbiB0aGlzIG9yZGVyIG9mIHByZWNlZGVuY2UpXG4gICAqXG4gICAqIC0gYW55IGBsb2NhbHNgIChpZiBzcGVjaWZpZWQpXG4gICAqIC0gdGhlIHJlc29sdmVkIHJldHVybiB2YWx1ZXMgb2YgYWxsIGluamVjdGFibGVzXG4gICAqIC0gYW55IHZhbHVlcyBpbmhlcml0ZWQgZnJvbSBhIGBwYXJlbnRgIGNhbGwgdG8gYCRyZXNvbHZlYCAoaWYgc3BlY2lmaWVkKVxuICAgKlxuICAgKiBUaGUgcHJvbWlzZSB3aWxsIHJlc29sdmUgYWZ0ZXIgdGhlIGBwYXJlbnRgIHByb21pc2UgKGlmIGFueSkgYW5kIGFsbCBwcm9taXNlcyBcbiAgICogcmV0dXJuZWQgYnkgaW5qZWN0YWJsZXMgaGF2ZSBiZWVuIHJlc29sdmVkLiBJZiBhbnkgaW52b2NhYmxlIFxuICAgKiAob3IgYCRpbmplY3Rvci5pbnZva2VgKSB0aHJvd3MgYW4gZXhjZXB0aW9uLCBvciBpZiBhIHByb21pc2UgcmV0dXJuZWQgYnkgYW4gXG4gICAqIGludm9jYWJsZSBpcyByZWplY3RlZCwgdGhlIGAkcmVzb2x2ZWAgcHJvbWlzZSBpcyBpbW1lZGlhdGVseSByZWplY3RlZCB3aXRoIHRoZSBcbiAgICogc2FtZSBlcnJvci4gQSByZWplY3Rpb24gb2YgYSBgcGFyZW50YCBwcm9taXNlIChpZiBzcGVjaWZpZWQpIHdpbGwgbGlrZXdpc2UgYmUgXG4gICAqIHByb3BhZ2F0ZWQgaW1tZWRpYXRlbHkuIE9uY2UgdGhlIGAkcmVzb2x2ZWAgcHJvbWlzZSBoYXMgYmVlbiByZWplY3RlZCwgbm8gXG4gICAqIGZ1cnRoZXIgaW52b2NhYmxlcyB3aWxsIGJlIGNhbGxlZC5cbiAgICogXG4gICAqIEN5Y2xpYyBkZXBlbmRlbmNpZXMgYmV0d2VlbiBpbnZvY2FibGVzIGFyZSBub3QgcGVybWl0dGVkIGFuZCB3aWxsIGNhdWVzIGAkcmVzb2x2ZWBcbiAgICogdG8gdGhyb3cgYW4gZXJyb3IuIEFzIGEgc3BlY2lhbCBjYXNlLCBhbiBpbmplY3RhYmxlIGNhbiBkZXBlbmQgb24gYSBwYXJhbWV0ZXIgXG4gICAqIHdpdGggdGhlIHNhbWUgbmFtZSBhcyB0aGUgaW5qZWN0YWJsZSwgd2hpY2ggd2lsbCBiZSBmdWxmaWxsZWQgZnJvbSB0aGUgYHBhcmVudGAgXG4gICAqIGluamVjdGFibGUgb2YgdGhlIHNhbWUgbmFtZS4gVGhpcyBhbGxvd3MgaW5oZXJpdGVkIHZhbHVlcyB0byBiZSBkZWNvcmF0ZWQuIFxuICAgKiBOb3RlIHRoYXQgaW4gdGhpcyBjYXNlIGFueSBvdGhlciBpbmplY3RhYmxlIGluIHRoZSBzYW1lIGAkcmVzb2x2ZWAgd2l0aCB0aGUgc2FtZVxuICAgKiBkZXBlbmRlbmN5IHdvdWxkIHNlZSB0aGUgZGVjb3JhdGVkIHZhbHVlLCBub3QgdGhlIGluaGVyaXRlZCB2YWx1ZS5cbiAgICpcbiAgICogTm90ZSB0aGF0IG1pc3NpbmcgZGVwZW5kZW5jaWVzIC0tIHVubGlrZSBjeWNsaWMgZGVwZW5kZW5jaWVzIC0tIHdpbGwgY2F1c2UgYW4gXG4gICAqIChhc3luY2hyb25vdXMpIHJlamVjdGlvbiBvZiB0aGUgYCRyZXNvbHZlYCBwcm9taXNlIHJhdGhlciB0aGFuIGEgKHN5bmNocm9ub3VzKSBcbiAgICogZXhjZXB0aW9uLlxuICAgKlxuICAgKiBJbnZvY2FibGVzIGFyZSBpbnZva2VkIGVhZ2VybHkgYXMgc29vbiBhcyBhbGwgZGVwZW5kZW5jaWVzIGFyZSBhdmFpbGFibGUuIFxuICAgKiBUaGlzIGlzIHRydWUgZXZlbiBmb3IgZGVwZW5kZW5jaWVzIGluaGVyaXRlZCBmcm9tIGEgYHBhcmVudGAgY2FsbCB0byBgJHJlc29sdmVgLlxuICAgKlxuICAgKiBBcyBhIHNwZWNpYWwgY2FzZSwgYW4gaW52b2NhYmxlIGNhbiBiZSBhIHN0cmluZywgaW4gd2hpY2ggY2FzZSBpdCBpcyB0YWtlbiB0byBcbiAgICogYmUgYSBzZXJ2aWNlIG5hbWUgdG8gYmUgcGFzc2VkIHRvIGAkaW5qZWN0b3IuZ2V0KClgLiBUaGlzIGlzIHN1cHBvcnRlZCBwcmltYXJpbHkgXG4gICAqIGZvciBiYWNrd2FyZHMtY29tcGF0aWJpbGl0eSB3aXRoIHRoZSBgcmVzb2x2ZWAgcHJvcGVydHkgb2YgYCRyb3V0ZVByb3ZpZGVyYCBcbiAgICogcm91dGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gaW52b2NhYmxlcyBmdW5jdGlvbnMgdG8gaW52b2tlIG9yIFxuICAgKiBgJGluamVjdG9yYCBzZXJ2aWNlcyB0byBmZXRjaC5cbiAgICogQHBhcmFtIHtvYmplY3R9IGxvY2FscyAgdmFsdWVzIHRvIG1ha2UgYXZhaWxhYmxlIHRvIHRoZSBpbmplY3RhYmxlc1xuICAgKiBAcGFyYW0ge29iamVjdH0gcGFyZW50ICBhIHByb21pc2UgcmV0dXJuZWQgYnkgYW5vdGhlciBjYWxsIHRvIGAkcmVzb2x2ZWAuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBzZWxmICB0aGUgYHRoaXNgIGZvciB0aGUgaW52b2tlZCBtZXRob2RzXG4gICAqIEByZXR1cm4ge29iamVjdH0gUHJvbWlzZSBmb3IgYW4gb2JqZWN0IHRoYXQgY29udGFpbnMgdGhlIHJlc29sdmVkIHJldHVybiB2YWx1ZVxuICAgKiBvZiBhbGwgaW52b2NhYmxlcywgYXMgd2VsbCBhcyBhbnkgaW5oZXJpdGVkIGFuZCBsb2NhbCB2YWx1ZXMuXG4gICAqL1xuICB0aGlzLnJlc29sdmUgPSBmdW5jdGlvbiAoaW52b2NhYmxlcywgbG9jYWxzLCBwYXJlbnQsIHNlbGYpIHtcbiAgICByZXR1cm4gdGhpcy5zdHVkeShpbnZvY2FibGVzKShsb2NhbHMsIHBhcmVudCwgc2VsZik7XG4gIH07XG59XG5cbmFuZ3VsYXIubW9kdWxlKCd1aS5yb3V0ZXIudXRpbCcpLnNlcnZpY2UoJyRyZXNvbHZlJywgJFJlc29sdmUpO1xuXG5cbi8qKlxuICogQG5nZG9jIG9iamVjdFxuICogQG5hbWUgdWkucm91dGVyLnV0aWwuJHRlbXBsYXRlRmFjdG9yeVxuICpcbiAqIEByZXF1aXJlcyAkaHR0cFxuICogQHJlcXVpcmVzICR0ZW1wbGF0ZUNhY2hlXG4gKiBAcmVxdWlyZXMgJGluamVjdG9yXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBTZXJ2aWNlLiBNYW5hZ2VzIGxvYWRpbmcgb2YgdGVtcGxhdGVzLlxuICovXG4kVGVtcGxhdGVGYWN0b3J5LiRpbmplY3QgPSBbJyRodHRwJywgJyR0ZW1wbGF0ZUNhY2hlJywgJyRpbmplY3RvciddO1xuZnVuY3Rpb24gJFRlbXBsYXRlRmFjdG9yeSggICRodHRwLCAgICR0ZW1wbGF0ZUNhY2hlLCAgICRpbmplY3Rvcikge1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICogQG5hbWUgdWkucm91dGVyLnV0aWwuJHRlbXBsYXRlRmFjdG9yeSNmcm9tQ29uZmlnXG4gICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIudXRpbC4kdGVtcGxhdGVGYWN0b3J5XG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDcmVhdGVzIGEgdGVtcGxhdGUgZnJvbSBhIGNvbmZpZ3VyYXRpb24gb2JqZWN0LiBcbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGNvbmZpZyBDb25maWd1cmF0aW9uIG9iamVjdCBmb3Igd2hpY2ggdG8gbG9hZCBhIHRlbXBsYXRlLiBcbiAgICogVGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzIGFyZSBzZWFyY2ggaW4gdGhlIHNwZWNpZmllZCBvcmRlciwgYW5kIHRoZSBmaXJzdCBvbmUgXG4gICAqIHRoYXQgaXMgZGVmaW5lZCBpcyB1c2VkIHRvIGNyZWF0ZSB0aGUgdGVtcGxhdGU6XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gY29uZmlnLnRlbXBsYXRlIGh0bWwgc3RyaW5nIHRlbXBsYXRlIG9yIGZ1bmN0aW9uIHRvIFxuICAgKiBsb2FkIHZpYSB7QGxpbmsgdWkucm91dGVyLnV0aWwuJHRlbXBsYXRlRmFjdG9yeSNmcm9tU3RyaW5nIGZyb21TdHJpbmd9LlxuICAgKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IGNvbmZpZy50ZW1wbGF0ZVVybCB1cmwgdG8gbG9hZCBvciBhIGZ1bmN0aW9uIHJldHVybmluZyBcbiAgICogdGhlIHVybCB0byBsb2FkIHZpYSB7QGxpbmsgdWkucm91dGVyLnV0aWwuJHRlbXBsYXRlRmFjdG9yeSNmcm9tVXJsIGZyb21Vcmx9LlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBjb25maWcudGVtcGxhdGVQcm92aWRlciBmdW5jdGlvbiB0byBpbnZva2UgdmlhIFxuICAgKiB7QGxpbmsgdWkucm91dGVyLnV0aWwuJHRlbXBsYXRlRmFjdG9yeSNmcm9tUHJvdmlkZXIgZnJvbVByb3ZpZGVyfS5cbiAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtcyAgUGFyYW1ldGVycyB0byBwYXNzIHRvIHRoZSB0ZW1wbGF0ZSBmdW5jdGlvbi5cbiAgICogQHBhcmFtIHtvYmplY3R9IGxvY2FscyBMb2NhbHMgdG8gcGFzcyB0byBgaW52b2tlYCBpZiB0aGUgdGVtcGxhdGUgaXMgbG9hZGVkIFxuICAgKiB2aWEgYSBgdGVtcGxhdGVQcm92aWRlcmAuIERlZmF1bHRzIHRvIGB7IHBhcmFtczogcGFyYW1zIH1gLlxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd8b2JqZWN0fSAgVGhlIHRlbXBsYXRlIGh0bWwgYXMgYSBzdHJpbmcsIG9yIGEgcHJvbWlzZSBmb3IgXG4gICAqIHRoYXQgc3RyaW5nLG9yIGBudWxsYCBpZiBubyB0ZW1wbGF0ZSBpcyBjb25maWd1cmVkLlxuICAgKi9cbiAgdGhpcy5mcm9tQ29uZmlnID0gZnVuY3Rpb24gKGNvbmZpZywgcGFyYW1zLCBsb2NhbHMpIHtcbiAgICByZXR1cm4gKFxuICAgICAgaXNEZWZpbmVkKGNvbmZpZy50ZW1wbGF0ZSkgPyB0aGlzLmZyb21TdHJpbmcoY29uZmlnLnRlbXBsYXRlLCBwYXJhbXMpIDpcbiAgICAgIGlzRGVmaW5lZChjb25maWcudGVtcGxhdGVVcmwpID8gdGhpcy5mcm9tVXJsKGNvbmZpZy50ZW1wbGF0ZVVybCwgcGFyYW1zKSA6XG4gICAgICBpc0RlZmluZWQoY29uZmlnLnRlbXBsYXRlUHJvdmlkZXIpID8gdGhpcy5mcm9tUHJvdmlkZXIoY29uZmlnLnRlbXBsYXRlUHJvdmlkZXIsIHBhcmFtcywgbG9jYWxzKSA6XG4gICAgICBudWxsXG4gICAgKTtcbiAgfTtcblxuICAvKipcbiAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAqIEBuYW1lIHVpLnJvdXRlci51dGlsLiR0ZW1wbGF0ZUZhY3RvcnkjZnJvbVN0cmluZ1xuICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnV0aWwuJHRlbXBsYXRlRmFjdG9yeVxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ3JlYXRlcyBhIHRlbXBsYXRlIGZyb20gYSBzdHJpbmcgb3IgYSBmdW5jdGlvbiByZXR1cm5pbmcgYSBzdHJpbmcuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gdGVtcGxhdGUgaHRtbCB0ZW1wbGF0ZSBhcyBhIHN0cmluZyBvciBmdW5jdGlvbiB0aGF0IFxuICAgKiByZXR1cm5zIGFuIGh0bWwgdGVtcGxhdGUgYXMgYSBzdHJpbmcuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgUGFyYW1ldGVycyB0byBwYXNzIHRvIHRoZSB0ZW1wbGF0ZSBmdW5jdGlvbi5cbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfG9iamVjdH0gVGhlIHRlbXBsYXRlIGh0bWwgYXMgYSBzdHJpbmcsIG9yIGEgcHJvbWlzZSBmb3IgdGhhdCBcbiAgICogc3RyaW5nLlxuICAgKi9cbiAgdGhpcy5mcm9tU3RyaW5nID0gZnVuY3Rpb24gKHRlbXBsYXRlLCBwYXJhbXMpIHtcbiAgICByZXR1cm4gaXNGdW5jdGlvbih0ZW1wbGF0ZSkgPyB0ZW1wbGF0ZShwYXJhbXMpIDogdGVtcGxhdGU7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgKiBAbmFtZSB1aS5yb3V0ZXIudXRpbC4kdGVtcGxhdGVGYWN0b3J5I2Zyb21VcmxcbiAgICogQG1ldGhvZE9mIHVpLnJvdXRlci51dGlsLiR0ZW1wbGF0ZUZhY3RvcnlcbiAgICogXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBMb2FkcyBhIHRlbXBsYXRlIGZyb20gdGhlIGEgVVJMIHZpYSBgJGh0dHBgIGFuZCBgJHRlbXBsYXRlQ2FjaGVgLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xGdW5jdGlvbn0gdXJsIHVybCBvZiB0aGUgdGVtcGxhdGUgdG8gbG9hZCwgb3IgYSBmdW5jdGlvbiBcbiAgICogdGhhdCByZXR1cm5zIGEgdXJsLlxuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIFBhcmFtZXRlcnMgdG8gcGFzcyB0byB0aGUgdXJsIGZ1bmN0aW9uLlxuICAgKiBAcmV0dXJuIHtzdHJpbmd8UHJvbWlzZS48c3RyaW5nPn0gVGhlIHRlbXBsYXRlIGh0bWwgYXMgYSBzdHJpbmcsIG9yIGEgcHJvbWlzZSBcbiAgICogZm9yIHRoYXQgc3RyaW5nLlxuICAgKi9cbiAgdGhpcy5mcm9tVXJsID0gZnVuY3Rpb24gKHVybCwgcGFyYW1zKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24odXJsKSkgdXJsID0gdXJsKHBhcmFtcyk7XG4gICAgaWYgKHVybCA9PSBudWxsKSByZXR1cm4gbnVsbDtcbiAgICBlbHNlIHJldHVybiAkaHR0cFxuICAgICAgICAuZ2V0KHVybCwgeyBjYWNoZTogJHRlbXBsYXRlQ2FjaGUgfSlcbiAgICAgICAgLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2UpIHsgcmV0dXJuIHJlc3BvbnNlLmRhdGE7IH0pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICogQG5hbWUgdWkucm91dGVyLnV0aWwuJHRlbXBsYXRlRmFjdG9yeSNmcm9tVXJsXG4gICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIudXRpbC4kdGVtcGxhdGVGYWN0b3J5XG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDcmVhdGVzIGEgdGVtcGxhdGUgYnkgaW52b2tpbmcgYW4gaW5qZWN0YWJsZSBwcm92aWRlciBmdW5jdGlvbi5cbiAgICpcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gcHJvdmlkZXIgRnVuY3Rpb24gdG8gaW52b2tlIHZpYSBgJGluamVjdG9yLmludm9rZWBcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyBQYXJhbWV0ZXJzIGZvciB0aGUgdGVtcGxhdGUuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBsb2NhbHMgTG9jYWxzIHRvIHBhc3MgdG8gYGludm9rZWAuIERlZmF1bHRzIHRvIFxuICAgKiBgeyBwYXJhbXM6IHBhcmFtcyB9YC5cbiAgICogQHJldHVybiB7c3RyaW5nfFByb21pc2UuPHN0cmluZz59IFRoZSB0ZW1wbGF0ZSBodG1sIGFzIGEgc3RyaW5nLCBvciBhIHByb21pc2UgXG4gICAqIGZvciB0aGF0IHN0cmluZy5cbiAgICovXG4gIHRoaXMuZnJvbVByb3ZpZGVyID0gZnVuY3Rpb24gKHByb3ZpZGVyLCBwYXJhbXMsIGxvY2Fscykge1xuICAgIHJldHVybiAkaW5qZWN0b3IuaW52b2tlKHByb3ZpZGVyLCBudWxsLCBsb2NhbHMgfHwgeyBwYXJhbXM6IHBhcmFtcyB9KTtcbiAgfTtcbn1cblxuYW5ndWxhci5tb2R1bGUoJ3VpLnJvdXRlci51dGlsJykuc2VydmljZSgnJHRlbXBsYXRlRmFjdG9yeScsICRUZW1wbGF0ZUZhY3RvcnkpO1xuXG4vKipcbiAqIEBuZ2RvYyBvYmplY3RcbiAqIEBuYW1lIHVpLnJvdXRlci51dGlsLnR5cGU6VXJsTWF0Y2hlclxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogTWF0Y2hlcyBVUkxzIGFnYWluc3QgcGF0dGVybnMgYW5kIGV4dHJhY3RzIG5hbWVkIHBhcmFtZXRlcnMgZnJvbSB0aGUgcGF0aCBvciB0aGUgc2VhcmNoXG4gKiBwYXJ0IG9mIHRoZSBVUkwuIEEgVVJMIHBhdHRlcm4gY29uc2lzdHMgb2YgYSBwYXRoIHBhdHRlcm4sIG9wdGlvbmFsbHkgZm9sbG93ZWQgYnkgJz8nIGFuZCBhIGxpc3RcbiAqIG9mIHNlYXJjaCBwYXJhbWV0ZXJzLiBNdWx0aXBsZSBzZWFyY2ggcGFyYW1ldGVyIG5hbWVzIGFyZSBzZXBhcmF0ZWQgYnkgJyYnLiBTZWFyY2ggcGFyYW1ldGVyc1xuICogZG8gbm90IGluZmx1ZW5jZSB3aGV0aGVyIG9yIG5vdCBhIFVSTCBpcyBtYXRjaGVkLCBidXQgdGhlaXIgdmFsdWVzIGFyZSBwYXNzZWQgdGhyb3VnaCBpbnRvXG4gKiB0aGUgbWF0Y2hlZCBwYXJhbWV0ZXJzIHJldHVybmVkIGJ5IHtAbGluayB1aS5yb3V0ZXIudXRpbC50eXBlOlVybE1hdGNoZXIjbWV0aG9kc19leGVjIGV4ZWN9LlxuICogXG4gKiBQYXRoIHBhcmFtZXRlciBwbGFjZWhvbGRlcnMgY2FuIGJlIHNwZWNpZmllZCB1c2luZyBzaW1wbGUgY29sb24vY2F0Y2gtYWxsIHN5bnRheCBvciBjdXJseSBicmFjZVxuICogc3ludGF4LCB3aGljaCBvcHRpb25hbGx5IGFsbG93cyBhIHJlZ3VsYXIgZXhwcmVzc2lvbiBmb3IgdGhlIHBhcmFtZXRlciB0byBiZSBzcGVjaWZpZWQ6XG4gKlxuICogKiBgJzonYCBuYW1lIC0gY29sb24gcGxhY2Vob2xkZXJcbiAqICogYCcqJ2AgbmFtZSAtIGNhdGNoLWFsbCBwbGFjZWhvbGRlclxuICogKiBgJ3snIG5hbWUgJ30nYCAtIGN1cmx5IHBsYWNlaG9sZGVyXG4gKiAqIGAneycgbmFtZSAnOicgcmVnZXhwICd9J2AgLSBjdXJseSBwbGFjZWhvbGRlciB3aXRoIHJlZ2V4cC4gU2hvdWxkIHRoZSByZWdleHAgaXRzZWxmIGNvbnRhaW5cbiAqICAgY3VybHkgYnJhY2VzLCB0aGV5IG11c3QgYmUgaW4gbWF0Y2hlZCBwYWlycyBvciBlc2NhcGVkIHdpdGggYSBiYWNrc2xhc2guXG4gKlxuICogUGFyYW1ldGVyIG5hbWVzIG1heSBjb250YWluIG9ubHkgd29yZCBjaGFyYWN0ZXJzIChsYXRpbiBsZXR0ZXJzLCBkaWdpdHMsIGFuZCB1bmRlcnNjb3JlKSBhbmRcbiAqIG11c3QgYmUgdW5pcXVlIHdpdGhpbiB0aGUgcGF0dGVybiAoYWNyb3NzIGJvdGggcGF0aCBhbmQgc2VhcmNoIHBhcmFtZXRlcnMpLiBGb3IgY29sb24gXG4gKiBwbGFjZWhvbGRlcnMgb3IgY3VybHkgcGxhY2Vob2xkZXJzIHdpdGhvdXQgYW4gZXhwbGljaXQgcmVnZXhwLCBhIHBhdGggcGFyYW1ldGVyIG1hdGNoZXMgYW55XG4gKiBudW1iZXIgb2YgY2hhcmFjdGVycyBvdGhlciB0aGFuICcvJy4gRm9yIGNhdGNoLWFsbCBwbGFjZWhvbGRlcnMgdGhlIHBhdGggcGFyYW1ldGVyIG1hdGNoZXNcbiAqIGFueSBudW1iZXIgb2YgY2hhcmFjdGVycy5cbiAqIFxuICogRXhhbXBsZXM6XG4gKiBcbiAqICogYCcvaGVsbG8vJ2AgLSBNYXRjaGVzIG9ubHkgaWYgdGhlIHBhdGggaXMgZXhhY3RseSAnL2hlbGxvLycuIFRoZXJlIGlzIG5vIHNwZWNpYWwgdHJlYXRtZW50IGZvclxuICogICB0cmFpbGluZyBzbGFzaGVzLCBhbmQgcGF0dGVybnMgaGF2ZSB0byBtYXRjaCB0aGUgZW50aXJlIHBhdGgsIG5vdCBqdXN0IGEgcHJlZml4LlxuICogKiBgJy91c2VyLzppZCdgIC0gTWF0Y2hlcyAnL3VzZXIvYm9iJyBvciAnL3VzZXIvMTIzNCEhIScgb3IgZXZlbiAnL3VzZXIvJyBidXQgbm90ICcvdXNlcicgb3JcbiAqICAgJy91c2VyL2JvYi9kZXRhaWxzJy4gVGhlIHNlY29uZCBwYXRoIHNlZ21lbnQgd2lsbCBiZSBjYXB0dXJlZCBhcyB0aGUgcGFyYW1ldGVyICdpZCcuXG4gKiAqIGAnL3VzZXIve2lkfSdgIC0gU2FtZSBhcyB0aGUgcHJldmlvdXMgZXhhbXBsZSwgYnV0IHVzaW5nIGN1cmx5IGJyYWNlIHN5bnRheC5cbiAqICogYCcvdXNlci97aWQ6W14vXSp9J2AgLSBTYW1lIGFzIHRoZSBwcmV2aW91cyBleGFtcGxlLlxuICogKiBgJy91c2VyL3tpZDpbMC05YS1mQS1GXXsxLDh9fSdgIC0gU2ltaWxhciB0byB0aGUgcHJldmlvdXMgZXhhbXBsZSwgYnV0IG9ubHkgbWF0Y2hlcyBpZiB0aGUgaWRcbiAqICAgcGFyYW1ldGVyIGNvbnNpc3RzIG9mIDEgdG8gOCBoZXggZGlnaXRzLlxuICogKiBgJy9maWxlcy97cGF0aDouKn0nYCAtIE1hdGNoZXMgYW55IFVSTCBzdGFydGluZyB3aXRoICcvZmlsZXMvJyBhbmQgY2FwdHVyZXMgdGhlIHJlc3Qgb2YgdGhlXG4gKiAgIHBhdGggaW50byB0aGUgcGFyYW1ldGVyICdwYXRoJy5cbiAqICogYCcvZmlsZXMvKnBhdGgnYCAtIGRpdHRvLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXR0ZXJuICB0aGUgcGF0dGVybiB0byBjb21waWxlIGludG8gYSBtYXRjaGVyLlxuICpcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBwcmVmaXggIEEgc3RhdGljIHByZWZpeCBvZiB0aGlzIHBhdHRlcm4uIFRoZSBtYXRjaGVyIGd1YXJhbnRlZXMgdGhhdCBhbnlcbiAqICAgVVJMIG1hdGNoaW5nIHRoaXMgbWF0Y2hlciAoaS5lLiBhbnkgc3RyaW5nIGZvciB3aGljaCB7QGxpbmsgdWkucm91dGVyLnV0aWwudHlwZTpVcmxNYXRjaGVyI21ldGhvZHNfZXhlYyBleGVjKCl9IHJldHVybnNcbiAqICAgbm9uLW51bGwpIHdpbGwgc3RhcnQgd2l0aCB0aGlzIHByZWZpeC5cbiAqXG4gKiBAcHJvcGVydHkge3N0cmluZ30gc291cmNlICBUaGUgcGF0dGVybiB0aGF0IHdhcyBwYXNzZWQgaW50byB0aGUgY29udHJ1Y3RvclxuICpcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzb3VyY2VQYXRoICBUaGUgcGF0aCBwb3J0aW9uIG9mIHRoZSBzb3VyY2UgcHJvcGVydHlcbiAqXG4gKiBAcHJvcGVydHkge3N0cmluZ30gc291cmNlU2VhcmNoICBUaGUgc2VhcmNoIHBvcnRpb24gb2YgdGhlIHNvdXJjZSBwcm9wZXJ0eVxuICpcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSByZWdleCAgVGhlIGNvbnN0cnVjdGVkIHJlZ2V4IHRoYXQgd2lsbCBiZSB1c2VkIHRvIG1hdGNoIGFnYWluc3QgdGhlIHVybCB3aGVuIFxuICogICBpdCBpcyB0aW1lIHRvIGRldGVybWluZSB3aGljaCB1cmwgd2lsbCBtYXRjaC5cbiAqXG4gKiBAcmV0dXJucyB7T2JqZWN0fSAgTmV3IFVybE1hdGNoZXIgb2JqZWN0XG4gKi9cbmZ1bmN0aW9uIFVybE1hdGNoZXIocGF0dGVybikge1xuXG4gIC8vIEZpbmQgYWxsIHBsYWNlaG9sZGVycyBhbmQgY3JlYXRlIGEgY29tcGlsZWQgcGF0dGVybiwgdXNpbmcgZWl0aGVyIGNsYXNzaWMgb3IgY3VybHkgc3ludGF4OlxuICAvLyAgICcqJyBuYW1lXG4gIC8vICAgJzonIG5hbWVcbiAgLy8gICAneycgbmFtZSAnfSdcbiAgLy8gICAneycgbmFtZSAnOicgcmVnZXhwICd9J1xuICAvLyBUaGUgcmVndWxhciBleHByZXNzaW9uIGlzIHNvbWV3aGF0IGNvbXBsaWNhdGVkIGR1ZSB0byB0aGUgbmVlZCB0byBhbGxvdyBjdXJseSBicmFjZXNcbiAgLy8gaW5zaWRlIHRoZSByZWd1bGFyIGV4cHJlc3Npb24uIFRoZSBwbGFjZWhvbGRlciByZWdleHAgYnJlYWtzIGRvd24gYXMgZm9sbG93czpcbiAgLy8gICAgKFs6Kl0pKFxcdyspICAgICAgICAgICAgICAgY2xhc3NpYyBwbGFjZWhvbGRlciAoJDEgLyAkMilcbiAgLy8gICAgXFx7KFxcdyspKD86XFw6KCAuLi4gKSk/XFx9ICAgY3VybHkgYnJhY2UgcGxhY2Vob2xkZXIgKCQzKSB3aXRoIG9wdGlvbmFsIHJlZ2V4cCAuLi4gKCQ0KVxuICAvLyAgICAoPzogLi4uIHwgLi4uIHwgLi4uICkrICAgIHRoZSByZWdleHAgY29uc2lzdHMgb2YgYW55IG51bWJlciBvZiBhdG9tcywgYW4gYXRvbSBiZWluZyBlaXRoZXJcbiAgLy8gICAgW157fVxcXFxdKyAgICAgICAgICAgICAgICAgIC0gYW55dGhpbmcgb3RoZXIgdGhhbiBjdXJseSBicmFjZXMgb3IgYmFja3NsYXNoXG4gIC8vICAgIFxcXFwuICAgICAgICAgICAgICAgICAgICAgICAtIGEgYmFja3NsYXNoIGVzY2FwZVxuICAvLyAgICBcXHsoPzpbXnt9XFxcXF0rfFxcXFwuKSpcXH0gICAgIC0gYSBtYXRjaGVkIHNldCBvZiBjdXJseSBicmFjZXMgY29udGFpbmluZyBvdGhlciBhdG9tc1xuICB2YXIgcGxhY2Vob2xkZXIgPSAvKFs6Kl0pKFxcdyspfFxceyhcXHcrKSg/OlxcOigoPzpbXnt9XFxcXF0rfFxcXFwufFxceyg/Oltee31cXFxcXSt8XFxcXC4pKlxcfSkrKSk/XFx9L2csXG4gICAgICBuYW1lcyA9IHt9LCBjb21waWxlZCA9ICdeJywgbGFzdCA9IDAsIG0sXG4gICAgICBzZWdtZW50cyA9IHRoaXMuc2VnbWVudHMgPSBbXSxcbiAgICAgIHBhcmFtcyA9IHRoaXMucGFyYW1zID0gW107XG5cbiAgZnVuY3Rpb24gYWRkUGFyYW1ldGVyKGlkKSB7XG4gICAgaWYgKCEvXlxcdysoLStcXHcrKSokLy50ZXN0KGlkKSkgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBwYXJhbWV0ZXIgbmFtZSAnXCIgKyBpZCArIFwiJyBpbiBwYXR0ZXJuICdcIiArIHBhdHRlcm4gKyBcIidcIik7XG4gICAgaWYgKG5hbWVzW2lkXSkgdGhyb3cgbmV3IEVycm9yKFwiRHVwbGljYXRlIHBhcmFtZXRlciBuYW1lICdcIiArIGlkICsgXCInIGluIHBhdHRlcm4gJ1wiICsgcGF0dGVybiArIFwiJ1wiKTtcbiAgICBuYW1lc1tpZF0gPSB0cnVlO1xuICAgIHBhcmFtcy5wdXNoKGlkKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHF1b3RlUmVnRXhwKHN0cmluZykge1xuICAgIHJldHVybiBzdHJpbmcucmVwbGFjZSgvW1xcXFxcXFtcXF1cXF4kKis/LigpfHt9XS9nLCBcIlxcXFwkJlwiKTtcbiAgfVxuXG4gIHRoaXMuc291cmNlID0gcGF0dGVybjtcblxuICAvLyBTcGxpdCBpbnRvIHN0YXRpYyBzZWdtZW50cyBzZXBhcmF0ZWQgYnkgcGF0aCBwYXJhbWV0ZXIgcGxhY2Vob2xkZXJzLlxuICAvLyBUaGUgbnVtYmVyIG9mIHNlZ21lbnRzIGlzIGFsd2F5cyAxIG1vcmUgdGhhbiB0aGUgbnVtYmVyIG9mIHBhcmFtZXRlcnMuXG4gIHZhciBpZCwgcmVnZXhwLCBzZWdtZW50O1xuICB3aGlsZSAoKG0gPSBwbGFjZWhvbGRlci5leGVjKHBhdHRlcm4pKSkge1xuICAgIGlkID0gbVsyXSB8fCBtWzNdOyAvLyBJRVs3OF0gcmV0dXJucyAnJyBmb3IgdW5tYXRjaGVkIGdyb3VwcyBpbnN0ZWFkIG9mIG51bGxcbiAgICByZWdleHAgPSBtWzRdIHx8IChtWzFdID09ICcqJyA/ICcuKicgOiAnW14vXSonKTtcbiAgICBzZWdtZW50ID0gcGF0dGVybi5zdWJzdHJpbmcobGFzdCwgbS5pbmRleCk7XG4gICAgaWYgKHNlZ21lbnQuaW5kZXhPZignPycpID49IDApIGJyZWFrOyAvLyB3ZSdyZSBpbnRvIHRoZSBzZWFyY2ggcGFydFxuICAgIGNvbXBpbGVkICs9IHF1b3RlUmVnRXhwKHNlZ21lbnQpICsgJygnICsgcmVnZXhwICsgJyknO1xuICAgIGFkZFBhcmFtZXRlcihpZCk7XG4gICAgc2VnbWVudHMucHVzaChzZWdtZW50KTtcbiAgICBsYXN0ID0gcGxhY2Vob2xkZXIubGFzdEluZGV4O1xuICB9XG4gIHNlZ21lbnQgPSBwYXR0ZXJuLnN1YnN0cmluZyhsYXN0KTtcblxuICAvLyBGaW5kIGFueSBzZWFyY2ggcGFyYW1ldGVyIG5hbWVzIGFuZCByZW1vdmUgdGhlbSBmcm9tIHRoZSBsYXN0IHNlZ21lbnRcbiAgdmFyIGkgPSBzZWdtZW50LmluZGV4T2YoJz8nKTtcbiAgaWYgKGkgPj0gMCkge1xuICAgIHZhciBzZWFyY2ggPSB0aGlzLnNvdXJjZVNlYXJjaCA9IHNlZ21lbnQuc3Vic3RyaW5nKGkpO1xuICAgIHNlZ21lbnQgPSBzZWdtZW50LnN1YnN0cmluZygwLCBpKTtcbiAgICB0aGlzLnNvdXJjZVBhdGggPSBwYXR0ZXJuLnN1YnN0cmluZygwLCBsYXN0K2kpO1xuXG4gICAgLy8gQWxsb3cgcGFyYW1ldGVycyB0byBiZSBzZXBhcmF0ZWQgYnkgJz8nIGFzIHdlbGwgYXMgJyYnIHRvIG1ha2UgY29uY2F0KCkgZWFzaWVyXG4gICAgZm9yRWFjaChzZWFyY2guc3Vic3RyaW5nKDEpLnNwbGl0KC9bJj9dLyksIGFkZFBhcmFtZXRlcik7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy5zb3VyY2VQYXRoID0gcGF0dGVybjtcbiAgICB0aGlzLnNvdXJjZVNlYXJjaCA9ICcnO1xuICB9XG5cbiAgY29tcGlsZWQgKz0gcXVvdGVSZWdFeHAoc2VnbWVudCkgKyAnJCc7XG4gIHNlZ21lbnRzLnB1c2goc2VnbWVudCk7XG4gIHRoaXMucmVnZXhwID0gbmV3IFJlZ0V4cChjb21waWxlZCk7XG4gIHRoaXMucHJlZml4ID0gc2VnbWVudHNbMF07XG59XG5cbi8qKlxuICogQG5nZG9jIGZ1bmN0aW9uXG4gKiBAbmFtZSB1aS5yb3V0ZXIudXRpbC50eXBlOlVybE1hdGNoZXIjY29uY2F0XG4gKiBAbWV0aG9kT2YgdWkucm91dGVyLnV0aWwudHlwZTpVcmxNYXRjaGVyXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBSZXR1cm5zIGEgbmV3IG1hdGNoZXIgZm9yIGEgcGF0dGVybiBjb25zdHJ1Y3RlZCBieSBhcHBlbmRpbmcgdGhlIHBhdGggcGFydCBhbmQgYWRkaW5nIHRoZVxuICogc2VhcmNoIHBhcmFtZXRlcnMgb2YgdGhlIHNwZWNpZmllZCBwYXR0ZXJuIHRvIHRoaXMgcGF0dGVybi4gVGhlIGN1cnJlbnQgcGF0dGVybiBpcyBub3RcbiAqIG1vZGlmaWVkLiBUaGlzIGNhbiBiZSB1bmRlcnN0b29kIGFzIGNyZWF0aW5nIGEgcGF0dGVybiBmb3IgVVJMcyB0aGF0IGFyZSByZWxhdGl2ZSB0byAob3JcbiAqIHN1ZmZpeGVzIG9mKSB0aGUgY3VycmVudCBwYXR0ZXJuLlxuICpcbiAqIEBleGFtcGxlXG4gKiBUaGUgZm9sbG93aW5nIHR3byBtYXRjaGVycyBhcmUgZXF1aXZhbGVudDpcbiAqIGBgYFxuICogbmV3IFVybE1hdGNoZXIoJy91c2VyL3tpZH0/cScpLmNvbmNhdCgnL2RldGFpbHM/ZGF0ZScpO1xuICogbmV3IFVybE1hdGNoZXIoJy91c2VyL3tpZH0vZGV0YWlscz9xJmRhdGUnKTtcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXR0ZXJuICBUaGUgcGF0dGVybiB0byBhcHBlbmQuXG4gKiBAcmV0dXJucyB7dWkucm91dGVyLnV0aWwudHlwZTpVcmxNYXRjaGVyfSAgQSBtYXRjaGVyIGZvciB0aGUgY29uY2F0ZW5hdGVkIHBhdHRlcm4uXG4gKi9cblVybE1hdGNoZXIucHJvdG90eXBlLmNvbmNhdCA9IGZ1bmN0aW9uIChwYXR0ZXJuKSB7XG4gIC8vIEJlY2F1c2Ugb3JkZXIgb2Ygc2VhcmNoIHBhcmFtZXRlcnMgaXMgaXJyZWxldmFudCwgd2UgY2FuIGFkZCBvdXIgb3duIHNlYXJjaFxuICAvLyBwYXJhbWV0ZXJzIHRvIHRoZSBlbmQgb2YgdGhlIG5ldyBwYXR0ZXJuLiBQYXJzZSB0aGUgbmV3IHBhdHRlcm4gYnkgaXRzZWxmXG4gIC8vIGFuZCB0aGVuIGpvaW4gdGhlIGJpdHMgdG9nZXRoZXIsIGJ1dCBpdCdzIG11Y2ggZWFzaWVyIHRvIGRvIHRoaXMgb24gYSBzdHJpbmcgbGV2ZWwuXG4gIHJldHVybiBuZXcgVXJsTWF0Y2hlcih0aGlzLnNvdXJjZVBhdGggKyBwYXR0ZXJuICsgdGhpcy5zb3VyY2VTZWFyY2gpO1xufTtcblxuVXJsTWF0Y2hlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLnNvdXJjZTtcbn07XG5cbi8qKlxuICogQG5nZG9jIGZ1bmN0aW9uXG4gKiBAbmFtZSB1aS5yb3V0ZXIudXRpbC50eXBlOlVybE1hdGNoZXIjZXhlY1xuICogQG1ldGhvZE9mIHVpLnJvdXRlci51dGlsLnR5cGU6VXJsTWF0Y2hlclxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogVGVzdHMgdGhlIHNwZWNpZmllZCBwYXRoIGFnYWluc3QgdGhpcyBtYXRjaGVyLCBhbmQgcmV0dXJucyBhbiBvYmplY3QgY29udGFpbmluZyB0aGUgY2FwdHVyZWRcbiAqIHBhcmFtZXRlciB2YWx1ZXMsIG9yIG51bGwgaWYgdGhlIHBhdGggZG9lcyBub3QgbWF0Y2guIFRoZSByZXR1cm5lZCBvYmplY3QgY29udGFpbnMgdGhlIHZhbHVlc1xuICogb2YgYW55IHNlYXJjaCBwYXJhbWV0ZXJzIHRoYXQgYXJlIG1lbnRpb25lZCBpbiB0aGUgcGF0dGVybiwgYnV0IHRoZWlyIHZhbHVlIG1heSBiZSBudWxsIGlmXG4gKiB0aGV5IGFyZSBub3QgcHJlc2VudCBpbiBgc2VhcmNoUGFyYW1zYC4gVGhpcyBtZWFucyB0aGF0IHNlYXJjaCBwYXJhbWV0ZXJzIGFyZSBhbHdheXMgdHJlYXRlZFxuICogYXMgb3B0aW9uYWwuXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYFxuICogbmV3IFVybE1hdGNoZXIoJy91c2VyL3tpZH0/cSZyJykuZXhlYygnL3VzZXIvYm9iJywgeyB4OicxJywgcTonaGVsbG8nIH0pO1xuICogLy8gcmV0dXJucyB7IGlkOidib2InLCBxOidoZWxsbycsIHI6bnVsbCB9XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0aCAgVGhlIFVSTCBwYXRoIHRvIG1hdGNoLCBlLmcuIGAkbG9jYXRpb24ucGF0aCgpYC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzZWFyY2hQYXJhbXMgIFVSTCBzZWFyY2ggcGFyYW1ldGVycywgZS5nLiBgJGxvY2F0aW9uLnNlYXJjaCgpYC5cbiAqIEByZXR1cm5zIHtPYmplY3R9ICBUaGUgY2FwdHVyZWQgcGFyYW1ldGVyIHZhbHVlcy5cbiAqL1xuVXJsTWF0Y2hlci5wcm90b3R5cGUuZXhlYyA9IGZ1bmN0aW9uIChwYXRoLCBzZWFyY2hQYXJhbXMpIHtcbiAgdmFyIG0gPSB0aGlzLnJlZ2V4cC5leGVjKHBhdGgpO1xuICBpZiAoIW0pIHJldHVybiBudWxsO1xuXG4gIHZhciBwYXJhbXMgPSB0aGlzLnBhcmFtcywgblRvdGFsID0gcGFyYW1zLmxlbmd0aCxcbiAgICBuUGF0aCA9IHRoaXMuc2VnbWVudHMubGVuZ3RoLTEsXG4gICAgdmFsdWVzID0ge30sIGk7XG5cbiAgaWYgKG5QYXRoICE9PSBtLmxlbmd0aCAtIDEpIHRocm93IG5ldyBFcnJvcihcIlVuYmFsYW5jZWQgY2FwdHVyZSBncm91cCBpbiByb3V0ZSAnXCIgKyB0aGlzLnNvdXJjZSArIFwiJ1wiKTtcblxuICBmb3IgKGk9MDsgaTxuUGF0aDsgaSsrKSB2YWx1ZXNbcGFyYW1zW2ldXSA9IG1baSsxXTtcbiAgZm9yICgvKiovOyBpPG5Ub3RhbDsgaSsrKSB2YWx1ZXNbcGFyYW1zW2ldXSA9IHNlYXJjaFBhcmFtc1twYXJhbXNbaV1dO1xuXG4gIHJldHVybiB2YWx1ZXM7XG59O1xuXG4vKipcbiAqIEBuZ2RvYyBmdW5jdGlvblxuICogQG5hbWUgdWkucm91dGVyLnV0aWwudHlwZTpVcmxNYXRjaGVyI3BhcmFtZXRlcnNcbiAqIEBtZXRob2RPZiB1aS5yb3V0ZXIudXRpbC50eXBlOlVybE1hdGNoZXJcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFJldHVybnMgdGhlIG5hbWVzIG9mIGFsbCBwYXRoIGFuZCBzZWFyY2ggcGFyYW1ldGVycyBvZiB0aGlzIHBhdHRlcm4gaW4gYW4gdW5zcGVjaWZpZWQgb3JkZXIuXG4gKiBcbiAqIEByZXR1cm5zIHtBcnJheS48c3RyaW5nPn0gIEFuIGFycmF5IG9mIHBhcmFtZXRlciBuYW1lcy4gTXVzdCBiZSB0cmVhdGVkIGFzIHJlYWQtb25seS4gSWYgdGhlXG4gKiAgICBwYXR0ZXJuIGhhcyBubyBwYXJhbWV0ZXJzLCBhbiBlbXB0eSBhcnJheSBpcyByZXR1cm5lZC5cbiAqL1xuVXJsTWF0Y2hlci5wcm90b3R5cGUucGFyYW1ldGVycyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMucGFyYW1zO1xufTtcblxuLyoqXG4gKiBAbmdkb2MgZnVuY3Rpb25cbiAqIEBuYW1lIHVpLnJvdXRlci51dGlsLnR5cGU6VXJsTWF0Y2hlciNmb3JtYXRcbiAqIEBtZXRob2RPZiB1aS5yb3V0ZXIudXRpbC50eXBlOlVybE1hdGNoZXJcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIENyZWF0ZXMgYSBVUkwgdGhhdCBtYXRjaGVzIHRoaXMgcGF0dGVybiBieSBzdWJzdGl0dXRpbmcgdGhlIHNwZWNpZmllZCB2YWx1ZXNcbiAqIGZvciB0aGUgcGF0aCBhbmQgc2VhcmNoIHBhcmFtZXRlcnMuIE51bGwgdmFsdWVzIGZvciBwYXRoIHBhcmFtZXRlcnMgYXJlXG4gKiB0cmVhdGVkIGFzIGVtcHR5IHN0cmluZ3MuXG4gKlxuICogQGV4YW1wbGVcbiAqIGBgYFxuICogbmV3IFVybE1hdGNoZXIoJy91c2VyL3tpZH0/cScpLmZvcm1hdCh7IGlkOidib2InLCBxOid5ZXMnIH0pO1xuICogLy8gcmV0dXJucyAnL3VzZXIvYm9iP3E9eWVzJ1xuICogYGBgXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IHZhbHVlcyAgdGhlIHZhbHVlcyB0byBzdWJzdGl0dXRlIGZvciB0aGUgcGFyYW1ldGVycyBpbiB0aGlzIHBhdHRlcm4uXG4gKiBAcmV0dXJucyB7c3RyaW5nfSAgdGhlIGZvcm1hdHRlZCBVUkwgKHBhdGggYW5kIG9wdGlvbmFsbHkgc2VhcmNoIHBhcnQpLlxuICovXG5VcmxNYXRjaGVyLnByb3RvdHlwZS5mb3JtYXQgPSBmdW5jdGlvbiAodmFsdWVzKSB7XG4gIHZhciBzZWdtZW50cyA9IHRoaXMuc2VnbWVudHMsIHBhcmFtcyA9IHRoaXMucGFyYW1zO1xuICBpZiAoIXZhbHVlcykgcmV0dXJuIHNlZ21lbnRzLmpvaW4oJycpO1xuXG4gIHZhciBuUGF0aCA9IHNlZ21lbnRzLmxlbmd0aC0xLCBuVG90YWwgPSBwYXJhbXMubGVuZ3RoLFxuICAgIHJlc3VsdCA9IHNlZ21lbnRzWzBdLCBpLCBzZWFyY2gsIHZhbHVlO1xuXG4gIGZvciAoaT0wOyBpPG5QYXRoOyBpKyspIHtcbiAgICB2YWx1ZSA9IHZhbHVlc1twYXJhbXNbaV1dO1xuICAgIC8vIFRPRE86IE1heWJlIHdlIHNob3VsZCB0aHJvdyBvbiBudWxsIGhlcmU/IEl0J3Mgbm90IHJlYWxseSBnb29kIHN0eWxlIHRvIHVzZSAnJyBhbmQgbnVsbCBpbnRlcmNoYW5nZWFibGV5XG4gICAgaWYgKHZhbHVlICE9IG51bGwpIHJlc3VsdCArPSBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpO1xuICAgIHJlc3VsdCArPSBzZWdtZW50c1tpKzFdO1xuICB9XG4gIGZvciAoLyoqLzsgaTxuVG90YWw7IGkrKykge1xuICAgIHZhbHVlID0gdmFsdWVzW3BhcmFtc1tpXV07XG4gICAgaWYgKHZhbHVlICE9IG51bGwpIHtcbiAgICAgIHJlc3VsdCArPSAoc2VhcmNoID8gJyYnIDogJz8nKSArIHBhcmFtc1tpXSArICc9JyArIGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSk7XG4gICAgICBzZWFyY2ggPSB0cnVlO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59O1xuXG5cblxuLyoqXG4gKiBAbmdkb2Mgb2JqZWN0XG4gKiBAbmFtZSB1aS5yb3V0ZXIudXRpbC4kdXJsTWF0Y2hlckZhY3RvcnlcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEZhY3RvcnkgZm9yIHtAbGluayB1aS5yb3V0ZXIudXRpbC50eXBlOlVybE1hdGNoZXJ9IGluc3RhbmNlcy4gVGhlIGZhY3RvcnkgaXMgYWxzbyBhdmFpbGFibGUgdG8gcHJvdmlkZXJzXG4gKiB1bmRlciB0aGUgbmFtZSBgJHVybE1hdGNoZXJGYWN0b3J5UHJvdmlkZXJgLlxuICovXG5mdW5jdGlvbiAkVXJsTWF0Y2hlckZhY3RvcnkoKSB7XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgKiBAbmFtZSB1aS5yb3V0ZXIudXRpbC4kdXJsTWF0Y2hlckZhY3RvcnkjY29tcGlsZVxuICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnV0aWwuJHVybE1hdGNoZXJGYWN0b3J5XG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDcmVhdGVzIGEge0BsaW5rIHVpLnJvdXRlci51dGlsLnR5cGU6VXJsTWF0Y2hlcn0gZm9yIHRoZSBzcGVjaWZpZWQgcGF0dGVybi5cbiAgICogICBcbiAgICogQHBhcmFtIHtzdHJpbmd9IHBhdHRlcm4gIFRoZSBVUkwgcGF0dGVybi5cbiAgICogQHJldHVybnMge3VpLnJvdXRlci51dGlsLnR5cGU6VXJsTWF0Y2hlcn0gIFRoZSBVcmxNYXRjaGVyLlxuICAgKi9cbiAgdGhpcy5jb21waWxlID0gZnVuY3Rpb24gKHBhdHRlcm4pIHtcbiAgICByZXR1cm4gbmV3IFVybE1hdGNoZXIocGF0dGVybik7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgKiBAbmFtZSB1aS5yb3V0ZXIudXRpbC4kdXJsTWF0Y2hlckZhY3RvcnkjaXNNYXRjaGVyXG4gICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIudXRpbC4kdXJsTWF0Y2hlckZhY3RvcnlcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJldHVybnMgdHJ1ZSBpZiB0aGUgc3BlY2lmaWVkIG9iamVjdCBpcyBhIFVybE1hdGNoZXIsIG9yIGZhbHNlIG90aGVyd2lzZS5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IG9iamVjdCAgVGhlIG9iamVjdCB0byBwZXJmb3JtIHRoZSB0eXBlIGNoZWNrIGFnYWluc3QuXG4gICAqIEByZXR1cm5zIHtCb29sZWFufSAgUmV0dXJucyBgdHJ1ZWAgaWYgdGhlIG9iamVjdCBoYXMgdGhlIGZvbGxvd2luZyBmdW5jdGlvbnM6IGBleGVjYCwgYGZvcm1hdGAsIGFuZCBgY29uY2F0YC5cbiAgICovXG4gIHRoaXMuaXNNYXRjaGVyID0gZnVuY3Rpb24gKG8pIHtcbiAgICByZXR1cm4gaXNPYmplY3QobykgJiYgaXNGdW5jdGlvbihvLmV4ZWMpICYmIGlzRnVuY3Rpb24oby5mb3JtYXQpICYmIGlzRnVuY3Rpb24oby5jb25jYXQpO1xuICB9O1xuICBcbiAgLyogTm8gbmVlZCB0byBkb2N1bWVudCAkZ2V0LCBzaW5jZSBpdCByZXR1cm5zIHRoaXMgKi9cbiAgdGhpcy4kZ2V0ID0gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzO1xuICB9O1xufVxuXG4vLyBSZWdpc3RlciBhcyBhIHByb3ZpZGVyIHNvIGl0J3MgYXZhaWxhYmxlIHRvIG90aGVyIHByb3ZpZGVyc1xuYW5ndWxhci5tb2R1bGUoJ3VpLnJvdXRlci51dGlsJykucHJvdmlkZXIoJyR1cmxNYXRjaGVyRmFjdG9yeScsICRVcmxNYXRjaGVyRmFjdG9yeSk7XG5cbi8qKlxuICogQG5nZG9jIG9iamVjdFxuICogQG5hbWUgdWkucm91dGVyLnJvdXRlci4kdXJsUm91dGVyUHJvdmlkZXJcbiAqXG4gKiBAcmVxdWlyZXMgdWkucm91dGVyLnV0aWwuJHVybE1hdGNoZXJGYWN0b3J5UHJvdmlkZXJcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIGAkdXJsUm91dGVyUHJvdmlkZXJgIGhhcyB0aGUgcmVzcG9uc2liaWxpdHkgb2Ygd2F0Y2hpbmcgYCRsb2NhdGlvbmAuIFxuICogV2hlbiBgJGxvY2F0aW9uYCBjaGFuZ2VzIGl0IHJ1bnMgdGhyb3VnaCBhIGxpc3Qgb2YgcnVsZXMgb25lIGJ5IG9uZSB1bnRpbCBhIFxuICogbWF0Y2ggaXMgZm91bmQuIGAkdXJsUm91dGVyUHJvdmlkZXJgIGlzIHVzZWQgYmVoaW5kIHRoZSBzY2VuZXMgYW55dGltZSB5b3Ugc3BlY2lmeSBcbiAqIGEgdXJsIGluIGEgc3RhdGUgY29uZmlndXJhdGlvbi4gQWxsIHVybHMgYXJlIGNvbXBpbGVkIGludG8gYSBVcmxNYXRjaGVyIG9iamVjdC5cbiAqXG4gKiBUaGVyZSBhcmUgc2V2ZXJhbCBtZXRob2RzIG9uIGAkdXJsUm91dGVyUHJvdmlkZXJgIHRoYXQgbWFrZSBpdCB1c2VmdWwgdG8gdXNlIGRpcmVjdGx5XG4gKiBpbiB5b3VyIG1vZHVsZSBjb25maWcuXG4gKi9cbiRVcmxSb3V0ZXJQcm92aWRlci4kaW5qZWN0ID0gWyckdXJsTWF0Y2hlckZhY3RvcnlQcm92aWRlciddO1xuZnVuY3Rpb24gJFVybFJvdXRlclByb3ZpZGVyKCAgJHVybE1hdGNoZXJGYWN0b3J5KSB7XG4gIHZhciBydWxlcyA9IFtdLCBcbiAgICAgIG90aGVyd2lzZSA9IG51bGw7XG5cbiAgLy8gUmV0dXJucyBhIHN0cmluZyB0aGF0IGlzIGEgcHJlZml4IG9mIGFsbCBzdHJpbmdzIG1hdGNoaW5nIHRoZSBSZWdFeHBcbiAgZnVuY3Rpb24gcmVnRXhwUHJlZml4KHJlKSB7XG4gICAgdmFyIHByZWZpeCA9IC9eXFxeKCg/OlxcXFxbXmEtekEtWjAtOV18W15cXFxcXFxbXFxdXFxeJCorPy4oKXx7fV0rKSopLy5leGVjKHJlLnNvdXJjZSk7XG4gICAgcmV0dXJuIChwcmVmaXggIT0gbnVsbCkgPyBwcmVmaXhbMV0ucmVwbGFjZSgvXFxcXCguKS9nLCBcIiQxXCIpIDogJyc7XG4gIH1cblxuICAvLyBJbnRlcnBvbGF0ZXMgbWF0Y2hlZCB2YWx1ZXMgaW50byBhIFN0cmluZy5yZXBsYWNlKCktc3R5bGUgcGF0dGVyblxuICBmdW5jdGlvbiBpbnRlcnBvbGF0ZShwYXR0ZXJuLCBtYXRjaCkge1xuICAgIHJldHVybiBwYXR0ZXJuLnJlcGxhY2UoL1xcJChcXCR8XFxkezEsMn0pLywgZnVuY3Rpb24gKG0sIHdoYXQpIHtcbiAgICAgIHJldHVybiBtYXRjaFt3aGF0ID09PSAnJCcgPyAwIDogTnVtYmVyKHdoYXQpXTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICogQG5hbWUgdWkucm91dGVyLnJvdXRlci4kdXJsUm91dGVyUHJvdmlkZXIjcnVsZVxuICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnJvdXRlci4kdXJsUm91dGVyUHJvdmlkZXJcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIERlZmluZXMgcnVsZXMgdGhhdCBhcmUgdXNlZCBieSBgJHVybFJvdXRlclByb3ZpZGVyIHRvIGZpbmQgbWF0Y2hlcyBmb3JcbiAgICogc3BlY2lmaWMgVVJMcy5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogPHByZT5cbiAgICogdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbJ3VpLnJvdXRlci5yb3V0ZXInXSk7XG4gICAqXG4gICAqIGFwcC5jb25maWcoZnVuY3Rpb24gKCR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgKiAgIC8vIEhlcmUncyBhbiBleGFtcGxlIG9mIGhvdyB5b3UgbWlnaHQgYWxsb3cgY2FzZSBpbnNlbnNpdGl2ZSB1cmxzXG4gICAqICAgJHVybFJvdXRlclByb3ZpZGVyLnJ1bGUoZnVuY3Rpb24gKCRpbmplY3RvciwgJGxvY2F0aW9uKSB7XG4gICAqICAgICB2YXIgcGF0aCA9ICRsb2NhdGlvbi5wYXRoKCksXG4gICAqICAgICAgICAgbm9ybWFsaXplZCA9IHBhdGgudG9Mb3dlckNhc2UoKTtcbiAgICpcbiAgICogICAgIGlmIChwYXRoICE9PSBub3JtYWxpemVkKSB7XG4gICAqICAgICAgIHJldHVybiBub3JtYWxpemVkO1xuICAgKiAgICAgfVxuICAgKiAgIH0pO1xuICAgKiB9KTtcbiAgICogPC9wcmU+XG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBydWxlIEhhbmRsZXIgZnVuY3Rpb24gdGhhdCB0YWtlcyBgJGluamVjdG9yYCBhbmQgYCRsb2NhdGlvbmBcbiAgICogc2VydmljZXMgYXMgYXJndW1lbnRzLiBZb3UgY2FuIHVzZSB0aGVtIHRvIHJldHVybiBhIHZhbGlkIHBhdGggYXMgYSBzdHJpbmcuXG4gICAqXG4gICAqIEByZXR1cm4ge29iamVjdH0gJHVybFJvdXRlclByb3ZpZGVyIC0gJHVybFJvdXRlclByb3ZpZGVyIGluc3RhbmNlXG4gICAqL1xuICB0aGlzLnJ1bGUgPVxuICAgIGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICBpZiAoIWlzRnVuY3Rpb24ocnVsZSkpIHRocm93IG5ldyBFcnJvcihcIidydWxlJyBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG4gICAgICBydWxlcy5wdXNoKHJ1bGUpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAvKipcbiAgICogQG5nZG9jIG9iamVjdFxuICAgKiBAbmFtZSB1aS5yb3V0ZXIucm91dGVyLiR1cmxSb3V0ZXJQcm92aWRlciNvdGhlcndpc2VcbiAgICogQG1ldGhvZE9mIHVpLnJvdXRlci5yb3V0ZXIuJHVybFJvdXRlclByb3ZpZGVyXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBEZWZpbmVzIGEgcGF0aCB0aGF0IGlzIHVzZWQgd2hlbiBhbiBpbnZhbGllZCByb3V0ZSBpcyByZXF1ZXN0ZWQuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIDxwcmU+XG4gICAqIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyd1aS5yb3V0ZXIucm91dGVyJ10pO1xuICAgKlxuICAgKiBhcHAuY29uZmlnKGZ1bmN0aW9uICgkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICogICAvLyBpZiB0aGUgcGF0aCBkb2Vzbid0IG1hdGNoIGFueSBvZiB0aGUgdXJscyB5b3UgY29uZmlndXJlZFxuICAgKiAgIC8vIG90aGVyd2lzZSB3aWxsIHRha2UgY2FyZSBvZiByb3V0aW5nIHRoZSB1c2VyIHRvIHRoZVxuICAgKiAgIC8vIHNwZWNpZmllZCB1cmxcbiAgICogICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKCcvaW5kZXgnKTtcbiAgICpcbiAgICogICAvLyBFeGFtcGxlIG9mIHVzaW5nIGZ1bmN0aW9uIHJ1bGUgYXMgcGFyYW1cbiAgICogICAkdXJsUm91dGVyUHJvdmlkZXIub3RoZXJ3aXNlKGZ1bmN0aW9uICgkaW5qZWN0b3IsICRsb2NhdGlvbikge1xuICAgKiAgICAgLi4uXG4gICAqICAgfSk7XG4gICAqIH0pO1xuICAgKiA8L3ByZT5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSBydWxlIFRoZSB1cmwgcGF0aCB5b3Ugd2FudCB0byByZWRpcmVjdCB0byBvciBhIGZ1bmN0aW9uIFxuICAgKiBydWxlIHRoYXQgcmV0dXJucyB0aGUgdXJsIHBhdGguIFRoZSBmdW5jdGlvbiB2ZXJzaW9uIGlzIHBhc3NlZCB0d28gcGFyYW1zOiBcbiAgICogYCRpbmplY3RvcmAgYW5kIGAkbG9jYXRpb25gIHNlcnZpY2VzLlxuICAgKlxuICAgKiBAcmV0dXJuIHtvYmplY3R9ICR1cmxSb3V0ZXJQcm92aWRlciAtICR1cmxSb3V0ZXJQcm92aWRlciBpbnN0YW5jZVxuICAgKi9cbiAgdGhpcy5vdGhlcndpc2UgPVxuICAgIGZ1bmN0aW9uIChydWxlKSB7XG4gICAgICBpZiAoaXNTdHJpbmcocnVsZSkpIHtcbiAgICAgICAgdmFyIHJlZGlyZWN0ID0gcnVsZTtcbiAgICAgICAgcnVsZSA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIHJlZGlyZWN0OyB9O1xuICAgICAgfVxuICAgICAgZWxzZSBpZiAoIWlzRnVuY3Rpb24ocnVsZSkpIHRocm93IG5ldyBFcnJvcihcIidydWxlJyBtdXN0IGJlIGEgZnVuY3Rpb25cIik7XG4gICAgICBvdGhlcndpc2UgPSBydWxlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuXG4gIGZ1bmN0aW9uIGhhbmRsZUlmTWF0Y2goJGluamVjdG9yLCBoYW5kbGVyLCBtYXRjaCkge1xuICAgIGlmICghbWF0Y2gpIHJldHVybiBmYWxzZTtcbiAgICB2YXIgcmVzdWx0ID0gJGluamVjdG9yLmludm9rZShoYW5kbGVyLCBoYW5kbGVyLCB7ICRtYXRjaDogbWF0Y2ggfSk7XG4gICAgcmV0dXJuIGlzRGVmaW5lZChyZXN1bHQpID8gcmVzdWx0IDogdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICogQG5hbWUgdWkucm91dGVyLnJvdXRlci4kdXJsUm91dGVyUHJvdmlkZXIjd2hlblxuICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnJvdXRlci4kdXJsUm91dGVyUHJvdmlkZXJcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlZ2lzdGVycyBhIGhhbmRsZXIgZm9yIGEgZ2l2ZW4gdXJsIG1hdGNoaW5nLiBpZiBoYW5kbGUgaXMgYSBzdHJpbmcsIGl0IGlzXG4gICAqIHRyZWF0ZWQgYXMgYSByZWRpcmVjdCwgYW5kIGlzIGludGVycG9sYXRlZCBhY2NvcmRpbmcgdG8gdGhlIHN5eW50YXggb2YgbWF0Y2hcbiAgICogKGkuZS4gbGlrZSBTdHJpbmcucmVwbGFjZSgpIGZvciBSZWdFeHAsIG9yIGxpa2UgYSBVcmxNYXRjaGVyIHBhdHRlcm4gb3RoZXJ3aXNlKS5cbiAgICpcbiAgICogSWYgdGhlIGhhbmRsZXIgaXMgYSBmdW5jdGlvbiwgaXQgaXMgaW5qZWN0YWJsZS4gSXQgZ2V0cyBpbnZva2VkIGlmIGAkbG9jYXRpb25gXG4gICAqIG1hdGNoZXMuIFlvdSBoYXZlIHRoZSBvcHRpb24gb2YgaW5qZWN0IHRoZSBtYXRjaCBvYmplY3QgYXMgYCRtYXRjaGAuXG4gICAqXG4gICAqIFRoZSBoYW5kbGVyIGNhbiByZXR1cm5cbiAgICpcbiAgICogLSAqKmZhbHN5KiogdG8gaW5kaWNhdGUgdGhhdCB0aGUgcnVsZSBkaWRuJ3QgbWF0Y2ggYWZ0ZXIgYWxsLCB0aGVuIGAkdXJsUm91dGVyYFxuICAgKiAgIHdpbGwgY29udGludWUgdHJ5aW5nIHRvIGZpbmQgYW5vdGhlciBvbmUgdGhhdCBtYXRjaGVzLlxuICAgKiAtICoqc3RyaW5nKiogd2hpY2ggaXMgdHJlYXRlZCBhcyBhIHJlZGlyZWN0IGFuZCBwYXNzZWQgdG8gYCRsb2NhdGlvbi51cmwoKWBcbiAgICogLSAqKnZvaWQqKiBvciBhbnkgKip0cnV0aHkqKiB2YWx1ZSB0ZWxscyBgJHVybFJvdXRlcmAgdGhhdCB0aGUgdXJsIHdhcyBoYW5kbGVkLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiA8cHJlPlxuICAgKiB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsndWkucm91dGVyLnJvdXRlciddKTtcbiAgICpcbiAgICogYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAqICAgJHVybFJvdXRlclByb3ZpZGVyLndoZW4oJHN0YXRlLnVybCwgZnVuY3Rpb24gKCRtYXRjaCwgJHN0YXRlUGFyYW1zKSB7XG4gICAqICAgICBpZiAoJHN0YXRlLiRjdXJyZW50Lm5hdmlnYWJsZSAhPT0gc3RhdGUgfHxcbiAgICogICAgICAgICAhZXF1YWxGb3JLZXlzKCRtYXRjaCwgJHN0YXRlUGFyYW1zKSB7XG4gICAqICAgICAgJHN0YXRlLnRyYW5zaXRpb25UbyhzdGF0ZSwgJG1hdGNoLCBmYWxzZSk7XG4gICAqICAgICB9XG4gICAqICAgfSk7XG4gICAqIH0pO1xuICAgKiA8L3ByZT5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSB3aGF0IFRoZSBpbmNvbWluZyBwYXRoIHRoYXQgeW91IHdhbnQgdG8gcmVkaXJlY3QuXG4gICAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gaGFuZGxlciBUaGUgcGF0aCB5b3Ugd2FudCB0byByZWRpcmVjdCB5b3VyIHVzZXIgdG8uXG4gICAqL1xuICB0aGlzLndoZW4gPVxuICAgIGZ1bmN0aW9uICh3aGF0LCBoYW5kbGVyKSB7XG4gICAgICB2YXIgcmVkaXJlY3QsIGhhbmRsZXJJc1N0cmluZyA9IGlzU3RyaW5nKGhhbmRsZXIpO1xuICAgICAgaWYgKGlzU3RyaW5nKHdoYXQpKSB3aGF0ID0gJHVybE1hdGNoZXJGYWN0b3J5LmNvbXBpbGUod2hhdCk7XG5cbiAgICAgIGlmICghaGFuZGxlcklzU3RyaW5nICYmICFpc0Z1bmN0aW9uKGhhbmRsZXIpICYmICFpc0FycmF5KGhhbmRsZXIpKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbnZhbGlkICdoYW5kbGVyJyBpbiB3aGVuKClcIik7XG5cbiAgICAgIHZhciBzdHJhdGVnaWVzID0ge1xuICAgICAgICBtYXRjaGVyOiBmdW5jdGlvbiAod2hhdCwgaGFuZGxlcikge1xuICAgICAgICAgIGlmIChoYW5kbGVySXNTdHJpbmcpIHtcbiAgICAgICAgICAgIHJlZGlyZWN0ID0gJHVybE1hdGNoZXJGYWN0b3J5LmNvbXBpbGUoaGFuZGxlcik7XG4gICAgICAgICAgICBoYW5kbGVyID0gWyckbWF0Y2gnLCBmdW5jdGlvbiAoJG1hdGNoKSB7IHJldHVybiByZWRpcmVjdC5mb3JtYXQoJG1hdGNoKTsgfV07XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBleHRlbmQoZnVuY3Rpb24gKCRpbmplY3RvciwgJGxvY2F0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlSWZNYXRjaCgkaW5qZWN0b3IsIGhhbmRsZXIsIHdoYXQuZXhlYygkbG9jYXRpb24ucGF0aCgpLCAkbG9jYXRpb24uc2VhcmNoKCkpKTtcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBwcmVmaXg6IGlzU3RyaW5nKHdoYXQucHJlZml4KSA/IHdoYXQucHJlZml4IDogJydcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSxcbiAgICAgICAgcmVnZXg6IGZ1bmN0aW9uICh3aGF0LCBoYW5kbGVyKSB7XG4gICAgICAgICAgaWYgKHdoYXQuZ2xvYmFsIHx8IHdoYXQuc3RpY2t5KSB0aHJvdyBuZXcgRXJyb3IoXCJ3aGVuKCkgUmVnRXhwIG11c3Qgbm90IGJlIGdsb2JhbCBvciBzdGlja3lcIik7XG5cbiAgICAgICAgICBpZiAoaGFuZGxlcklzU3RyaW5nKSB7XG4gICAgICAgICAgICByZWRpcmVjdCA9IGhhbmRsZXI7XG4gICAgICAgICAgICBoYW5kbGVyID0gWyckbWF0Y2gnLCBmdW5jdGlvbiAoJG1hdGNoKSB7IHJldHVybiBpbnRlcnBvbGF0ZShyZWRpcmVjdCwgJG1hdGNoKTsgfV07XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBleHRlbmQoZnVuY3Rpb24gKCRpbmplY3RvciwgJGxvY2F0aW9uKSB7XG4gICAgICAgICAgICByZXR1cm4gaGFuZGxlSWZNYXRjaCgkaW5qZWN0b3IsIGhhbmRsZXIsIHdoYXQuZXhlYygkbG9jYXRpb24ucGF0aCgpKSk7XG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgcHJlZml4OiByZWdFeHBQcmVmaXgod2hhdClcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdmFyIGNoZWNrID0geyBtYXRjaGVyOiAkdXJsTWF0Y2hlckZhY3RvcnkuaXNNYXRjaGVyKHdoYXQpLCByZWdleDogd2hhdCBpbnN0YW5jZW9mIFJlZ0V4cCB9O1xuXG4gICAgICBmb3IgKHZhciBuIGluIGNoZWNrKSB7XG4gICAgICAgIGlmIChjaGVja1tuXSkge1xuICAgICAgICAgIHJldHVybiB0aGlzLnJ1bGUoc3RyYXRlZ2llc1tuXSh3aGF0LCBoYW5kbGVyKSk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCAnd2hhdCcgaW4gd2hlbigpXCIpO1xuICAgIH07XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBvYmplY3RcbiAgICogQG5hbWUgdWkucm91dGVyLnJvdXRlci4kdXJsUm91dGVyXG4gICAqXG4gICAqIEByZXF1aXJlcyAkbG9jYXRpb25cbiAgICogQHJlcXVpcmVzICRyb290U2NvcGVcbiAgICogQHJlcXVpcmVzICRpbmplY3RvclxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICpcbiAgICovXG4gIHRoaXMuJGdldCA9XG4gICAgWyAgICAgICAgJyRsb2NhdGlvbicsICckcm9vdFNjb3BlJywgJyRpbmplY3RvcicsXG4gICAgZnVuY3Rpb24gKCRsb2NhdGlvbiwgICAkcm9vdFNjb3BlLCAgICRpbmplY3Rvcikge1xuICAgICAgLy8gVE9ETzogT3B0aW1pemUgZ3JvdXBzIG9mIHJ1bGVzIHdpdGggbm9uLWVtcHR5IHByZWZpeCBpbnRvIHNvbWUgc29ydCBvZiBkZWNpc2lvbiB0cmVlXG4gICAgICBmdW5jdGlvbiB1cGRhdGUoZXZ0KSB7XG4gICAgICAgIGlmIChldnQgJiYgZXZ0LmRlZmF1bHRQcmV2ZW50ZWQpIHJldHVybjtcbiAgICAgICAgZnVuY3Rpb24gY2hlY2socnVsZSkge1xuICAgICAgICAgIHZhciBoYW5kbGVkID0gcnVsZSgkaW5qZWN0b3IsICRsb2NhdGlvbik7XG4gICAgICAgICAgaWYgKGhhbmRsZWQpIHtcbiAgICAgICAgICAgIGlmIChpc1N0cmluZyhoYW5kbGVkKSkgJGxvY2F0aW9uLnJlcGxhY2UoKS51cmwoaGFuZGxlZCk7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHZhciBuPXJ1bGVzLmxlbmd0aCwgaTtcbiAgICAgICAgZm9yIChpPTA7IGk8bjsgaSsrKSB7XG4gICAgICAgICAgaWYgKGNoZWNrKHJ1bGVzW2ldKSkgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIC8vIGFsd2F5cyBjaGVjayBvdGhlcndpc2UgbGFzdCB0byBhbGxvdyBkeW5hbWljIHVwZGF0ZXMgdG8gdGhlIHNldCBvZiBydWxlc1xuICAgICAgICBpZiAob3RoZXJ3aXNlKSBjaGVjayhvdGhlcndpc2UpO1xuICAgICAgfVxuXG4gICAgICAkcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3VjY2VzcycsIHVwZGF0ZSk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICAgICAgICogQG5hbWUgdWkucm91dGVyLnJvdXRlci4kdXJsUm91dGVyI3N5bmNcbiAgICAgICAgICogQG1ldGhvZE9mIHVpLnJvdXRlci5yb3V0ZXIuJHVybFJvdXRlclxuICAgICAgICAgKlxuICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICogVHJpZ2dlcnMgYW4gdXBkYXRlOyB0aGUgc2FtZSB1cGRhdGUgdGhhdCBoYXBwZW5zIHdoZW4gdGhlIGFkZHJlc3MgYmFyIHVybCBjaGFuZ2VzLCBha2EgYCRsb2NhdGlvbkNoYW5nZVN1Y2Nlc3NgLlxuICAgICAgICAgKiBUaGlzIG1ldGhvZCBpcyB1c2VmdWwgd2hlbiB5b3UgbmVlZCB0byB1c2UgYHByZXZlbnREZWZhdWx0KClgIG9uIHRoZSBgJGxvY2F0aW9uQ2hhbmdlU3VjY2Vzc2AgZXZlbnQsIFxuICAgICAgICAgKiBwZXJmb3JtIHNvbWUgY3VzdG9tIGxvZ2ljIChyb3V0ZSBwcm90ZWN0aW9uLCBhdXRoLCBjb25maWcsIHJlZGlyZWN0aW9uLCBldGMpIGFuZCB0aGVuIGZpbmFsbHkgcHJvY2VlZCBcbiAgICAgICAgICogd2l0aCB0aGUgdHJhbnNpdGlvbiBieSBjYWxsaW5nIGAkdXJsUm91dGVyLnN5bmMoKWAuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqIDxwcmU+XG4gICAgICAgICAqIGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbJ3VpLnJvdXRlciddKTtcbiAgICAgICAgICogICAucnVuKGZ1bmN0aW9uKCRyb290U2NvcGUsICR1cmxSb3V0ZXIpIHtcbiAgICAgICAgICogICAgICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgICAqICAgICAgIC8vIEhhbHQgc3RhdGUgY2hhbmdlIGZyb20gZXZlbiBzdGFydGluZ1xuICAgICAgICAgKiAgICAgICBldnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICogICAgICAgLy8gUGVyZm9ybSBjdXN0b20gbG9naWNcbiAgICAgICAgICogICAgICAgdmFyIG1lZXRzUmVxdWlyZW1lbnQgPSAuLi5cbiAgICAgICAgICogICAgICAgLy8gQ29udGludWUgd2l0aCB0aGUgdXBkYXRlIGFuZCBzdGF0ZSB0cmFuc2l0aW9uIGlmIGxvZ2ljIGFsbG93c1xuICAgICAgICAgKiAgICAgICBpZiAobWVldHNSZXF1aXJlbWVudCkgJHVybFJvdXRlci5zeW5jKCk7XG4gICAgICAgICAqICAgICB9KTtcbiAgICAgICAgICogfSk7XG4gICAgICAgICAqIDwvcHJlPlxuICAgICAgICAgKi9cbiAgICAgICAgc3luYzogZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHVwZGF0ZSgpO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1dO1xufVxuXG5hbmd1bGFyLm1vZHVsZSgndWkucm91dGVyLnJvdXRlcicpLnByb3ZpZGVyKCckdXJsUm91dGVyJywgJFVybFJvdXRlclByb3ZpZGVyKTtcblxuLyoqXG4gKiBAbmdkb2Mgb2JqZWN0XG4gKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlUHJvdmlkZXJcbiAqXG4gKiBAcmVxdWlyZXMgdWkucm91dGVyLnJvdXRlci4kdXJsUm91dGVyUHJvdmlkZXJcbiAqIEByZXF1aXJlcyB1aS5yb3V0ZXIudXRpbC4kdXJsTWF0Y2hlckZhY3RvcnlQcm92aWRlclxuICogQHJlcXVpcmVzICRsb2NhdGlvblByb3ZpZGVyXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBUaGUgbmV3IGAkc3RhdGVQcm92aWRlcmAgd29ya3Mgc2ltaWxhciB0byBBbmd1bGFyJ3MgdjEgcm91dGVyLCBidXQgaXQgZm9jdXNlcyBwdXJlbHlcbiAqIG9uIHN0YXRlLlxuICpcbiAqIEEgc3RhdGUgY29ycmVzcG9uZHMgdG8gYSBcInBsYWNlXCIgaW4gdGhlIGFwcGxpY2F0aW9uIGluIHRlcm1zIG9mIHRoZSBvdmVyYWxsIFVJIGFuZFxuICogbmF2aWdhdGlvbi4gQSBzdGF0ZSBkZXNjcmliZXMgKHZpYSB0aGUgY29udHJvbGxlciAvIHRlbXBsYXRlIC8gdmlldyBwcm9wZXJ0aWVzKSB3aGF0XG4gKiB0aGUgVUkgbG9va3MgbGlrZSBhbmQgZG9lcyBhdCB0aGF0IHBsYWNlLlxuICpcbiAqIFN0YXRlcyBvZnRlbiBoYXZlIHRoaW5ncyBpbiBjb21tb24sIGFuZCB0aGUgcHJpbWFyeSB3YXkgb2YgZmFjdG9yaW5nIG91dCB0aGVzZVxuICogY29tbW9uYWxpdGllcyBpbiB0aGlzIG1vZGVsIGlzIHZpYSB0aGUgc3RhdGUgaGllcmFyY2h5LCBpLmUuIHBhcmVudC9jaGlsZCBzdGF0ZXMgYWthXG4gKiBuZXN0ZWQgc3RhdGVzLlxuICpcbiAqIFRoZSBgJHN0YXRlUHJvdmlkZXJgIHByb3ZpZGVzIGludGVyZmFjZXMgdG8gZGVjbGFyZSB0aGVzZSBzdGF0ZXMgZm9yIHlvdXIgYXBwLlxuICovXG4kU3RhdGVQcm92aWRlci4kaW5qZWN0ID0gWyckdXJsUm91dGVyUHJvdmlkZXInLCAnJHVybE1hdGNoZXJGYWN0b3J5UHJvdmlkZXInLCAnJGxvY2F0aW9uUHJvdmlkZXInXTtcbmZ1bmN0aW9uICRTdGF0ZVByb3ZpZGVyKCAgICR1cmxSb3V0ZXJQcm92aWRlciwgICAkdXJsTWF0Y2hlckZhY3RvcnksICAgICAgICAgICAkbG9jYXRpb25Qcm92aWRlcikge1xuXG4gIHZhciByb290LCBzdGF0ZXMgPSB7fSwgJHN0YXRlLCBxdWV1ZSA9IHt9LCBhYnN0cmFjdEtleSA9ICdhYnN0cmFjdCc7XG5cbiAgLy8gQnVpbGRzIHN0YXRlIHByb3BlcnRpZXMgZnJvbSBkZWZpbml0aW9uIHBhc3NlZCB0byByZWdpc3RlclN0YXRlKClcbiAgdmFyIHN0YXRlQnVpbGRlciA9IHtcblxuICAgIC8vIERlcml2ZSBwYXJlbnQgc3RhdGUgZnJvbSBhIGhpZXJhcmNoaWNhbCBuYW1lIG9ubHkgaWYgJ3BhcmVudCcgaXMgbm90IGV4cGxpY2l0bHkgZGVmaW5lZC5cbiAgICAvLyBzdGF0ZS5jaGlsZHJlbiA9IFtdO1xuICAgIC8vIGlmIChwYXJlbnQpIHBhcmVudC5jaGlsZHJlbi5wdXNoKHN0YXRlKTtcbiAgICBwYXJlbnQ6IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICBpZiAoaXNEZWZpbmVkKHN0YXRlLnBhcmVudCkgJiYgc3RhdGUucGFyZW50KSByZXR1cm4gZmluZFN0YXRlKHN0YXRlLnBhcmVudCk7XG4gICAgICAvLyByZWdleCBtYXRjaGVzIGFueSB2YWxpZCBjb21wb3NpdGUgc3RhdGUgbmFtZVxuICAgICAgLy8gd291bGQgbWF0Y2ggXCJjb250YWN0Lmxpc3RcIiBidXQgbm90IFwiY29udGFjdHNcIlxuICAgICAgdmFyIGNvbXBvc2l0ZU5hbWUgPSAvXiguKylcXC5bXi5dKyQvLmV4ZWMoc3RhdGUubmFtZSk7XG4gICAgICByZXR1cm4gY29tcG9zaXRlTmFtZSA/IGZpbmRTdGF0ZShjb21wb3NpdGVOYW1lWzFdKSA6IHJvb3Q7XG4gICAgfSxcblxuICAgIC8vIGluaGVyaXQgJ2RhdGEnIGZyb20gcGFyZW50IGFuZCBvdmVycmlkZSBieSBvd24gdmFsdWVzIChpZiBhbnkpXG4gICAgZGF0YTogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgIGlmIChzdGF0ZS5wYXJlbnQgJiYgc3RhdGUucGFyZW50LmRhdGEpIHtcbiAgICAgICAgc3RhdGUuZGF0YSA9IHN0YXRlLnNlbGYuZGF0YSA9IGV4dGVuZCh7fSwgc3RhdGUucGFyZW50LmRhdGEsIHN0YXRlLmRhdGEpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHN0YXRlLmRhdGE7XG4gICAgfSxcblxuICAgIC8vIEJ1aWxkIGEgVVJMTWF0Y2hlciBpZiBuZWNlc3NhcnksIGVpdGhlciB2aWEgYSByZWxhdGl2ZSBvciBhYnNvbHV0ZSBVUkxcbiAgICB1cmw6IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICB2YXIgdXJsID0gc3RhdGUudXJsO1xuXG4gICAgICBpZiAoaXNTdHJpbmcodXJsKSkge1xuICAgICAgICBpZiAodXJsLmNoYXJBdCgwKSA9PSAnXicpIHtcbiAgICAgICAgICByZXR1cm4gJHVybE1hdGNoZXJGYWN0b3J5LmNvbXBpbGUodXJsLnN1YnN0cmluZygxKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIChzdGF0ZS5wYXJlbnQubmF2aWdhYmxlIHx8IHJvb3QpLnVybC5jb25jYXQodXJsKTtcbiAgICAgIH1cblxuICAgICAgaWYgKCR1cmxNYXRjaGVyRmFjdG9yeS5pc01hdGNoZXIodXJsKSB8fCB1cmwgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gdXJsO1xuICAgICAgfVxuICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB1cmwgJ1wiICsgdXJsICsgXCInIGluIHN0YXRlICdcIiArIHN0YXRlICsgXCInXCIpO1xuICAgIH0sXG5cbiAgICAvLyBLZWVwIHRyYWNrIG9mIHRoZSBjbG9zZXN0IGFuY2VzdG9yIHN0YXRlIHRoYXQgaGFzIGEgVVJMIChpLmUuIGlzIG5hdmlnYWJsZSlcbiAgICBuYXZpZ2FibGU6IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICByZXR1cm4gc3RhdGUudXJsID8gc3RhdGUgOiAoc3RhdGUucGFyZW50ID8gc3RhdGUucGFyZW50Lm5hdmlnYWJsZSA6IG51bGwpO1xuICAgIH0sXG5cbiAgICAvLyBEZXJpdmUgcGFyYW1ldGVycyBmb3IgdGhpcyBzdGF0ZSBhbmQgZW5zdXJlIHRoZXkncmUgYSBzdXBlci1zZXQgb2YgcGFyZW50J3MgcGFyYW1ldGVyc1xuICAgIHBhcmFtczogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgIGlmICghc3RhdGUucGFyYW1zKSB7XG4gICAgICAgIHJldHVybiBzdGF0ZS51cmwgPyBzdGF0ZS51cmwucGFyYW1ldGVycygpIDogc3RhdGUucGFyZW50LnBhcmFtcztcbiAgICAgIH1cbiAgICAgIGlmICghaXNBcnJheShzdGF0ZS5wYXJhbXMpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHBhcmFtcyBpbiBzdGF0ZSAnXCIgKyBzdGF0ZSArIFwiJ1wiKTtcbiAgICAgIGlmIChzdGF0ZS51cmwpIHRocm93IG5ldyBFcnJvcihcIkJvdGggcGFyYW1zIGFuZCB1cmwgc3BlY2ljaWZpZWQgaW4gc3RhdGUgJ1wiICsgc3RhdGUgKyBcIidcIik7XG4gICAgICByZXR1cm4gc3RhdGUucGFyYW1zO1xuICAgIH0sXG5cbiAgICAvLyBJZiB0aGVyZSBpcyBubyBleHBsaWNpdCBtdWx0aS12aWV3IGNvbmZpZ3VyYXRpb24sIG1ha2Ugb25lIHVwIHNvIHdlIGRvbid0IGhhdmVcbiAgICAvLyB0byBoYW5kbGUgYm90aCBjYXNlcyBpbiB0aGUgdmlldyBkaXJlY3RpdmUgbGF0ZXIuIE5vdGUgdGhhdCBoYXZpbmcgYW4gZXhwbGljaXRcbiAgICAvLyAndmlld3MnIHByb3BlcnR5IHdpbGwgbWVhbiB0aGUgZGVmYXVsdCB1bm5hbWVkIHZpZXcgcHJvcGVydGllcyBhcmUgaWdub3JlZC4gVGhpc1xuICAgIC8vIGlzIGFsc28gYSBnb29kIHRpbWUgdG8gcmVzb2x2ZSB2aWV3IG5hbWVzIHRvIGFic29sdXRlIG5hbWVzLCBzbyBldmVyeXRoaW5nIGlzIGFcbiAgICAvLyBzdHJhaWdodCBsb29rdXAgYXQgbGluayB0aW1lLlxuICAgIHZpZXdzOiBmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgdmFyIHZpZXdzID0ge307XG5cbiAgICAgIGZvckVhY2goaXNEZWZpbmVkKHN0YXRlLnZpZXdzKSA/IHN0YXRlLnZpZXdzIDogeyAnJzogc3RhdGUgfSwgZnVuY3Rpb24gKHZpZXcsIG5hbWUpIHtcbiAgICAgICAgaWYgKG5hbWUuaW5kZXhPZignQCcpIDwgMCkgbmFtZSArPSAnQCcgKyBzdGF0ZS5wYXJlbnQubmFtZTtcbiAgICAgICAgdmlld3NbbmFtZV0gPSB2aWV3O1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gdmlld3M7XG4gICAgfSxcblxuICAgIG93blBhcmFtczogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgIGlmICghc3RhdGUucGFyZW50KSB7XG4gICAgICAgIHJldHVybiBzdGF0ZS5wYXJhbXM7XG4gICAgICB9XG4gICAgICB2YXIgcGFyYW1OYW1lcyA9IHt9OyBmb3JFYWNoKHN0YXRlLnBhcmFtcywgZnVuY3Rpb24gKHApIHsgcGFyYW1OYW1lc1twXSA9IHRydWU7IH0pO1xuXG4gICAgICBmb3JFYWNoKHN0YXRlLnBhcmVudC5wYXJhbXMsIGZ1bmN0aW9uIChwKSB7XG4gICAgICAgIGlmICghcGFyYW1OYW1lc1twXSkge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk1pc3NpbmcgcmVxdWlyZWQgcGFyYW1ldGVyICdcIiArIHAgKyBcIicgaW4gc3RhdGUgJ1wiICsgc3RhdGUubmFtZSArIFwiJ1wiKTtcbiAgICAgICAgfVxuICAgICAgICBwYXJhbU5hbWVzW3BdID0gZmFsc2U7XG4gICAgICB9KTtcbiAgICAgIHZhciBvd25QYXJhbXMgPSBbXTtcblxuICAgICAgZm9yRWFjaChwYXJhbU5hbWVzLCBmdW5jdGlvbiAob3duLCBwKSB7XG4gICAgICAgIGlmIChvd24pIG93blBhcmFtcy5wdXNoKHApO1xuICAgICAgfSk7XG4gICAgICByZXR1cm4gb3duUGFyYW1zO1xuICAgIH0sXG5cbiAgICAvLyBLZWVwIGEgZnVsbCBwYXRoIGZyb20gdGhlIHJvb3QgZG93biB0byB0aGlzIHN0YXRlIGFzIHRoaXMgaXMgbmVlZGVkIGZvciBzdGF0ZSBhY3RpdmF0aW9uLlxuICAgIHBhdGg6IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICByZXR1cm4gc3RhdGUucGFyZW50ID8gc3RhdGUucGFyZW50LnBhdGguY29uY2F0KHN0YXRlKSA6IFtdOyAvLyBleGNsdWRlIHJvb3QgZnJvbSBwYXRoXG4gICAgfSxcblxuICAgIC8vIFNwZWVkIHVwICRzdGF0ZS5jb250YWlucygpIGFzIGl0J3MgdXNlZCBhIGxvdFxuICAgIGluY2x1ZGVzOiBmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgdmFyIGluY2x1ZGVzID0gc3RhdGUucGFyZW50ID8gZXh0ZW5kKHt9LCBzdGF0ZS5wYXJlbnQuaW5jbHVkZXMpIDoge307XG4gICAgICBpbmNsdWRlc1tzdGF0ZS5uYW1lXSA9IHRydWU7XG4gICAgICByZXR1cm4gaW5jbHVkZXM7XG4gICAgfSxcblxuICAgICRkZWxlZ2F0ZXM6IHt9XG4gIH07XG5cbiAgZnVuY3Rpb24gaXNSZWxhdGl2ZShzdGF0ZU5hbWUpIHtcbiAgICByZXR1cm4gc3RhdGVOYW1lLmluZGV4T2YoXCIuXCIpID09PSAwIHx8IHN0YXRlTmFtZS5pbmRleE9mKFwiXlwiKSA9PT0gMDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpbmRTdGF0ZShzdGF0ZU9yTmFtZSwgYmFzZSkge1xuICAgIHZhciBpc1N0ciA9IGlzU3RyaW5nKHN0YXRlT3JOYW1lKSxcbiAgICAgICAgbmFtZSAgPSBpc1N0ciA/IHN0YXRlT3JOYW1lIDogc3RhdGVPck5hbWUubmFtZSxcbiAgICAgICAgcGF0aCAgPSBpc1JlbGF0aXZlKG5hbWUpO1xuXG4gICAgaWYgKHBhdGgpIHtcbiAgICAgIGlmICghYmFzZSkgdGhyb3cgbmV3IEVycm9yKFwiTm8gcmVmZXJlbmNlIHBvaW50IGdpdmVuIGZvciBwYXRoICdcIiAgKyBuYW1lICsgXCInXCIpO1xuICAgICAgdmFyIHJlbCA9IG5hbWUuc3BsaXQoXCIuXCIpLCBpID0gMCwgcGF0aExlbmd0aCA9IHJlbC5sZW5ndGgsIGN1cnJlbnQgPSBiYXNlO1xuXG4gICAgICBmb3IgKDsgaSA8IHBhdGhMZW5ndGg7IGkrKykge1xuICAgICAgICBpZiAocmVsW2ldID09PSBcIlwiICYmIGkgPT09IDApIHtcbiAgICAgICAgICBjdXJyZW50ID0gYmFzZTtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVsW2ldID09PSBcIl5cIikge1xuICAgICAgICAgIGlmICghY3VycmVudC5wYXJlbnQpIHRocm93IG5ldyBFcnJvcihcIlBhdGggJ1wiICsgbmFtZSArIFwiJyBub3QgdmFsaWQgZm9yIHN0YXRlICdcIiArIGJhc2UubmFtZSArIFwiJ1wiKTtcbiAgICAgICAgICBjdXJyZW50ID0gY3VycmVudC5wYXJlbnQ7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG4gICAgICB9XG4gICAgICByZWwgPSByZWwuc2xpY2UoaSkuam9pbihcIi5cIik7XG4gICAgICBuYW1lID0gY3VycmVudC5uYW1lICsgKGN1cnJlbnQubmFtZSAmJiByZWwgPyBcIi5cIiA6IFwiXCIpICsgcmVsO1xuICAgIH1cbiAgICB2YXIgc3RhdGUgPSBzdGF0ZXNbbmFtZV07XG5cbiAgICBpZiAoc3RhdGUgJiYgKGlzU3RyIHx8ICghaXNTdHIgJiYgKHN0YXRlID09PSBzdGF0ZU9yTmFtZSB8fCBzdGF0ZS5zZWxmID09PSBzdGF0ZU9yTmFtZSkpKSkge1xuICAgICAgcmV0dXJuIHN0YXRlO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgZnVuY3Rpb24gcXVldWVTdGF0ZShwYXJlbnROYW1lLCBzdGF0ZSkge1xuICAgIGlmICghcXVldWVbcGFyZW50TmFtZV0pIHtcbiAgICAgIHF1ZXVlW3BhcmVudE5hbWVdID0gW107XG4gICAgfVxuICAgIHF1ZXVlW3BhcmVudE5hbWVdLnB1c2goc3RhdGUpO1xuICB9XG5cbiAgZnVuY3Rpb24gcmVnaXN0ZXJTdGF0ZShzdGF0ZSkge1xuICAgIC8vIFdyYXAgYSBuZXcgb2JqZWN0IGFyb3VuZCB0aGUgc3RhdGUgc28gd2UgY2FuIHN0b3JlIG91ciBwcml2YXRlIGRldGFpbHMgZWFzaWx5LlxuICAgIHN0YXRlID0gaW5oZXJpdChzdGF0ZSwge1xuICAgICAgc2VsZjogc3RhdGUsXG4gICAgICByZXNvbHZlOiBzdGF0ZS5yZXNvbHZlIHx8IHt9LFxuICAgICAgdG9TdHJpbmc6IGZ1bmN0aW9uKCkgeyByZXR1cm4gdGhpcy5uYW1lOyB9XG4gICAgfSk7XG5cbiAgICB2YXIgbmFtZSA9IHN0YXRlLm5hbWU7XG4gICAgaWYgKCFpc1N0cmluZyhuYW1lKSB8fCBuYW1lLmluZGV4T2YoJ0AnKSA+PSAwKSB0aHJvdyBuZXcgRXJyb3IoXCJTdGF0ZSBtdXN0IGhhdmUgYSB2YWxpZCBuYW1lXCIpO1xuICAgIGlmIChzdGF0ZXMuaGFzT3duUHJvcGVydHkobmFtZSkpIHRocm93IG5ldyBFcnJvcihcIlN0YXRlICdcIiArIG5hbWUgKyBcIicnIGlzIGFscmVhZHkgZGVmaW5lZFwiKTtcblxuICAgIC8vIEdldCBwYXJlbnQgbmFtZVxuICAgIHZhciBwYXJlbnROYW1lID0gKG5hbWUuaW5kZXhPZignLicpICE9PSAtMSkgPyBuYW1lLnN1YnN0cmluZygwLCBuYW1lLmxhc3RJbmRleE9mKCcuJykpXG4gICAgICAgIDogKGlzU3RyaW5nKHN0YXRlLnBhcmVudCkpID8gc3RhdGUucGFyZW50XG4gICAgICAgIDogJyc7XG5cbiAgICAvLyBJZiBwYXJlbnQgaXMgbm90IHJlZ2lzdGVyZWQgeWV0LCBhZGQgc3RhdGUgdG8gcXVldWUgYW5kIHJlZ2lzdGVyIGxhdGVyXG4gICAgaWYgKHBhcmVudE5hbWUgJiYgIXN0YXRlc1twYXJlbnROYW1lXSkge1xuICAgICAgcmV0dXJuIHF1ZXVlU3RhdGUocGFyZW50TmFtZSwgc3RhdGUuc2VsZik7XG4gICAgfVxuXG4gICAgZm9yICh2YXIga2V5IGluIHN0YXRlQnVpbGRlcikge1xuICAgICAgaWYgKGlzRnVuY3Rpb24oc3RhdGVCdWlsZGVyW2tleV0pKSBzdGF0ZVtrZXldID0gc3RhdGVCdWlsZGVyW2tleV0oc3RhdGUsIHN0YXRlQnVpbGRlci4kZGVsZWdhdGVzW2tleV0pO1xuICAgIH1cbiAgICBzdGF0ZXNbbmFtZV0gPSBzdGF0ZTtcblxuICAgIC8vIFJlZ2lzdGVyIHRoZSBzdGF0ZSBpbiB0aGUgZ2xvYmFsIHN0YXRlIGxpc3QgYW5kIHdpdGggJHVybFJvdXRlciBpZiBuZWNlc3NhcnkuXG4gICAgaWYgKCFzdGF0ZVthYnN0cmFjdEtleV0gJiYgc3RhdGUudXJsKSB7XG4gICAgICAkdXJsUm91dGVyUHJvdmlkZXIud2hlbihzdGF0ZS51cmwsIFsnJG1hdGNoJywgJyRzdGF0ZVBhcmFtcycsIGZ1bmN0aW9uICgkbWF0Y2gsICRzdGF0ZVBhcmFtcykge1xuICAgICAgICBpZiAoJHN0YXRlLiRjdXJyZW50Lm5hdmlnYWJsZSAhPSBzdGF0ZSB8fCAhZXF1YWxGb3JLZXlzKCRtYXRjaCwgJHN0YXRlUGFyYW1zKSkge1xuICAgICAgICAgICRzdGF0ZS50cmFuc2l0aW9uVG8oc3RhdGUsICRtYXRjaCwgeyBsb2NhdGlvbjogZmFsc2UgfSk7XG4gICAgICAgIH1cbiAgICAgIH1dKTtcbiAgICB9XG5cbiAgICAvLyBSZWdpc3RlciBhbnkgcXVldWVkIGNoaWxkcmVuXG4gICAgaWYgKHF1ZXVlW25hbWVdKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IHF1ZXVlW25hbWVdLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHJlZ2lzdGVyU3RhdGUocXVldWVbbmFtZV1baV0pO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzdGF0ZTtcbiAgfVxuXG4gIC8vIENoZWNrcyB0ZXh0IHRvIHNlZSBpZiBpdCBsb29rcyBsaWtlIGEgZ2xvYi5cbiAgZnVuY3Rpb24gaXNHbG9iICh0ZXh0KSB7XG4gICAgcmV0dXJuIHRleHQuaW5kZXhPZignKicpID4gLTE7XG4gIH1cblxuICAvLyBSZXR1cm5zIHRydWUgaWYgZ2xvYiBtYXRjaGVzIGN1cnJlbnQgJHN0YXRlIG5hbWUuXG4gIGZ1bmN0aW9uIGRvZXNTdGF0ZU1hdGNoR2xvYiAoZ2xvYikge1xuICAgIHZhciBnbG9iU2VnbWVudHMgPSBnbG9iLnNwbGl0KCcuJyksXG4gICAgICAgIHNlZ21lbnRzID0gJHN0YXRlLiRjdXJyZW50Lm5hbWUuc3BsaXQoJy4nKTtcblxuICAgIC8vbWF0Y2ggZ3JlZWR5IHN0YXJ0c1xuICAgIGlmIChnbG9iU2VnbWVudHNbMF0gPT09ICcqKicpIHtcbiAgICAgICBzZWdtZW50cyA9IHNlZ21lbnRzLnNsaWNlKHNlZ21lbnRzLmluZGV4T2YoZ2xvYlNlZ21lbnRzWzFdKSk7XG4gICAgICAgc2VnbWVudHMudW5zaGlmdCgnKionKTtcbiAgICB9XG4gICAgLy9tYXRjaCBncmVlZHkgZW5kc1xuICAgIGlmIChnbG9iU2VnbWVudHNbZ2xvYlNlZ21lbnRzLmxlbmd0aCAtIDFdID09PSAnKionKSB7XG4gICAgICAgc2VnbWVudHMuc3BsaWNlKHNlZ21lbnRzLmluZGV4T2YoZ2xvYlNlZ21lbnRzW2dsb2JTZWdtZW50cy5sZW5ndGggLSAyXSkgKyAxLCBOdW1iZXIuTUFYX1ZBTFVFKTtcbiAgICAgICBzZWdtZW50cy5wdXNoKCcqKicpO1xuICAgIH1cblxuICAgIGlmIChnbG9iU2VnbWVudHMubGVuZ3RoICE9IHNlZ21lbnRzLmxlbmd0aCkge1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8vbWF0Y2ggc2luZ2xlIHN0YXJzXG4gICAgZm9yICh2YXIgaSA9IDAsIGwgPSBnbG9iU2VnbWVudHMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICBpZiAoZ2xvYlNlZ21lbnRzW2ldID09PSAnKicpIHtcbiAgICAgICAgc2VnbWVudHNbaV0gPSAnKic7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHNlZ21lbnRzLmpvaW4oJycpID09PSBnbG9iU2VnbWVudHMuam9pbignJyk7XG4gIH1cblxuXG4gIC8vIEltcGxpY2l0IHJvb3Qgc3RhdGUgdGhhdCBpcyBhbHdheXMgYWN0aXZlXG4gIHJvb3QgPSByZWdpc3RlclN0YXRlKHtcbiAgICBuYW1lOiAnJyxcbiAgICB1cmw6ICdeJyxcbiAgICB2aWV3czogbnVsbCxcbiAgICAnYWJzdHJhY3QnOiB0cnVlXG4gIH0pO1xuICByb290Lm5hdmlnYWJsZSA9IG51bGw7XG5cblxuICAvKipcbiAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVQcm92aWRlciNkZWNvcmF0b3JcbiAgICogQG1ldGhvZE9mIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVQcm92aWRlclxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQWxsb3dzIHlvdSB0byBleHRlbmQgKGNhcmVmdWxseSkgb3Igb3ZlcnJpZGUgKGF0IHlvdXIgb3duIHBlcmlsKSB0aGUgXG4gICAqIGBzdGF0ZUJ1aWxkZXJgIG9iamVjdCB1c2VkIGludGVybmFsbHkgYnkgYCRzdGF0ZVByb3ZpZGVyYC4gVGhpcyBjYW4gYmUgdXNlZCBcbiAgICogdG8gYWRkIGN1c3RvbSBmdW5jdGlvbmFsaXR5IHRvIHVpLXJvdXRlciwgZm9yIGV4YW1wbGUgaW5mZXJyaW5nIHRlbXBsYXRlVXJsIFxuICAgKiBiYXNlZCBvbiB0aGUgc3RhdGUgbmFtZS5cbiAgICpcbiAgICogV2hlbiBwYXNzaW5nIG9ubHkgYSBuYW1lLCBpdCByZXR1cm5zIHRoZSBjdXJyZW50IChvcmlnaW5hbCBvciBkZWNvcmF0ZWQpIGJ1aWxkZXJcbiAgICogZnVuY3Rpb24gdGhhdCBtYXRjaGVzIGBuYW1lYC5cbiAgICpcbiAgICogVGhlIGJ1aWxkZXIgZnVuY3Rpb25zIHRoYXQgY2FuIGJlIGRlY29yYXRlZCBhcmUgbGlzdGVkIGJlbG93LiBUaG91Z2ggbm90IGFsbFxuICAgKiBuZWNlc3NhcmlseSBoYXZlIGEgZ29vZCB1c2UgY2FzZSBmb3IgZGVjb3JhdGlvbiwgdGhhdCBpcyB1cCB0byB5b3UgdG8gZGVjaWRlLlxuICAgKlxuICAgKiBJbiBhZGRpdGlvbiwgdXNlcnMgY2FuIGF0dGFjaCBjdXN0b20gZGVjb3JhdG9ycywgd2hpY2ggd2lsbCBnZW5lcmF0ZSBuZXcgXG4gICAqIHByb3BlcnRpZXMgd2l0aGluIHRoZSBzdGF0ZSdzIGludGVybmFsIGRlZmluaXRpb24uIFRoZXJlIGlzIGN1cnJlbnRseSBubyBjbGVhciBcbiAgICogdXNlLWNhc2UgZm9yIHRoaXMgYmV5b25kIGFjY2Vzc2luZyBpbnRlcm5hbCBzdGF0ZXMgKGkuZS4gJHN0YXRlLiRjdXJyZW50KSwgXG4gICAqIGhvd2V2ZXIsIGV4cGVjdCB0aGlzIHRvIGJlY29tZSBpbmNyZWFzaW5nbHkgcmVsZXZhbnQgYXMgd2UgaW50cm9kdWNlIGFkZGl0aW9uYWwgXG4gICAqIG1ldGEtcHJvZ3JhbW1pbmcgZmVhdHVyZXMuXG4gICAqXG4gICAqICoqV2FybmluZyoqOiBEZWNvcmF0b3JzIHNob3VsZCBub3QgYmUgaW50ZXJkZXBlbmRlbnQgYmVjYXVzZSB0aGUgb3JkZXIgb2YgXG4gICAqIGV4ZWN1dGlvbiBvZiB0aGUgYnVpbGRlciBmdW5jdGlvbnMgaW4gbm9uLWRldGVybWluaXN0aWMuIEJ1aWxkZXIgZnVuY3Rpb25zIFxuICAgKiBzaG91bGQgb25seSBiZSBkZXBlbmRlbnQgb24gdGhlIHN0YXRlIGRlZmluaXRpb24gb2JqZWN0IGFuZCBzdXBlciBmdW5jdGlvbi5cbiAgICpcbiAgICpcbiAgICogRXhpc3RpbmcgYnVpbGRlciBmdW5jdGlvbnMgYW5kIGN1cnJlbnQgcmV0dXJuIHZhbHVlczpcbiAgICpcbiAgICogLSAqKnBhcmVudCoqIGB7b2JqZWN0fWAgLSByZXR1cm5zIHRoZSBwYXJlbnQgc3RhdGUgb2JqZWN0LlxuICAgKiAtICoqZGF0YSoqIGB7b2JqZWN0fWAgLSByZXR1cm5zIHN0YXRlIGRhdGEsIGluY2x1ZGluZyBhbnkgaW5oZXJpdGVkIGRhdGEgdGhhdCBpcyBub3RcbiAgICogICBvdmVycmlkZGVuIGJ5IG93biB2YWx1ZXMgKGlmIGFueSkuXG4gICAqIC0gKip1cmwqKiBge29iamVjdH1gIC0gcmV0dXJucyBhIHtsaW5rIHVpLnJvdXRlci51dGlsLnR5cGU6VXJsTWF0Y2hlcn0gb3IgbnVsbC5cbiAgICogLSAqKm5hdmlnYWJsZSoqIGB7b2JqZWN0fWAgLSByZXR1cm5zIGNsb3Nlc3QgYW5jZXN0b3Igc3RhdGUgdGhhdCBoYXMgYSBVUkwgKGFrYSBpcyBcbiAgICogICBuYXZpZ2FibGUpLlxuICAgKiAtICoqcGFyYW1zKiogYHtvYmplY3R9YCAtIHJldHVybnMgYW4gYXJyYXkgb2Ygc3RhdGUgcGFyYW1zIHRoYXQgYXJlIGVuc3VyZWQgdG8gXG4gICAqICAgYmUgYSBzdXBlci1zZXQgb2YgcGFyZW50J3MgcGFyYW1zLlxuICAgKiAtICoqdmlld3MqKiBge29iamVjdH1gIC0gcmV0dXJucyBhIHZpZXdzIG9iamVjdCB3aGVyZSBlYWNoIGtleSBpcyBhbiBhYnNvbHV0ZSB2aWV3IFxuICAgKiAgIG5hbWUgKGkuZS4gXCJ2aWV3TmFtZUBzdGF0ZU5hbWVcIikgYW5kIGVhY2ggdmFsdWUgaXMgdGhlIGNvbmZpZyBvYmplY3QgXG4gICAqICAgKHRlbXBsYXRlLCBjb250cm9sbGVyKSBmb3IgdGhlIHZpZXcuIEV2ZW4gd2hlbiB5b3UgZG9uJ3QgdXNlIHRoZSB2aWV3cyBvYmplY3QgXG4gICAqICAgZXhwbGljaXRseSBvbiBhIHN0YXRlIGNvbmZpZywgb25lIGlzIHN0aWxsIGNyZWF0ZWQgZm9yIHlvdSBpbnRlcm5hbGx5LlxuICAgKiAgIFNvIGJ5IGRlY29yYXRpbmcgdGhpcyBidWlsZGVyIGZ1bmN0aW9uIHlvdSBoYXZlIGFjY2VzcyB0byBkZWNvcmF0aW5nIHRlbXBsYXRlIFxuICAgKiAgIGFuZCBjb250cm9sbGVyIHByb3BlcnRpZXMuXG4gICAqIC0gKipvd25QYXJhbXMqKiBge29iamVjdH1gIC0gcmV0dXJucyBhbiBhcnJheSBvZiBwYXJhbXMgdGhhdCBiZWxvbmcgdG8gdGhlIHN0YXRlLCBcbiAgICogICBub3QgaW5jbHVkaW5nIGFueSBwYXJhbXMgZGVmaW5lZCBieSBhbmNlc3RvciBzdGF0ZXMuXG4gICAqIC0gKipwYXRoKiogYHtzdHJpbmd9YCAtIHJldHVybnMgdGhlIGZ1bGwgcGF0aCBmcm9tIHRoZSByb290IGRvd24gdG8gdGhpcyBzdGF0ZS4gXG4gICAqICAgTmVlZGVkIGZvciBzdGF0ZSBhY3RpdmF0aW9uLlxuICAgKiAtICoqaW5jbHVkZXMqKiBge29iamVjdH1gIC0gcmV0dXJucyBhbiBvYmplY3QgdGhhdCBpbmNsdWRlcyBldmVyeSBzdGF0ZSB0aGF0IFxuICAgKiAgIHdvdWxkIHBhc3MgYSAnJHN0YXRlLmluY2x1ZGVzKCknIHRlc3QuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIDxwcmU+XG4gICAqIC8vIE92ZXJyaWRlIHRoZSBpbnRlcm5hbCAndmlld3MnIGJ1aWxkZXIgd2l0aCBhIGZ1bmN0aW9uIHRoYXQgdGFrZXMgdGhlIHN0YXRlXG4gICAqIC8vIGRlZmluaXRpb24sIGFuZCBhIHJlZmVyZW5jZSB0byB0aGUgaW50ZXJuYWwgZnVuY3Rpb24gYmVpbmcgb3ZlcnJpZGRlbjpcbiAgICogJHN0YXRlUHJvdmlkZXIuZGVjb3JhdG9yKCd2aWV3cycsIGZ1bmN0aW9uICgkc3RhdGUsIHBhcmVudCkge1xuICAgKiAgIHZhciByZXN1bHQgPSB7fSxcbiAgICogICAgICAgdmlld3MgPSBwYXJlbnQoc3RhdGUpO1xuICAgKlxuICAgKiAgIGFuZ3VsYXIuZm9yRWFjaCh2aWV3LCBmdW5jdGlvbiAoY29uZmlnLCBuYW1lKSB7XG4gICAqICAgICB2YXIgYXV0b05hbWUgPSAoc3RhdGUubmFtZSArICcuJyArIG5hbWUpLnJlcGxhY2UoJy4nLCAnLycpO1xuICAgKiAgICAgY29uZmlnLnRlbXBsYXRlVXJsID0gY29uZmlnLnRlbXBsYXRlVXJsIHx8ICcvcGFydGlhbHMvJyArIGF1dG9OYW1lICsgJy5odG1sJztcbiAgICogICAgIHJlc3VsdFtuYW1lXSA9IGNvbmZpZztcbiAgICogICB9KTtcbiAgICogICByZXR1cm4gcmVzdWx0O1xuICAgKiB9KTtcbiAgICpcbiAgICogJHN0YXRlUHJvdmlkZXIuc3RhdGUoJ2hvbWUnLCB7XG4gICAqICAgdmlld3M6IHtcbiAgICogICAgICdjb250YWN0Lmxpc3QnOiB7IGNvbnRyb2xsZXI6ICdMaXN0Q29udHJvbGxlcicgfSxcbiAgICogICAgICdjb250YWN0Lml0ZW0nOiB7IGNvbnRyb2xsZXI6ICdJdGVtQ29udHJvbGxlcicgfVxuICAgKiAgIH1cbiAgICogfSk7XG4gICAqXG4gICAqIC8vIC4uLlxuICAgKlxuICAgKiAkc3RhdGUuZ28oJ2hvbWUnKTtcbiAgICogLy8gQXV0by1wb3B1bGF0ZXMgbGlzdCBhbmQgaXRlbSB2aWV3cyB3aXRoIC9wYXJ0aWFscy9ob21lL2NvbnRhY3QvbGlzdC5odG1sLFxuICAgKiAvLyBhbmQgL3BhcnRpYWxzL2hvbWUvY29udGFjdC9pdGVtLmh0bWwsIHJlc3BlY3RpdmVseS5cbiAgICogPC9wcmU+XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIFRoZSBuYW1lIG9mIHRoZSBidWlsZGVyIGZ1bmN0aW9uIHRvIGRlY29yYXRlLiBcbiAgICogQHBhcmFtIHtvYmplY3R9IGZ1bmMgQSBmdW5jdGlvbiB0aGF0IGlzIHJlc3BvbnNpYmxlIGZvciBkZWNvcmF0aW5nIHRoZSBvcmlnaW5hbCBcbiAgICogYnVpbGRlciBmdW5jdGlvbi4gVGhlIGZ1bmN0aW9uIHJlY2VpdmVzIHR3byBwYXJhbWV0ZXJzOlxuICAgKlxuICAgKiAgIC0gYHtvYmplY3R9YCAtIHN0YXRlIC0gVGhlIHN0YXRlIGNvbmZpZyBvYmplY3QuXG4gICAqICAgLSBge29iamVjdH1gIC0gc3VwZXIgLSBUaGUgb3JpZ2luYWwgYnVpbGRlciBmdW5jdGlvbi5cbiAgICpcbiAgICogQHJldHVybiB7b2JqZWN0fSAkc3RhdGVQcm92aWRlciAtICRzdGF0ZVByb3ZpZGVyIGluc3RhbmNlXG4gICAqL1xuICB0aGlzLmRlY29yYXRvciA9IGRlY29yYXRvcjtcbiAgZnVuY3Rpb24gZGVjb3JhdG9yKG5hbWUsIGZ1bmMpIHtcbiAgICAvKmpzaGludCB2YWxpZHRoaXM6IHRydWUgKi9cbiAgICBpZiAoaXNTdHJpbmcobmFtZSkgJiYgIWlzRGVmaW5lZChmdW5jKSkge1xuICAgICAgcmV0dXJuIHN0YXRlQnVpbGRlcltuYW1lXTtcbiAgICB9XG4gICAgaWYgKCFpc0Z1bmN0aW9uKGZ1bmMpIHx8ICFpc1N0cmluZyhuYW1lKSkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGlmIChzdGF0ZUJ1aWxkZXJbbmFtZV0gJiYgIXN0YXRlQnVpbGRlci4kZGVsZWdhdGVzW25hbWVdKSB7XG4gICAgICBzdGF0ZUJ1aWxkZXIuJGRlbGVnYXRlc1tuYW1lXSA9IHN0YXRlQnVpbGRlcltuYW1lXTtcbiAgICB9XG4gICAgc3RhdGVCdWlsZGVyW25hbWVdID0gZnVuYztcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICogQG5hbWUgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVByb3ZpZGVyI3N0YXRlXG4gICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlUHJvdmlkZXJcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlZ2lzdGVycyBhIHN0YXRlIGNvbmZpZ3VyYXRpb24gdW5kZXIgYSBnaXZlbiBzdGF0ZSBuYW1lLiBUaGUgc3RhdGVDb25maWcgb2JqZWN0XG4gICAqIGhhcyB0aGUgZm9sbG93aW5nIGFjY2VwdGFibGUgcHJvcGVydGllcy5cbiAgICpcbiAgICogPGEgaWQ9J3RlbXBsYXRlJz48L2E+XG4gICAqXG4gICAqIC0gKipgdGVtcGxhdGVgKiogLSB7c3RyaW5nfGZ1bmN0aW9uPX0gLSBodG1sIHRlbXBsYXRlIGFzIGEgc3RyaW5nIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zXG4gICAqICAgYW4gaHRtbCB0ZW1wbGF0ZSBhcyBhIHN0cmluZyB3aGljaCBzaG91bGQgYmUgdXNlZCBieSB0aGUgdWlWaWV3IGRpcmVjdGl2ZXMuIFRoaXMgcHJvcGVydHkgXG4gICAqICAgdGFrZXMgcHJlY2VkZW5jZSBvdmVyIHRlbXBsYXRlVXJsLlxuICAgKiAgIFxuICAgKiAgIElmIGB0ZW1wbGF0ZWAgaXMgYSBmdW5jdGlvbiwgaXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgZm9sbG93aW5nIHBhcmFtZXRlcnM6XG4gICAqXG4gICAqICAgLSB7YXJyYXkuJmx0O29iamVjdCZndDt9IC0gc3RhdGUgcGFyYW1ldGVycyBleHRyYWN0ZWQgZnJvbSB0aGUgY3VycmVudCAkbG9jYXRpb24ucGF0aCgpIGJ5XG4gICAqICAgICBhcHBseWluZyB0aGUgY3VycmVudCBzdGF0ZVxuICAgKlxuICAgKiA8YSBpZD0ndGVtcGxhdGVVcmwnPjwvYT5cbiAgICpcbiAgICogLSAqKmB0ZW1wbGF0ZVVybGAqKiAtIHtzdHJpbmd8ZnVuY3Rpb249fSAtIHBhdGggb3IgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcGF0aCB0byBhbiBodG1sIFxuICAgKiAgIHRlbXBsYXRlIHRoYXQgc2hvdWxkIGJlIHVzZWQgYnkgdWlWaWV3LlxuICAgKiAgIFxuICAgKiAgIElmIGB0ZW1wbGF0ZVVybGAgaXMgYSBmdW5jdGlvbiwgaXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgZm9sbG93aW5nIHBhcmFtZXRlcnM6XG4gICAqXG4gICAqICAgLSB7YXJyYXkuJmx0O29iamVjdCZndDt9IC0gc3RhdGUgcGFyYW1ldGVycyBleHRyYWN0ZWQgZnJvbSB0aGUgY3VycmVudCAkbG9jYXRpb24ucGF0aCgpIGJ5IFxuICAgKiAgICAgYXBwbHlpbmcgdGhlIGN1cnJlbnQgc3RhdGVcbiAgICpcbiAgICogPGEgaWQ9J3RlbXBsYXRlUHJvdmlkZXInPjwvYT5cbiAgICpcbiAgICogLSAqKmB0ZW1wbGF0ZVByb3ZpZGVyYCoqIC0ge2Z1bmN0aW9uPX0gLSBQcm92aWRlciBmdW5jdGlvbiB0aGF0IHJldHVybnMgSFRNTCBjb250ZW50XG4gICAqICAgc3RyaW5nLlxuICAgKlxuICAgKiA8YSBpZD0nY29udHJvbGxlcic+PC9hPlxuICAgKlxuICAgKiAtICoqYGNvbnRyb2xsZXJgKiogLSB7c3RyaW5nfGZ1bmN0aW9uPX0gLSAgQ29udHJvbGxlciBmbiB0aGF0IHNob3VsZCBiZSBhc3NvY2lhdGVkIHdpdGggbmV3bHkgXG4gICAqICAgcmVsYXRlZCBzY29wZSBvciB0aGUgbmFtZSBvZiBhIHJlZ2lzdGVyZWQgY29udHJvbGxlciBpZiBwYXNzZWQgYXMgYSBzdHJpbmcuXG4gICAqXG4gICAqIDxhIGlkPSdjb250cm9sbGVyUHJvdmlkZXInPjwvYT5cbiAgICpcbiAgICogLSAqKmBjb250cm9sbGVyUHJvdmlkZXJgKiogLSB7ZnVuY3Rpb249fSAtIEluamVjdGFibGUgcHJvdmlkZXIgZnVuY3Rpb24gdGhhdCByZXR1cm5zXG4gICAqICAgdGhlIGFjdHVhbCBjb250cm9sbGVyIG9yIHN0cmluZy5cbiAgICpcbiAgICogPGEgaWQ9J2NvbnRyb2xsZXJBcyc+PC9hPlxuICAgKiBcbiAgICogLSAqKmBjb250cm9sbGVyQXNgKiog4oCTIHtzdHJpbmc9fSDigJMgQSBjb250cm9sbGVyIGFsaWFzIG5hbWUuIElmIHByZXNlbnQgdGhlIGNvbnRyb2xsZXIgd2lsbCBiZSBcbiAgICogICBwdWJsaXNoZWQgdG8gc2NvcGUgdW5kZXIgdGhlIGNvbnRyb2xsZXJBcyBuYW1lLlxuICAgKlxuICAgKiA8YSBpZD0ncmVzb2x2ZSc+PC9hPlxuICAgKlxuICAgKiAtICoqYHJlc29sdmVgKiogLSB7b2JqZWN0LiZsdDtzdHJpbmcsIGZ1bmN0aW9uJmd0Oz19IC0gQW4gb3B0aW9uYWwgbWFwIG9mIGRlcGVuZGVuY2llcyB3aGljaCBcbiAgICogICBzaG91bGQgYmUgaW5qZWN0ZWQgaW50byB0aGUgY29udHJvbGxlci4gSWYgYW55IG9mIHRoZXNlIGRlcGVuZGVuY2llcyBhcmUgcHJvbWlzZXMsIFxuICAgKiAgIHRoZSByb3V0ZXIgd2lsbCB3YWl0IGZvciB0aGVtIGFsbCB0byBiZSByZXNvbHZlZCBvciBvbmUgdG8gYmUgcmVqZWN0ZWQgYmVmb3JlIHRoZSBcbiAgICogICBjb250cm9sbGVyIGlzIGluc3RhbnRpYXRlZC4gSWYgYWxsIHRoZSBwcm9taXNlcyBhcmUgcmVzb2x2ZWQgc3VjY2Vzc2Z1bGx5LCB0aGUgdmFsdWVzIFxuICAgKiAgIG9mIHRoZSByZXNvbHZlZCBwcm9taXNlcyBhcmUgaW5qZWN0ZWQgYW5kICRzdGF0ZUNoYW5nZVN1Y2Nlc3MgZXZlbnQgaXMgZmlyZWQuIElmIGFueSBcbiAgICogICBvZiB0aGUgcHJvbWlzZXMgYXJlIHJlamVjdGVkIHRoZSAkc3RhdGVDaGFuZ2VFcnJvciBldmVudCBpcyBmaXJlZC4gVGhlIG1hcCBvYmplY3QgaXM6XG4gICAqICAgXG4gICAqICAgLSBrZXkgLSB7c3RyaW5nfTogbmFtZSBvZiBkZXBlbmRlbmN5IHRvIGJlIGluamVjdGVkIGludG8gY29udHJvbGxlclxuICAgKiAgIC0gZmFjdG9yeSAtIHtzdHJpbmd8ZnVuY3Rpb259OiBJZiBzdHJpbmcgdGhlbiBpdCBpcyBhbGlhcyBmb3Igc2VydmljZS4gT3RoZXJ3aXNlIGlmIGZ1bmN0aW9uLCBcbiAgICogICAgIGl0IGlzIGluamVjdGVkIGFuZCByZXR1cm4gdmFsdWUgaXQgdHJlYXRlZCBhcyBkZXBlbmRlbmN5LiBJZiByZXN1bHQgaXMgYSBwcm9taXNlLCBpdCBpcyBcbiAgICogICAgIHJlc29sdmVkIGJlZm9yZSBpdHMgdmFsdWUgaXMgaW5qZWN0ZWQgaW50byBjb250cm9sbGVyLlxuICAgKlxuICAgKiA8YSBpZD0ndXJsJz48L2E+XG4gICAqXG4gICAqIC0gKipgdXJsYCoqIC0ge3N0cmluZz19IC0gQSB1cmwgd2l0aCBvcHRpb25hbCBwYXJhbWV0ZXJzLiBXaGVuIGEgc3RhdGUgaXMgbmF2aWdhdGVkIG9yXG4gICAqICAgdHJhbnNpdGlvbmVkIHRvLCB0aGUgYCRzdGF0ZVBhcmFtc2Agc2VydmljZSB3aWxsIGJlIHBvcHVsYXRlZCB3aXRoIGFueSBcbiAgICogICBwYXJhbWV0ZXJzIHRoYXQgd2VyZSBwYXNzZWQuXG4gICAqXG4gICAqIDxhIGlkPSdwYXJhbXMnPjwvYT5cbiAgICpcbiAgICogLSAqKmBwYXJhbXNgKiogLSB7b2JqZWN0PX0gLSBBbiBhcnJheSBvZiBwYXJhbWV0ZXIgbmFtZXMgb3IgcmVndWxhciBleHByZXNzaW9ucy4gT25seSBcbiAgICogICB1c2UgdGhpcyB3aXRoaW4gYSBzdGF0ZSBpZiB5b3UgYXJlIG5vdCB1c2luZyB1cmwuIE90aGVyd2lzZSB5b3UgY2FuIHNwZWNpZnkgeW91clxuICAgKiAgIHBhcmFtZXRlcnMgd2l0aGluIHRoZSB1cmwuIFdoZW4gYSBzdGF0ZSBpcyBuYXZpZ2F0ZWQgb3IgdHJhbnNpdGlvbmVkIHRvLCB0aGUgXG4gICAqICAgJHN0YXRlUGFyYW1zIHNlcnZpY2Ugd2lsbCBiZSBwb3B1bGF0ZWQgd2l0aCBhbnkgcGFyYW1ldGVycyB0aGF0IHdlcmUgcGFzc2VkLlxuICAgKlxuICAgKiA8YSBpZD0ndmlld3MnPjwvYT5cbiAgICpcbiAgICogLSAqKmB2aWV3c2AqKiAtIHtvYmplY3Q9fSAtIFVzZSB0aGUgdmlld3MgcHJvcGVydHkgdG8gc2V0IHVwIG11bHRpcGxlIHZpZXdzIG9yIHRvIHRhcmdldCB2aWV3c1xuICAgKiAgIG1hbnVhbGx5L2V4cGxpY2l0bHkuXG4gICAqXG4gICAqIDxhIGlkPSdhYnN0cmFjdCc+PC9hPlxuICAgKlxuICAgKiAtICoqYGFic3RyYWN0YCoqIC0ge2Jvb2xlYW49fSAtIEFuIGFic3RyYWN0IHN0YXRlIHdpbGwgbmV2ZXIgYmUgZGlyZWN0bHkgYWN0aXZhdGVkLCBcbiAgICogICBidXQgY2FuIHByb3ZpZGUgaW5oZXJpdGVkIHByb3BlcnRpZXMgdG8gaXRzIGNvbW1vbiBjaGlsZHJlbiBzdGF0ZXMuXG4gICAqXG4gICAqIDxhIGlkPSdvbkVudGVyJz48L2E+XG4gICAqXG4gICAqIC0gKipgb25FbnRlcmAqKiAtIHtvYmplY3Q9fSAtIENhbGxiYWNrIGZ1bmN0aW9uIGZvciB3aGVuIGEgc3RhdGUgaXMgZW50ZXJlZC4gR29vZCB3YXlcbiAgICogICB0byB0cmlnZ2VyIGFuIGFjdGlvbiBvciBkaXNwYXRjaCBhbiBldmVudCwgc3VjaCBhcyBvcGVuaW5nIGEgZGlhbG9nLlxuICAgKlxuICAgKiA8YSBpZD0nb25FeGl0Jz48L2E+XG4gICAqXG4gICAqIC0gKipgb25FeGl0YCoqIC0ge29iamVjdD19IC0gQ2FsbGJhY2sgZnVuY3Rpb24gZm9yIHdoZW4gYSBzdGF0ZSBpcyBleGl0ZWQuIEdvb2Qgd2F5IHRvXG4gICAqICAgdHJpZ2dlciBhbiBhY3Rpb24gb3IgZGlzcGF0Y2ggYW4gZXZlbnQsIHN1Y2ggYXMgb3BlbmluZyBhIGRpYWxvZy5cbiAgICpcbiAgICogPGEgaWQ9J3JlbG9hZE9uU2VhcmNoJz48L2E+XG4gICAqXG4gICAqIC0gKipgcmVsb2FkT25TZWFyY2ggPSB0cnVlYCoqIC0ge2Jvb2xlYW49fSAtIElmIGBmYWxzZWAsIHdpbGwgbm90IHJldHJpZ2dlciB0aGUgc2FtZSBzdGF0ZSBcbiAgICogICBqdXN0IGJlY2F1c2UgYSBzZWFyY2gvcXVlcnkgcGFyYW1ldGVyIGhhcyBjaGFuZ2VkICh2aWEgJGxvY2F0aW9uLnNlYXJjaCgpIG9yICRsb2NhdGlvbi5oYXNoKCkpLiBcbiAgICogICBVc2VmdWwgZm9yIHdoZW4geW91J2QgbGlrZSB0byBtb2RpZnkgJGxvY2F0aW9uLnNlYXJjaCgpIHdpdGhvdXQgdHJpZ2dlcmluZyBhIHJlbG9hZC5cbiAgICpcbiAgICogPGEgaWQ9J2RhdGEnPjwvYT5cbiAgICpcbiAgICogLSAqKmBkYXRhYCoqIC0ge29iamVjdD19IC0gQXJiaXRyYXJ5IGRhdGEgb2JqZWN0LCB1c2VmdWwgZm9yIGN1c3RvbSBjb25maWd1cmF0aW9uLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiA8cHJlPlxuICAgKiAvLyBTb21lIHN0YXRlIG5hbWUgZXhhbXBsZXNcbiAgICpcbiAgICogLy8gc3RhdGVOYW1lIGNhbiBiZSBhIHNpbmdsZSB0b3AtbGV2ZWwgbmFtZSAobXVzdCBiZSB1bmlxdWUpLlxuICAgKiAkc3RhdGVQcm92aWRlci5zdGF0ZShcImhvbWVcIiwge30pO1xuICAgKlxuICAgKiAvLyBPciBpdCBjYW4gYmUgYSBuZXN0ZWQgc3RhdGUgbmFtZS4gVGhpcyBzdGF0ZSBpcyBhIGNoaWxkIG9mIHRoZSBcbiAgICogLy8gYWJvdmUgXCJob21lXCIgc3RhdGUuXG4gICAqICRzdGF0ZVByb3ZpZGVyLnN0YXRlKFwiaG9tZS5uZXdlc3RcIiwge30pO1xuICAgKlxuICAgKiAvLyBOZXN0IHN0YXRlcyBhcyBkZWVwbHkgYXMgbmVlZGVkLlxuICAgKiAkc3RhdGVQcm92aWRlci5zdGF0ZShcImhvbWUubmV3ZXN0LmFiYy54eXouaW5jZXB0aW9uXCIsIHt9KTtcbiAgICpcbiAgICogLy8gc3RhdGUoKSByZXR1cm5zICRzdGF0ZVByb3ZpZGVyLCBzbyB5b3UgY2FuIGNoYWluIHN0YXRlIGRlY2xhcmF0aW9ucy5cbiAgICogJHN0YXRlUHJvdmlkZXJcbiAgICogICAuc3RhdGUoXCJob21lXCIsIHt9KVxuICAgKiAgIC5zdGF0ZShcImFib3V0XCIsIHt9KVxuICAgKiAgIC5zdGF0ZShcImNvbnRhY3RzXCIsIHt9KTtcbiAgICogPC9wcmU+XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIEEgdW5pcXVlIHN0YXRlIG5hbWUsIGUuZy4gXCJob21lXCIsIFwiYWJvdXRcIiwgXCJjb250YWN0c1wiLiBcbiAgICogVG8gY3JlYXRlIGEgcGFyZW50L2NoaWxkIHN0YXRlIHVzZSBhIGRvdCwgZS5nLiBcImFib3V0LnNhbGVzXCIsIFwiaG9tZS5uZXdlc3RcIi5cbiAgICogQHBhcmFtIHtvYmplY3R9IGRlZmluaXRpb24gU3RhdGUgY29uZmlndXJhdGlvbiBvYmplY3QuXG4gICAqL1xuICB0aGlzLnN0YXRlID0gc3RhdGU7XG4gIGZ1bmN0aW9uIHN0YXRlKG5hbWUsIGRlZmluaXRpb24pIHtcbiAgICAvKmpzaGludCB2YWxpZHRoaXM6IHRydWUgKi9cbiAgICBpZiAoaXNPYmplY3QobmFtZSkpIGRlZmluaXRpb24gPSBuYW1lO1xuICAgIGVsc2UgZGVmaW5pdGlvbi5uYW1lID0gbmFtZTtcbiAgICByZWdpc3RlclN0YXRlKGRlZmluaXRpb24pO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBvYmplY3RcbiAgICogQG5hbWUgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVxuICAgKlxuICAgKiBAcmVxdWlyZXMgJHJvb3RTY29wZVxuICAgKiBAcmVxdWlyZXMgJHFcbiAgICogQHJlcXVpcmVzIHVpLnJvdXRlci5zdGF0ZS4kdmlld1xuICAgKiBAcmVxdWlyZXMgJGluamVjdG9yXG4gICAqIEByZXF1aXJlcyB1aS5yb3V0ZXIudXRpbC4kcmVzb2x2ZVxuICAgKiBAcmVxdWlyZXMgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVBhcmFtc1xuICAgKlxuICAgKiBAcHJvcGVydHkge29iamVjdH0gcGFyYW1zIEEgcGFyYW0gb2JqZWN0LCBlLmcuIHtzZWN0aW9uSWQ6IHNlY3Rpb24uaWQpfSwgdGhhdCBcbiAgICogeW91J2QgbGlrZSB0byB0ZXN0IGFnYWluc3QgdGhlIGN1cnJlbnQgYWN0aXZlIHN0YXRlLlxuICAgKiBAcHJvcGVydHkge29iamVjdH0gY3VycmVudCBBIHJlZmVyZW5jZSB0byB0aGUgc3RhdGUncyBjb25maWcgb2JqZWN0LiBIb3dldmVyIFxuICAgKiB5b3UgcGFzc2VkIGl0IGluLiBVc2VmdWwgZm9yIGFjY2Vzc2luZyBjdXN0b20gZGF0YS5cbiAgICogQHByb3BlcnR5IHtvYmplY3R9IHRyYW5zaXRpb24gQ3VycmVudGx5IHBlbmRpbmcgdHJhbnNpdGlvbi4gQSBwcm9taXNlIHRoYXQnbGwgXG4gICAqIHJlc29sdmUgb3IgcmVqZWN0LlxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogYCRzdGF0ZWAgc2VydmljZSBpcyByZXNwb25zaWJsZSBmb3IgcmVwcmVzZW50aW5nIHN0YXRlcyBhcyB3ZWxsIGFzIHRyYW5zaXRpb25pbmdcbiAgICogYmV0d2VlbiB0aGVtLiBJdCBhbHNvIHByb3ZpZGVzIGludGVyZmFjZXMgdG8gYXNrIGZvciBjdXJyZW50IHN0YXRlIG9yIGV2ZW4gc3RhdGVzXG4gICAqIHlvdSdyZSBjb21pbmcgZnJvbS5cbiAgICovXG4gIC8vICR1cmxSb3V0ZXIgaXMgaW5qZWN0ZWQganVzdCB0byBlbnN1cmUgaXQgZ2V0cyBpbnN0YW50aWF0ZWRcbiAgdGhpcy4kZ2V0ID0gJGdldDtcbiAgJGdldC4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJyRxJywgJyR2aWV3JywgJyRpbmplY3RvcicsICckcmVzb2x2ZScsICckc3RhdGVQYXJhbXMnLCAnJGxvY2F0aW9uJywgJyR1cmxSb3V0ZXInLCAnJGJyb3dzZXInXTtcbiAgZnVuY3Rpb24gJGdldCggICAkcm9vdFNjb3BlLCAgICRxLCAgICR2aWV3LCAgICRpbmplY3RvciwgICAkcmVzb2x2ZSwgICAkc3RhdGVQYXJhbXMsICAgJGxvY2F0aW9uLCAgICR1cmxSb3V0ZXIsICAgJGJyb3dzZXIpIHtcblxuICAgIHZhciBUcmFuc2l0aW9uU3VwZXJzZWRlZCA9ICRxLnJlamVjdChuZXcgRXJyb3IoJ3RyYW5zaXRpb24gc3VwZXJzZWRlZCcpKTtcbiAgICB2YXIgVHJhbnNpdGlvblByZXZlbnRlZCA9ICRxLnJlamVjdChuZXcgRXJyb3IoJ3RyYW5zaXRpb24gcHJldmVudGVkJykpO1xuICAgIHZhciBUcmFuc2l0aW9uQWJvcnRlZCA9ICRxLnJlamVjdChuZXcgRXJyb3IoJ3RyYW5zaXRpb24gYWJvcnRlZCcpKTtcbiAgICB2YXIgVHJhbnNpdGlvbkZhaWxlZCA9ICRxLnJlamVjdChuZXcgRXJyb3IoJ3RyYW5zaXRpb24gZmFpbGVkJykpO1xuICAgIHZhciBjdXJyZW50TG9jYXRpb24gPSAkbG9jYXRpb24udXJsKCk7XG4gICAgdmFyIGJhc2VIcmVmID0gJGJyb3dzZXIuYmFzZUhyZWYoKTtcblxuICAgIGZ1bmN0aW9uIHN5bmNVcmwoKSB7XG4gICAgICBpZiAoJGxvY2F0aW9uLnVybCgpICE9PSBjdXJyZW50TG9jYXRpb24pIHtcbiAgICAgICAgJGxvY2F0aW9uLnVybChjdXJyZW50TG9jYXRpb24pO1xuICAgICAgICAkbG9jYXRpb24ucmVwbGFjZSgpO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJvb3QubG9jYWxzID0geyByZXNvbHZlOiBudWxsLCBnbG9iYWxzOiB7ICRzdGF0ZVBhcmFtczoge30gfSB9O1xuICAgICRzdGF0ZSA9IHtcbiAgICAgIHBhcmFtczoge30sXG4gICAgICBjdXJyZW50OiByb290LnNlbGYsXG4gICAgICAkY3VycmVudDogcm9vdCxcbiAgICAgIHRyYW5zaXRpb246IG51bGxcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAgICogQG5hbWUgdWkucm91dGVyLnN0YXRlLiRzdGF0ZSNyZWxvYWRcbiAgICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQSBtZXRob2QgdGhhdCBmb3JjZSByZWxvYWRzIHRoZSBjdXJyZW50IHN0YXRlLiBBbGwgcmVzb2x2ZXMgYXJlIHJlLXJlc29sdmVkLCBldmVudHMgYXJlIG5vdCByZS1maXJlZCwgXG4gICAgICogYW5kIGNvbnRyb2xsZXJzIHJlaW5zdGFudGlhdGVkIChidWcgd2l0aCBjb250cm9sbGVycyByZWluc3RhbnRpYXRpbmcgcmlnaHQgbm93LCBmaXhpbmcgc29vbikuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIDxwcmU+XG4gICAgICogdmFyIGFwcCBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyd1aS5yb3V0ZXInXSk7XG4gICAgICpcbiAgICAgKiBhcHAuY29udHJvbGxlcignY3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSkge1xuICAgICAqICAgJHNjb3BlLnJlbG9hZCA9IGZ1bmN0aW9uKCl7XG4gICAgICogICAgICRzdGF0ZS5yZWxvYWQoKTtcbiAgICAgKiAgIH1cbiAgICAgKiB9KTtcbiAgICAgKiA8L3ByZT5cbiAgICAgKlxuICAgICAqIGByZWxvYWQoKWAgaXMganVzdCBhbiBhbGlhcyBmb3I6XG4gICAgICogPHByZT5cbiAgICAgKiAkc3RhdGUudHJhbnNpdGlvblRvKCRzdGF0ZS5jdXJyZW50LCAkc3RhdGVQYXJhbXMsIHsgXG4gICAgICogICByZWxvYWQ6IHRydWUsIGluaGVyaXQ6IGZhbHNlLCBub3RpZnk6IGZhbHNlIFxuICAgICAqIH0pO1xuICAgICAqIDwvcHJlPlxuICAgICAqL1xuICAgICRzdGF0ZS5yZWxvYWQgPSBmdW5jdGlvbiByZWxvYWQoKSB7XG4gICAgICAkc3RhdGUudHJhbnNpdGlvblRvKCRzdGF0ZS5jdXJyZW50LCAkc3RhdGVQYXJhbXMsIHsgcmVsb2FkOiB0cnVlLCBpbmhlcml0OiBmYWxzZSwgbm90aWZ5OiBmYWxzZSB9KTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAgICogQG5hbWUgdWkucm91dGVyLnN0YXRlLiRzdGF0ZSNnb1xuICAgICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlXG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBDb252ZW5pZW5jZSBtZXRob2QgZm9yIHRyYW5zaXRpb25pbmcgdG8gYSBuZXcgc3RhdGUuIGAkc3RhdGUuZ29gIGNhbGxzIFxuICAgICAqIGAkc3RhdGUudHJhbnNpdGlvblRvYCBpbnRlcm5hbGx5IGJ1dCBhdXRvbWF0aWNhbGx5IHNldHMgb3B0aW9ucyB0byBcbiAgICAgKiBgeyBsb2NhdGlvbjogdHJ1ZSwgaW5oZXJpdDogdHJ1ZSwgcmVsYXRpdmU6ICRzdGF0ZS4kY3VycmVudCwgbm90aWZ5OiB0cnVlIH1gLiBcbiAgICAgKiBUaGlzIGFsbG93cyB5b3UgdG8gZWFzaWx5IHVzZSBhbiBhYnNvbHV0ZSBvciByZWxhdGl2ZSB0byBwYXRoIGFuZCBzcGVjaWZ5IFxuICAgICAqIG9ubHkgdGhlIHBhcmFtZXRlcnMgeW91J2QgbGlrZSB0byB1cGRhdGUgKHdoaWxlIGxldHRpbmcgdW5zcGVjaWZpZWQgcGFyYW1ldGVycyBcbiAgICAgKiBpbmhlcml0IGZyb20gdGhlIGN1cnJlbnRseSBhY3RpdmUgYW5jZXN0b3Igc3RhdGVzKS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogPHByZT5cbiAgICAgKiB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsndWkucm91dGVyJ10pO1xuICAgICAqXG4gICAgICogYXBwLmNvbnRyb2xsZXIoJ2N0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUpIHtcbiAgICAgKiAgICRzY29wZS5jaGFuZ2VTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgKiAgICAgJHN0YXRlLmdvKCdjb250YWN0LmRldGFpbCcpO1xuICAgICAqICAgfTtcbiAgICAgKiB9KTtcbiAgICAgKiA8L3ByZT5cbiAgICAgKiA8aW1nIHNyYz0nLi4vbmdkb2NfYXNzZXRzL1N0YXRlR29FeGFtcGxlcy5wbmcnLz5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0byBBYnNvbHV0ZSBzdGF0ZSBuYW1lIG9yIHJlbGF0aXZlIHN0YXRlIHBhdGguIFNvbWUgZXhhbXBsZXM6XG4gICAgICpcbiAgICAgKiAtIGAkc3RhdGUuZ28oJ2NvbnRhY3QuZGV0YWlsJylgIC0gd2lsbCBnbyB0byB0aGUgYGNvbnRhY3QuZGV0YWlsYCBzdGF0ZVxuICAgICAqIC0gYCRzdGF0ZS5nbygnXicpYCAtIHdpbGwgZ28gdG8gYSBwYXJlbnQgc3RhdGVcbiAgICAgKiAtIGAkc3RhdGUuZ28oJ14uc2libGluZycpYCAtIHdpbGwgZ28gdG8gYSBzaWJsaW5nIHN0YXRlXG4gICAgICogLSBgJHN0YXRlLmdvKCcuY2hpbGQuZ3JhbmRjaGlsZCcpYCAtIHdpbGwgZ28gdG8gZ3JhbmRjaGlsZCBzdGF0ZVxuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3Q9fSBwYXJhbXMgQSBtYXAgb2YgdGhlIHBhcmFtZXRlcnMgdGhhdCB3aWxsIGJlIHNlbnQgdG8gdGhlIHN0YXRlLCBcbiAgICAgKiB3aWxsIHBvcHVsYXRlICRzdGF0ZVBhcmFtcy4gQW55IHBhcmFtZXRlcnMgdGhhdCBhcmUgbm90IHNwZWNpZmllZCB3aWxsIGJlIGluaGVyaXRlZCBmcm9tIGN1cnJlbnRseSBcbiAgICAgKiBkZWZpbmVkIHBhcmFtZXRlcnMuIFRoaXMgYWxsb3dzLCBmb3IgZXhhbXBsZSwgZ29pbmcgdG8gYSBzaWJsaW5nIHN0YXRlIHRoYXQgc2hhcmVzIHBhcmFtZXRlcnNcbiAgICAgKiBzcGVjaWZpZWQgaW4gYSBwYXJlbnQgc3RhdGUuIFBhcmFtZXRlciBpbmhlcml0YW5jZSBvbmx5IHdvcmtzIGJldHdlZW4gY29tbW9uIGFuY2VzdG9yIHN0YXRlcywgSS5lLlxuICAgICAqIHRyYW5zaXRpb25pbmcgdG8gYSBzaWJsaW5nIHdpbGwgZ2V0IHlvdSB0aGUgcGFyYW1ldGVycyBmb3IgYWxsIHBhcmVudHMsIHRyYW5zaXRpb25pbmcgdG8gYSBjaGlsZFxuICAgICAqIHdpbGwgZ2V0IHlvdSBhbGwgY3VycmVudCBwYXJhbWV0ZXJzLCBldGMuXG4gICAgICogQHBhcmFtIHtvYmplY3Q9fSBvcHRpb25zIE9wdGlvbnMgb2JqZWN0LiBUaGUgb3B0aW9ucyBhcmU6XG4gICAgICpcbiAgICAgKiAtICoqYGxvY2F0aW9uYCoqIC0ge2Jvb2xlYW49dHJ1ZXxzdHJpbmc9fSAtIElmIGB0cnVlYCB3aWxsIHVwZGF0ZSB0aGUgdXJsIGluIHRoZSBsb2NhdGlvbiBiYXIsIGlmIGBmYWxzZWBcbiAgICAgKiAgICB3aWxsIG5vdC4gSWYgc3RyaW5nLCBtdXN0IGJlIGBcInJlcGxhY2VcImAsIHdoaWNoIHdpbGwgdXBkYXRlIHVybCBhbmQgYWxzbyByZXBsYWNlIGxhc3QgaGlzdG9yeSByZWNvcmQuXG4gICAgICogLSAqKmBpbmhlcml0YCoqIC0ge2Jvb2xlYW49dHJ1ZX0sIElmIGB0cnVlYCB3aWxsIGluaGVyaXQgdXJsIHBhcmFtZXRlcnMgZnJvbSBjdXJyZW50IHVybC5cbiAgICAgKiAtICoqYHJlbGF0aXZlYCoqIC0ge29iamVjdD0kc3RhdGUuJGN1cnJlbnR9LCBXaGVuIHRyYW5zaXRpb25pbmcgd2l0aCByZWxhdGl2ZSBwYXRoIChlLmcgJ14nKSwgXG4gICAgICogICAgZGVmaW5lcyB3aGljaCBzdGF0ZSB0byBiZSByZWxhdGl2ZSBmcm9tLlxuICAgICAqIC0gKipgbm90aWZ5YCoqIC0ge2Jvb2xlYW49dHJ1ZX0sIElmIGB0cnVlYCB3aWxsIGJyb2FkY2FzdCAkc3RhdGVDaGFuZ2VTdGFydCBhbmQgJHN0YXRlQ2hhbmdlU3VjY2VzcyBldmVudHMuXG4gICAgICogLSAqKmByZWxvYWRgKiogKHYwLjIuNSkgLSB7Ym9vbGVhbj1mYWxzZX0sIElmIGB0cnVlYCB3aWxsIGZvcmNlIHRyYW5zaXRpb24gZXZlbiBpZiB0aGUgc3RhdGUgb3IgcGFyYW1zIFxuICAgICAqICAgIGhhdmUgbm90IGNoYW5nZWQsIGFrYSBhIHJlbG9hZCBvZiB0aGUgc2FtZSBzdGF0ZS4gSXQgZGlmZmVycyBmcm9tIHJlbG9hZE9uU2VhcmNoIGJlY2F1c2UgeW91J2RcbiAgICAgKiAgICB1c2UgdGhpcyB3aGVuIHlvdSB3YW50IHRvIGZvcmNlIGEgcmVsb2FkIHdoZW4gKmV2ZXJ5dGhpbmcqIGlzIHRoZSBzYW1lLCBpbmNsdWRpbmcgc2VhcmNoIHBhcmFtcy5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtwcm9taXNlfSBBIHByb21pc2UgcmVwcmVzZW50aW5nIHRoZSBzdGF0ZSBvZiB0aGUgbmV3IHRyYW5zaXRpb24uXG4gICAgICpcbiAgICAgKiBQb3NzaWJsZSBzdWNjZXNzIHZhbHVlczpcbiAgICAgKlxuICAgICAqIC0gJHN0YXRlLmN1cnJlbnRcbiAgICAgKlxuICAgICAqIDxici8+UG9zc2libGUgcmVqZWN0aW9uIHZhbHVlczpcbiAgICAgKlxuICAgICAqIC0gJ3RyYW5zaXRpb24gc3VwZXJzZWRlZCcgLSB3aGVuIGEgbmV3ZXIgdHJhbnNpdGlvbiBoYXMgYmVlbiBzdGFydGVkIGFmdGVyIHRoaXMgb25lXG4gICAgICogLSAndHJhbnNpdGlvbiBwcmV2ZW50ZWQnIC0gd2hlbiBgZXZlbnQucHJldmVudERlZmF1bHQoKWAgaGFzIGJlZW4gY2FsbGVkIGluIGEgYCRzdGF0ZUNoYW5nZVN0YXJ0YCBsaXN0ZW5lclxuICAgICAqIC0gJ3RyYW5zaXRpb24gYWJvcnRlZCcgLSB3aGVuIGBldmVudC5wcmV2ZW50RGVmYXVsdCgpYCBoYXMgYmVlbiBjYWxsZWQgaW4gYSBgJHN0YXRlTm90Rm91bmRgIGxpc3RlbmVyIG9yXG4gICAgICogICB3aGVuIGEgYCRzdGF0ZU5vdEZvdW5kYCBgZXZlbnQucmV0cnlgIHByb21pc2UgZXJyb3JzLlxuICAgICAqIC0gJ3RyYW5zaXRpb24gZmFpbGVkJyAtIHdoZW4gYSBzdGF0ZSBoYXMgYmVlbiB1bnN1Y2Nlc3NmdWxseSBmb3VuZCBhZnRlciAyIHRyaWVzLlxuICAgICAqIC0gKnJlc29sdmUgZXJyb3IqIC0gd2hlbiBhbiBlcnJvciBoYXMgb2NjdXJyZWQgd2l0aCBhIGByZXNvbHZlYFxuICAgICAqXG4gICAgICovXG4gICAgJHN0YXRlLmdvID0gZnVuY3Rpb24gZ28odG8sIHBhcmFtcywgb3B0aW9ucykge1xuICAgICAgcmV0dXJuIHRoaXMudHJhbnNpdGlvblRvKHRvLCBwYXJhbXMsIGV4dGVuZCh7IGluaGVyaXQ6IHRydWUsIHJlbGF0aXZlOiAkc3RhdGUuJGN1cnJlbnQgfSwgb3B0aW9ucykpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICAgKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlI3RyYW5zaXRpb25Ub1xuICAgICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlXG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBMb3ctbGV2ZWwgbWV0aG9kIGZvciB0cmFuc2l0aW9uaW5nIHRvIGEgbmV3IHN0YXRlLiB7QGxpbmsgdWkucm91dGVyLnN0YXRlLiRzdGF0ZSNtZXRob2RzX2dvICRzdGF0ZS5nb31cbiAgICAgKiB1c2VzIGB0cmFuc2l0aW9uVG9gIGludGVybmFsbHkuIGAkc3RhdGUuZ29gIGlzIHJlY29tbWVuZGVkIGluIG1vc3Qgc2l0dWF0aW9ucy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogPHByZT5cbiAgICAgKiB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsndWkucm91dGVyJ10pO1xuICAgICAqXG4gICAgICogYXBwLmNvbnRyb2xsZXIoJ2N0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUpIHtcbiAgICAgKiAgICRzY29wZS5jaGFuZ2VTdGF0ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgKiAgICAgJHN0YXRlLnRyYW5zaXRpb25UbygnY29udGFjdC5kZXRhaWwnKTtcbiAgICAgKiAgIH07XG4gICAgICogfSk7XG4gICAgICogPC9wcmU+XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdG8gU3RhdGUgbmFtZS5cbiAgICAgKiBAcGFyYW0ge29iamVjdD19IHRvUGFyYW1zIEEgbWFwIG9mIHRoZSBwYXJhbWV0ZXJzIHRoYXQgd2lsbCBiZSBzZW50IHRvIHRoZSBzdGF0ZSxcbiAgICAgKiB3aWxsIHBvcHVsYXRlICRzdGF0ZVBhcmFtcy5cbiAgICAgKiBAcGFyYW0ge29iamVjdD19IG9wdGlvbnMgT3B0aW9ucyBvYmplY3QuIFRoZSBvcHRpb25zIGFyZTpcbiAgICAgKlxuICAgICAqIC0gKipgbG9jYXRpb25gKiogLSB7Ym9vbGVhbj10cnVlfHN0cmluZz19IC0gSWYgYHRydWVgIHdpbGwgdXBkYXRlIHRoZSB1cmwgaW4gdGhlIGxvY2F0aW9uIGJhciwgaWYgYGZhbHNlYFxuICAgICAqICAgIHdpbGwgbm90LiBJZiBzdHJpbmcsIG11c3QgYmUgYFwicmVwbGFjZVwiYCwgd2hpY2ggd2lsbCB1cGRhdGUgdXJsIGFuZCBhbHNvIHJlcGxhY2UgbGFzdCBoaXN0b3J5IHJlY29yZC5cbiAgICAgKiAtICoqYGluaGVyaXRgKiogLSB7Ym9vbGVhbj1mYWxzZX0sIElmIGB0cnVlYCB3aWxsIGluaGVyaXQgdXJsIHBhcmFtZXRlcnMgZnJvbSBjdXJyZW50IHVybC5cbiAgICAgKiAtICoqYHJlbGF0aXZlYCoqIC0ge29iamVjdD19LCBXaGVuIHRyYW5zaXRpb25pbmcgd2l0aCByZWxhdGl2ZSBwYXRoIChlLmcgJ14nKSwgXG4gICAgICogICAgZGVmaW5lcyB3aGljaCBzdGF0ZSB0byBiZSByZWxhdGl2ZSBmcm9tLlxuICAgICAqIC0gKipgbm90aWZ5YCoqIC0ge2Jvb2xlYW49dHJ1ZX0sIElmIGB0cnVlYCB3aWxsIGJyb2FkY2FzdCAkc3RhdGVDaGFuZ2VTdGFydCBhbmQgJHN0YXRlQ2hhbmdlU3VjY2VzcyBldmVudHMuXG4gICAgICogLSAqKmByZWxvYWRgKiogKHYwLjIuNSkgLSB7Ym9vbGVhbj1mYWxzZX0sIElmIGB0cnVlYCB3aWxsIGZvcmNlIHRyYW5zaXRpb24gZXZlbiBpZiB0aGUgc3RhdGUgb3IgcGFyYW1zIFxuICAgICAqICAgIGhhdmUgbm90IGNoYW5nZWQsIGFrYSBhIHJlbG9hZCBvZiB0aGUgc2FtZSBzdGF0ZS4gSXQgZGlmZmVycyBmcm9tIHJlbG9hZE9uU2VhcmNoIGJlY2F1c2UgeW91J2RcbiAgICAgKiAgICB1c2UgdGhpcyB3aGVuIHlvdSB3YW50IHRvIGZvcmNlIGEgcmVsb2FkIHdoZW4gKmV2ZXJ5dGhpbmcqIGlzIHRoZSBzYW1lLCBpbmNsdWRpbmcgc2VhcmNoIHBhcmFtcy5cbiAgICAgKlxuICAgICAqIEByZXR1cm5zIHtwcm9taXNlfSBBIHByb21pc2UgcmVwcmVzZW50aW5nIHRoZSBzdGF0ZSBvZiB0aGUgbmV3IHRyYW5zaXRpb24uIFNlZVxuICAgICAqIHtAbGluayB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlI21ldGhvZHNfZ28gJHN0YXRlLmdvfS5cbiAgICAgKi9cbiAgICAkc3RhdGUudHJhbnNpdGlvblRvID0gZnVuY3Rpb24gdHJhbnNpdGlvblRvKHRvLCB0b1BhcmFtcywgb3B0aW9ucykge1xuICAgICAgdG9QYXJhbXMgPSB0b1BhcmFtcyB8fCB7fTtcbiAgICAgIG9wdGlvbnMgPSBleHRlbmQoe1xuICAgICAgICBsb2NhdGlvbjogdHJ1ZSwgaW5oZXJpdDogZmFsc2UsIHJlbGF0aXZlOiBudWxsLCBub3RpZnk6IHRydWUsIHJlbG9hZDogZmFsc2UsICRyZXRyeTogZmFsc2VcbiAgICAgIH0sIG9wdGlvbnMgfHwge30pO1xuXG4gICAgICB2YXIgZnJvbSA9ICRzdGF0ZS4kY3VycmVudCwgZnJvbVBhcmFtcyA9ICRzdGF0ZS5wYXJhbXMsIGZyb21QYXRoID0gZnJvbS5wYXRoO1xuICAgICAgdmFyIGV2dCwgdG9TdGF0ZSA9IGZpbmRTdGF0ZSh0bywgb3B0aW9ucy5yZWxhdGl2ZSk7XG5cbiAgICAgIGlmICghaXNEZWZpbmVkKHRvU3RhdGUpKSB7XG4gICAgICAgIC8vIEJyb2FkY2FzdCBub3QgZm91bmQgZXZlbnQgYW5kIGFib3J0IHRoZSB0cmFuc2l0aW9uIGlmIHByZXZlbnRlZFxuICAgICAgICB2YXIgcmVkaXJlY3QgPSB7IHRvOiB0bywgdG9QYXJhbXM6IHRvUGFyYW1zLCBvcHRpb25zOiBvcHRpb25zIH07XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuZ2RvYyBldmVudFxuICAgICAgICAgKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlIyRzdGF0ZU5vdEZvdW5kXG4gICAgICAgICAqIEBldmVudE9mIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVcbiAgICAgICAgICogQGV2ZW50VHlwZSBicm9hZGNhc3Qgb24gcm9vdCBzY29wZVxuICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICogRmlyZWQgd2hlbiBhIHJlcXVlc3RlZCBzdGF0ZSAqKmNhbm5vdCBiZSBmb3VuZCoqIHVzaW5nIHRoZSBwcm92aWRlZCBzdGF0ZSBuYW1lIGR1cmluZyB0cmFuc2l0aW9uLlxuICAgICAgICAgKiBUaGUgZXZlbnQgaXMgYnJvYWRjYXN0IGFsbG93aW5nIGFueSBoYW5kbGVycyBhIHNpbmdsZSBjaGFuY2UgdG8gZGVhbCB3aXRoIHRoZSBlcnJvciAodXN1YWxseSBieVxuICAgICAgICAgKiBsYXp5LWxvYWRpbmcgdGhlIHVuZm91bmQgc3RhdGUpLiBBIHNwZWNpYWwgYHVuZm91bmRTdGF0ZWAgb2JqZWN0IGlzIHBhc3NlZCB0byB0aGUgbGlzdGVuZXIgaGFuZGxlcixcbiAgICAgICAgICogeW91IGNhbiBzZWUgaXRzIHRocmVlIHByb3BlcnRpZXMgaW4gdGhlIGV4YW1wbGUuIFlvdSBjYW4gdXNlIGBldmVudC5wcmV2ZW50RGVmYXVsdCgpYCB0byBhYm9ydCB0aGVcbiAgICAgICAgICogdHJhbnNpdGlvbiBhbmQgdGhlIHByb21pc2UgcmV0dXJuZWQgZnJvbSBgZ29gIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aCBhIGAndHJhbnNpdGlvbiBhYm9ydGVkJ2AgdmFsdWUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBldmVudCBFdmVudCBvYmplY3QuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSB1bmZvdW5kU3RhdGUgVW5mb3VuZCBTdGF0ZSBpbmZvcm1hdGlvbi4gQ29udGFpbnM6IGB0bywgdG9QYXJhbXMsIG9wdGlvbnNgIHByb3BlcnRpZXMuXG4gICAgICAgICAqIEBwYXJhbSB7U3RhdGV9IGZyb21TdGF0ZSBDdXJyZW50IHN0YXRlIG9iamVjdC5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGZyb21QYXJhbXMgQ3VycmVudCBzdGF0ZSBwYXJhbXMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqXG4gICAgICAgICAqIDxwcmU+XG4gICAgICAgICAqIC8vIHNvbWV3aGVyZSwgYXNzdW1lIGxhenkuc3RhdGUgaGFzIG5vdCBiZWVuIGRlZmluZWRcbiAgICAgICAgICogJHN0YXRlLmdvKFwibGF6eS5zdGF0ZVwiLCB7YToxLCBiOjJ9LCB7aW5oZXJpdDpmYWxzZX0pO1xuICAgICAgICAgKlxuICAgICAgICAgKiAvLyBzb21ld2hlcmUgZWxzZVxuICAgICAgICAgKiAkc2NvcGUuJG9uKCckc3RhdGVOb3RGb3VuZCcsXG4gICAgICAgICAqIGZ1bmN0aW9uKGV2ZW50LCB1bmZvdW5kU3RhdGUsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcyl7XG4gICAgICAgICAqICAgICBjb25zb2xlLmxvZyh1bmZvdW5kU3RhdGUudG8pOyAvLyBcImxhenkuc3RhdGVcIlxuICAgICAgICAgKiAgICAgY29uc29sZS5sb2codW5mb3VuZFN0YXRlLnRvUGFyYW1zKTsgLy8ge2E6MSwgYjoyfVxuICAgICAgICAgKiAgICAgY29uc29sZS5sb2codW5mb3VuZFN0YXRlLm9wdGlvbnMpOyAvLyB7aW5oZXJpdDpmYWxzZX0gKyBkZWZhdWx0IG9wdGlvbnNcbiAgICAgICAgICogfSlcbiAgICAgICAgICogPC9wcmU+XG4gICAgICAgICAqL1xuICAgICAgICBldnQgPSAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJyRzdGF0ZU5vdEZvdW5kJywgcmVkaXJlY3QsIGZyb20uc2VsZiwgZnJvbVBhcmFtcyk7XG4gICAgICAgIGlmIChldnQuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgICAgIHN5bmNVcmwoKTtcbiAgICAgICAgICByZXR1cm4gVHJhbnNpdGlvbkFib3J0ZWQ7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBbGxvdyB0aGUgaGFuZGxlciB0byByZXR1cm4gYSBwcm9taXNlIHRvIGRlZmVyIHN0YXRlIGxvb2t1cCByZXRyeVxuICAgICAgICBpZiAoZXZ0LnJldHJ5KSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMuJHJldHJ5KSB7XG4gICAgICAgICAgICBzeW5jVXJsKCk7XG4gICAgICAgICAgICByZXR1cm4gVHJhbnNpdGlvbkZhaWxlZDtcbiAgICAgICAgICB9XG4gICAgICAgICAgdmFyIHJldHJ5VHJhbnNpdGlvbiA9ICRzdGF0ZS50cmFuc2l0aW9uID0gJHEud2hlbihldnQucmV0cnkpO1xuICAgICAgICAgIHJldHJ5VHJhbnNpdGlvbi50aGVuKGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgaWYgKHJldHJ5VHJhbnNpdGlvbiAhPT0gJHN0YXRlLnRyYW5zaXRpb24pIHJldHVybiBUcmFuc2l0aW9uU3VwZXJzZWRlZDtcbiAgICAgICAgICAgIHJlZGlyZWN0Lm9wdGlvbnMuJHJldHJ5ID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiAkc3RhdGUudHJhbnNpdGlvblRvKHJlZGlyZWN0LnRvLCByZWRpcmVjdC50b1BhcmFtcywgcmVkaXJlY3Qub3B0aW9ucyk7XG4gICAgICAgICAgfSwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICByZXR1cm4gVHJhbnNpdGlvbkFib3J0ZWQ7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgc3luY1VybCgpO1xuICAgICAgICAgIHJldHVybiByZXRyeVRyYW5zaXRpb247XG4gICAgICAgIH1cblxuICAgICAgICAvLyBBbHdheXMgcmV0cnkgb25jZSBpZiB0aGUgJHN0YXRlTm90Rm91bmQgd2FzIG5vdCBwcmV2ZW50ZWRcbiAgICAgICAgLy8gKGhhbmRsZXMgZWl0aGVyIHJlZGlyZWN0IGNoYW5nZWQgb3Igc3RhdGUgbGF6eS1kZWZpbml0aW9uKVxuICAgICAgICB0byA9IHJlZGlyZWN0LnRvO1xuICAgICAgICB0b1BhcmFtcyA9IHJlZGlyZWN0LnRvUGFyYW1zO1xuICAgICAgICBvcHRpb25zID0gcmVkaXJlY3Qub3B0aW9ucztcbiAgICAgICAgdG9TdGF0ZSA9IGZpbmRTdGF0ZSh0bywgb3B0aW9ucy5yZWxhdGl2ZSk7XG4gICAgICAgIGlmICghaXNEZWZpbmVkKHRvU3RhdGUpKSB7XG4gICAgICAgICAgaWYgKG9wdGlvbnMucmVsYXRpdmUpIHRocm93IG5ldyBFcnJvcihcIkNvdWxkIG5vdCByZXNvbHZlICdcIiArIHRvICsgXCInIGZyb20gc3RhdGUgJ1wiICsgb3B0aW9ucy5yZWxhdGl2ZSArIFwiJ1wiKTtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJObyBzdWNoIHN0YXRlICdcIiArIHRvICsgXCInXCIpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBpZiAodG9TdGF0ZVthYnN0cmFjdEtleV0pIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCB0cmFuc2l0aW9uIHRvIGFic3RyYWN0IHN0YXRlICdcIiArIHRvICsgXCInXCIpO1xuICAgICAgaWYgKG9wdGlvbnMuaW5oZXJpdCkgdG9QYXJhbXMgPSBpbmhlcml0UGFyYW1zKCRzdGF0ZVBhcmFtcywgdG9QYXJhbXMgfHwge30sICRzdGF0ZS4kY3VycmVudCwgdG9TdGF0ZSk7XG4gICAgICB0byA9IHRvU3RhdGU7XG5cbiAgICAgIHZhciB0b1BhdGggPSB0by5wYXRoO1xuXG4gICAgICAvLyBTdGFydGluZyBmcm9tIHRoZSByb290IG9mIHRoZSBwYXRoLCBrZWVwIGFsbCBsZXZlbHMgdGhhdCBoYXZlbid0IGNoYW5nZWRcbiAgICAgIHZhciBrZWVwLCBzdGF0ZSwgbG9jYWxzID0gcm9vdC5sb2NhbHMsIHRvTG9jYWxzID0gW107XG4gICAgICBmb3IgKGtlZXAgPSAwLCBzdGF0ZSA9IHRvUGF0aFtrZWVwXTtcbiAgICAgICAgICAgc3RhdGUgJiYgc3RhdGUgPT09IGZyb21QYXRoW2tlZXBdICYmIGVxdWFsRm9yS2V5cyh0b1BhcmFtcywgZnJvbVBhcmFtcywgc3RhdGUub3duUGFyYW1zKSAmJiAhb3B0aW9ucy5yZWxvYWQ7XG4gICAgICAgICAgIGtlZXArKywgc3RhdGUgPSB0b1BhdGhba2VlcF0pIHtcbiAgICAgICAgbG9jYWxzID0gdG9Mb2NhbHNba2VlcF0gPSBzdGF0ZS5sb2NhbHM7XG4gICAgICB9XG5cbiAgICAgIC8vIElmIHdlJ3JlIGdvaW5nIHRvIHRoZSBzYW1lIHN0YXRlIGFuZCBhbGwgbG9jYWxzIGFyZSBrZXB0LCB3ZSd2ZSBnb3Qgbm90aGluZyB0byBkby5cbiAgICAgIC8vIEJ1dCBjbGVhciAndHJhbnNpdGlvbicsIGFzIHdlIHN0aWxsIHdhbnQgdG8gY2FuY2VsIGFueSBvdGhlciBwZW5kaW5nIHRyYW5zaXRpb25zLlxuICAgICAgLy8gVE9ETzogV2UgbWF5IG5vdCB3YW50IHRvIGJ1bXAgJ3RyYW5zaXRpb24nIGlmIHdlJ3JlIGNhbGxlZCBmcm9tIGEgbG9jYXRpb24gY2hhbmdlIHRoYXQgd2UndmUgaW5pdGlhdGVkIG91cnNlbHZlcyxcbiAgICAgIC8vIGJlY2F1c2Ugd2UgbWlnaHQgYWNjaWRlbnRhbGx5IGFib3J0IGEgbGVnaXRpbWF0ZSB0cmFuc2l0aW9uIGluaXRpYXRlZCBmcm9tIGNvZGU/XG4gICAgICBpZiAoc2hvdWxkVHJpZ2dlclJlbG9hZCh0bywgZnJvbSwgbG9jYWxzLCBvcHRpb25zKSApIHtcbiAgICAgICAgaWYgKCB0by5zZWxmLnJlbG9hZE9uU2VhcmNoICE9PSBmYWxzZSApXG4gICAgICAgICAgc3luY1VybCgpO1xuICAgICAgICAkc3RhdGUudHJhbnNpdGlvbiA9IG51bGw7XG4gICAgICAgIHJldHVybiAkcS53aGVuKCRzdGF0ZS5jdXJyZW50KTtcbiAgICAgIH1cblxuICAgICAgLy8gTm9ybWFsaXplL2ZpbHRlciBwYXJhbWV0ZXJzIGJlZm9yZSB3ZSBwYXNzIHRoZW0gdG8gZXZlbnQgaGFuZGxlcnMgZXRjLlxuICAgICAgdG9QYXJhbXMgPSBub3JtYWxpemUodG8ucGFyYW1zLCB0b1BhcmFtcyB8fCB7fSk7XG5cbiAgICAgIC8vIEJyb2FkY2FzdCBzdGFydCBldmVudCBhbmQgY2FuY2VsIHRoZSB0cmFuc2l0aW9uIGlmIHJlcXVlc3RlZFxuICAgICAgaWYgKG9wdGlvbnMubm90aWZ5KSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmdkb2MgZXZlbnRcbiAgICAgICAgICogQG5hbWUgdWkucm91dGVyLnN0YXRlLiRzdGF0ZSMkc3RhdGVDaGFuZ2VTdGFydFxuICAgICAgICAgKiBAZXZlbnRPZiB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlXG4gICAgICAgICAqIEBldmVudFR5cGUgYnJvYWRjYXN0IG9uIHJvb3Qgc2NvcGVcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIEZpcmVkIHdoZW4gdGhlIHN0YXRlIHRyYW5zaXRpb24gKipiZWdpbnMqKi4gWW91IGNhbiB1c2UgYGV2ZW50LnByZXZlbnREZWZhdWx0KClgXG4gICAgICAgICAqIHRvIHByZXZlbnQgdGhlIHRyYW5zaXRpb24gZnJvbSBoYXBwZW5pbmcgYW5kIHRoZW4gdGhlIHRyYW5zaXRpb24gcHJvbWlzZSB3aWxsIGJlXG4gICAgICAgICAqIHJlamVjdGVkIHdpdGggYSBgJ3RyYW5zaXRpb24gcHJldmVudGVkJ2AgdmFsdWUuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBldmVudCBFdmVudCBvYmplY3QuXG4gICAgICAgICAqIEBwYXJhbSB7U3RhdGV9IHRvU3RhdGUgVGhlIHN0YXRlIGJlaW5nIHRyYW5zaXRpb25lZCB0by5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHRvUGFyYW1zIFRoZSBwYXJhbXMgc3VwcGxpZWQgdG8gdGhlIGB0b1N0YXRlYC5cbiAgICAgICAgICogQHBhcmFtIHtTdGF0ZX0gZnJvbVN0YXRlIFRoZSBjdXJyZW50IHN0YXRlLCBwcmUtdHJhbnNpdGlvbi5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGZyb21QYXJhbXMgVGhlIHBhcmFtcyBzdXBwbGllZCB0byB0aGUgYGZyb21TdGF0ZWAuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqXG4gICAgICAgICAqIDxwcmU+XG4gICAgICAgICAqICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsXG4gICAgICAgICAqIGZ1bmN0aW9uKGV2ZW50LCB0b1N0YXRlLCB0b1BhcmFtcywgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKXtcbiAgICAgICAgICogICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAqICAgICAvLyB0cmFuc2l0aW9uVG8oKSBwcm9taXNlIHdpbGwgYmUgcmVqZWN0ZWQgd2l0aFxuICAgICAgICAgKiAgICAgLy8gYSAndHJhbnNpdGlvbiBwcmV2ZW50ZWQnIGVycm9yXG4gICAgICAgICAqIH0pXG4gICAgICAgICAqIDwvcHJlPlxuICAgICAgICAgKi9cbiAgICAgICAgZXZ0ID0gJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckc3RhdGVDaGFuZ2VTdGFydCcsIHRvLnNlbGYsIHRvUGFyYW1zLCBmcm9tLnNlbGYsIGZyb21QYXJhbXMpO1xuICAgICAgICBpZiAoZXZ0LmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgICAgICBzeW5jVXJsKCk7XG4gICAgICAgICAgcmV0dXJuIFRyYW5zaXRpb25QcmV2ZW50ZWQ7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgLy8gUmVzb2x2ZSBsb2NhbHMgZm9yIHRoZSByZW1haW5pbmcgc3RhdGVzLCBidXQgZG9uJ3QgdXBkYXRlIGFueSBnbG9iYWwgc3RhdGUganVzdFxuICAgICAgLy8geWV0IC0tIGlmIGFueXRoaW5nIGZhaWxzIHRvIHJlc29sdmUgdGhlIGN1cnJlbnQgc3RhdGUgbmVlZHMgdG8gcmVtYWluIHVudG91Y2hlZC5cbiAgICAgIC8vIFdlIGFsc28gc2V0IHVwIGFuIGluaGVyaXRhbmNlIGNoYWluIGZvciB0aGUgbG9jYWxzIGhlcmUuIFRoaXMgYWxsb3dzIHRoZSB2aWV3IGRpcmVjdGl2ZVxuICAgICAgLy8gdG8gcXVpY2tseSBsb29rIHVwIHRoZSBjb3JyZWN0IGRlZmluaXRpb24gZm9yIGVhY2ggdmlldyBpbiB0aGUgY3VycmVudCBzdGF0ZS4gRXZlblxuICAgICAgLy8gdGhvdWdoIHdlIGNyZWF0ZSB0aGUgbG9jYWxzIG9iamVjdCBpdHNlbGYgb3V0c2lkZSByZXNvbHZlU3RhdGUoKSwgaXQgaXMgaW5pdGlhbGx5XG4gICAgICAvLyBlbXB0eSBhbmQgZ2V0cyBmaWxsZWQgYXN5bmNocm9ub3VzbHkuIFdlIG5lZWQgdG8ga2VlcCB0cmFjayBvZiB0aGUgcHJvbWlzZSBmb3IgdGhlXG4gICAgICAvLyAoZnVsbHkgcmVzb2x2ZWQpIGN1cnJlbnQgbG9jYWxzLCBhbmQgcGFzcyB0aGlzIGRvd24gdGhlIGNoYWluLlxuICAgICAgdmFyIHJlc29sdmVkID0gJHEud2hlbihsb2NhbHMpO1xuICAgICAgZm9yICh2YXIgbD1rZWVwOyBsPHRvUGF0aC5sZW5ndGg7IGwrKywgc3RhdGU9dG9QYXRoW2xdKSB7XG4gICAgICAgIGxvY2FscyA9IHRvTG9jYWxzW2xdID0gaW5oZXJpdChsb2NhbHMpO1xuICAgICAgICByZXNvbHZlZCA9IHJlc29sdmVTdGF0ZShzdGF0ZSwgdG9QYXJhbXMsIHN0YXRlPT09dG8sIHJlc29sdmVkLCBsb2NhbHMpO1xuICAgICAgfVxuXG4gICAgICAvLyBPbmNlIGV2ZXJ5dGhpbmcgaXMgcmVzb2x2ZWQsIHdlIGFyZSByZWFkeSB0byBwZXJmb3JtIHRoZSBhY3R1YWwgdHJhbnNpdGlvblxuICAgICAgLy8gYW5kIHJldHVybiBhIHByb21pc2UgZm9yIHRoZSBuZXcgc3RhdGUuIFdlIGFsc28ga2VlcCB0cmFjayBvZiB3aGF0IHRoZVxuICAgICAgLy8gY3VycmVudCBwcm9taXNlIGlzLCBzbyB0aGF0IHdlIGNhbiBkZXRlY3Qgb3ZlcmxhcHBpbmcgdHJhbnNpdGlvbnMgYW5kXG4gICAgICAvLyBrZWVwIG9ubHkgdGhlIG91dGNvbWUgb2YgdGhlIGxhc3QgdHJhbnNpdGlvbi5cbiAgICAgIHZhciB0cmFuc2l0aW9uID0gJHN0YXRlLnRyYW5zaXRpb24gPSByZXNvbHZlZC50aGVuKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGwsIGVudGVyaW5nLCBleGl0aW5nO1xuXG4gICAgICAgIGlmICgkc3RhdGUudHJhbnNpdGlvbiAhPT0gdHJhbnNpdGlvbikgcmV0dXJuIFRyYW5zaXRpb25TdXBlcnNlZGVkO1xuXG4gICAgICAgIC8vIEV4aXQgJ2Zyb20nIHN0YXRlcyBub3Qga2VwdFxuICAgICAgICBmb3IgKGw9ZnJvbVBhdGgubGVuZ3RoLTE7IGw+PWtlZXA7IGwtLSkge1xuICAgICAgICAgIGV4aXRpbmcgPSBmcm9tUGF0aFtsXTtcbiAgICAgICAgICBpZiAoZXhpdGluZy5zZWxmLm9uRXhpdCkge1xuICAgICAgICAgICAgJGluamVjdG9yLmludm9rZShleGl0aW5nLnNlbGYub25FeGl0LCBleGl0aW5nLnNlbGYsIGV4aXRpbmcubG9jYWxzLmdsb2JhbHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBleGl0aW5nLmxvY2FscyA9IG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBFbnRlciAndG8nIHN0YXRlcyBub3Qga2VwdFxuICAgICAgICBmb3IgKGw9a2VlcDsgbDx0b1BhdGgubGVuZ3RoOyBsKyspIHtcbiAgICAgICAgICBlbnRlcmluZyA9IHRvUGF0aFtsXTtcbiAgICAgICAgICBlbnRlcmluZy5sb2NhbHMgPSB0b0xvY2Fsc1tsXTtcbiAgICAgICAgICBpZiAoZW50ZXJpbmcuc2VsZi5vbkVudGVyKSB7XG4gICAgICAgICAgICAkaW5qZWN0b3IuaW52b2tlKGVudGVyaW5nLnNlbGYub25FbnRlciwgZW50ZXJpbmcuc2VsZiwgZW50ZXJpbmcubG9jYWxzLmdsb2JhbHMpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFJ1biBpdCBhZ2FpbiwgdG8gY2F0Y2ggYW55IHRyYW5zaXRpb25zIGluIGNhbGxiYWNrc1xuICAgICAgICBpZiAoJHN0YXRlLnRyYW5zaXRpb24gIT09IHRyYW5zaXRpb24pIHJldHVybiBUcmFuc2l0aW9uU3VwZXJzZWRlZDtcblxuICAgICAgICAvLyBVcGRhdGUgZ2xvYmFscyBpbiAkc3RhdGVcbiAgICAgICAgJHN0YXRlLiRjdXJyZW50ID0gdG87XG4gICAgICAgICRzdGF0ZS5jdXJyZW50ID0gdG8uc2VsZjtcbiAgICAgICAgJHN0YXRlLnBhcmFtcyA9IHRvUGFyYW1zO1xuICAgICAgICBjb3B5KCRzdGF0ZS5wYXJhbXMsICRzdGF0ZVBhcmFtcyk7XG4gICAgICAgICRzdGF0ZS50cmFuc2l0aW9uID0gbnVsbDtcblxuICAgICAgICAvLyBVcGRhdGUgJGxvY2F0aW9uXG4gICAgICAgIHZhciB0b05hdiA9IHRvLm5hdmlnYWJsZTtcbiAgICAgICAgaWYgKG9wdGlvbnMubG9jYXRpb24gJiYgdG9OYXYpIHtcbiAgICAgICAgICAkbG9jYXRpb24udXJsKHRvTmF2LnVybC5mb3JtYXQodG9OYXYubG9jYWxzLmdsb2JhbHMuJHN0YXRlUGFyYW1zKSk7XG5cbiAgICAgICAgICBpZiAob3B0aW9ucy5sb2NhdGlvbiA9PT0gJ3JlcGxhY2UnKSB7XG4gICAgICAgICAgICAkbG9jYXRpb24ucmVwbGFjZSgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChvcHRpb25zLm5vdGlmeSkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQG5nZG9jIGV2ZW50XG4gICAgICAgICAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGUjJHN0YXRlQ2hhbmdlU3VjY2Vzc1xuICAgICAgICAgKiBAZXZlbnRPZiB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlXG4gICAgICAgICAqIEBldmVudFR5cGUgYnJvYWRjYXN0IG9uIHJvb3Qgc2NvcGVcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIEZpcmVkIG9uY2UgdGhlIHN0YXRlIHRyYW5zaXRpb24gaXMgKipjb21wbGV0ZSoqLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnQgRXZlbnQgb2JqZWN0LlxuICAgICAgICAgKiBAcGFyYW0ge1N0YXRlfSB0b1N0YXRlIFRoZSBzdGF0ZSBiZWluZyB0cmFuc2l0aW9uZWQgdG8uXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0b1BhcmFtcyBUaGUgcGFyYW1zIHN1cHBsaWVkIHRvIHRoZSBgdG9TdGF0ZWAuXG4gICAgICAgICAqIEBwYXJhbSB7U3RhdGV9IGZyb21TdGF0ZSBUaGUgY3VycmVudCBzdGF0ZSwgcHJlLXRyYW5zaXRpb24uXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBmcm9tUGFyYW1zIFRoZSBwYXJhbXMgc3VwcGxpZWQgdG8gdGhlIGBmcm9tU3RhdGVgLlxuICAgICAgICAgKi9cbiAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCB0by5zZWxmLCB0b1BhcmFtcywgZnJvbS5zZWxmLCBmcm9tUGFyYW1zKTtcbiAgICAgICAgfVxuICAgICAgICBjdXJyZW50TG9jYXRpb24gPSAkbG9jYXRpb24udXJsKCk7XG5cbiAgICAgICAgcmV0dXJuICRzdGF0ZS5jdXJyZW50O1xuICAgICAgfSwgZnVuY3Rpb24gKGVycm9yKSB7XG4gICAgICAgIGlmICgkc3RhdGUudHJhbnNpdGlvbiAhPT0gdHJhbnNpdGlvbikgcmV0dXJuIFRyYW5zaXRpb25TdXBlcnNlZGVkO1xuXG4gICAgICAgICRzdGF0ZS50cmFuc2l0aW9uID0gbnVsbDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuZ2RvYyBldmVudFxuICAgICAgICAgKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlIyRzdGF0ZUNoYW5nZUVycm9yXG4gICAgICAgICAqIEBldmVudE9mIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVcbiAgICAgICAgICogQGV2ZW50VHlwZSBicm9hZGNhc3Qgb24gcm9vdCBzY29wZVxuICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICogRmlyZWQgd2hlbiBhbiAqKmVycm9yIG9jY3VycyoqIGR1cmluZyB0cmFuc2l0aW9uLiBJdCdzIGltcG9ydGFudCB0byBub3RlIHRoYXQgaWYgeW91XG4gICAgICAgICAqIGhhdmUgYW55IGVycm9ycyBpbiB5b3VyIHJlc29sdmUgZnVuY3Rpb25zIChqYXZhc2NyaXB0IGVycm9ycywgbm9uLWV4aXN0ZW50IHNlcnZpY2VzLCBldGMpXG4gICAgICAgICAqIHRoZXkgd2lsbCBub3QgdGhyb3cgdHJhZGl0aW9uYWxseS4gWW91IG11c3QgbGlzdGVuIGZvciB0aGlzICRzdGF0ZUNoYW5nZUVycm9yIGV2ZW50IHRvXG4gICAgICAgICAqIGNhdGNoICoqQUxMKiogZXJyb3JzLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnQgRXZlbnQgb2JqZWN0LlxuICAgICAgICAgKiBAcGFyYW0ge1N0YXRlfSB0b1N0YXRlIFRoZSBzdGF0ZSBiZWluZyB0cmFuc2l0aW9uZWQgdG8uXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0b1BhcmFtcyBUaGUgcGFyYW1zIHN1cHBsaWVkIHRvIHRoZSBgdG9TdGF0ZWAuXG4gICAgICAgICAqIEBwYXJhbSB7U3RhdGV9IGZyb21TdGF0ZSBUaGUgY3VycmVudCBzdGF0ZSwgcHJlLXRyYW5zaXRpb24uXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBmcm9tUGFyYW1zIFRoZSBwYXJhbXMgc3VwcGxpZWQgdG8gdGhlIGBmcm9tU3RhdGVgLlxuICAgICAgICAgKiBAcGFyYW0ge0Vycm9yfSBlcnJvciBUaGUgcmVzb2x2ZSBlcnJvciBvYmplY3QuXG4gICAgICAgICAqL1xuICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJyRzdGF0ZUNoYW5nZUVycm9yJywgdG8uc2VsZiwgdG9QYXJhbXMsIGZyb20uc2VsZiwgZnJvbVBhcmFtcywgZXJyb3IpO1xuICAgICAgICBzeW5jVXJsKCk7XG5cbiAgICAgICAgcmV0dXJuICRxLnJlamVjdChlcnJvcik7XG4gICAgICB9KTtcblxuICAgICAgcmV0dXJuIHRyYW5zaXRpb247XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgICAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGUjaXNcbiAgICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogU2ltaWxhciB0byB7QGxpbmsgdWkucm91dGVyLnN0YXRlLiRzdGF0ZSNtZXRob2RzX2luY2x1ZGVzICRzdGF0ZS5pbmNsdWRlc30sXG4gICAgICogYnV0IG9ubHkgY2hlY2tzIGZvciB0aGUgZnVsbCBzdGF0ZSBuYW1lLiBJZiBwYXJhbXMgaXMgc3VwcGxpZWQgdGhlbiBpdCB3aWxsIGJlIFxuICAgICAqIHRlc3RlZCBmb3Igc3RyaWN0IGVxdWFsaXR5IGFnYWluc3QgdGhlIGN1cnJlbnQgYWN0aXZlIHBhcmFtcyBvYmplY3QsIHNvIGFsbCBwYXJhbXMgXG4gICAgICogbXVzdCBtYXRjaCB3aXRoIG5vbmUgbWlzc2luZyBhbmQgbm8gZXh0cmFzLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiA8cHJlPlxuICAgICAqICRzdGF0ZS5pcygnY29udGFjdC5kZXRhaWxzLml0ZW0nKTsgLy8gcmV0dXJucyB0cnVlXG4gICAgICogJHN0YXRlLmlzKGNvbnRhY3REZXRhaWxJdGVtU3RhdGVPYmplY3QpOyAvLyByZXR1cm5zIHRydWVcbiAgICAgKlxuICAgICAqIC8vIGV2ZXJ5dGhpbmcgZWxzZSB3b3VsZCByZXR1cm4gZmFsc2VcbiAgICAgKiA8L3ByZT5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gc3RhdGVOYW1lIFRoZSBzdGF0ZSBuYW1lIG9yIHN0YXRlIG9iamVjdCB5b3UnZCBsaWtlIHRvIGNoZWNrLlxuICAgICAqIEBwYXJhbSB7b2JqZWN0PX0gcGFyYW1zIEEgcGFyYW0gb2JqZWN0LCBlLmcuIGB7c2VjdGlvbklkOiBzZWN0aW9uLmlkfWAsIHRoYXQgeW91J2QgbGlrZSBcbiAgICAgKiB0byB0ZXN0IGFnYWluc3QgdGhlIGN1cnJlbnQgYWN0aXZlIHN0YXRlLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIHRydWUgaWYgaXQgaXMgdGhlIHN0YXRlLlxuICAgICAqL1xuICAgICRzdGF0ZS5pcyA9IGZ1bmN0aW9uIGlzKHN0YXRlT3JOYW1lLCBwYXJhbXMpIHtcbiAgICAgIHZhciBzdGF0ZSA9IGZpbmRTdGF0ZShzdGF0ZU9yTmFtZSk7XG5cbiAgICAgIGlmICghaXNEZWZpbmVkKHN0YXRlKSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICBpZiAoJHN0YXRlLiRjdXJyZW50ICE9PSBzdGF0ZSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBpc0RlZmluZWQocGFyYW1zKSAmJiBwYXJhbXMgIT09IG51bGwgPyBhbmd1bGFyLmVxdWFscygkc3RhdGVQYXJhbXMsIHBhcmFtcykgOiB0cnVlO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICAgKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlI2luY2x1ZGVzXG4gICAgICogQG1ldGhvZE9mIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIEEgbWV0aG9kIHRvIGRldGVybWluZSBpZiB0aGUgY3VycmVudCBhY3RpdmUgc3RhdGUgaXMgZXF1YWwgdG8gb3IgaXMgdGhlIGNoaWxkIG9mIHRoZSBcbiAgICAgKiBzdGF0ZSBzdGF0ZU5hbWUuIElmIGFueSBwYXJhbXMgYXJlIHBhc3NlZCB0aGVuIHRoZXkgd2lsbCBiZSB0ZXN0ZWQgZm9yIGEgbWF0Y2ggYXMgd2VsbC5cbiAgICAgKiBOb3QgYWxsIHRoZSBwYXJhbWV0ZXJzIG5lZWQgdG8gYmUgcGFzc2VkLCBqdXN0IHRoZSBvbmVzIHlvdSdkIGxpa2UgdG8gdGVzdCBmb3IgZXF1YWxpdHkuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIDxwcmU+XG4gICAgICogJHN0YXRlLiRjdXJyZW50Lm5hbWUgPSAnY29udGFjdHMuZGV0YWlscy5pdGVtJztcbiAgICAgKlxuICAgICAqICRzdGF0ZS5pbmNsdWRlcyhcImNvbnRhY3RzXCIpOyAvLyByZXR1cm5zIHRydWVcbiAgICAgKiAkc3RhdGUuaW5jbHVkZXMoXCJjb250YWN0cy5kZXRhaWxzXCIpOyAvLyByZXR1cm5zIHRydWVcbiAgICAgKiAkc3RhdGUuaW5jbHVkZXMoXCJjb250YWN0cy5kZXRhaWxzLml0ZW1cIik7IC8vIHJldHVybnMgdHJ1ZVxuICAgICAqICRzdGF0ZS5pbmNsdWRlcyhcImNvbnRhY3RzLmxpc3RcIik7IC8vIHJldHVybnMgZmFsc2VcbiAgICAgKiAkc3RhdGUuaW5jbHVkZXMoXCJhYm91dFwiKTsgLy8gcmV0dXJucyBmYWxzZVxuICAgICAqIDwvcHJlPlxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQmFzaWMgZ2xvYmluZyBwYXR0ZXJucyB3aWxsIGFsc28gd29yay5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogPHByZT5cbiAgICAgKiAkc3RhdGUuJGN1cnJlbnQubmFtZSA9ICdjb250YWN0cy5kZXRhaWxzLml0ZW0udXJsJztcbiAgICAgKlxuICAgICAqICRzdGF0ZS5pbmNsdWRlcyhcIiouZGV0YWlscy4qLipcIik7IC8vIHJldHVybnMgdHJ1ZVxuICAgICAqICRzdGF0ZS5pbmNsdWRlcyhcIiouZGV0YWlscy4qKlwiKTsgLy8gcmV0dXJucyB0cnVlXG4gICAgICogJHN0YXRlLmluY2x1ZGVzKFwiKiouaXRlbS4qKlwiKTsgLy8gcmV0dXJucyB0cnVlXG4gICAgICogJHN0YXRlLmluY2x1ZGVzKFwiKi5kZXRhaWxzLml0ZW0udXJsXCIpOyAvLyByZXR1cm5zIHRydWVcbiAgICAgKiAkc3RhdGUuaW5jbHVkZXMoXCIqLmRldGFpbHMuKi51cmxcIik7IC8vIHJldHVybnMgdHJ1ZVxuICAgICAqICRzdGF0ZS5pbmNsdWRlcyhcIiouZGV0YWlscy4qXCIpOyAvLyByZXR1cm5zIGZhbHNlXG4gICAgICogJHN0YXRlLmluY2x1ZGVzKFwiaXRlbS4qKlwiKTsgLy8gcmV0dXJucyBmYWxzZVxuICAgICAqIDwvcHJlPlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHN0YXRlT3JOYW1lIEEgcGFydGlhbCBuYW1lIHRvIGJlIHNlYXJjaGVkIGZvciB3aXRoaW4gdGhlIGN1cnJlbnQgc3RhdGUgbmFtZS5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIEEgcGFyYW0gb2JqZWN0LCBlLmcuIGB7c2VjdGlvbklkOiBzZWN0aW9uLmlkfWAsIFxuICAgICAqIHRoYXQgeW91J2QgbGlrZSB0byB0ZXN0IGFnYWluc3QgdGhlIGN1cnJlbnQgYWN0aXZlIHN0YXRlLlxuICAgICAqIEByZXR1cm5zIHtib29sZWFufSBSZXR1cm5zIHRydWUgaWYgaXQgZG9lcyBpbmNsdWRlIHRoZSBzdGF0ZVxuICAgICAqL1xuXG4gICAgJHN0YXRlLmluY2x1ZGVzID0gZnVuY3Rpb24gaW5jbHVkZXMoc3RhdGVPck5hbWUsIHBhcmFtcykge1xuICAgICAgaWYgKGlzU3RyaW5nKHN0YXRlT3JOYW1lKSAmJiBpc0dsb2Ioc3RhdGVPck5hbWUpKSB7XG4gICAgICAgIGlmIChkb2VzU3RhdGVNYXRjaEdsb2Ioc3RhdGVPck5hbWUpKSB7XG4gICAgICAgICAgc3RhdGVPck5hbWUgPSAkc3RhdGUuJGN1cnJlbnQubmFtZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdmFyIHN0YXRlID0gZmluZFN0YXRlKHN0YXRlT3JOYW1lKTtcbiAgICAgIGlmICghaXNEZWZpbmVkKHN0YXRlKSkge1xuICAgICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgICAgfVxuXG4gICAgICBpZiAoIWlzRGVmaW5lZCgkc3RhdGUuJGN1cnJlbnQuaW5jbHVkZXNbc3RhdGUubmFtZV0pKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgdmFyIHZhbGlkUGFyYW1zID0gdHJ1ZTtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChwYXJhbXMsIGZ1bmN0aW9uKHZhbHVlLCBrZXkpIHtcbiAgICAgICAgaWYgKCFpc0RlZmluZWQoJHN0YXRlUGFyYW1zW2tleV0pIHx8ICRzdGF0ZVBhcmFtc1trZXldICE9PSB2YWx1ZSkge1xuICAgICAgICAgIHZhbGlkUGFyYW1zID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHZhbGlkUGFyYW1zO1xuICAgIH07XG5cblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgICAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGUjaHJlZlxuICAgICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlXG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBBIHVybCBnZW5lcmF0aW9uIG1ldGhvZCB0aGF0IHJldHVybnMgdGhlIGNvbXBpbGVkIHVybCBmb3IgdGhlIGdpdmVuIHN0YXRlIHBvcHVsYXRlZCB3aXRoIHRoZSBnaXZlbiBwYXJhbXMuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIDxwcmU+XG4gICAgICogZXhwZWN0KCRzdGF0ZS5ocmVmKFwiYWJvdXQucGVyc29uXCIsIHsgcGVyc29uOiBcImJvYlwiIH0pKS50b0VxdWFsKFwiL2Fib3V0L2JvYlwiKTtcbiAgICAgKiA8L3ByZT5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gc3RhdGVPck5hbWUgVGhlIHN0YXRlIG5hbWUgb3Igc3RhdGUgb2JqZWN0IHlvdSdkIGxpa2UgdG8gZ2VuZXJhdGUgYSB1cmwgZnJvbS5cbiAgICAgKiBAcGFyYW0ge29iamVjdD19IHBhcmFtcyBBbiBvYmplY3Qgb2YgcGFyYW1ldGVyIHZhbHVlcyB0byBmaWxsIHRoZSBzdGF0ZSdzIHJlcXVpcmVkIHBhcmFtZXRlcnMuXG4gICAgICogQHBhcmFtIHtvYmplY3Q9fSBvcHRpb25zIE9wdGlvbnMgb2JqZWN0LiBUaGUgb3B0aW9ucyBhcmU6XG4gICAgICpcbiAgICAgKiAtICoqYGxvc3N5YCoqIC0ge2Jvb2xlYW49dHJ1ZX0gLSAgSWYgdHJ1ZSwgYW5kIGlmIHRoZXJlIGlzIG5vIHVybCBhc3NvY2lhdGVkIHdpdGggdGhlIHN0YXRlIHByb3ZpZGVkIGluIHRoZVxuICAgICAqICAgIGZpcnN0IHBhcmFtZXRlciwgdGhlbiB0aGUgY29uc3RydWN0ZWQgaHJlZiB1cmwgd2lsbCBiZSBidWlsdCBmcm9tIHRoZSBmaXJzdCBuYXZpZ2FibGUgYW5jZXN0b3IgKGFrYVxuICAgICAqICAgIGFuY2VzdG9yIHdpdGggYSB2YWxpZCB1cmwpLlxuICAgICAqIC0gKipgaW5oZXJpdGAqKiAtIHtib29sZWFuPWZhbHNlfSwgSWYgYHRydWVgIHdpbGwgaW5oZXJpdCB1cmwgcGFyYW1ldGVycyBmcm9tIGN1cnJlbnQgdXJsLlxuICAgICAqIC0gKipgcmVsYXRpdmVgKiogLSB7b2JqZWN0PSRzdGF0ZS4kY3VycmVudH0sIFdoZW4gdHJhbnNpdGlvbmluZyB3aXRoIHJlbGF0aXZlIHBhdGggKGUuZyAnXicpLCBcbiAgICAgKiAgICBkZWZpbmVzIHdoaWNoIHN0YXRlIHRvIGJlIHJlbGF0aXZlIGZyb20uXG4gICAgICogLSAqKmBhYnNvbHV0ZWAqKiAtIHtib29sZWFuPWZhbHNlfSwgIElmIHRydWUgd2lsbCBnZW5lcmF0ZSBhbiBhYnNvbHV0ZSB1cmwsIGUuZy4gXCJodHRwOi8vd3d3LmV4YW1wbGUuY29tL2Z1bGx1cmxcIi5cbiAgICAgKiBcbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfSBjb21waWxlZCBzdGF0ZSB1cmxcbiAgICAgKi9cbiAgICAkc3RhdGUuaHJlZiA9IGZ1bmN0aW9uIGhyZWYoc3RhdGVPck5hbWUsIHBhcmFtcywgb3B0aW9ucykge1xuICAgICAgb3B0aW9ucyA9IGV4dGVuZCh7IGxvc3N5OiB0cnVlLCBpbmhlcml0OiBmYWxzZSwgYWJzb2x1dGU6IGZhbHNlLCByZWxhdGl2ZTogJHN0YXRlLiRjdXJyZW50IH0sIG9wdGlvbnMgfHwge30pO1xuICAgICAgdmFyIHN0YXRlID0gZmluZFN0YXRlKHN0YXRlT3JOYW1lLCBvcHRpb25zLnJlbGF0aXZlKTtcbiAgICAgIGlmICghaXNEZWZpbmVkKHN0YXRlKSkgcmV0dXJuIG51bGw7XG5cbiAgICAgIHBhcmFtcyA9IGluaGVyaXRQYXJhbXMoJHN0YXRlUGFyYW1zLCBwYXJhbXMgfHwge30sICRzdGF0ZS4kY3VycmVudCwgc3RhdGUpO1xuICAgICAgdmFyIG5hdiA9IChzdGF0ZSAmJiBvcHRpb25zLmxvc3N5KSA/IHN0YXRlLm5hdmlnYWJsZSA6IHN0YXRlO1xuICAgICAgdmFyIHVybCA9IChuYXYgJiYgbmF2LnVybCkgPyBuYXYudXJsLmZvcm1hdChub3JtYWxpemUoc3RhdGUucGFyYW1zLCBwYXJhbXMgfHwge30pKSA6IG51bGw7XG4gICAgICBpZiAoISRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSgpICYmIHVybCkge1xuICAgICAgICB1cmwgPSBcIiNcIiArICRsb2NhdGlvblByb3ZpZGVyLmhhc2hQcmVmaXgoKSArIHVybDtcbiAgICAgIH1cblxuICAgICAgaWYgKGJhc2VIcmVmICE9PSAnLycpIHtcbiAgICAgICAgaWYgKCRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSgpKSB7XG4gICAgICAgICAgdXJsID0gYmFzZUhyZWYuc2xpY2UoMCwgLTEpICsgdXJsO1xuICAgICAgICB9IGVsc2UgaWYgKG9wdGlvbnMuYWJzb2x1dGUpe1xuICAgICAgICAgIHVybCA9IGJhc2VIcmVmLnNsaWNlKDEpICsgdXJsO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChvcHRpb25zLmFic29sdXRlICYmIHVybCkge1xuICAgICAgICB1cmwgPSAkbG9jYXRpb24ucHJvdG9jb2woKSArICc6Ly8nICsgXG4gICAgICAgICAgICAgICRsb2NhdGlvbi5ob3N0KCkgKyBcbiAgICAgICAgICAgICAgKCRsb2NhdGlvbi5wb3J0KCkgPT0gODAgfHwgJGxvY2F0aW9uLnBvcnQoKSA9PSA0NDMgPyAnJyA6ICc6JyArICRsb2NhdGlvbi5wb3J0KCkpICsgXG4gICAgICAgICAgICAgICghJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKCkgJiYgdXJsID8gJy8nIDogJycpICsgXG4gICAgICAgICAgICAgIHVybDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB1cmw7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgICAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGUjZ2V0XG4gICAgICogQG1ldGhvZE9mIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFJldHVybnMgdGhlIHN0YXRlIGNvbmZpZ3VyYXRpb24gb2JqZWN0IGZvciBhbnkgc3BlY2lmaWMgc3RhdGUgb3IgYWxsIHN0YXRlcy5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdD19IHN0YXRlT3JOYW1lIElmIHByb3ZpZGVkLCB3aWxsIG9ubHkgZ2V0IHRoZSBjb25maWcgZm9yXG4gICAgICogdGhlIHJlcXVlc3RlZCBzdGF0ZS4gSWYgbm90IHByb3ZpZGVkLCByZXR1cm5zIGFuIGFycmF5IG9mIEFMTCBzdGF0ZSBjb25maWdzLlxuICAgICAqIEByZXR1cm5zIHtvYmplY3R8YXJyYXl9IFN0YXRlIGNvbmZpZ3VyYXRpb24gb2JqZWN0IG9yIGFycmF5IG9mIGFsbCBvYmplY3RzLlxuICAgICAqL1xuICAgICRzdGF0ZS5nZXQgPSBmdW5jdGlvbiAoc3RhdGVPck5hbWUsIGNvbnRleHQpIHtcbiAgICAgIGlmICghaXNEZWZpbmVkKHN0YXRlT3JOYW1lKSkge1xuICAgICAgICB2YXIgbGlzdCA9IFtdO1xuICAgICAgICBmb3JFYWNoKHN0YXRlcywgZnVuY3Rpb24oc3RhdGUpIHsgbGlzdC5wdXNoKHN0YXRlLnNlbGYpOyB9KTtcbiAgICAgICAgcmV0dXJuIGxpc3Q7XG4gICAgICB9XG4gICAgICB2YXIgc3RhdGUgPSBmaW5kU3RhdGUoc3RhdGVPck5hbWUsIGNvbnRleHQpO1xuICAgICAgcmV0dXJuIChzdGF0ZSAmJiBzdGF0ZS5zZWxmKSA/IHN0YXRlLnNlbGYgOiBudWxsO1xuICAgIH07XG5cbiAgICBmdW5jdGlvbiByZXNvbHZlU3RhdGUoc3RhdGUsIHBhcmFtcywgcGFyYW1zQXJlRmlsdGVyZWQsIGluaGVyaXRlZCwgZHN0KSB7XG4gICAgICAvLyBNYWtlIGEgcmVzdHJpY3RlZCAkc3RhdGVQYXJhbXMgd2l0aCBvbmx5IHRoZSBwYXJhbWV0ZXJzIHRoYXQgYXBwbHkgdG8gdGhpcyBzdGF0ZSBpZlxuICAgICAgLy8gbmVjZXNzYXJ5LiBJbiBhZGRpdGlvbiB0byBiZWluZyBhdmFpbGFibGUgdG8gdGhlIGNvbnRyb2xsZXIgYW5kIG9uRW50ZXIvb25FeGl0IGNhbGxiYWNrcyxcbiAgICAgIC8vIHdlIGFsc28gbmVlZCAkc3RhdGVQYXJhbXMgdG8gYmUgYXZhaWxhYmxlIGZvciBhbnkgJGluamVjdG9yIGNhbGxzIHdlIG1ha2UgZHVyaW5nIHRoZVxuICAgICAgLy8gZGVwZW5kZW5jeSByZXNvbHV0aW9uIHByb2Nlc3MuXG4gICAgICB2YXIgJHN0YXRlUGFyYW1zID0gKHBhcmFtc0FyZUZpbHRlcmVkKSA/IHBhcmFtcyA6IGZpbHRlckJ5S2V5cyhzdGF0ZS5wYXJhbXMsIHBhcmFtcyk7XG4gICAgICB2YXIgbG9jYWxzID0geyAkc3RhdGVQYXJhbXM6ICRzdGF0ZVBhcmFtcyB9O1xuXG4gICAgICAvLyBSZXNvbHZlICdnbG9iYWwnIGRlcGVuZGVuY2llcyBmb3IgdGhlIHN0YXRlLCBpLmUuIHRob3NlIG5vdCBzcGVjaWZpYyB0byBhIHZpZXcuXG4gICAgICAvLyBXZSdyZSBhbHNvIGluY2x1ZGluZyAkc3RhdGVQYXJhbXMgaW4gdGhpczsgdGhhdCB3YXkgdGhlIHBhcmFtZXRlcnMgYXJlIHJlc3RyaWN0ZWRcbiAgICAgIC8vIHRvIHRoZSBzZXQgdGhhdCBzaG91bGQgYmUgdmlzaWJsZSB0byB0aGUgc3RhdGUsIGFuZCBhcmUgaW5kZXBlbmRlbnQgb2Ygd2hlbiB3ZSB1cGRhdGVcbiAgICAgIC8vIHRoZSBnbG9iYWwgJHN0YXRlIGFuZCAkc3RhdGVQYXJhbXMgdmFsdWVzLlxuICAgICAgZHN0LnJlc29sdmUgPSAkcmVzb2x2ZS5yZXNvbHZlKHN0YXRlLnJlc29sdmUsIGxvY2FscywgZHN0LnJlc29sdmUsIHN0YXRlKTtcbiAgICAgIHZhciBwcm9taXNlcyA9IFsgZHN0LnJlc29sdmUudGhlbihmdW5jdGlvbiAoZ2xvYmFscykge1xuICAgICAgICBkc3QuZ2xvYmFscyA9IGdsb2JhbHM7XG4gICAgICB9KSBdO1xuICAgICAgaWYgKGluaGVyaXRlZCkgcHJvbWlzZXMucHVzaChpbmhlcml0ZWQpO1xuXG4gICAgICAvLyBSZXNvbHZlIHRlbXBsYXRlIGFuZCBkZXBlbmRlbmNpZXMgZm9yIGFsbCB2aWV3cy5cbiAgICAgIGZvckVhY2goc3RhdGUudmlld3MsIGZ1bmN0aW9uICh2aWV3LCBuYW1lKSB7XG4gICAgICAgIHZhciBpbmplY3RhYmxlcyA9ICh2aWV3LnJlc29sdmUgJiYgdmlldy5yZXNvbHZlICE9PSBzdGF0ZS5yZXNvbHZlID8gdmlldy5yZXNvbHZlIDoge30pO1xuICAgICAgICBpbmplY3RhYmxlcy4kdGVtcGxhdGUgPSBbIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gJHZpZXcubG9hZChuYW1lLCB7IHZpZXc6IHZpZXcsIGxvY2FsczogbG9jYWxzLCBwYXJhbXM6ICRzdGF0ZVBhcmFtcywgbm90aWZ5OiBmYWxzZSB9KSB8fCAnJztcbiAgICAgICAgfV07XG5cbiAgICAgICAgcHJvbWlzZXMucHVzaCgkcmVzb2x2ZS5yZXNvbHZlKGluamVjdGFibGVzLCBsb2NhbHMsIGRzdC5yZXNvbHZlLCBzdGF0ZSkudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgLy8gUmVmZXJlbmNlcyB0byB0aGUgY29udHJvbGxlciAob25seSBpbnN0YW50aWF0ZWQgYXQgbGluayB0aW1lKVxuICAgICAgICAgIGlmIChpc0Z1bmN0aW9uKHZpZXcuY29udHJvbGxlclByb3ZpZGVyKSB8fCBpc0FycmF5KHZpZXcuY29udHJvbGxlclByb3ZpZGVyKSkge1xuICAgICAgICAgICAgdmFyIGluamVjdExvY2FscyA9IGFuZ3VsYXIuZXh0ZW5kKHt9LCBpbmplY3RhYmxlcywgbG9jYWxzKTtcbiAgICAgICAgICAgIHJlc3VsdC4kJGNvbnRyb2xsZXIgPSAkaW5qZWN0b3IuaW52b2tlKHZpZXcuY29udHJvbGxlclByb3ZpZGVyLCBudWxsLCBpbmplY3RMb2NhbHMpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXN1bHQuJCRjb250cm9sbGVyID0gdmlldy5jb250cm9sbGVyO1xuICAgICAgICAgIH1cbiAgICAgICAgICAvLyBQcm92aWRlIGFjY2VzcyB0byB0aGUgc3RhdGUgaXRzZWxmIGZvciBpbnRlcm5hbCB1c2VcbiAgICAgICAgICByZXN1bHQuJCRzdGF0ZSA9IHN0YXRlO1xuICAgICAgICAgIHJlc3VsdC4kJGNvbnRyb2xsZXJBcyA9IHZpZXcuY29udHJvbGxlckFzO1xuICAgICAgICAgIGRzdFtuYW1lXSA9IHJlc3VsdDtcbiAgICAgICAgfSkpO1xuICAgICAgfSk7XG5cbiAgICAgIC8vIFdhaXQgZm9yIGFsbCB0aGUgcHJvbWlzZXMgYW5kIHRoZW4gcmV0dXJuIHRoZSBhY3RpdmF0aW9uIG9iamVjdFxuICAgICAgcmV0dXJuICRxLmFsbChwcm9taXNlcykudGhlbihmdW5jdGlvbiAodmFsdWVzKSB7XG4gICAgICAgIHJldHVybiBkc3Q7XG4gICAgICB9KTtcbiAgICB9XG5cbiAgICByZXR1cm4gJHN0YXRlO1xuICB9XG5cbiAgZnVuY3Rpb24gc2hvdWxkVHJpZ2dlclJlbG9hZCh0bywgZnJvbSwgbG9jYWxzLCBvcHRpb25zKSB7XG4gICAgaWYgKCB0byA9PT0gZnJvbSAmJiAoKGxvY2FscyA9PT0gZnJvbS5sb2NhbHMgJiYgIW9wdGlvbnMucmVsb2FkKSB8fCAodG8uc2VsZi5yZWxvYWRPblNlYXJjaCA9PT0gZmFsc2UpKSApIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgndWkucm91dGVyLnN0YXRlJylcbiAgLnZhbHVlKCckc3RhdGVQYXJhbXMnLCB7fSlcbiAgLnByb3ZpZGVyKCckc3RhdGUnLCAkU3RhdGVQcm92aWRlcik7XG5cblxuJFZpZXdQcm92aWRlci4kaW5qZWN0ID0gW107XG5mdW5jdGlvbiAkVmlld1Byb3ZpZGVyKCkge1xuXG4gIHRoaXMuJGdldCA9ICRnZXQ7XG4gIC8qKlxuICAgKiBAbmdkb2Mgb2JqZWN0XG4gICAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS4kdmlld1xuICAgKlxuICAgKiBAcmVxdWlyZXMgdWkucm91dGVyLnV0aWwuJHRlbXBsYXRlRmFjdG9yeVxuICAgKiBAcmVxdWlyZXMgJHJvb3RTY29wZVxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICpcbiAgICovXG4gICRnZXQuJGluamVjdCA9IFsnJHJvb3RTY29wZScsICckdGVtcGxhdGVGYWN0b3J5J107XG4gIGZ1bmN0aW9uICRnZXQoICAgJHJvb3RTY29wZSwgICAkdGVtcGxhdGVGYWN0b3J5KSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIC8vICR2aWV3LmxvYWQoJ2Z1bGwudmlld05hbWUnLCB7IHRlbXBsYXRlOiAuLi4sIGNvbnRyb2xsZXI6IC4uLiwgcmVzb2x2ZTogLi4uLCBhc3luYzogZmFsc2UsIHBhcmFtczogLi4uIH0pXG4gICAgICAvKipcbiAgICAgICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgICAgICogQG5hbWUgdWkucm91dGVyLnN0YXRlLiR2aWV3I2xvYWRcbiAgICAgICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIuc3RhdGUuJHZpZXdcbiAgICAgICAqXG4gICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAqXG4gICAgICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBuYW1lXG4gICAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBvcHRpb24gb2JqZWN0LlxuICAgICAgICovXG4gICAgICBsb2FkOiBmdW5jdGlvbiBsb2FkKG5hbWUsIG9wdGlvbnMpIHtcbiAgICAgICAgdmFyIHJlc3VsdCwgZGVmYXVsdHMgPSB7XG4gICAgICAgICAgdGVtcGxhdGU6IG51bGwsIGNvbnRyb2xsZXI6IG51bGwsIHZpZXc6IG51bGwsIGxvY2FsczogbnVsbCwgbm90aWZ5OiB0cnVlLCBhc3luYzogdHJ1ZSwgcGFyYW1zOiB7fVxuICAgICAgICB9O1xuICAgICAgICBvcHRpb25zID0gZXh0ZW5kKGRlZmF1bHRzLCBvcHRpb25zKTtcblxuICAgICAgICBpZiAob3B0aW9ucy52aWV3KSB7XG4gICAgICAgICAgcmVzdWx0ID0gJHRlbXBsYXRlRmFjdG9yeS5mcm9tQ29uZmlnKG9wdGlvbnMudmlldywgb3B0aW9ucy5wYXJhbXMsIG9wdGlvbnMubG9jYWxzKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAocmVzdWx0ICYmIG9wdGlvbnMubm90aWZ5KSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmdkb2MgZXZlbnRcbiAgICAgICAgICogQG5hbWUgdWkucm91dGVyLnN0YXRlLiRzdGF0ZSMkdmlld0NvbnRlbnRMb2FkaW5nXG4gICAgICAgICAqIEBldmVudE9mIHVpLnJvdXRlci5zdGF0ZS4kdmlld1xuICAgICAgICAgKiBAZXZlbnRUeXBlIGJyb2FkY2FzdCBvbiByb290IHNjb3BlXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKlxuICAgICAgICAgKiBGaXJlZCBvbmNlIHRoZSB2aWV3ICoqYmVnaW5zIGxvYWRpbmcqKiwgKmJlZm9yZSogdGhlIERPTSBpcyByZW5kZXJlZC5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGV2ZW50IEV2ZW50IG9iamVjdC5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHZpZXdDb25maWcgVGhlIHZpZXcgY29uZmlnIHByb3BlcnRpZXMgKHRlbXBsYXRlLCBjb250cm9sbGVyLCBldGMpLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKlxuICAgICAgICAgKiA8cHJlPlxuICAgICAgICAgKiAkc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkaW5nJyxcbiAgICAgICAgICogZnVuY3Rpb24oZXZlbnQsIHZpZXdDb25maWcpe1xuICAgICAgICAgKiAgICAgLy8gQWNjZXNzIHRvIGFsbCB0aGUgdmlldyBjb25maWcgcHJvcGVydGllcy5cbiAgICAgICAgICogICAgIC8vIGFuZCBvbmUgc3BlY2lhbCBwcm9wZXJ0eSAndGFyZ2V0VmlldydcbiAgICAgICAgICogICAgIC8vIHZpZXdDb25maWcudGFyZ2V0Vmlld1xuICAgICAgICAgKiB9KTtcbiAgICAgICAgICogPC9wcmU+XG4gICAgICAgICAqL1xuICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnJHZpZXdDb250ZW50TG9hZGluZycsIG9wdGlvbnMpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgfTtcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgndWkucm91dGVyLnN0YXRlJykucHJvdmlkZXIoJyR2aWV3JywgJFZpZXdQcm92aWRlcik7XG5cbi8qKlxuICogQG5nZG9jIG9iamVjdFxuICogQG5hbWUgdWkucm91dGVyLnN0YXRlLiR1aVZpZXdTY3JvbGxQcm92aWRlclxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogUHJvdmlkZXIgdGhhdCByZXR1cm5zIHRoZSB7QGxpbmsgdWkucm91dGVyLnN0YXRlLiR1aVZpZXdTY3JvbGx9IHNlcnZpY2UgZnVuY3Rpb24uXG4gKi9cbmZ1bmN0aW9uICRWaWV3U2Nyb2xsUHJvdmlkZXIoKSB7XG5cbiAgdmFyIHVzZUFuY2hvclNjcm9sbCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICogQG5hbWUgdWkucm91dGVyLnN0YXRlLiR1aVZpZXdTY3JvbGxQcm92aWRlciN1c2VBbmNob3JTY3JvbGxcbiAgICogQG1ldGhvZE9mIHVpLnJvdXRlci5zdGF0ZS4kdWlWaWV3U2Nyb2xsUHJvdmlkZXJcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJldmVydHMgYmFjayB0byB1c2luZyB0aGUgY29yZSBbYCRhbmNob3JTY3JvbGxgXShodHRwOi8vZG9jcy5hbmd1bGFyanMub3JnL2FwaS9uZy4kYW5jaG9yU2Nyb2xsKSBzZXJ2aWNlIGZvclxuICAgKiBzY3JvbGxpbmcgYmFzZWQgb24gdGhlIHVybCBhbmNob3IuXG4gICAqL1xuICB0aGlzLnVzZUFuY2hvclNjcm9sbCA9IGZ1bmN0aW9uICgpIHtcbiAgICB1c2VBbmNob3JTY3JvbGwgPSB0cnVlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAbmdkb2Mgb2JqZWN0XG4gICAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS4kdWlWaWV3U2Nyb2xsXG4gICAqXG4gICAqIEByZXF1aXJlcyAkYW5jaG9yU2Nyb2xsXG4gICAqIEByZXF1aXJlcyAkdGltZW91dFxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogV2hlbiBjYWxsZWQgd2l0aCBhIGpxTGl0ZSBlbGVtZW50LCBpdCBzY3JvbGxzIHRoZSBlbGVtZW50IGludG8gdmlldyAoYWZ0ZXIgYVxuICAgKiBgJHRpbWVvdXRgIHNvIHRoZSBET00gaGFzIHRpbWUgdG8gcmVmcmVzaCkuXG4gICAqXG4gICAqIElmIHlvdSBwcmVmZXIgdG8gcmVseSBvbiBgJGFuY2hvclNjcm9sbGAgdG8gc2Nyb2xsIHRoZSB2aWV3IHRvIHRoZSBhbmNob3IsXG4gICAqIHRoaXMgY2FuIGJlIGVuYWJsZWQgYnkgY2FsbGluZyB7QGxpbmsgdWkucm91dGVyLnN0YXRlLiR1aVZpZXdTY3JvbGxQcm92aWRlciNtZXRob2RzX3VzZUFuY2hvclNjcm9sbCBgJHVpVmlld1Njcm9sbFByb3ZpZGVyLnVzZUFuY2hvclNjcm9sbCgpYH0uXG4gICAqL1xuICB0aGlzLiRnZXQgPSBbJyRhbmNob3JTY3JvbGwnLCAnJHRpbWVvdXQnLCBmdW5jdGlvbiAoJGFuY2hvclNjcm9sbCwgJHRpbWVvdXQpIHtcbiAgICBpZiAodXNlQW5jaG9yU2Nyb2xsKSB7XG4gICAgICByZXR1cm4gJGFuY2hvclNjcm9sbDtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gKCRlbGVtZW50KSB7XG4gICAgICAkdGltZW91dChmdW5jdGlvbiAoKSB7XG4gICAgICAgICRlbGVtZW50WzBdLnNjcm9sbEludG9WaWV3KCk7XG4gICAgICB9LCAwLCBmYWxzZSk7XG4gICAgfTtcbiAgfV07XG59XG5cbmFuZ3VsYXIubW9kdWxlKCd1aS5yb3V0ZXIuc3RhdGUnKS5wcm92aWRlcignJHVpVmlld1Njcm9sbCcsICRWaWV3U2Nyb2xsUHJvdmlkZXIpO1xuXG4vKipcbiAqIEBuZ2RvYyBkaXJlY3RpdmVcbiAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS5kaXJlY3RpdmU6dWktdmlld1xuICpcbiAqIEByZXF1aXJlcyB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlXG4gKiBAcmVxdWlyZXMgJGNvbXBpbGVcbiAqIEByZXF1aXJlcyAkY29udHJvbGxlclxuICogQHJlcXVpcmVzICRpbmplY3RvclxuICogQHJlcXVpcmVzIHVpLnJvdXRlci5zdGF0ZS4kdWlWaWV3U2Nyb2xsXG4gKiBAcmVxdWlyZXMgJGRvY3VtZW50XG4gKlxuICogQHJlc3RyaWN0IEVDQVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogVGhlIHVpLXZpZXcgZGlyZWN0aXZlIHRlbGxzICRzdGF0ZSB3aGVyZSB0byBwbGFjZSB5b3VyIHRlbXBsYXRlcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZz19IHVpLXZpZXcgQSB2aWV3IG5hbWUuIFRoZSBuYW1lIHNob3VsZCBiZSB1bmlxdWUgYW1vbmdzdCB0aGUgb3RoZXIgdmlld3MgaW4gdGhlXG4gKiBzYW1lIHN0YXRlLiBZb3UgY2FuIGhhdmUgdmlld3Mgb2YgdGhlIHNhbWUgbmFtZSB0aGF0IGxpdmUgaW4gZGlmZmVyZW50IHN0YXRlcy5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZz19IGF1dG9zY3JvbGwgSXQgYWxsb3dzIHlvdSB0byBzZXQgdGhlIHNjcm9sbCBiZWhhdmlvciBvZiB0aGUgYnJvd3NlciB3aW5kb3dcbiAqIHdoZW4gYSB2aWV3IGlzIHBvcHVsYXRlZC4gQnkgZGVmYXVsdCwgJGFuY2hvclNjcm9sbCBpcyBvdmVycmlkZGVuIGJ5IHVpLXJvdXRlcidzIGN1c3RvbSBzY3JvbGxcbiAqIHNlcnZpY2UsIHtAbGluayB1aS5yb3V0ZXIuc3RhdGUuJHVpVmlld1Njcm9sbH0uIFRoaXMgY3VzdG9tIHNlcnZpY2UgbGV0J3MgeW91XG4gKiBzY3JvbGwgdWktdmlldyBlbGVtZW50cyBpbnRvIHZpZXcgd2hlbiB0aGV5IGFyZSBwb3B1bGF0ZWQgZHVyaW5nIGEgc3RhdGUgYWN0aXZhdGlvbi5cbiAqXG4gKiAqTm90ZTogVG8gcmV2ZXJ0IGJhY2sgdG8gb2xkIFtgJGFuY2hvclNjcm9sbGBdKGh0dHA6Ly9kb2NzLmFuZ3VsYXJqcy5vcmcvYXBpL25nLiRhbmNob3JTY3JvbGwpXG4gKiBmdW5jdGlvbmFsaXR5LCBjYWxsIGAkdWlWaWV3U2Nyb2xsUHJvdmlkZXIudXNlQW5jaG9yU2Nyb2xsKClgLipcbiAqXG4gKiBAcGFyYW0ge3N0cmluZz19IG9ubG9hZCBFeHByZXNzaW9uIHRvIGV2YWx1YXRlIHdoZW5ldmVyIHRoZSB2aWV3IHVwZGF0ZXMuXG4gKiBcbiAqIEBleGFtcGxlXG4gKiBBIHZpZXcgY2FuIGJlIHVubmFtZWQgb3IgbmFtZWQuIFxuICogPHByZT5cbiAqIDwhLS0gVW5uYW1lZCAtLT5cbiAqIDxkaXYgdWktdmlldz48L2Rpdj4gXG4gKiBcbiAqIDwhLS0gTmFtZWQgLS0+XG4gKiA8ZGl2IHVpLXZpZXc9XCJ2aWV3TmFtZVwiPjwvZGl2PlxuICogPC9wcmU+XG4gKlxuICogWW91IGNhbiBvbmx5IGhhdmUgb25lIHVubmFtZWQgdmlldyB3aXRoaW4gYW55IHRlbXBsYXRlIChvciByb290IGh0bWwpLiBJZiB5b3UgYXJlIG9ubHkgdXNpbmcgYSBcbiAqIHNpbmdsZSB2aWV3IGFuZCBpdCBpcyB1bm5hbWVkIHRoZW4geW91IGNhbiBwb3B1bGF0ZSBpdCBsaWtlIHNvOlxuICogPHByZT5cbiAqIDxkaXYgdWktdmlldz48L2Rpdj4gXG4gKiAkc3RhdGVQcm92aWRlci5zdGF0ZShcImhvbWVcIiwge1xuICogICB0ZW1wbGF0ZTogXCI8aDE+SEVMTE8hPC9oMT5cIlxuICogfSlcbiAqIDwvcHJlPlxuICogXG4gKiBUaGUgYWJvdmUgaXMgYSBjb252ZW5pZW50IHNob3J0Y3V0IGVxdWl2YWxlbnQgdG8gc3BlY2lmeWluZyB5b3VyIHZpZXcgZXhwbGljaXRseSB3aXRoIHRoZSB7QGxpbmsgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVByb3ZpZGVyI3ZpZXdzIGB2aWV3c2B9XG4gKiBjb25maWcgcHJvcGVydHksIGJ5IG5hbWUsIGluIHRoaXMgY2FzZSBhbiBlbXB0eSBuYW1lOlxuICogPHByZT5cbiAqICRzdGF0ZVByb3ZpZGVyLnN0YXRlKFwiaG9tZVwiLCB7XG4gKiAgIHZpZXdzOiB7XG4gKiAgICAgXCJcIjoge1xuICogICAgICAgdGVtcGxhdGU6IFwiPGgxPkhFTExPITwvaDE+XCJcbiAqICAgICB9XG4gKiAgIH0gICAgXG4gKiB9KVxuICogPC9wcmU+XG4gKiBcbiAqIEJ1dCB0eXBpY2FsbHkgeW91J2xsIG9ubHkgdXNlIHRoZSB2aWV3cyBwcm9wZXJ0eSBpZiB5b3UgbmFtZSB5b3VyIHZpZXcgb3IgaGF2ZSBtb3JlIHRoYW4gb25lIHZpZXcgXG4gKiBpbiB0aGUgc2FtZSB0ZW1wbGF0ZS4gVGhlcmUncyBub3QgcmVhbGx5IGEgY29tcGVsbGluZyByZWFzb24gdG8gbmFtZSBhIHZpZXcgaWYgaXRzIHRoZSBvbmx5IG9uZSwgXG4gKiBidXQgeW91IGNvdWxkIGlmIHlvdSB3YW50ZWQsIGxpa2Ugc286XG4gKiA8cHJlPlxuICogPGRpdiB1aS12aWV3PVwibWFpblwiPjwvZGl2PlxuICogPC9wcmU+IFxuICogPHByZT5cbiAqICRzdGF0ZVByb3ZpZGVyLnN0YXRlKFwiaG9tZVwiLCB7XG4gKiAgIHZpZXdzOiB7XG4gKiAgICAgXCJtYWluXCI6IHtcbiAqICAgICAgIHRlbXBsYXRlOiBcIjxoMT5IRUxMTyE8L2gxPlwiXG4gKiAgICAgfVxuICogICB9ICAgIFxuICogfSlcbiAqIDwvcHJlPlxuICogXG4gKiBSZWFsbHkgdGhvdWdoLCB5b3UnbGwgdXNlIHZpZXdzIHRvIHNldCB1cCBtdWx0aXBsZSB2aWV3czpcbiAqIDxwcmU+XG4gKiA8ZGl2IHVpLXZpZXc+PC9kaXY+XG4gKiA8ZGl2IHVpLXZpZXc9XCJjaGFydFwiPjwvZGl2PiBcbiAqIDxkaXYgdWktdmlldz1cImRhdGFcIj48L2Rpdj4gXG4gKiA8L3ByZT5cbiAqIFxuICogPHByZT5cbiAqICRzdGF0ZVByb3ZpZGVyLnN0YXRlKFwiaG9tZVwiLCB7XG4gKiAgIHZpZXdzOiB7XG4gKiAgICAgXCJcIjoge1xuICogICAgICAgdGVtcGxhdGU6IFwiPGgxPkhFTExPITwvaDE+XCJcbiAqICAgICB9LFxuICogICAgIFwiY2hhcnRcIjoge1xuICogICAgICAgdGVtcGxhdGU6IFwiPGNoYXJ0X3RoaW5nLz5cIlxuICogICAgIH0sXG4gKiAgICAgXCJkYXRhXCI6IHtcbiAqICAgICAgIHRlbXBsYXRlOiBcIjxkYXRhX3RoaW5nLz5cIlxuICogICAgIH1cbiAqICAgfSAgICBcbiAqIH0pXG4gKiA8L3ByZT5cbiAqXG4gKiBFeGFtcGxlcyBmb3IgYGF1dG9zY3JvbGxgOlxuICpcbiAqIDxwcmU+XG4gKiA8IS0tIElmIGF1dG9zY3JvbGwgcHJlc2VudCB3aXRoIG5vIGV4cHJlc3Npb24sXG4gKiAgICAgIHRoZW4gc2Nyb2xsIHVpLXZpZXcgaW50byB2aWV3IC0tPlxuICogPHVpLXZpZXcgYXV0b3Njcm9sbC8+XG4gKlxuICogPCEtLSBJZiBhdXRvc2Nyb2xsIHByZXNlbnQgd2l0aCB2YWxpZCBleHByZXNzaW9uLFxuICogICAgICB0aGVuIHNjcm9sbCB1aS12aWV3IGludG8gdmlldyBpZiBleHByZXNzaW9uIGV2YWx1YXRlcyB0byB0cnVlIC0tPlxuICogPHVpLXZpZXcgYXV0b3Njcm9sbD0ndHJ1ZScvPlxuICogPHVpLXZpZXcgYXV0b3Njcm9sbD0nZmFsc2UnLz5cbiAqIDx1aS12aWV3IGF1dG9zY3JvbGw9J3Njb3BlVmFyaWFibGUnLz5cbiAqIDwvcHJlPlxuICovXG4kVmlld0RpcmVjdGl2ZS4kaW5qZWN0ID0gWyckc3RhdGUnLCAnJGluamVjdG9yJywgJyR1aVZpZXdTY3JvbGwnXTtcbmZ1bmN0aW9uICRWaWV3RGlyZWN0aXZlKCAgICRzdGF0ZSwgICAkaW5qZWN0b3IsICAgJHVpVmlld1Njcm9sbCkge1xuXG4gIGZ1bmN0aW9uIGdldFNlcnZpY2UoKSB7XG4gICAgcmV0dXJuICgkaW5qZWN0b3IuaGFzKSA/IGZ1bmN0aW9uKHNlcnZpY2UpIHtcbiAgICAgIHJldHVybiAkaW5qZWN0b3IuaGFzKHNlcnZpY2UpID8gJGluamVjdG9yLmdldChzZXJ2aWNlKSA6IG51bGw7XG4gICAgfSA6IGZ1bmN0aW9uKHNlcnZpY2UpIHtcbiAgICAgIHRyeSB7XG4gICAgICAgIHJldHVybiAkaW5qZWN0b3IuZ2V0KHNlcnZpY2UpO1xuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9O1xuICB9XG5cbiAgdmFyIHNlcnZpY2UgPSBnZXRTZXJ2aWNlKCksXG4gICAgICAkYW5pbWF0b3IgPSBzZXJ2aWNlKCckYW5pbWF0b3InKSxcbiAgICAgICRhbmltYXRlID0gc2VydmljZSgnJGFuaW1hdGUnKTtcblxuICAvLyBSZXR1cm5zIGEgc2V0IG9mIERPTSBtYW5pcHVsYXRpb24gZnVuY3Rpb25zIGJhc2VkIG9uIHdoaWNoIEFuZ3VsYXIgdmVyc2lvblxuICAvLyBpdCBzaG91bGQgdXNlXG4gIGZ1bmN0aW9uIGdldFJlbmRlcmVyKGF0dHJzLCBzY29wZSkge1xuICAgIHZhciBzdGF0aWNzID0gZnVuY3Rpb24oKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBlbnRlcjogZnVuY3Rpb24gKGVsZW1lbnQsIHRhcmdldCwgY2IpIHsgdGFyZ2V0LmFmdGVyKGVsZW1lbnQpOyBjYigpOyB9LFxuICAgICAgICBsZWF2ZTogZnVuY3Rpb24gKGVsZW1lbnQsIGNiKSB7IGVsZW1lbnQucmVtb3ZlKCk7IGNiKCk7IH1cbiAgICAgIH07XG4gICAgfTtcblxuICAgIGlmICgkYW5pbWF0ZSkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZW50ZXI6IGZ1bmN0aW9uKGVsZW1lbnQsIHRhcmdldCwgY2IpIHsgJGFuaW1hdGUuZW50ZXIoZWxlbWVudCwgbnVsbCwgdGFyZ2V0LCBjYik7IH0sXG4gICAgICAgIGxlYXZlOiBmdW5jdGlvbihlbGVtZW50LCBjYikgeyAkYW5pbWF0ZS5sZWF2ZShlbGVtZW50LCBjYik7IH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgaWYgKCRhbmltYXRvcikge1xuICAgICAgdmFyIGFuaW1hdGUgPSAkYW5pbWF0b3IgJiYgJGFuaW1hdG9yKHNjb3BlLCBhdHRycyk7XG5cbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVudGVyOiBmdW5jdGlvbihlbGVtZW50LCB0YXJnZXQsIGNiKSB7YW5pbWF0ZS5lbnRlcihlbGVtZW50LCBudWxsLCB0YXJnZXQpOyBjYigpOyB9LFxuICAgICAgICBsZWF2ZTogZnVuY3Rpb24oZWxlbWVudCwgY2IpIHsgYW5pbWF0ZS5sZWF2ZShlbGVtZW50KTsgY2IoKTsgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGljcygpO1xuICB9XG5cbiAgdmFyIGRpcmVjdGl2ZSA9IHtcbiAgICByZXN0cmljdDogJ0VDQScsXG4gICAgdGVybWluYWw6IHRydWUsXG4gICAgcHJpb3JpdHk6IDQwMCxcbiAgICB0cmFuc2NsdWRlOiAnZWxlbWVudCcsXG4gICAgY29tcGlsZTogZnVuY3Rpb24gKHRFbGVtZW50LCB0QXR0cnMsICR0cmFuc2NsdWRlKSB7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKHNjb3BlLCAkZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgdmFyIHByZXZpb3VzRWwsIGN1cnJlbnRFbCwgY3VycmVudFNjb3BlLCBsYXRlc3RMb2NhbHMsXG4gICAgICAgICAgICBvbmxvYWRFeHAgICAgID0gYXR0cnMub25sb2FkIHx8ICcnLFxuICAgICAgICAgICAgYXV0b1Njcm9sbEV4cCA9IGF0dHJzLmF1dG9zY3JvbGwsXG4gICAgICAgICAgICByZW5kZXJlciAgICAgID0gZ2V0UmVuZGVyZXIoYXR0cnMsIHNjb3BlKTtcblxuICAgICAgICBzY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB1cGRhdGVWaWV3KGZhbHNlKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGluZycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHVwZGF0ZVZpZXcoZmFsc2UpO1xuICAgICAgICB9KTtcblxuICAgICAgICB1cGRhdGVWaWV3KHRydWUpO1xuXG4gICAgICAgIGZ1bmN0aW9uIGNsZWFudXBMYXN0VmlldygpIHtcbiAgICAgICAgICBpZiAocHJldmlvdXNFbCkge1xuICAgICAgICAgICAgcHJldmlvdXNFbC5yZW1vdmUoKTtcbiAgICAgICAgICAgIHByZXZpb3VzRWwgPSBudWxsO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjdXJyZW50U2NvcGUpIHtcbiAgICAgICAgICAgIGN1cnJlbnRTY29wZS4kZGVzdHJveSgpO1xuICAgICAgICAgICAgY3VycmVudFNjb3BlID0gbnVsbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY3VycmVudEVsKSB7XG4gICAgICAgICAgICByZW5kZXJlci5sZWF2ZShjdXJyZW50RWwsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICBwcmV2aW91c0VsID0gbnVsbDtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICBwcmV2aW91c0VsID0gY3VycmVudEVsO1xuICAgICAgICAgICAgY3VycmVudEVsID0gbnVsbDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmdW5jdGlvbiB1cGRhdGVWaWV3KGZpcnN0VGltZSkge1xuICAgICAgICAgIHZhciBuZXdTY29wZSAgICAgICAgPSBzY29wZS4kbmV3KCksXG4gICAgICAgICAgICAgIG5hbWUgICAgICAgICAgICA9IGN1cnJlbnRFbCAmJiBjdXJyZW50RWwuZGF0YSgnJHVpVmlld05hbWUnKSxcbiAgICAgICAgICAgICAgcHJldmlvdXNMb2NhbHMgID0gbmFtZSAmJiAkc3RhdGUuJGN1cnJlbnQgJiYgJHN0YXRlLiRjdXJyZW50LmxvY2Fsc1tuYW1lXTtcblxuICAgICAgICAgIGlmICghZmlyc3RUaW1lICYmIHByZXZpb3VzTG9jYWxzID09PSBsYXRlc3RMb2NhbHMpIHJldHVybjsgLy8gbm90aGluZyB0byBkb1xuXG4gICAgICAgICAgdmFyIGNsb25lID0gJHRyYW5zY2x1ZGUobmV3U2NvcGUsIGZ1bmN0aW9uKGNsb25lKSB7XG4gICAgICAgICAgICByZW5kZXJlci5lbnRlcihjbG9uZSwgJGVsZW1lbnQsIGZ1bmN0aW9uIG9uVWlWaWV3RW50ZXIoKSB7XG4gICAgICAgICAgICAgIGlmIChhbmd1bGFyLmlzRGVmaW5lZChhdXRvU2Nyb2xsRXhwKSAmJiAhYXV0b1Njcm9sbEV4cCB8fCBzY29wZS4kZXZhbChhdXRvU2Nyb2xsRXhwKSkge1xuICAgICAgICAgICAgICAgICR1aVZpZXdTY3JvbGwoY2xvbmUpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGNsZWFudXBMYXN0VmlldygpO1xuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgbGF0ZXN0TG9jYWxzID0gJHN0YXRlLiRjdXJyZW50LmxvY2Fsc1tjbG9uZS5kYXRhKCckdWlWaWV3TmFtZScpXTtcblxuICAgICAgICAgIGN1cnJlbnRFbCA9IGNsb25lO1xuICAgICAgICAgIGN1cnJlbnRTY29wZSA9IG5ld1Njb3BlO1xuICAgICAgICAgIC8qKlxuICAgICAgICAgICAqIEBuZ2RvYyBldmVudFxuICAgICAgICAgICAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS5kaXJlY3RpdmU6dWktdmlldyMkdmlld0NvbnRlbnRMb2FkZWRcbiAgICAgICAgICAgKiBAZXZlbnRPZiB1aS5yb3V0ZXIuc3RhdGUuZGlyZWN0aXZlOnVpLXZpZXdcbiAgICAgICAgICAgKiBAZXZlbnRUeXBlIGVtaXRzIG9uIHVpLXZpZXcgZGlyZWN0aXZlIHNjb3BlXG4gICAgICAgICAgICogQGRlc2NyaXB0aW9uICAgICAgICAgICAqXG4gICAgICAgICAgICogRmlyZWQgb25jZSB0aGUgdmlldyBpcyAqKmxvYWRlZCoqLCAqYWZ0ZXIqIHRoZSBET00gaXMgcmVuZGVyZWQuXG4gICAgICAgICAgICpcbiAgICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnQgRXZlbnQgb2JqZWN0LlxuICAgICAgICAgICAqL1xuICAgICAgICAgIGN1cnJlbnRTY29wZS4kZW1pdCgnJHZpZXdDb250ZW50TG9hZGVkJyk7XG4gICAgICAgICAgY3VycmVudFNjb3BlLiRldmFsKG9ubG9hZEV4cCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuICB9O1xuXG4gIHJldHVybiBkaXJlY3RpdmU7XG59XG5cbiRWaWV3RGlyZWN0aXZlRmlsbC4kaW5qZWN0ID0gWyckY29tcGlsZScsICckY29udHJvbGxlcicsICckc3RhdGUnXTtcbmZ1bmN0aW9uICRWaWV3RGlyZWN0aXZlRmlsbCAoJGNvbXBpbGUsICRjb250cm9sbGVyLCAkc3RhdGUpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0VDQScsXG4gICAgcHJpb3JpdHk6IC00MDAsXG4gICAgY29tcGlsZTogZnVuY3Rpb24gKHRFbGVtZW50KSB7XG4gICAgICB2YXIgaW5pdGlhbCA9IHRFbGVtZW50Lmh0bWwoKTtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoc2NvcGUsICRlbGVtZW50LCBhdHRycykge1xuICAgICAgICB2YXIgbmFtZSAgICAgID0gYXR0cnMudWlWaWV3IHx8IGF0dHJzLm5hbWUgfHwgJycsXG4gICAgICAgICAgICBpbmhlcml0ZWQgPSAkZWxlbWVudC5pbmhlcml0ZWREYXRhKCckdWlWaWV3Jyk7XG5cbiAgICAgICAgaWYgKG5hbWUuaW5kZXhPZignQCcpIDwgMCkge1xuICAgICAgICAgIG5hbWUgPSBuYW1lICsgJ0AnICsgKGluaGVyaXRlZCA/IGluaGVyaXRlZC5zdGF0ZS5uYW1lIDogJycpO1xuICAgICAgICB9XG5cbiAgICAgICAgJGVsZW1lbnQuZGF0YSgnJHVpVmlld05hbWUnLCBuYW1lKTtcblxuICAgICAgICB2YXIgY3VycmVudCA9ICRzdGF0ZS4kY3VycmVudCxcbiAgICAgICAgICAgIGxvY2FscyAgPSBjdXJyZW50ICYmIGN1cnJlbnQubG9jYWxzW25hbWVdO1xuXG4gICAgICAgIGlmICghIGxvY2Fscykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgICRlbGVtZW50LmRhdGEoJyR1aVZpZXcnLCB7IG5hbWU6IG5hbWUsIHN0YXRlOiBsb2NhbHMuJCRzdGF0ZSB9KTtcbiAgICAgICAgJGVsZW1lbnQuaHRtbChsb2NhbHMuJHRlbXBsYXRlID8gbG9jYWxzLiR0ZW1wbGF0ZSA6IGluaXRpYWwpO1xuXG4gICAgICAgIHZhciBsaW5rID0gJGNvbXBpbGUoJGVsZW1lbnQuY29udGVudHMoKSk7XG5cbiAgICAgICAgaWYgKGxvY2Fscy4kJGNvbnRyb2xsZXIpIHtcbiAgICAgICAgICBsb2NhbHMuJHNjb3BlID0gc2NvcGU7XG4gICAgICAgICAgdmFyIGNvbnRyb2xsZXIgPSAkY29udHJvbGxlcihsb2NhbHMuJCRjb250cm9sbGVyLCBsb2NhbHMpO1xuICAgICAgICAgIGlmIChsb2NhbHMuJCRjb250cm9sbGVyQXMpIHtcbiAgICAgICAgICAgIHNjb3BlW2xvY2Fscy4kJGNvbnRyb2xsZXJBc10gPSBjb250cm9sbGVyO1xuICAgICAgICAgIH1cbiAgICAgICAgICAkZWxlbWVudC5kYXRhKCckbmdDb250cm9sbGVyQ29udHJvbGxlcicsIGNvbnRyb2xsZXIpO1xuICAgICAgICAgICRlbGVtZW50LmNoaWxkcmVuKCkuZGF0YSgnJG5nQ29udHJvbGxlckNvbnRyb2xsZXInLCBjb250cm9sbGVyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGxpbmsoc2NvcGUpO1xuICAgICAgfTtcbiAgICB9XG4gIH07XG59XG5cbmFuZ3VsYXIubW9kdWxlKCd1aS5yb3V0ZXIuc3RhdGUnKS5kaXJlY3RpdmUoJ3VpVmlldycsICRWaWV3RGlyZWN0aXZlKTtcbmFuZ3VsYXIubW9kdWxlKCd1aS5yb3V0ZXIuc3RhdGUnKS5kaXJlY3RpdmUoJ3VpVmlldycsICRWaWV3RGlyZWN0aXZlRmlsbCk7XG5cbmZ1bmN0aW9uIHBhcnNlU3RhdGVSZWYocmVmKSB7XG4gIHZhciBwYXJzZWQgPSByZWYucmVwbGFjZSgvXFxuL2csIFwiIFwiKS5tYXRjaCgvXihbXihdKz8pXFxzKihcXCgoLiopXFwpKT8kLyk7XG4gIGlmICghcGFyc2VkIHx8IHBhcnNlZC5sZW5ndGggIT09IDQpIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgc3RhdGUgcmVmICdcIiArIHJlZiArIFwiJ1wiKTtcbiAgcmV0dXJuIHsgc3RhdGU6IHBhcnNlZFsxXSwgcGFyYW1FeHByOiBwYXJzZWRbM10gfHwgbnVsbCB9O1xufVxuXG5mdW5jdGlvbiBzdGF0ZUNvbnRleHQoZWwpIHtcbiAgdmFyIHN0YXRlRGF0YSA9IGVsLnBhcmVudCgpLmluaGVyaXRlZERhdGEoJyR1aVZpZXcnKTtcblxuICBpZiAoc3RhdGVEYXRhICYmIHN0YXRlRGF0YS5zdGF0ZSAmJiBzdGF0ZURhdGEuc3RhdGUubmFtZSkge1xuICAgIHJldHVybiBzdGF0ZURhdGEuc3RhdGU7XG4gIH1cbn1cblxuLyoqXG4gKiBAbmdkb2MgZGlyZWN0aXZlXG4gKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuZGlyZWN0aXZlOnVpLXNyZWZcbiAqXG4gKiBAcmVxdWlyZXMgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVxuICogQHJlcXVpcmVzICR0aW1lb3V0XG4gKlxuICogQHJlc3RyaWN0IEFcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEEgZGlyZWN0aXZlIHRoYXQgYmluZHMgYSBsaW5rIChgPGE+YCB0YWcpIHRvIGEgc3RhdGUuIElmIHRoZSBzdGF0ZSBoYXMgYW4gYXNzb2NpYXRlZCBcbiAqIFVSTCwgdGhlIGRpcmVjdGl2ZSB3aWxsIGF1dG9tYXRpY2FsbHkgZ2VuZXJhdGUgJiB1cGRhdGUgdGhlIGBocmVmYCBhdHRyaWJ1dGUgdmlhIFxuICogdGhlIHtAbGluayB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlI21ldGhvZHNfaHJlZiAkc3RhdGUuaHJlZigpfSBtZXRob2QuIENsaWNraW5nIFxuICogdGhlIGxpbmsgd2lsbCB0cmlnZ2VyIGEgc3RhdGUgdHJhbnNpdGlvbiB3aXRoIG9wdGlvbmFsIHBhcmFtZXRlcnMuIFxuICpcbiAqIEFsc28gbWlkZGxlLWNsaWNraW5nLCByaWdodC1jbGlja2luZywgYW5kIGN0cmwtY2xpY2tpbmcgb24gdGhlIGxpbmsgd2lsbCBiZSBcbiAqIGhhbmRsZWQgbmF0aXZlbHkgYnkgdGhlIGJyb3dzZXIuXG4gKlxuICogWW91IGNhbiBhbHNvIHVzZSByZWxhdGl2ZSBzdGF0ZSBwYXRocyB3aXRoaW4gdWktc3JlZiwganVzdCBsaWtlIHRoZSByZWxhdGl2ZSBcbiAqIHBhdGhzIHBhc3NlZCB0byBgJHN0YXRlLmdvKClgLiBZb3UganVzdCBuZWVkIHRvIGJlIGF3YXJlIHRoYXQgdGhlIHBhdGggaXMgcmVsYXRpdmVcbiAqIHRvIHRoZSBzdGF0ZSB0aGF0IHRoZSBsaW5rIGxpdmVzIGluLCBpbiBvdGhlciB3b3JkcyB0aGUgc3RhdGUgdGhhdCBsb2FkZWQgdGhlIFxuICogdGVtcGxhdGUgY29udGFpbmluZyB0aGUgbGluay5cbiAqXG4gKiBZb3UgY2FuIHNwZWNpZnkgb3B0aW9ucyB0byBwYXNzIHRvIHtAbGluayB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlI2dvICRzdGF0ZS5nbygpfVxuICogdXNpbmcgdGhlIGB1aS1zcmVmLW9wdHNgIGF0dHJpYnV0ZS4gT3B0aW9ucyBhcmUgcmVzdHJpY3RlZCB0byBgbG9jYXRpb25gLCBgaW5oZXJpdGAsXG4gKiBhbmQgYHJlbG9hZGAuXG4gKlxuICogQGV4YW1wbGVcbiAqIEhlcmUncyBhbiBleGFtcGxlIG9mIGhvdyB5b3UnZCB1c2UgdWktc3JlZiBhbmQgaG93IGl0IHdvdWxkIGNvbXBpbGUuIElmIHlvdSBoYXZlIHRoZSBcbiAqIGZvbGxvd2luZyB0ZW1wbGF0ZTpcbiAqIDxwcmU+XG4gKiA8YSB1aS1zcmVmPVwiaG9tZVwiPkhvbWU8L2E+IHwgPGEgdWktc3JlZj1cImFib3V0XCI+QWJvdXQ8L2E+XG4gKiBcbiAqIDx1bD5cbiAqICAgICA8bGkgbmctcmVwZWF0PVwiY29udGFjdCBpbiBjb250YWN0c1wiPlxuICogICAgICAgICA8YSB1aS1zcmVmPVwiY29udGFjdHMuZGV0YWlsKHsgaWQ6IGNvbnRhY3QuaWQgfSlcIj57eyBjb250YWN0Lm5hbWUgfX08L2E+XG4gKiAgICAgPC9saT5cbiAqIDwvdWw+XG4gKiA8L3ByZT5cbiAqIFxuICogVGhlbiB0aGUgY29tcGlsZWQgaHRtbCB3b3VsZCBiZSAoYXNzdW1pbmcgSHRtbDVNb2RlIGlzIG9mZik6XG4gKiA8cHJlPlxuICogPGEgaHJlZj1cIiMvaG9tZVwiIHVpLXNyZWY9XCJob21lXCI+SG9tZTwvYT4gfCA8YSBocmVmPVwiIy9hYm91dFwiIHVpLXNyZWY9XCJhYm91dFwiPkFib3V0PC9hPlxuICogXG4gKiA8dWw+XG4gKiAgICAgPGxpIG5nLXJlcGVhdD1cImNvbnRhY3QgaW4gY29udGFjdHNcIj5cbiAqICAgICAgICAgPGEgaHJlZj1cIiMvY29udGFjdHMvMVwiIHVpLXNyZWY9XCJjb250YWN0cy5kZXRhaWwoeyBpZDogY29udGFjdC5pZCB9KVwiPkpvZTwvYT5cbiAqICAgICA8L2xpPlxuICogICAgIDxsaSBuZy1yZXBlYXQ9XCJjb250YWN0IGluIGNvbnRhY3RzXCI+XG4gKiAgICAgICAgIDxhIGhyZWY9XCIjL2NvbnRhY3RzLzJcIiB1aS1zcmVmPVwiY29udGFjdHMuZGV0YWlsKHsgaWQ6IGNvbnRhY3QuaWQgfSlcIj5BbGljZTwvYT5cbiAqICAgICA8L2xpPlxuICogICAgIDxsaSBuZy1yZXBlYXQ9XCJjb250YWN0IGluIGNvbnRhY3RzXCI+XG4gKiAgICAgICAgIDxhIGhyZWY9XCIjL2NvbnRhY3RzLzNcIiB1aS1zcmVmPVwiY29udGFjdHMuZGV0YWlsKHsgaWQ6IGNvbnRhY3QuaWQgfSlcIj5Cb2I8L2E+XG4gKiAgICAgPC9saT5cbiAqIDwvdWw+XG4gKlxuICogPGEgdWktc3JlZj1cImhvbWVcIiB1aS1zcmVmLW9wdHM9XCJ7cmVsb2FkOiB0cnVlfVwiPkhvbWU8L2E+XG4gKiA8L3ByZT5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gdWktc3JlZiAnc3RhdGVOYW1lJyBjYW4gYmUgYW55IHZhbGlkIGFic29sdXRlIG9yIHJlbGF0aXZlIHN0YXRlXG4gKiBAcGFyYW0ge09iamVjdH0gdWktc3JlZi1vcHRzIG9wdGlvbnMgdG8gcGFzcyB0byB7QGxpbmsgdWkucm91dGVyLnN0YXRlLiRzdGF0ZSNnbyAkc3RhdGUuZ28oKX1cbiAqL1xuJFN0YXRlUmVmRGlyZWN0aXZlLiRpbmplY3QgPSBbJyRzdGF0ZScsICckdGltZW91dCddO1xuZnVuY3Rpb24gJFN0YXRlUmVmRGlyZWN0aXZlKCRzdGF0ZSwgJHRpbWVvdXQpIHtcbiAgdmFyIGFsbG93ZWRPcHRpb25zID0gWydsb2NhdGlvbicsICdpbmhlcml0JywgJ3JlbG9hZCddO1xuXG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdBJyxcbiAgICByZXF1aXJlOiAnP151aVNyZWZBY3RpdmUnLFxuICAgIGxpbms6IGZ1bmN0aW9uKHNjb3BlLCBlbGVtZW50LCBhdHRycywgdWlTcmVmQWN0aXZlKSB7XG4gICAgICB2YXIgcmVmID0gcGFyc2VTdGF0ZVJlZihhdHRycy51aVNyZWYpO1xuICAgICAgdmFyIHBhcmFtcyA9IG51bGwsIHVybCA9IG51bGwsIGJhc2UgPSBzdGF0ZUNvbnRleHQoZWxlbWVudCkgfHwgJHN0YXRlLiRjdXJyZW50O1xuICAgICAgdmFyIGlzRm9ybSA9IGVsZW1lbnRbMF0ubm9kZU5hbWUgPT09IFwiRk9STVwiO1xuICAgICAgdmFyIGF0dHIgPSBpc0Zvcm0gPyBcImFjdGlvblwiIDogXCJocmVmXCIsIG5hdiA9IHRydWU7XG5cbiAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICByZWxhdGl2ZTogYmFzZVxuICAgICAgfTtcbiAgICAgIHZhciBvcHRpb25zT3ZlcnJpZGUgPSBzY29wZS4kZXZhbChhdHRycy51aVNyZWZPcHRzKSB8fCB7fTtcbiAgICAgIGFuZ3VsYXIuZm9yRWFjaChhbGxvd2VkT3B0aW9ucywgZnVuY3Rpb24ob3B0aW9uKSB7XG4gICAgICAgIGlmIChvcHRpb24gaW4gb3B0aW9uc092ZXJyaWRlKSB7XG4gICAgICAgICAgb3B0aW9uc1tvcHRpb25dID0gb3B0aW9uc092ZXJyaWRlW29wdGlvbl07XG4gICAgICAgIH1cbiAgICAgIH0pO1xuXG4gICAgICB2YXIgdXBkYXRlID0gZnVuY3Rpb24obmV3VmFsKSB7XG4gICAgICAgIGlmIChuZXdWYWwpIHBhcmFtcyA9IG5ld1ZhbDtcbiAgICAgICAgaWYgKCFuYXYpIHJldHVybjtcblxuICAgICAgICB2YXIgbmV3SHJlZiA9ICRzdGF0ZS5ocmVmKHJlZi5zdGF0ZSwgcGFyYW1zLCBvcHRpb25zKTtcblxuICAgICAgICBpZiAodWlTcmVmQWN0aXZlKSB7XG4gICAgICAgICAgdWlTcmVmQWN0aXZlLiQkc2V0U3RhdGVJbmZvKHJlZi5zdGF0ZSwgcGFyYW1zKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIW5ld0hyZWYpIHtcbiAgICAgICAgICBuYXYgPSBmYWxzZTtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxlbWVudFswXVthdHRyXSA9IG5ld0hyZWY7XG4gICAgICB9O1xuXG4gICAgICBpZiAocmVmLnBhcmFtRXhwcikge1xuICAgICAgICBzY29wZS4kd2F0Y2gocmVmLnBhcmFtRXhwciwgZnVuY3Rpb24obmV3VmFsLCBvbGRWYWwpIHtcbiAgICAgICAgICBpZiAobmV3VmFsICE9PSBwYXJhbXMpIHVwZGF0ZShuZXdWYWwpO1xuICAgICAgICB9LCB0cnVlKTtcbiAgICAgICAgcGFyYW1zID0gc2NvcGUuJGV2YWwocmVmLnBhcmFtRXhwcik7XG4gICAgICB9XG4gICAgICB1cGRhdGUoKTtcblxuICAgICAgaWYgKGlzRm9ybSkgcmV0dXJuO1xuXG4gICAgICBlbGVtZW50LmJpbmQoXCJjbGlja1wiLCBmdW5jdGlvbihlKSB7XG4gICAgICAgIHZhciBidXR0b24gPSBlLndoaWNoIHx8IGUuYnV0dG9uO1xuICAgICAgICBpZiAoICEoYnV0dG9uID4gMSB8fCBlLmN0cmxLZXkgfHwgZS5tZXRhS2V5IHx8IGUuc2hpZnRLZXkgfHwgZWxlbWVudC5hdHRyKCd0YXJnZXQnKSkgKSB7XG4gICAgICAgICAgLy8gSEFDSzogVGhpcyBpcyB0byBhbGxvdyBuZy1jbGlja3MgdG8gYmUgcHJvY2Vzc2VkIGJlZm9yZSB0aGUgdHJhbnNpdGlvbiBpcyBpbml0aWF0ZWQ6XG4gICAgICAgICAgJHRpbWVvdXQoZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc3RhdGUuZ28ocmVmLnN0YXRlLCBwYXJhbXMsIG9wdGlvbnMpO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9O1xufVxuXG4vKipcbiAqIEBuZ2RvYyBkaXJlY3RpdmVcbiAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS5kaXJlY3RpdmU6dWktc3JlZi1hY3RpdmVcbiAqXG4gKiBAcmVxdWlyZXMgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVxuICogQHJlcXVpcmVzIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVQYXJhbXNcbiAqIEByZXF1aXJlcyAkaW50ZXJwb2xhdGVcbiAqXG4gKiBAcmVzdHJpY3QgQVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogQSBkaXJlY3RpdmUgd29ya2luZyBhbG9uZ3NpZGUgdWktc3JlZiB0byBhZGQgY2xhc3NlcyB0byBhbiBlbGVtZW50IHdoZW4gdGhlIFxuICogcmVsYXRlZCB1aS1zcmVmIGRpcmVjdGl2ZSdzIHN0YXRlIGlzIGFjdGl2ZSwgYW5kIHJlbW92aW5nIHRoZW0gd2hlbiBpdCBpcyBpbmFjdGl2ZS5cbiAqIFRoZSBwcmltYXJ5IHVzZS1jYXNlIGlzIHRvIHNpbXBsaWZ5IHRoZSBzcGVjaWFsIGFwcGVhcmFuY2Ugb2YgbmF2aWdhdGlvbiBtZW51cyBcbiAqIHJlbHlpbmcgb24gYHVpLXNyZWZgLCBieSBoYXZpbmcgdGhlIFwiYWN0aXZlXCIgc3RhdGUncyBtZW51IGJ1dHRvbiBhcHBlYXIgZGlmZmVyZW50LFxuICogZGlzdGluZ3Vpc2hpbmcgaXQgZnJvbSB0aGUgaW5hY3RpdmUgbWVudSBpdGVtcy5cbiAqXG4gKiBAZXhhbXBsZVxuICogR2l2ZW4gdGhlIGZvbGxvd2luZyB0ZW1wbGF0ZTpcbiAqIDxwcmU+XG4gKiA8dWw+XG4gKiAgIDxsaSB1aS1zcmVmLWFjdGl2ZT1cImFjdGl2ZVwiIGNsYXNzPVwiaXRlbVwiPlxuICogICAgIDxhIGhyZWYgdWktc3JlZj1cImFwcC51c2VyKHt1c2VyOiAnYmlsYm9iYWdnaW5zJ30pXCI+QGJpbGJvYmFnZ2luczwvYT5cbiAqICAgPC9saT5cbiAqIDwvdWw+XG4gKiA8L3ByZT5cbiAqIFxuICogV2hlbiB0aGUgYXBwIHN0YXRlIGlzIFwiYXBwLnVzZXJcIiwgYW5kIGNvbnRhaW5zIHRoZSBzdGF0ZSBwYXJhbWV0ZXIgXCJ1c2VyXCIgd2l0aCB2YWx1ZSBcImJpbGJvYmFnZ2luc1wiLCBcbiAqIHRoZSByZXN1bHRpbmcgSFRNTCB3aWxsIGFwcGVhciBhcyAobm90ZSB0aGUgJ2FjdGl2ZScgY2xhc3MpOlxuICogPHByZT5cbiAqIDx1bD5cbiAqICAgPGxpIHVpLXNyZWYtYWN0aXZlPVwiYWN0aXZlXCIgY2xhc3M9XCJpdGVtIGFjdGl2ZVwiPlxuICogICAgIDxhIHVpLXNyZWY9XCJhcHAudXNlcih7dXNlcjogJ2JpbGJvYmFnZ2lucyd9KVwiIGhyZWY9XCIvdXNlcnMvYmlsYm9iYWdnaW5zXCI+QGJpbGJvYmFnZ2luczwvYT5cbiAqICAgPC9saT5cbiAqIDwvdWw+XG4gKiA8L3ByZT5cbiAqIFxuICogVGhlIGNsYXNzIG5hbWUgaXMgaW50ZXJwb2xhdGVkICoqb25jZSoqIGR1cmluZyB0aGUgZGlyZWN0aXZlcyBsaW5rIHRpbWUgKGFueSBmdXJ0aGVyIGNoYW5nZXMgdG8gdGhlIFxuICogaW50ZXJwb2xhdGVkIHZhbHVlIGFyZSBpZ25vcmVkKS4gXG4gKiBcbiAqIE11bHRpcGxlIGNsYXNzZXMgbWF5IGJlIHNwZWNpZmllZCBpbiBhIHNwYWNlLXNlcGFyYXRlZCBmb3JtYXQ6XG4gKiA8cHJlPlxuICogPHVsPlxuICogICA8bGkgdWktc3JlZi1hY3RpdmU9J2NsYXNzMSBjbGFzczIgY2xhc3MzJz5cbiAqICAgICA8YSB1aS1zcmVmPVwiYXBwLnVzZXJcIj5saW5rPC9hPlxuICogICA8L2xpPlxuICogPC91bD5cbiAqIDwvcHJlPlxuICovXG4kU3RhdGVBY3RpdmVEaXJlY3RpdmUuJGluamVjdCA9IFsnJHN0YXRlJywgJyRzdGF0ZVBhcmFtcycsICckaW50ZXJwb2xhdGUnXTtcbmZ1bmN0aW9uICRTdGF0ZUFjdGl2ZURpcmVjdGl2ZSgkc3RhdGUsICRzdGF0ZVBhcmFtcywgJGludGVycG9sYXRlKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6IFwiQVwiLFxuICAgIGNvbnRyb2xsZXI6IFsnJHNjb3BlJywgJyRlbGVtZW50JywgJyRhdHRycycsIGZ1bmN0aW9uKCRzY29wZSwgJGVsZW1lbnQsICRhdHRycykge1xuICAgICAgdmFyIHN0YXRlLCBwYXJhbXMsIGFjdGl2ZUNsYXNzO1xuXG4gICAgICAvLyBUaGVyZSBwcm9iYWJseSBpc24ndCBtdWNoIHBvaW50IGluICRvYnNlcnZpbmcgdGhpc1xuICAgICAgYWN0aXZlQ2xhc3MgPSAkaW50ZXJwb2xhdGUoJGF0dHJzLnVpU3JlZkFjdGl2ZSB8fCAnJywgZmFsc2UpKCRzY29wZSk7XG5cbiAgICAgIC8vIEFsbG93IHVpU3JlZiB0byBjb21tdW5pY2F0ZSB3aXRoIHVpU3JlZkFjdGl2ZVxuICAgICAgdGhpcy4kJHNldFN0YXRlSW5mbyA9IGZ1bmN0aW9uKG5ld1N0YXRlLCBuZXdQYXJhbXMpIHtcbiAgICAgICAgc3RhdGUgPSAkc3RhdGUuZ2V0KG5ld1N0YXRlLCBzdGF0ZUNvbnRleHQoJGVsZW1lbnQpKTtcbiAgICAgICAgcGFyYW1zID0gbmV3UGFyYW1zO1xuICAgICAgICB1cGRhdGUoKTtcbiAgICAgIH07XG5cbiAgICAgICRzY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCB1cGRhdGUpO1xuXG4gICAgICAvLyBVcGRhdGUgcm91dGUgc3RhdGVcbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcbiAgICAgICAgaWYgKCRzdGF0ZS4kY3VycmVudC5zZWxmID09PSBzdGF0ZSAmJiBtYXRjaGVzUGFyYW1zKCkpIHtcbiAgICAgICAgICAkZWxlbWVudC5hZGRDbGFzcyhhY3RpdmVDbGFzcyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgJGVsZW1lbnQucmVtb3ZlQ2xhc3MoYWN0aXZlQ2xhc3MpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIG1hdGNoZXNQYXJhbXMoKSB7XG4gICAgICAgIHJldHVybiAhcGFyYW1zIHx8IGVxdWFsRm9yS2V5cyhwYXJhbXMsICRzdGF0ZVBhcmFtcyk7XG4gICAgICB9XG4gICAgfV1cbiAgfTtcbn1cblxuYW5ndWxhci5tb2R1bGUoJ3VpLnJvdXRlci5zdGF0ZScpXG4gIC5kaXJlY3RpdmUoJ3VpU3JlZicsICRTdGF0ZVJlZkRpcmVjdGl2ZSlcbiAgLmRpcmVjdGl2ZSgndWlTcmVmQWN0aXZlJywgJFN0YXRlQWN0aXZlRGlyZWN0aXZlKTtcblxuLyoqXG4gKiBAbmdkb2MgZmlsdGVyXG4gKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuZmlsdGVyOmlzU3RhdGVcbiAqXG4gKiBAcmVxdWlyZXMgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogVHJhbnNsYXRlcyB0byB7QGxpbmsgdWkucm91dGVyLnN0YXRlLiRzdGF0ZSNtZXRob2RzX2lzICRzdGF0ZS5pcyhcInN0YXRlTmFtZVwiKX0uXG4gKi9cbiRJc1N0YXRlRmlsdGVyLiRpbmplY3QgPSBbJyRzdGF0ZSddO1xuZnVuY3Rpb24gJElzU3RhdGVGaWx0ZXIoJHN0YXRlKSB7XG4gIHJldHVybiBmdW5jdGlvbihzdGF0ZSkge1xuICAgIHJldHVybiAkc3RhdGUuaXMoc3RhdGUpO1xuICB9O1xufVxuXG4vKipcbiAqIEBuZ2RvYyBmaWx0ZXJcbiAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS5maWx0ZXI6aW5jbHVkZWRCeVN0YXRlXG4gKlxuICogQHJlcXVpcmVzIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFRyYW5zbGF0ZXMgdG8ge0BsaW5rIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGUjbWV0aG9kc19pbmNsdWRlcyAkc3RhdGUuaW5jbHVkZXMoJ2Z1bGxPclBhcnRpYWxTdGF0ZU5hbWUnKX0uXG4gKi9cbiRJbmNsdWRlZEJ5U3RhdGVGaWx0ZXIuJGluamVjdCA9IFsnJHN0YXRlJ107XG5mdW5jdGlvbiAkSW5jbHVkZWRCeVN0YXRlRmlsdGVyKCRzdGF0ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oc3RhdGUpIHtcbiAgICByZXR1cm4gJHN0YXRlLmluY2x1ZGVzKHN0YXRlKTtcbiAgfTtcbn1cblxuYW5ndWxhci5tb2R1bGUoJ3VpLnJvdXRlci5zdGF0ZScpXG4gIC5maWx0ZXIoJ2lzU3RhdGUnLCAkSXNTdGF0ZUZpbHRlcilcbiAgLmZpbHRlcignaW5jbHVkZWRCeVN0YXRlJywgJEluY2x1ZGVkQnlTdGF0ZUZpbHRlcik7XG5cbi8qXG4gKiBAbmdkb2Mgb2JqZWN0XG4gKiBAbmFtZSB1aS5yb3V0ZXIuY29tcGF0LiRyb3V0ZVByb3ZpZGVyXG4gKlxuICogQHJlcXVpcmVzIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVQcm92aWRlclxuICogQHJlcXVpcmVzIHVpLnJvdXRlci5yb3V0ZXIuJHVybFJvdXRlclByb3ZpZGVyXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBgJHJvdXRlUHJvdmlkZXJgIG9mIHRoZSBgdWkucm91dGVyLmNvbXBhdGAgbW9kdWxlIG92ZXJ3cml0ZXMgdGhlIGV4aXN0aW5nXG4gKiBgcm91dGVQcm92aWRlcmAgZnJvbSB0aGUgY29yZS4gVGhpcyBpcyBkb25lIHRvIHByb3ZpZGUgY29tcGF0aWJpbGl0eSBiZXR3ZWVuXG4gKiB0aGUgVUkgUm91dGVyIGFuZCB0aGUgY29yZSByb3V0ZXIuXG4gKlxuICogSXQgYWxzbyBwcm92aWRlcyBhIGB3aGVuKClgIG1ldGhvZCB0byByZWdpc3RlciByb3V0ZXMgdGhhdCBtYXAgdG8gY2VydGFpbiB1cmxzLlxuICogQmVoaW5kIHRoZSBzY2VuZXMgaXQgYWN0dWFsbHkgZGVsZWdhdGVzIGVpdGhlciB0byBcbiAqIHtAbGluayB1aS5yb3V0ZXIucm91dGVyLiR1cmxSb3V0ZXJQcm92aWRlciAkdXJsUm91dGVyUHJvdmlkZXJ9IG9yIHRvIHRoZSBcbiAqIHtAbGluayB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlUHJvdmlkZXIgJHN0YXRlUHJvdmlkZXJ9IHRvIHBvc3Rwcm9jZXNzIHRoZSBnaXZlbiBcbiAqIHJvdXRlciBkZWZpbml0aW9uIG9iamVjdC5cbiAqL1xuJFJvdXRlUHJvdmlkZXIuJGluamVjdCA9IFsnJHN0YXRlUHJvdmlkZXInLCAnJHVybFJvdXRlclByb3ZpZGVyJ107XG5mdW5jdGlvbiAkUm91dGVQcm92aWRlciggICRzdGF0ZVByb3ZpZGVyLCAgICAkdXJsUm91dGVyUHJvdmlkZXIpIHtcblxuICB2YXIgcm91dGVzID0gW107XG5cbiAgb25FbnRlclJvdXRlLiRpbmplY3QgPSBbJyQkc3RhdGUnXTtcbiAgZnVuY3Rpb24gb25FbnRlclJvdXRlKCAgICQkc3RhdGUpIHtcbiAgICAvKmpzaGludCB2YWxpZHRoaXM6IHRydWUgKi9cbiAgICB0aGlzLmxvY2FscyA9ICQkc3RhdGUubG9jYWxzLmdsb2JhbHM7XG4gICAgdGhpcy5wYXJhbXMgPSB0aGlzLmxvY2Fscy4kc3RhdGVQYXJhbXM7XG4gIH1cblxuICBmdW5jdGlvbiBvbkV4aXRSb3V0ZSgpIHtcbiAgICAvKmpzaGludCB2YWxpZHRoaXM6IHRydWUgKi9cbiAgICB0aGlzLmxvY2FscyA9IG51bGw7XG4gICAgdGhpcy5wYXJhbXMgPSBudWxsO1xuICB9XG5cbiAgdGhpcy53aGVuID0gd2hlbjtcbiAgLypcbiAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAqIEBuYW1lIHVpLnJvdXRlci5jb21wYXQuJHJvdXRlUHJvdmlkZXIjd2hlblxuICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLmNvbXBhdC4kcm91dGVQcm92aWRlclxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVnaXN0ZXJzIGEgcm91dGUgd2l0aCBhIGdpdmVuIHJvdXRlIGRlZmluaXRpb24gb2JqZWN0LiBUaGUgcm91dGUgZGVmaW5pdGlvblxuICAgKiBvYmplY3QgaGFzIHRoZSBzYW1lIGludGVyZmFjZSB0aGUgYW5ndWxhciBjb3JlIHJvdXRlIGRlZmluaXRpb24gb2JqZWN0IGhhcy5cbiAgICogXG4gICAqIEBleGFtcGxlXG4gICAqIDxwcmU+XG4gICAqIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyd1aS5yb3V0ZXIuY29tcGF0J10pO1xuICAgKlxuICAgKiBhcHAuY29uZmlnKGZ1bmN0aW9uICgkcm91dGVQcm92aWRlcikge1xuICAgKiAgICRyb3V0ZVByb3ZpZGVyLndoZW4oJ2hvbWUnLCB7XG4gICAqICAgICBjb250cm9sbGVyOiBmdW5jdGlvbiAoKSB7IC4uLiB9LFxuICAgKiAgICAgdGVtcGxhdGVVcmw6ICdwYXRoL3RvL3RlbXBsYXRlJ1xuICAgKiAgIH0pO1xuICAgKiB9KTtcbiAgICogPC9wcmU+XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfSB1cmwgVVJMIGFzIHN0cmluZ1xuICAgKiBAcGFyYW0ge29iamVjdH0gcm91dGUgUm91dGUgZGVmaW5pdGlvbiBvYmplY3RcbiAgICpcbiAgICogQHJldHVybiB7b2JqZWN0fSAkcm91dGVQcm92aWRlciAtICRyb3V0ZVByb3ZpZGVyIGluc3RhbmNlXG4gICAqL1xuICBmdW5jdGlvbiB3aGVuKHVybCwgcm91dGUpIHtcbiAgICAvKmpzaGludCB2YWxpZHRoaXM6IHRydWUgKi9cbiAgICBpZiAocm91dGUucmVkaXJlY3RUbyAhPSBudWxsKSB7XG4gICAgICAvLyBSZWRpcmVjdCwgY29uZmlndXJlIGRpcmVjdGx5IG9uICR1cmxSb3V0ZXJQcm92aWRlclxuICAgICAgdmFyIHJlZGlyZWN0ID0gcm91dGUucmVkaXJlY3RUbywgaGFuZGxlcjtcbiAgICAgIGlmIChpc1N0cmluZyhyZWRpcmVjdCkpIHtcbiAgICAgICAgaGFuZGxlciA9IHJlZGlyZWN0OyAvLyBsZWF2ZSAkdXJsUm91dGVyUHJvdmlkZXIgdG8gaGFuZGxlXG4gICAgICB9IGVsc2UgaWYgKGlzRnVuY3Rpb24ocmVkaXJlY3QpKSB7XG4gICAgICAgIC8vIEFkYXB0IHRvICR1cmxSb3V0ZXJQcm92aWRlciBBUElcbiAgICAgICAgaGFuZGxlciA9IGZ1bmN0aW9uIChwYXJhbXMsICRsb2NhdGlvbikge1xuICAgICAgICAgIHJldHVybiByZWRpcmVjdChwYXJhbXMsICRsb2NhdGlvbi5wYXRoKCksICRsb2NhdGlvbi5zZWFyY2goKSk7XG4gICAgICAgIH07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkICdyZWRpcmVjdFRvJyBpbiB3aGVuKClcIik7XG4gICAgICB9XG4gICAgICAkdXJsUm91dGVyUHJvdmlkZXIud2hlbih1cmwsIGhhbmRsZXIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBSZWd1bGFyIHJvdXRlLCBjb25maWd1cmUgYXMgc3RhdGVcbiAgICAgICRzdGF0ZVByb3ZpZGVyLnN0YXRlKGluaGVyaXQocm91dGUsIHtcbiAgICAgICAgcGFyZW50OiBudWxsLFxuICAgICAgICBuYW1lOiAncm91dGU6JyArIGVuY29kZVVSSUNvbXBvbmVudCh1cmwpLFxuICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgb25FbnRlcjogb25FbnRlclJvdXRlLFxuICAgICAgICBvbkV4aXQ6IG9uRXhpdFJvdXRlXG4gICAgICB9KSk7XG4gICAgfVxuICAgIHJvdXRlcy5wdXNoKHJvdXRlKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qXG4gICAqIEBuZ2RvYyBvYmplY3RcbiAgICogQG5hbWUgdWkucm91dGVyLmNvbXBhdC4kcm91dGVcbiAgICpcbiAgICogQHJlcXVpcmVzIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVcbiAgICogQHJlcXVpcmVzICRyb290U2NvcGVcbiAgICogQHJlcXVpcmVzICRyb3V0ZVBhcmFtc1xuICAgKlxuICAgKiBAcHJvcGVydHkge29iamVjdH0gcm91dGVzIC0gQXJyYXkgb2YgcmVnaXN0ZXJlZCByb3V0ZXMuXG4gICAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBwYXJhbXMgLSBDdXJyZW50IHJvdXRlIHBhcmFtcyBhcyBvYmplY3QuXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBjdXJyZW50IC0gTmFtZSBvZiB0aGUgY3VycmVudCByb3V0ZS5cbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFRoZSBgJHJvdXRlYCBzZXJ2aWNlIHByb3ZpZGVzIGludGVyZmFjZXMgdG8gYWNjZXNzIGRlZmluZWQgcm91dGVzLiBJdCBhbHNvIGxldCdzXG4gICAqIHlvdSBhY2Nlc3Mgcm91dGUgcGFyYW1zIHRocm91Z2ggYCRyb3V0ZVBhcmFtc2Agc2VydmljZSwgc28geW91IGhhdmUgZnVsbHlcbiAgICogY29udHJvbCBvdmVyIGFsbCB0aGUgc3R1ZmYgeW91IHdvdWxkIGFjdHVhbGx5IGdldCBmcm9tIGFuZ3VsYXIncyBjb3JlIGAkcm91dGVgXG4gICAqIHNlcnZpY2UuXG4gICAqL1xuICB0aGlzLiRnZXQgPSAkZ2V0O1xuICAkZ2V0LiRpbmplY3QgPSBbJyRzdGF0ZScsICckcm9vdFNjb3BlJywgJyRyb3V0ZVBhcmFtcyddO1xuICBmdW5jdGlvbiAkZ2V0KCAgICRzdGF0ZSwgICAkcm9vdFNjb3BlLCAgICRyb3V0ZVBhcmFtcykge1xuXG4gICAgdmFyICRyb3V0ZSA9IHtcbiAgICAgIHJvdXRlczogcm91dGVzLFxuICAgICAgcGFyYW1zOiAkcm91dGVQYXJhbXMsXG4gICAgICBjdXJyZW50OiB1bmRlZmluZWRcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gc3RhdGVBc1JvdXRlKHN0YXRlKSB7XG4gICAgICByZXR1cm4gKHN0YXRlLm5hbWUgIT09ICcnKSA/IHN0YXRlIDogdW5kZWZpbmVkO1xuICAgIH1cblxuICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldiwgdG8sIHRvUGFyYW1zLCBmcm9tLCBmcm9tUGFyYW1zKSB7XG4gICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJyRyb3V0ZUNoYW5nZVN0YXJ0Jywgc3RhdGVBc1JvdXRlKHRvKSwgc3RhdGVBc1JvdXRlKGZyb20pKTtcbiAgICB9KTtcblxuICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24gKGV2LCB0bywgdG9QYXJhbXMsIGZyb20sIGZyb21QYXJhbXMpIHtcbiAgICAgICRyb3V0ZS5jdXJyZW50ID0gc3RhdGVBc1JvdXRlKHRvKTtcbiAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnJHJvdXRlQ2hhbmdlU3VjY2VzcycsIHN0YXRlQXNSb3V0ZSh0byksIHN0YXRlQXNSb3V0ZShmcm9tKSk7XG4gICAgICBjb3B5KHRvUGFyYW1zLCAkcm91dGUucGFyYW1zKTtcbiAgICB9KTtcblxuICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VFcnJvcicsIGZ1bmN0aW9uIChldiwgdG8sIHRvUGFyYW1zLCBmcm9tLCBmcm9tUGFyYW1zLCBlcnJvcikge1xuICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckcm91dGVDaGFuZ2VFcnJvcicsIHN0YXRlQXNSb3V0ZSh0byksIHN0YXRlQXNSb3V0ZShmcm9tKSwgZXJyb3IpO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuICRyb3V0ZTtcbiAgfVxufVxuXG5hbmd1bGFyLm1vZHVsZSgndWkucm91dGVyLmNvbXBhdCcpXG4gIC5wcm92aWRlcignJHJvdXRlJywgJFJvdXRlUHJvdmlkZXIpXG4gIC5kaXJlY3RpdmUoJ25nVmlldycsICRWaWV3RGlyZWN0aXZlKTtcbn0pKHdpbmRvdywgd2luZG93LmFuZ3VsYXIpO1xufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJERjF1cnhcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYW5ndWxhci11aS1yb3V0ZXIvcmVsZWFzZS9hbmd1bGFyLXVpLXJvdXRlci5qc1wiLFwiLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9hbmd1bGFyLXVpLXJvdXRlci9yZWxlYXNlXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xucmVxdWlyZSgnLi9saWIvYW5ndWxhci5taW4uanMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBhbmd1bGFyO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIkRGMXVyeFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9hbmd1bGFyL2luZGV4LWJyb3dzZXJpZnkuanNcIixcIi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYW5ndWxhclwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qXG4gQW5ndWxhckpTIHYxLjIuMThcbiAoYykgMjAxMC0yMDE0IEdvb2dsZSwgSW5jLiBodHRwOi8vYW5ndWxhcmpzLm9yZ1xuIExpY2Vuc2U6IE1JVFxuKi9cbihmdW5jdGlvbihULFYscyl7J3VzZSBzdHJpY3QnO2Z1bmN0aW9uIHQoYil7cmV0dXJuIGZ1bmN0aW9uKCl7dmFyIGE9YXJndW1lbnRzWzBdLGMsYT1cIltcIisoYj9iK1wiOlwiOlwiXCIpK2ErXCJdIGh0dHA6Ly9lcnJvcnMuYW5ndWxhcmpzLm9yZy8xLjIuMTgvXCIrKGI/YitcIi9cIjpcIlwiKSthO2ZvcihjPTE7Yzxhcmd1bWVudHMubGVuZ3RoO2MrKylhPWErKDE9PWM/XCI/XCI6XCImXCIpK1wicFwiKyhjLTEpK1wiPVwiK2VuY29kZVVSSUNvbXBvbmVudChcImZ1bmN0aW9uXCI9PXR5cGVvZiBhcmd1bWVudHNbY10/YXJndW1lbnRzW2NdLnRvU3RyaW5nKCkucmVwbGFjZSgvIFxce1tcXHNcXFNdKiQvLFwiXCIpOlwidW5kZWZpbmVkXCI9PXR5cGVvZiBhcmd1bWVudHNbY10/XCJ1bmRlZmluZWRcIjpcInN0cmluZ1wiIT10eXBlb2YgYXJndW1lbnRzW2NdP0pTT04uc3RyaW5naWZ5KGFyZ3VtZW50c1tjXSk6YXJndW1lbnRzW2NdKTtyZXR1cm4gRXJyb3IoYSl9fWZ1bmN0aW9uIGRiKGIpe2lmKG51bGw9PWJ8fEVhKGIpKXJldHVybiExO1xudmFyIGE9Yi5sZW5ndGg7cmV0dXJuIDE9PT1iLm5vZGVUeXBlJiZhPyEwOkMoYil8fE8oYil8fDA9PT1hfHxcIm51bWJlclwiPT09dHlwZW9mIGEmJjA8YSYmYS0xIGluIGJ9ZnVuY3Rpb24gcShiLGEsYyl7dmFyIGQ7aWYoYilpZihRKGIpKWZvcihkIGluIGIpXCJwcm90b3R5cGVcIj09ZHx8KFwibGVuZ3RoXCI9PWR8fFwibmFtZVwiPT1kfHxiLmhhc093blByb3BlcnR5JiYhYi5oYXNPd25Qcm9wZXJ0eShkKSl8fGEuY2FsbChjLGJbZF0sZCk7ZWxzZSBpZihiLmZvckVhY2gmJmIuZm9yRWFjaCE9PXEpYi5mb3JFYWNoKGEsYyk7ZWxzZSBpZihkYihiKSlmb3IoZD0wO2Q8Yi5sZW5ndGg7ZCsrKWEuY2FsbChjLGJbZF0sZCk7ZWxzZSBmb3IoZCBpbiBiKWIuaGFzT3duUHJvcGVydHkoZCkmJmEuY2FsbChjLGJbZF0sZCk7cmV0dXJuIGJ9ZnVuY3Rpb24gV2IoYil7dmFyIGE9W10sYztmb3IoYyBpbiBiKWIuaGFzT3duUHJvcGVydHkoYykmJmEucHVzaChjKTtyZXR1cm4gYS5zb3J0KCl9ZnVuY3Rpb24gU2MoYixcbmEsYyl7Zm9yKHZhciBkPVdiKGIpLGU9MDtlPGQubGVuZ3RoO2UrKylhLmNhbGwoYyxiW2RbZV1dLGRbZV0pO3JldHVybiBkfWZ1bmN0aW9uIFhiKGIpe3JldHVybiBmdW5jdGlvbihhLGMpe2IoYyxhKX19ZnVuY3Rpb24gZWIoKXtmb3IodmFyIGI9amEubGVuZ3RoLGE7Yjspe2ItLTthPWphW2JdLmNoYXJDb2RlQXQoMCk7aWYoNTc9PWEpcmV0dXJuIGphW2JdPVwiQVwiLGphLmpvaW4oXCJcIik7aWYoOTA9PWEpamFbYl09XCIwXCI7ZWxzZSByZXR1cm4gamFbYl09U3RyaW5nLmZyb21DaGFyQ29kZShhKzEpLGphLmpvaW4oXCJcIil9amEudW5zaGlmdChcIjBcIik7cmV0dXJuIGphLmpvaW4oXCJcIil9ZnVuY3Rpb24gWWIoYixhKXthP2IuJCRoYXNoS2V5PWE6ZGVsZXRlIGIuJCRoYXNoS2V5fWZ1bmN0aW9uIEooYil7dmFyIGE9Yi4kJGhhc2hLZXk7cShhcmd1bWVudHMsZnVuY3Rpb24oYSl7YSE9PWImJnEoYSxmdW5jdGlvbihhLGMpe2JbY109YX0pfSk7WWIoYixhKTtyZXR1cm4gYn1mdW5jdGlvbiBaKGIpe3JldHVybiBwYXJzZUludChiLFxuMTApfWZ1bmN0aW9uIFpiKGIsYSl7cmV0dXJuIEoobmV3IChKKGZ1bmN0aW9uKCl7fSx7cHJvdG90eXBlOmJ9KSksYSl9ZnVuY3Rpb24geSgpe31mdW5jdGlvbiBGYShiKXtyZXR1cm4gYn1mdW5jdGlvbiAkKGIpe3JldHVybiBmdW5jdGlvbigpe3JldHVybiBifX1mdW5jdGlvbiBEKGIpe3JldHVyblwidW5kZWZpbmVkXCI9PT10eXBlb2YgYn1mdW5jdGlvbiBCKGIpe3JldHVyblwidW5kZWZpbmVkXCIhPT10eXBlb2YgYn1mdW5jdGlvbiBVKGIpe3JldHVybiBudWxsIT1iJiZcIm9iamVjdFwiPT09dHlwZW9mIGJ9ZnVuY3Rpb24gQyhiKXtyZXR1cm5cInN0cmluZ1wiPT09dHlwZW9mIGJ9ZnVuY3Rpb24geWIoYil7cmV0dXJuXCJudW1iZXJcIj09PXR5cGVvZiBifWZ1bmN0aW9uIE5hKGIpe3JldHVyblwiW29iamVjdCBEYXRlXVwiPT09d2EuY2FsbChiKX1mdW5jdGlvbiBRKGIpe3JldHVyblwiZnVuY3Rpb25cIj09PXR5cGVvZiBifWZ1bmN0aW9uIGZiKGIpe3JldHVyblwiW29iamVjdCBSZWdFeHBdXCI9PT13YS5jYWxsKGIpfVxuZnVuY3Rpb24gRWEoYil7cmV0dXJuIGImJmIuZG9jdW1lbnQmJmIubG9jYXRpb24mJmIuYWxlcnQmJmIuc2V0SW50ZXJ2YWx9ZnVuY3Rpb24gVGMoYil7cmV0dXJuISghYnx8IShiLm5vZGVOYW1lfHxiLnByb3AmJmIuYXR0ciYmYi5maW5kKSl9ZnVuY3Rpb24gVWMoYixhLGMpe3ZhciBkPVtdO3EoYixmdW5jdGlvbihiLGcsZil7ZC5wdXNoKGEuY2FsbChjLGIsZyxmKSl9KTtyZXR1cm4gZH1mdW5jdGlvbiBPYShiLGEpe2lmKGIuaW5kZXhPZilyZXR1cm4gYi5pbmRleE9mKGEpO2Zvcih2YXIgYz0wO2M8Yi5sZW5ndGg7YysrKWlmKGE9PT1iW2NdKXJldHVybiBjO3JldHVybi0xfWZ1bmN0aW9uIFBhKGIsYSl7dmFyIGM9T2EoYixhKTswPD1jJiZiLnNwbGljZShjLDEpO3JldHVybiBhfWZ1bmN0aW9uIEdhKGIsYSxjLGQpe2lmKEVhKGIpfHxiJiZiLiRldmFsQXN5bmMmJmIuJHdhdGNoKXRocm93IFFhKFwiY3B3c1wiKTtpZihhKXtpZihiPT09YSl0aHJvdyBRYShcImNwaVwiKTtjPWN8fFtdO1xuZD1kfHxbXTtpZihVKGIpKXt2YXIgZT1PYShjLGIpO2lmKC0xIT09ZSlyZXR1cm4gZFtlXTtjLnB1c2goYik7ZC5wdXNoKGEpfWlmKE8oYikpZm9yKHZhciBnPWEubGVuZ3RoPTA7ZzxiLmxlbmd0aDtnKyspZT1HYShiW2ddLG51bGwsYyxkKSxVKGJbZ10pJiYoYy5wdXNoKGJbZ10pLGQucHVzaChlKSksYS5wdXNoKGUpO2Vsc2V7dmFyIGY9YS4kJGhhc2hLZXk7cShhLGZ1bmN0aW9uKGIsYyl7ZGVsZXRlIGFbY119KTtmb3IoZyBpbiBiKWU9R2EoYltnXSxudWxsLGMsZCksVShiW2ddKSYmKGMucHVzaChiW2ddKSxkLnB1c2goZSkpLGFbZ109ZTtZYihhLGYpfX1lbHNlKGE9YikmJihPKGIpP2E9R2EoYixbXSxjLGQpOk5hKGIpP2E9bmV3IERhdGUoYi5nZXRUaW1lKCkpOmZiKGIpP2E9UmVnRXhwKGIuc291cmNlKTpVKGIpJiYoYT1HYShiLHt9LGMsZCkpKTtyZXR1cm4gYX1mdW5jdGlvbiBrYShiLGEpe2lmKE8oYikpe2E9YXx8W107Zm9yKHZhciBjPTA7YzxiLmxlbmd0aDtjKyspYVtjXT1cbmJbY119ZWxzZSBpZihVKGIpKWZvcihjIGluIGE9YXx8e30sYikhemIuY2FsbChiLGMpfHxcIiRcIj09PWMuY2hhckF0KDApJiZcIiRcIj09PWMuY2hhckF0KDEpfHwoYVtjXT1iW2NdKTtyZXR1cm4gYXx8Yn1mdW5jdGlvbiB4YShiLGEpe2lmKGI9PT1hKXJldHVybiEwO2lmKG51bGw9PT1ifHxudWxsPT09YSlyZXR1cm4hMTtpZihiIT09YiYmYSE9PWEpcmV0dXJuITA7dmFyIGM9dHlwZW9mIGIsZDtpZihjPT10eXBlb2YgYSYmXCJvYmplY3RcIj09YylpZihPKGIpKXtpZighTyhhKSlyZXR1cm4hMTtpZigoYz1iLmxlbmd0aCk9PWEubGVuZ3RoKXtmb3IoZD0wO2Q8YztkKyspaWYoIXhhKGJbZF0sYVtkXSkpcmV0dXJuITE7cmV0dXJuITB9fWVsc2V7aWYoTmEoYikpcmV0dXJuIE5hKGEpJiZiLmdldFRpbWUoKT09YS5nZXRUaW1lKCk7aWYoZmIoYikmJmZiKGEpKXJldHVybiBiLnRvU3RyaW5nKCk9PWEudG9TdHJpbmcoKTtpZihiJiZiLiRldmFsQXN5bmMmJmIuJHdhdGNofHxhJiZhLiRldmFsQXN5bmMmJlxuYS4kd2F0Y2h8fEVhKGIpfHxFYShhKXx8TyhhKSlyZXR1cm4hMTtjPXt9O2ZvcihkIGluIGIpaWYoXCIkXCIhPT1kLmNoYXJBdCgwKSYmIVEoYltkXSkpe2lmKCF4YShiW2RdLGFbZF0pKXJldHVybiExO2NbZF09ITB9Zm9yKGQgaW4gYSlpZighYy5oYXNPd25Qcm9wZXJ0eShkKSYmXCIkXCIhPT1kLmNoYXJBdCgwKSYmYVtkXSE9PXMmJiFRKGFbZF0pKXJldHVybiExO3JldHVybiEwfXJldHVybiExfWZ1bmN0aW9uICRiKCl7cmV0dXJuIFYuc2VjdXJpdHlQb2xpY3kmJlYuc2VjdXJpdHlQb2xpY3kuaXNBY3RpdmV8fFYucXVlcnlTZWxlY3RvciYmISghVi5xdWVyeVNlbGVjdG9yKFwiW25nLWNzcF1cIikmJiFWLnF1ZXJ5U2VsZWN0b3IoXCJbZGF0YS1uZy1jc3BdXCIpKX1mdW5jdGlvbiBBYihiLGEpe3ZhciBjPTI8YXJndW1lbnRzLmxlbmd0aD95YS5jYWxsKGFyZ3VtZW50cywyKTpbXTtyZXR1cm4hUShhKXx8YSBpbnN0YW5jZW9mIFJlZ0V4cD9hOmMubGVuZ3RoP2Z1bmN0aW9uKCl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/XG5hLmFwcGx5KGIsYy5jb25jYXQoeWEuY2FsbChhcmd1bWVudHMsMCkpKTphLmFwcGx5KGIsYyl9OmZ1bmN0aW9uKCl7cmV0dXJuIGFyZ3VtZW50cy5sZW5ndGg/YS5hcHBseShiLGFyZ3VtZW50cyk6YS5jYWxsKGIpfX1mdW5jdGlvbiBWYyhiLGEpe3ZhciBjPWE7XCJzdHJpbmdcIj09PXR5cGVvZiBiJiZcIiRcIj09PWIuY2hhckF0KDApP2M9czpFYShhKT9jPVwiJFdJTkRPV1wiOmEmJlY9PT1hP2M9XCIkRE9DVU1FTlRcIjphJiYoYS4kZXZhbEFzeW5jJiZhLiR3YXRjaCkmJihjPVwiJFNDT1BFXCIpO3JldHVybiBjfWZ1bmN0aW9uIHJhKGIsYSl7cmV0dXJuXCJ1bmRlZmluZWRcIj09PXR5cGVvZiBiP3M6SlNPTi5zdHJpbmdpZnkoYixWYyxhP1wiICBcIjpudWxsKX1mdW5jdGlvbiBhYyhiKXtyZXR1cm4gQyhiKT9KU09OLnBhcnNlKGIpOmJ9ZnVuY3Rpb24gUmEoYil7XCJmdW5jdGlvblwiPT09dHlwZW9mIGI/Yj0hMDpiJiYwIT09Yi5sZW5ndGg/KGI9TChcIlwiK2IpLGI9IShcImZcIj09Ynx8XCIwXCI9PWJ8fFwiZmFsc2VcIj09XG5ifHxcIm5vXCI9PWJ8fFwiblwiPT1ifHxcIltdXCI9PWIpKTpiPSExO3JldHVybiBifWZ1bmN0aW9uIGdhKGIpe2I9dyhiKS5jbG9uZSgpO3RyeXtiLmVtcHR5KCl9Y2F0Y2goYSl7fXZhciBjPXcoXCI8ZGl2PlwiKS5hcHBlbmQoYikuaHRtbCgpO3RyeXtyZXR1cm4gMz09PWJbMF0ubm9kZVR5cGU/TChjKTpjLm1hdGNoKC9eKDxbXj5dKz4pLylbMV0ucmVwbGFjZSgvXjwoW1xcd1xcLV0rKS8sZnVuY3Rpb24oYSxiKXtyZXR1cm5cIjxcIitMKGIpfSl9Y2F0Y2goZCl7cmV0dXJuIEwoYyl9fWZ1bmN0aW9uIGJjKGIpe3RyeXtyZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KGIpfWNhdGNoKGEpe319ZnVuY3Rpb24gY2MoYil7dmFyIGE9e30sYyxkO3EoKGJ8fFwiXCIpLnNwbGl0KFwiJlwiKSxmdW5jdGlvbihiKXtiJiYoYz1iLnNwbGl0KFwiPVwiKSxkPWJjKGNbMF0pLEIoZCkmJihiPUIoY1sxXSk/YmMoY1sxXSk6ITAsYVtkXT9PKGFbZF0pP2FbZF0ucHVzaChiKTphW2RdPVthW2RdLGJdOmFbZF09YikpfSk7cmV0dXJuIGF9XG5mdW5jdGlvbiBCYihiKXt2YXIgYT1bXTtxKGIsZnVuY3Rpb24oYixkKXtPKGIpP3EoYixmdW5jdGlvbihiKXthLnB1c2goemEoZCwhMCkrKCEwPT09Yj9cIlwiOlwiPVwiK3phKGIsITApKSl9KTphLnB1c2goemEoZCwhMCkrKCEwPT09Yj9cIlwiOlwiPVwiK3phKGIsITApKSl9KTtyZXR1cm4gYS5sZW5ndGg/YS5qb2luKFwiJlwiKTpcIlwifWZ1bmN0aW9uIGdiKGIpe3JldHVybiB6YShiLCEwKS5yZXBsYWNlKC8lMjYvZ2ksXCImXCIpLnJlcGxhY2UoLyUzRC9naSxcIj1cIikucmVwbGFjZSgvJTJCL2dpLFwiK1wiKX1mdW5jdGlvbiB6YShiLGEpe3JldHVybiBlbmNvZGVVUklDb21wb25lbnQoYikucmVwbGFjZSgvJTQwL2dpLFwiQFwiKS5yZXBsYWNlKC8lM0EvZ2ksXCI6XCIpLnJlcGxhY2UoLyUyNC9nLFwiJFwiKS5yZXBsYWNlKC8lMkMvZ2ksXCIsXCIpLnJlcGxhY2UoLyUyMC9nLGE/XCIlMjBcIjpcIitcIil9ZnVuY3Rpb24gV2MoYixhKXtmdW5jdGlvbiBjKGEpe2EmJmQucHVzaChhKX12YXIgZD1bYl0sZSxnLGY9W1wibmc6YXBwXCIsXG5cIm5nLWFwcFwiLFwieC1uZy1hcHBcIixcImRhdGEtbmctYXBwXCJdLGs9L1xcc25nWzpcXC1dYXBwKDpcXHMqKFtcXHdcXGRfXSspOz8pP1xccy87cShmLGZ1bmN0aW9uKGEpe2ZbYV09ITA7YyhWLmdldEVsZW1lbnRCeUlkKGEpKTthPWEucmVwbGFjZShcIjpcIixcIlxcXFw6XCIpO2IucXVlcnlTZWxlY3RvckFsbCYmKHEoYi5xdWVyeVNlbGVjdG9yQWxsKFwiLlwiK2EpLGMpLHEoYi5xdWVyeVNlbGVjdG9yQWxsKFwiLlwiK2ErXCJcXFxcOlwiKSxjKSxxKGIucXVlcnlTZWxlY3RvckFsbChcIltcIithK1wiXVwiKSxjKSl9KTtxKGQsZnVuY3Rpb24oYSl7aWYoIWUpe3ZhciBiPWsuZXhlYyhcIiBcIithLmNsYXNzTmFtZStcIiBcIik7Yj8oZT1hLGc9KGJbMl18fFwiXCIpLnJlcGxhY2UoL1xccysvZyxcIixcIikpOnEoYS5hdHRyaWJ1dGVzLGZ1bmN0aW9uKGIpeyFlJiZmW2IubmFtZV0mJihlPWEsZz1iLnZhbHVlKX0pfX0pO2UmJmEoZSxnP1tnXTpbXSl9ZnVuY3Rpb24gZGMoYixhKXt2YXIgYz1mdW5jdGlvbigpe2I9dyhiKTtpZihiLmluamVjdG9yKCkpe3ZhciBjPVxuYlswXT09PVY/XCJkb2N1bWVudFwiOmdhKGIpO3Rocm93IFFhKFwiYnRzdHJwZFwiLGMpO31hPWF8fFtdO2EudW5zaGlmdChbXCIkcHJvdmlkZVwiLGZ1bmN0aW9uKGEpe2EudmFsdWUoXCIkcm9vdEVsZW1lbnRcIixiKX1dKTthLnVuc2hpZnQoXCJuZ1wiKTtjPWVjKGEpO2MuaW52b2tlKFtcIiRyb290U2NvcGVcIixcIiRyb290RWxlbWVudFwiLFwiJGNvbXBpbGVcIixcIiRpbmplY3RvclwiLFwiJGFuaW1hdGVcIixmdW5jdGlvbihhLGIsYyxkLGUpe2EuJGFwcGx5KGZ1bmN0aW9uKCl7Yi5kYXRhKFwiJGluamVjdG9yXCIsZCk7YyhiKShhKX0pfV0pO3JldHVybiBjfSxkPS9eTkdfREVGRVJfQk9PVFNUUkFQIS87aWYoVCYmIWQudGVzdChULm5hbWUpKXJldHVybiBjKCk7VC5uYW1lPVQubmFtZS5yZXBsYWNlKGQsXCJcIik7U2EucmVzdW1lQm9vdHN0cmFwPWZ1bmN0aW9uKGIpe3EoYixmdW5jdGlvbihiKXthLnB1c2goYil9KTtjKCl9fWZ1bmN0aW9uIGhiKGIsYSl7YT1hfHxcIl9cIjtyZXR1cm4gYi5yZXBsYWNlKFhjLGZ1bmN0aW9uKGIsXG5kKXtyZXR1cm4oZD9hOlwiXCIpK2IudG9Mb3dlckNhc2UoKX0pfWZ1bmN0aW9uIENiKGIsYSxjKXtpZighYil0aHJvdyBRYShcImFyZXFcIixhfHxcIj9cIixjfHxcInJlcXVpcmVkXCIpO3JldHVybiBifWZ1bmN0aW9uIFRhKGIsYSxjKXtjJiZPKGIpJiYoYj1iW2IubGVuZ3RoLTFdKTtDYihRKGIpLGEsXCJub3QgYSBmdW5jdGlvbiwgZ290IFwiKyhiJiZcIm9iamVjdFwiPT10eXBlb2YgYj9iLmNvbnN0cnVjdG9yLm5hbWV8fFwiT2JqZWN0XCI6dHlwZW9mIGIpKTtyZXR1cm4gYn1mdW5jdGlvbiBBYShiLGEpe2lmKFwiaGFzT3duUHJvcGVydHlcIj09PWIpdGhyb3cgUWEoXCJiYWRuYW1lXCIsYSk7fWZ1bmN0aW9uIGZjKGIsYSxjKXtpZighYSlyZXR1cm4gYjthPWEuc3BsaXQoXCIuXCIpO2Zvcih2YXIgZCxlPWIsZz1hLmxlbmd0aCxmPTA7ZjxnO2YrKylkPWFbZl0sYiYmKGI9KGU9YilbZF0pO3JldHVybiFjJiZRKGIpP0FiKGUsYik6Yn1mdW5jdGlvbiBEYihiKXt2YXIgYT1iWzBdO2I9YltiLmxlbmd0aC0xXTtpZihhPT09XG5iKXJldHVybiB3KGEpO3ZhciBjPVthXTtkb3thPWEubmV4dFNpYmxpbmc7aWYoIWEpYnJlYWs7Yy5wdXNoKGEpfXdoaWxlKGEhPT1iKTtyZXR1cm4gdyhjKX1mdW5jdGlvbiBZYyhiKXt2YXIgYT10KFwiJGluamVjdG9yXCIpLGM9dChcIm5nXCIpO2I9Yi5hbmd1bGFyfHwoYi5hbmd1bGFyPXt9KTtiLiQkbWluRXJyPWIuJCRtaW5FcnJ8fHQ7cmV0dXJuIGIubW9kdWxlfHwoYi5tb2R1bGU9ZnVuY3Rpb24oKXt2YXIgYj17fTtyZXR1cm4gZnVuY3Rpb24oZSxnLGYpe2lmKFwiaGFzT3duUHJvcGVydHlcIj09PWUpdGhyb3cgYyhcImJhZG5hbWVcIixcIm1vZHVsZVwiKTtnJiZiLmhhc093blByb3BlcnR5KGUpJiYoYltlXT1udWxsKTtyZXR1cm4gYltlXXx8KGJbZV09ZnVuY3Rpb24oKXtmdW5jdGlvbiBiKGEsZCxlKXtyZXR1cm4gZnVuY3Rpb24oKXtjW2V8fFwicHVzaFwiXShbYSxkLGFyZ3VtZW50c10pO3JldHVybiBufX1pZighZyl0aHJvdyBhKFwibm9tb2RcIixlKTt2YXIgYz1bXSxkPVtdLGw9YihcIiRpbmplY3RvclwiLFxuXCJpbnZva2VcIiksbj17X2ludm9rZVF1ZXVlOmMsX3J1bkJsb2NrczpkLHJlcXVpcmVzOmcsbmFtZTplLHByb3ZpZGVyOmIoXCIkcHJvdmlkZVwiLFwicHJvdmlkZXJcIiksZmFjdG9yeTpiKFwiJHByb3ZpZGVcIixcImZhY3RvcnlcIiksc2VydmljZTpiKFwiJHByb3ZpZGVcIixcInNlcnZpY2VcIiksdmFsdWU6YihcIiRwcm92aWRlXCIsXCJ2YWx1ZVwiKSxjb25zdGFudDpiKFwiJHByb3ZpZGVcIixcImNvbnN0YW50XCIsXCJ1bnNoaWZ0XCIpLGFuaW1hdGlvbjpiKFwiJGFuaW1hdGVQcm92aWRlclwiLFwicmVnaXN0ZXJcIiksZmlsdGVyOmIoXCIkZmlsdGVyUHJvdmlkZXJcIixcInJlZ2lzdGVyXCIpLGNvbnRyb2xsZXI6YihcIiRjb250cm9sbGVyUHJvdmlkZXJcIixcInJlZ2lzdGVyXCIpLGRpcmVjdGl2ZTpiKFwiJGNvbXBpbGVQcm92aWRlclwiLFwiZGlyZWN0aXZlXCIpLGNvbmZpZzpsLHJ1bjpmdW5jdGlvbihhKXtkLnB1c2goYSk7cmV0dXJuIHRoaXN9fTtmJiZsKGYpO3JldHVybiBufSgpKX19KCkpfWZ1bmN0aW9uIFpjKGIpe0ooYix7Ym9vdHN0cmFwOmRjLFxuY29weTpHYSxleHRlbmQ6SixlcXVhbHM6eGEsZWxlbWVudDp3LGZvckVhY2g6cSxpbmplY3RvcjplYyxub29wOnksYmluZDpBYix0b0pzb246cmEsZnJvbUpzb246YWMsaWRlbnRpdHk6RmEsaXNVbmRlZmluZWQ6RCxpc0RlZmluZWQ6Qixpc1N0cmluZzpDLGlzRnVuY3Rpb246USxpc09iamVjdDpVLGlzTnVtYmVyOnliLGlzRWxlbWVudDpUYyxpc0FycmF5Ok8sdmVyc2lvbjokYyxpc0RhdGU6TmEsbG93ZXJjYXNlOkwsdXBwZXJjYXNlOkhhLGNhbGxiYWNrczp7Y291bnRlcjowfSwkJG1pbkVycjp0LCQkY3NwOiRifSk7VWE9WWMoVCk7dHJ5e1VhKFwibmdMb2NhbGVcIil9Y2F0Y2goYSl7VWEoXCJuZ0xvY2FsZVwiLFtdKS5wcm92aWRlcihcIiRsb2NhbGVcIixhZCl9VWEoXCJuZ1wiLFtcIm5nTG9jYWxlXCJdLFtcIiRwcm92aWRlXCIsZnVuY3Rpb24oYSl7YS5wcm92aWRlcih7JCRzYW5pdGl6ZVVyaTpiZH0pO2EucHJvdmlkZXIoXCIkY29tcGlsZVwiLGdjKS5kaXJlY3RpdmUoe2E6Y2QsaW5wdXQ6aGMsdGV4dGFyZWE6aGMsXG5mb3JtOmRkLHNjcmlwdDplZCxzZWxlY3Q6ZmQsc3R5bGU6Z2Qsb3B0aW9uOmhkLG5nQmluZDppZCxuZ0JpbmRIdG1sOmpkLG5nQmluZFRlbXBsYXRlOmtkLG5nQ2xhc3M6bGQsbmdDbGFzc0V2ZW46bWQsbmdDbGFzc09kZDpuZCxuZ0Nsb2FrOm9kLG5nQ29udHJvbGxlcjpwZCxuZ0Zvcm06cWQsbmdIaWRlOnJkLG5nSWY6c2QsbmdJbmNsdWRlOnRkLG5nSW5pdDp1ZCxuZ05vbkJpbmRhYmxlOnZkLG5nUGx1cmFsaXplOndkLG5nUmVwZWF0OnhkLG5nU2hvdzp5ZCxuZ1N0eWxlOnpkLG5nU3dpdGNoOkFkLG5nU3dpdGNoV2hlbjpCZCxuZ1N3aXRjaERlZmF1bHQ6Q2QsbmdPcHRpb25zOkRkLG5nVHJhbnNjbHVkZTpFZCxuZ01vZGVsOkZkLG5nTGlzdDpHZCxuZ0NoYW5nZTpIZCxyZXF1aXJlZDppYyxuZ1JlcXVpcmVkOmljLG5nVmFsdWU6SWR9KS5kaXJlY3RpdmUoe25nSW5jbHVkZTpKZH0pLmRpcmVjdGl2ZShFYikuZGlyZWN0aXZlKGpjKTthLnByb3ZpZGVyKHskYW5jaG9yU2Nyb2xsOktkLFxuJGFuaW1hdGU6TGQsJGJyb3dzZXI6TWQsJGNhY2hlRmFjdG9yeTpOZCwkY29udHJvbGxlcjpPZCwkZG9jdW1lbnQ6UGQsJGV4Y2VwdGlvbkhhbmRsZXI6UWQsJGZpbHRlcjprYywkaW50ZXJwb2xhdGU6UmQsJGludGVydmFsOlNkLCRodHRwOlRkLCRodHRwQmFja2VuZDpVZCwkbG9jYXRpb246VmQsJGxvZzpXZCwkcGFyc2U6WGQsJHJvb3RTY29wZTpZZCwkcTpaZCwkc2NlOiRkLCRzY2VEZWxlZ2F0ZTphZSwkc25pZmZlcjpiZSwkdGVtcGxhdGVDYWNoZTpjZSwkdGltZW91dDpkZSwkd2luZG93OmVlLCQkckFGOmZlLCQkYXN5bmNDYWxsYmFjazpnZX0pfV0pfWZ1bmN0aW9uIFZhKGIpe3JldHVybiBiLnJlcGxhY2UoaGUsZnVuY3Rpb24oYSxiLGQsZSl7cmV0dXJuIGU/ZC50b1VwcGVyQ2FzZSgpOmR9KS5yZXBsYWNlKGllLFwiTW96JDFcIil9ZnVuY3Rpb24gRmIoYixhLGMsZCl7ZnVuY3Rpb24gZShiKXt2YXIgZT1jJiZiP1t0aGlzLmZpbHRlcihiKV06W3RoaXNdLG09YSxoLGwsbixwLHIsXG52O2lmKCFkfHxudWxsIT1iKWZvcig7ZS5sZW5ndGg7KWZvcihoPWUuc2hpZnQoKSxsPTAsbj1oLmxlbmd0aDtsPG47bCsrKWZvcihwPXcoaFtsXSksbT9wLnRyaWdnZXJIYW5kbGVyKFwiJGRlc3Ryb3lcIik6bT0hbSxyPTAscD0odj1wLmNoaWxkcmVuKCkpLmxlbmd0aDtyPHA7cisrKWUucHVzaChCYSh2W3JdKSk7cmV0dXJuIGcuYXBwbHkodGhpcyxhcmd1bWVudHMpfXZhciBnPUJhLmZuW2JdLGc9Zy4kb3JpZ2luYWx8fGc7ZS4kb3JpZ2luYWw9ZztCYS5mbltiXT1lfWZ1bmN0aW9uIFIoYil7aWYoYiBpbnN0YW5jZW9mIFIpcmV0dXJuIGI7QyhiKSYmKGI9YWEoYikpO2lmKCEodGhpcyBpbnN0YW5jZW9mIFIpKXtpZihDKGIpJiZcIjxcIiE9Yi5jaGFyQXQoMCkpdGhyb3cgR2IoXCJub3NlbFwiKTtyZXR1cm4gbmV3IFIoYil9aWYoQyhiKSl7dmFyIGE9YjtiPVY7dmFyIGM7aWYoYz1qZS5leGVjKGEpKWI9W2IuY3JlYXRlRWxlbWVudChjWzFdKV07ZWxzZXt2YXIgZD1iLGU7Yj1kLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcbmM9W107aWYoSGIudGVzdChhKSl7ZD1iLmFwcGVuZENoaWxkKGQuY3JlYXRlRWxlbWVudChcImRpdlwiKSk7ZT0oa2UuZXhlYyhhKXx8W1wiXCIsXCJcIl0pWzFdLnRvTG93ZXJDYXNlKCk7ZT1kYVtlXXx8ZGEuX2RlZmF1bHQ7ZC5pbm5lckhUTUw9XCI8ZGl2PiYjMTYwOzwvZGl2PlwiK2VbMV0rYS5yZXBsYWNlKGxlLFwiPCQxPjwvJDI+XCIpK2VbMl07ZC5yZW1vdmVDaGlsZChkLmZpcnN0Q2hpbGQpO2ZvcihhPWVbMF07YS0tOylkPWQubGFzdENoaWxkO2E9MDtmb3IoZT1kLmNoaWxkTm9kZXMubGVuZ3RoO2E8ZTsrK2EpYy5wdXNoKGQuY2hpbGROb2Rlc1thXSk7ZD1iLmZpcnN0Q2hpbGQ7ZC50ZXh0Q29udGVudD1cIlwifWVsc2UgYy5wdXNoKGQuY3JlYXRlVGV4dE5vZGUoYSkpO2IudGV4dENvbnRlbnQ9XCJcIjtiLmlubmVySFRNTD1cIlwiO2I9Y31JYih0aGlzLGIpO3coVi5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCkpLmFwcGVuZCh0aGlzKX1lbHNlIEliKHRoaXMsYil9ZnVuY3Rpb24gSmIoYil7cmV0dXJuIGIuY2xvbmVOb2RlKCEwKX1cbmZ1bmN0aW9uIElhKGIpe2xjKGIpO3ZhciBhPTA7Zm9yKGI9Yi5jaGlsZE5vZGVzfHxbXTthPGIubGVuZ3RoO2ErKylJYShiW2FdKX1mdW5jdGlvbiBtYyhiLGEsYyxkKXtpZihCKGQpKXRocm93IEdiKFwib2ZmYXJnc1wiKTt2YXIgZT1sYShiLFwiZXZlbnRzXCIpO2xhKGIsXCJoYW5kbGVcIikmJihEKGEpP3EoZSxmdW5jdGlvbihhLGMpe1dhKGIsYyxhKTtkZWxldGUgZVtjXX0pOnEoYS5zcGxpdChcIiBcIiksZnVuY3Rpb24oYSl7RChjKT8oV2EoYixhLGVbYV0pLGRlbGV0ZSBlW2FdKTpQYShlW2FdfHxbXSxjKX0pKX1mdW5jdGlvbiBsYyhiLGEpe3ZhciBjPWJbaWJdLGQ9WGFbY107ZCYmKGE/ZGVsZXRlIFhhW2NdLmRhdGFbYV06KGQuaGFuZGxlJiYoZC5ldmVudHMuJGRlc3Ryb3kmJmQuaGFuZGxlKHt9LFwiJGRlc3Ryb3lcIiksbWMoYikpLGRlbGV0ZSBYYVtjXSxiW2liXT1zKSl9ZnVuY3Rpb24gbGEoYixhLGMpe3ZhciBkPWJbaWJdLGQ9WGFbZHx8LTFdO2lmKEIoYykpZHx8KGJbaWJdPWQ9KyttZSxcbmQ9WGFbZF09e30pLGRbYV09YztlbHNlIHJldHVybiBkJiZkW2FdfWZ1bmN0aW9uIG5jKGIsYSxjKXt2YXIgZD1sYShiLFwiZGF0YVwiKSxlPUIoYyksZz0hZSYmQihhKSxmPWcmJiFVKGEpO2R8fGZ8fGxhKGIsXCJkYXRhXCIsZD17fSk7aWYoZSlkW2FdPWM7ZWxzZSBpZihnKXtpZihmKXJldHVybiBkJiZkW2FdO0ooZCxhKX1lbHNlIHJldHVybiBkfWZ1bmN0aW9uIEtiKGIsYSl7cmV0dXJuIGIuZ2V0QXR0cmlidXRlPy0xPChcIiBcIisoYi5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKXx8XCJcIikrXCIgXCIpLnJlcGxhY2UoL1tcXG5cXHRdL2csXCIgXCIpLmluZGV4T2YoXCIgXCIrYStcIiBcIik6ITF9ZnVuY3Rpb24gamIoYixhKXthJiZiLnNldEF0dHJpYnV0ZSYmcShhLnNwbGl0KFwiIFwiKSxmdW5jdGlvbihhKXtiLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsYWEoKFwiIFwiKyhiLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpfHxcIlwiKStcIiBcIikucmVwbGFjZSgvW1xcblxcdF0vZyxcIiBcIikucmVwbGFjZShcIiBcIithYShhKStcIiBcIixcIiBcIikpKX0pfVxuZnVuY3Rpb24ga2IoYixhKXtpZihhJiZiLnNldEF0dHJpYnV0ZSl7dmFyIGM9KFwiIFwiKyhiLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpfHxcIlwiKStcIiBcIikucmVwbGFjZSgvW1xcblxcdF0vZyxcIiBcIik7cShhLnNwbGl0KFwiIFwiKSxmdW5jdGlvbihhKXthPWFhKGEpOy0xPT09Yy5pbmRleE9mKFwiIFwiK2ErXCIgXCIpJiYoYys9YStcIiBcIil9KTtiLnNldEF0dHJpYnV0ZShcImNsYXNzXCIsYWEoYykpfX1mdW5jdGlvbiBJYihiLGEpe2lmKGEpe2E9YS5ub2RlTmFtZXx8IUIoYS5sZW5ndGgpfHxFYShhKT9bYV06YTtmb3IodmFyIGM9MDtjPGEubGVuZ3RoO2MrKyliLnB1c2goYVtjXSl9fWZ1bmN0aW9uIG9jKGIsYSl7cmV0dXJuIGxiKGIsXCIkXCIrKGF8fFwibmdDb250cm9sbGVyXCIpK1wiQ29udHJvbGxlclwiKX1mdW5jdGlvbiBsYihiLGEsYyl7Yj13KGIpOzk9PWJbMF0ubm9kZVR5cGUmJihiPWIuZmluZChcImh0bWxcIikpO2ZvcihhPU8oYSk/YTpbYV07Yi5sZW5ndGg7KXtmb3IodmFyIGQ9YlswXSxlPTAsZz1hLmxlbmd0aDtlPFxuZztlKyspaWYoKGM9Yi5kYXRhKGFbZV0pKSE9PXMpcmV0dXJuIGM7Yj13KGQucGFyZW50Tm9kZXx8MTE9PT1kLm5vZGVUeXBlJiZkLmhvc3QpfX1mdW5jdGlvbiBwYyhiKXtmb3IodmFyIGE9MCxjPWIuY2hpbGROb2RlczthPGMubGVuZ3RoO2ErKylJYShjW2FdKTtmb3IoO2IuZmlyc3RDaGlsZDspYi5yZW1vdmVDaGlsZChiLmZpcnN0Q2hpbGQpfWZ1bmN0aW9uIHFjKGIsYSl7dmFyIGM9bWJbYS50b0xvd2VyQ2FzZSgpXTtyZXR1cm4gYyYmcmNbYi5ub2RlTmFtZV0mJmN9ZnVuY3Rpb24gbmUoYixhKXt2YXIgYz1mdW5jdGlvbihjLGUpe2MucHJldmVudERlZmF1bHR8fChjLnByZXZlbnREZWZhdWx0PWZ1bmN0aW9uKCl7Yy5yZXR1cm5WYWx1ZT0hMX0pO2Muc3RvcFByb3BhZ2F0aW9ufHwoYy5zdG9wUHJvcGFnYXRpb249ZnVuY3Rpb24oKXtjLmNhbmNlbEJ1YmJsZT0hMH0pO2MudGFyZ2V0fHwoYy50YXJnZXQ9Yy5zcmNFbGVtZW50fHxWKTtpZihEKGMuZGVmYXVsdFByZXZlbnRlZCkpe3ZhciBnPVxuYy5wcmV2ZW50RGVmYXVsdDtjLnByZXZlbnREZWZhdWx0PWZ1bmN0aW9uKCl7Yy5kZWZhdWx0UHJldmVudGVkPSEwO2cuY2FsbChjKX07Yy5kZWZhdWx0UHJldmVudGVkPSExfWMuaXNEZWZhdWx0UHJldmVudGVkPWZ1bmN0aW9uKCl7cmV0dXJuIGMuZGVmYXVsdFByZXZlbnRlZHx8ITE9PT1jLnJldHVyblZhbHVlfTt2YXIgZj1rYShhW2V8fGMudHlwZV18fFtdKTtxKGYsZnVuY3Rpb24oYSl7YS5jYWxsKGIsYyl9KTs4Pj1TPyhjLnByZXZlbnREZWZhdWx0PW51bGwsYy5zdG9wUHJvcGFnYXRpb249bnVsbCxjLmlzRGVmYXVsdFByZXZlbnRlZD1udWxsKTooZGVsZXRlIGMucHJldmVudERlZmF1bHQsZGVsZXRlIGMuc3RvcFByb3BhZ2F0aW9uLGRlbGV0ZSBjLmlzRGVmYXVsdFByZXZlbnRlZCl9O2MuZWxlbT1iO3JldHVybiBjfWZ1bmN0aW9uIEphKGIpe3ZhciBhPXR5cGVvZiBiLGM7XCJvYmplY3RcIj09YSYmbnVsbCE9PWI/XCJmdW5jdGlvblwiPT10eXBlb2YoYz1iLiQkaGFzaEtleSk/Yz1cbmIuJCRoYXNoS2V5KCk6Yz09PXMmJihjPWIuJCRoYXNoS2V5PWViKCkpOmM9YjtyZXR1cm4gYStcIjpcIitjfWZ1bmN0aW9uIFlhKGIpe3EoYix0aGlzLnB1dCx0aGlzKX1mdW5jdGlvbiBzYyhiKXt2YXIgYSxjO1wiZnVuY3Rpb25cIj09dHlwZW9mIGI/KGE9Yi4kaW5qZWN0KXx8KGE9W10sYi5sZW5ndGgmJihjPWIudG9TdHJpbmcoKS5yZXBsYWNlKG9lLFwiXCIpLGM9Yy5tYXRjaChwZSkscShjWzFdLnNwbGl0KHFlKSxmdW5jdGlvbihiKXtiLnJlcGxhY2UocmUsZnVuY3Rpb24oYixjLGQpe2EucHVzaChkKX0pfSkpLGIuJGluamVjdD1hKTpPKGIpPyhjPWIubGVuZ3RoLTEsVGEoYltjXSxcImZuXCIpLGE9Yi5zbGljZSgwLGMpKTpUYShiLFwiZm5cIiwhMCk7cmV0dXJuIGF9ZnVuY3Rpb24gZWMoYil7ZnVuY3Rpb24gYShhKXtyZXR1cm4gZnVuY3Rpb24oYixjKXtpZihVKGIpKXEoYixYYihhKSk7ZWxzZSByZXR1cm4gYShiLGMpfX1mdW5jdGlvbiBjKGEsYil7QWEoYSxcInNlcnZpY2VcIik7aWYoUShiKXx8XG5PKGIpKWI9bi5pbnN0YW50aWF0ZShiKTtpZighYi4kZ2V0KXRocm93IFphKFwicGdldFwiLGEpO3JldHVybiBsW2Era109Yn1mdW5jdGlvbiBkKGEsYil7cmV0dXJuIGMoYSx7JGdldDpifSl9ZnVuY3Rpb24gZShhKXt2YXIgYj1bXSxjLGQsZyxrO3EoYSxmdW5jdGlvbihhKXtpZighaC5nZXQoYSkpe2gucHV0KGEsITApO3RyeXtpZihDKGEpKWZvcihjPVVhKGEpLGI9Yi5jb25jYXQoZShjLnJlcXVpcmVzKSkuY29uY2F0KGMuX3J1bkJsb2NrcyksZD1jLl9pbnZva2VRdWV1ZSxnPTAsaz1kLmxlbmd0aDtnPGs7ZysrKXt2YXIgZj1kW2ddLG09bi5nZXQoZlswXSk7bVtmWzFdXS5hcHBseShtLGZbMl0pfWVsc2UgUShhKT9iLnB1c2gobi5pbnZva2UoYSkpOk8oYSk/Yi5wdXNoKG4uaW52b2tlKGEpKTpUYShhLFwibW9kdWxlXCIpfWNhdGNoKGwpe3Rocm93IE8oYSkmJihhPWFbYS5sZW5ndGgtMV0pLGwubWVzc2FnZSYmKGwuc3RhY2smJi0xPT1sLnN0YWNrLmluZGV4T2YobC5tZXNzYWdlKSkmJlxuKGw9bC5tZXNzYWdlK1wiXFxuXCIrbC5zdGFjayksWmEoXCJtb2R1bGVyclwiLGEsbC5zdGFja3x8bC5tZXNzYWdlfHxsKTt9fX0pO3JldHVybiBifWZ1bmN0aW9uIGcoYSxiKXtmdW5jdGlvbiBjKGQpe2lmKGEuaGFzT3duUHJvcGVydHkoZCkpe2lmKGFbZF09PT1mKXRocm93IFphKFwiY2RlcFwiLGQrXCIgPC0gXCIrbS5qb2luKFwiIDwtIFwiKSk7cmV0dXJuIGFbZF19dHJ5e3JldHVybiBtLnVuc2hpZnQoZCksYVtkXT1mLGFbZF09YihkKX1jYXRjaChlKXt0aHJvdyBhW2RdPT09ZiYmZGVsZXRlIGFbZF0sZTt9ZmluYWxseXttLnNoaWZ0KCl9fWZ1bmN0aW9uIGQoYSxiLGUpe3ZhciBnPVtdLGs9c2MoYSksZixtLGg7bT0wO2ZvcihmPWsubGVuZ3RoO208ZjttKyspe2g9a1ttXTtpZihcInN0cmluZ1wiIT09dHlwZW9mIGgpdGhyb3cgWmEoXCJpdGtuXCIsaCk7Zy5wdXNoKGUmJmUuaGFzT3duUHJvcGVydHkoaCk/ZVtoXTpjKGgpKX1hLiRpbmplY3R8fChhPWFbZl0pO3JldHVybiBhLmFwcGx5KGIsZyl9cmV0dXJue2ludm9rZTpkLFxuaW5zdGFudGlhdGU6ZnVuY3Rpb24oYSxiKXt2YXIgYz1mdW5jdGlvbigpe30sZTtjLnByb3RvdHlwZT0oTyhhKT9hW2EubGVuZ3RoLTFdOmEpLnByb3RvdHlwZTtjPW5ldyBjO2U9ZChhLGMsYik7cmV0dXJuIFUoZSl8fFEoZSk/ZTpjfSxnZXQ6Yyxhbm5vdGF0ZTpzYyxoYXM6ZnVuY3Rpb24oYil7cmV0dXJuIGwuaGFzT3duUHJvcGVydHkoYitrKXx8YS5oYXNPd25Qcm9wZXJ0eShiKX19fXZhciBmPXt9LGs9XCJQcm92aWRlclwiLG09W10saD1uZXcgWWEsbD17JHByb3ZpZGU6e3Byb3ZpZGVyOmEoYyksZmFjdG9yeTphKGQpLHNlcnZpY2U6YShmdW5jdGlvbihhLGIpe3JldHVybiBkKGEsW1wiJGluamVjdG9yXCIsZnVuY3Rpb24oYSl7cmV0dXJuIGEuaW5zdGFudGlhdGUoYil9XSl9KSx2YWx1ZTphKGZ1bmN0aW9uKGEsYil7cmV0dXJuIGQoYSwkKGIpKX0pLGNvbnN0YW50OmEoZnVuY3Rpb24oYSxiKXtBYShhLFwiY29uc3RhbnRcIik7bFthXT1iO3BbYV09Yn0pLGRlY29yYXRvcjpmdW5jdGlvbihhLFxuYil7dmFyIGM9bi5nZXQoYStrKSxkPWMuJGdldDtjLiRnZXQ9ZnVuY3Rpb24oKXt2YXIgYT1yLmludm9rZShkLGMpO3JldHVybiByLmludm9rZShiLG51bGwseyRkZWxlZ2F0ZTphfSl9fX19LG49bC4kaW5qZWN0b3I9ZyhsLGZ1bmN0aW9uKCl7dGhyb3cgWmEoXCJ1bnByXCIsbS5qb2luKFwiIDwtIFwiKSk7fSkscD17fSxyPXAuJGluamVjdG9yPWcocCxmdW5jdGlvbihhKXthPW4uZ2V0KGErayk7cmV0dXJuIHIuaW52b2tlKGEuJGdldCxhKX0pO3EoZShiKSxmdW5jdGlvbihhKXtyLmludm9rZShhfHx5KX0pO3JldHVybiByfWZ1bmN0aW9uIEtkKCl7dmFyIGI9ITA7dGhpcy5kaXNhYmxlQXV0b1Njcm9sbGluZz1mdW5jdGlvbigpe2I9ITF9O3RoaXMuJGdldD1bXCIkd2luZG93XCIsXCIkbG9jYXRpb25cIixcIiRyb290U2NvcGVcIixmdW5jdGlvbihhLGMsZCl7ZnVuY3Rpb24gZShhKXt2YXIgYj1udWxsO3EoYSxmdW5jdGlvbihhKXtifHxcImFcIiE9PUwoYS5ub2RlTmFtZSl8fChiPWEpfSk7cmV0dXJuIGJ9XG5mdW5jdGlvbiBnKCl7dmFyIGI9Yy5oYXNoKCksZDtiPyhkPWYuZ2V0RWxlbWVudEJ5SWQoYikpP2Quc2Nyb2xsSW50b1ZpZXcoKTooZD1lKGYuZ2V0RWxlbWVudHNCeU5hbWUoYikpKT9kLnNjcm9sbEludG9WaWV3KCk6XCJ0b3BcIj09PWImJmEuc2Nyb2xsVG8oMCwwKTphLnNjcm9sbFRvKDAsMCl9dmFyIGY9YS5kb2N1bWVudDtiJiZkLiR3YXRjaChmdW5jdGlvbigpe3JldHVybiBjLmhhc2goKX0sZnVuY3Rpb24oKXtkLiRldmFsQXN5bmMoZyl9KTtyZXR1cm4gZ31dfWZ1bmN0aW9uIGdlKCl7dGhpcy4kZ2V0PVtcIiQkckFGXCIsXCIkdGltZW91dFwiLGZ1bmN0aW9uKGIsYSl7cmV0dXJuIGIuc3VwcG9ydGVkP2Z1bmN0aW9uKGEpe3JldHVybiBiKGEpfTpmdW5jdGlvbihiKXtyZXR1cm4gYShiLDAsITEpfX1dfWZ1bmN0aW9uIHNlKGIsYSxjLGQpe2Z1bmN0aW9uIGUoYSl7dHJ5e2EuYXBwbHkobnVsbCx5YS5jYWxsKGFyZ3VtZW50cywxKSl9ZmluYWxseXtpZih2LS0sMD09PXYpZm9yKDtJLmxlbmd0aDspdHJ5e0kucG9wKCkoKX1jYXRjaChiKXtjLmVycm9yKGIpfX19XG5mdW5jdGlvbiBnKGEsYil7KGZ1bmN0aW9uIGJhKCl7cSh4LGZ1bmN0aW9uKGEpe2EoKX0pO3U9YihiYSxhKX0pKCl9ZnVuY3Rpb24gZigpe3o9bnVsbDtNIT1rLnVybCgpJiYoTT1rLnVybCgpLHEoaGEsZnVuY3Rpb24oYSl7YShrLnVybCgpKX0pKX12YXIgaz10aGlzLG09YVswXSxoPWIubG9jYXRpb24sbD1iLmhpc3Rvcnksbj1iLnNldFRpbWVvdXQscD1iLmNsZWFyVGltZW91dCxyPXt9O2suaXNNb2NrPSExO3ZhciB2PTAsST1bXTtrLiQkY29tcGxldGVPdXRzdGFuZGluZ1JlcXVlc3Q9ZTtrLiQkaW5jT3V0c3RhbmRpbmdSZXF1ZXN0Q291bnQ9ZnVuY3Rpb24oKXt2Kyt9O2subm90aWZ5V2hlbk5vT3V0c3RhbmRpbmdSZXF1ZXN0cz1mdW5jdGlvbihhKXtxKHgsZnVuY3Rpb24oYSl7YSgpfSk7MD09PXY/YSgpOkkucHVzaChhKX07dmFyIHg9W10sdTtrLmFkZFBvbGxGbj1mdW5jdGlvbihhKXtEKHUpJiZnKDEwMCxuKTt4LnB1c2goYSk7cmV0dXJuIGF9O3ZhciBNPWguaHJlZixGPWEuZmluZChcImJhc2VcIiksXG56PW51bGw7ay51cmw9ZnVuY3Rpb24oYSxjKXtoIT09Yi5sb2NhdGlvbiYmKGg9Yi5sb2NhdGlvbik7bCE9PWIuaGlzdG9yeSYmKGw9Yi5oaXN0b3J5KTtpZihhKXtpZihNIT1hKXJldHVybiBNPWEsZC5oaXN0b3J5P2M/bC5yZXBsYWNlU3RhdGUobnVsbCxcIlwiLGEpOihsLnB1c2hTdGF0ZShudWxsLFwiXCIsYSksRi5hdHRyKFwiaHJlZlwiLEYuYXR0cihcImhyZWZcIikpKTooej1hLGM/aC5yZXBsYWNlKGEpOmguaHJlZj1hKSxrfWVsc2UgcmV0dXJuIHp8fGguaHJlZi5yZXBsYWNlKC8lMjcvZyxcIidcIil9O3ZhciBoYT1bXSxQPSExO2sub25VcmxDaGFuZ2U9ZnVuY3Rpb24oYSl7aWYoIVApe2lmKGQuaGlzdG9yeSl3KGIpLm9uKFwicG9wc3RhdGVcIixmKTtpZihkLmhhc2hjaGFuZ2UpdyhiKS5vbihcImhhc2hjaGFuZ2VcIixmKTtlbHNlIGsuYWRkUG9sbEZuKGYpO1A9ITB9aGEucHVzaChhKTtyZXR1cm4gYX07ay5iYXNlSHJlZj1mdW5jdGlvbigpe3ZhciBhPUYuYXR0cihcImhyZWZcIik7cmV0dXJuIGE/XG5hLnJlcGxhY2UoL14oaHR0cHM/XFw6KT9cXC9cXC9bXlxcL10qLyxcIlwiKTpcIlwifTt2YXIgTj17fSxjYT1cIlwiLEU9ay5iYXNlSHJlZigpO2suY29va2llcz1mdW5jdGlvbihhLGIpe3ZhciBkLGUsZyxrO2lmKGEpYj09PXM/bS5jb29raWU9ZXNjYXBlKGEpK1wiPTtwYXRoPVwiK0UrXCI7ZXhwaXJlcz1UaHUsIDAxIEphbiAxOTcwIDAwOjAwOjAwIEdNVFwiOkMoYikmJihkPShtLmNvb2tpZT1lc2NhcGUoYSkrXCI9XCIrZXNjYXBlKGIpK1wiO3BhdGg9XCIrRSkubGVuZ3RoKzEsNDA5NjxkJiZjLndhcm4oXCJDb29raWUgJ1wiK2ErXCInIHBvc3NpYmx5IG5vdCBzZXQgb3Igb3ZlcmZsb3dlZCBiZWNhdXNlIGl0IHdhcyB0b28gbGFyZ2UgKFwiK2QrXCIgPiA0MDk2IGJ5dGVzKSFcIikpO2Vsc2V7aWYobS5jb29raWUhPT1jYSlmb3IoY2E9bS5jb29raWUsZD1jYS5zcGxpdChcIjsgXCIpLE49e30sZz0wO2c8ZC5sZW5ndGg7ZysrKWU9ZFtnXSxrPWUuaW5kZXhPZihcIj1cIiksMDxrJiYoYT11bmVzY2FwZShlLnN1YnN0cmluZygwLFxuaykpLE5bYV09PT1zJiYoTlthXT11bmVzY2FwZShlLnN1YnN0cmluZyhrKzEpKSkpO3JldHVybiBOfX07ay5kZWZlcj1mdW5jdGlvbihhLGIpe3ZhciBjO3YrKztjPW4oZnVuY3Rpb24oKXtkZWxldGUgcltjXTtlKGEpfSxifHwwKTtyW2NdPSEwO3JldHVybiBjfTtrLmRlZmVyLmNhbmNlbD1mdW5jdGlvbihhKXtyZXR1cm4gclthXT8oZGVsZXRlIHJbYV0scChhKSxlKHkpLCEwKTohMX19ZnVuY3Rpb24gTWQoKXt0aGlzLiRnZXQ9W1wiJHdpbmRvd1wiLFwiJGxvZ1wiLFwiJHNuaWZmZXJcIixcIiRkb2N1bWVudFwiLGZ1bmN0aW9uKGIsYSxjLGQpe3JldHVybiBuZXcgc2UoYixkLGEsYyl9XX1mdW5jdGlvbiBOZCgpe3RoaXMuJGdldD1mdW5jdGlvbigpe2Z1bmN0aW9uIGIoYixkKXtmdW5jdGlvbiBlKGEpe2EhPW4mJihwP3A9PWEmJihwPWEubik6cD1hLGcoYS5uLGEucCksZyhhLG4pLG49YSxuLm49bnVsbCl9ZnVuY3Rpb24gZyhhLGIpe2EhPWImJihhJiYoYS5wPWIpLGImJihiLm49YSkpfWlmKGIgaW5cbmEpdGhyb3cgdChcIiRjYWNoZUZhY3RvcnlcIikoXCJpaWRcIixiKTt2YXIgZj0wLGs9Sih7fSxkLHtpZDpifSksbT17fSxoPWQmJmQuY2FwYWNpdHl8fE51bWJlci5NQVhfVkFMVUUsbD17fSxuPW51bGwscD1udWxsO3JldHVybiBhW2JdPXtwdXQ6ZnVuY3Rpb24oYSxiKXtpZihoPE51bWJlci5NQVhfVkFMVUUpe3ZhciBjPWxbYV18fChsW2FdPXtrZXk6YX0pO2UoYyl9aWYoIUQoYikpcmV0dXJuIGEgaW4gbXx8ZisrLG1bYV09YixmPmgmJnRoaXMucmVtb3ZlKHAua2V5KSxifSxnZXQ6ZnVuY3Rpb24oYSl7aWYoaDxOdW1iZXIuTUFYX1ZBTFVFKXt2YXIgYj1sW2FdO2lmKCFiKXJldHVybjtlKGIpfXJldHVybiBtW2FdfSxyZW1vdmU6ZnVuY3Rpb24oYSl7aWYoaDxOdW1iZXIuTUFYX1ZBTFVFKXt2YXIgYj1sW2FdO2lmKCFiKXJldHVybjtiPT1uJiYobj1iLnApO2I9PXAmJihwPWIubik7ZyhiLm4sYi5wKTtkZWxldGUgbFthXX1kZWxldGUgbVthXTtmLS19LHJlbW92ZUFsbDpmdW5jdGlvbigpe209XG57fTtmPTA7bD17fTtuPXA9bnVsbH0sZGVzdHJveTpmdW5jdGlvbigpe2w9az1tPW51bGw7ZGVsZXRlIGFbYl19LGluZm86ZnVuY3Rpb24oKXtyZXR1cm4gSih7fSxrLHtzaXplOmZ9KX19fXZhciBhPXt9O2IuaW5mbz1mdW5jdGlvbigpe3ZhciBiPXt9O3EoYSxmdW5jdGlvbihhLGUpe2JbZV09YS5pbmZvKCl9KTtyZXR1cm4gYn07Yi5nZXQ9ZnVuY3Rpb24oYil7cmV0dXJuIGFbYl19O3JldHVybiBifX1mdW5jdGlvbiBjZSgpe3RoaXMuJGdldD1bXCIkY2FjaGVGYWN0b3J5XCIsZnVuY3Rpb24oYil7cmV0dXJuIGIoXCJ0ZW1wbGF0ZXNcIil9XX1mdW5jdGlvbiBnYyhiLGEpe3ZhciBjPXt9LGQ9XCJEaXJlY3RpdmVcIixlPS9eXFxzKmRpcmVjdGl2ZVxcOlxccyooW1xcZFxcd19cXC1dKylcXHMrKC4qKSQvLGc9LygoW1xcZFxcd19cXC1dKykoPzpcXDooW147XSspKT87PykvLGY9L14ob25bYS16XSt8Zm9ybWFjdGlvbikkLzt0aGlzLmRpcmVjdGl2ZT1mdW5jdGlvbiBtKGEsZSl7QWEoYSxcImRpcmVjdGl2ZVwiKTtDKGEpP1xuKENiKGUsXCJkaXJlY3RpdmVGYWN0b3J5XCIpLGMuaGFzT3duUHJvcGVydHkoYSl8fChjW2FdPVtdLGIuZmFjdG9yeShhK2QsW1wiJGluamVjdG9yXCIsXCIkZXhjZXB0aW9uSGFuZGxlclwiLGZ1bmN0aW9uKGIsZCl7dmFyIGU9W107cShjW2FdLGZ1bmN0aW9uKGMsZyl7dHJ5e3ZhciBmPWIuaW52b2tlKGMpO1EoZik/Zj17Y29tcGlsZTokKGYpfTohZi5jb21waWxlJiZmLmxpbmsmJihmLmNvbXBpbGU9JChmLmxpbmspKTtmLnByaW9yaXR5PWYucHJpb3JpdHl8fDA7Zi5pbmRleD1nO2YubmFtZT1mLm5hbWV8fGE7Zi5yZXF1aXJlPWYucmVxdWlyZXx8Zi5jb250cm9sbGVyJiZmLm5hbWU7Zi5yZXN0cmljdD1mLnJlc3RyaWN0fHxcIkFcIjtlLnB1c2goZil9Y2F0Y2gobSl7ZChtKX19KTtyZXR1cm4gZX1dKSksY1thXS5wdXNoKGUpKTpxKGEsWGIobSkpO3JldHVybiB0aGlzfTt0aGlzLmFIcmVmU2FuaXRpemF0aW9uV2hpdGVsaXN0PWZ1bmN0aW9uKGIpe3JldHVybiBCKGIpPyhhLmFIcmVmU2FuaXRpemF0aW9uV2hpdGVsaXN0KGIpLFxudGhpcyk6YS5hSHJlZlNhbml0aXphdGlvbldoaXRlbGlzdCgpfTt0aGlzLmltZ1NyY1Nhbml0aXphdGlvbldoaXRlbGlzdD1mdW5jdGlvbihiKXtyZXR1cm4gQihiKT8oYS5pbWdTcmNTYW5pdGl6YXRpb25XaGl0ZWxpc3QoYiksdGhpcyk6YS5pbWdTcmNTYW5pdGl6YXRpb25XaGl0ZWxpc3QoKX07dGhpcy4kZ2V0PVtcIiRpbmplY3RvclwiLFwiJGludGVycG9sYXRlXCIsXCIkZXhjZXB0aW9uSGFuZGxlclwiLFwiJGh0dHBcIixcIiR0ZW1wbGF0ZUNhY2hlXCIsXCIkcGFyc2VcIixcIiRjb250cm9sbGVyXCIsXCIkcm9vdFNjb3BlXCIsXCIkZG9jdW1lbnRcIixcIiRzY2VcIixcIiRhbmltYXRlXCIsXCIkJHNhbml0aXplVXJpXCIsZnVuY3Rpb24oYSxiLGwsbixwLHIsdixJLHgsdSxNLEYpe2Z1bmN0aW9uIHooYSxiLGMsZCxlKXthIGluc3RhbmNlb2Ygd3x8KGE9dyhhKSk7cShhLGZ1bmN0aW9uKGIsYyl7Mz09Yi5ub2RlVHlwZSYmYi5ub2RlVmFsdWUubWF0Y2goL1xcUysvKSYmKGFbY109dyhiKS53cmFwKFwiPHNwYW4+PC9zcGFuPlwiKS5wYXJlbnQoKVswXSl9KTtcbnZhciBnPVAoYSxiLGEsYyxkLGUpO2hhKGEsXCJuZy1zY29wZVwiKTtyZXR1cm4gZnVuY3Rpb24oYixjLGQsZSl7Q2IoYixcInNjb3BlXCIpO3ZhciBmPWM/S2EuY2xvbmUuY2FsbChhKTphO3EoZCxmdW5jdGlvbihhLGIpe2YuZGF0YShcIiRcIitiK1wiQ29udHJvbGxlclwiLGEpfSk7ZD0wO2Zvcih2YXIgbT1mLmxlbmd0aDtkPG07ZCsrKXt2YXIgaD1mW2RdLm5vZGVUeXBlOzEhPT1oJiY5IT09aHx8Zi5lcShkKS5kYXRhKFwiJHNjb3BlXCIsYil9YyYmYyhmLGIpO2cmJmcoYixmLGYsZSk7cmV0dXJuIGZ9fWZ1bmN0aW9uIGhhKGEsYil7dHJ5e2EuYWRkQ2xhc3MoYil9Y2F0Y2goYyl7fX1mdW5jdGlvbiBQKGEsYixjLGQsZSxnKXtmdW5jdGlvbiBmKGEsYyxkLGUpe3ZhciBnLGgsbCxyLG4scCx2O2c9Yy5sZW5ndGg7dmFyIEs9QXJyYXkoZyk7Zm9yKG49MDtuPGc7bisrKUtbbl09Y1tuXTt2PW49MDtmb3IocD1tLmxlbmd0aDtuPHA7disrKWg9S1t2XSxjPW1bbisrXSxnPW1bbisrXSxsPXcoaCksYz9cbihjLnNjb3BlPyhyPWEuJG5ldygpLGwuZGF0YShcIiRzY29wZVwiLHIpKTpyPWEsbD1jLnRyYW5zY2x1ZGVPblRoaXNFbGVtZW50P04oYSxjLnRyYW5zY2x1ZGUsZSk6IWMudGVtcGxhdGVPblRoaXNFbGVtZW50JiZlP2U6IWUmJmI/TihhLGIpOm51bGwsYyhnLHIsaCxkLGwpKTpnJiZnKGEsaC5jaGlsZE5vZGVzLHMsZSl9Zm9yKHZhciBtPVtdLGgsbCxyLG4scD0wO3A8YS5sZW5ndGg7cCsrKWg9bmV3IExiLGw9Y2EoYVtwXSxbXSxoLDA9PT1wP2Q6cyxlKSwoZz1sLmxlbmd0aD9IKGwsYVtwXSxoLGIsYyxudWxsLFtdLFtdLGcpOm51bGwpJiZnLnNjb3BlJiZoYSh3KGFbcF0pLFwibmctc2NvcGVcIiksaD1nJiZnLnRlcm1pbmFsfHwhKHI9YVtwXS5jaGlsZE5vZGVzKXx8IXIubGVuZ3RoP251bGw6UChyLGc/KGcudHJhbnNjbHVkZU9uVGhpc0VsZW1lbnR8fCFnLnRlbXBsYXRlT25UaGlzRWxlbWVudCkmJmcudHJhbnNjbHVkZTpiKSxtLnB1c2goZyxoKSxuPW58fGd8fGgsZz1udWxsO3JldHVybiBuP1xuZjpudWxsfWZ1bmN0aW9uIE4oYSxiLGMpe3JldHVybiBmdW5jdGlvbihkLGUsZyl7dmFyIGY9ITE7ZHx8KGQ9YS4kbmV3KCksZj1kLiQkdHJhbnNjbHVkZWQ9ITApO2U9YihkLGUsZyxjKTtpZihmKWUub24oXCIkZGVzdHJveVwiLGZ1bmN0aW9uKCl7ZC4kZGVzdHJveSgpfSk7cmV0dXJuIGV9fWZ1bmN0aW9uIGNhKGEsYixjLGQsZil7dmFyIG09Yy4kYXR0cixoO3N3aXRjaChhLm5vZGVUeXBlKXtjYXNlIDE6YmEoYixtYShMYShhKS50b0xvd2VyQ2FzZSgpKSxcIkVcIixkLGYpO3ZhciBsLHIsbjtoPWEuYXR0cmlidXRlcztmb3IodmFyIHA9MCx2PWgmJmgubGVuZ3RoO3A8djtwKyspe3ZhciB4PSExLEk9ITE7bD1oW3BdO2lmKCFTfHw4PD1TfHxsLnNwZWNpZmllZCl7cj1sLm5hbWU7bj1tYShyKTtXLnRlc3QobikmJihyPWhiKG4uc3Vic3RyKDYpLFwiLVwiKSk7dmFyIE09bi5yZXBsYWNlKC8oU3RhcnR8RW5kKSQvLFwiXCIpO249PT1NK1wiU3RhcnRcIiYmKHg9cixJPXIuc3Vic3RyKDAsci5sZW5ndGgtXG41KStcImVuZFwiLHI9ci5zdWJzdHIoMCxyLmxlbmd0aC02KSk7bj1tYShyLnRvTG93ZXJDYXNlKCkpO21bbl09cjtjW25dPWw9YWEobC52YWx1ZSk7cWMoYSxuKSYmKGNbbl09ITApO1IoYSxiLGwsbik7YmEoYixuLFwiQVwiLGQsZix4LEkpfX1hPWEuY2xhc3NOYW1lO2lmKEMoYSkmJlwiXCIhPT1hKWZvcig7aD1nLmV4ZWMoYSk7KW49bWEoaFsyXSksYmEoYixuLFwiQ1wiLGQsZikmJihjW25dPWFhKGhbM10pKSxhPWEuc3Vic3RyKGguaW5kZXgraFswXS5sZW5ndGgpO2JyZWFrO2Nhc2UgMzp0KGIsYS5ub2RlVmFsdWUpO2JyZWFrO2Nhc2UgODp0cnl7aWYoaD1lLmV4ZWMoYS5ub2RlVmFsdWUpKW49bWEoaFsxXSksYmEoYixuLFwiTVwiLGQsZikmJihjW25dPWFhKGhbMl0pKX1jYXRjaCh1KXt9fWIuc29ydChEKTtyZXR1cm4gYn1mdW5jdGlvbiBFKGEsYixjKXt2YXIgZD1bXSxlPTA7aWYoYiYmYS5oYXNBdHRyaWJ1dGUmJmEuaGFzQXR0cmlidXRlKGIpKXtkb3tpZighYSl0aHJvdyBpYShcInV0ZXJkaXJcIixcbmIsYyk7MT09YS5ub2RlVHlwZSYmKGEuaGFzQXR0cmlidXRlKGIpJiZlKyssYS5oYXNBdHRyaWJ1dGUoYykmJmUtLSk7ZC5wdXNoKGEpO2E9YS5uZXh0U2libGluZ313aGlsZSgwPGUpfWVsc2UgZC5wdXNoKGEpO3JldHVybiB3KGQpfWZ1bmN0aW9uIEEoYSxiLGMpe3JldHVybiBmdW5jdGlvbihkLGUsZyxmLGgpe2U9RShlWzBdLGIsYyk7cmV0dXJuIGEoZCxlLGcsZixoKX19ZnVuY3Rpb24gSChhLGMsZCxlLGcsZixtLG4scCl7ZnVuY3Rpb24geChhLGIsYyxkKXtpZihhKXtjJiYoYT1BKGEsYyxkKSk7YS5yZXF1aXJlPUcucmVxdWlyZTthLmRpcmVjdGl2ZU5hbWU9bmE7aWYoTj09PUd8fEcuJCRpc29sYXRlU2NvcGUpYT11YyhhLHtpc29sYXRlU2NvcGU6ITB9KTttLnB1c2goYSl9aWYoYil7YyYmKGI9QShiLGMsZCkpO2IucmVxdWlyZT1HLnJlcXVpcmU7Yi5kaXJlY3RpdmVOYW1lPW5hO2lmKE49PT1HfHxHLiQkaXNvbGF0ZVNjb3BlKWI9dWMoYix7aXNvbGF0ZVNjb3BlOiEwfSk7bi5wdXNoKGIpfX1cbmZ1bmN0aW9uIEkoYSxiLGMsZCl7dmFyIGUsZz1cImRhdGFcIixmPSExO2lmKEMoYikpe2Zvcig7XCJeXCI9PShlPWIuY2hhckF0KDApKXx8XCI/XCI9PWU7KWI9Yi5zdWJzdHIoMSksXCJeXCI9PWUmJihnPVwiaW5oZXJpdGVkRGF0YVwiKSxmPWZ8fFwiP1wiPT1lO2U9bnVsbDtkJiZcImRhdGFcIj09PWcmJihlPWRbYl0pO2U9ZXx8Y1tnXShcIiRcIitiK1wiQ29udHJvbGxlclwiKTtpZighZSYmIWYpdGhyb3cgaWEoXCJjdHJlcVwiLGIsYSk7fWVsc2UgTyhiKSYmKGU9W10scShiLGZ1bmN0aW9uKGIpe2UucHVzaChJKGEsYixjLGQpKX0pKTtyZXR1cm4gZX1mdW5jdGlvbiBNKGEsZSxnLGYscCl7ZnVuY3Rpb24geChhLGIpe3ZhciBjOzI+YXJndW1lbnRzLmxlbmd0aCYmKGI9YSxhPXMpO0NhJiYoYz1jYSk7cmV0dXJuIHAoYSxiLGMpfXZhciB1LEsseixGLEEsRSxjYT17fSxuYjt1PWM9PT1nP2Q6a2EoZCxuZXcgTGIodyhnKSxkLiRhdHRyKSk7Sz11LiQkZWxlbWVudDtpZihOKXt2YXIgYmE9L15cXHMqKFtAPSZdKShcXD8/KVxccyooXFx3KilcXHMqJC87XG5mPXcoZyk7RT1lLiRuZXcoITApOyFIfHxIIT09TiYmSCE9PU4uJCRvcmlnaW5hbERpcmVjdGl2ZT9mLmRhdGEoXCIkaXNvbGF0ZVNjb3BlTm9UZW1wbGF0ZVwiLEUpOmYuZGF0YShcIiRpc29sYXRlU2NvcGVcIixFKTtoYShmLFwibmctaXNvbGF0ZS1zY29wZVwiKTtxKE4uc2NvcGUsZnVuY3Rpb24oYSxjKXt2YXIgZD1hLm1hdGNoKGJhKXx8W10sZz1kWzNdfHxjLGY9XCI/XCI9PWRbMl0sZD1kWzFdLG0sbCxuLHA7RS4kJGlzb2xhdGVCaW5kaW5nc1tjXT1kK2c7c3dpdGNoKGQpe2Nhc2UgXCJAXCI6dS4kb2JzZXJ2ZShnLGZ1bmN0aW9uKGEpe0VbY109YX0pO3UuJCRvYnNlcnZlcnNbZ10uJCRzY29wZT1lO3VbZ10mJihFW2NdPWIodVtnXSkoZSkpO2JyZWFrO2Nhc2UgXCI9XCI6aWYoZiYmIXVbZ10pYnJlYWs7bD1yKHVbZ10pO3A9bC5saXRlcmFsP3hhOmZ1bmN0aW9uKGEsYil7cmV0dXJuIGE9PT1ifTtuPWwuYXNzaWdufHxmdW5jdGlvbigpe209RVtjXT1sKGUpO3Rocm93IGlhKFwibm9uYXNzaWduXCIsdVtnXSxcbk4ubmFtZSk7fTttPUVbY109bChlKTtFLiR3YXRjaChmdW5jdGlvbigpe3ZhciBhPWwoZSk7cChhLEVbY10pfHwocChhLG0pP24oZSxhPUVbY10pOkVbY109YSk7cmV0dXJuIG09YX0sbnVsbCxsLmxpdGVyYWwpO2JyZWFrO2Nhc2UgXCImXCI6bD1yKHVbZ10pO0VbY109ZnVuY3Rpb24oYSl7cmV0dXJuIGwoZSxhKX07YnJlYWs7ZGVmYXVsdDp0aHJvdyBpYShcImlzY3BcIixOLm5hbWUsYyxhKTt9fSl9bmI9cCYmeDtQJiZxKFAsZnVuY3Rpb24oYSl7dmFyIGI9eyRzY29wZTphPT09Tnx8YS4kJGlzb2xhdGVTY29wZT9FOmUsJGVsZW1lbnQ6SywkYXR0cnM6dSwkdHJhbnNjbHVkZTpuYn0sYztBPWEuY29udHJvbGxlcjtcIkBcIj09QSYmKEE9dVthLm5hbWVdKTtjPXYoQSxiKTtjYVthLm5hbWVdPWM7Q2F8fEsuZGF0YShcIiRcIithLm5hbWUrXCJDb250cm9sbGVyXCIsYyk7YS5jb250cm9sbGVyQXMmJihiLiRzY29wZVthLmNvbnRyb2xsZXJBc109Yyl9KTtmPTA7Zm9yKHo9bS5sZW5ndGg7Zjx6O2YrKyl0cnl7Rj1cbm1bZl0sRihGLmlzb2xhdGVTY29wZT9FOmUsSyx1LEYucmVxdWlyZSYmSShGLmRpcmVjdGl2ZU5hbWUsRi5yZXF1aXJlLEssY2EpLG5iKX1jYXRjaChHKXtsKEcsZ2EoSykpfWY9ZTtOJiYoTi50ZW1wbGF0ZXx8bnVsbD09PU4udGVtcGxhdGVVcmwpJiYoZj1FKTthJiZhKGYsZy5jaGlsZE5vZGVzLHMscCk7Zm9yKGY9bi5sZW5ndGgtMTswPD1mO2YtLSl0cnl7Rj1uW2ZdLEYoRi5pc29sYXRlU2NvcGU/RTplLEssdSxGLnJlcXVpcmUmJkkoRi5kaXJlY3RpdmVOYW1lLEYucmVxdWlyZSxLLGNhKSxuYil9Y2F0Y2goQil7bChCLGdhKEspKX19cD1wfHx7fTtmb3IodmFyIHU9LU51bWJlci5NQVhfVkFMVUUsRixQPXAuY29udHJvbGxlckRpcmVjdGl2ZXMsTj1wLm5ld0lzb2xhdGVTY29wZURpcmVjdGl2ZSxIPXAudGVtcGxhdGVEaXJlY3RpdmUsYmE9cC5ub25UbGJUcmFuc2NsdWRlRGlyZWN0aXZlLEQ9ITEsSj0hMSxDYT1wLmhhc0VsZW1lbnRUcmFuc2NsdWRlRGlyZWN0aXZlLHQ9ZC4kJGVsZW1lbnQ9XG53KGMpLEcsbmEsWCxUPWUsUixTPTAsb2E9YS5sZW5ndGg7UzxvYTtTKyspe0c9YVtTXTt2YXIgVz1HLiQkc3RhcnQsWT1HLiQkZW5kO1cmJih0PUUoYyxXLFkpKTtYPXM7aWYodT5HLnByaW9yaXR5KWJyZWFrO2lmKFg9Ry5zY29wZSlGPUZ8fEcsRy50ZW1wbGF0ZVVybHx8KEwoXCJuZXcvaXNvbGF0ZWQgc2NvcGVcIixOLEcsdCksVShYKSYmKE49RykpO25hPUcubmFtZTshRy50ZW1wbGF0ZVVybCYmRy5jb250cm9sbGVyJiYoWD1HLmNvbnRyb2xsZXIsUD1QfHx7fSxMKFwiJ1wiK25hK1wiJyBjb250cm9sbGVyXCIsUFtuYV0sRyx0KSxQW25hXT1HKTtpZihYPUcudHJhbnNjbHVkZSlEPSEwLEcuJCR0bGJ8fChMKFwidHJhbnNjbHVzaW9uXCIsYmEsRyx0KSxiYT1HKSxcImVsZW1lbnRcIj09WD8oQ2E9ITAsdT1HLnByaW9yaXR5LFg9RShjLFcsWSksdD1kLiQkZWxlbWVudD13KFYuY3JlYXRlQ29tbWVudChcIiBcIituYStcIjogXCIrZFtuYV0rXCIgXCIpKSxjPXRbMF0sb2IoZyx3KHlhLmNhbGwoWCwwKSksYyksXG5UPXooWCxlLHUsZiYmZi5uYW1lLHtub25UbGJUcmFuc2NsdWRlRGlyZWN0aXZlOmJhfSkpOihYPXcoSmIoYykpLmNvbnRlbnRzKCksdC5lbXB0eSgpLFQ9eihYLGUpKTtpZihHLnRlbXBsYXRlKWlmKEo9ITAsTChcInRlbXBsYXRlXCIsSCxHLHQpLEg9RyxYPVEoRy50ZW1wbGF0ZSk/Ry50ZW1wbGF0ZSh0LGQpOkcudGVtcGxhdGUsWD1aKFgpLEcucmVwbGFjZSl7Zj1HO1g9SGIudGVzdChYKT93KGFhKFgpKTpbXTtjPVhbMF07aWYoMSE9WC5sZW5ndGh8fDEhPT1jLm5vZGVUeXBlKXRocm93IGlhKFwidHBscnRcIixuYSxcIlwiKTtvYihnLHQsYyk7b2E9eyRhdHRyOnt9fTtYPWNhKGMsW10sb2EpO3ZhciB0ZT1hLnNwbGljZShTKzEsYS5sZW5ndGgtKFMrMSkpO04mJnRjKFgpO2E9YS5jb25jYXQoWCkuY29uY2F0KHRlKTtCKGQsb2EpO29hPWEubGVuZ3RofWVsc2UgdC5odG1sKFgpO2lmKEcudGVtcGxhdGVVcmwpSj0hMCxMKFwidGVtcGxhdGVcIixILEcsdCksSD1HLEcucmVwbGFjZSYmKGY9RyksTT1cbnkoYS5zcGxpY2UoUyxhLmxlbmd0aC1TKSx0LGQsZyxEJiZULG0sbix7Y29udHJvbGxlckRpcmVjdGl2ZXM6UCxuZXdJc29sYXRlU2NvcGVEaXJlY3RpdmU6Tix0ZW1wbGF0ZURpcmVjdGl2ZTpILG5vblRsYlRyYW5zY2x1ZGVEaXJlY3RpdmU6YmF9KSxvYT1hLmxlbmd0aDtlbHNlIGlmKEcuY29tcGlsZSl0cnl7Uj1HLmNvbXBpbGUodCxkLFQpLFEoUik/eChudWxsLFIsVyxZKTpSJiZ4KFIucHJlLFIucG9zdCxXLFkpfWNhdGNoKCQpe2woJCxnYSh0KSl9Ry50ZXJtaW5hbCYmKE0udGVybWluYWw9ITAsdT1NYXRoLm1heCh1LEcucHJpb3JpdHkpKX1NLnNjb3BlPUYmJiEwPT09Ri5zY29wZTtNLnRyYW5zY2x1ZGVPblRoaXNFbGVtZW50PUQ7TS50ZW1wbGF0ZU9uVGhpc0VsZW1lbnQ9SjtNLnRyYW5zY2x1ZGU9VDtwLmhhc0VsZW1lbnRUcmFuc2NsdWRlRGlyZWN0aXZlPUNhO3JldHVybiBNfWZ1bmN0aW9uIHRjKGEpe2Zvcih2YXIgYj0wLGM9YS5sZW5ndGg7YjxjO2IrKylhW2JdPVpiKGFbYl0sXG57JCRpc29sYXRlU2NvcGU6ITB9KX1mdW5jdGlvbiBiYShiLGUsZyxmLGgscixuKXtpZihlPT09aClyZXR1cm4gbnVsbDtoPW51bGw7aWYoYy5oYXNPd25Qcm9wZXJ0eShlKSl7dmFyIHA7ZT1hLmdldChlK2QpO2Zvcih2YXIgdj0wLHg9ZS5sZW5ndGg7djx4O3YrKyl0cnl7cD1lW3ZdLChmPT09c3x8Zj5wLnByaW9yaXR5KSYmLTEhPXAucmVzdHJpY3QuaW5kZXhPZihnKSYmKHImJihwPVpiKHAseyQkc3RhcnQ6ciwkJGVuZDpufSkpLGIucHVzaChwKSxoPXApfWNhdGNoKEkpe2woSSl9fXJldHVybiBofWZ1bmN0aW9uIEIoYSxiKXt2YXIgYz1iLiRhdHRyLGQ9YS4kYXR0cixlPWEuJCRlbGVtZW50O3EoYSxmdW5jdGlvbihkLGUpe1wiJFwiIT1lLmNoYXJBdCgwKSYmKGJbZV0mJmJbZV0hPT1kJiYoZCs9KFwic3R5bGVcIj09PWU/XCI7XCI6XCIgXCIpK2JbZV0pLGEuJHNldChlLGQsITAsY1tlXSkpfSk7cShiLGZ1bmN0aW9uKGIsZyl7XCJjbGFzc1wiPT1nPyhoYShlLGIpLGFbXCJjbGFzc1wiXT0oYVtcImNsYXNzXCJdP1xuYVtcImNsYXNzXCJdK1wiIFwiOlwiXCIpK2IpOlwic3R5bGVcIj09Zz8oZS5hdHRyKFwic3R5bGVcIixlLmF0dHIoXCJzdHlsZVwiKStcIjtcIitiKSxhLnN0eWxlPShhLnN0eWxlP2Euc3R5bGUrXCI7XCI6XCJcIikrYik6XCIkXCI9PWcuY2hhckF0KDApfHxhLmhhc093blByb3BlcnR5KGcpfHwoYVtnXT1iLGRbZ109Y1tnXSl9KX1mdW5jdGlvbiB5KGEsYixjLGQsZSxnLGYsaCl7dmFyIG09W10sbCxyLHY9YlswXSx4PWEuc2hpZnQoKSxJPUooe30seCx7dGVtcGxhdGVVcmw6bnVsbCx0cmFuc2NsdWRlOm51bGwscmVwbGFjZTpudWxsLCQkb3JpZ2luYWxEaXJlY3RpdmU6eH0pLE09USh4LnRlbXBsYXRlVXJsKT94LnRlbXBsYXRlVXJsKGIsYyk6eC50ZW1wbGF0ZVVybDtiLmVtcHR5KCk7bi5nZXQodS5nZXRUcnVzdGVkUmVzb3VyY2VVcmwoTSkse2NhY2hlOnB9KS5zdWNjZXNzKGZ1bmN0aW9uKG4pe3ZhciBwLHU7bj1aKG4pO2lmKHgucmVwbGFjZSl7bj1IYi50ZXN0KG4pP3coYWEobikpOltdO3A9blswXTtpZigxIT1cbm4ubGVuZ3RofHwxIT09cC5ub2RlVHlwZSl0aHJvdyBpYShcInRwbHJ0XCIseC5uYW1lLE0pO249eyRhdHRyOnt9fTtvYihkLGIscCk7dmFyIHo9Y2EocCxbXSxuKTtVKHguc2NvcGUpJiZ0Yyh6KTthPXouY29uY2F0KGEpO0IoYyxuKX1lbHNlIHA9dixiLmh0bWwobik7YS51bnNoaWZ0KEkpO2w9SChhLHAsYyxlLGIseCxnLGYsaCk7cShkLGZ1bmN0aW9uKGEsYyl7YT09cCYmKGRbY109YlswXSl9KTtmb3Iocj1QKGJbMF0uY2hpbGROb2RlcyxlKTttLmxlbmd0aDspe249bS5zaGlmdCgpO3U9bS5zaGlmdCgpO3ZhciBGPW0uc2hpZnQoKSxBPW0uc2hpZnQoKSx6PWJbMF07aWYodSE9PXYpe3ZhciBFPXUuY2xhc3NOYW1lO2guaGFzRWxlbWVudFRyYW5zY2x1ZGVEaXJlY3RpdmUmJngucmVwbGFjZXx8KHo9SmIocCkpO29iKEYsdyh1KSx6KTtoYSh3KHopLEUpfXU9bC50cmFuc2NsdWRlT25UaGlzRWxlbWVudD9OKG4sbC50cmFuc2NsdWRlLEEpOkE7bChyLG4seixkLHUpfW09bnVsbH0pLmVycm9yKGZ1bmN0aW9uKGEsXG5iLGMsZCl7dGhyb3cgaWEoXCJ0cGxvYWRcIixkLnVybCk7fSk7cmV0dXJuIGZ1bmN0aW9uKGEsYixjLGQsZSl7YT1lO20/KG0ucHVzaChiKSxtLnB1c2goYyksbS5wdXNoKGQpLG0ucHVzaChhKSk6KGwudHJhbnNjbHVkZU9uVGhpc0VsZW1lbnQmJihhPU4oYixsLnRyYW5zY2x1ZGUsZSkpLGwocixiLGMsZCxhKSl9fWZ1bmN0aW9uIEQoYSxiKXt2YXIgYz1iLnByaW9yaXR5LWEucHJpb3JpdHk7cmV0dXJuIDAhPT1jP2M6YS5uYW1lIT09Yi5uYW1lP2EubmFtZTxiLm5hbWU/LTE6MTphLmluZGV4LWIuaW5kZXh9ZnVuY3Rpb24gTChhLGIsYyxkKXtpZihiKXRocm93IGlhKFwibXVsdGlkaXJcIixiLm5hbWUsYy5uYW1lLGEsZ2EoZCkpO31mdW5jdGlvbiB0KGEsYyl7dmFyIGQ9YihjLCEwKTtkJiZhLnB1c2goe3ByaW9yaXR5OjAsY29tcGlsZTpmdW5jdGlvbihhKXt2YXIgYj1hLnBhcmVudCgpLmxlbmd0aDtiJiZoYShhLnBhcmVudCgpLFwibmctYmluZGluZ1wiKTtyZXR1cm4gZnVuY3Rpb24oYSxcbmMpe3ZhciBlPWMucGFyZW50KCksZz1lLmRhdGEoXCIkYmluZGluZ1wiKXx8W107Zy5wdXNoKGQpO2UuZGF0YShcIiRiaW5kaW5nXCIsZyk7Ynx8aGEoZSxcIm5nLWJpbmRpbmdcIik7YS4kd2F0Y2goZCxmdW5jdGlvbihhKXtjWzBdLm5vZGVWYWx1ZT1hfSl9fX0pfWZ1bmN0aW9uIFQoYSxiKXtpZihcInNyY2RvY1wiPT1iKXJldHVybiB1LkhUTUw7dmFyIGM9TGEoYSk7aWYoXCJ4bGlua0hyZWZcIj09Ynx8XCJGT1JNXCI9PWMmJlwiYWN0aW9uXCI9PWJ8fFwiSU1HXCIhPWMmJihcInNyY1wiPT1ifHxcIm5nU3JjXCI9PWIpKXJldHVybiB1LlJFU09VUkNFX1VSTH1mdW5jdGlvbiBSKGEsYyxkLGUpe3ZhciBnPWIoZCwhMCk7aWYoZyl7aWYoXCJtdWx0aXBsZVwiPT09ZSYmXCJTRUxFQ1RcIj09PUxhKGEpKXRocm93IGlhKFwic2VsbXVsdGlcIixnYShhKSk7Yy5wdXNoKHtwcmlvcml0eToxMDAsY29tcGlsZTpmdW5jdGlvbigpe3JldHVybntwcmU6ZnVuY3Rpb24oYyxkLG0pe2Q9bS4kJG9ic2VydmVyc3x8KG0uJCRvYnNlcnZlcnM9XG57fSk7aWYoZi50ZXN0KGUpKXRocm93IGlhKFwibm9kb21ldmVudHNcIik7aWYoZz1iKG1bZV0sITAsVChhLGUpKSltW2VdPWcoYyksKGRbZV18fChkW2VdPVtdKSkuJCRpbnRlcj0hMCwobS4kJG9ic2VydmVycyYmbS4kJG9ic2VydmVyc1tlXS4kJHNjb3BlfHxjKS4kd2F0Y2goZyxmdW5jdGlvbihhLGIpe1wiY2xhc3NcIj09PWUmJmEhPWI/bS4kdXBkYXRlQ2xhc3MoYSxiKTptLiRzZXQoZSxhKX0pfX19fSl9fWZ1bmN0aW9uIG9iKGEsYixjKXt2YXIgZD1iWzBdLGU9Yi5sZW5ndGgsZz1kLnBhcmVudE5vZGUsZixtO2lmKGEpZm9yKGY9MCxtPWEubGVuZ3RoO2Y8bTtmKyspaWYoYVtmXT09ZCl7YVtmKytdPWM7bT1mK2UtMTtmb3IodmFyIGg9YS5sZW5ndGg7ZjxoO2YrKyxtKyspbTxoP2FbZl09YVttXTpkZWxldGUgYVtmXTthLmxlbmd0aC09ZS0xO2JyZWFrfWcmJmcucmVwbGFjZUNoaWxkKGMsZCk7YT1WLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTthLmFwcGVuZENoaWxkKGQpO2Nbdy5leHBhbmRvXT1cbmRbdy5leHBhbmRvXTtkPTE7Zm9yKGU9Yi5sZW5ndGg7ZDxlO2QrKylnPWJbZF0sdyhnKS5yZW1vdmUoKSxhLmFwcGVuZENoaWxkKGcpLGRlbGV0ZSBiW2RdO2JbMF09YztiLmxlbmd0aD0xfWZ1bmN0aW9uIHVjKGEsYil7cmV0dXJuIEooZnVuY3Rpb24oKXtyZXR1cm4gYS5hcHBseShudWxsLGFyZ3VtZW50cyl9LGEsYil9dmFyIExiPWZ1bmN0aW9uKGEsYil7dGhpcy4kJGVsZW1lbnQ9YTt0aGlzLiRhdHRyPWJ8fHt9fTtMYi5wcm90b3R5cGU9eyRub3JtYWxpemU6bWEsJGFkZENsYXNzOmZ1bmN0aW9uKGEpe2EmJjA8YS5sZW5ndGgmJk0uYWRkQ2xhc3ModGhpcy4kJGVsZW1lbnQsYSl9LCRyZW1vdmVDbGFzczpmdW5jdGlvbihhKXthJiYwPGEubGVuZ3RoJiZNLnJlbW92ZUNsYXNzKHRoaXMuJCRlbGVtZW50LGEpfSwkdXBkYXRlQ2xhc3M6ZnVuY3Rpb24oYSxiKXt2YXIgYz12YyhhLGIpLGQ9dmMoYixhKTswPT09Yy5sZW5ndGg/TS5yZW1vdmVDbGFzcyh0aGlzLiQkZWxlbWVudCxkKTpcbjA9PT1kLmxlbmd0aD9NLmFkZENsYXNzKHRoaXMuJCRlbGVtZW50LGMpOk0uc2V0Q2xhc3ModGhpcy4kJGVsZW1lbnQsYyxkKX0sJHNldDpmdW5jdGlvbihhLGIsYyxkKXt2YXIgZT1xYyh0aGlzLiQkZWxlbWVudFswXSxhKTtlJiYodGhpcy4kJGVsZW1lbnQucHJvcChhLGIpLGQ9ZSk7dGhpc1thXT1iO2Q/dGhpcy4kYXR0clthXT1kOihkPXRoaXMuJGF0dHJbYV0pfHwodGhpcy4kYXR0clthXT1kPWhiKGEsXCItXCIpKTtlPUxhKHRoaXMuJCRlbGVtZW50KTtpZihcIkFcIj09PWUmJlwiaHJlZlwiPT09YXx8XCJJTUdcIj09PWUmJlwic3JjXCI9PT1hKXRoaXNbYV09Yj1GKGIsXCJzcmNcIj09PWEpOyExIT09YyYmKG51bGw9PT1ifHxiPT09cz90aGlzLiQkZWxlbWVudC5yZW1vdmVBdHRyKGQpOnRoaXMuJCRlbGVtZW50LmF0dHIoZCxiKSk7KGM9dGhpcy4kJG9ic2VydmVycykmJnEoY1thXSxmdW5jdGlvbihhKXt0cnl7YShiKX1jYXRjaChjKXtsKGMpfX0pfSwkb2JzZXJ2ZTpmdW5jdGlvbihhLGIpe3ZhciBjPVxudGhpcyxkPWMuJCRvYnNlcnZlcnN8fChjLiQkb2JzZXJ2ZXJzPXt9KSxlPWRbYV18fChkW2FdPVtdKTtlLnB1c2goYik7SS4kZXZhbEFzeW5jKGZ1bmN0aW9uKCl7ZS4kJGludGVyfHxiKGNbYV0pfSk7cmV0dXJuIGJ9fTt2YXIgQ2E9Yi5zdGFydFN5bWJvbCgpLG9hPWIuZW5kU3ltYm9sKCksWj1cInt7XCI9PUNhfHxcIn19XCI9PW9hP0ZhOmZ1bmN0aW9uKGEpe3JldHVybiBhLnJlcGxhY2UoL1xce1xcey9nLENhKS5yZXBsYWNlKC99fS9nLG9hKX0sVz0vXm5nQXR0cltBLVpdLztyZXR1cm4gen1dfWZ1bmN0aW9uIG1hKGIpe3JldHVybiBWYShiLnJlcGxhY2UodWUsXCJcIikpfWZ1bmN0aW9uIHZjKGIsYSl7dmFyIGM9XCJcIixkPWIuc3BsaXQoL1xccysvKSxlPWEuc3BsaXQoL1xccysvKSxnPTA7YTpmb3IoO2c8ZC5sZW5ndGg7ZysrKXtmb3IodmFyIGY9ZFtnXSxrPTA7azxlLmxlbmd0aDtrKyspaWYoZj09ZVtrXSljb250aW51ZSBhO2MrPSgwPGMubGVuZ3RoP1wiIFwiOlwiXCIpK2Z9cmV0dXJuIGN9ZnVuY3Rpb24gT2QoKXt2YXIgYj1cbnt9LGE9L14oXFxTKykoXFxzK2FzXFxzKyhcXHcrKSk/JC87dGhpcy5yZWdpc3Rlcj1mdW5jdGlvbihhLGQpe0FhKGEsXCJjb250cm9sbGVyXCIpO1UoYSk/SihiLGEpOmJbYV09ZH07dGhpcy4kZ2V0PVtcIiRpbmplY3RvclwiLFwiJHdpbmRvd1wiLGZ1bmN0aW9uKGMsZCl7cmV0dXJuIGZ1bmN0aW9uKGUsZyl7dmFyIGYsayxtO0MoZSkmJihmPWUubWF0Y2goYSksaz1mWzFdLG09ZlszXSxlPWIuaGFzT3duUHJvcGVydHkoayk/YltrXTpmYyhnLiRzY29wZSxrLCEwKXx8ZmMoZCxrLCEwKSxUYShlLGssITApKTtmPWMuaW5zdGFudGlhdGUoZSxnKTtpZihtKXtpZighZ3x8XCJvYmplY3RcIiE9dHlwZW9mIGcuJHNjb3BlKXRocm93IHQoXCIkY29udHJvbGxlclwiKShcIm5vc2NwXCIsa3x8ZS5uYW1lLG0pO2cuJHNjb3BlW21dPWZ9cmV0dXJuIGZ9fV19ZnVuY3Rpb24gUGQoKXt0aGlzLiRnZXQ9W1wiJHdpbmRvd1wiLGZ1bmN0aW9uKGIpe3JldHVybiB3KGIuZG9jdW1lbnQpfV19ZnVuY3Rpb24gUWQoKXt0aGlzLiRnZXQ9XG5bXCIkbG9nXCIsZnVuY3Rpb24oYil7cmV0dXJuIGZ1bmN0aW9uKGEsYyl7Yi5lcnJvci5hcHBseShiLGFyZ3VtZW50cyl9fV19ZnVuY3Rpb24gd2MoYil7dmFyIGE9e30sYyxkLGU7aWYoIWIpcmV0dXJuIGE7cShiLnNwbGl0KFwiXFxuXCIpLGZ1bmN0aW9uKGIpe2U9Yi5pbmRleE9mKFwiOlwiKTtjPUwoYWEoYi5zdWJzdHIoMCxlKSkpO2Q9YWEoYi5zdWJzdHIoZSsxKSk7YyYmKGFbY109YVtjXT9hW2NdKyhcIiwgXCIrZCk6ZCl9KTtyZXR1cm4gYX1mdW5jdGlvbiB4YyhiKXt2YXIgYT1VKGIpP2I6cztyZXR1cm4gZnVuY3Rpb24oYyl7YXx8KGE9d2MoYikpO3JldHVybiBjP2FbTChjKV18fG51bGw6YX19ZnVuY3Rpb24geWMoYixhLGMpe2lmKFEoYykpcmV0dXJuIGMoYixhKTtxKGMsZnVuY3Rpb24oYyl7Yj1jKGIsYSl9KTtyZXR1cm4gYn1mdW5jdGlvbiBUZCgpe3ZhciBiPS9eXFxzKihcXFt8XFx7W15cXHtdKS8sYT0vW1xcfVxcXV1cXHMqJC8sYz0vXlxcKVxcXVxcfScsP1xcbi8sZD17XCJDb250ZW50LVR5cGVcIjpcImFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtOFwifSxcbmU9dGhpcy5kZWZhdWx0cz17dHJhbnNmb3JtUmVzcG9uc2U6W2Z1bmN0aW9uKGQpe0MoZCkmJihkPWQucmVwbGFjZShjLFwiXCIpLGIudGVzdChkKSYmYS50ZXN0KGQpJiYoZD1hYyhkKSkpO3JldHVybiBkfV0sdHJhbnNmb3JtUmVxdWVzdDpbZnVuY3Rpb24oYSl7cmV0dXJuIFUoYSkmJlwiW29iamVjdCBGaWxlXVwiIT09d2EuY2FsbChhKSYmXCJbb2JqZWN0IEJsb2JdXCIhPT13YS5jYWxsKGEpP3JhKGEpOmF9XSxoZWFkZXJzOntjb21tb246e0FjY2VwdDpcImFwcGxpY2F0aW9uL2pzb24sIHRleHQvcGxhaW4sICovKlwifSxwb3N0OmthKGQpLHB1dDprYShkKSxwYXRjaDprYShkKX0seHNyZkNvb2tpZU5hbWU6XCJYU1JGLVRPS0VOXCIseHNyZkhlYWRlck5hbWU6XCJYLVhTUkYtVE9LRU5cIn0sZz10aGlzLmludGVyY2VwdG9ycz1bXSxmPXRoaXMucmVzcG9uc2VJbnRlcmNlcHRvcnM9W107dGhpcy4kZ2V0PVtcIiRodHRwQmFja2VuZFwiLFwiJGJyb3dzZXJcIixcIiRjYWNoZUZhY3RvcnlcIixcIiRyb290U2NvcGVcIixcblwiJHFcIixcIiRpbmplY3RvclwiLGZ1bmN0aW9uKGEsYixjLGQsbixwKXtmdW5jdGlvbiByKGEpe2Z1bmN0aW9uIGIoYSl7dmFyIGQ9Sih7fSxhLHtkYXRhOnljKGEuZGF0YSxhLmhlYWRlcnMsYy50cmFuc2Zvcm1SZXNwb25zZSl9KTtyZXR1cm4gMjAwPD1hLnN0YXR1cyYmMzAwPmEuc3RhdHVzP2Q6bi5yZWplY3QoZCl9dmFyIGM9e21ldGhvZDpcImdldFwiLHRyYW5zZm9ybVJlcXVlc3Q6ZS50cmFuc2Zvcm1SZXF1ZXN0LHRyYW5zZm9ybVJlc3BvbnNlOmUudHJhbnNmb3JtUmVzcG9uc2V9LGQ9ZnVuY3Rpb24oYSl7ZnVuY3Rpb24gYihhKXt2YXIgYztxKGEsZnVuY3Rpb24oYixkKXtRKGIpJiYoYz1iKCksbnVsbCE9Yz9hW2RdPWM6ZGVsZXRlIGFbZF0pfSl9dmFyIGM9ZS5oZWFkZXJzLGQ9Sih7fSxhLmhlYWRlcnMpLGcsZixjPUooe30sYy5jb21tb24sY1tMKGEubWV0aG9kKV0pO2IoYyk7YihkKTthOmZvcihnIGluIGMpe2E9TChnKTtmb3IoZiBpbiBkKWlmKEwoZik9PT1hKWNvbnRpbnVlIGE7XG5kW2ddPWNbZ119cmV0dXJuIGR9KGEpO0ooYyxhKTtjLmhlYWRlcnM9ZDtjLm1ldGhvZD1IYShjLm1ldGhvZCk7dmFyIGc9W2Z1bmN0aW9uKGEpe2Q9YS5oZWFkZXJzO3ZhciBjPXljKGEuZGF0YSx4YyhkKSxhLnRyYW5zZm9ybVJlcXVlc3QpO0QoYS5kYXRhKSYmcShkLGZ1bmN0aW9uKGEsYil7XCJjb250ZW50LXR5cGVcIj09PUwoYikmJmRlbGV0ZSBkW2JdfSk7RChhLndpdGhDcmVkZW50aWFscykmJiFEKGUud2l0aENyZWRlbnRpYWxzKSYmKGEud2l0aENyZWRlbnRpYWxzPWUud2l0aENyZWRlbnRpYWxzKTtyZXR1cm4gdihhLGMsZCkudGhlbihiLGIpfSxzXSxmPW4ud2hlbihjKTtmb3IocSh1LGZ1bmN0aW9uKGEpeyhhLnJlcXVlc3R8fGEucmVxdWVzdEVycm9yKSYmZy51bnNoaWZ0KGEucmVxdWVzdCxhLnJlcXVlc3RFcnJvcik7KGEucmVzcG9uc2V8fGEucmVzcG9uc2VFcnJvcikmJmcucHVzaChhLnJlc3BvbnNlLGEucmVzcG9uc2VFcnJvcil9KTtnLmxlbmd0aDspe2E9Zy5zaGlmdCgpO1xudmFyIG09Zy5zaGlmdCgpLGY9Zi50aGVuKGEsbSl9Zi5zdWNjZXNzPWZ1bmN0aW9uKGEpe2YudGhlbihmdW5jdGlvbihiKXthKGIuZGF0YSxiLnN0YXR1cyxiLmhlYWRlcnMsYyl9KTtyZXR1cm4gZn07Zi5lcnJvcj1mdW5jdGlvbihhKXtmLnRoZW4obnVsbCxmdW5jdGlvbihiKXthKGIuZGF0YSxiLnN0YXR1cyxiLmhlYWRlcnMsYyl9KTtyZXR1cm4gZn07cmV0dXJuIGZ9ZnVuY3Rpb24gdihjLGcsZil7ZnVuY3Rpb24gaChhLGIsYyxlKXtBJiYoMjAwPD1hJiYzMDA+YT9BLnB1dCh3LFthLGIsd2MoYyksZV0pOkEucmVtb3ZlKHcpKTtwKGIsYSxjLGUpO2QuJCRwaGFzZXx8ZC4kYXBwbHkoKX1mdW5jdGlvbiBwKGEsYixkLGUpe2I9TWF0aC5tYXgoYiwwKTsoMjAwPD1iJiYzMDA+Yj91LnJlc29sdmU6dS5yZWplY3QpKHtkYXRhOmEsc3RhdHVzOmIsaGVhZGVyczp4YyhkKSxjb25maWc6YyxzdGF0dXNUZXh0OmV9KX1mdW5jdGlvbiB2KCl7dmFyIGE9T2Eoci5wZW5kaW5nUmVxdWVzdHMsXG5jKTstMSE9PWEmJnIucGVuZGluZ1JlcXVlc3RzLnNwbGljZShhLDEpfXZhciB1PW4uZGVmZXIoKSxxPXUucHJvbWlzZSxBLEgsdz1JKGMudXJsLGMucGFyYW1zKTtyLnBlbmRpbmdSZXF1ZXN0cy5wdXNoKGMpO3EudGhlbih2LHYpOyhjLmNhY2hlfHxlLmNhY2hlKSYmKCExIT09Yy5jYWNoZSYmXCJHRVRcIj09Yy5tZXRob2QpJiYoQT1VKGMuY2FjaGUpP2MuY2FjaGU6VShlLmNhY2hlKT9lLmNhY2hlOngpO2lmKEEpaWYoSD1BLmdldCh3KSxCKEgpKXtpZihILnRoZW4pcmV0dXJuIEgudGhlbih2LHYpLEg7TyhIKT9wKEhbMV0sSFswXSxrYShIWzJdKSxIWzNdKTpwKEgsMjAwLHt9LFwiT0tcIil9ZWxzZSBBLnB1dCh3LHEpO0QoSCkmJigoSD1NYihjLnVybCk/Yi5jb29raWVzKClbYy54c3JmQ29va2llTmFtZXx8ZS54c3JmQ29va2llTmFtZV06cykmJihmW2MueHNyZkhlYWRlck5hbWV8fGUueHNyZkhlYWRlck5hbWVdPUgpLGEoYy5tZXRob2QsdyxnLGgsZixjLnRpbWVvdXQsYy53aXRoQ3JlZGVudGlhbHMsXG5jLnJlc3BvbnNlVHlwZSkpO3JldHVybiBxfWZ1bmN0aW9uIEkoYSxiKXtpZighYilyZXR1cm4gYTt2YXIgYz1bXTtTYyhiLGZ1bmN0aW9uKGEsYil7bnVsbD09PWF8fEQoYSl8fChPKGEpfHwoYT1bYV0pLHEoYSxmdW5jdGlvbihhKXtVKGEpJiYoYT1yYShhKSk7Yy5wdXNoKHphKGIpK1wiPVwiK3phKGEpKX0pKX0pOzA8Yy5sZW5ndGgmJihhKz0oLTE9PWEuaW5kZXhPZihcIj9cIik/XCI/XCI6XCImXCIpK2Muam9pbihcIiZcIikpO3JldHVybiBhfXZhciB4PWMoXCIkaHR0cFwiKSx1PVtdO3EoZyxmdW5jdGlvbihhKXt1LnVuc2hpZnQoQyhhKT9wLmdldChhKTpwLmludm9rZShhKSl9KTtxKGYsZnVuY3Rpb24oYSxiKXt2YXIgYz1DKGEpP3AuZ2V0KGEpOnAuaW52b2tlKGEpO3Uuc3BsaWNlKGIsMCx7cmVzcG9uc2U6ZnVuY3Rpb24oYSl7cmV0dXJuIGMobi53aGVuKGEpKX0scmVzcG9uc2VFcnJvcjpmdW5jdGlvbihhKXtyZXR1cm4gYyhuLnJlamVjdChhKSl9fSl9KTtyLnBlbmRpbmdSZXF1ZXN0cz1bXTtcbihmdW5jdGlvbihhKXtxKGFyZ3VtZW50cyxmdW5jdGlvbihhKXtyW2FdPWZ1bmN0aW9uKGIsYyl7cmV0dXJuIHIoSihjfHx7fSx7bWV0aG9kOmEsdXJsOmJ9KSl9fSl9KShcImdldFwiLFwiZGVsZXRlXCIsXCJoZWFkXCIsXCJqc29ucFwiKTsoZnVuY3Rpb24oYSl7cShhcmd1bWVudHMsZnVuY3Rpb24oYSl7clthXT1mdW5jdGlvbihiLGMsZCl7cmV0dXJuIHIoSihkfHx7fSx7bWV0aG9kOmEsdXJsOmIsZGF0YTpjfSkpfX0pfSkoXCJwb3N0XCIsXCJwdXRcIik7ci5kZWZhdWx0cz1lO3JldHVybiByfV19ZnVuY3Rpb24gdmUoYil7aWYoOD49UyYmKCFiLm1hdGNoKC9eKGdldHxwb3N0fGhlYWR8cHV0fGRlbGV0ZXxvcHRpb25zKSQvaSl8fCFULlhNTEh0dHBSZXF1ZXN0KSlyZXR1cm4gbmV3IFQuQWN0aXZlWE9iamVjdChcIk1pY3Jvc29mdC5YTUxIVFRQXCIpO2lmKFQuWE1MSHR0cFJlcXVlc3QpcmV0dXJuIG5ldyBULlhNTEh0dHBSZXF1ZXN0O3Rocm93IHQoXCIkaHR0cEJhY2tlbmRcIikoXCJub3hoclwiKTt9ZnVuY3Rpb24gVWQoKXt0aGlzLiRnZXQ9XG5bXCIkYnJvd3NlclwiLFwiJHdpbmRvd1wiLFwiJGRvY3VtZW50XCIsZnVuY3Rpb24oYixhLGMpe3JldHVybiB3ZShiLHZlLGIuZGVmZXIsYS5hbmd1bGFyLmNhbGxiYWNrcyxjWzBdKX1dfWZ1bmN0aW9uIHdlKGIsYSxjLGQsZSl7ZnVuY3Rpb24gZyhhLGIsYyl7dmFyIGc9ZS5jcmVhdGVFbGVtZW50KFwic2NyaXB0XCIpLGY9bnVsbDtnLnR5cGU9XCJ0ZXh0L2phdmFzY3JpcHRcIjtnLnNyYz1hO2cuYXN5bmM9ITA7Zj1mdW5jdGlvbihhKXtXYShnLFwibG9hZFwiLGYpO1dhKGcsXCJlcnJvclwiLGYpO2UuYm9keS5yZW1vdmVDaGlsZChnKTtnPW51bGw7dmFyIGs9LTEsdj1cInVua25vd25cIjthJiYoXCJsb2FkXCIhPT1hLnR5cGV8fGRbYl0uY2FsbGVkfHwoYT17dHlwZTpcImVycm9yXCJ9KSx2PWEudHlwZSxrPVwiZXJyb3JcIj09PWEudHlwZT80MDQ6MjAwKTtjJiZjKGssdil9O3BiKGcsXCJsb2FkXCIsZik7cGIoZyxcImVycm9yXCIsZik7OD49UyYmKGcub25yZWFkeXN0YXRlY2hhbmdlPWZ1bmN0aW9uKCl7QyhnLnJlYWR5U3RhdGUpJiZcbi9sb2FkZWR8Y29tcGxldGUvLnRlc3QoZy5yZWFkeVN0YXRlKSYmKGcub25yZWFkeXN0YXRlY2hhbmdlPW51bGwsZih7dHlwZTpcImxvYWRcIn0pKX0pO2UuYm9keS5hcHBlbmRDaGlsZChnKTtyZXR1cm4gZn12YXIgZj0tMTtyZXR1cm4gZnVuY3Rpb24oZSxtLGgsbCxuLHAscix2KXtmdW5jdGlvbiBJKCl7dT1mO0YmJkYoKTt6JiZ6LmFib3J0KCl9ZnVuY3Rpb24geChhLGQsZSxnLGYpe1AmJmMuY2FuY2VsKFApO0Y9ej1udWxsOzA9PT1kJiYoZD1lPzIwMDpcImZpbGVcIj09c2EobSkucHJvdG9jb2w/NDA0OjApO2EoMTIyMz09PWQ/MjA0OmQsZSxnLGZ8fFwiXCIpO2IuJCRjb21wbGV0ZU91dHN0YW5kaW5nUmVxdWVzdCh5KX12YXIgdTtiLiQkaW5jT3V0c3RhbmRpbmdSZXF1ZXN0Q291bnQoKTttPW18fGIudXJsKCk7aWYoXCJqc29ucFwiPT1MKGUpKXt2YXIgTT1cIl9cIisoZC5jb3VudGVyKyspLnRvU3RyaW5nKDM2KTtkW01dPWZ1bmN0aW9uKGEpe2RbTV0uZGF0YT1hO2RbTV0uY2FsbGVkPSEwfTtcbnZhciBGPWcobS5yZXBsYWNlKFwiSlNPTl9DQUxMQkFDS1wiLFwiYW5ndWxhci5jYWxsYmFja3MuXCIrTSksTSxmdW5jdGlvbihhLGIpe3gobCxhLGRbTV0uZGF0YSxcIlwiLGIpO2RbTV09eX0pfWVsc2V7dmFyIHo9YShlKTt6Lm9wZW4oZSxtLCEwKTtxKG4sZnVuY3Rpb24oYSxiKXtCKGEpJiZ6LnNldFJlcXVlc3RIZWFkZXIoYixhKX0pO3oub25yZWFkeXN0YXRlY2hhbmdlPWZ1bmN0aW9uKCl7aWYoeiYmND09ei5yZWFkeVN0YXRlKXt2YXIgYT1udWxsLGI9bnVsbDt1IT09ZiYmKGE9ei5nZXRBbGxSZXNwb25zZUhlYWRlcnMoKSxiPVwicmVzcG9uc2VcImluIHo/ei5yZXNwb25zZTp6LnJlc3BvbnNlVGV4dCk7eChsLHV8fHouc3RhdHVzLGIsYSx6LnN0YXR1c1RleHR8fFwiXCIpfX07ciYmKHoud2l0aENyZWRlbnRpYWxzPSEwKTtpZih2KXRyeXt6LnJlc3BvbnNlVHlwZT12fWNhdGNoKHMpe2lmKFwianNvblwiIT09dil0aHJvdyBzO316LnNlbmQoaHx8bnVsbCl9aWYoMDxwKXZhciBQPWMoSSxwKTtlbHNlIHAmJlxucC50aGVuJiZwLnRoZW4oSSl9fWZ1bmN0aW9uIFJkKCl7dmFyIGI9XCJ7e1wiLGE9XCJ9fVwiO3RoaXMuc3RhcnRTeW1ib2w9ZnVuY3Rpb24oYSl7cmV0dXJuIGE/KGI9YSx0aGlzKTpifTt0aGlzLmVuZFN5bWJvbD1mdW5jdGlvbihiKXtyZXR1cm4gYj8oYT1iLHRoaXMpOmF9O3RoaXMuJGdldD1bXCIkcGFyc2VcIixcIiRleGNlcHRpb25IYW5kbGVyXCIsXCIkc2NlXCIsZnVuY3Rpb24oYyxkLGUpe2Z1bmN0aW9uIGcoZyxoLGwpe2Zvcih2YXIgbixwLHI9MCx2PVtdLEk9Zy5sZW5ndGgseD0hMSx1PVtdO3I8STspLTEhPShuPWcuaW5kZXhPZihiLHIpKSYmLTEhPShwPWcuaW5kZXhPZihhLG4rZikpPyhyIT1uJiZ2LnB1c2goZy5zdWJzdHJpbmcocixuKSksdi5wdXNoKHI9Yyh4PWcuc3Vic3RyaW5nKG4rZixwKSkpLHIuZXhwPXgscj1wK2sseD0hMCk6KHIhPUkmJnYucHVzaChnLnN1YnN0cmluZyhyKSkscj1JKTsoST12Lmxlbmd0aCl8fCh2LnB1c2goXCJcIiksST0xKTtpZihsJiYxPHYubGVuZ3RoKXRocm93IHpjKFwibm9jb25jYXRcIixcbmcpO2lmKCFofHx4KXJldHVybiB1Lmxlbmd0aD1JLHI9ZnVuY3Rpb24oYSl7dHJ5e2Zvcih2YXIgYj0wLGM9SSxmO2I8YztiKyspe2lmKFwiZnVuY3Rpb25cIj09dHlwZW9mKGY9dltiXSkpaWYoZj1mKGEpLGY9bD9lLmdldFRydXN0ZWQobCxmKTplLnZhbHVlT2YoZiksbnVsbD09ZilmPVwiXCI7ZWxzZSBzd2l0Y2godHlwZW9mIGYpe2Nhc2UgXCJzdHJpbmdcIjpicmVhaztjYXNlIFwibnVtYmVyXCI6Zj1cIlwiK2Y7YnJlYWs7ZGVmYXVsdDpmPXJhKGYpfXVbYl09Zn1yZXR1cm4gdS5qb2luKFwiXCIpfWNhdGNoKGspe2E9emMoXCJpbnRlcnJcIixnLGsudG9TdHJpbmcoKSksZChhKX19LHIuZXhwPWcsci5wYXJ0cz12LHJ9dmFyIGY9Yi5sZW5ndGgsaz1hLmxlbmd0aDtnLnN0YXJ0U3ltYm9sPWZ1bmN0aW9uKCl7cmV0dXJuIGJ9O2cuZW5kU3ltYm9sPWZ1bmN0aW9uKCl7cmV0dXJuIGF9O3JldHVybiBnfV19ZnVuY3Rpb24gU2QoKXt0aGlzLiRnZXQ9W1wiJHJvb3RTY29wZVwiLFwiJHdpbmRvd1wiLFwiJHFcIixmdW5jdGlvbihiLFxuYSxjKXtmdW5jdGlvbiBkKGQsZixrLG0pe3ZhciBoPWEuc2V0SW50ZXJ2YWwsbD1hLmNsZWFySW50ZXJ2YWwsbj1jLmRlZmVyKCkscD1uLnByb21pc2Uscj0wLHY9QihtKSYmIW07az1CKGspP2s6MDtwLnRoZW4obnVsbCxudWxsLGQpO3AuJCRpbnRlcnZhbElkPWgoZnVuY3Rpb24oKXtuLm5vdGlmeShyKyspOzA8ayYmcj49ayYmKG4ucmVzb2x2ZShyKSxsKHAuJCRpbnRlcnZhbElkKSxkZWxldGUgZVtwLiQkaW50ZXJ2YWxJZF0pO3Z8fGIuJGFwcGx5KCl9LGYpO2VbcC4kJGludGVydmFsSWRdPW47cmV0dXJuIHB9dmFyIGU9e307ZC5jYW5jZWw9ZnVuY3Rpb24oYSl7cmV0dXJuIGEmJmEuJCRpbnRlcnZhbElkIGluIGU/KGVbYS4kJGludGVydmFsSWRdLnJlamVjdChcImNhbmNlbGVkXCIpLGNsZWFySW50ZXJ2YWwoYS4kJGludGVydmFsSWQpLGRlbGV0ZSBlW2EuJCRpbnRlcnZhbElkXSwhMCk6ITF9O3JldHVybiBkfV19ZnVuY3Rpb24gYWQoKXt0aGlzLiRnZXQ9ZnVuY3Rpb24oKXtyZXR1cm57aWQ6XCJlbi11c1wiLFxuTlVNQkVSX0ZPUk1BVFM6e0RFQ0lNQUxfU0VQOlwiLlwiLEdST1VQX1NFUDpcIixcIixQQVRURVJOUzpbe21pbkludDoxLG1pbkZyYWM6MCxtYXhGcmFjOjMscG9zUHJlOlwiXCIscG9zU3VmOlwiXCIsbmVnUHJlOlwiLVwiLG5lZ1N1ZjpcIlwiLGdTaXplOjMsbGdTaXplOjN9LHttaW5JbnQ6MSxtaW5GcmFjOjIsbWF4RnJhYzoyLHBvc1ByZTpcIlxcdTAwYTRcIixwb3NTdWY6XCJcIixuZWdQcmU6XCIoXFx1MDBhNFwiLG5lZ1N1ZjpcIilcIixnU2l6ZTozLGxnU2l6ZTozfV0sQ1VSUkVOQ1lfU1lNOlwiJFwifSxEQVRFVElNRV9GT1JNQVRTOntNT05USDpcIkphbnVhcnkgRmVicnVhcnkgTWFyY2ggQXByaWwgTWF5IEp1bmUgSnVseSBBdWd1c3QgU2VwdGVtYmVyIE9jdG9iZXIgTm92ZW1iZXIgRGVjZW1iZXJcIi5zcGxpdChcIiBcIiksU0hPUlRNT05USDpcIkphbiBGZWIgTWFyIEFwciBNYXkgSnVuIEp1bCBBdWcgU2VwIE9jdCBOb3YgRGVjXCIuc3BsaXQoXCIgXCIpLERBWTpcIlN1bmRheSBNb25kYXkgVHVlc2RheSBXZWRuZXNkYXkgVGh1cnNkYXkgRnJpZGF5IFNhdHVyZGF5XCIuc3BsaXQoXCIgXCIpLFxuU0hPUlREQVk6XCJTdW4gTW9uIFR1ZSBXZWQgVGh1IEZyaSBTYXRcIi5zcGxpdChcIiBcIiksQU1QTVM6W1wiQU1cIixcIlBNXCJdLG1lZGl1bTpcIk1NTSBkLCB5IGg6bW06c3MgYVwiLFwic2hvcnRcIjpcIk0vZC95eSBoOm1tIGFcIixmdWxsRGF0ZTpcIkVFRUUsIE1NTU0gZCwgeVwiLGxvbmdEYXRlOlwiTU1NTSBkLCB5XCIsbWVkaXVtRGF0ZTpcIk1NTSBkLCB5XCIsc2hvcnREYXRlOlwiTS9kL3l5XCIsbWVkaXVtVGltZTpcImg6bW06c3MgYVwiLHNob3J0VGltZTpcImg6bW0gYVwifSxwbHVyYWxDYXQ6ZnVuY3Rpb24oYil7cmV0dXJuIDE9PT1iP1wib25lXCI6XCJvdGhlclwifX19fWZ1bmN0aW9uIE5iKGIpe2I9Yi5zcGxpdChcIi9cIik7Zm9yKHZhciBhPWIubGVuZ3RoO2EtLTspYlthXT1nYihiW2FdKTtyZXR1cm4gYi5qb2luKFwiL1wiKX1mdW5jdGlvbiBBYyhiLGEsYyl7Yj1zYShiLGMpO2EuJCRwcm90b2NvbD1iLnByb3RvY29sO2EuJCRob3N0PWIuaG9zdG5hbWU7YS4kJHBvcnQ9WihiLnBvcnQpfHx4ZVtiLnByb3RvY29sXXx8bnVsbH1cbmZ1bmN0aW9uIEJjKGIsYSxjKXt2YXIgZD1cIi9cIiE9PWIuY2hhckF0KDApO2QmJihiPVwiL1wiK2IpO2I9c2EoYixjKTthLiQkcGF0aD1kZWNvZGVVUklDb21wb25lbnQoZCYmXCIvXCI9PT1iLnBhdGhuYW1lLmNoYXJBdCgwKT9iLnBhdGhuYW1lLnN1YnN0cmluZygxKTpiLnBhdGhuYW1lKTthLiQkc2VhcmNoPWNjKGIuc2VhcmNoKTthLiQkaGFzaD1kZWNvZGVVUklDb21wb25lbnQoYi5oYXNoKTthLiQkcGF0aCYmXCIvXCIhPWEuJCRwYXRoLmNoYXJBdCgwKSYmKGEuJCRwYXRoPVwiL1wiK2EuJCRwYXRoKX1mdW5jdGlvbiBwYShiLGEpe2lmKDA9PT1hLmluZGV4T2YoYikpcmV0dXJuIGEuc3Vic3RyKGIubGVuZ3RoKX1mdW5jdGlvbiAkYShiKXt2YXIgYT1iLmluZGV4T2YoXCIjXCIpO3JldHVybi0xPT1hP2I6Yi5zdWJzdHIoMCxhKX1mdW5jdGlvbiBPYihiKXtyZXR1cm4gYi5zdWJzdHIoMCwkYShiKS5sYXN0SW5kZXhPZihcIi9cIikrMSl9ZnVuY3Rpb24gQ2MoYixhKXt0aGlzLiQkaHRtbDU9ITA7YT1hfHxcblwiXCI7dmFyIGM9T2IoYik7QWMoYix0aGlzLGIpO3RoaXMuJCRwYXJzZT1mdW5jdGlvbihhKXt2YXIgZT1wYShjLGEpO2lmKCFDKGUpKXRocm93IFBiKFwiaXB0aHByZnhcIixhLGMpO0JjKGUsdGhpcyxiKTt0aGlzLiQkcGF0aHx8KHRoaXMuJCRwYXRoPVwiL1wiKTt0aGlzLiQkY29tcG9zZSgpfTt0aGlzLiQkY29tcG9zZT1mdW5jdGlvbigpe3ZhciBhPUJiKHRoaXMuJCRzZWFyY2gpLGI9dGhpcy4kJGhhc2g/XCIjXCIrZ2IodGhpcy4kJGhhc2gpOlwiXCI7dGhpcy4kJHVybD1OYih0aGlzLiQkcGF0aCkrKGE/XCI/XCIrYTpcIlwiKStiO3RoaXMuJCRhYnNVcmw9Yyt0aGlzLiQkdXJsLnN1YnN0cigxKX07dGhpcy4kJHJld3JpdGU9ZnVuY3Rpb24oZCl7dmFyIGU7aWYoKGU9cGEoYixkKSkhPT1zKXJldHVybiBkPWUsKGU9cGEoYSxlKSkhPT1zP2MrKHBhKFwiL1wiLGUpfHxlKTpiK2Q7aWYoKGU9cGEoYyxkKSkhPT1zKXJldHVybiBjK2U7aWYoYz09ZCtcIi9cIilyZXR1cm4gY319ZnVuY3Rpb24gUWIoYixhKXt2YXIgYz1cbk9iKGIpO0FjKGIsdGhpcyxiKTt0aGlzLiQkcGFyc2U9ZnVuY3Rpb24oZCl7dmFyIGU9cGEoYixkKXx8cGEoYyxkKSxlPVwiI1wiPT1lLmNoYXJBdCgwKT9wYShhLGUpOnRoaXMuJCRodG1sNT9lOlwiXCI7aWYoIUMoZSkpdGhyb3cgUGIoXCJpaHNocHJmeFwiLGQsYSk7QmMoZSx0aGlzLGIpO2Q9dGhpcy4kJHBhdGg7dmFyIGc9L15cXC9bQS1aXTooXFwvLiopLzswPT09ZS5pbmRleE9mKGIpJiYoZT1lLnJlcGxhY2UoYixcIlwiKSk7Zy5leGVjKGUpfHwoZD0oZT1nLmV4ZWMoZCkpP2VbMV06ZCk7dGhpcy4kJHBhdGg9ZDt0aGlzLiQkY29tcG9zZSgpfTt0aGlzLiQkY29tcG9zZT1mdW5jdGlvbigpe3ZhciBjPUJiKHRoaXMuJCRzZWFyY2gpLGU9dGhpcy4kJGhhc2g/XCIjXCIrZ2IodGhpcy4kJGhhc2gpOlwiXCI7dGhpcy4kJHVybD1OYih0aGlzLiQkcGF0aCkrKGM/XCI/XCIrYzpcIlwiKStlO3RoaXMuJCRhYnNVcmw9YisodGhpcy4kJHVybD9hK3RoaXMuJCR1cmw6XCJcIil9O3RoaXMuJCRyZXdyaXRlPWZ1bmN0aW9uKGEpe2lmKCRhKGIpPT1cbiRhKGEpKXJldHVybiBhfX1mdW5jdGlvbiBSYihiLGEpe3RoaXMuJCRodG1sNT0hMDtRYi5hcHBseSh0aGlzLGFyZ3VtZW50cyk7dmFyIGM9T2IoYik7dGhpcy4kJHJld3JpdGU9ZnVuY3Rpb24oZCl7dmFyIGU7aWYoYj09JGEoZCkpcmV0dXJuIGQ7aWYoZT1wYShjLGQpKXJldHVybiBiK2ErZTtpZihjPT09ZCtcIi9cIilyZXR1cm4gY307dGhpcy4kJGNvbXBvc2U9ZnVuY3Rpb24oKXt2YXIgYz1CYih0aGlzLiQkc2VhcmNoKSxlPXRoaXMuJCRoYXNoP1wiI1wiK2diKHRoaXMuJCRoYXNoKTpcIlwiO3RoaXMuJCR1cmw9TmIodGhpcy4kJHBhdGgpKyhjP1wiP1wiK2M6XCJcIikrZTt0aGlzLiQkYWJzVXJsPWIrYSt0aGlzLiQkdXJsfX1mdW5jdGlvbiBxYihiKXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gdGhpc1tiXX19ZnVuY3Rpb24gRGMoYixhKXtyZXR1cm4gZnVuY3Rpb24oYyl7aWYoRChjKSlyZXR1cm4gdGhpc1tiXTt0aGlzW2JdPWEoYyk7dGhpcy4kJGNvbXBvc2UoKTtyZXR1cm4gdGhpc319ZnVuY3Rpb24gVmQoKXt2YXIgYj1cblwiXCIsYT0hMTt0aGlzLmhhc2hQcmVmaXg9ZnVuY3Rpb24oYSl7cmV0dXJuIEIoYSk/KGI9YSx0aGlzKTpifTt0aGlzLmh0bWw1TW9kZT1mdW5jdGlvbihiKXtyZXR1cm4gQihiKT8oYT1iLHRoaXMpOmF9O3RoaXMuJGdldD1bXCIkcm9vdFNjb3BlXCIsXCIkYnJvd3NlclwiLFwiJHNuaWZmZXJcIixcIiRyb290RWxlbWVudFwiLGZ1bmN0aW9uKGMsZCxlLGcpe2Z1bmN0aW9uIGYoYSl7Yy4kYnJvYWRjYXN0KFwiJGxvY2F0aW9uQ2hhbmdlU3VjY2Vzc1wiLGsuYWJzVXJsKCksYSl9dmFyIGssbSxoPWQuYmFzZUhyZWYoKSxsPWQudXJsKCksbjthPyhuPWwuc3Vic3RyaW5nKDAsbC5pbmRleE9mKFwiL1wiLGwuaW5kZXhPZihcIi8vXCIpKzIpKSsoaHx8XCIvXCIpLG09ZS5oaXN0b3J5P0NjOlJiKToobj0kYShsKSxtPVFiKTtrPW5ldyBtKG4sXCIjXCIrYik7ay4kJHBhcnNlKGsuJCRyZXdyaXRlKGwpKTtnLm9uKFwiY2xpY2tcIixmdW5jdGlvbihhKXtpZighYS5jdHJsS2V5JiYhYS5tZXRhS2V5JiYyIT1hLndoaWNoKXtmb3IodmFyIGU9XG53KGEudGFyZ2V0KTtcImFcIiE9PUwoZVswXS5ub2RlTmFtZSk7KWlmKGVbMF09PT1nWzBdfHwhKGU9ZS5wYXJlbnQoKSlbMF0pcmV0dXJuO3ZhciBmPWUucHJvcChcImhyZWZcIik7VShmKSYmXCJbb2JqZWN0IFNWR0FuaW1hdGVkU3RyaW5nXVwiPT09Zi50b1N0cmluZygpJiYoZj1zYShmLmFuaW1WYWwpLmhyZWYpO2lmKG09PT1SYil7dmFyIGg9ZS5hdHRyKFwiaHJlZlwiKXx8ZS5hdHRyKFwieGxpbms6aHJlZlwiKTtpZigwPmguaW5kZXhPZihcIjovL1wiKSlpZihmPVwiI1wiK2IsXCIvXCI9PWhbMF0pZj1uK2YraDtlbHNlIGlmKFwiI1wiPT1oWzBdKWY9bitmKyhrLnBhdGgoKXx8XCIvXCIpK2g7ZWxzZXtmb3IodmFyIGw9ay5wYXRoKCkuc3BsaXQoXCIvXCIpLGg9aC5zcGxpdChcIi9cIikscD0wO3A8aC5sZW5ndGg7cCsrKVwiLlwiIT1oW3BdJiYoXCIuLlwiPT1oW3BdP2wucG9wKCk6aFtwXS5sZW5ndGgmJmwucHVzaChoW3BdKSk7Zj1uK2YrbC5qb2luKFwiL1wiKX19bD1rLiQkcmV3cml0ZShmKTtmJiYoIWUuYXR0cihcInRhcmdldFwiKSYmXG5sJiYhYS5pc0RlZmF1bHRQcmV2ZW50ZWQoKSkmJihhLnByZXZlbnREZWZhdWx0KCksbCE9ZC51cmwoKSYmKGsuJCRwYXJzZShsKSxjLiRhcHBseSgpLFQuYW5ndWxhcltcImZmLTY4NDIwOC1wcmV2ZW50RGVmYXVsdFwiXT0hMCkpfX0pO2suYWJzVXJsKCkhPWwmJmQudXJsKGsuYWJzVXJsKCksITApO2Qub25VcmxDaGFuZ2UoZnVuY3Rpb24oYSl7ay5hYnNVcmwoKSE9YSYmKGMuJGV2YWxBc3luYyhmdW5jdGlvbigpe3ZhciBiPWsuYWJzVXJsKCk7ay4kJHBhcnNlKGEpO2MuJGJyb2FkY2FzdChcIiRsb2NhdGlvbkNoYW5nZVN0YXJ0XCIsYSxiKS5kZWZhdWx0UHJldmVudGVkPyhrLiQkcGFyc2UoYiksZC51cmwoYikpOmYoYil9KSxjLiQkcGhhc2V8fGMuJGRpZ2VzdCgpKX0pO3ZhciBwPTA7Yy4kd2F0Y2goZnVuY3Rpb24oKXt2YXIgYT1kLnVybCgpLGI9ay4kJHJlcGxhY2U7cCYmYT09ay5hYnNVcmwoKXx8KHArKyxjLiRldmFsQXN5bmMoZnVuY3Rpb24oKXtjLiRicm9hZGNhc3QoXCIkbG9jYXRpb25DaGFuZ2VTdGFydFwiLFxuay5hYnNVcmwoKSxhKS5kZWZhdWx0UHJldmVudGVkP2suJCRwYXJzZShhKTooZC51cmwoay5hYnNVcmwoKSxiKSxmKGEpKX0pKTtrLiQkcmVwbGFjZT0hMTtyZXR1cm4gcH0pO3JldHVybiBrfV19ZnVuY3Rpb24gV2QoKXt2YXIgYj0hMCxhPXRoaXM7dGhpcy5kZWJ1Z0VuYWJsZWQ9ZnVuY3Rpb24oYSl7cmV0dXJuIEIoYSk/KGI9YSx0aGlzKTpifTt0aGlzLiRnZXQ9W1wiJHdpbmRvd1wiLGZ1bmN0aW9uKGMpe2Z1bmN0aW9uIGQoYSl7YSBpbnN0YW5jZW9mIEVycm9yJiYoYS5zdGFjaz9hPWEubWVzc2FnZSYmLTE9PT1hLnN0YWNrLmluZGV4T2YoYS5tZXNzYWdlKT9cIkVycm9yOiBcIithLm1lc3NhZ2UrXCJcXG5cIithLnN0YWNrOmEuc3RhY2s6YS5zb3VyY2VVUkwmJihhPWEubWVzc2FnZStcIlxcblwiK2Euc291cmNlVVJMK1wiOlwiK2EubGluZSkpO3JldHVybiBhfWZ1bmN0aW9uIGUoYSl7dmFyIGI9Yy5jb25zb2xlfHx7fSxlPWJbYV18fGIubG9nfHx5O2E9ITE7dHJ5e2E9ISFlLmFwcGx5fWNhdGNoKG0pe31yZXR1cm4gYT9cbmZ1bmN0aW9uKCl7dmFyIGE9W107cShhcmd1bWVudHMsZnVuY3Rpb24oYil7YS5wdXNoKGQoYikpfSk7cmV0dXJuIGUuYXBwbHkoYixhKX06ZnVuY3Rpb24oYSxiKXtlKGEsbnVsbD09Yj9cIlwiOmIpfX1yZXR1cm57bG9nOmUoXCJsb2dcIiksaW5mbzplKFwiaW5mb1wiKSx3YXJuOmUoXCJ3YXJuXCIpLGVycm9yOmUoXCJlcnJvclwiKSxkZWJ1ZzpmdW5jdGlvbigpe3ZhciBjPWUoXCJkZWJ1Z1wiKTtyZXR1cm4gZnVuY3Rpb24oKXtiJiZjLmFwcGx5KGEsYXJndW1lbnRzKX19KCl9fV19ZnVuY3Rpb24gZWEoYixhKXtpZihcImNvbnN0cnVjdG9yXCI9PT1iKXRocm93IERhKFwiaXNlY2ZsZFwiLGEpO3JldHVybiBifWZ1bmN0aW9uIGFiKGIsYSl7aWYoYil7aWYoYi5jb25zdHJ1Y3Rvcj09PWIpdGhyb3cgRGEoXCJpc2VjZm5cIixhKTtpZihiLmRvY3VtZW50JiZiLmxvY2F0aW9uJiZiLmFsZXJ0JiZiLnNldEludGVydmFsKXRocm93IERhKFwiaXNlY3dpbmRvd1wiLGEpO2lmKGIuY2hpbGRyZW4mJihiLm5vZGVOYW1lfHxiLnByb3AmJlxuYi5hdHRyJiZiLmZpbmQpKXRocm93IERhKFwiaXNlY2RvbVwiLGEpO31yZXR1cm4gYn1mdW5jdGlvbiByYihiLGEsYyxkLGUpe2U9ZXx8e307YT1hLnNwbGl0KFwiLlwiKTtmb3IodmFyIGcsZj0wOzE8YS5sZW5ndGg7ZisrKXtnPWVhKGEuc2hpZnQoKSxkKTt2YXIgaz1iW2ddO2t8fChrPXt9LGJbZ109ayk7Yj1rO2IudGhlbiYmZS51bndyYXBQcm9taXNlcyYmKHRhKGQpLFwiJCR2XCJpbiBifHxmdW5jdGlvbihhKXthLnRoZW4oZnVuY3Rpb24oYil7YS4kJHY9Yn0pfShiKSxiLiQkdj09PXMmJihiLiQkdj17fSksYj1iLiQkdil9Zz1lYShhLnNoaWZ0KCksZCk7cmV0dXJuIGJbZ109Y31mdW5jdGlvbiBFYyhiLGEsYyxkLGUsZyxmKXtlYShiLGcpO2VhKGEsZyk7ZWEoYyxnKTtlYShkLGcpO2VhKGUsZyk7cmV0dXJuIGYudW53cmFwUHJvbWlzZXM/ZnVuY3Rpb24oZixtKXt2YXIgaD1tJiZtLmhhc093blByb3BlcnR5KGIpP206ZixsO2lmKG51bGw9PWgpcmV0dXJuIGg7KGg9aFtiXSkmJmgudGhlbiYmXG4odGEoZyksXCIkJHZcImluIGh8fChsPWgsbC4kJHY9cyxsLnRoZW4oZnVuY3Rpb24oYSl7bC4kJHY9YX0pKSxoPWguJCR2KTtpZighYSlyZXR1cm4gaDtpZihudWxsPT1oKXJldHVybiBzOyhoPWhbYV0pJiZoLnRoZW4mJih0YShnKSxcIiQkdlwiaW4gaHx8KGw9aCxsLiQkdj1zLGwudGhlbihmdW5jdGlvbihhKXtsLiQkdj1hfSkpLGg9aC4kJHYpO2lmKCFjKXJldHVybiBoO2lmKG51bGw9PWgpcmV0dXJuIHM7KGg9aFtjXSkmJmgudGhlbiYmKHRhKGcpLFwiJCR2XCJpbiBofHwobD1oLGwuJCR2PXMsbC50aGVuKGZ1bmN0aW9uKGEpe2wuJCR2PWF9KSksaD1oLiQkdik7aWYoIWQpcmV0dXJuIGg7aWYobnVsbD09aClyZXR1cm4gczsoaD1oW2RdKSYmaC50aGVuJiYodGEoZyksXCIkJHZcImluIGh8fChsPWgsbC4kJHY9cyxsLnRoZW4oZnVuY3Rpb24oYSl7bC4kJHY9YX0pKSxoPWguJCR2KTtpZighZSlyZXR1cm4gaDtpZihudWxsPT1oKXJldHVybiBzOyhoPWhbZV0pJiZoLnRoZW4mJih0YShnKSxcIiQkdlwiaW5cbmh8fChsPWgsbC4kJHY9cyxsLnRoZW4oZnVuY3Rpb24oYSl7bC4kJHY9YX0pKSxoPWguJCR2KTtyZXR1cm4gaH06ZnVuY3Rpb24oZyxmKXt2YXIgaD1mJiZmLmhhc093blByb3BlcnR5KGIpP2Y6ZztpZihudWxsPT1oKXJldHVybiBoO2g9aFtiXTtpZighYSlyZXR1cm4gaDtpZihudWxsPT1oKXJldHVybiBzO2g9aFthXTtpZighYylyZXR1cm4gaDtpZihudWxsPT1oKXJldHVybiBzO2g9aFtjXTtpZighZClyZXR1cm4gaDtpZihudWxsPT1oKXJldHVybiBzO2g9aFtkXTtyZXR1cm4gZT9udWxsPT1oP3M6aD1oW2VdOmh9fWZ1bmN0aW9uIHllKGIsYSl7ZWEoYixhKTtyZXR1cm4gZnVuY3Rpb24oYSxkKXtyZXR1cm4gbnVsbD09YT9zOihkJiZkLmhhc093blByb3BlcnR5KGIpP2Q6YSlbYl19fWZ1bmN0aW9uIHplKGIsYSxjKXtlYShiLGMpO2VhKGEsYyk7cmV0dXJuIGZ1bmN0aW9uKGMsZSl7aWYobnVsbD09YylyZXR1cm4gcztjPShlJiZlLmhhc093blByb3BlcnR5KGIpP2U6YylbYl07cmV0dXJuIG51bGw9PVxuYz9zOmNbYV19fWZ1bmN0aW9uIEZjKGIsYSxjKXtpZihTYi5oYXNPd25Qcm9wZXJ0eShiKSlyZXR1cm4gU2JbYl07dmFyIGQ9Yi5zcGxpdChcIi5cIiksZT1kLmxlbmd0aCxnO2lmKGEudW53cmFwUHJvbWlzZXN8fDEhPT1lKWlmKGEudW53cmFwUHJvbWlzZXN8fDIhPT1lKWlmKGEuY3NwKWc9Nj5lP0VjKGRbMF0sZFsxXSxkWzJdLGRbM10sZFs0XSxjLGEpOmZ1bmN0aW9uKGIsZyl7dmFyIGY9MCxrO2RvIGs9RWMoZFtmKytdLGRbZisrXSxkW2YrK10sZFtmKytdLGRbZisrXSxjLGEpKGIsZyksZz1zLGI9azt3aGlsZShmPGUpO3JldHVybiBrfTtlbHNle3ZhciBmPVwidmFyIHA7XFxuXCI7cShkLGZ1bmN0aW9uKGIsZCl7ZWEoYixjKTtmKz1cImlmKHMgPT0gbnVsbCkgcmV0dXJuIHVuZGVmaW5lZDtcXG5zPVwiKyhkP1wic1wiOicoKGsmJmsuaGFzT3duUHJvcGVydHkoXCInK2IrJ1wiKSk/azpzKScpKydbXCInK2IrJ1wiXTtcXG4nKyhhLnVud3JhcFByb21pc2VzPydpZiAocyAmJiBzLnRoZW4pIHtcXG4gcHcoXCInK1xuYy5yZXBsYWNlKC8oW1wiXFxyXFxuXSkvZyxcIlxcXFwkMVwiKSsnXCIpO1xcbiBpZiAoIShcIiQkdlwiIGluIHMpKSB7XFxuIHA9cztcXG4gcC4kJHYgPSB1bmRlZmluZWQ7XFxuIHAudGhlbihmdW5jdGlvbih2KSB7cC4kJHY9djt9KTtcXG59XFxuIHM9cy4kJHZcXG59XFxuJzpcIlwiKX0pO3ZhciBmPWYrXCJyZXR1cm4gcztcIixrPW5ldyBGdW5jdGlvbihcInNcIixcImtcIixcInB3XCIsZik7ay50b1N0cmluZz0kKGYpO2c9YS51bndyYXBQcm9taXNlcz9mdW5jdGlvbihhLGIpe3JldHVybiBrKGEsYix0YSl9Omt9ZWxzZSBnPXplKGRbMF0sZFsxXSxjKTtlbHNlIGc9eWUoZFswXSxjKTtcImhhc093blByb3BlcnR5XCIhPT1iJiYoU2JbYl09Zyk7cmV0dXJuIGd9ZnVuY3Rpb24gWGQoKXt2YXIgYj17fSxhPXtjc3A6ITEsdW53cmFwUHJvbWlzZXM6ITEsbG9nUHJvbWlzZVdhcm5pbmdzOiEwfTt0aGlzLnVud3JhcFByb21pc2VzPWZ1bmN0aW9uKGIpe3JldHVybiBCKGIpPyhhLnVud3JhcFByb21pc2VzPSEhYix0aGlzKTphLnVud3JhcFByb21pc2VzfTtcbnRoaXMubG9nUHJvbWlzZVdhcm5pbmdzPWZ1bmN0aW9uKGIpe3JldHVybiBCKGIpPyhhLmxvZ1Byb21pc2VXYXJuaW5ncz1iLHRoaXMpOmEubG9nUHJvbWlzZVdhcm5pbmdzfTt0aGlzLiRnZXQ9W1wiJGZpbHRlclwiLFwiJHNuaWZmZXJcIixcIiRsb2dcIixmdW5jdGlvbihjLGQsZSl7YS5jc3A9ZC5jc3A7dGE9ZnVuY3Rpb24oYil7YS5sb2dQcm9taXNlV2FybmluZ3MmJiFHYy5oYXNPd25Qcm9wZXJ0eShiKSYmKEdjW2JdPSEwLGUud2FybihcIlskcGFyc2VdIFByb21pc2UgZm91bmQgaW4gdGhlIGV4cHJlc3Npb24gYFwiK2IrXCJgLiBBdXRvbWF0aWMgdW53cmFwcGluZyBvZiBwcm9taXNlcyBpbiBBbmd1bGFyIGV4cHJlc3Npb25zIGlzIGRlcHJlY2F0ZWQuXCIpKX07cmV0dXJuIGZ1bmN0aW9uKGQpe3ZhciBlO3N3aXRjaCh0eXBlb2YgZCl7Y2FzZSBcInN0cmluZ1wiOmlmKGIuaGFzT3duUHJvcGVydHkoZCkpcmV0dXJuIGJbZF07ZT1uZXcgVGIoYSk7ZT0obmV3IGJiKGUsYyxhKSkucGFyc2UoZCk7XCJoYXNPd25Qcm9wZXJ0eVwiIT09XG5kJiYoYltkXT1lKTtyZXR1cm4gZTtjYXNlIFwiZnVuY3Rpb25cIjpyZXR1cm4gZDtkZWZhdWx0OnJldHVybiB5fX19XX1mdW5jdGlvbiBaZCgpe3RoaXMuJGdldD1bXCIkcm9vdFNjb3BlXCIsXCIkZXhjZXB0aW9uSGFuZGxlclwiLGZ1bmN0aW9uKGIsYSl7cmV0dXJuIEFlKGZ1bmN0aW9uKGEpe2IuJGV2YWxBc3luYyhhKX0sYSl9XX1mdW5jdGlvbiBBZShiLGEpe2Z1bmN0aW9uIGMoYSl7cmV0dXJuIGF9ZnVuY3Rpb24gZChhKXtyZXR1cm4gZihhKX12YXIgZT1mdW5jdGlvbigpe3ZhciBmPVtdLGgsbDtyZXR1cm4gbD17cmVzb2x2ZTpmdW5jdGlvbihhKXtpZihmKXt2YXIgYz1mO2Y9cztoPWcoYSk7Yy5sZW5ndGgmJmIoZnVuY3Rpb24oKXtmb3IodmFyIGEsYj0wLGQ9Yy5sZW5ndGg7YjxkO2IrKylhPWNbYl0saC50aGVuKGFbMF0sYVsxXSxhWzJdKX0pfX0scmVqZWN0OmZ1bmN0aW9uKGEpe2wucmVzb2x2ZShrKGEpKX0sbm90aWZ5OmZ1bmN0aW9uKGEpe2lmKGYpe3ZhciBjPWY7Zi5sZW5ndGgmJlxuYihmdW5jdGlvbigpe2Zvcih2YXIgYixkPTAsZT1jLmxlbmd0aDtkPGU7ZCsrKWI9Y1tkXSxiWzJdKGEpfSl9fSxwcm9taXNlOnt0aGVuOmZ1bmN0aW9uKGIsZyxrKXt2YXIgbD1lKCksST1mdW5jdGlvbihkKXt0cnl7bC5yZXNvbHZlKChRKGIpP2I6YykoZCkpfWNhdGNoKGUpe2wucmVqZWN0KGUpLGEoZSl9fSx4PWZ1bmN0aW9uKGIpe3RyeXtsLnJlc29sdmUoKFEoZyk/ZzpkKShiKSl9Y2F0Y2goYyl7bC5yZWplY3QoYyksYShjKX19LHU9ZnVuY3Rpb24oYil7dHJ5e2wubm90aWZ5KChRKGspP2s6YykoYikpfWNhdGNoKGQpe2EoZCl9fTtmP2YucHVzaChbSSx4LHVdKTpoLnRoZW4oSSx4LHUpO3JldHVybiBsLnByb21pc2V9LFwiY2F0Y2hcIjpmdW5jdGlvbihhKXtyZXR1cm4gdGhpcy50aGVuKG51bGwsYSl9LFwiZmluYWxseVwiOmZ1bmN0aW9uKGEpe2Z1bmN0aW9uIGIoYSxjKXt2YXIgZD1lKCk7Yz9kLnJlc29sdmUoYSk6ZC5yZWplY3QoYSk7cmV0dXJuIGQucHJvbWlzZX1mdW5jdGlvbiBkKGUsXG5nKXt2YXIgZj1udWxsO3RyeXtmPShhfHxjKSgpfWNhdGNoKGspe3JldHVybiBiKGssITEpfXJldHVybiBmJiZRKGYudGhlbik/Zi50aGVuKGZ1bmN0aW9uKCl7cmV0dXJuIGIoZSxnKX0sZnVuY3Rpb24oYSl7cmV0dXJuIGIoYSwhMSl9KTpiKGUsZyl9cmV0dXJuIHRoaXMudGhlbihmdW5jdGlvbihhKXtyZXR1cm4gZChhLCEwKX0sZnVuY3Rpb24oYSl7cmV0dXJuIGQoYSwhMSl9KX19fX0sZz1mdW5jdGlvbihhKXtyZXR1cm4gYSYmUShhLnRoZW4pP2E6e3RoZW46ZnVuY3Rpb24oYyl7dmFyIGQ9ZSgpO2IoZnVuY3Rpb24oKXtkLnJlc29sdmUoYyhhKSl9KTtyZXR1cm4gZC5wcm9taXNlfX19LGY9ZnVuY3Rpb24oYSl7dmFyIGI9ZSgpO2IucmVqZWN0KGEpO3JldHVybiBiLnByb21pc2V9LGs9ZnVuY3Rpb24oYyl7cmV0dXJue3RoZW46ZnVuY3Rpb24oZyxmKXt2YXIgaz1lKCk7YihmdW5jdGlvbigpe3RyeXtrLnJlc29sdmUoKFEoZik/ZjpkKShjKSl9Y2F0Y2goYil7ay5yZWplY3QoYiksXG5hKGIpfX0pO3JldHVybiBrLnByb21pc2V9fX07cmV0dXJue2RlZmVyOmUscmVqZWN0OmYsd2hlbjpmdW5jdGlvbihrLGgsbCxuKXt2YXIgcD1lKCkscix2PWZ1bmN0aW9uKGIpe3RyeXtyZXR1cm4oUShoKT9oOmMpKGIpfWNhdGNoKGQpe3JldHVybiBhKGQpLGYoZCl9fSxJPWZ1bmN0aW9uKGIpe3RyeXtyZXR1cm4oUShsKT9sOmQpKGIpfWNhdGNoKGMpe3JldHVybiBhKGMpLGYoYyl9fSx4PWZ1bmN0aW9uKGIpe3RyeXtyZXR1cm4oUShuKT9uOmMpKGIpfWNhdGNoKGQpe2EoZCl9fTtiKGZ1bmN0aW9uKCl7ZyhrKS50aGVuKGZ1bmN0aW9uKGEpe3J8fChyPSEwLHAucmVzb2x2ZShnKGEpLnRoZW4odixJLHgpKSl9LGZ1bmN0aW9uKGEpe3J8fChyPSEwLHAucmVzb2x2ZShJKGEpKSl9LGZ1bmN0aW9uKGEpe3J8fHAubm90aWZ5KHgoYSkpfSl9KTtyZXR1cm4gcC5wcm9taXNlfSxhbGw6ZnVuY3Rpb24oYSl7dmFyIGI9ZSgpLGM9MCxkPU8oYSk/W106e307cShhLGZ1bmN0aW9uKGEsZSl7YysrO1xuZyhhKS50aGVuKGZ1bmN0aW9uKGEpe2QuaGFzT3duUHJvcGVydHkoZSl8fChkW2VdPWEsLS1jfHxiLnJlc29sdmUoZCkpfSxmdW5jdGlvbihhKXtkLmhhc093blByb3BlcnR5KGUpfHxiLnJlamVjdChhKX0pfSk7MD09PWMmJmIucmVzb2x2ZShkKTtyZXR1cm4gYi5wcm9taXNlfX19ZnVuY3Rpb24gZmUoKXt0aGlzLiRnZXQ9W1wiJHdpbmRvd1wiLFwiJHRpbWVvdXRcIixmdW5jdGlvbihiLGEpe3ZhciBjPWIucmVxdWVzdEFuaW1hdGlvbkZyYW1lfHxiLndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZXx8Yi5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUsZD1iLmNhbmNlbEFuaW1hdGlvbkZyYW1lfHxiLndlYmtpdENhbmNlbEFuaW1hdGlvbkZyYW1lfHxiLm1vekNhbmNlbEFuaW1hdGlvbkZyYW1lfHxiLndlYmtpdENhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZSxlPSEhYyxnPWU/ZnVuY3Rpb24oYSl7dmFyIGI9YyhhKTtyZXR1cm4gZnVuY3Rpb24oKXtkKGIpfX06ZnVuY3Rpb24oYil7dmFyIGM9XG5hKGIsMTYuNjYsITEpO3JldHVybiBmdW5jdGlvbigpe2EuY2FuY2VsKGMpfX07Zy5zdXBwb3J0ZWQ9ZTtyZXR1cm4gZ31dfWZ1bmN0aW9uIFlkKCl7dmFyIGI9MTAsYT10KFwiJHJvb3RTY29wZVwiKSxjPW51bGw7dGhpcy5kaWdlc3RUdGw9ZnVuY3Rpb24oYSl7YXJndW1lbnRzLmxlbmd0aCYmKGI9YSk7cmV0dXJuIGJ9O3RoaXMuJGdldD1bXCIkaW5qZWN0b3JcIixcIiRleGNlcHRpb25IYW5kbGVyXCIsXCIkcGFyc2VcIixcIiRicm93c2VyXCIsZnVuY3Rpb24oZCxlLGcsZil7ZnVuY3Rpb24gaygpe3RoaXMuJGlkPWViKCk7dGhpcy4kJHBoYXNlPXRoaXMuJHBhcmVudD10aGlzLiQkd2F0Y2hlcnM9dGhpcy4kJG5leHRTaWJsaW5nPXRoaXMuJCRwcmV2U2libGluZz10aGlzLiQkY2hpbGRIZWFkPXRoaXMuJCRjaGlsZFRhaWw9bnVsbDt0aGlzW1widGhpc1wiXT10aGlzLiRyb290PXRoaXM7dGhpcy4kJGRlc3Ryb3llZD0hMTt0aGlzLiQkYXN5bmNRdWV1ZT1bXTt0aGlzLiQkcG9zdERpZ2VzdFF1ZXVlPVtdO1xudGhpcy4kJGxpc3RlbmVycz17fTt0aGlzLiQkbGlzdGVuZXJDb3VudD17fTt0aGlzLiQkaXNvbGF0ZUJpbmRpbmdzPXt9fWZ1bmN0aW9uIG0oYil7aWYocC4kJHBoYXNlKXRocm93IGEoXCJpbnByb2dcIixwLiQkcGhhc2UpO3AuJCRwaGFzZT1ifWZ1bmN0aW9uIGgoYSxiKXt2YXIgYz1nKGEpO1RhKGMsYik7cmV0dXJuIGN9ZnVuY3Rpb24gbChhLGIsYyl7ZG8gYS4kJGxpc3RlbmVyQ291bnRbY10tPWIsMD09PWEuJCRsaXN0ZW5lckNvdW50W2NdJiZkZWxldGUgYS4kJGxpc3RlbmVyQ291bnRbY107d2hpbGUoYT1hLiRwYXJlbnQpfWZ1bmN0aW9uIG4oKXt9ay5wcm90b3R5cGU9e2NvbnN0cnVjdG9yOmssJG5ldzpmdW5jdGlvbihhKXthPyhhPW5ldyBrLGEuJHJvb3Q9dGhpcy4kcm9vdCxhLiQkYXN5bmNRdWV1ZT10aGlzLiQkYXN5bmNRdWV1ZSxhLiQkcG9zdERpZ2VzdFF1ZXVlPXRoaXMuJCRwb3N0RGlnZXN0UXVldWUpOih0aGlzLiQkY2hpbGRTY29wZUNsYXNzfHwodGhpcy4kJGNoaWxkU2NvcGVDbGFzcz1cbmZ1bmN0aW9uKCl7dGhpcy4kJHdhdGNoZXJzPXRoaXMuJCRuZXh0U2libGluZz10aGlzLiQkY2hpbGRIZWFkPXRoaXMuJCRjaGlsZFRhaWw9bnVsbDt0aGlzLiQkbGlzdGVuZXJzPXt9O3RoaXMuJCRsaXN0ZW5lckNvdW50PXt9O3RoaXMuJGlkPWViKCk7dGhpcy4kJGNoaWxkU2NvcGVDbGFzcz1udWxsfSx0aGlzLiQkY2hpbGRTY29wZUNsYXNzLnByb3RvdHlwZT10aGlzKSxhPW5ldyB0aGlzLiQkY2hpbGRTY29wZUNsYXNzKTthW1widGhpc1wiXT1hO2EuJHBhcmVudD10aGlzO2EuJCRwcmV2U2libGluZz10aGlzLiQkY2hpbGRUYWlsO3RoaXMuJCRjaGlsZEhlYWQ/dGhpcy4kJGNoaWxkVGFpbD10aGlzLiQkY2hpbGRUYWlsLiQkbmV4dFNpYmxpbmc9YTp0aGlzLiQkY2hpbGRIZWFkPXRoaXMuJCRjaGlsZFRhaWw9YTtyZXR1cm4gYX0sJHdhdGNoOmZ1bmN0aW9uKGEsYixkKXt2YXIgZT1oKGEsXCJ3YXRjaFwiKSxnPXRoaXMuJCR3YXRjaGVycyxmPXtmbjpiLGxhc3Q6bixnZXQ6ZSxleHA6YSxcbmVxOiEhZH07Yz1udWxsO2lmKCFRKGIpKXt2YXIgaz1oKGJ8fHksXCJsaXN0ZW5lclwiKTtmLmZuPWZ1bmN0aW9uKGEsYixjKXtrKGMpfX1pZihcInN0cmluZ1wiPT10eXBlb2YgYSYmZS5jb25zdGFudCl7dmFyIG09Zi5mbjtmLmZuPWZ1bmN0aW9uKGEsYixjKXttLmNhbGwodGhpcyxhLGIsYyk7UGEoZyxmKX19Z3x8KGc9dGhpcy4kJHdhdGNoZXJzPVtdKTtnLnVuc2hpZnQoZik7cmV0dXJuIGZ1bmN0aW9uKCl7UGEoZyxmKTtjPW51bGx9fSwkd2F0Y2hDb2xsZWN0aW9uOmZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpcyxkLGUsZixrPTE8Yi5sZW5ndGgsaD0wLG09ZyhhKSxsPVtdLG49e30scD0hMCxxPTA7cmV0dXJuIHRoaXMuJHdhdGNoKGZ1bmN0aW9uKCl7ZD1tKGMpO3ZhciBhLGI7aWYoVShkKSlpZihkYihkKSlmb3IoZSE9PWwmJihlPWwscT1lLmxlbmd0aD0wLGgrKyksYT1kLmxlbmd0aCxxIT09YSYmKGgrKyxlLmxlbmd0aD1xPWEpLGI9MDtiPGE7YisrKWVbYl0hPT1lW2JdJiZkW2JdIT09XG5kW2JdfHxlW2JdPT09ZFtiXXx8KGgrKyxlW2JdPWRbYl0pO2Vsc2V7ZSE9PW4mJihlPW49e30scT0wLGgrKyk7YT0wO2ZvcihiIGluIGQpZC5oYXNPd25Qcm9wZXJ0eShiKSYmKGErKyxlLmhhc093blByb3BlcnR5KGIpP2VbYl0hPT1kW2JdJiYoaCsrLGVbYl09ZFtiXSk6KHErKyxlW2JdPWRbYl0saCsrKSk7aWYocT5hKWZvcihiIGluIGgrKyxlKWUuaGFzT3duUHJvcGVydHkoYikmJiFkLmhhc093blByb3BlcnR5KGIpJiYocS0tLGRlbGV0ZSBlW2JdKX1lbHNlIGUhPT1kJiYoZT1kLGgrKyk7cmV0dXJuIGh9LGZ1bmN0aW9uKCl7cD8ocD0hMSxiKGQsZCxjKSk6YihkLGYsYyk7aWYoaylpZihVKGQpKWlmKGRiKGQpKXtmPUFycmF5KGQubGVuZ3RoKTtmb3IodmFyIGE9MDthPGQubGVuZ3RoO2ErKylmW2FdPWRbYV19ZWxzZSBmb3IoYSBpbiBmPXt9LGQpemIuY2FsbChkLGEpJiYoZlthXT1kW2FdKTtlbHNlIGY9ZH0pfSwkZGlnZXN0OmZ1bmN0aW9uKCl7dmFyIGQsZyxmLGssaD10aGlzLiQkYXN5bmNRdWV1ZSxcbmw9dGhpcy4kJHBvc3REaWdlc3RRdWV1ZSxxLHoscz1iLFAsTj1bXSx3LEUsQTttKFwiJGRpZ2VzdFwiKTtjPW51bGw7ZG97ej0hMTtmb3IoUD10aGlzO2gubGVuZ3RoOyl7dHJ5e0E9aC5zaGlmdCgpLEEuc2NvcGUuJGV2YWwoQS5leHByZXNzaW9uKX1jYXRjaChIKXtwLiQkcGhhc2U9bnVsbCxlKEgpfWM9bnVsbH1hOmRve2lmKGs9UC4kJHdhdGNoZXJzKWZvcihxPWsubGVuZ3RoO3EtLTspdHJ5e2lmKGQ9a1txXSlpZigoZz1kLmdldChQKSkhPT0oZj1kLmxhc3QpJiYhKGQuZXE/eGEoZyxmKTpcIm51bWJlclwiPT10eXBlb2YgZyYmXCJudW1iZXJcIj09dHlwZW9mIGYmJmlzTmFOKGcpJiZpc05hTihmKSkpej0hMCxjPWQsZC5sYXN0PWQuZXE/R2EoZyxudWxsKTpnLGQuZm4oZyxmPT09bj9nOmYsUCksNT5zJiYodz00LXMsTlt3XXx8KE5bd109W10pLEU9UShkLmV4cCk/XCJmbjogXCIrKGQuZXhwLm5hbWV8fGQuZXhwLnRvU3RyaW5nKCkpOmQuZXhwLEUrPVwiOyBuZXdWYWw6IFwiK3JhKGcpK1wiOyBvbGRWYWw6IFwiK1xucmEoZiksTlt3XS5wdXNoKEUpKTtlbHNlIGlmKGQ9PT1jKXt6PSExO2JyZWFrIGF9fWNhdGNoKEIpe3AuJCRwaGFzZT1udWxsLGUoQil9aWYoIShrPVAuJCRjaGlsZEhlYWR8fFAhPT10aGlzJiZQLiQkbmV4dFNpYmxpbmcpKWZvcig7UCE9PXRoaXMmJiEoaz1QLiQkbmV4dFNpYmxpbmcpOylQPVAuJHBhcmVudH13aGlsZShQPWspO2lmKCh6fHxoLmxlbmd0aCkmJiFzLS0pdGhyb3cgcC4kJHBoYXNlPW51bGwsYShcImluZmRpZ1wiLGIscmEoTikpO313aGlsZSh6fHxoLmxlbmd0aCk7Zm9yKHAuJCRwaGFzZT1udWxsO2wubGVuZ3RoOyl0cnl7bC5zaGlmdCgpKCl9Y2F0Y2godCl7ZSh0KX19LCRkZXN0cm95OmZ1bmN0aW9uKCl7aWYoIXRoaXMuJCRkZXN0cm95ZWQpe3ZhciBhPXRoaXMuJHBhcmVudDt0aGlzLiRicm9hZGNhc3QoXCIkZGVzdHJveVwiKTt0aGlzLiQkZGVzdHJveWVkPSEwO3RoaXMhPT1wJiYocSh0aGlzLiQkbGlzdGVuZXJDb3VudCxBYihudWxsLGwsdGhpcykpLGEuJCRjaGlsZEhlYWQ9PVxudGhpcyYmKGEuJCRjaGlsZEhlYWQ9dGhpcy4kJG5leHRTaWJsaW5nKSxhLiQkY2hpbGRUYWlsPT10aGlzJiYoYS4kJGNoaWxkVGFpbD10aGlzLiQkcHJldlNpYmxpbmcpLHRoaXMuJCRwcmV2U2libGluZyYmKHRoaXMuJCRwcmV2U2libGluZy4kJG5leHRTaWJsaW5nPXRoaXMuJCRuZXh0U2libGluZyksdGhpcy4kJG5leHRTaWJsaW5nJiYodGhpcy4kJG5leHRTaWJsaW5nLiQkcHJldlNpYmxpbmc9dGhpcy4kJHByZXZTaWJsaW5nKSx0aGlzLiRwYXJlbnQ9dGhpcy4kJG5leHRTaWJsaW5nPXRoaXMuJCRwcmV2U2libGluZz10aGlzLiQkY2hpbGRIZWFkPXRoaXMuJCRjaGlsZFRhaWw9dGhpcy4kcm9vdD1udWxsLHRoaXMuJCRsaXN0ZW5lcnM9e30sdGhpcy4kJHdhdGNoZXJzPXRoaXMuJCRhc3luY1F1ZXVlPXRoaXMuJCRwb3N0RGlnZXN0UXVldWU9W10sdGhpcy4kZGVzdHJveT10aGlzLiRkaWdlc3Q9dGhpcy4kYXBwbHk9eSx0aGlzLiRvbj10aGlzLiR3YXRjaD1mdW5jdGlvbigpe3JldHVybiB5fSl9fSxcbiRldmFsOmZ1bmN0aW9uKGEsYil7cmV0dXJuIGcoYSkodGhpcyxiKX0sJGV2YWxBc3luYzpmdW5jdGlvbihhKXtwLiQkcGhhc2V8fHAuJCRhc3luY1F1ZXVlLmxlbmd0aHx8Zi5kZWZlcihmdW5jdGlvbigpe3AuJCRhc3luY1F1ZXVlLmxlbmd0aCYmcC4kZGlnZXN0KCl9KTt0aGlzLiQkYXN5bmNRdWV1ZS5wdXNoKHtzY29wZTp0aGlzLGV4cHJlc3Npb246YX0pfSwkJHBvc3REaWdlc3Q6ZnVuY3Rpb24oYSl7dGhpcy4kJHBvc3REaWdlc3RRdWV1ZS5wdXNoKGEpfSwkYXBwbHk6ZnVuY3Rpb24oYSl7dHJ5e3JldHVybiBtKFwiJGFwcGx5XCIpLHRoaXMuJGV2YWwoYSl9Y2F0Y2goYil7ZShiKX1maW5hbGx5e3AuJCRwaGFzZT1udWxsO3RyeXtwLiRkaWdlc3QoKX1jYXRjaChjKXt0aHJvdyBlKGMpLGM7fX19LCRvbjpmdW5jdGlvbihhLGIpe3ZhciBjPXRoaXMuJCRsaXN0ZW5lcnNbYV07Y3x8KHRoaXMuJCRsaXN0ZW5lcnNbYV09Yz1bXSk7Yy5wdXNoKGIpO3ZhciBkPXRoaXM7ZG8gZC4kJGxpc3RlbmVyQ291bnRbYV18fFxuKGQuJCRsaXN0ZW5lckNvdW50W2FdPTApLGQuJCRsaXN0ZW5lckNvdW50W2FdKys7d2hpbGUoZD1kLiRwYXJlbnQpO3ZhciBlPXRoaXM7cmV0dXJuIGZ1bmN0aW9uKCl7Y1tPYShjLGIpXT1udWxsO2woZSwxLGEpfX0sJGVtaXQ6ZnVuY3Rpb24oYSxiKXt2YXIgYz1bXSxkLGc9dGhpcyxmPSExLGs9e25hbWU6YSx0YXJnZXRTY29wZTpnLHN0b3BQcm9wYWdhdGlvbjpmdW5jdGlvbigpe2Y9ITB9LHByZXZlbnREZWZhdWx0OmZ1bmN0aW9uKCl7ay5kZWZhdWx0UHJldmVudGVkPSEwfSxkZWZhdWx0UHJldmVudGVkOiExfSxoPVtrXS5jb25jYXQoeWEuY2FsbChhcmd1bWVudHMsMSkpLG0sbDtkb3tkPWcuJCRsaXN0ZW5lcnNbYV18fGM7ay5jdXJyZW50U2NvcGU9ZzttPTA7Zm9yKGw9ZC5sZW5ndGg7bTxsO20rKylpZihkW21dKXRyeXtkW21dLmFwcGx5KG51bGwsaCl9Y2F0Y2gobil7ZShuKX1lbHNlIGQuc3BsaWNlKG0sMSksbS0tLGwtLTtpZihmKWJyZWFrO2c9Zy4kcGFyZW50fXdoaWxlKGcpO1xucmV0dXJuIGt9LCRicm9hZGNhc3Q6ZnVuY3Rpb24oYSxiKXtmb3IodmFyIGM9dGhpcyxkPXRoaXMsZz17bmFtZTphLHRhcmdldFNjb3BlOnRoaXMscHJldmVudERlZmF1bHQ6ZnVuY3Rpb24oKXtnLmRlZmF1bHRQcmV2ZW50ZWQ9ITB9LGRlZmF1bHRQcmV2ZW50ZWQ6ITF9LGY9W2ddLmNvbmNhdCh5YS5jYWxsKGFyZ3VtZW50cywxKSksayxoO2M9ZDspe2cuY3VycmVudFNjb3BlPWM7ZD1jLiQkbGlzdGVuZXJzW2FdfHxbXTtrPTA7Zm9yKGg9ZC5sZW5ndGg7azxoO2srKylpZihkW2tdKXRyeXtkW2tdLmFwcGx5KG51bGwsZil9Y2F0Y2gobSl7ZShtKX1lbHNlIGQuc3BsaWNlKGssMSksay0tLGgtLTtpZighKGQ9Yy4kJGxpc3RlbmVyQ291bnRbYV0mJmMuJCRjaGlsZEhlYWR8fGMhPT10aGlzJiZjLiQkbmV4dFNpYmxpbmcpKWZvcig7YyE9PXRoaXMmJiEoZD1jLiQkbmV4dFNpYmxpbmcpOyljPWMuJHBhcmVudH1yZXR1cm4gZ319O3ZhciBwPW5ldyBrO3JldHVybiBwfV19ZnVuY3Rpb24gYmQoKXt2YXIgYj1cbi9eXFxzKihodHRwcz98ZnRwfG1haWx0b3x0ZWx8ZmlsZSk6LyxhPS9eXFxzKihodHRwcz98ZnRwfGZpbGUpOnxkYXRhOmltYWdlXFwvLzt0aGlzLmFIcmVmU2FuaXRpemF0aW9uV2hpdGVsaXN0PWZ1bmN0aW9uKGEpe3JldHVybiBCKGEpPyhiPWEsdGhpcyk6Yn07dGhpcy5pbWdTcmNTYW5pdGl6YXRpb25XaGl0ZWxpc3Q9ZnVuY3Rpb24oYil7cmV0dXJuIEIoYik/KGE9Yix0aGlzKTphfTt0aGlzLiRnZXQ9ZnVuY3Rpb24oKXtyZXR1cm4gZnVuY3Rpb24oYyxkKXt2YXIgZT1kP2E6YixnO2lmKCFTfHw4PD1TKWlmKGc9c2EoYykuaHJlZixcIlwiIT09ZyYmIWcubWF0Y2goZSkpcmV0dXJuXCJ1bnNhZmU6XCIrZztyZXR1cm4gY319fWZ1bmN0aW9uIEJlKGIpe2lmKFwic2VsZlwiPT09YilyZXR1cm4gYjtpZihDKGIpKXtpZigtMTxiLmluZGV4T2YoXCIqKipcIikpdGhyb3cgdWEoXCJpd2NhcmRcIixiKTtiPWIucmVwbGFjZSgvKFstKClcXFtcXF17fSs/Ki4kXFxefCw6IzwhXFxcXF0pL2csXCJcXFxcJDFcIikucmVwbGFjZSgvXFx4MDgvZyxcblwiXFxcXHgwOFwiKS5yZXBsYWNlKFwiXFxcXCpcXFxcKlwiLFwiLipcIikucmVwbGFjZShcIlxcXFwqXCIsXCJbXjovLj8mO10qXCIpO3JldHVybiBSZWdFeHAoXCJeXCIrYitcIiRcIil9aWYoZmIoYikpcmV0dXJuIFJlZ0V4cChcIl5cIitiLnNvdXJjZStcIiRcIik7dGhyb3cgdWEoXCJpbWF0Y2hlclwiKTt9ZnVuY3Rpb24gSGMoYil7dmFyIGE9W107QihiKSYmcShiLGZ1bmN0aW9uKGIpe2EucHVzaChCZShiKSl9KTtyZXR1cm4gYX1mdW5jdGlvbiBhZSgpe3RoaXMuU0NFX0NPTlRFWFRTPWZhO3ZhciBiPVtcInNlbGZcIl0sYT1bXTt0aGlzLnJlc291cmNlVXJsV2hpdGVsaXN0PWZ1bmN0aW9uKGEpe2FyZ3VtZW50cy5sZW5ndGgmJihiPUhjKGEpKTtyZXR1cm4gYn07dGhpcy5yZXNvdXJjZVVybEJsYWNrbGlzdD1mdW5jdGlvbihiKXthcmd1bWVudHMubGVuZ3RoJiYoYT1IYyhiKSk7cmV0dXJuIGF9O3RoaXMuJGdldD1bXCIkaW5qZWN0b3JcIixmdW5jdGlvbihjKXtmdW5jdGlvbiBkKGEpe3ZhciBiPWZ1bmN0aW9uKGEpe3RoaXMuJCR1bndyYXBUcnVzdGVkVmFsdWU9XG5mdW5jdGlvbigpe3JldHVybiBhfX07YSYmKGIucHJvdG90eXBlPW5ldyBhKTtiLnByb3RvdHlwZS52YWx1ZU9mPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuJCR1bndyYXBUcnVzdGVkVmFsdWUoKX07Yi5wcm90b3R5cGUudG9TdHJpbmc9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy4kJHVud3JhcFRydXN0ZWRWYWx1ZSgpLnRvU3RyaW5nKCl9O3JldHVybiBifXZhciBlPWZ1bmN0aW9uKGEpe3Rocm93IHVhKFwidW5zYWZlXCIpO307Yy5oYXMoXCIkc2FuaXRpemVcIikmJihlPWMuZ2V0KFwiJHNhbml0aXplXCIpKTt2YXIgZz1kKCksZj17fTtmW2ZhLkhUTUxdPWQoZyk7ZltmYS5DU1NdPWQoZyk7ZltmYS5VUkxdPWQoZyk7ZltmYS5KU109ZChnKTtmW2ZhLlJFU09VUkNFX1VSTF09ZChmW2ZhLlVSTF0pO3JldHVybnt0cnVzdEFzOmZ1bmN0aW9uKGEsYil7dmFyIGM9Zi5oYXNPd25Qcm9wZXJ0eShhKT9mW2FdOm51bGw7aWYoIWMpdGhyb3cgdWEoXCJpY29udGV4dFwiLGEsYik7aWYobnVsbD09PWJ8fGI9PT1cbnN8fFwiXCI9PT1iKXJldHVybiBiO2lmKFwic3RyaW5nXCIhPT10eXBlb2YgYil0aHJvdyB1YShcIml0eXBlXCIsYSk7cmV0dXJuIG5ldyBjKGIpfSxnZXRUcnVzdGVkOmZ1bmN0aW9uKGMsZCl7aWYobnVsbD09PWR8fGQ9PT1zfHxcIlwiPT09ZClyZXR1cm4gZDt2YXIgZz1mLmhhc093blByb3BlcnR5KGMpP2ZbY106bnVsbDtpZihnJiZkIGluc3RhbmNlb2YgZylyZXR1cm4gZC4kJHVud3JhcFRydXN0ZWRWYWx1ZSgpO2lmKGM9PT1mYS5SRVNPVVJDRV9VUkwpe3ZhciBnPXNhKGQudG9TdHJpbmcoKSksbCxuLHA9ITE7bD0wO2ZvcihuPWIubGVuZ3RoO2w8bjtsKyspaWYoXCJzZWxmXCI9PT1iW2xdP01iKGcpOmJbbF0uZXhlYyhnLmhyZWYpKXtwPSEwO2JyZWFrfWlmKHApZm9yKGw9MCxuPWEubGVuZ3RoO2w8bjtsKyspaWYoXCJzZWxmXCI9PT1hW2xdP01iKGcpOmFbbF0uZXhlYyhnLmhyZWYpKXtwPSExO2JyZWFrfWlmKHApcmV0dXJuIGQ7dGhyb3cgdWEoXCJpbnNlY3VybFwiLGQudG9TdHJpbmcoKSk7fWlmKGM9PT1cbmZhLkhUTUwpcmV0dXJuIGUoZCk7dGhyb3cgdWEoXCJ1bnNhZmVcIik7fSx2YWx1ZU9mOmZ1bmN0aW9uKGEpe3JldHVybiBhIGluc3RhbmNlb2YgZz9hLiQkdW53cmFwVHJ1c3RlZFZhbHVlKCk6YX19fV19ZnVuY3Rpb24gJGQoKXt2YXIgYj0hMDt0aGlzLmVuYWJsZWQ9ZnVuY3Rpb24oYSl7YXJndW1lbnRzLmxlbmd0aCYmKGI9ISFhKTtyZXR1cm4gYn07dGhpcy4kZ2V0PVtcIiRwYXJzZVwiLFwiJHNuaWZmZXJcIixcIiRzY2VEZWxlZ2F0ZVwiLGZ1bmN0aW9uKGEsYyxkKXtpZihiJiZjLm1zaWUmJjg+Yy5tc2llRG9jdW1lbnRNb2RlKXRocm93IHVhKFwiaWVxdWlya3NcIik7dmFyIGU9a2EoZmEpO2UuaXNFbmFibGVkPWZ1bmN0aW9uKCl7cmV0dXJuIGJ9O2UudHJ1c3RBcz1kLnRydXN0QXM7ZS5nZXRUcnVzdGVkPWQuZ2V0VHJ1c3RlZDtlLnZhbHVlT2Y9ZC52YWx1ZU9mO2J8fChlLnRydXN0QXM9ZS5nZXRUcnVzdGVkPWZ1bmN0aW9uKGEsYil7cmV0dXJuIGJ9LGUudmFsdWVPZj1GYSk7ZS5wYXJzZUFzPVxuZnVuY3Rpb24oYixjKXt2YXIgZD1hKGMpO3JldHVybiBkLmxpdGVyYWwmJmQuY29uc3RhbnQ/ZDpmdW5jdGlvbihhLGMpe3JldHVybiBlLmdldFRydXN0ZWQoYixkKGEsYykpfX07dmFyIGc9ZS5wYXJzZUFzLGY9ZS5nZXRUcnVzdGVkLGs9ZS50cnVzdEFzO3EoZmEsZnVuY3Rpb24oYSxiKXt2YXIgYz1MKGIpO2VbVmEoXCJwYXJzZV9hc19cIitjKV09ZnVuY3Rpb24oYil7cmV0dXJuIGcoYSxiKX07ZVtWYShcImdldF90cnVzdGVkX1wiK2MpXT1mdW5jdGlvbihiKXtyZXR1cm4gZihhLGIpfTtlW1ZhKFwidHJ1c3RfYXNfXCIrYyldPWZ1bmN0aW9uKGIpe3JldHVybiBrKGEsYil9fSk7cmV0dXJuIGV9XX1mdW5jdGlvbiBiZSgpe3RoaXMuJGdldD1bXCIkd2luZG93XCIsXCIkZG9jdW1lbnRcIixmdW5jdGlvbihiLGEpe3ZhciBjPXt9LGQ9WigoL2FuZHJvaWQgKFxcZCspLy5leGVjKEwoKGIubmF2aWdhdG9yfHx7fSkudXNlckFnZW50KSl8fFtdKVsxXSksZT0vQm94ZWUvaS50ZXN0KChiLm5hdmlnYXRvcnx8XG57fSkudXNlckFnZW50KSxnPWFbMF18fHt9LGY9Zy5kb2N1bWVudE1vZGUsayxtPS9eKE1venx3ZWJraXR8T3xtcykoPz1bQS1aXSkvLGg9Zy5ib2R5JiZnLmJvZHkuc3R5bGUsbD0hMSxuPSExO2lmKGgpe2Zvcih2YXIgcCBpbiBoKWlmKGw9bS5leGVjKHApKXtrPWxbMF07az1rLnN1YnN0cigwLDEpLnRvVXBwZXJDYXNlKCkray5zdWJzdHIoMSk7YnJlYWt9a3x8KGs9XCJXZWJraXRPcGFjaXR5XCJpbiBoJiZcIndlYmtpdFwiKTtsPSEhKFwidHJhbnNpdGlvblwiaW4gaHx8aytcIlRyYW5zaXRpb25cImluIGgpO249ISEoXCJhbmltYXRpb25cImluIGh8fGsrXCJBbmltYXRpb25cImluIGgpOyFkfHxsJiZufHwobD1DKGcuYm9keS5zdHlsZS53ZWJraXRUcmFuc2l0aW9uKSxuPUMoZy5ib2R5LnN0eWxlLndlYmtpdEFuaW1hdGlvbikpfXJldHVybntoaXN0b3J5OiEoIWIuaGlzdG9yeXx8IWIuaGlzdG9yeS5wdXNoU3RhdGV8fDQ+ZHx8ZSksaGFzaGNoYW5nZTpcIm9uaGFzaGNoYW5nZVwiaW4gYiYmKCFmfHw3PFxuZiksaGFzRXZlbnQ6ZnVuY3Rpb24oYSl7aWYoXCJpbnB1dFwiPT1hJiY5PT1TKXJldHVybiExO2lmKEQoY1thXSkpe3ZhciBiPWcuY3JlYXRlRWxlbWVudChcImRpdlwiKTtjW2FdPVwib25cIithIGluIGJ9cmV0dXJuIGNbYV19LGNzcDokYigpLHZlbmRvclByZWZpeDprLHRyYW5zaXRpb25zOmwsYW5pbWF0aW9uczpuLGFuZHJvaWQ6ZCxtc2llOlMsbXNpZURvY3VtZW50TW9kZTpmfX1dfWZ1bmN0aW9uIGRlKCl7dGhpcy4kZ2V0PVtcIiRyb290U2NvcGVcIixcIiRicm93c2VyXCIsXCIkcVwiLFwiJGV4Y2VwdGlvbkhhbmRsZXJcIixmdW5jdGlvbihiLGEsYyxkKXtmdW5jdGlvbiBlKGUsayxtKXt2YXIgaD1jLmRlZmVyKCksbD1oLnByb21pc2Usbj1CKG0pJiYhbTtrPWEuZGVmZXIoZnVuY3Rpb24oKXt0cnl7aC5yZXNvbHZlKGUoKSl9Y2F0Y2goYSl7aC5yZWplY3QoYSksZChhKX1maW5hbGx5e2RlbGV0ZSBnW2wuJCR0aW1lb3V0SWRdfW58fGIuJGFwcGx5KCl9LGspO2wuJCR0aW1lb3V0SWQ9aztnW2tdPWg7XG5yZXR1cm4gbH12YXIgZz17fTtlLmNhbmNlbD1mdW5jdGlvbihiKXtyZXR1cm4gYiYmYi4kJHRpbWVvdXRJZCBpbiBnPyhnW2IuJCR0aW1lb3V0SWRdLnJlamVjdChcImNhbmNlbGVkXCIpLGRlbGV0ZSBnW2IuJCR0aW1lb3V0SWRdLGEuZGVmZXIuY2FuY2VsKGIuJCR0aW1lb3V0SWQpKTohMX07cmV0dXJuIGV9XX1mdW5jdGlvbiBzYShiLGEpe3ZhciBjPWI7UyYmKFcuc2V0QXR0cmlidXRlKFwiaHJlZlwiLGMpLGM9Vy5ocmVmKTtXLnNldEF0dHJpYnV0ZShcImhyZWZcIixjKTtyZXR1cm57aHJlZjpXLmhyZWYscHJvdG9jb2w6Vy5wcm90b2NvbD9XLnByb3RvY29sLnJlcGxhY2UoLzokLyxcIlwiKTpcIlwiLGhvc3Q6Vy5ob3N0LHNlYXJjaDpXLnNlYXJjaD9XLnNlYXJjaC5yZXBsYWNlKC9eXFw/LyxcIlwiKTpcIlwiLGhhc2g6Vy5oYXNoP1cuaGFzaC5yZXBsYWNlKC9eIy8sXCJcIik6XCJcIixob3N0bmFtZTpXLmhvc3RuYW1lLHBvcnQ6Vy5wb3J0LHBhdGhuYW1lOlwiL1wiPT09Vy5wYXRobmFtZS5jaGFyQXQoMCk/Vy5wYXRobmFtZTpcblwiL1wiK1cucGF0aG5hbWV9fWZ1bmN0aW9uIE1iKGIpe2I9QyhiKT9zYShiKTpiO3JldHVybiBiLnByb3RvY29sPT09SWMucHJvdG9jb2wmJmIuaG9zdD09PUljLmhvc3R9ZnVuY3Rpb24gZWUoKXt0aGlzLiRnZXQ9JChUKX1mdW5jdGlvbiBrYyhiKXtmdW5jdGlvbiBhKGQsZSl7aWYoVShkKSl7dmFyIGc9e307cShkLGZ1bmN0aW9uKGIsYyl7Z1tjXT1hKGMsYil9KTtyZXR1cm4gZ31yZXR1cm4gYi5mYWN0b3J5KGQrYyxlKX12YXIgYz1cIkZpbHRlclwiO3RoaXMucmVnaXN0ZXI9YTt0aGlzLiRnZXQ9W1wiJGluamVjdG9yXCIsZnVuY3Rpb24oYSl7cmV0dXJuIGZ1bmN0aW9uKGIpe3JldHVybiBhLmdldChiK2MpfX1dO2EoXCJjdXJyZW5jeVwiLEpjKTthKFwiZGF0ZVwiLEtjKTthKFwiZmlsdGVyXCIsQ2UpO2EoXCJqc29uXCIsRGUpO2EoXCJsaW1pdFRvXCIsRWUpO2EoXCJsb3dlcmNhc2VcIixGZSk7YShcIm51bWJlclwiLExjKTthKFwib3JkZXJCeVwiLE1jKTthKFwidXBwZXJjYXNlXCIsR2UpfWZ1bmN0aW9uIENlKCl7cmV0dXJuIGZ1bmN0aW9uKGIsXG5hLGMpe2lmKCFPKGIpKXJldHVybiBiO3ZhciBkPXR5cGVvZiBjLGU9W107ZS5jaGVjaz1mdW5jdGlvbihhKXtmb3IodmFyIGI9MDtiPGUubGVuZ3RoO2IrKylpZighZVtiXShhKSlyZXR1cm4hMTtyZXR1cm4hMH07XCJmdW5jdGlvblwiIT09ZCYmKGM9XCJib29sZWFuXCI9PT1kJiZjP2Z1bmN0aW9uKGEsYil7cmV0dXJuIFNhLmVxdWFscyhhLGIpfTpmdW5jdGlvbihhLGIpe2lmKGEmJmImJlwib2JqZWN0XCI9PT10eXBlb2YgYSYmXCJvYmplY3RcIj09PXR5cGVvZiBiKXtmb3IodmFyIGQgaW4gYSlpZihcIiRcIiE9PWQuY2hhckF0KDApJiZ6Yi5jYWxsKGEsZCkmJmMoYVtkXSxiW2RdKSlyZXR1cm4hMDtyZXR1cm4hMX1iPShcIlwiK2IpLnRvTG93ZXJDYXNlKCk7cmV0dXJuLTE8KFwiXCIrYSkudG9Mb3dlckNhc2UoKS5pbmRleE9mKGIpfSk7dmFyIGc9ZnVuY3Rpb24oYSxiKXtpZihcInN0cmluZ1wiPT10eXBlb2YgYiYmXCIhXCI9PT1iLmNoYXJBdCgwKSlyZXR1cm4hZyhhLGIuc3Vic3RyKDEpKTtzd2l0Y2godHlwZW9mIGEpe2Nhc2UgXCJib29sZWFuXCI6Y2FzZSBcIm51bWJlclwiOmNhc2UgXCJzdHJpbmdcIjpyZXR1cm4gYyhhLFxuYik7Y2FzZSBcIm9iamVjdFwiOnN3aXRjaCh0eXBlb2YgYil7Y2FzZSBcIm9iamVjdFwiOnJldHVybiBjKGEsYik7ZGVmYXVsdDpmb3IodmFyIGQgaW4gYSlpZihcIiRcIiE9PWQuY2hhckF0KDApJiZnKGFbZF0sYikpcmV0dXJuITB9cmV0dXJuITE7Y2FzZSBcImFycmF5XCI6Zm9yKGQ9MDtkPGEubGVuZ3RoO2QrKylpZihnKGFbZF0sYikpcmV0dXJuITA7cmV0dXJuITE7ZGVmYXVsdDpyZXR1cm4hMX19O3N3aXRjaCh0eXBlb2YgYSl7Y2FzZSBcImJvb2xlYW5cIjpjYXNlIFwibnVtYmVyXCI6Y2FzZSBcInN0cmluZ1wiOmE9eyQ6YX07Y2FzZSBcIm9iamVjdFwiOmZvcih2YXIgZiBpbiBhKShmdW5jdGlvbihiKXtcInVuZGVmaW5lZFwiIT10eXBlb2YgYVtiXSYmZS5wdXNoKGZ1bmN0aW9uKGMpe3JldHVybiBnKFwiJFwiPT1iP2M6YyYmY1tiXSxhW2JdKX0pfSkoZik7YnJlYWs7Y2FzZSBcImZ1bmN0aW9uXCI6ZS5wdXNoKGEpO2JyZWFrO2RlZmF1bHQ6cmV0dXJuIGJ9ZD1bXTtmb3IoZj0wO2Y8Yi5sZW5ndGg7ZisrKXt2YXIgaz1cbmJbZl07ZS5jaGVjayhrKSYmZC5wdXNoKGspfXJldHVybiBkfX1mdW5jdGlvbiBKYyhiKXt2YXIgYT1iLk5VTUJFUl9GT1JNQVRTO3JldHVybiBmdW5jdGlvbihiLGQpe0QoZCkmJihkPWEuQ1VSUkVOQ1lfU1lNKTtyZXR1cm4gTmMoYixhLlBBVFRFUk5TWzFdLGEuR1JPVVBfU0VQLGEuREVDSU1BTF9TRVAsMikucmVwbGFjZSgvXFx1MDBBNC9nLGQpfX1mdW5jdGlvbiBMYyhiKXt2YXIgYT1iLk5VTUJFUl9GT1JNQVRTO3JldHVybiBmdW5jdGlvbihiLGQpe3JldHVybiBOYyhiLGEuUEFUVEVSTlNbMF0sYS5HUk9VUF9TRVAsYS5ERUNJTUFMX1NFUCxkKX19ZnVuY3Rpb24gTmMoYixhLGMsZCxlKXtpZihudWxsPT1ifHwhaXNGaW5pdGUoYil8fFUoYikpcmV0dXJuXCJcIjt2YXIgZz0wPmI7Yj1NYXRoLmFicyhiKTt2YXIgZj1iK1wiXCIsaz1cIlwiLG09W10saD0hMTtpZigtMSE9PWYuaW5kZXhPZihcImVcIikpe3ZhciBsPWYubWF0Y2goLyhbXFxkXFwuXSspZSgtPykoXFxkKykvKTtsJiZcIi1cIj09bFsyXSYmXG5sWzNdPmUrMT9mPVwiMFwiOihrPWYsaD0hMCl9aWYoaCkwPGUmJigtMTxiJiYxPmIpJiYoaz1iLnRvRml4ZWQoZSkpO2Vsc2V7Zj0oZi5zcGxpdChPYylbMV18fFwiXCIpLmxlbmd0aDtEKGUpJiYoZT1NYXRoLm1pbihNYXRoLm1heChhLm1pbkZyYWMsZiksYS5tYXhGcmFjKSk7Zj1NYXRoLnBvdygxMCxlKzEpO2I9TWF0aC5mbG9vcihiKmYrNSkvZjtiPShcIlwiK2IpLnNwbGl0KE9jKTtmPWJbMF07Yj1iWzFdfHxcIlwiO3ZhciBsPTAsbj1hLmxnU2l6ZSxwPWEuZ1NpemU7aWYoZi5sZW5ndGg+PW4rcClmb3IobD1mLmxlbmd0aC1uLGg9MDtoPGw7aCsrKTA9PT0obC1oKSVwJiYwIT09aCYmKGsrPWMpLGsrPWYuY2hhckF0KGgpO2ZvcihoPWw7aDxmLmxlbmd0aDtoKyspMD09PShmLmxlbmd0aC1oKSVuJiYwIT09aCYmKGsrPWMpLGsrPWYuY2hhckF0KGgpO2Zvcig7Yi5sZW5ndGg8ZTspYis9XCIwXCI7ZSYmXCIwXCIhPT1lJiYoays9ZCtiLnN1YnN0cigwLGUpKX1tLnB1c2goZz9hLm5lZ1ByZTphLnBvc1ByZSk7XG5tLnB1c2goayk7bS5wdXNoKGc/YS5uZWdTdWY6YS5wb3NTdWYpO3JldHVybiBtLmpvaW4oXCJcIil9ZnVuY3Rpb24gVWIoYixhLGMpe3ZhciBkPVwiXCI7MD5iJiYoZD1cIi1cIixiPS1iKTtmb3IoYj1cIlwiK2I7Yi5sZW5ndGg8YTspYj1cIjBcIitiO2MmJihiPWIuc3Vic3RyKGIubGVuZ3RoLWEpKTtyZXR1cm4gZCtifWZ1bmN0aW9uIFkoYixhLGMsZCl7Yz1jfHwwO3JldHVybiBmdW5jdGlvbihlKXtlPWVbXCJnZXRcIitiXSgpO2lmKDA8Y3x8ZT4tYyllKz1jOzA9PT1lJiYtMTI9PWMmJihlPTEyKTtyZXR1cm4gVWIoZSxhLGQpfX1mdW5jdGlvbiBzYihiLGEpe3JldHVybiBmdW5jdGlvbihjLGQpe3ZhciBlPWNbXCJnZXRcIitiXSgpLGc9SGEoYT9cIlNIT1JUXCIrYjpiKTtyZXR1cm4gZFtnXVtlXX19ZnVuY3Rpb24gS2MoYil7ZnVuY3Rpb24gYShhKXt2YXIgYjtpZihiPWEubWF0Y2goYykpe2E9bmV3IERhdGUoMCk7dmFyIGc9MCxmPTAsaz1iWzhdP2Euc2V0VVRDRnVsbFllYXI6YS5zZXRGdWxsWWVhcixtPVxuYls4XT9hLnNldFVUQ0hvdXJzOmEuc2V0SG91cnM7Yls5XSYmKGc9WihiWzldK2JbMTBdKSxmPVooYls5XStiWzExXSkpO2suY2FsbChhLFooYlsxXSksWihiWzJdKS0xLFooYlszXSkpO2c9WihiWzRdfHwwKS1nO2Y9WihiWzVdfHwwKS1mO2s9WihiWzZdfHwwKTtiPU1hdGgucm91bmQoMUUzKnBhcnNlRmxvYXQoXCIwLlwiKyhiWzddfHwwKSkpO20uY2FsbChhLGcsZixrLGIpfXJldHVybiBhfXZhciBjPS9eKFxcZHs0fSktPyhcXGRcXGQpLT8oXFxkXFxkKSg/OlQoXFxkXFxkKSg/Ojo/KFxcZFxcZCkoPzo6PyhcXGRcXGQpKD86XFwuKFxcZCspKT8pPyk/KFp8KFsrLV0pKFxcZFxcZCk6PyhcXGRcXGQpKT8pPyQvO3JldHVybiBmdW5jdGlvbihjLGUpe3ZhciBnPVwiXCIsZj1bXSxrLG07ZT1lfHxcIm1lZGl1bURhdGVcIjtlPWIuREFURVRJTUVfRk9STUFUU1tlXXx8ZTtDKGMpJiYoYz1IZS50ZXN0KGMpP1ooYyk6YShjKSk7eWIoYykmJihjPW5ldyBEYXRlKGMpKTtpZighTmEoYykpcmV0dXJuIGM7Zm9yKDtlOykobT1JZS5leGVjKGUpKT9cbihmPWYuY29uY2F0KHlhLmNhbGwobSwxKSksZT1mLnBvcCgpKTooZi5wdXNoKGUpLGU9bnVsbCk7cShmLGZ1bmN0aW9uKGEpe2s9SmVbYV07Zys9az9rKGMsYi5EQVRFVElNRV9GT1JNQVRTKTphLnJlcGxhY2UoLyheJ3wnJCkvZyxcIlwiKS5yZXBsYWNlKC8nJy9nLFwiJ1wiKX0pO3JldHVybiBnfX1mdW5jdGlvbiBEZSgpe3JldHVybiBmdW5jdGlvbihiKXtyZXR1cm4gcmEoYiwhMCl9fWZ1bmN0aW9uIEVlKCl7cmV0dXJuIGZ1bmN0aW9uKGIsYSl7aWYoIU8oYikmJiFDKGIpKXJldHVybiBiO2E9SW5maW5pdHk9PT1NYXRoLmFicyhOdW1iZXIoYSkpP051bWJlcihhKTpaKGEpO2lmKEMoYikpcmV0dXJuIGE/MDw9YT9iLnNsaWNlKDAsYSk6Yi5zbGljZShhLGIubGVuZ3RoKTpcIlwiO3ZhciBjPVtdLGQsZTthPmIubGVuZ3RoP2E9Yi5sZW5ndGg6YTwtYi5sZW5ndGgmJihhPS1iLmxlbmd0aCk7MDxhPyhkPTAsZT1hKTooZD1iLmxlbmd0aCthLGU9Yi5sZW5ndGgpO2Zvcig7ZDxlO2QrKyljLnB1c2goYltkXSk7XG5yZXR1cm4gY319ZnVuY3Rpb24gTWMoYil7cmV0dXJuIGZ1bmN0aW9uKGEsYyxkKXtmdW5jdGlvbiBlKGEsYil7cmV0dXJuIFJhKGIpP2Z1bmN0aW9uKGIsYyl7cmV0dXJuIGEoYyxiKX06YX1mdW5jdGlvbiBnKGEsYil7dmFyIGM9dHlwZW9mIGEsZD10eXBlb2YgYjtyZXR1cm4gYz09ZD8oXCJzdHJpbmdcIj09YyYmKGE9YS50b0xvd2VyQ2FzZSgpLGI9Yi50b0xvd2VyQ2FzZSgpKSxhPT09Yj8wOmE8Yj8tMToxKTpjPGQ/LTE6MX1pZighTyhhKXx8IWMpcmV0dXJuIGE7Yz1PKGMpP2M6W2NdO2M9VWMoYyxmdW5jdGlvbihhKXt2YXIgYz0hMSxkPWF8fEZhO2lmKEMoYSkpe2lmKFwiK1wiPT1hLmNoYXJBdCgwKXx8XCItXCI9PWEuY2hhckF0KDApKWM9XCItXCI9PWEuY2hhckF0KDApLGE9YS5zdWJzdHJpbmcoMSk7ZD1iKGEpO2lmKGQuY29uc3RhbnQpe3ZhciBmPWQoKTtyZXR1cm4gZShmdW5jdGlvbihhLGIpe3JldHVybiBnKGFbZl0sYltmXSl9LGMpfX1yZXR1cm4gZShmdW5jdGlvbihhLGIpe3JldHVybiBnKGQoYSksXG5kKGIpKX0sYyl9KTtmb3IodmFyIGY9W10saz0wO2s8YS5sZW5ndGg7aysrKWYucHVzaChhW2tdKTtyZXR1cm4gZi5zb3J0KGUoZnVuY3Rpb24oYSxiKXtmb3IodmFyIGQ9MDtkPGMubGVuZ3RoO2QrKyl7dmFyIGU9Y1tkXShhLGIpO2lmKDAhPT1lKXJldHVybiBlfXJldHVybiAwfSxkKSl9fWZ1bmN0aW9uIHZhKGIpe1EoYikmJihiPXtsaW5rOmJ9KTtiLnJlc3RyaWN0PWIucmVzdHJpY3R8fFwiQUNcIjtyZXR1cm4gJChiKX1mdW5jdGlvbiBQYyhiLGEsYyxkKXtmdW5jdGlvbiBlKGEsYyl7Yz1jP1wiLVwiK2hiKGMsXCItXCIpOlwiXCI7ZC5yZW1vdmVDbGFzcyhiLChhP3RiOnViKStjKTtkLmFkZENsYXNzKGIsKGE/dWI6dGIpK2MpfXZhciBnPXRoaXMsZj1iLnBhcmVudCgpLmNvbnRyb2xsZXIoXCJmb3JtXCIpfHx2YixrPTAsbT1nLiRlcnJvcj17fSxoPVtdO2cuJG5hbWU9YS5uYW1lfHxhLm5nRm9ybTtnLiRkaXJ0eT0hMTtnLiRwcmlzdGluZT0hMDtnLiR2YWxpZD0hMDtnLiRpbnZhbGlkPSExO2YuJGFkZENvbnRyb2woZyk7XG5iLmFkZENsYXNzKE1hKTtlKCEwKTtnLiRhZGRDb250cm9sPWZ1bmN0aW9uKGEpe0FhKGEuJG5hbWUsXCJpbnB1dFwiKTtoLnB1c2goYSk7YS4kbmFtZSYmKGdbYS4kbmFtZV09YSl9O2cuJHJlbW92ZUNvbnRyb2w9ZnVuY3Rpb24oYSl7YS4kbmFtZSYmZ1thLiRuYW1lXT09PWEmJmRlbGV0ZSBnW2EuJG5hbWVdO3EobSxmdW5jdGlvbihiLGMpe2cuJHNldFZhbGlkaXR5KGMsITAsYSl9KTtQYShoLGEpfTtnLiRzZXRWYWxpZGl0eT1mdW5jdGlvbihhLGIsYyl7dmFyIGQ9bVthXTtpZihiKWQmJihQYShkLGMpLGQubGVuZ3RofHwoay0tLGt8fChlKGIpLGcuJHZhbGlkPSEwLGcuJGludmFsaWQ9ITEpLG1bYV09ITEsZSghMCxhKSxmLiRzZXRWYWxpZGl0eShhLCEwLGcpKSk7ZWxzZXtrfHxlKGIpO2lmKGQpe2lmKC0xIT1PYShkLGMpKXJldHVybn1lbHNlIG1bYV09ZD1bXSxrKyssZSghMSxhKSxmLiRzZXRWYWxpZGl0eShhLCExLGcpO2QucHVzaChjKTtnLiR2YWxpZD0hMTtnLiRpbnZhbGlkPVxuITB9fTtnLiRzZXREaXJ0eT1mdW5jdGlvbigpe2QucmVtb3ZlQ2xhc3MoYixNYSk7ZC5hZGRDbGFzcyhiLHdiKTtnLiRkaXJ0eT0hMDtnLiRwcmlzdGluZT0hMTtmLiRzZXREaXJ0eSgpfTtnLiRzZXRQcmlzdGluZT1mdW5jdGlvbigpe2QucmVtb3ZlQ2xhc3MoYix3Yik7ZC5hZGRDbGFzcyhiLE1hKTtnLiRkaXJ0eT0hMTtnLiRwcmlzdGluZT0hMDtxKGgsZnVuY3Rpb24oYSl7YS4kc2V0UHJpc3RpbmUoKX0pfX1mdW5jdGlvbiBxYShiLGEsYyxkKXtiLiRzZXRWYWxpZGl0eShhLGMpO3JldHVybiBjP2Q6c31mdW5jdGlvbiBLZShiLGEsYyl7dmFyIGQ9Yy5wcm9wKFwidmFsaWRpdHlcIik7VShkKSYmYi4kcGFyc2Vycy5wdXNoKGZ1bmN0aW9uKGMpe2lmKGIuJGVycm9yW2FdfHwhKGQuYmFkSW5wdXR8fGQuY3VzdG9tRXJyb3J8fGQudHlwZU1pc21hdGNoKXx8ZC52YWx1ZU1pc3NpbmcpcmV0dXJuIGM7Yi4kc2V0VmFsaWRpdHkoYSwhMSl9KX1mdW5jdGlvbiB4YihiLGEsYyxkLGUsZyl7dmFyIGY9XG5hLnByb3AoXCJ2YWxpZGl0eVwiKSxrPWFbMF0ucGxhY2Vob2xkZXIsbT17fTtpZighZS5hbmRyb2lkKXt2YXIgaD0hMTthLm9uKFwiY29tcG9zaXRpb25zdGFydFwiLGZ1bmN0aW9uKGEpe2g9ITB9KTthLm9uKFwiY29tcG9zaXRpb25lbmRcIixmdW5jdGlvbigpe2g9ITE7bCgpfSl9dmFyIGw9ZnVuY3Rpb24oZSl7aWYoIWgpe3ZhciBnPWEudmFsKCk7aWYoUyYmXCJpbnB1dFwiPT09KGV8fG0pLnR5cGUmJmFbMF0ucGxhY2Vob2xkZXIhPT1rKWs9YVswXS5wbGFjZWhvbGRlcjtlbHNlIGlmKFJhKGMubmdUcmltfHxcIlRcIikmJihnPWFhKGcpKSxkLiR2aWV3VmFsdWUhPT1nfHxmJiZcIlwiPT09ZyYmIWYudmFsdWVNaXNzaW5nKWIuJCRwaGFzZT9kLiRzZXRWaWV3VmFsdWUoZyk6Yi4kYXBwbHkoZnVuY3Rpb24oKXtkLiRzZXRWaWV3VmFsdWUoZyl9KX19O2lmKGUuaGFzRXZlbnQoXCJpbnB1dFwiKSlhLm9uKFwiaW5wdXRcIixsKTtlbHNle3ZhciBuLHA9ZnVuY3Rpb24oKXtufHwobj1nLmRlZmVyKGZ1bmN0aW9uKCl7bCgpO1xubj1udWxsfSkpfTthLm9uKFwia2V5ZG93blwiLGZ1bmN0aW9uKGEpe2E9YS5rZXlDb2RlOzkxPT09YXx8KDE1PGEmJjE5PmF8fDM3PD1hJiY0MD49YSl8fHAoKX0pO2lmKGUuaGFzRXZlbnQoXCJwYXN0ZVwiKSlhLm9uKFwicGFzdGUgY3V0XCIscCl9YS5vbihcImNoYW5nZVwiLGwpO2QuJHJlbmRlcj1mdW5jdGlvbigpe2EudmFsKGQuJGlzRW1wdHkoZC4kdmlld1ZhbHVlKT9cIlwiOmQuJHZpZXdWYWx1ZSl9O3ZhciByPWMubmdQYXR0ZXJuO3ImJigoZT1yLm1hdGNoKC9eXFwvKC4qKVxcLyhbZ2ltXSopJC8pKT8ocj1SZWdFeHAoZVsxXSxlWzJdKSxlPWZ1bmN0aW9uKGEpe3JldHVybiBxYShkLFwicGF0dGVyblwiLGQuJGlzRW1wdHkoYSl8fHIudGVzdChhKSxhKX0pOmU9ZnVuY3Rpb24oYyl7dmFyIGU9Yi4kZXZhbChyKTtpZighZXx8IWUudGVzdCl0aHJvdyB0KFwibmdQYXR0ZXJuXCIpKFwibm9yZWdleHBcIixyLGUsZ2EoYSkpO3JldHVybiBxYShkLFwicGF0dGVyblwiLGQuJGlzRW1wdHkoYyl8fGUudGVzdChjKSxcbmMpfSxkLiRmb3JtYXR0ZXJzLnB1c2goZSksZC4kcGFyc2Vycy5wdXNoKGUpKTtpZihjLm5nTWlubGVuZ3RoKXt2YXIgdj1aKGMubmdNaW5sZW5ndGgpO2U9ZnVuY3Rpb24oYSl7cmV0dXJuIHFhKGQsXCJtaW5sZW5ndGhcIixkLiRpc0VtcHR5KGEpfHxhLmxlbmd0aD49dixhKX07ZC4kcGFyc2Vycy5wdXNoKGUpO2QuJGZvcm1hdHRlcnMucHVzaChlKX1pZihjLm5nTWF4bGVuZ3RoKXt2YXIgcT1aKGMubmdNYXhsZW5ndGgpO2U9ZnVuY3Rpb24oYSl7cmV0dXJuIHFhKGQsXCJtYXhsZW5ndGhcIixkLiRpc0VtcHR5KGEpfHxhLmxlbmd0aDw9cSxhKX07ZC4kcGFyc2Vycy5wdXNoKGUpO2QuJGZvcm1hdHRlcnMucHVzaChlKX19ZnVuY3Rpb24gVmIoYixhKXtiPVwibmdDbGFzc1wiK2I7cmV0dXJuW1wiJGFuaW1hdGVcIixmdW5jdGlvbihjKXtmdW5jdGlvbiBkKGEsYil7dmFyIGM9W10sZD0wO2E6Zm9yKDtkPGEubGVuZ3RoO2QrKyl7Zm9yKHZhciBlPWFbZF0sbD0wO2w8Yi5sZW5ndGg7bCsrKWlmKGU9PVxuYltsXSljb250aW51ZSBhO2MucHVzaChlKX1yZXR1cm4gY31mdW5jdGlvbiBlKGEpe2lmKCFPKGEpKXtpZihDKGEpKXJldHVybiBhLnNwbGl0KFwiIFwiKTtpZihVKGEpKXt2YXIgYj1bXTtxKGEsZnVuY3Rpb24oYSxjKXthJiYoYj1iLmNvbmNhdChjLnNwbGl0KFwiIFwiKSkpfSk7cmV0dXJuIGJ9fXJldHVybiBhfXJldHVybntyZXN0cmljdDpcIkFDXCIsbGluazpmdW5jdGlvbihnLGYsayl7ZnVuY3Rpb24gbShhLGIpe3ZhciBjPWYuZGF0YShcIiRjbGFzc0NvdW50c1wiKXx8e30sZD1bXTtxKGEsZnVuY3Rpb24oYSl7aWYoMDxifHxjW2FdKWNbYV09KGNbYV18fDApK2IsY1thXT09PSsoMDxiKSYmZC5wdXNoKGEpfSk7Zi5kYXRhKFwiJGNsYXNzQ291bnRzXCIsYyk7cmV0dXJuIGQuam9pbihcIiBcIil9ZnVuY3Rpb24gaChiKXtpZighMD09PWF8fGcuJGluZGV4JTI9PT1hKXt2YXIgaD1lKGJ8fFtdKTtpZighbCl7dmFyIHI9bShoLDEpO2suJGFkZENsYXNzKHIpfWVsc2UgaWYoIXhhKGIsbCkpe3ZhciBxPVxuZShsKSxyPWQoaCxxKSxoPWQocSxoKSxoPW0oaCwtMSkscj1tKHIsMSk7MD09PXIubGVuZ3RoP2MucmVtb3ZlQ2xhc3MoZixoKTowPT09aC5sZW5ndGg/Yy5hZGRDbGFzcyhmLHIpOmMuc2V0Q2xhc3MoZixyLGgpfX1sPWthKGIpfXZhciBsO2cuJHdhdGNoKGtbYl0saCwhMCk7ay4kb2JzZXJ2ZShcImNsYXNzXCIsZnVuY3Rpb24oYSl7aChnLiRldmFsKGtbYl0pKX0pO1wibmdDbGFzc1wiIT09YiYmZy4kd2F0Y2goXCIkaW5kZXhcIixmdW5jdGlvbihjLGQpe3ZhciBmPWMmMTtpZihmIT09KGQmMSkpe3ZhciBoPWUoZy4kZXZhbChrW2JdKSk7Zj09PWE/KGY9bShoLDEpLGsuJGFkZENsYXNzKGYpKTooZj1tKGgsLTEpLGsuJHJlbW92ZUNsYXNzKGYpKX19KX19fV19dmFyIEw9ZnVuY3Rpb24oYil7cmV0dXJuIEMoYik/Yi50b0xvd2VyQ2FzZSgpOmJ9LHpiPU9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHksSGE9ZnVuY3Rpb24oYil7cmV0dXJuIEMoYik/Yi50b1VwcGVyQ2FzZSgpOmJ9LFMsXG53LEJhLHlhPVtdLnNsaWNlLExlPVtdLnB1c2gsd2E9T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZyxRYT10KFwibmdcIiksU2E9VC5hbmd1bGFyfHwoVC5hbmd1bGFyPXt9KSxVYSxMYSxqYT1bXCIwXCIsXCIwXCIsXCIwXCJdO1M9WigoL21zaWUgKFxcZCspLy5leGVjKEwobmF2aWdhdG9yLnVzZXJBZ2VudCkpfHxbXSlbMV0pO2lzTmFOKFMpJiYoUz1aKCgvdHJpZGVudFxcLy4qOyBydjooXFxkKykvLmV4ZWMoTChuYXZpZ2F0b3IudXNlckFnZW50KSl8fFtdKVsxXSkpO3kuJGluamVjdD1bXTtGYS4kaW5qZWN0PVtdO3ZhciBPPWZ1bmN0aW9uKCl7cmV0dXJuIFEoQXJyYXkuaXNBcnJheSk/QXJyYXkuaXNBcnJheTpmdW5jdGlvbihiKXtyZXR1cm5cIltvYmplY3QgQXJyYXldXCI9PT13YS5jYWxsKGIpfX0oKSxhYT1mdW5jdGlvbigpe3JldHVybiBTdHJpbmcucHJvdG90eXBlLnRyaW0/ZnVuY3Rpb24oYil7cmV0dXJuIEMoYik/Yi50cmltKCk6Yn06ZnVuY3Rpb24oYil7cmV0dXJuIEMoYik/Yi5yZXBsYWNlKC9eXFxzXFxzKi8sXG5cIlwiKS5yZXBsYWNlKC9cXHNcXHMqJC8sXCJcIik6Yn19KCk7TGE9OT5TP2Z1bmN0aW9uKGIpe2I9Yi5ub2RlTmFtZT9iOmJbMF07cmV0dXJuIGIuc2NvcGVOYW1lJiZcIkhUTUxcIiE9Yi5zY29wZU5hbWU/SGEoYi5zY29wZU5hbWUrXCI6XCIrYi5ub2RlTmFtZSk6Yi5ub2RlTmFtZX06ZnVuY3Rpb24oYil7cmV0dXJuIGIubm9kZU5hbWU/Yi5ub2RlTmFtZTpiWzBdLm5vZGVOYW1lfTt2YXIgWGM9L1tBLVpdL2csJGM9e2Z1bGw6XCIxLjIuMThcIixtYWpvcjoxLG1pbm9yOjIsZG90OjE4LGNvZGVOYW1lOlwiZWFyLWV4dGVuZGFiaWxpdHlcIn0sWGE9Ui5jYWNoZT17fSxpYj1SLmV4cGFuZG89XCJuZ1wiKyhuZXcgRGF0ZSkuZ2V0VGltZSgpLG1lPTEscGI9VC5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyP2Z1bmN0aW9uKGIsYSxjKXtiLmFkZEV2ZW50TGlzdGVuZXIoYSxjLCExKX06ZnVuY3Rpb24oYixhLGMpe2IuYXR0YWNoRXZlbnQoXCJvblwiK2EsYyl9LFdhPVQuZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcj9cbmZ1bmN0aW9uKGIsYSxjKXtiLnJlbW92ZUV2ZW50TGlzdGVuZXIoYSxjLCExKX06ZnVuY3Rpb24oYixhLGMpe2IuZGV0YWNoRXZlbnQoXCJvblwiK2EsYyl9O1IuX2RhdGE9ZnVuY3Rpb24oYil7cmV0dXJuIHRoaXMuY2FjaGVbYlt0aGlzLmV4cGFuZG9dXXx8e319O3ZhciBoZT0vKFtcXDpcXC1cXF9dKyguKSkvZyxpZT0vXm1veihbQS1aXSkvLEdiPXQoXCJqcUxpdGVcIiksamU9L148KFxcdyspXFxzKlxcLz8+KD86PFxcL1xcMT58KSQvLEhiPS88fCYjP1xcdys7LyxrZT0vPChbXFx3Ol0rKS8sbGU9LzwoPyFhcmVhfGJyfGNvbHxlbWJlZHxocnxpbWd8aW5wdXR8bGlua3xtZXRhfHBhcmFtKSgoW1xcdzpdKylbXj5dKilcXC8+L2dpLGRhPXtvcHRpb246WzEsJzxzZWxlY3QgbXVsdGlwbGU9XCJtdWx0aXBsZVwiPicsXCI8L3NlbGVjdD5cIl0sdGhlYWQ6WzEsXCI8dGFibGU+XCIsXCI8L3RhYmxlPlwiXSxjb2w6WzIsXCI8dGFibGU+PGNvbGdyb3VwPlwiLFwiPC9jb2xncm91cD48L3RhYmxlPlwiXSx0cjpbMixcIjx0YWJsZT48dGJvZHk+XCIsXG5cIjwvdGJvZHk+PC90YWJsZT5cIl0sdGQ6WzMsXCI8dGFibGU+PHRib2R5Pjx0cj5cIixcIjwvdHI+PC90Ym9keT48L3RhYmxlPlwiXSxfZGVmYXVsdDpbMCxcIlwiLFwiXCJdfTtkYS5vcHRncm91cD1kYS5vcHRpb247ZGEudGJvZHk9ZGEudGZvb3Q9ZGEuY29sZ3JvdXA9ZGEuY2FwdGlvbj1kYS50aGVhZDtkYS50aD1kYS50ZDt2YXIgS2E9Ui5wcm90b3R5cGU9e3JlYWR5OmZ1bmN0aW9uKGIpe2Z1bmN0aW9uIGEoKXtjfHwoYz0hMCxiKCkpfXZhciBjPSExO1wiY29tcGxldGVcIj09PVYucmVhZHlTdGF0ZT9zZXRUaW1lb3V0KGEpOih0aGlzLm9uKFwiRE9NQ29udGVudExvYWRlZFwiLGEpLFIoVCkub24oXCJsb2FkXCIsYSkpfSx0b1N0cmluZzpmdW5jdGlvbigpe3ZhciBiPVtdO3EodGhpcyxmdW5jdGlvbihhKXtiLnB1c2goXCJcIithKX0pO3JldHVyblwiW1wiK2Iuam9pbihcIiwgXCIpK1wiXVwifSxlcTpmdW5jdGlvbihiKXtyZXR1cm4gMDw9Yj93KHRoaXNbYl0pOncodGhpc1t0aGlzLmxlbmd0aCtiXSl9LGxlbmd0aDowLFxucHVzaDpMZSxzb3J0OltdLnNvcnQsc3BsaWNlOltdLnNwbGljZX0sbWI9e307cShcIm11bHRpcGxlIHNlbGVjdGVkIGNoZWNrZWQgZGlzYWJsZWQgcmVhZE9ubHkgcmVxdWlyZWQgb3BlblwiLnNwbGl0KFwiIFwiKSxmdW5jdGlvbihiKXttYltMKGIpXT1ifSk7dmFyIHJjPXt9O3EoXCJpbnB1dCBzZWxlY3Qgb3B0aW9uIHRleHRhcmVhIGJ1dHRvbiBmb3JtIGRldGFpbHNcIi5zcGxpdChcIiBcIiksZnVuY3Rpb24oYil7cmNbSGEoYildPSEwfSk7cSh7ZGF0YTpuYyxpbmhlcml0ZWREYXRhOmxiLHNjb3BlOmZ1bmN0aW9uKGIpe3JldHVybiB3KGIpLmRhdGEoXCIkc2NvcGVcIil8fGxiKGIucGFyZW50Tm9kZXx8YixbXCIkaXNvbGF0ZVNjb3BlXCIsXCIkc2NvcGVcIl0pfSxpc29sYXRlU2NvcGU6ZnVuY3Rpb24oYil7cmV0dXJuIHcoYikuZGF0YShcIiRpc29sYXRlU2NvcGVcIil8fHcoYikuZGF0YShcIiRpc29sYXRlU2NvcGVOb1RlbXBsYXRlXCIpfSxjb250cm9sbGVyOm9jLGluamVjdG9yOmZ1bmN0aW9uKGIpe3JldHVybiBsYihiLFxuXCIkaW5qZWN0b3JcIil9LHJlbW92ZUF0dHI6ZnVuY3Rpb24oYixhKXtiLnJlbW92ZUF0dHJpYnV0ZShhKX0saGFzQ2xhc3M6S2IsY3NzOmZ1bmN0aW9uKGIsYSxjKXthPVZhKGEpO2lmKEIoYykpYi5zdHlsZVthXT1jO2Vsc2V7dmFyIGQ7OD49UyYmKGQ9Yi5jdXJyZW50U3R5bGUmJmIuY3VycmVudFN0eWxlW2FdLFwiXCI9PT1kJiYoZD1cImF1dG9cIikpO2Q9ZHx8Yi5zdHlsZVthXTs4Pj1TJiYoZD1cIlwiPT09ZD9zOmQpO3JldHVybiBkfX0sYXR0cjpmdW5jdGlvbihiLGEsYyl7dmFyIGQ9TChhKTtpZihtYltkXSlpZihCKGMpKWM/KGJbYV09ITAsYi5zZXRBdHRyaWJ1dGUoYSxkKSk6KGJbYV09ITEsYi5yZW1vdmVBdHRyaWJ1dGUoZCkpO2Vsc2UgcmV0dXJuIGJbYV18fChiLmF0dHJpYnV0ZXMuZ2V0TmFtZWRJdGVtKGEpfHx5KS5zcGVjaWZpZWQ/ZDpzO2Vsc2UgaWYoQihjKSliLnNldEF0dHJpYnV0ZShhLGMpO2Vsc2UgaWYoYi5nZXRBdHRyaWJ1dGUpcmV0dXJuIGI9Yi5nZXRBdHRyaWJ1dGUoYSxcbjIpLG51bGw9PT1iP3M6Yn0scHJvcDpmdW5jdGlvbihiLGEsYyl7aWYoQihjKSliW2FdPWM7ZWxzZSByZXR1cm4gYlthXX0sdGV4dDpmdW5jdGlvbigpe2Z1bmN0aW9uIGIoYixkKXt2YXIgZT1hW2Iubm9kZVR5cGVdO2lmKEQoZCkpcmV0dXJuIGU/YltlXTpcIlwiO2JbZV09ZH12YXIgYT1bXTs5PlM/KGFbMV09XCJpbm5lclRleHRcIixhWzNdPVwibm9kZVZhbHVlXCIpOmFbMV09YVszXT1cInRleHRDb250ZW50XCI7Yi4kZHY9XCJcIjtyZXR1cm4gYn0oKSx2YWw6ZnVuY3Rpb24oYixhKXtpZihEKGEpKXtpZihcIlNFTEVDVFwiPT09TGEoYikmJmIubXVsdGlwbGUpe3ZhciBjPVtdO3EoYi5vcHRpb25zLGZ1bmN0aW9uKGEpe2Euc2VsZWN0ZWQmJmMucHVzaChhLnZhbHVlfHxhLnRleHQpfSk7cmV0dXJuIDA9PT1jLmxlbmd0aD9udWxsOmN9cmV0dXJuIGIudmFsdWV9Yi52YWx1ZT1hfSxodG1sOmZ1bmN0aW9uKGIsYSl7aWYoRChhKSlyZXR1cm4gYi5pbm5lckhUTUw7Zm9yKHZhciBjPTAsZD1iLmNoaWxkTm9kZXM7YzxcbmQubGVuZ3RoO2MrKylJYShkW2NdKTtiLmlubmVySFRNTD1hfSxlbXB0eTpwY30sZnVuY3Rpb24oYixhKXtSLnByb3RvdHlwZVthXT1mdW5jdGlvbihhLGQpe3ZhciBlLGcsZj10aGlzLmxlbmd0aDtpZihiIT09cGMmJigyPT1iLmxlbmd0aCYmYiE9PUtiJiZiIT09b2M/YTpkKT09PXMpe2lmKFUoYSkpe2ZvcihlPTA7ZTxmO2UrKylpZihiPT09bmMpYih0aGlzW2VdLGEpO2Vsc2UgZm9yKGcgaW4gYSliKHRoaXNbZV0sZyxhW2ddKTtyZXR1cm4gdGhpc31lPWIuJGR2O2Y9ZT09PXM/TWF0aC5taW4oZiwxKTpmO2ZvcihnPTA7ZzxmO2crKyl7dmFyIGs9Yih0aGlzW2ddLGEsZCk7ZT1lP2UrazprfXJldHVybiBlfWZvcihlPTA7ZTxmO2UrKyliKHRoaXNbZV0sYSxkKTtyZXR1cm4gdGhpc319KTtxKHtyZW1vdmVEYXRhOmxjLGRlYWxvYzpJYSxvbjpmdW5jdGlvbiBhKGMsZCxlLGcpe2lmKEIoZykpdGhyb3cgR2IoXCJvbmFyZ3NcIik7dmFyIGY9bGEoYyxcImV2ZW50c1wiKSxrPWxhKGMsXCJoYW5kbGVcIik7XG5mfHxsYShjLFwiZXZlbnRzXCIsZj17fSk7a3x8bGEoYyxcImhhbmRsZVwiLGs9bmUoYyxmKSk7cShkLnNwbGl0KFwiIFwiKSxmdW5jdGlvbihkKXt2YXIgZz1mW2RdO2lmKCFnKXtpZihcIm1vdXNlZW50ZXJcIj09ZHx8XCJtb3VzZWxlYXZlXCI9PWQpe3ZhciBsPVYuYm9keS5jb250YWluc3x8Vi5ib2R5LmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uP2Z1bmN0aW9uKGEsYyl7dmFyIGQ9OT09PWEubm9kZVR5cGU/YS5kb2N1bWVudEVsZW1lbnQ6YSxlPWMmJmMucGFyZW50Tm9kZTtyZXR1cm4gYT09PWV8fCEhKGUmJjE9PT1lLm5vZGVUeXBlJiYoZC5jb250YWlucz9kLmNvbnRhaW5zKGUpOmEuY29tcGFyZURvY3VtZW50UG9zaXRpb24mJmEuY29tcGFyZURvY3VtZW50UG9zaXRpb24oZSkmMTYpKX06ZnVuY3Rpb24oYSxjKXtpZihjKWZvcig7Yz1jLnBhcmVudE5vZGU7KWlmKGM9PT1hKXJldHVybiEwO3JldHVybiExfTtmW2RdPVtdO2EoYyx7bW91c2VsZWF2ZTpcIm1vdXNlb3V0XCIsbW91c2VlbnRlcjpcIm1vdXNlb3ZlclwifVtkXSxcbmZ1bmN0aW9uKGEpe3ZhciBjPWEucmVsYXRlZFRhcmdldDtjJiYoYz09PXRoaXN8fGwodGhpcyxjKSl8fGsoYSxkKX0pfWVsc2UgcGIoYyxkLGspLGZbZF09W107Zz1mW2RdfWcucHVzaChlKX0pfSxvZmY6bWMsb25lOmZ1bmN0aW9uKGEsYyxkKXthPXcoYSk7YS5vbihjLGZ1bmN0aW9uIGcoKXthLm9mZihjLGQpO2Eub2ZmKGMsZyl9KTthLm9uKGMsZCl9LHJlcGxhY2VXaXRoOmZ1bmN0aW9uKGEsYyl7dmFyIGQsZT1hLnBhcmVudE5vZGU7SWEoYSk7cShuZXcgUihjKSxmdW5jdGlvbihjKXtkP2UuaW5zZXJ0QmVmb3JlKGMsZC5uZXh0U2libGluZyk6ZS5yZXBsYWNlQ2hpbGQoYyxhKTtkPWN9KX0sY2hpbGRyZW46ZnVuY3Rpb24oYSl7dmFyIGM9W107cShhLmNoaWxkTm9kZXMsZnVuY3Rpb24oYSl7MT09PWEubm9kZVR5cGUmJmMucHVzaChhKX0pO3JldHVybiBjfSxjb250ZW50czpmdW5jdGlvbihhKXtyZXR1cm4gYS5jb250ZW50RG9jdW1lbnR8fGEuY2hpbGROb2Rlc3x8W119LGFwcGVuZDpmdW5jdGlvbihhLFxuYyl7cShuZXcgUihjKSxmdW5jdGlvbihjKXsxIT09YS5ub2RlVHlwZSYmMTEhPT1hLm5vZGVUeXBlfHxhLmFwcGVuZENoaWxkKGMpfSl9LHByZXBlbmQ6ZnVuY3Rpb24oYSxjKXtpZigxPT09YS5ub2RlVHlwZSl7dmFyIGQ9YS5maXJzdENoaWxkO3EobmV3IFIoYyksZnVuY3Rpb24oYyl7YS5pbnNlcnRCZWZvcmUoYyxkKX0pfX0sd3JhcDpmdW5jdGlvbihhLGMpe2M9dyhjKVswXTt2YXIgZD1hLnBhcmVudE5vZGU7ZCYmZC5yZXBsYWNlQ2hpbGQoYyxhKTtjLmFwcGVuZENoaWxkKGEpfSxyZW1vdmU6ZnVuY3Rpb24oYSl7SWEoYSk7dmFyIGM9YS5wYXJlbnROb2RlO2MmJmMucmVtb3ZlQ2hpbGQoYSl9LGFmdGVyOmZ1bmN0aW9uKGEsYyl7dmFyIGQ9YSxlPWEucGFyZW50Tm9kZTtxKG5ldyBSKGMpLGZ1bmN0aW9uKGEpe2UuaW5zZXJ0QmVmb3JlKGEsZC5uZXh0U2libGluZyk7ZD1hfSl9LGFkZENsYXNzOmtiLHJlbW92ZUNsYXNzOmpiLHRvZ2dsZUNsYXNzOmZ1bmN0aW9uKGEsYyxkKXtjJiZcbnEoYy5zcGxpdChcIiBcIiksZnVuY3Rpb24oYyl7dmFyIGc9ZDtEKGcpJiYoZz0hS2IoYSxjKSk7KGc/a2I6amIpKGEsYyl9KX0scGFyZW50OmZ1bmN0aW9uKGEpe3JldHVybihhPWEucGFyZW50Tm9kZSkmJjExIT09YS5ub2RlVHlwZT9hOm51bGx9LG5leHQ6ZnVuY3Rpb24oYSl7aWYoYS5uZXh0RWxlbWVudFNpYmxpbmcpcmV0dXJuIGEubmV4dEVsZW1lbnRTaWJsaW5nO2ZvcihhPWEubmV4dFNpYmxpbmc7bnVsbCE9YSYmMSE9PWEubm9kZVR5cGU7KWE9YS5uZXh0U2libGluZztyZXR1cm4gYX0sZmluZDpmdW5jdGlvbihhLGMpe3JldHVybiBhLmdldEVsZW1lbnRzQnlUYWdOYW1lP2EuZ2V0RWxlbWVudHNCeVRhZ05hbWUoYyk6W119LGNsb25lOkpiLHRyaWdnZXJIYW5kbGVyOmZ1bmN0aW9uKGEsYyxkKXtjPShsYShhLFwiZXZlbnRzXCIpfHx7fSlbY107ZD1kfHxbXTt2YXIgZT1be3ByZXZlbnREZWZhdWx0Onksc3RvcFByb3BhZ2F0aW9uOnl9XTtxKGMsZnVuY3Rpb24oYyl7Yy5hcHBseShhLFxuZS5jb25jYXQoZCkpfSl9fSxmdW5jdGlvbihhLGMpe1IucHJvdG90eXBlW2NdPWZ1bmN0aW9uKGMsZSxnKXtmb3IodmFyIGYsaz0wO2s8dGhpcy5sZW5ndGg7aysrKUQoZik/KGY9YSh0aGlzW2tdLGMsZSxnKSxCKGYpJiYoZj13KGYpKSk6SWIoZixhKHRoaXNba10sYyxlLGcpKTtyZXR1cm4gQihmKT9mOnRoaXN9O1IucHJvdG90eXBlLmJpbmQ9Ui5wcm90b3R5cGUub247Ui5wcm90b3R5cGUudW5iaW5kPVIucHJvdG90eXBlLm9mZn0pO1lhLnByb3RvdHlwZT17cHV0OmZ1bmN0aW9uKGEsYyl7dGhpc1tKYShhKV09Y30sZ2V0OmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzW0phKGEpXX0scmVtb3ZlOmZ1bmN0aW9uKGEpe3ZhciBjPXRoaXNbYT1KYShhKV07ZGVsZXRlIHRoaXNbYV07cmV0dXJuIGN9fTt2YXIgcGU9L15mdW5jdGlvblxccypbXlxcKF0qXFwoXFxzKihbXlxcKV0qKVxcKS9tLHFlPS8sLyxyZT0vXlxccyooXz8pKFxcUys/KVxcMVxccyokLyxvZT0vKChcXC9cXC8uKiQpfChcXC9cXCpbXFxzXFxTXSo/XFwqXFwvKSkvbWcsXG5aYT10KFwiJGluamVjdG9yXCIpLE1lPXQoXCIkYW5pbWF0ZVwiKSxMZD1bXCIkcHJvdmlkZVwiLGZ1bmN0aW9uKGEpe3RoaXMuJCRzZWxlY3RvcnM9e307dGhpcy5yZWdpc3Rlcj1mdW5jdGlvbihjLGQpe3ZhciBlPWMrXCItYW5pbWF0aW9uXCI7aWYoYyYmXCIuXCIhPWMuY2hhckF0KDApKXRocm93IE1lKFwibm90Y3NlbFwiLGMpO3RoaXMuJCRzZWxlY3RvcnNbYy5zdWJzdHIoMSldPWU7YS5mYWN0b3J5KGUsZCl9O3RoaXMuY2xhc3NOYW1lRmlsdGVyPWZ1bmN0aW9uKGEpezE9PT1hcmd1bWVudHMubGVuZ3RoJiYodGhpcy4kJGNsYXNzTmFtZUZpbHRlcj1hIGluc3RhbmNlb2YgUmVnRXhwP2E6bnVsbCk7cmV0dXJuIHRoaXMuJCRjbGFzc05hbWVGaWx0ZXJ9O3RoaXMuJGdldD1bXCIkdGltZW91dFwiLFwiJCRhc3luY0NhbGxiYWNrXCIsZnVuY3Rpb24oYSxkKXtyZXR1cm57ZW50ZXI6ZnVuY3Rpb24oYSxjLGYsayl7Zj9mLmFmdGVyKGEpOihjJiZjWzBdfHwoYz1mLnBhcmVudCgpKSxjLmFwcGVuZChhKSk7ayYmXG5kKGspfSxsZWF2ZTpmdW5jdGlvbihhLGMpe2EucmVtb3ZlKCk7YyYmZChjKX0sbW92ZTpmdW5jdGlvbihhLGMsZCxrKXt0aGlzLmVudGVyKGEsYyxkLGspfSxhZGRDbGFzczpmdW5jdGlvbihhLGMsZil7Yz1DKGMpP2M6TyhjKT9jLmpvaW4oXCIgXCIpOlwiXCI7cShhLGZ1bmN0aW9uKGEpe2tiKGEsYyl9KTtmJiZkKGYpfSxyZW1vdmVDbGFzczpmdW5jdGlvbihhLGMsZil7Yz1DKGMpP2M6TyhjKT9jLmpvaW4oXCIgXCIpOlwiXCI7cShhLGZ1bmN0aW9uKGEpe2piKGEsYyl9KTtmJiZkKGYpfSxzZXRDbGFzczpmdW5jdGlvbihhLGMsZixrKXtxKGEsZnVuY3Rpb24oYSl7a2IoYSxjKTtqYihhLGYpfSk7ayYmZChrKX0sZW5hYmxlZDp5fX1dfV0saWE9dChcIiRjb21waWxlXCIpO2djLiRpbmplY3Q9W1wiJHByb3ZpZGVcIixcIiQkc2FuaXRpemVVcmlQcm92aWRlclwiXTt2YXIgdWU9L14oeFtcXDpcXC1fXXxkYXRhW1xcOlxcLV9dKS9pLHpjPXQoXCIkaW50ZXJwb2xhdGVcIiksTmU9L14oW15cXD8jXSopKFxcPyhbXiNdKikpPygjKC4qKSk/JC8sXG54ZT17aHR0cDo4MCxodHRwczo0NDMsZnRwOjIxfSxQYj10KFwiJGxvY2F0aW9uXCIpO1JiLnByb3RvdHlwZT1RYi5wcm90b3R5cGU9Q2MucHJvdG90eXBlPXskJGh0bWw1OiExLCQkcmVwbGFjZTohMSxhYnNVcmw6cWIoXCIkJGFic1VybFwiKSx1cmw6ZnVuY3Rpb24oYSxjKXtpZihEKGEpKXJldHVybiB0aGlzLiQkdXJsO3ZhciBkPU5lLmV4ZWMoYSk7ZFsxXSYmdGhpcy5wYXRoKGRlY29kZVVSSUNvbXBvbmVudChkWzFdKSk7KGRbMl18fGRbMV0pJiZ0aGlzLnNlYXJjaChkWzNdfHxcIlwiKTt0aGlzLmhhc2goZFs1XXx8XCJcIixjKTtyZXR1cm4gdGhpc30scHJvdG9jb2w6cWIoXCIkJHByb3RvY29sXCIpLGhvc3Q6cWIoXCIkJGhvc3RcIikscG9ydDpxYihcIiQkcG9ydFwiKSxwYXRoOkRjKFwiJCRwYXRoXCIsZnVuY3Rpb24oYSl7cmV0dXJuXCIvXCI9PWEuY2hhckF0KDApP2E6XCIvXCIrYX0pLHNlYXJjaDpmdW5jdGlvbihhLGMpe3N3aXRjaChhcmd1bWVudHMubGVuZ3RoKXtjYXNlIDA6cmV0dXJuIHRoaXMuJCRzZWFyY2g7XG5jYXNlIDE6aWYoQyhhKSl0aGlzLiQkc2VhcmNoPWNjKGEpO2Vsc2UgaWYoVShhKSl0aGlzLiQkc2VhcmNoPWE7ZWxzZSB0aHJvdyBQYihcImlzcmNoYXJnXCIpO2JyZWFrO2RlZmF1bHQ6RChjKXx8bnVsbD09PWM/ZGVsZXRlIHRoaXMuJCRzZWFyY2hbYV06dGhpcy4kJHNlYXJjaFthXT1jfXRoaXMuJCRjb21wb3NlKCk7cmV0dXJuIHRoaXN9LGhhc2g6RGMoXCIkJGhhc2hcIixGYSkscmVwbGFjZTpmdW5jdGlvbigpe3RoaXMuJCRyZXBsYWNlPSEwO3JldHVybiB0aGlzfX07dmFyIERhPXQoXCIkcGFyc2VcIiksR2M9e30sdGEsY2I9e1wibnVsbFwiOmZ1bmN0aW9uKCl7cmV0dXJuIG51bGx9LFwidHJ1ZVwiOmZ1bmN0aW9uKCl7cmV0dXJuITB9LFwiZmFsc2VcIjpmdW5jdGlvbigpe3JldHVybiExfSx1bmRlZmluZWQ6eSxcIitcIjpmdW5jdGlvbihhLGMsZCxlKXtkPWQoYSxjKTtlPWUoYSxjKTtyZXR1cm4gQihkKT9CKGUpP2QrZTpkOkIoZSk/ZTpzfSxcIi1cIjpmdW5jdGlvbihhLGMsZCxlKXtkPWQoYSxjKTtlPVxuZShhLGMpO3JldHVybihCKGQpP2Q6MCktKEIoZSk/ZTowKX0sXCIqXCI6ZnVuY3Rpb24oYSxjLGQsZSl7cmV0dXJuIGQoYSxjKSplKGEsYyl9LFwiL1wiOmZ1bmN0aW9uKGEsYyxkLGUpe3JldHVybiBkKGEsYykvZShhLGMpfSxcIiVcIjpmdW5jdGlvbihhLGMsZCxlKXtyZXR1cm4gZChhLGMpJWUoYSxjKX0sXCJeXCI6ZnVuY3Rpb24oYSxjLGQsZSl7cmV0dXJuIGQoYSxjKV5lKGEsYyl9LFwiPVwiOnksXCI9PT1cIjpmdW5jdGlvbihhLGMsZCxlKXtyZXR1cm4gZChhLGMpPT09ZShhLGMpfSxcIiE9PVwiOmZ1bmN0aW9uKGEsYyxkLGUpe3JldHVybiBkKGEsYykhPT1lKGEsYyl9LFwiPT1cIjpmdW5jdGlvbihhLGMsZCxlKXtyZXR1cm4gZChhLGMpPT1lKGEsYyl9LFwiIT1cIjpmdW5jdGlvbihhLGMsZCxlKXtyZXR1cm4gZChhLGMpIT1lKGEsYyl9LFwiPFwiOmZ1bmN0aW9uKGEsYyxkLGUpe3JldHVybiBkKGEsYyk8ZShhLGMpfSxcIj5cIjpmdW5jdGlvbihhLGMsZCxlKXtyZXR1cm4gZChhLGMpPmUoYSxjKX0sXCI8PVwiOmZ1bmN0aW9uKGEsXG5jLGQsZSl7cmV0dXJuIGQoYSxjKTw9ZShhLGMpfSxcIj49XCI6ZnVuY3Rpb24oYSxjLGQsZSl7cmV0dXJuIGQoYSxjKT49ZShhLGMpfSxcIiYmXCI6ZnVuY3Rpb24oYSxjLGQsZSl7cmV0dXJuIGQoYSxjKSYmZShhLGMpfSxcInx8XCI6ZnVuY3Rpb24oYSxjLGQsZSl7cmV0dXJuIGQoYSxjKXx8ZShhLGMpfSxcIiZcIjpmdW5jdGlvbihhLGMsZCxlKXtyZXR1cm4gZChhLGMpJmUoYSxjKX0sXCJ8XCI6ZnVuY3Rpb24oYSxjLGQsZSl7cmV0dXJuIGUoYSxjKShhLGMsZChhLGMpKX0sXCIhXCI6ZnVuY3Rpb24oYSxjLGQpe3JldHVybiFkKGEsYyl9fSxPZT17bjpcIlxcblwiLGY6XCJcXGZcIixyOlwiXFxyXCIsdDpcIlxcdFwiLHY6XCJcXHZcIixcIidcIjpcIidcIiwnXCInOidcIid9LFRiPWZ1bmN0aW9uKGEpe3RoaXMub3B0aW9ucz1hfTtUYi5wcm90b3R5cGU9e2NvbnN0cnVjdG9yOlRiLGxleDpmdW5jdGlvbihhKXt0aGlzLnRleHQ9YTt0aGlzLmluZGV4PTA7dGhpcy5jaD1zO3RoaXMubGFzdENoPVwiOlwiO2Zvcih0aGlzLnRva2Vucz1bXTt0aGlzLmluZGV4PFxudGhpcy50ZXh0Lmxlbmd0aDspe3RoaXMuY2g9dGhpcy50ZXh0LmNoYXJBdCh0aGlzLmluZGV4KTtpZih0aGlzLmlzKFwiXFxcIidcIikpdGhpcy5yZWFkU3RyaW5nKHRoaXMuY2gpO2Vsc2UgaWYodGhpcy5pc051bWJlcih0aGlzLmNoKXx8dGhpcy5pcyhcIi5cIikmJnRoaXMuaXNOdW1iZXIodGhpcy5wZWVrKCkpKXRoaXMucmVhZE51bWJlcigpO2Vsc2UgaWYodGhpcy5pc0lkZW50KHRoaXMuY2gpKXRoaXMucmVhZElkZW50KCk7ZWxzZSBpZih0aGlzLmlzKFwiKCl7fVtdLiw7Oj9cIikpdGhpcy50b2tlbnMucHVzaCh7aW5kZXg6dGhpcy5pbmRleCx0ZXh0OnRoaXMuY2h9KSx0aGlzLmluZGV4Kys7ZWxzZSBpZih0aGlzLmlzV2hpdGVzcGFjZSh0aGlzLmNoKSl7dGhpcy5pbmRleCsrO2NvbnRpbnVlfWVsc2V7YT10aGlzLmNoK3RoaXMucGVlaygpO3ZhciBjPWErdGhpcy5wZWVrKDIpLGQ9Y2JbdGhpcy5jaF0sZT1jYlthXSxnPWNiW2NdO2c/KHRoaXMudG9rZW5zLnB1c2goe2luZGV4OnRoaXMuaW5kZXgsXG50ZXh0OmMsZm46Z30pLHRoaXMuaW5kZXgrPTMpOmU/KHRoaXMudG9rZW5zLnB1c2goe2luZGV4OnRoaXMuaW5kZXgsdGV4dDphLGZuOmV9KSx0aGlzLmluZGV4Kz0yKTpkPyh0aGlzLnRva2Vucy5wdXNoKHtpbmRleDp0aGlzLmluZGV4LHRleHQ6dGhpcy5jaCxmbjpkfSksdGhpcy5pbmRleCs9MSk6dGhpcy50aHJvd0Vycm9yKFwiVW5leHBlY3RlZCBuZXh0IGNoYXJhY3RlciBcIix0aGlzLmluZGV4LHRoaXMuaW5kZXgrMSl9dGhpcy5sYXN0Q2g9dGhpcy5jaH1yZXR1cm4gdGhpcy50b2tlbnN9LGlzOmZ1bmN0aW9uKGEpe3JldHVybi0xIT09YS5pbmRleE9mKHRoaXMuY2gpfSx3YXM6ZnVuY3Rpb24oYSl7cmV0dXJuLTEhPT1hLmluZGV4T2YodGhpcy5sYXN0Q2gpfSxwZWVrOmZ1bmN0aW9uKGEpe2E9YXx8MTtyZXR1cm4gdGhpcy5pbmRleCthPHRoaXMudGV4dC5sZW5ndGg/dGhpcy50ZXh0LmNoYXJBdCh0aGlzLmluZGV4K2EpOiExfSxpc051bWJlcjpmdW5jdGlvbihhKXtyZXR1cm5cIjBcIjw9XG5hJiZcIjlcIj49YX0saXNXaGl0ZXNwYWNlOmZ1bmN0aW9uKGEpe3JldHVyblwiIFwiPT09YXx8XCJcXHJcIj09PWF8fFwiXFx0XCI9PT1hfHxcIlxcblwiPT09YXx8XCJcXHZcIj09PWF8fFwiXFx1MDBhMFwiPT09YX0saXNJZGVudDpmdW5jdGlvbihhKXtyZXR1cm5cImFcIjw9YSYmXCJ6XCI+PWF8fFwiQVwiPD1hJiZcIlpcIj49YXx8XCJfXCI9PT1hfHxcIiRcIj09PWF9LGlzRXhwT3BlcmF0b3I6ZnVuY3Rpb24oYSl7cmV0dXJuXCItXCI9PT1hfHxcIitcIj09PWF8fHRoaXMuaXNOdW1iZXIoYSl9LHRocm93RXJyb3I6ZnVuY3Rpb24oYSxjLGQpe2Q9ZHx8dGhpcy5pbmRleDtjPUIoYyk/XCJzIFwiK2MrXCItXCIrdGhpcy5pbmRleCtcIiBbXCIrdGhpcy50ZXh0LnN1YnN0cmluZyhjLGQpK1wiXVwiOlwiIFwiK2Q7dGhyb3cgRGEoXCJsZXhlcnJcIixhLGMsdGhpcy50ZXh0KTt9LHJlYWROdW1iZXI6ZnVuY3Rpb24oKXtmb3IodmFyIGE9XCJcIixjPXRoaXMuaW5kZXg7dGhpcy5pbmRleDx0aGlzLnRleHQubGVuZ3RoOyl7dmFyIGQ9TCh0aGlzLnRleHQuY2hhckF0KHRoaXMuaW5kZXgpKTtcbmlmKFwiLlwiPT1kfHx0aGlzLmlzTnVtYmVyKGQpKWErPWQ7ZWxzZXt2YXIgZT10aGlzLnBlZWsoKTtpZihcImVcIj09ZCYmdGhpcy5pc0V4cE9wZXJhdG9yKGUpKWErPWQ7ZWxzZSBpZih0aGlzLmlzRXhwT3BlcmF0b3IoZCkmJmUmJnRoaXMuaXNOdW1iZXIoZSkmJlwiZVwiPT1hLmNoYXJBdChhLmxlbmd0aC0xKSlhKz1kO2Vsc2UgaWYoIXRoaXMuaXNFeHBPcGVyYXRvcihkKXx8ZSYmdGhpcy5pc051bWJlcihlKXx8XCJlXCIhPWEuY2hhckF0KGEubGVuZ3RoLTEpKWJyZWFrO2Vsc2UgdGhpcy50aHJvd0Vycm9yKFwiSW52YWxpZCBleHBvbmVudFwiKX10aGlzLmluZGV4Kyt9YSo9MTt0aGlzLnRva2Vucy5wdXNoKHtpbmRleDpjLHRleHQ6YSxsaXRlcmFsOiEwLGNvbnN0YW50OiEwLGZuOmZ1bmN0aW9uKCl7cmV0dXJuIGF9fSl9LHJlYWRJZGVudDpmdW5jdGlvbigpe2Zvcih2YXIgYT10aGlzLGM9XCJcIixkPXRoaXMuaW5kZXgsZSxnLGYsazt0aGlzLmluZGV4PHRoaXMudGV4dC5sZW5ndGg7KXtrPXRoaXMudGV4dC5jaGFyQXQodGhpcy5pbmRleCk7XG5pZihcIi5cIj09PWt8fHRoaXMuaXNJZGVudChrKXx8dGhpcy5pc051bWJlcihrKSlcIi5cIj09PWsmJihlPXRoaXMuaW5kZXgpLGMrPWs7ZWxzZSBicmVhazt0aGlzLmluZGV4Kyt9aWYoZSlmb3IoZz10aGlzLmluZGV4O2c8dGhpcy50ZXh0Lmxlbmd0aDspe2s9dGhpcy50ZXh0LmNoYXJBdChnKTtpZihcIihcIj09PWspe2Y9Yy5zdWJzdHIoZS1kKzEpO2M9Yy5zdWJzdHIoMCxlLWQpO3RoaXMuaW5kZXg9ZzticmVha31pZih0aGlzLmlzV2hpdGVzcGFjZShrKSlnKys7ZWxzZSBicmVha31kPXtpbmRleDpkLHRleHQ6Y307aWYoY2IuaGFzT3duUHJvcGVydHkoYykpZC5mbj1jYltjXSxkLmxpdGVyYWw9ITAsZC5jb25zdGFudD0hMDtlbHNle3ZhciBtPUZjKGMsdGhpcy5vcHRpb25zLHRoaXMudGV4dCk7ZC5mbj1KKGZ1bmN0aW9uKGEsYyl7cmV0dXJuIG0oYSxjKX0se2Fzc2lnbjpmdW5jdGlvbihkLGUpe3JldHVybiByYihkLGMsZSxhLnRleHQsYS5vcHRpb25zKX19KX10aGlzLnRva2Vucy5wdXNoKGQpO1xuZiYmKHRoaXMudG9rZW5zLnB1c2goe2luZGV4OmUsdGV4dDpcIi5cIn0pLHRoaXMudG9rZW5zLnB1c2goe2luZGV4OmUrMSx0ZXh0OmZ9KSl9LHJlYWRTdHJpbmc6ZnVuY3Rpb24oYSl7dmFyIGM9dGhpcy5pbmRleDt0aGlzLmluZGV4Kys7Zm9yKHZhciBkPVwiXCIsZT1hLGc9ITE7dGhpcy5pbmRleDx0aGlzLnRleHQubGVuZ3RoOyl7dmFyIGY9dGhpcy50ZXh0LmNoYXJBdCh0aGlzLmluZGV4KSxlPWUrZjtpZihnKVwidVwiPT09Zj8oZj10aGlzLnRleHQuc3Vic3RyaW5nKHRoaXMuaW5kZXgrMSx0aGlzLmluZGV4KzUpLGYubWF0Y2goL1tcXGRhLWZdezR9L2kpfHx0aGlzLnRocm93RXJyb3IoXCJJbnZhbGlkIHVuaWNvZGUgZXNjYXBlIFtcXFxcdVwiK2YrXCJdXCIpLHRoaXMuaW5kZXgrPTQsZCs9U3RyaW5nLmZyb21DaGFyQ29kZShwYXJzZUludChmLDE2KSkpOmQ9KGc9T2VbZl0pP2QrZzpkK2YsZz0hMTtlbHNlIGlmKFwiXFxcXFwiPT09ZilnPSEwO2Vsc2V7aWYoZj09PWEpe3RoaXMuaW5kZXgrKzt0aGlzLnRva2Vucy5wdXNoKHtpbmRleDpjLFxudGV4dDplLHN0cmluZzpkLGxpdGVyYWw6ITAsY29uc3RhbnQ6ITAsZm46ZnVuY3Rpb24oKXtyZXR1cm4gZH19KTtyZXR1cm59ZCs9Zn10aGlzLmluZGV4Kyt9dGhpcy50aHJvd0Vycm9yKFwiVW50ZXJtaW5hdGVkIHF1b3RlXCIsYyl9fTt2YXIgYmI9ZnVuY3Rpb24oYSxjLGQpe3RoaXMubGV4ZXI9YTt0aGlzLiRmaWx0ZXI9Yzt0aGlzLm9wdGlvbnM9ZH07YmIuWkVSTz1KKGZ1bmN0aW9uKCl7cmV0dXJuIDB9LHtjb25zdGFudDohMH0pO2JiLnByb3RvdHlwZT17Y29uc3RydWN0b3I6YmIscGFyc2U6ZnVuY3Rpb24oYSl7dGhpcy50ZXh0PWE7dGhpcy50b2tlbnM9dGhpcy5sZXhlci5sZXgoYSk7YT10aGlzLnN0YXRlbWVudHMoKTswIT09dGhpcy50b2tlbnMubGVuZ3RoJiZ0aGlzLnRocm93RXJyb3IoXCJpcyBhbiB1bmV4cGVjdGVkIHRva2VuXCIsdGhpcy50b2tlbnNbMF0pO2EubGl0ZXJhbD0hIWEubGl0ZXJhbDthLmNvbnN0YW50PSEhYS5jb25zdGFudDtyZXR1cm4gYX0scHJpbWFyeTpmdW5jdGlvbigpe3ZhciBhO1xuaWYodGhpcy5leHBlY3QoXCIoXCIpKWE9dGhpcy5maWx0ZXJDaGFpbigpLHRoaXMuY29uc3VtZShcIilcIik7ZWxzZSBpZih0aGlzLmV4cGVjdChcIltcIikpYT10aGlzLmFycmF5RGVjbGFyYXRpb24oKTtlbHNlIGlmKHRoaXMuZXhwZWN0KFwie1wiKSlhPXRoaXMub2JqZWN0KCk7ZWxzZXt2YXIgYz10aGlzLmV4cGVjdCgpOyhhPWMuZm4pfHx0aGlzLnRocm93RXJyb3IoXCJub3QgYSBwcmltYXJ5IGV4cHJlc3Npb25cIixjKTthLmxpdGVyYWw9ISFjLmxpdGVyYWw7YS5jb25zdGFudD0hIWMuY29uc3RhbnR9Zm9yKHZhciBkO2M9dGhpcy5leHBlY3QoXCIoXCIsXCJbXCIsXCIuXCIpOylcIihcIj09PWMudGV4dD8oYT10aGlzLmZ1bmN0aW9uQ2FsbChhLGQpLGQ9bnVsbCk6XCJbXCI9PT1jLnRleHQ/KGQ9YSxhPXRoaXMub2JqZWN0SW5kZXgoYSkpOlwiLlwiPT09Yy50ZXh0PyhkPWEsYT10aGlzLmZpZWxkQWNjZXNzKGEpKTp0aGlzLnRocm93RXJyb3IoXCJJTVBPU1NJQkxFXCIpO3JldHVybiBhfSx0aHJvd0Vycm9yOmZ1bmN0aW9uKGEsXG5jKXt0aHJvdyBEYShcInN5bnRheFwiLGMudGV4dCxhLGMuaW5kZXgrMSx0aGlzLnRleHQsdGhpcy50ZXh0LnN1YnN0cmluZyhjLmluZGV4KSk7fSxwZWVrVG9rZW46ZnVuY3Rpb24oKXtpZigwPT09dGhpcy50b2tlbnMubGVuZ3RoKXRocm93IERhKFwidWVvZVwiLHRoaXMudGV4dCk7cmV0dXJuIHRoaXMudG9rZW5zWzBdfSxwZWVrOmZ1bmN0aW9uKGEsYyxkLGUpe2lmKDA8dGhpcy50b2tlbnMubGVuZ3RoKXt2YXIgZz10aGlzLnRva2Vuc1swXSxmPWcudGV4dDtpZihmPT09YXx8Zj09PWN8fGY9PT1kfHxmPT09ZXx8IShhfHxjfHxkfHxlKSlyZXR1cm4gZ31yZXR1cm4hMX0sZXhwZWN0OmZ1bmN0aW9uKGEsYyxkLGUpe3JldHVybihhPXRoaXMucGVlayhhLGMsZCxlKSk/KHRoaXMudG9rZW5zLnNoaWZ0KCksYSk6ITF9LGNvbnN1bWU6ZnVuY3Rpb24oYSl7dGhpcy5leHBlY3QoYSl8fHRoaXMudGhyb3dFcnJvcihcImlzIHVuZXhwZWN0ZWQsIGV4cGVjdGluZyBbXCIrYStcIl1cIix0aGlzLnBlZWsoKSl9LFxudW5hcnlGbjpmdW5jdGlvbihhLGMpe3JldHVybiBKKGZ1bmN0aW9uKGQsZSl7cmV0dXJuIGEoZCxlLGMpfSx7Y29uc3RhbnQ6Yy5jb25zdGFudH0pfSx0ZXJuYXJ5Rm46ZnVuY3Rpb24oYSxjLGQpe3JldHVybiBKKGZ1bmN0aW9uKGUsZyl7cmV0dXJuIGEoZSxnKT9jKGUsZyk6ZChlLGcpfSx7Y29uc3RhbnQ6YS5jb25zdGFudCYmYy5jb25zdGFudCYmZC5jb25zdGFudH0pfSxiaW5hcnlGbjpmdW5jdGlvbihhLGMsZCl7cmV0dXJuIEooZnVuY3Rpb24oZSxnKXtyZXR1cm4gYyhlLGcsYSxkKX0se2NvbnN0YW50OmEuY29uc3RhbnQmJmQuY29uc3RhbnR9KX0sc3RhdGVtZW50czpmdW5jdGlvbigpe2Zvcih2YXIgYT1bXTs7KWlmKDA8dGhpcy50b2tlbnMubGVuZ3RoJiYhdGhpcy5wZWVrKFwifVwiLFwiKVwiLFwiO1wiLFwiXVwiKSYmYS5wdXNoKHRoaXMuZmlsdGVyQ2hhaW4oKSksIXRoaXMuZXhwZWN0KFwiO1wiKSlyZXR1cm4gMT09PWEubGVuZ3RoP2FbMF06ZnVuY3Rpb24oYyxkKXtmb3IodmFyIGUsZz1cbjA7ZzxhLmxlbmd0aDtnKyspe3ZhciBmPWFbZ107ZiYmKGU9ZihjLGQpKX1yZXR1cm4gZX19LGZpbHRlckNoYWluOmZ1bmN0aW9uKCl7Zm9yKHZhciBhPXRoaXMuZXhwcmVzc2lvbigpLGM7OylpZihjPXRoaXMuZXhwZWN0KFwifFwiKSlhPXRoaXMuYmluYXJ5Rm4oYSxjLmZuLHRoaXMuZmlsdGVyKCkpO2Vsc2UgcmV0dXJuIGF9LGZpbHRlcjpmdW5jdGlvbigpe2Zvcih2YXIgYT10aGlzLmV4cGVjdCgpLGM9dGhpcy4kZmlsdGVyKGEudGV4dCksZD1bXTs7KWlmKGE9dGhpcy5leHBlY3QoXCI6XCIpKWQucHVzaCh0aGlzLmV4cHJlc3Npb24oKSk7ZWxzZXt2YXIgZT1mdW5jdGlvbihhLGUsayl7az1ba107Zm9yKHZhciBtPTA7bTxkLmxlbmd0aDttKyspay5wdXNoKGRbbV0oYSxlKSk7cmV0dXJuIGMuYXBwbHkoYSxrKX07cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGV9fX0sZXhwcmVzc2lvbjpmdW5jdGlvbigpe3JldHVybiB0aGlzLmFzc2lnbm1lbnQoKX0sYXNzaWdubWVudDpmdW5jdGlvbigpe3ZhciBhPVxudGhpcy50ZXJuYXJ5KCksYyxkO3JldHVybihkPXRoaXMuZXhwZWN0KFwiPVwiKSk/KGEuYXNzaWdufHx0aGlzLnRocm93RXJyb3IoXCJpbXBsaWVzIGFzc2lnbm1lbnQgYnV0IFtcIit0aGlzLnRleHQuc3Vic3RyaW5nKDAsZC5pbmRleCkrXCJdIGNhbiBub3QgYmUgYXNzaWduZWQgdG9cIixkKSxjPXRoaXMudGVybmFyeSgpLGZ1bmN0aW9uKGQsZyl7cmV0dXJuIGEuYXNzaWduKGQsYyhkLGcpLGcpfSk6YX0sdGVybmFyeTpmdW5jdGlvbigpe3ZhciBhPXRoaXMubG9naWNhbE9SKCksYyxkO2lmKHRoaXMuZXhwZWN0KFwiP1wiKSl7Yz10aGlzLnRlcm5hcnkoKTtpZihkPXRoaXMuZXhwZWN0KFwiOlwiKSlyZXR1cm4gdGhpcy50ZXJuYXJ5Rm4oYSxjLHRoaXMudGVybmFyeSgpKTt0aGlzLnRocm93RXJyb3IoXCJleHBlY3RlZCA6XCIsZCl9ZWxzZSByZXR1cm4gYX0sbG9naWNhbE9SOmZ1bmN0aW9uKCl7Zm9yKHZhciBhPXRoaXMubG9naWNhbEFORCgpLGM7OylpZihjPXRoaXMuZXhwZWN0KFwifHxcIikpYT10aGlzLmJpbmFyeUZuKGEsXG5jLmZuLHRoaXMubG9naWNhbEFORCgpKTtlbHNlIHJldHVybiBhfSxsb2dpY2FsQU5EOmZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5lcXVhbGl0eSgpLGM7aWYoYz10aGlzLmV4cGVjdChcIiYmXCIpKWE9dGhpcy5iaW5hcnlGbihhLGMuZm4sdGhpcy5sb2dpY2FsQU5EKCkpO3JldHVybiBhfSxlcXVhbGl0eTpmdW5jdGlvbigpe3ZhciBhPXRoaXMucmVsYXRpb25hbCgpLGM7aWYoYz10aGlzLmV4cGVjdChcIj09XCIsXCIhPVwiLFwiPT09XCIsXCIhPT1cIikpYT10aGlzLmJpbmFyeUZuKGEsYy5mbix0aGlzLmVxdWFsaXR5KCkpO3JldHVybiBhfSxyZWxhdGlvbmFsOmZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5hZGRpdGl2ZSgpLGM7aWYoYz10aGlzLmV4cGVjdChcIjxcIixcIj5cIixcIjw9XCIsXCI+PVwiKSlhPXRoaXMuYmluYXJ5Rm4oYSxjLmZuLHRoaXMucmVsYXRpb25hbCgpKTtyZXR1cm4gYX0sYWRkaXRpdmU6ZnVuY3Rpb24oKXtmb3IodmFyIGE9dGhpcy5tdWx0aXBsaWNhdGl2ZSgpLGM7Yz10aGlzLmV4cGVjdChcIitcIixcblwiLVwiKTspYT10aGlzLmJpbmFyeUZuKGEsYy5mbix0aGlzLm11bHRpcGxpY2F0aXZlKCkpO3JldHVybiBhfSxtdWx0aXBsaWNhdGl2ZTpmdW5jdGlvbigpe2Zvcih2YXIgYT10aGlzLnVuYXJ5KCksYztjPXRoaXMuZXhwZWN0KFwiKlwiLFwiL1wiLFwiJVwiKTspYT10aGlzLmJpbmFyeUZuKGEsYy5mbix0aGlzLnVuYXJ5KCkpO3JldHVybiBhfSx1bmFyeTpmdW5jdGlvbigpe3ZhciBhO3JldHVybiB0aGlzLmV4cGVjdChcIitcIik/dGhpcy5wcmltYXJ5KCk6KGE9dGhpcy5leHBlY3QoXCItXCIpKT90aGlzLmJpbmFyeUZuKGJiLlpFUk8sYS5mbix0aGlzLnVuYXJ5KCkpOihhPXRoaXMuZXhwZWN0KFwiIVwiKSk/dGhpcy51bmFyeUZuKGEuZm4sdGhpcy51bmFyeSgpKTp0aGlzLnByaW1hcnkoKX0sZmllbGRBY2Nlc3M6ZnVuY3Rpb24oYSl7dmFyIGM9dGhpcyxkPXRoaXMuZXhwZWN0KCkudGV4dCxlPUZjKGQsdGhpcy5vcHRpb25zLHRoaXMudGV4dCk7cmV0dXJuIEooZnVuY3Rpb24oYyxkLGspe3JldHVybiBlKGt8fFxuYShjLGQpKX0se2Fzc2lnbjpmdW5jdGlvbihlLGYsayl7cmV0dXJuIHJiKGEoZSxrKSxkLGYsYy50ZXh0LGMub3B0aW9ucyl9fSl9LG9iamVjdEluZGV4OmZ1bmN0aW9uKGEpe3ZhciBjPXRoaXMsZD10aGlzLmV4cHJlc3Npb24oKTt0aGlzLmNvbnN1bWUoXCJdXCIpO3JldHVybiBKKGZ1bmN0aW9uKGUsZyl7dmFyIGY9YShlLGcpLGs9ZChlLGcpLG07aWYoIWYpcmV0dXJuIHM7KGY9YWIoZltrXSxjLnRleHQpKSYmKGYudGhlbiYmYy5vcHRpb25zLnVud3JhcFByb21pc2VzKSYmKG09ZixcIiQkdlwiaW4gZnx8KG0uJCR2PXMsbS50aGVuKGZ1bmN0aW9uKGEpe20uJCR2PWF9KSksZj1mLiQkdik7cmV0dXJuIGZ9LHthc3NpZ246ZnVuY3Rpb24oZSxnLGYpe3ZhciBrPWQoZSxmKTtyZXR1cm4gYWIoYShlLGYpLGMudGV4dClba109Z319KX0sZnVuY3Rpb25DYWxsOmZ1bmN0aW9uKGEsYyl7dmFyIGQ9W107aWYoXCIpXCIhPT10aGlzLnBlZWtUb2tlbigpLnRleHQpe2RvIGQucHVzaCh0aGlzLmV4cHJlc3Npb24oKSk7XG53aGlsZSh0aGlzLmV4cGVjdChcIixcIikpfXRoaXMuY29uc3VtZShcIilcIik7dmFyIGU9dGhpcztyZXR1cm4gZnVuY3Rpb24oZyxmKXtmb3IodmFyIGs9W10sbT1jP2MoZyxmKTpnLGg9MDtoPGQubGVuZ3RoO2grKylrLnB1c2goZFtoXShnLGYpKTtoPWEoZyxmLG0pfHx5O2FiKG0sZS50ZXh0KTthYihoLGUudGV4dCk7az1oLmFwcGx5P2guYXBwbHkobSxrKTpoKGtbMF0sa1sxXSxrWzJdLGtbM10sa1s0XSk7cmV0dXJuIGFiKGssZS50ZXh0KX19LGFycmF5RGVjbGFyYXRpb246ZnVuY3Rpb24oKXt2YXIgYT1bXSxjPSEwO2lmKFwiXVwiIT09dGhpcy5wZWVrVG9rZW4oKS50ZXh0KXtkb3tpZih0aGlzLnBlZWsoXCJdXCIpKWJyZWFrO3ZhciBkPXRoaXMuZXhwcmVzc2lvbigpO2EucHVzaChkKTtkLmNvbnN0YW50fHwoYz0hMSl9d2hpbGUodGhpcy5leHBlY3QoXCIsXCIpKX10aGlzLmNvbnN1bWUoXCJdXCIpO3JldHVybiBKKGZ1bmN0aW9uKGMsZCl7Zm9yKHZhciBmPVtdLGs9MDtrPGEubGVuZ3RoO2srKylmLnB1c2goYVtrXShjLFxuZCkpO3JldHVybiBmfSx7bGl0ZXJhbDohMCxjb25zdGFudDpjfSl9LG9iamVjdDpmdW5jdGlvbigpe3ZhciBhPVtdLGM9ITA7aWYoXCJ9XCIhPT10aGlzLnBlZWtUb2tlbigpLnRleHQpe2Rve2lmKHRoaXMucGVlayhcIn1cIikpYnJlYWs7dmFyIGQ9dGhpcy5leHBlY3QoKSxkPWQuc3RyaW5nfHxkLnRleHQ7dGhpcy5jb25zdW1lKFwiOlwiKTt2YXIgZT10aGlzLmV4cHJlc3Npb24oKTthLnB1c2goe2tleTpkLHZhbHVlOmV9KTtlLmNvbnN0YW50fHwoYz0hMSl9d2hpbGUodGhpcy5leHBlY3QoXCIsXCIpKX10aGlzLmNvbnN1bWUoXCJ9XCIpO3JldHVybiBKKGZ1bmN0aW9uKGMsZCl7Zm9yKHZhciBlPXt9LG09MDttPGEubGVuZ3RoO20rKyl7dmFyIGg9YVttXTtlW2gua2V5XT1oLnZhbHVlKGMsZCl9cmV0dXJuIGV9LHtsaXRlcmFsOiEwLGNvbnN0YW50OmN9KX19O3ZhciBTYj17fSx1YT10KFwiJHNjZVwiKSxmYT17SFRNTDpcImh0bWxcIixDU1M6XCJjc3NcIixVUkw6XCJ1cmxcIixSRVNPVVJDRV9VUkw6XCJyZXNvdXJjZVVybFwiLFxuSlM6XCJqc1wifSxXPVYuY3JlYXRlRWxlbWVudChcImFcIiksSWM9c2EoVC5sb2NhdGlvbi5ocmVmLCEwKTtrYy4kaW5qZWN0PVtcIiRwcm92aWRlXCJdO0pjLiRpbmplY3Q9W1wiJGxvY2FsZVwiXTtMYy4kaW5qZWN0PVtcIiRsb2NhbGVcIl07dmFyIE9jPVwiLlwiLEplPXt5eXl5OlkoXCJGdWxsWWVhclwiLDQpLHl5OlkoXCJGdWxsWWVhclwiLDIsMCwhMCkseTpZKFwiRnVsbFllYXJcIiwxKSxNTU1NOnNiKFwiTW9udGhcIiksTU1NOnNiKFwiTW9udGhcIiwhMCksTU06WShcIk1vbnRoXCIsMiwxKSxNOlkoXCJNb250aFwiLDEsMSksZGQ6WShcIkRhdGVcIiwyKSxkOlkoXCJEYXRlXCIsMSksSEg6WShcIkhvdXJzXCIsMiksSDpZKFwiSG91cnNcIiwxKSxoaDpZKFwiSG91cnNcIiwyLC0xMiksaDpZKFwiSG91cnNcIiwxLC0xMiksbW06WShcIk1pbnV0ZXNcIiwyKSxtOlkoXCJNaW51dGVzXCIsMSksc3M6WShcIlNlY29uZHNcIiwyKSxzOlkoXCJTZWNvbmRzXCIsMSksc3NzOlkoXCJNaWxsaXNlY29uZHNcIiwzKSxFRUVFOnNiKFwiRGF5XCIpLEVFRTpzYihcIkRheVwiLCEwKSxcbmE6ZnVuY3Rpb24oYSxjKXtyZXR1cm4gMTI+YS5nZXRIb3VycygpP2MuQU1QTVNbMF06Yy5BTVBNU1sxXX0sWjpmdW5jdGlvbihhKXthPS0xKmEuZ2V0VGltZXpvbmVPZmZzZXQoKTtyZXR1cm4gYT0oMDw9YT9cIitcIjpcIlwiKSsoVWIoTWF0aFswPGE/XCJmbG9vclwiOlwiY2VpbFwiXShhLzYwKSwyKStVYihNYXRoLmFicyhhJTYwKSwyKSl9fSxJZT0vKCg/OlteeU1kSGhtc2FaRSddKyl8KD86Jyg/OlteJ118JycpKicpfCg/OkUrfHkrfE0rfGQrfEgrfGgrfG0rfHMrfGF8WikpKC4qKS8sSGU9L15cXC0/XFxkKyQvO0tjLiRpbmplY3Q9W1wiJGxvY2FsZVwiXTt2YXIgRmU9JChMKSxHZT0kKEhhKTtNYy4kaW5qZWN0PVtcIiRwYXJzZVwiXTt2YXIgY2Q9JCh7cmVzdHJpY3Q6XCJFXCIsY29tcGlsZTpmdW5jdGlvbihhLGMpezg+PVMmJihjLmhyZWZ8fGMubmFtZXx8Yy4kc2V0KFwiaHJlZlwiLFwiXCIpLGEuYXBwZW5kKFYuY3JlYXRlQ29tbWVudChcIklFIGZpeFwiKSkpO2lmKCFjLmhyZWYmJiFjLnhsaW5rSHJlZiYmIWMubmFtZSlyZXR1cm4gZnVuY3Rpb24oYSxcbmMpe3ZhciBnPVwiW29iamVjdCBTVkdBbmltYXRlZFN0cmluZ11cIj09PXdhLmNhbGwoYy5wcm9wKFwiaHJlZlwiKSk/XCJ4bGluazpocmVmXCI6XCJocmVmXCI7Yy5vbihcImNsaWNrXCIsZnVuY3Rpb24oYSl7Yy5hdHRyKGcpfHxhLnByZXZlbnREZWZhdWx0KCl9KX19fSksRWI9e307cShtYixmdW5jdGlvbihhLGMpe2lmKFwibXVsdGlwbGVcIiE9YSl7dmFyIGQ9bWEoXCJuZy1cIitjKTtFYltkXT1mdW5jdGlvbigpe3JldHVybntwcmlvcml0eToxMDAsbGluazpmdW5jdGlvbihhLGcsZil7YS4kd2F0Y2goZltkXSxmdW5jdGlvbihhKXtmLiRzZXQoYywhIWEpfSl9fX19fSk7cShbXCJzcmNcIixcInNyY3NldFwiLFwiaHJlZlwiXSxmdW5jdGlvbihhKXt2YXIgYz1tYShcIm5nLVwiK2EpO0ViW2NdPWZ1bmN0aW9uKCl7cmV0dXJue3ByaW9yaXR5Ojk5LGxpbms6ZnVuY3Rpb24oZCxlLGcpe3ZhciBmPWEsaz1hO1wiaHJlZlwiPT09YSYmXCJbb2JqZWN0IFNWR0FuaW1hdGVkU3RyaW5nXVwiPT09d2EuY2FsbChlLnByb3AoXCJocmVmXCIpKSYmXG4oaz1cInhsaW5rSHJlZlwiLGcuJGF0dHJba109XCJ4bGluazpocmVmXCIsZj1udWxsKTtnLiRvYnNlcnZlKGMsZnVuY3Rpb24oYSl7YSYmKGcuJHNldChrLGEpLFMmJmYmJmUucHJvcChmLGdba10pKX0pfX19fSk7dmFyIHZiPXskYWRkQ29udHJvbDp5LCRyZW1vdmVDb250cm9sOnksJHNldFZhbGlkaXR5OnksJHNldERpcnR5OnksJHNldFByaXN0aW5lOnl9O1BjLiRpbmplY3Q9W1wiJGVsZW1lbnRcIixcIiRhdHRyc1wiLFwiJHNjb3BlXCIsXCIkYW5pbWF0ZVwiXTt2YXIgUWM9ZnVuY3Rpb24oYSl7cmV0dXJuW1wiJHRpbWVvdXRcIixmdW5jdGlvbihjKXtyZXR1cm57bmFtZTpcImZvcm1cIixyZXN0cmljdDphP1wiRUFDXCI6XCJFXCIsY29udHJvbGxlcjpQYyxjb21waWxlOmZ1bmN0aW9uKCl7cmV0dXJue3ByZTpmdW5jdGlvbihhLGUsZyxmKXtpZighZy5hY3Rpb24pe3ZhciBrPWZ1bmN0aW9uKGEpe2EucHJldmVudERlZmF1bHQ/YS5wcmV2ZW50RGVmYXVsdCgpOmEucmV0dXJuVmFsdWU9ITF9O3BiKGVbMF0sXCJzdWJtaXRcIixcbmspO2Uub24oXCIkZGVzdHJveVwiLGZ1bmN0aW9uKCl7YyhmdW5jdGlvbigpe1dhKGVbMF0sXCJzdWJtaXRcIixrKX0sMCwhMSl9KX12YXIgbT1lLnBhcmVudCgpLmNvbnRyb2xsZXIoXCJmb3JtXCIpLGg9Zy5uYW1lfHxnLm5nRm9ybTtoJiZyYihhLGgsZixoKTtpZihtKWUub24oXCIkZGVzdHJveVwiLGZ1bmN0aW9uKCl7bS4kcmVtb3ZlQ29udHJvbChmKTtoJiZyYihhLGgscyxoKTtKKGYsdmIpfSl9fX19fV19LGRkPVFjKCkscWQ9UWMoITApLFBlPS9eKGZ0cHxodHRwfGh0dHBzKTpcXC9cXC8oXFx3Kzp7MCwxfVxcdypAKT8oXFxTKykoOlswLTldKyk/KFxcL3xcXC8oW1xcdyMhOi4/Kz0mJUAhXFwtXFwvXSkpPyQvLFFlPS9eW2EtejAtOSEjJCUmJyorLz0/Xl9ge3x9fi4tXStAW2EtejAtOS1dKyhcXC5bYS16MC05LV0rKSokL2ksUmU9L15cXHMqKFxcLXxcXCspPyhcXGQrfChcXGQqKFxcLlxcZCopKSlcXHMqJC8sUmM9e3RleHQ6eGIsbnVtYmVyOmZ1bmN0aW9uKGEsYyxkLGUsZyxmKXt4YihhLGMsZCxlLGcsZik7ZS4kcGFyc2Vycy5wdXNoKGZ1bmN0aW9uKGEpe3ZhciBjPVxuZS4kaXNFbXB0eShhKTtpZihjfHxSZS50ZXN0KGEpKXJldHVybiBlLiRzZXRWYWxpZGl0eShcIm51bWJlclwiLCEwKSxcIlwiPT09YT9udWxsOmM/YTpwYXJzZUZsb2F0KGEpO2UuJHNldFZhbGlkaXR5KFwibnVtYmVyXCIsITEpO3JldHVybiBzfSk7S2UoZSxcIm51bWJlclwiLGMpO2UuJGZvcm1hdHRlcnMucHVzaChmdW5jdGlvbihhKXtyZXR1cm4gZS4kaXNFbXB0eShhKT9cIlwiOlwiXCIrYX0pO2QubWluJiYoYT1mdW5jdGlvbihhKXt2YXIgYz1wYXJzZUZsb2F0KGQubWluKTtyZXR1cm4gcWEoZSxcIm1pblwiLGUuJGlzRW1wdHkoYSl8fGE+PWMsYSl9LGUuJHBhcnNlcnMucHVzaChhKSxlLiRmb3JtYXR0ZXJzLnB1c2goYSkpO2QubWF4JiYoYT1mdW5jdGlvbihhKXt2YXIgYz1wYXJzZUZsb2F0KGQubWF4KTtyZXR1cm4gcWEoZSxcIm1heFwiLGUuJGlzRW1wdHkoYSl8fGE8PWMsYSl9LGUuJHBhcnNlcnMucHVzaChhKSxlLiRmb3JtYXR0ZXJzLnB1c2goYSkpO2UuJGZvcm1hdHRlcnMucHVzaChmdW5jdGlvbihhKXtyZXR1cm4gcWEoZSxcblwibnVtYmVyXCIsZS4kaXNFbXB0eShhKXx8eWIoYSksYSl9KX0sdXJsOmZ1bmN0aW9uKGEsYyxkLGUsZyxmKXt4YihhLGMsZCxlLGcsZik7YT1mdW5jdGlvbihhKXtyZXR1cm4gcWEoZSxcInVybFwiLGUuJGlzRW1wdHkoYSl8fFBlLnRlc3QoYSksYSl9O2UuJGZvcm1hdHRlcnMucHVzaChhKTtlLiRwYXJzZXJzLnB1c2goYSl9LGVtYWlsOmZ1bmN0aW9uKGEsYyxkLGUsZyxmKXt4YihhLGMsZCxlLGcsZik7YT1mdW5jdGlvbihhKXtyZXR1cm4gcWEoZSxcImVtYWlsXCIsZS4kaXNFbXB0eShhKXx8UWUudGVzdChhKSxhKX07ZS4kZm9ybWF0dGVycy5wdXNoKGEpO2UuJHBhcnNlcnMucHVzaChhKX0scmFkaW86ZnVuY3Rpb24oYSxjLGQsZSl7RChkLm5hbWUpJiZjLmF0dHIoXCJuYW1lXCIsZWIoKSk7Yy5vbihcImNsaWNrXCIsZnVuY3Rpb24oKXtjWzBdLmNoZWNrZWQmJmEuJGFwcGx5KGZ1bmN0aW9uKCl7ZS4kc2V0Vmlld1ZhbHVlKGQudmFsdWUpfSl9KTtlLiRyZW5kZXI9ZnVuY3Rpb24oKXtjWzBdLmNoZWNrZWQ9XG5kLnZhbHVlPT1lLiR2aWV3VmFsdWV9O2QuJG9ic2VydmUoXCJ2YWx1ZVwiLGUuJHJlbmRlcil9LGNoZWNrYm94OmZ1bmN0aW9uKGEsYyxkLGUpe3ZhciBnPWQubmdUcnVlVmFsdWUsZj1kLm5nRmFsc2VWYWx1ZTtDKGcpfHwoZz0hMCk7QyhmKXx8KGY9ITEpO2Mub24oXCJjbGlja1wiLGZ1bmN0aW9uKCl7YS4kYXBwbHkoZnVuY3Rpb24oKXtlLiRzZXRWaWV3VmFsdWUoY1swXS5jaGVja2VkKX0pfSk7ZS4kcmVuZGVyPWZ1bmN0aW9uKCl7Y1swXS5jaGVja2VkPWUuJHZpZXdWYWx1ZX07ZS4kaXNFbXB0eT1mdW5jdGlvbihhKXtyZXR1cm4gYSE9PWd9O2UuJGZvcm1hdHRlcnMucHVzaChmdW5jdGlvbihhKXtyZXR1cm4gYT09PWd9KTtlLiRwYXJzZXJzLnB1c2goZnVuY3Rpb24oYSl7cmV0dXJuIGE/ZzpmfSl9LGhpZGRlbjp5LGJ1dHRvbjp5LHN1Ym1pdDp5LHJlc2V0OnksZmlsZTp5fSxoYz1bXCIkYnJvd3NlclwiLFwiJHNuaWZmZXJcIixmdW5jdGlvbihhLGMpe3JldHVybntyZXN0cmljdDpcIkVcIixyZXF1aXJlOlwiP25nTW9kZWxcIixcbmxpbms6ZnVuY3Rpb24oZCxlLGcsZil7ZiYmKFJjW0woZy50eXBlKV18fFJjLnRleHQpKGQsZSxnLGYsYyxhKX19fV0sdWI9XCJuZy12YWxpZFwiLHRiPVwibmctaW52YWxpZFwiLE1hPVwibmctcHJpc3RpbmVcIix3Yj1cIm5nLWRpcnR5XCIsU2U9W1wiJHNjb3BlXCIsXCIkZXhjZXB0aW9uSGFuZGxlclwiLFwiJGF0dHJzXCIsXCIkZWxlbWVudFwiLFwiJHBhcnNlXCIsXCIkYW5pbWF0ZVwiLGZ1bmN0aW9uKGEsYyxkLGUsZyxmKXtmdW5jdGlvbiBrKGEsYyl7Yz1jP1wiLVwiK2hiKGMsXCItXCIpOlwiXCI7Zi5yZW1vdmVDbGFzcyhlLChhP3RiOnViKStjKTtmLmFkZENsYXNzKGUsKGE/dWI6dGIpK2MpfXRoaXMuJG1vZGVsVmFsdWU9dGhpcy4kdmlld1ZhbHVlPU51bWJlci5OYU47dGhpcy4kcGFyc2Vycz1bXTt0aGlzLiRmb3JtYXR0ZXJzPVtdO3RoaXMuJHZpZXdDaGFuZ2VMaXN0ZW5lcnM9W107dGhpcy4kcHJpc3RpbmU9ITA7dGhpcy4kZGlydHk9ITE7dGhpcy4kdmFsaWQ9ITA7dGhpcy4kaW52YWxpZD0hMTt0aGlzLiRuYW1lPVxuZC5uYW1lO3ZhciBtPWcoZC5uZ01vZGVsKSxoPW0uYXNzaWduO2lmKCFoKXRocm93IHQoXCJuZ01vZGVsXCIpKFwibm9uYXNzaWduXCIsZC5uZ01vZGVsLGdhKGUpKTt0aGlzLiRyZW5kZXI9eTt0aGlzLiRpc0VtcHR5PWZ1bmN0aW9uKGEpe3JldHVybiBEKGEpfHxcIlwiPT09YXx8bnVsbD09PWF8fGEhPT1hfTt2YXIgbD1lLmluaGVyaXRlZERhdGEoXCIkZm9ybUNvbnRyb2xsZXJcIil8fHZiLG49MCxwPXRoaXMuJGVycm9yPXt9O2UuYWRkQ2xhc3MoTWEpO2soITApO3RoaXMuJHNldFZhbGlkaXR5PWZ1bmN0aW9uKGEsYyl7cFthXSE9PSFjJiYoYz8ocFthXSYmbi0tLG58fChrKCEwKSx0aGlzLiR2YWxpZD0hMCx0aGlzLiRpbnZhbGlkPSExKSk6KGsoITEpLHRoaXMuJGludmFsaWQ9ITAsdGhpcy4kdmFsaWQ9ITEsbisrKSxwW2FdPSFjLGsoYyxhKSxsLiRzZXRWYWxpZGl0eShhLGMsdGhpcykpfTt0aGlzLiRzZXRQcmlzdGluZT1mdW5jdGlvbigpe3RoaXMuJGRpcnR5PSExO3RoaXMuJHByaXN0aW5lPVxuITA7Zi5yZW1vdmVDbGFzcyhlLHdiKTtmLmFkZENsYXNzKGUsTWEpfTt0aGlzLiRzZXRWaWV3VmFsdWU9ZnVuY3Rpb24oZCl7dGhpcy4kdmlld1ZhbHVlPWQ7dGhpcy4kcHJpc3RpbmUmJih0aGlzLiRkaXJ0eT0hMCx0aGlzLiRwcmlzdGluZT0hMSxmLnJlbW92ZUNsYXNzKGUsTWEpLGYuYWRkQ2xhc3MoZSx3YiksbC4kc2V0RGlydHkoKSk7cSh0aGlzLiRwYXJzZXJzLGZ1bmN0aW9uKGEpe2Q9YShkKX0pO3RoaXMuJG1vZGVsVmFsdWUhPT1kJiYodGhpcy4kbW9kZWxWYWx1ZT1kLGgoYSxkKSxxKHRoaXMuJHZpZXdDaGFuZ2VMaXN0ZW5lcnMsZnVuY3Rpb24oYSl7dHJ5e2EoKX1jYXRjaChkKXtjKGQpfX0pKX07dmFyIHI9dGhpczthLiR3YXRjaChmdW5jdGlvbigpe3ZhciBjPW0oYSk7aWYoci4kbW9kZWxWYWx1ZSE9PWMpe3ZhciBkPXIuJGZvcm1hdHRlcnMsZT1kLmxlbmd0aDtmb3Ioci4kbW9kZWxWYWx1ZT1jO2UtLTspYz1kW2VdKGMpO3IuJHZpZXdWYWx1ZSE9PWMmJihyLiR2aWV3VmFsdWU9XG5jLHIuJHJlbmRlcigpKX1yZXR1cm4gY30pfV0sRmQ9ZnVuY3Rpb24oKXtyZXR1cm57cmVxdWlyZTpbXCJuZ01vZGVsXCIsXCJeP2Zvcm1cIl0sY29udHJvbGxlcjpTZSxsaW5rOmZ1bmN0aW9uKGEsYyxkLGUpe3ZhciBnPWVbMF0sZj1lWzFdfHx2YjtmLiRhZGRDb250cm9sKGcpO2EuJG9uKFwiJGRlc3Ryb3lcIixmdW5jdGlvbigpe2YuJHJlbW92ZUNvbnRyb2woZyl9KX19fSxIZD0kKHtyZXF1aXJlOlwibmdNb2RlbFwiLGxpbms6ZnVuY3Rpb24oYSxjLGQsZSl7ZS4kdmlld0NoYW5nZUxpc3RlbmVycy5wdXNoKGZ1bmN0aW9uKCl7YS4kZXZhbChkLm5nQ2hhbmdlKX0pfX0pLGljPWZ1bmN0aW9uKCl7cmV0dXJue3JlcXVpcmU6XCI/bmdNb2RlbFwiLGxpbms6ZnVuY3Rpb24oYSxjLGQsZSl7aWYoZSl7ZC5yZXF1aXJlZD0hMDt2YXIgZz1mdW5jdGlvbihhKXtpZihkLnJlcXVpcmVkJiZlLiRpc0VtcHR5KGEpKWUuJHNldFZhbGlkaXR5KFwicmVxdWlyZWRcIiwhMSk7ZWxzZSByZXR1cm4gZS4kc2V0VmFsaWRpdHkoXCJyZXF1aXJlZFwiLFxuITApLGF9O2UuJGZvcm1hdHRlcnMucHVzaChnKTtlLiRwYXJzZXJzLnVuc2hpZnQoZyk7ZC4kb2JzZXJ2ZShcInJlcXVpcmVkXCIsZnVuY3Rpb24oKXtnKGUuJHZpZXdWYWx1ZSl9KX19fX0sR2Q9ZnVuY3Rpb24oKXtyZXR1cm57cmVxdWlyZTpcIm5nTW9kZWxcIixsaW5rOmZ1bmN0aW9uKGEsYyxkLGUpe3ZhciBnPShhPS9cXC8oLiopXFwvLy5leGVjKGQubmdMaXN0KSkmJlJlZ0V4cChhWzFdKXx8ZC5uZ0xpc3R8fFwiLFwiO2UuJHBhcnNlcnMucHVzaChmdW5jdGlvbihhKXtpZighRChhKSl7dmFyIGM9W107YSYmcShhLnNwbGl0KGcpLGZ1bmN0aW9uKGEpe2EmJmMucHVzaChhYShhKSl9KTtyZXR1cm4gY319KTtlLiRmb3JtYXR0ZXJzLnB1c2goZnVuY3Rpb24oYSl7cmV0dXJuIE8oYSk/YS5qb2luKFwiLCBcIik6c30pO2UuJGlzRW1wdHk9ZnVuY3Rpb24oYSl7cmV0dXJuIWF8fCFhLmxlbmd0aH19fX0sVGU9L14odHJ1ZXxmYWxzZXxcXGQrKSQvLElkPWZ1bmN0aW9uKCl7cmV0dXJue3ByaW9yaXR5OjEwMCxcbmNvbXBpbGU6ZnVuY3Rpb24oYSxjKXtyZXR1cm4gVGUudGVzdChjLm5nVmFsdWUpP2Z1bmN0aW9uKGEsYyxnKXtnLiRzZXQoXCJ2YWx1ZVwiLGEuJGV2YWwoZy5uZ1ZhbHVlKSl9OmZ1bmN0aW9uKGEsYyxnKXthLiR3YXRjaChnLm5nVmFsdWUsZnVuY3Rpb24oYSl7Zy4kc2V0KFwidmFsdWVcIixhKX0pfX19fSxpZD12YSh7Y29tcGlsZTpmdW5jdGlvbihhKXthLmFkZENsYXNzKFwibmctYmluZGluZ1wiKTtyZXR1cm4gZnVuY3Rpb24oYSxkLGUpe2QuZGF0YShcIiRiaW5kaW5nXCIsZS5uZ0JpbmQpO2EuJHdhdGNoKGUubmdCaW5kLGZ1bmN0aW9uKGEpe2QudGV4dChhPT1zP1wiXCI6YSl9KX19fSksa2Q9W1wiJGludGVycG9sYXRlXCIsZnVuY3Rpb24oYSl7cmV0dXJuIGZ1bmN0aW9uKGMsZCxlKXtjPWEoZC5hdHRyKGUuJGF0dHIubmdCaW5kVGVtcGxhdGUpKTtkLmFkZENsYXNzKFwibmctYmluZGluZ1wiKS5kYXRhKFwiJGJpbmRpbmdcIixjKTtlLiRvYnNlcnZlKFwibmdCaW5kVGVtcGxhdGVcIixmdW5jdGlvbihhKXtkLnRleHQoYSl9KX19XSxcbmpkPVtcIiRzY2VcIixcIiRwYXJzZVwiLGZ1bmN0aW9uKGEsYyl7cmV0dXJuIGZ1bmN0aW9uKGQsZSxnKXtlLmFkZENsYXNzKFwibmctYmluZGluZ1wiKS5kYXRhKFwiJGJpbmRpbmdcIixnLm5nQmluZEh0bWwpO3ZhciBmPWMoZy5uZ0JpbmRIdG1sKTtkLiR3YXRjaChmdW5jdGlvbigpe3JldHVybihmKGQpfHxcIlwiKS50b1N0cmluZygpfSxmdW5jdGlvbihjKXtlLmh0bWwoYS5nZXRUcnVzdGVkSHRtbChmKGQpKXx8XCJcIil9KX19XSxsZD1WYihcIlwiLCEwKSxuZD1WYihcIk9kZFwiLDApLG1kPVZiKFwiRXZlblwiLDEpLG9kPXZhKHtjb21waWxlOmZ1bmN0aW9uKGEsYyl7Yy4kc2V0KFwibmdDbG9ha1wiLHMpO2EucmVtb3ZlQ2xhc3MoXCJuZy1jbG9ha1wiKX19KSxwZD1bZnVuY3Rpb24oKXtyZXR1cm57c2NvcGU6ITAsY29udHJvbGxlcjpcIkBcIixwcmlvcml0eTo1MDB9fV0samM9e307cShcImNsaWNrIGRibGNsaWNrIG1vdXNlZG93biBtb3VzZXVwIG1vdXNlb3ZlciBtb3VzZW91dCBtb3VzZW1vdmUgbW91c2VlbnRlciBtb3VzZWxlYXZlIGtleWRvd24ga2V5dXAga2V5cHJlc3Mgc3VibWl0IGZvY3VzIGJsdXIgY29weSBjdXQgcGFzdGVcIi5zcGxpdChcIiBcIiksXG5mdW5jdGlvbihhKXt2YXIgYz1tYShcIm5nLVwiK2EpO2pjW2NdPVtcIiRwYXJzZVwiLGZ1bmN0aW9uKGQpe3JldHVybntjb21waWxlOmZ1bmN0aW9uKGUsZyl7dmFyIGY9ZChnW2NdKTtyZXR1cm4gZnVuY3Rpb24oYyxkKXtkLm9uKEwoYSksZnVuY3Rpb24oYSl7Yy4kYXBwbHkoZnVuY3Rpb24oKXtmKGMseyRldmVudDphfSl9KX0pfX19fV19KTt2YXIgc2Q9W1wiJGFuaW1hdGVcIixmdW5jdGlvbihhKXtyZXR1cm57dHJhbnNjbHVkZTpcImVsZW1lbnRcIixwcmlvcml0eTo2MDAsdGVybWluYWw6ITAscmVzdHJpY3Q6XCJBXCIsJCR0bGI6ITAsbGluazpmdW5jdGlvbihjLGQsZSxnLGYpe3ZhciBrLG0saDtjLiR3YXRjaChlLm5nSWYsZnVuY3Rpb24oZyl7UmEoZyk/bXx8KG09Yy4kbmV3KCksZihtLGZ1bmN0aW9uKGMpe2NbYy5sZW5ndGgrK109Vi5jcmVhdGVDb21tZW50KFwiIGVuZCBuZ0lmOiBcIitlLm5nSWYrXCIgXCIpO2s9e2Nsb25lOmN9O2EuZW50ZXIoYyxkLnBhcmVudCgpLGQpfSkpOihoJiYoaC5yZW1vdmUoKSxcbmg9bnVsbCksbSYmKG0uJGRlc3Ryb3koKSxtPW51bGwpLGsmJihoPURiKGsuY2xvbmUpLGEubGVhdmUoaCxmdW5jdGlvbigpe2g9bnVsbH0pLGs9bnVsbCkpfSl9fX1dLHRkPVtcIiRodHRwXCIsXCIkdGVtcGxhdGVDYWNoZVwiLFwiJGFuY2hvclNjcm9sbFwiLFwiJGFuaW1hdGVcIixcIiRzY2VcIixmdW5jdGlvbihhLGMsZCxlLGcpe3JldHVybntyZXN0cmljdDpcIkVDQVwiLHByaW9yaXR5OjQwMCx0ZXJtaW5hbDohMCx0cmFuc2NsdWRlOlwiZWxlbWVudFwiLGNvbnRyb2xsZXI6U2Eubm9vcCxjb21waWxlOmZ1bmN0aW9uKGYsayl7dmFyIG09ay5uZ0luY2x1ZGV8fGsuc3JjLGg9ay5vbmxvYWR8fFwiXCIsbD1rLmF1dG9zY3JvbGw7cmV0dXJuIGZ1bmN0aW9uKGYsayxyLHEsSSl7dmFyIHM9MCx1LHcsRix6PWZ1bmN0aW9uKCl7dyYmKHcucmVtb3ZlKCksdz1udWxsKTt1JiYodS4kZGVzdHJveSgpLHU9bnVsbCk7RiYmKGUubGVhdmUoRixmdW5jdGlvbigpe3c9bnVsbH0pLHc9RixGPW51bGwpfTtmLiR3YXRjaChnLnBhcnNlQXNSZXNvdXJjZVVybChtKSxcbmZ1bmN0aW9uKGcpe3ZhciBtPWZ1bmN0aW9uKCl7IUIobCl8fGwmJiFmLiRldmFsKGwpfHxkKCl9LHI9KytzO2c/KGEuZ2V0KGcse2NhY2hlOmN9KS5zdWNjZXNzKGZ1bmN0aW9uKGEpe2lmKHI9PT1zKXt2YXIgYz1mLiRuZXcoKTtxLnRlbXBsYXRlPWE7YT1JKGMsZnVuY3Rpb24oYSl7eigpO2UuZW50ZXIoYSxudWxsLGssbSl9KTt1PWM7Rj1hO3UuJGVtaXQoXCIkaW5jbHVkZUNvbnRlbnRMb2FkZWRcIik7Zi4kZXZhbChoKX19KS5lcnJvcihmdW5jdGlvbigpe3I9PT1zJiZ6KCl9KSxmLiRlbWl0KFwiJGluY2x1ZGVDb250ZW50UmVxdWVzdGVkXCIpKTooeigpLHEudGVtcGxhdGU9bnVsbCl9KX19fX1dLEpkPVtcIiRjb21waWxlXCIsZnVuY3Rpb24oYSl7cmV0dXJue3Jlc3RyaWN0OlwiRUNBXCIscHJpb3JpdHk6LTQwMCxyZXF1aXJlOlwibmdJbmNsdWRlXCIsbGluazpmdW5jdGlvbihjLGQsZSxnKXtkLmh0bWwoZy50ZW1wbGF0ZSk7YShkLmNvbnRlbnRzKCkpKGMpfX19XSx1ZD12YSh7cHJpb3JpdHk6NDUwLFxuY29tcGlsZTpmdW5jdGlvbigpe3JldHVybntwcmU6ZnVuY3Rpb24oYSxjLGQpe2EuJGV2YWwoZC5uZ0luaXQpfX19fSksdmQ9dmEoe3Rlcm1pbmFsOiEwLHByaW9yaXR5OjFFM30pLHdkPVtcIiRsb2NhbGVcIixcIiRpbnRlcnBvbGF0ZVwiLGZ1bmN0aW9uKGEsYyl7dmFyIGQ9L3t9L2c7cmV0dXJue3Jlc3RyaWN0OlwiRUFcIixsaW5rOmZ1bmN0aW9uKGUsZyxmKXt2YXIgaz1mLmNvdW50LG09Zi4kYXR0ci53aGVuJiZnLmF0dHIoZi4kYXR0ci53aGVuKSxoPWYub2Zmc2V0fHwwLGw9ZS4kZXZhbChtKXx8e30sbj17fSxwPWMuc3RhcnRTeW1ib2woKSxyPWMuZW5kU3ltYm9sKCkscz0vXndoZW4oTWludXMpPyguKykkLztxKGYsZnVuY3Rpb24oYSxjKXtzLnRlc3QoYykmJihsW0woYy5yZXBsYWNlKFwid2hlblwiLFwiXCIpLnJlcGxhY2UoXCJNaW51c1wiLFwiLVwiKSldPWcuYXR0cihmLiRhdHRyW2NdKSl9KTtxKGwsZnVuY3Rpb24oYSxlKXtuW2VdPWMoYS5yZXBsYWNlKGQscCtrK1wiLVwiK2grcikpfSk7ZS4kd2F0Y2goZnVuY3Rpb24oKXt2YXIgYz1cbnBhcnNlRmxvYXQoZS4kZXZhbChrKSk7aWYoaXNOYU4oYykpcmV0dXJuXCJcIjtjIGluIGx8fChjPWEucGx1cmFsQ2F0KGMtaCkpO3JldHVybiBuW2NdKGUsZywhMCl9LGZ1bmN0aW9uKGEpe2cudGV4dChhKX0pfX19XSx4ZD1bXCIkcGFyc2VcIixcIiRhbmltYXRlXCIsZnVuY3Rpb24oYSxjKXt2YXIgZD10KFwibmdSZXBlYXRcIik7cmV0dXJue3RyYW5zY2x1ZGU6XCJlbGVtZW50XCIscHJpb3JpdHk6MUUzLHRlcm1pbmFsOiEwLCQkdGxiOiEwLGxpbms6ZnVuY3Rpb24oZSxnLGYsayxtKXt2YXIgaD1mLm5nUmVwZWF0LGw9aC5tYXRjaCgvXlxccyooW1xcc1xcU10rPylcXHMraW5cXHMrKFtcXHNcXFNdKz8pKD86XFxzK3RyYWNrXFxzK2J5XFxzKyhbXFxzXFxTXSs/KSk/XFxzKiQvKSxuLHAscixzLEkseCx1PXskaWQ6SmF9O2lmKCFsKXRocm93IGQoXCJpZXhwXCIsaCk7Zj1sWzFdO2s9bFsyXTsobD1sWzNdKT8obj1hKGwpLHA9ZnVuY3Rpb24oYSxjLGQpe3gmJih1W3hdPWEpO3VbSV09Yzt1LiRpbmRleD1kO3JldHVybiBuKGUsXG51KX0pOihyPWZ1bmN0aW9uKGEsYyl7cmV0dXJuIEphKGMpfSxzPWZ1bmN0aW9uKGEpe3JldHVybiBhfSk7bD1mLm1hdGNoKC9eKD86KFtcXCRcXHddKyl8XFwoKFtcXCRcXHddKylcXHMqLFxccyooW1xcJFxcd10rKVxcKSkkLyk7aWYoIWwpdGhyb3cgZChcImlpZGV4cFwiLGYpO0k9bFszXXx8bFsxXTt4PWxbMl07dmFyIEI9e307ZS4kd2F0Y2hDb2xsZWN0aW9uKGssZnVuY3Rpb24oYSl7dmFyIGYsayxsPWdbMF0sbix1PXt9LEUsQSxILHQsQyx5LEQ9W107aWYoZGIoYSkpQz1hLG49cHx8cjtlbHNle249cHx8cztDPVtdO2ZvcihIIGluIGEpYS5oYXNPd25Qcm9wZXJ0eShIKSYmXCIkXCIhPUguY2hhckF0KDApJiZDLnB1c2goSCk7Qy5zb3J0KCl9RT1DLmxlbmd0aDtrPUQubGVuZ3RoPUMubGVuZ3RoO2ZvcihmPTA7ZjxrO2YrKylpZihIPWE9PT1DP2Y6Q1tmXSx0PWFbSF0sdD1uKEgsdCxmKSxBYSh0LFwiYHRyYWNrIGJ5YCBpZFwiKSxCLmhhc093blByb3BlcnR5KHQpKXk9Qlt0XSxkZWxldGUgQlt0XSx1W3RdPVxueSxEW2ZdPXk7ZWxzZXtpZih1Lmhhc093blByb3BlcnR5KHQpKXRocm93IHEoRCxmdW5jdGlvbihhKXthJiZhLnNjb3BlJiYoQlthLmlkXT1hKX0pLGQoXCJkdXBlc1wiLGgsdCk7RFtmXT17aWQ6dH07dVt0XT0hMX1mb3IoSCBpbiBCKUIuaGFzT3duUHJvcGVydHkoSCkmJih5PUJbSF0sZj1EYih5LmNsb25lKSxjLmxlYXZlKGYpLHEoZixmdW5jdGlvbihhKXthLiQkTkdfUkVNT1ZFRD0hMH0pLHkuc2NvcGUuJGRlc3Ryb3koKSk7Zj0wO2ZvcihrPUMubGVuZ3RoO2Y8aztmKyspe0g9YT09PUM/ZjpDW2ZdO3Q9YVtIXTt5PURbZl07RFtmLTFdJiYobD1EW2YtMV0uY2xvbmVbRFtmLTFdLmNsb25lLmxlbmd0aC0xXSk7aWYoeS5zY29wZSl7QT15LnNjb3BlO249bDtkbyBuPW4ubmV4dFNpYmxpbmc7d2hpbGUobiYmbi4kJE5HX1JFTU9WRUQpO3kuY2xvbmVbMF0hPW4mJmMubW92ZShEYih5LmNsb25lKSxudWxsLHcobCkpO2w9eS5jbG9uZVt5LmNsb25lLmxlbmd0aC0xXX1lbHNlIEE9ZS4kbmV3KCk7XG5BW0ldPXQ7eCYmKEFbeF09SCk7QS4kaW5kZXg9ZjtBLiRmaXJzdD0wPT09ZjtBLiRsYXN0PWY9PT1FLTE7QS4kbWlkZGxlPSEoQS4kZmlyc3R8fEEuJGxhc3QpO0EuJG9kZD0hKEEuJGV2ZW49MD09PShmJjEpKTt5LnNjb3BlfHxtKEEsZnVuY3Rpb24oYSl7YVthLmxlbmd0aCsrXT1WLmNyZWF0ZUNvbW1lbnQoXCIgZW5kIG5nUmVwZWF0OiBcIitoK1wiIFwiKTtjLmVudGVyKGEsbnVsbCx3KGwpKTtsPWE7eS5zY29wZT1BO3kuY2xvbmU9YTt1W3kuaWRdPXl9KX1CPXV9KX19fV0seWQ9W1wiJGFuaW1hdGVcIixmdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oYyxkLGUpe2MuJHdhdGNoKGUubmdTaG93LGZ1bmN0aW9uKGMpe2FbUmEoYyk/XCJyZW1vdmVDbGFzc1wiOlwiYWRkQ2xhc3NcIl0oZCxcIm5nLWhpZGVcIil9KX19XSxyZD1bXCIkYW5pbWF0ZVwiLGZ1bmN0aW9uKGEpe3JldHVybiBmdW5jdGlvbihjLGQsZSl7Yy4kd2F0Y2goZS5uZ0hpZGUsZnVuY3Rpb24oYyl7YVtSYShjKT9cImFkZENsYXNzXCI6XCJyZW1vdmVDbGFzc1wiXShkLFxuXCJuZy1oaWRlXCIpfSl9fV0semQ9dmEoZnVuY3Rpb24oYSxjLGQpe2EuJHdhdGNoKGQubmdTdHlsZSxmdW5jdGlvbihhLGQpe2QmJmEhPT1kJiZxKGQsZnVuY3Rpb24oYSxkKXtjLmNzcyhkLFwiXCIpfSk7YSYmYy5jc3MoYSl9LCEwKX0pLEFkPVtcIiRhbmltYXRlXCIsZnVuY3Rpb24oYSl7cmV0dXJue3Jlc3RyaWN0OlwiRUFcIixyZXF1aXJlOlwibmdTd2l0Y2hcIixjb250cm9sbGVyOltcIiRzY29wZVwiLGZ1bmN0aW9uKCl7dGhpcy5jYXNlcz17fX1dLGxpbms6ZnVuY3Rpb24oYyxkLGUsZyl7dmFyIGY9W10saz1bXSxtPVtdLGg9W107Yy4kd2F0Y2goZS5uZ1N3aXRjaHx8ZS5vbixmdW5jdGlvbihkKXt2YXIgbixwO249MDtmb3IocD1tLmxlbmd0aDtuPHA7KytuKW1bbl0ucmVtb3ZlKCk7bj1tLmxlbmd0aD0wO2ZvcihwPWgubGVuZ3RoO248cDsrK24pe3ZhciByPWtbbl07aFtuXS4kZGVzdHJveSgpO21bbl09cjthLmxlYXZlKHIsZnVuY3Rpb24oKXttLnNwbGljZShuLDEpfSl9ay5sZW5ndGg9MDtoLmxlbmd0aD1cbjA7aWYoZj1nLmNhc2VzW1wiIVwiK2RdfHxnLmNhc2VzW1wiP1wiXSljLiRldmFsKGUuY2hhbmdlKSxxKGYsZnVuY3Rpb24oZCl7dmFyIGU9Yy4kbmV3KCk7aC5wdXNoKGUpO2QudHJhbnNjbHVkZShlLGZ1bmN0aW9uKGMpe3ZhciBlPWQuZWxlbWVudDtrLnB1c2goYyk7YS5lbnRlcihjLGUucGFyZW50KCksZSl9KX0pfSl9fX1dLEJkPXZhKHt0cmFuc2NsdWRlOlwiZWxlbWVudFwiLHByaW9yaXR5OjgwMCxyZXF1aXJlOlwiXm5nU3dpdGNoXCIsbGluazpmdW5jdGlvbihhLGMsZCxlLGcpe2UuY2FzZXNbXCIhXCIrZC5uZ1N3aXRjaFdoZW5dPWUuY2FzZXNbXCIhXCIrZC5uZ1N3aXRjaFdoZW5dfHxbXTtlLmNhc2VzW1wiIVwiK2QubmdTd2l0Y2hXaGVuXS5wdXNoKHt0cmFuc2NsdWRlOmcsZWxlbWVudDpjfSl9fSksQ2Q9dmEoe3RyYW5zY2x1ZGU6XCJlbGVtZW50XCIscHJpb3JpdHk6ODAwLHJlcXVpcmU6XCJebmdTd2l0Y2hcIixsaW5rOmZ1bmN0aW9uKGEsYyxkLGUsZyl7ZS5jYXNlc1tcIj9cIl09ZS5jYXNlc1tcIj9cIl18fFxuW107ZS5jYXNlc1tcIj9cIl0ucHVzaCh7dHJhbnNjbHVkZTpnLGVsZW1lbnQ6Y30pfX0pLEVkPXZhKHtsaW5rOmZ1bmN0aW9uKGEsYyxkLGUsZyl7aWYoIWcpdGhyb3cgdChcIm5nVHJhbnNjbHVkZVwiKShcIm9ycGhhblwiLGdhKGMpKTtnKGZ1bmN0aW9uKGEpe2MuZW1wdHkoKTtjLmFwcGVuZChhKX0pfX0pLGVkPVtcIiR0ZW1wbGF0ZUNhY2hlXCIsZnVuY3Rpb24oYSl7cmV0dXJue3Jlc3RyaWN0OlwiRVwiLHRlcm1pbmFsOiEwLGNvbXBpbGU6ZnVuY3Rpb24oYyxkKXtcInRleHQvbmctdGVtcGxhdGVcIj09ZC50eXBlJiZhLnB1dChkLmlkLGNbMF0udGV4dCl9fX1dLFVlPXQoXCJuZ09wdGlvbnNcIiksRGQ9JCh7dGVybWluYWw6ITB9KSxmZD1bXCIkY29tcGlsZVwiLFwiJHBhcnNlXCIsZnVuY3Rpb24oYSxjKXt2YXIgZD0vXlxccyooW1xcc1xcU10rPykoPzpcXHMrYXNcXHMrKFtcXHNcXFNdKz8pKT8oPzpcXHMrZ3JvdXBcXHMrYnlcXHMrKFtcXHNcXFNdKz8pKT9cXHMrZm9yXFxzKyg/OihbXFwkXFx3XVtcXCRcXHddKil8KD86XFwoXFxzKihbXFwkXFx3XVtcXCRcXHddKilcXHMqLFxccyooW1xcJFxcd11bXFwkXFx3XSopXFxzKlxcKSkpXFxzK2luXFxzKyhbXFxzXFxTXSs/KSg/Olxccyt0cmFja1xccytieVxccysoW1xcc1xcU10rPykpPyQvLFxuZT17JHNldFZpZXdWYWx1ZTp5fTtyZXR1cm57cmVzdHJpY3Q6XCJFXCIscmVxdWlyZTpbXCJzZWxlY3RcIixcIj9uZ01vZGVsXCJdLGNvbnRyb2xsZXI6W1wiJGVsZW1lbnRcIixcIiRzY29wZVwiLFwiJGF0dHJzXCIsZnVuY3Rpb24oYSxjLGQpe3ZhciBtPXRoaXMsaD17fSxsPWUsbjttLmRhdGFib3VuZD1kLm5nTW9kZWw7bS5pbml0PWZ1bmN0aW9uKGEsYyxkKXtsPWE7bj1kfTttLmFkZE9wdGlvbj1mdW5jdGlvbihjKXtBYShjLCdcIm9wdGlvbiB2YWx1ZVwiJyk7aFtjXT0hMDtsLiR2aWV3VmFsdWU9PWMmJihhLnZhbChjKSxuLnBhcmVudCgpJiZuLnJlbW92ZSgpKX07bS5yZW1vdmVPcHRpb249ZnVuY3Rpb24oYSl7dGhpcy5oYXNPcHRpb24oYSkmJihkZWxldGUgaFthXSxsLiR2aWV3VmFsdWU9PWEmJnRoaXMucmVuZGVyVW5rbm93bk9wdGlvbihhKSl9O20ucmVuZGVyVW5rbm93bk9wdGlvbj1mdW5jdGlvbihjKXtjPVwiPyBcIitKYShjKStcIiA/XCI7bi52YWwoYyk7YS5wcmVwZW5kKG4pO2EudmFsKGMpO24ucHJvcChcInNlbGVjdGVkXCIsXG4hMCl9O20uaGFzT3B0aW9uPWZ1bmN0aW9uKGEpe3JldHVybiBoLmhhc093blByb3BlcnR5KGEpfTtjLiRvbihcIiRkZXN0cm95XCIsZnVuY3Rpb24oKXttLnJlbmRlclVua25vd25PcHRpb249eX0pfV0sbGluazpmdW5jdGlvbihlLGYsayxtKXtmdW5jdGlvbiBoKGEsYyxkLGUpe2QuJHJlbmRlcj1mdW5jdGlvbigpe3ZhciBhPWQuJHZpZXdWYWx1ZTtlLmhhc09wdGlvbihhKT8oRi5wYXJlbnQoKSYmRi5yZW1vdmUoKSxjLnZhbChhKSxcIlwiPT09YSYmeC5wcm9wKFwic2VsZWN0ZWRcIiwhMCkpOkQoYSkmJng/Yy52YWwoXCJcIik6ZS5yZW5kZXJVbmtub3duT3B0aW9uKGEpfTtjLm9uKFwiY2hhbmdlXCIsZnVuY3Rpb24oKXthLiRhcHBseShmdW5jdGlvbigpe0YucGFyZW50KCkmJkYucmVtb3ZlKCk7ZC4kc2V0Vmlld1ZhbHVlKGMudmFsKCkpfSl9KX1mdW5jdGlvbiBsKGEsYyxkKXt2YXIgZTtkLiRyZW5kZXI9ZnVuY3Rpb24oKXt2YXIgYT1uZXcgWWEoZC4kdmlld1ZhbHVlKTtxKGMuZmluZChcIm9wdGlvblwiKSxcbmZ1bmN0aW9uKGMpe2Muc2VsZWN0ZWQ9QihhLmdldChjLnZhbHVlKSl9KX07YS4kd2F0Y2goZnVuY3Rpb24oKXt4YShlLGQuJHZpZXdWYWx1ZSl8fChlPWthKGQuJHZpZXdWYWx1ZSksZC4kcmVuZGVyKCkpfSk7Yy5vbihcImNoYW5nZVwiLGZ1bmN0aW9uKCl7YS4kYXBwbHkoZnVuY3Rpb24oKXt2YXIgYT1bXTtxKGMuZmluZChcIm9wdGlvblwiKSxmdW5jdGlvbihjKXtjLnNlbGVjdGVkJiZhLnB1c2goYy52YWx1ZSl9KTtkLiRzZXRWaWV3VmFsdWUoYSl9KX0pfWZ1bmN0aW9uIG4oZSxmLGcpe2Z1bmN0aW9uIGsoKXt2YXIgYT17XCJcIjpbXX0sYz1bXCJcIl0sZCxoLHMsdCx2O3Q9Zy4kbW9kZWxWYWx1ZTt2PXcoZSl8fFtdO3ZhciBEPW4/V2Iodik6dixGLEssQTtLPXt9O3M9ITE7dmFyIEUsSjtpZihyKWlmKHgmJk8odCkpZm9yKHM9bmV3IFlhKFtdKSxBPTA7QTx0Lmxlbmd0aDtBKyspS1ttXT10W0FdLHMucHV0KHgoZSxLKSx0W0FdKTtlbHNlIHM9bmV3IFlhKHQpO2ZvcihBPTA7Rj1ELmxlbmd0aCxcbkE8RjtBKyspe2g9QTtpZihuKXtoPURbQV07aWYoXCIkXCI9PT1oLmNoYXJBdCgwKSljb250aW51ZTtLW25dPWh9S1ttXT12W2hdO2Q9cChlLEspfHxcIlwiOyhoPWFbZF0pfHwoaD1hW2RdPVtdLGMucHVzaChkKSk7cj9kPUIocy5yZW1vdmUoeD94KGUsSyk6cShlLEspKSk6KHg/KGQ9e30sZFttXT10LGQ9eChlLGQpPT09eChlLEspKTpkPXQ9PT1xKGUsSykscz1zfHxkKTtFPWwoZSxLKTtFPUIoRSk/RTpcIlwiO2gucHVzaCh7aWQ6eD94KGUsSyk6bj9EW0FdOkEsbGFiZWw6RSxzZWxlY3RlZDpkfSl9cnx8KHl8fG51bGw9PT10P2FbXCJcIl0udW5zaGlmdCh7aWQ6XCJcIixsYWJlbDpcIlwiLHNlbGVjdGVkOiFzfSk6c3x8YVtcIlwiXS51bnNoaWZ0KHtpZDpcIj9cIixsYWJlbDpcIlwiLHNlbGVjdGVkOiEwfSkpO0s9MDtmb3IoRD1jLmxlbmd0aDtLPEQ7SysrKXtkPWNbS107aD1hW2RdO3oubGVuZ3RoPD1LPyh0PXtlbGVtZW50OkMuY2xvbmUoKS5hdHRyKFwibGFiZWxcIixkKSxsYWJlbDpoLmxhYmVsfSx2PVt0XSx6LnB1c2godiksXG5mLmFwcGVuZCh0LmVsZW1lbnQpKToodj16W0tdLHQ9dlswXSx0LmxhYmVsIT1kJiZ0LmVsZW1lbnQuYXR0cihcImxhYmVsXCIsdC5sYWJlbD1kKSk7RT1udWxsO0E9MDtmb3IoRj1oLmxlbmd0aDtBPEY7QSsrKXM9aFtBXSwoZD12W0ErMV0pPyhFPWQuZWxlbWVudCxkLmxhYmVsIT09cy5sYWJlbCYmRS50ZXh0KGQubGFiZWw9cy5sYWJlbCksZC5pZCE9PXMuaWQmJkUudmFsKGQuaWQ9cy5pZCksZC5zZWxlY3RlZCE9PXMuc2VsZWN0ZWQmJkUucHJvcChcInNlbGVjdGVkXCIsZC5zZWxlY3RlZD1zLnNlbGVjdGVkKSk6KFwiXCI9PT1zLmlkJiZ5P0o9eTooSj11LmNsb25lKCkpLnZhbChzLmlkKS5hdHRyKFwic2VsZWN0ZWRcIixzLnNlbGVjdGVkKS50ZXh0KHMubGFiZWwpLHYucHVzaCh7ZWxlbWVudDpKLGxhYmVsOnMubGFiZWwsaWQ6cy5pZCxzZWxlY3RlZDpzLnNlbGVjdGVkfSksRT9FLmFmdGVyKEopOnQuZWxlbWVudC5hcHBlbmQoSiksRT1KKTtmb3IoQSsrO3YubGVuZ3RoPkE7KXYucG9wKCkuZWxlbWVudC5yZW1vdmUoKX1mb3IoO3oubGVuZ3RoPlxuSzspei5wb3AoKVswXS5lbGVtZW50LnJlbW92ZSgpfXZhciBoO2lmKCEoaD10Lm1hdGNoKGQpKSl0aHJvdyBVZShcImlleHBcIix0LGdhKGYpKTt2YXIgbD1jKGhbMl18fGhbMV0pLG09aFs0XXx8aFs2XSxuPWhbNV0scD1jKGhbM118fFwiXCIpLHE9YyhoWzJdP2hbMV06bSksdz1jKGhbN10pLHg9aFs4XT9jKGhbOF0pOm51bGwsej1bW3tlbGVtZW50OmYsbGFiZWw6XCJcIn1dXTt5JiYoYSh5KShlKSx5LnJlbW92ZUNsYXNzKFwibmctc2NvcGVcIikseS5yZW1vdmUoKSk7Zi5lbXB0eSgpO2Yub24oXCJjaGFuZ2VcIixmdW5jdGlvbigpe2UuJGFwcGx5KGZ1bmN0aW9uKCl7dmFyIGEsYz13KGUpfHxbXSxkPXt9LGgsayxsLHAsdCx1LHY7aWYocilmb3Ioaz1bXSxwPTAsdT16Lmxlbmd0aDtwPHU7cCsrKWZvcihhPXpbcF0sbD0xLHQ9YS5sZW5ndGg7bDx0O2wrKyl7aWYoKGg9YVtsXS5lbGVtZW50KVswXS5zZWxlY3RlZCl7aD1oLnZhbCgpO24mJihkW25dPWgpO2lmKHgpZm9yKHY9MDt2PGMubGVuZ3RoJiZcbihkW21dPWNbdl0seChlLGQpIT1oKTt2KyspO2Vsc2UgZFttXT1jW2hdO2sucHVzaChxKGUsZCkpfX1lbHNle2g9Zi52YWwoKTtpZihcIj9cIj09aClrPXM7ZWxzZSBpZihcIlwiPT09aClrPW51bGw7ZWxzZSBpZih4KWZvcih2PTA7djxjLmxlbmd0aDt2Kyspe2lmKGRbbV09Y1t2XSx4KGUsZCk9PWgpe2s9cShlLGQpO2JyZWFrfX1lbHNlIGRbbV09Y1toXSxuJiYoZFtuXT1oKSxrPXEoZSxkKTsxPHpbMF0ubGVuZ3RoJiZ6WzBdWzFdLmlkIT09aCYmKHpbMF1bMV0uc2VsZWN0ZWQ9ITEpfWcuJHNldFZpZXdWYWx1ZShrKX0pfSk7Zy4kcmVuZGVyPWs7ZS4kd2F0Y2goayl9aWYobVsxXSl7dmFyIHA9bVswXTttPW1bMV07dmFyIHI9ay5tdWx0aXBsZSx0PWsubmdPcHRpb25zLHk9ITEseCx1PXcoVi5jcmVhdGVFbGVtZW50KFwib3B0aW9uXCIpKSxDPXcoVi5jcmVhdGVFbGVtZW50KFwib3B0Z3JvdXBcIikpLEY9dS5jbG9uZSgpO2s9MDtmb3IodmFyIHo9Zi5jaGlsZHJlbigpLEo9ei5sZW5ndGg7azxKO2srKylpZihcIlwiPT09XG56W2tdLnZhbHVlKXt4PXk9ei5lcShrKTticmVha31wLmluaXQobSx5LEYpO3ImJihtLiRpc0VtcHR5PWZ1bmN0aW9uKGEpe3JldHVybiFhfHwwPT09YS5sZW5ndGh9KTt0P24oZSxmLG0pOnI/bChlLGYsbSk6aChlLGYsbSxwKX19fX1dLGhkPVtcIiRpbnRlcnBvbGF0ZVwiLGZ1bmN0aW9uKGEpe3ZhciBjPXthZGRPcHRpb246eSxyZW1vdmVPcHRpb246eX07cmV0dXJue3Jlc3RyaWN0OlwiRVwiLHByaW9yaXR5OjEwMCxjb21waWxlOmZ1bmN0aW9uKGQsZSl7aWYoRChlLnZhbHVlKSl7dmFyIGc9YShkLnRleHQoKSwhMCk7Z3x8ZS4kc2V0KFwidmFsdWVcIixkLnRleHQoKSl9cmV0dXJuIGZ1bmN0aW9uKGEsZCxlKXt2YXIgaD1kLnBhcmVudCgpLGw9aC5kYXRhKFwiJHNlbGVjdENvbnRyb2xsZXJcIil8fGgucGFyZW50KCkuZGF0YShcIiRzZWxlY3RDb250cm9sbGVyXCIpO2wmJmwuZGF0YWJvdW5kP2QucHJvcChcInNlbGVjdGVkXCIsITEpOmw9YztnP2EuJHdhdGNoKGcsZnVuY3Rpb24oYSxjKXtlLiRzZXQoXCJ2YWx1ZVwiLFxuYSk7YSE9PWMmJmwucmVtb3ZlT3B0aW9uKGMpO2wuYWRkT3B0aW9uKGEpfSk6bC5hZGRPcHRpb24oZS52YWx1ZSk7ZC5vbihcIiRkZXN0cm95XCIsZnVuY3Rpb24oKXtsLnJlbW92ZU9wdGlvbihlLnZhbHVlKX0pfX19fV0sZ2Q9JCh7cmVzdHJpY3Q6XCJFXCIsdGVybWluYWw6ITB9KTtULmFuZ3VsYXIuYm9vdHN0cmFwP2NvbnNvbGUubG9nKFwiV0FSTklORzogVHJpZWQgdG8gbG9hZCBhbmd1bGFyIG1vcmUgdGhhbiBvbmNlLlwiKTooKEJhPVQualF1ZXJ5KSYmQmEuZm4ub24/KHc9QmEsSihCYS5mbix7c2NvcGU6S2Euc2NvcGUsaXNvbGF0ZVNjb3BlOkthLmlzb2xhdGVTY29wZSxjb250cm9sbGVyOkthLmNvbnRyb2xsZXIsaW5qZWN0b3I6S2EuaW5qZWN0b3IsaW5oZXJpdGVkRGF0YTpLYS5pbmhlcml0ZWREYXRhfSksRmIoXCJyZW1vdmVcIiwhMCwhMCwhMSksRmIoXCJlbXB0eVwiLCExLCExLCExKSxGYihcImh0bWxcIiwhMSwhMSwhMCkpOnc9UixTYS5lbGVtZW50PXcsWmMoU2EpLHcoVikucmVhZHkoZnVuY3Rpb24oKXtXYyhWLFxuZGMpfSkpfSkod2luZG93LGRvY3VtZW50KTshd2luZG93LmFuZ3VsYXIuJCRjc3AoKSYmd2luZG93LmFuZ3VsYXIuZWxlbWVudChkb2N1bWVudCkuZmluZChcImhlYWRcIikucHJlcGVuZCgnPHN0eWxlIHR5cGU9XCJ0ZXh0L2Nzc1wiPkBjaGFyc2V0IFwiVVRGLThcIjtbbmdcXFxcOmNsb2FrXSxbbmctY2xvYWtdLFtkYXRhLW5nLWNsb2FrXSxbeC1uZy1jbG9ha10sLm5nLWNsb2FrLC54LW5nLWNsb2FrLC5uZy1oaWRle2Rpc3BsYXk6bm9uZSAhaW1wb3J0YW50O31uZ1xcXFw6Zm9ybXtkaXNwbGF5OmJsb2NrO30ubmctYW5pbWF0ZS1ibG9jay10cmFuc2l0aW9uc3t0cmFuc2l0aW9uOjBzIGFsbCFpbXBvcnRhbnQ7LXdlYmtpdC10cmFuc2l0aW9uOjBzIGFsbCFpbXBvcnRhbnQ7fS5uZy1oaWRlLWFkZC1hY3RpdmUsLm5nLWhpZGUtcmVtb3Zle2Rpc3BsYXk6YmxvY2shaW1wb3J0YW50O308L3N0eWxlPicpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9YW5ndWxhci5taW4uanMubWFwXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiREYxdXJ4XCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2FuZ3VsYXIvbGliL2FuZ3VsYXIubWluLmpzXCIsXCIvLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2FuZ3VsYXIvbGliXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyohXG4gKiBUaGUgYnVmZmVyIG1vZHVsZSBmcm9tIG5vZGUuanMsIGZvciB0aGUgYnJvd3Nlci5cbiAqXG4gKiBAYXV0aG9yICAgRmVyb3NzIEFib3VraGFkaWplaCA8ZmVyb3NzQGZlcm9zcy5vcmc+IDxodHRwOi8vZmVyb3NzLm9yZz5cbiAqIEBsaWNlbnNlICBNSVRcbiAqL1xuXG52YXIgYmFzZTY0ID0gcmVxdWlyZSgnYmFzZTY0LWpzJylcbnZhciBpZWVlNzU0ID0gcmVxdWlyZSgnaWVlZTc1NCcpXG5cbmV4cG9ydHMuQnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLlNsb3dCdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMgPSA1MFxuQnVmZmVyLnBvb2xTaXplID0gODE5MlxuXG4vKipcbiAqIElmIGBCdWZmZXIuX3VzZVR5cGVkQXJyYXlzYDpcbiAqICAgPT09IHRydWUgICAgVXNlIFVpbnQ4QXJyYXkgaW1wbGVtZW50YXRpb24gKGZhc3Rlc3QpXG4gKiAgID09PSBmYWxzZSAgIFVzZSBPYmplY3QgaW1wbGVtZW50YXRpb24gKGNvbXBhdGlibGUgZG93biB0byBJRTYpXG4gKi9cbkJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgPSAoZnVuY3Rpb24gKCkge1xuICAvLyBEZXRlY3QgaWYgYnJvd3NlciBzdXBwb3J0cyBUeXBlZCBBcnJheXMuIFN1cHBvcnRlZCBicm93c2VycyBhcmUgSUUgMTArLCBGaXJlZm94IDQrLFxuICAvLyBDaHJvbWUgNyssIFNhZmFyaSA1LjErLCBPcGVyYSAxMS42KywgaU9TIDQuMisuIElmIHRoZSBicm93c2VyIGRvZXMgbm90IHN1cHBvcnQgYWRkaW5nXG4gIC8vIHByb3BlcnRpZXMgdG8gYFVpbnQ4QXJyYXlgIGluc3RhbmNlcywgdGhlbiB0aGF0J3MgdGhlIHNhbWUgYXMgbm8gYFVpbnQ4QXJyYXlgIHN1cHBvcnRcbiAgLy8gYmVjYXVzZSB3ZSBuZWVkIHRvIGJlIGFibGUgdG8gYWRkIGFsbCB0aGUgbm9kZSBCdWZmZXIgQVBJIG1ldGhvZHMuIFRoaXMgaXMgYW4gaXNzdWVcbiAgLy8gaW4gRmlyZWZveCA0LTI5LiBOb3cgZml4ZWQ6IGh0dHBzOi8vYnVnemlsbGEubW96aWxsYS5vcmcvc2hvd19idWcuY2dpP2lkPTY5NTQzOFxuICB0cnkge1xuICAgIHZhciBidWYgPSBuZXcgQXJyYXlCdWZmZXIoMClcbiAgICB2YXIgYXJyID0gbmV3IFVpbnQ4QXJyYXkoYnVmKVxuICAgIGFyci5mb28gPSBmdW5jdGlvbiAoKSB7IHJldHVybiA0MiB9XG4gICAgcmV0dXJuIDQyID09PSBhcnIuZm9vKCkgJiZcbiAgICAgICAgdHlwZW9mIGFyci5zdWJhcnJheSA9PT0gJ2Z1bmN0aW9uJyAvLyBDaHJvbWUgOS0xMCBsYWNrIGBzdWJhcnJheWBcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZVxuICB9XG59KSgpXG5cbi8qKlxuICogQ2xhc3M6IEJ1ZmZlclxuICogPT09PT09PT09PT09PVxuICpcbiAqIFRoZSBCdWZmZXIgY29uc3RydWN0b3IgcmV0dXJucyBpbnN0YW5jZXMgb2YgYFVpbnQ4QXJyYXlgIHRoYXQgYXJlIGF1Z21lbnRlZFxuICogd2l0aCBmdW5jdGlvbiBwcm9wZXJ0aWVzIGZvciBhbGwgdGhlIG5vZGUgYEJ1ZmZlcmAgQVBJIGZ1bmN0aW9ucy4gV2UgdXNlXG4gKiBgVWludDhBcnJheWAgc28gdGhhdCBzcXVhcmUgYnJhY2tldCBub3RhdGlvbiB3b3JrcyBhcyBleHBlY3RlZCAtLSBpdCByZXR1cm5zXG4gKiBhIHNpbmdsZSBvY3RldC5cbiAqXG4gKiBCeSBhdWdtZW50aW5nIHRoZSBpbnN0YW5jZXMsIHdlIGNhbiBhdm9pZCBtb2RpZnlpbmcgdGhlIGBVaW50OEFycmF5YFxuICogcHJvdG90eXBlLlxuICovXG5mdW5jdGlvbiBCdWZmZXIgKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pIHtcbiAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIEJ1ZmZlcikpXG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoc3ViamVjdCwgZW5jb2RpbmcsIG5vWmVybylcblxuICB2YXIgdHlwZSA9IHR5cGVvZiBzdWJqZWN0XG5cbiAgLy8gV29ya2Fyb3VuZDogbm9kZSdzIGJhc2U2NCBpbXBsZW1lbnRhdGlvbiBhbGxvd3MgZm9yIG5vbi1wYWRkZWQgc3RyaW5nc1xuICAvLyB3aGlsZSBiYXNlNjQtanMgZG9lcyBub3QuXG4gIGlmIChlbmNvZGluZyA9PT0gJ2Jhc2U2NCcgJiYgdHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBzdWJqZWN0ID0gc3RyaW5ndHJpbShzdWJqZWN0KVxuICAgIHdoaWxlIChzdWJqZWN0Lmxlbmd0aCAlIDQgIT09IDApIHtcbiAgICAgIHN1YmplY3QgPSBzdWJqZWN0ICsgJz0nXG4gICAgfVxuICB9XG5cbiAgLy8gRmluZCB0aGUgbGVuZ3RoXG4gIHZhciBsZW5ndGhcbiAgaWYgKHR5cGUgPT09ICdudW1iZXInKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0KVxuICBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJylcbiAgICBsZW5ndGggPSBCdWZmZXIuYnl0ZUxlbmd0aChzdWJqZWN0LCBlbmNvZGluZylcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ29iamVjdCcpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QubGVuZ3RoKSAvLyBhc3N1bWUgdGhhdCBvYmplY3QgaXMgYXJyYXktbGlrZVxuICBlbHNlXG4gICAgdGhyb3cgbmV3IEVycm9yKCdGaXJzdCBhcmd1bWVudCBuZWVkcyB0byBiZSBhIG51bWJlciwgYXJyYXkgb3Igc3RyaW5nLicpXG5cbiAgdmFyIGJ1ZlxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIC8vIFByZWZlcnJlZDogUmV0dXJuIGFuIGF1Z21lbnRlZCBgVWludDhBcnJheWAgaW5zdGFuY2UgZm9yIGJlc3QgcGVyZm9ybWFuY2VcbiAgICBidWYgPSBCdWZmZXIuX2F1Z21lbnQobmV3IFVpbnQ4QXJyYXkobGVuZ3RoKSlcbiAgfSBlbHNlIHtcbiAgICAvLyBGYWxsYmFjazogUmV0dXJuIFRISVMgaW5zdGFuY2Ugb2YgQnVmZmVyIChjcmVhdGVkIGJ5IGBuZXdgKVxuICAgIGJ1ZiA9IHRoaXNcbiAgICBidWYubGVuZ3RoID0gbGVuZ3RoXG4gICAgYnVmLl9pc0J1ZmZlciA9IHRydWVcbiAgfVxuXG4gIHZhciBpXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmIHR5cGVvZiBzdWJqZWN0LmJ5dGVMZW5ndGggPT09ICdudW1iZXInKSB7XG4gICAgLy8gU3BlZWQgb3B0aW1pemF0aW9uIC0tIHVzZSBzZXQgaWYgd2UncmUgY29weWluZyBmcm9tIGEgdHlwZWQgYXJyYXlcbiAgICBidWYuX3NldChzdWJqZWN0KVxuICB9IGVsc2UgaWYgKGlzQXJyYXlpc2goc3ViamVjdCkpIHtcbiAgICAvLyBUcmVhdCBhcnJheS1pc2ggb2JqZWN0cyBhcyBhIGJ5dGUgYXJyYXlcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkpXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3QucmVhZFVJbnQ4KGkpXG4gICAgICBlbHNlXG4gICAgICAgIGJ1ZltpXSA9IHN1YmplY3RbaV1cbiAgICB9XG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpIHtcbiAgICBidWYud3JpdGUoc3ViamVjdCwgMCwgZW5jb2RpbmcpXG4gIH0gZWxzZSBpZiAodHlwZSA9PT0gJ251bWJlcicgJiYgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgJiYgIW5vWmVybykge1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgYnVmW2ldID0gMFxuICAgIH1cbiAgfVxuXG4gIHJldHVybiBidWZcbn1cblxuLy8gU1RBVElDIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09XG5cbkJ1ZmZlci5pc0VuY29kaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nKSB7XG4gIHN3aXRjaCAoU3RyaW5nKGVuY29kaW5nKS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICBjYXNlICdyYXcnOlxuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5CdWZmZXIuaXNCdWZmZXIgPSBmdW5jdGlvbiAoYikge1xuICByZXR1cm4gISEoYiAhPT0gbnVsbCAmJiBiICE9PSB1bmRlZmluZWQgJiYgYi5faXNCdWZmZXIpXG59XG5cbkJ1ZmZlci5ieXRlTGVuZ3RoID0gZnVuY3Rpb24gKHN0ciwgZW5jb2RpbmcpIHtcbiAgdmFyIHJldFxuICBzdHIgPSBzdHIgKyAnJ1xuICBzd2l0Y2ggKGVuY29kaW5nIHx8ICd1dGY4Jykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoIC8gMlxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSB1dGY4VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdyYXcnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gYmFzZTY0VG9CeXRlcyhzdHIpLmxlbmd0aFxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAqIDJcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIuY29uY2F0ID0gZnVuY3Rpb24gKGxpc3QsIHRvdGFsTGVuZ3RoKSB7XG4gIGFzc2VydChpc0FycmF5KGxpc3QpLCAnVXNhZ2U6IEJ1ZmZlci5jb25jYXQobGlzdCwgW3RvdGFsTGVuZ3RoXSlcXG4nICtcbiAgICAgICdsaXN0IHNob3VsZCBiZSBhbiBBcnJheS4nKVxuXG4gIGlmIChsaXN0Lmxlbmd0aCA9PT0gMCkge1xuICAgIHJldHVybiBuZXcgQnVmZmVyKDApXG4gIH0gZWxzZSBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICByZXR1cm4gbGlzdFswXVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKHR5cGVvZiB0b3RhbExlbmd0aCAhPT0gJ251bWJlcicpIHtcbiAgICB0b3RhbExlbmd0aCA9IDBcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgICAgdG90YWxMZW5ndGggKz0gbGlzdFtpXS5sZW5ndGhcbiAgICB9XG4gIH1cblxuICB2YXIgYnVmID0gbmV3IEJ1ZmZlcih0b3RhbExlbmd0aClcbiAgdmFyIHBvcyA9IDBcbiAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgaXRlbSA9IGxpc3RbaV1cbiAgICBpdGVtLmNvcHkoYnVmLCBwb3MpXG4gICAgcG9zICs9IGl0ZW0ubGVuZ3RoXG4gIH1cbiAgcmV0dXJuIGJ1ZlxufVxuXG4vLyBCVUZGRVIgSU5TVEFOQ0UgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gX2hleFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gYnVmLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG5cbiAgLy8gbXVzdCBiZSBhbiBldmVuIG51bWJlciBvZiBkaWdpdHNcbiAgdmFyIHN0ckxlbiA9IHN0cmluZy5sZW5ndGhcbiAgYXNzZXJ0KHN0ckxlbiAlIDIgPT09IDAsICdJbnZhbGlkIGhleCBzdHJpbmcnKVxuXG4gIGlmIChsZW5ndGggPiBzdHJMZW4gLyAyKSB7XG4gICAgbGVuZ3RoID0gc3RyTGVuIC8gMlxuICB9XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYnl0ZSA9IHBhcnNlSW50KHN0cmluZy5zdWJzdHIoaSAqIDIsIDIpLCAxNilcbiAgICBhc3NlcnQoIWlzTmFOKGJ5dGUpLCAnSW52YWxpZCBoZXggc3RyaW5nJylcbiAgICBidWZbb2Zmc2V0ICsgaV0gPSBieXRlXG4gIH1cbiAgQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPSBpICogMlxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBfdXRmOFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjhUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2FzY2lpV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIoYXNjaWlUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX2JpbmFyeVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgcmV0dXJuIF9hc2NpaVdyaXRlKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGJhc2U2NFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfdXRmMTZsZVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKHV0ZjE2bGVUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZSA9IGZ1bmN0aW9uIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZykge1xuICAvLyBTdXBwb3J0IGJvdGggKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKVxuICAvLyBhbmQgdGhlIGxlZ2FjeSAoc3RyaW5nLCBlbmNvZGluZywgb2Zmc2V0LCBsZW5ndGgpXG4gIGlmIChpc0Zpbml0ZShvZmZzZXQpKSB7XG4gICAgaWYgKCFpc0Zpbml0ZShsZW5ndGgpKSB7XG4gICAgICBlbmNvZGluZyA9IGxlbmd0aFxuICAgICAgbGVuZ3RoID0gdW5kZWZpbmVkXG4gICAgfVxuICB9IGVsc2UgeyAgLy8gbGVnYWN5XG4gICAgdmFyIHN3YXAgPSBlbmNvZGluZ1xuICAgIGVuY29kaW5nID0gb2Zmc2V0XG4gICAgb2Zmc2V0ID0gbGVuZ3RoXG4gICAgbGVuZ3RoID0gc3dhcFxuICB9XG5cbiAgb2Zmc2V0ID0gTnVtYmVyKG9mZnNldCkgfHwgMFxuICB2YXIgcmVtYWluaW5nID0gdGhpcy5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uIChlbmNvZGluZywgc3RhcnQsIGVuZCkge1xuICB2YXIgc2VsZiA9IHRoaXNcblxuICBlbmNvZGluZyA9IFN0cmluZyhlbmNvZGluZyB8fCAndXRmOCcpLnRvTG93ZXJDYXNlKClcbiAgc3RhcnQgPSBOdW1iZXIoc3RhcnQpIHx8IDBcbiAgZW5kID0gKGVuZCAhPT0gdW5kZWZpbmVkKVxuICAgID8gTnVtYmVyKGVuZClcbiAgICA6IGVuZCA9IHNlbGYubGVuZ3RoXG5cbiAgLy8gRmFzdHBhdGggZW1wdHkgc3RyaW5nc1xuICBpZiAoZW5kID09PSBzdGFydClcbiAgICByZXR1cm4gJydcblxuICB2YXIgcmV0XG4gIHN3aXRjaCAoZW5jb2RpbmcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gX2hleFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IF91dGY4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgICAgcmV0ID0gX2FzY2lpU2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICAgIHJldCA9IF9iaW5hcnlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgICAgcmV0ID0gX2Jhc2U2NFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBfdXRmMTZsZVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLnByb3RvdHlwZS50b0pTT04gPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0J1ZmZlcicsXG4gICAgZGF0YTogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwodGhpcy5fYXJyIHx8IHRoaXMsIDApXG4gIH1cbn1cblxuLy8gY29weSh0YXJnZXRCdWZmZXIsIHRhcmdldFN0YXJ0PTAsIHNvdXJjZVN0YXJ0PTAsIHNvdXJjZUVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKHRhcmdldCwgdGFyZ2V0X3N0YXJ0LCBzdGFydCwgZW5kKSB7XG4gIHZhciBzb3VyY2UgPSB0aGlzXG5cbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kICYmIGVuZCAhPT0gMCkgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKCF0YXJnZXRfc3RhcnQpIHRhcmdldF9zdGFydCA9IDBcblxuICAvLyBDb3B5IDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGFyZ2V0Lmxlbmd0aCA9PT0gMCB8fCBzb3VyY2UubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICAvLyBGYXRhbCBlcnJvciBjb25kaXRpb25zXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdzb3VyY2VFbmQgPCBzb3VyY2VTdGFydCcpXG4gIGFzc2VydCh0YXJnZXRfc3RhcnQgPj0gMCAmJiB0YXJnZXRfc3RhcnQgPCB0YXJnZXQubGVuZ3RoLFxuICAgICAgJ3RhcmdldFN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHNvdXJjZS5sZW5ndGgsICdzb3VyY2VTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSBzb3VyY2UubGVuZ3RoLCAnc291cmNlRW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIC8vIEFyZSB3ZSBvb2I/XG4gIGlmIChlbmQgPiB0aGlzLmxlbmd0aClcbiAgICBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAodGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCA8IGVuZCAtIHN0YXJ0KVxuICAgIGVuZCA9IHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgKyBzdGFydFxuXG4gIHZhciBsZW4gPSBlbmQgLSBzdGFydFxuXG4gIGlmIChsZW4gPCAxMDAgfHwgIUJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKVxuICAgICAgdGFyZ2V0W2kgKyB0YXJnZXRfc3RhcnRdID0gdGhpc1tpICsgc3RhcnRdXG4gIH0gZWxzZSB7XG4gICAgdGFyZ2V0Ll9zZXQodGhpcy5zdWJhcnJheShzdGFydCwgc3RhcnQgKyBsZW4pLCB0YXJnZXRfc3RhcnQpXG4gIH1cbn1cblxuZnVuY3Rpb24gX2Jhc2U2NFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKHN0YXJ0ID09PSAwICYmIGVuZCA9PT0gYnVmLmxlbmd0aCkge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYpXG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1Zi5zbGljZShzdGFydCwgZW5kKSlcbiAgfVxufVxuXG5mdW5jdGlvbiBfdXRmOFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJlcyA9ICcnXG4gIHZhciB0bXAgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBpZiAoYnVmW2ldIDw9IDB4N0YpIHtcbiAgICAgIHJlcyArPSBkZWNvZGVVdGY4Q2hhcih0bXApICsgU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gICAgICB0bXAgPSAnJ1xuICAgIH0gZWxzZSB7XG4gICAgICB0bXAgKz0gJyUnICsgYnVmW2ldLnRvU3RyaW5nKDE2KVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiByZXMgKyBkZWNvZGVVdGY4Q2hhcih0bXApXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHJldCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKylcbiAgICByZXQgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShidWZbaV0pXG4gIHJldHVybiByZXRcbn1cblxuZnVuY3Rpb24gX2JpbmFyeVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgcmV0dXJuIF9hc2NpaVNsaWNlKGJ1Ziwgc3RhcnQsIGVuZClcbn1cblxuZnVuY3Rpb24gX2hleFNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcblxuICBpZiAoIXN0YXJ0IHx8IHN0YXJ0IDwgMCkgc3RhcnQgPSAwXG4gIGlmICghZW5kIHx8IGVuZCA8IDAgfHwgZW5kID4gbGVuKSBlbmQgPSBsZW5cblxuICB2YXIgb3V0ID0gJydcbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICBvdXQgKz0gdG9IZXgoYnVmW2ldKVxuICB9XG4gIHJldHVybiBvdXRcbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBieXRlcyA9IGJ1Zi5zbGljZShzdGFydCwgZW5kKVxuICB2YXIgcmVzID0gJydcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBieXRlcy5sZW5ndGg7IGkgKz0gMikge1xuICAgIHJlcyArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ5dGVzW2ldICsgYnl0ZXNbaSsxXSAqIDI1NilcbiAgfVxuICByZXR1cm4gcmVzXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuc2xpY2UgPSBmdW5jdGlvbiAoc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgc3RhcnQgPSBjbGFtcChzdGFydCwgbGVuLCAwKVxuICBlbmQgPSBjbGFtcChlbmQsIGxlbiwgbGVuKVxuXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgcmV0dXJuIEJ1ZmZlci5fYXVnbWVudCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBlbmQpKVxuICB9IGVsc2Uge1xuICAgIHZhciBzbGljZUxlbiA9IGVuZCAtIHN0YXJ0XG4gICAgdmFyIG5ld0J1ZiA9IG5ldyBCdWZmZXIoc2xpY2VMZW4sIHVuZGVmaW5lZCwgdHJ1ZSlcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHNsaWNlTGVuOyBpKyspIHtcbiAgICAgIG5ld0J1ZltpXSA9IHRoaXNbaSArIHN0YXJ0XVxuICAgIH1cbiAgICByZXR1cm4gbmV3QnVmXG4gIH1cbn1cblxuLy8gYGdldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuZ2V0ID0gZnVuY3Rpb24gKG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLmdldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMucmVhZFVJbnQ4KG9mZnNldClcbn1cblxuLy8gYHNldGAgd2lsbCBiZSByZW1vdmVkIGluIE5vZGUgMC4xMytcbkJ1ZmZlci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKHYsIG9mZnNldCkge1xuICBjb25zb2xlLmxvZygnLnNldCgpIGlzIGRlcHJlY2F0ZWQuIEFjY2VzcyB1c2luZyBhcnJheSBpbmRleGVzIGluc3RlYWQuJylcbiAgcmV0dXJuIHRoaXMud3JpdGVVSW50OCh2LCBvZmZzZXQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbFxuICBpZiAobGl0dGxlRW5kaWFuKSB7XG4gICAgdmFsID0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV0gPDwgOFxuICB9IGVsc2Uge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV1cbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIGlmIChvZmZzZXQgKyAyIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDJdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgICB2YWwgfD0gYnVmW29mZnNldF1cbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0ICsgM10gPDwgMjQgPj4+IDApXG4gIH0gZWxzZSB7XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgPSBidWZbb2Zmc2V0ICsgMV0gPDwgMTZcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMl0gPDwgOFxuICAgIGlmIChvZmZzZXQgKyAzIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAzXVxuICAgIHZhbCA9IHZhbCArIChidWZbb2Zmc2V0XSA8PCAyNCA+Pj4gMClcbiAgfVxuICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZFVJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkVUludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQ4ID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsXG4gICAgICAgICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICB2YXIgbmVnID0gdGhpc1tvZmZzZXRdICYgMHg4MFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZiAtIHRoaXNbb2Zmc2V0XSArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWwgPSBfcmVhZFVJbnQxNihidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCB0cnVlKVxuICB2YXIgbmVnID0gdmFsICYgMHg4MDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MzIoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMDAwMDBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmZmZmZmZmYgLSB2YWwgKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdmFsXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRmxvYXQgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWREb3VibGUgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgcmV0dXJuIGllZWU3NTQucmVhZChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRG91YmxlQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWREb3VibGUodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aCkgcmV0dXJuXG5cbiAgdGhpc1tvZmZzZXRdID0gdmFsdWVcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4obGVuIC0gb2Zmc2V0LCAyKTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSAmICgweGZmIDw8ICg4ICogKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkpKSkgPj4+XG4gICAgICAgICAgICAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSAqIDhcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlVUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmZmZmZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgNCk7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgPj4+IChsaXR0bGVFbmRpYW4gPyBpIDogMyAtIGkpICogOCkgJiAweGZmXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQzMkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQ4ID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2YsIC0weDgwKVxuICB9XG5cbiAgaWYgKG9mZnNldCA+PSB0aGlzLmxlbmd0aClcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICB0aGlzLndyaXRlVUludDgodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICB0aGlzLndyaXRlVUludDgoMHhmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmLCAtMHg4MDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgX3dyaXRlVUludDE2KGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbiAgZWxzZVxuICAgIF93cml0ZVVJbnQxNihidWYsIDB4ZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmZmZmZmLCAtMHg4MDAwMDAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQzMihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MzIoYnVmLCAweGZmZmZmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUZsb2F0IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgsIC0zLjQwMjgyMzQ2NjM4NTI4ODZlKzM4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdExFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZURvdWJsZSAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCxcbiAgICAgICAgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAxLjc5NzY5MzEzNDg2MjMxNTdFKzMwOCwgLTEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4KVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWVlZTc1NC53cml0ZShidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVEb3VibGVCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVEb3VibGUodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG4vLyBmaWxsKHZhbHVlLCBzdGFydD0wLCBlbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuZmlsbCA9IGZ1bmN0aW9uICh2YWx1ZSwgc3RhcnQsIGVuZCkge1xuICBpZiAoIXZhbHVlKSB2YWx1ZSA9IDBcbiAgaWYgKCFzdGFydCkgc3RhcnQgPSAwXG4gIGlmICghZW5kKSBlbmQgPSB0aGlzLmxlbmd0aFxuXG4gIGlmICh0eXBlb2YgdmFsdWUgPT09ICdzdHJpbmcnKSB7XG4gICAgdmFsdWUgPSB2YWx1ZS5jaGFyQ29kZUF0KDApXG4gIH1cblxuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiAhaXNOYU4odmFsdWUpLCAndmFsdWUgaXMgbm90IGEgbnVtYmVyJylcbiAgYXNzZXJ0KGVuZCA+PSBzdGFydCwgJ2VuZCA8IHN0YXJ0JylcblxuICAvLyBGaWxsIDAgYnl0ZXM7IHdlJ3JlIGRvbmVcbiAgaWYgKGVuZCA9PT0gc3RhcnQpIHJldHVyblxuICBpZiAodGhpcy5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIGFzc2VydChzdGFydCA+PSAwICYmIHN0YXJ0IDwgdGhpcy5sZW5ndGgsICdzdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KGVuZCA+PSAwICYmIGVuZCA8PSB0aGlzLmxlbmd0aCwgJ2VuZCBvdXQgb2YgYm91bmRzJylcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIHRoaXNbaV0gPSB2YWx1ZVxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUuaW5zcGVjdCA9IGZ1bmN0aW9uICgpIHtcbiAgdmFyIG91dCA9IFtdXG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgb3V0W2ldID0gdG9IZXgodGhpc1tpXSlcbiAgICBpZiAoaSA9PT0gZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUykge1xuICAgICAgb3V0W2kgKyAxXSA9ICcuLi4nXG4gICAgICBicmVha1xuICAgIH1cbiAgfVxuICByZXR1cm4gJzxCdWZmZXIgJyArIG91dC5qb2luKCcgJykgKyAnPidcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgbmV3IGBBcnJheUJ1ZmZlcmAgd2l0aCB0aGUgKmNvcGllZCogbWVtb3J5IG9mIHRoZSBidWZmZXIgaW5zdGFuY2UuXG4gKiBBZGRlZCBpbiBOb2RlIDAuMTIuIE9ubHkgYXZhaWxhYmxlIGluIGJyb3dzZXJzIHRoYXQgc3VwcG9ydCBBcnJheUJ1ZmZlci5cbiAqL1xuQnVmZmVyLnByb3RvdHlwZS50b0FycmF5QnVmZmVyID0gZnVuY3Rpb24gKCkge1xuICBpZiAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAgIHJldHVybiAobmV3IEJ1ZmZlcih0aGlzKSkuYnVmZmVyXG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciBidWYgPSBuZXcgVWludDhBcnJheSh0aGlzLmxlbmd0aClcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBidWYubGVuZ3RoOyBpIDwgbGVuOyBpICs9IDEpXG4gICAgICAgIGJ1ZltpXSA9IHRoaXNbaV1cbiAgICAgIHJldHVybiBidWYuYnVmZmVyXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignQnVmZmVyLnRvQXJyYXlCdWZmZXIgbm90IHN1cHBvcnRlZCBpbiB0aGlzIGJyb3dzZXInKVxuICB9XG59XG5cbi8vIEhFTFBFUiBGVU5DVElPTlNcbi8vID09PT09PT09PT09PT09PT1cblxuZnVuY3Rpb24gc3RyaW5ndHJpbSAoc3RyKSB7XG4gIGlmIChzdHIudHJpbSkgcmV0dXJuIHN0ci50cmltKClcbiAgcmV0dXJuIHN0ci5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJylcbn1cblxudmFyIEJQID0gQnVmZmVyLnByb3RvdHlwZVxuXG4vKipcbiAqIEF1Z21lbnQgYSBVaW50OEFycmF5ICppbnN0YW5jZSogKG5vdCB0aGUgVWludDhBcnJheSBjbGFzcyEpIHdpdGggQnVmZmVyIG1ldGhvZHNcbiAqL1xuQnVmZmVyLl9hdWdtZW50ID0gZnVuY3Rpb24gKGFycikge1xuICBhcnIuX2lzQnVmZmVyID0gdHJ1ZVxuXG4gIC8vIHNhdmUgcmVmZXJlbmNlIHRvIG9yaWdpbmFsIFVpbnQ4QXJyYXkgZ2V0L3NldCBtZXRob2RzIGJlZm9yZSBvdmVyd3JpdGluZ1xuICBhcnIuX2dldCA9IGFyci5nZXRcbiAgYXJyLl9zZXQgPSBhcnIuc2V0XG5cbiAgLy8gZGVwcmVjYXRlZCwgd2lsbCBiZSByZW1vdmVkIGluIG5vZGUgMC4xMytcbiAgYXJyLmdldCA9IEJQLmdldFxuICBhcnIuc2V0ID0gQlAuc2V0XG5cbiAgYXJyLndyaXRlID0gQlAud3JpdGVcbiAgYXJyLnRvU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvTG9jYWxlU3RyaW5nID0gQlAudG9TdHJpbmdcbiAgYXJyLnRvSlNPTiA9IEJQLnRvSlNPTlxuICBhcnIuY29weSA9IEJQLmNvcHlcbiAgYXJyLnNsaWNlID0gQlAuc2xpY2VcbiAgYXJyLnJlYWRVSW50OCA9IEJQLnJlYWRVSW50OFxuICBhcnIucmVhZFVJbnQxNkxFID0gQlAucmVhZFVJbnQxNkxFXG4gIGFyci5yZWFkVUludDE2QkUgPSBCUC5yZWFkVUludDE2QkVcbiAgYXJyLnJlYWRVSW50MzJMRSA9IEJQLnJlYWRVSW50MzJMRVxuICBhcnIucmVhZFVJbnQzMkJFID0gQlAucmVhZFVJbnQzMkJFXG4gIGFyci5yZWFkSW50OCA9IEJQLnJlYWRJbnQ4XG4gIGFyci5yZWFkSW50MTZMRSA9IEJQLnJlYWRJbnQxNkxFXG4gIGFyci5yZWFkSW50MTZCRSA9IEJQLnJlYWRJbnQxNkJFXG4gIGFyci5yZWFkSW50MzJMRSA9IEJQLnJlYWRJbnQzMkxFXG4gIGFyci5yZWFkSW50MzJCRSA9IEJQLnJlYWRJbnQzMkJFXG4gIGFyci5yZWFkRmxvYXRMRSA9IEJQLnJlYWRGbG9hdExFXG4gIGFyci5yZWFkRmxvYXRCRSA9IEJQLnJlYWRGbG9hdEJFXG4gIGFyci5yZWFkRG91YmxlTEUgPSBCUC5yZWFkRG91YmxlTEVcbiAgYXJyLnJlYWREb3VibGVCRSA9IEJQLnJlYWREb3VibGVCRVxuICBhcnIud3JpdGVVSW50OCA9IEJQLndyaXRlVUludDhcbiAgYXJyLndyaXRlVUludDE2TEUgPSBCUC53cml0ZVVJbnQxNkxFXG4gIGFyci53cml0ZVVJbnQxNkJFID0gQlAud3JpdGVVSW50MTZCRVxuICBhcnIud3JpdGVVSW50MzJMRSA9IEJQLndyaXRlVUludDMyTEVcbiAgYXJyLndyaXRlVUludDMyQkUgPSBCUC53cml0ZVVJbnQzMkJFXG4gIGFyci53cml0ZUludDggPSBCUC53cml0ZUludDhcbiAgYXJyLndyaXRlSW50MTZMRSA9IEJQLndyaXRlSW50MTZMRVxuICBhcnIud3JpdGVJbnQxNkJFID0gQlAud3JpdGVJbnQxNkJFXG4gIGFyci53cml0ZUludDMyTEUgPSBCUC53cml0ZUludDMyTEVcbiAgYXJyLndyaXRlSW50MzJCRSA9IEJQLndyaXRlSW50MzJCRVxuICBhcnIud3JpdGVGbG9hdExFID0gQlAud3JpdGVGbG9hdExFXG4gIGFyci53cml0ZUZsb2F0QkUgPSBCUC53cml0ZUZsb2F0QkVcbiAgYXJyLndyaXRlRG91YmxlTEUgPSBCUC53cml0ZURvdWJsZUxFXG4gIGFyci53cml0ZURvdWJsZUJFID0gQlAud3JpdGVEb3VibGVCRVxuICBhcnIuZmlsbCA9IEJQLmZpbGxcbiAgYXJyLmluc3BlY3QgPSBCUC5pbnNwZWN0XG4gIGFyci50b0FycmF5QnVmZmVyID0gQlAudG9BcnJheUJ1ZmZlclxuXG4gIHJldHVybiBhcnJcbn1cblxuLy8gc2xpY2Uoc3RhcnQsIGVuZClcbmZ1bmN0aW9uIGNsYW1wIChpbmRleCwgbGVuLCBkZWZhdWx0VmFsdWUpIHtcbiAgaWYgKHR5cGVvZiBpbmRleCAhPT0gJ251bWJlcicpIHJldHVybiBkZWZhdWx0VmFsdWVcbiAgaW5kZXggPSB+fmluZGV4OyAgLy8gQ29lcmNlIHRvIGludGVnZXIuXG4gIGlmIChpbmRleCA+PSBsZW4pIHJldHVybiBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICBpbmRleCArPSBsZW5cbiAgaWYgKGluZGV4ID49IDApIHJldHVybiBpbmRleFxuICByZXR1cm4gMFxufVxuXG5mdW5jdGlvbiBjb2VyY2UgKGxlbmd0aCkge1xuICAvLyBDb2VyY2UgbGVuZ3RoIHRvIGEgbnVtYmVyIChwb3NzaWJseSBOYU4pLCByb3VuZCB1cFxuICAvLyBpbiBjYXNlIGl0J3MgZnJhY3Rpb25hbCAoZS5nLiAxMjMuNDU2KSB0aGVuIGRvIGFcbiAgLy8gZG91YmxlIG5lZ2F0ZSB0byBjb2VyY2UgYSBOYU4gdG8gMC4gRWFzeSwgcmlnaHQ/XG4gIGxlbmd0aCA9IH5+TWF0aC5jZWlsKCtsZW5ndGgpXG4gIHJldHVybiBsZW5ndGggPCAwID8gMCA6IGxlbmd0aFxufVxuXG5mdW5jdGlvbiBpc0FycmF5IChzdWJqZWN0KSB7XG4gIHJldHVybiAoQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoc3ViamVjdCkge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoc3ViamVjdCkgPT09ICdbb2JqZWN0IEFycmF5XSdcbiAgfSkoc3ViamVjdClcbn1cblxuZnVuY3Rpb24gaXNBcnJheWlzaCAoc3ViamVjdCkge1xuICByZXR1cm4gaXNBcnJheShzdWJqZWN0KSB8fCBCdWZmZXIuaXNCdWZmZXIoc3ViamVjdCkgfHxcbiAgICAgIHN1YmplY3QgJiYgdHlwZW9mIHN1YmplY3QgPT09ICdvYmplY3QnICYmXG4gICAgICB0eXBlb2Ygc3ViamVjdC5sZW5ndGggPT09ICdudW1iZXInXG59XG5cbmZ1bmN0aW9uIHRvSGV4IChuKSB7XG4gIGlmIChuIDwgMTYpIHJldHVybiAnMCcgKyBuLnRvU3RyaW5nKDE2KVxuICByZXR1cm4gbi50b1N0cmluZygxNilcbn1cblxuZnVuY3Rpb24gdXRmOFRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICB2YXIgYiA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaWYgKGIgPD0gMHg3RilcbiAgICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpKVxuICAgIGVsc2Uge1xuICAgICAgdmFyIHN0YXJ0ID0gaVxuICAgICAgaWYgKGIgPj0gMHhEODAwICYmIGIgPD0gMHhERkZGKSBpKytcbiAgICAgIHZhciBoID0gZW5jb2RlVVJJQ29tcG9uZW50KHN0ci5zbGljZShzdGFydCwgaSsxKSkuc3Vic3RyKDEpLnNwbGl0KCclJylcbiAgICAgIGZvciAodmFyIGogPSAwOyBqIDwgaC5sZW5ndGg7IGorKylcbiAgICAgICAgYnl0ZUFycmF5LnB1c2gocGFyc2VJbnQoaFtqXSwgMTYpKVxuICAgIH1cbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGFzY2lpVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIC8vIE5vZGUncyBjb2RlIHNlZW1zIHRvIGJlIGRvaW5nIHRoaXMgYW5kIG5vdCAmIDB4N0YuLlxuICAgIGJ5dGVBcnJheS5wdXNoKHN0ci5jaGFyQ29kZUF0KGkpICYgMHhGRilcbiAgfVxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIHV0ZjE2bGVUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGMsIGhpLCBsb1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICBjID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBoaSA9IGMgPj4gOFxuICAgIGxvID0gYyAlIDI1NlxuICAgIGJ5dGVBcnJheS5wdXNoKGxvKVxuICAgIGJ5dGVBcnJheS5wdXNoKGhpKVxuICB9XG5cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBiYXNlNjRUb0J5dGVzIChzdHIpIHtcbiAgcmV0dXJuIGJhc2U2NC50b0J5dGVBcnJheShzdHIpXG59XG5cbmZ1bmN0aW9uIGJsaXRCdWZmZXIgKHNyYywgZHN0LCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgcG9zXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICBpZiAoKGkgKyBvZmZzZXQgPj0gZHN0Lmxlbmd0aCkgfHwgKGkgPj0gc3JjLmxlbmd0aCkpXG4gICAgICBicmVha1xuICAgIGRzdFtpICsgb2Zmc2V0XSA9IHNyY1tpXVxuICB9XG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIGRlY29kZVV0ZjhDaGFyIChzdHIpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gZGVjb2RlVVJJQ29tcG9uZW50KHN0cilcbiAgfSBjYXRjaCAoZXJyKSB7XG4gICAgcmV0dXJuIFN0cmluZy5mcm9tQ2hhckNvZGUoMHhGRkZEKSAvLyBVVEYgOCBpbnZhbGlkIGNoYXJcbiAgfVxufVxuXG4vKlxuICogV2UgaGF2ZSB0byBtYWtlIHN1cmUgdGhhdCB0aGUgdmFsdWUgaXMgYSB2YWxpZCBpbnRlZ2VyLiBUaGlzIG1lYW5zIHRoYXQgaXRcbiAqIGlzIG5vbi1uZWdhdGl2ZS4gSXQgaGFzIG5vIGZyYWN0aW9uYWwgY29tcG9uZW50IGFuZCB0aGF0IGl0IGRvZXMgbm90XG4gKiBleGNlZWQgdGhlIG1heGltdW0gYWxsb3dlZCB2YWx1ZS5cbiAqL1xuZnVuY3Rpb24gdmVyaWZ1aW50ICh2YWx1ZSwgbWF4KSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA+PSAwLCAnc3BlY2lmaWVkIGEgbmVnYXRpdmUgdmFsdWUgZm9yIHdyaXRpbmcgYW4gdW5zaWduZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgaXMgbGFyZ2VyIHRoYW4gbWF4aW11bSB2YWx1ZSBmb3IgdHlwZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmc2ludCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydChNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUsICd2YWx1ZSBoYXMgYSBmcmFjdGlvbmFsIGNvbXBvbmVudCcpXG59XG5cbmZ1bmN0aW9uIHZlcmlmSUVFRTc1NCAodmFsdWUsIG1heCwgbWluKSB7XG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInLCAnY2Fubm90IHdyaXRlIGEgbm9uLW51bWJlciBhcyBhIG51bWJlcicpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBsYXJnZXIgdGhhbiBtYXhpbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQodmFsdWUgPj0gbWluLCAndmFsdWUgc21hbGxlciB0aGFuIG1pbmltdW0gYWxsb3dlZCB2YWx1ZScpXG59XG5cbmZ1bmN0aW9uIGFzc2VydCAodGVzdCwgbWVzc2FnZSkge1xuICBpZiAoIXRlc3QpIHRocm93IG5ldyBFcnJvcihtZXNzYWdlIHx8ICdGYWlsZWQgYXNzZXJ0aW9uJylcbn1cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJERjF1cnhcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvaW5kZXguanNcIixcIi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXJcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgbG9va3VwID0gJ0FCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXowMTIzNDU2Nzg5Ky8nO1xuXG47KGZ1bmN0aW9uIChleHBvcnRzKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuICB2YXIgQXJyID0gKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJylcbiAgICA/IFVpbnQ4QXJyYXlcbiAgICA6IEFycmF5XG5cblx0dmFyIFBMVVMgICA9ICcrJy5jaGFyQ29kZUF0KDApXG5cdHZhciBTTEFTSCAgPSAnLycuY2hhckNvZGVBdCgwKVxuXHR2YXIgTlVNQkVSID0gJzAnLmNoYXJDb2RlQXQoMClcblx0dmFyIExPV0VSICA9ICdhJy5jaGFyQ29kZUF0KDApXG5cdHZhciBVUFBFUiAgPSAnQScuY2hhckNvZGVBdCgwKVxuXG5cdGZ1bmN0aW9uIGRlY29kZSAoZWx0KSB7XG5cdFx0dmFyIGNvZGUgPSBlbHQuY2hhckNvZGVBdCgwKVxuXHRcdGlmIChjb2RlID09PSBQTFVTKVxuXHRcdFx0cmV0dXJuIDYyIC8vICcrJ1xuXHRcdGlmIChjb2RlID09PSBTTEFTSClcblx0XHRcdHJldHVybiA2MyAvLyAnLydcblx0XHRpZiAoY29kZSA8IE5VTUJFUilcblx0XHRcdHJldHVybiAtMSAvL25vIG1hdGNoXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIgKyAxMClcblx0XHRcdHJldHVybiBjb2RlIC0gTlVNQkVSICsgMjYgKyAyNlxuXHRcdGlmIChjb2RlIDwgVVBQRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gVVBQRVJcblx0XHRpZiAoY29kZSA8IExPV0VSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIExPV0VSICsgMjZcblx0fVxuXG5cdGZ1bmN0aW9uIGI2NFRvQnl0ZUFycmF5IChiNjQpIHtcblx0XHR2YXIgaSwgaiwgbCwgdG1wLCBwbGFjZUhvbGRlcnMsIGFyclxuXG5cdFx0aWYgKGI2NC5sZW5ndGggJSA0ID4gMCkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIHN0cmluZy4gTGVuZ3RoIG11c3QgYmUgYSBtdWx0aXBsZSBvZiA0Jylcblx0XHR9XG5cblx0XHQvLyB0aGUgbnVtYmVyIG9mIGVxdWFsIHNpZ25zIChwbGFjZSBob2xkZXJzKVxuXHRcdC8vIGlmIHRoZXJlIGFyZSB0d28gcGxhY2Vob2xkZXJzLCB0aGFuIHRoZSB0d28gY2hhcmFjdGVycyBiZWZvcmUgaXRcblx0XHQvLyByZXByZXNlbnQgb25lIGJ5dGVcblx0XHQvLyBpZiB0aGVyZSBpcyBvbmx5IG9uZSwgdGhlbiB0aGUgdGhyZWUgY2hhcmFjdGVycyBiZWZvcmUgaXQgcmVwcmVzZW50IDIgYnl0ZXNcblx0XHQvLyB0aGlzIGlzIGp1c3QgYSBjaGVhcCBoYWNrIHRvIG5vdCBkbyBpbmRleE9mIHR3aWNlXG5cdFx0dmFyIGxlbiA9IGI2NC5sZW5ndGhcblx0XHRwbGFjZUhvbGRlcnMgPSAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMikgPyAyIDogJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDEpID8gMSA6IDBcblxuXHRcdC8vIGJhc2U2NCBpcyA0LzMgKyB1cCB0byB0d28gY2hhcmFjdGVycyBvZiB0aGUgb3JpZ2luYWwgZGF0YVxuXHRcdGFyciA9IG5ldyBBcnIoYjY0Lmxlbmd0aCAqIDMgLyA0IC0gcGxhY2VIb2xkZXJzKVxuXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHBsYWNlaG9sZGVycywgb25seSBnZXQgdXAgdG8gdGhlIGxhc3QgY29tcGxldGUgNCBjaGFyc1xuXHRcdGwgPSBwbGFjZUhvbGRlcnMgPiAwID8gYjY0Lmxlbmd0aCAtIDQgOiBiNjQubGVuZ3RoXG5cblx0XHR2YXIgTCA9IDBcblxuXHRcdGZ1bmN0aW9uIHB1c2ggKHYpIHtcblx0XHRcdGFycltMKytdID0gdlxuXHRcdH1cblxuXHRcdGZvciAoaSA9IDAsIGogPSAwOyBpIDwgbDsgaSArPSA0LCBqICs9IDMpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTgpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgMTIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPDwgNikgfCBkZWNvZGUoYjY0LmNoYXJBdChpICsgMykpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDAwMCkgPj4gMTYpXG5cdFx0XHRwdXNoKCh0bXAgJiAweEZGMDApID4+IDgpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0aWYgKHBsYWNlSG9sZGVycyA9PT0gMikge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpID4+IDQpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fSBlbHNlIGlmIChwbGFjZUhvbGRlcnMgPT09IDEpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMTApIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPDwgNCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA+PiAyKVxuXHRcdFx0cHVzaCgodG1wID4+IDgpICYgMHhGRilcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRyZXR1cm4gYXJyXG5cdH1cblxuXHRmdW5jdGlvbiB1aW50OFRvQmFzZTY0ICh1aW50OCkge1xuXHRcdHZhciBpLFxuXHRcdFx0ZXh0cmFCeXRlcyA9IHVpbnQ4Lmxlbmd0aCAlIDMsIC8vIGlmIHdlIGhhdmUgMSBieXRlIGxlZnQsIHBhZCAyIGJ5dGVzXG5cdFx0XHRvdXRwdXQgPSBcIlwiLFxuXHRcdFx0dGVtcCwgbGVuZ3RoXG5cblx0XHRmdW5jdGlvbiBlbmNvZGUgKG51bSkge1xuXHRcdFx0cmV0dXJuIGxvb2t1cC5jaGFyQXQobnVtKVxuXHRcdH1cblxuXHRcdGZ1bmN0aW9uIHRyaXBsZXRUb0Jhc2U2NCAobnVtKSB7XG5cdFx0XHRyZXR1cm4gZW5jb2RlKG51bSA+PiAxOCAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiAxMiAmIDB4M0YpICsgZW5jb2RlKG51bSA+PiA2ICYgMHgzRikgKyBlbmNvZGUobnVtICYgMHgzRilcblx0XHR9XG5cblx0XHQvLyBnbyB0aHJvdWdoIHRoZSBhcnJheSBldmVyeSB0aHJlZSBieXRlcywgd2UnbGwgZGVhbCB3aXRoIHRyYWlsaW5nIHN0dWZmIGxhdGVyXG5cdFx0Zm9yIChpID0gMCwgbGVuZ3RoID0gdWludDgubGVuZ3RoIC0gZXh0cmFCeXRlczsgaSA8IGxlbmd0aDsgaSArPSAzKSB7XG5cdFx0XHR0ZW1wID0gKHVpbnQ4W2ldIDw8IDE2KSArICh1aW50OFtpICsgMV0gPDwgOCkgKyAodWludDhbaSArIDJdKVxuXHRcdFx0b3V0cHV0ICs9IHRyaXBsZXRUb0Jhc2U2NCh0ZW1wKVxuXHRcdH1cblxuXHRcdC8vIHBhZCB0aGUgZW5kIHdpdGggemVyb3MsIGJ1dCBtYWtlIHN1cmUgdG8gbm90IGZvcmdldCB0aGUgZXh0cmEgYnl0ZXNcblx0XHRzd2l0Y2ggKGV4dHJhQnl0ZXMpIHtcblx0XHRcdGNhc2UgMTpcblx0XHRcdFx0dGVtcCA9IHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAyKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9PSdcblx0XHRcdFx0YnJlYWtcblx0XHRcdGNhc2UgMjpcblx0XHRcdFx0dGVtcCA9ICh1aW50OFt1aW50OC5sZW5ndGggLSAyXSA8PCA4KSArICh1aW50OFt1aW50OC5sZW5ndGggLSAxXSlcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDEwKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wID4+IDQpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCAyKSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPSdcblx0XHRcdFx0YnJlYWtcblx0XHR9XG5cblx0XHRyZXR1cm4gb3V0cHV0XG5cdH1cblxuXHRleHBvcnRzLnRvQnl0ZUFycmF5ID0gYjY0VG9CeXRlQXJyYXlcblx0ZXhwb3J0cy5mcm9tQnl0ZUFycmF5ID0gdWludDhUb0Jhc2U2NFxufSh0eXBlb2YgZXhwb3J0cyA9PT0gJ3VuZGVmaW5lZCcgPyAodGhpcy5iYXNlNjRqcyA9IHt9KSA6IGV4cG9ydHMpKVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIkRGMXVyeFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanNcIixcIi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9saWJcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5leHBvcnRzLnJlYWQgPSBmdW5jdGlvbihidWZmZXIsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLFxuICAgICAgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMSxcbiAgICAgIGVNYXggPSAoMSA8PCBlTGVuKSAtIDEsXG4gICAgICBlQmlhcyA9IGVNYXggPj4gMSxcbiAgICAgIG5CaXRzID0gLTcsXG4gICAgICBpID0gaXNMRSA/IChuQnl0ZXMgLSAxKSA6IDAsXG4gICAgICBkID0gaXNMRSA/IC0xIDogMSxcbiAgICAgIHMgPSBidWZmZXJbb2Zmc2V0ICsgaV07XG5cbiAgaSArPSBkO1xuXG4gIGUgPSBzICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpO1xuICBzID4+PSAoLW5CaXRzKTtcbiAgbkJpdHMgKz0gZUxlbjtcbiAgZm9yICg7IG5CaXRzID4gMDsgZSA9IGUgKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCk7XG5cbiAgbSA9IGUgJiAoKDEgPDwgKC1uQml0cykpIC0gMSk7XG4gIGUgPj49ICgtbkJpdHMpO1xuICBuQml0cyArPSBtTGVuO1xuICBmb3IgKDsgbkJpdHMgPiAwOyBtID0gbSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KTtcblxuICBpZiAoZSA9PT0gMCkge1xuICAgIGUgPSAxIC0gZUJpYXM7XG4gIH0gZWxzZSBpZiAoZSA9PT0gZU1heCkge1xuICAgIHJldHVybiBtID8gTmFOIDogKChzID8gLTEgOiAxKSAqIEluZmluaXR5KTtcbiAgfSBlbHNlIHtcbiAgICBtID0gbSArIE1hdGgucG93KDIsIG1MZW4pO1xuICAgIGUgPSBlIC0gZUJpYXM7XG4gIH1cbiAgcmV0dXJuIChzID8gLTEgOiAxKSAqIG0gKiBNYXRoLnBvdygyLCBlIC0gbUxlbik7XG59O1xuXG5leHBvcnRzLndyaXRlID0gZnVuY3Rpb24oYnVmZmVyLCB2YWx1ZSwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sIGMsXG4gICAgICBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxLFxuICAgICAgZU1heCA9ICgxIDw8IGVMZW4pIC0gMSxcbiAgICAgIGVCaWFzID0gZU1heCA+PiAxLFxuICAgICAgcnQgPSAobUxlbiA9PT0gMjMgPyBNYXRoLnBvdygyLCAtMjQpIC0gTWF0aC5wb3coMiwgLTc3KSA6IDApLFxuICAgICAgaSA9IGlzTEUgPyAwIDogKG5CeXRlcyAtIDEpLFxuICAgICAgZCA9IGlzTEUgPyAxIDogLTEsXG4gICAgICBzID0gdmFsdWUgPCAwIHx8ICh2YWx1ZSA9PT0gMCAmJiAxIC8gdmFsdWUgPCAwKSA/IDEgOiAwO1xuXG4gIHZhbHVlID0gTWF0aC5hYnModmFsdWUpO1xuXG4gIGlmIChpc05hTih2YWx1ZSkgfHwgdmFsdWUgPT09IEluZmluaXR5KSB7XG4gICAgbSA9IGlzTmFOKHZhbHVlKSA/IDEgOiAwO1xuICAgIGUgPSBlTWF4O1xuICB9IGVsc2Uge1xuICAgIGUgPSBNYXRoLmZsb29yKE1hdGgubG9nKHZhbHVlKSAvIE1hdGguTE4yKTtcbiAgICBpZiAodmFsdWUgKiAoYyA9IE1hdGgucG93KDIsIC1lKSkgPCAxKSB7XG4gICAgICBlLS07XG4gICAgICBjICo9IDI7XG4gICAgfVxuICAgIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgdmFsdWUgKz0gcnQgLyBjO1xuICAgIH0gZWxzZSB7XG4gICAgICB2YWx1ZSArPSBydCAqIE1hdGgucG93KDIsIDEgLSBlQmlhcyk7XG4gICAgfVxuICAgIGlmICh2YWx1ZSAqIGMgPj0gMikge1xuICAgICAgZSsrO1xuICAgICAgYyAvPSAyO1xuICAgIH1cblxuICAgIGlmIChlICsgZUJpYXMgPj0gZU1heCkge1xuICAgICAgbSA9IDA7XG4gICAgICBlID0gZU1heDtcbiAgICB9IGVsc2UgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICBtID0gKHZhbHVlICogYyAtIDEpICogTWF0aC5wb3coMiwgbUxlbik7XG4gICAgICBlID0gZSArIGVCaWFzO1xuICAgIH0gZWxzZSB7XG4gICAgICBtID0gdmFsdWUgKiBNYXRoLnBvdygyLCBlQmlhcyAtIDEpICogTWF0aC5wb3coMiwgbUxlbik7XG4gICAgICBlID0gMDtcbiAgICB9XG4gIH1cblxuICBmb3IgKDsgbUxlbiA+PSA4OyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBtICYgMHhmZiwgaSArPSBkLCBtIC89IDI1NiwgbUxlbiAtPSA4KTtcblxuICBlID0gKGUgPDwgbUxlbikgfCBtO1xuICBlTGVuICs9IG1MZW47XG4gIGZvciAoOyBlTGVuID4gMDsgYnVmZmVyW29mZnNldCArIGldID0gZSAmIDB4ZmYsIGkgKz0gZCwgZSAvPSAyNTYsIGVMZW4gLT0gOCk7XG5cbiAgYnVmZmVyW29mZnNldCArIGkgLSBkXSB8PSBzICogMTI4O1xufTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJERjF1cnhcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2llZWU3NTQvaW5kZXguanNcIixcIi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2llZWU3NTRcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vLyBzaGltIGZvciB1c2luZyBwcm9jZXNzIGluIGJyb3dzZXJcblxudmFyIHByb2Nlc3MgPSBtb2R1bGUuZXhwb3J0cyA9IHt9O1xuXG5wcm9jZXNzLm5leHRUaWNrID0gKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgY2FuU2V0SW1tZWRpYXRlID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cuc2V0SW1tZWRpYXRlO1xuICAgIHZhciBjYW5Qb3N0ID0gdHlwZW9mIHdpbmRvdyAhPT0gJ3VuZGVmaW5lZCdcbiAgICAmJiB3aW5kb3cucG9zdE1lc3NhZ2UgJiYgd2luZG93LmFkZEV2ZW50TGlzdGVuZXJcbiAgICA7XG5cbiAgICBpZiAoY2FuU2V0SW1tZWRpYXRlKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoZikgeyByZXR1cm4gd2luZG93LnNldEltbWVkaWF0ZShmKSB9O1xuICAgIH1cblxuICAgIGlmIChjYW5Qb3N0KSB7XG4gICAgICAgIHZhciBxdWV1ZSA9IFtdO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIGZ1bmN0aW9uIChldikge1xuICAgICAgICAgICAgdmFyIHNvdXJjZSA9IGV2LnNvdXJjZTtcbiAgICAgICAgICAgIGlmICgoc291cmNlID09PSB3aW5kb3cgfHwgc291cmNlID09PSBudWxsKSAmJiBldi5kYXRhID09PSAncHJvY2Vzcy10aWNrJykge1xuICAgICAgICAgICAgICAgIGV2LnN0b3BQcm9wYWdhdGlvbigpO1xuICAgICAgICAgICAgICAgIGlmIChxdWV1ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBmbiA9IHF1ZXVlLnNoaWZ0KCk7XG4gICAgICAgICAgICAgICAgICAgIGZuKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9LCB0cnVlKTtcblxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgICAgIHF1ZXVlLnB1c2goZm4pO1xuICAgICAgICAgICAgd2luZG93LnBvc3RNZXNzYWdlKCdwcm9jZXNzLXRpY2snLCAnKicpO1xuICAgICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICBzZXRUaW1lb3V0KGZuLCAwKTtcbiAgICB9O1xufSkoKTtcblxucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59XG5cbi8vIFRPRE8oc2h0eWxtYW4pXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJERjF1cnhcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanNcIixcIi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzXCIpIl19
