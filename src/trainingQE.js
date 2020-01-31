// Copyright © 1/13/2018 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.

var trainingIDLI = '';
var quickLookkupLI = '';
var scoutTrainObjListPtr = 0;
var scoutTrainObjList = [];

/*

Training QE model on payments log




Apparently, any leader with view profile can change training and add positions
How do I know the user is a leader?  In my posiitons
if myPositions is not [] then the user has a leadership permission. As long as they have view profile, they can update training.

So, build a list of scouts based on that


*/



//elementContent=getHTMLElement('<div data-role="content">','div',data)


//getHTMLElement('<div x','div','<div x><div></div></div></div>')

function getHTMLElement(start, type, data) {
    var srchstr = data.slice(data.indexOf(start));

    if (srchstr == -1) {
        return '';
    }
    var depth = 0;
    var glob = 'g';
    var pat = '<' + type + '|</' + type;
    var re = new RegExp(pat, glob);
    var res;
    do {
        res = re.exec(srchstr);
        if (res != undefined) {
            if (res[0] == '<' + type) {
                depth += 1;
            } else {
                depth -= 1;
            }
            if (depth == 0) {
                var end = srchstr.indexOf('>', res.index);
                return srchstr.slice(0, end + 1);
            }
            //console.log(res[0],res.index);
        }
    }
    while (res != undefined);

    return '';
}



