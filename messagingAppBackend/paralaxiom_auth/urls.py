from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.userRegistrationView, name='user-register'),
    path('login/', views.userLoginView, name='user-login'),
    path('logout/', views.logout_view, name='user-logout'),
    path('user/all/', views.allUsersView, name='all-friend'),


]