// Copyright © 10/4/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.
//### schools

/*
the general idea is to display scout name and grade in a table, similar to the Health QE. List current grades.  Have abutton the allows an auto-increment

*/

function addRawSchoolQE(data,pageid,unitID,txtunit) {
	schoolQE=false;
	// Replace heading
	var startfunc = data.indexOf('<span style="margin-left: 5px; ">',1);
	var endfunct = data.indexOf('</h1>',1);				
	
	var newdata = data.slice(0,startfunc);
	newdata += '<span style="margin-left: 5px; ">';
	newdata += '		<a href="#" id="buttonRefresh" class="text">'+escapeHTML(txtunit)+'</a>';
	if(QEPatrol != '') {
		newdata += '		<a id="goToDenPatrol" href="'+escapeHTML('/mobile/dashboard/admin/denpatrol.asp?UnitID='+unitID+'&DenID=&PatrolID='+QEPatrolID)+'" class="text" data-direction="reverse">'+escapeHTML(QEPatrol)+'</a>';
	}
	newdata += '           Record Multiple Scout School Information';
	newdata += '</span>';
	newdata +=  data.slice(endfunct);
	
	data = newdata;

	var startfunc = data.indexOf('<a id="goBack"',1);
	var endfunct = data.indexOf('<img src',startfunc);
	myfunc = '<a href="#" id="buttonRefresh" >';
	var newdata = data.slice(0,startfunc) + myfunc + '\n'  + data.slice(endfunct);
	data = newdata;	
	
	// replace content
	var startfunc = data.indexOf('<div data-role="content">');
	var endfunct = data.indexOf('</div><!-- /content -->');
	var newdata = data.slice(0,startfunc);				
	newdata += setSchoolPageContent(txtunit,'Page'+escapeHTML(pageid));
	newdata +=  data.slice(endfunct);				
	data=newdata;
	
	
	// replace style
	var startfunc = data.indexOf('<style type="text/css">');
	var endfunct = data.indexOf('</style>');
	var newdata = data.slice(0,startfunc);
	newdata += '	<style type="text/css">';
	newdata += '		#Page' + escapeHTML(pageid) +' .ui-select .ui-btn-icon-right .ui-btn-inner	{ padding-left: 10px; padding-right: 35px; }';
	newdata += '		#Page' + escapeHTML(pageid) +' .ui-select .ui-btn-icon-right .ui-icon		{ right: 10px; }';
	newdata += '		#Page' + escapeHTML(pageid) +' #popupDeleteLog								{ max-width: 400px; }';
	newdata += '		#Page' + escapeHTML(pageid) +' .smallText		{ color: gray; margin-top: 15px; }';
	newdata += '		#Page' + escapeHTML(pageid) +' img.imageSmall	{ position: relative; width: 30px; height: 30px; top: -5px; border: 1px solid gray; }';
	newdata += '	</style>';
	newdata +=  data.slice(endfunct);				
	data=newdata;				

	// replace script.  Starsts after <script tag
	var startfunc = data.indexOf('var formPost;');
	var endfunct = data.indexOf('</script>',startfunc);
	var myfunc = '' + grscript;
	myfunc = myfunc.slice(22).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(pageid)).replace(/UnitID=X/g,'UnitID='+ escapeHTML(unitID));
	var newdata = data.slice(0,startfunc) + myfunc + '\n'  + data.slice(endfunct);			
	data=newdata;			
					
	//scoutPermObjList=[];
	return data;
}


