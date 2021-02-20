<<<<<<< HEAD
from rest_framework import serializers
from .models import *

class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['authorID', 'email', 'username', 'password', 'github']

    def save(self):
        author = Author(
            email=self.validated_data['email'],
            username=self.validated_data['username'],
            github=self.validated_data['github']
        )
        password = self.validated_data['password']
        author.set_password(password)
        author.save()
        return author


class AuthorSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='get_id')
    host = serializers.URLField(source='get_host')
    displayName = serializers.CharField(source='username')
    url = serializers.CharField(source='get_id')

    class Meta:
        model = Author
        fields = ['id', 'host', 'displayName', 'url', 'github']


class PostSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='get_post_id', required=False)
    comments = serializers.URLField(source='get_comments_url', required=False)

    def to_representation(self, instance):
        response = super(PostSerializer, self).to_representation(instance)
        author = Author.objects.get(authorID=instance.authorID)
        author_serializer = AuthorSerializer(author)
        del response['authorID']
        del response['postID']
        response['author'] = author_serializer.data # add author data

        return response

    class Meta:
        model = Post
        fields = ['title', 'id', 'authorID', 'postID', 'source', 'origin', 'description', 'contentType',
            'content', 'count', 'comments', 'published', 'visibility', 'unlisted']


class FriendSerializer(serializers.ModelSerializer):
    # the follower
    id = serializers.CharField(source='get_id')

    class Meta:
        model = Friend
        fields = ['type', 'id', 'url', 'host', 'displayName', 'github']

class FriendRequestSerializer(serializers.ModelSerializer):
    summary = serializers.CharField(max_length=20)
    actor = AuthorSerializer()
    object = FriendSerializer()
    """ terminology: Greg wants to follow Lara
    Greg is the actor
    Lara is the object """

    class Meta:
        model = FriendRequest
        fields = ['type', 'summary', 'actor', 'object']

    def sendRequest(self, instance):
        sender = self.validated_data.get('sender')
        friend_serializer = FriendSerializer(data=sender)
        friend_serializer.is_valid()
        friend_serializer.save()
        actor = Friend.objects.get(id=requestor_data.get('id'))

        receiver = self.validated_data.get('receiver')
        object = get_object_or_404(Profile, id=friend_data.get('id'))
        if object not in Follow.objects.following(instance.authorID):
            Follow.objects.add_follower(instance.authorID, object)
=======
from rest_framework import serializers
from .models import *

class RegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['authorID', 'email', 'username', 'password', 'github']
    
    def save(self):
        author = Author(
            email=self.validated_data['email'],
            username=self.validated_data['username'],
            github=self.validated_data['github']
        )
        password = self.validated_data['password']
        author.set_password(password)
        author.save()
        return author


class AuthorSerializer(serializers.ModelSerializer):
    type = serializers.CharField(source='get_type', required=False)
    id = serializers.CharField(source='get_id')
    host = serializers.URLField(source='get_host')
    displayName = serializers.CharField(source='username')
    url = serializers.CharField(source='get_id')

    class Meta:
        model = Author
        fields = ['type', 'id', 'host', 'displayName', 'url', 'github']


class PostSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source='get_post_id', required=False)
    comments = serializers.URLField(source='get_comments_url', required=False)
    type = serializers.CharField(source='get_type', required=False)

    def to_representation(self, instance):
        response = super(PostSerializer, self).to_representation(instance)
        author = Author.objects.get(authorID=instance.authorID)
        author_serializer = AuthorSerializer(author)
        del response['authorID']
        del response['postID']
        response['author'] = author_serializer.data # add author data
        
        return response

    class Meta:
        model = Post
        fields = ['type', 'title', 'id', 'authorID', 'postID', 'source', 'origin', 'description', 'contentType', 
            'content', 'count', 'comments', 'published', 'visibility', 'unlisted']

>>>>>>> master
