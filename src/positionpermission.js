// Copyright © 12/19/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.



var permissionDefaults = [ 
{ "u":1,"positionID": 3000, "position": "Troop Admin" 								,"sub":''			,full:'checked'	,ea:'checked'	,va:'checked'	,ep:'checked'	,vp:'checked'	,enable: 0},
{ "u":1,"positionID": 1006, "position": "Patrol Admin" 								,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },
{ "u":1,"positionID": 3001, "position": "Patrol Admin" 								,"sub":'Patrol'		,full:'checked'	,ea:'checked'	,va:'checked'	,ep:'checked'	,vp:'checked'	,enable:0 },

{ "u":2,"positionID": 3002, "position": "Pack Admin" 								,"sub":''			,full:'checked'	,ea:'checked'	,va:'checked'	,ep:'checked'	,vp:'checked'	,enable:0 },
{ "u":2,"positionID": 1007, "position": "Den Admin" 								,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },
{ "u":2,"positionID": 3003, "position": "Den Admin" 								,"sub":'Den'		,full:'checked'	,ea:'checked'	,va:'checked'	,ep:'checked'	,vp:'checked'	,enable:0 },

{ "u":5,"positionID": 3004, "position": "Ship Admin" 								,"sub":''			,full:'checked'	,ea:'checked'	,va:'checked'	,ep:'checked'	,vp:'checked'	,enable:0 },

{ "u":0,"positionID": 1000, "position": "Parent/Guardian" 							,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 }, 	
{ "u":0,"positionID": 1001, "position": "Parent/Guardian" 							,"sub":'Own Child'	,full:'checked'	,ea:'checked'	,va:'checked'	,ep:'checked'	,vp:'checked'	,enable:0 },

{ "u":2,"positionID": 77, "position": "Cubmaster"									,"sub":''			,full:'checked'	,ea:'checked'	,va:'checked'	,ep:'checked'	,vp:'checked'	,enable:0 },
{ "u":2,"positionID": 78, "position": "Assistant Cubmaster" 						,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },  
{ "u":2,"positionID": 80, "position": "Asst. Den Leader" 						,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 }, 
{ "u":2,"positionID": 1080, "position": "Assistant Den Leader" 						,"sub":'Den'		,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 } ,
{ "u":2,"positionID": 79, "position": "Den Leader"									,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 }, 
{ "u":2,"positionID": 2079, "position": "Den Leader"								,"sub":'Den'		,full:''		,ea:'checked'	,va:'checked'	,ep:''			,vp:'checked'	,enable:0 }, 

{ "u":2,"positionID": 83, "position": "Assistant Webelos I Den Leader"				,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },
{ "u":2,"positionID": 2083, "position": "Assistant Webelos I Den Leader"				,"sub":'Den'		,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },

{ "u":2,"positionID": 82, "position": "Webelos I Den Leader" 							,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },
{ "u":2,"positionID": 2082, "position": "Webelos I Den Leader" 						,"sub":'Den'		,full:''		,ea:'checked'	,va:'checked'	,ep:''			,vp:'checked'	,enable:0 } ,
{ "u":2,"positionID": 208, "position": "Lion Adult Partner" 						,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 } ,
{ "u":2,"positionID": 2208, "position": "Lion Adult Partner" 						,"sub":'Den'		,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 } , 
{ "u":2,"positionID": 207, "position": "Lion Guide" 								,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },
{ "u":2,"positionID": 2207, "position": "Lion Guide" 								,"sub":'Den'		,full:''		,ea:'checked'	,va:'checked'	,ep:''			,vp:'checked'	,enable:0 },
{ "u":2,"positionID": 85, "position": "Tiger Cub Adult" 							,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },  
{ "u":2,"positionID": 2085, "position": "Tiger Cub Adult" 							,"sub":'Den'		,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },
{ "u":2,"positionID": 84, "position": "Tiger Den Leader" 							,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 }, 
{ "u":2,"positionID": 1084, "position": "Tiger Den Leader" 							,"sub":'Den'		,full:''		,ea:'checked'	,va:'checked'	,ep:''			,vp:'checked'	,enable:0 },   	
{ "u":2,"positionID": 81, "position": "Pack Trainer" 								,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },  	

{ "u":3,"positionID": 3006, "position": "Crew Admin" 								,"sub":''			,full:'checked'	,ea:'checked'	,va:'checked'	,ep:'checked'	,vp:'checked'	,enable:0 },
{ "u":3,"positionID": 48, "position": "Venturing Crew Advisor" 						,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },
{ "u":3,"positionID": 88, "position": "Venturing Crew Assoc. Advisor" 				,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 }, 
{ "u":5,"positionID": 89, "position": "Skipper" 									,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 }, 
{ "u":5,"positionID": 90, "position": "Mate" 										,"sub":""			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 }, 

{ "u":4,"positionID": 3007, "position": "Team Admin" 								,"sub":''			,full:'checked'	,ea:'checked'	,va:'checked'	,ep:'checked'	,vp:'checked'	,enable:0 },
{ "u":4,"positionID": 86, "position": "Varsity Scout Coach" 						,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },
{ "u":4,"positionID": 87, "position": "Assistant Varsity Scout Coach"				,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },

	
{ "u":1,"positionID": 2, "position": "Assistant Scoutmaster" 						,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },				
{ "u":1,"positionID": 2002, "position": "Assistant Scoutmaster" 					,"sub":'Patrol'		,full:'checked'	,ea:'checked'	,va:'checked'	,ep:'checked'	,vp:'checked'	,enable:0 },
{ "u":0,"positionID": 106, "position": "Chartered Organization Rep."				,"sub":'' 			,full:'checked'	,ea:'checked'	,va:'checked'	,ep:'checked'	,vp:'checked'	,enable:0 },
{ "u":0,"positionID": 29, "position": "Unit Advancement Chair"			 			,"sub":''			,full:''		,ea:'checked'	,va:'checked'	,ep:''			,vp:'checked'	,enable:0 },	
{ "u":0,"positionID": 107, "position": "Committee Chairman" 						,"sub":''			,full:'checked'	,ea:'checked'	,va:'checked'	,ep:'checked'	,vp:'checked'	,enable:0 } ,						
{ "u":0,"positionID": 32, "position": "Committee Equipment Coordinator" 			,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 } ,			
{ "u":0,"positionID": 108, "position": "Committee Member" 							,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 } ,	
{ "u":0,"positionID": 33, "position": "Committee Membership Coordinator" 			,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },
{ "u":0,"positionID": 28, "position": "Unit Outdoors / Activities Chair"			,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },
{ "u":0,"positionID": 26, "position": "Committee Secretary"							,"sub":'' 			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },
{ "u":0,"positionID": 31, "position": "Unit Training Chair"			 				,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },
{ "u":0,"positionID": 27, "position": "Unit Treasurer" 								,"sub":''			,full:'checked'	,ea:'checked'	,va:'checked'	,ep:'checked'	,vp:'checked'	,enable:0 },
{ "u":0,"positionID": 46, "position": "Youth Protection Champion" 					,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },
{ "u":0,"positionID": 109, "position": "Executive Officer"							,"sub":'' 			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },
{ "u":0,"positionID": 161, "position": "Unit FOS Chair" 							,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },
{ "u":1,"positionID": 95, "position": "Leader of 11-year old Scouts (LDS Troop)"	,"sub":''			,full:'checked'	,ea:'checked'	,va:'checked'	,ep:'checked'	,vp:'checked'	,enable:0 },
{ "u":1,"positionID": 164, "position": "Life-to-Eagle Coordinator" 					,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },
{ "u":1,"positionID": 76, "position": "Merit Badge Counselor" 						,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },
{ "u":0,"positionID": 218, "position": "New Member Coordinator" 					,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },
{ "u":0,"positionID": 155, "position": "Nova Awards Counselor" 						,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },
{ "u":0,"positionID": 91, "position": "Parent Coordinator" 										,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },
{ "u":1,"positionID": 1, "position": "Scoutmaster"									,"sub":''			,full:'checked'	,ea:'checked'	,va:'checked'	,ep:'checked'	,vp:'checked'	,enable:0 },
{ "u":0,"positionID": 74, "position": "ScoutParent (discontinued in 2013)"			,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },
{ "u":0,"positionID": 156, "position": "Supernova Awards Mentor"					,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },
{ "u":0,"positionID": 30, "position": "Unit Chaplain" 								,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },
{ "u":0,"positionID": 112, "position": "Unit College Scouter Reserve"				,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },
{ "u":0,"positionID": 116, "position": "Unit Commissioner"							,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },
{ "u":0,"positionID": 162, "position": "Unit Fund-Raising Chair"						,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },
{ "u":0,"positionID": 160, "position": "Unit Public Relations Chair"				,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },
{ "u":0,"positionID": 110, "position": "Unit Religious Emblems Coord"				,"sub":'' 			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },
{ "u":0,"positionID": 113, "position": "Unit Scouter Reserve"						,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 },
{ "u":0,"positionID": 163, "position": "Unit STEM Coordinator"						,"sub":''			,full:''		,ea:''			,va:''			,ep:''			,vp:'checked'	,enable:0 }


];

