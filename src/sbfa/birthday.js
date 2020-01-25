// Copyright © 1/28/2018 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.

function addRawAddBirthdayAjax(data) {
	if(data.match(/>Create New Event</) != null) {
		// insert the import
		var startfunc = data.indexOf('>Create New Event<');
		var startfunc = data.indexOf('</ul>',startfunc);
		if (startfunc != -1) {
			
			
			var newdata = '	<li class="bday" id="bdayDivider" data-theme="d" >';						
			newdata += '    <a href="#birthdayMenu" id="thisbday" >';			//data-rel="popup" data-transition="slideup"		
			newdata += '	<div id ="loadBirthday">';
//			newdata += '		<div style="display: inline-block; width: 28px; margin-right: 1px; ">';
//			newdata += '			<img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/quickentry48.png" alt="quick entry" title="Create Scout Birthday Events" style="position: absolute; left: 12px; top: 6px; width: 23px; " />'; //class="imageSmall"
//			newdata += '		</div>';
			newdata += '		Create Scout Birthday Events';
			newdata += '	</div>';
			newdata += '	</a>';
			newdata += '</li>';							
			//newdata = '	<li class="csvx" id="csvDividerx" data-theme="d" >';							
						
			
			data=data.slice(0,startfunc) + newdata + data.slice(startfunc);						

		}
	}
	return data;
}

function addRawBirthday(data,pageid) {
	
			if(data.match(/\$\('\.calendar-events', '#Page\d+'\)\.trigger\('create'\)/)== null) {
			return data;
		}
	
		var startfunc = data.indexOf('<div id="footer"');
		
		var newdata = '	<div data-role="popup" id="birthdayMenu" data-theme="d" data-history="false">';
		
		newdata +=			'<ul data-role="listview" data-inset="true" style="min-width: 300px;" data-theme="d" >';  //class="ui-icon-alt"
		newdata +=				'<li data-role="divider" data-theme="e">Choose Unit:</li>';					
		newdata +=	'			<li>';
	newdata += '						<fieldset data-role="controlgroup">';
	newdata += '							<select name="BirthdayUnitID" id="birthdayUnitID" data-theme="d" data-mini="true">';	
	newdata += '									<option value="">choose Unit...</option>';	
	newdata += '							</select>';	
	newdata += '						</fieldset>';		
		newdata +=	'			</li>';	
		newdata +=	'			<li><input type="submit" value="Create Birthday Events" data-theme="g" id="buttonBirthday" ><input type="submit" value="Remove Birthday Events" data-theme="a" id="buttonRemoveBirthday" ><input type="submit" value="Cancel" data-theme="g" id="buttonBirthdayCancel" ></li>';
		newdata +=			'</ul>';						

		
		newdata += '	</div>';				
		data = data.slice(0,startfunc) + newdata + '\n' + data.slice(startfunc);



		
// ##this function must be executed after the ajax call

	startfunc = data.match(/\$\('\.calendar-events', '#Page\d+'\)\.trigger\('create'\)/).index;
	var myfunc = '' + bdayscr;
	myfunc = myfunc.slice(21).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(escapeHTML(pageid))).replace('unitid',escapeHTML(unitID));
	data = data.slice(0,startfunc) + myfunc + '\n' + data.slice(startfunc);	
	

	startfunc = data.indexOf("function showProgress");
	var myfunc = '' + bdscrpt;
	myfunc = myfunc.slice(21).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(escapeHTML(pageid))).replace('unitid',escapeHTML(unitID));
	data = data.slice(0,startfunc) + myfunc + '\n' + data.slice(startfunc);	
	
	
	return data;
}

function bdayscr () {
	
	$('#thisbday','#PageX').click( function () {
		$('#faOverlay','#PageX').show();
		getCalUnits('#PageX');
		return false;
	});	
	
}

