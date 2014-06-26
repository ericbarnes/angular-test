(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
module.exports = function($scope) {
    $scope.testVar = 'We are up and running!';
};

}).call(this,require("DF1urx"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/controllers/main.js","/controllers")
},{"DF1urx":11,"buffer":8}],2:[function(require,module,exports){
(function (process,global,Buffer,__argument0,__argument1,__argument2,__argument3,__filename,__dirname){
var PostCtrl = function($scope, $stateParams) {
    console.log("test", $scope.posts);
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
        .state('posts.list', {
            url: "/posts/list",
            templateUrl: "views/posts-list.html",
            controller: require('./controllers/posts')
        })
        .state('posts.details', {
            url: "/posts/:postId",
            templateUrl: "views/post-form.html",
            controller: require('./controllers/post')
        });
});

}).call(this,require("DF1urx"),typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {},require("buffer").Buffer,arguments[3],arguments[4],arguments[5],arguments[6],"/fake_fa1b40.js","/")
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvVXNlcnMvbWF0dHN0YXVmZmVyL1NpdGVzL2Jhcm5lcy1hbmd1bGFyL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXItcGFjay9fcHJlbHVkZS5qcyIsIi9Vc2Vycy9tYXR0c3RhdWZmZXIvU2l0ZXMvYmFybmVzLWFuZ3VsYXIvYXBwL2Fzc2V0cy9qcy9hcHAvY29udHJvbGxlcnMvbWFpbi5qcyIsIi9Vc2Vycy9tYXR0c3RhdWZmZXIvU2l0ZXMvYmFybmVzLWFuZ3VsYXIvYXBwL2Fzc2V0cy9qcy9hcHAvY29udHJvbGxlcnMvcG9zdC5qcyIsIi9Vc2Vycy9tYXR0c3RhdWZmZXIvU2l0ZXMvYmFybmVzLWFuZ3VsYXIvYXBwL2Fzc2V0cy9qcy9hcHAvY29udHJvbGxlcnMvcG9zdHMuanMiLCIvVXNlcnMvbWF0dHN0YXVmZmVyL1NpdGVzL2Jhcm5lcy1hbmd1bGFyL2FwcC9hc3NldHMvanMvYXBwL2Zha2VfZmExYjQwLmpzIiwiL1VzZXJzL21hdHRzdGF1ZmZlci9TaXRlcy9iYXJuZXMtYW5ndWxhci9ub2RlX21vZHVsZXMvYW5ndWxhci11aS1yb3V0ZXIvcmVsZWFzZS9hbmd1bGFyLXVpLXJvdXRlci5qcyIsIi9Vc2Vycy9tYXR0c3RhdWZmZXIvU2l0ZXMvYmFybmVzLWFuZ3VsYXIvbm9kZV9tb2R1bGVzL2FuZ3VsYXIvaW5kZXgtYnJvd3NlcmlmeS5qcyIsIi9Vc2Vycy9tYXR0c3RhdWZmZXIvU2l0ZXMvYmFybmVzLWFuZ3VsYXIvbm9kZV9tb2R1bGVzL2FuZ3VsYXIvbGliL2FuZ3VsYXIubWluLmpzIiwiL1VzZXJzL21hdHRzdGF1ZmZlci9TaXRlcy9iYXJuZXMtYW5ndWxhci9ub2RlX21vZHVsZXMvZ3VscC1icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9idWZmZXIvaW5kZXguanMiLCIvVXNlcnMvbWF0dHN0YXVmZmVyL1NpdGVzL2Jhcm5lcy1hbmd1bGFyL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYi9iNjQuanMiLCIvVXNlcnMvbWF0dHN0YXVmZmVyL1NpdGVzL2Jhcm5lcy1hbmd1bGFyL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qcyIsIi9Vc2Vycy9tYXR0c3RhdWZmZXIvU2l0ZXMvYmFybmVzLWFuZ3VsYXIvbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hwR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2TkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2bENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3Rocm93IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIil9dmFyIGY9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGYuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sZixmLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJHNjb3BlKSB7XG4gICAgJHNjb3BlLnRlc3RWYXIgPSAnV2UgYXJlIHVwIGFuZCBydW5uaW5nISc7XG59O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIkRGMXVyeFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL2NvbnRyb2xsZXJzL21haW4uanNcIixcIi9jb250cm9sbGVyc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBQb3N0Q3RybCA9IGZ1bmN0aW9uKCRzY29wZSwgJHN0YXRlUGFyYW1zKSB7XG4gICAgY29uc29sZS5sb2coXCJ0ZXN0XCIsICRzY29wZS5wb3N0cyk7XG4gICAgJHNjb3BlLnBvc3RJZCA9ICRzdGF0ZVBhcmFtcy5wb3N0SWQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBvc3RDdHJsO1xuXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiREYxdXJ4XCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvY29udHJvbGxlcnMvcG9zdC5qc1wiLFwiL2NvbnRyb2xsZXJzXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xudmFyIFBvc3RzQ3RybCA9IGZ1bmN0aW9uKCRzY29wZSwgJGh0dHApIHtcbiAgICAkaHR0cC5nZXQoJ2FwaS9wb3N0cycpLnN1Y2Nlc3MoZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICAkc2NvcGUucG9zdHMgPSBkYXRhO1xuICAgIH0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQb3N0c0N0cmw7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiREYxdXJ4XCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvY29udHJvbGxlcnMvcG9zdHMuanNcIixcIi9jb250cm9sbGVyc1wiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnJlcXVpcmUoJ2FuZ3VsYXInKTtcbnZhciByb3V0ZXIgPSByZXF1aXJlKCdhbmd1bGFyLXVpLXJvdXRlcicpO1xuXG52YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFtyb3V0ZXJdKTtcblxuYXBwLmNvbmZpZyhmdW5jdGlvbigkc3RhdGVQcm92aWRlciwgJHVybFJvdXRlclByb3ZpZGVyKSB7XG5cbiAgICAvLyBGb3IgYW55IHVubWF0Y2hlZCB1cmwsIHJlZGlyZWN0IHRvIGhvbWUgL1xuICAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoXCIvXCIpO1xuXG4gICAgLy8gTm93IHNldCB1cCB0aGUgc3RhdGVzXG4gICAgJHN0YXRlUHJvdmlkZXJcbiAgICAgICAgLnN0YXRlKCdob21lJywge1xuICAgICAgICAgICAgdXJsOiBcIi9cIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAndmlld3MvaG9tZS5odG1sJyxcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4vY29udHJvbGxlcnMvbWFpbicpXG4gICAgICAgIH0pXG4gICAgICAgIC5zdGF0ZSgncG9zdHMnLCB7XG4gICAgICAgICAgICB1cmw6IFwiL3Bvc3RzXCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9wb3N0cy5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL3Bvc3RzJylcbiAgICAgICAgfSlcbiAgICAgICAgLnN0YXRlKCdwb3N0cy5saXN0Jywge1xuICAgICAgICAgICAgdXJsOiBcIi9wb3N0cy9saXN0XCIsXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogXCJ2aWV3cy9wb3N0cy1saXN0Lmh0bWxcIixcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6IHJlcXVpcmUoJy4vY29udHJvbGxlcnMvcG9zdHMnKVxuICAgICAgICB9KVxuICAgICAgICAuc3RhdGUoJ3Bvc3RzLmRldGFpbHMnLCB7XG4gICAgICAgICAgICB1cmw6IFwiL3Bvc3RzLzpwb3N0SWRcIixcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiBcInZpZXdzL3Bvc3QtZm9ybS5odG1sXCIsXG4gICAgICAgICAgICBjb250cm9sbGVyOiByZXF1aXJlKCcuL2NvbnRyb2xsZXJzL3Bvc3QnKVxuICAgICAgICB9KTtcbn0pO1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIkRGMXVyeFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiL2Zha2VfZmExYjQwLmpzXCIsXCIvXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLyoqXG4gKiBTdGF0ZS1iYXNlZCByb3V0aW5nIGZvciBBbmd1bGFySlNcbiAqIEB2ZXJzaW9uIHYwLjIuMTBcbiAqIEBsaW5rIGh0dHA6Ly9hbmd1bGFyLXVpLmdpdGh1Yi5jb20vXG4gKiBAbGljZW5zZSBNSVQgTGljZW5zZSwgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9NSVRcbiAqL1xuXG4vKiBjb21tb25qcyBwYWNrYWdlIG1hbmFnZXIgc3VwcG9ydCAoZWcgY29tcG9uZW50anMpICovXG5pZiAodHlwZW9mIG1vZHVsZSAhPT0gXCJ1bmRlZmluZWRcIiAmJiB0eXBlb2YgZXhwb3J0cyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBtb2R1bGUuZXhwb3J0cyA9PT0gZXhwb3J0cyl7XG4gIG1vZHVsZS5leHBvcnRzID0gJ3VpLnJvdXRlcic7XG59XG5cbihmdW5jdGlvbiAod2luZG93LCBhbmd1bGFyLCB1bmRlZmluZWQpIHtcbi8qanNoaW50IGdsb2JhbHN0cmljdDp0cnVlKi9cbi8qZ2xvYmFsIGFuZ3VsYXI6ZmFsc2UqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgaXNEZWZpbmVkID0gYW5ndWxhci5pc0RlZmluZWQsXG4gICAgaXNGdW5jdGlvbiA9IGFuZ3VsYXIuaXNGdW5jdGlvbixcbiAgICBpc1N0cmluZyA9IGFuZ3VsYXIuaXNTdHJpbmcsXG4gICAgaXNPYmplY3QgPSBhbmd1bGFyLmlzT2JqZWN0LFxuICAgIGlzQXJyYXkgPSBhbmd1bGFyLmlzQXJyYXksXG4gICAgZm9yRWFjaCA9IGFuZ3VsYXIuZm9yRWFjaCxcbiAgICBleHRlbmQgPSBhbmd1bGFyLmV4dGVuZCxcbiAgICBjb3B5ID0gYW5ndWxhci5jb3B5O1xuXG5mdW5jdGlvbiBpbmhlcml0KHBhcmVudCwgZXh0cmEpIHtcbiAgcmV0dXJuIGV4dGVuZChuZXcgKGV4dGVuZChmdW5jdGlvbigpIHt9LCB7IHByb3RvdHlwZTogcGFyZW50IH0pKSgpLCBleHRyYSk7XG59XG5cbmZ1bmN0aW9uIG1lcmdlKGRzdCkge1xuICBmb3JFYWNoKGFyZ3VtZW50cywgZnVuY3Rpb24ob2JqKSB7XG4gICAgaWYgKG9iaiAhPT0gZHN0KSB7XG4gICAgICBmb3JFYWNoKG9iaiwgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICBpZiAoIWRzdC5oYXNPd25Qcm9wZXJ0eShrZXkpKSBkc3Rba2V5XSA9IHZhbHVlO1xuICAgICAgfSk7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIGRzdDtcbn1cblxuLyoqXG4gKiBGaW5kcyB0aGUgY29tbW9uIGFuY2VzdG9yIHBhdGggYmV0d2VlbiB0d28gc3RhdGVzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBmaXJzdCBUaGUgZmlyc3Qgc3RhdGUuXG4gKiBAcGFyYW0ge09iamVjdH0gc2Vjb25kIFRoZSBzZWNvbmQgc3RhdGUuXG4gKiBAcmV0dXJuIHtBcnJheX0gUmV0dXJucyBhbiBhcnJheSBvZiBzdGF0ZSBuYW1lcyBpbiBkZXNjZW5kaW5nIG9yZGVyLCBub3QgaW5jbHVkaW5nIHRoZSByb290LlxuICovXG5mdW5jdGlvbiBhbmNlc3RvcnMoZmlyc3QsIHNlY29uZCkge1xuICB2YXIgcGF0aCA9IFtdO1xuXG4gIGZvciAodmFyIG4gaW4gZmlyc3QucGF0aCkge1xuICAgIGlmIChmaXJzdC5wYXRoW25dICE9PSBzZWNvbmQucGF0aFtuXSkgYnJlYWs7XG4gICAgcGF0aC5wdXNoKGZpcnN0LnBhdGhbbl0pO1xuICB9XG4gIHJldHVybiBwYXRoO1xufVxuXG4vKipcbiAqIElFOC1zYWZlIHdyYXBwZXIgZm9yIGBPYmplY3Qua2V5cygpYC5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0IEEgSmF2YVNjcmlwdCBvYmplY3QuXG4gKiBAcmV0dXJuIHtBcnJheX0gUmV0dXJucyB0aGUga2V5cyBvZiB0aGUgb2JqZWN0IGFzIGFuIGFycmF5LlxuICovXG5mdW5jdGlvbiBrZXlzKG9iamVjdCkge1xuICBpZiAoT2JqZWN0LmtleXMpIHtcbiAgICByZXR1cm4gT2JqZWN0LmtleXMob2JqZWN0KTtcbiAgfVxuICB2YXIgcmVzdWx0ID0gW107XG5cbiAgYW5ndWxhci5mb3JFYWNoKG9iamVjdCwgZnVuY3Rpb24odmFsLCBrZXkpIHtcbiAgICByZXN1bHQucHVzaChrZXkpO1xuICB9KTtcbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuLyoqXG4gKiBJRTgtc2FmZSB3cmFwcGVyIGZvciBgQXJyYXkucHJvdG90eXBlLmluZGV4T2YoKWAuXG4gKlxuICogQHBhcmFtIHtBcnJheX0gYXJyYXkgQSBKYXZhU2NyaXB0IGFycmF5LlxuICogQHBhcmFtIHsqfSB2YWx1ZSBBIHZhbHVlIHRvIHNlYXJjaCB0aGUgYXJyYXkgZm9yLlxuICogQHJldHVybiB7TnVtYmVyfSBSZXR1cm5zIHRoZSBhcnJheSBpbmRleCB2YWx1ZSBvZiBgdmFsdWVgLCBvciBgLTFgIGlmIG5vdCBwcmVzZW50LlxuICovXG5mdW5jdGlvbiBhcnJheVNlYXJjaChhcnJheSwgdmFsdWUpIHtcbiAgaWYgKEFycmF5LnByb3RvdHlwZS5pbmRleE9mKSB7XG4gICAgcmV0dXJuIGFycmF5LmluZGV4T2YodmFsdWUsIE51bWJlcihhcmd1bWVudHNbMl0pIHx8IDApO1xuICB9XG4gIHZhciBsZW4gPSBhcnJheS5sZW5ndGggPj4+IDAsIGZyb20gPSBOdW1iZXIoYXJndW1lbnRzWzJdKSB8fCAwO1xuICBmcm9tID0gKGZyb20gPCAwKSA/IE1hdGguY2VpbChmcm9tKSA6IE1hdGguZmxvb3IoZnJvbSk7XG5cbiAgaWYgKGZyb20gPCAwKSBmcm9tICs9IGxlbjtcblxuICBmb3IgKDsgZnJvbSA8IGxlbjsgZnJvbSsrKSB7XG4gICAgaWYgKGZyb20gaW4gYXJyYXkgJiYgYXJyYXlbZnJvbV0gPT09IHZhbHVlKSByZXR1cm4gZnJvbTtcbiAgfVxuICByZXR1cm4gLTE7XG59XG5cbi8qKlxuICogTWVyZ2VzIGEgc2V0IG9mIHBhcmFtZXRlcnMgd2l0aCBhbGwgcGFyYW1ldGVycyBpbmhlcml0ZWQgYmV0d2VlbiB0aGUgY29tbW9uIHBhcmVudHMgb2YgdGhlXG4gKiBjdXJyZW50IHN0YXRlIGFuZCBhIGdpdmVuIGRlc3RpbmF0aW9uIHN0YXRlLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBjdXJyZW50UGFyYW1zIFRoZSB2YWx1ZSBvZiB0aGUgY3VycmVudCBzdGF0ZSBwYXJhbWV0ZXJzICgkc3RhdGVQYXJhbXMpLlxuICogQHBhcmFtIHtPYmplY3R9IG5ld1BhcmFtcyBUaGUgc2V0IG9mIHBhcmFtZXRlcnMgd2hpY2ggd2lsbCBiZSBjb21wb3NpdGVkIHdpdGggaW5oZXJpdGVkIHBhcmFtcy5cbiAqIEBwYXJhbSB7T2JqZWN0fSAkY3VycmVudCBJbnRlcm5hbCBkZWZpbml0aW9uIG9mIG9iamVjdCByZXByZXNlbnRpbmcgdGhlIGN1cnJlbnQgc3RhdGUuXG4gKiBAcGFyYW0ge09iamVjdH0gJHRvIEludGVybmFsIGRlZmluaXRpb24gb2Ygb2JqZWN0IHJlcHJlc2VudGluZyBzdGF0ZSB0byB0cmFuc2l0aW9uIHRvLlxuICovXG5mdW5jdGlvbiBpbmhlcml0UGFyYW1zKGN1cnJlbnRQYXJhbXMsIG5ld1BhcmFtcywgJGN1cnJlbnQsICR0bykge1xuICB2YXIgcGFyZW50cyA9IGFuY2VzdG9ycygkY3VycmVudCwgJHRvKSwgcGFyZW50UGFyYW1zLCBpbmhlcml0ZWQgPSB7fSwgaW5oZXJpdExpc3QgPSBbXTtcblxuICBmb3IgKHZhciBpIGluIHBhcmVudHMpIHtcbiAgICBpZiAoIXBhcmVudHNbaV0ucGFyYW1zIHx8ICFwYXJlbnRzW2ldLnBhcmFtcy5sZW5ndGgpIGNvbnRpbnVlO1xuICAgIHBhcmVudFBhcmFtcyA9IHBhcmVudHNbaV0ucGFyYW1zO1xuXG4gICAgZm9yICh2YXIgaiBpbiBwYXJlbnRQYXJhbXMpIHtcbiAgICAgIGlmIChhcnJheVNlYXJjaChpbmhlcml0TGlzdCwgcGFyZW50UGFyYW1zW2pdKSA+PSAwKSBjb250aW51ZTtcbiAgICAgIGluaGVyaXRMaXN0LnB1c2gocGFyZW50UGFyYW1zW2pdKTtcbiAgICAgIGluaGVyaXRlZFtwYXJlbnRQYXJhbXNbal1dID0gY3VycmVudFBhcmFtc1twYXJlbnRQYXJhbXNbal1dO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZXh0ZW5kKHt9LCBpbmhlcml0ZWQsIG5ld1BhcmFtcyk7XG59XG5cbi8qKlxuICogTm9ybWFsaXplcyBhIHNldCBvZiB2YWx1ZXMgdG8gc3RyaW5nIG9yIGBudWxsYCwgZmlsdGVyaW5nIHRoZW0gYnkgYSBsaXN0IG9mIGtleXMuXG4gKlxuICogQHBhcmFtIHtBcnJheX0ga2V5cyBUaGUgbGlzdCBvZiBrZXlzIHRvIG5vcm1hbGl6ZS9yZXR1cm4uXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsdWVzIEFuIG9iamVjdCBoYXNoIG9mIHZhbHVlcyB0byBub3JtYWxpemUuXG4gKiBAcmV0dXJuIHtPYmplY3R9IFJldHVybnMgYW4gb2JqZWN0IGhhc2ggb2Ygbm9ybWFsaXplZCBzdHJpbmcgdmFsdWVzLlxuICovXG5mdW5jdGlvbiBub3JtYWxpemUoa2V5cywgdmFsdWVzKSB7XG4gIHZhciBub3JtYWxpemVkID0ge307XG5cbiAgZm9yRWFjaChrZXlzLCBmdW5jdGlvbiAobmFtZSkge1xuICAgIHZhciB2YWx1ZSA9IHZhbHVlc1tuYW1lXTtcbiAgICBub3JtYWxpemVkW25hbWVdID0gKHZhbHVlICE9IG51bGwpID8gU3RyaW5nKHZhbHVlKSA6IG51bGw7XG4gIH0pO1xuICByZXR1cm4gbm9ybWFsaXplZDtcbn1cblxuLyoqXG4gKiBQZXJmb3JtcyBhIG5vbi1zdHJpY3QgY29tcGFyaXNvbiBvZiB0aGUgc3Vic2V0IG9mIHR3byBvYmplY3RzLCBkZWZpbmVkIGJ5IGEgbGlzdCBvZiBrZXlzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhIFRoZSBmaXJzdCBvYmplY3QuXG4gKiBAcGFyYW0ge09iamVjdH0gYiBUaGUgc2Vjb25kIG9iamVjdC5cbiAqIEBwYXJhbSB7QXJyYXl9IGtleXMgVGhlIGxpc3Qgb2Yga2V5cyB3aXRoaW4gZWFjaCBvYmplY3QgdG8gY29tcGFyZS4gSWYgdGhlIGxpc3QgaXMgZW1wdHkgb3Igbm90IHNwZWNpZmllZCxcbiAqICAgICAgICAgICAgICAgICAgICAgaXQgZGVmYXVsdHMgdG8gdGhlIGxpc3Qgb2Yga2V5cyBpbiBgYWAuXG4gKiBAcmV0dXJuIHtCb29sZWFufSBSZXR1cm5zIGB0cnVlYCBpZiB0aGUga2V5cyBtYXRjaCwgb3RoZXJ3aXNlIGBmYWxzZWAuXG4gKi9cbmZ1bmN0aW9uIGVxdWFsRm9yS2V5cyhhLCBiLCBrZXlzKSB7XG4gIGlmICgha2V5cykge1xuICAgIGtleXMgPSBbXTtcbiAgICBmb3IgKHZhciBuIGluIGEpIGtleXMucHVzaChuKTsgLy8gVXNlZCBpbnN0ZWFkIG9mIE9iamVjdC5rZXlzKCkgZm9yIElFOCBjb21wYXRpYmlsaXR5XG4gIH1cblxuICBmb3IgKHZhciBpPTA7IGk8a2V5cy5sZW5ndGg7IGkrKykge1xuICAgIHZhciBrID0ga2V5c1tpXTtcbiAgICBpZiAoYVtrXSAhPSBiW2tdKSByZXR1cm4gZmFsc2U7IC8vIE5vdCAnPT09JywgdmFsdWVzIGFyZW4ndCBuZWNlc3NhcmlseSBub3JtYWxpemVkXG4gIH1cbiAgcmV0dXJuIHRydWU7XG59XG5cbi8qKlxuICogUmV0dXJucyB0aGUgc3Vic2V0IG9mIGFuIG9iamVjdCwgYmFzZWQgb24gYSBsaXN0IG9mIGtleXMuXG4gKlxuICogQHBhcmFtIHtBcnJheX0ga2V5c1xuICogQHBhcmFtIHtPYmplY3R9IHZhbHVlc1xuICogQHJldHVybiB7Qm9vbGVhbn0gUmV0dXJucyBhIHN1YnNldCBvZiBgdmFsdWVzYC5cbiAqL1xuZnVuY3Rpb24gZmlsdGVyQnlLZXlzKGtleXMsIHZhbHVlcykge1xuICB2YXIgZmlsdGVyZWQgPSB7fTtcblxuICBmb3JFYWNoKGtleXMsIGZ1bmN0aW9uIChuYW1lKSB7XG4gICAgZmlsdGVyZWRbbmFtZV0gPSB2YWx1ZXNbbmFtZV07XG4gIH0pO1xuICByZXR1cm4gZmlsdGVyZWQ7XG59XG4vKipcbiAqIEBuZ2RvYyBvdmVydmlld1xuICogQG5hbWUgdWkucm91dGVyLnV0aWxcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqICMgdWkucm91dGVyLnV0aWwgc3ViLW1vZHVsZVxuICpcbiAqIFRoaXMgbW9kdWxlIGlzIGEgZGVwZW5kZW5jeSBvZiBvdGhlciBzdWItbW9kdWxlcy4gRG8gbm90IGluY2x1ZGUgdGhpcyBtb2R1bGUgYXMgYSBkZXBlbmRlbmN5XG4gKiBpbiB5b3VyIGFuZ3VsYXIgYXBwICh1c2Uge0BsaW5rIHVpLnJvdXRlcn0gbW9kdWxlIGluc3RlYWQpLlxuICpcbiAqL1xuYW5ndWxhci5tb2R1bGUoJ3VpLnJvdXRlci51dGlsJywgWyduZyddKTtcblxuLyoqXG4gKiBAbmdkb2Mgb3ZlcnZpZXdcbiAqIEBuYW1lIHVpLnJvdXRlci5yb3V0ZXJcbiAqIFxuICogQHJlcXVpcmVzIHVpLnJvdXRlci51dGlsXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiAjIHVpLnJvdXRlci5yb3V0ZXIgc3ViLW1vZHVsZVxuICpcbiAqIFRoaXMgbW9kdWxlIGlzIGEgZGVwZW5kZW5jeSBvZiBvdGhlciBzdWItbW9kdWxlcy4gRG8gbm90IGluY2x1ZGUgdGhpcyBtb2R1bGUgYXMgYSBkZXBlbmRlbmN5XG4gKiBpbiB5b3VyIGFuZ3VsYXIgYXBwICh1c2Uge0BsaW5rIHVpLnJvdXRlcn0gbW9kdWxlIGluc3RlYWQpLlxuICovXG5hbmd1bGFyLm1vZHVsZSgndWkucm91dGVyLnJvdXRlcicsIFsndWkucm91dGVyLnV0aWwnXSk7XG5cbi8qKlxuICogQG5nZG9jIG92ZXJ2aWV3XG4gKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGVcbiAqIFxuICogQHJlcXVpcmVzIHVpLnJvdXRlci5yb3V0ZXJcbiAqIEByZXF1aXJlcyB1aS5yb3V0ZXIudXRpbFxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogIyB1aS5yb3V0ZXIuc3RhdGUgc3ViLW1vZHVsZVxuICpcbiAqIFRoaXMgbW9kdWxlIGlzIGEgZGVwZW5kZW5jeSBvZiB0aGUgbWFpbiB1aS5yb3V0ZXIgbW9kdWxlLiBEbyBub3QgaW5jbHVkZSB0aGlzIG1vZHVsZSBhcyBhIGRlcGVuZGVuY3lcbiAqIGluIHlvdXIgYW5ndWxhciBhcHAgKHVzZSB7QGxpbmsgdWkucm91dGVyfSBtb2R1bGUgaW5zdGVhZCkuXG4gKiBcbiAqL1xuYW5ndWxhci5tb2R1bGUoJ3VpLnJvdXRlci5zdGF0ZScsIFsndWkucm91dGVyLnJvdXRlcicsICd1aS5yb3V0ZXIudXRpbCddKTtcblxuLyoqXG4gKiBAbmdkb2Mgb3ZlcnZpZXdcbiAqIEBuYW1lIHVpLnJvdXRlclxuICpcbiAqIEByZXF1aXJlcyB1aS5yb3V0ZXIuc3RhdGVcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqICMgdWkucm91dGVyXG4gKiBcbiAqICMjIFRoZSBtYWluIG1vZHVsZSBmb3IgdWkucm91dGVyIFxuICogVGhlcmUgYXJlIHNldmVyYWwgc3ViLW1vZHVsZXMgaW5jbHVkZWQgd2l0aCB0aGUgdWkucm91dGVyIG1vZHVsZSwgaG93ZXZlciBvbmx5IHRoaXMgbW9kdWxlIGlzIG5lZWRlZFxuICogYXMgYSBkZXBlbmRlbmN5IHdpdGhpbiB5b3VyIGFuZ3VsYXIgYXBwLiBUaGUgb3RoZXIgbW9kdWxlcyBhcmUgZm9yIG9yZ2FuaXphdGlvbiBwdXJwb3Nlcy4gXG4gKlxuICogVGhlIG1vZHVsZXMgYXJlOlxuICogKiB1aS5yb3V0ZXIgLSB0aGUgbWFpbiBcInVtYnJlbGxhXCIgbW9kdWxlXG4gKiAqIHVpLnJvdXRlci5yb3V0ZXIgLSBcbiAqIFxuICogKllvdSdsbCBuZWVkIHRvIGluY2x1ZGUgKipvbmx5KiogdGhpcyBtb2R1bGUgYXMgdGhlIGRlcGVuZGVuY3kgd2l0aGluIHlvdXIgYW5ndWxhciBhcHAuKlxuICogXG4gKiA8cHJlPlxuICogPCFkb2N0eXBlIGh0bWw+XG4gKiA8aHRtbCBuZy1hcHA9XCJteUFwcFwiPlxuICogPGhlYWQ+XG4gKiAgIDxzY3JpcHQgc3JjPVwianMvYW5ndWxhci5qc1wiPjwvc2NyaXB0PlxuICogICA8IS0tIEluY2x1ZGUgdGhlIHVpLXJvdXRlciBzY3JpcHQgLS0+XG4gKiAgIDxzY3JpcHQgc3JjPVwianMvYW5ndWxhci11aS1yb3V0ZXIubWluLmpzXCI+PC9zY3JpcHQ+XG4gKiAgIDxzY3JpcHQ+XG4gKiAgICAgLy8gLi4uYW5kIGFkZCAndWkucm91dGVyJyBhcyBhIGRlcGVuZGVuY3lcbiAqICAgICB2YXIgbXlBcHAgPSBhbmd1bGFyLm1vZHVsZSgnbXlBcHAnLCBbJ3VpLnJvdXRlciddKTtcbiAqICAgPC9zY3JpcHQ+XG4gKiA8L2hlYWQ+XG4gKiA8Ym9keT5cbiAqIDwvYm9keT5cbiAqIDwvaHRtbD5cbiAqIDwvcHJlPlxuICovXG5hbmd1bGFyLm1vZHVsZSgndWkucm91dGVyJywgWyd1aS5yb3V0ZXIuc3RhdGUnXSk7XG5cbmFuZ3VsYXIubW9kdWxlKCd1aS5yb3V0ZXIuY29tcGF0JywgWyd1aS5yb3V0ZXInXSk7XG5cbi8qKlxuICogQG5nZG9jIG9iamVjdFxuICogQG5hbWUgdWkucm91dGVyLnV0aWwuJHJlc29sdmVcbiAqXG4gKiBAcmVxdWlyZXMgJHFcbiAqIEByZXF1aXJlcyAkaW5qZWN0b3JcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIE1hbmFnZXMgcmVzb2x1dGlvbiBvZiAoYWN5Y2xpYykgZ3JhcGhzIG9mIHByb21pc2VzLlxuICovXG4kUmVzb2x2ZS4kaW5qZWN0ID0gWyckcScsICckaW5qZWN0b3InXTtcbmZ1bmN0aW9uICRSZXNvbHZlKCAgJHEsICAgICRpbmplY3Rvcikge1xuICBcbiAgdmFyIFZJU0lUX0lOX1BST0dSRVNTID0gMSxcbiAgICAgIFZJU0lUX0RPTkUgPSAyLFxuICAgICAgTk9USElORyA9IHt9LFxuICAgICAgTk9fREVQRU5ERU5DSUVTID0gW10sXG4gICAgICBOT19MT0NBTFMgPSBOT1RISU5HLFxuICAgICAgTk9fUEFSRU5UID0gZXh0ZW5kKCRxLndoZW4oTk9USElORyksIHsgJCRwcm9taXNlczogTk9USElORywgJCR2YWx1ZXM6IE5PVEhJTkcgfSk7XG4gIFxuXG4gIC8qKlxuICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICogQG5hbWUgdWkucm91dGVyLnV0aWwuJHJlc29sdmUjc3R1ZHlcbiAgICogQG1ldGhvZE9mIHVpLnJvdXRlci51dGlsLiRyZXNvbHZlXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBTdHVkaWVzIGEgc2V0IG9mIGludm9jYWJsZXMgdGhhdCBhcmUgbGlrZWx5IHRvIGJlIHVzZWQgbXVsdGlwbGUgdGltZXMuXG4gICAqIDxwcmU+XG4gICAqICRyZXNvbHZlLnN0dWR5KGludm9jYWJsZXMpKGxvY2FscywgcGFyZW50LCBzZWxmKVxuICAgKiA8L3ByZT5cbiAgICogaXMgZXF1aXZhbGVudCB0b1xuICAgKiA8cHJlPlxuICAgKiAkcmVzb2x2ZS5yZXNvbHZlKGludm9jYWJsZXMsIGxvY2FscywgcGFyZW50LCBzZWxmKVxuICAgKiA8L3ByZT5cbiAgICogYnV0IHRoZSBmb3JtZXIgaXMgbW9yZSBlZmZpY2llbnQgKGluIGZhY3QgYHJlc29sdmVgIGp1c3QgY2FsbHMgYHN0dWR5YCBcbiAgICogaW50ZXJuYWxseSkuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBpbnZvY2FibGVzIEludm9jYWJsZSBvYmplY3RzXG4gICAqIEByZXR1cm4ge2Z1bmN0aW9ufSBhIGZ1bmN0aW9uIHRvIHBhc3MgaW4gbG9jYWxzLCBwYXJlbnQgYW5kIHNlbGZcbiAgICovXG4gIHRoaXMuc3R1ZHkgPSBmdW5jdGlvbiAoaW52b2NhYmxlcykge1xuICAgIGlmICghaXNPYmplY3QoaW52b2NhYmxlcykpIHRocm93IG5ldyBFcnJvcihcIidpbnZvY2FibGVzJyBtdXN0IGJlIGFuIG9iamVjdFwiKTtcbiAgICBcbiAgICAvLyBQZXJmb3JtIGEgdG9wb2xvZ2ljYWwgc29ydCBvZiBpbnZvY2FibGVzIHRvIGJ1aWxkIGFuIG9yZGVyZWQgcGxhblxuICAgIHZhciBwbGFuID0gW10sIGN5Y2xlID0gW10sIHZpc2l0ZWQgPSB7fTtcbiAgICBmdW5jdGlvbiB2aXNpdCh2YWx1ZSwga2V5KSB7XG4gICAgICBpZiAodmlzaXRlZFtrZXldID09PSBWSVNJVF9ET05FKSByZXR1cm47XG4gICAgICBcbiAgICAgIGN5Y2xlLnB1c2goa2V5KTtcbiAgICAgIGlmICh2aXNpdGVkW2tleV0gPT09IFZJU0lUX0lOX1BST0dSRVNTKSB7XG4gICAgICAgIGN5Y2xlLnNwbGljZSgwLCBjeWNsZS5pbmRleE9mKGtleSkpO1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJDeWNsaWMgZGVwZW5kZW5jeTogXCIgKyBjeWNsZS5qb2luKFwiIC0+IFwiKSk7XG4gICAgICB9XG4gICAgICB2aXNpdGVkW2tleV0gPSBWSVNJVF9JTl9QUk9HUkVTUztcbiAgICAgIFxuICAgICAgaWYgKGlzU3RyaW5nKHZhbHVlKSkge1xuICAgICAgICBwbGFuLnB1c2goa2V5LCBbIGZ1bmN0aW9uKCkgeyByZXR1cm4gJGluamVjdG9yLmdldCh2YWx1ZSk7IH1dLCBOT19ERVBFTkRFTkNJRVMpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHBhcmFtcyA9ICRpbmplY3Rvci5hbm5vdGF0ZSh2YWx1ZSk7XG4gICAgICAgIGZvckVhY2gocGFyYW1zLCBmdW5jdGlvbiAocGFyYW0pIHtcbiAgICAgICAgICBpZiAocGFyYW0gIT09IGtleSAmJiBpbnZvY2FibGVzLmhhc093blByb3BlcnR5KHBhcmFtKSkgdmlzaXQoaW52b2NhYmxlc1twYXJhbV0sIHBhcmFtKTtcbiAgICAgICAgfSk7XG4gICAgICAgIHBsYW4ucHVzaChrZXksIHZhbHVlLCBwYXJhbXMpO1xuICAgICAgfVxuICAgICAgXG4gICAgICBjeWNsZS5wb3AoKTtcbiAgICAgIHZpc2l0ZWRba2V5XSA9IFZJU0lUX0RPTkU7XG4gICAgfVxuICAgIGZvckVhY2goaW52b2NhYmxlcywgdmlzaXQpO1xuICAgIGludm9jYWJsZXMgPSBjeWNsZSA9IHZpc2l0ZWQgPSBudWxsOyAvLyBwbGFuIGlzIGFsbCB0aGF0J3MgcmVxdWlyZWRcbiAgICBcbiAgICBmdW5jdGlvbiBpc1Jlc29sdmUodmFsdWUpIHtcbiAgICAgIHJldHVybiBpc09iamVjdCh2YWx1ZSkgJiYgdmFsdWUudGhlbiAmJiB2YWx1ZS4kJHByb21pc2VzO1xuICAgIH1cbiAgICBcbiAgICByZXR1cm4gZnVuY3Rpb24gKGxvY2FscywgcGFyZW50LCBzZWxmKSB7XG4gICAgICBpZiAoaXNSZXNvbHZlKGxvY2FscykgJiYgc2VsZiA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHNlbGYgPSBwYXJlbnQ7IHBhcmVudCA9IGxvY2FsczsgbG9jYWxzID0gbnVsbDtcbiAgICAgIH1cbiAgICAgIGlmICghbG9jYWxzKSBsb2NhbHMgPSBOT19MT0NBTFM7XG4gICAgICBlbHNlIGlmICghaXNPYmplY3QobG9jYWxzKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCInbG9jYWxzJyBtdXN0IGJlIGFuIG9iamVjdFwiKTtcbiAgICAgIH0gICAgICAgXG4gICAgICBpZiAoIXBhcmVudCkgcGFyZW50ID0gTk9fUEFSRU5UO1xuICAgICAgZWxzZSBpZiAoIWlzUmVzb2x2ZShwYXJlbnQpKSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIidwYXJlbnQnIG11c3QgYmUgYSBwcm9taXNlIHJldHVybmVkIGJ5ICRyZXNvbHZlLnJlc29sdmUoKVwiKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gVG8gY29tcGxldGUgdGhlIG92ZXJhbGwgcmVzb2x1dGlvbiwgd2UgaGF2ZSB0byB3YWl0IGZvciB0aGUgcGFyZW50XG4gICAgICAvLyBwcm9taXNlIGFuZCBmb3IgdGhlIHByb21pc2UgZm9yIGVhY2ggaW52b2thYmxlIGluIG91ciBwbGFuLlxuICAgICAgdmFyIHJlc29sdXRpb24gPSAkcS5kZWZlcigpLFxuICAgICAgICAgIHJlc3VsdCA9IHJlc29sdXRpb24ucHJvbWlzZSxcbiAgICAgICAgICBwcm9taXNlcyA9IHJlc3VsdC4kJHByb21pc2VzID0ge30sXG4gICAgICAgICAgdmFsdWVzID0gZXh0ZW5kKHt9LCBsb2NhbHMpLFxuICAgICAgICAgIHdhaXQgPSAxICsgcGxhbi5sZW5ndGgvMyxcbiAgICAgICAgICBtZXJnZWQgPSBmYWxzZTtcbiAgICAgICAgICBcbiAgICAgIGZ1bmN0aW9uIGRvbmUoKSB7XG4gICAgICAgIC8vIE1lcmdlIHBhcmVudCB2YWx1ZXMgd2UgaGF2ZW4ndCBnb3QgeWV0IGFuZCBwdWJsaXNoIG91ciBvd24gJCR2YWx1ZXNcbiAgICAgICAgaWYgKCEtLXdhaXQpIHtcbiAgICAgICAgICBpZiAoIW1lcmdlZCkgbWVyZ2UodmFsdWVzLCBwYXJlbnQuJCR2YWx1ZXMpOyBcbiAgICAgICAgICByZXN1bHQuJCR2YWx1ZXMgPSB2YWx1ZXM7XG4gICAgICAgICAgcmVzdWx0LiQkcHJvbWlzZXMgPSB0cnVlOyAvLyBrZWVwIGZvciBpc1Jlc29sdmUoKVxuICAgICAgICAgIHJlc29sdXRpb24ucmVzb2x2ZSh2YWx1ZXMpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIGZhaWwocmVhc29uKSB7XG4gICAgICAgIHJlc3VsdC4kJGZhaWx1cmUgPSByZWFzb247XG4gICAgICAgIHJlc29sdXRpb24ucmVqZWN0KHJlYXNvbik7XG4gICAgICB9XG4gICAgICBcbiAgICAgIC8vIFNob3J0LWNpcmN1aXQgaWYgcGFyZW50IGhhcyBhbHJlYWR5IGZhaWxlZFxuICAgICAgaWYgKGlzRGVmaW5lZChwYXJlbnQuJCRmYWlsdXJlKSkge1xuICAgICAgICBmYWlsKHBhcmVudC4kJGZhaWx1cmUpO1xuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgICAgfVxuICAgICAgXG4gICAgICAvLyBNZXJnZSBwYXJlbnQgdmFsdWVzIGlmIHRoZSBwYXJlbnQgaGFzIGFscmVhZHkgcmVzb2x2ZWQsIG9yIG1lcmdlXG4gICAgICAvLyBwYXJlbnQgcHJvbWlzZXMgYW5kIHdhaXQgaWYgdGhlIHBhcmVudCByZXNvbHZlIGlzIHN0aWxsIGluIHByb2dyZXNzLlxuICAgICAgaWYgKHBhcmVudC4kJHZhbHVlcykge1xuICAgICAgICBtZXJnZWQgPSBtZXJnZSh2YWx1ZXMsIHBhcmVudC4kJHZhbHVlcyk7XG4gICAgICAgIGRvbmUoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGV4dGVuZChwcm9taXNlcywgcGFyZW50LiQkcHJvbWlzZXMpO1xuICAgICAgICBwYXJlbnQudGhlbihkb25lLCBmYWlsKTtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgLy8gUHJvY2VzcyBlYWNoIGludm9jYWJsZSBpbiB0aGUgcGxhbiwgYnV0IGlnbm9yZSBhbnkgd2hlcmUgYSBsb2NhbCBvZiB0aGUgc2FtZSBuYW1lIGV4aXN0cy5cbiAgICAgIGZvciAodmFyIGk9MCwgaWk9cGxhbi5sZW5ndGg7IGk8aWk7IGkrPTMpIHtcbiAgICAgICAgaWYgKGxvY2Fscy5oYXNPd25Qcm9wZXJ0eShwbGFuW2ldKSkgZG9uZSgpO1xuICAgICAgICBlbHNlIGludm9rZShwbGFuW2ldLCBwbGFuW2krMV0sIHBsYW5baSsyXSk7XG4gICAgICB9XG4gICAgICBcbiAgICAgIGZ1bmN0aW9uIGludm9rZShrZXksIGludm9jYWJsZSwgcGFyYW1zKSB7XG4gICAgICAgIC8vIENyZWF0ZSBhIGRlZmVycmVkIGZvciB0aGlzIGludm9jYXRpb24uIEZhaWx1cmVzIHdpbGwgcHJvcGFnYXRlIHRvIHRoZSByZXNvbHV0aW9uIGFzIHdlbGwuXG4gICAgICAgIHZhciBpbnZvY2F0aW9uID0gJHEuZGVmZXIoKSwgd2FpdFBhcmFtcyA9IDA7XG4gICAgICAgIGZ1bmN0aW9uIG9uZmFpbHVyZShyZWFzb24pIHtcbiAgICAgICAgICBpbnZvY2F0aW9uLnJlamVjdChyZWFzb24pO1xuICAgICAgICAgIGZhaWwocmVhc29uKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBXYWl0IGZvciBhbnkgcGFyYW1ldGVyIHRoYXQgd2UgaGF2ZSBhIHByb21pc2UgZm9yIChlaXRoZXIgZnJvbSBwYXJlbnQgb3IgZnJvbSB0aGlzXG4gICAgICAgIC8vIHJlc29sdmU7IGluIHRoYXQgY2FzZSBzdHVkeSgpIHdpbGwgaGF2ZSBtYWRlIHN1cmUgaXQncyBvcmRlcmVkIGJlZm9yZSB1cyBpbiB0aGUgcGxhbikuXG4gICAgICAgIGZvckVhY2gocGFyYW1zLCBmdW5jdGlvbiAoZGVwKSB7XG4gICAgICAgICAgaWYgKHByb21pc2VzLmhhc093blByb3BlcnR5KGRlcCkgJiYgIWxvY2Fscy5oYXNPd25Qcm9wZXJ0eShkZXApKSB7XG4gICAgICAgICAgICB3YWl0UGFyYW1zKys7XG4gICAgICAgICAgICBwcm9taXNlc1tkZXBdLnRoZW4oZnVuY3Rpb24gKHJlc3VsdCkge1xuICAgICAgICAgICAgICB2YWx1ZXNbZGVwXSA9IHJlc3VsdDtcbiAgICAgICAgICAgICAgaWYgKCEoLS13YWl0UGFyYW1zKSkgcHJvY2VlZCgpO1xuICAgICAgICAgICAgfSwgb25mYWlsdXJlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAoIXdhaXRQYXJhbXMpIHByb2NlZWQoKTtcbiAgICAgICAgZnVuY3Rpb24gcHJvY2VlZCgpIHtcbiAgICAgICAgICBpZiAoaXNEZWZpbmVkKHJlc3VsdC4kJGZhaWx1cmUpKSByZXR1cm47XG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIGludm9jYXRpb24ucmVzb2x2ZSgkaW5qZWN0b3IuaW52b2tlKGludm9jYWJsZSwgc2VsZiwgdmFsdWVzKSk7XG4gICAgICAgICAgICBpbnZvY2F0aW9uLnByb21pc2UudGhlbihmdW5jdGlvbiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgIHZhbHVlc1trZXldID0gcmVzdWx0O1xuICAgICAgICAgICAgICBkb25lKCk7XG4gICAgICAgICAgICB9LCBvbmZhaWx1cmUpO1xuICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgIG9uZmFpbHVyZShlKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gUHVibGlzaCBwcm9taXNlIHN5bmNocm9ub3VzbHk7IGludm9jYXRpb25zIGZ1cnRoZXIgZG93biBpbiB0aGUgcGxhbiBtYXkgZGVwZW5kIG9uIGl0LlxuICAgICAgICBwcm9taXNlc1trZXldID0gaW52b2NhdGlvbi5wcm9taXNlO1xuICAgICAgfVxuICAgICAgXG4gICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gIH07XG4gIFxuICAvKipcbiAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAqIEBuYW1lIHVpLnJvdXRlci51dGlsLiRyZXNvbHZlI3Jlc29sdmVcbiAgICogQG1ldGhvZE9mIHVpLnJvdXRlci51dGlsLiRyZXNvbHZlXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZXNvbHZlcyBhIHNldCBvZiBpbnZvY2FibGVzLiBBbiBpbnZvY2FibGUgaXMgYSBmdW5jdGlvbiB0byBiZSBpbnZva2VkIHZpYSBcbiAgICogYCRpbmplY3Rvci5pbnZva2UoKWAsIGFuZCBjYW4gaGF2ZSBhbiBhcmJpdHJhcnkgbnVtYmVyIG9mIGRlcGVuZGVuY2llcy4gXG4gICAqIEFuIGludm9jYWJsZSBjYW4gZWl0aGVyIHJldHVybiBhIHZhbHVlIGRpcmVjdGx5LFxuICAgKiBvciBhIGAkcWAgcHJvbWlzZS4gSWYgYSBwcm9taXNlIGlzIHJldHVybmVkIGl0IHdpbGwgYmUgcmVzb2x2ZWQgYW5kIHRoZSBcbiAgICogcmVzdWx0aW5nIHZhbHVlIHdpbGwgYmUgdXNlZCBpbnN0ZWFkLiBEZXBlbmRlbmNpZXMgb2YgaW52b2NhYmxlcyBhcmUgcmVzb2x2ZWQgXG4gICAqIChpbiB0aGlzIG9yZGVyIG9mIHByZWNlZGVuY2UpXG4gICAqXG4gICAqIC0gZnJvbSB0aGUgc3BlY2lmaWVkIGBsb2NhbHNgXG4gICAqIC0gZnJvbSBhbm90aGVyIGludm9jYWJsZSB0aGF0IGlzIHBhcnQgb2YgdGhpcyBgJHJlc29sdmVgIGNhbGxcbiAgICogLSBmcm9tIGFuIGludm9jYWJsZSB0aGF0IGlzIGluaGVyaXRlZCBmcm9tIGEgYHBhcmVudGAgY2FsbCB0byBgJHJlc29sdmVgIFxuICAgKiAgIChvciByZWN1cnNpdmVseVxuICAgKiAtIGZyb20gYW55IGFuY2VzdG9yIGAkcmVzb2x2ZWAgb2YgdGhhdCBwYXJlbnQpLlxuICAgKlxuICAgKiBUaGUgcmV0dXJuIHZhbHVlIG9mIGAkcmVzb2x2ZWAgaXMgYSBwcm9taXNlIGZvciBhbiBvYmplY3QgdGhhdCBjb250YWlucyBcbiAgICogKGluIHRoaXMgb3JkZXIgb2YgcHJlY2VkZW5jZSlcbiAgICpcbiAgICogLSBhbnkgYGxvY2Fsc2AgKGlmIHNwZWNpZmllZClcbiAgICogLSB0aGUgcmVzb2x2ZWQgcmV0dXJuIHZhbHVlcyBvZiBhbGwgaW5qZWN0YWJsZXNcbiAgICogLSBhbnkgdmFsdWVzIGluaGVyaXRlZCBmcm9tIGEgYHBhcmVudGAgY2FsbCB0byBgJHJlc29sdmVgIChpZiBzcGVjaWZpZWQpXG4gICAqXG4gICAqIFRoZSBwcm9taXNlIHdpbGwgcmVzb2x2ZSBhZnRlciB0aGUgYHBhcmVudGAgcHJvbWlzZSAoaWYgYW55KSBhbmQgYWxsIHByb21pc2VzIFxuICAgKiByZXR1cm5lZCBieSBpbmplY3RhYmxlcyBoYXZlIGJlZW4gcmVzb2x2ZWQuIElmIGFueSBpbnZvY2FibGUgXG4gICAqIChvciBgJGluamVjdG9yLmludm9rZWApIHRocm93cyBhbiBleGNlcHRpb24sIG9yIGlmIGEgcHJvbWlzZSByZXR1cm5lZCBieSBhbiBcbiAgICogaW52b2NhYmxlIGlzIHJlamVjdGVkLCB0aGUgYCRyZXNvbHZlYCBwcm9taXNlIGlzIGltbWVkaWF0ZWx5IHJlamVjdGVkIHdpdGggdGhlIFxuICAgKiBzYW1lIGVycm9yLiBBIHJlamVjdGlvbiBvZiBhIGBwYXJlbnRgIHByb21pc2UgKGlmIHNwZWNpZmllZCkgd2lsbCBsaWtld2lzZSBiZSBcbiAgICogcHJvcGFnYXRlZCBpbW1lZGlhdGVseS4gT25jZSB0aGUgYCRyZXNvbHZlYCBwcm9taXNlIGhhcyBiZWVuIHJlamVjdGVkLCBubyBcbiAgICogZnVydGhlciBpbnZvY2FibGVzIHdpbGwgYmUgY2FsbGVkLlxuICAgKiBcbiAgICogQ3ljbGljIGRlcGVuZGVuY2llcyBiZXR3ZWVuIGludm9jYWJsZXMgYXJlIG5vdCBwZXJtaXR0ZWQgYW5kIHdpbGwgY2F1ZXMgYCRyZXNvbHZlYFxuICAgKiB0byB0aHJvdyBhbiBlcnJvci4gQXMgYSBzcGVjaWFsIGNhc2UsIGFuIGluamVjdGFibGUgY2FuIGRlcGVuZCBvbiBhIHBhcmFtZXRlciBcbiAgICogd2l0aCB0aGUgc2FtZSBuYW1lIGFzIHRoZSBpbmplY3RhYmxlLCB3aGljaCB3aWxsIGJlIGZ1bGZpbGxlZCBmcm9tIHRoZSBgcGFyZW50YCBcbiAgICogaW5qZWN0YWJsZSBvZiB0aGUgc2FtZSBuYW1lLiBUaGlzIGFsbG93cyBpbmhlcml0ZWQgdmFsdWVzIHRvIGJlIGRlY29yYXRlZC4gXG4gICAqIE5vdGUgdGhhdCBpbiB0aGlzIGNhc2UgYW55IG90aGVyIGluamVjdGFibGUgaW4gdGhlIHNhbWUgYCRyZXNvbHZlYCB3aXRoIHRoZSBzYW1lXG4gICAqIGRlcGVuZGVuY3kgd291bGQgc2VlIHRoZSBkZWNvcmF0ZWQgdmFsdWUsIG5vdCB0aGUgaW5oZXJpdGVkIHZhbHVlLlxuICAgKlxuICAgKiBOb3RlIHRoYXQgbWlzc2luZyBkZXBlbmRlbmNpZXMgLS0gdW5saWtlIGN5Y2xpYyBkZXBlbmRlbmNpZXMgLS0gd2lsbCBjYXVzZSBhbiBcbiAgICogKGFzeW5jaHJvbm91cykgcmVqZWN0aW9uIG9mIHRoZSBgJHJlc29sdmVgIHByb21pc2UgcmF0aGVyIHRoYW4gYSAoc3luY2hyb25vdXMpIFxuICAgKiBleGNlcHRpb24uXG4gICAqXG4gICAqIEludm9jYWJsZXMgYXJlIGludm9rZWQgZWFnZXJseSBhcyBzb29uIGFzIGFsbCBkZXBlbmRlbmNpZXMgYXJlIGF2YWlsYWJsZS4gXG4gICAqIFRoaXMgaXMgdHJ1ZSBldmVuIGZvciBkZXBlbmRlbmNpZXMgaW5oZXJpdGVkIGZyb20gYSBgcGFyZW50YCBjYWxsIHRvIGAkcmVzb2x2ZWAuXG4gICAqXG4gICAqIEFzIGEgc3BlY2lhbCBjYXNlLCBhbiBpbnZvY2FibGUgY2FuIGJlIGEgc3RyaW5nLCBpbiB3aGljaCBjYXNlIGl0IGlzIHRha2VuIHRvIFxuICAgKiBiZSBhIHNlcnZpY2UgbmFtZSB0byBiZSBwYXNzZWQgdG8gYCRpbmplY3Rvci5nZXQoKWAuIFRoaXMgaXMgc3VwcG9ydGVkIHByaW1hcmlseSBcbiAgICogZm9yIGJhY2t3YXJkcy1jb21wYXRpYmlsaXR5IHdpdGggdGhlIGByZXNvbHZlYCBwcm9wZXJ0eSBvZiBgJHJvdXRlUHJvdmlkZXJgIFxuICAgKiByb3V0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBpbnZvY2FibGVzIGZ1bmN0aW9ucyB0byBpbnZva2Ugb3IgXG4gICAqIGAkaW5qZWN0b3JgIHNlcnZpY2VzIHRvIGZldGNoLlxuICAgKiBAcGFyYW0ge29iamVjdH0gbG9jYWxzICB2YWx1ZXMgdG8gbWFrZSBhdmFpbGFibGUgdG8gdGhlIGluamVjdGFibGVzXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJlbnQgIGEgcHJvbWlzZSByZXR1cm5lZCBieSBhbm90aGVyIGNhbGwgdG8gYCRyZXNvbHZlYC5cbiAgICogQHBhcmFtIHtvYmplY3R9IHNlbGYgIHRoZSBgdGhpc2AgZm9yIHRoZSBpbnZva2VkIG1ldGhvZHNcbiAgICogQHJldHVybiB7b2JqZWN0fSBQcm9taXNlIGZvciBhbiBvYmplY3QgdGhhdCBjb250YWlucyB0aGUgcmVzb2x2ZWQgcmV0dXJuIHZhbHVlXG4gICAqIG9mIGFsbCBpbnZvY2FibGVzLCBhcyB3ZWxsIGFzIGFueSBpbmhlcml0ZWQgYW5kIGxvY2FsIHZhbHVlcy5cbiAgICovXG4gIHRoaXMucmVzb2x2ZSA9IGZ1bmN0aW9uIChpbnZvY2FibGVzLCBsb2NhbHMsIHBhcmVudCwgc2VsZikge1xuICAgIHJldHVybiB0aGlzLnN0dWR5KGludm9jYWJsZXMpKGxvY2FscywgcGFyZW50LCBzZWxmKTtcbiAgfTtcbn1cblxuYW5ndWxhci5tb2R1bGUoJ3VpLnJvdXRlci51dGlsJykuc2VydmljZSgnJHJlc29sdmUnLCAkUmVzb2x2ZSk7XG5cblxuLyoqXG4gKiBAbmdkb2Mgb2JqZWN0XG4gKiBAbmFtZSB1aS5yb3V0ZXIudXRpbC4kdGVtcGxhdGVGYWN0b3J5XG4gKlxuICogQHJlcXVpcmVzICRodHRwXG4gKiBAcmVxdWlyZXMgJHRlbXBsYXRlQ2FjaGVcbiAqIEByZXF1aXJlcyAkaW5qZWN0b3JcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFNlcnZpY2UuIE1hbmFnZXMgbG9hZGluZyBvZiB0ZW1wbGF0ZXMuXG4gKi9cbiRUZW1wbGF0ZUZhY3RvcnkuJGluamVjdCA9IFsnJGh0dHAnLCAnJHRlbXBsYXRlQ2FjaGUnLCAnJGluamVjdG9yJ107XG5mdW5jdGlvbiAkVGVtcGxhdGVGYWN0b3J5KCAgJGh0dHAsICAgJHRlbXBsYXRlQ2FjaGUsICAgJGluamVjdG9yKSB7XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgKiBAbmFtZSB1aS5yb3V0ZXIudXRpbC4kdGVtcGxhdGVGYWN0b3J5I2Zyb21Db25maWdcbiAgICogQG1ldGhvZE9mIHVpLnJvdXRlci51dGlsLiR0ZW1wbGF0ZUZhY3RvcnlcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENyZWF0ZXMgYSB0ZW1wbGF0ZSBmcm9tIGEgY29uZmlndXJhdGlvbiBvYmplY3QuIFxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gY29uZmlnIENvbmZpZ3VyYXRpb24gb2JqZWN0IGZvciB3aGljaCB0byBsb2FkIGEgdGVtcGxhdGUuIFxuICAgKiBUaGUgZm9sbG93aW5nIHByb3BlcnRpZXMgYXJlIHNlYXJjaCBpbiB0aGUgc3BlY2lmaWVkIG9yZGVyLCBhbmQgdGhlIGZpcnN0IG9uZSBcbiAgICogdGhhdCBpcyBkZWZpbmVkIGlzIHVzZWQgdG8gY3JlYXRlIHRoZSB0ZW1wbGF0ZTpcbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSBjb25maWcudGVtcGxhdGUgaHRtbCBzdHJpbmcgdGVtcGxhdGUgb3IgZnVuY3Rpb24gdG8gXG4gICAqIGxvYWQgdmlhIHtAbGluayB1aS5yb3V0ZXIudXRpbC4kdGVtcGxhdGVGYWN0b3J5I2Zyb21TdHJpbmcgZnJvbVN0cmluZ30uXG4gICAqIEBwYXJhbSB7c3RyaW5nfG9iamVjdH0gY29uZmlnLnRlbXBsYXRlVXJsIHVybCB0byBsb2FkIG9yIGEgZnVuY3Rpb24gcmV0dXJuaW5nIFxuICAgKiB0aGUgdXJsIHRvIGxvYWQgdmlhIHtAbGluayB1aS5yb3V0ZXIudXRpbC4kdGVtcGxhdGVGYWN0b3J5I2Zyb21VcmwgZnJvbVVybH0uXG4gICAqIEBwYXJhbSB7RnVuY3Rpb259IGNvbmZpZy50ZW1wbGF0ZVByb3ZpZGVyIGZ1bmN0aW9uIHRvIGludm9rZSB2aWEgXG4gICAqIHtAbGluayB1aS5yb3V0ZXIudXRpbC4kdGVtcGxhdGVGYWN0b3J5I2Zyb21Qcm92aWRlciBmcm9tUHJvdmlkZXJ9LlxuICAgKiBAcGFyYW0ge29iamVjdH0gcGFyYW1zICBQYXJhbWV0ZXJzIHRvIHBhc3MgdG8gdGhlIHRlbXBsYXRlIGZ1bmN0aW9uLlxuICAgKiBAcGFyYW0ge29iamVjdH0gbG9jYWxzIExvY2FscyB0byBwYXNzIHRvIGBpbnZva2VgIGlmIHRoZSB0ZW1wbGF0ZSBpcyBsb2FkZWQgXG4gICAqIHZpYSBhIGB0ZW1wbGF0ZVByb3ZpZGVyYC4gRGVmYXVsdHMgdG8gYHsgcGFyYW1zOiBwYXJhbXMgfWAuXG4gICAqXG4gICAqIEByZXR1cm4ge3N0cmluZ3xvYmplY3R9ICBUaGUgdGVtcGxhdGUgaHRtbCBhcyBhIHN0cmluZywgb3IgYSBwcm9taXNlIGZvciBcbiAgICogdGhhdCBzdHJpbmcsb3IgYG51bGxgIGlmIG5vIHRlbXBsYXRlIGlzIGNvbmZpZ3VyZWQuXG4gICAqL1xuICB0aGlzLmZyb21Db25maWcgPSBmdW5jdGlvbiAoY29uZmlnLCBwYXJhbXMsIGxvY2Fscykge1xuICAgIHJldHVybiAoXG4gICAgICBpc0RlZmluZWQoY29uZmlnLnRlbXBsYXRlKSA/IHRoaXMuZnJvbVN0cmluZyhjb25maWcudGVtcGxhdGUsIHBhcmFtcykgOlxuICAgICAgaXNEZWZpbmVkKGNvbmZpZy50ZW1wbGF0ZVVybCkgPyB0aGlzLmZyb21VcmwoY29uZmlnLnRlbXBsYXRlVXJsLCBwYXJhbXMpIDpcbiAgICAgIGlzRGVmaW5lZChjb25maWcudGVtcGxhdGVQcm92aWRlcikgPyB0aGlzLmZyb21Qcm92aWRlcihjb25maWcudGVtcGxhdGVQcm92aWRlciwgcGFyYW1zLCBsb2NhbHMpIDpcbiAgICAgIG51bGxcbiAgICApO1xuICB9O1xuXG4gIC8qKlxuICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICogQG5hbWUgdWkucm91dGVyLnV0aWwuJHRlbXBsYXRlRmFjdG9yeSNmcm9tU3RyaW5nXG4gICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIudXRpbC4kdGVtcGxhdGVGYWN0b3J5XG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBDcmVhdGVzIGEgdGVtcGxhdGUgZnJvbSBhIHN0cmluZyBvciBhIGZ1bmN0aW9uIHJldHVybmluZyBhIHN0cmluZy5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSB0ZW1wbGF0ZSBodG1sIHRlbXBsYXRlIGFzIGEgc3RyaW5nIG9yIGZ1bmN0aW9uIHRoYXQgXG4gICAqIHJldHVybnMgYW4gaHRtbCB0ZW1wbGF0ZSBhcyBhIHN0cmluZy5cbiAgICogQHBhcmFtIHtvYmplY3R9IHBhcmFtcyBQYXJhbWV0ZXJzIHRvIHBhc3MgdG8gdGhlIHRlbXBsYXRlIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJuIHtzdHJpbmd8b2JqZWN0fSBUaGUgdGVtcGxhdGUgaHRtbCBhcyBhIHN0cmluZywgb3IgYSBwcm9taXNlIGZvciB0aGF0IFxuICAgKiBzdHJpbmcuXG4gICAqL1xuICB0aGlzLmZyb21TdHJpbmcgPSBmdW5jdGlvbiAodGVtcGxhdGUsIHBhcmFtcykge1xuICAgIHJldHVybiBpc0Z1bmN0aW9uKHRlbXBsYXRlKSA/IHRlbXBsYXRlKHBhcmFtcykgOiB0ZW1wbGF0ZTtcbiAgfTtcblxuICAvKipcbiAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAqIEBuYW1lIHVpLnJvdXRlci51dGlsLiR0ZW1wbGF0ZUZhY3RvcnkjZnJvbVVybFxuICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnV0aWwuJHRlbXBsYXRlRmFjdG9yeVxuICAgKiBcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIExvYWRzIGEgdGVtcGxhdGUgZnJvbSB0aGUgYSBVUkwgdmlhIGAkaHR0cGAgYW5kIGAkdGVtcGxhdGVDYWNoZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7c3RyaW5nfEZ1bmN0aW9ufSB1cmwgdXJsIG9mIHRoZSB0ZW1wbGF0ZSB0byBsb2FkLCBvciBhIGZ1bmN0aW9uIFxuICAgKiB0aGF0IHJldHVybnMgYSB1cmwuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgUGFyYW1ldGVycyB0byBwYXNzIHRvIHRoZSB1cmwgZnVuY3Rpb24uXG4gICAqIEByZXR1cm4ge3N0cmluZ3xQcm9taXNlLjxzdHJpbmc+fSBUaGUgdGVtcGxhdGUgaHRtbCBhcyBhIHN0cmluZywgb3IgYSBwcm9taXNlIFxuICAgKiBmb3IgdGhhdCBzdHJpbmcuXG4gICAqL1xuICB0aGlzLmZyb21VcmwgPSBmdW5jdGlvbiAodXJsLCBwYXJhbXMpIHtcbiAgICBpZiAoaXNGdW5jdGlvbih1cmwpKSB1cmwgPSB1cmwocGFyYW1zKTtcbiAgICBpZiAodXJsID09IG51bGwpIHJldHVybiBudWxsO1xuICAgIGVsc2UgcmV0dXJuICRodHRwXG4gICAgICAgIC5nZXQodXJsLCB7IGNhY2hlOiAkdGVtcGxhdGVDYWNoZSB9KVxuICAgICAgICAudGhlbihmdW5jdGlvbihyZXNwb25zZSkgeyByZXR1cm4gcmVzcG9uc2UuZGF0YTsgfSk7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgKiBAbmFtZSB1aS5yb3V0ZXIudXRpbC4kdGVtcGxhdGVGYWN0b3J5I2Zyb21VcmxcbiAgICogQG1ldGhvZE9mIHVpLnJvdXRlci51dGlsLiR0ZW1wbGF0ZUZhY3RvcnlcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENyZWF0ZXMgYSB0ZW1wbGF0ZSBieSBpbnZva2luZyBhbiBpbmplY3RhYmxlIHByb3ZpZGVyIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAcGFyYW0ge0Z1bmN0aW9ufSBwcm92aWRlciBGdW5jdGlvbiB0byBpbnZva2UgdmlhIGAkaW5qZWN0b3IuaW52b2tlYFxuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIFBhcmFtZXRlcnMgZm9yIHRoZSB0ZW1wbGF0ZS5cbiAgICogQHBhcmFtIHtPYmplY3R9IGxvY2FscyBMb2NhbHMgdG8gcGFzcyB0byBgaW52b2tlYC4gRGVmYXVsdHMgdG8gXG4gICAqIGB7IHBhcmFtczogcGFyYW1zIH1gLlxuICAgKiBAcmV0dXJuIHtzdHJpbmd8UHJvbWlzZS48c3RyaW5nPn0gVGhlIHRlbXBsYXRlIGh0bWwgYXMgYSBzdHJpbmcsIG9yIGEgcHJvbWlzZSBcbiAgICogZm9yIHRoYXQgc3RyaW5nLlxuICAgKi9cbiAgdGhpcy5mcm9tUHJvdmlkZXIgPSBmdW5jdGlvbiAocHJvdmlkZXIsIHBhcmFtcywgbG9jYWxzKSB7XG4gICAgcmV0dXJuICRpbmplY3Rvci5pbnZva2UocHJvdmlkZXIsIG51bGwsIGxvY2FscyB8fCB7IHBhcmFtczogcGFyYW1zIH0pO1xuICB9O1xufVxuXG5hbmd1bGFyLm1vZHVsZSgndWkucm91dGVyLnV0aWwnKS5zZXJ2aWNlKCckdGVtcGxhdGVGYWN0b3J5JywgJFRlbXBsYXRlRmFjdG9yeSk7XG5cbi8qKlxuICogQG5nZG9jIG9iamVjdFxuICogQG5hbWUgdWkucm91dGVyLnV0aWwudHlwZTpVcmxNYXRjaGVyXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBNYXRjaGVzIFVSTHMgYWdhaW5zdCBwYXR0ZXJucyBhbmQgZXh0cmFjdHMgbmFtZWQgcGFyYW1ldGVycyBmcm9tIHRoZSBwYXRoIG9yIHRoZSBzZWFyY2hcbiAqIHBhcnQgb2YgdGhlIFVSTC4gQSBVUkwgcGF0dGVybiBjb25zaXN0cyBvZiBhIHBhdGggcGF0dGVybiwgb3B0aW9uYWxseSBmb2xsb3dlZCBieSAnPycgYW5kIGEgbGlzdFxuICogb2Ygc2VhcmNoIHBhcmFtZXRlcnMuIE11bHRpcGxlIHNlYXJjaCBwYXJhbWV0ZXIgbmFtZXMgYXJlIHNlcGFyYXRlZCBieSAnJicuIFNlYXJjaCBwYXJhbWV0ZXJzXG4gKiBkbyBub3QgaW5mbHVlbmNlIHdoZXRoZXIgb3Igbm90IGEgVVJMIGlzIG1hdGNoZWQsIGJ1dCB0aGVpciB2YWx1ZXMgYXJlIHBhc3NlZCB0aHJvdWdoIGludG9cbiAqIHRoZSBtYXRjaGVkIHBhcmFtZXRlcnMgcmV0dXJuZWQgYnkge0BsaW5rIHVpLnJvdXRlci51dGlsLnR5cGU6VXJsTWF0Y2hlciNtZXRob2RzX2V4ZWMgZXhlY30uXG4gKiBcbiAqIFBhdGggcGFyYW1ldGVyIHBsYWNlaG9sZGVycyBjYW4gYmUgc3BlY2lmaWVkIHVzaW5nIHNpbXBsZSBjb2xvbi9jYXRjaC1hbGwgc3ludGF4IG9yIGN1cmx5IGJyYWNlXG4gKiBzeW50YXgsIHdoaWNoIG9wdGlvbmFsbHkgYWxsb3dzIGEgcmVndWxhciBleHByZXNzaW9uIGZvciB0aGUgcGFyYW1ldGVyIHRvIGJlIHNwZWNpZmllZDpcbiAqXG4gKiAqIGAnOidgIG5hbWUgLSBjb2xvbiBwbGFjZWhvbGRlclxuICogKiBgJyonYCBuYW1lIC0gY2F0Y2gtYWxsIHBsYWNlaG9sZGVyXG4gKiAqIGAneycgbmFtZSAnfSdgIC0gY3VybHkgcGxhY2Vob2xkZXJcbiAqICogYCd7JyBuYW1lICc6JyByZWdleHAgJ30nYCAtIGN1cmx5IHBsYWNlaG9sZGVyIHdpdGggcmVnZXhwLiBTaG91bGQgdGhlIHJlZ2V4cCBpdHNlbGYgY29udGFpblxuICogICBjdXJseSBicmFjZXMsIHRoZXkgbXVzdCBiZSBpbiBtYXRjaGVkIHBhaXJzIG9yIGVzY2FwZWQgd2l0aCBhIGJhY2tzbGFzaC5cbiAqXG4gKiBQYXJhbWV0ZXIgbmFtZXMgbWF5IGNvbnRhaW4gb25seSB3b3JkIGNoYXJhY3RlcnMgKGxhdGluIGxldHRlcnMsIGRpZ2l0cywgYW5kIHVuZGVyc2NvcmUpIGFuZFxuICogbXVzdCBiZSB1bmlxdWUgd2l0aGluIHRoZSBwYXR0ZXJuIChhY3Jvc3MgYm90aCBwYXRoIGFuZCBzZWFyY2ggcGFyYW1ldGVycykuIEZvciBjb2xvbiBcbiAqIHBsYWNlaG9sZGVycyBvciBjdXJseSBwbGFjZWhvbGRlcnMgd2l0aG91dCBhbiBleHBsaWNpdCByZWdleHAsIGEgcGF0aCBwYXJhbWV0ZXIgbWF0Y2hlcyBhbnlcbiAqIG51bWJlciBvZiBjaGFyYWN0ZXJzIG90aGVyIHRoYW4gJy8nLiBGb3IgY2F0Y2gtYWxsIHBsYWNlaG9sZGVycyB0aGUgcGF0aCBwYXJhbWV0ZXIgbWF0Y2hlc1xuICogYW55IG51bWJlciBvZiBjaGFyYWN0ZXJzLlxuICogXG4gKiBFeGFtcGxlczpcbiAqIFxuICogKiBgJy9oZWxsby8nYCAtIE1hdGNoZXMgb25seSBpZiB0aGUgcGF0aCBpcyBleGFjdGx5ICcvaGVsbG8vJy4gVGhlcmUgaXMgbm8gc3BlY2lhbCB0cmVhdG1lbnQgZm9yXG4gKiAgIHRyYWlsaW5nIHNsYXNoZXMsIGFuZCBwYXR0ZXJucyBoYXZlIHRvIG1hdGNoIHRoZSBlbnRpcmUgcGF0aCwgbm90IGp1c3QgYSBwcmVmaXguXG4gKiAqIGAnL3VzZXIvOmlkJ2AgLSBNYXRjaGVzICcvdXNlci9ib2InIG9yICcvdXNlci8xMjM0ISEhJyBvciBldmVuICcvdXNlci8nIGJ1dCBub3QgJy91c2VyJyBvclxuICogICAnL3VzZXIvYm9iL2RldGFpbHMnLiBUaGUgc2Vjb25kIHBhdGggc2VnbWVudCB3aWxsIGJlIGNhcHR1cmVkIGFzIHRoZSBwYXJhbWV0ZXIgJ2lkJy5cbiAqICogYCcvdXNlci97aWR9J2AgLSBTYW1lIGFzIHRoZSBwcmV2aW91cyBleGFtcGxlLCBidXQgdXNpbmcgY3VybHkgYnJhY2Ugc3ludGF4LlxuICogKiBgJy91c2VyL3tpZDpbXi9dKn0nYCAtIFNhbWUgYXMgdGhlIHByZXZpb3VzIGV4YW1wbGUuXG4gKiAqIGAnL3VzZXIve2lkOlswLTlhLWZBLUZdezEsOH19J2AgLSBTaW1pbGFyIHRvIHRoZSBwcmV2aW91cyBleGFtcGxlLCBidXQgb25seSBtYXRjaGVzIGlmIHRoZSBpZFxuICogICBwYXJhbWV0ZXIgY29uc2lzdHMgb2YgMSB0byA4IGhleCBkaWdpdHMuXG4gKiAqIGAnL2ZpbGVzL3twYXRoOi4qfSdgIC0gTWF0Y2hlcyBhbnkgVVJMIHN0YXJ0aW5nIHdpdGggJy9maWxlcy8nIGFuZCBjYXB0dXJlcyB0aGUgcmVzdCBvZiB0aGVcbiAqICAgcGF0aCBpbnRvIHRoZSBwYXJhbWV0ZXIgJ3BhdGgnLlxuICogKiBgJy9maWxlcy8qcGF0aCdgIC0gZGl0dG8uXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdHRlcm4gIHRoZSBwYXR0ZXJuIHRvIGNvbXBpbGUgaW50byBhIG1hdGNoZXIuXG4gKlxuICogQHByb3BlcnR5IHtzdHJpbmd9IHByZWZpeCAgQSBzdGF0aWMgcHJlZml4IG9mIHRoaXMgcGF0dGVybi4gVGhlIG1hdGNoZXIgZ3VhcmFudGVlcyB0aGF0IGFueVxuICogICBVUkwgbWF0Y2hpbmcgdGhpcyBtYXRjaGVyIChpLmUuIGFueSBzdHJpbmcgZm9yIHdoaWNoIHtAbGluayB1aS5yb3V0ZXIudXRpbC50eXBlOlVybE1hdGNoZXIjbWV0aG9kc19leGVjIGV4ZWMoKX0gcmV0dXJuc1xuICogICBub24tbnVsbCkgd2lsbCBzdGFydCB3aXRoIHRoaXMgcHJlZml4LlxuICpcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzb3VyY2UgIFRoZSBwYXR0ZXJuIHRoYXQgd2FzIHBhc3NlZCBpbnRvIHRoZSBjb250cnVjdG9yXG4gKlxuICogQHByb3BlcnR5IHtzdHJpbmd9IHNvdXJjZVBhdGggIFRoZSBwYXRoIHBvcnRpb24gb2YgdGhlIHNvdXJjZSBwcm9wZXJ0eVxuICpcbiAqIEBwcm9wZXJ0eSB7c3RyaW5nfSBzb3VyY2VTZWFyY2ggIFRoZSBzZWFyY2ggcG9ydGlvbiBvZiB0aGUgc291cmNlIHByb3BlcnR5XG4gKlxuICogQHByb3BlcnR5IHtzdHJpbmd9IHJlZ2V4ICBUaGUgY29uc3RydWN0ZWQgcmVnZXggdGhhdCB3aWxsIGJlIHVzZWQgdG8gbWF0Y2ggYWdhaW5zdCB0aGUgdXJsIHdoZW4gXG4gKiAgIGl0IGlzIHRpbWUgdG8gZGV0ZXJtaW5lIHdoaWNoIHVybCB3aWxsIG1hdGNoLlxuICpcbiAqIEByZXR1cm5zIHtPYmplY3R9ICBOZXcgVXJsTWF0Y2hlciBvYmplY3RcbiAqL1xuZnVuY3Rpb24gVXJsTWF0Y2hlcihwYXR0ZXJuKSB7XG5cbiAgLy8gRmluZCBhbGwgcGxhY2Vob2xkZXJzIGFuZCBjcmVhdGUgYSBjb21waWxlZCBwYXR0ZXJuLCB1c2luZyBlaXRoZXIgY2xhc3NpYyBvciBjdXJseSBzeW50YXg6XG4gIC8vICAgJyonIG5hbWVcbiAgLy8gICAnOicgbmFtZVxuICAvLyAgICd7JyBuYW1lICd9J1xuICAvLyAgICd7JyBuYW1lICc6JyByZWdleHAgJ30nXG4gIC8vIFRoZSByZWd1bGFyIGV4cHJlc3Npb24gaXMgc29tZXdoYXQgY29tcGxpY2F0ZWQgZHVlIHRvIHRoZSBuZWVkIHRvIGFsbG93IGN1cmx5IGJyYWNlc1xuICAvLyBpbnNpZGUgdGhlIHJlZ3VsYXIgZXhwcmVzc2lvbi4gVGhlIHBsYWNlaG9sZGVyIHJlZ2V4cCBicmVha3MgZG93biBhcyBmb2xsb3dzOlxuICAvLyAgICAoWzoqXSkoXFx3KykgICAgICAgICAgICAgICBjbGFzc2ljIHBsYWNlaG9sZGVyICgkMSAvICQyKVxuICAvLyAgICBcXHsoXFx3KykoPzpcXDooIC4uLiApKT9cXH0gICBjdXJseSBicmFjZSBwbGFjZWhvbGRlciAoJDMpIHdpdGggb3B0aW9uYWwgcmVnZXhwIC4uLiAoJDQpXG4gIC8vICAgICg/OiAuLi4gfCAuLi4gfCAuLi4gKSsgICAgdGhlIHJlZ2V4cCBjb25zaXN0cyBvZiBhbnkgbnVtYmVyIG9mIGF0b21zLCBhbiBhdG9tIGJlaW5nIGVpdGhlclxuICAvLyAgICBbXnt9XFxcXF0rICAgICAgICAgICAgICAgICAgLSBhbnl0aGluZyBvdGhlciB0aGFuIGN1cmx5IGJyYWNlcyBvciBiYWNrc2xhc2hcbiAgLy8gICAgXFxcXC4gICAgICAgICAgICAgICAgICAgICAgIC0gYSBiYWNrc2xhc2ggZXNjYXBlXG4gIC8vICAgIFxceyg/Oltee31cXFxcXSt8XFxcXC4pKlxcfSAgICAgLSBhIG1hdGNoZWQgc2V0IG9mIGN1cmx5IGJyYWNlcyBjb250YWluaW5nIG90aGVyIGF0b21zXG4gIHZhciBwbGFjZWhvbGRlciA9IC8oWzoqXSkoXFx3Kyl8XFx7KFxcdyspKD86XFw6KCg/Oltee31cXFxcXSt8XFxcXC58XFx7KD86W157fVxcXFxdK3xcXFxcLikqXFx9KSspKT9cXH0vZyxcbiAgICAgIG5hbWVzID0ge30sIGNvbXBpbGVkID0gJ14nLCBsYXN0ID0gMCwgbSxcbiAgICAgIHNlZ21lbnRzID0gdGhpcy5zZWdtZW50cyA9IFtdLFxuICAgICAgcGFyYW1zID0gdGhpcy5wYXJhbXMgPSBbXTtcblxuICBmdW5jdGlvbiBhZGRQYXJhbWV0ZXIoaWQpIHtcbiAgICBpZiAoIS9eXFx3KygtK1xcdyspKiQvLnRlc3QoaWQpKSB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHBhcmFtZXRlciBuYW1lICdcIiArIGlkICsgXCInIGluIHBhdHRlcm4gJ1wiICsgcGF0dGVybiArIFwiJ1wiKTtcbiAgICBpZiAobmFtZXNbaWRdKSB0aHJvdyBuZXcgRXJyb3IoXCJEdXBsaWNhdGUgcGFyYW1ldGVyIG5hbWUgJ1wiICsgaWQgKyBcIicgaW4gcGF0dGVybiAnXCIgKyBwYXR0ZXJuICsgXCInXCIpO1xuICAgIG5hbWVzW2lkXSA9IHRydWU7XG4gICAgcGFyYW1zLnB1c2goaWQpO1xuICB9XG5cbiAgZnVuY3Rpb24gcXVvdGVSZWdFeHAoc3RyaW5nKSB7XG4gICAgcmV0dXJuIHN0cmluZy5yZXBsYWNlKC9bXFxcXFxcW1xcXVxcXiQqKz8uKCl8e31dL2csIFwiXFxcXCQmXCIpO1xuICB9XG5cbiAgdGhpcy5zb3VyY2UgPSBwYXR0ZXJuO1xuXG4gIC8vIFNwbGl0IGludG8gc3RhdGljIHNlZ21lbnRzIHNlcGFyYXRlZCBieSBwYXRoIHBhcmFtZXRlciBwbGFjZWhvbGRlcnMuXG4gIC8vIFRoZSBudW1iZXIgb2Ygc2VnbWVudHMgaXMgYWx3YXlzIDEgbW9yZSB0aGFuIHRoZSBudW1iZXIgb2YgcGFyYW1ldGVycy5cbiAgdmFyIGlkLCByZWdleHAsIHNlZ21lbnQ7XG4gIHdoaWxlICgobSA9IHBsYWNlaG9sZGVyLmV4ZWMocGF0dGVybikpKSB7XG4gICAgaWQgPSBtWzJdIHx8IG1bM107IC8vIElFWzc4XSByZXR1cm5zICcnIGZvciB1bm1hdGNoZWQgZ3JvdXBzIGluc3RlYWQgb2YgbnVsbFxuICAgIHJlZ2V4cCA9IG1bNF0gfHwgKG1bMV0gPT0gJyonID8gJy4qJyA6ICdbXi9dKicpO1xuICAgIHNlZ21lbnQgPSBwYXR0ZXJuLnN1YnN0cmluZyhsYXN0LCBtLmluZGV4KTtcbiAgICBpZiAoc2VnbWVudC5pbmRleE9mKCc/JykgPj0gMCkgYnJlYWs7IC8vIHdlJ3JlIGludG8gdGhlIHNlYXJjaCBwYXJ0XG4gICAgY29tcGlsZWQgKz0gcXVvdGVSZWdFeHAoc2VnbWVudCkgKyAnKCcgKyByZWdleHAgKyAnKSc7XG4gICAgYWRkUGFyYW1ldGVyKGlkKTtcbiAgICBzZWdtZW50cy5wdXNoKHNlZ21lbnQpO1xuICAgIGxhc3QgPSBwbGFjZWhvbGRlci5sYXN0SW5kZXg7XG4gIH1cbiAgc2VnbWVudCA9IHBhdHRlcm4uc3Vic3RyaW5nKGxhc3QpO1xuXG4gIC8vIEZpbmQgYW55IHNlYXJjaCBwYXJhbWV0ZXIgbmFtZXMgYW5kIHJlbW92ZSB0aGVtIGZyb20gdGhlIGxhc3Qgc2VnbWVudFxuICB2YXIgaSA9IHNlZ21lbnQuaW5kZXhPZignPycpO1xuICBpZiAoaSA+PSAwKSB7XG4gICAgdmFyIHNlYXJjaCA9IHRoaXMuc291cmNlU2VhcmNoID0gc2VnbWVudC5zdWJzdHJpbmcoaSk7XG4gICAgc2VnbWVudCA9IHNlZ21lbnQuc3Vic3RyaW5nKDAsIGkpO1xuICAgIHRoaXMuc291cmNlUGF0aCA9IHBhdHRlcm4uc3Vic3RyaW5nKDAsIGxhc3QraSk7XG5cbiAgICAvLyBBbGxvdyBwYXJhbWV0ZXJzIHRvIGJlIHNlcGFyYXRlZCBieSAnPycgYXMgd2VsbCBhcyAnJicgdG8gbWFrZSBjb25jYXQoKSBlYXNpZXJcbiAgICBmb3JFYWNoKHNlYXJjaC5zdWJzdHJpbmcoMSkuc3BsaXQoL1smP10vKSwgYWRkUGFyYW1ldGVyKTtcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnNvdXJjZVBhdGggPSBwYXR0ZXJuO1xuICAgIHRoaXMuc291cmNlU2VhcmNoID0gJyc7XG4gIH1cblxuICBjb21waWxlZCArPSBxdW90ZVJlZ0V4cChzZWdtZW50KSArICckJztcbiAgc2VnbWVudHMucHVzaChzZWdtZW50KTtcbiAgdGhpcy5yZWdleHAgPSBuZXcgUmVnRXhwKGNvbXBpbGVkKTtcbiAgdGhpcy5wcmVmaXggPSBzZWdtZW50c1swXTtcbn1cblxuLyoqXG4gKiBAbmdkb2MgZnVuY3Rpb25cbiAqIEBuYW1lIHVpLnJvdXRlci51dGlsLnR5cGU6VXJsTWF0Y2hlciNjb25jYXRcbiAqIEBtZXRob2RPZiB1aS5yb3V0ZXIudXRpbC50eXBlOlVybE1hdGNoZXJcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFJldHVybnMgYSBuZXcgbWF0Y2hlciBmb3IgYSBwYXR0ZXJuIGNvbnN0cnVjdGVkIGJ5IGFwcGVuZGluZyB0aGUgcGF0aCBwYXJ0IGFuZCBhZGRpbmcgdGhlXG4gKiBzZWFyY2ggcGFyYW1ldGVycyBvZiB0aGUgc3BlY2lmaWVkIHBhdHRlcm4gdG8gdGhpcyBwYXR0ZXJuLiBUaGUgY3VycmVudCBwYXR0ZXJuIGlzIG5vdFxuICogbW9kaWZpZWQuIFRoaXMgY2FuIGJlIHVuZGVyc3Rvb2QgYXMgY3JlYXRpbmcgYSBwYXR0ZXJuIGZvciBVUkxzIHRoYXQgYXJlIHJlbGF0aXZlIHRvIChvclxuICogc3VmZml4ZXMgb2YpIHRoZSBjdXJyZW50IHBhdHRlcm4uXG4gKlxuICogQGV4YW1wbGVcbiAqIFRoZSBmb2xsb3dpbmcgdHdvIG1hdGNoZXJzIGFyZSBlcXVpdmFsZW50OlxuICogYGBgXG4gKiBuZXcgVXJsTWF0Y2hlcignL3VzZXIve2lkfT9xJykuY29uY2F0KCcvZGV0YWlscz9kYXRlJyk7XG4gKiBuZXcgVXJsTWF0Y2hlcignL3VzZXIve2lkfS9kZXRhaWxzP3EmZGF0ZScpO1xuICogYGBgXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IHBhdHRlcm4gIFRoZSBwYXR0ZXJuIHRvIGFwcGVuZC5cbiAqIEByZXR1cm5zIHt1aS5yb3V0ZXIudXRpbC50eXBlOlVybE1hdGNoZXJ9ICBBIG1hdGNoZXIgZm9yIHRoZSBjb25jYXRlbmF0ZWQgcGF0dGVybi5cbiAqL1xuVXJsTWF0Y2hlci5wcm90b3R5cGUuY29uY2F0ID0gZnVuY3Rpb24gKHBhdHRlcm4pIHtcbiAgLy8gQmVjYXVzZSBvcmRlciBvZiBzZWFyY2ggcGFyYW1ldGVycyBpcyBpcnJlbGV2YW50LCB3ZSBjYW4gYWRkIG91ciBvd24gc2VhcmNoXG4gIC8vIHBhcmFtZXRlcnMgdG8gdGhlIGVuZCBvZiB0aGUgbmV3IHBhdHRlcm4uIFBhcnNlIHRoZSBuZXcgcGF0dGVybiBieSBpdHNlbGZcbiAgLy8gYW5kIHRoZW4gam9pbiB0aGUgYml0cyB0b2dldGhlciwgYnV0IGl0J3MgbXVjaCBlYXNpZXIgdG8gZG8gdGhpcyBvbiBhIHN0cmluZyBsZXZlbC5cbiAgcmV0dXJuIG5ldyBVcmxNYXRjaGVyKHRoaXMuc291cmNlUGF0aCArIHBhdHRlcm4gKyB0aGlzLnNvdXJjZVNlYXJjaCk7XG59O1xuXG5VcmxNYXRjaGVyLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXMuc291cmNlO1xufTtcblxuLyoqXG4gKiBAbmdkb2MgZnVuY3Rpb25cbiAqIEBuYW1lIHVpLnJvdXRlci51dGlsLnR5cGU6VXJsTWF0Y2hlciNleGVjXG4gKiBAbWV0aG9kT2YgdWkucm91dGVyLnV0aWwudHlwZTpVcmxNYXRjaGVyXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBUZXN0cyB0aGUgc3BlY2lmaWVkIHBhdGggYWdhaW5zdCB0aGlzIG1hdGNoZXIsIGFuZCByZXR1cm5zIGFuIG9iamVjdCBjb250YWluaW5nIHRoZSBjYXB0dXJlZFxuICogcGFyYW1ldGVyIHZhbHVlcywgb3IgbnVsbCBpZiB0aGUgcGF0aCBkb2VzIG5vdCBtYXRjaC4gVGhlIHJldHVybmVkIG9iamVjdCBjb250YWlucyB0aGUgdmFsdWVzXG4gKiBvZiBhbnkgc2VhcmNoIHBhcmFtZXRlcnMgdGhhdCBhcmUgbWVudGlvbmVkIGluIHRoZSBwYXR0ZXJuLCBidXQgdGhlaXIgdmFsdWUgbWF5IGJlIG51bGwgaWZcbiAqIHRoZXkgYXJlIG5vdCBwcmVzZW50IGluIGBzZWFyY2hQYXJhbXNgLiBUaGlzIG1lYW5zIHRoYXQgc2VhcmNoIHBhcmFtZXRlcnMgYXJlIGFsd2F5cyB0cmVhdGVkXG4gKiBhcyBvcHRpb25hbC5cbiAqXG4gKiBAZXhhbXBsZVxuICogYGBgXG4gKiBuZXcgVXJsTWF0Y2hlcignL3VzZXIve2lkfT9xJnInKS5leGVjKCcvdXNlci9ib2InLCB7IHg6JzEnLCBxOidoZWxsbycgfSk7XG4gKiAvLyByZXR1cm5zIHsgaWQ6J2JvYicsIHE6J2hlbGxvJywgcjpudWxsIH1cbiAqIGBgYFxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSBwYXRoICBUaGUgVVJMIHBhdGggdG8gbWF0Y2gsIGUuZy4gYCRsb2NhdGlvbi5wYXRoKClgLlxuICogQHBhcmFtIHtPYmplY3R9IHNlYXJjaFBhcmFtcyAgVVJMIHNlYXJjaCBwYXJhbWV0ZXJzLCBlLmcuIGAkbG9jYXRpb24uc2VhcmNoKClgLlxuICogQHJldHVybnMge09iamVjdH0gIFRoZSBjYXB0dXJlZCBwYXJhbWV0ZXIgdmFsdWVzLlxuICovXG5VcmxNYXRjaGVyLnByb3RvdHlwZS5leGVjID0gZnVuY3Rpb24gKHBhdGgsIHNlYXJjaFBhcmFtcykge1xuICB2YXIgbSA9IHRoaXMucmVnZXhwLmV4ZWMocGF0aCk7XG4gIGlmICghbSkgcmV0dXJuIG51bGw7XG5cbiAgdmFyIHBhcmFtcyA9IHRoaXMucGFyYW1zLCBuVG90YWwgPSBwYXJhbXMubGVuZ3RoLFxuICAgIG5QYXRoID0gdGhpcy5zZWdtZW50cy5sZW5ndGgtMSxcbiAgICB2YWx1ZXMgPSB7fSwgaTtcblxuICBpZiAoblBhdGggIT09IG0ubGVuZ3RoIC0gMSkgdGhyb3cgbmV3IEVycm9yKFwiVW5iYWxhbmNlZCBjYXB0dXJlIGdyb3VwIGluIHJvdXRlICdcIiArIHRoaXMuc291cmNlICsgXCInXCIpO1xuXG4gIGZvciAoaT0wOyBpPG5QYXRoOyBpKyspIHZhbHVlc1twYXJhbXNbaV1dID0gbVtpKzFdO1xuICBmb3IgKC8qKi87IGk8blRvdGFsOyBpKyspIHZhbHVlc1twYXJhbXNbaV1dID0gc2VhcmNoUGFyYW1zW3BhcmFtc1tpXV07XG5cbiAgcmV0dXJuIHZhbHVlcztcbn07XG5cbi8qKlxuICogQG5nZG9jIGZ1bmN0aW9uXG4gKiBAbmFtZSB1aS5yb3V0ZXIudXRpbC50eXBlOlVybE1hdGNoZXIjcGFyYW1ldGVyc1xuICogQG1ldGhvZE9mIHVpLnJvdXRlci51dGlsLnR5cGU6VXJsTWF0Y2hlclxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogUmV0dXJucyB0aGUgbmFtZXMgb2YgYWxsIHBhdGggYW5kIHNlYXJjaCBwYXJhbWV0ZXJzIG9mIHRoaXMgcGF0dGVybiBpbiBhbiB1bnNwZWNpZmllZCBvcmRlci5cbiAqIFxuICogQHJldHVybnMge0FycmF5LjxzdHJpbmc+fSAgQW4gYXJyYXkgb2YgcGFyYW1ldGVyIG5hbWVzLiBNdXN0IGJlIHRyZWF0ZWQgYXMgcmVhZC1vbmx5LiBJZiB0aGVcbiAqICAgIHBhdHRlcm4gaGFzIG5vIHBhcmFtZXRlcnMsIGFuIGVtcHR5IGFycmF5IGlzIHJldHVybmVkLlxuICovXG5VcmxNYXRjaGVyLnByb3RvdHlwZS5wYXJhbWV0ZXJzID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gdGhpcy5wYXJhbXM7XG59O1xuXG4vKipcbiAqIEBuZ2RvYyBmdW5jdGlvblxuICogQG5hbWUgdWkucm91dGVyLnV0aWwudHlwZTpVcmxNYXRjaGVyI2Zvcm1hdFxuICogQG1ldGhvZE9mIHVpLnJvdXRlci51dGlsLnR5cGU6VXJsTWF0Y2hlclxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogQ3JlYXRlcyBhIFVSTCB0aGF0IG1hdGNoZXMgdGhpcyBwYXR0ZXJuIGJ5IHN1YnN0aXR1dGluZyB0aGUgc3BlY2lmaWVkIHZhbHVlc1xuICogZm9yIHRoZSBwYXRoIGFuZCBzZWFyY2ggcGFyYW1ldGVycy4gTnVsbCB2YWx1ZXMgZm9yIHBhdGggcGFyYW1ldGVycyBhcmVcbiAqIHRyZWF0ZWQgYXMgZW1wdHkgc3RyaW5ncy5cbiAqXG4gKiBAZXhhbXBsZVxuICogYGBgXG4gKiBuZXcgVXJsTWF0Y2hlcignL3VzZXIve2lkfT9xJykuZm9ybWF0KHsgaWQ6J2JvYicsIHE6J3llcycgfSk7XG4gKiAvLyByZXR1cm5zICcvdXNlci9ib2I/cT15ZXMnXG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gdmFsdWVzICB0aGUgdmFsdWVzIHRvIHN1YnN0aXR1dGUgZm9yIHRoZSBwYXJhbWV0ZXJzIGluIHRoaXMgcGF0dGVybi5cbiAqIEByZXR1cm5zIHtzdHJpbmd9ICB0aGUgZm9ybWF0dGVkIFVSTCAocGF0aCBhbmQgb3B0aW9uYWxseSBzZWFyY2ggcGFydCkuXG4gKi9cblVybE1hdGNoZXIucHJvdG90eXBlLmZvcm1hdCA9IGZ1bmN0aW9uICh2YWx1ZXMpIHtcbiAgdmFyIHNlZ21lbnRzID0gdGhpcy5zZWdtZW50cywgcGFyYW1zID0gdGhpcy5wYXJhbXM7XG4gIGlmICghdmFsdWVzKSByZXR1cm4gc2VnbWVudHMuam9pbignJyk7XG5cbiAgdmFyIG5QYXRoID0gc2VnbWVudHMubGVuZ3RoLTEsIG5Ub3RhbCA9IHBhcmFtcy5sZW5ndGgsXG4gICAgcmVzdWx0ID0gc2VnbWVudHNbMF0sIGksIHNlYXJjaCwgdmFsdWU7XG5cbiAgZm9yIChpPTA7IGk8blBhdGg7IGkrKykge1xuICAgIHZhbHVlID0gdmFsdWVzW3BhcmFtc1tpXV07XG4gICAgLy8gVE9ETzogTWF5YmUgd2Ugc2hvdWxkIHRocm93IG9uIG51bGwgaGVyZT8gSXQncyBub3QgcmVhbGx5IGdvb2Qgc3R5bGUgdG8gdXNlICcnIGFuZCBudWxsIGludGVyY2hhbmdlYWJsZXlcbiAgICBpZiAodmFsdWUgIT0gbnVsbCkgcmVzdWx0ICs9IGVuY29kZVVSSUNvbXBvbmVudCh2YWx1ZSk7XG4gICAgcmVzdWx0ICs9IHNlZ21lbnRzW2krMV07XG4gIH1cbiAgZm9yICgvKiovOyBpPG5Ub3RhbDsgaSsrKSB7XG4gICAgdmFsdWUgPSB2YWx1ZXNbcGFyYW1zW2ldXTtcbiAgICBpZiAodmFsdWUgIT0gbnVsbCkge1xuICAgICAgcmVzdWx0ICs9IChzZWFyY2ggPyAnJicgOiAnPycpICsgcGFyYW1zW2ldICsgJz0nICsgZW5jb2RlVVJJQ29tcG9uZW50KHZhbHVlKTtcbiAgICAgIHNlYXJjaCA9IHRydWU7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn07XG5cblxuXG4vKipcbiAqIEBuZ2RvYyBvYmplY3RcbiAqIEBuYW1lIHVpLnJvdXRlci51dGlsLiR1cmxNYXRjaGVyRmFjdG9yeVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogRmFjdG9yeSBmb3Ige0BsaW5rIHVpLnJvdXRlci51dGlsLnR5cGU6VXJsTWF0Y2hlcn0gaW5zdGFuY2VzLiBUaGUgZmFjdG9yeSBpcyBhbHNvIGF2YWlsYWJsZSB0byBwcm92aWRlcnNcbiAqIHVuZGVyIHRoZSBuYW1lIGAkdXJsTWF0Y2hlckZhY3RvcnlQcm92aWRlcmAuXG4gKi9cbmZ1bmN0aW9uICRVcmxNYXRjaGVyRmFjdG9yeSgpIHtcblxuICAvKipcbiAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAqIEBuYW1lIHVpLnJvdXRlci51dGlsLiR1cmxNYXRjaGVyRmFjdG9yeSNjb21waWxlXG4gICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIudXRpbC4kdXJsTWF0Y2hlckZhY3RvcnlcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIENyZWF0ZXMgYSB7QGxpbmsgdWkucm91dGVyLnV0aWwudHlwZTpVcmxNYXRjaGVyfSBmb3IgdGhlIHNwZWNpZmllZCBwYXR0ZXJuLlxuICAgKiAgIFxuICAgKiBAcGFyYW0ge3N0cmluZ30gcGF0dGVybiAgVGhlIFVSTCBwYXR0ZXJuLlxuICAgKiBAcmV0dXJucyB7dWkucm91dGVyLnV0aWwudHlwZTpVcmxNYXRjaGVyfSAgVGhlIFVybE1hdGNoZXIuXG4gICAqL1xuICB0aGlzLmNvbXBpbGUgPSBmdW5jdGlvbiAocGF0dGVybikge1xuICAgIHJldHVybiBuZXcgVXJsTWF0Y2hlcihwYXR0ZXJuKTtcbiAgfTtcblxuICAvKipcbiAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAqIEBuYW1lIHVpLnJvdXRlci51dGlsLiR1cmxNYXRjaGVyRmFjdG9yeSNpc01hdGNoZXJcbiAgICogQG1ldGhvZE9mIHVpLnJvdXRlci51dGlsLiR1cmxNYXRjaGVyRmFjdG9yeVxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV0dXJucyB0cnVlIGlmIHRoZSBzcGVjaWZpZWQgb2JqZWN0IGlzIGEgVXJsTWF0Y2hlciwgb3IgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gb2JqZWN0ICBUaGUgb2JqZWN0IHRvIHBlcmZvcm0gdGhlIHR5cGUgY2hlY2sgYWdhaW5zdC5cbiAgICogQHJldHVybnMge0Jvb2xlYW59ICBSZXR1cm5zIGB0cnVlYCBpZiB0aGUgb2JqZWN0IGhhcyB0aGUgZm9sbG93aW5nIGZ1bmN0aW9uczogYGV4ZWNgLCBgZm9ybWF0YCwgYW5kIGBjb25jYXRgLlxuICAgKi9cbiAgdGhpcy5pc01hdGNoZXIgPSBmdW5jdGlvbiAobykge1xuICAgIHJldHVybiBpc09iamVjdChvKSAmJiBpc0Z1bmN0aW9uKG8uZXhlYykgJiYgaXNGdW5jdGlvbihvLmZvcm1hdCkgJiYgaXNGdW5jdGlvbihvLmNvbmNhdCk7XG4gIH07XG4gIFxuICAvKiBObyBuZWVkIHRvIGRvY3VtZW50ICRnZXQsIHNpbmNlIGl0IHJldHVybnMgdGhpcyAqL1xuICB0aGlzLiRnZXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH07XG59XG5cbi8vIFJlZ2lzdGVyIGFzIGEgcHJvdmlkZXIgc28gaXQncyBhdmFpbGFibGUgdG8gb3RoZXIgcHJvdmlkZXJzXG5hbmd1bGFyLm1vZHVsZSgndWkucm91dGVyLnV0aWwnKS5wcm92aWRlcignJHVybE1hdGNoZXJGYWN0b3J5JywgJFVybE1hdGNoZXJGYWN0b3J5KTtcblxuLyoqXG4gKiBAbmdkb2Mgb2JqZWN0XG4gKiBAbmFtZSB1aS5yb3V0ZXIucm91dGVyLiR1cmxSb3V0ZXJQcm92aWRlclxuICpcbiAqIEByZXF1aXJlcyB1aS5yb3V0ZXIudXRpbC4kdXJsTWF0Y2hlckZhY3RvcnlQcm92aWRlclxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogYCR1cmxSb3V0ZXJQcm92aWRlcmAgaGFzIHRoZSByZXNwb25zaWJpbGl0eSBvZiB3YXRjaGluZyBgJGxvY2F0aW9uYC4gXG4gKiBXaGVuIGAkbG9jYXRpb25gIGNoYW5nZXMgaXQgcnVucyB0aHJvdWdoIGEgbGlzdCBvZiBydWxlcyBvbmUgYnkgb25lIHVudGlsIGEgXG4gKiBtYXRjaCBpcyBmb3VuZC4gYCR1cmxSb3V0ZXJQcm92aWRlcmAgaXMgdXNlZCBiZWhpbmQgdGhlIHNjZW5lcyBhbnl0aW1lIHlvdSBzcGVjaWZ5IFxuICogYSB1cmwgaW4gYSBzdGF0ZSBjb25maWd1cmF0aW9uLiBBbGwgdXJscyBhcmUgY29tcGlsZWQgaW50byBhIFVybE1hdGNoZXIgb2JqZWN0LlxuICpcbiAqIFRoZXJlIGFyZSBzZXZlcmFsIG1ldGhvZHMgb24gYCR1cmxSb3V0ZXJQcm92aWRlcmAgdGhhdCBtYWtlIGl0IHVzZWZ1bCB0byB1c2UgZGlyZWN0bHlcbiAqIGluIHlvdXIgbW9kdWxlIGNvbmZpZy5cbiAqL1xuJFVybFJvdXRlclByb3ZpZGVyLiRpbmplY3QgPSBbJyR1cmxNYXRjaGVyRmFjdG9yeVByb3ZpZGVyJ107XG5mdW5jdGlvbiAkVXJsUm91dGVyUHJvdmlkZXIoICAkdXJsTWF0Y2hlckZhY3RvcnkpIHtcbiAgdmFyIHJ1bGVzID0gW10sIFxuICAgICAgb3RoZXJ3aXNlID0gbnVsbDtcblxuICAvLyBSZXR1cm5zIGEgc3RyaW5nIHRoYXQgaXMgYSBwcmVmaXggb2YgYWxsIHN0cmluZ3MgbWF0Y2hpbmcgdGhlIFJlZ0V4cFxuICBmdW5jdGlvbiByZWdFeHBQcmVmaXgocmUpIHtcbiAgICB2YXIgcHJlZml4ID0gL15cXF4oKD86XFxcXFteYS16QS1aMC05XXxbXlxcXFxcXFtcXF1cXF4kKis/LigpfHt9XSspKikvLmV4ZWMocmUuc291cmNlKTtcbiAgICByZXR1cm4gKHByZWZpeCAhPSBudWxsKSA/IHByZWZpeFsxXS5yZXBsYWNlKC9cXFxcKC4pL2csIFwiJDFcIikgOiAnJztcbiAgfVxuXG4gIC8vIEludGVycG9sYXRlcyBtYXRjaGVkIHZhbHVlcyBpbnRvIGEgU3RyaW5nLnJlcGxhY2UoKS1zdHlsZSBwYXR0ZXJuXG4gIGZ1bmN0aW9uIGludGVycG9sYXRlKHBhdHRlcm4sIG1hdGNoKSB7XG4gICAgcmV0dXJuIHBhdHRlcm4ucmVwbGFjZSgvXFwkKFxcJHxcXGR7MSwyfSkvLCBmdW5jdGlvbiAobSwgd2hhdCkge1xuICAgICAgcmV0dXJuIG1hdGNoW3doYXQgPT09ICckJyA/IDAgOiBOdW1iZXIod2hhdCldO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgKiBAbmFtZSB1aS5yb3V0ZXIucm91dGVyLiR1cmxSb3V0ZXJQcm92aWRlciNydWxlXG4gICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIucm91dGVyLiR1cmxSb3V0ZXJQcm92aWRlclxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogRGVmaW5lcyBydWxlcyB0aGF0IGFyZSB1c2VkIGJ5IGAkdXJsUm91dGVyUHJvdmlkZXIgdG8gZmluZCBtYXRjaGVzIGZvclxuICAgKiBzcGVjaWZpYyBVUkxzLlxuICAgKlxuICAgKiBAZXhhbXBsZVxuICAgKiA8cHJlPlxuICAgKiB2YXIgYXBwID0gYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsndWkucm91dGVyLnJvdXRlciddKTtcbiAgICpcbiAgICogYXBwLmNvbmZpZyhmdW5jdGlvbiAoJHVybFJvdXRlclByb3ZpZGVyKSB7XG4gICAqICAgLy8gSGVyZSdzIGFuIGV4YW1wbGUgb2YgaG93IHlvdSBtaWdodCBhbGxvdyBjYXNlIGluc2Vuc2l0aXZlIHVybHNcbiAgICogICAkdXJsUm91dGVyUHJvdmlkZXIucnVsZShmdW5jdGlvbiAoJGluamVjdG9yLCAkbG9jYXRpb24pIHtcbiAgICogICAgIHZhciBwYXRoID0gJGxvY2F0aW9uLnBhdGgoKSxcbiAgICogICAgICAgICBub3JtYWxpemVkID0gcGF0aC50b0xvd2VyQ2FzZSgpO1xuICAgKlxuICAgKiAgICAgaWYgKHBhdGggIT09IG5vcm1hbGl6ZWQpIHtcbiAgICogICAgICAgcmV0dXJuIG5vcm1hbGl6ZWQ7XG4gICAqICAgICB9XG4gICAqICAgfSk7XG4gICAqIH0pO1xuICAgKiA8L3ByZT5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IHJ1bGUgSGFuZGxlciBmdW5jdGlvbiB0aGF0IHRha2VzIGAkaW5qZWN0b3JgIGFuZCBgJGxvY2F0aW9uYFxuICAgKiBzZXJ2aWNlcyBhcyBhcmd1bWVudHMuIFlvdSBjYW4gdXNlIHRoZW0gdG8gcmV0dXJuIGEgdmFsaWQgcGF0aCBhcyBhIHN0cmluZy5cbiAgICpcbiAgICogQHJldHVybiB7b2JqZWN0fSAkdXJsUm91dGVyUHJvdmlkZXIgLSAkdXJsUm91dGVyUHJvdmlkZXIgaW5zdGFuY2VcbiAgICovXG4gIHRoaXMucnVsZSA9XG4gICAgZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgIGlmICghaXNGdW5jdGlvbihydWxlKSkgdGhyb3cgbmV3IEVycm9yKFwiJ3J1bGUnIG11c3QgYmUgYSBmdW5jdGlvblwiKTtcbiAgICAgIHJ1bGVzLnB1c2gocnVsZSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gIC8qKlxuICAgKiBAbmdkb2Mgb2JqZWN0XG4gICAqIEBuYW1lIHVpLnJvdXRlci5yb3V0ZXIuJHVybFJvdXRlclByb3ZpZGVyI290aGVyd2lzZVxuICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnJvdXRlci4kdXJsUm91dGVyUHJvdmlkZXJcbiAgICpcbiAgICogQGRlc2NyaXB0aW9uXG4gICAqIERlZmluZXMgYSBwYXRoIHRoYXQgaXMgdXNlZCB3aGVuIGFuIGludmFsaWVkIHJvdXRlIGlzIHJlcXVlc3RlZC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogPHByZT5cbiAgICogdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbJ3VpLnJvdXRlci5yb3V0ZXInXSk7XG4gICAqXG4gICAqIGFwcC5jb25maWcoZnVuY3Rpb24gKCR1cmxSb3V0ZXJQcm92aWRlcikge1xuICAgKiAgIC8vIGlmIHRoZSBwYXRoIGRvZXNuJ3QgbWF0Y2ggYW55IG9mIHRoZSB1cmxzIHlvdSBjb25maWd1cmVkXG4gICAqICAgLy8gb3RoZXJ3aXNlIHdpbGwgdGFrZSBjYXJlIG9mIHJvdXRpbmcgdGhlIHVzZXIgdG8gdGhlXG4gICAqICAgLy8gc3BlY2lmaWVkIHVybFxuICAgKiAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoJy9pbmRleCcpO1xuICAgKlxuICAgKiAgIC8vIEV4YW1wbGUgb2YgdXNpbmcgZnVuY3Rpb24gcnVsZSBhcyBwYXJhbVxuICAgKiAgICR1cmxSb3V0ZXJQcm92aWRlci5vdGhlcndpc2UoZnVuY3Rpb24gKCRpbmplY3RvciwgJGxvY2F0aW9uKSB7XG4gICAqICAgICAuLi5cbiAgICogICB9KTtcbiAgICogfSk7XG4gICAqIDwvcHJlPlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IHJ1bGUgVGhlIHVybCBwYXRoIHlvdSB3YW50IHRvIHJlZGlyZWN0IHRvIG9yIGEgZnVuY3Rpb24gXG4gICAqIHJ1bGUgdGhhdCByZXR1cm5zIHRoZSB1cmwgcGF0aC4gVGhlIGZ1bmN0aW9uIHZlcnNpb24gaXMgcGFzc2VkIHR3byBwYXJhbXM6IFxuICAgKiBgJGluamVjdG9yYCBhbmQgYCRsb2NhdGlvbmAgc2VydmljZXMuXG4gICAqXG4gICAqIEByZXR1cm4ge29iamVjdH0gJHVybFJvdXRlclByb3ZpZGVyIC0gJHVybFJvdXRlclByb3ZpZGVyIGluc3RhbmNlXG4gICAqL1xuICB0aGlzLm90aGVyd2lzZSA9XG4gICAgZnVuY3Rpb24gKHJ1bGUpIHtcbiAgICAgIGlmIChpc1N0cmluZyhydWxlKSkge1xuICAgICAgICB2YXIgcmVkaXJlY3QgPSBydWxlO1xuICAgICAgICBydWxlID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gcmVkaXJlY3Q7IH07XG4gICAgICB9XG4gICAgICBlbHNlIGlmICghaXNGdW5jdGlvbihydWxlKSkgdGhyb3cgbmV3IEVycm9yKFwiJ3J1bGUnIG11c3QgYmUgYSBmdW5jdGlvblwiKTtcbiAgICAgIG90aGVyd2lzZSA9IHJ1bGU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG5cbiAgZnVuY3Rpb24gaGFuZGxlSWZNYXRjaCgkaW5qZWN0b3IsIGhhbmRsZXIsIG1hdGNoKSB7XG4gICAgaWYgKCFtYXRjaCkgcmV0dXJuIGZhbHNlO1xuICAgIHZhciByZXN1bHQgPSAkaW5qZWN0b3IuaW52b2tlKGhhbmRsZXIsIGhhbmRsZXIsIHsgJG1hdGNoOiBtYXRjaCB9KTtcbiAgICByZXR1cm4gaXNEZWZpbmVkKHJlc3VsdCkgPyByZXN1bHQgOiB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgKiBAbmFtZSB1aS5yb3V0ZXIucm91dGVyLiR1cmxSb3V0ZXJQcm92aWRlciN3aGVuXG4gICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIucm91dGVyLiR1cmxSb3V0ZXJQcm92aWRlclxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVnaXN0ZXJzIGEgaGFuZGxlciBmb3IgYSBnaXZlbiB1cmwgbWF0Y2hpbmcuIGlmIGhhbmRsZSBpcyBhIHN0cmluZywgaXQgaXNcbiAgICogdHJlYXRlZCBhcyBhIHJlZGlyZWN0LCBhbmQgaXMgaW50ZXJwb2xhdGVkIGFjY29yZGluZyB0byB0aGUgc3l5bnRheCBvZiBtYXRjaFxuICAgKiAoaS5lLiBsaWtlIFN0cmluZy5yZXBsYWNlKCkgZm9yIFJlZ0V4cCwgb3IgbGlrZSBhIFVybE1hdGNoZXIgcGF0dGVybiBvdGhlcndpc2UpLlxuICAgKlxuICAgKiBJZiB0aGUgaGFuZGxlciBpcyBhIGZ1bmN0aW9uLCBpdCBpcyBpbmplY3RhYmxlLiBJdCBnZXRzIGludm9rZWQgaWYgYCRsb2NhdGlvbmBcbiAgICogbWF0Y2hlcy4gWW91IGhhdmUgdGhlIG9wdGlvbiBvZiBpbmplY3QgdGhlIG1hdGNoIG9iamVjdCBhcyBgJG1hdGNoYC5cbiAgICpcbiAgICogVGhlIGhhbmRsZXIgY2FuIHJldHVyblxuICAgKlxuICAgKiAtICoqZmFsc3kqKiB0byBpbmRpY2F0ZSB0aGF0IHRoZSBydWxlIGRpZG4ndCBtYXRjaCBhZnRlciBhbGwsIHRoZW4gYCR1cmxSb3V0ZXJgXG4gICAqICAgd2lsbCBjb250aW51ZSB0cnlpbmcgdG8gZmluZCBhbm90aGVyIG9uZSB0aGF0IG1hdGNoZXMuXG4gICAqIC0gKipzdHJpbmcqKiB3aGljaCBpcyB0cmVhdGVkIGFzIGEgcmVkaXJlY3QgYW5kIHBhc3NlZCB0byBgJGxvY2F0aW9uLnVybCgpYFxuICAgKiAtICoqdm9pZCoqIG9yIGFueSAqKnRydXRoeSoqIHZhbHVlIHRlbGxzIGAkdXJsUm91dGVyYCB0aGF0IHRoZSB1cmwgd2FzIGhhbmRsZWQuXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIDxwcmU+XG4gICAqIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyd1aS5yb3V0ZXIucm91dGVyJ10pO1xuICAgKlxuICAgKiBhcHAuY29uZmlnKGZ1bmN0aW9uICgkdXJsUm91dGVyUHJvdmlkZXIpIHtcbiAgICogICAkdXJsUm91dGVyUHJvdmlkZXIud2hlbigkc3RhdGUudXJsLCBmdW5jdGlvbiAoJG1hdGNoLCAkc3RhdGVQYXJhbXMpIHtcbiAgICogICAgIGlmICgkc3RhdGUuJGN1cnJlbnQubmF2aWdhYmxlICE9PSBzdGF0ZSB8fFxuICAgKiAgICAgICAgICFlcXVhbEZvcktleXMoJG1hdGNoLCAkc3RhdGVQYXJhbXMpIHtcbiAgICogICAgICAkc3RhdGUudHJhbnNpdGlvblRvKHN0YXRlLCAkbWF0Y2gsIGZhbHNlKTtcbiAgICogICAgIH1cbiAgICogICB9KTtcbiAgICogfSk7XG4gICAqIDwvcHJlPlxuICAgKlxuICAgKiBAcGFyYW0ge3N0cmluZ3xvYmplY3R9IHdoYXQgVGhlIGluY29taW5nIHBhdGggdGhhdCB5b3Ugd2FudCB0byByZWRpcmVjdC5cbiAgICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSBoYW5kbGVyIFRoZSBwYXRoIHlvdSB3YW50IHRvIHJlZGlyZWN0IHlvdXIgdXNlciB0by5cbiAgICovXG4gIHRoaXMud2hlbiA9XG4gICAgZnVuY3Rpb24gKHdoYXQsIGhhbmRsZXIpIHtcbiAgICAgIHZhciByZWRpcmVjdCwgaGFuZGxlcklzU3RyaW5nID0gaXNTdHJpbmcoaGFuZGxlcik7XG4gICAgICBpZiAoaXNTdHJpbmcod2hhdCkpIHdoYXQgPSAkdXJsTWF0Y2hlckZhY3RvcnkuY29tcGlsZSh3aGF0KTtcblxuICAgICAgaWYgKCFoYW5kbGVySXNTdHJpbmcgJiYgIWlzRnVuY3Rpb24oaGFuZGxlcikgJiYgIWlzQXJyYXkoaGFuZGxlcikpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcImludmFsaWQgJ2hhbmRsZXInIGluIHdoZW4oKVwiKTtcblxuICAgICAgdmFyIHN0cmF0ZWdpZXMgPSB7XG4gICAgICAgIG1hdGNoZXI6IGZ1bmN0aW9uICh3aGF0LCBoYW5kbGVyKSB7XG4gICAgICAgICAgaWYgKGhhbmRsZXJJc1N0cmluZykge1xuICAgICAgICAgICAgcmVkaXJlY3QgPSAkdXJsTWF0Y2hlckZhY3RvcnkuY29tcGlsZShoYW5kbGVyKTtcbiAgICAgICAgICAgIGhhbmRsZXIgPSBbJyRtYXRjaCcsIGZ1bmN0aW9uICgkbWF0Y2gpIHsgcmV0dXJuIHJlZGlyZWN0LmZvcm1hdCgkbWF0Y2gpOyB9XTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGV4dGVuZChmdW5jdGlvbiAoJGluamVjdG9yLCAkbG9jYXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVJZk1hdGNoKCRpbmplY3RvciwgaGFuZGxlciwgd2hhdC5leGVjKCRsb2NhdGlvbi5wYXRoKCksICRsb2NhdGlvbi5zZWFyY2goKSkpO1xuICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgIHByZWZpeDogaXNTdHJpbmcod2hhdC5wcmVmaXgpID8gd2hhdC5wcmVmaXggOiAnJ1xuICAgICAgICAgIH0pO1xuICAgICAgICB9LFxuICAgICAgICByZWdleDogZnVuY3Rpb24gKHdoYXQsIGhhbmRsZXIpIHtcbiAgICAgICAgICBpZiAod2hhdC5nbG9iYWwgfHwgd2hhdC5zdGlja3kpIHRocm93IG5ldyBFcnJvcihcIndoZW4oKSBSZWdFeHAgbXVzdCBub3QgYmUgZ2xvYmFsIG9yIHN0aWNreVwiKTtcblxuICAgICAgICAgIGlmIChoYW5kbGVySXNTdHJpbmcpIHtcbiAgICAgICAgICAgIHJlZGlyZWN0ID0gaGFuZGxlcjtcbiAgICAgICAgICAgIGhhbmRsZXIgPSBbJyRtYXRjaCcsIGZ1bmN0aW9uICgkbWF0Y2gpIHsgcmV0dXJuIGludGVycG9sYXRlKHJlZGlyZWN0LCAkbWF0Y2gpOyB9XTtcbiAgICAgICAgICB9XG4gICAgICAgICAgcmV0dXJuIGV4dGVuZChmdW5jdGlvbiAoJGluamVjdG9yLCAkbG9jYXRpb24pIHtcbiAgICAgICAgICAgIHJldHVybiBoYW5kbGVJZk1hdGNoKCRpbmplY3RvciwgaGFuZGxlciwgd2hhdC5leGVjKCRsb2NhdGlvbi5wYXRoKCkpKTtcbiAgICAgICAgICB9LCB7XG4gICAgICAgICAgICBwcmVmaXg6IHJlZ0V4cFByZWZpeCh3aGF0KVxuICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICB2YXIgY2hlY2sgPSB7IG1hdGNoZXI6ICR1cmxNYXRjaGVyRmFjdG9yeS5pc01hdGNoZXIod2hhdCksIHJlZ2V4OiB3aGF0IGluc3RhbmNlb2YgUmVnRXhwIH07XG5cbiAgICAgIGZvciAodmFyIG4gaW4gY2hlY2spIHtcbiAgICAgICAgaWYgKGNoZWNrW25dKSB7XG4gICAgICAgICAgcmV0dXJuIHRoaXMucnVsZShzdHJhdGVnaWVzW25dKHdoYXQsIGhhbmRsZXIpKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJpbnZhbGlkICd3aGF0JyBpbiB3aGVuKClcIik7XG4gICAgfTtcblxuICAvKipcbiAgICogQG5nZG9jIG9iamVjdFxuICAgKiBAbmFtZSB1aS5yb3V0ZXIucm91dGVyLiR1cmxSb3V0ZXJcbiAgICpcbiAgICogQHJlcXVpcmVzICRsb2NhdGlvblxuICAgKiBAcmVxdWlyZXMgJHJvb3RTY29wZVxuICAgKiBAcmVxdWlyZXMgJGluamVjdG9yXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKlxuICAgKi9cbiAgdGhpcy4kZ2V0ID1cbiAgICBbICAgICAgICAnJGxvY2F0aW9uJywgJyRyb290U2NvcGUnLCAnJGluamVjdG9yJyxcbiAgICBmdW5jdGlvbiAoJGxvY2F0aW9uLCAgICRyb290U2NvcGUsICAgJGluamVjdG9yKSB7XG4gICAgICAvLyBUT0RPOiBPcHRpbWl6ZSBncm91cHMgb2YgcnVsZXMgd2l0aCBub24tZW1wdHkgcHJlZml4IGludG8gc29tZSBzb3J0IG9mIGRlY2lzaW9uIHRyZWVcbiAgICAgIGZ1bmN0aW9uIHVwZGF0ZShldnQpIHtcbiAgICAgICAgaWYgKGV2dCAmJiBldnQuZGVmYXVsdFByZXZlbnRlZCkgcmV0dXJuO1xuICAgICAgICBmdW5jdGlvbiBjaGVjayhydWxlKSB7XG4gICAgICAgICAgdmFyIGhhbmRsZWQgPSBydWxlKCRpbmplY3RvciwgJGxvY2F0aW9uKTtcbiAgICAgICAgICBpZiAoaGFuZGxlZCkge1xuICAgICAgICAgICAgaWYgKGlzU3RyaW5nKGhhbmRsZWQpKSAkbG9jYXRpb24ucmVwbGFjZSgpLnVybChoYW5kbGVkKTtcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICAgIH1cbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIG49cnVsZXMubGVuZ3RoLCBpO1xuICAgICAgICBmb3IgKGk9MDsgaTxuOyBpKyspIHtcbiAgICAgICAgICBpZiAoY2hlY2socnVsZXNbaV0pKSByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gYWx3YXlzIGNoZWNrIG90aGVyd2lzZSBsYXN0IHRvIGFsbG93IGR5bmFtaWMgdXBkYXRlcyB0byB0aGUgc2V0IG9mIHJ1bGVzXG4gICAgICAgIGlmIChvdGhlcndpc2UpIGNoZWNrKG90aGVyd2lzZSk7XG4gICAgICB9XG5cbiAgICAgICRyb290U2NvcGUuJG9uKCckbG9jYXRpb25DaGFuZ2VTdWNjZXNzJywgdXBkYXRlKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgICAgICAgKiBAbmFtZSB1aS5yb3V0ZXIucm91dGVyLiR1cmxSb3V0ZXIjc3luY1xuICAgICAgICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnJvdXRlci4kdXJsUm91dGVyXG4gICAgICAgICAqXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBUcmlnZ2VycyBhbiB1cGRhdGU7IHRoZSBzYW1lIHVwZGF0ZSB0aGF0IGhhcHBlbnMgd2hlbiB0aGUgYWRkcmVzcyBiYXIgdXJsIGNoYW5nZXMsIGFrYSBgJGxvY2F0aW9uQ2hhbmdlU3VjY2Vzc2AuXG4gICAgICAgICAqIFRoaXMgbWV0aG9kIGlzIHVzZWZ1bCB3aGVuIHlvdSBuZWVkIHRvIHVzZSBgcHJldmVudERlZmF1bHQoKWAgb24gdGhlIGAkbG9jYXRpb25DaGFuZ2VTdWNjZXNzYCBldmVudCwgXG4gICAgICAgICAqIHBlcmZvcm0gc29tZSBjdXN0b20gbG9naWMgKHJvdXRlIHByb3RlY3Rpb24sIGF1dGgsIGNvbmZpZywgcmVkaXJlY3Rpb24sIGV0YykgYW5kIHRoZW4gZmluYWxseSBwcm9jZWVkIFxuICAgICAgICAgKiB3aXRoIHRoZSB0cmFuc2l0aW9uIGJ5IGNhbGxpbmcgYCR1cmxSb3V0ZXIuc3luYygpYC5cbiAgICAgICAgICpcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICogPHByZT5cbiAgICAgICAgICogYW5ndWxhci5tb2R1bGUoJ2FwcCcsIFsndWkucm91dGVyJ10pO1xuICAgICAgICAgKiAgIC5ydW4oZnVuY3Rpb24oJHJvb3RTY29wZSwgJHVybFJvdXRlcikge1xuICAgICAgICAgKiAgICAgJHJvb3RTY29wZS4kb24oJyRsb2NhdGlvbkNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgICogICAgICAgLy8gSGFsdCBzdGF0ZSBjaGFuZ2UgZnJvbSBldmVuIHN0YXJ0aW5nXG4gICAgICAgICAqICAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgKiAgICAgICAvLyBQZXJmb3JtIGN1c3RvbSBsb2dpY1xuICAgICAgICAgKiAgICAgICB2YXIgbWVldHNSZXF1aXJlbWVudCA9IC4uLlxuICAgICAgICAgKiAgICAgICAvLyBDb250aW51ZSB3aXRoIHRoZSB1cGRhdGUgYW5kIHN0YXRlIHRyYW5zaXRpb24gaWYgbG9naWMgYWxsb3dzXG4gICAgICAgICAqICAgICAgIGlmIChtZWV0c1JlcXVpcmVtZW50KSAkdXJsUm91dGVyLnN5bmMoKTtcbiAgICAgICAgICogICAgIH0pO1xuICAgICAgICAgKiB9KTtcbiAgICAgICAgICogPC9wcmU+XG4gICAgICAgICAqL1xuICAgICAgICBzeW5jOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgdXBkYXRlKCk7XG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfV07XG59XG5cbmFuZ3VsYXIubW9kdWxlKCd1aS5yb3V0ZXIucm91dGVyJykucHJvdmlkZXIoJyR1cmxSb3V0ZXInLCAkVXJsUm91dGVyUHJvdmlkZXIpO1xuXG4vKipcbiAqIEBuZ2RvYyBvYmplY3RcbiAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVQcm92aWRlclxuICpcbiAqIEByZXF1aXJlcyB1aS5yb3V0ZXIucm91dGVyLiR1cmxSb3V0ZXJQcm92aWRlclxuICogQHJlcXVpcmVzIHVpLnJvdXRlci51dGlsLiR1cmxNYXRjaGVyRmFjdG9yeVByb3ZpZGVyXG4gKiBAcmVxdWlyZXMgJGxvY2F0aW9uUHJvdmlkZXJcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIFRoZSBuZXcgYCRzdGF0ZVByb3ZpZGVyYCB3b3JrcyBzaW1pbGFyIHRvIEFuZ3VsYXIncyB2MSByb3V0ZXIsIGJ1dCBpdCBmb2N1c2VzIHB1cmVseVxuICogb24gc3RhdGUuXG4gKlxuICogQSBzdGF0ZSBjb3JyZXNwb25kcyB0byBhIFwicGxhY2VcIiBpbiB0aGUgYXBwbGljYXRpb24gaW4gdGVybXMgb2YgdGhlIG92ZXJhbGwgVUkgYW5kXG4gKiBuYXZpZ2F0aW9uLiBBIHN0YXRlIGRlc2NyaWJlcyAodmlhIHRoZSBjb250cm9sbGVyIC8gdGVtcGxhdGUgLyB2aWV3IHByb3BlcnRpZXMpIHdoYXRcbiAqIHRoZSBVSSBsb29rcyBsaWtlIGFuZCBkb2VzIGF0IHRoYXQgcGxhY2UuXG4gKlxuICogU3RhdGVzIG9mdGVuIGhhdmUgdGhpbmdzIGluIGNvbW1vbiwgYW5kIHRoZSBwcmltYXJ5IHdheSBvZiBmYWN0b3Jpbmcgb3V0IHRoZXNlXG4gKiBjb21tb25hbGl0aWVzIGluIHRoaXMgbW9kZWwgaXMgdmlhIHRoZSBzdGF0ZSBoaWVyYXJjaHksIGkuZS4gcGFyZW50L2NoaWxkIHN0YXRlcyBha2FcbiAqIG5lc3RlZCBzdGF0ZXMuXG4gKlxuICogVGhlIGAkc3RhdGVQcm92aWRlcmAgcHJvdmlkZXMgaW50ZXJmYWNlcyB0byBkZWNsYXJlIHRoZXNlIHN0YXRlcyBmb3IgeW91ciBhcHAuXG4gKi9cbiRTdGF0ZVByb3ZpZGVyLiRpbmplY3QgPSBbJyR1cmxSb3V0ZXJQcm92aWRlcicsICckdXJsTWF0Y2hlckZhY3RvcnlQcm92aWRlcicsICckbG9jYXRpb25Qcm92aWRlciddO1xuZnVuY3Rpb24gJFN0YXRlUHJvdmlkZXIoICAgJHVybFJvdXRlclByb3ZpZGVyLCAgICR1cmxNYXRjaGVyRmFjdG9yeSwgICAgICAgICAgICRsb2NhdGlvblByb3ZpZGVyKSB7XG5cbiAgdmFyIHJvb3QsIHN0YXRlcyA9IHt9LCAkc3RhdGUsIHF1ZXVlID0ge30sIGFic3RyYWN0S2V5ID0gJ2Fic3RyYWN0JztcblxuICAvLyBCdWlsZHMgc3RhdGUgcHJvcGVydGllcyBmcm9tIGRlZmluaXRpb24gcGFzc2VkIHRvIHJlZ2lzdGVyU3RhdGUoKVxuICB2YXIgc3RhdGVCdWlsZGVyID0ge1xuXG4gICAgLy8gRGVyaXZlIHBhcmVudCBzdGF0ZSBmcm9tIGEgaGllcmFyY2hpY2FsIG5hbWUgb25seSBpZiAncGFyZW50JyBpcyBub3QgZXhwbGljaXRseSBkZWZpbmVkLlxuICAgIC8vIHN0YXRlLmNoaWxkcmVuID0gW107XG4gICAgLy8gaWYgKHBhcmVudCkgcGFyZW50LmNoaWxkcmVuLnB1c2goc3RhdGUpO1xuICAgIHBhcmVudDogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgIGlmIChpc0RlZmluZWQoc3RhdGUucGFyZW50KSAmJiBzdGF0ZS5wYXJlbnQpIHJldHVybiBmaW5kU3RhdGUoc3RhdGUucGFyZW50KTtcbiAgICAgIC8vIHJlZ2V4IG1hdGNoZXMgYW55IHZhbGlkIGNvbXBvc2l0ZSBzdGF0ZSBuYW1lXG4gICAgICAvLyB3b3VsZCBtYXRjaCBcImNvbnRhY3QubGlzdFwiIGJ1dCBub3QgXCJjb250YWN0c1wiXG4gICAgICB2YXIgY29tcG9zaXRlTmFtZSA9IC9eKC4rKVxcLlteLl0rJC8uZXhlYyhzdGF0ZS5uYW1lKTtcbiAgICAgIHJldHVybiBjb21wb3NpdGVOYW1lID8gZmluZFN0YXRlKGNvbXBvc2l0ZU5hbWVbMV0pIDogcm9vdDtcbiAgICB9LFxuXG4gICAgLy8gaW5oZXJpdCAnZGF0YScgZnJvbSBwYXJlbnQgYW5kIG92ZXJyaWRlIGJ5IG93biB2YWx1ZXMgKGlmIGFueSlcbiAgICBkYXRhOiBmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgaWYgKHN0YXRlLnBhcmVudCAmJiBzdGF0ZS5wYXJlbnQuZGF0YSkge1xuICAgICAgICBzdGF0ZS5kYXRhID0gc3RhdGUuc2VsZi5kYXRhID0gZXh0ZW5kKHt9LCBzdGF0ZS5wYXJlbnQuZGF0YSwgc3RhdGUuZGF0YSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gc3RhdGUuZGF0YTtcbiAgICB9LFxuXG4gICAgLy8gQnVpbGQgYSBVUkxNYXRjaGVyIGlmIG5lY2Vzc2FyeSwgZWl0aGVyIHZpYSBhIHJlbGF0aXZlIG9yIGFic29sdXRlIFVSTFxuICAgIHVybDogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgIHZhciB1cmwgPSBzdGF0ZS51cmw7XG5cbiAgICAgIGlmIChpc1N0cmluZyh1cmwpKSB7XG4gICAgICAgIGlmICh1cmwuY2hhckF0KDApID09ICdeJykge1xuICAgICAgICAgIHJldHVybiAkdXJsTWF0Y2hlckZhY3RvcnkuY29tcGlsZSh1cmwuc3Vic3RyaW5nKDEpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKHN0YXRlLnBhcmVudC5uYXZpZ2FibGUgfHwgcm9vdCkudXJsLmNvbmNhdCh1cmwpO1xuICAgICAgfVxuXG4gICAgICBpZiAoJHVybE1hdGNoZXJGYWN0b3J5LmlzTWF0Y2hlcih1cmwpIHx8IHVybCA9PSBudWxsKSB7XG4gICAgICAgIHJldHVybiB1cmw7XG4gICAgICB9XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHVybCAnXCIgKyB1cmwgKyBcIicgaW4gc3RhdGUgJ1wiICsgc3RhdGUgKyBcIidcIik7XG4gICAgfSxcblxuICAgIC8vIEtlZXAgdHJhY2sgb2YgdGhlIGNsb3Nlc3QgYW5jZXN0b3Igc3RhdGUgdGhhdCBoYXMgYSBVUkwgKGkuZS4gaXMgbmF2aWdhYmxlKVxuICAgIG5hdmlnYWJsZTogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgIHJldHVybiBzdGF0ZS51cmwgPyBzdGF0ZSA6IChzdGF0ZS5wYXJlbnQgPyBzdGF0ZS5wYXJlbnQubmF2aWdhYmxlIDogbnVsbCk7XG4gICAgfSxcblxuICAgIC8vIERlcml2ZSBwYXJhbWV0ZXJzIGZvciB0aGlzIHN0YXRlIGFuZCBlbnN1cmUgdGhleSdyZSBhIHN1cGVyLXNldCBvZiBwYXJlbnQncyBwYXJhbWV0ZXJzXG4gICAgcGFyYW1zOiBmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgaWYgKCFzdGF0ZS5wYXJhbXMpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlLnVybCA/IHN0YXRlLnVybC5wYXJhbWV0ZXJzKCkgOiBzdGF0ZS5wYXJlbnQucGFyYW1zO1xuICAgICAgfVxuICAgICAgaWYgKCFpc0FycmF5KHN0YXRlLnBhcmFtcykpIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgcGFyYW1zIGluIHN0YXRlICdcIiArIHN0YXRlICsgXCInXCIpO1xuICAgICAgaWYgKHN0YXRlLnVybCkgdGhyb3cgbmV3IEVycm9yKFwiQm90aCBwYXJhbXMgYW5kIHVybCBzcGVjaWNpZmllZCBpbiBzdGF0ZSAnXCIgKyBzdGF0ZSArIFwiJ1wiKTtcbiAgICAgIHJldHVybiBzdGF0ZS5wYXJhbXM7XG4gICAgfSxcblxuICAgIC8vIElmIHRoZXJlIGlzIG5vIGV4cGxpY2l0IG11bHRpLXZpZXcgY29uZmlndXJhdGlvbiwgbWFrZSBvbmUgdXAgc28gd2UgZG9uJ3QgaGF2ZVxuICAgIC8vIHRvIGhhbmRsZSBib3RoIGNhc2VzIGluIHRoZSB2aWV3IGRpcmVjdGl2ZSBsYXRlci4gTm90ZSB0aGF0IGhhdmluZyBhbiBleHBsaWNpdFxuICAgIC8vICd2aWV3cycgcHJvcGVydHkgd2lsbCBtZWFuIHRoZSBkZWZhdWx0IHVubmFtZWQgdmlldyBwcm9wZXJ0aWVzIGFyZSBpZ25vcmVkLiBUaGlzXG4gICAgLy8gaXMgYWxzbyBhIGdvb2QgdGltZSB0byByZXNvbHZlIHZpZXcgbmFtZXMgdG8gYWJzb2x1dGUgbmFtZXMsIHNvIGV2ZXJ5dGhpbmcgaXMgYVxuICAgIC8vIHN0cmFpZ2h0IGxvb2t1cCBhdCBsaW5rIHRpbWUuXG4gICAgdmlld3M6IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICB2YXIgdmlld3MgPSB7fTtcblxuICAgICAgZm9yRWFjaChpc0RlZmluZWQoc3RhdGUudmlld3MpID8gc3RhdGUudmlld3MgOiB7ICcnOiBzdGF0ZSB9LCBmdW5jdGlvbiAodmlldywgbmFtZSkge1xuICAgICAgICBpZiAobmFtZS5pbmRleE9mKCdAJykgPCAwKSBuYW1lICs9ICdAJyArIHN0YXRlLnBhcmVudC5uYW1lO1xuICAgICAgICB2aWV3c1tuYW1lXSA9IHZpZXc7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiB2aWV3cztcbiAgICB9LFxuXG4gICAgb3duUGFyYW1zOiBmdW5jdGlvbihzdGF0ZSkge1xuICAgICAgaWYgKCFzdGF0ZS5wYXJlbnQpIHtcbiAgICAgICAgcmV0dXJuIHN0YXRlLnBhcmFtcztcbiAgICAgIH1cbiAgICAgIHZhciBwYXJhbU5hbWVzID0ge307IGZvckVhY2goc3RhdGUucGFyYW1zLCBmdW5jdGlvbiAocCkgeyBwYXJhbU5hbWVzW3BdID0gdHJ1ZTsgfSk7XG5cbiAgICAgIGZvckVhY2goc3RhdGUucGFyZW50LnBhcmFtcywgZnVuY3Rpb24gKHApIHtcbiAgICAgICAgaWYgKCFwYXJhbU5hbWVzW3BdKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiTWlzc2luZyByZXF1aXJlZCBwYXJhbWV0ZXIgJ1wiICsgcCArIFwiJyBpbiBzdGF0ZSAnXCIgKyBzdGF0ZS5uYW1lICsgXCInXCIpO1xuICAgICAgICB9XG4gICAgICAgIHBhcmFtTmFtZXNbcF0gPSBmYWxzZTtcbiAgICAgIH0pO1xuICAgICAgdmFyIG93blBhcmFtcyA9IFtdO1xuXG4gICAgICBmb3JFYWNoKHBhcmFtTmFtZXMsIGZ1bmN0aW9uIChvd24sIHApIHtcbiAgICAgICAgaWYgKG93bikgb3duUGFyYW1zLnB1c2gocCk7XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBvd25QYXJhbXM7XG4gICAgfSxcblxuICAgIC8vIEtlZXAgYSBmdWxsIHBhdGggZnJvbSB0aGUgcm9vdCBkb3duIHRvIHRoaXMgc3RhdGUgYXMgdGhpcyBpcyBuZWVkZWQgZm9yIHN0YXRlIGFjdGl2YXRpb24uXG4gICAgcGF0aDogZnVuY3Rpb24oc3RhdGUpIHtcbiAgICAgIHJldHVybiBzdGF0ZS5wYXJlbnQgPyBzdGF0ZS5wYXJlbnQucGF0aC5jb25jYXQoc3RhdGUpIDogW107IC8vIGV4Y2x1ZGUgcm9vdCBmcm9tIHBhdGhcbiAgICB9LFxuXG4gICAgLy8gU3BlZWQgdXAgJHN0YXRlLmNvbnRhaW5zKCkgYXMgaXQncyB1c2VkIGEgbG90XG4gICAgaW5jbHVkZXM6IGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgICB2YXIgaW5jbHVkZXMgPSBzdGF0ZS5wYXJlbnQgPyBleHRlbmQoe30sIHN0YXRlLnBhcmVudC5pbmNsdWRlcykgOiB7fTtcbiAgICAgIGluY2x1ZGVzW3N0YXRlLm5hbWVdID0gdHJ1ZTtcbiAgICAgIHJldHVybiBpbmNsdWRlcztcbiAgICB9LFxuXG4gICAgJGRlbGVnYXRlczoge31cbiAgfTtcblxuICBmdW5jdGlvbiBpc1JlbGF0aXZlKHN0YXRlTmFtZSkge1xuICAgIHJldHVybiBzdGF0ZU5hbWUuaW5kZXhPZihcIi5cIikgPT09IDAgfHwgc3RhdGVOYW1lLmluZGV4T2YoXCJeXCIpID09PSAwO1xuICB9XG5cbiAgZnVuY3Rpb24gZmluZFN0YXRlKHN0YXRlT3JOYW1lLCBiYXNlKSB7XG4gICAgdmFyIGlzU3RyID0gaXNTdHJpbmcoc3RhdGVPck5hbWUpLFxuICAgICAgICBuYW1lICA9IGlzU3RyID8gc3RhdGVPck5hbWUgOiBzdGF0ZU9yTmFtZS5uYW1lLFxuICAgICAgICBwYXRoICA9IGlzUmVsYXRpdmUobmFtZSk7XG5cbiAgICBpZiAocGF0aCkge1xuICAgICAgaWYgKCFiYXNlKSB0aHJvdyBuZXcgRXJyb3IoXCJObyByZWZlcmVuY2UgcG9pbnQgZ2l2ZW4gZm9yIHBhdGggJ1wiICArIG5hbWUgKyBcIidcIik7XG4gICAgICB2YXIgcmVsID0gbmFtZS5zcGxpdChcIi5cIiksIGkgPSAwLCBwYXRoTGVuZ3RoID0gcmVsLmxlbmd0aCwgY3VycmVudCA9IGJhc2U7XG5cbiAgICAgIGZvciAoOyBpIDwgcGF0aExlbmd0aDsgaSsrKSB7XG4gICAgICAgIGlmIChyZWxbaV0gPT09IFwiXCIgJiYgaSA9PT0gMCkge1xuICAgICAgICAgIGN1cnJlbnQgPSBiYXNlO1xuICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZWxbaV0gPT09IFwiXlwiKSB7XG4gICAgICAgICAgaWYgKCFjdXJyZW50LnBhcmVudCkgdGhyb3cgbmV3IEVycm9yKFwiUGF0aCAnXCIgKyBuYW1lICsgXCInIG5vdCB2YWxpZCBmb3Igc3RhdGUgJ1wiICsgYmFzZS5uYW1lICsgXCInXCIpO1xuICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnBhcmVudDtcbiAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgfVxuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICAgIHJlbCA9IHJlbC5zbGljZShpKS5qb2luKFwiLlwiKTtcbiAgICAgIG5hbWUgPSBjdXJyZW50Lm5hbWUgKyAoY3VycmVudC5uYW1lICYmIHJlbCA/IFwiLlwiIDogXCJcIikgKyByZWw7XG4gICAgfVxuICAgIHZhciBzdGF0ZSA9IHN0YXRlc1tuYW1lXTtcblxuICAgIGlmIChzdGF0ZSAmJiAoaXNTdHIgfHwgKCFpc1N0ciAmJiAoc3RhdGUgPT09IHN0YXRlT3JOYW1lIHx8IHN0YXRlLnNlbGYgPT09IHN0YXRlT3JOYW1lKSkpKSB7XG4gICAgICByZXR1cm4gc3RhdGU7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBmdW5jdGlvbiBxdWV1ZVN0YXRlKHBhcmVudE5hbWUsIHN0YXRlKSB7XG4gICAgaWYgKCFxdWV1ZVtwYXJlbnROYW1lXSkge1xuICAgICAgcXVldWVbcGFyZW50TmFtZV0gPSBbXTtcbiAgICB9XG4gICAgcXVldWVbcGFyZW50TmFtZV0ucHVzaChzdGF0ZSk7XG4gIH1cblxuICBmdW5jdGlvbiByZWdpc3RlclN0YXRlKHN0YXRlKSB7XG4gICAgLy8gV3JhcCBhIG5ldyBvYmplY3QgYXJvdW5kIHRoZSBzdGF0ZSBzbyB3ZSBjYW4gc3RvcmUgb3VyIHByaXZhdGUgZGV0YWlscyBlYXNpbHkuXG4gICAgc3RhdGUgPSBpbmhlcml0KHN0YXRlLCB7XG4gICAgICBzZWxmOiBzdGF0ZSxcbiAgICAgIHJlc29sdmU6IHN0YXRlLnJlc29sdmUgfHwge30sXG4gICAgICB0b1N0cmluZzogZnVuY3Rpb24oKSB7IHJldHVybiB0aGlzLm5hbWU7IH1cbiAgICB9KTtcblxuICAgIHZhciBuYW1lID0gc3RhdGUubmFtZTtcbiAgICBpZiAoIWlzU3RyaW5nKG5hbWUpIHx8IG5hbWUuaW5kZXhPZignQCcpID49IDApIHRocm93IG5ldyBFcnJvcihcIlN0YXRlIG11c3QgaGF2ZSBhIHZhbGlkIG5hbWVcIik7XG4gICAgaWYgKHN0YXRlcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkgdGhyb3cgbmV3IEVycm9yKFwiU3RhdGUgJ1wiICsgbmFtZSArIFwiJycgaXMgYWxyZWFkeSBkZWZpbmVkXCIpO1xuXG4gICAgLy8gR2V0IHBhcmVudCBuYW1lXG4gICAgdmFyIHBhcmVudE5hbWUgPSAobmFtZS5pbmRleE9mKCcuJykgIT09IC0xKSA/IG5hbWUuc3Vic3RyaW5nKDAsIG5hbWUubGFzdEluZGV4T2YoJy4nKSlcbiAgICAgICAgOiAoaXNTdHJpbmcoc3RhdGUucGFyZW50KSkgPyBzdGF0ZS5wYXJlbnRcbiAgICAgICAgOiAnJztcblxuICAgIC8vIElmIHBhcmVudCBpcyBub3QgcmVnaXN0ZXJlZCB5ZXQsIGFkZCBzdGF0ZSB0byBxdWV1ZSBhbmQgcmVnaXN0ZXIgbGF0ZXJcbiAgICBpZiAocGFyZW50TmFtZSAmJiAhc3RhdGVzW3BhcmVudE5hbWVdKSB7XG4gICAgICByZXR1cm4gcXVldWVTdGF0ZShwYXJlbnROYW1lLCBzdGF0ZS5zZWxmKTtcbiAgICB9XG5cbiAgICBmb3IgKHZhciBrZXkgaW4gc3RhdGVCdWlsZGVyKSB7XG4gICAgICBpZiAoaXNGdW5jdGlvbihzdGF0ZUJ1aWxkZXJba2V5XSkpIHN0YXRlW2tleV0gPSBzdGF0ZUJ1aWxkZXJba2V5XShzdGF0ZSwgc3RhdGVCdWlsZGVyLiRkZWxlZ2F0ZXNba2V5XSk7XG4gICAgfVxuICAgIHN0YXRlc1tuYW1lXSA9IHN0YXRlO1xuXG4gICAgLy8gUmVnaXN0ZXIgdGhlIHN0YXRlIGluIHRoZSBnbG9iYWwgc3RhdGUgbGlzdCBhbmQgd2l0aCAkdXJsUm91dGVyIGlmIG5lY2Vzc2FyeS5cbiAgICBpZiAoIXN0YXRlW2Fic3RyYWN0S2V5XSAmJiBzdGF0ZS51cmwpIHtcbiAgICAgICR1cmxSb3V0ZXJQcm92aWRlci53aGVuKHN0YXRlLnVybCwgWyckbWF0Y2gnLCAnJHN0YXRlUGFyYW1zJywgZnVuY3Rpb24gKCRtYXRjaCwgJHN0YXRlUGFyYW1zKSB7XG4gICAgICAgIGlmICgkc3RhdGUuJGN1cnJlbnQubmF2aWdhYmxlICE9IHN0YXRlIHx8ICFlcXVhbEZvcktleXMoJG1hdGNoLCAkc3RhdGVQYXJhbXMpKSB7XG4gICAgICAgICAgJHN0YXRlLnRyYW5zaXRpb25UbyhzdGF0ZSwgJG1hdGNoLCB7IGxvY2F0aW9uOiBmYWxzZSB9KTtcbiAgICAgICAgfVxuICAgICAgfV0pO1xuICAgIH1cblxuICAgIC8vIFJlZ2lzdGVyIGFueSBxdWV1ZWQgY2hpbGRyZW5cbiAgICBpZiAocXVldWVbbmFtZV0pIHtcbiAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcXVldWVbbmFtZV0ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgcmVnaXN0ZXJTdGF0ZShxdWV1ZVtuYW1lXVtpXSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHN0YXRlO1xuICB9XG5cbiAgLy8gQ2hlY2tzIHRleHQgdG8gc2VlIGlmIGl0IGxvb2tzIGxpa2UgYSBnbG9iLlxuICBmdW5jdGlvbiBpc0dsb2IgKHRleHQpIHtcbiAgICByZXR1cm4gdGV4dC5pbmRleE9mKCcqJykgPiAtMTtcbiAgfVxuXG4gIC8vIFJldHVybnMgdHJ1ZSBpZiBnbG9iIG1hdGNoZXMgY3VycmVudCAkc3RhdGUgbmFtZS5cbiAgZnVuY3Rpb24gZG9lc1N0YXRlTWF0Y2hHbG9iIChnbG9iKSB7XG4gICAgdmFyIGdsb2JTZWdtZW50cyA9IGdsb2Iuc3BsaXQoJy4nKSxcbiAgICAgICAgc2VnbWVudHMgPSAkc3RhdGUuJGN1cnJlbnQubmFtZS5zcGxpdCgnLicpO1xuXG4gICAgLy9tYXRjaCBncmVlZHkgc3RhcnRzXG4gICAgaWYgKGdsb2JTZWdtZW50c1swXSA9PT0gJyoqJykge1xuICAgICAgIHNlZ21lbnRzID0gc2VnbWVudHMuc2xpY2Uoc2VnbWVudHMuaW5kZXhPZihnbG9iU2VnbWVudHNbMV0pKTtcbiAgICAgICBzZWdtZW50cy51bnNoaWZ0KCcqKicpO1xuICAgIH1cbiAgICAvL21hdGNoIGdyZWVkeSBlbmRzXG4gICAgaWYgKGdsb2JTZWdtZW50c1tnbG9iU2VnbWVudHMubGVuZ3RoIC0gMV0gPT09ICcqKicpIHtcbiAgICAgICBzZWdtZW50cy5zcGxpY2Uoc2VnbWVudHMuaW5kZXhPZihnbG9iU2VnbWVudHNbZ2xvYlNlZ21lbnRzLmxlbmd0aCAtIDJdKSArIDEsIE51bWJlci5NQVhfVkFMVUUpO1xuICAgICAgIHNlZ21lbnRzLnB1c2goJyoqJyk7XG4gICAgfVxuXG4gICAgaWYgKGdsb2JTZWdtZW50cy5sZW5ndGggIT0gc2VnbWVudHMubGVuZ3RoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgLy9tYXRjaCBzaW5nbGUgc3RhcnNcbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGdsb2JTZWdtZW50cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgIGlmIChnbG9iU2VnbWVudHNbaV0gPT09ICcqJykge1xuICAgICAgICBzZWdtZW50c1tpXSA9ICcqJztcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gc2VnbWVudHMuam9pbignJykgPT09IGdsb2JTZWdtZW50cy5qb2luKCcnKTtcbiAgfVxuXG5cbiAgLy8gSW1wbGljaXQgcm9vdCBzdGF0ZSB0aGF0IGlzIGFsd2F5cyBhY3RpdmVcbiAgcm9vdCA9IHJlZ2lzdGVyU3RhdGUoe1xuICAgIG5hbWU6ICcnLFxuICAgIHVybDogJ14nLFxuICAgIHZpZXdzOiBudWxsLFxuICAgICdhYnN0cmFjdCc6IHRydWVcbiAgfSk7XG4gIHJvb3QubmF2aWdhYmxlID0gbnVsbDtcblxuXG4gIC8qKlxuICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICogQG5hbWUgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVByb3ZpZGVyI2RlY29yYXRvclxuICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVByb3ZpZGVyXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBBbGxvd3MgeW91IHRvIGV4dGVuZCAoY2FyZWZ1bGx5KSBvciBvdmVycmlkZSAoYXQgeW91ciBvd24gcGVyaWwpIHRoZSBcbiAgICogYHN0YXRlQnVpbGRlcmAgb2JqZWN0IHVzZWQgaW50ZXJuYWxseSBieSBgJHN0YXRlUHJvdmlkZXJgLiBUaGlzIGNhbiBiZSB1c2VkIFxuICAgKiB0byBhZGQgY3VzdG9tIGZ1bmN0aW9uYWxpdHkgdG8gdWktcm91dGVyLCBmb3IgZXhhbXBsZSBpbmZlcnJpbmcgdGVtcGxhdGVVcmwgXG4gICAqIGJhc2VkIG9uIHRoZSBzdGF0ZSBuYW1lLlxuICAgKlxuICAgKiBXaGVuIHBhc3Npbmcgb25seSBhIG5hbWUsIGl0IHJldHVybnMgdGhlIGN1cnJlbnQgKG9yaWdpbmFsIG9yIGRlY29yYXRlZCkgYnVpbGRlclxuICAgKiBmdW5jdGlvbiB0aGF0IG1hdGNoZXMgYG5hbWVgLlxuICAgKlxuICAgKiBUaGUgYnVpbGRlciBmdW5jdGlvbnMgdGhhdCBjYW4gYmUgZGVjb3JhdGVkIGFyZSBsaXN0ZWQgYmVsb3cuIFRob3VnaCBub3QgYWxsXG4gICAqIG5lY2Vzc2FyaWx5IGhhdmUgYSBnb29kIHVzZSBjYXNlIGZvciBkZWNvcmF0aW9uLCB0aGF0IGlzIHVwIHRvIHlvdSB0byBkZWNpZGUuXG4gICAqXG4gICAqIEluIGFkZGl0aW9uLCB1c2VycyBjYW4gYXR0YWNoIGN1c3RvbSBkZWNvcmF0b3JzLCB3aGljaCB3aWxsIGdlbmVyYXRlIG5ldyBcbiAgICogcHJvcGVydGllcyB3aXRoaW4gdGhlIHN0YXRlJ3MgaW50ZXJuYWwgZGVmaW5pdGlvbi4gVGhlcmUgaXMgY3VycmVudGx5IG5vIGNsZWFyIFxuICAgKiB1c2UtY2FzZSBmb3IgdGhpcyBiZXlvbmQgYWNjZXNzaW5nIGludGVybmFsIHN0YXRlcyAoaS5lLiAkc3RhdGUuJGN1cnJlbnQpLCBcbiAgICogaG93ZXZlciwgZXhwZWN0IHRoaXMgdG8gYmVjb21lIGluY3JlYXNpbmdseSByZWxldmFudCBhcyB3ZSBpbnRyb2R1Y2UgYWRkaXRpb25hbCBcbiAgICogbWV0YS1wcm9ncmFtbWluZyBmZWF0dXJlcy5cbiAgICpcbiAgICogKipXYXJuaW5nKio6IERlY29yYXRvcnMgc2hvdWxkIG5vdCBiZSBpbnRlcmRlcGVuZGVudCBiZWNhdXNlIHRoZSBvcmRlciBvZiBcbiAgICogZXhlY3V0aW9uIG9mIHRoZSBidWlsZGVyIGZ1bmN0aW9ucyBpbiBub24tZGV0ZXJtaW5pc3RpYy4gQnVpbGRlciBmdW5jdGlvbnMgXG4gICAqIHNob3VsZCBvbmx5IGJlIGRlcGVuZGVudCBvbiB0aGUgc3RhdGUgZGVmaW5pdGlvbiBvYmplY3QgYW5kIHN1cGVyIGZ1bmN0aW9uLlxuICAgKlxuICAgKlxuICAgKiBFeGlzdGluZyBidWlsZGVyIGZ1bmN0aW9ucyBhbmQgY3VycmVudCByZXR1cm4gdmFsdWVzOlxuICAgKlxuICAgKiAtICoqcGFyZW50KiogYHtvYmplY3R9YCAtIHJldHVybnMgdGhlIHBhcmVudCBzdGF0ZSBvYmplY3QuXG4gICAqIC0gKipkYXRhKiogYHtvYmplY3R9YCAtIHJldHVybnMgc3RhdGUgZGF0YSwgaW5jbHVkaW5nIGFueSBpbmhlcml0ZWQgZGF0YSB0aGF0IGlzIG5vdFxuICAgKiAgIG92ZXJyaWRkZW4gYnkgb3duIHZhbHVlcyAoaWYgYW55KS5cbiAgICogLSAqKnVybCoqIGB7b2JqZWN0fWAgLSByZXR1cm5zIGEge2xpbmsgdWkucm91dGVyLnV0aWwudHlwZTpVcmxNYXRjaGVyfSBvciBudWxsLlxuICAgKiAtICoqbmF2aWdhYmxlKiogYHtvYmplY3R9YCAtIHJldHVybnMgY2xvc2VzdCBhbmNlc3RvciBzdGF0ZSB0aGF0IGhhcyBhIFVSTCAoYWthIGlzIFxuICAgKiAgIG5hdmlnYWJsZSkuXG4gICAqIC0gKipwYXJhbXMqKiBge29iamVjdH1gIC0gcmV0dXJucyBhbiBhcnJheSBvZiBzdGF0ZSBwYXJhbXMgdGhhdCBhcmUgZW5zdXJlZCB0byBcbiAgICogICBiZSBhIHN1cGVyLXNldCBvZiBwYXJlbnQncyBwYXJhbXMuXG4gICAqIC0gKip2aWV3cyoqIGB7b2JqZWN0fWAgLSByZXR1cm5zIGEgdmlld3Mgb2JqZWN0IHdoZXJlIGVhY2gga2V5IGlzIGFuIGFic29sdXRlIHZpZXcgXG4gICAqICAgbmFtZSAoaS5lLiBcInZpZXdOYW1lQHN0YXRlTmFtZVwiKSBhbmQgZWFjaCB2YWx1ZSBpcyB0aGUgY29uZmlnIG9iamVjdCBcbiAgICogICAodGVtcGxhdGUsIGNvbnRyb2xsZXIpIGZvciB0aGUgdmlldy4gRXZlbiB3aGVuIHlvdSBkb24ndCB1c2UgdGhlIHZpZXdzIG9iamVjdCBcbiAgICogICBleHBsaWNpdGx5IG9uIGEgc3RhdGUgY29uZmlnLCBvbmUgaXMgc3RpbGwgY3JlYXRlZCBmb3IgeW91IGludGVybmFsbHkuXG4gICAqICAgU28gYnkgZGVjb3JhdGluZyB0aGlzIGJ1aWxkZXIgZnVuY3Rpb24geW91IGhhdmUgYWNjZXNzIHRvIGRlY29yYXRpbmcgdGVtcGxhdGUgXG4gICAqICAgYW5kIGNvbnRyb2xsZXIgcHJvcGVydGllcy5cbiAgICogLSAqKm93blBhcmFtcyoqIGB7b2JqZWN0fWAgLSByZXR1cm5zIGFuIGFycmF5IG9mIHBhcmFtcyB0aGF0IGJlbG9uZyB0byB0aGUgc3RhdGUsIFxuICAgKiAgIG5vdCBpbmNsdWRpbmcgYW55IHBhcmFtcyBkZWZpbmVkIGJ5IGFuY2VzdG9yIHN0YXRlcy5cbiAgICogLSAqKnBhdGgqKiBge3N0cmluZ31gIC0gcmV0dXJucyB0aGUgZnVsbCBwYXRoIGZyb20gdGhlIHJvb3QgZG93biB0byB0aGlzIHN0YXRlLiBcbiAgICogICBOZWVkZWQgZm9yIHN0YXRlIGFjdGl2YXRpb24uXG4gICAqIC0gKippbmNsdWRlcyoqIGB7b2JqZWN0fWAgLSByZXR1cm5zIGFuIG9iamVjdCB0aGF0IGluY2x1ZGVzIGV2ZXJ5IHN0YXRlIHRoYXQgXG4gICAqICAgd291bGQgcGFzcyBhICckc3RhdGUuaW5jbHVkZXMoKScgdGVzdC5cbiAgICpcbiAgICogQGV4YW1wbGVcbiAgICogPHByZT5cbiAgICogLy8gT3ZlcnJpZGUgdGhlIGludGVybmFsICd2aWV3cycgYnVpbGRlciB3aXRoIGEgZnVuY3Rpb24gdGhhdCB0YWtlcyB0aGUgc3RhdGVcbiAgICogLy8gZGVmaW5pdGlvbiwgYW5kIGEgcmVmZXJlbmNlIHRvIHRoZSBpbnRlcm5hbCBmdW5jdGlvbiBiZWluZyBvdmVycmlkZGVuOlxuICAgKiAkc3RhdGVQcm92aWRlci5kZWNvcmF0b3IoJ3ZpZXdzJywgZnVuY3Rpb24gKCRzdGF0ZSwgcGFyZW50KSB7XG4gICAqICAgdmFyIHJlc3VsdCA9IHt9LFxuICAgKiAgICAgICB2aWV3cyA9IHBhcmVudChzdGF0ZSk7XG4gICAqXG4gICAqICAgYW5ndWxhci5mb3JFYWNoKHZpZXcsIGZ1bmN0aW9uIChjb25maWcsIG5hbWUpIHtcbiAgICogICAgIHZhciBhdXRvTmFtZSA9IChzdGF0ZS5uYW1lICsgJy4nICsgbmFtZSkucmVwbGFjZSgnLicsICcvJyk7XG4gICAqICAgICBjb25maWcudGVtcGxhdGVVcmwgPSBjb25maWcudGVtcGxhdGVVcmwgfHwgJy9wYXJ0aWFscy8nICsgYXV0b05hbWUgKyAnLmh0bWwnO1xuICAgKiAgICAgcmVzdWx0W25hbWVdID0gY29uZmlnO1xuICAgKiAgIH0pO1xuICAgKiAgIHJldHVybiByZXN1bHQ7XG4gICAqIH0pO1xuICAgKlxuICAgKiAkc3RhdGVQcm92aWRlci5zdGF0ZSgnaG9tZScsIHtcbiAgICogICB2aWV3czoge1xuICAgKiAgICAgJ2NvbnRhY3QubGlzdCc6IHsgY29udHJvbGxlcjogJ0xpc3RDb250cm9sbGVyJyB9LFxuICAgKiAgICAgJ2NvbnRhY3QuaXRlbSc6IHsgY29udHJvbGxlcjogJ0l0ZW1Db250cm9sbGVyJyB9XG4gICAqICAgfVxuICAgKiB9KTtcbiAgICpcbiAgICogLy8gLi4uXG4gICAqXG4gICAqICRzdGF0ZS5nbygnaG9tZScpO1xuICAgKiAvLyBBdXRvLXBvcHVsYXRlcyBsaXN0IGFuZCBpdGVtIHZpZXdzIHdpdGggL3BhcnRpYWxzL2hvbWUvY29udGFjdC9saXN0Lmh0bWwsXG4gICAqIC8vIGFuZCAvcGFydGlhbHMvaG9tZS9jb250YWN0L2l0ZW0uaHRtbCwgcmVzcGVjdGl2ZWx5LlxuICAgKiA8L3ByZT5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgVGhlIG5hbWUgb2YgdGhlIGJ1aWxkZXIgZnVuY3Rpb24gdG8gZGVjb3JhdGUuIFxuICAgKiBAcGFyYW0ge29iamVjdH0gZnVuYyBBIGZ1bmN0aW9uIHRoYXQgaXMgcmVzcG9uc2libGUgZm9yIGRlY29yYXRpbmcgdGhlIG9yaWdpbmFsIFxuICAgKiBidWlsZGVyIGZ1bmN0aW9uLiBUaGUgZnVuY3Rpb24gcmVjZWl2ZXMgdHdvIHBhcmFtZXRlcnM6XG4gICAqXG4gICAqICAgLSBge29iamVjdH1gIC0gc3RhdGUgLSBUaGUgc3RhdGUgY29uZmlnIG9iamVjdC5cbiAgICogICAtIGB7b2JqZWN0fWAgLSBzdXBlciAtIFRoZSBvcmlnaW5hbCBidWlsZGVyIGZ1bmN0aW9uLlxuICAgKlxuICAgKiBAcmV0dXJuIHtvYmplY3R9ICRzdGF0ZVByb3ZpZGVyIC0gJHN0YXRlUHJvdmlkZXIgaW5zdGFuY2VcbiAgICovXG4gIHRoaXMuZGVjb3JhdG9yID0gZGVjb3JhdG9yO1xuICBmdW5jdGlvbiBkZWNvcmF0b3IobmFtZSwgZnVuYykge1xuICAgIC8qanNoaW50IHZhbGlkdGhpczogdHJ1ZSAqL1xuICAgIGlmIChpc1N0cmluZyhuYW1lKSAmJiAhaXNEZWZpbmVkKGZ1bmMpKSB7XG4gICAgICByZXR1cm4gc3RhdGVCdWlsZGVyW25hbWVdO1xuICAgIH1cbiAgICBpZiAoIWlzRnVuY3Rpb24oZnVuYykgfHwgIWlzU3RyaW5nKG5hbWUpKSB7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgaWYgKHN0YXRlQnVpbGRlcltuYW1lXSAmJiAhc3RhdGVCdWlsZGVyLiRkZWxlZ2F0ZXNbbmFtZV0pIHtcbiAgICAgIHN0YXRlQnVpbGRlci4kZGVsZWdhdGVzW25hbWVdID0gc3RhdGVCdWlsZGVyW25hbWVdO1xuICAgIH1cbiAgICBzdGF0ZUJ1aWxkZXJbbmFtZV0gPSBmdW5jO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlUHJvdmlkZXIjc3RhdGVcbiAgICogQG1ldGhvZE9mIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVQcm92aWRlclxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmVnaXN0ZXJzIGEgc3RhdGUgY29uZmlndXJhdGlvbiB1bmRlciBhIGdpdmVuIHN0YXRlIG5hbWUuIFRoZSBzdGF0ZUNvbmZpZyBvYmplY3RcbiAgICogaGFzIHRoZSBmb2xsb3dpbmcgYWNjZXB0YWJsZSBwcm9wZXJ0aWVzLlxuICAgKlxuICAgKiA8YSBpZD0ndGVtcGxhdGUnPjwvYT5cbiAgICpcbiAgICogLSAqKmB0ZW1wbGF0ZWAqKiAtIHtzdHJpbmd8ZnVuY3Rpb249fSAtIGh0bWwgdGVtcGxhdGUgYXMgYSBzdHJpbmcgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnNcbiAgICogICBhbiBodG1sIHRlbXBsYXRlIGFzIGEgc3RyaW5nIHdoaWNoIHNob3VsZCBiZSB1c2VkIGJ5IHRoZSB1aVZpZXcgZGlyZWN0aXZlcy4gVGhpcyBwcm9wZXJ0eSBcbiAgICogICB0YWtlcyBwcmVjZWRlbmNlIG92ZXIgdGVtcGxhdGVVcmwuXG4gICAqICAgXG4gICAqICAgSWYgYHRlbXBsYXRlYCBpcyBhIGZ1bmN0aW9uLCBpdCB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSBmb2xsb3dpbmcgcGFyYW1ldGVyczpcbiAgICpcbiAgICogICAtIHthcnJheS4mbHQ7b2JqZWN0Jmd0O30gLSBzdGF0ZSBwYXJhbWV0ZXJzIGV4dHJhY3RlZCBmcm9tIHRoZSBjdXJyZW50ICRsb2NhdGlvbi5wYXRoKCkgYnlcbiAgICogICAgIGFwcGx5aW5nIHRoZSBjdXJyZW50IHN0YXRlXG4gICAqXG4gICAqIDxhIGlkPSd0ZW1wbGF0ZVVybCc+PC9hPlxuICAgKlxuICAgKiAtICoqYHRlbXBsYXRlVXJsYCoqIC0ge3N0cmluZ3xmdW5jdGlvbj19IC0gcGF0aCBvciBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBwYXRoIHRvIGFuIGh0bWwgXG4gICAqICAgdGVtcGxhdGUgdGhhdCBzaG91bGQgYmUgdXNlZCBieSB1aVZpZXcuXG4gICAqICAgXG4gICAqICAgSWYgYHRlbXBsYXRlVXJsYCBpcyBhIGZ1bmN0aW9uLCBpdCB3aWxsIGJlIGNhbGxlZCB3aXRoIHRoZSBmb2xsb3dpbmcgcGFyYW1ldGVyczpcbiAgICpcbiAgICogICAtIHthcnJheS4mbHQ7b2JqZWN0Jmd0O30gLSBzdGF0ZSBwYXJhbWV0ZXJzIGV4dHJhY3RlZCBmcm9tIHRoZSBjdXJyZW50ICRsb2NhdGlvbi5wYXRoKCkgYnkgXG4gICAqICAgICBhcHBseWluZyB0aGUgY3VycmVudCBzdGF0ZVxuICAgKlxuICAgKiA8YSBpZD0ndGVtcGxhdGVQcm92aWRlcic+PC9hPlxuICAgKlxuICAgKiAtICoqYHRlbXBsYXRlUHJvdmlkZXJgKiogLSB7ZnVuY3Rpb249fSAtIFByb3ZpZGVyIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBIVE1MIGNvbnRlbnRcbiAgICogICBzdHJpbmcuXG4gICAqXG4gICAqIDxhIGlkPSdjb250cm9sbGVyJz48L2E+XG4gICAqXG4gICAqIC0gKipgY29udHJvbGxlcmAqKiAtIHtzdHJpbmd8ZnVuY3Rpb249fSAtICBDb250cm9sbGVyIGZuIHRoYXQgc2hvdWxkIGJlIGFzc29jaWF0ZWQgd2l0aCBuZXdseSBcbiAgICogICByZWxhdGVkIHNjb3BlIG9yIHRoZSBuYW1lIG9mIGEgcmVnaXN0ZXJlZCBjb250cm9sbGVyIGlmIHBhc3NlZCBhcyBhIHN0cmluZy5cbiAgICpcbiAgICogPGEgaWQ9J2NvbnRyb2xsZXJQcm92aWRlcic+PC9hPlxuICAgKlxuICAgKiAtICoqYGNvbnRyb2xsZXJQcm92aWRlcmAqKiAtIHtmdW5jdGlvbj19IC0gSW5qZWN0YWJsZSBwcm92aWRlciBmdW5jdGlvbiB0aGF0IHJldHVybnNcbiAgICogICB0aGUgYWN0dWFsIGNvbnRyb2xsZXIgb3Igc3RyaW5nLlxuICAgKlxuICAgKiA8YSBpZD0nY29udHJvbGxlckFzJz48L2E+XG4gICAqIFxuICAgKiAtICoqYGNvbnRyb2xsZXJBc2AqKiDigJMge3N0cmluZz19IOKAkyBBIGNvbnRyb2xsZXIgYWxpYXMgbmFtZS4gSWYgcHJlc2VudCB0aGUgY29udHJvbGxlciB3aWxsIGJlIFxuICAgKiAgIHB1Ymxpc2hlZCB0byBzY29wZSB1bmRlciB0aGUgY29udHJvbGxlckFzIG5hbWUuXG4gICAqXG4gICAqIDxhIGlkPSdyZXNvbHZlJz48L2E+XG4gICAqXG4gICAqIC0gKipgcmVzb2x2ZWAqKiAtIHtvYmplY3QuJmx0O3N0cmluZywgZnVuY3Rpb24mZ3Q7PX0gLSBBbiBvcHRpb25hbCBtYXAgb2YgZGVwZW5kZW5jaWVzIHdoaWNoIFxuICAgKiAgIHNob3VsZCBiZSBpbmplY3RlZCBpbnRvIHRoZSBjb250cm9sbGVyLiBJZiBhbnkgb2YgdGhlc2UgZGVwZW5kZW5jaWVzIGFyZSBwcm9taXNlcywgXG4gICAqICAgdGhlIHJvdXRlciB3aWxsIHdhaXQgZm9yIHRoZW0gYWxsIHRvIGJlIHJlc29sdmVkIG9yIG9uZSB0byBiZSByZWplY3RlZCBiZWZvcmUgdGhlIFxuICAgKiAgIGNvbnRyb2xsZXIgaXMgaW5zdGFudGlhdGVkLiBJZiBhbGwgdGhlIHByb21pc2VzIGFyZSByZXNvbHZlZCBzdWNjZXNzZnVsbHksIHRoZSB2YWx1ZXMgXG4gICAqICAgb2YgdGhlIHJlc29sdmVkIHByb21pc2VzIGFyZSBpbmplY3RlZCBhbmQgJHN0YXRlQ2hhbmdlU3VjY2VzcyBldmVudCBpcyBmaXJlZC4gSWYgYW55IFxuICAgKiAgIG9mIHRoZSBwcm9taXNlcyBhcmUgcmVqZWN0ZWQgdGhlICRzdGF0ZUNoYW5nZUVycm9yIGV2ZW50IGlzIGZpcmVkLiBUaGUgbWFwIG9iamVjdCBpczpcbiAgICogICBcbiAgICogICAtIGtleSAtIHtzdHJpbmd9OiBuYW1lIG9mIGRlcGVuZGVuY3kgdG8gYmUgaW5qZWN0ZWQgaW50byBjb250cm9sbGVyXG4gICAqICAgLSBmYWN0b3J5IC0ge3N0cmluZ3xmdW5jdGlvbn06IElmIHN0cmluZyB0aGVuIGl0IGlzIGFsaWFzIGZvciBzZXJ2aWNlLiBPdGhlcndpc2UgaWYgZnVuY3Rpb24sIFxuICAgKiAgICAgaXQgaXMgaW5qZWN0ZWQgYW5kIHJldHVybiB2YWx1ZSBpdCB0cmVhdGVkIGFzIGRlcGVuZGVuY3kuIElmIHJlc3VsdCBpcyBhIHByb21pc2UsIGl0IGlzIFxuICAgKiAgICAgcmVzb2x2ZWQgYmVmb3JlIGl0cyB2YWx1ZSBpcyBpbmplY3RlZCBpbnRvIGNvbnRyb2xsZXIuXG4gICAqXG4gICAqIDxhIGlkPSd1cmwnPjwvYT5cbiAgICpcbiAgICogLSAqKmB1cmxgKiogLSB7c3RyaW5nPX0gLSBBIHVybCB3aXRoIG9wdGlvbmFsIHBhcmFtZXRlcnMuIFdoZW4gYSBzdGF0ZSBpcyBuYXZpZ2F0ZWQgb3JcbiAgICogICB0cmFuc2l0aW9uZWQgdG8sIHRoZSBgJHN0YXRlUGFyYW1zYCBzZXJ2aWNlIHdpbGwgYmUgcG9wdWxhdGVkIHdpdGggYW55IFxuICAgKiAgIHBhcmFtZXRlcnMgdGhhdCB3ZXJlIHBhc3NlZC5cbiAgICpcbiAgICogPGEgaWQ9J3BhcmFtcyc+PC9hPlxuICAgKlxuICAgKiAtICoqYHBhcmFtc2AqKiAtIHtvYmplY3Q9fSAtIEFuIGFycmF5IG9mIHBhcmFtZXRlciBuYW1lcyBvciByZWd1bGFyIGV4cHJlc3Npb25zLiBPbmx5IFxuICAgKiAgIHVzZSB0aGlzIHdpdGhpbiBhIHN0YXRlIGlmIHlvdSBhcmUgbm90IHVzaW5nIHVybC4gT3RoZXJ3aXNlIHlvdSBjYW4gc3BlY2lmeSB5b3VyXG4gICAqICAgcGFyYW1ldGVycyB3aXRoaW4gdGhlIHVybC4gV2hlbiBhIHN0YXRlIGlzIG5hdmlnYXRlZCBvciB0cmFuc2l0aW9uZWQgdG8sIHRoZSBcbiAgICogICAkc3RhdGVQYXJhbXMgc2VydmljZSB3aWxsIGJlIHBvcHVsYXRlZCB3aXRoIGFueSBwYXJhbWV0ZXJzIHRoYXQgd2VyZSBwYXNzZWQuXG4gICAqXG4gICAqIDxhIGlkPSd2aWV3cyc+PC9hPlxuICAgKlxuICAgKiAtICoqYHZpZXdzYCoqIC0ge29iamVjdD19IC0gVXNlIHRoZSB2aWV3cyBwcm9wZXJ0eSB0byBzZXQgdXAgbXVsdGlwbGUgdmlld3Mgb3IgdG8gdGFyZ2V0IHZpZXdzXG4gICAqICAgbWFudWFsbHkvZXhwbGljaXRseS5cbiAgICpcbiAgICogPGEgaWQ9J2Fic3RyYWN0Jz48L2E+XG4gICAqXG4gICAqIC0gKipgYWJzdHJhY3RgKiogLSB7Ym9vbGVhbj19IC0gQW4gYWJzdHJhY3Qgc3RhdGUgd2lsbCBuZXZlciBiZSBkaXJlY3RseSBhY3RpdmF0ZWQsIFxuICAgKiAgIGJ1dCBjYW4gcHJvdmlkZSBpbmhlcml0ZWQgcHJvcGVydGllcyB0byBpdHMgY29tbW9uIGNoaWxkcmVuIHN0YXRlcy5cbiAgICpcbiAgICogPGEgaWQ9J29uRW50ZXInPjwvYT5cbiAgICpcbiAgICogLSAqKmBvbkVudGVyYCoqIC0ge29iamVjdD19IC0gQ2FsbGJhY2sgZnVuY3Rpb24gZm9yIHdoZW4gYSBzdGF0ZSBpcyBlbnRlcmVkLiBHb29kIHdheVxuICAgKiAgIHRvIHRyaWdnZXIgYW4gYWN0aW9uIG9yIGRpc3BhdGNoIGFuIGV2ZW50LCBzdWNoIGFzIG9wZW5pbmcgYSBkaWFsb2cuXG4gICAqXG4gICAqIDxhIGlkPSdvbkV4aXQnPjwvYT5cbiAgICpcbiAgICogLSAqKmBvbkV4aXRgKiogLSB7b2JqZWN0PX0gLSBDYWxsYmFjayBmdW5jdGlvbiBmb3Igd2hlbiBhIHN0YXRlIGlzIGV4aXRlZC4gR29vZCB3YXkgdG9cbiAgICogICB0cmlnZ2VyIGFuIGFjdGlvbiBvciBkaXNwYXRjaCBhbiBldmVudCwgc3VjaCBhcyBvcGVuaW5nIGEgZGlhbG9nLlxuICAgKlxuICAgKiA8YSBpZD0ncmVsb2FkT25TZWFyY2gnPjwvYT5cbiAgICpcbiAgICogLSAqKmByZWxvYWRPblNlYXJjaCA9IHRydWVgKiogLSB7Ym9vbGVhbj19IC0gSWYgYGZhbHNlYCwgd2lsbCBub3QgcmV0cmlnZ2VyIHRoZSBzYW1lIHN0YXRlIFxuICAgKiAgIGp1c3QgYmVjYXVzZSBhIHNlYXJjaC9xdWVyeSBwYXJhbWV0ZXIgaGFzIGNoYW5nZWQgKHZpYSAkbG9jYXRpb24uc2VhcmNoKCkgb3IgJGxvY2F0aW9uLmhhc2goKSkuIFxuICAgKiAgIFVzZWZ1bCBmb3Igd2hlbiB5b3UnZCBsaWtlIHRvIG1vZGlmeSAkbG9jYXRpb24uc2VhcmNoKCkgd2l0aG91dCB0cmlnZ2VyaW5nIGEgcmVsb2FkLlxuICAgKlxuICAgKiA8YSBpZD0nZGF0YSc+PC9hPlxuICAgKlxuICAgKiAtICoqYGRhdGFgKiogLSB7b2JqZWN0PX0gLSBBcmJpdHJhcnkgZGF0YSBvYmplY3QsIHVzZWZ1bCBmb3IgY3VzdG9tIGNvbmZpZ3VyYXRpb24uXG4gICAqXG4gICAqIEBleGFtcGxlXG4gICAqIDxwcmU+XG4gICAqIC8vIFNvbWUgc3RhdGUgbmFtZSBleGFtcGxlc1xuICAgKlxuICAgKiAvLyBzdGF0ZU5hbWUgY2FuIGJlIGEgc2luZ2xlIHRvcC1sZXZlbCBuYW1lIChtdXN0IGJlIHVuaXF1ZSkuXG4gICAqICRzdGF0ZVByb3ZpZGVyLnN0YXRlKFwiaG9tZVwiLCB7fSk7XG4gICAqXG4gICAqIC8vIE9yIGl0IGNhbiBiZSBhIG5lc3RlZCBzdGF0ZSBuYW1lLiBUaGlzIHN0YXRlIGlzIGEgY2hpbGQgb2YgdGhlIFxuICAgKiAvLyBhYm92ZSBcImhvbWVcIiBzdGF0ZS5cbiAgICogJHN0YXRlUHJvdmlkZXIuc3RhdGUoXCJob21lLm5ld2VzdFwiLCB7fSk7XG4gICAqXG4gICAqIC8vIE5lc3Qgc3RhdGVzIGFzIGRlZXBseSBhcyBuZWVkZWQuXG4gICAqICRzdGF0ZVByb3ZpZGVyLnN0YXRlKFwiaG9tZS5uZXdlc3QuYWJjLnh5ei5pbmNlcHRpb25cIiwge30pO1xuICAgKlxuICAgKiAvLyBzdGF0ZSgpIHJldHVybnMgJHN0YXRlUHJvdmlkZXIsIHNvIHlvdSBjYW4gY2hhaW4gc3RhdGUgZGVjbGFyYXRpb25zLlxuICAgKiAkc3RhdGVQcm92aWRlclxuICAgKiAgIC5zdGF0ZShcImhvbWVcIiwge30pXG4gICAqICAgLnN0YXRlKFwiYWJvdXRcIiwge30pXG4gICAqICAgLnN0YXRlKFwiY29udGFjdHNcIiwge30pO1xuICAgKiA8L3ByZT5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IG5hbWUgQSB1bmlxdWUgc3RhdGUgbmFtZSwgZS5nLiBcImhvbWVcIiwgXCJhYm91dFwiLCBcImNvbnRhY3RzXCIuIFxuICAgKiBUbyBjcmVhdGUgYSBwYXJlbnQvY2hpbGQgc3RhdGUgdXNlIGEgZG90LCBlLmcuIFwiYWJvdXQuc2FsZXNcIiwgXCJob21lLm5ld2VzdFwiLlxuICAgKiBAcGFyYW0ge29iamVjdH0gZGVmaW5pdGlvbiBTdGF0ZSBjb25maWd1cmF0aW9uIG9iamVjdC5cbiAgICovXG4gIHRoaXMuc3RhdGUgPSBzdGF0ZTtcbiAgZnVuY3Rpb24gc3RhdGUobmFtZSwgZGVmaW5pdGlvbikge1xuICAgIC8qanNoaW50IHZhbGlkdGhpczogdHJ1ZSAqL1xuICAgIGlmIChpc09iamVjdChuYW1lKSkgZGVmaW5pdGlvbiA9IG5hbWU7XG4gICAgZWxzZSBkZWZpbml0aW9uLm5hbWUgPSBuYW1lO1xuICAgIHJlZ2lzdGVyU3RhdGUoZGVmaW5pdGlvbik7XG4gICAgcmV0dXJuIHRoaXM7XG4gIH1cblxuICAvKipcbiAgICogQG5nZG9jIG9iamVjdFxuICAgKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlXG4gICAqXG4gICAqIEByZXF1aXJlcyAkcm9vdFNjb3BlXG4gICAqIEByZXF1aXJlcyAkcVxuICAgKiBAcmVxdWlyZXMgdWkucm91dGVyLnN0YXRlLiR2aWV3XG4gICAqIEByZXF1aXJlcyAkaW5qZWN0b3JcbiAgICogQHJlcXVpcmVzIHVpLnJvdXRlci51dGlsLiRyZXNvbHZlXG4gICAqIEByZXF1aXJlcyB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlUGFyYW1zXG4gICAqXG4gICAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBwYXJhbXMgQSBwYXJhbSBvYmplY3QsIGUuZy4ge3NlY3Rpb25JZDogc2VjdGlvbi5pZCl9LCB0aGF0IFxuICAgKiB5b3UnZCBsaWtlIHRvIHRlc3QgYWdhaW5zdCB0aGUgY3VycmVudCBhY3RpdmUgc3RhdGUuXG4gICAqIEBwcm9wZXJ0eSB7b2JqZWN0fSBjdXJyZW50IEEgcmVmZXJlbmNlIHRvIHRoZSBzdGF0ZSdzIGNvbmZpZyBvYmplY3QuIEhvd2V2ZXIgXG4gICAqIHlvdSBwYXNzZWQgaXQgaW4uIFVzZWZ1bCBmb3IgYWNjZXNzaW5nIGN1c3RvbSBkYXRhLlxuICAgKiBAcHJvcGVydHkge29iamVjdH0gdHJhbnNpdGlvbiBDdXJyZW50bHkgcGVuZGluZyB0cmFuc2l0aW9uLiBBIHByb21pc2UgdGhhdCdsbCBcbiAgICogcmVzb2x2ZSBvciByZWplY3QuXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBgJHN0YXRlYCBzZXJ2aWNlIGlzIHJlc3BvbnNpYmxlIGZvciByZXByZXNlbnRpbmcgc3RhdGVzIGFzIHdlbGwgYXMgdHJhbnNpdGlvbmluZ1xuICAgKiBiZXR3ZWVuIHRoZW0uIEl0IGFsc28gcHJvdmlkZXMgaW50ZXJmYWNlcyB0byBhc2sgZm9yIGN1cnJlbnQgc3RhdGUgb3IgZXZlbiBzdGF0ZXNcbiAgICogeW91J3JlIGNvbWluZyBmcm9tLlxuICAgKi9cbiAgLy8gJHVybFJvdXRlciBpcyBpbmplY3RlZCBqdXN0IHRvIGVuc3VyZSBpdCBnZXRzIGluc3RhbnRpYXRlZFxuICB0aGlzLiRnZXQgPSAkZ2V0O1xuICAkZ2V0LiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAnJHEnLCAnJHZpZXcnLCAnJGluamVjdG9yJywgJyRyZXNvbHZlJywgJyRzdGF0ZVBhcmFtcycsICckbG9jYXRpb24nLCAnJHVybFJvdXRlcicsICckYnJvd3NlciddO1xuICBmdW5jdGlvbiAkZ2V0KCAgICRyb290U2NvcGUsICAgJHEsICAgJHZpZXcsICAgJGluamVjdG9yLCAgICRyZXNvbHZlLCAgICRzdGF0ZVBhcmFtcywgICAkbG9jYXRpb24sICAgJHVybFJvdXRlciwgICAkYnJvd3Nlcikge1xuXG4gICAgdmFyIFRyYW5zaXRpb25TdXBlcnNlZGVkID0gJHEucmVqZWN0KG5ldyBFcnJvcigndHJhbnNpdGlvbiBzdXBlcnNlZGVkJykpO1xuICAgIHZhciBUcmFuc2l0aW9uUHJldmVudGVkID0gJHEucmVqZWN0KG5ldyBFcnJvcigndHJhbnNpdGlvbiBwcmV2ZW50ZWQnKSk7XG4gICAgdmFyIFRyYW5zaXRpb25BYm9ydGVkID0gJHEucmVqZWN0KG5ldyBFcnJvcigndHJhbnNpdGlvbiBhYm9ydGVkJykpO1xuICAgIHZhciBUcmFuc2l0aW9uRmFpbGVkID0gJHEucmVqZWN0KG5ldyBFcnJvcigndHJhbnNpdGlvbiBmYWlsZWQnKSk7XG4gICAgdmFyIGN1cnJlbnRMb2NhdGlvbiA9ICRsb2NhdGlvbi51cmwoKTtcbiAgICB2YXIgYmFzZUhyZWYgPSAkYnJvd3Nlci5iYXNlSHJlZigpO1xuXG4gICAgZnVuY3Rpb24gc3luY1VybCgpIHtcbiAgICAgIGlmICgkbG9jYXRpb24udXJsKCkgIT09IGN1cnJlbnRMb2NhdGlvbikge1xuICAgICAgICAkbG9jYXRpb24udXJsKGN1cnJlbnRMb2NhdGlvbik7XG4gICAgICAgICRsb2NhdGlvbi5yZXBsYWNlKCk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgcm9vdC5sb2NhbHMgPSB7IHJlc29sdmU6IG51bGwsIGdsb2JhbHM6IHsgJHN0YXRlUGFyYW1zOiB7fSB9IH07XG4gICAgJHN0YXRlID0ge1xuICAgICAgcGFyYW1zOiB7fSxcbiAgICAgIGN1cnJlbnQ6IHJvb3Quc2VsZixcbiAgICAgICRjdXJyZW50OiByb290LFxuICAgICAgdHJhbnNpdGlvbjogbnVsbFxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICAgKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlI3JlbG9hZFxuICAgICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlXG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBBIG1ldGhvZCB0aGF0IGZvcmNlIHJlbG9hZHMgdGhlIGN1cnJlbnQgc3RhdGUuIEFsbCByZXNvbHZlcyBhcmUgcmUtcmVzb2x2ZWQsIGV2ZW50cyBhcmUgbm90IHJlLWZpcmVkLCBcbiAgICAgKiBhbmQgY29udHJvbGxlcnMgcmVpbnN0YW50aWF0ZWQgKGJ1ZyB3aXRoIGNvbnRyb2xsZXJzIHJlaW5zdGFudGlhdGluZyByaWdodCBub3csIGZpeGluZyBzb29uKS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogPHByZT5cbiAgICAgKiB2YXIgYXBwIGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbJ3VpLnJvdXRlciddKTtcbiAgICAgKlxuICAgICAqIGFwcC5jb250cm9sbGVyKCdjdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJHN0YXRlKSB7XG4gICAgICogICAkc2NvcGUucmVsb2FkID0gZnVuY3Rpb24oKXtcbiAgICAgKiAgICAgJHN0YXRlLnJlbG9hZCgpO1xuICAgICAqICAgfVxuICAgICAqIH0pO1xuICAgICAqIDwvcHJlPlxuICAgICAqXG4gICAgICogYHJlbG9hZCgpYCBpcyBqdXN0IGFuIGFsaWFzIGZvcjpcbiAgICAgKiA8cHJlPlxuICAgICAqICRzdGF0ZS50cmFuc2l0aW9uVG8oJHN0YXRlLmN1cnJlbnQsICRzdGF0ZVBhcmFtcywgeyBcbiAgICAgKiAgIHJlbG9hZDogdHJ1ZSwgaW5oZXJpdDogZmFsc2UsIG5vdGlmeTogZmFsc2UgXG4gICAgICogfSk7XG4gICAgICogPC9wcmU+XG4gICAgICovXG4gICAgJHN0YXRlLnJlbG9hZCA9IGZ1bmN0aW9uIHJlbG9hZCgpIHtcbiAgICAgICRzdGF0ZS50cmFuc2l0aW9uVG8oJHN0YXRlLmN1cnJlbnQsICRzdGF0ZVBhcmFtcywgeyByZWxvYWQ6IHRydWUsIGluaGVyaXQ6IGZhbHNlLCBub3RpZnk6IGZhbHNlIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICAgKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlI2dvXG4gICAgICogQG1ldGhvZE9mIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIENvbnZlbmllbmNlIG1ldGhvZCBmb3IgdHJhbnNpdGlvbmluZyB0byBhIG5ldyBzdGF0ZS4gYCRzdGF0ZS5nb2AgY2FsbHMgXG4gICAgICogYCRzdGF0ZS50cmFuc2l0aW9uVG9gIGludGVybmFsbHkgYnV0IGF1dG9tYXRpY2FsbHkgc2V0cyBvcHRpb25zIHRvIFxuICAgICAqIGB7IGxvY2F0aW9uOiB0cnVlLCBpbmhlcml0OiB0cnVlLCByZWxhdGl2ZTogJHN0YXRlLiRjdXJyZW50LCBub3RpZnk6IHRydWUgfWAuIFxuICAgICAqIFRoaXMgYWxsb3dzIHlvdSB0byBlYXNpbHkgdXNlIGFuIGFic29sdXRlIG9yIHJlbGF0aXZlIHRvIHBhdGggYW5kIHNwZWNpZnkgXG4gICAgICogb25seSB0aGUgcGFyYW1ldGVycyB5b3UnZCBsaWtlIHRvIHVwZGF0ZSAod2hpbGUgbGV0dGluZyB1bnNwZWNpZmllZCBwYXJhbWV0ZXJzIFxuICAgICAqIGluaGVyaXQgZnJvbSB0aGUgY3VycmVudGx5IGFjdGl2ZSBhbmNlc3RvciBzdGF0ZXMpLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiA8cHJlPlxuICAgICAqIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyd1aS5yb3V0ZXInXSk7XG4gICAgICpcbiAgICAgKiBhcHAuY29udHJvbGxlcignY3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSkge1xuICAgICAqICAgJHNjb3BlLmNoYW5nZVN0YXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAqICAgICAkc3RhdGUuZ28oJ2NvbnRhY3QuZGV0YWlsJyk7XG4gICAgICogICB9O1xuICAgICAqIH0pO1xuICAgICAqIDwvcHJlPlxuICAgICAqIDxpbWcgc3JjPScuLi9uZ2RvY19hc3NldHMvU3RhdGVHb0V4YW1wbGVzLnBuZycvPlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRvIEFic29sdXRlIHN0YXRlIG5hbWUgb3IgcmVsYXRpdmUgc3RhdGUgcGF0aC4gU29tZSBleGFtcGxlczpcbiAgICAgKlxuICAgICAqIC0gYCRzdGF0ZS5nbygnY29udGFjdC5kZXRhaWwnKWAgLSB3aWxsIGdvIHRvIHRoZSBgY29udGFjdC5kZXRhaWxgIHN0YXRlXG4gICAgICogLSBgJHN0YXRlLmdvKCdeJylgIC0gd2lsbCBnbyB0byBhIHBhcmVudCBzdGF0ZVxuICAgICAqIC0gYCRzdGF0ZS5nbygnXi5zaWJsaW5nJylgIC0gd2lsbCBnbyB0byBhIHNpYmxpbmcgc3RhdGVcbiAgICAgKiAtIGAkc3RhdGUuZ28oJy5jaGlsZC5ncmFuZGNoaWxkJylgIC0gd2lsbCBnbyB0byBncmFuZGNoaWxkIHN0YXRlXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge29iamVjdD19IHBhcmFtcyBBIG1hcCBvZiB0aGUgcGFyYW1ldGVycyB0aGF0IHdpbGwgYmUgc2VudCB0byB0aGUgc3RhdGUsIFxuICAgICAqIHdpbGwgcG9wdWxhdGUgJHN0YXRlUGFyYW1zLiBBbnkgcGFyYW1ldGVycyB0aGF0IGFyZSBub3Qgc3BlY2lmaWVkIHdpbGwgYmUgaW5oZXJpdGVkIGZyb20gY3VycmVudGx5IFxuICAgICAqIGRlZmluZWQgcGFyYW1ldGVycy4gVGhpcyBhbGxvd3MsIGZvciBleGFtcGxlLCBnb2luZyB0byBhIHNpYmxpbmcgc3RhdGUgdGhhdCBzaGFyZXMgcGFyYW1ldGVyc1xuICAgICAqIHNwZWNpZmllZCBpbiBhIHBhcmVudCBzdGF0ZS4gUGFyYW1ldGVyIGluaGVyaXRhbmNlIG9ubHkgd29ya3MgYmV0d2VlbiBjb21tb24gYW5jZXN0b3Igc3RhdGVzLCBJLmUuXG4gICAgICogdHJhbnNpdGlvbmluZyB0byBhIHNpYmxpbmcgd2lsbCBnZXQgeW91IHRoZSBwYXJhbWV0ZXJzIGZvciBhbGwgcGFyZW50cywgdHJhbnNpdGlvbmluZyB0byBhIGNoaWxkXG4gICAgICogd2lsbCBnZXQgeW91IGFsbCBjdXJyZW50IHBhcmFtZXRlcnMsIGV0Yy5cbiAgICAgKiBAcGFyYW0ge29iamVjdD19IG9wdGlvbnMgT3B0aW9ucyBvYmplY3QuIFRoZSBvcHRpb25zIGFyZTpcbiAgICAgKlxuICAgICAqIC0gKipgbG9jYXRpb25gKiogLSB7Ym9vbGVhbj10cnVlfHN0cmluZz19IC0gSWYgYHRydWVgIHdpbGwgdXBkYXRlIHRoZSB1cmwgaW4gdGhlIGxvY2F0aW9uIGJhciwgaWYgYGZhbHNlYFxuICAgICAqICAgIHdpbGwgbm90LiBJZiBzdHJpbmcsIG11c3QgYmUgYFwicmVwbGFjZVwiYCwgd2hpY2ggd2lsbCB1cGRhdGUgdXJsIGFuZCBhbHNvIHJlcGxhY2UgbGFzdCBoaXN0b3J5IHJlY29yZC5cbiAgICAgKiAtICoqYGluaGVyaXRgKiogLSB7Ym9vbGVhbj10cnVlfSwgSWYgYHRydWVgIHdpbGwgaW5oZXJpdCB1cmwgcGFyYW1ldGVycyBmcm9tIGN1cnJlbnQgdXJsLlxuICAgICAqIC0gKipgcmVsYXRpdmVgKiogLSB7b2JqZWN0PSRzdGF0ZS4kY3VycmVudH0sIFdoZW4gdHJhbnNpdGlvbmluZyB3aXRoIHJlbGF0aXZlIHBhdGggKGUuZyAnXicpLCBcbiAgICAgKiAgICBkZWZpbmVzIHdoaWNoIHN0YXRlIHRvIGJlIHJlbGF0aXZlIGZyb20uXG4gICAgICogLSAqKmBub3RpZnlgKiogLSB7Ym9vbGVhbj10cnVlfSwgSWYgYHRydWVgIHdpbGwgYnJvYWRjYXN0ICRzdGF0ZUNoYW5nZVN0YXJ0IGFuZCAkc3RhdGVDaGFuZ2VTdWNjZXNzIGV2ZW50cy5cbiAgICAgKiAtICoqYHJlbG9hZGAqKiAodjAuMi41KSAtIHtib29sZWFuPWZhbHNlfSwgSWYgYHRydWVgIHdpbGwgZm9yY2UgdHJhbnNpdGlvbiBldmVuIGlmIHRoZSBzdGF0ZSBvciBwYXJhbXMgXG4gICAgICogICAgaGF2ZSBub3QgY2hhbmdlZCwgYWthIGEgcmVsb2FkIG9mIHRoZSBzYW1lIHN0YXRlLiBJdCBkaWZmZXJzIGZyb20gcmVsb2FkT25TZWFyY2ggYmVjYXVzZSB5b3UnZFxuICAgICAqICAgIHVzZSB0aGlzIHdoZW4geW91IHdhbnQgdG8gZm9yY2UgYSByZWxvYWQgd2hlbiAqZXZlcnl0aGluZyogaXMgdGhlIHNhbWUsIGluY2x1ZGluZyBzZWFyY2ggcGFyYW1zLlxuICAgICAqXG4gICAgICogQHJldHVybnMge3Byb21pc2V9IEEgcHJvbWlzZSByZXByZXNlbnRpbmcgdGhlIHN0YXRlIG9mIHRoZSBuZXcgdHJhbnNpdGlvbi5cbiAgICAgKlxuICAgICAqIFBvc3NpYmxlIHN1Y2Nlc3MgdmFsdWVzOlxuICAgICAqXG4gICAgICogLSAkc3RhdGUuY3VycmVudFxuICAgICAqXG4gICAgICogPGJyLz5Qb3NzaWJsZSByZWplY3Rpb24gdmFsdWVzOlxuICAgICAqXG4gICAgICogLSAndHJhbnNpdGlvbiBzdXBlcnNlZGVkJyAtIHdoZW4gYSBuZXdlciB0cmFuc2l0aW9uIGhhcyBiZWVuIHN0YXJ0ZWQgYWZ0ZXIgdGhpcyBvbmVcbiAgICAgKiAtICd0cmFuc2l0aW9uIHByZXZlbnRlZCcgLSB3aGVuIGBldmVudC5wcmV2ZW50RGVmYXVsdCgpYCBoYXMgYmVlbiBjYWxsZWQgaW4gYSBgJHN0YXRlQ2hhbmdlU3RhcnRgIGxpc3RlbmVyXG4gICAgICogLSAndHJhbnNpdGlvbiBhYm9ydGVkJyAtIHdoZW4gYGV2ZW50LnByZXZlbnREZWZhdWx0KClgIGhhcyBiZWVuIGNhbGxlZCBpbiBhIGAkc3RhdGVOb3RGb3VuZGAgbGlzdGVuZXIgb3JcbiAgICAgKiAgIHdoZW4gYSBgJHN0YXRlTm90Rm91bmRgIGBldmVudC5yZXRyeWAgcHJvbWlzZSBlcnJvcnMuXG4gICAgICogLSAndHJhbnNpdGlvbiBmYWlsZWQnIC0gd2hlbiBhIHN0YXRlIGhhcyBiZWVuIHVuc3VjY2Vzc2Z1bGx5IGZvdW5kIGFmdGVyIDIgdHJpZXMuXG4gICAgICogLSAqcmVzb2x2ZSBlcnJvciogLSB3aGVuIGFuIGVycm9yIGhhcyBvY2N1cnJlZCB3aXRoIGEgYHJlc29sdmVgXG4gICAgICpcbiAgICAgKi9cbiAgICAkc3RhdGUuZ28gPSBmdW5jdGlvbiBnbyh0bywgcGFyYW1zLCBvcHRpb25zKSB7XG4gICAgICByZXR1cm4gdGhpcy50cmFuc2l0aW9uVG8odG8sIHBhcmFtcywgZXh0ZW5kKHsgaW5oZXJpdDogdHJ1ZSwgcmVsYXRpdmU6ICRzdGF0ZS4kY3VycmVudCB9LCBvcHRpb25zKSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgICAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGUjdHJhbnNpdGlvblRvXG4gICAgICogQG1ldGhvZE9mIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIExvdy1sZXZlbCBtZXRob2QgZm9yIHRyYW5zaXRpb25pbmcgdG8gYSBuZXcgc3RhdGUuIHtAbGluayB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlI21ldGhvZHNfZ28gJHN0YXRlLmdvfVxuICAgICAqIHVzZXMgYHRyYW5zaXRpb25Ub2AgaW50ZXJuYWxseS4gYCRzdGF0ZS5nb2AgaXMgcmVjb21tZW5kZWQgaW4gbW9zdCBzaXR1YXRpb25zLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiA8cHJlPlxuICAgICAqIHZhciBhcHAgPSBhbmd1bGFyLm1vZHVsZSgnYXBwJywgWyd1aS5yb3V0ZXInXSk7XG4gICAgICpcbiAgICAgKiBhcHAuY29udHJvbGxlcignY3RybCcsIGZ1bmN0aW9uICgkc2NvcGUsICRzdGF0ZSkge1xuICAgICAqICAgJHNjb3BlLmNoYW5nZVN0YXRlID0gZnVuY3Rpb24gKCkge1xuICAgICAqICAgICAkc3RhdGUudHJhbnNpdGlvblRvKCdjb250YWN0LmRldGFpbCcpO1xuICAgICAqICAgfTtcbiAgICAgKiB9KTtcbiAgICAgKiA8L3ByZT5cbiAgICAgKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0byBTdGF0ZSBuYW1lLlxuICAgICAqIEBwYXJhbSB7b2JqZWN0PX0gdG9QYXJhbXMgQSBtYXAgb2YgdGhlIHBhcmFtZXRlcnMgdGhhdCB3aWxsIGJlIHNlbnQgdG8gdGhlIHN0YXRlLFxuICAgICAqIHdpbGwgcG9wdWxhdGUgJHN0YXRlUGFyYW1zLlxuICAgICAqIEBwYXJhbSB7b2JqZWN0PX0gb3B0aW9ucyBPcHRpb25zIG9iamVjdC4gVGhlIG9wdGlvbnMgYXJlOlxuICAgICAqXG4gICAgICogLSAqKmBsb2NhdGlvbmAqKiAtIHtib29sZWFuPXRydWV8c3RyaW5nPX0gLSBJZiBgdHJ1ZWAgd2lsbCB1cGRhdGUgdGhlIHVybCBpbiB0aGUgbG9jYXRpb24gYmFyLCBpZiBgZmFsc2VgXG4gICAgICogICAgd2lsbCBub3QuIElmIHN0cmluZywgbXVzdCBiZSBgXCJyZXBsYWNlXCJgLCB3aGljaCB3aWxsIHVwZGF0ZSB1cmwgYW5kIGFsc28gcmVwbGFjZSBsYXN0IGhpc3RvcnkgcmVjb3JkLlxuICAgICAqIC0gKipgaW5oZXJpdGAqKiAtIHtib29sZWFuPWZhbHNlfSwgSWYgYHRydWVgIHdpbGwgaW5oZXJpdCB1cmwgcGFyYW1ldGVycyBmcm9tIGN1cnJlbnQgdXJsLlxuICAgICAqIC0gKipgcmVsYXRpdmVgKiogLSB7b2JqZWN0PX0sIFdoZW4gdHJhbnNpdGlvbmluZyB3aXRoIHJlbGF0aXZlIHBhdGggKGUuZyAnXicpLCBcbiAgICAgKiAgICBkZWZpbmVzIHdoaWNoIHN0YXRlIHRvIGJlIHJlbGF0aXZlIGZyb20uXG4gICAgICogLSAqKmBub3RpZnlgKiogLSB7Ym9vbGVhbj10cnVlfSwgSWYgYHRydWVgIHdpbGwgYnJvYWRjYXN0ICRzdGF0ZUNoYW5nZVN0YXJ0IGFuZCAkc3RhdGVDaGFuZ2VTdWNjZXNzIGV2ZW50cy5cbiAgICAgKiAtICoqYHJlbG9hZGAqKiAodjAuMi41KSAtIHtib29sZWFuPWZhbHNlfSwgSWYgYHRydWVgIHdpbGwgZm9yY2UgdHJhbnNpdGlvbiBldmVuIGlmIHRoZSBzdGF0ZSBvciBwYXJhbXMgXG4gICAgICogICAgaGF2ZSBub3QgY2hhbmdlZCwgYWthIGEgcmVsb2FkIG9mIHRoZSBzYW1lIHN0YXRlLiBJdCBkaWZmZXJzIGZyb20gcmVsb2FkT25TZWFyY2ggYmVjYXVzZSB5b3UnZFxuICAgICAqICAgIHVzZSB0aGlzIHdoZW4geW91IHdhbnQgdG8gZm9yY2UgYSByZWxvYWQgd2hlbiAqZXZlcnl0aGluZyogaXMgdGhlIHNhbWUsIGluY2x1ZGluZyBzZWFyY2ggcGFyYW1zLlxuICAgICAqXG4gICAgICogQHJldHVybnMge3Byb21pc2V9IEEgcHJvbWlzZSByZXByZXNlbnRpbmcgdGhlIHN0YXRlIG9mIHRoZSBuZXcgdHJhbnNpdGlvbi4gU2VlXG4gICAgICoge0BsaW5rIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGUjbWV0aG9kc19nbyAkc3RhdGUuZ299LlxuICAgICAqL1xuICAgICRzdGF0ZS50cmFuc2l0aW9uVG8gPSBmdW5jdGlvbiB0cmFuc2l0aW9uVG8odG8sIHRvUGFyYW1zLCBvcHRpb25zKSB7XG4gICAgICB0b1BhcmFtcyA9IHRvUGFyYW1zIHx8IHt9O1xuICAgICAgb3B0aW9ucyA9IGV4dGVuZCh7XG4gICAgICAgIGxvY2F0aW9uOiB0cnVlLCBpbmhlcml0OiBmYWxzZSwgcmVsYXRpdmU6IG51bGwsIG5vdGlmeTogdHJ1ZSwgcmVsb2FkOiBmYWxzZSwgJHJldHJ5OiBmYWxzZVxuICAgICAgfSwgb3B0aW9ucyB8fCB7fSk7XG5cbiAgICAgIHZhciBmcm9tID0gJHN0YXRlLiRjdXJyZW50LCBmcm9tUGFyYW1zID0gJHN0YXRlLnBhcmFtcywgZnJvbVBhdGggPSBmcm9tLnBhdGg7XG4gICAgICB2YXIgZXZ0LCB0b1N0YXRlID0gZmluZFN0YXRlKHRvLCBvcHRpb25zLnJlbGF0aXZlKTtcblxuICAgICAgaWYgKCFpc0RlZmluZWQodG9TdGF0ZSkpIHtcbiAgICAgICAgLy8gQnJvYWRjYXN0IG5vdCBmb3VuZCBldmVudCBhbmQgYWJvcnQgdGhlIHRyYW5zaXRpb24gaWYgcHJldmVudGVkXG4gICAgICAgIHZhciByZWRpcmVjdCA9IHsgdG86IHRvLCB0b1BhcmFtczogdG9QYXJhbXMsIG9wdGlvbnM6IG9wdGlvbnMgfTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQG5nZG9jIGV2ZW50XG4gICAgICAgICAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGUjJHN0YXRlTm90Rm91bmRcbiAgICAgICAgICogQGV2ZW50T2YgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVxuICAgICAgICAgKiBAZXZlbnRUeXBlIGJyb2FkY2FzdCBvbiByb290IHNjb3BlXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBGaXJlZCB3aGVuIGEgcmVxdWVzdGVkIHN0YXRlICoqY2Fubm90IGJlIGZvdW5kKiogdXNpbmcgdGhlIHByb3ZpZGVkIHN0YXRlIG5hbWUgZHVyaW5nIHRyYW5zaXRpb24uXG4gICAgICAgICAqIFRoZSBldmVudCBpcyBicm9hZGNhc3QgYWxsb3dpbmcgYW55IGhhbmRsZXJzIGEgc2luZ2xlIGNoYW5jZSB0byBkZWFsIHdpdGggdGhlIGVycm9yICh1c3VhbGx5IGJ5XG4gICAgICAgICAqIGxhenktbG9hZGluZyB0aGUgdW5mb3VuZCBzdGF0ZSkuIEEgc3BlY2lhbCBgdW5mb3VuZFN0YXRlYCBvYmplY3QgaXMgcGFzc2VkIHRvIHRoZSBsaXN0ZW5lciBoYW5kbGVyLFxuICAgICAgICAgKiB5b3UgY2FuIHNlZSBpdHMgdGhyZWUgcHJvcGVydGllcyBpbiB0aGUgZXhhbXBsZS4gWW91IGNhbiB1c2UgYGV2ZW50LnByZXZlbnREZWZhdWx0KClgIHRvIGFib3J0IHRoZVxuICAgICAgICAgKiB0cmFuc2l0aW9uIGFuZCB0aGUgcHJvbWlzZSByZXR1cm5lZCBmcm9tIGBnb2Agd2lsbCBiZSByZWplY3RlZCB3aXRoIGEgYCd0cmFuc2l0aW9uIGFib3J0ZWQnYCB2YWx1ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGV2ZW50IEV2ZW50IG9iamVjdC5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHVuZm91bmRTdGF0ZSBVbmZvdW5kIFN0YXRlIGluZm9ybWF0aW9uLiBDb250YWluczogYHRvLCB0b1BhcmFtcywgb3B0aW9uc2AgcHJvcGVydGllcy5cbiAgICAgICAgICogQHBhcmFtIHtTdGF0ZX0gZnJvbVN0YXRlIEN1cnJlbnQgc3RhdGUgb2JqZWN0LlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZnJvbVBhcmFtcyBDdXJyZW50IHN0YXRlIHBhcmFtcy5cbiAgICAgICAgICpcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICpcbiAgICAgICAgICogPHByZT5cbiAgICAgICAgICogLy8gc29tZXdoZXJlLCBhc3N1bWUgbGF6eS5zdGF0ZSBoYXMgbm90IGJlZW4gZGVmaW5lZFxuICAgICAgICAgKiAkc3RhdGUuZ28oXCJsYXp5LnN0YXRlXCIsIHthOjEsIGI6Mn0sIHtpbmhlcml0OmZhbHNlfSk7XG4gICAgICAgICAqXG4gICAgICAgICAqIC8vIHNvbWV3aGVyZSBlbHNlXG4gICAgICAgICAqICRzY29wZS4kb24oJyRzdGF0ZU5vdEZvdW5kJyxcbiAgICAgICAgICogZnVuY3Rpb24oZXZlbnQsIHVuZm91bmRTdGF0ZSwgZnJvbVN0YXRlLCBmcm9tUGFyYW1zKXtcbiAgICAgICAgICogICAgIGNvbnNvbGUubG9nKHVuZm91bmRTdGF0ZS50byk7IC8vIFwibGF6eS5zdGF0ZVwiXG4gICAgICAgICAqICAgICBjb25zb2xlLmxvZyh1bmZvdW5kU3RhdGUudG9QYXJhbXMpOyAvLyB7YToxLCBiOjJ9XG4gICAgICAgICAqICAgICBjb25zb2xlLmxvZyh1bmZvdW5kU3RhdGUub3B0aW9ucyk7IC8vIHtpbmhlcml0OmZhbHNlfSArIGRlZmF1bHQgb3B0aW9uc1xuICAgICAgICAgKiB9KVxuICAgICAgICAgKiA8L3ByZT5cbiAgICAgICAgICovXG4gICAgICAgIGV2dCA9ICRyb290U2NvcGUuJGJyb2FkY2FzdCgnJHN0YXRlTm90Rm91bmQnLCByZWRpcmVjdCwgZnJvbS5zZWxmLCBmcm9tUGFyYW1zKTtcbiAgICAgICAgaWYgKGV2dC5kZWZhdWx0UHJldmVudGVkKSB7XG4gICAgICAgICAgc3luY1VybCgpO1xuICAgICAgICAgIHJldHVybiBUcmFuc2l0aW9uQWJvcnRlZDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFsbG93IHRoZSBoYW5kbGVyIHRvIHJldHVybiBhIHByb21pc2UgdG8gZGVmZXIgc3RhdGUgbG9va3VwIHJldHJ5XG4gICAgICAgIGlmIChldnQucmV0cnkpIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy4kcmV0cnkpIHtcbiAgICAgICAgICAgIHN5bmNVcmwoKTtcbiAgICAgICAgICAgIHJldHVybiBUcmFuc2l0aW9uRmFpbGVkO1xuICAgICAgICAgIH1cbiAgICAgICAgICB2YXIgcmV0cnlUcmFuc2l0aW9uID0gJHN0YXRlLnRyYW5zaXRpb24gPSAkcS53aGVuKGV2dC5yZXRyeSk7XG4gICAgICAgICAgcmV0cnlUcmFuc2l0aW9uLnRoZW4oZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICBpZiAocmV0cnlUcmFuc2l0aW9uICE9PSAkc3RhdGUudHJhbnNpdGlvbikgcmV0dXJuIFRyYW5zaXRpb25TdXBlcnNlZGVkO1xuICAgICAgICAgICAgcmVkaXJlY3Qub3B0aW9ucy4kcmV0cnkgPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuICRzdGF0ZS50cmFuc2l0aW9uVG8ocmVkaXJlY3QudG8sIHJlZGlyZWN0LnRvUGFyYW1zLCByZWRpcmVjdC5vcHRpb25zKTtcbiAgICAgICAgICB9LCBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgIHJldHVybiBUcmFuc2l0aW9uQWJvcnRlZDtcbiAgICAgICAgICB9KTtcbiAgICAgICAgICBzeW5jVXJsKCk7XG4gICAgICAgICAgcmV0dXJuIHJldHJ5VHJhbnNpdGlvbjtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEFsd2F5cyByZXRyeSBvbmNlIGlmIHRoZSAkc3RhdGVOb3RGb3VuZCB3YXMgbm90IHByZXZlbnRlZFxuICAgICAgICAvLyAoaGFuZGxlcyBlaXRoZXIgcmVkaXJlY3QgY2hhbmdlZCBvciBzdGF0ZSBsYXp5LWRlZmluaXRpb24pXG4gICAgICAgIHRvID0gcmVkaXJlY3QudG87XG4gICAgICAgIHRvUGFyYW1zID0gcmVkaXJlY3QudG9QYXJhbXM7XG4gICAgICAgIG9wdGlvbnMgPSByZWRpcmVjdC5vcHRpb25zO1xuICAgICAgICB0b1N0YXRlID0gZmluZFN0YXRlKHRvLCBvcHRpb25zLnJlbGF0aXZlKTtcbiAgICAgICAgaWYgKCFpc0RlZmluZWQodG9TdGF0ZSkpIHtcbiAgICAgICAgICBpZiAob3B0aW9ucy5yZWxhdGl2ZSkgdGhyb3cgbmV3IEVycm9yKFwiQ291bGQgbm90IHJlc29sdmUgJ1wiICsgdG8gKyBcIicgZnJvbSBzdGF0ZSAnXCIgKyBvcHRpb25zLnJlbGF0aXZlICsgXCInXCIpO1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIk5vIHN1Y2ggc3RhdGUgJ1wiICsgdG8gKyBcIidcIik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIGlmICh0b1N0YXRlW2Fic3RyYWN0S2V5XSkgdGhyb3cgbmV3IEVycm9yKFwiQ2Fubm90IHRyYW5zaXRpb24gdG8gYWJzdHJhY3Qgc3RhdGUgJ1wiICsgdG8gKyBcIidcIik7XG4gICAgICBpZiAob3B0aW9ucy5pbmhlcml0KSB0b1BhcmFtcyA9IGluaGVyaXRQYXJhbXMoJHN0YXRlUGFyYW1zLCB0b1BhcmFtcyB8fCB7fSwgJHN0YXRlLiRjdXJyZW50LCB0b1N0YXRlKTtcbiAgICAgIHRvID0gdG9TdGF0ZTtcblxuICAgICAgdmFyIHRvUGF0aCA9IHRvLnBhdGg7XG5cbiAgICAgIC8vIFN0YXJ0aW5nIGZyb20gdGhlIHJvb3Qgb2YgdGhlIHBhdGgsIGtlZXAgYWxsIGxldmVscyB0aGF0IGhhdmVuJ3QgY2hhbmdlZFxuICAgICAgdmFyIGtlZXAsIHN0YXRlLCBsb2NhbHMgPSByb290LmxvY2FscywgdG9Mb2NhbHMgPSBbXTtcbiAgICAgIGZvciAoa2VlcCA9IDAsIHN0YXRlID0gdG9QYXRoW2tlZXBdO1xuICAgICAgICAgICBzdGF0ZSAmJiBzdGF0ZSA9PT0gZnJvbVBhdGhba2VlcF0gJiYgZXF1YWxGb3JLZXlzKHRvUGFyYW1zLCBmcm9tUGFyYW1zLCBzdGF0ZS5vd25QYXJhbXMpICYmICFvcHRpb25zLnJlbG9hZDtcbiAgICAgICAgICAga2VlcCsrLCBzdGF0ZSA9IHRvUGF0aFtrZWVwXSkge1xuICAgICAgICBsb2NhbHMgPSB0b0xvY2Fsc1trZWVwXSA9IHN0YXRlLmxvY2FscztcbiAgICAgIH1cblxuICAgICAgLy8gSWYgd2UncmUgZ29pbmcgdG8gdGhlIHNhbWUgc3RhdGUgYW5kIGFsbCBsb2NhbHMgYXJlIGtlcHQsIHdlJ3ZlIGdvdCBub3RoaW5nIHRvIGRvLlxuICAgICAgLy8gQnV0IGNsZWFyICd0cmFuc2l0aW9uJywgYXMgd2Ugc3RpbGwgd2FudCB0byBjYW5jZWwgYW55IG90aGVyIHBlbmRpbmcgdHJhbnNpdGlvbnMuXG4gICAgICAvLyBUT0RPOiBXZSBtYXkgbm90IHdhbnQgdG8gYnVtcCAndHJhbnNpdGlvbicgaWYgd2UncmUgY2FsbGVkIGZyb20gYSBsb2NhdGlvbiBjaGFuZ2UgdGhhdCB3ZSd2ZSBpbml0aWF0ZWQgb3Vyc2VsdmVzLFxuICAgICAgLy8gYmVjYXVzZSB3ZSBtaWdodCBhY2NpZGVudGFsbHkgYWJvcnQgYSBsZWdpdGltYXRlIHRyYW5zaXRpb24gaW5pdGlhdGVkIGZyb20gY29kZT9cbiAgICAgIGlmIChzaG91bGRUcmlnZ2VyUmVsb2FkKHRvLCBmcm9tLCBsb2NhbHMsIG9wdGlvbnMpICkge1xuICAgICAgICBpZiAoIHRvLnNlbGYucmVsb2FkT25TZWFyY2ggIT09IGZhbHNlIClcbiAgICAgICAgICBzeW5jVXJsKCk7XG4gICAgICAgICRzdGF0ZS50cmFuc2l0aW9uID0gbnVsbDtcbiAgICAgICAgcmV0dXJuICRxLndoZW4oJHN0YXRlLmN1cnJlbnQpO1xuICAgICAgfVxuXG4gICAgICAvLyBOb3JtYWxpemUvZmlsdGVyIHBhcmFtZXRlcnMgYmVmb3JlIHdlIHBhc3MgdGhlbSB0byBldmVudCBoYW5kbGVycyBldGMuXG4gICAgICB0b1BhcmFtcyA9IG5vcm1hbGl6ZSh0by5wYXJhbXMsIHRvUGFyYW1zIHx8IHt9KTtcblxuICAgICAgLy8gQnJvYWRjYXN0IHN0YXJ0IGV2ZW50IGFuZCBjYW5jZWwgdGhlIHRyYW5zaXRpb24gaWYgcmVxdWVzdGVkXG4gICAgICBpZiAob3B0aW9ucy5ub3RpZnkpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuZ2RvYyBldmVudFxuICAgICAgICAgKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlIyRzdGF0ZUNoYW5nZVN0YXJ0XG4gICAgICAgICAqIEBldmVudE9mIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVcbiAgICAgICAgICogQGV2ZW50VHlwZSBicm9hZGNhc3Qgb24gcm9vdCBzY29wZVxuICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICogRmlyZWQgd2hlbiB0aGUgc3RhdGUgdHJhbnNpdGlvbiAqKmJlZ2lucyoqLiBZb3UgY2FuIHVzZSBgZXZlbnQucHJldmVudERlZmF1bHQoKWBcbiAgICAgICAgICogdG8gcHJldmVudCB0aGUgdHJhbnNpdGlvbiBmcm9tIGhhcHBlbmluZyBhbmQgdGhlbiB0aGUgdHJhbnNpdGlvbiBwcm9taXNlIHdpbGwgYmVcbiAgICAgICAgICogcmVqZWN0ZWQgd2l0aCBhIGAndHJhbnNpdGlvbiBwcmV2ZW50ZWQnYCB2YWx1ZS5cbiAgICAgICAgICpcbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGV2ZW50IEV2ZW50IG9iamVjdC5cbiAgICAgICAgICogQHBhcmFtIHtTdGF0ZX0gdG9TdGF0ZSBUaGUgc3RhdGUgYmVpbmcgdHJhbnNpdGlvbmVkIHRvLlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gdG9QYXJhbXMgVGhlIHBhcmFtcyBzdXBwbGllZCB0byB0aGUgYHRvU3RhdGVgLlxuICAgICAgICAgKiBAcGFyYW0ge1N0YXRlfSBmcm9tU3RhdGUgVGhlIGN1cnJlbnQgc3RhdGUsIHByZS10cmFuc2l0aW9uLlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZnJvbVBhcmFtcyBUaGUgcGFyYW1zIHN1cHBsaWVkIHRvIHRoZSBgZnJvbVN0YXRlYC5cbiAgICAgICAgICpcbiAgICAgICAgICogQGV4YW1wbGVcbiAgICAgICAgICpcbiAgICAgICAgICogPHByZT5cbiAgICAgICAgICogJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JyxcbiAgICAgICAgICogZnVuY3Rpb24oZXZlbnQsIHRvU3RhdGUsIHRvUGFyYW1zLCBmcm9tU3RhdGUsIGZyb21QYXJhbXMpe1xuICAgICAgICAgKiAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICogICAgIC8vIHRyYW5zaXRpb25UbygpIHByb21pc2Ugd2lsbCBiZSByZWplY3RlZCB3aXRoXG4gICAgICAgICAqICAgICAvLyBhICd0cmFuc2l0aW9uIHByZXZlbnRlZCcgZXJyb3JcbiAgICAgICAgICogfSlcbiAgICAgICAgICogPC9wcmU+XG4gICAgICAgICAqL1xuICAgICAgICBldnQgPSAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJyRzdGF0ZUNoYW5nZVN0YXJ0JywgdG8uc2VsZiwgdG9QYXJhbXMsIGZyb20uc2VsZiwgZnJvbVBhcmFtcyk7XG4gICAgICAgIGlmIChldnQuZGVmYXVsdFByZXZlbnRlZCkge1xuICAgICAgICAgIHN5bmNVcmwoKTtcbiAgICAgICAgICByZXR1cm4gVHJhbnNpdGlvblByZXZlbnRlZDtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICAvLyBSZXNvbHZlIGxvY2FscyBmb3IgdGhlIHJlbWFpbmluZyBzdGF0ZXMsIGJ1dCBkb24ndCB1cGRhdGUgYW55IGdsb2JhbCBzdGF0ZSBqdXN0XG4gICAgICAvLyB5ZXQgLS0gaWYgYW55dGhpbmcgZmFpbHMgdG8gcmVzb2x2ZSB0aGUgY3VycmVudCBzdGF0ZSBuZWVkcyB0byByZW1haW4gdW50b3VjaGVkLlxuICAgICAgLy8gV2UgYWxzbyBzZXQgdXAgYW4gaW5oZXJpdGFuY2UgY2hhaW4gZm9yIHRoZSBsb2NhbHMgaGVyZS4gVGhpcyBhbGxvd3MgdGhlIHZpZXcgZGlyZWN0aXZlXG4gICAgICAvLyB0byBxdWlja2x5IGxvb2sgdXAgdGhlIGNvcnJlY3QgZGVmaW5pdGlvbiBmb3IgZWFjaCB2aWV3IGluIHRoZSBjdXJyZW50IHN0YXRlLiBFdmVuXG4gICAgICAvLyB0aG91Z2ggd2UgY3JlYXRlIHRoZSBsb2NhbHMgb2JqZWN0IGl0c2VsZiBvdXRzaWRlIHJlc29sdmVTdGF0ZSgpLCBpdCBpcyBpbml0aWFsbHlcbiAgICAgIC8vIGVtcHR5IGFuZCBnZXRzIGZpbGxlZCBhc3luY2hyb25vdXNseS4gV2UgbmVlZCB0byBrZWVwIHRyYWNrIG9mIHRoZSBwcm9taXNlIGZvciB0aGVcbiAgICAgIC8vIChmdWxseSByZXNvbHZlZCkgY3VycmVudCBsb2NhbHMsIGFuZCBwYXNzIHRoaXMgZG93biB0aGUgY2hhaW4uXG4gICAgICB2YXIgcmVzb2x2ZWQgPSAkcS53aGVuKGxvY2Fscyk7XG4gICAgICBmb3IgKHZhciBsPWtlZXA7IGw8dG9QYXRoLmxlbmd0aDsgbCsrLCBzdGF0ZT10b1BhdGhbbF0pIHtcbiAgICAgICAgbG9jYWxzID0gdG9Mb2NhbHNbbF0gPSBpbmhlcml0KGxvY2Fscyk7XG4gICAgICAgIHJlc29sdmVkID0gcmVzb2x2ZVN0YXRlKHN0YXRlLCB0b1BhcmFtcywgc3RhdGU9PT10bywgcmVzb2x2ZWQsIGxvY2Fscyk7XG4gICAgICB9XG5cbiAgICAgIC8vIE9uY2UgZXZlcnl0aGluZyBpcyByZXNvbHZlZCwgd2UgYXJlIHJlYWR5IHRvIHBlcmZvcm0gdGhlIGFjdHVhbCB0cmFuc2l0aW9uXG4gICAgICAvLyBhbmQgcmV0dXJuIGEgcHJvbWlzZSBmb3IgdGhlIG5ldyBzdGF0ZS4gV2UgYWxzbyBrZWVwIHRyYWNrIG9mIHdoYXQgdGhlXG4gICAgICAvLyBjdXJyZW50IHByb21pc2UgaXMsIHNvIHRoYXQgd2UgY2FuIGRldGVjdCBvdmVybGFwcGluZyB0cmFuc2l0aW9ucyBhbmRcbiAgICAgIC8vIGtlZXAgb25seSB0aGUgb3V0Y29tZSBvZiB0aGUgbGFzdCB0cmFuc2l0aW9uLlxuICAgICAgdmFyIHRyYW5zaXRpb24gPSAkc3RhdGUudHJhbnNpdGlvbiA9IHJlc29sdmVkLnRoZW4oZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbCwgZW50ZXJpbmcsIGV4aXRpbmc7XG5cbiAgICAgICAgaWYgKCRzdGF0ZS50cmFuc2l0aW9uICE9PSB0cmFuc2l0aW9uKSByZXR1cm4gVHJhbnNpdGlvblN1cGVyc2VkZWQ7XG5cbiAgICAgICAgLy8gRXhpdCAnZnJvbScgc3RhdGVzIG5vdCBrZXB0XG4gICAgICAgIGZvciAobD1mcm9tUGF0aC5sZW5ndGgtMTsgbD49a2VlcDsgbC0tKSB7XG4gICAgICAgICAgZXhpdGluZyA9IGZyb21QYXRoW2xdO1xuICAgICAgICAgIGlmIChleGl0aW5nLnNlbGYub25FeGl0KSB7XG4gICAgICAgICAgICAkaW5qZWN0b3IuaW52b2tlKGV4aXRpbmcuc2VsZi5vbkV4aXQsIGV4aXRpbmcuc2VsZiwgZXhpdGluZy5sb2NhbHMuZ2xvYmFscyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGV4aXRpbmcubG9jYWxzID0gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEVudGVyICd0bycgc3RhdGVzIG5vdCBrZXB0XG4gICAgICAgIGZvciAobD1rZWVwOyBsPHRvUGF0aC5sZW5ndGg7IGwrKykge1xuICAgICAgICAgIGVudGVyaW5nID0gdG9QYXRoW2xdO1xuICAgICAgICAgIGVudGVyaW5nLmxvY2FscyA9IHRvTG9jYWxzW2xdO1xuICAgICAgICAgIGlmIChlbnRlcmluZy5zZWxmLm9uRW50ZXIpIHtcbiAgICAgICAgICAgICRpbmplY3Rvci5pbnZva2UoZW50ZXJpbmcuc2VsZi5vbkVudGVyLCBlbnRlcmluZy5zZWxmLCBlbnRlcmluZy5sb2NhbHMuZ2xvYmFscyk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUnVuIGl0IGFnYWluLCB0byBjYXRjaCBhbnkgdHJhbnNpdGlvbnMgaW4gY2FsbGJhY2tzXG4gICAgICAgIGlmICgkc3RhdGUudHJhbnNpdGlvbiAhPT0gdHJhbnNpdGlvbikgcmV0dXJuIFRyYW5zaXRpb25TdXBlcnNlZGVkO1xuXG4gICAgICAgIC8vIFVwZGF0ZSBnbG9iYWxzIGluICRzdGF0ZVxuICAgICAgICAkc3RhdGUuJGN1cnJlbnQgPSB0bztcbiAgICAgICAgJHN0YXRlLmN1cnJlbnQgPSB0by5zZWxmO1xuICAgICAgICAkc3RhdGUucGFyYW1zID0gdG9QYXJhbXM7XG4gICAgICAgIGNvcHkoJHN0YXRlLnBhcmFtcywgJHN0YXRlUGFyYW1zKTtcbiAgICAgICAgJHN0YXRlLnRyYW5zaXRpb24gPSBudWxsO1xuXG4gICAgICAgIC8vIFVwZGF0ZSAkbG9jYXRpb25cbiAgICAgICAgdmFyIHRvTmF2ID0gdG8ubmF2aWdhYmxlO1xuICAgICAgICBpZiAob3B0aW9ucy5sb2NhdGlvbiAmJiB0b05hdikge1xuICAgICAgICAgICRsb2NhdGlvbi51cmwodG9OYXYudXJsLmZvcm1hdCh0b05hdi5sb2NhbHMuZ2xvYmFscy4kc3RhdGVQYXJhbXMpKTtcblxuICAgICAgICAgIGlmIChvcHRpb25zLmxvY2F0aW9uID09PSAncmVwbGFjZScpIHtcbiAgICAgICAgICAgICRsb2NhdGlvbi5yZXBsYWNlKCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdGlvbnMubm90aWZ5KSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAbmdkb2MgZXZlbnRcbiAgICAgICAgICogQG5hbWUgdWkucm91dGVyLnN0YXRlLiRzdGF0ZSMkc3RhdGVDaGFuZ2VTdWNjZXNzXG4gICAgICAgICAqIEBldmVudE9mIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVcbiAgICAgICAgICogQGV2ZW50VHlwZSBicm9hZGNhc3Qgb24gcm9vdCBzY29wZVxuICAgICAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgICAgICogRmlyZWQgb25jZSB0aGUgc3RhdGUgdHJhbnNpdGlvbiBpcyAqKmNvbXBsZXRlKiouXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBldmVudCBFdmVudCBvYmplY3QuXG4gICAgICAgICAqIEBwYXJhbSB7U3RhdGV9IHRvU3RhdGUgVGhlIHN0YXRlIGJlaW5nIHRyYW5zaXRpb25lZCB0by5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHRvUGFyYW1zIFRoZSBwYXJhbXMgc3VwcGxpZWQgdG8gdGhlIGB0b1N0YXRlYC5cbiAgICAgICAgICogQHBhcmFtIHtTdGF0ZX0gZnJvbVN0YXRlIFRoZSBjdXJyZW50IHN0YXRlLCBwcmUtdHJhbnNpdGlvbi5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGZyb21QYXJhbXMgVGhlIHBhcmFtcyBzdXBwbGllZCB0byB0aGUgYGZyb21TdGF0ZWAuXG4gICAgICAgICAqL1xuICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnJHN0YXRlQ2hhbmdlU3VjY2VzcycsIHRvLnNlbGYsIHRvUGFyYW1zLCBmcm9tLnNlbGYsIGZyb21QYXJhbXMpO1xuICAgICAgICB9XG4gICAgICAgIGN1cnJlbnRMb2NhdGlvbiA9ICRsb2NhdGlvbi51cmwoKTtcblxuICAgICAgICByZXR1cm4gJHN0YXRlLmN1cnJlbnQ7XG4gICAgICB9LCBmdW5jdGlvbiAoZXJyb3IpIHtcbiAgICAgICAgaWYgKCRzdGF0ZS50cmFuc2l0aW9uICE9PSB0cmFuc2l0aW9uKSByZXR1cm4gVHJhbnNpdGlvblN1cGVyc2VkZWQ7XG5cbiAgICAgICAgJHN0YXRlLnRyYW5zaXRpb24gPSBudWxsO1xuICAgICAgICAvKipcbiAgICAgICAgICogQG5nZG9jIGV2ZW50XG4gICAgICAgICAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGUjJHN0YXRlQ2hhbmdlRXJyb3JcbiAgICAgICAgICogQGV2ZW50T2YgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVxuICAgICAgICAgKiBAZXZlbnRUeXBlIGJyb2FkY2FzdCBvbiByb290IHNjb3BlXG4gICAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICAgKiBGaXJlZCB3aGVuIGFuICoqZXJyb3Igb2NjdXJzKiogZHVyaW5nIHRyYW5zaXRpb24uIEl0J3MgaW1wb3J0YW50IHRvIG5vdGUgdGhhdCBpZiB5b3VcbiAgICAgICAgICogaGF2ZSBhbnkgZXJyb3JzIGluIHlvdXIgcmVzb2x2ZSBmdW5jdGlvbnMgKGphdmFzY3JpcHQgZXJyb3JzLCBub24tZXhpc3RlbnQgc2VydmljZXMsIGV0YylcbiAgICAgICAgICogdGhleSB3aWxsIG5vdCB0aHJvdyB0cmFkaXRpb25hbGx5LiBZb3UgbXVzdCBsaXN0ZW4gZm9yIHRoaXMgJHN0YXRlQ2hhbmdlRXJyb3IgZXZlbnQgdG9cbiAgICAgICAgICogY2F0Y2ggKipBTEwqKiBlcnJvcnMuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBldmVudCBFdmVudCBvYmplY3QuXG4gICAgICAgICAqIEBwYXJhbSB7U3RhdGV9IHRvU3RhdGUgVGhlIHN0YXRlIGJlaW5nIHRyYW5zaXRpb25lZCB0by5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IHRvUGFyYW1zIFRoZSBwYXJhbXMgc3VwcGxpZWQgdG8gdGhlIGB0b1N0YXRlYC5cbiAgICAgICAgICogQHBhcmFtIHtTdGF0ZX0gZnJvbVN0YXRlIFRoZSBjdXJyZW50IHN0YXRlLCBwcmUtdHJhbnNpdGlvbi5cbiAgICAgICAgICogQHBhcmFtIHtPYmplY3R9IGZyb21QYXJhbXMgVGhlIHBhcmFtcyBzdXBwbGllZCB0byB0aGUgYGZyb21TdGF0ZWAuXG4gICAgICAgICAqIEBwYXJhbSB7RXJyb3J9IGVycm9yIFRoZSByZXNvbHZlIGVycm9yIG9iamVjdC5cbiAgICAgICAgICovXG4gICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnJHN0YXRlQ2hhbmdlRXJyb3InLCB0by5zZWxmLCB0b1BhcmFtcywgZnJvbS5zZWxmLCBmcm9tUGFyYW1zLCBlcnJvcik7XG4gICAgICAgIHN5bmNVcmwoKTtcblxuICAgICAgICByZXR1cm4gJHEucmVqZWN0KGVycm9yKTtcbiAgICAgIH0pO1xuXG4gICAgICByZXR1cm4gdHJhbnNpdGlvbjtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAgICogQG5hbWUgdWkucm91dGVyLnN0YXRlLiRzdGF0ZSNpc1xuICAgICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlXG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBTaW1pbGFyIHRvIHtAbGluayB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlI21ldGhvZHNfaW5jbHVkZXMgJHN0YXRlLmluY2x1ZGVzfSxcbiAgICAgKiBidXQgb25seSBjaGVja3MgZm9yIHRoZSBmdWxsIHN0YXRlIG5hbWUuIElmIHBhcmFtcyBpcyBzdXBwbGllZCB0aGVuIGl0IHdpbGwgYmUgXG4gICAgICogdGVzdGVkIGZvciBzdHJpY3QgZXF1YWxpdHkgYWdhaW5zdCB0aGUgY3VycmVudCBhY3RpdmUgcGFyYW1zIG9iamVjdCwgc28gYWxsIHBhcmFtcyBcbiAgICAgKiBtdXN0IG1hdGNoIHdpdGggbm9uZSBtaXNzaW5nIGFuZCBubyBleHRyYXMuXG4gICAgICpcbiAgICAgKiBAZXhhbXBsZVxuICAgICAqIDxwcmU+XG4gICAgICogJHN0YXRlLmlzKCdjb250YWN0LmRldGFpbHMuaXRlbScpOyAvLyByZXR1cm5zIHRydWVcbiAgICAgKiAkc3RhdGUuaXMoY29udGFjdERldGFpbEl0ZW1TdGF0ZU9iamVjdCk7IC8vIHJldHVybnMgdHJ1ZVxuICAgICAqXG4gICAgICogLy8gZXZlcnl0aGluZyBlbHNlIHdvdWxkIHJldHVybiBmYWxzZVxuICAgICAqIDwvcHJlPlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSBzdGF0ZU5hbWUgVGhlIHN0YXRlIG5hbWUgb3Igc3RhdGUgb2JqZWN0IHlvdSdkIGxpa2UgdG8gY2hlY2suXG4gICAgICogQHBhcmFtIHtvYmplY3Q9fSBwYXJhbXMgQSBwYXJhbSBvYmplY3QsIGUuZy4gYHtzZWN0aW9uSWQ6IHNlY3Rpb24uaWR9YCwgdGhhdCB5b3UnZCBsaWtlIFxuICAgICAqIHRvIHRlc3QgYWdhaW5zdCB0aGUgY3VycmVudCBhY3RpdmUgc3RhdGUuXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiBpdCBpcyB0aGUgc3RhdGUuXG4gICAgICovXG4gICAgJHN0YXRlLmlzID0gZnVuY3Rpb24gaXMoc3RhdGVPck5hbWUsIHBhcmFtcykge1xuICAgICAgdmFyIHN0YXRlID0gZmluZFN0YXRlKHN0YXRlT3JOYW1lKTtcblxuICAgICAgaWYgKCFpc0RlZmluZWQoc3RhdGUpKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGlmICgkc3RhdGUuJGN1cnJlbnQgIT09IHN0YXRlKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGlzRGVmaW5lZChwYXJhbXMpICYmIHBhcmFtcyAhPT0gbnVsbCA/IGFuZ3VsYXIuZXF1YWxzKCRzdGF0ZVBhcmFtcywgcGFyYW1zKSA6IHRydWU7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgICAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGUjaW5jbHVkZXNcbiAgICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogQSBtZXRob2QgdG8gZGV0ZXJtaW5lIGlmIHRoZSBjdXJyZW50IGFjdGl2ZSBzdGF0ZSBpcyBlcXVhbCB0byBvciBpcyB0aGUgY2hpbGQgb2YgdGhlIFxuICAgICAqIHN0YXRlIHN0YXRlTmFtZS4gSWYgYW55IHBhcmFtcyBhcmUgcGFzc2VkIHRoZW4gdGhleSB3aWxsIGJlIHRlc3RlZCBmb3IgYSBtYXRjaCBhcyB3ZWxsLlxuICAgICAqIE5vdCBhbGwgdGhlIHBhcmFtZXRlcnMgbmVlZCB0byBiZSBwYXNzZWQsIGp1c3QgdGhlIG9uZXMgeW91J2QgbGlrZSB0byB0ZXN0IGZvciBlcXVhbGl0eS5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogPHByZT5cbiAgICAgKiAkc3RhdGUuJGN1cnJlbnQubmFtZSA9ICdjb250YWN0cy5kZXRhaWxzLml0ZW0nO1xuICAgICAqXG4gICAgICogJHN0YXRlLmluY2x1ZGVzKFwiY29udGFjdHNcIik7IC8vIHJldHVybnMgdHJ1ZVxuICAgICAqICRzdGF0ZS5pbmNsdWRlcyhcImNvbnRhY3RzLmRldGFpbHNcIik7IC8vIHJldHVybnMgdHJ1ZVxuICAgICAqICRzdGF0ZS5pbmNsdWRlcyhcImNvbnRhY3RzLmRldGFpbHMuaXRlbVwiKTsgLy8gcmV0dXJucyB0cnVlXG4gICAgICogJHN0YXRlLmluY2x1ZGVzKFwiY29udGFjdHMubGlzdFwiKTsgLy8gcmV0dXJucyBmYWxzZVxuICAgICAqICRzdGF0ZS5pbmNsdWRlcyhcImFib3V0XCIpOyAvLyByZXR1cm5zIGZhbHNlXG4gICAgICogPC9wcmU+XG4gICAgICpcbiAgICAgKiBAZGVzY3JpcHRpb25cbiAgICAgKiBCYXNpYyBnbG9iaW5nIHBhdHRlcm5zIHdpbGwgYWxzbyB3b3JrLlxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiA8cHJlPlxuICAgICAqICRzdGF0ZS4kY3VycmVudC5uYW1lID0gJ2NvbnRhY3RzLmRldGFpbHMuaXRlbS51cmwnO1xuICAgICAqXG4gICAgICogJHN0YXRlLmluY2x1ZGVzKFwiKi5kZXRhaWxzLiouKlwiKTsgLy8gcmV0dXJucyB0cnVlXG4gICAgICogJHN0YXRlLmluY2x1ZGVzKFwiKi5kZXRhaWxzLioqXCIpOyAvLyByZXR1cm5zIHRydWVcbiAgICAgKiAkc3RhdGUuaW5jbHVkZXMoXCIqKi5pdGVtLioqXCIpOyAvLyByZXR1cm5zIHRydWVcbiAgICAgKiAkc3RhdGUuaW5jbHVkZXMoXCIqLmRldGFpbHMuaXRlbS51cmxcIik7IC8vIHJldHVybnMgdHJ1ZVxuICAgICAqICRzdGF0ZS5pbmNsdWRlcyhcIiouZGV0YWlscy4qLnVybFwiKTsgLy8gcmV0dXJucyB0cnVlXG4gICAgICogJHN0YXRlLmluY2x1ZGVzKFwiKi5kZXRhaWxzLipcIik7IC8vIHJldHVybnMgZmFsc2VcbiAgICAgKiAkc3RhdGUuaW5jbHVkZXMoXCJpdGVtLioqXCIpOyAvLyByZXR1cm5zIGZhbHNlXG4gICAgICogPC9wcmU+XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gc3RhdGVPck5hbWUgQSBwYXJ0aWFsIG5hbWUgdG8gYmUgc2VhcmNoZWQgZm9yIHdpdGhpbiB0aGUgY3VycmVudCBzdGF0ZSBuYW1lLlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBwYXJhbXMgQSBwYXJhbSBvYmplY3QsIGUuZy4gYHtzZWN0aW9uSWQ6IHNlY3Rpb24uaWR9YCwgXG4gICAgICogdGhhdCB5b3UnZCBsaWtlIHRvIHRlc3QgYWdhaW5zdCB0aGUgY3VycmVudCBhY3RpdmUgc3RhdGUuXG4gICAgICogQHJldHVybnMge2Jvb2xlYW59IFJldHVybnMgdHJ1ZSBpZiBpdCBkb2VzIGluY2x1ZGUgdGhlIHN0YXRlXG4gICAgICovXG5cbiAgICAkc3RhdGUuaW5jbHVkZXMgPSBmdW5jdGlvbiBpbmNsdWRlcyhzdGF0ZU9yTmFtZSwgcGFyYW1zKSB7XG4gICAgICBpZiAoaXNTdHJpbmcoc3RhdGVPck5hbWUpICYmIGlzR2xvYihzdGF0ZU9yTmFtZSkpIHtcbiAgICAgICAgaWYgKGRvZXNTdGF0ZU1hdGNoR2xvYihzdGF0ZU9yTmFtZSkpIHtcbiAgICAgICAgICBzdGF0ZU9yTmFtZSA9ICRzdGF0ZS4kY3VycmVudC5uYW1lO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB2YXIgc3RhdGUgPSBmaW5kU3RhdGUoc3RhdGVPck5hbWUpO1xuICAgICAgaWYgKCFpc0RlZmluZWQoc3RhdGUpKSB7XG4gICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICB9XG5cbiAgICAgIGlmICghaXNEZWZpbmVkKCRzdGF0ZS4kY3VycmVudC5pbmNsdWRlc1tzdGF0ZS5uYW1lXSkpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfVxuXG4gICAgICB2YXIgdmFsaWRQYXJhbXMgPSB0cnVlO1xuICAgICAgYW5ndWxhci5mb3JFYWNoKHBhcmFtcywgZnVuY3Rpb24odmFsdWUsIGtleSkge1xuICAgICAgICBpZiAoIWlzRGVmaW5lZCgkc3RhdGVQYXJhbXNba2V5XSkgfHwgJHN0YXRlUGFyYW1zW2tleV0gIT09IHZhbHVlKSB7XG4gICAgICAgICAgdmFsaWRQYXJhbXMgPSBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gdmFsaWRQYXJhbXM7XG4gICAgfTtcblxuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAgICogQG5hbWUgdWkucm91dGVyLnN0YXRlLiRzdGF0ZSNocmVmXG4gICAgICogQG1ldGhvZE9mIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVcbiAgICAgKlxuICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAqIEEgdXJsIGdlbmVyYXRpb24gbWV0aG9kIHRoYXQgcmV0dXJucyB0aGUgY29tcGlsZWQgdXJsIGZvciB0aGUgZ2l2ZW4gc3RhdGUgcG9wdWxhdGVkIHdpdGggdGhlIGdpdmVuIHBhcmFtcy5cbiAgICAgKlxuICAgICAqIEBleGFtcGxlXG4gICAgICogPHByZT5cbiAgICAgKiBleHBlY3QoJHN0YXRlLmhyZWYoXCJhYm91dC5wZXJzb25cIiwgeyBwZXJzb246IFwiYm9iXCIgfSkpLnRvRXF1YWwoXCIvYWJvdXQvYm9iXCIpO1xuICAgICAqIDwvcHJlPlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSBzdGF0ZU9yTmFtZSBUaGUgc3RhdGUgbmFtZSBvciBzdGF0ZSBvYmplY3QgeW91J2QgbGlrZSB0byBnZW5lcmF0ZSBhIHVybCBmcm9tLlxuICAgICAqIEBwYXJhbSB7b2JqZWN0PX0gcGFyYW1zIEFuIG9iamVjdCBvZiBwYXJhbWV0ZXIgdmFsdWVzIHRvIGZpbGwgdGhlIHN0YXRlJ3MgcmVxdWlyZWQgcGFyYW1ldGVycy5cbiAgICAgKiBAcGFyYW0ge29iamVjdD19IG9wdGlvbnMgT3B0aW9ucyBvYmplY3QuIFRoZSBvcHRpb25zIGFyZTpcbiAgICAgKlxuICAgICAqIC0gKipgbG9zc3lgKiogLSB7Ym9vbGVhbj10cnVlfSAtICBJZiB0cnVlLCBhbmQgaWYgdGhlcmUgaXMgbm8gdXJsIGFzc29jaWF0ZWQgd2l0aCB0aGUgc3RhdGUgcHJvdmlkZWQgaW4gdGhlXG4gICAgICogICAgZmlyc3QgcGFyYW1ldGVyLCB0aGVuIHRoZSBjb25zdHJ1Y3RlZCBocmVmIHVybCB3aWxsIGJlIGJ1aWx0IGZyb20gdGhlIGZpcnN0IG5hdmlnYWJsZSBhbmNlc3RvciAoYWthXG4gICAgICogICAgYW5jZXN0b3Igd2l0aCBhIHZhbGlkIHVybCkuXG4gICAgICogLSAqKmBpbmhlcml0YCoqIC0ge2Jvb2xlYW49ZmFsc2V9LCBJZiBgdHJ1ZWAgd2lsbCBpbmhlcml0IHVybCBwYXJhbWV0ZXJzIGZyb20gY3VycmVudCB1cmwuXG4gICAgICogLSAqKmByZWxhdGl2ZWAqKiAtIHtvYmplY3Q9JHN0YXRlLiRjdXJyZW50fSwgV2hlbiB0cmFuc2l0aW9uaW5nIHdpdGggcmVsYXRpdmUgcGF0aCAoZS5nICdeJyksIFxuICAgICAqICAgIGRlZmluZXMgd2hpY2ggc3RhdGUgdG8gYmUgcmVsYXRpdmUgZnJvbS5cbiAgICAgKiAtICoqYGFic29sdXRlYCoqIC0ge2Jvb2xlYW49ZmFsc2V9LCAgSWYgdHJ1ZSB3aWxsIGdlbmVyYXRlIGFuIGFic29sdXRlIHVybCwgZS5nLiBcImh0dHA6Ly93d3cuZXhhbXBsZS5jb20vZnVsbHVybFwiLlxuICAgICAqIFxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IGNvbXBpbGVkIHN0YXRlIHVybFxuICAgICAqL1xuICAgICRzdGF0ZS5ocmVmID0gZnVuY3Rpb24gaHJlZihzdGF0ZU9yTmFtZSwgcGFyYW1zLCBvcHRpb25zKSB7XG4gICAgICBvcHRpb25zID0gZXh0ZW5kKHsgbG9zc3k6IHRydWUsIGluaGVyaXQ6IGZhbHNlLCBhYnNvbHV0ZTogZmFsc2UsIHJlbGF0aXZlOiAkc3RhdGUuJGN1cnJlbnQgfSwgb3B0aW9ucyB8fCB7fSk7XG4gICAgICB2YXIgc3RhdGUgPSBmaW5kU3RhdGUoc3RhdGVPck5hbWUsIG9wdGlvbnMucmVsYXRpdmUpO1xuICAgICAgaWYgKCFpc0RlZmluZWQoc3RhdGUpKSByZXR1cm4gbnVsbDtcblxuICAgICAgcGFyYW1zID0gaW5oZXJpdFBhcmFtcygkc3RhdGVQYXJhbXMsIHBhcmFtcyB8fCB7fSwgJHN0YXRlLiRjdXJyZW50LCBzdGF0ZSk7XG4gICAgICB2YXIgbmF2ID0gKHN0YXRlICYmIG9wdGlvbnMubG9zc3kpID8gc3RhdGUubmF2aWdhYmxlIDogc3RhdGU7XG4gICAgICB2YXIgdXJsID0gKG5hdiAmJiBuYXYudXJsKSA/IG5hdi51cmwuZm9ybWF0KG5vcm1hbGl6ZShzdGF0ZS5wYXJhbXMsIHBhcmFtcyB8fCB7fSkpIDogbnVsbDtcbiAgICAgIGlmICghJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKCkgJiYgdXJsKSB7XG4gICAgICAgIHVybCA9IFwiI1wiICsgJGxvY2F0aW9uUHJvdmlkZXIuaGFzaFByZWZpeCgpICsgdXJsO1xuICAgICAgfVxuXG4gICAgICBpZiAoYmFzZUhyZWYgIT09ICcvJykge1xuICAgICAgICBpZiAoJGxvY2F0aW9uUHJvdmlkZXIuaHRtbDVNb2RlKCkpIHtcbiAgICAgICAgICB1cmwgPSBiYXNlSHJlZi5zbGljZSgwLCAtMSkgKyB1cmw7XG4gICAgICAgIH0gZWxzZSBpZiAob3B0aW9ucy5hYnNvbHV0ZSl7XG4gICAgICAgICAgdXJsID0gYmFzZUhyZWYuc2xpY2UoMSkgKyB1cmw7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKG9wdGlvbnMuYWJzb2x1dGUgJiYgdXJsKSB7XG4gICAgICAgIHVybCA9ICRsb2NhdGlvbi5wcm90b2NvbCgpICsgJzovLycgKyBcbiAgICAgICAgICAgICAgJGxvY2F0aW9uLmhvc3QoKSArIFxuICAgICAgICAgICAgICAoJGxvY2F0aW9uLnBvcnQoKSA9PSA4MCB8fCAkbG9jYXRpb24ucG9ydCgpID09IDQ0MyA/ICcnIDogJzonICsgJGxvY2F0aW9uLnBvcnQoKSkgKyBcbiAgICAgICAgICAgICAgKCEkbG9jYXRpb25Qcm92aWRlci5odG1sNU1vZGUoKSAmJiB1cmwgPyAnLycgOiAnJykgKyBcbiAgICAgICAgICAgICAgdXJsO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHVybDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAgICogQG5hbWUgdWkucm91dGVyLnN0YXRlLiRzdGF0ZSNnZXRcbiAgICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVxuICAgICAqXG4gICAgICogQGRlc2NyaXB0aW9uXG4gICAgICogUmV0dXJucyB0aGUgc3RhdGUgY29uZmlndXJhdGlvbiBvYmplY3QgZm9yIGFueSBzcGVjaWZpYyBzdGF0ZSBvciBhbGwgc3RhdGVzLlxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0PX0gc3RhdGVPck5hbWUgSWYgcHJvdmlkZWQsIHdpbGwgb25seSBnZXQgdGhlIGNvbmZpZyBmb3JcbiAgICAgKiB0aGUgcmVxdWVzdGVkIHN0YXRlLiBJZiBub3QgcHJvdmlkZWQsIHJldHVybnMgYW4gYXJyYXkgb2YgQUxMIHN0YXRlIGNvbmZpZ3MuXG4gICAgICogQHJldHVybnMge29iamVjdHxhcnJheX0gU3RhdGUgY29uZmlndXJhdGlvbiBvYmplY3Qgb3IgYXJyYXkgb2YgYWxsIG9iamVjdHMuXG4gICAgICovXG4gICAgJHN0YXRlLmdldCA9IGZ1bmN0aW9uIChzdGF0ZU9yTmFtZSwgY29udGV4dCkge1xuICAgICAgaWYgKCFpc0RlZmluZWQoc3RhdGVPck5hbWUpKSB7XG4gICAgICAgIHZhciBsaXN0ID0gW107XG4gICAgICAgIGZvckVhY2goc3RhdGVzLCBmdW5jdGlvbihzdGF0ZSkgeyBsaXN0LnB1c2goc3RhdGUuc2VsZik7IH0pO1xuICAgICAgICByZXR1cm4gbGlzdDtcbiAgICAgIH1cbiAgICAgIHZhciBzdGF0ZSA9IGZpbmRTdGF0ZShzdGF0ZU9yTmFtZSwgY29udGV4dCk7XG4gICAgICByZXR1cm4gKHN0YXRlICYmIHN0YXRlLnNlbGYpID8gc3RhdGUuc2VsZiA6IG51bGw7XG4gICAgfTtcblxuICAgIGZ1bmN0aW9uIHJlc29sdmVTdGF0ZShzdGF0ZSwgcGFyYW1zLCBwYXJhbXNBcmVGaWx0ZXJlZCwgaW5oZXJpdGVkLCBkc3QpIHtcbiAgICAgIC8vIE1ha2UgYSByZXN0cmljdGVkICRzdGF0ZVBhcmFtcyB3aXRoIG9ubHkgdGhlIHBhcmFtZXRlcnMgdGhhdCBhcHBseSB0byB0aGlzIHN0YXRlIGlmXG4gICAgICAvLyBuZWNlc3NhcnkuIEluIGFkZGl0aW9uIHRvIGJlaW5nIGF2YWlsYWJsZSB0byB0aGUgY29udHJvbGxlciBhbmQgb25FbnRlci9vbkV4aXQgY2FsbGJhY2tzLFxuICAgICAgLy8gd2UgYWxzbyBuZWVkICRzdGF0ZVBhcmFtcyB0byBiZSBhdmFpbGFibGUgZm9yIGFueSAkaW5qZWN0b3IgY2FsbHMgd2UgbWFrZSBkdXJpbmcgdGhlXG4gICAgICAvLyBkZXBlbmRlbmN5IHJlc29sdXRpb24gcHJvY2Vzcy5cbiAgICAgIHZhciAkc3RhdGVQYXJhbXMgPSAocGFyYW1zQXJlRmlsdGVyZWQpID8gcGFyYW1zIDogZmlsdGVyQnlLZXlzKHN0YXRlLnBhcmFtcywgcGFyYW1zKTtcbiAgICAgIHZhciBsb2NhbHMgPSB7ICRzdGF0ZVBhcmFtczogJHN0YXRlUGFyYW1zIH07XG5cbiAgICAgIC8vIFJlc29sdmUgJ2dsb2JhbCcgZGVwZW5kZW5jaWVzIGZvciB0aGUgc3RhdGUsIGkuZS4gdGhvc2Ugbm90IHNwZWNpZmljIHRvIGEgdmlldy5cbiAgICAgIC8vIFdlJ3JlIGFsc28gaW5jbHVkaW5nICRzdGF0ZVBhcmFtcyBpbiB0aGlzOyB0aGF0IHdheSB0aGUgcGFyYW1ldGVycyBhcmUgcmVzdHJpY3RlZFxuICAgICAgLy8gdG8gdGhlIHNldCB0aGF0IHNob3VsZCBiZSB2aXNpYmxlIHRvIHRoZSBzdGF0ZSwgYW5kIGFyZSBpbmRlcGVuZGVudCBvZiB3aGVuIHdlIHVwZGF0ZVxuICAgICAgLy8gdGhlIGdsb2JhbCAkc3RhdGUgYW5kICRzdGF0ZVBhcmFtcyB2YWx1ZXMuXG4gICAgICBkc3QucmVzb2x2ZSA9ICRyZXNvbHZlLnJlc29sdmUoc3RhdGUucmVzb2x2ZSwgbG9jYWxzLCBkc3QucmVzb2x2ZSwgc3RhdGUpO1xuICAgICAgdmFyIHByb21pc2VzID0gWyBkc3QucmVzb2x2ZS50aGVuKGZ1bmN0aW9uIChnbG9iYWxzKSB7XG4gICAgICAgIGRzdC5nbG9iYWxzID0gZ2xvYmFscztcbiAgICAgIH0pIF07XG4gICAgICBpZiAoaW5oZXJpdGVkKSBwcm9taXNlcy5wdXNoKGluaGVyaXRlZCk7XG5cbiAgICAgIC8vIFJlc29sdmUgdGVtcGxhdGUgYW5kIGRlcGVuZGVuY2llcyBmb3IgYWxsIHZpZXdzLlxuICAgICAgZm9yRWFjaChzdGF0ZS52aWV3cywgZnVuY3Rpb24gKHZpZXcsIG5hbWUpIHtcbiAgICAgICAgdmFyIGluamVjdGFibGVzID0gKHZpZXcucmVzb2x2ZSAmJiB2aWV3LnJlc29sdmUgIT09IHN0YXRlLnJlc29sdmUgPyB2aWV3LnJlc29sdmUgOiB7fSk7XG4gICAgICAgIGluamVjdGFibGVzLiR0ZW1wbGF0ZSA9IFsgZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiAkdmlldy5sb2FkKG5hbWUsIHsgdmlldzogdmlldywgbG9jYWxzOiBsb2NhbHMsIHBhcmFtczogJHN0YXRlUGFyYW1zLCBub3RpZnk6IGZhbHNlIH0pIHx8ICcnO1xuICAgICAgICB9XTtcblxuICAgICAgICBwcm9taXNlcy5wdXNoKCRyZXNvbHZlLnJlc29sdmUoaW5qZWN0YWJsZXMsIGxvY2FscywgZHN0LnJlc29sdmUsIHN0YXRlKS50aGVuKGZ1bmN0aW9uIChyZXN1bHQpIHtcbiAgICAgICAgICAvLyBSZWZlcmVuY2VzIHRvIHRoZSBjb250cm9sbGVyIChvbmx5IGluc3RhbnRpYXRlZCBhdCBsaW5rIHRpbWUpXG4gICAgICAgICAgaWYgKGlzRnVuY3Rpb24odmlldy5jb250cm9sbGVyUHJvdmlkZXIpIHx8IGlzQXJyYXkodmlldy5jb250cm9sbGVyUHJvdmlkZXIpKSB7XG4gICAgICAgICAgICB2YXIgaW5qZWN0TG9jYWxzID0gYW5ndWxhci5leHRlbmQoe30sIGluamVjdGFibGVzLCBsb2NhbHMpO1xuICAgICAgICAgICAgcmVzdWx0LiQkY29udHJvbGxlciA9ICRpbmplY3Rvci5pbnZva2Uodmlldy5jb250cm9sbGVyUHJvdmlkZXIsIG51bGwsIGluamVjdExvY2Fscyk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlc3VsdC4kJGNvbnRyb2xsZXIgPSB2aWV3LmNvbnRyb2xsZXI7XG4gICAgICAgICAgfVxuICAgICAgICAgIC8vIFByb3ZpZGUgYWNjZXNzIHRvIHRoZSBzdGF0ZSBpdHNlbGYgZm9yIGludGVybmFsIHVzZVxuICAgICAgICAgIHJlc3VsdC4kJHN0YXRlID0gc3RhdGU7XG4gICAgICAgICAgcmVzdWx0LiQkY29udHJvbGxlckFzID0gdmlldy5jb250cm9sbGVyQXM7XG4gICAgICAgICAgZHN0W25hbWVdID0gcmVzdWx0O1xuICAgICAgICB9KSk7XG4gICAgICB9KTtcblxuICAgICAgLy8gV2FpdCBmb3IgYWxsIHRoZSBwcm9taXNlcyBhbmQgdGhlbiByZXR1cm4gdGhlIGFjdGl2YXRpb24gb2JqZWN0XG4gICAgICByZXR1cm4gJHEuYWxsKHByb21pc2VzKS50aGVuKGZ1bmN0aW9uICh2YWx1ZXMpIHtcbiAgICAgICAgcmV0dXJuIGRzdDtcbiAgICAgIH0pO1xuICAgIH1cblxuICAgIHJldHVybiAkc3RhdGU7XG4gIH1cblxuICBmdW5jdGlvbiBzaG91bGRUcmlnZ2VyUmVsb2FkKHRvLCBmcm9tLCBsb2NhbHMsIG9wdGlvbnMpIHtcbiAgICBpZiAoIHRvID09PSBmcm9tICYmICgobG9jYWxzID09PSBmcm9tLmxvY2FscyAmJiAhb3B0aW9ucy5yZWxvYWQpIHx8ICh0by5zZWxmLnJlbG9hZE9uU2VhcmNoID09PSBmYWxzZSkpICkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCd1aS5yb3V0ZXIuc3RhdGUnKVxuICAudmFsdWUoJyRzdGF0ZVBhcmFtcycsIHt9KVxuICAucHJvdmlkZXIoJyRzdGF0ZScsICRTdGF0ZVByb3ZpZGVyKTtcblxuXG4kVmlld1Byb3ZpZGVyLiRpbmplY3QgPSBbXTtcbmZ1bmN0aW9uICRWaWV3UHJvdmlkZXIoKSB7XG5cbiAgdGhpcy4kZ2V0ID0gJGdldDtcbiAgLyoqXG4gICAqIEBuZ2RvYyBvYmplY3RcbiAgICogQG5hbWUgdWkucm91dGVyLnN0YXRlLiR2aWV3XG4gICAqXG4gICAqIEByZXF1aXJlcyB1aS5yb3V0ZXIudXRpbC4kdGVtcGxhdGVGYWN0b3J5XG4gICAqIEByZXF1aXJlcyAkcm9vdFNjb3BlXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKlxuICAgKi9cbiAgJGdldC4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJywgJyR0ZW1wbGF0ZUZhY3RvcnknXTtcbiAgZnVuY3Rpb24gJGdldCggICAkcm9vdFNjb3BlLCAgICR0ZW1wbGF0ZUZhY3RvcnkpIHtcbiAgICByZXR1cm4ge1xuICAgICAgLy8gJHZpZXcubG9hZCgnZnVsbC52aWV3TmFtZScsIHsgdGVtcGxhdGU6IC4uLiwgY29udHJvbGxlcjogLi4uLCByZXNvbHZlOiAuLi4sIGFzeW5jOiBmYWxzZSwgcGFyYW1zOiAuLi4gfSlcbiAgICAgIC8qKlxuICAgICAgICogQG5nZG9jIGZ1bmN0aW9uXG4gICAgICAgKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHZpZXcjbG9hZFxuICAgICAgICogQG1ldGhvZE9mIHVpLnJvdXRlci5zdGF0ZS4kdmlld1xuICAgICAgICpcbiAgICAgICAqIEBkZXNjcmlwdGlvblxuICAgICAgICpcbiAgICAgICAqIEBwYXJhbSB7c3RyaW5nfSBuYW1lIG5hbWVcbiAgICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIG9wdGlvbiBvYmplY3QuXG4gICAgICAgKi9cbiAgICAgIGxvYWQ6IGZ1bmN0aW9uIGxvYWQobmFtZSwgb3B0aW9ucykge1xuICAgICAgICB2YXIgcmVzdWx0LCBkZWZhdWx0cyA9IHtcbiAgICAgICAgICB0ZW1wbGF0ZTogbnVsbCwgY29udHJvbGxlcjogbnVsbCwgdmlldzogbnVsbCwgbG9jYWxzOiBudWxsLCBub3RpZnk6IHRydWUsIGFzeW5jOiB0cnVlLCBwYXJhbXM6IHt9XG4gICAgICAgIH07XG4gICAgICAgIG9wdGlvbnMgPSBleHRlbmQoZGVmYXVsdHMsIG9wdGlvbnMpO1xuXG4gICAgICAgIGlmIChvcHRpb25zLnZpZXcpIHtcbiAgICAgICAgICByZXN1bHQgPSAkdGVtcGxhdGVGYWN0b3J5LmZyb21Db25maWcob3B0aW9ucy52aWV3LCBvcHRpb25zLnBhcmFtcywgb3B0aW9ucy5sb2NhbHMpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChyZXN1bHQgJiYgb3B0aW9ucy5ub3RpZnkpIHtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEBuZ2RvYyBldmVudFxuICAgICAgICAgKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlIyR2aWV3Q29udGVudExvYWRpbmdcbiAgICAgICAgICogQGV2ZW50T2YgdWkucm91dGVyLnN0YXRlLiR2aWV3XG4gICAgICAgICAqIEBldmVudFR5cGUgYnJvYWRjYXN0IG9uIHJvb3Qgc2NvcGVcbiAgICAgICAgICogQGRlc2NyaXB0aW9uXG4gICAgICAgICAqXG4gICAgICAgICAqIEZpcmVkIG9uY2UgdGhlIHZpZXcgKipiZWdpbnMgbG9hZGluZyoqLCAqYmVmb3JlKiB0aGUgRE9NIGlzIHJlbmRlcmVkLlxuICAgICAgICAgKlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gZXZlbnQgRXZlbnQgb2JqZWN0LlxuICAgICAgICAgKiBAcGFyYW0ge09iamVjdH0gdmlld0NvbmZpZyBUaGUgdmlldyBjb25maWcgcHJvcGVydGllcyAodGVtcGxhdGUsIGNvbnRyb2xsZXIsIGV0YykuXG4gICAgICAgICAqXG4gICAgICAgICAqIEBleGFtcGxlXG4gICAgICAgICAqXG4gICAgICAgICAqIDxwcmU+XG4gICAgICAgICAqICRzY29wZS4kb24oJyR2aWV3Q29udGVudExvYWRpbmcnLFxuICAgICAgICAgKiBmdW5jdGlvbihldmVudCwgdmlld0NvbmZpZyl7XG4gICAgICAgICAqICAgICAvLyBBY2Nlc3MgdG8gYWxsIHRoZSB2aWV3IGNvbmZpZyBwcm9wZXJ0aWVzLlxuICAgICAgICAgKiAgICAgLy8gYW5kIG9uZSBzcGVjaWFsIHByb3BlcnR5ICd0YXJnZXRWaWV3J1xuICAgICAgICAgKiAgICAgLy8gdmlld0NvbmZpZy50YXJnZXRWaWV3XG4gICAgICAgICAqIH0pO1xuICAgICAgICAgKiA8L3ByZT5cbiAgICAgICAgICovXG4gICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckdmlld0NvbnRlbnRMb2FkaW5nJywgb3B0aW9ucyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgIH1cbiAgICB9O1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCd1aS5yb3V0ZXIuc3RhdGUnKS5wcm92aWRlcignJHZpZXcnLCAkVmlld1Byb3ZpZGVyKTtcblxuLyoqXG4gKiBAbmdkb2Mgb2JqZWN0XG4gKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHVpVmlld1Njcm9sbFByb3ZpZGVyXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBQcm92aWRlciB0aGF0IHJldHVybnMgdGhlIHtAbGluayB1aS5yb3V0ZXIuc3RhdGUuJHVpVmlld1Njcm9sbH0gc2VydmljZSBmdW5jdGlvbi5cbiAqL1xuZnVuY3Rpb24gJFZpZXdTY3JvbGxQcm92aWRlcigpIHtcblxuICB2YXIgdXNlQW5jaG9yU2Nyb2xsID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBmdW5jdGlvblxuICAgKiBAbmFtZSB1aS5yb3V0ZXIuc3RhdGUuJHVpVmlld1Njcm9sbFByb3ZpZGVyI3VzZUFuY2hvclNjcm9sbFxuICAgKiBAbWV0aG9kT2YgdWkucm91dGVyLnN0YXRlLiR1aVZpZXdTY3JvbGxQcm92aWRlclxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogUmV2ZXJ0cyBiYWNrIHRvIHVzaW5nIHRoZSBjb3JlIFtgJGFuY2hvclNjcm9sbGBdKGh0dHA6Ly9kb2NzLmFuZ3VsYXJqcy5vcmcvYXBpL25nLiRhbmNob3JTY3JvbGwpIHNlcnZpY2UgZm9yXG4gICAqIHNjcm9sbGluZyBiYXNlZCBvbiB0aGUgdXJsIGFuY2hvci5cbiAgICovXG4gIHRoaXMudXNlQW5jaG9yU2Nyb2xsID0gZnVuY3Rpb24gKCkge1xuICAgIHVzZUFuY2hvclNjcm9sbCA9IHRydWU7XG4gIH07XG5cbiAgLyoqXG4gICAqIEBuZ2RvYyBvYmplY3RcbiAgICogQG5hbWUgdWkucm91dGVyLnN0YXRlLiR1aVZpZXdTY3JvbGxcbiAgICpcbiAgICogQHJlcXVpcmVzICRhbmNob3JTY3JvbGxcbiAgICogQHJlcXVpcmVzICR0aW1lb3V0XG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBXaGVuIGNhbGxlZCB3aXRoIGEganFMaXRlIGVsZW1lbnQsIGl0IHNjcm9sbHMgdGhlIGVsZW1lbnQgaW50byB2aWV3IChhZnRlciBhXG4gICAqIGAkdGltZW91dGAgc28gdGhlIERPTSBoYXMgdGltZSB0byByZWZyZXNoKS5cbiAgICpcbiAgICogSWYgeW91IHByZWZlciB0byByZWx5IG9uIGAkYW5jaG9yU2Nyb2xsYCB0byBzY3JvbGwgdGhlIHZpZXcgdG8gdGhlIGFuY2hvcixcbiAgICogdGhpcyBjYW4gYmUgZW5hYmxlZCBieSBjYWxsaW5nIHtAbGluayB1aS5yb3V0ZXIuc3RhdGUuJHVpVmlld1Njcm9sbFByb3ZpZGVyI21ldGhvZHNfdXNlQW5jaG9yU2Nyb2xsIGAkdWlWaWV3U2Nyb2xsUHJvdmlkZXIudXNlQW5jaG9yU2Nyb2xsKClgfS5cbiAgICovXG4gIHRoaXMuJGdldCA9IFsnJGFuY2hvclNjcm9sbCcsICckdGltZW91dCcsIGZ1bmN0aW9uICgkYW5jaG9yU2Nyb2xsLCAkdGltZW91dCkge1xuICAgIGlmICh1c2VBbmNob3JTY3JvbGwpIHtcbiAgICAgIHJldHVybiAkYW5jaG9yU2Nyb2xsO1xuICAgIH1cblxuICAgIHJldHVybiBmdW5jdGlvbiAoJGVsZW1lbnQpIHtcbiAgICAgICR0aW1lb3V0KGZ1bmN0aW9uICgpIHtcbiAgICAgICAgJGVsZW1lbnRbMF0uc2Nyb2xsSW50b1ZpZXcoKTtcbiAgICAgIH0sIDAsIGZhbHNlKTtcbiAgICB9O1xuICB9XTtcbn1cblxuYW5ndWxhci5tb2R1bGUoJ3VpLnJvdXRlci5zdGF0ZScpLnByb3ZpZGVyKCckdWlWaWV3U2Nyb2xsJywgJFZpZXdTY3JvbGxQcm92aWRlcik7XG5cbi8qKlxuICogQG5nZG9jIGRpcmVjdGl2ZVxuICogQG5hbWUgdWkucm91dGVyLnN0YXRlLmRpcmVjdGl2ZTp1aS12aWV3XG4gKlxuICogQHJlcXVpcmVzIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVcbiAqIEByZXF1aXJlcyAkY29tcGlsZVxuICogQHJlcXVpcmVzICRjb250cm9sbGVyXG4gKiBAcmVxdWlyZXMgJGluamVjdG9yXG4gKiBAcmVxdWlyZXMgdWkucm91dGVyLnN0YXRlLiR1aVZpZXdTY3JvbGxcbiAqIEByZXF1aXJlcyAkZG9jdW1lbnRcbiAqXG4gKiBAcmVzdHJpY3QgRUNBXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBUaGUgdWktdmlldyBkaXJlY3RpdmUgdGVsbHMgJHN0YXRlIHdoZXJlIHRvIHBsYWNlIHlvdXIgdGVtcGxhdGVzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nPX0gdWktdmlldyBBIHZpZXcgbmFtZS4gVGhlIG5hbWUgc2hvdWxkIGJlIHVuaXF1ZSBhbW9uZ3N0IHRoZSBvdGhlciB2aWV3cyBpbiB0aGVcbiAqIHNhbWUgc3RhdGUuIFlvdSBjYW4gaGF2ZSB2aWV3cyBvZiB0aGUgc2FtZSBuYW1lIHRoYXQgbGl2ZSBpbiBkaWZmZXJlbnQgc3RhdGVzLlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nPX0gYXV0b3Njcm9sbCBJdCBhbGxvd3MgeW91IHRvIHNldCB0aGUgc2Nyb2xsIGJlaGF2aW9yIG9mIHRoZSBicm93c2VyIHdpbmRvd1xuICogd2hlbiBhIHZpZXcgaXMgcG9wdWxhdGVkLiBCeSBkZWZhdWx0LCAkYW5jaG9yU2Nyb2xsIGlzIG92ZXJyaWRkZW4gYnkgdWktcm91dGVyJ3MgY3VzdG9tIHNjcm9sbFxuICogc2VydmljZSwge0BsaW5rIHVpLnJvdXRlci5zdGF0ZS4kdWlWaWV3U2Nyb2xsfS4gVGhpcyBjdXN0b20gc2VydmljZSBsZXQncyB5b3VcbiAqIHNjcm9sbCB1aS12aWV3IGVsZW1lbnRzIGludG8gdmlldyB3aGVuIHRoZXkgYXJlIHBvcHVsYXRlZCBkdXJpbmcgYSBzdGF0ZSBhY3RpdmF0aW9uLlxuICpcbiAqICpOb3RlOiBUbyByZXZlcnQgYmFjayB0byBvbGQgW2AkYW5jaG9yU2Nyb2xsYF0oaHR0cDovL2RvY3MuYW5ndWxhcmpzLm9yZy9hcGkvbmcuJGFuY2hvclNjcm9sbClcbiAqIGZ1bmN0aW9uYWxpdHksIGNhbGwgYCR1aVZpZXdTY3JvbGxQcm92aWRlci51c2VBbmNob3JTY3JvbGwoKWAuKlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nPX0gb25sb2FkIEV4cHJlc3Npb24gdG8gZXZhbHVhdGUgd2hlbmV2ZXIgdGhlIHZpZXcgdXBkYXRlcy5cbiAqIFxuICogQGV4YW1wbGVcbiAqIEEgdmlldyBjYW4gYmUgdW5uYW1lZCBvciBuYW1lZC4gXG4gKiA8cHJlPlxuICogPCEtLSBVbm5hbWVkIC0tPlxuICogPGRpdiB1aS12aWV3PjwvZGl2PiBcbiAqIFxuICogPCEtLSBOYW1lZCAtLT5cbiAqIDxkaXYgdWktdmlldz1cInZpZXdOYW1lXCI+PC9kaXY+XG4gKiA8L3ByZT5cbiAqXG4gKiBZb3UgY2FuIG9ubHkgaGF2ZSBvbmUgdW5uYW1lZCB2aWV3IHdpdGhpbiBhbnkgdGVtcGxhdGUgKG9yIHJvb3QgaHRtbCkuIElmIHlvdSBhcmUgb25seSB1c2luZyBhIFxuICogc2luZ2xlIHZpZXcgYW5kIGl0IGlzIHVubmFtZWQgdGhlbiB5b3UgY2FuIHBvcHVsYXRlIGl0IGxpa2Ugc286XG4gKiA8cHJlPlxuICogPGRpdiB1aS12aWV3PjwvZGl2PiBcbiAqICRzdGF0ZVByb3ZpZGVyLnN0YXRlKFwiaG9tZVwiLCB7XG4gKiAgIHRlbXBsYXRlOiBcIjxoMT5IRUxMTyE8L2gxPlwiXG4gKiB9KVxuICogPC9wcmU+XG4gKiBcbiAqIFRoZSBhYm92ZSBpcyBhIGNvbnZlbmllbnQgc2hvcnRjdXQgZXF1aXZhbGVudCB0byBzcGVjaWZ5aW5nIHlvdXIgdmlldyBleHBsaWNpdGx5IHdpdGggdGhlIHtAbGluayB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlUHJvdmlkZXIjdmlld3MgYHZpZXdzYH1cbiAqIGNvbmZpZyBwcm9wZXJ0eSwgYnkgbmFtZSwgaW4gdGhpcyBjYXNlIGFuIGVtcHR5IG5hbWU6XG4gKiA8cHJlPlxuICogJHN0YXRlUHJvdmlkZXIuc3RhdGUoXCJob21lXCIsIHtcbiAqICAgdmlld3M6IHtcbiAqICAgICBcIlwiOiB7XG4gKiAgICAgICB0ZW1wbGF0ZTogXCI8aDE+SEVMTE8hPC9oMT5cIlxuICogICAgIH1cbiAqICAgfSAgICBcbiAqIH0pXG4gKiA8L3ByZT5cbiAqIFxuICogQnV0IHR5cGljYWxseSB5b3UnbGwgb25seSB1c2UgdGhlIHZpZXdzIHByb3BlcnR5IGlmIHlvdSBuYW1lIHlvdXIgdmlldyBvciBoYXZlIG1vcmUgdGhhbiBvbmUgdmlldyBcbiAqIGluIHRoZSBzYW1lIHRlbXBsYXRlLiBUaGVyZSdzIG5vdCByZWFsbHkgYSBjb21wZWxsaW5nIHJlYXNvbiB0byBuYW1lIGEgdmlldyBpZiBpdHMgdGhlIG9ubHkgb25lLCBcbiAqIGJ1dCB5b3UgY291bGQgaWYgeW91IHdhbnRlZCwgbGlrZSBzbzpcbiAqIDxwcmU+XG4gKiA8ZGl2IHVpLXZpZXc9XCJtYWluXCI+PC9kaXY+XG4gKiA8L3ByZT4gXG4gKiA8cHJlPlxuICogJHN0YXRlUHJvdmlkZXIuc3RhdGUoXCJob21lXCIsIHtcbiAqICAgdmlld3M6IHtcbiAqICAgICBcIm1haW5cIjoge1xuICogICAgICAgdGVtcGxhdGU6IFwiPGgxPkhFTExPITwvaDE+XCJcbiAqICAgICB9XG4gKiAgIH0gICAgXG4gKiB9KVxuICogPC9wcmU+XG4gKiBcbiAqIFJlYWxseSB0aG91Z2gsIHlvdSdsbCB1c2Ugdmlld3MgdG8gc2V0IHVwIG11bHRpcGxlIHZpZXdzOlxuICogPHByZT5cbiAqIDxkaXYgdWktdmlldz48L2Rpdj5cbiAqIDxkaXYgdWktdmlldz1cImNoYXJ0XCI+PC9kaXY+IFxuICogPGRpdiB1aS12aWV3PVwiZGF0YVwiPjwvZGl2PiBcbiAqIDwvcHJlPlxuICogXG4gKiA8cHJlPlxuICogJHN0YXRlUHJvdmlkZXIuc3RhdGUoXCJob21lXCIsIHtcbiAqICAgdmlld3M6IHtcbiAqICAgICBcIlwiOiB7XG4gKiAgICAgICB0ZW1wbGF0ZTogXCI8aDE+SEVMTE8hPC9oMT5cIlxuICogICAgIH0sXG4gKiAgICAgXCJjaGFydFwiOiB7XG4gKiAgICAgICB0ZW1wbGF0ZTogXCI8Y2hhcnRfdGhpbmcvPlwiXG4gKiAgICAgfSxcbiAqICAgICBcImRhdGFcIjoge1xuICogICAgICAgdGVtcGxhdGU6IFwiPGRhdGFfdGhpbmcvPlwiXG4gKiAgICAgfVxuICogICB9ICAgIFxuICogfSlcbiAqIDwvcHJlPlxuICpcbiAqIEV4YW1wbGVzIGZvciBgYXV0b3Njcm9sbGA6XG4gKlxuICogPHByZT5cbiAqIDwhLS0gSWYgYXV0b3Njcm9sbCBwcmVzZW50IHdpdGggbm8gZXhwcmVzc2lvbixcbiAqICAgICAgdGhlbiBzY3JvbGwgdWktdmlldyBpbnRvIHZpZXcgLS0+XG4gKiA8dWktdmlldyBhdXRvc2Nyb2xsLz5cbiAqXG4gKiA8IS0tIElmIGF1dG9zY3JvbGwgcHJlc2VudCB3aXRoIHZhbGlkIGV4cHJlc3Npb24sXG4gKiAgICAgIHRoZW4gc2Nyb2xsIHVpLXZpZXcgaW50byB2aWV3IGlmIGV4cHJlc3Npb24gZXZhbHVhdGVzIHRvIHRydWUgLS0+XG4gKiA8dWktdmlldyBhdXRvc2Nyb2xsPSd0cnVlJy8+XG4gKiA8dWktdmlldyBhdXRvc2Nyb2xsPSdmYWxzZScvPlxuICogPHVpLXZpZXcgYXV0b3Njcm9sbD0nc2NvcGVWYXJpYWJsZScvPlxuICogPC9wcmU+XG4gKi9cbiRWaWV3RGlyZWN0aXZlLiRpbmplY3QgPSBbJyRzdGF0ZScsICckaW5qZWN0b3InLCAnJHVpVmlld1Njcm9sbCddO1xuZnVuY3Rpb24gJFZpZXdEaXJlY3RpdmUoICAgJHN0YXRlLCAgICRpbmplY3RvciwgICAkdWlWaWV3U2Nyb2xsKSB7XG5cbiAgZnVuY3Rpb24gZ2V0U2VydmljZSgpIHtcbiAgICByZXR1cm4gKCRpbmplY3Rvci5oYXMpID8gZnVuY3Rpb24oc2VydmljZSkge1xuICAgICAgcmV0dXJuICRpbmplY3Rvci5oYXMoc2VydmljZSkgPyAkaW5qZWN0b3IuZ2V0KHNlcnZpY2UpIDogbnVsbDtcbiAgICB9IDogZnVuY3Rpb24oc2VydmljZSkge1xuICAgICAgdHJ5IHtcbiAgICAgICAgcmV0dXJuICRpbmplY3Rvci5nZXQoc2VydmljZSk7XG4gICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgICAgfVxuICAgIH07XG4gIH1cblxuICB2YXIgc2VydmljZSA9IGdldFNlcnZpY2UoKSxcbiAgICAgICRhbmltYXRvciA9IHNlcnZpY2UoJyRhbmltYXRvcicpLFxuICAgICAgJGFuaW1hdGUgPSBzZXJ2aWNlKCckYW5pbWF0ZScpO1xuXG4gIC8vIFJldHVybnMgYSBzZXQgb2YgRE9NIG1hbmlwdWxhdGlvbiBmdW5jdGlvbnMgYmFzZWQgb24gd2hpY2ggQW5ndWxhciB2ZXJzaW9uXG4gIC8vIGl0IHNob3VsZCB1c2VcbiAgZnVuY3Rpb24gZ2V0UmVuZGVyZXIoYXR0cnMsIHNjb3BlKSB7XG4gICAgdmFyIHN0YXRpY3MgPSBmdW5jdGlvbigpIHtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIGVudGVyOiBmdW5jdGlvbiAoZWxlbWVudCwgdGFyZ2V0LCBjYikgeyB0YXJnZXQuYWZ0ZXIoZWxlbWVudCk7IGNiKCk7IH0sXG4gICAgICAgIGxlYXZlOiBmdW5jdGlvbiAoZWxlbWVudCwgY2IpIHsgZWxlbWVudC5yZW1vdmUoKTsgY2IoKTsgfVxuICAgICAgfTtcbiAgICB9O1xuXG4gICAgaWYgKCRhbmltYXRlKSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBlbnRlcjogZnVuY3Rpb24oZWxlbWVudCwgdGFyZ2V0LCBjYikgeyAkYW5pbWF0ZS5lbnRlcihlbGVtZW50LCBudWxsLCB0YXJnZXQsIGNiKTsgfSxcbiAgICAgICAgbGVhdmU6IGZ1bmN0aW9uKGVsZW1lbnQsIGNiKSB7ICRhbmltYXRlLmxlYXZlKGVsZW1lbnQsIGNiKTsgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoJGFuaW1hdG9yKSB7XG4gICAgICB2YXIgYW5pbWF0ZSA9ICRhbmltYXRvciAmJiAkYW5pbWF0b3Ioc2NvcGUsIGF0dHJzKTtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgZW50ZXI6IGZ1bmN0aW9uKGVsZW1lbnQsIHRhcmdldCwgY2IpIHthbmltYXRlLmVudGVyKGVsZW1lbnQsIG51bGwsIHRhcmdldCk7IGNiKCk7IH0sXG4gICAgICAgIGxlYXZlOiBmdW5jdGlvbihlbGVtZW50LCBjYikgeyBhbmltYXRlLmxlYXZlKGVsZW1lbnQpOyBjYigpOyB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIHJldHVybiBzdGF0aWNzKCk7XG4gIH1cblxuICB2YXIgZGlyZWN0aXZlID0ge1xuICAgIHJlc3RyaWN0OiAnRUNBJyxcbiAgICB0ZXJtaW5hbDogdHJ1ZSxcbiAgICBwcmlvcml0eTogNDAwLFxuICAgIHRyYW5zY2x1ZGU6ICdlbGVtZW50JyxcbiAgICBjb21waWxlOiBmdW5jdGlvbiAodEVsZW1lbnQsIHRBdHRycywgJHRyYW5zY2x1ZGUpIHtcbiAgICAgIHJldHVybiBmdW5jdGlvbiAoc2NvcGUsICRlbGVtZW50LCBhdHRycykge1xuICAgICAgICB2YXIgcHJldmlvdXNFbCwgY3VycmVudEVsLCBjdXJyZW50U2NvcGUsIGxhdGVzdExvY2FscyxcbiAgICAgICAgICAgIG9ubG9hZEV4cCAgICAgPSBhdHRycy5vbmxvYWQgfHwgJycsXG4gICAgICAgICAgICBhdXRvU2Nyb2xsRXhwID0gYXR0cnMuYXV0b3Njcm9sbCxcbiAgICAgICAgICAgIHJlbmRlcmVyICAgICAgPSBnZXRSZW5kZXJlcihhdHRycywgc2NvcGUpO1xuXG4gICAgICAgIHNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsIGZ1bmN0aW9uKCkge1xuICAgICAgICAgIHVwZGF0ZVZpZXcoZmFsc2UpO1xuICAgICAgICB9KTtcbiAgICAgICAgc2NvcGUuJG9uKCckdmlld0NvbnRlbnRMb2FkaW5nJywgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgdXBkYXRlVmlldyhmYWxzZSk7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIHVwZGF0ZVZpZXcodHJ1ZSk7XG5cbiAgICAgICAgZnVuY3Rpb24gY2xlYW51cExhc3RWaWV3KCkge1xuICAgICAgICAgIGlmIChwcmV2aW91c0VsKSB7XG4gICAgICAgICAgICBwcmV2aW91c0VsLnJlbW92ZSgpO1xuICAgICAgICAgICAgcHJldmlvdXNFbCA9IG51bGw7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgaWYgKGN1cnJlbnRTY29wZSkge1xuICAgICAgICAgICAgY3VycmVudFNjb3BlLiRkZXN0cm95KCk7XG4gICAgICAgICAgICBjdXJyZW50U2NvcGUgPSBudWxsO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIGlmIChjdXJyZW50RWwpIHtcbiAgICAgICAgICAgIHJlbmRlcmVyLmxlYXZlKGN1cnJlbnRFbCwgZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAgIHByZXZpb3VzRWwgPSBudWxsO1xuICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgIHByZXZpb3VzRWwgPSBjdXJyZW50RWw7XG4gICAgICAgICAgICBjdXJyZW50RWwgPSBudWxsO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZVZpZXcoZmlyc3RUaW1lKSB7XG4gICAgICAgICAgdmFyIG5ld1Njb3BlICAgICAgICA9IHNjb3BlLiRuZXcoKSxcbiAgICAgICAgICAgICAgbmFtZSAgICAgICAgICAgID0gY3VycmVudEVsICYmIGN1cnJlbnRFbC5kYXRhKCckdWlWaWV3TmFtZScpLFxuICAgICAgICAgICAgICBwcmV2aW91c0xvY2FscyAgPSBuYW1lICYmICRzdGF0ZS4kY3VycmVudCAmJiAkc3RhdGUuJGN1cnJlbnQubG9jYWxzW25hbWVdO1xuXG4gICAgICAgICAgaWYgKCFmaXJzdFRpbWUgJiYgcHJldmlvdXNMb2NhbHMgPT09IGxhdGVzdExvY2FscykgcmV0dXJuOyAvLyBub3RoaW5nIHRvIGRvXG5cbiAgICAgICAgICB2YXIgY2xvbmUgPSAkdHJhbnNjbHVkZShuZXdTY29wZSwgZnVuY3Rpb24oY2xvbmUpIHtcbiAgICAgICAgICAgIHJlbmRlcmVyLmVudGVyKGNsb25lLCAkZWxlbWVudCwgZnVuY3Rpb24gb25VaVZpZXdFbnRlcigpIHtcbiAgICAgICAgICAgICAgaWYgKGFuZ3VsYXIuaXNEZWZpbmVkKGF1dG9TY3JvbGxFeHApICYmICFhdXRvU2Nyb2xsRXhwIHx8IHNjb3BlLiRldmFsKGF1dG9TY3JvbGxFeHApKSB7XG4gICAgICAgICAgICAgICAgJHVpVmlld1Njcm9sbChjbG9uZSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgY2xlYW51cExhc3RWaWV3KCk7XG4gICAgICAgICAgfSk7XG5cbiAgICAgICAgICBsYXRlc3RMb2NhbHMgPSAkc3RhdGUuJGN1cnJlbnQubG9jYWxzW2Nsb25lLmRhdGEoJyR1aVZpZXdOYW1lJyldO1xuXG4gICAgICAgICAgY3VycmVudEVsID0gY2xvbmU7XG4gICAgICAgICAgY3VycmVudFNjb3BlID0gbmV3U2NvcGU7XG4gICAgICAgICAgLyoqXG4gICAgICAgICAgICogQG5nZG9jIGV2ZW50XG4gICAgICAgICAgICogQG5hbWUgdWkucm91dGVyLnN0YXRlLmRpcmVjdGl2ZTp1aS12aWV3IyR2aWV3Q29udGVudExvYWRlZFxuICAgICAgICAgICAqIEBldmVudE9mIHVpLnJvdXRlci5zdGF0ZS5kaXJlY3RpdmU6dWktdmlld1xuICAgICAgICAgICAqIEBldmVudFR5cGUgZW1pdHMgb24gdWktdmlldyBkaXJlY3RpdmUgc2NvcGVcbiAgICAgICAgICAgKiBAZGVzY3JpcHRpb24gICAgICAgICAgICpcbiAgICAgICAgICAgKiBGaXJlZCBvbmNlIHRoZSB2aWV3IGlzICoqbG9hZGVkKiosICphZnRlciogdGhlIERPTSBpcyByZW5kZXJlZC5cbiAgICAgICAgICAgKlxuICAgICAgICAgICAqIEBwYXJhbSB7T2JqZWN0fSBldmVudCBFdmVudCBvYmplY3QuXG4gICAgICAgICAgICovXG4gICAgICAgICAgY3VycmVudFNjb3BlLiRlbWl0KCckdmlld0NvbnRlbnRMb2FkZWQnKTtcbiAgICAgICAgICBjdXJyZW50U2NvcGUuJGV2YWwob25sb2FkRXhwKTtcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG4gIH07XG5cbiAgcmV0dXJuIGRpcmVjdGl2ZTtcbn1cblxuJFZpZXdEaXJlY3RpdmVGaWxsLiRpbmplY3QgPSBbJyRjb21waWxlJywgJyRjb250cm9sbGVyJywgJyRzdGF0ZSddO1xuZnVuY3Rpb24gJFZpZXdEaXJlY3RpdmVGaWxsICgkY29tcGlsZSwgJGNvbnRyb2xsZXIsICRzdGF0ZSkge1xuICByZXR1cm4ge1xuICAgIHJlc3RyaWN0OiAnRUNBJyxcbiAgICBwcmlvcml0eTogLTQwMCxcbiAgICBjb21waWxlOiBmdW5jdGlvbiAodEVsZW1lbnQpIHtcbiAgICAgIHZhciBpbml0aWFsID0gdEVsZW1lbnQuaHRtbCgpO1xuICAgICAgcmV0dXJuIGZ1bmN0aW9uIChzY29wZSwgJGVsZW1lbnQsIGF0dHJzKSB7XG4gICAgICAgIHZhciBuYW1lICAgICAgPSBhdHRycy51aVZpZXcgfHwgYXR0cnMubmFtZSB8fCAnJyxcbiAgICAgICAgICAgIGluaGVyaXRlZCA9ICRlbGVtZW50LmluaGVyaXRlZERhdGEoJyR1aVZpZXcnKTtcblxuICAgICAgICBpZiAobmFtZS5pbmRleE9mKCdAJykgPCAwKSB7XG4gICAgICAgICAgbmFtZSA9IG5hbWUgKyAnQCcgKyAoaW5oZXJpdGVkID8gaW5oZXJpdGVkLnN0YXRlLm5hbWUgOiAnJyk7XG4gICAgICAgIH1cblxuICAgICAgICAkZWxlbWVudC5kYXRhKCckdWlWaWV3TmFtZScsIG5hbWUpO1xuXG4gICAgICAgIHZhciBjdXJyZW50ID0gJHN0YXRlLiRjdXJyZW50LFxuICAgICAgICAgICAgbG9jYWxzICA9IGN1cnJlbnQgJiYgY3VycmVudC5sb2NhbHNbbmFtZV07XG5cbiAgICAgICAgaWYgKCEgbG9jYWxzKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgJGVsZW1lbnQuZGF0YSgnJHVpVmlldycsIHsgbmFtZTogbmFtZSwgc3RhdGU6IGxvY2Fscy4kJHN0YXRlIH0pO1xuICAgICAgICAkZWxlbWVudC5odG1sKGxvY2Fscy4kdGVtcGxhdGUgPyBsb2NhbHMuJHRlbXBsYXRlIDogaW5pdGlhbCk7XG5cbiAgICAgICAgdmFyIGxpbmsgPSAkY29tcGlsZSgkZWxlbWVudC5jb250ZW50cygpKTtcblxuICAgICAgICBpZiAobG9jYWxzLiQkY29udHJvbGxlcikge1xuICAgICAgICAgIGxvY2Fscy4kc2NvcGUgPSBzY29wZTtcbiAgICAgICAgICB2YXIgY29udHJvbGxlciA9ICRjb250cm9sbGVyKGxvY2Fscy4kJGNvbnRyb2xsZXIsIGxvY2Fscyk7XG4gICAgICAgICAgaWYgKGxvY2Fscy4kJGNvbnRyb2xsZXJBcykge1xuICAgICAgICAgICAgc2NvcGVbbG9jYWxzLiQkY29udHJvbGxlckFzXSA9IGNvbnRyb2xsZXI7XG4gICAgICAgICAgfVxuICAgICAgICAgICRlbGVtZW50LmRhdGEoJyRuZ0NvbnRyb2xsZXJDb250cm9sbGVyJywgY29udHJvbGxlcik7XG4gICAgICAgICAgJGVsZW1lbnQuY2hpbGRyZW4oKS5kYXRhKCckbmdDb250cm9sbGVyQ29udHJvbGxlcicsIGNvbnRyb2xsZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgbGluayhzY29wZSk7XG4gICAgICB9O1xuICAgIH1cbiAgfTtcbn1cblxuYW5ndWxhci5tb2R1bGUoJ3VpLnJvdXRlci5zdGF0ZScpLmRpcmVjdGl2ZSgndWlWaWV3JywgJFZpZXdEaXJlY3RpdmUpO1xuYW5ndWxhci5tb2R1bGUoJ3VpLnJvdXRlci5zdGF0ZScpLmRpcmVjdGl2ZSgndWlWaWV3JywgJFZpZXdEaXJlY3RpdmVGaWxsKTtcblxuZnVuY3Rpb24gcGFyc2VTdGF0ZVJlZihyZWYpIHtcbiAgdmFyIHBhcnNlZCA9IHJlZi5yZXBsYWNlKC9cXG4vZywgXCIgXCIpLm1hdGNoKC9eKFteKF0rPylcXHMqKFxcKCguKilcXCkpPyQvKTtcbiAgaWYgKCFwYXJzZWQgfHwgcGFyc2VkLmxlbmd0aCAhPT0gNCkgdGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCBzdGF0ZSByZWYgJ1wiICsgcmVmICsgXCInXCIpO1xuICByZXR1cm4geyBzdGF0ZTogcGFyc2VkWzFdLCBwYXJhbUV4cHI6IHBhcnNlZFszXSB8fCBudWxsIH07XG59XG5cbmZ1bmN0aW9uIHN0YXRlQ29udGV4dChlbCkge1xuICB2YXIgc3RhdGVEYXRhID0gZWwucGFyZW50KCkuaW5oZXJpdGVkRGF0YSgnJHVpVmlldycpO1xuXG4gIGlmIChzdGF0ZURhdGEgJiYgc3RhdGVEYXRhLnN0YXRlICYmIHN0YXRlRGF0YS5zdGF0ZS5uYW1lKSB7XG4gICAgcmV0dXJuIHN0YXRlRGF0YS5zdGF0ZTtcbiAgfVxufVxuXG4vKipcbiAqIEBuZ2RvYyBkaXJlY3RpdmVcbiAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS5kaXJlY3RpdmU6dWktc3JlZlxuICpcbiAqIEByZXF1aXJlcyB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlXG4gKiBAcmVxdWlyZXMgJHRpbWVvdXRcbiAqXG4gKiBAcmVzdHJpY3QgQVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogQSBkaXJlY3RpdmUgdGhhdCBiaW5kcyBhIGxpbmsgKGA8YT5gIHRhZykgdG8gYSBzdGF0ZS4gSWYgdGhlIHN0YXRlIGhhcyBhbiBhc3NvY2lhdGVkIFxuICogVVJMLCB0aGUgZGlyZWN0aXZlIHdpbGwgYXV0b21hdGljYWxseSBnZW5lcmF0ZSAmIHVwZGF0ZSB0aGUgYGhyZWZgIGF0dHJpYnV0ZSB2aWEgXG4gKiB0aGUge0BsaW5rIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGUjbWV0aG9kc19ocmVmICRzdGF0ZS5ocmVmKCl9IG1ldGhvZC4gQ2xpY2tpbmcgXG4gKiB0aGUgbGluayB3aWxsIHRyaWdnZXIgYSBzdGF0ZSB0cmFuc2l0aW9uIHdpdGggb3B0aW9uYWwgcGFyYW1ldGVycy4gXG4gKlxuICogQWxzbyBtaWRkbGUtY2xpY2tpbmcsIHJpZ2h0LWNsaWNraW5nLCBhbmQgY3RybC1jbGlja2luZyBvbiB0aGUgbGluayB3aWxsIGJlIFxuICogaGFuZGxlZCBuYXRpdmVseSBieSB0aGUgYnJvd3Nlci5cbiAqXG4gKiBZb3UgY2FuIGFsc28gdXNlIHJlbGF0aXZlIHN0YXRlIHBhdGhzIHdpdGhpbiB1aS1zcmVmLCBqdXN0IGxpa2UgdGhlIHJlbGF0aXZlIFxuICogcGF0aHMgcGFzc2VkIHRvIGAkc3RhdGUuZ28oKWAuIFlvdSBqdXN0IG5lZWQgdG8gYmUgYXdhcmUgdGhhdCB0aGUgcGF0aCBpcyByZWxhdGl2ZVxuICogdG8gdGhlIHN0YXRlIHRoYXQgdGhlIGxpbmsgbGl2ZXMgaW4sIGluIG90aGVyIHdvcmRzIHRoZSBzdGF0ZSB0aGF0IGxvYWRlZCB0aGUgXG4gKiB0ZW1wbGF0ZSBjb250YWluaW5nIHRoZSBsaW5rLlxuICpcbiAqIFlvdSBjYW4gc3BlY2lmeSBvcHRpb25zIHRvIHBhc3MgdG8ge0BsaW5rIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGUjZ28gJHN0YXRlLmdvKCl9XG4gKiB1c2luZyB0aGUgYHVpLXNyZWYtb3B0c2AgYXR0cmlidXRlLiBPcHRpb25zIGFyZSByZXN0cmljdGVkIHRvIGBsb2NhdGlvbmAsIGBpbmhlcml0YCxcbiAqIGFuZCBgcmVsb2FkYC5cbiAqXG4gKiBAZXhhbXBsZVxuICogSGVyZSdzIGFuIGV4YW1wbGUgb2YgaG93IHlvdSdkIHVzZSB1aS1zcmVmIGFuZCBob3cgaXQgd291bGQgY29tcGlsZS4gSWYgeW91IGhhdmUgdGhlIFxuICogZm9sbG93aW5nIHRlbXBsYXRlOlxuICogPHByZT5cbiAqIDxhIHVpLXNyZWY9XCJob21lXCI+SG9tZTwvYT4gfCA8YSB1aS1zcmVmPVwiYWJvdXRcIj5BYm91dDwvYT5cbiAqIFxuICogPHVsPlxuICogICAgIDxsaSBuZy1yZXBlYXQ9XCJjb250YWN0IGluIGNvbnRhY3RzXCI+XG4gKiAgICAgICAgIDxhIHVpLXNyZWY9XCJjb250YWN0cy5kZXRhaWwoeyBpZDogY29udGFjdC5pZCB9KVwiPnt7IGNvbnRhY3QubmFtZSB9fTwvYT5cbiAqICAgICA8L2xpPlxuICogPC91bD5cbiAqIDwvcHJlPlxuICogXG4gKiBUaGVuIHRoZSBjb21waWxlZCBodG1sIHdvdWxkIGJlIChhc3N1bWluZyBIdG1sNU1vZGUgaXMgb2ZmKTpcbiAqIDxwcmU+XG4gKiA8YSBocmVmPVwiIy9ob21lXCIgdWktc3JlZj1cImhvbWVcIj5Ib21lPC9hPiB8IDxhIGhyZWY9XCIjL2Fib3V0XCIgdWktc3JlZj1cImFib3V0XCI+QWJvdXQ8L2E+XG4gKiBcbiAqIDx1bD5cbiAqICAgICA8bGkgbmctcmVwZWF0PVwiY29udGFjdCBpbiBjb250YWN0c1wiPlxuICogICAgICAgICA8YSBocmVmPVwiIy9jb250YWN0cy8xXCIgdWktc3JlZj1cImNvbnRhY3RzLmRldGFpbCh7IGlkOiBjb250YWN0LmlkIH0pXCI+Sm9lPC9hPlxuICogICAgIDwvbGk+XG4gKiAgICAgPGxpIG5nLXJlcGVhdD1cImNvbnRhY3QgaW4gY29udGFjdHNcIj5cbiAqICAgICAgICAgPGEgaHJlZj1cIiMvY29udGFjdHMvMlwiIHVpLXNyZWY9XCJjb250YWN0cy5kZXRhaWwoeyBpZDogY29udGFjdC5pZCB9KVwiPkFsaWNlPC9hPlxuICogICAgIDwvbGk+XG4gKiAgICAgPGxpIG5nLXJlcGVhdD1cImNvbnRhY3QgaW4gY29udGFjdHNcIj5cbiAqICAgICAgICAgPGEgaHJlZj1cIiMvY29udGFjdHMvM1wiIHVpLXNyZWY9XCJjb250YWN0cy5kZXRhaWwoeyBpZDogY29udGFjdC5pZCB9KVwiPkJvYjwvYT5cbiAqICAgICA8L2xpPlxuICogPC91bD5cbiAqXG4gKiA8YSB1aS1zcmVmPVwiaG9tZVwiIHVpLXNyZWYtb3B0cz1cIntyZWxvYWQ6IHRydWV9XCI+SG9tZTwvYT5cbiAqIDwvcHJlPlxuICpcbiAqIEBwYXJhbSB7c3RyaW5nfSB1aS1zcmVmICdzdGF0ZU5hbWUnIGNhbiBiZSBhbnkgdmFsaWQgYWJzb2x1dGUgb3IgcmVsYXRpdmUgc3RhdGVcbiAqIEBwYXJhbSB7T2JqZWN0fSB1aS1zcmVmLW9wdHMgb3B0aW9ucyB0byBwYXNzIHRvIHtAbGluayB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlI2dvICRzdGF0ZS5nbygpfVxuICovXG4kU3RhdGVSZWZEaXJlY3RpdmUuJGluamVjdCA9IFsnJHN0YXRlJywgJyR0aW1lb3V0J107XG5mdW5jdGlvbiAkU3RhdGVSZWZEaXJlY3RpdmUoJHN0YXRlLCAkdGltZW91dCkge1xuICB2YXIgYWxsb3dlZE9wdGlvbnMgPSBbJ2xvY2F0aW9uJywgJ2luaGVyaXQnLCAncmVsb2FkJ107XG5cbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogJ0EnLFxuICAgIHJlcXVpcmU6ICc/XnVpU3JlZkFjdGl2ZScsXG4gICAgbGluazogZnVuY3Rpb24oc2NvcGUsIGVsZW1lbnQsIGF0dHJzLCB1aVNyZWZBY3RpdmUpIHtcbiAgICAgIHZhciByZWYgPSBwYXJzZVN0YXRlUmVmKGF0dHJzLnVpU3JlZik7XG4gICAgICB2YXIgcGFyYW1zID0gbnVsbCwgdXJsID0gbnVsbCwgYmFzZSA9IHN0YXRlQ29udGV4dChlbGVtZW50KSB8fCAkc3RhdGUuJGN1cnJlbnQ7XG4gICAgICB2YXIgaXNGb3JtID0gZWxlbWVudFswXS5ub2RlTmFtZSA9PT0gXCJGT1JNXCI7XG4gICAgICB2YXIgYXR0ciA9IGlzRm9ybSA/IFwiYWN0aW9uXCIgOiBcImhyZWZcIiwgbmF2ID0gdHJ1ZTtcblxuICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgIHJlbGF0aXZlOiBiYXNlXG4gICAgICB9O1xuICAgICAgdmFyIG9wdGlvbnNPdmVycmlkZSA9IHNjb3BlLiRldmFsKGF0dHJzLnVpU3JlZk9wdHMpIHx8IHt9O1xuICAgICAgYW5ndWxhci5mb3JFYWNoKGFsbG93ZWRPcHRpb25zLCBmdW5jdGlvbihvcHRpb24pIHtcbiAgICAgICAgaWYgKG9wdGlvbiBpbiBvcHRpb25zT3ZlcnJpZGUpIHtcbiAgICAgICAgICBvcHRpb25zW29wdGlvbl0gPSBvcHRpb25zT3ZlcnJpZGVbb3B0aW9uXTtcbiAgICAgICAgfVxuICAgICAgfSk7XG5cbiAgICAgIHZhciB1cGRhdGUgPSBmdW5jdGlvbihuZXdWYWwpIHtcbiAgICAgICAgaWYgKG5ld1ZhbCkgcGFyYW1zID0gbmV3VmFsO1xuICAgICAgICBpZiAoIW5hdikgcmV0dXJuO1xuXG4gICAgICAgIHZhciBuZXdIcmVmID0gJHN0YXRlLmhyZWYocmVmLnN0YXRlLCBwYXJhbXMsIG9wdGlvbnMpO1xuXG4gICAgICAgIGlmICh1aVNyZWZBY3RpdmUpIHtcbiAgICAgICAgICB1aVNyZWZBY3RpdmUuJCRzZXRTdGF0ZUluZm8ocmVmLnN0YXRlLCBwYXJhbXMpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghbmV3SHJlZikge1xuICAgICAgICAgIG5hdiA9IGZhbHNlO1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBlbGVtZW50WzBdW2F0dHJdID0gbmV3SHJlZjtcbiAgICAgIH07XG5cbiAgICAgIGlmIChyZWYucGFyYW1FeHByKSB7XG4gICAgICAgIHNjb3BlLiR3YXRjaChyZWYucGFyYW1FeHByLCBmdW5jdGlvbihuZXdWYWwsIG9sZFZhbCkge1xuICAgICAgICAgIGlmIChuZXdWYWwgIT09IHBhcmFtcykgdXBkYXRlKG5ld1ZhbCk7XG4gICAgICAgIH0sIHRydWUpO1xuICAgICAgICBwYXJhbXMgPSBzY29wZS4kZXZhbChyZWYucGFyYW1FeHByKTtcbiAgICAgIH1cbiAgICAgIHVwZGF0ZSgpO1xuXG4gICAgICBpZiAoaXNGb3JtKSByZXR1cm47XG5cbiAgICAgIGVsZW1lbnQuYmluZChcImNsaWNrXCIsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgdmFyIGJ1dHRvbiA9IGUud2hpY2ggfHwgZS5idXR0b247XG4gICAgICAgIGlmICggIShidXR0b24gPiAxIHx8IGUuY3RybEtleSB8fCBlLm1ldGFLZXkgfHwgZS5zaGlmdEtleSB8fCBlbGVtZW50LmF0dHIoJ3RhcmdldCcpKSApIHtcbiAgICAgICAgICAvLyBIQUNLOiBUaGlzIGlzIHRvIGFsbG93IG5nLWNsaWNrcyB0byBiZSBwcm9jZXNzZWQgYmVmb3JlIHRoZSB0cmFuc2l0aW9uIGlzIGluaXRpYXRlZDpcbiAgICAgICAgICAkdGltZW91dChmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICRzdGF0ZS5nbyhyZWYuc3RhdGUsIHBhcmFtcywgb3B0aW9ucyk7XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogQG5nZG9jIGRpcmVjdGl2ZVxuICogQG5hbWUgdWkucm91dGVyLnN0YXRlLmRpcmVjdGl2ZTp1aS1zcmVmLWFjdGl2ZVxuICpcbiAqIEByZXF1aXJlcyB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlXG4gKiBAcmVxdWlyZXMgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVBhcmFtc1xuICogQHJlcXVpcmVzICRpbnRlcnBvbGF0ZVxuICpcbiAqIEByZXN0cmljdCBBXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBBIGRpcmVjdGl2ZSB3b3JraW5nIGFsb25nc2lkZSB1aS1zcmVmIHRvIGFkZCBjbGFzc2VzIHRvIGFuIGVsZW1lbnQgd2hlbiB0aGUgXG4gKiByZWxhdGVkIHVpLXNyZWYgZGlyZWN0aXZlJ3Mgc3RhdGUgaXMgYWN0aXZlLCBhbmQgcmVtb3ZpbmcgdGhlbSB3aGVuIGl0IGlzIGluYWN0aXZlLlxuICogVGhlIHByaW1hcnkgdXNlLWNhc2UgaXMgdG8gc2ltcGxpZnkgdGhlIHNwZWNpYWwgYXBwZWFyYW5jZSBvZiBuYXZpZ2F0aW9uIG1lbnVzIFxuICogcmVseWluZyBvbiBgdWktc3JlZmAsIGJ5IGhhdmluZyB0aGUgXCJhY3RpdmVcIiBzdGF0ZSdzIG1lbnUgYnV0dG9uIGFwcGVhciBkaWZmZXJlbnQsXG4gKiBkaXN0aW5ndWlzaGluZyBpdCBmcm9tIHRoZSBpbmFjdGl2ZSBtZW51IGl0ZW1zLlxuICpcbiAqIEBleGFtcGxlXG4gKiBHaXZlbiB0aGUgZm9sbG93aW5nIHRlbXBsYXRlOlxuICogPHByZT5cbiAqIDx1bD5cbiAqICAgPGxpIHVpLXNyZWYtYWN0aXZlPVwiYWN0aXZlXCIgY2xhc3M9XCJpdGVtXCI+XG4gKiAgICAgPGEgaHJlZiB1aS1zcmVmPVwiYXBwLnVzZXIoe3VzZXI6ICdiaWxib2JhZ2dpbnMnfSlcIj5AYmlsYm9iYWdnaW5zPC9hPlxuICogICA8L2xpPlxuICogPC91bD5cbiAqIDwvcHJlPlxuICogXG4gKiBXaGVuIHRoZSBhcHAgc3RhdGUgaXMgXCJhcHAudXNlclwiLCBhbmQgY29udGFpbnMgdGhlIHN0YXRlIHBhcmFtZXRlciBcInVzZXJcIiB3aXRoIHZhbHVlIFwiYmlsYm9iYWdnaW5zXCIsIFxuICogdGhlIHJlc3VsdGluZyBIVE1MIHdpbGwgYXBwZWFyIGFzIChub3RlIHRoZSAnYWN0aXZlJyBjbGFzcyk6XG4gKiA8cHJlPlxuICogPHVsPlxuICogICA8bGkgdWktc3JlZi1hY3RpdmU9XCJhY3RpdmVcIiBjbGFzcz1cIml0ZW0gYWN0aXZlXCI+XG4gKiAgICAgPGEgdWktc3JlZj1cImFwcC51c2VyKHt1c2VyOiAnYmlsYm9iYWdnaW5zJ30pXCIgaHJlZj1cIi91c2Vycy9iaWxib2JhZ2dpbnNcIj5AYmlsYm9iYWdnaW5zPC9hPlxuICogICA8L2xpPlxuICogPC91bD5cbiAqIDwvcHJlPlxuICogXG4gKiBUaGUgY2xhc3MgbmFtZSBpcyBpbnRlcnBvbGF0ZWQgKipvbmNlKiogZHVyaW5nIHRoZSBkaXJlY3RpdmVzIGxpbmsgdGltZSAoYW55IGZ1cnRoZXIgY2hhbmdlcyB0byB0aGUgXG4gKiBpbnRlcnBvbGF0ZWQgdmFsdWUgYXJlIGlnbm9yZWQpLiBcbiAqIFxuICogTXVsdGlwbGUgY2xhc3NlcyBtYXkgYmUgc3BlY2lmaWVkIGluIGEgc3BhY2Utc2VwYXJhdGVkIGZvcm1hdDpcbiAqIDxwcmU+XG4gKiA8dWw+XG4gKiAgIDxsaSB1aS1zcmVmLWFjdGl2ZT0nY2xhc3MxIGNsYXNzMiBjbGFzczMnPlxuICogICAgIDxhIHVpLXNyZWY9XCJhcHAudXNlclwiPmxpbms8L2E+XG4gKiAgIDwvbGk+XG4gKiA8L3VsPlxuICogPC9wcmU+XG4gKi9cbiRTdGF0ZUFjdGl2ZURpcmVjdGl2ZS4kaW5qZWN0ID0gWyckc3RhdGUnLCAnJHN0YXRlUGFyYW1zJywgJyRpbnRlcnBvbGF0ZSddO1xuZnVuY3Rpb24gJFN0YXRlQWN0aXZlRGlyZWN0aXZlKCRzdGF0ZSwgJHN0YXRlUGFyYW1zLCAkaW50ZXJwb2xhdGUpIHtcbiAgcmV0dXJuIHtcbiAgICByZXN0cmljdDogXCJBXCIsXG4gICAgY29udHJvbGxlcjogWyckc2NvcGUnLCAnJGVsZW1lbnQnLCAnJGF0dHJzJywgZnVuY3Rpb24oJHNjb3BlLCAkZWxlbWVudCwgJGF0dHJzKSB7XG4gICAgICB2YXIgc3RhdGUsIHBhcmFtcywgYWN0aXZlQ2xhc3M7XG5cbiAgICAgIC8vIFRoZXJlIHByb2JhYmx5IGlzbid0IG11Y2ggcG9pbnQgaW4gJG9ic2VydmluZyB0aGlzXG4gICAgICBhY3RpdmVDbGFzcyA9ICRpbnRlcnBvbGF0ZSgkYXR0cnMudWlTcmVmQWN0aXZlIHx8ICcnLCBmYWxzZSkoJHNjb3BlKTtcblxuICAgICAgLy8gQWxsb3cgdWlTcmVmIHRvIGNvbW11bmljYXRlIHdpdGggdWlTcmVmQWN0aXZlXG4gICAgICB0aGlzLiQkc2V0U3RhdGVJbmZvID0gZnVuY3Rpb24obmV3U3RhdGUsIG5ld1BhcmFtcykge1xuICAgICAgICBzdGF0ZSA9ICRzdGF0ZS5nZXQobmV3U3RhdGUsIHN0YXRlQ29udGV4dCgkZWxlbWVudCkpO1xuICAgICAgICBwYXJhbXMgPSBuZXdQYXJhbXM7XG4gICAgICAgIHVwZGF0ZSgpO1xuICAgICAgfTtcblxuICAgICAgJHNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsIHVwZGF0ZSk7XG5cbiAgICAgIC8vIFVwZGF0ZSByb3V0ZSBzdGF0ZVxuICAgICAgZnVuY3Rpb24gdXBkYXRlKCkge1xuICAgICAgICBpZiAoJHN0YXRlLiRjdXJyZW50LnNlbGYgPT09IHN0YXRlICYmIG1hdGNoZXNQYXJhbXMoKSkge1xuICAgICAgICAgICRlbGVtZW50LmFkZENsYXNzKGFjdGl2ZUNsYXNzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAkZWxlbWVudC5yZW1vdmVDbGFzcyhhY3RpdmVDbGFzcyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gbWF0Y2hlc1BhcmFtcygpIHtcbiAgICAgICAgcmV0dXJuICFwYXJhbXMgfHwgZXF1YWxGb3JLZXlzKHBhcmFtcywgJHN0YXRlUGFyYW1zKTtcbiAgICAgIH1cbiAgICB9XVxuICB9O1xufVxuXG5hbmd1bGFyLm1vZHVsZSgndWkucm91dGVyLnN0YXRlJylcbiAgLmRpcmVjdGl2ZSgndWlTcmVmJywgJFN0YXRlUmVmRGlyZWN0aXZlKVxuICAuZGlyZWN0aXZlKCd1aVNyZWZBY3RpdmUnLCAkU3RhdGVBY3RpdmVEaXJlY3RpdmUpO1xuXG4vKipcbiAqIEBuZ2RvYyBmaWx0ZXJcbiAqIEBuYW1lIHVpLnJvdXRlci5zdGF0ZS5maWx0ZXI6aXNTdGF0ZVxuICpcbiAqIEByZXF1aXJlcyB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlXG4gKlxuICogQGRlc2NyaXB0aW9uXG4gKiBUcmFuc2xhdGVzIHRvIHtAbGluayB1aS5yb3V0ZXIuc3RhdGUuJHN0YXRlI21ldGhvZHNfaXMgJHN0YXRlLmlzKFwic3RhdGVOYW1lXCIpfS5cbiAqL1xuJElzU3RhdGVGaWx0ZXIuJGluamVjdCA9IFsnJHN0YXRlJ107XG5mdW5jdGlvbiAkSXNTdGF0ZUZpbHRlcigkc3RhdGUpIHtcbiAgcmV0dXJuIGZ1bmN0aW9uKHN0YXRlKSB7XG4gICAgcmV0dXJuICRzdGF0ZS5pcyhzdGF0ZSk7XG4gIH07XG59XG5cbi8qKlxuICogQG5nZG9jIGZpbHRlclxuICogQG5hbWUgdWkucm91dGVyLnN0YXRlLmZpbHRlcjppbmNsdWRlZEJ5U3RhdGVcbiAqXG4gKiBAcmVxdWlyZXMgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVxuICpcbiAqIEBkZXNjcmlwdGlvblxuICogVHJhbnNsYXRlcyB0byB7QGxpbmsgdWkucm91dGVyLnN0YXRlLiRzdGF0ZSNtZXRob2RzX2luY2x1ZGVzICRzdGF0ZS5pbmNsdWRlcygnZnVsbE9yUGFydGlhbFN0YXRlTmFtZScpfS5cbiAqL1xuJEluY2x1ZGVkQnlTdGF0ZUZpbHRlci4kaW5qZWN0ID0gWyckc3RhdGUnXTtcbmZ1bmN0aW9uICRJbmNsdWRlZEJ5U3RhdGVGaWx0ZXIoJHN0YXRlKSB7XG4gIHJldHVybiBmdW5jdGlvbihzdGF0ZSkge1xuICAgIHJldHVybiAkc3RhdGUuaW5jbHVkZXMoc3RhdGUpO1xuICB9O1xufVxuXG5hbmd1bGFyLm1vZHVsZSgndWkucm91dGVyLnN0YXRlJylcbiAgLmZpbHRlcignaXNTdGF0ZScsICRJc1N0YXRlRmlsdGVyKVxuICAuZmlsdGVyKCdpbmNsdWRlZEJ5U3RhdGUnLCAkSW5jbHVkZWRCeVN0YXRlRmlsdGVyKTtcblxuLypcbiAqIEBuZ2RvYyBvYmplY3RcbiAqIEBuYW1lIHVpLnJvdXRlci5jb21wYXQuJHJvdXRlUHJvdmlkZXJcbiAqXG4gKiBAcmVxdWlyZXMgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVByb3ZpZGVyXG4gKiBAcmVxdWlyZXMgdWkucm91dGVyLnJvdXRlci4kdXJsUm91dGVyUHJvdmlkZXJcbiAqXG4gKiBAZGVzY3JpcHRpb25cbiAqIGAkcm91dGVQcm92aWRlcmAgb2YgdGhlIGB1aS5yb3V0ZXIuY29tcGF0YCBtb2R1bGUgb3ZlcndyaXRlcyB0aGUgZXhpc3RpbmdcbiAqIGByb3V0ZVByb3ZpZGVyYCBmcm9tIHRoZSBjb3JlLiBUaGlzIGlzIGRvbmUgdG8gcHJvdmlkZSBjb21wYXRpYmlsaXR5IGJldHdlZW5cbiAqIHRoZSBVSSBSb3V0ZXIgYW5kIHRoZSBjb3JlIHJvdXRlci5cbiAqXG4gKiBJdCBhbHNvIHByb3ZpZGVzIGEgYHdoZW4oKWAgbWV0aG9kIHRvIHJlZ2lzdGVyIHJvdXRlcyB0aGF0IG1hcCB0byBjZXJ0YWluIHVybHMuXG4gKiBCZWhpbmQgdGhlIHNjZW5lcyBpdCBhY3R1YWxseSBkZWxlZ2F0ZXMgZWl0aGVyIHRvIFxuICoge0BsaW5rIHVpLnJvdXRlci5yb3V0ZXIuJHVybFJvdXRlclByb3ZpZGVyICR1cmxSb3V0ZXJQcm92aWRlcn0gb3IgdG8gdGhlIFxuICoge0BsaW5rIHVpLnJvdXRlci5zdGF0ZS4kc3RhdGVQcm92aWRlciAkc3RhdGVQcm92aWRlcn0gdG8gcG9zdHByb2Nlc3MgdGhlIGdpdmVuIFxuICogcm91dGVyIGRlZmluaXRpb24gb2JqZWN0LlxuICovXG4kUm91dGVQcm92aWRlci4kaW5qZWN0ID0gWyckc3RhdGVQcm92aWRlcicsICckdXJsUm91dGVyUHJvdmlkZXInXTtcbmZ1bmN0aW9uICRSb3V0ZVByb3ZpZGVyKCAgJHN0YXRlUHJvdmlkZXIsICAgICR1cmxSb3V0ZXJQcm92aWRlcikge1xuXG4gIHZhciByb3V0ZXMgPSBbXTtcblxuICBvbkVudGVyUm91dGUuJGluamVjdCA9IFsnJCRzdGF0ZSddO1xuICBmdW5jdGlvbiBvbkVudGVyUm91dGUoICAgJCRzdGF0ZSkge1xuICAgIC8qanNoaW50IHZhbGlkdGhpczogdHJ1ZSAqL1xuICAgIHRoaXMubG9jYWxzID0gJCRzdGF0ZS5sb2NhbHMuZ2xvYmFscztcbiAgICB0aGlzLnBhcmFtcyA9IHRoaXMubG9jYWxzLiRzdGF0ZVBhcmFtcztcbiAgfVxuXG4gIGZ1bmN0aW9uIG9uRXhpdFJvdXRlKCkge1xuICAgIC8qanNoaW50IHZhbGlkdGhpczogdHJ1ZSAqL1xuICAgIHRoaXMubG9jYWxzID0gbnVsbDtcbiAgICB0aGlzLnBhcmFtcyA9IG51bGw7XG4gIH1cblxuICB0aGlzLndoZW4gPSB3aGVuO1xuICAvKlxuICAgKiBAbmdkb2MgZnVuY3Rpb25cbiAgICogQG5hbWUgdWkucm91dGVyLmNvbXBhdC4kcm91dGVQcm92aWRlciN3aGVuXG4gICAqIEBtZXRob2RPZiB1aS5yb3V0ZXIuY29tcGF0LiRyb3V0ZVByb3ZpZGVyXG4gICAqXG4gICAqIEBkZXNjcmlwdGlvblxuICAgKiBSZWdpc3RlcnMgYSByb3V0ZSB3aXRoIGEgZ2l2ZW4gcm91dGUgZGVmaW5pdGlvbiBvYmplY3QuIFRoZSByb3V0ZSBkZWZpbml0aW9uXG4gICAqIG9iamVjdCBoYXMgdGhlIHNhbWUgaW50ZXJmYWNlIHRoZSBhbmd1bGFyIGNvcmUgcm91dGUgZGVmaW5pdGlvbiBvYmplY3QgaGFzLlxuICAgKiBcbiAgICogQGV4YW1wbGVcbiAgICogPHByZT5cbiAgICogdmFyIGFwcCA9IGFuZ3VsYXIubW9kdWxlKCdhcHAnLCBbJ3VpLnJvdXRlci5jb21wYXQnXSk7XG4gICAqXG4gICAqIGFwcC5jb25maWcoZnVuY3Rpb24gKCRyb3V0ZVByb3ZpZGVyKSB7XG4gICAqICAgJHJvdXRlUHJvdmlkZXIud2hlbignaG9tZScsIHtcbiAgICogICAgIGNvbnRyb2xsZXI6IGZ1bmN0aW9uICgpIHsgLi4uIH0sXG4gICAqICAgICB0ZW1wbGF0ZVVybDogJ3BhdGgvdG8vdGVtcGxhdGUnXG4gICAqICAgfSk7XG4gICAqIH0pO1xuICAgKiA8L3ByZT5cbiAgICpcbiAgICogQHBhcmFtIHtzdHJpbmd9IHVybCBVUkwgYXMgc3RyaW5nXG4gICAqIEBwYXJhbSB7b2JqZWN0fSByb3V0ZSBSb3V0ZSBkZWZpbml0aW9uIG9iamVjdFxuICAgKlxuICAgKiBAcmV0dXJuIHtvYmplY3R9ICRyb3V0ZVByb3ZpZGVyIC0gJHJvdXRlUHJvdmlkZXIgaW5zdGFuY2VcbiAgICovXG4gIGZ1bmN0aW9uIHdoZW4odXJsLCByb3V0ZSkge1xuICAgIC8qanNoaW50IHZhbGlkdGhpczogdHJ1ZSAqL1xuICAgIGlmIChyb3V0ZS5yZWRpcmVjdFRvICE9IG51bGwpIHtcbiAgICAgIC8vIFJlZGlyZWN0LCBjb25maWd1cmUgZGlyZWN0bHkgb24gJHVybFJvdXRlclByb3ZpZGVyXG4gICAgICB2YXIgcmVkaXJlY3QgPSByb3V0ZS5yZWRpcmVjdFRvLCBoYW5kbGVyO1xuICAgICAgaWYgKGlzU3RyaW5nKHJlZGlyZWN0KSkge1xuICAgICAgICBoYW5kbGVyID0gcmVkaXJlY3Q7IC8vIGxlYXZlICR1cmxSb3V0ZXJQcm92aWRlciB0byBoYW5kbGVcbiAgICAgIH0gZWxzZSBpZiAoaXNGdW5jdGlvbihyZWRpcmVjdCkpIHtcbiAgICAgICAgLy8gQWRhcHQgdG8gJHVybFJvdXRlclByb3ZpZGVyIEFQSVxuICAgICAgICBoYW5kbGVyID0gZnVuY3Rpb24gKHBhcmFtcywgJGxvY2F0aW9uKSB7XG4gICAgICAgICAgcmV0dXJuIHJlZGlyZWN0KHBhcmFtcywgJGxvY2F0aW9uLnBhdGgoKSwgJGxvY2F0aW9uLnNlYXJjaCgpKTtcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgJ3JlZGlyZWN0VG8nIGluIHdoZW4oKVwiKTtcbiAgICAgIH1cbiAgICAgICR1cmxSb3V0ZXJQcm92aWRlci53aGVuKHVybCwgaGFuZGxlcik7XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFJlZ3VsYXIgcm91dGUsIGNvbmZpZ3VyZSBhcyBzdGF0ZVxuICAgICAgJHN0YXRlUHJvdmlkZXIuc3RhdGUoaW5oZXJpdChyb3V0ZSwge1xuICAgICAgICBwYXJlbnQ6IG51bGwsXG4gICAgICAgIG5hbWU6ICdyb3V0ZTonICsgZW5jb2RlVVJJQ29tcG9uZW50KHVybCksXG4gICAgICAgIHVybDogdXJsLFxuICAgICAgICBvbkVudGVyOiBvbkVudGVyUm91dGUsXG4gICAgICAgIG9uRXhpdDogb25FeGl0Um91dGVcbiAgICAgIH0pKTtcbiAgICB9XG4gICAgcm91dGVzLnB1c2gocm91dGUpO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLypcbiAgICogQG5nZG9jIG9iamVjdFxuICAgKiBAbmFtZSB1aS5yb3V0ZXIuY29tcGF0LiRyb3V0ZVxuICAgKlxuICAgKiBAcmVxdWlyZXMgdWkucm91dGVyLnN0YXRlLiRzdGF0ZVxuICAgKiBAcmVxdWlyZXMgJHJvb3RTY29wZVxuICAgKiBAcmVxdWlyZXMgJHJvdXRlUGFyYW1zXG4gICAqXG4gICAqIEBwcm9wZXJ0eSB7b2JqZWN0fSByb3V0ZXMgLSBBcnJheSBvZiByZWdpc3RlcmVkIHJvdXRlcy5cbiAgICogQHByb3BlcnR5IHtvYmplY3R9IHBhcmFtcyAtIEN1cnJlbnQgcm91dGUgcGFyYW1zIGFzIG9iamVjdC5cbiAgICogQHByb3BlcnR5IHtzdHJpbmd9IGN1cnJlbnQgLSBOYW1lIG9mIHRoZSBjdXJyZW50IHJvdXRlLlxuICAgKlxuICAgKiBAZGVzY3JpcHRpb25cbiAgICogVGhlIGAkcm91dGVgIHNlcnZpY2UgcHJvdmlkZXMgaW50ZXJmYWNlcyB0byBhY2Nlc3MgZGVmaW5lZCByb3V0ZXMuIEl0IGFsc28gbGV0J3NcbiAgICogeW91IGFjY2VzcyByb3V0ZSBwYXJhbXMgdGhyb3VnaCBgJHJvdXRlUGFyYW1zYCBzZXJ2aWNlLCBzbyB5b3UgaGF2ZSBmdWxseVxuICAgKiBjb250cm9sIG92ZXIgYWxsIHRoZSBzdHVmZiB5b3Ugd291bGQgYWN0dWFsbHkgZ2V0IGZyb20gYW5ndWxhcidzIGNvcmUgYCRyb3V0ZWBcbiAgICogc2VydmljZS5cbiAgICovXG4gIHRoaXMuJGdldCA9ICRnZXQ7XG4gICRnZXQuJGluamVjdCA9IFsnJHN0YXRlJywgJyRyb290U2NvcGUnLCAnJHJvdXRlUGFyYW1zJ107XG4gIGZ1bmN0aW9uICRnZXQoICAgJHN0YXRlLCAgICRyb290U2NvcGUsICAgJHJvdXRlUGFyYW1zKSB7XG5cbiAgICB2YXIgJHJvdXRlID0ge1xuICAgICAgcm91dGVzOiByb3V0ZXMsXG4gICAgICBwYXJhbXM6ICRyb3V0ZVBhcmFtcyxcbiAgICAgIGN1cnJlbnQ6IHVuZGVmaW5lZFxuICAgIH07XG5cbiAgICBmdW5jdGlvbiBzdGF0ZUFzUm91dGUoc3RhdGUpIHtcbiAgICAgIHJldHVybiAoc3RhdGUubmFtZSAhPT0gJycpID8gc3RhdGUgOiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN0YXJ0JywgZnVuY3Rpb24gKGV2LCB0bywgdG9QYXJhbXMsIGZyb20sIGZyb21QYXJhbXMpIHtcbiAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnJHJvdXRlQ2hhbmdlU3RhcnQnLCBzdGF0ZUFzUm91dGUodG8pLCBzdGF0ZUFzUm91dGUoZnJvbSkpO1xuICAgIH0pO1xuXG4gICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZVN1Y2Nlc3MnLCBmdW5jdGlvbiAoZXYsIHRvLCB0b1BhcmFtcywgZnJvbSwgZnJvbVBhcmFtcykge1xuICAgICAgJHJvdXRlLmN1cnJlbnQgPSBzdGF0ZUFzUm91dGUodG8pO1xuICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCckcm91dGVDaGFuZ2VTdWNjZXNzJywgc3RhdGVBc1JvdXRlKHRvKSwgc3RhdGVBc1JvdXRlKGZyb20pKTtcbiAgICAgIGNvcHkodG9QYXJhbXMsICRyb3V0ZS5wYXJhbXMpO1xuICAgIH0pO1xuXG4gICAgJHJvb3RTY29wZS4kb24oJyRzdGF0ZUNoYW5nZUVycm9yJywgZnVuY3Rpb24gKGV2LCB0bywgdG9QYXJhbXMsIGZyb20sIGZyb21QYXJhbXMsIGVycm9yKSB7XG4gICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJyRyb3V0ZUNoYW5nZUVycm9yJywgc3RhdGVBc1JvdXRlKHRvKSwgc3RhdGVBc1JvdXRlKGZyb20pLCBlcnJvcik7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gJHJvdXRlO1xuICB9XG59XG5cbmFuZ3VsYXIubW9kdWxlKCd1aS5yb3V0ZXIuY29tcGF0JylcbiAgLnByb3ZpZGVyKCckcm91dGUnLCAkUm91dGVQcm92aWRlcilcbiAgLmRpcmVjdGl2ZSgnbmdWaWV3JywgJFZpZXdEaXJlY3RpdmUpO1xufSkod2luZG93LCB3aW5kb3cuYW5ndWxhcik7XG59KS5jYWxsKHRoaXMscmVxdWlyZShcIkRGMXVyeFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9hbmd1bGFyLXVpLXJvdXRlci9yZWxlYXNlL2FuZ3VsYXItdWktcm91dGVyLmpzXCIsXCIvLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2FuZ3VsYXItdWktcm91dGVyL3JlbGVhc2VcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG5yZXF1aXJlKCcuL2xpYi9hbmd1bGFyLm1pbi5qcycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGFuZ3VsYXI7XG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiREYxdXJ4XCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2FuZ3VsYXIvaW5kZXgtYnJvd3NlcmlmeS5qc1wiLFwiLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9hbmd1bGFyXCIpIiwiKGZ1bmN0aW9uIChwcm9jZXNzLGdsb2JhbCxCdWZmZXIsX19hcmd1bWVudDAsX19hcmd1bWVudDEsX19hcmd1bWVudDIsX19hcmd1bWVudDMsX19maWxlbmFtZSxfX2Rpcm5hbWUpe1xuLypcbiBBbmd1bGFySlMgdjEuMi4xOFxuIChjKSAyMDEwLTIwMTQgR29vZ2xlLCBJbmMuIGh0dHA6Ly9hbmd1bGFyanMub3JnXG4gTGljZW5zZTogTUlUXG4qL1xuKGZ1bmN0aW9uKFQsVixzKXsndXNlIHN0cmljdCc7ZnVuY3Rpb24gdChiKXtyZXR1cm4gZnVuY3Rpb24oKXt2YXIgYT1hcmd1bWVudHNbMF0sYyxhPVwiW1wiKyhiP2IrXCI6XCI6XCJcIikrYStcIl0gaHR0cDovL2Vycm9ycy5hbmd1bGFyanMub3JnLzEuMi4xOC9cIisoYj9iK1wiL1wiOlwiXCIpK2E7Zm9yKGM9MTtjPGFyZ3VtZW50cy5sZW5ndGg7YysrKWE9YSsoMT09Yz9cIj9cIjpcIiZcIikrXCJwXCIrKGMtMSkrXCI9XCIrZW5jb2RlVVJJQ29tcG9uZW50KFwiZnVuY3Rpb25cIj09dHlwZW9mIGFyZ3VtZW50c1tjXT9hcmd1bWVudHNbY10udG9TdHJpbmcoKS5yZXBsYWNlKC8gXFx7W1xcc1xcU10qJC8sXCJcIik6XCJ1bmRlZmluZWRcIj09dHlwZW9mIGFyZ3VtZW50c1tjXT9cInVuZGVmaW5lZFwiOlwic3RyaW5nXCIhPXR5cGVvZiBhcmd1bWVudHNbY10/SlNPTi5zdHJpbmdpZnkoYXJndW1lbnRzW2NdKTphcmd1bWVudHNbY10pO3JldHVybiBFcnJvcihhKX19ZnVuY3Rpb24gZGIoYil7aWYobnVsbD09Ynx8RWEoYikpcmV0dXJuITE7XG52YXIgYT1iLmxlbmd0aDtyZXR1cm4gMT09PWIubm9kZVR5cGUmJmE/ITA6QyhiKXx8TyhiKXx8MD09PWF8fFwibnVtYmVyXCI9PT10eXBlb2YgYSYmMDxhJiZhLTEgaW4gYn1mdW5jdGlvbiBxKGIsYSxjKXt2YXIgZDtpZihiKWlmKFEoYikpZm9yKGQgaW4gYilcInByb3RvdHlwZVwiPT1kfHwoXCJsZW5ndGhcIj09ZHx8XCJuYW1lXCI9PWR8fGIuaGFzT3duUHJvcGVydHkmJiFiLmhhc093blByb3BlcnR5KGQpKXx8YS5jYWxsKGMsYltkXSxkKTtlbHNlIGlmKGIuZm9yRWFjaCYmYi5mb3JFYWNoIT09cSliLmZvckVhY2goYSxjKTtlbHNlIGlmKGRiKGIpKWZvcihkPTA7ZDxiLmxlbmd0aDtkKyspYS5jYWxsKGMsYltkXSxkKTtlbHNlIGZvcihkIGluIGIpYi5oYXNPd25Qcm9wZXJ0eShkKSYmYS5jYWxsKGMsYltkXSxkKTtyZXR1cm4gYn1mdW5jdGlvbiBXYihiKXt2YXIgYT1bXSxjO2ZvcihjIGluIGIpYi5oYXNPd25Qcm9wZXJ0eShjKSYmYS5wdXNoKGMpO3JldHVybiBhLnNvcnQoKX1mdW5jdGlvbiBTYyhiLFxuYSxjKXtmb3IodmFyIGQ9V2IoYiksZT0wO2U8ZC5sZW5ndGg7ZSsrKWEuY2FsbChjLGJbZFtlXV0sZFtlXSk7cmV0dXJuIGR9ZnVuY3Rpb24gWGIoYil7cmV0dXJuIGZ1bmN0aW9uKGEsYyl7YihjLGEpfX1mdW5jdGlvbiBlYigpe2Zvcih2YXIgYj1qYS5sZW5ndGgsYTtiOyl7Yi0tO2E9amFbYl0uY2hhckNvZGVBdCgwKTtpZig1Nz09YSlyZXR1cm4gamFbYl09XCJBXCIsamEuam9pbihcIlwiKTtpZig5MD09YSlqYVtiXT1cIjBcIjtlbHNlIHJldHVybiBqYVtiXT1TdHJpbmcuZnJvbUNoYXJDb2RlKGErMSksamEuam9pbihcIlwiKX1qYS51bnNoaWZ0KFwiMFwiKTtyZXR1cm4gamEuam9pbihcIlwiKX1mdW5jdGlvbiBZYihiLGEpe2E/Yi4kJGhhc2hLZXk9YTpkZWxldGUgYi4kJGhhc2hLZXl9ZnVuY3Rpb24gSihiKXt2YXIgYT1iLiQkaGFzaEtleTtxKGFyZ3VtZW50cyxmdW5jdGlvbihhKXthIT09YiYmcShhLGZ1bmN0aW9uKGEsYyl7YltjXT1hfSl9KTtZYihiLGEpO3JldHVybiBifWZ1bmN0aW9uIFooYil7cmV0dXJuIHBhcnNlSW50KGIsXG4xMCl9ZnVuY3Rpb24gWmIoYixhKXtyZXR1cm4gSihuZXcgKEooZnVuY3Rpb24oKXt9LHtwcm90b3R5cGU6Yn0pKSxhKX1mdW5jdGlvbiB5KCl7fWZ1bmN0aW9uIEZhKGIpe3JldHVybiBifWZ1bmN0aW9uICQoYil7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIGJ9fWZ1bmN0aW9uIEQoYil7cmV0dXJuXCJ1bmRlZmluZWRcIj09PXR5cGVvZiBifWZ1bmN0aW9uIEIoYil7cmV0dXJuXCJ1bmRlZmluZWRcIiE9PXR5cGVvZiBifWZ1bmN0aW9uIFUoYil7cmV0dXJuIG51bGwhPWImJlwib2JqZWN0XCI9PT10eXBlb2YgYn1mdW5jdGlvbiBDKGIpe3JldHVyblwic3RyaW5nXCI9PT10eXBlb2YgYn1mdW5jdGlvbiB5YihiKXtyZXR1cm5cIm51bWJlclwiPT09dHlwZW9mIGJ9ZnVuY3Rpb24gTmEoYil7cmV0dXJuXCJbb2JqZWN0IERhdGVdXCI9PT13YS5jYWxsKGIpfWZ1bmN0aW9uIFEoYil7cmV0dXJuXCJmdW5jdGlvblwiPT09dHlwZW9mIGJ9ZnVuY3Rpb24gZmIoYil7cmV0dXJuXCJbb2JqZWN0IFJlZ0V4cF1cIj09PXdhLmNhbGwoYil9XG5mdW5jdGlvbiBFYShiKXtyZXR1cm4gYiYmYi5kb2N1bWVudCYmYi5sb2NhdGlvbiYmYi5hbGVydCYmYi5zZXRJbnRlcnZhbH1mdW5jdGlvbiBUYyhiKXtyZXR1cm4hKCFifHwhKGIubm9kZU5hbWV8fGIucHJvcCYmYi5hdHRyJiZiLmZpbmQpKX1mdW5jdGlvbiBVYyhiLGEsYyl7dmFyIGQ9W107cShiLGZ1bmN0aW9uKGIsZyxmKXtkLnB1c2goYS5jYWxsKGMsYixnLGYpKX0pO3JldHVybiBkfWZ1bmN0aW9uIE9hKGIsYSl7aWYoYi5pbmRleE9mKXJldHVybiBiLmluZGV4T2YoYSk7Zm9yKHZhciBjPTA7YzxiLmxlbmd0aDtjKyspaWYoYT09PWJbY10pcmV0dXJuIGM7cmV0dXJuLTF9ZnVuY3Rpb24gUGEoYixhKXt2YXIgYz1PYShiLGEpOzA8PWMmJmIuc3BsaWNlKGMsMSk7cmV0dXJuIGF9ZnVuY3Rpb24gR2EoYixhLGMsZCl7aWYoRWEoYil8fGImJmIuJGV2YWxBc3luYyYmYi4kd2F0Y2gpdGhyb3cgUWEoXCJjcHdzXCIpO2lmKGEpe2lmKGI9PT1hKXRocm93IFFhKFwiY3BpXCIpO2M9Y3x8W107XG5kPWR8fFtdO2lmKFUoYikpe3ZhciBlPU9hKGMsYik7aWYoLTEhPT1lKXJldHVybiBkW2VdO2MucHVzaChiKTtkLnB1c2goYSl9aWYoTyhiKSlmb3IodmFyIGc9YS5sZW5ndGg9MDtnPGIubGVuZ3RoO2crKyllPUdhKGJbZ10sbnVsbCxjLGQpLFUoYltnXSkmJihjLnB1c2goYltnXSksZC5wdXNoKGUpKSxhLnB1c2goZSk7ZWxzZXt2YXIgZj1hLiQkaGFzaEtleTtxKGEsZnVuY3Rpb24oYixjKXtkZWxldGUgYVtjXX0pO2ZvcihnIGluIGIpZT1HYShiW2ddLG51bGwsYyxkKSxVKGJbZ10pJiYoYy5wdXNoKGJbZ10pLGQucHVzaChlKSksYVtnXT1lO1liKGEsZil9fWVsc2UoYT1iKSYmKE8oYik/YT1HYShiLFtdLGMsZCk6TmEoYik/YT1uZXcgRGF0ZShiLmdldFRpbWUoKSk6ZmIoYik/YT1SZWdFeHAoYi5zb3VyY2UpOlUoYikmJihhPUdhKGIse30sYyxkKSkpO3JldHVybiBhfWZ1bmN0aW9uIGthKGIsYSl7aWYoTyhiKSl7YT1hfHxbXTtmb3IodmFyIGM9MDtjPGIubGVuZ3RoO2MrKylhW2NdPVxuYltjXX1lbHNlIGlmKFUoYikpZm9yKGMgaW4gYT1hfHx7fSxiKSF6Yi5jYWxsKGIsYyl8fFwiJFwiPT09Yy5jaGFyQXQoMCkmJlwiJFwiPT09Yy5jaGFyQXQoMSl8fChhW2NdPWJbY10pO3JldHVybiBhfHxifWZ1bmN0aW9uIHhhKGIsYSl7aWYoYj09PWEpcmV0dXJuITA7aWYobnVsbD09PWJ8fG51bGw9PT1hKXJldHVybiExO2lmKGIhPT1iJiZhIT09YSlyZXR1cm4hMDt2YXIgYz10eXBlb2YgYixkO2lmKGM9PXR5cGVvZiBhJiZcIm9iamVjdFwiPT1jKWlmKE8oYikpe2lmKCFPKGEpKXJldHVybiExO2lmKChjPWIubGVuZ3RoKT09YS5sZW5ndGgpe2ZvcihkPTA7ZDxjO2QrKylpZigheGEoYltkXSxhW2RdKSlyZXR1cm4hMTtyZXR1cm4hMH19ZWxzZXtpZihOYShiKSlyZXR1cm4gTmEoYSkmJmIuZ2V0VGltZSgpPT1hLmdldFRpbWUoKTtpZihmYihiKSYmZmIoYSkpcmV0dXJuIGIudG9TdHJpbmcoKT09YS50b1N0cmluZygpO2lmKGImJmIuJGV2YWxBc3luYyYmYi4kd2F0Y2h8fGEmJmEuJGV2YWxBc3luYyYmXG5hLiR3YXRjaHx8RWEoYil8fEVhKGEpfHxPKGEpKXJldHVybiExO2M9e307Zm9yKGQgaW4gYilpZihcIiRcIiE9PWQuY2hhckF0KDApJiYhUShiW2RdKSl7aWYoIXhhKGJbZF0sYVtkXSkpcmV0dXJuITE7Y1tkXT0hMH1mb3IoZCBpbiBhKWlmKCFjLmhhc093blByb3BlcnR5KGQpJiZcIiRcIiE9PWQuY2hhckF0KDApJiZhW2RdIT09cyYmIVEoYVtkXSkpcmV0dXJuITE7cmV0dXJuITB9cmV0dXJuITF9ZnVuY3Rpb24gJGIoKXtyZXR1cm4gVi5zZWN1cml0eVBvbGljeSYmVi5zZWN1cml0eVBvbGljeS5pc0FjdGl2ZXx8Vi5xdWVyeVNlbGVjdG9yJiYhKCFWLnF1ZXJ5U2VsZWN0b3IoXCJbbmctY3NwXVwiKSYmIVYucXVlcnlTZWxlY3RvcihcIltkYXRhLW5nLWNzcF1cIikpfWZ1bmN0aW9uIEFiKGIsYSl7dmFyIGM9Mjxhcmd1bWVudHMubGVuZ3RoP3lhLmNhbGwoYXJndW1lbnRzLDIpOltdO3JldHVybiFRKGEpfHxhIGluc3RhbmNlb2YgUmVnRXhwP2E6Yy5sZW5ndGg/ZnVuY3Rpb24oKXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD9cbmEuYXBwbHkoYixjLmNvbmNhdCh5YS5jYWxsKGFyZ3VtZW50cywwKSkpOmEuYXBwbHkoYixjKX06ZnVuY3Rpb24oKXtyZXR1cm4gYXJndW1lbnRzLmxlbmd0aD9hLmFwcGx5KGIsYXJndW1lbnRzKTphLmNhbGwoYil9fWZ1bmN0aW9uIFZjKGIsYSl7dmFyIGM9YTtcInN0cmluZ1wiPT09dHlwZW9mIGImJlwiJFwiPT09Yi5jaGFyQXQoMCk/Yz1zOkVhKGEpP2M9XCIkV0lORE9XXCI6YSYmVj09PWE/Yz1cIiRET0NVTUVOVFwiOmEmJihhLiRldmFsQXN5bmMmJmEuJHdhdGNoKSYmKGM9XCIkU0NPUEVcIik7cmV0dXJuIGN9ZnVuY3Rpb24gcmEoYixhKXtyZXR1cm5cInVuZGVmaW5lZFwiPT09dHlwZW9mIGI/czpKU09OLnN0cmluZ2lmeShiLFZjLGE/XCIgIFwiOm51bGwpfWZ1bmN0aW9uIGFjKGIpe3JldHVybiBDKGIpP0pTT04ucGFyc2UoYik6Yn1mdW5jdGlvbiBSYShiKXtcImZ1bmN0aW9uXCI9PT10eXBlb2YgYj9iPSEwOmImJjAhPT1iLmxlbmd0aD8oYj1MKFwiXCIrYiksYj0hKFwiZlwiPT1ifHxcIjBcIj09Ynx8XCJmYWxzZVwiPT1cbmJ8fFwibm9cIj09Ynx8XCJuXCI9PWJ8fFwiW11cIj09YikpOmI9ITE7cmV0dXJuIGJ9ZnVuY3Rpb24gZ2EoYil7Yj13KGIpLmNsb25lKCk7dHJ5e2IuZW1wdHkoKX1jYXRjaChhKXt9dmFyIGM9dyhcIjxkaXY+XCIpLmFwcGVuZChiKS5odG1sKCk7dHJ5e3JldHVybiAzPT09YlswXS5ub2RlVHlwZT9MKGMpOmMubWF0Y2goL14oPFtePl0rPikvKVsxXS5yZXBsYWNlKC9ePChbXFx3XFwtXSspLyxmdW5jdGlvbihhLGIpe3JldHVyblwiPFwiK0woYil9KX1jYXRjaChkKXtyZXR1cm4gTChjKX19ZnVuY3Rpb24gYmMoYil7dHJ5e3JldHVybiBkZWNvZGVVUklDb21wb25lbnQoYil9Y2F0Y2goYSl7fX1mdW5jdGlvbiBjYyhiKXt2YXIgYT17fSxjLGQ7cSgoYnx8XCJcIikuc3BsaXQoXCImXCIpLGZ1bmN0aW9uKGIpe2ImJihjPWIuc3BsaXQoXCI9XCIpLGQ9YmMoY1swXSksQihkKSYmKGI9QihjWzFdKT9iYyhjWzFdKTohMCxhW2RdP08oYVtkXSk/YVtkXS5wdXNoKGIpOmFbZF09W2FbZF0sYl06YVtkXT1iKSl9KTtyZXR1cm4gYX1cbmZ1bmN0aW9uIEJiKGIpe3ZhciBhPVtdO3EoYixmdW5jdGlvbihiLGQpe08oYik/cShiLGZ1bmN0aW9uKGIpe2EucHVzaCh6YShkLCEwKSsoITA9PT1iP1wiXCI6XCI9XCIremEoYiwhMCkpKX0pOmEucHVzaCh6YShkLCEwKSsoITA9PT1iP1wiXCI6XCI9XCIremEoYiwhMCkpKX0pO3JldHVybiBhLmxlbmd0aD9hLmpvaW4oXCImXCIpOlwiXCJ9ZnVuY3Rpb24gZ2IoYil7cmV0dXJuIHphKGIsITApLnJlcGxhY2UoLyUyNi9naSxcIiZcIikucmVwbGFjZSgvJTNEL2dpLFwiPVwiKS5yZXBsYWNlKC8lMkIvZ2ksXCIrXCIpfWZ1bmN0aW9uIHphKGIsYSl7cmV0dXJuIGVuY29kZVVSSUNvbXBvbmVudChiKS5yZXBsYWNlKC8lNDAvZ2ksXCJAXCIpLnJlcGxhY2UoLyUzQS9naSxcIjpcIikucmVwbGFjZSgvJTI0L2csXCIkXCIpLnJlcGxhY2UoLyUyQy9naSxcIixcIikucmVwbGFjZSgvJTIwL2csYT9cIiUyMFwiOlwiK1wiKX1mdW5jdGlvbiBXYyhiLGEpe2Z1bmN0aW9uIGMoYSl7YSYmZC5wdXNoKGEpfXZhciBkPVtiXSxlLGcsZj1bXCJuZzphcHBcIixcblwibmctYXBwXCIsXCJ4LW5nLWFwcFwiLFwiZGF0YS1uZy1hcHBcIl0saz0vXFxzbmdbOlxcLV1hcHAoOlxccyooW1xcd1xcZF9dKyk7Pyk/XFxzLztxKGYsZnVuY3Rpb24oYSl7ZlthXT0hMDtjKFYuZ2V0RWxlbWVudEJ5SWQoYSkpO2E9YS5yZXBsYWNlKFwiOlwiLFwiXFxcXDpcIik7Yi5xdWVyeVNlbGVjdG9yQWxsJiYocShiLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuXCIrYSksYykscShiLnF1ZXJ5U2VsZWN0b3JBbGwoXCIuXCIrYStcIlxcXFw6XCIpLGMpLHEoYi5xdWVyeVNlbGVjdG9yQWxsKFwiW1wiK2ErXCJdXCIpLGMpKX0pO3EoZCxmdW5jdGlvbihhKXtpZighZSl7dmFyIGI9ay5leGVjKFwiIFwiK2EuY2xhc3NOYW1lK1wiIFwiKTtiPyhlPWEsZz0oYlsyXXx8XCJcIikucmVwbGFjZSgvXFxzKy9nLFwiLFwiKSk6cShhLmF0dHJpYnV0ZXMsZnVuY3Rpb24oYil7IWUmJmZbYi5uYW1lXSYmKGU9YSxnPWIudmFsdWUpfSl9fSk7ZSYmYShlLGc/W2ddOltdKX1mdW5jdGlvbiBkYyhiLGEpe3ZhciBjPWZ1bmN0aW9uKCl7Yj13KGIpO2lmKGIuaW5qZWN0b3IoKSl7dmFyIGM9XG5iWzBdPT09Vj9cImRvY3VtZW50XCI6Z2EoYik7dGhyb3cgUWEoXCJidHN0cnBkXCIsYyk7fWE9YXx8W107YS51bnNoaWZ0KFtcIiRwcm92aWRlXCIsZnVuY3Rpb24oYSl7YS52YWx1ZShcIiRyb290RWxlbWVudFwiLGIpfV0pO2EudW5zaGlmdChcIm5nXCIpO2M9ZWMoYSk7Yy5pbnZva2UoW1wiJHJvb3RTY29wZVwiLFwiJHJvb3RFbGVtZW50XCIsXCIkY29tcGlsZVwiLFwiJGluamVjdG9yXCIsXCIkYW5pbWF0ZVwiLGZ1bmN0aW9uKGEsYixjLGQsZSl7YS4kYXBwbHkoZnVuY3Rpb24oKXtiLmRhdGEoXCIkaW5qZWN0b3JcIixkKTtjKGIpKGEpfSl9XSk7cmV0dXJuIGN9LGQ9L15OR19ERUZFUl9CT09UU1RSQVAhLztpZihUJiYhZC50ZXN0KFQubmFtZSkpcmV0dXJuIGMoKTtULm5hbWU9VC5uYW1lLnJlcGxhY2UoZCxcIlwiKTtTYS5yZXN1bWVCb290c3RyYXA9ZnVuY3Rpb24oYil7cShiLGZ1bmN0aW9uKGIpe2EucHVzaChiKX0pO2MoKX19ZnVuY3Rpb24gaGIoYixhKXthPWF8fFwiX1wiO3JldHVybiBiLnJlcGxhY2UoWGMsZnVuY3Rpb24oYixcbmQpe3JldHVybihkP2E6XCJcIikrYi50b0xvd2VyQ2FzZSgpfSl9ZnVuY3Rpb24gQ2IoYixhLGMpe2lmKCFiKXRocm93IFFhKFwiYXJlcVwiLGF8fFwiP1wiLGN8fFwicmVxdWlyZWRcIik7cmV0dXJuIGJ9ZnVuY3Rpb24gVGEoYixhLGMpe2MmJk8oYikmJihiPWJbYi5sZW5ndGgtMV0pO0NiKFEoYiksYSxcIm5vdCBhIGZ1bmN0aW9uLCBnb3QgXCIrKGImJlwib2JqZWN0XCI9PXR5cGVvZiBiP2IuY29uc3RydWN0b3IubmFtZXx8XCJPYmplY3RcIjp0eXBlb2YgYikpO3JldHVybiBifWZ1bmN0aW9uIEFhKGIsYSl7aWYoXCJoYXNPd25Qcm9wZXJ0eVwiPT09Yil0aHJvdyBRYShcImJhZG5hbWVcIixhKTt9ZnVuY3Rpb24gZmMoYixhLGMpe2lmKCFhKXJldHVybiBiO2E9YS5zcGxpdChcIi5cIik7Zm9yKHZhciBkLGU9YixnPWEubGVuZ3RoLGY9MDtmPGc7ZisrKWQ9YVtmXSxiJiYoYj0oZT1iKVtkXSk7cmV0dXJuIWMmJlEoYik/QWIoZSxiKTpifWZ1bmN0aW9uIERiKGIpe3ZhciBhPWJbMF07Yj1iW2IubGVuZ3RoLTFdO2lmKGE9PT1cbmIpcmV0dXJuIHcoYSk7dmFyIGM9W2FdO2Rve2E9YS5uZXh0U2libGluZztpZighYSlicmVhaztjLnB1c2goYSl9d2hpbGUoYSE9PWIpO3JldHVybiB3KGMpfWZ1bmN0aW9uIFljKGIpe3ZhciBhPXQoXCIkaW5qZWN0b3JcIiksYz10KFwibmdcIik7Yj1iLmFuZ3VsYXJ8fChiLmFuZ3VsYXI9e30pO2IuJCRtaW5FcnI9Yi4kJG1pbkVycnx8dDtyZXR1cm4gYi5tb2R1bGV8fChiLm1vZHVsZT1mdW5jdGlvbigpe3ZhciBiPXt9O3JldHVybiBmdW5jdGlvbihlLGcsZil7aWYoXCJoYXNPd25Qcm9wZXJ0eVwiPT09ZSl0aHJvdyBjKFwiYmFkbmFtZVwiLFwibW9kdWxlXCIpO2cmJmIuaGFzT3duUHJvcGVydHkoZSkmJihiW2VdPW51bGwpO3JldHVybiBiW2VdfHwoYltlXT1mdW5jdGlvbigpe2Z1bmN0aW9uIGIoYSxkLGUpe3JldHVybiBmdW5jdGlvbigpe2NbZXx8XCJwdXNoXCJdKFthLGQsYXJndW1lbnRzXSk7cmV0dXJuIG59fWlmKCFnKXRocm93IGEoXCJub21vZFwiLGUpO3ZhciBjPVtdLGQ9W10sbD1iKFwiJGluamVjdG9yXCIsXG5cImludm9rZVwiKSxuPXtfaW52b2tlUXVldWU6YyxfcnVuQmxvY2tzOmQscmVxdWlyZXM6ZyxuYW1lOmUscHJvdmlkZXI6YihcIiRwcm92aWRlXCIsXCJwcm92aWRlclwiKSxmYWN0b3J5OmIoXCIkcHJvdmlkZVwiLFwiZmFjdG9yeVwiKSxzZXJ2aWNlOmIoXCIkcHJvdmlkZVwiLFwic2VydmljZVwiKSx2YWx1ZTpiKFwiJHByb3ZpZGVcIixcInZhbHVlXCIpLGNvbnN0YW50OmIoXCIkcHJvdmlkZVwiLFwiY29uc3RhbnRcIixcInVuc2hpZnRcIiksYW5pbWF0aW9uOmIoXCIkYW5pbWF0ZVByb3ZpZGVyXCIsXCJyZWdpc3RlclwiKSxmaWx0ZXI6YihcIiRmaWx0ZXJQcm92aWRlclwiLFwicmVnaXN0ZXJcIiksY29udHJvbGxlcjpiKFwiJGNvbnRyb2xsZXJQcm92aWRlclwiLFwicmVnaXN0ZXJcIiksZGlyZWN0aXZlOmIoXCIkY29tcGlsZVByb3ZpZGVyXCIsXCJkaXJlY3RpdmVcIiksY29uZmlnOmwscnVuOmZ1bmN0aW9uKGEpe2QucHVzaChhKTtyZXR1cm4gdGhpc319O2YmJmwoZik7cmV0dXJuIG59KCkpfX0oKSl9ZnVuY3Rpb24gWmMoYil7SihiLHtib290c3RyYXA6ZGMsXG5jb3B5OkdhLGV4dGVuZDpKLGVxdWFsczp4YSxlbGVtZW50OncsZm9yRWFjaDpxLGluamVjdG9yOmVjLG5vb3A6eSxiaW5kOkFiLHRvSnNvbjpyYSxmcm9tSnNvbjphYyxpZGVudGl0eTpGYSxpc1VuZGVmaW5lZDpELGlzRGVmaW5lZDpCLGlzU3RyaW5nOkMsaXNGdW5jdGlvbjpRLGlzT2JqZWN0OlUsaXNOdW1iZXI6eWIsaXNFbGVtZW50OlRjLGlzQXJyYXk6Tyx2ZXJzaW9uOiRjLGlzRGF0ZTpOYSxsb3dlcmNhc2U6TCx1cHBlcmNhc2U6SGEsY2FsbGJhY2tzOntjb3VudGVyOjB9LCQkbWluRXJyOnQsJCRjc3A6JGJ9KTtVYT1ZYyhUKTt0cnl7VWEoXCJuZ0xvY2FsZVwiKX1jYXRjaChhKXtVYShcIm5nTG9jYWxlXCIsW10pLnByb3ZpZGVyKFwiJGxvY2FsZVwiLGFkKX1VYShcIm5nXCIsW1wibmdMb2NhbGVcIl0sW1wiJHByb3ZpZGVcIixmdW5jdGlvbihhKXthLnByb3ZpZGVyKHskJHNhbml0aXplVXJpOmJkfSk7YS5wcm92aWRlcihcIiRjb21waWxlXCIsZ2MpLmRpcmVjdGl2ZSh7YTpjZCxpbnB1dDpoYyx0ZXh0YXJlYTpoYyxcbmZvcm06ZGQsc2NyaXB0OmVkLHNlbGVjdDpmZCxzdHlsZTpnZCxvcHRpb246aGQsbmdCaW5kOmlkLG5nQmluZEh0bWw6amQsbmdCaW5kVGVtcGxhdGU6a2QsbmdDbGFzczpsZCxuZ0NsYXNzRXZlbjptZCxuZ0NsYXNzT2RkOm5kLG5nQ2xvYWs6b2QsbmdDb250cm9sbGVyOnBkLG5nRm9ybTpxZCxuZ0hpZGU6cmQsbmdJZjpzZCxuZ0luY2x1ZGU6dGQsbmdJbml0OnVkLG5nTm9uQmluZGFibGU6dmQsbmdQbHVyYWxpemU6d2QsbmdSZXBlYXQ6eGQsbmdTaG93OnlkLG5nU3R5bGU6emQsbmdTd2l0Y2g6QWQsbmdTd2l0Y2hXaGVuOkJkLG5nU3dpdGNoRGVmYXVsdDpDZCxuZ09wdGlvbnM6RGQsbmdUcmFuc2NsdWRlOkVkLG5nTW9kZWw6RmQsbmdMaXN0OkdkLG5nQ2hhbmdlOkhkLHJlcXVpcmVkOmljLG5nUmVxdWlyZWQ6aWMsbmdWYWx1ZTpJZH0pLmRpcmVjdGl2ZSh7bmdJbmNsdWRlOkpkfSkuZGlyZWN0aXZlKEViKS5kaXJlY3RpdmUoamMpO2EucHJvdmlkZXIoeyRhbmNob3JTY3JvbGw6S2QsXG4kYW5pbWF0ZTpMZCwkYnJvd3NlcjpNZCwkY2FjaGVGYWN0b3J5Ok5kLCRjb250cm9sbGVyOk9kLCRkb2N1bWVudDpQZCwkZXhjZXB0aW9uSGFuZGxlcjpRZCwkZmlsdGVyOmtjLCRpbnRlcnBvbGF0ZTpSZCwkaW50ZXJ2YWw6U2QsJGh0dHA6VGQsJGh0dHBCYWNrZW5kOlVkLCRsb2NhdGlvbjpWZCwkbG9nOldkLCRwYXJzZTpYZCwkcm9vdFNjb3BlOllkLCRxOlpkLCRzY2U6JGQsJHNjZURlbGVnYXRlOmFlLCRzbmlmZmVyOmJlLCR0ZW1wbGF0ZUNhY2hlOmNlLCR0aW1lb3V0OmRlLCR3aW5kb3c6ZWUsJCRyQUY6ZmUsJCRhc3luY0NhbGxiYWNrOmdlfSl9XSl9ZnVuY3Rpb24gVmEoYil7cmV0dXJuIGIucmVwbGFjZShoZSxmdW5jdGlvbihhLGIsZCxlKXtyZXR1cm4gZT9kLnRvVXBwZXJDYXNlKCk6ZH0pLnJlcGxhY2UoaWUsXCJNb3okMVwiKX1mdW5jdGlvbiBGYihiLGEsYyxkKXtmdW5jdGlvbiBlKGIpe3ZhciBlPWMmJmI/W3RoaXMuZmlsdGVyKGIpXTpbdGhpc10sbT1hLGgsbCxuLHAscixcbnY7aWYoIWR8fG51bGwhPWIpZm9yKDtlLmxlbmd0aDspZm9yKGg9ZS5zaGlmdCgpLGw9MCxuPWgubGVuZ3RoO2w8bjtsKyspZm9yKHA9dyhoW2xdKSxtP3AudHJpZ2dlckhhbmRsZXIoXCIkZGVzdHJveVwiKTptPSFtLHI9MCxwPSh2PXAuY2hpbGRyZW4oKSkubGVuZ3RoO3I8cDtyKyspZS5wdXNoKEJhKHZbcl0pKTtyZXR1cm4gZy5hcHBseSh0aGlzLGFyZ3VtZW50cyl9dmFyIGc9QmEuZm5bYl0sZz1nLiRvcmlnaW5hbHx8ZztlLiRvcmlnaW5hbD1nO0JhLmZuW2JdPWV9ZnVuY3Rpb24gUihiKXtpZihiIGluc3RhbmNlb2YgUilyZXR1cm4gYjtDKGIpJiYoYj1hYShiKSk7aWYoISh0aGlzIGluc3RhbmNlb2YgUikpe2lmKEMoYikmJlwiPFwiIT1iLmNoYXJBdCgwKSl0aHJvdyBHYihcIm5vc2VsXCIpO3JldHVybiBuZXcgUihiKX1pZihDKGIpKXt2YXIgYT1iO2I9Vjt2YXIgYztpZihjPWplLmV4ZWMoYSkpYj1bYi5jcmVhdGVFbGVtZW50KGNbMV0pXTtlbHNle3ZhciBkPWIsZTtiPWQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xuYz1bXTtpZihIYi50ZXN0KGEpKXtkPWIuYXBwZW5kQ2hpbGQoZC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpKTtlPShrZS5leGVjKGEpfHxbXCJcIixcIlwiXSlbMV0udG9Mb3dlckNhc2UoKTtlPWRhW2VdfHxkYS5fZGVmYXVsdDtkLmlubmVySFRNTD1cIjxkaXY+JiMxNjA7PC9kaXY+XCIrZVsxXSthLnJlcGxhY2UobGUsXCI8JDE+PC8kMj5cIikrZVsyXTtkLnJlbW92ZUNoaWxkKGQuZmlyc3RDaGlsZCk7Zm9yKGE9ZVswXTthLS07KWQ9ZC5sYXN0Q2hpbGQ7YT0wO2ZvcihlPWQuY2hpbGROb2Rlcy5sZW5ndGg7YTxlOysrYSljLnB1c2goZC5jaGlsZE5vZGVzW2FdKTtkPWIuZmlyc3RDaGlsZDtkLnRleHRDb250ZW50PVwiXCJ9ZWxzZSBjLnB1c2goZC5jcmVhdGVUZXh0Tm9kZShhKSk7Yi50ZXh0Q29udGVudD1cIlwiO2IuaW5uZXJIVE1MPVwiXCI7Yj1jfUliKHRoaXMsYik7dyhWLmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKSkuYXBwZW5kKHRoaXMpfWVsc2UgSWIodGhpcyxiKX1mdW5jdGlvbiBKYihiKXtyZXR1cm4gYi5jbG9uZU5vZGUoITApfVxuZnVuY3Rpb24gSWEoYil7bGMoYik7dmFyIGE9MDtmb3IoYj1iLmNoaWxkTm9kZXN8fFtdO2E8Yi5sZW5ndGg7YSsrKUlhKGJbYV0pfWZ1bmN0aW9uIG1jKGIsYSxjLGQpe2lmKEIoZCkpdGhyb3cgR2IoXCJvZmZhcmdzXCIpO3ZhciBlPWxhKGIsXCJldmVudHNcIik7bGEoYixcImhhbmRsZVwiKSYmKEQoYSk/cShlLGZ1bmN0aW9uKGEsYyl7V2EoYixjLGEpO2RlbGV0ZSBlW2NdfSk6cShhLnNwbGl0KFwiIFwiKSxmdW5jdGlvbihhKXtEKGMpPyhXYShiLGEsZVthXSksZGVsZXRlIGVbYV0pOlBhKGVbYV18fFtdLGMpfSkpfWZ1bmN0aW9uIGxjKGIsYSl7dmFyIGM9YltpYl0sZD1YYVtjXTtkJiYoYT9kZWxldGUgWGFbY10uZGF0YVthXTooZC5oYW5kbGUmJihkLmV2ZW50cy4kZGVzdHJveSYmZC5oYW5kbGUoe30sXCIkZGVzdHJveVwiKSxtYyhiKSksZGVsZXRlIFhhW2NdLGJbaWJdPXMpKX1mdW5jdGlvbiBsYShiLGEsYyl7dmFyIGQ9YltpYl0sZD1YYVtkfHwtMV07aWYoQihjKSlkfHwoYltpYl09ZD0rK21lLFxuZD1YYVtkXT17fSksZFthXT1jO2Vsc2UgcmV0dXJuIGQmJmRbYV19ZnVuY3Rpb24gbmMoYixhLGMpe3ZhciBkPWxhKGIsXCJkYXRhXCIpLGU9QihjKSxnPSFlJiZCKGEpLGY9ZyYmIVUoYSk7ZHx8Znx8bGEoYixcImRhdGFcIixkPXt9KTtpZihlKWRbYV09YztlbHNlIGlmKGcpe2lmKGYpcmV0dXJuIGQmJmRbYV07SihkLGEpfWVsc2UgcmV0dXJuIGR9ZnVuY3Rpb24gS2IoYixhKXtyZXR1cm4gYi5nZXRBdHRyaWJ1dGU/LTE8KFwiIFwiKyhiLmdldEF0dHJpYnV0ZShcImNsYXNzXCIpfHxcIlwiKStcIiBcIikucmVwbGFjZSgvW1xcblxcdF0vZyxcIiBcIikuaW5kZXhPZihcIiBcIithK1wiIFwiKTohMX1mdW5jdGlvbiBqYihiLGEpe2EmJmIuc2V0QXR0cmlidXRlJiZxKGEuc3BsaXQoXCIgXCIpLGZ1bmN0aW9uKGEpe2Iuc2V0QXR0cmlidXRlKFwiY2xhc3NcIixhYSgoXCIgXCIrKGIuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIil8fFwiXCIpK1wiIFwiKS5yZXBsYWNlKC9bXFxuXFx0XS9nLFwiIFwiKS5yZXBsYWNlKFwiIFwiK2FhKGEpK1wiIFwiLFwiIFwiKSkpfSl9XG5mdW5jdGlvbiBrYihiLGEpe2lmKGEmJmIuc2V0QXR0cmlidXRlKXt2YXIgYz0oXCIgXCIrKGIuZ2V0QXR0cmlidXRlKFwiY2xhc3NcIil8fFwiXCIpK1wiIFwiKS5yZXBsYWNlKC9bXFxuXFx0XS9nLFwiIFwiKTtxKGEuc3BsaXQoXCIgXCIpLGZ1bmN0aW9uKGEpe2E9YWEoYSk7LTE9PT1jLmluZGV4T2YoXCIgXCIrYStcIiBcIikmJihjKz1hK1wiIFwiKX0pO2Iuc2V0QXR0cmlidXRlKFwiY2xhc3NcIixhYShjKSl9fWZ1bmN0aW9uIEliKGIsYSl7aWYoYSl7YT1hLm5vZGVOYW1lfHwhQihhLmxlbmd0aCl8fEVhKGEpP1thXTphO2Zvcih2YXIgYz0wO2M8YS5sZW5ndGg7YysrKWIucHVzaChhW2NdKX19ZnVuY3Rpb24gb2MoYixhKXtyZXR1cm4gbGIoYixcIiRcIisoYXx8XCJuZ0NvbnRyb2xsZXJcIikrXCJDb250cm9sbGVyXCIpfWZ1bmN0aW9uIGxiKGIsYSxjKXtiPXcoYik7OT09YlswXS5ub2RlVHlwZSYmKGI9Yi5maW5kKFwiaHRtbFwiKSk7Zm9yKGE9TyhhKT9hOlthXTtiLmxlbmd0aDspe2Zvcih2YXIgZD1iWzBdLGU9MCxnPWEubGVuZ3RoO2U8XG5nO2UrKylpZigoYz1iLmRhdGEoYVtlXSkpIT09cylyZXR1cm4gYztiPXcoZC5wYXJlbnROb2RlfHwxMT09PWQubm9kZVR5cGUmJmQuaG9zdCl9fWZ1bmN0aW9uIHBjKGIpe2Zvcih2YXIgYT0wLGM9Yi5jaGlsZE5vZGVzO2E8Yy5sZW5ndGg7YSsrKUlhKGNbYV0pO2Zvcig7Yi5maXJzdENoaWxkOyliLnJlbW92ZUNoaWxkKGIuZmlyc3RDaGlsZCl9ZnVuY3Rpb24gcWMoYixhKXt2YXIgYz1tYlthLnRvTG93ZXJDYXNlKCldO3JldHVybiBjJiZyY1tiLm5vZGVOYW1lXSYmY31mdW5jdGlvbiBuZShiLGEpe3ZhciBjPWZ1bmN0aW9uKGMsZSl7Yy5wcmV2ZW50RGVmYXVsdHx8KGMucHJldmVudERlZmF1bHQ9ZnVuY3Rpb24oKXtjLnJldHVyblZhbHVlPSExfSk7Yy5zdG9wUHJvcGFnYXRpb258fChjLnN0b3BQcm9wYWdhdGlvbj1mdW5jdGlvbigpe2MuY2FuY2VsQnViYmxlPSEwfSk7Yy50YXJnZXR8fChjLnRhcmdldD1jLnNyY0VsZW1lbnR8fFYpO2lmKEQoYy5kZWZhdWx0UHJldmVudGVkKSl7dmFyIGc9XG5jLnByZXZlbnREZWZhdWx0O2MucHJldmVudERlZmF1bHQ9ZnVuY3Rpb24oKXtjLmRlZmF1bHRQcmV2ZW50ZWQ9ITA7Zy5jYWxsKGMpfTtjLmRlZmF1bHRQcmV2ZW50ZWQ9ITF9Yy5pc0RlZmF1bHRQcmV2ZW50ZWQ9ZnVuY3Rpb24oKXtyZXR1cm4gYy5kZWZhdWx0UHJldmVudGVkfHwhMT09PWMucmV0dXJuVmFsdWV9O3ZhciBmPWthKGFbZXx8Yy50eXBlXXx8W10pO3EoZixmdW5jdGlvbihhKXthLmNhbGwoYixjKX0pOzg+PVM/KGMucHJldmVudERlZmF1bHQ9bnVsbCxjLnN0b3BQcm9wYWdhdGlvbj1udWxsLGMuaXNEZWZhdWx0UHJldmVudGVkPW51bGwpOihkZWxldGUgYy5wcmV2ZW50RGVmYXVsdCxkZWxldGUgYy5zdG9wUHJvcGFnYXRpb24sZGVsZXRlIGMuaXNEZWZhdWx0UHJldmVudGVkKX07Yy5lbGVtPWI7cmV0dXJuIGN9ZnVuY3Rpb24gSmEoYil7dmFyIGE9dHlwZW9mIGIsYztcIm9iamVjdFwiPT1hJiZudWxsIT09Yj9cImZ1bmN0aW9uXCI9PXR5cGVvZihjPWIuJCRoYXNoS2V5KT9jPVxuYi4kJGhhc2hLZXkoKTpjPT09cyYmKGM9Yi4kJGhhc2hLZXk9ZWIoKSk6Yz1iO3JldHVybiBhK1wiOlwiK2N9ZnVuY3Rpb24gWWEoYil7cShiLHRoaXMucHV0LHRoaXMpfWZ1bmN0aW9uIHNjKGIpe3ZhciBhLGM7XCJmdW5jdGlvblwiPT10eXBlb2YgYj8oYT1iLiRpbmplY3QpfHwoYT1bXSxiLmxlbmd0aCYmKGM9Yi50b1N0cmluZygpLnJlcGxhY2Uob2UsXCJcIiksYz1jLm1hdGNoKHBlKSxxKGNbMV0uc3BsaXQocWUpLGZ1bmN0aW9uKGIpe2IucmVwbGFjZShyZSxmdW5jdGlvbihiLGMsZCl7YS5wdXNoKGQpfSl9KSksYi4kaW5qZWN0PWEpOk8oYik/KGM9Yi5sZW5ndGgtMSxUYShiW2NdLFwiZm5cIiksYT1iLnNsaWNlKDAsYykpOlRhKGIsXCJmblwiLCEwKTtyZXR1cm4gYX1mdW5jdGlvbiBlYyhiKXtmdW5jdGlvbiBhKGEpe3JldHVybiBmdW5jdGlvbihiLGMpe2lmKFUoYikpcShiLFhiKGEpKTtlbHNlIHJldHVybiBhKGIsYyl9fWZ1bmN0aW9uIGMoYSxiKXtBYShhLFwic2VydmljZVwiKTtpZihRKGIpfHxcbk8oYikpYj1uLmluc3RhbnRpYXRlKGIpO2lmKCFiLiRnZXQpdGhyb3cgWmEoXCJwZ2V0XCIsYSk7cmV0dXJuIGxbYStrXT1ifWZ1bmN0aW9uIGQoYSxiKXtyZXR1cm4gYyhhLHskZ2V0OmJ9KX1mdW5jdGlvbiBlKGEpe3ZhciBiPVtdLGMsZCxnLGs7cShhLGZ1bmN0aW9uKGEpe2lmKCFoLmdldChhKSl7aC5wdXQoYSwhMCk7dHJ5e2lmKEMoYSkpZm9yKGM9VWEoYSksYj1iLmNvbmNhdChlKGMucmVxdWlyZXMpKS5jb25jYXQoYy5fcnVuQmxvY2tzKSxkPWMuX2ludm9rZVF1ZXVlLGc9MCxrPWQubGVuZ3RoO2c8aztnKyspe3ZhciBmPWRbZ10sbT1uLmdldChmWzBdKTttW2ZbMV1dLmFwcGx5KG0sZlsyXSl9ZWxzZSBRKGEpP2IucHVzaChuLmludm9rZShhKSk6TyhhKT9iLnB1c2gobi5pbnZva2UoYSkpOlRhKGEsXCJtb2R1bGVcIil9Y2F0Y2gobCl7dGhyb3cgTyhhKSYmKGE9YVthLmxlbmd0aC0xXSksbC5tZXNzYWdlJiYobC5zdGFjayYmLTE9PWwuc3RhY2suaW5kZXhPZihsLm1lc3NhZ2UpKSYmXG4obD1sLm1lc3NhZ2UrXCJcXG5cIitsLnN0YWNrKSxaYShcIm1vZHVsZXJyXCIsYSxsLnN0YWNrfHxsLm1lc3NhZ2V8fGwpO319fSk7cmV0dXJuIGJ9ZnVuY3Rpb24gZyhhLGIpe2Z1bmN0aW9uIGMoZCl7aWYoYS5oYXNPd25Qcm9wZXJ0eShkKSl7aWYoYVtkXT09PWYpdGhyb3cgWmEoXCJjZGVwXCIsZCtcIiA8LSBcIittLmpvaW4oXCIgPC0gXCIpKTtyZXR1cm4gYVtkXX10cnl7cmV0dXJuIG0udW5zaGlmdChkKSxhW2RdPWYsYVtkXT1iKGQpfWNhdGNoKGUpe3Rocm93IGFbZF09PT1mJiZkZWxldGUgYVtkXSxlO31maW5hbGx5e20uc2hpZnQoKX19ZnVuY3Rpb24gZChhLGIsZSl7dmFyIGc9W10saz1zYyhhKSxmLG0saDttPTA7Zm9yKGY9ay5sZW5ndGg7bTxmO20rKyl7aD1rW21dO2lmKFwic3RyaW5nXCIhPT10eXBlb2YgaCl0aHJvdyBaYShcIml0a25cIixoKTtnLnB1c2goZSYmZS5oYXNPd25Qcm9wZXJ0eShoKT9lW2hdOmMoaCkpfWEuJGluamVjdHx8KGE9YVtmXSk7cmV0dXJuIGEuYXBwbHkoYixnKX1yZXR1cm57aW52b2tlOmQsXG5pbnN0YW50aWF0ZTpmdW5jdGlvbihhLGIpe3ZhciBjPWZ1bmN0aW9uKCl7fSxlO2MucHJvdG90eXBlPShPKGEpP2FbYS5sZW5ndGgtMV06YSkucHJvdG90eXBlO2M9bmV3IGM7ZT1kKGEsYyxiKTtyZXR1cm4gVShlKXx8UShlKT9lOmN9LGdldDpjLGFubm90YXRlOnNjLGhhczpmdW5jdGlvbihiKXtyZXR1cm4gbC5oYXNPd25Qcm9wZXJ0eShiK2spfHxhLmhhc093blByb3BlcnR5KGIpfX19dmFyIGY9e30saz1cIlByb3ZpZGVyXCIsbT1bXSxoPW5ldyBZYSxsPXskcHJvdmlkZTp7cHJvdmlkZXI6YShjKSxmYWN0b3J5OmEoZCksc2VydmljZTphKGZ1bmN0aW9uKGEsYil7cmV0dXJuIGQoYSxbXCIkaW5qZWN0b3JcIixmdW5jdGlvbihhKXtyZXR1cm4gYS5pbnN0YW50aWF0ZShiKX1dKX0pLHZhbHVlOmEoZnVuY3Rpb24oYSxiKXtyZXR1cm4gZChhLCQoYikpfSksY29uc3RhbnQ6YShmdW5jdGlvbihhLGIpe0FhKGEsXCJjb25zdGFudFwiKTtsW2FdPWI7cFthXT1ifSksZGVjb3JhdG9yOmZ1bmN0aW9uKGEsXG5iKXt2YXIgYz1uLmdldChhK2spLGQ9Yy4kZ2V0O2MuJGdldD1mdW5jdGlvbigpe3ZhciBhPXIuaW52b2tlKGQsYyk7cmV0dXJuIHIuaW52b2tlKGIsbnVsbCx7JGRlbGVnYXRlOmF9KX19fX0sbj1sLiRpbmplY3Rvcj1nKGwsZnVuY3Rpb24oKXt0aHJvdyBaYShcInVucHJcIixtLmpvaW4oXCIgPC0gXCIpKTt9KSxwPXt9LHI9cC4kaW5qZWN0b3I9ZyhwLGZ1bmN0aW9uKGEpe2E9bi5nZXQoYStrKTtyZXR1cm4gci5pbnZva2UoYS4kZ2V0LGEpfSk7cShlKGIpLGZ1bmN0aW9uKGEpe3IuaW52b2tlKGF8fHkpfSk7cmV0dXJuIHJ9ZnVuY3Rpb24gS2QoKXt2YXIgYj0hMDt0aGlzLmRpc2FibGVBdXRvU2Nyb2xsaW5nPWZ1bmN0aW9uKCl7Yj0hMX07dGhpcy4kZ2V0PVtcIiR3aW5kb3dcIixcIiRsb2NhdGlvblwiLFwiJHJvb3RTY29wZVwiLGZ1bmN0aW9uKGEsYyxkKXtmdW5jdGlvbiBlKGEpe3ZhciBiPW51bGw7cShhLGZ1bmN0aW9uKGEpe2J8fFwiYVwiIT09TChhLm5vZGVOYW1lKXx8KGI9YSl9KTtyZXR1cm4gYn1cbmZ1bmN0aW9uIGcoKXt2YXIgYj1jLmhhc2goKSxkO2I/KGQ9Zi5nZXRFbGVtZW50QnlJZChiKSk/ZC5zY3JvbGxJbnRvVmlldygpOihkPWUoZi5nZXRFbGVtZW50c0J5TmFtZShiKSkpP2Quc2Nyb2xsSW50b1ZpZXcoKTpcInRvcFwiPT09YiYmYS5zY3JvbGxUbygwLDApOmEuc2Nyb2xsVG8oMCwwKX12YXIgZj1hLmRvY3VtZW50O2ImJmQuJHdhdGNoKGZ1bmN0aW9uKCl7cmV0dXJuIGMuaGFzaCgpfSxmdW5jdGlvbigpe2QuJGV2YWxBc3luYyhnKX0pO3JldHVybiBnfV19ZnVuY3Rpb24gZ2UoKXt0aGlzLiRnZXQ9W1wiJCRyQUZcIixcIiR0aW1lb3V0XCIsZnVuY3Rpb24oYixhKXtyZXR1cm4gYi5zdXBwb3J0ZWQ/ZnVuY3Rpb24oYSl7cmV0dXJuIGIoYSl9OmZ1bmN0aW9uKGIpe3JldHVybiBhKGIsMCwhMSl9fV19ZnVuY3Rpb24gc2UoYixhLGMsZCl7ZnVuY3Rpb24gZShhKXt0cnl7YS5hcHBseShudWxsLHlhLmNhbGwoYXJndW1lbnRzLDEpKX1maW5hbGx5e2lmKHYtLSwwPT09dilmb3IoO0kubGVuZ3RoOyl0cnl7SS5wb3AoKSgpfWNhdGNoKGIpe2MuZXJyb3IoYil9fX1cbmZ1bmN0aW9uIGcoYSxiKXsoZnVuY3Rpb24gYmEoKXtxKHgsZnVuY3Rpb24oYSl7YSgpfSk7dT1iKGJhLGEpfSkoKX1mdW5jdGlvbiBmKCl7ej1udWxsO00hPWsudXJsKCkmJihNPWsudXJsKCkscShoYSxmdW5jdGlvbihhKXthKGsudXJsKCkpfSkpfXZhciBrPXRoaXMsbT1hWzBdLGg9Yi5sb2NhdGlvbixsPWIuaGlzdG9yeSxuPWIuc2V0VGltZW91dCxwPWIuY2xlYXJUaW1lb3V0LHI9e307ay5pc01vY2s9ITE7dmFyIHY9MCxJPVtdO2suJCRjb21wbGV0ZU91dHN0YW5kaW5nUmVxdWVzdD1lO2suJCRpbmNPdXRzdGFuZGluZ1JlcXVlc3RDb3VudD1mdW5jdGlvbigpe3YrK307ay5ub3RpZnlXaGVuTm9PdXRzdGFuZGluZ1JlcXVlc3RzPWZ1bmN0aW9uKGEpe3EoeCxmdW5jdGlvbihhKXthKCl9KTswPT09dj9hKCk6SS5wdXNoKGEpfTt2YXIgeD1bXSx1O2suYWRkUG9sbEZuPWZ1bmN0aW9uKGEpe0QodSkmJmcoMTAwLG4pO3gucHVzaChhKTtyZXR1cm4gYX07dmFyIE09aC5ocmVmLEY9YS5maW5kKFwiYmFzZVwiKSxcbno9bnVsbDtrLnVybD1mdW5jdGlvbihhLGMpe2ghPT1iLmxvY2F0aW9uJiYoaD1iLmxvY2F0aW9uKTtsIT09Yi5oaXN0b3J5JiYobD1iLmhpc3RvcnkpO2lmKGEpe2lmKE0hPWEpcmV0dXJuIE09YSxkLmhpc3Rvcnk/Yz9sLnJlcGxhY2VTdGF0ZShudWxsLFwiXCIsYSk6KGwucHVzaFN0YXRlKG51bGwsXCJcIixhKSxGLmF0dHIoXCJocmVmXCIsRi5hdHRyKFwiaHJlZlwiKSkpOih6PWEsYz9oLnJlcGxhY2UoYSk6aC5ocmVmPWEpLGt9ZWxzZSByZXR1cm4genx8aC5ocmVmLnJlcGxhY2UoLyUyNy9nLFwiJ1wiKX07dmFyIGhhPVtdLFA9ITE7ay5vblVybENoYW5nZT1mdW5jdGlvbihhKXtpZighUCl7aWYoZC5oaXN0b3J5KXcoYikub24oXCJwb3BzdGF0ZVwiLGYpO2lmKGQuaGFzaGNoYW5nZSl3KGIpLm9uKFwiaGFzaGNoYW5nZVwiLGYpO2Vsc2Ugay5hZGRQb2xsRm4oZik7UD0hMH1oYS5wdXNoKGEpO3JldHVybiBhfTtrLmJhc2VIcmVmPWZ1bmN0aW9uKCl7dmFyIGE9Ri5hdHRyKFwiaHJlZlwiKTtyZXR1cm4gYT9cbmEucmVwbGFjZSgvXihodHRwcz9cXDopP1xcL1xcL1teXFwvXSovLFwiXCIpOlwiXCJ9O3ZhciBOPXt9LGNhPVwiXCIsRT1rLmJhc2VIcmVmKCk7ay5jb29raWVzPWZ1bmN0aW9uKGEsYil7dmFyIGQsZSxnLGs7aWYoYSliPT09cz9tLmNvb2tpZT1lc2NhcGUoYSkrXCI9O3BhdGg9XCIrRStcIjtleHBpcmVzPVRodSwgMDEgSmFuIDE5NzAgMDA6MDA6MDAgR01UXCI6QyhiKSYmKGQ9KG0uY29va2llPWVzY2FwZShhKStcIj1cIitlc2NhcGUoYikrXCI7cGF0aD1cIitFKS5sZW5ndGgrMSw0MDk2PGQmJmMud2FybihcIkNvb2tpZSAnXCIrYStcIicgcG9zc2libHkgbm90IHNldCBvciBvdmVyZmxvd2VkIGJlY2F1c2UgaXQgd2FzIHRvbyBsYXJnZSAoXCIrZCtcIiA+IDQwOTYgYnl0ZXMpIVwiKSk7ZWxzZXtpZihtLmNvb2tpZSE9PWNhKWZvcihjYT1tLmNvb2tpZSxkPWNhLnNwbGl0KFwiOyBcIiksTj17fSxnPTA7ZzxkLmxlbmd0aDtnKyspZT1kW2ddLGs9ZS5pbmRleE9mKFwiPVwiKSwwPGsmJihhPXVuZXNjYXBlKGUuc3Vic3RyaW5nKDAsXG5rKSksTlthXT09PXMmJihOW2FdPXVuZXNjYXBlKGUuc3Vic3RyaW5nKGsrMSkpKSk7cmV0dXJuIE59fTtrLmRlZmVyPWZ1bmN0aW9uKGEsYil7dmFyIGM7disrO2M9bihmdW5jdGlvbigpe2RlbGV0ZSByW2NdO2UoYSl9LGJ8fDApO3JbY109ITA7cmV0dXJuIGN9O2suZGVmZXIuY2FuY2VsPWZ1bmN0aW9uKGEpe3JldHVybiByW2FdPyhkZWxldGUgclthXSxwKGEpLGUoeSksITApOiExfX1mdW5jdGlvbiBNZCgpe3RoaXMuJGdldD1bXCIkd2luZG93XCIsXCIkbG9nXCIsXCIkc25pZmZlclwiLFwiJGRvY3VtZW50XCIsZnVuY3Rpb24oYixhLGMsZCl7cmV0dXJuIG5ldyBzZShiLGQsYSxjKX1dfWZ1bmN0aW9uIE5kKCl7dGhpcy4kZ2V0PWZ1bmN0aW9uKCl7ZnVuY3Rpb24gYihiLGQpe2Z1bmN0aW9uIGUoYSl7YSE9biYmKHA/cD09YSYmKHA9YS5uKTpwPWEsZyhhLm4sYS5wKSxnKGEsbiksbj1hLG4ubj1udWxsKX1mdW5jdGlvbiBnKGEsYil7YSE9YiYmKGEmJihhLnA9YiksYiYmKGIubj1hKSl9aWYoYiBpblxuYSl0aHJvdyB0KFwiJGNhY2hlRmFjdG9yeVwiKShcImlpZFwiLGIpO3ZhciBmPTAsaz1KKHt9LGQse2lkOmJ9KSxtPXt9LGg9ZCYmZC5jYXBhY2l0eXx8TnVtYmVyLk1BWF9WQUxVRSxsPXt9LG49bnVsbCxwPW51bGw7cmV0dXJuIGFbYl09e3B1dDpmdW5jdGlvbihhLGIpe2lmKGg8TnVtYmVyLk1BWF9WQUxVRSl7dmFyIGM9bFthXXx8KGxbYV09e2tleTphfSk7ZShjKX1pZighRChiKSlyZXR1cm4gYSBpbiBtfHxmKyssbVthXT1iLGY+aCYmdGhpcy5yZW1vdmUocC5rZXkpLGJ9LGdldDpmdW5jdGlvbihhKXtpZihoPE51bWJlci5NQVhfVkFMVUUpe3ZhciBiPWxbYV07aWYoIWIpcmV0dXJuO2UoYil9cmV0dXJuIG1bYV19LHJlbW92ZTpmdW5jdGlvbihhKXtpZihoPE51bWJlci5NQVhfVkFMVUUpe3ZhciBiPWxbYV07aWYoIWIpcmV0dXJuO2I9PW4mJihuPWIucCk7Yj09cCYmKHA9Yi5uKTtnKGIubixiLnApO2RlbGV0ZSBsW2FdfWRlbGV0ZSBtW2FdO2YtLX0scmVtb3ZlQWxsOmZ1bmN0aW9uKCl7bT1cbnt9O2Y9MDtsPXt9O249cD1udWxsfSxkZXN0cm95OmZ1bmN0aW9uKCl7bD1rPW09bnVsbDtkZWxldGUgYVtiXX0saW5mbzpmdW5jdGlvbigpe3JldHVybiBKKHt9LGsse3NpemU6Zn0pfX19dmFyIGE9e307Yi5pbmZvPWZ1bmN0aW9uKCl7dmFyIGI9e307cShhLGZ1bmN0aW9uKGEsZSl7YltlXT1hLmluZm8oKX0pO3JldHVybiBifTtiLmdldD1mdW5jdGlvbihiKXtyZXR1cm4gYVtiXX07cmV0dXJuIGJ9fWZ1bmN0aW9uIGNlKCl7dGhpcy4kZ2V0PVtcIiRjYWNoZUZhY3RvcnlcIixmdW5jdGlvbihiKXtyZXR1cm4gYihcInRlbXBsYXRlc1wiKX1dfWZ1bmN0aW9uIGdjKGIsYSl7dmFyIGM9e30sZD1cIkRpcmVjdGl2ZVwiLGU9L15cXHMqZGlyZWN0aXZlXFw6XFxzKihbXFxkXFx3X1xcLV0rKVxccysoLiopJC8sZz0vKChbXFxkXFx3X1xcLV0rKSg/OlxcOihbXjtdKykpPzs/KS8sZj0vXihvblthLXpdK3xmb3JtYWN0aW9uKSQvO3RoaXMuZGlyZWN0aXZlPWZ1bmN0aW9uIG0oYSxlKXtBYShhLFwiZGlyZWN0aXZlXCIpO0MoYSk/XG4oQ2IoZSxcImRpcmVjdGl2ZUZhY3RvcnlcIiksYy5oYXNPd25Qcm9wZXJ0eShhKXx8KGNbYV09W10sYi5mYWN0b3J5KGErZCxbXCIkaW5qZWN0b3JcIixcIiRleGNlcHRpb25IYW5kbGVyXCIsZnVuY3Rpb24oYixkKXt2YXIgZT1bXTtxKGNbYV0sZnVuY3Rpb24oYyxnKXt0cnl7dmFyIGY9Yi5pbnZva2UoYyk7UShmKT9mPXtjb21waWxlOiQoZil9OiFmLmNvbXBpbGUmJmYubGluayYmKGYuY29tcGlsZT0kKGYubGluaykpO2YucHJpb3JpdHk9Zi5wcmlvcml0eXx8MDtmLmluZGV4PWc7Zi5uYW1lPWYubmFtZXx8YTtmLnJlcXVpcmU9Zi5yZXF1aXJlfHxmLmNvbnRyb2xsZXImJmYubmFtZTtmLnJlc3RyaWN0PWYucmVzdHJpY3R8fFwiQVwiO2UucHVzaChmKX1jYXRjaChtKXtkKG0pfX0pO3JldHVybiBlfV0pKSxjW2FdLnB1c2goZSkpOnEoYSxYYihtKSk7cmV0dXJuIHRoaXN9O3RoaXMuYUhyZWZTYW5pdGl6YXRpb25XaGl0ZWxpc3Q9ZnVuY3Rpb24oYil7cmV0dXJuIEIoYik/KGEuYUhyZWZTYW5pdGl6YXRpb25XaGl0ZWxpc3QoYiksXG50aGlzKTphLmFIcmVmU2FuaXRpemF0aW9uV2hpdGVsaXN0KCl9O3RoaXMuaW1nU3JjU2FuaXRpemF0aW9uV2hpdGVsaXN0PWZ1bmN0aW9uKGIpe3JldHVybiBCKGIpPyhhLmltZ1NyY1Nhbml0aXphdGlvbldoaXRlbGlzdChiKSx0aGlzKTphLmltZ1NyY1Nhbml0aXphdGlvbldoaXRlbGlzdCgpfTt0aGlzLiRnZXQ9W1wiJGluamVjdG9yXCIsXCIkaW50ZXJwb2xhdGVcIixcIiRleGNlcHRpb25IYW5kbGVyXCIsXCIkaHR0cFwiLFwiJHRlbXBsYXRlQ2FjaGVcIixcIiRwYXJzZVwiLFwiJGNvbnRyb2xsZXJcIixcIiRyb290U2NvcGVcIixcIiRkb2N1bWVudFwiLFwiJHNjZVwiLFwiJGFuaW1hdGVcIixcIiQkc2FuaXRpemVVcmlcIixmdW5jdGlvbihhLGIsbCxuLHAscix2LEkseCx1LE0sRil7ZnVuY3Rpb24geihhLGIsYyxkLGUpe2EgaW5zdGFuY2VvZiB3fHwoYT13KGEpKTtxKGEsZnVuY3Rpb24oYixjKXszPT1iLm5vZGVUeXBlJiZiLm5vZGVWYWx1ZS5tYXRjaCgvXFxTKy8pJiYoYVtjXT13KGIpLndyYXAoXCI8c3Bhbj48L3NwYW4+XCIpLnBhcmVudCgpWzBdKX0pO1xudmFyIGc9UChhLGIsYSxjLGQsZSk7aGEoYSxcIm5nLXNjb3BlXCIpO3JldHVybiBmdW5jdGlvbihiLGMsZCxlKXtDYihiLFwic2NvcGVcIik7dmFyIGY9Yz9LYS5jbG9uZS5jYWxsKGEpOmE7cShkLGZ1bmN0aW9uKGEsYil7Zi5kYXRhKFwiJFwiK2IrXCJDb250cm9sbGVyXCIsYSl9KTtkPTA7Zm9yKHZhciBtPWYubGVuZ3RoO2Q8bTtkKyspe3ZhciBoPWZbZF0ubm9kZVR5cGU7MSE9PWgmJjkhPT1ofHxmLmVxKGQpLmRhdGEoXCIkc2NvcGVcIixiKX1jJiZjKGYsYik7ZyYmZyhiLGYsZixlKTtyZXR1cm4gZn19ZnVuY3Rpb24gaGEoYSxiKXt0cnl7YS5hZGRDbGFzcyhiKX1jYXRjaChjKXt9fWZ1bmN0aW9uIFAoYSxiLGMsZCxlLGcpe2Z1bmN0aW9uIGYoYSxjLGQsZSl7dmFyIGcsaCxsLHIsbixwLHY7Zz1jLmxlbmd0aDt2YXIgSz1BcnJheShnKTtmb3Iobj0wO248ZztuKyspS1tuXT1jW25dO3Y9bj0wO2ZvcihwPW0ubGVuZ3RoO248cDt2KyspaD1LW3ZdLGM9bVtuKytdLGc9bVtuKytdLGw9dyhoKSxjP1xuKGMuc2NvcGU/KHI9YS4kbmV3KCksbC5kYXRhKFwiJHNjb3BlXCIscikpOnI9YSxsPWMudHJhbnNjbHVkZU9uVGhpc0VsZW1lbnQ/TihhLGMudHJhbnNjbHVkZSxlKTohYy50ZW1wbGF0ZU9uVGhpc0VsZW1lbnQmJmU/ZTohZSYmYj9OKGEsYik6bnVsbCxjKGcscixoLGQsbCkpOmcmJmcoYSxoLmNoaWxkTm9kZXMscyxlKX1mb3IodmFyIG09W10saCxsLHIsbixwPTA7cDxhLmxlbmd0aDtwKyspaD1uZXcgTGIsbD1jYShhW3BdLFtdLGgsMD09PXA/ZDpzLGUpLChnPWwubGVuZ3RoP0gobCxhW3BdLGgsYixjLG51bGwsW10sW10sZyk6bnVsbCkmJmcuc2NvcGUmJmhhKHcoYVtwXSksXCJuZy1zY29wZVwiKSxoPWcmJmcudGVybWluYWx8fCEocj1hW3BdLmNoaWxkTm9kZXMpfHwhci5sZW5ndGg/bnVsbDpQKHIsZz8oZy50cmFuc2NsdWRlT25UaGlzRWxlbWVudHx8IWcudGVtcGxhdGVPblRoaXNFbGVtZW50KSYmZy50cmFuc2NsdWRlOmIpLG0ucHVzaChnLGgpLG49bnx8Z3x8aCxnPW51bGw7cmV0dXJuIG4/XG5mOm51bGx9ZnVuY3Rpb24gTihhLGIsYyl7cmV0dXJuIGZ1bmN0aW9uKGQsZSxnKXt2YXIgZj0hMTtkfHwoZD1hLiRuZXcoKSxmPWQuJCR0cmFuc2NsdWRlZD0hMCk7ZT1iKGQsZSxnLGMpO2lmKGYpZS5vbihcIiRkZXN0cm95XCIsZnVuY3Rpb24oKXtkLiRkZXN0cm95KCl9KTtyZXR1cm4gZX19ZnVuY3Rpb24gY2EoYSxiLGMsZCxmKXt2YXIgbT1jLiRhdHRyLGg7c3dpdGNoKGEubm9kZVR5cGUpe2Nhc2UgMTpiYShiLG1hKExhKGEpLnRvTG93ZXJDYXNlKCkpLFwiRVwiLGQsZik7dmFyIGwscixuO2g9YS5hdHRyaWJ1dGVzO2Zvcih2YXIgcD0wLHY9aCYmaC5sZW5ndGg7cDx2O3ArKyl7dmFyIHg9ITEsST0hMTtsPWhbcF07aWYoIVN8fDg8PVN8fGwuc3BlY2lmaWVkKXtyPWwubmFtZTtuPW1hKHIpO1cudGVzdChuKSYmKHI9aGIobi5zdWJzdHIoNiksXCItXCIpKTt2YXIgTT1uLnJlcGxhY2UoLyhTdGFydHxFbmQpJC8sXCJcIik7bj09PU0rXCJTdGFydFwiJiYoeD1yLEk9ci5zdWJzdHIoMCxyLmxlbmd0aC1cbjUpK1wiZW5kXCIscj1yLnN1YnN0cigwLHIubGVuZ3RoLTYpKTtuPW1hKHIudG9Mb3dlckNhc2UoKSk7bVtuXT1yO2Nbbl09bD1hYShsLnZhbHVlKTtxYyhhLG4pJiYoY1tuXT0hMCk7UihhLGIsbCxuKTtiYShiLG4sXCJBXCIsZCxmLHgsSSl9fWE9YS5jbGFzc05hbWU7aWYoQyhhKSYmXCJcIiE9PWEpZm9yKDtoPWcuZXhlYyhhKTspbj1tYShoWzJdKSxiYShiLG4sXCJDXCIsZCxmKSYmKGNbbl09YWEoaFszXSkpLGE9YS5zdWJzdHIoaC5pbmRleCtoWzBdLmxlbmd0aCk7YnJlYWs7Y2FzZSAzOnQoYixhLm5vZGVWYWx1ZSk7YnJlYWs7Y2FzZSA4OnRyeXtpZihoPWUuZXhlYyhhLm5vZGVWYWx1ZSkpbj1tYShoWzFdKSxiYShiLG4sXCJNXCIsZCxmKSYmKGNbbl09YWEoaFsyXSkpfWNhdGNoKHUpe319Yi5zb3J0KEQpO3JldHVybiBifWZ1bmN0aW9uIEUoYSxiLGMpe3ZhciBkPVtdLGU9MDtpZihiJiZhLmhhc0F0dHJpYnV0ZSYmYS5oYXNBdHRyaWJ1dGUoYikpe2Rve2lmKCFhKXRocm93IGlhKFwidXRlcmRpclwiLFxuYixjKTsxPT1hLm5vZGVUeXBlJiYoYS5oYXNBdHRyaWJ1dGUoYikmJmUrKyxhLmhhc0F0dHJpYnV0ZShjKSYmZS0tKTtkLnB1c2goYSk7YT1hLm5leHRTaWJsaW5nfXdoaWxlKDA8ZSl9ZWxzZSBkLnB1c2goYSk7cmV0dXJuIHcoZCl9ZnVuY3Rpb24gQShhLGIsYyl7cmV0dXJuIGZ1bmN0aW9uKGQsZSxnLGYsaCl7ZT1FKGVbMF0sYixjKTtyZXR1cm4gYShkLGUsZyxmLGgpfX1mdW5jdGlvbiBIKGEsYyxkLGUsZyxmLG0sbixwKXtmdW5jdGlvbiB4KGEsYixjLGQpe2lmKGEpe2MmJihhPUEoYSxjLGQpKTthLnJlcXVpcmU9Ry5yZXF1aXJlO2EuZGlyZWN0aXZlTmFtZT1uYTtpZihOPT09R3x8Ry4kJGlzb2xhdGVTY29wZSlhPXVjKGEse2lzb2xhdGVTY29wZTohMH0pO20ucHVzaChhKX1pZihiKXtjJiYoYj1BKGIsYyxkKSk7Yi5yZXF1aXJlPUcucmVxdWlyZTtiLmRpcmVjdGl2ZU5hbWU9bmE7aWYoTj09PUd8fEcuJCRpc29sYXRlU2NvcGUpYj11YyhiLHtpc29sYXRlU2NvcGU6ITB9KTtuLnB1c2goYil9fVxuZnVuY3Rpb24gSShhLGIsYyxkKXt2YXIgZSxnPVwiZGF0YVwiLGY9ITE7aWYoQyhiKSl7Zm9yKDtcIl5cIj09KGU9Yi5jaGFyQXQoMCkpfHxcIj9cIj09ZTspYj1iLnN1YnN0cigxKSxcIl5cIj09ZSYmKGc9XCJpbmhlcml0ZWREYXRhXCIpLGY9Znx8XCI/XCI9PWU7ZT1udWxsO2QmJlwiZGF0YVwiPT09ZyYmKGU9ZFtiXSk7ZT1lfHxjW2ddKFwiJFwiK2IrXCJDb250cm9sbGVyXCIpO2lmKCFlJiYhZil0aHJvdyBpYShcImN0cmVxXCIsYixhKTt9ZWxzZSBPKGIpJiYoZT1bXSxxKGIsZnVuY3Rpb24oYil7ZS5wdXNoKEkoYSxiLGMsZCkpfSkpO3JldHVybiBlfWZ1bmN0aW9uIE0oYSxlLGcsZixwKXtmdW5jdGlvbiB4KGEsYil7dmFyIGM7Mj5hcmd1bWVudHMubGVuZ3RoJiYoYj1hLGE9cyk7Q2EmJihjPWNhKTtyZXR1cm4gcChhLGIsYyl9dmFyIHUsSyx6LEYsQSxFLGNhPXt9LG5iO3U9Yz09PWc/ZDprYShkLG5ldyBMYih3KGcpLGQuJGF0dHIpKTtLPXUuJCRlbGVtZW50O2lmKE4pe3ZhciBiYT0vXlxccyooW0A9Jl0pKFxcPz8pXFxzKihcXHcqKVxccyokLztcbmY9dyhnKTtFPWUuJG5ldyghMCk7IUh8fEghPT1OJiZIIT09Ti4kJG9yaWdpbmFsRGlyZWN0aXZlP2YuZGF0YShcIiRpc29sYXRlU2NvcGVOb1RlbXBsYXRlXCIsRSk6Zi5kYXRhKFwiJGlzb2xhdGVTY29wZVwiLEUpO2hhKGYsXCJuZy1pc29sYXRlLXNjb3BlXCIpO3EoTi5zY29wZSxmdW5jdGlvbihhLGMpe3ZhciBkPWEubWF0Y2goYmEpfHxbXSxnPWRbM118fGMsZj1cIj9cIj09ZFsyXSxkPWRbMV0sbSxsLG4scDtFLiQkaXNvbGF0ZUJpbmRpbmdzW2NdPWQrZztzd2l0Y2goZCl7Y2FzZSBcIkBcIjp1LiRvYnNlcnZlKGcsZnVuY3Rpb24oYSl7RVtjXT1hfSk7dS4kJG9ic2VydmVyc1tnXS4kJHNjb3BlPWU7dVtnXSYmKEVbY109Yih1W2ddKShlKSk7YnJlYWs7Y2FzZSBcIj1cIjppZihmJiYhdVtnXSlicmVhaztsPXIodVtnXSk7cD1sLmxpdGVyYWw/eGE6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYT09PWJ9O249bC5hc3NpZ258fGZ1bmN0aW9uKCl7bT1FW2NdPWwoZSk7dGhyb3cgaWEoXCJub25hc3NpZ25cIix1W2ddLFxuTi5uYW1lKTt9O209RVtjXT1sKGUpO0UuJHdhdGNoKGZ1bmN0aW9uKCl7dmFyIGE9bChlKTtwKGEsRVtjXSl8fChwKGEsbSk/bihlLGE9RVtjXSk6RVtjXT1hKTtyZXR1cm4gbT1hfSxudWxsLGwubGl0ZXJhbCk7YnJlYWs7Y2FzZSBcIiZcIjpsPXIodVtnXSk7RVtjXT1mdW5jdGlvbihhKXtyZXR1cm4gbChlLGEpfTticmVhaztkZWZhdWx0OnRocm93IGlhKFwiaXNjcFwiLE4ubmFtZSxjLGEpO319KX1uYj1wJiZ4O1AmJnEoUCxmdW5jdGlvbihhKXt2YXIgYj17JHNjb3BlOmE9PT1OfHxhLiQkaXNvbGF0ZVNjb3BlP0U6ZSwkZWxlbWVudDpLLCRhdHRyczp1LCR0cmFuc2NsdWRlOm5ifSxjO0E9YS5jb250cm9sbGVyO1wiQFwiPT1BJiYoQT11W2EubmFtZV0pO2M9dihBLGIpO2NhW2EubmFtZV09YztDYXx8Sy5kYXRhKFwiJFwiK2EubmFtZStcIkNvbnRyb2xsZXJcIixjKTthLmNvbnRyb2xsZXJBcyYmKGIuJHNjb3BlW2EuY29udHJvbGxlckFzXT1jKX0pO2Y9MDtmb3Ioej1tLmxlbmd0aDtmPHo7ZisrKXRyeXtGPVxubVtmXSxGKEYuaXNvbGF0ZVNjb3BlP0U6ZSxLLHUsRi5yZXF1aXJlJiZJKEYuZGlyZWN0aXZlTmFtZSxGLnJlcXVpcmUsSyxjYSksbmIpfWNhdGNoKEcpe2woRyxnYShLKSl9Zj1lO04mJihOLnRlbXBsYXRlfHxudWxsPT09Ti50ZW1wbGF0ZVVybCkmJihmPUUpO2EmJmEoZixnLmNoaWxkTm9kZXMscyxwKTtmb3IoZj1uLmxlbmd0aC0xOzA8PWY7Zi0tKXRyeXtGPW5bZl0sRihGLmlzb2xhdGVTY29wZT9FOmUsSyx1LEYucmVxdWlyZSYmSShGLmRpcmVjdGl2ZU5hbWUsRi5yZXF1aXJlLEssY2EpLG5iKX1jYXRjaChCKXtsKEIsZ2EoSykpfX1wPXB8fHt9O2Zvcih2YXIgdT0tTnVtYmVyLk1BWF9WQUxVRSxGLFA9cC5jb250cm9sbGVyRGlyZWN0aXZlcyxOPXAubmV3SXNvbGF0ZVNjb3BlRGlyZWN0aXZlLEg9cC50ZW1wbGF0ZURpcmVjdGl2ZSxiYT1wLm5vblRsYlRyYW5zY2x1ZGVEaXJlY3RpdmUsRD0hMSxKPSExLENhPXAuaGFzRWxlbWVudFRyYW5zY2x1ZGVEaXJlY3RpdmUsdD1kLiQkZWxlbWVudD1cbncoYyksRyxuYSxYLFQ9ZSxSLFM9MCxvYT1hLmxlbmd0aDtTPG9hO1MrKyl7Rz1hW1NdO3ZhciBXPUcuJCRzdGFydCxZPUcuJCRlbmQ7VyYmKHQ9RShjLFcsWSkpO1g9cztpZih1PkcucHJpb3JpdHkpYnJlYWs7aWYoWD1HLnNjb3BlKUY9Rnx8RyxHLnRlbXBsYXRlVXJsfHwoTChcIm5ldy9pc29sYXRlZCBzY29wZVwiLE4sRyx0KSxVKFgpJiYoTj1HKSk7bmE9Ry5uYW1lOyFHLnRlbXBsYXRlVXJsJiZHLmNvbnRyb2xsZXImJihYPUcuY29udHJvbGxlcixQPVB8fHt9LEwoXCInXCIrbmErXCInIGNvbnRyb2xsZXJcIixQW25hXSxHLHQpLFBbbmFdPUcpO2lmKFg9Ry50cmFuc2NsdWRlKUQ9ITAsRy4kJHRsYnx8KEwoXCJ0cmFuc2NsdXNpb25cIixiYSxHLHQpLGJhPUcpLFwiZWxlbWVudFwiPT1YPyhDYT0hMCx1PUcucHJpb3JpdHksWD1FKGMsVyxZKSx0PWQuJCRlbGVtZW50PXcoVi5jcmVhdGVDb21tZW50KFwiIFwiK25hK1wiOiBcIitkW25hXStcIiBcIikpLGM9dFswXSxvYihnLHcoeWEuY2FsbChYLDApKSxjKSxcblQ9eihYLGUsdSxmJiZmLm5hbWUse25vblRsYlRyYW5zY2x1ZGVEaXJlY3RpdmU6YmF9KSk6KFg9dyhKYihjKSkuY29udGVudHMoKSx0LmVtcHR5KCksVD16KFgsZSkpO2lmKEcudGVtcGxhdGUpaWYoSj0hMCxMKFwidGVtcGxhdGVcIixILEcsdCksSD1HLFg9UShHLnRlbXBsYXRlKT9HLnRlbXBsYXRlKHQsZCk6Ry50ZW1wbGF0ZSxYPVooWCksRy5yZXBsYWNlKXtmPUc7WD1IYi50ZXN0KFgpP3coYWEoWCkpOltdO2M9WFswXTtpZigxIT1YLmxlbmd0aHx8MSE9PWMubm9kZVR5cGUpdGhyb3cgaWEoXCJ0cGxydFwiLG5hLFwiXCIpO29iKGcsdCxjKTtvYT17JGF0dHI6e319O1g9Y2EoYyxbXSxvYSk7dmFyIHRlPWEuc3BsaWNlKFMrMSxhLmxlbmd0aC0oUysxKSk7TiYmdGMoWCk7YT1hLmNvbmNhdChYKS5jb25jYXQodGUpO0IoZCxvYSk7b2E9YS5sZW5ndGh9ZWxzZSB0Lmh0bWwoWCk7aWYoRy50ZW1wbGF0ZVVybClKPSEwLEwoXCJ0ZW1wbGF0ZVwiLEgsRyx0KSxIPUcsRy5yZXBsYWNlJiYoZj1HKSxNPVxueShhLnNwbGljZShTLGEubGVuZ3RoLVMpLHQsZCxnLEQmJlQsbSxuLHtjb250cm9sbGVyRGlyZWN0aXZlczpQLG5ld0lzb2xhdGVTY29wZURpcmVjdGl2ZTpOLHRlbXBsYXRlRGlyZWN0aXZlOkgsbm9uVGxiVHJhbnNjbHVkZURpcmVjdGl2ZTpiYX0pLG9hPWEubGVuZ3RoO2Vsc2UgaWYoRy5jb21waWxlKXRyeXtSPUcuY29tcGlsZSh0LGQsVCksUShSKT94KG51bGwsUixXLFkpOlImJngoUi5wcmUsUi5wb3N0LFcsWSl9Y2F0Y2goJCl7bCgkLGdhKHQpKX1HLnRlcm1pbmFsJiYoTS50ZXJtaW5hbD0hMCx1PU1hdGgubWF4KHUsRy5wcmlvcml0eSkpfU0uc2NvcGU9RiYmITA9PT1GLnNjb3BlO00udHJhbnNjbHVkZU9uVGhpc0VsZW1lbnQ9RDtNLnRlbXBsYXRlT25UaGlzRWxlbWVudD1KO00udHJhbnNjbHVkZT1UO3AuaGFzRWxlbWVudFRyYW5zY2x1ZGVEaXJlY3RpdmU9Q2E7cmV0dXJuIE19ZnVuY3Rpb24gdGMoYSl7Zm9yKHZhciBiPTAsYz1hLmxlbmd0aDtiPGM7YisrKWFbYl09WmIoYVtiXSxcbnskJGlzb2xhdGVTY29wZTohMH0pfWZ1bmN0aW9uIGJhKGIsZSxnLGYsaCxyLG4pe2lmKGU9PT1oKXJldHVybiBudWxsO2g9bnVsbDtpZihjLmhhc093blByb3BlcnR5KGUpKXt2YXIgcDtlPWEuZ2V0KGUrZCk7Zm9yKHZhciB2PTAseD1lLmxlbmd0aDt2PHg7disrKXRyeXtwPWVbdl0sKGY9PT1zfHxmPnAucHJpb3JpdHkpJiYtMSE9cC5yZXN0cmljdC5pbmRleE9mKGcpJiYociYmKHA9WmIocCx7JCRzdGFydDpyLCQkZW5kOm59KSksYi5wdXNoKHApLGg9cCl9Y2F0Y2goSSl7bChJKX19cmV0dXJuIGh9ZnVuY3Rpb24gQihhLGIpe3ZhciBjPWIuJGF0dHIsZD1hLiRhdHRyLGU9YS4kJGVsZW1lbnQ7cShhLGZ1bmN0aW9uKGQsZSl7XCIkXCIhPWUuY2hhckF0KDApJiYoYltlXSYmYltlXSE9PWQmJihkKz0oXCJzdHlsZVwiPT09ZT9cIjtcIjpcIiBcIikrYltlXSksYS4kc2V0KGUsZCwhMCxjW2VdKSl9KTtxKGIsZnVuY3Rpb24oYixnKXtcImNsYXNzXCI9PWc/KGhhKGUsYiksYVtcImNsYXNzXCJdPShhW1wiY2xhc3NcIl0/XG5hW1wiY2xhc3NcIl0rXCIgXCI6XCJcIikrYik6XCJzdHlsZVwiPT1nPyhlLmF0dHIoXCJzdHlsZVwiLGUuYXR0cihcInN0eWxlXCIpK1wiO1wiK2IpLGEuc3R5bGU9KGEuc3R5bGU/YS5zdHlsZStcIjtcIjpcIlwiKStiKTpcIiRcIj09Zy5jaGFyQXQoMCl8fGEuaGFzT3duUHJvcGVydHkoZyl8fChhW2ddPWIsZFtnXT1jW2ddKX0pfWZ1bmN0aW9uIHkoYSxiLGMsZCxlLGcsZixoKXt2YXIgbT1bXSxsLHIsdj1iWzBdLHg9YS5zaGlmdCgpLEk9Sih7fSx4LHt0ZW1wbGF0ZVVybDpudWxsLHRyYW5zY2x1ZGU6bnVsbCxyZXBsYWNlOm51bGwsJCRvcmlnaW5hbERpcmVjdGl2ZTp4fSksTT1RKHgudGVtcGxhdGVVcmwpP3gudGVtcGxhdGVVcmwoYixjKTp4LnRlbXBsYXRlVXJsO2IuZW1wdHkoKTtuLmdldCh1LmdldFRydXN0ZWRSZXNvdXJjZVVybChNKSx7Y2FjaGU6cH0pLnN1Y2Nlc3MoZnVuY3Rpb24obil7dmFyIHAsdTtuPVoobik7aWYoeC5yZXBsYWNlKXtuPUhiLnRlc3Qobik/dyhhYShuKSk6W107cD1uWzBdO2lmKDEhPVxubi5sZW5ndGh8fDEhPT1wLm5vZGVUeXBlKXRocm93IGlhKFwidHBscnRcIix4Lm5hbWUsTSk7bj17JGF0dHI6e319O29iKGQsYixwKTt2YXIgej1jYShwLFtdLG4pO1UoeC5zY29wZSkmJnRjKHopO2E9ei5jb25jYXQoYSk7QihjLG4pfWVsc2UgcD12LGIuaHRtbChuKTthLnVuc2hpZnQoSSk7bD1IKGEscCxjLGUsYix4LGcsZixoKTtxKGQsZnVuY3Rpb24oYSxjKXthPT1wJiYoZFtjXT1iWzBdKX0pO2ZvcihyPVAoYlswXS5jaGlsZE5vZGVzLGUpO20ubGVuZ3RoOyl7bj1tLnNoaWZ0KCk7dT1tLnNoaWZ0KCk7dmFyIEY9bS5zaGlmdCgpLEE9bS5zaGlmdCgpLHo9YlswXTtpZih1IT09dil7dmFyIEU9dS5jbGFzc05hbWU7aC5oYXNFbGVtZW50VHJhbnNjbHVkZURpcmVjdGl2ZSYmeC5yZXBsYWNlfHwoej1KYihwKSk7b2IoRix3KHUpLHopO2hhKHcoeiksRSl9dT1sLnRyYW5zY2x1ZGVPblRoaXNFbGVtZW50P04obixsLnRyYW5zY2x1ZGUsQSk6QTtsKHIsbix6LGQsdSl9bT1udWxsfSkuZXJyb3IoZnVuY3Rpb24oYSxcbmIsYyxkKXt0aHJvdyBpYShcInRwbG9hZFwiLGQudXJsKTt9KTtyZXR1cm4gZnVuY3Rpb24oYSxiLGMsZCxlKXthPWU7bT8obS5wdXNoKGIpLG0ucHVzaChjKSxtLnB1c2goZCksbS5wdXNoKGEpKToobC50cmFuc2NsdWRlT25UaGlzRWxlbWVudCYmKGE9TihiLGwudHJhbnNjbHVkZSxlKSksbChyLGIsYyxkLGEpKX19ZnVuY3Rpb24gRChhLGIpe3ZhciBjPWIucHJpb3JpdHktYS5wcmlvcml0eTtyZXR1cm4gMCE9PWM/YzphLm5hbWUhPT1iLm5hbWU/YS5uYW1lPGIubmFtZT8tMToxOmEuaW5kZXgtYi5pbmRleH1mdW5jdGlvbiBMKGEsYixjLGQpe2lmKGIpdGhyb3cgaWEoXCJtdWx0aWRpclwiLGIubmFtZSxjLm5hbWUsYSxnYShkKSk7fWZ1bmN0aW9uIHQoYSxjKXt2YXIgZD1iKGMsITApO2QmJmEucHVzaCh7cHJpb3JpdHk6MCxjb21waWxlOmZ1bmN0aW9uKGEpe3ZhciBiPWEucGFyZW50KCkubGVuZ3RoO2ImJmhhKGEucGFyZW50KCksXCJuZy1iaW5kaW5nXCIpO3JldHVybiBmdW5jdGlvbihhLFxuYyl7dmFyIGU9Yy5wYXJlbnQoKSxnPWUuZGF0YShcIiRiaW5kaW5nXCIpfHxbXTtnLnB1c2goZCk7ZS5kYXRhKFwiJGJpbmRpbmdcIixnKTtifHxoYShlLFwibmctYmluZGluZ1wiKTthLiR3YXRjaChkLGZ1bmN0aW9uKGEpe2NbMF0ubm9kZVZhbHVlPWF9KX19fSl9ZnVuY3Rpb24gVChhLGIpe2lmKFwic3JjZG9jXCI9PWIpcmV0dXJuIHUuSFRNTDt2YXIgYz1MYShhKTtpZihcInhsaW5rSHJlZlwiPT1ifHxcIkZPUk1cIj09YyYmXCJhY3Rpb25cIj09Ynx8XCJJTUdcIiE9YyYmKFwic3JjXCI9PWJ8fFwibmdTcmNcIj09YikpcmV0dXJuIHUuUkVTT1VSQ0VfVVJMfWZ1bmN0aW9uIFIoYSxjLGQsZSl7dmFyIGc9YihkLCEwKTtpZihnKXtpZihcIm11bHRpcGxlXCI9PT1lJiZcIlNFTEVDVFwiPT09TGEoYSkpdGhyb3cgaWEoXCJzZWxtdWx0aVwiLGdhKGEpKTtjLnB1c2goe3ByaW9yaXR5OjEwMCxjb21waWxlOmZ1bmN0aW9uKCl7cmV0dXJue3ByZTpmdW5jdGlvbihjLGQsbSl7ZD1tLiQkb2JzZXJ2ZXJzfHwobS4kJG9ic2VydmVycz1cbnt9KTtpZihmLnRlc3QoZSkpdGhyb3cgaWEoXCJub2RvbWV2ZW50c1wiKTtpZihnPWIobVtlXSwhMCxUKGEsZSkpKW1bZV09ZyhjKSwoZFtlXXx8KGRbZV09W10pKS4kJGludGVyPSEwLChtLiQkb2JzZXJ2ZXJzJiZtLiQkb2JzZXJ2ZXJzW2VdLiQkc2NvcGV8fGMpLiR3YXRjaChnLGZ1bmN0aW9uKGEsYil7XCJjbGFzc1wiPT09ZSYmYSE9Yj9tLiR1cGRhdGVDbGFzcyhhLGIpOm0uJHNldChlLGEpfSl9fX19KX19ZnVuY3Rpb24gb2IoYSxiLGMpe3ZhciBkPWJbMF0sZT1iLmxlbmd0aCxnPWQucGFyZW50Tm9kZSxmLG07aWYoYSlmb3IoZj0wLG09YS5sZW5ndGg7ZjxtO2YrKylpZihhW2ZdPT1kKXthW2YrK109YzttPWYrZS0xO2Zvcih2YXIgaD1hLmxlbmd0aDtmPGg7ZisrLG0rKyltPGg/YVtmXT1hW21dOmRlbGV0ZSBhW2ZdO2EubGVuZ3RoLT1lLTE7YnJlYWt9ZyYmZy5yZXBsYWNlQ2hpbGQoYyxkKTthPVYuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO2EuYXBwZW5kQ2hpbGQoZCk7Y1t3LmV4cGFuZG9dPVxuZFt3LmV4cGFuZG9dO2Q9MTtmb3IoZT1iLmxlbmd0aDtkPGU7ZCsrKWc9YltkXSx3KGcpLnJlbW92ZSgpLGEuYXBwZW5kQ2hpbGQoZyksZGVsZXRlIGJbZF07YlswXT1jO2IubGVuZ3RoPTF9ZnVuY3Rpb24gdWMoYSxiKXtyZXR1cm4gSihmdW5jdGlvbigpe3JldHVybiBhLmFwcGx5KG51bGwsYXJndW1lbnRzKX0sYSxiKX12YXIgTGI9ZnVuY3Rpb24oYSxiKXt0aGlzLiQkZWxlbWVudD1hO3RoaXMuJGF0dHI9Ynx8e319O0xiLnByb3RvdHlwZT17JG5vcm1hbGl6ZTptYSwkYWRkQ2xhc3M6ZnVuY3Rpb24oYSl7YSYmMDxhLmxlbmd0aCYmTS5hZGRDbGFzcyh0aGlzLiQkZWxlbWVudCxhKX0sJHJlbW92ZUNsYXNzOmZ1bmN0aW9uKGEpe2EmJjA8YS5sZW5ndGgmJk0ucmVtb3ZlQ2xhc3ModGhpcy4kJGVsZW1lbnQsYSl9LCR1cGRhdGVDbGFzczpmdW5jdGlvbihhLGIpe3ZhciBjPXZjKGEsYiksZD12YyhiLGEpOzA9PT1jLmxlbmd0aD9NLnJlbW92ZUNsYXNzKHRoaXMuJCRlbGVtZW50LGQpOlxuMD09PWQubGVuZ3RoP00uYWRkQ2xhc3ModGhpcy4kJGVsZW1lbnQsYyk6TS5zZXRDbGFzcyh0aGlzLiQkZWxlbWVudCxjLGQpfSwkc2V0OmZ1bmN0aW9uKGEsYixjLGQpe3ZhciBlPXFjKHRoaXMuJCRlbGVtZW50WzBdLGEpO2UmJih0aGlzLiQkZWxlbWVudC5wcm9wKGEsYiksZD1lKTt0aGlzW2FdPWI7ZD90aGlzLiRhdHRyW2FdPWQ6KGQ9dGhpcy4kYXR0clthXSl8fCh0aGlzLiRhdHRyW2FdPWQ9aGIoYSxcIi1cIikpO2U9TGEodGhpcy4kJGVsZW1lbnQpO2lmKFwiQVwiPT09ZSYmXCJocmVmXCI9PT1hfHxcIklNR1wiPT09ZSYmXCJzcmNcIj09PWEpdGhpc1thXT1iPUYoYixcInNyY1wiPT09YSk7ITEhPT1jJiYobnVsbD09PWJ8fGI9PT1zP3RoaXMuJCRlbGVtZW50LnJlbW92ZUF0dHIoZCk6dGhpcy4kJGVsZW1lbnQuYXR0cihkLGIpKTsoYz10aGlzLiQkb2JzZXJ2ZXJzKSYmcShjW2FdLGZ1bmN0aW9uKGEpe3RyeXthKGIpfWNhdGNoKGMpe2woYyl9fSl9LCRvYnNlcnZlOmZ1bmN0aW9uKGEsYil7dmFyIGM9XG50aGlzLGQ9Yy4kJG9ic2VydmVyc3x8KGMuJCRvYnNlcnZlcnM9e30pLGU9ZFthXXx8KGRbYV09W10pO2UucHVzaChiKTtJLiRldmFsQXN5bmMoZnVuY3Rpb24oKXtlLiQkaW50ZXJ8fGIoY1thXSl9KTtyZXR1cm4gYn19O3ZhciBDYT1iLnN0YXJ0U3ltYm9sKCksb2E9Yi5lbmRTeW1ib2woKSxaPVwie3tcIj09Q2F8fFwifX1cIj09b2E/RmE6ZnVuY3Rpb24oYSl7cmV0dXJuIGEucmVwbGFjZSgvXFx7XFx7L2csQ2EpLnJlcGxhY2UoL319L2csb2EpfSxXPS9ebmdBdHRyW0EtWl0vO3JldHVybiB6fV19ZnVuY3Rpb24gbWEoYil7cmV0dXJuIFZhKGIucmVwbGFjZSh1ZSxcIlwiKSl9ZnVuY3Rpb24gdmMoYixhKXt2YXIgYz1cIlwiLGQ9Yi5zcGxpdCgvXFxzKy8pLGU9YS5zcGxpdCgvXFxzKy8pLGc9MDthOmZvcig7ZzxkLmxlbmd0aDtnKyspe2Zvcih2YXIgZj1kW2ddLGs9MDtrPGUubGVuZ3RoO2srKylpZihmPT1lW2tdKWNvbnRpbnVlIGE7Yys9KDA8Yy5sZW5ndGg/XCIgXCI6XCJcIikrZn1yZXR1cm4gY31mdW5jdGlvbiBPZCgpe3ZhciBiPVxue30sYT0vXihcXFMrKShcXHMrYXNcXHMrKFxcdyspKT8kLzt0aGlzLnJlZ2lzdGVyPWZ1bmN0aW9uKGEsZCl7QWEoYSxcImNvbnRyb2xsZXJcIik7VShhKT9KKGIsYSk6YlthXT1kfTt0aGlzLiRnZXQ9W1wiJGluamVjdG9yXCIsXCIkd2luZG93XCIsZnVuY3Rpb24oYyxkKXtyZXR1cm4gZnVuY3Rpb24oZSxnKXt2YXIgZixrLG07QyhlKSYmKGY9ZS5tYXRjaChhKSxrPWZbMV0sbT1mWzNdLGU9Yi5oYXNPd25Qcm9wZXJ0eShrKT9iW2tdOmZjKGcuJHNjb3BlLGssITApfHxmYyhkLGssITApLFRhKGUsaywhMCkpO2Y9Yy5pbnN0YW50aWF0ZShlLGcpO2lmKG0pe2lmKCFnfHxcIm9iamVjdFwiIT10eXBlb2YgZy4kc2NvcGUpdGhyb3cgdChcIiRjb250cm9sbGVyXCIpKFwibm9zY3BcIixrfHxlLm5hbWUsbSk7Zy4kc2NvcGVbbV09Zn1yZXR1cm4gZn19XX1mdW5jdGlvbiBQZCgpe3RoaXMuJGdldD1bXCIkd2luZG93XCIsZnVuY3Rpb24oYil7cmV0dXJuIHcoYi5kb2N1bWVudCl9XX1mdW5jdGlvbiBRZCgpe3RoaXMuJGdldD1cbltcIiRsb2dcIixmdW5jdGlvbihiKXtyZXR1cm4gZnVuY3Rpb24oYSxjKXtiLmVycm9yLmFwcGx5KGIsYXJndW1lbnRzKX19XX1mdW5jdGlvbiB3YyhiKXt2YXIgYT17fSxjLGQsZTtpZighYilyZXR1cm4gYTtxKGIuc3BsaXQoXCJcXG5cIiksZnVuY3Rpb24oYil7ZT1iLmluZGV4T2YoXCI6XCIpO2M9TChhYShiLnN1YnN0cigwLGUpKSk7ZD1hYShiLnN1YnN0cihlKzEpKTtjJiYoYVtjXT1hW2NdP2FbY10rKFwiLCBcIitkKTpkKX0pO3JldHVybiBhfWZ1bmN0aW9uIHhjKGIpe3ZhciBhPVUoYik/YjpzO3JldHVybiBmdW5jdGlvbihjKXthfHwoYT13YyhiKSk7cmV0dXJuIGM/YVtMKGMpXXx8bnVsbDphfX1mdW5jdGlvbiB5YyhiLGEsYyl7aWYoUShjKSlyZXR1cm4gYyhiLGEpO3EoYyxmdW5jdGlvbihjKXtiPWMoYixhKX0pO3JldHVybiBifWZ1bmN0aW9uIFRkKCl7dmFyIGI9L15cXHMqKFxcW3xcXHtbXlxce10pLyxhPS9bXFx9XFxdXVxccyokLyxjPS9eXFwpXFxdXFx9Jyw/XFxuLyxkPXtcIkNvbnRlbnQtVHlwZVwiOlwiYXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04XCJ9LFxuZT10aGlzLmRlZmF1bHRzPXt0cmFuc2Zvcm1SZXNwb25zZTpbZnVuY3Rpb24oZCl7QyhkKSYmKGQ9ZC5yZXBsYWNlKGMsXCJcIiksYi50ZXN0KGQpJiZhLnRlc3QoZCkmJihkPWFjKGQpKSk7cmV0dXJuIGR9XSx0cmFuc2Zvcm1SZXF1ZXN0OltmdW5jdGlvbihhKXtyZXR1cm4gVShhKSYmXCJbb2JqZWN0IEZpbGVdXCIhPT13YS5jYWxsKGEpJiZcIltvYmplY3QgQmxvYl1cIiE9PXdhLmNhbGwoYSk/cmEoYSk6YX1dLGhlYWRlcnM6e2NvbW1vbjp7QWNjZXB0OlwiYXBwbGljYXRpb24vanNvbiwgdGV4dC9wbGFpbiwgKi8qXCJ9LHBvc3Q6a2EoZCkscHV0OmthKGQpLHBhdGNoOmthKGQpfSx4c3JmQ29va2llTmFtZTpcIlhTUkYtVE9LRU5cIix4c3JmSGVhZGVyTmFtZTpcIlgtWFNSRi1UT0tFTlwifSxnPXRoaXMuaW50ZXJjZXB0b3JzPVtdLGY9dGhpcy5yZXNwb25zZUludGVyY2VwdG9ycz1bXTt0aGlzLiRnZXQ9W1wiJGh0dHBCYWNrZW5kXCIsXCIkYnJvd3NlclwiLFwiJGNhY2hlRmFjdG9yeVwiLFwiJHJvb3RTY29wZVwiLFxuXCIkcVwiLFwiJGluamVjdG9yXCIsZnVuY3Rpb24oYSxiLGMsZCxuLHApe2Z1bmN0aW9uIHIoYSl7ZnVuY3Rpb24gYihhKXt2YXIgZD1KKHt9LGEse2RhdGE6eWMoYS5kYXRhLGEuaGVhZGVycyxjLnRyYW5zZm9ybVJlc3BvbnNlKX0pO3JldHVybiAyMDA8PWEuc3RhdHVzJiYzMDA+YS5zdGF0dXM/ZDpuLnJlamVjdChkKX12YXIgYz17bWV0aG9kOlwiZ2V0XCIsdHJhbnNmb3JtUmVxdWVzdDplLnRyYW5zZm9ybVJlcXVlc3QsdHJhbnNmb3JtUmVzcG9uc2U6ZS50cmFuc2Zvcm1SZXNwb25zZX0sZD1mdW5jdGlvbihhKXtmdW5jdGlvbiBiKGEpe3ZhciBjO3EoYSxmdW5jdGlvbihiLGQpe1EoYikmJihjPWIoKSxudWxsIT1jP2FbZF09YzpkZWxldGUgYVtkXSl9KX12YXIgYz1lLmhlYWRlcnMsZD1KKHt9LGEuaGVhZGVycyksZyxmLGM9Sih7fSxjLmNvbW1vbixjW0woYS5tZXRob2QpXSk7YihjKTtiKGQpO2E6Zm9yKGcgaW4gYyl7YT1MKGcpO2ZvcihmIGluIGQpaWYoTChmKT09PWEpY29udGludWUgYTtcbmRbZ109Y1tnXX1yZXR1cm4gZH0oYSk7SihjLGEpO2MuaGVhZGVycz1kO2MubWV0aG9kPUhhKGMubWV0aG9kKTt2YXIgZz1bZnVuY3Rpb24oYSl7ZD1hLmhlYWRlcnM7dmFyIGM9eWMoYS5kYXRhLHhjKGQpLGEudHJhbnNmb3JtUmVxdWVzdCk7RChhLmRhdGEpJiZxKGQsZnVuY3Rpb24oYSxiKXtcImNvbnRlbnQtdHlwZVwiPT09TChiKSYmZGVsZXRlIGRbYl19KTtEKGEud2l0aENyZWRlbnRpYWxzKSYmIUQoZS53aXRoQ3JlZGVudGlhbHMpJiYoYS53aXRoQ3JlZGVudGlhbHM9ZS53aXRoQ3JlZGVudGlhbHMpO3JldHVybiB2KGEsYyxkKS50aGVuKGIsYil9LHNdLGY9bi53aGVuKGMpO2ZvcihxKHUsZnVuY3Rpb24oYSl7KGEucmVxdWVzdHx8YS5yZXF1ZXN0RXJyb3IpJiZnLnVuc2hpZnQoYS5yZXF1ZXN0LGEucmVxdWVzdEVycm9yKTsoYS5yZXNwb25zZXx8YS5yZXNwb25zZUVycm9yKSYmZy5wdXNoKGEucmVzcG9uc2UsYS5yZXNwb25zZUVycm9yKX0pO2cubGVuZ3RoOyl7YT1nLnNoaWZ0KCk7XG52YXIgbT1nLnNoaWZ0KCksZj1mLnRoZW4oYSxtKX1mLnN1Y2Nlc3M9ZnVuY3Rpb24oYSl7Zi50aGVuKGZ1bmN0aW9uKGIpe2EoYi5kYXRhLGIuc3RhdHVzLGIuaGVhZGVycyxjKX0pO3JldHVybiBmfTtmLmVycm9yPWZ1bmN0aW9uKGEpe2YudGhlbihudWxsLGZ1bmN0aW9uKGIpe2EoYi5kYXRhLGIuc3RhdHVzLGIuaGVhZGVycyxjKX0pO3JldHVybiBmfTtyZXR1cm4gZn1mdW5jdGlvbiB2KGMsZyxmKXtmdW5jdGlvbiBoKGEsYixjLGUpe0EmJigyMDA8PWEmJjMwMD5hP0EucHV0KHcsW2EsYix3YyhjKSxlXSk6QS5yZW1vdmUodykpO3AoYixhLGMsZSk7ZC4kJHBoYXNlfHxkLiRhcHBseSgpfWZ1bmN0aW9uIHAoYSxiLGQsZSl7Yj1NYXRoLm1heChiLDApOygyMDA8PWImJjMwMD5iP3UucmVzb2x2ZTp1LnJlamVjdCkoe2RhdGE6YSxzdGF0dXM6YixoZWFkZXJzOnhjKGQpLGNvbmZpZzpjLHN0YXR1c1RleHQ6ZX0pfWZ1bmN0aW9uIHYoKXt2YXIgYT1PYShyLnBlbmRpbmdSZXF1ZXN0cyxcbmMpOy0xIT09YSYmci5wZW5kaW5nUmVxdWVzdHMuc3BsaWNlKGEsMSl9dmFyIHU9bi5kZWZlcigpLHE9dS5wcm9taXNlLEEsSCx3PUkoYy51cmwsYy5wYXJhbXMpO3IucGVuZGluZ1JlcXVlc3RzLnB1c2goYyk7cS50aGVuKHYsdik7KGMuY2FjaGV8fGUuY2FjaGUpJiYoITEhPT1jLmNhY2hlJiZcIkdFVFwiPT1jLm1ldGhvZCkmJihBPVUoYy5jYWNoZSk/Yy5jYWNoZTpVKGUuY2FjaGUpP2UuY2FjaGU6eCk7aWYoQSlpZihIPUEuZ2V0KHcpLEIoSCkpe2lmKEgudGhlbilyZXR1cm4gSC50aGVuKHYsdiksSDtPKEgpP3AoSFsxXSxIWzBdLGthKEhbMl0pLEhbM10pOnAoSCwyMDAse30sXCJPS1wiKX1lbHNlIEEucHV0KHcscSk7RChIKSYmKChIPU1iKGMudXJsKT9iLmNvb2tpZXMoKVtjLnhzcmZDb29raWVOYW1lfHxlLnhzcmZDb29raWVOYW1lXTpzKSYmKGZbYy54c3JmSGVhZGVyTmFtZXx8ZS54c3JmSGVhZGVyTmFtZV09SCksYShjLm1ldGhvZCx3LGcsaCxmLGMudGltZW91dCxjLndpdGhDcmVkZW50aWFscyxcbmMucmVzcG9uc2VUeXBlKSk7cmV0dXJuIHF9ZnVuY3Rpb24gSShhLGIpe2lmKCFiKXJldHVybiBhO3ZhciBjPVtdO1NjKGIsZnVuY3Rpb24oYSxiKXtudWxsPT09YXx8RChhKXx8KE8oYSl8fChhPVthXSkscShhLGZ1bmN0aW9uKGEpe1UoYSkmJihhPXJhKGEpKTtjLnB1c2goemEoYikrXCI9XCIremEoYSkpfSkpfSk7MDxjLmxlbmd0aCYmKGErPSgtMT09YS5pbmRleE9mKFwiP1wiKT9cIj9cIjpcIiZcIikrYy5qb2luKFwiJlwiKSk7cmV0dXJuIGF9dmFyIHg9YyhcIiRodHRwXCIpLHU9W107cShnLGZ1bmN0aW9uKGEpe3UudW5zaGlmdChDKGEpP3AuZ2V0KGEpOnAuaW52b2tlKGEpKX0pO3EoZixmdW5jdGlvbihhLGIpe3ZhciBjPUMoYSk/cC5nZXQoYSk6cC5pbnZva2UoYSk7dS5zcGxpY2UoYiwwLHtyZXNwb25zZTpmdW5jdGlvbihhKXtyZXR1cm4gYyhuLndoZW4oYSkpfSxyZXNwb25zZUVycm9yOmZ1bmN0aW9uKGEpe3JldHVybiBjKG4ucmVqZWN0KGEpKX19KX0pO3IucGVuZGluZ1JlcXVlc3RzPVtdO1xuKGZ1bmN0aW9uKGEpe3EoYXJndW1lbnRzLGZ1bmN0aW9uKGEpe3JbYV09ZnVuY3Rpb24oYixjKXtyZXR1cm4gcihKKGN8fHt9LHttZXRob2Q6YSx1cmw6Yn0pKX19KX0pKFwiZ2V0XCIsXCJkZWxldGVcIixcImhlYWRcIixcImpzb25wXCIpOyhmdW5jdGlvbihhKXtxKGFyZ3VtZW50cyxmdW5jdGlvbihhKXtyW2FdPWZ1bmN0aW9uKGIsYyxkKXtyZXR1cm4gcihKKGR8fHt9LHttZXRob2Q6YSx1cmw6YixkYXRhOmN9KSl9fSl9KShcInBvc3RcIixcInB1dFwiKTtyLmRlZmF1bHRzPWU7cmV0dXJuIHJ9XX1mdW5jdGlvbiB2ZShiKXtpZig4Pj1TJiYoIWIubWF0Y2goL14oZ2V0fHBvc3R8aGVhZHxwdXR8ZGVsZXRlfG9wdGlvbnMpJC9pKXx8IVQuWE1MSHR0cFJlcXVlc3QpKXJldHVybiBuZXcgVC5BY3RpdmVYT2JqZWN0KFwiTWljcm9zb2Z0LlhNTEhUVFBcIik7aWYoVC5YTUxIdHRwUmVxdWVzdClyZXR1cm4gbmV3IFQuWE1MSHR0cFJlcXVlc3Q7dGhyb3cgdChcIiRodHRwQmFja2VuZFwiKShcIm5veGhyXCIpO31mdW5jdGlvbiBVZCgpe3RoaXMuJGdldD1cbltcIiRicm93c2VyXCIsXCIkd2luZG93XCIsXCIkZG9jdW1lbnRcIixmdW5jdGlvbihiLGEsYyl7cmV0dXJuIHdlKGIsdmUsYi5kZWZlcixhLmFuZ3VsYXIuY2FsbGJhY2tzLGNbMF0pfV19ZnVuY3Rpb24gd2UoYixhLGMsZCxlKXtmdW5jdGlvbiBnKGEsYixjKXt2YXIgZz1lLmNyZWF0ZUVsZW1lbnQoXCJzY3JpcHRcIiksZj1udWxsO2cudHlwZT1cInRleHQvamF2YXNjcmlwdFwiO2cuc3JjPWE7Zy5hc3luYz0hMDtmPWZ1bmN0aW9uKGEpe1dhKGcsXCJsb2FkXCIsZik7V2EoZyxcImVycm9yXCIsZik7ZS5ib2R5LnJlbW92ZUNoaWxkKGcpO2c9bnVsbDt2YXIgaz0tMSx2PVwidW5rbm93blwiO2EmJihcImxvYWRcIiE9PWEudHlwZXx8ZFtiXS5jYWxsZWR8fChhPXt0eXBlOlwiZXJyb3JcIn0pLHY9YS50eXBlLGs9XCJlcnJvclwiPT09YS50eXBlPzQwNDoyMDApO2MmJmMoayx2KX07cGIoZyxcImxvYWRcIixmKTtwYihnLFwiZXJyb3JcIixmKTs4Pj1TJiYoZy5vbnJlYWR5c3RhdGVjaGFuZ2U9ZnVuY3Rpb24oKXtDKGcucmVhZHlTdGF0ZSkmJlxuL2xvYWRlZHxjb21wbGV0ZS8udGVzdChnLnJlYWR5U3RhdGUpJiYoZy5vbnJlYWR5c3RhdGVjaGFuZ2U9bnVsbCxmKHt0eXBlOlwibG9hZFwifSkpfSk7ZS5ib2R5LmFwcGVuZENoaWxkKGcpO3JldHVybiBmfXZhciBmPS0xO3JldHVybiBmdW5jdGlvbihlLG0saCxsLG4scCxyLHYpe2Z1bmN0aW9uIEkoKXt1PWY7RiYmRigpO3omJnouYWJvcnQoKX1mdW5jdGlvbiB4KGEsZCxlLGcsZil7UCYmYy5jYW5jZWwoUCk7Rj16PW51bGw7MD09PWQmJihkPWU/MjAwOlwiZmlsZVwiPT1zYShtKS5wcm90b2NvbD80MDQ6MCk7YSgxMjIzPT09ZD8yMDQ6ZCxlLGcsZnx8XCJcIik7Yi4kJGNvbXBsZXRlT3V0c3RhbmRpbmdSZXF1ZXN0KHkpfXZhciB1O2IuJCRpbmNPdXRzdGFuZGluZ1JlcXVlc3RDb3VudCgpO209bXx8Yi51cmwoKTtpZihcImpzb25wXCI9PUwoZSkpe3ZhciBNPVwiX1wiKyhkLmNvdW50ZXIrKykudG9TdHJpbmcoMzYpO2RbTV09ZnVuY3Rpb24oYSl7ZFtNXS5kYXRhPWE7ZFtNXS5jYWxsZWQ9ITB9O1xudmFyIEY9ZyhtLnJlcGxhY2UoXCJKU09OX0NBTExCQUNLXCIsXCJhbmd1bGFyLmNhbGxiYWNrcy5cIitNKSxNLGZ1bmN0aW9uKGEsYil7eChsLGEsZFtNXS5kYXRhLFwiXCIsYik7ZFtNXT15fSl9ZWxzZXt2YXIgej1hKGUpO3oub3BlbihlLG0sITApO3EobixmdW5jdGlvbihhLGIpe0IoYSkmJnouc2V0UmVxdWVzdEhlYWRlcihiLGEpfSk7ei5vbnJlYWR5c3RhdGVjaGFuZ2U9ZnVuY3Rpb24oKXtpZih6JiY0PT16LnJlYWR5U3RhdGUpe3ZhciBhPW51bGwsYj1udWxsO3UhPT1mJiYoYT16LmdldEFsbFJlc3BvbnNlSGVhZGVycygpLGI9XCJyZXNwb25zZVwiaW4gej96LnJlc3BvbnNlOnoucmVzcG9uc2VUZXh0KTt4KGwsdXx8ei5zdGF0dXMsYixhLHouc3RhdHVzVGV4dHx8XCJcIil9fTtyJiYoei53aXRoQ3JlZGVudGlhbHM9ITApO2lmKHYpdHJ5e3oucmVzcG9uc2VUeXBlPXZ9Y2F0Y2gocyl7aWYoXCJqc29uXCIhPT12KXRocm93IHM7fXouc2VuZChofHxudWxsKX1pZigwPHApdmFyIFA9YyhJLHApO2Vsc2UgcCYmXG5wLnRoZW4mJnAudGhlbihJKX19ZnVuY3Rpb24gUmQoKXt2YXIgYj1cInt7XCIsYT1cIn19XCI7dGhpcy5zdGFydFN5bWJvbD1mdW5jdGlvbihhKXtyZXR1cm4gYT8oYj1hLHRoaXMpOmJ9O3RoaXMuZW5kU3ltYm9sPWZ1bmN0aW9uKGIpe3JldHVybiBiPyhhPWIsdGhpcyk6YX07dGhpcy4kZ2V0PVtcIiRwYXJzZVwiLFwiJGV4Y2VwdGlvbkhhbmRsZXJcIixcIiRzY2VcIixmdW5jdGlvbihjLGQsZSl7ZnVuY3Rpb24gZyhnLGgsbCl7Zm9yKHZhciBuLHAscj0wLHY9W10sST1nLmxlbmd0aCx4PSExLHU9W107cjxJOyktMSE9KG49Zy5pbmRleE9mKGIscikpJiYtMSE9KHA9Zy5pbmRleE9mKGEsbitmKSk/KHIhPW4mJnYucHVzaChnLnN1YnN0cmluZyhyLG4pKSx2LnB1c2gocj1jKHg9Zy5zdWJzdHJpbmcobitmLHApKSksci5leHA9eCxyPXArayx4PSEwKToociE9SSYmdi5wdXNoKGcuc3Vic3RyaW5nKHIpKSxyPUkpOyhJPXYubGVuZ3RoKXx8KHYucHVzaChcIlwiKSxJPTEpO2lmKGwmJjE8di5sZW5ndGgpdGhyb3cgemMoXCJub2NvbmNhdFwiLFxuZyk7aWYoIWh8fHgpcmV0dXJuIHUubGVuZ3RoPUkscj1mdW5jdGlvbihhKXt0cnl7Zm9yKHZhciBiPTAsYz1JLGY7YjxjO2IrKyl7aWYoXCJmdW5jdGlvblwiPT10eXBlb2YoZj12W2JdKSlpZihmPWYoYSksZj1sP2UuZ2V0VHJ1c3RlZChsLGYpOmUudmFsdWVPZihmKSxudWxsPT1mKWY9XCJcIjtlbHNlIHN3aXRjaCh0eXBlb2YgZil7Y2FzZSBcInN0cmluZ1wiOmJyZWFrO2Nhc2UgXCJudW1iZXJcIjpmPVwiXCIrZjticmVhaztkZWZhdWx0OmY9cmEoZil9dVtiXT1mfXJldHVybiB1LmpvaW4oXCJcIil9Y2F0Y2goayl7YT16YyhcImludGVyclwiLGcsay50b1N0cmluZygpKSxkKGEpfX0sci5leHA9ZyxyLnBhcnRzPXYscn12YXIgZj1iLmxlbmd0aCxrPWEubGVuZ3RoO2cuc3RhcnRTeW1ib2w9ZnVuY3Rpb24oKXtyZXR1cm4gYn07Zy5lbmRTeW1ib2w9ZnVuY3Rpb24oKXtyZXR1cm4gYX07cmV0dXJuIGd9XX1mdW5jdGlvbiBTZCgpe3RoaXMuJGdldD1bXCIkcm9vdFNjb3BlXCIsXCIkd2luZG93XCIsXCIkcVwiLGZ1bmN0aW9uKGIsXG5hLGMpe2Z1bmN0aW9uIGQoZCxmLGssbSl7dmFyIGg9YS5zZXRJbnRlcnZhbCxsPWEuY2xlYXJJbnRlcnZhbCxuPWMuZGVmZXIoKSxwPW4ucHJvbWlzZSxyPTAsdj1CKG0pJiYhbTtrPUIoayk/azowO3AudGhlbihudWxsLG51bGwsZCk7cC4kJGludGVydmFsSWQ9aChmdW5jdGlvbigpe24ubm90aWZ5KHIrKyk7MDxrJiZyPj1rJiYobi5yZXNvbHZlKHIpLGwocC4kJGludGVydmFsSWQpLGRlbGV0ZSBlW3AuJCRpbnRlcnZhbElkXSk7dnx8Yi4kYXBwbHkoKX0sZik7ZVtwLiQkaW50ZXJ2YWxJZF09bjtyZXR1cm4gcH12YXIgZT17fTtkLmNhbmNlbD1mdW5jdGlvbihhKXtyZXR1cm4gYSYmYS4kJGludGVydmFsSWQgaW4gZT8oZVthLiQkaW50ZXJ2YWxJZF0ucmVqZWN0KFwiY2FuY2VsZWRcIiksY2xlYXJJbnRlcnZhbChhLiQkaW50ZXJ2YWxJZCksZGVsZXRlIGVbYS4kJGludGVydmFsSWRdLCEwKTohMX07cmV0dXJuIGR9XX1mdW5jdGlvbiBhZCgpe3RoaXMuJGdldD1mdW5jdGlvbigpe3JldHVybntpZDpcImVuLXVzXCIsXG5OVU1CRVJfRk9STUFUUzp7REVDSU1BTF9TRVA6XCIuXCIsR1JPVVBfU0VQOlwiLFwiLFBBVFRFUk5TOlt7bWluSW50OjEsbWluRnJhYzowLG1heEZyYWM6Myxwb3NQcmU6XCJcIixwb3NTdWY6XCJcIixuZWdQcmU6XCItXCIsbmVnU3VmOlwiXCIsZ1NpemU6MyxsZ1NpemU6M30se21pbkludDoxLG1pbkZyYWM6MixtYXhGcmFjOjIscG9zUHJlOlwiXFx1MDBhNFwiLHBvc1N1ZjpcIlwiLG5lZ1ByZTpcIihcXHUwMGE0XCIsbmVnU3VmOlwiKVwiLGdTaXplOjMsbGdTaXplOjN9XSxDVVJSRU5DWV9TWU06XCIkXCJ9LERBVEVUSU1FX0ZPUk1BVFM6e01PTlRIOlwiSmFudWFyeSBGZWJydWFyeSBNYXJjaCBBcHJpbCBNYXkgSnVuZSBKdWx5IEF1Z3VzdCBTZXB0ZW1iZXIgT2N0b2JlciBOb3ZlbWJlciBEZWNlbWJlclwiLnNwbGl0KFwiIFwiKSxTSE9SVE1PTlRIOlwiSmFuIEZlYiBNYXIgQXByIE1heSBKdW4gSnVsIEF1ZyBTZXAgT2N0IE5vdiBEZWNcIi5zcGxpdChcIiBcIiksREFZOlwiU3VuZGF5IE1vbmRheSBUdWVzZGF5IFdlZG5lc2RheSBUaHVyc2RheSBGcmlkYXkgU2F0dXJkYXlcIi5zcGxpdChcIiBcIiksXG5TSE9SVERBWTpcIlN1biBNb24gVHVlIFdlZCBUaHUgRnJpIFNhdFwiLnNwbGl0KFwiIFwiKSxBTVBNUzpbXCJBTVwiLFwiUE1cIl0sbWVkaXVtOlwiTU1NIGQsIHkgaDptbTpzcyBhXCIsXCJzaG9ydFwiOlwiTS9kL3l5IGg6bW0gYVwiLGZ1bGxEYXRlOlwiRUVFRSwgTU1NTSBkLCB5XCIsbG9uZ0RhdGU6XCJNTU1NIGQsIHlcIixtZWRpdW1EYXRlOlwiTU1NIGQsIHlcIixzaG9ydERhdGU6XCJNL2QveXlcIixtZWRpdW1UaW1lOlwiaDptbTpzcyBhXCIsc2hvcnRUaW1lOlwiaDptbSBhXCJ9LHBsdXJhbENhdDpmdW5jdGlvbihiKXtyZXR1cm4gMT09PWI/XCJvbmVcIjpcIm90aGVyXCJ9fX19ZnVuY3Rpb24gTmIoYil7Yj1iLnNwbGl0KFwiL1wiKTtmb3IodmFyIGE9Yi5sZW5ndGg7YS0tOyliW2FdPWdiKGJbYV0pO3JldHVybiBiLmpvaW4oXCIvXCIpfWZ1bmN0aW9uIEFjKGIsYSxjKXtiPXNhKGIsYyk7YS4kJHByb3RvY29sPWIucHJvdG9jb2w7YS4kJGhvc3Q9Yi5ob3N0bmFtZTthLiQkcG9ydD1aKGIucG9ydCl8fHhlW2IucHJvdG9jb2xdfHxudWxsfVxuZnVuY3Rpb24gQmMoYixhLGMpe3ZhciBkPVwiL1wiIT09Yi5jaGFyQXQoMCk7ZCYmKGI9XCIvXCIrYik7Yj1zYShiLGMpO2EuJCRwYXRoPWRlY29kZVVSSUNvbXBvbmVudChkJiZcIi9cIj09PWIucGF0aG5hbWUuY2hhckF0KDApP2IucGF0aG5hbWUuc3Vic3RyaW5nKDEpOmIucGF0aG5hbWUpO2EuJCRzZWFyY2g9Y2MoYi5zZWFyY2gpO2EuJCRoYXNoPWRlY29kZVVSSUNvbXBvbmVudChiLmhhc2gpO2EuJCRwYXRoJiZcIi9cIiE9YS4kJHBhdGguY2hhckF0KDApJiYoYS4kJHBhdGg9XCIvXCIrYS4kJHBhdGgpfWZ1bmN0aW9uIHBhKGIsYSl7aWYoMD09PWEuaW5kZXhPZihiKSlyZXR1cm4gYS5zdWJzdHIoYi5sZW5ndGgpfWZ1bmN0aW9uICRhKGIpe3ZhciBhPWIuaW5kZXhPZihcIiNcIik7cmV0dXJuLTE9PWE/YjpiLnN1YnN0cigwLGEpfWZ1bmN0aW9uIE9iKGIpe3JldHVybiBiLnN1YnN0cigwLCRhKGIpLmxhc3RJbmRleE9mKFwiL1wiKSsxKX1mdW5jdGlvbiBDYyhiLGEpe3RoaXMuJCRodG1sNT0hMDthPWF8fFxuXCJcIjt2YXIgYz1PYihiKTtBYyhiLHRoaXMsYik7dGhpcy4kJHBhcnNlPWZ1bmN0aW9uKGEpe3ZhciBlPXBhKGMsYSk7aWYoIUMoZSkpdGhyb3cgUGIoXCJpcHRocHJmeFwiLGEsYyk7QmMoZSx0aGlzLGIpO3RoaXMuJCRwYXRofHwodGhpcy4kJHBhdGg9XCIvXCIpO3RoaXMuJCRjb21wb3NlKCl9O3RoaXMuJCRjb21wb3NlPWZ1bmN0aW9uKCl7dmFyIGE9QmIodGhpcy4kJHNlYXJjaCksYj10aGlzLiQkaGFzaD9cIiNcIitnYih0aGlzLiQkaGFzaCk6XCJcIjt0aGlzLiQkdXJsPU5iKHRoaXMuJCRwYXRoKSsoYT9cIj9cIithOlwiXCIpK2I7dGhpcy4kJGFic1VybD1jK3RoaXMuJCR1cmwuc3Vic3RyKDEpfTt0aGlzLiQkcmV3cml0ZT1mdW5jdGlvbihkKXt2YXIgZTtpZigoZT1wYShiLGQpKSE9PXMpcmV0dXJuIGQ9ZSwoZT1wYShhLGUpKSE9PXM/YysocGEoXCIvXCIsZSl8fGUpOmIrZDtpZigoZT1wYShjLGQpKSE9PXMpcmV0dXJuIGMrZTtpZihjPT1kK1wiL1wiKXJldHVybiBjfX1mdW5jdGlvbiBRYihiLGEpe3ZhciBjPVxuT2IoYik7QWMoYix0aGlzLGIpO3RoaXMuJCRwYXJzZT1mdW5jdGlvbihkKXt2YXIgZT1wYShiLGQpfHxwYShjLGQpLGU9XCIjXCI9PWUuY2hhckF0KDApP3BhKGEsZSk6dGhpcy4kJGh0bWw1P2U6XCJcIjtpZighQyhlKSl0aHJvdyBQYihcImloc2hwcmZ4XCIsZCxhKTtCYyhlLHRoaXMsYik7ZD10aGlzLiQkcGF0aDt2YXIgZz0vXlxcL1tBLVpdOihcXC8uKikvOzA9PT1lLmluZGV4T2YoYikmJihlPWUucmVwbGFjZShiLFwiXCIpKTtnLmV4ZWMoZSl8fChkPShlPWcuZXhlYyhkKSk/ZVsxXTpkKTt0aGlzLiQkcGF0aD1kO3RoaXMuJCRjb21wb3NlKCl9O3RoaXMuJCRjb21wb3NlPWZ1bmN0aW9uKCl7dmFyIGM9QmIodGhpcy4kJHNlYXJjaCksZT10aGlzLiQkaGFzaD9cIiNcIitnYih0aGlzLiQkaGFzaCk6XCJcIjt0aGlzLiQkdXJsPU5iKHRoaXMuJCRwYXRoKSsoYz9cIj9cIitjOlwiXCIpK2U7dGhpcy4kJGFic1VybD1iKyh0aGlzLiQkdXJsP2ErdGhpcy4kJHVybDpcIlwiKX07dGhpcy4kJHJld3JpdGU9ZnVuY3Rpb24oYSl7aWYoJGEoYik9PVxuJGEoYSkpcmV0dXJuIGF9fWZ1bmN0aW9uIFJiKGIsYSl7dGhpcy4kJGh0bWw1PSEwO1FiLmFwcGx5KHRoaXMsYXJndW1lbnRzKTt2YXIgYz1PYihiKTt0aGlzLiQkcmV3cml0ZT1mdW5jdGlvbihkKXt2YXIgZTtpZihiPT0kYShkKSlyZXR1cm4gZDtpZihlPXBhKGMsZCkpcmV0dXJuIGIrYStlO2lmKGM9PT1kK1wiL1wiKXJldHVybiBjfTt0aGlzLiQkY29tcG9zZT1mdW5jdGlvbigpe3ZhciBjPUJiKHRoaXMuJCRzZWFyY2gpLGU9dGhpcy4kJGhhc2g/XCIjXCIrZ2IodGhpcy4kJGhhc2gpOlwiXCI7dGhpcy4kJHVybD1OYih0aGlzLiQkcGF0aCkrKGM/XCI/XCIrYzpcIlwiKStlO3RoaXMuJCRhYnNVcmw9YithK3RoaXMuJCR1cmx9fWZ1bmN0aW9uIHFiKGIpe3JldHVybiBmdW5jdGlvbigpe3JldHVybiB0aGlzW2JdfX1mdW5jdGlvbiBEYyhiLGEpe3JldHVybiBmdW5jdGlvbihjKXtpZihEKGMpKXJldHVybiB0aGlzW2JdO3RoaXNbYl09YShjKTt0aGlzLiQkY29tcG9zZSgpO3JldHVybiB0aGlzfX1mdW5jdGlvbiBWZCgpe3ZhciBiPVxuXCJcIixhPSExO3RoaXMuaGFzaFByZWZpeD1mdW5jdGlvbihhKXtyZXR1cm4gQihhKT8oYj1hLHRoaXMpOmJ9O3RoaXMuaHRtbDVNb2RlPWZ1bmN0aW9uKGIpe3JldHVybiBCKGIpPyhhPWIsdGhpcyk6YX07dGhpcy4kZ2V0PVtcIiRyb290U2NvcGVcIixcIiRicm93c2VyXCIsXCIkc25pZmZlclwiLFwiJHJvb3RFbGVtZW50XCIsZnVuY3Rpb24oYyxkLGUsZyl7ZnVuY3Rpb24gZihhKXtjLiRicm9hZGNhc3QoXCIkbG9jYXRpb25DaGFuZ2VTdWNjZXNzXCIsay5hYnNVcmwoKSxhKX12YXIgayxtLGg9ZC5iYXNlSHJlZigpLGw9ZC51cmwoKSxuO2E/KG49bC5zdWJzdHJpbmcoMCxsLmluZGV4T2YoXCIvXCIsbC5pbmRleE9mKFwiLy9cIikrMikpKyhofHxcIi9cIiksbT1lLmhpc3Rvcnk/Q2M6UmIpOihuPSRhKGwpLG09UWIpO2s9bmV3IG0obixcIiNcIitiKTtrLiQkcGFyc2Uoay4kJHJld3JpdGUobCkpO2cub24oXCJjbGlja1wiLGZ1bmN0aW9uKGEpe2lmKCFhLmN0cmxLZXkmJiFhLm1ldGFLZXkmJjIhPWEud2hpY2gpe2Zvcih2YXIgZT1cbncoYS50YXJnZXQpO1wiYVwiIT09TChlWzBdLm5vZGVOYW1lKTspaWYoZVswXT09PWdbMF18fCEoZT1lLnBhcmVudCgpKVswXSlyZXR1cm47dmFyIGY9ZS5wcm9wKFwiaHJlZlwiKTtVKGYpJiZcIltvYmplY3QgU1ZHQW5pbWF0ZWRTdHJpbmddXCI9PT1mLnRvU3RyaW5nKCkmJihmPXNhKGYuYW5pbVZhbCkuaHJlZik7aWYobT09PVJiKXt2YXIgaD1lLmF0dHIoXCJocmVmXCIpfHxlLmF0dHIoXCJ4bGluazpocmVmXCIpO2lmKDA+aC5pbmRleE9mKFwiOi8vXCIpKWlmKGY9XCIjXCIrYixcIi9cIj09aFswXSlmPW4rZitoO2Vsc2UgaWYoXCIjXCI9PWhbMF0pZj1uK2YrKGsucGF0aCgpfHxcIi9cIikraDtlbHNle2Zvcih2YXIgbD1rLnBhdGgoKS5zcGxpdChcIi9cIiksaD1oLnNwbGl0KFwiL1wiKSxwPTA7cDxoLmxlbmd0aDtwKyspXCIuXCIhPWhbcF0mJihcIi4uXCI9PWhbcF0/bC5wb3AoKTpoW3BdLmxlbmd0aCYmbC5wdXNoKGhbcF0pKTtmPW4rZitsLmpvaW4oXCIvXCIpfX1sPWsuJCRyZXdyaXRlKGYpO2YmJighZS5hdHRyKFwidGFyZ2V0XCIpJiZcbmwmJiFhLmlzRGVmYXVsdFByZXZlbnRlZCgpKSYmKGEucHJldmVudERlZmF1bHQoKSxsIT1kLnVybCgpJiYoay4kJHBhcnNlKGwpLGMuJGFwcGx5KCksVC5hbmd1bGFyW1wiZmYtNjg0MjA4LXByZXZlbnREZWZhdWx0XCJdPSEwKSl9fSk7ay5hYnNVcmwoKSE9bCYmZC51cmwoay5hYnNVcmwoKSwhMCk7ZC5vblVybENoYW5nZShmdW5jdGlvbihhKXtrLmFic1VybCgpIT1hJiYoYy4kZXZhbEFzeW5jKGZ1bmN0aW9uKCl7dmFyIGI9ay5hYnNVcmwoKTtrLiQkcGFyc2UoYSk7Yy4kYnJvYWRjYXN0KFwiJGxvY2F0aW9uQ2hhbmdlU3RhcnRcIixhLGIpLmRlZmF1bHRQcmV2ZW50ZWQ/KGsuJCRwYXJzZShiKSxkLnVybChiKSk6ZihiKX0pLGMuJCRwaGFzZXx8Yy4kZGlnZXN0KCkpfSk7dmFyIHA9MDtjLiR3YXRjaChmdW5jdGlvbigpe3ZhciBhPWQudXJsKCksYj1rLiQkcmVwbGFjZTtwJiZhPT1rLmFic1VybCgpfHwocCsrLGMuJGV2YWxBc3luYyhmdW5jdGlvbigpe2MuJGJyb2FkY2FzdChcIiRsb2NhdGlvbkNoYW5nZVN0YXJ0XCIsXG5rLmFic1VybCgpLGEpLmRlZmF1bHRQcmV2ZW50ZWQ/ay4kJHBhcnNlKGEpOihkLnVybChrLmFic1VybCgpLGIpLGYoYSkpfSkpO2suJCRyZXBsYWNlPSExO3JldHVybiBwfSk7cmV0dXJuIGt9XX1mdW5jdGlvbiBXZCgpe3ZhciBiPSEwLGE9dGhpczt0aGlzLmRlYnVnRW5hYmxlZD1mdW5jdGlvbihhKXtyZXR1cm4gQihhKT8oYj1hLHRoaXMpOmJ9O3RoaXMuJGdldD1bXCIkd2luZG93XCIsZnVuY3Rpb24oYyl7ZnVuY3Rpb24gZChhKXthIGluc3RhbmNlb2YgRXJyb3ImJihhLnN0YWNrP2E9YS5tZXNzYWdlJiYtMT09PWEuc3RhY2suaW5kZXhPZihhLm1lc3NhZ2UpP1wiRXJyb3I6IFwiK2EubWVzc2FnZStcIlxcblwiK2Euc3RhY2s6YS5zdGFjazphLnNvdXJjZVVSTCYmKGE9YS5tZXNzYWdlK1wiXFxuXCIrYS5zb3VyY2VVUkwrXCI6XCIrYS5saW5lKSk7cmV0dXJuIGF9ZnVuY3Rpb24gZShhKXt2YXIgYj1jLmNvbnNvbGV8fHt9LGU9YlthXXx8Yi5sb2d8fHk7YT0hMTt0cnl7YT0hIWUuYXBwbHl9Y2F0Y2gobSl7fXJldHVybiBhP1xuZnVuY3Rpb24oKXt2YXIgYT1bXTtxKGFyZ3VtZW50cyxmdW5jdGlvbihiKXthLnB1c2goZChiKSl9KTtyZXR1cm4gZS5hcHBseShiLGEpfTpmdW5jdGlvbihhLGIpe2UoYSxudWxsPT1iP1wiXCI6Yil9fXJldHVybntsb2c6ZShcImxvZ1wiKSxpbmZvOmUoXCJpbmZvXCIpLHdhcm46ZShcIndhcm5cIiksZXJyb3I6ZShcImVycm9yXCIpLGRlYnVnOmZ1bmN0aW9uKCl7dmFyIGM9ZShcImRlYnVnXCIpO3JldHVybiBmdW5jdGlvbigpe2ImJmMuYXBwbHkoYSxhcmd1bWVudHMpfX0oKX19XX1mdW5jdGlvbiBlYShiLGEpe2lmKFwiY29uc3RydWN0b3JcIj09PWIpdGhyb3cgRGEoXCJpc2VjZmxkXCIsYSk7cmV0dXJuIGJ9ZnVuY3Rpb24gYWIoYixhKXtpZihiKXtpZihiLmNvbnN0cnVjdG9yPT09Yil0aHJvdyBEYShcImlzZWNmblwiLGEpO2lmKGIuZG9jdW1lbnQmJmIubG9jYXRpb24mJmIuYWxlcnQmJmIuc2V0SW50ZXJ2YWwpdGhyb3cgRGEoXCJpc2Vjd2luZG93XCIsYSk7aWYoYi5jaGlsZHJlbiYmKGIubm9kZU5hbWV8fGIucHJvcCYmXG5iLmF0dHImJmIuZmluZCkpdGhyb3cgRGEoXCJpc2VjZG9tXCIsYSk7fXJldHVybiBifWZ1bmN0aW9uIHJiKGIsYSxjLGQsZSl7ZT1lfHx7fTthPWEuc3BsaXQoXCIuXCIpO2Zvcih2YXIgZyxmPTA7MTxhLmxlbmd0aDtmKyspe2c9ZWEoYS5zaGlmdCgpLGQpO3ZhciBrPWJbZ107a3x8KGs9e30sYltnXT1rKTtiPWs7Yi50aGVuJiZlLnVud3JhcFByb21pc2VzJiYodGEoZCksXCIkJHZcImluIGJ8fGZ1bmN0aW9uKGEpe2EudGhlbihmdW5jdGlvbihiKXthLiQkdj1ifSl9KGIpLGIuJCR2PT09cyYmKGIuJCR2PXt9KSxiPWIuJCR2KX1nPWVhKGEuc2hpZnQoKSxkKTtyZXR1cm4gYltnXT1jfWZ1bmN0aW9uIEVjKGIsYSxjLGQsZSxnLGYpe2VhKGIsZyk7ZWEoYSxnKTtlYShjLGcpO2VhKGQsZyk7ZWEoZSxnKTtyZXR1cm4gZi51bndyYXBQcm9taXNlcz9mdW5jdGlvbihmLG0pe3ZhciBoPW0mJm0uaGFzT3duUHJvcGVydHkoYik/bTpmLGw7aWYobnVsbD09aClyZXR1cm4gaDsoaD1oW2JdKSYmaC50aGVuJiZcbih0YShnKSxcIiQkdlwiaW4gaHx8KGw9aCxsLiQkdj1zLGwudGhlbihmdW5jdGlvbihhKXtsLiQkdj1hfSkpLGg9aC4kJHYpO2lmKCFhKXJldHVybiBoO2lmKG51bGw9PWgpcmV0dXJuIHM7KGg9aFthXSkmJmgudGhlbiYmKHRhKGcpLFwiJCR2XCJpbiBofHwobD1oLGwuJCR2PXMsbC50aGVuKGZ1bmN0aW9uKGEpe2wuJCR2PWF9KSksaD1oLiQkdik7aWYoIWMpcmV0dXJuIGg7aWYobnVsbD09aClyZXR1cm4gczsoaD1oW2NdKSYmaC50aGVuJiYodGEoZyksXCIkJHZcImluIGh8fChsPWgsbC4kJHY9cyxsLnRoZW4oZnVuY3Rpb24oYSl7bC4kJHY9YX0pKSxoPWguJCR2KTtpZighZClyZXR1cm4gaDtpZihudWxsPT1oKXJldHVybiBzOyhoPWhbZF0pJiZoLnRoZW4mJih0YShnKSxcIiQkdlwiaW4gaHx8KGw9aCxsLiQkdj1zLGwudGhlbihmdW5jdGlvbihhKXtsLiQkdj1hfSkpLGg9aC4kJHYpO2lmKCFlKXJldHVybiBoO2lmKG51bGw9PWgpcmV0dXJuIHM7KGg9aFtlXSkmJmgudGhlbiYmKHRhKGcpLFwiJCR2XCJpblxuaHx8KGw9aCxsLiQkdj1zLGwudGhlbihmdW5jdGlvbihhKXtsLiQkdj1hfSkpLGg9aC4kJHYpO3JldHVybiBofTpmdW5jdGlvbihnLGYpe3ZhciBoPWYmJmYuaGFzT3duUHJvcGVydHkoYik/ZjpnO2lmKG51bGw9PWgpcmV0dXJuIGg7aD1oW2JdO2lmKCFhKXJldHVybiBoO2lmKG51bGw9PWgpcmV0dXJuIHM7aD1oW2FdO2lmKCFjKXJldHVybiBoO2lmKG51bGw9PWgpcmV0dXJuIHM7aD1oW2NdO2lmKCFkKXJldHVybiBoO2lmKG51bGw9PWgpcmV0dXJuIHM7aD1oW2RdO3JldHVybiBlP251bGw9PWg/czpoPWhbZV06aH19ZnVuY3Rpb24geWUoYixhKXtlYShiLGEpO3JldHVybiBmdW5jdGlvbihhLGQpe3JldHVybiBudWxsPT1hP3M6KGQmJmQuaGFzT3duUHJvcGVydHkoYik/ZDphKVtiXX19ZnVuY3Rpb24gemUoYixhLGMpe2VhKGIsYyk7ZWEoYSxjKTtyZXR1cm4gZnVuY3Rpb24oYyxlKXtpZihudWxsPT1jKXJldHVybiBzO2M9KGUmJmUuaGFzT3duUHJvcGVydHkoYik/ZTpjKVtiXTtyZXR1cm4gbnVsbD09XG5jP3M6Y1thXX19ZnVuY3Rpb24gRmMoYixhLGMpe2lmKFNiLmhhc093blByb3BlcnR5KGIpKXJldHVybiBTYltiXTt2YXIgZD1iLnNwbGl0KFwiLlwiKSxlPWQubGVuZ3RoLGc7aWYoYS51bndyYXBQcm9taXNlc3x8MSE9PWUpaWYoYS51bndyYXBQcm9taXNlc3x8MiE9PWUpaWYoYS5jc3ApZz02PmU/RWMoZFswXSxkWzFdLGRbMl0sZFszXSxkWzRdLGMsYSk6ZnVuY3Rpb24oYixnKXt2YXIgZj0wLGs7ZG8gaz1FYyhkW2YrK10sZFtmKytdLGRbZisrXSxkW2YrK10sZFtmKytdLGMsYSkoYixnKSxnPXMsYj1rO3doaWxlKGY8ZSk7cmV0dXJuIGt9O2Vsc2V7dmFyIGY9XCJ2YXIgcDtcXG5cIjtxKGQsZnVuY3Rpb24oYixkKXtlYShiLGMpO2YrPVwiaWYocyA9PSBudWxsKSByZXR1cm4gdW5kZWZpbmVkO1xcbnM9XCIrKGQ/XCJzXCI6JygoayYmay5oYXNPd25Qcm9wZXJ0eShcIicrYisnXCIpKT9rOnMpJykrJ1tcIicrYisnXCJdO1xcbicrKGEudW53cmFwUHJvbWlzZXM/J2lmIChzICYmIHMudGhlbikge1xcbiBwdyhcIicrXG5jLnJlcGxhY2UoLyhbXCJcXHJcXG5dKS9nLFwiXFxcXCQxXCIpKydcIik7XFxuIGlmICghKFwiJCR2XCIgaW4gcykpIHtcXG4gcD1zO1xcbiBwLiQkdiA9IHVuZGVmaW5lZDtcXG4gcC50aGVuKGZ1bmN0aW9uKHYpIHtwLiQkdj12O30pO1xcbn1cXG4gcz1zLiQkdlxcbn1cXG4nOlwiXCIpfSk7dmFyIGY9ZitcInJldHVybiBzO1wiLGs9bmV3IEZ1bmN0aW9uKFwic1wiLFwia1wiLFwicHdcIixmKTtrLnRvU3RyaW5nPSQoZik7Zz1hLnVud3JhcFByb21pc2VzP2Z1bmN0aW9uKGEsYil7cmV0dXJuIGsoYSxiLHRhKX06a31lbHNlIGc9emUoZFswXSxkWzFdLGMpO2Vsc2UgZz15ZShkWzBdLGMpO1wiaGFzT3duUHJvcGVydHlcIiE9PWImJihTYltiXT1nKTtyZXR1cm4gZ31mdW5jdGlvbiBYZCgpe3ZhciBiPXt9LGE9e2NzcDohMSx1bndyYXBQcm9taXNlczohMSxsb2dQcm9taXNlV2FybmluZ3M6ITB9O3RoaXMudW53cmFwUHJvbWlzZXM9ZnVuY3Rpb24oYil7cmV0dXJuIEIoYik/KGEudW53cmFwUHJvbWlzZXM9ISFiLHRoaXMpOmEudW53cmFwUHJvbWlzZXN9O1xudGhpcy5sb2dQcm9taXNlV2FybmluZ3M9ZnVuY3Rpb24oYil7cmV0dXJuIEIoYik/KGEubG9nUHJvbWlzZVdhcm5pbmdzPWIsdGhpcyk6YS5sb2dQcm9taXNlV2FybmluZ3N9O3RoaXMuJGdldD1bXCIkZmlsdGVyXCIsXCIkc25pZmZlclwiLFwiJGxvZ1wiLGZ1bmN0aW9uKGMsZCxlKXthLmNzcD1kLmNzcDt0YT1mdW5jdGlvbihiKXthLmxvZ1Byb21pc2VXYXJuaW5ncyYmIUdjLmhhc093blByb3BlcnR5KGIpJiYoR2NbYl09ITAsZS53YXJuKFwiWyRwYXJzZV0gUHJvbWlzZSBmb3VuZCBpbiB0aGUgZXhwcmVzc2lvbiBgXCIrYitcImAuIEF1dG9tYXRpYyB1bndyYXBwaW5nIG9mIHByb21pc2VzIGluIEFuZ3VsYXIgZXhwcmVzc2lvbnMgaXMgZGVwcmVjYXRlZC5cIikpfTtyZXR1cm4gZnVuY3Rpb24oZCl7dmFyIGU7c3dpdGNoKHR5cGVvZiBkKXtjYXNlIFwic3RyaW5nXCI6aWYoYi5oYXNPd25Qcm9wZXJ0eShkKSlyZXR1cm4gYltkXTtlPW5ldyBUYihhKTtlPShuZXcgYmIoZSxjLGEpKS5wYXJzZShkKTtcImhhc093blByb3BlcnR5XCIhPT1cbmQmJihiW2RdPWUpO3JldHVybiBlO2Nhc2UgXCJmdW5jdGlvblwiOnJldHVybiBkO2RlZmF1bHQ6cmV0dXJuIHl9fX1dfWZ1bmN0aW9uIFpkKCl7dGhpcy4kZ2V0PVtcIiRyb290U2NvcGVcIixcIiRleGNlcHRpb25IYW5kbGVyXCIsZnVuY3Rpb24oYixhKXtyZXR1cm4gQWUoZnVuY3Rpb24oYSl7Yi4kZXZhbEFzeW5jKGEpfSxhKX1dfWZ1bmN0aW9uIEFlKGIsYSl7ZnVuY3Rpb24gYyhhKXtyZXR1cm4gYX1mdW5jdGlvbiBkKGEpe3JldHVybiBmKGEpfXZhciBlPWZ1bmN0aW9uKCl7dmFyIGY9W10saCxsO3JldHVybiBsPXtyZXNvbHZlOmZ1bmN0aW9uKGEpe2lmKGYpe3ZhciBjPWY7Zj1zO2g9ZyhhKTtjLmxlbmd0aCYmYihmdW5jdGlvbigpe2Zvcih2YXIgYSxiPTAsZD1jLmxlbmd0aDtiPGQ7YisrKWE9Y1tiXSxoLnRoZW4oYVswXSxhWzFdLGFbMl0pfSl9fSxyZWplY3Q6ZnVuY3Rpb24oYSl7bC5yZXNvbHZlKGsoYSkpfSxub3RpZnk6ZnVuY3Rpb24oYSl7aWYoZil7dmFyIGM9ZjtmLmxlbmd0aCYmXG5iKGZ1bmN0aW9uKCl7Zm9yKHZhciBiLGQ9MCxlPWMubGVuZ3RoO2Q8ZTtkKyspYj1jW2RdLGJbMl0oYSl9KX19LHByb21pc2U6e3RoZW46ZnVuY3Rpb24oYixnLGspe3ZhciBsPWUoKSxJPWZ1bmN0aW9uKGQpe3RyeXtsLnJlc29sdmUoKFEoYik/YjpjKShkKSl9Y2F0Y2goZSl7bC5yZWplY3QoZSksYShlKX19LHg9ZnVuY3Rpb24oYil7dHJ5e2wucmVzb2x2ZSgoUShnKT9nOmQpKGIpKX1jYXRjaChjKXtsLnJlamVjdChjKSxhKGMpfX0sdT1mdW5jdGlvbihiKXt0cnl7bC5ub3RpZnkoKFEoayk/azpjKShiKSl9Y2F0Y2goZCl7YShkKX19O2Y/Zi5wdXNoKFtJLHgsdV0pOmgudGhlbihJLHgsdSk7cmV0dXJuIGwucHJvbWlzZX0sXCJjYXRjaFwiOmZ1bmN0aW9uKGEpe3JldHVybiB0aGlzLnRoZW4obnVsbCxhKX0sXCJmaW5hbGx5XCI6ZnVuY3Rpb24oYSl7ZnVuY3Rpb24gYihhLGMpe3ZhciBkPWUoKTtjP2QucmVzb2x2ZShhKTpkLnJlamVjdChhKTtyZXR1cm4gZC5wcm9taXNlfWZ1bmN0aW9uIGQoZSxcbmcpe3ZhciBmPW51bGw7dHJ5e2Y9KGF8fGMpKCl9Y2F0Y2goayl7cmV0dXJuIGIoaywhMSl9cmV0dXJuIGYmJlEoZi50aGVuKT9mLnRoZW4oZnVuY3Rpb24oKXtyZXR1cm4gYihlLGcpfSxmdW5jdGlvbihhKXtyZXR1cm4gYihhLCExKX0pOmIoZSxnKX1yZXR1cm4gdGhpcy50aGVuKGZ1bmN0aW9uKGEpe3JldHVybiBkKGEsITApfSxmdW5jdGlvbihhKXtyZXR1cm4gZChhLCExKX0pfX19fSxnPWZ1bmN0aW9uKGEpe3JldHVybiBhJiZRKGEudGhlbik/YTp7dGhlbjpmdW5jdGlvbihjKXt2YXIgZD1lKCk7YihmdW5jdGlvbigpe2QucmVzb2x2ZShjKGEpKX0pO3JldHVybiBkLnByb21pc2V9fX0sZj1mdW5jdGlvbihhKXt2YXIgYj1lKCk7Yi5yZWplY3QoYSk7cmV0dXJuIGIucHJvbWlzZX0saz1mdW5jdGlvbihjKXtyZXR1cm57dGhlbjpmdW5jdGlvbihnLGYpe3ZhciBrPWUoKTtiKGZ1bmN0aW9uKCl7dHJ5e2sucmVzb2x2ZSgoUShmKT9mOmQpKGMpKX1jYXRjaChiKXtrLnJlamVjdChiKSxcbmEoYil9fSk7cmV0dXJuIGsucHJvbWlzZX19fTtyZXR1cm57ZGVmZXI6ZSxyZWplY3Q6Zix3aGVuOmZ1bmN0aW9uKGssaCxsLG4pe3ZhciBwPWUoKSxyLHY9ZnVuY3Rpb24oYil7dHJ5e3JldHVybihRKGgpP2g6YykoYil9Y2F0Y2goZCl7cmV0dXJuIGEoZCksZihkKX19LEk9ZnVuY3Rpb24oYil7dHJ5e3JldHVybihRKGwpP2w6ZCkoYil9Y2F0Y2goYyl7cmV0dXJuIGEoYyksZihjKX19LHg9ZnVuY3Rpb24oYil7dHJ5e3JldHVybihRKG4pP246YykoYil9Y2F0Y2goZCl7YShkKX19O2IoZnVuY3Rpb24oKXtnKGspLnRoZW4oZnVuY3Rpb24oYSl7cnx8KHI9ITAscC5yZXNvbHZlKGcoYSkudGhlbih2LEkseCkpKX0sZnVuY3Rpb24oYSl7cnx8KHI9ITAscC5yZXNvbHZlKEkoYSkpKX0sZnVuY3Rpb24oYSl7cnx8cC5ub3RpZnkoeChhKSl9KX0pO3JldHVybiBwLnByb21pc2V9LGFsbDpmdW5jdGlvbihhKXt2YXIgYj1lKCksYz0wLGQ9TyhhKT9bXTp7fTtxKGEsZnVuY3Rpb24oYSxlKXtjKys7XG5nKGEpLnRoZW4oZnVuY3Rpb24oYSl7ZC5oYXNPd25Qcm9wZXJ0eShlKXx8KGRbZV09YSwtLWN8fGIucmVzb2x2ZShkKSl9LGZ1bmN0aW9uKGEpe2QuaGFzT3duUHJvcGVydHkoZSl8fGIucmVqZWN0KGEpfSl9KTswPT09YyYmYi5yZXNvbHZlKGQpO3JldHVybiBiLnByb21pc2V9fX1mdW5jdGlvbiBmZSgpe3RoaXMuJGdldD1bXCIkd2luZG93XCIsXCIkdGltZW91dFwiLGZ1bmN0aW9uKGIsYSl7dmFyIGM9Yi5yZXF1ZXN0QW5pbWF0aW9uRnJhbWV8fGIud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lfHxiLm1velJlcXVlc3RBbmltYXRpb25GcmFtZSxkPWIuY2FuY2VsQW5pbWF0aW9uRnJhbWV8fGIud2Via2l0Q2FuY2VsQW5pbWF0aW9uRnJhbWV8fGIubW96Q2FuY2VsQW5pbWF0aW9uRnJhbWV8fGIud2Via2l0Q2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lLGU9ISFjLGc9ZT9mdW5jdGlvbihhKXt2YXIgYj1jKGEpO3JldHVybiBmdW5jdGlvbigpe2QoYil9fTpmdW5jdGlvbihiKXt2YXIgYz1cbmEoYiwxNi42NiwhMSk7cmV0dXJuIGZ1bmN0aW9uKCl7YS5jYW5jZWwoYyl9fTtnLnN1cHBvcnRlZD1lO3JldHVybiBnfV19ZnVuY3Rpb24gWWQoKXt2YXIgYj0xMCxhPXQoXCIkcm9vdFNjb3BlXCIpLGM9bnVsbDt0aGlzLmRpZ2VzdFR0bD1mdW5jdGlvbihhKXthcmd1bWVudHMubGVuZ3RoJiYoYj1hKTtyZXR1cm4gYn07dGhpcy4kZ2V0PVtcIiRpbmplY3RvclwiLFwiJGV4Y2VwdGlvbkhhbmRsZXJcIixcIiRwYXJzZVwiLFwiJGJyb3dzZXJcIixmdW5jdGlvbihkLGUsZyxmKXtmdW5jdGlvbiBrKCl7dGhpcy4kaWQ9ZWIoKTt0aGlzLiQkcGhhc2U9dGhpcy4kcGFyZW50PXRoaXMuJCR3YXRjaGVycz10aGlzLiQkbmV4dFNpYmxpbmc9dGhpcy4kJHByZXZTaWJsaW5nPXRoaXMuJCRjaGlsZEhlYWQ9dGhpcy4kJGNoaWxkVGFpbD1udWxsO3RoaXNbXCJ0aGlzXCJdPXRoaXMuJHJvb3Q9dGhpczt0aGlzLiQkZGVzdHJveWVkPSExO3RoaXMuJCRhc3luY1F1ZXVlPVtdO3RoaXMuJCRwb3N0RGlnZXN0UXVldWU9W107XG50aGlzLiQkbGlzdGVuZXJzPXt9O3RoaXMuJCRsaXN0ZW5lckNvdW50PXt9O3RoaXMuJCRpc29sYXRlQmluZGluZ3M9e319ZnVuY3Rpb24gbShiKXtpZihwLiQkcGhhc2UpdGhyb3cgYShcImlucHJvZ1wiLHAuJCRwaGFzZSk7cC4kJHBoYXNlPWJ9ZnVuY3Rpb24gaChhLGIpe3ZhciBjPWcoYSk7VGEoYyxiKTtyZXR1cm4gY31mdW5jdGlvbiBsKGEsYixjKXtkbyBhLiQkbGlzdGVuZXJDb3VudFtjXS09YiwwPT09YS4kJGxpc3RlbmVyQ291bnRbY10mJmRlbGV0ZSBhLiQkbGlzdGVuZXJDb3VudFtjXTt3aGlsZShhPWEuJHBhcmVudCl9ZnVuY3Rpb24gbigpe31rLnByb3RvdHlwZT17Y29uc3RydWN0b3I6aywkbmV3OmZ1bmN0aW9uKGEpe2E/KGE9bmV3IGssYS4kcm9vdD10aGlzLiRyb290LGEuJCRhc3luY1F1ZXVlPXRoaXMuJCRhc3luY1F1ZXVlLGEuJCRwb3N0RGlnZXN0UXVldWU9dGhpcy4kJHBvc3REaWdlc3RRdWV1ZSk6KHRoaXMuJCRjaGlsZFNjb3BlQ2xhc3N8fCh0aGlzLiQkY2hpbGRTY29wZUNsYXNzPVxuZnVuY3Rpb24oKXt0aGlzLiQkd2F0Y2hlcnM9dGhpcy4kJG5leHRTaWJsaW5nPXRoaXMuJCRjaGlsZEhlYWQ9dGhpcy4kJGNoaWxkVGFpbD1udWxsO3RoaXMuJCRsaXN0ZW5lcnM9e307dGhpcy4kJGxpc3RlbmVyQ291bnQ9e307dGhpcy4kaWQ9ZWIoKTt0aGlzLiQkY2hpbGRTY29wZUNsYXNzPW51bGx9LHRoaXMuJCRjaGlsZFNjb3BlQ2xhc3MucHJvdG90eXBlPXRoaXMpLGE9bmV3IHRoaXMuJCRjaGlsZFNjb3BlQ2xhc3MpO2FbXCJ0aGlzXCJdPWE7YS4kcGFyZW50PXRoaXM7YS4kJHByZXZTaWJsaW5nPXRoaXMuJCRjaGlsZFRhaWw7dGhpcy4kJGNoaWxkSGVhZD90aGlzLiQkY2hpbGRUYWlsPXRoaXMuJCRjaGlsZFRhaWwuJCRuZXh0U2libGluZz1hOnRoaXMuJCRjaGlsZEhlYWQ9dGhpcy4kJGNoaWxkVGFpbD1hO3JldHVybiBhfSwkd2F0Y2g6ZnVuY3Rpb24oYSxiLGQpe3ZhciBlPWgoYSxcIndhdGNoXCIpLGc9dGhpcy4kJHdhdGNoZXJzLGY9e2ZuOmIsbGFzdDpuLGdldDplLGV4cDphLFxuZXE6ISFkfTtjPW51bGw7aWYoIVEoYikpe3ZhciBrPWgoYnx8eSxcImxpc3RlbmVyXCIpO2YuZm49ZnVuY3Rpb24oYSxiLGMpe2soYyl9fWlmKFwic3RyaW5nXCI9PXR5cGVvZiBhJiZlLmNvbnN0YW50KXt2YXIgbT1mLmZuO2YuZm49ZnVuY3Rpb24oYSxiLGMpe20uY2FsbCh0aGlzLGEsYixjKTtQYShnLGYpfX1nfHwoZz10aGlzLiQkd2F0Y2hlcnM9W10pO2cudW5zaGlmdChmKTtyZXR1cm4gZnVuY3Rpb24oKXtQYShnLGYpO2M9bnVsbH19LCR3YXRjaENvbGxlY3Rpb246ZnVuY3Rpb24oYSxiKXt2YXIgYz10aGlzLGQsZSxmLGs9MTxiLmxlbmd0aCxoPTAsbT1nKGEpLGw9W10sbj17fSxwPSEwLHE9MDtyZXR1cm4gdGhpcy4kd2F0Y2goZnVuY3Rpb24oKXtkPW0oYyk7dmFyIGEsYjtpZihVKGQpKWlmKGRiKGQpKWZvcihlIT09bCYmKGU9bCxxPWUubGVuZ3RoPTAsaCsrKSxhPWQubGVuZ3RoLHEhPT1hJiYoaCsrLGUubGVuZ3RoPXE9YSksYj0wO2I8YTtiKyspZVtiXSE9PWVbYl0mJmRbYl0hPT1cbmRbYl18fGVbYl09PT1kW2JdfHwoaCsrLGVbYl09ZFtiXSk7ZWxzZXtlIT09biYmKGU9bj17fSxxPTAsaCsrKTthPTA7Zm9yKGIgaW4gZClkLmhhc093blByb3BlcnR5KGIpJiYoYSsrLGUuaGFzT3duUHJvcGVydHkoYik/ZVtiXSE9PWRbYl0mJihoKyssZVtiXT1kW2JdKToocSsrLGVbYl09ZFtiXSxoKyspKTtpZihxPmEpZm9yKGIgaW4gaCsrLGUpZS5oYXNPd25Qcm9wZXJ0eShiKSYmIWQuaGFzT3duUHJvcGVydHkoYikmJihxLS0sZGVsZXRlIGVbYl0pfWVsc2UgZSE9PWQmJihlPWQsaCsrKTtyZXR1cm4gaH0sZnVuY3Rpb24oKXtwPyhwPSExLGIoZCxkLGMpKTpiKGQsZixjKTtpZihrKWlmKFUoZCkpaWYoZGIoZCkpe2Y9QXJyYXkoZC5sZW5ndGgpO2Zvcih2YXIgYT0wO2E8ZC5sZW5ndGg7YSsrKWZbYV09ZFthXX1lbHNlIGZvcihhIGluIGY9e30sZCl6Yi5jYWxsKGQsYSkmJihmW2FdPWRbYV0pO2Vsc2UgZj1kfSl9LCRkaWdlc3Q6ZnVuY3Rpb24oKXt2YXIgZCxnLGYsayxoPXRoaXMuJCRhc3luY1F1ZXVlLFxubD10aGlzLiQkcG9zdERpZ2VzdFF1ZXVlLHEseixzPWIsUCxOPVtdLHcsRSxBO20oXCIkZGlnZXN0XCIpO2M9bnVsbDtkb3t6PSExO2ZvcihQPXRoaXM7aC5sZW5ndGg7KXt0cnl7QT1oLnNoaWZ0KCksQS5zY29wZS4kZXZhbChBLmV4cHJlc3Npb24pfWNhdGNoKEgpe3AuJCRwaGFzZT1udWxsLGUoSCl9Yz1udWxsfWE6ZG97aWYoaz1QLiQkd2F0Y2hlcnMpZm9yKHE9ay5sZW5ndGg7cS0tOyl0cnl7aWYoZD1rW3FdKWlmKChnPWQuZ2V0KFApKSE9PShmPWQubGFzdCkmJiEoZC5lcT94YShnLGYpOlwibnVtYmVyXCI9PXR5cGVvZiBnJiZcIm51bWJlclwiPT10eXBlb2YgZiYmaXNOYU4oZykmJmlzTmFOKGYpKSl6PSEwLGM9ZCxkLmxhc3Q9ZC5lcT9HYShnLG51bGwpOmcsZC5mbihnLGY9PT1uP2c6ZixQKSw1PnMmJih3PTQtcyxOW3ddfHwoTlt3XT1bXSksRT1RKGQuZXhwKT9cImZuOiBcIisoZC5leHAubmFtZXx8ZC5leHAudG9TdHJpbmcoKSk6ZC5leHAsRSs9XCI7IG5ld1ZhbDogXCIrcmEoZykrXCI7IG9sZFZhbDogXCIrXG5yYShmKSxOW3ddLnB1c2goRSkpO2Vsc2UgaWYoZD09PWMpe3o9ITE7YnJlYWsgYX19Y2F0Y2goQil7cC4kJHBoYXNlPW51bGwsZShCKX1pZighKGs9UC4kJGNoaWxkSGVhZHx8UCE9PXRoaXMmJlAuJCRuZXh0U2libGluZykpZm9yKDtQIT09dGhpcyYmIShrPVAuJCRuZXh0U2libGluZyk7KVA9UC4kcGFyZW50fXdoaWxlKFA9ayk7aWYoKHp8fGgubGVuZ3RoKSYmIXMtLSl0aHJvdyBwLiQkcGhhc2U9bnVsbCxhKFwiaW5mZGlnXCIsYixyYShOKSk7fXdoaWxlKHp8fGgubGVuZ3RoKTtmb3IocC4kJHBoYXNlPW51bGw7bC5sZW5ndGg7KXRyeXtsLnNoaWZ0KCkoKX1jYXRjaCh0KXtlKHQpfX0sJGRlc3Ryb3k6ZnVuY3Rpb24oKXtpZighdGhpcy4kJGRlc3Ryb3llZCl7dmFyIGE9dGhpcy4kcGFyZW50O3RoaXMuJGJyb2FkY2FzdChcIiRkZXN0cm95XCIpO3RoaXMuJCRkZXN0cm95ZWQ9ITA7dGhpcyE9PXAmJihxKHRoaXMuJCRsaXN0ZW5lckNvdW50LEFiKG51bGwsbCx0aGlzKSksYS4kJGNoaWxkSGVhZD09XG50aGlzJiYoYS4kJGNoaWxkSGVhZD10aGlzLiQkbmV4dFNpYmxpbmcpLGEuJCRjaGlsZFRhaWw9PXRoaXMmJihhLiQkY2hpbGRUYWlsPXRoaXMuJCRwcmV2U2libGluZyksdGhpcy4kJHByZXZTaWJsaW5nJiYodGhpcy4kJHByZXZTaWJsaW5nLiQkbmV4dFNpYmxpbmc9dGhpcy4kJG5leHRTaWJsaW5nKSx0aGlzLiQkbmV4dFNpYmxpbmcmJih0aGlzLiQkbmV4dFNpYmxpbmcuJCRwcmV2U2libGluZz10aGlzLiQkcHJldlNpYmxpbmcpLHRoaXMuJHBhcmVudD10aGlzLiQkbmV4dFNpYmxpbmc9dGhpcy4kJHByZXZTaWJsaW5nPXRoaXMuJCRjaGlsZEhlYWQ9dGhpcy4kJGNoaWxkVGFpbD10aGlzLiRyb290PW51bGwsdGhpcy4kJGxpc3RlbmVycz17fSx0aGlzLiQkd2F0Y2hlcnM9dGhpcy4kJGFzeW5jUXVldWU9dGhpcy4kJHBvc3REaWdlc3RRdWV1ZT1bXSx0aGlzLiRkZXN0cm95PXRoaXMuJGRpZ2VzdD10aGlzLiRhcHBseT15LHRoaXMuJG9uPXRoaXMuJHdhdGNoPWZ1bmN0aW9uKCl7cmV0dXJuIHl9KX19LFxuJGV2YWw6ZnVuY3Rpb24oYSxiKXtyZXR1cm4gZyhhKSh0aGlzLGIpfSwkZXZhbEFzeW5jOmZ1bmN0aW9uKGEpe3AuJCRwaGFzZXx8cC4kJGFzeW5jUXVldWUubGVuZ3RofHxmLmRlZmVyKGZ1bmN0aW9uKCl7cC4kJGFzeW5jUXVldWUubGVuZ3RoJiZwLiRkaWdlc3QoKX0pO3RoaXMuJCRhc3luY1F1ZXVlLnB1c2goe3Njb3BlOnRoaXMsZXhwcmVzc2lvbjphfSl9LCQkcG9zdERpZ2VzdDpmdW5jdGlvbihhKXt0aGlzLiQkcG9zdERpZ2VzdFF1ZXVlLnB1c2goYSl9LCRhcHBseTpmdW5jdGlvbihhKXt0cnl7cmV0dXJuIG0oXCIkYXBwbHlcIiksdGhpcy4kZXZhbChhKX1jYXRjaChiKXtlKGIpfWZpbmFsbHl7cC4kJHBoYXNlPW51bGw7dHJ5e3AuJGRpZ2VzdCgpfWNhdGNoKGMpe3Rocm93IGUoYyksYzt9fX0sJG9uOmZ1bmN0aW9uKGEsYil7dmFyIGM9dGhpcy4kJGxpc3RlbmVyc1thXTtjfHwodGhpcy4kJGxpc3RlbmVyc1thXT1jPVtdKTtjLnB1c2goYik7dmFyIGQ9dGhpcztkbyBkLiQkbGlzdGVuZXJDb3VudFthXXx8XG4oZC4kJGxpc3RlbmVyQ291bnRbYV09MCksZC4kJGxpc3RlbmVyQ291bnRbYV0rKzt3aGlsZShkPWQuJHBhcmVudCk7dmFyIGU9dGhpcztyZXR1cm4gZnVuY3Rpb24oKXtjW09hKGMsYildPW51bGw7bChlLDEsYSl9fSwkZW1pdDpmdW5jdGlvbihhLGIpe3ZhciBjPVtdLGQsZz10aGlzLGY9ITEsaz17bmFtZTphLHRhcmdldFNjb3BlOmcsc3RvcFByb3BhZ2F0aW9uOmZ1bmN0aW9uKCl7Zj0hMH0scHJldmVudERlZmF1bHQ6ZnVuY3Rpb24oKXtrLmRlZmF1bHRQcmV2ZW50ZWQ9ITB9LGRlZmF1bHRQcmV2ZW50ZWQ6ITF9LGg9W2tdLmNvbmNhdCh5YS5jYWxsKGFyZ3VtZW50cywxKSksbSxsO2Rve2Q9Zy4kJGxpc3RlbmVyc1thXXx8YztrLmN1cnJlbnRTY29wZT1nO209MDtmb3IobD1kLmxlbmd0aDttPGw7bSsrKWlmKGRbbV0pdHJ5e2RbbV0uYXBwbHkobnVsbCxoKX1jYXRjaChuKXtlKG4pfWVsc2UgZC5zcGxpY2UobSwxKSxtLS0sbC0tO2lmKGYpYnJlYWs7Zz1nLiRwYXJlbnR9d2hpbGUoZyk7XG5yZXR1cm4ga30sJGJyb2FkY2FzdDpmdW5jdGlvbihhLGIpe2Zvcih2YXIgYz10aGlzLGQ9dGhpcyxnPXtuYW1lOmEsdGFyZ2V0U2NvcGU6dGhpcyxwcmV2ZW50RGVmYXVsdDpmdW5jdGlvbigpe2cuZGVmYXVsdFByZXZlbnRlZD0hMH0sZGVmYXVsdFByZXZlbnRlZDohMX0sZj1bZ10uY29uY2F0KHlhLmNhbGwoYXJndW1lbnRzLDEpKSxrLGg7Yz1kOyl7Zy5jdXJyZW50U2NvcGU9YztkPWMuJCRsaXN0ZW5lcnNbYV18fFtdO2s9MDtmb3IoaD1kLmxlbmd0aDtrPGg7aysrKWlmKGRba10pdHJ5e2Rba10uYXBwbHkobnVsbCxmKX1jYXRjaChtKXtlKG0pfWVsc2UgZC5zcGxpY2UoaywxKSxrLS0saC0tO2lmKCEoZD1jLiQkbGlzdGVuZXJDb3VudFthXSYmYy4kJGNoaWxkSGVhZHx8YyE9PXRoaXMmJmMuJCRuZXh0U2libGluZykpZm9yKDtjIT09dGhpcyYmIShkPWMuJCRuZXh0U2libGluZyk7KWM9Yy4kcGFyZW50fXJldHVybiBnfX07dmFyIHA9bmV3IGs7cmV0dXJuIHB9XX1mdW5jdGlvbiBiZCgpe3ZhciBiPVxuL15cXHMqKGh0dHBzP3xmdHB8bWFpbHRvfHRlbHxmaWxlKTovLGE9L15cXHMqKGh0dHBzP3xmdHB8ZmlsZSk6fGRhdGE6aW1hZ2VcXC8vO3RoaXMuYUhyZWZTYW5pdGl6YXRpb25XaGl0ZWxpc3Q9ZnVuY3Rpb24oYSl7cmV0dXJuIEIoYSk/KGI9YSx0aGlzKTpifTt0aGlzLmltZ1NyY1Nhbml0aXphdGlvbldoaXRlbGlzdD1mdW5jdGlvbihiKXtyZXR1cm4gQihiKT8oYT1iLHRoaXMpOmF9O3RoaXMuJGdldD1mdW5jdGlvbigpe3JldHVybiBmdW5jdGlvbihjLGQpe3ZhciBlPWQ/YTpiLGc7aWYoIVN8fDg8PVMpaWYoZz1zYShjKS5ocmVmLFwiXCIhPT1nJiYhZy5tYXRjaChlKSlyZXR1cm5cInVuc2FmZTpcIitnO3JldHVybiBjfX19ZnVuY3Rpb24gQmUoYil7aWYoXCJzZWxmXCI9PT1iKXJldHVybiBiO2lmKEMoYikpe2lmKC0xPGIuaW5kZXhPZihcIioqKlwiKSl0aHJvdyB1YShcIml3Y2FyZFwiLGIpO2I9Yi5yZXBsYWNlKC8oWy0oKVxcW1xcXXt9Kz8qLiRcXF58LDojPCFcXFxcXSkvZyxcIlxcXFwkMVwiKS5yZXBsYWNlKC9cXHgwOC9nLFxuXCJcXFxceDA4XCIpLnJlcGxhY2UoXCJcXFxcKlxcXFwqXCIsXCIuKlwiKS5yZXBsYWNlKFwiXFxcXCpcIixcIlteOi8uPyY7XSpcIik7cmV0dXJuIFJlZ0V4cChcIl5cIitiK1wiJFwiKX1pZihmYihiKSlyZXR1cm4gUmVnRXhwKFwiXlwiK2Iuc291cmNlK1wiJFwiKTt0aHJvdyB1YShcImltYXRjaGVyXCIpO31mdW5jdGlvbiBIYyhiKXt2YXIgYT1bXTtCKGIpJiZxKGIsZnVuY3Rpb24oYil7YS5wdXNoKEJlKGIpKX0pO3JldHVybiBhfWZ1bmN0aW9uIGFlKCl7dGhpcy5TQ0VfQ09OVEVYVFM9ZmE7dmFyIGI9W1wic2VsZlwiXSxhPVtdO3RoaXMucmVzb3VyY2VVcmxXaGl0ZWxpc3Q9ZnVuY3Rpb24oYSl7YXJndW1lbnRzLmxlbmd0aCYmKGI9SGMoYSkpO3JldHVybiBifTt0aGlzLnJlc291cmNlVXJsQmxhY2tsaXN0PWZ1bmN0aW9uKGIpe2FyZ3VtZW50cy5sZW5ndGgmJihhPUhjKGIpKTtyZXR1cm4gYX07dGhpcy4kZ2V0PVtcIiRpbmplY3RvclwiLGZ1bmN0aW9uKGMpe2Z1bmN0aW9uIGQoYSl7dmFyIGI9ZnVuY3Rpb24oYSl7dGhpcy4kJHVud3JhcFRydXN0ZWRWYWx1ZT1cbmZ1bmN0aW9uKCl7cmV0dXJuIGF9fTthJiYoYi5wcm90b3R5cGU9bmV3IGEpO2IucHJvdG90eXBlLnZhbHVlT2Y9ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy4kJHVud3JhcFRydXN0ZWRWYWx1ZSgpfTtiLnByb3RvdHlwZS50b1N0cmluZz1mdW5jdGlvbigpe3JldHVybiB0aGlzLiQkdW53cmFwVHJ1c3RlZFZhbHVlKCkudG9TdHJpbmcoKX07cmV0dXJuIGJ9dmFyIGU9ZnVuY3Rpb24oYSl7dGhyb3cgdWEoXCJ1bnNhZmVcIik7fTtjLmhhcyhcIiRzYW5pdGl6ZVwiKSYmKGU9Yy5nZXQoXCIkc2FuaXRpemVcIikpO3ZhciBnPWQoKSxmPXt9O2ZbZmEuSFRNTF09ZChnKTtmW2ZhLkNTU109ZChnKTtmW2ZhLlVSTF09ZChnKTtmW2ZhLkpTXT1kKGcpO2ZbZmEuUkVTT1VSQ0VfVVJMXT1kKGZbZmEuVVJMXSk7cmV0dXJue3RydXN0QXM6ZnVuY3Rpb24oYSxiKXt2YXIgYz1mLmhhc093blByb3BlcnR5KGEpP2ZbYV06bnVsbDtpZighYyl0aHJvdyB1YShcImljb250ZXh0XCIsYSxiKTtpZihudWxsPT09Ynx8Yj09PVxuc3x8XCJcIj09PWIpcmV0dXJuIGI7aWYoXCJzdHJpbmdcIiE9PXR5cGVvZiBiKXRocm93IHVhKFwiaXR5cGVcIixhKTtyZXR1cm4gbmV3IGMoYil9LGdldFRydXN0ZWQ6ZnVuY3Rpb24oYyxkKXtpZihudWxsPT09ZHx8ZD09PXN8fFwiXCI9PT1kKXJldHVybiBkO3ZhciBnPWYuaGFzT3duUHJvcGVydHkoYyk/ZltjXTpudWxsO2lmKGcmJmQgaW5zdGFuY2VvZiBnKXJldHVybiBkLiQkdW53cmFwVHJ1c3RlZFZhbHVlKCk7aWYoYz09PWZhLlJFU09VUkNFX1VSTCl7dmFyIGc9c2EoZC50b1N0cmluZygpKSxsLG4scD0hMTtsPTA7Zm9yKG49Yi5sZW5ndGg7bDxuO2wrKylpZihcInNlbGZcIj09PWJbbF0/TWIoZyk6YltsXS5leGVjKGcuaHJlZikpe3A9ITA7YnJlYWt9aWYocClmb3IobD0wLG49YS5sZW5ndGg7bDxuO2wrKylpZihcInNlbGZcIj09PWFbbF0/TWIoZyk6YVtsXS5leGVjKGcuaHJlZikpe3A9ITE7YnJlYWt9aWYocClyZXR1cm4gZDt0aHJvdyB1YShcImluc2VjdXJsXCIsZC50b1N0cmluZygpKTt9aWYoYz09PVxuZmEuSFRNTClyZXR1cm4gZShkKTt0aHJvdyB1YShcInVuc2FmZVwiKTt9LHZhbHVlT2Y6ZnVuY3Rpb24oYSl7cmV0dXJuIGEgaW5zdGFuY2VvZiBnP2EuJCR1bndyYXBUcnVzdGVkVmFsdWUoKTphfX19XX1mdW5jdGlvbiAkZCgpe3ZhciBiPSEwO3RoaXMuZW5hYmxlZD1mdW5jdGlvbihhKXthcmd1bWVudHMubGVuZ3RoJiYoYj0hIWEpO3JldHVybiBifTt0aGlzLiRnZXQ9W1wiJHBhcnNlXCIsXCIkc25pZmZlclwiLFwiJHNjZURlbGVnYXRlXCIsZnVuY3Rpb24oYSxjLGQpe2lmKGImJmMubXNpZSYmOD5jLm1zaWVEb2N1bWVudE1vZGUpdGhyb3cgdWEoXCJpZXF1aXJrc1wiKTt2YXIgZT1rYShmYSk7ZS5pc0VuYWJsZWQ9ZnVuY3Rpb24oKXtyZXR1cm4gYn07ZS50cnVzdEFzPWQudHJ1c3RBcztlLmdldFRydXN0ZWQ9ZC5nZXRUcnVzdGVkO2UudmFsdWVPZj1kLnZhbHVlT2Y7Ynx8KGUudHJ1c3RBcz1lLmdldFRydXN0ZWQ9ZnVuY3Rpb24oYSxiKXtyZXR1cm4gYn0sZS52YWx1ZU9mPUZhKTtlLnBhcnNlQXM9XG5mdW5jdGlvbihiLGMpe3ZhciBkPWEoYyk7cmV0dXJuIGQubGl0ZXJhbCYmZC5jb25zdGFudD9kOmZ1bmN0aW9uKGEsYyl7cmV0dXJuIGUuZ2V0VHJ1c3RlZChiLGQoYSxjKSl9fTt2YXIgZz1lLnBhcnNlQXMsZj1lLmdldFRydXN0ZWQsaz1lLnRydXN0QXM7cShmYSxmdW5jdGlvbihhLGIpe3ZhciBjPUwoYik7ZVtWYShcInBhcnNlX2FzX1wiK2MpXT1mdW5jdGlvbihiKXtyZXR1cm4gZyhhLGIpfTtlW1ZhKFwiZ2V0X3RydXN0ZWRfXCIrYyldPWZ1bmN0aW9uKGIpe3JldHVybiBmKGEsYil9O2VbVmEoXCJ0cnVzdF9hc19cIitjKV09ZnVuY3Rpb24oYil7cmV0dXJuIGsoYSxiKX19KTtyZXR1cm4gZX1dfWZ1bmN0aW9uIGJlKCl7dGhpcy4kZ2V0PVtcIiR3aW5kb3dcIixcIiRkb2N1bWVudFwiLGZ1bmN0aW9uKGIsYSl7dmFyIGM9e30sZD1aKCgvYW5kcm9pZCAoXFxkKykvLmV4ZWMoTCgoYi5uYXZpZ2F0b3J8fHt9KS51c2VyQWdlbnQpKXx8W10pWzFdKSxlPS9Cb3hlZS9pLnRlc3QoKGIubmF2aWdhdG9yfHxcbnt9KS51c2VyQWdlbnQpLGc9YVswXXx8e30sZj1nLmRvY3VtZW50TW9kZSxrLG09L14oTW96fHdlYmtpdHxPfG1zKSg/PVtBLVpdKS8saD1nLmJvZHkmJmcuYm9keS5zdHlsZSxsPSExLG49ITE7aWYoaCl7Zm9yKHZhciBwIGluIGgpaWYobD1tLmV4ZWMocCkpe2s9bFswXTtrPWsuc3Vic3RyKDAsMSkudG9VcHBlckNhc2UoKStrLnN1YnN0cigxKTticmVha31rfHwoaz1cIldlYmtpdE9wYWNpdHlcImluIGgmJlwid2Via2l0XCIpO2w9ISEoXCJ0cmFuc2l0aW9uXCJpbiBofHxrK1wiVHJhbnNpdGlvblwiaW4gaCk7bj0hIShcImFuaW1hdGlvblwiaW4gaHx8aytcIkFuaW1hdGlvblwiaW4gaCk7IWR8fGwmJm58fChsPUMoZy5ib2R5LnN0eWxlLndlYmtpdFRyYW5zaXRpb24pLG49QyhnLmJvZHkuc3R5bGUud2Via2l0QW5pbWF0aW9uKSl9cmV0dXJue2hpc3Rvcnk6ISghYi5oaXN0b3J5fHwhYi5oaXN0b3J5LnB1c2hTdGF0ZXx8ND5kfHxlKSxoYXNoY2hhbmdlOlwib25oYXNoY2hhbmdlXCJpbiBiJiYoIWZ8fDc8XG5mKSxoYXNFdmVudDpmdW5jdGlvbihhKXtpZihcImlucHV0XCI9PWEmJjk9PVMpcmV0dXJuITE7aWYoRChjW2FdKSl7dmFyIGI9Zy5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO2NbYV09XCJvblwiK2EgaW4gYn1yZXR1cm4gY1thXX0sY3NwOiRiKCksdmVuZG9yUHJlZml4OmssdHJhbnNpdGlvbnM6bCxhbmltYXRpb25zOm4sYW5kcm9pZDpkLG1zaWU6Uyxtc2llRG9jdW1lbnRNb2RlOmZ9fV19ZnVuY3Rpb24gZGUoKXt0aGlzLiRnZXQ9W1wiJHJvb3RTY29wZVwiLFwiJGJyb3dzZXJcIixcIiRxXCIsXCIkZXhjZXB0aW9uSGFuZGxlclwiLGZ1bmN0aW9uKGIsYSxjLGQpe2Z1bmN0aW9uIGUoZSxrLG0pe3ZhciBoPWMuZGVmZXIoKSxsPWgucHJvbWlzZSxuPUIobSkmJiFtO2s9YS5kZWZlcihmdW5jdGlvbigpe3RyeXtoLnJlc29sdmUoZSgpKX1jYXRjaChhKXtoLnJlamVjdChhKSxkKGEpfWZpbmFsbHl7ZGVsZXRlIGdbbC4kJHRpbWVvdXRJZF19bnx8Yi4kYXBwbHkoKX0sayk7bC4kJHRpbWVvdXRJZD1rO2dba109aDtcbnJldHVybiBsfXZhciBnPXt9O2UuY2FuY2VsPWZ1bmN0aW9uKGIpe3JldHVybiBiJiZiLiQkdGltZW91dElkIGluIGc/KGdbYi4kJHRpbWVvdXRJZF0ucmVqZWN0KFwiY2FuY2VsZWRcIiksZGVsZXRlIGdbYi4kJHRpbWVvdXRJZF0sYS5kZWZlci5jYW5jZWwoYi4kJHRpbWVvdXRJZCkpOiExfTtyZXR1cm4gZX1dfWZ1bmN0aW9uIHNhKGIsYSl7dmFyIGM9YjtTJiYoVy5zZXRBdHRyaWJ1dGUoXCJocmVmXCIsYyksYz1XLmhyZWYpO1cuc2V0QXR0cmlidXRlKFwiaHJlZlwiLGMpO3JldHVybntocmVmOlcuaHJlZixwcm90b2NvbDpXLnByb3RvY29sP1cucHJvdG9jb2wucmVwbGFjZSgvOiQvLFwiXCIpOlwiXCIsaG9zdDpXLmhvc3Qsc2VhcmNoOlcuc2VhcmNoP1cuc2VhcmNoLnJlcGxhY2UoL15cXD8vLFwiXCIpOlwiXCIsaGFzaDpXLmhhc2g/Vy5oYXNoLnJlcGxhY2UoL14jLyxcIlwiKTpcIlwiLGhvc3RuYW1lOlcuaG9zdG5hbWUscG9ydDpXLnBvcnQscGF0aG5hbWU6XCIvXCI9PT1XLnBhdGhuYW1lLmNoYXJBdCgwKT9XLnBhdGhuYW1lOlxuXCIvXCIrVy5wYXRobmFtZX19ZnVuY3Rpb24gTWIoYil7Yj1DKGIpP3NhKGIpOmI7cmV0dXJuIGIucHJvdG9jb2w9PT1JYy5wcm90b2NvbCYmYi5ob3N0PT09SWMuaG9zdH1mdW5jdGlvbiBlZSgpe3RoaXMuJGdldD0kKFQpfWZ1bmN0aW9uIGtjKGIpe2Z1bmN0aW9uIGEoZCxlKXtpZihVKGQpKXt2YXIgZz17fTtxKGQsZnVuY3Rpb24oYixjKXtnW2NdPWEoYyxiKX0pO3JldHVybiBnfXJldHVybiBiLmZhY3RvcnkoZCtjLGUpfXZhciBjPVwiRmlsdGVyXCI7dGhpcy5yZWdpc3Rlcj1hO3RoaXMuJGdldD1bXCIkaW5qZWN0b3JcIixmdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oYil7cmV0dXJuIGEuZ2V0KGIrYyl9fV07YShcImN1cnJlbmN5XCIsSmMpO2EoXCJkYXRlXCIsS2MpO2EoXCJmaWx0ZXJcIixDZSk7YShcImpzb25cIixEZSk7YShcImxpbWl0VG9cIixFZSk7YShcImxvd2VyY2FzZVwiLEZlKTthKFwibnVtYmVyXCIsTGMpO2EoXCJvcmRlckJ5XCIsTWMpO2EoXCJ1cHBlcmNhc2VcIixHZSl9ZnVuY3Rpb24gQ2UoKXtyZXR1cm4gZnVuY3Rpb24oYixcbmEsYyl7aWYoIU8oYikpcmV0dXJuIGI7dmFyIGQ9dHlwZW9mIGMsZT1bXTtlLmNoZWNrPWZ1bmN0aW9uKGEpe2Zvcih2YXIgYj0wO2I8ZS5sZW5ndGg7YisrKWlmKCFlW2JdKGEpKXJldHVybiExO3JldHVybiEwfTtcImZ1bmN0aW9uXCIhPT1kJiYoYz1cImJvb2xlYW5cIj09PWQmJmM/ZnVuY3Rpb24oYSxiKXtyZXR1cm4gU2EuZXF1YWxzKGEsYil9OmZ1bmN0aW9uKGEsYil7aWYoYSYmYiYmXCJvYmplY3RcIj09PXR5cGVvZiBhJiZcIm9iamVjdFwiPT09dHlwZW9mIGIpe2Zvcih2YXIgZCBpbiBhKWlmKFwiJFwiIT09ZC5jaGFyQXQoMCkmJnpiLmNhbGwoYSxkKSYmYyhhW2RdLGJbZF0pKXJldHVybiEwO3JldHVybiExfWI9KFwiXCIrYikudG9Mb3dlckNhc2UoKTtyZXR1cm4tMTwoXCJcIithKS50b0xvd2VyQ2FzZSgpLmluZGV4T2YoYil9KTt2YXIgZz1mdW5jdGlvbihhLGIpe2lmKFwic3RyaW5nXCI9PXR5cGVvZiBiJiZcIiFcIj09PWIuY2hhckF0KDApKXJldHVybiFnKGEsYi5zdWJzdHIoMSkpO3N3aXRjaCh0eXBlb2YgYSl7Y2FzZSBcImJvb2xlYW5cIjpjYXNlIFwibnVtYmVyXCI6Y2FzZSBcInN0cmluZ1wiOnJldHVybiBjKGEsXG5iKTtjYXNlIFwib2JqZWN0XCI6c3dpdGNoKHR5cGVvZiBiKXtjYXNlIFwib2JqZWN0XCI6cmV0dXJuIGMoYSxiKTtkZWZhdWx0OmZvcih2YXIgZCBpbiBhKWlmKFwiJFwiIT09ZC5jaGFyQXQoMCkmJmcoYVtkXSxiKSlyZXR1cm4hMH1yZXR1cm4hMTtjYXNlIFwiYXJyYXlcIjpmb3IoZD0wO2Q8YS5sZW5ndGg7ZCsrKWlmKGcoYVtkXSxiKSlyZXR1cm4hMDtyZXR1cm4hMTtkZWZhdWx0OnJldHVybiExfX07c3dpdGNoKHR5cGVvZiBhKXtjYXNlIFwiYm9vbGVhblwiOmNhc2UgXCJudW1iZXJcIjpjYXNlIFwic3RyaW5nXCI6YT17JDphfTtjYXNlIFwib2JqZWN0XCI6Zm9yKHZhciBmIGluIGEpKGZ1bmN0aW9uKGIpe1widW5kZWZpbmVkXCIhPXR5cGVvZiBhW2JdJiZlLnB1c2goZnVuY3Rpb24oYyl7cmV0dXJuIGcoXCIkXCI9PWI/YzpjJiZjW2JdLGFbYl0pfSl9KShmKTticmVhaztjYXNlIFwiZnVuY3Rpb25cIjplLnB1c2goYSk7YnJlYWs7ZGVmYXVsdDpyZXR1cm4gYn1kPVtdO2ZvcihmPTA7ZjxiLmxlbmd0aDtmKyspe3ZhciBrPVxuYltmXTtlLmNoZWNrKGspJiZkLnB1c2goayl9cmV0dXJuIGR9fWZ1bmN0aW9uIEpjKGIpe3ZhciBhPWIuTlVNQkVSX0ZPUk1BVFM7cmV0dXJuIGZ1bmN0aW9uKGIsZCl7RChkKSYmKGQ9YS5DVVJSRU5DWV9TWU0pO3JldHVybiBOYyhiLGEuUEFUVEVSTlNbMV0sYS5HUk9VUF9TRVAsYS5ERUNJTUFMX1NFUCwyKS5yZXBsYWNlKC9cXHUwMEE0L2csZCl9fWZ1bmN0aW9uIExjKGIpe3ZhciBhPWIuTlVNQkVSX0ZPUk1BVFM7cmV0dXJuIGZ1bmN0aW9uKGIsZCl7cmV0dXJuIE5jKGIsYS5QQVRURVJOU1swXSxhLkdST1VQX1NFUCxhLkRFQ0lNQUxfU0VQLGQpfX1mdW5jdGlvbiBOYyhiLGEsYyxkLGUpe2lmKG51bGw9PWJ8fCFpc0Zpbml0ZShiKXx8VShiKSlyZXR1cm5cIlwiO3ZhciBnPTA+YjtiPU1hdGguYWJzKGIpO3ZhciBmPWIrXCJcIixrPVwiXCIsbT1bXSxoPSExO2lmKC0xIT09Zi5pbmRleE9mKFwiZVwiKSl7dmFyIGw9Zi5tYXRjaCgvKFtcXGRcXC5dKyllKC0/KShcXGQrKS8pO2wmJlwiLVwiPT1sWzJdJiZcbmxbM10+ZSsxP2Y9XCIwXCI6KGs9ZixoPSEwKX1pZihoKTA8ZSYmKC0xPGImJjE+YikmJihrPWIudG9GaXhlZChlKSk7ZWxzZXtmPShmLnNwbGl0KE9jKVsxXXx8XCJcIikubGVuZ3RoO0QoZSkmJihlPU1hdGgubWluKE1hdGgubWF4KGEubWluRnJhYyxmKSxhLm1heEZyYWMpKTtmPU1hdGgucG93KDEwLGUrMSk7Yj1NYXRoLmZsb29yKGIqZis1KS9mO2I9KFwiXCIrYikuc3BsaXQoT2MpO2Y9YlswXTtiPWJbMV18fFwiXCI7dmFyIGw9MCxuPWEubGdTaXplLHA9YS5nU2l6ZTtpZihmLmxlbmd0aD49bitwKWZvcihsPWYubGVuZ3RoLW4saD0wO2g8bDtoKyspMD09PShsLWgpJXAmJjAhPT1oJiYoays9Yyksays9Zi5jaGFyQXQoaCk7Zm9yKGg9bDtoPGYubGVuZ3RoO2grKykwPT09KGYubGVuZ3RoLWgpJW4mJjAhPT1oJiYoays9Yyksays9Zi5jaGFyQXQoaCk7Zm9yKDtiLmxlbmd0aDxlOyliKz1cIjBcIjtlJiZcIjBcIiE9PWUmJihrKz1kK2Iuc3Vic3RyKDAsZSkpfW0ucHVzaChnP2EubmVnUHJlOmEucG9zUHJlKTtcbm0ucHVzaChrKTttLnB1c2goZz9hLm5lZ1N1ZjphLnBvc1N1Zik7cmV0dXJuIG0uam9pbihcIlwiKX1mdW5jdGlvbiBVYihiLGEsYyl7dmFyIGQ9XCJcIjswPmImJihkPVwiLVwiLGI9LWIpO2ZvcihiPVwiXCIrYjtiLmxlbmd0aDxhOyliPVwiMFwiK2I7YyYmKGI9Yi5zdWJzdHIoYi5sZW5ndGgtYSkpO3JldHVybiBkK2J9ZnVuY3Rpb24gWShiLGEsYyxkKXtjPWN8fDA7cmV0dXJuIGZ1bmN0aW9uKGUpe2U9ZVtcImdldFwiK2JdKCk7aWYoMDxjfHxlPi1jKWUrPWM7MD09PWUmJi0xMj09YyYmKGU9MTIpO3JldHVybiBVYihlLGEsZCl9fWZ1bmN0aW9uIHNiKGIsYSl7cmV0dXJuIGZ1bmN0aW9uKGMsZCl7dmFyIGU9Y1tcImdldFwiK2JdKCksZz1IYShhP1wiU0hPUlRcIitiOmIpO3JldHVybiBkW2ddW2VdfX1mdW5jdGlvbiBLYyhiKXtmdW5jdGlvbiBhKGEpe3ZhciBiO2lmKGI9YS5tYXRjaChjKSl7YT1uZXcgRGF0ZSgwKTt2YXIgZz0wLGY9MCxrPWJbOF0/YS5zZXRVVENGdWxsWWVhcjphLnNldEZ1bGxZZWFyLG09XG5iWzhdP2Euc2V0VVRDSG91cnM6YS5zZXRIb3VycztiWzldJiYoZz1aKGJbOV0rYlsxMF0pLGY9WihiWzldK2JbMTFdKSk7ay5jYWxsKGEsWihiWzFdKSxaKGJbMl0pLTEsWihiWzNdKSk7Zz1aKGJbNF18fDApLWc7Zj1aKGJbNV18fDApLWY7az1aKGJbNl18fDApO2I9TWF0aC5yb3VuZCgxRTMqcGFyc2VGbG9hdChcIjAuXCIrKGJbN118fDApKSk7bS5jYWxsKGEsZyxmLGssYil9cmV0dXJuIGF9dmFyIGM9L14oXFxkezR9KS0/KFxcZFxcZCktPyhcXGRcXGQpKD86VChcXGRcXGQpKD86Oj8oXFxkXFxkKSg/Ojo/KFxcZFxcZCkoPzpcXC4oXFxkKykpPyk/KT8oWnwoWystXSkoXFxkXFxkKTo/KFxcZFxcZCkpPyk/JC87cmV0dXJuIGZ1bmN0aW9uKGMsZSl7dmFyIGc9XCJcIixmPVtdLGssbTtlPWV8fFwibWVkaXVtRGF0ZVwiO2U9Yi5EQVRFVElNRV9GT1JNQVRTW2VdfHxlO0MoYykmJihjPUhlLnRlc3QoYyk/WihjKTphKGMpKTt5YihjKSYmKGM9bmV3IERhdGUoYykpO2lmKCFOYShjKSlyZXR1cm4gYztmb3IoO2U7KShtPUllLmV4ZWMoZSkpP1xuKGY9Zi5jb25jYXQoeWEuY2FsbChtLDEpKSxlPWYucG9wKCkpOihmLnB1c2goZSksZT1udWxsKTtxKGYsZnVuY3Rpb24oYSl7az1KZVthXTtnKz1rP2soYyxiLkRBVEVUSU1FX0ZPUk1BVFMpOmEucmVwbGFjZSgvKF4nfCckKS9nLFwiXCIpLnJlcGxhY2UoLycnL2csXCInXCIpfSk7cmV0dXJuIGd9fWZ1bmN0aW9uIERlKCl7cmV0dXJuIGZ1bmN0aW9uKGIpe3JldHVybiByYShiLCEwKX19ZnVuY3Rpb24gRWUoKXtyZXR1cm4gZnVuY3Rpb24oYixhKXtpZighTyhiKSYmIUMoYikpcmV0dXJuIGI7YT1JbmZpbml0eT09PU1hdGguYWJzKE51bWJlcihhKSk/TnVtYmVyKGEpOlooYSk7aWYoQyhiKSlyZXR1cm4gYT8wPD1hP2Iuc2xpY2UoMCxhKTpiLnNsaWNlKGEsYi5sZW5ndGgpOlwiXCI7dmFyIGM9W10sZCxlO2E+Yi5sZW5ndGg/YT1iLmxlbmd0aDphPC1iLmxlbmd0aCYmKGE9LWIubGVuZ3RoKTswPGE/KGQ9MCxlPWEpOihkPWIubGVuZ3RoK2EsZT1iLmxlbmd0aCk7Zm9yKDtkPGU7ZCsrKWMucHVzaChiW2RdKTtcbnJldHVybiBjfX1mdW5jdGlvbiBNYyhiKXtyZXR1cm4gZnVuY3Rpb24oYSxjLGQpe2Z1bmN0aW9uIGUoYSxiKXtyZXR1cm4gUmEoYik/ZnVuY3Rpb24oYixjKXtyZXR1cm4gYShjLGIpfTphfWZ1bmN0aW9uIGcoYSxiKXt2YXIgYz10eXBlb2YgYSxkPXR5cGVvZiBiO3JldHVybiBjPT1kPyhcInN0cmluZ1wiPT1jJiYoYT1hLnRvTG93ZXJDYXNlKCksYj1iLnRvTG93ZXJDYXNlKCkpLGE9PT1iPzA6YTxiPy0xOjEpOmM8ZD8tMToxfWlmKCFPKGEpfHwhYylyZXR1cm4gYTtjPU8oYyk/YzpbY107Yz1VYyhjLGZ1bmN0aW9uKGEpe3ZhciBjPSExLGQ9YXx8RmE7aWYoQyhhKSl7aWYoXCIrXCI9PWEuY2hhckF0KDApfHxcIi1cIj09YS5jaGFyQXQoMCkpYz1cIi1cIj09YS5jaGFyQXQoMCksYT1hLnN1YnN0cmluZygxKTtkPWIoYSk7aWYoZC5jb25zdGFudCl7dmFyIGY9ZCgpO3JldHVybiBlKGZ1bmN0aW9uKGEsYil7cmV0dXJuIGcoYVtmXSxiW2ZdKX0sYyl9fXJldHVybiBlKGZ1bmN0aW9uKGEsYil7cmV0dXJuIGcoZChhKSxcbmQoYikpfSxjKX0pO2Zvcih2YXIgZj1bXSxrPTA7azxhLmxlbmd0aDtrKyspZi5wdXNoKGFba10pO3JldHVybiBmLnNvcnQoZShmdW5jdGlvbihhLGIpe2Zvcih2YXIgZD0wO2Q8Yy5sZW5ndGg7ZCsrKXt2YXIgZT1jW2RdKGEsYik7aWYoMCE9PWUpcmV0dXJuIGV9cmV0dXJuIDB9LGQpKX19ZnVuY3Rpb24gdmEoYil7UShiKSYmKGI9e2xpbms6Yn0pO2IucmVzdHJpY3Q9Yi5yZXN0cmljdHx8XCJBQ1wiO3JldHVybiAkKGIpfWZ1bmN0aW9uIFBjKGIsYSxjLGQpe2Z1bmN0aW9uIGUoYSxjKXtjPWM/XCItXCIraGIoYyxcIi1cIik6XCJcIjtkLnJlbW92ZUNsYXNzKGIsKGE/dGI6dWIpK2MpO2QuYWRkQ2xhc3MoYiwoYT91Yjp0YikrYyl9dmFyIGc9dGhpcyxmPWIucGFyZW50KCkuY29udHJvbGxlcihcImZvcm1cIil8fHZiLGs9MCxtPWcuJGVycm9yPXt9LGg9W107Zy4kbmFtZT1hLm5hbWV8fGEubmdGb3JtO2cuJGRpcnR5PSExO2cuJHByaXN0aW5lPSEwO2cuJHZhbGlkPSEwO2cuJGludmFsaWQ9ITE7Zi4kYWRkQ29udHJvbChnKTtcbmIuYWRkQ2xhc3MoTWEpO2UoITApO2cuJGFkZENvbnRyb2w9ZnVuY3Rpb24oYSl7QWEoYS4kbmFtZSxcImlucHV0XCIpO2gucHVzaChhKTthLiRuYW1lJiYoZ1thLiRuYW1lXT1hKX07Zy4kcmVtb3ZlQ29udHJvbD1mdW5jdGlvbihhKXthLiRuYW1lJiZnW2EuJG5hbWVdPT09YSYmZGVsZXRlIGdbYS4kbmFtZV07cShtLGZ1bmN0aW9uKGIsYyl7Zy4kc2V0VmFsaWRpdHkoYywhMCxhKX0pO1BhKGgsYSl9O2cuJHNldFZhbGlkaXR5PWZ1bmN0aW9uKGEsYixjKXt2YXIgZD1tW2FdO2lmKGIpZCYmKFBhKGQsYyksZC5sZW5ndGh8fChrLS0sa3x8KGUoYiksZy4kdmFsaWQ9ITAsZy4kaW52YWxpZD0hMSksbVthXT0hMSxlKCEwLGEpLGYuJHNldFZhbGlkaXR5KGEsITAsZykpKTtlbHNle2t8fGUoYik7aWYoZCl7aWYoLTEhPU9hKGQsYykpcmV0dXJufWVsc2UgbVthXT1kPVtdLGsrKyxlKCExLGEpLGYuJHNldFZhbGlkaXR5KGEsITEsZyk7ZC5wdXNoKGMpO2cuJHZhbGlkPSExO2cuJGludmFsaWQ9XG4hMH19O2cuJHNldERpcnR5PWZ1bmN0aW9uKCl7ZC5yZW1vdmVDbGFzcyhiLE1hKTtkLmFkZENsYXNzKGIsd2IpO2cuJGRpcnR5PSEwO2cuJHByaXN0aW5lPSExO2YuJHNldERpcnR5KCl9O2cuJHNldFByaXN0aW5lPWZ1bmN0aW9uKCl7ZC5yZW1vdmVDbGFzcyhiLHdiKTtkLmFkZENsYXNzKGIsTWEpO2cuJGRpcnR5PSExO2cuJHByaXN0aW5lPSEwO3EoaCxmdW5jdGlvbihhKXthLiRzZXRQcmlzdGluZSgpfSl9fWZ1bmN0aW9uIHFhKGIsYSxjLGQpe2IuJHNldFZhbGlkaXR5KGEsYyk7cmV0dXJuIGM/ZDpzfWZ1bmN0aW9uIEtlKGIsYSxjKXt2YXIgZD1jLnByb3AoXCJ2YWxpZGl0eVwiKTtVKGQpJiZiLiRwYXJzZXJzLnB1c2goZnVuY3Rpb24oYyl7aWYoYi4kZXJyb3JbYV18fCEoZC5iYWRJbnB1dHx8ZC5jdXN0b21FcnJvcnx8ZC50eXBlTWlzbWF0Y2gpfHxkLnZhbHVlTWlzc2luZylyZXR1cm4gYztiLiRzZXRWYWxpZGl0eShhLCExKX0pfWZ1bmN0aW9uIHhiKGIsYSxjLGQsZSxnKXt2YXIgZj1cbmEucHJvcChcInZhbGlkaXR5XCIpLGs9YVswXS5wbGFjZWhvbGRlcixtPXt9O2lmKCFlLmFuZHJvaWQpe3ZhciBoPSExO2Eub24oXCJjb21wb3NpdGlvbnN0YXJ0XCIsZnVuY3Rpb24oYSl7aD0hMH0pO2Eub24oXCJjb21wb3NpdGlvbmVuZFwiLGZ1bmN0aW9uKCl7aD0hMTtsKCl9KX12YXIgbD1mdW5jdGlvbihlKXtpZighaCl7dmFyIGc9YS52YWwoKTtpZihTJiZcImlucHV0XCI9PT0oZXx8bSkudHlwZSYmYVswXS5wbGFjZWhvbGRlciE9PWspaz1hWzBdLnBsYWNlaG9sZGVyO2Vsc2UgaWYoUmEoYy5uZ1RyaW18fFwiVFwiKSYmKGc9YWEoZykpLGQuJHZpZXdWYWx1ZSE9PWd8fGYmJlwiXCI9PT1nJiYhZi52YWx1ZU1pc3NpbmcpYi4kJHBoYXNlP2QuJHNldFZpZXdWYWx1ZShnKTpiLiRhcHBseShmdW5jdGlvbigpe2QuJHNldFZpZXdWYWx1ZShnKX0pfX07aWYoZS5oYXNFdmVudChcImlucHV0XCIpKWEub24oXCJpbnB1dFwiLGwpO2Vsc2V7dmFyIG4scD1mdW5jdGlvbigpe258fChuPWcuZGVmZXIoZnVuY3Rpb24oKXtsKCk7XG5uPW51bGx9KSl9O2Eub24oXCJrZXlkb3duXCIsZnVuY3Rpb24oYSl7YT1hLmtleUNvZGU7OTE9PT1hfHwoMTU8YSYmMTk+YXx8Mzc8PWEmJjQwPj1hKXx8cCgpfSk7aWYoZS5oYXNFdmVudChcInBhc3RlXCIpKWEub24oXCJwYXN0ZSBjdXRcIixwKX1hLm9uKFwiY2hhbmdlXCIsbCk7ZC4kcmVuZGVyPWZ1bmN0aW9uKCl7YS52YWwoZC4kaXNFbXB0eShkLiR2aWV3VmFsdWUpP1wiXCI6ZC4kdmlld1ZhbHVlKX07dmFyIHI9Yy5uZ1BhdHRlcm47ciYmKChlPXIubWF0Y2goL15cXC8oLiopXFwvKFtnaW1dKikkLykpPyhyPVJlZ0V4cChlWzFdLGVbMl0pLGU9ZnVuY3Rpb24oYSl7cmV0dXJuIHFhKGQsXCJwYXR0ZXJuXCIsZC4kaXNFbXB0eShhKXx8ci50ZXN0KGEpLGEpfSk6ZT1mdW5jdGlvbihjKXt2YXIgZT1iLiRldmFsKHIpO2lmKCFlfHwhZS50ZXN0KXRocm93IHQoXCJuZ1BhdHRlcm5cIikoXCJub3JlZ2V4cFwiLHIsZSxnYShhKSk7cmV0dXJuIHFhKGQsXCJwYXR0ZXJuXCIsZC4kaXNFbXB0eShjKXx8ZS50ZXN0KGMpLFxuYyl9LGQuJGZvcm1hdHRlcnMucHVzaChlKSxkLiRwYXJzZXJzLnB1c2goZSkpO2lmKGMubmdNaW5sZW5ndGgpe3ZhciB2PVooYy5uZ01pbmxlbmd0aCk7ZT1mdW5jdGlvbihhKXtyZXR1cm4gcWEoZCxcIm1pbmxlbmd0aFwiLGQuJGlzRW1wdHkoYSl8fGEubGVuZ3RoPj12LGEpfTtkLiRwYXJzZXJzLnB1c2goZSk7ZC4kZm9ybWF0dGVycy5wdXNoKGUpfWlmKGMubmdNYXhsZW5ndGgpe3ZhciBxPVooYy5uZ01heGxlbmd0aCk7ZT1mdW5jdGlvbihhKXtyZXR1cm4gcWEoZCxcIm1heGxlbmd0aFwiLGQuJGlzRW1wdHkoYSl8fGEubGVuZ3RoPD1xLGEpfTtkLiRwYXJzZXJzLnB1c2goZSk7ZC4kZm9ybWF0dGVycy5wdXNoKGUpfX1mdW5jdGlvbiBWYihiLGEpe2I9XCJuZ0NsYXNzXCIrYjtyZXR1cm5bXCIkYW5pbWF0ZVwiLGZ1bmN0aW9uKGMpe2Z1bmN0aW9uIGQoYSxiKXt2YXIgYz1bXSxkPTA7YTpmb3IoO2Q8YS5sZW5ndGg7ZCsrKXtmb3IodmFyIGU9YVtkXSxsPTA7bDxiLmxlbmd0aDtsKyspaWYoZT09XG5iW2xdKWNvbnRpbnVlIGE7Yy5wdXNoKGUpfXJldHVybiBjfWZ1bmN0aW9uIGUoYSl7aWYoIU8oYSkpe2lmKEMoYSkpcmV0dXJuIGEuc3BsaXQoXCIgXCIpO2lmKFUoYSkpe3ZhciBiPVtdO3EoYSxmdW5jdGlvbihhLGMpe2EmJihiPWIuY29uY2F0KGMuc3BsaXQoXCIgXCIpKSl9KTtyZXR1cm4gYn19cmV0dXJuIGF9cmV0dXJue3Jlc3RyaWN0OlwiQUNcIixsaW5rOmZ1bmN0aW9uKGcsZixrKXtmdW5jdGlvbiBtKGEsYil7dmFyIGM9Zi5kYXRhKFwiJGNsYXNzQ291bnRzXCIpfHx7fSxkPVtdO3EoYSxmdW5jdGlvbihhKXtpZigwPGJ8fGNbYV0pY1thXT0oY1thXXx8MCkrYixjW2FdPT09KygwPGIpJiZkLnB1c2goYSl9KTtmLmRhdGEoXCIkY2xhc3NDb3VudHNcIixjKTtyZXR1cm4gZC5qb2luKFwiIFwiKX1mdW5jdGlvbiBoKGIpe2lmKCEwPT09YXx8Zy4kaW5kZXglMj09PWEpe3ZhciBoPWUoYnx8W10pO2lmKCFsKXt2YXIgcj1tKGgsMSk7ay4kYWRkQ2xhc3Mocil9ZWxzZSBpZigheGEoYixsKSl7dmFyIHE9XG5lKGwpLHI9ZChoLHEpLGg9ZChxLGgpLGg9bShoLC0xKSxyPW0ociwxKTswPT09ci5sZW5ndGg/Yy5yZW1vdmVDbGFzcyhmLGgpOjA9PT1oLmxlbmd0aD9jLmFkZENsYXNzKGYscik6Yy5zZXRDbGFzcyhmLHIsaCl9fWw9a2EoYil9dmFyIGw7Zy4kd2F0Y2goa1tiXSxoLCEwKTtrLiRvYnNlcnZlKFwiY2xhc3NcIixmdW5jdGlvbihhKXtoKGcuJGV2YWwoa1tiXSkpfSk7XCJuZ0NsYXNzXCIhPT1iJiZnLiR3YXRjaChcIiRpbmRleFwiLGZ1bmN0aW9uKGMsZCl7dmFyIGY9YyYxO2lmKGYhPT0oZCYxKSl7dmFyIGg9ZShnLiRldmFsKGtbYl0pKTtmPT09YT8oZj1tKGgsMSksay4kYWRkQ2xhc3MoZikpOihmPW0oaCwtMSksay4kcmVtb3ZlQ2xhc3MoZikpfX0pfX19XX12YXIgTD1mdW5jdGlvbihiKXtyZXR1cm4gQyhiKT9iLnRvTG93ZXJDYXNlKCk6Yn0semI9T2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eSxIYT1mdW5jdGlvbihiKXtyZXR1cm4gQyhiKT9iLnRvVXBwZXJDYXNlKCk6Yn0sUyxcbncsQmEseWE9W10uc2xpY2UsTGU9W10ucHVzaCx3YT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLFFhPXQoXCJuZ1wiKSxTYT1ULmFuZ3VsYXJ8fChULmFuZ3VsYXI9e30pLFVhLExhLGphPVtcIjBcIixcIjBcIixcIjBcIl07Uz1aKCgvbXNpZSAoXFxkKykvLmV4ZWMoTChuYXZpZ2F0b3IudXNlckFnZW50KSl8fFtdKVsxXSk7aXNOYU4oUykmJihTPVooKC90cmlkZW50XFwvLio7IHJ2OihcXGQrKS8uZXhlYyhMKG5hdmlnYXRvci51c2VyQWdlbnQpKXx8W10pWzFdKSk7eS4kaW5qZWN0PVtdO0ZhLiRpbmplY3Q9W107dmFyIE89ZnVuY3Rpb24oKXtyZXR1cm4gUShBcnJheS5pc0FycmF5KT9BcnJheS5pc0FycmF5OmZ1bmN0aW9uKGIpe3JldHVyblwiW29iamVjdCBBcnJheV1cIj09PXdhLmNhbGwoYil9fSgpLGFhPWZ1bmN0aW9uKCl7cmV0dXJuIFN0cmluZy5wcm90b3R5cGUudHJpbT9mdW5jdGlvbihiKXtyZXR1cm4gQyhiKT9iLnRyaW0oKTpifTpmdW5jdGlvbihiKXtyZXR1cm4gQyhiKT9iLnJlcGxhY2UoL15cXHNcXHMqLyxcblwiXCIpLnJlcGxhY2UoL1xcc1xccyokLyxcIlwiKTpifX0oKTtMYT05PlM/ZnVuY3Rpb24oYil7Yj1iLm5vZGVOYW1lP2I6YlswXTtyZXR1cm4gYi5zY29wZU5hbWUmJlwiSFRNTFwiIT1iLnNjb3BlTmFtZT9IYShiLnNjb3BlTmFtZStcIjpcIitiLm5vZGVOYW1lKTpiLm5vZGVOYW1lfTpmdW5jdGlvbihiKXtyZXR1cm4gYi5ub2RlTmFtZT9iLm5vZGVOYW1lOmJbMF0ubm9kZU5hbWV9O3ZhciBYYz0vW0EtWl0vZywkYz17ZnVsbDpcIjEuMi4xOFwiLG1ham9yOjEsbWlub3I6Mixkb3Q6MTgsY29kZU5hbWU6XCJlYXItZXh0ZW5kYWJpbGl0eVwifSxYYT1SLmNhY2hlPXt9LGliPVIuZXhwYW5kbz1cIm5nXCIrKG5ldyBEYXRlKS5nZXRUaW1lKCksbWU9MSxwYj1ULmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI/ZnVuY3Rpb24oYixhLGMpe2IuYWRkRXZlbnRMaXN0ZW5lcihhLGMsITEpfTpmdW5jdGlvbihiLGEsYyl7Yi5hdHRhY2hFdmVudChcIm9uXCIrYSxjKX0sV2E9VC5kb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyP1xuZnVuY3Rpb24oYixhLGMpe2IucmVtb3ZlRXZlbnRMaXN0ZW5lcihhLGMsITEpfTpmdW5jdGlvbihiLGEsYyl7Yi5kZXRhY2hFdmVudChcIm9uXCIrYSxjKX07Ui5fZGF0YT1mdW5jdGlvbihiKXtyZXR1cm4gdGhpcy5jYWNoZVtiW3RoaXMuZXhwYW5kb11dfHx7fX07dmFyIGhlPS8oW1xcOlxcLVxcX10rKC4pKS9nLGllPS9ebW96KFtBLVpdKS8sR2I9dChcImpxTGl0ZVwiKSxqZT0vXjwoXFx3KylcXHMqXFwvPz4oPzo8XFwvXFwxPnwpJC8sSGI9Lzx8JiM/XFx3KzsvLGtlPS88KFtcXHc6XSspLyxsZT0vPCg/IWFyZWF8YnJ8Y29sfGVtYmVkfGhyfGltZ3xpbnB1dHxsaW5rfG1ldGF8cGFyYW0pKChbXFx3Ol0rKVtePl0qKVxcLz4vZ2ksZGE9e29wdGlvbjpbMSwnPHNlbGVjdCBtdWx0aXBsZT1cIm11bHRpcGxlXCI+JyxcIjwvc2VsZWN0PlwiXSx0aGVhZDpbMSxcIjx0YWJsZT5cIixcIjwvdGFibGU+XCJdLGNvbDpbMixcIjx0YWJsZT48Y29sZ3JvdXA+XCIsXCI8L2NvbGdyb3VwPjwvdGFibGU+XCJdLHRyOlsyLFwiPHRhYmxlPjx0Ym9keT5cIixcblwiPC90Ym9keT48L3RhYmxlPlwiXSx0ZDpbMyxcIjx0YWJsZT48dGJvZHk+PHRyPlwiLFwiPC90cj48L3Rib2R5PjwvdGFibGU+XCJdLF9kZWZhdWx0OlswLFwiXCIsXCJcIl19O2RhLm9wdGdyb3VwPWRhLm9wdGlvbjtkYS50Ym9keT1kYS50Zm9vdD1kYS5jb2xncm91cD1kYS5jYXB0aW9uPWRhLnRoZWFkO2RhLnRoPWRhLnRkO3ZhciBLYT1SLnByb3RvdHlwZT17cmVhZHk6ZnVuY3Rpb24oYil7ZnVuY3Rpb24gYSgpe2N8fChjPSEwLGIoKSl9dmFyIGM9ITE7XCJjb21wbGV0ZVwiPT09Vi5yZWFkeVN0YXRlP3NldFRpbWVvdXQoYSk6KHRoaXMub24oXCJET01Db250ZW50TG9hZGVkXCIsYSksUihUKS5vbihcImxvYWRcIixhKSl9LHRvU3RyaW5nOmZ1bmN0aW9uKCl7dmFyIGI9W107cSh0aGlzLGZ1bmN0aW9uKGEpe2IucHVzaChcIlwiK2EpfSk7cmV0dXJuXCJbXCIrYi5qb2luKFwiLCBcIikrXCJdXCJ9LGVxOmZ1bmN0aW9uKGIpe3JldHVybiAwPD1iP3codGhpc1tiXSk6dyh0aGlzW3RoaXMubGVuZ3RoK2JdKX0sbGVuZ3RoOjAsXG5wdXNoOkxlLHNvcnQ6W10uc29ydCxzcGxpY2U6W10uc3BsaWNlfSxtYj17fTtxKFwibXVsdGlwbGUgc2VsZWN0ZWQgY2hlY2tlZCBkaXNhYmxlZCByZWFkT25seSByZXF1aXJlZCBvcGVuXCIuc3BsaXQoXCIgXCIpLGZ1bmN0aW9uKGIpe21iW0woYildPWJ9KTt2YXIgcmM9e307cShcImlucHV0IHNlbGVjdCBvcHRpb24gdGV4dGFyZWEgYnV0dG9uIGZvcm0gZGV0YWlsc1wiLnNwbGl0KFwiIFwiKSxmdW5jdGlvbihiKXtyY1tIYShiKV09ITB9KTtxKHtkYXRhOm5jLGluaGVyaXRlZERhdGE6bGIsc2NvcGU6ZnVuY3Rpb24oYil7cmV0dXJuIHcoYikuZGF0YShcIiRzY29wZVwiKXx8bGIoYi5wYXJlbnROb2RlfHxiLFtcIiRpc29sYXRlU2NvcGVcIixcIiRzY29wZVwiXSl9LGlzb2xhdGVTY29wZTpmdW5jdGlvbihiKXtyZXR1cm4gdyhiKS5kYXRhKFwiJGlzb2xhdGVTY29wZVwiKXx8dyhiKS5kYXRhKFwiJGlzb2xhdGVTY29wZU5vVGVtcGxhdGVcIil9LGNvbnRyb2xsZXI6b2MsaW5qZWN0b3I6ZnVuY3Rpb24oYil7cmV0dXJuIGxiKGIsXG5cIiRpbmplY3RvclwiKX0scmVtb3ZlQXR0cjpmdW5jdGlvbihiLGEpe2IucmVtb3ZlQXR0cmlidXRlKGEpfSxoYXNDbGFzczpLYixjc3M6ZnVuY3Rpb24oYixhLGMpe2E9VmEoYSk7aWYoQihjKSliLnN0eWxlW2FdPWM7ZWxzZXt2YXIgZDs4Pj1TJiYoZD1iLmN1cnJlbnRTdHlsZSYmYi5jdXJyZW50U3R5bGVbYV0sXCJcIj09PWQmJihkPVwiYXV0b1wiKSk7ZD1kfHxiLnN0eWxlW2FdOzg+PVMmJihkPVwiXCI9PT1kP3M6ZCk7cmV0dXJuIGR9fSxhdHRyOmZ1bmN0aW9uKGIsYSxjKXt2YXIgZD1MKGEpO2lmKG1iW2RdKWlmKEIoYykpYz8oYlthXT0hMCxiLnNldEF0dHJpYnV0ZShhLGQpKTooYlthXT0hMSxiLnJlbW92ZUF0dHJpYnV0ZShkKSk7ZWxzZSByZXR1cm4gYlthXXx8KGIuYXR0cmlidXRlcy5nZXROYW1lZEl0ZW0oYSl8fHkpLnNwZWNpZmllZD9kOnM7ZWxzZSBpZihCKGMpKWIuc2V0QXR0cmlidXRlKGEsYyk7ZWxzZSBpZihiLmdldEF0dHJpYnV0ZSlyZXR1cm4gYj1iLmdldEF0dHJpYnV0ZShhLFxuMiksbnVsbD09PWI/czpifSxwcm9wOmZ1bmN0aW9uKGIsYSxjKXtpZihCKGMpKWJbYV09YztlbHNlIHJldHVybiBiW2FdfSx0ZXh0OmZ1bmN0aW9uKCl7ZnVuY3Rpb24gYihiLGQpe3ZhciBlPWFbYi5ub2RlVHlwZV07aWYoRChkKSlyZXR1cm4gZT9iW2VdOlwiXCI7YltlXT1kfXZhciBhPVtdOzk+Uz8oYVsxXT1cImlubmVyVGV4dFwiLGFbM109XCJub2RlVmFsdWVcIik6YVsxXT1hWzNdPVwidGV4dENvbnRlbnRcIjtiLiRkdj1cIlwiO3JldHVybiBifSgpLHZhbDpmdW5jdGlvbihiLGEpe2lmKEQoYSkpe2lmKFwiU0VMRUNUXCI9PT1MYShiKSYmYi5tdWx0aXBsZSl7dmFyIGM9W107cShiLm9wdGlvbnMsZnVuY3Rpb24oYSl7YS5zZWxlY3RlZCYmYy5wdXNoKGEudmFsdWV8fGEudGV4dCl9KTtyZXR1cm4gMD09PWMubGVuZ3RoP251bGw6Y31yZXR1cm4gYi52YWx1ZX1iLnZhbHVlPWF9LGh0bWw6ZnVuY3Rpb24oYixhKXtpZihEKGEpKXJldHVybiBiLmlubmVySFRNTDtmb3IodmFyIGM9MCxkPWIuY2hpbGROb2RlcztjPFxuZC5sZW5ndGg7YysrKUlhKGRbY10pO2IuaW5uZXJIVE1MPWF9LGVtcHR5OnBjfSxmdW5jdGlvbihiLGEpe1IucHJvdG90eXBlW2FdPWZ1bmN0aW9uKGEsZCl7dmFyIGUsZyxmPXRoaXMubGVuZ3RoO2lmKGIhPT1wYyYmKDI9PWIubGVuZ3RoJiZiIT09S2ImJmIhPT1vYz9hOmQpPT09cyl7aWYoVShhKSl7Zm9yKGU9MDtlPGY7ZSsrKWlmKGI9PT1uYyliKHRoaXNbZV0sYSk7ZWxzZSBmb3IoZyBpbiBhKWIodGhpc1tlXSxnLGFbZ10pO3JldHVybiB0aGlzfWU9Yi4kZHY7Zj1lPT09cz9NYXRoLm1pbihmLDEpOmY7Zm9yKGc9MDtnPGY7ZysrKXt2YXIgaz1iKHRoaXNbZ10sYSxkKTtlPWU/ZStrOmt9cmV0dXJuIGV9Zm9yKGU9MDtlPGY7ZSsrKWIodGhpc1tlXSxhLGQpO3JldHVybiB0aGlzfX0pO3Eoe3JlbW92ZURhdGE6bGMsZGVhbG9jOklhLG9uOmZ1bmN0aW9uIGEoYyxkLGUsZyl7aWYoQihnKSl0aHJvdyBHYihcIm9uYXJnc1wiKTt2YXIgZj1sYShjLFwiZXZlbnRzXCIpLGs9bGEoYyxcImhhbmRsZVwiKTtcbmZ8fGxhKGMsXCJldmVudHNcIixmPXt9KTtrfHxsYShjLFwiaGFuZGxlXCIsaz1uZShjLGYpKTtxKGQuc3BsaXQoXCIgXCIpLGZ1bmN0aW9uKGQpe3ZhciBnPWZbZF07aWYoIWcpe2lmKFwibW91c2VlbnRlclwiPT1kfHxcIm1vdXNlbGVhdmVcIj09ZCl7dmFyIGw9Vi5ib2R5LmNvbnRhaW5zfHxWLmJvZHkuY29tcGFyZURvY3VtZW50UG9zaXRpb24/ZnVuY3Rpb24oYSxjKXt2YXIgZD05PT09YS5ub2RlVHlwZT9hLmRvY3VtZW50RWxlbWVudDphLGU9YyYmYy5wYXJlbnROb2RlO3JldHVybiBhPT09ZXx8ISEoZSYmMT09PWUubm9kZVR5cGUmJihkLmNvbnRhaW5zP2QuY29udGFpbnMoZSk6YS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbiYmYS5jb21wYXJlRG9jdW1lbnRQb3NpdGlvbihlKSYxNikpfTpmdW5jdGlvbihhLGMpe2lmKGMpZm9yKDtjPWMucGFyZW50Tm9kZTspaWYoYz09PWEpcmV0dXJuITA7cmV0dXJuITF9O2ZbZF09W107YShjLHttb3VzZWxlYXZlOlwibW91c2VvdXRcIixtb3VzZWVudGVyOlwibW91c2VvdmVyXCJ9W2RdLFxuZnVuY3Rpb24oYSl7dmFyIGM9YS5yZWxhdGVkVGFyZ2V0O2MmJihjPT09dGhpc3x8bCh0aGlzLGMpKXx8ayhhLGQpfSl9ZWxzZSBwYihjLGQsayksZltkXT1bXTtnPWZbZF19Zy5wdXNoKGUpfSl9LG9mZjptYyxvbmU6ZnVuY3Rpb24oYSxjLGQpe2E9dyhhKTthLm9uKGMsZnVuY3Rpb24gZygpe2Eub2ZmKGMsZCk7YS5vZmYoYyxnKX0pO2Eub24oYyxkKX0scmVwbGFjZVdpdGg6ZnVuY3Rpb24oYSxjKXt2YXIgZCxlPWEucGFyZW50Tm9kZTtJYShhKTtxKG5ldyBSKGMpLGZ1bmN0aW9uKGMpe2Q/ZS5pbnNlcnRCZWZvcmUoYyxkLm5leHRTaWJsaW5nKTplLnJlcGxhY2VDaGlsZChjLGEpO2Q9Y30pfSxjaGlsZHJlbjpmdW5jdGlvbihhKXt2YXIgYz1bXTtxKGEuY2hpbGROb2RlcyxmdW5jdGlvbihhKXsxPT09YS5ub2RlVHlwZSYmYy5wdXNoKGEpfSk7cmV0dXJuIGN9LGNvbnRlbnRzOmZ1bmN0aW9uKGEpe3JldHVybiBhLmNvbnRlbnREb2N1bWVudHx8YS5jaGlsZE5vZGVzfHxbXX0sYXBwZW5kOmZ1bmN0aW9uKGEsXG5jKXtxKG5ldyBSKGMpLGZ1bmN0aW9uKGMpezEhPT1hLm5vZGVUeXBlJiYxMSE9PWEubm9kZVR5cGV8fGEuYXBwZW5kQ2hpbGQoYyl9KX0scHJlcGVuZDpmdW5jdGlvbihhLGMpe2lmKDE9PT1hLm5vZGVUeXBlKXt2YXIgZD1hLmZpcnN0Q2hpbGQ7cShuZXcgUihjKSxmdW5jdGlvbihjKXthLmluc2VydEJlZm9yZShjLGQpfSl9fSx3cmFwOmZ1bmN0aW9uKGEsYyl7Yz13KGMpWzBdO3ZhciBkPWEucGFyZW50Tm9kZTtkJiZkLnJlcGxhY2VDaGlsZChjLGEpO2MuYXBwZW5kQ2hpbGQoYSl9LHJlbW92ZTpmdW5jdGlvbihhKXtJYShhKTt2YXIgYz1hLnBhcmVudE5vZGU7YyYmYy5yZW1vdmVDaGlsZChhKX0sYWZ0ZXI6ZnVuY3Rpb24oYSxjKXt2YXIgZD1hLGU9YS5wYXJlbnROb2RlO3EobmV3IFIoYyksZnVuY3Rpb24oYSl7ZS5pbnNlcnRCZWZvcmUoYSxkLm5leHRTaWJsaW5nKTtkPWF9KX0sYWRkQ2xhc3M6a2IscmVtb3ZlQ2xhc3M6amIsdG9nZ2xlQ2xhc3M6ZnVuY3Rpb24oYSxjLGQpe2MmJlxucShjLnNwbGl0KFwiIFwiKSxmdW5jdGlvbihjKXt2YXIgZz1kO0QoZykmJihnPSFLYihhLGMpKTsoZz9rYjpqYikoYSxjKX0pfSxwYXJlbnQ6ZnVuY3Rpb24oYSl7cmV0dXJuKGE9YS5wYXJlbnROb2RlKSYmMTEhPT1hLm5vZGVUeXBlP2E6bnVsbH0sbmV4dDpmdW5jdGlvbihhKXtpZihhLm5leHRFbGVtZW50U2libGluZylyZXR1cm4gYS5uZXh0RWxlbWVudFNpYmxpbmc7Zm9yKGE9YS5uZXh0U2libGluZztudWxsIT1hJiYxIT09YS5ub2RlVHlwZTspYT1hLm5leHRTaWJsaW5nO3JldHVybiBhfSxmaW5kOmZ1bmN0aW9uKGEsYyl7cmV0dXJuIGEuZ2V0RWxlbWVudHNCeVRhZ05hbWU/YS5nZXRFbGVtZW50c0J5VGFnTmFtZShjKTpbXX0sY2xvbmU6SmIsdHJpZ2dlckhhbmRsZXI6ZnVuY3Rpb24oYSxjLGQpe2M9KGxhKGEsXCJldmVudHNcIil8fHt9KVtjXTtkPWR8fFtdO3ZhciBlPVt7cHJldmVudERlZmF1bHQ6eSxzdG9wUHJvcGFnYXRpb246eX1dO3EoYyxmdW5jdGlvbihjKXtjLmFwcGx5KGEsXG5lLmNvbmNhdChkKSl9KX19LGZ1bmN0aW9uKGEsYyl7Ui5wcm90b3R5cGVbY109ZnVuY3Rpb24oYyxlLGcpe2Zvcih2YXIgZixrPTA7azx0aGlzLmxlbmd0aDtrKyspRChmKT8oZj1hKHRoaXNba10sYyxlLGcpLEIoZikmJihmPXcoZikpKTpJYihmLGEodGhpc1trXSxjLGUsZykpO3JldHVybiBCKGYpP2Y6dGhpc307Ui5wcm90b3R5cGUuYmluZD1SLnByb3RvdHlwZS5vbjtSLnByb3RvdHlwZS51bmJpbmQ9Ui5wcm90b3R5cGUub2ZmfSk7WWEucHJvdG90eXBlPXtwdXQ6ZnVuY3Rpb24oYSxjKXt0aGlzW0phKGEpXT1jfSxnZXQ6ZnVuY3Rpb24oYSl7cmV0dXJuIHRoaXNbSmEoYSldfSxyZW1vdmU6ZnVuY3Rpb24oYSl7dmFyIGM9dGhpc1thPUphKGEpXTtkZWxldGUgdGhpc1thXTtyZXR1cm4gY319O3ZhciBwZT0vXmZ1bmN0aW9uXFxzKlteXFwoXSpcXChcXHMqKFteXFwpXSopXFwpL20scWU9LywvLHJlPS9eXFxzKihfPykoXFxTKz8pXFwxXFxzKiQvLG9lPS8oKFxcL1xcLy4qJCl8KFxcL1xcKltcXHNcXFNdKj9cXCpcXC8pKS9tZyxcblphPXQoXCIkaW5qZWN0b3JcIiksTWU9dChcIiRhbmltYXRlXCIpLExkPVtcIiRwcm92aWRlXCIsZnVuY3Rpb24oYSl7dGhpcy4kJHNlbGVjdG9ycz17fTt0aGlzLnJlZ2lzdGVyPWZ1bmN0aW9uKGMsZCl7dmFyIGU9YytcIi1hbmltYXRpb25cIjtpZihjJiZcIi5cIiE9Yy5jaGFyQXQoMCkpdGhyb3cgTWUoXCJub3Rjc2VsXCIsYyk7dGhpcy4kJHNlbGVjdG9yc1tjLnN1YnN0cigxKV09ZTthLmZhY3RvcnkoZSxkKX07dGhpcy5jbGFzc05hbWVGaWx0ZXI9ZnVuY3Rpb24oYSl7MT09PWFyZ3VtZW50cy5sZW5ndGgmJih0aGlzLiQkY2xhc3NOYW1lRmlsdGVyPWEgaW5zdGFuY2VvZiBSZWdFeHA/YTpudWxsKTtyZXR1cm4gdGhpcy4kJGNsYXNzTmFtZUZpbHRlcn07dGhpcy4kZ2V0PVtcIiR0aW1lb3V0XCIsXCIkJGFzeW5jQ2FsbGJhY2tcIixmdW5jdGlvbihhLGQpe3JldHVybntlbnRlcjpmdW5jdGlvbihhLGMsZixrKXtmP2YuYWZ0ZXIoYSk6KGMmJmNbMF18fChjPWYucGFyZW50KCkpLGMuYXBwZW5kKGEpKTtrJiZcbmQoayl9LGxlYXZlOmZ1bmN0aW9uKGEsYyl7YS5yZW1vdmUoKTtjJiZkKGMpfSxtb3ZlOmZ1bmN0aW9uKGEsYyxkLGspe3RoaXMuZW50ZXIoYSxjLGQsayl9LGFkZENsYXNzOmZ1bmN0aW9uKGEsYyxmKXtjPUMoYyk/YzpPKGMpP2Muam9pbihcIiBcIik6XCJcIjtxKGEsZnVuY3Rpb24oYSl7a2IoYSxjKX0pO2YmJmQoZil9LHJlbW92ZUNsYXNzOmZ1bmN0aW9uKGEsYyxmKXtjPUMoYyk/YzpPKGMpP2Muam9pbihcIiBcIik6XCJcIjtxKGEsZnVuY3Rpb24oYSl7amIoYSxjKX0pO2YmJmQoZil9LHNldENsYXNzOmZ1bmN0aW9uKGEsYyxmLGspe3EoYSxmdW5jdGlvbihhKXtrYihhLGMpO2piKGEsZil9KTtrJiZkKGspfSxlbmFibGVkOnl9fV19XSxpYT10KFwiJGNvbXBpbGVcIik7Z2MuJGluamVjdD1bXCIkcHJvdmlkZVwiLFwiJCRzYW5pdGl6ZVVyaVByb3ZpZGVyXCJdO3ZhciB1ZT0vXih4W1xcOlxcLV9dfGRhdGFbXFw6XFwtX10pL2ksemM9dChcIiRpbnRlcnBvbGF0ZVwiKSxOZT0vXihbXlxcPyNdKikoXFw/KFteI10qKSk/KCMoLiopKT8kLyxcbnhlPXtodHRwOjgwLGh0dHBzOjQ0MyxmdHA6MjF9LFBiPXQoXCIkbG9jYXRpb25cIik7UmIucHJvdG90eXBlPVFiLnByb3RvdHlwZT1DYy5wcm90b3R5cGU9eyQkaHRtbDU6ITEsJCRyZXBsYWNlOiExLGFic1VybDpxYihcIiQkYWJzVXJsXCIpLHVybDpmdW5jdGlvbihhLGMpe2lmKEQoYSkpcmV0dXJuIHRoaXMuJCR1cmw7dmFyIGQ9TmUuZXhlYyhhKTtkWzFdJiZ0aGlzLnBhdGgoZGVjb2RlVVJJQ29tcG9uZW50KGRbMV0pKTsoZFsyXXx8ZFsxXSkmJnRoaXMuc2VhcmNoKGRbM118fFwiXCIpO3RoaXMuaGFzaChkWzVdfHxcIlwiLGMpO3JldHVybiB0aGlzfSxwcm90b2NvbDpxYihcIiQkcHJvdG9jb2xcIiksaG9zdDpxYihcIiQkaG9zdFwiKSxwb3J0OnFiKFwiJCRwb3J0XCIpLHBhdGg6RGMoXCIkJHBhdGhcIixmdW5jdGlvbihhKXtyZXR1cm5cIi9cIj09YS5jaGFyQXQoMCk/YTpcIi9cIithfSksc2VhcmNoOmZ1bmN0aW9uKGEsYyl7c3dpdGNoKGFyZ3VtZW50cy5sZW5ndGgpe2Nhc2UgMDpyZXR1cm4gdGhpcy4kJHNlYXJjaDtcbmNhc2UgMTppZihDKGEpKXRoaXMuJCRzZWFyY2g9Y2MoYSk7ZWxzZSBpZihVKGEpKXRoaXMuJCRzZWFyY2g9YTtlbHNlIHRocm93IFBiKFwiaXNyY2hhcmdcIik7YnJlYWs7ZGVmYXVsdDpEKGMpfHxudWxsPT09Yz9kZWxldGUgdGhpcy4kJHNlYXJjaFthXTp0aGlzLiQkc2VhcmNoW2FdPWN9dGhpcy4kJGNvbXBvc2UoKTtyZXR1cm4gdGhpc30saGFzaDpEYyhcIiQkaGFzaFwiLEZhKSxyZXBsYWNlOmZ1bmN0aW9uKCl7dGhpcy4kJHJlcGxhY2U9ITA7cmV0dXJuIHRoaXN9fTt2YXIgRGE9dChcIiRwYXJzZVwiKSxHYz17fSx0YSxjYj17XCJudWxsXCI6ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbH0sXCJ0cnVlXCI6ZnVuY3Rpb24oKXtyZXR1cm4hMH0sXCJmYWxzZVwiOmZ1bmN0aW9uKCl7cmV0dXJuITF9LHVuZGVmaW5lZDp5LFwiK1wiOmZ1bmN0aW9uKGEsYyxkLGUpe2Q9ZChhLGMpO2U9ZShhLGMpO3JldHVybiBCKGQpP0IoZSk/ZCtlOmQ6QihlKT9lOnN9LFwiLVwiOmZ1bmN0aW9uKGEsYyxkLGUpe2Q9ZChhLGMpO2U9XG5lKGEsYyk7cmV0dXJuKEIoZCk/ZDowKS0oQihlKT9lOjApfSxcIipcIjpmdW5jdGlvbihhLGMsZCxlKXtyZXR1cm4gZChhLGMpKmUoYSxjKX0sXCIvXCI6ZnVuY3Rpb24oYSxjLGQsZSl7cmV0dXJuIGQoYSxjKS9lKGEsYyl9LFwiJVwiOmZ1bmN0aW9uKGEsYyxkLGUpe3JldHVybiBkKGEsYyklZShhLGMpfSxcIl5cIjpmdW5jdGlvbihhLGMsZCxlKXtyZXR1cm4gZChhLGMpXmUoYSxjKX0sXCI9XCI6eSxcIj09PVwiOmZ1bmN0aW9uKGEsYyxkLGUpe3JldHVybiBkKGEsYyk9PT1lKGEsYyl9LFwiIT09XCI6ZnVuY3Rpb24oYSxjLGQsZSl7cmV0dXJuIGQoYSxjKSE9PWUoYSxjKX0sXCI9PVwiOmZ1bmN0aW9uKGEsYyxkLGUpe3JldHVybiBkKGEsYyk9PWUoYSxjKX0sXCIhPVwiOmZ1bmN0aW9uKGEsYyxkLGUpe3JldHVybiBkKGEsYykhPWUoYSxjKX0sXCI8XCI6ZnVuY3Rpb24oYSxjLGQsZSl7cmV0dXJuIGQoYSxjKTxlKGEsYyl9LFwiPlwiOmZ1bmN0aW9uKGEsYyxkLGUpe3JldHVybiBkKGEsYyk+ZShhLGMpfSxcIjw9XCI6ZnVuY3Rpb24oYSxcbmMsZCxlKXtyZXR1cm4gZChhLGMpPD1lKGEsYyl9LFwiPj1cIjpmdW5jdGlvbihhLGMsZCxlKXtyZXR1cm4gZChhLGMpPj1lKGEsYyl9LFwiJiZcIjpmdW5jdGlvbihhLGMsZCxlKXtyZXR1cm4gZChhLGMpJiZlKGEsYyl9LFwifHxcIjpmdW5jdGlvbihhLGMsZCxlKXtyZXR1cm4gZChhLGMpfHxlKGEsYyl9LFwiJlwiOmZ1bmN0aW9uKGEsYyxkLGUpe3JldHVybiBkKGEsYykmZShhLGMpfSxcInxcIjpmdW5jdGlvbihhLGMsZCxlKXtyZXR1cm4gZShhLGMpKGEsYyxkKGEsYykpfSxcIiFcIjpmdW5jdGlvbihhLGMsZCl7cmV0dXJuIWQoYSxjKX19LE9lPXtuOlwiXFxuXCIsZjpcIlxcZlwiLHI6XCJcXHJcIix0OlwiXFx0XCIsdjpcIlxcdlwiLFwiJ1wiOlwiJ1wiLCdcIic6J1wiJ30sVGI9ZnVuY3Rpb24oYSl7dGhpcy5vcHRpb25zPWF9O1RiLnByb3RvdHlwZT17Y29uc3RydWN0b3I6VGIsbGV4OmZ1bmN0aW9uKGEpe3RoaXMudGV4dD1hO3RoaXMuaW5kZXg9MDt0aGlzLmNoPXM7dGhpcy5sYXN0Q2g9XCI6XCI7Zm9yKHRoaXMudG9rZW5zPVtdO3RoaXMuaW5kZXg8XG50aGlzLnRleHQubGVuZ3RoOyl7dGhpcy5jaD10aGlzLnRleHQuY2hhckF0KHRoaXMuaW5kZXgpO2lmKHRoaXMuaXMoXCJcXFwiJ1wiKSl0aGlzLnJlYWRTdHJpbmcodGhpcy5jaCk7ZWxzZSBpZih0aGlzLmlzTnVtYmVyKHRoaXMuY2gpfHx0aGlzLmlzKFwiLlwiKSYmdGhpcy5pc051bWJlcih0aGlzLnBlZWsoKSkpdGhpcy5yZWFkTnVtYmVyKCk7ZWxzZSBpZih0aGlzLmlzSWRlbnQodGhpcy5jaCkpdGhpcy5yZWFkSWRlbnQoKTtlbHNlIGlmKHRoaXMuaXMoXCIoKXt9W10uLDs6P1wiKSl0aGlzLnRva2Vucy5wdXNoKHtpbmRleDp0aGlzLmluZGV4LHRleHQ6dGhpcy5jaH0pLHRoaXMuaW5kZXgrKztlbHNlIGlmKHRoaXMuaXNXaGl0ZXNwYWNlKHRoaXMuY2gpKXt0aGlzLmluZGV4Kys7Y29udGludWV9ZWxzZXthPXRoaXMuY2grdGhpcy5wZWVrKCk7dmFyIGM9YSt0aGlzLnBlZWsoMiksZD1jYlt0aGlzLmNoXSxlPWNiW2FdLGc9Y2JbY107Zz8odGhpcy50b2tlbnMucHVzaCh7aW5kZXg6dGhpcy5pbmRleCxcbnRleHQ6YyxmbjpnfSksdGhpcy5pbmRleCs9Myk6ZT8odGhpcy50b2tlbnMucHVzaCh7aW5kZXg6dGhpcy5pbmRleCx0ZXh0OmEsZm46ZX0pLHRoaXMuaW5kZXgrPTIpOmQ/KHRoaXMudG9rZW5zLnB1c2goe2luZGV4OnRoaXMuaW5kZXgsdGV4dDp0aGlzLmNoLGZuOmR9KSx0aGlzLmluZGV4Kz0xKTp0aGlzLnRocm93RXJyb3IoXCJVbmV4cGVjdGVkIG5leHQgY2hhcmFjdGVyIFwiLHRoaXMuaW5kZXgsdGhpcy5pbmRleCsxKX10aGlzLmxhc3RDaD10aGlzLmNofXJldHVybiB0aGlzLnRva2Vuc30saXM6ZnVuY3Rpb24oYSl7cmV0dXJuLTEhPT1hLmluZGV4T2YodGhpcy5jaCl9LHdhczpmdW5jdGlvbihhKXtyZXR1cm4tMSE9PWEuaW5kZXhPZih0aGlzLmxhc3RDaCl9LHBlZWs6ZnVuY3Rpb24oYSl7YT1hfHwxO3JldHVybiB0aGlzLmluZGV4K2E8dGhpcy50ZXh0Lmxlbmd0aD90aGlzLnRleHQuY2hhckF0KHRoaXMuaW5kZXgrYSk6ITF9LGlzTnVtYmVyOmZ1bmN0aW9uKGEpe3JldHVyblwiMFwiPD1cbmEmJlwiOVwiPj1hfSxpc1doaXRlc3BhY2U6ZnVuY3Rpb24oYSl7cmV0dXJuXCIgXCI9PT1hfHxcIlxcclwiPT09YXx8XCJcXHRcIj09PWF8fFwiXFxuXCI9PT1hfHxcIlxcdlwiPT09YXx8XCJcXHUwMGEwXCI9PT1hfSxpc0lkZW50OmZ1bmN0aW9uKGEpe3JldHVyblwiYVwiPD1hJiZcInpcIj49YXx8XCJBXCI8PWEmJlwiWlwiPj1hfHxcIl9cIj09PWF8fFwiJFwiPT09YX0saXNFeHBPcGVyYXRvcjpmdW5jdGlvbihhKXtyZXR1cm5cIi1cIj09PWF8fFwiK1wiPT09YXx8dGhpcy5pc051bWJlcihhKX0sdGhyb3dFcnJvcjpmdW5jdGlvbihhLGMsZCl7ZD1kfHx0aGlzLmluZGV4O2M9QihjKT9cInMgXCIrYytcIi1cIit0aGlzLmluZGV4K1wiIFtcIit0aGlzLnRleHQuc3Vic3RyaW5nKGMsZCkrXCJdXCI6XCIgXCIrZDt0aHJvdyBEYShcImxleGVyclwiLGEsYyx0aGlzLnRleHQpO30scmVhZE51bWJlcjpmdW5jdGlvbigpe2Zvcih2YXIgYT1cIlwiLGM9dGhpcy5pbmRleDt0aGlzLmluZGV4PHRoaXMudGV4dC5sZW5ndGg7KXt2YXIgZD1MKHRoaXMudGV4dC5jaGFyQXQodGhpcy5pbmRleCkpO1xuaWYoXCIuXCI9PWR8fHRoaXMuaXNOdW1iZXIoZCkpYSs9ZDtlbHNle3ZhciBlPXRoaXMucGVlaygpO2lmKFwiZVwiPT1kJiZ0aGlzLmlzRXhwT3BlcmF0b3IoZSkpYSs9ZDtlbHNlIGlmKHRoaXMuaXNFeHBPcGVyYXRvcihkKSYmZSYmdGhpcy5pc051bWJlcihlKSYmXCJlXCI9PWEuY2hhckF0KGEubGVuZ3RoLTEpKWErPWQ7ZWxzZSBpZighdGhpcy5pc0V4cE9wZXJhdG9yKGQpfHxlJiZ0aGlzLmlzTnVtYmVyKGUpfHxcImVcIiE9YS5jaGFyQXQoYS5sZW5ndGgtMSkpYnJlYWs7ZWxzZSB0aGlzLnRocm93RXJyb3IoXCJJbnZhbGlkIGV4cG9uZW50XCIpfXRoaXMuaW5kZXgrK31hKj0xO3RoaXMudG9rZW5zLnB1c2goe2luZGV4OmMsdGV4dDphLGxpdGVyYWw6ITAsY29uc3RhbnQ6ITAsZm46ZnVuY3Rpb24oKXtyZXR1cm4gYX19KX0scmVhZElkZW50OmZ1bmN0aW9uKCl7Zm9yKHZhciBhPXRoaXMsYz1cIlwiLGQ9dGhpcy5pbmRleCxlLGcsZixrO3RoaXMuaW5kZXg8dGhpcy50ZXh0Lmxlbmd0aDspe2s9dGhpcy50ZXh0LmNoYXJBdCh0aGlzLmluZGV4KTtcbmlmKFwiLlwiPT09a3x8dGhpcy5pc0lkZW50KGspfHx0aGlzLmlzTnVtYmVyKGspKVwiLlwiPT09ayYmKGU9dGhpcy5pbmRleCksYys9aztlbHNlIGJyZWFrO3RoaXMuaW5kZXgrK31pZihlKWZvcihnPXRoaXMuaW5kZXg7Zzx0aGlzLnRleHQubGVuZ3RoOyl7az10aGlzLnRleHQuY2hhckF0KGcpO2lmKFwiKFwiPT09ayl7Zj1jLnN1YnN0cihlLWQrMSk7Yz1jLnN1YnN0cigwLGUtZCk7dGhpcy5pbmRleD1nO2JyZWFrfWlmKHRoaXMuaXNXaGl0ZXNwYWNlKGspKWcrKztlbHNlIGJyZWFrfWQ9e2luZGV4OmQsdGV4dDpjfTtpZihjYi5oYXNPd25Qcm9wZXJ0eShjKSlkLmZuPWNiW2NdLGQubGl0ZXJhbD0hMCxkLmNvbnN0YW50PSEwO2Vsc2V7dmFyIG09RmMoYyx0aGlzLm9wdGlvbnMsdGhpcy50ZXh0KTtkLmZuPUooZnVuY3Rpb24oYSxjKXtyZXR1cm4gbShhLGMpfSx7YXNzaWduOmZ1bmN0aW9uKGQsZSl7cmV0dXJuIHJiKGQsYyxlLGEudGV4dCxhLm9wdGlvbnMpfX0pfXRoaXMudG9rZW5zLnB1c2goZCk7XG5mJiYodGhpcy50b2tlbnMucHVzaCh7aW5kZXg6ZSx0ZXh0OlwiLlwifSksdGhpcy50b2tlbnMucHVzaCh7aW5kZXg6ZSsxLHRleHQ6Zn0pKX0scmVhZFN0cmluZzpmdW5jdGlvbihhKXt2YXIgYz10aGlzLmluZGV4O3RoaXMuaW5kZXgrKztmb3IodmFyIGQ9XCJcIixlPWEsZz0hMTt0aGlzLmluZGV4PHRoaXMudGV4dC5sZW5ndGg7KXt2YXIgZj10aGlzLnRleHQuY2hhckF0KHRoaXMuaW5kZXgpLGU9ZStmO2lmKGcpXCJ1XCI9PT1mPyhmPXRoaXMudGV4dC5zdWJzdHJpbmcodGhpcy5pbmRleCsxLHRoaXMuaW5kZXgrNSksZi5tYXRjaCgvW1xcZGEtZl17NH0vaSl8fHRoaXMudGhyb3dFcnJvcihcIkludmFsaWQgdW5pY29kZSBlc2NhcGUgW1xcXFx1XCIrZitcIl1cIiksdGhpcy5pbmRleCs9NCxkKz1TdHJpbmcuZnJvbUNoYXJDb2RlKHBhcnNlSW50KGYsMTYpKSk6ZD0oZz1PZVtmXSk/ZCtnOmQrZixnPSExO2Vsc2UgaWYoXCJcXFxcXCI9PT1mKWc9ITA7ZWxzZXtpZihmPT09YSl7dGhpcy5pbmRleCsrO3RoaXMudG9rZW5zLnB1c2goe2luZGV4OmMsXG50ZXh0OmUsc3RyaW5nOmQsbGl0ZXJhbDohMCxjb25zdGFudDohMCxmbjpmdW5jdGlvbigpe3JldHVybiBkfX0pO3JldHVybn1kKz1mfXRoaXMuaW5kZXgrK310aGlzLnRocm93RXJyb3IoXCJVbnRlcm1pbmF0ZWQgcXVvdGVcIixjKX19O3ZhciBiYj1mdW5jdGlvbihhLGMsZCl7dGhpcy5sZXhlcj1hO3RoaXMuJGZpbHRlcj1jO3RoaXMub3B0aW9ucz1kfTtiYi5aRVJPPUooZnVuY3Rpb24oKXtyZXR1cm4gMH0se2NvbnN0YW50OiEwfSk7YmIucHJvdG90eXBlPXtjb25zdHJ1Y3RvcjpiYixwYXJzZTpmdW5jdGlvbihhKXt0aGlzLnRleHQ9YTt0aGlzLnRva2Vucz10aGlzLmxleGVyLmxleChhKTthPXRoaXMuc3RhdGVtZW50cygpOzAhPT10aGlzLnRva2Vucy5sZW5ndGgmJnRoaXMudGhyb3dFcnJvcihcImlzIGFuIHVuZXhwZWN0ZWQgdG9rZW5cIix0aGlzLnRva2Vuc1swXSk7YS5saXRlcmFsPSEhYS5saXRlcmFsO2EuY29uc3RhbnQ9ISFhLmNvbnN0YW50O3JldHVybiBhfSxwcmltYXJ5OmZ1bmN0aW9uKCl7dmFyIGE7XG5pZih0aGlzLmV4cGVjdChcIihcIikpYT10aGlzLmZpbHRlckNoYWluKCksdGhpcy5jb25zdW1lKFwiKVwiKTtlbHNlIGlmKHRoaXMuZXhwZWN0KFwiW1wiKSlhPXRoaXMuYXJyYXlEZWNsYXJhdGlvbigpO2Vsc2UgaWYodGhpcy5leHBlY3QoXCJ7XCIpKWE9dGhpcy5vYmplY3QoKTtlbHNle3ZhciBjPXRoaXMuZXhwZWN0KCk7KGE9Yy5mbil8fHRoaXMudGhyb3dFcnJvcihcIm5vdCBhIHByaW1hcnkgZXhwcmVzc2lvblwiLGMpO2EubGl0ZXJhbD0hIWMubGl0ZXJhbDthLmNvbnN0YW50PSEhYy5jb25zdGFudH1mb3IodmFyIGQ7Yz10aGlzLmV4cGVjdChcIihcIixcIltcIixcIi5cIik7KVwiKFwiPT09Yy50ZXh0PyhhPXRoaXMuZnVuY3Rpb25DYWxsKGEsZCksZD1udWxsKTpcIltcIj09PWMudGV4dD8oZD1hLGE9dGhpcy5vYmplY3RJbmRleChhKSk6XCIuXCI9PT1jLnRleHQ/KGQ9YSxhPXRoaXMuZmllbGRBY2Nlc3MoYSkpOnRoaXMudGhyb3dFcnJvcihcIklNUE9TU0lCTEVcIik7cmV0dXJuIGF9LHRocm93RXJyb3I6ZnVuY3Rpb24oYSxcbmMpe3Rocm93IERhKFwic3ludGF4XCIsYy50ZXh0LGEsYy5pbmRleCsxLHRoaXMudGV4dCx0aGlzLnRleHQuc3Vic3RyaW5nKGMuaW5kZXgpKTt9LHBlZWtUb2tlbjpmdW5jdGlvbigpe2lmKDA9PT10aGlzLnRva2Vucy5sZW5ndGgpdGhyb3cgRGEoXCJ1ZW9lXCIsdGhpcy50ZXh0KTtyZXR1cm4gdGhpcy50b2tlbnNbMF19LHBlZWs6ZnVuY3Rpb24oYSxjLGQsZSl7aWYoMDx0aGlzLnRva2Vucy5sZW5ndGgpe3ZhciBnPXRoaXMudG9rZW5zWzBdLGY9Zy50ZXh0O2lmKGY9PT1hfHxmPT09Y3x8Zj09PWR8fGY9PT1lfHwhKGF8fGN8fGR8fGUpKXJldHVybiBnfXJldHVybiExfSxleHBlY3Q6ZnVuY3Rpb24oYSxjLGQsZSl7cmV0dXJuKGE9dGhpcy5wZWVrKGEsYyxkLGUpKT8odGhpcy50b2tlbnMuc2hpZnQoKSxhKTohMX0sY29uc3VtZTpmdW5jdGlvbihhKXt0aGlzLmV4cGVjdChhKXx8dGhpcy50aHJvd0Vycm9yKFwiaXMgdW5leHBlY3RlZCwgZXhwZWN0aW5nIFtcIithK1wiXVwiLHRoaXMucGVlaygpKX0sXG51bmFyeUZuOmZ1bmN0aW9uKGEsYyl7cmV0dXJuIEooZnVuY3Rpb24oZCxlKXtyZXR1cm4gYShkLGUsYyl9LHtjb25zdGFudDpjLmNvbnN0YW50fSl9LHRlcm5hcnlGbjpmdW5jdGlvbihhLGMsZCl7cmV0dXJuIEooZnVuY3Rpb24oZSxnKXtyZXR1cm4gYShlLGcpP2MoZSxnKTpkKGUsZyl9LHtjb25zdGFudDphLmNvbnN0YW50JiZjLmNvbnN0YW50JiZkLmNvbnN0YW50fSl9LGJpbmFyeUZuOmZ1bmN0aW9uKGEsYyxkKXtyZXR1cm4gSihmdW5jdGlvbihlLGcpe3JldHVybiBjKGUsZyxhLGQpfSx7Y29uc3RhbnQ6YS5jb25zdGFudCYmZC5jb25zdGFudH0pfSxzdGF0ZW1lbnRzOmZ1bmN0aW9uKCl7Zm9yKHZhciBhPVtdOzspaWYoMDx0aGlzLnRva2Vucy5sZW5ndGgmJiF0aGlzLnBlZWsoXCJ9XCIsXCIpXCIsXCI7XCIsXCJdXCIpJiZhLnB1c2godGhpcy5maWx0ZXJDaGFpbigpKSwhdGhpcy5leHBlY3QoXCI7XCIpKXJldHVybiAxPT09YS5sZW5ndGg/YVswXTpmdW5jdGlvbihjLGQpe2Zvcih2YXIgZSxnPVxuMDtnPGEubGVuZ3RoO2crKyl7dmFyIGY9YVtnXTtmJiYoZT1mKGMsZCkpfXJldHVybiBlfX0sZmlsdGVyQ2hhaW46ZnVuY3Rpb24oKXtmb3IodmFyIGE9dGhpcy5leHByZXNzaW9uKCksYzs7KWlmKGM9dGhpcy5leHBlY3QoXCJ8XCIpKWE9dGhpcy5iaW5hcnlGbihhLGMuZm4sdGhpcy5maWx0ZXIoKSk7ZWxzZSByZXR1cm4gYX0sZmlsdGVyOmZ1bmN0aW9uKCl7Zm9yKHZhciBhPXRoaXMuZXhwZWN0KCksYz10aGlzLiRmaWx0ZXIoYS50ZXh0KSxkPVtdOzspaWYoYT10aGlzLmV4cGVjdChcIjpcIikpZC5wdXNoKHRoaXMuZXhwcmVzc2lvbigpKTtlbHNle3ZhciBlPWZ1bmN0aW9uKGEsZSxrKXtrPVtrXTtmb3IodmFyIG09MDttPGQubGVuZ3RoO20rKylrLnB1c2goZFttXShhLGUpKTtyZXR1cm4gYy5hcHBseShhLGspfTtyZXR1cm4gZnVuY3Rpb24oKXtyZXR1cm4gZX19fSxleHByZXNzaW9uOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuYXNzaWdubWVudCgpfSxhc3NpZ25tZW50OmZ1bmN0aW9uKCl7dmFyIGE9XG50aGlzLnRlcm5hcnkoKSxjLGQ7cmV0dXJuKGQ9dGhpcy5leHBlY3QoXCI9XCIpKT8oYS5hc3NpZ258fHRoaXMudGhyb3dFcnJvcihcImltcGxpZXMgYXNzaWdubWVudCBidXQgW1wiK3RoaXMudGV4dC5zdWJzdHJpbmcoMCxkLmluZGV4KStcIl0gY2FuIG5vdCBiZSBhc3NpZ25lZCB0b1wiLGQpLGM9dGhpcy50ZXJuYXJ5KCksZnVuY3Rpb24oZCxnKXtyZXR1cm4gYS5hc3NpZ24oZCxjKGQsZyksZyl9KTphfSx0ZXJuYXJ5OmZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5sb2dpY2FsT1IoKSxjLGQ7aWYodGhpcy5leHBlY3QoXCI/XCIpKXtjPXRoaXMudGVybmFyeSgpO2lmKGQ9dGhpcy5leHBlY3QoXCI6XCIpKXJldHVybiB0aGlzLnRlcm5hcnlGbihhLGMsdGhpcy50ZXJuYXJ5KCkpO3RoaXMudGhyb3dFcnJvcihcImV4cGVjdGVkIDpcIixkKX1lbHNlIHJldHVybiBhfSxsb2dpY2FsT1I6ZnVuY3Rpb24oKXtmb3IodmFyIGE9dGhpcy5sb2dpY2FsQU5EKCksYzs7KWlmKGM9dGhpcy5leHBlY3QoXCJ8fFwiKSlhPXRoaXMuYmluYXJ5Rm4oYSxcbmMuZm4sdGhpcy5sb2dpY2FsQU5EKCkpO2Vsc2UgcmV0dXJuIGF9LGxvZ2ljYWxBTkQ6ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmVxdWFsaXR5KCksYztpZihjPXRoaXMuZXhwZWN0KFwiJiZcIikpYT10aGlzLmJpbmFyeUZuKGEsYy5mbix0aGlzLmxvZ2ljYWxBTkQoKSk7cmV0dXJuIGF9LGVxdWFsaXR5OmZ1bmN0aW9uKCl7dmFyIGE9dGhpcy5yZWxhdGlvbmFsKCksYztpZihjPXRoaXMuZXhwZWN0KFwiPT1cIixcIiE9XCIsXCI9PT1cIixcIiE9PVwiKSlhPXRoaXMuYmluYXJ5Rm4oYSxjLmZuLHRoaXMuZXF1YWxpdHkoKSk7cmV0dXJuIGF9LHJlbGF0aW9uYWw6ZnVuY3Rpb24oKXt2YXIgYT10aGlzLmFkZGl0aXZlKCksYztpZihjPXRoaXMuZXhwZWN0KFwiPFwiLFwiPlwiLFwiPD1cIixcIj49XCIpKWE9dGhpcy5iaW5hcnlGbihhLGMuZm4sdGhpcy5yZWxhdGlvbmFsKCkpO3JldHVybiBhfSxhZGRpdGl2ZTpmdW5jdGlvbigpe2Zvcih2YXIgYT10aGlzLm11bHRpcGxpY2F0aXZlKCksYztjPXRoaXMuZXhwZWN0KFwiK1wiLFxuXCItXCIpOylhPXRoaXMuYmluYXJ5Rm4oYSxjLmZuLHRoaXMubXVsdGlwbGljYXRpdmUoKSk7cmV0dXJuIGF9LG11bHRpcGxpY2F0aXZlOmZ1bmN0aW9uKCl7Zm9yKHZhciBhPXRoaXMudW5hcnkoKSxjO2M9dGhpcy5leHBlY3QoXCIqXCIsXCIvXCIsXCIlXCIpOylhPXRoaXMuYmluYXJ5Rm4oYSxjLmZuLHRoaXMudW5hcnkoKSk7cmV0dXJuIGF9LHVuYXJ5OmZ1bmN0aW9uKCl7dmFyIGE7cmV0dXJuIHRoaXMuZXhwZWN0KFwiK1wiKT90aGlzLnByaW1hcnkoKTooYT10aGlzLmV4cGVjdChcIi1cIikpP3RoaXMuYmluYXJ5Rm4oYmIuWkVSTyxhLmZuLHRoaXMudW5hcnkoKSk6KGE9dGhpcy5leHBlY3QoXCIhXCIpKT90aGlzLnVuYXJ5Rm4oYS5mbix0aGlzLnVuYXJ5KCkpOnRoaXMucHJpbWFyeSgpfSxmaWVsZEFjY2VzczpmdW5jdGlvbihhKXt2YXIgYz10aGlzLGQ9dGhpcy5leHBlY3QoKS50ZXh0LGU9RmMoZCx0aGlzLm9wdGlvbnMsdGhpcy50ZXh0KTtyZXR1cm4gSihmdW5jdGlvbihjLGQsayl7cmV0dXJuIGUoa3x8XG5hKGMsZCkpfSx7YXNzaWduOmZ1bmN0aW9uKGUsZixrKXtyZXR1cm4gcmIoYShlLGspLGQsZixjLnRleHQsYy5vcHRpb25zKX19KX0sb2JqZWN0SW5kZXg6ZnVuY3Rpb24oYSl7dmFyIGM9dGhpcyxkPXRoaXMuZXhwcmVzc2lvbigpO3RoaXMuY29uc3VtZShcIl1cIik7cmV0dXJuIEooZnVuY3Rpb24oZSxnKXt2YXIgZj1hKGUsZyksaz1kKGUsZyksbTtpZighZilyZXR1cm4gczsoZj1hYihmW2tdLGMudGV4dCkpJiYoZi50aGVuJiZjLm9wdGlvbnMudW53cmFwUHJvbWlzZXMpJiYobT1mLFwiJCR2XCJpbiBmfHwobS4kJHY9cyxtLnRoZW4oZnVuY3Rpb24oYSl7bS4kJHY9YX0pKSxmPWYuJCR2KTtyZXR1cm4gZn0se2Fzc2lnbjpmdW5jdGlvbihlLGcsZil7dmFyIGs9ZChlLGYpO3JldHVybiBhYihhKGUsZiksYy50ZXh0KVtrXT1nfX0pfSxmdW5jdGlvbkNhbGw6ZnVuY3Rpb24oYSxjKXt2YXIgZD1bXTtpZihcIilcIiE9PXRoaXMucGVla1Rva2VuKCkudGV4dCl7ZG8gZC5wdXNoKHRoaXMuZXhwcmVzc2lvbigpKTtcbndoaWxlKHRoaXMuZXhwZWN0KFwiLFwiKSl9dGhpcy5jb25zdW1lKFwiKVwiKTt2YXIgZT10aGlzO3JldHVybiBmdW5jdGlvbihnLGYpe2Zvcih2YXIgaz1bXSxtPWM/YyhnLGYpOmcsaD0wO2g8ZC5sZW5ndGg7aCsrKWsucHVzaChkW2hdKGcsZikpO2g9YShnLGYsbSl8fHk7YWIobSxlLnRleHQpO2FiKGgsZS50ZXh0KTtrPWguYXBwbHk/aC5hcHBseShtLGspOmgoa1swXSxrWzFdLGtbMl0sa1szXSxrWzRdKTtyZXR1cm4gYWIoayxlLnRleHQpfX0sYXJyYXlEZWNsYXJhdGlvbjpmdW5jdGlvbigpe3ZhciBhPVtdLGM9ITA7aWYoXCJdXCIhPT10aGlzLnBlZWtUb2tlbigpLnRleHQpe2Rve2lmKHRoaXMucGVlayhcIl1cIikpYnJlYWs7dmFyIGQ9dGhpcy5leHByZXNzaW9uKCk7YS5wdXNoKGQpO2QuY29uc3RhbnR8fChjPSExKX13aGlsZSh0aGlzLmV4cGVjdChcIixcIikpfXRoaXMuY29uc3VtZShcIl1cIik7cmV0dXJuIEooZnVuY3Rpb24oYyxkKXtmb3IodmFyIGY9W10saz0wO2s8YS5sZW5ndGg7aysrKWYucHVzaChhW2tdKGMsXG5kKSk7cmV0dXJuIGZ9LHtsaXRlcmFsOiEwLGNvbnN0YW50OmN9KX0sb2JqZWN0OmZ1bmN0aW9uKCl7dmFyIGE9W10sYz0hMDtpZihcIn1cIiE9PXRoaXMucGVla1Rva2VuKCkudGV4dCl7ZG97aWYodGhpcy5wZWVrKFwifVwiKSlicmVhazt2YXIgZD10aGlzLmV4cGVjdCgpLGQ9ZC5zdHJpbmd8fGQudGV4dDt0aGlzLmNvbnN1bWUoXCI6XCIpO3ZhciBlPXRoaXMuZXhwcmVzc2lvbigpO2EucHVzaCh7a2V5OmQsdmFsdWU6ZX0pO2UuY29uc3RhbnR8fChjPSExKX13aGlsZSh0aGlzLmV4cGVjdChcIixcIikpfXRoaXMuY29uc3VtZShcIn1cIik7cmV0dXJuIEooZnVuY3Rpb24oYyxkKXtmb3IodmFyIGU9e30sbT0wO208YS5sZW5ndGg7bSsrKXt2YXIgaD1hW21dO2VbaC5rZXldPWgudmFsdWUoYyxkKX1yZXR1cm4gZX0se2xpdGVyYWw6ITAsY29uc3RhbnQ6Y30pfX07dmFyIFNiPXt9LHVhPXQoXCIkc2NlXCIpLGZhPXtIVE1MOlwiaHRtbFwiLENTUzpcImNzc1wiLFVSTDpcInVybFwiLFJFU09VUkNFX1VSTDpcInJlc291cmNlVXJsXCIsXG5KUzpcImpzXCJ9LFc9Vi5jcmVhdGVFbGVtZW50KFwiYVwiKSxJYz1zYShULmxvY2F0aW9uLmhyZWYsITApO2tjLiRpbmplY3Q9W1wiJHByb3ZpZGVcIl07SmMuJGluamVjdD1bXCIkbG9jYWxlXCJdO0xjLiRpbmplY3Q9W1wiJGxvY2FsZVwiXTt2YXIgT2M9XCIuXCIsSmU9e3l5eXk6WShcIkZ1bGxZZWFyXCIsNCkseXk6WShcIkZ1bGxZZWFyXCIsMiwwLCEwKSx5OlkoXCJGdWxsWWVhclwiLDEpLE1NTU06c2IoXCJNb250aFwiKSxNTU06c2IoXCJNb250aFwiLCEwKSxNTTpZKFwiTW9udGhcIiwyLDEpLE06WShcIk1vbnRoXCIsMSwxKSxkZDpZKFwiRGF0ZVwiLDIpLGQ6WShcIkRhdGVcIiwxKSxISDpZKFwiSG91cnNcIiwyKSxIOlkoXCJIb3Vyc1wiLDEpLGhoOlkoXCJIb3Vyc1wiLDIsLTEyKSxoOlkoXCJIb3Vyc1wiLDEsLTEyKSxtbTpZKFwiTWludXRlc1wiLDIpLG06WShcIk1pbnV0ZXNcIiwxKSxzczpZKFwiU2Vjb25kc1wiLDIpLHM6WShcIlNlY29uZHNcIiwxKSxzc3M6WShcIk1pbGxpc2Vjb25kc1wiLDMpLEVFRUU6c2IoXCJEYXlcIiksRUVFOnNiKFwiRGF5XCIsITApLFxuYTpmdW5jdGlvbihhLGMpe3JldHVybiAxMj5hLmdldEhvdXJzKCk/Yy5BTVBNU1swXTpjLkFNUE1TWzFdfSxaOmZ1bmN0aW9uKGEpe2E9LTEqYS5nZXRUaW1lem9uZU9mZnNldCgpO3JldHVybiBhPSgwPD1hP1wiK1wiOlwiXCIpKyhVYihNYXRoWzA8YT9cImZsb29yXCI6XCJjZWlsXCJdKGEvNjApLDIpK1ViKE1hdGguYWJzKGElNjApLDIpKX19LEllPS8oKD86W155TWRIaG1zYVpFJ10rKXwoPzonKD86W14nXXwnJykqJyl8KD86RSt8eSt8TSt8ZCt8SCt8aCt8bSt8cyt8YXxaKSkoLiopLyxIZT0vXlxcLT9cXGQrJC87S2MuJGluamVjdD1bXCIkbG9jYWxlXCJdO3ZhciBGZT0kKEwpLEdlPSQoSGEpO01jLiRpbmplY3Q9W1wiJHBhcnNlXCJdO3ZhciBjZD0kKHtyZXN0cmljdDpcIkVcIixjb21waWxlOmZ1bmN0aW9uKGEsYyl7OD49UyYmKGMuaHJlZnx8Yy5uYW1lfHxjLiRzZXQoXCJocmVmXCIsXCJcIiksYS5hcHBlbmQoVi5jcmVhdGVDb21tZW50KFwiSUUgZml4XCIpKSk7aWYoIWMuaHJlZiYmIWMueGxpbmtIcmVmJiYhYy5uYW1lKXJldHVybiBmdW5jdGlvbihhLFxuYyl7dmFyIGc9XCJbb2JqZWN0IFNWR0FuaW1hdGVkU3RyaW5nXVwiPT09d2EuY2FsbChjLnByb3AoXCJocmVmXCIpKT9cInhsaW5rOmhyZWZcIjpcImhyZWZcIjtjLm9uKFwiY2xpY2tcIixmdW5jdGlvbihhKXtjLmF0dHIoZyl8fGEucHJldmVudERlZmF1bHQoKX0pfX19KSxFYj17fTtxKG1iLGZ1bmN0aW9uKGEsYyl7aWYoXCJtdWx0aXBsZVwiIT1hKXt2YXIgZD1tYShcIm5nLVwiK2MpO0ViW2RdPWZ1bmN0aW9uKCl7cmV0dXJue3ByaW9yaXR5OjEwMCxsaW5rOmZ1bmN0aW9uKGEsZyxmKXthLiR3YXRjaChmW2RdLGZ1bmN0aW9uKGEpe2YuJHNldChjLCEhYSl9KX19fX19KTtxKFtcInNyY1wiLFwic3Jjc2V0XCIsXCJocmVmXCJdLGZ1bmN0aW9uKGEpe3ZhciBjPW1hKFwibmctXCIrYSk7RWJbY109ZnVuY3Rpb24oKXtyZXR1cm57cHJpb3JpdHk6OTksbGluazpmdW5jdGlvbihkLGUsZyl7dmFyIGY9YSxrPWE7XCJocmVmXCI9PT1hJiZcIltvYmplY3QgU1ZHQW5pbWF0ZWRTdHJpbmddXCI9PT13YS5jYWxsKGUucHJvcChcImhyZWZcIikpJiZcbihrPVwieGxpbmtIcmVmXCIsZy4kYXR0cltrXT1cInhsaW5rOmhyZWZcIixmPW51bGwpO2cuJG9ic2VydmUoYyxmdW5jdGlvbihhKXthJiYoZy4kc2V0KGssYSksUyYmZiYmZS5wcm9wKGYsZ1trXSkpfSl9fX19KTt2YXIgdmI9eyRhZGRDb250cm9sOnksJHJlbW92ZUNvbnRyb2w6eSwkc2V0VmFsaWRpdHk6eSwkc2V0RGlydHk6eSwkc2V0UHJpc3RpbmU6eX07UGMuJGluamVjdD1bXCIkZWxlbWVudFwiLFwiJGF0dHJzXCIsXCIkc2NvcGVcIixcIiRhbmltYXRlXCJdO3ZhciBRYz1mdW5jdGlvbihhKXtyZXR1cm5bXCIkdGltZW91dFwiLGZ1bmN0aW9uKGMpe3JldHVybntuYW1lOlwiZm9ybVwiLHJlc3RyaWN0OmE/XCJFQUNcIjpcIkVcIixjb250cm9sbGVyOlBjLGNvbXBpbGU6ZnVuY3Rpb24oKXtyZXR1cm57cHJlOmZ1bmN0aW9uKGEsZSxnLGYpe2lmKCFnLmFjdGlvbil7dmFyIGs9ZnVuY3Rpb24oYSl7YS5wcmV2ZW50RGVmYXVsdD9hLnByZXZlbnREZWZhdWx0KCk6YS5yZXR1cm5WYWx1ZT0hMX07cGIoZVswXSxcInN1Ym1pdFwiLFxuayk7ZS5vbihcIiRkZXN0cm95XCIsZnVuY3Rpb24oKXtjKGZ1bmN0aW9uKCl7V2EoZVswXSxcInN1Ym1pdFwiLGspfSwwLCExKX0pfXZhciBtPWUucGFyZW50KCkuY29udHJvbGxlcihcImZvcm1cIiksaD1nLm5hbWV8fGcubmdGb3JtO2gmJnJiKGEsaCxmLGgpO2lmKG0pZS5vbihcIiRkZXN0cm95XCIsZnVuY3Rpb24oKXttLiRyZW1vdmVDb250cm9sKGYpO2gmJnJiKGEsaCxzLGgpO0ooZix2Yil9KX19fX19XX0sZGQ9UWMoKSxxZD1RYyghMCksUGU9L14oZnRwfGh0dHB8aHR0cHMpOlxcL1xcLyhcXHcrOnswLDF9XFx3KkApPyhcXFMrKSg6WzAtOV0rKT8oXFwvfFxcLyhbXFx3IyE6Lj8rPSYlQCFcXC1cXC9dKSk/JC8sUWU9L15bYS16MC05ISMkJSYnKisvPT9eX2B7fH1+Li1dK0BbYS16MC05LV0rKFxcLlthLXowLTktXSspKiQvaSxSZT0vXlxccyooXFwtfFxcKyk/KFxcZCt8KFxcZCooXFwuXFxkKikpKVxccyokLyxSYz17dGV4dDp4YixudW1iZXI6ZnVuY3Rpb24oYSxjLGQsZSxnLGYpe3hiKGEsYyxkLGUsZyxmKTtlLiRwYXJzZXJzLnB1c2goZnVuY3Rpb24oYSl7dmFyIGM9XG5lLiRpc0VtcHR5KGEpO2lmKGN8fFJlLnRlc3QoYSkpcmV0dXJuIGUuJHNldFZhbGlkaXR5KFwibnVtYmVyXCIsITApLFwiXCI9PT1hP251bGw6Yz9hOnBhcnNlRmxvYXQoYSk7ZS4kc2V0VmFsaWRpdHkoXCJudW1iZXJcIiwhMSk7cmV0dXJuIHN9KTtLZShlLFwibnVtYmVyXCIsYyk7ZS4kZm9ybWF0dGVycy5wdXNoKGZ1bmN0aW9uKGEpe3JldHVybiBlLiRpc0VtcHR5KGEpP1wiXCI6XCJcIithfSk7ZC5taW4mJihhPWZ1bmN0aW9uKGEpe3ZhciBjPXBhcnNlRmxvYXQoZC5taW4pO3JldHVybiBxYShlLFwibWluXCIsZS4kaXNFbXB0eShhKXx8YT49YyxhKX0sZS4kcGFyc2Vycy5wdXNoKGEpLGUuJGZvcm1hdHRlcnMucHVzaChhKSk7ZC5tYXgmJihhPWZ1bmN0aW9uKGEpe3ZhciBjPXBhcnNlRmxvYXQoZC5tYXgpO3JldHVybiBxYShlLFwibWF4XCIsZS4kaXNFbXB0eShhKXx8YTw9YyxhKX0sZS4kcGFyc2Vycy5wdXNoKGEpLGUuJGZvcm1hdHRlcnMucHVzaChhKSk7ZS4kZm9ybWF0dGVycy5wdXNoKGZ1bmN0aW9uKGEpe3JldHVybiBxYShlLFxuXCJudW1iZXJcIixlLiRpc0VtcHR5KGEpfHx5YihhKSxhKX0pfSx1cmw6ZnVuY3Rpb24oYSxjLGQsZSxnLGYpe3hiKGEsYyxkLGUsZyxmKTthPWZ1bmN0aW9uKGEpe3JldHVybiBxYShlLFwidXJsXCIsZS4kaXNFbXB0eShhKXx8UGUudGVzdChhKSxhKX07ZS4kZm9ybWF0dGVycy5wdXNoKGEpO2UuJHBhcnNlcnMucHVzaChhKX0sZW1haWw6ZnVuY3Rpb24oYSxjLGQsZSxnLGYpe3hiKGEsYyxkLGUsZyxmKTthPWZ1bmN0aW9uKGEpe3JldHVybiBxYShlLFwiZW1haWxcIixlLiRpc0VtcHR5KGEpfHxRZS50ZXN0KGEpLGEpfTtlLiRmb3JtYXR0ZXJzLnB1c2goYSk7ZS4kcGFyc2Vycy5wdXNoKGEpfSxyYWRpbzpmdW5jdGlvbihhLGMsZCxlKXtEKGQubmFtZSkmJmMuYXR0cihcIm5hbWVcIixlYigpKTtjLm9uKFwiY2xpY2tcIixmdW5jdGlvbigpe2NbMF0uY2hlY2tlZCYmYS4kYXBwbHkoZnVuY3Rpb24oKXtlLiRzZXRWaWV3VmFsdWUoZC52YWx1ZSl9KX0pO2UuJHJlbmRlcj1mdW5jdGlvbigpe2NbMF0uY2hlY2tlZD1cbmQudmFsdWU9PWUuJHZpZXdWYWx1ZX07ZC4kb2JzZXJ2ZShcInZhbHVlXCIsZS4kcmVuZGVyKX0sY2hlY2tib3g6ZnVuY3Rpb24oYSxjLGQsZSl7dmFyIGc9ZC5uZ1RydWVWYWx1ZSxmPWQubmdGYWxzZVZhbHVlO0MoZyl8fChnPSEwKTtDKGYpfHwoZj0hMSk7Yy5vbihcImNsaWNrXCIsZnVuY3Rpb24oKXthLiRhcHBseShmdW5jdGlvbigpe2UuJHNldFZpZXdWYWx1ZShjWzBdLmNoZWNrZWQpfSl9KTtlLiRyZW5kZXI9ZnVuY3Rpb24oKXtjWzBdLmNoZWNrZWQ9ZS4kdmlld1ZhbHVlfTtlLiRpc0VtcHR5PWZ1bmN0aW9uKGEpe3JldHVybiBhIT09Z307ZS4kZm9ybWF0dGVycy5wdXNoKGZ1bmN0aW9uKGEpe3JldHVybiBhPT09Z30pO2UuJHBhcnNlcnMucHVzaChmdW5jdGlvbihhKXtyZXR1cm4gYT9nOmZ9KX0saGlkZGVuOnksYnV0dG9uOnksc3VibWl0OnkscmVzZXQ6eSxmaWxlOnl9LGhjPVtcIiRicm93c2VyXCIsXCIkc25pZmZlclwiLGZ1bmN0aW9uKGEsYyl7cmV0dXJue3Jlc3RyaWN0OlwiRVwiLHJlcXVpcmU6XCI/bmdNb2RlbFwiLFxubGluazpmdW5jdGlvbihkLGUsZyxmKXtmJiYoUmNbTChnLnR5cGUpXXx8UmMudGV4dCkoZCxlLGcsZixjLGEpfX19XSx1Yj1cIm5nLXZhbGlkXCIsdGI9XCJuZy1pbnZhbGlkXCIsTWE9XCJuZy1wcmlzdGluZVwiLHdiPVwibmctZGlydHlcIixTZT1bXCIkc2NvcGVcIixcIiRleGNlcHRpb25IYW5kbGVyXCIsXCIkYXR0cnNcIixcIiRlbGVtZW50XCIsXCIkcGFyc2VcIixcIiRhbmltYXRlXCIsZnVuY3Rpb24oYSxjLGQsZSxnLGYpe2Z1bmN0aW9uIGsoYSxjKXtjPWM/XCItXCIraGIoYyxcIi1cIik6XCJcIjtmLnJlbW92ZUNsYXNzKGUsKGE/dGI6dWIpK2MpO2YuYWRkQ2xhc3MoZSwoYT91Yjp0YikrYyl9dGhpcy4kbW9kZWxWYWx1ZT10aGlzLiR2aWV3VmFsdWU9TnVtYmVyLk5hTjt0aGlzLiRwYXJzZXJzPVtdO3RoaXMuJGZvcm1hdHRlcnM9W107dGhpcy4kdmlld0NoYW5nZUxpc3RlbmVycz1bXTt0aGlzLiRwcmlzdGluZT0hMDt0aGlzLiRkaXJ0eT0hMTt0aGlzLiR2YWxpZD0hMDt0aGlzLiRpbnZhbGlkPSExO3RoaXMuJG5hbWU9XG5kLm5hbWU7dmFyIG09ZyhkLm5nTW9kZWwpLGg9bS5hc3NpZ247aWYoIWgpdGhyb3cgdChcIm5nTW9kZWxcIikoXCJub25hc3NpZ25cIixkLm5nTW9kZWwsZ2EoZSkpO3RoaXMuJHJlbmRlcj15O3RoaXMuJGlzRW1wdHk9ZnVuY3Rpb24oYSl7cmV0dXJuIEQoYSl8fFwiXCI9PT1hfHxudWxsPT09YXx8YSE9PWF9O3ZhciBsPWUuaW5oZXJpdGVkRGF0YShcIiRmb3JtQ29udHJvbGxlclwiKXx8dmIsbj0wLHA9dGhpcy4kZXJyb3I9e307ZS5hZGRDbGFzcyhNYSk7ayghMCk7dGhpcy4kc2V0VmFsaWRpdHk9ZnVuY3Rpb24oYSxjKXtwW2FdIT09IWMmJihjPyhwW2FdJiZuLS0sbnx8KGsoITApLHRoaXMuJHZhbGlkPSEwLHRoaXMuJGludmFsaWQ9ITEpKTooayghMSksdGhpcy4kaW52YWxpZD0hMCx0aGlzLiR2YWxpZD0hMSxuKyspLHBbYV09IWMsayhjLGEpLGwuJHNldFZhbGlkaXR5KGEsYyx0aGlzKSl9O3RoaXMuJHNldFByaXN0aW5lPWZ1bmN0aW9uKCl7dGhpcy4kZGlydHk9ITE7dGhpcy4kcHJpc3RpbmU9XG4hMDtmLnJlbW92ZUNsYXNzKGUsd2IpO2YuYWRkQ2xhc3MoZSxNYSl9O3RoaXMuJHNldFZpZXdWYWx1ZT1mdW5jdGlvbihkKXt0aGlzLiR2aWV3VmFsdWU9ZDt0aGlzLiRwcmlzdGluZSYmKHRoaXMuJGRpcnR5PSEwLHRoaXMuJHByaXN0aW5lPSExLGYucmVtb3ZlQ2xhc3MoZSxNYSksZi5hZGRDbGFzcyhlLHdiKSxsLiRzZXREaXJ0eSgpKTtxKHRoaXMuJHBhcnNlcnMsZnVuY3Rpb24oYSl7ZD1hKGQpfSk7dGhpcy4kbW9kZWxWYWx1ZSE9PWQmJih0aGlzLiRtb2RlbFZhbHVlPWQsaChhLGQpLHEodGhpcy4kdmlld0NoYW5nZUxpc3RlbmVycyxmdW5jdGlvbihhKXt0cnl7YSgpfWNhdGNoKGQpe2MoZCl9fSkpfTt2YXIgcj10aGlzO2EuJHdhdGNoKGZ1bmN0aW9uKCl7dmFyIGM9bShhKTtpZihyLiRtb2RlbFZhbHVlIT09Yyl7dmFyIGQ9ci4kZm9ybWF0dGVycyxlPWQubGVuZ3RoO2ZvcihyLiRtb2RlbFZhbHVlPWM7ZS0tOyljPWRbZV0oYyk7ci4kdmlld1ZhbHVlIT09YyYmKHIuJHZpZXdWYWx1ZT1cbmMsci4kcmVuZGVyKCkpfXJldHVybiBjfSl9XSxGZD1mdW5jdGlvbigpe3JldHVybntyZXF1aXJlOltcIm5nTW9kZWxcIixcIl4/Zm9ybVwiXSxjb250cm9sbGVyOlNlLGxpbms6ZnVuY3Rpb24oYSxjLGQsZSl7dmFyIGc9ZVswXSxmPWVbMV18fHZiO2YuJGFkZENvbnRyb2woZyk7YS4kb24oXCIkZGVzdHJveVwiLGZ1bmN0aW9uKCl7Zi4kcmVtb3ZlQ29udHJvbChnKX0pfX19LEhkPSQoe3JlcXVpcmU6XCJuZ01vZGVsXCIsbGluazpmdW5jdGlvbihhLGMsZCxlKXtlLiR2aWV3Q2hhbmdlTGlzdGVuZXJzLnB1c2goZnVuY3Rpb24oKXthLiRldmFsKGQubmdDaGFuZ2UpfSl9fSksaWM9ZnVuY3Rpb24oKXtyZXR1cm57cmVxdWlyZTpcIj9uZ01vZGVsXCIsbGluazpmdW5jdGlvbihhLGMsZCxlKXtpZihlKXtkLnJlcXVpcmVkPSEwO3ZhciBnPWZ1bmN0aW9uKGEpe2lmKGQucmVxdWlyZWQmJmUuJGlzRW1wdHkoYSkpZS4kc2V0VmFsaWRpdHkoXCJyZXF1aXJlZFwiLCExKTtlbHNlIHJldHVybiBlLiRzZXRWYWxpZGl0eShcInJlcXVpcmVkXCIsXG4hMCksYX07ZS4kZm9ybWF0dGVycy5wdXNoKGcpO2UuJHBhcnNlcnMudW5zaGlmdChnKTtkLiRvYnNlcnZlKFwicmVxdWlyZWRcIixmdW5jdGlvbigpe2coZS4kdmlld1ZhbHVlKX0pfX19fSxHZD1mdW5jdGlvbigpe3JldHVybntyZXF1aXJlOlwibmdNb2RlbFwiLGxpbms6ZnVuY3Rpb24oYSxjLGQsZSl7dmFyIGc9KGE9L1xcLyguKilcXC8vLmV4ZWMoZC5uZ0xpc3QpKSYmUmVnRXhwKGFbMV0pfHxkLm5nTGlzdHx8XCIsXCI7ZS4kcGFyc2Vycy5wdXNoKGZ1bmN0aW9uKGEpe2lmKCFEKGEpKXt2YXIgYz1bXTthJiZxKGEuc3BsaXQoZyksZnVuY3Rpb24oYSl7YSYmYy5wdXNoKGFhKGEpKX0pO3JldHVybiBjfX0pO2UuJGZvcm1hdHRlcnMucHVzaChmdW5jdGlvbihhKXtyZXR1cm4gTyhhKT9hLmpvaW4oXCIsIFwiKTpzfSk7ZS4kaXNFbXB0eT1mdW5jdGlvbihhKXtyZXR1cm4hYXx8IWEubGVuZ3RofX19fSxUZT0vXih0cnVlfGZhbHNlfFxcZCspJC8sSWQ9ZnVuY3Rpb24oKXtyZXR1cm57cHJpb3JpdHk6MTAwLFxuY29tcGlsZTpmdW5jdGlvbihhLGMpe3JldHVybiBUZS50ZXN0KGMubmdWYWx1ZSk/ZnVuY3Rpb24oYSxjLGcpe2cuJHNldChcInZhbHVlXCIsYS4kZXZhbChnLm5nVmFsdWUpKX06ZnVuY3Rpb24oYSxjLGcpe2EuJHdhdGNoKGcubmdWYWx1ZSxmdW5jdGlvbihhKXtnLiRzZXQoXCJ2YWx1ZVwiLGEpfSl9fX19LGlkPXZhKHtjb21waWxlOmZ1bmN0aW9uKGEpe2EuYWRkQ2xhc3MoXCJuZy1iaW5kaW5nXCIpO3JldHVybiBmdW5jdGlvbihhLGQsZSl7ZC5kYXRhKFwiJGJpbmRpbmdcIixlLm5nQmluZCk7YS4kd2F0Y2goZS5uZ0JpbmQsZnVuY3Rpb24oYSl7ZC50ZXh0KGE9PXM/XCJcIjphKX0pfX19KSxrZD1bXCIkaW50ZXJwb2xhdGVcIixmdW5jdGlvbihhKXtyZXR1cm4gZnVuY3Rpb24oYyxkLGUpe2M9YShkLmF0dHIoZS4kYXR0ci5uZ0JpbmRUZW1wbGF0ZSkpO2QuYWRkQ2xhc3MoXCJuZy1iaW5kaW5nXCIpLmRhdGEoXCIkYmluZGluZ1wiLGMpO2UuJG9ic2VydmUoXCJuZ0JpbmRUZW1wbGF0ZVwiLGZ1bmN0aW9uKGEpe2QudGV4dChhKX0pfX1dLFxuamQ9W1wiJHNjZVwiLFwiJHBhcnNlXCIsZnVuY3Rpb24oYSxjKXtyZXR1cm4gZnVuY3Rpb24oZCxlLGcpe2UuYWRkQ2xhc3MoXCJuZy1iaW5kaW5nXCIpLmRhdGEoXCIkYmluZGluZ1wiLGcubmdCaW5kSHRtbCk7dmFyIGY9YyhnLm5nQmluZEh0bWwpO2QuJHdhdGNoKGZ1bmN0aW9uKCl7cmV0dXJuKGYoZCl8fFwiXCIpLnRvU3RyaW5nKCl9LGZ1bmN0aW9uKGMpe2UuaHRtbChhLmdldFRydXN0ZWRIdG1sKGYoZCkpfHxcIlwiKX0pfX1dLGxkPVZiKFwiXCIsITApLG5kPVZiKFwiT2RkXCIsMCksbWQ9VmIoXCJFdmVuXCIsMSksb2Q9dmEoe2NvbXBpbGU6ZnVuY3Rpb24oYSxjKXtjLiRzZXQoXCJuZ0Nsb2FrXCIscyk7YS5yZW1vdmVDbGFzcyhcIm5nLWNsb2FrXCIpfX0pLHBkPVtmdW5jdGlvbigpe3JldHVybntzY29wZTohMCxjb250cm9sbGVyOlwiQFwiLHByaW9yaXR5OjUwMH19XSxqYz17fTtxKFwiY2xpY2sgZGJsY2xpY2sgbW91c2Vkb3duIG1vdXNldXAgbW91c2VvdmVyIG1vdXNlb3V0IG1vdXNlbW92ZSBtb3VzZWVudGVyIG1vdXNlbGVhdmUga2V5ZG93biBrZXl1cCBrZXlwcmVzcyBzdWJtaXQgZm9jdXMgYmx1ciBjb3B5IGN1dCBwYXN0ZVwiLnNwbGl0KFwiIFwiKSxcbmZ1bmN0aW9uKGEpe3ZhciBjPW1hKFwibmctXCIrYSk7amNbY109W1wiJHBhcnNlXCIsZnVuY3Rpb24oZCl7cmV0dXJue2NvbXBpbGU6ZnVuY3Rpb24oZSxnKXt2YXIgZj1kKGdbY10pO3JldHVybiBmdW5jdGlvbihjLGQpe2Qub24oTChhKSxmdW5jdGlvbihhKXtjLiRhcHBseShmdW5jdGlvbigpe2YoYyx7JGV2ZW50OmF9KX0pfSl9fX19XX0pO3ZhciBzZD1bXCIkYW5pbWF0ZVwiLGZ1bmN0aW9uKGEpe3JldHVybnt0cmFuc2NsdWRlOlwiZWxlbWVudFwiLHByaW9yaXR5OjYwMCx0ZXJtaW5hbDohMCxyZXN0cmljdDpcIkFcIiwkJHRsYjohMCxsaW5rOmZ1bmN0aW9uKGMsZCxlLGcsZil7dmFyIGssbSxoO2MuJHdhdGNoKGUubmdJZixmdW5jdGlvbihnKXtSYShnKT9tfHwobT1jLiRuZXcoKSxmKG0sZnVuY3Rpb24oYyl7Y1tjLmxlbmd0aCsrXT1WLmNyZWF0ZUNvbW1lbnQoXCIgZW5kIG5nSWY6IFwiK2UubmdJZitcIiBcIik7az17Y2xvbmU6Y307YS5lbnRlcihjLGQucGFyZW50KCksZCl9KSk6KGgmJihoLnJlbW92ZSgpLFxuaD1udWxsKSxtJiYobS4kZGVzdHJveSgpLG09bnVsbCksayYmKGg9RGIoay5jbG9uZSksYS5sZWF2ZShoLGZ1bmN0aW9uKCl7aD1udWxsfSksaz1udWxsKSl9KX19fV0sdGQ9W1wiJGh0dHBcIixcIiR0ZW1wbGF0ZUNhY2hlXCIsXCIkYW5jaG9yU2Nyb2xsXCIsXCIkYW5pbWF0ZVwiLFwiJHNjZVwiLGZ1bmN0aW9uKGEsYyxkLGUsZyl7cmV0dXJue3Jlc3RyaWN0OlwiRUNBXCIscHJpb3JpdHk6NDAwLHRlcm1pbmFsOiEwLHRyYW5zY2x1ZGU6XCJlbGVtZW50XCIsY29udHJvbGxlcjpTYS5ub29wLGNvbXBpbGU6ZnVuY3Rpb24oZixrKXt2YXIgbT1rLm5nSW5jbHVkZXx8ay5zcmMsaD1rLm9ubG9hZHx8XCJcIixsPWsuYXV0b3Njcm9sbDtyZXR1cm4gZnVuY3Rpb24oZixrLHIscSxJKXt2YXIgcz0wLHUsdyxGLHo9ZnVuY3Rpb24oKXt3JiYody5yZW1vdmUoKSx3PW51bGwpO3UmJih1LiRkZXN0cm95KCksdT1udWxsKTtGJiYoZS5sZWF2ZShGLGZ1bmN0aW9uKCl7dz1udWxsfSksdz1GLEY9bnVsbCl9O2YuJHdhdGNoKGcucGFyc2VBc1Jlc291cmNlVXJsKG0pLFxuZnVuY3Rpb24oZyl7dmFyIG09ZnVuY3Rpb24oKXshQihsKXx8bCYmIWYuJGV2YWwobCl8fGQoKX0scj0rK3M7Zz8oYS5nZXQoZyx7Y2FjaGU6Y30pLnN1Y2Nlc3MoZnVuY3Rpb24oYSl7aWYocj09PXMpe3ZhciBjPWYuJG5ldygpO3EudGVtcGxhdGU9YTthPUkoYyxmdW5jdGlvbihhKXt6KCk7ZS5lbnRlcihhLG51bGwsayxtKX0pO3U9YztGPWE7dS4kZW1pdChcIiRpbmNsdWRlQ29udGVudExvYWRlZFwiKTtmLiRldmFsKGgpfX0pLmVycm9yKGZ1bmN0aW9uKCl7cj09PXMmJnooKX0pLGYuJGVtaXQoXCIkaW5jbHVkZUNvbnRlbnRSZXF1ZXN0ZWRcIikpOih6KCkscS50ZW1wbGF0ZT1udWxsKX0pfX19fV0sSmQ9W1wiJGNvbXBpbGVcIixmdW5jdGlvbihhKXtyZXR1cm57cmVzdHJpY3Q6XCJFQ0FcIixwcmlvcml0eTotNDAwLHJlcXVpcmU6XCJuZ0luY2x1ZGVcIixsaW5rOmZ1bmN0aW9uKGMsZCxlLGcpe2QuaHRtbChnLnRlbXBsYXRlKTthKGQuY29udGVudHMoKSkoYyl9fX1dLHVkPXZhKHtwcmlvcml0eTo0NTAsXG5jb21waWxlOmZ1bmN0aW9uKCl7cmV0dXJue3ByZTpmdW5jdGlvbihhLGMsZCl7YS4kZXZhbChkLm5nSW5pdCl9fX19KSx2ZD12YSh7dGVybWluYWw6ITAscHJpb3JpdHk6MUUzfSksd2Q9W1wiJGxvY2FsZVwiLFwiJGludGVycG9sYXRlXCIsZnVuY3Rpb24oYSxjKXt2YXIgZD0ve30vZztyZXR1cm57cmVzdHJpY3Q6XCJFQVwiLGxpbms6ZnVuY3Rpb24oZSxnLGYpe3ZhciBrPWYuY291bnQsbT1mLiRhdHRyLndoZW4mJmcuYXR0cihmLiRhdHRyLndoZW4pLGg9Zi5vZmZzZXR8fDAsbD1lLiRldmFsKG0pfHx7fSxuPXt9LHA9Yy5zdGFydFN5bWJvbCgpLHI9Yy5lbmRTeW1ib2woKSxzPS9ed2hlbihNaW51cyk/KC4rKSQvO3EoZixmdW5jdGlvbihhLGMpe3MudGVzdChjKSYmKGxbTChjLnJlcGxhY2UoXCJ3aGVuXCIsXCJcIikucmVwbGFjZShcIk1pbnVzXCIsXCItXCIpKV09Zy5hdHRyKGYuJGF0dHJbY10pKX0pO3EobCxmdW5jdGlvbihhLGUpe25bZV09YyhhLnJlcGxhY2UoZCxwK2srXCItXCIraCtyKSl9KTtlLiR3YXRjaChmdW5jdGlvbigpe3ZhciBjPVxucGFyc2VGbG9hdChlLiRldmFsKGspKTtpZihpc05hTihjKSlyZXR1cm5cIlwiO2MgaW4gbHx8KGM9YS5wbHVyYWxDYXQoYy1oKSk7cmV0dXJuIG5bY10oZSxnLCEwKX0sZnVuY3Rpb24oYSl7Zy50ZXh0KGEpfSl9fX1dLHhkPVtcIiRwYXJzZVwiLFwiJGFuaW1hdGVcIixmdW5jdGlvbihhLGMpe3ZhciBkPXQoXCJuZ1JlcGVhdFwiKTtyZXR1cm57dHJhbnNjbHVkZTpcImVsZW1lbnRcIixwcmlvcml0eToxRTMsdGVybWluYWw6ITAsJCR0bGI6ITAsbGluazpmdW5jdGlvbihlLGcsZixrLG0pe3ZhciBoPWYubmdSZXBlYXQsbD1oLm1hdGNoKC9eXFxzKihbXFxzXFxTXSs/KVxccytpblxccysoW1xcc1xcU10rPykoPzpcXHMrdHJhY2tcXHMrYnlcXHMrKFtcXHNcXFNdKz8pKT9cXHMqJC8pLG4scCxyLHMsSSx4LHU9eyRpZDpKYX07aWYoIWwpdGhyb3cgZChcImlleHBcIixoKTtmPWxbMV07az1sWzJdOyhsPWxbM10pPyhuPWEobCkscD1mdW5jdGlvbihhLGMsZCl7eCYmKHVbeF09YSk7dVtJXT1jO3UuJGluZGV4PWQ7cmV0dXJuIG4oZSxcbnUpfSk6KHI9ZnVuY3Rpb24oYSxjKXtyZXR1cm4gSmEoYyl9LHM9ZnVuY3Rpb24oYSl7cmV0dXJuIGF9KTtsPWYubWF0Y2goL14oPzooW1xcJFxcd10rKXxcXCgoW1xcJFxcd10rKVxccyosXFxzKihbXFwkXFx3XSspXFwpKSQvKTtpZighbCl0aHJvdyBkKFwiaWlkZXhwXCIsZik7ST1sWzNdfHxsWzFdO3g9bFsyXTt2YXIgQj17fTtlLiR3YXRjaENvbGxlY3Rpb24oayxmdW5jdGlvbihhKXt2YXIgZixrLGw9Z1swXSxuLHU9e30sRSxBLEgsdCxDLHksRD1bXTtpZihkYihhKSlDPWEsbj1wfHxyO2Vsc2V7bj1wfHxzO0M9W107Zm9yKEggaW4gYSlhLmhhc093blByb3BlcnR5KEgpJiZcIiRcIiE9SC5jaGFyQXQoMCkmJkMucHVzaChIKTtDLnNvcnQoKX1FPUMubGVuZ3RoO2s9RC5sZW5ndGg9Qy5sZW5ndGg7Zm9yKGY9MDtmPGs7ZisrKWlmKEg9YT09PUM/ZjpDW2ZdLHQ9YVtIXSx0PW4oSCx0LGYpLEFhKHQsXCJgdHJhY2sgYnlgIGlkXCIpLEIuaGFzT3duUHJvcGVydHkodCkpeT1CW3RdLGRlbGV0ZSBCW3RdLHVbdF09XG55LERbZl09eTtlbHNle2lmKHUuaGFzT3duUHJvcGVydHkodCkpdGhyb3cgcShELGZ1bmN0aW9uKGEpe2EmJmEuc2NvcGUmJihCW2EuaWRdPWEpfSksZChcImR1cGVzXCIsaCx0KTtEW2ZdPXtpZDp0fTt1W3RdPSExfWZvcihIIGluIEIpQi5oYXNPd25Qcm9wZXJ0eShIKSYmKHk9QltIXSxmPURiKHkuY2xvbmUpLGMubGVhdmUoZikscShmLGZ1bmN0aW9uKGEpe2EuJCROR19SRU1PVkVEPSEwfSkseS5zY29wZS4kZGVzdHJveSgpKTtmPTA7Zm9yKGs9Qy5sZW5ndGg7ZjxrO2YrKyl7SD1hPT09Qz9mOkNbZl07dD1hW0hdO3k9RFtmXTtEW2YtMV0mJihsPURbZi0xXS5jbG9uZVtEW2YtMV0uY2xvbmUubGVuZ3RoLTFdKTtpZih5LnNjb3BlKXtBPXkuc2NvcGU7bj1sO2RvIG49bi5uZXh0U2libGluZzt3aGlsZShuJiZuLiQkTkdfUkVNT1ZFRCk7eS5jbG9uZVswXSE9biYmYy5tb3ZlKERiKHkuY2xvbmUpLG51bGwsdyhsKSk7bD15LmNsb25lW3kuY2xvbmUubGVuZ3RoLTFdfWVsc2UgQT1lLiRuZXcoKTtcbkFbSV09dDt4JiYoQVt4XT1IKTtBLiRpbmRleD1mO0EuJGZpcnN0PTA9PT1mO0EuJGxhc3Q9Zj09PUUtMTtBLiRtaWRkbGU9IShBLiRmaXJzdHx8QS4kbGFzdCk7QS4kb2RkPSEoQS4kZXZlbj0wPT09KGYmMSkpO3kuc2NvcGV8fG0oQSxmdW5jdGlvbihhKXthW2EubGVuZ3RoKytdPVYuY3JlYXRlQ29tbWVudChcIiBlbmQgbmdSZXBlYXQ6IFwiK2grXCIgXCIpO2MuZW50ZXIoYSxudWxsLHcobCkpO2w9YTt5LnNjb3BlPUE7eS5jbG9uZT1hO3VbeS5pZF09eX0pfUI9dX0pfX19XSx5ZD1bXCIkYW5pbWF0ZVwiLGZ1bmN0aW9uKGEpe3JldHVybiBmdW5jdGlvbihjLGQsZSl7Yy4kd2F0Y2goZS5uZ1Nob3csZnVuY3Rpb24oYyl7YVtSYShjKT9cInJlbW92ZUNsYXNzXCI6XCJhZGRDbGFzc1wiXShkLFwibmctaGlkZVwiKX0pfX1dLHJkPVtcIiRhbmltYXRlXCIsZnVuY3Rpb24oYSl7cmV0dXJuIGZ1bmN0aW9uKGMsZCxlKXtjLiR3YXRjaChlLm5nSGlkZSxmdW5jdGlvbihjKXthW1JhKGMpP1wiYWRkQ2xhc3NcIjpcInJlbW92ZUNsYXNzXCJdKGQsXG5cIm5nLWhpZGVcIil9KX19XSx6ZD12YShmdW5jdGlvbihhLGMsZCl7YS4kd2F0Y2goZC5uZ1N0eWxlLGZ1bmN0aW9uKGEsZCl7ZCYmYSE9PWQmJnEoZCxmdW5jdGlvbihhLGQpe2MuY3NzKGQsXCJcIil9KTthJiZjLmNzcyhhKX0sITApfSksQWQ9W1wiJGFuaW1hdGVcIixmdW5jdGlvbihhKXtyZXR1cm57cmVzdHJpY3Q6XCJFQVwiLHJlcXVpcmU6XCJuZ1N3aXRjaFwiLGNvbnRyb2xsZXI6W1wiJHNjb3BlXCIsZnVuY3Rpb24oKXt0aGlzLmNhc2VzPXt9fV0sbGluazpmdW5jdGlvbihjLGQsZSxnKXt2YXIgZj1bXSxrPVtdLG09W10saD1bXTtjLiR3YXRjaChlLm5nU3dpdGNofHxlLm9uLGZ1bmN0aW9uKGQpe3ZhciBuLHA7bj0wO2ZvcihwPW0ubGVuZ3RoO248cDsrK24pbVtuXS5yZW1vdmUoKTtuPW0ubGVuZ3RoPTA7Zm9yKHA9aC5sZW5ndGg7bjxwOysrbil7dmFyIHI9a1tuXTtoW25dLiRkZXN0cm95KCk7bVtuXT1yO2EubGVhdmUocixmdW5jdGlvbigpe20uc3BsaWNlKG4sMSl9KX1rLmxlbmd0aD0wO2gubGVuZ3RoPVxuMDtpZihmPWcuY2FzZXNbXCIhXCIrZF18fGcuY2FzZXNbXCI/XCJdKWMuJGV2YWwoZS5jaGFuZ2UpLHEoZixmdW5jdGlvbihkKXt2YXIgZT1jLiRuZXcoKTtoLnB1c2goZSk7ZC50cmFuc2NsdWRlKGUsZnVuY3Rpb24oYyl7dmFyIGU9ZC5lbGVtZW50O2sucHVzaChjKTthLmVudGVyKGMsZS5wYXJlbnQoKSxlKX0pfSl9KX19fV0sQmQ9dmEoe3RyYW5zY2x1ZGU6XCJlbGVtZW50XCIscHJpb3JpdHk6ODAwLHJlcXVpcmU6XCJebmdTd2l0Y2hcIixsaW5rOmZ1bmN0aW9uKGEsYyxkLGUsZyl7ZS5jYXNlc1tcIiFcIitkLm5nU3dpdGNoV2hlbl09ZS5jYXNlc1tcIiFcIitkLm5nU3dpdGNoV2hlbl18fFtdO2UuY2FzZXNbXCIhXCIrZC5uZ1N3aXRjaFdoZW5dLnB1c2goe3RyYW5zY2x1ZGU6ZyxlbGVtZW50OmN9KX19KSxDZD12YSh7dHJhbnNjbHVkZTpcImVsZW1lbnRcIixwcmlvcml0eTo4MDAscmVxdWlyZTpcIl5uZ1N3aXRjaFwiLGxpbms6ZnVuY3Rpb24oYSxjLGQsZSxnKXtlLmNhc2VzW1wiP1wiXT1lLmNhc2VzW1wiP1wiXXx8XG5bXTtlLmNhc2VzW1wiP1wiXS5wdXNoKHt0cmFuc2NsdWRlOmcsZWxlbWVudDpjfSl9fSksRWQ9dmEoe2xpbms6ZnVuY3Rpb24oYSxjLGQsZSxnKXtpZighZyl0aHJvdyB0KFwibmdUcmFuc2NsdWRlXCIpKFwib3JwaGFuXCIsZ2EoYykpO2coZnVuY3Rpb24oYSl7Yy5lbXB0eSgpO2MuYXBwZW5kKGEpfSl9fSksZWQ9W1wiJHRlbXBsYXRlQ2FjaGVcIixmdW5jdGlvbihhKXtyZXR1cm57cmVzdHJpY3Q6XCJFXCIsdGVybWluYWw6ITAsY29tcGlsZTpmdW5jdGlvbihjLGQpe1widGV4dC9uZy10ZW1wbGF0ZVwiPT1kLnR5cGUmJmEucHV0KGQuaWQsY1swXS50ZXh0KX19fV0sVWU9dChcIm5nT3B0aW9uc1wiKSxEZD0kKHt0ZXJtaW5hbDohMH0pLGZkPVtcIiRjb21waWxlXCIsXCIkcGFyc2VcIixmdW5jdGlvbihhLGMpe3ZhciBkPS9eXFxzKihbXFxzXFxTXSs/KSg/Olxccythc1xccysoW1xcc1xcU10rPykpPyg/Olxccytncm91cFxccytieVxccysoW1xcc1xcU10rPykpP1xccytmb3JcXHMrKD86KFtcXCRcXHddW1xcJFxcd10qKXwoPzpcXChcXHMqKFtcXCRcXHddW1xcJFxcd10qKVxccyosXFxzKihbXFwkXFx3XVtcXCRcXHddKilcXHMqXFwpKSlcXHMraW5cXHMrKFtcXHNcXFNdKz8pKD86XFxzK3RyYWNrXFxzK2J5XFxzKyhbXFxzXFxTXSs/KSk/JC8sXG5lPXskc2V0Vmlld1ZhbHVlOnl9O3JldHVybntyZXN0cmljdDpcIkVcIixyZXF1aXJlOltcInNlbGVjdFwiLFwiP25nTW9kZWxcIl0sY29udHJvbGxlcjpbXCIkZWxlbWVudFwiLFwiJHNjb3BlXCIsXCIkYXR0cnNcIixmdW5jdGlvbihhLGMsZCl7dmFyIG09dGhpcyxoPXt9LGw9ZSxuO20uZGF0YWJvdW5kPWQubmdNb2RlbDttLmluaXQ9ZnVuY3Rpb24oYSxjLGQpe2w9YTtuPWR9O20uYWRkT3B0aW9uPWZ1bmN0aW9uKGMpe0FhKGMsJ1wib3B0aW9uIHZhbHVlXCInKTtoW2NdPSEwO2wuJHZpZXdWYWx1ZT09YyYmKGEudmFsKGMpLG4ucGFyZW50KCkmJm4ucmVtb3ZlKCkpfTttLnJlbW92ZU9wdGlvbj1mdW5jdGlvbihhKXt0aGlzLmhhc09wdGlvbihhKSYmKGRlbGV0ZSBoW2FdLGwuJHZpZXdWYWx1ZT09YSYmdGhpcy5yZW5kZXJVbmtub3duT3B0aW9uKGEpKX07bS5yZW5kZXJVbmtub3duT3B0aW9uPWZ1bmN0aW9uKGMpe2M9XCI/IFwiK0phKGMpK1wiID9cIjtuLnZhbChjKTthLnByZXBlbmQobik7YS52YWwoYyk7bi5wcm9wKFwic2VsZWN0ZWRcIixcbiEwKX07bS5oYXNPcHRpb249ZnVuY3Rpb24oYSl7cmV0dXJuIGguaGFzT3duUHJvcGVydHkoYSl9O2MuJG9uKFwiJGRlc3Ryb3lcIixmdW5jdGlvbigpe20ucmVuZGVyVW5rbm93bk9wdGlvbj15fSl9XSxsaW5rOmZ1bmN0aW9uKGUsZixrLG0pe2Z1bmN0aW9uIGgoYSxjLGQsZSl7ZC4kcmVuZGVyPWZ1bmN0aW9uKCl7dmFyIGE9ZC4kdmlld1ZhbHVlO2UuaGFzT3B0aW9uKGEpPyhGLnBhcmVudCgpJiZGLnJlbW92ZSgpLGMudmFsKGEpLFwiXCI9PT1hJiZ4LnByb3AoXCJzZWxlY3RlZFwiLCEwKSk6RChhKSYmeD9jLnZhbChcIlwiKTplLnJlbmRlclVua25vd25PcHRpb24oYSl9O2Mub24oXCJjaGFuZ2VcIixmdW5jdGlvbigpe2EuJGFwcGx5KGZ1bmN0aW9uKCl7Ri5wYXJlbnQoKSYmRi5yZW1vdmUoKTtkLiRzZXRWaWV3VmFsdWUoYy52YWwoKSl9KX0pfWZ1bmN0aW9uIGwoYSxjLGQpe3ZhciBlO2QuJHJlbmRlcj1mdW5jdGlvbigpe3ZhciBhPW5ldyBZYShkLiR2aWV3VmFsdWUpO3EoYy5maW5kKFwib3B0aW9uXCIpLFxuZnVuY3Rpb24oYyl7Yy5zZWxlY3RlZD1CKGEuZ2V0KGMudmFsdWUpKX0pfTthLiR3YXRjaChmdW5jdGlvbigpe3hhKGUsZC4kdmlld1ZhbHVlKXx8KGU9a2EoZC4kdmlld1ZhbHVlKSxkLiRyZW5kZXIoKSl9KTtjLm9uKFwiY2hhbmdlXCIsZnVuY3Rpb24oKXthLiRhcHBseShmdW5jdGlvbigpe3ZhciBhPVtdO3EoYy5maW5kKFwib3B0aW9uXCIpLGZ1bmN0aW9uKGMpe2Muc2VsZWN0ZWQmJmEucHVzaChjLnZhbHVlKX0pO2QuJHNldFZpZXdWYWx1ZShhKX0pfSl9ZnVuY3Rpb24gbihlLGYsZyl7ZnVuY3Rpb24gaygpe3ZhciBhPXtcIlwiOltdfSxjPVtcIlwiXSxkLGgscyx0LHY7dD1nLiRtb2RlbFZhbHVlO3Y9dyhlKXx8W107dmFyIEQ9bj9XYih2KTp2LEYsSyxBO0s9e307cz0hMTt2YXIgRSxKO2lmKHIpaWYoeCYmTyh0KSlmb3Iocz1uZXcgWWEoW10pLEE9MDtBPHQubGVuZ3RoO0ErKylLW21dPXRbQV0scy5wdXQoeChlLEspLHRbQV0pO2Vsc2Ugcz1uZXcgWWEodCk7Zm9yKEE9MDtGPUQubGVuZ3RoLFxuQTxGO0ErKyl7aD1BO2lmKG4pe2g9RFtBXTtpZihcIiRcIj09PWguY2hhckF0KDApKWNvbnRpbnVlO0tbbl09aH1LW21dPXZbaF07ZD1wKGUsSyl8fFwiXCI7KGg9YVtkXSl8fChoPWFbZF09W10sYy5wdXNoKGQpKTtyP2Q9QihzLnJlbW92ZSh4P3goZSxLKTpxKGUsSykpKTooeD8oZD17fSxkW21dPXQsZD14KGUsZCk9PT14KGUsSykpOmQ9dD09PXEoZSxLKSxzPXN8fGQpO0U9bChlLEspO0U9QihFKT9FOlwiXCI7aC5wdXNoKHtpZDp4P3goZSxLKTpuP0RbQV06QSxsYWJlbDpFLHNlbGVjdGVkOmR9KX1yfHwoeXx8bnVsbD09PXQ/YVtcIlwiXS51bnNoaWZ0KHtpZDpcIlwiLGxhYmVsOlwiXCIsc2VsZWN0ZWQ6IXN9KTpzfHxhW1wiXCJdLnVuc2hpZnQoe2lkOlwiP1wiLGxhYmVsOlwiXCIsc2VsZWN0ZWQ6ITB9KSk7Sz0wO2ZvcihEPWMubGVuZ3RoO0s8RDtLKyspe2Q9Y1tLXTtoPWFbZF07ei5sZW5ndGg8PUs/KHQ9e2VsZW1lbnQ6Qy5jbG9uZSgpLmF0dHIoXCJsYWJlbFwiLGQpLGxhYmVsOmgubGFiZWx9LHY9W3RdLHoucHVzaCh2KSxcbmYuYXBwZW5kKHQuZWxlbWVudCkpOih2PXpbS10sdD12WzBdLHQubGFiZWwhPWQmJnQuZWxlbWVudC5hdHRyKFwibGFiZWxcIix0LmxhYmVsPWQpKTtFPW51bGw7QT0wO2ZvcihGPWgubGVuZ3RoO0E8RjtBKyspcz1oW0FdLChkPXZbQSsxXSk/KEU9ZC5lbGVtZW50LGQubGFiZWwhPT1zLmxhYmVsJiZFLnRleHQoZC5sYWJlbD1zLmxhYmVsKSxkLmlkIT09cy5pZCYmRS52YWwoZC5pZD1zLmlkKSxkLnNlbGVjdGVkIT09cy5zZWxlY3RlZCYmRS5wcm9wKFwic2VsZWN0ZWRcIixkLnNlbGVjdGVkPXMuc2VsZWN0ZWQpKTooXCJcIj09PXMuaWQmJnk/Sj15OihKPXUuY2xvbmUoKSkudmFsKHMuaWQpLmF0dHIoXCJzZWxlY3RlZFwiLHMuc2VsZWN0ZWQpLnRleHQocy5sYWJlbCksdi5wdXNoKHtlbGVtZW50OkosbGFiZWw6cy5sYWJlbCxpZDpzLmlkLHNlbGVjdGVkOnMuc2VsZWN0ZWR9KSxFP0UuYWZ0ZXIoSik6dC5lbGVtZW50LmFwcGVuZChKKSxFPUopO2ZvcihBKys7di5sZW5ndGg+QTspdi5wb3AoKS5lbGVtZW50LnJlbW92ZSgpfWZvcig7ei5sZW5ndGg+XG5LOyl6LnBvcCgpWzBdLmVsZW1lbnQucmVtb3ZlKCl9dmFyIGg7aWYoIShoPXQubWF0Y2goZCkpKXRocm93IFVlKFwiaWV4cFwiLHQsZ2EoZikpO3ZhciBsPWMoaFsyXXx8aFsxXSksbT1oWzRdfHxoWzZdLG49aFs1XSxwPWMoaFszXXx8XCJcIikscT1jKGhbMl0/aFsxXTptKSx3PWMoaFs3XSkseD1oWzhdP2MoaFs4XSk6bnVsbCx6PVtbe2VsZW1lbnQ6ZixsYWJlbDpcIlwifV1dO3kmJihhKHkpKGUpLHkucmVtb3ZlQ2xhc3MoXCJuZy1zY29wZVwiKSx5LnJlbW92ZSgpKTtmLmVtcHR5KCk7Zi5vbihcImNoYW5nZVwiLGZ1bmN0aW9uKCl7ZS4kYXBwbHkoZnVuY3Rpb24oKXt2YXIgYSxjPXcoZSl8fFtdLGQ9e30saCxrLGwscCx0LHUsdjtpZihyKWZvcihrPVtdLHA9MCx1PXoubGVuZ3RoO3A8dTtwKyspZm9yKGE9eltwXSxsPTEsdD1hLmxlbmd0aDtsPHQ7bCsrKXtpZigoaD1hW2xdLmVsZW1lbnQpWzBdLnNlbGVjdGVkKXtoPWgudmFsKCk7biYmKGRbbl09aCk7aWYoeClmb3Iodj0wO3Y8Yy5sZW5ndGgmJlxuKGRbbV09Y1t2XSx4KGUsZCkhPWgpO3YrKyk7ZWxzZSBkW21dPWNbaF07ay5wdXNoKHEoZSxkKSl9fWVsc2V7aD1mLnZhbCgpO2lmKFwiP1wiPT1oKWs9cztlbHNlIGlmKFwiXCI9PT1oKWs9bnVsbDtlbHNlIGlmKHgpZm9yKHY9MDt2PGMubGVuZ3RoO3YrKyl7aWYoZFttXT1jW3ZdLHgoZSxkKT09aCl7az1xKGUsZCk7YnJlYWt9fWVsc2UgZFttXT1jW2hdLG4mJihkW25dPWgpLGs9cShlLGQpOzE8elswXS5sZW5ndGgmJnpbMF1bMV0uaWQhPT1oJiYoelswXVsxXS5zZWxlY3RlZD0hMSl9Zy4kc2V0Vmlld1ZhbHVlKGspfSl9KTtnLiRyZW5kZXI9aztlLiR3YXRjaChrKX1pZihtWzFdKXt2YXIgcD1tWzBdO209bVsxXTt2YXIgcj1rLm11bHRpcGxlLHQ9ay5uZ09wdGlvbnMseT0hMSx4LHU9dyhWLmNyZWF0ZUVsZW1lbnQoXCJvcHRpb25cIikpLEM9dyhWLmNyZWF0ZUVsZW1lbnQoXCJvcHRncm91cFwiKSksRj11LmNsb25lKCk7az0wO2Zvcih2YXIgej1mLmNoaWxkcmVuKCksSj16Lmxlbmd0aDtrPEo7aysrKWlmKFwiXCI9PT1cbnpba10udmFsdWUpe3g9eT16LmVxKGspO2JyZWFrfXAuaW5pdChtLHksRik7ciYmKG0uJGlzRW1wdHk9ZnVuY3Rpb24oYSl7cmV0dXJuIWF8fDA9PT1hLmxlbmd0aH0pO3Q/bihlLGYsbSk6cj9sKGUsZixtKTpoKGUsZixtLHApfX19fV0saGQ9W1wiJGludGVycG9sYXRlXCIsZnVuY3Rpb24oYSl7dmFyIGM9e2FkZE9wdGlvbjp5LHJlbW92ZU9wdGlvbjp5fTtyZXR1cm57cmVzdHJpY3Q6XCJFXCIscHJpb3JpdHk6MTAwLGNvbXBpbGU6ZnVuY3Rpb24oZCxlKXtpZihEKGUudmFsdWUpKXt2YXIgZz1hKGQudGV4dCgpLCEwKTtnfHxlLiRzZXQoXCJ2YWx1ZVwiLGQudGV4dCgpKX1yZXR1cm4gZnVuY3Rpb24oYSxkLGUpe3ZhciBoPWQucGFyZW50KCksbD1oLmRhdGEoXCIkc2VsZWN0Q29udHJvbGxlclwiKXx8aC5wYXJlbnQoKS5kYXRhKFwiJHNlbGVjdENvbnRyb2xsZXJcIik7bCYmbC5kYXRhYm91bmQ/ZC5wcm9wKFwic2VsZWN0ZWRcIiwhMSk6bD1jO2c/YS4kd2F0Y2goZyxmdW5jdGlvbihhLGMpe2UuJHNldChcInZhbHVlXCIsXG5hKTthIT09YyYmbC5yZW1vdmVPcHRpb24oYyk7bC5hZGRPcHRpb24oYSl9KTpsLmFkZE9wdGlvbihlLnZhbHVlKTtkLm9uKFwiJGRlc3Ryb3lcIixmdW5jdGlvbigpe2wucmVtb3ZlT3B0aW9uKGUudmFsdWUpfSl9fX19XSxnZD0kKHtyZXN0cmljdDpcIkVcIix0ZXJtaW5hbDohMH0pO1QuYW5ndWxhci5ib290c3RyYXA/Y29uc29sZS5sb2coXCJXQVJOSU5HOiBUcmllZCB0byBsb2FkIGFuZ3VsYXIgbW9yZSB0aGFuIG9uY2UuXCIpOigoQmE9VC5qUXVlcnkpJiZCYS5mbi5vbj8odz1CYSxKKEJhLmZuLHtzY29wZTpLYS5zY29wZSxpc29sYXRlU2NvcGU6S2EuaXNvbGF0ZVNjb3BlLGNvbnRyb2xsZXI6S2EuY29udHJvbGxlcixpbmplY3RvcjpLYS5pbmplY3Rvcixpbmhlcml0ZWREYXRhOkthLmluaGVyaXRlZERhdGF9KSxGYihcInJlbW92ZVwiLCEwLCEwLCExKSxGYihcImVtcHR5XCIsITEsITEsITEpLEZiKFwiaHRtbFwiLCExLCExLCEwKSk6dz1SLFNhLmVsZW1lbnQ9dyxaYyhTYSksdyhWKS5yZWFkeShmdW5jdGlvbigpe1djKFYsXG5kYyl9KSl9KSh3aW5kb3csZG9jdW1lbnQpOyF3aW5kb3cuYW5ndWxhci4kJGNzcCgpJiZ3aW5kb3cuYW5ndWxhci5lbGVtZW50KGRvY3VtZW50KS5maW5kKFwiaGVhZFwiKS5wcmVwZW5kKCc8c3R5bGUgdHlwZT1cInRleHQvY3NzXCI+QGNoYXJzZXQgXCJVVEYtOFwiO1tuZ1xcXFw6Y2xvYWtdLFtuZy1jbG9ha10sW2RhdGEtbmctY2xvYWtdLFt4LW5nLWNsb2FrXSwubmctY2xvYWssLngtbmctY2xvYWssLm5nLWhpZGV7ZGlzcGxheTpub25lICFpbXBvcnRhbnQ7fW5nXFxcXDpmb3Jte2Rpc3BsYXk6YmxvY2s7fS5uZy1hbmltYXRlLWJsb2NrLXRyYW5zaXRpb25ze3RyYW5zaXRpb246MHMgYWxsIWltcG9ydGFudDstd2Via2l0LXRyYW5zaXRpb246MHMgYWxsIWltcG9ydGFudDt9Lm5nLWhpZGUtYWRkLWFjdGl2ZSwubmctaGlkZS1yZW1vdmV7ZGlzcGxheTpibG9jayFpbXBvcnRhbnQ7fTwvc3R5bGU+Jyk7XG4vLyMgc291cmNlTWFwcGluZ1VSTD1hbmd1bGFyLm1pbi5qcy5tYXBcblxufSkuY2FsbCh0aGlzLHJlcXVpcmUoXCJERjF1cnhcIiksdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9LHJlcXVpcmUoXCJidWZmZXJcIikuQnVmZmVyLGFyZ3VtZW50c1szXSxhcmd1bWVudHNbNF0sYXJndW1lbnRzWzVdLGFyZ3VtZW50c1s2XSxcIi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYW5ndWxhci9saWIvYW5ndWxhci5taW4uanNcIixcIi8uLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvYW5ndWxhci9saWJcIikiLCIoZnVuY3Rpb24gKHByb2Nlc3MsZ2xvYmFsLEJ1ZmZlcixfX2FyZ3VtZW50MCxfX2FyZ3VtZW50MSxfX2FyZ3VtZW50MixfX2FyZ3VtZW50MyxfX2ZpbGVuYW1lLF9fZGlybmFtZSl7XG4vKiFcbiAqIFRoZSBidWZmZXIgbW9kdWxlIGZyb20gbm9kZS5qcywgZm9yIHRoZSBicm93c2VyLlxuICpcbiAqIEBhdXRob3IgICBGZXJvc3MgQWJvdWtoYWRpamVoIDxmZXJvc3NAZmVyb3NzLm9yZz4gPGh0dHA6Ly9mZXJvc3Mub3JnPlxuICogQGxpY2Vuc2UgIE1JVFxuICovXG5cbnZhciBiYXNlNjQgPSByZXF1aXJlKCdiYXNlNjQtanMnKVxudmFyIGllZWU3NTQgPSByZXF1aXJlKCdpZWVlNzU0JylcblxuZXhwb3J0cy5CdWZmZXIgPSBCdWZmZXJcbmV4cG9ydHMuU2xvd0J1ZmZlciA9IEJ1ZmZlclxuZXhwb3J0cy5JTlNQRUNUX01BWF9CWVRFUyA9IDUwXG5CdWZmZXIucG9vbFNpemUgPSA4MTkyXG5cbi8qKlxuICogSWYgYEJ1ZmZlci5fdXNlVHlwZWRBcnJheXNgOlxuICogICA9PT0gdHJ1ZSAgICBVc2UgVWludDhBcnJheSBpbXBsZW1lbnRhdGlvbiAoZmFzdGVzdClcbiAqICAgPT09IGZhbHNlICAgVXNlIE9iamVjdCBpbXBsZW1lbnRhdGlvbiAoY29tcGF0aWJsZSBkb3duIHRvIElFNilcbiAqL1xuQnVmZmVyLl91c2VUeXBlZEFycmF5cyA9IChmdW5jdGlvbiAoKSB7XG4gIC8vIERldGVjdCBpZiBicm93c2VyIHN1cHBvcnRzIFR5cGVkIEFycmF5cy4gU3VwcG9ydGVkIGJyb3dzZXJzIGFyZSBJRSAxMCssIEZpcmVmb3ggNCssXG4gIC8vIENocm9tZSA3KywgU2FmYXJpIDUuMSssIE9wZXJhIDExLjYrLCBpT1MgNC4yKy4gSWYgdGhlIGJyb3dzZXIgZG9lcyBub3Qgc3VwcG9ydCBhZGRpbmdcbiAgLy8gcHJvcGVydGllcyB0byBgVWludDhBcnJheWAgaW5zdGFuY2VzLCB0aGVuIHRoYXQncyB0aGUgc2FtZSBhcyBubyBgVWludDhBcnJheWAgc3VwcG9ydFxuICAvLyBiZWNhdXNlIHdlIG5lZWQgdG8gYmUgYWJsZSB0byBhZGQgYWxsIHRoZSBub2RlIEJ1ZmZlciBBUEkgbWV0aG9kcy4gVGhpcyBpcyBhbiBpc3N1ZVxuICAvLyBpbiBGaXJlZm94IDQtMjkuIE5vdyBmaXhlZDogaHR0cHM6Ly9idWd6aWxsYS5tb3ppbGxhLm9yZy9zaG93X2J1Zy5jZ2k/aWQ9Njk1NDM4XG4gIHRyeSB7XG4gICAgdmFyIGJ1ZiA9IG5ldyBBcnJheUJ1ZmZlcigwKVxuICAgIHZhciBhcnIgPSBuZXcgVWludDhBcnJheShidWYpXG4gICAgYXJyLmZvbyA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuIDQyIH1cbiAgICByZXR1cm4gNDIgPT09IGFyci5mb28oKSAmJlxuICAgICAgICB0eXBlb2YgYXJyLnN1YmFycmF5ID09PSAnZnVuY3Rpb24nIC8vIENocm9tZSA5LTEwIGxhY2sgYHN1YmFycmF5YFxuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn0pKClcblxuLyoqXG4gKiBDbGFzczogQnVmZmVyXG4gKiA9PT09PT09PT09PT09XG4gKlxuICogVGhlIEJ1ZmZlciBjb25zdHJ1Y3RvciByZXR1cm5zIGluc3RhbmNlcyBvZiBgVWludDhBcnJheWAgdGhhdCBhcmUgYXVnbWVudGVkXG4gKiB3aXRoIGZ1bmN0aW9uIHByb3BlcnRpZXMgZm9yIGFsbCB0aGUgbm9kZSBgQnVmZmVyYCBBUEkgZnVuY3Rpb25zLiBXZSB1c2VcbiAqIGBVaW50OEFycmF5YCBzbyB0aGF0IHNxdWFyZSBicmFja2V0IG5vdGF0aW9uIHdvcmtzIGFzIGV4cGVjdGVkIC0tIGl0IHJldHVybnNcbiAqIGEgc2luZ2xlIG9jdGV0LlxuICpcbiAqIEJ5IGF1Z21lbnRpbmcgdGhlIGluc3RhbmNlcywgd2UgY2FuIGF2b2lkIG1vZGlmeWluZyB0aGUgYFVpbnQ4QXJyYXlgXG4gKiBwcm90b3R5cGUuXG4gKi9cbmZ1bmN0aW9uIEJ1ZmZlciAoc3ViamVjdCwgZW5jb2RpbmcsIG5vWmVybykge1xuICBpZiAoISh0aGlzIGluc3RhbmNlb2YgQnVmZmVyKSlcbiAgICByZXR1cm4gbmV3IEJ1ZmZlcihzdWJqZWN0LCBlbmNvZGluZywgbm9aZXJvKVxuXG4gIHZhciB0eXBlID0gdHlwZW9mIHN1YmplY3RcblxuICAvLyBXb3JrYXJvdW5kOiBub2RlJ3MgYmFzZTY0IGltcGxlbWVudGF0aW9uIGFsbG93cyBmb3Igbm9uLXBhZGRlZCBzdHJpbmdzXG4gIC8vIHdoaWxlIGJhc2U2NC1qcyBkb2VzIG5vdC5cbiAgaWYgKGVuY29kaW5nID09PSAnYmFzZTY0JyAmJiB0eXBlID09PSAnc3RyaW5nJykge1xuICAgIHN1YmplY3QgPSBzdHJpbmd0cmltKHN1YmplY3QpXG4gICAgd2hpbGUgKHN1YmplY3QubGVuZ3RoICUgNCAhPT0gMCkge1xuICAgICAgc3ViamVjdCA9IHN1YmplY3QgKyAnPSdcbiAgICB9XG4gIH1cblxuICAvLyBGaW5kIHRoZSBsZW5ndGhcbiAgdmFyIGxlbmd0aFxuICBpZiAodHlwZSA9PT0gJ251bWJlcicpXG4gICAgbGVuZ3RoID0gY29lcmNlKHN1YmplY3QpXG4gIGVsc2UgaWYgKHR5cGUgPT09ICdzdHJpbmcnKVxuICAgIGxlbmd0aCA9IEJ1ZmZlci5ieXRlTGVuZ3RoKHN1YmplY3QsIGVuY29kaW5nKVxuICBlbHNlIGlmICh0eXBlID09PSAnb2JqZWN0JylcbiAgICBsZW5ndGggPSBjb2VyY2Uoc3ViamVjdC5sZW5ndGgpIC8vIGFzc3VtZSB0aGF0IG9iamVjdCBpcyBhcnJheS1saWtlXG4gIGVsc2VcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0ZpcnN0IGFyZ3VtZW50IG5lZWRzIHRvIGJlIGEgbnVtYmVyLCBhcnJheSBvciBzdHJpbmcuJylcblxuICB2YXIgYnVmXG4gIGlmIChCdWZmZXIuX3VzZVR5cGVkQXJyYXlzKSB7XG4gICAgLy8gUHJlZmVycmVkOiBSZXR1cm4gYW4gYXVnbWVudGVkIGBVaW50OEFycmF5YCBpbnN0YW5jZSBmb3IgYmVzdCBwZXJmb3JtYW5jZVxuICAgIGJ1ZiA9IEJ1ZmZlci5fYXVnbWVudChuZXcgVWludDhBcnJheShsZW5ndGgpKVxuICB9IGVsc2Uge1xuICAgIC8vIEZhbGxiYWNrOiBSZXR1cm4gVEhJUyBpbnN0YW5jZSBvZiBCdWZmZXIgKGNyZWF0ZWQgYnkgYG5ld2ApXG4gICAgYnVmID0gdGhpc1xuICAgIGJ1Zi5sZW5ndGggPSBsZW5ndGhcbiAgICBidWYuX2lzQnVmZmVyID0gdHJ1ZVxuICB9XG5cbiAgdmFyIGlcbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMgJiYgdHlwZW9mIHN1YmplY3QuYnl0ZUxlbmd0aCA9PT0gJ251bWJlcicpIHtcbiAgICAvLyBTcGVlZCBvcHRpbWl6YXRpb24gLS0gdXNlIHNldCBpZiB3ZSdyZSBjb3B5aW5nIGZyb20gYSB0eXBlZCBhcnJheVxuICAgIGJ1Zi5fc2V0KHN1YmplY3QpXG4gIH0gZWxzZSBpZiAoaXNBcnJheWlzaChzdWJqZWN0KSkge1xuICAgIC8vIFRyZWF0IGFycmF5LWlzaCBvYmplY3RzIGFzIGEgYnl0ZSBhcnJheVxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgICAgaWYgKEJ1ZmZlci5pc0J1ZmZlcihzdWJqZWN0KSlcbiAgICAgICAgYnVmW2ldID0gc3ViamVjdC5yZWFkVUludDgoaSlcbiAgICAgIGVsc2VcbiAgICAgICAgYnVmW2ldID0gc3ViamVjdFtpXVxuICAgIH1cbiAgfSBlbHNlIGlmICh0eXBlID09PSAnc3RyaW5nJykge1xuICAgIGJ1Zi53cml0ZShzdWJqZWN0LCAwLCBlbmNvZGluZylcbiAgfSBlbHNlIGlmICh0eXBlID09PSAnbnVtYmVyJyAmJiAhQnVmZmVyLl91c2VUeXBlZEFycmF5cyAmJiAhbm9aZXJvKSB7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XG4gICAgICBidWZbaV0gPSAwXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGJ1ZlxufVxuXG4vLyBTVEFUSUMgTUVUSE9EU1xuLy8gPT09PT09PT09PT09PT1cblxuQnVmZmVyLmlzRW5jb2RpbmcgPSBmdW5jdGlvbiAoZW5jb2RpbmcpIHtcbiAgc3dpdGNoIChTdHJpbmcoZW5jb2RpbmcpLnRvTG93ZXJDYXNlKCkpIHtcbiAgICBjYXNlICdoZXgnOlxuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgY2FzZSAnYmluYXJ5JzpcbiAgICBjYXNlICdiYXNlNjQnOlxuICAgIGNhc2UgJ3Jhdyc6XG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldHVybiB0cnVlXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBmYWxzZVxuICB9XG59XG5cbkJ1ZmZlci5pc0J1ZmZlciA9IGZ1bmN0aW9uIChiKSB7XG4gIHJldHVybiAhIShiICE9PSBudWxsICYmIGIgIT09IHVuZGVmaW5lZCAmJiBiLl9pc0J1ZmZlcilcbn1cblxuQnVmZmVyLmJ5dGVMZW5ndGggPSBmdW5jdGlvbiAoc3RyLCBlbmNvZGluZykge1xuICB2YXIgcmV0XG4gIHN0ciA9IHN0ciArICcnXG4gIHN3aXRjaCAoZW5jb2RpbmcgfHwgJ3V0ZjgnKSB7XG4gICAgY2FzZSAnaGV4JzpcbiAgICAgIHJldCA9IHN0ci5sZW5ndGggLyAyXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3V0ZjgnOlxuICAgIGNhc2UgJ3V0Zi04JzpcbiAgICAgIHJldCA9IHV0ZjhUb0J5dGVzKHN0cikubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2FzY2lpJzpcbiAgICBjYXNlICdiaW5hcnknOlxuICAgIGNhc2UgJ3Jhdyc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBiYXNlNjRUb0J5dGVzKHN0cikubGVuZ3RoXG4gICAgICBicmVha1xuICAgIGNhc2UgJ3VjczInOlxuICAgIGNhc2UgJ3Vjcy0yJzpcbiAgICBjYXNlICd1dGYxNmxlJzpcbiAgICBjYXNlICd1dGYtMTZsZSc6XG4gICAgICByZXQgPSBzdHIubGVuZ3RoICogMlxuICAgICAgYnJlYWtcbiAgICBkZWZhdWx0OlxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdVbmtub3duIGVuY29kaW5nJylcbiAgfVxuICByZXR1cm4gcmV0XG59XG5cbkJ1ZmZlci5jb25jYXQgPSBmdW5jdGlvbiAobGlzdCwgdG90YWxMZW5ndGgpIHtcbiAgYXNzZXJ0KGlzQXJyYXkobGlzdCksICdVc2FnZTogQnVmZmVyLmNvbmNhdChsaXN0LCBbdG90YWxMZW5ndGhdKVxcbicgK1xuICAgICAgJ2xpc3Qgc2hvdWxkIGJlIGFuIEFycmF5LicpXG5cbiAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgcmV0dXJuIG5ldyBCdWZmZXIoMClcbiAgfSBlbHNlIGlmIChsaXN0Lmxlbmd0aCA9PT0gMSkge1xuICAgIHJldHVybiBsaXN0WzBdXG4gIH1cblxuICB2YXIgaVxuICBpZiAodHlwZW9mIHRvdGFsTGVuZ3RoICE9PSAnbnVtYmVyJykge1xuICAgIHRvdGFsTGVuZ3RoID0gMFxuICAgIGZvciAoaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICB0b3RhbExlbmd0aCArPSBsaXN0W2ldLmxlbmd0aFxuICAgIH1cbiAgfVxuXG4gIHZhciBidWYgPSBuZXcgQnVmZmVyKHRvdGFsTGVuZ3RoKVxuICB2YXIgcG9zID0gMFxuICBmb3IgKGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHZhciBpdGVtID0gbGlzdFtpXVxuICAgIGl0ZW0uY29weShidWYsIHBvcylcbiAgICBwb3MgKz0gaXRlbS5sZW5ndGhcbiAgfVxuICByZXR1cm4gYnVmXG59XG5cbi8vIEJVRkZFUiBJTlNUQU5DRSBNRVRIT0RTXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBfaGV4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSBidWYubGVuZ3RoIC0gb2Zmc2V0XG4gIGlmICghbGVuZ3RoKSB7XG4gICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gIH0gZWxzZSB7XG4gICAgbGVuZ3RoID0gTnVtYmVyKGxlbmd0aClcbiAgICBpZiAobGVuZ3RoID4gcmVtYWluaW5nKSB7XG4gICAgICBsZW5ndGggPSByZW1haW5pbmdcbiAgICB9XG4gIH1cblxuICAvLyBtdXN0IGJlIGFuIGV2ZW4gbnVtYmVyIG9mIGRpZ2l0c1xuICB2YXIgc3RyTGVuID0gc3RyaW5nLmxlbmd0aFxuICBhc3NlcnQoc3RyTGVuICUgMiA9PT0gMCwgJ0ludmFsaWQgaGV4IHN0cmluZycpXG5cbiAgaWYgKGxlbmd0aCA+IHN0ckxlbiAvIDIpIHtcbiAgICBsZW5ndGggPSBzdHJMZW4gLyAyXG4gIH1cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIHZhciBieXRlID0gcGFyc2VJbnQoc3RyaW5nLnN1YnN0cihpICogMiwgMiksIDE2KVxuICAgIGFzc2VydCghaXNOYU4oYnl0ZSksICdJbnZhbGlkIGhleCBzdHJpbmcnKVxuICAgIGJ1ZltvZmZzZXQgKyBpXSA9IGJ5dGVcbiAgfVxuICBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9IGkgKiAyXG4gIHJldHVybiBpXG59XG5cbmZ1bmN0aW9uIF91dGY4V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIodXRmOFRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfYXNjaWlXcml0ZSAoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBjaGFyc1dyaXR0ZW4gPSBCdWZmZXIuX2NoYXJzV3JpdHRlbiA9XG4gICAgYmxpdEJ1ZmZlcihhc2NpaVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5mdW5jdGlvbiBfYmluYXJ5V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICByZXR1cm4gX2FzY2lpV3JpdGUoYnVmLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxufVxuXG5mdW5jdGlvbiBfYmFzZTY0V3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIoYmFzZTY0VG9CeXRlcyhzdHJpbmcpLCBidWYsIG9mZnNldCwgbGVuZ3RoKVxuICByZXR1cm4gY2hhcnNXcml0dGVuXG59XG5cbmZ1bmN0aW9uIF91dGYxNmxlV3JpdGUgKGJ1Ziwgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCkge1xuICB2YXIgY2hhcnNXcml0dGVuID0gQnVmZmVyLl9jaGFyc1dyaXR0ZW4gPVxuICAgIGJsaXRCdWZmZXIodXRmMTZsZVRvQnl0ZXMoc3RyaW5nKSwgYnVmLCBvZmZzZXQsIGxlbmd0aClcbiAgcmV0dXJuIGNoYXJzV3JpdHRlblxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlID0gZnVuY3Rpb24gKHN0cmluZywgb2Zmc2V0LCBsZW5ndGgsIGVuY29kaW5nKSB7XG4gIC8vIFN1cHBvcnQgYm90aCAoc3RyaW5nLCBvZmZzZXQsIGxlbmd0aCwgZW5jb2RpbmcpXG4gIC8vIGFuZCB0aGUgbGVnYWN5IChzdHJpbmcsIGVuY29kaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgaWYgKGlzRmluaXRlKG9mZnNldCkpIHtcbiAgICBpZiAoIWlzRmluaXRlKGxlbmd0aCkpIHtcbiAgICAgIGVuY29kaW5nID0gbGVuZ3RoXG4gICAgICBsZW5ndGggPSB1bmRlZmluZWRcbiAgICB9XG4gIH0gZWxzZSB7ICAvLyBsZWdhY3lcbiAgICB2YXIgc3dhcCA9IGVuY29kaW5nXG4gICAgZW5jb2RpbmcgPSBvZmZzZXRcbiAgICBvZmZzZXQgPSBsZW5ndGhcbiAgICBsZW5ndGggPSBzd2FwXG4gIH1cblxuICBvZmZzZXQgPSBOdW1iZXIob2Zmc2V0KSB8fCAwXG4gIHZhciByZW1haW5pbmcgPSB0aGlzLmxlbmd0aCAtIG9mZnNldFxuICBpZiAoIWxlbmd0aCkge1xuICAgIGxlbmd0aCA9IHJlbWFpbmluZ1xuICB9IGVsc2Uge1xuICAgIGxlbmd0aCA9IE51bWJlcihsZW5ndGgpXG4gICAgaWYgKGxlbmd0aCA+IHJlbWFpbmluZykge1xuICAgICAgbGVuZ3RoID0gcmVtYWluaW5nXG4gICAgfVxuICB9XG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKVxuXG4gIHZhciByZXRcbiAgc3dpdGNoIChlbmNvZGluZykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBfaGV4V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gX3V0ZjhXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXQgPSBfYXNjaWlXcml0ZSh0aGlzLCBzdHJpbmcsIG9mZnNldCwgbGVuZ3RoKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0ID0gX2JpbmFyeVdyaXRlKHRoaXMsIHN0cmluZywgb2Zmc2V0LCBsZW5ndGgpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBfYmFzZTY0V3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IF91dGYxNmxlV3JpdGUodGhpcywgc3RyaW5nLCBvZmZzZXQsIGxlbmd0aClcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvU3RyaW5nID0gZnVuY3Rpb24gKGVuY29kaW5nLCBzdGFydCwgZW5kKSB7XG4gIHZhciBzZWxmID0gdGhpc1xuXG4gIGVuY29kaW5nID0gU3RyaW5nKGVuY29kaW5nIHx8ICd1dGY4JykudG9Mb3dlckNhc2UoKVxuICBzdGFydCA9IE51bWJlcihzdGFydCkgfHwgMFxuICBlbmQgPSAoZW5kICE9PSB1bmRlZmluZWQpXG4gICAgPyBOdW1iZXIoZW5kKVxuICAgIDogZW5kID0gc2VsZi5sZW5ndGhcblxuICAvLyBGYXN0cGF0aCBlbXB0eSBzdHJpbmdzXG4gIGlmIChlbmQgPT09IHN0YXJ0KVxuICAgIHJldHVybiAnJ1xuXG4gIHZhciByZXRcbiAgc3dpdGNoIChlbmNvZGluZykge1xuICAgIGNhc2UgJ2hleCc6XG4gICAgICByZXQgPSBfaGV4U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndXRmOCc6XG4gICAgY2FzZSAndXRmLTgnOlxuICAgICAgcmV0ID0gX3V0ZjhTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdhc2NpaSc6XG4gICAgICByZXQgPSBfYXNjaWlTbGljZShzZWxmLCBzdGFydCwgZW5kKVxuICAgICAgYnJlYWtcbiAgICBjYXNlICdiaW5hcnknOlxuICAgICAgcmV0ID0gX2JpbmFyeVNsaWNlKHNlbGYsIHN0YXJ0LCBlbmQpXG4gICAgICBicmVha1xuICAgIGNhc2UgJ2Jhc2U2NCc6XG4gICAgICByZXQgPSBfYmFzZTY0U2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgY2FzZSAndWNzMic6XG4gICAgY2FzZSAndWNzLTInOlxuICAgIGNhc2UgJ3V0ZjE2bGUnOlxuICAgIGNhc2UgJ3V0Zi0xNmxlJzpcbiAgICAgIHJldCA9IF91dGYxNmxlU2xpY2Uoc2VsZiwgc3RhcnQsIGVuZClcbiAgICAgIGJyZWFrXG4gICAgZGVmYXVsdDpcbiAgICAgIHRocm93IG5ldyBFcnJvcignVW5rbm93biBlbmNvZGluZycpXG4gIH1cbiAgcmV0dXJuIHJldFxufVxuXG5CdWZmZXIucHJvdG90eXBlLnRvSlNPTiA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHtcbiAgICB0eXBlOiAnQnVmZmVyJyxcbiAgICBkYXRhOiBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbCh0aGlzLl9hcnIgfHwgdGhpcywgMClcbiAgfVxufVxuXG4vLyBjb3B5KHRhcmdldEJ1ZmZlciwgdGFyZ2V0U3RhcnQ9MCwgc291cmNlU3RhcnQ9MCwgc291cmNlRW5kPWJ1ZmZlci5sZW5ndGgpXG5CdWZmZXIucHJvdG90eXBlLmNvcHkgPSBmdW5jdGlvbiAodGFyZ2V0LCB0YXJnZXRfc3RhcnQsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIHNvdXJjZSA9IHRoaXNcblxuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgJiYgZW5kICE9PSAwKSBlbmQgPSB0aGlzLmxlbmd0aFxuICBpZiAoIXRhcmdldF9zdGFydCkgdGFyZ2V0X3N0YXJ0ID0gMFxuXG4gIC8vIENvcHkgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuXG4gIGlmICh0YXJnZXQubGVuZ3RoID09PSAwIHx8IHNvdXJjZS5sZW5ndGggPT09IDApIHJldHVyblxuXG4gIC8vIEZhdGFsIGVycm9yIGNvbmRpdGlvbnNcbiAgYXNzZXJ0KGVuZCA+PSBzdGFydCwgJ3NvdXJjZUVuZCA8IHNvdXJjZVN0YXJ0JylcbiAgYXNzZXJ0KHRhcmdldF9zdGFydCA+PSAwICYmIHRhcmdldF9zdGFydCA8IHRhcmdldC5sZW5ndGgsXG4gICAgICAndGFyZ2V0U3RhcnQgb3V0IG9mIGJvdW5kcycpXG4gIGFzc2VydChzdGFydCA+PSAwICYmIHN0YXJ0IDwgc291cmNlLmxlbmd0aCwgJ3NvdXJjZVN0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoZW5kID49IDAgJiYgZW5kIDw9IHNvdXJjZS5sZW5ndGgsICdzb3VyY2VFbmQgb3V0IG9mIGJvdW5kcycpXG5cbiAgLy8gQXJlIHdlIG9vYj9cbiAgaWYgKGVuZCA+IHRoaXMubGVuZ3RoKVxuICAgIGVuZCA9IHRoaXMubGVuZ3RoXG4gIGlmICh0YXJnZXQubGVuZ3RoIC0gdGFyZ2V0X3N0YXJ0IDwgZW5kIC0gc3RhcnQpXG4gICAgZW5kID0gdGFyZ2V0Lmxlbmd0aCAtIHRhcmdldF9zdGFydCArIHN0YXJ0XG5cbiAgdmFyIGxlbiA9IGVuZCAtIHN0YXJ0XG5cbiAgaWYgKGxlbiA8IDEwMCB8fCAhQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspXG4gICAgICB0YXJnZXRbaSArIHRhcmdldF9zdGFydF0gPSB0aGlzW2kgKyBzdGFydF1cbiAgfSBlbHNlIHtcbiAgICB0YXJnZXQuX3NldCh0aGlzLnN1YmFycmF5KHN0YXJ0LCBzdGFydCArIGxlbiksIHRhcmdldF9zdGFydClcbiAgfVxufVxuXG5mdW5jdGlvbiBfYmFzZTY0U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICBpZiAoc3RhcnQgPT09IDAgJiYgZW5kID09PSBidWYubGVuZ3RoKSB7XG4gICAgcmV0dXJuIGJhc2U2NC5mcm9tQnl0ZUFycmF5KGJ1ZilcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gYmFzZTY0LmZyb21CeXRlQXJyYXkoYnVmLnNsaWNlKHN0YXJ0LCBlbmQpKVxuICB9XG59XG5cbmZ1bmN0aW9uIF91dGY4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmVzID0gJydcbiAgdmFyIHRtcCA9ICcnXG4gIGVuZCA9IE1hdGgubWluKGJ1Zi5sZW5ndGgsIGVuZClcblxuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIGlmIChidWZbaV0gPD0gMHg3Rikge1xuICAgICAgcmVzICs9IGRlY29kZVV0ZjhDaGFyKHRtcCkgKyBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgICAgIHRtcCA9ICcnXG4gICAgfSBlbHNlIHtcbiAgICAgIHRtcCArPSAnJScgKyBidWZbaV0udG9TdHJpbmcoMTYpXG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlcyArIGRlY29kZVV0ZjhDaGFyKHRtcClcbn1cblxuZnVuY3Rpb24gX2FzY2lpU2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgcmV0ID0gJydcbiAgZW5kID0gTWF0aC5taW4oYnVmLmxlbmd0aCwgZW5kKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKVxuICAgIHJldCArPSBTdHJpbmcuZnJvbUNoYXJDb2RlKGJ1ZltpXSlcbiAgcmV0dXJuIHJldFxufVxuXG5mdW5jdGlvbiBfYmluYXJ5U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICByZXR1cm4gX2FzY2lpU2xpY2UoYnVmLCBzdGFydCwgZW5kKVxufVxuXG5mdW5jdGlvbiBfaGV4U2xpY2UgKGJ1Ziwgc3RhcnQsIGVuZCkge1xuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuXG4gIGlmICghc3RhcnQgfHwgc3RhcnQgPCAwKSBzdGFydCA9IDBcbiAgaWYgKCFlbmQgfHwgZW5kIDwgMCB8fCBlbmQgPiBsZW4pIGVuZCA9IGxlblxuXG4gIHZhciBvdXQgPSAnJ1xuICBmb3IgKHZhciBpID0gc3RhcnQ7IGkgPCBlbmQ7IGkrKykge1xuICAgIG91dCArPSB0b0hleChidWZbaV0pXG4gIH1cbiAgcmV0dXJuIG91dFxufVxuXG5mdW5jdGlvbiBfdXRmMTZsZVNsaWNlIChidWYsIHN0YXJ0LCBlbmQpIHtcbiAgdmFyIGJ5dGVzID0gYnVmLnNsaWNlKHN0YXJ0LCBlbmQpXG4gIHZhciByZXMgPSAnJ1xuICBmb3IgKHZhciBpID0gMDsgaSA8IGJ5dGVzLmxlbmd0aDsgaSArPSAyKSB7XG4gICAgcmVzICs9IFN0cmluZy5mcm9tQ2hhckNvZGUoYnl0ZXNbaV0gKyBieXRlc1tpKzFdICogMjU2KVxuICB9XG4gIHJldHVybiByZXNcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5zbGljZSA9IGZ1bmN0aW9uIChzdGFydCwgZW5kKSB7XG4gIHZhciBsZW4gPSB0aGlzLmxlbmd0aFxuICBzdGFydCA9IGNsYW1wKHN0YXJ0LCBsZW4sIDApXG4gIGVuZCA9IGNsYW1wKGVuZCwgbGVuLCBsZW4pXG5cbiAgaWYgKEJ1ZmZlci5fdXNlVHlwZWRBcnJheXMpIHtcbiAgICByZXR1cm4gQnVmZmVyLl9hdWdtZW50KHRoaXMuc3ViYXJyYXkoc3RhcnQsIGVuZCkpXG4gIH0gZWxzZSB7XG4gICAgdmFyIHNsaWNlTGVuID0gZW5kIC0gc3RhcnRcbiAgICB2YXIgbmV3QnVmID0gbmV3IEJ1ZmZlcihzbGljZUxlbiwgdW5kZWZpbmVkLCB0cnVlKVxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgc2xpY2VMZW47IGkrKykge1xuICAgICAgbmV3QnVmW2ldID0gdGhpc1tpICsgc3RhcnRdXG4gICAgfVxuICAgIHJldHVybiBuZXdCdWZcbiAgfVxufVxuXG4vLyBgZ2V0YCB3aWxsIGJlIHJlbW92ZWQgaW4gTm9kZSAwLjEzK1xuQnVmZmVyLnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAob2Zmc2V0KSB7XG4gIGNvbnNvbGUubG9nKCcuZ2V0KCkgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHVzaW5nIGFycmF5IGluZGV4ZXMgaW5zdGVhZC4nKVxuICByZXR1cm4gdGhpcy5yZWFkVUludDgob2Zmc2V0KVxufVxuXG4vLyBgc2V0YCB3aWxsIGJlIHJlbW92ZWQgaW4gTm9kZSAwLjEzK1xuQnVmZmVyLnByb3RvdHlwZS5zZXQgPSBmdW5jdGlvbiAodiwgb2Zmc2V0KSB7XG4gIGNvbnNvbGUubG9nKCcuc2V0KCkgaXMgZGVwcmVjYXRlZC4gQWNjZXNzIHVzaW5nIGFycmF5IGluZGV4ZXMgaW5zdGVhZC4nKVxuICByZXR1cm4gdGhpcy53cml0ZVVJbnQ4KHYsIG9mZnNldClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDggPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIHJldHVybiB0aGlzW29mZnNldF1cbn1cblxuZnVuY3Rpb24gX3JlYWRVSW50MTYgKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICB2YXIgdmFsXG4gIGlmIChsaXR0bGVFbmRpYW4pIHtcbiAgICB2YWwgPSBidWZbb2Zmc2V0XVxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXSA8PCA4XG4gIH0gZWxzZSB7XG4gICAgdmFsID0gYnVmW29mZnNldF0gPDwgOFxuICAgIGlmIChvZmZzZXQgKyAxIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAxXVxuICB9XG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2TEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MTYodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDE2QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MTYodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF9yZWFkVUludDMyIChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbFxuICBpZiAobGl0dGxlRW5kaWFuKSB7XG4gICAgaWYgKG9mZnNldCArIDIgPCBsZW4pXG4gICAgICB2YWwgPSBidWZbb2Zmc2V0ICsgMl0gPDwgMTZcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCB8PSBidWZbb2Zmc2V0ICsgMV0gPDwgOFxuICAgIHZhbCB8PSBidWZbb2Zmc2V0XVxuICAgIGlmIChvZmZzZXQgKyAzIDwgbGVuKVxuICAgICAgdmFsID0gdmFsICsgKGJ1ZltvZmZzZXQgKyAzXSA8PCAyNCA+Pj4gMClcbiAgfSBlbHNlIHtcbiAgICBpZiAob2Zmc2V0ICsgMSA8IGxlbilcbiAgICAgIHZhbCA9IGJ1ZltvZmZzZXQgKyAxXSA8PCAxNlxuICAgIGlmIChvZmZzZXQgKyAyIDwgbGVuKVxuICAgICAgdmFsIHw9IGJ1ZltvZmZzZXQgKyAyXSA8PCA4XG4gICAgaWYgKG9mZnNldCArIDMgPCBsZW4pXG4gICAgICB2YWwgfD0gYnVmW29mZnNldCArIDNdXG4gICAgdmFsID0gdmFsICsgKGJ1ZltvZmZzZXRdIDw8IDI0ID4+PiAwKVxuICB9XG4gIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyTEUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MzIodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkVUludDMyQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRVSW50MzIodGhpcywgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDggPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCxcbiAgICAgICAgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIHZhciBuZWcgPSB0aGlzW29mZnNldF0gJiAweDgwXG4gIGlmIChuZWcpXG4gICAgcmV0dXJuICgweGZmIC0gdGhpc1tvZmZzZXRdICsgMSkgKiAtMVxuICBlbHNlXG4gICAgcmV0dXJuIHRoaXNbb2Zmc2V0XVxufVxuXG5mdW5jdGlvbiBfcmVhZEludDE2IChidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDEgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHJlYWQgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgdmFyIHZhbCA9IF9yZWFkVUludDE2KGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIHRydWUpXG4gIHZhciBuZWcgPSB2YWwgJiAweDgwMDBcbiAgaWYgKG5lZylcbiAgICByZXR1cm4gKDB4ZmZmZiAtIHZhbCArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MTZMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDE2KHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDE2QkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQxNih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRJbnQzMiAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAzIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byByZWFkIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIHZhciB2YWwgPSBfcmVhZFVJbnQzMihidWYsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCB0cnVlKVxuICB2YXIgbmVnID0gdmFsICYgMHg4MDAwMDAwMFxuICBpZiAobmVnKVxuICAgIHJldHVybiAoMHhmZmZmZmZmZiAtIHZhbCArIDEpICogLTFcbiAgZWxzZVxuICAgIHJldHVybiB2YWxcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkSW50MzJMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEludDMyKHRoaXMsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUucmVhZEludDMyQkUgPSBmdW5jdGlvbiAob2Zmc2V0LCBub0Fzc2VydCkge1xuICByZXR1cm4gX3JlYWRJbnQzMih0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3JlYWRGbG9hdCAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICByZXR1cm4gaWVlZTc1NC5yZWFkKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDIzLCA0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWRGbG9hdExFID0gZnVuY3Rpb24gKG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgcmV0dXJuIF9yZWFkRmxvYXQodGhpcywgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS5yZWFkRmxvYXRCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZEZsb2F0KHRoaXMsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfcmVhZERvdWJsZSAoYnVmLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICsgNyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gcmVhZCBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gIH1cblxuICByZXR1cm4gaWVlZTc1NC5yZWFkKGJ1Ziwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIDUyLCA4KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVMRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZERvdWJsZSh0aGlzLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLnJlYWREb3VibGVCRSA9IGZ1bmN0aW9uIChvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIHJldHVybiBfcmVhZERvdWJsZSh0aGlzLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZVVJbnQ4ID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCA8IHRoaXMubGVuZ3RoLCAndHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnVpbnQodmFsdWUsIDB4ZmYpXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKSByZXR1cm5cblxuICB0aGlzW29mZnNldF0gPSB2YWx1ZVxufVxuXG5mdW5jdGlvbiBfd3JpdGVVSW50MTYgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMSA8IGJ1Zi5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgZm9yICh2YXIgaSA9IDAsIGogPSBNYXRoLm1pbihsZW4gLSBvZmZzZXQsIDIpOyBpIDwgajsgaSsrKSB7XG4gICAgYnVmW29mZnNldCArIGldID1cbiAgICAgICAgKHZhbHVlICYgKDB4ZmYgPDwgKDggKiAobGl0dGxlRW5kaWFuID8gaSA6IDEgLSBpKSkpKSA+Pj5cbiAgICAgICAgICAgIChsaXR0bGVFbmRpYW4gPyBpIDogMSAtIGkpICogOFxuICB9XG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZMRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVVSW50MTZCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVVSW50MTYodGhpcywgdmFsdWUsIG9mZnNldCwgZmFsc2UsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVVSW50MzIgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICd0cnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmdWludCh2YWx1ZSwgMHhmZmZmZmZmZilcbiAgfVxuXG4gIHZhciBsZW4gPSBidWYubGVuZ3RoXG4gIGlmIChvZmZzZXQgPj0gbGVuKVxuICAgIHJldHVyblxuXG4gIGZvciAodmFyIGkgPSAwLCBqID0gTWF0aC5taW4obGVuIC0gb2Zmc2V0LCA0KTsgaSA8IGo7IGkrKykge1xuICAgIGJ1ZltvZmZzZXQgKyBpXSA9XG4gICAgICAgICh2YWx1ZSA+Pj4gKGxpdHRsZUVuZGlhbiA/IGkgOiAzIC0gaSkgKiA4KSAmIDB4ZmZcbiAgfVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlVUludDMyQkUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlVUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDggPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0IDwgdGhpcy5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmc2ludCh2YWx1ZSwgMHg3ZiwgLTB4ODApXG4gIH1cblxuICBpZiAob2Zmc2V0ID49IHRoaXMubGVuZ3RoKVxuICAgIHJldHVyblxuXG4gIGlmICh2YWx1ZSA+PSAwKVxuICAgIHRoaXMud3JpdGVVSW50OCh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydClcbiAgZWxzZVxuICAgIHRoaXMud3JpdGVVSW50OCgweGZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIG5vQXNzZXJ0KVxufVxuXG5mdW5jdGlvbiBfd3JpdGVJbnQxNiAoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KSB7XG4gIGlmICghbm9Bc3NlcnQpIHtcbiAgICBhc3NlcnQodmFsdWUgIT09IHVuZGVmaW5lZCAmJiB2YWx1ZSAhPT0gbnVsbCwgJ21pc3NpbmcgdmFsdWUnKVxuICAgIGFzc2VydCh0eXBlb2YgbGl0dGxlRW5kaWFuID09PSAnYm9vbGVhbicsICdtaXNzaW5nIG9yIGludmFsaWQgZW5kaWFuJylcbiAgICBhc3NlcnQob2Zmc2V0ICE9PSB1bmRlZmluZWQgJiYgb2Zmc2V0ICE9PSBudWxsLCAnbWlzc2luZyBvZmZzZXQnKVxuICAgIGFzc2VydChvZmZzZXQgKyAxIDwgYnVmLmxlbmd0aCwgJ1RyeWluZyB0byB3cml0ZSBiZXlvbmQgYnVmZmVyIGxlbmd0aCcpXG4gICAgdmVyaWZzaW50KHZhbHVlLCAweDdmZmYsIC0weDgwMDApXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZiAodmFsdWUgPj0gMClcbiAgICBfd3JpdGVVSW50MTYoYnVmLCB2YWx1ZSwgb2Zmc2V0LCBsaXR0bGVFbmRpYW4sIG5vQXNzZXJ0KVxuICBlbHNlXG4gICAgX3dyaXRlVUludDE2KGJ1ZiwgMHhmZmZmICsgdmFsdWUgKyAxLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQxNkxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDE2KHRoaXMsIHZhbHVlLCBvZmZzZXQsIHRydWUsIG5vQXNzZXJ0KVxufVxuXG5CdWZmZXIucHJvdG90eXBlLndyaXRlSW50MTZCRSA9IGZ1bmN0aW9uICh2YWx1ZSwgb2Zmc2V0LCBub0Fzc2VydCkge1xuICBfd3JpdGVJbnQxNih0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbmZ1bmN0aW9uIF93cml0ZUludDMyIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDMgPCBidWYubGVuZ3RoLCAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZnNpbnQodmFsdWUsIDB4N2ZmZmZmZmYsIC0weDgwMDAwMDAwKVxuICB9XG5cbiAgdmFyIGxlbiA9IGJ1Zi5sZW5ndGhcbiAgaWYgKG9mZnNldCA+PSBsZW4pXG4gICAgcmV0dXJuXG5cbiAgaWYgKHZhbHVlID49IDApXG4gICAgX3dyaXRlVUludDMyKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbiAgZWxzZVxuICAgIF93cml0ZVVJbnQzMihidWYsIDB4ZmZmZmZmZmYgKyB2YWx1ZSArIDEsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUludDMyTEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlSW50MzIodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVJbnQzMkJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUludDMyKHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlRmxvYXQgKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCBub0Fzc2VydCkge1xuICBpZiAoIW5vQXNzZXJ0KSB7XG4gICAgYXNzZXJ0KHZhbHVlICE9PSB1bmRlZmluZWQgJiYgdmFsdWUgIT09IG51bGwsICdtaXNzaW5nIHZhbHVlJylcbiAgICBhc3NlcnQodHlwZW9mIGxpdHRsZUVuZGlhbiA9PT0gJ2Jvb2xlYW4nLCAnbWlzc2luZyBvciBpbnZhbGlkIGVuZGlhbicpXG4gICAgYXNzZXJ0KG9mZnNldCAhPT0gdW5kZWZpbmVkICYmIG9mZnNldCAhPT0gbnVsbCwgJ21pc3Npbmcgb2Zmc2V0JylcbiAgICBhc3NlcnQob2Zmc2V0ICsgMyA8IGJ1Zi5sZW5ndGgsICdUcnlpbmcgdG8gd3JpdGUgYmV5b25kIGJ1ZmZlciBsZW5ndGgnKVxuICAgIHZlcmlmSUVFRTc1NCh2YWx1ZSwgMy40MDI4MjM0NjYzODUyODg2ZSszOCwgLTMuNDAyODIzNDY2Mzg1Mjg4NmUrMzgpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCAyMywgNClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZUZsb2F0TEUgPSBmdW5jdGlvbiAodmFsdWUsIG9mZnNldCwgbm9Bc3NlcnQpIHtcbiAgX3dyaXRlRmxvYXQodGhpcywgdmFsdWUsIG9mZnNldCwgdHJ1ZSwgbm9Bc3NlcnQpXG59XG5cbkJ1ZmZlci5wcm90b3R5cGUud3JpdGVGbG9hdEJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZUZsb2F0KHRoaXMsIHZhbHVlLCBvZmZzZXQsIGZhbHNlLCBub0Fzc2VydClcbn1cblxuZnVuY3Rpb24gX3dyaXRlRG91YmxlIChidWYsIHZhbHVlLCBvZmZzZXQsIGxpdHRsZUVuZGlhbiwgbm9Bc3NlcnQpIHtcbiAgaWYgKCFub0Fzc2VydCkge1xuICAgIGFzc2VydCh2YWx1ZSAhPT0gdW5kZWZpbmVkICYmIHZhbHVlICE9PSBudWxsLCAnbWlzc2luZyB2YWx1ZScpXG4gICAgYXNzZXJ0KHR5cGVvZiBsaXR0bGVFbmRpYW4gPT09ICdib29sZWFuJywgJ21pc3Npbmcgb3IgaW52YWxpZCBlbmRpYW4nKVxuICAgIGFzc2VydChvZmZzZXQgIT09IHVuZGVmaW5lZCAmJiBvZmZzZXQgIT09IG51bGwsICdtaXNzaW5nIG9mZnNldCcpXG4gICAgYXNzZXJ0KG9mZnNldCArIDcgPCBidWYubGVuZ3RoLFxuICAgICAgICAnVHJ5aW5nIHRvIHdyaXRlIGJleW9uZCBidWZmZXIgbGVuZ3RoJylcbiAgICB2ZXJpZklFRUU3NTQodmFsdWUsIDEuNzk3NjkzMTM0ODYyMzE1N0UrMzA4LCAtMS43OTc2OTMxMzQ4NjIzMTU3RSszMDgpXG4gIH1cblxuICB2YXIgbGVuID0gYnVmLmxlbmd0aFxuICBpZiAob2Zmc2V0ID49IGxlbilcbiAgICByZXR1cm5cblxuICBpZWVlNzU0LndyaXRlKGJ1ZiwgdmFsdWUsIG9mZnNldCwgbGl0dGxlRW5kaWFuLCA1MiwgOClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUxFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCB0cnVlLCBub0Fzc2VydClcbn1cblxuQnVmZmVyLnByb3RvdHlwZS53cml0ZURvdWJsZUJFID0gZnVuY3Rpb24gKHZhbHVlLCBvZmZzZXQsIG5vQXNzZXJ0KSB7XG4gIF93cml0ZURvdWJsZSh0aGlzLCB2YWx1ZSwgb2Zmc2V0LCBmYWxzZSwgbm9Bc3NlcnQpXG59XG5cbi8vIGZpbGwodmFsdWUsIHN0YXJ0PTAsIGVuZD1idWZmZXIubGVuZ3RoKVxuQnVmZmVyLnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gKHZhbHVlLCBzdGFydCwgZW5kKSB7XG4gIGlmICghdmFsdWUpIHZhbHVlID0gMFxuICBpZiAoIXN0YXJ0KSBzdGFydCA9IDBcbiAgaWYgKCFlbmQpIGVuZCA9IHRoaXMubGVuZ3RoXG5cbiAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ3N0cmluZycpIHtcbiAgICB2YWx1ZSA9IHZhbHVlLmNoYXJDb2RlQXQoMClcbiAgfVxuXG4gIGFzc2VydCh0eXBlb2YgdmFsdWUgPT09ICdudW1iZXInICYmICFpc05hTih2YWx1ZSksICd2YWx1ZSBpcyBub3QgYSBudW1iZXInKVxuICBhc3NlcnQoZW5kID49IHN0YXJ0LCAnZW5kIDwgc3RhcnQnKVxuXG4gIC8vIEZpbGwgMCBieXRlczsgd2UncmUgZG9uZVxuICBpZiAoZW5kID09PSBzdGFydCkgcmV0dXJuXG4gIGlmICh0aGlzLmxlbmd0aCA9PT0gMCkgcmV0dXJuXG5cbiAgYXNzZXJ0KHN0YXJ0ID49IDAgJiYgc3RhcnQgPCB0aGlzLmxlbmd0aCwgJ3N0YXJ0IG91dCBvZiBib3VuZHMnKVxuICBhc3NlcnQoZW5kID49IDAgJiYgZW5kIDw9IHRoaXMubGVuZ3RoLCAnZW5kIG91dCBvZiBib3VuZHMnKVxuXG4gIGZvciAodmFyIGkgPSBzdGFydDsgaSA8IGVuZDsgaSsrKSB7XG4gICAgdGhpc1tpXSA9IHZhbHVlXG4gIH1cbn1cblxuQnVmZmVyLnByb3RvdHlwZS5pbnNwZWN0ID0gZnVuY3Rpb24gKCkge1xuICB2YXIgb3V0ID0gW11cbiAgdmFyIGxlbiA9IHRoaXMubGVuZ3RoXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICBvdXRbaV0gPSB0b0hleCh0aGlzW2ldKVxuICAgIGlmIChpID09PSBleHBvcnRzLklOU1BFQ1RfTUFYX0JZVEVTKSB7XG4gICAgICBvdXRbaSArIDFdID0gJy4uLidcbiAgICAgIGJyZWFrXG4gICAgfVxuICB9XG4gIHJldHVybiAnPEJ1ZmZlciAnICsgb3V0LmpvaW4oJyAnKSArICc+J1xufVxuXG4vKipcbiAqIENyZWF0ZXMgYSBuZXcgYEFycmF5QnVmZmVyYCB3aXRoIHRoZSAqY29waWVkKiBtZW1vcnkgb2YgdGhlIGJ1ZmZlciBpbnN0YW5jZS5cbiAqIEFkZGVkIGluIE5vZGUgMC4xMi4gT25seSBhdmFpbGFibGUgaW4gYnJvd3NlcnMgdGhhdCBzdXBwb3J0IEFycmF5QnVmZmVyLlxuICovXG5CdWZmZXIucHJvdG90eXBlLnRvQXJyYXlCdWZmZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGlmICh0eXBlb2YgVWludDhBcnJheSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBpZiAoQnVmZmVyLl91c2VUeXBlZEFycmF5cykge1xuICAgICAgcmV0dXJuIChuZXcgQnVmZmVyKHRoaXMpKS5idWZmZXJcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGJ1ZiA9IG5ldyBVaW50OEFycmF5KHRoaXMubGVuZ3RoKVxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGJ1Zi5sZW5ndGg7IGkgPCBsZW47IGkgKz0gMSlcbiAgICAgICAgYnVmW2ldID0gdGhpc1tpXVxuICAgICAgcmV0dXJuIGJ1Zi5idWZmZXJcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdCdWZmZXIudG9BcnJheUJ1ZmZlciBub3Qgc3VwcG9ydGVkIGluIHRoaXMgYnJvd3NlcicpXG4gIH1cbn1cblxuLy8gSEVMUEVSIEZVTkNUSU9OU1xuLy8gPT09PT09PT09PT09PT09PVxuXG5mdW5jdGlvbiBzdHJpbmd0cmltIChzdHIpIHtcbiAgaWYgKHN0ci50cmltKSByZXR1cm4gc3RyLnRyaW0oKVxuICByZXR1cm4gc3RyLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKVxufVxuXG52YXIgQlAgPSBCdWZmZXIucHJvdG90eXBlXG5cbi8qKlxuICogQXVnbWVudCBhIFVpbnQ4QXJyYXkgKmluc3RhbmNlKiAobm90IHRoZSBVaW50OEFycmF5IGNsYXNzISkgd2l0aCBCdWZmZXIgbWV0aG9kc1xuICovXG5CdWZmZXIuX2F1Z21lbnQgPSBmdW5jdGlvbiAoYXJyKSB7XG4gIGFyci5faXNCdWZmZXIgPSB0cnVlXG5cbiAgLy8gc2F2ZSByZWZlcmVuY2UgdG8gb3JpZ2luYWwgVWludDhBcnJheSBnZXQvc2V0IG1ldGhvZHMgYmVmb3JlIG92ZXJ3cml0aW5nXG4gIGFyci5fZ2V0ID0gYXJyLmdldFxuICBhcnIuX3NldCA9IGFyci5zZXRcblxuICAvLyBkZXByZWNhdGVkLCB3aWxsIGJlIHJlbW92ZWQgaW4gbm9kZSAwLjEzK1xuICBhcnIuZ2V0ID0gQlAuZ2V0XG4gIGFyci5zZXQgPSBCUC5zZXRcblxuICBhcnIud3JpdGUgPSBCUC53cml0ZVxuICBhcnIudG9TdHJpbmcgPSBCUC50b1N0cmluZ1xuICBhcnIudG9Mb2NhbGVTdHJpbmcgPSBCUC50b1N0cmluZ1xuICBhcnIudG9KU09OID0gQlAudG9KU09OXG4gIGFyci5jb3B5ID0gQlAuY29weVxuICBhcnIuc2xpY2UgPSBCUC5zbGljZVxuICBhcnIucmVhZFVJbnQ4ID0gQlAucmVhZFVJbnQ4XG4gIGFyci5yZWFkVUludDE2TEUgPSBCUC5yZWFkVUludDE2TEVcbiAgYXJyLnJlYWRVSW50MTZCRSA9IEJQLnJlYWRVSW50MTZCRVxuICBhcnIucmVhZFVJbnQzMkxFID0gQlAucmVhZFVJbnQzMkxFXG4gIGFyci5yZWFkVUludDMyQkUgPSBCUC5yZWFkVUludDMyQkVcbiAgYXJyLnJlYWRJbnQ4ID0gQlAucmVhZEludDhcbiAgYXJyLnJlYWRJbnQxNkxFID0gQlAucmVhZEludDE2TEVcbiAgYXJyLnJlYWRJbnQxNkJFID0gQlAucmVhZEludDE2QkVcbiAgYXJyLnJlYWRJbnQzMkxFID0gQlAucmVhZEludDMyTEVcbiAgYXJyLnJlYWRJbnQzMkJFID0gQlAucmVhZEludDMyQkVcbiAgYXJyLnJlYWRGbG9hdExFID0gQlAucmVhZEZsb2F0TEVcbiAgYXJyLnJlYWRGbG9hdEJFID0gQlAucmVhZEZsb2F0QkVcbiAgYXJyLnJlYWREb3VibGVMRSA9IEJQLnJlYWREb3VibGVMRVxuICBhcnIucmVhZERvdWJsZUJFID0gQlAucmVhZERvdWJsZUJFXG4gIGFyci53cml0ZVVJbnQ4ID0gQlAud3JpdGVVSW50OFxuICBhcnIud3JpdGVVSW50MTZMRSA9IEJQLndyaXRlVUludDE2TEVcbiAgYXJyLndyaXRlVUludDE2QkUgPSBCUC53cml0ZVVJbnQxNkJFXG4gIGFyci53cml0ZVVJbnQzMkxFID0gQlAud3JpdGVVSW50MzJMRVxuICBhcnIud3JpdGVVSW50MzJCRSA9IEJQLndyaXRlVUludDMyQkVcbiAgYXJyLndyaXRlSW50OCA9IEJQLndyaXRlSW50OFxuICBhcnIud3JpdGVJbnQxNkxFID0gQlAud3JpdGVJbnQxNkxFXG4gIGFyci53cml0ZUludDE2QkUgPSBCUC53cml0ZUludDE2QkVcbiAgYXJyLndyaXRlSW50MzJMRSA9IEJQLndyaXRlSW50MzJMRVxuICBhcnIud3JpdGVJbnQzMkJFID0gQlAud3JpdGVJbnQzMkJFXG4gIGFyci53cml0ZUZsb2F0TEUgPSBCUC53cml0ZUZsb2F0TEVcbiAgYXJyLndyaXRlRmxvYXRCRSA9IEJQLndyaXRlRmxvYXRCRVxuICBhcnIud3JpdGVEb3VibGVMRSA9IEJQLndyaXRlRG91YmxlTEVcbiAgYXJyLndyaXRlRG91YmxlQkUgPSBCUC53cml0ZURvdWJsZUJFXG4gIGFyci5maWxsID0gQlAuZmlsbFxuICBhcnIuaW5zcGVjdCA9IEJQLmluc3BlY3RcbiAgYXJyLnRvQXJyYXlCdWZmZXIgPSBCUC50b0FycmF5QnVmZmVyXG5cbiAgcmV0dXJuIGFyclxufVxuXG4vLyBzbGljZShzdGFydCwgZW5kKVxuZnVuY3Rpb24gY2xhbXAgKGluZGV4LCBsZW4sIGRlZmF1bHRWYWx1ZSkge1xuICBpZiAodHlwZW9mIGluZGV4ICE9PSAnbnVtYmVyJykgcmV0dXJuIGRlZmF1bHRWYWx1ZVxuICBpbmRleCA9IH5+aW5kZXg7ICAvLyBDb2VyY2UgdG8gaW50ZWdlci5cbiAgaWYgKGluZGV4ID49IGxlbikgcmV0dXJuIGxlblxuICBpZiAoaW5kZXggPj0gMCkgcmV0dXJuIGluZGV4XG4gIGluZGV4ICs9IGxlblxuICBpZiAoaW5kZXggPj0gMCkgcmV0dXJuIGluZGV4XG4gIHJldHVybiAwXG59XG5cbmZ1bmN0aW9uIGNvZXJjZSAobGVuZ3RoKSB7XG4gIC8vIENvZXJjZSBsZW5ndGggdG8gYSBudW1iZXIgKHBvc3NpYmx5IE5hTiksIHJvdW5kIHVwXG4gIC8vIGluIGNhc2UgaXQncyBmcmFjdGlvbmFsIChlLmcuIDEyMy40NTYpIHRoZW4gZG8gYVxuICAvLyBkb3VibGUgbmVnYXRlIHRvIGNvZXJjZSBhIE5hTiB0byAwLiBFYXN5LCByaWdodD9cbiAgbGVuZ3RoID0gfn5NYXRoLmNlaWwoK2xlbmd0aClcbiAgcmV0dXJuIGxlbmd0aCA8IDAgPyAwIDogbGVuZ3RoXG59XG5cbmZ1bmN0aW9uIGlzQXJyYXkgKHN1YmplY3QpIHtcbiAgcmV0dXJuIChBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChzdWJqZWN0KSB7XG4gICAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChzdWJqZWN0KSA9PT0gJ1tvYmplY3QgQXJyYXldJ1xuICB9KShzdWJqZWN0KVxufVxuXG5mdW5jdGlvbiBpc0FycmF5aXNoIChzdWJqZWN0KSB7XG4gIHJldHVybiBpc0FycmF5KHN1YmplY3QpIHx8IEJ1ZmZlci5pc0J1ZmZlcihzdWJqZWN0KSB8fFxuICAgICAgc3ViamVjdCAmJiB0eXBlb2Ygc3ViamVjdCA9PT0gJ29iamVjdCcgJiZcbiAgICAgIHR5cGVvZiBzdWJqZWN0Lmxlbmd0aCA9PT0gJ251bWJlcidcbn1cblxuZnVuY3Rpb24gdG9IZXggKG4pIHtcbiAgaWYgKG4gPCAxNikgcmV0dXJuICcwJyArIG4udG9TdHJpbmcoMTYpXG4gIHJldHVybiBuLnRvU3RyaW5nKDE2KVxufVxuXG5mdW5jdGlvbiB1dGY4VG9CeXRlcyAoc3RyKSB7XG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIHZhciBiID0gc3RyLmNoYXJDb2RlQXQoaSlcbiAgICBpZiAoYiA8PSAweDdGKVxuICAgICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkpXG4gICAgZWxzZSB7XG4gICAgICB2YXIgc3RhcnQgPSBpXG4gICAgICBpZiAoYiA+PSAweEQ4MDAgJiYgYiA8PSAweERGRkYpIGkrK1xuICAgICAgdmFyIGggPSBlbmNvZGVVUklDb21wb25lbnQoc3RyLnNsaWNlKHN0YXJ0LCBpKzEpKS5zdWJzdHIoMSkuc3BsaXQoJyUnKVxuICAgICAgZm9yICh2YXIgaiA9IDA7IGogPCBoLmxlbmd0aDsgaisrKVxuICAgICAgICBieXRlQXJyYXkucHVzaChwYXJzZUludChoW2pdLCAxNikpXG4gICAgfVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gYXNjaWlUb0J5dGVzIChzdHIpIHtcbiAgdmFyIGJ5dGVBcnJheSA9IFtdXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgc3RyLmxlbmd0aDsgaSsrKSB7XG4gICAgLy8gTm9kZSdzIGNvZGUgc2VlbXMgdG8gYmUgZG9pbmcgdGhpcyBhbmQgbm90ICYgMHg3Ri4uXG4gICAgYnl0ZUFycmF5LnB1c2goc3RyLmNoYXJDb2RlQXQoaSkgJiAweEZGKVxuICB9XG4gIHJldHVybiBieXRlQXJyYXlcbn1cblxuZnVuY3Rpb24gdXRmMTZsZVRvQnl0ZXMgKHN0cikge1xuICB2YXIgYywgaGksIGxvXG4gIHZhciBieXRlQXJyYXkgPSBbXVxuICBmb3IgKHZhciBpID0gMDsgaSA8IHN0ci5sZW5ndGg7IGkrKykge1xuICAgIGMgPSBzdHIuY2hhckNvZGVBdChpKVxuICAgIGhpID0gYyA+PiA4XG4gICAgbG8gPSBjICUgMjU2XG4gICAgYnl0ZUFycmF5LnB1c2gobG8pXG4gICAgYnl0ZUFycmF5LnB1c2goaGkpXG4gIH1cblxuICByZXR1cm4gYnl0ZUFycmF5XG59XG5cbmZ1bmN0aW9uIGJhc2U2NFRvQnl0ZXMgKHN0cikge1xuICByZXR1cm4gYmFzZTY0LnRvQnl0ZUFycmF5KHN0cilcbn1cblxuZnVuY3Rpb24gYmxpdEJ1ZmZlciAoc3JjLCBkc3QsIG9mZnNldCwgbGVuZ3RoKSB7XG4gIHZhciBwb3NcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xuICAgIGlmICgoaSArIG9mZnNldCA+PSBkc3QubGVuZ3RoKSB8fCAoaSA+PSBzcmMubGVuZ3RoKSlcbiAgICAgIGJyZWFrXG4gICAgZHN0W2kgKyBvZmZzZXRdID0gc3JjW2ldXG4gIH1cbiAgcmV0dXJuIGlcbn1cblxuZnVuY3Rpb24gZGVjb2RlVXRmOENoYXIgKHN0cikge1xuICB0cnkge1xuICAgIHJldHVybiBkZWNvZGVVUklDb21wb25lbnQoc3RyKVxuICB9IGNhdGNoIChlcnIpIHtcbiAgICByZXR1cm4gU3RyaW5nLmZyb21DaGFyQ29kZSgweEZGRkQpIC8vIFVURiA4IGludmFsaWQgY2hhclxuICB9XG59XG5cbi8qXG4gKiBXZSBoYXZlIHRvIG1ha2Ugc3VyZSB0aGF0IHRoZSB2YWx1ZSBpcyBhIHZhbGlkIGludGVnZXIuIFRoaXMgbWVhbnMgdGhhdCBpdFxuICogaXMgbm9uLW5lZ2F0aXZlLiBJdCBoYXMgbm8gZnJhY3Rpb25hbCBjb21wb25lbnQgYW5kIHRoYXQgaXQgZG9lcyBub3RcbiAqIGV4Y2VlZCB0aGUgbWF4aW11bSBhbGxvd2VkIHZhbHVlLlxuICovXG5mdW5jdGlvbiB2ZXJpZnVpbnQgKHZhbHVlLCBtYXgpIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlID49IDAsICdzcGVjaWZpZWQgYSBuZWdhdGl2ZSB2YWx1ZSBmb3Igd3JpdGluZyBhbiB1bnNpZ25lZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA8PSBtYXgsICd2YWx1ZSBpcyBsYXJnZXIgdGhhbiBtYXhpbXVtIHZhbHVlIGZvciB0eXBlJylcbiAgYXNzZXJ0KE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSwgJ3ZhbHVlIGhhcyBhIGZyYWN0aW9uYWwgY29tcG9uZW50Jylcbn1cblxuZnVuY3Rpb24gdmVyaWZzaW50ICh2YWx1ZSwgbWF4LCBtaW4pIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGxhcmdlciB0aGFuIG1heGltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA+PSBtaW4sICd2YWx1ZSBzbWFsbGVyIHRoYW4gbWluaW11bSBhbGxvd2VkIHZhbHVlJylcbiAgYXNzZXJ0KE1hdGguZmxvb3IodmFsdWUpID09PSB2YWx1ZSwgJ3ZhbHVlIGhhcyBhIGZyYWN0aW9uYWwgY29tcG9uZW50Jylcbn1cblxuZnVuY3Rpb24gdmVyaWZJRUVFNzU0ICh2YWx1ZSwgbWF4LCBtaW4pIHtcbiAgYXNzZXJ0KHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicsICdjYW5ub3Qgd3JpdGUgYSBub24tbnVtYmVyIGFzIGEgbnVtYmVyJylcbiAgYXNzZXJ0KHZhbHVlIDw9IG1heCwgJ3ZhbHVlIGxhcmdlciB0aGFuIG1heGltdW0gYWxsb3dlZCB2YWx1ZScpXG4gIGFzc2VydCh2YWx1ZSA+PSBtaW4sICd2YWx1ZSBzbWFsbGVyIHRoYW4gbWluaW11bSBhbGxvd2VkIHZhbHVlJylcbn1cblxuZnVuY3Rpb24gYXNzZXJ0ICh0ZXN0LCBtZXNzYWdlKSB7XG4gIGlmICghdGVzdCkgdGhyb3cgbmV3IEVycm9yKG1lc3NhZ2UgfHwgJ0ZhaWxlZCBhc3NlcnRpb24nKVxufVxuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIkRGMXVyeFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9pbmRleC5qc1wiLFwiLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlclwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbnZhciBsb29rdXAgPSAnQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVphYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ejAxMjM0NTY3ODkrLyc7XG5cbjsoZnVuY3Rpb24gKGV4cG9ydHMpIHtcblx0J3VzZSBzdHJpY3QnO1xuXG4gIHZhciBBcnIgPSAodHlwZW9mIFVpbnQ4QXJyYXkgIT09ICd1bmRlZmluZWQnKVxuICAgID8gVWludDhBcnJheVxuICAgIDogQXJyYXlcblxuXHR2YXIgUExVUyAgID0gJysnLmNoYXJDb2RlQXQoMClcblx0dmFyIFNMQVNIICA9ICcvJy5jaGFyQ29kZUF0KDApXG5cdHZhciBOVU1CRVIgPSAnMCcuY2hhckNvZGVBdCgwKVxuXHR2YXIgTE9XRVIgID0gJ2EnLmNoYXJDb2RlQXQoMClcblx0dmFyIFVQUEVSICA9ICdBJy5jaGFyQ29kZUF0KDApXG5cblx0ZnVuY3Rpb24gZGVjb2RlIChlbHQpIHtcblx0XHR2YXIgY29kZSA9IGVsdC5jaGFyQ29kZUF0KDApXG5cdFx0aWYgKGNvZGUgPT09IFBMVVMpXG5cdFx0XHRyZXR1cm4gNjIgLy8gJysnXG5cdFx0aWYgKGNvZGUgPT09IFNMQVNIKVxuXHRcdFx0cmV0dXJuIDYzIC8vICcvJ1xuXHRcdGlmIChjb2RlIDwgTlVNQkVSKVxuXHRcdFx0cmV0dXJuIC0xIC8vbm8gbWF0Y2hcblx0XHRpZiAoY29kZSA8IE5VTUJFUiArIDEwKVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBOVU1CRVIgKyAyNiArIDI2XG5cdFx0aWYgKGNvZGUgPCBVUFBFUiArIDI2KVxuXHRcdFx0cmV0dXJuIGNvZGUgLSBVUFBFUlxuXHRcdGlmIChjb2RlIDwgTE9XRVIgKyAyNilcblx0XHRcdHJldHVybiBjb2RlIC0gTE9XRVIgKyAyNlxuXHR9XG5cblx0ZnVuY3Rpb24gYjY0VG9CeXRlQXJyYXkgKGI2NCkge1xuXHRcdHZhciBpLCBqLCBsLCB0bXAsIHBsYWNlSG9sZGVycywgYXJyXG5cblx0XHRpZiAoYjY0Lmxlbmd0aCAlIDQgPiAwKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgc3RyaW5nLiBMZW5ndGggbXVzdCBiZSBhIG11bHRpcGxlIG9mIDQnKVxuXHRcdH1cblxuXHRcdC8vIHRoZSBudW1iZXIgb2YgZXF1YWwgc2lnbnMgKHBsYWNlIGhvbGRlcnMpXG5cdFx0Ly8gaWYgdGhlcmUgYXJlIHR3byBwbGFjZWhvbGRlcnMsIHRoYW4gdGhlIHR3byBjaGFyYWN0ZXJzIGJlZm9yZSBpdFxuXHRcdC8vIHJlcHJlc2VudCBvbmUgYnl0ZVxuXHRcdC8vIGlmIHRoZXJlIGlzIG9ubHkgb25lLCB0aGVuIHRoZSB0aHJlZSBjaGFyYWN0ZXJzIGJlZm9yZSBpdCByZXByZXNlbnQgMiBieXRlc1xuXHRcdC8vIHRoaXMgaXMganVzdCBhIGNoZWFwIGhhY2sgdG8gbm90IGRvIGluZGV4T2YgdHdpY2Vcblx0XHR2YXIgbGVuID0gYjY0Lmxlbmd0aFxuXHRcdHBsYWNlSG9sZGVycyA9ICc9JyA9PT0gYjY0LmNoYXJBdChsZW4gLSAyKSA/IDIgOiAnPScgPT09IGI2NC5jaGFyQXQobGVuIC0gMSkgPyAxIDogMFxuXG5cdFx0Ly8gYmFzZTY0IGlzIDQvMyArIHVwIHRvIHR3byBjaGFyYWN0ZXJzIG9mIHRoZSBvcmlnaW5hbCBkYXRhXG5cdFx0YXJyID0gbmV3IEFycihiNjQubGVuZ3RoICogMyAvIDQgLSBwbGFjZUhvbGRlcnMpXG5cblx0XHQvLyBpZiB0aGVyZSBhcmUgcGxhY2Vob2xkZXJzLCBvbmx5IGdldCB1cCB0byB0aGUgbGFzdCBjb21wbGV0ZSA0IGNoYXJzXG5cdFx0bCA9IHBsYWNlSG9sZGVycyA+IDAgPyBiNjQubGVuZ3RoIC0gNCA6IGI2NC5sZW5ndGhcblxuXHRcdHZhciBMID0gMFxuXG5cdFx0ZnVuY3Rpb24gcHVzaCAodikge1xuXHRcdFx0YXJyW0wrK10gPSB2XG5cdFx0fVxuXG5cdFx0Zm9yIChpID0gMCwgaiA9IDA7IGkgPCBsOyBpICs9IDQsIGogKz0gMykge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxOCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCAxMikgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDIpKSA8PCA2KSB8IGRlY29kZShiNjQuY2hhckF0KGkgKyAzKSlcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMDAwKSA+PiAxNilcblx0XHRcdHB1c2goKHRtcCAmIDB4RkYwMCkgPj4gOClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9XG5cblx0XHRpZiAocGxhY2VIb2xkZXJzID09PSAyKSB7XG5cdFx0XHR0bXAgPSAoZGVjb2RlKGI2NC5jaGFyQXQoaSkpIDw8IDIpIHwgKGRlY29kZShiNjQuY2hhckF0KGkgKyAxKSkgPj4gNClcblx0XHRcdHB1c2godG1wICYgMHhGRilcblx0XHR9IGVsc2UgaWYgKHBsYWNlSG9sZGVycyA9PT0gMSkge1xuXHRcdFx0dG1wID0gKGRlY29kZShiNjQuY2hhckF0KGkpKSA8PCAxMCkgfCAoZGVjb2RlKGI2NC5jaGFyQXQoaSArIDEpKSA8PCA0KSB8IChkZWNvZGUoYjY0LmNoYXJBdChpICsgMikpID4+IDIpXG5cdFx0XHRwdXNoKCh0bXAgPj4gOCkgJiAweEZGKVxuXHRcdFx0cHVzaCh0bXAgJiAweEZGKVxuXHRcdH1cblxuXHRcdHJldHVybiBhcnJcblx0fVxuXG5cdGZ1bmN0aW9uIHVpbnQ4VG9CYXNlNjQgKHVpbnQ4KSB7XG5cdFx0dmFyIGksXG5cdFx0XHRleHRyYUJ5dGVzID0gdWludDgubGVuZ3RoICUgMywgLy8gaWYgd2UgaGF2ZSAxIGJ5dGUgbGVmdCwgcGFkIDIgYnl0ZXNcblx0XHRcdG91dHB1dCA9IFwiXCIsXG5cdFx0XHR0ZW1wLCBsZW5ndGhcblxuXHRcdGZ1bmN0aW9uIGVuY29kZSAobnVtKSB7XG5cdFx0XHRyZXR1cm4gbG9va3VwLmNoYXJBdChudW0pXG5cdFx0fVxuXG5cdFx0ZnVuY3Rpb24gdHJpcGxldFRvQmFzZTY0IChudW0pIHtcblx0XHRcdHJldHVybiBlbmNvZGUobnVtID4+IDE4ICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDEyICYgMHgzRikgKyBlbmNvZGUobnVtID4+IDYgJiAweDNGKSArIGVuY29kZShudW0gJiAweDNGKVxuXHRcdH1cblxuXHRcdC8vIGdvIHRocm91Z2ggdGhlIGFycmF5IGV2ZXJ5IHRocmVlIGJ5dGVzLCB3ZSdsbCBkZWFsIHdpdGggdHJhaWxpbmcgc3R1ZmYgbGF0ZXJcblx0XHRmb3IgKGkgPSAwLCBsZW5ndGggPSB1aW50OC5sZW5ndGggLSBleHRyYUJ5dGVzOyBpIDwgbGVuZ3RoOyBpICs9IDMpIHtcblx0XHRcdHRlbXAgPSAodWludDhbaV0gPDwgMTYpICsgKHVpbnQ4W2kgKyAxXSA8PCA4KSArICh1aW50OFtpICsgMl0pXG5cdFx0XHRvdXRwdXQgKz0gdHJpcGxldFRvQmFzZTY0KHRlbXApXG5cdFx0fVxuXG5cdFx0Ly8gcGFkIHRoZSBlbmQgd2l0aCB6ZXJvcywgYnV0IG1ha2Ugc3VyZSB0byBub3QgZm9yZ2V0IHRoZSBleHRyYSBieXRlc1xuXHRcdHN3aXRjaCAoZXh0cmFCeXRlcykge1xuXHRcdFx0Y2FzZSAxOlxuXHRcdFx0XHR0ZW1wID0gdWludDhbdWludDgubGVuZ3RoIC0gMV1cblx0XHRcdFx0b3V0cHV0ICs9IGVuY29kZSh0ZW1wID4+IDIpXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPDwgNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gJz09J1xuXHRcdFx0XHRicmVha1xuXHRcdFx0Y2FzZSAyOlxuXHRcdFx0XHR0ZW1wID0gKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDJdIDw8IDgpICsgKHVpbnQ4W3VpbnQ4Lmxlbmd0aCAtIDFdKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKHRlbXAgPj4gMTApXG5cdFx0XHRcdG91dHB1dCArPSBlbmNvZGUoKHRlbXAgPj4gNCkgJiAweDNGKVxuXHRcdFx0XHRvdXRwdXQgKz0gZW5jb2RlKCh0ZW1wIDw8IDIpICYgMHgzRilcblx0XHRcdFx0b3V0cHV0ICs9ICc9J1xuXHRcdFx0XHRicmVha1xuXHRcdH1cblxuXHRcdHJldHVybiBvdXRwdXRcblx0fVxuXG5cdGV4cG9ydHMudG9CeXRlQXJyYXkgPSBiNjRUb0J5dGVBcnJheVxuXHRleHBvcnRzLmZyb21CeXRlQXJyYXkgPSB1aW50OFRvQmFzZTY0XG59KHR5cGVvZiBleHBvcnRzID09PSAndW5kZWZpbmVkJyA/ICh0aGlzLmJhc2U2NGpzID0ge30pIDogZXhwb3J0cykpXG5cbn0pLmNhbGwodGhpcyxyZXF1aXJlKFwiREYxdXJ4XCIpLHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSxyZXF1aXJlKFwiYnVmZmVyXCIpLkJ1ZmZlcixhcmd1bWVudHNbM10sYXJndW1lbnRzWzRdLGFyZ3VtZW50c1s1XSxhcmd1bWVudHNbNl0sXCIvLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2d1bHAtYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnVmZmVyL25vZGVfbW9kdWxlcy9iYXNlNjQtanMvbGliL2I2NC5qc1wiLFwiLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvYmFzZTY0LWpzL2xpYlwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbmV4cG9ydHMucmVhZCA9IGZ1bmN0aW9uKGJ1ZmZlciwgb2Zmc2V0LCBpc0xFLCBtTGVuLCBuQnl0ZXMpIHtcbiAgdmFyIGUsIG0sXG4gICAgICBlTGVuID0gbkJ5dGVzICogOCAtIG1MZW4gLSAxLFxuICAgICAgZU1heCA9ICgxIDw8IGVMZW4pIC0gMSxcbiAgICAgIGVCaWFzID0gZU1heCA+PiAxLFxuICAgICAgbkJpdHMgPSAtNyxcbiAgICAgIGkgPSBpc0xFID8gKG5CeXRlcyAtIDEpIDogMCxcbiAgICAgIGQgPSBpc0xFID8gLTEgOiAxLFxuICAgICAgcyA9IGJ1ZmZlcltvZmZzZXQgKyBpXTtcblxuICBpICs9IGQ7XG5cbiAgZSA9IHMgJiAoKDEgPDwgKC1uQml0cykpIC0gMSk7XG4gIHMgPj49ICgtbkJpdHMpO1xuICBuQml0cyArPSBlTGVuO1xuICBmb3IgKDsgbkJpdHMgPiAwOyBlID0gZSAqIDI1NiArIGJ1ZmZlcltvZmZzZXQgKyBpXSwgaSArPSBkLCBuQml0cyAtPSA4KTtcblxuICBtID0gZSAmICgoMSA8PCAoLW5CaXRzKSkgLSAxKTtcbiAgZSA+Pj0gKC1uQml0cyk7XG4gIG5CaXRzICs9IG1MZW47XG4gIGZvciAoOyBuQml0cyA+IDA7IG0gPSBtICogMjU2ICsgYnVmZmVyW29mZnNldCArIGldLCBpICs9IGQsIG5CaXRzIC09IDgpO1xuXG4gIGlmIChlID09PSAwKSB7XG4gICAgZSA9IDEgLSBlQmlhcztcbiAgfSBlbHNlIGlmIChlID09PSBlTWF4KSB7XG4gICAgcmV0dXJuIG0gPyBOYU4gOiAoKHMgPyAtMSA6IDEpICogSW5maW5pdHkpO1xuICB9IGVsc2Uge1xuICAgIG0gPSBtICsgTWF0aC5wb3coMiwgbUxlbik7XG4gICAgZSA9IGUgLSBlQmlhcztcbiAgfVxuICByZXR1cm4gKHMgPyAtMSA6IDEpICogbSAqIE1hdGgucG93KDIsIGUgLSBtTGVuKTtcbn07XG5cbmV4cG9ydHMud3JpdGUgPSBmdW5jdGlvbihidWZmZXIsIHZhbHVlLCBvZmZzZXQsIGlzTEUsIG1MZW4sIG5CeXRlcykge1xuICB2YXIgZSwgbSwgYyxcbiAgICAgIGVMZW4gPSBuQnl0ZXMgKiA4IC0gbUxlbiAtIDEsXG4gICAgICBlTWF4ID0gKDEgPDwgZUxlbikgLSAxLFxuICAgICAgZUJpYXMgPSBlTWF4ID4+IDEsXG4gICAgICBydCA9IChtTGVuID09PSAyMyA/IE1hdGgucG93KDIsIC0yNCkgLSBNYXRoLnBvdygyLCAtNzcpIDogMCksXG4gICAgICBpID0gaXNMRSA/IDAgOiAobkJ5dGVzIC0gMSksXG4gICAgICBkID0gaXNMRSA/IDEgOiAtMSxcbiAgICAgIHMgPSB2YWx1ZSA8IDAgfHwgKHZhbHVlID09PSAwICYmIDEgLyB2YWx1ZSA8IDApID8gMSA6IDA7XG5cbiAgdmFsdWUgPSBNYXRoLmFicyh2YWx1ZSk7XG5cbiAgaWYgKGlzTmFOKHZhbHVlKSB8fCB2YWx1ZSA9PT0gSW5maW5pdHkpIHtcbiAgICBtID0gaXNOYU4odmFsdWUpID8gMSA6IDA7XG4gICAgZSA9IGVNYXg7XG4gIH0gZWxzZSB7XG4gICAgZSA9IE1hdGguZmxvb3IoTWF0aC5sb2codmFsdWUpIC8gTWF0aC5MTjIpO1xuICAgIGlmICh2YWx1ZSAqIChjID0gTWF0aC5wb3coMiwgLWUpKSA8IDEpIHtcbiAgICAgIGUtLTtcbiAgICAgIGMgKj0gMjtcbiAgICB9XG4gICAgaWYgKGUgKyBlQmlhcyA+PSAxKSB7XG4gICAgICB2YWx1ZSArPSBydCAvIGM7XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhbHVlICs9IHJ0ICogTWF0aC5wb3coMiwgMSAtIGVCaWFzKTtcbiAgICB9XG4gICAgaWYgKHZhbHVlICogYyA+PSAyKSB7XG4gICAgICBlKys7XG4gICAgICBjIC89IDI7XG4gICAgfVxuXG4gICAgaWYgKGUgKyBlQmlhcyA+PSBlTWF4KSB7XG4gICAgICBtID0gMDtcbiAgICAgIGUgPSBlTWF4O1xuICAgIH0gZWxzZSBpZiAoZSArIGVCaWFzID49IDEpIHtcbiAgICAgIG0gPSAodmFsdWUgKiBjIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKTtcbiAgICAgIGUgPSBlICsgZUJpYXM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG0gPSB2YWx1ZSAqIE1hdGgucG93KDIsIGVCaWFzIC0gMSkgKiBNYXRoLnBvdygyLCBtTGVuKTtcbiAgICAgIGUgPSAwO1xuICAgIH1cbiAgfVxuXG4gIGZvciAoOyBtTGVuID49IDg7IGJ1ZmZlcltvZmZzZXQgKyBpXSA9IG0gJiAweGZmLCBpICs9IGQsIG0gLz0gMjU2LCBtTGVuIC09IDgpO1xuXG4gIGUgPSAoZSA8PCBtTGVuKSB8IG07XG4gIGVMZW4gKz0gbUxlbjtcbiAgZm9yICg7IGVMZW4gPiAwOyBidWZmZXJbb2Zmc2V0ICsgaV0gPSBlICYgMHhmZiwgaSArPSBkLCBlIC89IDI1NiwgZUxlbiAtPSA4KTtcblxuICBidWZmZXJbb2Zmc2V0ICsgaSAtIGRdIHw9IHMgKiAxMjg7XG59O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIkRGMXVyeFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvaWVlZTc1NC9pbmRleC5qc1wiLFwiLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2J1ZmZlci9ub2RlX21vZHVsZXMvaWVlZTc1NFwiKSIsIihmdW5jdGlvbiAocHJvY2VzcyxnbG9iYWwsQnVmZmVyLF9fYXJndW1lbnQwLF9fYXJndW1lbnQxLF9fYXJndW1lbnQyLF9fYXJndW1lbnQzLF9fZmlsZW5hbWUsX19kaXJuYW1lKXtcbi8vIHNoaW0gZm9yIHVzaW5nIHByb2Nlc3MgaW4gYnJvd3NlclxuXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbnByb2Nlc3MubmV4dFRpY2sgPSAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBjYW5TZXRJbW1lZGlhdGUgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5zZXRJbW1lZGlhdGU7XG4gICAgdmFyIGNhblBvc3QgPSB0eXBlb2Ygd2luZG93ICE9PSAndW5kZWZpbmVkJ1xuICAgICYmIHdpbmRvdy5wb3N0TWVzc2FnZSAmJiB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lclxuICAgIDtcblxuICAgIGlmIChjYW5TZXRJbW1lZGlhdGUpIHtcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uIChmKSB7IHJldHVybiB3aW5kb3cuc2V0SW1tZWRpYXRlKGYpIH07XG4gICAgfVxuXG4gICAgaWYgKGNhblBvc3QpIHtcbiAgICAgICAgdmFyIHF1ZXVlID0gW107XG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgZnVuY3Rpb24gKGV2KSB7XG4gICAgICAgICAgICB2YXIgc291cmNlID0gZXYuc291cmNlO1xuICAgICAgICAgICAgaWYgKChzb3VyY2UgPT09IHdpbmRvdyB8fCBzb3VyY2UgPT09IG51bGwpICYmIGV2LmRhdGEgPT09ICdwcm9jZXNzLXRpY2snKSB7XG4gICAgICAgICAgICAgICAgZXYuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICAgICAgaWYgKHF1ZXVlLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyIGZuID0gcXVldWUuc2hpZnQoKTtcbiAgICAgICAgICAgICAgICAgICAgZm4oKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0sIHRydWUpO1xuXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiBuZXh0VGljayhmbikge1xuICAgICAgICAgICAgcXVldWUucHVzaChmbik7XG4gICAgICAgICAgICB3aW5kb3cucG9zdE1lc3NhZ2UoJ3Byb2Nlc3MtdGljaycsICcqJyk7XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgcmV0dXJuIGZ1bmN0aW9uIG5leHRUaWNrKGZuKSB7XG4gICAgICAgIHNldFRpbWVvdXQoZm4sIDApO1xuICAgIH07XG59KSgpO1xuXG5wcm9jZXNzLnRpdGxlID0gJ2Jyb3dzZXInO1xucHJvY2Vzcy5icm93c2VyID0gdHJ1ZTtcbnByb2Nlc3MuZW52ID0ge307XG5wcm9jZXNzLmFyZ3YgPSBbXTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn1cblxuLy8gVE9ETyhzaHR5bG1hbilcbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG59KS5jYWxsKHRoaXMscmVxdWlyZShcIkRGMXVyeFwiKSx0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30scmVxdWlyZShcImJ1ZmZlclwiKS5CdWZmZXIsYXJndW1lbnRzWzNdLGFyZ3VtZW50c1s0XSxhcmd1bWVudHNbNV0sYXJndW1lbnRzWzZdLFwiLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3MvYnJvd3Nlci5qc1wiLFwiLy4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9ndWxwLWJyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL2Jyb3dzZXJpZnkvbm9kZV9tb2R1bGVzL3Byb2Nlc3NcIikiXX0=
