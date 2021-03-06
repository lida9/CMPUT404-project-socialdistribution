from socialdistribution.models import Node, Author, Follow
from socialdistribution.serializers import NodeSerializer, AuthorSerializer, FollowSerializer
import requests

# return a list of valid nodes(hosts)
def get_valid_nodes():
    nodes = Node.objects.all()
    node_serializer = NodeSerializer(nodes, many=True)
    valid_nodes = []
    for n in node_serializer.data:
        valid_nodes.append(n["host"])
    return valid_nodes

def is_valid_node(request):
    host = request.build_absolute_uri("/")
    if host not in ["http://127.0.0.1:8000/", "http://localhost:8000/", "https://cmput-404-socialdistribution.herokuapp.com/", 'http://testserver/']:
        # check valid node
        valid_nodes = get_valid_nodes()
        if host not in valid_nodes:
            return False
    return True

def get_list_ids():
    req = requests.get('https://citrusnetwork.herokuapp.com/service/authors/', auth=('CitrusNetwork','oranges'), headers={'Referer': "https://cmput-404-socialdistribution.herokuapp.com/"}).json()
    ids = []
    authors = req["items"]
    for i in authors:
        ids.append(i["id"])
    return ids

def find_remote_author_by_id(id):
    req = requests.get('https://citrusnetwork.herokuapp.com/service/author/'+id+'/', auth=('CitrusNetwork','oranges'), headers={'Referer': "https://cmput-404-socialdistribution.herokuapp.com/"}).json()
    return req

def get_followers_objects(authorID):
    follow_obj = Follow.objects.filter(author1=authorID)
    follow_serializer = FollowSerializer(follow_obj, many=True)
    followers = []
    remote = get_list_ids()
    for f in follow_serializer.data:
        follower_ID = f['author2']
        try:
            follower = Author.objects.get(authorID=follower_ID) # get author2
            serializer = AuthorSerializer(follower)
            followers.append(serializer.data)
        except Author.DoesNotExist:
            if follower_ID in remote: # the follower is remote
                follower = find_remote_author_by_id(follower_ID)
                followers.append(follower)
    return followers

def get_followings_objects(authorID):
    objects = Follow.objects.filter(author2=authorID) # all objects where author is a follower
    objects_serializer = FollowSerializer(objects, many=True)
    followings = []
    remote = get_list_ids()
    for f in objects_serializer.data:
        following_ID = f['author1']
        try:
            following_author = Author.objects.get(authorID=following_ID) # get the author being followed
            serializer = AuthorSerializer(following_author)
            followings.append(serializer.data)
        except Author.DoesNotExist:
            if following_ID in remote: # the remote author being followed
                following_author = find_remote_author_by_id(following_ID)
                followings.append(following_author)
    return followings
