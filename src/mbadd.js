// Copyright © 10/4/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.
function addRawAddMB(data,pageid,unitID) {
	// Modify text descriptions
	data=data.replace(/Quick Entry for Merit Badges/g,'Quick Entry for Starting Merit Badges');
   data=data.replace('Merit Badges Earned:','Merit Badges to Start:');
   data=data.replace('Now you can quickly and easily enter merit badges for a single Scout or your <strong>entire troop</strong>.  Perfect for recording summer camp achievements.','Now you can quickly and easily add merit badges for a single Scout or your <strong>entire troop</strong>. Perfect for preparing for summer camp or a Merit Badge University.');
   data=data.replace('Date Completed','Initial Unit Leader Signature Date');
	
	// Remove Checkboxes, add my own
   //<input type="text" name="DateCompleted" id="dateCompleted" class="calendar" />
   
   
   
   
	var startfunc = data.indexOf('<input type="text" name="DateCompleted" id="dateCompleted" class="calendar" />',1);
	var endfunct = data.indexOf("</fieldset>",startfunc);		
	var newdata = data.slice(0,startfunc) + '<input type="text" name="DateCompleted" id="dateCompleted" class="calendar" />\n</div>\n<fieldset data-role="controlgroup">\n<legend></legend>\n';
	if(inviteMBCperm == true) {
		newdata +=					'<label for="invite">Invite Merit Badge Counselor</label>\n';
		newdata +=					'<input type="checkbox" id="invite" name="Invite" value="1" data-mini="true" data-theme="d" />\n';			
	}
	newdata += data.slice(endfunct);
	data=newdata;
	
	// remove links
	var startfunc = data.indexOf('<li data-role="list-divider" data-theme="a">Other Quick Entry Links</li>');
	var endfunct = data.indexOf("</ul>",startfunc);		
	data = data.slice(0,startfunc) + data.slice(endfunct);

	// remove comments
	var startfunc = data.indexOf('Notes/Comments:');
	var endfunct = data.indexOf('<a href="#" data-role="button"',startfunc);
	var newdata = data.slice(0,startfunc) +'</label>\n'  + data.slice(endfunct);
	data=newdata;
	
	//update scripts
	// replace script.  Starsts after <script tag
	var startfunc = data.indexOf('var formPost;');
	var endfunct = data.indexOf('</script>',startfunc);
	var myfunc = '' + setmbADDscript;
	myfunc = myfunc.slice(27).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(pageid)).replace(/UnitID=X/g,'UnitID='+ escapeHTML(unitID));
	var newdata = data.slice(0,startfunc) + myfunc + '\n'  + data.slice(endfunct);			
	data=newdata;				
	//add modification notice
	startfunc = data.indexOf('<div style="margin-top: 6px;">&copy;');
	var newdata = data.slice(0,startfunc);
	newdata += '<div style="margin-top: 6px;">This page was modified by the Feature Assistant Extension/Add-on and is not supported by BSA</div>';	
	data=newdata + data.slice(startfunc); 
	
	
	//hide unit paylog
	
var sf=data.indexOf('UnitPaylog Account');
if(sf != -1) {
	var bd=data.indexOf('<input type="checkbox"',sf-400);
	var ed=data.indexOf('</label>',sf);
	data=data.slice(0,bd) + data.slice(ed+8);
}
	
	return data;
}

