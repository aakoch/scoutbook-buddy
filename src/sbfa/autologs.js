// Copyright © 10/4/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.
function rawDataAddAutoLog(data,pageid,nowDate) {

		var iunit=[];
		var iname=[];
		var aunit;
		var tmp;
		
		//<select name="CalendarID" id="calendarID"
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
		
		
		
		
		var formDate=nowDate;
		if(data.match(/"startDate"[ ]+value[^=]*=[^"]*"([^"]+)/) != null) {
			formDate=data.match(/"startDate"[ ]+value[^=]*=[^"]*"([^"]+)/)[1];
		}
	// is this event in the past?
	if( dateDiff(formDate,nowDate) < 0 ) {
		//yes

		//<select name="CalendarID" id="calendarID"
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
					iname.push(tmp.match(/>(.+)/)[1].trim());
				}
				iunit.push(udp);
			}
		}	
		// this is a past event and there is at least one invitee that attended
	    var listanchor ='<div  style="display: none">\n';
		listanchor +=     '<select name="LogID" id="logID" multiple="multiple" data-role="none">\n';
		listanchor +=     '  <option value="Camping"  data-rlist="1" >Autofill Camping Log</option>\n';
		listanchor +=     '  <option value="Hiking"  data-rlist="1" >Autofill Hiking Log</option>\n';
		listanchor +=     '  <option value="Service"  data-rlist="1" >Autofill Service Log</option>\n';
		listanchor +=     '</select></div>';	
		
		var startfunc = data.search(/<span[ ]+id[^=]*=[^"]*"permissionSPAN/);
		
		if(startfunc==-1) {
			//can't find insert point for quick entry log button
			return data;
		}
	   // define the button
	   var lin1 = '<span style="display: inline;" id="logQuickEntryDIV">';

	   lin1 += '		<a data-role="button" data-theme="d" data-inline="true" data-mini="true" href="#quickEntryMenu" data-rel="popup" data-transition="slideup" id="logQuickEntry">';	   
	   lin1 += '			<div style="margin-left: 25px; position: relative; ">';
	   lin1 += '				<img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/quickentry48.png" style="position: absolute; width: 24px; left: -28px; top: -4px; " />';
	   lin1 += '				<span class="text">Quick Entry Log</span>';
	   lin1 += '		    </div>';
	   lin1 += '		</a>';
	   lin1 += '   </span>';


	   var newdata = data.slice(0,startfunc) + lin1 + listanchor  + data.slice(startfunc);
		data = newdata;
	   

		//put the popup for selecting a quick entry log unit here
				//'<li data-role="list-divider" data-theme="a">Scheduled Reminders'
				var startfunc = data.search(/<li[ ]+data-role[^=]*=[^"]*"list-divider"[ ]+data-theme[^=]*=[^"]*"a"[^>]*>[^ ]*Scheduled Reminders/);	
				if (startfunc==-1) {
					// can't find insert point for 
					return data;
				}
				var newdata = data.slice(0,startfunc);
				newdata += '	<li id="paylogDivider" data-theme="d" style="display: none;">'	
				newdata += '	<div data-role="popup" id="quickEntryMenu" data-theme="d" data-history="false">';
				newdata += '		<ul data-role="listview" data-inset="true" style="min-width:210px;" data-theme="d" class="ui-icon-alt">';
				newdata += '			<li data-role="divider" data-theme="a">Choose an action:</li>';
				
				//#########################
					newdata += '<li>';
					newdata += '						<fieldset data-role="controlgroup" style="margin-top: 1em; ">';
					newdata += '							<legend class="text-orange">';
					newdata += '								Choose Unit:';
					newdata += '							</legend>	';

					// radio button for anything selected?

					var seltxt=' checked="checked" ';	
					for(var i=0;i<iunit.length;i++) {
						newdata += '								<label for="unitSelectID'+escapeHTML(iunit[i])+'">';
						newdata +=   								escapeHTML(iname[i]) ;
						newdata +='									</label>';
						newdata += '								<input type="radio"  name="UnitSelectID" id="unitSelectID'+escapeHTML(iunit[i])+'" data-theme="d" value="'+escapeHTML(iunit[i])+'"' + escapeHTML(seltxt)+' />';
						seltxt='';
					}
													
					newdata += '						</fieldset>';
					newdata += '</li>';
				//###################
			

				newdata += '			<li><a href="#" id="autoCampLog" class="showLoading" >Autofill Camping Log</a></li>';
				newdata += '			<li><a href="#" id="autoHikeLog" class="showLoading">Autofill Hiking Log</a></li>';
				newdata += '			<li><a href="#" id="autoServeLog" class="showLoading">Autofill Service Log</a></li>';				
				newdata += '		</ul>';
				newdata += '	</div>';
				newdata += '	</li>';
				newdata +=  data.slice(startfunc);				
				data=newdata;
				
			
				var startfunc=data.indexOf("$('#buttonDelete', '#Page");			
				var myfunc = '' + pcscript;				
				myfunc = myfunc.slice(22).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(pageid)).replace(/UnitID=X/g,'UnitID='+ escapeHTML(unitID));
				newdata = data.slice(0,startfunc) + myfunc + '\n'  + data.slice(startfunc);			
				data=newdata;					
				
	}
	return data;
				
}

function pcscript() {

	$('#autoCampLog','#PageX').click(function() {
		checkLogAvail('campinglogentry','#PageX');
	});
		$('#autoHikeLog','#PageX').click(function() {
		checkLogAvail('hikinglogentry','#PageX');
	});
		$('#autoServeLog','#PageX').click(function() {
		checkLogAvail('servicelogentry','#PageX');
	});
}

function preCal (pageid) {
	//ADD Freez Input???
	
	$('#autoCampLog',pageid).click(function() {
		checkLogAvail('campinglogentry',pageid);
	});
		$('#autoHikeLog',pageid).click(function() {
		checkLogAvail('hikinglogentry',pageid);
	});
		$('#autoServeLog',pageid).click(function() {
		checkLogAvail('servicelogentry',pageid);
	});
}


function checkLogAvail(logasp,pageid) {
//verify user has log access before showing
//look at unit/denpatrol page

	var unitids=$('[name=UnitSelectID]:checked',pageid).val().replace(/-/g,'=');
	var unitStr='';
	if(unitStr=unitids.match(/UnitID=\d+/)!=null) {
		unitStr=unitids.match(/UnitID=\d+/)[0];
	}
	var urlasp='';
	if(unitids.match(/PatrolID=\d+/) != null) {
		urlasp='denpatrol.asp?'+unitStr+'&'+unitids.match(/PatrolID=\d+/)[0];
	}
	if(unitids.match(/DenID=\d+/) != null) {
		urlasp='denpatrol.asp?'+unitStr+'&'+unitids.match(/DenID=\d+/)[0];
	}
	if (urlasp=='') {
		urlasp='unit.asp?'+unitStr;
	}


	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {

		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			$('#faOverlay').hide();
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle( checkLogAvail,logasp,pageid,'','','','');	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
		resetLogoutTimer(url);
		servErrCnt=0;
	

		//check content for QE 
		  if($('a[href="#quickEntryMenu"]',pageid).length==0) {
			  //not avail
			  showErrorPopup('You do not have the proper permissions to update logs');
			  $.mobile.loading('hide');
			  $('#faOverlay').hide();
			  return;
		  }
		  autoFillLog(logasp,pageid);
		  return;
		}
	};
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/'+urlasp;
	xhttp.open("GET", url, true);
	//xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		errHandle( checkLogAvail,logasp,pageid,'','','','');
	};



}


function getEventInfo(pageid){

	clrEvMsgOb();
	$('#scoutsLI .attendeeDIV',pageid).each(function () { 
		if($('.attended[style*="display"]',this).length>0) { 
			//console.log( 'got '+ $('.attendeeName',this).text() +$(this).attr('data-userid'));
			evMsgObj.scoutid.push($(this).attr('data-userid'));
		} 
	});
	
	evMsgObj.mevent = $('#name',pageid).val();
	evMsgObj.where = $('#location',pageid).val();
	evMsgObj.when = $('#startDate',pageid).val() + " to " + $('#endDate',pageid).val();
	evMsgObj.meventid='';
	if($.mobile.activePage[0].baseURI.match(/EventID=\d+/) != null) {
		evMsgObj.meventid= $.mobile.activePage[0].baseURI.match(/EventID=\d+/)[0];
	}
	evMsgObj.descript = $('#description',pageid).val();
	
}

function preload(){
//pageid for this page is NOT known
//console.log('in preload');
	//Now we can pre-select scouts and fill in visible fields...  back button issue
		
	//alert('here');  //displays before page is visible...  hmmm
	//ScoutUserID - check those present and hide those not present
	

	$('[name="ScoutUserID"]').each(function () { 
		//console.log($(this).val()); 
		//$(this).parent().hide();
		for(var i=0;i<evMsgObj.scoutid.length;i++) {
			if(evMsgObj.scoutid[i]==$(this).val()) {
				//keep this one and check it
				//$(this).parent().show();
				$(this).trigger('click');
			}
		}
	});	
	$('[name="Location"]').val(evMsgObj.mevent + ' at ' + evMsgObj.where);
	
	// try to handle date
	
	var fromdate ='';
	var todate = '';
	if(evMsgObj.when.match(/([^ ]+)/) != null) {
		fromdate =evMsgObj.when.match(/([^ ]+)/)[1];
	}
	if(evMsgObj.when.match(/to ([^ ]+)/) != null) {
		todate = evMsgObj.when.match(/to ([^ ]+)/)[1];
	}
	$('[name="LogDate"]').val(fromdate);		//same for all

	//console.log('todate='+todate);
	
	//if campinglog.. find from url
	if(document.baseURI.match(/campinglogentry/) != null) {
		
		var nights=(Date.parse(todate) - Date.parse(fromdate))/(1000*60*60*24);
		//console.log('campinglog nights='+nights);
		$('[name="Days"]').val(nights+1);
		$('[name="Nights"]').val(nights);
	}
	
	$('[name="Notes"]').val(evMsgObj.descript);
}
function autoFillLog(logasp,pageid) {
	getEventInfo(pageid);		// get the data before switching pages
	
	//console.log('got event data');
	var unitids=$('[name=UnitSelectID]:checked',pageid).val().replace(/-/g,'=');	// there may be more than one... do we need multiple logs?  Or have user select which unit to use
	

	//for each of these see if  QE is avail.  If it is, get scouts from it that... are on calendar.   Oh this is yuck
	
	
	$(document).one('pageshow',function() {
		 preload();
	});
	
	 //console.log('changing to QE');
	 changepageurl('/mobile/dashboard/admin/'+logasp+'.asp?QuickEntry=1&' +unitids);
	
}



