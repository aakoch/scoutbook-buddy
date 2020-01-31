// Copyright © 2/8/2019 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.
var MBCReportFlag = false;
var MBCEditFlag = false;

function addRawMBC(data, pageid) {

    if (MBCQEMBflag == true) {
        data = buildMBCQEmeritbadgePage(data, pageid);
        MBCQEMBflag = false;
    } else if (pickMBCFlag == true) {
        data = buildPickMBCPage(data, pageid, pickMBCFlagUnit);
        //console.log(data);
        pickMBCFlag = false;
        //addMBIDindex -=1;
    } else if (MBCReportFlag == true) {
        data = buildMBCReportStartPage(data, pageid);
        MBCReportFlag = false;
    } else if (MBCEditFlag == true) {
        data = buildMBCEditStartPage(data, pageid);
        MBCReportFlag = false;
    } else {


        var startfunc = data.indexOf('<li id="messagesDivider" data-theme="d">'); //#old

        var startfunc = data.indexOf('<div class="ui-block-a">'); //#New


        var newdata = data.slice(0, startfunc);
        newdata += '<div class="ui-block-a">'; //#new
        newdata += '<ul data-role="listview"  data-inset="true" style="margin-bottom: 1em; " class="ui-icon-alt" data-theme="d">'; //#New
        newdata += '<li data-role="list-divider"  id="mbcQEHeader" style="display: none;" data-theme="a" class="mbc administration"  >My Merit Badge Counseling</li>'; //#New



        newdata += '	<li class="administration mbc" id="mbcQEDivider" data-theme="d" style="display: none;">';



        newdata += '    	<a href="#quickEntryMenu" data-rel="popup" data-transition="slideup" >';
        newdata += '			<div id ="quickEntry">';
        newdata += '				<div style="display: inline-block; width: 28px; margin-right: 1px; ">';
        newdata += '					<img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/quickentry48.png" alt="quick entry" title="Quick Entry" style="position: absolute; left: 12px; top: 6px; width: 23px; " />'; //class="imageSmall"
        newdata += '				</div>';
        newdata += '				Quick Entry for MB Counselors';
        newdata += '			</div>';
        newdata += '		</a>';
        //data-theme="d" data-history="false"  data-dismissible="false" style="max-width: 400px;" data-overlay-theme="b"
        newdata += '		<div data-role="popup" id="quickEntryMenu" data-theme="d" data-history="false" data-dismissible="false" data-overlay-theme="b" >';
        newdata += '			<ul data-role="listview" data-inset="true" style="min-width:210px;" data-theme="d" class="ui-icon-alt">';
        newdata += '				<li data-role="divider" data-theme="a">Choose an action:</li>';
        newdata += '				<li><a href="#" id="meritbadgeqe" class="showLoading" >Sign Completed Merit Badges</a></li>';
        newdata += '				<li><a href="#" id="meritbadgereqqe" class="showLoading">Enter Merit Badge Req.</a></li>';
        newdata += '				<li><a href="#" id="dismiss" >Close</a></li>';
        newdata += '			</ul>';
        newdata += '		</div>';

        newdata += '	</li>';


        newdata += '		<li class="administration mbc" id="mbcEditMBDivider" data-theme="d" style="display: none;">';
        newdata += '    	<a href="#" id="mbcEditMBs" class="showLoading" >';
        newdata += '			<div id ="mbcEditMB">';
        newdata += '				<div style="display: inline-block; width: 28px; margin-right: 1px; ">';
        newdata += '					<img src="' + localpath + 'editbc48.png" alt="quick entry" title="Edit Merit Badge" style="position: absolute; left: 12px; top: 6px; width: 23px; " />'; //class="imageSmall"
        newdata += '				</div>';
        newdata += '				Edit Merit Badges for MB Counselors';
        newdata += '			</div>';
        newdata += '		</a>';
        newdata += '	</li>';



        newdata += '		<li class="administration mbc" id="mbcReportDivider" data-theme="d" style="display: none;">';
        newdata += '    	<a href="#" id="mbcReports" class="showLoading" >';
        newdata += '			<div id ="mbcReport">';
        newdata += '				<div style="display: inline-block; width: 28px; margin-right: 1px; ">';
        newdata += '					<img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/ReportsBSA100gray.png" alt="quick entry" title="MBC Report" style="position: absolute; left: 12px; top: 6px; width: 23px; " />'; //class="imageSmall"
        newdata += '				</div>';
        newdata += '				Reports for MB Counselors';
        newdata += '			</div>';
        newdata += '		</a>';
        newdata += '	</li>';
        //end new







        newdata += '</ul>'; //#New

        //newdata +=  data.slice(startfunc);	//#old
        newdata += data.slice(startfunc + 24); //#new

        data = newdata;

        data = insertEventImport(data, pageid);
        data = insertEventExport(data, pageid);
        $(document).one('pagebeforeshow', function() {
            //dbconsole.log('call dash');
            dashbeforeshow('#Page' + pageid);
        });
    }
    return data;
}


function addRawAddMB2(data, pageid, thisurl) {
    //unitID= /UnitID\=(\d+)/.exec(thisurl)[1];	

    data = data.replace('Now you can quickly and easily enter merit badge requirements for a single Scout or your <strong>entire troop</strong>.  Perfect for recording requirements completed in a group setting.', 'Now you can quickly and easily enter merit badge requirements for a single Scout or your <strong>entire class</strong>.  Perfect for recording requirements completed in a group setting.');



    // eliminate any scouts in list.  Add in scouts from MBCdata
    // eliminate any mb options not in MBCdata
    // eliminate all and just replace...
    // Update scripts to not use the qe but chunk thru instead
    uniqlist = [];
    uniquemblist(uniqlist);
    //console.log(uniqlist);

    //if there is a MB id in the url, it should end up selected
    //meritbadgequickentry2.asp?PatrolID=&UnitID=&MeritBadgeID=4

    var startfunc = data.indexOf('<select name="MeritBadgeID" id="meritBadgeID" data-theme="d">');
    var endfunct = data.indexOf("</select>", startfunc);
    var newdata = data.slice(0, startfunc);
    newdata += '<select name="MeritBadgeID" id="meritBadgeID" data-theme="d">';

    //newdata += '<option value="'+uniqlist[0].mbid+'"  selected="selected" >'+uniqlist[0].mbShortName+'</option>'	

    var selectid = thisurl.match(/MeritBadgeID=(\d+)/);
    if (selectid == null) {
        newdata += '<option value>choose one...</option>';
    }
    for (var i = 0; i < uniqlist.length; i++) {
        if (selectid != null) {
            if (uniqlist[i].mbid == selectid[1]) {
                newdata += '<option value="' + escapeHTML(uniqlist[i].mbid) + '" selected="selected" >' + escapeHTML(uniqlist[i].mbShortName) + '</option>';
            } else {
                newdata += '<option value="' + escapeHTML(uniqlist[i].mbid) + '" >' + escapeHTML(uniqlist[i].mbShortName) + '</option>';
            }

        } else {
            newdata += '<option value="' + escapeHTML(uniqlist[i].mbid) + '" >' + escapeHTML(uniqlist[i].mbShortName) + '</option>';
        }

    }

    newdata += data.slice(endfunct);

    data = newdata;

    //removes ability for mbc to approve.  Why?

    var startfunc = data.indexOf('<div id="canApproveDIV">');
    var endfunct = data.indexOf("</div>", startfunc);
    var newdata = data.slice(0, startfunc);
    newdata += '<div id="canApproveDIV">';
    newdata += data.slice(endfunct);
    data = newdata;




    var mbidver = ''
    if (data.match(/value="(\d+)"  checked="checked"/) != null) {
        mbidver = data.match(/value="(\d+)"  checked="checked"/)[1];
    }


    var startfunc = data.indexOf('<strong>Choose Scout(s):</strong>');
    var endfunct = data.indexOf("</fieldset>", startfunc);
    var newdata = data.slice(0, startfunc);
    newdata += '<strong>Choose Scout(s):</strong>';
    newdata += '</legend>';
    // only provide scouts who are connected for this badge...
    var disabled = '';
    if (selectid != null) {
        //console
        for (var i = 0; i < MBCdata.length; i++) {
            for (var j = 0; j < MBCdata[i].mbLst.length; j++) {
                //console.log(MBCdata[i].mbLst[j].mbid + ' =? '+ selectid[1]);
                if (MBCdata[i].mbLst[j].mbid == selectid[1]) {
                    disabled = '';
                    if (MBCdata[i].mbLst[j].mbver != mbidver) {
                        disabled = 'disabled = "disabled"';
                    }
                    newdata += '						<input type="checkbox" name="ScoutUserID" id="scoutUserID' + escapeHTML(MBCdata[i].id) + '" value="' + escapeHTML(MBCdata[i].id) + '" data-theme="d" ' + disabled + ' data-unitid="' + escapeHTML(MBCdata[i].unitid) + '" >\n';
                    newdata += '						<label for="scoutUserID' + escapeHTML(MBCdata[i].id) + '">\n';
                    newdata += '							<div style="display: inline-block; width: 30px; margin-right: 5px; ">\n';
                    newdata += '								<img src="' + escapeHTML(MBCdata[i].img) + '" class="imageSmall" />\n';
                    newdata += '							</div>\n';
                    newdata += '							' + escapeHTML(MBCdata[i].name) + '\n';
                    newdata += '							<div style="float: right; "></div>\n';
                    newdata += '						</label>\n';
                }
            }
        }
    }
    newdata += data.slice(endfunct);
    data = newdata;




    //var startfunc = data.indexOf('Notes/Comments:');
    //var endfunct = data.indexOf('</div>',startfunc);
    //var newdata = data.slice(0,startfunc);				
    //newdata += data.slice(endfunct);
    //data=newdata;	

    //update scripts
    // replace script.  Starsts after <script tag
    var startfunc = data.indexOf('var formPost;');
    var endfunct = data.indexOf('</script>', startfunc);
    //var oldscript=data.slice(startfunc,endfunct);	// Get MBID out of this
    //oldscript.match(/MBid=(\d+)/);


    var myfunc = '' + mbcreqqescript;

    myfunc = myfunc.slice(27).slice(0, -1).replace(/\#PageX/g, '#Page' + escapeHTML(pageid));
    var newdata = data.slice(0, startfunc) + myfunc + '\n' + data.slice(endfunct);
    data = newdata;

    //add modification notice
    startfunc = data.indexOf('<div style="margin-top: 6px;">&copy;');
    var newdata = data.slice(0, startfunc);
    newdata += '<div style="margin-top: 6px;">This page was modified by the Feature Assistant Extension/Add-on and is not supported by BSA</div>';
    data = newdata + data.slice(startfunc);

    return data;
}

function getScoutMBVers() {
    // for each scout with this mbid, get the version they are working on 
    var mbid = $('#meritBadgeID option:selected').val();
    var found = false;
    for (var i = 0; i < MBCdata.length; i++) {
        for (var j = 0; j < MBCdata[i].mbLst.length; j++) {
            if (MBCdata[i].mbLst[j].mbid == mbid && MBCdata[i].mbLst[j].mbver == '') {
                //get mbver for this scout.  Suppose could go to account page and look for link.  If not there, go to advancement page
                found = true;
                break;
            }
        }
        if (found == true) {
            break;
        }
    }
    if (found == false) {
        $.mobile.changePage('/mobile/dashboard/admin/advancement/meritbadgequickentry2.asp?PatrolID=&UnitID=&MeritBadgeID=' + $('#meritBadgeID option:selected').val(), {
            transition: 'fade'
        });
        return;
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, '', [], getScoutMBVers, []);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            //look for mb link. If found, scout is outside any unit the MBC may belong to, so get mbver and update array.  If not found, call func to get advancement page to find it
            if ($('a[href*="meritbadge.asp?MeritBadgeID=' + mbid + '"]', this.response).length != 0) {
                //got it
                MBCdata[i].mbLst[j].mbver = '';
                if ($('a[href*="meritbadge.asp?MeritBadgeID=' + mbid + '"]', this.response).attr('href').match(/MeritBadgeVersionID=(\d+)/) != null) {
                    MBCdata[i].mbLst[j].mbver = $('a[href*="meritbadge.asp?MeritBadgeID=' + mbid + '"]', this.response).attr('href').match(/MeritBadgeVersionID=(\d+)/)[1];
                }
                getScoutMBVers();
                return;
            } else {
                // the MBC is in the same unit as the scout.  See if the Scout is approved...
                if ($('img[src*="securityapproved"]', this.response).length != 0) {

                    //go to advancement page to get it
                    getMbVerFromAdv(i, j);
                } else {
                    //remove this scout from the list
                    MBCdata.splice(i, 1);
                    getScoutMBVers(); //next scout
                    return;
                }
            }
        }
    };

    var url = 'https://' + host + 'scoutbook.com' + MBCdata[i].link;
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();

    xhttp.onerror = function() {
        errStatusHandle(500, '', [], getScoutMBVers, []);
    };


}

function getMbVerFromAdv(i, j) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, '', [], getMbVerFromAdv, [i, j]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            if ($('a[href*="meritbadge.asp?MeritBadgeID=' + MBCdata[i].mbLst[j].mbid + '"]', this.response).length != 0) {
                //got it
                // is it already complete?
                var stat = $('a[href*="meritbadge.asp?MeritBadgeID=' + MBCdata[i].mbLst[j].mbid + '"]', this.response);

                if ($('img[src*="checkboxawarded"]', stat).length == 0 && $('img[src*="checkboxdone"]', stat).length == 0 && $('img[src*="checkboxapproved"]', stat).length == 0) {


                    MBCdata[i].mbLst[j].mbver = '';
                    if ($('a[href*="meritbadge.asp?MeritBadgeID=' + MBCdata[i].mbLst[j].mbid + '"]', this.response).attr('href').match(/MeritBadgeVersionID=(\d+)/) != null) {
                        MBCdata[i].mbLst[j].mbver = $('a[href*="meritbadge.asp?MeritBadgeID=' + MBCdata[i].mbLst[j].mbid + '"]', this.response).attr('href').match(/MeritBadgeVersionID=(\d+)/)[1];
                    }
                    getScoutMBVers();
                    return;
                }
            }

            //might also be complete already


            //debugger;
            // may be connected as a counselor but Scout does not have this badge started or it was deleted.  This scout MB should be removed from the list
            MBCdata[i].mbLst.splice(j, 1); //10/30/2018
            //if no badges left in the list, remove the scout from MBCdata
            if (MBCdata[i].mbLst.length == 0) {
                MBCdata.splice(i, 1);
            }
            getScoutMBVers();
            return;


            //alert('Halted due to unexpected error finding Scout merit badge version');
            // $.mobile.loading('hide');
            //return;
        }
    };

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/advancement/default.asp?ScoutUserID=' + MBCdata[i].id + '&UnitID=' + MBCdata[i].unitid + '&DenID=&PatrolID=';
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();

    xhttp.onerror = function() {
        errStatusHandle(500, '', [], getMbVerFromAdv, [i, j]);
    };
}


