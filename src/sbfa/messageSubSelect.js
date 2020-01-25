// Copyright © 10/19/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.


// on dashboard, &UserID=xxxx  is me
var subUnitList=[];
function addRawSubunitMsgSel(data,thisurl,pageid) {
	if(data.match(/default\.asp\?UnitID=(\d+)/)==null) return data;
	var unitID=data.match(/default\.asp\?UnitID=(\d+)/)[1];
	var buttondata=nbody(data);
	var insertpt='<legend class="text-orange"><strong>Select Recipients:</strong></legend>';
	data=data.replace(insertpt,buttondata+'</fieldset><fieldset data-role="controlgroup" style="margin-top: 1em; ">' +insertpt);

	//add button code

	var startfunc=data.indexOf("$('#buttonInsertEvents',");
	var myfunc = '' + mlscript;
	myfunc = myfunc.slice(22).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(pageid)).replace(/UnitID=X/g,'UnitID='+ escapeHTML(unitID));
	var data = data.slice(0,startfunc) + myfunc + '\n'  + data.slice(startfunc);		
	
	
	//put in hidden button
	
	
	//make sure we are selected
	//intercept buttonSubmit\
	//replace buttonsumbit function 
	
	//add new buttonsubmit function

	if(data.match(/\$\('#buttonSubmit', '#Page\d+'\)\.click\(function/) !=null) {
	

	var oldname=data.match(/\$\('#buttonSubmit', '#Page\d+'\)\.click\(function/)[0];
	var newname=oldname.replace(/#buttonSubmit/,'#buttonNewSubmit');
	data=data.replace(/\$\('#buttonSubmit', '#Page\d+'\)\.click\(function/,newname);
	
	var startfunc=data.match(/\$\('#buttonNewSubmit', '#Page\d+'\)\.click\(function/).index;
	
	
	
    data=data.slice(0,startfunc) + "\n$('#buttonSubmit','#Page"+pageid+"').click( function () {\n addMeToSender("+pageid+");\nreturn false;\n});\n" + data.slice(startfunc);
	}
	var startfunc=data.indexOf('</form>');
	
	var newdata='	<div style="margin-top: 1.5em; margin-bottom: 2em; display:none ">\n';
	newdata+='			<input type="submit" value="Send Message" data-theme="g" id="buttonNewSubmit" />\n';
	newdata+='		</div>\n';
	
	
	data=data.slice(0,startfunc) + newdata + data.slice(startfunc);


	var startfunc=data.indexOf('<div id="bccDIV">');
	
	var newdata='	<div id="nameLstDIV">\n';
	newdata+='			<label for="nameLst">Include names in message when BCC is selected</label>\n';
	newdata+='			<input type="checkbox" name="NAMELST" value="1" id="nameLst" data-theme="d" checked="checked" />\n';
	newdata+='		</div>\n';
	
	newdata+='	   <div id="yptDIV">\n';
	newdata+='			<label for="ypt">Include Youth Protection Notice in youth messages</label>\n';
	newdata+='			<input type="checkbox" name="YPT" value="1" id="ypt" data-theme="d" checked="checked" />\n';
	newdata+='		</div>\n';
	
	
	
	
	
	data=data.slice(0,startfunc) + newdata + data.slice(startfunc);

	
	return data;
}

function nbody(data) {
	var stype='';
	var optSubMatch=[];
	//var subUnitList=[];	

// only works for people with calendar info on their message page	
	
	
	var optMatch=data.match(/<option value="[^"]+">[^<]+<\/option>/g);
	if(optMatch == null) {
	  //return '</fieldset><fieldset data-role="controlgroup" style="margin-top: 1em; ">';
		stype='Den/patrol';
	} else {

		for(var i=0;i<optMatch.length;i++) {
			optSubMatch=optMatch[i].match(/<option value="([^"]+)">([^<]+)<\/option>/);
			if(optSubMatch[1].match(/Unit/) == null ) {
			  //subUnitList.push({id:optSubMatch[1], name:optSubMatch[2]});	
			} else {
				if(optSubMatch[2].match(/Pack/) != null) {
					stype="Den";
				}
				if(optSubMatch[2].match(/Troop/) != null) {
					stype="Patrol";
				}
			}
		}	
	
	}
	var newdata='';
	newdata+='				<div style="float: left; text-align: right; " class="addDenPatrol">';
	newdata+='					<a data-role="button" data-theme="d" data-inline="true" data-mini="true" href="#" id="buttonShowDenPatrol">';
	newdata+='						<div style="margin-left: 30px; position: relative; ">';
	newdata+='							<img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/adddenpatrol48.png" style="position: absolute; width: 24px; left: -30px; top: -4px; " />';
	newdata+='							Show '+escapeHTML(stype)+' Selection List';
	newdata+='						</div>';
	newdata+='					</a>';
	newdata+='				</div>';
	newdata+='				<div class="clearRight"></div>';
	newdata+='				</fieldset><fieldset data-role="controlgroup" style="margin-top: 1em; ">';
	newdata+='				<div id="denPatrolDv" style="display:none">';
	var html= divContent(stype,subUnitList);
	newdata +=html;
	newdata+='				</div>';
	return newdata;
}

var subUnitScouts={scoutlist:[],leaderlist:[]};

function mlscript () {
	
	// move the div content building into the raw page
	//var subUnitScouts={scoutlist:[],leaderlist:[]};
	$('#buttonShowDenPatrol', '#PageX').click(function() {
		var UnitID=X;
	
		//getScoutSubUnits(UnitID,subUnitScouts,0);		//when this call is complete, subUnitScouts is ready to be used
		startGetSubunits(UnitID,subUnitScouts,0);		// new 2/27
		return false;
	});	


    subunitClick('#PageX');
  

  
	$('.selectAllSubunits', '#PageX').click(function() {
		if($('li.subunit.checkable.ui-btn-up-d', '#PageX').length == 0) {
			$('li.subunit.checkable.ui-btn-up-e', '#PageX').each(function() {
				//$('div.full-circle', this).remove();
				//$(this).removeClass('ui-btn-up-e').addClass('ui-btn-up-d');	
				$(this).click();
			});
		} else {
			$('li.subunit.checkable.ui-btn-up-d', '#PageX').each(function() {
				//$(this).append('<div class="full-circle"><img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/checkmark256.png"></div>').removeClass('ui-btn-up-d').addClass('ui-btn-up-e');
				$(this).click();
			});
		}
	});

  
}

//subUnitList.push({id:denpatrol, name:name, pop:false, leaders:[],parents:[],scouts:[]});
function subunitClick(pageid) {
 $('.subunit', pageid).click(function() {
	var scoutname;
	var parentname;
	var thispar;
	var parsplit;
	var lsubunit;
	var precheckList=[];
	//var subunitList=[];
	var subunit='';
	if($(this).text().trim().match(/(Pack|Troop|Crew|Ship) \d+ (.+)/) != null) {
		subunit=$(this).text().trim().match(/(Pack|Troop|Crew|Ship) \d+ (.+)/)[2];
	}
	var subunitid=$(this).attr('data-subunitid');
	
	var idx=-1;
	for(idx=0;idx<subUnitList.length;idx++) {
		if (subUnitList[idx].id == subunitid) {
			break;
		}
	}
	
	if(idx==subUnitList.length) {
		alert('can\'t match '+subunit);
		return;
	}
	if($(this).hasClass('ui-btn-up-d')) {
		//item is unchecked
		// alert('add check to this');
		
  		for (var i=0;i<subUnitList[idx].leader.length;i++){
			$('.leader.checkable[data-userid="' + subUnitList[idx].leader[i] + '"]').append('<div class="full-circle"><img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/checkmark256.png"></div>').removeClass('ui-btn-up-d').addClass('ui-btn-up-e');		
		}
  		for (var i=0;i<subUnitList[idx].parent.length;i++){
			$('.parent.checkable[data-userid="' + subUnitList[idx].parent[i] + '"]').append('<div class="full-circle"><img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/checkmark256.png"></div>').removeClass('ui-btn-up-d').addClass('ui-btn-up-e');		
		}
  		for (var i=0;i<subUnitList[idx].scout.length;i++){
			$('.scout.checkable[data-userid="' + subUnitList[idx].scout[i] + '"]').append('<div class="full-circle"><img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/checkmark256.png"></div>').removeClass('ui-btn-up-d').addClass('ui-btn-up-e');		
		}
	 } else {
		 // item is checked
		$('.subunit.checkable.ui-btn-up-e').each( function () {
			//this subunit is checked
			var subid=$(this).attr('data-subunitid');

		
			
			//if(subunit != lsubunit)
				
				for(var i=0;i<subUnitList.length;i++) {
					if( subUnitList[i].id==subid && subid != subunitid) {		// find the array item that is set, but not the one that is being clicked now
						for(var j=0;j<subUnitList[i].leader.length;j++) {
							precheckList.push({who:'leader',id:subUnitList[i].leader[j]});
						}
						for(var j=0;j<subUnitList[i].parent.length;j++) {
							precheckList.push({who:'parent',id:subUnitList[i].parent[j]});
						}
						for(var j=0;j<subUnitList[i].scout.length;j++) {
							precheckList.push({who:'scout',id:subUnitList[i].scout[j]});
						}
					}
				}

		});


		//prechecklist contains any list items that must remain checked, because they are checked due to another subunit check
		//now, go thru all .checkable.ui-btn-up-e , if not in list, uncheck

		//uncheck anything that isn't in pre and is in current idx
		
		var found=false;
		$('.leader.checkable.ui-btn-up-e').each(function () {
			found=false;
			for(var i=0;i<precheckList.length;i++) {
				if($(this).attr('data-userid') == precheckList[i].id && precheckList[i].who=='leader') {
					found=true;
					break;
				}
			}
			if(found==false) {
				for(var i=0;i<subUnitList[idx].leader.length;i++) {
					if($(this).attr('data-userid') ==subUnitList[idx].leader[i] ) {
						$('div.full-circle', this).remove();
						$(this).removeClass('ui-btn-up-e').addClass('ui-btn-up-d');	
						break;
					}
				}					
			}
		});

		$('.parent.checkable.ui-btn-up-e').each(function () {
			found=false;
			for(var i=0;i<precheckList.length;i++) {
				if($(this).attr('data-userid') == precheckList[i].id && precheckList[i].who=='parent') {
					found=true;
					break;
				}
			}
			if(found==false) {
				for(var i=0;i<subUnitList[idx].parent.length;i++) {
					if($(this).attr('data-userid') ==subUnitList[idx].parent[i] ) {
						$('div.full-circle', this).remove();
						$(this).removeClass('ui-btn-up-e').addClass('ui-btn-up-d');	
						break;
					}
				}					
			}
		});
 
 
 		$('.scout.checkable.ui-btn-up-e').each(function () {
			found=false;
			for(var i=0;i<precheckList.length;i++) {
				if($(this).attr('data-userid') == precheckList[i].id && precheckList[i].who=='scout') {
					found=true;
					break;
				}
			}
			if(found==false) {
				for(var i=0;i<subUnitList[idx].scout.length;i++) {
					if($(this).attr('data-userid') ==subUnitList[idx].scout[i] ) {
						$('div.full-circle', this).remove();
						$(this).removeClass('ui-btn-up-e').addClass('ui-btn-up-d');	
						break;
					}
				}					
			}
		});
		 
	 }
 
 }); 	
}


function subunitmark() {
			$('.subunit.checkable').click(function() {
				if ($(this).hasClass('ui-btn-up-d')) {
					$(this).append('<div class="full-circle"><img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/checkmark256.png"></div>').removeClass('ui-btn-up-d').addClass('ui-btn-up-e');
				} else {
					$('div.full-circle', this).remove();
					$(this).removeClass('ui-btn-up-e').addClass('ui-btn-up-d');
				}
			});	
	
}

function divContent(stype,subUnitList) {
var html='';
html+='	<ul data-role="listview" data-inset="true" id="denpatrolUL" style="margin-top: 0; " class="ui-icon-alt">\n';
html+='			<li data-role="list-divider" data-theme="a">\n';
html+='				<div style="float: right; "><a href="#" class="selectAllSubunits">Select All</a></div>\n';
html+=				escapeHTML(stype);
html+='				<div class="clearRight"></div>\n';
html+='			</li>\n';

for(var i=0;i<subUnitList.length;i++) {		
html+='			<li data-theme="d" class="subunit checkable " data-subunitid="'+escapeHTML(subUnitList[i].id)+'">\n';
html+='				<div class="noellipsis" >\n';
html+='					<div style="margin-left: 36px; ">\n';

html+=					subUnitList[i].name;
html+='					</div>\n';
html+='					<div class="clearLeft"></div>\n';
html+='				</div>\n';
html+='			</li>\n';
}
			
html+='	</ul >		\n';

return html;				
}


function slowSubGet(subUnitList) {
var html='';	
for(var i=0;i<subUnitList.length;i++) {
html+='			<li data-theme="d" class="subunit checkable " data-subunitid="'+escapeHTML(subUnitList[i].id)+'">\n';
html+='				<div class="noellipsis" >\n';
html+='					<div style="margin-left: 36px; ">\n';
html+=					escapeHTML(subUnitList[i].name);
html+='					</div>\n';
html+='					<div class="clearLeft"></div>\n';
html+='				</div>\n';
html+='			</li>\n';

}
//add it to the UL
return html;	
}




function startGetSubunits(unitID,subUnitScouts,preset) {
	var unit='';
// get unit list from unit.asp.
// on denpatrol clicks, get if notalready filled, get the selections by getting messages denpatrol	
	
	//if page already has subunits listed just exit
	$.mobile.loading('show', { theme: 'a', text: 'loading...', textonly: false });
	if($('.subunit').length != 0 ) {
		$('#denpatrolUL').empty();
	}
	if($('input[name="UnitID"]:checked').attr('id').match(/\d+/) != null) {
		unit =$('input[name="UnitID"]:checked').attr('id').match(/\d+/)[0];
	}
	var id=$('input[name="UnitID"]:checked').attr('id');
	var unitname=$('label[for="'+id+'"]').text().trim();
	subUnitList=[];
	// get unit - build list of units - then get each unit page to get dens/patrols
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,'',[], startGetSubunits,[unitID,subUnitScouts,preset]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			var denpatrol;
			var name;
			$('a[href*="admin/denpatrol.asp?UnitID="]',this.response).each( function () {
				denpatrol='';
				if($(this).attr('href').match(/(PatrolID|DenID)=\d+/)!= null) {
					denpatrol=$(this).attr('href').match(/(PatrolID|DenID)=\d+/)[0].replace('=','');
				}
				name=unitname+ ' ' +localDataFilter( $(this).text().trim().split('\n')[0].trim(),'','local');
				subUnitList.push({id:denpatrol, name:name, pop:false, leader:[],parent:[],scout:[]});
			});
			var html=slowSubGet(subUnitList);
			
			$('#denpatrolUL').append(html).listview('refresh');

			// add scripts
			subunitClick('');
			subunitmark();
			iterMailSubunitChecks(unitID,subUnitScouts,preset);	// now that we have the subunits defined, iterate through them to capture scoutbook preselectes on the subunit
		}
	};

	
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/unit.asp?UnitID=' + escapeHTML(unitID);

	xhttp.open("GET",url , true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,'',[], startGetSubunits,[unitID,subUnitScouts,preset]); 
	}	
}


