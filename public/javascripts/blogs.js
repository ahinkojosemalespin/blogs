var app = angular.module('myApp', []);
var selectedBlog = "";
function blogsCtrl($scope, $http) {
    $scope.blogs = [];
    $scope.authors = [];
    //Object for saving the new blog
    $scope.dataBlog = {};

    //Load blogs
    $scope.loadBlogs = function () {
        $scope.loadAuthors();
        var httpRequest = $http({
            method: 'get',
            url: '/blogs/get',
            dataType: 'json',
        }).success(function (data, status) {
            $scope.blogs = data.rows;
        });
    };

    //Create new blog
    $scope.createBlog = function () {
        var httpRequest = $http({
            method: 'post',
            url: '/blogs/new',
            data: {
                idauthor: $("#selectAuthor").children("option:selected").text().split(".")[0],
                blogtitle: $scope.dataBlog.blogtitle,
                dateblog: new Date(),
                urlblog: $scope.dataBlog.url
            },
        }).success(function (data, status) {
            console.log(data);
            if (data.rowCount === 1) {
                alert("Blog saved successfully!");
                $("#closeNewBlog").click();
                //The fields become empty
                $("#txtBlogTitle").val("");
                $("#txtBlogUrl").val("");
                //Reload the blog list
                $scope.loadBlogs();

            }
        });
    };

    //Bring all the authors to assing them to the new blogs
    $scope.loadAuthors = function () {
        var httpRequest = $http({
            method: 'get',
            url: '/authors/get',
            dataType: 'json',
        }).success(function (data, status) {
            $scope.authors = data.rows;
        });
    };

    //Bring all the tags to assing them to the new blogs
    $scope.loadTags = function () {
        var httpRequest = $http({
            method: 'get',
            url: '/tags/get',
            dataType: 'json',
        }).success(function (data, status) {
            console.log(data.rows);
            $("#tagsModal").empty();
            $.each(data.rows, function (i, val) {
                $("#tagsModal").append("<option value=" + i + " data-id=" + data.rows[i].idtag + ">" + data.rows[i].texttag + "</option>")
            });
        });
    };

    //Function that assing the selected tags to the blog
    $scope.addTagsToBlog = function () {
        //Close the tags modal
        $("#closeAddTagsToBlog").click();
        console.log($("#tagsModal").val());
        var selectedTags = $("#tagsModal").val();
        //The selected tags are copied to the information modal to be saved after by the user
        $.each(selectedTags, function (i, val) {
            $("#tagsModalSave").append("<option value=" + $("#tagsModal").children("option").eq(selectedTags[i]).attr("data-id") + ">" + $("#tagsModal").children("option").eq(selectedTags[i]).html() + "</option>");
        });
    };

    //Modify blog (add new tags, delete tags and change author)
    $scope.modifyBlog = function () {
        //First, the relationship of the blog and the tags is deleted to insert the new relationships
        var tagList = "";
        var httpRequest = $http({
            method: 'post',
            url: '/tags/detelerel',
            data: { idblog: selectedBlog },
        }).success(function (data, status) {
            console.log(data);
            for (var i = 0; i < $("#tagsModalSave").children("option").length; i++) {
                tagList += $("#tagsModalSave").children("option").eq(i).val() + ",";
                //The new relationships are saved
                var httpRequest = $http({
                    method: 'post',
                    url: '/tags/assing',
                    data: {
                        idblog: selectedBlog,
                        idtag: $("#tagsModalSave").children("option").eq(i).val()
                    },
                }).success(function (data, status) {
                    console.log(data);
                });
            };
            //The author is saved
            var httpRequest = $http({
                method: 'post',
                url: '/blogs/update',
                data: {
                    idblog: selectedBlog,
                    idauthor: $("#selectAuthorMod").val(),
                    idtags: tagList
                },
            }).success(function (data, status) {
                console.log(data);
                if (data.rowCount === 1) {
                    alert("Blog updated successfully!");
                    $("#closeModifyBlog").click();
                    //Reload the blog list
                    $scope.loadBlogs();
                }
            });
        });
    };
}

$(function () {
    //Set the navigation bar to Blogs
    $(".nav").children("li").removeClass("active");
    $(".nav").children("li").eq(0).addClass("active");

    //Events that will trigger when user clicks a blog
    $("#blogsTable").on("click", "tbody tr", function () {
        selectedBlog = $(this).attr("data-idblog");
        //Function to get tags of a blog
        $.ajax({
            url: '/blogs/getTagsByBlog',
            type: 'get',
            async: 'true',
            data: { idblog: $(this).attr("data-idblog") },
            success: function (response) {
                $("#tagsModalSave").empty();
                console.log(response);
                $.each(response.rows, function (i, val) {
                    $("#tagsModalSave").append("<option value=" + response.rows[i].idtag + ">" + response.rows[i].texttag + "</option>");
                });
            },
            error: function () { console.log('Uh Oh!'); },
        });
        //The author of the blog must be set in the modal
        $("#selectAuthorMod").val($(this).children("td").eq(1).attr("data-idauthor"));
        $("#selectAuthorMod").click();
    });

    //Event to remove tags from the list when pressing the delete key
    $(document).keyup(function (e) {
        if (e.which === 46) {
            $("#tagsModalSave option[value='" + $("#tagsModalSave").val() + "']").remove();
        }
    });
});