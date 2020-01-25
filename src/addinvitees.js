// Copyright © 10/4/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.



/*
This function adds scripting and html elements to the calendar page to support
  - Adding a new invitee(s) to multiple events

						  
*/
//addinvitees
function addInviteButton(data,pageid) {

// add before the colorLegend  <div class="colorLegend">
//addscoutorange48.png
	var startfunc = data.search(/[^>]*<div[ ]+class[^=]*=[^"]*"colorLegend"/);
	var addInv = '<div style="float: right; text-align: right; "><a data-role="button" data-theme="d" data-inline="true" data-mini="true" href="#" id="addInvitees"><div style="margin-left: 30px; position: relative; "><img src="https://d3hdyt7ugiz6do.cloudfront.net/mobile/images/icons/forumsorange48.png" style="position: absolute; width: 24px; left: -30px; top: -4px; " />Add Invitees</div></a></div>';
	var newdata = data.slice(0,startfunc) + addInv + '\n'+ data.slice(startfunc);

	cPage=escapeHTML(pageid);
			
			
	startfunc = newdata.indexOf("$('img.customizeIcon',");	
		
	
	var myfunc = '' + dummyfu;
	myfunc = myfunc.slice(20).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(pageid));
	data = newdata.slice(0,startfunc) + myfunc + '\n'+ newdata.slice(startfunc);
	
 
	//startfunc = data.indexOf('<select name="CalendarID" id="calendarID" data-role="none" multiple="multiple">');
	startfunc=data.search(/<select[ ]+name[^=]*=[^"]*"CalendarID"[ ]+id[^=]*=[^"]*"calendarID"/);
    var listanchor ='<select name="EventSelectID" id="eventselectID" multiple="multiple" data-role="none"></select><select name="InviteSelectID" id="inviteselectID" multiple="multiple" data-role="none"><optgroup label="Leaders"></optgroup><optgroup label="Parents"></optgroup><optgroup label="Scouts"></optgroup></select>';	
	
	newdata = data.slice(0,startfunc) + listanchor + '\n'+ data.slice(startfunc);
	data=newdata;
 	
	
	
	//CalendarBID
	//multiple="multiple">
	
	startfunc = data.search(/<select[ ]+name[^=]*=[^"]*"CalendarID"/);
    var endfunc = data.indexOf('</select>',startfunc);
	//var endfunc = data.search('<[^/]*/select[^>]*>',startfunc);
	var selcopy = data.slice(startfunc,endfunc) + '</select>';
	
	selcopy = selcopy.replace(/alendarID/g,'alendarBID');
	selcopy = selcopy.replace('multiple="multiple"','');
	
	data =data.slice(0,startfunc) + selcopy + data.slice(startfunc);
	
return data;
}

/*
This is a dummy function; it is a conveniently easy way to define script contents
to be added to a page. THis function's contents will be used.

*/
//addinvitees
function dummyfu() {

			
			$('#addInvitees','#PageX').click(function () {
					// clicking mobiscroll freezes background
					$('#faOverlay','#PageX').show();
					$('#calendarBID', '#PageX').mobiscroll('show');
					return false;

			});			
			
						
			

	
			$('#eventselectID','#PageX').mobiscroll().select({
				theme: 'scoutbook',
				display: 'bubble',
				//fontsize: '12px',
				counter: true,
				label: 'Select all of the events you want to add a new Invitee to',
				showLabel: true,
				animate: 'flip',
				buttons: ['set', 'cancel', {
					text: 'Select All', handler: function (ev, inst) {
						//debugger;
						var wheelValues = inst.getValue(true, true), // Get the current wheel values with group
						value = wheelValues[0], // Current wheel value is second
						currValues = inst.getValues(); // Get the current multiple selection
						$('#eventselectID', '#PageX').find('option').each(function () {
							currValues.push($(this).attr('value'));
						});
						currValues.unshift(value);
						inst.setValue(currValues, false, 0, true);
					}
				}],
				mode: 'mixed',
				placeholder: 'choose one or more events',
				anchor: $('#addInvitees', '#PageX'),
				onSelect: function() {
					$.mobile.loading('show', { theme: 'a', text: 'updating...', textonly: false });
					setTimeout(function () {saveInviteeEvents('#PageX');}, 1000);
					return false;
				},
				onCancel: function() {
					$.mobile.loading('show', { theme: 'a', text: 'restoring selection...', textonly: false });
					setTimeout(function () {resetCalendarIDs('#PageX');}, 1000);
					return false;
				},
				rows: 7,
				showInput: false,
				onBeforeShow: function(inst) {
					// do some logic here to see if we need to cancel the scroll

				}
			});



		    $('#inviteselectID', '#PageX').mobiscroll().select({
				theme: 'scoutbook',
				display: 'bottom',
				mode: 'mixed',
				showInput: false,
				counter: false,
				group: true,
				buttons: ['set', 'clear', 'cancel', {
					text: 'Select All', handler: function (ev, inst) {
						var wheelValues = inst.getValue(true, true), // Get the current wheel values with group
						groupIndex = wheelValues[0], // Group index is first
						value = wheelValues[1], // Current wheel value is second
						currValues = inst.getValues(); // Get the current multiple selection
						$('#inviteselectID', '#PageX').find('optgroup').eq(groupIndex).find('option').each(function () {
							currValues.push($(this).attr('value'));
						});
						currValues.unshift(value);
						inst.setValue(currValues, false, 0, true);
					}
				}],
				rows: 11,
				groupLabel: 'Attendees',
				onSelect: function () {
					handleInviteAdd('#PageX');
					return false;
				},
				onCancel: function() {
					$('#inviteselectID', '#PageX').mobiscroll('hide');
					$.mobile.loading('show', { theme: 'a', text: 'restoring selection...', textonly: false });
					setTimeout(function () {resetCalendarIDs('#PageX');}, 1000);
					return false;
				}
		    });

		    $('#calendarBID', '#PageX').mobiscroll().select({
				theme: 'scoutbook',
				display: 'bubble',
				counter: true,
				animate: 'flip',
				buttons: ['set', 'cancel'],
				mode: 'mixed',
				placeholder: 'choose one calendars',
				anchor: $('img.customizeIcon', '#PageX'),
				onSelect: function() {
					$.mobile.loading('show', { theme: 'a', text: 'updating...', textonly: false });
					setTimeout(function () {popEventList('#PageX');}, 1000);
					return false;
				},
				onCancel: function() {
					$('#faOverlay','#PageX').hide();
				},
				rows: 7,
				showInput: false,
				onBeforeShow: function(inst) {
					// do some logic here to see if we need to cancel the scroller
	
				}
			});
					
}


			
function popEventList(pageid) {

	$.mobile.loading('show', { theme: 'a', text: 'updating...', textonly: false });

	// save current settings if not already saved
	if (calLst.length == 0) {
			getCalendarIDs(pageid);
			//console.log('saved calendar setting ' + calLst);
	}
	

	var inst = $('#calendarBID',pageid).mobiscroll('getInst');		//gets the instanceof the mobiscroll object
	var values = inst.values;				//gets the values selecteed in the mobiscroll object
	
	//alert('Selected ' + values);
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			$('#faOverlay',pageid).hide();
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle( popEventList,pageid,'','','','','','');	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
					

			//tells the server to change the page defaults
			//now get the data for the new setting
			getCalPage(pageid);
		}
	};
	
	var formdata ='Action=SetCalendars&CalendarID=' + values[0];

	//https://host.scoutbook.com/mobile/dashboard/calendar/default.asp
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/calendar/default.asp';
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formdata);
	xhttp.onerror = function() {
		errHandle( popEventList,pageid,'','','','','','')
	};
	
}

