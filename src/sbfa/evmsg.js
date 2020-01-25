// Copyright © 10/4/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.

// msg goes to only one if mutiple calendars - update to select like in autolog?

function rawDataAddEvMsg(data,pageid,nowDate) {
	//<select name="RSVP"'
	   var startfunc;
	   var endfunc;	
	   var myfunc;
	   var unitid;
		var iunit=[];
		var iname=[];
		var aunit;
		var tmp;

//if new event (nothing selected yet) don't show msg button
		var startfunc=data.search(/<select[ ]+name[^=]*=[^"]*"CalendarID"[ ]+id[^=]*=[^"]*"calendarID"/);
		if (startfunc==-1) {
			return data;
		}
		var endfunct=data.slice(startfunc).search(/<[^\/]*\/select[^>]*>/) + startfunc;
		if(endfunct==-1) {
			return data;
		}	
		tmp=data.slice(startfunc,endfunct);
		if (tmp.match(/selected/) == null) {
		  return data;
		}
		
	   
	startfunc = data.search(/<select[ ]+name[^=]*=[^"]*"RSVP"/);
//	if (startfunc==-1) {
//		//no insert point for RSVP messaging.  Event already happened.  Not reliable any more.  Autolog is better
//		return data;
//	}
	
	clrEvMsgOb();
	var formDate='';
	if(data.match(/"startDate"[ ]+value[^=]*=[^"]*"([^"]+)/)!=null) {
		formDate=data.match(/"startDate"[ ]+value[^=]*=[^"]*"([^"]+)/)[1];
	}
	// is this event in the past?
	if( dateDiff(formDate,nowDate) < 0 ) {

		var startfunc=data.search(/<select[ ]+name[^=]*=[^"]*"CalendarID"[ ]+id[^=]*=[^"]*"calendarID"/);
		if (startfunc==-1) {
			return data;
		}
		var endfunct=data.slice(startfunc).search(/<[^\/]*\/select[^>]*>/) + startfunc;
		if(endfunct==-1) {
			return data;
		}		
		for (var i=0;i<data.slice(startfunc,endfunct).match(/<option[ ]+value[^=]*=[^"]*"(UnitID|DenID|PatrolID)\d+"[^<]+/g).length;i++) {
			tmp=       data.slice(startfunc,endfunct).match(/<option[ ]+value[^=]*=[^"]*"(UnitID|DenID|PatrolID)\d+"[^<]+/g)[i];
			if (tmp.match(/(UnitID)(\d+)/) != null) {
			   aunit='UnitID-' + tmp.match(/UnitID(\d+)/)[1];
			   unitnum=tmp.match(/UnitID(\d+)/)[1];
				if(tmp.match(/>(.+)/)!= null){
					unitname=tmp.match(/>(.+)/)[1].trim();
				}
			}							

			
			var den='';
			var patrol='';
			var udp=aunit + '&DenID-';
			if(tmp.match(/selected[^=]*=[^"]*"selected"/)!= null) {
				if(tmp.match(/DenID(\d+)/) != null ) {
					udp += tmp.match(/DenID(\d+)/)[1];
				} 
				udp += '&PatrolID-';
				if(tmp.match(/PatrolID(\d+)/) != null ) {
					udp += tmp.match(/PatrolID(\d+)/)[1];
				} 								
				
				if(tmp.match(/>(.+)/)!= null){
					pushUnique(iname,unitname);
				}

				pushUnique(iunit,unitnum);
			}
			
		}
		evMsgObj.units = iunit.slice(0);
		// this is a past event and there is at least one invitee that attended
	
		
		var startfunc = data.search(/<span[ ]+id[^=]*=[^"]*"permissionSPAN/);
		
		if(startfunc==-1) {
			//can't find insert point for quick entry log button
			return data;
		}
	   // define the button
	   var lin1 = '<span style="display: inline;" id="evMsgAttendeesDIV">';

	   lin1 += '		<a data-role="button" data-theme="d" data-inline="true" data-mini="true" href="#" id="evMsgAttendees">';	   
	   lin1 += '			<div style="margin-left: 25px; position: relative; ">';
	   lin1 += '				<img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/emailgray48.png" style="position: absolute; width: 24px; left: -28px; top: -4px; " />';
	   lin1 += '				<span class="text">Message Attendees</span>';
	   lin1 += '		    </div>';
	   lin1 += '		</a>';
	   lin1 += '   </span>';
		lin1 += '  <div  style="display: none">';
		lin1 += '   <select name="AttendeeMsgID" id="attendeeMsgID" multiple="multiple" data-role="none">';
		lin1 += '   <option value="Yes"  data-rlist="1" >Attended</option>';
		lin1 += '   <option value="No" data-rlist="1" >Did Not Attend</option>';
		lin1 += '   </select>';
		lin1 += '   </div>';

	    var newdata = data.slice(0,startfunc) + lin1   + data.slice(startfunc);
		data = newdata;

	   var offset=0;
	   var ndata=newdata;

	    while(true) {
			ndata=ndata.slice(offset);
			startfunc=ndata.search(/<option[ ]+value[^=]*=[^"]*"UnitID/);
			endfunc =ndata.slice(startfunc+12).search(/<option[ ]+value[^=]*=[^"]*"UnitID/);
			
			if (endfunc== -1) {
					// no more to search.  Search for </select instead
					endfunc =ndata.slice(startfunc+12).search(/<\/select/);
			}
			
			if(endfunc == -1) {
				return newdata;

			}
			
			if (ndata.slice(startfunc,endfunc+startfunc+12).search(/selected=\"selected\"/) != -1) {
				// this is the unit id we want
				unitid ='';
				if(ndata.slice(startfunc).match(/<option[ ]+value[^=]*=[^"]*"UnitID(\d+)\"/) != null ) {
					unitid = ndata.slice(startfunc).match(/<option[ ]+value[^=]*=[^"]*"UnitID(\d+)\"/);
					break;
				}
			}
			offset=startfunc+20;
		}		
		
		
		
	    startfunc = data.search(/\$\('#startEndDate',[ ]+'#Page/);
	   if (startfunc != -1) {
//			var myfunc ="$('#evMsgAttendees','#Page" + escapeHTML(pageid) + "').click(function () { eventAttendMsg("+escapeHTML(unitid[1])+");});\n";
//			data = data.slice(0,startfunc) + myfunc  + data.slice(startfunc);
			
			var myfunc ="$('#evMsgAttendees','#Page" + escapeHTML(pageid) + "').click(function () {  $('#attendeeMsgID','#Page" + escapeHTML(pageid) +"').mobiscroll('show');});\n";
			data = newdata.slice(0,startfunc) + myfunc  + newdata.slice(startfunc);
	   }	

	   var offset=0;
	   var ndata=data;

	    while(true) {
			ndata=ndata.slice(offset);
			startfunc=ndata.search(/<option[ ]+value[^=]*=[^"]*"UnitID/);
			endfunc =ndata.slice(startfunc+12).search(/<option[ ]+value[^=]*=[^"]*"UnitID/);
			
			if (endfunc== -1) {
					// no more to search.  Search for </select instead
					endfunc =ndata.slice(startfunc+12).search(/<\/select/);
			}
			
			if(endfunc == -1) {
				return newdata;

			}
			
			if (ndata.slice(startfunc,endfunc+startfunc+12).search(/selected=\"selected\"/) != -1) {
				// this is the unit id we want
				unitid ='';
				if(ndata.slice(startfunc).match(/<option[ ]+value[^=]*=[^"]*"UnitID(\d+)\"/)!=null) {
					unitid = ndata.slice(startfunc).match(/<option[ ]+value[^=]*=[^"]*"UnitID(\d+)\"/);
					break;
				}
			}
			offset=startfunc+20;
		}


	    startfunc = data.search(/\$\('#startEndDate',[ ]+'#Page/);
		if(startfunc != -1) {
			myfunc = '' + dummydd;
			myfunc = myfunc.slice(20).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(pageid)).replace(/Xunit/,escapeHTML(unitid[1]));
			data = data.slice(0,startfunc) + myfunc + '\n'+ data.slice(startfunc);	
		}	   
		
		
		return data;
	}		
	
	
	endfunc = data.slice(startfunc).search(/<\/select>/)+startfunc;				
	var onselect = data.slice(startfunc).search(/<option[ ]+value[^=]*=[^"]*"on"[ ]+selected[^=]*=[^"]*"selected"/)+startfunc;
	
	if (onselect > startfunc && onselect < endfunc) {
		// ok to insert, this is an editevent with a prior RSVP on
		// Need to insert buttons
	
		var iunit=[];
		var iname=[];
		var aunit;
		var tmp;
		var unitname;
		var unitnum;
		var startfunc=data.search(/<select[ ]+name[^=]*=[^"]*"CalendarID"[ ]+id[^=]*=[^"]*"calendarID"/);
		if (startfunc==-1) {
			return data;
		}
		var endfunct=data.slice(startfunc).search(/<[^\/]*\/select[^>]*>/) + startfunc;
		if(endfunct==-1) {
			return data;
		}		
		for (var i=0;i<data.slice(startfunc,endfunct).match(/<option[ ]+value[^=]*=[^"]*"(UnitID|DenID|PatrolID)\d+"[^<]+/g).length;i++) {
			tmp=data.slice(startfunc,endfunct).match(/<option[ ]+value[^=]*=[^"]*"(UnitID|DenID|PatrolID)\d+"[^<]+/g)[i];
			if (tmp.match(/(UnitID)(\d+)/) != null) {
			   aunit='UnitID-' + tmp.match(/UnitID(\d+)/)[1];
			   unitnum=tmp.match(/UnitID(\d+)/)[1];
				if(tmp.match(/>(.+)/)!= null){
					unitname=tmp.match(/>(.+)/)[1].trim();
				}
			}							

			
			var den='';
			var patrol='';
			var udp=aunit + '&DenID-';
			if(tmp.match(/selected[^=]*=[^"]*"selected"/)!= null) {
				if(tmp.match(/DenID(\d+)/) != null ) {
					udp += tmp.match(/DenID(\d+)/)[1];
				} 
				udp += '&PatrolID-';
				if(tmp.match(/PatrolID(\d+)/) != null ) {
					udp += tmp.match(/PatrolID(\d+)/)[1];
				} 								
				
				if(tmp.match(/>(.+)/)!= null){
					pushUnique(iname,unitname);
				}

				pushUnique(iunit,unitnum);
			}
			
		}
		evMsgObj.units = iunit.slice(0);
//alert(evMsgObj.units);


	//>Msg those who RSVP'd Yes 
		var listanchor ='<div  style="display: none">';
		listanchor += '<select name="RecipientID" id="recipientID" multiple="multiple" data-role="none">';
		listanchor += '<option value="Yes"  data-rlist="1" >Msg all who RSVP'+"'"+'d Yes </option>';
		listanchor += '  <option value="No"  data-rlist="1" >Msg all who RSVP'+"'"+'d No</option>';
		listanchor += '<option value="Maybe" data-rlist="1" >Msg all who didn'+"'"+'t respond</option>';
		listanchor += '</select>';
		listanchor += '</div>';
		
	   // The Event Messages button is only added to events that have not occurred yet and have the permission slip button present
	   //'<span id="permissionSPAN'
	   startfunc = data.search(/<span[ ]+id[^=]*=[^"]*"permissionSPAN/);
	   var lin1 = '<span style="display: inline;" id="eventMessagesDIV">\n';
	   lin1 +=    '	<a data-role="button" data-theme="d" data-inline="true" data-mini="true" href="#" id="eventMessages">\n';
	   lin1 +=    ' 	<div style="margin-left: 25px; position: relative; ">\n';
	   lin1 +=    '			<img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/emailgray48.png" style="position: absolute; width: 24px; left: -28px; top: -4px; " />\n';
	   lin1 +=    '				<span class="text">Message Invitees</span>\n';
	   lin1 +=    '		</div>\n';
	   lin1 +=    '	</a>\n';
	   lin1 +=    '</span>\n';

	   var newdata = data.slice(0,startfunc) + lin1 + listanchor  + data.slice(startfunc);
		
	   // now need inline functions to handle buttons
	   //Determine which unitID is selected or which unitID has a Den or Patrol selected
	   
	   var offset=0;
	   var ndata=newdata;

	    while(true) {
			ndata=ndata.slice(offset);
			startfunc=ndata.search(/<option[ ]+value[^=]*=[^"]*"UnitID/);
			endfunc =ndata.slice(startfunc+12).search(/<option[ ]+value[^=]*=[^"]*"UnitID/);
			
			if (endfunc== -1) {
					// no more to search.  Search for </select instead
					endfunc =ndata.slice(startfunc+12).search(/<\/select/);
			}
			
			if(endfunc == -1) {
				return newdata;

			}
			
			if (ndata.slice(startfunc,endfunc+startfunc+12).search(/selected=\"selected\"/) != -1) {
				// this is the unit id we want
				unitid ='';
				if(ndata.slice(startfunc).match(/<option[ ]+value[^=]*=[^"]*"UnitID(\d+)\"/)!=null) {
					unitid = ndata.slice(startfunc).match(/<option[ ]+value[^=]*=[^"]*"UnitID(\d+)\"/);
				}
				break;
			}
			offset=startfunc+20;
		}
	   //"$('#startEndDate', '#Page"
	    startfunc = newdata.search(/\$\('#startEndDate',[ ]+'#Page/);
	   if (startfunc != -1) {
			myfunc ="$('#eventMessages','#Page" + escapeHTML(pageid) + "').click(function () { $('#recipientID','#Page" + escapeHTML(pageid) +"').mobiscroll('show');});\n";
			data = newdata.slice(0,startfunc) + myfunc  + newdata.slice(startfunc);
	   }

	    startfunc = data.search(/\$\('#startEndDate',[ ]+'#Page/);
		if(startfunc != -1) {
			myfunc = '' + dummyfy;
			myfunc = myfunc.slice(20).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(pageid)).replace(/Xunit/,escapeHTML(unitid[1]));
			data = data.slice(0,startfunc) + myfunc + '\n'+ data.slice(startfunc);	
		}	   

	
	}
	return data;
}

//mobiscroll setup for event messaging
//eventmsg

function dummydd() {
				$('#attendeeMsgID','#PageX').mobiscroll().select({
				theme: 'scoutbook',
				display: 'bubble',
				counter: true,
				label: 'Select Attendance Status to select Mail Recipients',
				showLabel: true,
				animate: 'flip',
				minWidth: 300,
//				width: 200,
				buttons: ['set', 'cancel'],
				mode: 'mixed',
				placeholder: 'choose one or more Attendance types',
				anchor: $('#evMsgAttendeesDIV', '#PageX'),
				onSelect: function() {
					$.mobile.loading('show', { theme: 'a', text: 'updating...', textonly: false });
					setTimeout(function () {eventAttendMsg("Xunit");}, 1000);
					return false;
				},
				onCancel: function() {
					return false;
				},
				rows: 7,
				showInput: false,
				onBeforeShow: function(inst) {
					// do some logic here to see if we need to cancel the scroller

				}
			});		
}
function dummyfy() {
	
				$('#recipientID','#PageX').mobiscroll().select({
				theme: 'scoutbook',
				display: 'bubble',
				counter: true,
				label: 'Select the RSVP type of the message recipients',
				showLabel: true,
				animate: 'flip',
				minWidth: 300,
				buttons: ['set', 'cancel'],
				mode: 'mixed',
				placeholder: 'choose one or more RSVP types',
				anchor: $('#eventMessagesDIV', '#PageX'),
				onSelect: function() {
					$.mobile.loading('show', { theme: 'a', text: 'updating...', textonly: false });
					setTimeout(function () {sendRecipientMessages("Xunit");}, 1000);
					return false;
				},
				onCancel: function() {
					return false;
				},
				rows: 7,
				showInput: false,
				onBeforeShow: function(inst) {
					// do some logic here to see if we need to cancel the scroller

				}
			});
			
			
		
			
			
/*			
				$('#logID','#PageX').mobiscroll().select({
				theme: 'scoutbook',
				display: 'bubble',
				counter: true,
				label: 'Select the Quick Entry Log you want to copy attendees and information to',
				showLabel: true,
				animate: 'flip',
				buttons: ['set', 'cancel'],
				mode: 'mixed',
				placeholder: 'choose a Log',
				anchor: $('#logQuickEntryDIV', '#PageX'),
				onSelect: function() {
					$.mobile.loading('show', { theme: 'a', text: 'updating...', textonly: false });
					setTimeout('setupLogs("Xunit")', 1000);
					return false;
				},
				onCancel: function() {
					return false;
				},
				rows: 7,
				showInput: false,
				onBeforeShow: function(inst) {
					// do some logic here to see if we need to cancel the scroller

				}
			});			
*/			
			
}

function eventAttendMsg(unitid) {
	//$('div.attended').parent().each(function () {
	//	alert($(this).attr('data-userid'));
	//});
//attended or did not
	var inst = $('#attendeeMsgID').mobiscroll('getInst');		//gets the instanceof teh mobiscroll object
	var values = inst.getValues();				//gets the values selecteed in the mobiscroll object
var yes=false;
var no=false;
	for (var i =0;i<values.length;i++) {
	
		if(values[i] =='Yes') {yes=true};
		if(values[i] =='No') {no=true};
	}
	
	
	$('#leadersLI  .attendeeDIV').each(function () { 
		if ($(this).find('.attended').attr('style') != undefined) {
			if(yes==true) {
				evMsgObj.leaderid.push($(this).attr('data-userid'));
			}
		} else {
			if(no==true) {
				evMsgObj.leaderid.push($(this).attr('data-userid'));
			}			
		}
	});

	$('#parentsLI  .attendeeDIV').each(function() { 
		if ($(this).find('.attended').attr('style') != undefined) {
			if(yes==true) {
			evMsgObj.parentid.push($(this).attr('data-userid'));
			}
		} else {
			if(no==true) {
			evMsgObj.parentid.push($(this).attr('data-userid'));
			}
		}		
	});

	$('#scoutsLI  .attendeeDIV').each(function() { 
		if ($(this).find('.attended').attr('style') != undefined) {
			if(yes==true) {
			evMsgObj.scoutid.push($(this).attr('data-userid'));
			}
		} else {
			if(no==true) {
			evMsgObj.scoutid.push($(this).attr('data-userid'));
			}
		}		
	});


	$('#scoutsLI  .attendeeDIV').each(function() { 
		 $(this).find('.attended').each( function(index,value) {
			 if($(this).attr('style') != undefined) {
				 if(yes==true) {
					var aa = $(this).parent()[0];
					var sn = $('.attendeeName',aa)[0].innerText.replace('\n',' ');
					evMsgObj.scoutname.push(sn);
				 }
			 } else {
				 if(no==true) {
					var aa = $(this).parent()[0];
					var sn = $('.attendeeName',aa)[0].innerText.replace('\n',' ');
					evMsgObj.scoutname.push(sn);
				 }				 
			 }
		});			
	});	

	evMsgObj.type='attend';
	triggerMessage(unitid);
}


// This function clears the global evMsgObj object
//eventmsg
function clrEvMsgOb() {
	evMsgObj.scoutid=[];
	evMsgObj.parentid=[];
	evMsgObj.leaderid=[];
	evMsgObj.scoutname=[];
	evMsgObj.mevent='';
	evMsgObj.where='';
	evMsgObj.when='';
	evMsgObj.meventid='';
	evMsgObj.stat='';
	evMsgObj.descript='';
	evMsgObj.units=[],
	evMsgObj.shown=false,
	evMsgObj.body='',
	evMsgObj.subject='';
	evMsgObj.type='';
}

//eventmsg
function sendRecipientMessages(unitid) {

// get from the mobiscroll

	//clrEvMsgOb();	
	
	var inst = $('#recipientID').mobiscroll('getInst');		//gets the instanceof teh mobiscroll object
	var values = inst.getValues();				//gets the values selecteed in the mobiscroll object

	for (var i =0;i<values.length;i++) {
	
		eventMsgTo(values[i],unitid);
	}
	triggerMessage(unitid);

}


//eventmsg
function eventMsgTo(rsvpstat,unitid) {
	

	// get leaders,parents, and scouts marked with rsvpstat

	

	
	$('#leadersLI  .attendeeDIV').each(function () { 
		if ($(this).find('.rsvp' + rsvpstat).attr('style') != undefined) {
			evMsgObj.leaderid.push($(this).attr('data-userid'));
		}
	});

	$('#parentsLI  .attendeeDIV').each(function() { 
		if ($(this).find('.rsvp' + rsvpstat).attr('style') != undefined) {
			evMsgObj.parentid.push($(this).attr('data-userid'));
		}			
	});

	$('#scoutsLI  .attendeeDIV').each(function() { 
		if ($(this).find('.rsvp' + rsvpstat).attr('style') != undefined) {
			evMsgObj.scoutid.push($(this).attr('data-userid'));
		}			
	});


	$('#scoutsLI  .attendeeDIV').each(function() { 
		 $(this).find('.rsvp' + rsvpstat).each( function(index,value) {
			var aa = $(this).parent()[0];
			var sn = $('.attendeeName',aa)[0].innerText.replace('\n',' ');
			evMsgObj.scoutname.push(sn);
		});			
	});	

	
	
	
	
	
	//$('#leadersLI  .attendeeDIV').each(function() { alert( $(this).attr('data-userid') + " " + $(this).find('.rsvpMaybex').attr('style'));});
	//$('#leadersLI  .attendeeDIV').each(function() { alert($(this).attr('data-userid'));});
    
	//triggerMessage(unitid);
		
		
}
//Eventmsg
function triggerMessage(unitid) {
	
	//evMsgObj.stat=rsvpstat;
	evMsgObj.mevent = $('#name').val();
	evMsgObj.where = $('#location').val();
	evMsgObj.when = $('#startDate').val() + " to " + $('#endDate').val();
	evMsgObj.meventid='';
	if($.mobile.activePage[0].baseURI.match(/EventID=\d+/)!=null){
		evMsgObj.meventid= $.mobile.activePage[0].baseURI.match(/EventID=\d+/)[0];
	}
	evMsgObj.descript = $('#description').val();	
	
	
	//var bname = 'addMyButton';
	//$('#footer').append('<a href="/mobile/dashboard/messages/default.asp?UnitID=' + unitid + '"   id="' + bname + '"    style="hidden"></a>');
	//$('#' + bname).trigger('click');
	changepageurl('/mobile/dashboard/messages/default.asp?UnitID=' + unitid);
}

//#####   Eventmsg
	


function presetMsg(pageid) {
	//debugger;
	if (evMsgObj.mevent == undefined) {
		return false;
	}
	
	
	//console.log(evMsgObj);
	
	
	var parentclicked=[];
	
    if (evMsgObj.mevent != '') {
		for (var i=0;i<evMsgObj.scoutid.length;i++){
			$('.scout.checkable[data-userid="' + evMsgObj.scoutid[i] + '"]').click();

		}

		for (var i=0;i<evMsgObj.parentid.length;i++){
			$('.parent.checkable[data-userid="' + evMsgObj.parentid[i] + '"]').click();
			parentclicked.push(evMsgObj.parentid[i]);
		}
		for (var i=0;i<evMsgObj.leaderid.length;i++){
			$('.leader.checkable[data-userid="' + evMsgObj.leaderid[i] + '"]').click();
		}
		
		/*
		  for all parents
		  compare match to evMsgObj.scoutname
		
		*/
		var scoutname;
		var skip=false;
		for (var i=0;i<evMsgObj.scoutname.length;i++){
			scoutname=evMsgObj.scoutname[i];
			$('.parent.checkable').each(function (index,value) {
				var thisid = $(this).attr('data-userid');
				skip=false;
				for ( var i=0;i<parentclicked.length;i++) {
					if (thisid == parentclicked[i]) {
					  skip=true;
					  break;
					}
				}
				if (skip == false) {
					var sn = $(this)[0].textContent;
					if (sn.indexOf(scoutname) != -1) {
						//alert('check ');
						// check this parent - what if it is already checked?
						$(this).click();
						parentclicked.push(thisid);
					}
				}
		
			});
		}
		
		var bodymsg;
		var subjectmsg;
		var descript;
		if(evMsgObj.body=='') {
			
			descript = evMsgObj.descript;

			
			bodymsg="[url=https://" + host + "scoutbook.com/mobile/dashboard/calendar/event.asp?" + evMsgObj.meventid + "]See event details in Scoutbook[/url]";

			subjectmsg =$('label[for="'+ $('input:checked[name="UnitID"]').attr('id') + '"]').text().trim() + " Event: ";
			

			$('#subject').val(subjectmsg + evMsgObj.mevent);
			
			if(evMsgObj.type=='attend') {
				$('#body').val('What: ' + evMsgObj.mevent + '\n'+ 'When: ' + evMsgObj.when + '\n' + 'Where: ' + evMsgObj.where + '\n\n');
			} else {
				$('#body').val('What: ' + evMsgObj.mevent + '\n'+ 'When: ' + evMsgObj.when + '\n' + 'Where: ' + evMsgObj.where + '\n\n' + descript + '\n\n' + bodymsg);
			}
		}else {		
			$('#subject').val(evMsgObj.subject);
			$('#body').val(evMsgObj.body);
		}
		
		//disable any non-event related radio buttons
		if(evMsgObj.mevent != 'manual') {
		var id;
		var found;
		for(var i=0;i<$('input[name="UnitID"]').length;i++) {
			found=false;
			id='';
			if($('input[name="UnitID"]')[i].id.match(/\d+/)!=null) {
				id=$('input[name="UnitID"]')[i].id.match(/\d+/)[0];
			}
			for(var j=0;j<evMsgObj.units.length;j++) {
				if(evMsgObj.units[j]==id) {
					found=true;
					break;
				}
			}
			if(found==false) {
				$('#unitID'+id).checkboxradio('disable');
			}
		}
		}
		if($('div#keepMediv').length ==0 ) {	
			// catch the submit and update the evMsgObj$
			$('#buttonSubmit','#Page' + escapeHTML(pageid)).on('click',function () {

				if($('#keepContentID:checked').length == 1 ) {
					// keep the content
					evMsgObj.body =$('#body').val();
					evMsgObj.subject =$('#subject').val();
					evMsgObj.shown=true;
					//remove the div for the form
					$('#keepMediv').remove();
				} else {
					clrEvMsgOb();
				}
			});
		
		
		// add retain div
		// after $('#bccDIV')	
		
			$('#bccDIV').after('<div id="keepMediv"><label for="keepContentID" >Keep Message Content to Send to Another Unit</label><input type="checkbox" name="keepContent" id="keepContentID" value="1" data-theme="d" checked="checked"></div>');
			$('[type="checkbox"]').checkboxradio();
		}
		

		//clrEvMsgOb(); //try simply clearing when we move off event msg screen
   }
}


