// Copyright © 10/22/2018 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.
// Thanks to Craig Agricola for adding most of the code to handle multiple calendars
function proc_Ajax_InsertCalImportCSVLink(data) {
	if(data.match(/>Create New Event</) != null) {
		// insert the import
		var startfunc = data.indexOf('>Create New Event<');
		var startfunc = data.indexOf('</ul>',startfunc);
		if (startfunc != -1) {
			//data=data.slice(0,startfunc) + '<li> <a href="#"  id="importCSVEvents" class="showLoading" >Import CSV Events</a></li>' + data.slice(startfunc);
			
			var newdata = '	<li class="csv" id="csvDivider" data-theme="d" >';						
			newdata += '    <a href="#importEventMenu" data-rel="popup" data-transition="slideup" >';					
			newdata += '	<div id ="importEvent">';
			newdata += '		<div style="display: inline-block; width: 28px; margin-right: 1px; ">';
			newdata += '			<img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/quickentry48.png" alt="quick entry" title="Import Calendar Event" style="position: absolute; left: 12px; top: 6px; width: 23px; " />'; //class="imageSmall"
			newdata += '		</div>';
			newdata += '		Import Calendar Events from CSV';
			newdata += '	</div>';
			newdata += '	</a>';
			newdata += '</li>';							
			//newdata = '	<li class="csvx" id="csvDividerx" data-theme="d" >';							
						
			
			data=data.slice(0,startfunc) + newdata + data.slice(startfunc);						

		}
	}
	return data;
}


function insertEventImport(data,pageid) {
		var startfunc = data.indexOf('<div id="footer"');
		
		var newdata = '	<div data-role="popup" id="importEventMenu" data-theme="d" data-history="false">';
		
		newdata +=			'<ul data-role="listview" data-inset="true" style="min-width: 300px;" data-theme="d" >';  //class="ui-icon-alt"
		newdata +=				'<li data-role="divider" data-theme="e">Choose Calendar CSV data file to import:</li>';
		newdata +=				'<li><input id="CSVfileSelect" type="file" accept=".csv" /> </li>';					
		
		newdata +=	'			<li><input type="submit" value="Import Event File" data-theme="g" id="buttonEvImport" ><input type="submit" value="Cancel" data-theme="g" id="buttonImportEvCancel" ></li>';
		newdata +=	'			<li id="importErrEvLI">';
		newdata +=	'			</li>';
		newdata +=			'</ul>';						

		
		newdata += '	</div>';				
		data = data.slice(0,startfunc) + newdata + '\n' + data.slice(startfunc);
	
// ## Event Import
	startfunc = data.indexOf("function showProgress");
	var myfunc = '' + evimpfu;
	myfunc = myfunc.slice(21).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(escapeHTML(pageid))).replace('unitid',escapeHTML(unitID));
	data = data.slice(0,startfunc) + myfunc + '\n' + data.slice(startfunc);
	
	return data;

}


//## Begin CalendarImport Code

function evimpfu () {
			var fileObjs={};
			$('#buttonImportEvCancel', '#PageX').click(function () {
				$('#importEventMenu', '#PageX').popup('close');
				$('#buttonEvImport', '#PageX').button('enable');
				$('#buttonImportEvCancel', '#PageX').button('enable');   
			});
			$('#buttonEvImport', '#PageX').click(function () {
				$('#faOverlay', '#PageX').show();

				// disable all inputs
				$('#buttonEvImport', '#PageX').button('disable');
				$('#buttonImportEvCancel', '#PageX').button('disable');

				var size = 0;
				var files = document.getElementById('CSVfileSelect').files;			//file1

				if (files.length == 0) {
					showErrorPopup('Please select the file you want to import and try again.');
					$('#buttonEvImport', '#PageX').button('enable');
					$('#buttonImportEvCancel', '#PageX').button('enable');
					$('#faOverlay', '#PageX').hide();
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
					$.mobile.loading('show', { theme: 'a', text: 'saving... this can take several minutes for large numbers of events', textonly: false });
					document.getElementById("CSVfileSelect").disabled = true;
					fileObjs['csvdata']=parseCSV(data);
					var res=preProcessCSVdata();
					if (res != '') {
						alert('The file you selected has the following errors.\nAborting import.\n  '+res);
						closeCSVImport( '#PageX');						
					} else {
						//validateCSVdata(); 
						NewEventValidate('#PageX');
					}
				};
				reader.readAsText(file);

				return false;
			});
}

