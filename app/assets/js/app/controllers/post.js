var PostCtrl = function($scope, $stateParams) {
    console.log("test", $scope.posts);
    $scope.postId = $stateParams.postId;
};

module.exports = PostCtrl;

