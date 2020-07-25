'use strict';

import login from './login.js';

function clap_initialize() {
	login.add_listeners();
	login.on_startup_check_localstorage();
}

clap_initialize();