//Calendar	EventType	Name	Location	StartDate	StartTIme	EndDate	EndTime	RSVP	Permission	Leaders	Parents	Scouts	Description

function preProcessCSVdata() {	//tested used
	var cols = ["Calendar","EventType","Name","Location","StartDate","StartTime","EndDate","EndTime","RSVP","Permission","Leaders","Parents","Scouts","Description","Reminders","mapURL"];
	var res='';

	 for(var x=0;x<cols.length;x++) {
		 //console.log(x, fileObjs.csvdata[0][x] ,cols[x]);
		 if(x <fileObjs.csvdata[0].length) {
			if (fileObjs.csvdata[0][x].trim() != cols[x].trim()) {
				//console.log('mismatch');
				res += cols[x] + '<>' +fileObjs.csvdata[0][x].trim()+'\n';
			}
		 } else {
			 res += cols[x]+ '<>empty\n';
		 }
	 }


	 if (res != '') res = 'Column names are missing or not in the right location ' +res + '\n';
	 
	for(var i=1;i<fileObjs.csvdata.length;i++) {
		if(fileObjs.csvdata[i].length != cols.length) {
			
			res += 'there is an invalid number of columns in the csv file data';
			break;
		}
	}	 
	 
	return res;
}

function validateCSVdata(calLst,pageid) {
	var cols = ["Calendar","EventType","Name","Location","StartDate","StartTime","EndDate","EndTime","RSVP","Permission","Leaders","Parents","Scouts","Description","Reminders"];



	// check calendar column	


	var res=''
	for(var i=1;i<fileObjs.csvdata.length;i++) {
		fileObjs.csvdata[i][0]=fileObjs.csvdata[i][0].replace(/ ,/g,',').trim();
		fileObjs.csvdata[i][0]=fileObjs.csvdata[i][0].replace(/, /g,',').trim();
		var cals = fileObjs.csvdata[i][0].split(",");
		for (var k=0;k<cals.length;k++) {
			var found=false
			for (var j=0;j<calLst.length;j++) {
				if (cals[k] == calLst[j]) {
					found=true;
					break;
				}
			}
			if(found==false) {
				res+="Unrecognized calendar in CSV file Calendar Column: " + cals[k] + '\n';
			}
		}
	}	
	var combos=[["Pack","Pack Meeting"],
	["Pack","Recruiting"],
	["Pack","Committee Meeting"],
	["Pack","Webelos to Scout Transition"],
	["Pack","Day Camp"],
	["Pack","Training"],
	["Pack","Other"],
	["Troop","Troop Meeting"],
	["Troop","Court of Honor"],
	["Troop","Patrol Leaders\' Council"],
	["Troop","Recruiting"],
	["Troop","Committee Meeting"],
	["Troop","Webelos to Scout Transition"],
	["Troop","Campout"],
	["Troop","Training"],
	["Troop","Other"],
	["Crew","Crew Meeting"],
	["Crew","Crew Officers Meeting"],
	["Crew","Open House"],
	["Crew","Annual Planning Conference"],
	["Crew","Election of Officers"],
	["Crew","Crew Officers Briefing"],
	["Crew","Crew Officers Seminar"],
	["Crew","Committee Meeting"],
	["Crew","Campout"],
	["Den","Den Meeting"],
	["Den","Day Camp"],
	["Den","Training"],
	["Den","Other"],
	["Patrol","Patrol Meeting"],
	["Patrol","Training"],
	["Patrol","Other"],
	["Patrol","Campout"],
	["Squad","Squad Meeting"],
	["Team","Committee Meeting"]];
	var chk='';

	for(var i=1;i<fileObjs.csvdata.length;i++) {
		//might be multiple calendars now
		var rcalLst=fileObjs.csvdata[i][0].split(',');
		
		for (var j=0;j<rcalLst.length;j++) {
	
			// if the row is a Pack, Troop, Den, or Patrol
			
			if( rcalLst[j].match(/^(Troop \d+) B|G$/) != null) {
					chk='Troop';
			}			
			if( rcalLst[j].match(/(Patrol)$/) != null) {
					chk="Patrol";
			}

			if( rcalLst[j].match(/^(Pack \d+)$/) != null) {
					chk='Pack';
			}
			
			if( rcalLst[j].match(/^(Pack \d+) .+ Den /) != null) {
					chk='Den';
			}		
			if( rcalLst[j].match(/^(Crew \d+)$/) != null) {
					chk='Crew';
			}	

			if( rcalLst[j].match(/^(Team \d+).+ Squad/) != null) {
					chk='Squad';
			}	
			if( rcalLst[j].match(/^(Team \d+)$/) != null) {
					chk='Team';
			}		
			var found=false;		
			for(var j=0;j<combos.length;j++) {
				if(combos[j][0] == chk) {
					if(combos[j][1] ==fileObjs.csvdata[i][1]) {
						found=true;
						break;
					}
				}
			}
			if(found==false) {
				res+="Unrecognized Event Type in CSV file EventType Column: " + fileObjs.csvdata[i][1] + ' line: '+ i ;
			}	
		}		
		
	}	
	
	for(var i=1;i<fileObjs.csvdata.length;i++) {	
		if(fileObjs.csvdata[i][2] =='') {
			res+="No name in CSV file Name Column: " + fileObjs.csvdata[i][2] +  ' line: '+ i ;
		}	
	}
	
	//startdate
	for(var i=1;i<fileObjs.csvdata.length;i++) {

		
		if(fileObjs.csvdata[i][4].match(/^(\d+\/\d+\/\d\d\d\d)$/) ==null) {
			res+="Improper startDate in CSV file startDate Column: " + fileObjs.csvdata[i][4] +  ' line: '+ i ;
		} else {
			if(fileObjs.csvdata[i][4].match(/(\d+)\/\d+\/\d+/)[1] > 12) res+="Improper startDate Month in CSV file startTime Column: " + fileObjs.csvdata[i][4] +  ' line: '+ i ;
			if(fileObjs.csvdata[i][4].match(/\d+\/(\d+)\/\d+/)[1] > 31) res+="Improper startDate Day in CSV file startTime Column: " + fileObjs.csvdata[i][4] +  ' line: '+ i ;
			if(fileObjs.csvdata[i][4].match(/\d+\/\d+\/\d+/)[1] > 2030) res+="Improper startDate Year in CSV file startTime Column: " + fileObjs.csvdata[i][4] +  ' line: '+ i ;
		}
	}	

	for(var i=1;i<fileObjs.csvdata.length;i++) {
		
		if(fileObjs.csvdata[i][5] =='' ) {
			fileObjs.csvdata[i][5] = '12:00 AM';
		}		
		
		if(fileObjs.csvdata[i][5].match(/^(\d+:\d\d (A|P)M)$/) ==null) {
			//check if it has seconds in it, if so, removeAttribute
			if(fileObjs.csvdata[i][5].match(/^(\d+:\d\d:\d\d (A|P)M)$/) !=null) {
				// replace the seconds
				fileObjs.csvdata[i][5]=fileObjs.csvdata[i][5].replace(/:\d\d /,' ');
				if(fileObjs.csvdata[i][5].match(/(\d+):\d+/)[1] >12 ) res+="Improper startTime in CSV file startTime Column: " + fileObjs.csvdata[i][5] +  ' line: '+ i ;
				if(fileObjs.csvdata[i][5].match(/\d+:(\d+)/)[1] >59 ) res+="Improper startTime in CSV file startTime Column: " + fileObjs.csvdata[i][5] +  ' line: '+ i ;				
			} else {
				res+="Improper startTime in CSV file startTime Column: " + fileObjs.csvdata[i][5] +  ' line: '+ i ;
			}
		} else {
			if(fileObjs.csvdata[i][5].match(/(\d+):\d+/)[1] >12 ) res+="Improper startTime in CSV file startTime Column: " + fileObjs.csvdata[i][5] +  ' line: '+ i ;
			if(fileObjs.csvdata[i][5].match(/\d+:(\d+)/)[1] >59 ) res+="Improper startTime in CSV file startTime Column: " + fileObjs.csvdata[i][5] +  ' line: '+ i ;
		}
		
	}

	for(var i=1;i<fileObjs.csvdata.length;i++) {	
		if(fileObjs.csvdata[i][6].match(/^(\d+\/\d+\/\d\d\d\d)$/) ==null) {
			res+="Improper EndDate in CSV file EndDate Column: " + fileObjs.csvdata[i][6] +  ' line: '+ i ;
		} else {
			if(fileObjs.csvdata[i][6].match(/(\d+)\/\d+\/\d+/)[1] > 12) res+="Improper endDate Month in CSV file endTime Column: " + fileObjs.csvdata[i][6] +  ' line: '+ i ;
			if(fileObjs.csvdata[i][6].match(/\d+\/(\d+)\/\d+/)[1] > 31) res+="Improper endDate Day in CSV file endTime Column: " + fileObjs.csvdata[i][6] +  ' line: '+ i ;
			if(fileObjs.csvdata[i][6].match(/\d+\/\d+\/\d+/)[1] > 2030) res+="Improper endDate Year in CSV file endTime Column: " + fileObjs.csvdata[i][6] +  ' line: '+ i ;
		}	
	}	

	for(var i=1;i<fileObjs.csvdata.length;i++) {

		if(fileObjs.csvdata[i][7] =='' ) {
			fileObjs.csvdata[i][7] = '12:00 AM';
		}	
		
		if(fileObjs.csvdata[i][7].match(/^(\d+:\d\d (A|P)M)$/) ==null) {
			//check if it has seconds in it, if so, removeAttribute
			if(fileObjs.csvdata[i][7].match(/^(\d+:\d\d:\d\d (A|P)M)$/) !=null) {
				// replace the seconds
				fileObjs.csvdata[i][7]=fileObjs.csvdata[i][7].replace(/:\d\d /,' ');
				if(fileObjs.csvdata[i][7].match(/(\d+):\d+/)[1] >12 ) res+="Improper EndTime in CSV file startTime Column: " + fileObjs.csvdata[i][7] +  ' line: '+ i ;
				if(fileObjs.csvdata[i][7].match(/\d+:(\d+)/)[1] >59 ) res+="Improper EndTime in CSV file startTime Column: " + fileObjs.csvdata[i][7] +  ' line: '+ i ;				

			} else {
				res+="Improper EndTime in CSV file EndTime Column: " + fileObjs.csvdata[i][7] +  ' line: '+ i ;
			}
		} else {
			if(fileObjs.csvdata[i][7].match(/(\d+):\d+/)[1] >12 ) res+="Improper EndTime Hr in CSV file startTime Column: " + fileObjs.csvdata[i][7] +  ' line: '+ i ;
			if(fileObjs.csvdata[i][7].match(/\d+:(\d+)/)[1] >59 ) res+="Improper EndTime Min in CSV file startTime Column: " + fileObjs.csvdata[i][7] +  ' line: '+ i ;
		}	
	}
	

	for(var i=1;i<fileObjs.csvdata.length;i++) {
		if(fileObjs.csvdata[i][8]=='') {
			fileObjs.csvdata[i][8]='off';
		}
		if(fileObjs.csvdata[i][8].match(/^(on|off)$/) ==null) {
			res+="Improper RSVP in CSV file RSVP Column: " + fileObjs.csvdata[i][8] +  ' line: '+ i ;
		}	
	}

	for(var i=1;i<fileObjs.csvdata.length;i++) {
		if(fileObjs.csvdata[i][9]=='') {
			fileObjs.csvdata[i][9]='off';
		}
		if(fileObjs.csvdata[i][9].match(/^(on|off)$/) ==null) {
			res+="Improper PermissionSlip in CSV file Permission Column: " + fileObjs.csvdata[i][9] +  ' line: '+ i ;
		}	
	}


	
	for(var i=1;i<fileObjs.csvdata.length;i++) {
		if(fileObjs.csvdata[i][10]=='') {
			fileObjs.csvdata[i][10]='off';
		}
		if(fileObjs.csvdata[i][10].match(/^(on|off)$/) ==null) {
			res+="Improper Leaders in CSV file Leaders Column: " + fileObjs.csvdata[i][10] +  ' line: '+ i ;
		}	
	}	
	for(var i=1;i<fileObjs.csvdata.length;i++) {
		if(fileObjs.csvdata[i][11]=='') {
			fileObjs.csvdata[i][11]='off';
		}		
		if(fileObjs.csvdata[i][11].match(/^(on|off)$/) ==null) {
			res+="Improper Parents in CSV file Parents Column: " + fileObjs.csvdata[i][11] +  ' line: '+ i ;
		}	
	}	
	
	for(var i=1;i<fileObjs.csvdata.length;i++) {
		if(fileObjs.csvdata[i][12]=='') {
			fileObjs.csvdata[i][12]='off';
		}
		if(fileObjs.csvdata[i][12].match(/^(on|off)$/) ==null) {
			res+="Improper Scouts in CSV file Scouts Column: " + fileObjs.csvdata[i][12] +  ' line: '+ i ;
		}	
	}

	for(var i=1;i<fileObjs.csvdata.length;i++) {	
		if(fileObjs.csvdata[i][12].match(/^(on)$/) !=null) {
			if(fileObjs.csvdata[i][11].match(/^(on)$/) ==null   && fileObjs.csvdata[i][10].match(/^(on)$/) ==null)
			
			res+="Adults must be invited to events when Scouts are invited, in CSV file line: " +i + '\n';
		}	
	}

	// a list of 5d 4h
	for(var i=1;i<fileObjs.csvdata.length;i++) {
		if(fileObjs.csvdata[i][14]!='')	{	
			var token = fileObjs.csvdata[i][14].split(' ');
			for(var k=0;k<token.length;k++) {
				if(token[k].trim() != '') {
					if(token[k].trim().match(/^(\d+(h|d))$/) ==null) {
						res+="Improper reminder values in CSV file Reminders Column: " + fileObjs.csvdata[i][14] +  ' line: '+ i ;
					}
				}
			}
		}
	}	
	
	if (res == '') {
		// check dates
		for(var i=1;i<fileObjs.csvdata.length;i++) {
			var sd =new Date( fileObjs.csvdata[i][4] + ' ' +fileObjs.csvdata[i][5]);
			var ed = new Date(fileObjs.csvdata[i][6] + ' ' +fileObjs.csvdata[i][7]);			
			
			if(ed-sd < 0) {
				res+='row ' +i  +" start date after end date: " + fileObjs.csvdata[i][4] +  ' line: '+ i ;
			}	
			//if(sd-Date.now() < 0) {
			//	res+='row ' +i  +" start date before current time and date: " + fileObjs.csvdata[i][4] + '\n';
			//}				
			
		}			
	}
	
	
	if (res != '') {
		alert(res);
		closeCSVImport(pageid);							
	} else {
		fileObjs.csvdata.shift();	// get rid of header row
		
		NewEvent(pageid);

	}
}