/*
  THis function gets a calendar page and saves the event list in it to an array	
  After getting a mobiscroll popup filles with the events, it pops it up for the user to choose events

*/
function getCalPage(pageid) {
	var lnk;
	var txt;
	var evname;
	var ttxt;
	var eventid;
	var evObj = { name : '', id : ''};
	evLst.length=0;
	eventArr.length=0;
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			$('#faOverlay',pageid).hide();
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(getCalPage,pageid,'','','','','','');	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
//67
			var maxEvent=getmaxCalEvents(this.response);

			$('li[style="overflow: hidden; "]',this.response).each(function () { 
				lnk = $(this).find('a').attr("href");
				if(lnk.match(/EventID=(\d+)/) != null) {
					evObj.id =lnk.match(/EventID=(\d+)/)[1];
				}
				txt =$(this).text().split('\n');
				evObj.name='';
				for (i=0;i<txt.length;i++) {
					ttxt = txt[i].trim();
					if (ttxt != "") {
						//console.log(i,evObj.name + "##" + ttxt);
					  if(evObj.name =='') {
						//try to shorten for mobile.
						var mres=ttxt.match(/([^ ]+) ([^ ]+) - (.+)/);
						if(mres != null) {
							evObj.name=mres[1][0]+mres[2]+':'+mres[3];
						} else {
							evObj.name = ttxt;
						}
					  } else {
						evObj.name +=  " " + ttxt;
					  }
					}
				}
				//console.log('pushing ' + evObj.id + ' ' + evObj.name);
				eventArr.push(JSON.parse(JSON.stringify(evObj)));
			});
			
			
			if(maxEvent >24) {
				getMoreEvents2(25,maxEvent,pageid);
			} else {
				allEventsCaptured2(pageid);
			}
			
			
			// pop up for the user to select the events
			
			/*  9/2/17
			addEvToList(pageid);
			
			$('#eventselectID', pageid).mobiscroll('show');
			*/
		}
	};
	
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/calendar/';
	xhttp.open("GET", url, true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		if (servErrCnt > maxErr) {
			 evLst.length=0;  // kill the remaining dates
		}
		errHandle(getCalPage,pageid,'','','','','','')
	};
	
}

function getMoreEvents2(start,maxEvent,pageid) {
	var lnk;
	var txt;
	var evname;
	var ttxt;
	var eventid;
	var evObj = { name : '', id : ''};

	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			$('#faOverlay',pageid).hide();
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(getMoreEvents2,start,maxEvent,pageid,'','','','');	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			$('li[style="overflow: hidden; "]',this.response).each(function () { 
				lnk = $(this).find('a').attr("href");
				if(lnk.match(/EventID=(\d+)/)!= null) {
					evObj.id =lnk.match(/EventID=(\d+)/)[1];
				}
				txt =$(this).text().split('\n');
				evObj.name='';
				for (i=0;i<txt.length;i++) {
					ttxt = txt[i].trim();
					if (ttxt != "") {
						//console.log(i,evObj.name + "##" + ttxt);
					  if(evObj.name =='') {
						//try to shorten for mobile.
						var mres=ttxt.match(/([^ ]+) ([^ ]+) - (.+)/);
						if(mres != null) {
							evObj.name=mres[1][0]+mres[2]+':'+mres[3];
						} else {
							evObj.name = ttxt;
						}
					  } else {
						evObj.name +=  " " + ttxt;
					  }
					}
				}
				//console.log('pushing ' + evObj.id + ' ' + evObj.name);
				eventArr.push(JSON.parse(JSON.stringify(evObj)));
			});
					
					
			if(maxEvent >start+24) {
				start+=25;
				getMoreEvents2(start,maxEvent,pageid);
			} else {
				allEventsCaptured2(pageid);
			}						
				
		}
	};
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/calendar/default.asp?Action=SeeMoreEvents&EventIndex=' + start;
	xhttp.open("POST", url, true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		if (servErrCnt > maxErr) {
			 evLst.length=0;  // kill the remaining dates
		}
		errHandle(getMoreEvents2,start,maxEvent,pageid,'','','','')
	};
}
function allEventsCaptured2(pageid) {
			// pop up for the user to select the events
			addEvToList(pageid);
			
			if($('#eventselectID option', pageid).length==0) {
				alert('The calendar selected has no events!');
				$.mobile.loading('show', { theme: 'a', text: 'restoring selection...', textonly: false });
				setTimeout(function () {resetCalendarIDs(pageid);}, 1000);
				return false;				
			}
			
			$('#eventselectID', pageid).mobiscroll('show');
}


