from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from socialdistribution.models import Author, Follow
from .helper import is_valid_node, get_followings_objects
from .permission import AccessPermission, CustomAuthentication
import requests, json

@api_view(['GET'])
@authentication_classes([CustomAuthentication])
@permission_classes([AccessPermission])
def following_list(request, authorID): # GET: get a list of authors who they are following
    valid = is_valid_node(request)
    if not valid:
        return Response({"message":"Node not allowed"}, status=status.HTTP_403_FORBIDDEN)

    followings = get_followings_objects(authorID)
    return Response({"type": "followings","items":followings}, status=status.HTTP_200_OK)

@api_view(['DELETE'])
@authentication_classes([CustomAuthentication])
@permission_classes([AccessPermission])
def unfollow(request, authorID, foreignAuthorID):
    valid = is_valid_node(request)
    if not valid:
        return Response({"message":"Node not allowed"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "DELETE": # stop author from following foreign author
        try:
            follow_obj = Follow.objects.get(author1=foreignAuthorID, author2=authorID) # author2 follows author1
        except Follow.DoesNotExist:
            # not a follower
            return Response({'message':"Not a follower"}, status=status.HTTP_200_OK)
        else:
            follow_obj.delete()
            try: # if the following is local, do nothing
                follow_author = Author.objects.get(authorID=foreignAuthorID) # get the author being followed

            except Author.DoesNotExist: # if the following is remote, need to put to their server
                url = 'https://citrusnetwork.herokuapp.com/service/author/' + foreignAuthorID + '/followers/' + authorID + '/'
                r = requests.delete(url, auth=('CitrusNetwork','oranges'))
                if r.status_code == 200:
                    return Response({'message':'Success!'}, status=status.HTTP_200_OK)
            return Response({'message':'Success!'}, status=status.HTTP_200_OK)