function iterMailSubunitChecks(unitID,subUnitScouts,preset) {

	var subunitIdx=-1;
	for(var i = 0; i< subUnitList.length;i++ ) {
		if(subUnitList[i].pop==false) {
			subunitIdx=i;
			break;
		}
	}
	if(subunitIdx==-1) {
		//done collecting info on subunit members
		 $.mobile.loading('hide');
		$('#denPatrolDv').show();

		return;
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,'',[], iterMailSubunitChecks,[unitID,subUnitScouts,preset]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;		
			subUnitList[subunitIdx].pop=true;	// mark this complete
			
			$('.leader.checkable.checked',this.response).each(function () {
				subUnitList[subunitIdx].leader.push($(this).attr('data-userid'));
			})
			$('.parent.checkable.checked',this.response).each(function () {
				subUnitList[subunitIdx].parent.push($(this).attr('data-userid'));
			})
			$('.scout.checkable.checked',this.response).each(function () {
				subUnitList[subunitIdx].scout.push($(this).attr('data-userid'));
			})			
			//setTimeout(function() {
				
				iterMailSubunitChecks(unitID,subUnitScouts,preset)
			//},50);
		}
	};

	var denID=''
	if(subUnitList[subunitIdx].id.match(/DenID(\d+)/) != null) {
		denID=subUnitList[subunitIdx].id.match(/DenID(\d+)/)[1];
	} 
	var patrolID=''
	if(subUnitList[subunitIdx].id.match(/PatrolID(\d+)/) != null) {
		patrolID=subUnitList[subunitIdx].id.match(/PatrolID(\d+)/)[1];
	}	
	
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/messages/default.asp?UnitID='+escapeHTML(unitID)+'&DenID='+escapeHTML(denID)+'&PatrolID='+escapeHTML(patrolID);

	xhttp.open("GET",url , true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,'',[], iterMailSubunitChecks,[unitID,subUnitScouts,preset]);
	}	
}	
	



