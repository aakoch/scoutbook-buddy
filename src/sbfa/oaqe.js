// Copyright © 10/4/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.
function addRawOAQE(data,pageid,unitID,txtunit) {
	oaQE=false;
	// Replace heading
	var startfunc = data.indexOf('<span style="margin-left: 5px; ">',1);
	var endfunct = data.indexOf('</h1>',1);				
	
	var newdata = data.slice(0,startfunc);
	newdata += '<span style="margin-left: 5px; ">';
	newdata += '		<a href="#" id="buttonRefresh" class="text">'+escapeHTML(txtunit)+'</a>';
	if(QEPatrol != '') {
		newdata += '		<a id="goToDenPatrol" href="'+escapeHTML('/mobile/dashboard/admin/denpatrol.asp?UnitID='+unitID+'&DenID=&PatrolID='+QEPatrolID)+'" class="text" data-direction="reverse">'+QEPatrol+'</a>';
	}
	newdata += '           Record Multiple Scout OA Member Data';
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
	newdata += setOAPageContent(txtunit);
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
	newdata += '		#Page' + escapeHTML(pageid) +' div.ui-checkbox { width: 130px; }\n';			
	newdata += '	</style>';
	newdata +=  data.slice(endfunct);				
	data=newdata;				

	// replace script.  Starsts after <script tag
	var startfunc = data.indexOf('var formPost;');
	var endfunct = data.indexOf('</script>',startfunc);
	var myfunc = '' + oascript;
	myfunc = myfunc.slice(22).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(pageid)).replace(/UnitID=X/g,'UnitID='+ escapeHTML(unitID));
	var newdata = data.slice(0,startfunc) + myfunc + '\n'  + data.slice(endfunct);			
	data=newdata;			
	
	startfunc = data.indexOf('<div style="margin-top: 6px;">&copy;');
	var newdata = data.slice(0,startfunc);
	//newdata += '<div style="margin-top: 6px;">Feature Assistant Active</div>';	
	newdata += '<div style="margin-top: 6px;">This page was produced by the Feature Assistant Extension/Add-on and is not supported by BSA</div>';	
	data=newdata + data.slice(startfunc);	
	
	
	
	scoutPermObjList=[];
	//scoutProfileObjList=[];
	return data;
}
				
