(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
module.exports = function($scope) {
    $scope.testVar = 'We are up and running!';
};

}).call(this,require("DF1urx"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/controllers/main.js","/controllers")
},{"DF1urx":11,"buffer":8}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var PostCtrl = function($scope, $stateParams) {
    debugger;
    $scope.postId = $stateParams.postId;
};

module.exports = PostCtrl;


}).call(this,require("DF1urx"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/controllers/post.js","/controllers")
},{"DF1urx":11,"buffer":8}],3:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var PostsCtrl = function($scope, $http) {
    $http.get('api/posts').success(function(data) {
        $scope.posts = data;
    });
};

module.exports = PostsCtrl;

}).call(this,require("DF1urx"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/controllers/posts.js","/controllers")
},{"DF1urx":11,"buffer":8}],4:[function(require,module,exports){
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
        .state('posts.details', {
            url: "/:postId",
            template: "WUT? Why U No WORK?",
//            templateUrl: "views/post-form.html",
            controller: require('./controllers/post')
        })
});


}).call(this,require("DF1urx"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_e37a4c84.js","/")
},{"./controllers/main":1,"./controllers/post":2,"./controllers/posts":3,"DF1urx":11,"angular":6,"angular-ui-router":5,"buffer":8}],5:[function(require,module,exports){
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
},{"DF1urx":11,"buffer":8}],6:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
require('./lib/angular.min.js');

module.exports = angular;

}).call(this,require("DF1urx"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/../../../../node_modules/angular/index-browserify.js","/../../../../node_modules/angular")
},{"./lib/angular.min.js":7,"DF1urx":11,"buffer":8}],7:[function(require,module,exports){
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
},{"DF1urx":11,"buffer":8}],8:[function(require,module,exports){
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
},{"DF1urx":11,"base64-js":9,"buffer":8,"ieee754":10}],9:[function(require,module,exports){
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
},{"DF1urx":11,"buffer":8}],10:[function(require,module,exports){
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
},{"DF1urx":11,"buffer":8}],11:[function(require,module,exports){
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
},{"DF1urx":11,"buffer":8}]},{},[4])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvZXJpYy9Db2RlL1NoYXJlZC9hbmd1bGFyLXRlc3Qvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL2VyaWMvQ29kZS9TaGFyZWQvYW5ndWxhci10ZXN0L2FwcC9hc3NldHMvanMvYXBwL2NvbnRyb2xsZXJzL21haW4uanMiLCIvVXNlcnMvZXJpYy9Db2RlL1NoYXJlZC9hbmd1bGFyLXRlc3QvYXBwL2Fzc2V0cy9qcy9hcHAvY29udHJvbGxlcnMvcG9zdC5qcyIsIi9Vc2Vycy9lcmljL0NvZGUvU2hhcmVkL2FuZ3VsYXItdGVzdC9hcHAvYXNzZXRzL2pzL2FwcC9jb250cm9sbGVycy9wb3N0cy5qcyIsIi9Vc2Vycy9lcmljL0NvZGUvU2hhcmVkL2FuZ3VsYXItdGVzdC9hcHAvYXNzZXRzL2pzL2FwcC9mYWtlX2UzN2E0Yzg0LmpzIiwiL1VzZXJzL2VyaWMvQ29kZS9TaGFyZWQvYW5ndWxhci10ZXN0L25vZGVfbW9kdWxlcy9hbmd1bGFyLXVpLXJvdXRlci9yZWxlYXNlL2FuZ3VsYXItdWktcm91dGVyLmpzIiwiL1VzZXJzL2VyaWMvQ29kZS9TaGFyZWQvYW5ndWxhci10ZXN0L25vZGVfbW9kdWxlcy9hbmd1bGFyL2luZGV4LWJyb3dzZXJpZnkuanMiLCIvVXNlcnMvZXJpYy9Db2RlL1NoYXJlZC9hbmd1bGFyLXRlc3Qvbm9kZV9tb2R1bGVzL2FuZ3VsYXIvbGliL2FuZ3VsYXIubWluLmpzIiwiL1VzZXJzL2VyaWMvQ29kZS9TaGFyZWQvYW5ndWxhci10ZXN0L25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qcyIsIi9Vc2Vycy9lcmljL0NvZGUvU2hhcmVkL2FuZ3VsYXItdGVzdC9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9saWIvYjY0LmpzIiwiL1VzZXJzL2VyaWMvQ29kZS9TaGFyZWQvYW5ndWxhci10ZXN0L25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qcyIsIi9Vc2Vycy9lcmljL0NvZGUvU2hhcmVkL2FuZ3VsYXItdGVzdC9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeHBHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKX12YXIgZj1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwoZi5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxmLGYuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkc2NvcGUpIHtcbiAgICAkc2NvcGUudGVzdFZhciA9ICdXZSBhcmUgdXAgYW5kIHJ1bm5pbmchJztcbn07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiREYxdXJ4XCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvY29udHJvbGxlcnMvbWFpbi5qc1wiLFwiL2NvbnRyb2xsZXJzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xudmFyIFBvc3RDdHJsID0gZnVuY3Rpb24oJHNjb3BlLCAkc3RhdGVQYXJhbXMpIHtcbiAgICBkZWJ1Z2dlcjtcbiAgICAkc2NvcGUucG9zdElkID0gJHN0YXRlUGFyYW1zLnBvc3RJZDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gUG9zdEN0cmw7XG5cblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJERjF1cnhcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9jb250cm9sbGVycy9wb3N0LmpzXCIsXCIvY29udHJvbGxlcnNcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG52YXIgUG9zdHNDdHJsID0gZnVuY3Rpb24oJHNjb3BlLCAkaHR0cCkge1xuICAgICRodHRwLmdldCgnYXBpL3Bvc3RzJykuc3VjY2VzcyhmdW5jdGlvbihkYXRhKSB7XG4gICAgICAgICRzY29wZS5wb3N0cyA9IGRhdGE7XG4gICAgfSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBvc3RzQ3RybDtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJERjF1cnhcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi9jb250cm9sbGVycy9wb3N0cy5qc1wiLFwiL2NvbnRyb2xsZXJzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xucmVxdWlyZSgnYW5ndWxhcicpO1xudmFyIHJvdXRlciA9IHJlcXVpcmUoJ2FuZ3VsYXItdWktcm91dGVyJyk7XG5cbnZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgW3JvdXRlcl0pO1xuXG5hcHAuY29uZmlnKGZ1bmN0aW9uKCRzdGF0ZVByb3ZpZGVyLCAkdXJsUm91dGVyUHJvdmlkZXIpIHtcblxuICAgIC8vIEZvciBhbnkgdW5tYXRjaGVkIHVybCwgcmVkaXJlY3QgdG8gaG9tZSAvXG4gICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZShcIi9cIik7XG5cbiAgICAvLyBOb3cgc2V0IHVwIHRoZSBzdGF0ZXNcbiAgICAkc3RhdGVQcm92aWRlclxuICAgICAgICAuc3RhdGUoJ2hvbWUnLCB7XG4gICAgICAgICAgICB1cmw6IFwiL1wiLFxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICd2aWV3cy9ob21lLmh0bWwnLFxuICAgICAgICAgICAgY29udHJvbGxlcjogcmVxdWlyZSgnLi9jb250cm9sbGVycy9tYWluJylcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdwb3N0cycsIHtcbiAgICAgICAgICAgIHVybDogXCIvcG9zdHNcIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3Bvc3RzLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4vY29udHJvbGxlcnMvcG9zdHMnKVxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ3Bvc3RzLmRldGFpbHMnLCB7XG4gICAgICAgICAgICB1cmw6IFwiLzpwb3N0SWRcIixcbiAgICAgICAgICAgIHRlbXBsYXRlOiBcIldVVD8gV2h5IFUgTm8gV09SSz9cIixcbi8vICAgICAgICAgICAgdGVtcGxhdGVVcmw6IFwidmlld3MvcG9zdC1mb3JtLmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4vY29udHJvbGxlcnMvcG9zdCcpXG4gICAgICAgIH0pXG59KTtcblxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIkRGMXVyeFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL2Zha2VfZTM3YTRjODQuanNcIixcIi9cIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKipcbiAqIFN0YXRlLWJhc2VkIHJvdXRpbmcgZm9yIEFuZ3VsYXJKU1xuICogQHZlcnNpb24gdjAuMi4xMFxuICogQGxpbmsgaHR0cDovL2FuZ3VsYXItdWkuZ2l0aHViLmNvbS9cbiAqIEBsaWNlbnNlIE1JVCBMaWNlbnNlLCBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL01JVFxuICovXG5cbi8qIGNvbW1vbmpzIHBhY2thZ2UgbWFuYWdlciBzdXBwb3J0IChlZyBjb21wb25lbnRqcykgKi9cbmlmICh0eXBlb2YgbW9kdWxlICE9PSBcInVuZGVmaW5lZFwiICYmIHR5cGVvZiBleHBvcnRzICE9PSBcInVuZGVmaW5lZFwiICYmIG1vZHVsZS5leHBvcnRzID09PSBleHBvcnRzKXtcbiAgbW9kdWxlLmV4cG9ydHMgPSAndWkucm91dGVyJztcbn1cblxuKGZ1bmN0aW9uICh3aW5kb3csIGFuZ3VsYXIsIHVuZGVmaW5lZCkge1xuLypqc2hpbnQgZ2xvYmFsc3RyaWN0OnRydWUqL1xuLypnbG9iYWwgYW5ndWxhcjpmYWxzZSovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBpc0RlZmluZWQgPSBhbmd1bGFyLmlzRGVmaW5lZCxcbiAgICBpc0Z1bmN0aW9uID0gYW5ndWxhci5pc0Z1bmN0aW9uLFxuICAgIGlzU3RyaW5nID0gYW5ndWxhci5pc1N0cmluZyxcbiAgICBpc09iamVjdCA9IGFuZ3VsYXIuaXNPYmplY3QsXG4gICAgaXNBcnJheSA9IGFuZ3VsYXIuaXNBcnJheSxcbiAgICBmb3JFYWNoID0gYW5ndWxhci5mb3JFYWNoLFxuICAgIGV4dGVuZCA9IGFuZ3VsYXIuZXh0ZW5kLFxuICAgIGNvcHkgPSBhbmd1bGFyLmNvcHk7XG5cbmZ1bmN0aW9uIGluaGVyaXQocGFyZW50LCBleHRyYSkge1xuICByZXR1cm4gZXh0ZW5kKG5ldyAoZXh0ZW5kKGZ1bmN0aW9uKCkge30sIHsgcHJvdG90eXBlOiBwYXJlbnQgfSkpKCksIGV4dHJhKTtcbn1cblxuZnVuY3Rpb24gbWVyZ2UoZHN0KSB7XG4gIGZvckVhY2goYXJndW1lbnRzLCBmdW5jdGlvbihvYmopIHtcbiAgICBpZiAob2JqICE9PSBkc3QpIHtcbiAgICAgIGZvckVhY2gob2JqLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIGlmICghZHN0Lmhhc093blByb3BlcnR5KGtleSkpIGRzdFtrZXldID0gdmFsdWU7XG4gICAgICB9KTtcbiAgICB9XG4gIH0pO1xuICByZXR1cm4gZHN0O1xufVxuXG4vKipcbiAqIEZpbmRzIHRoZSBjb21tb24gYW5jZXN0b3IgcGF0aCBiZXR3ZWVuIHR3byBzdGF0ZXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGZpcnN0IFRoZSBmaXJzdCBzdGF0ZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSBzZWNvbmQgVGhlIHNlY29uZCBzdGF0ZS5cbiAqIEByZXR1cm4ge0FycmF5fSBSZXR1cm5zIGFuIGFycmF5IG9mIHN0YXRlIG5hbWVzIGluIGRlc2NlbmRpbmcgb3JkZXIsIG5vdCBpbmNsdWRpbmcgdGhlIHJvb3QuXG4gKi9cbmZ1bmN0aW9uIGFuY2VzdG9ycyhmaXJzdCwgc2Vjb25kKSB7XG4gIHZhciBwYXRoID0gW107XG5cbiAgZm9yICh2YXIgbiBpbiBmaXJzdC5wYXRoKSB7XG4gICAgaWYgKGZpcnN0LnBhdGhbbl0gIT09IHNlY29uZC5wYXRoW25dKSBicmVhaztcbiAgICBwYXRoLnB1c2goZmlyc3QucGF0aFtuXSk7XG4gIH1cbiAgcmV0dXJuIHBhdGg7XG59XG5cbi8qKlxuICogSUU4LXNhZmUgd3JhcHBlciBmb3IgYE9iamVjdC5rZXlzKClgLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgQSBKYXZhU2NyaXB0IG9iamVjdC5cbiAqIEByZXR1cm4ge0FycmF5fSBSZXR1cm5zIHRoZSBrZXlzIG9mIHRoZSBvYmplY3QgYXMgYW4gYXJyYXkuXG4gKi9cbmZ1bmN0aW9uIGtleXMob2JqZWN0KSB7XG4gIGlmIChPYmplY3Qua2V5cykge1xuICAgIHJldHVybiBPYmplY3Qua2V5cyhvYmplY3QpO1xuICB9XG4gIHZhciByZXN1bHQgPSBbXTtcblxuICBhbmd1bGFyLmZvckVhY2gob2JqZWN0LCBmdW5jdGlvbih2YWwsIGtleSkge1xuICAgIHJlc3VsdC5wdXNoKGtleSk7XG4gIH0pO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG4vKipcbiAqIElFOC1zYWZlIHdyYXBwZXIgZm9yIGBBcnJheS5wcm90b3R5cGUuaW5kZXhPZigpYC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBhcnJheSBBIEphdmFTY3JpcHQgYXJyYXkuXG4gKiBAcGFyYW0geyp9IHZhbHVlIEEgdmFsdWUgdG8gc2VhcmNoIHRoZSBhcnJheSBmb3IuXG4gKiBAcmV0dXJuIHtOdW1iZXJ9IFJldHVybnMgdGhlIGFycmF5IGluZGV4IHZhbHVlIG9mIGB2YWx1ZWAsIG9yIGAtMWAgaWYgbm90IHByZXNlbnQuXG4gKi9cbmZ1bmN0aW9uIGFycmF5U2VhcmNoKGFycmF5LCB2YWx1ZSkge1xuICBpZiAoQXJyYXkucHJvdG90eXBlLmluZGV4T2YpIHtcbiAgICByZXR1cm4gYXJyYXkuaW5kZXhPZih2YWx1ZSwgTnVtYmVyKGFyZ3VtZW50c1syXSkgfHwgMCk7XG4gIH1cbiAgdmFyIGxlbiA9IGFycmF5Lmxlbmd0aCA+Pj4gMCwgZnJvbSA9IE51bWJlcihhcmd1bWVudHNbMl0pIHx8IDA7XG4gIGZyb20gPSAoZnJvbSA8IDApID8gTWF0aC5jZWlsKGZyb20pIDogTWF0aC5mbG9vcihmcm9tKTtcblxuICBpZiAoZnJvbSA8IDApIGZyb20gKz0gbGVuO1xuXG4gIGZvciAoOyBmcm9tIDwgbGVuOyBmcm9tKyspIHtcbiAgICBpZiAoZnJvbSBpbiBhcnJheSAmJiBhcnJheVtmcm9tXSA9PT0gdmFsdWUpIHJldHVybiBmcm9tO1xuICB9XG4gIHJldHVybiAtMTtcbn1cblxuLyoqXG4gKiBNZXJnZXMgYSBzZXQgb2YgcGFyYW1ldGVycyB3aXRoIGFsbCBwYXJhbWV0ZXJzIGluaGVyaXRlZCBiZXR3ZWVuIHRoZSBjb21tb24gcGFyZW50cyBvZiB0aGVcbiAqIGN1cnJlbnQgc3RhdGUgYW5kIGEgZ2l2ZW4gZGVzdGluYXRpb24gc3RhdGUuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGN1cnJlbnRQYXJhbXMgVGhlIHZhbHVlIG9mIHRoZSBjdXJyZW50IHN0YXRlIHBhcmFtZXRlcnMgKCRzdGF0ZVBhcmFtcykuXG4gKiBAcGFyYW0ge09iamVjdH0gbmV3UGFyYW1zIFRoZSBzZXQgb2YgcGFyYW1ldGVycyB3aGljaCB3aWxsIGJlIGNvbXBvc2l0ZWQgd2l0aCBpbmhlcml0ZWQgcGFyYW1zLlxuICogQHBhcmFtIHtPYmplY3R9ICRjdXJyZW50IEludGVybmFsIGRlZmluaXRpb24gb2Ygb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgY3VycmVudCBzdGF0ZS5cbiAqIEBwYXJhbSB7T2JqZWN0fSAkdG8gSW50ZXJuYWwgZGVmaW5pdGlvbiBvZiBvYmplY3QgcmVwcmVzZW50aW5nIHN0YXRlIHRvIHRyYW5zaXRpb24gdG8uXG4gKi9cbmZ1bmN0aW9uIGluaGVyaXRQYXJhbXMoY3VycmVudFBhcmFtcywgbmV3UGFyYW1zLCAkY3VycmVudCwgJHRvKSB7XG4gIHZhciBwYXJlbnRzID0gYW5jZXN0b3JzKCRjdXJyZW50LCAkdG8pLCBwYXJlbnRQYXJhbXMsIGluaGVyaXRlZCA9IHt9LCBpbmhlcml0TGlzdCA9IFtdO1xuXG4gIGZvciAodmFyIGkgaW4gcGFyZW50cykge1xuICAgIGlmICghcGFyZW50c1tpXS5wYXJhbXMgfHwgIXBhcmVudHNbaV0ucGFyYW1zLmxlbmd0aCkgY29udGludWU7XG4gICAgcGFyZW50UGFyYW1zID0gcGFyZW50c1tpXS5wYXJhbXM7XG5cbiAgICBmb3IgKHZhciBqIGluIHBhcmVudFBhcmFtcykge1xuICAgICAgaWYgKGFycmF5U2VhcmNoKGluaGVyaXRMaXN0LCBwYXJlbnRQYXJhbXNbal0pID49IDApIGNvbnRpbnVlO1xuICAgICAgaW5oZXJpdExpc3QucHVzaChwYXJlbnRQYXJhbXNbal0pO1xuICAgICAgaW5oZXJpdGVkW3BhcmVudFBhcmFtc1tqXV0gPSBjdXJyZW50UGFyYW1zW3BhcmVudFBhcmFtc1tqXV07XG4gICAgfVxuICB9XG4gIHJldHVybiBleHRlbmQoe30sIGluaGVyaXRlZCwgbmV3UGFyYW1zKTtcbn1cblxuLyoqXG4gKiBOb3JtYWxpemVzIGEgc2V0IG9mIHZhbHVlcyB0byBzdHJpbmcgb3IgYG51bGxgLCBmaWx0ZXJpbmcgdGhlbSBieSBhIGxpc3Qgb2Yga2V5cy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBrZXlzIFRoZSBsaXN0IG9mIGtleXMgdG8gbm9ybWFsaXplL3JldHVybi5cbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZXMgQW4gb2JqZWN0IGhhc2ggb2YgdmFsdWVzIHRvIG5vcm1hbGl6ZS5cbiAqIEByZXR1cm4ge09iamVjdH0gUmV0dXJucyBhbiBvYmplY3QgaGFzaCBvZiBub3JtYWxpemVkIHN0cmluZyB2YWx1ZXMuXG4gKi9cbmZ1bmN0aW9uIG5vcm1hbGl6ZShrZXlzLCB2YWx1ZXMpIHtcbiAgdmFyIG5vcm1hbGl6ZWQgPSB7fTtcblxuICBmb3JFYWNoKGtleXMsIGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdmFyIHZhbHVlID0gdmFsdWVzW25hbWVdO1xuICAgIG5vcm1hbGl6ZWRbbmFtZV0gPSAodmFsdWUgIT0gbnVsbCkgPyBTdHJpbmcodmFsdWUpIDogbnVsbDtcbiAgfSk7XG4gIHJldHVybiBub3JtYWxpemVkO1xufVxuXG4vKipcbiAqIFBlcmZvcm1zIGEgbm9uLXN0cmljdCBjb21wYXJpc29uIG9mIHRoZSBzdWJzZXQgb2YgdHdvIG9iamVjdHMsIGRlZmluZWQgYnkgYSBsaXN0IG9mIGtleXMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGEgVGhlIGZpcnN0IG9iamVjdC5cbiAqIEBwYXJhbSB7T2JqZWN0fSBiIFRoZSBzZWNvbmQgb2JqZWN0LlxuICogQHBhcmFtIHtBcnJheX0ga2V5cyBUaGUgbGlzdCBvZiBrZXlzIHdpdGhpbiBlYWNoIG9iamVjdCB0byBjb21wYXJlLiBJZiB0aGUgbGlzdCBpcyBlbXB0eSBvciBub3Qgc3BlY2lmaWVkLFxuICogICAgICAgICAgICAgICAgICAgICBpdCBkZWZhdWx0cyB0byB0aGUgbGlzdCBvZiBrZXlzIGluIGBhYC5cbiAqIEByZXR1cm4ge0Jvb2xlYW59IFJldHVybnMgYHRydWVgIGlmIHRoZSBrZXlzIG1hdGNoLCBvdGhlcndpc2UgYGZhbHNlYC5cbiAqL1xuZnVuY3Rpb24gZXF1YWxGb3JLZXlzKGEsIGIsIGtleXMpIHtcbiAgaWYgKCFrZXlzKSB7XG4gICAga2V5cyA9IFtdO1xuICAgIGZvciAodmFyIG4gaW4gYSkga2V5cy5wdXNoKG4pOyAvLyBVc2VkIGluc3RlYWQgb2YgT2JqZWN0LmtleXMoKSBmb3IgSUU4IGNvbXBhdGliaWxpdHlcbiAgfVxuXG4gIGZvciAodmFyIGk9MDsgaTxrZXlzLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGsgPSBrZXlzW2ldO1xuICAgIGlmIChhW2tdICE9IGJba10pIHJldHVybiBmYWxzZTsgLy8gTm90ICc9PT0nLCB2YWx1ZXMgYXJlbid0IG5lY2Vzc2FyaWx5IG5vcm1hbGl6ZWRcbiAgfVxuICByZXR1cm4gdHJ1ZTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBzdWJzZXQgb2YgYW4gb2JqZWN0LCBiYXNlZCBvbiBhIGxpc3Qgb2Yga2V5cy5cbiAqXG4gKiBAcGFyYW0ge0FycmF5fSBrZXlzXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsdWVzXG4gKiBAcmV0dXJuIHtCb29sZWFufSBSZXR1cm5zIGEgc3Vic2V0IG9mIGB2YWx1ZXNgLlxuICovXG5mdW5jdGlvbiBmaWx0ZXJCeUtleXMoa2V5cywgdmFsdWVzKSB7XG4gIHZhciBmaWx0ZXJlZCA9IHt9O1xuXG4gIGZvckVhY2goa2V5cywgZnVuY3Rpb24gKG5hbWUpIHtcbiAgICBmaWx0ZXJlZFtuYW1lXSA9IHZhbHVlc1tuYW1lXTtcbiAgfSk7XG4gIHJldHVybiBmaWx0ZXJlZDtcbn1cbi8qKlxuICogQG5nZG9jIG92ZXJ2aWV3XG4gKiBAbmFtZSB1aS5yb3V0ZXIudXRpbFxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogIyB1aS5yb3V0ZXIudXRpbCBzdWItbW9kdWxlXG4gKlxuICogVGhpcyBtb2R1bGUgaXMgYSBkZXBlbmRlbmN5IG9mIG90aGVyIHN1Yi1tb2R1bGVzLiBEbyBub3QgaW5jbHVkZSB0aGlzIG1vZHVsZSBhcyBhIGRlcGVuZGVuY3lcbiAqIGluIHlvdXIgYW5ndWxhciBhcHAgKHVzZSB7QGxpbmsgdWkucm91dGVyfSBtb2R1bGUgaW5zdGVhZCkuXG4gKlxuICovXG5hbmd1bGFyLm1vZHVsZSgndWkucm91dGVyLnV0aWwnLCBbJ25nJ10pO1xuXG4vKipcbiAqIEBuZ2RvYyBvdmVydmlld1xuICogQG5hbWUgdWkucm91dGVyLnJvdXRlclxuICogXG4gKiBAcmVxdWlyZXMgdWkucm91dGVyLnV0aWxcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqICMgdWkucm91dGVyLnJvdXRlciBzdWItbW9kdWxlXG4gKlxuICogVGhpcyBtb2R1bGUgaXMgYSBkZXBlbmRlbmN5IG9mIG90aGVyIHN1Yi1tb2R1bGVzLiBEbyBub3QgaW5jbHVkZSB0aGlzIG1vZHVsZSBhcyBhIGRlcGVuZGVuY3lcbiAqIGluIHlvdXIgYW5ndWxhciBhcHAgKHVzZSB7QGxpbmsgdWkucm91dGVyfSBtb2R1bGUgaW5zdGVhZCkuXG4gKi9cbmFuZ3VsYXIubW9kdWxlKCd1aS5yb3V0ZXIucm91dGVyJywgWyd1aS5yb3V0ZXIudXRpbCddKTtcblxuLyoqXG4gKiBAbmdkb2Mgb3ZlcnZpZXdcbiAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZVxuICogXG4gKiBAcmVxdWlyZXMgdWkucm91dGVyLnJvdXRlclxuICogQHJlcXVpcmVzIHVpLnJvdXRlci51dGlsXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiAjIHVpLnJvdXRlci5zdGF0ZSBzdWItbW9kdWxlXG4gKlxuICogVGhpcyBtb2R1bGUgaXMgYSBkZXBlbmRlbmN5IG9mIHRoZSBtYWluIHVpLnJvdXRlciBtb2R1bGUuIERvIG5vdCBpbmNsdWRlIHRoaXMgbW9kdWxlIGFzIGEgZGVwZW5kZW5jeVxuICogaW4geW91ciBhbmd1bGFyIGFwcCAodXNlIHtAbGluayB1aS5yb3V0ZXJ9IG1vZHVsZSBpbnN0ZWFkKS5cbiAqIFxuICovXG5hbmd1bGFyLm1vZHVsZSgndWkucm91dGVyLnN0YXRlJywgWyd1aS5yb3V0ZXIucm91dGVyJywgJ3VpLnJvdXRlci51dGlsJ10pO1xuXG4vKipcbiAqIEBuZ2RvYyBvdmVydmlld1xuICogQG5hbWUgdWkucm91dGVyXG4gKlxuICogQHJlcXVpcmVzIHVpLnJvdXRlci5zdGF0ZVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogIyB1aS5yb3V0ZXJcbiAqIFxuICogIyMgVGhlIG1haW4gbW9kdWxlIGZvciB1aS5yb3V0ZXIgXG4gKiBUaGVyZSBhcmUgc2V2ZXJhbCBzdWItbW9kdWxlcyBpbmNsdWRlZCB3aXRoIHRoZSB1aS5yb3V0ZXIgbW9kdWxlLCBob3dldmVyIG9ubHkgdGhpcyBtb2R1bGUgaXMgbmVlZGVkXG4gKiBhcyBhIGRlcGVuZGVuY3kgd2l0aGluIHlvdXIgYW5ndWxhciBhcHAuIFRoZSBvdGhlciBtb2R1bGVzIGFyZSBmb3Igb3JnYW5pemF0aW9uIHB1cnBvc2VzLiBcbiAqXG4gKiBUaGUgbW9kdWxlcyBhcmU6XG4gKiAqIHVpLnJvdXRlciAtIHRoZSBtYWluIFwidW1icmVsbGFcIiBtb2R1bGVcbiAqICogdWkucm91dGVyLnJvdXRlciAtIFxuICogXG4gKiAqWW91J2xsIG5lZWQgdG8gaW5jbHVkZSAqKm9ubHkqKiB0aGlzIG1vZHVsZSBhcyB0aGUgZGVwZW5kZW5jeSB3aXRoaW4geW91ciBhbmd1bGFyIGFwcC4qXG4gKiBcbiAqIDxwcmU+XG4gKiA8IWRvY3R5cGUgaHRtbD5cbiAqIDxodG1sIG5nLWFwcD1cIm15QXBwXCI+XG4gKiA8aGVhZD5cbiAqICAgPHNjcmlwdCBzcmM9XCJqcy9hbmd1bGFyLmpzXCI+PC9zY3JpcHQ+XG4gKiAgIDwhLS0gSW5jbHVkZSB0aGUgdWktcm91dGVyIHNjcmlwdCAtLT5cbiAqICAgPHNjcmlwdCBzcmM9XCJqcy9hbmd1bGFyLXVpLXJvdXRlci5taW4uanNcIj48L3NjcmlwdD5cbiAqICAgPHNjcmlwdD5cbiAqICAgICAvLyAuLi5hbmQgYWRkICd1aS5yb3V0ZXInIGFzIGEgZGVwZW5kZW5jeVxuICogICAgIHZhciBteUFwcCA9IGFuZ3VsYXIubW9kdWxlKCdteUFwcCcsIFsndWkucm91dGVyJ10pO1xuICogICA8L3NjcmlwdD5cbiAqIDwvaGVhZD5cbiAqIDxib2R5PlxuICogPC9ib2R5PlxuICogPC9odG1sPlxuICogPC9wcmU+XG4gKi9cbmFuZ3VsYXIubW9kdWxlKCd1aS5yb3V0ZXInLCBbJ3VpLnJvdXRlci5zdGF0ZSddKTtcblxuYW5ndWxhci5tb2R1bGUoJ3VpLnJvdXRlci5jb21wYXQnLCBbJ3VpLnJvdXRlciddKTtcblxuLyoqXG4gKiBAbmdkb2Mgb2JqZWN0XG4gKiBAbmFtZSB1aS5yb3V0ZXIudXRpbC4kcmVzb2x2ZVxuICpcbiAqIEByZXF1aXJlcyAkcVxuICogQHJlcXVpcmVzICRpbmplY3RvclxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogTWFuYWdlcyByZXNvbHV0aW9uIG9mIChhY3ljbGljKSBncmFwaHMgb2YgcHJvbWlzZXMuXG4gKi9cbiRSZXNvbHZlLiRpbmplY3QgPSBbJyRxJywgJyRpbmplY3RvciddO1xuZnVuY3Rpb24gJFJlc29sdmUoICAkcSwgICAgJGluamVjdG9yKSB7XG4gIFxuICB2YXIgVklTSVRfSU5fUFJPR1JFU1MgPSAxLFxuICAgICAgVklTSVRfRE9ORSA9IDIsXG4gICAgICBOT1RISU5HID0ge30sXG4gICAgICBOT19ERVBFTkRFTkNJRVMgPSBbXSxcbiAgICAgIE5PX0xPQ0FMUyA9IE5PVEhJTkcsXG4gICAgICBOT19QQVJFTlQgPSBleHRlbmQoJHEud2hlbihOT1RISU5HKSwgeyAkJHByb21pc2VzOiBOT1RISU5HLCAkJHZhbHVlczogTk9USElORyB9KTtcbiAgXG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgKiBAbmFtZSB1aS5yb3V0ZXIudXRpbC4kcmVzb2x2ZSNzdHVkeVxuICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnV0aWwuJHJlc29sdmVcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFN0dWRpZXMgYSBzZXQgb2YgaW52b2NhYmxlcyB0aGF0IGFyZSBsaWtlbHkgdG8gYmUgdXNlZCBtdWx0aXBsZSB0aW1lcy5cbiAgICogPHByZT5cbiAgICogJHJlc29sdmUuc3R1ZHkoaW52b2NhYmxlcykobG9jYWxzLCBwYXJlbnQsIHNlbGYpXG4gICAqIDwvcHJlPlxuICAgKiBpcyBlcXVpdmFsZW50IHRvXG4gICAqIDxwcmU+XG4gICAqICRyZXNvbHZlLnJlc29sdmUoaW52b2NhYmxlcywgbG9jYWxzLCBwYXJlbnQsIHNlbGYpXG4gICAqIDwvcHJlPlxuICAgKiBidXQgdGhlIGZvcm1lciBpcyBtb3JlIGVmZmljaWVudCAoaW4gZmFjdCBgcmVzb2x2ZWAganVzdCBjYWxscyBgc3R1ZHlgIFxuICAgKiBpbnRlcm5hbGx5KS5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGludm9jYWJsZXMgSW52b2NhYmxlIG9iamVjdHNcbiAgICogQHJldHVybiB7ZnVuY3Rpb259IGEgZnVuY3Rpb24gdG8gcGFzcyBpbiBsb2NhbHMsIHBhcmVudCBhbmQgc2VsZlxuICAgKi9cbiAgdGhpcy5zdHVkeSA9IGZ1bmN0aW9uIChpbnZvY2FibGVzKSB7XG4gICAgaWYgKCFpc09iamVjdChpbnZvY2FibGVzKSkgdGhyb3cgbmV3IEVycm9yKFwiJ2ludm9jYWJsZXMnIG11c3QgYmUgYW4gb2JqZWN0XCIpO1xuICAgIFxuICAgIC8vIFBlcmZvcm0gYSB0b3BvbG9naWNhbCBzb3J0IG9mIGludm9jYWJsZXMgdG8gYnVpbGQgYW4gb3JkZXJlZCBwbGFuXG4gICAgdmFyIHBsYW4gPSBbXSwgY3ljbGUgPSBbXSwgdmlzaXRlZCA9IHt9O1xuICAgIGZ1bmN0aW9uIHZpc2l0KHZhbHVlLCBrZXkpIHtcbiAgICAgIGlmICh2aXNpdGVkW2tleV0gPT09IFZJU0lUX0RPTkUpIHJldHVybjtcbiAgICAgIFxuICAgICAgY3ljbGUucHVzaChrZXkpO1xuICAgICAgaWYgKHZpc2l0ZWRba2V5XSA9PT0gVklTSVRfSU5fUFJPR1JFU1MpIHtcbiAgICAgICAgY3ljbGUuc3BsaWNlKDAsIGN5Y2xlLmluZGV4T2Yoa2V5KSk7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkN5Y2xpYyBkZXBlbmRlbmN5OiBcIiArIGN5Y2xlLmpvaW4oXCIgLT4gXCIpKTtcbiAgICAgIH1cbiAgICAgIHZpc2l0ZWRba2V5XSA9IFZJU0lUX0lOX1BST0dSRVNTO1xuICAgICAgXG4gICAgICBpZiAoaXNTdHJpbmcodmFsdWUpKSB7XG4gICAgICAgIHBsYW4ucHVzaChrZXksIFsgZnVuY3Rpb24oKSB7IHJldHVybiAkaW5qZWN0b3IuZ2V0KHZhbHVlKTsgfV0sIE5PX0RFUEVOREVOQ0lFUyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgcGFyYW1zID0gJGluamVjdG9yLmFubm90YXRlKHZhbHVlKTtcbiAgICAgICAgZm9yRWFjaChwYXJhbXMsIGZ1bmN0aW9uIChwYXJhbSkge1xuICAgICAgICAgIGlmIChwYXJhbSAhPT0ga2V5ICYmIGludm9jYWJsZXMuaGFzT3duUHJvcGVydHkocGFyYW0pKSB2aXNpdChpbnZvY2FibGVzW3BhcmFtXSwgcGFyYW0pO1xuICAgICAgICB9KTtcbiAgICAgICAgcGxhbi5wdXNoKGtleSwgdmFsdWUsIHBhcmFtcyk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGN5Y2xlLnBvcCgpO1xuICAgICAgdmlzaXRlZFtrZXldID0gVklTSVRfRE9ORTtcbiAgICB9XG4gICAgZm9yRWFjaChpbnZvY2FibGVzLCB2aXNpdCk7XG4gICAgaW52b2NhYmxlcyA9IGN5Y2xlID0gdmlzaXRlZCA9IG51bGw7IC8vIHBsYW4gaXMgYWxsIHRoYXQncyByZXF1aXJlZFxuICAgIFxuICAgIGZ1bmN0aW9uIGlzUmVzb2x2ZSh2YWx1ZSkge1xuICAgICAgcmV0dXJuIGlzT2JqZWN0KHZhbHVlKSAmJiB2YWx1ZS50aGVuICYmIHZhbHVlLiQkcHJvbWlzZXM7XG4gICAgfVxuICAgIFxuICAgIHJldHVybiBmdW5jdGlvbiAobG9jYWxzLCBwYXJlbnQsIHNlbGYpIHtcbiAgICAgIGlmIChpc1Jlc29sdmUobG9jYWxzKSAmJiBzZWxmID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgc2VsZiA9IHBhcmVudDsgcGFyZW50ID0gbG9jYWxzOyBsb2NhbHMgPSBudWxsO1xuICAgICAgfVxuICAgICAgaWYgKCFsb2NhbHMpIGxvY2FscyA9IE5PX0xPQ0FMUztcbiAgICAgIGVsc2UgaWYgKCFpc09iamVjdChsb2NhbHMpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIidsb2NhbHMnIG11c3QgYmUgYW4gb2JqZWN0XCIpO1xuICAgICAgfSAgICAgICBcbiAgICAgIGlmICghcGFyZW50KSBwYXJlbnQgPSBOT19QQVJFTlQ7XG4gICAgICBlbHNlIGlmICghaXNSZXNvbHZlKHBhcmVudCkpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiJ3BhcmVudCcgbXVzdCBiZSBhIHByb21pc2UgcmV0dXJuZWQgYnkgJHJlc29sdmUucmVzb2x2ZSgpXCIpO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBUbyBjb21wbGV0ZSB0aGUgb3ZlcmFsbCByZXNvbHV0aW9uLCB3ZSBoYXZlIHRvIHdhaXQgZm9yIHRoZSBwYXJlbnRcbiAgICAgIC8vIHByb21pc2UgYW5kIGZvciB0aGUgcHJvbWlzZSBmb3IgZWFjaCBpbnZva2FibGUgaW4gb3VyIHBsYW4uXG4gICAgICB2YXIgcmVzb2x1dGlvbiA9ICRxLmRlZmVyKCksXG4gICAgICAgICAgcmVzdWx0ID0gcmVzb2x1dGlvbi5wcm9taXNlLFxuICAgICAgICAgIHByb21pc2VzID0gcmVzdWx0LiQkcHJvbWlzZXMgPSB7fSxcbiAgICAgICAgICB2YWx1ZXMgPSBleHRlbmQoe30sIGxvY2FscyksXG4gICAgICAgICAgd2FpdCA9IDEgKyBwbGFuLmxlbmd0aC8zLFxuICAgICAgICAgIG1lcmdlZCA9IGZhbHNlO1xuICAgICAgICAgIFxuICAgICAgZnVuY3Rpb24gZG9uZSgpIHtcbiAgICAgICAgLy8gTWVyZ2UgcGFyZW50IHZhbHVlcyB3ZSBoYXZlbid0IGdvdCB5ZXQgYW5kIHB1Ymxpc2ggb3VyIG93biAkJHZhbHVlc1xuICAgICAgICBpZiAoIS0td2FpdCkge1xuICAgICAgICAgIGlmICghbWVyZ2VkKSBtZXJnZSh2YWx1ZXMsIHBhcmVudC4kJHZhbHVlcyk7IFxuICAgICAgICAgIHJlc3VsdC4kJHZhbHVlcyA9IHZhbHVlcztcbiAgICAgICAgICByZXN1bHQuJCRwcm9taXNlcyA9IHRydWU7IC8vIGtlZXAgZm9yIGlzUmVzb2x2ZSgpXG4gICAgICAgICAgcmVzb2x1dGlvbi5yZXNvbHZlKHZhbHVlcyk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIFxuICAgICAgZnVuY3Rpb24gZmFpbChyZWFzb24pIHtcbiAgICAgICAgcmVzdWx0LiQkZmFpbHVyZSA9IHJlYXNvbjtcbiAgICAgICAgcmVzb2x1dGlvbi5yZWplY3QocmVhc29uKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gU2hvcnQtY2lyY3VpdCBpZiBwYXJlbnQgaGFzIGFscmVhZHkgZmFpbGVkXG4gICAgICBpZiAoaXNEZWZpbmVkKHBhcmVudC4kJGZhaWx1cmUpKSB7XG4gICAgICAgIGZhaWwocGFyZW50LiQkZmFpbHVyZSk7XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIE1lcmdlIHBhcmVudCB2YWx1ZXMgaWYgdGhlIHBhcmVudCBoYXMgYWxyZWFkeSByZXNvbHZlZCwgb3IgbWVyZ2VcbiAgICAgIC8vIHBhcmVudCBwcm9taXNlcyBhbmQgd2FpdCBpZiB0aGUgcGFyZW50IHJlc29sdmUgaXMgc3RpbGwgaW4gcHJvZ3Jlc3MuXG4gICAgICBpZiAocGFyZW50LiQkdmFsdWVzKSB7XG4gICAgICAgIG1lcmdlZCA9IG1lcmdlKHZhbHVlcywgcGFyZW50LiQkdmFsdWVzKTtcbiAgICAgICAgZG9uZSgpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXh0ZW5kKHByb21pc2VzLCBwYXJlbnQuJCRwcm9taXNlcyk7XG4gICAgICAgIHBhcmVudC50aGVuKGRvbmUsIGZhaWwpO1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBQcm9jZXNzIGVhY2ggaW52b2NhYmxlIGluIHRoZSBwbGFuLCBidXQgaWdub3JlIGFueSB3aGVyZSBhIGxvY2FsIG9mIHRoZSBzYW1lIG5hbWUgZXhpc3RzLlxuICAgICAgZm9yICh2YXIgaT0wLCBpaT1wbGFuLmxlbmd0aDsgaTxpaTsgaSs9Mykge1xuICAgICAgICBpZiAobG9jYWxzLmhhc093blByb3BlcnR5KHBsYW5baV0pKSBkb25lKCk7XG4gICAgICAgIGVsc2UgaW52b2tlKHBsYW5baV0sIHBsYW5baSsxXSwgcGxhbltpKzJdKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgZnVuY3Rpb24gaW52b2tlKGtleSwgaW52b2NhYmxlLCBwYXJhbXMpIHtcbiAgICAgICAgLy8gQ3JlYXRlIGEgZGVmZXJyZWQgZm9yIHRoaXMgaW52b2NhdGlvbi4gRmFpbHVyZXMgd2lsbCBwcm9wYWdhdGUgdG8gdGhlIHJlc29sdXRpb24gYXMgd2VsbC5cbiAgICAgICAgdmFyIGludm9jYXRpb24gPSAkcS5kZWZlcigpLCB3YWl0UGFyYW1zID0gMDtcbiAgICAgICAgZnVuY3Rpb24gb25mYWlsdXJlKHJlYXNvbikge1xuICAgICAgICAgIGludm9jYXRpb24ucmVqZWN0KHJlYXNvbik7XG4gICAgICAgICAgZmFpbChyZWFzb24pO1xuICAgICAgICB9XG4gICAgICAgIC8vIFdhaXQgZm9yIGFueSBwYXJhbWV0ZXIgdGhhdCB3ZSBoYXZlIGEgcHJvbWlzZSBmb3IgKGVpdGhlciBmcm9tIHBhcmVudCBvciBmcm9tIHRoaXNcbiAgICAgICAgLy8gcmVzb2x2ZTsgaW4gdGhhdCBjYXNlIHN0dWR5KCkgd2lsbCBoYXZlIG1hZGUgc3VyZSBpdCdzIG9yZGVyZWQgYmVmb3JlIHVzIGluIHRoZSBwbGFuKS5cbiAgICAgICAgZm9yRWFjaChwYXJhbXMsIGZ1bmN0aW9uIChkZXApIHtcbiAgICAgICAgICBpZiAocHJvbWlzZXMuaGFzT3duUHJvcGVydHkoZGVwKSAmJiAhbG9jYWxzLmhhc093blByb3BlcnR5KGRlcCkpIHtcbiAgICAgICAgICAgIHdhaXRQYXJhbXMrKztcbiAgICAgICAgICAgIHByb21pc2VzW2RlcF0udGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgIHZhbHVlc1tkZXBdID0gcmVzdWx0O1xuICAgICAgICAgICAgICBpZiAoISgtLXdhaXRQYXJhbXMpKSBwcm9jZWVkKCk7XG4gICAgICAgICAgICB9LCBvbmZhaWx1cmUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICAgIGlmICghd2FpdFBhcmFtcykgcHJvY2VlZCgpO1xuICAgICAgICBmdW5jdGlvbiBwcm9jZWVkKCkge1xuICAgICAgICAgIGlmIChpc0RlZmluZWQocmVzdWx0LiQkZmFpbHVyZSkpIHJldHVybjtcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgaW52b2NhdGlvbi5yZXNvbHZlKCRpbmplY3Rvci5pbnZva2UoaW52b2NhYmxlLCBzZWxmLCB2YWx1ZXMpKTtcbiAgICAgICAgICAgIGludm9jYXRpb24ucHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAgICAgdmFsdWVzW2tleV0gPSByZXN1bHQ7XG4gICAgICAgICAgICAgIGRvbmUoKTtcbiAgICAgICAgICAgIH0sIG9uZmFpbHVyZSk7XG4gICAgICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICAgICAgb25mYWlsdXJlKGUpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBQdWJsaXNoIHByb21pc2Ugc3luY2hyb25vdXNseTsgaW52b2NhdGlvbnMgZnVydGhlciBkb3duIGluIHRoZSBwbGFuIG1heSBkZXBlbmQgb24gaXQuXG4gICAgICAgIHByb21pc2VzW2tleV0gPSBpbnZvY2F0aW9uLnByb21pc2U7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfTtcbiAgfTtcbiAgXG4gIC8qKlxuICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICogQG5hbWUgdWkucm91dGVyLnV0aWwuJHJlc29sdmUjcmVzb2x2ZVxuICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnV0aWwuJHJlc29sdmVcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlc29sdmVzIGEgc2V0IG9mIGludm9jYWJsZXMuIEFuIGludm9jYWJsZSBpcyBhIGZ1bmN0aW9uIHRvIGJlIGludm9rZWQgdmlhIFxuICAgKiBgJGluamVjdG9yLmludm9rZSgpYCwgYW5kIGNhbiBoYXZlIGFuIGFyYml0cmFyeSBudW1iZXIgb2YgZGVwZW5kZW5jaWVzLiBcbiAgICogQW4gaW52b2NhYmxlIGNhbiBlaXRoZXIgcmV0dXJuIGEgdmFsdWUgZGlyZWN0bHksXG4gICAqIG9yIGEgYCRxYCBwcm9taXNlLiBJZiBhIHByb21pc2UgaXMgcmV0dXJuZWQgaXQgd2lsbCBiZSByZXNvbHZlZCBhbmQgdGhlIFxuICAgKiByZXN1bHRpbmcgdmFsdWUgd2lsbCBiZSB1c2VkIGluc3RlYWQuIERlcGVuZGVuY2llcyBvZiBpbnZvY2FibGVzIGFyZSByZXNvbHZlZCBcbiAgICogKGluIHRoaXMgb3JkZXIgb2YgcHJlY2VkZW5jZSlcbiAgICpcbiAgICogLSBmcm9tIHRoZSBzcGVjaWZpZWQgYGxvY2Fsc2BcbiAgICogLSBmcm9tIGFub3RoZXIgaW52b2NhYmxlIHRoYXQgaXMgcGFydCBvZiB0aGlzIGAkcmVzb2x2ZWAgY2FsbFxuICAgKiAtIGZyb20gYW4gaW52b2NhYmxlIHRoYXQgaXMgaW5oZXJpdGVkIGZyb20gYSBgcGFyZW50YCBjYWxsIHRvIGAkcmVzb2x2ZWAgXG4gICAqICAgKG9yIHJlY3Vyc2l2ZWx5XG4gICAqIC0gZnJvbSBhbnkgYW5jZXN0b3IgYCRyZXNvbHZlYCBvZiB0aGF0IHBhcmVudCkuXG4gICAqXG4gICAqIFRoZSByZXR1cm4gdmFsdWUgb2YgYCRyZXNvbHZlYCBpcyBhIHByb21pc2UgZm9yIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIFxuICAgKiAoaW4gdGhpcyBvcmRlciBvZiBwcmVjZWRlbmNlKVxuICAgKlxuICAgKiAtIGFueSBgbG9jYWxzYCAoaWYgc3BlY2lmaWVkKVxuICAgKiAtIHRoZSByZXNvbHZlZCByZXR1cm4gdmFsdWVzIG9mIGFsbCBpbmplY3RhYmxlc1xuICAgKiAtIGFueSB2YWx1ZXMgaW5oZXJpdGVkIGZyb20gYSBgcGFyZW50YCBjYWxsIHRvIGAkcmVzb2x2ZWAgKGlmIHNwZWNpZmllZClcbiAgICpcbiAgICogVGhlIHByb21pc2Ugd2lsbCByZXNvbHZlIGFmdGVyIHRoZSBgcGFyZW50YCBwcm9taXNlIChpZiBhbnkpIGFuZCBhbGwgcHJvbWlzZXMgXG4gICAqIHJldHVybmVkIGJ5IGluamVjdGFibGVzIGhhdmUgYmVlbiByZXNvbHZlZC4gSWYgYW55IGludm9jYWJsZSBcbiAgICogKG9yIGAkaW5qZWN0b3IuaW52b2tlYCkgdGhyb3dzIGFuIGV4Y2VwdGlvbiwgb3IgaWYgYSBwcm9taXNlIHJldHVybmVkIGJ5IGFuIFxuICAgKiBpbnZvY2FibGUgaXMgcmVqZWN0ZWQsIHRoZSBgJHJlc29sdmVgIHByb21pc2UgaXMgaW1tZWRpYXRlbHkgcmVqZWN0ZWQgd2l0aCB0aGUgXG4gICAqIHNhbWUgZXJyb3IuIEEgcmVqZWN0aW9uIG9mIGEgYHBhcmVudGAgcHJvbWlzZSAoaWYgc3BlY2lmaWVkKSB3aWxsIGxpa2V3aXNlIGJlIFxuICAgKiBwcm9wYWdhdGVkIGltbWVkaWF0ZWx5LiBPbmNlIHRoZSBgJHJlc29sdmVgIHByb21pc2UgaGFzIGJlZW4gcmVqZWN0ZWQsIG5vIFxuICAgKiBmdXJ0aGVyIGludm9jYWJsZXMgd2lsbCBiZSBjYWxsZWQuXG4gICAqIFxuICAgKiBDeWNsaWMgZGVwZW5kZW5jaWVzIGJldHdlZW4gaW52b2NhYmxlcyBhcmUgbm90IHBlcm1pdHRlZCBhbmQgd2lsbCBjYXVlcyBgJHJlc29sdmVgXG4gICAqIHRvIHRocm93IGFuIGVycm9yLiBBcyBhIHNwZWNpYWwgY2FzZSwgYW4gaW5qZWN0YWJsZSBjYW4gZGVwZW5kIG9uIGEgcGFyYW1ldGVyIFxuICAgKiB3aXRoIHRoZSBzYW1lIG5hbWUgYXMgdGhlIGluamVjdGFibGUsIHdoaWNoIHdpbGwgYmUgZnVsZmlsbGVkIGZyb20gdGhlIGBwYXJlbnRgIFxuICAgKiBpbmplY3RhYmxlIG9mIHRoZSBzYW1lIG5hbWUuIFRoaXMgYWxsb3dzIGluaGVyaXRlZCB2YWx1ZXMgdG8gYmUgZGVjb3JhdGVkLiBcbiAgICogTm90ZSB0aGF0IGluIHRoaXMgY2FzZSBhbnkgb3RoZXIgaW5qZWN0YWJsZSBpbiB0aGUgc2FtZSBgJHJlc29sdmVgIHdpdGggdGhlIHNhbWVcbiAgICogZGVwZW5kZW5jeSB3b3VsZCBzZWUgdGhlIGRlY29yYXRlZCB2YWx1ZSwgbm90IHRoZSBpbmhlcml0ZWQgdmFsdWUuXG4gICAqXG4gICAqIE5vdGUgdGhhdCBtaXNzaW5nIGRlcGVuZGVuY2llcyAtLSB1bmxpa2UgY3ljbGljIGRlcGVuZGVuY2llcyAtLSB3aWxsIGNhdXNlIGFuIFxuICAgKiAoYXN5bmNocm9ub3VzKSByZWplY3Rpb24gb2YgdGhlIGAkcmVzb2x2ZWAgcHJvbWlzZSByYXRoZXIgdGhhbiBhIChzeW5jaHJvbm91cykgXG4gICAqIGV4Y2VwdGlvbi5cbiAgICpcbiAgICogSW52b2NhYmxlcyBhcmUgaW52b2tlZCBlYWdlcmx5IGFzIHNvb24gYXMgYWxsIGRlcGVuZGVuY2llcyBhcmUgYXZhaWxhYmxlLiBcbiAgICogVGhpcyBpcyB0cnVlIGV2ZW4gZm9yIGRlcGVuZGVuY2llcyBpbmhlcml0ZWQgZnJvbSBhIGBwYXJlbnRgIGNhbGwgdG8gYCRyZXNvbHZlYC5cbiAgICpcbiAgICogQXMgYSBzcGVjaWFsIGNhc2UsIGFuIGludm9jYWJsZSBjYW4gYmUgYSBzdHJpbmcsIGluIHdoaWNoIGNhc2UgaXQgaXMgdGFrZW4gdG8gXG4gICAqIGJlIGEgc2VydmljZSBuYW1lIHRvIGJlIHBhc3NlZCB0byBgJGluamVjdG9yLmdldCgpYC4gVGhpcyBpcyBzdXBwb3J0ZWQgcHJpbWFyaWx5IFxuICAgKiBmb3IgYmFja3dhcmRzLWNvbXBhdGliaWxpdHkgd2l0aCB0aGUgYHJlc29sdmVgIHByb3BlcnR5IG9mIGAkcm91dGVQcm92aWRlcmAgXG4gICAqIHJvdXRlcy5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IGludm9jYWJsZXMgZnVuY3Rpb25zIHRvIGludm9rZSBvciBcbiAgICogYCRpbmplY3RvcmAgc2VydmljZXMgdG8gZmV0Y2guXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBsb2NhbHMgIHZhbHVlcyB0byBtYWtlIGF2YWlsYWJsZSB0byB0aGUgaW5qZWN0YWJsZXNcbiAgICogQHBhcmFtIHtvYmplY3R9IHBhcmVudCAgYSBwcm9taXNlIHJldHVybmVkIGJ5IGFub3RoZXIgY2FsbCB0byBgJHJlc29sdmVgLlxuICAgKiBAcGFyYW0ge29iamVjdH0gc2VsZiAgdGhlIGB0aGlzYCBmb3IgdGhlIGludm9rZWQgbWV0aG9kc1xuICAgKiBAcmV0dXJuIHtvYmplY3R9IFByb21pc2UgZm9yIGFuIG9iamVjdCB0aGF0IGNvbnRhaW5zIHRoZSByZXNvbHZlZCByZXR1cm4gdmFsdWVcbiAgICogb2YgYWxsIGludm9jYWJsZXMsIGFzIHdlbGwgYXMgYW55IGluaGVyaXRlZCBhbmQgbG9jYWwgdmFsdWVzLlxuICAgKi9cbiAgdGhpcy5yZXNvbHZlID0gZnVuY3Rpb24gKGludm9jYWJsZXMsIGxvY2FscywgcGFyZW50LCBzZWxmKSB7XG4gICAgcmV0dXJuIHRoaXMuc3R1ZHkoaW52b2NhYmxlcykobG9jYWxzLCBwYXJlbnQsIHNlbGYpO1xuICB9O1xufVxuXG5hbmd1bGFyLm1vZHVsZSgndWkucm91dGVyLnV0aWwnKS5zZXJ2aWNlKCckcmVzb2x2ZScsICRSZXNvbHZlKTtcblxuXG4vKipcbiAqIEBuZ2RvYyBvYmplY3RcbiAqIEBuYW1lIHVpLnJvdXRlci51dGlsLiR0ZW1wbGF0ZUZhY3RvcnlcbiAqXG4gKiBAcmVxdWlyZXMgJGh0dHBcbiAqIEByZXF1aXJlcyAkdGVtcGxhdGVDYWNoZVxuICogQHJlcXVpcmVzICRpbmplY3RvclxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogU2VydmljZS4gTWFuYWdlcyBsb2FkaW5nIG9mIHRlbXBsYXRlcy5cbiAqL1xuJFRlbXBsYXRlRmFjdG9yeS4kaW5qZWN0ID0gWyckaHR0cCcsICckdGVtcGxhdGVDYWNoZScsICckaW5qZWN0b3InXTtcbmZ1bmN0aW9uICRUZW1wbGF0ZUZhY3RvcnkoICAkaHR0cCwgICAkdGVtcGxhdGVDYWNoZSwgICAkaW5qZWN0b3IpIHtcblxuICAvKipcbiAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAqIEBuYW1lIHVpLnJvdXRlci51dGlsLiR0ZW1wbGF0ZUZhY3RvcnkjZnJvbUNvbmZpZ1xuICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnV0aWwuJHRlbXBsYXRlRmFjdG9yeVxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ3JlYXRlcyBhIHRlbXBsYXRlIGZyb20gYSBjb25maWd1cmF0aW9uIG9iamVjdC4gXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBjb25maWcgQ29uZmlndXJhdGlvbiBvYmplY3QgZm9yIHdoaWNoIHRvIGxvYWQgYSB0ZW1wbGF0ZS4gXG4gICAqIFRoZSBmb2xsb3dpbmcgcHJvcGVydGllcyBhcmUgc2VhcmNoIGluIHRoZSBzcGVjaWZpZWQgb3JkZXIsIGFuZCB0aGUgZmlyc3Qgb25lIFxuICAgKiB0aGF0IGlzIGRlZmluZWQgaXMgdXNlZCB0byBjcmVhdGUgdGhlIHRlbXBsYXRlOlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IGNvbmZpZy50ZW1wbGF0ZSBodG1sIHN0cmluZyB0ZW1wbGF0ZSBvciBmdW5jdGlvbiB0byBcbiAgICogbG9hZCB2aWEge0BsaW5rIHVpLnJvdXRlci51dGlsLiR0ZW1wbGF0ZUZhY3RvcnkjZnJvbVN0cmluZyBmcm9tU3RyaW5nfS5cbiAgICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSBjb25maWcudGVtcGxhdGVVcmwgdXJsIHRvIGxvYWQgb3IgYSBmdW5jdGlvbiByZXR1cm5pbmcgXG4gICAqIHRoZSB1cmwgdG8gbG9hZCB2aWEge0BsaW5rIHVpLnJvdXRlci51dGlsLiR0ZW1wbGF0ZUZhY3RvcnkjZnJvbVVybCBmcm9tVXJsfS5cbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY29uZmlnLnRlbXBsYXRlUHJvdmlkZXIgZnVuY3Rpb24gdG8gaW52b2tlIHZpYSBcbiAgICoge0BsaW5rIHVpLnJvdXRlci51dGlsLiR0ZW1wbGF0ZUZhY3RvcnkjZnJvbVByb3ZpZGVyIGZyb21Qcm92aWRlcn0uXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgIFBhcmFtZXRlcnMgdG8gcGFzcyB0byB0aGUgdGVtcGxhdGUgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBsb2NhbHMgTG9jYWxzIHRvIHBhc3MgdG8gYGludm9rZWAgaWYgdGhlIHRlbXBsYXRlIGlzIGxvYWRlZCBcbiAgICogdmlhIGEgYHRlbXBsYXRlUHJvdmlkZXJgLiBEZWZhdWx0cyB0byBgeyBwYXJhbXM6IHBhcmFtcyB9YC5cbiAgICpcbiAgICogQHJldHVybiB7c3RyaW5nfG9iamVjdH0gIFRoZSB0ZW1wbGF0ZSBodG1sIGFzIGEgc3RyaW5nLCBvciBhIHByb21pc2UgZm9yIFxuICAgKiB0aGF0IHN0cmluZyxvciBgbnVsbGAgaWYgbm8gdGVtcGxhdGUgaXMgY29uZmlndXJlZC5cbiAgICovXG4gIHRoaXMuZnJvbUNvbmZpZyA9IGZ1bmN0aW9uIChjb25maWcsIHBhcmFtcywgbG9jYWxzKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGlzRGVmaW5lZChjb25maWcudGVtcGxhdGUpID8gdGhpcy5mcm9tU3RyaW5nKGNvbmZpZy50ZW1wbGF0ZSwgcGFyYW1zKSA6XG4gICAgICBpc0RlZmluZWQoY29uZmlnLnRlbXBsYXRlVXJsKSA/IHRoaXMuZnJvbVVybChjb25maWcudGVtcGxhdGVVcmwsIHBhcmFtcykgOlxuICAgICAgaXNEZWZpbmVkKGNvbmZpZy50ZW1wbGF0ZVByb3ZpZGVyKSA/IHRoaXMuZnJvbVByb3ZpZGVyKGNvbmZpZy50ZW1wbGF0ZVByb3ZpZGVyLCBwYXJhbXMsIGxvY2FscykgOlxuICAgICAgbnVsbFxuICAgICk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgKiBAbmFtZSB1aS5yb3V0ZXIudXRpbC4kdGVtcGxhdGVGYWN0b3J5I2Zyb21TdHJpbmdcbiAgICogQG1ldGhvZE9mIHVpLnJvdXRlci51dGlsLiR0ZW1wbGF0ZUZhY3RvcnlcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENyZWF0ZXMgYSB0ZW1wbGF0ZSBmcm9tIGEgc3RyaW5nIG9yIGEgZnVuY3Rpb24gcmV0dXJuaW5nIGEgc3RyaW5nLlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IHRlbXBsYXRlIGh0bWwgdGVtcGxhdGUgYXMgYSBzdHJpbmcgb3IgZnVuY3Rpb24gdGhhdCBcbiAgICogcmV0dXJucyBhbiBodG1sIHRlbXBsYXRlIGFzIGEgc3RyaW5nLlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zIFBhcmFtZXRlcnMgdG8gcGFzcyB0byB0aGUgdGVtcGxhdGUgZnVuY3Rpb24uXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ3xvYmplY3R9IFRoZSB0ZW1wbGF0ZSBodG1sIGFzIGEgc3RyaW5nLCBvciBhIHByb21pc2UgZm9yIHRoYXQgXG4gICAqIHN0cmluZy5cbiAgICovXG4gIHRoaXMuZnJvbVN0cmluZyA9IGZ1bmN0aW9uICh0ZW1wbGF0ZSwgcGFyYW1zKSB7XG4gICAgcmV0dXJuIGlzRnVuY3Rpb24odGVtcGxhdGUpID8gdGVtcGxhdGUocGFyYW1zKSA6IHRlbXBsYXRlO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICogQG5hbWUgdWkucm91dGVyLnV0aWwuJHRlbXBsYXRlRmFjdG9yeSNmcm9tVXJsXG4gICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIudXRpbC4kdGVtcGxhdGVGYWN0b3J5XG4gICAqIFxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogTG9hZHMgYSB0ZW1wbGF0ZSBmcm9tIHRoZSBhIFVSTCB2aWEgYCRodHRwYCBhbmQgYCR0ZW1wbGF0ZUNhY2hlYC5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8RnVuY3Rpb259IHVybCB1cmwgb2YgdGhlIHRlbXBsYXRlIHRvIGxvYWQsIG9yIGEgZnVuY3Rpb24gXG4gICAqIHRoYXQgcmV0dXJucyBhIHVybC5cbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyBQYXJhbWV0ZXJzIHRvIHBhc3MgdG8gdGhlIHVybCBmdW5jdGlvbi5cbiAgICogQHJldHVybiB7c3RyaW5nfFByb21pc2UuPHN0cmluZz59IFRoZSB0ZW1wbGF0ZSBodG1sIGFzIGEgc3RyaW5nLCBvciBhIHByb21pc2UgXG4gICAqIGZvciB0aGF0IHN0cmluZy5cbiAgICovXG4gIHRoaXMuZnJvbVVybCA9IGZ1bmN0aW9uICh1cmwsIHBhcmFtcykge1xuICAgIGlmIChpc0Z1bmN0aW9uKHVybCkpIHVybCA9IHVybChwYXJhbXMpO1xuICAgIGlmICh1cmwgPT0gbnVsbCkgcmV0dXJuIG51bGw7XG4gICAgZWxzZSByZXR1cm4gJGh0dHBcbiAgICAgICAgLmdldCh1cmwsIHsgY2FjaGU6ICR0ZW1wbGF0ZUNhY2hlIH0pXG4gICAgICAgIC50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKSB7IHJldHVybiByZXNwb25zZS5kYXRhOyB9KTtcbiAgfTtcblxuICAvKipcbiAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAqIEBuYW1lIHVpLnJvdXRlci51dGlsLiR0ZW1wbGF0ZUZhY3RvcnkjZnJvbVVybFxuICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnV0aWwuJHRlbXBsYXRlRmFjdG9yeVxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ3JlYXRlcyBhIHRlbXBsYXRlIGJ5IGludm9raW5nIGFuIGluamVjdGFibGUgcHJvdmlkZXIgZnVuY3Rpb24uXG4gICAqXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IHByb3ZpZGVyIEZ1bmN0aW9uIHRvIGludm9rZSB2aWEgYCRpbmplY3Rvci5pbnZva2VgXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgUGFyYW1ldGVycyBmb3IgdGhlIHRlbXBsYXRlLlxuICAgKiBAcGFyYW0ge09iamVjdH0gbG9jYWxzIExvY2FscyB0byBwYXNzIHRvIGBpbnZva2VgLiBEZWZhdWx0cyB0byBcbiAgICogYHsgcGFyYW1zOiBwYXJhbXMgfWAuXG4gICAqIEByZXR1cm4ge3N0cmluZ3xQcm9taXNlLjxzdHJpbmc+fSBUaGUgdGVtcGxhdGUgaHRtbCBhcyBhIHN0cmluZywgb3IgYSBwcm9taXNlIFxuICAgKiBmb3IgdGhhdCBzdHJpbmcuXG4gICAqL1xuICB0aGlzLmZyb21Qcm92aWRlciA9IGZ1bmN0aW9uIChwcm92aWRlciwgcGFyYW1zLCBsb2NhbHMpIHtcbiAgICByZXR1cm4gJGluamVjdG9yLmludm9rZShwcm92aWRlciwgbnVsbCwgbG9jYWxzIHx8IHsgcGFyYW1zOiBwYXJhbXMgfSk7XG4gIH07XG59XG5cbmFuZ3VsYXIubW9kdWxlKCd1aS5yb3V0ZXIudXRpbCcpLnNlcnZpY2UoJyR0ZW1wbGF0ZUZhY3RvcnknLCAkVGVtcGxhdGVGYWN0b3J5KTtcblxuLyoqXG4gKiBAbmdkb2Mgb2JqZWN0XG4gKiBAbmFtZSB1aS5yb3V0ZXIudXRpbC50eXBlOlVybE1hdGNoZXJcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIE1hdGNoZXMgVVJMcyBhZ2FpbnN0IHBhdHRlcm5zIGFuZCBleHRyYWN0cyBuYW1lZCBwYXJhbWV0ZXJzIGZyb20gdGhlIHBhdGggb3IgdGhlIHNlYXJjaFxuICogcGFydCBvZiB0aGUgVVJMLiBBIFVSTCBwYXR0ZXJuIGNvbnNpc3RzIG9mIGEgcGF0aCBwYXR0ZXJuLCBvcHRpb25hbGx5IGZvbGxvd2VkIGJ5ICc/JyBhbmQgYSBsaXN0XG4gKiBvZiBzZWFyY2ggcGFyYW1ldGVycy4gTXVsdGlwbGUgc2VhcmNoIHBhcmFtZXRlciBuYW1lcyBhcmUgc2VwYXJhdGVkIGJ5ICcmJy4gU2VhcmNoIHBhcmFtZXRlcnNcbiAqIGRvIG5vdCBpbmZsdWVuY2Ugd2hldGhlciBvciBub3QgYSBVUkwgaXMgbWF0Y2hlZCwgYnV0IHRoZWlyIHZhbHVlcyBhcmUgcGFzc2VkIHRocm91Z2ggaW50b1xuICogdGhlIG1hdGNoZWQgcGFyYW1ldGVycyByZXR1cm5lZCBieSB7QGxpbmsgdWkucm91dGVyLnV0aWwudHlwZTpVcmxNYXRjaGVyI21ldGhvZHNfZXhlYyBleGVjfS5cbiAqIFxuICogUGF0aCBwYXJhbWV0ZXIgcGxhY2Vob2xkZXJzIGNhbiBiZSBzcGVjaWZpZWQgdXNpbmcgc2ltcGxlIGNvbG9uL2NhdGNoLWFsbCBzeW50YXggb3IgY3VybHkgYnJhY2VcbiAqIHN5bnRheCwgd2hpY2ggb3B0aW9uYWxseSBhbGxvd3MgYSByZWd1bGFyIGV4cHJlc3Npb24gZm9yIHRoZSBwYXJhbWV0ZXIgdG8gYmUgc3BlY2lmaWVkOlxuICpcbiAqICogYCc6J2AgbmFtZSAtIGNvbG9uIHBsYWNlaG9sZGVyXG4gKiAqIGAnKidgIG5hbWUgLSBjYXRjaC1hbGwgcGxhY2Vob2xkZXJcbiAqICogYCd7JyBuYW1lICd9J2AgLSBjdXJseSBwbGFjZWhvbGRlclxuICogKiBgJ3snIG5hbWUgJzonIHJlZ2V4cCAnfSdgIC0gY3VybHkgcGxhY2Vob2xkZXIgd2l0aCByZWdleHAuIFNob3VsZCB0aGUgcmVnZXhwIGl0c2VsZiBjb250YWluXG4gKiAgIGN1cmx5IGJyYWNlcywgdGhleSBtdXN0IGJlIGluIG1hdGNoZWQgcGFpcnMgb3IgZXNjYXBlZCB3aXRoIGEgYmFja3NsYXNoLlxuICpcbiAqIFBhcmFtZXRlciBuYW1lcyBtYXkgY29udGFpbiBvbmx5IHdvcmQgY2hhcmFjdGVycyAobGF0aW4gbGV0dGVycywgZGlnaXRzLCBhbmQgdW5kZXJzY29yZSkgYW5kXG4gKiBtdXN0IGJlIHVuaXF1ZSB3aXRoaW4gdGhlIHBhdHRlcm4gKGFjcm9zcyBib3RoIHBhdGggYW5kIHNlYXJjaCBwYXJhbWV0ZXJzKS4gRm9yIGNvbG9uIFxuICogcGxhY2Vob2xkZXJzIG9yIGN1cmx5IHBsYWNlaG9sZGVycyB3aXRob3V0IGFuIGV4cGxpY2l0IHJlZ2V4cCwgYSBwYXRoIHBhcmFtZXRlciBtYXRjaGVzIGFueVxuICogbnVtYmVyIG9mIGNoYXJhY3RlcnMgb3RoZXIgdGhhbiAnLycuIEZvciBjYXRjaC1hbGwgcGxhY2Vob2xkZXJzIHRoZSBwYXRoIHBhcmFtZXRlciBtYXRjaGVzXG4gKiBhbnkgbnVtYmVyIG9mIGNoYXJhY3RlcnMuXG4gKiBcbiAqIEV4YW1wbGVzOlxuICogXG4gKiAqIGAnL2hlbGxvLydgIC0gTWF0Y2hlcyBvbmx5IGlmIHRoZSBwYXRoIGlzIGV4YWN0bHkgJy9oZWxsby8nLiBUaGVyZSBpcyBubyBzcGVjaWFsIHRyZWF0bWVudCBmb3JcbiAqICAgdHJhaWxpbmcgc2xhc2hlcywgYW5kIHBhdHRlcm5zIGhhdmUgdG8gbWF0Y2ggdGhlIGVudGlyZSBwYXRoLCBub3QganVzdCBhIHByZWZpeC5cbiAqICogYCcvdXNlci86aWQnYCAtIE1hdGNoZXMgJy91c2VyL2JvYicgb3IgJy91c2VyLzEyMzQhISEnIG9yIGV2ZW4gJy91c2VyLycgYnV0IG5vdCAnL3VzZXInIG9yXG4gKiAgICcvdXNlci9ib2IvZGV0YWlscycuIFRoZSBzZWNvbmQgcGF0aCBzZWdtZW50IHdpbGwgYmUgY2FwdHVyZWQgYXMgdGhlIHBhcmFtZXRlciAnaWQnLlxuICogKiBgJy91c2VyL3tpZH0nYCAtIFNhbWUgYXMgdGhlIHByZXZpb3VzIGV4YW1wbGUsIGJ1dCB1c2luZyBjdXJseSBicmFjZSBzeW50YXguXG4gKiAqIGAnL3VzZXIve2lkOlteL10qfSdgIC0gU2FtZSBhcyB0aGUgcHJldmlvdXMgZXhhbXBsZS5cbiAqICogYCcvdXNlci97aWQ6WzAtOWEtZkEtRl17MSw4fX0nYCAtIFNpbWlsYXIgdG8gdGhlIHByZXZpb3VzIGV4YW1wbGUsIGJ1dCBvbmx5IG1hdGNoZXMgaWYgdGhlIGlkXG4gKiAgIHBhcmFtZXRlciBjb25zaXN0cyBvZiAxIHRvIDggaGV4IGRpZ2l0cy5cbiAqICogYCcvZmlsZXMve3BhdGg6Lip9J2AgLSBNYXRjaGVzIGFueSBVUkwgc3RhcnRpbmcgd2l0aCAnL2ZpbGVzLycgYW5kIGNhcHR1cmVzIHRoZSByZXN0IG9mIHRoZVxuICogICBwYXRoIGludG8gdGhlIHBhcmFtZXRlciAncGF0aCcuXG4gKiAqIGAnL2ZpbGVzLypwYXRoJ2AgLSBkaXR0by5cbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0dGVybiAgdGhlIHBhdHRlcm4gdG8gY29tcGlsZSBpbnRvIGEgbWF0Y2hlci5cbiAqXG4gKiBAcHJvcGVydHkge3N0cmluZ30gcHJlZml4ICBBIHN0YXRpYyBwcmVmaXggb2YgdGhpcyBwYXR0ZXJuLiBUaGUgbWF0Y2hlciBndWFyYW50ZWVzIHRoYXQgYW55XG4gKiAgIFVSTCBtYXRjaGluZyB0aGlzIG1hdGNoZXIgKGkuZS4gYW55IHN0cmluZyBmb3Igd2hpY2gge0BsaW5rIHVpLnJvdXRlci51dGlsLnR5cGU6VXJsTWF0Y2hlciNtZXRob2RzX2V4ZWMgZXhlYygpfSByZXR1cm5zXG4gKiAgIG5vbi1udWxsKSB3aWxsIHN0YXJ0IHdpdGggdGhpcyBwcmVmaXguXG4gKlxuICogQHByb3BlcnR5IHtzdHJpbmd9IHNvdXJjZSAgVGhlIHBhdHRlcm4gdGhhdCB3YXMgcGFzc2VkIGludG8gdGhlIGNvbnRydWN0b3JcbiAqXG4gKiBAcHJvcGVydHkge3N0cmluZ30gc291cmNlUGF0aCAgVGhlIHBhdGggcG9ydGlvbiBvZiB0aGUgc291cmNlIHByb3BlcnR5XG4gKlxuICogQHByb3BlcnR5IHtzdHJpbmd9IHNvdXJjZVNlYXJjaCAgVGhlIHNlYXJjaCBwb3J0aW9uIG9mIHRoZSBzb3VyY2UgcHJvcGVydHlcbiAqXG4gKiBAcHJvcGVydHkge3N0cmluZ30gcmVnZXggIFRoZSBjb25zdHJ1Y3RlZCByZWdleCB0aGF0IHdpbGwgYmUgdXNlZCB0byBtYXRjaCBhZ2FpbnN0IHRoZSB1cmwgd2hlbiBcbiAqICAgaXQgaXMgdGltZSB0byBkZXRlcm1pbmUgd2hpY2ggdXJsIHdpbGwgbWF0Y2guXG4gKlxuICogQHJldHVybnMge09iamVjdH0gIE5ldyBVcmxNYXRjaGVyIG9iamVjdFxuICovXG5mdW5jdGlvbiBVcmxNYXRjaGVyKHBhdHRlcm4pIHtcblxuICAvLyBGaW5kIGFsbCBwbGFjZWhvbGRlcnMgYW5kIGNyZWF0ZSBhIGNvbXBpbGVkIHBhdHRlcm4sIHVzaW5nIGVpdGhlciBjbGFzc2ljIG9yIGN1cmx5IHN5bnRheDpcbiAgLy8gICAnKicgbmFtZVxuICAvLyAgICc6JyBuYW1lXG4gIC8vICAgJ3snIG5hbWUgJ30nXG4gIC8vICAgJ3snIG5hbWUgJzonIHJlZ2V4cCAnfSdcbiAgLy8gVGhlIHJlZ3VsYXIgZXhwcmVzc2lvbiBpcyBzb21ld2hhdCBjb21wbGljYXRlZCBkdWUgdG8gdGhlIG5lZWQgdG8gYWxsb3cgY3VybHkgYnJhY2VzXG4gIC8vIGluc2lkZSB0aGUgcmVndWxhciBleHByZXNzaW9uLiBUaGUgcGxhY2Vob2xkZXIgcmVnZXhwIGJyZWFrcyBkb3duIGFzIGZvbGxvd3M6XG4gIC8vICAgIChbOipdKShcXHcrKSAgICAgICAgICAgICAgIGNsYXNzaWMgcGxhY2Vob2xkZXIgKCQxIC8gJDIpXG4gIC8vICAgIFxceyhcXHcrKSg/OlxcOiggLi4uICkpP1xcfSAgIGN1cmx5IGJyYWNlIHBsYWNlaG9sZGVyICgkMykgd2l0aCBvcHRpb25hbCByZWdleHAgLi4uICgkNClcbiAgLy8gICAgKD86IC4uLiB8IC4uLiB8IC4uLiApKyAgICB0aGUgcmVnZXhwIGNvbnNpc3RzIG9mIGFueSBudW1iZXIgb2YgYXRvbXMsIGFuIGF0b20gYmVpbmcgZWl0aGVyXG4gIC8vICAgIFtee31cXFxcXSsgICAgICAgICAgICAgICAgICAtIGFueXRoaW5nIG90aGVyIHRoYW4gY3VybHkgYnJhY2VzIG9yIGJhY2tzbGFzaFxuICAvLyAgICBcXFxcLiAgICAgICAgICAgICAgICAgICAgICAgLSBhIGJhY2tzbGFzaCBlc2NhcGVcbiAgLy8gICAgXFx7KD86W157fVxcXFxdK3xcXFxcLikqXFx9ICAgICAtIGEgbWF0Y2hlZCBzZXQgb2YgY3VybHkgYnJhY2VzIGNvbnRhaW5pbmcgb3RoZXIgYXRvbXNcbiAgdmFyIHBsYWNlaG9sZGVyID0gLyhbOipdKShcXHcrKXxcXHsoXFx3KykoPzpcXDooKD86W157fVxcXFxdK3xcXFxcLnxcXHsoPzpbXnt9XFxcXF0rfFxcXFwuKSpcXH0pKykpP1xcfS9nLFxuICAgICAgbmFtZXMgPSB7fSwgY29tcGlsZWQgPSAnXicsIGxhc3QgPSAwLCBtLFxuICAgICAgc2VnbWVudHMgPSB0aGlzLnNlZ21lbnRzID0gW10sXG4gICAgICBwYXJhbXMgPSB0aGlzLnBhcmFtcyA9IFtdO1xuXG4gIGZ1bmN0aW9uIGFkZFBhcmFtZXRlcihpZCkge1xuICAgIGlmICghL15cXHcrKC0rXFx3KykqJC8udGVzdChpZCkpIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgcGFyYW1ldGVyIG5hbWUgJ1wiICsgaWQgKyBcIicgaW4gcGF0dGVybiAnXCIgKyBwYXR0ZXJuICsgXCInXCIpO1xuICAgIGlmIChuYW1lc1tpZF0pIHRocm93IG5ldyBFcnJvcihcIkR1cGxpY2F0ZSBwYXJhbWV0ZXIgbmFtZSAnXCIgKyBpZCArIFwiJyBpbiBwYXR0ZXJuICdcIiArIHBhdHRlcm4gKyBcIidcIik7XG4gICAgbmFtZXNbaWRdID0gdHJ1ZTtcbiAgICBwYXJhbXMucHVzaChpZCk7XG4gIH1cblxuICBmdW5jdGlvbiBxdW90ZVJlZ0V4cChzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLnJlcGxhY2UoL1tcXFxcXFxbXFxdXFxeJCorPy4oKXx7fV0vZywgXCJcXFxcJCZcIik7XG4gIH1cblxuICB0aGlzLnNvdXJjZSA9IHBhdHRlcm47XG5cbiAgLy8gU3BsaXQgaW50byBzdGF0aWMgc2VnbWVudHMgc2VwYXJhdGVkIGJ5IHBhdGggcGFyYW1ldGVyIHBsYWNlaG9sZGVycy5cbiAgLy8gVGhlIG51bWJlciBvZiBzZWdtZW50cyBpcyBhbHdheXMgMSBtb3JlIHRoYW4gdGhlIG51bWJlciBvZiBwYXJhbWV0ZXJzLlxuICB2YXIgaWQsIHJlZ2V4cCwgc2VnbWVudDtcbiAgd2hpbGUgKChtID0gcGxhY2Vob2xkZXIuZXhlYyhwYXR0ZXJuKSkpIHtcbiAgICBpZCA9IG1bMl0gfHwgbVszXTsgLy8gSUVbNzhdIHJldHVybnMgJycgZm9yIHVubWF0Y2hlZCBncm91cHMgaW5zdGVhZCBvZiBudWxsXG4gICAgcmVnZXhwID0gbVs0XSB8fCAobVsxXSA9PSAnKicgPyAnLionIDogJ1teL10qJyk7XG4gICAgc2VnbWVudCA9IHBhdHRlcm4uc3Vic3RyaW5nKGxhc3QsIG0uaW5kZXgpO1xuICAgIGlmIChzZWdtZW50LmluZGV4T2YoJz8nKSA+PSAwKSBicmVhazsgLy8gd2UncmUgaW50byB0aGUgc2VhcmNoIHBhcnRcbiAgICBjb21waWxlZCArPSBxdW90ZVJlZ0V4cChzZWdtZW50KSArICcoJyArIHJlZ2V4cCArICcpJztcbiAgICBhZGRQYXJhbWV0ZXIoaWQpO1xuICAgIHNlZ21lbnRzLnB1c2goc2VnbWVudCk7XG4gICAgbGFzdCA9IHBsYWNlaG9sZGVyLmxhc3RJbmRleDtcbiAgfVxuICBzZWdtZW50ID0gcGF0dGVybi5zdWJzdHJpbmcobGFzdCk7XG5cbiAgLy8gRmluZCBhbnkgc2VhcmNoIHBhcmFtZXRlciBuYW1lcyBhbmQgcmVtb3ZlIHRoZW0gZnJvbSB0aGUgbGFzdCBzZWdtZW50XG4gIHZhciBpID0gc2VnbWVudC5pbmRleE9mKCc/Jyk7XG4gIGlmIChpID49IDApIHtcbiAgICB2YXIgc2VhcmNoID0gdGhpcy5zb3VyY2VTZWFyY2ggPSBzZWdtZW50LnN1YnN0cmluZyhpKTtcbiAgICBzZWdtZW50ID0gc2VnbWVudC5zdWJzdHJpbmcoMCwgaSk7XG4gICAgdGhpcy5zb3VyY2VQYXRoID0gcGF0dGVybi5zdWJzdHJpbmcoMCwgbGFzdCtpKTtcblxuICAgIC8vIEFsbG93IHBhcmFtZXRlcnMgdG8gYmUgc2VwYXJhdGVkIGJ5ICc/JyBhcyB3ZWxsIGFzICcmJyB0byBtYWtlIGNvbmNhdCgpIGVhc2llclxuICAgIGZvckVhY2goc2VhcmNoLnN1YnN0cmluZygxKS5zcGxpdCgvWyY/XS8pLCBhZGRQYXJhbWV0ZXIpO1xuICB9IGVsc2Uge1xuICAgIHRoaXMuc291cmNlUGF0aCA9IHBhdHRlcm47XG4gICAgdGhpcy5zb3VyY2VTZWFyY2ggPSAnJztcbiAgfVxuXG4gIGNvbXBpbGVkICs9IHF1b3RlUmVnRXhwKHNlZ21lbnQpICsgJyQnO1xuICBzZWdtZW50cy5wdXNoKHNlZ21lbnQpO1xuICB0aGlzLnJlZ2V4cCA9IG5ldyBSZWdFeHAoY29tcGlsZWQpO1xuICB0aGlzLnByZWZpeCA9IHNlZ21lbnRzWzBdO1xufVxuXG4vKipcbiAqIEBuZ2RvYyBmdW5jdGlvblxuICogQG5hbWUgdWkucm91dGVyLnV0aWwudHlwZTpVcmxNYXRjaGVyI2NvbmNhdFxuICogQG1ldGhvZE9mIHVpLnJvdXRlci51dGlsLnR5cGU6VXJsTWF0Y2hlclxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogUmV0dXJucyBhIG5ldyBtYXRjaGVyIGZvciBhIHBhdHRlcm4gY29uc3RydWN0ZWQgYnkgYXBwZW5kaW5nIHRoZSBwYXRoIHBhcnQgYW5kIGFkZGluZyB0aGVcbiAqIHNlYXJjaCBwYXJhbWV0ZXJzIG9mIHRoZSBzcGVjaWZpZWQgcGF0dGVybiB0byB0aGlzIHBhdHRlcm4uIFRoZSBjdXJyZW50IHBhdHRlcm4gaXMgbm90XG4gKiBtb2RpZmllZC4gVGhpcyBjYW4gYmUgdW5kZXJzdG9vZCBhcyBjcmVhdGluZyBhIHBhdHRlcm4gZm9yIFVSTHMgdGhhdCBhcmUgcmVsYXRpdmUgdG8gKG9yXG4gKiBzdWZmaXhlcyBvZikgdGhlIGN1cnJlbnQgcGF0dGVybi5cbiAqXG4gKiBAZXhhbXBsZVxuICogVGhlIGZvbGxvd2luZyB0d28gbWF0Y2hlcnMgYXJlIGVxdWl2YWxlbnQ6XG4gKiBgYGBcbiAqIG5ldyBVcmxNYXRjaGVyKCcvdXNlci97aWR9P3EnKS5jb25jYXQoJy9kZXRhaWxzP2RhdGUnKTtcbiAqIG5ldyBVcmxNYXRjaGVyKCcvdXNlci97aWR9L2RldGFpbHM/cSZkYXRlJyk7XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge3N0cmluZ30gcGF0dGVybiAgVGhlIHBhdHRlcm4gdG8gYXBwZW5kLlxuICogQHJldHVybnMge3VpLnJvdXRlci51dGlsLnR5cGU6VXJsTWF0Y2hlcn0gIEEgbWF0Y2hlciBmb3IgdGhlIGNvbmNhdGVuYXRlZCBwYXR0ZXJuLlxuICovXG5VcmxNYXRjaGVyLnByb3RvdHlwZS5jb25jYXQgPSBmdW5jdGlvbiAocGF0dGVybikge1xuICAvLyBCZWNhdXNlIG9yZGVyIG9mIHNlYXJjaCBwYXJhbWV0ZXJzIGlzIGlycmVsZXZhbnQsIHdlIGNhbiBhZGQgb3VyIG93biBzZWFyY2hcbiAgLy8gcGFyYW1ldGVycyB0byB0aGUgZW5kIG9mIHRoZSBuZXcgcGF0dGVybi4gUGFyc2UgdGhlIG5ldyBwYXR0ZXJuIGJ5IGl0c2VsZlxuICAvLyBhbmQgdGhlbiBqb2luIHRoZSBiaXRzIHRvZ2V0aGVyLCBidXQgaXQncyBtdWNoIGVhc2llciB0byBkbyB0aGlzIG9uIGEgc3RyaW5nIGxldmVsLlxuICByZXR1cm4gbmV3IFVybE1hdGNoZXIodGhpcy5zb3VyY2VQYXRoICsgcGF0dGVybiArIHRoaXMuc291cmNlU2VhcmNoKTtcbn07XG5cblVybE1hdGNoZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5zb3VyY2U7XG59O1xuXG4vKipcbiAqIEBuZ2RvYyBmdW5jdGlvblxuICogQG5hbWUgdWkucm91dGVyLnV0aWwudHlwZTpVcmxNYXRjaGVyI2V4ZWNcbiAqIEBtZXRob2RPZiB1aS5yb3V0ZXIudXRpbC50eXBlOlVybE1hdGNoZXJcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFRlc3RzIHRoZSBzcGVjaWZpZWQgcGF0aCBhZ2FpbnN0IHRoaXMgbWF0Y2hlciwgYW5kIHJldHVybnMgYW4gb2JqZWN0IGNvbnRhaW5pbmcgdGhlIGNhcHR1cmVkXG4gKiBwYXJhbWV0ZXIgdmFsdWVzLCBvciBudWxsIGlmIHRoZSBwYXRoIGRvZXMgbm90IG1hdGNoLiBUaGUgcmV0dXJuZWQgb2JqZWN0IGNvbnRhaW5zIHRoZSB2YWx1ZXNcbiAqIG9mIGFueSBzZWFyY2ggcGFyYW1ldGVycyB0aGF0IGFyZSBtZW50aW9uZWQgaW4gdGhlIHBhdHRlcm4sIGJ1dCB0aGVpciB2YWx1ZSBtYXkgYmUgbnVsbCBpZlxuICogdGhleSBhcmUgbm90IHByZXNlbnQgaW4gYHNlYXJjaFBhcmFtc2AuIFRoaXMgbWVhbnMgdGhhdCBzZWFyY2ggcGFyYW1ldGVycyBhcmUgYWx3YXlzIHRyZWF0ZWRcbiAqIGFzIG9wdGlvbmFsLlxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBcbiAqIG5ldyBVcmxNYXRjaGVyKCcvdXNlci97aWR9P3EmcicpLmV4ZWMoJy91c2VyL2JvYicsIHsgeDonMScsIHE6J2hlbGxvJyB9KTtcbiAqIC8vIHJldHVybnMgeyBpZDonYm9iJywgcTonaGVsbG8nLCByOm51bGwgfVxuICogYGBgXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdGggIFRoZSBVUkwgcGF0aCB0byBtYXRjaCwgZS5nLiBgJGxvY2F0aW9uLnBhdGgoKWAuXG4gKiBAcGFyYW0ge09iamVjdH0gc2VhcmNoUGFyYW1zICBVUkwgc2VhcmNoIHBhcmFtZXRlcnMsIGUuZy4gYCRsb2NhdGlvbi5zZWFyY2goKWAuXG4gKiBAcmV0dXJucyB7T2JqZWN0fSAgVGhlIGNhcHR1cmVkIHBhcmFtZXRlciB2YWx1ZXMuXG4gKi9cblVybE1hdGNoZXIucHJvdG90eXBlLmV4ZWMgPSBmdW5jdGlvbiAocGF0aCwgc2VhcmNoUGFyYW1zKSB7XG4gIHZhciBtID0gdGhpcy5yZWdleHAuZXhlYyhwYXRoKTtcbiAgaWYgKCFtKSByZXR1cm4gbnVsbDtcblxuICB2YXIgcGFyYW1zID0gdGhpcy5wYXJhbXMsIG5Ub3RhbCA9IHBhcmFtcy5sZW5ndGgsXG4gICAgblBhdGggPSB0aGlzLnNlZ21lbnRzLmxlbmd0aC0xLFxuICAgIHZhbHVlcyA9IHt9LCBpO1xuXG4gIGlmIChuUGF0aCAhPT0gbS5sZW5ndGggLSAxKSB0aHJvdyBuZXcgRXJyb3IoXCJVbmJhbGFuY2VkIGNhcHR1cmUgZ3JvdXAgaW4gcm91dGUgJ1wiICsgdGhpcy5zb3VyY2UgKyBcIidcIik7XG5cbiAgZm9yIChpPTA7IGk8blBhdGg7IGkrKykgdmFsdWVzW3BhcmFtc1tpXV0gPSBtW2krMV07XG4gIGZvciAoLyoqLzsgaTxuVG90YWw7IGkrKykgdmFsdWVzW3BhcmFtc1tpXV0gPSBzZWFyY2hQYXJhbXNbcGFyYW1zW2ldXTtcblxuICByZXR1cm4gdmFsdWVzO1xufTtcblxuLyoqXG4gKiBAbmdkb2MgZnVuY3Rpb25cbiAqIEBuYW1lIHVpLnJvdXRlci51dGlsLnR5cGU6VXJsTWF0Y2hlciNwYXJhbWV0ZXJzXG4gKiBAbWV0aG9kT2YgdWkucm91dGVyLnV0aWwudHlwZTpVcmxNYXRjaGVyXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBSZXR1cm5zIHRoZSBuYW1lcyBvZiBhbGwgcGF0aCBhbmQgc2VhcmNoIHBhcmFtZXRlcnMgb2YgdGhpcyBwYXR0ZXJuIGluIGFuIHVuc3BlY2lmaWVkIG9yZGVyLlxuICogXG4gKiBAcmV0dXJucyB7QXJyYXkuPHN0cmluZz59ICBBbiBhcnJheSBvZiBwYXJhbWV0ZXIgbmFtZXMuIE11c3QgYmUgdHJlYXRlZCBhcyByZWFkLW9ubHkuIElmIHRoZVxuICogICAgcGF0dGVybiBoYXMgbm8gcGFyYW1ldGVycywgYW4gZW1wdHkgYXJyYXkgaXMgcmV0dXJuZWQuXG4gKi9cblVybE1hdGNoZXIucHJvdG90eXBlLnBhcmFtZXRlcnMgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiB0aGlzLnBhcmFtcztcbn07XG5cbi8qKlxuICogQG5nZG9jIGZ1bmN0aW9uXG4gKiBAbmFtZSB1aS5yb3V0ZXIudXRpbC50eXBlOlVybE1hdGNoZXIjZm9ybWF0XG4gKiBAbWV0aG9kT2YgdWkucm91dGVyLnV0aWwudHlwZTpVcmxNYXRjaGVyXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBDcmVhdGVzIGEgVVJMIHRoYXQgbWF0Y2hlcyB0aGlzIHBhdHRlcm4gYnkgc3Vic3RpdHV0aW5nIHRoZSBzcGVjaWZpZWQgdmFsdWVzXG4gKiBmb3IgdGhlIHBhdGggYW5kIHNlYXJjaCBwYXJhbWV0ZXJzLiBOdWxsIHZhbHVlcyBmb3IgcGF0aCBwYXJhbWV0ZXJzIGFyZVxuICogdHJlYXRlZCBhcyBlbXB0eSBzdHJpbmdzLlxuICpcbiAqIEBleGFtcGxlXG4gKiBgYGBcbiAqIG5ldyBVcmxNYXRjaGVyKCcvdXNlci97aWR9P3EnKS5mb3JtYXQoeyBpZDonYm9iJywgcToneWVzJyB9KTtcbiAqIC8vIHJldHVybnMgJy91c2VyL2JvYj9xPXllcydcbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZXMgIHRoZSB2YWx1ZXMgdG8gc3Vic3RpdHV0ZSBmb3IgdGhlIHBhcmFtZXRlcnMgaW4gdGhpcyBwYXR0ZXJuLlxuICogQHJldHVybnMge3N0cmluZ30gIHRoZSBmb3JtYXR0ZWQgVVJMIChwYXRoIGFuZCBvcHRpb25hbGx5IHNlYXJjaCBwYXJ0KS5cbiAqL1xuVXJsTWF0Y2hlci5wcm90b3R5cGUuZm9ybWF0ID0gZnVuY3Rpb24gKHZhbHVlcykge1xuICB2YXIgc2VnbWVudHMgPSB0aGlzLnNlZ21lbnRzLCBwYXJhbXMgPSB0aGlzLnBhcmFtcztcbiAgaWYgKCF2YWx1ZXMpIHJldHVybiBzZWdtZW50cy5qb2luKCcnKTtcblxuICB2YXIgblBhdGggPSBzZWdtZW50cy5sZW5ndGgtMSwgblRvdGFsID0gcGFyYW1zLmxlbmd0aCxcbiAgICByZXN1bHQgPSBzZWdtZW50c1swXSwgaSwgc2VhcmNoLCB2YWx1ZTtcblxuICBmb3IgKGk9MDsgaTxuUGF0aDsgaSsrKSB7XG4gICAgdmFsdWUgPSB2YWx1ZXNbcGFyYW1zW2ldXTtcbiAgICAvLyBUT0RPOiBNYXliZSB3ZSBzaG91bGQgdGhyb3cgb24gbnVsbCBoZXJlPyBJdCdzIG5vdCByZWFsbHkgZ29vZCBzdHlsZSB0byB1c2UgJycgYW5kIG51bGwgaW50ZXJjaGFuZ2VhYmxleVxuICAgIGlmICh2YWx1ZSAhPSBudWxsKSByZXN1bHQgKz0gZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcbiAgICByZXN1bHQgKz0gc2VnbWVudHNbaSsxXTtcbiAgfVxuICBmb3IgKC8qKi87IGk8blRvdGFsOyBpKyspIHtcbiAgICB2YWx1ZSA9IHZhbHVlc1twYXJhbXNbaV1dO1xuICAgIGlmICh2YWx1ZSAhPSBudWxsKSB7XG4gICAgICByZXN1bHQgKz0gKHNlYXJjaCA/ICcmJyA6ICc/JykgKyBwYXJhbXNbaV0gKyAnPScgKyBlbmNvZGVVUklDb21wb25lbnQodmFsdWUpO1xuICAgICAgc2VhcmNoID0gdHJ1ZTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufTtcblxuXG5cbi8qKlxuICogQG5nZG9jIG9iamVjdFxuICogQG5hbWUgdWkucm91dGVyLnV0aWwuJHVybE1hdGNoZXJGYWN0b3J5XG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBGYWN0b3J5IGZvciB7QGxpbmsgdWkucm91dGVyLnV0aWwudHlwZTpVcmxNYXRjaGVyfSBpbnN0YW5jZXMuIFRoZSBmYWN0b3J5IGlzIGFsc28gYXZhaWxhYmxlIHRvIHByb3ZpZGVyc1xuICogdW5kZXIgdGhlIG5hbWUgYCR1cmxNYXRjaGVyRmFjdG9yeVByb3ZpZGVyYC5cbiAqL1xuZnVuY3Rpb24gJFVybE1hdGNoZXJGYWN0b3J5KCkge1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICogQG5hbWUgdWkucm91dGVyLnV0aWwuJHVybE1hdGNoZXJGYWN0b3J5I2NvbXBpbGVcbiAgICogQG1ldGhvZE9mIHVpLnJvdXRlci51dGlsLiR1cmxNYXRjaGVyRmFjdG9yeVxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogQ3JlYXRlcyBhIHtAbGluayB1aS5yb3V0ZXIudXRpbC50eXBlOlVybE1hdGNoZXJ9IGZvciB0aGUgc3BlY2lmaWVkIHBhdHRlcm4uXG4gICAqICAgXG4gICAqIEBwYXJhbSB7c3RyaW5nfSBwYXR0ZXJuICBUaGUgVVJMIHBhdHRlcm4uXG4gICAqIEByZXR1cm5zIHt1aS5yb3V0ZXIudXRpbC50eXBlOlVybE1hdGNoZXJ9ICBUaGUgVXJsTWF0Y2hlci5cbiAgICovXG4gIHRoaXMuY29tcGlsZSA9IGZ1bmN0aW9uIChwYXR0ZXJuKSB7XG4gICAgcmV0dXJuIG5ldyBVcmxNYXRjaGVyKHBhdHRlcm4pO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICogQG5hbWUgdWkucm91dGVyLnV0aWwuJHVybE1hdGNoZXJGYWN0b3J5I2lzTWF0Y2hlclxuICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnV0aWwuJHVybE1hdGNoZXJGYWN0b3J5XG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXR1cm5zIHRydWUgaWYgdGhlIHNwZWNpZmllZCBvYmplY3QgaXMgYSBVcmxNYXRjaGVyLCBvciBmYWxzZSBvdGhlcndpc2UuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmplY3QgIFRoZSBvYmplY3QgdG8gcGVyZm9ybSB0aGUgdHlwZSBjaGVjayBhZ2FpbnN0LlxuICAgKiBAcmV0dXJucyB7Qm9vbGVhbn0gIFJldHVybnMgYHRydWVgIGlmIHRoZSBvYmplY3QgaGFzIHRoZSBmb2xsb3dpbmcgZnVuY3Rpb25zOiBgZXhlY2AsIGBmb3JtYXRgLCBhbmQgYGNvbmNhdGAuXG4gICAqL1xuICB0aGlzLmlzTWF0Y2hlciA9IGZ1bmN0aW9uIChvKSB7XG4gICAgcmV0dXJuIGlzT2JqZWN0KG8pICYmIGlzRnVuY3Rpb24oby5leGVjKSAmJiBpc0Z1bmN0aW9uKG8uZm9ybWF0KSAmJiBpc0Z1bmN0aW9uKG8uY29uY2F0KTtcbiAgfTtcbiAgXG4gIC8qIE5vIG5lZWQgdG8gZG9jdW1lbnQgJGdldCwgc2luY2UgaXQgcmV0dXJucyB0aGlzICovXG4gIHRoaXMuJGdldCA9IGZ1bmN0aW9uICgpIHtcbiAgICByZXR1cm4gdGhpcztcbiAgfTtcbn1cblxuLy8gUmVnaXN0ZXIgYXMgYSBwcm92aWRlciBzbyBpdCdzIGF2YWlsYWJsZSB0byBvdGhlciBwcm92aWRlcnNcbmFuZ3VsYXIubW9kdWxlKCd1aS5yb3V0ZXIudXRpbCcpLnByb3ZpZGVyKCckdXJsTWF0Y2hlckZhY3RvcnknLCAkVXJsTWF0Y2hlckZhY3RvcnkpO1xuXG4vKipcbiAqIEBuZ2RvYyBvYmplY3RcbiAqIEBuYW1lIHVpLnJvdXRlci5yb3V0ZXIuJHVybFJvdXRlclByb3ZpZGVyXG4gKlxuICogQHJlcXVpcmVzIHVpLnJvdXRlci51dGlsLiR1cmxNYXRjaGVyRmFjdG9yeVByb3ZpZGVyXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBgJHVybFJvdXRlclByb3ZpZGVyYCBoYXMgdGhlIHJlc3BvbnNpYmlsaXR5IG9mIHdhdGNoaW5nIGAkbG9jYXRpb25gLiBcbiAqIFdoZW4gYCRsb2NhdGlvbmAgY2hhbmdlcyBpdCBydW5zIHRocm91Z2ggYSBsaXN0IG9mIHJ1bGVzIG9uZSBieSBvbmUgdW50aWwgYSBcbiAqIG1hdGNoIGlzIGZvdW5kLiBgJHVybFJvdXRlclByb3ZpZGVyYCBpcyB1c2VkIGJlaGluZCB0aGUgc2NlbmVzIGFueXRpbWUgeW91IHNwZWNpZnkgXG4gKiBhIHVybCBpbiBhIHN0YXRlIGNvbmZpZ3VyYXRpb24uIEFsbCB1cmxzIGFyZSBjb21waWxlZCBpbnRvIGEgVXJsTWF0Y2hlciBvYmplY3QuXG4gKlxuICogVGhlcmUgYXJlIHNldmVyYWwgbWV0aG9kcyBvbiBgJHVybFJvdXRlclByb3ZpZGVyYCB0aGF0IG1ha2UgaXQgdXNlZnVsIHRvIHVzZSBkaXJlY3RseVxuICogaW4geW91ciBtb2R1bGUgY29uZmlnLlxuICovXG4kVXJsUm91dGVyUHJvdmlkZXIuJGluamVjdCA9IFsnJHVybE1hdGNoZXJGYWN0b3J5UHJvdmlkZXInXTtcbmZ1bmN0aW9uICRVcmxSb3V0ZXJQcm92aWRlciggICR1cmxNYXRjaGVyRmFjdG9yeSkge1xuICB2YXIgcnVsZXMgPSBbXSwgXG4gICAgICBvdGhlcndpc2UgPSBudWxsO1xuXG4gIC8vIFJldHVybnMgYSBzdHJpbmcgdGhhdCBpcyBhIHByZWZpeCBvZiBhbGwgc3RyaW5ncyBtYXRjaGluZyB0aGUgUmVnRXhwXG4gIGZ1bmN0aW9uIHJlZ0V4cFByZWZpeChyZSkge1xuICAgIHZhciBwcmVmaXggPSAvXlxcXigoPzpcXFxcW15hLXpBLVowLTldfFteXFxcXFxcW1xcXVxcXiQqKz8uKCl8e31dKykqKS8uZXhlYyhyZS5zb3VyY2UpO1xuICAgIHJldHVybiAocHJlZml4ICE9IG51bGwpID8gcHJlZml4WzFdLnJlcGxhY2UoL1xcXFwoLikvZywgXCIkMVwiKSA6ICcnO1xuICB9XG5cbiAgLy8gSW50ZXJwb2xhdGVzIG1hdGNoZWQgdmFsdWVzIGludG8gYSBTdHJpbmcucmVwbGFjZSgpLXN0eWxlIHBhdHRlcm5cbiAgZnVuY3Rpb24gaW50ZXJwb2xhdGUocGF0dGVybiwgbWF0Y2gpIHtcbiAgICByZXR1cm4gcGF0dGVybi5yZXBsYWNlKC9cXCQoXFwkfFxcZHsxLDJ9KS8sIGZ1bmN0aW9uIChtLCB3aGF0KSB7XG4gICAgICByZXR1cm4gbWF0Y2hbd2hhdCA9PT0gJyQnID8gMCA6IE51bWJlcih3aGF0KV07XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAqIEBuYW1lIHVpLnJvdXRlci5yb3V0ZXIuJHVybFJvdXRlclByb3ZpZGVyI3J1bGVcbiAgICogQG1ldGhvZE9mIHVpLnJvdXRlci5yb3V0ZXIuJHVybFJvdXRlclByb3ZpZGVyXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBEZWZpbmVzIHJ1bGVzIHRoYXQgYXJlIHVzZWQgYnkgYCR1cmxSb3V0ZXJQcm92aWRlciB0byBmaW5kIG1hdGNoZXMgZm9yXG4gICAqIHNwZWNpZmljIFVSTHMuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIDxwcmU+XG4gICAqIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyd1aS5yb3V0ZXIucm91dGVyJ10pO1xuICAgKlxuICAgKiBhcHAuY29uZmlnKGZ1bmN0aW9uICgkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICogICAvLyBIZXJlJ3MgYW4gZXhhbXBsZSBvZiBob3cgeW91IG1pZ2h0IGFsbG93IGNhc2UgaW5zZW5zaXRpdmUgdXJsc1xuICAgKiAgICR1cmxSb3V0ZXJQcm92aWRlci5ydWxlKGZ1bmN0aW9uICgkaW5qZWN0b3IsICRsb2NhdGlvbikge1xuICAgKiAgICAgdmFyIHBhdGggPSAkbG9jYXRpb24ucGF0aCgpLFxuICAgKiAgICAgICAgIG5vcm1hbGl6ZWQgPSBwYXRoLnRvTG93ZXJDYXNlKCk7XG4gICAqXG4gICAqICAgICBpZiAocGF0aCAhPT0gbm9ybWFsaXplZCkge1xuICAgKiAgICAgICByZXR1cm4gbm9ybWFsaXplZDtcbiAgICogICAgIH1cbiAgICogICB9KTtcbiAgICogfSk7XG4gICAqIDwvcHJlPlxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gcnVsZSBIYW5kbGVyIGZ1bmN0aW9uIHRoYXQgdGFrZXMgYCRpbmplY3RvcmAgYW5kIGAkbG9jYXRpb25gXG4gICAqIHNlcnZpY2VzIGFzIGFyZ3VtZW50cy4gWW91IGNhbiB1c2UgdGhlbSB0byByZXR1cm4gYSB2YWxpZCBwYXRoIGFzIGEgc3RyaW5nLlxuICAgKlxuICAgKiBAcmV0dXJuIHtvYmplY3R9ICR1cmxSb3V0ZXJQcm92aWRlciAtICR1cmxSb3V0ZXJQcm92aWRlciBpbnN0YW5jZVxuICAgKi9cbiAgdGhpcy5ydWxlID1cbiAgICBmdW5jdGlvbiAocnVsZSkge1xuICAgICAgaWYgKCFpc0Z1bmN0aW9uKHJ1bGUpKSB0aHJvdyBuZXcgRXJyb3IoXCIncnVsZScgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuICAgICAgcnVsZXMucHVzaChydWxlKTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBvYmplY3RcbiAgICogQG5hbWUgdWkucm91dGVyLnJvdXRlci4kdXJsUm91dGVyUHJvdmlkZXIjb3RoZXJ3aXNlXG4gICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIucm91dGVyLiR1cmxSb3V0ZXJQcm92aWRlclxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogRGVmaW5lcyBhIHBhdGggdGhhdCBpcyB1c2VkIHdoZW4gYW4gaW52YWxpZWQgcm91dGUgaXMgcmVxdWVzdGVkLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiA8cHJlPlxuICAgKiB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsndWkucm91dGVyLnJvdXRlciddKTtcbiAgICpcbiAgICogYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAqICAgLy8gaWYgdGhlIHBhdGggZG9lc24ndCBtYXRjaCBhbnkgb2YgdGhlIHVybHMgeW91IGNvbmZpZ3VyZWRcbiAgICogICAvLyBvdGhlcndpc2Ugd2lsbCB0YWtlIGNhcmUgb2Ygcm91dGluZyB0aGUgdXNlciB0byB0aGVcbiAgICogICAvLyBzcGVjaWZpZWQgdXJsXG4gICAqICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZSgnL2luZGV4Jyk7XG4gICAqXG4gICAqICAgLy8gRXhhbXBsZSBvZiB1c2luZyBmdW5jdGlvbiBydWxlIGFzIHBhcmFtXG4gICAqICAgJHVybFJvdXRlclByb3ZpZGVyLm90aGVyd2lzZShmdW5jdGlvbiAoJGluamVjdG9yLCAkbG9jYXRpb24pIHtcbiAgICogICAgIC4uLlxuICAgKiAgIH0pO1xuICAgKiB9KTtcbiAgICogPC9wcmU+XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gcnVsZSBUaGUgdXJsIHBhdGggeW91IHdhbnQgdG8gcmVkaXJlY3QgdG8gb3IgYSBmdW5jdGlvbiBcbiAgICogcnVsZSB0aGF0IHJldHVybnMgdGhlIHVybCBwYXRoLiBUaGUgZnVuY3Rpb24gdmVyc2lvbiBpcyBwYXNzZWQgdHdvIHBhcmFtczogXG4gICAqIGAkaW5qZWN0b3JgIGFuZCBgJGxvY2F0aW9uYCBzZXJ2aWNlcy5cbiAgICpcbiAgICogQHJldHVybiB7b2JqZWN0fSAkdXJsUm91dGVyUHJvdmlkZXIgLSAkdXJsUm91dGVyUHJvdmlkZXIgaW5zdGFuY2VcbiAgICovXG4gIHRoaXMub3RoZXJ3aXNlID1cbiAgICBmdW5jdGlvbiAocnVsZSkge1xuICAgICAgaWYgKGlzU3RyaW5nKHJ1bGUpKSB7XG4gICAgICAgIHZhciByZWRpcmVjdCA9IHJ1bGU7XG4gICAgICAgIHJ1bGUgPSBmdW5jdGlvbiAoKSB7IHJldHVybiByZWRpcmVjdDsgfTtcbiAgICAgIH1cbiAgICAgIGVsc2UgaWYgKCFpc0Z1bmN0aW9uKHJ1bGUpKSB0aHJvdyBuZXcgRXJyb3IoXCIncnVsZScgbXVzdCBiZSBhIGZ1bmN0aW9uXCIpO1xuICAgICAgb3RoZXJ3aXNlID0gcnVsZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cblxuICBmdW5jdGlvbiBoYW5kbGVJZk1hdGNoKCRpbmplY3RvciwgaGFuZGxlciwgbWF0Y2gpIHtcbiAgICBpZiAoIW1hdGNoKSByZXR1cm4gZmFsc2U7XG4gICAgdmFyIHJlc3VsdCA9ICRpbmplY3Rvci5pbnZva2UoaGFuZGxlciwgaGFuZGxlciwgeyAkbWF0Y2g6IG1hdGNoIH0pO1xuICAgIHJldHVybiBpc0RlZmluZWQocmVzdWx0KSA/IHJlc3VsdCA6IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAqIEBuYW1lIHVpLnJvdXRlci5yb3V0ZXIuJHVybFJvdXRlclByb3ZpZGVyI3doZW5cbiAgICogQG1ldGhvZE9mIHVpLnJvdXRlci5yb3V0ZXIuJHVybFJvdXRlclByb3ZpZGVyXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZWdpc3RlcnMgYSBoYW5kbGVyIGZvciBhIGdpdmVuIHVybCBtYXRjaGluZy4gaWYgaGFuZGxlIGlzIGEgc3RyaW5nLCBpdCBpc1xuICAgKiB0cmVhdGVkIGFzIGEgcmVkaXJlY3QsIGFuZCBpcyBpbnRlcnBvbGF0ZWQgYWNjb3JkaW5nIHRvIHRoZSBzeXludGF4IG9mIG1hdGNoXG4gICAqIChpLmUuIGxpa2UgU3RyaW5nLnJlcGxhY2UoKSBmb3IgUmVnRXhwLCBvciBsaWtlIGEgVXJsTWF0Y2hlciBwYXR0ZXJuIG90aGVyd2lzZSkuXG4gICAqXG4gICAqIElmIHRoZSBoYW5kbGVyIGlzIGEgZnVuY3Rpb24sIGl0IGlzIGluamVjdGFibGUuIEl0IGdldHMgaW52b2tlZCBpZiBgJGxvY2F0aW9uYFxuICAgKiBtYXRjaGVzLiBZb3UgaGF2ZSB0aGUgb3B0aW9uIG9mIGluamVjdCB0aGUgbWF0Y2ggb2JqZWN0IGFzIGAkbWF0Y2hgLlxuICAgKlxuICAgKiBUaGUgaGFuZGxlciBjYW4gcmV0dXJuXG4gICAqXG4gICAqIC0gKipmYWxzeSoqIHRvIGluZGljYXRlIHRoYXQgdGhlIHJ1bGUgZGlkbid0IG1hdGNoIGFmdGVyIGFsbCwgdGhlbiBgJHVybFJvdXRlcmBcbiAgICogICB3aWxsIGNvbnRpbnVlIHRyeWluZyB0byBmaW5kIGFub3RoZXIgb25lIHRoYXQgbWF0Y2hlcy5cbiAgICogLSAqKnN0cmluZyoqIHdoaWNoIGlzIHRyZWF0ZWQgYXMgYSByZWRpcmVjdCBhbmQgcGFzc2VkIHRvIGAkbG9jYXRpb24udXJsKClgXG4gICAqIC0gKip2b2lkKiogb3IgYW55ICoqdHJ1dGh5KiogdmFsdWUgdGVsbHMgYCR1cmxSb3V0ZXJgIHRoYXQgdGhlIHVybCB3YXMgaGFuZGxlZC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogPHByZT5cbiAgICogdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbJ3VpLnJvdXRlci5yb3V0ZXInXSk7XG4gICAqXG4gICAqIGFwcC5jb25maWcoZnVuY3Rpb24gKCR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgKiAgICR1cmxSb3V0ZXJQcm92aWRlci53aGVuKCRzdGF0ZS51cmwsIGZ1bmN0aW9uICgkbWF0Y2gsICRzdGF0ZVBhcmFtcykge1xuICAgKiAgICAgaWYgKCRzdGF0ZS4kY3VycmVudC5uYXZpZ2FibGUgIT09IHN0YXRlIHx8XG4gICAqICAgICAgICAgIWVxdWFsRm9yS2V5cygkbWF0Y2gsICRzdGF0ZVBhcmFtcykge1xuICAgKiAgICAgICRzdGF0ZS50cmFuc2l0aW9uVG8oc3RhdGUsICRtYXRjaCwgZmFsc2UpO1xuICAgKiAgICAgfVxuICAgKiAgIH0pO1xuICAgKiB9KTtcbiAgICogPC9wcmU+XG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gd2hhdCBUaGUgaW5jb21pbmcgcGF0aCB0aGF0IHlvdSB3YW50IHRvIHJlZGlyZWN0LlxuICAgKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IGhhbmRsZXIgVGhlIHBhdGggeW91IHdhbnQgdG8gcmVkaXJlY3QgeW91ciB1c2VyIHRvLlxuICAgKi9cbiAgdGhpcy53aGVuID1cbiAgICBmdW5jdGlvbiAod2hhdCwgaGFuZGxlcikge1xuICAgICAgdmFyIHJlZGlyZWN0LCBoYW5kbGVySXNTdHJpbmcgPSBpc1N0cmluZyhoYW5kbGVyKTtcbiAgICAgIGlmIChpc1N0cmluZyh3aGF0KSkgd2hhdCA9ICR1cmxNYXRjaGVyRmFjdG9yeS5jb21waWxlKHdoYXQpO1xuXG4gICAgICBpZiAoIWhhbmRsZXJJc1N0cmluZyAmJiAhaXNGdW5jdGlvbihoYW5kbGVyKSAmJiAhaXNBcnJheShoYW5kbGVyKSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiaW52YWxpZCAnaGFuZGxlcicgaW4gd2hlbigpXCIpO1xuXG4gICAgICB2YXIgc3RyYXRlZ2llcyA9IHtcbiAgICAgICAgbWF0Y2hlcjogZnVuY3Rpb24gKHdoYXQsIGhhbmRsZXIpIHtcbiAgICAgICAgICBpZiAoaGFuZGxlcklzU3RyaW5nKSB7XG4gICAgICAgICAgICByZWRpcmVjdCA9ICR1cmxNYXRjaGVyRmFjdG9yeS5jb21waWxlKGhhbmRsZXIpO1xuICAgICAgICAgICAgaGFuZGxlciA9IFsnJG1hdGNoJywgZnVuY3Rpb24gKCRtYXRjaCkgeyByZXR1cm4gcmVkaXJlY3QuZm9ybWF0KCRtYXRjaCk7IH1dO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZXh0ZW5kKGZ1bmN0aW9uICgkaW5qZWN0b3IsICRsb2NhdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZUlmTWF0Y2goJGluamVjdG9yLCBoYW5kbGVyLCB3aGF0LmV4ZWMoJGxvY2F0aW9uLnBhdGgoKSwgJGxvY2F0aW9uLnNlYXJjaCgpKSk7XG4gICAgICAgICAgfSwge1xuICAgICAgICAgICAgcHJlZml4OiBpc1N0cmluZyh3aGF0LnByZWZpeCkgPyB3aGF0LnByZWZpeCA6ICcnXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0sXG4gICAgICAgIHJlZ2V4OiBmdW5jdGlvbiAod2hhdCwgaGFuZGxlcikge1xuICAgICAgICAgIGlmICh3aGF0Lmdsb2JhbCB8fCB3aGF0LnN0aWNreSkgdGhyb3cgbmV3IEVycm9yKFwid2hlbigpIFJlZ0V4cCBtdXN0IG5vdCBiZSBnbG9iYWwgb3Igc3RpY2t5XCIpO1xuXG4gICAgICAgICAgaWYgKGhhbmRsZXJJc1N0cmluZykge1xuICAgICAgICAgICAgcmVkaXJlY3QgPSBoYW5kbGVyO1xuICAgICAgICAgICAgaGFuZGxlciA9IFsnJG1hdGNoJywgZnVuY3Rpb24gKCRtYXRjaCkgeyByZXR1cm4gaW50ZXJwb2xhdGUocmVkaXJlY3QsICRtYXRjaCk7IH1dO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZXh0ZW5kKGZ1bmN0aW9uICgkaW5qZWN0b3IsICRsb2NhdGlvbikge1xuICAgICAgICAgICAgcmV0dXJuIGhhbmRsZUlmTWF0Y2goJGluamVjdG9yLCBoYW5kbGVyLCB3aGF0LmV4ZWMoJGxvY2F0aW9uLnBhdGgoKSkpO1xuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIHByZWZpeDogcmVnRXhwUHJlZml4KHdoYXQpXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHZhciBjaGVjayA9IHsgbWF0Y2hlcjogJHVybE1hdGNoZXJGYWN0b3J5LmlzTWF0Y2hlcih3aGF0KSwgcmVnZXg6IHdoYXQgaW5zdGFuY2VvZiBSZWdFeHAgfTtcblxuICAgICAgZm9yICh2YXIgbiBpbiBjaGVjaykge1xuICAgICAgICBpZiAoY2hlY2tbbl0pIHtcbiAgICAgICAgICByZXR1cm4gdGhpcy5ydWxlKHN0cmF0ZWdpZXNbbl0od2hhdCwgaGFuZGxlcikpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRocm93IG5ldyBFcnJvcihcImludmFsaWQgJ3doYXQnIGluIHdoZW4oKVwiKTtcbiAgICB9O1xuXG4gIC8qKlxuICAgKiBAbmdkb2Mgb2JqZWN0XG4gICAqIEBuYW1lIHVpLnJvdXRlci5yb3V0ZXIuJHVybFJvdXRlclxuICAgKlxuICAgKiBAcmVxdWlyZXMgJGxvY2F0aW9uXG4gICAqIEByZXF1aXJlcyAkcm9vdFNjb3BlXG4gICAqIEByZXF1aXJlcyAkaW5qZWN0b3JcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqXG4gICAqL1xuICB0aGlzLiRnZXQgPVxuICAgIFsgICAgICAgICckbG9jYXRpb24nLCAnJHJvb3RTY29wZScsICckaW5qZWN0b3InLFxuICAgIGZ1bmN0aW9uICgkbG9jYXRpb24sICAgJHJvb3RTY29wZSwgICAkaW5qZWN0b3IpIHtcbiAgICAgIC8vIFRPRE86IE9wdGltaXplIGdyb3VwcyBvZiBydWxlcyB3aXRoIG5vbi1lbXB0eSBwcmVmaXggaW50byBzb21lIHNvcnQgb2YgZGVjaXNpb24gdHJlZVxuICAgICAgZnVuY3Rpb24gdXBkYXRlKGV2dCkge1xuICAgICAgICBpZiAoZXZ0ICYmIGV2dC5kZWZhdWx0UHJldmVudGVkKSByZXR1cm47XG4gICAgICAgIGZ1bmN0aW9uIGNoZWNrKHJ1bGUpIHtcbiAgICAgICAgICB2YXIgaGFuZGxlZCA9IHJ1bGUoJGluamVjdG9yLCAkbG9jYXRpb24pO1xuICAgICAgICAgIGlmIChoYW5kbGVkKSB7XG4gICAgICAgICAgICBpZiAoaXNTdHJpbmcoaGFuZGxlZCkpICRsb2NhdGlvbi5yZXBsYWNlKCkudXJsKGhhbmRsZWQpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgfVxuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgbj1ydWxlcy5sZW5ndGgsIGk7XG4gICAgICAgIGZvciAoaT0wOyBpPG47IGkrKykge1xuICAgICAgICAgIGlmIChjaGVjayhydWxlc1tpXSkpIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICAvLyBhbHdheXMgY2hlY2sgb3RoZXJ3aXNlIGxhc3QgdG8gYWxsb3cgZHluYW1pYyB1cGRhdGVzIHRvIHRoZSBzZXQgb2YgcnVsZXNcbiAgICAgICAgaWYgKG90aGVyd2lzZSkgY2hlY2sob3RoZXJ3aXNlKTtcbiAgICAgIH1cblxuICAgICAgJHJvb3RTY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN1Y2Nlc3MnLCB1cGRhdGUpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICAvKipcbiAgICAgICAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAgICAgICAqIEBuYW1lIHVpLnJvdXRlci5yb3V0ZXIuJHVybFJvdXRlciNzeW5jXG4gICAgICAgICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIucm91dGVyLiR1cmxSb3V0ZXJcbiAgICAgICAgICpcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIFRyaWdnZXJzIGFuIHVwZGF0ZTsgdGhlIHNhbWUgdXBkYXRlIHRoYXQgaGFwcGVucyB3aGVuIHRoZSBhZGRyZXNzIGJhciB1cmwgY2hhbmdlcywgYWthIGAkbG9jYXRpb25DaGFuZ2VTdWNjZXNzYC5cbiAgICAgICAgICogVGhpcyBtZXRob2QgaXMgdXNlZnVsIHdoZW4geW91IG5lZWQgdG8gdXNlIGBwcmV2ZW50RGVmYXVsdCgpYCBvbiB0aGUgYCRsb2NhdGlvbkNoYW5nZVN1Y2Nlc3NgIGV2ZW50LCBcbiAgICAgICAgICogcGVyZm9ybSBzb21lIGN1c3RvbSBsb2dpYyAocm91dGUgcHJvdGVjdGlvbiwgYXV0aCwgY29uZmlnLCByZWRpcmVjdGlvbiwgZXRjKSBhbmQgdGhlbiBmaW5hbGx5IHByb2NlZWQgXG4gICAgICAgICAqIHdpdGggdGhlIHRyYW5zaXRpb24gYnkgY2FsbGluZyBgJHVybFJvdXRlci5zeW5jKClgLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKiA8cHJlPlxuICAgICAgICAgKiBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyd1aS5yb3V0ZXInXSk7XG4gICAgICAgICAqICAgLnJ1bihmdW5jdGlvbigkcm9vdFNjb3BlLCAkdXJsUm91dGVyKSB7XG4gICAgICAgICAqICAgICAkcm9vdFNjb3BlLiRvbignJGxvY2F0aW9uQ2hhbmdlU3VjY2VzcycsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICAgKiAgICAgICAvLyBIYWx0IHN0YXRlIGNoYW5nZSBmcm9tIGV2ZW4gc3RhcnRpbmdcbiAgICAgICAgICogICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAqICAgICAgIC8vIFBlcmZvcm0gY3VzdG9tIGxvZ2ljXG4gICAgICAgICAqICAgICAgIHZhciBtZWV0c1JlcXVpcmVtZW50ID0gLi4uXG4gICAgICAgICAqICAgICAgIC8vIENvbnRpbnVlIHdpdGggdGhlIHVwZGF0ZSBhbmQgc3RhdGUgdHJhbnNpdGlvbiBpZiBsb2dpYyBhbGxvd3NcbiAgICAgICAgICogICAgICAgaWYgKG1lZXRzUmVxdWlyZW1lbnQpICR1cmxSb3V0ZXIuc3luYygpO1xuICAgICAgICAgKiAgICAgfSk7XG4gICAgICAgICAqIH0pO1xuICAgICAgICAgKiA8L3ByZT5cbiAgICAgICAgICovXG4gICAgICAgIHN5bmM6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICB1cGRhdGUoKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XTtcbn1cblxuYW5ndWxhci5tb2R1bGUoJ3VpLnJvdXRlci5yb3V0ZXInKS5wcm92aWRlcignJHVybFJvdXRlcicsICRVcmxSb3V0ZXJQcm92aWRlcik7XG5cbi8qKlxuICogQG5nZG9jIG9iamVjdFxuICogQG5hbWUgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVByb3ZpZGVyXG4gKlxuICogQHJlcXVpcmVzIHVpLnJvdXRlci5yb3V0ZXIuJHVybFJvdXRlclByb3ZpZGVyXG4gKiBAcmVxdWlyZXMgdWkucm91dGVyLnV0aWwuJHVybE1hdGNoZXJGYWN0b3J5UHJvdmlkZXJcbiAqIEByZXF1aXJlcyAkbG9jYXRpb25Qcm92aWRlclxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogVGhlIG5ldyBgJHN0YXRlUHJvdmlkZXJgIHdvcmtzIHNpbWlsYXIgdG8gQW5ndWxhcidzIHYxIHJvdXRlciwgYnV0IGl0IGZvY3VzZXMgcHVyZWx5XG4gKiBvbiBzdGF0ZS5cbiAqXG4gKiBBIHN0YXRlIGNvcnJlc3BvbmRzIHRvIGEgXCJwbGFjZVwiIGluIHRoZSBhcHBsaWNhdGlvbiBpbiB0ZXJtcyBvZiB0aGUgb3ZlcmFsbCBVSSBhbmRcbiAqIG5hdmlnYXRpb24uIEEgc3RhdGUgZGVzY3JpYmVzICh2aWEgdGhlIGNvbnRyb2xsZXIgLyB0ZW1wbGF0ZSAvIHZpZXcgcHJvcGVydGllcykgd2hhdFxuICogdGhlIFVJIGxvb2tzIGxpa2UgYW5kIGRvZXMgYXQgdGhhdCBwbGFjZS5cbiAqXG4gKiBTdGF0ZXMgb2Z0ZW4gaGF2ZSB0aGluZ3MgaW4gY29tbW9uLCBhbmQgdGhlIHByaW1hcnkgd2F5IG9mIGZhY3RvcmluZyBvdXQgdGhlc2VcbiAqIGNvbW1vbmFsaXRpZXMgaW4gdGhpcyBtb2RlbCBpcyB2aWEgdGhlIHN0YXRlIGhpZXJhcmNoeSwgaS5lLiBwYXJlbnQvY2hpbGQgc3RhdGVzIGFrYVxuICogbmVzdGVkIHN0YXRlcy5cbiAqXG4gKiBUaGUgYCRzdGF0ZVByb3ZpZGVyYCBwcm92aWRlcyBpbnRlcmZhY2VzIHRvIGRlY2xhcmUgdGhlc2Ugc3RhdGVzIGZvciB5b3VyIGFwcC5cbiAqL1xuJFN0YXRlUHJvdmlkZXIuJGluamVjdCA9IFsnJHVybFJvdXRlclByb3ZpZGVyJywgJyR1cmxNYXRjaGVyRmFjdG9yeVByb3ZpZGVyJywgJyRsb2NhdGlvblByb3ZpZGVyJ107XG5mdW5jdGlvbiAkU3RhdGVQcm92aWRlciggICAkdXJsUm91dGVyUHJvdmlkZXIsICAgJHVybE1hdGNoZXJGYWN0b3J5LCAgICAgICAgICAgJGxvY2F0aW9uUHJvdmlkZXIpIHtcblxuICB2YXIgcm9vdCwgc3RhdGVzID0ge30sICRzdGF0ZSwgcXVldWUgPSB7fSwgYWJzdHJhY3RLZXkgPSAnYWJzdHJhY3QnO1xuXG4gIC8vIEJ1aWxkcyBzdGF0ZSBwcm9wZXJ0aWVzIGZyb20gZGVmaW5pdGlvbiBwYXNzZWQgdG8gcmVnaXN0ZXJTdGF0ZSgpXG4gIHZhciBzdGF0ZUJ1aWxkZXIgPSB7XG5cbiAgICAvLyBEZXJpdmUgcGFyZW50IHN0YXRlIGZyb20gYSBoaWVyYXJjaGljYWwgbmFtZSBvbmx5IGlmICdwYXJlbnQnIGlzIG5vdCBleHBsaWNpdGx5IGRlZmluZWQuXG4gICAgLy8gc3RhdGUuY2hpbGRyZW4gPSBbXTtcbiAgICAvLyBpZiAocGFyZW50KSBwYXJlbnQuY2hpbGRyZW4ucHVzaChzdGF0ZSk7XG4gICAgcGFyZW50OiBmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgaWYgKGlzRGVmaW5lZChzdGF0ZS5wYXJlbnQpICYmIHN0YXRlLnBhcmVudCkgcmV0dXJuIGZpbmRTdGF0ZShzdGF0ZS5wYXJlbnQpO1xuICAgICAgLy8gcmVnZXggbWF0Y2hlcyBhbnkgdmFsaWQgY29tcG9zaXRlIHN0YXRlIG5hbWVcbiAgICAgIC8vIHdvdWxkIG1hdGNoIFwiY29udGFjdC5saXN0XCIgYnV0IG5vdCBcImNvbnRhY3RzXCJcbiAgICAgIHZhciBjb21wb3NpdGVOYW1lID0gL14oLispXFwuW14uXSskLy5leGVjKHN0YXRlLm5hbWUpO1xuICAgICAgcmV0dXJuIGNvbXBvc2l0ZU5hbWUgPyBmaW5kU3RhdGUoY29tcG9zaXRlTmFtZVsxXSkgOiByb290O1xuICAgIH0sXG5cbiAgICAvLyBpbmhlcml0ICdkYXRhJyBmcm9tIHBhcmVudCBhbmQgb3ZlcnJpZGUgYnkgb3duIHZhbHVlcyAoaWYgYW55KVxuICAgIGRhdGE6IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICBpZiAoc3RhdGUucGFyZW50ICYmIHN0YXRlLnBhcmVudC5kYXRhKSB7XG4gICAgICAgIHN0YXRlLmRhdGEgPSBzdGF0ZS5zZWxmLmRhdGEgPSBleHRlbmQoe30sIHN0YXRlLnBhcmVudC5kYXRhLCBzdGF0ZS5kYXRhKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBzdGF0ZS5kYXRhO1xuICAgIH0sXG5cbiAgICAvLyBCdWlsZCBhIFVSTE1hdGNoZXIgaWYgbmVjZXNzYXJ5LCBlaXRoZXIgdmlhIGEgcmVsYXRpdmUgb3IgYWJzb2x1dGUgVVJMXG4gICAgdXJsOiBmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgdmFyIHVybCA9IHN0YXRlLnVybDtcblxuICAgICAgaWYgKGlzU3RyaW5nKHVybCkpIHtcbiAgICAgICAgaWYgKHVybC5jaGFyQXQoMCkgPT0gJ14nKSB7XG4gICAgICAgICAgcmV0dXJuICR1cmxNYXRjaGVyRmFjdG9yeS5jb21waWxlKHVybC5zdWJzdHJpbmcoMSkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAoc3RhdGUucGFyZW50Lm5hdmlnYWJsZSB8fCByb290KS51cmwuY29uY2F0KHVybCk7XG4gICAgICB9XG5cbiAgICAgIGlmICgkdXJsTWF0Y2hlckZhY3RvcnkuaXNNYXRjaGVyKHVybCkgfHwgdXJsID09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIHVybDtcbiAgICAgIH1cbiAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdXJsICdcIiArIHVybCArIFwiJyBpbiBzdGF0ZSAnXCIgKyBzdGF0ZSArIFwiJ1wiKTtcbiAgICB9LFxuXG4gICAgLy8gS2VlcCB0cmFjayBvZiB0aGUgY2xvc2VzdCBhbmNlc3RvciBzdGF0ZSB0aGF0IGhhcyBhIFVSTCAoaS5lLiBpcyBuYXZpZ2FibGUpXG4gICAgbmF2aWdhYmxlOiBmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgcmV0dXJuIHN0YXRlLnVybCA/IHN0YXRlIDogKHN0YXRlLnBhcmVudCA/IHN0YXRlLnBhcmVudC5uYXZpZ2FibGUgOiBudWxsKTtcbiAgICB9LFxuXG4gICAgLy8gRGVyaXZlIHBhcmFtZXRlcnMgZm9yIHRoaXMgc3RhdGUgYW5kIGVuc3VyZSB0aGV5J3JlIGEgc3VwZXItc2V0IG9mIHBhcmVudCdzIHBhcmFtZXRlcnNcbiAgICBwYXJhbXM6IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICBpZiAoIXN0YXRlLnBhcmFtcykge1xuICAgICAgICByZXR1cm4gc3RhdGUudXJsID8gc3RhdGUudXJsLnBhcmFtZXRlcnMoKSA6IHN0YXRlLnBhcmVudC5wYXJhbXM7XG4gICAgICB9XG4gICAgICBpZiAoIWlzQXJyYXkoc3RhdGUucGFyYW1zKSkgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBwYXJhbXMgaW4gc3RhdGUgJ1wiICsgc3RhdGUgKyBcIidcIik7XG4gICAgICBpZiAoc3RhdGUudXJsKSB0aHJvdyBuZXcgRXJyb3IoXCJCb3RoIHBhcmFtcyBhbmQgdXJsIHNwZWNpY2lmaWVkIGluIHN0YXRlICdcIiArIHN0YXRlICsgXCInXCIpO1xuICAgICAgcmV0dXJuIHN0YXRlLnBhcmFtcztcbiAgICB9LFxuXG4gICAgLy8gSWYgdGhlcmUgaXMgbm8gZXhwbGljaXQgbXVsdGktdmlldyBjb25maWd1cmF0aW9uLCBtYWtlIG9uZSB1cCBzbyB3ZSBkb24ndCBoYXZlXG4gICAgLy8gdG8gaGFuZGxlIGJvdGggY2FzZXMgaW4gdGhlIHZpZXcgZGlyZWN0aXZlIGxhdGVyLiBOb3RlIHRoYXQgaGF2aW5nIGFuIGV4cGxpY2l0XG4gICAgLy8gJ3ZpZXdzJyBwcm9wZXJ0eSB3aWxsIG1lYW4gdGhlIGRlZmF1bHQgdW5uYW1lZCB2aWV3IHByb3BlcnRpZXMgYXJlIGlnbm9yZWQuIFRoaXNcbiAgICAvLyBpcyBhbHNvIGEgZ29vZCB0aW1lIHRvIHJlc29sdmUgdmlldyBuYW1lcyB0byBhYnNvbHV0ZSBuYW1lcywgc28gZXZlcnl0aGluZyBpcyBhXG4gICAgLy8gc3RyYWlnaHQgbG9va3VwIGF0IGxpbmsgdGltZS5cbiAgICB2aWV3czogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgIHZhciB2aWV3cyA9IHt9O1xuXG4gICAgICBmb3JFYWNoKGlzRGVmaW5lZChzdGF0ZS52aWV3cykgPyBzdGF0ZS52aWV3cyA6IHsgJyc6IHN0YXRlIH0sIGZ1bmN0aW9uICh2aWV3LCBuYW1lKSB7XG4gICAgICAgIGlmIChuYW1lLmluZGV4T2YoJ0AnKSA8IDApIG5hbWUgKz0gJ0AnICsgc3RhdGUucGFyZW50Lm5hbWU7XG4gICAgICAgIHZpZXdzW25hbWVdID0gdmlldztcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIHZpZXdzO1xuICAgIH0sXG5cbiAgICBvd25QYXJhbXM6IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICBpZiAoIXN0YXRlLnBhcmVudCkge1xuICAgICAgICByZXR1cm4gc3RhdGUucGFyYW1zO1xuICAgICAgfVxuICAgICAgdmFyIHBhcmFtTmFtZXMgPSB7fTsgZm9yRWFjaChzdGF0ZS5wYXJhbXMsIGZ1bmN0aW9uIChwKSB7IHBhcmFtTmFtZXNbcF0gPSB0cnVlOyB9KTtcblxuICAgICAgZm9yRWFjaChzdGF0ZS5wYXJlbnQucGFyYW1zLCBmdW5jdGlvbiAocCkge1xuICAgICAgICBpZiAoIXBhcmFtTmFtZXNbcF0pIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJNaXNzaW5nIHJlcXVpcmVkIHBhcmFtZXRlciAnXCIgKyBwICsgXCInIGluIHN0YXRlICdcIiArIHN0YXRlLm5hbWUgKyBcIidcIik7XG4gICAgICAgIH1cbiAgICAgICAgcGFyYW1OYW1lc1twXSA9IGZhbHNlO1xuICAgICAgfSk7XG4gICAgICB2YXIgb3duUGFyYW1zID0gW107XG5cbiAgICAgIGZvckVhY2gocGFyYW1OYW1lcywgZnVuY3Rpb24gKG93biwgcCkge1xuICAgICAgICBpZiAob3duKSBvd25QYXJhbXMucHVzaChwKTtcbiAgICAgIH0pO1xuICAgICAgcmV0dXJuIG93blBhcmFtcztcbiAgICB9LFxuXG4gICAgLy8gS2VlcCBhIGZ1bGwgcGF0aCBmcm9tIHRoZSByb290IGRvd24gdG8gdGhpcyBzdGF0ZSBhcyB0aGlzIGlzIG5lZWRlZCBmb3Igc3RhdGUgYWN0aXZhdGlvbi5cbiAgICBwYXRoOiBmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgcmV0dXJuIHN0YXRlLnBhcmVudCA/IHN0YXRlLnBhcmVudC5wYXRoLmNvbmNhdChzdGF0ZSkgOiBbXTsgLy8gZXhjbHVkZSByb290IGZyb20gcGF0aFxuICAgIH0sXG5cbiAgICAvLyBTcGVlZCB1cCAkc3RhdGUuY29udGFpbnMoKSBhcyBpdCdzIHVzZWQgYSBsb3RcbiAgICBpbmNsdWRlczogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgIHZhciBpbmNsdWRlcyA9IHN0YXRlLnBhcmVudCA/IGV4dGVuZCh7fSwgc3RhdGUucGFyZW50LmluY2x1ZGVzKSA6IHt9O1xuICAgICAgaW5jbHVkZXNbc3RhdGUubmFtZV0gPSB0cnVlO1xuICAgICAgcmV0dXJuIGluY2x1ZGVzO1xuICAgIH0sXG5cbiAgICAkZGVsZWdhdGVzOiB7fVxuICB9O1xuXG4gIGZ1bmN0aW9uIGlzUmVsYXRpdmUoc3RhdGVOYW1lKSB7XG4gICAgcmV0dXJuIHN0YXRlTmFtZS5pbmRleE9mKFwiLlwiKSA9PT0gMCB8fCBzdGF0ZU5hbWUuaW5kZXhPZihcIl5cIikgPT09IDA7XG4gIH1cblxuICBmdW5jdGlvbiBmaW5kU3RhdGUoc3RhdGVPck5hbWUsIGJhc2UpIHtcbiAgICB2YXIgaXNTdHIgPSBpc1N0cmluZyhzdGF0ZU9yTmFtZSksXG4gICAgICAgIG5hbWUgID0gaXNTdHIgPyBzdGF0ZU9yTmFtZSA6IHN0YXRlT3JOYW1lLm5hbWUsXG4gICAgICAgIHBhdGggID0gaXNSZWxhdGl2ZShuYW1lKTtcblxuICAgIGlmIChwYXRoKSB7XG4gICAgICBpZiAoIWJhc2UpIHRocm93IG5ldyBFcnJvcihcIk5vIHJlZmVyZW5jZSBwb2ludCBnaXZlbiBmb3IgcGF0aCAnXCIgICsgbmFtZSArIFwiJ1wiKTtcbiAgICAgIHZhciByZWwgPSBuYW1lLnNwbGl0KFwiLlwiKSwgaSA9IDAsIHBhdGhMZW5ndGggPSByZWwubGVuZ3RoLCBjdXJyZW50ID0gYmFzZTtcblxuICAgICAgZm9yICg7IGkgPCBwYXRoTGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKHJlbFtpXSA9PT0gXCJcIiAmJiBpID09PSAwKSB7XG4gICAgICAgICAgY3VycmVudCA9IGJhc2U7XG4gICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlbFtpXSA9PT0gXCJeXCIpIHtcbiAgICAgICAgICBpZiAoIWN1cnJlbnQucGFyZW50KSB0aHJvdyBuZXcgRXJyb3IoXCJQYXRoICdcIiArIG5hbWUgKyBcIicgbm90IHZhbGlkIGZvciBzdGF0ZSAnXCIgKyBiYXNlLm5hbWUgKyBcIidcIik7XG4gICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQucGFyZW50O1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGJyZWFrO1xuICAgICAgfVxuICAgICAgcmVsID0gcmVsLnNsaWNlKGkpLmpvaW4oXCIuXCIpO1xuICAgICAgbmFtZSA9IGN1cnJlbnQubmFtZSArIChjdXJyZW50Lm5hbWUgJiYgcmVsID8gXCIuXCIgOiBcIlwiKSArIHJlbDtcbiAgICB9XG4gICAgdmFyIHN0YXRlID0gc3RhdGVzW25hbWVdO1xuXG4gICAgaWYgKHN0YXRlICYmIChpc1N0ciB8fCAoIWlzU3RyICYmIChzdGF0ZSA9PT0gc3RhdGVPck5hbWUgfHwgc3RhdGUuc2VsZiA9PT0gc3RhdGVPck5hbWUpKSkpIHtcbiAgICAgIHJldHVybiBzdGF0ZTtcbiAgICB9XG4gICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHF1ZXVlU3RhdGUocGFyZW50TmFtZSwgc3RhdGUpIHtcbiAgICBpZiAoIXF1ZXVlW3BhcmVudE5hbWVdKSB7XG4gICAgICBxdWV1ZVtwYXJlbnROYW1lXSA9IFtdO1xuICAgIH1cbiAgICBxdWV1ZVtwYXJlbnROYW1lXS5wdXNoKHN0YXRlKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHJlZ2lzdGVyU3RhdGUoc3RhdGUpIHtcbiAgICAvLyBXcmFwIGEgbmV3IG9iamVjdCBhcm91bmQgdGhlIHN0YXRlIHNvIHdlIGNhbiBzdG9yZSBvdXIgcHJpdmF0ZSBkZXRhaWxzIGVhc2lseS5cbiAgICBzdGF0ZSA9IGluaGVyaXQoc3RhdGUsIHtcbiAgICAgIHNlbGY6IHN0YXRlLFxuICAgICAgcmVzb2x2ZTogc3RhdGUucmVzb2x2ZSB8fCB7fSxcbiAgICAgIHRvU3RyaW5nOiBmdW5jdGlvbigpIHsgcmV0dXJuIHRoaXMubmFtZTsgfVxuICAgIH0pO1xuXG4gICAgdmFyIG5hbWUgPSBzdGF0ZS5uYW1lO1xuICAgIGlmICghaXNTdHJpbmcobmFtZSkgfHwgbmFtZS5pbmRleE9mKCdAJykgPj0gMCkgdGhyb3cgbmV3IEVycm9yKFwiU3RhdGUgbXVzdCBoYXZlIGEgdmFsaWQgbmFtZVwiKTtcbiAgICBpZiAoc3RhdGVzLmhhc093blByb3BlcnR5KG5hbWUpKSB0aHJvdyBuZXcgRXJyb3IoXCJTdGF0ZSAnXCIgKyBuYW1lICsgXCInJyBpcyBhbHJlYWR5IGRlZmluZWRcIik7XG5cbiAgICAvLyBHZXQgcGFyZW50IG5hbWVcbiAgICB2YXIgcGFyZW50TmFtZSA9IChuYW1lLmluZGV4T2YoJy4nKSAhPT0gLTEpID8gbmFtZS5zdWJzdHJpbmcoMCwgbmFtZS5sYXN0SW5kZXhPZignLicpKVxuICAgICAgICA6IChpc1N0cmluZyhzdGF0ZS5wYXJlbnQpKSA/IHN0YXRlLnBhcmVudFxuICAgICAgICA6ICcnO1xuXG4gICAgLy8gSWYgcGFyZW50IGlzIG5vdCByZWdpc3RlcmVkIHlldCwgYWRkIHN0YXRlIHRvIHF1ZXVlIGFuZCByZWdpc3RlciBsYXRlclxuICAgIGlmIChwYXJlbnROYW1lICYmICFzdGF0ZXNbcGFyZW50TmFtZV0pIHtcbiAgICAgIHJldHVybiBxdWV1ZVN0YXRlKHBhcmVudE5hbWUsIHN0YXRlLnNlbGYpO1xuICAgIH1cblxuICAgIGZvciAodmFyIGtleSBpbiBzdGF0ZUJ1aWxkZXIpIHtcbiAgICAgIGlmIChpc0Z1bmN0aW9uKHN0YXRlQnVpbGRlcltrZXldKSkgc3RhdGVba2V5XSA9IHN0YXRlQnVpbGRlcltrZXldKHN0YXRlLCBzdGF0ZUJ1aWxkZXIuJGRlbGVnYXRlc1trZXldKTtcbiAgICB9XG4gICAgc3RhdGVzW25hbWVdID0gc3RhdGU7XG5cbiAgICAvLyBSZWdpc3RlciB0aGUgc3RhdGUgaW4gdGhlIGdsb2JhbCBzdGF0ZSBsaXN0IGFuZCB3aXRoICR1cmxSb3V0ZXIgaWYgbmVjZXNzYXJ5LlxuICAgIGlmICghc3RhdGVbYWJzdHJhY3RLZXldICYmIHN0YXRlLnVybCkge1xuICAgICAgJHVybFJvdXRlclByb3ZpZGVyLndoZW4oc3RhdGUudXJsLCBbJyRtYXRjaCcsICckc3RhdGVQYXJhbXMnLCBmdW5jdGlvbiAoJG1hdGNoLCAkc3RhdGVQYXJhbXMpIHtcbiAgICAgICAgaWYgKCRzdGF0ZS4kY3VycmVudC5uYXZpZ2FibGUgIT0gc3RhdGUgfHwgIWVxdWFsRm9yS2V5cygkbWF0Y2gsICRzdGF0ZVBhcmFtcykpIHtcbiAgICAgICAgICAkc3RhdGUudHJhbnNpdGlvblRvKHN0YXRlLCAkbWF0Y2gsIHsgbG9jYXRpb246IGZhbHNlIH0pO1xuICAgICAgICB9XG4gICAgICB9XSk7XG4gICAgfVxuXG4gICAgLy8gUmVnaXN0ZXIgYW55IHF1ZXVlZCBjaGlsZHJlblxuICAgIGlmIChxdWV1ZVtuYW1lXSkge1xuICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBxdWV1ZVtuYW1lXS5sZW5ndGg7IGkrKykge1xuICAgICAgICByZWdpc3RlclN0YXRlKHF1ZXVlW25hbWVdW2ldKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc3RhdGU7XG4gIH1cblxuICAvLyBDaGVja3MgdGV4dCB0byBzZWUgaWYgaXQgbG9va3MgbGlrZSBhIGdsb2IuXG4gIGZ1bmN0aW9uIGlzR2xvYiAodGV4dCkge1xuICAgIHJldHVybiB0ZXh0LmluZGV4T2YoJyonKSA+IC0xO1xuICB9XG5cbiAgLy8gUmV0dXJucyB0cnVlIGlmIGdsb2IgbWF0Y2hlcyBjdXJyZW50ICRzdGF0ZSBuYW1lLlxuICBmdW5jdGlvbiBkb2VzU3RhdGVNYXRjaEdsb2IgKGdsb2IpIHtcbiAgICB2YXIgZ2xvYlNlZ21lbnRzID0gZ2xvYi5zcGxpdCgnLicpLFxuICAgICAgICBzZWdtZW50cyA9ICRzdGF0ZS4kY3VycmVudC5uYW1lLnNwbGl0KCcuJyk7XG5cbiAgICAvL21hdGNoIGdyZWVkeSBzdGFydHNcbiAgICBpZiAoZ2xvYlNlZ21lbnRzWzBdID09PSAnKionKSB7XG4gICAgICAgc2VnbWVudHMgPSBzZWdtZW50cy5zbGljZShzZWdtZW50cy5pbmRleE9mKGdsb2JTZWdtZW50c1sxXSkpO1xuICAgICAgIHNlZ21lbnRzLnVuc2hpZnQoJyoqJyk7XG4gICAgfVxuICAgIC8vbWF0Y2ggZ3JlZWR5IGVuZHNcbiAgICBpZiAoZ2xvYlNlZ21lbnRzW2dsb2JTZWdtZW50cy5sZW5ndGggLSAxXSA9PT0gJyoqJykge1xuICAgICAgIHNlZ21lbnRzLnNwbGljZShzZWdtZW50cy5pbmRleE9mKGdsb2JTZWdtZW50c1tnbG9iU2VnbWVudHMubGVuZ3RoIC0gMl0pICsgMSwgTnVtYmVyLk1BWF9WQUxVRSk7XG4gICAgICAgc2VnbWVudHMucHVzaCgnKionKTtcbiAgICB9XG5cbiAgICBpZiAoZ2xvYlNlZ21lbnRzLmxlbmd0aCAhPSBzZWdtZW50cy5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvL21hdGNoIHNpbmdsZSBzdGFyc1xuICAgIGZvciAodmFyIGkgPSAwLCBsID0gZ2xvYlNlZ21lbnRzLmxlbmd0aDsgaSA8IGw7IGkrKykge1xuICAgICAgaWYgKGdsb2JTZWdtZW50c1tpXSA9PT0gJyonKSB7XG4gICAgICAgIHNlZ21lbnRzW2ldID0gJyonO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBzZWdtZW50cy5qb2luKCcnKSA9PT0gZ2xvYlNlZ21lbnRzLmpvaW4oJycpO1xuICB9XG5cblxuICAvLyBJbXBsaWNpdCByb290IHN0YXRlIHRoYXQgaXMgYWx3YXlzIGFjdGl2ZVxuICByb290ID0gcmVnaXN0ZXJTdGF0ZSh7XG4gICAgbmFtZTogJycsXG4gICAgdXJsOiAnXicsXG4gICAgdmlld3M6IG51bGwsXG4gICAgJ2Fic3RyYWN0JzogdHJ1ZVxuICB9KTtcbiAgcm9vdC5uYXZpZ2FibGUgPSBudWxsO1xuXG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlUHJvdmlkZXIjZGVjb3JhdG9yXG4gICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlUHJvdmlkZXJcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIEFsbG93cyB5b3UgdG8gZXh0ZW5kIChjYXJlZnVsbHkpIG9yIG92ZXJyaWRlIChhdCB5b3VyIG93biBwZXJpbCkgdGhlIFxuICAgKiBgc3RhdGVCdWlsZGVyYCBvYmplY3QgdXNlZCBpbnRlcm5hbGx5IGJ5IGAkc3RhdGVQcm92aWRlcmAuIFRoaXMgY2FuIGJlIHVzZWQgXG4gICAqIHRvIGFkZCBjdXN0b20gZnVuY3Rpb25hbGl0eSB0byB1aS1yb3V0ZXIsIGZvciBleGFtcGxlIGluZmVycmluZyB0ZW1wbGF0ZVVybCBcbiAgICogYmFzZWQgb24gdGhlIHN0YXRlIG5hbWUuXG4gICAqXG4gICAqIFdoZW4gcGFzc2luZyBvbmx5IGEgbmFtZSwgaXQgcmV0dXJucyB0aGUgY3VycmVudCAob3JpZ2luYWwgb3IgZGVjb3JhdGVkKSBidWlsZGVyXG4gICAqIGZ1bmN0aW9uIHRoYXQgbWF0Y2hlcyBgbmFtZWAuXG4gICAqXG4gICAqIFRoZSBidWlsZGVyIGZ1bmN0aW9ucyB0aGF0IGNhbiBiZSBkZWNvcmF0ZWQgYXJlIGxpc3RlZCBiZWxvdy4gVGhvdWdoIG5vdCBhbGxcbiAgICogbmVjZXNzYXJpbHkgaGF2ZSBhIGdvb2QgdXNlIGNhc2UgZm9yIGRlY29yYXRpb24sIHRoYXQgaXMgdXAgdG8geW91IHRvIGRlY2lkZS5cbiAgICpcbiAgICogSW4gYWRkaXRpb24sIHVzZXJzIGNhbiBhdHRhY2ggY3VzdG9tIGRlY29yYXRvcnMsIHdoaWNoIHdpbGwgZ2VuZXJhdGUgbmV3IFxuICAgKiBwcm9wZXJ0aWVzIHdpdGhpbiB0aGUgc3RhdGUncyBpbnRlcm5hbCBkZWZpbml0aW9uLiBUaGVyZSBpcyBjdXJyZW50bHkgbm8gY2xlYXIgXG4gICAqIHVzZS1jYXNlIGZvciB0aGlzIGJleW9uZCBhY2Nlc3NpbmcgaW50ZXJuYWwgc3RhdGVzIChpLmUuICRzdGF0ZS4kY3VycmVudCksIFxuICAgKiBob3dldmVyLCBleHBlY3QgdGhpcyB0byBiZWNvbWUgaW5jcmVhc2luZ2x5IHJlbGV2YW50IGFzIHdlIGludHJvZHVjZSBhZGRpdGlvbmFsIFxuICAgKiBtZXRhLXByb2dyYW1taW5nIGZlYXR1cmVzLlxuICAgKlxuICAgKiAqKldhcm5pbmcqKjogRGVjb3JhdG9ycyBzaG91bGQgbm90IGJlIGludGVyZGVwZW5kZW50IGJlY2F1c2UgdGhlIG9yZGVyIG9mIFxuICAgKiBleGVjdXRpb24gb2YgdGhlIGJ1aWxkZXIgZnVuY3Rpb25zIGluIG5vbi1kZXRlcm1pbmlzdGljLiBCdWlsZGVyIGZ1bmN0aW9ucyBcbiAgICogc2hvdWxkIG9ubHkgYmUgZGVwZW5kZW50IG9uIHRoZSBzdGF0ZSBkZWZpbml0aW9uIG9iamVjdCBhbmQgc3VwZXIgZnVuY3Rpb24uXG4gICAqXG4gICAqXG4gICAqIEV4aXN0aW5nIGJ1aWxkZXIgZnVuY3Rpb25zIGFuZCBjdXJyZW50IHJldHVybiB2YWx1ZXM6XG4gICAqXG4gICAqIC0gKipwYXJlbnQqKiBge29iamVjdH1gIC0gcmV0dXJucyB0aGUgcGFyZW50IHN0YXRlIG9iamVjdC5cbiAgICogLSAqKmRhdGEqKiBge29iamVjdH1gIC0gcmV0dXJucyBzdGF0ZSBkYXRhLCBpbmNsdWRpbmcgYW55IGluaGVyaXRlZCBkYXRhIHRoYXQgaXMgbm90XG4gICAqICAgb3ZlcnJpZGRlbiBieSBvd24gdmFsdWVzIChpZiBhbnkpLlxuICAgKiAtICoqdXJsKiogYHtvYmplY3R9YCAtIHJldHVybnMgYSB7bGluayB1aS5yb3V0ZXIudXRpbC50eXBlOlVybE1hdGNoZXJ9IG9yIG51bGwuXG4gICAqIC0gKipuYXZpZ2FibGUqKiBge29iamVjdH1gIC0gcmV0dXJucyBjbG9zZXN0IGFuY2VzdG9yIHN0YXRlIHRoYXQgaGFzIGEgVVJMIChha2EgaXMgXG4gICAqICAgbmF2aWdhYmxlKS5cbiAgICogLSAqKnBhcmFtcyoqIGB7b2JqZWN0fWAgLSByZXR1cm5zIGFuIGFycmF5IG9mIHN0YXRlIHBhcmFtcyB0aGF0IGFyZSBlbnN1cmVkIHRvIFxuICAgKiAgIGJlIGEgc3VwZXItc2V0IG9mIHBhcmVudCdzIHBhcmFtcy5cbiAgICogLSAqKnZpZXdzKiogYHtvYmplY3R9YCAtIHJldHVybnMgYSB2aWV3cyBvYmplY3Qgd2hlcmUgZWFjaCBrZXkgaXMgYW4gYWJzb2x1dGUgdmlldyBcbiAgICogICBuYW1lIChpLmUuIFwidmlld05hbWVAc3RhdGVOYW1lXCIpIGFuZCBlYWNoIHZhbHVlIGlzIHRoZSBjb25maWcgb2JqZWN0IFxuICAgKiAgICh0ZW1wbGF0ZSwgY29udHJvbGxlcikgZm9yIHRoZSB2aWV3LiBFdmVuIHdoZW4geW91IGRvbid0IHVzZSB0aGUgdmlld3Mgb2JqZWN0IFxuICAgKiAgIGV4cGxpY2l0bHkgb24gYSBzdGF0ZSBjb25maWcsIG9uZSBpcyBzdGlsbCBjcmVhdGVkIGZvciB5b3UgaW50ZXJuYWxseS5cbiAgICogICBTbyBieSBkZWNvcmF0aW5nIHRoaXMgYnVpbGRlciBmdW5jdGlvbiB5b3UgaGF2ZSBhY2Nlc3MgdG8gZGVjb3JhdGluZyB0ZW1wbGF0ZSBcbiAgICogICBhbmQgY29udHJvbGxlciBwcm9wZXJ0aWVzLlxuICAgKiAtICoqb3duUGFyYW1zKiogYHtvYmplY3R9YCAtIHJldHVybnMgYW4gYXJyYXkgb2YgcGFyYW1zIHRoYXQgYmVsb25nIHRvIHRoZSBzdGF0ZSwgXG4gICAqICAgbm90IGluY2x1ZGluZyBhbnkgcGFyYW1zIGRlZmluZWQgYnkgYW5jZXN0b3Igc3RhdGVzLlxuICAgKiAtICoqcGF0aCoqIGB7c3RyaW5nfWAgLSByZXR1cm5zIHRoZSBmdWxsIHBhdGggZnJvbSB0aGUgcm9vdCBkb3duIHRvIHRoaXMgc3RhdGUuIFxuICAgKiAgIE5lZWRlZCBmb3Igc3RhdGUgYWN0aXZhdGlvbi5cbiAgICogLSAqKmluY2x1ZGVzKiogYHtvYmplY3R9YCAtIHJldHVybnMgYW4gb2JqZWN0IHRoYXQgaW5jbHVkZXMgZXZlcnkgc3RhdGUgdGhhdCBcbiAgICogICB3b3VsZCBwYXNzIGEgJyRzdGF0ZS5pbmNsdWRlcygpJyB0ZXN0LlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiA8cHJlPlxuICAgKiAvLyBPdmVycmlkZSB0aGUgaW50ZXJuYWwgJ3ZpZXdzJyBidWlsZGVyIHdpdGggYSBmdW5jdGlvbiB0aGF0IHRha2VzIHRoZSBzdGF0ZVxuICAgKiAvLyBkZWZpbml0aW9uLCBhbmQgYSByZWZlcmVuY2UgdG8gdGhlIGludGVybmFsIGZ1bmN0aW9uIGJlaW5nIG92ZXJyaWRkZW46XG4gICAqICRzdGF0ZVByb3ZpZGVyLmRlY29yYXRvcigndmlld3MnLCBmdW5jdGlvbiAoJHN0YXRlLCBwYXJlbnQpIHtcbiAgICogICB2YXIgcmVzdWx0ID0ge30sXG4gICAqICAgICAgIHZpZXdzID0gcGFyZW50KHN0YXRlKTtcbiAgICpcbiAgICogICBhbmd1bGFyLmZvckVhY2godmlldywgZnVuY3Rpb24gKGNvbmZpZywgbmFtZSkge1xuICAgKiAgICAgdmFyIGF1dG9OYW1lID0gKHN0YXRlLm5hbWUgKyAnLicgKyBuYW1lKS5yZXBsYWNlKCcuJywgJy8nKTtcbiAgICogICAgIGNvbmZpZy50ZW1wbGF0ZVVybCA9IGNvbmZpZy50ZW1wbGF0ZVVybCB8fCAnL3BhcnRpYWxzLycgKyBhdXRvTmFtZSArICcuaHRtbCc7XG4gICAqICAgICByZXN1bHRbbmFtZV0gPSBjb25maWc7XG4gICAqICAgfSk7XG4gICAqICAgcmV0dXJuIHJlc3VsdDtcbiAgICogfSk7XG4gICAqXG4gICAqICRzdGF0ZVByb3ZpZGVyLnN0YXRlKCdob21lJywge1xuICAgKiAgIHZpZXdzOiB7XG4gICAqICAgICAnY29udGFjdC5saXN0JzogeyBjb250cm9sbGVyOiAnTGlzdENvbnRyb2xsZXInIH0sXG4gICAqICAgICAnY29udGFjdC5pdGVtJzogeyBjb250cm9sbGVyOiAnSXRlbUNvbnRyb2xsZXInIH1cbiAgICogICB9XG4gICAqIH0pO1xuICAgKlxuICAgKiAvLyAuLi5cbiAgICpcbiAgICogJHN0YXRlLmdvKCdob21lJyk7XG4gICAqIC8vIEF1dG8tcG9wdWxhdGVzIGxpc3QgYW5kIGl0ZW0gdmlld3Mgd2l0aCAvcGFydGlhbHMvaG9tZS9jb250YWN0L2xpc3QuaHRtbCxcbiAgICogLy8gYW5kIC9wYXJ0aWFscy9ob21lL2NvbnRhY3QvaXRlbS5odG1sLCByZXNwZWN0aXZlbHkuXG4gICAqIDwvcHJlPlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBUaGUgbmFtZSBvZiB0aGUgYnVpbGRlciBmdW5jdGlvbiB0byBkZWNvcmF0ZS4gXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBmdW5jIEEgZnVuY3Rpb24gdGhhdCBpcyByZXNwb25zaWJsZSBmb3IgZGVjb3JhdGluZyB0aGUgb3JpZ2luYWwgXG4gICAqIGJ1aWxkZXIgZnVuY3Rpb24uIFRoZSBmdW5jdGlvbiByZWNlaXZlcyB0d28gcGFyYW1ldGVyczpcbiAgICpcbiAgICogICAtIGB7b2JqZWN0fWAgLSBzdGF0ZSAtIFRoZSBzdGF0ZSBjb25maWcgb2JqZWN0LlxuICAgKiAgIC0gYHtvYmplY3R9YCAtIHN1cGVyIC0gVGhlIG9yaWdpbmFsIGJ1aWxkZXIgZnVuY3Rpb24uXG4gICAqXG4gICAqIEByZXR1cm4ge29iamVjdH0gJHN0YXRlUHJvdmlkZXIgLSAkc3RhdGVQcm92aWRlciBpbnN0YW5jZVxuICAgKi9cbiAgdGhpcy5kZWNvcmF0b3IgPSBkZWNvcmF0b3I7XG4gIGZ1bmN0aW9uIGRlY29yYXRvcihuYW1lLCBmdW5jKSB7XG4gICAgLypqc2hpbnQgdmFsaWR0aGlzOiB0cnVlICovXG4gICAgaWYgKGlzU3RyaW5nKG5hbWUpICYmICFpc0RlZmluZWQoZnVuYykpIHtcbiAgICAgIHJldHVybiBzdGF0ZUJ1aWxkZXJbbmFtZV07XG4gICAgfVxuICAgIGlmICghaXNGdW5jdGlvbihmdW5jKSB8fCAhaXNTdHJpbmcobmFtZSkpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBpZiAoc3RhdGVCdWlsZGVyW25hbWVdICYmICFzdGF0ZUJ1aWxkZXIuJGRlbGVnYXRlc1tuYW1lXSkge1xuICAgICAgc3RhdGVCdWlsZGVyLiRkZWxlZ2F0ZXNbbmFtZV0gPSBzdGF0ZUJ1aWxkZXJbbmFtZV07XG4gICAgfVxuICAgIHN0YXRlQnVpbGRlcltuYW1lXSA9IGZ1bmM7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVQcm92aWRlciNzdGF0ZVxuICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVByb3ZpZGVyXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZWdpc3RlcnMgYSBzdGF0ZSBjb25maWd1cmF0aW9uIHVuZGVyIGEgZ2l2ZW4gc3RhdGUgbmFtZS4gVGhlIHN0YXRlQ29uZmlnIG9iamVjdFxuICAgKiBoYXMgdGhlIGZvbGxvd2luZyBhY2NlcHRhYmxlIHByb3BlcnRpZXMuXG4gICAqXG4gICAqIDxhIGlkPSd0ZW1wbGF0ZSc+PC9hPlxuICAgKlxuICAgKiAtICoqYHRlbXBsYXRlYCoqIC0ge3N0cmluZ3xmdW5jdGlvbj19IC0gaHRtbCB0ZW1wbGF0ZSBhcyBhIHN0cmluZyBvciBhIGZ1bmN0aW9uIHRoYXQgcmV0dXJuc1xuICAgKiAgIGFuIGh0bWwgdGVtcGxhdGUgYXMgYSBzdHJpbmcgd2hpY2ggc2hvdWxkIGJlIHVzZWQgYnkgdGhlIHVpVmlldyBkaXJlY3RpdmVzLiBUaGlzIHByb3BlcnR5IFxuICAgKiAgIHRha2VzIHByZWNlZGVuY2Ugb3ZlciB0ZW1wbGF0ZVVybC5cbiAgICogICBcbiAgICogICBJZiBgdGVtcGxhdGVgIGlzIGEgZnVuY3Rpb24sIGl0IHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIGZvbGxvd2luZyBwYXJhbWV0ZXJzOlxuICAgKlxuICAgKiAgIC0ge2FycmF5LiZsdDtvYmplY3QmZ3Q7fSAtIHN0YXRlIHBhcmFtZXRlcnMgZXh0cmFjdGVkIGZyb20gdGhlIGN1cnJlbnQgJGxvY2F0aW9uLnBhdGgoKSBieVxuICAgKiAgICAgYXBwbHlpbmcgdGhlIGN1cnJlbnQgc3RhdGVcbiAgICpcbiAgICogPGEgaWQ9J3RlbXBsYXRlVXJsJz48L2E+XG4gICAqXG4gICAqIC0gKipgdGVtcGxhdGVVcmxgKiogLSB7c3RyaW5nfGZ1bmN0aW9uPX0gLSBwYXRoIG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBhIHBhdGggdG8gYW4gaHRtbCBcbiAgICogICB0ZW1wbGF0ZSB0aGF0IHNob3VsZCBiZSB1c2VkIGJ5IHVpVmlldy5cbiAgICogICBcbiAgICogICBJZiBgdGVtcGxhdGVVcmxgIGlzIGEgZnVuY3Rpb24sIGl0IHdpbGwgYmUgY2FsbGVkIHdpdGggdGhlIGZvbGxvd2luZyBwYXJhbWV0ZXJzOlxuICAgKlxuICAgKiAgIC0ge2FycmF5LiZsdDtvYmplY3QmZ3Q7fSAtIHN0YXRlIHBhcmFtZXRlcnMgZXh0cmFjdGVkIGZyb20gdGhlIGN1cnJlbnQgJGxvY2F0aW9uLnBhdGgoKSBieSBcbiAgICogICAgIGFwcGx5aW5nIHRoZSBjdXJyZW50IHN0YXRlXG4gICAqXG4gICAqIDxhIGlkPSd0ZW1wbGF0ZVByb3ZpZGVyJz48L2E+XG4gICAqXG4gICAqIC0gKipgdGVtcGxhdGVQcm92aWRlcmAqKiAtIHtmdW5jdGlvbj19IC0gUHJvdmlkZXIgZnVuY3Rpb24gdGhhdCByZXR1cm5zIEhUTUwgY29udGVudFxuICAgKiAgIHN0cmluZy5cbiAgICpcbiAgICogPGEgaWQ9J2NvbnRyb2xsZXInPjwvYT5cbiAgICpcbiAgICogLSAqKmBjb250cm9sbGVyYCoqIC0ge3N0cmluZ3xmdW5jdGlvbj19IC0gIENvbnRyb2xsZXIgZm4gdGhhdCBzaG91bGQgYmUgYXNzb2NpYXRlZCB3aXRoIG5ld2x5IFxuICAgKiAgIHJlbGF0ZWQgc2NvcGUgb3IgdGhlIG5hbWUgb2YgYSByZWdpc3RlcmVkIGNvbnRyb2xsZXIgaWYgcGFzc2VkIGFzIGEgc3RyaW5nLlxuICAgKlxuICAgKiA8YSBpZD0nY29udHJvbGxlclByb3ZpZGVyJz48L2E+XG4gICAqXG4gICAqIC0gKipgY29udHJvbGxlclByb3ZpZGVyYCoqIC0ge2Z1bmN0aW9uPX0gLSBJbmplY3RhYmxlIHByb3ZpZGVyIGZ1bmN0aW9uIHRoYXQgcmV0dXJuc1xuICAgKiAgIHRoZSBhY3R1YWwgY29udHJvbGxlciBvciBzdHJpbmcuXG4gICAqXG4gICAqIDxhIGlkPSdjb250cm9sbGVyQXMnPjwvYT5cbiAgICogXG4gICAqIC0gKipgY29udHJvbGxlckFzYCoqIOKAkyB7c3RyaW5nPX0g4oCTIEEgY29udHJvbGxlciBhbGlhcyBuYW1lLiBJZiBwcmVzZW50IHRoZSBjb250cm9sbGVyIHdpbGwgYmUgXG4gICAqICAgcHVibGlzaGVkIHRvIHNjb3BlIHVuZGVyIHRoZSBjb250cm9sbGVyQXMgbmFtZS5cbiAgICpcbiAgICogPGEgaWQ9J3Jlc29sdmUnPjwvYT5cbiAgICpcbiAgICogLSAqKmByZXNvbHZlYCoqIC0ge29iamVjdC4mbHQ7c3RyaW5nLCBmdW5jdGlvbiZndDs9fSAtIEFuIG9wdGlvbmFsIG1hcCBvZiBkZXBlbmRlbmNpZXMgd2hpY2ggXG4gICAqICAgc2hvdWxkIGJlIGluamVjdGVkIGludG8gdGhlIGNvbnRyb2xsZXIuIElmIGFueSBvZiB0aGVzZSBkZXBlbmRlbmNpZXMgYXJlIHByb21pc2VzLCBcbiAgICogICB0aGUgcm91dGVyIHdpbGwgd2FpdCBmb3IgdGhlbSBhbGwgdG8gYmUgcmVzb2x2ZWQgb3Igb25lIHRvIGJlIHJlamVjdGVkIGJlZm9yZSB0aGUgXG4gICAqICAgY29udHJvbGxlciBpcyBpbnN0YW50aWF0ZWQuIElmIGFsbCB0aGUgcHJvbWlzZXMgYXJlIHJlc29sdmVkIHN1Y2Nlc3NmdWxseSwgdGhlIHZhbHVlcyBcbiAgICogICBvZiB0aGUgcmVzb2x2ZWQgcHJvbWlzZXMgYXJlIGluamVjdGVkIGFuZCAkc3RhdGVDaGFuZ2VTdWNjZXNzIGV2ZW50IGlzIGZpcmVkLiBJZiBhbnkgXG4gICAqICAgb2YgdGhlIHByb21pc2VzIGFyZSByZWplY3RlZCB0aGUgJHN0YXRlQ2hhbmdlRXJyb3IgZXZlbnQgaXMgZmlyZWQuIFRoZSBtYXAgb2JqZWN0IGlzOlxuICAgKiAgIFxuICAgKiAgIC0ga2V5IC0ge3N0cmluZ306IG5hbWUgb2YgZGVwZW5kZW5jeSB0byBiZSBpbmplY3RlZCBpbnRvIGNvbnRyb2xsZXJcbiAgICogICAtIGZhY3RvcnkgLSB7c3RyaW5nfGZ1bmN0aW9ufTogSWYgc3RyaW5nIHRoZW4gaXQgaXMgYWxpYXMgZm9yIHNlcnZpY2UuIE90aGVyd2lzZSBpZiBmdW5jdGlvbiwgXG4gICAqICAgICBpdCBpcyBpbmplY3RlZCBhbmQgcmV0dXJuIHZhbHVlIGl0IHRyZWF0ZWQgYXMgZGVwZW5kZW5jeS4gSWYgcmVzdWx0IGlzIGEgcHJvbWlzZSwgaXQgaXMgXG4gICAqICAgICByZXNvbHZlZCBiZWZvcmUgaXRzIHZhbHVlIGlzIGluamVjdGVkIGludG8gY29udHJvbGxlci5cbiAgICpcbiAgICogPGEgaWQ9J3VybCc+PC9hPlxuICAgKlxuICAgKiAtICoqYHVybGAqKiAtIHtzdHJpbmc9fSAtIEEgdXJsIHdpdGggb3B0aW9uYWwgcGFyYW1ldGVycy4gV2hlbiBhIHN0YXRlIGlzIG5hdmlnYXRlZCBvclxuICAgKiAgIHRyYW5zaXRpb25lZCB0bywgdGhlIGAkc3RhdGVQYXJhbXNgIHNlcnZpY2Ugd2lsbCBiZSBwb3B1bGF0ZWQgd2l0aCBhbnkgXG4gICAqICAgcGFyYW1ldGVycyB0aGF0IHdlcmUgcGFzc2VkLlxuICAgKlxuICAgKiA8YSBpZD0ncGFyYW1zJz48L2E+XG4gICAqXG4gICAqIC0gKipgcGFyYW1zYCoqIC0ge29iamVjdD19IC0gQW4gYXJyYXkgb2YgcGFyYW1ldGVyIG5hbWVzIG9yIHJlZ3VsYXIgZXhwcmVzc2lvbnMuIE9ubHkgXG4gICAqICAgdXNlIHRoaXMgd2l0aGluIGEgc3RhdGUgaWYgeW91IGFyZSBub3QgdXNpbmcgdXJsLiBPdGhlcndpc2UgeW91IGNhbiBzcGVjaWZ5IHlvdXJcbiAgICogICBwYXJhbWV0ZXJzIHdpdGhpbiB0aGUgdXJsLiBXaGVuIGEgc3RhdGUgaXMgbmF2aWdhdGVkIG9yIHRyYW5zaXRpb25lZCB0bywgdGhlIFxuICAgKiAgICRzdGF0ZVBhcmFtcyBzZXJ2aWNlIHdpbGwgYmUgcG9wdWxhdGVkIHdpdGggYW55IHBhcmFtZXRlcnMgdGhhdCB3ZXJlIHBhc3NlZC5cbiAgICpcbiAgICogPGEgaWQ9J3ZpZXdzJz48L2E+XG4gICAqXG4gICAqIC0gKipgdmlld3NgKiogLSB7b2JqZWN0PX0gLSBVc2UgdGhlIHZpZXdzIHByb3BlcnR5IHRvIHNldCB1cCBtdWx0aXBsZSB2aWV3cyBvciB0byB0YXJnZXQgdmlld3NcbiAgICogICBtYW51YWxseS9leHBsaWNpdGx5LlxuICAgKlxuICAgKiA8YSBpZD0nYWJzdHJhY3QnPjwvYT5cbiAgICpcbiAgICogLSAqKmBhYnN0cmFjdGAqKiAtIHtib29sZWFuPX0gLSBBbiBhYnN0cmFjdCBzdGF0ZSB3aWxsIG5ldmVyIGJlIGRpcmVjdGx5IGFjdGl2YXRlZCwgXG4gICAqICAgYnV0IGNhbiBwcm92aWRlIGluaGVyaXRlZCBwcm9wZXJ0aWVzIHRvIGl0cyBjb21tb24gY2hpbGRyZW4gc3RhdGVzLlxuICAgKlxuICAgKiA8YSBpZD0nb25FbnRlcic+PC9hPlxuICAgKlxuICAgKiAtICoqYG9uRW50ZXJgKiogLSB7b2JqZWN0PX0gLSBDYWxsYmFjayBmdW5jdGlvbiBmb3Igd2hlbiBhIHN0YXRlIGlzIGVudGVyZWQuIEdvb2Qgd2F5XG4gICAqICAgdG8gdHJpZ2dlciBhbiBhY3Rpb24gb3IgZGlzcGF0Y2ggYW4gZXZlbnQsIHN1Y2ggYXMgb3BlbmluZyBhIGRpYWxvZy5cbiAgICpcbiAgICogPGEgaWQ9J29uRXhpdCc+PC9hPlxuICAgKlxuICAgKiAtICoqYG9uRXhpdGAqKiAtIHtvYmplY3Q9fSAtIENhbGxiYWNrIGZ1bmN0aW9uIGZvciB3aGVuIGEgc3RhdGUgaXMgZXhpdGVkLiBHb29kIHdheSB0b1xuICAgKiAgIHRyaWdnZXIgYW4gYWN0aW9uIG9yIGRpc3BhdGNoIGFuIGV2ZW50LCBzdWNoIGFzIG9wZW5pbmcgYSBkaWFsb2cuXG4gICAqXG4gICAqIDxhIGlkPSdyZWxvYWRPblNlYXJjaCc+PC9hPlxuICAgKlxuICAgKiAtICoqYHJlbG9hZE9uU2VhcmNoID0gdHJ1ZWAqKiAtIHtib29sZWFuPX0gLSBJZiBgZmFsc2VgLCB3aWxsIG5vdCByZXRyaWdnZXIgdGhlIHNhbWUgc3RhdGUgXG4gICAqICAganVzdCBiZWNhdXNlIGEgc2VhcmNoL3F1ZXJ5IHBhcmFtZXRlciBoYXMgY2hhbmdlZCAodmlhICRsb2NhdGlvbi5zZWFyY2goKSBvciAkbG9jYXRpb24uaGFzaCgpKS4gXG4gICAqICAgVXNlZnVsIGZvciB3aGVuIHlvdSdkIGxpa2UgdG8gbW9kaWZ5ICRsb2NhdGlvbi5zZWFyY2goKSB3aXRob3V0IHRyaWdnZXJpbmcgYSByZWxvYWQuXG4gICAqXG4gICAqIDxhIGlkPSdkYXRhJz48L2E+XG4gICAqXG4gICAqIC0gKipgZGF0YWAqKiAtIHtvYmplY3Q9fSAtIEFyYml0cmFyeSBkYXRhIG9iamVjdCwgdXNlZnVsIGZvciBjdXN0b20gY29uZmlndXJhdGlvbi5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogPHByZT5cbiAgICogLy8gU29tZSBzdGF0ZSBuYW1lIGV4YW1wbGVzXG4gICAqXG4gICAqIC8vIHN0YXRlTmFtZSBjYW4gYmUgYSBzaW5nbGUgdG9wLWxldmVsIG5hbWUgKG11c3QgYmUgdW5pcXVlKS5cbiAgICogJHN0YXRlUHJvdmlkZXIuc3RhdGUoXCJob21lXCIsIHt9KTtcbiAgICpcbiAgICogLy8gT3IgaXQgY2FuIGJlIGEgbmVzdGVkIHN0YXRlIG5hbWUuIFRoaXMgc3RhdGUgaXMgYSBjaGlsZCBvZiB0aGUgXG4gICAqIC8vIGFib3ZlIFwiaG9tZVwiIHN0YXRlLlxuICAgKiAkc3RhdGVQcm92aWRlci5zdGF0ZShcImhvbWUubmV3ZXN0XCIsIHt9KTtcbiAgICpcbiAgICogLy8gTmVzdCBzdGF0ZXMgYXMgZGVlcGx5IGFzIG5lZWRlZC5cbiAgICogJHN0YXRlUHJvdmlkZXIuc3RhdGUoXCJob21lLm5ld2VzdC5hYmMueHl6LmluY2VwdGlvblwiLCB7fSk7XG4gICAqXG4gICAqIC8vIHN0YXRlKCkgcmV0dXJucyAkc3RhdGVQcm92aWRlciwgc28geW91IGNhbiBjaGFpbiBzdGF0ZSBkZWNsYXJhdGlvbnMuXG4gICAqICRzdGF0ZVByb3ZpZGVyXG4gICAqICAgLnN0YXRlKFwiaG9tZVwiLCB7fSlcbiAgICogICAuc3RhdGUoXCJhYm91dFwiLCB7fSlcbiAgICogICAuc3RhdGUoXCJjb250YWN0c1wiLCB7fSk7XG4gICAqIDwvcHJlPlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gbmFtZSBBIHVuaXF1ZSBzdGF0ZSBuYW1lLCBlLmcuIFwiaG9tZVwiLCBcImFib3V0XCIsIFwiY29udGFjdHNcIi4gXG4gICAqIFRvIGNyZWF0ZSBhIHBhcmVudC9jaGlsZCBzdGF0ZSB1c2UgYSBkb3QsIGUuZy4gXCJhYm91dC5zYWxlc1wiLCBcImhvbWUubmV3ZXN0XCIuXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBkZWZpbml0aW9uIFN0YXRlIGNvbmZpZ3VyYXRpb24gb2JqZWN0LlxuICAgKi9cbiAgdGhpcy5zdGF0ZSA9IHN0YXRlO1xuICBmdW5jdGlvbiBzdGF0ZShuYW1lLCBkZWZpbml0aW9uKSB7XG4gICAgLypqc2hpbnQgdmFsaWR0aGlzOiB0cnVlICovXG4gICAgaWYgKGlzT2JqZWN0KG5hbWUpKSBkZWZpbml0aW9uID0gbmFtZTtcbiAgICBlbHNlIGRlZmluaXRpb24ubmFtZSA9IG5hbWU7XG4gICAgcmVnaXN0ZXJTdGF0ZShkZWZpbml0aW9uKTtcbiAgICByZXR1cm4gdGhpcztcbiAgfVxuXG4gIC8qKlxuICAgKiBAbmdkb2Mgb2JqZWN0XG4gICAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVcbiAgICpcbiAgICogQHJlcXVpcmVzICRyb290U2NvcGVcbiAgICogQHJlcXVpcmVzICRxXG4gICAqIEByZXF1aXJlcyB1aS5yb3V0ZXIuc3RhdGUuJHZpZXdcbiAgICogQHJlcXVpcmVzICRpbmplY3RvclxuICAgKiBAcmVxdWlyZXMgdWkucm91dGVyLnV0aWwuJHJlc29sdmVcbiAgICogQHJlcXVpcmVzIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVQYXJhbXNcbiAgICpcbiAgICogQHByb3BlcnR5IHtvYmplY3R9IHBhcmFtcyBBIHBhcmFtIG9iamVjdCwgZS5nLiB7c2VjdGlvbklkOiBzZWN0aW9uLmlkKX0sIHRoYXQgXG4gICAqIHlvdSdkIGxpa2UgdG8gdGVzdCBhZ2FpbnN0IHRoZSBjdXJyZW50IGFjdGl2ZSBzdGF0ZS5cbiAgICogQHByb3BlcnR5IHtvYmplY3R9IGN1cnJlbnQgQSByZWZlcmVuY2UgdG8gdGhlIHN0YXRlJ3MgY29uZmlnIG9iamVjdC4gSG93ZXZlciBcbiAgICogeW91IHBhc3NlZCBpdCBpbi4gVXNlZnVsIGZvciBhY2Nlc3NpbmcgY3VzdG9tIGRhdGEuXG4gICAqIEBwcm9wZXJ0eSB7b2JqZWN0fSB0cmFuc2l0aW9uIEN1cnJlbnRseSBwZW5kaW5nIHRyYW5zaXRpb24uIEEgcHJvbWlzZSB0aGF0J2xsIFxuICAgKiByZXNvbHZlIG9yIHJlamVjdC5cbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIGAkc3RhdGVgIHNlcnZpY2UgaXMgcmVzcG9uc2libGUgZm9yIHJlcHJlc2VudGluZyBzdGF0ZXMgYXMgd2VsbCBhcyB0cmFuc2l0aW9uaW5nXG4gICAqIGJldHdlZW4gdGhlbS4gSXQgYWxzbyBwcm92aWRlcyBpbnRlcmZhY2VzIHRvIGFzayBmb3IgY3VycmVudCBzdGF0ZSBvciBldmVuIHN0YXRlc1xuICAgKiB5b3UncmUgY29taW5nIGZyb20uXG4gICAqL1xuICAvLyAkdXJsUm91dGVyIGlzIGluamVjdGVkIGp1c3QgdG8gZW5zdXJlIGl0IGdldHMgaW5zdGFudGlhdGVkXG4gIHRoaXMuJGdldCA9ICRnZXQ7XG4gICRnZXQuJGluamVjdCA9IFsnJHJvb3RTY29wZScsICckcScsICckdmlldycsICckaW5qZWN0b3InLCAnJHJlc29sdmUnLCAnJHN0YXRlUGFyYW1zJywgJyRsb2NhdGlvbicsICckdXJsUm91dGVyJywgJyRicm93c2VyJ107XG4gIGZ1bmN0aW9uICRnZXQoICAgJHJvb3RTY29wZSwgICAkcSwgICAkdmlldywgICAkaW5qZWN0b3IsICAgJHJlc29sdmUsICAgJHN0YXRlUGFyYW1zLCAgICRsb2NhdGlvbiwgICAkdXJsUm91dGVyLCAgICRicm93c2VyKSB7XG5cbiAgICB2YXIgVHJhbnNpdGlvblN1cGVyc2VkZWQgPSAkcS5yZWplY3QobmV3IEVycm9yKCd0cmFuc2l0aW9uIHN1cGVyc2VkZWQnKSk7XG4gICAgdmFyIFRyYW5zaXRpb25QcmV2ZW50ZWQgPSAkcS5yZWplY3QobmV3IEVycm9yKCd0cmFuc2l0aW9uIHByZXZlbnRlZCcpKTtcbiAgICB2YXIgVHJhbnNpdGlvbkFib3J0ZWQgPSAkcS5yZWplY3QobmV3IEVycm9yKCd0cmFuc2l0aW9uIGFib3J0ZWQnKSk7XG4gICAgdmFyIFRyYW5zaXRpb25GYWlsZWQgPSAkcS5yZWplY3QobmV3IEVycm9yKCd0cmFuc2l0aW9uIGZhaWxlZCcpKTtcbiAgICB2YXIgY3VycmVudExvY2F0aW9uID0gJGxvY2F0aW9uLnVybCgpO1xuICAgIHZhciBiYXNlSHJlZiA9ICRicm93c2VyLmJhc2VIcmVmKCk7XG5cbiAgICBmdW5jdGlvbiBzeW5jVXJsKCkge1xuICAgICAgaWYgKCRsb2NhdGlvbi51cmwoKSAhPT0gY3VycmVudExvY2F0aW9uKSB7XG4gICAgICAgICRsb2NhdGlvbi51cmwoY3VycmVudExvY2F0aW9uKTtcbiAgICAgICAgJGxvY2F0aW9uLnJlcGxhY2UoKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByb290LmxvY2FscyA9IHsgcmVzb2x2ZTogbnVsbCwgZ2xvYmFsczogeyAkc3RhdGVQYXJhbXM6IHt9IH0gfTtcbiAgICAkc3RhdGUgPSB7XG4gICAgICBwYXJhbXM6IHt9LFxuICAgICAgY3VycmVudDogcm9vdC5zZWxmLFxuICAgICAgJGN1cnJlbnQ6IHJvb3QsXG4gICAgICB0cmFuc2l0aW9uOiBudWxsXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgICAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGUjcmVsb2FkXG4gICAgICogQG1ldGhvZE9mIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIEEgbWV0aG9kIHRoYXQgZm9yY2UgcmVsb2FkcyB0aGUgY3VycmVudCBzdGF0ZS4gQWxsIHJlc29sdmVzIGFyZSByZS1yZXNvbHZlZCwgZXZlbnRzIGFyZSBub3QgcmUtZmlyZWQsIFxuICAgICAqIGFuZCBjb250cm9sbGVycyByZWluc3RhbnRpYXRlZCAoYnVnIHdpdGggY29udHJvbGxlcnMgcmVpbnN0YW50aWF0aW5nIHJpZ2h0IG5vdywgZml4aW5nIHNvb24pLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiA8cHJlPlxuICAgICAqIHZhciBhcHAgYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsndWkucm91dGVyJ10pO1xuICAgICAqXG4gICAgICogYXBwLmNvbnRyb2xsZXIoJ2N0cmwnLCBmdW5jdGlvbiAoJHNjb3BlLCAkc3RhdGUpIHtcbiAgICAgKiAgICRzY29wZS5yZWxvYWQgPSBmdW5jdGlvbigpe1xuICAgICAqICAgICAkc3RhdGUucmVsb2FkKCk7XG4gICAgICogICB9XG4gICAgICogfSk7XG4gICAgICogPC9wcmU+XG4gICAgICpcbiAgICAgKiBgcmVsb2FkKClgIGlzIGp1c3QgYW4gYWxpYXMgZm9yOlxuICAgICAqIDxwcmU+XG4gICAgICogJHN0YXRlLnRyYW5zaXRpb25Ubygkc3RhdGUuY3VycmVudCwgJHN0YXRlUGFyYW1zLCB7IFxuICAgICAqICAgcmVsb2FkOiB0cnVlLCBpbmhlcml0OiBmYWxzZSwgbm90aWZ5OiBmYWxzZSBcbiAgICAgKiB9KTtcbiAgICAgKiA8L3ByZT5cbiAgICAgKi9cbiAgICAkc3RhdGUucmVsb2FkID0gZnVuY3Rpb24gcmVsb2FkKCkge1xuICAgICAgJHN0YXRlLnRyYW5zaXRpb25Ubygkc3RhdGUuY3VycmVudCwgJHN0YXRlUGFyYW1zLCB7IHJlbG9hZDogdHJ1ZSwgaW5oZXJpdDogZmFsc2UsIG5vdGlmeTogZmFsc2UgfSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgICAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGUjZ29cbiAgICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQ29udmVuaWVuY2UgbWV0aG9kIGZvciB0cmFuc2l0aW9uaW5nIHRvIGEgbmV3IHN0YXRlLiBgJHN0YXRlLmdvYCBjYWxscyBcbiAgICAgKiBgJHN0YXRlLnRyYW5zaXRpb25Ub2AgaW50ZXJuYWxseSBidXQgYXV0b21hdGljYWxseSBzZXRzIG9wdGlvbnMgdG8gXG4gICAgICogYHsgbG9jYXRpb246IHRydWUsIGluaGVyaXQ6IHRydWUsIHJlbGF0aXZlOiAkc3RhdGUuJGN1cnJlbnQsIG5vdGlmeTogdHJ1ZSB9YC4gXG4gICAgICogVGhpcyBhbGxvd3MgeW91IHRvIGVhc2lseSB1c2UgYW4gYWJzb2x1dGUgb3IgcmVsYXRpdmUgdG8gcGF0aCBhbmQgc3BlY2lmeSBcbiAgICAgKiBvbmx5IHRoZSBwYXJhbWV0ZXJzIHlvdSdkIGxpa2UgdG8gdXBkYXRlICh3aGlsZSBsZXR0aW5nIHVuc3BlY2lmaWVkIHBhcmFtZXRlcnMgXG4gICAgICogaW5oZXJpdCBmcm9tIHRoZSBjdXJyZW50bHkgYWN0aXZlIGFuY2VzdG9yIHN0YXRlcykuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIDxwcmU+XG4gICAgICogdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbJ3VpLnJvdXRlciddKTtcbiAgICAgKlxuICAgICAqIGFwcC5jb250cm9sbGVyKCdjdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlKSB7XG4gICAgICogICAkc2NvcGUuY2hhbmdlU3RhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICogICAgICRzdGF0ZS5nbygnY29udGFjdC5kZXRhaWwnKTtcbiAgICAgKiAgIH07XG4gICAgICogfSk7XG4gICAgICogPC9wcmU+XG4gICAgICogPGltZyBzcmM9Jy4uL25nZG9jX2Fzc2V0cy9TdGF0ZUdvRXhhbXBsZXMucG5nJy8+XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gdG8gQWJzb2x1dGUgc3RhdGUgbmFtZSBvciByZWxhdGl2ZSBzdGF0ZSBwYXRoLiBTb21lIGV4YW1wbGVzOlxuICAgICAqXG4gICAgICogLSBgJHN0YXRlLmdvKCdjb250YWN0LmRldGFpbCcpYCAtIHdpbGwgZ28gdG8gdGhlIGBjb250YWN0LmRldGFpbGAgc3RhdGVcbiAgICAgKiAtIGAkc3RhdGUuZ28oJ14nKWAgLSB3aWxsIGdvIHRvIGEgcGFyZW50IHN0YXRlXG4gICAgICogLSBgJHN0YXRlLmdvKCdeLnNpYmxpbmcnKWAgLSB3aWxsIGdvIHRvIGEgc2libGluZyBzdGF0ZVxuICAgICAqIC0gYCRzdGF0ZS5nbygnLmNoaWxkLmdyYW5kY2hpbGQnKWAgLSB3aWxsIGdvIHRvIGdyYW5kY2hpbGQgc3RhdGVcbiAgICAgKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0PX0gcGFyYW1zIEEgbWFwIG9mIHRoZSBwYXJhbWV0ZXJzIHRoYXQgd2lsbCBiZSBzZW50IHRvIHRoZSBzdGF0ZSwgXG4gICAgICogd2lsbCBwb3B1bGF0ZSAkc3RhdGVQYXJhbXMuIEFueSBwYXJhbWV0ZXJzIHRoYXQgYXJlIG5vdCBzcGVjaWZpZWQgd2lsbCBiZSBpbmhlcml0ZWQgZnJvbSBjdXJyZW50bHkgXG4gICAgICogZGVmaW5lZCBwYXJhbWV0ZXJzLiBUaGlzIGFsbG93cywgZm9yIGV4YW1wbGUsIGdvaW5nIHRvIGEgc2libGluZyBzdGF0ZSB0aGF0IHNoYXJlcyBwYXJhbWV0ZXJzXG4gICAgICogc3BlY2lmaWVkIGluIGEgcGFyZW50IHN0YXRlLiBQYXJhbWV0ZXIgaW5oZXJpdGFuY2Ugb25seSB3b3JrcyBiZXR3ZWVuIGNvbW1vbiBhbmNlc3RvciBzdGF0ZXMsIEkuZS5cbiAgICAgKiB0cmFuc2l0aW9uaW5nIHRvIGEgc2libGluZyB3aWxsIGdldCB5b3UgdGhlIHBhcmFtZXRlcnMgZm9yIGFsbCBwYXJlbnRzLCB0cmFuc2l0aW9uaW5nIHRvIGEgY2hpbGRcbiAgICAgKiB3aWxsIGdldCB5b3UgYWxsIGN1cnJlbnQgcGFyYW1ldGVycywgZXRjLlxuICAgICAqIEBwYXJhbSB7b2JqZWN0PX0gb3B0aW9ucyBPcHRpb25zIG9iamVjdC4gVGhlIG9wdGlvbnMgYXJlOlxuICAgICAqXG4gICAgICogLSAqKmBsb2NhdGlvbmAqKiAtIHtib29sZWFuPXRydWV8c3RyaW5nPX0gLSBJZiBgdHJ1ZWAgd2lsbCB1cGRhdGUgdGhlIHVybCBpbiB0aGUgbG9jYXRpb24gYmFyLCBpZiBgZmFsc2VgXG4gICAgICogICAgd2lsbCBub3QuIElmIHN0cmluZywgbXVzdCBiZSBgXCJyZXBsYWNlXCJgLCB3aGljaCB3aWxsIHVwZGF0ZSB1cmwgYW5kIGFsc28gcmVwbGFjZSBsYXN0IGhpc3RvcnkgcmVjb3JkLlxuICAgICAqIC0gKipgaW5oZXJpdGAqKiAtIHtib29sZWFuPXRydWV9LCBJZiBgdHJ1ZWAgd2lsbCBpbmhlcml0IHVybCBwYXJhbWV0ZXJzIGZyb20gY3VycmVudCB1cmwuXG4gICAgICogLSAqKmByZWxhdGl2ZWAqKiAtIHtvYmplY3Q9JHN0YXRlLiRjdXJyZW50fSwgV2hlbiB0cmFuc2l0aW9uaW5nIHdpdGggcmVsYXRpdmUgcGF0aCAoZS5nICdeJyksIFxuICAgICAqICAgIGRlZmluZXMgd2hpY2ggc3RhdGUgdG8gYmUgcmVsYXRpdmUgZnJvbS5cbiAgICAgKiAtICoqYG5vdGlmeWAqKiAtIHtib29sZWFuPXRydWV9LCBJZiBgdHJ1ZWAgd2lsbCBicm9hZGNhc3QgJHN0YXRlQ2hhbmdlU3RhcnQgYW5kICRzdGF0ZUNoYW5nZVN1Y2Nlc3MgZXZlbnRzLlxuICAgICAqIC0gKipgcmVsb2FkYCoqICh2MC4yLjUpIC0ge2Jvb2xlYW49ZmFsc2V9LCBJZiBgdHJ1ZWAgd2lsbCBmb3JjZSB0cmFuc2l0aW9uIGV2ZW4gaWYgdGhlIHN0YXRlIG9yIHBhcmFtcyBcbiAgICAgKiAgICBoYXZlIG5vdCBjaGFuZ2VkLCBha2EgYSByZWxvYWQgb2YgdGhlIHNhbWUgc3RhdGUuIEl0IGRpZmZlcnMgZnJvbSByZWxvYWRPblNlYXJjaCBiZWNhdXNlIHlvdSdkXG4gICAgICogICAgdXNlIHRoaXMgd2hlbiB5b3Ugd2FudCB0byBmb3JjZSBhIHJlbG9hZCB3aGVuICpldmVyeXRoaW5nKiBpcyB0aGUgc2FtZSwgaW5jbHVkaW5nIHNlYXJjaCBwYXJhbXMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7cHJvbWlzZX0gQSBwcm9taXNlIHJlcHJlc2VudGluZyB0aGUgc3RhdGUgb2YgdGhlIG5ldyB0cmFuc2l0aW9uLlxuICAgICAqXG4gICAgICogUG9zc2libGUgc3VjY2VzcyB2YWx1ZXM6XG4gICAgICpcbiAgICAgKiAtICRzdGF0ZS5jdXJyZW50XG4gICAgICpcbiAgICAgKiA8YnIvPlBvc3NpYmxlIHJlamVjdGlvbiB2YWx1ZXM6XG4gICAgICpcbiAgICAgKiAtICd0cmFuc2l0aW9uIHN1cGVyc2VkZWQnIC0gd2hlbiBhIG5ld2VyIHRyYW5zaXRpb24gaGFzIGJlZW4gc3RhcnRlZCBhZnRlciB0aGlzIG9uZVxuICAgICAqIC0gJ3RyYW5zaXRpb24gcHJldmVudGVkJyAtIHdoZW4gYGV2ZW50LnByZXZlbnREZWZhdWx0KClgIGhhcyBiZWVuIGNhbGxlZCBpbiBhIGAkc3RhdGVDaGFuZ2VTdGFydGAgbGlzdGVuZXJcbiAgICAgKiAtICd0cmFuc2l0aW9uIGFib3J0ZWQnIC0gd2hlbiBgZXZlbnQucHJldmVudERlZmF1bHQoKWAgaGFzIGJlZW4gY2FsbGVkIGluIGEgYCRzdGF0ZU5vdEZvdW5kYCBsaXN0ZW5lciBvclxuICAgICAqICAgd2hlbiBhIGAkc3RhdGVOb3RGb3VuZGAgYGV2ZW50LnJldHJ5YCBwcm9taXNlIGVycm9ycy5cbiAgICAgKiAtICd0cmFuc2l0aW9uIGZhaWxlZCcgLSB3aGVuIGEgc3RhdGUgaGFzIGJlZW4gdW5zdWNjZXNzZnVsbHkgZm91bmQgYWZ0ZXIgMiB0cmllcy5cbiAgICAgKiAtICpyZXNvbHZlIGVycm9yKiAtIHdoZW4gYW4gZXJyb3IgaGFzIG9jY3VycmVkIHdpdGggYSBgcmVzb2x2ZWBcbiAgICAgKlxuICAgICAqL1xuICAgICRzdGF0ZS5nbyA9IGZ1bmN0aW9uIGdvKHRvLCBwYXJhbXMsIG9wdGlvbnMpIHtcbiAgICAgIHJldHVybiB0aGlzLnRyYW5zaXRpb25Ubyh0bywgcGFyYW1zLCBleHRlbmQoeyBpbmhlcml0OiB0cnVlLCByZWxhdGl2ZTogJHN0YXRlLiRjdXJyZW50IH0sIG9wdGlvbnMpKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAgICogQG5hbWUgdWkucm91dGVyLnN0YXRlLiRzdGF0ZSN0cmFuc2l0aW9uVG9cbiAgICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogTG93LWxldmVsIG1ldGhvZCBmb3IgdHJhbnNpdGlvbmluZyB0byBhIG5ldyBzdGF0ZS4ge0BsaW5rIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGUjbWV0aG9kc19nbyAkc3RhdGUuZ299XG4gICAgICogdXNlcyBgdHJhbnNpdGlvblRvYCBpbnRlcm5hbGx5LiBgJHN0YXRlLmdvYCBpcyByZWNvbW1lbmRlZCBpbiBtb3N0IHNpdHVhdGlvbnMuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIDxwcmU+XG4gICAgICogdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbJ3VpLnJvdXRlciddKTtcbiAgICAgKlxuICAgICAqIGFwcC5jb250cm9sbGVyKCdjdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlKSB7XG4gICAgICogICAkc2NvcGUuY2hhbmdlU3RhdGUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICogICAgICRzdGF0ZS50cmFuc2l0aW9uVG8oJ2NvbnRhY3QuZGV0YWlsJyk7XG4gICAgICogICB9O1xuICAgICAqIH0pO1xuICAgICAqIDwvcHJlPlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRvIFN0YXRlIG5hbWUuXG4gICAgICogQHBhcmFtIHtvYmplY3Q9fSB0b1BhcmFtcyBBIG1hcCBvZiB0aGUgcGFyYW1ldGVycyB0aGF0IHdpbGwgYmUgc2VudCB0byB0aGUgc3RhdGUsXG4gICAgICogd2lsbCBwb3B1bGF0ZSAkc3RhdGVQYXJhbXMuXG4gICAgICogQHBhcmFtIHtvYmplY3Q9fSBvcHRpb25zIE9wdGlvbnMgb2JqZWN0LiBUaGUgb3B0aW9ucyBhcmU6XG4gICAgICpcbiAgICAgKiAtICoqYGxvY2F0aW9uYCoqIC0ge2Jvb2xlYW49dHJ1ZXxzdHJpbmc9fSAtIElmIGB0cnVlYCB3aWxsIHVwZGF0ZSB0aGUgdXJsIGluIHRoZSBsb2NhdGlvbiBiYXIsIGlmIGBmYWxzZWBcbiAgICAgKiAgICB3aWxsIG5vdC4gSWYgc3RyaW5nLCBtdXN0IGJlIGBcInJlcGxhY2VcImAsIHdoaWNoIHdpbGwgdXBkYXRlIHVybCBhbmQgYWxzbyByZXBsYWNlIGxhc3QgaGlzdG9yeSByZWNvcmQuXG4gICAgICogLSAqKmBpbmhlcml0YCoqIC0ge2Jvb2xlYW49ZmFsc2V9LCBJZiBgdHJ1ZWAgd2lsbCBpbmhlcml0IHVybCBwYXJhbWV0ZXJzIGZyb20gY3VycmVudCB1cmwuXG4gICAgICogLSAqKmByZWxhdGl2ZWAqKiAtIHtvYmplY3Q9fSwgV2hlbiB0cmFuc2l0aW9uaW5nIHdpdGggcmVsYXRpdmUgcGF0aCAoZS5nICdeJyksIFxuICAgICAqICAgIGRlZmluZXMgd2hpY2ggc3RhdGUgdG8gYmUgcmVsYXRpdmUgZnJvbS5cbiAgICAgKiAtICoqYG5vdGlmeWAqKiAtIHtib29sZWFuPXRydWV9LCBJZiBgdHJ1ZWAgd2lsbCBicm9hZGNhc3QgJHN0YXRlQ2hhbmdlU3RhcnQgYW5kICRzdGF0ZUNoYW5nZVN1Y2Nlc3MgZXZlbnRzLlxuICAgICAqIC0gKipgcmVsb2FkYCoqICh2MC4yLjUpIC0ge2Jvb2xlYW49ZmFsc2V9LCBJZiBgdHJ1ZWAgd2lsbCBmb3JjZSB0cmFuc2l0aW9uIGV2ZW4gaWYgdGhlIHN0YXRlIG9yIHBhcmFtcyBcbiAgICAgKiAgICBoYXZlIG5vdCBjaGFuZ2VkLCBha2EgYSByZWxvYWQgb2YgdGhlIHNhbWUgc3RhdGUuIEl0IGRpZmZlcnMgZnJvbSByZWxvYWRPblNlYXJjaCBiZWNhdXNlIHlvdSdkXG4gICAgICogICAgdXNlIHRoaXMgd2hlbiB5b3Ugd2FudCB0byBmb3JjZSBhIHJlbG9hZCB3aGVuICpldmVyeXRoaW5nKiBpcyB0aGUgc2FtZSwgaW5jbHVkaW5nIHNlYXJjaCBwYXJhbXMuXG4gICAgICpcbiAgICAgKiBAcmV0dXJucyB7cHJvbWlzZX0gQSBwcm9taXNlIHJlcHJlc2VudGluZyB0aGUgc3RhdGUgb2YgdGhlIG5ldyB0cmFuc2l0aW9uLiBTZWVcbiAgICAgKiB7QGxpbmsgdWkucm91dGVyLnN0YXRlLiRzdGF0ZSNtZXRob2RzX2dvICRzdGF0ZS5nb30uXG4gICAgICovXG4gICAgJHN0YXRlLnRyYW5zaXRpb25UbyA9IGZ1bmN0aW9uIHRyYW5zaXRpb25Ubyh0bywgdG9QYXJhbXMsIG9wdGlvbnMpIHtcbiAgICAgIHRvUGFyYW1zID0gdG9QYXJhbXMgfHwge307XG4gICAgICBvcHRpb25zID0gZXh0ZW5kKHtcbiAgICAgICAgbG9jYXRpb246IHRydWUsIGluaGVyaXQ6IGZhbHNlLCByZWxhdGl2ZTogbnVsbCwgbm90aWZ5OiB0cnVlLCByZWxvYWQ6IGZhbHNlLCAkcmV0cnk6IGZhbHNlXG4gICAgICB9LCBvcHRpb25zIHx8IHt9KTtcblxuICAgICAgdmFyIGZyb20gPSAkc3RhdGUuJGN1cnJlbnQsIGZyb21QYXJhbXMgPSAkc3RhdGUucGFyYW1zLCBmcm9tUGF0aCA9IGZyb20ucGF0aDtcbiAgICAgIHZhciBldnQsIHRvU3RhdGUgPSBmaW5kU3RhdGUodG8sIG9wdGlvbnMucmVsYXRpdmUpO1xuXG4gICAgICBpZiAoIWlzRGVmaW5lZCh0b1N0YXRlKSkge1xuICAgICAgICAvLyBCcm9hZGNhc3Qgbm90IGZvdW5kIGV2ZW50IGFuZCBhYm9ydCB0aGUgdHJhbnNpdGlvbiBpZiBwcmV2ZW50ZWRcbiAgICAgICAgdmFyIHJlZGlyZWN0ID0geyB0bzogdG8sIHRvUGFyYW1zOiB0b1BhcmFtcywgb3B0aW9uczogb3B0aW9ucyB9O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmdkb2MgZXZlbnRcbiAgICAgICAgICogQG5hbWUgdWkucm91dGVyLnN0YXRlLiRzdGF0ZSMkc3RhdGVOb3RGb3VuZFxuICAgICAgICAgKiBAZXZlbnRPZiB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlXG4gICAgICAgICAqIEBldmVudFR5cGUgYnJvYWRjYXN0IG9uIHJvb3Qgc2NvcGVcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIEZpcmVkIHdoZW4gYSByZXF1ZXN0ZWQgc3RhdGUgKipjYW5ub3QgYmUgZm91bmQqKiB1c2luZyB0aGUgcHJvdmlkZWQgc3RhdGUgbmFtZSBkdXJpbmcgdHJhbnNpdGlvbi5cbiAgICAgICAgICogVGhlIGV2ZW50IGlzIGJyb2FkY2FzdCBhbGxvd2luZyBhbnkgaGFuZGxlcnMgYSBzaW5nbGUgY2hhbmNlIHRvIGRlYWwgd2l0aCB0aGUgZXJyb3IgKHVzdWFsbHkgYnlcbiAgICAgICAgICogbGF6eS1sb2FkaW5nIHRoZSB1bmZvdW5kIHN0YXRlKS4gQSBzcGVjaWFsIGB1bmZvdW5kU3RhdGVgIG9iamVjdCBpcyBwYXNzZWQgdG8gdGhlIGxpc3RlbmVyIGhhbmRsZXIsXG4gICAgICAgICAqIHlvdSBjYW4gc2VlIGl0cyB0aHJlZSBwcm9wZXJ0aWVzIGluIHRoZSBleGFtcGxlLiBZb3UgY2FuIHVzZSBgZXZlbnQucHJldmVudERlZmF1bHQoKWAgdG8gYWJvcnQgdGhlXG4gICAgICAgICAqIHRyYW5zaXRpb24gYW5kIHRoZSBwcm9taXNlIHJldHVybmVkIGZyb20gYGdvYCB3aWxsIGJlIHJlamVjdGVkIHdpdGggYSBgJ3RyYW5zaXRpb24gYWJvcnRlZCdgIHZhbHVlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnQgRXZlbnQgb2JqZWN0LlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gdW5mb3VuZFN0YXRlIFVuZm91bmQgU3RhdGUgaW5mb3JtYXRpb24uIENvbnRhaW5zOiBgdG8sIHRvUGFyYW1zLCBvcHRpb25zYCBwcm9wZXJ0aWVzLlxuICAgICAgICAgKiBAcGFyYW0ge1N0YXRlfSBmcm9tU3RhdGUgQ3VycmVudCBzdGF0ZSBvYmplY3QuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBmcm9tUGFyYW1zIEN1cnJlbnQgc3RhdGUgcGFyYW1zLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKlxuICAgICAgICAgKiA8cHJlPlxuICAgICAgICAgKiAvLyBzb21ld2hlcmUsIGFzc3VtZSBsYXp5LnN0YXRlIGhhcyBub3QgYmVlbiBkZWZpbmVkXG4gICAgICAgICAqICRzdGF0ZS5nbyhcImxhenkuc3RhdGVcIiwge2E6MSwgYjoyfSwge2luaGVyaXQ6ZmFsc2V9KTtcbiAgICAgICAgICpcbiAgICAgICAgICogLy8gc29tZXdoZXJlIGVsc2VcbiAgICAgICAgICogJHNjb3BlLiRvbignJHN0YXRlTm90Rm91bmQnLFxuICAgICAgICAgKiBmdW5jdGlvbihldmVudCwgdW5mb3VuZFN0YXRlLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpe1xuICAgICAgICAgKiAgICAgY29uc29sZS5sb2codW5mb3VuZFN0YXRlLnRvKTsgLy8gXCJsYXp5LnN0YXRlXCJcbiAgICAgICAgICogICAgIGNvbnNvbGUubG9nKHVuZm91bmRTdGF0ZS50b1BhcmFtcyk7IC8vIHthOjEsIGI6Mn1cbiAgICAgICAgICogICAgIGNvbnNvbGUubG9nKHVuZm91bmRTdGF0ZS5vcHRpb25zKTsgLy8ge2luaGVyaXQ6ZmFsc2V9ICsgZGVmYXVsdCBvcHRpb25zXG4gICAgICAgICAqIH0pXG4gICAgICAgICAqIDwvcHJlPlxuICAgICAgICAgKi9cbiAgICAgICAgZXZ0ID0gJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckc3RhdGVOb3RGb3VuZCcsIHJlZGlyZWN0LCBmcm9tLnNlbGYsIGZyb21QYXJhbXMpO1xuICAgICAgICBpZiAoZXZ0LmRlZmF1bHRQcmV2ZW50ZWQpIHtcbiAgICAgICAgICBzeW5jVXJsKCk7XG4gICAgICAgICAgcmV0dXJuIFRyYW5zaXRpb25BYm9ydGVkO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWxsb3cgdGhlIGhhbmRsZXIgdG8gcmV0dXJuIGEgcHJvbWlzZSB0byBkZWZlciBzdGF0ZSBsb29rdXAgcmV0cnlcbiAgICAgICAgaWYgKGV2dC5yZXRyeSkge1xuICAgICAgICAgIGlmIChvcHRpb25zLiRyZXRyeSkge1xuICAgICAgICAgICAgc3luY1VybCgpO1xuICAgICAgICAgICAgcmV0dXJuIFRyYW5zaXRpb25GYWlsZWQ7XG4gICAgICAgICAgfVxuICAgICAgICAgIHZhciByZXRyeVRyYW5zaXRpb24gPSAkc3RhdGUudHJhbnNpdGlvbiA9ICRxLndoZW4oZXZ0LnJldHJ5KTtcbiAgICAgICAgICByZXRyeVRyYW5zaXRpb24udGhlbihmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIGlmIChyZXRyeVRyYW5zaXRpb24gIT09ICRzdGF0ZS50cmFuc2l0aW9uKSByZXR1cm4gVHJhbnNpdGlvblN1cGVyc2VkZWQ7XG4gICAgICAgICAgICByZWRpcmVjdC5vcHRpb25zLiRyZXRyeSA9IHRydWU7XG4gICAgICAgICAgICByZXR1cm4gJHN0YXRlLnRyYW5zaXRpb25UbyhyZWRpcmVjdC50bywgcmVkaXJlY3QudG9QYXJhbXMsIHJlZGlyZWN0Lm9wdGlvbnMpO1xuICAgICAgICAgIH0sIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgcmV0dXJuIFRyYW5zaXRpb25BYm9ydGVkO1xuICAgICAgICAgIH0pO1xuICAgICAgICAgIHN5bmNVcmwoKTtcbiAgICAgICAgICByZXR1cm4gcmV0cnlUcmFuc2l0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gQWx3YXlzIHJldHJ5IG9uY2UgaWYgdGhlICRzdGF0ZU5vdEZvdW5kIHdhcyBub3QgcHJldmVudGVkXG4gICAgICAgIC8vIChoYW5kbGVzIGVpdGhlciByZWRpcmVjdCBjaGFuZ2VkIG9yIHN0YXRlIGxhenktZGVmaW5pdGlvbilcbiAgICAgICAgdG8gPSByZWRpcmVjdC50bztcbiAgICAgICAgdG9QYXJhbXMgPSByZWRpcmVjdC50b1BhcmFtcztcbiAgICAgICAgb3B0aW9ucyA9IHJlZGlyZWN0Lm9wdGlvbnM7XG4gICAgICAgIHRvU3RhdGUgPSBmaW5kU3RhdGUodG8sIG9wdGlvbnMucmVsYXRpdmUpO1xuICAgICAgICBpZiAoIWlzRGVmaW5lZCh0b1N0YXRlKSkge1xuICAgICAgICAgIGlmIChvcHRpb25zLnJlbGF0aXZlKSB0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZCBub3QgcmVzb2x2ZSAnXCIgKyB0byArIFwiJyBmcm9tIHN0YXRlICdcIiArIG9wdGlvbnMucmVsYXRpdmUgKyBcIidcIik7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTm8gc3VjaCBzdGF0ZSAnXCIgKyB0byArIFwiJ1wiKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgaWYgKHRvU3RhdGVbYWJzdHJhY3RLZXldKSB0aHJvdyBuZXcgRXJyb3IoXCJDYW5ub3QgdHJhbnNpdGlvbiB0byBhYnN0cmFjdCBzdGF0ZSAnXCIgKyB0byArIFwiJ1wiKTtcbiAgICAgIGlmIChvcHRpb25zLmluaGVyaXQpIHRvUGFyYW1zID0gaW5oZXJpdFBhcmFtcygkc3RhdGVQYXJhbXMsIHRvUGFyYW1zIHx8IHt9LCAkc3RhdGUuJGN1cnJlbnQsIHRvU3RhdGUpO1xuICAgICAgdG8gPSB0b1N0YXRlO1xuXG4gICAgICB2YXIgdG9QYXRoID0gdG8ucGF0aDtcblxuICAgICAgLy8gU3RhcnRpbmcgZnJvbSB0aGUgcm9vdCBvZiB0aGUgcGF0aCwga2VlcCBhbGwgbGV2ZWxzIHRoYXQgaGF2ZW4ndCBjaGFuZ2VkXG4gICAgICB2YXIga2VlcCwgc3RhdGUsIGxvY2FscyA9IHJvb3QubG9jYWxzLCB0b0xvY2FscyA9IFtdO1xuICAgICAgZm9yIChrZWVwID0gMCwgc3RhdGUgPSB0b1BhdGhba2VlcF07XG4gICAgICAgICAgIHN0YXRlICYmIHN0YXRlID09PSBmcm9tUGF0aFtrZWVwXSAmJiBlcXVhbEZvcktleXModG9QYXJhbXMsIGZyb21QYXJhbXMsIHN0YXRlLm93blBhcmFtcykgJiYgIW9wdGlvbnMucmVsb2FkO1xuICAgICAgICAgICBrZWVwKyssIHN0YXRlID0gdG9QYXRoW2tlZXBdKSB7XG4gICAgICAgIGxvY2FscyA9IHRvTG9jYWxzW2tlZXBdID0gc3RhdGUubG9jYWxzO1xuICAgICAgfVxuXG4gICAgICAvLyBJZiB3ZSdyZSBnb2luZyB0byB0aGUgc2FtZSBzdGF0ZSBhbmQgYWxsIGxvY2FscyBhcmUga2VwdCwgd2UndmUgZ290IG5vdGhpbmcgdG8gZG8uXG4gICAgICAvLyBCdXQgY2xlYXIgJ3RyYW5zaXRpb24nLCBhcyB3ZSBzdGlsbCB3YW50IHRvIGNhbmNlbCBhbnkgb3RoZXIgcGVuZGluZyB0cmFuc2l0aW9ucy5cbiAgICAgIC8vIFRPRE86IFdlIG1heSBub3Qgd2FudCB0byBidW1wICd0cmFuc2l0aW9uJyBpZiB3ZSdyZSBjYWxsZWQgZnJvbSBhIGxvY2F0aW9uIGNoYW5nZSB0aGF0IHdlJ3ZlIGluaXRpYXRlZCBvdXJzZWx2ZXMsXG4gICAgICAvLyBiZWNhdXNlIHdlIG1pZ2h0IGFjY2lkZW50YWxseSBhYm9ydCBhIGxlZ2l0aW1hdGUgdHJhbnNpdGlvbiBpbml0aWF0ZWQgZnJvbSBjb2RlP1xuICAgICAgaWYgKHNob3VsZFRyaWdnZXJSZWxvYWQodG8sIGZyb20sIGxvY2Fscywgb3B0aW9ucykgKSB7XG4gICAgICAgIGlmICggdG8uc2VsZi5yZWxvYWRPblNlYXJjaCAhPT0gZmFsc2UgKVxuICAgICAgICAgIHN5bmNVcmwoKTtcbiAgICAgICAgJHN0YXRlLnRyYW5zaXRpb24gPSBudWxsO1xuICAgICAgICByZXR1cm4gJHEud2hlbigkc3RhdGUuY3VycmVudCk7XG4gICAgICB9XG5cbiAgICAgIC8vIE5vcm1hbGl6ZS9maWx0ZXIgcGFyYW1ldGVycyBiZWZvcmUgd2UgcGFzcyB0aGVtIHRvIGV2ZW50IGhhbmRsZXJzIGV0Yy5cbiAgICAgIHRvUGFyYW1zID0gbm9ybWFsaXplKHRvLnBhcmFtcywgdG9QYXJhbXMgfHwge30pO1xuXG4gICAgICAvLyBCcm9hZGNhc3Qgc3RhcnQgZXZlbnQgYW5kIGNhbmNlbCB0aGUgdHJhbnNpdGlvbiBpZiByZXF1ZXN0ZWRcbiAgICAgIGlmIChvcHRpb25zLm5vdGlmeSkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQG5nZG9jIGV2ZW50XG4gICAgICAgICAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGUjJHN0YXRlQ2hhbmdlU3RhcnRcbiAgICAgICAgICogQGV2ZW50T2YgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVxuICAgICAgICAgKiBAZXZlbnRUeXBlIGJyb2FkY2FzdCBvbiByb290IHNjb3BlXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBGaXJlZCB3aGVuIHRoZSBzdGF0ZSB0cmFuc2l0aW9uICoqYmVnaW5zKiouIFlvdSBjYW4gdXNlIGBldmVudC5wcmV2ZW50RGVmYXVsdCgpYFxuICAgICAgICAgKiB0byBwcmV2ZW50IHRoZSB0cmFuc2l0aW9uIGZyb20gaGFwcGVuaW5nIGFuZCB0aGVuIHRoZSB0cmFuc2l0aW9uIHByb21pc2Ugd2lsbCBiZVxuICAgICAgICAgKiByZWplY3RlZCB3aXRoIGEgYCd0cmFuc2l0aW9uIHByZXZlbnRlZCdgIHZhbHVlLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnQgRXZlbnQgb2JqZWN0LlxuICAgICAgICAgKiBAcGFyYW0ge1N0YXRlfSB0b1N0YXRlIFRoZSBzdGF0ZSBiZWluZyB0cmFuc2l0aW9uZWQgdG8uXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSB0b1BhcmFtcyBUaGUgcGFyYW1zIHN1cHBsaWVkIHRvIHRoZSBgdG9TdGF0ZWAuXG4gICAgICAgICAqIEBwYXJhbSB7U3RhdGV9IGZyb21TdGF0ZSBUaGUgY3VycmVudCBzdGF0ZSwgcHJlLXRyYW5zaXRpb24uXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBmcm9tUGFyYW1zIFRoZSBwYXJhbXMgc3VwcGxpZWQgdG8gdGhlIGBmcm9tU3RhdGVgLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAZXhhbXBsZVxuICAgICAgICAgKlxuICAgICAgICAgKiA8cHJlPlxuICAgICAgICAgKiAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLFxuICAgICAgICAgKiBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcyl7XG4gICAgICAgICAqICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgKiAgICAgLy8gdHJhbnNpdGlvblRvKCkgcHJvbWlzZSB3aWxsIGJlIHJlamVjdGVkIHdpdGhcbiAgICAgICAgICogICAgIC8vIGEgJ3RyYW5zaXRpb24gcHJldmVudGVkJyBlcnJvclxuICAgICAgICAgKiB9KVxuICAgICAgICAgKiA8L3ByZT5cbiAgICAgICAgICovXG4gICAgICAgIGV2dCA9ICRyb290U2NvcGUuJGJyb2FkY2FzdCgnJHN0YXRlQ2hhbmdlU3RhcnQnLCB0by5zZWxmLCB0b1BhcmFtcywgZnJvbS5zZWxmLCBmcm9tUGFyYW1zKTtcbiAgICAgICAgaWYgKGV2dC5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICAgICAgc3luY1VybCgpO1xuICAgICAgICAgIHJldHVybiBUcmFuc2l0aW9uUHJldmVudGVkO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIC8vIFJlc29sdmUgbG9jYWxzIGZvciB0aGUgcmVtYWluaW5nIHN0YXRlcywgYnV0IGRvbid0IHVwZGF0ZSBhbnkgZ2xvYmFsIHN0YXRlIGp1c3RcbiAgICAgIC8vIHlldCAtLSBpZiBhbnl0aGluZyBmYWlscyB0byByZXNvbHZlIHRoZSBjdXJyZW50IHN0YXRlIG5lZWRzIHRvIHJlbWFpbiB1bnRvdWNoZWQuXG4gICAgICAvLyBXZSBhbHNvIHNldCB1cCBhbiBpbmhlcml0YW5jZSBjaGFpbiBmb3IgdGhlIGxvY2FscyBoZXJlLiBUaGlzIGFsbG93cyB0aGUgdmlldyBkaXJlY3RpdmVcbiAgICAgIC8vIHRvIHF1aWNrbHkgbG9vayB1cCB0aGUgY29ycmVjdCBkZWZpbml0aW9uIGZvciBlYWNoIHZpZXcgaW4gdGhlIGN1cnJlbnQgc3RhdGUuIEV2ZW5cbiAgICAgIC8vIHRob3VnaCB3ZSBjcmVhdGUgdGhlIGxvY2FscyBvYmplY3QgaXRzZWxmIG91dHNpZGUgcmVzb2x2ZVN0YXRlKCksIGl0IGlzIGluaXRpYWxseVxuICAgICAgLy8gZW1wdHkgYW5kIGdldHMgZmlsbGVkIGFzeW5jaHJvbm91c2x5LiBXZSBuZWVkIHRvIGtlZXAgdHJhY2sgb2YgdGhlIHByb21pc2UgZm9yIHRoZVxuICAgICAgLy8gKGZ1bGx5IHJlc29sdmVkKSBjdXJyZW50IGxvY2FscywgYW5kIHBhc3MgdGhpcyBkb3duIHRoZSBjaGFpbi5cbiAgICAgIHZhciByZXNvbHZlZCA9ICRxLndoZW4obG9jYWxzKTtcbiAgICAgIGZvciAodmFyIGw9a2VlcDsgbDx0b1BhdGgubGVuZ3RoOyBsKyssIHN0YXRlPXRvUGF0aFtsXSkge1xuICAgICAgICBsb2NhbHMgPSB0b0xvY2Fsc1tsXSA9IGluaGVyaXQobG9jYWxzKTtcbiAgICAgICAgcmVzb2x2ZWQgPSByZXNvbHZlU3RhdGUoc3RhdGUsIHRvUGFyYW1zLCBzdGF0ZT09PXRvLCByZXNvbHZlZCwgbG9jYWxzKTtcbiAgICAgIH1cblxuICAgICAgLy8gT25jZSBldmVyeXRoaW5nIGlzIHJlc29sdmVkLCB3ZSBhcmUgcmVhZHkgdG8gcGVyZm9ybSB0aGUgYWN0dWFsIHRyYW5zaXRpb25cbiAgICAgIC8vIGFuZCByZXR1cm4gYSBwcm9taXNlIGZvciB0aGUgbmV3IHN0YXRlLiBXZSBhbHNvIGtlZXAgdHJhY2sgb2Ygd2hhdCB0aGVcbiAgICAgIC8vIGN1cnJlbnQgcHJvbWlzZSBpcywgc28gdGhhdCB3ZSBjYW4gZGV0ZWN0IG92ZXJsYXBwaW5nIHRyYW5zaXRpb25zIGFuZFxuICAgICAgLy8ga2VlcCBvbmx5IHRoZSBvdXRjb21lIG9mIHRoZSBsYXN0IHRyYW5zaXRpb24uXG4gICAgICB2YXIgdHJhbnNpdGlvbiA9ICRzdGF0ZS50cmFuc2l0aW9uID0gcmVzb2x2ZWQudGhlbihmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsLCBlbnRlcmluZywgZXhpdGluZztcblxuICAgICAgICBpZiAoJHN0YXRlLnRyYW5zaXRpb24gIT09IHRyYW5zaXRpb24pIHJldHVybiBUcmFuc2l0aW9uU3VwZXJzZWRlZDtcblxuICAgICAgICAvLyBFeGl0ICdmcm9tJyBzdGF0ZXMgbm90IGtlcHRcbiAgICAgICAgZm9yIChsPWZyb21QYXRoLmxlbmd0aC0xOyBsPj1rZWVwOyBsLS0pIHtcbiAgICAgICAgICBleGl0aW5nID0gZnJvbVBhdGhbbF07XG4gICAgICAgICAgaWYgKGV4aXRpbmcuc2VsZi5vbkV4aXQpIHtcbiAgICAgICAgICAgICRpbmplY3Rvci5pbnZva2UoZXhpdGluZy5zZWxmLm9uRXhpdCwgZXhpdGluZy5zZWxmLCBleGl0aW5nLmxvY2Fscy5nbG9iYWxzKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgZXhpdGluZy5sb2NhbHMgPSBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRW50ZXIgJ3RvJyBzdGF0ZXMgbm90IGtlcHRcbiAgICAgICAgZm9yIChsPWtlZXA7IGw8dG9QYXRoLmxlbmd0aDsgbCsrKSB7XG4gICAgICAgICAgZW50ZXJpbmcgPSB0b1BhdGhbbF07XG4gICAgICAgICAgZW50ZXJpbmcubG9jYWxzID0gdG9Mb2NhbHNbbF07XG4gICAgICAgICAgaWYgKGVudGVyaW5nLnNlbGYub25FbnRlcikge1xuICAgICAgICAgICAgJGluamVjdG9yLmludm9rZShlbnRlcmluZy5zZWxmLm9uRW50ZXIsIGVudGVyaW5nLnNlbGYsIGVudGVyaW5nLmxvY2Fscy5nbG9iYWxzKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICAvLyBSdW4gaXQgYWdhaW4sIHRvIGNhdGNoIGFueSB0cmFuc2l0aW9ucyBpbiBjYWxsYmFja3NcbiAgICAgICAgaWYgKCRzdGF0ZS50cmFuc2l0aW9uICE9PSB0cmFuc2l0aW9uKSByZXR1cm4gVHJhbnNpdGlvblN1cGVyc2VkZWQ7XG5cbiAgICAgICAgLy8gVXBkYXRlIGdsb2JhbHMgaW4gJHN0YXRlXG4gICAgICAgICRzdGF0ZS4kY3VycmVudCA9IHRvO1xuICAgICAgICAkc3RhdGUuY3VycmVudCA9IHRvLnNlbGY7XG4gICAgICAgICRzdGF0ZS5wYXJhbXMgPSB0b1BhcmFtcztcbiAgICAgICAgY29weSgkc3RhdGUucGFyYW1zLCAkc3RhdGVQYXJhbXMpO1xuICAgICAgICAkc3RhdGUudHJhbnNpdGlvbiA9IG51bGw7XG5cbiAgICAgICAgLy8gVXBkYXRlICRsb2NhdGlvblxuICAgICAgICB2YXIgdG9OYXYgPSB0by5uYXZpZ2FibGU7XG4gICAgICAgIGlmIChvcHRpb25zLmxvY2F0aW9uICYmIHRvTmF2KSB7XG4gICAgICAgICAgJGxvY2F0aW9uLnVybCh0b05hdi51cmwuZm9ybWF0KHRvTmF2LmxvY2Fscy5nbG9iYWxzLiRzdGF0ZVBhcmFtcykpO1xuXG4gICAgICAgICAgaWYgKG9wdGlvbnMubG9jYXRpb24gPT09ICdyZXBsYWNlJykge1xuICAgICAgICAgICAgJGxvY2F0aW9uLnJlcGxhY2UoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAob3B0aW9ucy5ub3RpZnkpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuZ2RvYyBldmVudFxuICAgICAgICAgKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlIyRzdGF0ZUNoYW5nZVN1Y2Nlc3NcbiAgICAgICAgICogQGV2ZW50T2YgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVxuICAgICAgICAgKiBAZXZlbnRUeXBlIGJyb2FkY2FzdCBvbiByb290IHNjb3BlXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBGaXJlZCBvbmNlIHRoZSBzdGF0ZSB0cmFuc2l0aW9uIGlzICoqY29tcGxldGUqKi5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGV2ZW50IEV2ZW50IG9iamVjdC5cbiAgICAgICAgICogQHBhcmFtIHtTdGF0ZX0gdG9TdGF0ZSBUaGUgc3RhdGUgYmVpbmcgdHJhbnNpdGlvbmVkIHRvLlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gdG9QYXJhbXMgVGhlIHBhcmFtcyBzdXBwbGllZCB0byB0aGUgYHRvU3RhdGVgLlxuICAgICAgICAgKiBAcGFyYW0ge1N0YXRlfSBmcm9tU3RhdGUgVGhlIGN1cnJlbnQgc3RhdGUsIHByZS10cmFuc2l0aW9uLlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZnJvbVBhcmFtcyBUaGUgcGFyYW1zIHN1cHBsaWVkIHRvIHRoZSBgZnJvbVN0YXRlYC5cbiAgICAgICAgICovXG4gICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgdG8uc2VsZiwgdG9QYXJhbXMsIGZyb20uc2VsZiwgZnJvbVBhcmFtcyk7XG4gICAgICAgIH1cbiAgICAgICAgY3VycmVudExvY2F0aW9uID0gJGxvY2F0aW9uLnVybCgpO1xuXG4gICAgICAgIHJldHVybiAkc3RhdGUuY3VycmVudDtcbiAgICAgIH0sIGZ1bmN0aW9uIChlcnJvcikge1xuICAgICAgICBpZiAoJHN0YXRlLnRyYW5zaXRpb24gIT09IHRyYW5zaXRpb24pIHJldHVybiBUcmFuc2l0aW9uU3VwZXJzZWRlZDtcblxuICAgICAgICAkc3RhdGUudHJhbnNpdGlvbiA9IG51bGw7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmdkb2MgZXZlbnRcbiAgICAgICAgICogQG5hbWUgdWkucm91dGVyLnN0YXRlLiRzdGF0ZSMkc3RhdGVDaGFuZ2VFcnJvclxuICAgICAgICAgKiBAZXZlbnRPZiB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlXG4gICAgICAgICAqIEBldmVudFR5cGUgYnJvYWRjYXN0IG9uIHJvb3Qgc2NvcGVcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqIEZpcmVkIHdoZW4gYW4gKiplcnJvciBvY2N1cnMqKiBkdXJpbmcgdHJhbnNpdGlvbi4gSXQncyBpbXBvcnRhbnQgdG8gbm90ZSB0aGF0IGlmIHlvdVxuICAgICAgICAgKiBoYXZlIGFueSBlcnJvcnMgaW4geW91ciByZXNvbHZlIGZ1bmN0aW9ucyAoamF2YXNjcmlwdCBlcnJvcnMsIG5vbi1leGlzdGVudCBzZXJ2aWNlcywgZXRjKVxuICAgICAgICAgKiB0aGV5IHdpbGwgbm90IHRocm93IHRyYWRpdGlvbmFsbHkuIFlvdSBtdXN0IGxpc3RlbiBmb3IgdGhpcyAkc3RhdGVDaGFuZ2VFcnJvciBldmVudCB0b1xuICAgICAgICAgKiBjYXRjaCAqKkFMTCoqIGVycm9ycy5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGV2ZW50IEV2ZW50IG9iamVjdC5cbiAgICAgICAgICogQHBhcmFtIHtTdGF0ZX0gdG9TdGF0ZSBUaGUgc3RhdGUgYmVpbmcgdHJhbnNpdGlvbmVkIHRvLlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gdG9QYXJhbXMgVGhlIHBhcmFtcyBzdXBwbGllZCB0byB0aGUgYHRvU3RhdGVgLlxuICAgICAgICAgKiBAcGFyYW0ge1N0YXRlfSBmcm9tU3RhdGUgVGhlIGN1cnJlbnQgc3RhdGUsIHByZS10cmFuc2l0aW9uLlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZnJvbVBhcmFtcyBUaGUgcGFyYW1zIHN1cHBsaWVkIHRvIHRoZSBgZnJvbVN0YXRlYC5cbiAgICAgICAgICogQHBhcmFtIHtFcnJvcn0gZXJyb3IgVGhlIHJlc29sdmUgZXJyb3Igb2JqZWN0LlxuICAgICAgICAgKi9cbiAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckc3RhdGVDaGFuZ2VFcnJvcicsIHRvLnNlbGYsIHRvUGFyYW1zLCBmcm9tLnNlbGYsIGZyb21QYXJhbXMsIGVycm9yKTtcbiAgICAgICAgc3luY1VybCgpO1xuXG4gICAgICAgIHJldHVybiAkcS5yZWplY3QoZXJyb3IpO1xuICAgICAgfSk7XG5cbiAgICAgIHJldHVybiB0cmFuc2l0aW9uO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICAgKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlI2lzXG4gICAgICogQG1ldGhvZE9mIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIFNpbWlsYXIgdG8ge0BsaW5rIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGUjbWV0aG9kc19pbmNsdWRlcyAkc3RhdGUuaW5jbHVkZXN9LFxuICAgICAqIGJ1dCBvbmx5IGNoZWNrcyBmb3IgdGhlIGZ1bGwgc3RhdGUgbmFtZS4gSWYgcGFyYW1zIGlzIHN1cHBsaWVkIHRoZW4gaXQgd2lsbCBiZSBcbiAgICAgKiB0ZXN0ZWQgZm9yIHN0cmljdCBlcXVhbGl0eSBhZ2FpbnN0IHRoZSBjdXJyZW50IGFjdGl2ZSBwYXJhbXMgb2JqZWN0LCBzbyBhbGwgcGFyYW1zIFxuICAgICAqIG11c3QgbWF0Y2ggd2l0aCBub25lIG1pc3NpbmcgYW5kIG5vIGV4dHJhcy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogPHByZT5cbiAgICAgKiAkc3RhdGUuaXMoJ2NvbnRhY3QuZGV0YWlscy5pdGVtJyk7IC8vIHJldHVybnMgdHJ1ZVxuICAgICAqICRzdGF0ZS5pcyhjb250YWN0RGV0YWlsSXRlbVN0YXRlT2JqZWN0KTsgLy8gcmV0dXJucyB0cnVlXG4gICAgICpcbiAgICAgKiAvLyBldmVyeXRoaW5nIGVsc2Ugd291bGQgcmV0dXJuIGZhbHNlXG4gICAgICogPC9wcmU+XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IHN0YXRlTmFtZSBUaGUgc3RhdGUgbmFtZSBvciBzdGF0ZSBvYmplY3QgeW91J2QgbGlrZSB0byBjaGVjay5cbiAgICAgKiBAcGFyYW0ge29iamVjdD19IHBhcmFtcyBBIHBhcmFtIG9iamVjdCwgZS5nLiBge3NlY3Rpb25JZDogc2VjdGlvbi5pZH1gLCB0aGF0IHlvdSdkIGxpa2UgXG4gICAgICogdG8gdGVzdCBhZ2FpbnN0IHRoZSBjdXJyZW50IGFjdGl2ZSBzdGF0ZS5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIGl0IGlzIHRoZSBzdGF0ZS5cbiAgICAgKi9cbiAgICAkc3RhdGUuaXMgPSBmdW5jdGlvbiBpcyhzdGF0ZU9yTmFtZSwgcGFyYW1zKSB7XG4gICAgICB2YXIgc3RhdGUgPSBmaW5kU3RhdGUoc3RhdGVPck5hbWUpO1xuXG4gICAgICBpZiAoIWlzRGVmaW5lZChzdGF0ZSkpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgaWYgKCRzdGF0ZS4kY3VycmVudCAhPT0gc3RhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gaXNEZWZpbmVkKHBhcmFtcykgJiYgcGFyYW1zICE9PSBudWxsID8gYW5ndWxhci5lcXVhbHMoJHN0YXRlUGFyYW1zLCBwYXJhbXMpIDogdHJ1ZTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAgICogQG5hbWUgdWkucm91dGVyLnN0YXRlLiRzdGF0ZSNpbmNsdWRlc1xuICAgICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlXG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBBIG1ldGhvZCB0byBkZXRlcm1pbmUgaWYgdGhlIGN1cnJlbnQgYWN0aXZlIHN0YXRlIGlzIGVxdWFsIHRvIG9yIGlzIHRoZSBjaGlsZCBvZiB0aGUgXG4gICAgICogc3RhdGUgc3RhdGVOYW1lLiBJZiBhbnkgcGFyYW1zIGFyZSBwYXNzZWQgdGhlbiB0aGV5IHdpbGwgYmUgdGVzdGVkIGZvciBhIG1hdGNoIGFzIHdlbGwuXG4gICAgICogTm90IGFsbCB0aGUgcGFyYW1ldGVycyBuZWVkIHRvIGJlIHBhc3NlZCwganVzdCB0aGUgb25lcyB5b3UnZCBsaWtlIHRvIHRlc3QgZm9yIGVxdWFsaXR5LlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiA8cHJlPlxuICAgICAqICRzdGF0ZS4kY3VycmVudC5uYW1lID0gJ2NvbnRhY3RzLmRldGFpbHMuaXRlbSc7XG4gICAgICpcbiAgICAgKiAkc3RhdGUuaW5jbHVkZXMoXCJjb250YWN0c1wiKTsgLy8gcmV0dXJucyB0cnVlXG4gICAgICogJHN0YXRlLmluY2x1ZGVzKFwiY29udGFjdHMuZGV0YWlsc1wiKTsgLy8gcmV0dXJucyB0cnVlXG4gICAgICogJHN0YXRlLmluY2x1ZGVzKFwiY29udGFjdHMuZGV0YWlscy5pdGVtXCIpOyAvLyByZXR1cm5zIHRydWVcbiAgICAgKiAkc3RhdGUuaW5jbHVkZXMoXCJjb250YWN0cy5saXN0XCIpOyAvLyByZXR1cm5zIGZhbHNlXG4gICAgICogJHN0YXRlLmluY2x1ZGVzKFwiYWJvdXRcIik7IC8vIHJldHVybnMgZmFsc2VcbiAgICAgKiA8L3ByZT5cbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIEJhc2ljIGdsb2JpbmcgcGF0dGVybnMgd2lsbCBhbHNvIHdvcmsuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIDxwcmU+XG4gICAgICogJHN0YXRlLiRjdXJyZW50Lm5hbWUgPSAnY29udGFjdHMuZGV0YWlscy5pdGVtLnVybCc7XG4gICAgICpcbiAgICAgKiAkc3RhdGUuaW5jbHVkZXMoXCIqLmRldGFpbHMuKi4qXCIpOyAvLyByZXR1cm5zIHRydWVcbiAgICAgKiAkc3RhdGUuaW5jbHVkZXMoXCIqLmRldGFpbHMuKipcIik7IC8vIHJldHVybnMgdHJ1ZVxuICAgICAqICRzdGF0ZS5pbmNsdWRlcyhcIioqLml0ZW0uKipcIik7IC8vIHJldHVybnMgdHJ1ZVxuICAgICAqICRzdGF0ZS5pbmNsdWRlcyhcIiouZGV0YWlscy5pdGVtLnVybFwiKTsgLy8gcmV0dXJucyB0cnVlXG4gICAgICogJHN0YXRlLmluY2x1ZGVzKFwiKi5kZXRhaWxzLioudXJsXCIpOyAvLyByZXR1cm5zIHRydWVcbiAgICAgKiAkc3RhdGUuaW5jbHVkZXMoXCIqLmRldGFpbHMuKlwiKTsgLy8gcmV0dXJucyBmYWxzZVxuICAgICAqICRzdGF0ZS5pbmNsdWRlcyhcIml0ZW0uKipcIik7IC8vIHJldHVybnMgZmFsc2VcbiAgICAgKiA8L3ByZT5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBzdGF0ZU9yTmFtZSBBIHBhcnRpYWwgbmFtZSB0byBiZSBzZWFyY2hlZCBmb3Igd2l0aGluIHRoZSBjdXJyZW50IHN0YXRlIG5hbWUuXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtcyBBIHBhcmFtIG9iamVjdCwgZS5nLiBge3NlY3Rpb25JZDogc2VjdGlvbi5pZH1gLCBcbiAgICAgKiB0aGF0IHlvdSdkIGxpa2UgdG8gdGVzdCBhZ2FpbnN0IHRoZSBjdXJyZW50IGFjdGl2ZSBzdGF0ZS5cbiAgICAgKiBAcmV0dXJucyB7Ym9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIGl0IGRvZXMgaW5jbHVkZSB0aGUgc3RhdGVcbiAgICAgKi9cblxuICAgICRzdGF0ZS5pbmNsdWRlcyA9IGZ1bmN0aW9uIGluY2x1ZGVzKHN0YXRlT3JOYW1lLCBwYXJhbXMpIHtcbiAgICAgIGlmIChpc1N0cmluZyhzdGF0ZU9yTmFtZSkgJiYgaXNHbG9iKHN0YXRlT3JOYW1lKSkge1xuICAgICAgICBpZiAoZG9lc1N0YXRlTWF0Y2hHbG9iKHN0YXRlT3JOYW1lKSkge1xuICAgICAgICAgIHN0YXRlT3JOYW1lID0gJHN0YXRlLiRjdXJyZW50Lm5hbWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHZhciBzdGF0ZSA9IGZpbmRTdGF0ZShzdGF0ZU9yTmFtZSk7XG4gICAgICBpZiAoIWlzRGVmaW5lZChzdGF0ZSkpIHtcbiAgICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICAgIH1cblxuICAgICAgaWYgKCFpc0RlZmluZWQoJHN0YXRlLiRjdXJyZW50LmluY2x1ZGVzW3N0YXRlLm5hbWVdKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHZhciB2YWxpZFBhcmFtcyA9IHRydWU7XG4gICAgICBhbmd1bGFyLmZvckVhY2gocGFyYW1zLCBmdW5jdGlvbih2YWx1ZSwga2V5KSB7XG4gICAgICAgIGlmICghaXNEZWZpbmVkKCRzdGF0ZVBhcmFtc1trZXldKSB8fCAkc3RhdGVQYXJhbXNba2V5XSAhPT0gdmFsdWUpIHtcbiAgICAgICAgICB2YWxpZFBhcmFtcyA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB2YWxpZFBhcmFtcztcbiAgICB9O1xuXG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICAgKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlI2hyZWZcbiAgICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQSB1cmwgZ2VuZXJhdGlvbiBtZXRob2QgdGhhdCByZXR1cm5zIHRoZSBjb21waWxlZCB1cmwgZm9yIHRoZSBnaXZlbiBzdGF0ZSBwb3B1bGF0ZWQgd2l0aCB0aGUgZ2l2ZW4gcGFyYW1zLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiA8cHJlPlxuICAgICAqIGV4cGVjdCgkc3RhdGUuaHJlZihcImFib3V0LnBlcnNvblwiLCB7IHBlcnNvbjogXCJib2JcIiB9KSkudG9FcXVhbChcIi9hYm91dC9ib2JcIik7XG4gICAgICogPC9wcmU+XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IHN0YXRlT3JOYW1lIFRoZSBzdGF0ZSBuYW1lIG9yIHN0YXRlIG9iamVjdCB5b3UnZCBsaWtlIHRvIGdlbmVyYXRlIGEgdXJsIGZyb20uXG4gICAgICogQHBhcmFtIHtvYmplY3Q9fSBwYXJhbXMgQW4gb2JqZWN0IG9mIHBhcmFtZXRlciB2YWx1ZXMgdG8gZmlsbCB0aGUgc3RhdGUncyByZXF1aXJlZCBwYXJhbWV0ZXJzLlxuICAgICAqIEBwYXJhbSB7b2JqZWN0PX0gb3B0aW9ucyBPcHRpb25zIG9iamVjdC4gVGhlIG9wdGlvbnMgYXJlOlxuICAgICAqXG4gICAgICogLSAqKmBsb3NzeWAqKiAtIHtib29sZWFuPXRydWV9IC0gIElmIHRydWUsIGFuZCBpZiB0aGVyZSBpcyBubyB1cmwgYXNzb2NpYXRlZCB3aXRoIHRoZSBzdGF0ZSBwcm92aWRlZCBpbiB0aGVcbiAgICAgKiAgICBmaXJzdCBwYXJhbWV0ZXIsIHRoZW4gdGhlIGNvbnN0cnVjdGVkIGhyZWYgdXJsIHdpbGwgYmUgYnVpbHQgZnJvbSB0aGUgZmlyc3QgbmF2aWdhYmxlIGFuY2VzdG9yIChha2FcbiAgICAgKiAgICBhbmNlc3RvciB3aXRoIGEgdmFsaWQgdXJsKS5cbiAgICAgKiAtICoqYGluaGVyaXRgKiogLSB7Ym9vbGVhbj1mYWxzZX0sIElmIGB0cnVlYCB3aWxsIGluaGVyaXQgdXJsIHBhcmFtZXRlcnMgZnJvbSBjdXJyZW50IHVybC5cbiAgICAgKiAtICoqYHJlbGF0aXZlYCoqIC0ge29iamVjdD0kc3RhdGUuJGN1cnJlbnR9LCBXaGVuIHRyYW5zaXRpb25pbmcgd2l0aCByZWxhdGl2ZSBwYXRoIChlLmcgJ14nKSwgXG4gICAgICogICAgZGVmaW5lcyB3aGljaCBzdGF0ZSB0byBiZSByZWxhdGl2ZSBmcm9tLlxuICAgICAqIC0gKipgYWJzb2x1dGVgKiogLSB7Ym9vbGVhbj1mYWxzZX0sICBJZiB0cnVlIHdpbGwgZ2VuZXJhdGUgYW4gYWJzb2x1dGUgdXJsLCBlLmcuIFwiaHR0cDovL3d3dy5leGFtcGxlLmNvbS9mdWxsdXJsXCIuXG4gICAgICogXG4gICAgICogQHJldHVybnMge3N0cmluZ30gY29tcGlsZWQgc3RhdGUgdXJsXG4gICAgICovXG4gICAgJHN0YXRlLmhyZWYgPSBmdW5jdGlvbiBocmVmKHN0YXRlT3JOYW1lLCBwYXJhbXMsIG9wdGlvbnMpIHtcbiAgICAgIG9wdGlvbnMgPSBleHRlbmQoeyBsb3NzeTogdHJ1ZSwgaW5oZXJpdDogZmFsc2UsIGFic29sdXRlOiBmYWxzZSwgcmVsYXRpdmU6ICRzdGF0ZS4kY3VycmVudCB9LCBvcHRpb25zIHx8IHt9KTtcbiAgICAgIHZhciBzdGF0ZSA9IGZpbmRTdGF0ZShzdGF0ZU9yTmFtZSwgb3B0aW9ucy5yZWxhdGl2ZSk7XG4gICAgICBpZiAoIWlzRGVmaW5lZChzdGF0ZSkpIHJldHVybiBudWxsO1xuXG4gICAgICBwYXJhbXMgPSBpbmhlcml0UGFyYW1zKCRzdGF0ZVBhcmFtcywgcGFyYW1zIHx8IHt9LCAkc3RhdGUuJGN1cnJlbnQsIHN0YXRlKTtcbiAgICAgIHZhciBuYXYgPSAoc3RhdGUgJiYgb3B0aW9ucy5sb3NzeSkgPyBzdGF0ZS5uYXZpZ2FibGUgOiBzdGF0ZTtcbiAgICAgIHZhciB1cmwgPSAobmF2ICYmIG5hdi51cmwpID8gbmF2LnVybC5mb3JtYXQobm9ybWFsaXplKHN0YXRlLnBhcmFtcywgcGFyYW1zIHx8IHt9KSkgOiBudWxsO1xuICAgICAgaWYgKCEkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUoKSAmJiB1cmwpIHtcbiAgICAgICAgdXJsID0gXCIjXCIgKyAkbG9jYXRpb25Qcm92aWRlci5oYXNoUHJlZml4KCkgKyB1cmw7XG4gICAgICB9XG5cbiAgICAgIGlmIChiYXNlSHJlZiAhPT0gJy8nKSB7XG4gICAgICAgIGlmICgkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUoKSkge1xuICAgICAgICAgIHVybCA9IGJhc2VIcmVmLnNsaWNlKDAsIC0xKSArIHVybDtcbiAgICAgICAgfSBlbHNlIGlmIChvcHRpb25zLmFic29sdXRlKXtcbiAgICAgICAgICB1cmwgPSBiYXNlSHJlZi5zbGljZSgxKSArIHVybDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAob3B0aW9ucy5hYnNvbHV0ZSAmJiB1cmwpIHtcbiAgICAgICAgdXJsID0gJGxvY2F0aW9uLnByb3RvY29sKCkgKyAnOi8vJyArIFxuICAgICAgICAgICAgICAkbG9jYXRpb24uaG9zdCgpICsgXG4gICAgICAgICAgICAgICgkbG9jYXRpb24ucG9ydCgpID09IDgwIHx8ICRsb2NhdGlvbi5wb3J0KCkgPT0gNDQzID8gJycgOiAnOicgKyAkbG9jYXRpb24ucG9ydCgpKSArIFxuICAgICAgICAgICAgICAoISRsb2NhdGlvblByb3ZpZGVyLmh0bWw1TW9kZSgpICYmIHVybCA/ICcvJyA6ICcnKSArIFxuICAgICAgICAgICAgICB1cmw7XG4gICAgICB9XG4gICAgICByZXR1cm4gdXJsO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICAgKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlI2dldFxuICAgICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlXG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBSZXR1cm5zIHRoZSBzdGF0ZSBjb25maWd1cmF0aW9uIG9iamVjdCBmb3IgYW55IHNwZWNpZmljIHN0YXRlIG9yIGFsbCBzdGF0ZXMuXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ3xvYmplY3Q9fSBzdGF0ZU9yTmFtZSBJZiBwcm92aWRlZCwgd2lsbCBvbmx5IGdldCB0aGUgY29uZmlnIGZvclxuICAgICAqIHRoZSByZXF1ZXN0ZWQgc3RhdGUuIElmIG5vdCBwcm92aWRlZCwgcmV0dXJucyBhbiBhcnJheSBvZiBBTEwgc3RhdGUgY29uZmlncy5cbiAgICAgKiBAcmV0dXJucyB7b2JqZWN0fGFycmF5fSBTdGF0ZSBjb25maWd1cmF0aW9uIG9iamVjdCBvciBhcnJheSBvZiBhbGwgb2JqZWN0cy5cbiAgICAgKi9cbiAgICAkc3RhdGUuZ2V0ID0gZnVuY3Rpb24gKHN0YXRlT3JOYW1lLCBjb250ZXh0KSB7XG4gICAgICBpZiAoIWlzRGVmaW5lZChzdGF0ZU9yTmFtZSkpIHtcbiAgICAgICAgdmFyIGxpc3QgPSBbXTtcbiAgICAgICAgZm9yRWFjaChzdGF0ZXMsIGZ1bmN0aW9uKHN0YXRlKSB7IGxpc3QucHVzaChzdGF0ZS5zZWxmKTsgfSk7XG4gICAgICAgIHJldHVybiBsaXN0O1xuICAgICAgfVxuICAgICAgdmFyIHN0YXRlID0gZmluZFN0YXRlKHN0YXRlT3JOYW1lLCBjb250ZXh0KTtcbiAgICAgIHJldHVybiAoc3RhdGUgJiYgc3RhdGUuc2VsZikgPyBzdGF0ZS5zZWxmIDogbnVsbDtcbiAgICB9O1xuXG4gICAgZnVuY3Rpb24gcmVzb2x2ZVN0YXRlKHN0YXRlLCBwYXJhbXMsIHBhcmFtc0FyZUZpbHRlcmVkLCBpbmhlcml0ZWQsIGRzdCkge1xuICAgICAgLy8gTWFrZSBhIHJlc3RyaWN0ZWQgJHN0YXRlUGFyYW1zIHdpdGggb25seSB0aGUgcGFyYW1ldGVycyB0aGF0IGFwcGx5IHRvIHRoaXMgc3RhdGUgaWZcbiAgICAgIC8vIG5lY2Vzc2FyeS4gSW4gYWRkaXRpb24gdG8gYmVpbmcgYXZhaWxhYmxlIHRvIHRoZSBjb250cm9sbGVyIGFuZCBvbkVudGVyL29uRXhpdCBjYWxsYmFja3MsXG4gICAgICAvLyB3ZSBhbHNvIG5lZWQgJHN0YXRlUGFyYW1zIHRvIGJlIGF2YWlsYWJsZSBmb3IgYW55ICRpbmplY3RvciBjYWxscyB3ZSBtYWtlIGR1cmluZyB0aGVcbiAgICAgIC8vIGRlcGVuZGVuY3kgcmVzb2x1dGlvbiBwcm9jZXNzLlxuICAgICAgdmFyICRzdGF0ZVBhcmFtcyA9IChwYXJhbXNBcmVGaWx0ZXJlZCkgPyBwYXJhbXMgOiBmaWx0ZXJCeUtleXMoc3RhdGUucGFyYW1zLCBwYXJhbXMpO1xuICAgICAgdmFyIGxvY2FscyA9IHsgJHN0YXRlUGFyYW1zOiAkc3RhdGVQYXJhbXMgfTtcblxuICAgICAgLy8gUmVzb2x2ZSAnZ2xvYmFsJyBkZXBlbmRlbmNpZXMgZm9yIHRoZSBzdGF0ZSwgaS5lLiB0aG9zZSBub3Qgc3BlY2lmaWMgdG8gYSB2aWV3LlxuICAgICAgLy8gV2UncmUgYWxzbyBpbmNsdWRpbmcgJHN0YXRlUGFyYW1zIGluIHRoaXM7IHRoYXQgd2F5IHRoZSBwYXJhbWV0ZXJzIGFyZSByZXN0cmljdGVkXG4gICAgICAvLyB0byB0aGUgc2V0IHRoYXQgc2hvdWxkIGJlIHZpc2libGUgdG8gdGhlIHN0YXRlLCBhbmQgYXJlIGluZGVwZW5kZW50IG9mIHdoZW4gd2UgdXBkYXRlXG4gICAgICAvLyB0aGUgZ2xvYmFsICRzdGF0ZSBhbmQgJHN0YXRlUGFyYW1zIHZhbHVlcy5cbiAgICAgIGRzdC5yZXNvbHZlID0gJHJlc29sdmUucmVzb2x2ZShzdGF0ZS5yZXNvbHZlLCBsb2NhbHMsIGRzdC5yZXNvbHZlLCBzdGF0ZSk7XG4gICAgICB2YXIgcHJvbWlzZXMgPSBbIGRzdC5yZXNvbHZlLnRoZW4oZnVuY3Rpb24gKGdsb2JhbHMpIHtcbiAgICAgICAgZHN0Lmdsb2JhbHMgPSBnbG9iYWxzO1xuICAgICAgfSkgXTtcbiAgICAgIGlmIChpbmhlcml0ZWQpIHByb21pc2VzLnB1c2goaW5oZXJpdGVkKTtcblxuICAgICAgLy8gUmVzb2x2ZSB0ZW1wbGF0ZSBhbmQgZGVwZW5kZW5jaWVzIGZvciBhbGwgdmlld3MuXG4gICAgICBmb3JFYWNoKHN0YXRlLnZpZXdzLCBmdW5jdGlvbiAodmlldywgbmFtZSkge1xuICAgICAgICB2YXIgaW5qZWN0YWJsZXMgPSAodmlldy5yZXNvbHZlICYmIHZpZXcucmVzb2x2ZSAhPT0gc3RhdGUucmVzb2x2ZSA/IHZpZXcucmVzb2x2ZSA6IHt9KTtcbiAgICAgICAgaW5qZWN0YWJsZXMuJHRlbXBsYXRlID0gWyBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcmV0dXJuICR2aWV3LmxvYWQobmFtZSwgeyB2aWV3OiB2aWV3LCBsb2NhbHM6IGxvY2FscywgcGFyYW1zOiAkc3RhdGVQYXJhbXMsIG5vdGlmeTogZmFsc2UgfSkgfHwgJyc7XG4gICAgICAgIH1dO1xuXG4gICAgICAgIHByb21pc2VzLnB1c2goJHJlc29sdmUucmVzb2x2ZShpbmplY3RhYmxlcywgbG9jYWxzLCBkc3QucmVzb2x2ZSwgc3RhdGUpLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgIC8vIFJlZmVyZW5jZXMgdG8gdGhlIGNvbnRyb2xsZXIgKG9ubHkgaW5zdGFudGlhdGVkIGF0IGxpbmsgdGltZSlcbiAgICAgICAgICBpZiAoaXNGdW5jdGlvbih2aWV3LmNvbnRyb2xsZXJQcm92aWRlcikgfHwgaXNBcnJheSh2aWV3LmNvbnRyb2xsZXJQcm92aWRlcikpIHtcbiAgICAgICAgICAgIHZhciBpbmplY3RMb2NhbHMgPSBhbmd1bGFyLmV4dGVuZCh7fSwgaW5qZWN0YWJsZXMsIGxvY2Fscyk7XG4gICAgICAgICAgICByZXN1bHQuJCRjb250cm9sbGVyID0gJGluamVjdG9yLmludm9rZSh2aWV3LmNvbnRyb2xsZXJQcm92aWRlciwgbnVsbCwgaW5qZWN0TG9jYWxzKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzdWx0LiQkY29udHJvbGxlciA9IHZpZXcuY29udHJvbGxlcjtcbiAgICAgICAgICB9XG4gICAgICAgICAgLy8gUHJvdmlkZSBhY2Nlc3MgdG8gdGhlIHN0YXRlIGl0c2VsZiBmb3IgaW50ZXJuYWwgdXNlXG4gICAgICAgICAgcmVzdWx0LiQkc3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgICByZXN1bHQuJCRjb250cm9sbGVyQXMgPSB2aWV3LmNvbnRyb2xsZXJBcztcbiAgICAgICAgICBkc3RbbmFtZV0gPSByZXN1bHQ7XG4gICAgICAgIH0pKTtcbiAgICAgIH0pO1xuXG4gICAgICAvLyBXYWl0IGZvciBhbGwgdGhlIHByb21pc2VzIGFuZCB0aGVuIHJldHVybiB0aGUgYWN0aXZhdGlvbiBvYmplY3RcbiAgICAgIHJldHVybiAkcS5hbGwocHJvbWlzZXMpLnRoZW4oZnVuY3Rpb24gKHZhbHVlcykge1xuICAgICAgICByZXR1cm4gZHN0O1xuICAgICAgfSk7XG4gICAgfVxuXG4gICAgcmV0dXJuICRzdGF0ZTtcbiAgfVxuXG4gIGZ1bmN0aW9uIHNob3VsZFRyaWdnZXJSZWxvYWQodG8sIGZyb20sIGxvY2Fscywgb3B0aW9ucykge1xuICAgIGlmICggdG8gPT09IGZyb20gJiYgKChsb2NhbHMgPT09IGZyb20ubG9jYWxzICYmICFvcHRpb25zLnJlbG9hZCkgfHwgKHRvLnNlbGYucmVsb2FkT25TZWFyY2ggPT09IGZhbHNlKSkgKSB7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ3VpLnJvdXRlci5zdGF0ZScpXG4gIC52YWx1ZSgnJHN0YXRlUGFyYW1zJywge30pXG4gIC5wcm92aWRlcignJHN0YXRlJywgJFN0YXRlUHJvdmlkZXIpO1xuXG5cbiRWaWV3UHJvdmlkZXIuJGluamVjdCA9IFtdO1xuZnVuY3Rpb24gJFZpZXdQcm92aWRlcigpIHtcblxuICB0aGlzLiRnZXQgPSAkZ2V0O1xuICAvKipcbiAgICogQG5nZG9jIG9iamVjdFxuICAgKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHZpZXdcbiAgICpcbiAgICogQHJlcXVpcmVzIHVpLnJvdXRlci51dGlsLiR0ZW1wbGF0ZUZhY3RvcnlcbiAgICogQHJlcXVpcmVzICRyb290U2NvcGVcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqXG4gICAqL1xuICAkZ2V0LiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAnJHRlbXBsYXRlRmFjdG9yeSddO1xuICBmdW5jdGlvbiAkZ2V0KCAgICRyb290U2NvcGUsICAgJHRlbXBsYXRlRmFjdG9yeSkge1xuICAgIHJldHVybiB7XG4gICAgICAvLyAkdmlldy5sb2FkKCdmdWxsLnZpZXdOYW1lJywgeyB0ZW1wbGF0ZTogLi4uLCBjb250cm9sbGVyOiAuLi4sIHJlc29sdmU6IC4uLiwgYXN5bmM6IGZhbHNlLCBwYXJhbXM6IC4uLiB9KVxuICAgICAgLyoqXG4gICAgICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICAgICAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS4kdmlldyNsb2FkXG4gICAgICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnN0YXRlLiR2aWV3XG4gICAgICAgKlxuICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgKlxuICAgICAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgbmFtZVxuICAgICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgb3B0aW9uIG9iamVjdC5cbiAgICAgICAqL1xuICAgICAgbG9hZDogZnVuY3Rpb24gbG9hZChuYW1lLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciByZXN1bHQsIGRlZmF1bHRzID0ge1xuICAgICAgICAgIHRlbXBsYXRlOiBudWxsLCBjb250cm9sbGVyOiBudWxsLCB2aWV3OiBudWxsLCBsb2NhbHM6IG51bGwsIG5vdGlmeTogdHJ1ZSwgYXN5bmM6IHRydWUsIHBhcmFtczoge31cbiAgICAgICAgfTtcbiAgICAgICAgb3B0aW9ucyA9IGV4dGVuZChkZWZhdWx0cywgb3B0aW9ucyk7XG5cbiAgICAgICAgaWYgKG9wdGlvbnMudmlldykge1xuICAgICAgICAgIHJlc3VsdCA9ICR0ZW1wbGF0ZUZhY3RvcnkuZnJvbUNvbmZpZyhvcHRpb25zLnZpZXcsIG9wdGlvbnMucGFyYW1zLCBvcHRpb25zLmxvY2Fscyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlc3VsdCAmJiBvcHRpb25zLm5vdGlmeSkge1xuICAgICAgICAvKipcbiAgICAgICAgICogQG5nZG9jIGV2ZW50XG4gICAgICAgICAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGUjJHZpZXdDb250ZW50TG9hZGluZ1xuICAgICAgICAgKiBAZXZlbnRPZiB1aS5yb3V0ZXIuc3RhdGUuJHZpZXdcbiAgICAgICAgICogQGV2ZW50VHlwZSBicm9hZGNhc3Qgb24gcm9vdCBzY29wZVxuICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICpcbiAgICAgICAgICogRmlyZWQgb25jZSB0aGUgdmlldyAqKmJlZ2lucyBsb2FkaW5nKiosICpiZWZvcmUqIHRoZSBET00gaXMgcmVuZGVyZWQuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBldmVudCBFdmVudCBvYmplY3QuXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSB2aWV3Q29uZmlnIFRoZSB2aWV3IGNvbmZpZyBwcm9wZXJ0aWVzICh0ZW1wbGF0ZSwgY29udHJvbGxlciwgZXRjKS5cbiAgICAgICAgICpcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICpcbiAgICAgICAgICogPHByZT5cbiAgICAgICAgICogJHNjb3BlLiRvbignJHZpZXdDb250ZW50TG9hZGluZycsXG4gICAgICAgICAqIGZ1bmN0aW9uKGV2ZW50LCB2aWV3Q29uZmlnKXtcbiAgICAgICAgICogICAgIC8vIEFjY2VzcyB0byBhbGwgdGhlIHZpZXcgY29uZmlnIHByb3BlcnRpZXMuXG4gICAgICAgICAqICAgICAvLyBhbmQgb25lIHNwZWNpYWwgcHJvcGVydHkgJ3RhcmdldFZpZXcnXG4gICAgICAgICAqICAgICAvLyB2aWV3Q29uZmlnLnRhcmdldFZpZXdcbiAgICAgICAgICogfSk7XG4gICAgICAgICAqIDwvcHJlPlxuICAgICAgICAgKi9cbiAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJyR2aWV3Q29udGVudExvYWRpbmcnLCBvcHRpb25zKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgIH07XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ3VpLnJvdXRlci5zdGF0ZScpLnByb3ZpZGVyKCckdmlldycsICRWaWV3UHJvdmlkZXIpO1xuXG4vKipcbiAqIEBuZ2RvYyBvYmplY3RcbiAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS4kdWlWaWV3U2Nyb2xsUHJvdmlkZXJcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFByb3ZpZGVyIHRoYXQgcmV0dXJucyB0aGUge0BsaW5rIHVpLnJvdXRlci5zdGF0ZS4kdWlWaWV3U2Nyb2xsfSBzZXJ2aWNlIGZ1bmN0aW9uLlxuICovXG5mdW5jdGlvbiAkVmlld1Njcm9sbFByb3ZpZGVyKCkge1xuXG4gIHZhciB1c2VBbmNob3JTY3JvbGwgPSBmYWxzZTtcblxuICAvKipcbiAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS4kdWlWaWV3U2Nyb2xsUHJvdmlkZXIjdXNlQW5jaG9yU2Nyb2xsXG4gICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIuc3RhdGUuJHVpVmlld1Njcm9sbFByb3ZpZGVyXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXZlcnRzIGJhY2sgdG8gdXNpbmcgdGhlIGNvcmUgW2AkYW5jaG9yU2Nyb2xsYF0oaHR0cDovL2RvY3MuYW5ndWxhcmpzLm9yZy9hcGkvbmcuJGFuY2hvclNjcm9sbCkgc2VydmljZSBmb3JcbiAgICogc2Nyb2xsaW5nIGJhc2VkIG9uIHRoZSB1cmwgYW5jaG9yLlxuICAgKi9cbiAgdGhpcy51c2VBbmNob3JTY3JvbGwgPSBmdW5jdGlvbiAoKSB7XG4gICAgdXNlQW5jaG9yU2Nyb2xsID0gdHJ1ZTtcbiAgfTtcblxuICAvKipcbiAgICogQG5nZG9jIG9iamVjdFxuICAgKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHVpVmlld1Njcm9sbFxuICAgKlxuICAgKiBAcmVxdWlyZXMgJGFuY2hvclNjcm9sbFxuICAgKiBAcmVxdWlyZXMgJHRpbWVvdXRcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFdoZW4gY2FsbGVkIHdpdGggYSBqcUxpdGUgZWxlbWVudCwgaXQgc2Nyb2xscyB0aGUgZWxlbWVudCBpbnRvIHZpZXcgKGFmdGVyIGFcbiAgICogYCR0aW1lb3V0YCBzbyB0aGUgRE9NIGhhcyB0aW1lIHRvIHJlZnJlc2gpLlxuICAgKlxuICAgKiBJZiB5b3UgcHJlZmVyIHRvIHJlbHkgb24gYCRhbmNob3JTY3JvbGxgIHRvIHNjcm9sbCB0aGUgdmlldyB0byB0aGUgYW5jaG9yLFxuICAgKiB0aGlzIGNhbiBiZSBlbmFibGVkIGJ5IGNhbGxpbmcge0BsaW5rIHVpLnJvdXRlci5zdGF0ZS4kdWlWaWV3U2Nyb2xsUHJvdmlkZXIjbWV0aG9kc191c2VBbmNob3JTY3JvbGwgYCR1aVZpZXdTY3JvbGxQcm92aWRlci51c2VBbmNob3JTY3JvbGwoKWB9LlxuICAgKi9cbiAgdGhpcy4kZ2V0ID0gWyckYW5jaG9yU2Nyb2xsJywgJyR0aW1lb3V0JywgZnVuY3Rpb24gKCRhbmNob3JTY3JvbGwsICR0aW1lb3V0KSB7XG4gICAgaWYgKHVzZUFuY2hvclNjcm9sbCkge1xuICAgICAgcmV0dXJuICRhbmNob3JTY3JvbGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uICgkZWxlbWVudCkge1xuICAgICAgJHRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgICAkZWxlbWVudFswXS5zY3JvbGxJbnRvVmlldygpO1xuICAgICAgfSwgMCwgZmFsc2UpO1xuICAgIH07XG4gIH1dO1xufVxuXG5hbmd1bGFyLm1vZHVsZSgndWkucm91dGVyLnN0YXRlJykucHJvdmlkZXIoJyR1aVZpZXdTY3JvbGwnLCAkVmlld1Njcm9sbFByb3ZpZGVyKTtcblxuLyoqXG4gKiBAbmdkb2MgZGlyZWN0aXZlXG4gKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuZGlyZWN0aXZlOnVpLXZpZXdcbiAqXG4gKiBAcmVxdWlyZXMgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVxuICogQHJlcXVpcmVzICRjb21waWxlXG4gKiBAcmVxdWlyZXMgJGNvbnRyb2xsZXJcbiAqIEByZXF1aXJlcyAkaW5qZWN0b3JcbiAqIEByZXF1aXJlcyB1aS5yb3V0ZXIuc3RhdGUuJHVpVmlld1Njcm9sbFxuICogQHJlcXVpcmVzICRkb2N1bWVudFxuICpcbiAqIEByZXN0cmljdCBFQ0FcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFRoZSB1aS12aWV3IGRpcmVjdGl2ZSB0ZWxscyAkc3RhdGUgd2hlcmUgdG8gcGxhY2UgeW91ciB0ZW1wbGF0ZXMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmc9fSB1aS12aWV3IEEgdmlldyBuYW1lLiBUaGUgbmFtZSBzaG91bGQgYmUgdW5pcXVlIGFtb25nc3QgdGhlIG90aGVyIHZpZXdzIGluIHRoZVxuICogc2FtZSBzdGF0ZS4gWW91IGNhbiBoYXZlIHZpZXdzIG9mIHRoZSBzYW1lIG5hbWUgdGhhdCBsaXZlIGluIGRpZmZlcmVudCBzdGF0ZXMuXG4gKlxuICogQHBhcmFtIHtzdHJpbmc9fSBhdXRvc2Nyb2xsIEl0IGFsbG93cyB5b3UgdG8gc2V0IHRoZSBzY3JvbGwgYmVoYXZpb3Igb2YgdGhlIGJyb3dzZXIgd2luZG93XG4gKiB3aGVuIGEgdmlldyBpcyBwb3B1bGF0ZWQuIEJ5IGRlZmF1bHQsICRhbmNob3JTY3JvbGwgaXMgb3ZlcnJpZGRlbiBieSB1aS1yb3V0ZXIncyBjdXN0b20gc2Nyb2xsXG4gKiBzZXJ2aWNlLCB7QGxpbmsgdWkucm91dGVyLnN0YXRlLiR1aVZpZXdTY3JvbGx9LiBUaGlzIGN1c3RvbSBzZXJ2aWNlIGxldCdzIHlvdVxuICogc2Nyb2xsIHVpLXZpZXcgZWxlbWVudHMgaW50byB2aWV3IHdoZW4gdGhleSBhcmUgcG9wdWxhdGVkIGR1cmluZyBhIHN0YXRlIGFjdGl2YXRpb24uXG4gKlxuICogKk5vdGU6IFRvIHJldmVydCBiYWNrIHRvIG9sZCBbYCRhbmNob3JTY3JvbGxgXShodHRwOi8vZG9jcy5hbmd1bGFyanMub3JnL2FwaS9uZy4kYW5jaG9yU2Nyb2xsKVxuICogZnVuY3Rpb25hbGl0eSwgY2FsbCBgJHVpVmlld1Njcm9sbFByb3ZpZGVyLnVzZUFuY2hvclNjcm9sbCgpYC4qXG4gKlxuICogQHBhcmFtIHtzdHJpbmc9fSBvbmxvYWQgRXhwcmVzc2lvbiB0byBldmFsdWF0ZSB3aGVuZXZlciB0aGUgdmlldyB1cGRhdGVzLlxuICogXG4gKiBAZXhhbXBsZVxuICogQSB2aWV3IGNhbiBiZSB1bm5hbWVkIG9yIG5hbWVkLiBcbiAqIDxwcmU+XG4gKiA8IS0tIFVubmFtZWQgLS0+XG4gKiA8ZGl2IHVpLXZpZXc+PC9kaXY+IFxuICogXG4gKiA8IS0tIE5hbWVkIC0tPlxuICogPGRpdiB1aS12aWV3PVwidmlld05hbWVcIj48L2Rpdj5cbiAqIDwvcHJlPlxuICpcbiAqIFlvdSBjYW4gb25seSBoYXZlIG9uZSB1bm5hbWVkIHZpZXcgd2l0aGluIGFueSB0ZW1wbGF0ZSAob3Igcm9vdCBodG1sKS4gSWYgeW91IGFyZSBvbmx5IHVzaW5nIGEgXG4gKiBzaW5nbGUgdmlldyBhbmQgaXQgaXMgdW5uYW1lZCB0aGVuIHlvdSBjYW4gcG9wdWxhdGUgaXQgbGlrZSBzbzpcbiAqIDxwcmU+XG4gKiA8ZGl2IHVpLXZpZXc+PC9kaXY+IFxuICogJHN0YXRlUHJvdmlkZXIuc3RhdGUoXCJob21lXCIsIHtcbiAqICAgdGVtcGxhdGU6IFwiPGgxPkhFTExPITwvaDE+XCJcbiAqIH0pXG4gKiA8L3ByZT5cbiAqIFxuICogVGhlIGFib3ZlIGlzIGEgY29udmVuaWVudCBzaG9ydGN1dCBlcXVpdmFsZW50IHRvIHNwZWNpZnlpbmcgeW91ciB2aWV3IGV4cGxpY2l0bHkgd2l0aCB0aGUge0BsaW5rIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVQcm92aWRlciN2aWV3cyBgdmlld3NgfVxuICogY29uZmlnIHByb3BlcnR5LCBieSBuYW1lLCBpbiB0aGlzIGNhc2UgYW4gZW1wdHkgbmFtZTpcbiAqIDxwcmU+XG4gKiAkc3RhdGVQcm92aWRlci5zdGF0ZShcImhvbWVcIiwge1xuICogICB2aWV3czoge1xuICogICAgIFwiXCI6IHtcbiAqICAgICAgIHRlbXBsYXRlOiBcIjxoMT5IRUxMTyE8L2gxPlwiXG4gKiAgICAgfVxuICogICB9ICAgIFxuICogfSlcbiAqIDwvcHJlPlxuICogXG4gKiBCdXQgdHlwaWNhbGx5IHlvdSdsbCBvbmx5IHVzZSB0aGUgdmlld3MgcHJvcGVydHkgaWYgeW91IG5hbWUgeW91ciB2aWV3IG9yIGhhdmUgbW9yZSB0aGFuIG9uZSB2aWV3IFxuICogaW4gdGhlIHNhbWUgdGVtcGxhdGUuIFRoZXJlJ3Mgbm90IHJlYWxseSBhIGNvbXBlbGxpbmcgcmVhc29uIHRvIG5hbWUgYSB2aWV3IGlmIGl0cyB0aGUgb25seSBvbmUsIFxuICogYnV0IHlvdSBjb3VsZCBpZiB5b3Ugd2FudGVkLCBsaWtlIHNvOlxuICogPHByZT5cbiAqIDxkaXYgdWktdmlldz1cIm1haW5cIj48L2Rpdj5cbiAqIDwvcHJlPiBcbiAqIDxwcmU+XG4gKiAkc3RhdGVQcm92aWRlci5zdGF0ZShcImhvbWVcIiwge1xuICogICB2aWV3czoge1xuICogICAgIFwibWFpblwiOiB7XG4gKiAgICAgICB0ZW1wbGF0ZTogXCI8aDE+SEVMTE8hPC9oMT5cIlxuICogICAgIH1cbiAqICAgfSAgICBcbiAqIH0pXG4gKiA8L3ByZT5cbiAqIFxuICogUmVhbGx5IHRob3VnaCwgeW91J2xsIHVzZSB2aWV3cyB0byBzZXQgdXAgbXVsdGlwbGUgdmlld3M6XG4gKiA8cHJlPlxuICogPGRpdiB1aS12aWV3PjwvZGl2PlxuICogPGRpdiB1aS12aWV3PVwiY2hhcnRcIj48L2Rpdj4gXG4gKiA8ZGl2IHVpLXZpZXc9XCJkYXRhXCI+PC9kaXY+IFxuICogPC9wcmU+XG4gKiBcbiAqIDxwcmU+XG4gKiAkc3RhdGVQcm92aWRlci5zdGF0ZShcImhvbWVcIiwge1xuICogICB2aWV3czoge1xuICogICAgIFwiXCI6IHtcbiAqICAgICAgIHRlbXBsYXRlOiBcIjxoMT5IRUxMTyE8L2gxPlwiXG4gKiAgICAgfSxcbiAqICAgICBcImNoYXJ0XCI6IHtcbiAqICAgICAgIHRlbXBsYXRlOiBcIjxjaGFydF90aGluZy8+XCJcbiAqICAgICB9LFxuICogICAgIFwiZGF0YVwiOiB7XG4gKiAgICAgICB0ZW1wbGF0ZTogXCI8ZGF0YV90aGluZy8+XCJcbiAqICAgICB9XG4gKiAgIH0gICAgXG4gKiB9KVxuICogPC9wcmU+XG4gKlxuICogRXhhbXBsZXMgZm9yIGBhdXRvc2Nyb2xsYDpcbiAqXG4gKiA8cHJlPlxuICogPCEtLSBJZiBhdXRvc2Nyb2xsIHByZXNlbnQgd2l0aCBubyBleHByZXNzaW9uLFxuICogICAgICB0aGVuIHNjcm9sbCB1aS12aWV3IGludG8gdmlldyAtLT5cbiAqIDx1aS12aWV3IGF1dG9zY3JvbGwvPlxuICpcbiAqIDwhLS0gSWYgYXV0b3Njcm9sbCBwcmVzZW50IHdpdGggdmFsaWQgZXhwcmVzc2lvbixcbiAqICAgICAgdGhlbiBzY3JvbGwgdWktdmlldyBpbnRvIHZpZXcgaWYgZXhwcmVzc2lvbiBldmFsdWF0ZXMgdG8gdHJ1ZSAtLT5cbiAqIDx1aS12aWV3IGF1dG9zY3JvbGw9J3RydWUnLz5cbiAqIDx1aS12aWV3IGF1dG9zY3JvbGw9J2ZhbHNlJy8+XG4gKiA8dWktdmlldyBhdXRvc2Nyb2xsPSdzY29wZVZhcmlhYmxlJy8+XG4gKiA8L3ByZT5cbiAqL1xuJFZpZXdEaXJlY3RpdmUuJGluamVjdCA9IFsnJHN0YXRlJywgJyRpbmplY3RvcicsICckdWlWaWV3U2Nyb2xsJ107XG5mdW5jdGlvbiAkVmlld0RpcmVjdGl2ZSggICAkc3RhdGUsICAgJGluamVjdG9yLCAgICR1aVZpZXdTY3JvbGwpIHtcblxuICBmdW5jdGlvbiBnZXRTZXJ2aWNlKCkge1xuICAgIHJldHVybiAoJGluamVjdG9yLmhhcykgPyBmdW5jdGlvbihzZXJ2aWNlKSB7XG4gICAgICByZXR1cm4gJGluamVjdG9yLmhhcyhzZXJ2aWNlKSA/ICRpbmplY3Rvci5nZXQoc2VydmljZSkgOiBudWxsO1xuICAgIH0gOiBmdW5jdGlvbihzZXJ2aWNlKSB7XG4gICAgICB0cnkge1xuICAgICAgICByZXR1cm4gJGluamVjdG9yLmdldChzZXJ2aWNlKTtcbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICB9XG4gICAgfTtcbiAgfVxuXG4gIHZhciBzZXJ2aWNlID0gZ2V0U2VydmljZSgpLFxuICAgICAgJGFuaW1hdG9yID0gc2VydmljZSgnJGFuaW1hdG9yJyksXG4gICAgICAkYW5pbWF0ZSA9IHNlcnZpY2UoJyRhbmltYXRlJyk7XG5cbiAgLy8gUmV0dXJucyBhIHNldCBvZiBET00gbWFuaXB1bGF0aW9uIGZ1bmN0aW9ucyBiYXNlZCBvbiB3aGljaCBBbmd1bGFyIHZlcnNpb25cbiAgLy8gaXQgc2hvdWxkIHVzZVxuICBmdW5jdGlvbiBnZXRSZW5kZXJlcihhdHRycywgc2NvcGUpIHtcbiAgICB2YXIgc3RhdGljcyA9IGZ1bmN0aW9uKCkge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZW50ZXI6IGZ1bmN0aW9uIChlbGVtZW50LCB0YXJnZXQsIGNiKSB7IHRhcmdldC5hZnRlcihlbGVtZW50KTsgY2IoKTsgfSxcbiAgICAgICAgbGVhdmU6IGZ1bmN0aW9uIChlbGVtZW50LCBjYikgeyBlbGVtZW50LnJlbW92ZSgpOyBjYigpOyB9XG4gICAgICB9O1xuICAgIH07XG5cbiAgICBpZiAoJGFuaW1hdGUpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVudGVyOiBmdW5jdGlvbihlbGVtZW50LCB0YXJnZXQsIGNiKSB7ICRhbmltYXRlLmVudGVyKGVsZW1lbnQsIG51bGwsIHRhcmdldCwgY2IpOyB9LFxuICAgICAgICBsZWF2ZTogZnVuY3Rpb24oZWxlbWVudCwgY2IpIHsgJGFuaW1hdGUubGVhdmUoZWxlbWVudCwgY2IpOyB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIGlmICgkYW5pbWF0b3IpIHtcbiAgICAgIHZhciBhbmltYXRlID0gJGFuaW1hdG9yICYmICRhbmltYXRvcihzY29wZSwgYXR0cnMpO1xuXG4gICAgICByZXR1cm4ge1xuICAgICAgICBlbnRlcjogZnVuY3Rpb24oZWxlbWVudCwgdGFyZ2V0LCBjYikge2FuaW1hdGUuZW50ZXIoZWxlbWVudCwgbnVsbCwgdGFyZ2V0KTsgY2IoKTsgfSxcbiAgICAgICAgbGVhdmU6IGZ1bmN0aW9uKGVsZW1lbnQsIGNiKSB7IGFuaW1hdGUubGVhdmUoZWxlbWVudCk7IGNiKCk7IH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXRpY3MoKTtcbiAgfVxuXG4gIHZhciBkaXJlY3RpdmUgPSB7XG4gICAgcmVzdHJpY3Q6ICdFQ0EnLFxuICAgIHRlcm1pbmFsOiB0cnVlLFxuICAgIHByaW9yaXR5OiA0MDAsXG4gICAgdHJhbnNjbHVkZTogJ2VsZW1lbnQnLFxuICAgIGNvbXBpbGU6IGZ1bmN0aW9uICh0RWxlbWVudCwgdEF0dHJzLCAkdHJhbnNjbHVkZSkge1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChzY29wZSwgJGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgIHZhciBwcmV2aW91c0VsLCBjdXJyZW50RWwsIGN1cnJlbnRTY29wZSwgbGF0ZXN0TG9jYWxzLFxuICAgICAgICAgICAgb25sb2FkRXhwICAgICA9IGF0dHJzLm9ubG9hZCB8fCAnJyxcbiAgICAgICAgICAgIGF1dG9TY3JvbGxFeHAgPSBhdHRycy5hdXRvc2Nyb2xsLFxuICAgICAgICAgICAgcmVuZGVyZXIgICAgICA9IGdldFJlbmRlcmVyKGF0dHJzLCBzY29wZSk7XG5cbiAgICAgICAgc2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdXBkYXRlVmlldyhmYWxzZSk7XG4gICAgICAgIH0pO1xuICAgICAgICBzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRpbmcnLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICB1cGRhdGVWaWV3KGZhbHNlKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdXBkYXRlVmlldyh0cnVlKTtcblxuICAgICAgICBmdW5jdGlvbiBjbGVhbnVwTGFzdFZpZXcoKSB7XG4gICAgICAgICAgaWYgKHByZXZpb3VzRWwpIHtcbiAgICAgICAgICAgIHByZXZpb3VzRWwucmVtb3ZlKCk7XG4gICAgICAgICAgICBwcmV2aW91c0VsID0gbnVsbDtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBpZiAoY3VycmVudFNjb3BlKSB7XG4gICAgICAgICAgICBjdXJyZW50U2NvcGUuJGRlc3Ryb3koKTtcbiAgICAgICAgICAgIGN1cnJlbnRTY29wZSA9IG51bGw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGN1cnJlbnRFbCkge1xuICAgICAgICAgICAgcmVuZGVyZXIubGVhdmUoY3VycmVudEVsLCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgcHJldmlvdXNFbCA9IG51bGw7XG4gICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgcHJldmlvdXNFbCA9IGN1cnJlbnRFbDtcbiAgICAgICAgICAgIGN1cnJlbnRFbCA9IG51bGw7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlVmlldyhmaXJzdFRpbWUpIHtcbiAgICAgICAgICB2YXIgbmV3U2NvcGUgICAgICAgID0gc2NvcGUuJG5ldygpLFxuICAgICAgICAgICAgICBuYW1lICAgICAgICAgICAgPSBjdXJyZW50RWwgJiYgY3VycmVudEVsLmRhdGEoJyR1aVZpZXdOYW1lJyksXG4gICAgICAgICAgICAgIHByZXZpb3VzTG9jYWxzICA9IG5hbWUgJiYgJHN0YXRlLiRjdXJyZW50ICYmICRzdGF0ZS4kY3VycmVudC5sb2NhbHNbbmFtZV07XG5cbiAgICAgICAgICBpZiAoIWZpcnN0VGltZSAmJiBwcmV2aW91c0xvY2FscyA9PT0gbGF0ZXN0TG9jYWxzKSByZXR1cm47IC8vIG5vdGhpbmcgdG8gZG9cblxuICAgICAgICAgIHZhciBjbG9uZSA9ICR0cmFuc2NsdWRlKG5ld1Njb3BlLCBmdW5jdGlvbihjbG9uZSkge1xuICAgICAgICAgICAgcmVuZGVyZXIuZW50ZXIoY2xvbmUsICRlbGVtZW50LCBmdW5jdGlvbiBvblVpVmlld0VudGVyKCkge1xuICAgICAgICAgICAgICBpZiAoYW5ndWxhci5pc0RlZmluZWQoYXV0b1Njcm9sbEV4cCkgJiYgIWF1dG9TY3JvbGxFeHAgfHwgc2NvcGUuJGV2YWwoYXV0b1Njcm9sbEV4cCkpIHtcbiAgICAgICAgICAgICAgICAkdWlWaWV3U2Nyb2xsKGNsb25lKTtcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjbGVhbnVwTGFzdFZpZXcoKTtcbiAgICAgICAgICB9KTtcblxuICAgICAgICAgIGxhdGVzdExvY2FscyA9ICRzdGF0ZS4kY3VycmVudC5sb2NhbHNbY2xvbmUuZGF0YSgnJHVpVmlld05hbWUnKV07XG5cbiAgICAgICAgICBjdXJyZW50RWwgPSBjbG9uZTtcbiAgICAgICAgICBjdXJyZW50U2NvcGUgPSBuZXdTY29wZTtcbiAgICAgICAgICAvKipcbiAgICAgICAgICAgKiBAbmdkb2MgZXZlbnRcbiAgICAgICAgICAgKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuZGlyZWN0aXZlOnVpLXZpZXcjJHZpZXdDb250ZW50TG9hZGVkXG4gICAgICAgICAgICogQGV2ZW50T2YgdWkucm91dGVyLnN0YXRlLmRpcmVjdGl2ZTp1aS12aWV3XG4gICAgICAgICAgICogQGV2ZW50VHlwZSBlbWl0cyBvbiB1aS12aWV3IGRpcmVjdGl2ZSBzY29wZVxuICAgICAgICAgICAqIEBkZXNjcmlwdGlvbiAgICAgICAgICAgKlxuICAgICAgICAgICAqIEZpcmVkIG9uY2UgdGhlIHZpZXcgaXMgKipsb2FkZWQqKiwgKmFmdGVyKiB0aGUgRE9NIGlzIHJlbmRlcmVkLlxuICAgICAgICAgICAqXG4gICAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGV2ZW50IEV2ZW50IG9iamVjdC5cbiAgICAgICAgICAgKi9cbiAgICAgICAgICBjdXJyZW50U2NvcGUuJGVtaXQoJyR2aWV3Q29udGVudExvYWRlZCcpO1xuICAgICAgICAgIGN1cnJlbnRTY29wZS4kZXZhbChvbmxvYWRFeHApO1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cbiAgfTtcblxuICByZXR1cm4gZGlyZWN0aXZlO1xufVxuXG4kVmlld0RpcmVjdGl2ZUZpbGwuJGluamVjdCA9IFsnJGNvbXBpbGUnLCAnJGNvbnRyb2xsZXInLCAnJHN0YXRlJ107XG5mdW5jdGlvbiAkVmlld0RpcmVjdGl2ZUZpbGwgKCRjb21waWxlLCAkY29udHJvbGxlciwgJHN0YXRlKSB7XG4gIHJldHVybiB7XG4gICAgcmVzdHJpY3Q6ICdFQ0EnLFxuICAgIHByaW9yaXR5OiAtNDAwLFxuICAgIGNvbXBpbGU6IGZ1bmN0aW9uICh0RWxlbWVudCkge1xuICAgICAgdmFyIGluaXRpYWwgPSB0RWxlbWVudC5odG1sKCk7XG4gICAgICByZXR1cm4gZnVuY3Rpb24gKHNjb3BlLCAkZWxlbWVudCwgYXR0cnMpIHtcbiAgICAgICAgdmFyIG5hbWUgICAgICA9IGF0dHJzLnVpVmlldyB8fCBhdHRycy5uYW1lIHx8ICcnLFxuICAgICAgICAgICAgaW5oZXJpdGVkID0gJGVsZW1lbnQuaW5oZXJpdGVkRGF0YSgnJHVpVmlldycpO1xuXG4gICAgICAgIGlmIChuYW1lLmluZGV4T2YoJ0AnKSA8IDApIHtcbiAgICAgICAgICBuYW1lID0gbmFtZSArICdAJyArIChpbmhlcml0ZWQgPyBpbmhlcml0ZWQuc3RhdGUubmFtZSA6ICcnKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRlbGVtZW50LmRhdGEoJyR1aVZpZXdOYW1lJywgbmFtZSk7XG5cbiAgICAgICAgdmFyIGN1cnJlbnQgPSAkc3RhdGUuJGN1cnJlbnQsXG4gICAgICAgICAgICBsb2NhbHMgID0gY3VycmVudCAmJiBjdXJyZW50LmxvY2Fsc1tuYW1lXTtcblxuICAgICAgICBpZiAoISBsb2NhbHMpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAkZWxlbWVudC5kYXRhKCckdWlWaWV3JywgeyBuYW1lOiBuYW1lLCBzdGF0ZTogbG9jYWxzLiQkc3RhdGUgfSk7XG4gICAgICAgICRlbGVtZW50Lmh0bWwobG9jYWxzLiR0ZW1wbGF0ZSA/IGxvY2Fscy4kdGVtcGxhdGUgOiBpbml0aWFsKTtcblxuICAgICAgICB2YXIgbGluayA9ICRjb21waWxlKCRlbGVtZW50LmNvbnRlbnRzKCkpO1xuXG4gICAgICAgIGlmIChsb2NhbHMuJCRjb250cm9sbGVyKSB7XG4gICAgICAgICAgbG9jYWxzLiRzY29wZSA9IHNjb3BlO1xuICAgICAgICAgIHZhciBjb250cm9sbGVyID0gJGNvbnRyb2xsZXIobG9jYWxzLiQkY29udHJvbGxlciwgbG9jYWxzKTtcbiAgICAgICAgICBpZiAobG9jYWxzLiQkY29udHJvbGxlckFzKSB7XG4gICAgICAgICAgICBzY29wZVtsb2NhbHMuJCRjb250cm9sbGVyQXNdID0gY29udHJvbGxlcjtcbiAgICAgICAgICB9XG4gICAgICAgICAgJGVsZW1lbnQuZGF0YSgnJG5nQ29udHJvbGxlckNvbnRyb2xsZXInLCBjb250cm9sbGVyKTtcbiAgICAgICAgICAkZWxlbWVudC5jaGlsZHJlbigpLmRhdGEoJyRuZ0NvbnRyb2xsZXJDb250cm9sbGVyJywgY29udHJvbGxlcik7XG4gICAgICAgIH1cblxuICAgICAgICBsaW5rKHNjb3BlKTtcbiAgICAgIH07XG4gICAgfVxuICB9O1xufVxuXG5hbmd1bGFyLm1vZHVsZSgndWkucm91dGVyLnN0YXRlJykuZGlyZWN0aXZlKCd1aVZpZXcnLCAkVmlld0RpcmVjdGl2ZSk7XG5hbmd1bGFyLm1vZHVsZSgndWkucm91dGVyLnN0YXRlJykuZGlyZWN0aXZlKCd1aVZpZXcnLCAkVmlld0RpcmVjdGl2ZUZpbGwpO1xuXG5mdW5jdGlvbiBwYXJzZVN0YXRlUmVmKHJlZikge1xuICB2YXIgcGFyc2VkID0gcmVmLnJlcGxhY2UoL1xcbi9nLCBcIiBcIikubWF0Y2goL14oW14oXSs/KVxccyooXFwoKC4qKVxcKSk/JC8pO1xuICBpZiAoIXBhcnNlZCB8fCBwYXJzZWQubGVuZ3RoICE9PSA0KSB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHN0YXRlIHJlZiAnXCIgKyByZWYgKyBcIidcIik7XG4gIHJldHVybiB7IHN0YXRlOiBwYXJzZWRbMV0sIHBhcmFtRXhwcjogcGFyc2VkWzNdIHx8IG51bGwgfTtcbn1cblxuZnVuY3Rpb24gc3RhdGVDb250ZXh0KGVsKSB7XG4gIHZhciBzdGF0ZURhdGEgPSBlbC5wYXJlbnQoKS5pbmhlcml0ZWREYXRhKCckdWlWaWV3Jyk7XG5cbiAgaWYgKHN0YXRlRGF0YSAmJiBzdGF0ZURhdGEuc3RhdGUgJiYgc3RhdGVEYXRhLnN0YXRlLm5hbWUpIHtcbiAgICByZXR1cm4gc3RhdGVEYXRhLnN0YXRlO1xuICB9XG59XG5cbi8qKlxuICogQG5nZG9jIGRpcmVjdGl2ZVxuICogQG5hbWUgdWkucm91dGVyLnN0YXRlLmRpcmVjdGl2ZTp1aS1zcmVmXG4gKlxuICogQHJlcXVpcmVzIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVcbiAqIEByZXF1aXJlcyAkdGltZW91dFxuICpcbiAqIEByZXN0cmljdCBBXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBIGRpcmVjdGl2ZSB0aGF0IGJpbmRzIGEgbGluayAoYDxhPmAgdGFnKSB0byBhIHN0YXRlLiBJZiB0aGUgc3RhdGUgaGFzIGFuIGFzc29jaWF0ZWQgXG4gKiBVUkwsIHRoZSBkaXJlY3RpdmUgd2lsbCBhdXRvbWF0aWNhbGx5IGdlbmVyYXRlICYgdXBkYXRlIHRoZSBgaHJlZmAgYXR0cmlidXRlIHZpYSBcbiAqIHRoZSB7QGxpbmsgdWkucm91dGVyLnN0YXRlLiRzdGF0ZSNtZXRob2RzX2hyZWYgJHN0YXRlLmhyZWYoKX0gbWV0aG9kLiBDbGlja2luZyBcbiAqIHRoZSBsaW5rIHdpbGwgdHJpZ2dlciBhIHN0YXRlIHRyYW5zaXRpb24gd2l0aCBvcHRpb25hbCBwYXJhbWV0ZXJzLiBcbiAqXG4gKiBBbHNvIG1pZGRsZS1jbGlja2luZywgcmlnaHQtY2xpY2tpbmcsIGFuZCBjdHJsLWNsaWNraW5nIG9uIHRoZSBsaW5rIHdpbGwgYmUgXG4gKiBoYW5kbGVkIG5hdGl2ZWx5IGJ5IHRoZSBicm93c2VyLlxuICpcbiAqIFlvdSBjYW4gYWxzbyB1c2UgcmVsYXRpdmUgc3RhdGUgcGF0aHMgd2l0aGluIHVpLXNyZWYsIGp1c3QgbGlrZSB0aGUgcmVsYXRpdmUgXG4gKiBwYXRocyBwYXNzZWQgdG8gYCRzdGF0ZS5nbygpYC4gWW91IGp1c3QgbmVlZCB0byBiZSBhd2FyZSB0aGF0IHRoZSBwYXRoIGlzIHJlbGF0aXZlXG4gKiB0byB0aGUgc3RhdGUgdGhhdCB0aGUgbGluayBsaXZlcyBpbiwgaW4gb3RoZXIgd29yZHMgdGhlIHN0YXRlIHRoYXQgbG9hZGVkIHRoZSBcbiAqIHRlbXBsYXRlIGNvbnRhaW5pbmcgdGhlIGxpbmsuXG4gKlxuICogWW91IGNhbiBzcGVjaWZ5IG9wdGlvbnMgdG8gcGFzcyB0byB7QGxpbmsgdWkucm91dGVyLnN0YXRlLiRzdGF0ZSNnbyAkc3RhdGUuZ28oKX1cbiAqIHVzaW5nIHRoZSBgdWktc3JlZi1vcHRzYCBhdHRyaWJ1dGUuIE9wdGlvbnMgYXJlIHJlc3RyaWN0ZWQgdG8gYGxvY2F0aW9uYCwgYGluaGVyaXRgLFxuICogYW5kIGByZWxvYWRgLlxuICpcbiAqIEBleGFtcGxlXG4gKiBIZXJlJ3MgYW4gZXhhbXBsZSBvZiBob3cgeW91J2QgdXNlIHVpLXNyZWYgYW5kIGhvdyBpdCB3b3VsZCBjb21waWxlLiBJZiB5b3UgaGF2ZSB0aGUgXG4gKiBmb2xsb3dpbmcgdGVtcGxhdGU6XG4gKiA8cHJlPlxuICogPGEgdWktc3JlZj1cImhvbWVcIj5Ib21lPC9hPiB8IDxhIHVpLXNyZWY9XCJhYm91dFwiPkFib3V0PC9hPlxuICogXG4gKiA8dWw+XG4gKiAgICAgPGxpIG5nLXJlcGVhdD1cImNvbnRhY3QgaW4gY29udGFjdHNcIj5cbiAqICAgICAgICAgPGEgdWktc3JlZj1cImNvbnRhY3RzLmRldGFpbCh7IGlkOiBjb250YWN0LmlkIH0pXCI+e3sgY29udGFjdC5uYW1lIH19PC9hPlxuICogICAgIDwvbGk+XG4gKiA8L3VsPlxuICogPC9wcmU+XG4gKiBcbiAqIFRoZW4gdGhlIGNvbXBpbGVkIGh0bWwgd291bGQgYmUgKGFzc3VtaW5nIEh0bWw1TW9kZSBpcyBvZmYpOlxuICogPHByZT5cbiAqIDxhIGhyZWY9XCIjL2hvbWVcIiB1aS1zcmVmPVwiaG9tZVwiPkhvbWU8L2E+IHwgPGEgaHJlZj1cIiMvYWJvdXRcIiB1aS1zcmVmPVwiYWJvdXRcIj5BYm91dDwvYT5cbiAqIFxuICogPHVsPlxuICogICAgIDxsaSBuZy1yZXBlYXQ9XCJjb250YWN0IGluIGNvbnRhY3RzXCI+XG4gKiAgICAgICAgIDxhIGhyZWY9XCIjL2NvbnRhY3RzLzFcIiB1aS1zcmVmPVwiY29udGFjdHMuZGV0YWlsKHsgaWQ6IGNvbnRhY3QuaWQgfSlcIj5Kb2U8L2E+XG4gKiAgICAgPC9saT5cbiAqICAgICA8bGkgbmctcmVwZWF0PVwiY29udGFjdCBpbiBjb250YWN0c1wiPlxuICogICAgICAgICA8YSBocmVmPVwiIy9jb250YWN0cy8yXCIgdWktc3JlZj1cImNvbnRhY3RzLmRldGFpbCh7IGlkOiBjb250YWN0LmlkIH0pXCI+QWxpY2U8L2E+XG4gKiAgICAgPC9saT5cbiAqICAgICA8bGkgbmctcmVwZWF0PVwiY29udGFjdCBpbiBjb250YWN0c1wiPlxuICogICAgICAgICA8YSBocmVmPVwiIy9jb250YWN0cy8zXCIgdWktc3JlZj1cImNvbnRhY3RzLmRldGFpbCh7IGlkOiBjb250YWN0LmlkIH0pXCI+Qm9iPC9hPlxuICogICAgIDwvbGk+XG4gKiA8L3VsPlxuICpcbiAqIDxhIHVpLXNyZWY9XCJob21lXCIgdWktc3JlZi1vcHRzPVwie3JlbG9hZDogdHJ1ZX1cIj5Ib21lPC9hPlxuICogPC9wcmU+XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHVpLXNyZWYgJ3N0YXRlTmFtZScgY2FuIGJlIGFueSB2YWxpZCBhYnNvbHV0ZSBvciByZWxhdGl2ZSBzdGF0ZVxuICogQHBhcmFtIHtPYmplY3R9IHVpLXNyZWYtb3B0cyBvcHRpb25zIHRvIHBhc3MgdG8ge0BsaW5rIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGUjZ28gJHN0YXRlLmdvKCl9XG4gKi9cbiRTdGF0ZVJlZkRpcmVjdGl2ZS4kaW5qZWN0ID0gWyckc3RhdGUnLCAnJHRpbWVvdXQnXTtcbmZ1bmN0aW9uICRTdGF0ZVJlZkRpcmVjdGl2ZSgkc3RhdGUsICR0aW1lb3V0KSB7XG4gIHZhciBhbGxvd2VkT3B0aW9ucyA9IFsnbG9jYXRpb24nLCAnaW5oZXJpdCcsICdyZWxvYWQnXTtcblxuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnQScsXG4gICAgcmVxdWlyZTogJz9edWlTcmVmQWN0aXZlJyxcbiAgICBsaW5rOiBmdW5jdGlvbihzY29wZSwgZWxlbWVudCwgYXR0cnMsIHVpU3JlZkFjdGl2ZSkge1xuICAgICAgdmFyIHJlZiA9IHBhcnNlU3RhdGVSZWYoYXR0cnMudWlTcmVmKTtcbiAgICAgIHZhciBwYXJhbXMgPSBudWxsLCB1cmwgPSBudWxsLCBiYXNlID0gc3RhdGVDb250ZXh0KGVsZW1lbnQpIHx8ICRzdGF0ZS4kY3VycmVudDtcbiAgICAgIHZhciBpc0Zvcm0gPSBlbGVtZW50WzBdLm5vZGVOYW1lID09PSBcIkZPUk1cIjtcbiAgICAgIHZhciBhdHRyID0gaXNGb3JtID8gXCJhY3Rpb25cIiA6IFwiaHJlZlwiLCBuYXYgPSB0cnVlO1xuXG4gICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgcmVsYXRpdmU6IGJhc2VcbiAgICAgIH07XG4gICAgICB2YXIgb3B0aW9uc092ZXJyaWRlID0gc2NvcGUuJGV2YWwoYXR0cnMudWlTcmVmT3B0cykgfHwge307XG4gICAgICBhbmd1bGFyLmZvckVhY2goYWxsb3dlZE9wdGlvbnMsIGZ1bmN0aW9uKG9wdGlvbikge1xuICAgICAgICBpZiAob3B0aW9uIGluIG9wdGlvbnNPdmVycmlkZSkge1xuICAgICAgICAgIG9wdGlvbnNbb3B0aW9uXSA9IG9wdGlvbnNPdmVycmlkZVtvcHRpb25dO1xuICAgICAgICB9XG4gICAgICB9KTtcblxuICAgICAgdmFyIHVwZGF0ZSA9IGZ1bmN0aW9uKG5ld1ZhbCkge1xuICAgICAgICBpZiAobmV3VmFsKSBwYXJhbXMgPSBuZXdWYWw7XG4gICAgICAgIGlmICghbmF2KSByZXR1cm47XG5cbiAgICAgICAgdmFyIG5ld0hyZWYgPSAkc3RhdGUuaHJlZihyZWYuc3RhdGUsIHBhcmFtcywgb3B0aW9ucyk7XG5cbiAgICAgICAgaWYgKHVpU3JlZkFjdGl2ZSkge1xuICAgICAgICAgIHVpU3JlZkFjdGl2ZS4kJHNldFN0YXRlSW5mbyhyZWYuc3RhdGUsIHBhcmFtcyk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFuZXdIcmVmKSB7XG4gICAgICAgICAgbmF2ID0gZmFsc2U7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsZW1lbnRbMF1bYXR0cl0gPSBuZXdIcmVmO1xuICAgICAgfTtcblxuICAgICAgaWYgKHJlZi5wYXJhbUV4cHIpIHtcbiAgICAgICAgc2NvcGUuJHdhdGNoKHJlZi5wYXJhbUV4cHIsIGZ1bmN0aW9uKG5ld1ZhbCwgb2xkVmFsKSB7XG4gICAgICAgICAgaWYgKG5ld1ZhbCAhPT0gcGFyYW1zKSB1cGRhdGUobmV3VmFsKTtcbiAgICAgICAgfSwgdHJ1ZSk7XG4gICAgICAgIHBhcmFtcyA9IHNjb3BlLiRldmFsKHJlZi5wYXJhbUV4cHIpO1xuICAgICAgfVxuICAgICAgdXBkYXRlKCk7XG5cbiAgICAgIGlmIChpc0Zvcm0pIHJldHVybjtcblxuICAgICAgZWxlbWVudC5iaW5kKFwiY2xpY2tcIiwgZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgYnV0dG9uID0gZS53aGljaCB8fCBlLmJ1dHRvbjtcbiAgICAgICAgaWYgKCAhKGJ1dHRvbiA+IDEgfHwgZS5jdHJsS2V5IHx8IGUubWV0YUtleSB8fCBlLnNoaWZ0S2V5IHx8IGVsZW1lbnQuYXR0cigndGFyZ2V0JykpICkge1xuICAgICAgICAgIC8vIEhBQ0s6IFRoaXMgaXMgdG8gYWxsb3cgbmctY2xpY2tzIHRvIGJlIHByb2Nlc3NlZCBiZWZvcmUgdGhlIHRyYW5zaXRpb24gaXMgaW5pdGlhdGVkOlxuICAgICAgICAgICR0aW1lb3V0KGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHN0YXRlLmdvKHJlZi5zdGF0ZSwgcGFyYW1zLCBvcHRpb25zKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbn1cblxuLyoqXG4gKiBAbmdkb2MgZGlyZWN0aXZlXG4gKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuZGlyZWN0aXZlOnVpLXNyZWYtYWN0aXZlXG4gKlxuICogQHJlcXVpcmVzIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVcbiAqIEByZXF1aXJlcyB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlUGFyYW1zXG4gKiBAcmVxdWlyZXMgJGludGVycG9sYXRlXG4gKlxuICogQHJlc3RyaWN0IEFcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIEEgZGlyZWN0aXZlIHdvcmtpbmcgYWxvbmdzaWRlIHVpLXNyZWYgdG8gYWRkIGNsYXNzZXMgdG8gYW4gZWxlbWVudCB3aGVuIHRoZSBcbiAqIHJlbGF0ZWQgdWktc3JlZiBkaXJlY3RpdmUncyBzdGF0ZSBpcyBhY3RpdmUsIGFuZCByZW1vdmluZyB0aGVtIHdoZW4gaXQgaXMgaW5hY3RpdmUuXG4gKiBUaGUgcHJpbWFyeSB1c2UtY2FzZSBpcyB0byBzaW1wbGlmeSB0aGUgc3BlY2lhbCBhcHBlYXJhbmNlIG9mIG5hdmlnYXRpb24gbWVudXMgXG4gKiByZWx5aW5nIG9uIGB1aS1zcmVmYCwgYnkgaGF2aW5nIHRoZSBcImFjdGl2ZVwiIHN0YXRlJ3MgbWVudSBidXR0b24gYXBwZWFyIGRpZmZlcmVudCxcbiAqIGRpc3Rpbmd1aXNoaW5nIGl0IGZyb20gdGhlIGluYWN0aXZlIG1lbnUgaXRlbXMuXG4gKlxuICogQGV4YW1wbGVcbiAqIEdpdmVuIHRoZSBmb2xsb3dpbmcgdGVtcGxhdGU6XG4gKiA8cHJlPlxuICogPHVsPlxuICogICA8bGkgdWktc3JlZi1hY3RpdmU9XCJhY3RpdmVcIiBjbGFzcz1cIml0ZW1cIj5cbiAqICAgICA8YSBocmVmIHVpLXNyZWY9XCJhcHAudXNlcih7dXNlcjogJ2JpbGJvYmFnZ2lucyd9KVwiPkBiaWxib2JhZ2dpbnM8L2E+XG4gKiAgIDwvbGk+XG4gKiA8L3VsPlxuICogPC9wcmU+XG4gKiBcbiAqIFdoZW4gdGhlIGFwcCBzdGF0ZSBpcyBcImFwcC51c2VyXCIsIGFuZCBjb250YWlucyB0aGUgc3RhdGUgcGFyYW1ldGVyIFwidXNlclwiIHdpdGggdmFsdWUgXCJiaWxib2JhZ2dpbnNcIiwgXG4gKiB0aGUgcmVzdWx0aW5nIEhUTUwgd2lsbCBhcHBlYXIgYXMgKG5vdGUgdGhlICdhY3RpdmUnIGNsYXNzKTpcbiAqIDxwcmU+XG4gKiA8dWw+XG4gKiAgIDxsaSB1aS1zcmVmLWFjdGl2ZT1cImFjdGl2ZVwiIGNsYXNzPVwiaXRlbSBhY3RpdmVcIj5cbiAqICAgICA8YSB1aS1zcmVmPVwiYXBwLnVzZXIoe3VzZXI6ICdiaWxib2JhZ2dpbnMnfSlcIiBocmVmPVwiL3VzZXJzL2JpbGJvYmFnZ2luc1wiPkBiaWxib2JhZ2dpbnM8L2E+XG4gKiAgIDwvbGk+XG4gKiA8L3VsPlxuICogPC9wcmU+XG4gKiBcbiAqIFRoZSBjbGFzcyBuYW1lIGlzIGludGVycG9sYXRlZCAqKm9uY2UqKiBkdXJpbmcgdGhlIGRpcmVjdGl2ZXMgbGluayB0aW1lIChhbnkgZnVydGhlciBjaGFuZ2VzIHRvIHRoZSBcbiAqIGludGVycG9sYXRlZCB2YWx1ZSBhcmUgaWdub3JlZCkuIFxuICogXG4gKiBNdWx0aXBsZSBjbGFzc2VzIG1heSBiZSBzcGVjaWZpZWQgaW4gYSBzcGFjZS1zZXBhcmF0ZWQgZm9ybWF0OlxuICogPHByZT5cbiAqIDx1bD5cbiAqICAgPGxpIHVpLXNyZWYtYWN0aXZlPSdjbGFzczEgY2xhc3MyIGNsYXNzMyc+XG4gKiAgICAgPGEgdWktc3JlZj1cImFwcC51c2VyXCI+bGluazwvYT5cbiAqICAgPC9saT5cbiAqIDwvdWw+XG4gKiA8L3ByZT5cbiAqL1xuJFN0YXRlQWN0aXZlRGlyZWN0aXZlLiRpbmplY3QgPSBbJyRzdGF0ZScsICckc3RhdGVQYXJhbXMnLCAnJGludGVycG9sYXRlJ107XG5mdW5jdGlvbiAkU3RhdGVBY3RpdmVEaXJlY3RpdmUoJHN0YXRlLCAkc3RhdGVQYXJhbXMsICRpbnRlcnBvbGF0ZSkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiBcIkFcIixcbiAgICBjb250cm9sbGVyOiBbJyRzY29wZScsICckZWxlbWVudCcsICckYXR0cnMnLCBmdW5jdGlvbigkc2NvcGUsICRlbGVtZW50LCAkYXR0cnMpIHtcbiAgICAgIHZhciBzdGF0ZSwgcGFyYW1zLCBhY3RpdmVDbGFzcztcblxuICAgICAgLy8gVGhlcmUgcHJvYmFibHkgaXNuJ3QgbXVjaCBwb2ludCBpbiAkb2JzZXJ2aW5nIHRoaXNcbiAgICAgIGFjdGl2ZUNsYXNzID0gJGludGVycG9sYXRlKCRhdHRycy51aVNyZWZBY3RpdmUgfHwgJycsIGZhbHNlKSgkc2NvcGUpO1xuXG4gICAgICAvLyBBbGxvdyB1aVNyZWYgdG8gY29tbXVuaWNhdGUgd2l0aCB1aVNyZWZBY3RpdmVcbiAgICAgIHRoaXMuJCRzZXRTdGF0ZUluZm8gPSBmdW5jdGlvbihuZXdTdGF0ZSwgbmV3UGFyYW1zKSB7XG4gICAgICAgIHN0YXRlID0gJHN0YXRlLmdldChuZXdTdGF0ZSwgc3RhdGVDb250ZXh0KCRlbGVtZW50KSk7XG4gICAgICAgIHBhcmFtcyA9IG5ld1BhcmFtcztcbiAgICAgICAgdXBkYXRlKCk7XG4gICAgICB9O1xuXG4gICAgICAkc2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdWNjZXNzJywgdXBkYXRlKTtcblxuICAgICAgLy8gVXBkYXRlIHJvdXRlIHN0YXRlXG4gICAgICBmdW5jdGlvbiB1cGRhdGUoKSB7XG4gICAgICAgIGlmICgkc3RhdGUuJGN1cnJlbnQuc2VsZiA9PT0gc3RhdGUgJiYgbWF0Y2hlc1BhcmFtcygpKSB7XG4gICAgICAgICAgJGVsZW1lbnQuYWRkQ2xhc3MoYWN0aXZlQ2xhc3MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICRlbGVtZW50LnJlbW92ZUNsYXNzKGFjdGl2ZUNsYXNzKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBtYXRjaGVzUGFyYW1zKCkge1xuICAgICAgICByZXR1cm4gIXBhcmFtcyB8fCBlcXVhbEZvcktleXMocGFyYW1zLCAkc3RhdGVQYXJhbXMpO1xuICAgICAgfVxuICAgIH1dXG4gIH07XG59XG5cbmFuZ3VsYXIubW9kdWxlKCd1aS5yb3V0ZXIuc3RhdGUnKVxuICAuZGlyZWN0aXZlKCd1aVNyZWYnLCAkU3RhdGVSZWZEaXJlY3RpdmUpXG4gIC5kaXJlY3RpdmUoJ3VpU3JlZkFjdGl2ZScsICRTdGF0ZUFjdGl2ZURpcmVjdGl2ZSk7XG5cbi8qKlxuICogQG5nZG9jIGZpbHRlclxuICogQG5hbWUgdWkucm91dGVyLnN0YXRlLmZpbHRlcjppc1N0YXRlXG4gKlxuICogQHJlcXVpcmVzIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFRyYW5zbGF0ZXMgdG8ge0BsaW5rIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGUjbWV0aG9kc19pcyAkc3RhdGUuaXMoXCJzdGF0ZU5hbWVcIil9LlxuICovXG4kSXNTdGF0ZUZpbHRlci4kaW5qZWN0ID0gWyckc3RhdGUnXTtcbmZ1bmN0aW9uICRJc1N0YXRlRmlsdGVyKCRzdGF0ZSkge1xuICByZXR1cm4gZnVuY3Rpb24oc3RhdGUpIHtcbiAgICByZXR1cm4gJHN0YXRlLmlzKHN0YXRlKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBAbmdkb2MgZmlsdGVyXG4gKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuZmlsdGVyOmluY2x1ZGVkQnlTdGF0ZVxuICpcbiAqIEByZXF1aXJlcyB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBUcmFuc2xhdGVzIHRvIHtAbGluayB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlI21ldGhvZHNfaW5jbHVkZXMgJHN0YXRlLmluY2x1ZGVzKCdmdWxsT3JQYXJ0aWFsU3RhdGVOYW1lJyl9LlxuICovXG4kSW5jbHVkZWRCeVN0YXRlRmlsdGVyLiRpbmplY3QgPSBbJyRzdGF0ZSddO1xuZnVuY3Rpb24gJEluY2x1ZGVkQnlTdGF0ZUZpbHRlcigkc3RhdGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgcmV0dXJuICRzdGF0ZS5pbmNsdWRlcyhzdGF0ZSk7XG4gIH07XG59XG5cbmFuZ3VsYXIubW9kdWxlKCd1aS5yb3V0ZXIuc3RhdGUnKVxuICAuZmlsdGVyKCdpc1N0YXRlJywgJElzU3RhdGVGaWx0ZXIpXG4gIC5maWx0ZXIoJ2luY2x1ZGVkQnlTdGF0ZScsICRJbmNsdWRlZEJ5U3RhdGVGaWx0ZXIpO1xuXG4vKlxuICogQG5nZG9jIG9iamVjdFxuICogQG5hbWUgdWkucm91dGVyLmNvbXBhdC4kcm91dGVQcm92aWRlclxuICpcbiAqIEByZXF1aXJlcyB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlUHJvdmlkZXJcbiAqIEByZXF1aXJlcyB1aS5yb3V0ZXIucm91dGVyLiR1cmxSb3V0ZXJQcm92aWRlclxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogYCRyb3V0ZVByb3ZpZGVyYCBvZiB0aGUgYHVpLnJvdXRlci5jb21wYXRgIG1vZHVsZSBvdmVyd3JpdGVzIHRoZSBleGlzdGluZ1xuICogYHJvdXRlUHJvdmlkZXJgIGZyb20gdGhlIGNvcmUuIFRoaXMgaXMgZG9uZSB0byBwcm92aWRlIGNvbXBhdGliaWxpdHkgYmV0d2VlblxuICogdGhlIFVJIFJvdXRlciBhbmQgdGhlIGNvcmUgcm91dGVyLlxuICpcbiAqIEl0IGFsc28gcHJvdmlkZXMgYSBgd2hlbigpYCBtZXRob2QgdG8gcmVnaXN0ZXIgcm91dGVzIHRoYXQgbWFwIHRvIGNlcnRhaW4gdXJscy5cbiAqIEJlaGluZCB0aGUgc2NlbmVzIGl0IGFjdHVhbGx5IGRlbGVnYXRlcyBlaXRoZXIgdG8gXG4gKiB7QGxpbmsgdWkucm91dGVyLnJvdXRlci4kdXJsUm91dGVyUHJvdmlkZXIgJHVybFJvdXRlclByb3ZpZGVyfSBvciB0byB0aGUgXG4gKiB7QGxpbmsgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVByb3ZpZGVyICRzdGF0ZVByb3ZpZGVyfSB0byBwb3N0cHJvY2VzcyB0aGUgZ2l2ZW4gXG4gKiByb3V0ZXIgZGVmaW5pdGlvbiBvYmplY3QuXG4gKi9cbiRSb3V0ZVByb3ZpZGVyLiRpbmplY3QgPSBbJyRzdGF0ZVByb3ZpZGVyJywgJyR1cmxSb3V0ZXJQcm92aWRlciddO1xuZnVuY3Rpb24gJFJvdXRlUHJvdmlkZXIoICAkc3RhdGVQcm92aWRlciwgICAgJHVybFJvdXRlclByb3ZpZGVyKSB7XG5cbiAgdmFyIHJvdXRlcyA9IFtdO1xuXG4gIG9uRW50ZXJSb3V0ZS4kaW5qZWN0ID0gWyckJHN0YXRlJ107XG4gIGZ1bmN0aW9uIG9uRW50ZXJSb3V0ZSggICAkJHN0YXRlKSB7XG4gICAgLypqc2hpbnQgdmFsaWR0aGlzOiB0cnVlICovXG4gICAgdGhpcy5sb2NhbHMgPSAkJHN0YXRlLmxvY2Fscy5nbG9iYWxzO1xuICAgIHRoaXMucGFyYW1zID0gdGhpcy5sb2NhbHMuJHN0YXRlUGFyYW1zO1xuICB9XG5cbiAgZnVuY3Rpb24gb25FeGl0Um91dGUoKSB7XG4gICAgLypqc2hpbnQgdmFsaWR0aGlzOiB0cnVlICovXG4gICAgdGhpcy5sb2NhbHMgPSBudWxsO1xuICAgIHRoaXMucGFyYW1zID0gbnVsbDtcbiAgfVxuXG4gIHRoaXMud2hlbiA9IHdoZW47XG4gIC8qXG4gICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgKiBAbmFtZSB1aS5yb3V0ZXIuY29tcGF0LiRyb3V0ZVByb3ZpZGVyI3doZW5cbiAgICogQG1ldGhvZE9mIHVpLnJvdXRlci5jb21wYXQuJHJvdXRlUHJvdmlkZXJcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIFJlZ2lzdGVycyBhIHJvdXRlIHdpdGggYSBnaXZlbiByb3V0ZSBkZWZpbml0aW9uIG9iamVjdC4gVGhlIHJvdXRlIGRlZmluaXRpb25cbiAgICogb2JqZWN0IGhhcyB0aGUgc2FtZSBpbnRlcmZhY2UgdGhlIGFuZ3VsYXIgY29yZSByb3V0ZSBkZWZpbml0aW9uIG9iamVjdCBoYXMuXG4gICAqIFxuICAgKiBAZXhhbXBsZVxuICAgKiA8cHJlPlxuICAgKiB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsndWkucm91dGVyLmNvbXBhdCddKTtcbiAgICpcbiAgICogYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHJvdXRlUHJvdmlkZXIpIHtcbiAgICogICAkcm91dGVQcm92aWRlci53aGVuKCdob21lJywge1xuICAgKiAgICAgY29udHJvbGxlcjogZnVuY3Rpb24gKCkgeyAuLi4gfSxcbiAgICogICAgIHRlbXBsYXRlVXJsOiAncGF0aC90by90ZW1wbGF0ZSdcbiAgICogICB9KTtcbiAgICogfSk7XG4gICAqIDwvcHJlPlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ30gdXJsIFVSTCBhcyBzdHJpbmdcbiAgICogQHBhcmFtIHtvYmplY3R9IHJvdXRlIFJvdXRlIGRlZmluaXRpb24gb2JqZWN0XG4gICAqXG4gICAqIEByZXR1cm4ge29iamVjdH0gJHJvdXRlUHJvdmlkZXIgLSAkcm91dGVQcm92aWRlciBpbnN0YW5jZVxuICAgKi9cbiAgZnVuY3Rpb24gd2hlbih1cmwsIHJvdXRlKSB7XG4gICAgLypqc2hpbnQgdmFsaWR0aGlzOiB0cnVlICovXG4gICAgaWYgKHJvdXRlLnJlZGlyZWN0VG8gIT0gbnVsbCkge1xuICAgICAgLy8gUmVkaXJlY3QsIGNvbmZpZ3VyZSBkaXJlY3RseSBvbiAkdXJsUm91dGVyUHJvdmlkZXJcbiAgICAgIHZhciByZWRpcmVjdCA9IHJvdXRlLnJlZGlyZWN0VG8sIGhhbmRsZXI7XG4gICAgICBpZiAoaXNTdHJpbmcocmVkaXJlY3QpKSB7XG4gICAgICAgIGhhbmRsZXIgPSByZWRpcmVjdDsgLy8gbGVhdmUgJHVybFJvdXRlclByb3ZpZGVyIHRvIGhhbmRsZVxuICAgICAgfSBlbHNlIGlmIChpc0Z1bmN0aW9uKHJlZGlyZWN0KSkge1xuICAgICAgICAvLyBBZGFwdCB0byAkdXJsUm91dGVyUHJvdmlkZXIgQVBJXG4gICAgICAgIGhhbmRsZXIgPSBmdW5jdGlvbiAocGFyYW1zLCAkbG9jYXRpb24pIHtcbiAgICAgICAgICByZXR1cm4gcmVkaXJlY3QocGFyYW1zLCAkbG9jYXRpb24ucGF0aCgpLCAkbG9jYXRpb24uc2VhcmNoKCkpO1xuICAgICAgICB9O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCAncmVkaXJlY3RUbycgaW4gd2hlbigpXCIpO1xuICAgICAgfVxuICAgICAgJHVybFJvdXRlclByb3ZpZGVyLndoZW4odXJsLCBoYW5kbGVyKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gUmVndWxhciByb3V0ZSwgY29uZmlndXJlIGFzIHN0YXRlXG4gICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZShpbmhlcml0KHJvdXRlLCB7XG4gICAgICAgIHBhcmVudDogbnVsbCxcbiAgICAgICAgbmFtZTogJ3JvdXRlOicgKyBlbmNvZGVVUklDb21wb25lbnQodXJsKSxcbiAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgIG9uRW50ZXI6IG9uRW50ZXJSb3V0ZSxcbiAgICAgICAgb25FeGl0OiBvbkV4aXRSb3V0ZVxuICAgICAgfSkpO1xuICAgIH1cbiAgICByb3V0ZXMucHVzaChyb3V0ZSk7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKlxuICAgKiBAbmdkb2Mgb2JqZWN0XG4gICAqIEBuYW1lIHVpLnJvdXRlci5jb21wYXQuJHJvdXRlXG4gICAqXG4gICAqIEByZXF1aXJlcyB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlXG4gICAqIEByZXF1aXJlcyAkcm9vdFNjb3BlXG4gICAqIEByZXF1aXJlcyAkcm91dGVQYXJhbXNcbiAgICpcbiAgICogQHByb3BlcnR5IHtvYmplY3R9IHJvdXRlcyAtIEFycmF5IG9mIHJlZ2lzdGVyZWQgcm91dGVzLlxuICAgKiBAcHJvcGVydHkge29iamVjdH0gcGFyYW1zIC0gQ3VycmVudCByb3V0ZSBwYXJhbXMgYXMgb2JqZWN0LlxuICAgKiBAcHJvcGVydHkge3N0cmluZ30gY3VycmVudCAtIE5hbWUgb2YgdGhlIGN1cnJlbnQgcm91dGUuXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBUaGUgYCRyb3V0ZWAgc2VydmljZSBwcm92aWRlcyBpbnRlcmZhY2VzIHRvIGFjY2VzcyBkZWZpbmVkIHJvdXRlcy4gSXQgYWxzbyBsZXQnc1xuICAgKiB5b3UgYWNjZXNzIHJvdXRlIHBhcmFtcyB0aHJvdWdoIGAkcm91dGVQYXJhbXNgIHNlcnZpY2UsIHNvIHlvdSBoYXZlIGZ1bGx5XG4gICAqIGNvbnRyb2wgb3ZlciBhbGwgdGhlIHN0dWZmIHlvdSB3b3VsZCBhY3R1YWxseSBnZXQgZnJvbSBhbmd1bGFyJ3MgY29yZSBgJHJvdXRlYFxuICAgKiBzZXJ2aWNlLlxuICAgKi9cbiAgdGhpcy4kZ2V0ID0gJGdldDtcbiAgJGdldC4kaW5qZWN0ID0gWyckc3RhdGUnLCAnJHJvb3RTY29wZScsICckcm91dGVQYXJhbXMnXTtcbiAgZnVuY3Rpb24gJGdldCggICAkc3RhdGUsICAgJHJvb3RTY29wZSwgICAkcm91dGVQYXJhbXMpIHtcblxuICAgIHZhciAkcm91dGUgPSB7XG4gICAgICByb3V0ZXM6IHJvdXRlcyxcbiAgICAgIHBhcmFtczogJHJvdXRlUGFyYW1zLFxuICAgICAgY3VycmVudDogdW5kZWZpbmVkXG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHN0YXRlQXNSb3V0ZShzdGF0ZSkge1xuICAgICAgcmV0dXJuIChzdGF0ZS5uYW1lICE9PSAnJykgPyBzdGF0ZSA6IHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3RhcnQnLCBmdW5jdGlvbiAoZXYsIHRvLCB0b1BhcmFtcywgZnJvbSwgZnJvbVBhcmFtcykge1xuICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckcm91dGVDaGFuZ2VTdGFydCcsIHN0YXRlQXNSb3V0ZSh0byksIHN0YXRlQXNSb3V0ZShmcm9tKSk7XG4gICAgfSk7XG5cbiAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsIGZ1bmN0aW9uIChldiwgdG8sIHRvUGFyYW1zLCBmcm9tLCBmcm9tUGFyYW1zKSB7XG4gICAgICAkcm91dGUuY3VycmVudCA9IHN0YXRlQXNSb3V0ZSh0byk7XG4gICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJyRyb3V0ZUNoYW5nZVN1Y2Nlc3MnLCBzdGF0ZUFzUm91dGUodG8pLCBzdGF0ZUFzUm91dGUoZnJvbSkpO1xuICAgICAgY29weSh0b1BhcmFtcywgJHJvdXRlLnBhcmFtcyk7XG4gICAgfSk7XG5cbiAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlRXJyb3InLCBmdW5jdGlvbiAoZXYsIHRvLCB0b1BhcmFtcywgZnJvbSwgZnJvbVBhcmFtcywgZXJyb3IpIHtcbiAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnJHJvdXRlQ2hhbmdlRXJyb3InLCBzdGF0ZUFzUm91dGUodG8pLCBzdGF0ZUFzUm91dGUoZnJvbSksIGVycm9yKTtcbiAgICB9KTtcblxuICAgIHJldHVybiAkcm91dGU7XG4gIH1cbn1cblxuYW5ndWxhci5tb2R1bGUoJ3VpLnJvdXRlci5jb21wYXQnKVxuICAucHJvdmlkZXIoJyRyb3V0ZScsICRSb3V0ZVByb3ZpZGVyKVxuICAuZGlyZWN0aXZlKCduZ1ZpZXcnLCAkVmlld0RpcmVjdGl2ZSk7XG59KSh3aW5kb3csIHdpbmRvdy5hbmd1bGFyKTtcbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiREYxdXJ4XCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2FuZ3VsYXItdWktcm91dGVyL3JlbGVhc2UvYW5ndWxhci11aS1yb3V0ZXIuanNcIixcIi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYW5ndWxhci11aS1yb3V0ZXIvcmVsZWFzZVwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnJlcXVpcmUoJy4vbGliL2FuZ3VsYXIubWluLmpzJyk7XG5cbm1vZHVsZS5leHBvcnRzID0gYW5ndWxhcjtcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJERjF1cnhcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYW5ndWxhci9pbmRleC1icm93c2VyaWZ5LmpzXCIsXCIvLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2FuZ3VsYXJcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKlxuIEFuZ3VsYXJKUyB2MS4yLjE4XG4gKGMpIDIwMTAtMjAxNCBHb29nbGUsIEluYy4gaHR0cDovL2FuZ3VsYXJqcy5vcmdcbiBMaWNlbnNlOiBNSVRcbiovXG4oZnVuY3Rpb24oVCxWLHMpeyd1c2Ugc3RyaWN0JztmdW5jdGlvbiB0KGIpe3JldHVybiBmdW5jdGlvbigpe3ZhciBhPWFyZ3VtZW50c1swXSxjLGE9XCJbXCIrKGI/YitcIjpcIjpcIlwiKSthK1wiXSBodHRwOi8vZXJyb3JzLmFuZ3VsYXJqcy5vcmcvMS4yLjE4L1wiKyhiP2IrXCIvXCI6XCJcIikrYTtmb3IoYz0xO2M8YXJndW1lbnRzLmxlbmd0aDtjKyspYT1hKygxPT1jP1wiP1wiOlwiJlwiKStcInBcIisoYy0xKStcIj1cIitlbmNvZGVVUklDb21wb25lbnQoXCJmdW5jdGlvblwiPT10eXBlb2YgYXJndW1lbnRzW2NdP2FyZ3VtZW50c1tjXS50b1N0cmluZygpLnJlcGxhY2UoLyBcXHtbXFxzXFxTXSokLyxcIlwiKTpcInVuZGVmaW5lZFwiPT10eXBlb2YgYXJndW1lbnRzW2NdP1widW5kZWZpbmVkXCI6XCJzdHJpbmdcIiE9dHlwZW9mIGFyZ3VtZW50c1tjXT9KU09OLnN0cmluZ2lmeShhcmd1bWVudHNbY10pOmFyZ3VtZW50c1tjXSk7cmV0dXJuIEVycm9yKGEpfX1mdW5jdGlvbiBkYihiKXtpZihudWxsPT1ifHxFYShiKSlyZXR1cm4hMTtcbnZhciBhPWIubGVuZ3RoO3JldHVybiAxPT09Yi5ub2RlVHlwZSYmYT8hMDpDKGIpfHxPKGIpfHwwPT09YXx8XCJudW1iZXJcIj09PXR5cGVvZiBhJiYwPGEmJmEtMSBpbiBifWZ1bmN0aW9uIHEoYixhLGMpe3ZhciBkO2lmKGIpaWYoUShiKSlmb3IoZCBpbiBiKVwicHJvdG90eXBlXCI9PWR8fChcImxlbmd0aFwiPT1kfHxcIm5hbWVcIj09ZHx8Yi5oYXNPd25Qcm9wZXJ0eSYmIWIuaGFzT3duUHJvcGVydHkoZCkpfHxhLmNhbGwoYyxiW2RdLGQpO2Vsc2UgaWYoYi5mb3JFYWNoJiZiLmZvckVhY2ghPT1xKWIuZm9yRWFjaChhLGMpO2Vsc2UgaWYoZGIoYikpZm9yKGQ9MDtkPGIubGVuZ3RoO2QrKylhLmNhbGwoYyxiW2RdLGQpO2Vsc2UgZm9yKGQgaW4gYiliLmhhc093blByb3BlcnR5KGQpJiZhLmNhbGwoYyxiW2RdLGQpO3JldHVybiBifWZ1bmN0aW9uIFdiKGIpe3ZhciBhPVtdLGM7Zm9yKGMgaW4gYiliLmhhc093blByb3BlcnR5KGMpJiZhLnB1c2goYyk7cmV0dXJuIGEuc29ydCgpfWZ1bmN0aW9uIFNjKGIsXG5hLGMpe2Zvcih2YXIgZD1XYihiKSxlPTA7ZTxkLmxlbmd0aDtlKyspYS5jYWxsKGMsYltkW2VdXSxkW2VdKTtyZXR1cm4gZH1mdW5jdGlvbiBYYihiKXtyZXR1cm4gZnVuY3Rpb24oYSxjKXtiKGMsYSl9fWZ1bmN0aW9uIGViKCl7Zm9yKHZhciBiPWphLmxlbmd0aCxhO2I7KXtiLS07YT1qYVtiXS5jaGFyQ29kZUF0KDApO2lmKDU3PT1hKXJldHVybiBqYVtiXT1cIkFcIixqYS5qb2luKFwiXCIpO2lmKDkwPT1hKWphW2JdPVwiMFwiO2Vsc2UgcmV0dXJuIGphW2JdPVN0cmluZy5mcm9tQ2hhckNvZGUoYSsxKSxqYS5qb2luKFwiXCIpfWphLnVuc2hpZnQoXCIwXCIpO3JldHVybiBqYS5qb2luKFwiXCIpfWZ1bmN0aW9uIFliKGIsYSl7YT9iLiQkaGFzaEtleT1hOmRlbGV0ZSBiLiQkaGFzaEtleX1mdW5jdGlvbiBKKGIpe3ZhciBhPWIuJCRoYXNoS2V5O3EoYXJndW1lbnRzLGZ1bmN0aW9uKGEpe2EhPT1iJiZxKGEsZnVuY3Rpb24oYSxjKXtiW2NdPWF9KX0pO1liKGIsYSk7cmV0dXJuIGJ9ZnVuY3Rpb24gWihiKXtyZXR1cm4gcGFyc2VJbnQoYixcbjEwKX1mdW5jdGlvbiBaYihiLGEpe3JldHVybiBKKG5ldyAoSihmdW5jdGlvbigpe30se3Byb3RvdHlwZTpifSkpLGEpfWZ1bmN0aW9uIHkoKXt9ZnVuY3Rpb24gRmEoYil7cmV0dXJuIGJ9ZnVuY3Rpb24gJChiKXtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gYn19ZnVuY3Rpb24gRChiKXtyZXR1cm5cInVuZGVmaW5lZFwiPT09dHlwZW9mIGJ9ZnVuY3Rpb24gQihiKXtyZXR1cm5cInVuZGVmaW5lZFwiIT09dHlwZW9mIGJ9ZnVuY3Rpb24gVShiKXtyZXR1cm4gbnVsbCE9YiYmXCJvYmplY3RcIj09PXR5cGVvZiBifWZ1bmN0aW9uIEMoYil7cmV0dXJuXCJzdHJpbmdcIj09PXR5cGVvZiBifWZ1bmN0aW9uIHliKGIpe3JldHVyblwibnVtYmVyXCI9PT10eXBlb2YgYn1mdW5jdGlvbiBOYShiKXtyZXR1cm5cIltvYmplY3QgRGF0ZV1cIj09PXdhLmNhbGwoYil9ZnVuY3Rpb24gUShiKXtyZXR1cm5cImZ1bmN0aW9uXCI9PT10eXBlb2YgYn1mdW5jdGlvbiBmYihiKXtyZXR1cm5cIltvYmplY3QgUmVnRXhwXVwiPT09d2EuY2FsbChiKX1cbmZ1bmN0aW9uIEVhKGIpe3JldHVybiBiJiZiLmRvY3VtZW50JiZiLmxvY2F0aW9uJiZiLmFsZXJ0JiZiLnNldEludGVydmFsfWZ1bmN0aW9uIFRjKGIpe3JldHVybiEoIWJ8fCEoYi5ub2RlTmFtZXx8Yi5wcm9wJiZiLmF0dHImJmIuZmluZCkpfWZ1bmN0aW9uIFVjKGIsYSxjKXt2YXIgZD1bXTtxKGIsZnVuY3Rpb24oYixnLGYpe2QucHVzaChhLmNhbGwoYyxiLGcsZikpfSk7cmV0dXJuIGR9ZnVuY3Rpb24gT2EoYixhKXtpZihiLmluZGV4T2YpcmV0dXJuIGIuaW5kZXhPZihhKTtmb3IodmFyIGM9MDtjPGIubGVuZ3RoO2MrKylpZihhPT09YltjXSlyZXR1cm4gYztyZXR1cm4tMX1mdW5jdGlvbiBQYShiLGEpe3ZhciBjPU9hKGIsYSk7MDw9YyYmYi5zcGxpY2UoYywxKTtyZXR1cm4gYX1mdW5jdGlvbiBHYShiLGEsYyxkKXtpZihFYShiKXx8YiYmYi4kZXZhbEFzeW5jJiZiLiR3YXRjaCl0aHJvdyBRYShcImNwd3NcIik7aWYoYSl7aWYoYj09PWEpdGhyb3cgUWEoXCJjcGlcIik7Yz1jfHxbXTtcbmQ9ZHx8W107aWYoVShiKSl7dmFyIGU9T2EoYyxiKTtpZigtMSE9PWUpcmV0dXJuIGRbZV07Yy5wdXNoKGIpO2QucHVzaChhKX1pZihPKGIpKWZvcih2YXIgZz1hLmxlbmd0aD0wO2c8Yi5sZW5ndGg7ZysrKWU9R2EoYltnXSxudWxsLGMsZCksVShiW2ddKSYmKGMucHVzaChiW2ddKSxkLnB1c2goZSkpLGEucHVzaChlKTtlbHNle3ZhciBmPWEuJCRoYXNoS2V5O3EoYSxmdW5jdGlvbihiLGMpe2RlbGV0ZSBhW2NdfSk7Zm9yKGcgaW4gYillPUdhKGJbZ10sbnVsbCxjLGQpLFUoYltnXSkmJihjLnB1c2goYltnXSksZC5wdXNoKGUpKSxhW2ddPWU7WWIoYSxmKX19ZWxzZShhPWIpJiYoTyhiKT9hPUdhKGIsW10sYyxkKTpOYShiKT9hPW5ldyBEYXRlKGIuZ2V0VGltZSgpKTpmYihiKT9hPVJlZ0V4cChiLnNvdXJjZSk6VShiKSYmKGE9R2EoYix7fSxjLGQpKSk7cmV0dXJuIGF9ZnVuY3Rpb24ga2EoYixhKXtpZihPKGIpKXthPWF8fFtdO2Zvcih2YXIgYz0wO2M8Yi5sZW5ndGg7YysrKWFbY109XG5iW2NdfWVsc2UgaWYoVShiKSlmb3IoYyBpbiBhPWF8fHt9LGIpIXpiLmNhbGwoYixjKXx8XCIkXCI9PT1jLmNoYXJBdCgwKSYmXCIkXCI9PT1jLmNoYXJBdCgxKXx8KGFbY109YltjXSk7cmV0dXJuIGF8fGJ9ZnVuY3Rpb24geGEoYixhKXtpZihiPT09YSlyZXR1cm4hMDtpZihudWxsPT09Ynx8bnVsbD09PWEpcmV0dXJuITE7aWYoYiE9PWImJmEhPT1hKXJldHVybiEwO3ZhciBjPXR5cGVvZiBiLGQ7aWYoYz09dHlwZW9mIGEmJlwib2JqZWN0XCI9PWMpaWYoTyhiKSl7aWYoIU8oYSkpcmV0dXJuITE7aWYoKGM9Yi5sZW5ndGgpPT1hLmxlbmd0aCl7Zm9yKGQ9MDtkPGM7ZCsrKWlmKCF4YShiW2RdLGFbZF0pKXJldHVybiExO3JldHVybiEwfX1lbHNle2lmKE5hKGIpKXJldHVybiBOYShhKSYmYi5nZXRUaW1lKCk9PWEuZ2V0VGltZSgpO2lmKGZiKGIpJiZmYihhKSlyZXR1cm4gYi50b1N0cmluZygpPT1hLnRvU3RyaW5nKCk7aWYoYiYmYi4kZXZhbEFzeW5jJiZiLiR3YXRjaHx8YSYmYS4kZXZhbEFzeW5jJiZcbmEuJHdhdGNofHxFYShiKXx8RWEoYSl8fE8oYSkpcmV0dXJuITE7Yz17fTtmb3IoZCBpbiBiKWlmKFwiJFwiIT09ZC5jaGFyQXQoMCkmJiFRKGJbZF0pKXtpZigheGEoYltkXSxhW2RdKSlyZXR1cm4hMTtjW2RdPSEwfWZvcihkIGluIGEpaWYoIWMuaGFzT3duUHJvcGVydHkoZCkmJlwiJFwiIT09ZC5jaGFyQXQoMCkmJmFbZF0hPT1zJiYhUShhW2RdKSlyZXR1cm4hMTtyZXR1cm4hMH1yZXR1cm4hMX1mdW5jdGlvbiAkYigpe3JldHVybiBWLnNlY3VyaXR5UG9saWN5JiZWLnNlY3VyaXR5UG9saWN5LmlzQWN0aXZlfHxWLnF1ZXJ5U2VsZWN0b3ImJiEoIVYucXVlcnlTZWxlY3RvcihcIltuZy1jc3BdXCIpJiYhVi5xdWVyeVNlbGVjdG9yKFwiW2RhdGEtbmctY3NwXVwiKSl9ZnVuY3Rpb24gQWIoYixhKXt2YXIgYz0yPGFyZ3VtZW50cy5sZW5ndGg/eWEuY2FsbChhcmd1bWVudHMsMik6W107cmV0dXJuIVEoYSl8fGEgaW5zdGFuY2VvZiBSZWdFeHA/YTpjLmxlbmd0aD9mdW5jdGlvbigpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoP1xuYS5hcHBseShiLGMuY29uY2F0KHlhLmNhbGwoYXJndW1lbnRzLDApKSk6YS5hcHBseShiLGMpfTpmdW5jdGlvbigpe3JldHVybiBhcmd1bWVudHMubGVuZ3RoP2EuYXBwbHkoYixhcmd1bWVudHMpOmEuY2FsbChiKX19ZnVuY3Rpb24gVmMoYixhKXt2YXIgYz1hO1wic3RyaW5nXCI9PT10eXBlb2YgYiYmXCIkXCI9PT1iLmNoYXJBdCgwKT9jPXM6RWEoYSk/Yz1cIiRXSU5ET1dcIjphJiZWPT09YT9jPVwiJERPQ1VNRU5UXCI6YSYmKGEuJGV2YWxBc3luYyYmYS4kd2F0Y2gpJiYoYz1cIiRTQ09QRVwiKTtyZXR1cm4gY31mdW5jdGlvbiByYShiLGEpe3JldHVyblwidW5kZWZpbmVkXCI9PT10eXBlb2YgYj9zOkpTT04uc3RyaW5naWZ5KGIsVmMsYT9cIiAgXCI6bnVsbCl9ZnVuY3Rpb24gYWMoYil7cmV0dXJuIEMoYik/SlNPTi5wYXJzZShiKTpifWZ1bmN0aW9uIFJhKGIpe1wiZnVuY3Rpb25cIj09PXR5cGVvZiBiP2I9ITA6YiYmMCE9PWIubGVuZ3RoPyhiPUwoXCJcIitiKSxiPSEoXCJmXCI9PWJ8fFwiMFwiPT1ifHxcImZhbHNlXCI9PVxuYnx8XCJub1wiPT1ifHxcIm5cIj09Ynx8XCJbXVwiPT1iKSk6Yj0hMTtyZXR1cm4gYn1mdW5jdGlvbiBnYShiKXtiPXcoYikuY2xvbmUoKTt0cnl7Yi5lbXB0eSgpfWNhdGNoKGEpe312YXIgYz13KFwiPGRpdj5cIikuYXBwZW5kKGIpLmh0bWwoKTt0cnl7cmV0dXJuIDM9PT1iWzBdLm5vZGVUeXBlP0woYyk6Yy5tYXRjaCgvXig8W14+XSs+KS8pWzFdLnJlcGxhY2UoL148KFtcXHdcXC1dKykvLGZ1bmN0aW9uKGEsYil7cmV0dXJuXCI8XCIrTChiKX0pfWNhdGNoKGQpe3JldHVybiBMKGMpfX1mdW5jdGlvbiBiYyhiKXt0cnl7cmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChiKX1jYXRjaChhKXt9fWZ1bmN0aW9uIGNjKGIpe3ZhciBhPXt9LGMsZDtxKChifHxcIlwiKS5zcGxpdChcIiZcIiksZnVuY3Rpb24oYil7YiYmKGM9Yi5zcGxpdChcIj1cIiksZD1iYyhjWzBdKSxCKGQpJiYoYj1CKGNbMV0pP2JjKGNbMV0pOiEwLGFbZF0/TyhhW2RdKT9hW2RdLnB1c2goYik6YVtkXT1bYVtkXSxiXTphW2RdPWIpKX0pO3JldHVybiBhfVxuZnVuY3Rpb24gQmIoYil7dmFyIGE9W107cShiLGZ1bmN0aW9uKGIsZCl7TyhiKT9xKGIsZnVuY3Rpb24oYil7YS5wdXNoKHphKGQsITApKyghMD09PWI/XCJcIjpcIj1cIit6YShiLCEwKSkpfSk6YS5wdXNoKHphKGQsITApKyghMD09PWI/XCJcIjpcIj1cIit6YShiLCEwKSkpfSk7cmV0dXJuIGEubGVuZ3RoP2Euam9pbihcIiZcIik6XCJcIn1mdW5jdGlvbiBnYihiKXtyZXR1cm4gemEoYiwhMCkucmVwbGFjZSgvJTI2L2dpLFwiJlwiKS5yZXBsYWNlKC8lM0QvZ2ksXCI9XCIpLnJlcGxhY2UoLyUyQi9naSxcIitcIil9ZnVuY3Rpb24gemEoYixhKXtyZXR1cm4gZW5jb2RlVVJJQ29tcG9uZW50KGIpLnJlcGxhY2UoLyU0MC9naSxcIkBcIikucmVwbGFjZSgvJTNBL2dpLFwiOlwiKS5yZXBsYWNlKC8lMjQvZyxcIiRcIikucmVwbGFjZSgvJTJDL2dpLFwiLFwiKS5yZXBsYWNlKC8lMjAvZyxhP1wiJTIwXCI6XCIrXCIpfWZ1bmN0aW9uIFdjKGIsYSl7ZnVuY3Rpb24gYyhhKXthJiZkLnB1c2goYSl9dmFyIGQ9W2JdLGUsZyxmPVtcIm5nOmFwcFwiLFxuXCJuZy1hcHBcIixcIngtbmctYXBwXCIsXCJkYXRhLW5nLWFwcFwiXSxrPS9cXHNuZ1s6XFwtXWFwcCg6XFxzKihbXFx3XFxkX10rKTs/KT9cXHMvO3EoZixmdW5jdGlvbihhKXtmW2FdPSEwO2MoVi5nZXRFbGVtZW50QnlJZChhKSk7YT1hLnJlcGxhY2UoXCI6XCIsXCJcXFxcOlwiKTtiLnF1ZXJ5U2VsZWN0b3JBbGwmJihxKGIucXVlcnlTZWxlY3RvckFsbChcIi5cIithKSxjKSxxKGIucXVlcnlTZWxlY3RvckFsbChcIi5cIithK1wiXFxcXDpcIiksYykscShiLnF1ZXJ5U2VsZWN0b3JBbGwoXCJbXCIrYStcIl1cIiksYykpfSk7cShkLGZ1bmN0aW9uKGEpe2lmKCFlKXt2YXIgYj1rLmV4ZWMoXCIgXCIrYS5jbGFzc05hbWUrXCIgXCIpO2I/KGU9YSxnPShiWzJdfHxcIlwiKS5yZXBsYWNlKC9cXHMrL2csXCIsXCIpKTpxKGEuYXR0cmlidXRlcyxmdW5jdGlvbihiKXshZSYmZltiLm5hbWVdJiYoZT1hLGc9Yi52YWx1ZSl9KX19KTtlJiZhKGUsZz9bZ106W10pfWZ1bmN0aW9uIGRjKGIsYSl7dmFyIGM9ZnVuY3Rpb24oKXtiPXcoYik7aWYoYi5pbmplY3RvcigpKXt2YXIgYz1cbmJbMF09PT1WP1wiZG9jdW1lbnRcIjpnYShiKTt0aHJvdyBRYShcImJ0c3RycGRcIixjKTt9YT1hfHxbXTthLnVuc2hpZnQoW1wiJHByb3ZpZGVcIixmdW5jdGlvbihhKXthLnZhbHVlKFwiJHJvb3RFbGVtZW50XCIsYil9XSk7YS51bnNoaWZ0KFwibmdcIik7Yz1lYyhhKTtjLmludm9rZShbXCIkcm9vdFNjb3BlXCIsXCIkcm9vdEVsZW1lbnRcIixcIiRjb21waWxlXCIsXCIkaW5qZWN0b3JcIixcIiRhbmltYXRlXCIsZnVuY3Rpb24oYSxiLGMsZCxlKXthLiRhcHBseShmdW5jdGlvbigpe2IuZGF0YShcIiRpbmplY3RvclwiLGQpO2MoYikoYSl9KX1dKTtyZXR1cm4gY30sZD0vXk5HX0RFRkVSX0JPT1RTVFJBUCEvO2lmKFQmJiFkLnRlc3QoVC5uYW1lKSlyZXR1cm4gYygpO1QubmFtZT1ULm5hbWUucmVwbGFjZShkLFwiXCIpO1NhLnJlc3VtZUJvb3RzdHJhcD1mdW5jdGlvbihiKXtxKGIsZnVuY3Rpb24oYil7YS5wdXNoKGIpfSk7YygpfX1mdW5jdGlvbiBoYihiLGEpe2E9YXx8XCJfXCI7cmV0dXJuIGIucmVwbGFjZShYYyxmdW5jdGlvbihiLFxuZCl7cmV0dXJuKGQ/YTpcIlwiKStiLnRvTG93ZXJDYXNlKCl9KX1mdW5jdGlvbiBDYihiLGEsYyl7aWYoIWIpdGhyb3cgUWEoXCJhcmVxXCIsYXx8XCI/XCIsY3x8XCJyZXF1aXJlZFwiKTtyZXR1cm4gYn1mdW5jdGlvbiBUYShiLGEsYyl7YyYmTyhiKSYmKGI9YltiLmxlbmd0aC0xXSk7Q2IoUShiKSxhLFwibm90IGEgZnVuY3Rpb24sIGdvdCBcIisoYiYmXCJvYmplY3RcIj09dHlwZW9mIGI/Yi5jb25zdHJ1Y3Rvci5uYW1lfHxcIk9iamVjdFwiOnR5cGVvZiBiKSk7cmV0dXJuIGJ9ZnVuY3Rpb24gQWEoYixhKXtpZihcImhhc093blByb3BlcnR5XCI9PT1iKXRocm93IFFhKFwiYmFkbmFtZVwiLGEpO31mdW5jdGlvbiBmYyhiLGEsYyl7aWYoIWEpcmV0dXJuIGI7YT1hLnNwbGl0KFwiLlwiKTtmb3IodmFyIGQsZT1iLGc9YS5sZW5ndGgsZj0wO2Y8ZztmKyspZD1hW2ZdLGImJihiPShlPWIpW2RdKTtyZXR1cm4hYyYmUShiKT9BYihlLGIpOmJ9ZnVuY3Rpb24gRGIoYil7dmFyIGE9YlswXTtiPWJbYi5sZW5ndGgtMV07aWYoYT09PVxuYilyZXR1cm4gdyhhKTt2YXIgYz1bYV07ZG97YT1hLm5leHRTaWJsaW5nO2lmKCFhKWJyZWFrO2MucHVzaChhKX13aGlsZShhIT09Yik7cmV0dXJuIHcoYyl9ZnVuY3Rpb24gWWMoYil7dmFyIGE9dChcIiRpbmplY3RvclwiKSxjPXQoXCJuZ1wiKTtiPWIuYW5ndWxhcnx8KGIuYW5ndWxhcj17fSk7Yi4kJG1pbkVycj1iLiQkbWluRXJyfHx0O3JldHVybiBiLm1vZHVsZXx8KGIubW9kdWxlPWZ1bmN0aW9uKCl7dmFyIGI9e307cmV0dXJuIGZ1bmN0aW9uKGUsZyxmKXtpZihcImhhc093blByb3BlcnR5XCI9PT1lKXRocm93IGMoXCJiYWRuYW1lXCIsXCJtb2R1bGVcIik7ZyYmYi5oYXNPd25Qcm9wZXJ0eShlKSYmKGJbZV09bnVsbCk7cmV0dXJuIGJbZV18fChiW2VdPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gYihhLGQsZSl7cmV0dXJuIGZ1bmN0aW9uKCl7Y1tlfHxcInB1c2hcIl0oW2EsZCxhcmd1bWVudHNdKTtyZXR1cm4gbn19aWYoIWcpdGhyb3cgYShcIm5vbW9kXCIsZSk7dmFyIGM9W10sZD1bXSxsPWIoXCIkaW5qZWN0b3JcIixcblwiaW52b2tlXCIpLG49e19pbnZva2VRdWV1ZTpjLF9ydW5CbG9ja3M6ZCxyZXF1aXJlczpnLG5hbWU6ZSxwcm92aWRlcjpiKFwiJHByb3ZpZGVcIixcInByb3ZpZGVyXCIpLGZhY3Rvcnk6YihcIiRwcm92aWRlXCIsXCJmYWN0b3J5XCIpLHNlcnZpY2U6YihcIiRwcm92aWRlXCIsXCJzZXJ2aWNlXCIpLHZhbHVlOmIoXCIkcHJvdmlkZVwiLFwidmFsdWVcIiksY29uc3RhbnQ6YihcIiRwcm92aWRlXCIsXCJjb25zdGFudFwiLFwidW5zaGlmdFwiKSxhbmltYXRpb246YihcIiRhbmltYXRlUHJvdmlkZXJcIixcInJlZ2lzdGVyXCIpLGZpbHRlcjpiKFwiJGZpbHRlclByb3ZpZGVyXCIsXCJyZWdpc3RlclwiKSxjb250cm9sbGVyOmIoXCIkY29udHJvbGxlclByb3ZpZGVyXCIsXCJyZWdpc3RlclwiKSxkaXJlY3RpdmU6YihcIiRjb21waWxlUHJvdmlkZXJcIixcImRpcmVjdGl2ZVwiKSxjb25maWc6bCxydW46ZnVuY3Rpb24oYSl7ZC5wdXNoKGEpO3JldHVybiB0aGlzfX07ZiYmbChmKTtyZXR1cm4gbn0oKSl9fSgpKX1mdW5jdGlvbiBaYyhiKXtKKGIse2Jvb3RzdHJhcDpkYyxcbmNvcHk6R2EsZXh0ZW5kOkosZXF1YWxzOnhhLGVsZW1lbnQ6dyxmb3JFYWNoOnEsaW5qZWN0b3I6ZWMsbm9vcDp5LGJpbmQ6QWIsdG9Kc29uOnJhLGZyb21Kc29uOmFjLGlkZW50aXR5OkZhLGlzVW5kZWZpbmVkOkQsaXNEZWZpbmVkOkIsaXNTdHJpbmc6Qyxpc0Z1bmN0aW9uOlEsaXNPYmplY3Q6VSxpc051bWJlcjp5Yixpc0VsZW1lbnQ6VGMsaXNBcnJheTpPLHZlcnNpb246JGMsaXNEYXRlOk5hLGxvd2VyY2FzZTpMLHVwcGVyY2FzZTpIYSxjYWxsYmFja3M6e2NvdW50ZXI6MH0sJCRtaW5FcnI6dCwkJGNzcDokYn0pO1VhPVljKFQpO3RyeXtVYShcIm5nTG9jYWxlXCIpfWNhdGNoKGEpe1VhKFwibmdMb2NhbGVcIixbXSkucHJvdmlkZXIoXCIkbG9jYWxlXCIsYWQpfVVhKFwibmdcIixbXCJuZ0xvY2FsZVwiXSxbXCIkcHJvdmlkZVwiLGZ1bmN0aW9uKGEpe2EucHJvdmlkZXIoeyQkc2FuaXRpemVVcmk6YmR9KTthLnByb3ZpZGVyKFwiJGNvbXBpbGVcIixnYykuZGlyZWN0aXZlKHthOmNkLGlucHV0OmhjLHRleHRhcmVhOmhjLFxuZm9ybTpkZCxzY3JpcHQ6ZWQsc2VsZWN0OmZkLHN0eWxlOmdkLG9wdGlvbjpoZCxuZ0JpbmQ6aWQsbmdCaW5kSHRtbDpqZCxuZ0JpbmRUZW1wbGF0ZTprZCxuZ0NsYXNzOmxkLG5nQ2xhc3NFdmVuOm1kLG5nQ2xhc3NPZGQ6bmQsbmdDbG9hazpvZCxuZ0NvbnRyb2xsZXI6cGQsbmdGb3JtOnFkLG5nSGlkZTpyZCxuZ0lmOnNkLG5nSW5jbHVkZTp0ZCxuZ0luaXQ6dWQsbmdOb25CaW5kYWJsZTp2ZCxuZ1BsdXJhbGl6ZTp3ZCxuZ1JlcGVhdDp4ZCxuZ1Nob3c6eWQsbmdTdHlsZTp6ZCxuZ1N3aXRjaDpBZCxuZ1N3aXRjaFdoZW46QmQsbmdTd2l0Y2hEZWZhdWx0OkNkLG5nT3B0aW9uczpEZCxuZ1RyYW5zY2x1ZGU6RWQsbmdNb2RlbDpGZCxuZ0xpc3Q6R2QsbmdDaGFuZ2U6SGQscmVxdWlyZWQ6aWMsbmdSZXF1aXJlZDppYyxuZ1ZhbHVlOklkfSkuZGlyZWN0aXZlKHtuZ0luY2x1ZGU6SmR9KS5kaXJlY3RpdmUoRWIpLmRpcmVjdGl2ZShqYyk7YS5wcm92aWRlcih7JGFuY2hvclNjcm9sbDpLZCxcbiRhbmltYXRlOkxkLCRicm93c2VyOk1kLCRjYWNoZUZhY3Rvcnk6TmQsJGNvbnRyb2xsZXI6T2QsJGRvY3VtZW50OlBkLCRleGNlcHRpb25IYW5kbGVyOlFkLCRmaWx0ZXI6a2MsJGludGVycG9sYXRlOlJkLCRpbnRlcnZhbDpTZCwkaHR0cDpUZCwkaHR0cEJhY2tlbmQ6VWQsJGxvY2F0aW9uOlZkLCRsb2c6V2QsJHBhcnNlOlhkLCRyb290U2NvcGU6WWQsJHE6WmQsJHNjZTokZCwkc2NlRGVsZWdhdGU6YWUsJHNuaWZmZXI6YmUsJHRlbXBsYXRlQ2FjaGU6Y2UsJHRpbWVvdXQ6ZGUsJHdpbmRvdzplZSwkJHJBRjpmZSwkJGFzeW5jQ2FsbGJhY2s6Z2V9KX1dKX1mdW5jdGlvbiBWYShiKXtyZXR1cm4gYi5yZXBsYWNlKGhlLGZ1bmN0aW9uKGEsYixkLGUpe3JldHVybiBlP2QudG9VcHBlckNhc2UoKTpkfSkucmVwbGFjZShpZSxcIk1veiQxXCIpfWZ1bmN0aW9uIEZiKGIsYSxjLGQpe2Z1bmN0aW9uIGUoYil7dmFyIGU9YyYmYj9bdGhpcy5maWx0ZXIoYildOlt0aGlzXSxtPWEsaCxsLG4scCxyLFxudjtpZighZHx8bnVsbCE9Yilmb3IoO2UubGVuZ3RoOylmb3IoaD1lLnNoaWZ0KCksbD0wLG49aC5sZW5ndGg7bDxuO2wrKylmb3IocD13KGhbbF0pLG0/cC50cmlnZ2VySGFuZGxlcihcIiRkZXN0cm95XCIpOm09IW0scj0wLHA9KHY9cC5jaGlsZHJlbigpKS5sZW5ndGg7cjxwO3IrKyllLnB1c2goQmEodltyXSkpO3JldHVybiBnLmFwcGx5KHRoaXMsYXJndW1lbnRzKX12YXIgZz1CYS5mbltiXSxnPWcuJG9yaWdpbmFsfHxnO2UuJG9yaWdpbmFsPWc7QmEuZm5bYl09ZX1mdW5jdGlvbiBSKGIpe2lmKGIgaW5zdGFuY2VvZiBSKXJldHVybiBiO0MoYikmJihiPWFhKGIpKTtpZighKHRoaXMgaW5zdGFuY2VvZiBSKSl7aWYoQyhiKSYmXCI8XCIhPWIuY2hhckF0KDApKXRocm93IEdiKFwibm9zZWxcIik7cmV0dXJuIG5ldyBSKGIpfWlmKEMoYikpe3ZhciBhPWI7Yj1WO3ZhciBjO2lmKGM9amUuZXhlYyhhKSliPVtiLmNyZWF0ZUVsZW1lbnQoY1sxXSldO2Vsc2V7dmFyIGQ9YixlO2I9ZC5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7XG5jPVtdO2lmKEhiLnRlc3QoYSkpe2Q9Yi5hcHBlbmRDaGlsZChkLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIikpO2U9KGtlLmV4ZWMoYSl8fFtcIlwiLFwiXCJdKVsxXS50b0xvd2VyQ2FzZSgpO2U9ZGFbZV18fGRhLl9kZWZhdWx0O2QuaW5uZXJIVE1MPVwiPGRpdj4mIzE2MDs8L2Rpdj5cIitlWzFdK2EucmVwbGFjZShsZSxcIjwkMT48LyQyPlwiKStlWzJdO2QucmVtb3ZlQ2hpbGQoZC5maXJzdENoaWxkKTtmb3IoYT1lWzBdO2EtLTspZD1kLmxhc3RDaGlsZDthPTA7Zm9yKGU9ZC5jaGlsZE5vZGVzLmxlbmd0aDthPGU7KythKWMucHVzaChkLmNoaWxkTm9kZXNbYV0pO2Q9Yi5maXJzdENoaWxkO2QudGV4dENvbnRlbnQ9XCJcIn1lbHNlIGMucHVzaChkLmNyZWF0ZVRleHROb2RlKGEpKTtiLnRleHRDb250ZW50PVwiXCI7Yi5pbm5lckhUTUw9XCJcIjtiPWN9SWIodGhpcyxiKTt3KFYuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpKS5hcHBlbmQodGhpcyl9ZWxzZSBJYih0aGlzLGIpfWZ1bmN0aW9uIEpiKGIpe3JldHVybiBiLmNsb25lTm9kZSghMCl9XG5mdW5jdGlvbiBJYShiKXtsYyhiKTt2YXIgYT0wO2ZvcihiPWIuY2hpbGROb2Rlc3x8W107YTxiLmxlbmd0aDthKyspSWEoYlthXSl9ZnVuY3Rpb24gbWMoYixhLGMsZCl7aWYoQihkKSl0aHJvdyBHYihcIm9mZmFyZ3NcIik7dmFyIGU9bGEoYixcImV2ZW50c1wiKTtsYShiLFwiaGFuZGxlXCIpJiYoRChhKT9xKGUsZnVuY3Rpb24oYSxjKXtXYShiLGMsYSk7ZGVsZXRlIGVbY119KTpxKGEuc3BsaXQoXCIgXCIpLGZ1bmN0aW9uKGEpe0QoYyk/KFdhKGIsYSxlW2FdKSxkZWxldGUgZVthXSk6UGEoZVthXXx8W10sYyl9KSl9ZnVuY3Rpb24gbGMoYixhKXt2YXIgYz1iW2liXSxkPVhhW2NdO2QmJihhP2RlbGV0ZSBYYVtjXS5kYXRhW2FdOihkLmhhbmRsZSYmKGQuZXZlbnRzLiRkZXN0cm95JiZkLmhhbmRsZSh7fSxcIiRkZXN0cm95XCIpLG1jKGIpKSxkZWxldGUgWGFbY10sYltpYl09cykpfWZ1bmN0aW9uIGxhKGIsYSxjKXt2YXIgZD1iW2liXSxkPVhhW2R8fC0xXTtpZihCKGMpKWR8fChiW2liXT1kPSsrbWUsXG5kPVhhW2RdPXt9KSxkW2FdPWM7ZWxzZSByZXR1cm4gZCYmZFthXX1mdW5jdGlvbiBuYyhiLGEsYyl7dmFyIGQ9bGEoYixcImRhdGFcIiksZT1CKGMpLGc9IWUmJkIoYSksZj1nJiYhVShhKTtkfHxmfHxsYShiLFwiZGF0YVwiLGQ9e30pO2lmKGUpZFthXT1jO2Vsc2UgaWYoZyl7aWYoZilyZXR1cm4gZCYmZFthXTtKKGQsYSl9ZWxzZSByZXR1cm4gZH1mdW5jdGlvbiBLYihiLGEpe3JldHVybiBiLmdldEF0dHJpYnV0ZT8tMTwoXCIgXCIrKGIuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIil8fFwiXCIpK1wiIFwiKS5yZXBsYWNlKC9bXFxuXFx0XS9nLFwiIFwiKS5pbmRleE9mKFwiIFwiK2ErXCIgXCIpOiExfWZ1bmN0aW9uIGpiKGIsYSl7YSYmYi5zZXRBdHRyaWJ1dGUmJnEoYS5zcGxpdChcIiBcIiksZnVuY3Rpb24oYSl7Yi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLGFhKChcIiBcIisoYi5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKXx8XCJcIikrXCIgXCIpLnJlcGxhY2UoL1tcXG5cXHRdL2csXCIgXCIpLnJlcGxhY2UoXCIgXCIrYWEoYSkrXCIgXCIsXCIgXCIpKSl9KX1cbmZ1bmN0aW9uIGtiKGIsYSl7aWYoYSYmYi5zZXRBdHRyaWJ1dGUpe3ZhciBjPShcIiBcIisoYi5nZXRBdHRyaWJ1dGUoXCJjbGFzc1wiKXx8XCJcIikrXCIgXCIpLnJlcGxhY2UoL1tcXG5cXHRdL2csXCIgXCIpO3EoYS5zcGxpdChcIiBcIiksZnVuY3Rpb24oYSl7YT1hYShhKTstMT09PWMuaW5kZXhPZihcIiBcIithK1wiIFwiKSYmKGMrPWErXCIgXCIpfSk7Yi5zZXRBdHRyaWJ1dGUoXCJjbGFzc1wiLGFhKGMpKX19ZnVuY3Rpb24gSWIoYixhKXtpZihhKXthPWEubm9kZU5hbWV8fCFCKGEubGVuZ3RoKXx8RWEoYSk/W2FdOmE7Zm9yKHZhciBjPTA7YzxhLmxlbmd0aDtjKyspYi5wdXNoKGFbY10pfX1mdW5jdGlvbiBvYyhiLGEpe3JldHVybiBsYihiLFwiJFwiKyhhfHxcIm5nQ29udHJvbGxlclwiKStcIkNvbnRyb2xsZXJcIil9ZnVuY3Rpb24gbGIoYixhLGMpe2I9dyhiKTs5PT1iWzBdLm5vZGVUeXBlJiYoYj1iLmZpbmQoXCJodG1sXCIpKTtmb3IoYT1PKGEpP2E6W2FdO2IubGVuZ3RoOyl7Zm9yKHZhciBkPWJbMF0sZT0wLGc9YS5sZW5ndGg7ZTxcbmc7ZSsrKWlmKChjPWIuZGF0YShhW2VdKSkhPT1zKXJldHVybiBjO2I9dyhkLnBhcmVudE5vZGV8fDExPT09ZC5ub2RlVHlwZSYmZC5ob3N0KX19ZnVuY3Rpb24gcGMoYil7Zm9yKHZhciBhPTAsYz1iLmNoaWxkTm9kZXM7YTxjLmxlbmd0aDthKyspSWEoY1thXSk7Zm9yKDtiLmZpcnN0Q2hpbGQ7KWIucmVtb3ZlQ2hpbGQoYi5maXJzdENoaWxkKX1mdW5jdGlvbiBxYyhiLGEpe3ZhciBjPW1iW2EudG9Mb3dlckNhc2UoKV07cmV0dXJuIGMmJnJjW2Iubm9kZU5hbWVdJiZjfWZ1bmN0aW9uIG5lKGIsYSl7dmFyIGM9ZnVuY3Rpb24oYyxlKXtjLnByZXZlbnREZWZhdWx0fHwoYy5wcmV2ZW50RGVmYXVsdD1mdW5jdGlvbigpe2MucmV0dXJuVmFsdWU9ITF9KTtjLnN0b3BQcm9wYWdhdGlvbnx8KGMuc3RvcFByb3BhZ2F0aW9uPWZ1bmN0aW9uKCl7Yy5jYW5jZWxCdWJibGU9ITB9KTtjLnRhcmdldHx8KGMudGFyZ2V0PWMuc3JjRWxlbWVudHx8Vik7aWYoRChjLmRlZmF1bHRQcmV2ZW50ZWQpKXt2YXIgZz1cbmMucHJldmVudERlZmF1bHQ7Yy5wcmV2ZW50RGVmYXVsdD1mdW5jdGlvbigpe2MuZGVmYXVsdFByZXZlbnRlZD0hMDtnLmNhbGwoYyl9O2MuZGVmYXVsdFByZXZlbnRlZD0hMX1jLmlzRGVmYXVsdFByZXZlbnRlZD1mdW5jdGlvbigpe3JldHVybiBjLmRlZmF1bHRQcmV2ZW50ZWR8fCExPT09Yy5yZXR1cm5WYWx1ZX07dmFyIGY9a2EoYVtlfHxjLnR5cGVdfHxbXSk7cShmLGZ1bmN0aW9uKGEpe2EuY2FsbChiLGMpfSk7OD49Uz8oYy5wcmV2ZW50RGVmYXVsdD1udWxsLGMuc3RvcFByb3BhZ2F0aW9uPW51bGwsYy5pc0RlZmF1bHRQcmV2ZW50ZWQ9bnVsbCk6KGRlbGV0ZSBjLnByZXZlbnREZWZhdWx0LGRlbGV0ZSBjLnN0b3BQcm9wYWdhdGlvbixkZWxldGUgYy5pc0RlZmF1bHRQcmV2ZW50ZWQpfTtjLmVsZW09YjtyZXR1cm4gY31mdW5jdGlvbiBKYShiKXt2YXIgYT10eXBlb2YgYixjO1wib2JqZWN0XCI9PWEmJm51bGwhPT1iP1wiZnVuY3Rpb25cIj09dHlwZW9mKGM9Yi4kJGhhc2hLZXkpP2M9XG5iLiQkaGFzaEtleSgpOmM9PT1zJiYoYz1iLiQkaGFzaEtleT1lYigpKTpjPWI7cmV0dXJuIGErXCI6XCIrY31mdW5jdGlvbiBZYShiKXtxKGIsdGhpcy5wdXQsdGhpcyl9ZnVuY3Rpb24gc2MoYil7dmFyIGEsYztcImZ1bmN0aW9uXCI9PXR5cGVvZiBiPyhhPWIuJGluamVjdCl8fChhPVtdLGIubGVuZ3RoJiYoYz1iLnRvU3RyaW5nKCkucmVwbGFjZShvZSxcIlwiKSxjPWMubWF0Y2gocGUpLHEoY1sxXS5zcGxpdChxZSksZnVuY3Rpb24oYil7Yi5yZXBsYWNlKHJlLGZ1bmN0aW9uKGIsYyxkKXthLnB1c2goZCl9KX0pKSxiLiRpbmplY3Q9YSk6TyhiKT8oYz1iLmxlbmd0aC0xLFRhKGJbY10sXCJmblwiKSxhPWIuc2xpY2UoMCxjKSk6VGEoYixcImZuXCIsITApO3JldHVybiBhfWZ1bmN0aW9uIGVjKGIpe2Z1bmN0aW9uIGEoYSl7cmV0dXJuIGZ1bmN0aW9uKGIsYyl7aWYoVShiKSlxKGIsWGIoYSkpO2Vsc2UgcmV0dXJuIGEoYixjKX19ZnVuY3Rpb24gYyhhLGIpe0FhKGEsXCJzZXJ2aWNlXCIpO2lmKFEoYil8fFxuTyhiKSliPW4uaW5zdGFudGlhdGUoYik7aWYoIWIuJGdldCl0aHJvdyBaYShcInBnZXRcIixhKTtyZXR1cm4gbFthK2tdPWJ9ZnVuY3Rpb24gZChhLGIpe3JldHVybiBjKGEseyRnZXQ6Yn0pfWZ1bmN0aW9uIGUoYSl7dmFyIGI9W10sYyxkLGcsaztxKGEsZnVuY3Rpb24oYSl7aWYoIWguZ2V0KGEpKXtoLnB1dChhLCEwKTt0cnl7aWYoQyhhKSlmb3IoYz1VYShhKSxiPWIuY29uY2F0KGUoYy5yZXF1aXJlcykpLmNvbmNhdChjLl9ydW5CbG9ja3MpLGQ9Yy5faW52b2tlUXVldWUsZz0wLGs9ZC5sZW5ndGg7ZzxrO2crKyl7dmFyIGY9ZFtnXSxtPW4uZ2V0KGZbMF0pO21bZlsxXV0uYXBwbHkobSxmWzJdKX1lbHNlIFEoYSk/Yi5wdXNoKG4uaW52b2tlKGEpKTpPKGEpP2IucHVzaChuLmludm9rZShhKSk6VGEoYSxcIm1vZHVsZVwiKX1jYXRjaChsKXt0aHJvdyBPKGEpJiYoYT1hW2EubGVuZ3RoLTFdKSxsLm1lc3NhZ2UmJihsLnN0YWNrJiYtMT09bC5zdGFjay5pbmRleE9mKGwubWVzc2FnZSkpJiZcbihsPWwubWVzc2FnZStcIlxcblwiK2wuc3RhY2spLFphKFwibW9kdWxlcnJcIixhLGwuc3RhY2t8fGwubWVzc2FnZXx8bCk7fX19KTtyZXR1cm4gYn1mdW5jdGlvbiBnKGEsYil7ZnVuY3Rpb24gYyhkKXtpZihhLmhhc093blByb3BlcnR5KGQpKXtpZihhW2RdPT09Zil0aHJvdyBaYShcImNkZXBcIixkK1wiIDwtIFwiK20uam9pbihcIiA8LSBcIikpO3JldHVybiBhW2RdfXRyeXtyZXR1cm4gbS51bnNoaWZ0KGQpLGFbZF09ZixhW2RdPWIoZCl9Y2F0Y2goZSl7dGhyb3cgYVtkXT09PWYmJmRlbGV0ZSBhW2RdLGU7fWZpbmFsbHl7bS5zaGlmdCgpfX1mdW5jdGlvbiBkKGEsYixlKXt2YXIgZz1bXSxrPXNjKGEpLGYsbSxoO209MDtmb3IoZj1rLmxlbmd0aDttPGY7bSsrKXtoPWtbbV07aWYoXCJzdHJpbmdcIiE9PXR5cGVvZiBoKXRocm93IFphKFwiaXRrblwiLGgpO2cucHVzaChlJiZlLmhhc093blByb3BlcnR5KGgpP2VbaF06YyhoKSl9YS4kaW5qZWN0fHwoYT1hW2ZdKTtyZXR1cm4gYS5hcHBseShiLGcpfXJldHVybntpbnZva2U6ZCxcbmluc3RhbnRpYXRlOmZ1bmN0aW9uKGEsYil7dmFyIGM9ZnVuY3Rpb24oKXt9LGU7Yy5wcm90b3R5cGU9KE8oYSk/YVthLmxlbmd0aC0xXTphKS5wcm90b3R5cGU7Yz1uZXcgYztlPWQoYSxjLGIpO3JldHVybiBVKGUpfHxRKGUpP2U6Y30sZ2V0OmMsYW5ub3RhdGU6c2MsaGFzOmZ1bmN0aW9uKGIpe3JldHVybiBsLmhhc093blByb3BlcnR5KGIrayl8fGEuaGFzT3duUHJvcGVydHkoYil9fX12YXIgZj17fSxrPVwiUHJvdmlkZXJcIixtPVtdLGg9bmV3IFlhLGw9eyRwcm92aWRlOntwcm92aWRlcjphKGMpLGZhY3Rvcnk6YShkKSxzZXJ2aWNlOmEoZnVuY3Rpb24oYSxiKXtyZXR1cm4gZChhLFtcIiRpbmplY3RvclwiLGZ1bmN0aW9uKGEpe3JldHVybiBhLmluc3RhbnRpYXRlKGIpfV0pfSksdmFsdWU6YShmdW5jdGlvbihhLGIpe3JldHVybiBkKGEsJChiKSl9KSxjb25zdGFudDphKGZ1bmN0aW9uKGEsYil7QWEoYSxcImNvbnN0YW50XCIpO2xbYV09YjtwW2FdPWJ9KSxkZWNvcmF0b3I6ZnVuY3Rpb24oYSxcbmIpe3ZhciBjPW4uZ2V0KGErayksZD1jLiRnZXQ7Yy4kZ2V0PWZ1bmN0aW9uKCl7dmFyIGE9ci5pbnZva2UoZCxjKTtyZXR1cm4gci5pbnZva2UoYixudWxsLHskZGVsZWdhdGU6YX0pfX19fSxuPWwuJGluamVjdG9yPWcobCxmdW5jdGlvbigpe3Rocm93IFphKFwidW5wclwiLG0uam9pbihcIiA8LSBcIikpO30pLHA9e30scj1wLiRpbmplY3Rvcj1nKHAsZnVuY3Rpb24oYSl7YT1uLmdldChhK2spO3JldHVybiByLmludm9rZShhLiRnZXQsYSl9KTtxKGUoYiksZnVuY3Rpb24oYSl7ci5pbnZva2UoYXx8eSl9KTtyZXR1cm4gcn1mdW5jdGlvbiBLZCgpe3ZhciBiPSEwO3RoaXMuZGlzYWJsZUF1dG9TY3JvbGxpbmc9ZnVuY3Rpb24oKXtiPSExfTt0aGlzLiRnZXQ9W1wiJHdpbmRvd1wiLFwiJGxvY2F0aW9uXCIsXCIkcm9vdFNjb3BlXCIsZnVuY3Rpb24oYSxjLGQpe2Z1bmN0aW9uIGUoYSl7dmFyIGI9bnVsbDtxKGEsZnVuY3Rpb24oYSl7Ynx8XCJhXCIhPT1MKGEubm9kZU5hbWUpfHwoYj1hKX0pO3JldHVybiBifVxuZnVuY3Rpb24gZygpe3ZhciBiPWMuaGFzaCgpLGQ7Yj8oZD1mLmdldEVsZW1lbnRCeUlkKGIpKT9kLnNjcm9sbEludG9WaWV3KCk6KGQ9ZShmLmdldEVsZW1lbnRzQnlOYW1lKGIpKSk/ZC5zY3JvbGxJbnRvVmlldygpOlwidG9wXCI9PT1iJiZhLnNjcm9sbFRvKDAsMCk6YS5zY3JvbGxUbygwLDApfXZhciBmPWEuZG9jdW1lbnQ7YiYmZC4kd2F0Y2goZnVuY3Rpb24oKXtyZXR1cm4gYy5oYXNoKCl9LGZ1bmN0aW9uKCl7ZC4kZXZhbEFzeW5jKGcpfSk7cmV0dXJuIGd9XX1mdW5jdGlvbiBnZSgpe3RoaXMuJGdldD1bXCIkJHJBRlwiLFwiJHRpbWVvdXRcIixmdW5jdGlvbihiLGEpe3JldHVybiBiLnN1cHBvcnRlZD9mdW5jdGlvbihhKXtyZXR1cm4gYihhKX06ZnVuY3Rpb24oYil7cmV0dXJuIGEoYiwwLCExKX19XX1mdW5jdGlvbiBzZShiLGEsYyxkKXtmdW5jdGlvbiBlKGEpe3RyeXthLmFwcGx5KG51bGwseWEuY2FsbChhcmd1bWVudHMsMSkpfWZpbmFsbHl7aWYodi0tLDA9PT12KWZvcig7SS5sZW5ndGg7KXRyeXtJLnBvcCgpKCl9Y2F0Y2goYil7Yy5lcnJvcihiKX19fVxuZnVuY3Rpb24gZyhhLGIpeyhmdW5jdGlvbiBiYSgpe3EoeCxmdW5jdGlvbihhKXthKCl9KTt1PWIoYmEsYSl9KSgpfWZ1bmN0aW9uIGYoKXt6PW51bGw7TSE9ay51cmwoKSYmKE09ay51cmwoKSxxKGhhLGZ1bmN0aW9uKGEpe2Eoay51cmwoKSl9KSl9dmFyIGs9dGhpcyxtPWFbMF0saD1iLmxvY2F0aW9uLGw9Yi5oaXN0b3J5LG49Yi5zZXRUaW1lb3V0LHA9Yi5jbGVhclRpbWVvdXQscj17fTtrLmlzTW9jaz0hMTt2YXIgdj0wLEk9W107ay4kJGNvbXBsZXRlT3V0c3RhbmRpbmdSZXF1ZXN0PWU7ay4kJGluY091dHN0YW5kaW5nUmVxdWVzdENvdW50PWZ1bmN0aW9uKCl7disrfTtrLm5vdGlmeVdoZW5Ob091dHN0YW5kaW5nUmVxdWVzdHM9ZnVuY3Rpb24oYSl7cSh4LGZ1bmN0aW9uKGEpe2EoKX0pOzA9PT12P2EoKTpJLnB1c2goYSl9O3ZhciB4PVtdLHU7ay5hZGRQb2xsRm49ZnVuY3Rpb24oYSl7RCh1KSYmZygxMDAsbik7eC5wdXNoKGEpO3JldHVybiBhfTt2YXIgTT1oLmhyZWYsRj1hLmZpbmQoXCJiYXNlXCIpLFxuej1udWxsO2sudXJsPWZ1bmN0aW9uKGEsYyl7aCE9PWIubG9jYXRpb24mJihoPWIubG9jYXRpb24pO2whPT1iLmhpc3RvcnkmJihsPWIuaGlzdG9yeSk7aWYoYSl7aWYoTSE9YSlyZXR1cm4gTT1hLGQuaGlzdG9yeT9jP2wucmVwbGFjZVN0YXRlKG51bGwsXCJcIixhKToobC5wdXNoU3RhdGUobnVsbCxcIlwiLGEpLEYuYXR0cihcImhyZWZcIixGLmF0dHIoXCJocmVmXCIpKSk6KHo9YSxjP2gucmVwbGFjZShhKTpoLmhyZWY9YSksa31lbHNlIHJldHVybiB6fHxoLmhyZWYucmVwbGFjZSgvJTI3L2csXCInXCIpfTt2YXIgaGE9W10sUD0hMTtrLm9uVXJsQ2hhbmdlPWZ1bmN0aW9uKGEpe2lmKCFQKXtpZihkLmhpc3RvcnkpdyhiKS5vbihcInBvcHN0YXRlXCIsZik7aWYoZC5oYXNoY2hhbmdlKXcoYikub24oXCJoYXNoY2hhbmdlXCIsZik7ZWxzZSBrLmFkZFBvbGxGbihmKTtQPSEwfWhhLnB1c2goYSk7cmV0dXJuIGF9O2suYmFzZUhyZWY9ZnVuY3Rpb24oKXt2YXIgYT1GLmF0dHIoXCJocmVmXCIpO3JldHVybiBhP1xuYS5yZXBsYWNlKC9eKGh0dHBzP1xcOik/XFwvXFwvW15cXC9dKi8sXCJcIik6XCJcIn07dmFyIE49e30sY2E9XCJcIixFPWsuYmFzZUhyZWYoKTtrLmNvb2tpZXM9ZnVuY3Rpb24oYSxiKXt2YXIgZCxlLGcsaztpZihhKWI9PT1zP20uY29va2llPWVzY2FwZShhKStcIj07cGF0aD1cIitFK1wiO2V4cGlyZXM9VGh1LCAwMSBKYW4gMTk3MCAwMDowMDowMCBHTVRcIjpDKGIpJiYoZD0obS5jb29raWU9ZXNjYXBlKGEpK1wiPVwiK2VzY2FwZShiKStcIjtwYXRoPVwiK0UpLmxlbmd0aCsxLDQwOTY8ZCYmYy53YXJuKFwiQ29va2llICdcIithK1wiJyBwb3NzaWJseSBub3Qgc2V0IG9yIG92ZXJmbG93ZWQgYmVjYXVzZSBpdCB3YXMgdG9vIGxhcmdlIChcIitkK1wiID4gNDA5NiBieXRlcykhXCIpKTtlbHNle2lmKG0uY29va2llIT09Y2EpZm9yKGNhPW0uY29va2llLGQ9Y2Euc3BsaXQoXCI7IFwiKSxOPXt9LGc9MDtnPGQubGVuZ3RoO2crKyllPWRbZ10saz1lLmluZGV4T2YoXCI9XCIpLDA8ayYmKGE9dW5lc2NhcGUoZS5zdWJzdHJpbmcoMCxcbmspKSxOW2FdPT09cyYmKE5bYV09dW5lc2NhcGUoZS5zdWJzdHJpbmcoaysxKSkpKTtyZXR1cm4gTn19O2suZGVmZXI9ZnVuY3Rpb24oYSxiKXt2YXIgYzt2Kys7Yz1uKGZ1bmN0aW9uKCl7ZGVsZXRlIHJbY107ZShhKX0sYnx8MCk7cltjXT0hMDtyZXR1cm4gY307ay5kZWZlci5jYW5jZWw9ZnVuY3Rpb24oYSl7cmV0dXJuIHJbYV0/KGRlbGV0ZSByW2FdLHAoYSksZSh5KSwhMCk6ITF9fWZ1bmN0aW9uIE1kKCl7dGhpcy4kZ2V0PVtcIiR3aW5kb3dcIixcIiRsb2dcIixcIiRzbmlmZmVyXCIsXCIkZG9jdW1lbnRcIixmdW5jdGlvbihiLGEsYyxkKXtyZXR1cm4gbmV3IHNlKGIsZCxhLGMpfV19ZnVuY3Rpb24gTmQoKXt0aGlzLiRnZXQ9ZnVuY3Rpb24oKXtmdW5jdGlvbiBiKGIsZCl7ZnVuY3Rpb24gZShhKXthIT1uJiYocD9wPT1hJiYocD1hLm4pOnA9YSxnKGEubixhLnApLGcoYSxuKSxuPWEsbi5uPW51bGwpfWZ1bmN0aW9uIGcoYSxiKXthIT1iJiYoYSYmKGEucD1iKSxiJiYoYi5uPWEpKX1pZihiIGluXG5hKXRocm93IHQoXCIkY2FjaGVGYWN0b3J5XCIpKFwiaWlkXCIsYik7dmFyIGY9MCxrPUooe30sZCx7aWQ6Yn0pLG09e30saD1kJiZkLmNhcGFjaXR5fHxOdW1iZXIuTUFYX1ZBTFVFLGw9e30sbj1udWxsLHA9bnVsbDtyZXR1cm4gYVtiXT17cHV0OmZ1bmN0aW9uKGEsYil7aWYoaDxOdW1iZXIuTUFYX1ZBTFVFKXt2YXIgYz1sW2FdfHwobFthXT17a2V5OmF9KTtlKGMpfWlmKCFEKGIpKXJldHVybiBhIGluIG18fGYrKyxtW2FdPWIsZj5oJiZ0aGlzLnJlbW92ZShwLmtleSksYn0sZ2V0OmZ1bmN0aW9uKGEpe2lmKGg8TnVtYmVyLk1BWF9WQUxVRSl7dmFyIGI9bFthXTtpZighYilyZXR1cm47ZShiKX1yZXR1cm4gbVthXX0scmVtb3ZlOmZ1bmN0aW9uKGEpe2lmKGg8TnVtYmVyLk1BWF9WQUxVRSl7dmFyIGI9bFthXTtpZighYilyZXR1cm47Yj09biYmKG49Yi5wKTtiPT1wJiYocD1iLm4pO2coYi5uLGIucCk7ZGVsZXRlIGxbYV19ZGVsZXRlIG1bYV07Zi0tfSxyZW1vdmVBbGw6ZnVuY3Rpb24oKXttPVxue307Zj0wO2w9e307bj1wPW51bGx9LGRlc3Ryb3k6ZnVuY3Rpb24oKXtsPWs9bT1udWxsO2RlbGV0ZSBhW2JdfSxpbmZvOmZ1bmN0aW9uKCl7cmV0dXJuIEooe30sayx7c2l6ZTpmfSl9fX12YXIgYT17fTtiLmluZm89ZnVuY3Rpb24oKXt2YXIgYj17fTtxKGEsZnVuY3Rpb24oYSxlKXtiW2VdPWEuaW5mbygpfSk7cmV0dXJuIGJ9O2IuZ2V0PWZ1bmN0aW9uKGIpe3JldHVybiBhW2JdfTtyZXR1cm4gYn19ZnVuY3Rpb24gY2UoKXt0aGlzLiRnZXQ9W1wiJGNhY2hlRmFjdG9yeVwiLGZ1bmN0aW9uKGIpe3JldHVybiBiKFwidGVtcGxhdGVzXCIpfV19ZnVuY3Rpb24gZ2MoYixhKXt2YXIgYz17fSxkPVwiRGlyZWN0aXZlXCIsZT0vXlxccypkaXJlY3RpdmVcXDpcXHMqKFtcXGRcXHdfXFwtXSspXFxzKyguKikkLyxnPS8oKFtcXGRcXHdfXFwtXSspKD86XFw6KFteO10rKSk/Oz8pLyxmPS9eKG9uW2Etel0rfGZvcm1hY3Rpb24pJC87dGhpcy5kaXJlY3RpdmU9ZnVuY3Rpb24gbShhLGUpe0FhKGEsXCJkaXJlY3RpdmVcIik7QyhhKT9cbihDYihlLFwiZGlyZWN0aXZlRmFjdG9yeVwiKSxjLmhhc093blByb3BlcnR5KGEpfHwoY1thXT1bXSxiLmZhY3RvcnkoYStkLFtcIiRpbmplY3RvclwiLFwiJGV4Y2VwdGlvbkhhbmRsZXJcIixmdW5jdGlvbihiLGQpe3ZhciBlPVtdO3EoY1thXSxmdW5jdGlvbihjLGcpe3RyeXt2YXIgZj1iLmludm9rZShjKTtRKGYpP2Y9e2NvbXBpbGU6JChmKX06IWYuY29tcGlsZSYmZi5saW5rJiYoZi5jb21waWxlPSQoZi5saW5rKSk7Zi5wcmlvcml0eT1mLnByaW9yaXR5fHwwO2YuaW5kZXg9ZztmLm5hbWU9Zi5uYW1lfHxhO2YucmVxdWlyZT1mLnJlcXVpcmV8fGYuY29udHJvbGxlciYmZi5uYW1lO2YucmVzdHJpY3Q9Zi5yZXN0cmljdHx8XCJBXCI7ZS5wdXNoKGYpfWNhdGNoKG0pe2QobSl9fSk7cmV0dXJuIGV9XSkpLGNbYV0ucHVzaChlKSk6cShhLFhiKG0pKTtyZXR1cm4gdGhpc307dGhpcy5hSHJlZlNhbml0aXphdGlvbldoaXRlbGlzdD1mdW5jdGlvbihiKXtyZXR1cm4gQihiKT8oYS5hSHJlZlNhbml0aXphdGlvbldoaXRlbGlzdChiKSxcbnRoaXMpOmEuYUhyZWZTYW5pdGl6YXRpb25XaGl0ZWxpc3QoKX07dGhpcy5pbWdTcmNTYW5pdGl6YXRpb25XaGl0ZWxpc3Q9ZnVuY3Rpb24oYil7cmV0dXJuIEIoYik/KGEuaW1nU3JjU2FuaXRpemF0aW9uV2hpdGVsaXN0KGIpLHRoaXMpOmEuaW1nU3JjU2FuaXRpemF0aW9uV2hpdGVsaXN0KCl9O3RoaXMuJGdldD1bXCIkaW5qZWN0b3JcIixcIiRpbnRlcnBvbGF0ZVwiLFwiJGV4Y2VwdGlvbkhhbmRsZXJcIixcIiRodHRwXCIsXCIkdGVtcGxhdGVDYWNoZVwiLFwiJHBhcnNlXCIsXCIkY29udHJvbGxlclwiLFwiJHJvb3RTY29wZVwiLFwiJGRvY3VtZW50XCIsXCIkc2NlXCIsXCIkYW5pbWF0ZVwiLFwiJCRzYW5pdGl6ZVVyaVwiLGZ1bmN0aW9uKGEsYixsLG4scCxyLHYsSSx4LHUsTSxGKXtmdW5jdGlvbiB6KGEsYixjLGQsZSl7YSBpbnN0YW5jZW9mIHd8fChhPXcoYSkpO3EoYSxmdW5jdGlvbihiLGMpezM9PWIubm9kZVR5cGUmJmIubm9kZVZhbHVlLm1hdGNoKC9cXFMrLykmJihhW2NdPXcoYikud3JhcChcIjxzcGFuPjwvc3Bhbj5cIikucGFyZW50KClbMF0pfSk7XG52YXIgZz1QKGEsYixhLGMsZCxlKTtoYShhLFwibmctc2NvcGVcIik7cmV0dXJuIGZ1bmN0aW9uKGIsYyxkLGUpe0NiKGIsXCJzY29wZVwiKTt2YXIgZj1jP0thLmNsb25lLmNhbGwoYSk6YTtxKGQsZnVuY3Rpb24oYSxiKXtmLmRhdGEoXCIkXCIrYitcIkNvbnRyb2xsZXJcIixhKX0pO2Q9MDtmb3IodmFyIG09Zi5sZW5ndGg7ZDxtO2QrKyl7dmFyIGg9ZltkXS5ub2RlVHlwZTsxIT09aCYmOSE9PWh8fGYuZXEoZCkuZGF0YShcIiRzY29wZVwiLGIpfWMmJmMoZixiKTtnJiZnKGIsZixmLGUpO3JldHVybiBmfX1mdW5jdGlvbiBoYShhLGIpe3RyeXthLmFkZENsYXNzKGIpfWNhdGNoKGMpe319ZnVuY3Rpb24gUChhLGIsYyxkLGUsZyl7ZnVuY3Rpb24gZihhLGMsZCxlKXt2YXIgZyxoLGwscixuLHAsdjtnPWMubGVuZ3RoO3ZhciBLPUFycmF5KGcpO2ZvcihuPTA7bjxnO24rKylLW25dPWNbbl07dj1uPTA7Zm9yKHA9bS5sZW5ndGg7bjxwO3YrKyloPUtbdl0sYz1tW24rK10sZz1tW24rK10sbD13KGgpLGM/XG4oYy5zY29wZT8ocj1hLiRuZXcoKSxsLmRhdGEoXCIkc2NvcGVcIixyKSk6cj1hLGw9Yy50cmFuc2NsdWRlT25UaGlzRWxlbWVudD9OKGEsYy50cmFuc2NsdWRlLGUpOiFjLnRlbXBsYXRlT25UaGlzRWxlbWVudCYmZT9lOiFlJiZiP04oYSxiKTpudWxsLGMoZyxyLGgsZCxsKSk6ZyYmZyhhLGguY2hpbGROb2RlcyxzLGUpfWZvcih2YXIgbT1bXSxoLGwscixuLHA9MDtwPGEubGVuZ3RoO3ArKyloPW5ldyBMYixsPWNhKGFbcF0sW10saCwwPT09cD9kOnMsZSksKGc9bC5sZW5ndGg/SChsLGFbcF0saCxiLGMsbnVsbCxbXSxbXSxnKTpudWxsKSYmZy5zY29wZSYmaGEodyhhW3BdKSxcIm5nLXNjb3BlXCIpLGg9ZyYmZy50ZXJtaW5hbHx8IShyPWFbcF0uY2hpbGROb2Rlcyl8fCFyLmxlbmd0aD9udWxsOlAocixnPyhnLnRyYW5zY2x1ZGVPblRoaXNFbGVtZW50fHwhZy50ZW1wbGF0ZU9uVGhpc0VsZW1lbnQpJiZnLnRyYW5zY2x1ZGU6YiksbS5wdXNoKGcsaCksbj1ufHxnfHxoLGc9bnVsbDtyZXR1cm4gbj9cbmY6bnVsbH1mdW5jdGlvbiBOKGEsYixjKXtyZXR1cm4gZnVuY3Rpb24oZCxlLGcpe3ZhciBmPSExO2R8fChkPWEuJG5ldygpLGY9ZC4kJHRyYW5zY2x1ZGVkPSEwKTtlPWIoZCxlLGcsYyk7aWYoZillLm9uKFwiJGRlc3Ryb3lcIixmdW5jdGlvbigpe2QuJGRlc3Ryb3koKX0pO3JldHVybiBlfX1mdW5jdGlvbiBjYShhLGIsYyxkLGYpe3ZhciBtPWMuJGF0dHIsaDtzd2l0Y2goYS5ub2RlVHlwZSl7Y2FzZSAxOmJhKGIsbWEoTGEoYSkudG9Mb3dlckNhc2UoKSksXCJFXCIsZCxmKTt2YXIgbCxyLG47aD1hLmF0dHJpYnV0ZXM7Zm9yKHZhciBwPTAsdj1oJiZoLmxlbmd0aDtwPHY7cCsrKXt2YXIgeD0hMSxJPSExO2w9aFtwXTtpZighU3x8ODw9U3x8bC5zcGVjaWZpZWQpe3I9bC5uYW1lO249bWEocik7Vy50ZXN0KG4pJiYocj1oYihuLnN1YnN0cig2KSxcIi1cIikpO3ZhciBNPW4ucmVwbGFjZSgvKFN0YXJ0fEVuZCkkLyxcIlwiKTtuPT09TStcIlN0YXJ0XCImJih4PXIsST1yLnN1YnN0cigwLHIubGVuZ3RoLVxuNSkrXCJlbmRcIixyPXIuc3Vic3RyKDAsci5sZW5ndGgtNikpO249bWEoci50b0xvd2VyQ2FzZSgpKTttW25dPXI7Y1tuXT1sPWFhKGwudmFsdWUpO3FjKGEsbikmJihjW25dPSEwKTtSKGEsYixsLG4pO2JhKGIsbixcIkFcIixkLGYseCxJKX19YT1hLmNsYXNzTmFtZTtpZihDKGEpJiZcIlwiIT09YSlmb3IoO2g9Zy5leGVjKGEpOyluPW1hKGhbMl0pLGJhKGIsbixcIkNcIixkLGYpJiYoY1tuXT1hYShoWzNdKSksYT1hLnN1YnN0cihoLmluZGV4K2hbMF0ubGVuZ3RoKTticmVhaztjYXNlIDM6dChiLGEubm9kZVZhbHVlKTticmVhaztjYXNlIDg6dHJ5e2lmKGg9ZS5leGVjKGEubm9kZVZhbHVlKSluPW1hKGhbMV0pLGJhKGIsbixcIk1cIixkLGYpJiYoY1tuXT1hYShoWzJdKSl9Y2F0Y2godSl7fX1iLnNvcnQoRCk7cmV0dXJuIGJ9ZnVuY3Rpb24gRShhLGIsYyl7dmFyIGQ9W10sZT0wO2lmKGImJmEuaGFzQXR0cmlidXRlJiZhLmhhc0F0dHJpYnV0ZShiKSl7ZG97aWYoIWEpdGhyb3cgaWEoXCJ1dGVyZGlyXCIsXG5iLGMpOzE9PWEubm9kZVR5cGUmJihhLmhhc0F0dHJpYnV0ZShiKSYmZSsrLGEuaGFzQXR0cmlidXRlKGMpJiZlLS0pO2QucHVzaChhKTthPWEubmV4dFNpYmxpbmd9d2hpbGUoMDxlKX1lbHNlIGQucHVzaChhKTtyZXR1cm4gdyhkKX1mdW5jdGlvbiBBKGEsYixjKXtyZXR1cm4gZnVuY3Rpb24oZCxlLGcsZixoKXtlPUUoZVswXSxiLGMpO3JldHVybiBhKGQsZSxnLGYsaCl9fWZ1bmN0aW9uIEgoYSxjLGQsZSxnLGYsbSxuLHApe2Z1bmN0aW9uIHgoYSxiLGMsZCl7aWYoYSl7YyYmKGE9QShhLGMsZCkpO2EucmVxdWlyZT1HLnJlcXVpcmU7YS5kaXJlY3RpdmVOYW1lPW5hO2lmKE49PT1HfHxHLiQkaXNvbGF0ZVNjb3BlKWE9dWMoYSx7aXNvbGF0ZVNjb3BlOiEwfSk7bS5wdXNoKGEpfWlmKGIpe2MmJihiPUEoYixjLGQpKTtiLnJlcXVpcmU9Ry5yZXF1aXJlO2IuZGlyZWN0aXZlTmFtZT1uYTtpZihOPT09R3x8Ry4kJGlzb2xhdGVTY29wZSliPXVjKGIse2lzb2xhdGVTY29wZTohMH0pO24ucHVzaChiKX19XG5mdW5jdGlvbiBJKGEsYixjLGQpe3ZhciBlLGc9XCJkYXRhXCIsZj0hMTtpZihDKGIpKXtmb3IoO1wiXlwiPT0oZT1iLmNoYXJBdCgwKSl8fFwiP1wiPT1lOyliPWIuc3Vic3RyKDEpLFwiXlwiPT1lJiYoZz1cImluaGVyaXRlZERhdGFcIiksZj1mfHxcIj9cIj09ZTtlPW51bGw7ZCYmXCJkYXRhXCI9PT1nJiYoZT1kW2JdKTtlPWV8fGNbZ10oXCIkXCIrYitcIkNvbnRyb2xsZXJcIik7aWYoIWUmJiFmKXRocm93IGlhKFwiY3RyZXFcIixiLGEpO31lbHNlIE8oYikmJihlPVtdLHEoYixmdW5jdGlvbihiKXtlLnB1c2goSShhLGIsYyxkKSl9KSk7cmV0dXJuIGV9ZnVuY3Rpb24gTShhLGUsZyxmLHApe2Z1bmN0aW9uIHgoYSxiKXt2YXIgYzsyPmFyZ3VtZW50cy5sZW5ndGgmJihiPWEsYT1zKTtDYSYmKGM9Y2EpO3JldHVybiBwKGEsYixjKX12YXIgdSxLLHosRixBLEUsY2E9e30sbmI7dT1jPT09Zz9kOmthKGQsbmV3IExiKHcoZyksZC4kYXR0cikpO0s9dS4kJGVsZW1lbnQ7aWYoTil7dmFyIGJhPS9eXFxzKihbQD0mXSkoXFw/PylcXHMqKFxcdyopXFxzKiQvO1xuZj13KGcpO0U9ZS4kbmV3KCEwKTshSHx8SCE9PU4mJkghPT1OLiQkb3JpZ2luYWxEaXJlY3RpdmU/Zi5kYXRhKFwiJGlzb2xhdGVTY29wZU5vVGVtcGxhdGVcIixFKTpmLmRhdGEoXCIkaXNvbGF0ZVNjb3BlXCIsRSk7aGEoZixcIm5nLWlzb2xhdGUtc2NvcGVcIik7cShOLnNjb3BlLGZ1bmN0aW9uKGEsYyl7dmFyIGQ9YS5tYXRjaChiYSl8fFtdLGc9ZFszXXx8YyxmPVwiP1wiPT1kWzJdLGQ9ZFsxXSxtLGwsbixwO0UuJCRpc29sYXRlQmluZGluZ3NbY109ZCtnO3N3aXRjaChkKXtjYXNlIFwiQFwiOnUuJG9ic2VydmUoZyxmdW5jdGlvbihhKXtFW2NdPWF9KTt1LiQkb2JzZXJ2ZXJzW2ddLiQkc2NvcGU9ZTt1W2ddJiYoRVtjXT1iKHVbZ10pKGUpKTticmVhaztjYXNlIFwiPVwiOmlmKGYmJiF1W2ddKWJyZWFrO2w9cih1W2ddKTtwPWwubGl0ZXJhbD94YTpmdW5jdGlvbihhLGIpe3JldHVybiBhPT09Yn07bj1sLmFzc2lnbnx8ZnVuY3Rpb24oKXttPUVbY109bChlKTt0aHJvdyBpYShcIm5vbmFzc2lnblwiLHVbZ10sXG5OLm5hbWUpO307bT1FW2NdPWwoZSk7RS4kd2F0Y2goZnVuY3Rpb24oKXt2YXIgYT1sKGUpO3AoYSxFW2NdKXx8KHAoYSxtKT9uKGUsYT1FW2NdKTpFW2NdPWEpO3JldHVybiBtPWF9LG51bGwsbC5saXRlcmFsKTticmVhaztjYXNlIFwiJlwiOmw9cih1W2ddKTtFW2NdPWZ1bmN0aW9uKGEpe3JldHVybiBsKGUsYSl9O2JyZWFrO2RlZmF1bHQ6dGhyb3cgaWEoXCJpc2NwXCIsTi5uYW1lLGMsYSk7fX0pfW5iPXAmJng7UCYmcShQLGZ1bmN0aW9uKGEpe3ZhciBiPXskc2NvcGU6YT09PU58fGEuJCRpc29sYXRlU2NvcGU/RTplLCRlbGVtZW50OkssJGF0dHJzOnUsJHRyYW5zY2x1ZGU6bmJ9LGM7QT1hLmNvbnRyb2xsZXI7XCJAXCI9PUEmJihBPXVbYS5uYW1lXSk7Yz12KEEsYik7Y2FbYS5uYW1lXT1jO0NhfHxLLmRhdGEoXCIkXCIrYS5uYW1lK1wiQ29udHJvbGxlclwiLGMpO2EuY29udHJvbGxlckFzJiYoYi4kc2NvcGVbYS5jb250cm9sbGVyQXNdPWMpfSk7Zj0wO2Zvcih6PW0ubGVuZ3RoO2Y8ejtmKyspdHJ5e0Y9XG5tW2ZdLEYoRi5pc29sYXRlU2NvcGU/RTplLEssdSxGLnJlcXVpcmUmJkkoRi5kaXJlY3RpdmVOYW1lLEYucmVxdWlyZSxLLGNhKSxuYil9Y2F0Y2goRyl7bChHLGdhKEspKX1mPWU7TiYmKE4udGVtcGxhdGV8fG51bGw9PT1OLnRlbXBsYXRlVXJsKSYmKGY9RSk7YSYmYShmLGcuY2hpbGROb2RlcyxzLHApO2ZvcihmPW4ubGVuZ3RoLTE7MDw9ZjtmLS0pdHJ5e0Y9bltmXSxGKEYuaXNvbGF0ZVNjb3BlP0U6ZSxLLHUsRi5yZXF1aXJlJiZJKEYuZGlyZWN0aXZlTmFtZSxGLnJlcXVpcmUsSyxjYSksbmIpfWNhdGNoKEIpe2woQixnYShLKSl9fXA9cHx8e307Zm9yKHZhciB1PS1OdW1iZXIuTUFYX1ZBTFVFLEYsUD1wLmNvbnRyb2xsZXJEaXJlY3RpdmVzLE49cC5uZXdJc29sYXRlU2NvcGVEaXJlY3RpdmUsSD1wLnRlbXBsYXRlRGlyZWN0aXZlLGJhPXAubm9uVGxiVHJhbnNjbHVkZURpcmVjdGl2ZSxEPSExLEo9ITEsQ2E9cC5oYXNFbGVtZW50VHJhbnNjbHVkZURpcmVjdGl2ZSx0PWQuJCRlbGVtZW50PVxudyhjKSxHLG5hLFgsVD1lLFIsUz0wLG9hPWEubGVuZ3RoO1M8b2E7UysrKXtHPWFbU107dmFyIFc9Ry4kJHN0YXJ0LFk9Ry4kJGVuZDtXJiYodD1FKGMsVyxZKSk7WD1zO2lmKHU+Ry5wcmlvcml0eSlicmVhaztpZihYPUcuc2NvcGUpRj1GfHxHLEcudGVtcGxhdGVVcmx8fChMKFwibmV3L2lzb2xhdGVkIHNjb3BlXCIsTixHLHQpLFUoWCkmJihOPUcpKTtuYT1HLm5hbWU7IUcudGVtcGxhdGVVcmwmJkcuY29udHJvbGxlciYmKFg9Ry5jb250cm9sbGVyLFA9UHx8e30sTChcIidcIituYStcIicgY29udHJvbGxlclwiLFBbbmFdLEcsdCksUFtuYV09Ryk7aWYoWD1HLnRyYW5zY2x1ZGUpRD0hMCxHLiQkdGxifHwoTChcInRyYW5zY2x1c2lvblwiLGJhLEcsdCksYmE9RyksXCJlbGVtZW50XCI9PVg/KENhPSEwLHU9Ry5wcmlvcml0eSxYPUUoYyxXLFkpLHQ9ZC4kJGVsZW1lbnQ9dyhWLmNyZWF0ZUNvbW1lbnQoXCIgXCIrbmErXCI6IFwiK2RbbmFdK1wiIFwiKSksYz10WzBdLG9iKGcsdyh5YS5jYWxsKFgsMCkpLGMpLFxuVD16KFgsZSx1LGYmJmYubmFtZSx7bm9uVGxiVHJhbnNjbHVkZURpcmVjdGl2ZTpiYX0pKTooWD13KEpiKGMpKS5jb250ZW50cygpLHQuZW1wdHkoKSxUPXooWCxlKSk7aWYoRy50ZW1wbGF0ZSlpZihKPSEwLEwoXCJ0ZW1wbGF0ZVwiLEgsRyx0KSxIPUcsWD1RKEcudGVtcGxhdGUpP0cudGVtcGxhdGUodCxkKTpHLnRlbXBsYXRlLFg9WihYKSxHLnJlcGxhY2Upe2Y9RztYPUhiLnRlc3QoWCk/dyhhYShYKSk6W107Yz1YWzBdO2lmKDEhPVgubGVuZ3RofHwxIT09Yy5ub2RlVHlwZSl0aHJvdyBpYShcInRwbHJ0XCIsbmEsXCJcIik7b2IoZyx0LGMpO29hPXskYXR0cjp7fX07WD1jYShjLFtdLG9hKTt2YXIgdGU9YS5zcGxpY2UoUysxLGEubGVuZ3RoLShTKzEpKTtOJiZ0YyhYKTthPWEuY29uY2F0KFgpLmNvbmNhdCh0ZSk7QihkLG9hKTtvYT1hLmxlbmd0aH1lbHNlIHQuaHRtbChYKTtpZihHLnRlbXBsYXRlVXJsKUo9ITAsTChcInRlbXBsYXRlXCIsSCxHLHQpLEg9RyxHLnJlcGxhY2UmJihmPUcpLE09XG55KGEuc3BsaWNlKFMsYS5sZW5ndGgtUyksdCxkLGcsRCYmVCxtLG4se2NvbnRyb2xsZXJEaXJlY3RpdmVzOlAsbmV3SXNvbGF0ZVNjb3BlRGlyZWN0aXZlOk4sdGVtcGxhdGVEaXJlY3RpdmU6SCxub25UbGJUcmFuc2NsdWRlRGlyZWN0aXZlOmJhfSksb2E9YS5sZW5ndGg7ZWxzZSBpZihHLmNvbXBpbGUpdHJ5e1I9Ry5jb21waWxlKHQsZCxUKSxRKFIpP3gobnVsbCxSLFcsWSk6UiYmeChSLnByZSxSLnBvc3QsVyxZKX1jYXRjaCgkKXtsKCQsZ2EodCkpfUcudGVybWluYWwmJihNLnRlcm1pbmFsPSEwLHU9TWF0aC5tYXgodSxHLnByaW9yaXR5KSl9TS5zY29wZT1GJiYhMD09PUYuc2NvcGU7TS50cmFuc2NsdWRlT25UaGlzRWxlbWVudD1EO00udGVtcGxhdGVPblRoaXNFbGVtZW50PUo7TS50cmFuc2NsdWRlPVQ7cC5oYXNFbGVtZW50VHJhbnNjbHVkZURpcmVjdGl2ZT1DYTtyZXR1cm4gTX1mdW5jdGlvbiB0YyhhKXtmb3IodmFyIGI9MCxjPWEubGVuZ3RoO2I8YztiKyspYVtiXT1aYihhW2JdLFxueyQkaXNvbGF0ZVNjb3BlOiEwfSl9ZnVuY3Rpb24gYmEoYixlLGcsZixoLHIsbil7aWYoZT09PWgpcmV0dXJuIG51bGw7aD1udWxsO2lmKGMuaGFzT3duUHJvcGVydHkoZSkpe3ZhciBwO2U9YS5nZXQoZStkKTtmb3IodmFyIHY9MCx4PWUubGVuZ3RoO3Y8eDt2KyspdHJ5e3A9ZVt2XSwoZj09PXN8fGY+cC5wcmlvcml0eSkmJi0xIT1wLnJlc3RyaWN0LmluZGV4T2YoZykmJihyJiYocD1aYihwLHskJHN0YXJ0OnIsJCRlbmQ6bn0pKSxiLnB1c2gocCksaD1wKX1jYXRjaChJKXtsKEkpfX1yZXR1cm4gaH1mdW5jdGlvbiBCKGEsYil7dmFyIGM9Yi4kYXR0cixkPWEuJGF0dHIsZT1hLiQkZWxlbWVudDtxKGEsZnVuY3Rpb24oZCxlKXtcIiRcIiE9ZS5jaGFyQXQoMCkmJihiW2VdJiZiW2VdIT09ZCYmKGQrPShcInN0eWxlXCI9PT1lP1wiO1wiOlwiIFwiKStiW2VdKSxhLiRzZXQoZSxkLCEwLGNbZV0pKX0pO3EoYixmdW5jdGlvbihiLGcpe1wiY2xhc3NcIj09Zz8oaGEoZSxiKSxhW1wiY2xhc3NcIl09KGFbXCJjbGFzc1wiXT9cbmFbXCJjbGFzc1wiXStcIiBcIjpcIlwiKStiKTpcInN0eWxlXCI9PWc/KGUuYXR0cihcInN0eWxlXCIsZS5hdHRyKFwic3R5bGVcIikrXCI7XCIrYiksYS5zdHlsZT0oYS5zdHlsZT9hLnN0eWxlK1wiO1wiOlwiXCIpK2IpOlwiJFwiPT1nLmNoYXJBdCgwKXx8YS5oYXNPd25Qcm9wZXJ0eShnKXx8KGFbZ109YixkW2ddPWNbZ10pfSl9ZnVuY3Rpb24geShhLGIsYyxkLGUsZyxmLGgpe3ZhciBtPVtdLGwscix2PWJbMF0seD1hLnNoaWZ0KCksST1KKHt9LHgse3RlbXBsYXRlVXJsOm51bGwsdHJhbnNjbHVkZTpudWxsLHJlcGxhY2U6bnVsbCwkJG9yaWdpbmFsRGlyZWN0aXZlOnh9KSxNPVEoeC50ZW1wbGF0ZVVybCk/eC50ZW1wbGF0ZVVybChiLGMpOngudGVtcGxhdGVVcmw7Yi5lbXB0eSgpO24uZ2V0KHUuZ2V0VHJ1c3RlZFJlc291cmNlVXJsKE0pLHtjYWNoZTpwfSkuc3VjY2VzcyhmdW5jdGlvbihuKXt2YXIgcCx1O249WihuKTtpZih4LnJlcGxhY2Upe249SGIudGVzdChuKT93KGFhKG4pKTpbXTtwPW5bMF07aWYoMSE9XG5uLmxlbmd0aHx8MSE9PXAubm9kZVR5cGUpdGhyb3cgaWEoXCJ0cGxydFwiLHgubmFtZSxNKTtuPXskYXR0cjp7fX07b2IoZCxiLHApO3ZhciB6PWNhKHAsW10sbik7VSh4LnNjb3BlKSYmdGMoeik7YT16LmNvbmNhdChhKTtCKGMsbil9ZWxzZSBwPXYsYi5odG1sKG4pO2EudW5zaGlmdChJKTtsPUgoYSxwLGMsZSxiLHgsZyxmLGgpO3EoZCxmdW5jdGlvbihhLGMpe2E9PXAmJihkW2NdPWJbMF0pfSk7Zm9yKHI9UChiWzBdLmNoaWxkTm9kZXMsZSk7bS5sZW5ndGg7KXtuPW0uc2hpZnQoKTt1PW0uc2hpZnQoKTt2YXIgRj1tLnNoaWZ0KCksQT1tLnNoaWZ0KCksej1iWzBdO2lmKHUhPT12KXt2YXIgRT11LmNsYXNzTmFtZTtoLmhhc0VsZW1lbnRUcmFuc2NsdWRlRGlyZWN0aXZlJiZ4LnJlcGxhY2V8fCh6PUpiKHApKTtvYihGLHcodSkseik7aGEodyh6KSxFKX11PWwudHJhbnNjbHVkZU9uVGhpc0VsZW1lbnQ/TihuLGwudHJhbnNjbHVkZSxBKTpBO2wocixuLHosZCx1KX1tPW51bGx9KS5lcnJvcihmdW5jdGlvbihhLFxuYixjLGQpe3Rocm93IGlhKFwidHBsb2FkXCIsZC51cmwpO30pO3JldHVybiBmdW5jdGlvbihhLGIsYyxkLGUpe2E9ZTttPyhtLnB1c2goYiksbS5wdXNoKGMpLG0ucHVzaChkKSxtLnB1c2goYSkpOihsLnRyYW5zY2x1ZGVPblRoaXNFbGVtZW50JiYoYT1OKGIsbC50cmFuc2NsdWRlLGUpKSxsKHIsYixjLGQsYSkpfX1mdW5jdGlvbiBEKGEsYil7dmFyIGM9Yi5wcmlvcml0eS1hLnByaW9yaXR5O3JldHVybiAwIT09Yz9jOmEubmFtZSE9PWIubmFtZT9hLm5hbWU8Yi5uYW1lPy0xOjE6YS5pbmRleC1iLmluZGV4fWZ1bmN0aW9uIEwoYSxiLGMsZCl7aWYoYil0aHJvdyBpYShcIm11bHRpZGlyXCIsYi5uYW1lLGMubmFtZSxhLGdhKGQpKTt9ZnVuY3Rpb24gdChhLGMpe3ZhciBkPWIoYywhMCk7ZCYmYS5wdXNoKHtwcmlvcml0eTowLGNvbXBpbGU6ZnVuY3Rpb24oYSl7dmFyIGI9YS5wYXJlbnQoKS5sZW5ndGg7YiYmaGEoYS5wYXJlbnQoKSxcIm5nLWJpbmRpbmdcIik7cmV0dXJuIGZ1bmN0aW9uKGEsXG5jKXt2YXIgZT1jLnBhcmVudCgpLGc9ZS5kYXRhKFwiJGJpbmRpbmdcIil8fFtdO2cucHVzaChkKTtlLmRhdGEoXCIkYmluZGluZ1wiLGcpO2J8fGhhKGUsXCJuZy1iaW5kaW5nXCIpO2EuJHdhdGNoKGQsZnVuY3Rpb24oYSl7Y1swXS5ub2RlVmFsdWU9YX0pfX19KX1mdW5jdGlvbiBUKGEsYil7aWYoXCJzcmNkb2NcIj09YilyZXR1cm4gdS5IVE1MO3ZhciBjPUxhKGEpO2lmKFwieGxpbmtIcmVmXCI9PWJ8fFwiRk9STVwiPT1jJiZcImFjdGlvblwiPT1ifHxcIklNR1wiIT1jJiYoXCJzcmNcIj09Ynx8XCJuZ1NyY1wiPT1iKSlyZXR1cm4gdS5SRVNPVVJDRV9VUkx9ZnVuY3Rpb24gUihhLGMsZCxlKXt2YXIgZz1iKGQsITApO2lmKGcpe2lmKFwibXVsdGlwbGVcIj09PWUmJlwiU0VMRUNUXCI9PT1MYShhKSl0aHJvdyBpYShcInNlbG11bHRpXCIsZ2EoYSkpO2MucHVzaCh7cHJpb3JpdHk6MTAwLGNvbXBpbGU6ZnVuY3Rpb24oKXtyZXR1cm57cHJlOmZ1bmN0aW9uKGMsZCxtKXtkPW0uJCRvYnNlcnZlcnN8fChtLiQkb2JzZXJ2ZXJzPVxue30pO2lmKGYudGVzdChlKSl0aHJvdyBpYShcIm5vZG9tZXZlbnRzXCIpO2lmKGc9YihtW2VdLCEwLFQoYSxlKSkpbVtlXT1nKGMpLChkW2VdfHwoZFtlXT1bXSkpLiQkaW50ZXI9ITAsKG0uJCRvYnNlcnZlcnMmJm0uJCRvYnNlcnZlcnNbZV0uJCRzY29wZXx8YykuJHdhdGNoKGcsZnVuY3Rpb24oYSxiKXtcImNsYXNzXCI9PT1lJiZhIT1iP20uJHVwZGF0ZUNsYXNzKGEsYik6bS4kc2V0KGUsYSl9KX19fX0pfX1mdW5jdGlvbiBvYihhLGIsYyl7dmFyIGQ9YlswXSxlPWIubGVuZ3RoLGc9ZC5wYXJlbnROb2RlLGYsbTtpZihhKWZvcihmPTAsbT1hLmxlbmd0aDtmPG07ZisrKWlmKGFbZl09PWQpe2FbZisrXT1jO209ZitlLTE7Zm9yKHZhciBoPWEubGVuZ3RoO2Y8aDtmKyssbSsrKW08aD9hW2ZdPWFbbV06ZGVsZXRlIGFbZl07YS5sZW5ndGgtPWUtMTticmVha31nJiZnLnJlcGxhY2VDaGlsZChjLGQpO2E9Vi5jcmVhdGVEb2N1bWVudEZyYWdtZW50KCk7YS5hcHBlbmRDaGlsZChkKTtjW3cuZXhwYW5kb109XG5kW3cuZXhwYW5kb107ZD0xO2ZvcihlPWIubGVuZ3RoO2Q8ZTtkKyspZz1iW2RdLHcoZykucmVtb3ZlKCksYS5hcHBlbmRDaGlsZChnKSxkZWxldGUgYltkXTtiWzBdPWM7Yi5sZW5ndGg9MX1mdW5jdGlvbiB1YyhhLGIpe3JldHVybiBKKGZ1bmN0aW9uKCl7cmV0dXJuIGEuYXBwbHkobnVsbCxhcmd1bWVudHMpfSxhLGIpfXZhciBMYj1mdW5jdGlvbihhLGIpe3RoaXMuJCRlbGVtZW50PWE7dGhpcy4kYXR0cj1ifHx7fX07TGIucHJvdG90eXBlPXskbm9ybWFsaXplOm1hLCRhZGRDbGFzczpmdW5jdGlvbihhKXthJiYwPGEubGVuZ3RoJiZNLmFkZENsYXNzKHRoaXMuJCRlbGVtZW50LGEpfSwkcmVtb3ZlQ2xhc3M6ZnVuY3Rpb24oYSl7YSYmMDxhLmxlbmd0aCYmTS5yZW1vdmVDbGFzcyh0aGlzLiQkZWxlbWVudCxhKX0sJHVwZGF0ZUNsYXNzOmZ1bmN0aW9uKGEsYil7dmFyIGM9dmMoYSxiKSxkPXZjKGIsYSk7MD09PWMubGVuZ3RoP00ucmVtb3ZlQ2xhc3ModGhpcy4kJGVsZW1lbnQsZCk6XG4wPT09ZC5sZW5ndGg/TS5hZGRDbGFzcyh0aGlzLiQkZWxlbWVudCxjKTpNLnNldENsYXNzKHRoaXMuJCRlbGVtZW50LGMsZCl9LCRzZXQ6ZnVuY3Rpb24oYSxiLGMsZCl7dmFyIGU9cWModGhpcy4kJGVsZW1lbnRbMF0sYSk7ZSYmKHRoaXMuJCRlbGVtZW50LnByb3AoYSxiKSxkPWUpO3RoaXNbYV09YjtkP3RoaXMuJGF0dHJbYV09ZDooZD10aGlzLiRhdHRyW2FdKXx8KHRoaXMuJGF0dHJbYV09ZD1oYihhLFwiLVwiKSk7ZT1MYSh0aGlzLiQkZWxlbWVudCk7aWYoXCJBXCI9PT1lJiZcImhyZWZcIj09PWF8fFwiSU1HXCI9PT1lJiZcInNyY1wiPT09YSl0aGlzW2FdPWI9RihiLFwic3JjXCI9PT1hKTshMSE9PWMmJihudWxsPT09Ynx8Yj09PXM/dGhpcy4kJGVsZW1lbnQucmVtb3ZlQXR0cihkKTp0aGlzLiQkZWxlbWVudC5hdHRyKGQsYikpOyhjPXRoaXMuJCRvYnNlcnZlcnMpJiZxKGNbYV0sZnVuY3Rpb24oYSl7dHJ5e2EoYil9Y2F0Y2goYyl7bChjKX19KX0sJG9ic2VydmU6ZnVuY3Rpb24oYSxiKXt2YXIgYz1cbnRoaXMsZD1jLiQkb2JzZXJ2ZXJzfHwoYy4kJG9ic2VydmVycz17fSksZT1kW2FdfHwoZFthXT1bXSk7ZS5wdXNoKGIpO0kuJGV2YWxBc3luYyhmdW5jdGlvbigpe2UuJCRpbnRlcnx8YihjW2FdKX0pO3JldHVybiBifX07dmFyIENhPWIuc3RhcnRTeW1ib2woKSxvYT1iLmVuZFN5bWJvbCgpLFo9XCJ7e1wiPT1DYXx8XCJ9fVwiPT1vYT9GYTpmdW5jdGlvbihhKXtyZXR1cm4gYS5yZXBsYWNlKC9cXHtcXHsvZyxDYSkucmVwbGFjZSgvfX0vZyxvYSl9LFc9L15uZ0F0dHJbQS1aXS87cmV0dXJuIHp9XX1mdW5jdGlvbiBtYShiKXtyZXR1cm4gVmEoYi5yZXBsYWNlKHVlLFwiXCIpKX1mdW5jdGlvbiB2YyhiLGEpe3ZhciBjPVwiXCIsZD1iLnNwbGl0KC9cXHMrLyksZT1hLnNwbGl0KC9cXHMrLyksZz0wO2E6Zm9yKDtnPGQubGVuZ3RoO2crKyl7Zm9yKHZhciBmPWRbZ10saz0wO2s8ZS5sZW5ndGg7aysrKWlmKGY9PWVba10pY29udGludWUgYTtjKz0oMDxjLmxlbmd0aD9cIiBcIjpcIlwiKStmfXJldHVybiBjfWZ1bmN0aW9uIE9kKCl7dmFyIGI9XG57fSxhPS9eKFxcUyspKFxccythc1xccysoXFx3KykpPyQvO3RoaXMucmVnaXN0ZXI9ZnVuY3Rpb24oYSxkKXtBYShhLFwiY29udHJvbGxlclwiKTtVKGEpP0ooYixhKTpiW2FdPWR9O3RoaXMuJGdldD1bXCIkaW5qZWN0b3JcIixcIiR3aW5kb3dcIixmdW5jdGlvbihjLGQpe3JldHVybiBmdW5jdGlvbihlLGcpe3ZhciBmLGssbTtDKGUpJiYoZj1lLm1hdGNoKGEpLGs9ZlsxXSxtPWZbM10sZT1iLmhhc093blByb3BlcnR5KGspP2Jba106ZmMoZy4kc2NvcGUsaywhMCl8fGZjKGQsaywhMCksVGEoZSxrLCEwKSk7Zj1jLmluc3RhbnRpYXRlKGUsZyk7aWYobSl7aWYoIWd8fFwib2JqZWN0XCIhPXR5cGVvZiBnLiRzY29wZSl0aHJvdyB0KFwiJGNvbnRyb2xsZXJcIikoXCJub3NjcFwiLGt8fGUubmFtZSxtKTtnLiRzY29wZVttXT1mfXJldHVybiBmfX1dfWZ1bmN0aW9uIFBkKCl7dGhpcy4kZ2V0PVtcIiR3aW5kb3dcIixmdW5jdGlvbihiKXtyZXR1cm4gdyhiLmRvY3VtZW50KX1dfWZ1bmN0aW9uIFFkKCl7dGhpcy4kZ2V0PVxuW1wiJGxvZ1wiLGZ1bmN0aW9uKGIpe3JldHVybiBmdW5jdGlvbihhLGMpe2IuZXJyb3IuYXBwbHkoYixhcmd1bWVudHMpfX1dfWZ1bmN0aW9uIHdjKGIpe3ZhciBhPXt9LGMsZCxlO2lmKCFiKXJldHVybiBhO3EoYi5zcGxpdChcIlxcblwiKSxmdW5jdGlvbihiKXtlPWIuaW5kZXhPZihcIjpcIik7Yz1MKGFhKGIuc3Vic3RyKDAsZSkpKTtkPWFhKGIuc3Vic3RyKGUrMSkpO2MmJihhW2NdPWFbY10/YVtjXSsoXCIsIFwiK2QpOmQpfSk7cmV0dXJuIGF9ZnVuY3Rpb24geGMoYil7dmFyIGE9VShiKT9iOnM7cmV0dXJuIGZ1bmN0aW9uKGMpe2F8fChhPXdjKGIpKTtyZXR1cm4gYz9hW0woYyldfHxudWxsOmF9fWZ1bmN0aW9uIHljKGIsYSxjKXtpZihRKGMpKXJldHVybiBjKGIsYSk7cShjLGZ1bmN0aW9uKGMpe2I9YyhiLGEpfSk7cmV0dXJuIGJ9ZnVuY3Rpb24gVGQoKXt2YXIgYj0vXlxccyooXFxbfFxce1teXFx7XSkvLGE9L1tcXH1cXF1dXFxzKiQvLGM9L15cXClcXF1cXH0nLD9cXG4vLGQ9e1wiQ29udGVudC1UeXBlXCI6XCJhcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLThcIn0sXG5lPXRoaXMuZGVmYXVsdHM9e3RyYW5zZm9ybVJlc3BvbnNlOltmdW5jdGlvbihkKXtDKGQpJiYoZD1kLnJlcGxhY2UoYyxcIlwiKSxiLnRlc3QoZCkmJmEudGVzdChkKSYmKGQ9YWMoZCkpKTtyZXR1cm4gZH1dLHRyYW5zZm9ybVJlcXVlc3Q6W2Z1bmN0aW9uKGEpe3JldHVybiBVKGEpJiZcIltvYmplY3QgRmlsZV1cIiE9PXdhLmNhbGwoYSkmJlwiW29iamVjdCBCbG9iXVwiIT09d2EuY2FsbChhKT9yYShhKTphfV0saGVhZGVyczp7Y29tbW9uOntBY2NlcHQ6XCJhcHBsaWNhdGlvbi9qc29uLCB0ZXh0L3BsYWluLCAqLypcIn0scG9zdDprYShkKSxwdXQ6a2EoZCkscGF0Y2g6a2EoZCl9LHhzcmZDb29raWVOYW1lOlwiWFNSRi1UT0tFTlwiLHhzcmZIZWFkZXJOYW1lOlwiWC1YU1JGLVRPS0VOXCJ9LGc9dGhpcy5pbnRlcmNlcHRvcnM9W10sZj10aGlzLnJlc3BvbnNlSW50ZXJjZXB0b3JzPVtdO3RoaXMuJGdldD1bXCIkaHR0cEJhY2tlbmRcIixcIiRicm93c2VyXCIsXCIkY2FjaGVGYWN0b3J5XCIsXCIkcm9vdFNjb3BlXCIsXG5cIiRxXCIsXCIkaW5qZWN0b3JcIixmdW5jdGlvbihhLGIsYyxkLG4scCl7ZnVuY3Rpb24gcihhKXtmdW5jdGlvbiBiKGEpe3ZhciBkPUooe30sYSx7ZGF0YTp5YyhhLmRhdGEsYS5oZWFkZXJzLGMudHJhbnNmb3JtUmVzcG9uc2UpfSk7cmV0dXJuIDIwMDw9YS5zdGF0dXMmJjMwMD5hLnN0YXR1cz9kOm4ucmVqZWN0KGQpfXZhciBjPXttZXRob2Q6XCJnZXRcIix0cmFuc2Zvcm1SZXF1ZXN0OmUudHJhbnNmb3JtUmVxdWVzdCx0cmFuc2Zvcm1SZXNwb25zZTplLnRyYW5zZm9ybVJlc3BvbnNlfSxkPWZ1bmN0aW9uKGEpe2Z1bmN0aW9uIGIoYSl7dmFyIGM7cShhLGZ1bmN0aW9uKGIsZCl7UShiKSYmKGM9YigpLG51bGwhPWM/YVtkXT1jOmRlbGV0ZSBhW2RdKX0pfXZhciBjPWUuaGVhZGVycyxkPUooe30sYS5oZWFkZXJzKSxnLGYsYz1KKHt9LGMuY29tbW9uLGNbTChhLm1ldGhvZCldKTtiKGMpO2IoZCk7YTpmb3IoZyBpbiBjKXthPUwoZyk7Zm9yKGYgaW4gZClpZihMKGYpPT09YSljb250aW51ZSBhO1xuZFtnXT1jW2ddfXJldHVybiBkfShhKTtKKGMsYSk7Yy5oZWFkZXJzPWQ7Yy5tZXRob2Q9SGEoYy5tZXRob2QpO3ZhciBnPVtmdW5jdGlvbihhKXtkPWEuaGVhZGVyczt2YXIgYz15YyhhLmRhdGEseGMoZCksYS50cmFuc2Zvcm1SZXF1ZXN0KTtEKGEuZGF0YSkmJnEoZCxmdW5jdGlvbihhLGIpe1wiY29udGVudC10eXBlXCI9PT1MKGIpJiZkZWxldGUgZFtiXX0pO0QoYS53aXRoQ3JlZGVudGlhbHMpJiYhRChlLndpdGhDcmVkZW50aWFscykmJihhLndpdGhDcmVkZW50aWFscz1lLndpdGhDcmVkZW50aWFscyk7cmV0dXJuIHYoYSxjLGQpLnRoZW4oYixiKX0sc10sZj1uLndoZW4oYyk7Zm9yKHEodSxmdW5jdGlvbihhKXsoYS5yZXF1ZXN0fHxhLnJlcXVlc3RFcnJvcikmJmcudW5zaGlmdChhLnJlcXVlc3QsYS5yZXF1ZXN0RXJyb3IpOyhhLnJlc3BvbnNlfHxhLnJlc3BvbnNlRXJyb3IpJiZnLnB1c2goYS5yZXNwb25zZSxhLnJlc3BvbnNlRXJyb3IpfSk7Zy5sZW5ndGg7KXthPWcuc2hpZnQoKTtcbnZhciBtPWcuc2hpZnQoKSxmPWYudGhlbihhLG0pfWYuc3VjY2Vzcz1mdW5jdGlvbihhKXtmLnRoZW4oZnVuY3Rpb24oYil7YShiLmRhdGEsYi5zdGF0dXMsYi5oZWFkZXJzLGMpfSk7cmV0dXJuIGZ9O2YuZXJyb3I9ZnVuY3Rpb24oYSl7Zi50aGVuKG51bGwsZnVuY3Rpb24oYil7YShiLmRhdGEsYi5zdGF0dXMsYi5oZWFkZXJzLGMpfSk7cmV0dXJuIGZ9O3JldHVybiBmfWZ1bmN0aW9uIHYoYyxnLGYpe2Z1bmN0aW9uIGgoYSxiLGMsZSl7QSYmKDIwMDw9YSYmMzAwPmE/QS5wdXQodyxbYSxiLHdjKGMpLGVdKTpBLnJlbW92ZSh3KSk7cChiLGEsYyxlKTtkLiQkcGhhc2V8fGQuJGFwcGx5KCl9ZnVuY3Rpb24gcChhLGIsZCxlKXtiPU1hdGgubWF4KGIsMCk7KDIwMDw9YiYmMzAwPmI/dS5yZXNvbHZlOnUucmVqZWN0KSh7ZGF0YTphLHN0YXR1czpiLGhlYWRlcnM6eGMoZCksY29uZmlnOmMsc3RhdHVzVGV4dDplfSl9ZnVuY3Rpb24gdigpe3ZhciBhPU9hKHIucGVuZGluZ1JlcXVlc3RzLFxuYyk7LTEhPT1hJiZyLnBlbmRpbmdSZXF1ZXN0cy5zcGxpY2UoYSwxKX12YXIgdT1uLmRlZmVyKCkscT11LnByb21pc2UsQSxILHc9SShjLnVybCxjLnBhcmFtcyk7ci5wZW5kaW5nUmVxdWVzdHMucHVzaChjKTtxLnRoZW4odix2KTsoYy5jYWNoZXx8ZS5jYWNoZSkmJighMSE9PWMuY2FjaGUmJlwiR0VUXCI9PWMubWV0aG9kKSYmKEE9VShjLmNhY2hlKT9jLmNhY2hlOlUoZS5jYWNoZSk/ZS5jYWNoZTp4KTtpZihBKWlmKEg9QS5nZXQodyksQihIKSl7aWYoSC50aGVuKXJldHVybiBILnRoZW4odix2KSxIO08oSCk/cChIWzFdLEhbMF0sa2EoSFsyXSksSFszXSk6cChILDIwMCx7fSxcIk9LXCIpfWVsc2UgQS5wdXQodyxxKTtEKEgpJiYoKEg9TWIoYy51cmwpP2IuY29va2llcygpW2MueHNyZkNvb2tpZU5hbWV8fGUueHNyZkNvb2tpZU5hbWVdOnMpJiYoZltjLnhzcmZIZWFkZXJOYW1lfHxlLnhzcmZIZWFkZXJOYW1lXT1IKSxhKGMubWV0aG9kLHcsZyxoLGYsYy50aW1lb3V0LGMud2l0aENyZWRlbnRpYWxzLFxuYy5yZXNwb25zZVR5cGUpKTtyZXR1cm4gcX1mdW5jdGlvbiBJKGEsYil7aWYoIWIpcmV0dXJuIGE7dmFyIGM9W107U2MoYixmdW5jdGlvbihhLGIpe251bGw9PT1hfHxEKGEpfHwoTyhhKXx8KGE9W2FdKSxxKGEsZnVuY3Rpb24oYSl7VShhKSYmKGE9cmEoYSkpO2MucHVzaCh6YShiKStcIj1cIit6YShhKSl9KSl9KTswPGMubGVuZ3RoJiYoYSs9KC0xPT1hLmluZGV4T2YoXCI/XCIpP1wiP1wiOlwiJlwiKStjLmpvaW4oXCImXCIpKTtyZXR1cm4gYX12YXIgeD1jKFwiJGh0dHBcIiksdT1bXTtxKGcsZnVuY3Rpb24oYSl7dS51bnNoaWZ0KEMoYSk/cC5nZXQoYSk6cC5pbnZva2UoYSkpfSk7cShmLGZ1bmN0aW9uKGEsYil7dmFyIGM9QyhhKT9wLmdldChhKTpwLmludm9rZShhKTt1LnNwbGljZShiLDAse3Jlc3BvbnNlOmZ1bmN0aW9uKGEpe3JldHVybiBjKG4ud2hlbihhKSl9LHJlc3BvbnNlRXJyb3I6ZnVuY3Rpb24oYSl7cmV0dXJuIGMobi5yZWplY3QoYSkpfX0pfSk7ci5wZW5kaW5nUmVxdWVzdHM9W107XG4oZnVuY3Rpb24oYSl7cShhcmd1bWVudHMsZnVuY3Rpb24oYSl7clthXT1mdW5jdGlvbihiLGMpe3JldHVybiByKEooY3x8e30se21ldGhvZDphLHVybDpifSkpfX0pfSkoXCJnZXRcIixcImRlbGV0ZVwiLFwiaGVhZFwiLFwianNvbnBcIik7KGZ1bmN0aW9uKGEpe3EoYXJndW1lbnRzLGZ1bmN0aW9uKGEpe3JbYV09ZnVuY3Rpb24oYixjLGQpe3JldHVybiByKEooZHx8e30se21ldGhvZDphLHVybDpiLGRhdGE6Y30pKX19KX0pKFwicG9zdFwiLFwicHV0XCIpO3IuZGVmYXVsdHM9ZTtyZXR1cm4gcn1dfWZ1bmN0aW9uIHZlKGIpe2lmKDg+PVMmJighYi5tYXRjaCgvXihnZXR8cG9zdHxoZWFkfHB1dHxkZWxldGV8b3B0aW9ucykkL2kpfHwhVC5YTUxIdHRwUmVxdWVzdCkpcmV0dXJuIG5ldyBULkFjdGl2ZVhPYmplY3QoXCJNaWNyb3NvZnQuWE1MSFRUUFwiKTtpZihULlhNTEh0dHBSZXF1ZXN0KXJldHVybiBuZXcgVC5YTUxIdHRwUmVxdWVzdDt0aHJvdyB0KFwiJGh0dHBCYWNrZW5kXCIpKFwibm94aHJcIik7fWZ1bmN0aW9uIFVkKCl7dGhpcy4kZ2V0PVxuW1wiJGJyb3dzZXJcIixcIiR3aW5kb3dcIixcIiRkb2N1bWVudFwiLGZ1bmN0aW9uKGIsYSxjKXtyZXR1cm4gd2UoYix2ZSxiLmRlZmVyLGEuYW5ndWxhci5jYWxsYmFja3MsY1swXSl9XX1mdW5jdGlvbiB3ZShiLGEsYyxkLGUpe2Z1bmN0aW9uIGcoYSxiLGMpe3ZhciBnPWUuY3JlYXRlRWxlbWVudChcInNjcmlwdFwiKSxmPW51bGw7Zy50eXBlPVwidGV4dC9qYXZhc2NyaXB0XCI7Zy5zcmM9YTtnLmFzeW5jPSEwO2Y9ZnVuY3Rpb24oYSl7V2EoZyxcImxvYWRcIixmKTtXYShnLFwiZXJyb3JcIixmKTtlLmJvZHkucmVtb3ZlQ2hpbGQoZyk7Zz1udWxsO3ZhciBrPS0xLHY9XCJ1bmtub3duXCI7YSYmKFwibG9hZFwiIT09YS50eXBlfHxkW2JdLmNhbGxlZHx8KGE9e3R5cGU6XCJlcnJvclwifSksdj1hLnR5cGUsaz1cImVycm9yXCI9PT1hLnR5cGU/NDA0OjIwMCk7YyYmYyhrLHYpfTtwYihnLFwibG9hZFwiLGYpO3BiKGcsXCJlcnJvclwiLGYpOzg+PVMmJihnLm9ucmVhZHlzdGF0ZWNoYW5nZT1mdW5jdGlvbigpe0MoZy5yZWFkeVN0YXRlKSYmXG4vbG9hZGVkfGNvbXBsZXRlLy50ZXN0KGcucmVhZHlTdGF0ZSkmJihnLm9ucmVhZHlzdGF0ZWNoYW5nZT1udWxsLGYoe3R5cGU6XCJsb2FkXCJ9KSl9KTtlLmJvZHkuYXBwZW5kQ2hpbGQoZyk7cmV0dXJuIGZ9dmFyIGY9LTE7cmV0dXJuIGZ1bmN0aW9uKGUsbSxoLGwsbixwLHIsdil7ZnVuY3Rpb24gSSgpe3U9ZjtGJiZGKCk7eiYmei5hYm9ydCgpfWZ1bmN0aW9uIHgoYSxkLGUsZyxmKXtQJiZjLmNhbmNlbChQKTtGPXo9bnVsbDswPT09ZCYmKGQ9ZT8yMDA6XCJmaWxlXCI9PXNhKG0pLnByb3RvY29sPzQwNDowKTthKDEyMjM9PT1kPzIwNDpkLGUsZyxmfHxcIlwiKTtiLiQkY29tcGxldGVPdXRzdGFuZGluZ1JlcXVlc3QoeSl9dmFyIHU7Yi4kJGluY091dHN0YW5kaW5nUmVxdWVzdENvdW50KCk7bT1tfHxiLnVybCgpO2lmKFwianNvbnBcIj09TChlKSl7dmFyIE09XCJfXCIrKGQuY291bnRlcisrKS50b1N0cmluZygzNik7ZFtNXT1mdW5jdGlvbihhKXtkW01dLmRhdGE9YTtkW01dLmNhbGxlZD0hMH07XG52YXIgRj1nKG0ucmVwbGFjZShcIkpTT05fQ0FMTEJBQ0tcIixcImFuZ3VsYXIuY2FsbGJhY2tzLlwiK00pLE0sZnVuY3Rpb24oYSxiKXt4KGwsYSxkW01dLmRhdGEsXCJcIixiKTtkW01dPXl9KX1lbHNle3ZhciB6PWEoZSk7ei5vcGVuKGUsbSwhMCk7cShuLGZ1bmN0aW9uKGEsYil7QihhKSYmei5zZXRSZXF1ZXN0SGVhZGVyKGIsYSl9KTt6Lm9ucmVhZHlzdGF0ZWNoYW5nZT1mdW5jdGlvbigpe2lmKHomJjQ9PXoucmVhZHlTdGF0ZSl7dmFyIGE9bnVsbCxiPW51bGw7dSE9PWYmJihhPXouZ2V0QWxsUmVzcG9uc2VIZWFkZXJzKCksYj1cInJlc3BvbnNlXCJpbiB6P3oucmVzcG9uc2U6ei5yZXNwb25zZVRleHQpO3gobCx1fHx6LnN0YXR1cyxiLGEsei5zdGF0dXNUZXh0fHxcIlwiKX19O3ImJih6LndpdGhDcmVkZW50aWFscz0hMCk7aWYodil0cnl7ei5yZXNwb25zZVR5cGU9dn1jYXRjaChzKXtpZihcImpzb25cIiE9PXYpdGhyb3cgczt9ei5zZW5kKGh8fG51bGwpfWlmKDA8cCl2YXIgUD1jKEkscCk7ZWxzZSBwJiZcbnAudGhlbiYmcC50aGVuKEkpfX1mdW5jdGlvbiBSZCgpe3ZhciBiPVwie3tcIixhPVwifX1cIjt0aGlzLnN0YXJ0U3ltYm9sPWZ1bmN0aW9uKGEpe3JldHVybiBhPyhiPWEsdGhpcyk6Yn07dGhpcy5lbmRTeW1ib2w9ZnVuY3Rpb24oYil7cmV0dXJuIGI/KGE9Yix0aGlzKTphfTt0aGlzLiRnZXQ9W1wiJHBhcnNlXCIsXCIkZXhjZXB0aW9uSGFuZGxlclwiLFwiJHNjZVwiLGZ1bmN0aW9uKGMsZCxlKXtmdW5jdGlvbiBnKGcsaCxsKXtmb3IodmFyIG4scCxyPTAsdj1bXSxJPWcubGVuZ3RoLHg9ITEsdT1bXTtyPEk7KS0xIT0obj1nLmluZGV4T2YoYixyKSkmJi0xIT0ocD1nLmluZGV4T2YoYSxuK2YpKT8ociE9biYmdi5wdXNoKGcuc3Vic3RyaW5nKHIsbikpLHYucHVzaChyPWMoeD1nLnN1YnN0cmluZyhuK2YscCkpKSxyLmV4cD14LHI9cCtrLHg9ITApOihyIT1JJiZ2LnB1c2goZy5zdWJzdHJpbmcocikpLHI9SSk7KEk9di5sZW5ndGgpfHwodi5wdXNoKFwiXCIpLEk9MSk7aWYobCYmMTx2Lmxlbmd0aCl0aHJvdyB6YyhcIm5vY29uY2F0XCIsXG5nKTtpZighaHx8eClyZXR1cm4gdS5sZW5ndGg9SSxyPWZ1bmN0aW9uKGEpe3RyeXtmb3IodmFyIGI9MCxjPUksZjtiPGM7YisrKXtpZihcImZ1bmN0aW9uXCI9PXR5cGVvZihmPXZbYl0pKWlmKGY9ZihhKSxmPWw/ZS5nZXRUcnVzdGVkKGwsZik6ZS52YWx1ZU9mKGYpLG51bGw9PWYpZj1cIlwiO2Vsc2Ugc3dpdGNoKHR5cGVvZiBmKXtjYXNlIFwic3RyaW5nXCI6YnJlYWs7Y2FzZSBcIm51bWJlclwiOmY9XCJcIitmO2JyZWFrO2RlZmF1bHQ6Zj1yYShmKX11W2JdPWZ9cmV0dXJuIHUuam9pbihcIlwiKX1jYXRjaChrKXthPXpjKFwiaW50ZXJyXCIsZyxrLnRvU3RyaW5nKCkpLGQoYSl9fSxyLmV4cD1nLHIucGFydHM9dixyfXZhciBmPWIubGVuZ3RoLGs9YS5sZW5ndGg7Zy5zdGFydFN5bWJvbD1mdW5jdGlvbigpe3JldHVybiBifTtnLmVuZFN5bWJvbD1mdW5jdGlvbigpe3JldHVybiBhfTtyZXR1cm4gZ31dfWZ1bmN0aW9uIFNkKCl7dGhpcy4kZ2V0PVtcIiRyb290U2NvcGVcIixcIiR3aW5kb3dcIixcIiRxXCIsZnVuY3Rpb24oYixcbmEsYyl7ZnVuY3Rpb24gZChkLGYsayxtKXt2YXIgaD1hLnNldEludGVydmFsLGw9YS5jbGVhckludGVydmFsLG49Yy5kZWZlcigpLHA9bi5wcm9taXNlLHI9MCx2PUIobSkmJiFtO2s9QihrKT9rOjA7cC50aGVuKG51bGwsbnVsbCxkKTtwLiQkaW50ZXJ2YWxJZD1oKGZ1bmN0aW9uKCl7bi5ub3RpZnkocisrKTswPGsmJnI+PWsmJihuLnJlc29sdmUociksbChwLiQkaW50ZXJ2YWxJZCksZGVsZXRlIGVbcC4kJGludGVydmFsSWRdKTt2fHxiLiRhcHBseSgpfSxmKTtlW3AuJCRpbnRlcnZhbElkXT1uO3JldHVybiBwfXZhciBlPXt9O2QuY2FuY2VsPWZ1bmN0aW9uKGEpe3JldHVybiBhJiZhLiQkaW50ZXJ2YWxJZCBpbiBlPyhlW2EuJCRpbnRlcnZhbElkXS5yZWplY3QoXCJjYW5jZWxlZFwiKSxjbGVhckludGVydmFsKGEuJCRpbnRlcnZhbElkKSxkZWxldGUgZVthLiQkaW50ZXJ2YWxJZF0sITApOiExfTtyZXR1cm4gZH1dfWZ1bmN0aW9uIGFkKCl7dGhpcy4kZ2V0PWZ1bmN0aW9uKCl7cmV0dXJue2lkOlwiZW4tdXNcIixcbk5VTUJFUl9GT1JNQVRTOntERUNJTUFMX1NFUDpcIi5cIixHUk9VUF9TRVA6XCIsXCIsUEFUVEVSTlM6W3ttaW5JbnQ6MSxtaW5GcmFjOjAsbWF4RnJhYzozLHBvc1ByZTpcIlwiLHBvc1N1ZjpcIlwiLG5lZ1ByZTpcIi1cIixuZWdTdWY6XCJcIixnU2l6ZTozLGxnU2l6ZTozfSx7bWluSW50OjEsbWluRnJhYzoyLG1heEZyYWM6Mixwb3NQcmU6XCJcXHUwMGE0XCIscG9zU3VmOlwiXCIsbmVnUHJlOlwiKFxcdTAwYTRcIixuZWdTdWY6XCIpXCIsZ1NpemU6MyxsZ1NpemU6M31dLENVUlJFTkNZX1NZTTpcIiRcIn0sREFURVRJTUVfRk9STUFUUzp7TU9OVEg6XCJKYW51YXJ5IEZlYnJ1YXJ5IE1hcmNoIEFwcmlsIE1heSBKdW5lIEp1bHkgQXVndXN0IFNlcHRlbWJlciBPY3RvYmVyIE5vdmVtYmVyIERlY2VtYmVyXCIuc3BsaXQoXCIgXCIpLFNIT1JUTU9OVEg6XCJKYW4gRmViIE1hciBBcHIgTWF5IEp1biBKdWwgQXVnIFNlcCBPY3QgTm92IERlY1wiLnNwbGl0KFwiIFwiKSxEQVk6XCJTdW5kYXkgTW9uZGF5IFR1ZXNkYXkgV2VkbmVzZGF5IFRodXJzZGF5IEZyaWRheSBTYXR1cmRheVwiLnNwbGl0KFwiIFwiKSxcblNIT1JUREFZOlwiU3VuIE1vbiBUdWUgV2VkIFRodSBGcmkgU2F0XCIuc3BsaXQoXCIgXCIpLEFNUE1TOltcIkFNXCIsXCJQTVwiXSxtZWRpdW06XCJNTU0gZCwgeSBoOm1tOnNzIGFcIixcInNob3J0XCI6XCJNL2QveXkgaDptbSBhXCIsZnVsbERhdGU6XCJFRUVFLCBNTU1NIGQsIHlcIixsb25nRGF0ZTpcIk1NTU0gZCwgeVwiLG1lZGl1bURhdGU6XCJNTU0gZCwgeVwiLHNob3J0RGF0ZTpcIk0vZC95eVwiLG1lZGl1bVRpbWU6XCJoOm1tOnNzIGFcIixzaG9ydFRpbWU6XCJoOm1tIGFcIn0scGx1cmFsQ2F0OmZ1bmN0aW9uKGIpe3JldHVybiAxPT09Yj9cIm9uZVwiOlwib3RoZXJcIn19fX1mdW5jdGlvbiBOYihiKXtiPWIuc3BsaXQoXCIvXCIpO2Zvcih2YXIgYT1iLmxlbmd0aDthLS07KWJbYV09Z2IoYlthXSk7cmV0dXJuIGIuam9pbihcIi9cIil9ZnVuY3Rpb24gQWMoYixhLGMpe2I9c2EoYixjKTthLiQkcHJvdG9jb2w9Yi5wcm90b2NvbDthLiQkaG9zdD1iLmhvc3RuYW1lO2EuJCRwb3J0PVooYi5wb3J0KXx8eGVbYi5wcm90b2NvbF18fG51bGx9XG5mdW5jdGlvbiBCYyhiLGEsYyl7dmFyIGQ9XCIvXCIhPT1iLmNoYXJBdCgwKTtkJiYoYj1cIi9cIitiKTtiPXNhKGIsYyk7YS4kJHBhdGg9ZGVjb2RlVVJJQ29tcG9uZW50KGQmJlwiL1wiPT09Yi5wYXRobmFtZS5jaGFyQXQoMCk/Yi5wYXRobmFtZS5zdWJzdHJpbmcoMSk6Yi5wYXRobmFtZSk7YS4kJHNlYXJjaD1jYyhiLnNlYXJjaCk7YS4kJGhhc2g9ZGVjb2RlVVJJQ29tcG9uZW50KGIuaGFzaCk7YS4kJHBhdGgmJlwiL1wiIT1hLiQkcGF0aC5jaGFyQXQoMCkmJihhLiQkcGF0aD1cIi9cIithLiQkcGF0aCl9ZnVuY3Rpb24gcGEoYixhKXtpZigwPT09YS5pbmRleE9mKGIpKXJldHVybiBhLnN1YnN0cihiLmxlbmd0aCl9ZnVuY3Rpb24gJGEoYil7dmFyIGE9Yi5pbmRleE9mKFwiI1wiKTtyZXR1cm4tMT09YT9iOmIuc3Vic3RyKDAsYSl9ZnVuY3Rpb24gT2IoYil7cmV0dXJuIGIuc3Vic3RyKDAsJGEoYikubGFzdEluZGV4T2YoXCIvXCIpKzEpfWZ1bmN0aW9uIENjKGIsYSl7dGhpcy4kJGh0bWw1PSEwO2E9YXx8XG5cIlwiO3ZhciBjPU9iKGIpO0FjKGIsdGhpcyxiKTt0aGlzLiQkcGFyc2U9ZnVuY3Rpb24oYSl7dmFyIGU9cGEoYyxhKTtpZighQyhlKSl0aHJvdyBQYihcImlwdGhwcmZ4XCIsYSxjKTtCYyhlLHRoaXMsYik7dGhpcy4kJHBhdGh8fCh0aGlzLiQkcGF0aD1cIi9cIik7dGhpcy4kJGNvbXBvc2UoKX07dGhpcy4kJGNvbXBvc2U9ZnVuY3Rpb24oKXt2YXIgYT1CYih0aGlzLiQkc2VhcmNoKSxiPXRoaXMuJCRoYXNoP1wiI1wiK2diKHRoaXMuJCRoYXNoKTpcIlwiO3RoaXMuJCR1cmw9TmIodGhpcy4kJHBhdGgpKyhhP1wiP1wiK2E6XCJcIikrYjt0aGlzLiQkYWJzVXJsPWMrdGhpcy4kJHVybC5zdWJzdHIoMSl9O3RoaXMuJCRyZXdyaXRlPWZ1bmN0aW9uKGQpe3ZhciBlO2lmKChlPXBhKGIsZCkpIT09cylyZXR1cm4gZD1lLChlPXBhKGEsZSkpIT09cz9jKyhwYShcIi9cIixlKXx8ZSk6YitkO2lmKChlPXBhKGMsZCkpIT09cylyZXR1cm4gYytlO2lmKGM9PWQrXCIvXCIpcmV0dXJuIGN9fWZ1bmN0aW9uIFFiKGIsYSl7dmFyIGM9XG5PYihiKTtBYyhiLHRoaXMsYik7dGhpcy4kJHBhcnNlPWZ1bmN0aW9uKGQpe3ZhciBlPXBhKGIsZCl8fHBhKGMsZCksZT1cIiNcIj09ZS5jaGFyQXQoMCk/cGEoYSxlKTp0aGlzLiQkaHRtbDU/ZTpcIlwiO2lmKCFDKGUpKXRocm93IFBiKFwiaWhzaHByZnhcIixkLGEpO0JjKGUsdGhpcyxiKTtkPXRoaXMuJCRwYXRoO3ZhciBnPS9eXFwvW0EtWl06KFxcLy4qKS87MD09PWUuaW5kZXhPZihiKSYmKGU9ZS5yZXBsYWNlKGIsXCJcIikpO2cuZXhlYyhlKXx8KGQ9KGU9Zy5leGVjKGQpKT9lWzFdOmQpO3RoaXMuJCRwYXRoPWQ7dGhpcy4kJGNvbXBvc2UoKX07dGhpcy4kJGNvbXBvc2U9ZnVuY3Rpb24oKXt2YXIgYz1CYih0aGlzLiQkc2VhcmNoKSxlPXRoaXMuJCRoYXNoP1wiI1wiK2diKHRoaXMuJCRoYXNoKTpcIlwiO3RoaXMuJCR1cmw9TmIodGhpcy4kJHBhdGgpKyhjP1wiP1wiK2M6XCJcIikrZTt0aGlzLiQkYWJzVXJsPWIrKHRoaXMuJCR1cmw/YSt0aGlzLiQkdXJsOlwiXCIpfTt0aGlzLiQkcmV3cml0ZT1mdW5jdGlvbihhKXtpZigkYShiKT09XG4kYShhKSlyZXR1cm4gYX19ZnVuY3Rpb24gUmIoYixhKXt0aGlzLiQkaHRtbDU9ITA7UWIuYXBwbHkodGhpcyxhcmd1bWVudHMpO3ZhciBjPU9iKGIpO3RoaXMuJCRyZXdyaXRlPWZ1bmN0aW9uKGQpe3ZhciBlO2lmKGI9PSRhKGQpKXJldHVybiBkO2lmKGU9cGEoYyxkKSlyZXR1cm4gYithK2U7aWYoYz09PWQrXCIvXCIpcmV0dXJuIGN9O3RoaXMuJCRjb21wb3NlPWZ1bmN0aW9uKCl7dmFyIGM9QmIodGhpcy4kJHNlYXJjaCksZT10aGlzLiQkaGFzaD9cIiNcIitnYih0aGlzLiQkaGFzaCk6XCJcIjt0aGlzLiQkdXJsPU5iKHRoaXMuJCRwYXRoKSsoYz9cIj9cIitjOlwiXCIpK2U7dGhpcy4kJGFic1VybD1iK2ErdGhpcy4kJHVybH19ZnVuY3Rpb24gcWIoYil7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIHRoaXNbYl19fWZ1bmN0aW9uIERjKGIsYSl7cmV0dXJuIGZ1bmN0aW9uKGMpe2lmKEQoYykpcmV0dXJuIHRoaXNbYl07dGhpc1tiXT1hKGMpO3RoaXMuJCRjb21wb3NlKCk7cmV0dXJuIHRoaXN9fWZ1bmN0aW9uIFZkKCl7dmFyIGI9XG5cIlwiLGE9ITE7dGhpcy5oYXNoUHJlZml4PWZ1bmN0aW9uKGEpe3JldHVybiBCKGEpPyhiPWEsdGhpcyk6Yn07dGhpcy5odG1sNU1vZGU9ZnVuY3Rpb24oYil7cmV0dXJuIEIoYik/KGE9Yix0aGlzKTphfTt0aGlzLiRnZXQ9W1wiJHJvb3RTY29wZVwiLFwiJGJyb3dzZXJcIixcIiRzbmlmZmVyXCIsXCIkcm9vdEVsZW1lbnRcIixmdW5jdGlvbihjLGQsZSxnKXtmdW5jdGlvbiBmKGEpe2MuJGJyb2FkY2FzdChcIiRsb2NhdGlvbkNoYW5nZVN1Y2Nlc3NcIixrLmFic1VybCgpLGEpfXZhciBrLG0saD1kLmJhc2VIcmVmKCksbD1kLnVybCgpLG47YT8obj1sLnN1YnN0cmluZygwLGwuaW5kZXhPZihcIi9cIixsLmluZGV4T2YoXCIvL1wiKSsyKSkrKGh8fFwiL1wiKSxtPWUuaGlzdG9yeT9DYzpSYik6KG49JGEobCksbT1RYik7az1uZXcgbShuLFwiI1wiK2IpO2suJCRwYXJzZShrLiQkcmV3cml0ZShsKSk7Zy5vbihcImNsaWNrXCIsZnVuY3Rpb24oYSl7aWYoIWEuY3RybEtleSYmIWEubWV0YUtleSYmMiE9YS53aGljaCl7Zm9yKHZhciBlPVxudyhhLnRhcmdldCk7XCJhXCIhPT1MKGVbMF0ubm9kZU5hbWUpOylpZihlWzBdPT09Z1swXXx8IShlPWUucGFyZW50KCkpWzBdKXJldHVybjt2YXIgZj1lLnByb3AoXCJocmVmXCIpO1UoZikmJlwiW29iamVjdCBTVkdBbmltYXRlZFN0cmluZ11cIj09PWYudG9TdHJpbmcoKSYmKGY9c2EoZi5hbmltVmFsKS5ocmVmKTtpZihtPT09UmIpe3ZhciBoPWUuYXR0cihcImhyZWZcIil8fGUuYXR0cihcInhsaW5rOmhyZWZcIik7aWYoMD5oLmluZGV4T2YoXCI6Ly9cIikpaWYoZj1cIiNcIitiLFwiL1wiPT1oWzBdKWY9bitmK2g7ZWxzZSBpZihcIiNcIj09aFswXSlmPW4rZisoay5wYXRoKCl8fFwiL1wiKStoO2Vsc2V7Zm9yKHZhciBsPWsucGF0aCgpLnNwbGl0KFwiL1wiKSxoPWguc3BsaXQoXCIvXCIpLHA9MDtwPGgubGVuZ3RoO3ArKylcIi5cIiE9aFtwXSYmKFwiLi5cIj09aFtwXT9sLnBvcCgpOmhbcF0ubGVuZ3RoJiZsLnB1c2goaFtwXSkpO2Y9bitmK2wuam9pbihcIi9cIil9fWw9ay4kJHJld3JpdGUoZik7ZiYmKCFlLmF0dHIoXCJ0YXJnZXRcIikmJlxubCYmIWEuaXNEZWZhdWx0UHJldmVudGVkKCkpJiYoYS5wcmV2ZW50RGVmYXVsdCgpLGwhPWQudXJsKCkmJihrLiQkcGFyc2UobCksYy4kYXBwbHkoKSxULmFuZ3VsYXJbXCJmZi02ODQyMDgtcHJldmVudERlZmF1bHRcIl09ITApKX19KTtrLmFic1VybCgpIT1sJiZkLnVybChrLmFic1VybCgpLCEwKTtkLm9uVXJsQ2hhbmdlKGZ1bmN0aW9uKGEpe2suYWJzVXJsKCkhPWEmJihjLiRldmFsQXN5bmMoZnVuY3Rpb24oKXt2YXIgYj1rLmFic1VybCgpO2suJCRwYXJzZShhKTtjLiRicm9hZGNhc3QoXCIkbG9jYXRpb25DaGFuZ2VTdGFydFwiLGEsYikuZGVmYXVsdFByZXZlbnRlZD8oay4kJHBhcnNlKGIpLGQudXJsKGIpKTpmKGIpfSksYy4kJHBoYXNlfHxjLiRkaWdlc3QoKSl9KTt2YXIgcD0wO2MuJHdhdGNoKGZ1bmN0aW9uKCl7dmFyIGE9ZC51cmwoKSxiPWsuJCRyZXBsYWNlO3AmJmE9PWsuYWJzVXJsKCl8fChwKyssYy4kZXZhbEFzeW5jKGZ1bmN0aW9uKCl7Yy4kYnJvYWRjYXN0KFwiJGxvY2F0aW9uQ2hhbmdlU3RhcnRcIixcbmsuYWJzVXJsKCksYSkuZGVmYXVsdFByZXZlbnRlZD9rLiQkcGFyc2UoYSk6KGQudXJsKGsuYWJzVXJsKCksYiksZihhKSl9KSk7ay4kJHJlcGxhY2U9ITE7cmV0dXJuIHB9KTtyZXR1cm4ga31dfWZ1bmN0aW9uIFdkKCl7dmFyIGI9ITAsYT10aGlzO3RoaXMuZGVidWdFbmFibGVkPWZ1bmN0aW9uKGEpe3JldHVybiBCKGEpPyhiPWEsdGhpcyk6Yn07dGhpcy4kZ2V0PVtcIiR3aW5kb3dcIixmdW5jdGlvbihjKXtmdW5jdGlvbiBkKGEpe2EgaW5zdGFuY2VvZiBFcnJvciYmKGEuc3RhY2s/YT1hLm1lc3NhZ2UmJi0xPT09YS5zdGFjay5pbmRleE9mKGEubWVzc2FnZSk/XCJFcnJvcjogXCIrYS5tZXNzYWdlK1wiXFxuXCIrYS5zdGFjazphLnN0YWNrOmEuc291cmNlVVJMJiYoYT1hLm1lc3NhZ2UrXCJcXG5cIithLnNvdXJjZVVSTCtcIjpcIithLmxpbmUpKTtyZXR1cm4gYX1mdW5jdGlvbiBlKGEpe3ZhciBiPWMuY29uc29sZXx8e30sZT1iW2FdfHxiLmxvZ3x8eTthPSExO3RyeXthPSEhZS5hcHBseX1jYXRjaChtKXt9cmV0dXJuIGE/XG5mdW5jdGlvbigpe3ZhciBhPVtdO3EoYXJndW1lbnRzLGZ1bmN0aW9uKGIpe2EucHVzaChkKGIpKX0pO3JldHVybiBlLmFwcGx5KGIsYSl9OmZ1bmN0aW9uKGEsYil7ZShhLG51bGw9PWI/XCJcIjpiKX19cmV0dXJue2xvZzplKFwibG9nXCIpLGluZm86ZShcImluZm9cIiksd2FybjplKFwid2FyblwiKSxlcnJvcjplKFwiZXJyb3JcIiksZGVidWc6ZnVuY3Rpb24oKXt2YXIgYz1lKFwiZGVidWdcIik7cmV0dXJuIGZ1bmN0aW9uKCl7YiYmYy5hcHBseShhLGFyZ3VtZW50cyl9fSgpfX1dfWZ1bmN0aW9uIGVhKGIsYSl7aWYoXCJjb25zdHJ1Y3RvclwiPT09Yil0aHJvdyBEYShcImlzZWNmbGRcIixhKTtyZXR1cm4gYn1mdW5jdGlvbiBhYihiLGEpe2lmKGIpe2lmKGIuY29uc3RydWN0b3I9PT1iKXRocm93IERhKFwiaXNlY2ZuXCIsYSk7aWYoYi5kb2N1bWVudCYmYi5sb2NhdGlvbiYmYi5hbGVydCYmYi5zZXRJbnRlcnZhbCl0aHJvdyBEYShcImlzZWN3aW5kb3dcIixhKTtpZihiLmNoaWxkcmVuJiYoYi5ub2RlTmFtZXx8Yi5wcm9wJiZcbmIuYXR0ciYmYi5maW5kKSl0aHJvdyBEYShcImlzZWNkb21cIixhKTt9cmV0dXJuIGJ9ZnVuY3Rpb24gcmIoYixhLGMsZCxlKXtlPWV8fHt9O2E9YS5zcGxpdChcIi5cIik7Zm9yKHZhciBnLGY9MDsxPGEubGVuZ3RoO2YrKyl7Zz1lYShhLnNoaWZ0KCksZCk7dmFyIGs9YltnXTtrfHwoaz17fSxiW2ddPWspO2I9aztiLnRoZW4mJmUudW53cmFwUHJvbWlzZXMmJih0YShkKSxcIiQkdlwiaW4gYnx8ZnVuY3Rpb24oYSl7YS50aGVuKGZ1bmN0aW9uKGIpe2EuJCR2PWJ9KX0oYiksYi4kJHY9PT1zJiYoYi4kJHY9e30pLGI9Yi4kJHYpfWc9ZWEoYS5zaGlmdCgpLGQpO3JldHVybiBiW2ddPWN9ZnVuY3Rpb24gRWMoYixhLGMsZCxlLGcsZil7ZWEoYixnKTtlYShhLGcpO2VhKGMsZyk7ZWEoZCxnKTtlYShlLGcpO3JldHVybiBmLnVud3JhcFByb21pc2VzP2Z1bmN0aW9uKGYsbSl7dmFyIGg9bSYmbS5oYXNPd25Qcm9wZXJ0eShiKT9tOmYsbDtpZihudWxsPT1oKXJldHVybiBoOyhoPWhbYl0pJiZoLnRoZW4mJlxuKHRhKGcpLFwiJCR2XCJpbiBofHwobD1oLGwuJCR2PXMsbC50aGVuKGZ1bmN0aW9uKGEpe2wuJCR2PWF9KSksaD1oLiQkdik7aWYoIWEpcmV0dXJuIGg7aWYobnVsbD09aClyZXR1cm4gczsoaD1oW2FdKSYmaC50aGVuJiYodGEoZyksXCIkJHZcImluIGh8fChsPWgsbC4kJHY9cyxsLnRoZW4oZnVuY3Rpb24oYSl7bC4kJHY9YX0pKSxoPWguJCR2KTtpZighYylyZXR1cm4gaDtpZihudWxsPT1oKXJldHVybiBzOyhoPWhbY10pJiZoLnRoZW4mJih0YShnKSxcIiQkdlwiaW4gaHx8KGw9aCxsLiQkdj1zLGwudGhlbihmdW5jdGlvbihhKXtsLiQkdj1hfSkpLGg9aC4kJHYpO2lmKCFkKXJldHVybiBoO2lmKG51bGw9PWgpcmV0dXJuIHM7KGg9aFtkXSkmJmgudGhlbiYmKHRhKGcpLFwiJCR2XCJpbiBofHwobD1oLGwuJCR2PXMsbC50aGVuKGZ1bmN0aW9uKGEpe2wuJCR2PWF9KSksaD1oLiQkdik7aWYoIWUpcmV0dXJuIGg7aWYobnVsbD09aClyZXR1cm4gczsoaD1oW2VdKSYmaC50aGVuJiYodGEoZyksXCIkJHZcImluXG5ofHwobD1oLGwuJCR2PXMsbC50aGVuKGZ1bmN0aW9uKGEpe2wuJCR2PWF9KSksaD1oLiQkdik7cmV0dXJuIGh9OmZ1bmN0aW9uKGcsZil7dmFyIGg9ZiYmZi5oYXNPd25Qcm9wZXJ0eShiKT9mOmc7aWYobnVsbD09aClyZXR1cm4gaDtoPWhbYl07aWYoIWEpcmV0dXJuIGg7aWYobnVsbD09aClyZXR1cm4gcztoPWhbYV07aWYoIWMpcmV0dXJuIGg7aWYobnVsbD09aClyZXR1cm4gcztoPWhbY107aWYoIWQpcmV0dXJuIGg7aWYobnVsbD09aClyZXR1cm4gcztoPWhbZF07cmV0dXJuIGU/bnVsbD09aD9zOmg9aFtlXTpofX1mdW5jdGlvbiB5ZShiLGEpe2VhKGIsYSk7cmV0dXJuIGZ1bmN0aW9uKGEsZCl7cmV0dXJuIG51bGw9PWE/czooZCYmZC5oYXNPd25Qcm9wZXJ0eShiKT9kOmEpW2JdfX1mdW5jdGlvbiB6ZShiLGEsYyl7ZWEoYixjKTtlYShhLGMpO3JldHVybiBmdW5jdGlvbihjLGUpe2lmKG51bGw9PWMpcmV0dXJuIHM7Yz0oZSYmZS5oYXNPd25Qcm9wZXJ0eShiKT9lOmMpW2JdO3JldHVybiBudWxsPT1cbmM/czpjW2FdfX1mdW5jdGlvbiBGYyhiLGEsYyl7aWYoU2IuaGFzT3duUHJvcGVydHkoYikpcmV0dXJuIFNiW2JdO3ZhciBkPWIuc3BsaXQoXCIuXCIpLGU9ZC5sZW5ndGgsZztpZihhLnVud3JhcFByb21pc2VzfHwxIT09ZSlpZihhLnVud3JhcFByb21pc2VzfHwyIT09ZSlpZihhLmNzcClnPTY+ZT9FYyhkWzBdLGRbMV0sZFsyXSxkWzNdLGRbNF0sYyxhKTpmdW5jdGlvbihiLGcpe3ZhciBmPTAsaztkbyBrPUVjKGRbZisrXSxkW2YrK10sZFtmKytdLGRbZisrXSxkW2YrK10sYyxhKShiLGcpLGc9cyxiPWs7d2hpbGUoZjxlKTtyZXR1cm4ga307ZWxzZXt2YXIgZj1cInZhciBwO1xcblwiO3EoZCxmdW5jdGlvbihiLGQpe2VhKGIsYyk7Zis9XCJpZihzID09IG51bGwpIHJldHVybiB1bmRlZmluZWQ7XFxucz1cIisoZD9cInNcIjonKChrJiZrLmhhc093blByb3BlcnR5KFwiJytiKydcIikpP2s6cyknKSsnW1wiJytiKydcIl07XFxuJysoYS51bndyYXBQcm9taXNlcz8naWYgKHMgJiYgcy50aGVuKSB7XFxuIHB3KFwiJytcbmMucmVwbGFjZSgvKFtcIlxcclxcbl0pL2csXCJcXFxcJDFcIikrJ1wiKTtcXG4gaWYgKCEoXCIkJHZcIiBpbiBzKSkge1xcbiBwPXM7XFxuIHAuJCR2ID0gdW5kZWZpbmVkO1xcbiBwLnRoZW4oZnVuY3Rpb24odikge3AuJCR2PXY7fSk7XFxufVxcbiBzPXMuJCR2XFxufVxcbic6XCJcIil9KTt2YXIgZj1mK1wicmV0dXJuIHM7XCIsaz1uZXcgRnVuY3Rpb24oXCJzXCIsXCJrXCIsXCJwd1wiLGYpO2sudG9TdHJpbmc9JChmKTtnPWEudW53cmFwUHJvbWlzZXM/ZnVuY3Rpb24oYSxiKXtyZXR1cm4gayhhLGIsdGEpfTprfWVsc2UgZz16ZShkWzBdLGRbMV0sYyk7ZWxzZSBnPXllKGRbMF0sYyk7XCJoYXNPd25Qcm9wZXJ0eVwiIT09YiYmKFNiW2JdPWcpO3JldHVybiBnfWZ1bmN0aW9uIFhkKCl7dmFyIGI9e30sYT17Y3NwOiExLHVud3JhcFByb21pc2VzOiExLGxvZ1Byb21pc2VXYXJuaW5nczohMH07dGhpcy51bndyYXBQcm9taXNlcz1mdW5jdGlvbihiKXtyZXR1cm4gQihiKT8oYS51bndyYXBQcm9taXNlcz0hIWIsdGhpcyk6YS51bndyYXBQcm9taXNlc307XG50aGlzLmxvZ1Byb21pc2VXYXJuaW5ncz1mdW5jdGlvbihiKXtyZXR1cm4gQihiKT8oYS5sb2dQcm9taXNlV2FybmluZ3M9Yix0aGlzKTphLmxvZ1Byb21pc2VXYXJuaW5nc307dGhpcy4kZ2V0PVtcIiRmaWx0ZXJcIixcIiRzbmlmZmVyXCIsXCIkbG9nXCIsZnVuY3Rpb24oYyxkLGUpe2EuY3NwPWQuY3NwO3RhPWZ1bmN0aW9uKGIpe2EubG9nUHJvbWlzZVdhcm5pbmdzJiYhR2MuaGFzT3duUHJvcGVydHkoYikmJihHY1tiXT0hMCxlLndhcm4oXCJbJHBhcnNlXSBQcm9taXNlIGZvdW5kIGluIHRoZSBleHByZXNzaW9uIGBcIitiK1wiYC4gQXV0b21hdGljIHVud3JhcHBpbmcgb2YgcHJvbWlzZXMgaW4gQW5ndWxhciBleHByZXNzaW9ucyBpcyBkZXByZWNhdGVkLlwiKSl9O3JldHVybiBmdW5jdGlvbihkKXt2YXIgZTtzd2l0Y2godHlwZW9mIGQpe2Nhc2UgXCJzdHJpbmdcIjppZihiLmhhc093blByb3BlcnR5KGQpKXJldHVybiBiW2RdO2U9bmV3IFRiKGEpO2U9KG5ldyBiYihlLGMsYSkpLnBhcnNlKGQpO1wiaGFzT3duUHJvcGVydHlcIiE9PVxuZCYmKGJbZF09ZSk7cmV0dXJuIGU7Y2FzZSBcImZ1bmN0aW9uXCI6cmV0dXJuIGQ7ZGVmYXVsdDpyZXR1cm4geX19fV19ZnVuY3Rpb24gWmQoKXt0aGlzLiRnZXQ9W1wiJHJvb3RTY29wZVwiLFwiJGV4Y2VwdGlvbkhhbmRsZXJcIixmdW5jdGlvbihiLGEpe3JldHVybiBBZShmdW5jdGlvbihhKXtiLiRldmFsQXN5bmMoYSl9LGEpfV19ZnVuY3Rpb24gQWUoYixhKXtmdW5jdGlvbiBjKGEpe3JldHVybiBhfWZ1bmN0aW9uIGQoYSl7cmV0dXJuIGYoYSl9dmFyIGU9ZnVuY3Rpb24oKXt2YXIgZj1bXSxoLGw7cmV0dXJuIGw9e3Jlc29sdmU6ZnVuY3Rpb24oYSl7aWYoZil7dmFyIGM9ZjtmPXM7aD1nKGEpO2MubGVuZ3RoJiZiKGZ1bmN0aW9uKCl7Zm9yKHZhciBhLGI9MCxkPWMubGVuZ3RoO2I8ZDtiKyspYT1jW2JdLGgudGhlbihhWzBdLGFbMV0sYVsyXSl9KX19LHJlamVjdDpmdW5jdGlvbihhKXtsLnJlc29sdmUoayhhKSl9LG5vdGlmeTpmdW5jdGlvbihhKXtpZihmKXt2YXIgYz1mO2YubGVuZ3RoJiZcbmIoZnVuY3Rpb24oKXtmb3IodmFyIGIsZD0wLGU9Yy5sZW5ndGg7ZDxlO2QrKyliPWNbZF0sYlsyXShhKX0pfX0scHJvbWlzZTp7dGhlbjpmdW5jdGlvbihiLGcsayl7dmFyIGw9ZSgpLEk9ZnVuY3Rpb24oZCl7dHJ5e2wucmVzb2x2ZSgoUShiKT9iOmMpKGQpKX1jYXRjaChlKXtsLnJlamVjdChlKSxhKGUpfX0seD1mdW5jdGlvbihiKXt0cnl7bC5yZXNvbHZlKChRKGcpP2c6ZCkoYikpfWNhdGNoKGMpe2wucmVqZWN0KGMpLGEoYyl9fSx1PWZ1bmN0aW9uKGIpe3RyeXtsLm5vdGlmeSgoUShrKT9rOmMpKGIpKX1jYXRjaChkKXthKGQpfX07Zj9mLnB1c2goW0kseCx1XSk6aC50aGVuKEkseCx1KTtyZXR1cm4gbC5wcm9taXNlfSxcImNhdGNoXCI6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXMudGhlbihudWxsLGEpfSxcImZpbmFsbHlcIjpmdW5jdGlvbihhKXtmdW5jdGlvbiBiKGEsYyl7dmFyIGQ9ZSgpO2M/ZC5yZXNvbHZlKGEpOmQucmVqZWN0KGEpO3JldHVybiBkLnByb21pc2V9ZnVuY3Rpb24gZChlLFxuZyl7dmFyIGY9bnVsbDt0cnl7Zj0oYXx8YykoKX1jYXRjaChrKXtyZXR1cm4gYihrLCExKX1yZXR1cm4gZiYmUShmLnRoZW4pP2YudGhlbihmdW5jdGlvbigpe3JldHVybiBiKGUsZyl9LGZ1bmN0aW9uKGEpe3JldHVybiBiKGEsITEpfSk6YihlLGcpfXJldHVybiB0aGlzLnRoZW4oZnVuY3Rpb24oYSl7cmV0dXJuIGQoYSwhMCl9LGZ1bmN0aW9uKGEpe3JldHVybiBkKGEsITEpfSl9fX19LGc9ZnVuY3Rpb24oYSl7cmV0dXJuIGEmJlEoYS50aGVuKT9hOnt0aGVuOmZ1bmN0aW9uKGMpe3ZhciBkPWUoKTtiKGZ1bmN0aW9uKCl7ZC5yZXNvbHZlKGMoYSkpfSk7cmV0dXJuIGQucHJvbWlzZX19fSxmPWZ1bmN0aW9uKGEpe3ZhciBiPWUoKTtiLnJlamVjdChhKTtyZXR1cm4gYi5wcm9taXNlfSxrPWZ1bmN0aW9uKGMpe3JldHVybnt0aGVuOmZ1bmN0aW9uKGcsZil7dmFyIGs9ZSgpO2IoZnVuY3Rpb24oKXt0cnl7ay5yZXNvbHZlKChRKGYpP2Y6ZCkoYykpfWNhdGNoKGIpe2sucmVqZWN0KGIpLFxuYShiKX19KTtyZXR1cm4gay5wcm9taXNlfX19O3JldHVybntkZWZlcjplLHJlamVjdDpmLHdoZW46ZnVuY3Rpb24oayxoLGwsbil7dmFyIHA9ZSgpLHIsdj1mdW5jdGlvbihiKXt0cnl7cmV0dXJuKFEoaCk/aDpjKShiKX1jYXRjaChkKXtyZXR1cm4gYShkKSxmKGQpfX0sST1mdW5jdGlvbihiKXt0cnl7cmV0dXJuKFEobCk/bDpkKShiKX1jYXRjaChjKXtyZXR1cm4gYShjKSxmKGMpfX0seD1mdW5jdGlvbihiKXt0cnl7cmV0dXJuKFEobik/bjpjKShiKX1jYXRjaChkKXthKGQpfX07YihmdW5jdGlvbigpe2coaykudGhlbihmdW5jdGlvbihhKXtyfHwocj0hMCxwLnJlc29sdmUoZyhhKS50aGVuKHYsSSx4KSkpfSxmdW5jdGlvbihhKXtyfHwocj0hMCxwLnJlc29sdmUoSShhKSkpfSxmdW5jdGlvbihhKXtyfHxwLm5vdGlmeSh4KGEpKX0pfSk7cmV0dXJuIHAucHJvbWlzZX0sYWxsOmZ1bmN0aW9uKGEpe3ZhciBiPWUoKSxjPTAsZD1PKGEpP1tdOnt9O3EoYSxmdW5jdGlvbihhLGUpe2MrKztcbmcoYSkudGhlbihmdW5jdGlvbihhKXtkLmhhc093blByb3BlcnR5KGUpfHwoZFtlXT1hLC0tY3x8Yi5yZXNvbHZlKGQpKX0sZnVuY3Rpb24oYSl7ZC5oYXNPd25Qcm9wZXJ0eShlKXx8Yi5yZWplY3QoYSl9KX0pOzA9PT1jJiZiLnJlc29sdmUoZCk7cmV0dXJuIGIucHJvbWlzZX19fWZ1bmN0aW9uIGZlKCl7dGhpcy4kZ2V0PVtcIiR3aW5kb3dcIixcIiR0aW1lb3V0XCIsZnVuY3Rpb24oYixhKXt2YXIgYz1iLnJlcXVlc3RBbmltYXRpb25GcmFtZXx8Yi53ZWJraXRSZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fGIubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lLGQ9Yi5jYW5jZWxBbmltYXRpb25GcmFtZXx8Yi53ZWJraXRDYW5jZWxBbmltYXRpb25GcmFtZXx8Yi5tb3pDYW5jZWxBbmltYXRpb25GcmFtZXx8Yi53ZWJraXRDYW5jZWxSZXF1ZXN0QW5pbWF0aW9uRnJhbWUsZT0hIWMsZz1lP2Z1bmN0aW9uKGEpe3ZhciBiPWMoYSk7cmV0dXJuIGZ1bmN0aW9uKCl7ZChiKX19OmZ1bmN0aW9uKGIpe3ZhciBjPVxuYShiLDE2LjY2LCExKTtyZXR1cm4gZnVuY3Rpb24oKXthLmNhbmNlbChjKX19O2cuc3VwcG9ydGVkPWU7cmV0dXJuIGd9XX1mdW5jdGlvbiBZZCgpe3ZhciBiPTEwLGE9dChcIiRyb290U2NvcGVcIiksYz1udWxsO3RoaXMuZGlnZXN0VHRsPWZ1bmN0aW9uKGEpe2FyZ3VtZW50cy5sZW5ndGgmJihiPWEpO3JldHVybiBifTt0aGlzLiRnZXQ9W1wiJGluamVjdG9yXCIsXCIkZXhjZXB0aW9uSGFuZGxlclwiLFwiJHBhcnNlXCIsXCIkYnJvd3NlclwiLGZ1bmN0aW9uKGQsZSxnLGYpe2Z1bmN0aW9uIGsoKXt0aGlzLiRpZD1lYigpO3RoaXMuJCRwaGFzZT10aGlzLiRwYXJlbnQ9dGhpcy4kJHdhdGNoZXJzPXRoaXMuJCRuZXh0U2libGluZz10aGlzLiQkcHJldlNpYmxpbmc9dGhpcy4kJGNoaWxkSGVhZD10aGlzLiQkY2hpbGRUYWlsPW51bGw7dGhpc1tcInRoaXNcIl09dGhpcy4kcm9vdD10aGlzO3RoaXMuJCRkZXN0cm95ZWQ9ITE7dGhpcy4kJGFzeW5jUXVldWU9W107dGhpcy4kJHBvc3REaWdlc3RRdWV1ZT1bXTtcbnRoaXMuJCRsaXN0ZW5lcnM9e307dGhpcy4kJGxpc3RlbmVyQ291bnQ9e307dGhpcy4kJGlzb2xhdGVCaW5kaW5ncz17fX1mdW5jdGlvbiBtKGIpe2lmKHAuJCRwaGFzZSl0aHJvdyBhKFwiaW5wcm9nXCIscC4kJHBoYXNlKTtwLiQkcGhhc2U9Yn1mdW5jdGlvbiBoKGEsYil7dmFyIGM9ZyhhKTtUYShjLGIpO3JldHVybiBjfWZ1bmN0aW9uIGwoYSxiLGMpe2RvIGEuJCRsaXN0ZW5lckNvdW50W2NdLT1iLDA9PT1hLiQkbGlzdGVuZXJDb3VudFtjXSYmZGVsZXRlIGEuJCRsaXN0ZW5lckNvdW50W2NdO3doaWxlKGE9YS4kcGFyZW50KX1mdW5jdGlvbiBuKCl7fWsucHJvdG90eXBlPXtjb25zdHJ1Y3RvcjprLCRuZXc6ZnVuY3Rpb24oYSl7YT8oYT1uZXcgayxhLiRyb290PXRoaXMuJHJvb3QsYS4kJGFzeW5jUXVldWU9dGhpcy4kJGFzeW5jUXVldWUsYS4kJHBvc3REaWdlc3RRdWV1ZT10aGlzLiQkcG9zdERpZ2VzdFF1ZXVlKToodGhpcy4kJGNoaWxkU2NvcGVDbGFzc3x8KHRoaXMuJCRjaGlsZFNjb3BlQ2xhc3M9XG5mdW5jdGlvbigpe3RoaXMuJCR3YXRjaGVycz10aGlzLiQkbmV4dFNpYmxpbmc9dGhpcy4kJGNoaWxkSGVhZD10aGlzLiQkY2hpbGRUYWlsPW51bGw7dGhpcy4kJGxpc3RlbmVycz17fTt0aGlzLiQkbGlzdGVuZXJDb3VudD17fTt0aGlzLiRpZD1lYigpO3RoaXMuJCRjaGlsZFNjb3BlQ2xhc3M9bnVsbH0sdGhpcy4kJGNoaWxkU2NvcGVDbGFzcy5wcm90b3R5cGU9dGhpcyksYT1uZXcgdGhpcy4kJGNoaWxkU2NvcGVDbGFzcyk7YVtcInRoaXNcIl09YTthLiRwYXJlbnQ9dGhpczthLiQkcHJldlNpYmxpbmc9dGhpcy4kJGNoaWxkVGFpbDt0aGlzLiQkY2hpbGRIZWFkP3RoaXMuJCRjaGlsZFRhaWw9dGhpcy4kJGNoaWxkVGFpbC4kJG5leHRTaWJsaW5nPWE6dGhpcy4kJGNoaWxkSGVhZD10aGlzLiQkY2hpbGRUYWlsPWE7cmV0dXJuIGF9LCR3YXRjaDpmdW5jdGlvbihhLGIsZCl7dmFyIGU9aChhLFwid2F0Y2hcIiksZz10aGlzLiQkd2F0Y2hlcnMsZj17Zm46YixsYXN0Om4sZ2V0OmUsZXhwOmEsXG5lcTohIWR9O2M9bnVsbDtpZighUShiKSl7dmFyIGs9aChifHx5LFwibGlzdGVuZXJcIik7Zi5mbj1mdW5jdGlvbihhLGIsYyl7ayhjKX19aWYoXCJzdHJpbmdcIj09dHlwZW9mIGEmJmUuY29uc3RhbnQpe3ZhciBtPWYuZm47Zi5mbj1mdW5jdGlvbihhLGIsYyl7bS5jYWxsKHRoaXMsYSxiLGMpO1BhKGcsZil9fWd8fChnPXRoaXMuJCR3YXRjaGVycz1bXSk7Zy51bnNoaWZ0KGYpO3JldHVybiBmdW5jdGlvbigpe1BhKGcsZik7Yz1udWxsfX0sJHdhdGNoQ29sbGVjdGlvbjpmdW5jdGlvbihhLGIpe3ZhciBjPXRoaXMsZCxlLGYsaz0xPGIubGVuZ3RoLGg9MCxtPWcoYSksbD1bXSxuPXt9LHA9ITAscT0wO3JldHVybiB0aGlzLiR3YXRjaChmdW5jdGlvbigpe2Q9bShjKTt2YXIgYSxiO2lmKFUoZCkpaWYoZGIoZCkpZm9yKGUhPT1sJiYoZT1sLHE9ZS5sZW5ndGg9MCxoKyspLGE9ZC5sZW5ndGgscSE9PWEmJihoKyssZS5sZW5ndGg9cT1hKSxiPTA7YjxhO2IrKyllW2JdIT09ZVtiXSYmZFtiXSE9PVxuZFtiXXx8ZVtiXT09PWRbYl18fChoKyssZVtiXT1kW2JdKTtlbHNle2UhPT1uJiYoZT1uPXt9LHE9MCxoKyspO2E9MDtmb3IoYiBpbiBkKWQuaGFzT3duUHJvcGVydHkoYikmJihhKyssZS5oYXNPd25Qcm9wZXJ0eShiKT9lW2JdIT09ZFtiXSYmKGgrKyxlW2JdPWRbYl0pOihxKyssZVtiXT1kW2JdLGgrKykpO2lmKHE+YSlmb3IoYiBpbiBoKyssZSllLmhhc093blByb3BlcnR5KGIpJiYhZC5oYXNPd25Qcm9wZXJ0eShiKSYmKHEtLSxkZWxldGUgZVtiXSl9ZWxzZSBlIT09ZCYmKGU9ZCxoKyspO3JldHVybiBofSxmdW5jdGlvbigpe3A/KHA9ITEsYihkLGQsYykpOmIoZCxmLGMpO2lmKGspaWYoVShkKSlpZihkYihkKSl7Zj1BcnJheShkLmxlbmd0aCk7Zm9yKHZhciBhPTA7YTxkLmxlbmd0aDthKyspZlthXT1kW2FdfWVsc2UgZm9yKGEgaW4gZj17fSxkKXpiLmNhbGwoZCxhKSYmKGZbYV09ZFthXSk7ZWxzZSBmPWR9KX0sJGRpZ2VzdDpmdW5jdGlvbigpe3ZhciBkLGcsZixrLGg9dGhpcy4kJGFzeW5jUXVldWUsXG5sPXRoaXMuJCRwb3N0RGlnZXN0UXVldWUscSx6LHM9YixQLE49W10sdyxFLEE7bShcIiRkaWdlc3RcIik7Yz1udWxsO2Rve3o9ITE7Zm9yKFA9dGhpcztoLmxlbmd0aDspe3RyeXtBPWguc2hpZnQoKSxBLnNjb3BlLiRldmFsKEEuZXhwcmVzc2lvbil9Y2F0Y2goSCl7cC4kJHBoYXNlPW51bGwsZShIKX1jPW51bGx9YTpkb3tpZihrPVAuJCR3YXRjaGVycylmb3IocT1rLmxlbmd0aDtxLS07KXRyeXtpZihkPWtbcV0paWYoKGc9ZC5nZXQoUCkpIT09KGY9ZC5sYXN0KSYmIShkLmVxP3hhKGcsZik6XCJudW1iZXJcIj09dHlwZW9mIGcmJlwibnVtYmVyXCI9PXR5cGVvZiBmJiZpc05hTihnKSYmaXNOYU4oZikpKXo9ITAsYz1kLGQubGFzdD1kLmVxP0dhKGcsbnVsbCk6ZyxkLmZuKGcsZj09PW4/ZzpmLFApLDU+cyYmKHc9NC1zLE5bd118fChOW3ddPVtdKSxFPVEoZC5leHApP1wiZm46IFwiKyhkLmV4cC5uYW1lfHxkLmV4cC50b1N0cmluZygpKTpkLmV4cCxFKz1cIjsgbmV3VmFsOiBcIityYShnKStcIjsgb2xkVmFsOiBcIitcbnJhKGYpLE5bd10ucHVzaChFKSk7ZWxzZSBpZihkPT09Yyl7ej0hMTticmVhayBhfX1jYXRjaChCKXtwLiQkcGhhc2U9bnVsbCxlKEIpfWlmKCEoaz1QLiQkY2hpbGRIZWFkfHxQIT09dGhpcyYmUC4kJG5leHRTaWJsaW5nKSlmb3IoO1AhPT10aGlzJiYhKGs9UC4kJG5leHRTaWJsaW5nKTspUD1QLiRwYXJlbnR9d2hpbGUoUD1rKTtpZigoenx8aC5sZW5ndGgpJiYhcy0tKXRocm93IHAuJCRwaGFzZT1udWxsLGEoXCJpbmZkaWdcIixiLHJhKE4pKTt9d2hpbGUoenx8aC5sZW5ndGgpO2ZvcihwLiQkcGhhc2U9bnVsbDtsLmxlbmd0aDspdHJ5e2wuc2hpZnQoKSgpfWNhdGNoKHQpe2UodCl9fSwkZGVzdHJveTpmdW5jdGlvbigpe2lmKCF0aGlzLiQkZGVzdHJveWVkKXt2YXIgYT10aGlzLiRwYXJlbnQ7dGhpcy4kYnJvYWRjYXN0KFwiJGRlc3Ryb3lcIik7dGhpcy4kJGRlc3Ryb3llZD0hMDt0aGlzIT09cCYmKHEodGhpcy4kJGxpc3RlbmVyQ291bnQsQWIobnVsbCxsLHRoaXMpKSxhLiQkY2hpbGRIZWFkPT1cbnRoaXMmJihhLiQkY2hpbGRIZWFkPXRoaXMuJCRuZXh0U2libGluZyksYS4kJGNoaWxkVGFpbD09dGhpcyYmKGEuJCRjaGlsZFRhaWw9dGhpcy4kJHByZXZTaWJsaW5nKSx0aGlzLiQkcHJldlNpYmxpbmcmJih0aGlzLiQkcHJldlNpYmxpbmcuJCRuZXh0U2libGluZz10aGlzLiQkbmV4dFNpYmxpbmcpLHRoaXMuJCRuZXh0U2libGluZyYmKHRoaXMuJCRuZXh0U2libGluZy4kJHByZXZTaWJsaW5nPXRoaXMuJCRwcmV2U2libGluZyksdGhpcy4kcGFyZW50PXRoaXMuJCRuZXh0U2libGluZz10aGlzLiQkcHJldlNpYmxpbmc9dGhpcy4kJGNoaWxkSGVhZD10aGlzLiQkY2hpbGRUYWlsPXRoaXMuJHJvb3Q9bnVsbCx0aGlzLiQkbGlzdGVuZXJzPXt9LHRoaXMuJCR3YXRjaGVycz10aGlzLiQkYXN5bmNRdWV1ZT10aGlzLiQkcG9zdERpZ2VzdFF1ZXVlPVtdLHRoaXMuJGRlc3Ryb3k9dGhpcy4kZGlnZXN0PXRoaXMuJGFwcGx5PXksdGhpcy4kb249dGhpcy4kd2F0Y2g9ZnVuY3Rpb24oKXtyZXR1cm4geX0pfX0sXG4kZXZhbDpmdW5jdGlvbihhLGIpe3JldHVybiBnKGEpKHRoaXMsYil9LCRldmFsQXN5bmM6ZnVuY3Rpb24oYSl7cC4kJHBoYXNlfHxwLiQkYXN5bmNRdWV1ZS5sZW5ndGh8fGYuZGVmZXIoZnVuY3Rpb24oKXtwLiQkYXN5bmNRdWV1ZS5sZW5ndGgmJnAuJGRpZ2VzdCgpfSk7dGhpcy4kJGFzeW5jUXVldWUucHVzaCh7c2NvcGU6dGhpcyxleHByZXNzaW9uOmF9KX0sJCRwb3N0RGlnZXN0OmZ1bmN0aW9uKGEpe3RoaXMuJCRwb3N0RGlnZXN0UXVldWUucHVzaChhKX0sJGFwcGx5OmZ1bmN0aW9uKGEpe3RyeXtyZXR1cm4gbShcIiRhcHBseVwiKSx0aGlzLiRldmFsKGEpfWNhdGNoKGIpe2UoYil9ZmluYWxseXtwLiQkcGhhc2U9bnVsbDt0cnl7cC4kZGlnZXN0KCl9Y2F0Y2goYyl7dGhyb3cgZShjKSxjO319fSwkb246ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzLiQkbGlzdGVuZXJzW2FdO2N8fCh0aGlzLiQkbGlzdGVuZXJzW2FdPWM9W10pO2MucHVzaChiKTt2YXIgZD10aGlzO2RvIGQuJCRsaXN0ZW5lckNvdW50W2FdfHxcbihkLiQkbGlzdGVuZXJDb3VudFthXT0wKSxkLiQkbGlzdGVuZXJDb3VudFthXSsrO3doaWxlKGQ9ZC4kcGFyZW50KTt2YXIgZT10aGlzO3JldHVybiBmdW5jdGlvbigpe2NbT2EoYyxiKV09bnVsbDtsKGUsMSxhKX19LCRlbWl0OmZ1bmN0aW9uKGEsYil7dmFyIGM9W10sZCxnPXRoaXMsZj0hMSxrPXtuYW1lOmEsdGFyZ2V0U2NvcGU6ZyxzdG9wUHJvcGFnYXRpb246ZnVuY3Rpb24oKXtmPSEwfSxwcmV2ZW50RGVmYXVsdDpmdW5jdGlvbigpe2suZGVmYXVsdFByZXZlbnRlZD0hMH0sZGVmYXVsdFByZXZlbnRlZDohMX0saD1ba10uY29uY2F0KHlhLmNhbGwoYXJndW1lbnRzLDEpKSxtLGw7ZG97ZD1nLiQkbGlzdGVuZXJzW2FdfHxjO2suY3VycmVudFNjb3BlPWc7bT0wO2ZvcihsPWQubGVuZ3RoO208bDttKyspaWYoZFttXSl0cnl7ZFttXS5hcHBseShudWxsLGgpfWNhdGNoKG4pe2Uobil9ZWxzZSBkLnNwbGljZShtLDEpLG0tLSxsLS07aWYoZilicmVhaztnPWcuJHBhcmVudH13aGlsZShnKTtcbnJldHVybiBrfSwkYnJvYWRjYXN0OmZ1bmN0aW9uKGEsYil7Zm9yKHZhciBjPXRoaXMsZD10aGlzLGc9e25hbWU6YSx0YXJnZXRTY29wZTp0aGlzLHByZXZlbnREZWZhdWx0OmZ1bmN0aW9uKCl7Zy5kZWZhdWx0UHJldmVudGVkPSEwfSxkZWZhdWx0UHJldmVudGVkOiExfSxmPVtnXS5jb25jYXQoeWEuY2FsbChhcmd1bWVudHMsMSkpLGssaDtjPWQ7KXtnLmN1cnJlbnRTY29wZT1jO2Q9Yy4kJGxpc3RlbmVyc1thXXx8W107az0wO2ZvcihoPWQubGVuZ3RoO2s8aDtrKyspaWYoZFtrXSl0cnl7ZFtrXS5hcHBseShudWxsLGYpfWNhdGNoKG0pe2UobSl9ZWxzZSBkLnNwbGljZShrLDEpLGstLSxoLS07aWYoIShkPWMuJCRsaXN0ZW5lckNvdW50W2FdJiZjLiQkY2hpbGRIZWFkfHxjIT09dGhpcyYmYy4kJG5leHRTaWJsaW5nKSlmb3IoO2MhPT10aGlzJiYhKGQ9Yy4kJG5leHRTaWJsaW5nKTspYz1jLiRwYXJlbnR9cmV0dXJuIGd9fTt2YXIgcD1uZXcgaztyZXR1cm4gcH1dfWZ1bmN0aW9uIGJkKCl7dmFyIGI9XG4vXlxccyooaHR0cHM/fGZ0cHxtYWlsdG98dGVsfGZpbGUpOi8sYT0vXlxccyooaHR0cHM/fGZ0cHxmaWxlKTp8ZGF0YTppbWFnZVxcLy87dGhpcy5hSHJlZlNhbml0aXphdGlvbldoaXRlbGlzdD1mdW5jdGlvbihhKXtyZXR1cm4gQihhKT8oYj1hLHRoaXMpOmJ9O3RoaXMuaW1nU3JjU2FuaXRpemF0aW9uV2hpdGVsaXN0PWZ1bmN0aW9uKGIpe3JldHVybiBCKGIpPyhhPWIsdGhpcyk6YX07dGhpcy4kZ2V0PWZ1bmN0aW9uKCl7cmV0dXJuIGZ1bmN0aW9uKGMsZCl7dmFyIGU9ZD9hOmIsZztpZighU3x8ODw9UylpZihnPXNhKGMpLmhyZWYsXCJcIiE9PWcmJiFnLm1hdGNoKGUpKXJldHVyblwidW5zYWZlOlwiK2c7cmV0dXJuIGN9fX1mdW5jdGlvbiBCZShiKXtpZihcInNlbGZcIj09PWIpcmV0dXJuIGI7aWYoQyhiKSl7aWYoLTE8Yi5pbmRleE9mKFwiKioqXCIpKXRocm93IHVhKFwiaXdjYXJkXCIsYik7Yj1iLnJlcGxhY2UoLyhbLSgpXFxbXFxde30rPyouJFxcXnwsOiM8IVxcXFxdKS9nLFwiXFxcXCQxXCIpLnJlcGxhY2UoL1xceDA4L2csXG5cIlxcXFx4MDhcIikucmVwbGFjZShcIlxcXFwqXFxcXCpcIixcIi4qXCIpLnJlcGxhY2UoXCJcXFxcKlwiLFwiW146Ly4/JjtdKlwiKTtyZXR1cm4gUmVnRXhwKFwiXlwiK2IrXCIkXCIpfWlmKGZiKGIpKXJldHVybiBSZWdFeHAoXCJeXCIrYi5zb3VyY2UrXCIkXCIpO3Rocm93IHVhKFwiaW1hdGNoZXJcIik7fWZ1bmN0aW9uIEhjKGIpe3ZhciBhPVtdO0IoYikmJnEoYixmdW5jdGlvbihiKXthLnB1c2goQmUoYikpfSk7cmV0dXJuIGF9ZnVuY3Rpb24gYWUoKXt0aGlzLlNDRV9DT05URVhUUz1mYTt2YXIgYj1bXCJzZWxmXCJdLGE9W107dGhpcy5yZXNvdXJjZVVybFdoaXRlbGlzdD1mdW5jdGlvbihhKXthcmd1bWVudHMubGVuZ3RoJiYoYj1IYyhhKSk7cmV0dXJuIGJ9O3RoaXMucmVzb3VyY2VVcmxCbGFja2xpc3Q9ZnVuY3Rpb24oYil7YXJndW1lbnRzLmxlbmd0aCYmKGE9SGMoYikpO3JldHVybiBhfTt0aGlzLiRnZXQ9W1wiJGluamVjdG9yXCIsZnVuY3Rpb24oYyl7ZnVuY3Rpb24gZChhKXt2YXIgYj1mdW5jdGlvbihhKXt0aGlzLiQkdW53cmFwVHJ1c3RlZFZhbHVlPVxuZnVuY3Rpb24oKXtyZXR1cm4gYX19O2EmJihiLnByb3RvdHlwZT1uZXcgYSk7Yi5wcm90b3R5cGUudmFsdWVPZj1mdW5jdGlvbigpe3JldHVybiB0aGlzLiQkdW53cmFwVHJ1c3RlZFZhbHVlKCl9O2IucHJvdG90eXBlLnRvU3RyaW5nPWZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuJCR1bndyYXBUcnVzdGVkVmFsdWUoKS50b1N0cmluZygpfTtyZXR1cm4gYn12YXIgZT1mdW5jdGlvbihhKXt0aHJvdyB1YShcInVuc2FmZVwiKTt9O2MuaGFzKFwiJHNhbml0aXplXCIpJiYoZT1jLmdldChcIiRzYW5pdGl6ZVwiKSk7dmFyIGc9ZCgpLGY9e307ZltmYS5IVE1MXT1kKGcpO2ZbZmEuQ1NTXT1kKGcpO2ZbZmEuVVJMXT1kKGcpO2ZbZmEuSlNdPWQoZyk7ZltmYS5SRVNPVVJDRV9VUkxdPWQoZltmYS5VUkxdKTtyZXR1cm57dHJ1c3RBczpmdW5jdGlvbihhLGIpe3ZhciBjPWYuaGFzT3duUHJvcGVydHkoYSk/ZlthXTpudWxsO2lmKCFjKXRocm93IHVhKFwiaWNvbnRleHRcIixhLGIpO2lmKG51bGw9PT1ifHxiPT09XG5zfHxcIlwiPT09YilyZXR1cm4gYjtpZihcInN0cmluZ1wiIT09dHlwZW9mIGIpdGhyb3cgdWEoXCJpdHlwZVwiLGEpO3JldHVybiBuZXcgYyhiKX0sZ2V0VHJ1c3RlZDpmdW5jdGlvbihjLGQpe2lmKG51bGw9PT1kfHxkPT09c3x8XCJcIj09PWQpcmV0dXJuIGQ7dmFyIGc9Zi5oYXNPd25Qcm9wZXJ0eShjKT9mW2NdOm51bGw7aWYoZyYmZCBpbnN0YW5jZW9mIGcpcmV0dXJuIGQuJCR1bndyYXBUcnVzdGVkVmFsdWUoKTtpZihjPT09ZmEuUkVTT1VSQ0VfVVJMKXt2YXIgZz1zYShkLnRvU3RyaW5nKCkpLGwsbixwPSExO2w9MDtmb3Iobj1iLmxlbmd0aDtsPG47bCsrKWlmKFwic2VsZlwiPT09YltsXT9NYihnKTpiW2xdLmV4ZWMoZy5ocmVmKSl7cD0hMDticmVha31pZihwKWZvcihsPTAsbj1hLmxlbmd0aDtsPG47bCsrKWlmKFwic2VsZlwiPT09YVtsXT9NYihnKTphW2xdLmV4ZWMoZy5ocmVmKSl7cD0hMTticmVha31pZihwKXJldHVybiBkO3Rocm93IHVhKFwiaW5zZWN1cmxcIixkLnRvU3RyaW5nKCkpO31pZihjPT09XG5mYS5IVE1MKXJldHVybiBlKGQpO3Rocm93IHVhKFwidW5zYWZlXCIpO30sdmFsdWVPZjpmdW5jdGlvbihhKXtyZXR1cm4gYSBpbnN0YW5jZW9mIGc/YS4kJHVud3JhcFRydXN0ZWRWYWx1ZSgpOmF9fX1dfWZ1bmN0aW9uICRkKCl7dmFyIGI9ITA7dGhpcy5lbmFibGVkPWZ1bmN0aW9uKGEpe2FyZ3VtZW50cy5sZW5ndGgmJihiPSEhYSk7cmV0dXJuIGJ9O3RoaXMuJGdldD1bXCIkcGFyc2VcIixcIiRzbmlmZmVyXCIsXCIkc2NlRGVsZWdhdGVcIixmdW5jdGlvbihhLGMsZCl7aWYoYiYmYy5tc2llJiY4PmMubXNpZURvY3VtZW50TW9kZSl0aHJvdyB1YShcImllcXVpcmtzXCIpO3ZhciBlPWthKGZhKTtlLmlzRW5hYmxlZD1mdW5jdGlvbigpe3JldHVybiBifTtlLnRydXN0QXM9ZC50cnVzdEFzO2UuZ2V0VHJ1c3RlZD1kLmdldFRydXN0ZWQ7ZS52YWx1ZU9mPWQudmFsdWVPZjtifHwoZS50cnVzdEFzPWUuZ2V0VHJ1c3RlZD1mdW5jdGlvbihhLGIpe3JldHVybiBifSxlLnZhbHVlT2Y9RmEpO2UucGFyc2VBcz1cbmZ1bmN0aW9uKGIsYyl7dmFyIGQ9YShjKTtyZXR1cm4gZC5saXRlcmFsJiZkLmNvbnN0YW50P2Q6ZnVuY3Rpb24oYSxjKXtyZXR1cm4gZS5nZXRUcnVzdGVkKGIsZChhLGMpKX19O3ZhciBnPWUucGFyc2VBcyxmPWUuZ2V0VHJ1c3RlZCxrPWUudHJ1c3RBcztxKGZhLGZ1bmN0aW9uKGEsYil7dmFyIGM9TChiKTtlW1ZhKFwicGFyc2VfYXNfXCIrYyldPWZ1bmN0aW9uKGIpe3JldHVybiBnKGEsYil9O2VbVmEoXCJnZXRfdHJ1c3RlZF9cIitjKV09ZnVuY3Rpb24oYil7cmV0dXJuIGYoYSxiKX07ZVtWYShcInRydXN0X2FzX1wiK2MpXT1mdW5jdGlvbihiKXtyZXR1cm4gayhhLGIpfX0pO3JldHVybiBlfV19ZnVuY3Rpb24gYmUoKXt0aGlzLiRnZXQ9W1wiJHdpbmRvd1wiLFwiJGRvY3VtZW50XCIsZnVuY3Rpb24oYixhKXt2YXIgYz17fSxkPVooKC9hbmRyb2lkIChcXGQrKS8uZXhlYyhMKChiLm5hdmlnYXRvcnx8e30pLnVzZXJBZ2VudCkpfHxbXSlbMV0pLGU9L0JveGVlL2kudGVzdCgoYi5uYXZpZ2F0b3J8fFxue30pLnVzZXJBZ2VudCksZz1hWzBdfHx7fSxmPWcuZG9jdW1lbnRNb2RlLGssbT0vXihNb3p8d2Via2l0fE98bXMpKD89W0EtWl0pLyxoPWcuYm9keSYmZy5ib2R5LnN0eWxlLGw9ITEsbj0hMTtpZihoKXtmb3IodmFyIHAgaW4gaClpZihsPW0uZXhlYyhwKSl7az1sWzBdO2s9ay5zdWJzdHIoMCwxKS50b1VwcGVyQ2FzZSgpK2suc3Vic3RyKDEpO2JyZWFrfWt8fChrPVwiV2Via2l0T3BhY2l0eVwiaW4gaCYmXCJ3ZWJraXRcIik7bD0hIShcInRyYW5zaXRpb25cImluIGh8fGsrXCJUcmFuc2l0aW9uXCJpbiBoKTtuPSEhKFwiYW5pbWF0aW9uXCJpbiBofHxrK1wiQW5pbWF0aW9uXCJpbiBoKTshZHx8bCYmbnx8KGw9QyhnLmJvZHkuc3R5bGUud2Via2l0VHJhbnNpdGlvbiksbj1DKGcuYm9keS5zdHlsZS53ZWJraXRBbmltYXRpb24pKX1yZXR1cm57aGlzdG9yeTohKCFiLmhpc3Rvcnl8fCFiLmhpc3RvcnkucHVzaFN0YXRlfHw0PmR8fGUpLGhhc2hjaGFuZ2U6XCJvbmhhc2hjaGFuZ2VcImluIGImJighZnx8NzxcbmYpLGhhc0V2ZW50OmZ1bmN0aW9uKGEpe2lmKFwiaW5wdXRcIj09YSYmOT09UylyZXR1cm4hMTtpZihEKGNbYV0pKXt2YXIgYj1nLmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7Y1thXT1cIm9uXCIrYSBpbiBifXJldHVybiBjW2FdfSxjc3A6JGIoKSx2ZW5kb3JQcmVmaXg6ayx0cmFuc2l0aW9uczpsLGFuaW1hdGlvbnM6bixhbmRyb2lkOmQsbXNpZTpTLG1zaWVEb2N1bWVudE1vZGU6Zn19XX1mdW5jdGlvbiBkZSgpe3RoaXMuJGdldD1bXCIkcm9vdFNjb3BlXCIsXCIkYnJvd3NlclwiLFwiJHFcIixcIiRleGNlcHRpb25IYW5kbGVyXCIsZnVuY3Rpb24oYixhLGMsZCl7ZnVuY3Rpb24gZShlLGssbSl7dmFyIGg9Yy5kZWZlcigpLGw9aC5wcm9taXNlLG49QihtKSYmIW07az1hLmRlZmVyKGZ1bmN0aW9uKCl7dHJ5e2gucmVzb2x2ZShlKCkpfWNhdGNoKGEpe2gucmVqZWN0KGEpLGQoYSl9ZmluYWxseXtkZWxldGUgZ1tsLiQkdGltZW91dElkXX1ufHxiLiRhcHBseSgpfSxrKTtsLiQkdGltZW91dElkPWs7Z1trXT1oO1xucmV0dXJuIGx9dmFyIGc9e307ZS5jYW5jZWw9ZnVuY3Rpb24oYil7cmV0dXJuIGImJmIuJCR0aW1lb3V0SWQgaW4gZz8oZ1tiLiQkdGltZW91dElkXS5yZWplY3QoXCJjYW5jZWxlZFwiKSxkZWxldGUgZ1tiLiQkdGltZW91dElkXSxhLmRlZmVyLmNhbmNlbChiLiQkdGltZW91dElkKSk6ITF9O3JldHVybiBlfV19ZnVuY3Rpb24gc2EoYixhKXt2YXIgYz1iO1MmJihXLnNldEF0dHJpYnV0ZShcImhyZWZcIixjKSxjPVcuaHJlZik7Vy5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsYyk7cmV0dXJue2hyZWY6Vy5ocmVmLHByb3RvY29sOlcucHJvdG9jb2w/Vy5wcm90b2NvbC5yZXBsYWNlKC86JC8sXCJcIik6XCJcIixob3N0OlcuaG9zdCxzZWFyY2g6Vy5zZWFyY2g/Vy5zZWFyY2gucmVwbGFjZSgvXlxcPy8sXCJcIik6XCJcIixoYXNoOlcuaGFzaD9XLmhhc2gucmVwbGFjZSgvXiMvLFwiXCIpOlwiXCIsaG9zdG5hbWU6Vy5ob3N0bmFtZSxwb3J0OlcucG9ydCxwYXRobmFtZTpcIi9cIj09PVcucGF0aG5hbWUuY2hhckF0KDApP1cucGF0aG5hbWU6XG5cIi9cIitXLnBhdGhuYW1lfX1mdW5jdGlvbiBNYihiKXtiPUMoYik/c2EoYik6YjtyZXR1cm4gYi5wcm90b2NvbD09PUljLnByb3RvY29sJiZiLmhvc3Q9PT1JYy5ob3N0fWZ1bmN0aW9uIGVlKCl7dGhpcy4kZ2V0PSQoVCl9ZnVuY3Rpb24ga2MoYil7ZnVuY3Rpb24gYShkLGUpe2lmKFUoZCkpe3ZhciBnPXt9O3EoZCxmdW5jdGlvbihiLGMpe2dbY109YShjLGIpfSk7cmV0dXJuIGd9cmV0dXJuIGIuZmFjdG9yeShkK2MsZSl9dmFyIGM9XCJGaWx0ZXJcIjt0aGlzLnJlZ2lzdGVyPWE7dGhpcy4kZ2V0PVtcIiRpbmplY3RvclwiLGZ1bmN0aW9uKGEpe3JldHVybiBmdW5jdGlvbihiKXtyZXR1cm4gYS5nZXQoYitjKX19XTthKFwiY3VycmVuY3lcIixKYyk7YShcImRhdGVcIixLYyk7YShcImZpbHRlclwiLENlKTthKFwianNvblwiLERlKTthKFwibGltaXRUb1wiLEVlKTthKFwibG93ZXJjYXNlXCIsRmUpO2EoXCJudW1iZXJcIixMYyk7YShcIm9yZGVyQnlcIixNYyk7YShcInVwcGVyY2FzZVwiLEdlKX1mdW5jdGlvbiBDZSgpe3JldHVybiBmdW5jdGlvbihiLFxuYSxjKXtpZighTyhiKSlyZXR1cm4gYjt2YXIgZD10eXBlb2YgYyxlPVtdO2UuY2hlY2s9ZnVuY3Rpb24oYSl7Zm9yKHZhciBiPTA7YjxlLmxlbmd0aDtiKyspaWYoIWVbYl0oYSkpcmV0dXJuITE7cmV0dXJuITB9O1wiZnVuY3Rpb25cIiE9PWQmJihjPVwiYm9vbGVhblwiPT09ZCYmYz9mdW5jdGlvbihhLGIpe3JldHVybiBTYS5lcXVhbHMoYSxiKX06ZnVuY3Rpb24oYSxiKXtpZihhJiZiJiZcIm9iamVjdFwiPT09dHlwZW9mIGEmJlwib2JqZWN0XCI9PT10eXBlb2YgYil7Zm9yKHZhciBkIGluIGEpaWYoXCIkXCIhPT1kLmNoYXJBdCgwKSYmemIuY2FsbChhLGQpJiZjKGFbZF0sYltkXSkpcmV0dXJuITA7cmV0dXJuITF9Yj0oXCJcIitiKS50b0xvd2VyQ2FzZSgpO3JldHVybi0xPChcIlwiK2EpLnRvTG93ZXJDYXNlKCkuaW5kZXhPZihiKX0pO3ZhciBnPWZ1bmN0aW9uKGEsYil7aWYoXCJzdHJpbmdcIj09dHlwZW9mIGImJlwiIVwiPT09Yi5jaGFyQXQoMCkpcmV0dXJuIWcoYSxiLnN1YnN0cigxKSk7c3dpdGNoKHR5cGVvZiBhKXtjYXNlIFwiYm9vbGVhblwiOmNhc2UgXCJudW1iZXJcIjpjYXNlIFwic3RyaW5nXCI6cmV0dXJuIGMoYSxcbmIpO2Nhc2UgXCJvYmplY3RcIjpzd2l0Y2godHlwZW9mIGIpe2Nhc2UgXCJvYmplY3RcIjpyZXR1cm4gYyhhLGIpO2RlZmF1bHQ6Zm9yKHZhciBkIGluIGEpaWYoXCIkXCIhPT1kLmNoYXJBdCgwKSYmZyhhW2RdLGIpKXJldHVybiEwfXJldHVybiExO2Nhc2UgXCJhcnJheVwiOmZvcihkPTA7ZDxhLmxlbmd0aDtkKyspaWYoZyhhW2RdLGIpKXJldHVybiEwO3JldHVybiExO2RlZmF1bHQ6cmV0dXJuITF9fTtzd2l0Y2godHlwZW9mIGEpe2Nhc2UgXCJib29sZWFuXCI6Y2FzZSBcIm51bWJlclwiOmNhc2UgXCJzdHJpbmdcIjphPXskOmF9O2Nhc2UgXCJvYmplY3RcIjpmb3IodmFyIGYgaW4gYSkoZnVuY3Rpb24oYil7XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGFbYl0mJmUucHVzaChmdW5jdGlvbihjKXtyZXR1cm4gZyhcIiRcIj09Yj9jOmMmJmNbYl0sYVtiXSl9KX0pKGYpO2JyZWFrO2Nhc2UgXCJmdW5jdGlvblwiOmUucHVzaChhKTticmVhaztkZWZhdWx0OnJldHVybiBifWQ9W107Zm9yKGY9MDtmPGIubGVuZ3RoO2YrKyl7dmFyIGs9XG5iW2ZdO2UuY2hlY2soaykmJmQucHVzaChrKX1yZXR1cm4gZH19ZnVuY3Rpb24gSmMoYil7dmFyIGE9Yi5OVU1CRVJfRk9STUFUUztyZXR1cm4gZnVuY3Rpb24oYixkKXtEKGQpJiYoZD1hLkNVUlJFTkNZX1NZTSk7cmV0dXJuIE5jKGIsYS5QQVRURVJOU1sxXSxhLkdST1VQX1NFUCxhLkRFQ0lNQUxfU0VQLDIpLnJlcGxhY2UoL1xcdTAwQTQvZyxkKX19ZnVuY3Rpb24gTGMoYil7dmFyIGE9Yi5OVU1CRVJfRk9STUFUUztyZXR1cm4gZnVuY3Rpb24oYixkKXtyZXR1cm4gTmMoYixhLlBBVFRFUk5TWzBdLGEuR1JPVVBfU0VQLGEuREVDSU1BTF9TRVAsZCl9fWZ1bmN0aW9uIE5jKGIsYSxjLGQsZSl7aWYobnVsbD09Ynx8IWlzRmluaXRlKGIpfHxVKGIpKXJldHVyblwiXCI7dmFyIGc9MD5iO2I9TWF0aC5hYnMoYik7dmFyIGY9YitcIlwiLGs9XCJcIixtPVtdLGg9ITE7aWYoLTEhPT1mLmluZGV4T2YoXCJlXCIpKXt2YXIgbD1mLm1hdGNoKC8oW1xcZFxcLl0rKWUoLT8pKFxcZCspLyk7bCYmXCItXCI9PWxbMl0mJlxubFszXT5lKzE/Zj1cIjBcIjooaz1mLGg9ITApfWlmKGgpMDxlJiYoLTE8YiYmMT5iKSYmKGs9Yi50b0ZpeGVkKGUpKTtlbHNle2Y9KGYuc3BsaXQoT2MpWzFdfHxcIlwiKS5sZW5ndGg7RChlKSYmKGU9TWF0aC5taW4oTWF0aC5tYXgoYS5taW5GcmFjLGYpLGEubWF4RnJhYykpO2Y9TWF0aC5wb3coMTAsZSsxKTtiPU1hdGguZmxvb3IoYipmKzUpL2Y7Yj0oXCJcIitiKS5zcGxpdChPYyk7Zj1iWzBdO2I9YlsxXXx8XCJcIjt2YXIgbD0wLG49YS5sZ1NpemUscD1hLmdTaXplO2lmKGYubGVuZ3RoPj1uK3ApZm9yKGw9Zi5sZW5ndGgtbixoPTA7aDxsO2grKykwPT09KGwtaCklcCYmMCE9PWgmJihrKz1jKSxrKz1mLmNoYXJBdChoKTtmb3IoaD1sO2g8Zi5sZW5ndGg7aCsrKTA9PT0oZi5sZW5ndGgtaCklbiYmMCE9PWgmJihrKz1jKSxrKz1mLmNoYXJBdChoKTtmb3IoO2IubGVuZ3RoPGU7KWIrPVwiMFwiO2UmJlwiMFwiIT09ZSYmKGsrPWQrYi5zdWJzdHIoMCxlKSl9bS5wdXNoKGc/YS5uZWdQcmU6YS5wb3NQcmUpO1xubS5wdXNoKGspO20ucHVzaChnP2EubmVnU3VmOmEucG9zU3VmKTtyZXR1cm4gbS5qb2luKFwiXCIpfWZ1bmN0aW9uIFViKGIsYSxjKXt2YXIgZD1cIlwiOzA+YiYmKGQ9XCItXCIsYj0tYik7Zm9yKGI9XCJcIitiO2IubGVuZ3RoPGE7KWI9XCIwXCIrYjtjJiYoYj1iLnN1YnN0cihiLmxlbmd0aC1hKSk7cmV0dXJuIGQrYn1mdW5jdGlvbiBZKGIsYSxjLGQpe2M9Y3x8MDtyZXR1cm4gZnVuY3Rpb24oZSl7ZT1lW1wiZ2V0XCIrYl0oKTtpZigwPGN8fGU+LWMpZSs9YzswPT09ZSYmLTEyPT1jJiYoZT0xMik7cmV0dXJuIFViKGUsYSxkKX19ZnVuY3Rpb24gc2IoYixhKXtyZXR1cm4gZnVuY3Rpb24oYyxkKXt2YXIgZT1jW1wiZ2V0XCIrYl0oKSxnPUhhKGE/XCJTSE9SVFwiK2I6Yik7cmV0dXJuIGRbZ11bZV19fWZ1bmN0aW9uIEtjKGIpe2Z1bmN0aW9uIGEoYSl7dmFyIGI7aWYoYj1hLm1hdGNoKGMpKXthPW5ldyBEYXRlKDApO3ZhciBnPTAsZj0wLGs9Yls4XT9hLnNldFVUQ0Z1bGxZZWFyOmEuc2V0RnVsbFllYXIsbT1cbmJbOF0/YS5zZXRVVENIb3VyczphLnNldEhvdXJzO2JbOV0mJihnPVooYls5XStiWzEwXSksZj1aKGJbOV0rYlsxMV0pKTtrLmNhbGwoYSxaKGJbMV0pLFooYlsyXSktMSxaKGJbM10pKTtnPVooYls0XXx8MCktZztmPVooYls1XXx8MCktZjtrPVooYls2XXx8MCk7Yj1NYXRoLnJvdW5kKDFFMypwYXJzZUZsb2F0KFwiMC5cIisoYls3XXx8MCkpKTttLmNhbGwoYSxnLGYsayxiKX1yZXR1cm4gYX12YXIgYz0vXihcXGR7NH0pLT8oXFxkXFxkKS0/KFxcZFxcZCkoPzpUKFxcZFxcZCkoPzo6PyhcXGRcXGQpKD86Oj8oXFxkXFxkKSg/OlxcLihcXGQrKSk/KT8pPyhafChbKy1dKShcXGRcXGQpOj8oXFxkXFxkKSk/KT8kLztyZXR1cm4gZnVuY3Rpb24oYyxlKXt2YXIgZz1cIlwiLGY9W10sayxtO2U9ZXx8XCJtZWRpdW1EYXRlXCI7ZT1iLkRBVEVUSU1FX0ZPUk1BVFNbZV18fGU7QyhjKSYmKGM9SGUudGVzdChjKT9aKGMpOmEoYykpO3liKGMpJiYoYz1uZXcgRGF0ZShjKSk7aWYoIU5hKGMpKXJldHVybiBjO2Zvcig7ZTspKG09SWUuZXhlYyhlKSk/XG4oZj1mLmNvbmNhdCh5YS5jYWxsKG0sMSkpLGU9Zi5wb3AoKSk6KGYucHVzaChlKSxlPW51bGwpO3EoZixmdW5jdGlvbihhKXtrPUplW2FdO2crPWs/ayhjLGIuREFURVRJTUVfRk9STUFUUyk6YS5yZXBsYWNlKC8oXid8JyQpL2csXCJcIikucmVwbGFjZSgvJycvZyxcIidcIil9KTtyZXR1cm4gZ319ZnVuY3Rpb24gRGUoKXtyZXR1cm4gZnVuY3Rpb24oYil7cmV0dXJuIHJhKGIsITApfX1mdW5jdGlvbiBFZSgpe3JldHVybiBmdW5jdGlvbihiLGEpe2lmKCFPKGIpJiYhQyhiKSlyZXR1cm4gYjthPUluZmluaXR5PT09TWF0aC5hYnMoTnVtYmVyKGEpKT9OdW1iZXIoYSk6WihhKTtpZihDKGIpKXJldHVybiBhPzA8PWE/Yi5zbGljZSgwLGEpOmIuc2xpY2UoYSxiLmxlbmd0aCk6XCJcIjt2YXIgYz1bXSxkLGU7YT5iLmxlbmd0aD9hPWIubGVuZ3RoOmE8LWIubGVuZ3RoJiYoYT0tYi5sZW5ndGgpOzA8YT8oZD0wLGU9YSk6KGQ9Yi5sZW5ndGgrYSxlPWIubGVuZ3RoKTtmb3IoO2Q8ZTtkKyspYy5wdXNoKGJbZF0pO1xucmV0dXJuIGN9fWZ1bmN0aW9uIE1jKGIpe3JldHVybiBmdW5jdGlvbihhLGMsZCl7ZnVuY3Rpb24gZShhLGIpe3JldHVybiBSYShiKT9mdW5jdGlvbihiLGMpe3JldHVybiBhKGMsYil9OmF9ZnVuY3Rpb24gZyhhLGIpe3ZhciBjPXR5cGVvZiBhLGQ9dHlwZW9mIGI7cmV0dXJuIGM9PWQ/KFwic3RyaW5nXCI9PWMmJihhPWEudG9Mb3dlckNhc2UoKSxiPWIudG9Mb3dlckNhc2UoKSksYT09PWI/MDphPGI/LTE6MSk6YzxkPy0xOjF9aWYoIU8oYSl8fCFjKXJldHVybiBhO2M9TyhjKT9jOltjXTtjPVVjKGMsZnVuY3Rpb24oYSl7dmFyIGM9ITEsZD1hfHxGYTtpZihDKGEpKXtpZihcIitcIj09YS5jaGFyQXQoMCl8fFwiLVwiPT1hLmNoYXJBdCgwKSljPVwiLVwiPT1hLmNoYXJBdCgwKSxhPWEuc3Vic3RyaW5nKDEpO2Q9YihhKTtpZihkLmNvbnN0YW50KXt2YXIgZj1kKCk7cmV0dXJuIGUoZnVuY3Rpb24oYSxiKXtyZXR1cm4gZyhhW2ZdLGJbZl0pfSxjKX19cmV0dXJuIGUoZnVuY3Rpb24oYSxiKXtyZXR1cm4gZyhkKGEpLFxuZChiKSl9LGMpfSk7Zm9yKHZhciBmPVtdLGs9MDtrPGEubGVuZ3RoO2srKylmLnB1c2goYVtrXSk7cmV0dXJuIGYuc29ydChlKGZ1bmN0aW9uKGEsYil7Zm9yKHZhciBkPTA7ZDxjLmxlbmd0aDtkKyspe3ZhciBlPWNbZF0oYSxiKTtpZigwIT09ZSlyZXR1cm4gZX1yZXR1cm4gMH0sZCkpfX1mdW5jdGlvbiB2YShiKXtRKGIpJiYoYj17bGluazpifSk7Yi5yZXN0cmljdD1iLnJlc3RyaWN0fHxcIkFDXCI7cmV0dXJuICQoYil9ZnVuY3Rpb24gUGMoYixhLGMsZCl7ZnVuY3Rpb24gZShhLGMpe2M9Yz9cIi1cIitoYihjLFwiLVwiKTpcIlwiO2QucmVtb3ZlQ2xhc3MoYiwoYT90Yjp1YikrYyk7ZC5hZGRDbGFzcyhiLChhP3ViOnRiKStjKX12YXIgZz10aGlzLGY9Yi5wYXJlbnQoKS5jb250cm9sbGVyKFwiZm9ybVwiKXx8dmIsaz0wLG09Zy4kZXJyb3I9e30saD1bXTtnLiRuYW1lPWEubmFtZXx8YS5uZ0Zvcm07Zy4kZGlydHk9ITE7Zy4kcHJpc3RpbmU9ITA7Zy4kdmFsaWQ9ITA7Zy4kaW52YWxpZD0hMTtmLiRhZGRDb250cm9sKGcpO1xuYi5hZGRDbGFzcyhNYSk7ZSghMCk7Zy4kYWRkQ29udHJvbD1mdW5jdGlvbihhKXtBYShhLiRuYW1lLFwiaW5wdXRcIik7aC5wdXNoKGEpO2EuJG5hbWUmJihnW2EuJG5hbWVdPWEpfTtnLiRyZW1vdmVDb250cm9sPWZ1bmN0aW9uKGEpe2EuJG5hbWUmJmdbYS4kbmFtZV09PT1hJiZkZWxldGUgZ1thLiRuYW1lXTtxKG0sZnVuY3Rpb24oYixjKXtnLiRzZXRWYWxpZGl0eShjLCEwLGEpfSk7UGEoaCxhKX07Zy4kc2V0VmFsaWRpdHk9ZnVuY3Rpb24oYSxiLGMpe3ZhciBkPW1bYV07aWYoYilkJiYoUGEoZCxjKSxkLmxlbmd0aHx8KGstLSxrfHwoZShiKSxnLiR2YWxpZD0hMCxnLiRpbnZhbGlkPSExKSxtW2FdPSExLGUoITAsYSksZi4kc2V0VmFsaWRpdHkoYSwhMCxnKSkpO2Vsc2V7a3x8ZShiKTtpZihkKXtpZigtMSE9T2EoZCxjKSlyZXR1cm59ZWxzZSBtW2FdPWQ9W10saysrLGUoITEsYSksZi4kc2V0VmFsaWRpdHkoYSwhMSxnKTtkLnB1c2goYyk7Zy4kdmFsaWQ9ITE7Zy4kaW52YWxpZD1cbiEwfX07Zy4kc2V0RGlydHk9ZnVuY3Rpb24oKXtkLnJlbW92ZUNsYXNzKGIsTWEpO2QuYWRkQ2xhc3MoYix3Yik7Zy4kZGlydHk9ITA7Zy4kcHJpc3RpbmU9ITE7Zi4kc2V0RGlydHkoKX07Zy4kc2V0UHJpc3RpbmU9ZnVuY3Rpb24oKXtkLnJlbW92ZUNsYXNzKGIsd2IpO2QuYWRkQ2xhc3MoYixNYSk7Zy4kZGlydHk9ITE7Zy4kcHJpc3RpbmU9ITA7cShoLGZ1bmN0aW9uKGEpe2EuJHNldFByaXN0aW5lKCl9KX19ZnVuY3Rpb24gcWEoYixhLGMsZCl7Yi4kc2V0VmFsaWRpdHkoYSxjKTtyZXR1cm4gYz9kOnN9ZnVuY3Rpb24gS2UoYixhLGMpe3ZhciBkPWMucHJvcChcInZhbGlkaXR5XCIpO1UoZCkmJmIuJHBhcnNlcnMucHVzaChmdW5jdGlvbihjKXtpZihiLiRlcnJvclthXXx8IShkLmJhZElucHV0fHxkLmN1c3RvbUVycm9yfHxkLnR5cGVNaXNtYXRjaCl8fGQudmFsdWVNaXNzaW5nKXJldHVybiBjO2IuJHNldFZhbGlkaXR5KGEsITEpfSl9ZnVuY3Rpb24geGIoYixhLGMsZCxlLGcpe3ZhciBmPVxuYS5wcm9wKFwidmFsaWRpdHlcIiksaz1hWzBdLnBsYWNlaG9sZGVyLG09e307aWYoIWUuYW5kcm9pZCl7dmFyIGg9ITE7YS5vbihcImNvbXBvc2l0aW9uc3RhcnRcIixmdW5jdGlvbihhKXtoPSEwfSk7YS5vbihcImNvbXBvc2l0aW9uZW5kXCIsZnVuY3Rpb24oKXtoPSExO2woKX0pfXZhciBsPWZ1bmN0aW9uKGUpe2lmKCFoKXt2YXIgZz1hLnZhbCgpO2lmKFMmJlwiaW5wdXRcIj09PShlfHxtKS50eXBlJiZhWzBdLnBsYWNlaG9sZGVyIT09aylrPWFbMF0ucGxhY2Vob2xkZXI7ZWxzZSBpZihSYShjLm5nVHJpbXx8XCJUXCIpJiYoZz1hYShnKSksZC4kdmlld1ZhbHVlIT09Z3x8ZiYmXCJcIj09PWcmJiFmLnZhbHVlTWlzc2luZyliLiQkcGhhc2U/ZC4kc2V0Vmlld1ZhbHVlKGcpOmIuJGFwcGx5KGZ1bmN0aW9uKCl7ZC4kc2V0Vmlld1ZhbHVlKGcpfSl9fTtpZihlLmhhc0V2ZW50KFwiaW5wdXRcIikpYS5vbihcImlucHV0XCIsbCk7ZWxzZXt2YXIgbixwPWZ1bmN0aW9uKCl7bnx8KG49Zy5kZWZlcihmdW5jdGlvbigpe2woKTtcbm49bnVsbH0pKX07YS5vbihcImtleWRvd25cIixmdW5jdGlvbihhKXthPWEua2V5Q29kZTs5MT09PWF8fCgxNTxhJiYxOT5hfHwzNzw9YSYmNDA+PWEpfHxwKCl9KTtpZihlLmhhc0V2ZW50KFwicGFzdGVcIikpYS5vbihcInBhc3RlIGN1dFwiLHApfWEub24oXCJjaGFuZ2VcIixsKTtkLiRyZW5kZXI9ZnVuY3Rpb24oKXthLnZhbChkLiRpc0VtcHR5KGQuJHZpZXdWYWx1ZSk/XCJcIjpkLiR2aWV3VmFsdWUpfTt2YXIgcj1jLm5nUGF0dGVybjtyJiYoKGU9ci5tYXRjaCgvXlxcLyguKilcXC8oW2dpbV0qKSQvKSk/KHI9UmVnRXhwKGVbMV0sZVsyXSksZT1mdW5jdGlvbihhKXtyZXR1cm4gcWEoZCxcInBhdHRlcm5cIixkLiRpc0VtcHR5KGEpfHxyLnRlc3QoYSksYSl9KTplPWZ1bmN0aW9uKGMpe3ZhciBlPWIuJGV2YWwocik7aWYoIWV8fCFlLnRlc3QpdGhyb3cgdChcIm5nUGF0dGVyblwiKShcIm5vcmVnZXhwXCIscixlLGdhKGEpKTtyZXR1cm4gcWEoZCxcInBhdHRlcm5cIixkLiRpc0VtcHR5KGMpfHxlLnRlc3QoYyksXG5jKX0sZC4kZm9ybWF0dGVycy5wdXNoKGUpLGQuJHBhcnNlcnMucHVzaChlKSk7aWYoYy5uZ01pbmxlbmd0aCl7dmFyIHY9WihjLm5nTWlubGVuZ3RoKTtlPWZ1bmN0aW9uKGEpe3JldHVybiBxYShkLFwibWlubGVuZ3RoXCIsZC4kaXNFbXB0eShhKXx8YS5sZW5ndGg+PXYsYSl9O2QuJHBhcnNlcnMucHVzaChlKTtkLiRmb3JtYXR0ZXJzLnB1c2goZSl9aWYoYy5uZ01heGxlbmd0aCl7dmFyIHE9WihjLm5nTWF4bGVuZ3RoKTtlPWZ1bmN0aW9uKGEpe3JldHVybiBxYShkLFwibWF4bGVuZ3RoXCIsZC4kaXNFbXB0eShhKXx8YS5sZW5ndGg8PXEsYSl9O2QuJHBhcnNlcnMucHVzaChlKTtkLiRmb3JtYXR0ZXJzLnB1c2goZSl9fWZ1bmN0aW9uIFZiKGIsYSl7Yj1cIm5nQ2xhc3NcIitiO3JldHVybltcIiRhbmltYXRlXCIsZnVuY3Rpb24oYyl7ZnVuY3Rpb24gZChhLGIpe3ZhciBjPVtdLGQ9MDthOmZvcig7ZDxhLmxlbmd0aDtkKyspe2Zvcih2YXIgZT1hW2RdLGw9MDtsPGIubGVuZ3RoO2wrKylpZihlPT1cbmJbbF0pY29udGludWUgYTtjLnB1c2goZSl9cmV0dXJuIGN9ZnVuY3Rpb24gZShhKXtpZighTyhhKSl7aWYoQyhhKSlyZXR1cm4gYS5zcGxpdChcIiBcIik7aWYoVShhKSl7dmFyIGI9W107cShhLGZ1bmN0aW9uKGEsYyl7YSYmKGI9Yi5jb25jYXQoYy5zcGxpdChcIiBcIikpKX0pO3JldHVybiBifX1yZXR1cm4gYX1yZXR1cm57cmVzdHJpY3Q6XCJBQ1wiLGxpbms6ZnVuY3Rpb24oZyxmLGspe2Z1bmN0aW9uIG0oYSxiKXt2YXIgYz1mLmRhdGEoXCIkY2xhc3NDb3VudHNcIil8fHt9LGQ9W107cShhLGZ1bmN0aW9uKGEpe2lmKDA8Ynx8Y1thXSljW2FdPShjW2FdfHwwKStiLGNbYV09PT0rKDA8YikmJmQucHVzaChhKX0pO2YuZGF0YShcIiRjbGFzc0NvdW50c1wiLGMpO3JldHVybiBkLmpvaW4oXCIgXCIpfWZ1bmN0aW9uIGgoYil7aWYoITA9PT1hfHxnLiRpbmRleCUyPT09YSl7dmFyIGg9ZShifHxbXSk7aWYoIWwpe3ZhciByPW0oaCwxKTtrLiRhZGRDbGFzcyhyKX1lbHNlIGlmKCF4YShiLGwpKXt2YXIgcT1cbmUobCkscj1kKGgscSksaD1kKHEsaCksaD1tKGgsLTEpLHI9bShyLDEpOzA9PT1yLmxlbmd0aD9jLnJlbW92ZUNsYXNzKGYsaCk6MD09PWgubGVuZ3RoP2MuYWRkQ2xhc3MoZixyKTpjLnNldENsYXNzKGYscixoKX19bD1rYShiKX12YXIgbDtnLiR3YXRjaChrW2JdLGgsITApO2suJG9ic2VydmUoXCJjbGFzc1wiLGZ1bmN0aW9uKGEpe2goZy4kZXZhbChrW2JdKSl9KTtcIm5nQ2xhc3NcIiE9PWImJmcuJHdhdGNoKFwiJGluZGV4XCIsZnVuY3Rpb24oYyxkKXt2YXIgZj1jJjE7aWYoZiE9PShkJjEpKXt2YXIgaD1lKGcuJGV2YWwoa1tiXSkpO2Y9PT1hPyhmPW0oaCwxKSxrLiRhZGRDbGFzcyhmKSk6KGY9bShoLC0xKSxrLiRyZW1vdmVDbGFzcyhmKSl9fSl9fX1dfXZhciBMPWZ1bmN0aW9uKGIpe3JldHVybiBDKGIpP2IudG9Mb3dlckNhc2UoKTpifSx6Yj1PYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LEhhPWZ1bmN0aW9uKGIpe3JldHVybiBDKGIpP2IudG9VcHBlckNhc2UoKTpifSxTLFxudyxCYSx5YT1bXS5zbGljZSxMZT1bXS5wdXNoLHdhPU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcsUWE9dChcIm5nXCIpLFNhPVQuYW5ndWxhcnx8KFQuYW5ndWxhcj17fSksVWEsTGEsamE9W1wiMFwiLFwiMFwiLFwiMFwiXTtTPVooKC9tc2llIChcXGQrKS8uZXhlYyhMKG5hdmlnYXRvci51c2VyQWdlbnQpKXx8W10pWzFdKTtpc05hTihTKSYmKFM9WigoL3RyaWRlbnRcXC8uKjsgcnY6KFxcZCspLy5leGVjKEwobmF2aWdhdG9yLnVzZXJBZ2VudCkpfHxbXSlbMV0pKTt5LiRpbmplY3Q9W107RmEuJGluamVjdD1bXTt2YXIgTz1mdW5jdGlvbigpe3JldHVybiBRKEFycmF5LmlzQXJyYXkpP0FycmF5LmlzQXJyYXk6ZnVuY3Rpb24oYil7cmV0dXJuXCJbb2JqZWN0IEFycmF5XVwiPT09d2EuY2FsbChiKX19KCksYWE9ZnVuY3Rpb24oKXtyZXR1cm4gU3RyaW5nLnByb3RvdHlwZS50cmltP2Z1bmN0aW9uKGIpe3JldHVybiBDKGIpP2IudHJpbSgpOmJ9OmZ1bmN0aW9uKGIpe3JldHVybiBDKGIpP2IucmVwbGFjZSgvXlxcc1xccyovLFxuXCJcIikucmVwbGFjZSgvXFxzXFxzKiQvLFwiXCIpOmJ9fSgpO0xhPTk+Uz9mdW5jdGlvbihiKXtiPWIubm9kZU5hbWU/YjpiWzBdO3JldHVybiBiLnNjb3BlTmFtZSYmXCJIVE1MXCIhPWIuc2NvcGVOYW1lP0hhKGIuc2NvcGVOYW1lK1wiOlwiK2Iubm9kZU5hbWUpOmIubm9kZU5hbWV9OmZ1bmN0aW9uKGIpe3JldHVybiBiLm5vZGVOYW1lP2Iubm9kZU5hbWU6YlswXS5ub2RlTmFtZX07dmFyIFhjPS9bQS1aXS9nLCRjPXtmdWxsOlwiMS4yLjE4XCIsbWFqb3I6MSxtaW5vcjoyLGRvdDoxOCxjb2RlTmFtZTpcImVhci1leHRlbmRhYmlsaXR5XCJ9LFhhPVIuY2FjaGU9e30saWI9Ui5leHBhbmRvPVwibmdcIisobmV3IERhdGUpLmdldFRpbWUoKSxtZT0xLHBiPVQuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcj9mdW5jdGlvbihiLGEsYyl7Yi5hZGRFdmVudExpc3RlbmVyKGEsYywhMSl9OmZ1bmN0aW9uKGIsYSxjKXtiLmF0dGFjaEV2ZW50KFwib25cIithLGMpfSxXYT1ULmRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXI/XG5mdW5jdGlvbihiLGEsYyl7Yi5yZW1vdmVFdmVudExpc3RlbmVyKGEsYywhMSl9OmZ1bmN0aW9uKGIsYSxjKXtiLmRldGFjaEV2ZW50KFwib25cIithLGMpfTtSLl9kYXRhPWZ1bmN0aW9uKGIpe3JldHVybiB0aGlzLmNhY2hlW2JbdGhpcy5leHBhbmRvXV18fHt9fTt2YXIgaGU9LyhbXFw6XFwtXFxfXSsoLikpL2csaWU9L15tb3ooW0EtWl0pLyxHYj10KFwianFMaXRlXCIpLGplPS9ePChcXHcrKVxccypcXC8/Pig/OjxcXC9cXDE+fCkkLyxIYj0vPHwmIz9cXHcrOy8sa2U9LzwoW1xcdzpdKykvLGxlPS88KD8hYXJlYXxicnxjb2x8ZW1iZWR8aHJ8aW1nfGlucHV0fGxpbmt8bWV0YXxwYXJhbSkoKFtcXHc6XSspW14+XSopXFwvPi9naSxkYT17b3B0aW9uOlsxLCc8c2VsZWN0IG11bHRpcGxlPVwibXVsdGlwbGVcIj4nLFwiPC9zZWxlY3Q+XCJdLHRoZWFkOlsxLFwiPHRhYmxlPlwiLFwiPC90YWJsZT5cIl0sY29sOlsyLFwiPHRhYmxlPjxjb2xncm91cD5cIixcIjwvY29sZ3JvdXA+PC90YWJsZT5cIl0sdHI6WzIsXCI8dGFibGU+PHRib2R5PlwiLFxuXCI8L3Rib2R5PjwvdGFibGU+XCJdLHRkOlszLFwiPHRhYmxlPjx0Ym9keT48dHI+XCIsXCI8L3RyPjwvdGJvZHk+PC90YWJsZT5cIl0sX2RlZmF1bHQ6WzAsXCJcIixcIlwiXX07ZGEub3B0Z3JvdXA9ZGEub3B0aW9uO2RhLnRib2R5PWRhLnRmb290PWRhLmNvbGdyb3VwPWRhLmNhcHRpb249ZGEudGhlYWQ7ZGEudGg9ZGEudGQ7dmFyIEthPVIucHJvdG90eXBlPXtyZWFkeTpmdW5jdGlvbihiKXtmdW5jdGlvbiBhKCl7Y3x8KGM9ITAsYigpKX12YXIgYz0hMTtcImNvbXBsZXRlXCI9PT1WLnJlYWR5U3RhdGU/c2V0VGltZW91dChhKToodGhpcy5vbihcIkRPTUNvbnRlbnRMb2FkZWRcIixhKSxSKFQpLm9uKFwibG9hZFwiLGEpKX0sdG9TdHJpbmc6ZnVuY3Rpb24oKXt2YXIgYj1bXTtxKHRoaXMsZnVuY3Rpb24oYSl7Yi5wdXNoKFwiXCIrYSl9KTtyZXR1cm5cIltcIitiLmpvaW4oXCIsIFwiKStcIl1cIn0sZXE6ZnVuY3Rpb24oYil7cmV0dXJuIDA8PWI/dyh0aGlzW2JdKTp3KHRoaXNbdGhpcy5sZW5ndGgrYl0pfSxsZW5ndGg6MCxcbnB1c2g6TGUsc29ydDpbXS5zb3J0LHNwbGljZTpbXS5zcGxpY2V9LG1iPXt9O3EoXCJtdWx0aXBsZSBzZWxlY3RlZCBjaGVja2VkIGRpc2FibGVkIHJlYWRPbmx5IHJlcXVpcmVkIG9wZW5cIi5zcGxpdChcIiBcIiksZnVuY3Rpb24oYil7bWJbTChiKV09Yn0pO3ZhciByYz17fTtxKFwiaW5wdXQgc2VsZWN0IG9wdGlvbiB0ZXh0YXJlYSBidXR0b24gZm9ybSBkZXRhaWxzXCIuc3BsaXQoXCIgXCIpLGZ1bmN0aW9uKGIpe3JjW0hhKGIpXT0hMH0pO3Eoe2RhdGE6bmMsaW5oZXJpdGVkRGF0YTpsYixzY29wZTpmdW5jdGlvbihiKXtyZXR1cm4gdyhiKS5kYXRhKFwiJHNjb3BlXCIpfHxsYihiLnBhcmVudE5vZGV8fGIsW1wiJGlzb2xhdGVTY29wZVwiLFwiJHNjb3BlXCJdKX0saXNvbGF0ZVNjb3BlOmZ1bmN0aW9uKGIpe3JldHVybiB3KGIpLmRhdGEoXCIkaXNvbGF0ZVNjb3BlXCIpfHx3KGIpLmRhdGEoXCIkaXNvbGF0ZVNjb3BlTm9UZW1wbGF0ZVwiKX0sY29udHJvbGxlcjpvYyxpbmplY3RvcjpmdW5jdGlvbihiKXtyZXR1cm4gbGIoYixcblwiJGluamVjdG9yXCIpfSxyZW1vdmVBdHRyOmZ1bmN0aW9uKGIsYSl7Yi5yZW1vdmVBdHRyaWJ1dGUoYSl9LGhhc0NsYXNzOktiLGNzczpmdW5jdGlvbihiLGEsYyl7YT1WYShhKTtpZihCKGMpKWIuc3R5bGVbYV09YztlbHNle3ZhciBkOzg+PVMmJihkPWIuY3VycmVudFN0eWxlJiZiLmN1cnJlbnRTdHlsZVthXSxcIlwiPT09ZCYmKGQ9XCJhdXRvXCIpKTtkPWR8fGIuc3R5bGVbYV07OD49UyYmKGQ9XCJcIj09PWQ/czpkKTtyZXR1cm4gZH19LGF0dHI6ZnVuY3Rpb24oYixhLGMpe3ZhciBkPUwoYSk7aWYobWJbZF0paWYoQihjKSljPyhiW2FdPSEwLGIuc2V0QXR0cmlidXRlKGEsZCkpOihiW2FdPSExLGIucmVtb3ZlQXR0cmlidXRlKGQpKTtlbHNlIHJldHVybiBiW2FdfHwoYi5hdHRyaWJ1dGVzLmdldE5hbWVkSXRlbShhKXx8eSkuc3BlY2lmaWVkP2Q6cztlbHNlIGlmKEIoYykpYi5zZXRBdHRyaWJ1dGUoYSxjKTtlbHNlIGlmKGIuZ2V0QXR0cmlidXRlKXJldHVybiBiPWIuZ2V0QXR0cmlidXRlKGEsXG4yKSxudWxsPT09Yj9zOmJ9LHByb3A6ZnVuY3Rpb24oYixhLGMpe2lmKEIoYykpYlthXT1jO2Vsc2UgcmV0dXJuIGJbYV19LHRleHQ6ZnVuY3Rpb24oKXtmdW5jdGlvbiBiKGIsZCl7dmFyIGU9YVtiLm5vZGVUeXBlXTtpZihEKGQpKXJldHVybiBlP2JbZV06XCJcIjtiW2VdPWR9dmFyIGE9W107OT5TPyhhWzFdPVwiaW5uZXJUZXh0XCIsYVszXT1cIm5vZGVWYWx1ZVwiKTphWzFdPWFbM109XCJ0ZXh0Q29udGVudFwiO2IuJGR2PVwiXCI7cmV0dXJuIGJ9KCksdmFsOmZ1bmN0aW9uKGIsYSl7aWYoRChhKSl7aWYoXCJTRUxFQ1RcIj09PUxhKGIpJiZiLm11bHRpcGxlKXt2YXIgYz1bXTtxKGIub3B0aW9ucyxmdW5jdGlvbihhKXthLnNlbGVjdGVkJiZjLnB1c2goYS52YWx1ZXx8YS50ZXh0KX0pO3JldHVybiAwPT09Yy5sZW5ndGg/bnVsbDpjfXJldHVybiBiLnZhbHVlfWIudmFsdWU9YX0saHRtbDpmdW5jdGlvbihiLGEpe2lmKEQoYSkpcmV0dXJuIGIuaW5uZXJIVE1MO2Zvcih2YXIgYz0wLGQ9Yi5jaGlsZE5vZGVzO2M8XG5kLmxlbmd0aDtjKyspSWEoZFtjXSk7Yi5pbm5lckhUTUw9YX0sZW1wdHk6cGN9LGZ1bmN0aW9uKGIsYSl7Ui5wcm90b3R5cGVbYV09ZnVuY3Rpb24oYSxkKXt2YXIgZSxnLGY9dGhpcy5sZW5ndGg7aWYoYiE9PXBjJiYoMj09Yi5sZW5ndGgmJmIhPT1LYiYmYiE9PW9jP2E6ZCk9PT1zKXtpZihVKGEpKXtmb3IoZT0wO2U8ZjtlKyspaWYoYj09PW5jKWIodGhpc1tlXSxhKTtlbHNlIGZvcihnIGluIGEpYih0aGlzW2VdLGcsYVtnXSk7cmV0dXJuIHRoaXN9ZT1iLiRkdjtmPWU9PT1zP01hdGgubWluKGYsMSk6Zjtmb3IoZz0wO2c8ZjtnKyspe3ZhciBrPWIodGhpc1tnXSxhLGQpO2U9ZT9lK2s6a31yZXR1cm4gZX1mb3IoZT0wO2U8ZjtlKyspYih0aGlzW2VdLGEsZCk7cmV0dXJuIHRoaXN9fSk7cSh7cmVtb3ZlRGF0YTpsYyxkZWFsb2M6SWEsb246ZnVuY3Rpb24gYShjLGQsZSxnKXtpZihCKGcpKXRocm93IEdiKFwib25hcmdzXCIpO3ZhciBmPWxhKGMsXCJldmVudHNcIiksaz1sYShjLFwiaGFuZGxlXCIpO1xuZnx8bGEoYyxcImV2ZW50c1wiLGY9e30pO2t8fGxhKGMsXCJoYW5kbGVcIixrPW5lKGMsZikpO3EoZC5zcGxpdChcIiBcIiksZnVuY3Rpb24oZCl7dmFyIGc9ZltkXTtpZighZyl7aWYoXCJtb3VzZWVudGVyXCI9PWR8fFwibW91c2VsZWF2ZVwiPT1kKXt2YXIgbD1WLmJvZHkuY29udGFpbnN8fFYuYm9keS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbj9mdW5jdGlvbihhLGMpe3ZhciBkPTk9PT1hLm5vZGVUeXBlP2EuZG9jdW1lbnRFbGVtZW50OmEsZT1jJiZjLnBhcmVudE5vZGU7cmV0dXJuIGE9PT1lfHwhIShlJiYxPT09ZS5ub2RlVHlwZSYmKGQuY29udGFpbnM/ZC5jb250YWlucyhlKTphLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uJiZhLmNvbXBhcmVEb2N1bWVudFBvc2l0aW9uKGUpJjE2KSl9OmZ1bmN0aW9uKGEsYyl7aWYoYylmb3IoO2M9Yy5wYXJlbnROb2RlOylpZihjPT09YSlyZXR1cm4hMDtyZXR1cm4hMX07ZltkXT1bXTthKGMse21vdXNlbGVhdmU6XCJtb3VzZW91dFwiLG1vdXNlZW50ZXI6XCJtb3VzZW92ZXJcIn1bZF0sXG5mdW5jdGlvbihhKXt2YXIgYz1hLnJlbGF0ZWRUYXJnZXQ7YyYmKGM9PT10aGlzfHxsKHRoaXMsYykpfHxrKGEsZCl9KX1lbHNlIHBiKGMsZCxrKSxmW2RdPVtdO2c9ZltkXX1nLnB1c2goZSl9KX0sb2ZmOm1jLG9uZTpmdW5jdGlvbihhLGMsZCl7YT13KGEpO2Eub24oYyxmdW5jdGlvbiBnKCl7YS5vZmYoYyxkKTthLm9mZihjLGcpfSk7YS5vbihjLGQpfSxyZXBsYWNlV2l0aDpmdW5jdGlvbihhLGMpe3ZhciBkLGU9YS5wYXJlbnROb2RlO0lhKGEpO3EobmV3IFIoYyksZnVuY3Rpb24oYyl7ZD9lLmluc2VydEJlZm9yZShjLGQubmV4dFNpYmxpbmcpOmUucmVwbGFjZUNoaWxkKGMsYSk7ZD1jfSl9LGNoaWxkcmVuOmZ1bmN0aW9uKGEpe3ZhciBjPVtdO3EoYS5jaGlsZE5vZGVzLGZ1bmN0aW9uKGEpezE9PT1hLm5vZGVUeXBlJiZjLnB1c2goYSl9KTtyZXR1cm4gY30sY29udGVudHM6ZnVuY3Rpb24oYSl7cmV0dXJuIGEuY29udGVudERvY3VtZW50fHxhLmNoaWxkTm9kZXN8fFtdfSxhcHBlbmQ6ZnVuY3Rpb24oYSxcbmMpe3EobmV3IFIoYyksZnVuY3Rpb24oYyl7MSE9PWEubm9kZVR5cGUmJjExIT09YS5ub2RlVHlwZXx8YS5hcHBlbmRDaGlsZChjKX0pfSxwcmVwZW5kOmZ1bmN0aW9uKGEsYyl7aWYoMT09PWEubm9kZVR5cGUpe3ZhciBkPWEuZmlyc3RDaGlsZDtxKG5ldyBSKGMpLGZ1bmN0aW9uKGMpe2EuaW5zZXJ0QmVmb3JlKGMsZCl9KX19LHdyYXA6ZnVuY3Rpb24oYSxjKXtjPXcoYylbMF07dmFyIGQ9YS5wYXJlbnROb2RlO2QmJmQucmVwbGFjZUNoaWxkKGMsYSk7Yy5hcHBlbmRDaGlsZChhKX0scmVtb3ZlOmZ1bmN0aW9uKGEpe0lhKGEpO3ZhciBjPWEucGFyZW50Tm9kZTtjJiZjLnJlbW92ZUNoaWxkKGEpfSxhZnRlcjpmdW5jdGlvbihhLGMpe3ZhciBkPWEsZT1hLnBhcmVudE5vZGU7cShuZXcgUihjKSxmdW5jdGlvbihhKXtlLmluc2VydEJlZm9yZShhLGQubmV4dFNpYmxpbmcpO2Q9YX0pfSxhZGRDbGFzczprYixyZW1vdmVDbGFzczpqYix0b2dnbGVDbGFzczpmdW5jdGlvbihhLGMsZCl7YyYmXG5xKGMuc3BsaXQoXCIgXCIpLGZ1bmN0aW9uKGMpe3ZhciBnPWQ7RChnKSYmKGc9IUtiKGEsYykpOyhnP2tiOmpiKShhLGMpfSl9LHBhcmVudDpmdW5jdGlvbihhKXtyZXR1cm4oYT1hLnBhcmVudE5vZGUpJiYxMSE9PWEubm9kZVR5cGU/YTpudWxsfSxuZXh0OmZ1bmN0aW9uKGEpe2lmKGEubmV4dEVsZW1lbnRTaWJsaW5nKXJldHVybiBhLm5leHRFbGVtZW50U2libGluZztmb3IoYT1hLm5leHRTaWJsaW5nO251bGwhPWEmJjEhPT1hLm5vZGVUeXBlOylhPWEubmV4dFNpYmxpbmc7cmV0dXJuIGF9LGZpbmQ6ZnVuY3Rpb24oYSxjKXtyZXR1cm4gYS5nZXRFbGVtZW50c0J5VGFnTmFtZT9hLmdldEVsZW1lbnRzQnlUYWdOYW1lKGMpOltdfSxjbG9uZTpKYix0cmlnZ2VySGFuZGxlcjpmdW5jdGlvbihhLGMsZCl7Yz0obGEoYSxcImV2ZW50c1wiKXx8e30pW2NdO2Q9ZHx8W107dmFyIGU9W3twcmV2ZW50RGVmYXVsdDp5LHN0b3BQcm9wYWdhdGlvbjp5fV07cShjLGZ1bmN0aW9uKGMpe2MuYXBwbHkoYSxcbmUuY29uY2F0KGQpKX0pfX0sZnVuY3Rpb24oYSxjKXtSLnByb3RvdHlwZVtjXT1mdW5jdGlvbihjLGUsZyl7Zm9yKHZhciBmLGs9MDtrPHRoaXMubGVuZ3RoO2srKylEKGYpPyhmPWEodGhpc1trXSxjLGUsZyksQihmKSYmKGY9dyhmKSkpOkliKGYsYSh0aGlzW2tdLGMsZSxnKSk7cmV0dXJuIEIoZik/Zjp0aGlzfTtSLnByb3RvdHlwZS5iaW5kPVIucHJvdG90eXBlLm9uO1IucHJvdG90eXBlLnVuYmluZD1SLnByb3RvdHlwZS5vZmZ9KTtZYS5wcm90b3R5cGU9e3B1dDpmdW5jdGlvbihhLGMpe3RoaXNbSmEoYSldPWN9LGdldDpmdW5jdGlvbihhKXtyZXR1cm4gdGhpc1tKYShhKV19LHJlbW92ZTpmdW5jdGlvbihhKXt2YXIgYz10aGlzW2E9SmEoYSldO2RlbGV0ZSB0aGlzW2FdO3JldHVybiBjfX07dmFyIHBlPS9eZnVuY3Rpb25cXHMqW15cXChdKlxcKFxccyooW15cXCldKilcXCkvbSxxZT0vLC8scmU9L15cXHMqKF8/KShcXFMrPylcXDFcXHMqJC8sb2U9LygoXFwvXFwvLiokKXwoXFwvXFwqW1xcc1xcU10qP1xcKlxcLykpL21nLFxuWmE9dChcIiRpbmplY3RvclwiKSxNZT10KFwiJGFuaW1hdGVcIiksTGQ9W1wiJHByb3ZpZGVcIixmdW5jdGlvbihhKXt0aGlzLiQkc2VsZWN0b3JzPXt9O3RoaXMucmVnaXN0ZXI9ZnVuY3Rpb24oYyxkKXt2YXIgZT1jK1wiLWFuaW1hdGlvblwiO2lmKGMmJlwiLlwiIT1jLmNoYXJBdCgwKSl0aHJvdyBNZShcIm5vdGNzZWxcIixjKTt0aGlzLiQkc2VsZWN0b3JzW2Muc3Vic3RyKDEpXT1lO2EuZmFjdG9yeShlLGQpfTt0aGlzLmNsYXNzTmFtZUZpbHRlcj1mdW5jdGlvbihhKXsxPT09YXJndW1lbnRzLmxlbmd0aCYmKHRoaXMuJCRjbGFzc05hbWVGaWx0ZXI9YSBpbnN0YW5jZW9mIFJlZ0V4cD9hOm51bGwpO3JldHVybiB0aGlzLiQkY2xhc3NOYW1lRmlsdGVyfTt0aGlzLiRnZXQ9W1wiJHRpbWVvdXRcIixcIiQkYXN5bmNDYWxsYmFja1wiLGZ1bmN0aW9uKGEsZCl7cmV0dXJue2VudGVyOmZ1bmN0aW9uKGEsYyxmLGspe2Y/Zi5hZnRlcihhKTooYyYmY1swXXx8KGM9Zi5wYXJlbnQoKSksYy5hcHBlbmQoYSkpO2smJlxuZChrKX0sbGVhdmU6ZnVuY3Rpb24oYSxjKXthLnJlbW92ZSgpO2MmJmQoYyl9LG1vdmU6ZnVuY3Rpb24oYSxjLGQsayl7dGhpcy5lbnRlcihhLGMsZCxrKX0sYWRkQ2xhc3M6ZnVuY3Rpb24oYSxjLGYpe2M9QyhjKT9jOk8oYyk/Yy5qb2luKFwiIFwiKTpcIlwiO3EoYSxmdW5jdGlvbihhKXtrYihhLGMpfSk7ZiYmZChmKX0scmVtb3ZlQ2xhc3M6ZnVuY3Rpb24oYSxjLGYpe2M9QyhjKT9jOk8oYyk/Yy5qb2luKFwiIFwiKTpcIlwiO3EoYSxmdW5jdGlvbihhKXtqYihhLGMpfSk7ZiYmZChmKX0sc2V0Q2xhc3M6ZnVuY3Rpb24oYSxjLGYsayl7cShhLGZ1bmN0aW9uKGEpe2tiKGEsYyk7amIoYSxmKX0pO2smJmQoayl9LGVuYWJsZWQ6eX19XX1dLGlhPXQoXCIkY29tcGlsZVwiKTtnYy4kaW5qZWN0PVtcIiRwcm92aWRlXCIsXCIkJHNhbml0aXplVXJpUHJvdmlkZXJcIl07dmFyIHVlPS9eKHhbXFw6XFwtX118ZGF0YVtcXDpcXC1fXSkvaSx6Yz10KFwiJGludGVycG9sYXRlXCIpLE5lPS9eKFteXFw/I10qKShcXD8oW14jXSopKT8oIyguKikpPyQvLFxueGU9e2h0dHA6ODAsaHR0cHM6NDQzLGZ0cDoyMX0sUGI9dChcIiRsb2NhdGlvblwiKTtSYi5wcm90b3R5cGU9UWIucHJvdG90eXBlPUNjLnByb3RvdHlwZT17JCRodG1sNTohMSwkJHJlcGxhY2U6ITEsYWJzVXJsOnFiKFwiJCRhYnNVcmxcIiksdXJsOmZ1bmN0aW9uKGEsYyl7aWYoRChhKSlyZXR1cm4gdGhpcy4kJHVybDt2YXIgZD1OZS5leGVjKGEpO2RbMV0mJnRoaXMucGF0aChkZWNvZGVVUklDb21wb25lbnQoZFsxXSkpOyhkWzJdfHxkWzFdKSYmdGhpcy5zZWFyY2goZFszXXx8XCJcIik7dGhpcy5oYXNoKGRbNV18fFwiXCIsYyk7cmV0dXJuIHRoaXN9LHByb3RvY29sOnFiKFwiJCRwcm90b2NvbFwiKSxob3N0OnFiKFwiJCRob3N0XCIpLHBvcnQ6cWIoXCIkJHBvcnRcIikscGF0aDpEYyhcIiQkcGF0aFwiLGZ1bmN0aW9uKGEpe3JldHVyblwiL1wiPT1hLmNoYXJBdCgwKT9hOlwiL1wiK2F9KSxzZWFyY2g6ZnVuY3Rpb24oYSxjKXtzd2l0Y2goYXJndW1lbnRzLmxlbmd0aCl7Y2FzZSAwOnJldHVybiB0aGlzLiQkc2VhcmNoO1xuY2FzZSAxOmlmKEMoYSkpdGhpcy4kJHNlYXJjaD1jYyhhKTtlbHNlIGlmKFUoYSkpdGhpcy4kJHNlYXJjaD1hO2Vsc2UgdGhyb3cgUGIoXCJpc3JjaGFyZ1wiKTticmVhaztkZWZhdWx0OkQoYyl8fG51bGw9PT1jP2RlbGV0ZSB0aGlzLiQkc2VhcmNoW2FdOnRoaXMuJCRzZWFyY2hbYV09Y310aGlzLiQkY29tcG9zZSgpO3JldHVybiB0aGlzfSxoYXNoOkRjKFwiJCRoYXNoXCIsRmEpLHJlcGxhY2U6ZnVuY3Rpb24oKXt0aGlzLiQkcmVwbGFjZT0hMDtyZXR1cm4gdGhpc319O3ZhciBEYT10KFwiJHBhcnNlXCIpLEdjPXt9LHRhLGNiPXtcIm51bGxcIjpmdW5jdGlvbigpe3JldHVybiBudWxsfSxcInRydWVcIjpmdW5jdGlvbigpe3JldHVybiEwfSxcImZhbHNlXCI6ZnVuY3Rpb24oKXtyZXR1cm4hMX0sdW5kZWZpbmVkOnksXCIrXCI6ZnVuY3Rpb24oYSxjLGQsZSl7ZD1kKGEsYyk7ZT1lKGEsYyk7cmV0dXJuIEIoZCk/QihlKT9kK2U6ZDpCKGUpP2U6c30sXCItXCI6ZnVuY3Rpb24oYSxjLGQsZSl7ZD1kKGEsYyk7ZT1cbmUoYSxjKTtyZXR1cm4oQihkKT9kOjApLShCKGUpP2U6MCl9LFwiKlwiOmZ1bmN0aW9uKGEsYyxkLGUpe3JldHVybiBkKGEsYykqZShhLGMpfSxcIi9cIjpmdW5jdGlvbihhLGMsZCxlKXtyZXR1cm4gZChhLGMpL2UoYSxjKX0sXCIlXCI6ZnVuY3Rpb24oYSxjLGQsZSl7cmV0dXJuIGQoYSxjKSVlKGEsYyl9LFwiXlwiOmZ1bmN0aW9uKGEsYyxkLGUpe3JldHVybiBkKGEsYyleZShhLGMpfSxcIj1cIjp5LFwiPT09XCI6ZnVuY3Rpb24oYSxjLGQsZSl7cmV0dXJuIGQoYSxjKT09PWUoYSxjKX0sXCIhPT1cIjpmdW5jdGlvbihhLGMsZCxlKXtyZXR1cm4gZChhLGMpIT09ZShhLGMpfSxcIj09XCI6ZnVuY3Rpb24oYSxjLGQsZSl7cmV0dXJuIGQoYSxjKT09ZShhLGMpfSxcIiE9XCI6ZnVuY3Rpb24oYSxjLGQsZSl7cmV0dXJuIGQoYSxjKSE9ZShhLGMpfSxcIjxcIjpmdW5jdGlvbihhLGMsZCxlKXtyZXR1cm4gZChhLGMpPGUoYSxjKX0sXCI+XCI6ZnVuY3Rpb24oYSxjLGQsZSl7cmV0dXJuIGQoYSxjKT5lKGEsYyl9LFwiPD1cIjpmdW5jdGlvbihhLFxuYyxkLGUpe3JldHVybiBkKGEsYyk8PWUoYSxjKX0sXCI+PVwiOmZ1bmN0aW9uKGEsYyxkLGUpe3JldHVybiBkKGEsYyk+PWUoYSxjKX0sXCImJlwiOmZ1bmN0aW9uKGEsYyxkLGUpe3JldHVybiBkKGEsYykmJmUoYSxjKX0sXCJ8fFwiOmZ1bmN0aW9uKGEsYyxkLGUpe3JldHVybiBkKGEsYyl8fGUoYSxjKX0sXCImXCI6ZnVuY3Rpb24oYSxjLGQsZSl7cmV0dXJuIGQoYSxjKSZlKGEsYyl9LFwifFwiOmZ1bmN0aW9uKGEsYyxkLGUpe3JldHVybiBlKGEsYykoYSxjLGQoYSxjKSl9LFwiIVwiOmZ1bmN0aW9uKGEsYyxkKXtyZXR1cm4hZChhLGMpfX0sT2U9e246XCJcXG5cIixmOlwiXFxmXCIscjpcIlxcclwiLHQ6XCJcXHRcIix2OlwiXFx2XCIsXCInXCI6XCInXCIsJ1wiJzonXCInfSxUYj1mdW5jdGlvbihhKXt0aGlzLm9wdGlvbnM9YX07VGIucHJvdG90eXBlPXtjb25zdHJ1Y3RvcjpUYixsZXg6ZnVuY3Rpb24oYSl7dGhpcy50ZXh0PWE7dGhpcy5pbmRleD0wO3RoaXMuY2g9czt0aGlzLmxhc3RDaD1cIjpcIjtmb3IodGhpcy50b2tlbnM9W107dGhpcy5pbmRleDxcbnRoaXMudGV4dC5sZW5ndGg7KXt0aGlzLmNoPXRoaXMudGV4dC5jaGFyQXQodGhpcy5pbmRleCk7aWYodGhpcy5pcyhcIlxcXCInXCIpKXRoaXMucmVhZFN0cmluZyh0aGlzLmNoKTtlbHNlIGlmKHRoaXMuaXNOdW1iZXIodGhpcy5jaCl8fHRoaXMuaXMoXCIuXCIpJiZ0aGlzLmlzTnVtYmVyKHRoaXMucGVlaygpKSl0aGlzLnJlYWROdW1iZXIoKTtlbHNlIGlmKHRoaXMuaXNJZGVudCh0aGlzLmNoKSl0aGlzLnJlYWRJZGVudCgpO2Vsc2UgaWYodGhpcy5pcyhcIigpe31bXS4sOzo/XCIpKXRoaXMudG9rZW5zLnB1c2goe2luZGV4OnRoaXMuaW5kZXgsdGV4dDp0aGlzLmNofSksdGhpcy5pbmRleCsrO2Vsc2UgaWYodGhpcy5pc1doaXRlc3BhY2UodGhpcy5jaCkpe3RoaXMuaW5kZXgrKztjb250aW51ZX1lbHNle2E9dGhpcy5jaCt0aGlzLnBlZWsoKTt2YXIgYz1hK3RoaXMucGVlaygyKSxkPWNiW3RoaXMuY2hdLGU9Y2JbYV0sZz1jYltjXTtnPyh0aGlzLnRva2Vucy5wdXNoKHtpbmRleDp0aGlzLmluZGV4LFxudGV4dDpjLGZuOmd9KSx0aGlzLmluZGV4Kz0zKTplPyh0aGlzLnRva2Vucy5wdXNoKHtpbmRleDp0aGlzLmluZGV4LHRleHQ6YSxmbjplfSksdGhpcy5pbmRleCs9Mik6ZD8odGhpcy50b2tlbnMucHVzaCh7aW5kZXg6dGhpcy5pbmRleCx0ZXh0OnRoaXMuY2gsZm46ZH0pLHRoaXMuaW5kZXgrPTEpOnRoaXMudGhyb3dFcnJvcihcIlVuZXhwZWN0ZWQgbmV4dCBjaGFyYWN0ZXIgXCIsdGhpcy5pbmRleCx0aGlzLmluZGV4KzEpfXRoaXMubGFzdENoPXRoaXMuY2h9cmV0dXJuIHRoaXMudG9rZW5zfSxpczpmdW5jdGlvbihhKXtyZXR1cm4tMSE9PWEuaW5kZXhPZih0aGlzLmNoKX0sd2FzOmZ1bmN0aW9uKGEpe3JldHVybi0xIT09YS5pbmRleE9mKHRoaXMubGFzdENoKX0scGVlazpmdW5jdGlvbihhKXthPWF8fDE7cmV0dXJuIHRoaXMuaW5kZXgrYTx0aGlzLnRleHQubGVuZ3RoP3RoaXMudGV4dC5jaGFyQXQodGhpcy5pbmRleCthKTohMX0saXNOdW1iZXI6ZnVuY3Rpb24oYSl7cmV0dXJuXCIwXCI8PVxuYSYmXCI5XCI+PWF9LGlzV2hpdGVzcGFjZTpmdW5jdGlvbihhKXtyZXR1cm5cIiBcIj09PWF8fFwiXFxyXCI9PT1hfHxcIlxcdFwiPT09YXx8XCJcXG5cIj09PWF8fFwiXFx2XCI9PT1hfHxcIlxcdTAwYTBcIj09PWF9LGlzSWRlbnQ6ZnVuY3Rpb24oYSl7cmV0dXJuXCJhXCI8PWEmJlwielwiPj1hfHxcIkFcIjw9YSYmXCJaXCI+PWF8fFwiX1wiPT09YXx8XCIkXCI9PT1hfSxpc0V4cE9wZXJhdG9yOmZ1bmN0aW9uKGEpe3JldHVyblwiLVwiPT09YXx8XCIrXCI9PT1hfHx0aGlzLmlzTnVtYmVyKGEpfSx0aHJvd0Vycm9yOmZ1bmN0aW9uKGEsYyxkKXtkPWR8fHRoaXMuaW5kZXg7Yz1CKGMpP1wicyBcIitjK1wiLVwiK3RoaXMuaW5kZXgrXCIgW1wiK3RoaXMudGV4dC5zdWJzdHJpbmcoYyxkKStcIl1cIjpcIiBcIitkO3Rocm93IERhKFwibGV4ZXJyXCIsYSxjLHRoaXMudGV4dCk7fSxyZWFkTnVtYmVyOmZ1bmN0aW9uKCl7Zm9yKHZhciBhPVwiXCIsYz10aGlzLmluZGV4O3RoaXMuaW5kZXg8dGhpcy50ZXh0Lmxlbmd0aDspe3ZhciBkPUwodGhpcy50ZXh0LmNoYXJBdCh0aGlzLmluZGV4KSk7XG5pZihcIi5cIj09ZHx8dGhpcy5pc051bWJlcihkKSlhKz1kO2Vsc2V7dmFyIGU9dGhpcy5wZWVrKCk7aWYoXCJlXCI9PWQmJnRoaXMuaXNFeHBPcGVyYXRvcihlKSlhKz1kO2Vsc2UgaWYodGhpcy5pc0V4cE9wZXJhdG9yKGQpJiZlJiZ0aGlzLmlzTnVtYmVyKGUpJiZcImVcIj09YS5jaGFyQXQoYS5sZW5ndGgtMSkpYSs9ZDtlbHNlIGlmKCF0aGlzLmlzRXhwT3BlcmF0b3IoZCl8fGUmJnRoaXMuaXNOdW1iZXIoZSl8fFwiZVwiIT1hLmNoYXJBdChhLmxlbmd0aC0xKSlicmVhaztlbHNlIHRoaXMudGhyb3dFcnJvcihcIkludmFsaWQgZXhwb25lbnRcIil9dGhpcy5pbmRleCsrfWEqPTE7dGhpcy50b2tlbnMucHVzaCh7aW5kZXg6Yyx0ZXh0OmEsbGl0ZXJhbDohMCxjb25zdGFudDohMCxmbjpmdW5jdGlvbigpe3JldHVybiBhfX0pfSxyZWFkSWRlbnQ6ZnVuY3Rpb24oKXtmb3IodmFyIGE9dGhpcyxjPVwiXCIsZD10aGlzLmluZGV4LGUsZyxmLGs7dGhpcy5pbmRleDx0aGlzLnRleHQubGVuZ3RoOyl7az10aGlzLnRleHQuY2hhckF0KHRoaXMuaW5kZXgpO1xuaWYoXCIuXCI9PT1rfHx0aGlzLmlzSWRlbnQoayl8fHRoaXMuaXNOdW1iZXIoaykpXCIuXCI9PT1rJiYoZT10aGlzLmluZGV4KSxjKz1rO2Vsc2UgYnJlYWs7dGhpcy5pbmRleCsrfWlmKGUpZm9yKGc9dGhpcy5pbmRleDtnPHRoaXMudGV4dC5sZW5ndGg7KXtrPXRoaXMudGV4dC5jaGFyQXQoZyk7aWYoXCIoXCI9PT1rKXtmPWMuc3Vic3RyKGUtZCsxKTtjPWMuc3Vic3RyKDAsZS1kKTt0aGlzLmluZGV4PWc7YnJlYWt9aWYodGhpcy5pc1doaXRlc3BhY2UoaykpZysrO2Vsc2UgYnJlYWt9ZD17aW5kZXg6ZCx0ZXh0OmN9O2lmKGNiLmhhc093blByb3BlcnR5KGMpKWQuZm49Y2JbY10sZC5saXRlcmFsPSEwLGQuY29uc3RhbnQ9ITA7ZWxzZXt2YXIgbT1GYyhjLHRoaXMub3B0aW9ucyx0aGlzLnRleHQpO2QuZm49SihmdW5jdGlvbihhLGMpe3JldHVybiBtKGEsYyl9LHthc3NpZ246ZnVuY3Rpb24oZCxlKXtyZXR1cm4gcmIoZCxjLGUsYS50ZXh0LGEub3B0aW9ucyl9fSl9dGhpcy50b2tlbnMucHVzaChkKTtcbmYmJih0aGlzLnRva2Vucy5wdXNoKHtpbmRleDplLHRleHQ6XCIuXCJ9KSx0aGlzLnRva2Vucy5wdXNoKHtpbmRleDplKzEsdGV4dDpmfSkpfSxyZWFkU3RyaW5nOmZ1bmN0aW9uKGEpe3ZhciBjPXRoaXMuaW5kZXg7dGhpcy5pbmRleCsrO2Zvcih2YXIgZD1cIlwiLGU9YSxnPSExO3RoaXMuaW5kZXg8dGhpcy50ZXh0Lmxlbmd0aDspe3ZhciBmPXRoaXMudGV4dC5jaGFyQXQodGhpcy5pbmRleCksZT1lK2Y7aWYoZylcInVcIj09PWY/KGY9dGhpcy50ZXh0LnN1YnN0cmluZyh0aGlzLmluZGV4KzEsdGhpcy5pbmRleCs1KSxmLm1hdGNoKC9bXFxkYS1mXXs0fS9pKXx8dGhpcy50aHJvd0Vycm9yKFwiSW52YWxpZCB1bmljb2RlIGVzY2FwZSBbXFxcXHVcIitmK1wiXVwiKSx0aGlzLmluZGV4Kz00LGQrPVN0cmluZy5mcm9tQ2hhckNvZGUocGFyc2VJbnQoZiwxNikpKTpkPShnPU9lW2ZdKT9kK2c6ZCtmLGc9ITE7ZWxzZSBpZihcIlxcXFxcIj09PWYpZz0hMDtlbHNle2lmKGY9PT1hKXt0aGlzLmluZGV4Kys7dGhpcy50b2tlbnMucHVzaCh7aW5kZXg6YyxcbnRleHQ6ZSxzdHJpbmc6ZCxsaXRlcmFsOiEwLGNvbnN0YW50OiEwLGZuOmZ1bmN0aW9uKCl7cmV0dXJuIGR9fSk7cmV0dXJufWQrPWZ9dGhpcy5pbmRleCsrfXRoaXMudGhyb3dFcnJvcihcIlVudGVybWluYXRlZCBxdW90ZVwiLGMpfX07dmFyIGJiPWZ1bmN0aW9uKGEsYyxkKXt0aGlzLmxleGVyPWE7dGhpcy4kZmlsdGVyPWM7dGhpcy5vcHRpb25zPWR9O2JiLlpFUk89SihmdW5jdGlvbigpe3JldHVybiAwfSx7Y29uc3RhbnQ6ITB9KTtiYi5wcm90b3R5cGU9e2NvbnN0cnVjdG9yOmJiLHBhcnNlOmZ1bmN0aW9uKGEpe3RoaXMudGV4dD1hO3RoaXMudG9rZW5zPXRoaXMubGV4ZXIubGV4KGEpO2E9dGhpcy5zdGF0ZW1lbnRzKCk7MCE9PXRoaXMudG9rZW5zLmxlbmd0aCYmdGhpcy50aHJvd0Vycm9yKFwiaXMgYW4gdW5leHBlY3RlZCB0b2tlblwiLHRoaXMudG9rZW5zWzBdKTthLmxpdGVyYWw9ISFhLmxpdGVyYWw7YS5jb25zdGFudD0hIWEuY29uc3RhbnQ7cmV0dXJuIGF9LHByaW1hcnk6ZnVuY3Rpb24oKXt2YXIgYTtcbmlmKHRoaXMuZXhwZWN0KFwiKFwiKSlhPXRoaXMuZmlsdGVyQ2hhaW4oKSx0aGlzLmNvbnN1bWUoXCIpXCIpO2Vsc2UgaWYodGhpcy5leHBlY3QoXCJbXCIpKWE9dGhpcy5hcnJheURlY2xhcmF0aW9uKCk7ZWxzZSBpZih0aGlzLmV4cGVjdChcIntcIikpYT10aGlzLm9iamVjdCgpO2Vsc2V7dmFyIGM9dGhpcy5leHBlY3QoKTsoYT1jLmZuKXx8dGhpcy50aHJvd0Vycm9yKFwibm90IGEgcHJpbWFyeSBleHByZXNzaW9uXCIsYyk7YS5saXRlcmFsPSEhYy5saXRlcmFsO2EuY29uc3RhbnQ9ISFjLmNvbnN0YW50fWZvcih2YXIgZDtjPXRoaXMuZXhwZWN0KFwiKFwiLFwiW1wiLFwiLlwiKTspXCIoXCI9PT1jLnRleHQ/KGE9dGhpcy5mdW5jdGlvbkNhbGwoYSxkKSxkPW51bGwpOlwiW1wiPT09Yy50ZXh0PyhkPWEsYT10aGlzLm9iamVjdEluZGV4KGEpKTpcIi5cIj09PWMudGV4dD8oZD1hLGE9dGhpcy5maWVsZEFjY2VzcyhhKSk6dGhpcy50aHJvd0Vycm9yKFwiSU1QT1NTSUJMRVwiKTtyZXR1cm4gYX0sdGhyb3dFcnJvcjpmdW5jdGlvbihhLFxuYyl7dGhyb3cgRGEoXCJzeW50YXhcIixjLnRleHQsYSxjLmluZGV4KzEsdGhpcy50ZXh0LHRoaXMudGV4dC5zdWJzdHJpbmcoYy5pbmRleCkpO30scGVla1Rva2VuOmZ1bmN0aW9uKCl7aWYoMD09PXRoaXMudG9rZW5zLmxlbmd0aCl0aHJvdyBEYShcInVlb2VcIix0aGlzLnRleHQpO3JldHVybiB0aGlzLnRva2Vuc1swXX0scGVlazpmdW5jdGlvbihhLGMsZCxlKXtpZigwPHRoaXMudG9rZW5zLmxlbmd0aCl7dmFyIGc9dGhpcy50b2tlbnNbMF0sZj1nLnRleHQ7aWYoZj09PWF8fGY9PT1jfHxmPT09ZHx8Zj09PWV8fCEoYXx8Y3x8ZHx8ZSkpcmV0dXJuIGd9cmV0dXJuITF9LGV4cGVjdDpmdW5jdGlvbihhLGMsZCxlKXtyZXR1cm4oYT10aGlzLnBlZWsoYSxjLGQsZSkpPyh0aGlzLnRva2Vucy5zaGlmdCgpLGEpOiExfSxjb25zdW1lOmZ1bmN0aW9uKGEpe3RoaXMuZXhwZWN0KGEpfHx0aGlzLnRocm93RXJyb3IoXCJpcyB1bmV4cGVjdGVkLCBleHBlY3RpbmcgW1wiK2ErXCJdXCIsdGhpcy5wZWVrKCkpfSxcbnVuYXJ5Rm46ZnVuY3Rpb24oYSxjKXtyZXR1cm4gSihmdW5jdGlvbihkLGUpe3JldHVybiBhKGQsZSxjKX0se2NvbnN0YW50OmMuY29uc3RhbnR9KX0sdGVybmFyeUZuOmZ1bmN0aW9uKGEsYyxkKXtyZXR1cm4gSihmdW5jdGlvbihlLGcpe3JldHVybiBhKGUsZyk/YyhlLGcpOmQoZSxnKX0se2NvbnN0YW50OmEuY29uc3RhbnQmJmMuY29uc3RhbnQmJmQuY29uc3RhbnR9KX0sYmluYXJ5Rm46ZnVuY3Rpb24oYSxjLGQpe3JldHVybiBKKGZ1bmN0aW9uKGUsZyl7cmV0dXJuIGMoZSxnLGEsZCl9LHtjb25zdGFudDphLmNvbnN0YW50JiZkLmNvbnN0YW50fSl9LHN0YXRlbWVudHM6ZnVuY3Rpb24oKXtmb3IodmFyIGE9W107OylpZigwPHRoaXMudG9rZW5zLmxlbmd0aCYmIXRoaXMucGVlayhcIn1cIixcIilcIixcIjtcIixcIl1cIikmJmEucHVzaCh0aGlzLmZpbHRlckNoYWluKCkpLCF0aGlzLmV4cGVjdChcIjtcIikpcmV0dXJuIDE9PT1hLmxlbmd0aD9hWzBdOmZ1bmN0aW9uKGMsZCl7Zm9yKHZhciBlLGc9XG4wO2c8YS5sZW5ndGg7ZysrKXt2YXIgZj1hW2ddO2YmJihlPWYoYyxkKSl9cmV0dXJuIGV9fSxmaWx0ZXJDaGFpbjpmdW5jdGlvbigpe2Zvcih2YXIgYT10aGlzLmV4cHJlc3Npb24oKSxjOzspaWYoYz10aGlzLmV4cGVjdChcInxcIikpYT10aGlzLmJpbmFyeUZuKGEsYy5mbix0aGlzLmZpbHRlcigpKTtlbHNlIHJldHVybiBhfSxmaWx0ZXI6ZnVuY3Rpb24oKXtmb3IodmFyIGE9dGhpcy5leHBlY3QoKSxjPXRoaXMuJGZpbHRlcihhLnRleHQpLGQ9W107OylpZihhPXRoaXMuZXhwZWN0KFwiOlwiKSlkLnB1c2godGhpcy5leHByZXNzaW9uKCkpO2Vsc2V7dmFyIGU9ZnVuY3Rpb24oYSxlLGspe2s9W2tdO2Zvcih2YXIgbT0wO208ZC5sZW5ndGg7bSsrKWsucHVzaChkW21dKGEsZSkpO3JldHVybiBjLmFwcGx5KGEsayl9O3JldHVybiBmdW5jdGlvbigpe3JldHVybiBlfX19LGV4cHJlc3Npb246ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5hc3NpZ25tZW50KCl9LGFzc2lnbm1lbnQ6ZnVuY3Rpb24oKXt2YXIgYT1cbnRoaXMudGVybmFyeSgpLGMsZDtyZXR1cm4oZD10aGlzLmV4cGVjdChcIj1cIikpPyhhLmFzc2lnbnx8dGhpcy50aHJvd0Vycm9yKFwiaW1wbGllcyBhc3NpZ25tZW50IGJ1dCBbXCIrdGhpcy50ZXh0LnN1YnN0cmluZygwLGQuaW5kZXgpK1wiXSBjYW4gbm90IGJlIGFzc2lnbmVkIHRvXCIsZCksYz10aGlzLnRlcm5hcnkoKSxmdW5jdGlvbihkLGcpe3JldHVybiBhLmFzc2lnbihkLGMoZCxnKSxnKX0pOmF9LHRlcm5hcnk6ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmxvZ2ljYWxPUigpLGMsZDtpZih0aGlzLmV4cGVjdChcIj9cIikpe2M9dGhpcy50ZXJuYXJ5KCk7aWYoZD10aGlzLmV4cGVjdChcIjpcIikpcmV0dXJuIHRoaXMudGVybmFyeUZuKGEsYyx0aGlzLnRlcm5hcnkoKSk7dGhpcy50aHJvd0Vycm9yKFwiZXhwZWN0ZWQgOlwiLGQpfWVsc2UgcmV0dXJuIGF9LGxvZ2ljYWxPUjpmdW5jdGlvbigpe2Zvcih2YXIgYT10aGlzLmxvZ2ljYWxBTkQoKSxjOzspaWYoYz10aGlzLmV4cGVjdChcInx8XCIpKWE9dGhpcy5iaW5hcnlGbihhLFxuYy5mbix0aGlzLmxvZ2ljYWxBTkQoKSk7ZWxzZSByZXR1cm4gYX0sbG9naWNhbEFORDpmdW5jdGlvbigpe3ZhciBhPXRoaXMuZXF1YWxpdHkoKSxjO2lmKGM9dGhpcy5leHBlY3QoXCImJlwiKSlhPXRoaXMuYmluYXJ5Rm4oYSxjLmZuLHRoaXMubG9naWNhbEFORCgpKTtyZXR1cm4gYX0sZXF1YWxpdHk6ZnVuY3Rpb24oKXt2YXIgYT10aGlzLnJlbGF0aW9uYWwoKSxjO2lmKGM9dGhpcy5leHBlY3QoXCI9PVwiLFwiIT1cIixcIj09PVwiLFwiIT09XCIpKWE9dGhpcy5iaW5hcnlGbihhLGMuZm4sdGhpcy5lcXVhbGl0eSgpKTtyZXR1cm4gYX0scmVsYXRpb25hbDpmdW5jdGlvbigpe3ZhciBhPXRoaXMuYWRkaXRpdmUoKSxjO2lmKGM9dGhpcy5leHBlY3QoXCI8XCIsXCI+XCIsXCI8PVwiLFwiPj1cIikpYT10aGlzLmJpbmFyeUZuKGEsYy5mbix0aGlzLnJlbGF0aW9uYWwoKSk7cmV0dXJuIGF9LGFkZGl0aXZlOmZ1bmN0aW9uKCl7Zm9yKHZhciBhPXRoaXMubXVsdGlwbGljYXRpdmUoKSxjO2M9dGhpcy5leHBlY3QoXCIrXCIsXG5cIi1cIik7KWE9dGhpcy5iaW5hcnlGbihhLGMuZm4sdGhpcy5tdWx0aXBsaWNhdGl2ZSgpKTtyZXR1cm4gYX0sbXVsdGlwbGljYXRpdmU6ZnVuY3Rpb24oKXtmb3IodmFyIGE9dGhpcy51bmFyeSgpLGM7Yz10aGlzLmV4cGVjdChcIipcIixcIi9cIixcIiVcIik7KWE9dGhpcy5iaW5hcnlGbihhLGMuZm4sdGhpcy51bmFyeSgpKTtyZXR1cm4gYX0sdW5hcnk6ZnVuY3Rpb24oKXt2YXIgYTtyZXR1cm4gdGhpcy5leHBlY3QoXCIrXCIpP3RoaXMucHJpbWFyeSgpOihhPXRoaXMuZXhwZWN0KFwiLVwiKSk/dGhpcy5iaW5hcnlGbihiYi5aRVJPLGEuZm4sdGhpcy51bmFyeSgpKTooYT10aGlzLmV4cGVjdChcIiFcIikpP3RoaXMudW5hcnlGbihhLmZuLHRoaXMudW5hcnkoKSk6dGhpcy5wcmltYXJ5KCl9LGZpZWxkQWNjZXNzOmZ1bmN0aW9uKGEpe3ZhciBjPXRoaXMsZD10aGlzLmV4cGVjdCgpLnRleHQsZT1GYyhkLHRoaXMub3B0aW9ucyx0aGlzLnRleHQpO3JldHVybiBKKGZ1bmN0aW9uKGMsZCxrKXtyZXR1cm4gZShrfHxcbmEoYyxkKSl9LHthc3NpZ246ZnVuY3Rpb24oZSxmLGspe3JldHVybiByYihhKGUsayksZCxmLGMudGV4dCxjLm9wdGlvbnMpfX0pfSxvYmplY3RJbmRleDpmdW5jdGlvbihhKXt2YXIgYz10aGlzLGQ9dGhpcy5leHByZXNzaW9uKCk7dGhpcy5jb25zdW1lKFwiXVwiKTtyZXR1cm4gSihmdW5jdGlvbihlLGcpe3ZhciBmPWEoZSxnKSxrPWQoZSxnKSxtO2lmKCFmKXJldHVybiBzOyhmPWFiKGZba10sYy50ZXh0KSkmJihmLnRoZW4mJmMub3B0aW9ucy51bndyYXBQcm9taXNlcykmJihtPWYsXCIkJHZcImluIGZ8fChtLiQkdj1zLG0udGhlbihmdW5jdGlvbihhKXttLiQkdj1hfSkpLGY9Zi4kJHYpO3JldHVybiBmfSx7YXNzaWduOmZ1bmN0aW9uKGUsZyxmKXt2YXIgaz1kKGUsZik7cmV0dXJuIGFiKGEoZSxmKSxjLnRleHQpW2tdPWd9fSl9LGZ1bmN0aW9uQ2FsbDpmdW5jdGlvbihhLGMpe3ZhciBkPVtdO2lmKFwiKVwiIT09dGhpcy5wZWVrVG9rZW4oKS50ZXh0KXtkbyBkLnB1c2godGhpcy5leHByZXNzaW9uKCkpO1xud2hpbGUodGhpcy5leHBlY3QoXCIsXCIpKX10aGlzLmNvbnN1bWUoXCIpXCIpO3ZhciBlPXRoaXM7cmV0dXJuIGZ1bmN0aW9uKGcsZil7Zm9yKHZhciBrPVtdLG09Yz9jKGcsZik6ZyxoPTA7aDxkLmxlbmd0aDtoKyspay5wdXNoKGRbaF0oZyxmKSk7aD1hKGcsZixtKXx8eTthYihtLGUudGV4dCk7YWIoaCxlLnRleHQpO2s9aC5hcHBseT9oLmFwcGx5KG0sayk6aChrWzBdLGtbMV0sa1syXSxrWzNdLGtbNF0pO3JldHVybiBhYihrLGUudGV4dCl9fSxhcnJheURlY2xhcmF0aW9uOmZ1bmN0aW9uKCl7dmFyIGE9W10sYz0hMDtpZihcIl1cIiE9PXRoaXMucGVla1Rva2VuKCkudGV4dCl7ZG97aWYodGhpcy5wZWVrKFwiXVwiKSlicmVhazt2YXIgZD10aGlzLmV4cHJlc3Npb24oKTthLnB1c2goZCk7ZC5jb25zdGFudHx8KGM9ITEpfXdoaWxlKHRoaXMuZXhwZWN0KFwiLFwiKSl9dGhpcy5jb25zdW1lKFwiXVwiKTtyZXR1cm4gSihmdW5jdGlvbihjLGQpe2Zvcih2YXIgZj1bXSxrPTA7azxhLmxlbmd0aDtrKyspZi5wdXNoKGFba10oYyxcbmQpKTtyZXR1cm4gZn0se2xpdGVyYWw6ITAsY29uc3RhbnQ6Y30pfSxvYmplY3Q6ZnVuY3Rpb24oKXt2YXIgYT1bXSxjPSEwO2lmKFwifVwiIT09dGhpcy5wZWVrVG9rZW4oKS50ZXh0KXtkb3tpZih0aGlzLnBlZWsoXCJ9XCIpKWJyZWFrO3ZhciBkPXRoaXMuZXhwZWN0KCksZD1kLnN0cmluZ3x8ZC50ZXh0O3RoaXMuY29uc3VtZShcIjpcIik7dmFyIGU9dGhpcy5leHByZXNzaW9uKCk7YS5wdXNoKHtrZXk6ZCx2YWx1ZTplfSk7ZS5jb25zdGFudHx8KGM9ITEpfXdoaWxlKHRoaXMuZXhwZWN0KFwiLFwiKSl9dGhpcy5jb25zdW1lKFwifVwiKTtyZXR1cm4gSihmdW5jdGlvbihjLGQpe2Zvcih2YXIgZT17fSxtPTA7bTxhLmxlbmd0aDttKyspe3ZhciBoPWFbbV07ZVtoLmtleV09aC52YWx1ZShjLGQpfXJldHVybiBlfSx7bGl0ZXJhbDohMCxjb25zdGFudDpjfSl9fTt2YXIgU2I9e30sdWE9dChcIiRzY2VcIiksZmE9e0hUTUw6XCJodG1sXCIsQ1NTOlwiY3NzXCIsVVJMOlwidXJsXCIsUkVTT1VSQ0VfVVJMOlwicmVzb3VyY2VVcmxcIixcbkpTOlwianNcIn0sVz1WLmNyZWF0ZUVsZW1lbnQoXCJhXCIpLEljPXNhKFQubG9jYXRpb24uaHJlZiwhMCk7a2MuJGluamVjdD1bXCIkcHJvdmlkZVwiXTtKYy4kaW5qZWN0PVtcIiRsb2NhbGVcIl07TGMuJGluamVjdD1bXCIkbG9jYWxlXCJdO3ZhciBPYz1cIi5cIixKZT17eXl5eTpZKFwiRnVsbFllYXJcIiw0KSx5eTpZKFwiRnVsbFllYXJcIiwyLDAsITApLHk6WShcIkZ1bGxZZWFyXCIsMSksTU1NTTpzYihcIk1vbnRoXCIpLE1NTTpzYihcIk1vbnRoXCIsITApLE1NOlkoXCJNb250aFwiLDIsMSksTTpZKFwiTW9udGhcIiwxLDEpLGRkOlkoXCJEYXRlXCIsMiksZDpZKFwiRGF0ZVwiLDEpLEhIOlkoXCJIb3Vyc1wiLDIpLEg6WShcIkhvdXJzXCIsMSksaGg6WShcIkhvdXJzXCIsMiwtMTIpLGg6WShcIkhvdXJzXCIsMSwtMTIpLG1tOlkoXCJNaW51dGVzXCIsMiksbTpZKFwiTWludXRlc1wiLDEpLHNzOlkoXCJTZWNvbmRzXCIsMiksczpZKFwiU2Vjb25kc1wiLDEpLHNzczpZKFwiTWlsbGlzZWNvbmRzXCIsMyksRUVFRTpzYihcIkRheVwiKSxFRUU6c2IoXCJEYXlcIiwhMCksXG5hOmZ1bmN0aW9uKGEsYyl7cmV0dXJuIDEyPmEuZ2V0SG91cnMoKT9jLkFNUE1TWzBdOmMuQU1QTVNbMV19LFo6ZnVuY3Rpb24oYSl7YT0tMSphLmdldFRpbWV6b25lT2Zmc2V0KCk7cmV0dXJuIGE9KDA8PWE/XCIrXCI6XCJcIikrKFViKE1hdGhbMDxhP1wiZmxvb3JcIjpcImNlaWxcIl0oYS82MCksMikrVWIoTWF0aC5hYnMoYSU2MCksMikpfX0sSWU9LygoPzpbXnlNZEhobXNhWkUnXSspfCg/OicoPzpbXiddfCcnKSonKXwoPzpFK3x5K3xNK3xkK3xIK3xoK3xtK3xzK3xhfFopKSguKikvLEhlPS9eXFwtP1xcZCskLztLYy4kaW5qZWN0PVtcIiRsb2NhbGVcIl07dmFyIEZlPSQoTCksR2U9JChIYSk7TWMuJGluamVjdD1bXCIkcGFyc2VcIl07dmFyIGNkPSQoe3Jlc3RyaWN0OlwiRVwiLGNvbXBpbGU6ZnVuY3Rpb24oYSxjKXs4Pj1TJiYoYy5ocmVmfHxjLm5hbWV8fGMuJHNldChcImhyZWZcIixcIlwiKSxhLmFwcGVuZChWLmNyZWF0ZUNvbW1lbnQoXCJJRSBmaXhcIikpKTtpZighYy5ocmVmJiYhYy54bGlua0hyZWYmJiFjLm5hbWUpcmV0dXJuIGZ1bmN0aW9uKGEsXG5jKXt2YXIgZz1cIltvYmplY3QgU1ZHQW5pbWF0ZWRTdHJpbmddXCI9PT13YS5jYWxsKGMucHJvcChcImhyZWZcIikpP1wieGxpbms6aHJlZlwiOlwiaHJlZlwiO2Mub24oXCJjbGlja1wiLGZ1bmN0aW9uKGEpe2MuYXR0cihnKXx8YS5wcmV2ZW50RGVmYXVsdCgpfSl9fX0pLEViPXt9O3EobWIsZnVuY3Rpb24oYSxjKXtpZihcIm11bHRpcGxlXCIhPWEpe3ZhciBkPW1hKFwibmctXCIrYyk7RWJbZF09ZnVuY3Rpb24oKXtyZXR1cm57cHJpb3JpdHk6MTAwLGxpbms6ZnVuY3Rpb24oYSxnLGYpe2EuJHdhdGNoKGZbZF0sZnVuY3Rpb24oYSl7Zi4kc2V0KGMsISFhKX0pfX19fX0pO3EoW1wic3JjXCIsXCJzcmNzZXRcIixcImhyZWZcIl0sZnVuY3Rpb24oYSl7dmFyIGM9bWEoXCJuZy1cIithKTtFYltjXT1mdW5jdGlvbigpe3JldHVybntwcmlvcml0eTo5OSxsaW5rOmZ1bmN0aW9uKGQsZSxnKXt2YXIgZj1hLGs9YTtcImhyZWZcIj09PWEmJlwiW29iamVjdCBTVkdBbmltYXRlZFN0cmluZ11cIj09PXdhLmNhbGwoZS5wcm9wKFwiaHJlZlwiKSkmJlxuKGs9XCJ4bGlua0hyZWZcIixnLiRhdHRyW2tdPVwieGxpbms6aHJlZlwiLGY9bnVsbCk7Zy4kb2JzZXJ2ZShjLGZ1bmN0aW9uKGEpe2EmJihnLiRzZXQoayxhKSxTJiZmJiZlLnByb3AoZixnW2tdKSl9KX19fX0pO3ZhciB2Yj17JGFkZENvbnRyb2w6eSwkcmVtb3ZlQ29udHJvbDp5LCRzZXRWYWxpZGl0eTp5LCRzZXREaXJ0eTp5LCRzZXRQcmlzdGluZTp5fTtQYy4kaW5qZWN0PVtcIiRlbGVtZW50XCIsXCIkYXR0cnNcIixcIiRzY29wZVwiLFwiJGFuaW1hdGVcIl07dmFyIFFjPWZ1bmN0aW9uKGEpe3JldHVybltcIiR0aW1lb3V0XCIsZnVuY3Rpb24oYyl7cmV0dXJue25hbWU6XCJmb3JtXCIscmVzdHJpY3Q6YT9cIkVBQ1wiOlwiRVwiLGNvbnRyb2xsZXI6UGMsY29tcGlsZTpmdW5jdGlvbigpe3JldHVybntwcmU6ZnVuY3Rpb24oYSxlLGcsZil7aWYoIWcuYWN0aW9uKXt2YXIgaz1mdW5jdGlvbihhKXthLnByZXZlbnREZWZhdWx0P2EucHJldmVudERlZmF1bHQoKTphLnJldHVyblZhbHVlPSExfTtwYihlWzBdLFwic3VibWl0XCIsXG5rKTtlLm9uKFwiJGRlc3Ryb3lcIixmdW5jdGlvbigpe2MoZnVuY3Rpb24oKXtXYShlWzBdLFwic3VibWl0XCIsayl9LDAsITEpfSl9dmFyIG09ZS5wYXJlbnQoKS5jb250cm9sbGVyKFwiZm9ybVwiKSxoPWcubmFtZXx8Zy5uZ0Zvcm07aCYmcmIoYSxoLGYsaCk7aWYobSllLm9uKFwiJGRlc3Ryb3lcIixmdW5jdGlvbigpe20uJHJlbW92ZUNvbnRyb2woZik7aCYmcmIoYSxoLHMsaCk7SihmLHZiKX0pfX19fX1dfSxkZD1RYygpLHFkPVFjKCEwKSxQZT0vXihmdHB8aHR0cHxodHRwcyk6XFwvXFwvKFxcdys6ezAsMX1cXHcqQCk/KFxcUyspKDpbMC05XSspPyhcXC98XFwvKFtcXHcjITouPys9JiVAIVxcLVxcL10pKT8kLyxRZT0vXlthLXowLTkhIyQlJicqKy89P15fYHt8fX4uLV0rQFthLXowLTktXSsoXFwuW2EtejAtOS1dKykqJC9pLFJlPS9eXFxzKihcXC18XFwrKT8oXFxkK3woXFxkKihcXC5cXGQqKSkpXFxzKiQvLFJjPXt0ZXh0OnhiLG51bWJlcjpmdW5jdGlvbihhLGMsZCxlLGcsZil7eGIoYSxjLGQsZSxnLGYpO2UuJHBhcnNlcnMucHVzaChmdW5jdGlvbihhKXt2YXIgYz1cbmUuJGlzRW1wdHkoYSk7aWYoY3x8UmUudGVzdChhKSlyZXR1cm4gZS4kc2V0VmFsaWRpdHkoXCJudW1iZXJcIiwhMCksXCJcIj09PWE/bnVsbDpjP2E6cGFyc2VGbG9hdChhKTtlLiRzZXRWYWxpZGl0eShcIm51bWJlclwiLCExKTtyZXR1cm4gc30pO0tlKGUsXCJudW1iZXJcIixjKTtlLiRmb3JtYXR0ZXJzLnB1c2goZnVuY3Rpb24oYSl7cmV0dXJuIGUuJGlzRW1wdHkoYSk/XCJcIjpcIlwiK2F9KTtkLm1pbiYmKGE9ZnVuY3Rpb24oYSl7dmFyIGM9cGFyc2VGbG9hdChkLm1pbik7cmV0dXJuIHFhKGUsXCJtaW5cIixlLiRpc0VtcHR5KGEpfHxhPj1jLGEpfSxlLiRwYXJzZXJzLnB1c2goYSksZS4kZm9ybWF0dGVycy5wdXNoKGEpKTtkLm1heCYmKGE9ZnVuY3Rpb24oYSl7dmFyIGM9cGFyc2VGbG9hdChkLm1heCk7cmV0dXJuIHFhKGUsXCJtYXhcIixlLiRpc0VtcHR5KGEpfHxhPD1jLGEpfSxlLiRwYXJzZXJzLnB1c2goYSksZS4kZm9ybWF0dGVycy5wdXNoKGEpKTtlLiRmb3JtYXR0ZXJzLnB1c2goZnVuY3Rpb24oYSl7cmV0dXJuIHFhKGUsXG5cIm51bWJlclwiLGUuJGlzRW1wdHkoYSl8fHliKGEpLGEpfSl9LHVybDpmdW5jdGlvbihhLGMsZCxlLGcsZil7eGIoYSxjLGQsZSxnLGYpO2E9ZnVuY3Rpb24oYSl7cmV0dXJuIHFhKGUsXCJ1cmxcIixlLiRpc0VtcHR5KGEpfHxQZS50ZXN0KGEpLGEpfTtlLiRmb3JtYXR0ZXJzLnB1c2goYSk7ZS4kcGFyc2Vycy5wdXNoKGEpfSxlbWFpbDpmdW5jdGlvbihhLGMsZCxlLGcsZil7eGIoYSxjLGQsZSxnLGYpO2E9ZnVuY3Rpb24oYSl7cmV0dXJuIHFhKGUsXCJlbWFpbFwiLGUuJGlzRW1wdHkoYSl8fFFlLnRlc3QoYSksYSl9O2UuJGZvcm1hdHRlcnMucHVzaChhKTtlLiRwYXJzZXJzLnB1c2goYSl9LHJhZGlvOmZ1bmN0aW9uKGEsYyxkLGUpe0QoZC5uYW1lKSYmYy5hdHRyKFwibmFtZVwiLGViKCkpO2Mub24oXCJjbGlja1wiLGZ1bmN0aW9uKCl7Y1swXS5jaGVja2VkJiZhLiRhcHBseShmdW5jdGlvbigpe2UuJHNldFZpZXdWYWx1ZShkLnZhbHVlKX0pfSk7ZS4kcmVuZGVyPWZ1bmN0aW9uKCl7Y1swXS5jaGVja2VkPVxuZC52YWx1ZT09ZS4kdmlld1ZhbHVlfTtkLiRvYnNlcnZlKFwidmFsdWVcIixlLiRyZW5kZXIpfSxjaGVja2JveDpmdW5jdGlvbihhLGMsZCxlKXt2YXIgZz1kLm5nVHJ1ZVZhbHVlLGY9ZC5uZ0ZhbHNlVmFsdWU7QyhnKXx8KGc9ITApO0MoZil8fChmPSExKTtjLm9uKFwiY2xpY2tcIixmdW5jdGlvbigpe2EuJGFwcGx5KGZ1bmN0aW9uKCl7ZS4kc2V0Vmlld1ZhbHVlKGNbMF0uY2hlY2tlZCl9KX0pO2UuJHJlbmRlcj1mdW5jdGlvbigpe2NbMF0uY2hlY2tlZD1lLiR2aWV3VmFsdWV9O2UuJGlzRW1wdHk9ZnVuY3Rpb24oYSl7cmV0dXJuIGEhPT1nfTtlLiRmb3JtYXR0ZXJzLnB1c2goZnVuY3Rpb24oYSl7cmV0dXJuIGE9PT1nfSk7ZS4kcGFyc2Vycy5wdXNoKGZ1bmN0aW9uKGEpe3JldHVybiBhP2c6Zn0pfSxoaWRkZW46eSxidXR0b246eSxzdWJtaXQ6eSxyZXNldDp5LGZpbGU6eX0saGM9W1wiJGJyb3dzZXJcIixcIiRzbmlmZmVyXCIsZnVuY3Rpb24oYSxjKXtyZXR1cm57cmVzdHJpY3Q6XCJFXCIscmVxdWlyZTpcIj9uZ01vZGVsXCIsXG5saW5rOmZ1bmN0aW9uKGQsZSxnLGYpe2YmJihSY1tMKGcudHlwZSldfHxSYy50ZXh0KShkLGUsZyxmLGMsYSl9fX1dLHViPVwibmctdmFsaWRcIix0Yj1cIm5nLWludmFsaWRcIixNYT1cIm5nLXByaXN0aW5lXCIsd2I9XCJuZy1kaXJ0eVwiLFNlPVtcIiRzY29wZVwiLFwiJGV4Y2VwdGlvbkhhbmRsZXJcIixcIiRhdHRyc1wiLFwiJGVsZW1lbnRcIixcIiRwYXJzZVwiLFwiJGFuaW1hdGVcIixmdW5jdGlvbihhLGMsZCxlLGcsZil7ZnVuY3Rpb24gayhhLGMpe2M9Yz9cIi1cIitoYihjLFwiLVwiKTpcIlwiO2YucmVtb3ZlQ2xhc3MoZSwoYT90Yjp1YikrYyk7Zi5hZGRDbGFzcyhlLChhP3ViOnRiKStjKX10aGlzLiRtb2RlbFZhbHVlPXRoaXMuJHZpZXdWYWx1ZT1OdW1iZXIuTmFOO3RoaXMuJHBhcnNlcnM9W107dGhpcy4kZm9ybWF0dGVycz1bXTt0aGlzLiR2aWV3Q2hhbmdlTGlzdGVuZXJzPVtdO3RoaXMuJHByaXN0aW5lPSEwO3RoaXMuJGRpcnR5PSExO3RoaXMuJHZhbGlkPSEwO3RoaXMuJGludmFsaWQ9ITE7dGhpcy4kbmFtZT1cbmQubmFtZTt2YXIgbT1nKGQubmdNb2RlbCksaD1tLmFzc2lnbjtpZighaCl0aHJvdyB0KFwibmdNb2RlbFwiKShcIm5vbmFzc2lnblwiLGQubmdNb2RlbCxnYShlKSk7dGhpcy4kcmVuZGVyPXk7dGhpcy4kaXNFbXB0eT1mdW5jdGlvbihhKXtyZXR1cm4gRChhKXx8XCJcIj09PWF8fG51bGw9PT1hfHxhIT09YX07dmFyIGw9ZS5pbmhlcml0ZWREYXRhKFwiJGZvcm1Db250cm9sbGVyXCIpfHx2YixuPTAscD10aGlzLiRlcnJvcj17fTtlLmFkZENsYXNzKE1hKTtrKCEwKTt0aGlzLiRzZXRWYWxpZGl0eT1mdW5jdGlvbihhLGMpe3BbYV0hPT0hYyYmKGM/KHBbYV0mJm4tLSxufHwoayghMCksdGhpcy4kdmFsaWQ9ITAsdGhpcy4kaW52YWxpZD0hMSkpOihrKCExKSx0aGlzLiRpbnZhbGlkPSEwLHRoaXMuJHZhbGlkPSExLG4rKykscFthXT0hYyxrKGMsYSksbC4kc2V0VmFsaWRpdHkoYSxjLHRoaXMpKX07dGhpcy4kc2V0UHJpc3RpbmU9ZnVuY3Rpb24oKXt0aGlzLiRkaXJ0eT0hMTt0aGlzLiRwcmlzdGluZT1cbiEwO2YucmVtb3ZlQ2xhc3MoZSx3Yik7Zi5hZGRDbGFzcyhlLE1hKX07dGhpcy4kc2V0Vmlld1ZhbHVlPWZ1bmN0aW9uKGQpe3RoaXMuJHZpZXdWYWx1ZT1kO3RoaXMuJHByaXN0aW5lJiYodGhpcy4kZGlydHk9ITAsdGhpcy4kcHJpc3RpbmU9ITEsZi5yZW1vdmVDbGFzcyhlLE1hKSxmLmFkZENsYXNzKGUsd2IpLGwuJHNldERpcnR5KCkpO3EodGhpcy4kcGFyc2VycyxmdW5jdGlvbihhKXtkPWEoZCl9KTt0aGlzLiRtb2RlbFZhbHVlIT09ZCYmKHRoaXMuJG1vZGVsVmFsdWU9ZCxoKGEsZCkscSh0aGlzLiR2aWV3Q2hhbmdlTGlzdGVuZXJzLGZ1bmN0aW9uKGEpe3RyeXthKCl9Y2F0Y2goZCl7YyhkKX19KSl9O3ZhciByPXRoaXM7YS4kd2F0Y2goZnVuY3Rpb24oKXt2YXIgYz1tKGEpO2lmKHIuJG1vZGVsVmFsdWUhPT1jKXt2YXIgZD1yLiRmb3JtYXR0ZXJzLGU9ZC5sZW5ndGg7Zm9yKHIuJG1vZGVsVmFsdWU9YztlLS07KWM9ZFtlXShjKTtyLiR2aWV3VmFsdWUhPT1jJiYoci4kdmlld1ZhbHVlPVxuYyxyLiRyZW5kZXIoKSl9cmV0dXJuIGN9KX1dLEZkPWZ1bmN0aW9uKCl7cmV0dXJue3JlcXVpcmU6W1wibmdNb2RlbFwiLFwiXj9mb3JtXCJdLGNvbnRyb2xsZXI6U2UsbGluazpmdW5jdGlvbihhLGMsZCxlKXt2YXIgZz1lWzBdLGY9ZVsxXXx8dmI7Zi4kYWRkQ29udHJvbChnKTthLiRvbihcIiRkZXN0cm95XCIsZnVuY3Rpb24oKXtmLiRyZW1vdmVDb250cm9sKGcpfSl9fX0sSGQ9JCh7cmVxdWlyZTpcIm5nTW9kZWxcIixsaW5rOmZ1bmN0aW9uKGEsYyxkLGUpe2UuJHZpZXdDaGFuZ2VMaXN0ZW5lcnMucHVzaChmdW5jdGlvbigpe2EuJGV2YWwoZC5uZ0NoYW5nZSl9KX19KSxpYz1mdW5jdGlvbigpe3JldHVybntyZXF1aXJlOlwiP25nTW9kZWxcIixsaW5rOmZ1bmN0aW9uKGEsYyxkLGUpe2lmKGUpe2QucmVxdWlyZWQ9ITA7dmFyIGc9ZnVuY3Rpb24oYSl7aWYoZC5yZXF1aXJlZCYmZS4kaXNFbXB0eShhKSllLiRzZXRWYWxpZGl0eShcInJlcXVpcmVkXCIsITEpO2Vsc2UgcmV0dXJuIGUuJHNldFZhbGlkaXR5KFwicmVxdWlyZWRcIixcbiEwKSxhfTtlLiRmb3JtYXR0ZXJzLnB1c2goZyk7ZS4kcGFyc2Vycy51bnNoaWZ0KGcpO2QuJG9ic2VydmUoXCJyZXF1aXJlZFwiLGZ1bmN0aW9uKCl7ZyhlLiR2aWV3VmFsdWUpfSl9fX19LEdkPWZ1bmN0aW9uKCl7cmV0dXJue3JlcXVpcmU6XCJuZ01vZGVsXCIsbGluazpmdW5jdGlvbihhLGMsZCxlKXt2YXIgZz0oYT0vXFwvKC4qKVxcLy8uZXhlYyhkLm5nTGlzdCkpJiZSZWdFeHAoYVsxXSl8fGQubmdMaXN0fHxcIixcIjtlLiRwYXJzZXJzLnB1c2goZnVuY3Rpb24oYSl7aWYoIUQoYSkpe3ZhciBjPVtdO2EmJnEoYS5zcGxpdChnKSxmdW5jdGlvbihhKXthJiZjLnB1c2goYWEoYSkpfSk7cmV0dXJuIGN9fSk7ZS4kZm9ybWF0dGVycy5wdXNoKGZ1bmN0aW9uKGEpe3JldHVybiBPKGEpP2Euam9pbihcIiwgXCIpOnN9KTtlLiRpc0VtcHR5PWZ1bmN0aW9uKGEpe3JldHVybiFhfHwhYS5sZW5ndGh9fX19LFRlPS9eKHRydWV8ZmFsc2V8XFxkKykkLyxJZD1mdW5jdGlvbigpe3JldHVybntwcmlvcml0eToxMDAsXG5jb21waWxlOmZ1bmN0aW9uKGEsYyl7cmV0dXJuIFRlLnRlc3QoYy5uZ1ZhbHVlKT9mdW5jdGlvbihhLGMsZyl7Zy4kc2V0KFwidmFsdWVcIixhLiRldmFsKGcubmdWYWx1ZSkpfTpmdW5jdGlvbihhLGMsZyl7YS4kd2F0Y2goZy5uZ1ZhbHVlLGZ1bmN0aW9uKGEpe2cuJHNldChcInZhbHVlXCIsYSl9KX19fX0saWQ9dmEoe2NvbXBpbGU6ZnVuY3Rpb24oYSl7YS5hZGRDbGFzcyhcIm5nLWJpbmRpbmdcIik7cmV0dXJuIGZ1bmN0aW9uKGEsZCxlKXtkLmRhdGEoXCIkYmluZGluZ1wiLGUubmdCaW5kKTthLiR3YXRjaChlLm5nQmluZCxmdW5jdGlvbihhKXtkLnRleHQoYT09cz9cIlwiOmEpfSl9fX0pLGtkPVtcIiRpbnRlcnBvbGF0ZVwiLGZ1bmN0aW9uKGEpe3JldHVybiBmdW5jdGlvbihjLGQsZSl7Yz1hKGQuYXR0cihlLiRhdHRyLm5nQmluZFRlbXBsYXRlKSk7ZC5hZGRDbGFzcyhcIm5nLWJpbmRpbmdcIikuZGF0YShcIiRiaW5kaW5nXCIsYyk7ZS4kb2JzZXJ2ZShcIm5nQmluZFRlbXBsYXRlXCIsZnVuY3Rpb24oYSl7ZC50ZXh0KGEpfSl9fV0sXG5qZD1bXCIkc2NlXCIsXCIkcGFyc2VcIixmdW5jdGlvbihhLGMpe3JldHVybiBmdW5jdGlvbihkLGUsZyl7ZS5hZGRDbGFzcyhcIm5nLWJpbmRpbmdcIikuZGF0YShcIiRiaW5kaW5nXCIsZy5uZ0JpbmRIdG1sKTt2YXIgZj1jKGcubmdCaW5kSHRtbCk7ZC4kd2F0Y2goZnVuY3Rpb24oKXtyZXR1cm4oZihkKXx8XCJcIikudG9TdHJpbmcoKX0sZnVuY3Rpb24oYyl7ZS5odG1sKGEuZ2V0VHJ1c3RlZEh0bWwoZihkKSl8fFwiXCIpfSl9fV0sbGQ9VmIoXCJcIiwhMCksbmQ9VmIoXCJPZGRcIiwwKSxtZD1WYihcIkV2ZW5cIiwxKSxvZD12YSh7Y29tcGlsZTpmdW5jdGlvbihhLGMpe2MuJHNldChcIm5nQ2xvYWtcIixzKTthLnJlbW92ZUNsYXNzKFwibmctY2xvYWtcIil9fSkscGQ9W2Z1bmN0aW9uKCl7cmV0dXJue3Njb3BlOiEwLGNvbnRyb2xsZXI6XCJAXCIscHJpb3JpdHk6NTAwfX1dLGpjPXt9O3EoXCJjbGljayBkYmxjbGljayBtb3VzZWRvd24gbW91c2V1cCBtb3VzZW92ZXIgbW91c2VvdXQgbW91c2Vtb3ZlIG1vdXNlZW50ZXIgbW91c2VsZWF2ZSBrZXlkb3duIGtleXVwIGtleXByZXNzIHN1Ym1pdCBmb2N1cyBibHVyIGNvcHkgY3V0IHBhc3RlXCIuc3BsaXQoXCIgXCIpLFxuZnVuY3Rpb24oYSl7dmFyIGM9bWEoXCJuZy1cIithKTtqY1tjXT1bXCIkcGFyc2VcIixmdW5jdGlvbihkKXtyZXR1cm57Y29tcGlsZTpmdW5jdGlvbihlLGcpe3ZhciBmPWQoZ1tjXSk7cmV0dXJuIGZ1bmN0aW9uKGMsZCl7ZC5vbihMKGEpLGZ1bmN0aW9uKGEpe2MuJGFwcGx5KGZ1bmN0aW9uKCl7ZihjLHskZXZlbnQ6YX0pfSl9KX19fX1dfSk7dmFyIHNkPVtcIiRhbmltYXRlXCIsZnVuY3Rpb24oYSl7cmV0dXJue3RyYW5zY2x1ZGU6XCJlbGVtZW50XCIscHJpb3JpdHk6NjAwLHRlcm1pbmFsOiEwLHJlc3RyaWN0OlwiQVwiLCQkdGxiOiEwLGxpbms6ZnVuY3Rpb24oYyxkLGUsZyxmKXt2YXIgayxtLGg7Yy4kd2F0Y2goZS5uZ0lmLGZ1bmN0aW9uKGcpe1JhKGcpP218fChtPWMuJG5ldygpLGYobSxmdW5jdGlvbihjKXtjW2MubGVuZ3RoKytdPVYuY3JlYXRlQ29tbWVudChcIiBlbmQgbmdJZjogXCIrZS5uZ0lmK1wiIFwiKTtrPXtjbG9uZTpjfTthLmVudGVyKGMsZC5wYXJlbnQoKSxkKX0pKTooaCYmKGgucmVtb3ZlKCksXG5oPW51bGwpLG0mJihtLiRkZXN0cm95KCksbT1udWxsKSxrJiYoaD1EYihrLmNsb25lKSxhLmxlYXZlKGgsZnVuY3Rpb24oKXtoPW51bGx9KSxrPW51bGwpKX0pfX19XSx0ZD1bXCIkaHR0cFwiLFwiJHRlbXBsYXRlQ2FjaGVcIixcIiRhbmNob3JTY3JvbGxcIixcIiRhbmltYXRlXCIsXCIkc2NlXCIsZnVuY3Rpb24oYSxjLGQsZSxnKXtyZXR1cm57cmVzdHJpY3Q6XCJFQ0FcIixwcmlvcml0eTo0MDAsdGVybWluYWw6ITAsdHJhbnNjbHVkZTpcImVsZW1lbnRcIixjb250cm9sbGVyOlNhLm5vb3AsY29tcGlsZTpmdW5jdGlvbihmLGspe3ZhciBtPWsubmdJbmNsdWRlfHxrLnNyYyxoPWsub25sb2FkfHxcIlwiLGw9ay5hdXRvc2Nyb2xsO3JldHVybiBmdW5jdGlvbihmLGsscixxLEkpe3ZhciBzPTAsdSx3LEYsej1mdW5jdGlvbigpe3cmJih3LnJlbW92ZSgpLHc9bnVsbCk7dSYmKHUuJGRlc3Ryb3koKSx1PW51bGwpO0YmJihlLmxlYXZlKEYsZnVuY3Rpb24oKXt3PW51bGx9KSx3PUYsRj1udWxsKX07Zi4kd2F0Y2goZy5wYXJzZUFzUmVzb3VyY2VVcmwobSksXG5mdW5jdGlvbihnKXt2YXIgbT1mdW5jdGlvbigpeyFCKGwpfHxsJiYhZi4kZXZhbChsKXx8ZCgpfSxyPSsrcztnPyhhLmdldChnLHtjYWNoZTpjfSkuc3VjY2VzcyhmdW5jdGlvbihhKXtpZihyPT09cyl7dmFyIGM9Zi4kbmV3KCk7cS50ZW1wbGF0ZT1hO2E9SShjLGZ1bmN0aW9uKGEpe3ooKTtlLmVudGVyKGEsbnVsbCxrLG0pfSk7dT1jO0Y9YTt1LiRlbWl0KFwiJGluY2x1ZGVDb250ZW50TG9hZGVkXCIpO2YuJGV2YWwoaCl9fSkuZXJyb3IoZnVuY3Rpb24oKXtyPT09cyYmeigpfSksZi4kZW1pdChcIiRpbmNsdWRlQ29udGVudFJlcXVlc3RlZFwiKSk6KHooKSxxLnRlbXBsYXRlPW51bGwpfSl9fX19XSxKZD1bXCIkY29tcGlsZVwiLGZ1bmN0aW9uKGEpe3JldHVybntyZXN0cmljdDpcIkVDQVwiLHByaW9yaXR5Oi00MDAscmVxdWlyZTpcIm5nSW5jbHVkZVwiLGxpbms6ZnVuY3Rpb24oYyxkLGUsZyl7ZC5odG1sKGcudGVtcGxhdGUpO2EoZC5jb250ZW50cygpKShjKX19fV0sdWQ9dmEoe3ByaW9yaXR5OjQ1MCxcbmNvbXBpbGU6ZnVuY3Rpb24oKXtyZXR1cm57cHJlOmZ1bmN0aW9uKGEsYyxkKXthLiRldmFsKGQubmdJbml0KX19fX0pLHZkPXZhKHt0ZXJtaW5hbDohMCxwcmlvcml0eToxRTN9KSx3ZD1bXCIkbG9jYWxlXCIsXCIkaW50ZXJwb2xhdGVcIixmdW5jdGlvbihhLGMpe3ZhciBkPS97fS9nO3JldHVybntyZXN0cmljdDpcIkVBXCIsbGluazpmdW5jdGlvbihlLGcsZil7dmFyIGs9Zi5jb3VudCxtPWYuJGF0dHIud2hlbiYmZy5hdHRyKGYuJGF0dHIud2hlbiksaD1mLm9mZnNldHx8MCxsPWUuJGV2YWwobSl8fHt9LG49e30scD1jLnN0YXJ0U3ltYm9sKCkscj1jLmVuZFN5bWJvbCgpLHM9L153aGVuKE1pbnVzKT8oLispJC87cShmLGZ1bmN0aW9uKGEsYyl7cy50ZXN0KGMpJiYobFtMKGMucmVwbGFjZShcIndoZW5cIixcIlwiKS5yZXBsYWNlKFwiTWludXNcIixcIi1cIikpXT1nLmF0dHIoZi4kYXR0cltjXSkpfSk7cShsLGZ1bmN0aW9uKGEsZSl7bltlXT1jKGEucmVwbGFjZShkLHAraytcIi1cIitoK3IpKX0pO2UuJHdhdGNoKGZ1bmN0aW9uKCl7dmFyIGM9XG5wYXJzZUZsb2F0KGUuJGV2YWwoaykpO2lmKGlzTmFOKGMpKXJldHVyblwiXCI7YyBpbiBsfHwoYz1hLnBsdXJhbENhdChjLWgpKTtyZXR1cm4gbltjXShlLGcsITApfSxmdW5jdGlvbihhKXtnLnRleHQoYSl9KX19fV0seGQ9W1wiJHBhcnNlXCIsXCIkYW5pbWF0ZVwiLGZ1bmN0aW9uKGEsYyl7dmFyIGQ9dChcIm5nUmVwZWF0XCIpO3JldHVybnt0cmFuc2NsdWRlOlwiZWxlbWVudFwiLHByaW9yaXR5OjFFMyx0ZXJtaW5hbDohMCwkJHRsYjohMCxsaW5rOmZ1bmN0aW9uKGUsZyxmLGssbSl7dmFyIGg9Zi5uZ1JlcGVhdCxsPWgubWF0Y2goL15cXHMqKFtcXHNcXFNdKz8pXFxzK2luXFxzKyhbXFxzXFxTXSs/KSg/Olxccyt0cmFja1xccytieVxccysoW1xcc1xcU10rPykpP1xccyokLyksbixwLHIscyxJLHgsdT17JGlkOkphfTtpZighbCl0aHJvdyBkKFwiaWV4cFwiLGgpO2Y9bFsxXTtrPWxbMl07KGw9bFszXSk/KG49YShsKSxwPWZ1bmN0aW9uKGEsYyxkKXt4JiYodVt4XT1hKTt1W0ldPWM7dS4kaW5kZXg9ZDtyZXR1cm4gbihlLFxudSl9KToocj1mdW5jdGlvbihhLGMpe3JldHVybiBKYShjKX0scz1mdW5jdGlvbihhKXtyZXR1cm4gYX0pO2w9Zi5tYXRjaCgvXig/OihbXFwkXFx3XSspfFxcKChbXFwkXFx3XSspXFxzKixcXHMqKFtcXCRcXHddKylcXCkpJC8pO2lmKCFsKXRocm93IGQoXCJpaWRleHBcIixmKTtJPWxbM118fGxbMV07eD1sWzJdO3ZhciBCPXt9O2UuJHdhdGNoQ29sbGVjdGlvbihrLGZ1bmN0aW9uKGEpe3ZhciBmLGssbD1nWzBdLG4sdT17fSxFLEEsSCx0LEMseSxEPVtdO2lmKGRiKGEpKUM9YSxuPXB8fHI7ZWxzZXtuPXB8fHM7Qz1bXTtmb3IoSCBpbiBhKWEuaGFzT3duUHJvcGVydHkoSCkmJlwiJFwiIT1ILmNoYXJBdCgwKSYmQy5wdXNoKEgpO0Muc29ydCgpfUU9Qy5sZW5ndGg7az1ELmxlbmd0aD1DLmxlbmd0aDtmb3IoZj0wO2Y8aztmKyspaWYoSD1hPT09Qz9mOkNbZl0sdD1hW0hdLHQ9bihILHQsZiksQWEodCxcImB0cmFjayBieWAgaWRcIiksQi5oYXNPd25Qcm9wZXJ0eSh0KSl5PUJbdF0sZGVsZXRlIEJbdF0sdVt0XT1cbnksRFtmXT15O2Vsc2V7aWYodS5oYXNPd25Qcm9wZXJ0eSh0KSl0aHJvdyBxKEQsZnVuY3Rpb24oYSl7YSYmYS5zY29wZSYmKEJbYS5pZF09YSl9KSxkKFwiZHVwZXNcIixoLHQpO0RbZl09e2lkOnR9O3VbdF09ITF9Zm9yKEggaW4gQilCLmhhc093blByb3BlcnR5KEgpJiYoeT1CW0hdLGY9RGIoeS5jbG9uZSksYy5sZWF2ZShmKSxxKGYsZnVuY3Rpb24oYSl7YS4kJE5HX1JFTU9WRUQ9ITB9KSx5LnNjb3BlLiRkZXN0cm95KCkpO2Y9MDtmb3Ioaz1DLmxlbmd0aDtmPGs7ZisrKXtIPWE9PT1DP2Y6Q1tmXTt0PWFbSF07eT1EW2ZdO0RbZi0xXSYmKGw9RFtmLTFdLmNsb25lW0RbZi0xXS5jbG9uZS5sZW5ndGgtMV0pO2lmKHkuc2NvcGUpe0E9eS5zY29wZTtuPWw7ZG8gbj1uLm5leHRTaWJsaW5nO3doaWxlKG4mJm4uJCROR19SRU1PVkVEKTt5LmNsb25lWzBdIT1uJiZjLm1vdmUoRGIoeS5jbG9uZSksbnVsbCx3KGwpKTtsPXkuY2xvbmVbeS5jbG9uZS5sZW5ndGgtMV19ZWxzZSBBPWUuJG5ldygpO1xuQVtJXT10O3gmJihBW3hdPUgpO0EuJGluZGV4PWY7QS4kZmlyc3Q9MD09PWY7QS4kbGFzdD1mPT09RS0xO0EuJG1pZGRsZT0hKEEuJGZpcnN0fHxBLiRsYXN0KTtBLiRvZGQ9IShBLiRldmVuPTA9PT0oZiYxKSk7eS5zY29wZXx8bShBLGZ1bmN0aW9uKGEpe2FbYS5sZW5ndGgrK109Vi5jcmVhdGVDb21tZW50KFwiIGVuZCBuZ1JlcGVhdDogXCIraCtcIiBcIik7Yy5lbnRlcihhLG51bGwsdyhsKSk7bD1hO3kuc2NvcGU9QTt5LmNsb25lPWE7dVt5LmlkXT15fSl9Qj11fSl9fX1dLHlkPVtcIiRhbmltYXRlXCIsZnVuY3Rpb24oYSl7cmV0dXJuIGZ1bmN0aW9uKGMsZCxlKXtjLiR3YXRjaChlLm5nU2hvdyxmdW5jdGlvbihjKXthW1JhKGMpP1wicmVtb3ZlQ2xhc3NcIjpcImFkZENsYXNzXCJdKGQsXCJuZy1oaWRlXCIpfSl9fV0scmQ9W1wiJGFuaW1hdGVcIixmdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oYyxkLGUpe2MuJHdhdGNoKGUubmdIaWRlLGZ1bmN0aW9uKGMpe2FbUmEoYyk/XCJhZGRDbGFzc1wiOlwicmVtb3ZlQ2xhc3NcIl0oZCxcblwibmctaGlkZVwiKX0pfX1dLHpkPXZhKGZ1bmN0aW9uKGEsYyxkKXthLiR3YXRjaChkLm5nU3R5bGUsZnVuY3Rpb24oYSxkKXtkJiZhIT09ZCYmcShkLGZ1bmN0aW9uKGEsZCl7Yy5jc3MoZCxcIlwiKX0pO2EmJmMuY3NzKGEpfSwhMCl9KSxBZD1bXCIkYW5pbWF0ZVwiLGZ1bmN0aW9uKGEpe3JldHVybntyZXN0cmljdDpcIkVBXCIscmVxdWlyZTpcIm5nU3dpdGNoXCIsY29udHJvbGxlcjpbXCIkc2NvcGVcIixmdW5jdGlvbigpe3RoaXMuY2FzZXM9e319XSxsaW5rOmZ1bmN0aW9uKGMsZCxlLGcpe3ZhciBmPVtdLGs9W10sbT1bXSxoPVtdO2MuJHdhdGNoKGUubmdTd2l0Y2h8fGUub24sZnVuY3Rpb24oZCl7dmFyIG4scDtuPTA7Zm9yKHA9bS5sZW5ndGg7bjxwOysrbiltW25dLnJlbW92ZSgpO249bS5sZW5ndGg9MDtmb3IocD1oLmxlbmd0aDtuPHA7KytuKXt2YXIgcj1rW25dO2hbbl0uJGRlc3Ryb3koKTttW25dPXI7YS5sZWF2ZShyLGZ1bmN0aW9uKCl7bS5zcGxpY2UobiwxKX0pfWsubGVuZ3RoPTA7aC5sZW5ndGg9XG4wO2lmKGY9Zy5jYXNlc1tcIiFcIitkXXx8Zy5jYXNlc1tcIj9cIl0pYy4kZXZhbChlLmNoYW5nZSkscShmLGZ1bmN0aW9uKGQpe3ZhciBlPWMuJG5ldygpO2gucHVzaChlKTtkLnRyYW5zY2x1ZGUoZSxmdW5jdGlvbihjKXt2YXIgZT1kLmVsZW1lbnQ7ay5wdXNoKGMpO2EuZW50ZXIoYyxlLnBhcmVudCgpLGUpfSl9KX0pfX19XSxCZD12YSh7dHJhbnNjbHVkZTpcImVsZW1lbnRcIixwcmlvcml0eTo4MDAscmVxdWlyZTpcIl5uZ1N3aXRjaFwiLGxpbms6ZnVuY3Rpb24oYSxjLGQsZSxnKXtlLmNhc2VzW1wiIVwiK2QubmdTd2l0Y2hXaGVuXT1lLmNhc2VzW1wiIVwiK2QubmdTd2l0Y2hXaGVuXXx8W107ZS5jYXNlc1tcIiFcIitkLm5nU3dpdGNoV2hlbl0ucHVzaCh7dHJhbnNjbHVkZTpnLGVsZW1lbnQ6Y30pfX0pLENkPXZhKHt0cmFuc2NsdWRlOlwiZWxlbWVudFwiLHByaW9yaXR5OjgwMCxyZXF1aXJlOlwiXm5nU3dpdGNoXCIsbGluazpmdW5jdGlvbihhLGMsZCxlLGcpe2UuY2FzZXNbXCI/XCJdPWUuY2FzZXNbXCI/XCJdfHxcbltdO2UuY2FzZXNbXCI/XCJdLnB1c2goe3RyYW5zY2x1ZGU6ZyxlbGVtZW50OmN9KX19KSxFZD12YSh7bGluazpmdW5jdGlvbihhLGMsZCxlLGcpe2lmKCFnKXRocm93IHQoXCJuZ1RyYW5zY2x1ZGVcIikoXCJvcnBoYW5cIixnYShjKSk7ZyhmdW5jdGlvbihhKXtjLmVtcHR5KCk7Yy5hcHBlbmQoYSl9KX19KSxlZD1bXCIkdGVtcGxhdGVDYWNoZVwiLGZ1bmN0aW9uKGEpe3JldHVybntyZXN0cmljdDpcIkVcIix0ZXJtaW5hbDohMCxjb21waWxlOmZ1bmN0aW9uKGMsZCl7XCJ0ZXh0L25nLXRlbXBsYXRlXCI9PWQudHlwZSYmYS5wdXQoZC5pZCxjWzBdLnRleHQpfX19XSxVZT10KFwibmdPcHRpb25zXCIpLERkPSQoe3Rlcm1pbmFsOiEwfSksZmQ9W1wiJGNvbXBpbGVcIixcIiRwYXJzZVwiLGZ1bmN0aW9uKGEsYyl7dmFyIGQ9L15cXHMqKFtcXHNcXFNdKz8pKD86XFxzK2FzXFxzKyhbXFxzXFxTXSs/KSk/KD86XFxzK2dyb3VwXFxzK2J5XFxzKyhbXFxzXFxTXSs/KSk/XFxzK2ZvclxccysoPzooW1xcJFxcd11bXFwkXFx3XSopfCg/OlxcKFxccyooW1xcJFxcd11bXFwkXFx3XSopXFxzKixcXHMqKFtcXCRcXHddW1xcJFxcd10qKVxccypcXCkpKVxccytpblxccysoW1xcc1xcU10rPykoPzpcXHMrdHJhY2tcXHMrYnlcXHMrKFtcXHNcXFNdKz8pKT8kLyxcbmU9eyRzZXRWaWV3VmFsdWU6eX07cmV0dXJue3Jlc3RyaWN0OlwiRVwiLHJlcXVpcmU6W1wic2VsZWN0XCIsXCI/bmdNb2RlbFwiXSxjb250cm9sbGVyOltcIiRlbGVtZW50XCIsXCIkc2NvcGVcIixcIiRhdHRyc1wiLGZ1bmN0aW9uKGEsYyxkKXt2YXIgbT10aGlzLGg9e30sbD1lLG47bS5kYXRhYm91bmQ9ZC5uZ01vZGVsO20uaW5pdD1mdW5jdGlvbihhLGMsZCl7bD1hO249ZH07bS5hZGRPcHRpb249ZnVuY3Rpb24oYyl7QWEoYywnXCJvcHRpb24gdmFsdWVcIicpO2hbY109ITA7bC4kdmlld1ZhbHVlPT1jJiYoYS52YWwoYyksbi5wYXJlbnQoKSYmbi5yZW1vdmUoKSl9O20ucmVtb3ZlT3B0aW9uPWZ1bmN0aW9uKGEpe3RoaXMuaGFzT3B0aW9uKGEpJiYoZGVsZXRlIGhbYV0sbC4kdmlld1ZhbHVlPT1hJiZ0aGlzLnJlbmRlclVua25vd25PcHRpb24oYSkpfTttLnJlbmRlclVua25vd25PcHRpb249ZnVuY3Rpb24oYyl7Yz1cIj8gXCIrSmEoYykrXCIgP1wiO24udmFsKGMpO2EucHJlcGVuZChuKTthLnZhbChjKTtuLnByb3AoXCJzZWxlY3RlZFwiLFxuITApfTttLmhhc09wdGlvbj1mdW5jdGlvbihhKXtyZXR1cm4gaC5oYXNPd25Qcm9wZXJ0eShhKX07Yy4kb24oXCIkZGVzdHJveVwiLGZ1bmN0aW9uKCl7bS5yZW5kZXJVbmtub3duT3B0aW9uPXl9KX1dLGxpbms6ZnVuY3Rpb24oZSxmLGssbSl7ZnVuY3Rpb24gaChhLGMsZCxlKXtkLiRyZW5kZXI9ZnVuY3Rpb24oKXt2YXIgYT1kLiR2aWV3VmFsdWU7ZS5oYXNPcHRpb24oYSk/KEYucGFyZW50KCkmJkYucmVtb3ZlKCksYy52YWwoYSksXCJcIj09PWEmJngucHJvcChcInNlbGVjdGVkXCIsITApKTpEKGEpJiZ4P2MudmFsKFwiXCIpOmUucmVuZGVyVW5rbm93bk9wdGlvbihhKX07Yy5vbihcImNoYW5nZVwiLGZ1bmN0aW9uKCl7YS4kYXBwbHkoZnVuY3Rpb24oKXtGLnBhcmVudCgpJiZGLnJlbW92ZSgpO2QuJHNldFZpZXdWYWx1ZShjLnZhbCgpKX0pfSl9ZnVuY3Rpb24gbChhLGMsZCl7dmFyIGU7ZC4kcmVuZGVyPWZ1bmN0aW9uKCl7dmFyIGE9bmV3IFlhKGQuJHZpZXdWYWx1ZSk7cShjLmZpbmQoXCJvcHRpb25cIiksXG5mdW5jdGlvbihjKXtjLnNlbGVjdGVkPUIoYS5nZXQoYy52YWx1ZSkpfSl9O2EuJHdhdGNoKGZ1bmN0aW9uKCl7eGEoZSxkLiR2aWV3VmFsdWUpfHwoZT1rYShkLiR2aWV3VmFsdWUpLGQuJHJlbmRlcigpKX0pO2Mub24oXCJjaGFuZ2VcIixmdW5jdGlvbigpe2EuJGFwcGx5KGZ1bmN0aW9uKCl7dmFyIGE9W107cShjLmZpbmQoXCJvcHRpb25cIiksZnVuY3Rpb24oYyl7Yy5zZWxlY3RlZCYmYS5wdXNoKGMudmFsdWUpfSk7ZC4kc2V0Vmlld1ZhbHVlKGEpfSl9KX1mdW5jdGlvbiBuKGUsZixnKXtmdW5jdGlvbiBrKCl7dmFyIGE9e1wiXCI6W119LGM9W1wiXCJdLGQsaCxzLHQsdjt0PWcuJG1vZGVsVmFsdWU7dj13KGUpfHxbXTt2YXIgRD1uP1diKHYpOnYsRixLLEE7Sz17fTtzPSExO3ZhciBFLEo7aWYocilpZih4JiZPKHQpKWZvcihzPW5ldyBZYShbXSksQT0wO0E8dC5sZW5ndGg7QSsrKUtbbV09dFtBXSxzLnB1dCh4KGUsSyksdFtBXSk7ZWxzZSBzPW5ldyBZYSh0KTtmb3IoQT0wO0Y9RC5sZW5ndGgsXG5BPEY7QSsrKXtoPUE7aWYobil7aD1EW0FdO2lmKFwiJFwiPT09aC5jaGFyQXQoMCkpY29udGludWU7S1tuXT1ofUtbbV09dltoXTtkPXAoZSxLKXx8XCJcIjsoaD1hW2RdKXx8KGg9YVtkXT1bXSxjLnB1c2goZCkpO3I/ZD1CKHMucmVtb3ZlKHg/eChlLEspOnEoZSxLKSkpOih4PyhkPXt9LGRbbV09dCxkPXgoZSxkKT09PXgoZSxLKSk6ZD10PT09cShlLEspLHM9c3x8ZCk7RT1sKGUsSyk7RT1CKEUpP0U6XCJcIjtoLnB1c2goe2lkOng/eChlLEspOm4/RFtBXTpBLGxhYmVsOkUsc2VsZWN0ZWQ6ZH0pfXJ8fCh5fHxudWxsPT09dD9hW1wiXCJdLnVuc2hpZnQoe2lkOlwiXCIsbGFiZWw6XCJcIixzZWxlY3RlZDohc30pOnN8fGFbXCJcIl0udW5zaGlmdCh7aWQ6XCI/XCIsbGFiZWw6XCJcIixzZWxlY3RlZDohMH0pKTtLPTA7Zm9yKEQ9Yy5sZW5ndGg7SzxEO0srKyl7ZD1jW0tdO2g9YVtkXTt6Lmxlbmd0aDw9Sz8odD17ZWxlbWVudDpDLmNsb25lKCkuYXR0cihcImxhYmVsXCIsZCksbGFiZWw6aC5sYWJlbH0sdj1bdF0sei5wdXNoKHYpLFxuZi5hcHBlbmQodC5lbGVtZW50KSk6KHY9eltLXSx0PXZbMF0sdC5sYWJlbCE9ZCYmdC5lbGVtZW50LmF0dHIoXCJsYWJlbFwiLHQubGFiZWw9ZCkpO0U9bnVsbDtBPTA7Zm9yKEY9aC5sZW5ndGg7QTxGO0ErKylzPWhbQV0sKGQ9dltBKzFdKT8oRT1kLmVsZW1lbnQsZC5sYWJlbCE9PXMubGFiZWwmJkUudGV4dChkLmxhYmVsPXMubGFiZWwpLGQuaWQhPT1zLmlkJiZFLnZhbChkLmlkPXMuaWQpLGQuc2VsZWN0ZWQhPT1zLnNlbGVjdGVkJiZFLnByb3AoXCJzZWxlY3RlZFwiLGQuc2VsZWN0ZWQ9cy5zZWxlY3RlZCkpOihcIlwiPT09cy5pZCYmeT9KPXk6KEo9dS5jbG9uZSgpKS52YWwocy5pZCkuYXR0cihcInNlbGVjdGVkXCIscy5zZWxlY3RlZCkudGV4dChzLmxhYmVsKSx2LnB1c2goe2VsZW1lbnQ6SixsYWJlbDpzLmxhYmVsLGlkOnMuaWQsc2VsZWN0ZWQ6cy5zZWxlY3RlZH0pLEU/RS5hZnRlcihKKTp0LmVsZW1lbnQuYXBwZW5kKEopLEU9Sik7Zm9yKEErKzt2Lmxlbmd0aD5BOyl2LnBvcCgpLmVsZW1lbnQucmVtb3ZlKCl9Zm9yKDt6Lmxlbmd0aD5cbks7KXoucG9wKClbMF0uZWxlbWVudC5yZW1vdmUoKX12YXIgaDtpZighKGg9dC5tYXRjaChkKSkpdGhyb3cgVWUoXCJpZXhwXCIsdCxnYShmKSk7dmFyIGw9YyhoWzJdfHxoWzFdKSxtPWhbNF18fGhbNl0sbj1oWzVdLHA9YyhoWzNdfHxcIlwiKSxxPWMoaFsyXT9oWzFdOm0pLHc9YyhoWzddKSx4PWhbOF0/YyhoWzhdKTpudWxsLHo9W1t7ZWxlbWVudDpmLGxhYmVsOlwiXCJ9XV07eSYmKGEoeSkoZSkseS5yZW1vdmVDbGFzcyhcIm5nLXNjb3BlXCIpLHkucmVtb3ZlKCkpO2YuZW1wdHkoKTtmLm9uKFwiY2hhbmdlXCIsZnVuY3Rpb24oKXtlLiRhcHBseShmdW5jdGlvbigpe3ZhciBhLGM9dyhlKXx8W10sZD17fSxoLGssbCxwLHQsdSx2O2lmKHIpZm9yKGs9W10scD0wLHU9ei5sZW5ndGg7cDx1O3ArKylmb3IoYT16W3BdLGw9MSx0PWEubGVuZ3RoO2w8dDtsKyspe2lmKChoPWFbbF0uZWxlbWVudClbMF0uc2VsZWN0ZWQpe2g9aC52YWwoKTtuJiYoZFtuXT1oKTtpZih4KWZvcih2PTA7djxjLmxlbmd0aCYmXG4oZFttXT1jW3ZdLHgoZSxkKSE9aCk7disrKTtlbHNlIGRbbV09Y1toXTtrLnB1c2gocShlLGQpKX19ZWxzZXtoPWYudmFsKCk7aWYoXCI/XCI9PWgpaz1zO2Vsc2UgaWYoXCJcIj09PWgpaz1udWxsO2Vsc2UgaWYoeClmb3Iodj0wO3Y8Yy5sZW5ndGg7disrKXtpZihkW21dPWNbdl0seChlLGQpPT1oKXtrPXEoZSxkKTticmVha319ZWxzZSBkW21dPWNbaF0sbiYmKGRbbl09aCksaz1xKGUsZCk7MTx6WzBdLmxlbmd0aCYmelswXVsxXS5pZCE9PWgmJih6WzBdWzFdLnNlbGVjdGVkPSExKX1nLiRzZXRWaWV3VmFsdWUoayl9KX0pO2cuJHJlbmRlcj1rO2UuJHdhdGNoKGspfWlmKG1bMV0pe3ZhciBwPW1bMF07bT1tWzFdO3ZhciByPWsubXVsdGlwbGUsdD1rLm5nT3B0aW9ucyx5PSExLHgsdT13KFYuY3JlYXRlRWxlbWVudChcIm9wdGlvblwiKSksQz13KFYuY3JlYXRlRWxlbWVudChcIm9wdGdyb3VwXCIpKSxGPXUuY2xvbmUoKTtrPTA7Zm9yKHZhciB6PWYuY2hpbGRyZW4oKSxKPXoubGVuZ3RoO2s8SjtrKyspaWYoXCJcIj09PVxueltrXS52YWx1ZSl7eD15PXouZXEoayk7YnJlYWt9cC5pbml0KG0seSxGKTtyJiYobS4kaXNFbXB0eT1mdW5jdGlvbihhKXtyZXR1cm4hYXx8MD09PWEubGVuZ3RofSk7dD9uKGUsZixtKTpyP2woZSxmLG0pOmgoZSxmLG0scCl9fX19XSxoZD1bXCIkaW50ZXJwb2xhdGVcIixmdW5jdGlvbihhKXt2YXIgYz17YWRkT3B0aW9uOnkscmVtb3ZlT3B0aW9uOnl9O3JldHVybntyZXN0cmljdDpcIkVcIixwcmlvcml0eToxMDAsY29tcGlsZTpmdW5jdGlvbihkLGUpe2lmKEQoZS52YWx1ZSkpe3ZhciBnPWEoZC50ZXh0KCksITApO2d8fGUuJHNldChcInZhbHVlXCIsZC50ZXh0KCkpfXJldHVybiBmdW5jdGlvbihhLGQsZSl7dmFyIGg9ZC5wYXJlbnQoKSxsPWguZGF0YShcIiRzZWxlY3RDb250cm9sbGVyXCIpfHxoLnBhcmVudCgpLmRhdGEoXCIkc2VsZWN0Q29udHJvbGxlclwiKTtsJiZsLmRhdGFib3VuZD9kLnByb3AoXCJzZWxlY3RlZFwiLCExKTpsPWM7Zz9hLiR3YXRjaChnLGZ1bmN0aW9uKGEsYyl7ZS4kc2V0KFwidmFsdWVcIixcbmEpO2EhPT1jJiZsLnJlbW92ZU9wdGlvbihjKTtsLmFkZE9wdGlvbihhKX0pOmwuYWRkT3B0aW9uKGUudmFsdWUpO2Qub24oXCIkZGVzdHJveVwiLGZ1bmN0aW9uKCl7bC5yZW1vdmVPcHRpb24oZS52YWx1ZSl9KX19fX1dLGdkPSQoe3Jlc3RyaWN0OlwiRVwiLHRlcm1pbmFsOiEwfSk7VC5hbmd1bGFyLmJvb3RzdHJhcD9jb25zb2xlLmxvZyhcIldBUk5JTkc6IFRyaWVkIHRvIGxvYWQgYW5ndWxhciBtb3JlIHRoYW4gb25jZS5cIik6KChCYT1ULmpRdWVyeSkmJkJhLmZuLm9uPyh3PUJhLEooQmEuZm4se3Njb3BlOkthLnNjb3BlLGlzb2xhdGVTY29wZTpLYS5pc29sYXRlU2NvcGUsY29udHJvbGxlcjpLYS5jb250cm9sbGVyLGluamVjdG9yOkthLmluamVjdG9yLGluaGVyaXRlZERhdGE6S2EuaW5oZXJpdGVkRGF0YX0pLEZiKFwicmVtb3ZlXCIsITAsITAsITEpLEZiKFwiZW1wdHlcIiwhMSwhMSwhMSksRmIoXCJodG1sXCIsITEsITEsITApKTp3PVIsU2EuZWxlbWVudD13LFpjKFNhKSx3KFYpLnJlYWR5KGZ1bmN0aW9uKCl7V2MoVixcbmRjKX0pKX0pKHdpbmRvdyxkb2N1bWVudCk7IXdpbmRvdy5hbmd1bGFyLiQkY3NwKCkmJndpbmRvdy5hbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQpLmZpbmQoXCJoZWFkXCIpLnByZXBlbmQoJzxzdHlsZSB0eXBlPVwidGV4dC9jc3NcIj5AY2hhcnNldCBcIlVURi04XCI7W25nXFxcXDpjbG9ha10sW25nLWNsb2FrXSxbZGF0YS1uZy1jbG9ha10sW3gtbmctY2xvYWtdLC5uZy1jbG9haywueC1uZy1jbG9haywubmctaGlkZXtkaXNwbGF5Om5vbmUgIWltcG9ydGFudDt9bmdcXFxcOmZvcm17ZGlzcGxheTpibG9jazt9Lm5nLWFuaW1hdGUtYmxvY2stdHJhbnNpdGlvbnN7dHJhbnNpdGlvbjowcyBhbGwhaW1wb3J0YW50Oy13ZWJraXQtdHJhbnNpdGlvbjowcyBhbGwhaW1wb3J0YW50O30ubmctaGlkZS1hZGQtYWN0aXZlLC5uZy1oaWRlLXJlbW92ZXtkaXNwbGF5OmJsb2NrIWltcG9ydGFudDt9PC9zdHlsZT4nKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWFuZ3VsYXIubWluLmpzLm1hcFxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIkRGMXVyeFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9hbmd1bGFyL2xpYi9hbmd1bGFyLm1pbi5qc1wiLFwiLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9hbmd1bGFyL2xpYlwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8qIVxuICogVGhlIGJ1ZmZlciBtb2R1bGUgZnJvbSBub2RlLmpzLCBmb3IgdGhlIGJyb3dzZXIuXG4gKlxuICogQGF1dGhvciAgIEZlcm9zcyBBYm91a2hhZGlqZWggPGZlcm9zc0BmZXJvc3Mub3JnPiA8aHR0cDovL2Zlcm9zcy5vcmc+XG4gKiBAbGljZW5zZSAgTUlUXG4gKi9cblxudmFyIGJhc2U2NCA9IHJlcXVpcmUoJ2Jhc2U2NC1qcycpXG52YXIgaWVlZTc1NCA9IHJlcXVpcmUoJ2llZWU3NTQnKVxuXG5leHBvcnRzLkJ1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5TbG93QnVmZmVyID0gQnVmZmVyXG5leHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTID0gNTBcbkJ1ZmZlci5wb29sU2l6ZSA9IDgxOTJcblxuLyoqXG4gKiBJZiBgQnVmZmVyLl91c2VUeXBlZEFycmF5c2A6XG4gKiAgID09PSB0cnVlICAgIFVzZSBVaW50OEFycmF5IGltcGxlbWVudGF0aW9uIChmYXN0ZXN0KVxuICogICA9PT0gZmFsc2UgICBVc2UgT2JqZWN0IGltcGxlbWVudGF0aW9uIChjb21wYXRpYmxlIGRvd24gdG8gSUU2KVxuICovXG5CdWZmZXIuX3VzZVR5cGVkQXJyYXlzID0gKGZ1bmN0aW9uICgpIHtcbiAgLy8gRGV0ZWN0IGlmIGJyb3dzZXIgc3VwcG9ydHMgVHlwZWQgQXJyYXlzLiBTdXBwb3J0ZWQgYnJvd3NlcnMgYXJlIElFIDEwKywgRmlyZWZveCA0KyxcbiAgLy8gQ2hyb21lIDcrLCBTYWZhcmkgNS4xKywgT3BlcmEgMTEuNissIGlPUyA0LjIrLiBJZiB0aGUgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGFkZGluZ1xuICAvLyBwcm9wZXJ0aWVzIHRvIGBVaW50OEFycmF5YCBpbnN0YW5jZXMsIHRoZW4gdGhhdCdzIHRoZSBzYW1lIGFzIG5vIGBVaW50OEFycmF5YCBzdXBwb3J0XG4gIC8vIGJlY2F1c2Ugd2UgbmVlZCB0byBiZSBhYmxlIHRvIGFkZCBhbGwgdGhlIG5vZGUgQnVmZmVyIEFQSSBtZXRob2RzLiBUaGlzIGlzIGFuIGlzc3VlXG4gIC8vIGluIEZpcmVmb3ggNC0yOS4gTm93IGZpeGVkOiBodHRwczovL2J1Z3ppbGxhLm1vemlsbGEub3JnL3Nob3dfYnVnLmNnaT9pZD02OTU0MzhcbiAgdHJ5IHtcbiAgICB2YXIgYnVmID0gbmV3IEFycmF5QnVmZmVyKDApXG4gICAgdmFyIGFyciA9IG5ldyBVaW50OEFycmF5KGJ1ZilcbiAgICBhcnIuZm9vID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gNDIgfVxuICAgIHJldHVybiA0MiA9PT0gYXJyLmZvbygpICYmXG4gICAgICAgIHR5cGVvZiBhcnIuc3ViYXJyYXkgPT09ICdmdW5jdGlvbicgLy8gQ2hyb21lIDktMTAgbGFjayBgc3ViYXJyYXlgXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufSkoKVxuXG4vKipcbiAqIENsYXNzOiBCdWZmZXJcbiAqID09PT09PT09PT09PT1cbiAqXG4gKiBUaGUgQnVmZmVyIGNvbnN0cnVjdG9yIHJldHVybnMgaW5zdGFuY2VzIG9mIGBVaW50OEFycmF5YCB0aGF0IGFyZSBhdWdtZW50ZWRcbiAqIHdpdGggZnVuY3Rpb24gcHJvcGVydGllcyBmb3IgYWxsIHRoZSBub2RlIGBCdWZmZXJgIEFQSSBmdW5jdGlvbnMuIFdlIHVzZVxuICogYFVpbnQ4QXJyYXlgIHNvIHRoYXQgc3F1YXJlIGJyYWNrZXQgbm90YXRpb24gd29ya3MgYXMgZXhwZWN0ZWQgLS0gaXQgcmV0dXJuc1xuICogYSBzaW5nbGUgb2N0ZXQuXG4gKlxuICogQnkgYXVnbWVudGluZyB0aGUgaW5zdGFuY2VzLCB3ZSBjYW4gYXZvaWQgbW9kaWZ5aW5nIHRoZSBgVWludDhBcnJheWBcbiAqIHByb3RvdHlwZS5cbiAqL1xuZnVuY3Rpb24gQnVmZmVyIChzdWJqZWN0LCBlbmNvZGluZywgbm9aZXJvKSB7XG4gIGlmICghKHRoaXMgaW5zdGFuY2VvZiBCdWZmZXIpKVxuICAgIHJldHVybiBuZXcgQnVmZmVyKHN1YmplY3QsIGVuY29kaW5nLCBub1plcm8pXG5cbiAgdmFyIHR5cGUgPSB0eXBlb2Ygc3ViamVjdFxuXG4gIC8vIFdvcmthcm91bmQ6IG5vZGUncyBiYXNlNjQgaW1wbGVtZW50YXRpb24gYWxsb3dzIGZvciBub24tcGFkZGVkIHN0cmluZ3NcbiAgLy8gd2hpbGUgYmFzZTY0LWpzIGRvZXMgbm90LlxuICBpZiAoZW5jb2RpbmcgPT09ICdiYXNlNjQnICYmIHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgc3ViamVjdCA9IHN0cmluZ3RyaW0oc3ViamVjdClcbiAgICB3aGlsZSAoc3ViamVjdC5sZW5ndGggJSA0ICE9PSAwKSB7XG4gICAgICBzdWJqZWN0ID0gc3ViamVjdCArICc9J1xuICAgIH1cbiAgfVxuXG4gIC8vIEZpbmQgdGhlIGxlbmd0aFxuICB2YXIgbGVuZ3RoXG4gIGlmICh0eXBlID09PSAnbnVtYmVyJylcbiAgICBsZW5ndGggPSBjb2VyY2Uoc3ViamVjdClcbiAgZWxzZSBpZiAodHlwZSA9PT0gJ3N0cmluZycpXG4gICAgbGVuZ3RoID0gQnVmZmVyLmJ5dGVMZW5ndGgoc3ViamVjdCwgZW5jb2RpbmcpXG4gIGVsc2UgaWYgKHR5cGUgPT09ICdvYmplY3QnKVxuICAgIGxlbmd0aCA9IGNvZXJjZShzdWJqZWN0Lmxlbmd0aCkgLy8gYXNzdW1lIHRoYXQgb2JqZWN0IGlzIGFycmF5LWxpa2VcbiAgZWxzZVxuICAgIHRocm93IG5ldyBFcnJvcignRmlyc3QgYXJndW1lbnQgbmVlZHMgdG8gYmUgYSBudW1iZXIsIGFycmF5IG9yIHN0cmluZy4nKVxuXG4gIHZhciBidWZcbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICAvLyBQcmVmZXJyZWQ6IFJldHVybiBhbiBhdWdtZW50ZWQgYFVpbnQ4QXJyYXlgIGluc3RhbmNlIGZvciBiZXN0IHBlcmZvcm1hbmNlXG4gICAgYnVmID0gQnVmZmVyLl9hdWdtZW50KG5ldyBVaW50OEFycmF5KGxlbmd0aCkpXG4gIH0gZWxzZSB7XG4gICAgLy8gRmFsbGJhY2s6IFJldHVybiBUSElTIGluc3RhbmNlIG9mIEJ1ZmZlciAoY3JlYXRlZCBieSBgbmV3YClcbiAgICBidWYgPSB0aGlzXG4gICAgYnVmLmxlbmd0aCA9IGxlbmd0aFxuICAgIGJ1Zi5faXNCdWZmZXIgPSB0cnVlXG4gIH1cblxuICB2YXIgaVxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cyAmJiB0eXBlb2Ygc3ViamVjdC5ieXRlTGVuZ3RoID09PSAnbnVtYmVyJykge1xuICAgIC8vIFNwZWVkIG9wdGltaXphdGlvbiAtLSB1c2Ugc2V0IGlmIHdlJ3JlIGNvcHlpbmcgZnJvbSBhIHR5cGVkIGFycmF5XG4gICAgYnVmLl9zZXQoc3ViamVjdClcbiAgfSBlbHNlIGlmIChpc0FycmF5aXNoKHN1YmplY3QpKSB7XG4gICAgLy8gVHJlYXQgYXJyYXktaXNoIG9iamVjdHMgYXMgYSBieXRlIGFycmF5XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAoQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpKVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0LnJlYWRVSW50OChpKVxuICAgICAgZWxzZVxuICAgICAgICBidWZbaV0gPSBzdWJqZWN0W2ldXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgYnVmLndyaXRlKHN1YmplY3QsIDAsIGVuY29kaW5nKVxuICB9IGVsc2UgaWYgKHR5cGUgPT09ICdudW1iZXInICYmICFCdWZmZXIuX3VzZVR5cGVkQXJyYXlzICYmICFub1plcm8pIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgIGJ1ZltpXSA9IDBcbiAgICB9XG4gIH1cblxuICByZXR1cm4gYnVmXG59XG5cbi8vIFNUQVRJQyBNRVRIT0RTXG4vLyA9PT09PT09PT09PT09PVxuXG5CdWZmZXIuaXNFbmNvZGluZyA9IGZ1bmN0aW9uIChlbmNvZGluZykge1xuICBzd2l0Y2ggKFN0cmluZyhlbmNvZGluZykudG9Mb3dlckNhc2UoKSkge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgY2FzZSAncmF3JzpcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0dXJuIHRydWVcbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuQnVmZmVyLmlzQnVmZmVyID0gZnVuY3Rpb24gKGIpIHtcbiAgcmV0dXJuICEhKGIgIT09IG51bGwgJiYgYiAhPT0gdW5kZWZpbmVkICYmIGIuX2lzQnVmZmVyKVxufVxuXG5CdWZmZXIuYnl0ZUxlbmd0aCA9IGZ1bmN0aW9uIChzdHIsIGVuY29kaW5nKSB7XG4gIHZhciByZXRcbiAgc3RyID0gc3RyICsgJydcbiAgc3dpdGNoIChlbmNvZGluZyB8fCAndXRmOCcpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgICAgcmV0ID0gc3RyLmxlbmd0aCAvIDJcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gdXRmOFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYXNjaWknOlxuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgY2FzZSAncmF3JzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IGJhc2U2NFRvQnl0ZXMoc3RyKS5sZW5ndGhcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGggKiAyXG4gICAgICBicmVha1xuICAgIGRlZmF1bHQ6XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1Vua25vd24gZW5jb2RpbmcnKVxuICB9XG4gIHJldHVybiByZXRcbn1cblxuQnVmZmVyLmNvbmNhdCA9IGZ1bmN0aW9uIChsaXN0LCB0b3RhbExlbmd0aCkge1xuICBhc3NlcnQoaXNBcnJheShsaXN0KSwgJ1VzYWdlOiBCdWZmZXIuY29uY2F0KGxpc3QsIFt0b3RhbExlbmd0aF0pXFxuJyArXG4gICAgICAnbGlzdCBzaG91bGQgYmUgYW4gQXJyYXkuJylcblxuICBpZiAobGlzdC5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcigwKVxuICB9IGVsc2UgaWYgKGxpc3QubGVuZ3RoID09PSAxKSB7XG4gICAgcmV0dXJuIGxpc3RbMF1cbiAgfVxuXG4gIHZhciBpXG4gIGlmICh0eXBlb2YgdG90YWxMZW5ndGggIT09ICdudW1iZXInKSB7XG4gICAgdG90YWxMZW5ndGggPSAwXG4gICAgZm9yIChpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcbiAgICAgIHRvdGFsTGVuZ3RoICs9IGxpc3RbaV0ubGVuZ3RoXG4gICAgfVxuICB9XG5cbiAgdmFyIGJ1ZiA9IG5ldyBCdWZmZXIodG90YWxMZW5ndGgpXG4gIHZhciBwb3MgPSAwXG4gIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGl0ZW0gPSBsaXN0W2ldXG4gICAgaXRlbS5jb3B5KGJ1ZiwgcG9zKVxuICAgIHBvcyArPSBpdGVtLmxlbmd0aFxuICB9XG4gIHJldHVybiBidWZcbn1cblxuLy8gQlVGRkVSIElOU1RBTkNFIE1FVEhPRFNcbi8vID09PT09PT09PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIF9oZXhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IGJ1Zi5sZW5ndGggLSBvZmZzZXRcbiAgaWYgKCFsZW5ndGgpIHtcbiAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgfSBlbHNlIHtcbiAgICBsZW5ndGggPSBOdW1iZXIobGVuZ3RoKVxuICAgIGlmIChsZW5ndGggPiByZW1haW5pbmcpIHtcbiAgICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICAgIH1cbiAgfVxuXG4gIC8vIG11c3QgYmUgYW4gZXZlbiBudW1iZXIgb2YgZGlnaXRzXG4gIHZhciBzdHJMZW4gPSBzdHJpbmcubGVuZ3RoXG4gIGFzc2VydChzdHJMZW4gJSAyID09PSAwLCAnSW52YWxpZCBoZXggc3RyaW5nJylcblxuICBpZiAobGVuZ3RoID4gc3RyTGVuIC8gMikge1xuICAgIGxlbmd0aCA9IHN0ckxlbiAvIDJcbiAgfVxuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGJ5dGUgPSBwYXJzZUludChzdHJpbmcuc3Vic3RyKGkgKiAyLCAyKSwgMTYpXG4gICAgYXNzZXJ0KCFpc05hTihieXRlKSwgJ0ludmFsaWQgaGV4IHN0cmluZycpXG4gICAgYnVmW29mZnNldCArIGldID0gYnl0ZVxuICB9XG4gIEJ1ZmZlci5fY2hhcnNXcml0dGVuID0gaSAqIDJcbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gX3V0ZjhXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcih1dGY4VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF9hc2NpaVdyaXRlIChidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIGNoYXJzV3JpdHRlbiA9IEJ1ZmZlci5fY2hhcnNXcml0dGVuID1cbiAgICBibGl0QnVmZmVyKGFzY2lpVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHJldHVybiBfYXNjaWlXcml0ZShidWYsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcihiYXNlNjRUb0J5dGVzKHN0cmluZyksIGJ1Ziwgb2Zmc2V0LCBsZW5ndGgpXG4gIHJldHVybiBjaGFyc1dyaXR0ZW5cbn1cblxuZnVuY3Rpb24gX3V0ZjE2bGVXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcih1dGYxNmxlVG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGUgPSBmdW5jdGlvbiAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpIHtcbiAgLy8gU3VwcG9ydCBib3RoIChzdHJpbmcsIG9mZnNldCwgbGVuZ3RoLCBlbmNvZGluZylcbiAgLy8gYW5kIHRoZSBsZWdhY3kgKHN0cmluZywgZW5jb2RpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICBpZiAoaXNGaW5pdGUob2Zmc2V0KSkge1xuICAgIGlmICghaXNGaW5pdGUobGVuZ3RoKSkge1xuICAgICAgZW5jb2RpbmcgPSBsZW5ndGhcbiAgICAgIGxlbmd0aCA9IHVuZGVmaW5lZFxuICAgIH1cbiAgfSBlbHNlIHsgIC8vIGxlZ2FjeVxuICAgIHZhciBzd2FwID0gZW5jb2RpbmdcbiAgICBlbmNvZGluZyA9IG9mZnNldFxuICAgIG9mZnNldCA9IGxlbmd0aFxuICAgIGxlbmd0aCA9IHN3YXBcbiAgfVxuXG4gIG9mZnNldCA9IE51bWJlcihvZmZzZXQpIHx8IDBcbiAgdmFyIHJlbWFpbmluZyA9IHRoaXMubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG5cbiAgdmFyIHJldFxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IF9oZXhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSBfdXRmOFdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldCA9IF9hc2NpaVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSBfYmluYXJ5V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IF9iYXNlNjRXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gX3V0ZjE2bGVXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoZW5jb2RpbmcsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHNlbGYgPSB0aGlzXG5cbiAgZW5jb2RpbmcgPSBTdHJpbmcoZW5jb2RpbmcgfHwgJ3V0ZjgnKS50b0xvd2VyQ2FzZSgpXG4gIHN0YXJ0ID0gTnVtYmVyKHN0YXJ0KSB8fCAwXG4gIGVuZCA9IChlbmQgIT09IHVuZGVmaW5lZClcbiAgICA/IE51bWJlcihlbmQpXG4gICAgOiBlbmQgPSBzZWxmLmxlbmd0aFxuXG4gIC8vIEZhc3RwYXRoIGVtcHR5IHN0cmluZ3NcbiAgaWYgKGVuZCA9PT0gc3RhcnQpXG4gICAgcmV0dXJuICcnXG5cbiAgdmFyIHJldFxuICBzd2l0Y2ggKGVuY29kaW5nKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IF9oZXhTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1dGY4JzpcbiAgICBjYXNlICd1dGYtOCc6XG4gICAgICByZXQgPSBfdXRmOFNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICAgIHJldCA9IF9hc2NpaVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2JpbmFyeSc6XG4gICAgICByZXQgPSBfYmluYXJ5U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAnYmFzZTY0JzpcbiAgICAgIHJldCA9IF9iYXNlNjRTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICd1Y3MyJzpcbiAgICBjYXNlICd1Y3MtMic6XG4gICAgY2FzZSAndXRmMTZsZSc6XG4gICAgY2FzZSAndXRmLTE2bGUnOlxuICAgICAgcmV0ID0gX3V0ZjE2bGVTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUudG9KU09OID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4ge1xuICAgIHR5cGU6ICdCdWZmZXInLFxuICAgIGRhdGE6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuX2FyciB8fCB0aGlzLCAwKVxuICB9XG59XG5cbi8vIGNvcHkodGFyZ2V0QnVmZmVyLCB0YXJnZXRTdGFydD0wLCBzb3VyY2VTdGFydD0wLCBzb3VyY2VFbmQ9YnVmZmVyLmxlbmd0aClcbkJ1ZmZlci5wcm90b3R5cGUuY29weSA9IGZ1bmN0aW9uICh0YXJnZXQsIHRhcmdldF9zdGFydCwgc3RhcnQsIGVuZCkge1xuICB2YXIgc291cmNlID0gdGhpc1xuXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCAmJiBlbmQgIT09IDApIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICghdGFyZ2V0X3N0YXJ0KSB0YXJnZXRfc3RhcnQgPSAwXG5cbiAgLy8gQ29weSAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRhcmdldC5sZW5ndGggPT09IDAgfHwgc291cmNlLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgLy8gRmF0YWwgZXJyb3IgY29uZGl0aW9uc1xuICBhc3NlcnQoZW5kID49IHN0YXJ0LCAnc291cmNlRW5kIDwgc291cmNlU3RhcnQnKVxuICBhc3NlcnQodGFyZ2V0X3N0YXJ0ID49IDAgJiYgdGFyZ2V0X3N0YXJ0IDwgdGFyZ2V0Lmxlbmd0aCxcbiAgICAgICd0YXJnZXRTdGFydCBvdXQgb2YgYm91bmRzJylcbiAgYXNzZXJ0KHN0YXJ0ID49IDAgJiYgc3RhcnQgPCBzb3VyY2UubGVuZ3RoLCAnc291cmNlU3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChlbmQgPj0gMCAmJiBlbmQgPD0gc291cmNlLmxlbmd0aCwgJ3NvdXJjZUVuZCBvdXQgb2YgYm91bmRzJylcblxuICAvLyBBcmUgd2Ugb29iP1xuICBpZiAoZW5kID4gdGhpcy5sZW5ndGgpXG4gICAgZW5kID0gdGhpcy5sZW5ndGhcbiAgaWYgKHRhcmdldC5sZW5ndGggLSB0YXJnZXRfc3RhcnQgPCBlbmQgLSBzdGFydClcbiAgICBlbmQgPSB0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0ICsgc3RhcnRcblxuICB2YXIgbGVuID0gZW5kIC0gc3RhcnRcblxuICBpZiAobGVuIDwgMTAwIHx8ICFCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIHRhcmdldFtpICsgdGFyZ2V0X3N0YXJ0XSA9IHRoaXNbaSArIHN0YXJ0XVxuICB9IGVsc2Uge1xuICAgIHRhcmdldC5fc2V0KHRoaXMuc3ViYXJyYXkoc3RhcnQsIHN0YXJ0ICsgbGVuKSwgdGFyZ2V0X3N0YXJ0KVxuICB9XG59XG5cbmZ1bmN0aW9uIF9iYXNlNjRTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIGlmIChzdGFydCA9PT0gMCAmJiBlbmQgPT09IGJ1Zi5sZW5ndGgpIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmKVxuICB9IGVsc2Uge1xuICAgIHJldHVybiBiYXNlNjQuZnJvbUJ5dGVBcnJheShidWYuc2xpY2Uoc3RhcnQsIGVuZCkpXG4gIH1cbn1cblxuZnVuY3Rpb24gX3V0ZjhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXMgPSAnJ1xuICB2YXIgdG1wID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgaWYgKGJ1ZltpXSA8PSAweDdGKSB7XG4gICAgICByZXMgKz0gZGVjb2RlVXRmOENoYXIodG1wKSArIFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICAgICAgdG1wID0gJydcbiAgICB9IGVsc2Uge1xuICAgICAgdG1wICs9ICclJyArIGJ1ZltpXS50b1N0cmluZygxNilcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzICsgZGVjb2RlVXRmOENoYXIodG1wKVxufVxuXG5mdW5jdGlvbiBfYXNjaWlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciByZXQgPSAnJ1xuICBlbmQgPSBNYXRoLm1pbihidWYubGVuZ3RoLCBlbmQpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspXG4gICAgcmV0ICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnVmW2ldKVxuICByZXR1cm4gcmV0XG59XG5cbmZ1bmN0aW9uIF9iaW5hcnlTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHJldHVybiBfYXNjaWlTbGljZShidWYsIHN0YXJ0LCBlbmQpXG59XG5cbmZ1bmN0aW9uIF9oZXhTbGljZSAoYnVmLCBzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG5cbiAgaWYgKCFzdGFydCB8fCBzdGFydCA8IDApIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCB8fCBlbmQgPCAwIHx8IGVuZCA+IGxlbikgZW5kID0gbGVuXG5cbiAgdmFyIG91dCA9ICcnXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgb3V0ICs9IHRvSGV4KGJ1ZltpXSlcbiAgfVxuICByZXR1cm4gb3V0XG59XG5cbmZ1bmN0aW9uIF91dGYxNmxlU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgYnl0ZXMgPSBidWYuc2xpY2Uoc3RhcnQsIGVuZClcbiAgdmFyIHJlcyA9ICcnXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgYnl0ZXMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICByZXMgKz0gU3RyaW5nLmZyb21DaGFyQ29kZShieXRlc1tpXSArIGJ5dGVzW2krMV0gKiAyNTYpXG4gIH1cbiAgcmV0dXJuIHJlc1xufVxuXG5CdWZmZXIucHJvdG90eXBlLnNsaWNlID0gZnVuY3Rpb24gKHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIHN0YXJ0ID0gY2xhbXAoc3RhcnQsIGxlbiwgMClcbiAgZW5kID0gY2xhbXAoZW5kLCBsZW4sIGxlbilcblxuICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIHJldHVybiBCdWZmZXIuX2F1Z21lbnQodGhpcy5zdWJhcnJheShzdGFydCwgZW5kKSlcbiAgfSBlbHNlIHtcbiAgICB2YXIgc2xpY2VMZW4gPSBlbmQgLSBzdGFydFxuICAgIHZhciBuZXdCdWYgPSBuZXcgQnVmZmVyKHNsaWNlTGVuLCB1bmRlZmluZWQsIHRydWUpXG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBzbGljZUxlbjsgaSsrKSB7XG4gICAgICBuZXdCdWZbaV0gPSB0aGlzW2kgKyBzdGFydF1cbiAgICB9XG4gICAgcmV0dXJuIG5ld0J1ZlxuICB9XG59XG5cbi8vIGBnZXRgIHdpbGwgYmUgcmVtb3ZlZCBpbiBOb2RlIDAuMTMrXG5CdWZmZXIucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5nZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLnJlYWRVSW50OChvZmZzZXQpXG59XG5cbi8vIGBzZXRgIHdpbGwgYmUgcmVtb3ZlZCBpbiBOb2RlIDAuMTMrXG5CdWZmZXIucHJvdG90eXBlLnNldCA9IGZ1bmN0aW9uICh2LCBvZmZzZXQpIHtcbiAgY29uc29sZS5sb2coJy5zZXQoKSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdXNpbmcgYXJyYXkgaW5kZXhlcyBpbnN0ZWFkLicpXG4gIHJldHVybiB0aGlzLndyaXRlVUludDgodiwgb2Zmc2V0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50OCA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5mdW5jdGlvbiBfcmVhZFVJbnQxNiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWxcbiAgaWYgKGxpdHRsZUVuZGlhbikge1xuICAgIHZhbCA9IGJ1ZltvZmZzZXRdXG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdIDw8IDhcbiAgfSBlbHNlIHtcbiAgICB2YWwgPSBidWZbb2Zmc2V0XSA8PCA4XG4gICAgaWYgKG9mZnNldCArIDEgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDFdXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MTZCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRVSW50MzIgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsXG4gIGlmIChsaXR0bGVFbmRpYW4pIHtcbiAgICBpZiAob2Zmc2V0ICsgMiA8IGxlbilcbiAgICAgIHZhbCA9IGJ1ZltvZmZzZXQgKyAyXSA8PCAxNlxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXSA8PCA4XG4gICAgdmFsIHw9IGJ1ZltvZmZzZXRdXG4gICAgaWYgKG9mZnNldCArIDMgPCBsZW4pXG4gICAgICB2YWwgPSB2YWwgKyAoYnVmW29mZnNldCArIDNdIDw8IDI0ID4+PiAwKVxuICB9IGVsc2Uge1xuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsID0gYnVmW29mZnNldCArIDFdIDw8IDE2XG4gICAgaWYgKG9mZnNldCArIDIgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDJdIDw8IDhcbiAgICBpZiAob2Zmc2V0ICsgMyA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgM11cbiAgICB2YWwgPSB2YWwgKyAoYnVmW29mZnNldF0gPDwgMjQgPj4+IDApXG4gIH1cbiAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRVSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZFVJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50OCA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLFxuICAgICAgICAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgdmFyIG5lZyA9IHRoaXNbb2Zmc2V0XSAmIDB4ODBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmYgLSB0aGlzW29mZnNldF0gKyAxKSAqIC0xXG4gIGVsc2VcbiAgICByZXR1cm4gdGhpc1tvZmZzZXRdXG59XG5cbmZ1bmN0aW9uIF9yZWFkSW50MTYgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsID0gX3JlYWRVSW50MTYoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgdHJ1ZSlcbiAgdmFyIG5lZyA9IHZhbCAmIDB4ODAwMFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZmZmIC0gdmFsICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQxNkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDE2KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEludDMyIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbCA9IF9yZWFkVUludDMyKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIHRydWUpXG4gIHZhciBuZWcgPSB2YWwgJiAweDgwMDAwMDAwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmZmZmZmZmIC0gdmFsICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHZhbFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRJbnQzMkxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDMyKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZEZsb2F0IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBpZWVlNzU0LnJlYWQoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgMjMsIDQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEZsb2F0TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRGbG9hdCh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdEJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRmxvYXQodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkRG91YmxlIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgKyA3IDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHJldHVybiBpZWVlNzU0LnJlYWQoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgNTIsIDgpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUxFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZERvdWJsZUJFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRG91YmxlKHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDggPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZilcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpIHJldHVyblxuXG4gIHRoaXNbb2Zmc2V0XSA9IHZhbHVlXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmYpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBmb3IgKHZhciBpID0gMCwgaiA9IE1hdGgubWluKGxlbiAtIG9mZnNldCwgMik7IGkgPCBqOyBpKyspIHtcbiAgICBidWZbb2Zmc2V0ICsgaV0gPVxuICAgICAgICAodmFsdWUgJiAoMHhmZiA8PCAoOCAqIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpKSkpID4+PlxuICAgICAgICAgICAgKGxpdHRsZUVuZGlhbiA/IGkgOiAxIC0gaSkgKiA4XG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQxNkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZVVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZVVJbnQzMiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ3RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZ1aW50KHZhbHVlLCAweGZmZmZmZmZmKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihsZW4gLSBvZmZzZXQsIDQpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID1cbiAgICAgICAgKHZhbHVlID4+PiAobGl0dGxlRW5kaWFuID8gaSA6IDMgLSBpKSAqIDgpICYgMHhmZlxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MzJCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50OCA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgPCB0aGlzLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmLCAtMHg4MClcbiAgfVxuXG4gIGlmIChvZmZzZXQgPj0gdGhpcy5sZW5ndGgpXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgdGhpcy53cml0ZVVJbnQ4KHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgdGhpcy53cml0ZVVJbnQ4KDB4ZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUludDE2IChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZiwgLTB4ODAwMClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIF93cml0ZVVJbnQxNihidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG4gIGVsc2VcbiAgICBfd3JpdGVVSW50MTYoYnVmLCAweGZmZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDE2TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZmZmZmZmZiwgLTB4ODAwMDAwMDApXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICBfd3JpdGVVSW50MzIoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgX3dyaXRlVUludDMyKGJ1ZiwgMHhmZmZmZmZmZiArIHZhbHVlICsgMSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MzJMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQzMih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVGbG9hdCAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZJRUVFNzU0KHZhbHVlLCAzLjQwMjgyMzQ2NjM4NTI4ODZlKzM4LCAtMy40MDI4MjM0NjYzODUyODg2ZSszOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRmxvYXRMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVGbG9hdCh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0QkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVEb3VibGUgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgNyA8IGJ1Zi5sZW5ndGgsXG4gICAgICAgICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgsIC0xLjc5NzY5MzEzNDg2MjMxNTdFKzMwOClcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGllZWU3NTQud3JpdGUoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlRG91YmxlQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRG91YmxlKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuLy8gZmlsbCh2YWx1ZSwgc3RhcnQ9MCwgZW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmZpbGwgPSBmdW5jdGlvbiAodmFsdWUsIHN0YXJ0LCBlbmQpIHtcbiAgaWYgKCF2YWx1ZSkgdmFsdWUgPSAwXG4gIGlmICghc3RhcnQpIHN0YXJ0ID0gMFxuICBpZiAoIWVuZCkgZW5kID0gdGhpcy5sZW5ndGhcblxuICBpZiAodHlwZW9mIHZhbHVlID09PSAnc3RyaW5nJykge1xuICAgIHZhbHVlID0gdmFsdWUuY2hhckNvZGVBdCgwKVxuICB9XG5cbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgIWlzTmFOKHZhbHVlKSwgJ3ZhbHVlIGlzIG5vdCBhIG51bWJlcicpXG4gIGFzc2VydChlbmQgPj0gc3RhcnQsICdlbmQgPCBzdGFydCcpXG5cbiAgLy8gRmlsbCAwIGJ5dGVzOyB3ZSdyZSBkb25lXG4gIGlmIChlbmQgPT09IHN0YXJ0KSByZXR1cm5cbiAgaWYgKHRoaXMubGVuZ3RoID09PSAwKSByZXR1cm5cblxuICBhc3NlcnQoc3RhcnQgPj0gMCAmJiBzdGFydCA8IHRoaXMubGVuZ3RoLCAnc3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChlbmQgPj0gMCAmJiBlbmQgPD0gdGhpcy5sZW5ndGgsICdlbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgZm9yICh2YXIgaSA9IHN0YXJ0OyBpIDwgZW5kOyBpKyspIHtcbiAgICB0aGlzW2ldID0gdmFsdWVcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLmluc3BlY3QgPSBmdW5jdGlvbiAoKSB7XG4gIHZhciBvdXQgPSBbXVxuICB2YXIgbGVuID0gdGhpcy5sZW5ndGhcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIG91dFtpXSA9IHRvSGV4KHRoaXNbaV0pXG4gICAgaWYgKGkgPT09IGV4cG9ydHMuSU5TUEVDVF9NQVhfQllURVMpIHtcbiAgICAgIG91dFtpICsgMV0gPSAnLi4uJ1xuICAgICAgYnJlYWtcbiAgICB9XG4gIH1cbiAgcmV0dXJuICc8QnVmZmVyICcgKyBvdXQuam9pbignICcpICsgJz4nXG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG5ldyBgQXJyYXlCdWZmZXJgIHdpdGggdGhlICpjb3BpZWQqIG1lbW9yeSBvZiB0aGUgYnVmZmVyIGluc3RhbmNlLlxuICogQWRkZWQgaW4gTm9kZSAwLjEyLiBPbmx5IGF2YWlsYWJsZSBpbiBicm93c2VycyB0aGF0IHN1cHBvcnQgQXJyYXlCdWZmZXIuXG4gKi9cbkJ1ZmZlci5wcm90b3R5cGUudG9BcnJheUJ1ZmZlciA9IGZ1bmN0aW9uICgpIHtcbiAgaWYgKHR5cGVvZiBVaW50OEFycmF5ICE9PSAndW5kZWZpbmVkJykge1xuICAgIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgICByZXR1cm4gKG5ldyBCdWZmZXIodGhpcykpLmJ1ZmZlclxuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgYnVmID0gbmV3IFVpbnQ4QXJyYXkodGhpcy5sZW5ndGgpXG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gYnVmLmxlbmd0aDsgaSA8IGxlbjsgaSArPSAxKVxuICAgICAgICBidWZbaV0gPSB0aGlzW2ldXG4gICAgICByZXR1cm4gYnVmLmJ1ZmZlclxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0J1ZmZlci50b0FycmF5QnVmZmVyIG5vdCBzdXBwb3J0ZWQgaW4gdGhpcyBicm93c2VyJylcbiAgfVxufVxuXG4vLyBIRUxQRVIgRlVOQ1RJT05TXG4vLyA9PT09PT09PT09PT09PT09XG5cbmZ1bmN0aW9uIHN0cmluZ3RyaW0gKHN0cikge1xuICBpZiAoc3RyLnRyaW0pIHJldHVybiBzdHIudHJpbSgpXG4gIHJldHVybiBzdHIucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG59XG5cbnZhciBCUCA9IEJ1ZmZlci5wcm90b3R5cGVcblxuLyoqXG4gKiBBdWdtZW50IGEgVWludDhBcnJheSAqaW5zdGFuY2UqIChub3QgdGhlIFVpbnQ4QXJyYXkgY2xhc3MhKSB3aXRoIEJ1ZmZlciBtZXRob2RzXG4gKi9cbkJ1ZmZlci5fYXVnbWVudCA9IGZ1bmN0aW9uIChhcnIpIHtcbiAgYXJyLl9pc0J1ZmZlciA9IHRydWVcblxuICAvLyBzYXZlIHJlZmVyZW5jZSB0byBvcmlnaW5hbCBVaW50OEFycmF5IGdldC9zZXQgbWV0aG9kcyBiZWZvcmUgb3ZlcndyaXRpbmdcbiAgYXJyLl9nZXQgPSBhcnIuZ2V0XG4gIGFyci5fc2V0ID0gYXJyLnNldFxuXG4gIC8vIGRlcHJlY2F0ZWQsIHdpbGwgYmUgcmVtb3ZlZCBpbiBub2RlIDAuMTMrXG4gIGFyci5nZXQgPSBCUC5nZXRcbiAgYXJyLnNldCA9IEJQLnNldFxuXG4gIGFyci53cml0ZSA9IEJQLndyaXRlXG4gIGFyci50b1N0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0xvY2FsZVN0cmluZyA9IEJQLnRvU3RyaW5nXG4gIGFyci50b0pTT04gPSBCUC50b0pTT05cbiAgYXJyLmNvcHkgPSBCUC5jb3B5XG4gIGFyci5zbGljZSA9IEJQLnNsaWNlXG4gIGFyci5yZWFkVUludDggPSBCUC5yZWFkVUludDhcbiAgYXJyLnJlYWRVSW50MTZMRSA9IEJQLnJlYWRVSW50MTZMRVxuICBhcnIucmVhZFVJbnQxNkJFID0gQlAucmVhZFVJbnQxNkJFXG4gIGFyci5yZWFkVUludDMyTEUgPSBCUC5yZWFkVUludDMyTEVcbiAgYXJyLnJlYWRVSW50MzJCRSA9IEJQLnJlYWRVSW50MzJCRVxuICBhcnIucmVhZEludDggPSBCUC5yZWFkSW50OFxuICBhcnIucmVhZEludDE2TEUgPSBCUC5yZWFkSW50MTZMRVxuICBhcnIucmVhZEludDE2QkUgPSBCUC5yZWFkSW50MTZCRVxuICBhcnIucmVhZEludDMyTEUgPSBCUC5yZWFkSW50MzJMRVxuICBhcnIucmVhZEludDMyQkUgPSBCUC5yZWFkSW50MzJCRVxuICBhcnIucmVhZEZsb2F0TEUgPSBCUC5yZWFkRmxvYXRMRVxuICBhcnIucmVhZEZsb2F0QkUgPSBCUC5yZWFkRmxvYXRCRVxuICBhcnIucmVhZERvdWJsZUxFID0gQlAucmVhZERvdWJsZUxFXG4gIGFyci5yZWFkRG91YmxlQkUgPSBCUC5yZWFkRG91YmxlQkVcbiAgYXJyLndyaXRlVUludDggPSBCUC53cml0ZVVJbnQ4XG4gIGFyci53cml0ZVVJbnQxNkxFID0gQlAud3JpdGVVSW50MTZMRVxuICBhcnIud3JpdGVVSW50MTZCRSA9IEJQLndyaXRlVUludDE2QkVcbiAgYXJyLndyaXRlVUludDMyTEUgPSBCUC53cml0ZVVJbnQzMkxFXG4gIGFyci53cml0ZVVJbnQzMkJFID0gQlAud3JpdGVVSW50MzJCRVxuICBhcnIud3JpdGVJbnQ4ID0gQlAud3JpdGVJbnQ4XG4gIGFyci53cml0ZUludDE2TEUgPSBCUC53cml0ZUludDE2TEVcbiAgYXJyLndyaXRlSW50MTZCRSA9IEJQLndyaXRlSW50MTZCRVxuICBhcnIud3JpdGVJbnQzMkxFID0gQlAud3JpdGVJbnQzMkxFXG4gIGFyci53cml0ZUludDMyQkUgPSBCUC53cml0ZUludDMyQkVcbiAgYXJyLndyaXRlRmxvYXRMRSA9IEJQLndyaXRlRmxvYXRMRVxuICBhcnIud3JpdGVGbG9hdEJFID0gQlAud3JpdGVGbG9hdEJFXG4gIGFyci53cml0ZURvdWJsZUxFID0gQlAud3JpdGVEb3VibGVMRVxuICBhcnIud3JpdGVEb3VibGVCRSA9IEJQLndyaXRlRG91YmxlQkVcbiAgYXJyLmZpbGwgPSBCUC5maWxsXG4gIGFyci5pbnNwZWN0ID0gQlAuaW5zcGVjdFxuICBhcnIudG9BcnJheUJ1ZmZlciA9IEJQLnRvQXJyYXlCdWZmZXJcblxuICByZXR1cm4gYXJyXG59XG5cbi8vIHNsaWNlKHN0YXJ0LCBlbmQpXG5mdW5jdGlvbiBjbGFtcCAoaW5kZXgsIGxlbiwgZGVmYXVsdFZhbHVlKSB7XG4gIGlmICh0eXBlb2YgaW5kZXggIT09ICdudW1iZXInKSByZXR1cm4gZGVmYXVsdFZhbHVlXG4gIGluZGV4ID0gfn5pbmRleDsgIC8vIENvZXJjZSB0byBpbnRlZ2VyLlxuICBpZiAoaW5kZXggPj0gbGVuKSByZXR1cm4gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgaW5kZXggKz0gbGVuXG4gIGlmIChpbmRleCA+PSAwKSByZXR1cm4gaW5kZXhcbiAgcmV0dXJuIDBcbn1cblxuZnVuY3Rpb24gY29lcmNlIChsZW5ndGgpIHtcbiAgLy8gQ29lcmNlIGxlbmd0aCB0byBhIG51bWJlciAocG9zc2libHkgTmFOKSwgcm91bmQgdXBcbiAgLy8gaW4gY2FzZSBpdCdzIGZyYWN0aW9uYWwgKGUuZy4gMTIzLjQ1NikgdGhlbiBkbyBhXG4gIC8vIGRvdWJsZSBuZWdhdGUgdG8gY29lcmNlIGEgTmFOIHRvIDAuIEVhc3ksIHJpZ2h0P1xuICBsZW5ndGggPSB+fk1hdGguY2VpbCgrbGVuZ3RoKVxuICByZXR1cm4gbGVuZ3RoIDwgMCA/IDAgOiBsZW5ndGhcbn1cblxuZnVuY3Rpb24gaXNBcnJheSAoc3ViamVjdCkge1xuICByZXR1cm4gKEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKHN1YmplY3QpIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHN1YmplY3QpID09PSAnW29iamVjdCBBcnJheV0nXG4gIH0pKHN1YmplY3QpXG59XG5cbmZ1bmN0aW9uIGlzQXJyYXlpc2ggKHN1YmplY3QpIHtcbiAgcmV0dXJuIGlzQXJyYXkoc3ViamVjdCkgfHwgQnVmZmVyLmlzQnVmZmVyKHN1YmplY3QpIHx8XG4gICAgICBzdWJqZWN0ICYmIHR5cGVvZiBzdWJqZWN0ID09PSAnb2JqZWN0JyAmJlxuICAgICAgdHlwZW9mIHN1YmplY3QubGVuZ3RoID09PSAnbnVtYmVyJ1xufVxuXG5mdW5jdGlvbiB0b0hleCAobikge1xuICBpZiAobiA8IDE2KSByZXR1cm4gJzAnICsgbi50b1N0cmluZygxNilcbiAgcmV0dXJuIG4udG9TdHJpbmcoMTYpXG59XG5cbmZ1bmN0aW9uIHV0ZjhUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgdmFyIGIgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGlmIChiIDw9IDB4N0YpXG4gICAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSlcbiAgICBlbHNlIHtcbiAgICAgIHZhciBzdGFydCA9IGlcbiAgICAgIGlmIChiID49IDB4RDgwMCAmJiBiIDw9IDB4REZGRikgaSsrXG4gICAgICB2YXIgaCA9IGVuY29kZVVSSUNvbXBvbmVudChzdHIuc2xpY2Uoc3RhcnQsIGkrMSkpLnN1YnN0cigxKS5zcGxpdCgnJScpXG4gICAgICBmb3IgKHZhciBqID0gMDsgaiA8IGgubGVuZ3RoOyBqKyspXG4gICAgICAgIGJ5dGVBcnJheS5wdXNoKHBhcnNlSW50KGhbal0sIDE2KSlcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiBhc2NpaVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYnl0ZUFycmF5ID0gW11cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBzdHIubGVuZ3RoOyBpKyspIHtcbiAgICAvLyBOb2RlJ3MgY29kZSBzZWVtcyB0byBiZSBkb2luZyB0aGlzIGFuZCBub3QgJiAweDdGLi5cbiAgICBieXRlQXJyYXkucHVzaChzdHIuY2hhckNvZGVBdChpKSAmIDB4RkYpXG4gIH1cbiAgcmV0dXJuIGJ5dGVBcnJheVxufVxuXG5mdW5jdGlvbiB1dGYxNmxlVG9CeXRlcyAoc3RyKSB7XG4gIHZhciBjLCBoaSwgbG9cbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgYyA9IHN0ci5jaGFyQ29kZUF0KGkpXG4gICAgaGkgPSBjID4+IDhcbiAgICBsbyA9IGMgJSAyNTZcbiAgICBieXRlQXJyYXkucHVzaChsbylcbiAgICBieXRlQXJyYXkucHVzaChoaSlcbiAgfVxuXG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYmFzZTY0VG9CeXRlcyAoc3RyKSB7XG4gIHJldHVybiBiYXNlNjQudG9CeXRlQXJyYXkoc3RyKVxufVxuXG5mdW5jdGlvbiBibGl0QnVmZmVyIChzcmMsIGRzdCwgb2Zmc2V0LCBsZW5ndGgpIHtcbiAgdmFyIHBvc1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgaWYgKChpICsgb2Zmc2V0ID49IGRzdC5sZW5ndGgpIHx8IChpID49IHNyYy5sZW5ndGgpKVxuICAgICAgYnJlYWtcbiAgICBkc3RbaSArIG9mZnNldF0gPSBzcmNbaV1cbiAgfVxuICByZXR1cm4gaVxufVxuXG5mdW5jdGlvbiBkZWNvZGVVdGY4Q2hhciAoc3RyKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGRlY29kZVVSSUNvbXBvbmVudChzdHIpXG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKDB4RkZGRCkgLy8gVVRGIDggaW52YWxpZCBjaGFyXG4gIH1cbn1cblxuLypcbiAqIFdlIGhhdmUgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIHZhbHVlIGlzIGEgdmFsaWQgaW50ZWdlci4gVGhpcyBtZWFucyB0aGF0IGl0XG4gKiBpcyBub24tbmVnYXRpdmUuIEl0IGhhcyBubyBmcmFjdGlvbmFsIGNvbXBvbmVudCBhbmQgdGhhdCBpdCBkb2VzIG5vdFxuICogZXhjZWVkIHRoZSBtYXhpbXVtIGFsbG93ZWQgdmFsdWUuXG4gKi9cbmZ1bmN0aW9uIHZlcmlmdWludCAodmFsdWUsIG1heCkge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPj0gMCwgJ3NwZWNpZmllZCBhIG5lZ2F0aXZlIHZhbHVlIGZvciB3cml0aW5nIGFuIHVuc2lnbmVkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGlzIGxhcmdlciB0aGFuIG1heGltdW0gdmFsdWUgZm9yIHR5cGUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG5mdW5jdGlvbiB2ZXJpZnNpbnQgKHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxuICBhc3NlcnQoTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlLCAndmFsdWUgaGFzIGEgZnJhY3Rpb25hbCBjb21wb25lbnQnKVxufVxuXG5mdW5jdGlvbiB2ZXJpZklFRUU3NTQgKHZhbHVlLCBtYXgsIG1pbikge1xuICBhc3NlcnQodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJywgJ2Nhbm5vdCB3cml0ZSBhIG5vbi1udW1iZXIgYXMgYSBudW1iZXInKVxuICBhc3NlcnQodmFsdWUgPD0gbWF4LCAndmFsdWUgbGFyZ2VyIHRoYW4gbWF4aW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KHZhbHVlID49IG1pbiwgJ3ZhbHVlIHNtYWxsZXIgdGhhbiBtaW5pbXVtIGFsbG93ZWQgdmFsdWUnKVxufVxuXG5mdW5jdGlvbiBhc3NlcnQgKHRlc3QsIG1lc3NhZ2UpIHtcbiAgaWYgKCF0ZXN0KSB0aHJvdyBuZXcgRXJyb3IobWVzc2FnZSB8fCAnRmFpbGVkIGFzc2VydGlvbicpXG59XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiREYxdXJ4XCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL2luZGV4LmpzXCIsXCIvLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xudmFyIGxvb2t1cCA9ICdBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWmFiY2RlZmdoaWprbG1ub3BxcnN0dXZ3eHl6MDEyMzQ1Njc4OSsvJztcblxuOyhmdW5jdGlvbiAoZXhwb3J0cykge1xuXHQndXNlIHN0cmljdCc7XG5cbiAgdmFyIEFyciA9ICh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcpXG4gICAgPyBVaW50OEFycmF5XG4gICAgOiBBcnJheVxuXG5cdHZhciBQTFVTICAgPSAnKycuY2hhckNvZGVBdCgwKVxuXHR2YXIgU0xBU0ggID0gJy8nLmNoYXJDb2RlQXQoMClcblx0dmFyIE5VTUJFUiA9ICcwJy5jaGFyQ29kZUF0KDApXG5cdHZhciBMT1dFUiAgPSAnYScuY2hhckNvZGVBdCgwKVxuXHR2YXIgVVBQRVIgID0gJ0EnLmNoYXJDb2RlQXQoMClcblxuXHRmdW5jdGlvbiBkZWNvZGUgKGVsdCkge1xuXHRcdHZhciBjb2RlID0gZWx0LmNoYXJDb2RlQXQoMClcblx0XHRpZiAoY29kZSA9PT0gUExVUylcblx0XHRcdHJldHVybiA2MiAvLyAnKydcblx0XHRpZiAoY29kZSA9PT0gU0xBU0gpXG5cdFx0XHRyZXR1cm4gNjMgLy8gJy8nXG5cdFx0aWYgKGNvZGUgPCBOVU1CRVIpXG5cdFx0XHRyZXR1cm4gLTEgLy9ubyBtYXRjaFxuXHRcdGlmIChjb2RlIDwgTlVNQkVSICsgMTApXG5cdFx0XHRyZXR1cm4gY29kZSAtIE5VTUJFUiArIDI2ICsgMjZcblx0XHRpZiAoY29kZSA8IFVQUEVSICsgMjYpXG5cdFx0XHRyZXR1cm4gY29kZSAtIFVQUEVSXG5cdFx0aWYgKGNvZGUgPCBMT1dFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBMT1dFUiArIDI2XG5cdH1cblxuXHRmdW5jdGlvbiBiNjRUb0J5dGVBcnJheSAoYjY0KSB7XG5cdFx0dmFyIGksIGosIGwsIHRtcCwgcGxhY2VIb2xkZXJzLCBhcnJcblxuXHRcdGlmIChiNjQubGVuZ3RoICUgNCA+IDApIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignSW52YWxpZCBzdHJpbmcuIExlbmd0aCBtdXN0IGJlIGEgbXVsdGlwbGUgb2YgNCcpXG5cdFx0fVxuXG5cdFx0Ly8gdGhlIG51bWJlciBvZiBlcXVhbCBzaWducyAocGxhY2UgaG9sZGVycylcblx0XHQvLyBpZiB0aGVyZSBhcmUgdHdvIHBsYWNlaG9sZGVycywgdGhhbiB0aGUgdHdvIGNoYXJhY3RlcnMgYmVmb3JlIGl0XG5cdFx0Ly8gcmVwcmVzZW50IG9uZSBieXRlXG5cdFx0Ly8gaWYgdGhlcmUgaXMgb25seSBvbmUsIHRoZW4gdGhlIHRocmVlIGNoYXJhY3RlcnMgYmVmb3JlIGl0IHJlcHJlc2VudCAyIGJ5dGVzXG5cdFx0Ly8gdGhpcyBpcyBqdXN0IGEgY2hlYXAgaGFjayB0byBub3QgZG8gaW5kZXhPZiB0d2ljZVxuXHRcdHZhciBsZW4gPSBiNjQubGVuZ3RoXG5cdFx0cGxhY2VIb2xkZXJzID0gJz0nID09PSBiNjQuY2hhckF0KGxlbiAtIDIpID8gMiA6ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAxKSA/IDEgOiAwXG5cblx0XHQvLyBiYXNlNjQgaXMgNC8zICsgdXAgdG8gdHdvIGNoYXJhY3RlcnMgb2YgdGhlIG9yaWdpbmFsIGRhdGFcblx0XHRhcnIgPSBuZXcgQXJyKGI2NC5sZW5ndGggKiAzIC8gNCAtIHBsYWNlSG9sZGVycylcblxuXHRcdC8vIGlmIHRoZXJlIGFyZSBwbGFjZWhvbGRlcnMsIG9ubHkgZ2V0IHVwIHRvIHRoZSBsYXN0IGNvbXBsZXRlIDQgY2hhcnNcblx0XHRsID0gcGxhY2VIb2xkZXJzID4gMCA/IGI2NC5sZW5ndGggLSA0IDogYjY0Lmxlbmd0aFxuXG5cdFx0dmFyIEwgPSAwXG5cblx0XHRmdW5jdGlvbiBwdXNoICh2KSB7XG5cdFx0XHRhcnJbTCsrXSA9IHZcblx0XHR9XG5cblx0XHRmb3IgKGkgPSAwLCBqID0gMDsgaSA8IGw7IGkgKz0gNCwgaiArPSAzKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDE4KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpIDw8IDEyKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpIDw8IDYpIHwgZGVjb2RlKGI2NC5jaGFyQXQoaSArIDMpKVxuXHRcdFx0cHVzaCgodG1wICYgMHhGRjAwMDApID4+IDE2KVxuXHRcdFx0cHVzaCgodG1wICYgMHhGRjAwKSA+PiA4KVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdGlmIChwbGFjZUhvbGRlcnMgPT09IDIpIHtcblx0XHRcdHRtcCA9IChkZWNvZGUoYjY0LmNoYXJBdChpKSkgPDwgMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA+PiA0KVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH0gZWxzZSBpZiAocGxhY2VIb2xkZXJzID09PSAxKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDEwKSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMSkpIDw8IDQpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAyKSkgPj4gMilcblx0XHRcdHB1c2goKHRtcCA+PiA4KSAmIDB4RkYpXG5cdFx0XHRwdXNoKHRtcCAmIDB4RkYpXG5cdFx0fVxuXG5cdFx0cmV0dXJuIGFyclxuXHR9XG5cblx0ZnVuY3Rpb24gdWludDhUb0Jhc2U2NCAodWludDgpIHtcblx0XHR2YXIgaSxcblx0XHRcdGV4dHJhQnl0ZXMgPSB1aW50OC5sZW5ndGggJSAzLCAvLyBpZiB3ZSBoYXZlIDEgYnl0ZSBsZWZ0LCBwYWQgMiBieXRlc1xuXHRcdFx0b3V0cHV0ID0gXCJcIixcblx0XHRcdHRlbXAsIGxlbmd0aFxuXG5cdFx0ZnVuY3Rpb24gZW5jb2RlIChudW0pIHtcblx0XHRcdHJldHVybiBsb29rdXAuY2hhckF0KG51bSlcblx0XHR9XG5cblx0XHRmdW5jdGlvbiB0cmlwbGV0VG9CYXNlNjQgKG51bSkge1xuXHRcdFx0cmV0dXJuIGVuY29kZShudW0gPj4gMTggJiAweDNGKSArIGVuY29kZShudW0gPj4gMTIgJiAweDNGKSArIGVuY29kZShudW0gPj4gNiAmIDB4M0YpICsgZW5jb2RlKG51bSAmIDB4M0YpXG5cdFx0fVxuXG5cdFx0Ly8gZ28gdGhyb3VnaCB0aGUgYXJyYXkgZXZlcnkgdGhyZWUgYnl0ZXMsIHdlJ2xsIGRlYWwgd2l0aCB0cmFpbGluZyBzdHVmZiBsYXRlclxuXHRcdGZvciAoaSA9IDAsIGxlbmd0aCA9IHVpbnQ4Lmxlbmd0aCAtIGV4dHJhQnl0ZXM7IGkgPCBsZW5ndGg7IGkgKz0gMykge1xuXHRcdFx0dGVtcCA9ICh1aW50OFtpXSA8PCAxNikgKyAodWludDhbaSArIDFdIDw8IDgpICsgKHVpbnQ4W2kgKyAyXSlcblx0XHRcdG91dHB1dCArPSB0cmlwbGV0VG9CYXNlNjQodGVtcClcblx0XHR9XG5cblx0XHQvLyBwYWQgdGhlIGVuZCB3aXRoIHplcm9zLCBidXQgbWFrZSBzdXJlIHRvIG5vdCBmb3JnZXQgdGhlIGV4dHJhIGJ5dGVzXG5cdFx0c3dpdGNoIChleHRyYUJ5dGVzKSB7XG5cdFx0XHRjYXNlIDE6XG5cdFx0XHRcdHRlbXAgPSB1aW50OFt1aW50OC5sZW5ndGggLSAxXVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMilcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA8PCA0KSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSAnPT0nXG5cdFx0XHRcdGJyZWFrXG5cdFx0XHRjYXNlIDI6XG5cdFx0XHRcdHRlbXAgPSAodWludDhbdWludDgubGVuZ3RoIC0gMl0gPDwgOCkgKyAodWludDhbdWludDgubGVuZ3RoIC0gMV0pXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUodGVtcCA+PiAxMClcblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSgodGVtcCA+PiA0KSAmIDB4M0YpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgMikgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz0nXG5cdFx0XHRcdGJyZWFrXG5cdFx0fVxuXG5cdFx0cmV0dXJuIG91dHB1dFxuXHR9XG5cblx0ZXhwb3J0cy50b0J5dGVBcnJheSA9IGI2NFRvQnl0ZUFycmF5XG5cdGV4cG9ydHMuZnJvbUJ5dGVBcnJheSA9IHVpbnQ4VG9CYXNlNjRcbn0odHlwZW9mIGV4cG9ydHMgPT09ICd1bmRlZmluZWQnID8gKHRoaXMuYmFzZTY0anMgPSB7fSkgOiBleHBvcnRzKSlcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJERjF1cnhcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvbm9kZV9tb2R1bGVzL2Jhc2U2NC1qcy9saWIvYjY0LmpzXCIsXCIvLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuZXhwb3J0cy5yZWFkID0gZnVuY3Rpb24oYnVmZmVyLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSxcbiAgICAgIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDEsXG4gICAgICBlTWF4ID0gKDEgPDwgZUxlbikgLSAxLFxuICAgICAgZUJpYXMgPSBlTWF4ID4+IDEsXG4gICAgICBuQml0cyA9IC03LFxuICAgICAgaSA9IGlzTEUgPyAobkJ5dGVzIC0gMSkgOiAwLFxuICAgICAgZCA9IGlzTEUgPyAtMSA6IDEsXG4gICAgICBzID0gYnVmZmVyW29mZnNldCArIGldO1xuXG4gIGkgKz0gZDtcblxuICBlID0gcyAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKTtcbiAgcyA+Pj0gKC1uQml0cyk7XG4gIG5CaXRzICs9IGVMZW47XG4gIGZvciAoOyBuQml0cyA+IDA7IGUgPSBlICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpO1xuXG4gIG0gPSBlICYgKCgxIDw8ICgtbkJpdHMpKSAtIDEpO1xuICBlID4+PSAoLW5CaXRzKTtcbiAgbkJpdHMgKz0gbUxlbjtcbiAgZm9yICg7IG5CaXRzID4gMDsgbSA9IG0gKiAyNTYgKyBidWZmZXJbb2Zmc2V0ICsgaV0sIGkgKz0gZCwgbkJpdHMgLT0gOCk7XG5cbiAgaWYgKGUgPT09IDApIHtcbiAgICBlID0gMSAtIGVCaWFzO1xuICB9IGVsc2UgaWYgKGUgPT09IGVNYXgpIHtcbiAgICByZXR1cm4gbSA/IE5hTiA6ICgocyA/IC0xIDogMSkgKiBJbmZpbml0eSk7XG4gIH0gZWxzZSB7XG4gICAgbSA9IG0gKyBNYXRoLnBvdygyLCBtTGVuKTtcbiAgICBlID0gZSAtIGVCaWFzO1xuICB9XG4gIHJldHVybiAocyA/IC0xIDogMSkgKiBtICogTWF0aC5wb3coMiwgZSAtIG1MZW4pO1xufTtcblxuZXhwb3J0cy53cml0ZSA9IGZ1bmN0aW9uKGJ1ZmZlciwgdmFsdWUsIG9mZnNldCwgaXNMRSwgbUxlbiwgbkJ5dGVzKSB7XG4gIHZhciBlLCBtLCBjLFxuICAgICAgZUxlbiA9IG5CeXRlcyAqIDggLSBtTGVuIC0gMSxcbiAgICAgIGVNYXggPSAoMSA8PCBlTGVuKSAtIDEsXG4gICAgICBlQmlhcyA9IGVNYXggPj4gMSxcbiAgICAgIHJ0ID0gKG1MZW4gPT09IDIzID8gTWF0aC5wb3coMiwgLTI0KSAtIE1hdGgucG93KDIsIC03NykgOiAwKSxcbiAgICAgIGkgPSBpc0xFID8gMCA6IChuQnl0ZXMgLSAxKSxcbiAgICAgIGQgPSBpc0xFID8gMSA6IC0xLFxuICAgICAgcyA9IHZhbHVlIDwgMCB8fCAodmFsdWUgPT09IDAgJiYgMSAvIHZhbHVlIDwgMCkgPyAxIDogMDtcblxuICB2YWx1ZSA9IE1hdGguYWJzKHZhbHVlKTtcblxuICBpZiAoaXNOYU4odmFsdWUpIHx8IHZhbHVlID09PSBJbmZpbml0eSkge1xuICAgIG0gPSBpc05hTih2YWx1ZSkgPyAxIDogMDtcbiAgICBlID0gZU1heDtcbiAgfSBlbHNlIHtcbiAgICBlID0gTWF0aC5mbG9vcihNYXRoLmxvZyh2YWx1ZSkgLyBNYXRoLkxOMik7XG4gICAgaWYgKHZhbHVlICogKGMgPSBNYXRoLnBvdygyLCAtZSkpIDwgMSkge1xuICAgICAgZS0tO1xuICAgICAgYyAqPSAyO1xuICAgIH1cbiAgICBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIHZhbHVlICs9IHJ0IC8gYztcbiAgICB9IGVsc2Uge1xuICAgICAgdmFsdWUgKz0gcnQgKiBNYXRoLnBvdygyLCAxIC0gZUJpYXMpO1xuICAgIH1cbiAgICBpZiAodmFsdWUgKiBjID49IDIpIHtcbiAgICAgIGUrKztcbiAgICAgIGMgLz0gMjtcbiAgICB9XG5cbiAgICBpZiAoZSArIGVCaWFzID49IGVNYXgpIHtcbiAgICAgIG0gPSAwO1xuICAgICAgZSA9IGVNYXg7XG4gICAgfSBlbHNlIGlmIChlICsgZUJpYXMgPj0gMSkge1xuICAgICAgbSA9ICh2YWx1ZSAqIGMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pO1xuICAgICAgZSA9IGUgKyBlQmlhcztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IHZhbHVlICogTWF0aC5wb3coMiwgZUJpYXMgLSAxKSAqIE1hdGgucG93KDIsIG1MZW4pO1xuICAgICAgZSA9IDA7XG4gICAgfVxuICB9XG5cbiAgZm9yICg7IG1MZW4gPj0gODsgYnVmZmVyW29mZnNldCArIGldID0gbSAmIDB4ZmYsIGkgKz0gZCwgbSAvPSAyNTYsIG1MZW4gLT0gOCk7XG5cbiAgZSA9IChlIDw8IG1MZW4pIHwgbTtcbiAgZUxlbiArPSBtTGVuO1xuICBmb3IgKDsgZUxlbiA+IDA7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IGUgJiAweGZmLCBpICs9IGQsIGUgLz0gMjU2LCBlTGVuIC09IDgpO1xuXG4gIGJ1ZmZlcltvZmZzZXQgKyBpIC0gZF0gfD0gcyAqIDEyODtcbn07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiREYxdXJ4XCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL25vZGVfbW9kdWxlcy9pZWVlNzU0L2luZGV4LmpzXCIsXCIvLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL25vZGVfbW9kdWxlcy9pZWVlNzU0XCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxucHJvY2Vzcy5uZXh0VGljayA9IChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIGNhblNldEltbWVkaWF0ZSA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnNldEltbWVkaWF0ZTtcbiAgICB2YXIgY2FuUG9zdCA9IHR5cGVvZiB3aW5kb3cgIT09ICd1bmRlZmluZWQnXG4gICAgJiYgd2luZG93LnBvc3RNZXNzYWdlICYmIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyXG4gICAgO1xuXG4gICAgaWYgKGNhblNldEltbWVkaWF0ZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGYpIHsgcmV0dXJuIHdpbmRvdy5zZXRJbW1lZGlhdGUoZikgfTtcbiAgICB9XG5cbiAgICBpZiAoY2FuUG9zdCkge1xuICAgICAgICB2YXIgcXVldWUgPSBbXTtcbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCBmdW5jdGlvbiAoZXYpIHtcbiAgICAgICAgICAgIHZhciBzb3VyY2UgPSBldi5zb3VyY2U7XG4gICAgICAgICAgICBpZiAoKHNvdXJjZSA9PT0gd2luZG93IHx8IHNvdXJjZSA9PT0gbnVsbCkgJiYgZXYuZGF0YSA9PT0gJ3Byb2Nlc3MtdGljaycpIHtcbiAgICAgICAgICAgICAgICBldi5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgICAgICBpZiAocXVldWUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgICAgICAgICB2YXIgZm4gPSBxdWV1ZS5zaGlmdCgpO1xuICAgICAgICAgICAgICAgICAgICBmbigpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfSwgdHJ1ZSk7XG5cbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgICAgICBxdWV1ZS5wdXNoKGZuKTtcbiAgICAgICAgICAgIHdpbmRvdy5wb3N0TWVzc2FnZSgncHJvY2Vzcy10aWNrJywgJyonKTtcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICByZXR1cm4gZnVuY3Rpb24gbmV4dFRpY2soZm4pIHtcbiAgICAgICAgc2V0VGltZW91dChmbiwgMCk7XG4gICAgfTtcbn0pKCk7XG5cbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xuXG5mdW5jdGlvbiBub29wKCkge31cblxucHJvY2Vzcy5vbiA9IG5vb3A7XG5wcm9jZXNzLmFkZExpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3Mub25jZSA9IG5vb3A7XG5wcm9jZXNzLm9mZiA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUxpc3RlbmVyID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlQWxsTGlzdGVuZXJzID0gbm9vcDtcbnByb2Nlc3MuZW1pdCA9IG5vb3A7XG5cbnByb2Nlc3MuYmluZGluZyA9IGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmJpbmRpbmcgaXMgbm90IHN1cHBvcnRlZCcpO1xufVxuXG4vLyBUT0RPKHNodHlsbWFuKVxucHJvY2Vzcy5jd2QgPSBmdW5jdGlvbiAoKSB7IHJldHVybiAnLycgfTtcbnByb2Nlc3MuY2hkaXIgPSBmdW5jdGlvbiAoZGlyKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdwcm9jZXNzLmNoZGlyIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiREYxdXJ4XCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzXCIsXCIvLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzc1wiKSJdfQ==