function bdscrpt () {
	var birthdays=[];
	$('#buttonBirthday','#PageX').click( function() {
		
		if($('#birthdayUnitID option:selected','#PageX').val()=='') {
			alert('Select a Unit');
			return false;
		}
		var unitID='';
		if($('#birthdayUnitID option:selected','#PageX').val().match(/\d+/)!= null) {
			unitID=$('#birthdayUnitID option:selected','#PageX').val().match(/\d+/)[0];
		}
		var txtunit=$('#birthdayUnitID option:selected','#PageX').text().trim();
		birthdays=[];
		$('#birthdayMenu','#PageX').popup('close');
		collectBirthdays(unitID,txtunit,birthdays,0,'','#PageX');
		
		
	});
	$('#buttonRemoveBirthday','#PageX').click( function() {
		if($('#birthdayUnitID option:selected','#PageX').val()=='') {
			alert('Select a Unit');
			return false;
		}
		var unitID='';
		if($('#birthdayUnitID option:selected','#PageX').val().match(/\d+/)!= null) {
			unitID=$('#birthdayUnitID option:selected','#PageX').val().match(/\d+/)[0];
		}
		var txtunit=$('#birthdayUnitID option:selected','#PageX').text().trim();
		birthdays=[];
		links=[];
		$('#birthdayMenu','#PageX').popup('close');
		getBDEventIDs('#PageX','del');
	});
	$('#buttonBirthdayCancel','#PageX').click( function() {
		$('#birthdayMenu','#PageX').popup('close');
		$('#faOverlay','#PageX').hide();
		return false;
	});	
}

function getCalUnits(pageid) {

	//check to see if the options are already populated
	if($('#birthdayUnitID option[value*="UnitID"]').length > 0) {

		$('#birthdayMenu',pageid).popup('open');
		return;
	}
	$.mobile.loading('show', { theme: 'a', text: 'Loading...', textonly: false });	


	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			$('#faOverlay',pageid).hide();
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(getCalUnits,pageid,'','','','','','');	//server side error - maybe next try will work
			return;
		}			
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			$('#calendarID option[value*="UnitID"]',this.response).each( function () {
				//console.log($(this).val(),$(this).text());
				$('#birthdayUnitID',pageid).append('<option value="'+$(this).val()+'" >'+$(this).text()+'</option>');	
			});
			$.mobile.loading('hide');
			$('#birthdayMenu',pageid).popup('open');
			return false;
		}
	};		

	
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp';
	xhttp.open("GET",url , true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
			errHandle(getCalUnits,pageid,'','','','','','');
	}		
}



var fileObjs=[];

function collectBirthdays(unitID,txtunit,birthdays,preset,presetval,pageid) {
	//in the roster
 //switch roster view to get DOB
// get options	
$.mobile.loading('show', { theme: 'a', text: 'Loading...', textonly: false });
    fileObjs=[];
	links=[];
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			$('#faOverlay',pageid).hide();
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(collectBirthdays,unitID,txtunit,birthdays,preset,presetval,pageid,'');	//server side error - maybe next try will work
			return;
		}		
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			
			var settings=$('#customizeScoutRosterForm', this.response).serialize();
			
			//&SortScoutRoster=LastName
			presetval='';
			if(settings.indexOf('SortScoutRoster=LastName') == -1 && preset==0) {
				presetval=settings; //'SortScoutRoster='+ settings.match(/SortScoutRoster=(Age|FirstName)/)[1])
				settings=settings.replace('SortScoutRoster=FirstName','SortScoutRoster=LastName').replace('SortScoutRoster=Age','SortScoutRoster=LastName');
			}
			if(settings.indexOf('ShowDOB') == -1 && preset==0) {
				settings=settings.replace('CustomizeScoutRoster','CustomizeScoutRoster&ShowDOB=1');
				if(presetval !='') {
					presetval=settings;
				}
			}
			
			if(presetval !='') {
				ShowDOBBefore(unitID,txtunit,birthdays,1,presetval,settings,pageid);
				return;				
			}
			
			var evObj={};
			
			var pos='';
			var poslist=[];
			$('li[data-scoutuserid]',this.response).each( function () {
				pos='';

				evObj={name:'',id:'',denpatrol:'',dob:'',scheduled:false,nextDate:''};	
				evObj.dob='';
				if($(this).text().match(/\d+\/\d+\/\d+/) != null ) {
					evObj.dob=$(this).text().match(/\d+\/\d+\/\d+/)[0];
				}
				
				pos= localDataFilter($('.positions',this).text().trim(),'','local')
				if(pos != '') {
					evObj.denpatrol=pos.match(/[^ ]+ Den .+|.+Patrol/);
					poslist=pos.split(',');

					if(evObj.denpatrol != null) {
						evObj.denpatrol=poslist.shift();
					}
					
						
					evObj.name=localDataFilter($('a[href*="account\.asp\?ScoutUserID"]',this).text().trim(),'','local');
					namesplit=evObj.name.split(',');
					if(namesplit.length>1) {
						evObj.name=namesplit[1].trim() + ' ' + namesplit[0].trim()[0]+'.';
					}
					
					evObj.id=$(this).attr('data-scoutuserid');

					birthdays.push(JSON.parse(JSON.stringify(evObj)));
				}

			});

			
			if(preset==1) {
				//change the settings back
					//settings=settings.replace('CustomizeScoutRoster&ShowDOB=1','CustomizeScoutRoster');
					settings=presetval;
					ShowDOBBefore(unitID,txtunit,birthdays,0,'',settings,pageid);			
			} else {
				//txtunit=$('a[id="goToUnit"]',this.response).text();
				scheduleBirthdays(birthdays,txtunit,pageid);
			}

		}
	}		
	
	
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID=' + unitID;

	xhttp.open("GET",url , true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		errHandle(collectBirthdays,unitID,txtunit,birthdays,preset,presetval,pageid,'');
	}		
}