function oascript () {
		var formPost;
		function pageInit() {
			

			$('#oaForm', '#PageX').submit(function () {
				$('#buttonSubmit', '#PageX').focus();

				//OAMember
				//OAActive
				//OAMemberNumber:
				//OAElectionDate:
				//OAOrdealDate:
				//OABrotherhoodDate:
				//OAVigilDate:
				// way to find out if checkboxes were checked by default
			   // var x = document.getElementById("myCheck").defaultChecked;


				//instead of serializing, find out which scouts have changes and create array
				//id="oaMemberID'+scoutProfileObjList[i].id
				$('input[name*="oaMemberID"]','#PageX').each( function() {
					if($(this).attr('id').match(/\d+/) != null) {
					var scoutID=$(this).attr('id').match(/\d+/)[0];	
					if($(this)[0].checked != $(this)[0].defaultChecked) {
						for(var i=0; i< scoutProfileObjList.length;i++) {
						   if(scoutProfileObjList[i].id == scoutID){
								//update this record in scoutProfileObj
								var formData = scoutProfileObjList[i].profileData;
								//replace the OAMember 
								var chk='no';
								if($(this)[0].checked == true) {chk='yes';}
								formData=formData.replace(/OAMember=[^&]*/,'OAMember='+escapeHTML(chk));
								scoutProfileObjList[i].profileData=formData;
								scoutProfileObjList[i].update=1;
						   }
						}
					}
					}
				});				

				$('input[name*="oaActiveID"]','#PageX').each( function() {
					if($(this).attr('id').match(/\d+/) != null) {
					var scoutID=$(this).attr('id').match(/\d+/)[0];
					if($(this)[0].checked != $(this)[0].defaultChecked) {
						for(var i=0; i< scoutProfileObjList.length;i++) {
						   if(scoutProfileObjList[i].id == scoutID){
								//update this record in scoutProfileObj
								var formData = scoutProfileObjList[i].profileData;
								//replace the OAActive 
								var chk='no';
								if($(this)[0].checked == true) {chk='yes';}
								formData=formData.replace(/OAActive=[^&]*/,'OAActive='+escapeHTML(chk));
								scoutProfileObjList[i].profileData=formData;
								scoutProfileObjList[i].update=1;
						   }
						}
					}
					}
				});


				
				$('input[name*="oaMemberNumberID"]','#PageX').each( function() {
					if($(this).attr('id').match(/\d+/) != null) {
					var scoutID=$(this).attr('id').match(/\d+/)[0];
					if($(this).val() != $(this).attr('defaultValue')) {
						for(var i=0; i< scoutProfileObjList.length;i++) {
						   if(scoutProfileObjList[i].id == scoutID){
								//update this record in scoutProfileObj
								var formData = scoutProfileObjList[i].profileData;
								//replace the OAMemberNumber with $(this).val()
								formData=formData.replace(/OAMemberNumber=[^&]*/,'OAMemberNumber='+encodeURIComponent($(this).val()));
								scoutProfileObjList[i].profileData=formData;
								scoutProfileObjList[i].update=1;
						   }
						}
					}
					}
				});					
	

				$('input[name*="oaElectionDateID"]','#PageX').each( function() {
					if($(this).attr('id').match(/\d+/) != null) {
					var scoutID=$(this).attr('id').match(/\d+/)[0];
					if($(this).val() != $(this).attr('defaultValue')) {
						for(var i=0; i< scoutProfileObjList.length;i++) {
						   if(scoutProfileObjList[i].id == scoutID){
								//update this record in scoutProfileObj
								var formData = scoutProfileObjList[i].profileData;
								//replace the OAElectionDate with $(this).val()
								formData=formData.replace(/OAElectionDate=[^&]*/,'OAElectionDate='+encodeURIComponent($(this).val()));
								scoutProfileObjList[i].profileData=formData;
								scoutProfileObjList[i].update=1;
						   }
						}
					}
					}
				});		
	
				$('input[name*="oaOrdealDateID"]','#PageX').each( function() {
					if($(this).attr('id').match(/\d+/) != null) {
					var scoutID=$(this).attr('id').match(/\d+/)[0];
					if($(this).val() != $(this).attr('defaultValue')) {
						for(var i=0; i< scoutProfileObjList.length;i++) {
						   if(scoutProfileObjList[i].id == scoutID){
								//update this record in scoutProfileObj
								var formData = scoutProfileObjList[i].profileData;
								//replace the OAOrdealDate with $(this).val()
								formData=formData.replace(/OAOrdealDate=[^&]*/,'OAOrdealDate='+encodeURIComponent($(this).val()));
								scoutProfileObjList[i].profileData=formData;
								scoutProfileObjList[i].update=1;
						   }
						}
					}
					}
				});		
	
				$('input[name*="oaBrotherhoodDateID"]','#PageX').each( function() {
					if($(this).attr('id').match(/\d+/) != null) {
					var scoutID=$(this).attr('id').match(/\d+/)[0];
					if($(this).val() != $(this).attr('defaultValue')) {
						for(var i=0; i< scoutProfileObjList.length;i++) {
						   if(scoutProfileObjList[i].id == scoutID){
								//update this record in scoutProfileObj
								var formData = scoutProfileObjList[i].profileData;
								//replace the OABrotherhoodDate with $(this).val()
								formData=formData.replace(/OABrotherhoodDate=[^&]*/,'OABrotherhoodDate='+encodeURIComponent($(this).val()));
								scoutProfileObjList[i].profileData=formData;
								scoutProfileObjList[i].update=1;
						   }
						}
					}
					}
				});		

				$('input[name*="oaVigilDateID"]','#PageX').each( function() {
					if($(this).attr('id').match(/\d+/) != null) {
					var scoutID=$(this).attr('id').match(/\d+/)[0];
					if($(this).val() != $(this).attr('defaultValue')) {
						for(var i=0; i< scoutProfileObjList.length;i++) {
						   if(scoutProfileObjList[i].id == scoutID){
								//update this record in scoutProfileObj
								var formData = scoutProfileObjList[i].profileData;
								//replace the OAVigilDate with $(this).val()
								formData=formData.replace(/OAVigilDate=[^&]*/,'OAVigilDate='+encodeURIComponent($(this).val()));
								scoutProfileObjList[i].profileData=formData;
								scoutProfileObjList[i].update=1;
						   }
						}
					}
					}
				});	
				
				// disable all inputs
				$(':input', '#PageX #oaForm').attr('disabled', true);
				$('#buttonCancel, #buttonSubmit', '#PageX').button('disable');

				$.mobile.loading('show', { theme: 'a', text: 'saving...this can take several minutes for large units', textonly: false });
				setTimeout(function () {submitSForm();}, 200);
				return false;
			});

			$('#buttonCancel', '#PageX').click(function () {
				
				scoutPermObjList.length=0;
				oaQE=false;
					
				$.mobile.changePage(
					
						'https://' + host + '.scoutbook.com/mobile/dashboard/admin/unit.asp?UnitID=X&DenID=&PatrolID=&Refresh=1',
					
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
				oaQE=false;
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

				$('input[name*="oaMemberID"]','#PageX').each( function() {
					if($(this)[0].checked != $(this)[0].defaultChecked) {
						chg=true;
					}
				});

				$('input[name*="oaActiveID"]','#PageX').each( function() {
					if($(this)[0].checked != $(this)[0].defaultChecked) {
						chg=true;
					}
				});

				
				$('input[name*="oaMemberNumberID"]','#PageX').each( function() {
					if($(this).val() != $(this).attr('defaultValue')) {
						chg=true;
					}
				});
				$('input[name*="oaElectionDateID"]','#PageX').each( function() {
					if($(this).val() != $(this).attr('defaultValue')) {
						chg=true;
					}
				});				
				$('input[name*="oaOrdealDateID"]','#PageX').each( function() {
					if($(this).val() != $(this).attr('defaultValue')) {
						chg=true;
					}
				});	
				$('input[name*="oaBrotherhoodDateID"]','#PageX').each( function() {
					if($(this).val() != $(this).attr('defaultValue')) {
						chg=true;
					}
				});	
				$('input[name*="oaVigilDateID"]','#PageX').each( function() {
					if($(this).val() != $(this).attr('defaultValue')) {
						chg=true;
					}
				});			
				
				if (chg==false) {
					alert('No changes have been found');
				} else {
					$('#oaForm', '#PageX').submit();
					oaQE=false;
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
			if($('#' + id).prop('readonly')==false) {
			$('#' + id).val(valueText).trigger('change');
			}
		}
	});
			
	$('.calendarIcon', '#PageX').on('click', function() {
		var id = $(this).next('input').attr('id');
		if($('#' + id).prop('readonly')==false) {
		  $('#hidden_' + id).mobiscroll('show');
		}
	});
	
/*
oaActiveID
oaMemberNumberID
oaElectionDateID	
oaBrotherhoodDateID	
oaOrdealDateID	
oaVigilDateID
*/	
	
	$('input[id^=oaMemberID]', '#PageX').on('click', function() {
		if($(this).attr('id').match(/\d+/) !=null) {
		var id=$(this).attr('id').match(/\d+/)[0];
		//alert(id);
		if ($(this).prop('checked') ==true) {
			//alert('checked');
			//set states not readonly
			
			
			
			
			$('#oaActiveID'+id).prop('disabled',false).checkboxradio("refresh");
			
			//alert($('#oaMemberNumberID'+id).prop('readonly'));
			$('#oaMemberNumberID'+id).prop('readonly',false);
			//alert($('#oaMemberNumberID'+id).prop('readonly'));
			
			
			$('#oaElectionDateID'+id).prop('readonly',false);
			$('#oaOrdealDateID'+id).prop('readonly',false);
			$('#oaBrotherhoodDateID'+id).prop('readonly',false);
			$('#oaVigilDateID'+id).prop('readonly',false);
		} else {
			
			// reset values
			// set states readonly
			
			
			if($('#oaActiveID'+id).attr('data-defaultcheck')=='checked') {
				
				$('#oaActiveID'+id).prop('checked',true);
				
			} else {
				$('#oaActiveID'+id).prop('checked',false);	
			}
			$('#oaActiveID'+id).prop('disabled',true).checkboxradio("refresh");
			
			
			$('#oaMemberNumberID'+id).val($('#oaMemberNumberID'+id).attr('defaultValue'));
			$('#oaElectionDateID'+id).val($('#oaElectionDateID'+id).attr('defaultValue'));
			$('#oaOrdealDateID'+id).val($('#oaOrdealDateID'+id).attr('defaultValue'));
			$('#oaBrotherhoodDateID'+id).val($('#oaBrotherhoodDateID'+id).attr('defaultValue'));
			$('#oaVigilDateID'+id).val($('#oaVigilDateID'+id).attr('defaultValue'));			
			
			
			$('#oaActiveID'+id).prop('readonly',true);
			$('#oaMemberNumberID'+id).prop('readonly',true);
			$('#oaElectionDateID'+id).prop('readonly',true);
			$('#oaOrdealDateID'+id).prop('readonly',true);
			$('#oaBrotherhoodDateID'+id).prop('readonly',true);
			$('#oaVigilDateID'+id).prop('readonly',true);
		}

		}
	});	
	
		}
		
		function submitSForm() {
			if($('base')[0].href.match(/\d+/) == null) return false;
			var unitid= $('base')[0].href.match(/\d+/)[0];
			// reset all LI's to normal color
			$('li[id$=LI]', '#PageX').removeClass('ui-body-e').addClass('ui-btn-up-c');
							

			//Now we simply go through scoutProfileObjList, look for changes, and post updates.,

			setTimeout(function(){ getProfile3(unitid,'#PageX'); }, 200);

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

function pzscript() {
			$('#buttonRefresh1', '#PageX').click(function () {
				payRpt=false;
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
			});	
			$('#buttonRefresh2', '#PageX').click(function () {
				payRpt=false;
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
			});	
}






/*
name
OAMember:no
OAActive:no
OAMemberNumber:

OAElectionDate:
OAOrdealDate:
OABrotherhoodDate:
OAVigilDate:
8 fields

*/

function setOAPageContent(txtunit) {
var newdata;
newdata = '	<div data-role="content">';
newdata += '	<form id="oaForm" method="post" action="oa.asp">';
newdata += '		<input type="hidden" name="Action" value="Submit" />';
newdata += '		<ul data-role="listview" data-theme="d" data-inset="true" data-count-theme="f" style="margin-top: 0;" class="ui-icon-alt;">';

newdata += '			<li data-role="list-divider" role="heading" data-theme="a">';			
newdata += '			 Quick Entry OA Member Data';
newdata += '			</li>';
			
newdata += '			<li id="scoutsLI" data-theme="d">';
//newdata += '				<div>';
newdata += '					<p class="normalText">Now you can quickly and easily enter OA Member Data for your Troop or Team!</p>';

//newdata += '					<div style="margin-top: 1.5em; ">';

newdata += '							<legend class="text-orange">';
newdata += '								<strong>Choose Scout(s):</strong>';
newdata += '							</legend>';
newdata += '			</li>';
newdata += '			<li id="oaLI" data-theme="d">';
//newdata += '		</ul>';	
newdata += '		<fieldset data-role="controlgroup">';	
newdata += '			<div>';							
//newdata += '							<div data-role="collapsible" data-theme="a"  data-collapsed="false"  >';
//newdata += '								<h4 data-theme="a">' + txtunit + '</h4>';
//newdata += '								<fieldset data-role="controlgroup">';
//newdata += '									<div style="width=0.125%;">';
//newdata += '										<div class="ui-block-a" style="font-weight: bold; font-size: 16px;line-height:45px;">';	
//newdata += '											Scout';
//newdata +='            						     	</div>';		
//newdata += '										<div class="ui-block-b" style="font-weight: bold; font-size: 16px; line-height:45px;">';	
//newdata += '											A/B Record';
//newdata +='              						   	</div>';
//newdata += '										<div class="ui-block-c" style="font-weight: bold; font-size: 16px;line-height:45px;">';	
//newdata += '											C Record';
//newdata +='               						  	</div>';	
	newdata += '<table>\n';
for(var i=0;i<scoutProfileObjList.length;i++){
	var member=false;

	//if (getFormVal(scoutProfileObjList[i].profileData,'FirstName') + ' ' + getFormVal(scoutProfileObjList[i].profileData,'LastName') !='UnitPaylog Account') 
	if (getFormVal(scoutProfileObjList[i].profileData,'LastName') != 'Account') {
	if (decodeURIComponent(getFormVal(scoutProfileObjList[i].profileData,'OAMember'))=='yes') { 
		member=true;
	}
	//newdata +='            						</b></td>\n';
	
	newdata += '									<td>\n'	;

		
	//newdata += '<div>';
	newdata += '<tr >\n';
	//newdata += '									<div  style="display: inline-block; font-weight: bold; width:140px;height:60px;" >';	//line-height:45px;font-size: 16px;
	newdata += '									<td><b>' + escapeHTML(getFormVal(scoutProfileObjList[i].profileData,'LastName')) +', '+ escapeHTML(getFormVal(scoutProfileObjList[i].profileData,'FirstName'));
	//newdata +='            						</b></td>\n';
	
	newdata += '									<td>\n'	;

		
    //   a black  b blue c grey d white e yellow f green g red h white no border i blk 
	newdata += '										<div style="display: inline-block; vertical-align: middle; ">';	
	newdata +=  '											<label for="oaMemberID'+escapeHTML(scoutProfileObjList[i].id)+'"  style="border-bottom-width:1px">Member</label>\n';	

															var checkstat ='';
															var readstate='';
															var disablestate='';
															if (decodeURIComponent(getFormVal(scoutProfileObjList[i].profileData,'OAMember'))=='yes') { 

															  checkstat='checked';
															} else { 
															   readstate='readonly';
															   disablestate='disabled';
															}
	newdata +=  '											<input type="checkbox" data-theme="d" name="oaMemberID'+escapeHTML(scoutProfileObjList[i].id)+'" id="oaMemberID'+escapeHTML(scoutProfileObjList[i].id)+'"  '+escapeHTML(checkstat)+' >\n';  //data-theme="d"
	newdata +='            						 		</div>';	

	newdata += '										<div style="display: inline-block;  vertical-align: middle;">';	
	newdata +=  '											<label for="oaActiveID'+escapeHTML(scoutProfileObjList[i].id)+'" style="border-bottom-width:1px">Active</label>\n';	
															var checkstat ='';
															if (decodeURIComponent(getFormVal(scoutProfileObjList[i].profileData,'OAActive'))=='yes') { checkstat='checked';}
	newdata +=  '											<input '+ escapeHTML(disablestate)+ ' ' + escapeHTML(checkstat)+ ' type="checkbox" data-theme="d" name="oaActiveID'+escapeHTML(scoutProfileObjList[i].id)+'" id="oaActiveID'+escapeHTML(scoutProfileObjList[i].id)+'"  data-defaultcheck="'+escapeHTML(checkstat)+'">\n';
	newdata +='            						 		</div>';	
	
	newdata += '										<div data-role="fieldcontain" style="display: inline-block;" >';
	newdata += '											<label for="oaMemberNumberID'+escapeHTML(scoutProfileObjList[i].id)+'">Member Number:</label>\n';
	newdata += '											<input  ' + escapeHTML(readstate)+ ' type="text" name="oaMemberNumberID'+escapeHTML(scoutProfileObjList[i].id)+'" id="oaMemberNumberID'+escapeHTML(scoutProfileObjList[i].id)+'" defaultValue="'+ escapeHTML(decodeURIComponent(getFormVal(scoutProfileObjList[i].profileData,'OAMemberNumber'))) + '" value="'+ escapeHTML(decodeURIComponent(getFormVal(scoutProfileObjList[i].profileData,'OAMemberNumber'))) +'">'; //style="margin-top: 0;  style="font-size: 12px; width: 70%;"
	newdata +='            						 		</div>';
	
	newdata += '										<div data-role="fieldcontain" style="display: inline-block;" >';
	newdata += '											<label for="oaElectionDateID'+escapeHTML(scoutProfileObjList[i].id)+'">Election Date:</label>\n';
	newdata += '											<input ' + escapeHTML(readstate)+ ' type="text" name="oaElectionDateID'+escapeHTML(scoutProfileObjList[i].id)+'" id="oaElectionDateID'+escapeHTML(scoutProfileObjList[i].id)+'" defaultValue="'+ escapeHTML(decodeURIComponent(getFormVal(scoutProfileObjList[i].profileData,'OAElectionDate'))) + '" value="'+ escapeHTML(decodeURIComponent(getFormVal(scoutProfileObjList[i].profileData,'OAElectionDate'))) + '"  class="calendar" >'; //style="margin-top: 0;  style="font-size: 12px; width: 70%;"
	newdata +='            						 		</div>';
	newdata += '										<div data-role="fieldcontain" style="display: inline-block;" >';
	newdata += '											<label for="oaOrdealDateID'+escapeHTML(scoutProfileObjList[i].id)+'">Ordeal Date:</label>\n';
	newdata += '											<input ' + escapeHTML(readstate)+ ' type="text" name="oaOrdealDateID'+escapeHTML(scoutProfileObjList[i].id)+'" id="oaOrdealDateID'+escapeHTML(scoutProfileObjList[i].id)+'" defaultValue="'+ escapeHTML(decodeURIComponent(getFormVal(scoutProfileObjList[i].profileData,'OAOrdealDate'))) + '" value="'+ escapeHTML(decodeURIComponent(getFormVal(scoutProfileObjList[i].profileData,'OAOrdealDate'))) + '"  class="calendar" >'; //style="font-size: 12px; width: 70%;"
	newdata +='           						  		</div>';
	
	newdata += '										<div data-role="fieldcontain" style="display: inline-block;" >';
	newdata += '											<label for="oaBrotherhoodDateID'+escapeHTML(scoutProfileObjList[i].id)+'">Brotherhood Date:</label>\n';
	newdata += '											<input ' + escapeHTML(readstate)+ ' type="text" name="oaBrotherhoodDateID'+escapeHTML(scoutProfileObjList[i].id)+'" id="oaBrotherhoodDateID'+escapeHTML(scoutProfileObjList[i].id)+'" defaultValue="'+ escapeHTML(decodeURIComponent(getFormVal(scoutProfileObjList[i].profileData,'OABrotherhoodDate'))) + '" value="'+ escapeHTML(decodeURIComponent(getFormVal(scoutProfileObjList[i].profileData,'OABrotherhoodDate'))) + '" class="calendar"  >';  //style="font-size: 12px; width: 70%;"
	newdata +='            						 		</div>';
	newdata += '										<div data-role="fieldcontain" style="display: inline-block;" >';
	newdata += '											<label for="oaVigilDateID'+escapeHTML(scoutProfileObjList[i].id)+'">Vigil Date:</label>\n';
	newdata += '											<input ' + escapeHTML(readstate)+ ' type="text" name="oaVigilDateID'+escapeHTML(scoutProfileObjList[i].id)+'" id="oaVigilDateID'+escapeHTML(scoutProfileObjList[i].id)+'" defaultValue="'+ escapeHTML(decodeURIComponent(getFormVal(scoutProfileObjList[i].profileData,'OAVigilDate'))) + '" value="'+ escapeHTML(decodeURIComponent(getFormVal(scoutProfileObjList[i].profileData,'OAVigilDate'))) + '" class="calendar"  >';  //style="font-size: 12px; width: 70%;"
	newdata +='          						   		</div>';
	newdata += '									</td>\n'	;
	newdata += '</tr>\n';	
	//newdata += '</div>';
}
}	
			newdata += '</table>\n';							
//newdata += '									</div>';
//newdata += '								</fieldset>';  //70%

//newdata += '							</div>';
newdata += '			</div>';												
newdata += '		</fieldset>';
newdata += '		</ul>';	
//newdata += '					</div>';
//newdata += '				</div>';
//newdata += '			</li>';
newdata += '		<ul data-role="listview" data-theme="d" data-inset="true" data-count-theme="f" style="margin-top: 0;" class="ui-icon-alt;">';
			
newdata += '			<li class="ui-body ui-body-b">';
newdata += '				<div class="ui-grid-a">';
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
			
	
newdata += '	<div style="margin-top: 6px;">&copy; '+escapeHTML(cyear())+'- Boy Scouts of America &bull; <a href="/mobile/help/privacy.asp">Privacy</a></div>';
newdata += '	<div><a href="/" data-ajax="false"><img src="https://d1kn0x9vzr5n76.cloudfront.net/mobile/images/scoutbookbsalogo400.png" width="200"></a></div>';
	
newdata += '		</div>';

//newdata += '	</div><!-- /content -->';

return newdata;
/*
css?


	
	
@media all and (min-width: 28em) {  //4420
    .ui-field-contain label.ui-input-text {
        vertical-align:top;
        display: inline-block;
        width: 20%;		//increase here
        margin: 0 2% 0 0
    }

    .ui-field-contain input.ui-input-text,.ui-field-contain textarea.ui-input-text,.ui-field-contain .ui-input-search,.ui-field-contain div.ui-input-text {
        width: 78%;  //increase width here
        display: inline-block
    }

    .ui-field-contain .ui-input-search,.ui-field-contain div.ui-input-text {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        -ms-box-sizing: border-box;
        box-sizing: border-box
    }

    .ui-hide-label input.ui-input-text,.ui-hide-label textarea.ui-input-text,.ui-hide-label .ui-input-search,.ui-hide-label div.ui-input-text,.ui-input-search input.ui-input-text,div.ui-input-text input.ui-input-text {
        width: 100%
    }
}
	
*/

}


function oaCB(unitid,type) {
		$.mobile.loading('hide');
		
		if (type=='report') oaRpt=true;		//set flag
	
		$.mobile.changePage(
			'/mobile/dashboard/admin/unit.asp?UnitID=' + unitid,
		{
			allowSamePageTransition: true,
			transition: 'none',
			showLoadMsg: true,
			reloadPage: true
		}
		);	
	
}

// We are going to fill an object array with an object containing data for each scout in scoutPermObjList

//scoutPermObjList has a list of scouts.
// Each time called, gets next scout from list to process until none left, then returns to unit page
// For each scout, gets scout account page, then calls to get scout profile
function getAccount2(unitid,sPage,txtunit,type,cb,cbv1,cbv2) {
	
	if (scoutProfileObjList.length == scoutPermObjList.length) {
		
		cb(cbv1,cbv2);
		
		return;
	} else {
		
		var offst=scoutProfileObjList.length;

		$.mobile.loading('show', { theme: 'a', text: 'loading...this can take several minutes for large units', textonly: false });
		var thisScoutID = scoutPermObjList[offst].id;
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[sPage,unitid,'OA'],  getAccount2,[unitid,sPage,txtunit,type,cb,cbv1,cbv2]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			//console.log('get Account responded');
			getProfile2(thisScoutID,unitid,sPage,txtunit,type);
		}
	};
	
	//console.log('getting ' + thisScoutID);
	//https://www.scoutbook.com/mobile/dashboard/admin/account.asp?ScoutUserID=xxxxx
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/account.asp?ScoutUserID=' + thisScoutID;

	
	xhttp.open("GET",url , true);
	xhttp.responseType="text";

	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,genError,[sPage,unitid,'OA'],  getAccount2,[unitid,sPage,txtunit,type,cb,cbv1,cbv2]);
	};
}

