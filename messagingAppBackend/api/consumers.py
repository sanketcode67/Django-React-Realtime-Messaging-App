import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync,sync_to_async
from channels.db import database_sync_to_async
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed

from .models import Message
from datetime import datetime

import logging
logger = logging.getLogger("api_module")

class ChatConsumer(AsyncWebsocketConsumer): 

    async def connect(self):

        # get the token
        token = self.get_auth_token()

        # authenticate the user based on the token
        user = await self.get_user(token)
        if not user:
            logger.error("unauthorised token")
            await self.close()

        room_name = self.scope['url_route']['kwargs']['room_name']

        self.room_group_name = room_name
        

        # join room
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()


    async def disconnect(self, close_code):
        # leave the room
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        ) 

    # Receive message from web socket
    async def receive(self, text_data):
        data = json.loads(text_data)

        # if type is message then send the message to the room
        if data['type'] == "message":

            message = data['message']
            username = data['username']
            room = data['room']
            timestamp = data['timestamp']

            format_string = "%Y-%m-%dT%H:%M:%S.%fZ"
            timestamp_dt = datetime.strptime(timestamp, format_string)
            

            message_id = await self.save_message(username, room, message, timestamp_dt)

            timestamp_str = timestamp_dt.isoformat()+"Z"

            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'id': message_id,
                    'message': message,
                    'username': username,
                    'timestamp': timestamp_str,
                }
            )

        elif data['type'] == 'delete':
            message_id = data["message_id"]

            await self.delete_message(message_id)

            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'delete_chat_message',
                    'message_id': message_id,
                }
            )

            
            
            






    # Receive message from room group
    async def chat_message(self, event):
        id = event["id"]
        message = event['message']
        username = event['username']
        timestamp = event['timestamp']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'id': id,
            'message': message,
            'username': username,
            'timestamp': timestamp,
        }))

        # Receive message from room group
    async def delete_chat_message(self, event):
        message_id = event["message_id"]

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'action':'delete',
            'message_id': message_id,
        }))    

    

    @sync_to_async
    def save_message(self, username, room, message, timestamp):
        message_obj = Message.objects.create(username=username, room=room, message=message, timestamp=timestamp)
        return message_obj.id

    @sync_to_async
    def delete_message(self, message_id):
        try:
            message = Message.objects.get(pk=message_id)
            message.delete()
            return True
        except Message.DoesNotExist:
            return False    


    












    def get_auth_token(self):
        auth_token = self.scope.get('query_string', b'').decode('utf-8')
        if auth_token.startswith('token='):
            auth_token = auth_token[6:]
        return auth_token

    @database_sync_to_async
    def get_user(self, auth_token):
        try:
            auth = TokenAuthentication()
            user, _ = auth.authenticate_credentials(auth_token)
            return user
        except AuthenticationFailed:
            return None    

         