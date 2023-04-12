import json
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import Account, Log, Vehicle, Image
from .serializers import AccountSerializer, LogSerializer, VehicleSerializer, ImageSerializer
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from cloudinary.uploader import upload
from django.utils import timezone

import cv2


from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated


class HelloWorld(APIView):
    # authentication_classes = [BasicAuthentication]
    # permission_classes = [IsAuthenticated]
    
    def get(self, request): 
        content = {'message': 'Hello, World!'}
        return Response(content)

# API for Account

class AccountApiView(APIView):
    def get(self, request, *args, **kwargs):
        # id1 = json.loads(request.body)["id"]
        id = self.request.query_params.get('id', None)
        accounts = Account.objects.filter(id=id)
        serializer = AccountSerializer(accounts, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = AccountSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self,request):
        id = json.loads(request.body)["id"]
        try:
            account = Account.objects.filter(id=id).first()
        except Account.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = AccountSerializer(account, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request):
        ids = json.loads(request.body)["ids"]    
        for id in ids:
            try:
                account = Account.objects.filter(id=id).first() 
            except Account.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
            account.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
# API for Log
    
class LogApiView(APIView):
    def get(self, request):
        logs = Log.objects.all()
        serializer = LogSerializer(logs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = LogSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request):
        ids = json.loads(request.body)["ids"]    
        for id in ids:
            try:
                account = Log.objects.filter(id=id).first() 
            except Log.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
            account.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    

# API for Vehicle
    
class VehicleApiView(APIView):
    def get(self, request):
        vehicles = Vehicle.objects.all()
        # id = self.request.query_params.get('id', None)
        # vehicles = Account.objects.filter(id=id)
        serializer = VehicleSerializer(vehicles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = VehicleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self,request):
        id = json.loads(request.body)["id"]
        try:
            account = Vehicle.objects.filter(id=id).first()
        except Vehicle.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = VehicleSerializer(account, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request):
        ids = json.loads(request.body)["ids"]
        for id in ids:
            try:
                account = Vehicle.objects.filter(id=id).first() 
            except Vehicle.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
            account.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    
# Get image from esp32

class ImageView(APIView):
    def post(self, request):
        serializer = ImageSerializer(data=request.data)
        if serializer.is_valid():
            image = request.data.get('image')
            uploaded_image = upload(image, folder='image/license_plate_upload')
            serializer.save(image = uploaded_image['secure_url'])
            return Response(status=201)
        else:
            return Response(serializer.errors, status=400)
        
        
def get_home(request):
    return render(request, "home.html")