function ShowDOBBefore(unitID,txtunit,birthdays,preset,presetval,settings,pageid) {
	var txtunit;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			$('#faOverlay',pageid).hide();
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle( ShowDOBBefore,unitID,txtunit,birthdays,preset,presetval,settings,pageid);	//server side error - maybe next try will work
			return;
		}		
	
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			if(preset==1) {
				collectBirthdays(unitID,txtunit,birthdays,1,presetval,pageid);
				//getScoutSubUnits(unitID,subUnitScouts,1)
			} else {
				txtunit=$('a[id="goToUnit"]',this.response).text().trim();
				scheduleBirthdays(birthdays,txtunit,pageid);
			}
		}
	};
	
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID=' + unitID;
	xhttp.open("POST",url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(settings);
			
	xhttp.onerror = function() {
		errHandle( ShowDOBBefore,unitID,txtunit,birthdays,preset,presetval,settings,pageid)
	};	
}

function scheduleBirthdays(birthdays,txtunit,pageid) {
// 
var dnow=new Date(Date.now());
var yr=dnow.getFullYear();
var nyr=yr+1;
var dob;
var evType='';


	if(txtunit.match(/Troop|Pack/) != null) {
		evType='Other';
	} else {
		evType='Open House';
	}
	
	fileObjs['csvdata'] =[];


	for(var i=0;i<birthdays.length;i++) {
		
		dob=birthdays[i].dob.match(/\d+\/\d+\//)[0] + yr;
		//was birthday before today this year?
		if(dateDiff(dob,dnow)<0) {
			//yes
			dob=birthdays[i].dob.match(/\d+\/\d+\//)[0] + nyr;
		}
		birthdays[i].nextDate=dob;
//	var cols = ["Calendar","EventType","Name","Location","StartDate","StartTime","EndDate","EndTime","RSVP","Permission","Leaders","Parents","Scouts","Description","Reminders","mapURL"];		
		fileObjs.csvdata.push([txtunit,evType,'Birthday: '+ birthdays[i].name,'',dob,'12:00 AM',dob,'12:00 AM','off','off','off','off','off','Scout Birthday','','']);
		
	}
	
   getBDEventIDs(pageid,'');
	
}





function getBDEventIDs(pageid,cb) {
	// This function is called t retrieve event list.  Matches each stDateFromArchive to find associated EventID
    var eventName;
    var lnkobj ={id: '', date: '',name:''};
	
	$.mobile.loading('show', { theme: 'a', text: 'Loading...', textonly: false });	
	
	//push this if older than now
	
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			$('#faOverlay',pageid).hide();
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle( getBDEventIDs,pageid,cb,'','','','','','');	//server side error - maybe next try will work
			return;
		}	
		if (this.readyState == 4 && this.status == 200) {
					resetLogoutTimer(url);
				servErrCnt=0;
			//populate eventArray
			var maxEvent=getmaxCalEvents(this.response);
			var lnk=this.responseXML.getElementsByTagName('a');
			
			var i;
			for (i = 0; i < lnk.length; i++) {
				hrf = lnk[i].href.match(/EventID=\d+/);
					
				if (hrf != null ) {

					lnkobj.id=hrf[0];
					lnkobj.date=lnk[i].getElementsByClassName('tinyText')[0].innerText;

					lnkobj.name=lnk[i].innerText.trim();  // event name is embedded
				   links.push(JSON.parse(JSON.stringify(lnkobj)));
					
				 }
			}

			
			
			if(maxEvent >24) {
				getMoreBDEvents(25,maxEvent,pageid,cb);
			} else {
				allBDEventsCaptured(pageid,cb);
			}
			
			
		}
	};
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/calendar/';
	xhttp.open("GET", url, true);
	xhttp.responseType="document";

	xhttp.send();
	xhttp.onerror = function() {
		errHandle( getBDEventIDs,pageid,cb,'','','','','','')
	};
		
}