/*


var sf=data.indexOf('UnitPaylog Account');
if(sf != -1) {
	var bd=data.indexOf('<input type="checkbox"',sf-400);
	var ed=data.indexOf('</label>',sf);
	data=data.slice(0,bd) + data.slice(ed+8);
}



<input type="checkbox" name="ScoutUserID" id="scoutUserIDdddd" data-theme="d" value="dddd"  data-canapprove="1" ><label for="scoutUserIDdddd"><div style="display: inline-block; width: 30px; margin-right: 5px; "><img src="https://d3hdyt7ugiz6do.cloudfront.net/mobile/images/icons/scoutorange48.png" class="imageSmall" /></div>
											UnitPaylog Account
										</label>





*/
/*

$('input[name="ScoutUserID"]').each( function () {
	var id= $(this).attr('id');
	if($('label[for="'+id+'"]').text().trim()== 'UnitPaylog Account') {
		$('#'+id+').hide();
	}
});

*/
//addmb
// This script is copied into the page itself and is executed within the page context.
// This is necessary to initialize the css and controls properly
// It replaces the full <script> in the page
function setmbADDscript() {
		var formPost;

		var UnitID=X;

		
		function pageShow() {
	
	$('.calendar', '#PageX').each(function() {
		var id = $(this).attr('id');
		$(this).width('75%').before('<img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/calendar50.png" style="float: right; width: 25px; margin-top: 5px; cursor: pointer; " class="calendarIcon" />');
		$($(this).closest('form'), '#PageX').prepend('<input type="hidden" id="hidden_' + escapeHTML(id) + '" value="' + escapeHTML($(this).val()) + '" />');
	});

	$('input[id^=hidden_]:hidden', '#PageX').mobiscroll().calendar({
		theme: 'scoutbook',
		buttons: ['set', 'clear', 'cancel'],
		mode: 'scroller',
		display: 'bottom',
		controls: ['calendar', 'date'],
		closeOnSelect: true,
		rows: 7,
		onClose: function(valueText) {
			var id = $(this).attr('id');
			id = id.replace('hidden_', '');
			$('#' + id).val(valueText).trigger('change');
		}
	});
			
	$('.calendarIcon', '#PageX').on('click', function() {
		var id = $(this).next('input').attr('id');
		$('#hidden_' + id).mobiscroll('show');
	});
	
			}

		function pageInit() {
			

			$(':checkbox[name=ScoutUserID]').click(function() {
				// see if there is only one Scout checked
				if($('input:checkbox[name=ScoutUserID]:checked').length == 1) {
					var scoutUserID = $('input:checkbox[name=ScoutUserID]:checked').val();
					getMeritBadges(scoutUserID);
				} else {
					// uncheck all disabled
					$('input:checkbox[name=MeritBadgeID][disabled]').checkboxradio('enable').prop('checked', false).checkboxradio('refresh');
				}
			});

			$('#buttonSubmit', '#PageX').click(function () {
				
				if($('input[name="ScoutUserID"]:checked','#PageX').length==0) {
					showErrorPopup('Check at least one Scout');
					return false;
				}
				
				if($('input[name="MeritBadgeID"]:checked:enabled','#PageX').length==0) {
					showErrorPopup('Check at least one Merit Badge');
					return false;
				}
				
				$('#quickForm', '#PageX').submit();
				return false;
			});

			$('#quickForm', '#PageX').submit(function () {
				formPost = $('#quickForm', '#PageX').serialize();

				scoutUserIDMB.length=0;
				scoutUserIDMBmbc.length=0;
				scoutUserIDMBname.length=0;
				
				$('input[name="ScoutUserID"]:checked','#PageX').each(function () {
					scoutUserIDMBname.push($('label[for="'+$(this).attr('id') +'"]').text().trim());
					scoutUserIDMB.push(this.value);
					scoutUserIDMBmbc.push(this.value);
					//alert(this.value);
				});				
					
				if (scoutUserIDMB.length==0) {
					alert('Select at least one Scout');
					return false;
				}
				
				addMBID.length=0;
				$('input[name="MeritBadgeID"]:checked:enabled','#PageX').each(function () {
					var mb = {mbid: '', name: ''};
					mb.mbid=this.value;
					mb.name=$(this).parent().text();
					addMBID.push(JSON.parse(JSON.stringify(mb)));
					
					//alert(this.value);
				});		
				if (addMBID.length==0) {
					alert('Select at least one Merit Badge');
					scoutUserIDMB.length=0;
					return false;
				}
				
				// disable all inputs
				$('#buttonSubmit', '#PageX #quickForm').addClass('ui-disabled');

				$.mobile.loading('show', { theme: 'a', text: 'saving...this may take several minutes depending on the number of Scouts and badges selected', textonly: false });
				setTimeout(function () {submitQuickForm();}, 200);
				return false;
			});

			$('#notesHelp', '#PageX').click(function () {
				$('#notesPopup', '#PageX').popup({ tolerance: '10,30', transition: 'pop', positionTo: 'origin', history: false }).popup('open');
				return false;
			});

		}

		// Given a list of scouts, takes one from the list to begin processing.  When no more scouts left, returns to unit page.
		// When there is a scout to process, gets count of mbs and calls to add mb for the scout
		function submitQuickForm() {

			// formPost has all scoutIDs and badges in it
			// when complete enable all fields
			
			//console.log('enter submitQuickForm');
			//alert('enter submitQuickForm');
			if (scoutUserIDMB.length==0) {
				// Done.... not really.  Now lets add MBCs if selected to invite...
				if($('[name="Invite"]:checked').val() != undefined) {
					// don't display checkbox
					//Should they be able to do this?  I'm guessing if the MBC list is visible its ok.  For safety lets test from account that shouldn't have access...
					
					addMBIDindex=addMBID.length-1;
					//console.log('Set addMBIDindex='+addMBIDindex);
				    setTimeout(function () {selectMBC();},200);
					return;
				}
				
				$('#buttonSubmit', '#PageX #quickForm').removeClass('ui-disabled');
				$.mobile.loading('hide'); // go to
				$.mobile.changePage(
						'/mobile/dashboard/admin/unit.asp?UnitID=' + UnitID,
					{
					    allowSamePageTransition: true,
					    transition: 'none',
					    showLoadMsg: true,
					    reloadPage: true
					}
				);					
				return;
			}
			
			var thisScout=scoutUserIDMB.shift();
			

			addMBIDindex=addMBID.length-1;
			//console.log('set mb index to '+addMBIDindex + ' and shifted scout from scoutUserIDMB -scout=' + thisScout);
			postAdd(thisScout);
		}
		/*Goes through each MB. 
			Builds MBC list.  Allows selection of MBC
				Goes through each scout one at a time.
					Looks to see if MBC is already connected.  If connected, modify connection to add MBC and MB
						If not connected sends invite*/
		
		function selectMBC() {
			
			mbclist.length=0;
			getMBClist(0,1,UnitID);  // async call, doesn't return.  After call,
						
		}

		// Posts a request to add a mb for the given scout.  Each time thru this function, it looks at the next MB until no more to add for the scout, then
		// calls back to get the next scout
		// after adding badge, looks to see if user requested to leader sign it.  If not requested, calls itself to add next badge.
		// otherwise, calls to begin add leader signature date process
		function postAdd(thisScout) {
			
			//console.log('enter postAdd for scout ' +thisScout + ' and addMBIndex=' +addMBIDindex);
			if (addMBIDindex < 0) {
				//console.log('exit du to addMBIndex');
				submitQuickForm();
				return;
			}
			
			var thisMBid = addMBID[addMBIDindex].mbid;
			//addMBIDindex-=1;
			
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status != 200) {
					errStatusHandle(this.status,mbAddError,[],  postAdd,[thisScout]);
				}
				if (this.readyState == 4 && this.status == 200) {
					resetLogoutTimer(url);
					servErrCnt=0;
					if($(this.response).text().match(' has already started this merit badge') != -1) {
						//console.log('postAdd Response  Scout '+thisScout+' Badge already started ' + thisMBid);
					}
					//
					if ($('#dateCompleted').val() != '') {
						//console.log('MB '+ thisMBid + ' Leader Approval date Request populated on form ' + $('#dateCompleted').val() + ' call getScoutPatrol to add approval');
						//if the date field has data in it, otherwise, return
						 setTimeout(function(){ getScoutPatrol(thisScout,thisMBid); }, 200);
						return;
					} else {
						// just get next mb
						//console.log('MB '+ thisMBid + ' Leader Approval not requested date empty on form');
						addMBIDindex-=1;
						if(addMBIDindex < 0) {
						   // no badges left - WHAT HERE GET NEXT SCOUT
						   //console.log('no badges left, call submitQuickForm');
						   setTimeout( function() {submitQuickForm();},200);
						   return;
						}
						//console.log('call postAdd again for this scout for the next badge..index=' +addMBIDindex);
						 setTimeout(function(){ postAdd(thisScout); }, 200);
						return;
					}
				}
			};
			var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/advancement/startmeritbadge2.asp?ScoutUserID='+thisScout+'&Action=AddMeritBadge&AddMeritBadgeID='+thisMBid;

			xhttp.open("GET",url , true);
			xhttp.responseType="document";

			xhttp.send();
			xhttp.onerror = function() {
				errStatusHandle(500,mbAddError,[],  postAdd,[thisScout]);
			};
		}
		
		// need to get the scout patrol to learn about the badge.  Get the patrol ID, then call for get mb info
		function getScoutPatrol(thisScout,thisMBid) {
			
			
			//console.log('enter getScoutPatrol');
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status != 200) {
					errStatusHandle(this.status,mbAddError,[],  getScoutPatrol,[thisScout,thisMBid]);
				}
				if (this.readyState == 4 && this.status == 200) {
					resetLogoutTimer(url);
					servErrCnt=0;
					var patrolid='';
			
					if ($('a[id="goToDenPatrol"]',this.response).attr('href') != undefined) {
						if ($('a[id="goToDenPatrol"]',this.response).attr('href').match(/PatrolID=(\d+)/) != null) {
							var patrolid=$('a[id="goToDenPatrol"]',this.response).attr('href').match(/PatrolID=(\d+)/)[1];
						} 
					}
					//var patrolid=$('a[id="goToDenPatrol"]',this.response).attr('href').match(/PatrolID=(\d+)/)[1];
					//console.log('got patrol '+patrolid+' calling findMBstat');
					
					 setTimeout(function(){ findMBstat(thisScout,patrolid,thisMBid); }, 200);
					return;
					
				}
			};
			//https://www.scoutbook.com/mobile/dashboard/admin/account.asp?ScoutUserID=xxxxx
			var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/account.asp?ScoutUserID='+thisScout;

			xhttp.open("GET",url , true);
			xhttp.responseType="document";

			xhttp.send();
			xhttp.onerror = function() {
				errStatusHandle(500,mbAddError,[],  getScoutPatrol,[thisScout,thisMBid]);
			};
		}
		
		// Determine if the merit badge has already been signed or not.  If it was already signed, call to work on the next badge
		// If not signed, obtain the version of the merit badge, then call to sign it
		function findMBstat(thisScout,patrolid,thisMBid) {
			
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status != 200) {
					errStatusHandle(this.status,mbAddError,[],  findMBstat,[thisScout,patrolid,thisMBid]);
				}
				if (this.readyState == 4 && this.status == 200) {
					resetLogoutTimer(url);
					servErrCnt=0;
					
					if ( $('a[href*="/mobile/dashboard/admin/advancement/meritbadge.asp?MeritBadgeID='+thisMBid+'&"]',this.response).parent().text().indexOf('Unit leader signature') != -1) {
						// Already approved
						//console.log('already approved ');
						addMBIDindex-=1;						
						if(addMBIDindex < 0) {
						   // no badges left - WHAT HERE GET NEXT SCOUT
						   //console.log('no badges left, call submitQuickForm');
						   setTimeout( function() {submitQuickForm();}, 200);
						   return;
						}		
						//console.log('get the next badge - call postAdd');
						 setTimeout(function(){ postAdd(thisScout); }, 200);
						return;
					} else {
						// needs approval
						//MeritBadgeVersionID=25
						var mbvermatch=$('a[href*="/mobile/dashboard/admin/advancement/meritbadge.asp?MeritBadgeID='+thisMBid+'&"]',this.response).attr('href').match(/MeritBadgeVersionID=(\d+)/);
						if(mbvermatch != null) {
						   var mbver=mbvermatch[1];
						    setTimeout(function(){ leaderApprove(thisScout,mbver,thisMBid);}, 200);
						} else {
							//console.log('cant get version');
							mbAddError();
						}
						return;
					}			
				}
			};

			
			var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/advancement/default.asp?ScoutUserID='+thisScout+'&UnitID='+UnitID+'&DenID=&PatrolID='+patrolid;

			xhttp.open("GET",url , true);
			xhttp.responseType="document";

			xhttp.send();
			xhttp.onerror = function() {
				errStatusHandle(500,mbAddError,[],  findMBstat,[thisScout,patrolid,thisMBid]);
			};
		}
		
		// Add the Leader Signed date to the merit badge
		function leaderApprove(thisScout,mbver,thisMBid) {
			// Need to first GET the merit badge to determine its version;  that will also reveal if it is already signed
			// can also test signing on different dates nope, will overwrite date
				
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (this.readyState == 4 && this.status != 200) {
					errStatusHandle(this.status,mbAddError,[],  leaderApprove,[thisScout,mbver,thisMBid]);
				}
				if (this.readyState == 4 && this.status == 200) {
					resetLogoutTimer(url);
					servErrCnt=0;
					// Next mb
						addMBIDindex-=1;						
						if(addMBIDindex < 0) {
						   // no badges left - WHAT HERE GET NEXT SCOUT
						   //console.log('no badges left, call submitQuickForm');
						   setTimeout(function () {submitQuickForm();}, 200);
						   return;
						}						
					
					 setTimeout(function(){ postAdd(thisScout); }, 200);
				}
			};
			
			var signDate = encodeURIComponent($('#dateCompleted').val());
			var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/advancement/meritbadge.asp?MeritBadgeID='+thisMBid+'&MeritBadgeVersionID='+mbver+'&ScoutUserID='+thisScout;
			xhttp.open("POST", url, true);
			xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
			xhttp.send('Action=BlueCardApproval&LeaderSignedDate='+signDate);
			
			xhttp.onerror =function() {
				errStatusHandle(500,mbAddError,[],  leaderApprove,[thisScout,mbver,thisMBid]);
			};
		}
		
		// standard function from page
		function getMeritBadges(scoutUserID) {
			procScriptGetMeritBadges(scoutUserID);

			/*
			var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/advancement/meritbadgequickentry.asp?Action=GetMeritBadges&ScoutUserID=' + scoutUserID;
			$.ajax({
				url: url,
				type: 'GET',
				dataType: 'script',
				
				error: function (xhr, ajaxOptions, thrownError) {
					location.href = '/mobile/500.asp?Error=' + escape('url: ' + url + ' postData: ' + formPost + ' Status: ' + xhr.status + ' thrownError: ' + thrownError + ' responseText: ' + xhr.responseText.substring(0, 400));
				}
	
			});
			
			*/
		}
		// standard function from page
		
		
		function showErrorPopup(msg) {
			$('#errorPopupContent', '#PageX').html(msg);
			$('#errorPopup', '#PageX').popup({ tolerance: '10,40', transition: 'pop', positionTo: 'window', history: false }).popup('open');
		}

		function escapeHTML(str) { 
			var strr = str+'';
			return strr.replace(/[&"'<>]/g, (m) => escapeHTML.replacements[m]); 
		}
		escapeHTML.replacements = { "&": "&amp;", '"': "&quot;", "'": "&#39;", "<": "&lt;", ">": "&gt;" };
		
		
		// display error message and go back to unit page
		function mbAddError() {
			$.mobile.loading('hide');
			alert('Error adding Merit Badges, discontinuing updates.  Not all Scouts/Merit Badges Selected are updated');
				$('#buttonCancel, #buttonSubmit').button('enable');
				
			$.mobile.changePage(
					'/mobile/dashboard/admin/unit.asp?UnitID=' + UnitID,
				{
					allowSamePageTransition: true,
					transition: 'none',
					showLoadMsg: true,
					reloadPage: true
				}
		);	
}		
		
		
}


function procScriptGetMeritBadges(scoutUserID) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,mbAddError,[],  procScriptGetMeritBadges,[scoutUserID]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;

			// response will have multiple jquery statements like below.  Because it is "UNSAFE" to execute them directly, even though it is from a TUSTED DOMAIN
			//"$('#meritBadgeID25').prop('checked', true).checkboxradio('disable').checkboxradio('refresh')".match(/\$\('#meritBadgeID(\d+)'\).prop\('checked', (true|false)\).checkboxradio\('(disable|enable)'\)/) 
			//So lets make the reviewers happy ;-)
			var arglist=this.responseText.split(';');
			for(var i=0;i<arglist.length;i++) {
				if(arglist[i].match(/\$\('#meritBadgeID(\d+)'\).prop\('checked', (true|false)\).checkboxradio\('(disable|enable)'\)/) != null) {
					var arg=arglist[i].match(/\$\('#meritBadgeID(\d+)'\).prop\('checked', (true|false)\).checkboxradio\('(disable|enable)'\)/);
					$('#meritBadgeID'+arg[1]).prop('checked', arg[2]).checkboxradio(arg[3]).checkboxradio('refresh');
				}
			}
			
		}
	};

	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/advancement/meritbadgequickentry.asp?Action=GetMeritBadges&ScoutUserID=' + scoutUserID;
	
	xhttp.open("GET", url, true);
	xhttp.responseType="text";
	xhttp.send();

	xhttp.onerror =function() {
		errStatusHandle(this.status,mbAddError,[],  procScriptGetMeritBadges,[scoutUserID]);
	}		
	
}



