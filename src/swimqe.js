// Copyright © 10/4/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.
//swim

var swimAdults = [];

function addRawSwimQE(data, pageid, unitID, txtunit) {
    swimQE = false;

    var startfunc;
    var endfunct;
    var newdata;

    // Replace heading
    startfunc = data.indexOf('<span style="margin-left: 5px; ">', 1);
    endfunct = data.indexOf('</h1>', 1);
    //replace <span style="margin-left: 5px; "> thru </h1>

    newdata = data.slice(0, startfunc);
    newdata += '<span style="margin-left: 5px; ">';
    //newdata += '		<a id="goToUnit" href="/mobile/dashboard/admin/unit.asp?UnitID=' + unitID + '" class="text" data-direction="reverse">' + txtunit + '</a>';
    newdata += '		<a href="#" id="buttonRefresh" class="text">' + escapeHTML(txtunit) + '</a>';
    if (QEPatrol != '') {
        newdata += '		<a id="goToDenPatrol" href="' + escapeHTML('/mobile/dashboard/admin/denpatrol.asp?UnitID=' + unitID + '&DenID=&PatrolID=' + QEPatrolID) + '" class="text" data-direction="reverse">' + escapeHTML(QEPatrol) + '</a>';
    }
    newdata += '           Record Multiple Scout Swimmer Classifications';
    newdata += '</span>';
    newdata += data.slice(endfunct);

    data = newdata;


    startfunc = data.indexOf('<a id="goBack"', 1);
    endfunct = data.indexOf('<img src', startfunc);
    //myfunc = '<a id="goBack" href="/mobile/dashboard/admin/unit.asp?UnitID='+unitID+'" data-transition="slide" data-direction="reverse";>';
    myfunc = '<a href="#" id="buttonRefresh" >';
    newdata = data.slice(0, startfunc) + myfunc + '\n' + data.slice(endfunct);
    data = newdata;





    // replace content
    startfunc = data.indexOf('<div data-role="content">');
    endfunct = data.indexOf('</div><!-- /content -->');
    newdata = data.slice(0, startfunc);
    newdata += setSwimPageContent(txtunit, 'Page' + escapeHTML(escapeHTML(pageid)));
    newdata += data.slice(endfunct);
    data = newdata;


    // replace style
    startfunc = data.indexOf('<style type="text/css">');
    endfunct = data.indexOf('</style>');
    newdata = data.slice(0, startfunc);
    newdata += '	<style type="text/css">\n';
    newdata += '		#Page' + escapeHTML(escapeHTML(pageid)) + ' .ui-select .ui-btn-icon-right .ui-btn-inner	{ padding-left: 10px; padding-right: 35px; }\n';
    newdata += '		#Page' + escapeHTML(escapeHTML(pageid)) + ' .ui-select .ui-btn-icon-right .ui-icon		{ right: 10px; }\n';
    newdata += '		#Page' + escapeHTML(escapeHTML(pageid)) + ' #popupDeleteLog								{ max-width: 400px; }\n';
    newdata += '		#Page' + escapeHTML(escapeHTML(pageid)) + ' .smallText		{ color: gray; margin-top: 15px; }\n';
    newdata += '		#Page' + escapeHTML(escapeHTML(pageid)) + ' img.imageSmall	{ position: relative; width: 30px; height: 30px; top: -5px; border: 1px solid gray; }\n';
    //ui-input-text ui-shadow-inset ui-corner-all ui-btn-shadow ui-body-h
    //div.ui-input-text{margin:.5em 
    newdata += '		#Page' + escapeHTML(escapeHTML(pageid)) + ' div.ui-input-text { margin-top: 0px; padding-top:0px; "box-shadow": "rgba(0, 0, 0, 0.2) 0px 0px 0px 1px inset"}\n';
    newdata += '		#Page' + escapeHTML(escapeHTML(pageid)) + ' div.ui-btn-shadow { border: 0;}\n';
    newdata += '	</style>\n';
    newdata += data.slice(endfunct);
    data = newdata;

    // replace script.  Starsts after <script tag
    startfunc = data.indexOf('var formPost;');
    endfunct = data.indexOf('</script>', startfunc);
    var myfunc = '' + swscript;
    myfunc = myfunc.slice(22).slice(0, -1).replace(/\#PageX/g, '#Page' + escapeHTML(escapeHTML(pageid))).replace(/UnitID=X/g, 'UnitID=' + escapeHTML(unitID));
    newdata = data.slice(0, startfunc) + myfunc + '\n' + data.slice(endfunct);
    data = newdata;

    //startfunc = data.indexOf('<div style="margin-top: 6px;">&copy;');
    //newdata = data.slice(0,startfunc);
    //newdata += '<div style="margin-top: 6px;">Feature Assistant Active</div>';	
    //newdata += '<div style="margin-top: 6px;">This page was produced by the Feature Assistant Extension/Add-on and is not supported by BSA</div>';	
    //data=newdata + data.slice(startfunc);				



    scoutPermObjList = [];
    //scoutProfileObjList=[];
    return data;
}

function setSwimPageContent(txtunit, tpageid) {
    var newdata;
    newdata = '	<div data-role="content">';
    newdata += '		<form id="swimmingForm" method="post" action="swimmingentry.asp">';
    newdata += '		<input type="hidden" name="Action" value="Submit" />';
    newdata += '		<ul data-role="listview" data-theme="d" data-inset="true">';


    newdata += '				<li id="scoutsLI" data-theme="d">';
    newdata += '					<div>';
    newdata += '						<p class="normalText">Now you can quickly and easily enter the Swimmer Classification for the whole Pack or Troop!</p>';

    newdata += '						<div style="margin-top: 1.5em; ">';
    newdata += '							<fieldset data-role="controlgroup">';
    newdata += '								<legend class="text-orange">';
    var leadertxt = '';
    if (swimAdults.length != 0) {
        leadertxt = ' and/or Leader(s)';
    }
    newdata += '									<strong>Choose Scout(s)' + leadertxt + ':</strong>';

    newdata += '								</legend>';

    //   a black  b blue c grey d white e yellow f green g red h white no border i blk 
    newdata += '				<ul data-role="listview" data-theme="d" data-inset="true"><li style="background-color:LightGray; padding:1px">';
    newdata += '				<div class="ui-grid-b ui-responsive" >';
    newdata += '					<div class="ui-block-a " style=" height:42px; background-color:white"  >';
    newdata += '					   <p class="normalText" style="padding:3px; margin-top:0px;">Choose Swimming Classification and the date it ocurred to apply to all.  You can edit indviduals after applying if desired.</p>';
    newdata += '            			</div>';
    newdata += '					<div class="ui-block-b " style="height:42px; background-color:#f0f0f0"  >';
    newdata += '	    	    		<select name="SwimmingClassificationAll" id="swimmingAllClassification" data-native-menu="false" >';
    newdata += '							<option value="">Choose Swimming Classification...</option>';
    newdata += '							<option value="Nonswimmer">Nonswimmer</option>';
    newdata += '							<option value="Beginner" >Beginner</option>';
    newdata += '							<option value="Swimmer" >Swimmer</option>';
    newdata += '	        			</select>';
    newdata += '           			</div>';
    newdata += '					<div class="ui-block-c" style=" height:42px; ">';

    newdata += '		        		<input type="text" name="SwimmingClassificationDateAll" id="swimmingDateAll" value="" class="calendar" style=" height:42px; "/>';
    newdata += '           			</div>';

    newdata += '           		</div>';
    newdata += '              		</li></ul>';




    //newdata += '					<div style="height:42px;" data-role="fieldcontain" id="swimmingDateDIV">';	
    //newdata += '	        			<label for="swimmingDateAll">Swim Classification Date (Set All):</label>';
    //newdata += '		        		<input type="text" name="SwimmingClassificationDateAll" id="swimmingDateAll" value="" class="calendar" style=" height:42px; "/>';					
    //newdata += '					</div>';									

    newdata += '											<div data-role="collapsible" data-theme="a"  data-collapsed="false"  >';
    newdata += '												<h4 data-theme="a">' + escapeHTML(txtunit) + ' Scouts</h4>';

    newdata += '												<fieldset data-role="controlgroup">';
    newdata += '													<legend></legend>';
    var newx = true;
    if (newx == true) {

        //##########################

        newdata += '					<div class="ui-grid-b ui-responsive" >';
        newdata += '						<div class="ui-block-a" style="font-weight: bold; font-size: 16px;line-height:45px; margin-bottom:0;">';
        newdata += '							Scout';
        newdata += '            				</div>';
        newdata += '						<div class="ui-block-b" style="font-weight: bold; font-size: 16px; line-height:45px; margin-bottom:0;">';
        newdata += '							Swimming Classification';
        newdata += '              			</div>';
        newdata += '						<div class="ui-block-c" style="font-weight: bold; font-size: 16px; line-height:45px; margin-bottom:0;">';
        newdata += '							Date';
        newdata += '              			</div>';

        for (var i = 0; i < scoutPermObjList.length; i++) {
            if (scoutPermObjList[i].name.match(/^ACCOUNT, /) == null) {

                newdata += '					<div class="ui-block-a " style=" height:42px;" >';
                newdata += '					<span class="ui-shadow-inset ui-corner-all ui-btn-shadow"  >';
                newdata += '						<input type="checkbox" data-theme="d" name="ScoutUserID" id="scoutUserID' + escapeHTML(scoutPermObjList[i].id) + '" value="' + escapeHTML(scoutPermObjList[i].id) + '">';
                newdata += '						<label for="scoutUserID' + escapeHTML(scoutPermObjList[i].id) + '" >';
                newdata += '							<div style="float: left; width: 30px; ">';
                newdata += '								<img src="' + escapeHTML(scoutPermObjList[i].img) + '" class="imageSmall" />';
                newdata += '							</div>';
                newdata += '							<div style="margin-left: 40px; ">';
                newdata += '							' + escapeHTML(scoutPermObjList[i].name);
                newdata += '							</div>';
                newdata += '						</label>';
                newdata += '            			</span>';
                newdata += '            			</div>';
                newdata += '					<div class="ui-block-b " style="height:42px;background-color:#f0f0f0"  >';
                //newdata += '	    	    		<label for="swimmingClassification'+ escapeHTML(scoutPermObjList[i].id)+'">Swimming Classification:<img src="https://d1kn0x9vzr5n76.cloudfront.net/mobile/images/icons/help48.png" class="questionIcon" id="swimmerHelp" /></label>';
                newdata += '	    	    		<select name="SwimmingClassification' + escapeHTML(scoutPermObjList[i].id) + '" id="swimmingClassification' + escapeHTML(scoutPermObjList[i].id) + '" data-native-menu="false" >';
                newdata += '							<option value="">Choose Swimming Classification...</option>';
                newdata += '							<option value="Nonswimmer">Nonswimmer</option>';
                newdata += '							<option value="Beginner" >Beginner</option>';
                newdata += '							<option value="Swimmer" >Swimmer</option>';
                newdata += '	        			</select>';
                newdata += '           			</div>';
                newdata += '					<div class="ui-block-c" style=" height:42px; ">';

                newdata += '		        		<input type="text" name="SwimmingClassificationDate' + escapeHTML(scoutPermObjList[i].id) + '" id="swimmingDateClassification' + escapeHTML(scoutPermObjList[i].id) + '" value="" class="calendar" style=" height:42px; "/>';

                newdata += '           			</div>';
            }
        }

        newdata += '					</div>'; // end of grid b
    } else {
        /*
        for (var i=0;i<scoutPermObjList.length;i++) {	
        if(scoutPermObjList[i].name!= 'ACCOUNT, UnitPaylog') {												
        newdata += '														<input type="checkbox" data-theme="d" name="ScoutUserID" id="scoutUserID' + escapeHTML(scoutPermObjList[i].id) + '" value="' + escapeHTML(scoutPermObjList[i].id) + '">';
        newdata += '														<label for="scoutUserID' + escapeHTML(scoutPermObjList[i].id) + '" >';
        newdata += '															<div style="float: left; width: 30px; ">';
        newdata += '																<img src="' + escapeHTML(scoutPermObjList[i].img) + '" class="imageSmall" />';
        newdata += '															</div>';
        newdata += '															<div style="margin-left: 40px; ">';
        newdata += '																' + escapeHTML(scoutPermObjList[i].name);
        newdata += '															</div>';
        newdata += '														</label>';
        }
        }														
        */
    }
    scoutPermObjList = [];
    newdata += '												</fieldset>';
    newdata += '											</div>';

    newdata += '							</fieldset>';
    newdata += '						</div>';
    newdata += '					</div>';
    newdata += '				</li>';

    if (swimAdults.length != 0) {
        // if there are adults, list them here
        //newdata += '				<li>';
        //newdata += '				Leaders';
        //newdata += '				</li>';			
        newdata += '				<li id="adultsLI" data-theme="d">';
        newdata += '					<div>';


        newdata += '						<div style="margin-top: 1.5em; ">';
        newdata += '							<fieldset data-role="controlgroup">';


        newdata += '											<div data-role="collapsible" data-theme="a"  data-collapsed="false"  >';
        newdata += '												<h4 data-theme="a">' + escapeHTML(txtunit) + ' Leaders</h4>';

        newdata += '												<fieldset data-role="controlgroup">';
        newdata += '													<legend></legend>';


        if (newx == true) {

            //###########################

            newdata += '					<div class="ui-grid-b ui-responsive" >';
            newdata += '						<div class="ui-block-a" style="font-weight: bold; font-size: 16px;line-height:45px; margin-bottom:0;">';
            newdata += '							Leader';
            newdata += '            				</div>';
            newdata += '						<div class="ui-block-b" style="font-weight: bold; font-size: 16px; line-height:45px; margin-bottom:0;">';
            newdata += '							Swimming Classification';
            newdata += '              			</div>';
            newdata += '						<div class="ui-block-c" style="font-weight: bold; font-size: 16px; line-height:45px; margin-bottom:0;">';
            newdata += '							Date';
            newdata += '              			</div>';

            for (var i = 0; i < swimAdults.length; i++) {

                //  if(swimAdults[i].name != "UnitPaylog Account") {
                newdata += '					<div class="ui-block-a " style=" height:42px;" >';
                newdata += '					<span class="ui-shadow-inset ui-corner-all ui-btn-shadow"  >';
                newdata += '						<input type="checkbox" data-theme="d" name="AdultUserID" id="adultUserID' + escapeHTML(swimAdults[i].id) + '" value="' + escapeHTML(swimAdults[i].id) + '">';
                newdata += '						<label for="adultUserID' + escapeHTML(swimAdults[i].id) + '" >';
                newdata += '							<div style="float: left; width: 30px; ">';
                newdata += '								<img src="' + escapeHTML(swimAdults[i].img) + '" class="imageSmall" />';
                newdata += '							</div>';
                newdata += '							<div style="margin-left: 40px; ">';
                newdata += '							' + escapeHTML(swimAdults[i].name);
                newdata += '							</div>';
                newdata += '						</label>';
                newdata += '            			</span>';
                newdata += '            			</div>';
                newdata += '					<div class="ui-block-b " style="height:42px;background-color:#f0f0f0"  >';
                //newdata += '	    	    		<label for="swimmingClassification'+ escapeHTML(swimAdults[i].id)+'">Swimming Classification:<img src="https://d1kn0x9vzr5n76.cloudfront.net/mobile/images/icons/help48.png" class="questionIcon" id="swimmerHelp" /></label>';
                newdata += '	    	    		<select name="SwimmingClassification' + escapeHTML(swimAdults[i].id) + '" id="swimmingClassification' + escapeHTML(swimAdults[i].id) + '" data-native-menu="false" >';
                newdata += '							<option value="">Choose Swimming Classification...</option>';
                newdata += '							<option value="Nonswimmer">Nonswimmer</option>';
                newdata += '							<option value="Beginner" >Beginner</option>';
                newdata += '							<option value="Swimmer" >Swimmer</option>';
                newdata += '	        			</select>';
                newdata += '           			</div>';
                newdata += '					<div class="ui-block-c" style=" height:42px; ">';

                newdata += '		        		<input type="text" name="SwimmingClassificationDate' + escapeHTML(swimAdults[i].id) + '" id="swimmingDateClassification' + escapeHTML(swimAdults[i].id) + '" value="" class="calendar" style=" height:42px; "/>';

                newdata += '           			</div>';
                // }
            }

            newdata += '					</div>'; // end of grid b




            //############################	

        } else {
            /*
            	for (var i=0;i<swimAdults.length;i++) {	
            													
            	newdata += '														<input type="checkbox" data-theme="d" name="AdultUserID" id="adultUserID' + escapeHTML(swimAdults[i].id) + '" value="' + escapeHTML(swimAdults[i].id) + '">';
            	newdata += '														<label for="adultUserID' + escapeHTML(swimAdults[i].id) + '" >';
            	newdata += '															<div style="float: left; width: 30px; ">';
            	newdata += '																<img src="' + escapeHTML(swimAdults[i].img) + '" class="imageSmall" />';
            	newdata += '															</div>';
            	newdata += '															<div style="margin-left: 40px; ">';
            	newdata += '																' + escapeHTML(swimAdults[i].name);
            	newdata += '															</div>';
            	newdata += '														</label>';

            	}														
            */
        }

        swimAdults = [];

        newdata += '												</fieldset>';
        newdata += '											</div>';

        newdata += '							</fieldset>';
        newdata += '						</div>';
        newdata += '					</div>';
        newdata += '				</li>';
    }
    /*
    newdata += '				<li data-role="fieldcontain" id="swimmerLI" class="ui-icon-alt">';
    newdata += '	        		<label for="swimmingClassification">Swimming Classification:<img src="https://d1kn0x9vzr5n76.cloudfront.net/mobile/images/icons/help48.png" class="questionIcon" id="swimmerHelp" /></label>';
    newdata += '	        		<select name="SwimmingClassification" id="swimmingClassification" data-native-menu="false">';
    newdata += '						<option value="Nonswimmer">Nonswimmer</option>';
    newdata += '						<option value="Beginner" >Beginner</option>';
    newdata += '						<option value="Swimmer" >Swimmer</option>';
    newdata += '	        		</select>';
    newdata += '				</li>';
    newdata += '				<li data-role="fieldcontain" id="swimmingDateLI">';
    newdata += '	        		<label for="swimmingDateClassification">Swim Classification Date:</label>';
    newdata += '	        		<input type="text" name="SwimmingClassificationDate" id="swimmingDateClassification" value="" class="calendar"  />';
    newdata += '				</li>	';		

    */


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

    newdata += logoutWarningPageContent(tpageid);

    newdata += '		<div id="footer" align="center">';

    newdata += '<div style="margin-top: 6px;">This page was produced by the Feature Assistant Extension/Add-on and is not supported by BSA</div>';
    newdata += '	<div style="margin-top: 6px;">&copy; ' + escapeHTML(cyear()) + '- Boy Scouts of America &bull; <a href="/mobile/help/privacy.asp">Privacy</a></div>';
    newdata += '	<div><a href="/" data-ajax="false"><img src="https://d1kn0x9vzr5n76.cloudfront.net/mobile/images/scoutbookbsalogo400.png" width="200"></a></div>';

    newdata += '		</div>';

    //newdata += '	</div><!-- /content -->';

    //ui-input-text ui-shadow-inset ui-corner-all ui-btn-shadow ui-body-h
    //div.ui-input-text{margin:.5em 

    return newdata;


}


//swim		 
function swscript() {
    var formPost;

    function pageInit() {

        var scoutselect = false;
        var adultselect = false;
        var id;
        var noval = false;
        var nodate = false;
        $('#swimmingForm', '#PageX').submit(function() {



            $('#buttonSubmit', '#PageX').focus();

            formPost = $('#swimmingForm', '#PageX').serialize();

            // disable all inputs
            $(':input', '#PageX #swimmingForm').attr('disabled', true);
            $('#buttonCancel, #buttonSubmit', '#PageX').button('disable');

            $.mobile.loading('show', {
                theme: 'a',
                text: 'saving...',
                textonly: false
            });
            setTimeout(function() {
                submitSForm();
            }, 200);
            return false;
        });

        $('#buttonCancel', '#PageX').click(function() {

            scoutPermObjList.length = 0;
            swimQE = false;

            $.mobile.changePage(

                'https://' + host + 'scoutbook.com/mobile/dashboard/admin/unit.asp?UnitID=X&DenID=&PatrolID=&Refresh=1',

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

        $('#buttonRefresh', '#PageX').click(function() {


            scoutPermObjList.length = 0;
            oaQE = false;
            $.mobile.loading('hide');
            $.mobile.changePage(

                'https://' + host + 'scoutbook.com/mobile/dashboard/admin/unit.asp?UnitID=X&Refresh=1',

                {
                    allowSamePageTransition: true,
                    transition: 'none',
                    showLoadMsg: true,
                    reloadPage: true
                }
            );

            //return false;
        });

        $('#buttonSubmit', '#PageX').click(function() {
            var noval = false;
            var scoutselect = false;
            var adultselect = false;
            var nodate = false;
            var invdate = false;
            var errmsg = '';
            $('input[name="ScoutUserID"]:checked', '#PageX').each(function() {
                scoutselect = true;
                if ($('#swimmingClassification' + this.value, '#PageX').val() == '') {
                    noval = true;
                }
                if ($('#swimmingDateClassification' + this.value, '#PageX').val() == '') {
                    nodate = true;
                } else {
                    var sd = new Date($('#swimmingDateClassification' + this.value, '#PageX').val());
                    if (sd - Date.now() > 0) {
                        invdate = true;
                    }
                }
            });
            $('input[name="AdultUserID"]:checked', '#PageX').each(function() {
                adultselect = true;
                if ($('#swimmingClassification' + this.value, '#PageX').val() == '') {
                    noval = true;
                }
                if ($('#swimmingDateClassification' + this.value, '#PageX').val() == '') {
                    nodate = true;
                } else {
                    var sd = new Date($('#swimmingDateClassification' + this.value, '#PageX').val());
                    if (sd - Date.now() > 0) {
                        invdate = true;
                    }
                }
            });


            var sd = new Date($('#swimmingDateClassification' + this.value, '#PageX').val());
            if (sd - Date.now() > 0) {
                invdate = true;
            }



            var errmsg = '';
            if (adultselect == false && scoutselect == false) {
                errmsg = 'Please select at least one person to update. ';
            }
            if (noval == true) {
                errmsg += 'Please make sure your selections have a Classification. ';
            }
            if (nodate == true) {
                errmsg += 'Please make sure your selections have a Date. ';
            }
            if (invdate == true) {
                errmsg += 'Please make sure your selection Dates are not in the future. ';
            }
            if (errmsg != '') {
                alert(errmsg);
                return false;
            }







            //if ($('input[name="ScoutUserID"]:checked','#PageX')[0] == null) {
            //	alert('Please select at least one Scout');
            //} else {
            $('#swimmingForm', '#PageX').submit();
            swimQE = false;
            //}

            return false;
        });

        $('#swimmingDateAll', '#PageX').bind("change", function() {
            $('input[id*=swimmingDateClassification]', '#PageX').val($(this).val());
        });
        $('#swimmingAllClassification', '#PageX').bind("change", function() {
            //alert('checked');
            var mval = $(this).val();
            $('select[id*=swimmingClassification]', '#PageX').each(function() {
                //console.log($(this));
                $(this).val(mval);
                $(this).selectmenu('refresh');
            });
            //$('input[id*=swimmingClassification]', '#PageX').selectmenu('refresh');
        });

    }

    /*
$('input[id*=swimmingClassification]').each(function () {
console.log($(this));		
});
		*/

    function pageShow() {

        $('.calendar', '#PageX').each(function() {
            var id = $(this).attr('id');

            $(this).width('75%').before('<img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/calendar50.png" style="float: right; width: 25px; margin-top: 5px; cursor: pointer; " class="calendarIcon" />'); //margin was 5
            $($(this).closest('form'), '#PageX').prepend('<input type="hidden" id="hidden_' + escapeHTML(id) + '" value="' + escapeHTML($(this).val()) + '" />');
            //console.log($(this).css("margin-top"));

        });


        $('div.ui-input-text', '#PageX').each(function() {
            $(this).css({
                "box-shadow": "rgba(0, 0, 0, 0.2) 0px 0px 0px 1px inset"
            });
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
        if ($('base')[0].href.match(/\d+/) == null) return false;
        var scoutUserIDobj = {
            id: []
        };
        var adultUserIDobj = {
            id: []
        };
        var unitid = $('base')[0].href.match(/\d+/)[0];
        // reset all LI's to normal color
        $('li[id$=LI]', '#PageX').removeClass('ui-body-e').addClass('ui-btn-up-c');

        $('input[name="ScoutUserID"]:checked', '#PageX').each(function() {
            scoutUserIDobj.id.push(this.value);
        });
        $('input[name="AdultUserID"]:checked', '#PageX').each(function() {
            adultUserIDobj.id.push(this.value);
        });
        var swimClass = $('#swimmingClassification').val();

        var swimDate = encodeURIComponent($('#swimmingDateClassification').val()); //encode for url	

        getAccount(scoutUserIDobj, adultUserIDobj, swimClass, swimDate, unitid, '#PageX');

        //		$('#buttonCancel, #buttonSubmit', '#PageX').button('enable');
        //		$(':input', '#PageX #swimmingForm').attr('disabled', false);

    }



    function showErrorPopup(msg) {
        $('#errorPopupContent', '#PageX').html(msg);
        $('#errorPopup', '#PageX').popup({
            tolerance: '10,40',
            transition: 'pop',
            positionTo: 'window',
            history: false
        }).popup('open');
    }

    function escapeHTML(str) {
        var strr = str + '';
        return strr.replace(/[&"'<>]/g, (m) => escapeHTML.replacements[m]);
    }
    escapeHTML.replacements = {
        "&": "&amp;",
        '"': "&quot;",
        "'": "&#39;",
        "<": "&lt;",
        ">": "&gt;"
    };
}

//swim
// Each time called, gets next scout from list to process until none left, then returns to unit page
// For each scout, gets scout account page, then calls to get scout profile
function getAccount(scoutUserIDobj, adultUserIDobj, swimClass, swimDate, unitid, sPage) {
    var idtype = '';
    var thisScoutID = '';
    if (scoutUserIDobj.id.length == 0) {
        //no more scouts to set

        // try leaders
        if (adultUserIDobj.id.length == 0) {

            $('#buttonCancel, #buttonSubmit', sPage).button('enable');
            $(':input', sPage + ' #swimmingForm').attr('disabled', false);
            swimQE = false;
            $.mobile.loading('hide');
            $.mobile.changePage(
                '/mobile/dashboard/admin/unit.asp?UnitID=' + unitid, {
                    allowSamePageTransition: true,
                    transition: 'none',
                    showLoadMsg: true,
                    reloadPage: true
                }
            );
            return;
        } else {
            thisScoutID = adultUserIDobj.id.shift();
            idtype = 'adult';
        }
    } else {
        thisScoutID = scoutUserIDobj.id.shift();
        idtype = 'scout';
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, genError, [sPage, unitid, 'Swim'], getAccount, [scoutUserIDobj, adultUserIDobj, swimClass, swimDate, unitid, sPage]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            //console.log('get Account responded');
            getProfile(scoutUserIDobj, adultUserIDobj, swimClass, swimDate, thisScoutID, idtype, unitid, sPage);
        }
    };

    //console.log('getting ' + thisScoutID);
    if (idtype == 'adult') {
        var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/rosteredit.asp?AdultUserID=' + thisScoutID + '&UnitID=' + unitid;
    } else {
        var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/account.asp?ScoutUserID=' + thisScoutID;
    }


    xhttp.open("GET", url, true);
    xhttp.responseType = "text";

    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, genError, [sPage, unitid, 'Swim'], getAccount, [scoutUserIDobj, adultUserIDobj, swimClass, swimDate, unitid, sPage]);
    };
}

// gets the scout edit profile page
// It will copy all the form fields as they will be needed to post later.
// Some fields are normally activly populated on the page when it is displayed, but as it is not displayed here, those scripts don't auto populate 
// so we will do that here.  First we update the swim data, the fill in the patrol id as found elsewhere on the page.
// If the scout is an approved scout, there is a disapprove button on the page.  If the scout was approved, we will add the approved element (normally a checkbox value)
// to the field list to post.
// Finally, we need to call getBSAprofileData to get other field data normally done in the ajax call
//swim
function getProfile(scoutUserIDobj, adultUserIDobj, swimClass, swimDate, thisScoutID, idtype, unitid, sPage) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, genError, [sPage, unitid, 'Swim'], getProfile, [scoutUserIDobj, adultUserIDobj, swimClass, swimDate, thisScoutID, idtype, unitid, sPage]);
        }

        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;


            var formPost = $('#editProfileForm', this.response).serialize();

            swimDate = encodeURIComponent($('#swimmingDateClassification' + thisScoutID).val());
            swimClass = $('#swimmingClassification' + thisScoutID).val();

            formPost = formPost.replace(/SwimmingClassification=[^&]*/, 'SwimmingClassification=' + escapeHTML(swimClass)).replace(/SwimmingClassificationDate=[^&]*/, 'SwimmingClassificationDate=' + escapeHTML(swimDate));


            //formPost += '&OAMember=yes';
            //formPost = formPost.replace(/OAMember=[^&]*/,'OAMember=yes');



            var patrolid = '';
            var denid = '';
            if ($('a[id="goToDenPatrol"]', this.response).attr('href') != undefined) {
                if ($('a[id="goToDenPatrol"]', this.response).attr('href').match(/PatrolID=(\d+)/) != null) {
                    patrolid = $('a[id="goToDenPatrol"]', this.response).attr('href').match(/PatrolID=(\d+)/)[1];
                }

                if ($('a[id="goToDenPatrol"]', this.response).attr('href').match(/DenID=(\d+)/) != null) {
                    var denid = $('a[id="goToDenPatrol"]', this.response).attr('href').match(/DenID=(\d+)/)[1];
                }
            }
            formPost = formPost.replace(/PatrolID=[^&]*/, 'PatrolID=' + patrolid);
            formPost = formPost.replace(/DenID=[^&]*/, 'DenID=' + denid);



            //if the disapprove button is present on this form, attached the approved element to formPost.  It means the Scout was approved prior and we'll keep it that way

            if ($('a[href="#"][id="disapproveButton"]').text() != "") {
                formPost = formPost + '&Approved=1';
            }

            //getBSAprofileData(scoutUserIDobj,adultUserIDobj,swimClass,swimDate,thisScoutID,idtype,formPost,unitid,sPage);
            postProfile(scoutUserIDobj, adultUserIDobj, thisScoutID, idtype, swimClass, swimDate, unitid, formPost, sPage);

        }
    };

    if (idtype == 'adult') {

        var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/editprofile.asp?UnitID=' + unitid + '&DenID=&PatrolID=&AdultUserID=' + thisScoutID;
    } else {
        var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/editprofile.asp?ScoutUserID=' + thisScoutID + '&UnitID=' + unitid + '&DenID=&PatrolID=';
    }
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, genError, [sPage, unitid, 'Swim'], getProfile, [scoutUserIDobj, adultUserIDobj, swimClass, swimDate, thisScoutID, idtype, unitid, sPage]);
    };
}
//swim




