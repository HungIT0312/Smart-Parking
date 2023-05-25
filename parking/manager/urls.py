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
    path("logs/", views.LogApiView.as_view()),# check in
    path("hello-world/", views.HelloWorld.as_view()),
    path("identify/", views.IdentifyApiView.as_view()),
    path("login/", CustomObtainAuthToken.as_view(), name='token_obtain_pair'),
    path("logout/", views.LogoutView.as_view()),
    path("update-slot/", views.SlotUpdate.as_view()),
    path("check/", views.CheckAgain.as_view()),
]