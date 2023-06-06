import json
import time
from django.http import HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import ensure_csrf_cookie

from .utils import *
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
from .consumers import *

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
     
    #  chụp lại checkin
    def post(self, request):
        license_plate = request.data.get('license_plate')
        image = request.data.get('image')
        my_data = {'vehicle': license_plate,
                    'image_in': image,
                    'is_member': False}
        logSerializer = LogSerializer(data=my_data)
        if logSerializer.is_valid():
            logSerializer.save()
            send_socket_message(channel_name="check_channel", type="check_again", message=1)  
            return Response("Add successfully", status=status.HTTP_200_OK)
        else:
            return Response(logSerializer.errors, status=status.HTTP_400_BAD_REQUEST)  
   
    def put(self, request):
        license_plate = request.data.get('license_plate')
        my_data = {'vehicle': license_plate}
        log = Log.objects.filter(vehicle=license_plate, time_out__isnull=True).first()
        if log is not None:
            serializer = LogSerializer(log, data=my_data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(0,status=status.HTTP_200_OK)
        return Response(0,status=status.HTTP_404_NOT_FOUND)
        
    def delete(self,request):
        ids = json.loads(request.body)["ids"]    
        for id in ids:
            try:
                log = Log.objects.filter(id=id).first() 
            except Log.DoesNotExist:
                return Response(status=status.HTTP_404_NOT_FOUND)
            log.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    
class Checkin(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        print("HAVE REQUEST")
        serializer = ImageSerializer(data=request.data)
        if serializer.is_valid():
            image = request.data.get('image')
            result = identify(image)
            resultDetection = result['resultDetection']
            uploaded_image = result['uploaded_image']
            
            print(resultDetection)
            if resultDetection == "None":
                message = {
                        "notification": "Image is not valid",
                        "image": uploaded_image['secure_url']
                    }
                send_socket_message(channel_name="checkin_channel", type="checkin", message=message)
                responseMes = "E"
                return Response(responseMes,status=201)
           
            vehicle = Vehicle.objects.filter(license_plate = resultDetection).first()

            if vehicle is not None: #Xe đã đk
                vehicle_id = vehicle.license_plate
                log = Log.objects.filter(vehicle=vehicle_id, time_out__isnull=True).first()
                user = Account.objects.filter(email=vehicle.user).first()
                uploaded_image = renameImage(checkin_path, "check in-", vehicle_id, uploaded_image)
                my_data = {'vehicle': vehicle_id,
                        'image_in': uploaded_image['secure_url'],
                        'is_member': True}
                logSerializer = LogSerializer(data=my_data)
                serializer.save(name = vehicle_id,image = uploaded_image['secure_url'])
                # Kiểm tra có tồn tại xe tại bãi chưa
                if log is not None and log.time_out is None:#đã tồn tại xe trong bãi
                    message = {
                        "notification": "This vehicle is existed",
                        "image": uploaded_image['secure_url']
                    }
                    send_socket_message(channel_name="checkin_channel", type="checkin", message=message)

                    return Response(0, status=400)  
                else:
                    if logSerializer.is_valid():
                        logSerializer.save()
                    message = {
                        "first_name": user.first_name,
                        "last_name": user.last_name,
                        "email": user.email,
                        "license_plate": vehicle_id,
                        "result_detection": resultDetection,
                        "date_joined": user.date_joined.isoformat(),
                        "image": uploaded_image['secure_url']
                    }
                    send_socket_message(channel_name="checkin_channel", type="checkin", message=message)
                    return Response("1 " + vehicle_id,status=201)
            else:
                license_response = resultDetection
                resultDetection = "(unregister)" + resultDetection
                uploaded_image = renameImage(checkin_path, "check in-", resultDetection, uploaded_image)
                serializer.save(name = resultDetection,image = uploaded_image['secure_url'])
                
                message = {
                    "notification": "This vehicle is not registered",
                    "result_detection": license_response,
                    "image": uploaded_image['secure_url']
                }
                send_socket_message(channel_name="checkin_channel", type="checkin", message=message)
                return Response("0 " + license_response, status=400)                 
        else:
            return Response(0, status=400)
    
class Checkout(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        print("CHECKOUT")
        serializer = ImageSerializer(data=request.data)
        resultDetection = ""
        if serializer.is_valid():
            image = request.data.get('image')
            result = identify(image)
            resultDetection = result['resultDetection']
            uploaded_image = result['uploaded_image']
            print(resultDetection)
            
        if resultDetection == "None":
            message = {
                        "notification": "Image is not valid",
                        "image": uploaded_image['secure_url']
                    }
            send_socket_message(channel_name="checkout_channel", type="checkout", message=message)
            return Response("E",status=201)
        
        
        my_data = {'vehicle': resultDetection}
        vehicle = my_data['vehicle']
        log = Log.objects.filter(vehicle=vehicle, time_out__isnull=True).first()
        if log is not None:
            serializer = LogSerializer(log, data=my_data, partial=True)
            vehicle = Vehicle.objects.filter(license_plate=log.vehicle).first()
            if serializer.is_valid():
                if log.is_member is True:
                    uploaded_image = renameImage(checkout_path, "check out-", resultDetection, uploaded_image)
                    #xử lí tính tiền
                    timeParking = timezone.now() - log.time_in
                    user = Account.objects.get(email=vehicle.user)
                    if timeParking < timedelta(days=1):
                        days_parked = round(timeParking.total_seconds() / (24 * 60 * 60))
                        if(days_parked == 0):
                            days_parked = 1
                        fee = days_parked * 10000
                        if user.parking_fee < fee:
                            feeMessage = {
                                "notification": "Insufficient Funds in Your Account",
                                "first_name": user.first_name,
                                "last_name": user.last_name,
                                "email": user.email,
                                "license_plate": resultDetection,
                                "result_detection": resultDetection,
                                "date_joined": user.date_joined.isoformat(),
                                "image": uploaded_image['secure_url'],
                                "parking_fee": user.parking_fee,
                                "is_member": log.is_member,
                                "fee": fee,
                                "time_in": log.time_in.isoformat()
                            }
                            send_socket_message(channel_name="checkout_channel", type="checkout", message=feeMessage)
                        else:
                            feeData = {
                                "parking_fee": user.parking_fee - fee,
                            }
                            serializer = AccountSerializer(user,data=feeData) 
                            checkoutMessage = {
                                "notification": "Paid successfully",
                                "first_name": user.first_name,
                                "last_name": user.last_name,
                                "email": user.email,
                                "license_plate": resultDetection,
                                "result_detection": resultDetection,
                                "date_joined": user.date_joined.isoformat(),
                                "image": uploaded_image['secure_url'],
                                "parking_fee": user.parking_fee,
                                "fee": fee,
                                "is_member": log.is_member,
                                "time_in": log.time_in.isoformat()
                            }
                            send_socket_message(channel_name="checkout_channel", type="checkout", message=checkoutMessage)
                else:
                    timeParking = timezone.now() - log.time_in
                    if timeParking < timedelta(days=1):
                        days_parked = round(timeParking.total_seconds() / (24 * 60 * 60))
                        if(days_parked == 0):
                            days_parked = 1
                        notMemberFee = days_parked * 15000                       
                    checkoutMessage = {
                                "notification": "Vehicle is not registered, please pay in cash",
                                "license_plate": resultDetection,
                                "result_detection": resultDetection,
                                "image": uploaded_image['secure_url'],
                                "fee": notMemberFee,
                                "is_member": log.is_member,
                                "time_in": log.time_in.isoformat()
                            }
                    send_socket_message(channel_name="checkout_channel", type="checkout", message=checkoutMessage)
                serializer.save()
                return Response("1 " + resultDetection ,status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST) 
        else:
            return Response("0 " + resultDetection,status=status.HTTP_404_NOT_FOUND)

class AccountDeposit(APIView):
    def post(self, request):
        cash = request.data.get('parking_fee')
        print(cash)
        user = request.user
        user.parking_fee = cash
        user.save()
        return Response(status=status.HTTP_200_OK)

class CheckAgain(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        license_plate = request.data
        log = Log.objects.filter(vehicle=license_plate, time_out__isnull=True).first()
        if log is not None:
            log.delete()
            send_socket_message(channel_name="check_channel", type="check_again", message=0)   
            return Response(status=status.HTTP_200_OK)
        else:
            send_socket_message(channel_name="check_channel", type="check_again", message=0) 
            return Response("Log does not exist", status=status.HTTP_200_OK)

class SlotUpdate(APIView):
    permission_classes = (permissions.AllowAny,)
    def post(self, request):
        var1 = request.POST.get('var1')
        var2 = request.POST.get('var2')
        var3 = request.POST.get('var3')
        var4 = request.POST.get('var4')
        varList = [var1,var2,var3,var4]
        send_socket_message("slot_channel","slot_update", message=varList)
        return Response(status=status.HTTP_200_OK)

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
                         "role": 1 if account.is_staff == True else 0,
                         "id": account.id})
    
class LogoutView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        request.user.auth_token.delete()
        return Response("Token is deleted",status=200)

          
def get_home(request):
    return render(request, "home.html")



