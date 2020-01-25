// Copyright © 10/4/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.
//### health

function addRawHealthQE(data,pageid,unitID,txtunit) {
	healthQE=false;
	// Replace heading
	var startfunc = data.indexOf('<span style="margin-left: 5px; ">',1);
	var endfunct = data.indexOf('</h1>',1);				
	
	var newdata = data.slice(0,startfunc);
	newdata += '<span style="margin-left: 5px; ">';
	newdata += '		<a href="#" id="buttonRefresh" class="text">'+escapeHTML(txtunit)+'</a>';
	if(QEPatrol != '') {
		newdata += '		<a id="goToDenPatrol" href="'+escapeHTML('/mobile/dashboard/admin/denpatrol.asp?UnitID='+unitID+'&DenID=&PatrolID='+QEPatrolID)+'" class="text" data-direction="reverse">'+escapeHTML(QEPatrol)+'</a>';
	}
	newdata += '           Record Multiple Scout Health Record Dates';
	newdata += '</span>';
	newdata +=  data.slice(endfunct);
	
	data = newdata;

	var startfunc = data.indexOf('<a id="goBack"',1);
	var endfunct = data.indexOf('<img src',startfunc);
	//myfunc = '<a id="goBack" href="/mobile/dashboard/admin/unit.asp?UnitID='+unitID+'" data-transition="slide" data-direction="reverse";>';
	myfunc = '<a href="#" id="buttonRefresh" >';
	var newdata = data.slice(0,startfunc) + myfunc + '\n'  + data.slice(endfunct);
	data = newdata;	
	
	// replace content
	var startfunc = data.indexOf('<div data-role="content">');
	var endfunct = data.indexOf('</div><!-- /content -->');
	var newdata = data.slice(0,startfunc);				
	newdata += setHealthPageContent(txtunit,'Page'+escapeHTML(escapeHTML(pageid)));
	newdata +=  data.slice(endfunct);				
	data=newdata;
	
	
	// replace style
	var startfunc = data.indexOf('<style type="text/css">');
	var endfunct = data.indexOf('</style>');
	var newdata = data.slice(0,startfunc);
	newdata += '	<style type="text/css">';
	newdata += '		#Page' + escapeHTML(escapeHTML(pageid)) +' .ui-select .ui-btn-icon-right .ui-btn-inner	{ padding-left: 10px; padding-right: 35px; }';
	newdata += '		#Page' + escapeHTML(escapeHTML(pageid)) +' .ui-select .ui-btn-icon-right .ui-icon		{ right: 10px; }';
	newdata += '		#Page' + escapeHTML(escapeHTML(pageid)) +' #popupDeleteLog								{ max-width: 400px; }';
	newdata += '		#Page' + escapeHTML(escapeHTML(pageid)) +' .smallText		{ color: gray; margin-top: 15px; }';
	newdata += '		#Page' + escapeHTML(escapeHTML(pageid)) +' img.imageSmall	{ position: relative; width: 30px; height: 30px; top: -5px; border: 1px solid gray; }';
	newdata += '	</style>';
	newdata +=  data.slice(endfunct);				
	data=newdata;				

	// replace script.  Starsts after <script tag
	var startfunc = data.indexOf('var formPost;');
	var endfunct = data.indexOf('</script>',startfunc);
	var myfunc = '' + hescript;
	myfunc = myfunc.slice(22).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(escapeHTML(pageid))).replace(/UnitID=X/g,'UnitID='+ escapeHTML(unitID));
	var newdata = data.slice(0,startfunc) + myfunc + '\n'  + data.slice(endfunct);			
	data=newdata;			

	//startfunc = data.indexOf('<div style="margin-top: 6px;">&copy;');
	//var newdata = data.slice(0,startfunc);
	//newdata += '<div style="margin-top: 6px;">Feature Assistant Active</div>';	
	//newdata += '<div style="margin-top: 6px;">This page was produced by the Feature Assistant Extension/Add-on and is not supported by BSA</div>';	
	//data=newdata + data.slice(startfunc);				
	
	scoutPermObjList=[];
	//scoutProfileObjList=[];
	return data;
}


