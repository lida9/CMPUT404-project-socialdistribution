from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework import status
from .models import Author
from .serializers import *


@api_view(['POST'])
def register(request):
    serializer = RegistrationSerializer(data=request.data)
    data = {}
    if serializer.is_valid(): # make sure data match the model
        author = serializer.save()
        data['authorID'] = author.authorID
        return JsonResponse(data, status=status.HTTP_201_CREATED)
    else:
        return JsonResponse(data, status=status.HTTP_422_UNPROCESSABLE_ENTITY)


@api_view(['GET', 'POST'])
def author_detail(request, authorID):
    if request.method == "GET":
        author = get_object_or_404(Author, authorID=authorID)

        serializer = AuthorSerializer(author)
        return JsonResponse(serializer.data, safe=False)

    # elif request.method == "POST":
    #     serializer = AuthorSerializer(data=request.data)
    #     if serializer.is_valid(): # make sure data match the model
    #         serializer.save()
    #         data = {"count": 333, 'adf': "dafa"}
    #         return JsonResponse(data, status=status.HTTP_201_CREATED)
    #     return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def Post(request):
    return HttpResponse("<h1> posssssssstT</h1>")
