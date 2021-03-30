from django.shortcuts import render, get_object_or_404
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from socialdistribution.models import *
from socialdistribution.serializers import *
from .helper import is_valid_node, get_followers_objects
from .permission import AccessPermission, CustomAuthentication

@api_view(['GET'])
@authentication_classes([CustomAuthentication])
@permission_classes([AccessPermission])
def friend(request, authorID):
    valid = is_valid_node(request)
    if not valid:
        return Response({"message":"Node not allowed"}, status=status.HTTP_403_FORBIDDEN)

    followers_objects = get_followers_objects(authorID) # get followers of author
    friends = []
    for f in followers_objects: # foreach follower f of author
        try:
            follower_id = f['authorID'] # get the follower id
        except KeyError:
            follower_id = f['id'] # for remote followers
        if Follow.objects.filter(author1=follower_id, author2=authorID).exists(): # check if author is also a follower of f
            friends.append(f)
    return Response({"type": "friends","items":friends}, status=status.HTTP_200_OK)
