from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.contrib.auth.hashers import make_password
from rest_framework.permissions import IsAuthenticated
from .serializers import UserSerializer, UserListSerializer
from rest_framework import status
from django.core import serializers
import logging

logger = logging.getLogger("auth_module")


# view for user registration
@api_view(['POST'])
def userRegistrationView(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        logger.info(f"new user registered successfully with username {user}")
        return Response({'message':"user registered successfully, login now."}, status=status.HTTP_201_CREATED)
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
        return Response({'token': token.key, 'username': user.username , 'user_id': user.id}, status=status.HTTP_200_OK)
    else:
        logger.info("invalid credential for login")
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def allUsersView(request):

    # Get all users except the logged in user
    users = User.objects.all()

    # Serialize the queryset to return the user information using the new serializer
    serializer = UserListSerializer(users, many=True)
    logger.info(f"{request.user} fetched all the users data")
    return Response({"users": serializer.data})



# logout view
@api_view(['GET'])
@permission_classes([IsAuthenticated])   
def logout_view(request):

    # get the current user
    user = request.user
    try:
        # get the token
        token = Token.objects.get(user=user)
        token.delete()
        logger.info(f" username {user} logged out successfully")
        return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
    except Token.DoesNotExist:
        logger.error(f"Token not found for user {user}")
        return Response({'error': 'Token not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        logger.error(f"Error during logout: {e}")
        return Response({'error': 'Something went wrong'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# change password view
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password_view(request):

    #get the user
    user = request.user

    # get the data from the response
    old_password = request.data.get('old_password')
    new_password = request.data.get('new_password')

    # Check if the old and new passwords are the same
    if old_password == new_password:
        return Response({'error': 'New password cannot be the same as the old password'}, status=status.HTTP_400_BAD_REQUEST)


    # Check if the old password matches the user's current password
    if not user.check_password(old_password):
        logging.info("old password is incorrect")
        return Response({'error': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

     # Set the new password for the user
    user.password = make_password(new_password)
    user.save()

    logging.info(f"Password changed successfully by username {user}")
    return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)    




