
setTimeout(function () {
	//only change the page if it is not in the signup process || display of login process
	if(document.baseURI.indexOf('/mobile/signup') == -1 && window.location.search.substring(1).indexOf("ShowLogin=1") === -1) {
		//console.log('changepage on timeout',document.baseURI);
		changepageurl(document.baseURI);
	}
},800);
/*
future reliability enhancements for server or network errors

add globals
var servErrCnt=0;
var maxErr=5;

in functions using xhttp calls

			if (this.readyState == 4 && this.status == 200) {
				servErrCnt=0;

			if (this.readyState == 4 && this.status != 200 && this.status == 500) 
				 console.log('Server Error ' +servErrCnt);
				 if (servErrCnt > maxErr) {
					 $.mobile.loading('hide');
					alert('Halted due to excessive Server errors');
					return;
				 }
				 servErrCnt++;
				
				setTimeout(function() {*currentFunction*(*current args*);},1000);	//reset 

*/

/*
  ajaxSetup
  Scoutbook pages have dynamic content.  
  Listen for ajax events and inject code only on specific pages
  When I say inject code here - as there are many types of inject - I mean get into the raw 
  message so the SB dynamic rendering is done just once
   i.e. when the proper url is detected
*/
/*********************COMMON CODE***************
This defines storage location for function names to be executed 
in the AjaxSetup dataFilter.  Essentially, it is acting as though we are
binding functions to an Ajax event

Each extension shall contain this code.

The first extension loaded contains the master.
Unloading a function may disable all extensions 

***********************************************/


if (typeof Funclist == 'undefined' ) {
	var Funclist = function() {
		var _funcDefs = [];
		Object.defineProperties(this, {
			"funcDefs": {
				get: function() {
					return _funcDefs.concat();
				}
			},
			"addFuncDef": {
				value: function(funcDef) {
					_funcDefs.push(funcDef);
				}
			}
		});
	};

	var bindToFilter = new Funclist();
	asetup(bindToFilter,0);

}


bindToFilter.addFuncDef(faFilter);