/*
This function takes an array of events an populates a mobiscroll popup

*/
function addEvToList(pageid) {
  // Don't add if already populated
  if ($('#eventselectID',pageid).children().length ==0 ) {
	for (var i=0;i<eventArr.length;i++) {
		$('#eventselectID',pageid).append('<option value="' + escapeHTML(eventArr[i].id) + '"  data-ilist="1" >' + escapeHTML(eventArr[i].name) + '</option>');
	}
  }
  $.mobile.loading('hide');
}			




/* 

	This function is called when the user selects SET from the list of events popup
	starts preparing to populate an invitee list to pop up
	
	
*/

//addinvitee		
function saveInviteeEvents(pageid) {
	//debugger;
	//alert('select Invitees');
    $.mobile.loading('show', { theme: 'a', text: 'updating...', textonly: false });

	var inst = $('#eventselectID',pageid).mobiscroll('getInst');		//gets the instanceof teh mobiscroll object
	var values = inst.getValues('eventselectID');				//gets the values selecteed in the mobiscroll object
	if (values.length > 0) {
	    for (var i=0;i < values.length ;i++) {
			//console.log('selected ' + values[i]);				// each selected value
			if (evLst.length == 0) {
				if(parseInt(values[i]) > "100") {
					evLst.push(values[i]);
				}				// Save 1st event twice.  1st time will be used to get attendee list
			} 
				if(parseInt(values[i]) > "100") {
					evLst.push(values[i]);
				}
			
		}
		//Use first event to build popup inivitee 
		//buildInviteAdd();
		getEditEventPg(pageid);
	} else {
		alert('You must select an event to add invitees');
		// show events again
		$.mobile.loading('hide');
		$('#eventselectID', pageid).mobiscroll('show');
	}



}	


//addinvitees
// Function looks at the current but not visible page calendar selector that is only used programmatically
function getCalendarBID(pageid) {
	var inst = $('#calendarBID',pageid).mobiscroll('getInst');		//gets the instanceof teh mobiscroll object
	var values = inst.values;				//gets the values selecteed in the mobiscroll object
	return values[0];
};
//addinvitees
// Function looks at the current and visible page and saves list of selected calendars into a public array
function getCalendarIDs(pageid) {
	var inst = $('#calendarID',pageid).mobiscroll('getInst');		//gets the instanceof teh mobiscroll object
	var values = inst.getValues();				//gets the values selecteed in the mobiscroll object
	if (values.length > 0) {
	    for (var i=0;i<values.length;i++) {
			//console.log('selected ' + values[i]);				// each selected value
			calLst.push(values[i]);							// Save 1st event twice.  1st time will be used to get attendee list
		}
	}	
}
//addinvitees
//This function uses the public array of calendar ids saved earlier to reset the visible calendar view
function resetCalendarIDs(pageid) {
	//Sets calendarIDlist
	//if (calLst.length > 1) {
	
		var inst = $('#calendarID',pageid).mobiscroll('getInst');		//gets the instanceof teh mobiscroll object
		inst.setValue(calLst,true,0,false);				//gets the values selecteed in the mobiscroll object
		//now need to update calendar based on the list
	
		submitCalendarForm();		// will hide any mobile loading
	//}
	//$.mobile.loading('hide');
	calLst.length=0;
	evLst.length=0;
}


/*--------------------------------------------------------------------------------------------------
	The following functions support adding individuals to scheduled events

*/

/*
   Used by the add invite event function from the calendar page
this function is called to retrieve the editevent page for each event selected


*/