//"Committee Advancement Coordinator
//Committee Advancement Coordinator
//Unit Fundraising Chair
//Committee Outdoor/Activities Coordinator
//Unit Religious Emblems Coordinator
//Committee Training Coordinator
//Committee Treasurer
//Committee Youth Protection Chair
//Assistant Den Leader
//Tiger Adult Partner
//Webelos Den Leader
//Assistant Webelos Den Leader
//Crew Advisor
//Crew Associate Advisor

/* ships
	[			213				Ship Admin
{ "positionID": 89, "position": "Skipper (SK)" }, 
{ "positionID": 90, "position": "Mate (MT)" }, 

 { "positionID": 106, "position": "Chartered Organization Rep. (CR)" }, 
{ "positionID": 107, "position": "Committee Chairman (CC)" }, 
{ "positionID": 32, "position": "Committee Equipment Coordinator (MC)" }, 
{ "positionID": 108, "position": "Committee Member (MC)" }, 
{ "positionID": 26, "position": "Committee Secretary (MC)" }, 

{ "positionID": 218, "position": "New Member Coordinator (NMC)" }, 

{ "positionID": 29, "position": "Unit Advancement Chair (MC)" }, 
{ "positionID": 30, "position": "Unit Chaplain (212)" }, 
{ "positionID": 116, "position": "Unit Commissioner (80)" }, 
{ "positionID": 28, "position": "Unit Outdoors / Activities Chair (MC)" }, 
{ "positionID": 31, "position": "Unit Training Chair (MC)" }, 
{ "positionID": 27, "position": "Unit Treasurer (MC)" } ]


*/

var codePermissionDefaults=permissionDefaults.slice();

			
var posPerm=false;
// adds the link and control
function addRawPositionPermission(data,pageid,unitID) {
	var startfunc=data.indexOf('<a href="/mobile/dashboard/admin/connectionsmanager.asp');
	if(startfunc == -1 )  {
		//no link so no permission;
		return data;
	}	
	var newlink = '<a href="#" id="permissionPosition" class="showLoading">\n';
	newlink += '	<div>\n';
	newlink += '		Permissions by Position\n';	
	newlink += '		<img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/connected50.png" style="width: 18px; vertical-align: -2px;">\n';
	newlink += '	</div>\n';
	newlink += '	</a>\n';
	newlink += '</li>\n';
	newlink += '<li class="ui-icon-alt">\n';
	
	data=data.slice(0,startfunc) + newlink + data.slice(startfunc);
	
	// add control for link, in PageInit
	var startfunc = data.indexOf("$('#buttonRemoveScout',");

    var myfunc=ppscript + '';
	myfunc = myfunc.slice(22).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(pageid)).replace(/UnitID=X/g,'UnitID='+ escapeHTML(unitID));
	var newdata = data.slice(0,startfunc) + myfunc + '\n'  + data.slice(startfunc);			
	data=newdata;
	
	return data;
}