function setHealthPageContent(txtunit,tpageid) {
var newdata;
newdata = '	<div data-role="content">';
//newdata += '	<form id="healthForm" method="post" action="health.asp">';
newdata += '	<form id="healthForm">';
newdata += '		<input type="hidden" name="Action" value="Submit" />';
newdata += '		<ul data-role="listview" data-theme="d" data-inset="true" data-count-theme="f" style="margin-top: 0;" class="ui-icon-alt;">';

newdata += '			<li data-role="list-divider" role="heading" data-theme="a">';			
newdata += '			 Quick Entry Health Record Dates';
newdata += '			</li>';
			
newdata += '			<li id="scoutsLI" data-theme="d">';
//newdata += '				<div>';
newdata += '					<p class="normalText">Now you can quickly and easily enter the Health Record Dates for the whole Pack or Troop!</p>';

//newdata += '					<div style="margin-top: 1.5em; ">';

newdata += '							<legend class="text-orange">';
newdata += '								<strong>Choose Scout(s):</strong>';
newdata += '							</legend>';
newdata += '			</li>';
newdata += '		</ul>';	
newdata += '		<fieldset data-role="controlgroup">';	
newdata += '			<div>';							

newdata += '									<div class="ui-grid-b ui-responsive">';
newdata += '										<div class="ui-block-a" style="font-weight: bold; font-size: 16px;line-height:45px;">';	
newdata += '											Scout';
newdata +='            						     	</div>';		
newdata += '										<div class="ui-block-b" style="font-weight: bold; font-size: 16px; line-height:45px;">';	
newdata += '											A/B Record';
newdata +='              						   	</div>';
newdata += '										<div class="ui-block-c" style="font-weight: bold; font-size: 16px;line-height:45px;">';	
newdata += '											C Record';
newdata +='               						  	</div>';	


var adultHdr=false;
for(var i=0;i<scoutHealthObjList.length;i++){
	if(scoutHealthObjList[i].group == "adult") {
		if(adultHdr==false) {
			newdata += '									<div class="ui-block-a" style="font-weight: bold; font-size: 16px; line-height:45px; height:48px;">';	//line-height:45px;font-size: 16px;
			newdata += '										Leaders';
			newdata +='            						 	</div>';
			newdata += '										<div class="ui-block-b" style="font-weight: bold; font-size: 16px; line-height:45px;height:48px;">';	
			newdata += '											A/B Record';
			newdata +='              						   	</div>';
			newdata += '										<div class="ui-block-c" style="font-weight: bold; font-size: 16px;line-height:45px;height:48px;">';	
			newdata += '											C Record';
			newdata +='               						  	</div>';	

			adultHdr=true;
		}
	}
    if(scoutHealthObjList[i].name.match(/^Account,/) == null) {

	newdata += '									<div class="ui-block-a" style=" height:38px;">';	//line-height:45px;font-size: 16px;
	newdata += '										<input readonly type="text" name="nID'+escapeHTML(scoutHealthObjList[i].id)+'" id="nID'+escapeHTML(scoutHealthObjList[i].id)+'" defaultValue="'+ escapeHTML(scoutHealthObjList[i].name) + '" value="'+ escapeHTML(scoutHealthObjList[i].name) + '"   >'; //style="font-size: 12px; width: 70%;"

	newdata +='            						 	</div>';
	newdata += '									<div class="ui-block-b" style=" height:38px;">';	//style="font-size: 12px;"	//newdata+=  '											<label for="aID' + scoutPermObjList[i].id + '" ><div style="margin-left: 40px; ">' +scoutPermObjList[i].name+ '</div></label>';
	newdata += '										<input type="text" name="aID'+escapeHTML(scoutHealthObjList[i].id)+'" id="aID'+escapeHTML(scoutHealthObjList[i].id)+'" defaultValue="'+ escapeHTML(scoutHealthObjList[i].AnnualHealthRecordABDate) + '" value="'+ escapeHTML(scoutHealthObjList[i].AnnualHealthRecordABDate) + '"  class="calendar" style="margin-top: 0;">'; //style="font-size: 12px; width: 70%;"
	newdata +='           						  	</div>';
	newdata += '									<div class="ui-block-c" style=" height:38px;">';	//style="font-size: 12px;"
	newdata += '											<input type="text" name="bID'+escapeHTML(scoutHealthObjList[i].id)+'" id="bID'+escapeHTML(scoutHealthObjList[i].id)+'" defaultValue="'+ escapeHTML(scoutHealthObjList[i].AnnualHealthRecordCDate) + '" value="'+ escapeHTML(scoutHealthObjList[i].AnnualHealthRecordCDate) + '" class="calendar"  >';  //style="font-size: 12px; width: 70%;"
	newdata +='          						   	</div>';
	}
}
										
newdata += '									</div>';
newdata += '			</div>';												
newdata += '		</fieldset>';

newdata += '		<ul data-role="listview" data-theme="d" data-inset="true" data-count-theme="f" style="margin-top: 0;" class="ui-icon-alt;">';
			
newdata += '			<li class="ui-body ui-body-b">';
newdata += '				<div class="ui-grid-a ui-responsive">';
newdata += '					<div class="ui-block-a"><input type="submit" data-role="button" value="Update" data-theme="g" id="buttonSubmit" /></div>';
newdata += '					<div class="ui-block-b"><input type="button" data-role="button" value="Cancel" data-theme="d" id="buttonCancel" /></div>';
newdata += '			    </div>';
newdata += '			</li>	';
						
			

			
newdata += '		</ul>';
newdata += '		</form>';

		
newdata += '	<div data-role="popup" id="errorPopup" data-overlay-theme="a" class="ui-content" data-theme="e" data-transition="fade">';
newdata += '		<a href="#" id="closePopupButton" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>';
newdata += '		<div id="errorPopupIcon"></div>';
newdata += '		<div id="errorPopupContent"></div>';
newdata += '		<div class="clearRight"></div>';
newdata += '	</div>';

newdata += '		<div id="footer" align="center">';

newdata += logoutWarningPageContent(tpageid);			
		newdata += '<div style="margin-top: 6px;">This page was produced by the Feature Assistant Extension/Add-on and is not supported by BSA</div>';		
newdata += '	<div style="margin-top: 6px;">&copy; '+escapeHTML(cyear())+'- Boy Scouts of America &bull; <a href="/mobile/help/privacy.asp">Privacy</a></div>';
newdata += '	<div><a href="/" data-ajax="false"><img src="https://d1kn0x9vzr5n76.cloudfront.net/mobile/images/scoutbookbsalogo400.png" width="200"></a></div>';
	
newdata += '		</div>';

//newdata += '	</div><!-- /content -->';

return newdata;


}




