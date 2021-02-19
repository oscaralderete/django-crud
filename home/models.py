from django.db import models

# Create your models here.
class Users(models.Model):
	first_name = models.CharField(max_length=50)
	last_name = models.CharField(max_length=50)
	email = models.EmailField(max_length=50)
	created_at = models.DateTimeField(null=True, blank=True)
	updated_at = models.DateTimeField(null=True, blank=True)

	def __str__(self):
		return self.first_name
