import json
import time
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
from rest_framework.decorators import action
from django.db import transaction

from ModelAI import model_AI, lib_findcontours, lib_detection
import cloudinary.utils
import cloudinary.api


from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .consumers import MyConsumer

from rest_framework.authentication import BasicAuthentication
from rest_framework.permissions import IsAuthenticated


checkin_path = "image/cars-checkin/"
checkout_path = "image/cars-checkout/"
class HelloWorld(APIView):
    # authentication_classes = [BasicAuthentication]
    # permission_classes = [IsAuthenticated]
    permission_classes = (permissions.AllowAny,)
    def get(self, request): 
        content = {'message': 'Hello, World!'}
        return Response(content)

# API for Account

class AccountApiView(APIView):
    def get(self, request, *args, **kwargs):
        id = self.request.query_params.get('id', None)
        if id is None:
            accounts = Account.objects.all()
            response_data = AccountSerializer(accounts, many=True).data
        else:
            accounts = Account.objects.filter(id=id)
            vehicle = Vehicle.objects.filter(user=id)
            accountSerializer = AccountSerializer(accounts, many=True)
            vehicleSerializer = VehicleSerializer(vehicle, many=True)
            response_data = {
            'user': accountSerializer.data,
            'vehicle': vehicleSerializer.data
            }

        return Response(response_data, status=status.HTTP_200_OK)
    
    def post(self, request):
        email = json.loads(request.body)["email"]
        plate = json.loads(request.body)["license_plate"]
        vehicle_pic = json.loads(request.body)["vehicle_pic"]
        serializer = AccountSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            account = Account.objects.filter(email=email).first()
            my_data = {'license_plate': plate,
                       'vehicle_pic': vehicle_pic,
                       "user": account.id}
            vehicleSerializer = VehicleSerializer(data=my_data)
            if vehicleSerializer.is_valid():
                vehicleSerializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
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
        print(ids)
        try:
            if not isinstance(ids, list):
                return Response({"error": "The ids parameter must be a list."}, status=status.HTTP_400_BAD_REQUEST)
            for id in ids:
                try:
                    account = Account.objects.filter(id=id).first()
                except Account.DoesNotExist:
                    return Response("Account not found",status=status.HTTP_404_NOT_FOUND)
                account.delete()          
            return Response("Delete successfully",status=201)
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON data."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
        # Trả về phản hồi khi có lỗi xảy ra
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
# API for Log
    
