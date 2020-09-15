'use strict';

const version = require( 'electron' ).remote.app.getVersion();
var span = document.querySelector( '#current span' );
span.innerHTML = version;