// builds the form page				
function addRawPosPermPage(data,pageid,unitID,txtunit) {

	posPerm=false;  //page was shown
	// Replace heading
	var startfunc = data.indexOf('<span style="margin-left: 5px; ">',1);
	var endfunct = data.indexOf('</h1>',1);				
	
	var newdata = data.slice(0,startfunc);
	newdata += '<span style="margin-left: 5px; ">';
	newdata += '		<a href="#" id="buttonRefresh2" class="text">'+escapeHTML(txtunit)+'</a>';
	//if(QEPatrol != '') {
	//	newdata += '		<a id="goToDenPatrol" href="'+escapeHTML('/mobile/dashboard/admin/denpatrol.asp?UnitID='+unitID+'&DenID=&PatrolID='+QEPatrolID)+'" class="text" data-direction="reverse">'+escapeHTML(QEPatrol)+'</a>';
	//}
	
	
	//newdata += '			<a id="goToUnit" href="/mobile/dashboard/admin/unit.asp?UnitID='+unitID+'" class="text" data-direction="reverse">'+txtunit+'</a>\n';
	newdata += '				</span>\n';
	newdata += '<span style="margin-left: 5px; ">';		
	
	
	//<span style="margin-left: 5px; ">
					
	newdata += '						<a id="goTo" href="/mobile/dashboard/admin/roster.asp?UnitID='+unitID+'" class="text" data-direction="reverse">Roster</a>\n';
	newdata += '				</span>\n';
	newdata += '<span style="margin-left: 5px; ">';	
	
	
	newdata += '           Set Permissions based on Adult Positions';
	newdata += '</span>';
	newdata +=  data.slice(endfunct);
	
	data = newdata;

	var startfunc = data.indexOf('<a id="goBack"',1);
	var endfunct = data.indexOf('<img src',startfunc);
	myfunc = '<a href="#" id="buttonRefresh1" >';
	var newdata = data.slice(0,startfunc) + myfunc + '\n'  + data.slice(endfunct);
	data = newdata;	
	
	
	var startfunc = data.indexOf("$('#buttonRefresh");
	startfunc=data.indexOf('/unit.asp?',startfunc);
	endfunct= data.indexOf('=1',startfunc);
	data=data.slice(0,startfunc) + '/roster.asp?UnitID='+unitID + data.slice(endfunct+2);
	
	
	
	
	
	
	// replace content
	var startfunc = data.indexOf('<div data-role="content">');
	var endfunct = data.indexOf('</div><!-- /content -->');
	var newdata = data.slice(0,startfunc);				
	var dflen={len:0};
	newdata += setPosPermPageContent(txtunit,'Page'+escapeHTML(pageid),dflen);
	newdata +=  data.slice(endfunct);				
	data=newdata;
	
	
	// replace style
	var startfunc = data.indexOf('<style type="text/css">');
	var endfunct = data.indexOf('</style>');
	var newdata = data.slice(0,startfunc);
	newdata += '	<style type="text/css">';
	newdata += '		#Page' + escapeHTML(pageid) +' .ui-select .ui-btn-icon-right .ui-btn-inner	{ padding-left: 10px; padding-right: 35px; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' .ui-select .ui-btn-icon-right .ui-icon		{ right: 10px; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' #popupDeleteLog								{ max-width: 400px; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' .smallText		{ color: gray; margin-top: 15px; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' img.imageSmall	{ position: relative; width: 30px; height: 30px; top: -5px; border: 1px solid gray; }\n';
				


	newdata += '		@media all and (min-width: 8em) {  \n';  //4420
	newdata += '		    .ui-field-contain label.ui-input-text {\n';
	newdata += '		        vertical-align:middle;\n';
	newdata += '		        text-align:right;\n';
	newdata += '		        display: inline-block;\n';
	newdata += '		        width: 45%;		\n';  //increase here 30
	newdata += '		       margin: 0 2% 0 0\n';
	newdata += '		   }\n';

				
	
	newdata += '		   .ui-field-contain input.ui-input-text,.ui-field-contain textarea.ui-input-text,.ui-field-contain .ui-input-search,.ui-field-contain div.ui-input-text {\n';
	newdata += '		       width: 52%;  \n';  //decrease width here 68
	newdata += '		       display: inline-block\n';
	newdata += '		    }\n';

	newdata += '		    .ui-field-contain .ui-input-search,.ui-field-contain div.ui-input-text {\n';
	newdata += '		        -webkit-box-sizing: border-box;\n';
	newdata += '		        -moz-box-sizing: border-box;\n';
	newdata += '		        -ms-box-sizing: border-box;\n';
	newdata += '		        box-sizing: border-box\n';
	newdata += '		   }\n';

	newdata += '		   .ui-hide-label input.ui-input-text,.ui-hide-label textarea.ui-input-text,.ui-hide-label .ui-input-search,.ui-hide-label div.ui-input-text,.ui-input-search input.ui-input-text,div.ui-input-text input.ui-input-text {\n';
	newdata += '		       width: 100%\n';
	newdata += '		   }\n';
	newdata += '		}\n';

	newdata += '		#Page' + escapeHTML(pageid) +' div.ui-field-contain.ui-body.ui-br { width: 240px; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' div.ui-checkbox { margin:auto; width: 50px; }\n';	//130px		
	
	newdata += '		#Page' + escapeHTML(pageid) +' td input[type="checkbox"] {\n';
	newdata += '		    float: left;\n';
	newdata += '		    margin: 0 auto;\n';
	newdata += '		   width: 100%;\n';

	newdata += '		}\n';

	newdata += '		#Page' + escapeHTML(pageid) +	' table {\n';
 	newdata += '		        border-collapse: collapse;\n';
	newdata += '		    }\n';
	
	newdata += '		#Page' + escapeHTML(pageid) +	' table, th, td {\n';
 	newdata += '		       border: 1px solid #ddd;\n';
	newdata += '		        padding-left: 5px;\n';
	newdata += '		        padding-right: 5px;\n';
	newdata += '		    }\n';

	newdata += '		#Page' + escapeHTML(pageid) +	'  td {\n';
 	newdata += '		       font-weight:normal;';

	newdata += '		    }\n';	
	
	newdata += '	</style>';
	newdata +=  data.slice(endfunct);				
	data=newdata;		

	// replace script.  Starsts after <script tag
	var startfunc = data.indexOf('var formPost;');
	var endfunct = data.indexOf('</script>',startfunc);
	var myfunc = '' + pescript;
	myfunc = myfunc.slice(22).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(pageid)).replace(/UnitID=X/g,'UnitID='+ escapeHTML(unitID)).replace(/dflen=0/,'dflen='+dflen.len).replace(/hostX/,'"'+host+'"').replace(/txtunit=X/,'txtunit="'+txtunit+'"');
	var newdata = data.slice(0,startfunc) + myfunc + '\n'  + data.slice(endfunct);			
	data=newdata;	
	
	var startfunc = data.indexOf("$('#buttonRefresh");
	
	newdata="    $('#buttonRefresh1', '#Page"+ escapeHTML(pageid)+"').click(function() {\n";
	newdata+="			$.mobile.changePage(\n";
	newdata+="						'https://"+host+"scoutbook.com/mobile/dashboard/admin/unit.asp?UnitID="+ escapeHTML(unitID)+"&DenID=&PatrolID=&Refresh=1',\n";
	newdata+="					{\n";
	newdata+="					    allowSamePageTransition: true,\n";
	newdata+="					    transition: 'none',\n";
	newdata+="					    showLoadMsg: true,\n";
	newdata+="					    reloadPage: true\n";
	newdata+="					}\n";
	newdata+="				);\n";
	newdata+="	        });	\n";
	newdata+="    $('#buttonRefresh2', '#Page"+ escapeHTML(pageid)+"').click(function() {\n";
	newdata+="			$.mobile.changePage(\n";
	newdata+="						'https://"+host+"scoutbook.com/mobile/dashboard/admin/unit.asp?UnitID="+ escapeHTML(unitID)+"&DenID=&PatrolID=&Refresh=1',\n";
	newdata+="					{\n";
	newdata+="					    allowSamePageTransition: true,\n";
	newdata+="					    transition: 'none',\n";
	newdata+="					    showLoadMsg: true,\n";
	newdata+="					    reloadPage: true\n";
	newdata+="					}\n";
	newdata+="				);\n";
	newdata+="	        });	\n";	
	
	data=data.slice(0,startfunc)+ newdata+data.slice(startfunc);
	
	
	
	
	return data;
}
/*
does 2 things.  
1. makes sure that user has set their own defaults
2. Checks new releases to verify the list is the same.

*/


function checkNewDefaults() {
var match=true;

if(permissionDefaults.length != codePermissionDefaults.length) {
	match=false;


} else {
	//match em up
	for(var i=0;i<permissionDefaults.length;i++) {
		for(var j=0;j<codePermissionDefaults.length;j++) {
			if(permissionDefaults[i].positionID==codePermissionDefaults[j].positionID) {
				if(permissionDefaults[i].position==codePermissionDefaults[j].position) {
					//found matched position
					if(permissionDefaults[i].u==codePermissionDefaults[j].u) {		// changes in visibility
						match=true;			
					}
					break;
				} else {
					// name change, update ui
					//console.log(permissionDefaults[i].position,codePermissionDefaults[j].position);
					permissionDefaults[i].position=codePermissionDefaults[j].position;
				}
			}
		}
		if(match==false) {
			//no match found
			break;
		}
	}
}
var obj={};	
if(match==false) {
	alert('There has been a change to the Position List.  Re-examine your default choices');
	for(var i=0;i<permissionDefaults.length;i++) {
		for(var j=0;j<codePermissionDefaults.length;j++) {
			if(permissionDefaults[i].positionID==codePermissionDefaults[j].positionID) {
				//found matched position
				
				if(permissionDefaults[i].u!=codePermissionDefaults[j].u) {
					
					permissionDefaults[i].u=codePermissionDefaults[j].u;		//code update
				}
				obj=permissionDefaults.slice(i,i+1)[0];
				obj.enable=0;
				codePermissionDefaults.splice(j,1,JSON.parse(JSON.stringify(obj)));		
				break;
			}
		}
	}
	permissionDefaults=codePermissionDefaults.slice();
}	
}
function checkPermDefault(txtunit) {

	
var u=0;
var notset=false;
  if(txtunit.indexOf('Troop') != -1 ) {u=1;};
  if(txtunit.indexOf('Pack') != -1 ) {u=2;};
  if(txtunit.indexOf('Crew') != -1 ) {u=3;}; 
  if(txtunit.indexOf('Team') != -1 ) {u=4;};
  if(txtunit.indexOf('Ship') != -1 ) {u=5;};
   
  for(var i=0;i<permissionDefaults.length;i++) {
	  if(permissionDefaults[i].u ==u) {
		  if(permissionDefaults[i].enable==0) {
			  notset=true;
			  break;
		  }
	  }
	  
  }
  /*
	$('tr').each( function () {
		if($(this).attr('data-u') == u) {
			if($(this).attr('data-enable')==0) {
				notset=true;
			}
		}
	});
*/
	if(notset==true) {
		alert('Please update permissions and save your new defaults before trying to apply permissions to the unit');
	}
	return notset;
}

function setPerms(txtunit,saveOpt) {
	// update the defaults given what is on the screen
var u=0;
  if(txtunit.indexOf('Troop') != -1 ) {u=1;};
  if(txtunit.indexOf('Pack') != -1 ) {u=2;};
  if(txtunit.indexOf('Crew') != -1 ) {u=3;}; 
  if(txtunit.indexOf('Team') != -1 ) {u=4;};	
  if(txtunit.indexOf('Ship') != -1 ) {u=5;};	
	
	
	var evObj={ u:"",positionID: 0, position: "" ,				sub:""			,full:""	,ea:""	,va:""	,ep:""	,vp:"",enable: 0};
	var i=-1;
	permissionDefaults=[];
	$('tr').each( function () {
		if( i>-1) {
		evObj.positionID=$(this).attr('data-positionid');
		evObj.u=$(this).attr('data-u');
		evObj.enable=$(this).attr('data-enable');
		evObj.position=$(this).find('td:eq(0)').text();
		evObj.sub=$(this).find('td:eq(1)').text();
		if($('#permissionID'+i+'p3:checked').length >0) {
			evObj.full='checked';
		} else {
			evObj.full='';
		}
		if($('#permissionID'+i+'p7:checked').length >0) {
			evObj.ea='checked';
		} else {
			evObj.ea='';
		}
		if($('#permissionID'+i+'p6:checked').length >0) {
			evObj.va='checked';
		} else {
			evObj.va='';
		}
		if($('#permissionID'+i+'p5:checked').length >0) {
			evObj.ep='checked';	
		} else {
			evObj.ep='';
		}
		if($('#permissionID'+i+'p4:checked').length >0) {		
			evObj.vp='checked';	
		} else {
			evObj.vp='';
		}
		
		if(evObj.u==u) {
			evObj.enable=1;
		}
		permissionDefaults.push(JSON.parse(JSON.stringify(evObj)));
		}
		//short of the enable setting, we have all...  replace the permissionDefaults
		i++;		
	});
	//debugger;
	if(saveOpt==true) {
		var msgObj ={ hostx: "oth", text: "setPerms", permissionDefaults: JSON.stringify(permissionDefaults) };
		if(host=="www.") {msgObj.hostx=host;}
		sendTimerMsg(msgObj, "*");	
		//alert('sent msg');
	}
}


function setPosPermPageContent(txtunit,tpageid,dflen) {
	
	
checkNewDefaults();
	
dflen.len=permissionDefaults.length;

var newdata;
newdata = '	<div data-role="content">';

newdata += '	<form id="posPermForm">';
newdata += '		<input type="hidden" name="Action" value="Submit" />';
newdata += '		<ul data-role="listview" data-theme="d" data-inset="true" data-count-theme="f" style="margin-top: 0;" class="ui-icon-alt;">';

newdata += '			<li data-role="list-divider" role="heading" data-theme="a">';			
newdata += '			 Set Permissions based on Adult Position';
newdata += '			</li>';
			
newdata += '			<li id="scoutsLI" data-theme="d">';

newdata += '					<p class="normalText">Now you can quickly and easily set permissions for your whole unit using a default permission set for all adult positions!</p>';

newdata += '						<legend class="text-orange">';
newdata += '							<strong>Set Permissions:</strong>';
newdata +=  '							<div style="float: right; width: 160px; padding-left:5px; padding-right:2px;  margin-top: -2em; ">\n';
newdata += '				        		<input type="button"  data-role="button" data-mini="true" value="Import/Export" data-theme="d" id="buttonImpExp" />';	
newdata += '					    	</div >'
newdata += '						</legend>';

newdata += '			</li>';
newdata += '		</ul>';	

newdata += '		<fieldset data-role="controlgroup" data-theme="d" >';	
newdata += '		  <ul data-role="listview" data-theme="d" data-inset="true" data-count-theme="f" style="margin-top: 0;" class="ui-icon-alt;">';


newdata +=	'			<li><input type="button" value="Save permissions as Default (for this browser)" data-theme="c" id="buttonPosPermSave" ></li>';
	
	

newdata += '			<li id="permissionsLI" data-theme="d">';						
										//   a black  b blue c grey d white e yellow f green g red h white no border i blk 
newdata += '						<table data-theme="d" ><tr>\n';	
newdata += '							<th>Position</th>\n';	
newdata += '							<th>SubGroup</th>\n';	
newdata += '							<th>Full Control</th>\n';	
newdata += '							<th>Edit Advancement</th>\n';	
newdata += '							<th>View Advancement</th>\n';
newdata += '							<th>Edit Profile</th>\n';	
newdata += '							<th>View Profile</th>\n';	
newdata += '						</tr>\n';	

var full;
var ea;
var va;
var ep;
var vp;

var showln=false;
for(var i=0;i<permissionDefaults.length;i++){
	
  showln=false;
  if(txtunit.indexOf('Troop') != -1 && permissionDefaults[i].u==1 ) {showln=true};
  if(txtunit.indexOf('Pack') != -1 && permissionDefaults[i].u==2 ) {showln=true};
  if(txtunit.indexOf('Crew') != -1 && permissionDefaults[i].u==3 ) {showln=true}; 
  if(txtunit.indexOf('Team') != -1 && permissionDefaults[i].u==4 ) {showln=true};
  if(txtunit.indexOf('Ship') != -1 && permissionDefaults[i].u==5 ) {showln=true};  
  
  if(permissionDefaults[i].u==0 ) {showln=true};
  

	 full='';
	 ea='';
	 va='';
	 ep='';
	 vp='';
	 
	if(permissionDefaults[i].positionID == 1001) {

		permissionDefaults[i].full ='checked';
		permissionDefaults[i].ea ='checked';
		permissionDefaults[i].va ='checked';
		permissionDefaults[i].ep ='checked';
		permissionDefaults[i].vp ='checked';
		full='disabled';
	}		 
	 
	if(permissionDefaults[i].full =='checked') {
		 ea='disabled',
		 va='disabled';
		 ep='disabled';
		 vp='disabled';		
	}
	
	if(permissionDefaults[i].ea =='checked') {
		 va='disabled';
		 vp='disabled';			
	}
	if(permissionDefaults[i].va =='checked') {
		 vp='disabled';			
	}
	if(permissionDefaults[i].ep =='checked') {
		 vp='disabled';			
	}
	
	if(permissionDefaults[i].positionID > 2999) {
		full='disabled';
	}

	
	
	
  if(showln==true) {
	  hide='';
  } else {
	hide='style="display:none;"';
  }
    newdata += '					<tr '+hide+' ' + 'data-positionid='+permissionDefaults[i].positionID+' '+ 'data-u='+permissionDefaults[i].u+' data-enable='+permissionDefaults[i].enable+'>\n';
	newdata += '					<td>'+ escapeHTML(permissionDefaults[i].position) +'</td>\n';
	newdata += '					<td>'+ escapeHTML(permissionDefaults[i].sub) +'</td>\n';
	
	newdata += '						<td style="text-align:center;"><label for="permissionID'+i+'p3" style="border:none;" ></label><input type="checkbox" data-theme="d" name="PermissionID'+i+'" id="permissionID'+i+'p3" value="3" '+escapeHTML(permissionDefaults[i].full)+' '+full+' ></td>'; 
	newdata += '						<td style="text-align:center;"><div><label for="permissionID'+i+'p7" style="border:none;"></label><input type="checkbox" data-theme="d" name="PermissionID'+i+'" id="permissionID'+i+'p7" value="7" '+escapeHTML(permissionDefaults[i].ea)+' '+ea+' ></div></td>';
	newdata += '						<td style="text-align:center;"><div><label for="permissionID'+i+'p6" style="border:none;"></label><input type="checkbox" data-theme="d" name="PermissionID'+i+'" id="permissionID'+i+'p6" value="6" '+escapeHTML(permissionDefaults[i].va)+' '+va+' ></div></td>';
	newdata += '						<td style="text-align:center;"><div><label for="permissionID'+i+'p5" style="border:none;"></label><input type="checkbox" data-theme="d" name="PermissionID'+i+'" id="permissionID'+i+'p5" value="5" '+escapeHTML(permissionDefaults[i].ep)+' '+ep+' ></div></td>';
	newdata += '						<td style="text-align:center;"><div><label for="permissionID'+i+'p4" style="border:none;"></label><input type="checkbox" data-theme="d" name="PermissionID'+i+'" id="permissionID'+i+'p4" value="4" '+escapeHTML(permissionDefaults[i].vp)+' '+vp+' ></div></td>';
	
	newdata += '					</tr>\n';
  

}
	newdata += '					</table>\n';
newdata += '		  </li>\n';
newdata += '		  </ul>\n';													
newdata += '		</fieldset>';
newdata += '		<ul data-role="listview" data-theme="d" data-inset="true" data-count-theme="f" style="margin-top: 0;" class="ui-icon-alt;">';

/*
newdata += '			<li class="ui-body ui-body-b">';
newdata += '				<div class="ui-grid-a ui-responsive">';
newdata += '					<div class="ui-block-a"><input type="button" data-role="button" value="Import JSON" data-theme="d" id="buttonImport" /></div>';
newdata += '					<div class="ui-block-b"><input type="button" data-role="button" value="Export JSON" data-theme="d" id="buttonExport" /></div>';
newdata += '			    </div>';
newdata += '			</li>	';			
*/	
	
newdata += '			<li class="ui-body ui-body-b">';
newdata += '				<div class="ui-grid-a ui-responsive">';
newdata += '					<div class="ui-block-a"><input type="submit" data-role="button" value="Update" data-theme="g" id="buttonSubmit" /></div>';
newdata += '					<div class="ui-block-b"><input type="button" data-role="button" value="Cancel" data-theme="d" id="buttonCancel" /></div>';
newdata += '			    </div>';
newdata += '			</li>	';
						
			

			
newdata += '		</ul>';
newdata += '		</form>';

newdata += '	<div data-role="popup" id="importPopup" data-overlay-theme="a" class="ui-content" data-theme="e" data-transition="fade">';
newdata += '		<a href="#" id="closeImportPopupButton" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>';
newdata += '		<div id="importPopupContent">\n'
newdata +=			'<ul data-role="listview" data-inset="true" style="min-width: 300px;" data-theme="d" >';  //class="ui-icon-alt"
newdata +=				'<li data-role="divider" data-theme="a">Import or Export Position Permissions File</li>';
newdata +=				'<li data-role="divider" data-theme="e">Export as json:</li>';
newdata +=	'			<li><input type="button" value="Export" data-theme="g" id="buttonExport" ></li>';
newdata +=				'<li data-role="divider" data-theme="e">Import json: Choose file to import:</li>';
newdata +=				'<li><input id="JSONfileSelect" type="file" accept=".json" /> </li>';					
newdata +=	'			<li><input type="button" value="Import" data-theme="g" id="buttonImpPermPosImport" ><input type="button" value="Cancel" data-theme="g" id="buttonImpPermPosCancel" ></li>';
newdata +=	'			<li id="importErrEvLI">';
newdata +=	'			</li>';
newdata +=			'</ul>';	
newdata +=			'</div>';
newdata += '		<div class="clearRight"></div>';
newdata += '	</div>'
		
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
// on roster page
function ppscript() {
			$('#permissionPosition', '#PageX').click(function () {
				posPerm=true;
				var UnitID=X;
			    buildPPpage('#PageX', UnitID);
				return false;
			});
}

//on posperm page
function pescript() {
		var UnitID=X
		var dflen=0;

		for (var i=0;i<dflen;i++) {
			//set initial states		
			
			/*  this is the way it works in connection manager
			$('#permissionID'+i+'p3', '#PageX').change(function () {
				var j=$(this, '#PageX').attr('id').match(/permissionID(\d+)/)[1];
				if ($(this, '#PageX').is(':checked')) {
					$('#permissionID'+j+'p4, #permissionID'+j+'p5, #permissionID'+j+'p6, #permissionID'+j+'p7', '#PageX').checkboxradio('disable').prop('checked', true).checkboxradio('refresh');
				} else {
					$('#permissionID'+j+'p4, #permissionID'+j+'p5, #permissionID'+j+'p6, #permissionID'+j+'p7', '#PageX').checkboxradio('enable').checkboxradio('refresh');
					$('#permissionID'+j+'p7', '#PageX').trigger('change');
				}
			});
			$('#permissionID'+i+'p7', '#PageX').change(function (i) {
				var j=$(this, '#PageX').attr('id').match(/permissionID(\d+)/)[1];
				if ($(this, '#PageX').is(':checked')) {
					$('#permissionID'+j+'p4, #permissionID'+j+'p6', '#PageX').checkboxradio('disable').prop('checked', true).checkboxradio('refresh');
				} else {
					$('#permissionID'+j+'p6', '#PageX').checkboxradio('enable').checkboxradio('refresh');
				}
			});
			$('#permissionID'+i+'p6, #permissionID'+i+'p5', '#PageX').change(function (i) {
				var j=$(this, '#PageX').attr('id').match(/permissionID(\d+)/)[1];
				if ($('#permissionID'+j+'p6, #permissionID'+j+'p5', '#PageX').is(':checked')) {
					$('#permissionID'+j+'p4', '#PageX').checkboxradio('disable').prop('checked', true).checkboxradio('refresh');
				} else {
					$('#permissionID'+j+'p4', '#PageX').checkboxradio('enable').checkboxradio('refresh');
				}
			});
			*/
			
			//this way is new
			//Full
			$('#permissionID'+i+'p3', '#PageX').change(function () {
				var j=$(this, '#PageX').attr('id').match(/permissionID(\d+)/)[1];
				if ($(this, '#PageX').is(':checked')) {
					$('#permissionID'+j+'p4, #permissionID'+j+'p5, #permissionID'+j+'p6, #permissionID'+j+'p7', '#PageX').checkboxradio('disable').prop('checked', true).checkboxradio('refresh');
				} else {
					//clear everything
					$('#permissionID'+j+'p4, #permissionID'+j+'p5, #permissionID'+j+'p6, #permissionID'+j+'p7', '#PageX').checkboxradio('enable').prop('checked', false).checkboxradio('refresh');
					//$('#permissionID'+j+'p4, #permissionID'+j+'p5, #permissionID'+j+'p6, #permissionID'+j+'p7', '#PageX').checkboxradio('enable').checkboxradio('refresh');
					//$('#permissionID'+j+'p7', '#PageX').trigger('change');
				}
			});
			// Edit Advancement
			$('#permissionID'+i+'p7', '#PageX').change(function (i) {
				var j=$(this, '#PageX').attr('id').match(/permissionID(\d+)/)[1];
				if ($(this, '#PageX').is(':checked')) {
					$('#permissionID'+j+'p4, #permissionID'+j+'p6', '#PageX').checkboxradio('disable').prop('checked', true).checkboxradio('refresh');
				} else {
					
					
					$('#permissionID'+j+'p6', '#PageX').checkboxradio('enable').prop('checked', false).checkboxradio('refresh');
					
					if($('#permissionID'+j+'p5', '#PageX').is(':checked')) {
						//
					} else {
						//enable vp if ep not checked
						$('#permissionID'+j+'p4', '#PageX').checkboxradio('enable').checkboxradio('refresh');
					}
					
					//$('#permissionID'+j+'p6', '#PageX').checkboxradio('enable').checkboxradio('refresh');
				}
			});
			
			//View Advancement
			$('#permissionID'+i+'p6', '#PageX').change(function (i) {
				var j=$(this, '#PageX').attr('id').match(/permissionID(\d+)/)[1];
				if ($('#permissionID'+j+'p6', '#PageX').is(':checked')) {
					$('#permissionID'+j+'p4', '#PageX').checkboxradio('disable').prop('checked', true).checkboxradio('refresh');
				} else {
					if ($('#permissionID'+j+'p5', '#PageX').is(':checked')) {
					}else{
						$('#permissionID'+j+'p4', '#PageX').checkboxradio('enable').checkboxradio('refresh');
					}
				}
			});			
			
			//Edit Profile
			$('#permissionID'+i+'p5', '#PageX').change(function (i) {
				var j=$(this, '#PageX').attr('id').match(/permissionID(\d+)/)[1];
				if ($('#permissionID'+j+'p5', '#PageX').is(':checked')) {
					$('#permissionID'+j+'p4', '#PageX').checkboxradio('disable').prop('checked', true).checkboxradio('refresh');
				} else {
					//only change if ea or va is not set
					if ($('#permissionID'+j+'p6, #permissionID'+j+'p5', '#PageX').is(':checked')) {
						$('#permissionID'+j+'p4', '#PageX').checkboxradio('disable').checkboxradio('refresh');
					} else {
						$('#permissionID'+j+'p4', '#PageX').checkboxradio('enable').prop('checked', false).checkboxradio('refresh');
					};
				}
			});				
			
			
		}
		
		
		var txtunit=X;
		$('#buttonPosPermSave', '#PageX').click(function () {

			setPerms(txtunit,true);
			return false;
		});
				
		$('#buttonSubmit', '#PageX').click(function () {
			
			$('input[type="checkbox"]', '#PageX').checkboxradio('disable').checkboxradio('refresh');
			$('#buttonSubmit', '#PageX').button('disable');
			$('#buttonCancel', '#PageX').button('disable');
			
			//don't allow an update until initial defaults are overwritten
			if(checkPermDefault(txtunit) == true) {
				$('input[type="checkbox"]', '#PageX').checkboxradio('enable').checkboxradio('refresh');
				$('#buttonSubmit', '#PageX').button('enable');
				$('#buttonCancel', '#PageX').button('enable');
				return false;
			}
			
			$('#buttonSubmit', '#PageX').button('disable');
			$('#buttonCancel', '#PageX').button('disable');
		
		//should disable all fields
		
		
			setPerms(txtunit,false);
			$.mobile.loading('show', { theme: 'a', text: 'Please be patient, large units may take a while...', textonly: false });			
			createChangeList(UnitID);
			return false;
		});


		$('#buttonCancel', '#PageX').click(function () {

			$('#buttonSubmit', '#PageX').button('disable');
			$('#buttonCancel', '#PageX').button('disable');
			
			adultlist=[];
				
			$.mobile.changePage(
				
					'https://' + hostX + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID=X',
				
				{
					allowSamePageTransition: true,
					transition: 'none',
					showLoadMsg: true,
					reloadPage: true
				}
			);					
						

			return false;
		});	
	
/*
	   var lin1 = '<span style="display: inline;" id="rsvpReportDIV">\n';
	   lin1 += '<a data-role="button" data-theme="d" data-inline="true" data-mini="true" href="#rsvpRptMenu" data-rel="popup" data-transition="slideup" id="rsvpReports">\n';
	   lin1 += '<div style="margin-left: 25px; position: relative; ">\n';
	   lin1 += '<img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/ReportsBSA100gray.png" style="position: absolute; width: 24px; left: -28px; top: -4px; " />\n';
	   lin1 += '<span class="text">RSVP Report</span>\n';
	   lin1 += '</div>\n';
	   lin1 += '</a>\n';
	   lin1 += '</span>';

*/	
		
	$('#buttonImpExp', '#PageX').click(function () {
		$('#importPopup', '#PageX').popup({ tolerance: '10,40', transition: 'pop', positionTo: 'window', history: false }).popup('open');
		return false;
	});
	$('#buttonExport', '#PageX').click(function () {
		saveText('positionpermissions.JSON',JSON.stringify(permissionDefaults));
		setTimeout(function() {
			$('#importPopup', '#PageX').popup('close');
			$('#buttonImpPermPosImport', '#PageX').button('enable');
			$('#buttonImpPermPosCancel', '#PageX').button('enable');
			document.getElementById("JSONfileSelect").disabled = false;						
		},100);	
			return false;
	});	
	
	$('#buttonImpPermPosImport', '#PageX').click(function () {


		// disable all inputs
		$('#buttonImpPermPosImport', '#PageX').button('disable');
		$('#buttonImpPermPosCancel', '#PageX').button('disable');

		var size = 0;
		var files = document.getElementById('JSONfileSelect').files;			//file1

		if (files.length == 0) {
			showErrorPopup('Please select the file you want to import and try again.');
			$('#buttonImpPermPosImport', '#PageX').button('enable');
			$('#buttonImpPermPosCancel', '#PageX').button('enable');
			document.getElementById("JSONfileSelect").disabled = false;
			return false;
		}
		var file= files[0];
					$.mobile.loading('show', { theme: 'a', text: 'Loading...', textonly: false });
			

				var reader = new FileReader();
				reader.onload = function(){
					var data = reader.result;

					$.mobile.loading('hide');
					//$.mobile.loading('show', { theme: 'a', text: 'saving... this can take several minutes for large numbers of events', textonly: false });
					document.getElementById("JSONfileSelect").disabled = true;

					var permissionDefaults2 = JSON.parse(data);
					var fileok=true;
					var vok=false;

					if (permissionDefaults.length != permissionDefaults2.length ) {
					  alert('The file you selected does not match current definitions and cannot be used');
					  fileok=false;
					  
					} else {
						// go thru each
						for(var i=0;i<permissionDefaults.length;i++) {
							if (permissionDefaults[i].positionID != permissionDefaults2[i].positionID) {
								 alert('The file you selected does not match current definitions and cannot be used');
								 fileok=false;
								 break;
							}
							
							vok=false;
							if(typeof permissionDefaults[i].positionID == "string") {
								if(typeof permissionDefaults[i].position == "string") {
									if(typeof permissionDefaults[i].enable == "string"  || typeof permissionDefaults[i].enable == "number") {
										if(typeof permissionDefaults[i].ea == "string") {
											if(typeof permissionDefaults[i].ep == "string") {
												if(typeof permissionDefaults[i].va == "string") {
													if(typeof permissionDefaults[i].vp == "string") {
														if(typeof permissionDefaults[i].full == "string") {
															if(typeof permissionDefaults[i].sub == "string") {
																if(typeof permissionDefaults[i].u == "string") {
																	vok=true;
																}													
															}													
														}															
													}														
												}													
											}											
										}										
									}
								}
							}
							if(vok==false) {
								 alert('The file you selected does not match current definitions and cannot be used');
								 fileok=false;
								 break;								
							}
						}
						$.mobile.loading('hide');
					
						
						//update view 3 7 6 5 4
						var chk=false;
						if(fileok==true) {
							permissionDefaults=permissionDefaults2;
							for(var i=0;i<permissionDefaults.length;i++) {
								chk=false
								if(permissionDefaults[i].full=="checked") chk=true;
								$('tr[data-positionid="'+permissionDefaults[i].positionID+'"] td input[value="3"]').prop('checked',chk).checkboxradio('refresh')
								chk=false
								if(permissionDefaults[i].ea=="checked") chk=true;
								$('tr[data-positionid="'+permissionDefaults[i].positionID+'"] td input[value="7"]').prop('checked',chk).checkboxradio('refresh')								
								chk=false
								if(permissionDefaults[i].va=="checked") chk=true;
								$('tr[data-positionid="'+permissionDefaults[i].positionID+'"] td input[value="6"]').prop('checked',chk).checkboxradio('refresh')	
								chk=false
								if(permissionDefaults[i].ep=="checked") chk=true;
								$('tr[data-positionid="'+permissionDefaults[i].positionID+'"] td input[value="5"]').prop('checked',chk).checkboxradio('refresh')	
								chk=false
								if(permissionDefaults[i].vp=="checked") chk=true;
								$('tr[data-positionid="'+permissionDefaults[i].positionID+'"] td input[value="4"]').prop('checked',chk).checkboxradio('refresh')									
							}
							
							alert('Updated.  If you wish to save, please save as default')
							
			
						
	//newdata += '						<td style="text-align:center;"><label for="permissionID'+i+'p3" style="border:none;" ></label><input type="checkbox" data-theme="d" name="PermissionID'+i+'" id="permissionID'+i+'p3" value="3" '+escapeHTML(permissionDefaults[i].full)+' '+full+' ></td>'; 
	//newdata += '						<td style="text-align:center;"><div><label for="permissionID'+i+'p7" style="border:none;"></label><input type="checkbox" data-theme="d" name="PermissionID'+i+'" id="permissionID'+i+'p7" value="7" '+escapeHTML(permissionDefaults[i].ea)+' '+ea+' ></div></td>';
	//newdata += '						<td style="text-align:center;"><div><label for="permissionID'+i+'p6" style="border:none;"></label><input type="checkbox" data-theme="d" name="PermissionID'+i+'" id="permissionID'+i+'p6" value="6" '+escapeHTML(permissionDefaults[i].va)+' '+va+' ></div></td>';
	//newdata += '						<td style="text-align:center;"><div><label for="permissionID'+i+'p5" style="border:none;"></label><input type="checkbox" data-theme="d" name="PermissionID'+i+'" id="permissionID'+i+'p5" value="5" '+escapeHTML(permissionDefaults[i].ep)+' '+ep+' ></div></td>';
	//newdata += '						<td style="text-align:center;"><div><label for="permissionID'+i+'p4" style="border:none;"></label><input type="checkbox" data-theme="d" name="PermissionID'+i+'" id="permissionID'+i+'p4" value="4" '+escapeHTML(permissionDefaults[i].vp)+' '+vp+' ></div></td>';							
						}
						
					}

					setTimeout(function() {
						$('#importPopup', '#PageX').popup('close');
						$('#buttonImpPermPosImport', '#PageX').button('enable');
						$('#buttonImpPermPosCancel', '#PageX').button('enable');
						document.getElementById("JSONfileSelect").disabled = false;						
					},100);							
					return false;

				};
				reader.readAsText(file);		
		
	});
	
	$('#buttonImpPermPosCancel', '#PageX').click(function () {	

		$('#importPopup', '#PageX').popup('close');
		$('#buttonImpPermPosImport', '#PageX').button('enable');
		$('#buttonImpPermPosCancel', '#PageX').button('enable');
		document.getElementById("JSONfileSelect").disabled = false;				
		return false;
	});	
				
}
	var adultlist=[];
function buildPPpage(pageid,unitID){
	
	
	
	$.mobile.loading('show', { theme: 'a', text: 'Loading table...', textonly: false });	
	
	adultlist=[]
	// Since we are on the roster page, get all the positions
	var name;
	var id;
	var poslist;
	var denpatrol;

	var scoutlist=[];
	var scoutObj = {name:'',id:'',denpatrol:''};

	var denpatrolLst=[];
	
	//  while on the roster, get scout id and patrol affiliation
	$('a[href*="account.asp?ScoutUserID="]').each( function () {
		if($(this).attr('href').match(/ScoutUserID=(\d+)/)!= null) {
		scoutObj.id=$(this).attr('href').match(/ScoutUserID=(\d+)/)[1];
		scoutObj.name=$(this).text().trim();
		scoutObj.denpatrol=$(this).parent().find('.positions').text().split(',')[0].trim();
		scoutlist.push(JSON.parse(JSON.stringify(scoutObj)));
		}
		//console.log(id,name,denpatrol);
	});		
	var found=false;
	for (var i=0;i<scoutlist.length;i++) {
		found=false;
		for (var j=0;j<denpatrolLst.length;j++) {
			if (denpatrolLst[j].denpatrol  == scoutlist[i].denpatrol) {
				// add scout
				//found
				found=true;
				denpatrolLst[j].id.push(scoutlist[i].id);
			}
		}
		if(found== false) {
			denpatrolLst.push({denpatrol: scoutlist[i].denpatrol, id:[scoutlist[i].id]});
		}
	}
	// now have a denpatrol list of {denpatrol:  , id:[]}
	
	var adultObj = {name:'',id:'',positions:[]};
	var posObj = {position:'', subunit:'',ids:[]};
	$('a[href*="AdultUserID="]').each( function () {
		adultObj = {name:'',id:'',positions:[]};
		if($(this).attr('href').match(/AdultUserID=(\d+)/) != null) {
			adultObj.id=$(this).attr('href').match(/AdultUserID=(\d+)/)[1];
			adultObj.name=$(this).text().trim();
			poslist=$(this).parent().find('.positions').text().split(',');
			
		   posObj.ids=[];	
		   for (var i=0;i<poslist.length;i++) {
				posObj = {position:'', subunit:'',ids:[]};
				posObj.position=poslist[i].trim();
				if(poslist[i].match(/( Patrol| Den )/) != null) {   // had a \d
					adultObj.positions.push(JSON.parse(JSON.stringify(posObj)));  //save generic pos
					//get all scout ids for this entity
					for(var j=0;j<denpatrolLst.length;j++) {
						if(poslist[i].indexOf(denpatrolLst[j].denpatrol) != -1) {
							// add denpatrolLst[j].id  list
							posObj.ids=denpatrolLst[j].id;
							posObj.subunit=denpatrolLst[j].denpatrol;
						}
					}
					
					
				}
				
				adultObj.positions.push(JSON.parse(JSON.stringify(posObj)));			
		   }		
			
			//console.log(id,name,poslist);
			adultlist.push(JSON.parse(JSON.stringify(adultObj)));
		}
	});
	
	/*
	    adultlist[{name:'',id:'',positions:[{position:'', subunit:'', ids:[]]}]
		
		adult   pos scoutid
					scoutid
				pos	scoutid
					scoutid
				pos	''
	
		adult	pos	''
	*/
	
	// now add parent
	
	var settings;
	if($('#showParents:checked').length==1) {
		//parent is showing, add to list directly, no need to reset views
		addParents(unitID,''); 	//set global connectionlist
		matchConIDToAdult(unitID);
	} else {
		settings=$('#customizeScoutRosterForm').serialize() + '&ShowParents=1';
		setRosterView(pageid,unitID,settings,getParentRoster,pageid,unitID,$('#customizeScoutRosterForm').serialize());
	}
}


function getParentRoster(pageid,unitID) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,closePosPerm,[unitID],getParentRoster,[pageid,unitID]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			addParents(unitID,this.response);  //set global connectionlist
			//reset the roster view
			var settings=$('#customizeScoutRosterForm').serialize();  // gets current settings from visible page
			setRosterView(pageid,unitID,settings,matchConIDToAdult, unitID,settings)
		}
	}		
	
	
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID=' + unitID;

	xhttp.open("GET",url , true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,closePosPerm,[unitID],getParentRoster,[pageid,unitID]);
	};	
}