function setSchoolPageContent(txtunit,tpageid) {
var newdata;
newdata = '	<div data-role="content">';

newdata += '	<form id="schoolForm">';
newdata += '		<input type="hidden" name="Action" value="Submit" />';
newdata += '		<ul data-role="listview" data-theme="d" data-inset="true" data-count-theme="f" style="margin-top: 0;" class="ui-icon-alt;">';

newdata += '			<li data-role="list-divider" role="heading" data-theme="a">';			
newdata += '			 Quick Entry School Information';
newdata += '			</li>';
			
newdata += '			<li id="scoutsLI" data-theme="d">';

newdata += '					<p class="normalText">Now you can quickly and easily enter or edit Scout School information, and easily increment the Scout Grades for the whole Pack or Troop!</p>';

newdata += '						<legend class="text-orange">';
newdata += '								<strong>Update School Data:</strong>';
newdata += '						</legend>';
newdata += '			</li>';
newdata += '		</ul>';	
newdata += '		<fieldset data-role="controlgroup">';	
//newdata += '			<div>';							

newdata += '					<div class="ui-grid-b" ui-responsive>';
newdata += '						<div class="ui-block-a" style="font-weight: bold; font-size: 16px;line-height:45px; margin-bottom:0;">';	
newdata += '							Scout';
newdata +='            				</div>';		
newdata += '						<div class="ui-block-b" style="font-weight: bold; font-size: 16px; line-height:45px; margin-bottom:0;">';	
newdata += '											School';
newdata +='              			</div>';
newdata += '						<div class="ui-block-c" style="font-weight: bold; font-size: 16px; line-height:45px; margin-bottom:0;">';	
newdata += '											Grade ' ;

										//   a black  b blue c grey d white e yellow f green g red h white no border i blk 
	newdata += '						<div style="float: right; text-align: right;  " >\n';
	newdata += '							<div style="vertical-align:middle; ">';
	newdata += '									<a data-role="button" data-icon="plus" data-theme="c" data-inline="true" data-mini="true" href="#" id="buttonIncrement" style="height:40px; margin-top: -40px;">\n';
	newdata += '										Increment Grades\n';
	newdata += '									</a>\n';
	newdata += '							</div>\n';
	newdata += '						</div>\n';
newdata +='              			</div>';	
for(var i=0;i<scoutSchoolObjList.length;i++){

  //if(scoutSchoolObjList[i].name != "UnitPaylog Account") 
  if(scoutSchoolObjList[i].name.match(/ Account$/) == null) {
	newdata += '					<div class="ui-block-a" style=" height:38px;">';	
//	newdata += '										'+ escapeHTML(scoutSchoolObjList[i].name);
	newdata += '						<input readonly type="text" name="nID'+escapeHTML(scoutSchoolObjList[i].id)+'" id="nID'+escapeHTML(scoutSchoolObjList[i].id)+'" defaultValue="'+ escapeHTML(scoutSchoolObjList[i].name) + '" value="'+ escapeHTML(scoutSchoolObjList[i].name) + '"   >'; //style="font-size: 12px; width: 70%;"

	newdata +='            			</div>';
	newdata += '					<div class="ui-block-b" style="height:38px;" >';	
	newdata += '						<input type="text" name="aID'+escapeHTML(scoutSchoolObjList[i].id)+'" id="aID'+escapeHTML(scoutSchoolObjList[i].id)+'" defaultValue="'+ escapeHTML(scoutSchoolObjList[i].SchoolName) + '" value="'+ escapeHTML(scoutSchoolObjList[i].SchoolName) + '"  >'; //style="font-size: 12px; width: 70%;"
	newdata +='           			</div>';
	newdata += '					<div class="ui-block-c" style=" height:38px;">';	
	newdata += '						<input type="text" name="bID'+escapeHTML(scoutSchoolObjList[i].id)+'" id="bID'+escapeHTML(scoutSchoolObjList[i].id)+'" defaultValue="'+ escapeHTML(scoutSchoolObjList[i].SchoolGrade) + '" value="'+ escapeHTML(scoutSchoolObjList[i].SchoolGrade) + '"  >'; //style="font-size: 12px; width: 70%;"
	newdata +='           			</div>';
  }
}
										
newdata += '					</div>';  // end of grid b
//newdata += '			</div>';												
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


return newdata;


}






