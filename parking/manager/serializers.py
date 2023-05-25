from rest_framework import serializers
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import (
    Account,
    Log,
    Vehicle,
    Image
)

from django.utils import timezone
from datetime import timedelta

class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'
    def create(self, validated_data):
        password = validated_data.pop('password')
        user = Account(**validated_data)
        user.set_password(password)
        user.save()
        return user
        
class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = '__all__'
        
    def create(self, validated_data):
        validated_data['time_in'] = timezone.now()
        return super().create(validated_data)
    # def update(self, instance, validated_data):
    #     instance.time_out = timezone.now()
    #     instance.save()
    #     return instance
        
class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = '__all__'
        
class ImageSerializer(serializers.ModelSerializer):
    parser_classes = (MultiPartParser,FormParser,JSONParser)
    
    class Meta:
        model = Image
        fields = '__all__'
        
    def create(self, validated_data):
        validated_data['date'] = timezone.now()
        return super().create(validated_data)