// calls the callback function when complete
//addmb
function userPosition(cb,txtunit) {
	//console.log('userPosition ' + cb);
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,mbAddError,[],  userPosition,[cb,txtunit]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			// should also verify for the proper unit
			$('a[href*="position.asp?UserPositionID="]',this.response).each(function () {
				var rtxt=$(this).text();
				if(rtxt.match(/[a-zA-Z]{3} [\d]+, [\d]+ -/)  == null) {
					if(rtxt.match(txtunit) != null) {
						if(rtxt.match('Committee Chair') != null) {inviteMBCperm=true;  }
						if(rtxt.match('Scoutmaster') != null) { inviteMBCperm=true; }
						if(rtxt.match('Chartered Organization Representative') != null) {inviteMBCperm=true;  }
						if(rtxt.match('Committee Advancement Coordinator') != null) {inviteMBCperm=true;  }				
						if(rtxt.match('Troop Admin') != null) {inviteMBCperm=true;  }
						//if(rtxt.match('Treasurer') != null) {myPosition.treasurer=true;  }
					}
				}
			});
			 setTimeout(function () {addMbPos(cb);}, 200);
		}
	};
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/positions.asp';
	xhttp.open("GET", url, true);
	xhttp.responseType="document";
	xhttp.send();

	xhttp.onerror =function() {
		errStatusHandle(500,mbAddError,[],  userPosition,[cb,txtunit]);
		
/*		if (servErrCnt > maxErr) {
			 $.mobile.loading('hide');
			alert('Halted due to excessive Server errors -');
			$.mobile.changePage(
					'/mobile/dashboard/',
				{
					allowSamePageTransition: true,
					transition: 'none',
					showLoadMsg: true,
					reloadPage: true
				}
			);
			return;
		 }
		 servErrCnt++;
		setTimeout(function() { 
			userPosition(cb,txtunit);  
		},1000);	//reset 				
		*/
	}			
		
}


//addmb
function procMbAddQuickEntryItem(unitID,denID,patrolID,txtunit) {
		var utype;
		var pOpt;
	if (patrolID != '' || denID != '') {
	  utype="denpatrol";
	  pOpt = '&PatrolID=' + patrolID;
	} else {
		utype="unit";
		pOpt='';
	}
	//alert('MB Add stub');
	addMBFlag='modifyContent';

	//userPosition("addMbPos('" +unitID + pOpt + "')");
	userPosition(unitID + pOpt,txtunit);
	
}

//addmb
function addMbPos(unitpatrol) {
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/advancement/meritbadgequickentry.asp?UnitID=' + unitpatrol;
	//console.log('addMbPos ' + url);

	$.mobile.changePage(
			url,
		{
			allowSamePageTransition: true,
			transition: 'none',
			showLoadMsg: true,
			reloadPage: true
		}
	);	
	
}