function checkAdultAdmin(pageid,unitID,troop) {
	//determine if a Unit Admin
	var unittype='';
	if(troop.match(/([^ ]+) \d/) != null) {
		unittype=troop.match(/([^ ]+) \d/)[1];
	}
	
	var poslist=[];
	var evObj ={position: '',permission: false};
	evObj.position = unittype + ' Admin';
	poslist.push(JSON.parse(JSON.stringify(evObj)));
	
	adminPositions(pageid,troop,poslist,getAdultHealth, [unitID,troop,pageid],genError,[pageid,unitID,'Health','']);	
		//reportBuilderHealth(unitID);
}


function getAdultHealth(unitID,unitname,pageid,poslist) {
	// gets a table of scout and leader names with health form dates from the report builder
		
	if(poslist[0].permission == true) {
		// can use adult names, too
		// Set the roster sort, and get adult list from roster, then go to Report builder

		setRosterNameSort(pageid,unitID,rosterSortSet,[unitID,unitname,pageid],genError,[pageid,unitID,'Health',''])

		//reportBuilderHealth(unitID,true,leaderIDlst);
		// Get adult IDs from Roster
	} else {
		reportBuilderHealth(unitID,false,[]);
	}
}

function rosterSortSet(unitID,unitname,pageid) {
	getAdultListFromRoster(unitID,reportBuilderHealth,[pageid,unitID,true,''],genError,[pageid,unitID,'Health','']);
	
}


