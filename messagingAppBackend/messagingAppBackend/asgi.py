import os

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application
from django.urls import path
from api import consumers

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'messagingAppBackend.settings')

application = get_asgi_application()

ws_patterns = [
    path("ws/<int:other_user>/",consumers.ChatConsumer.as_asgi())
]

application = ProtocolTypeRouter(
    {
        'websocket': URLRouter(ws_patterns),
        'http': get_asgi_application()
    }
)