function getEditEvent(pageid) {
	
	// what if no invitees selected
    $.mobile.loading('show', { theme: 'a', text: 'updating...', textonly: false });       
	var eventid=evLst.shift();		
	
	var calPage= {unitid:'',editEventPageIdNumOnly:'',eventid:'',users:[],reminders:[],formData:''};
	calPage.eventid=eventid;
	
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			$('#faOverlay',pageid).hide();
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(getEditEvent,pageid,'','','','','','');	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;


		
			var thiseventid='EventID='+eventid;
			


			//var thiseventpage =
			//if (buildInviteAdd(thiseventid) == false) {			// build invitee list once,  called on first event in list
				var calIDlst = $('#calendarID',this.response).val();
				
				var editEventPageIdNumOnly= $('div[data-role="page"]',this.response).attr('id').match(/\d+/)[0];
					
				//var eventtype=$('#eventType option:selected',this.response).val();
				//$('#eventType', '#Page64174').append('<option  selected="selected"  value="Other">Other</option>');
				// have to find the value in a script
				
				var eventtype='none';
				for(var x=0;x<this.response.scripts.length;x++) {
					if(this.response.scripts[x].text.match(/\$\('#eventType', '#Page\d+'\).append\('<option  selected="selected"  value="([^"]+)/) !=null) {
						eventtype=this.response.scripts[x].text.match(/\$\('#eventType', '#Page\d+'\).append\('<option  selected="selected"  value="([^"]+)/)[1];
						calPage['evType']=eventtype;
						break;
					}
				}
				
			
			
			calPage.formData = $('#editEventForm', this.response).serialize();  //contains all but planned adv, invitees, reminders
			//maybe here get the additional pages for the calendar to populate them

			calPage.editEventPageIdNumOnly= $('div[data-role="page"]',this.response).attr('id').match(/\d+/)[0];
			calPage.unitid= $('#calendarID option:selected',this.response).val();
			
			calPage.formData =calPage.formData.replace(/EventType=/,'EventType='+encodeURIComponent(eventtype));
			/*
			$('#reminders option:selected',this.response).each( function () {
				calPage.formData += '&Reminders=' +$(this).val();
			});
			$('#advancement option:selected',this.response).each( function () {
				calPage.formData += '&Advancement=' +$(this).val();
			});
			*/

			getEditEventPgUAG(calPage,pageid );		
			
					// calPage.unitid=calIDlst
		//was 		getEventInvite(thiseventid,calIDlst,eventtype,editEventPageIdNumOnly);
		// will eventually call		postModifiedEvent(calPage);
				
			//}
		}
	};
	
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID='+eventid;
	xhttp.open("GET",url, true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		//window.console &&console.log("error getting getEditEvent " + xhttp.status);
		// On error, bail.  Set stuff to kill processing
		

		 
		if (servErrCnt > maxErr) {
			$.mobile.loading('show', { theme: 'a', text: 'restoring selection...', textonly: false });
			evLst.length=0;  // kill the remaining dates
			 setTimeout(function () {resetCalendarIDs(pageid);},200);
			return;
		}
		servErrCnt++;
		setTimeout(function() {
			getEditEvent(pageid);
		},1000);	//reset 		 
		 
	};
}


function postModifiedEvent (calPage,pageid) {
		

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			$('#faOverlay',pageid).hide();
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle( postModifiedEvent,calPage,pageid,'','','','','');	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;



			// now need to save the event.  SB change 7/29/19
		

			
			if (evLst.length == 0 ) {
			  //alert('DONE TODO Cleanup')
			  $.mobile.loading('show', { theme: 'a', text: 'restoring selection...', textonly: false });
			   setTimeout(function () {resetCalendarIDs(pageid);},200);	
			} else {
			   setTimeout(function(){ getEditEvent(pageid); }, 200);		// Next event 
			}
		}
	};
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID='+ calPage.eventid;
	xhttp.open("POST",url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(calPage.formData);
	
	xhttp.onerror =function() {
		//window.console &&console.log("request error in postModifiedInvite" + xhttp.status);


		if (servErrCnt > maxErr) {
			evLst.length=0;  // kill the remaining dates
			$.mobile.loading('show', { theme: 'a', text: 'restoring selection...', textonly: false });
			 setTimeout(function () {resetCalendarIDs(pageid);},200);
			return;
		}
		servErrCnt++;
		setTimeout(function() {
			postModifiedEvent (calpage,pageid);
		},1000);	//reset 
	 
	};	
}

	
function getEditEventPg(pageid) {
	

	var	editEventPageIdNumOnly='';
	
	// what if no invitees selected
    $.mobile.loading('show', { theme: 'a', text: 'updating...', textonly: false });       
	var  eventid=evLst[0];		


	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			$('#faOverlay',pageid).hide();
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(getEditEventPg,pageid,'','','','','','');	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			editEventPageIdNumOnly= $('div[data-role="page"]',this.response).attr('id').match(/\d+/)[0];
			buildInviteAdd(editEventPageIdNumOnly,pageid);
			


		}
	};
	
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID='+eventid;
	xhttp.open("GET",url, true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		//window.console &&console.log("error getting getEditEvent " + xhttp.status);
		// On error, bail.  Set stuff to kill processing
		
		if (servErrCnt > maxErr) {
			$.mobile.loading('show', { theme: 'a', text: 'restoring selection...', textonly: false });
			evLst.length=0;  // kill the remaining dates
			 setTimeout(function () {resetCalendarIDs(pageid);},200);
			return;
		}
		servErrCnt++;
		setTimeout(function() {
			getEditEventPg(pageid);
		},1000);	//reset 		 
		 
	};
}


function getEditEventPgUAG(calPage,pageid) {
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			$('#faOverlay',pageid).hide();
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(getEditEventPgUAG,calPage,pageid,'','','','','');	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;

			var respText=this.responseText.split('\n')
			var respFilt='';
			for(var i=0;i<respText.length;i++) {
				if(respText[i].match(/selected="selected"/) != null) {
					if(respText[i].indexOf(">ACCOUNT, ") == -1) {
						if(respText[i].indexOf(">SCOUT, Removed") == -1) {
							//calPage.users.push(respText[i].match(/value="([^U]+UserID[0-9]+)/)[1]);
							//calPage.formData += '&Attendees=' +respText[i].match(/value="([^U]+UserID[0-9]+)/)[1];
							respFilt += respText[i] + '\n'; 
						}
					}
				}
			}		

			var leaderLst=rematchx('selected\\"  value=\\"(LeaderUserID\\d+)','g',respFilt,1);
			var parentLst=rematchx('selected\\"  value=\\"(ParentUserID\\d+)','g',respFilt,1);
			var scoutLst=rematchx('selected\\"  value=\\"(ScoutUserID\\d+)','g',respFilt,1);
			var inviteLst = getInviteIDs(pageid);
			

			for (var i=0;i<leaderLst.length;i++) {
				calPage.formData += "&Attendees=" + leaderLst[i];
			}
			for (var i=0;i<inviteLst.length;i++) {
				if (inviteLst[i].match(/Leader/) != null) {
					calPage.formData += "&Attendees=" + inviteLst[i];
				}		
			}	
			for (var i=0;i<parentLst.length;i++) {
				calPage.formData += "&Attendees=" + parentLst[i];
			}
			for (var i=0;i<inviteLst.length;i++) {
				if (inviteLst[i].match(/Parent/) != null) {
					calPage.formData += "&Attendees=" + inviteLst[i];
				}		
			}		
			for (var i=0;i<scoutLst.length;i++) {
				calPage.formData += "&Attendees=" + scoutLst[i];
			}
			for (var i=0;i<inviteLst.length;i++) {
				if (inviteLst[i].match(/Scout/) != null) {
					calPage.formData += "&Attendees=" + inviteLst[i];
				}		
			}	



			
			postModifiedEvent(calPage,pageid);
							

		}
	};
	
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID='+calPage.eventid+'&PageID='+calPage.editEventPageIdNumOnly+'&Action=UpdateAttendeeGroupOptions&CalendarID='+calPage.unitid+'&EventType=none';
	xhttp.open("GET",url, true);
	xhttp.responseType="text";
	xhttp.send();
	xhttp.onerror = function() {
		//window.console &&console.log("error getting getEditEvent " + xhttp.status);
		// On error, bail.  Set stuff to kill processing
		

		 
		if (servErrCnt > maxErr) {
			$.mobile.loading('show', { theme: 'a', text: 'restoring selection...', textonly: false });
			evLst.length=0;  // kill the remaining dates
			 setTimeout(function () {resetCalendarIDs(pageid);},200);
			return;
		}
		servErrCnt++;
		setTimeout(function() {
			getEditEventPgUAG(calPage,pageid);
		},1000);	//reset 		 
		 
	};
}


