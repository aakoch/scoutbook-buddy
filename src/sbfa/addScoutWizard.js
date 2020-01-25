// Copyright © 10/4/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.

var addScWiz=false;



function addRawRegistrationScreenButton(data,pageid,unitID){
	addScWiz=false;
	return data;

	var startfunc = data.indexOf('<div style="float: right; display: inline-block; ">');
	var menuopt='';
	
	menuopt += '		<div style="float: right; display: inline-block; ">\n';
	menuopt += '			<a data-role="button" data-maxusers="" data-inline="true" data-mini="true" href="#" id="addScoutnFamily" >\n';
	menuopt += '			<div style="margin-left: 30px; position: relative; " id="buttonAddScout">\n';
	menuopt += '				<img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/addscoutorange48.png" style="position: absolute; width: 24px; left: -30px; top: -6px; " />\n';
	menuopt += '				Add Scout and Family Wizard\n';
	menuopt += '			</div></a>\n';
	menuopt += '		</div>\n';
							
	var newdata = data.slice(0,startfunc) + menuopt + data.slice(startfunc);
	data=newdata;			
	
	var startfunc = data.indexOf("$('#buttonRemoveScout',");

    var myfunc=awscript + '';
	myfunc = myfunc.slice(22).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(escapeHTML(pageid))).replace(/UnitID=X/g,'UnitID='+ escapeHTML(unitID));
	var newdata = data.slice(0,startfunc) + myfunc + '\n'  + data.slice(startfunc);			
	data=newdata;		
	
	
	
	
return data;	
}

function awscript() {
			$('#addScoutnFamily', '#PageX').click(function () {
				var UnitID=X;
			    buildDenPatrolList(UnitID);
				return false;
			});
}			

