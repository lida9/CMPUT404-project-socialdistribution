from django.shortcuts import get_object_or_404, redirect
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework import status
from socialdistribution.models import Author
from socialdistribution.serializers import RegistrationSerializer, AuthorSerializer
from django.db.models import Q
from .helper import is_valid_node
from .permission import AccessPermission, CustomAuthentication

@api_view(['GET', 'POST'])
@authentication_classes([CustomAuthentication])
@permission_classes([AccessPermission])
def register(request):
    valid = is_valid_node(request)
    if not valid:
        return Response({"message":"Node not allowed"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "GET":
        # get all authors sort by display name
        authors = Author.objects.filter(~Q(email="team18@admin.com")).order_by('username')
        serializer = AuthorSerializer(authors, many=True)
        return Response(serializer.data)

    else:
        # register an account
        if Author.objects.filter(email=request.data["email"]).exists():
            return Response({'message':"Email already in use"}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
        serializer = RegistrationSerializer(data=request.data)
        if serializer.is_valid(): # make sure data match the model
            author = serializer.save()
            return Response({'authorID':author.authorID}, status=status.HTTP_201_CREATED)
        else:
            return Response({'message':serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'POST'])
@authentication_classes([CustomAuthentication])
@permission_classes([AccessPermission])
def author_detail(request, authorID):
    valid = is_valid_node(request)
    if not valid:
        return Response({"message":"Node not allowed"}, status=status.HTTP_403_FORBIDDEN)

    if request.method == "GET":
        # get author data
        author = get_object_or_404(Author, authorID=authorID)
        serializer = AuthorSerializer(author)
        return Response(serializer.data)

    elif request.method == "POST":
        data = request.data
        author = get_object_or_404(Author, authorID=authorID)
        serializer = AuthorSerializer(author, data=data)
        if serializer.is_valid():
            if "password" in data:
                author.set_password(data['password'])
            if 'username' in data:
                author.username = data['username']
            if 'email' in data:
                new_email = data['email'].lower()
                # check new email doesn't already exists
                if author.email != new_email and Author.objects.filter(email=new_email).exists():
                    return Response({'message':'email already exists'}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
                author.email = new_email
            author.save()
            serializer.save()
            return Response({'message':'Updated Successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@authentication_classes([CustomAuthentication])
@permission_classes([AccessPermission])
def login_view(request):
    user = authenticate(email=request.data['email'].lower(), password=request.data['password'])
    if user is not None:
        return Response({'authorID':user.authorID}, status=status.HTTP_200_OK)
    else:
        return Response({'message':"incorrect email or password"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['GET'])
def logout_view(request):
    host = request.build_absolute_uri("/")
    if host == "http://127.0.0.1:8000/":
        return redirect("http://localhost:3000/login")
    else:
        return redirect("https://cmput-404-socialdistribution.herokuapp.com/login")