function postUA(calPage,pageid) {
	calPage['evType']=$('#eventType',calPage).val();

	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			$('#faOverlay',pageid).hide();
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(postUA,calPage,pageid,'','','','','');	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			

			
			postUR(calPage,pageid);
		}
		
	};
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID='+calPage.eventid+'&Action=UpdateAttendeesLI&CalendarID='+calPage.unitid+'&EventType=' + encodeURIComponent(calPage.evType);
	xhttp.open("POST", url, true);
	xhttp.responseType="text";

	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formdata);	
	
	
	
	xhttp.onerror = function() {
		if (servErrCnt > maxErr) {
			$.mobile.loading('show', { theme: 'a', text: 'restoring selection...', textonly: false });
			evLst.length=0;  // kill the remaining dates
			 setTimeout(function () {resetCalendarIDs(pageid);},200);
			return;
		}
		errHandle(postUA,calPage,pageid,'','','','','');
	};	
}

function postUR(calPage,pageid) {
	var formdata='';//'EventID='+calpage.eventid+'&Action=UpdateRemindersLI&PageID='+calPage.editEventPageIdNumOnly;
//https://qa.scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID=1755176&Action=UpdateAttendeesLI&CalendarID=UnitID31097&EventType=Committee%20Meeting
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			$('#faOverlay',pageid).hide();
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(postUR,calPage,pageid,'','','','','');	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			
			var respText=this.responseText.split('\n')
			
			for(var i=0;i<respText.length;i++) {
				if(respText[i].match(/append/) != null) {

					if(respText[i].match(/([0-9]+) hour/) != null) {
						calPage.reminders.push(respText[i].match(/([0-9]+) hour/)[1]);
						calPage.formData += '&Reminders=' + respText[i].match(/([0-9]+) hour/)[1];
					}
					if(respText[i].match(/([0-9]+) day/) != null) {
						calPage.reminders.push(parseInt(respText[i].match(/([0-9]+) day/)[1])*24);
						calPage.formData += '&Reminders=' + (parseInt(respText[i].match(/([0-9]+) day/)[1])*24);
					}
				}
			}		
		
			postAV(calPage,pageid);
		
		
		}
		
	};
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID='+calPage.eventid+'&Action=UpdateRemindersLI&PageID='+calPage.editEventPageIdNumOnly ;
	xhttp.open("POST", url, true);
	xhttp.responseType="text";
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formdata);
	xhttp.onerror = function() {
		if (servErrCnt > maxErr) {
			$.mobile.loading('show', { theme: 'a', text: 'restoring selection...', textonly: false });
			evLst.length=0;  // kill the remaining dates
			 setTimeout(function () {resetCalendarIDs(pageid);},200);
			return;
		}
		errHandle(postUR,calPage,pageid,'','','','','');
	};	
}

function postAV(calPage,pageid) {
	var moved=false;
//https://qa.scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID=1755176&Action=UpdateAttendeesLI&CalendarID=UnitID31097&EventType=Committee%20Meeting
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 302) {
			moved=true;
		}
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			$('#faOverlay',pageid).hide();
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(postAV,calPage,pageid,'','','','','');	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			
			//var respText=this.responseText.replace(/'#[0-9]+'/g,'calPage');
			//eval(respText);  //does this update the response page or something else?		
		
			if(moved ==false) {
				//process the response
				var respText=this.response.split('\n');
				var advLst=rematchx('data-id=\\"([^d]+d+)\\"','g',this.response,1);
				for (var i=0;i<advLst.length;i++) {
					calPage.formData+= '&' + advLst[i];
				}
			}
					// calPage.unitid=calIDlst
		//was 		getEventInvite(thiseventid,calIDlst,eventtype,editEventPageIdNumOnly);
			postModifiedEvent(calPage,pageid);
		
		}
		
	};
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID='+calPage.eventid+'&Action=UpdateAdvancementLI';
	xhttp.open("POST", url, true);
	xhttp.responseType="text";
	xhttp.send('PageID='+calPage.editEventPageIdNumOnly);
	xhttp.onerror = function() {
		if (servErrCnt > maxErr) {
			$.mobile.loading('show', { theme: 'a', text: 'restoring selection...', textonly: false });
			evLst.length=0;  // kill the remaining dates
			 setTimeout(function () {resetCalendarIDs(pageid);},200);
			return;
		}
		errHandle(postAV,calPage,pageid,'','','','','');
	};	
}
/*
This func checks to see if an invitee list has been constructed

If it has, simply returns false (list already built)


This function GETs an editevent Action=UpdateAttendeeGroupOptions
for the currently selected Calendar ID

The result contains all the leader, scout, and parent names that may be presented to the user to select from
THe result is modified for this page, inserted into the page, then the popup displayed for the user to select

*/