function mbcreqqescript() {
    var formPost;

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



        //$('#canApproveDIV', '#PageX').show();


        $('#meritBadgeID', '#PageX').change(function() {
            $.mobile.loading('show', {
                theme: 'a',
                text: 'Loading...',
                textonly: false
            });
            getScoutMBVers();
            //$.mobile.changePage('/mobile/dashboard/admin/advancement/meritbadgequickentry2.asp?PatrolID=&UnitID=&MeritBadgeID=' + $('#meritBadgeID option:selected').val(), { transition: 'fade'} );
        });

        //this input doesn't exist in initial pages...
        $('input[name=MeritBadgeVersionID]', '#PageX').change(function() {
            $.mobile.changePage('/mobile/dashboard/admin/advancement/meritbadgequickentry2.asp?PatrolID=&UnitID=&MeritBadgeID=' + $('#meritBadgeID option:selected').val() + '&MeritBadgeVersionID=' + $(this).val(), {
                transition: 'fade'
            });
        });


        $('#buttonSubmit', '#PageX').click(function() {
            $('#quickForm', '#PageX').submit();
            return false;
        });

        $('#quickForm', '#PageX').submit(function() {
            //check for at least one scout and on mb req checked
            var errmsg = '';
            if ($('input:checkbox[name=ScoutUserID]:checked').length == 0) {
                errmsg = "Please check at least one Scout";
            }
            if ($('input:checkbox[name=MeritBadgeRequirementID]:checked').length == 0) {
                if (errmsg != '') {
                    errmsg += ' AND ';
                }
                errmsg += "Please check at least one Merit Badge Requirement";
            }
            if ($('input[name=DateCompleted]').val() == '') {
                if (errmsg != '') {
                    errmsg += ' AND ';
                }
                errmsg += "Please enter Completion Date";
            }
            if (errmsg != '') {
                showErrorPopup(errmsg);
                return false;
            }


            formPost = $('#quickForm', '#PageX').serialize();

            // disable all inputs
            $('#buttonSubmit', '#PageX #quickForm').addClass('ui-disabled');


            // disable all inputs
            $(':input', '#PageX #quickForm').attr('disabled', true);



            $.mobile.loading('show', {
                theme: 'a',
                text: 'saving...this may take several minutes depending on the number of Scouts and requirements selected',
                textonly: false
            });
            setTimeout(function() {
                submitQuickForm();
            }, 2000);
            return false;
        });

        $('#notesHelp', '#PageX').click(function() {
            $('#notesPopup', '#PageX').popup({
                tolerance: '10,30',
                transition: 'pop',
                positionTo: 'origin',
                history: false
            }).popup('open');
            return false;
        });

    }

    function submitQuickForm() {

        var evObj = {
            scoutname: '',
            scoutid: '',
            mbid: '',
            mbverid: '',
            mbreq: [],
            notes: '',
            unitid: ''
        };
        //build list of checked scouts and mbids that can be decremented
        evObj.mbid = $('#meritBadgeID option:selected').val();
        evObj.mbverid = $('input[name=MeritBadgeVersionID]').val();
        counselorApprvReqLst.length = 0;
        $('input:checkbox[name=ScoutUserID]:checked').each(function() {


            var scid = $(this).attr('id');
            evObj.scoutname = $('label[for="' + scid + '"]').text().trim();
            evObj.scoutid = $(this).val();
            evObj.notes = $('textarea[name="Comments"]').val(); // 2/1/2018
            evObj.mbreq.length = 0;
            evObj.unitid = $(this).attr('data-unitid');
            $('input:checkbox[name=MeritBadgeRequirementID]:checked').each(function() {
                evObj.mbreq.push($(this).val());
            });
            counselorApprvReqLst.push(JSON.parse(JSON.stringify(evObj)));
        });

        //ugh.  For each Scout/MB  for each mbreq
        setTimeout(function() {
            postMBCmbReq();
        }, 100);
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

function getMBClist(mbcpages, curpage, unitid) {
    mbcpages = parseInt(mbcpages);
    curpage = parseInt(curpage);
    var evObj = {
        name: '',
        id: '',
        addr: '',
        email: '',
        council: '',
        unit: '',
        ypt: '',
        img: ''
    };
    var maxpage = 1;
    var thispage = 1;

    //console.log('enter getMBClist '+ mbcpages+' current page='+curpage +'  for MBID='+addMBID[addMBIDindex].mbid);

    if (myPositions.length == 0) {
        alert('Error in Position List');
        changepageurl('/mobile/dashboard/');
        return;
    }

    //Name  Unit   City  
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/counselorresults.asp?UnitID=' + unitid + '&MeritBadgeID=' + addMBID[addMBIDindex].mbid + '&zip=' + myPositions[0].myZip + '&Proximity=100&Availability=Available';


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, mbcApprMbError, ['getMBClist status=' + this.status], getMBClist, [mbcpages, curpage, unitid]);
        }
        if (this.readyState == 4 && this.status == 200) {

            resetLogoutTimer(geturl);
            servErrCnt = 0;

            if (mbclist.length == 0) {
                //1st time thru, 
                $('a[href*="counselorresults.asp"]', this.response).each(function() {
                    if ($(this).attr('href').match(/Page=(\d+)/) != null) {
                        thispage = parseInt($(this).attr('href').match(/Page=(\d+)/)[1]);
                        if (thispage > maxpage) {
                            maxpage = thispage;
                        }
                    }
                });
                mbcpages = maxpage;
                //console.log(mbcpages +' detected to read');
            }


            $('li[data-theme="d"] [style="margin-left: 65px; "]', this.response).each(function() {


                var res = this.textContent.trim().split('\n');
                evObj.name = res[0];
                evObj.addr = res[3].trim().replace('Home', ' Home').replace('Mobile', ' Mobile');

                evObj.email = res[4].trim();
                evObj.council = res[8].trim();
                var mbcp = $(this).parent();

                evObj.img = $('img[data-userid]', mbcp).attr('src');
                evObj.id = $('img[data-userid]', mbcp).attr('data-userid');
                evObj.unit = $('.unitNumbersDIV', mbcp).attr('title');
                evObj.ypt = $('.yptDate', mbcp).text().trim();
                mbclist.push(JSON.parse(JSON.stringify(evObj)));
            });

            if (curpage >= mbcpages) {
                // show mbc list
                //console.log('show the list');
                pickMBCFlag = true;
                pickMBCFlagUnit = unitid;
                changepageurl('/mobile/dashboard/');
                return; //done
            }
            curpage += 1;
            //console.log('call getMBClist for next page ' +curpage);
            setTimeout(function() {
                getMBClist(mbcpages, curpage, unitid);
            }, 100);
        }
    };
    //console.log('getting ' +curpage);
    var geturl = url + '&Page=' + curpage;
    xhttp.open("GET", geturl, true);
    xhttp.responseType = "document";
    xhttp.send();

    xhttp.onerror = function() {
        errStatusHandle(500, mbcApprMbError, ['getMBCList terminal'], getMBClist, [mbcpages, curpage, unitid]);
    };


}
//mbc	
function checkScoutConnection(counselorID, msg, unitid) {
    //console.log('checkScoutConnection '+counselorID );
    var userid;
    var mbids = [];
    var mbapprov = '';
    var xhttp = new XMLHttpRequest();
    var brk = false;
    var ret = false;
    var mbconly = false;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, mbcApprMbError, ['checkScoutConnection status=' + this.status], checkScoutConnection, [counselorID, msg, unitid]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            //looking for match to counselor.  If match, update the connection.  If not, send invite
            var unitid = ''
            var patrolid = '';
            if ($('a[id="goToDenPatrol"]', this.response).attr('href') != undefined) {
                if ($('a[id="goToDenPatrol"]', this.response).attr('href').match(/PatrolID=(\d+)/) != null) {
                    patrolid = $('a[id="goToDenPatrol"]', this.response).attr('href').match(/PatrolID=(\d+)/)[1];
                }
                //var patrolid=$('a[id="goToDenPatrol"]',this.response).attr('href').match(/PatrolID=(\d+)/)[1];
                if ($('a[id="goToDenPatrol"]', this.response).attr('href').match(/UnitID=(\d+)/) != null) {
                    unitid = $('a[id="goToDenPatrol"]', this.response).attr('href').match(/UnitID=(\d+)/)[1];
                }
            }
            //console.log('checkScoutConnection got a response, should see connections..');

            $('li  a[href*="connection.asp"]', this.response).each(function() {
                if (brk == false) {
                    userid = $('img.profilePopup', this).attr('data-userid');
                    //console.log('checkScoutConnection connected adult id ' + userid + ' =? ' +counselorID );

                    //if requested counselor is already a connected adult


                    if (userid == counselorID) {
                        //console.log('matched');
                        var connid = '';
                        if ($(this).attr('href').match(/ConnectionID=(\d+)/) != null) {
                            var connid = $(this).attr('href').match(/ConnectionID=(\d+)/)[1];
                        }
                        brk = false;
                        mbids.length = 0;
                        $('.mb.permission', this).each(function() {
                            if (brk == false) {
                                var cmbid = $(this).attr('data-meritbadgeid');
                                //console.log('checkScoutConnection -USERID = COUNSELORID is this badge already in connections? :' + addMBID[addMBIDindex].mbid + ': Connections have :'+cmbid +':');
                                if (parseInt(cmbid) == parseInt(addMBID[addMBIDindex].mbid)) {
                                    //already connected as MBC for this MB, exit anf get next scout, if any left, otherwise get next mb
                                    //alert('Already connected get next scout');
                                    //console.log('Already connected get next scout');
                                    // next scout for this mb/mbc
                                    setTimeout(function() {
                                        connectNextMBC(counselorID, unitid, msg);
                                    }, 100);
                                    brk = true;
                                    //return false;		
                                } else {
                                    mbids.push(cmbid);
                                    mbapprov += '&PermissionApproveMBID=' + cmbid;
                                }
                            }
                        });
                        //if(brk==true) { return false;}


                        if (brk == false) {
                            permTxt = $(this).text();
                            var formPost = 'Action=Submit';
                            //ConnectionRelationship=
                            if (permTxt.match('Parent/Guardian') != null) {
                                formPost += '&ConnectionRelationship=Parent%2FGuardian';
                            }
                            if (permTxt.match('Other Family Member') != null) {
                                formPost += '&ConnectionRelationship=Family+Member';
                            }
                            if (permTxt.match('Adult Leader') != null) {
                                formPost += '&ConnectionRelationship=Adult+Leader';
                            }

                            //Adult leader may not print.  By omission, assume
                            //If setting a MBC and permissions were full, add all

                            if (formPost.match(/&ConnectionRelationship/) == null && permTxt.match('Merit Badge Counselor') != null) {
                                // MBC Only
                                mbconly = true;
                            }
                            if (formPost.match(/&ConnectionRelationship/) == null && permTxt.match('Merit Badge Counselor') == null) {
                                //No connection types were listed, which I think is a bug
                                formPost += '&ConnectionRelationship=Adult+Leader';
                            }

                            //if the ONLY conn type is MBC, we have different rules.

                            mbapprov += '&PermissionApproveMBID=' + addMBID[addMBIDindex].mbid;
                            formPost += '&ConnectionRelationship=Merit+Badge+Counselor'; //always add

                            if (mbconly == true) {
                                if (permTxt.match('View Advancement') != null) {
                                    formPost += '&PermissionViewAdvancement=on';
                                } else {
                                    formPost += '&PermissionViewAdvancement=off';
                                }
                            } else {
                                if (permTxt.match('Full Control') != null) {
                                    formPost += '&PermissionFullControl=on&PermissionEditAdvancement=on&PermissionViewAdvancement=on&PermissionEditProfile=on';
                                } else {
                                    if (permTxt.match('Edit Advancement') != null) {
                                        formPost += '&PermissionFullControl=off&PermissionEditAdvancement=on';
                                    } else if (permTxt.match('View Advancement') != null) {
                                        formPost += '&PermissionFullControl=off&PermissionEditAdvancement=off&PermissionViewAdvancement=on';
                                    }

                                    if (permTxt.match('Edit Profile') != null) {
                                        formPost += '&PermissionEditProfile=on';
                                    } else {
                                        formPost += '&PermissionEditProfile=off';
                                    }
                                    //if(permTxt.match('View Profile') != null) { formPost += '&PermissionViewProfile=on';}
                                }
                            }

                            formPost += mbapprov;
                            //console.log('cqll unUnitAddConnect to set up internal connection for ' + userid + ' to ' +counselorID + ' sUIindex='+sUIindex);
                            //alert('set up internal connection for ' + userid);
                            inUnitAddConnect(counselorID, formPost, connid, unitid, patrolid, msg);
                            brk = true;
                            ret = true;
                            //return false;
                        }
                    }
                }
            });
            if (ret == true) {
                return false;
            }
            if (brk == true) {
                connectNextMBC(counselorID, unitid, msg);
                return false;
            }
            //requested counselor is no currently in the connection	list		


            // now see if there are any counselors already connected

            $('li  a[href*="connection.asp"]', this.response).each(function() {

                userid = $('img.profilePopup', this).attr('data-userid');
                //console.log('pass 2checkScoutConnection connected adult id ' + userid + ' =? ' +counselorID );			
                brk = false;
                $('.mb.permission', this).each(function() {
                    if (brk == false) {
                        var cmbid = $(this).attr('data-meritbadgeid');
                        //console.log('checkScoutConnection -'+userid+' is this badge already in connections? ' + addMBID[addMBIDindex].mbid + ' Connections have '+cmbid);

                        if (cmbid == addMBID[addMBIDindex].mbid) {
                            //someone else already connected as MBC for this MB, exit anf get next scout, if any left, otherwise get next mb
                            //console.log('2 Already connected get next scout');
                            //alert('Already in connections');

                            // next mbid for 2 this mb/mbc
                            //sUIindex-=1;


                            setTimeout(function() {
                                connectNextMBC(counselorID, unitid, msg);
                            }, 100);
                            //console.log('stop here, already have a counselor');	
                            brk = true;
                            //return false;		
                        }
                    }

                });
                //if(brk==true) { return false;}				
            });

            if (brk == true) {
                connectNextMBC(counselorID, unitid, msg);
                return false;
            }
            // counselor is not yet connected.  Send an invite.
            sendMBCinvite(counselorID, unitid, msg);
            return;

            //Action=Submit&ConnectionRelationship=Parent%2FGuardian&ConnectionRelationship=Family+Member&ConnectionRelationship=Merit+Badge+Counselor&ConnectionRelationship=Adult+Leader
            //&PermissionFullControl=off&PermissionEditAdvancement=off&PermissionViewAdvancement=on&PermissionEditProfile=off&PermissionApproveMBID=3&PermissionApproveMBID=4&PermissionApproveMBID=5			
        }
    };
    //console.log('getting connections for scout '+ scoutUserIDMBmbc[sUIindex] + ' sUIindex=' +sUIindex);
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connections.asp?ScoutUserID=' + scoutUserIDMBmbc[sUIindex] + '&UnitID=' + unitid;
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();

    xhttp.onerror = function() {
        errStatusHandle(500, mbcApprMbError, ['checkScoutConnection terminal'], checkScoutConnection, [counselorID, msg, unitid]);
    };
}
//mbc	
function addMBCdone(unitID) {
    //alert('done');
    //console.log('addMBCdone');
    changepageurl('/mobile/dashboard/admin/unit.asp?UnitID=' + unitID);

}
//Send Invite

//mbc	
function sendMBCinvite(counselorID, unitid, msg) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, '', [], sendMBCinvite, [counselorID, unitid, msg]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            if ($('title', this.response).text() == "My Subscriptions") {
                alert('A Scout is not Approved, so a Merit Badge Counselor cannot be connected');
                connectNextMBC(counselorID, unitid, msg);
                return;
            }
            var CSRF = $('input[name="CSRF"]', this.response).val();
            sendMBCinvite2(counselorID, unitid, msg, CSRF)

        }
    };
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connectioninvite.asp?ScoutUserID=' + scoutUserIDMBmbc[sUIindex] + '&UnitID=' + unitid + '&DenID=&PatrolID=';
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();

    xhttp.onerror = function() {
        errStatusHandle(500, '', [], sendMBCinvite, [counselorID, unitid, msg]);
    };
}

function sendMBCinvite2(counselorID, unitid, msg, CSRF) {
    //console.log('sendMBCinvite id='+counselorID+' scout='+scoutUserIDMBmbc[sUIindex]);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, mbcApprMbError, ['sendMBCinvite2 status=' + this.status], sendMBCinvite2, [counselorID, unitid, msg]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            connectNextMBC(counselorID, unitid, msg);
        }
    };

    //var msg='batch invite test';	
    msg = encodeURIComponent(msg).replace(/%20/g, '+');
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connectioninvite.asp?ScoutUserID=' + scoutUserIDMBmbc[sUIindex];
    var formPost = 'Action=Submit&AdultUserID=' + counselorID + '&ConnectionFirstName=&ConnectionLastName=&ConnectionEmail=&ConnectionEmail2=&ConnectionRelationship=Merit+Badge+Counselor&PermissionFullControl=off&PermissionEditAdvancement=off&PermissionViewAdvancement=off&PermissionEditProfile=off&PermissionApproveMBID=' + addMBID[addMBIDindex].mbid + '&PersonalMessage=' + msg;
    formPost += '&CSRF=' + CSRF;
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(formPost);

    xhttp.onerror = function() {
        errStatusHandle(500, mbcApprMbError, ['sendMBCinvite2 terminal'], sendMBCinvite2, [counselorID, unitid, msg]);
    };
}


function connectNextMBC(counselorID, unitid, msg) {
    //console.log('enter connectNextMBC sUIindex='+sUIindex);
    sUIindex -= 1;
    if (sUIindex < 0) {
        // no more scouts for this mb/mbc
        //console.log('no scouts left for this counselor, check for next badge scoutindex='+sUIindex);
        addMBIDindex -= 1;
        //console.log('addMBIDindex='+addMBIDindex);
        if (addMBIDindex < 0) {
            // no more MBs either
            inviteMBCperm = false;
            //console.log('connectNextMBC done');
            changepageurl('/mobile/dashboard/admin/unit.asp?UnitID=' + unitid);
            //addMBCdone(unitid);
            return;
        } else {
            //console.log('call getMBClist for new badge index='+addMBIDindex);
            mbclist.length = 0;

            setTimeout(function() {
                getMBClist(0, 1, unitid);
            }, 100);
            return;
        }

    } else {
        // next scout for this mb/mbc
        //console.log('call checkScoutConnection for next scout');
        setTimeout(function() {
            checkScoutConnection(counselorID, msg, unitid);
        }, 100);
    }
}

//mbc
function inUnitAddConnect(counselorID, formPost, connid, unitid, patrolid, msg) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, mbcApprMbError, ['inUnitAddConnect status=' + this.status], inUnitAddConnect, [counselorID, formPost, connid, unitid, patrolid, msg]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            //console.log('inUnitAddConnect response rcvd - added '+counselorID + ' calling connectNextMBC');
            // get next scout (if any left) if not, get next mbid
            //alert('response received');
            connectNextMBC(counselorID, unitid, msg);
        }
    };

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connection.asp?ScoutUserID=' + scoutUserIDMBmbc[sUIindex] + '&ConnectionID=' + connid + '&UnitID=' + unitid + '&DenID=&PatrolID=' + patrolid;
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(formPost);

    xhttp.onerror = function() {
        errStatusHandle(500, mbcApprMbError, ['inUnitAddConnect terminal'], inUnitAddConnect, [counselorID, formPost, connid, unitid, patrolid, msg]);
    };
}

//mbc         
function mbcqeapp() {
    $('#goBackDash', '#PageX').click(function() {
        $.mobile.changePage(

            '/mobile/dashboard/',

            {
                allowSamePageTransition: true,
                transition: 'none',
                showLoadMsg: true,
                reloadPage: true
            }
        );
    });

    $('#myDashboard', '#PageX').click(function() {
        $.mobile.changePage(

            '/mobile/dashboard/',

            {
                allowSamePageTransition: true,
                transition: 'none',
                showLoadMsg: true,
                reloadPage: true
            }
        );
    });
}

