from django.shortcuts import render
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from api.models import Message
from api.serializers import MessageSerializer
from rest_framework.response import Response

# Create your views here.
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_messages_view(request, room_name):
   
    messages = Message.objects.filter(room=room_name).order_by('timestamp')
    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)
