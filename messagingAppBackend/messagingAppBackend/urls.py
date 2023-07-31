from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('auth/', include("paralaxiom_auth.urls")),
    path('app/', include("app.urls"))
]