function closeImportclrEv(pageid){
	//alert('Please note the issues listed!');
	$('#importErrEvLI',pageid).text('');
	closeCSVImport(pageid);
	
}
function closeCSVImport(pageid) {	//tested used
	$.mobile.loading('hide');
	$('#faOverlay',pageid).hide();
	if($('#importErrEvLI',pageid).length != 0) {
		if($('#importErrEvLI',pageid).text() != '') {
			setTimeout(function () {closeImportclrEv(pageid);},1000);
			return;
		}

		$('#buttonImportEvCancel',pageid).button('enable');
		$('#buttonEvImport',pageid).button('enable');
		document.getElementById("CSVfileSelect").disabled = false;
		$('#importEventMenu',pageid).popup('close');
		$.mobile.loading('hide');	
	}

	$('#birthdayMenu',pageid).popup('close');

}

//var cols = ["Calendar","EventType","Name","Location","StartDate","StartTime","EndDate","EndTime","RSVP","Permission","Leaders","Parents","Scouts","Description","Reminders","mapURL"];
function NewEventValidate(pageid) {
			

	var calLst=[];

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			closeCSVImport(pageid);
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errClHandle(pageid,closeCSVImport,[pageid], NewEventValidate,[pageid]);	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			
			var utc=$('#eventTimezone option:selected',this.response).val();
			if(utc==undefined) {
				fileObjs['utc']='';
			} else {
				fileObjs['utc']=utc;
			}
			
			var res=$('option',this.response);
			
			for (var i=0;i<res.length;i++) {
				//console.log(res[i].value);
				if( res[i].value.match(/UnitID\d+/) != null ){
					calLst.push(res[i].text);
				}
				if( res[i].value.match(/DenID\d+/) != null ){
					calLst.push(res[i].text);
				}
				if( res[i].value.match(/PatrolID\d+/) != null ){
					calLst.push(res[i].text);
				}
			}
			//console.log(calLst);
			validateCSVdata(calLst,pageid);
		}
	};
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp';
	xhttp.open("GET", url, true);
	xhttp.send();
	xhttp.onerror = function() {
		errClHandle(pageid,closeCSVImport,[pageid], NewEventValidate,[pageid]);
	};

}