var scoutConLst=[];
function addParents(unitID,response) {
   
	var scoutConObj={scoutid:'',conid:''};
	$('a[href*="ConnectionID="]',response).each( function () {
		scoutConObj.conid=$(this).attr('href').match(/ConnectionID=(\d+)/)[1];
		scoutConObj.scoutid=$(this).attr('href').match(/ScoutUserID=(\d+)/)[1];
		pushUnique(scoutConLst,JSON.parse(JSON.stringify(scoutConObj)));
	});
	
}

function matchConIDToAdult(unitID) {
	//open the connection manager
	var found=false;
	var parentid;
	var parentAdultMatch=false;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,closePosPerm,[unitID],matchConIDToAdult,[unitID]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			//find connection is
			for(var i=0;i<scoutConLst.length;i++) {
				// find this connection to get the adult id
				
				// adultlist[{name:'',id:'',positions:[{position:'', subunit:'', ids:[]]}]
				//var dres=this.response.match(/div\[data-connectionid=\d+\]/g);
				var dres=$('div[data-connectionid]',this.response)
				for(var j=0;j<dres.length;j++) {
					if($(dres[j]).attr('data-connectionid') == scoutConLst[i].conid) {
						parentid=$(dres[j]).attr('data-connecteduserid');
						
						var parentname=$('div[data-connecteduserid='+parentid+'][data-name]',this.response).attr('data-name');
						parentAdultMatch=false;
						for (k=0;k<adultlist.length;k++) {
							if(adultlist[k].id == parentid) {
								parentAdultMatch=true;
								//aupdate the adult list with parent as pos and idlist 
								found=false;
								for(m=0;m<adultlist[k].positions.length;m++) {
									if(adultlist[k].positions[m].position == 'Parent/Guardian' && adultlist[k].positions[m].subunit == 'Own Child') {
										// add the scout id
										found=true;
										pushUnique(adultlist[k].positions[m].ids,scoutConLst[i].scoutid);
										break;
									}
								}
								if(found==false) {
									var posObj= {position:'Parent/Guardian', subunit:'Own Child',ids:[scoutConLst[i].scoutid]};
									adultlist[k].positions.push( JSON.parse(JSON.stringify(posObj))  );
									var posObj= {position:'Parent/Guardian', subunit:'',ids:[]};
									adultlist[k].positions.push( JSON.parse(JSON.stringify(posObj))  );									
									//var posObj= {position:'Parent/Guardian', subunit:'',ids:[]};
									//adultlist[k].positions.push( JSON.parse(JSON.stringify(posObj))  );									
								}
								break;
							}
						}
						if(parentAdultMatch==false) {
							//this parent was not found in the adult list
							var positionl=[{position:'Parent/Guardian', subunit:'Own Child',ids:[scoutConLst[i].scoutid]},{position:'Parent/Guardian', subunit:'',ids:[]}]
							var adultObj = {name:parentname,id:parentid,positions:positionl};
							//var posObj= {position:'Parent/Guardian', subunit:'',ids:[scoutConLst[i].scoutid]};
							adultlist.push( JSON.parse(JSON.stringify(adultObj))  );	

							
						}
						break;
					}
				}
			}


			
			//console.log(adultlist);

			//alert('next step.');
			
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
	}		
	
	
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connectionsmanager.asp?UnitID='+unitID+'&DenID=&PatrolID='

	xhttp.open("GET",url , true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,closePosPerm,[unitID],matchConIDToAdult,[unitID]);
	};	
}
/*
Nav to connection page
//Build a list of all the connections ... that need to be changed

*/
function createChangeList(unitID) {
	var admin=false;
	var adultid;
	var scoutid;
	var adultname;
	var connectionid;
	var position;
	var permpairFound=false;
	var permPairs=[];
	var perm={};
	var foundpos=false;
	var sublistScout=false;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,closePosPerm,[unitID],createChangeList,[unitID]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			for(var i=0;i<adultlist.length;i++) {
				admin=false;
				//first see if they are an admin/connectionsmanager
				//adultlist[{name:'',id:'',positions:[{position:'', subunit:'', ids:[]]}]
				for(j=0;j<adultlist[i].positions.length;j++) {
					if(adultlist[i].positions[j].position.match(/(Troop|Pack|Crew|Team|Ship) Admin/) != null) {
						admin=true;
						//console.log('Skipping admin',adultlist[i].id,adultlist[i].name);
						break;
					}
				}
				//if(admin==false) {		// don't mess with an Admin!  Skip this adult
				
					adultid=adultlist[i].id;
					adultname=adultlist[i].name;
					//console.log(adultlist[i].id,adultlist[i].name);
					
					var dres=$('div[data-connectionid]',this.response);		// look at only table entries with a connection id attribute
					for(var jj=0;jj<dres.length;jj++) {
						if($(dres[jj]).attr('data-connecteduserid') == adultid) {		// THis intersection contains the adultid
							// pay attention to this one
							scoutid=$(dres[jj]).attr('data-userid');
							connectionid=$(dres[jj]).attr('data-connectionid');
							
							//ignore scouts with Account as last name

							var tdIndex = $('div[data-userid='+scoutid+'][data-connecteduserid='+adultid+']',this.response).closest('td').index();
							if($('#topRow td:eq('+tdIndex+')',this.response).html().match(/<br>([^<]+)</)[1]!='Account') {							
								//not an Account
							

								//console.log('      ',scoutid,connectionid);
								
								//for this adult and this scout in the manager table
								for(var j=0;j<adultlist[i].positions.length;j++) {				// Check out the positions that this adult holds.  Look at each
									position=adultlist[i].positions[j].position;
									
									//now find the default permissions for this permission
									foundpos=false;
									for(var k=0;k<permissionDefaults.length;k++) {						// 	Find default permissions.
										if(permissionDefaults[k].position=='Parent' && position=='Parent/Guardian') {
											//skip this, not valid match
										} else if(position.indexOf(permissionDefaults[k].position) == 0) {		//  This position matches

										
										   //console.log('                ',position);
										   foundpos=true;

										   if(permissionDefaults[k].sub == '') {						// is this permission set for all scouts or a subset?
												//console.log('                       All Scouts');
											  //applies to all scouts
											//was this adult-scout set before?
											permpairFound=false;
											for(m=0;m<permPairs.length;m++) {
												if(permPairs[m].scoutid==scoutid && permPairs[m].adultid==adultid) {
													//this scout-adult permission set needs to be modified
													permpairFound=true;
													//console.log('                              ----Matched');
													
													if(admin==false) {
														if (permissionDefaults[k].full == 'checked') {
															permPairs[m].full = 'checked';
															permPairs[m].ea = 'checked';
															permPairs[m].va = 'checked';
															permPairs[m].ep = 'checked';												
															permPairs[m].vp = 'checked';	
														}
				
														if (permissionDefaults[k].ea == 'checked') {
															permPairs[m].ea = 'checked';
															permPairs[m].va = 'checked';												
															permPairs[m].vp = 'checked';	
														}	

														if (permissionDefaults[k].va == 'checked') {
															permPairs[m].va = 'checked';												
															permPairs[m].vp = 'checked';	
														}												
														
														if (permissionDefaults[k].ep == 'checked') {
															permPairs[m].ep = 'checked';												
															permPairs[m].vp = 'checked';	
														}

														if (permissionDefaults[k].vp == 'checked') {												
															permPairs[m].vp = 'checked';	
														}	
													
													} else {
															//admins are always full
															permPairs[m].full = 'checked';
															permPairs[m].ea = 'checked';
															permPairs[m].va = 'checked';
															permPairs[m].ep = 'checked';												
															permPairs[m].vp = 'checked';
															permPairs[m].ignore = true;
														
													}
													break;
												}
											}
											sublistScout=true;
										   } else {
												//console.log('                       Sublist Scouts');
											   // applies only to sublist of scouts.  
											   // is this scout in the connectionmanager on the subunit list?

											   // Don't try to change permissions if the scout is not sublisted.  If sublisted, change.
											   // this scoutid and parent connection does not need to be added if it isn;t in the sublist
											   
											   
											   
											   sublistScout=false;
											   for(n=0;n<adultlist[i].positions[j].ids.length;n++) {
												   if(scoutid==adultlist[i].positions[j].ids[n]) {
													   sublistScout=true;
													   //it is in the sublist
														//console.log('                in sublist ');
													   permpairFound=false;
														for(var p=0;p<permPairs.length;p++) {
															if(permPairs[p].scoutid==scoutid && permPairs[p].adultid==adultid) {											   
																	//console.log('                              ----Matched');
																if(admin==false && permissionDefaults[k].positionID!= '3003' && permissionDefaults[k].positionID!= '1001'  ) {
																	if (permissionDefaults[k].full == 'checked') {
																		permPairs[p].full = 'checked';
																		permPairs[p].ea = 'checked';
																		permPairs[p].va = 'checked';
																		permPairs[p].ep = 'checked';												
																		permPairs[p].vp = 'checked';	
																	}
							
																	if (permissionDefaults[k].ea == 'checked') {
																		permPairs[p].ea = 'checked';
																		permPairs[p].va = 'checked';												
																		permPairs[p].vp = 'checked';	
																	}	

																	if (permissionDefaults[k].va == 'checked') {
																		permPairs[p].va = 'checked';												
																		permPairs[p].vp = 'checked';	
																	}												
																	
																	if (permissionDefaults[k].ep == 'checked') {
																		permPairs[p].ep = 'checked';												
																		permPairs[p].vp = 'checked';	
																	}

																	if (permissionDefaults[k].vp == 'checked') {												
																		permPairs[p].vp = 'checked';	
																	}	
																} else {
																	//force admin, Den Admin, parent of own child to have full control - or just ignore
																	permPairs[p].full = 'checked';
																	permPairs[p].ea = 'checked';
																	permPairs[p].va = 'checked';
																	permPairs[p].ep = 'checked';												
																	permPairs[p].vp = 'checked';
																	permPairs[p].ignore =true;
																}																	
																permpairFound=true;
																break;  //scout id was in the permPairs list
															}
														}

														break;  //scout id was found in the subunit id list
												   }
											   }
											   //
											   if(sublistScout==false) {
												   //scout is not in this adult's sublist
												   //console.log('              not in sublist');
													for(var p=0;p<permPairs.length;p++) {
														if(permPairs[p].scoutid==scoutid && permPairs[p].adultid==adultid) {
															permpairFound=true;
															//console.log('                              ----Matched');
														}
													}												   
											   }
											   
											   
											   
											   
											   
											   
										   }
											// set permissions for this adult/scout position connection
											if (permpairFound == false) {
												
												//doublecheck
												for(var p=0;p<permPairs.length;p++) {
													if(permPairs[p].scoutid==scoutid && permPairs[p].adultid==adultid) {
														alert('already pushed');
													}
												}														
												
												
												
												//need to create a new permpair entry
												perm= {adultid:'',name:'',scoutid:'',connectionid:'',full:'', ea:'',va:'',ep:'',vp:'',ignore:false};
												perm.adultid=adultid;
												perm.name=adultname;
												perm.scoutid=scoutid;
												perm.connectionid=connectionid;
												//if(sublistScout==true) {
													perm.full = permissionDefaults[k].full;
													perm.ea = permissionDefaults[k].ea;
													perm.va = permissionDefaults[k].va;
													perm.ep = permissionDefaults[k].ep;
													perm.vp = permissionDefaults[k].vp;
													
												//}
												permPairs.push(JSON.parse(JSON.stringify(perm)));
												//console.log('                                   ----create new record',perm);
											}
											
										}
									}
									if(foundpos==false) {
										//console.log('no matching position',position);
									}
									
								}
							} else {
								//console.log('Account ignored',adultname);
							}
						}
						
					}
				//}
			}
			
			//console.log(permPairs);
			//debugger;
			
			//permPairs has all the info needed to start setting connections.
			//However, not all connections may need resetting.
			//var oneis=false;
			for(var i=0; i< permPairs.length;i++) {
				
				permPairs[i]['update']=0;

				//if (permPairs[i].ignore == true ) {
								
					
				var thisOne=$('div[data-connecteduserid='+permPairs[i].adultid+'][data-userid='+permPairs[i].scoutid+']',this.response);
					
				//verify images are correct for what we want to see

					
				if (permPairs[i].full == 'checked') {
					if($(thisOne).has('img.perm3').length ==0 ) {
						permPairs[i]['update']=1;
					}
				} else {
					if (permPairs[i].ea == 'checked') {
						if($(thisOne).has('img.perm7').length ==0  || $(thisOne).has('img.perm6').length ==0) {
							permPairs[i]['update']=1;
						}
					} else if (permPairs[i].va == 'checked') {
						if($(thisOne).has('img.perm6').length ==0) {
							permPairs[i]['update']=1;
						}
					}
					if (permPairs[i].ep == 'checked') {
						if($(thisOne).has('img.perm5').length ==0) {
							permPairs[i]['update']=1;
						}
					} else if (permPairs[i].vp == 'checked') {
						if($(thisOne).has('img.perm4').length ==0) {
							permPairs[i]['update']=1;
						}
					}
				}
			
				// -verify what is checked is ok
			
				if($(thisOne).has('img.perm3').length > 0 ) {
					if (permPairs[i].full != 'checked') {
						permPairs[i]['update']=1;
					}
				}
				
				if($(thisOne).has('img.perm7').length > 0 ) {
					if (permPairs[i].ea != 'checked') {
						permPairs[i]['update']=1;
					}
				}		

				if($(thisOne).has('img.perm6').length > 0 ) {
					if (permPairs[i].va != 'checked') {
						permPairs[i]['update']=1;
					}
				}					

				if($(thisOne).has('img.perm5').length > 0 ) {
					if (permPairs[i].ep != 'checked') {
						permPairs[i]['update']=1;
					}
				}	
				
				if($(thisOne).has('img.perm4').length > 0 ) {
					if (permPairs[i].vp != 'checked') {
						permPairs[i]['update']=1;
					}
				}				


				
				
				if(permPairs[i]['update']==1) {
					//console.log(permPairs[i]);
				}
				
				//}
			}
			//console.log(permPairs);
			//debugger;
			
			var found=false;
			var misslist='';
			$('div[data-connecteduserid][data-name]',this.response).each (function () {
				found=false;
				for(var i=0;i<adultlist.length;i++) {
					if(adultlist[i].id ==$(this).attr('data-connecteduserid')) {
						found=true;
						break;
					}

				}
				if(found==false) {

					misslist+= '\n   '+$(this).attr('data-name');
				}				
			});
			
			if(misslist!='') {
				alert('The following adults are connected to Scouts but are not part of your Unit Roster:\n'+ misslist);
			}
			//debugger;
			//closePosPerm(unitID);
			iteratePosPermIntersectScout(unitID,permPairs);

			

			
		}
	}		
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connectionsmanager.asp?UnitID='+unitID+'&DenID=&PatrolID='

	xhttp.open("GET",url , true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,closePosPerm,[unitID],createChangeList,[unitID]);
	};	
}



