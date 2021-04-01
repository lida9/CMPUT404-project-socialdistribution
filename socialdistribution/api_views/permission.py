from rest_framework import permissions
from rest_framework import authentication
import base64

class AccessPermission(permissions.BasePermission):
    def has_permission(self, request, view):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        token_type, _, credentials = auth_header.partition(' ')

        expected = base64.b64encode(b'socialdistribution_t18:c404t18').decode()
        if token_type == 'Basic' and credentials == expected:
            return True
        else:
            return False

class CustomAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        token_type, _, credentials = auth_header.partition(' ')

        expected = base64.b64encode(b'socialdistribution_t18:c404t18').decode()
        if token_type == 'Basic' and credentials == expected:
            return (True, _)
        else:
            return None
