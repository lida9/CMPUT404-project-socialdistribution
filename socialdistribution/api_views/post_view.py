from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from socialdistribution.models import Post, Author
from socialdistribution.serializers import PostSerializer, AuthorSerializer
from socialdistribution.pagination import PostPagination
from .helper import is_valid_node
from .permission import AccessPermission, CustomAuthentication
import requests, json


@api_view(['GET', 'POST'])
@authentication_classes([CustomAuthentication])
@permission_classes([AccessPermission])
def post_view(request, authorID):
    valid = is_valid_node(request)
    if not valid:
        return Response({"message":"Node not allowed"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "GET":
        # get recent posts of author (paginated)
        paginator = PostPagination()
        posts = Post.objects.filter(authorID=authorID).order_by('-published')
        paginated = paginator.paginate_queryset(posts, request)
        serializer = PostSerializer(paginated, many=True)
        return paginator.get_paginated_response(serializer.data)

    elif request.method == "POST":
        # create a new post
        data = request.data
        data['authorID'] = authorID
        serializer = PostSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'message':serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST', 'DELETE', 'PUT'])
@authentication_classes([CustomAuthentication])
@permission_classes([AccessPermission])
def post_detail_view(request, authorID, postID):
    valid = is_valid_node(request)
    if not valid:
        return Response({"message":"Node not allowed"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "GET":
        # get post data
        post = get_object_or_404(Post, postID=postID)
        serializer = PostSerializer(post)
        return Response(serializer.data)

    elif request.method == "PUT":
        # create a new post with the given id
        data = request.data
        data['authorID'] = authorID
        data['postID'] = postID

        serializer = PostSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({'message':serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == "POST":
        # update the post
        new_data = request.data
        new_data['authorID'] = authorID
        new_data['postID'] = postID
        try:
            mod_post = get_object_or_404(Post, postID=postID)
        except Post.DoesNotExist:
            return Response(status = status.HTTP_404_NOT_FOUND)
        if mod_post.authorID != authorID:
            return Response(status = status.HTTP_401_UNAUTHORIZED)
        serializer = PostSerializer(mod_post, data=new_data)
        if serializer.is_valid():
            post = serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'message':serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == "DELETE":
        try:
            del_post = get_object_or_404(Post, postID=postID)
        except Post.DoesNotExist:
            return Response(status = status.HTTP_404_NOT_FOUND)
        operation = del_post.delete()
        if operation:
            return Response({'message': "delete successful!"}, status=status.HTTP_200_OK)
        else:
            return Response({'message':"delete was unsuccessful"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)     


@api_view(['GET'])
@authentication_classes([CustomAuthentication])
@permission_classes([AccessPermission])
def all_public_posts(request):
    valid = is_valid_node(request)
    if not valid:
        return Response({"message":"Node not allowed"}, status=status.HTTP_403_FORBIDDEN)

    # get all public posts (paginated)
    paginator = PostPagination()
    posts = Post.objects.filter(visibility="PUBLIC").order_by('-published')
    paginated = paginator.paginate_queryset(posts, request)
    serializer = PostSerializer(paginated, many=True)
    return paginator.get_paginated_response(serializer.data)


@api_view([ 'GET'])
@authentication_classes([CustomAuthentication])
@permission_classes([AccessPermission])
def github_view(request,authorID):
    # get github activity
    if request.method == "GET":
        author = get_object_or_404(Author,authorID = authorID)
        username = author.github
        url = 'https://api.github.com/users/'+ username + '/events'
        git_msg = requests.get(url, headers={'Referer': "https://cmput-404-socialdistribution.herokuapp.com/"}).json()
        return Response(git_msg, status=status.HTTP_200_OK)
