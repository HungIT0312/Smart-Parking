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
        else:
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
        try:
            ids = json.loads(request.body)["ids"]
            if not isinstance(ids, list):
                return Response({"error": "The ids parameter must be a list."}, status=status.HTTP_400_BAD_REQUEST)
            for id in ids:
                try:
                    account = Account.objects.filter(id=id).first() 
                except Account.DoesNotExist:
                    return Response("Account not found",status=status.HTTP_404_NOT_FOUND)
                account.delete()
            return Response("Delete successfully",status=status.HTTP_204_NO_CONTENT)
        except json.JSONDecodeError:
            return Response({"error": "Invalid JSON data."}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
        # Trả về phản hồi khi có lỗi xảy ra
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    
# API for Log
    
class LogApiView(APIView):
    permission_classes = (permissions.AllowAny,)
    def get(self, request):
        logs = Log.objects.all()
        serializer = LogSerializer(logs, many=True)
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
            # cloudinary_url = "https://res.cloudinary.com/dzdfqqdxs/image/upload/v1681454668/image/license_plate_upload/30F50483%202023-04-14%2006:44:32.154835%2B00:00.jpg.jpg"
            arr = np.asarray(bytearray(urllib.request.urlopen(cloudinary_url).read()), dtype=np.uint8)
            image = cv2.imdecode(arr, -1) 
            
            # lưu ảnh vào thư mục
            folder_url = 'static/image/'
            name_image = "image-temp.jpg"
            duong_dan_luu = folder_url + name_image
            cv2.imwrite(duong_dan_luu, image)
            

            resultDetection = ""
            if image is not None:
                resultDetection = model_AI.mode_AI(image)
                # cv2.imshow('Image from Cloudinary', image)
                # cv2.waitKey(0)
                # cv2.destroyAllWindows()
            else:
                print('Failed to load image from Cloudinary')
                
            # websocket
            print(resultDetection)
            
            channel_layer = get_channel_layer()
            async_to_sync(channel_layer.group_send)(
            "test_channel",
            {
                "type": "connection_established",
                "message": cloudinary_url
            }
            )
            # Thêm log vào database
            my_data = {'vehicle': resultDetection,
                       'image_in': cloudinary_url}
            logSerializer = LogSerializer(data=my_data)
            vehicle_id = my_data['vehicle']
            log = Log.objects.filter(vehicle=vehicle_id, time_out__isnull=True).first()
            # Kiểm tra có tồn tại xe tại bãi chưa
            
            if log is not None and log.time_out is None:
                 return Response("This vehicle is existed",status=400)
            else:
                if logSerializer.is_valid():
                    logSerializer.save()
            license_sample = Vehicle.objects.filter(license_plate = resultDetection).first()
            if license_sample is not None:
                new_filename =checkin_path + "check in-" + resultDetection + " " +  str(timezone.now()) +  ".jpg"
                uploaded_image = rename(uploaded_image['public_id'], new_filename)
                serializer.save(name = resultDetection,image = uploaded_image['secure_url'])
                return Response(1,status=201)
            else:
                resultDetection = resultDetection + "(unregister)"
                new_filename =checkin_path + "check in-" +resultDetection + " " +  str(timezone.now()) +  ".jpg"
                uploaded_image = rename(uploaded_image['public_id'], new_filename)
                serializer.save(name = resultDetection,image = uploaded_image['secure_url'])
                return Response(0, status=400)                 
        else:
            return Response(0, status=400)
        
    
    def put(self, request):
        # xử lí checkout ....
        serializer = ImageSerializer(data=request.data)
        resultDetection = ""
        if serializer.is_valid():
            image = request.data.get('image')
            uploaded_image = upload(image, folder='image/cars-checkout')
            cloudinary_url = uploaded_image['secure_url']
            arr = np.asarray(bytearray(urllib.request.urlopen(cloudinary_url).read()), dtype=np.uint8)
            image = cv2.imdecode(arr, -1) 
            
            # folder_url = 'static/image/'
            # name_image = "image-temp.jpg"
            # duong_dan_luu = folder_url + name_image
            # cv2.imwrite(duong_dan_luu, image)
            

            if image is not None:
                resultDetection = model_AI.mode_AI(image)
            else:
                print('Failed to load image from Cloudinary')
        
        my_data = {'vehicle': resultDetection}
        vehicle = my_data['vehicle']
        try:
            log = Log.objects.filter(vehicle=vehicle, time_out__isnull=True).first()
        except Log.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = LogSerializer(log, data=my_data, partial=True)
        if serializer.is_valid():
            new_filename =checkout_path + "check out-" + resultDetection + " " +  str(timezone.now()) +  ".jpg"
            uploaded_image = rename(uploaded_image['public_id'], new_filename)
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
    permission_classes = (permissions.AllowAny,)
    def put(self, request):
        count = 1
        var1 = request.PUT.get('var1')
        var2 = request.PUT.get('var2')
        var3 = request.PUT.get('var3')
        var4 = request.PUT.get('var4')
        varList = [var1,var2,var3,var4]
        for var in varList:
           if count==4:
            try:
                slot = Slot.objects.filter(id=count).first()
                count+=1
            except Slot.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
            serializer = SlotSerializer(slot, data=var)
            if serializer.is_valid():
                serializer.save()
        count=1
        return Response(status=status.HTTP_200_OK)
    
class SlotUpdate(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        var1 = request.POST.get('var1')
        var2 = request.POST.get('var2')
        var3 = request.POST.get('var3')
        var4 = request.POST.get('var4')
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
        

# API for Vehicle
    
class VehicleApiView(APIView):
    def get(self, request):
        license_plate = self.request.query_params.get('license_plate', None)
        if license_plate is None:
            vehicles = Vehicle.objects.all()
        else:
            vehicles = Vehicle.objects.filter(license_plate=license_plate)
        serializer = VehicleSerializer(vehicles, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        serializer = VehicleSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self,request):
        id = json.loads(request.body)["license_plate"]
        try:
            account = Vehicle.objects.filter(license_plate=id).first()
        except Vehicle.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = VehicleSerializer(account, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self,request):
        license_plates = json.loads(request.body)["license_plates"]
        for license_plate in license_plates:
            try:
                account = Vehicle.objects.filter(license_plate=license_plate).first() 
            except Vehicle.DoesNotExist:
                return Response("Vehicle does not exist",status=status.HTTP_404_NOT_FOUND)
            account.delete()
        return Response("Delete successfully",status=status.HTTP_204_NO_CONTENT)
    
    
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
                         "role": 1 if account.is_staff == True else 0})
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        request.user.auth_token.delete()
        return Response("Token is deleted",status=200)

          
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
