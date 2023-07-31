from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.userRegistrationView, name='user-register'),
    path('login/', views.userLoginView, name='user-login'),
]