//mbc
function buildMBCQEmeritbadgePage(data, pageid) {

    // replace title
    //<title> <title>
    data = data.replace(/<title>[^<]+/, '<title>MBC Merit Badge Quick Entry');



    var startfunc = data.indexOf("$('#buttonRefresh");
    var myfunc = '' + mbcqeapp;
    myfunc = myfunc.slice(21).slice(0, -1).replace(/\#PageX/g, '#Page' + escapeHTML(pageid));


    var newdata = data.slice(0, startfunc) + myfunc + '\n' + data.slice(startfunc);
    data = newdata;

    data = data.replace('<a href="#" id="buttonRefresh"><img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/refresh100bsa.png" style="width: 23px;" title="Refresh" /></a>', '');


    var startfunc = data.indexOf('<h1>');
    var endfunct = data.indexOf('</h1>');
    var newdata = data.slice(0, startfunc);

    newdata += '<h1>';

    newdata += '<span style="display: inline-block; width: 20px; height: 20px; margin-right: 22px; position: relative; ">';
    newdata += '		<a id="quickNav" href="#quickNavPopup" data-rel="popup" data-transition="slidedown"><img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/menu100bsa.png" style="width: 20px; position: absolute; top: -4px; left: 0; width: 20px; height: 20px; padding: 8px;" title="Quick Navigation" /></a>';
    newdata += '	</span>';

    newdata += '<span style="display: inline-block; width: 20px; height: 20px; margin-right: 22px; position: relative; ">';
    newdata += '	<a id="goBackDash" href="#" data-rel="back" data-direction="reverse"><img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/back100bsa.png" style="position: absolute; top: -4px; left: 0px; width: 20px; padding: 8px; " title="Go Back" /></a>';
    newdata += '</span>';

    newdata += '	<span style="display: inline-block; width: 20px; height: 20px; margin-right: 24px; position: relative; ">';
    newdata += '		<a id="goHome" href="/mobile/" data-transition="slide" data-direction="reverse"><img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/home100bsa.png" style="position: absolute; top: -4px; left: 0px; height: 20px; padding: 7px; " title="Go Home" /></a>';
    newdata += '	</span>	';

    newdata += '	<span style="display: inline-block; width: 20px; height: 20px; margin-right: 22px; position: relative; ">';
    newdata += '		<a id="myDashboard" href="#" data-transition="slide" data-direction="reverse"><img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/dashboardbsa100.png" style="position: absolute; top: -4px; left: 0px; height: 20px; padding: 7px; " title="My Dashboard" /></a>';
    newdata += '	</span>	';

    newdata += '<span style="margin-left: 5px; ">';
    newdata += '	MBC Merit Badge Quick Entry';
    newdata += '</span>';
    //newdata +='</h1>';

    newdata += data.slice(endfunct);

    data = newdata;





    //start at <div data-role="content">
    var startfunc = data.indexOf('<div data-role="content">');
    var endfunct = data.indexOf('</div><!-- /content -->');
    var newdata = data.slice(0, startfunc);
    newdata += setMBCmeritbadgeContent(pageid);
    newdata += data.slice(endfunct);
    data = newdata;


    // replace style
    var startfunc = data.indexOf('<style type="text/css">');
    var endfunct = data.indexOf('</style>');
    var newdata = data.slice(0, startfunc);
    newdata += '	<style type="text/css">\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' h3				{ margin: 0; font-size: 18px; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' .smallText		{ color: gray; margin-top: 15px; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' img.imageSmall	{ position: absolute; width: 30px; height: 30px; top: -5px; border: 1px solid gray; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' img.questionIcon	{ vertical-align: -6px; }\n';

    newdata += '@media (min-width: 40em) {\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' .twoCol .ui-block-a	{ padding-right: 8px; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' .twoCol .ui-block-b	{ padding-left: 8px; }\n';
    newdata += '}\n';
    newdata += '@media all and (max-width: 40em) {\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' .twoCol .ui-block-a, \n';
    newdata += '		#Page' + escapeHTML(pageid) + ' .twoCol .ui-block-b { \n';
    newdata += 'width: 100%; \n';
    newdata += 'float:none; \n';
    newdata += '}\n';
    newdata += '}\n';
    newdata += '</style>\n';
    newdata += data.slice(endfunct);
    data = newdata;


    // replace script.  Starts after <script tag
    var startfunc = data.indexOf('		function pageInit() {');
    var endfunct = data.indexOf('</script>', startfunc);
    var myfunc = '' + mbcqescr;
    myfunc = myfunc.slice(21).slice(0, -1).replace(/\#PageX/g, '#Page' + escapeHTML(pageid));
    var newdata = data.slice(0, startfunc) + myfunc + '\n' + data.slice(endfunct);
    data = newdata;
    return data;

}

function buildMBCReportStartPage(data, pageid) {

    // replace title
    //<title> <title>
    data = data.replace(/<title>[^<]+/, '<title>MBC Merit Badge Report Builder');



    var startfunc = data.indexOf("$('#buttonRefresh");
    var myfunc = '' + mbcqeapp;
    myfunc = myfunc.slice(21).slice(0, -1).replace(/\#PageX/g, '#Page' + escapeHTML(pageid));


    var newdata = data.slice(0, startfunc) + myfunc + '\n' + data.slice(startfunc);
    data = newdata;

    data = data.replace('<a href="#" id="buttonRefresh"><img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/refresh100bsa.png" style="width: 23px;" title="Refresh" /></a>', '');


    var startfunc = data.indexOf('<h1>');
    var endfunct = data.indexOf('</h1>');
    var newdata = data.slice(0, startfunc);

    newdata += '<h1>';

    newdata += '<span style="display: inline-block; width: 20px; height: 20px; margin-right: 22px; position: relative; ">';
    newdata += '		<a id="quickNav" href="#quickNavPopup" data-rel="popup" data-transition="slidedown"><img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/menu100bsa.png" style="width: 20px; position: absolute; top: -4px; left: 0; width: 20px; height: 20px; padding: 8px;" title="Quick Navigation" /></a>';
    newdata += '	</span>';

    newdata += '<span style="display: inline-block; width: 20px; height: 20px; margin-right: 22px; position: relative; ">';
    newdata += '	<a id="goBackDash" href="#" data-rel="back" data-direction="reverse"><img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/back100bsa.png" style="position: absolute; top: -4px; left: 0px; width: 20px; padding: 8px; " title="Go Back" /></a>';
    newdata += '</span>';

    newdata += '	<span style="display: inline-block; width: 20px; height: 20px; margin-right: 24px; position: relative; ">';
    newdata += '		<a id="goHome" href="/mobile/" data-transition="slide" data-direction="reverse"><img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/home100bsa.png" style="position: absolute; top: -4px; left: 0px; height: 20px; padding: 7px; " title="Go Home" /></a>';
    newdata += '	</span>	';

    newdata += '	<span style="display: inline-block; width: 20px; height: 20px; margin-right: 22px; position: relative; ">';
    newdata += '		<a id="myDashboard" href="#" data-transition="slide" data-direction="reverse"><img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/dashboardbsa100.png" style="position: absolute; top: -4px; left: 0px; height: 20px; padding: 7px; " title="My Dashboard" /></a>';
    newdata += '	</span>	';

    newdata += '<span style="margin-left: 5px; ">';
    newdata += '	MBC Merit Badge Report';
    newdata += '</span>';

    newdata += data.slice(endfunct);

    data = newdata;





    //start at <div data-role="content">
    var startfunc = data.indexOf('<div data-role="content">');
    var endfunct = data.indexOf('</div><!-- /content -->');
    var newdata = data.slice(0, startfunc);
    newdata += setMBCmeritbadgeReportContent(pageid);
    newdata += data.slice(endfunct);
    data = newdata;


    // replace style
    var startfunc = data.indexOf('<style type="text/css">');
    var endfunct = data.indexOf('</style>');
    var newdata = data.slice(0, startfunc);
    newdata += '	<style type="text/css">\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' h3				{ margin: 0; font-size: 18px; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' .smallText		{ color: gray; margin-top: 15px; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' img.imageSmall	{ position: absolute; width: 30px; height: 30px; top: -5px; border: 1px solid gray; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' img.questionIcon	{ vertical-align: -6px; }\n';

    newdata += '@media (min-width: 40em) {\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' .twoCol .ui-block-a	{ padding-right: 8px; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' .twoCol .ui-block-b	{ padding-left: 8px; }\n';
    newdata += '}\n';
    newdata += '@media all and (max-width: 40em) {\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' .twoCol .ui-block-a, \n';
    newdata += '		#Page' + escapeHTML(pageid) + ' .twoCol .ui-block-b { \n';
    newdata += 'width: 100%; \n';
    newdata += 'float:none; \n';
    newdata += '}\n';
    newdata += '}\n';
    newdata += '</style>\n';
    newdata += data.slice(endfunct);
    data = newdata;


    // replace script.  Starts after <script tag
    var startfunc = data.indexOf('		function pageInit() {');
    var endfunct = data.indexOf('</script>', startfunc);
    var myfunc = '' + mbcrpscr;
    myfunc = myfunc.slice(21).slice(0, -1).replace(/\#PageX/g, '#Page' + escapeHTML(pageid));
    var newdata = data.slice(0, startfunc) + myfunc + '\n' + data.slice(endfunct);
    data = newdata;
    return data;

}

function buildMBCEditStartPage(data, pageid) {

    // replace title
    //<title> <title>
    data = data.replace(/<title>[^<]+/, '<title>MBC Merit Badge Edit Quick Finder');



    var startfunc = data.indexOf("$('#buttonRefresh");
    var myfunc = '' + mbcqeapp;
    myfunc = myfunc.slice(21).slice(0, -1).replace(/\#PageX/g, '#Page' + escapeHTML(pageid));


    var newdata = data.slice(0, startfunc) + myfunc + '\n' + data.slice(startfunc);
    data = newdata;

    data = data.replace('<a href="#" id="buttonRefresh"><img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/refresh100bsa.png" style="width: 23px;" title="Refresh" /></a>', '');


    var startfunc = data.indexOf('<h1>');
    var endfunct = data.indexOf('</h1>');
    var newdata = data.slice(0, startfunc);

    newdata += '<h1>';

    newdata += '<span style="display: inline-block; width: 20px; height: 20px; margin-right: 22px; position: relative; ">';
    newdata += '		<a id="quickNav" href="#quickNavPopup" data-rel="popup" data-transition="slidedown"><img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/menu100bsa.png" style="width: 20px; position: absolute; top: -4px; left: 0; width: 20px; height: 20px; padding: 8px;" title="Quick Navigation" /></a>';
    newdata += '	</span>';

    newdata += '<span style="display: inline-block; width: 20px; height: 20px; margin-right: 22px; position: relative; ">';
    newdata += '	<a id="goBackDash" href="#" data-rel="back" data-direction="reverse"><img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/back100bsa.png" style="position: absolute; top: -4px; left: 0px; width: 20px; padding: 8px; " title="Go Back" /></a>';
    newdata += '</span>';

    newdata += '	<span style="display: inline-block; width: 20px; height: 20px; margin-right: 24px; position: relative; ">';
    newdata += '		<a id="goHome" href="/mobile/" data-transition="slide" data-direction="reverse"><img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/home100bsa.png" style="position: absolute; top: -4px; left: 0px; height: 20px; padding: 7px; " title="Go Home" /></a>';
    newdata += '	</span>	';

    newdata += '	<span style="display: inline-block; width: 20px; height: 20px; margin-right: 22px; position: relative; ">';
    newdata += '		<a id="myDashboard" href="#" data-transition="slide" data-direction="reverse"><img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/dashboardbsa100.png" style="position: absolute; top: -4px; left: 0px; height: 20px; padding: 7px; " title="My Dashboard" /></a>';
    newdata += '	</span>	';

    newdata += '<span style="margin-left: 5px; ">';
    newdata += '	MBC Merit Badge Edit Quick Finder';
    newdata += '</span>';

    newdata += data.slice(endfunct);

    data = newdata;





    //start at <div data-role="content">
    var startfunc = data.indexOf('<div data-role="content">');
    var endfunct = data.indexOf('</div><!-- /content -->');
    var newdata = data.slice(0, startfunc);
    newdata += setMBCmeritbadgeEditContent(pageid);
    newdata += data.slice(endfunct);
    data = newdata;


    // replace style
    var startfunc = data.indexOf('<style type="text/css">');
    var endfunct = data.indexOf('</style>');
    var newdata = data.slice(0, startfunc);
    newdata += '	<style type="text/css">\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' h3				{ margin: 0; font-size: 18px; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' .smallText		{ color: gray; margin-top: 15px; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' img.imageSmall	{ position: absolute; width: 30px; height: 30px; top: 0px; border: 1px solid gray; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' img.questionIcon	{ vertical-align: -6px; }\n';

    newdata += '		#Page' + escapeHTML(pageid) + ' .disabled { pointer-events:none; opacity:0.6; }\n';






    newdata += '@media (min-width: 40em) {\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' .twoCol .ui-block-a	{ padding-right: 8px; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' .twoCol .ui-block-b	{ padding-left: 8px; }\n';
    newdata += '}\n';
    newdata += '@media all and (max-width: 40em) {\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' .twoCol .ui-block-a, \n';
    newdata += '		#Page' + escapeHTML(pageid) + ' .twoCol .ui-block-b { \n';
    newdata += 'width: 100%; \n';
    newdata += 'float:none; \n';
    newdata += '}\n';
    newdata += '}\n';
    newdata += '</style>\n';
    newdata += data.slice(endfunct);
    data = newdata;


    // replace script.  Starts after <script tag
    var startfunc = data.indexOf('		function pageInit() {');
    var endfunct = data.indexOf('</script>', startfunc);
    var myfunc = '' + mbcedscr;
    myfunc = myfunc.slice(21).slice(0, -1).replace(/\#PageX/g, '#Page' + escapeHTML(pageid));
    var newdata = data.slice(0, startfunc) + myfunc + '\n' + data.slice(endfunct);
    data = newdata;
    return data;

}

//mbc
function buildPickMBCPage(data, pageid, unitid) {
    data = data.replace(/<title>[^<]+/, '<title>Merit Badge Counselor Quick Invite Entry');

    var startfunc = data.indexOf('<div data-role="content">');
    var endfunct = data.indexOf('</div><!-- /content -->');
    var newdata = data.slice(0, startfunc) + '<div data-role="content">\n';
    newdata += buildPickMBCPageContent(data, pageid, unitid);
    newdata += data.slice(endfunct);
    data = newdata;

    //change the scripts

    // replace script.  Starts after <script tag
    var startfunc = data.indexOf('		function pageInit() {');
    var endfunct = data.indexOf('</script>', startfunc);
    var myfunc = '' + mbcqeinv;
    myfunc = myfunc.slice(21).slice(0, -1).replace(/\#PageX/g, '#Page' + escapeHTML(pageid)).replace(/UnitID=X/g, 'UnitID=' + escapeHTML(unitid));
    var newdata = data.slice(0, startfunc) + myfunc + '\n' + data.slice(endfunct);
    data = newdata;

    return data;


}


//mbc
function buildPickMBCPageContent(data, pageid, unitid) {
    var newdata = '';
    newdata += '<form id="quickForm">';
    newdata += '<input type="hidden" name="Action" value="Submit" />';


    newdata += '					<p class="normalText">Select a Counselor from the list.</p>';

    newdata += '						<fieldset data-role="controlgroup" style="margin-top: 1em; ">';
    newdata += '							<legend class="text-orange">';
    newdata += '								<strong>Choose ' + escapeHTML(addMBID[addMBIDindex].name) + ' Counselor:</strong>';
    newdata += '							</legend>	';

    //var evObj={name: '', id: '', addr: '', email: '', council: '',unit: '',ypt: '',img: ''};

    newdata += '								<input type="radio"  name="ScoutUserID" id="scoutUserIDnone" data-theme="d" value="none"  />';
    newdata += '								<label for="scoutUserIDnone">';
    newdata += '									Do not invite a Counselor for this Merit Badge';
    newdata += '									</label>';

    //console.log('buildPickMBCPageContent for '+mbclist.length+ ' counselor selections');
    for (var i = 0; i < mbclist.length; i++) {
        newdata += '								<input type="radio"  name="ScoutUserID" id="scoutUserID' + escapeHTML(mbclist[i].id) + '" data-theme="d" value="' + escapeHTML(mbclist[i].id) + '"  />';
        newdata += '								<label for="scoutUserID' + escapeHTML(mbclist[i].id) + '">';
        newdata += '									<div style="display: inline-block; width: 30px; margin-right: 5px; ">';
        newdata += '										<img src="' + escapeHTML(mbclist[i].img) + '" class="imageSmall" style="top: -5px; "/>';
        newdata += '									</div>';
        newdata += '									<div class="normalText" style="display: inline-block; padding-right: 20px; ">';
        newdata += escapeHTML(mbclist[i].name);
        newdata += '									</div>';

        newdata += '									<div class="normalText" style="display: inline-block;  padding-right: 20px; ">';
        newdata += escapeHTML(mbclist[i].unit);
        newdata += '									</div>';

        newdata += '									<div class="normalText" style="display: inline-block;  padding-right: 20px; ">';
        newdata += escapeHTML(mbclist[i].council);
        newdata += '									</div>';

        newdata += '									<div class="normalText" style="display: inline-block;  padding-right: 20px; ">';
        newdata += '  									  YPT=' + escapeHTML(mbclist[i].ypt);
        newdata += '									</div>';

        newdata += '									<div class="normalText" style="display: inline-block;  padding-right: 20px; ">';
        newdata += escapeHTML(mbclist[i].addr);
        newdata += '									</div>';

        newdata += '									<div class="normalText" style="display: inline-block; ">';
        newdata += escapeHTML(mbclist[i].email);
        newdata += '									</div>';

        newdata += '									</label>';


    }

    newdata += '						</fieldset>';

    newdata += '			<label class="text-orange" >';
    newdata += '				<strong>Personal Message (optional)</strong>';
    newdata += '			</label>';

    //newdata += '	        <label for="personalMessage">Personal Message:<img src="https://d1kn0x9vzr5n76.cloudfront.net/mobile/images/icons/help48.png"  /></label>';
    newdata += '	        	<textarea name="PersonalMessage" id="personalMessage" rows="5"></textarea>';
    //newdata += '			</label>';



    newdata += '					<a href="#" data-role="button" data-theme="g" style="margin-top: 1em; " id="buttonSubmit">Invite</a>';

    newdata += '					<p class="normalText">';
    newdata += '						<strong>NOTE:</strong> This action cannot be undone.  If you make a mistake you must go into each Scouts connections and make any corrections manually.';
    newdata += '					</p>';

    newdata += '</form>';

    newdata += '<div id="footer" align="center">';

    newdata += logoutWarningPageContent('Page' + escapeHTML(pageid));

    newdata += '<div style="margin-top: 6px;">This page was produced by the Feature Assistant Extension/Add-on and is not supported by BSA</div>';
    newdata += '<div style="margin-top: 6px;">&copy; ' + escapeHTML(cyear()) + '- Boy Scouts of America &bull; <a href="/mobile/help/privacy.asp">Privacy</a></div>';
    newdata += '<div><a href="/" data-ajax="false"><img src="https://d1kn0x9vzr5n76.cloudfront.net/mobile/images/scoutbookbsalogo400.png" width="200"></a></div>';

    newdata += '</div>';


    newdata += '<div data-role="popup" id="errorPopup" data-overlay-theme="a" class="ui-content" data-theme="e" data-transition="fade">';
    newdata += '<a href="#" id="closePopupButton" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>';
    newdata += '<div id="errorPopupIcon"></div>';
    newdata += '<div id="errorPopupContent"></div>';
    newdata += '<div class="clearRight"></div>';
    newdata += '</div>';
    return newdata;
}

//mbc
function pickmbccss(pageid) {
    var newdata = '';
    newdata += '#Page' + escapeHTML(pageid) + ' #unitInfo h2				{ margin: 0; font-size: 14px; color: gray; margin-top: 1em; }\n';
    newdata += '#Page' + escapeHTML(pageid) + ' img.imageSmall			{ position: absolute; width: 30px; height: 30px; top: 0; left: -5px; border: 1px solid #CCC; }\n';
    newdata += '#Page' + escapeHTML(pageid) + ' .label					{ font-size: 10px; color: #999; font-family: Arial; font-weight: normal; }\n';
    newdata += '#Page' + escapeHTML(pageid) + ' .label.permissions span	{ white-space: nowrap; }\n';
    newdata += '#Page' + escapeHTML(pageid) + ' .pending					{ position: absolute; top: -1px; right: 5px; width: 70px; background-color: #f8efa4; color: #e25c0e; text-shadow: none; padding: 3px; font-size: 12px; font-weight: bold; text-align: center; border: 1px solid #ebda54; }\n';
    newdata += '#Page' + escapeHTML(pageid) + ' div.full-circle			{ position: absolute; right: 2px; top: 10px; border: 5px solid #f0bd26; background-color: white; height: 30px; width: 30px; -moz-border-radius: 20px; -webkit-border-radius: 20px; border-radius: 20px; text-align: center; font-size: 20px; color: black; line-height: 30px; }\n';
    newdata += '#Page' + escapeHTML(pageid) + ' div.full-circle img		{ position: absolute; width: 35px; left: 4px; bottom: 5px; }\n';
    newdata += '#Page' + escapeHTML(pageid) + ' li.checkable				{ position: relative; cursor: pointer; }\n';
    newdata += '#Page' + escapeHTML(pageid) + ' #bccDIV						{ margin-top: 1em; }\n';

    newdata += '@media (min-width: 50em) {\n';
    newdata += '	.ui-grid-b .ui-block-a	{ padding-right: 10px; }\n';
    newdata += '	.ui-grid-b .ui-block-b	{ padding-left: 10px; padding-right: 10px; }\n';
    newdata += '	.ui-grid-b .ui-block-c	{ padding-left: 10px; }\n';
    newdata += '}\n';

    newdata += '@media (max-width: 50em) {\n';
    newdata += '	.ui-grid-b .ui-block-a,\n';
    newdata += '	.ui-grid-b .ui-block-b,\n';
    newdata += '	.ui-grid-b .ui-block-c {\n';
    newdata += '		width: 100%;\n';
    newdata += '		float: none;\n';
    newdata += '	}\n';
    newdata += '}\n';

    newdata += '#Page' + escapeHTML(pageid) + ' .progressContainer	{ margin: 0; position: initial; }\n';
    newdata += '#Page' + escapeHTML(pageid) + ' .progressCircle		{ position: absolute; right: 4px; top: 8px; }\n';
    newdata += '#Page' + escapeHTML(pageid) + ' div.contactInfo		{ margin-top: 6px; font-size: 12px; font-weight: normal; color: gray; line-height: 1.4em; }\n';

    newdata += '#Page' + escapeHTML(pageid) + ' img.customizeIcon	{ width: 20px; position: absolute; right: -5px; top: -1px; cursor: pointer; }\n';
    newdata += '#Page' + escapeHTML(pageid) + ' .lastVisit			{ position: absolute; right: 0; top: 25px; width: 80px; font-size: 11px; font-weight: normal; color: gray; }\n';
    newdata += '#Page' + escapeHTML(pageid) + ' .parents				{ margin-top: 5px; background-color: #f3f3f3; padding: 8px; }\n';
    newdata += '#Page' + escapeHTML(pageid) + ' .parents img.imageSmall { top: 0; left: 0; }\n';
    newdata += '#Page' + escapeHTML(pageid) + ' .parents div.label:first-child	{ margin-bottom: 3px; }\n';
    newdata += '#Page' + escapeHTML(pageid) + ' .positions			{ font-size: 11px; font-weight: normal; }\n';

    return newdata;
}
//mbc
function setMBCmeritbadgeContent(pageid) {
    var newdata = '<div data-role="content">';

    newdata += '<form id="quickForm">';
    newdata += '<input type="hidden" name="Action" value="Submit" />';
    newdata += '<ul data-role="listview" data-inset="true" data-count-theme="f" data-theme="d" style="margin-top: 0;" class="ui-icon-alt">';
    newdata += '	<li data-role="list-divider" data-theme="a">';
    newdata += '		Quick Entry for Counselors Signing Merit Badges Complete';
    newdata += '	</li>';
    newdata += '	<li data-theme="d">';

    newdata += '		<div class="ui-grid-a twoCol">';
    newdata += '			<div class="ui-block-a">';
    //--
    //##		
    newdata += '					<p class="normalText">Now you can quickly and easily sign merit badges complete for a single Scout or a group of Scouts you Counsel.  Perfect for recording summer camp achievements.</p>';

    newdata += '				<div id="requirements" style="margin-top: 0; ">';
    newdata += '					<label class="text-orange"><strong>Merit Badges Earned:</strong></label>';

    newdata += '					<fieldset data-role="controlgroup">';
    newdata += '						<legend></legend>		';

    uniqlist = [];

    uniquemblist(uniqlist);
    //console.log('uniqlist');
    //console.log(uniqlist);
    // now go through all MBs in MBCdata and build a unique, sorted list

    for (var i = 0; i < uniqlist.length; i++) {
        newdata += '							<input type="checkbox" name="MeritBadgeID" id="meritBadgeID' + escapeHTML(uniqlist[i].mbid) + '" data-theme="d" value="' + escapeHTML(uniqlist[i].mbid) + '">';
        newdata += '							<label for="meritBadgeID' + escapeHTML(uniqlist[i].mbid) + '">' + escapeHTML(uniqlist[i].mbShortName) + '</label>';

        // set positions of mbs in MBCdata
        for (var j = 0; j < MBCdata.length; j++) {
            for (k = 0; k < MBCdata[j].mbLst.length; k++) {
                if (MBCdata[j].mbLst[k].mbid == uniqlist[i].mbid) {
                    MBCdata[j].mbLst[k].pos = i;
                    break;
                }
            }
        }
    }
    maketable();

    newdata += '					</fieldset>';
    newdata += '				</div>';


    newdata += '				<div style="margin-top: 1.5em; ">';


    //uncommented 2/1/18
    newdata += '					<label class="text-orange">';
    newdata += '						Notes/Comments: ';
    newdata += '						<img src="https://d1kn0x9vzr5n76.cloudfront.net/mobile/images/icons/help48.png" class="questionIcon" id="notesHelp" title="Notes Help" />';

    newdata += '					</label>';
    newdata += '					<textarea name="Comments" rows="4" data-theme="d"></textarea>';

    newdata += '					<div style="margin-top: 1.5em; ">';
    newdata += '						<label class="text-orange"><strong>Date Completed:</strong></label>';
    newdata += '						<input type="text" name="DateCompleted" id="dateCompleted" class="calendar" />';
    newdata += '					</div>';

    newdata += '				</div>';
    //##
    //--
    newdata += '			</div>'; // end of a
    newdata += '			<div class="ui-block-b">';

    //--
    //##				
    newdata += '				<div style="margin-bottom: 1.5em; ">';

    newdata += '					<div style="margin-top: 1.5em; ">';

    newdata += '						<fieldset data-role="controlgroup">';
    newdata += '							<legend class="text-orange">';
    newdata += '								<strong>Choose Scout(s):</strong>';
    newdata += '							</legend>	';

    for (var i = 0; i < MBCdata.length; i++) {
        newdata += '								<input type="checkbox" name="ScoutUserID" id="scoutUserID' + escapeHTML(MBCdata[i].id) + '" data-theme="d" value="' + escapeHTML(MBCdata[i].id) + '"  data-canapprove="1" disabled >';
        newdata += '								<label for="scoutUserID' + escapeHTML(MBCdata[i].id) + '">';
        newdata += '									<div style="display: inline-block; width: 30px; margin-right: 5px; ">';
        newdata += '										<img src="' + escapeHTML(MBCdata[i].img) + '" class="imageSmall" />';
        newdata += '									</div>';
        newdata += '									' + escapeHTML(MBCdata[i].name);
        newdata += '								</label>	';

    }



    newdata += '						</fieldset>';
    newdata += '					</div>';


    newdata += '					<a href="#" data-role="button" data-theme="g" style="margin-top: 1em; " id="buttonSubmit">Save</a>';

    newdata += '					<p class="normalText">';
    newdata += '						<strong>NOTE:</strong> This action cannot be undone.  If you make a mistake you must go into each Scout record and make any corrections manually.';
    newdata += '					</p>';
    //newdata += '						<fieldset data-role="controlgroup">';
    //newdata += '							<legend></legend>';
    //newdata += '							<label for="leaderApproved">Counselor Approved</label>';
    //newdata += '							<input type="checkbox" id="leaderApproved" name="LeaderApproved" value="1" data-mini="true" data-theme="d" />';					
    //newdata += '						</fieldset>';

    newdata += '				</div>';
    //##		

    //--
    newdata += '			</div>'; // end of b0

    newdata += '		</div>';
    newdata += '	</li>';


    newdata += '</ul>';
    newdata += '</form>';

    newdata += '<div id="footer" align="center">';

    newdata += logoutWarningPageContent('Page' + escapeHTML(pageid));
    newdata += '<div style="margin-top: 6px;">This page was produced by the Feature Assistant Extension/Add-on and is not supported by BSA</div>';
    newdata += '<div style="margin-top: 6px;">&copy; ' + escapeHTML(cyear()) + '- Boy Scouts of America &bull; <a href="/mobile/help/privacy.asp">Privacy</a></div>';
    newdata += '<div><a href="/" data-ajax="false"><img src="https://d1kn0x9vzr5n76.cloudfront.net/mobile/images/scoutbookbsalogo400.png" width="200"></a></div>';

    newdata += '</div>';


    newdata += '<div data-role="popup" id="errorPopup" data-overlay-theme="a" class="ui-content" data-theme="e" data-transition="fade">';
    newdata += '<a href="#" id="closePopupButton" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>';
    newdata += '<div id="errorPopupIcon"></div>';
    newdata += '<div id="errorPopupContent"></div>';
    newdata += '<div class="clearRight"></div>';
    newdata += '</div>';


    newdata += '<div data-role="popup" id="notesPopup" class="ui-content" data-theme="d" data-transition="fade">';
    newdata += '	<a href="#" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>';
    newdata += '	<p class="normalText text-green" style="font-size: 16px; "><img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/notepad256.png" style="float: right; width: 100px; margin-left: 1em; margin-bottom: 1em;" />';
    newdata += '		<strong>Notes & Comments</strong>';
    newdata += '	</p>';
    newdata += '	<p class="normalText">These notes will appear on the Scout' + "'" + 's <strong>Notepad</strong> on each merit badge that is checked off.</p>';
    newdata += '	<p class="normalText"><strong>Keep a history</strong> and record important details or <strong>highlights</strong>.  The parents, Scouts and others who are connected to the Scout will be able to see these notes.</p>';
    newdata += '</div>';



    return newdata;

}

function setMBCmeritbadgeReportContent(pageid) {
    var newdata = '<div data-role="content">';

    newdata += '<form id="quickForm">';
    newdata += '<input type="hidden" name="Action" value="Submit" />';
    newdata += '<ul data-role="listview" data-inset="true" data-count-theme="f" data-theme="d" style="margin-top: 0;" class="ui-icon-alt">';
    newdata += '	<li data-role="list-divider" data-theme="a">';
    newdata += '		Report Builder for Merit Badge Counselors';
    newdata += '	</li>';
    newdata += '	<li data-theme="d">';

    newdata += '		<div class="ui-grid-a twoCol">';
    newdata += '			<div class="ui-block-a">';
    newdata += '				<p class="normalText">Create  Merit Badge Report for a Scout or a group of Scouts you Counsel.</p>';
    newdata += '				<div id="requirements" style="margin-top: 0; ">';
    newdata += '					<label class="text-orange"><strong>Merit Badges:</strong></label>';
    newdata += '					<fieldset data-role="controlgroup">';
    newdata += '						<legend></legend>		';

    uniqlist = [];

    uniquemblist(uniqlist);


    for (var i = 0; i < uniqlist.length; i++) {
        newdata += '							<input type="checkbox" name="MeritBadgeID" id="meritBadgeID' + escapeHTML(uniqlist[i].mbid) + '" data-theme="d" value="' + escapeHTML(uniqlist[i].mbid) + '">';
        newdata += '							<label for="meritBadgeID' + escapeHTML(uniqlist[i].mbid) + '">' + escapeHTML(uniqlist[i].mbShortName) + '</label>';

        // set positions of mbs in MBCdata
        for (var j = 0; j < MBCdata.length; j++) {
            for (k = 0; k < MBCdata[j].mbLst.length; k++) {
                if (MBCdata[j].mbLst[k].mbid == uniqlist[i].mbid) {
                    MBCdata[j].mbLst[k].pos = i;
                    break;
                }
            }
        }
    }
    maketable();

    newdata += '					</fieldset>';
    newdata += '				</div>';


    newdata += '				<div style="margin-top: 1.5em; ">';

    newdata += '				</div>';
    newdata += '			</div>'; // end of a
    newdata += '			<div class="ui-block-b">';
    newdata += '				<div style="margin-bottom: 1.5em; ">';

    newdata += '					<div style="margin-top: 1.5em; ">';

    newdata += '						<fieldset data-role="controlgroup">';
    newdata += '							<legend class="text-orange">';
    newdata += '								<strong>Choose Scout(s):</strong>';
    newdata += '							</legend>	';

    newdata += '								<input type="checkbox" name="allScoutUserID" id="AllscoutUserID" data-theme="d" value=""  >';
    newdata += '								<label for="AllscoutUserID">';
    newdata += '									Select All Scouts for this Badge';
    newdata += '								</label>';




    for (var i = 0; i < MBCdata.length; i++) {
        newdata += '								<input type="checkbox" name="ScoutUserID" id="scoutUserID' + escapeHTML(MBCdata[i].id) + '" data-theme="d" value="' + escapeHTML(MBCdata[i].id) + '"  data-canapprove="1" disabled >';
        newdata += '								<label for="scoutUserID' + escapeHTML(MBCdata[i].id) + '">';
        newdata += '									<div style="display: inline-block; width: 30px; margin-right: 5px; ">';
        newdata += '										<img src="' + escapeHTML(MBCdata[i].img) + '" class="imageSmall" />';
        newdata += '									</div>';
        newdata += '									' + escapeHTML(MBCdata[i].name);
        newdata += '								</label>	';

    }

    newdata += '						</fieldset>';
    newdata += '					</div>';


    newdata += '					<a href="#" data-role="button" data-theme="g" style="margin-top: 1em; " id="buttonSubmit">Generate Report</a>';
    newdata += '				</div>';
    newdata += '			</div>'; // end of b0
    newdata += '		</div>';
    newdata += '	</li>';


    newdata += '</ul>';
    newdata += '</form>';

    newdata += '<div id="footer" align="center">';

    newdata += logoutWarningPageContent('Page' + escapeHTML(pageid));
    newdata += '<div style="margin-top: 6px;">This page was produced by the Feature Assistant Extension/Add-on and is not supported by BSA</div>';
    newdata += '<div style="margin-top: 6px;">&copy; ' + escapeHTML(cyear()) + '- Boy Scouts of America &bull; <a href="/mobile/help/privacy.asp">Privacy</a></div>';
    newdata += '<div><a href="/" data-ajax="false"><img src="https://d1kn0x9vzr5n76.cloudfront.net/mobile/images/scoutbookbsalogo400.png" width="200"></a></div>';

    newdata += '</div>';


    newdata += '<div data-role="popup" id="errorPopup" data-overlay-theme="a" class="ui-content" data-theme="e" data-transition="fade">';
    newdata += '<a href="#" id="closePopupButton" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>';
    newdata += '<div id="errorPopupIcon"></div>';
    newdata += '<div id="errorPopupContent"></div>';
    newdata += '<div class="clearRight"></div>';
    newdata += '</div>';


    newdata += '<div data-role="popup" id="notesPopup" class="ui-content" data-theme="d" data-transition="fade">';
    newdata += '	<a href="#" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>';
    newdata += '	<p class="normalText text-green" style="font-size: 16px; "><img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/notepad256.png" style="float: right; width: 100px; margin-left: 1em; margin-bottom: 1em;" />';
    newdata += '		<strong>Notes & Comments</strong>';
    newdata += '	</p>';
    newdata += '	<p class="normalText">These notes will appear on the Scout' + "'" + 's <strong>Notepad</strong> on each merit badge that is checked off.</p>';
    newdata += '	<p class="normalText"><strong>Keep a history</strong> and record important details or <strong>highlights</strong>.  The parents, Scouts and others who are connected to the Scout will be able to see these notes.</p>';
    newdata += '</div>';



    return newdata;

}

function setMBCmeritbadgeEditContent(pageid) {
    MBCEditFlag = false;
    var newdata = '<div data-role="content">';

    newdata += '<form id="quickForm">';
    newdata += '<input type="hidden" name="Action" value="Submit" />';
    newdata += '<ul data-role="listview" data-inset="true" data-count-theme="f" data-theme="d" style="margin-top: 0;" class="ui-icon-alt">';
    newdata += '	<li data-role="list-divider" data-theme="a">';
    newdata += '		Quick Pick Edit Merit Badge Counselors';
    newdata += '	</li>';
    newdata += '	<li data-theme="d">';

    newdata += '		<div class="ui-grid-a twoCol">';
    newdata += '			<div class="ui-block-a">';
    newdata += '				<p class="normalText">Quickly find Counselled Scout for Merit Badges.</p>';
    newdata += '				<div id="requirements" style="margin-top: 0; ">';
    newdata += '					<label class="text-orange"><strong>Merit Badges:</strong></label>';
    newdata += '					<fieldset data-role="controlgroup">';
    newdata += '						<legend></legend>		';

    uniqlist = [];

    uniquemblist(uniqlist);



    for (var i = 0; i < uniqlist.length; i++) {
        newdata += '							<input type="checkbox" name="MeritBadgeID" id="meritBadgeID' + escapeHTML(uniqlist[i].mbid) + '" data-theme="d" value="' + escapeHTML(uniqlist[i].mbid) + '">';
        newdata += '							<label for="meritBadgeID' + escapeHTML(uniqlist[i].mbid) + '">' + escapeHTML(uniqlist[i].mbShortName) + '</label>';

        // set positions of mbs in MBCdata
        for (var j = 0; j < MBCdata.length; j++) {
            for (k = 0; k < MBCdata[j].mbLst.length; k++) {
                if (MBCdata[j].mbLst[k].mbid == uniqlist[i].mbid) {
                    MBCdata[j].mbLst[k].pos = i;
                    break;
                }
            }
        }
    }
    maketable();

    newdata += '					</fieldset>';
    newdata += '				</div>';


    newdata += '				<div style="margin-top: 1.5em; ">';

    newdata += '				</div>';
    newdata += '			</div>'; // end of a
    newdata += '			<div class="ui-block-b">';
    newdata += '				<div style="margin-bottom: 1.5em; ">';

    newdata += '					<div style="margin-top: 1.5em; ">';

    newdata += '						<fieldset data-role="controlgroup">';
    newdata += '							<legend class="text-orange">';
    newdata += '								<strong>Choose Scout:</strong>';
    newdata += '							</legend>	';


    newdata += '							<ul data-role="listview" data-inset="true" style="margin-bottom: 1em; "  id="slist" class="ui-icon-alt" data-theme="d">\n';
    for (var i = 0; i < MBCdata.length; i++) {
        newdata += '			<li id="li' + MBCdata[i].id + '" class="disabled" name="scoutlinks">\n';

        newdata += '				<a href="#" name="scoutLink"  style="margin-top: 1em; " id=' + MBCdata[i].id + ' data-unitid=' + MBCdata[i].unitid + '>\n'; //data-role="button" data-theme="g"
        newdata += '						<div style="display: inline-block; width: 30px;  margin-right: 5px; ">\n';
        newdata += '							<img src="' + escapeHTML(MBCdata[i].img) + '" class="imageSmall" />\n';
        newdata += '						</div>\n';
        newdata += '						 ' + escapeHTML(MBCdata[i].name);
        newdata += '				</a>\n';
        newdata += '			</li>\n';
    }
    newdata += '							</ul>\n';



    newdata += '						</fieldset>';
    newdata += '					</div>';


    //newdata += '					<a href="#" data-role="button" data-theme="g" style="margin-top: 1em; " id="buttonSubmit">Generate Report</a>';							
    newdata += '				</div>';
    newdata += '			</div>'; // end of b0
    newdata += '		</div>';
    newdata += '	</li>';


    newdata += '</ul>';
    newdata += '</form>';

    newdata += '<div id="footer" align="center">';

    newdata += logoutWarningPageContent('Page' + escapeHTML(pageid));
    newdata += '<div style="margin-top: 6px;">This page was produced by the Feature Assistant Extension/Add-on and is not supported by BSA</div>';
    newdata += '<div style="margin-top: 6px;">&copy; ' + escapeHTML(cyear()) + '- Boy Scouts of America &bull; <a href="/mobile/help/privacy.asp">Privacy</a></div>';
    newdata += '<div><a href="/" data-ajax="false"><img src="https://d1kn0x9vzr5n76.cloudfront.net/mobile/images/scoutbookbsalogo400.png" width="200"></a></div>';

    newdata += '</div>';


    newdata += '<div data-role="popup" id="errorPopup" data-overlay-theme="a" class="ui-content" data-theme="e" data-transition="fade">';
    newdata += '<a href="#" id="closePopupButton" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>';
    newdata += '<div id="errorPopupIcon"></div>';
    newdata += '<div id="errorPopupContent"></div>';
    newdata += '<div class="clearRight"></div>';
    newdata += '</div>';


    newdata += '<div data-role="popup" id="notesPopup" class="ui-content" data-theme="d" data-transition="fade">';
    newdata += '	<a href="#" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>';
    newdata += '	<p class="normalText text-green" style="font-size: 16px; "><img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/notepad256.png" style="float: right; width: 100px; margin-left: 1em; margin-bottom: 1em;" />';
    newdata += '		<strong>Notes & Comments</strong>';
    newdata += '	</p>';
    newdata += '	<p class="normalText">These notes will appear on the Scout' + "'" + 's <strong>Notepad</strong> on each merit badge that is checked off.</p>';
    newdata += '	<p class="normalText"><strong>Keep a history</strong> and record important details or <strong>highlights</strong>.  The parents, Scouts and others who are connected to the Scout will be able to see these notes.</p>';
    newdata += '</div>';



    return newdata;

}
//mbc
function uniquemblist(uniqlist) {
    var addmb = true;
    if (MBCdata.length > 0) {
        if (uniqlist.length == 0) {
            uniqlist.push(MBCdata[0].mbLst[0]);
        }
    }
    for (var i = 0; i < MBCdata.length; i++) {
        for (var j = 0; j < MBCdata[i].mbLst.length; j++) {
            addmb = true;
            for (var k = 0; k < uniqlist.length; k++) {
                //console.log('check '+MBCdata[i].name + ' '+MBCdata[i].mbLst[j].mbShortName);
                if (uniqlist[k].mbShortName == MBCdata[i].mbLst[j].mbShortName) {
                    addmb = false;
                    break;
                }
            }
            if (addmb == true) {
                //console.log('Save "'+MBCdata[i].mbLst[j].mbShortName+'"');
                uniqlist.push(MBCdata[i].mbLst[j]);
            }
        }
    }
    //sort it

    uniqlist.sort(SortBymbShortName);
    //console.log('uniqlist');
    //console.log(uniqlist);
}


//mbc
function SortBymbShortName(a, b) {
    var aName = a.mbShortName.toLowerCase();
    var bName = b.mbShortName.toLowerCase();
    return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
}

//mbc
function mbcqeinv() {

    var UnitID = X;

    function pageShow() {
        //nothing unique here
    }

    function pageInit() {

        $('#buttonSubmit', '#PageX').click(function() {
            $('#quickForm', '#PageX').submit();
            return false;
        });

        $('#quickForm', '#PageX').submit(function() {
            //formPost = $('#quickForm', '#PageX').serialize();

            if ($('input[name=ScoutUserID]:checked', '#quickForm').val() == undefined) {
                showErrorPopup("Please select a Counselor");
                return false;

            }



            // disable all inputs
            $(':input', '#PageX #quickForm').attr('disabled', true);
            $('#buttonSubmit', '#PageX #quickForm').addClass('ui-disabled');

            $.mobile.loading('show', {
                theme: 'a',
                text: 'inviting counselor...this may take several minutes depending on the number of Scouts selected',
                textonly: false
            });
            setTimeout(function() {
                submitQuickForm();
            }, 200);
            return false;
        });

        $('#notesHelp', '#PageX').click(function() {
            $('#notesPopup', '#PageX').popup({
                tolerance: '10,30',
                transition: 'pop',
                positionTo: 'origin',
                history: false
            }).popup('open');
            return false;
        });

    }

    function submitQuickForm() {

        if ($('input[name=ScoutUserID]:checked', '#quickForm').val() == 'none') {

            // skip this mb, user didn't add a counselor to invite
            addMBIDindex -= 1;
            if (addMBIDindex < 0) {
                // no more mb's left...  WHAT HERE - we are done..
                inviteDone();
                return false;
            }
            setTimeout(function() {
                selectMBC();
            }, 200);
            return false;

        }

        // For each scout, invite this counselor and mbid
        var counselorID = $('input[name=ScoutUserID]:checked', '#quickForm').val();

        var msg = $('textArea[name=PersonalMessage]', '#quickForm').val();

        //alert(msg);
        //var scoutUserIDMBmbc=[];	//duplicate list, used for inviting counselors
        //var sUIindex=0;	

        sUIindex = scoutUserIDMBmbc.length - 1; //initialize scout id ptr

        //Goes through each scout one at a time.
        //Looks to see if MBC is already connected.  If connected, modify connection to add MBC and MB
        //If not connected sends invite				
        //console.log('in submitQuickForm, calling checkScoutConnection, sUIindex='+sUIindex);
        setTimeout(function() {
            checkScoutConnection(counselorID, msg, UnitID);
        }, 200);

        return false;




    }

    function inviteDone() {
        inviteMBCperm = false;
        //alert('done inviting');
        $.mobile.loading('hide'); // go to
        $.mobile.changePage(
            '/mobile/dashboard/admin/unit.asp?UnitID=' + UnitID, {
                allowSamePageTransition: true,
                transition: 'none',
                showLoadMsg: true,
                reloadPage: true
            }
        );

    }

    // standard function from page
    function showErrorPopup(msg) {
        $('#errorPopupContent', '#PageX').html(msg);
        $('#errorPopup', '#PageX').popup({
            tolerance: '10,40',
            transition: 'pop',
            positionTo: 'window',
            history: false
        }).popup('open');
    }


}


//mbc
function mbcqescr() {
    var formPost;

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
            //console.log('click');
            setStateScout();
        });


        $(':checkbox[name=MeritBadgeID]').click(function() {
            //debugger;
            setStateMB();
        });


        $('#buttonSubmit', '#PageX').click(function() {
            $('#quickForm', '#PageX').submit();
            return false;
        });

        $('#quickForm', '#PageX').submit(function() {

            //check for at least one scout and on mb checked
            var errmsg = '';
            if ($('input:checkbox[name=ScoutUserID]:checked').length == 0) {
                errmsg = "Please check at least one Scout";
            }
            if ($('input:checkbox[name=MeritBadgeID]:checked').length == 0) {
                if (errmsg != '') {
                    errmsg += ' AND ';
                }
                errmsg += "Please check at least one Merit Badge";
            }
            if ($('input[name=DateCompleted]').val() == '') {
                if (errmsg != '') {
                    errmsg += ' AND ';
                }
                errmsg += "Please enter Completion Date";
            }
            if (errmsg != '') {
                showErrorPopup(errmsg);
                return false;
            }


            formPost = $('#quickForm', '#PageX').serialize();

            // disable all inputs
            $('#buttonSubmit', '#PageX #quickForm').addClass('ui-disabled');

            $.mobile.loading('show', {
                theme: 'a',
                text: 'saving...this may take several minutes depending on the number of Scouts and badges selected',
                textonly: false
            });
            setTimeout(function() {
                submitQuickForm();
            }, 200);
            return false;
        });

        $('#notesHelp', '#PageX').click(function() {
            $('#notesPopup', '#PageX').popup({
                tolerance: '10,30',
                transition: 'pop',
                positionTo: 'origin',
                history: false
            }).popup('open');
            return false;
        });

    }

    //Scouts greyed out, select badge, enable eligible scouts.... click scouts desired, if badge is deselected all scouts are deselected...
    function setStateMB() {
        var sid = '';
        $('input:checkbox[name=MeritBadgeID]:checked').each(function() {
            sid = $(this).val();
        });

        if (sid == '') {
            // enable all mbs
            $('input:checkbox[name=MeritBadgeID]').each(function() {
                $(this).checkboxradio('enable').checkboxradio('refresh');
            });
            //disable all scouts and uncheck them  .checkboxradio('disable').checkboxradio('refresh');

            $('input:checkbox[name=ScoutUserID]').each(function() {
                $(this).checkboxradio('disable').prop('checked', false).checkboxradio('refresh');
                //clear checks
            });
        } else {
            // disable remaining mbs
            $('input:checkbox[name=MeritBadgeID]').each(function() {
                if ($(this).val() != sid) {
                    $(this).checkboxradio('disable').checkboxradio('refresh');
                }
            });
            // enable eligible scouts
            $('input:checkbox[name=ScoutUserID]').each(function() {
                $(this).checkboxradio('disable').checkboxradio('refresh');
                for (var j = 0; j < MBCdata.length; j++) {

                    if ($(this).val() == MBCdata[j].id) {
                        for (var k = 0; k < MBCdata[j].mbLst.length; k++) {
                            if (MBCdata[j].mbLst[k].mbid == sid) {
                                $(this).checkboxradio('enable').checkboxradio('refresh');
                            }
                        }
                    }
                }
            });
        }

    }

    function setStateScout() {
        // when a Scout is clicked... do nothing!66

    }

    function xsetState() {
        //alert('click');
        var rrow = [];
        var rcol = [];
        row = [];
        for (var j = 0; j < MBCdata.length; j++) {
            row[j] = 0;
        }
        //alert($('input:checkbox[name=ScoutUserID]:checked').length + ' checked');
        //alert($('input:checkbox[name=MeritBadgeID]:checked').length+ ' checked');


        $('input:checkbox[name=ScoutUserID]:checked').each(function() {
            for (var j = 0; j < MBCdata.length; j++) {
                if ($(this).val() == MBCdata[j].id) {
                    row[j] = 1;
                }
            }
        });



        col = [];
        for (var j = 0; j < uniqlist.length; j++) {
            col[j] = 0;
        }

        $('input:checkbox[name=MeritBadgeID]:checked').each(function() {
            for (var j = 0; j < uniqlist.length; j++) {
                if ($(this).val() == uniqlist[j].mbid) {
                    col[j] = 1;
                }
            }
        });




        // have row and col inputs to table algorithm
        calctable(fulltable, row, col, rrow, rcol);


        //console.log(rrow);
        for (i = 0; i < rrow.length; i++) {
            //if rrow[0]==0, disable row, otherwise, enable
            //lookup id
            var id = MBCdata[i].id;
            if (rrow[i] == 0) { //717941
                $('#scoutUserID' + id).checkboxradio('disable').checkboxradio('refresh');
            } else {
                $('#scoutUserID' + id).checkboxradio('enable').checkboxradio('refresh'); //.prop('checked', true)
            }
        }
        for (i = 0; i < rcol.length; i++) {
            //if rcol[0]==0, disable col, otherwise, enable
            var mbid = uniqlist[i].mbid;
            if (rcol[i] == 0) {
                $('#meritBadgeID' + mbid + '').checkboxradio('disable').checkboxradio('refresh');
            } else {
                $('#meritBadgeID' + mbid + '').checkboxradio('enable').checkboxradio('refresh'); //.prop('checked', true)
            }

        }



    }


    function submitQuickForm() {
        //alert('stub');
        //console.log('submitQuickForm in mbcqescr');
        //return;
        var evObj = {
            scoutid: '',
            mbid: [],
            notes: '',
            scoutname: ''
        };
        //build list of checked scouts and mbids that can be decremented
        counselorApprvLst.length = 0;
        var id;
        $('input:checkbox[name=ScoutUserID]:checked').each(function() {
            id = $(this).attr('id');
            evObj.scoutname = $('label[for="' + id + '"]').text().trim();
            evObj.mbid.length = 0;
            evObj.scoutid = $(this).val();
            evObj.notes = $('textarea[name="Comments"]').val();
            $('input:checkbox[name=MeritBadgeID]:checked').each(function() {
                evObj.mbid.push($(this).val());
            });
            counselorApprvLst.push(JSON.parse(JSON.stringify(evObj)));
        });


        getunitpatrol();

        return;

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

function mbcrpscr() {
    var formPost;

    function pageShow() {

    }

    function pageInit() {

        $('#AllscoutUserID').click(function() {

            var checkstat = $(this).prop('checked');
            //select or unselect all eligible scouts
            $(':checkbox[name=ScoutUserID]').each(function() {
                if ($(this).prop('disabled') == false) {
                    if (checkstat == true) {
                        if ($(this).prop('checked') == false) {
                            $(this).click(); //check it
                        }
                    } else {
                        if ($(this).prop('checked') == true) {
                            $(this).click(); //check it to unset
                        }

                    }
                }
            });

        });

        $(':checkbox[name=ScoutUserID]').click(function() {

            setStateScout();
        });


        $(':checkbox[name=MeritBadgeID]').click(function() {
            setStateMB();
        });


        $('#buttonSubmit', '#PageX').click(function() {
            $('#quickForm', '#PageX').submit();
            return false;
        });

        $('#quickForm', '#PageX').submit(function() {

            //check for at least one scout and on mb checked
            var errmsg = '';
            if ($('input:checkbox[name=ScoutUserID]:checked').length == 0) {
                errmsg = "Please check at least one Scout";
            }
            if ($('input:checkbox[name=MeritBadgeID]:checked').length == 0) {
                if (errmsg != '') {
                    errmsg += ' AND ';
                }
                errmsg += "Please check at least one Merit Badge";
            }
            if ($('input[name=DateCompleted]').val() == '') {
                if (errmsg != '') {
                    errmsg += ' AND ';
                }
                errmsg += "Please enter Completion Date";
            }
            if (errmsg != '') {
                showErrorPopup(errmsg);
                return false;
            }


            formPost = $('#quickForm', '#PageX').serialize();

            // disable all inputs
            $('#buttonSubmit', '#PageX #quickForm').addClass('ui-disabled');

            $.mobile.loading('show', {
                theme: 'a',
                text: 'generating report...this may take several minutes depending on the number of Scouts and badges selected',
                textonly: false
            });
            setTimeout(function() {
                submitQuickForm();
            }, 200);
            return false;
        });

        $('#notesHelp', '#PageX').click(function() {
            $('#notesPopup', '#PageX').popup({
                tolerance: '10,30',
                transition: 'pop',
                positionTo: 'origin',
                history: false
            }).popup('open');
            return false;
        });

    }

    //Scouts greyed out, select badge, enable eligible scouts.... click scouts desired, if badge is deselected all scouts are deselected...
    function setStateMB() {
        var sid = '';
        $('input:checkbox[name=MeritBadgeID]:checked').each(function() {
            sid = $(this).val();
        });

        if (sid == '') {
            // enable all mbs
            $('input:checkbox[name=MeritBadgeID]').each(function() {
                $(this).checkboxradio('enable').checkboxradio('refresh');
            });
            //disable all scouts and uncheck them  .checkboxradio('disable').checkboxradio('refresh');

            $('input:checkbox[name=ScoutUserID]').each(function() {
                $(this).checkboxradio('disable').prop('checked', false).checkboxradio('refresh');
                //clear checks
            });
        } else {
            // disable remaining mbs
            $('input:checkbox[name=MeritBadgeID]').each(function() {
                if ($(this).val() != sid) {
                    $(this).checkboxradio('disable').checkboxradio('refresh');
                }
            });
            // enable eligible scouts
            $('input:checkbox[name=ScoutUserID]').each(function() {
                $(this).checkboxradio('disable').checkboxradio('refresh');
                for (var j = 0; j < MBCdata.length; j++) {

                    if ($(this).val() == MBCdata[j].id) {
                        for (var k = 0; k < MBCdata[j].mbLst.length; k++) {
                            if (MBCdata[j].mbLst[k].mbid == sid) {
                                $(this).checkboxradio('enable').checkboxradio('refresh');
                            }
                        }
                    }
                }
            });
        }

    }

    function setStateScout() {
        // when a Scout is clicked... do nothing!66

    }

    function submitQuickForm() {
        var evObj = {
            scoutid: '',
            scoutname: '',
            mbid: [],
            notes: ''
        };
        //build list of checked scouts and mbids that can be decremented
        counselorApprvLst.length = 0;
        var id;
        $('input:checkbox[name=ScoutUserID]:checked').each(function() {
            id = $(this).attr('id');
            evObj.scoutname = $('label[for="' + id + '"]').text().trim();
            evObj.mbid.length = 0;
            evObj.scoutid = $(this).val();
            $('input:checkbox[name=MeritBadgeID]:checked').each(function() {
                evObj.mbid.push($(this).val());
            });
            counselorApprvLst.push(JSON.parse(JSON.stringify(evObj)));
        });


        repgetmyunits()
        return;

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

function mbcedscr() {
    var formPost;

    function pageShow() {

    }

    function pageInit() {



        $(':checkbox[name=ScoutUserID]').click(function() {

            setStateScout();
        });


        $(':checkbox[name=MeritBadgeID]').click(function() {
            setStateMB();
        });


        $('#buttonSubmit', '#PageX').click(function() {
            $('#quickForm', '#PageX').submit();
            return false;
        });

        $('#quickForm', '#PageX').submit(function() {

            //check for at least one scout and on mb checked
            var errmsg = '';
            if ($('input:checkbox[name=ScoutUserID]:checked').length == 0) {
                errmsg = "Please check at least one Scout";
            }
            if ($('input:checkbox[name=MeritBadgeID]:checked').length == 0) {
                if (errmsg != '') {
                    errmsg += ' AND ';
                }
                errmsg += "Please check at least one Merit Badge";
            }
            if ($('input[name=DateCompleted]').val() == '') {
                if (errmsg != '') {
                    errmsg += ' AND ';
                }
                errmsg += "Please enter Completion Date";
            }
            if (errmsg != '') {
                showErrorPopup(errmsg);
                return false;
            }


            formPost = $('#quickForm', '#PageX').serialize();

            // disable all inputs
            $('#buttonSubmit', '#PageX #quickForm').addClass('ui-disabled');

            $.mobile.loading('show', {
                theme: 'a',
                text: 'generating report...this may take several minutes depending on the number of Scouts and badges selected',
                textonly: false
            });
            //var unitid=$('a[name="scoutLink"]').attr('data-unitid')
            setTimeout(function() {
                submitQuickForm();
            }, 200);
            return false;
        });

        $('#notesHelp', '#PageX').click(function() {
            $('#notesPopup', '#PageX').popup({
                tolerance: '10,30',
                transition: 'pop',
                positionTo: 'origin',
                history: false
            }).popup('open');
            return false;
        });

        $('a[name="scoutLink"]').click(function() {
            easyNavToMb('#PageX', $('input:checkbox[name=MeritBadgeID]:checked').val(), $(this).attr('id'), $(this).attr('data-unitid'));
            return false;
        });

    }

    //Scouts greyed out, select badge, enable eligible scouts.... click scouts desired, if badge is deselected all scouts are deselected...
    function setStateMB() {
        var sid = '';
        $('input:checkbox[name=MeritBadgeID]:checked').each(function() {
            sid = $(this).val();
        });

        if (sid == '') {
            // enable all mbs
            $('input:checkbox[name=MeritBadgeID]').each(function() {
                $(this).checkboxradio('enable').checkboxradio('refresh');
            });
            //disable all scouts and uncheck them  .checkboxradio('disable').checkboxradio('refresh');

            //$('input:checkbox[name=ScoutUserID]').each( function() {	
            //	$(this).checkboxradio('disable').prop('checked', false).checkboxradio('refresh');
            //clear checks
            //});	
            $('li[name="scoutlinks"]').addClass('disabled');
        } else {
            // disable remaining mbs
            $('input:checkbox[name=MeritBadgeID]').each(function() {
                if ($(this).val() != sid) {
                    $(this).checkboxradio('disable').checkboxradio('refresh');
                }
            });
            // enable eligible scouts

            $('li[name="scoutlinks"]').each(function() {

                $(this).addClass('disabled');
                for (var j = 0; j < MBCdata.length; j++) {
                    if ($(this).attr('id').match(/\d+/) != null) {
                        if ($(this).attr('id').match(/\d+/)[0] == MBCdata[j].id) {
                            for (var k = 0; k < MBCdata[j].mbLst.length; k++) {
                                if (MBCdata[j].mbLst[k].mbid == sid) {
                                    $(this).removeClass('disabled');
                                }
                            }
                        }
                    }
                }
            });




        }
        $('#slist').listview('refresh');
    }

    function setStateScout() {
        // when a Scout is clicked... do nothing!66

    }

    function submitQuickForm() {
        var evObj = {
            scoutid: '',
            scoutname: '',
            mbid: [],
            notes: ''
        };
        //build list of checked scouts and mbids that can be decremented
        counselorApprvLst.length = 0;
        var id;
        $('input:checkbox[name=ScoutUserID]:checked').each(function() {
            id = $(this).attr('id');
            evObj.scoutname = $('label[for="' + id + '"]').text().trim();
            evObj.mbid.length = 0;
            evObj.scoutid = $(this).val();
            $('input:checkbox[name=MeritBadgeID]:checked').each(function() {
                evObj.mbid.push($(this).val());
            });
            counselorApprvLst.push(JSON.parse(JSON.stringify(evObj)));
        });


        repgetmyunits()
        return;

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

function easyNavToMb(pageid, mbid, id, unitid) {
    //nav to account.  If mb not there, nav to Advancements

    $.mobile.loading('show', {
        theme: 'a',
        text: 'Loading...',
        textonly: false
    });
    var mbver = '';
    //don't know what mbver is yet.  Need to look at account page
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, '', [], easyNavToMb, [pageid, mbid, id, unitid]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;


            $('a[href*="/mobile/dashboard/admin/advancement/meritbadge.asp?MeritBadgeID="]', this.response).each(function() {
                if ($(this).attr('href').match(/MeritBadgeID=(\d+)/) != null) {
                    if ($(this).attr('href').match(/MeritBadgeID=(\d+)/)[1] == mbid) {
                        mbver = $(this).attr('href').match(/MeritBadgeVersionID=(\d+)/)[1];

                    }
                }
            });
            if (mbver != '') {
                navToMBEdit(pageid, mbid, id, unitid, mbver);
                return;
            }
            getMBverByAdv(pageid, mbid, id, unitid);

        }
    };


    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/account.asp?ScoutUserID=' + escapeHTML(id);


    xhttp.open("GET", url, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, '', [], easyNavToMb, [pageid, mbid, id, unitid]);
    };
}

function getMBverByAdv(pageid, mbid, id, unitid) {
    var mbver = '';
    //don't know what mbver is yet.  Need to look at account page
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, '', [], getMBverByAdv, [pageid, mbid, id, unitid]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            /*	var href='';
            	$('a[href*="/mobile/dashboard/admin/advancement/meritbadge.asp?MeritBadgeID="]',this.response).each( function() {
            		href=$(this).attr('href')
            		if(href.match(/MeritBadgeID=(\d+)/)[1] == mbid) {
            			
            			console.log( href.match(/MeritBadgeVersionID=(\d+)/)[1]);
            			
            		}
            	});*/

            var href = '';
            mbver = '';
            $('a[href*="/mobile/dashboard/admin/advancement/meritbadge.asp?MeritBadgeID="]', this.response).each(function() {
                href = $(this).attr('href');
                if (href.match(/MeritBadgeID=(\d+)/) != null) {
                    if (href.match(/MeritBadgeID=(\d+)/)[1] == mbid) {
                        if (href.match(/MeritBadgeVersionID=(\d+)/) != null) {
                            mbver = href.match(/MeritBadgeVersionID=(\d+)/)[1];
                        }
                    }
                }
            });
            if (mbver != '') {
                navToMBEdit(pageid, mbid, id, unitid, mbver);

                return;
            }

            genError(pageid, unitid, 'This Merit Badge is no longer listed in this Scouts Advancement. (It may have been deleted)');
            //$.mobile.loading('hide');
        }
    };


    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/advancement/default.asp?ScoutUserID=' + escapeHTML(id) + '&UnitID=' + escapeHTML(unitid) + '&DenID=&PatrolID=';


    xhttp.open("GET", url, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, '', [], getMBverByAdv, [pageid, mbid, id, unitid]);
    };
}

function navToMBEdit(pageid, mbid, id, unitid, mbver) {


    $.mobile.changePage(
        '/mobile/dashboard/admin/advancement/meritbadge.asp?MeritBadgeID=' + escapeHTML(mbid) + '&MeritBadgeVersionID=' + escapeHTML(mbver) + '&ScoutUserID=' + escapeHTML(id) + '&UnitID=' + escapeHTML(unitid), {
            allowSamePageTransition: true,
            transition: 'none',
            showLoadMsg: true,
            reloadPage: true
        }
    );
    return;
}



//mbc
function postMBCmbReq() {
    //if there aren't any more mbids, get the next scout



    if (counselorApprvReqLst.length == 0) {
        $.mobile.loading('hide');

        //$('#buttonCancel, #buttonSubmit').button('enable');

        $.mobile.changePage(
            '/mobile/dashboard/', {
                allowSamePageTransition: true,
                transition: 'none',
                showLoadMsg: true,
                reloadPage: true
            }
        );
        return;
    }
    var thisScout = counselorApprvReqLst[0].scoutid;
    var unitID = counselorApprvReqLst[0].unitid;
    var thisMBid = counselorApprvReqLst[0].mbid;
    var thisMBver = counselorApprvReqLst[0].mbverid;
    var thisNotes = encodeURIComponent(counselorApprvReqLst[0].notes).replace(/%20/g, '+');
    var bakNote = counselorApprvReqLst[0].notes;
    var thisName = counselorApprvReqLst[0].scoutname;
    counselorApprvReqLst[0].notes = ''; // only want the first note saved


    if (counselorApprvReqLst[0].mbreq.length == 0) {
        // no mbidreqs's left for this scout, get next scout
        //shift 
        counselorApprvReqLst.shift();
        setTimeout(function() {
            postMBCmbReq();
        }, 100);
        return;
    }

    var thisMBReq = counselorApprvReqLst[0].mbreq.shift();

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, '', [], retrypostMBCmbReq, [thisMBReq, bakNote]);
        }
        //302 to dashboard means unapproved Scout

        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            if (this.responseURL.match(/dashboard\/$/) != null) {
                //redirected
                alert('Update failed for ' + thisName + '.  Scout membership may be unapproved in their unit');
                setTimeout(function() {
                    postMBCmbReq();
                }, 100);
                return;
            }

            //response should be a url to get note information		
            //$.mobile.changePage('/mobile/dashboard/admin/advancement/meritbadge.asp?MeritBadgeID=3&MeritBadgeVersionID=245&ScoutUserID=
            if (this.response.match(/\/mobile\/dashboard\/admin\/advancement\/meritbadge\.asp/) == null) {
                //error
                var err = '';
                var errmsg = this.response.match(/showErrorPopup\(([^\)]+)/);
                if (errmsg != null) {
                    err = errmsg[1].replace(/<strong>|<\/strong>|<p>|<\/p>/g, '');
                    var nerr = err.match(/(.+)<a href/);
                    if (nerr != null) {
                        err = nerr[1];
                    }
                }
                alert('Processing Error - ' + err);
                mbcApprMbError('postMBCmbReq ' + err);
                return;
            }
            if (thisNotes == '') {
                setTimeout(function() {
                    postMBCmbReq();
                }, 100);
                return; // save time if no notes defined
            }

            var id = '';
            var ver = '';
            var sc = '';

            if (this.response.match(/MeritBadgeID=(\d+)/) != null) {
                id = this.response.match(/MeritBadgeID=(\d+)/)[1];
            }
            if (this.response.match(/MeritBadgeVersionID=(\d+)/) != null) {
                ver = this.response.match(/MeritBadgeVersionID=(\d+)/)[1];
            }
            if (this.response.match(/ScoutUserID=(\d+)/) != null) {
                sc = this.response.match(/ScoutUserID=(\d+)/)[1];
            }


            var newURL = '/mobile/dashboard/admin/advancement/meritbadge.asp?MeritBadgeID=' + id + '&MeritBadgeVersionID=' + ver + '&ScoutUserID=' + sc;


            getNoteForm(newURL, thisNotes);

        }
    };


    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/advancement/meritbadgerequirement.asp?ScoutUserID=' + thisScout + '&MeritBadgeID=' + thisMBid + '&MeritBadgeVersionID=' + thisMBver + '&MeritBadgeRequirementID=' + thisMBReq + '&UnitID=' + unitID;
    var signDate = encodeURIComponent($('#dateCompleted').val());
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send('Action=SubmitDateCompleted&DateCompleted=' + signDate + '&MBApproved=1');

    xhttp.onerror = function() {
        errStatusHandle(500, '', [], retrypostMBCmbReq, [thisMBReq, bakNote]);
    };
}

function retrypostMBCmbReq(thisMBReq, bakNote) {
    counselorApprvReqLst[0].mbreq.push(thisMBReq);
    counselorApprvReqLst[0].notes = bakNote;
    postMBCmbReq();
}

function getNoteForm(newURL, thisNotes) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, '', [], getNoteForm, [newURL, thisNotes]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(newURL);
            servErrCnt = 0;
            var notePost = $('#newComment form.commentForm', this.response).serialize().replace(/&Body=/, '&Body=' + thisNotes);
            postMBCNote(notePost);
        }
    };

    xhttp.open("GET", newURL, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, '', [], getNoteForm, [newURL, thisNotes]);
    };


}


function postMBCNote(notePost) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, mbcApprMbError, ['postMBCNote status=' + this.status], postMBCNote, [notePost]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            setTimeout(function() {
                postMBCmbReq();
            }, 100);
        }
    };



    var url = 'https://' + host + 'scoutbook.com/mobile/includes/ajax.asp?Action=PostComment&HistoryID=';


    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(notePost);

    xhttp.onerror = function() {
        errStatusHandle(500, mbcApprMbError, ['postMBCNote terminal'], postMBCNote, [notePost]);
    };
}



//mbc
function getunitpatrol() {
    var thisMBid;
    var thisNote;
    //console.log('getunitpatrol');
    if (counselorApprvLst.length == 0) {
        //console.log('Done with Counselor Approval.   in getunitpatrol');
        $.mobile.loading('hide');

        //$('#buttonCancel, #buttonSubmit').button('enable');

        $.mobile.changePage(
            '/mobile/dashboard/', {
                allowSamePageTransition: true,
                transition: 'none',
                showLoadMsg: true,
                reloadPage: true
            }
        );
        return;
    }


    thisScout = counselorApprvLst[0].scoutid;


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, mbcApprMbError, ['getunitpatrol status=' + this.status], getunitpatrol, []);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            var patrolid = '';
            //gotodenpatrol
            var unitid = '';
            if ($('a[id="goToDenPatrol"]', this.response).attr('href') != undefined) {
                if ($('a[id="goToDenPatrol"]', this.response).attr('href').match(/PatrolID=(\d+)/) != null) {
                    patrolid = $('a[id="goToDenPatrol"]', this.response).attr('href').match(/PatrolID=(\d+)/)[1];
                }
                if ($('a[id="goToDenPatrol"]', this.response).attr('href').match(/UnitID=(\d+)/) != null) {
                    unitid = $('a[id="goToDenPatrol"]', this.response).attr('href').match(/UnitID=(\d+)/)[1];
                }
            }
            //console.log('get Account responded scout='+thisScout+' patrolid=' +patrolid + ' UnitID='+unitid);			


            //if the scout is in a different unit  the connected mbs are listed on their account page.  Weird, but cool

            if ($('a[href*="/mobile/dashboard/admin/advancement/meritbadge.asp?MeritBadgeID="]', this.response).length > 0) {

                if (counselorApprvLst[0].mbid.length == 0) {
                    // no mbid's left for this scout, get next scout
                    //shift 
                    counselorApprvLst.shift();
                    setTimeout(function() {
                        getunitpatrol();
                    }, 100);
                    return;
                }
                thisMBid = counselorApprvLst[0].mbid.shift();
                thisNote = counselorApprvLst[0].notes;

                var mbvermatch = $('a[href*="/mobile/dashboard/admin/advancement/meritbadge.asp?MeritBadgeID=' + thisMBid + '&"]', this.response).attr('href').match(/MeritBadgeVersionID=(\d+)/);
                if (mbvermatch != null) {
                    var mbver = mbvermatch[1];
                    alreadyApproved(thisScout, mbver, thisMBid, unitid, patrolid, 'out');
                    //setTimeout(function(){ counselorApprove(thisScout,mbver,thisMBid,unitid,patrolid,'out');}, 200);
                    //setTimeout(function(){ leaderApprove(thisScout,mbver,thisMBid);}, 200);
                    return;
                } else {
                    //console.log('cant get version');
                    mbcApprMbError('getunitpatrol no version match for MB ' + thisMBid);
                    return;
                }


                //counselorApprove(thisScout,mbver,thisMBid,unitid,patrolid,'out');
                //alreadyApproved(thisScout,mbver,thisMBid,unitid,patrolid,'out');
                return;

            }

            //if the scout is unapproved, there will be no securityapproved icon
            if ($('img[src*="securityapproved"]', this.response).length != 0) {
                //scout is approved
                findMBver(thisScout, unitid, patrolid, 'in');

            } else {
                //remove this scout from the list

                alert('Scout ' + counselorApprvLst[0].scoutname + ' is unapproved in unit, skipping');
                counselorApprvLst.shift();

                setTimeout(function() {
                    getunitpatrol();
                }, 100);
                return;

            }





        }
    };

    //console.log('getting ' + thisScoutID);
    //https://www.scoutbook.com/mobile/dashboard/admin/account.asp?ScoutUserID=xxxxx
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/account.asp?ScoutUserID=' + thisScout;


    xhttp.open("GET", url, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, mbcApprMbError, ['getunitpatrol terminal'], getunitpatrol, []);
    };

}

