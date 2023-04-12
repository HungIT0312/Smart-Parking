from django.contrib import admin
from .models import Account, Vehicle, Log, Slot, Image

# Register your models here.
admin.site.register(Account)
admin.site.register(Vehicle)
admin.site.register(Log)
admin.site.register(Slot)
admin.site.register(Image)