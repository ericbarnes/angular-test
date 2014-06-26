var PostsCtrl = function($scope, $http) {
    $http.get('api/posts').success(function(data) {
        $scope.posts = data;
    });
};

module.exports = PostsCtrl;
