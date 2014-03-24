var app = angular.module('myApp', []);

function authorsCtrl($scope, $http) {

    $scope.authors = [];
    //Object for saving the new blog
 	$scope.dataAuthor = {};

    //Load blogs
    $scope.loadAuthors = function() {
        var httpRequest = $http({
            method: 'get',
            url: '/authors/get',
            dataType: 'json',
        }).success(function(data, status) {
            $scope.authors = data.rows;
        });
    };

    //Create new blog
    $scope.createAuthor = function() {
        var httpRequest = $http({
            method: 'post',
            url: '/authors/new',
            data: { firstname: $scope.dataAuthor.firstname,
            		lastname: $scope.dataAuthor.lastname,
            		email: $scope.dataAuthor.email },
        }).success(function(data, status) {
            console.log(data);               
            if(data.rowCount === 1){
                alert("Author saved successfully!");
                $("#closeNewAuthor").click();
                //The fields become empty
                $("#txtAuthorFirstName").val("");
                $("#txtAuthorLastName").val("");
                $("#txtAuthorEmail").val("");
                //Reload the authors list
                $scope.loadAuthors();

            }
        });
    };
}

$(function(){
    //Set the navigation bar to Authors
    $(".nav").children("li").removeClass("active");
    $(".nav").children("li").eq(2).addClass("active");
});