function addMeToSender(pageid) {
	//get me from dashboard
	
	//clear garbage from sender
	
	//formPost=formPost.replace(/CustomGroupID=[^&]*&/,'').replace(/CustGrpName=[^&]*&/,'');
	

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,'',[], addMeToSender,[pageid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			if(this.response.match(/&UserID=\d+/) != null) {
				var id=this.response.match(/&UserID=(\d+)/)[1];
				//Add to formPost if button not selected
					var me;
					$('li.leader.ui-btn-up-d').each(function () {
						if(id== $(this).attr('data-userid')) {
								me=$(this);
								//$(this).append('<div class="full-circle"><img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/checkmark256.png"></div>').removeClass('ui-btn-up-d').addClass('ui-btn-up-e');
							
						}
					});
					if(me!=undefined) {
						me.append('<div class="full-circle"><img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/checkmark256.png"></div>').removeClass('ui-btn-up-d').addClass('ui-btn-up-e');
					}
					var me;
					$('li.parent.ui-btn-up-d').each(function () {
						if(id== $(this).attr('data-userid')) {
								me=$(this);
								//$(this).append('<div class="full-circle"><img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/checkmark256.png"></div>').removeClass('ui-btn-up-d').addClass('ui-btn-up-e');
							
						}
					});
					if(me!=undefined) {
						me.append('<div class="full-circle"><img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/checkmark256.png"></div>').removeClass('ui-btn-up-d').addClass('ui-btn-up-e');
					}
					var me;					
					$('li.scout.ui-btn-up-d').each(function () {
						if(id== $(this).attr('data-userid')) {
							me=$(this);
								//$(this).append('<div class="full-circle"><img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/checkmark256.png"></div>').removeClass('ui-btn-up-d').addClass('ui-btn-up-e');
										
						}
					});	
					if(me!=undefined) {
						me.append('<div class="full-circle"><img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/checkmark256.png"></div>').removeClass('ui-btn-up-d').addClass('ui-btn-up-e');
					}
					
					
					includeDisclaimer();
					
				$('#buttonNewSubmit','#Page'+ pageid ).click();
			}

			return ;
			
		}
	};
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/';
	xhttp.open("GET",url , true);
	xhttp.responseType="text";
	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,'',[], addMeToSender,[pageid]);
	}	
	
}

