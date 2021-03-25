from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from socialdistribution.models import Author, Follow
from socialdistribution.serializers import AuthorSerializer, FollowSerializer
from .helper import get_followers_objects

@api_view(['GET'])
def follower_list(request, authorID): # GET: get a list of authors who are their followers
    followers = get_followers_objects(authorID)
    return Response({"type": "followers","items":followers}, status=status.HTTP_200_OK)

@api_view(['GET'])
def following_list(request, authorID): # GET: get a list of authors who they are following
    # authors = Author.objects.all() # a list of all authors
    # current_user = Author.objects.get(authorID=authorID)
    # followings = []
    # for author in authors:
    #     friend_object, created = Follow.objects.get_or_create(current_user=author) # all followers of this author
    #     if current_user in friend_object.users.all(): # if current_user is a follower of this author
    #         serializer = AuthorSerializer(author)
    #         followings.append(serializer.data)

    objects = Follow.objects.filter(author2=authorID) # all objects where author is a follower
    objects_serializer = FollowSerializer(objects, many=True)
    followings = []
    for f in objects_serializer.data:
        try:
            following_author = Author.objects.get(authorID=f['author1']) # get the author being followed
            serializer = AuthorSerializer(following_author)
            followings.append(serializer.data)
        except Author.DoesNotExist:
            # probably on remote server
            # requests.get('') # get author data from remote server
            print("remote")

    return Response({"type": "followings","items":followings}, status=status.HTTP_200_OK)

@api_view(['GET', 'DELETE', 'PUT'])
def follower(request, authorID, foreignAuthorID):
    if request.method == "GET": # check if follower
        if Follow.objects.filter(author1=authorID, author2=foreignAuthorID).exists():
            # is a follower
            return Response({'message':True}, status=status.HTTP_200_OK)
        else:
            return Response({'message':False}, status=status.HTTP_200_OK)

    elif request.method == "PUT": # Add a follower (must be authenticated)
        if Follow.objects.filter(author1=authorID, author2=foreignAuthorID).exists():
            # already a follower
            return Response({'message':"Already a follower"}, status=status.HTTP_200_OK)
        else:
            follow = Follow(author1=authorID, author2=foreignAuthorID)
            follow.save()
            return Response({'message':"Success"}, status=status.HTTP_200_OK)

    elif request.method == "DELETE": # remove a follower
        try:
            follow_obj = Follow.objects.get(author1=authorID, author2=foreignAuthorID)
        except Follow.DoesNotExist:
            # not a follower
            return Response({'message':"Not a follower"}, status=status.HTTP_200_OK)
        else:
            follow_obj.delete()
            return Response({'message':"Success"}, status=status.HTTP_200_OK)