function addRawScPage(data,pageid,unitID,txtunit) {
	var startfunc;
	var endfunct;
	var newdata;
	
	// Replace heading
	startfunc = data.indexOf('<span style="margin-left: 5px; ">',1);
	endfunct = data.indexOf('</h1>',1);				
	
	newdata = data.slice(0,startfunc);
	newdata += '<span style="margin-left: 5px; ">';
	newdata += '		<a href="#" id="buttonRefresh" class="text">'+escapeHTML(txtunit)+'</a>';
	if(QEPatrol != '') {
		newdata += '		<a id="goToDenPatrol" href="'+escapeHTML('/mobile/dashboard/admin/denpatrol.asp?UnitID='+unitID+'&DenID=&PatrolID='+QEPatrolID)+'" class="text" data-direction="reverse">'+escapeHTML(QEPatrol)+'</a>';
	}
	newdata += '          New Scout Setup Wizard';
	newdata += '</span>';
	newdata +=  data.slice(endfunct);
	
	data = newdata;
	
	
	startfunc = data.indexOf('<a id="goBack"',1);
	endfunct = data.indexOf('<img src',startfunc);
	myfunc = '<a href="#" id="buttonRefresh" >';
	newdata = data.slice(0,startfunc) + myfunc + '\n'  + data.slice(endfunct);
	data = newdata;				
	
	
	
	
	
	// replace content
	startfunc = data.indexOf('<div data-role="content">');
	endfunct = data.indexOf('</div><!-- /content -->');
	newdata = data.slice(0,startfunc);				
	newdata += setScoutWizPageContent(txtunit,'Page'+escapeHTML(escapeHTML(pageid)));
	newdata +=  data.slice(endfunct);				
	data=newdata;
	
	
	// replace style
	startfunc = data.indexOf('<style type="text/css">');
	endfunct = data.indexOf('</style>');
	newdata = data.slice(0,startfunc);
	newdata += '	<style type="text/css">\n';
	newdata += '		#Page' + escapeHTML(escapeHTML(pageid)) +' .ui-select .ui-btn-icon-right .ui-btn-inner	{ padding-left: 10px; padding-right: 35px; }\n';
	newdata += '		#Page' + escapeHTML(escapeHTML(pageid)) +' .ui-select .ui-btn-icon-right .ui-icon		{ right: 10px; }\n';
	newdata += '		#Page' + escapeHTML(escapeHTML(pageid)) +' #popupDeleteLog								{ max-width: 400px; }\n';
	newdata += '		#Page' + escapeHTML(escapeHTML(pageid)) +' .smallText		{ color: gray; margin-top: 15px; }\n';
	newdata += '		#Page' + escapeHTML(escapeHTML(pageid)) +' img.imageSmall	{ position: relative; width: 30px; height: 30px; top: -5px; border: 1px solid gray; }\n';
	newdata += '		#Page' + escapeHTML(escapeHTML(pageid)) +' div.ui-input-text { margin-top: 0px; padding-top:0px; "box-shadow": "rgba(0, 0, 0, 0.2) 0px 0px 0px 1px inset"}\n';	
	newdata += '		#Page' + escapeHTML(escapeHTML(pageid)) +' div.ui-btn-shadow { border: 0;}\n';	
	newdata += '	</style>\n';
	newdata +=  data.slice(endfunct);				
	data=newdata;				

	// replace script.  Starsts after <script tag
	startfunc = data.indexOf('var formPost;');
	endfunct = data.indexOf('</script>',startfunc);
	var myfunc = '' + axscript;
	myfunc = myfunc.slice(22).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(escapeHTML(pageid))).replace(/UnitID=X/g,'UnitID='+ escapeHTML(unitID));
	newdata = data.slice(0,startfunc) + myfunc + '\n'  + data.slice(endfunct);			
	data=newdata;			
	
	//startfunc = data.indexOf('<div style="margin-top: 6px;">&copy;');
	//newdata = data.slice(0,startfunc);
	//newdata += '<div style="margin-top: 6px;">Feature Assistant Active</div>';	
	//newdata += '<div style="margin-top: 6px;">This page was produced by the Feature Assistant Extension/Add-on and is not supported by BSA</div>';	
	//data=newdata + data.slice(startfunc);				

	return data;	
}
function setScoutWizPageContent(txtunit,tpageid) {
var newdata;
newdata = '	<div data-role="content">';
newdata += '	<form id="scoutWizardForm" method="post" action="scoutwizard.asp">';
newdata += '		<input type="hidden" name="Action" value="Submit" />';
newdata += '		<ul data-role="listview" data-theme="d" data-inset="true">';
newdata += '			<li id="scoutsLI" data-theme="d">';
newdata += '				<div>';
newdata += '					<p class="normalText">Now you can quickly and easily add a Scout and their Parents in a simple wizard!</p>';
newdata += '					<div style="margin-top: 1.5em; ">';
newdata += '						<fieldset data-role="controlgroup">';
newdata += '							<legend class="text-orange">';
newdata += '								<strong></strong>';
newdata += '							</legend>';
										//   a black  b blue c grey d white e yellow f green g red h white no border i blk 
newdata += '							<ul data-role="listview" data-theme="d" data-inset="true">';

//newdata += '								<li >';	
newdata += '									<div class="ui-grid-b " >';
newdata += '										<div class="ui-block-a "   >';	
newdata += '								   			<p class="normalText" >Scout First Name</p>';	
newdata +='            								</div>';
newdata += '										<div class="ui-block-b "  >';
newdata += '								  			<p class="normalText" >Scout Middle Name</p>';		
newdata +='           								</div>';
newdata += '										<div class="ui-block-c" >';
newdata += '											<p class="normalText" >Scout Last Name</p>';
newdata +='           								</div>';
newdata +='           							</div>';
//newdata +='              			    	</li>';

//newdata += '								<li>';
newdata += '									<div class="ui-grid-b " >';
newdata += '										<div class="ui-block-a "   >';	
newdata += '		        							<input type="text" name="FirstName" id="scoutFirstName" value=""  />';  //placeholder="Scout First Name"
newdata +='            								</div>';
newdata += '										<div class="ui-block-b "   >';
newdata += '		        							<input type="text" name="MiddleName" id="scoutMiddleName" value="" />';	
newdata +='           								</div>';
newdata += '										<div class="ui-block-c" >';
newdata += '		        							<input type="text" name="LastName" id="scoutLastName" value="" />';
newdata +='           								</div>';
newdata +='           							</div>';
//newdata +='              			    	</li>';

//newdata += '								<li >';	
newdata += '									<div class="ui-grid-b " >';
newdata += '										<div class="ui-block-a "   >';	
newdata += '								   			<p class="normalText" >Scout Nickname</p>';	
newdata +='            								</div>';
newdata += '										<div class="ui-block-b "   >';
newdata += '								  			<p class="normalText" >Suffix   Gender</p>';		
newdata +='           								</div>';
newdata += '										<div class="ui-block-c" >';
newdata += '											<p class="normalText" >Den/Patrol</p>';
newdata +='           								</div>';
newdata +='           							</div>';
//newdata +='              			    	</li>';

//newdata += '								<li>';
newdata += '									<div class="ui-grid-b " >';
newdata += '										<div class="ui-block-a "   >';	
newdata += '		        							<input type="text" name="Nickame" id="scoutNickame" value="" />';
newdata +='            								</div>';
newdata += '										<div class="ui-block-b "   >';
newdata += '		        							<input type="text" name="Suffix" id="scoutSuffix" value="" />';		
newdata +='           								</div>';
newdata += '										<div class="ui-block-c" >';
newdata += '	    	    							<select name="DenPatrolName" id="denPatrolName" data-native-menu="false" >';
newdata += '												<option value="">Choose Den or Patrol</option>';
for(var i =0;i<denPatrolObjs.length;i++) {
   newdata += '												<option value="'+denPatrolObjs[i].id+'">'+denPatrolObjs[i].name+'</option>';
}
newdata += '	        								</select>';	
newdata +='           								</div>';
newdata +='           							</div>';
//newdata +='              			    	</li>';

//-----------
newdata += '									<div class="ui-grid-b " >';
newdata += '										<div class="ui-block-a "   >';	
newdata += '								   			<p class="normalText" >Address</p>';	
newdata +='            								</div>';
newdata += '										<div class="ui-block-b "  >';
newdata += '								  			<p class="normalText" ></p>';		
newdata +='           								</div>';
newdata += '										<div class="ui-block-c" >';
newdata += '											<p class="normalText" ></p>';
newdata +='           								</div>';
newdata +='           							</div>';

newdata += '									<div class="ui-grid-b " >';
newdata += '										<div class="ui-block-a "   >';	
newdata += '		        							<input type="text" name="Address1" id="address1" value=""  />';  
newdata +='            								</div>';
newdata += '										<div class="ui-block-b "   >';
newdata += '		        							<p></p>	';
newdata +='           								</div>';
newdata += '										<div class="ui-block-c" >';
newdata += '		        							<p></p>';
newdata +='           								</div>';
newdata +='           							</div>';

newdata += '									<div class="ui-grid-b " >';
newdata += '										<div class="ui-block-a "   >';	
newdata += '								   			<p class="normalText" >Address</p>';	
newdata +='            								</div>';
newdata += '										<div class="ui-block-b "  >';
newdata += '								  			<p class="normalText" ></p>';		
newdata +='           								</div>';
newdata += '										<div class="ui-block-c" >';
newdata += '											<p class="normalText" ></p>';
newdata +='           								</div>';
newdata +='           							</div>';

newdata += '									<div class="ui-grid-b " >';
newdata += '										<div class="ui-block-a "   >';	
newdata += '		        							<input type="text" name="Address1" id="address1" value=""  />';  
newdata +='            								</div>';
newdata += '										<div class="ui-block-b "   >';
newdata += '		        							<p></p>	';
newdata +='           								</div>';
newdata += '										<div class="ui-block-c" >';
newdata += '		        							<p></p>';
newdata +='           								</div>';
newdata +='           							</div>';
//-----------
newdata += '									<div class="ui-grid-b " >';
newdata += '										<div class="ui-block-a "   >';	
newdata += '								   			<p class="normalText" >Address</p>';	
newdata +='            								</div>';
newdata += '										<div class="ui-block-b "  >';
newdata += '								  			<p class="normalText" ></p>';		
newdata +='           								</div>';
newdata += '										<div class="ui-block-c" >';
newdata += '											<p class="normalText" ></p>';
newdata +='           								</div>';
newdata +='           							</div>';

newdata += '									<div class="ui-grid-b " >';
newdata += '										<div class="ui-block-a "   >';	
newdata += '		        							<input type="text" name="Address2" id="address2" value=""  />';  
newdata +='            								</div>';
newdata += '										<div class="ui-block-b "   >';
newdata += '		        							<p></p>	';
newdata +='           								</div>';
newdata += '										<div class="ui-block-c" >';
newdata += '		        							<p></p>';
newdata +='           								</div>';
newdata +='           							</div>';
//-----------
newdata += '									<div class="ui-grid-b " >';
newdata += '										<div class="ui-block-a "   >';	
newdata += '								   			<p class="normalText" >City</p>';	
newdata +='            								</div>';
newdata += '										<div class="ui-block-b "  >';
newdata += '								  			<p class="normalText" >State</p>';		
newdata +='           								</div>';
newdata += '										<div class="ui-block-c" >';
newdata += '											<p class="normalText" >Zip</p>';
newdata +='           								</div>';
newdata +='           							</div>';

newdata += '									<div class="ui-grid-b " >';
newdata += '										<div class="ui-block-a "   >';	
newdata += '		        							<input type="text" name="City" id="city" value=""  />';  //placeholder="Scout First Name"
newdata +='            								</div>';
newdata += '										<div class="ui-block-b "   >';
newdata += '		        							<input type="text" name="State" id="state" value="" />';	
newdata +='           								</div>';
newdata += '										<div class="ui-block-c" >';
newdata += '		        							<input type="text" name="Zip" id="zip" value="" />';
newdata +='           								</div>';
newdata +='           							</div>';

//---------------

newdata += '									<div class="ui-grid-b " >';
newdata += '										<div class="ui-block-a "   >';	
newdata += '								   			<p class="normalText" >Home Phone</p>';	
newdata +='            								</div>';
newdata += '										<div class="ui-block-b "  >';
newdata += '								  			<p class="normalText" >Mobile Phone</p>';		
newdata +='           								</div>';
newdata += '										<div class="ui-block-c" >';
newdata += '											<p class="normalText" >BSA Member ID</p>';
newdata +='           								</div>';
newdata +='           							</div>';

newdata += '									<div class="ui-grid-b " >';
newdata += '										<div class="ui-block-a "   >';	
newdata += '		        							<input type="text" name="HomePhone" id="homePhone" value=""  />';  //placeholder="Scout First Name"
newdata +='            								</div>';
newdata += '										<div class="ui-block-b "   >';
newdata += '		        							<input type="text" name="MobilePhone" id="mobilePhone" value="" />';	
newdata +='           								</div>';
newdata += '										<div class="ui-block-c" >';
newdata += '		        							<input type="text" name="BSAMemberID" id="bsaMemberID" value="" />';
newdata +='           								</div>';
newdata +='           							</div>';

//---------------

newdata += '									<div class="ui-grid-b " >';
newdata += '										<div class="ui-block-a "   >';	
newdata += '								   			<p class="normalText" >DOB</p>';	
newdata +='            								</div>';
newdata += '										<div class="ui-block-b "  >';
newdata += '								  			<p class="normalText" >Boys Life</p>';		
newdata +='           								</div>';
newdata += '										<div class="ui-block-c" >';
newdata += '											<p class="normalText" >LDS</p>';
newdata +='           								</div>';
newdata +='           							</div>';

newdata += '									<div class="ui-grid-b " >';
newdata += '										<div class="ui-block-a "   >';	
//newdata += '								<fieldset data-role="controlgroup">';
newdata += '		        							<input type="date" name="DOB" id="dob" value="" />';  
//newdata += '		        							<input type="date" name="DOBx" id="dobx" value="" data-inline="true" />';  
//newdata += '								</fieldset>';
newdata +='            								</div>';
newdata += '										<div class="ui-block-b "   >';
newdata += '																	<div class="slider">';
newdata += '																		<select name="FollowForum" id="followForum" data-role="slider" data-mini="true" data-theme="d">';
newdata += '																			<option value="off" ></option>';
newdata += '																			<option value="on"  selected="selected" ></option>';
newdata += '																		</select> ';
newdata += '																	</div>';
//newdata += '											<label for="flip-2">Flip switch:</label>';
//newdata += '											<select name="flip-2" id="flip-2" data-role="slider">';
//newdata += '								 			   <option value="off">No</option>';
//newdata += '								  			  <option value="on">Yes</option>';
//newdata += '											</select>';
//newdata += '		        							<input type="text" name="MobilePhone" id="mobilePhone" value="" />';	
newdata +='           								</div>';
newdata += '										<div class="ui-block-c" >';
newdata += '		        							<input type="text" name="BSAMemberID" id="bsaMemberID" value="" />';
newdata +='           								</div>';
newdata +='           							</div>';

//---------------

newdata += '						    </ul>';
		
newdata += '							<div data-role="collapsible" data-theme="a"  data-collapsed="false"  >';
newdata += '								<h4 data-theme="a">Parent 1</h4>';
newdata += '								<fieldset data-role="controlgroup">';
newdata += '									<legend></legend>';

//newdata += '								<li >';	
newdata += '									<div class="ui-grid-b " >';
newdata += '										<div class="ui-block-a "   >';	
newdata += '								   			<p class="normalText" >Parent First Name</p>';	
newdata +='            								</div>';
newdata += '										<div class="ui-block-b "   >';
newdata += '								  			<p class="normalText" >Parent Middle Name</p>';		
newdata +='           								</div>';
newdata += '										<div class="ui-block-c" >';
newdata += '											<p class="normalText" >Parent Last Name</p>';
newdata +='           								</div>';
newdata +='           							</div>';
//newdata +='              			    	</li>';

//newdata += '								<li >';									
newdata += '									<div class="ui-grid-b " >';
newdata += '										<div class="ui-block-a "   >';	
newdata += '		        							<input type="text" name="ParentFirstName" id="parentFirstName" value="" />';
newdata +='            								</div>';
newdata += '										<div class="ui-block-b "   >';
newdata += '		        							<input type="text" name="ParentMiddleName" id="parentMiddleName" value="" />';	
newdata +='           								</div>';
newdata += '										<div class="ui-block-c" >';
newdata += '		        							<input type="text" name="ParentLastName" id="parentLastName" value="" />';
newdata +='           								</div>';
newdata +='           							</div>';
//newdata +='              			    	</li>';

//newdata += '								<li >';	
newdata += '									<div class="ui-grid-b " >';
newdata += '										<div class="ui-block-a "   >';	
newdata += '								   			<p class="normalText" >Scout Nickname</p>';	
newdata +='            								</div>';
newdata += '										<div class="ui-block-b "   >';
newdata += '								  			<p class="normalText" >Suffix   Gender</p>';		
newdata +='           								</div>';
newdata += '										<div class="ui-block-c" >';
newdata += '											<p class="normalText" >Den/Patrol</p>';
newdata +='           								</div>';
newdata +='           							</div>';
//newdata +='              			    	</li>'; 												
	
//-----------
newdata += '									<div class="ui-grid-b " >';
newdata += '										<div class="ui-block-a "   >';	
newdata += '								   			<p class="normalText" >Address</p>';	
newdata +='            								</div>';
newdata += '										<div class="ui-block-b "  >';
newdata += '								  			<p class="normalText" ></p>';		
newdata +='           								</div>';
newdata += '										<div class="ui-block-c" >';
newdata += '											<p class="normalText" ></p>';
newdata +='           								</div>';
newdata +='           							</div>';

newdata += '									<div class="ui-grid-b " >';
newdata += '										<div class="ui-block-a "   >';	
newdata += '		        							<input type="text" name="ScoutFirstName" id="scoutFirstName" value=""  />';  //placeholder="Scout First Name"
newdata +='            								</div>';
newdata += '										<div class="ui-block-b "   >';
newdata += '		        							<input type="text" name="ScoutMiddleName" id="scoutMiddleName" value="" />';	
newdata +='           								</div>';
newdata += '										<div class="ui-block-c" >';
newdata += '		        							<input type="text" name="ScoutLastName" id="scoutLastName" value="" />';
newdata +='           								</div>';
newdata +='           							</div>';
//------------



	
newdata += '								</fieldset>';
newdata += '							</div>';
											
newdata += '						</fieldset>';
newdata += '					</div>';
newdata += '				</div>';
newdata += '			</li>';	
newdata += '			<li class="ui-body ui-body-b">';
newdata += '				<div class="ui-grid-a">';
newdata += '					<div class="ui-block-a"><input type="submit" data-role="button" value="Update" data-theme="g" id="buttonSubmit" /></div>';
newdata += '					<div class="ui-block-b"><input type="button" data-role="button" value="Cancel" data-theme="d" id="buttonCancel" /></div>';
newdata += '			    </div>';
newdata += '			</li>	';
newdata += '		</ul>';
newdata += '	</form>';

		
newdata += '	<div data-role="popup" id="errorPopup" data-overlay-theme="a" class="ui-content" data-theme="e" data-transition="fade">';
newdata += '		<a href="#" id="closePopupButton" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>';
newdata += '		<div id="errorPopupIcon"></div>';
newdata += '		<div id="errorPopupContent"></div>';
newdata += '		<div class="clearRight"></div>';
newdata += '	</div>';
newdata += 		logoutWarningPageContent(tpageid);
newdata += '	<div id="footer" align="center">';
newdata += '		<div style="margin-top: 6px;">This page was produced by the Feature Assistant Extension/Add-on and is not supported by BSA</div>';		
newdata += '		<div style="margin-top: 6px;">&copy; '+escapeHTML(cyear())+'- Boy Scouts of America &bull; <a href="/mobile/help/privacy.asp">Privacy</a></div>';
newdata += '		<div><a href="/" data-ajax="false"><img src="https://d1kn0x9vzr5n76.cloudfront.net/mobile/images/scoutbookbsalogo400.png" width="200"></a></div>';
newdata += '	</div>';


return newdata;	
}
function axscript() {
	
	
}

