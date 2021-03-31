from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from socialdistribution.models import Author, Follow
from socialdistribution.serializers import AuthorSerializer, FollowSerializer
from .helper import is_valid_node, get_followers_objects, get_followings_objects
from .permission import AccessPermission, CustomAuthentication

@api_view(['GET'])
@authentication_classes([CustomAuthentication])
@permission_classes([AccessPermission])
def follower_list(request, authorID): # GET: get a list of authors who are their followers
    valid = is_valid_node(request)
    if not valid:
        return Response({"message":"Node not allowed"}, status=status.HTTP_403_FORBIDDEN)

    followers = get_followers_objects(authorID)
    return Response({"type": "followers","items":followers}, status=status.HTTP_200_OK)

@api_view(['GET'])
@authentication_classes([CustomAuthentication])
@permission_classes([AccessPermission])
def following_list(request, authorID): # GET: get a list of authors who they are following
    valid = is_valid_node(request)
    if not valid:
        return Response({"message":"Node not allowed"}, status=status.HTTP_403_FORBIDDEN)

    followings = get_followings_objects(authorID)
    return Response({"type": "followings","items":followings}, status=status.HTTP_200_OK)

@api_view(['GET', 'DELETE', 'PUT'])
@authentication_classes([CustomAuthentication])
@permission_classes([AccessPermission])
def follower(request, authorID, foreignAuthorID):
    valid = is_valid_node(request)
    if not valid:
        return Response({"message":"Node not allowed"}, status=status.HTTP_403_FORBIDDEN)

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

        else: # indeed a follower
            follow_obj.delete()

            try: # if the follower is local, do nothing
                follow_author = Author.objects.get(authorID=foreignAuthorID) # get the author being followed
                return Response({'message':'Success!'}, status=status.HTTP_200_OK)

            except Author.DoesNotExist: # if the follower is remote, need to put to their server
                url = 'https://citrusnetwork.herokuapp.com/service/author/' + authorID + '/followers/' + foreignAuthorID + '/'
                r = requests.delete(url, auth=('CitrusNetwork','oranges'))
                if r.status_code == 201:
                    return Response({'message':'Success!'}, status=status.HTTP_200_OK)
