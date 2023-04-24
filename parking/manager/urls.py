from django.contrib import admin
from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import CustomObtainAuthToken

urlpatterns = [
    path("", views.get_home),
    path("account/", views.AccountApiView.as_view()),
    path("logs/", views.LogApiView.as_view()),# check in
    path("vehicle/", views.VehicleApiView.as_view()),
    path("hello-world/", views.HelloWorld.as_view()),
    path("slot/", views.SlotApiView.as_view()),
    path("upload/", views.ImageView.as_view()), #test gửi ảnh
    path("login/", CustomObtainAuthToken.as_view(), name='token_obtain_pair'),
    path("logout/", views.LogoutView.as_view()),
]