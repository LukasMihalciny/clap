'use strict';

import login from './login.js';

/* login on startup if bearer is present in localStorage
**************************************************************************/
login.on_startup_check_localstorage();