function NewEvent(pageid) {
			
	if(fileObjs.csvdata.length==0) {

		closeCSVImport(pageid);
		return;
	}
	var formpost='';
	var eventData = fileObjs.csvdata[0];
	var calids=[];
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			closeCSVImport(pageid);
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errClHandle(pageid,closeCSVImport,[pageid], NewEvent,[pageid]);	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			fileObjs.csvdata.shift();
			var pageid='';
			var EventID='';
			
			if(this.responseText.match(/id="Page(\d+)/) != null) {
				pageid=this.responseText.match(/id="Page(\d+)/)[1]; 
			}
			if(this.responseText.match(/EventID=(\d+)/)!= null) {
				EventID= this.responseText.match(/EventID=(\d+)/)[1];
			}
			
			
			var calOpts = $('#calendarID',this.response);
			var cals = eventData[0].split(',');
			for (var j=0;j<cals.length;j++) {
				for (var i=0;i<$('option',calOpts).length;i++) {
					if( $('option',calOpts)[i].text == cals[j]) {
						calids.push($('option',calOpts)[i].value);
						break;
					}
				}
			}
			formpost='Action=SaveEvent'; //&CalendarIDs=CalendarID%3D' + calids[0];
	//		for (var j=1;j<calids.length;j++) {
	//		  formpost += '%26CalendarID%3D' + calids[j];
	//		}
			for (var j=0;j<calids.length;j++) {
			  formpost += '&CalendarID='+calids[j];
			}
			//EventTimezone: America/Chicago
			
			formpost += '&EventType='+encodeURIComponent(eventData[1]);
			formpost += '&Name='+encodeURIComponent(eventData[2]);
			formpost += '&Location='+encodeURIComponent(eventData[3]);					
			formpost += '&StartDate='+encodeURIComponent(eventData[4] + ' ' +eventData[5] );	
			formpost += '&EndDate='+encodeURIComponent(eventData[6] + ' ' +eventData[7] );	
			if(fileObjs.utc != "" ) {
				formpost += '&EventTimezone='+encodeURIComponent(fileObjs.utc);	
			}
			formpost += '&GrowthPlan=off&OutdoorActivity=off&ServiceProject=off&ServiceProjectBenefit=off&ParentOrientation=off&BudgetCompleted=off&BudgetIncludesScouts=off&BudgetScoutsParticipate=off&BudgetReviewed=off&ParentalInvolvement=off&ScoutStrong=off&GroupFitness=off&FitnessCompetition=off&MyScoutingTools=off&PatrolTraining=off&PlansReviewedParents=off';
			formpost += '&RSVP='+encodeURIComponent(eventData[8]);
			formpost += '&SlipsRequired='+encodeURIComponent(eventData[9]);	
			formpost += '&Description='+encodeURIComponent(eventData[13]);
			formpost += '&Notes=';
	
			var remindpost='';
			if(eventData[14] != '') {
				// have reminders too
				var hrRemind= eventData[14].match(/\d+h/g);
				if(hrRemind == null) hrRemind=[];
				var dyRemind=eventData[14].match(/\d+d/g);
				if(dyRemind == null) dyRemind=[];
				for (var i=0;i<hrRemind.length;i++) {
					if(hrRemind[i].match(/\d+/) != null) {
						formpost += '&Reminders=' +hrRemind[i].match(/\d+/)[0];
						remindpost += '&Reminders=' +hrRemind[i].match(/\d+/)[0];
					}
				}
				for (var i=0;i<dyRemind.length;i++) {
					if(dyRemind[i].match(/\d+/)!=null) {
						formpost += '&Reminders=' +parseInt(dyRemind[i].match(/\d+/)[0])*24;
						remindpost += '&Reminders=' +parseInt(dyRemind[i].match(/\d+/)[0])*24;
					}
				}					
				
			}
			
			formpost += '&mapURL=' +encodeURIComponent(eventData[15]);
		
			getAttendees(EventID,pageid,calids,encodeURIComponent(eventData[1]),eventData[10],eventData[11],eventData[12],formpost,eventData[8],remindpost);



		}
	};
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp';
	xhttp.open("GET", url, true);
	xhttp.send();
	xhttp.onerror = function() {
		errClHandle(pageid,closeCSVImport,[pageid], NewEvent,[pageid]);
	};

}
function getAttendees(eventid,pageid,calids,eventtype,leaders,parents,scouts,formpost,rsvp,remindpost) {
	var attArr=[];
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			closeCSVImport(pageid);
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errClHandle(pageid,closeCSVImport,[pageid],getAttendees,[eventid,pageid,calids,eventtype,leaders,parents,scouts,formpost,rsvp,remindpost]);	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			if(leaders=='on') {
				attArr= this.response.match(/LeaderUserID\d+/g);
				if(attArr!=null) {
					for(var i=0;i<attArr.length;i++) {
						formpost += '&Attendees=' +attArr[i];
					}
				}
			}
			if(parents=='on') {
				attArr= this.response.match(/ParentUserID\d+/g);
				if(attArr!=null) {
					for(var i=0;i<attArr.length;i++) {
						formpost += '&Attendees=' +attArr[i];
					}
				}
			}
		

			if(scouts=='on') {
				var id1=[];
				var id2=[];
				var idAndName;
				idAndName=this.response.match(/ScoutUserID\d+">[^<]+/g);	
				if (idAndName != null) {
					for(var i=0;i<idAndName.length;i++) {
						if(idAndName[i].match(/>ACCOUNT,/g) == null) {
							console.log(idAndName[i]);
							formpost += '&Attendees=' + idAndName[i].match(/ScoutUserID\d+/)[0];
							id1.push(idAndName[i].match(/ScoutUserID\d+/)[0]);
						}
					}
				}					
				
				/*
				attArr= this.response.match(/(ScoutUserID\d+)(?!">ACCOUNT,)/g);
				if(attArr!=null) {
					for(var i=0;i<attArr.length;i++) {
						
						//formpost += '&Attendees=' +attArr[i];
						id2.push(attArr[i]);
					}
				}
				*/
			}
			//debugger;
			//return;
			
			//set rsvp
			if (rsvp=='on') {
				setRSVP(eventid,pageid,formpost,remindpost);
				return;
			}
		
			if(remindpost != '') {
				saveRemind(eventid,pageid,formpost,remindpost);
				return;
			}
			saveEvent(formpost,eventid,pageid);
		}	
	};
	
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID='+eventid+'&PageID=Page'+pageid+'&Action=UpdateAttendeeGroupOptions';
	for(var i=0;i<calids.length;i++) {
	  url += '&CalendarID='+calids[i];
	}
	url += '&EventType='+eventtype;

	xhttp.open("GET", url, true);
	xhttp.send();
	xhttp.onerror = function() {
		errClHandle(pageid,closeCSVImport,[pageid],getAttendees,[eventid,pageid,calids,eventtype,leaders,parents,scouts,formpost,rsvp,remindpost]);
	};
}



