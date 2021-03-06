from django.urls import path
from .api_views import author_view
from .api_views import post_view
from .api_views import follow_view
from .api_views import inbox_view
from .api_views import comment_view
from .api_views import like_view
from .api_views import friend_view
from .api_views import following_view
urlpatterns = [
    # author
    path('service/author/', author_view.register),
    path('service/author/login/', author_view.login_view),
    path('service/author/logout/', author_view.logout_view),
    path('service/author/<str:authorID>/', author_view.author_detail),

    # post
    path('service/allposts/', post_view.all_public_posts),
    path('service/author/<str:authorID>/posts/', post_view.post_view),
    path('service/author/<str:authorID>/posts/<uuid:postID>/', post_view.post_detail_view),

    # follower
    path('service/author/<str:authorID>/followers/', follow_view.follower_list),
    path('service/author/<str:authorID>/followers/<str:foreignAuthorID>/', follow_view.follower),
    path('service/author/<str:authorID>/inbox/friendrequest/<str:foreignAuthorID>/', inbox_view.friendrequest),

    # following
    path('service/author/<str:authorID>/followings/', following_view.following_list),
    path('service/author/<str:authorID>/unfollow/<str:foreignAuthorID>/', following_view.unfollow),

    # friend
    path('service/author/<str:authorID>/friends/', friend_view.friend),

    # inbox
    path('service/author/<str:authorID>/inbox/', inbox_view.inbox_detail),

    # comment
    path('service/author/<str:author_write_article_ID>/posts/<uuid:postID>/comments/', comment_view.comment_view),

    # liked
    path('service/author/<str:authorID>/liked/',like_view.liked_view),
    # like post
    path('service/author/<str:author_write_article_ID>/posts/<uuid:postID>/likes/',like_view.like_post_view),
    # like comment
    path('service/author/<str:author_write_article_ID>/posts/<uuid:postID>/comments/<uuid:commentID>/likes/',like_view.like_comment_view),

    # github activity as post
    path('service/author/<str:authorID>/github/',post_view.github_view)

]
