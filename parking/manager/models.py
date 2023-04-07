from django.db import models
from django.core.validators import RegexValidator

from cloudinary.models import CloudinaryField


# Create your models here.
class Account(models.Model):
    name = models.CharField(max_length=255, null=True)
    phone = models.CharField(max_length=20, validators=[RegexValidator(r'^\d{1,10}$')], null=True)
    address = models.CharField(max_length=255, blank=True, null=True)
    username = models.CharField(max_length=255, blank=False, null=False)
    password = models.CharField(max_length=255, blank=False, null=False)
    role = models.BigIntegerField(null=False)
    parking_fee = models.FloatField(default=0)
    
    def __str__(self) -> str:
        return f"{self.name}"
    


class Vehicle(models.Model):
    license_plate = models.CharField(max_length=10)
    vehicle_pic = models.CharField(max_length=255,blank=True, null=True)
    user = models.ForeignKey(Account, on_delete=models.CASCADE, blank=False,
                                null=False)

    def __str__(self) -> str:
        return f"{self.user_id} - {self.license_plate}"


class Log(models.Model):
    time_in = models.DateTimeField(null=True)
    time_out = models.DateTimeField(null=True, blank=True)
    vehicle = models.ForeignKey(Vehicle, on_delete=models.CASCADE,
                                   blank=False,
                                   null=False)

    def __str__(self) -> str:
        return f"{self.vehicle_id} - {self.time_in} - {self.time_out}"


class Slot(models.Model):
    status = models.BigIntegerField(null=False)
    
class Type(models.Model):
    type = models.CharField(max_length=255)
    
class Image(models.Model):
    name = models.CharField(max_length=255)
    image = CloudinaryField("image")
    date = models.DateTimeField(null=True, auto_now_add=True)
    type = models.ForeignKey(Type, on_delete=models.CASCADE,null=True)
    
    @property
    def image_url(self):
        return  f"http://res.cloudinary.com/dzdfqqdxs/image/cars_upload/{self.image}.jpg"
           