//mbc
function findMBverFromProfile(thisScout, unitid, patrolid, type) {



    if (counselorApprvLst[0].mbid.length == 0) {
        // no mbid's left for this scout, get next scout
        //shift 
        counselorApprvLst.shift();
        setTimeout(function() {
            getunitpatrol();
        }, 100);
        return;
    }
    var thisMBid = counselorApprvLst[0].mbid.shift();


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, mbcApprMbError, ['findMBverFromProfile status=' + this.status], findMBverFromProfile, [thisScout, unitid, patrolid, type]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            //gotodenpatrol
            var patrolid = '';
            var unitid = '';
            if ($('a[id="goToDenPatrol"]', this.response).attr('href') != undefined) {
                if ($('a[id="goToDenPatrol"]', this.response).attr('href').match(/PatrolID=(\d+)/) != null) {
                    var patrolid = $('a[id="goToDenPatrol"]', this.response).attr('href').match(/PatrolID=(\d+)/)[1];
                }



                //var patrolid=$('a[id="goToDenPatrol"]',this.response).attr('href').match(/PatrolID=(\d+)/)[1];
                if ($('a[id="goToDenPatrol"]', this.response).attr('href').match(/UnitID=(\d+)/) != null) {
                    unitid = $('a[id="goToDenPatrol"]', this.response).attr('href').match(/UnitID=(\d+)/)[1];
                }
                //console.log('findMBverFromProfile responded scout='+thisScout+' patrolid=' +patrolid + ' UnitID='+unitid);			
            }

            //if the scout is in a different unit  the connected mbs are listed on their account page.  Weird, but cool

            if ($('a[href*="/mobile/dashboard/admin/advancement/meritbadge.asp?MeritBadgeID="]', this.response).length > 0) {

                alreadyApproved(thisScout, mbver, thisMBid, unitid, patrolid, 'out');
                return;

            }

            findMBver(thisScout, unitid, patrolid, 'in');

        }
    };

    //console.log('getting ' + thisScoutID);
    //https://www.scoutbook.com/mobile/dashboard/admin/account.asp?ScoutUserID=xxxxx
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/account.asp?ScoutUserID=' + thisScout;


    xhttp.open("GET", url, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, mbcApprMbError, ['findMBverFromProfile terminal'], findMBverFromProfile, [thisScout, unitid, patrolid, type]);
    };

}