// gets the scout edit profile page
// It will copy all the form fields as they will be needed to post later.
// Some fields are normally activly populated on the page when it is displayed, but as it is not displayed here, those scripts don't auto populate 
// so we will do that here.  First we update the swim data, the fill in the patrol id as found elsewhere on the page.
// If the scout is an approved scout, there is a disapprove button on the page.  If the scout was approved, we will add the approved element (normally a checkbox value)
// to the field list to post.
// Finally, we need to call getBSAprofileData to get other field data normally done in the ajax call

function getProfile2(thisScoutID,unitid,sPage,txtunit,type) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[sPage,unitid,'OA'],  getProfile2,[thisScoutID,unitid,sPage,txtunit,type]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			var formPost=$('#editProfileForm', this.response).serialize();			

			var patrolid='';
			if ($('a[id="goToDenPatrol"]',this.response).attr('href') != undefined) {
			if ($('a[id="goToDenPatrol"]',this.response).attr('href').match(/PatrolID=(\d+)/) != null) {
				patrolid=$('a[id="goToDenPatrol"]',this.response).attr('href').match(/PatrolID=(\d+)/)[1];
			} 
			}
			
			formPost = formPost.replace(/PatrolID=[^&]*/,'PatrolID='+patrolid);
					
			//if the disapprove button is present on this form, attached the approved element to formPost.  It means the Scout was approved prior and we'll keep it that way
			
			if ($('a[href="#"][id="disapproveButton"]').text() != "") {
				formPost = formPost + '&Approved=1';
			}
	
			//getBSAprofileData2 (thisScoutID,formPost,unitid,sPage,txtunit);
			
			var evObj={id: '', profileData: '', update: 0};
			evObj.id=thisScoutID;
			evObj.profileData=formPost;
			evObj.update=0;
			scoutProfileObjList.push(JSON.parse(JSON.stringify(evObj)));
			
			setTimeout(function(){ getAccount2(unitid,sPage,txtunit,type,oaCB,unitid,type); }, 200);			
			
		}
	};

	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/editprofile.asp?ScoutUserID=' + thisScoutID + '&UnitID='+unitid+'&DenID=&PatrolID=';

	xhttp.open("GET",url , true);
	xhttp.responseType="document";

	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,genError,[sPage,unitid,'OA'],  getProfile2,[thisScoutID,unitid,sPage,txtunit,type])
	};
}



