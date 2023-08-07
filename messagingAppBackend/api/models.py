from django.db import models

# Create your models here.
class Message(models.Model):
    username = models.CharField(max_length=255)
    room = models.CharField(max_length=255)
    message = models.TextField()
    timestamp = models.DateTimeField()

    class Meta:
        ordering = ('timestamp',)