//leaderIDlist has adult names and ids
function reportBuilderHealth(pageid,unitID,adult,leaderIDlist) {

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[pageid,unitID,'Health'], reportBuilderHealth,[pageid,unitID,adult,leaderIDlist]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;

			var evObj={name:'',id:'',AnnualHealthRecordABDate:'',AnnualHealthRecordCDate:''};
			var scoutlist=[];
			var leaderlist=[];
			var hdr=0;
			$('#scoutRoster tbody tr',this.response).each( function () {
				if(hdr==1) {
					evObj.name=$('td',this).eq(0).text().trim();
					evObj.AnnualHealthRecordABDate=$('td',this).eq(1).text().trim().replace(' Expired','');	
					evObj.AnnualHealthRecordCDate=$('td',this).eq(2).text().trim().replace(' Expired','');
					scoutlist.push(JSON.parse(JSON.stringify(evObj)));
					
				}
				hdr=1;
			});	

			//match names and put dates in 
			
			for(var i =0; i< scoutlist.length;i++) {
				var evObj={name:'',id: '' ,AnnualHealthRecordABDate:'',AnnualHealthRecordCDate:'', update: 0,group:'scout'};

				var scoutname=scoutlist[i].name.toUpperCase();
				for(var j=0;j<scoutPermObjList.length;j++) {
					if (scoutname==scoutPermObjList[j].name.toUpperCase()) {
						//we have a match, save the id
						evObj.name=scoutlist[i].name;
						evObj.id=scoutPermObjList[j].id;
						evObj.AnnualHealthRecordABDate=scoutlist[i].AnnualHealthRecordABDate;
						evObj.AnnualHealthRecordCDate=scoutlist[i].AnnualHealthRecordCDate;
						scoutHealthObjList.push(JSON.parse(JSON.stringify(evObj)));
						break;
					}
				}
			
			}
		
			if(adult == true) {
				var hdr=0;
				$('#leaders tbody tr',this.response).each( function () {
					if(hdr==1) {
						evObj.name=$('td',this).eq(0).text().trim();
						evObj.AnnualHealthRecordABDate=$('td',this).eq(1).text().trim().replace(' Expired','');	
						evObj.AnnualHealthRecordCDate=$('td',this).eq(2).text().trim().replace(' Expired','');
						leaderlist.push(JSON.parse(JSON.stringify(evObj)));
					}
					hdr=1;
				});
				// need leaderlist of names to match IDs
				
				//match names and put dates in 
				
				for(var i =0; i< leaderlist.length;i++) {
					var evObj={name:'',id: '' ,AnnualHealthRecordABDate:'',AnnualHealthRecordCDate:'', update: 0,group:'adult'};

					var scoutname=leaderlist[i].name.toUpperCase();
					for(var j=0;j<leaderIDlist.length;j++) {
						if (scoutname==leaderIDlist[j].name.toUpperCase()) {
							//we have a match, save the id
							evObj.name=leaderlist[i].name;
							evObj.id=leaderIDlist[j].id;
							evObj.AnnualHealthRecordABDate=leaderlist[i].AnnualHealthRecordABDate;
							evObj.AnnualHealthRecordCDate=leaderlist[i].AnnualHealthRecordCDate;
							scoutHealthObjList.push(JSON.parse(JSON.stringify(evObj)));
							break;
						}
					}
				
				}				
				
			}
			

			
			$.mobile.loading('hide');
			$.mobile.changePage(
				'/mobile/dashboard/admin/unit.asp?UnitID=' + unitID,
			{
				allowSamePageTransition: true,
				transition: 'none',
				showLoadMsg: true,
				reloadPage: true
			}
			);		
			return;			
			
			
			
			
		}
	};


	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/reports/roster.asp?Action=Print&DenID=&PatrolID=&UnitID=';
	var formPost = 'UnitID='+escapeHTML(unitID)+'&ShowLeaders=1&ShowScouts=1&ShowMedicalDates=1&Title=';
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.responseType="document";
	xhttp.send(formPost);
			
	xhttp.onerror = function() {
		errStatusHandle(500,genError,[pageid,unitID,'Health'], reportBuilderHealth,[pageid,unitID,adult,leaderIDlist]);
	};
}

//https://reports.scoutbook.com/vim2/webscript/output/sbreports.aspx?Method=ExecuteScriptSet&ScriptSetCode=SBRosterBuilderReport&ScriptCode=ReportPresentation&IsReportPreview=1&ReportID=65017
//function setupScoutProfileObjList(unitid,sPage) {
	
	
//	getProfile3(unitid,sPage);
//}