function serialToStringify(formPost) {
	var outObj={};
	var splForm=formpost.split('&');
	for(i=0;i<splForm.length;i++) {
		var oPair=splForm[i].split('=');
		outObj[oPair[0]]=oPair[1];
	}
	return JSON.stringify(outObj);
}



function getProfile3(unitid,sPage) {

	var thisScoutID;
	var formPost;
	var update = 0;
	

	while (scoutProfileObjList.length > 0) {
		thisScoutID=scoutProfileObjList[0].id;
		formPost=scoutProfileObjList[0].profileData;
		
		

		
		update=scoutProfileObjList[0].update;
		scoutProfileObjList.shift();
		if(update == 1) {
			break;  //use this one
		}
	}

	if(update==0) {
		//done;
		//back to refresh display
		//no more to set
		$('#buttonCancel, #buttonSubmit', sPage).button('enable');
		$(':input', sPage +' #oaForm').attr('disabled', false);

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
		
	}	

	
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[sPage,unitid,'OA'],  getProfile3,[unitid,sPage]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			//console.log('get Account responded');
			var CSRF=$('input[name="CSRF"]',this.response).val();
			//update the CSRF
			formPost=formPost.replace(/CSRF=[^&]*/,'CSRF='+CSRF);
			
			if ($('a[href="#"][id="disapproveButton"]').text() != "") {
				formPost = formPost + '&Approved=1';
			}					
			
			
			//try getting the district list just to be the same
			//OAgetDistrict(thisScoutID,formPost,unitid,sPage);
			postProfile2(thisScoutID,formPost,unitid,sPage);
		}
	};
	
	//console.log('getting ' + thisScoutID);
	//https://www.scoutbook.com/mobile/dashboard/admin/account.asp?ScoutUserID=xxxxx
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/editprofile.asp?ScoutUserID=' + thisScoutID + '&UnitID='+unitid+'&DenID=&PatrolID=';

	
	xhttp.open("GET",url , true);
	xhttp.responseType="document";

	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,genError,[sPage,unitid,'OA'],  getProfile3,[unitid,sPage]);;

	};
}


