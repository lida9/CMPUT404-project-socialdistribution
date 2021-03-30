from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from socialdistribution.models import *
from socialdistribution.serializers import *
from .helper import is_valid_node
from .permission import AccessPermission, CustomAuthentication


@api_view(['GET'])
@authentication_classes([CustomAuthentication])
@permission_classes([AccessPermission])
def like_post_view(request, author_write_article_ID, postID):
    valid = is_valid_node(request)
    if not valid:
        return Response({"message":"Node not allowed"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "GET":
        likes = LikePost.objects.filter(postID=postID)
        serializer = LikePostSerializer(likes,many=True)
        return Response(serializer.data)

@api_view(['GET'])
@authentication_classes([CustomAuthentication])
@permission_classes([AccessPermission])
def like_comment_view(request, author_write_article_ID, commentID,postID):
    valid = is_valid_node(request)
    if not valid:
        return Response({"message":"Node not allowed"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "GET":
        likes = LikeComment.objects.filter(commentID=commentID)
        serializer = LikeCommentSerializer(likes,many=True)
        return Response(serializer.data)

@api_view(['GET'])
@authentication_classes([CustomAuthentication])
@permission_classes([AccessPermission])
def liked_view(request,authorID):
    valid = is_valid_node(request)
    if not valid:
        return Response({"message":"Node not allowed"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "GET":
        likeds = Liked.objects.filter(authorID=authorID)
        serializer = LikedSerializer(likeds,many=True)
        return Response(serializer.data)