function addRawTrainQE(data, pageid, unitID, txtunit) {
    trainQE = false;
    var startfunc = data.indexOf('<span style="margin-left: 5px; ">', 1);
    var endfunct = data.indexOf('</h1>', 1);

    var newdata = data.slice(0, startfunc);
    newdata += '<span style="margin-left: 5px; ">';
    newdata += '		<a href="#" id="buttonRefresh" class="text">' + escapeHTML(txtunit) + '</a>';
    if (QEPatrol != '') {
        newdata += '		<a id="goToDenPatrol" href="' + escapeHTML('/mobile/dashboard/admin/denpatrol.asp?UnitID=' + unitID + '&DenID=&PatrolID=' + QEPatrolID) + '" class="text" data-direction="reverse">' + escapeHTML(QEPatrol) + '</a>';
    }
    newdata += '           Record Multiple Scout Training Information';
    newdata += '</span>';
    newdata += data.slice(endfunct);

    data = newdata;

    var startfunc = data.indexOf('<a id="goBack"', 1);
    var endfunct = data.indexOf('<img src', startfunc);
    myfunc = '<a href="#" id="buttonRefresh" >';
    var newdata = data.slice(0, startfunc) + myfunc + '\n' + data.slice(endfunct);
    data = newdata;

    // replace content
    var startfunc = data.indexOf('<div data-role="content">');
    var endfunct = data.indexOf('</div><!-- /content -->');
    var newdata = data.slice(0, startfunc);
    newdata += setTrainingPageContent(txtunit, 'Page' + escapeHTML(pageid));
    newdata += data.slice(endfunct);
    data = newdata;


    // replace style
    var startfunc = data.indexOf('<style type="text/css">');
    var endfunct = data.indexOf('</style>');
    var newdata = data.slice(0, startfunc);
    newdata += '	<style type="text/css">';
    newdata += '		#Page' + escapeHTML(pageid) + ' .ui-select .ui-btn-icon-right .ui-btn-inner	{ padding-left: 10px; padding-right: 35px; }';
    newdata += '		#Page' + escapeHTML(pageid) + ' .ui-select .ui-btn-icon-right .ui-icon		{ right: 10px; }';
    newdata += '		#Page' + escapeHTML(pageid) + ' #popupDeleteLog								{ max-width: 400px; }';
    newdata += '		#Page' + escapeHTML(pageid) + ' .smallText		{ color: gray; margin-top: 15px; }';
    newdata += '		#Page' + escapeHTML(pageid) + ' img.imageSmall	{ position: relative; width: 30px; height: 30px; top: -5px; border: 1px solid gray; }';
    newdata += '		#Page' + escapeHTML(pageid) + ' div.ui-input-text { margin-top: 0px; padding-top:0px; "box-shadow": "rgba(0, 0, 0, 0.2) 0px 0px 0px 1px inset"; }\n';
    newdata += '	</style>';
    newdata += data.slice(endfunct);
    data = newdata;

    // replace script.  Starsts after <script tag
    var startfunc = data.indexOf('var formPost;');
    var endfunct = data.indexOf('</script>', startfunc);

    var dynamicFunc = '';
    for (var i = 0; i < scoutPermObjList.length; i++) {
        if (scoutPermObjList[i].name.match(/^ACCOUNT,/) == null) {
            dynamicFunc += "			$('#buttonLookup" + scoutPermObjList[i].id + "', '#PageX').click(function () {\n";
            dynamicFunc += "               $('#setPopID').val(" + scoutPermObjList[i].id + ");\n";
            //dynamicFunc +=	"				alert('click " +scoutPermObjList[i].id +"');\n";

            dynamicFunc += "				$( '#setValMenu' ).popup( 'open');\n";
            //setValMenu
            dynamicFunc += "				return false;\n";
            dynamicFunc += "			});\n";
        }
    }

    var myfunc = '' + tqscript;
    myfunc = myfunc.slice(22).slice(0, -1).replace(/UnitID=X/g, 'UnitID=' + escapeHTML(unitID)).replace(/DynamicFunc\(\)/, dynamicFunc).replace(/\#PageX/g, '#Page' + escapeHTML(pageid));
    var newdata = data.slice(0, startfunc) + myfunc + '\n' + data.slice(endfunct);
    data = newdata;

    //scoutTrainObjList=[];
    return data;


}

function setTrainingPageContent(txtunit, tpageid) {
    var newdata;
    newdata = '	<div data-role="content">';

    newdata += '	<form id="trainingForm">';
    newdata += '		<input type="hidden" name="Action" value="Submit" />';
    newdata += '		<ul data-role="listview" data-theme="d" data-inset="true" data-count-theme="f" style="margin-top: 0;" class="ui-icon-alt;">';

    newdata += '			<li data-role="list-divider" role="heading" data-theme="a">';
    newdata += '			 Quick Entry Training Information';
    newdata += '			</li>';

    newdata += '			<li id="scoutsLI" data-theme="d">';

    newdata += '					<p class="normalText">Now you can quickly and easily enter Scout Training information for the whole Pack or Troop!</p>';

    newdata += '						<legend class="text-orange">';
    newdata += '								<strong>Update Training Information:</strong>';
    newdata += '						</legend>';
    newdata += '			</li>';
    newdata += '		</ul>';
    newdata += '		<fieldset data-role="controlgroup">';
    //newdata += '			<div>';							

    //fpopup +=		'<a href="#importBPMenu" data-rel="popup" data-transition="slideup" >';  //
    //fpopup +=			'<div>Import Black Pug Data';
    //fpopup +=				'<span style="position: relative; ">';
    //fpopup +=					'<img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/uploadfile50.png" alt="import" title="Import" style="position: absolute; left: 6px; top: -2px; width: 24px; " />';
    //fpopup +=				'</span>';
    //fpopup +=			'</div>';
    //fpopup +=		'</a>';




    newdata += '					<div class="ui-grid-b ui-responsive" >';
    newdata += '						<div class="ui-block-a" style="font-weight: bold; font-size: 16px;line-height:45px; margin-bottom:0;">';
    newdata += '							Scout';
    newdata += '            				</div>';
    newdata += '						<div class="ui-block-b" style="font-weight: bold; font-size: 16px; line-height:45px; margin-bottom:0;">';
    newdata += '											Training';
    newdata += '              			</div>';
    newdata += '						<div class="ui-block-c" style="font-weight: bold; font-size: 16px; line-height:45px; margin-bottom:0;">';
    newdata += '											Date Completed';
    //   a black  b blue c grey d white e yellow f green g red h white no border i blk 
    newdata += '              			</div>';


    //globalset

    newdata += '					<div class="ui-block-a" style="height:56px;">';
    newdata += '						<input type="checkbox" data-theme="d" name="AllScoutUserID" id="AllscoutUserID" value="All">\n';
    newdata += '						<label for="AllscoutUserID" >\n';
    newdata += '							<div style="float: left; width: 30px; ">\n';
    newdata += '								<img src="https://d3hdyt7ugiz6do.cloudfront.net/mobile/images/icons/forumsorange48.png\n" class="imageSmall" />\n';
    newdata += '							</div>\n';
    newdata += '							<div style="margin-left: 40px; ">\n';
    newdata += '								Click to Select All Scouts\n';
    newdata += '							</div>\n';
    newdata += '						</label>\n';
    newdata += '            			</div>'; // end block a

    newdata += '					<div class="ui-block-b" style="height:56px;" >';
    newdata += '						<div style="float: left; width: 90px; padding:5px;">\n';
    //newdata +=  '							<a href="#setValMenu" id="abc" data-role="button" data-theme="g" data-rel="popup" data-transition="slideup" >+ Add</a>';
    newdata += '				        	<input type="button" data-role="button" value="+ Add"    data-theme="g" id="AllbuttonLookup" />'; //style="font-size:12px; width:10px; height:46px;"
    newdata += '					   </div >'; //style="width:400px;"
    newdata += '					   <div style="margin-left: 100px; height:46px; ">\n';
    newdata += '							<input readonly type="text" name="AllaID" id="AllaID" defaultValue="" value="" placeholder="Select +Add here to apply to all..." style=" height:46px;" />'; //style="font-size: 12px; width: 70%;"
    newdata += '					   </div>';
    newdata += '           			</div>';
    newdata += '					<div class="ui-block-c" style="height:56px;">';
    newdata += '						<input  type="text" name="AllbID" id="AllbID" defaultValue="" value="" style=" height:46px;" placeholder="Set Date here to apply to all.." class="calendar">'; //style="font-size: 12px; width: 70%;"
    newdata += '           			</div>';

    newdata += '					<div class="ui-block-a ui-body-a"  style="height:10px; ">';
    newdata += '           			</div>';
    newdata += '					<div class="ui-block-b ui-body-a" style="height:10px;">';
    newdata += '           			</div>';
    newdata += '					<div class="ui-block-c ui-body-a" style="height:10px;">';
    newdata += '           			</div>';

    for (var i = 0; i < scoutPermObjList.length; i++) {
        if (scoutPermObjList[i].name.match(/^ACCOUNT,/) == null) {

            newdata += '					<div class="ui-block-a" style="height:46px;">';
            newdata += '						<input type="checkbox" data-theme="d" name="ScoutUserID" id="scoutUserID' + escapeHTML(scoutPermObjList[i].id) + '" value="' + escapeHTML(scoutPermObjList[i].id) + '">\n';
            newdata += '						<label for="scoutUserID' + escapeHTML(scoutPermObjList[i].id) + '" >\n';
            newdata += '							<div style="float: left; width: 30px; ">\n';
            newdata += '								<img src="' + escapeHTML(scoutPermObjList[i].img) + '" class="imageSmall" />\n';
            newdata += '							</div>\n';
            newdata += '							<div style="margin-left: 40px; ">\n';
            newdata += '								' + escapeHTML(scoutPermObjList[i].name) + '\n';
            newdata += '							</div>\n';
            newdata += '						</label>\n';
            newdata += '            			</div>'; // end block a

            newdata += '					<div class="ui-block-b" style="height:46px;" >';
            newdata += '						<div style="float: left; width: 90px; padding:5px;">\n';
            newdata += '				        	<input type="button"  data-role="button" value="+ Add" data-theme="g" id="buttonLookup' + escapeHTML(scoutPermObjList[i].id) + '"/>';
            newdata += '					   </div >'; //style="width:400px;"
            newdata += '					   <div style="margin-left: 100px; height:46px; ">\n';
            newdata += '							<input readonly type="text" name="aID' + escapeHTML(scoutPermObjList[i].id) + '" id="aID' + escapeHTML(scoutPermObjList[i].id) + '" defaultValue="" value="" style=" height:46px;" />'; //style="font-size: 12px; width: 70%;"
            newdata += '					   </div>';
            newdata += '           			</div>';
            newdata += '					<div class="ui-block-c" style=" height:46px;">';
            newdata += '						<input type="text" name="bID' + escapeHTML(scoutPermObjList[i].id) + '" id="bID' + escapeHTML(scoutPermObjList[i].id) + '" defaultValue="" value="" style=" height:46px;" class="calendar">'; //style="font-size: 12px; width: 70%;"
            newdata += '           			</div>';
        }
    }

    newdata += '					</div>'; // end of grid b

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

    //var trainingIDLI='';
    //                                                                                                max width 400px
    newdata += '<div data-role="popup" id="setValMenu" data-theme="d" data-history="false"  data-dismissible="false" style="max-width: 600px;" data-overlay-theme="b">'; //data-theme="d" data-history="false"  data-dismissible="false"
    newdata += '<ul data-role="listview" data-inset="true" style="min-width: 300px;" data-theme="d" >'; //class="ui-icon-alt"
    newdata += '<li data-role="divider" data-theme="e">Select Training</li>';
    //newdata +=				'	<div data-role="content">';
    //newdata +=				'		<form id="trainingForm" method="post" action="#" enctype="multipart/form-data">';
    newdata += '		<p class="normalText">Select the training description.</p>';
    newdata += '		<ul data-role="listview" data-inset="true">';
    newdata += trainingIDLI;
    newdata += quickLookkupLI;
    newdata += '		</ul>';
    newdata += '<li><input type="button" value="Set Training" data-theme="g" id="buttonSetVal" ><input type="button" value="Cancel" data-theme="g" id="buttonSetCancel" ></li>';
    newdata += '<li id="setValErrLI">';
    newdata += '</li>';
    newdata += '</ul>';
    newdata += '		<input type="hidden" id="setPopID",value="">';
    newdata += '</div>';



    newdata += '	<div data-role="popup" id="errorPopup" data-overlay-theme="a" class="ui-content" data-theme="e" data-transition="fade">';
    newdata += '		<a href="#" id="closePopupButton" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>';
    newdata += '		<div id="errorPopupIcon"></div>';
    newdata += '		<div id="errorPopupContent"></div>';
    newdata += '		<div class="clearRight"></div>';

    newdata += '	</div>';

    newdata += '		<div id="footer" align="center">';

    newdata += logoutWarningPageContent(tpageid);
    newdata += '<div style="margin-top: 6px;">This page was produced by the Feature Assistant Extension/Add-on and is not supported by BSA</div>';
    newdata += '	<div style="margin-top: 6px;">&copy; ' + escapeHTML(cyear()) + '- Boy Scouts of America &bull; <a href="/mobile/help/privacy.asp">Privacy</a></div>';
    newdata += '	<div><a href="/" data-ajax="false"><img src="https://d1kn0x9vzr5n76.cloudfront.net/mobile/images/scoutbookbsalogo400.png" width="200"></a></div>';

    newdata += '		</div>';


    return newdata;


}

function tqscript() {
    var formPost;

    function pageInit() {


        $('#trainingForm', '#PageX').submit(function() {
            var found = false;
            var err = '';
            $('#buttonSubmit', '#PageX').focus();

            $('input[name="ScoutUserID"]:checked', '#PageX').each(function() {
                // check aid and bid for this to make sure they have values,otherwise, error
                found = true;
                var id = $(this).attr('id').match(/\d+/);
                var eid = $(this).attr('id');
                var scout = $('label[for="' + eid + '"]').text().trim();
                if ($('#aID' + id).val() == '') {
                    err += scout + ' is Missing Training Name\n';
                }
                if ($('#bID' + id).val() == '') {
                    err += scout + ' is Missing Training Date\n';
                } else {
                    if ($('#bID' + id).val().match(/\d+\/\d+\/\d{4}/) == null) {
                        err += scout + ' Training Date is invalid\n';
                    } else {
                        var sd = new Date($('#bID' + id).val());
                        if (sd - Date.now() > 0) {
                            err += scout + ' Training Date is invalid\n';
                        }
                    }
                }


            });

            if (found == false) {
                alert('No Scouts are selected');
                return false;
            }

            if (err != '') {
                alert(err);
                return false;
            }

            // disable all inputs
            $(':input', '#PageX #trainingForm').attr('disabled', true);
            $('#buttonCancel, #buttonSubmit', '#PageX').button('disable');

            $.mobile.loading('show', {
                theme: 'a',
                text: 'saving...this can take several minutes for large units',
                textonly: false
            });
            setTimeout(function() {
                submitSForm();
            }, 200);
            return false;
        });



        $('#buttonCancel', '#PageX').click(function() {

            scoutTrainObjList.length = 0;
            trainQE = false;

            $.mobile.changePage(

                'https://' + host + 'scoutbook.com/mobile/dashboard/admin/unit.asp?UnitID=X&DenID=&PatrolID=&Refresh=1',

                {
                    allowSamePageTransition: true,
                    transition: 'none',
                    showLoadMsg: true,
                    reloadPage: true
                }
            );


            return false;
        });

        $('#buttonRefresh', '#PageX').click(function() {


            scoutTrainObjList.length = 0;
            trainQE = false;
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

        $('#AllscoutUserID', '#PageX').click(function() {
            if ($(this).is(':checked')) {
                $('input[name="ScoutUserID"]', '#PageX').prop('checked', true).checkboxradio("refresh");
            } else {

                $('input[name="ScoutUserID"]', '#PageX').prop('checked', false).checkboxradio("refresh");
            }

            return false;
        });

        $('#AllbuttonLookup', '#PageX').click(function() {
            $('#setPopID').val('All');
            $("#setValMenu").popup("open");
            return false;
        });
        $('#AllbID', '#PageX').change(function() {
            var newdate = $(this).val();
            $('input[id^="bID"]').each(function() {
                $(this).val(newdate);
            });
            return false;
        });

        DynamicFunc();

        $('#buttonSetVal', '#PageX').click(function() {
            //alert($('#setPopID').val());
            //set the default val = option val of popup
            //set val =val or text of popup
            var optval = $('#trainingID option:selected').val();
            var opttxt = $('#trainingID option:selected').text();
            var id = $('#setPopID').val();
            if (id == 'All') {

                $('#AllaID').attr('defaultvalue', optval);
                $('#AllaID').val(opttxt.replace(/select a course\.\.\./, '')); //Select +Add here to apply to all...

                $('input[id^="aID"]').each(function() {
                    $(this).attr('defaultvalue', optval);
                    $(this).val(opttxt.replace(/select a course\.\.\./, ''));
                });
            } else {
                $('#aID' + id).attr('defaultvalue', optval);
                $('#aID' + id).val(opttxt.replace(/select a course\.\.\./, ''));
            }
            // Use the ID to see which elements to update
            $("#setValMenu").popup("close");
            return false;
        });




        $('#buttonSetCancel', '#PageX').click(function() {
            $("#setValMenu").popup("close");
            return false;
        });

        $('#quickTrainingID a[data-trainingid]').click(function() {
            var trainingID = $(this).attr('data-trainingid');
            $('#trainingID').val(trainingID).selectmenu('refresh');
            // clear search box
            $('a.ui-input-clear').trigger('click');
            //$('#dateCompleted').focus();
            return false;
        });

        $('#buttonSubmit', '#PageX').click(function() {

            $('#trainingForm', '#PageX').submit();
            trainQE = false;


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

        if ($('base')[0].href.match(/\d+/) == null) return false;
        var unitid = $('base')[0].href.match(/\d+/)[0];
        // reset all LI's to normal color
        $('li[id$=LI]', '#PageX').removeClass('ui-body-e').addClass('ui-btn-up-c');


        setTimeout(function() {
            processSetTraining(unitid, '#PageX');
        }, 200); //process for scouts

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



function getTrainingLists(unitID, pageid) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, genError, [pageid, unitID, 'Training'], getTrainingLists, [unitID, pageid]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            //capture training content
            quickLookkupLI = getHTMLElement('<li id="quickLookkupLI" data-theme="d">', 'li', this.response)


            trainingIDLI = getHTMLElement('<li data-role="fieldcontain" data-theme="d" id="trainingIDLI" class="ui-icon-alt">', 'li', this.response)



            // Set global to modify next page
            // call for next page
            $.mobile.changePage(
                '/mobile/dashboard/admin/unit.asp?UnitID=' + unitID, {
                    allowSamePageTransition: true,
                    transition: 'none',
                    showLoadMsg: true,
                    reloadPage: true
                }
            );
        }
    };
    if (scoutPermObjList.length == 0) {
        alert('You do not have permissions for any Scouts in this unit');
        $('#faOverlay', pageid).hide();
        return false;
    }

    var thisScoutID = scoutPermObjList[0].id;
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/trainingentry.asp?ScoutUserID=' + thisScoutID + '&AdultUserID=&UnitID=' + unitID;



    xhttp.open("GET", url, true);
    xhttp.responseType = "text";

    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, genError, [pageid, unitID, 'Training'], getTrainingLists, [unitID, pageid]);
    };

}

function processSetTraining(unitID, pageid) {
    scoutTrainObjListPtr = 0;
    scoutTrainObjList = [];

    var id;
    var eid;
    var evObj = {};
    $('input[name="ScoutUserID"]:checked', pageid).each(function() {

        var id = $(this).attr('id').match(/\d+/);
        var eid = $(this).attr('id');
        var scout = $('label[for="' + eid + '"]').text().trim();

        tid = $('#aID' + id).attr('defaultvalue');
        tdate = $('#bID' + id).val();


        evObj = {
            id: id,
            tid: tid,
            tdate: tdate
        };
        scoutTrainObjList.push(JSON.parse(JSON.stringify(evObj)));

    });
    iteratePostTraining(pageid, unitID, scoutTrainObjList, scoutTrainObjListPtr);

}

function iteratePostTraining(pageid, unitID, scoutTrainObjList, scoutTrainObjListPtr) {

    if (scoutTrainObjListPtr == scoutTrainObjList.length) {
        //done - go to unit page
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

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, genError, [pageid, unitID, 'Training'], iteratePostTraining, [pageid, unitID, scoutTrainObjList, scoutTrainObjListPtr]);
        }
        if (this.readyState == 4 && this.status == 200) {

            resetLogoutTimer(url);
            servErrCnt = 0;

            if (this.response.indexOf("$.mobile.changePage('/mobile/dashboard/admin/training.asp") == -1) {
                //alert('Error saving Training ');
                genError(pageid, unitID, 'Error Saving Training');
                return false;
            }

            scoutTrainObjListPtr += 1;
            iteratePostTraining(pageid, unitID, scoutTrainObjList, scoutTrainObjListPtr);
        }
    }


    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/trainingentry.asp?Action=Submit&TrainingID=&UserTrainingID=&ScoutUserID=' + scoutTrainObjList[scoutTrainObjListPtr].id + '&AdultUserID=&UnitID=' + unitID;
    xhttp.open("POST", url, true);
    var boundary = '----WebKitFormBoundary' + Math.random().toString().substr(2);

    xhttp.setRequestHeader("content-type", "multipart/form-data; boundary=" + boundary);
    xhttp.responseType = "text";
    var multipart = '';
    multipart += "--" + boundary +
        '\r\nContent-Disposition: form-data; name="TrainingID"' +
        "\r\n\r\n" + scoutTrainObjList[scoutTrainObjListPtr].tid + "\r\n";
    multipart += "--" + boundary +
        '\r\nContent-Disposition: form-data; name="DateCompleted"' +
        "\r\n\r\n" + scoutTrainObjList[scoutTrainObjListPtr].tdate + "\r\n";
    multipart += "--" + boundary +
        '\r\nContent-Disposition: form-data; name="File"; filename=""' +
        "\r\nContent-type: application/octet-stream" +
        "\r\n\r\n" + '' + "\r\n";
    multipart += "--" + boundary +
        '\r\nContent-Disposition: form-data; name="Notes"' +
        "\r\n\r\n" + '' + "\r\n";
    multipart += "--" + boundary + "--\r\n";


    xhttp.send(multipart);
    xhttp.onerror = function() {
        errStatusHandle(500, genError, [pageid, unitID, 'Training'], iteratePostTraining, [pageid, unitID, scoutTrainObjList, scoutTrainObjListPtr]);
    }
}