//mbc
function findMBver(thisScout, unitid, patrolid, type) {
    //thisScout,thisMBid
    //console.log('findmbver counselorApprvLst '+ counselorApprvLst[0].mbid.length + ' ' +counselorApprvLst[0].mbid);
    //if there aren't any more mbids, get the next scout
    if (counselorApprvLst[0].mbid.length == 0) {
        // no mbid's left for this scout, get next scout
        //shift 
        counselorApprvLst.shift();
        setTimeout(function() {
            getunitpatrol();
        }, 100);
        return;
    }
    var thisMBid = counselorApprvLst[0].mbid.shift();



    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, mbcApprMbError, ['findMBver status=' + this.status], findMBver, [thisScout, unitid, patrolid, type]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            //debugger;
            var mbver = '';
            if ($('a[href*="/mobile/dashboard/admin/advancement/meritbadge.asp?MeritBadgeID=' + thisMBid + '&"]', this.response).attr('href') != null) {
                if ($('a[href*="/mobile/dashboard/admin/advancement/meritbadge.asp?MeritBadgeID=' + thisMBid + '&"]', this.response).attr('href').match(/MeritBadgeVersionID=(\d+)/) != null) {
                    mbver = $('a[href*="/mobile/dashboard/admin/advancement/meritbadge.asp?MeritBadgeID=' + thisMBid + '&"]', this.response).attr('href').match(/MeritBadgeVersionID=(\d+)/)[1];
                }
            } else {
                alert("Unable to approve this merit badge for " + counselorApprvLst[0].scoutname + '.  Scout no longer has this Merit Badge in his advancement record (may have been deleted)');
                findMBverFromProfile(thisScout, unitid, patrolid, type);
                return;
            }
            //leaderApprove(thisScout,mbver,thisMBid);

            //getunitpatrol(thisScout,mbver,thisMBid);
            //counselorApprove(thisScout,mbver,thisMBid,unitid,patrolid,type);
            alreadyApproved(thisScout, mbver, thisMBid, unitid, patrolid, type);
            return;

        }
    };


    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/advancement/default.asp?ScoutUserID=' + thisScout + '&UnitID=' + unitid + '&DenID=&PatrolID=' + patrolid;

    xhttp.open("GET", url, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, mbcApprMbError, ['findMBver terminal'], findMBver, [thisScout, unitid, patrolid, type]);
    };
}




