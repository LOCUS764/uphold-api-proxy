// ==UserScript==
// @name         Kendra coil callback redirect
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://app.kendra.io/coil/callback?*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    var extBase = 'https://app.kendra.io/coil/callback?';
    window.location.href='http://localhost:4200/examples/basicPlayerWebMoney?' + window.location.href.replace(extBase, '');

})();