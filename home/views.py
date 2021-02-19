from django.shortcuts import render

from django.http import JsonResponse

from django.utils import timezone

from .forms import UserForm

from .models import Users


# Create your views here.
def index(request):
	return render(request, 'home/index.html', {
		'page':{
			'title': 'This is home',
			'styles': [
				'/static/css/home.css'
			],
			'scripts': [
				'/static/js/home.js'
			]
		},
		'page_data': {
			#this is foo data
			'numbers': [1,2,3,4,5,6],
			'names': ['John','Jane','Mary','Rose','Tim','Kim','Pete'],
			'users': getUsers()
		}
	})


#ajax handlers
def create(request):
	data=defaultResponse()

	if processCreation(request):
		data['result']='OK'
		data['msg']='Record successfully saved'
		data['users']=getUsers()

	return JsonResponse(data)

def update(request):
	data=defaultResponse()

	if processUpdate(request):
		data['result']='OK'
		data['msg']='Record successfully updated'
		data['users']=getUsers()

	return JsonResponse(data)

def delete(request):
	data=defaultResponse()

	if processDeletion(request):
		data['result']='OK'
		data['msg']='Record successfully deleted'
		data['users']=getUsers()

	return JsonResponse(data)

#common helpers
def processCreation(request):
	result=False;
	if request.method=='POST':
		#form
		uf=UserForm(request.POST)
		if uf.is_valid():
			#storing data
			reg=Users(first_name=uf.cleaned_data['first_name'],
					last_name=uf.cleaned_data['last_name'],
					email=uf.cleaned_data['email'],
					created_at=timezone.now())
			reg.save()
			result=True

	return result

def processUpdate(request):
	result=False;
	if request.method=='POST':
		#form
		uf=UserForm(request.POST)
		if uf.is_valid():
			#updating data
			reg=Users.objects.get(id=request.POST['id'])
			reg.first_name=uf.cleaned_data['first_name']
			reg.last_name=uf.cleaned_data['last_name']
			reg.email=uf.cleaned_data['email']
			reg.updated_at=timezone.now()
			reg.save()
			result=True

	return result

def processDeletion(request):
	result=False;
	if request.method=='POST':
		Users.objects.filter(id=request.POST['id']).delete()
		result=True

	return result

def defaultResponse():
	return {'result':'ERROR','msg':'Error 1001'}

def getUsers():
	#we don't need all Users table columns, that's why I'm fetching only id, email, first & last name
	return list(Users.objects.order_by('first_name','last_name').values('id','last_name','first_name','email'))