function setRSVP(eventid,pageid,formpost,remindpost) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			closeCSVImport(pageid);
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errClHandle(pageid,closeCSVImport,[pageid],setRSVP,[eventid,pageid,formpost,remindpost]);	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			if(remindpost != '') {
				saveRemind(eventid,pageid,formpost,remindpost);
				return;
			}
			saveEvent(formpost,eventid,pageid);			
			
		}
	};
	
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID='+eventid+'&Action=UpdateRSVP&RSVP=1';
	xhttp.open("GET", url, true);
	xhttp.send();
	xhttp.onerror = function() {
		errClHandle(pageid,closeCSVImport,[pageid],setRSVP,[eventid,pageid,formpost,remindpost]);
	};
	
}



function saveRemind(eventid,pageid,formpost,remindpost) {

	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			closeCSVImport(pageid);
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errClHandle(pageid,closeCSVImport,[pageid],saveRemind,[eventid,pageid,formpost,remindpost]);	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;			
			saveEvent(formpost,eventid,pageid);
		}
	};
	
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID='+eventid+'&Action=SaveReminders';
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send('PageID=Page'+pageid+remindpost);		
	xhttp.onerror = function() {
		errClHandle(pageid,closeCSVImport,[pageid],saveRemind,[eventid,pageid,formpost,remindpost]);
	};
}

function saveEvent(formpost,eventid,pageid) {
https://' + host + '.scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID=795727
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			closeCSVImport(pageid);
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errClHandle(pageid,closeCSVImport,[pageid],saveEvent,[formpost,eventid,pageid]);	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;		

//look for error			

			if(this.response.indexOf("Event saved!") != -1) {
				NewEvent(pageid);

			} else {
				fileObjs.csvdata.length=0;
				var err='';
				var errmsg=this.response.match(/showErrorPopup\(([^\)]+)/);
				if(errmsg != null) {
					 err=errmsg[1].replace(/<strong>|<\/strong>|<p>|<\/p>/g,'');
				}
				alert('Error importing event.  Scoutbook reports '  + err + '\n' + decodeURIComponent( getToken(formpost,'Name')));
				closeCSVImport(pageid);
				fileObjs.csvdata.length=0;				
			}
		}
	};
	
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID='+eventid;
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formpost);		
	xhttp.onerror = function() {
		errClHandle(pageid,closeCSVImport,[pageid],saveEvent,[formpost,eventid,pageid]);
	};
}
