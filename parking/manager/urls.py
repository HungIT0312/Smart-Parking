from django.contrib import admin
from django.urls import path
from . import views

urlpatterns = [
    path("", views.get_home),
    path("account/", views.AccountApiView.as_view()),
    path("logs/", views.LogApiView.as_view()),
    path("vehicle/", views.VehicleApiView.as_view()),
    path("hello-world/", views.HelloWorld.as_view()),
    path("upload/", views.ImageView.as_view())
]