function getAccountHealth(unitid,sPage) {
	
	if (scoutHealthObjListPtr==scoutHealthObjList.length) {
		
		$.mobile.loading('hide');
		$.mobile.changePage(
			'/mobile/dashboard/admin/unit.asp?UnitID=' + unitid,
		{
			allowSamePageTransition: true,
			transition: 'none',
			showLoadMsg: true,
			reloadPage: true
		}
		);		
		return;
	} else {
		

		$.mobile.loading('show', { theme: 'a', text: 'loading...this can take several minutes for large units', textonly: false });
		var thisScoutID='';
		var thisGroup='';
		for(i=scoutHealthObjListPtr;i<scoutHealthObjList.length;i++){
			if(scoutHealthObjList[i].update==1) {
				thisScoutID = scoutHealthObjList[i].id;
				thisGroup=scoutHealthObjList[i].group;
				scoutHealthObjListPtr+=1;
				break;
			}
			scoutHealthObjListPtr+=1;
		}
		if (thisScoutID=='') {
			setTimeout(function(){ getAccountHealth(unitid,sPage); }, 200);
			return;
		}
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[sPage,unitid,'Health'], getAccountHealth,[unitid,sPage]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
	
			if(thisGroup=='scout') {
				if($('#scoutUserID',this.response).length==0) {
					healthErr(sPage,unitid,'Error retrieving Scout account');
					return;
				}
			} else {
				if($('.contactInfo',this.response).length==0) {
					healthErr(sPage,unitid,'Error retrieving Adult account');
					return;				
				}				
			}
	
			//console.log('get Account responded');
			getProfileHealth(thisScoutID,thisGroup,unitid,sPage);
		}
	};
	
	//console.log('getting ' + thisScoutID);
	//https://www.scoutbook.com/mobile/dashboard/admin/account.asp?ScoutUserID=xxxxx
	if(thisGroup=='scout') {
		var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/account.asp?ScoutUserID=' + thisScoutID;
	} else {
		var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/rosteredit.asp?AdultUserID='+thisScoutID+'&UnitID='+unitid;
	}

	
	xhttp.open("GET",url , true);
	xhttp.responseType="text";

	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,genError,[sPage,unitid,'Health'], getAccountHealth,[unitid,sPage]);
	};
}


function healthErr(pageid,unitid,msg) {
	 $.mobile.loading('hide');
	alert(msg);
	genError(pageid,unitid,'Health');
	return;	
}


function getProfileHealth(thisScoutID,thisGroup,unitid,sPage) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[sPage,unitid,'Health'], getProfileHealth,[thisScoutID,thisGroup,unitid,sPage]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			var formPost=$('#editProfileForm', this.response).serialize();			

			if(formPost == '') {
					healthErr(spage,unitid,'Error retrieving Profile');
					return;					
			}
			
			if(thisGroup=='scout') {
				var patrolid='';
				var denid='';
				if ($('a[id="goToDenPatrol"]',this.response).attr('href') != undefined) {
					if ($('a[id="goToDenPatrol"]',this.response).attr('href').match(/PatrolID=(\d+)/) != null) {
						var patrolid=$('a[id="goToDenPatrol"]',this.response).attr('href').match(/PatrolID=(\d+)/)[1];
					} 
					
					
					
					if ($('a[id="goToDenPatrol"]',this.response).attr('href').match(/DenID=(\d+)/) != null) {
						var denid=$('a[id="goToDenPatrol"]',this.response).attr('href').match(/DenID=(\d+)/)[1];
					} 
				}
				formPost = formPost.replace(/PatrolID=[^&]*/,'PatrolID='+patrolid);
				formPost = formPost.replace(/DenID=[^&]*/,'DenID='+denid);
			}		
			//if the disapprove button is present on this form, attached the approved element to formPost.  It means the Scout was approved prior and we'll keep it that way
			
			if ($('a[href="#"][id="disapproveButton"]',this.response).text() != "") {		// added this.response 2/28
				formPost = formPost + '&Approved=1';
			}
			formPost=formPost.replace(/AnnualHealthRecordABDate=[^&]*&/,'AnnualHealthRecordABDate='+encodeURIComponent(scoutHealthObjList[scoutHealthObjListPtr-1].AnnualHealthRecordABDate) +'&');
			formPost=formPost.replace(/AnnualHealthRecordCDate=[^&]*&/,'AnnualHealthRecordCDate='+encodeURIComponent(scoutHealthObjList[scoutHealthObjListPtr-1].AnnualHealthRecordCDate) +'&');
			
			
			/*var councilid = formPost.match(/CouncilID=(\d+)/)[1];
			if(thisGroup=='scout') {
				var unitnumber='';
				var unittype='';
				if(formPost.match(/UnitNumber=(\d+)/) != null) {
					 unitnumber =formPost.match(/UnitNumber=(\d+)/)[1];
				}
				if(formPost.match(/UnitTypeID=(\d+)/) != null) {
					 unittypeid =formPost.match(/UnitTypeID=(\d+)/)[1];
				}
			}	*/		
			
			postProfileHealth(thisScoutID,thisGroup,formPost,unitid,sPage);
			
			//getBSAprofileDataHealth(thisScoutID,thisGroup,formPost,unitid,sPage);
		}
	};

	if(thisGroup=='scout') {
		var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/editprofile.asp?ScoutUserID=' + thisScoutID + '&UnitID='+unitid+'&DenID=&PatrolID=';
	} else {
		var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/editprofile.asp?UnitID='+unitid+'&DenID=&PatrolID=&AdultUserID=' +thisScoutID;
	}
	xhttp.open("GET",url , true);
	xhttp.responseType="document";

	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,genError,[sPage,unitid,'Health'], getProfileHealth,[thisScoutID,thisGroup,unitid,sPage]);
	};
}


