from socialdistribution.models import Node
from socialdistribution.serializers import NodeSerializer

# return a list of valid nodes(hosts)
def get_valid_nodes():
    nodes = Node.objects.all()
    node_serializer = NodeSerializer(nodes, many=True)
    valid_nodes = []
    for n in node_serializer.data:
        valid_nodes.append(n["host"])
    return valid_nodes