function iteratePosPermIntersectScout(unitID,permPairs) {
	var denID='';
	var patrolID='';
	if(permPairs.length==0) {
		//closeConMgr(unitID,patrolID,denID);
		closePosPerm(unitID);
		return;		
	}
	 
	 var evObj={};
	 while(true) { 
		if(permPairs.length==0) {
			closePosPerm(unitID);
			return;
		}
		evObj=permPairs.shift();
		if(evObj.update==1) {
		  break;
		}
	 }
	
	
	
	var connectionid=evObj.connectionid;
	var scoutid=evObj.scoutid;
	var adultid=evObj.adultid;
	
	var perms='';
	
	if(evObj.full=='checked') {
		perms+='PermissionID=3&';
	} else {
		if (evObj.ea=='checked') {
			perms+='PermissionID=7&';
		} else if (evObj.va=='checked') {
			perms+='PermissionID=6&';
		}
		if (evObj.ep=='checked') {
			perms+='PermissionID=5&';
		} else if (evObj.vp=='checked') {
			perms+='PermissionID=4&';
		}
	}
	
	if(perms=='') {
		connectionid='';
	}

	var formPost=perms +'ConnectionID='+connectionid+'&UserID='+scoutid+'&ConnectedUserID='+adultid; 
	//console.log(evObj.name,formPost);
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,closePosPerm,[unitID],iteratePosPermIntersectScout,[unitID,permPairs]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			serveErrCnt=0;
			setTimeout(function() {
				iteratePosPermIntersectScout(unitID,permPairs);
			},100);
		}
	};
	
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connectionsmanager.asp?Action=UpdateConnection&UnitID='+unitID+'&DenID='+denID+'&PatrolID='+patrolID;
	xhttp.open("POST",url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formPost);
			
	xhttp.onerror = function() {
		errStatusHandle(500,closePosPerm,[unitID],iteratePosPermIntersectScout,[unitID,permPairs]);
	};			
	
}

function closePosPerm(unitID) {
			$.mobile.changePage(
				
					'https://' + host + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID='+unitID,
				
				{
					allowSamePageTransition: true,
					transition: 'none',
					showLoadMsg: true,
					reloadPage: true
				}
			);	
}