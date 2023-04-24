from django.urls import path
from django.urls import re_path
from asgiref.sync import async_to_sync

from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/test_channel/', consumers.MyConsumer.as_asgi())
]

