from django.db import models
from django.core.validators import RegexValidator
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from cloudinary.models import CloudinaryField
from .managers import UserManager
from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _


# Create your models here.
class Account(AbstractUser):
    username = None
    email = models.EmailField(_('email address'), unique=True, default="")
    parking_fee = models.FloatField(default=0)
    
    objects = UserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []
    

class Vehicle(models.Model):
    license_plate = models.CharField(max_length=10, primary_key=True)
    vehicle_pic = models.CharField(max_length=255,blank=True, null=True)
    user = models.ForeignKey(Account, on_delete=models.CASCADE, blank=False,
                                null=False)

    def __str__(self) -> str:
        return f"{self.user_id} - {self.license_plate}"


class Log(models.Model):
    time_in = models.DateTimeField(null=True, blank=True)
    time_out = models.DateTimeField(null=True, blank=True)
    image_in = models.CharField(max_length=255,null=True, blank=True)
    vehicle = models.ForeignKey(Vehicle, models.CASCADE,
                                   blank=False,
                                   null=False,
                                   to_field='license_plate')

    def __str__(self) -> str:
        return f"{self.vehicle_id} - {self.time_in} - {self.time_out}"


class Slot(models.Model):
    status = models.BigIntegerField(null=False)
    
class Image(models.Model):
    name = models.CharField(max_length=255, null=True)
    image = CloudinaryField("image")
    date = models.DateTimeField(null=True, auto_now_add=True)
    
    @property
    def image_url(self):
        return  f"http://res.cloudinary.com/dzdfqqdxs/image/cars_upload/{self.image}.jpg"
    
           
