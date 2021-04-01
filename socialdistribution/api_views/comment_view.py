from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from socialdistribution.models import *
from socialdistribution.serializers import *
from socialdistribution.pagination import CommentPagination
from .helper import is_valid_node
from .permission import AccessPermission, CustomAuthentication
import requests, json

@api_view([ 'GET','POST'])
@authentication_classes([CustomAuthentication])
@permission_classes([AccessPermission])
def comment_view(request, author_write_article_ID, postID):
    valid = is_valid_node(request)
    if not valid:
        return Response({"message":"Node not allowed"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "GET":
        paginator = CommentPagination()
        comments = Comment.objects.filter(postID=postID).order_by('-published')
        paginated = paginator.paginate_queryset(comments, request)
        serializer = CommentSerializer(paginated, many=True)
        return paginator.get_paginated_response(serializer.data)

    elif request.method == "POST":
        # create a new comment
        data = request.data
        try:
            post = Post.objects.get(postID=postID)
            data['author_write_article_ID'] = author_write_article_ID
            data['postID'] = postID
            serializer = CommentSerializer(data=data)
            if serializer.is_valid():
                comment = serializer.save()
                # increment comment count in post
                post.count += 1
                post.comment_list.insert(0,serializer.data)
                post.save()
                inbox, _ = Inbox.objects.get_or_create(authorID=author_write_article_ID)
                inbox.items.insert(0, serializer.data) # append to items list
                inbox.save()            
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response({'message':serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Post.DoesNotExist:
            # remote post
            new_data = {'comment':data['comment']}

            post_url = 'https://citrusnetwork.herokuapp.com/service/author/' + str(author_write_article_ID) + '/posts/' + str(postID) + "/comments"
            response = requests.post(post_url, data=json.dumps(new_data), auth=('CitrusNetwork','oranges'))
            if response.status_code < 400:
                return Response({'message':'sent successfully!'}, status=status.HTTP_200_OK)
            else:
                return Response({'message':'some error occurred'}, status=status.HTTP_400_BAD_REQUEST)