class LogApiView(APIView):
    permission_classes = (permissions.AllowAny,)
    def get(self, request):
        vehicle = self.request.query_params.get('vehicle', None)
        if vehicle is None:
            id = Log.objects.all()
        else:
            id = Log.objects.filter(vehicle=vehicle)
        serializer = LogSerializer(id, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        print("HAVE REQUEST")
        serializer = ImageSerializer(data=request.data)
        if serializer.is_valid():
            image = request.data.get('image')
            
            # upload ảnh lên cloud
            uploaded_image = upload(image, folder=checkin_path)
            
            # lấy link ảnh
            cloudinary_url = uploaded_image['secure_url']
            arr = np.asarray(bytearray(urllib.request.urlopen(cloudinary_url).read()), dtype=np.uint8)
            image = cv2.imdecode(arr, -1) 
            
            # lưu ảnh vào thư mục
            folder_url = 'static/image/'
            name_image = "image-temp.jpg"
            duong_dan_luu = folder_url + name_image
            cv2.imwrite(duong_dan_luu, image)
            
            resultDetection = ""
            if image is not None:
                try:
                    resultDetection = model_AI.mode_AI(image)
                except:
                    return Response(2,status=201)
                # cv2.imshow('Image from Cloudinary', image)
                # cv2.waitKey(0)
                # cv2.destroyAllWindows()
            else:
                print('Failed to load image from Cloudinary')
            
            print(resultDetection)
            if resultDetection == "None":
                return Response("N",status=201)
           
            # Upload ảnh lên cloud
            vehicle = Vehicle.objects.filter(license_plate = resultDetection).first()

            if vehicle is not None:
                vehicle_id = resultDetection
                log = Log.objects.filter(vehicle=vehicle_id, time_out__isnull=True).first()
                user = Account.objects.filter(email=vehicle.user).first()
                new_filename =checkin_path + "check in-" + resultDetection + " " +  str(timezone.now())
                uploaded_image = rename(uploaded_image['public_id'], new_filename)
                my_data = {'vehicle': resultDetection,
                        'image_in': uploaded_image['secure_url']}
                logSerializer = LogSerializer(data=my_data)
                serializer.save(name = resultDetection,image = uploaded_image['secure_url'])
                # Kiểm tra có tồn tại xe tại bãi chưa
                if log is not None and log.time_out is None:
                    message = {
                        "notification": "This vehicle is existed",
                        "image": uploaded_image['secure_url']
                    }
                    
                    socketMessage = {
                    "type": "connection_established",
                    "message": message
                    }
                
                    channel_layer = get_channel_layer()
                    async_to_sync(channel_layer.group_send)(
                    "test_channel",socketMessage
                    )
                    return Response(0, status=400)  
                else:
                    if logSerializer.is_valid():
                        logSerializer.save()
                    message = {
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "email": user.email,
                        "license_plate": resultDetection,
                        "date_joined": user.date_joined.isoformat(),
                        "image": uploaded_image['secure_url']
                    }
                    
                    socketMessage = {
                    "type": "connection_established",
                    "message": message
                    }
                
                    channel_layer = get_channel_layer()
                    async_to_sync(channel_layer.group_send)(
                    "test_channel",socketMessage
                    )
                    return Response("1 " + vehicle_id,status=201)
            else:
                license_response = resultDetection
                resultDetection = resultDetection + "(unregister)"
                new_filename =checkin_path + "check in-" +resultDetection + " " +  str(timezone.now()) +  ".jpg"
                uploaded_image = rename(uploaded_image['public_id'], new_filename)
                serializer.save(name = resultDetection,image = uploaded_image['secure_url'])
                
                message = {
                    "notification": "This vehicle is not registered",
                    "image": uploaded_image['secure_url']
                }
                
                socketMessage = {
                "type": "connection_established",
                "message": message
                }
            
                channel_layer = get_channel_layer()
                async_to_sync(channel_layer.group_send)(
                "test_channel",socketMessage
                )
                return Response("0 " + license_response, status=400)                 
        else:
            return Response(0, status=400)
        
    
    def put(self, request):
        # xử lí checkout ....
        print("CHECKOUT")
        serializer = ImageSerializer(data=request.data)
        resultDetection = ""
        if serializer.is_valid():
            image = request.data.get('image')
            uploaded_image = upload(image, folder='image/cars-checkout')
            cloudinary_url = uploaded_image['secure_url']
            arr = np.asarray(bytearray(urllib.request.urlopen(cloudinary_url).read()), dtype=np.uint8)
            image = cv2.imdecode(arr, -1) 
            if image is not None:
                resultDetection = model_AI.mode_AI(image)
                print(resultDetection)
            else:
                print('Failed to load image from Cloudinary')
        my_data = {'vehicle': resultDetection}
        vehicle = my_data['vehicle']
        try:
            log = Log.objects.filter(vehicle=vehicle, time_out__isnull=True).first()
        except Log.DoesNotExist:
            return Response(0,status=status.HTTP_404_NOT_FOUND)
        serializer = LogSerializer(log, data=my_data, partial=True)
        if serializer.is_valid():
            new_filename =checkout_path + "check out-" + resultDetection + " " +  str(timezone.now()) +  ".jpg"
            uploaded_image = rename(uploaded_image['public_id'], new_filename)
            serializer.save()
            return Response(1 ,status=status.HTTP_201_CREATED)
        
    def delete(self,request):
        ids = json.loads(request.body)["ids"]    
        for id in ids:
            try:
                log = Log.objects.filter(id=id).first() 
            except Log.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
            log.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class AddAgain(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        isCheckAgain = request.data.get("check")
        if isCheckAgain:
            old_vehicle = request.data.get("old")
            new_vehicle = request.data.get("new")
            try:
                old_log = Log.objects.filter(vehicle=old_vehicle, time_out__isnull=True).first()
                img_path = old_log.image_in
            except Log.DoesNotExist:
                return Response("Log does not exist", status=status.HTTP_404_NOT_FOUND)

            # Xóa đối tượng cũ trong một transaction riêng biệt
            with transaction.atomic():
                old_log.delete()
                print("delete success")

            # Tạo đối tượng mới trong một transaction riêng biệt
            with transaction.atomic():
                new_data = {
                    'vehicle': new_vehicle,
                    'image_in': img_path
                }
                logSerializer = LogSerializer(data=new_data)
                if logSerializer.is_valid():
                    logSerializer.save()
                    return Response("Success", status=status.HTTP_201_CREATED)
                else:
                    print(logSerializer.errors)
                    return Response("Not valid", status=status.HTTP_201_CREATED)
        
        return Response("Fail", status=status.HTTP_404_NOT_FOUND)
    
class IdentifyApiView(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        print("HAVE REQUEST")
        serializer = ImageSerializer(data=request.data)
        if serializer.is_valid():
            image = request.data.get('image')
            
            # upload ảnh lên cloud
            uploaded_image = upload(image, folder=checkin_path)
            
            # lấy link ảnh
            cloudinary_url = uploaded_image['secure_url']
            arr = np.asarray(bytearray(urllib.request.urlopen(cloudinary_url).read()), dtype=np.uint8)
            image = cv2.imdecode(arr, -1) 
            
            # lưu ảnh vào thư mục
            folder_url = 'static/image/'
            name_image = "image-temp.jpg"
            duong_dan_luu = folder_url + name_image
            cv2.imwrite(duong_dan_luu, image)
        
            resultDetection = ""
            if image is not None:
                try:
                    resultDetection = model_AI.mode_AI(image)
                except:
                    return Response(2,status=201)
            else:
                print('Failed to load image from Cloudinary')
            print(resultDetection)
            if resultDetection == "None":
                return Response("N",status=201)
            vehicle = Vehicle.objects.filter(license_plate=resultDetection).first()
            print(vehicle)
            if vehicle is None:
                return Response("0 " + resultDetection,status=status.HTTP_404_NOT_FOUND)
            return Response("1 " + resultDetection ,status=status.HTTP_400_BAD_REQUEST)
        
class CheckAgain(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):       
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
        "check_channel",
        {
            "type": "check_again",
            "message": 1
        }
        )
        num_channels_processed = 0
        group_name = "check_again"
        while num_channels_processed < len([channel_name for channel_name in channel_layer.channels.keys() if channel_name.startswith(f"group-{group_name}-")]):
            time.sleep(0.1)
            num_channels_processed = len([channel_name for channel_name in channel_layer.channels.keys() if channel_name.startswith(f"group-{group_name}-")])
        return Response(status=status.HTTP_200_OK)
        

    
class SlotUpdate(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        var1 = request.POST.get('var1')
        var2 = request.POST.get('var2')
        var3 = request.POST.get('var3')
        var4 = request.POST.get('var4')
        varList = ""
        varList = [var1,var2,var3,var4]
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
        "slot_channel",
        {
            "type": "slot_update",
            "message": varList
        }
        )
        num_channels_processed = 0
        group_name = "slot_channel"
        while num_channels_processed < len([channel_name for channel_name in channel_layer.channels.keys() if channel_name.startswith(f"group-{group_name}-")]):
            time.sleep(0.1)
            num_channels_processed = len([channel_name for channel_name in channel_layer.channels.keys() if channel_name.startswith(f"group-{group_name}-")])
        return Response(status=status.HTTP_200_OK)

class CustomObtainAuthToken(ObtainAuthToken):
    serializer_class = AccountSerializer
    def post(self, request, *args, **kwargs):
        # Lấy dữ liệu POST request
        # headers = request.META  # Lấy tất cả các header
        # print(headers)
        email = request.data.get('email')
        password = request.data.get('password')
        print(request.data)
 
        # Kiểm tra email và mật khẩu hợp lệ
        if email is None or password is None:
            return Response({'error': 'Please provide both username and password'},
                            status=status.HTTP_400_BAD_REQUEST)

        # Lấy tài khoản người dùng
        user = authenticate(email=email, password=password)

        if not user:
            return Response({'error': 'Invalid Account'},
                            status=status.HTTP_404_NOT_FOUND)
        # Tạo hoặc lấy token xác thực
        token, created = Token.objects.get_or_create(user=user)
        account = Account.objects.filter(email=email).first()
        return Response({'token': token.key,
                         "role": 1 if account.is_staff == True else 0,
                         "id": account.id})
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        request.user.auth_token.delete()
        return Response("Token is deleted",status=200)

          
def get_home(request):
    return render(request, "home.html")
