from django.contrib import admin
from .models import Account, Vehicle, Log, Image, User

# Register your models here.
admin.site.register(Account)
admin.site.register(Vehicle)
admin.site.register(Log)
admin.site.register(Image)
admin.site.register(User)