// Copyright © 1/20/2020 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.

var fileObjsLI={};

function addRawLogImport(data,thisurl,pageid) {

	if(data.match(/Scoutbook will use this information in calculating prerequisites for rank advancement and other award/) != null ) {
		return data;	//youth Service Log
	}

	if(data.match(/Scoutbook will use this information in calculating prerequisites for merit badges and other award/) != null ) {
		return data;	//youth Hiking Log
	}
	
	if(data.match(/and other information that may be needed for the Camping merit badge and other awards/) != null ) {
		return data;	//youth camping Log
	}
	
	
	if(data.match(/(hiking|camping|service)log\.asp/)==null) {
		return data;
	}

	if(data.match(/<script type="text\/javascript">[ \n\r\t]+function pageInit\(\) {/)==null ){
		return data;
	}	
	var logType=data.match(/(hiking|camping|service)log/)[1];
	var startfunc = data.match(/<a href="(https:\/\/(www|qa)\.scoutbook\.com)*(\/mobile\/dashboard\/admin\/)*(hiking|camping|service)logentry\./).index
    var btn='<a href="#" data-role="button" data-icon="add" data-theme="c" data-inline="true" data-mini="true" id="importButton">Import CSV</a>\n';
	
	data=data.slice(0,startfunc) + btn +data.slice(startfunc);
	startfunc=data.indexOf('<div data-role="popup" id="loginPopup"');

	var newdata='';
	newdata += '	<div data-role="popup" id="impLogPopup" data-overlay-theme="a" class="ui-content" data-theme="e" data-transition="fade">';
	newdata += '		<a href="#" id="closeLogImportPopupButton" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>';
	newdata += '		<div id="implogPopupContent">\n'
	newdata +=			'<ul data-role="listview" data-inset="true" style="min-width: 300px;" data-theme="d" >';  //class="ui-icon-alt"
	newdata +=				'<li data-role="divider" data-theme="a">Import Log File</li>';
	newdata +=				'<li><input id="csvLogfileSelect" type="file" accept=".csv" /> </li>';					
	newdata +=	'			<li><input type="button" value="Import" data-theme="g" id="buttonImp" ><input type="button" value="Cancel" data-theme="g" id="buttonLogImpExpCancel" ></li>';
	newdata +=	'			<li id="importErrEvLI">';
	newdata +=	'			</li>';
	newdata +=			'</ul>';	
	newdata +=			'</div>';
	newdata += '		<div class="clearRight"></div>\n';
	newdata += '	</div>'
	
	data=data.slice(0,startfunc) + newdata +data.slice(startfunc);	


	startfunc=data.match(/<script type="text\/javascript">[ \n\r\t]+function pageInit\(\) {/).index;
	startfunc=data.indexOf('{',startfunc) +1;

	var myfunc = '' + liscript;				
	myfunc = myfunc.slice(22).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(pageid)).replace(/\#logType/g,escapeHTML(logType)).replace(/#unitID/g,escapeHTML(unitID));
	newdata = data.slice(0,startfunc) + myfunc + '\n'  + data.slice(startfunc);			
	data=newdata;	
			
	return data;
}

function liscript() {

	$('#importButton','#PageX').click(function() {
		//alert("#logType");
	  $('#impLogPopup', '#PageX').popup({ tolerance: '10,40', transition: 'pop', positionTo: 'window', history: false }).popup('open');
	});
	

	
	$('#buttonLogImpExpCancel', '#PageX').click(function () {
		
		$('#impLogPopup','#PageX').popup('close');
		$('#buttonImp', '#PageX').button('enable');
		$('#buttonLogImpExpCancel', '#PageX').button('enable');
	});
	$('#buttonImp', '#PageX').click(function () {


		// disable all inputs
		$('#buttonImp', '#PageX').button('disable');
		$('#buttonLogImpExpCancel', '#PageX').button('disable');

		var size = 0;
		var files = document.getElementById('csvLogfileSelect').files;			//file1

		if (files.length == 0) {
			showErrorPopup('Please select the file you want to import and try again.');
			$('#buttonImp', '#PageX').button('enable');
			$('#buttonLogImpExpCancel', '#PageX').button('enable');					
			return false;
		}

		var validFileSet = true;

		var file= files[0];
		size=file.size;
		var fileName = file.name.toLowerCase();

		if (size > 50000000) {
			showErrorPopup('File sizes are too large.  Total size must not be more than 50 MB');
			return false;
		} else if (size > 0) {
			$.mobile.loading('show', { theme: 'a', text: 'reading files...0%', textonly: false });
		} else {
			$.mobile.loading('show', { theme: 'a', text: 'validating...', textonly: false });
		}

		var reader = new FileReader();
		reader.onload = function(){
			var data = reader.result;

			$.mobile.loading('hide');
			$.mobile.loading('show', { theme: 'a', text: 'saving... this can take several minutes', textonly: false });
			document.getElementById("csvLogfileSelect").disabled = true;
			fileObjsLI['regcsvdata']=parseCSV(data);
			
			var res=preProcLogCsv("#logType");
			
			if (res != '') {
				res='The file you selected does not appear to contain necessary headers.\nAborting import.\n  '+res;
			} else {
				if(fileObjsLI.regcsvdata.length <2 ) {
					res += ' CSV file has header only, no data\n';	
				} else {
					if(fileObjsLI.regcsvdata[1]=='') {
						res += ' CSV file has header only, no data\n';	
					} 
				}
			}

			if (res != '') {
				alert(res);
				closeCSVImportLog('#PageX','#unitID','#logType');				
			} else {

				myAccountName("#logType",'#PageX','#unitID');
			}
		};
		reader.readAsText(file);

		return false;
	});
}

function preProcLogCsv(logType) {	//
	var cols=[];
	if(logType=='hiking') {
		cols = ["BSA Member ID","First Name","Last Name","Date","Miles","Location","Notes"];
	}
	if(logType=='service') {
		cols = ["BSA Member ID","First Name","Last Name","Date","Hours","Location","Notes"];
	}
	if(logType=='camping') {
		cols = ["BSA Member ID","First Name","Last Name","Date","Days","Nights","Frost Points","Location","Notes"];
	}
	
	var res='';
	var rowobj={};
	
	if(fileObjsLI.regcsvdata[0].length != cols.length) {
		return 'invalid number of columns in input file';
	}

	 for(var x=0;x<cols.length;x++) {
		 //console.log(x, fileObjsLI.csvdata[0][x] ,cols[x]);
		if (fileObjsLI.regcsvdata[0][x].trim() != cols[x].trim()) {
			//console.log('mismatch');
			res += ' '+fileObjsLI.regcsvdata[0][x].trim()+' <> ' + cols[x] +'\n';
		}
	 }
	 
	 if (res != '') {
		 res = 'The following Column names are missing or not in the right location \n' +res;
		return res;
	 }
	
	 //make sure all rows have all the fields
	  for(var i=1;i<fileObjsLI.regcsvdata.length;i++) {
	    if(fileObjsLI.regcsvdata[i].length != cols.length) {
			res+='Row '+ i + ' does not have all the columns of data.\n'
		}
	  }

	  if (res != '') {
		 res += 'Please check your CSV file.  Hint:  sometimes using Notepad or a similar plain text editor (NOT MS Word) will show you unexpected line breaks the Excel sometimes inserts!'
		return res;
	 }	  

	  


	 fileObjsLI['regcsvObjs']=[];
	 //create an object template and load all rows into 
	 for(var i=1;i<fileObjsLI.regcsvdata.length;i++) {
		 for (var j=0;j<cols.length;j++) {
			 rowobj[cols[j].replace(/ /g,'')]=fileObjsLI.regcsvdata[i][j];
		 }
		 rowobj['stat']=false;
		 fileObjsLI.regcsvObjs.push(JSON.parse(JSON.stringify(rowobj)));
	 }
	 
	return res;
}

function closeCSVImportLog(pageid,unitID,logType) {

		$('#impLogPopup',pageid).popup('close');
		$('#buttonImp', pageid).button('enable');
		document.getElementById("csvLogfileSelect").disabled = false;
		$('#buttonLogImpExpCancel', pageid).button('enable');
		$.mobile.loading('hide');
		$('#faOverlay').hide();
		fileObjsLI={};
			$.mobile.changePage(
				'/mobile/dashboard/admin/'+logType+'log.asp?UnitID='+unitID,
			{
				allowSamePageTransition: true,
				transition: 'none',
				showLoadMsg: true,
				reloadPage: true
			}
			);
}

function myAccountName(logType,pageid,unitID) {
	$('#faOverlay').show();
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			HandleErrors(this.status,closeCSVImportLog,[pageid,unitID,logType], myAccountName,[logType,pageid,unitID]);;
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			HandleErrors(this.status,closeCSVImportLog,[pageid,unitID,logType], myAccountName,[logType,pageid,unitID]);;
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			
			var firstName=$('input#firstName',this.response).val();
			var lastName=$('input#lastName',this.response).val();
			importLogData(logType,pageid,unitID,firstName,lastName);
		}	
	};
	
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/editprofile.asp?ScoutUserID=&UnitID=&DenID=&PatrolID=';
	xhttp.open("GET",url, true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		HandleErrors(500,closeCSVImportLog,[pageid,unitID,logType], myAccountName,[logType,pageid,unitID]);
		return;
	 
		 
	};
}

function importLogData(logType,pageid,unitID,firstName,lastName) {
	var iPtr;
	for(iPtr=0;iPtr<fileObjsLI.regcsvObjs.length;iPtr++) {
		if(fileObjsLI.regcsvObjs[iPtr].stat==false) {
			if(fileObjsLI.regcsvObjs[iPtr].FirstName==firstName && fileObjsLI.regcsvObjs[iPtr].LastName==lastName) {
				break;
			}
		}
	}
	if(iPtr==fileObjsLI.regcsvObjs.length) {
		closeCSVImportLog(pageid,unitID,logType);
		//refresh
		return;
	}
	
	if(logType=='hiking') {
		formpost='Action=Submit&Location='+encodeURIComponent(fileObjsLI.regcsvObjs[iPtr].Location)+'&LogDate='+encodeURIComponent(fileObjsLI.regcsvObjs[iPtr].Date)+'&Miles='+encodeURIComponent(fileObjsLI.regcsvObjs[iPtr].Miles)+'&Notes='+encodeURIComponent(fileObjsLI.regcsvObjs[iPtr].Notes);
	}
	if(logType=='camping') {
		formpost='Action=Submit&Location='+encodeURIComponent(fileObjsLI.regcsvObjs[iPtr].Location)+'&LogDate='+encodeURIComponent(fileObjsLI.regcsvObjs[iPtr].Date)+'&Days='+encodeURIComponent(fileObjsLI.regcsvObjs[iPtr].Days)+'&Nights='+encodeURIComponent(fileObjsLI.regcsvObjs[iPtr].Nights)+'&FrostPoints='+encodeURIComponent(fileObjsLI.regcsvObjs[iPtr].FrostPoints)+'&Notes='+encodeURIComponent(fileObjsLI.regcsvObjs[iPtr].Notes);
	}
	if(logType=='service') {
		formpost='Action=Submit&Location='+encodeURIComponent(fileObjsLI.regcsvObjs[iPtr].Location)+'&LogDate='+encodeURIComponent(fileObjsLI.regcsvObjs[iPtr].Date)+'&Hours='+encodeURIComponent(fileObjsLI.regcsvObjs[iPtr].Hours)+'&Notes='+encodeURIComponent(fileObjsLI.regcsvObjs[iPtr].Notes);

	}	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			HandleErrors(this.status,closeCSVImportLog,[], importLogData,[logType,pageid,unitID,firstName,lastName]);
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			HandleErrors(this.status,closeCSVImportLog,[], importLogData,[logType,pageid,unitID,firstName,lastName]);	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			//check for good response;
			fileObjsLI.regcsvObjs[iPtr].stat=true;
			setTimeout(function () {			
				importLogData(logType,pageid,unitID,firstName,lastName);
			},100);	
		}	
	};
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/admin/'+logType+'logentry.asp?ScoutUserID=&HikingLogID=&QuickEntry=&DenID=&PatrolID=';
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formpost);

	xhttp.onerror = function() {
		HandleErrors(500,closeCSVImportLog,[], importLogData,[logType,pageid,unitID,firstName,lastName]);
	};	
}



function HandleErrors(status,errfunc,errargs,retryfunc,retryargs) {
		if (status > 399  && status < 500) {			
			alert('Error: '+ status + ' failure');  //page not found etc.  This is unrecoverable
			if(errfunc != '') {
				window[errfunc.name].apply(null,errargs);
			}
			return;
		}
		if (status > 499) {
			if (servErrCnt > maxErr) {
				alert('Error: '+ status + ' failure with multiple retries');
				if(errfunc != '') {
					window[errfunc.name].apply(null,errargs);
				}	
				return;
			} else {
				if(retryfunc != '') {
					window[retryfunc.name].apply(null,retryargs);//server side error - maybe next try will work
				}
				return;
			}	
		}
}