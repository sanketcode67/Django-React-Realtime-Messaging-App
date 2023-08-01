from rest_framework import serializers
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('first_name','last_name','email','username', 'password')

    def create(self, validated_data):
        user = User.objects.create()
        user.username = validated_data["username"]
        user.email = validated_data["email"]
        user.first_name = validated_data["first_name"]
        user.last_name = validated_data["last_name"]
        user.set_password(validated_data["password"])
        user.save()
        return user

class UserListSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username']        

        


        