//function buildInviteAdd2(editEventPageIdNumOnly,eventtype) 
function buildInviteAdd(editEventPageIdNumOnly,pageid) {
//var editEventPageIdNumOnly=0;
var eventtype='none';

	var eventid=evLst.shift();	

	if ($('#inviteselectID optgroup[label="Leaders"]',pageid).children().length + $('#inviteselectID optgroup[label="Parents"]',pageid).children().length + $('#inviteselectID optgroup[label="Scouts"]',pageid).children().length !=0) {
		//  Already built a list
		//alert('Error...');
		return false;
	}
	
	
 	var calID = getCalendarBID(pageid);
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			$('#faOverlay',pageid).hide();
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(buildInviteAdd,editEventPageIdNumOnly,pageid,'','','','','');	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			// response is javascript
			//Now we build and display the list. 
			// Remove references to selected
			var resp = this.responseText.replace(/selected=\"selected\"/g,'');
			resp = resp.replace(/#attendees/g,'#inviteselectID');
			resp=resp.replace(/#Page\d+/g,'#Page' +escapeHTML(cPage));
			//also replace the PageID
	
			var lin=resp.split('\n');
			var res;
			for(var i=0;i<lin.length;i++) {
				//console.log('lin['+i+']='+lin[i]);
				           //match(/\$\('([^']+)[, ']+([^']+)['\)\. ]+append\('([^']+)/)
				res=lin[i].match(/\$\('([^']+)[, ']+([^']+)['\)\. ]+append\('<([^<]+)/);
				if(res != undefined) {
					//console.log('append match='+res.length);
					if( res.length == 4) {
						//console.log('append.match $('+lin[i][1] +','+lin[i][2]+').append('+lin[i][3]+');');
						//res[3] looks like '<option value="LeaderuserID1234">lastname, Firstname</option>'.match(/\"([^\"]+)/)
						var val = res[3].match(/\"([^\"]+)/);
						var name=res[3].match(/>([^<]+)/);
						
						if(name == null) {
							$.mobile.loading('hide');
							alert('Error: invitee name list not found');  //page not found etc.  This is unrecoverable
							$('#faOverlay',pageid).hide();
							return;
						} else {
						
							if(name[1].slice(0,8) != "ACCOUNT,") {
								if(name[1] != "SCOUT, Removed") {
									var escname=name[1].replace(/\\/g,'');
									//debugger;
									$(res[1],res[2]).append('<option value="'+escapeHTML(val[1])+'">'+escapeHTML(escname)+'</option>');
								}
							}
						}
						//$(res[1],res[2]).append(res[3]);
					}
				}
				
				res=lin[i].match(/\$\('([^']+)[, ']+([^']+)['\)\. ]+remove/);
					if(res != null) {
					//console.log('remove match='+res.length);
					if(res.length == 3){
						$(res[1],res[2]).remove();
					}
				}
				
			}

			//was an eval ( resp );					// Builds the list

			
			$.mobile.loading('hide');
			$('#inviteselectID','#Page' + cPage).mobiscroll('show');
		}
	};
	
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID='+eventid + '&PageID=Page'+editEventPageIdNumOnly + '&Action=UpdateAttendeeGroupOptions&CalendarID=' + calID + '&EventType=' + eventtype;
	xhttp.open("GET", url, true);
	//xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		//window.console &&console.log("error getting " + xhttp.status);
		// On error, bail.  Set stuff to kill processing


		if (servErrCnt > maxErr) {
			evLst.length=0;  // kill the remaining dates
			$.mobile.loading('show', { theme: 'a', text: 'restoring selection...', textonly: false });
			 setTimeout(function () {resetCalendarIDs(pageid);},200);
			return;
		}
		servErrCnt++;
		setTimeout(function() {
			buildInviteAdd(editEventPageIdNumOnly,pageid);
		},1000);	//reset 		 
	};
}

/*
THis func called when user selects additional invitees from the popup list. 
If users are selected, it will carry on 

*/
function handleInviteAdd(pageid) {
	
	if (testInviteIDs(pageid) == false) {
		//alert('No invitees selected');
		// TODO if quitting restore calendar
		//return;
	}
	//alert('Finsihed selecting invitees');
	$('#inviteselectID',pageid).mobiscroll('hide');
	getEditEvent(pageid);
}

