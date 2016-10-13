class HeaderController {
	constructor($rootScope, $auth, $state, userService) {
		let _this = this;
		let current_url = location.host;
		this.socket = io.connect(current_url);
		this.$rootScope = $rootScope;
		this.$auth = $auth;
		this.$state = $state;
		this.userService = userService;
		this.currentUser = {};

		this.userService.getCurrentUser().then((response) => {
			if(response.statusUser === 200) {
				this.currentUser.name = response.data.name;
				this.currentUser.email = response.data.email;
				this.currentUser.token = response.data.token;
			}
		});

		this.$rootScope.$on('currentUser', (event,response) => {
			this.currentUser = response;
		});
	}

	logout(){
        // this.$rootScope.$emit('notifyStatus', {email: this.currentUser.email, status: 'offline'});
        this.socket.emit('user logout', this.currentUser);
        this.$auth.logout().then(() => {
            localStorage.removeItem('satellizer_token');
            this.$state.go('login', { redirect : true });
        });
    }

	isAuthenticated() {
		return this.$auth.isAuthenticated();
	}

}

export default HeaderController;