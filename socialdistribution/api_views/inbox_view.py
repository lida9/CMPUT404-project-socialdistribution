from django.shortcuts import render, get_object_or_404
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from socialdistribution.models import *
from socialdistribution.serializers import *
import requests
from .helper import is_valid_node, get_list_ids, find_remote_author_by_id, get_followings_objects
from .permission import AccessPermission, CustomAuthentication
import json


@api_view(['GET', 'POST', 'DELETE'])
@authentication_classes([CustomAuthentication])
@permission_classes([AccessPermission])
def inbox_detail(request, authorID):
    valid = is_valid_node(request)
    if not valid:
        return Response({"message":"Node not allowed"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == 'GET':
        obj, created = Inbox.objects.get_or_create(authorID=authorID)
        serializer = InboxSerializer(obj)
        output = serializer.data
        followings = get_followings_objects(authorID)
        for f in followings:
            if "authorID" not in f.keys():
                # remote author, get posts
                resp = requests.get('https://citrusnetwork.herokuapp.com/service/author/'+f['id']+'/posts', auth=('CitrusNetwork','oranges'), headers={'Referer': "https://cmput-404-socialdistribution.herokuapp.com/"}).json()
                output["items"] = resp["posts"] + output["items"]

        return Response(output)

    elif request.method == 'POST':
        content_type = request.data['type'] # post/follow/like

        if content_type == 'post':
            # get post object
            try:
                postID = request.data['postID']
                post = Post.objects.get(postID=postID)
                item_serializer = PostSerializer(post)
                data = item_serializer.data
            except Post.DoesNotExist:
                # get post from remote
                url = 'https://citrusnetwork.herokuapp.com/service/author/{}/posts/{}'.format(request.data['authorID'], postID)
                data = requests.get(url, auth=('CitrusNetwork','oranges'), headers={'Referer': "https://cmput-404-socialdistribution.herokuapp.com/"}).json()

            # add to author's inbox
            try:
                Author.objects.get(authorID=authorID) # check if local author
                inbox, _ = Inbox.objects.get_or_create(authorID=authorID)
                inbox.items.insert(0, data) # append to items list
                inbox.save()
                return Response({'message':'sent successfully!'}, status=status.HTTP_200_OK)
            except Author.DoesNotExist:
                # remote author
                url = 'https://citrusnetwork.herokuapp.com/service/author/' + authorID + '/inbox/'
                r = requests.post(url, data=json.dumps(data), auth=('CitrusNetwork','oranges'), headers={'Referer': "https://cmput-404-socialdistribution.herokuapp.com/"})
                if r.status_code == 201:
                    return Response({'message':'sent successfully!'}, status=status.HTTP_200_OK)
                else:
                    return Response({'message':'some error occurred'}, status=status.HTTP_400_BAD_REQUEST)

        elif content_type == 'follow':
            new_follower_ID = request.data['new_follower_ID']
            try:
                # check if being followed is remote author, authorID is remote
                being_followed = Author.objects.get(authorID=authorID)
            except Author.DoesNotExist:
                if not Follow.objects.filter(author1=authorID, author2=new_follower_ID).exists():
                    follow = Follow(author1=authorID, author2=new_follower_ID)
                    follow.save()
                new_data = {"type":"Follow"}
                author = get_object_or_404(Author, authorID=new_follower_ID)
                actor_name = author.username

                remote_object= find_remote_author_by_id(authorID) # remote author is object
                object_name = remote_object["displayName"]

                summary = actor_name + " wants to follow " + object_name
                author_serialized = AuthorSerializer(author).data

                new_data['summary'] = summary
                new_data['actor'] = author_serialized
                new_data['object'] = remote_object

                url = 'https://citrusnetwork.herokuapp.com/service/author/' + authorID + '/inbox/'
                r = requests.post(url, data=json.dumps(new_data), auth=('CitrusNetwork','oranges'), headers={'Referer': "https://cmput-404-socialdistribution.herokuapp.com/"})

                if r.status_code < 400:
                    return Response({'message':'Success!'}, status=status.HTTP_200_OK)
                else:
                    return Response({'message':item_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
                 
            try:
                new_follower = Author.objects.get(authorID=new_follower_ID)
            except Author.DoesNotExist:
                remote = get_list_ids()
                if new_follower_ID in remote: # the follower is remote
                    if not Follow.objects.filter(author1=authorID, author2=new_follower_ID).exists():
                        follow = Follow(author1=authorID, author2=new_follower_ID)
                        follow.save()

                    author = get_object_or_404(Author, authorID=authorID)
                    object_name = author.username

                    actor = find_remote_author_by_id(new_follower_ID)
                    actor_name = actor["displayName"]

                    summary = actor_name + " wants to follow " + object_name
                    new_follower_serialized = actor
                    author_serialized = AuthorSerializer(author).data

                    inbox, _ = Inbox.objects.get_or_create(authorID=authorID)
                    inbox.items.insert(0, {"type": "Follow","summary":summary,"actor":new_follower_serialized,"object":author_serialized}) # append to items list
                    inbox.save()
                    return Response({'message':'sent successfully!'}, status=status.HTTP_200_OK)

                else: # the follower doesn't exist
                    return Response({'message': 'follower does not exist'}, status=status.HTTP_400_BAD_REQUEST)

            # author and new follower both local
            if not Follow.objects.filter(author1=authorID, author2=new_follower_ID).exists():
                follow = Follow(author1=authorID, author2=new_follower_ID) # let new follower follow author
                follow.save()
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
                # get author who was liked
                try: 
                    Author.objects.get(authorID=authorID)
                    # get the author who sends the like
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
                except Author.DoesNotExist:
                    get_author_url = 'https://citrusnetwork.herokuapp.com/service/author/' + authorID
                    r_author = requests.get(get_author_url, auth=('CitrusNetwork','oranges'), headers={'Referer': "https://cmput-404-socialdistribution.herokuapp.com/"})
                    if r_author.status_code == 200:
                        postID = data["postID"]
                        new_data = {"type":"Like"}
                        author_who_liked = Author.objects.get(authorID = data['author_like_ID'])
                        serializer = AuthorSerializer(author_who_liked)
                        new_data['author'] = serializer.data
                        new_data['summary'] = author_who_liked.username + " Likes your post"
                        new_data['@context'] = "https://www.citrusnetwork.herokuapp.com/service/author/" + authorID + "/view-post/" + postID + "/"
                        new_data['object'] = "https://www.citrusnetwork.herokuapp.com/service/author/"+ authorID +"/posts/"+postID
                        new_data['postID'] = postID

                        inbox_url = 'https://citrusnetwork.herokuapp.com/service/author/' + authorID + '/inbox/'
                        response = requests.post(inbox_url, data=json.dumps(new_data), auth=('CitrusNetwork','oranges'), headers={'Referer': "https://cmput-404-socialdistribution.herokuapp.com/"})
                        if response.status_code == 201:
                            return Response({'message':'sent successfully!'}, status=status.HTTP_200_OK)
                        else:
                            return Response({'message':'some error occurred'}, status=status.HTTP_400_BAD_REQUEST)
                    elif  r_author.status_code == 404: 
                        return Response({'message':'no user found'}, status=status.HTTP_404_NOT_FOUND)
                    else:
                         return Response({'message':'service unavailable'}, status=status.HTTP_504_GATEWAY_TIMEOUT)              

            elif("comment" in like_sum):
                data['author_write_article_ID'] = authorID
                postID = data["postID"]
                commentID= data['commentID']
                try: 
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
                except Comment.DoesNotExist:
                    get_comment_url = "https://citrusnetwork.herokuapp.com/service/author/"+data['author_write_article_ID']+ "/posts/"+data["postID"]+"/comment/"
                    r_comment = requests.get(get_comment_url, auth=('CitrusNetwork','oranges'), headers={'Referer': "https://cmput-404-socialdistribution.herokuapp.com/"})
                    if r_comment.status_code == 200:
                        author_who_liked = Author.objects.get(authorID = data['author_like_ID'])
                        serializer = AuthorSerializer(author_who_liked)
                        commentID = data['commentID']

                        new_data = {"type":"Like"}
                        new_data['object'] = "https://www.citrusnetwork.herokuapp.com/service/author/"+ data['author_write_article_ID'] +"/posts/"+data["postID"]+"/comment/"+commentID
                        new_data['author'] = serializer.data
                        new_data['summary'] = author_who_liked.username + " Likes your comment"
                        new_data["@context"] =  "https://www.citrusnetwork.herokuapp.com/service/author/"+data['author_write_article_ID']+"/view-post/"+data["postID"]+"/comment/"+commentID+"/"
                        new_data['postID'] = postID
                        new_data['commentID'] = commentID
                        
                        inbox_url = 'https://citrusnetwork.herokuapp.com/service/author/' + data['author_write_article_ID'] + '/inbox/'
                        response = requests.post(inbox_url, data=json.dumps(new_data), auth=('CitrusNetwork','oranges'), headers={'Referer': "https://cmput-404-socialdistribution.herokuapp.com/"})
                        if response.status_code == 201:
                            return Response({'message':'sent successfully!'}, status=status.HTTP_200_OK)
                        else:
                            return Response({'message':'some error occurred'}, status=status.HTTP_400_BAD_REQUEST)
                    elif r_comment.status_code == 404:
                        return Response({'message':'no comment found'}, status=status.HTTP_404_NOT_FOUND)
                    else:
                        return Response({'message':'service unavailable'}, status=status.HTTP_504_GATEWAY_TIMEOUT)

    elif request.method == 'DELETE':
        inbox, created = Inbox.objects.get_or_create(authorID=authorID)
        if not created:
            # if not just created then delete, if just created then the inbox is empty
            inbox.delete()
        return Response({'message':'inbox cleared'}, status=status.HTTP_200_OK)

@api_view(['POST'])
@authentication_classes([CustomAuthentication])
@permission_classes([AccessPermission])
def friendrequest(request, authorID, foreignAuthorID):
    valid = is_valid_node(request)
    if not valid:
        return Response({"message":"Node not allowed"}, status=status.HTTP_403_FORBIDDEN)
    type = request.data['type']
    if type == 'accept':
        # author will follow foreign author then they are friend
        if not Follow.objects.filter(author1=foreignAuthorID, author2=authorID).exists():
            follow = Follow(author1=foreignAuthorID, author2=authorID)
            follow.save()

            try: # if the author is local, do nothing
                following_author = Author.objects.get(authorID=foreignAuthorID) # get the author being followed

            except Author.DoesNotExist: # if the author is remote, need to put to their server
                new_data = {"type":"Follow"}
                author = get_object_or_404(Author, authorID=authorID)
                actor_name = author.username

                remote_object= find_remote_author_by_id(foreignAuthorID) # remote author is object
                object_name = remote_object["displayName"]

                summary = actor_name + " wants to follow " + object_name
                author_serialized = AuthorSerializer(author).data

                new_data['summary'] = summary
                new_data['actor'] = author_serialized
                new_data['object'] = remote_object

                url = 'https://citrusnetwork.herokuapp.com/service/author/' + foreignAuthorID + '/inbox/'
                r = requests.post(url, data=json.dumps(new_data), auth=('CitrusNetwork','oranges'), headers={'Referer': "https://cmput-404-socialdistribution.herokuapp.com/"})

                if r.status_code < 400:
                    return Response({'message':'Success!'}, status=status.HTTP_200_OK)
                else:
                    return Response({'message':item_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
                    
        return Response({'message':'Success!'}, status=status.HTTP_200_OK)

    elif type == 'reject':
        return Response({'message':'Success!'}, status=status.HTTP_200_OK)


