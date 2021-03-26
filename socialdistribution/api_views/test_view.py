from django.shortcuts import render
from django.shortcuts import get_object_or_404
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

import requests
@api_view([ 'GET'])
def test_view(request):
    print("hellooo")
    if request.method == "GET":
        msg = requests.get('https://citrusnetwork.herokuapp.com/service/authors/').json()
        print(msg)