function getMoreBDEvents(start,maxEvent,pageid,cb) {
    var eventName;
    var lnkobj ={id: '', date: '',name:''};
	

	
	//push this if older than now
	
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			$('#faOverlay',pageid).hide();
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(getMoreBDEvents,start,maxEvent,pageid,cb,'','','','');	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
				resetLogoutTimer(url);
				servErrCnt=0;
			//populate eventArray

			var lnk=this.responseXML.getElementsByTagName('a');
			
			var i;
			for (i = 0; i < lnk.length; i++) {
				hrf = lnk[i].href.match(/EventID=\d+/);
					
				if (hrf != null ) {

					lnkobj.id=hrf[0];
					lnkobj.date=lnk[i].getElementsByClassName('tinyText')[0].innerText;
					lnkobj.name=lnk[i].innerText.trim();  // event name is embedded
				   //links.push(lnkobj);		6/15/2017
				   links.push(JSON.parse(JSON.stringify(lnkobj)));
				}
			}
			//Get the current page data as it could be in the past
			
			
			if(maxEvent >start+24) {
				start+=25;
				getMoreBDEvents(start,maxEvent,pageid,cb);
			} else {
				allBDEventsCaptured(pageid,cb);
			}	
		}
	};
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/calendar/default.asp?Action=SeeMoreEvents&EventIndex=' + start;
	
	xhttp.open("POST", url, true);
	xhttp.responseType="document";

	xhttp.send();
	xhttp.onerror = function() {
		errHandle(getMoreBDEvents,start,maxEvent,pageid,cb,'','','','')
	};
}

function errHandle(cbfunc,cb1,cb2,cb3,cb4,cb5,cb6,cb7,cb8) {
		if (servErrCnt > maxErr) {
			 $.mobile.loading('hide');
			$('#faOverlay').hide();
			alert('Halted due to excessive Server errors');
			return;
		}
		servErrCnt++;
		setTimeout(function() {
			cbfunc(cb1,cb2,cb3,cb4,cb5,cb6,cb7,cb8);
		},1000);	//reset 	
}

//arg1 cb func on max error
//arg2 cb func lt max error
//args3...  args for cb func lt max err
function xerrClHandle() {
	var argumentsArray = Array.prototype.slice.apply(arguments);
	if (servErrCnt > maxErr) {
		 $.mobile.loading('hide');
		alert('Halted due to excessive Server errors');
		$('#faOverlay').hide();
		servErrCnt=0;
		if(argumentsArray[0] != '') {
			window[argumentsArray[0].name]();
		}
		return;
	}
	servErrCnt++;
	
	//setTimeout(function() {
	if(argumentsArray.length > 0) {
		window[argumentsArray[1].name].apply(null,argumentsArray.slice(1));
	}
	//},1000);	//reset 	
}

