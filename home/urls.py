from django.urls import path

from . import views

urlpatterns = [
	path('', views.index, name='Index'),
	path('create/', views.create),
	path('update/', views.update),
	path('delete/', views.delete)
]