// get the subunit names and ids
	var denPatrolObjs=[];
	
function buildDenPatrolList(unitID) {


	var thisObj={};
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle( buildDenPatrolList,unitID,'','','','','','');	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			servErrCnt=0;
			resetLogoutTimer(url);	
			for(var i=0;i<$('a[href*="denpatrol.asp"]',this.response).length;i++) {
				if($('a[href*="denpatrol.asp"]',this.response)[i].href.match(/DenID=\d+/) != null) {
					thisObj['id']='&'+ $('a[href*="denpatrol.asp"]',this.response)[i].href.match(/DenID=\d+/)[0] + '&PatrolID=';

				} 
				if($('a[href*="denpatrol.asp"]',this.response)[i].href.match(/PatrolID=\d+/) != null) {
					thisObj['id']='&DenID=&' +$('a[href*="denpatrol.asp"]',this.response)[i].href.match(/PatrolID=\d+/)[0];

				} 				
				thisObj['name']=$('a[href*="denpatrol.asp"]',this.response)[i].text.trim().split('\n')[0];
				denPatrolObjs.push(JSON.parse(JSON.stringify(thisObj)));
			}
			
			setTimeout(function () {
				buildNewRegistrationPage(unitID);
			},500);					
		}
	}
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/admin/unit.asp?UnitID=' + unitID;
	xhttp.open("GET", url, true);
	xhttp.send();
	xhttp.onerror = function() {
		errHandle( buildDenPatrolList,unitID,'','','','','','');
	}	
	
}
	
function buildNewRegistrationPage(unitID) {
	addScWiz=true;
			$.mobile.changePage(
				'/mobile/dashboard/admin/unit.asp?UnitID=' + unitID,
			{
				allowSamePageTransition: true,
				transition: 'none',
				showLoadMsg: true,
				reloadPage: true
			}
			);			
}

//	var cols = ["FirstName","MiddleName","LastName","Suffix","Nickname","Address1","Address2","City","State","Zip","HomePhone","MobilePhone","BoysLife","BSAMemberID","dobMonth","dobDay","dobYear","LDS","SchoolGrade","SchoolName","TalentRelease","AddParent1","Gender","Email1","PersonalMessage","FirstName","MiddleName","LastName","Suffix","Nickname","Address1","Address2","City","State","Zip","HomePhone","WorkPhone","MobilePhone","Email2","BSAMemberID","AddParent2","Gender","Email1","PersonalMessage","FirstName","MiddleName","LastName","Suffix","Nickname","Address1","Address2","City","State","Zip","HomePhone","WorkPhone","MobilePhone","Email2","BSAMemberID"];