function errStatusHandle(status,errfunc,errargs,retryfunc,retryargs) {
	var pageid='';
		$('#faOverlay').hide();
		if (status > 399  && status < 500) {
			$.mobile.loading('hide');
			
			alert('Error: '+ status);  //page not found etc.  This is unrecoverable
			if(errfunc != '') {
				window[errfunc.name].apply(null,errargs);
			}
			return;
		}
		if (status > 499) {
			errGenHandle(pageid,errfunc,errargs,retryfunc,retryargs);	//server side error - maybe next try will work
			return;
		}	
}
function postProfileHealth(thisScoutID,thisGroup,formPost,unitid,sPage) {

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[sPage,unitid,'Health'],postProfileHealth,[thisScoutID,thisGroup,formPost,unitid,sPage]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
	
			if (this.response.indexOf('Update successful!') != -1 ) {
				//console.log('completed post');
				//get next scout
				setTimeout(function(){ getAccountHealth(unitid,sPage); }, 200);
			} else {
				var err='';
				var errmsg=this.response.match(/showErrorPopup\(([^\)]+)/);
				if(errmsg != null) {
					 err=errmsg[1].replace(/<strong>|<\/strong>|<p>|<\/p>/g,'');
				}
				healthErr(sPage,unitid,'Error posting Profile: ' +err  + ' Stopped on ' + getToken(formPost,'FirstName') + ' ' + getToken(formPost,'LastName'));

				return;	
			}	
		}
	};
	var adultID='';
	if(thisGroup=='adult') {
		adultID=thisScoutID;
		thisScoutID='';
	}
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/editprofile.asp?ScoutUserID=' + thisScoutID + '&AdultUserID='+adultID+'&UnitID=' + unitid;
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formPost);
			
	xhttp.onerror = function() {
		errStatusHandle(500,genError,[sPage,unitid,'Health'],postProfileHealth,[thisScoutID,thisGroup,formPost,unitid,sPage]);
	};
	
}


// pass in an object list of positions  poslist obj1,obj2,obj3...  example obj = {position: 'Committee Chair', permission: false }
// pass in function to call with response
// pass in function when an error occurs
// For each position, check to see if there is a matching position, if it is in the same unit, and if it is still open
//
function adminPositions(pageid,unitName,poslist,cbfunc, cbargs, errFunc,errargs) {

	var cbv1=cbargs[0];
	var cbv2=cbargs[1];
	var cbv3=cbargs[2];
	
	var errv1=errargs[0];
	var errv2=errargs[1];
	var errv3=errargs[2];
		
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {

		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,errFunc,[errv1,errv2,errv3],adminPositions,[pageid,unitName,poslist,cbfunc, cbargs,errFunc,errargs]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;

			// should also verify for the proper unit
			$('a[href*="position.asp?UserPositionID="]',this.response).each(function () {
				var rtxt=localDataFilter($(this).text(),'','local');
				for(var i=0;i<poslist.length;i++) {
					//verify green shield - that position is approved
					if( $('img[src*="icons/securityapproved"]',this).length >0) {
						// verify date is started but not complete
						if(rtxt.match(/[a-zA-Z]{3} [\d]+, [\d]+ -/)  == null) {		
							if(rtxt.match(unitName) != null) {
								if(rtxt.match(poslist[i].position) != null) {poslist[i].permission=true;  }
							}
						}
					}
				}
				//if(rtxt.match(/[a-zA-Z]{3} [\d]+, [\d]+ -/)  == null) {
				//	if(rtxt.match('Committee Chair') != null) {inviteMBCperm=true;  }
				//	if(rtxt.match('Scoutmaster') != null) { inviteMBCperm=true; }
				//	if(rtxt.match('Chartered Organization Representative') != null) {inviteMBCperm=true;  }
				//	if(rtxt.match('Committee Advancement Coordinator') != null) {inviteMBCperm=true;  }				
				//	if(rtxt.match('Troop Admin') != null) {inviteMBCperm=true;  }
				//}
				
			});
			 setTimeout(function () {cbfunc(cbv1,cbv2,cbv3,poslist);}, 200);
		}
	};
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/positions.asp';
	xhttp.open("GET", url, true);
	xhttp.responseType="document";
	xhttp.send();

	xhttp.onerror =function() {
		errStatusHandle(500,errFunc,[errv1,errv2,errv3],adminPositions,[pageid,unitName,poslist,cbfunc, cbargs,errFunc,errargs]);
	};
		
}

