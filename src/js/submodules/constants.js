'use strict';

function Constants() {
	this.token = '';
	this.bearer = '';
	this.user = {};
	this.cl_data = {};
	this.clicked_target = {};
}

Constants.prototype.set_token_bearer = function( token, bearer ) {
	this.token = token;
	this.bearer = bearer;
}
Constants.prototype.clear_token_bearer = function() {
	this.token = '';
	this.bearer = '';
}
Constants.prototype.get_authorization = function() {
	return 'Basic ' + this.bearer;
}

Constants.prototype.set_cl_data = function( request_result ) {
	this.cl_data = JSON.parse( request_result );
}
Constants.prototype.get_cl_data = function() {
	return this.cl_data;
}

Constants.prototype.set_user = function( request_result ) {
	this.user = JSON.parse( request_result );
}
Constants.prototype.clear_user = function( request_result ) {
	this.user = {};
}
Constants.prototype.get_user_data = function() {
	return this.user.data;
}

Constants.prototype.set_clicked_target = function( target ) {
	this.clicked_target = target;
}
Constants.prototype.get_clicked_target = function() {
	return this.clicked_target;
}

export default new Constants;