function OAgetDistrict(thisScoutID,formPost,unitid,sPage) {
	var councilid ='';
  if(formPost.match(/CouncilID=(\d+)/) != null) {
	councilid = formPost.match(/CouncilID=(\d+)/)[1];
  }

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[sPage,unitid,'OA'],  OAgetDistrict,[thisScoutID,formPost,unitid,sPage]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			postProfile2(thisScoutID,formPost,unitid,sPage);			
			
		}
	};

	var url = 'https://' + host + 'scoutbook.com/mobile/includes/ajax.asp?Action=GetDistrictList&CouncilID=' + councilid;

	xhttp.open("GET",url , true);
	xhttp.responseType="text";

	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,genError,[sPage,unitid,'OA'],  OAgetDistrict,[thisScoutID,formPost,unitid,sPage]);
	};

	
}

function postProfile2(thisScoutID,formPost,unitid,sPage) {
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[sPage,unitid,'OA'],  postProfile2,[thisScoutID,formPost,unitid,sPage]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			if (this.response.indexOf('Update successful!') != -1 ) {
				//console.log('completed post');
				//get next scout
				setTimeout(function(){ getProfile3(unitid,sPage); }, 200);
			} else {
				var err=this.response.match(/showErrorPopup\(([^\)]+)/)[1].replace(/<[^>]+>/g,'');
				genError(sPage,unitid,'OA ' +err);
			}	
		}
	};
	
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/editprofile.asp?ScoutUserID=' + thisScoutID + '&AdultUserID=&UnitID=' + unitid;
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formPost);
			
	xhttp.onerror = function() {
		errStatusHandle(500,genError,[sPage,unitid,'OA'],  postProfile2,[thisScoutID,formPost,unitid,sPage]);;
	};
	
}
