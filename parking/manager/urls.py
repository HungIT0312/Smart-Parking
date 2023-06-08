from django.contrib import admin
from django.urls import path
from . import views
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import CustomObtainAuthToken

urlpatterns = [
    path("", views.HelloWorld.as_view()),
    path("account/", views.AccountApiView.as_view()),
    path("logs/", views.LogApiView.as_view()),
    path("hello-world/", views.HelloWorld.as_view()),
    path("login/", CustomObtainAuthToken.as_view(), name='token_obtain_pair'),
    path("logout/", views.LogoutView.as_view()),
    path("update-slot/", views.SlotUpdate.as_view()),

    path("check-in/", views.Checkin.as_view()),# check in
    path("check-out/", views.Checkout.as_view()),# check out
    path("check-again/", views.CheckAgain.as_view()), # chụp lại và xoá log cũ
]