//want last name first


function setRosterNameSort(pageid,unitID,cbFunc,cbargs,errFunc,errargs) {

	var cbv1=cbargs[0];
	var cbv2=cbargs[1];
	var cbv3=cbargs[2];
	
	var errv1=errargs[0];
	var errv2=errargs[1];
	var errv3=errargs[2];


//Action=CustomizeLeaderRoster&SortLeaderRoster=LastName
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,errFunc,errargs,setRosterNameSort,[pageid,unitID,cbFunc,cbargs,errFunc,errargs]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			
			if(this.response.match(/mobile_refreshPage/) == null) {			//added 2/28
				// error posting
				$.mobile.loading('hide');
				errFunc(errv1,errv2,errv3);
			}
			cbFunc(cbv1,cbv2,cbv3);
		}
	};
	
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID=' + unitID;
	xhttp.open("POST",url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send('Action=CustomizeLeaderRoster&SortLeaderRoster=LastName');
			
	xhttp.onerror = function() {
		errStatusHandle(this.status,errFunc,[errv1,errv2,errv3],setRosterNameSort,[pageid,unitID,cbFunc,cbargs,errFunc,errargs]);
	};
}

function getAdultListFromRoster(unitID,cbFunc,cbargs,errFunc,errargs) {

	var cbv1=cbargs[0];
	var cbv2=cbargs[1];
	var cbv3=cbargs[2];
	
	var errv1=errargs[0];
	var errv2=errargs[1];
	var errv3=errargs[2];

	var adultLst=[];
	var evObj={name:'',id:'',img:''};

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,errFunc,[errv1,errv2,errv3], getAdultListFromRoster,[unitID,cbFunc,cbargs,errFunc,errargs]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			//get adultlist
			$('a[href*="AdultUserID="]',this.response).each(function () { 
				evObj.name = $(this).text().trim();
				evObj.id='';
				if($(this).attr('href').match(/AdultUserID=(\d+)/) != null) {
					evObj.id=$(this).attr('href').match(/AdultUserID=(\d+)/)[1];
				}
				evObj.img=$(this).parent().prev().find('img').attr('src');
				adultLst.push(JSON.parse(JSON.stringify(evObj)));
			});
			cbFunc(cbv1,cbv2,adultLst);
		}


		
/*
			$('a[href*="AdultUserID="]').each(function () { 
				console.log( $(this).text().trim());
				console.log($(this).attr('href').match(/AdultUserID=(\d+)/)[1]);

			});

*/		
		
		
/*		if (this.readyState == 4 && this.status != 200 && this.status == 500) {
			 if (servErrCnt > maxErr) {
				 $.mobile.loading('hide');
				errFunc(errv1,errv2,errv3);
				alert('Halted due to excessive Server errors');
				return;
			 }
			 servErrCnt++;
			 //try again
		}
*/

	};
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID=' + unitID;

	xhttp.open("GET",url , true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(this.status,errFunc,[errv1,errv2,errv3], getAdultListFromRoster,[unitID,cbFunc,cbargs,errFunc,errargs]);
	};
}



