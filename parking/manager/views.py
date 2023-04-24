import json
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie
from .models import *
from .serializers import *
from rest_framework.views import APIView
from rest_framework import status
from rest_framework.response import Response

from cloudinary.uploader import upload
from cloudinary.uploader import rename
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt
from rest_framework import permissions
import cloudinary
from cloudinary import CloudinaryImage
import numpy as np
import cv2
import urllib.request

from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate, login



from ModelAI import model_AI, lib_findcontours, lib_detection
import cloudinary.utils
import cloudinary.api


from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .consumers import MyConsumer

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
        print("HaVE REQUEST")
        serializer = ImageSerializer(data=request.data)
        if serializer.is_valid():
            image = request.data.get('image')
            
            # upload ảnh lên cloud
            uploaded_image = upload(image, folder='image/license_plate_upload')
            
            # lấy link ảnh
            cloudinary_url = uploaded_image['secure_url']
            # cloudinary_url = "https://res.cloudinary.com/dzdfqqdxs/image/upload/v1681454668/image/license_plate_upload/30F50483%202023-04-14%2006:44:32.154835%2B00:00.jpg.jpg"
            arr = np.asarray(bytearray(urllib.request.urlopen(cloudinary_url).read()), dtype=np.uint8)
            image = cv2.imdecode(arr, -1) 
            
            # lưu ảnh vào thư mục
            folder_url = 'static/image/'
            name_image = "image-temp.jpg"
            duong_dan_luu = folder_url + name_image
            cv2.imwrite(duong_dan_luu, image)
            
            license_sample = "43A395653"
            text = ""
            if image is not None:
                text = model_AI.mode_AI(image)

                
                # cv2.imshow('Image from Cloudinary', image)
                # cv2.waitKey(0)
                # cv2.destroyAllWindows()
            else:
                print('Failed to load image from Cloudinary')
                
            # websocket
            print(text)
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
            "test_channel",
            {
                "type": "connection_established",
                "message": cloudinary_url
            }
            )
            
            if text == license_sample:
                new_filename ="image/license_plate_upload/" + text + " " +  str(timezone.now()) +  ".jpg"
                uploaded_image = rename(uploaded_image['public_id'], new_filename)
                serializer.save(name = text,image = uploaded_image['secure_url'])
                # Thêm log vào database
                my_data = {'vehicle': text}
                logSerializer = LogSerializer(data=my_data)
                if logSerializer.is_valid():
                    logSerializer.save()
                    return Response(1,status=201)
                return Response(logSerializer.errors, status=status.HTTP_400_BAD_REQUEST)
                
            else:
                text = "undefined-vehicle"
                new_filename ="image/license_plate_upload/" + text + " " +  str(timezone.now()) +  ".jpg"
                uploaded_image = rename(uploaded_image['public_id'], new_filename)
                serializer.save(name = text,image = uploaded_image['secure_url'])
                return Response(0, status=400)   
        else:
            return Response(0, status=400)
        
    
    def put(self, request):
        text = "30F-123123"
        my_data = {'vehicle': text}
        vehicle = my_data['vehicle']
        try:
            log = Log.objects.filter(vehicle=vehicle).first()
        except Log.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = LogSerializer(log, data=my_data, partial=True)
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
    
# API for Slot
class SlotApiView(APIView):
    def put(self, request):
        var1 = request.POST.get('var1')
        var2 = request.POST.get('var2')
        var3 = request.POST.get('var3')
        var4 = request.POST.get('var4')
        try:
            slot = Slot.objects.filter(id=id).first()
        except Slot.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = SlotSerializer(slot, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

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
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        print("HaVE REQUEST")
        serializer = ImageSerializer(data=request.data)
        if serializer.is_valid():
            image = request.data.get('image')
            
            # upload ảnh lên cloud
            uploaded_image = upload(image, folder='image/license_plate_upload')
            
            # lấy link ảnh
            cloudinary_url = uploaded_image['secure_url']
            # cloudinary_url = "https://res.cloudinary.com/dzdfqqdxs/image/upload/v1681454668/image/license_plate_upload/30F50483%202023-04-14%2006:44:32.154835%2B00:00.jpg.jpg"
            arr = np.asarray(bytearray(urllib.request.urlopen(cloudinary_url).read()), dtype=np.uint8)
            image = cv2.imdecode(arr, -1) 
            
            # lưu ảnh vào thư mục
            folder_url = 'static/image/'
            name_image = "image-temp.jpg"
            duong_dan_luu = folder_url + name_image
            cv2.imwrite(duong_dan_luu, image)
            
            license_sample = "43A39565"
            text = ""
            if image is not None:
                text = model_AI.mode_AI(image)

                
                # cv2.imshow('Image from Cloudinary', image)
                # cv2.waitKey(0)
                # cv2.destroyAllWindows()
            else:
                print('Failed to load image from Cloudinary')
                
            # websocket
            print(text)
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
            "test_channel",
            {
                "type": "connection_established",
                "message": cloudinary_url
            }
            )
            
            if text == license_sample:
                new_filename ="image/license_plate_upload/" + text + " " +  str(timezone.now()) +  ".jpg"
                uploaded_image = rename(uploaded_image['public_id'], new_filename)
                serializer.save(name = text,image = uploaded_image['secure_url'])
                return Response(1,status=201)
            else:
                text = "undefined-vehicle"
                new_filename ="image/license_plate_upload/" + text + " " +  str(timezone.now()) +  ".jpg"
                uploaded_image = rename(uploaded_image['public_id'], new_filename)
                serializer.save(name = text,image = uploaded_image['secure_url'])
                return Response(0, status=400)   
        else:
            return Response(0, status=400)
        
class CustomObtainAuthToken(ObtainAuthToken):
    serializer_class = AccountSerializer
    def post(self, request, *args, **kwargs):
        # Lấy dữ liệu POST request
        email = request.data.get('email')
        password = request.data.get('password')
        print(email + " " + password)
        # Kiểm tra email và mật khẩu hợp lệ
        if email is None or password is None:
            return Response({'error': 'Please provide both username and password'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Lấy tài khoản người dùng
        user = authenticate(email=email, password=password)
        print(user)

        if not user:
            return Response({'error': 'Invalid Credentials'},
                            status=status.HTTP_404_NOT_FOUND)
        # Tạo hoặc lấy token xác thực
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response(status=200)

          
def get_home(request):
    # cloudinary_url = "https://res.cloudinary.com/dzdfqqdxs/image/upload/v1680857993/image/cars_upload/img_130_z1ed4g.jpg"
    # arr = np.asarray(bytearray(urllib.request.urlopen(cloudinary_url).read()), dtype=np.uint8)
    # image = cv2.imdecode(arr, -1)
    
    # folder_url = 'static/image/'
    # name_image = "anh12.jpg"
    # duong_dan_luu = folder_url + name_image
    # cv2.imwrite(duong_dan_luu, image)
    # # image = cv2.resize(800,800)
    # cv2.imshow('Image from Cloudinary', image)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()
    
    # text = model_AI.mode_AI(image)
    # print(text)
    
    return render(request, "home.html")
