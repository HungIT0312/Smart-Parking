# myapp/consumers.py
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.generic.websocket import WebsocketConsumer
from asgiref.sync import async_to_sync
import json

class MyConsumer(WebsocketConsumer):
    def connect(self):
        
        self.room_group_name = 'test_channel'

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()
    
    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )
        
        
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type':'chat_message',
                'message':message
            }
        )

    def connection_established(self, event):
        message = event['message']

        self.send(text_data=json.dumps({
            'type':'connection_established',
            'message': message
        }))
        
class SlotConsumer(WebsocketConsumer):
    def connect(self):
        
        self.room_group_name = 'slot_channel'

        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )
        self.accept()
    
    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )
        
        
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type':'chat_message',
                'message':message
            }
        )

    def slot_update(self, event):
        message = event['message']
        self.send(text_data=json.dumps({
            'type':'slot_update',
            'message': message
        }))
    

