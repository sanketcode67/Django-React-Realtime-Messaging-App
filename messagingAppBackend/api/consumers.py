import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync,sync_to_async
from channels.db import database_sync_to_async
from rest_framework.authentication import TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed

from .models import Message
from datetime import datetime

class ChatConsumer(AsyncWebsocketConsumer): 

    async def connect(self):

        # get the token
        token = self.get_auth_token()

        # authenticate the user based on the token
        user = await self.get_user(token)
        if not user:
            await self.close()

        current_user_id = user.id
        room_name = self.scope['url_route']['kwargs']['room_name']


        # self.room_group_name = self.get_room(current_user_id, other_user_id)
        self.room_group_name = room_name


        # print(self.room_group_name)
        

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
        message = data['message']
        username = data['username']
        room = data['room']
        timestamp = data['timestamp']

        format_string = "%Y-%m-%dT%H:%M:%S.%fZ"
        timestamp_dt = datetime.strptime(timestamp, format_string)
        

        message_id = await self.save_message(username, room, message, timestamp_dt)

        timestamp_str = timestamp_dt.isoformat()

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

    @sync_to_async
    def save_message(self, username, room, message, timestamp):
        message_obj = Message.objects.create(username=username, room=room, message=message, timestamp=timestamp)
        return message_obj.id


    












    def get_auth_token(self):
        auth_token = self.scope.get('query_string', b'').decode('utf-8')
        if auth_token.startswith('token='):
            auth_token = auth_token[6:]
        else:
            auth_token = self.scope.get('headers',{}).get(b'token',b'').decode('utf-8')  
        return auth_token

    @database_sync_to_async
    def get_user(self, auth_token):
        try:
            auth = TokenAuthentication()
            user, _ = auth.authenticate_credentials(auth_token)
            return user
        except AuthenticationFailed:
            return None    

         