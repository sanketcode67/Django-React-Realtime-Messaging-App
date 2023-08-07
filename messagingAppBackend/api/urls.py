from django.contrib import admin
from django.urls import path
from api import views

urlpatterns = [
    
    path('messages/<str:room_name>',views.get_messages_view )
]