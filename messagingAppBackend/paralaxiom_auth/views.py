from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from .serializers import UserSerializer
from rest_framework import status
import logging

logger = logging.getLogger("auth_module")


# view for user registration
@api_view(['POST'])
def userRegistrationView(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()

        # Generating a token for registered user
        token, created = Token.objects.get_or_create(user=user)
        logger.info(f"new user registered successfully with username {user}")
        return Response({'token': token.key, 'message':"user registered successfully, login now."}, status=status.HTTP_201_CREATED)
    else:
        if 'username' in serializer.errors and 'A user with that username already exists.' in serializer.errors['username']:
            logger.error(f"Username already exists.")
            return Response({'error': 'Username already exists.'}, status=status.HTTP_409_CONFLICT)    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# view for user login
@api_view(['POST'])
def userLoginView(request):
    # extract the username and password from request
    username = request.data.get('username')
    password = request.data.get('password')
    
    # authenticate the user
    user = authenticate(username=username, password=password)

    # if the user us authenticated
    if user is not None:
        token, created = Token.objects.get_or_create(user=user)
        logger.info(f"logged in successfully with username {user}")
        return Response({'token': token.key, 'username': user.username}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)


