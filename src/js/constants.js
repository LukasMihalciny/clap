'use strict';

function Constants() {
	this.token = '';
	this.bearer = '';
	this.user = {};
	this.cl_data = {};
}

Constants.prototype.get_authorization = function() {
	return 'Basic ' + this.bearer;
}

export default new Constants;
