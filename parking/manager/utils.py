
import time
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

import cloudinary
from cloudinary import CloudinaryImage
import numpy as np
import cv2
import urllib.request
from cloudinary.uploader import upload
from cloudinary.uploader import rename
from ModelAI import model_AI
from django.utils import timezone
@staticmethod
def send_socket_message(channel_name, type, message):
    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
    channel_name,
    {
        "type": type,
        "message": message
    }
    )
    num_channels_processed = 0
    group_name = channel_name
    while num_channels_processed < len([channel_name for channel_name in channel_layer.channels.keys() if channel_name.startswith(f"group-{group_name}-")]):
        time.sleep(0.1)
        num_channels_processed = len([channel_name for channel_name in channel_layer.channels.keys() if channel_name.startswith(f"group-{group_name}-")])

@staticmethod      
def identify(image):
    uploaded_image = upload(image, folder='image/cars-checkout')
    cloudinary_url = uploaded_image['secure_url']
    arr = np.asarray(bytearray(urllib.request.urlopen(cloudinary_url).read()), dtype=np.uint8)
    image = cv2.imdecode(arr, -1) 
    
    # lưu ảnh vào thư mục
    folder_url = 'static/image/'
    name_image = "image-temp.jpg"
    duong_dan_luu = folder_url + name_image
    cv2.imwrite(duong_dan_luu, image)
    
    if image is not None:
        resultDetection = model_AI.mode_AI(image)
    else:
        print('Failed to load image from Cloudinary')
    # cv2.imshow('Image from Cloudinary', image)
    # cv2.waitKey(0)
    # cv2.destroyAllWindows()
    return {
        "resultDetection": resultDetection,
        "uploaded_image": uploaded_image
    }
    
def renameImage(path, regex, vehicle_id, uploaded_image):
    new_filename =path + regex + vehicle_id + " " +  str(timezone.now())
    uploaded_image = rename(uploaded_image['public_id'], new_filename)
    return uploaded_image