// should add one step - check if approved before approving again... or not

//mbc
function alreadyApproved(thisScout, mbver, thisMBid, unitid, patrolid, type) {

    //console.log('check alreadyApproved');
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, mbcApprMbError, ['alreadyApproved status=' + this.status], alreadyApproved, [thisScout, mbver, thisMBid, unitid, patrolid, type]);
        }
        if (this.readyState == 4 && this.status == 200) {

            resetLogoutTimer(url);
            servErrCnt = 0;

            if ($('li#mbCompletedLI', this.response)[0].textContent.indexOf('counselor approved by') != -1) {
                //already approved so we should skip approval and move on??
                //console.log(thisScout+ ' was previously approved ' + ' for ' +thisMBid);
                if (type == 'out') {
                    setTimeout(function() {
                        findMBverFromProfile(thisScout, unitid, patrolid, type);
                    }, 200);
                } else {
                    setTimeout(function() {
                        findMBver(thisScout, unitid, patrolid);
                    }, 200);
                }

            } else {
                //not yet approved
                setTimeout(function() {
                    counselorApprove(thisScout, mbver, thisMBid, unitid, patrolid, type);
                }, 200); //keep
            }


        };
    }

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/advancement/meritbadge.asp?MeritBadgeID=' + thisMBid + '&MeritBadgeVersionID=' + mbver + '&ScoutUserID=' + thisScout;
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();

    xhttp.onerror = function() {
        errStatusHandle(500, mbcApprMbError, ['alreadyApproved terminal'], alreadyApproved, [thisScout, mbver, thisMBid, unitid, patrolid, type]);
    };
}

//mbc
function counselorApprove(thisScout, mbver, thisMBid, unitid, patrolid, type) {

    //console.log('counselorapprove');
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, mbcApprMbError, ['counselorApprove status=' + this.status], counselorApprove, [thisScout, mbver, thisMBid, unitid, patrolid, type]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            var err = '';
            var errmsg = this.response.match(/alert\(([^\)]+)/);
            if (errmsg != null) {
                //err=errmsg[1].replace(/<strong>|<\/strong>|<p>|<\/p>/g,'');
                alert(errmsg[1]);
                mbcApprMbError('counselorApprove ' + errmsg[1]);
                return;
            }

            if (counselorApprvLst[0].notes == '') {
                //if from diff unit, findMBver isn't the right func
                if (type == 'out') {
                    setTimeout(function() {
                        findMBverFromProfile(thisScout, unitid, patrolid, type);
                    }, 200);
                } else {
                    setTimeout(function() {
                        findMBver(thisScout, unitid, patrolid);
                    }, 200);
                }
                return;
            }
            // save the note

            var thisNotes = encodeURIComponent(counselorApprvLst[0].notes).replace(/%20/g, '+');

            var newURL = '/mobile/dashboard/admin/advancement/meritbadge.asp?MeritBadgeID=' + thisMBid + '&MeritBadgeVersionID=' + mbver + '&ScoutUserID=' + thisScout;


            getNoteFormc(newURL, thisNotes, thisScout, unitid, patrolid, type);


        }
    };


    var signDate = encodeURIComponent($('#dateCompleted').val());
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/advancement/meritbadge.asp?MeritBadgeID=' + thisMBid + '&MeritBadgeVersionID=' + mbver + '&ScoutUserID=' + thisScout;
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send('Action=MBCompleted&DateCompleted=' + signDate + '&MBApproved=1');

    xhttp.onerror = function() {
        errStatusHandle(500, mbcApprMbError, ['counselorApprove terminal'], counselorApprove, [thisScout, mbver, thisMBid, unitid, patrolid, type]);
    };
}



function getNoteFormc(newURL, thisNotes, thisScout, unitid, patrolid, type) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, mbcApprMbError, ['getNoteFormc status=' + this.status], getNoteFormc, [newURL, thisNotes, thisScout, unitid, patrolid, type]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(newURL);
            servErrCnt = 0;
            var notePost = $('#newComment form.commentForm', this.response).serialize().replace(/&Body=/, '&Body=' + thisNotes);
            postMBCNote(notePost, thisScout, unitid, patrolid, type);
        }
    };

    xhttp.open("GET", newURL, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, mbcApprMbError, ['getNoteFormc terminal'], getNoteFormc, [newURL, thisNotes, thisScout, unitid, patrolid, type]);
    };


}


function postMBCNoteC(notePost, thisScout, unitid, patrolid, type) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, mbcApprMbError, ['postMBCNoteC status=' + this.status], postMBCNoteC, [notePost, thisScout, unitid, patrolid, type]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            if (type == 'out') {
                setTimeout(function() {
                    findMBverFromProfile(thisScout, unitid, patrolid, type);
                }, 200);
            } else {
                setTimeout(function() {
                    findMBver(thisScout, unitid, patrolid);
                }, 200);
            }

        }
    };



    var url = 'https://' + host + 'scoutbook.com/mobile/includes/ajax.asp?Action=PostComment&HistoryID=';


    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(notePost);

    xhttp.onerror = function() {
        errStatusHandle(500, mbcApprMbError, ['postMBCNoteC terminal'], postMBCNoteC, [notePost, thisScout, unitid, patrolid, type]);
    };
}



/*


Post a comment
https://www.scoutbook.com/mobile/includes/ajax.asp?Action=PostComment&HistoryID=


*/




//mbc
function mbcApprMbError(reason) {
    $.mobile.loading('hide');
    var errTxt = 'Error approving Merit Badges, discontinuing updates.  Not all Scouts/Merit Badges Selected are updated. ';
    if (reason != undefined) {
        errTxt = 'Error approving Merit Badges, discontinuing updates.  Not all Scouts/Merit Badges Selected are updated. ' + reason;
    }
    alert(errTxt);
    //	$('#buttonCancel, #buttonSubmit').button('enable');

    $.mobile.changePage(
        '/mobile/dashboard/', {
            allowSamePageTransition: true,
            transition: 'none',
            showLoadMsg: true,
            reloadPage: true
        }
    );
}

function mbcError_to_dash_w_msg(msg) {
    $.mobile.loading('hide');
    alert(msg);
    //	$('#buttonCancel, #buttonSubmit').button('enable');

    $.mobile.changePage(
        '/mobile/dashboard/', {
            allowSamePageTransition: true,
            transition: 'none',
            showLoadMsg: true,
            reloadPage: true
        }
    );
}
//mbc
function dashbeforeshow(pageid, cb) {

    // Determine if the user is a MBC.  If they are, display the QE item.
    //If user is MBC,  can see it in https://www.scoutbook.com/mobile/dashboard/admin/positions.asp
    //console.log('dashbeforeshow');
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, mbcApprMbError, ['dashbeforeshow status=' + this.status], dashbeforeshow, [pageid]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            getMyPositions(this.response);

            //var mbcActiveApproved=false;
            if ($('.mbContainer', this.response).length == 0) {
                //was never a MBC
                $('#mbcQEDivider').hide();
                $('#mbcReportDivider').hide();
                $('#mbcEditMBDivider').hide();
                $('#mbcQEHeader').hide();
                // remove the administration class from the object
                $('#mbcQEDivider').removeClass('administration');
                $('#mbcReportDivider').removeClass('administration');
                $('#mbcEditMBDivider').removeClass('administration');
                $('#mbcQEHeader').removeClass('administration');
            }
            if ($('.mbContainer', this.response).parent()[0] != undefined) {
                var mbcTop = $('.mbContainer', this.response).parent()[0];
                if ($('div [alt="position approved"]', mbcTop)[0] != undefined) {


                    if ($('.mbContainer', this.response).parent()[0].textContent.indexOf(' - ') == -1) {
                        $('#mbcQEDivider').show(); //display QE menu
                        $('#mbcReportDivider').show(); //display QE menu
                        $('#mbcEditMBDivider').show();
                        $('#mbcQEHeader').show(); //display QE menu

                        $('#dismiss', pageid).click(function() {
                            if (MBCqeReqFlag == true || MBCQEMBflag == true) {
                                return;
                            }
                            $('#quickEntryMenu', pageid).popup('close');
                            $('#faOverlay', pageid).hide();
                        });

                        $('#meritbadgeqe', pageid).click(function(e) {

                            if (MBCqeReqFlag == true || MBCQEMBflag == true) {
                                return;
                            }


                            //$('#meritbadgeqe',pageid).bind('click', function(e){
                            //	e.preventDefault();
                            //});
                            //$('#meritbadgereqqe',pageid).bind('click', function(e){
                            //	e.preventDefault();
                            //});

                            //$('#quickEntryMenu',pageid).popup('close');
                            // merit badge qe.  Need to buidl a full page, mimicing the merit badge QE page
                            // EXCEPT
                            // Look at user's connections.  Build list of scouts and merit badges they are connected for
                            //close popup

                            MBCQEMBflag = true;
                            getScoutsFromProfile(false, 'badge');

                        });

                        $('#meritbadgereqqe', pageid).click(function(e) {

                            if (MBCqeReqFlag == true || MBCQEMBflag == true) {
                                return;
                            }
                            //$('#meritbadgeqe',pageid).bind('click', function(e){
                            //	e.preventDefault();
                            //});
                            //$('#meritbadgereqqe',pageid).bind('click', function(e){
                            //	e.preventDefault();
                            //});


                            //alert('here');
                            // allows clicks again
                            //$('#quickEntryMenu',pageid).popup('close');
                            //$('#meritbadgereqqe',pageid).unbind('click');
                            //$('#meritbadgeqe',pageid).unbind('click');
                            $('#faOverlay', pageid).show();
                            MBCqeReqFlag = true;
                            getScoutsFromProfile(false, 'req');
                        });
                        $('#mbcReports', pageid).click(function() {
                            $('#faOverlay', pageid).show();
                            getScoutsFromProfile(false, 'report');

                        });
                        $('#mbcEditMBs', pageid).click(function() {
                            $('#faOverlay', pageid).show();
                            getScoutsFromProfile(false, 'edit');

                        });

                    } else {
                        $('#mbcQEDivider').hide();
                        $('#mbcReportDivider').hide();
                        $('#mbcEditMBDivider').hide();
                        $('#mbcQEHeader').hide();
                        // remove the administration class from the object
                        $('#mbcQEDivider').removeClass('administration');
                        $('#mbcReportDivider').removeClass('administration');
                        $('#mbcEditMBDivider').removeClass('administration');
                        $('#mbcQEHeader').removeClass('administration');
                    }

                }
            }
            if ($('.administration:hidden').length > 0) {
                $('.mbc').hide();
            }

            getMyZip();

        }
    };
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/positions.asp';
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();

    xhttp.onerror = function() {
        errStatusHandle(500, mbcApprMbError, ['dashbeforeshow terminal'], dashbeforeshow, [pageid]);
    };



}
//mbc
function getMyZip(cb) {

    // get the zip of the current user.

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, mbcApprMbError, ['dashbeforeshow status=' + this.status], dashbeforeshow, [pageid]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            var zip = $('input#zip', this.response).val();
            myPositions[0].myZip = zip;

        }
    };

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/editprofile.asp?ScoutUserID=&UnitID=&DenID=&PatrolID=';
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();

    xhttp.onerror = function() {
        errStatusHandle(500, mbcApprMbError, ['dashbeforeshow terminal'], dashbeforeshow, [pageid]);
    };



}

function getMyPositions(document) {
    myPositions = [];
    var evObj = {
        unitID: '',
        position: '',
        mbs: [],
        unitName: '',
        myZip: ''
    };
    $('a[href*="position.asp?UserPositionID="]', document).each(function() {
        var rtxt = $(this).text().trim();
        if (rtxt.match(/[a-zA-Z]{3} [\d]+, [\d]+ -/) == null) {
            //MBC counselors don't have a UnitID, so ignore them
            evObj.unitName = $('.orangeSmall', this).text().trim();
            evObj.unitID = '';
            if ($(this).attr('href').match(/UnitID=(\d+)/) != null) {
                evObj.unitID = $(this).attr('href').match(/UnitID=(\d+)/)[1];
            }
            evObj.position = '';
            if (evObj.position = rtxt.match(/[^\n]+/) != null) {
                evObj.position = rtxt.match(/[^\n]+/)[0];
            }
            //console.log(position,unitID);
            $('.mb', this).each(function() {
                evObj.mbs.push($(this).text().trim());
            });
            myPositions.push(JSON.parse(JSON.stringify(evObj)));
        }
    });

}

//mbc
function getScoutsFromProfile(attemptRefresh, actionType) {

    MBCdata = [];
    var evObj = {
        name: '',
        id: '',
        img: '',
        unit: '',
        unitid: '',
        mbLst: [],
        link: ''
    };
    var mbObj = {
        mbShortName: '',
        mbid: '',
        mbver: ''
    };
    var mbText = [];
    var mbunitid;
    //var troop =$('title').text();
    //alert(troop);
    // need to get my connections to build scout list of scouts that user has approve merit badge capability for
    //var unitID = $('base')[0].href.match(/\d+/)[0];
    $.mobile.loading('show', {
        theme: 'a',
        text: 'Loading...',
        textonly: false
    });

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, mbcApprMbError, ['getScoutsFromProfile status=' + this.status], getScoutsFromProfile, [attemptRefresh, actionType]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            //console.log(this);	
            MBCdata.length = 0;
            $('div [data-role="content"] >ul >li > div[style*="margin-left"]', this.response).each(function() {

                evObj = {
                    name: '',
                    id: '',
                    img: '',
                    unit: '',
                    unitid: '',
                    mbLst: [],
                    link: ''
                };
                //console.log($('a',this)[0].textContent + ' ' + $('a',this).attr('href') + ' ' + $('.permission',this)[0].textContent + ' ' + $('.orangeSmall',this)[0].textContent);
                var txtUnit = $('.orangeSmall', this)[0].textContent;

                if (txtUnit.trim() != '') {
                    if ($('.mb.permission', this)[0] != undefined) {
                        var p = $(this).parent();
                        evObj.img = $('img', p).attr('src');
                        evObj.id = '';
                        if ($('a', this).attr('href').match(/\d+/) != null) {
                            evObj.id = $('a', this).attr('href').match(/\d+/)[0];
                        }
                        evObj.link = $('a', this).attr('href');
                        //console.log($('a',this).attr('href'));
                        evObj.name = localDataFilter(' ' + $('a', this)[0].textContent.trim() + ' ', '', 'local').trim();
                        evObj.unit = txtUnit.split(',')[0].trim(); // may be more than one unit.

                        // get the unit id
                        var unitBlk;
                        for (i = 1; i < $('div.ui-block-b ul li').length; i++) {
                            unitBlk = $('div.ui-block-b ul li')[i];
                            // each li contains unit data
                            mbunitid = '';
                            if ($('a[href*="/mobile/dashboard/admin/unit.asp"]', unitBlk).attr('href').match(/\d+/) != null) {
                                mbunitid = $('a[href*="/mobile/dashboard/admin/unit.asp"]', unitBlk).attr('href').match(/\d+/)[0];
                            }
                            mbunitname = $('a[href*="/mobile/dashboard/admin/unit.asp"]', unitBlk).text().trim(); //Troop xxx chartered org name
                            if (mbunitname.indexOf(evObj.unit) != -1) {
                                evObj.unitid = mbunitid;
                            }
                        }

                        if (evObj.name.match(/ACCOUNT,/) == null) {
                            evObj.mbLst = [];
                            //console.log(txtUnit.trim() + ' '+$('a',this)[0].textContent.trim());
                            for (var i = 0; i < $('.mb.permission', this).length; i++) {
                                //console.log($('.mb.permission',this)[i].textContent);
                                mbObj.mbShortName = '';
                                if ($('.mb.permission', this)[i].textContent.match(/Approve (.+?) MB/) != null) {
                                    mbObj.mbShortName = $('.mb.permission', this)[i].textContent.match(/Approve (.+?) MB/)[1];
                                }
                                evObj.mbLst.push(JSON.parse(JSON.stringify(mbObj)));
                            }
                            MBCdata.push(JSON.parse(JSON.stringify(evObj)));
                        }
                    }
                }


            });
            //console.log(evObj);				
            //alert (evObj);   ---------------  Below code was workaround
            /*var sunitid='';
            var img='';
            var sid='';
            var unit='';
            var link='';
            var name='';
            var unitScoutList=[];
            var dashunit='';
            				

            $('a[href*="ScoutUserID="]',this.response).each(function () {
            	unittx=$(this).parent().find('.orangeSmall').text().trim();  // this is the Scout's unit, might be multiple units
            	sid=$(this).attr('href').match(/ScoutUserID=(\d+)/)[1];
            	link=$(this).attr('href');
            	name=$(this).text();
            	var p = $(this).parent().parent();
            	img= $('img',p).attr('src');
            	unit='';
            	if(unittx != '') {
            		if (name.match(/ACCOUNT,/) == null) {		// speed it up
            			if(unittx.match(/Pack/) == null) {

            				// Looking through Scout connections, identify which Scouts are in my unit					
            				sunitid='';
            				//now look at our own dashboard to find our connected units and unitids
            				$('a[href*="unit.asp"]').each(function () {
            					dashunit=$(this).attr('data-unitdesc').match(/\S+ \d+/)[0];
            					if (unittx.match(dashunit) != null) {									//This unit on our dashboard matches a Scout unit
            						if (dashunit.match(/Troop/) != null) {
            							// overwrites any crew
            							sunitid=$(this).attr('data-unitid');
            							unit=dashunit;
            						} else {
            							//could be in a crew.  But Crew Scouts must be in a Troop??
            							if(unit=='') {
            								sunitid=$(this).attr('data-unitid');
            								unit=dashunit;										
            							}
            						}
            					}
            				});
            				var idmatch=false;
            				if(sunitid != '') {
            					//If the Scoutid is already there, don't duplicate
            					for(var x=0;x<MBCdata.length;x++) {
            						if(MBCdata[x].id == sid) {
            							idmatch=true;
            							break;
            						}
            					}
            					if(idmatch==false) {
            						unitScoutList.push({name:name,scoutid:sid,unitid:sunitid,img:img,haveconn:false,unit:unit, link:link});					
            					}
            				}
            			}
            		}
            	}
            });
            

            
            if(unitScoutList.length==0) {
            	$.mobile.loading('hide');
            	if(MBCdata.length==0 ){
            		alert('No Scout Connections identifying your Merit Badges were found in My Account -> My Profile -> My Connections.');
            		return;
            	}	
            	
            	matchMBsact(actionType);
            } else {
            	//$.mobile.loading('show', { theme: 'a', text: 'Loading...', textonly: false });
            	whoAmIAdult(iterateUnitScouts,{unitScoutList:unitScoutList,actiontype:actionType},mbcError_to_dash_w_msg,['WhoAmIAdult function error'])
            	//iterateUnitScouts(unitScoutList);   // First of the year bugs with Scoutbook. When fixed, revert back to V040.0.4 ?? This worked before but th My Connections page is messed up so need to exec whAmiIAdult now
            }*/
            /* *** start original code ********* */
            if (MBCdata.length == 0 && attemptRefresh == false) {
                // There don't appear to be any connected scouts for a MB.  There is a SB bug that removes them.  Will try to refresh the list and try again.
                // However, refresh only once.
                refreshConnections(actionType);
                return;
            }

            //now call  meritbadgequickentry2.asp to get MB Names that match the names in the object, and to get associated MB IDs
            matchMBsact(actionType);

            /* ***********end original code   *** */
        }
    };
    //https://www.scoutbook.com/mobile/dashboard/admin/adultconnections.asp
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/adultconnections.asp';


    xhttp.open("GET", url, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, mbcApprMbError, ['getScoutsFromProfile terminal'], getScoutsFromProfile, [attemptRefresh, actionType]);
    };
}


