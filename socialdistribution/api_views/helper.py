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

def get_list_ids():
    req = requests.get('https://citrusnetwork.herokuapp.com/service/authors/').json()
    ids = []
    authors = req["items"]
    for i in authors:
        ids.append(i["id"])
    return ids

def find_remote_author_by_id(id):
    req = requests.get('https://citrusnetwork.herokuapp.com/service/authors/').json()
    ids = []
    authors = req["items"]
    for i in authors:
        ids.append(i["id"])

    index = ids.index(id)
    return authors[index]

def get_followers_objects(authorID):
    follow_obj = Follow.objects.filter(author1=authorID)
    follow_serializer = FollowSerializer(follow_obj, many=True)
    followers = []
    for f in follow_serializer.data:
        follower_ID = f['author2']
        try:
            follower = Author.objects.get(authorID=follower_ID) # get author2
            serializer = AuthorSerializer(follower)
            followers.append(serializer.data)
        except Author.DoesNotExist:
            remote = get_list_ids()
            if new_follower_ID in remote: # the follower is remote
                follower = find_remote_author_by_id(new_follower_ID)
                followers.append(follower)
    return followers
