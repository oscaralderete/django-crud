from django import forms

class UserForm(forms.Form):
	#id = forms.IntegerField(required=False, default=0)
	first_name = forms.CharField(max_length=50, required=True)
	last_name = forms.CharField(max_length=50, required=True)
	email = forms.EmailField(max_length=50, required=True)