/* This function called after a GET EditEvent
   
   
   It uses the Calendar IDs from the editEvent page response (responseText)
   and performs a GET editEvent with Action=UpdateAttendeeGroupOptions
   
   The result of this GET has the invitees for the current event.
   With that information, it calls postModifiedInvite to update the event with additoinal invitees (See that function)
   
*/
function getEventInvite(eventid,calIDlst,eventtype,editEventPageIdNumOnly,pageid) {


	var calstr='';
	for (i=0;i<calIDlst.length;i++) {
		calstr=calstr + 'CalendarID=' + calIDlst[i] + '&';
	}
	
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			$('#faOverlay',pageid).hide();
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(getEventInvite,eventid,calIDlst,eventtype,editEventPageIdNumOnly,pageid,'','');	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
	
			// THis response contains the current invitee list, as text javascript
			//selected="selected"  value="LeaderUserID999999">
	
//filter out ACCOUNT and SCOUT, Removed
			
					var datasplit=this.responseText.split('\n');
					var newdata='';
					for (var i=0;i<datasplit.length;i++) {
						if(datasplit[i].indexOf(">ACCOUNT, ") == -1) {
							if(datasplit[i].indexOf(">SCOUT, Removed") == -1) {
							  newdata = newdata + datasplit[i] + '\n';
							}
						}
					}
							

			postModifiedInvite(eventid,calstr,eventtype,editEventPageIdNumOnly,newdata,pageid);
		}
	};
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?'+eventid + '&PageID=Page' + editEventPageIdNumOnly + '&Action=UpdateAttendeeGroupOptions&' + calstr + 'EventType=' + eventtype;
	xhttp.open("GET", url, true);
	//xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		//window.console &&console.log("error getting " + xhttp.status);
		// On error, bail.  Set stuff to kill processing

		 
		if (servErrCnt > maxErr) {
			evLst.length=0;  // kill the remaining dates
			$.mobile.loading('show', { theme: 'a', text: 'restoring selection...', textonly: false });
			setTimeout(function () {resetCalendarIDs(pageid);},200);
			return;
		}
		servErrCnt++;
		setTimeout(function() {
			getEventInvite(eventid,calIDlst,eventtype,editEventPageIdNumOnly,pageid);
		},1000);	//reset 		 
		 
		 
		 
		 
	};
	
	
	
}	

/* this function used by the add invitees to events fromt he calendar page
   Given an editevent page with all of the current invitees, and a list of
   new invitees, build the formdata for a post with both setSeconds
   
   then post it to Scoutbook

*/

