const pageData = JSON.parse(document.getElementById('page_data').textContent);

var app = new Vue({
	el: '#app',
	//it's important, we'll use [[ and ]] because Django template engine already uses {{ and }}
	delimiters: ['[[',']]'],
	data() {
		return {
			title: 'Basic CRUD Using Ajax',
			subtitle: 'SPA powered by VueJS',
			users: pageData.users,
			add_user: this.getBlankUser(),
			edit_user: this.getBlankUser() //by default an empty object
		};
	},
	methods: {
		//get a blank user to add/edit
		getBlankUser() {
			return {
				id: 0,
				first_name: '',
				last_name: '',
				email: ''
			};
		},
		//handle modal
		switchFormAdd() {
			this.add_user=this.getBlankUser();
			this.switchDiv('divAdd');
		},
		closeModal(str) {
			this.switchDiv(str);
		},
		//show/hide modal div
		switchDiv(str) {
			const x=this.$refs[str];
			//class name 'active' remove the CSS attribute display none for display block
			const y='active';
			if(x.classList.contains(y)){
				x.classList.remove(y);
			}
			else{
				x.classList.add(y);
			}
		},
		//email validator
		validateEmail(str){
			const regex=/^[-_.a-z0-9]+@(([-a-z0-9]+\.)+(ad|ae|aero|af|ag|ai|al|am|an|ao|aq|ar|arpa|as|at|au|aw|az|ba|bb|bd|be|bf|bg|bh|bi|biz|bj|bm|bn|bo|br|bs|bt|bv|bw|by|bz|ca|cat|cc|cd|cf|cg|ch|ci|ck|cl|cm|cn|co|com|coop|cr|cs|cu|cv|cx|cy|cz|de|dj|dk|dm|do|dz|ec|edu|ee|eg|eh|er|es|et|eu|fi|fj|fk|fm|fo|fr|ga|gb|gd|ge|gf|gh|gi|gl|gm|gn|gov|gob|gp|gq|gr|gs|gt|gu|gw|gy|hk|hm|hn|hr|ht|hu|id|ie|il|in|info|int|io|iq|ir|is|it|jm|jo|jp|ke|kg|kh|ki|km|kn|kp|kr|kw|ky|kz|la|lb|lc|li|lk|lr|ls|lt|lu|lv|ly|ma|mc|md|mg|mh|mil|mk|ml|mm|mn|mo|mp|mq|mr|ms|mt|mu|museum|mv|mw|mx|my|mz|na|name|nc|ne|net|nf|ng|ni|nl|no|np|nr|nt|nu|nz|om|online|org|ovh|pa|pe|pf|pg|ph|pk|pl|pm|pn|pr|pro|ps|pt|pw|py|qa|re|ro|ru|rw|sa|sb|sc|sd|se|sg|sh|si|sj|sk|sl|sm|sn|so|sr|st|studio|su|sv|sy|sz|tc|td|tf|tg|th|tj|tk|tm|tn|to|tp|tr|tt|tv|tw|tz|ua|ug|uk|um|us|uy|uz|va|vc|ve|vg|vi|vn|vu|website|wf|ws|ye|yt|yu|za|zm|zw)|(([0-9][0-9]?|[0-1][0-9][0-9]|[2][0-4][0-9]|[2][5][0-5])\.){3}([0-9][0-9]?|[0-1][0-9][0-9]|[2][0-4][0-9]|[2][5][0-5]))$/i;
			return regex.test(str);
		},
		//create/insert record
		createUser(){
			//basic validation
			var err=0;
			for(const i in this.add_user){
				//be careful with property 'id' because it is a number
				if(i!=='id' && this.add_user[i].trim()===''){
					err++;
				}
			}
			if(err>0){
				alert('All fields must be filled!');
				return false;
			}
			if(!this.validateEmail(this.add_user.email)){
				alert('You must enter a valid email!');
				return false;
			}
			//submit data using ajax
			const self=this;
			const x=document.getElementsByName('csrfmiddlewaretoken');
			$.ajax({
				url: '/create/',
				method: 'post',
				data: {
					csrfmiddlewaretoken: x[0].value,
					first_name: self.add_user.first_name,
					last_name: self.add_user.last_name,
					email: self.add_user.email
				}
			}).done(function(response){
				self.add_user=self.getBlankUser();
				self.users=response.users;
				self.switchDiv('divAdd');
				alert(response.msg);
			});
		},
		//show and set edit record form
		edit(obj){
			this.edit_user=obj;
			this.switchDiv('divEdit');
		},
		//update record
		updateUser(){
			//basically this is a copy of save record!
			//basic validation
			var err=0;
			for(const i in this.edit_user){
				//be careful with property 'id' because it is a number
				if(i!=='id' && this.edit_user[i].trim()===''){
					err++;
				}
			}
			if(err>0){
				alert('All fields must be filled!');
				return false;
			}
			if(!this.validateEmail(this.edit_user.email)){
				alert('You must enter a valid email!');
				return false;
			}
			//submit data using ajax
			const self=this;
			const x=document.getElementsByName('csrfmiddlewaretoken');
			$.ajax({
				url: '/update/',
				method: 'post',
				data: {
					csrfmiddlewaretoken: x[0].value,
					id: self.edit_user.id,
					first_name: self.edit_user.first_name,
					last_name: self.edit_user.last_name,
					email: self.edit_user.email
				}
			}).done(function(response){
				self.edit_user=self.getBlankUser();
				self.users=response.users;
				self.switchDiv('divEdit');
				alert(response.msg);
			});
		},
		//delete record (I don't use 'delete' to name my function because it's a JS reserved word)
		drop(obj){
			if(confirm('Do you really want to delete this record: '+obj.first_name+' '+obj.last_name+'?')){
				//submit data using ajax
				const self=this;
				const x=document.getElementsByName('csrfmiddlewaretoken');
				$.ajax({
					url: '/delete/',
					method: 'post',
					data: {
						csrfmiddlewaretoken: x[0].value,
						id: obj.id
					}
				}).done(function(response){
					self.users=response.users;
					alert(response.msg);
				});
			}
		},
	}
});