function hescript () {
		var formPost;
		function pageInit() {
			
			$('#healthForm', '#PageX').submit(function () {
				$('#buttonSubmit', '#PageX').focus();
				
				$('input[name*="aID"]','#PageX').each( function() {
					var scoutID='';
					if($(this).attr('id').match(/\d+/)!=null) {
						scoutID=$(this).attr('id').match(/\d+/)[0];
					
						if($(this).val() != $(this).attr('defaultValue')) {
							for(var i=0; i< scoutHealthObjList.length;i++) {
							   if(scoutHealthObjList[i].id == scoutID){
									//scoutHealthObjList[i].AnnualHealthRecordABDate=encodeURIComponent($(this).val());
									scoutHealthObjList[i].AnnualHealthRecordABDate=$(this).val();
									scoutHealthObjList[i].update=1;
							   }
							}
						}
					}
				});					
				
				$('input[name*="bID"]','#PageX').each( function() {
					if($(this).attr('id').match(/\d+/)!=null) {
						var scoutID=$(this).attr('id').match(/\d+/)[0];
						
						if($(this).val() != $(this).attr('defaultValue')) {
							for(var i=0; i< scoutHealthObjList.length;i++) {
							   if(scoutHealthObjList[i].id == scoutID){
									//scoutHealthObjList[i].AnnualHealthRecordCDate=encodeURIComponent($(this).val());
									scoutHealthObjList[i].AnnualHealthRecordCDate=$(this).val();
									scoutHealthObjList[i].update=1;
							   }
							}
						}
					}
				});						
				
				
		
				// disable all inputs
				$(':input', '#PageX #healthForm').attr('disabled', true);
				$('#buttonCancel, #buttonSubmit', '#PageX').button('disable');

				$.mobile.loading('show', { theme: 'a', text: 'saving...this can take several minutes for large units', textonly: false });
				setTimeout(function () {submitSForm();}, 200);
				return false;
			});

			$('#buttonCancel', '#PageX').click(function () {
				
				scoutPermObjList.length=0;
				healthQE=false;
					
				$.mobile.changePage(
					
						'https://'+host+'scoutbook.com/mobile/dashboard/admin/unit.asp?UnitID=X&DenID=&PatrolID=&Refresh=1',
					
					{
					    allowSamePageTransition: true,
					    transition: 'none',
					    showLoadMsg: true,
					    reloadPage: true
					}
				);					
							
					
					//$.mobile.changePage('/mobile/dashboard/admin/unit.asp?UnitID=X');

				return false;
			});

			$('#buttonRefresh', '#PageX').click(function () {
				
				
				scoutPermObjList.length=0;
				healthQE=false;
				$.mobile.loading('hide');
				$.mobile.changePage(
					
						'https://'+host+'scoutbook.com/mobile/dashboard/admin/unit.asp?UnitID=X&Refresh=1',
					
					{
					    allowSamePageTransition: true,
					    transition: 'none',
					    showLoadMsg: true,
					    reloadPage: true
					}
				);					
	
				//return false;
			});		
			
			$('#buttonSubmit', '#PageX').click(function () {
				//See if any of the date values have been changed

				var chg=false;
				var err='';
				$('input[name*="aID"]','#PageX').each( function() {
					//var aid=$(this).attr('id');
					//console.log(aid.match(/\d+/)[0], $(this).val(), $(this).attr('defaultValue'));
					if($(this).val() != $(this).attr('defaultValue')) {
						chg=true;
					}
					if($(this).val() != '') {
						//check format xx/xx/xxxx
						if($(this).val().match(/\d+\/\d+\/\d{4}/) == null) {
							err="Date Formats must be xx/xx/xxxx";
						}
					}
					
				});
				$('input[name*="bID"]','#PageX').each( function() {
					//var aid=$(this).attr('id');
					//console.log(aid.match(/\d+/)[0], $(this).val(), $(this).attr('defaultValue'));
					if($(this).val() != $(this).attr('defaultValue')) {
						chg=true;
					}
					if($(this).val() != '') {
						if($(this).val().match(/\d+\/\d+\/\d{4}/) == null) {
							err="Date Formats must be xx/xx/xxxx";
						}
					}
				});				
				
				if(err!= '') {
					showErrorPopup(err);
					return false;
				}
				if (chg==false) {
					showErrorPopup('No changes have been found');
				} else {
					$('#healthForm', '#PageX').submit();
					healthQE=false;
				}
				
				return false;
			});



		}

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
		
		function submitSForm() {
			var unitid='';
			if($('base')[0].href.match(/\d+/) != null) {
				 unitid= $('base')[0].href.match(/\d+/)[0];
				// reset all LI's to normal color
				$('li[id$=LI]', '#PageX').removeClass('ui-body-e').addClass('ui-btn-up-c');
								

				//Now we simply go through scoutProfileObjList, look for changes, and post updates.,

				//setTimeout(function(){ getProfile3(unitid,'#PageX'); }, 200);
				//Get Accounts,profiles, for changed items in scoutHealthObjList
				scoutHealthObjListPtr=0;
				setTimeout(function(){ getAccountHealth(unitid,'#PageX'); }, 200);  //process for scouts
			} else {
				return false;
			}
		}

		function showErrorPopup(msg) {
			$('#errorPopupContent', '#PageX').html(msg);
			$('#errorPopup', '#PageX').popup({ tolerance: '10,40', transition: 'pop', positionTo: 'window', history: false }).popup('open');
		}
		function escapeHTML(str) { 
			var strr = str+'';
			return strr.replace(/[&"'<>]/g, (m) => escapeHTML.replacements[m]); }
		escapeHTML.replacements = { "&": "&amp;", '"': "&quot;", "'": "&#39;", "<": "&lt;", ">": "&gt;" };
		
}

