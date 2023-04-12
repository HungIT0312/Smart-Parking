from rest_framework import serializers
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from .models import (
    Account,
    Log,
    Vehicle,
    Image
)

from django.utils import timezone


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = '__all__'
        
class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = '__all__'
        
    def create(self, validated_data):
        validated_data['time_in'] = timezone.now()
        return super().create(validated_data)
        
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