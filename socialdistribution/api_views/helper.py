from socialdistribution.models import Node, Author, Follow
from socialdistribution.serializers import NodeSerializer, AuthorSerializer, FollowSerializer

# return a list of valid nodes(hosts)
def get_valid_nodes():
    nodes = Node.objects.all()
    node_serializer = NodeSerializer(nodes, many=True)
    valid_nodes = []
    for n in node_serializer.data:
        valid_nodes.append(n["host"])
    return valid_nodes

def get_followers_objects(authorID):
    follow_obj = Follow.objects.filter(author1=authorID)
    follow_serializer = FollowSerializer(follow_obj, many=True)
    followers = []
    for f in follow_serializer.data:
        try:
            follower = Author.objects.get(authorID=f['author2']) # get author2
            serializer = AuthorSerializer(follower)
            followers.append(serializer.data)
        except Author.DoesNotExist:
            # probably on remote server
            print("remote")
        
    return followers