function getAccountSchool(unitid,sPage) {
	
	if (scoutSchoolObjListPtr==scoutSchoolObjList.length) {
		
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

		for(i=scoutSchoolObjListPtr;i<scoutSchoolObjList.length;i++){
			if(scoutSchoolObjList[i].update==1) {
				thisScoutID = scoutSchoolObjList[i].id;

				scoutSchoolObjListPtr+=1;
				break;
			}
			scoutSchoolObjListPtr+=1;
		}
		if (thisScoutID=='') {
			setTimeout(function(){ getAccountSchool(unitid,sPage); }, 200);
			return;
		}
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			$('#faOverlay',sPage).hide();
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(getAccountSchool,unitid,sPage);	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
	
			//console.log('get Account responded');
			getProfileSchool(thisScoutID,unitid,sPage);
		}
	};
	


	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/account.asp?ScoutUserID=' + thisScoutID;


	
	xhttp.open("GET",url , true);
	xhttp.responseType="text";

	xhttp.send();
	xhttp.onerror = function() {
		errGenHandle(sPage,genError,[sPage,unitid,'School'],getAccountSchool,[unitid,sPage])
	};
}


function getProfileSchool(thisScoutID,unitid,sPage) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			$('#faOverlay',sPage).hide();
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(getProfileSchool,thisScoutID,unitid,sPage);	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			var formPost=$('#editProfileForm', this.response).serialize();			

			
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
				
			//if the disapprove button is present on this form, attached the approved element to formPost.  It means the Scout was approved prior and we'll keep it that way
			
			if ($('a[href="#"][id="disapproveButton"]').text() != "") {
				formPost = formPost + '&Approved=1';
			}
			formPost=formPost.replace(/SchoolGrade=[^&]*&/,'SchoolGrade='+encodeURIComponent(scoutSchoolObjList[scoutSchoolObjListPtr-1].SchoolGrade) +'&');
			formPost=formPost.replace(/SchoolName=[^&]*&/,'SchoolName='+encodeURIComponent(scoutSchoolObjList[scoutSchoolObjListPtr-1].SchoolName) +'&');
			
			getBSAProfileDataSchool(thisScoutID,formPost,unitid,sPage);
		}
	};


		var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/editprofile.asp?ScoutUserID=' + thisScoutID + '&UnitID='+unitid+'&DenID=&PatrolID=';
 
	xhttp.open("GET",url , true);
	xhttp.responseType="document";

	xhttp.send();
	xhttp.onerror = function() {
		errGenHandle(sPage,genError,[spage,unitid,'School'],getProfileSchool,[thisScoutID,unitid,sPage])
	};
}

// Given all edit profile fields filled in so far, need to get the AkelaUnitID and add it to the field list
// When retrieved and added, call to post the complete form field list
function getBSAProfileDataSchool (thisScoutID,formPost,unitid,sPage) {
var councilid ='';
if(formPost.match(/CouncilID=(\d+)/) != '') {
	councilid = formPost.match(/CouncilID=(\d+)/)[1];
}

	var unitnumber='';
	var unittype='';
	if(formPost.match(/UnitNumber=(\d+)/) != null) {
		 unitnumber =formPost.match(/UnitNumber=(\d+)/)[1];
	}
	if(formPost.match(/UnitTypeID=(\d+)/) != null) {
	     unittypeid =formPost.match(/UnitTypeID=(\d+)/)[1];
	}


	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			$('#faOverlay',spage).hide();
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(getBSAProfileDataSchool ,thisScoutID,formPost,unitid,sPage);	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			// response expected


			// Post it
			postProfileSchool(thisScoutID,formPost,unitid,sPage);			
			
		}
	};


		var url = 'https://' + host + 'scoutbook.com/mobile/includes/ajax.asp?Action=GetDistrictList&CouncilID=' + councilid;

	xhttp.open("GET",url , true);
	xhttp.responseType="text";

	xhttp.send();
	xhttp.onerror = function() {
		errGenHandle(sPage,genError,[sPage,unitid,'School'],getBSAProfileDataSchool ,[thisScoutID,formPost,unitid,sPage]);
	};

}