// look for adult text name connection.  If found, drill into it to get the mbs
function iterateUnitScouts(argObj) {
    //argObj.unitScoutList
    //unitScoutList,unitID,adultTextName
    //argObj.Iam.firstname  etc

    var unitid = '';
    var scoutid = '';
    for (var i = 0; i < argObj.unitScoutList.length; i++) {
        if (argObj.unitScoutList[i].haveconn == false) {
            unitid = argObj.unitScoutList[i].unitid;
            scoutid = argObj.unitScoutList[i].scoutid;
            break;
        }
    }

    if (scoutid == '') {
        //alert('cb point');
        $.mobile.loading('hide');
        matchMBsact(argObj.actiontype);
        return;
    }
    //https://www.scoutbook.com/mobile/dashboard/admin/connections.asp?ScoutUserID=2070619&UnitID=31097&DenID=&PatrolID=57935
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, mbcApprMbError, ['iterateUnitScouts status=' + this.status], iterateUnitScouts, [argObj]);
            return;
        }

        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            //find adult amtching name.  On match, get url
            var url = ''
            $('a[href*="ConnectionID="]', this.response).each(function() {
                if ($(this).text().trim().match(/[^\n]+/)[0].trim() == argObj.Iam.firstname + ' ' + argObj.Iam.lastname) {
                    url = $(this).attr('href');
                }
            });
            //https://www.scoutbook.com/mobile/dashboard/connection.asp?ScoutUserID=678696&ConnectionID=4205732&UnitID=31097&DenID=&PatrolID="

            //https://www.scoutbook.com/mobile/dashboard/admin/connections.asp?ScoutUserID=678696&UnitID=31097&DenID=&PatrolID=
            if (url == '') {
                //error.  Skip this scout?
                argObj.unitScoutList[i].haveconn = true;
                iterateUnitScouts(argObj);
                return;
            }

            //now get profile
            identifyMBconnection(argObj, i, url);
        }
    }

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connections.asp?ScoutUserID=' + scoutid + '&UnitID=' + unitid + '&DenID=&PatrolID=';
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, mbcApprMbError, ['iterateUnitScouts terminal'], iterateUnitScouts, [argObj]);
    };

}


/*
function errHandle(cbfunc,cb1,cb2,cb3,cb4,cb5,cb6,cb7,cb8) {
		if (servErrCnt > maxErr) {
			 $.mobile.loading('hide');
			alert('Halted due to excessive Server errors');
			return;
		}
		servErrCnt++;
		setTimeout(function() {
			cbfunc(cb1,cb2,cb3,cb4,cb5,cb6,cb7,cb8);
		},1000);	//reset 	
}


function errStatusHandle(status,errfunc,errargs,retryfunc,retryargs) {
		if (status > 399  && status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ status);  //page not found etc.  This is unrecoverable
			if(errfunc != '') {
				window[errfunc.name].apply(null,errargs);
			}
			return;
		}
		if (status > 499) {
			errGenHandle(errfunc,errargs,retryfunc,retryargs);	//server side error - maybe next try will work
			return;
		}	
}

*/
function identifyMBconnection(argObj, i, url) {
    var mbObj = {
        mbShortName: '',
        mbid: '',
        mbver: ''
    };

    var evObj = {
        name: '',
        id: '',
        img: '',
        unit: '',
        unitid: '',
        mbLst: [],
        link: ''
    };

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, cberr, cberrarglst, identifyMBconnection, [argObj, i, url]);
            return;
        }

        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            //unitScoutList.push({name:name,scoutid:sid,unitid:sunitid,img:img,haveconn:false,unit:unit, link:link})
            //console.log(argObj.unitScoutList[i].name);
            var pmid = [];
            var pid = [];
            $('input[name="PermissionApproveMBID"]:checked', this.response).each(function() {
                pmid.push('permissionApproveMBID' + $(this).val());
                pid.push($(this).val());
                //console.log($(this),$('label[for="permissionApprovedMBID'+$(this).val()+'"]',this.response).text().trim());
                //mbShortname=$('label[for="PermissionApprovedMBID'+mbid:$(this).val()+'"]').text().trim();
            });

            for (var j = 0; j < pmid.length; j++) {
                //console.log($('label[for="'+pmid+'"]',this.response).text());
                evObj.mbLst.push({
                    mbShortName: $('label[for="' + pmid[j] + '"]', this.response).text().trim(),
                    mbid: pid[j],
                    mbver: ''
                });
            }

            if (evObj.mbLst.length != 0) {
                evObj.name = argObj.unitScoutList[i].name;
                evObj.id = argObj.unitScoutList[i].scoutid;
                evObj.img = argObj.unitScoutList[i].img;
                evObj.unit = argObj.unitScoutList[i].unit;
                evObj.unitid = argObj.unitScoutList[i].unitid;
                evObj.link = argObj.unitScoutList[i].link;
                MBCdata.push(JSON.parse(JSON.stringify(evObj)));
            }

            //when finished loading up 
            argObj.unitScoutList[i].haveconn = true;
            iterateUnitScouts(argObj);
        }
    }
    //<input type="checkbox" data-theme="d" name="PermissionApproveMBID" id="permissionApproveMBID123" value="123" checked="checked">



    xhttp.open("GET", 'admin/' + url, true);
    xhttp.responseType = "document";
    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, cberr, cberrarglst, identifyMBconnection, [argObj, i, url]);
    };
}


function whoAmIAdult(cb, cbArgObj, cberr, cberrarglst) {
    //need to get profile


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, cberr, cberrarglst, whoAmIAdult, [cb, cbArgObj, cberr, cberrarglst]);
            return;
        }

        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            //now get profile
            getMyProfileInfo(cb, cbArgObj, cberr, cberrarglst);
        }
    }

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/account.asp?';
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, cberr, cberrarglst, whoAmIAdult, [cb, cbArgObj, cberr, cberrarglst]);
    };
}




function getMyProfileInfo(cb, cbArgObj, cberr, cberrarglst) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, cberr, cberrarglst, getMyProfileInfo, [cb, cbArgObj, cberr, cberrarglst]);
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            //save my name
            //var meID={};
            //meID['firstname']=$('#firstName',this.response).val();
            //meID['lastname']=$('#lastName',this.response).val();
            //meID['nickname']=$('#nickName',this.response).val();
            //change page to connectionmanager

            cbArgObj['Iam'] = {
                firstname: $('#firstName', this.response).val(),
                lastname: $('#lastName', this.response).val(),
                nickname: $('#nickName', this.response).val()
            };
            cb(cbArgObj);

        }
    }

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/editprofile.asp?ScoutUserID=&UnitID=&DenID=&PatrolID=';
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, cberr, cberrarglst, getMyProfileInfo, [cb, cbArgObj, cberr, cberrarglst]);
    };
}
//mbc
function refreshConnections(actionType) {
    alert('No Scout Connections identifying your Merit Badges were found in My Account -> My Profile -> My Connections.');
    return;
    // how to refresh...
    //


    // call getScoutsFromProfile() when done
    //setTimeout(function () {getScoutsFromProfile(true);},200);
}
//mbc
function matchMBsact(actionType) {

    var mbname;
    var mbid;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, mbcApprMbError, ['matchMBsact status=' + this.status], matchMBsact, [actionType]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            // get MB Names that match the names in the object, and to get associated MB IDs

            //Each array item in MBCdata has an object with a short mbname in it
            $('#meritBadgeID option', this.response).each(function() {
                mbid = $(this).val();
                mbname = $(this).text();
                for (var i = 0; i < MBCdata.length; i++) {
                    for (var j = 0; j < MBCdata[i].mbLst.length; j++) {
                        if (MBCdata[i].mbLst[j].mbShortName == mbname) {
                            MBCdata[i].mbLst[j].mbid = mbid;
                            break;
                        }
                    }
                }
            });


            //alert('next step.  Have scout list, mbs and mbids, ready to build page');
            if (MBCqeReqFlag == true) {
                //alert('now here');

                // Have list of scouts, know mbids.  Need to know which mbvers there are and which scout has which ver.
                //Could be lengthy
                MBCmeritbadgeReqquickentry();
            } else {
                if (actionType == 'badge') {
                    MBCmeritbadgequickentry(actionType);
                } else if (actionType == 'report') {
                    MBCmeritbadgequickentry(actionType);
                } else if (actionType == 'edit') {
                    MBCmeritbadgequickentry(actionType);
                }
            }
        }
    };

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/advancement/meritbadgequickentry2.asp?UnitID=';
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, mbcApprMbError, ['matchMBsact terminal'], matchMBsact, [actionType]);
    };
}

//mbc
function MBCmeritbadgequickentry(actionType) {
    if (actionType == 'badge') {
        MBCQEMBflag = true;
    } else if (actionType == 'edit') {
        MBCEditFlag = true;
    } else {
        MBCReportFlag = true;
    }

    //nbconsole.log('getting dashboard again in MBCmeritbadgequickentry() ');
    $.mobile.changePage(
        '/mobile/dashboard/', {
            allowSamePageTransition: true,
            transition: 'none',
            showLoadMsg: true,
            reloadPage: true
        }
    );

}

//mbc
function MBCmeritbadgeReqquickentry() {

    $.mobile.changePage(
        '/mobile/dashboard/admin/advancement/meritbadgequickentry2.asp?UnitID=', {
            allowSamePageTransition: true,
            transition: 'none',
            showLoadMsg: true,
            reloadPage: true
        }
    );

}





//mbc
// makes a table with rows for each scout, mbs listed in cols
// needs the number of badges to init the table
function maketable() {

    fulltable.length = 0;
    for (i = 0; i < MBCdata.length; i++) {
        // each row is the scout record
        var arr = [];
        for (var j = 0; j < uniqlist.length; j++) {
            arr[j] = 0;
        }
        for (var k = 0; k < MBCdata[i].mbLst.length; k++) {
            arr[MBCdata[i].mbLst[k].pos] = 1;
        }
        fulltable.push(arr);
    }


    //in page, can determine which rows and columns are selected	
}


//mbc
function calctable(y, row, col, rrow, rcol) {

    //if multiple checked rows, find columns that are the same in all
    //if multiple checked columns find the rows that are the same in all

    //if only one checked row find any column it contains
    //if only one checked column find any row it contains

    //if no checked rows allow any column
    //if no checked columns allow any row

    var rowlen = y.length;
    var collen = y[0].length;
    for (var r = 0; r < rowlen; r++) {
        var l = '';
        for (var c = 0; c < collen; c++) {
            l += y[r][c] + ' ';
        }
        //console.log(l);	
    }
    rcol.length = 0;
    rrow.length = 0;
    for (var i = 0; i < collen; i++) {
        rcol[i] = 1;
    }
    for (var i = 0; i < rowlen; i++) {
        rrow[i] = 1;
    }

    var numcolchecks = 0;
    for (var i = 0; i < col.length; i++) {
        if (col[i] == 1) {
            numcolchecks += 1;
        }
    }
    var numrowchecks = 0;
    for (var i = 0; i < col.length; i++) {
        if (row[i] == 1) {
            numrowchecks += 1;
        }
    }




    //if multiple checked columns find the rows that are the same in all
    //if only one checked column find any row it contains
    //if no checked columns allow any row
    for (var r = 0; r < rowlen; r++) {
        for (var c = 0; c < collen; c++) {
            if (col[c] == 1) {
                // column of interest
                if (y[r][c] == 0) {
                    rrow[r] = 0;
                }
            }
        }
    }

    for (var c = 0; c < collen; c++) {
        for (var r = 0; r < rowlen; r++) {
            //console.log('r='+r+' c='+c+' '+y[r][c]+ ' ' + row[r];);
            if (row[r] == 1) {
                // row of interest
                //console.log('r='+r+' c='+c+' '+y[r][c]);
                if (y[r][c] == 0) {
                    rcol[c] = 0;
                }
            }
        }
    }

    /*
    var restxt='result row=';
    for(i=0;i<rrow.length;i++) {
    resttxt +=rrow[i] + ' ';
    }
    console.log(restxt);
    var restxt='result col=';
    for(i=0;i<rcol.length;i++) {
    resttxt +=rcol[i] + ' ';
    }
    console.log(restxt);
    */


    if (numrowchecks > 0) {
        // recalc first list for avail rows
        for (var r = 0; r < rowlen; r++) {
            if (rrow[r] == 1) {
                // if this row
                for (var c = 0; c < collen; c++) {
                    if (rcol[c] == 1) {
                        // column of interest
                        if (y[r][c] == 0) {
                            rrow[r] = 0;
                        }
                    }
                }
            }
        }
    }

    if (numcolchecks > 0) {
        for (var c = 0; c < collen; c++) {
            if (rcol[c] == 1) {
                // if this col
                for (var r = 0; r < rowlen; r++) {
                    if (rrow[r] == 1) {
                        // column of interest
                        if (y[r][c] == 0) {
                            rcol[c] = 0;
                        }
                    }
                }
            }
        }
    }

    //console.log('input');
    //console.log(row);
    //console.log(col);


    var restxt = 'result row=';
    for (i = 0; i < rrow.length; i++) {
        restxt += rrow[i] + ' ';
    }
    //console.log(restxt);
    var restxt = 'result col=';
    for (i = 0; i < rcol.length; i++) {
        restxt += rcol[i] + ' ';
    }
    //console.log(restxt);




    var l = '[ ] ';
    for (var c = 0; c < collen; c++) {
        l += '[' + rcol[c] + ']' + ' ';
    }
    //console.log(l);
    for (var r = 0; r < rowlen; r++) {
        var l = '[' + rrow[r] + ']  ';
        for (var c = 0; c < collen; c++) {
            l += y[r][c] + '   ';
        }
        //console.log(l);	
    }

}



function repgetmyunits() {
    $.mobile.loading('show', {
        theme: 'a',
        text: 'Loading...',
        textonly: false
    });
    var userchildren = [];
    var units = [];
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, '', [], repgetmyunits, []);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            $('a[href*="account.asp?ScoutUserID="]', this.response).each(function() {
                if ($(this).attr('href').match(/ScoutUserID=(\d+)/) != null) {
                    userchildren.push($(this).attr('href').match(/ScoutUserID=(\d+)/)[1]);
                }
            });


            if (userchildren.length == 0) {
                //go to my positions to see what units I am a leader in
                mypositionunitsrep(units);
            } else {
                //go to scout accounts to see what units they are in
                getchildunitsrep(userchildren, units);
            }

        }
    };

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/';

    xhttp.open("GET", url, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, '', [], repgetmyunits, []);
    };
}

function getchildunitsrep(userchildren, units) {


    if (userchildren.length == 0) {
        //go to my positions to see what units I am a leader in
        mypositionunitsrep(units);
        return;
    }
    var id;
    var found = false;
    var scoutid = userchildren[0];
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, '', [], getchildunitsrep, [userchildren, units]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            $('input[name="UnitID"]', this.response).each(function() {
                id = $(this).attr('id');
                pushUnique(units, $('label[for="' + id + '"]', this).text());
                found = true;
            });

            if (found == false) {
                pushUnique(units, $('#goToUnit', this.response).text());
            }
            userchildren.shift();
            getchildunitsrep(userchildren, units);
        }
    };

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/account.asp?ScoutUserID=' + scoutid;

    xhttp.open("GET", url, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, '', [], getchildunitsrep, [userchildren, units]);
    };
}

function mypositionunitsrep(units) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, mbcError_to_dash_w_msg, ['mypositionunitsrep'], mypositionunitsrep, [units]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            $('a[href*="position.asp?UserPositionID="]', this.response).each(function() {
                var rtxt = $(this).text().trim();
                if (rtxt.match(/[a-zA-Z]{3} [\d]+, [\d]+ -/) == null) {
                    if ($(this).attr('href').match(/UnitID=(\d+)/) != null) {
                        pushUnique(units, $('.orangeSmall', this).text().trim());
                    }
                }
            });

            //Have units
            mbScoutsNotMyUnitRep(units);
        }
    };

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/positions.asp?UnitID=';

    xhttp.open("GET", url, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, mbcError_to_dash_w_msg, ['mypositionunitsrep'], mypositionunitsrep, [units]);
    };
}

function mbScoutsNotMyUnitRep(units) {


    var parDiv;
    var thisscout;
    var mbid;
    var mbtxt;
    var mbScouts = [];
    var mblist = [];


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, mbcError_to_dash_w_msg, ['mbScoutsNotMyUnitRep'], mbScoutsNotMyUnitRep, [units]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            $('a[href*="ScoutUserID="]', this.response).each(function() {
                if ($(this).attr('href').match(/ScoutUserID=(\d+)/) != null) {
                    thisscout = $(this).attr('href').match(/ScoutUserID=(\d+)/)[1];
                    parDiv = $(this).parent();
                    mblist = [];
                    if ($('.orangeSmall', parDiv).text().trim() != '') {
                        if (testUnique(units, $('.orangeSmall', parDiv).text().trim()) == false) {
                            //not in unit
                            $('div.mb.permission', parDiv).each(function() {
                                //save this scout, need to go to scouts account to find status
                                mbid = $(this).attr('data-meritbadgeid')
                                mbtxt = $(this).text().trim();
                                mblist.push({
                                    mbid: mbid,
                                    mbtxt: mbtxt
                                });
                            });
                            if (mblist.length != 0) {
                                mbScouts.push({
                                    id: thisscout,
                                    mbopen: false,
                                    checked: false,
                                    mblist: mblist
                                });
                            }
                        }
                    }
                }
            });

            // iterate through these scout accounts
            //console.log(counselorApprvLst); //- all scouts with the badge
            //console.log(mbScouts);		// outside the unit scouts

            for (var i = 0; i < counselorApprvLst.length; i++) {
                counselorApprvLst[i]['InUnit'] = true;
                counselorApprvLst[i]['Status'] = false;
                for (var j = 0; j < mbScouts.length; j++) {
                    if (counselorApprvLst[i].scoutid == mbScouts[j].id) {
                        counselorApprvLst[i]['InUnit'] = false;
                        break;
                    }
                }
            }

            getInUnitMbStat();
        }
    };

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/adultconnections.asp';

    xhttp.open("GET", url, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, mbcError_to_dash_w_msg, ['mbScoutsNotMyUnitRep'], mbScoutsNotMyUnitRep, [units]);
    };
}

function getInUnitMbStat() {

    var thisscout = '';
    var i = 0;
    for (i = 0; i < counselorApprvLst.length; i++) {
        if (counselorApprvLst[i].Status == false) { //&& counselorApprvLst[i].InUnit==true
            thisscout = counselorApprvLst[i].scoutid;
            break;
        }
    }
    if (thisscout == '') {
        //done processing InUnit scouts, process external unit scouts next
        //reset status on out of unit connections so they can be tried again
        for (i = 0; i < counselorApprvLst.length; i++) {
            if (counselorApprvLst[i].InUnit == false) {
                counselorApprvLst[i].Status = false;
            }

        }
        getOutUnitMbStat();

        return;
    }



    var thismbid;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, mbcError_to_dash_w_msg, ['getInUnitMbStat'], getInUnitMbStat, []);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            counselorApprvLst[i]['mbref'] = [];
            //add urls for each mbid
            for (j = 0; j < counselorApprvLst[i].mbid.length; j++) {
                thismbid = counselorApprvLst[i].mbid[j];
                if ($('a[href*="MeritBadgeID=' + thismbid + '"]', this.response).length != 0) {
                    counselorApprvLst[i]['mbref'].push({
                        href: $('a[href*="MeritBadgeID=' + thismbid + '"]', this.response).attr('href'),
                        reqs: []
                    });
                }
            }

            counselorApprvLst[i].Status = true;
            getInUnitMbStat();
        }
    };






    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/advancement/default.asp?ScoutUserID=' + thisscout + '&UnitID=&DenID=&PatrolID=';

    xhttp.open("GET", url, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, mbcError_to_dash_w_msg, ['getInUnitMbStat'], getInUnitMbStat, []);
    };







}

function getOutUnitMbStat() {
    var thisscout = '';
    var i = 0;
    for (i = 0; i < counselorApprvLst.length; i++) {
        if (counselorApprvLst[i].Status == false && counselorApprvLst[i].InUnit == false && counselorApprvLst[i]['mbref'].length == 0) {
            thisscout = counselorApprvLst[i].scoutid;
            break;
        }
    }
    if (thisscout == '') {
        //done processing OutUnit scouts,start pulling data from mb pages next
        //console.log(counselorApprvLst);
        //alert('nxt');
        getMBCReqStats();
        //$.mobile.loading('hide');
        return;
    }



    var thismbid;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, mbcError_to_dash_w_msg, ['getOutUnitMbStat'], getOutUnitMbStat, []);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            counselorApprvLst[i]['mbref'] = [];
            //add urls for each mbid
            for (j = 0; j < counselorApprvLst[i].mbid.length; j++) {
                thismbid = counselorApprvLst[i].mbid[j];
                if ($('a[href*="MeritBadgeID=' + thismbid + '"]', this.response).length != 0) {
                    counselorApprvLst[i]['mbref'].push({
                        href: $('a[href*="MeritBadgeID=' + thismbid + '"]', this.response).attr('href'),
                        reqs: [],
                        mbname: '',
                        mbvertext: ''
                    });
                }
            }

            counselorApprvLst[i].Status = true;
            getOutUnitMbStat();
        }
    };





    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/account.asp?ScoutUserID=' + thisscout;

    xhttp.open("GET", url, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, mbcError_to_dash_w_msg, ['getOutUnitMbStat'], getOutUnitMbStat, []);
    };


}

function getMBCReqStats() {
    var i = 0;
    var j = 0;
    var found = false;
    for (i = 0; i < counselorApprvLst.length; i++) {
        for (j = 0; j < counselorApprvLst[i].mbref.length; j++) {
            if (counselorApprvLst[i].mbref[j].reqs.length == 0) {
                found = true;
                break;
            }
        }
        if (found == true) {
            break;
        };


    }

    if (found == false) {
        //done collecting
        //console.log(counselorApprvLst);
        buildMBCHTMLReport();
        // Next, build html table
        return;
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, mbcError_to_dash_w_msg, ['getMBCReqStats'], getMBCReqStats, []);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            //load up the reqs
            counselorApprvLst[i].mbref[j].mbname = '';
            if ($('title', this.response).text().match(/- (.+)/) != null) {
                counselorApprvLst[i].mbref[j].mbname = $('title', this.response).text().match(/- (.+)/)[1];
            }



            $('li[data-role="list-divider"]', this.response).each(function() {
                if ($(this).text().match(/Requirements (.+)/) != null) {
                    counselorApprvLst[i].mbref[j].mbvertxt = $(this).text().match(/Requirements (.+)/)[1].trim();
                }
            })


            counselorApprvLst[i].mbref[j].reqs.push({
                src: $('#mbCompletedLI img', this.response).attr('src'),
                txt: 'Status'
            })


            $('a.checkboxHREF', this.response).each(function() {
                //console.log($('img',this).attr('src'), $(this).parent().text().trim());
                counselorApprvLst[i].mbref[j].reqs.push({
                    src: $('img', this).attr('src'),
                    txt: $(this).parent().text().trim()
                })
            });



            getMBCReqStats();
        }
    };


    var url = 'https://' + host + 'scoutbook.com' + counselorApprvLst[i].mbref[j].href;

    xhttp.open("GET", url, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, mbcError_to_dash_w_msg, ['getMBCReqStats'], getMBCReqStats, []);
    };

}