//swim
// given a complete edit profile form, post it, then call to see it there are more scouts to process
function postProfile(scoutUserIDobj, adultUserIDobj, thisScoutID, idtype, swimClass, swimDate, unitid, formPost, sPage) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, genError, [sPage, unitid, 'Swim'], postProfile, [scoutUserIDobj, adultUserIDobj, thisScoutID, idtype, swimClass, swimDate, unitid, formPost, sPage]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            if (this.response.indexOf('Update successful!') != -1) {
                //console.log('completed post');
                //get next scout
                setTimeout(function() {
                    getAccount(scoutUserIDobj, adultUserIDobj, swimClass, swimDate, unitid, sPage);
                }, 200);
            } else {
                var err = '';
                var errmsg = this.response.match(/showErrorPopup\(([^\)]+)/);
                if (errmsg != null) {
                    err = errmsg[1].replace(/<strong>|<\/strong>|<p>|<\/p>/g, '');
                }
                genError(sPage, unitid, 'Swim ' + err + ' Stopped on ' + getToken(formPost, 'FirstName') + ' ' + getToken(formPost, 'LastName'));
            }
        }
    };

    var url;
    if (idtype == 'adult') {
        url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/editprofile.asp?ScoutUserID=&AdultUserID=' + thisScoutID + '&UnitID=' + unitid;
    } else {
        url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/editprofile.asp?ScoutUserID=' + thisScoutID + '&AdultUserID=&UnitID=' + unitid;
    }
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(formPost);

    xhttp.onerror = function() {
        errStatusHandle(500, genError, [sPage, unitid, 'Swim'], postProfile, [scoutUserIDobj, adultUserIDobj, thisScoutID, idtype, swimClass, swimDate, unitid, formPost, sPage]);
    };

}