function postProfileSchool(thisScoutID,formPost,unitid,sPage) {

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			$('#faOverlay',sPage).hide();
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(postProfileSchool,thisScoutID,formPost,unitid,sPage);	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
	
			if (this.response.indexOf('Update successful!') != -1 ) {
				//console.log('completed post');
				//get next scout
				setTimeout(function(){ getAccountSchool(unitid,sPage); }, 200);
			} else {
				var err='';
				var errmsg=this.response.match(/showErrorPopup\(([^\)]+)/);
				if(errmsg != null) {
					 err=errmsg[1].replace(/<strong>|<\/strong>|<p>|<\/p>/g,'');
				}
				genError(sPage,unitid,'School '+err + ' Stopped on ' + getToken(formPost,'FirstName') + ' ' + getToken(formPost,'LastName'));
			}	
		}
	};
	var adultID='';

	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/editprofile.asp?ScoutUserID=' + thisScoutID + '&AdultUserID='+adultID+'&UnitID=' + unitid;
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");

	xhttp.send(formPost);
			
	xhttp.onerror = function() {
		errHandle(postProfileSchool,thisScoutID,formPost,unitid,sPage); 

	};
	
}


function grscript () {
		var formPost;
		//console.log('hescript');
		function pageInit() {
			

			$('#schoolForm', '#PageX').submit(function () {
				$('#buttonSubmit', '#PageX').focus();
				
				$('input[name*="aID"]','#PageX').each( function() {
					var scoutID='';
					if($(this).attr('id').match(/\d+/)!=null) {
						scoutID=$(this).attr('id').match(/\d+/)[0];
					}
					
					if($(this).val() != $(this).attr('defaultValue')) {
						for(var i=0; i< scoutSchoolObjList.length;i++) {
						   if(scoutSchoolObjList[i].id == scoutID){
								scoutSchoolObjList[i].SchoolName=$(this).val();
								scoutSchoolObjList[i].update=1;
						   }
						}
					}
				});					
									
				$('input[name*="bID"]','#PageX').each( function() {
					var scoutID='';
					if($(this).attr('id').match(/\d+/)!=null) {
						scoutID=$(this).attr('id').match(/\d+/)[0];
					}
					
					if($(this).val() != $(this).attr('defaultValue')) {
						for(var i=0; i< scoutSchoolObjList.length;i++) {
						   if(scoutSchoolObjList[i].id == scoutID){
								scoutSchoolObjList[i].SchoolGrade=$(this).val();
								scoutSchoolObjList[i].update=1;
						   }
						}
					}
				});				
		
				// disable all inputs
				$(':input', '#PageX #schoolForm').attr('disabled', true);
				$('#buttonCancel, #buttonSubmit', '#PageX').button('disable');

				$.mobile.loading('show', { theme: 'a', text: 'saving...this can take several minutes for large units', textonly: false });
				setTimeout(function () {submitSForm();}, 200);
				return false;
			});

			$('#buttonIncrement', '#PageX').click(function () {
				//increment grades
				$('input[name*="bID"]','#PageX').each( function() {
					
					if($(this).val() != '') {
						var nv=parseInt($(this).val()) + 1;
						$(this).val(nv);
					}
				});	
				return false;
			});
			
			
			$('#buttonCancel', '#PageX').click(function () {
				
				scoutPermObjList.length=0;
				schoolQE=false;
					
				$.mobile.changePage(
					
						'https://'+host+'scoutbook.com/mobile/dashboard/admin/unit.asp?UnitID=X&DenID=&PatrolID=&Refresh=1',
					
					{
					    allowSamePageTransition: true,
					    transition: 'none',
					    showLoadMsg: true,
					    reloadPage: true
					}
				);					
							

				return false;
			});

			$('#buttonRefresh', '#PageX').click(function () {
				
				
				scoutPermObjList.length=0;
				schoolQE=false;
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
				//See if any of the school values have been changed

				var chg=false;
				var err='';
				$('input[name*="aID"]','#PageX').each( function() {
					if($(this).val() != $(this).attr('defaultValue')) {
						chg=true;
					}

					
				});


				$('input[name*="bID"]','#PageX').each( function() {
					if($(this).val() != $(this).attr('defaultValue')) {
						chg=true;
					}
					if($(this).val() != '') {
						//check format 
						if($(this).val().match(/\d+/) == null) {
							err="Grades must be numeric";
						}
					}
					
				});
				
				
				if(err!= '') {
					alert(err);
					return false;
				}
				if (chg==false) {
					alert('No changes have been found');
				} else {
					$('#schoolForm', '#PageX').submit();
					schoolQE=false;
				}
				
				return false;
			});



		}

		function pageShow() {
			
		}
		
		function submitSForm() {
			var unitid='';
			if($('base')[0].href.match(/\d+/)!=null) {
				unitid= $('base')[0].href.match(/\d+/)[0];
			}
			// reset all LI's to normal color
			$('li[id$=LI]', '#PageX').removeClass('ui-body-e').addClass('ui-btn-up-c');
			//Now we simply go through scoutProfileObjList, look for changes, and post updates.,

			//Get Accounts,profiles, for changed items in scoutSchoolObjList
			scoutSchoolObjListPtr=0;
			setTimeout(function(){ getAccountSchool(unitid,'#PageX'); }, 200);  //process for scouts

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

//export scouts csv 
//BSA Member ID	First Name	Middle Name	Last Name	Suffix	Nickname	Address 1	Address 2	City	State	Zip	Home Phone	Gender	DOB	School Grade	School Name	LDS	Swimming Classification	Swimming Classification Date	Unit Number	Unit Type	Date Joined Boy Scouts	Den Type	Den Number	Date Joined Den	Patrol Name	Date Joined Patrol	Parent 1 Email	Parent 2 Email	Parent 3 Email
//compares to the connections the user has
// issue is if a name matches.
//eg  connections has
// DOE, John   ID xyz
// DOE, John   ID yyz

//but the scouts export csv has names and no scout id association
// ideally there would be a way to match up something else to associate, eg a den or patrol name or a middle name or bsaid or something
// so in order to do so, would need a page SOMEWHERE that has 1st name lastname id and a patrol name.... 
// The Roster page has a patrol name, scout name, and id

/*

	Connections - get name, id
	
	roster - change view
	roster - get name, id, dob
	roster reset view
	
	scout csv get name, dob.



*/
 
// add DOBs to scoutPermObjList

function getDOBs(pageid,unitID) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			$('#faOverlay',pageid).hide();

			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(getDOBs,pageid,unitID);	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			getDOBsFromRoster(pageid,unitID,this.response)
			
		}
	}		
	
	
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID=' + unitID;

	xhttp.open("GET",url , true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		errHandle(getDOBs,unitID);	//server side error - maybe next try will work
	};	
	
}