//build list of names, unique based on id

function includeDisclaimer() {
	var ev={namestr:'',scoutpresent:false};

//if text is selected vs message, do not include
	if ($('input[name="MessageType"]').val()=='email') {
		getRecipientNames(ev);
		//console.log(ev.namestr,ev.scoutpresent);

		var disclaim='';
		if($('input[name="YPT"]').is(':checked')==true) {
			if(ev.scoutpresent==true) {
				disclaim="Scouts! In keeping with Youth Protection's no one-on-one contact rules, please remember to CC your parents when replying to this message.\n";
				disclaim += "Adults! In keeping with Youth Protection's no one-on-one contact rules, please remember to CC any Scout's parents if you include a Scout in a reply.\n\n";
			}
		}
		if($('input[name="BCC"]').is(':checked')==true) {
			if($('input[name="NAMELST"]').is(':checked')==true) {
				disclaim += 'This message was sent to : ' + ev.namestr;
			}
		}
		if(disclaim != '') {
			var curval=$('textarea[name="Body"]').val();
			$('textarea[name="Body"]').val(curval+'\n\n[i]'+disclaim+'[/i]');
		}
	}
}

function getRecipientNames(res) {
	var fname='';
	var namelist=[];
	var idlist=[];
	$('li.leader.ui-btn-up-e').each(function () {
		fname=$(this).text().trim().split('\n')[0].split(', ');
		if(pushUnique(idlist,$(this).attr('data-userid')) == false) {
			//is unique
			namelist.push(fname[1] + ' ' + fname[0]);
		}
		
	});	
	$('li.parent.ui-btn-up-e').each(function () {
		fname=$(this).text().trim().split('\n')[0].split(', ');
		if(pushUnique(idlist,$(this).attr('data-userid')) == false) {
			//is unique
			namelist.push(fname[1] + ' ' + fname[0]);
		}
	});	
	$('li.scout.ui-btn-up-e').each(function () {
		res.scoutpresent=true;

		fname=$(this).text().trim().split('\n')[0].split(', ');
		if(pushUnique(idlist,$(this).attr('data-userid')) == false) {
			//is unique
			namelist.push(fname[1] + ' ' + fname[0][0] + '.');
			var thisScoutName=fname[1] + ' ' + fname[0];
	
		   $('.positions',this).contents().filter(function () {
			   if($(this).text().trim() != "") {
					var par=$(this).text().trim();
					// have a parent name for this scout
					//Now look through parent list to find the scout name.  When found, verify the parent name also matches.  Then store the parent
					$('li.parent').each(function () {
						if($('.positions',this).text().indexOf(fname[1]) != -1) {
							//This parent has a scout witht he same name.
							var pname=$(this).text().trim().split('\n')[0].split(', ');
							if(pname[1]+ ' ' + pname[0] == par) {
								//we have a match
								if(pushUnique(idlist,$(this).attr('data-userid')) == false) {
									//is unique
									namelist.push(pname[1] + ' ' + pname[0]);									
								}
							}
						}
					
					});	
			   }			   
			   return this.nodeType === Node.TEXT_NODE;
			});


			
		}
	});		
	res.namestr='';		
	for (var i=0; i<namelist.length;i++) {
		if (res.namestr =='') {
			res.namestr=namelist[i];
		} else {
			res.namestr+=', ' + namelist[i];
		}
	}
	
	return;
}