function checkAdultAdminSwim(pageid, unitID, troop) {
    //determine if a Unit Admin
    var unittype = troop.match(/([^ ]+) \d/)[1];

    var poslist = [];

    var evObj = {
        position: '',
        permission: false
    };

    evObj.position = unittype + ' Admin';


    poslist.push(JSON.parse(JSON.stringify(evObj)));

    adminPositions(pageid, troop, poslist, getAdultSwim, [pageid, unitID, troop, poslist], genError, [pageid, unitID, 'Swim', '']);

}


function getAdultSwim(pageid, unitID, unitname, poslist) {
    // gets a table of scout and leader names with swim dates from the report builder

    if (poslist[0].permission == true) {
        // can use adult names, too
        // Set the roster sort, and get adult list from roster, then go to Report builder

        setRosterNameSort(pageid, unitID, rosterSortSetSwim, [pageid, unitID], genError, [pageid, unitID, 'Swim', '']);

        //reportBuilderHealth(unitID,true,leaderIDlst);
        // Get adult IDs from Roster
    } else {
        leaderListSwim(unitID, false, []);
    }
}

function rosterSortSetSwim(pageid, unitID) {
    getAdultListFromRoster(unitID, leaderListSwim, [unitID, true, ''], genError, [pageid, unitID, 'Health', '']);

}


//leaderIDlist has adult names and ids
function leaderListSwim(unitID, adult, leaderIDlist) {
    swimAdults = leaderIDlist.slice();
    //leaderIDList


    $.mobile.loading('hide');
    $.mobile.changePage(
        '/mobile/dashboard/admin/unit.asp?UnitID=' + unitID, {
            allowSamePageTransition: true,
            transition: 'none',
            showLoadMsg: true,
            reloadPage: true
        }
    );
    return;


}