var mbcRptHTML = '';

function buildMBCHTMLReport() {
    //lots of sorting

    //scoutname
    var specfound = false;
    var scoutfound = false;
    var i = 0;
    var j = 0;
    var found = false;
    var scoutNames = [];
    var mbNameVers = [];
    for (i = 0; i < counselorApprvLst.length; i++) {

        pushUnique(scoutNames, counselorApprvLst[i].scoutname);

        for (j = 0; j < counselorApprvLst[i].mbref.length; j++) {
            pushUnique(mbNameVers, counselorApprvLst[i].mbref[j].mbname + '-' + counselorApprvLst[i].mbref[j].mbvertxt);
        }
    }
    scoutNames.sort();
    mbNameVers.sort();
    //console.log(scoutNames);
    //console.log(mbNameVers);

    var thismb;
    mbcRptHTML = '<div>\n'; // id="scrollwrapper" class="scrollable-table" style="height:153px;">\n';
    mbcRptHTML += '<table class="table table-striped table-header-rotated" style="transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1); transition-duration: 0ms; transform: translate(0px, 0px) translateZ(0px);">\n';
    mbcRptHTML += '<thead>\n';
    mbcRptHTML += '<tr>\n';
    mbcRptHTML += '<th></th>\n';
    for (i = 0; i < scoutNames.length; i++) {
        mbcRptHTML += '<th class="column criterion rotate-45"><div><span class="text-orange">' + scoutNames[i] + '</div></th>\n';
    }
    mbcRptHTML += '</tr>\n';
    mbcRptHTML += '</thead>\n';
    mbcRptHTML += '<tbody>\n';
    var a;
    for (a = 0; a < mbNameVers.length; a++) {
        mbcRptHTML += '<tr><th>' + mbNameVers[a] + '</th>\n';
        thismb = mbNameVers[a];
        for (var b = 0; b < scoutNames.length; b++) {
            mbcRptHTML += '<td></td>\n'; //fill in rest of row
        }

        mbcRptHTML += '</tr>\n';

        // 1st column is a req#.  How many req#s?  Find a set
        found = false;
        for (i = 0; i < counselorApprvLst.length; i++) {
            for (j = 0; j < counselorApprvLst[i].mbref.length; j++) {
                if (counselorApprvLst[i].mbref[j].mbname + '-' + counselorApprvLst[i].mbref[j].mbvertxt == thismb) {
                    //found one
                    found = true;
                    break;
                }
            }
            if (found == true) {
                break;
            }
        }
        //i and j are pointing to a scout with the mb and mbver of interest so we can extract the mr req names

        for (var k = 0; k < counselorApprvLst[i].mbref[j].reqs.length; k++) {
            //k is the 
            mbcRptHTML += '<tr >\n'; //style="background-color: rgb(245, 245, 245);"
            mbcRptHTML += '<th>' + counselorApprvLst[i].mbref[j].reqs[k].txt + '</th>\n';

            //now for each scout, for this mb and ver

            for (var l = 0; l < scoutNames.length; l++) {
                // need to find this scout's record
                scoutfound = false;
                for (var m = 0; m < counselorApprvLst.length; m++) {
                    if (scoutNames[l] == counselorApprvLst[m].scoutname) {
                        specfound = false;
                        for (var n = 0; n < counselorApprvLst[m].mbref.length; n++) {
                            if (counselorApprvLst[m].mbref[n].mbname + '-' + counselorApprvLst[m].mbref[n].mbvertxt == thismb) {
                                mbcRptHTML += '<td><img src="' + counselorApprvLst[m].mbref[n].reqs[k].src + '" class="checkboxIcon"></td>\n';
                                // get the reqval which is k
                                specfound = true;
                                scoutfound = true;
                                break;
                            }
                        }
                        if (specfound == false) {
                            //same scout, diff mb or mbver
                            //mbcRptHTML+= 	'<td></td>\n';
                        }
                    } else {
                        //not the same scout or mbver
                        //mbcRptHTML+= 	'<td></td>\n';
                    }
                }
                if (scoutfound == false) {
                    mbcRptHTML += '<td ></td>\n';
                }

            }

            mbcRptHTML += '</tr>\n';
        }
    }
    mbcRptHTML += '</tbody>\n';
    mbcRptHTML += '</table>\n';
    mbcRptHTML += '</div>\n';



    MBCRpt = true;

    $.mobile.changePage(
        '/mobile/dashboard/', {
            allowSamePageTransition: true,
            transition: 'none',
            showLoadMsg: true,
            reloadPage: true
        }
    );
}

function setMBCReportPageContent(unitID, txtunit) {
    MBCRpt = false;
    var newdata = '';
    var offs = {
        acctOffset: -1
    };



    newdata += '		<div data-role="content" class="ui-content printcontent">';
    newdata += '			<ul data-role="listview" data-theme="d" data-inset="true">'; //theme d white  inset means inside a border 
    newdata += '				<li id="mbcrptLI" data-theme="d">';
    newdata += '				  <div id="mbTable">\n';

    newdata += mbcRptHTML;
    newdata += '				  </div>';
    newdata += '				</li>';
    newdata += '			</ul>';
    newdata += '		</div>'; //data-role content

    newdata += '		<div data-role="popup" id="errorPopup" data-overlay-theme="a" class="ui-content" data-theme="e" data-transition="fade">';
    newdata += '			<a href="#" id="closePopupButton" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>';
    newdata += '			<div id="errorPopupIcon"></div>';
    newdata += '			<div id="errorPopupContent"></div>';
    newdata += '			<div class="clearRight"></div>';
    newdata += '		</div>';

    newdata += '		<div id="footer" align="center">';
    newdata += '			<div style="margin-top: 6px;">&copy; ' + escapeHTML(cyear()) + '- Boy Scouts of America &bull; <a href="/mobile/help/privacy.asp">Privacy</a></div>';
    newdata += '			<div><a href="/" data-ajax="false"><img src="https://d1kn0x9vzr5n76.cloudfront.net/mobile/images/scoutbookbsalogo400.png" width="200"></a></div>';
    newdata += '		</div>';

    return newdata;
}



/*

				<span style="display: inline-block; width: 20px; height: 20px; margin-right: 22px; position: relative; ">
					<a id="goBack" href="#" data-rel="back" data-direction="reverse"><img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/back100bsa.png" style="position: absolute; top: -4px; left: 0px; width: 20px; padding: 8px; " title="Go Back" /></a>
				</span>
				
					<span style="display: inline-block; width: 20px; height: 20px; margin-right: 24px; position: relative; ">
						<a id="goHome" href="/mobile/" data-transition="slide" data-direction="reverse"><img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/home100bsa.png" style="position: absolute; top: -4px; left: 0px; height: 20px; padding: 7px; " title="Go Home" /></a>
					</span>	




======

				<span style="display: inline-block; width: 20px; height: 20px; margin-right: 22px; position: relative; ">
					<a id="goBack" href="#" data-rel="back" data-direction="reverse"><img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/back100bsa.png" style="position: absolute; top: -4px; left: 0px; width: 20px; padding: 8px; " title="Go Back" /></a>
				</span>
				
					<span style="display: inline-block; width: 20px; height: 20px; margin-right: 24px; position: relative; ">
						<a id="goHome" href="/mobile/" data-transition="slide" data-direction="reverse"><img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/home100bsa.png" style="position: absolute; top: -4px; left: 0px; height: 20px; padding: 7px; " title="Go Home" /></a>
					</span>	
					
					
					<span style="display: inline-block; width: 20px; height: 20px; margin-right: 22px; position: relative; ">
						<a id="myDashboard" href="/mobile/dashboard/" data-transition="slide" data-direction="reverse"><img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/dashboardbsa100.png" style="position: absolute; top: -4px; left: 0px; height: 20px; padding: 7px; " title="My Dashboard" /></a>
					</span>	
					
					*/

function addRawGeneralDashReport(data, pageid, title, content) {
    var startfunc;
    var endfunct;
    var newdata;

    data = data.replace(/"topHeader/, '"topHeader noprint');

    startfunc = data.indexOf("$('#buttonRefresh'", 1);

    startfunc = data.indexOf('<span style="margin-left: 5px; ">', 1); // span right before title
    endfunct = data.indexOf('</h1>', 1);

    newdata = data.slice(0, startfunc);


    newdata += '				<span style="display: inline-block; width: 20px; height: 20px; margin-right: 22px; position: relative; ">\n';
    newdata += '					<a id="myDash" href="#" data-direction="reverse"><img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/dashboardbsa100.png" style="position: absolute; top: -4px; left: 0px; height: 20px; padding: 7px; " title="My Dashboard" /></a>\n';
    newdata += '				</span>	\n';

    newdata += '<span style="margin-left: 5px; ">';



    //836

    newdata += title;
    newdata += '</span>';


    newdata += data.slice(endfunct);

    data = newdata;

    startfunc = data.indexOf('<a id="goBack"', 1);
    endfunct = data.indexOf('<img src', startfunc);

    myfunc = '<a href="#" id="buttonRefresh2" >';
    newdata = data.slice(0, startfunc) + myfunc + '\n' + data.slice(endfunct);
    data = newdata;

    // replace content
    startfunc = data.indexOf('<div data-role="content">');
    endfunct = data.indexOf('</div><!-- /content -->');
    newdata = data.slice(0, startfunc);


    newdata += content;
    newdata += '<!-- end content insert -->\n';
    newdata += data.slice(endfunct + 23);
    data = newdata;

    endfunct = data.indexOf('<!-- end content insert -->');
    var StyleAndScript = endfunct + 27;

    //now find end of script

    /*
    	
    </div><!-- /content -->
    <style type="text/css">
    </style>
    <script type="text/javascript">	
    </script>
    */
    var scriptloc = endfunct;
    endfunct = data.indexOf('</script>', scriptloc);
    endfunct += 9;
    //add style

    newdata = data.slice(0, StyleAndScript);
    newdata += '	<style type="text/css">';
    /*
	//newdata += '		#Page' + escapeHTML(pageid) +' .checkboxIcon								{ width: 20px; position: relative; margin: 0; padding: 0; left: 0; top: 5px; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' .ui-select .ui-btn-icon-right .ui-btn-inner	{ padding-left: 10px; padding-right: 35px; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' .ui-select .ui-btn-icon-right .ui-icon		{ right: 10px; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' #popupDeleteLog								{ max-width: 400px; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' .smallText		{ color: gray; margin-top: 15px; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' img.imageSmall	{ position: relative; width: 30px; height: 30px; top: -5px; border: 1px solid gray; }\n';

	newdata += '		#Page' + escapeHTML(pageid) +" .divider				{ margin-left: 30px; color: #5f5f5f !important; font-family: 'Roboto Slab', serif !important; }\n";
	newdata += '		#Page' + escapeHTML(pageid) +' .divider:hover,\n';
	newdata += '		#Page' + escapeHTML(pageid) +' .dividerImage:hover		{ cursor: pointer; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' .dividerImage			{ position: absolute; top: 11px; left: 12px; height: 22px; }\n';	

	newdata += '	@media (min-width: 40em) {\n';
	newdata += '		#Page' + escapeHTML(pageid) +' .ui-grid-a .ui-block-a	{ padding-right: 8px; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' .ui-grid-a .ui-block-b	{ padding-left: 8px; }\n';
	newdata += '	}\n';

	newdata += '	@media all and (max-width: 40em) {\n';
	newdata += '		#Page' + escapeHTML(pageid) +' .ui-grid-a .ui-block-a,\n';
	newdata += '		#Page' + escapeHTML(pageid) +' .ui-grid-a .ui-block-b {\n';
	newdata += '			width: 100%;\n';
	newdata += '			float:none;\n';
	newdata += '		}\n';
	newdata += '	}\n';	

	newdata += '   @media screen {\n';
	newdata += '		.printonly {\n';
	newdata += '			display:none;\n';	
	newdata += '		}\n';
	newdata += '	}\n';	
	
	
	newdata += '	@media print  {\n';
	newdata += '			@page { width:8.5in !important; margin:0 !important}\n';
	newdata += '		div {  font-size:x-small;}';
	newdata += '		table {  font-size:x-small;}';	
	newdata += '		.pgbreaka {page-break-after: always;}\n';
	newdata += '		.pgbreakb {page-break-before: always;}\n';
	newdata += '		body { \n';

	newdata += '		    width:8.5in !important;\n';
	newdata += '			width:100%; height:100%;\n';

	newdata += '			@page { width:8.5in !important; margin:0 !important}\n';
	newdata += '		}\n';
	
	newdata += '		width:8.5in !important;\n';	
	newdata += '		device-width:8.5in !important;\n';
	newdata += '		min-device-width:8.5in !important;\n';	
	newdata += '		.printcontent {\n';
	newdata += '			width:8.5in;\n';	
	newdata += '		}\n';	

	newdata += '			.ui-listview .ui-listview-inset .ui-corner-all .ui-shadow { width:8in }\n';
	
	newdata += '		.noprint {\n';
	newdata += '			display:none;\n';	
	newdata += '		}\n';
	
	newdata += '		.seeprint {\n';
	newdata += '			display:block;\n';	
	newdata += '		}\n';	
	
	
	newdata += '	}\n';		
	
	
	
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
	newdata += '		#Page' + escapeHTML(pageid) +' div.ui-checkbox { width: 160px; }\n';	

    */


    newdata += '		#Page' + escapeHTML(pageid) + ' th.row-header								{ font-size: 12px; font-weight: normal; min-width: 120px; max-width: 160px; overflow: hidden; text-overflow: ellipsis; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' .table										{ border-collapse: collapse; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' .table-header-rotated th.row-header	{ width: auto; padding: 0 5px; height: 30px; line-height: 30px; white-space: nowrap; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' .table-header-rotated tbody td		{ font-weight: normal; font-size: 12px; height: 30px; line-height: 30px; white-space: nowrap; padding: 0 3px; }\n';

    newdata += '		#Page' + escapeHTML(pageid) + ' .checkboxIcon								{ width: 20px; position: relative; margin: 0; padding: 0; left: 0; top: 5px; }\n';

    newdata += '		#Page' + escapeHTML(pageid) + ' .scoutIcon									{ position: relative; top: 5px; width: 30px; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' .borderTop th, #Page' + escapeHTML(pageid) + ' .borderTop td { border-top: 5px solid #DDD; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' .light										{ color: #b9b9b9; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' .emblemImage								{ max-width: 30px; max-height: 30px; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' .emblemImage2								{ max-width: 25px; max-height: 25px; margin-top: 3px; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' .borderNone									{ border-left: none; border-right: none; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' .floatRight2								{ float: right; margin-right: 3px; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' .floatLeft2									{ float: left; margin-left: 3px; }\n';
    newdata += '		#Page' + escapeHTML(pageid) + ' .light										{ color: #DDD; }\n';

    newdata += '		#Page' + escapeHTML(pageid) + ' #scrollWrapper {\n';
    newdata += '		position: relative;\n';
    newdata += '	z-index: 1;\n';
    newdata += '	background: white;\n';
    newdata += '	overflow: hidden;\n';
    newdata += '		-ms-touch-action: none;\n';
    newdata += '	padding-bottom: 1em; \n';
    newdata += '}\n';

    newdata += '		#Page' + escapeHTML(pageid) + ' #scroller {\n';
    newdata += '	margin-right: 30px;\n';
    newdata += '	border-collapse: collapse;\n';
    newdata += '	position: absolute;\n';
    newdata += '	z-index: 1;\n';
    newdata += '	-webkit-tap-highlight-color: rgba(0,0,0,0);\n';
    newdata += '	-webkit-transform: translateZ(0);\n';
    newdata += '	-moz-transform: translateZ(0);\n';
    newdata += '	-ms-transform: translateZ(0);\n';
    newdata += '	-o-transform: translateZ(0);\n';
    newdata += '	transform: translateZ(0);\n';
    newdata += '	-webkit-touch-callout: none;\n';
    newdata += '	-webkit-user-select: none;\n';
    newdata += '	-moz-user-select: none;\n';
    newdata += '	-ms-user-select: none;\n';
    newdata += '	user-select: none;\n';
    newdata += '	-webkit-text-size-adjust: none;\n';
    newdata += '	-moz-text-size-adjust: none;\n';
    newdata += '	-ms-text-size-adjust: none;\n';
    newdata += '	-o-text-size-adjust: none;\n';
    newdata += '	text-size-adjust: none;\n';
    newdata += '	text-shadow: none;\n';
    newdata += '}\n';

    newdata += '		#Page' + escapeHTML(pageid) + ' .table-header-rotated td {\n';
    newdata += '  width: 40px;\n';
    newdata += '  border-left: 1px solid #dddddd;\n';
    newdata += '  border-right: 1px solid #dddddd;\n';
    newdata += '  vertical-align: middle;\n';
    newdata += '  text-align: center;\n';
    newdata += '}\n';

    newdata += '		#Page' + escapeHTML(pageid) + ' .table-header-rotated th.rotate-45{\n';
    newdata += '  height: 80px;\n';
    newdata += '  width: 40px;\n';
    newdata += '  min-width: 40px;\n';
    newdata += '  max-width: 40px;\n';
    newdata += '  position: relative;\n';
    newdata += '  vertical-align: bottom;\n';
    newdata += '  padding: 0;\n';
    newdata += '  font-size: 12px;\n';
    newdata += '  line-height: 0.8;\n';
    newdata += '}\n';

    newdata += '		#Page' + escapeHTML(pageid) + ' .table-header-rotated th.rotate-45 > div{\n';
    newdata += '  position: relative;\n';
    newdata += '  top: 0px;\n';
    newdata += '  left: 40px;\n'; /* 80 * tan(45) / 2 = 40 where 80 is the height on the cell and 45 is the transform angle*/
    newdata += '  height: 100%;\n';
    newdata += '  -ms-transform:skew(-45deg,0deg);\n';
    newdata += '  -moz-transform:skew(-45deg,0deg);\n';
    newdata += '  -webkit-transform:skew(-45deg,0deg);\n';
    newdata += '  -o-transform:skew(-45deg,0deg);\n';
    newdata += '  transform:skew(-45deg,0deg);\n';
    newdata += '  overflow: hidden;\n';
    newdata += '  border-left: 1px solid #dddddd;\n';
    newdata += '}\n';

    newdata += '		#Page' + escapeHTML(pageid) + ' .table-header-rotated th.rotate-45:nth-last-child(2) > div {\n';
    newdata += '  border-right: 1px solid #dddddd;\n';
    newdata += '}\n';

    newdata += '		#Page' + escapeHTML(pageid) + ' .table-header-rotated th.rotate-45 span {\n';
    newdata += '  -ms-transform:skew(45deg,0deg) rotate(315deg);\n';
    newdata += '  -moz-transform:skew(45deg,0deg) rotate(315deg);\n';
    newdata += '  -webkit-transform:skew(45deg,0deg) rotate(315deg);\n';
    newdata += ' -o-transform:skew(45deg,0deg) rotate(315deg);\n';
    newdata += '  transform:skew(45deg,0deg) rotate(315deg);\n';
    newdata += '  position: absolute;\n';
    newdata += '  bottom: 30px;\n'; /* 40 cos(45) = 28 with an additional 2px margin*/
    newdata += '  left: -25px;\n'; /*Because it looked good, but there is probably a mathematical link here as well*/
    newdata += '  display: inline-block;\n';
    newdata += '  width: 85px;\n'; /* 80 / cos(45) - 40 cos (45) = 85 where 80 is the height of the cell, 40 the width of the cell and 45 the transform angle*/
    newdata += '  text-align: left;\n';
    newdata += '  white-space: nowrap;\n'; /*whether to display in one line or not*/
    newdata += '}\n';







    newdata += '	</style>\n';

    newdata += '	<script type="text/javascript">	\n';

    var myfunc = mbscript



    var myfunc = '' + mbscript;
    myfunc = myfunc.slice(22).slice(0, -1).replace(/\#PageX/g, '#Page' + escapeHTML(pageid));
    newdata += myfunc + '\n'
    newdata += '	</script>\n';

    newdata += data.slice(endfunct);
    data = newdata;


    startfunc = data.indexOf('<div style="margin-top: 6px;">&copy;');
    newdata = data.slice(0, startfunc);
    newdata += '<div style="margin-top: 6px;">This page was produced by the Feature Assistant Extension/Add-on and is not supported by BSA</div>';
    data = newdata + data.slice(startfunc);



    return data;
}


function mbscript() {

    function pageShow() {
        setTimeout(drawReport(), 1000);
    }

    function showErrorPopup(msg) {
        $('#errorPopupContent').html(msg);
        $('#errorPopup').popup({
            tolerance: '10,40',
            transition: 'pop',
            positionTo: 'window',
            history: false
        }).popup('open');
    }

    function drawReport() {
        $('tbody tr:odd td, tbody tr:odd th').not('.group').css('background-color', '#F5F5F5');

    }

    $('#myDash').click(function() {
        $.mobile.changePage(
            '/mobile/dashboard/', {
                allowSamePageTransition: true,
                transition: 'none',
                showLoadMsg: true,
                reloadPage: true
            }
        );
    });

    $('#buttonRefresh2').click(function() {
        $.mobile.changePage(
            '/mobile/dashboard/', {
                allowSamePageTransition: true,
                transition: 'none',
                showLoadMsg: true,
                reloadPage: true
            }
        );
    });


    $('#goBack').click(function() {
        //debugger;
        $.mobile.changePage(
            '/mobile/dashboard/', {
                allowSamePageTransition: true,
                transition: 'none',
                showLoadMsg: true,
                reloadPage: true
            }
        );
    });

}