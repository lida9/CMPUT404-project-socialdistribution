from django.shortcuts import render, get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from socialdistribution.models import *
from socialdistribution.serializers import *
from .helper import get_valid_nodes
import requests

@api_view(['GET', 'POST', 'DELETE'])
def inbox_detail(request, authorID):
    host = request.build_absolute_uri("/")
    print(host)
    if host not in ["http://127.0.0.1:8000/", "http://localhost:8000/", "https://cmput-404-socialdistribution.herokuapp.com/"]:
        # check valid node
        valid_nodes = get_valid_nodes()
        if host not in valid_nodes:
            return Response({"message":"Node not allowed"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        # get everything in the inbox
        #res = requests.get('https://citrusnetwork.herokuapp.com/service/authors/').json()

        obj, created = Inbox.objects.get_or_create(authorID=authorID)
        serializer = InboxSerializer(obj)
        return Response(serializer.data)

    elif request.method == 'POST':
        content_type = request.data['type'] # post/follow/like

        if content_type == 'post':
            postID = request.data['postID']
            post_authorID = request.data['authorID']
            # check if the post if from remote server
            if Author.objects.filter(authorID=post_authorID).exists():
                # local author
                post = Post.objects.get(postID=postID)
                item_serializer = PostSerializer(post)
                data = item_serializer.data
            else:
                # remote author
                data = {"type":"post", "postID":postID, "authorID":post_authorID}
            inbox, _ = Inbox.objects.get_or_create(authorID=authorID)
            inbox.items.insert(0, data) # append to items list
            inbox.save()
            return Response({'message':'sent successfully!'}, status=status.HTTP_200_OK)

        elif content_type == 'follow':
            # remote = False
            # author = get_object_or_404(Author, authorID=authorID)

            # new_follower_ID = request.data['new_follower_ID']
            # try:
            #     new_follower = Author.objects.get(authorID=new_follower_ID)
            # except Author.DoesNotExist: # lookup in remote server
            #     # todo
            #     remote = True

            # if not remote:
            #     # append to follow database if needed
            #     friend_object, created = Follow.objects.get_or_create(current_user=author)
            #     if new_follower not in friend_object.users.all():
            #         Follow.follow(author, new_follower)
            # if remote: # todo
            #     pass

            new_follower_ID = request.data['new_follower_ID']
            if not Follow.objects.filter(author1=authorID, author2=new_follower_ID).exists():
                follow = Follow(author1=authorID, author2=new_follower_ID) # let new follower follow author
                follow.save()

            new_follower = get_object_or_404(Author, authorID=new_follower_ID)
            author = get_object_or_404(Author, authorID=authorID)
            actor_name = new_follower.username
            object_name = author.username
            summary = actor_name + " wants to follow " + object_name
            new_follower_serialized = AuthorSerializer(new_follower).data
            author_serialized = AuthorSerializer(author).data

            inbox, _ = Inbox.objects.get_or_create(authorID=authorID)
            inbox.items.insert(0, {"type": "Follow","summary":summary,"actor":new_follower_serialized,"object":author_serialized}) # append to items list
            inbox.save()
            return Response({'message':'sent successfully!'}, status=status.HTTP_200_OK)

        elif content_type == 'like':
            data = request.data
            like_sum = request.data['summary']
            if ("post" in like_sum):
                data['author_write_article_ID'] = authorID
                # get author who likes and send to liked
                author_like_ID = data['author_like_ID']
                item_serializer = LikePostSerializer(data=data)
                if item_serializer.is_valid():
                    item_serializer.save() # save the item to the other form in db
                else:
                    return Response({'message':item_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

                inbox, _ = Inbox.objects.get_or_create(authorID=authorID)
                inbox.items.insert(0, item_serializer.data) # append to items list
                inbox.save()
                liked,_ = Liked.objects.get_or_create(authorID=author_like_ID)
                liked.items.insert(0, item_serializer.data) # append to items list
                liked.save()
                return Response({'message':'sent successfully!'}, status=status.HTTP_200_OK)

            elif("comment" in like_sum):
                data['author_write_article_ID'] = authorID
                commentID= data['commentID']
                comment = Comment.objects.get(commentID = commentID)
                #get the author who write the comment and send like to their inbox
                author_comment_ID = comment.author_write_comment_ID
                # get author who likes and send to liked
                author_like_ID = data['author_like_ID']

                item_serializer = LikeCommentSerializer(data=data)
                if item_serializer.is_valid():
                    item_serializer.save() # save the item to the other form in db
                else:
                    return Response({'message':item_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

                inbox, _ = Inbox.objects.get_or_create(authorID=author_comment_ID)
                inbox.items.insert(0, item_serializer.data) # append to items list
                inbox.save()
                liked,_ = Liked.objects.get_or_create(authorID=author_like_ID)
                liked.items.insert(0, item_serializer.data) # append to items list
                liked.save()
                return Response({'message':'sent successfully!'}, status=status.HTTP_200_OK)

    elif request.method == 'DELETE':
        inbox, created = Inbox.objects.get_or_create(authorID=authorID)
        if not created:
            # if not just created then delete, if just created then the inbox is empty
            inbox.delete()
        return Response({'message':'inbox cleared'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def friendrequest(request, authorID, foreignAuthorID):
    type = request.data['type']
    if type == 'accept':
        # author will follow foreign author then they are friend
        if not Follow.objects.filter(author1=foreignAuthorID, author2=authorID).exists():
            follow = Follow(author1=foreignAuthorID, author2=authorID)
            follow.save()
        return Response({'message':'Success!'}, status=status.HTTP_200_OK)

    elif type == 'reject':
        return Response({'message':'Success!'}, status=status.HTTP_200_OK)