function postModifiedInvite (eventid,calstr,eventtype,editEventPageIdNumOnly,responseText,pageid) {
	
	var leaderLst=rematchx('selected\\"  value=\\"(LeaderUserID\\d+)','g',responseText,1);
	var parentLst=rematchx('selected\\"  value=\\"(ParentUserID\\d+)','g',responseText,1);
	var scoutLst=rematchx('selected\\"  value=\\"(ScoutUserID\\d+)','g',responseText,1);
	var inviteLst = getInviteIDs(pageid);
	
	//post, with this formdata
	var formdata ='PageID=Page'+editEventPageIdNumOnly;

	for (var i=0;i<leaderLst.length;i++) {
		formdata = formdata + "&Attendees=" + leaderLst[i];
	}
	for (var i=0;i<inviteLst.length;i++) {
		if (inviteLst[i].match(/Leader/) != null) {
			formdata = formdata + "&Attendees=" + inviteLst[i];
		}		
	}	
	for (var i=0;i<parentLst.length;i++) {
		formdata = formdata + "&Attendees=" + parentLst[i];
	}
	for (var i=0;i<inviteLst.length;i++) {
		if (inviteLst[i].match(/Parent/) != null) {
			formdata = formdata + "&Attendees=" + inviteLst[i];
		}		
	}		
	for (var i=0;i<scoutLst.length;i++) {
		formdata = formdata + "&Attendees=" + scoutLst[i];
	}
	for (var i=0;i<inviteLst.length;i++) {
		if (inviteLst[i].match(/Scout/) != null) {
			formdata = formdata + "&Attendees=" + inviteLst[i];
		}		
	}	

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			$('#faOverlay',pageid).hide();
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle( postModifiedInvite,eventid,calstr,eventtype,editEventPageIdNumOnly,responseText,pageid,'');	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;



			// now need to save the event.  SB change 7/29/19
			//This response modifies the invitee list on the current (not visible) page.

/* The response should look like
			$('#leadersLI', '#Page98671').html('<div><div class="attendeeDIV" data-userid="685976" ><div class="inviteeIcon attended"></div><img class="attendeeImage ui-corner-all ui-shadow" src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/no_avatar.png" /><div class="attendeeName">Denise<br>Broz</div></div><div class="attendeeDIV" data-userid="678707" ><div class="inviteeIcon attended"></div><img class="attendeeImage ui-corner-all ui-shadow" src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/no_avatar.png" /><div class="attendeeName">Ed<br>Bull</div></div><div class="attendeeDIV" data-userid="686080" ><div class="inviteeIcon attended"></div><img class="attendeeImage ui-corner-all ui-shadow" src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/no_avatar.png" /><div class="attendeeName">Greg<br>Catalano</div></div><div class="attendeeDIV" data-userid="9877337" ><div class="inviteeIcon attended"></div><img class="attendeeImage ui-corner-all ui-shadow" src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/no_avatar.png" /><div class="attendeeName">Ima<br>Erdman</div></div><div class="attendeeDIV" data-userid="686048" ><div class="inviteeIcon attended"></div><img class="attendeeImage ui-corner-all ui-shadow" src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/no_avatar.png" /><div class="attendeeName">Ronald<br>Feldman</div></div><div class="attendeeDIV" data-userid="678668" ><div class="inviteeIcon attended"></div><img class="attendeeImage ui-corner-all ui-shadow" src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/no_avatar.png" /><div class="attendeeName">Gary<br>Feutz</div></div><div class="attendeeDIV" data-userid="823189" ><div class="inviteeIcon attended"></div><img class="attendeeImage ui-corner-all ui-shadow" src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/no_avatar.png" /><div class="attendeeName">Angelina<br>Filippo</div></div><div class="attendeeDIV" data-userid="686068" ><div class="inviteeIcon attended"></div><img class="attendeeImage ui-corner-all ui-shadow" src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/no_avatar.png" /><div class="attendeeName">Greg<br>Grapenthien</div></div><div class="attendeeDIV" data-userid="689514" ><div class="inviteeIcon attended"></div><img class="attendeeImage ui-corner-all ui-shadow" src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/no_avatar.png" /><div class="attendeeName">Barb<br>Horn</div></div><div class="attendeeDIV" data-userid="714227" ><div class="inviteeIcon attended"></div><img class="attendeeImage ui-corner-all ui-shadow" src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/no_avatar.png" /><div class="attendeeName">Raymond<br>Horn III</div></div><div class="attendeeDIV" data-userid="689511" ><div class="inviteeIcon attended"></div><img class="attendeeImage ui-corner-all ui-shadow" src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/no_avatar.png" /><div class="attendeeName">Marc<br>Jach</div></div><div class="attendeeDIV" data-userid="731677" ><div class="inviteeIcon attended"></div><img class="attendeeImage ui-corner-all ui-shadow" src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/no_avatar.png" /><div class="attendeeName">Michell<br>Kot</div></div><div class="attendeeDIV" data-userid="714224" ><div class="inviteeIcon attended"></div><img class="attendeeImage ui-corner-all ui-shadow" src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/no_avatar.png" /><div class="attendeeName">John<br>Picchietti III</div></div><div class="attendeeDIV" data-userid="766425" ><div class="inviteeIcon attended"></div><img class="attendeeImage ui-corner-all ui-shadow" src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/no_avatar.png" /><div class="attendeeName">Jay<br>Schabelski</div></div><div class="attendeeDIV" data-userid="731702" ><div class="inviteeIcon attended"></div><img class="attendeeImage ui-corner-all ui-shadow" src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/no_avatar.png" /><div class="attendeeName">Kathy<br>Schabelski</div></div><div class="attendeeDIV" data-userid="727435" ><div class="inviteeIcon attended"></div><img class="attendeeImage ui-corner-all ui-shadow" src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/no_avatar.png" /><div class="attendeeName">Yllen<br>Solomon</div></div><div class="attendeeDIV" data-userid="686076" ><div class="inviteeIcon attended"></div><img class="attendeeImage ui-corner-all ui-shadow" src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/no_avatar.png" /><div class="attendeeName">Paul<br>Wiatr</div></div><div class="attendeeDIV" data-userid="689512" ><div class="inviteeIcon attended"></div><img class="attendeeImage ui-corner-all ui-shadow" src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/no_avatar.png" /><div class="attendeeName">Jayne<br>Wildhirt</div></div><div class="attendeeDIV" data-userid="687249" ><div class="inviteeIcon attended"></div><img class="attendeeImage ui-corner-all ui-shadow" src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/no_avatar.png" /><div class="attendeeName">Jesse<br>Wildhirt</div></div></div>').show();
			
			$('#scoutsLI', '#Page98671').html('<div><div class="attendeeDIV" data-userid="678699"><div class="inviteeIcon attended"></div><img class="attendeeImage ui-corner-all ui-shadow" src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/no_avatar.png" /><div class="attendeeName">Daniel<br>Feutz</div></div><div class="attendeeDIV" data-userid="678696"><div class="inviteeIcon attended"></div><img class="attendeeImage ui-corner-all ui-shadow" src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/no_avatar.png" /><div class="attendeeName">Brian<br>Feutz</div></div></div>').show();
*/			

			// get the pageid
			// 11/21 var pageid=this.response.match(/#Page[0-9]+/);
			//build a list of data-userids for leadersLI
			var leaderids=[];
			var leaders = this.response.match(/#leadersLI[^;]+/);
			if(leaders != null) {
				leaderids=leaders.match(/data-userid="[0-9]+/g);
				for (var i=0;i<leaderids.length;i++) {
					leaderids[i]=leaderids[i].replace('data=userid="','');
				}
			}
			



			
			if (evLst.length == 0 ) {
			  //alert('DONE TODO Cleanup')
			  $.mobile.loading('show', { theme: 'a', text: 'restoring selection...', textonly: false });
			   setTimeout(function () {resetCalendarIDs(pageid);},200);	
			} else {
			   setTimeout(function(){ getEditEvent(pageid); }, 200);		// Next event 
			}
		}
	};
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?'+ eventid + '&Action=UpdateAttendeesLI&' + calstr + 'EventType=' + eventtype;
	xhttp.open("POST",url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formdata);
	
	xhttp.onerror =function() {
		//window.console &&console.log("request error in postModifiedInvite" + xhttp.status);


		if (servErrCnt > maxErr) {
			evLst.length=0;  // kill the remaining dates
			$.mobile.loading('show', { theme: 'a', text: 'restoring selection...', textonly: false });
			 setTimeout(function () {resetCalendarIDs(pageid);},200);
			return;
		}
		servErrCnt++;
		setTimeout(function() {
			postModifiedInvite (eventid,calstr,eventtype,editEventPageIdNumOnly,responseText,pageid);
		},1000);	//reset 
	 
	};	
}

// function checks if invitees are selected

function testInviteIDs(pageid) {
	var inst = $('#inviteselectID',pageid).mobiscroll('getInst');		//gets the instanceof teh mobiscroll object
	var values = inst.getValues();				//gets the values selecteed in the mobiscroll object
    if (values.length != 0) {
		return true;
	}
	return false;
};

// function returns list of invitees selected
function getInviteIDs(pageid) {
	var inst = $('#inviteselectID',pageid).mobiscroll('getInst');		//gets the instanceof teh mobiscroll object
	var values = inst.getValues();				//gets the values selecteed in the mobiscroll object

	return values.slice(0);
};


// function returns array of matches, for the xth match per regexp call

function rematchx(patt,glob,srchstr,x) {
	if (glob === undefined) {
          glob='';
    } 
	var y =parseInt(x);
	var re = new RegExp(patt,glob);
	var res;
	var arr=[];
	var id;
	do {
		res = re.exec(srchstr);
		if (res != undefined) {
			id=res[y];
		  arr.push(id);
		}
	}
	while (res != undefined);
	return arr.slice(0);
	
}