function getDOBsFromRoster(pageid,unitID,response) {
	var settings;
	var initSettings;
	if($('#showDOB:checked',response).length==1) {
		//dob is showing, add to list directly, no need to reset views
		addDOBs(unitID,response); //added 1/12
		schoolFromCSV(unitID,pageid);
	} else {
		initSettings=$('#customizeScoutRosterForm',response).serialize();
		settings=$('#customizeScoutRosterForm',response).serialize() + '&ShowDOB=1';
		setRosterView(pageid,unitID,settings,getDOBRoster,pageid,unitID,initSettings);
		//schoolFromCSV(unitID);
	}
}

/*
	get the roster.  
	Check if DOB shown.  
	If not shown, 
		post to show.  Then get roster again
    if shown
		capture list of parent connection ids from roster page
		if previously changed to show, post to not show
*/
function setRosterView(pageid,unitID,settings,cbFunc, cbv1,cbv2) {

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			$('#faOverlay',pageid).hide();
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(setRosterView,pageid,unitID,settings,cbFunc, cbv1,cbv2);	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			cbFunc(cbv1, cbv2);
		}
	};
	
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID=' + unitID;
	xhttp.open("POST",url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(settings);
			
	xhttp.onerror = function() {
		errHandle(setRosterView,pageid,unitID,settings,cbFunc, cbv1,cbv2);
	};
}


