from rest_framework import permissions
from rest_framework import authentication
import base64

local = ["http://127.0.0.1:8000/", "http://localhost:8000/", "https://cmput-404-socialdistribution.herokuapp.com/"]
class AccessPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        # check if host
        host = request.build_absolute_uri("/")
        if host in local:
            return True

        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        token_type, _, credentials = auth_header.partition(' ')

        expected = base64.b64encode(b'socialdistribution_t18:c404t18').decode()
        if token_type == 'Basic' and credentials == expected:
            return True
        else:
            return False

class CustomAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        # check if host
        host = request.build_absolute_uri("/")
        print(host)
        if host in local:
            return (True, True)

        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        token_type, _, credentials = auth_header.partition(' ')

        expected = base64.b64encode(b'socialdistribution_t18:c404t18').decode()
        if token_type == 'Basic' and credentials == expected:
            return (True, _)
        else:
            return None