//  arguments (pageid,errfunc,[errfunc args],func,[func args]);
function errClHandle() {

	var argumentsArray = Array.prototype.slice.apply(arguments);

	var pageid=argumentsArray[0];


	if (servErrCnt > maxErr) {
		 $.mobile.loading('hide');
		alert('Halted due to excessive Server errors');
		$('#faOverlay',pageid).hide();
		servErrCnt=0;
		if(argumentsArray[1] != '') {
			window[argumentsArray[1].name].apply(null,argumentsArray.slice(2)[0]);
		}
		return;
	}
	servErrCnt++;
	
	if(argumentsArray.length > 4) {
		window[argumentsArray[3].name].apply(null,argumentsArray.slice(4)[0]);
	}
	
}


// arg0 pageid
//arg1 cb func on max error
// arg2 is array of args for func in arg1
//arg3 cb func lt max error
//args4...  args for cb func lt max err
function errGenHandle() {
	var argumentsArray = Array.prototype.slice.apply(arguments);
	if (servErrCnt > maxErr) {
		 $.mobile.loading('hide');
		alert('Halted due to excessive Server errors');
		
		servErrCnt=0;
		if(argumentsArray.length > 0) {
			$('#faOverlay',argumentsArray[0]).hide();
			if(argumentsArray[0] != '') {
				window[argumentsArray[1].name].apply(null,argumentsArray[1]);
			}
		}
		return;
	}
	servErrCnt++;
	
	//setTimeout(function() {
		window[argumentsArray[3].name].apply(null,argumentsArray[4]);
	//},1000);	//reset 	
}


function allBDEventsCaptured(pageid,cb) {
	var found=false;
	var name='';
	var d1;
	var d2;

	//debugger;
	if(cb=='') {
	for(i=0;i<links.length;i++){
		for(var j=0;j<fileObjs.csvdata.length;j++) {
			name=fileObjs.csvdata[j][2];
			
			if(links[i].name.indexOf(name) != -1) {
				//console.log(fileObjs.csvdata[j], 'previously scheduled');

				if(links[i].date.match(/[^,]+, \d\d\d\d/) != null) {
					d1=new Date(links[i].date.match(/[^,]+, \d\d\d\d/)[0]);

					d2=new Date(fileObjs.csvdata[j][4]);
					if(d1.getDate() == d2.getDate() && d1.getMonth()==d2.getMonth()) {
						// remove this filobjs row as ignore
						//console.log(fileObjs.csvdata[j], 'previously scheduled');
						fileObjs.csvdata.splice(j,1);
						break;
					}
				}
			}
		}
	}
	
	// check for current id in this list
	//console.log(links);
	
	if(fileObjs.csvdata.length==0) {
		 $.mobile.loading('hide');
	};
	
	
		NewEvent();
	} else {
		delBdayEvents(pageid);
	}
}

function delBdayEvents(pageid) {
	var links2=[];
// remove any links not meeting Birthday criteria	
	for(i=0;i<links.length;i++){
			//if(links[i].name.indexOf($('#birthdayUnitID option:selected',pageid).text() + ' - Birthday:') != -1) 
			if(links[i].name.indexOf(' - Birthday:') != -1) {
				links2.push(links.slice(i,i+1)[0]);
			}
	}
	links=[];
	for(i=0;i<links2.length;i++){
		links.push(links2.slice(i,i+1)[0]);
	}
		adeleteNextEvent(pageid);	
}



function adeleteNextEvent(pageid) {
	
	if(links.length==0) {
		$('#birthdayMenu',pageid).popup('close');
		$('#faOverlay',pageid).hide();
		 $.mobile.loading('hide');
		return;
	}
	
	var cEventID=links.shift().id;
	

	var xhttp = new XMLHttpRequest();
	formPost = '';
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			$('#faOverlay',pageid).hide();
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(adeleteNextEvent,pageid,'','','','','','');	//server side error - maybe next try will work
			return;
		}		
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;

			// keep going un til none left
			
			 adeleteNextEvent();
		}
	};

	var url='https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?' + cEventID +"&Action=DeleteEvent";
	xhttp.open("GET", url, true);
	xhttp.send();
	xhttp.onerror = function() {
		errHandle(adeleteNextEvent,pageid,'','','','','','');	//server side error - maybe next try will work
	};
}