function getDOBRoster(pageid,unitID,initSettings) {
	var settings='';
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			$('#faOverlay',pageid).hide();
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(getDOBRoster,pageid,unitID,initSettings);	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			addDOBs(unitID,this.response);
			//reset the roster view
			if(initSettings == '') {
				settings=$('#customizeScoutRosterForm').serialize();  // gets current settings from visible page
			} else {
				settings=initSettings;  // not on the roster page, get them from the init settings
			}
			setRosterView(pageid,unitID,settings,schoolFromCSV, unitID,initSettings)
		}
	}		
	
	
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID=' + unitID;

	xhttp.open("GET",url , true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		errHandle(getDOBRoster,pageid,unitID,initSettings);
	};	
}


//parse for DOBs
function addDOBs(unitID,response) {
var id;
var dob;
	$('a[href*="ScoutUserID="]',response).each( function () {
		id='';
		if($(this).attr('href').match(/ScoutUserID=(\d+)/) != null) {
			id=$(this).attr('href').match(/ScoutUserID=(\d+)/)[1];
		}
		if($(this).parent().text().match(/DOB: (\d+\/\d+\/\d+)/) != null) {
			dob=$(this).parent().text().match(/DOB: (\d+\/\d+\/\d+)/)[1];
			
			for(var j=0;j<scoutPermObjList.length;j++) {
				if(scoutPermObjList[j].id == id) {
					scoutPermObjList[j]['DOB'] = dob;
					break;
				}
			}
		}
	});
}

function schoolFromCSV(unitID,pageid) {
	scoutSchoolObjList.length=0;
	var firstname;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			$('#faOverlay',pageid).hide();
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(schoolFromCSV,unitID);	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			
			var evObj={name:'',id:'',SchoolGrade:'',SchoolName:''};
			
			var raw=this.response;
			var res=this.response.trim().split('\n');
			
			var schoolArray=parseCSV(raw);		//gets array of arrays
			
			if(schoolArray.length >1) {
				for(var i=1;i<schoolArray.length;i++) {
					firstname=schoolArray[i][1].trim();
					if(schoolArray[i][1] != '' ) {
						
						if(schoolArray[i][5].trim() != '') {		//use nickname if there is one
							firstname=schoolArray[i][5].trim();
						}
						
						evObj.name=firstname + ' ' + schoolArray[i][3].trim();	
						evObj.SchoolName=schoolArray[i][15].trim();	
						evObj.SchoolGrade=schoolArray[i][14].trim();
						var found=false;
						//what is the scout id?
						evObj.id=i;  //temp #
						for(var j=0;j<scoutPermObjList.length;j++) {
							// name match - in qa this won't work.  We need to get a roster and look for dob
							
							
							if(scoutPermObjList[j].name.toLowerCase() == (schoolArray[i][3].trim() + ', ' + firstname).toLowerCase()  ) {
								// and compare DOBs
								if(Date.parse(scoutPermObjList[j].DOB) ==Date.parse(schoolArray[i][13]) ) {
									evObj.id=scoutPermObjList[j].id;
									found=true;
									break;
								}
							}
						}
						
						if(found==true) {
							scoutSchoolObjList.push(JSON.parse(JSON.stringify(evObj)));	
						}						
					}					
			
				}			
			} else {
				alert('There was a problem reading the scout data, cannot complete');
				$.mobile.loading('hide');
				$('#faOverlay',pageid).hide();
				return;
			}
			
			scoutPermObjList=[];
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


	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/unit.asp?UnitID='+escapeHTML(unitID)+'&Action=ExportScouts';
	xhttp.open("GET",url , true);
	xhttp.responseType="text";

	xhttp.send();
	xhttp.onerror = function() {
		errHandle(schoolFromCSV,unitID);
	};
}