// Copyright © 10/4/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.
//#######################  Begin Black Pug Import Code ###################################
var mbDebug = false;
var debugData = '';
var saveErrLog = '';

function addRawBlackPugPopup(data, pageid, unitID) {

    if (data.indexOf('"enterMeritBadges"') != -1) {
        var fselect = '<div><select name="SelectScoutID" id="selectScoutID" data-role="none" style="display:none"></select></div>';

        var startfunc = data.indexOf('<div data-role="content">');
        data = data.slice(0, startfunc) + fselect + '\n' + data.slice(startfunc);

        var fpopup = '<li >'; //<li class="ui-icon-alt">';
        fpopup += '<a href="#importBPMenu" data-rel="popup" data-transition="slideup" >'; //
        fpopup += '<div>Import Black Pug Data';
        fpopup += '<span style="position: relative; ">';
        fpopup += '<img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/uploadfile50.png" alt="import" title="Import" style="position: absolute; left: 6px; top: -2px; width: 24px; " />';
        fpopup += '</span>';
        fpopup += '</div>';
        fpopup += '</a>';
        //																																		shading 800
        fpopup += '<div data-role="popup" id="importBPMenu" data-theme="d" data-history="false"  data-dismissible="false" style="max-width: 400px;" data-overlay-theme="b">'; //data-theme="d" data-history="false"  data-dismissible="false"
        //																					800	
        fpopup += '<ul data-role="listview" data-inset="true" style="min-width: 300px;" data-theme="d" >'; //class="ui-icon-alt"
        fpopup += '<li data-role="divider" data-theme="e">Choose Black Pug (scoutingevent.com) CSV data file to import:</li>';
        fpopup += '<li><input id="BPfileSelect" type="file" accept=".csv" /> </li>';

        //fpopup +=	'<div class="ui-btn-txt">';

        fpopup += '<li id="meritBadgeRequirementLI">';
        fpopup += '<div class="slider">';
        fpopup += '<select name="MeritBadgeRequirement" id="meritBadgeRequirement" data-role="slider" data-mini="true">';
        fpopup += '<option value="off"></option>';
        fpopup += '<option value="on" ></option>';
        fpopup += '</select>';
        fpopup += '</div>';
        fpopup += '<div style="margin-left: 25px; font-weight: bold; font-size: 16px;">Merit Badge Req' + "'" + 's:</div>';
        fpopup += '</li>';
        fpopup += '<li id="meritBadgeCompleteLI">';
        fpopup += '<div class="slider">';
        fpopup += '<select name="MeritBadgeComplete" id="meritBadgeComplete" data-role="slider" data-mini="true">';
        fpopup += '<option value="off"></option>';
        fpopup += '<option value="on" ></option>';
        fpopup += '</select>';
        fpopup += '</div>';
        fpopup += '<div style="margin-left: 25px; font-weight: bold; font-size: 16px;">Complete Merit Badges:</div>';
        fpopup += '</li>';

        fpopup += '<li id="leaderApproveLI">';
        fpopup += '<div class="slider">';
        fpopup += '<select name="LeaderApprove" id="leaderApprove" data-role="slider" data-mini="true">';
        fpopup += '<option value="0"></option>';
        fpopup += '<option value="1" ></option>';
        fpopup += '</select>';
        fpopup += '</div>';
        fpopup += '<div style="margin-left: 25px; font-weight: bold; font-size: 16px;">Leader Approve:</div>';
        fpopup += '</li>';

        //fpopup +=	'</div>';

        fpopup += '<li><input type="submit" value="Import File" data-theme="g" id="buttonImport" ><input type="submit" value="Cancel" data-theme="g" id="buttonImportCancel" ></li>';
        //fpopup +=	'<li><input type="submit" value="Cancel" data-theme="g" id="buttonImportCancel"  /></li>';

        fpopup += '<li id="importErrLI">';
        //fpopup +=	'<div></div>';			
        fpopup += '</li>';



        fpopup += '</ul>';
        fpopup += '</div>';
        fpopup += '<div data-role="popup" id="importScoutName" data-theme="d" data-history="false"></div>';
        fpopup += '</li>';

        if (data.indexOf('href="#exportMenu"') != -1) {
            data = data.replace('<li class="ui-icon-alt"><a href="#exportMenu" data-rel="popup" data-transition="slideup">', fpopup + '\n' + '<li class="ui-icon-alt"><a href="#exportMenu" data-rel="popup" data-transition="slideup" >');
        } else {
            if (data.indexOf('href="/mobile/dashboard/admin/counselorlist.asp?UnitID') != -1) {
                data = data.replace('<li class="ui-icon-alt"><a href="/mobile/dashboard/admin/counselorlist.asp?UnitID=', fpopup + '\n' + '<li class="ui-icon-alt"><a href="/mobile/dashboard/admin/counselorlist.asp?UnitID=');
            }
        }


        startfunc = data.indexOf("function submitAddDenPatrolForm");
        var myfunc = '' + bpimpfu;
        myfunc = myfunc.slice(21).slice(0, -1).replace(/\#PageX/g, '#Page' + escapeHTML(escapeHTML(pageid))).replace('unitid', escapeHTML(unitID));
        data = data.slice(0, startfunc) + myfunc + '\n' + injparse + '\n' + injrowparse + '\n' + data.slice(startfunc);

        //add modification notice
        startfunc = data.indexOf('<div style="margin-top: 6px;">&copy;');
        var newdata = data.slice(0, startfunc);
        newdata += '<div style="margin-top: 6px;">This page was modified by the Feature Assistant Extension/Add-on and contains features not supported by BSA</div>';
        data = newdata + data.slice(startfunc);
    }
    return data;
}
/*bpimpfu contains code that is injected directly onto the page code so it runs in that namespace.
 */
function bpimpfu() {
    var fileObjs = {};
    $('#buttonImportCancel', '#PageX').click(function() {
        $('#importBPMenu', '#PageX').popup('close');
        $('#buttonImport', '#PageX').button('enable');
        $('#buttonImportCancel', '#PageX').button('enable');
        //$('#BPfileSelect', '#PageX').button('enable');
    });
    $('#buttonImport', '#PageX').click(function() {

        if (($('#meritBadgeComplete', '#PageX').val() == 'off') && ($('#meritBadgeRequirement', '#PageX').val() == 'off')) {
            alert('Select one or both import options');
            return;

        }
        // disable all inputs
        $('#buttonImport', '#PageX').button('disable');
        $('#buttonImportCancel', '#PageX').button('disable');

        var size = 0;
        var files = document.getElementById('BPfileSelect').files; //file1

        if (files.length == 0) {
            showErrorPopup('Please select the file you want to import and try again.');
            return false;
        }

        var validFileSet = true;

        var file = files[0];
        size = file.size;
        var fileName = file.name.toLowerCase();

        if (size > 50000000) {
            showErrorPopup('File sizes are too large.  Total size must not be more than 50 MB');
            return false;
        } else if (size > 0) {
            $.mobile.loading('show', {
                theme: 'a',
                text: 'reading files...0%',
                textonly: false
            });
        } else {
            $.mobile.loading('show', {
                theme: 'a',
                text: 'validating...',
                textonly: false
            });
        }

        //setTimeout('uploadFiles()', 1000);
        //alert('import files' + fileName);
        var reader = new FileReader();
        reader.onload = function() {
            var data = reader.result;

            $.mobile.loading('hide');
            // $('#BPfileSelect', '#PageX').button('disable');
            document.getElementById("BPfileSelect").disabled = true;
            fileObjs['bpdata'] = parseCSV(data);
            if (preProcessBPdata() == false) {
                alert('The file you selected does not appear to contain necessary headers.\nAborting import.');
                //						$('#buttonImport', '#PageX').button('enable');
                //						$('#importBPMenu').popup('close')
                closeImport('#PageX');
            } else if (checkMinDate() == false) {
                alert('Sorry, the data you selected precedes 5/31/2017 and cannot be processed');
                closeImport('#PageX');
            } else {
                //$('h1.ui-title').text().trim()  gets the
                var unitnum = $('#unitID', '#PageX').val();
                var thisUnit = $('option[value="' + unitnum + '"]', '#PageX').text();

                var fileUnit = fileObjs.bpdata[1][0];
                //console.log(fileObjs);
                var tres = true;
                if (fileUnit.indexOf(thisUnit) == -1) {
                    tres = confirm('The unit in the import file is: ' + fileUnit + '\n\nYou are attempting to import data to this unit: ' + thisUnit + '\n\nAre you sure you want to continue?  Press OK to continue and Cancel to quit');
                }
                if (tres == true) {
                    //							$('#buttonImport', '#PageX').button('enable');
                    //							$('#importBPMenu').popup('close')

                    //get scout names
                    var leaderapprv = $('#leaderApprove', '#PageX').val(); // 


                    $.mobile.loading('show', {
                        theme: 'a',
                        text: 'loading scout names...',
                        textonly: false
                    });
                    getScoutListFromRoster('unitid', '#PageX', leaderapprv);
                } else {
                    //							$('#buttonImport', '#PageX').button('enable');
                    //							$('#importBPMenu').popup('close');
                    closeImport('#PageX');
                }


            }

        };
        reader.readAsText(file);

        return false;
    });

    $('#selectScoutID', '#PageX').mobiscroll().select({
        theme: 'scoutbook',
        display: 'bubble',
        headerText: 'Custom Header lets see how wide it gets and stuff',
        counter: true,
        //			label: 'Match Scout name',
        //			showLabel: true,
        animate: 'flip',
        buttons: ['set', 'cancel'],
        mode: 'mixed',
        placeholder: 'Select a scout',
        anchor: $('a[href="#importBPMenu"]', '#PageX'),
        onSelect: function() {
            $('#selectScoutID', '#PageX').mobiscroll('hide');

            $.mobile.loading('show', {
                theme: 'a',
                text: 'working...',
                textonly: false
            });
            var leaderapprv = $('#leaderApprove', '#PageX').val();
            //alert(leaderapprv);
            afterScout('unitid', '#PageX', leaderapprv); // Update scoutArr with selection
            //				setTimeout("popEventList('#PageX')", 1000);
            return false;
        },
        onCancel: function() {
            $('#selectScoutID', '#PageX').mobiscroll('hide');
            $.mobile.loading('show', {
                theme: 'a',
                text: 'working...',
                textonly: false
            });
            //setTimeout('rdddddDs()', 1000);
            var leaderapprv = $('#leaderApprove', '#PageX').val();
            //alert(leaderapprv);

            popupNameMatch('unitid', '#PageX', leaderapprv);

            return false;
        },
        rows: 10,
        minWidth: 600,
        showInput: false,
        onBeforeShow: function(inst) {
            //alert('befor show');
            // do some logic here to see if we need to cancel the scroller

        }
    });


}

/*  function looks at bpdata to verify data is newer than 6/1/17*/

function checkMinDate() {

    var yr;
    for (var x = 0; x < fileObjs.bpdata[0].length; x++) {
        if (fileObjs.bpdata[0][x] == "Date Completed") {
            var compdate = x;
        }
    }
    var firstDt = fileObjs.bpdata[1][compdate].split('/');

    if (firstDt.length == 1) {
        var firstDt = fileObjs.bpdata[1][compdate].split('-');
    }
    yr = parseInt(firstDt[2])
    if (yr < 100) {
        yr = parseInt(firstDt[2]) + 2000;
    }



    if (yr >= 2018) {
        return true;
    }
    if (yr >= 2017) {
        if (parseInt(firstDt[0]) == 5) {
            if (parseInt(firstDt[1]) >= 31) {
                return true;
            }
        }
        if (parseInt(firstDt[0]) > 5) {
            return true;
        }
    }
    return false;
}

/*

			$('#addInvitees','#PageX').click(function () {
					// clicking mobiscroll freezes background
					$('#selectScoutID', '#PageX').mobiscroll('show');
					return false;

			});
*/



/* function gets called when a manual scout selection is made on a mobiscroll
 */
function afterScout(unitID, pageid, leaderapprv) { //tested used
    //nbconsole.log(20,leaderapprv);
    var inst = $('#selectScoutID', pageid).mobiscroll('getInst'); //gets the instanceof the mobiscroll object
    var values = inst.values; //gets the values selecteed in the mobiscroll object

    for (var x = 0; x < scoutArr.length; x++) {
        if (scoutArr[x].id == values) {
            //console.log(scoutArr[x].name +  ' = ' + tryName);
            scoutArr[x].bpscout = tryName;
        }
    }
    popupNameMatch(unitID, pageid, leaderapprv);
}

/* This function takes an array of scouts an populates a mobiscroll popup

*/
function addScoutToList(pageid) { //tested used I thinkl!
    // Don't add if already populated
    if ($('#selectScoutID', pageid).children().length == 0) {
        for (var i = 0; i < scoutArr.length; i++) {
            $('#selectScoutID', pageid).append('<option value="' + escapeHTML(scoutArr[i].id) + '"  data-ilist="1" >' + escapeHTML(scoutArr[i].name) + '</option>');
        }
    }
    $.mobile.loading('hide');
}


/* Async Function pops up mobiscroll to allow selection of scout names
Async Function
Enter function with list of unmatched scout names

Mobiscroll handles selection, will call back to this

*/
function popupNameMatch(unitID, pageid, leaderapprv) { //tested used

    //nbconsole.log(1,leaderapprv);


    if (noNameMatch.length == 0) {
        // No more names to match
        // alert('Next Step after name match');
        // works, just removed for test

        getMBfromQE(unitID, pageid, leaderapprv); // asyn here just to test func  Tested 2/13/ works.
    } else {
        tryName = noNameMatch.shift();
        $.mobile.loading('hide');
        $('#selectScoutID', pageid).mobiscroll('option', {
            headerText: '<div style="font-size:20px;"><b>' + escapeHTML(tryName) + '</b><br> is listed in the import file from Black Pug but does not <br> match a name in Scoutbook.  Please select a matching name and <br>select Set, or select Cancel if there is no match.</div>' //,
            //label: 'Unmatched Name: Luke Mudwalker'
        });
        $('#selectScoutID', pageid).mobiscroll('show');
    }
}

/* Functions sorts bp scout names into matched and unmatched names
function puts bp scout names into scoutArr when matched
Othewise, puts the bp name into nNameMatch array

*/
function matchNames() { //tested used
    var fn = 'blank';
    var ln = 'blank';
    var lfn = 'blank';
    var lln = 'blank';
    var bpname;

    for (var x = 0; x < fileObjs.bpdata[0].length; x++) {
        if (fileObjs.bpdata[0][x] == "First Name") {
            var firstname = x;
        }
        if (fileObjs.bpdata[0][x] == "Last Name") {
            var lastname = x;
        }
    }
    for (var x = 1; x < fileObjs.bpdata.length; x++) {
        fn = fileObjs.bpdata[x][firstname].trim();
        ln = fileObjs.bpdata[x][lastname].trim();
        if ((ln + fn).toLowerCase() != (lln + lfn).toLowerCase()) {
            lln = ln;
            lfn = fn;
            bpname = fn + ' ' + ln;
            for (var y = 0; y < scoutArr.length; y++) {
                if (scoutArr[y].name.toLowerCase() == bpname.toLowerCase()) {
                    //match
                    scoutArr[y].bpscout = bpname;
                    found = true;
                    break;
                }
            }

            if (scoutArr.length == y) {
                // name was not matched
                noNameMatch.push(bpname);
            }
        }
    }
}

/* Async function. - Ajax call to get Scoutbook Roster
 */
function getScoutListFromRoster(unitID, pageid, leaderapprv) { //tested used

    //nbconsole.log(2,leaderapprv);
    var utype = "unit";

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(getScoutListFromRoster, unitID, pageid, leaderapprv, '', '', '', ''); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            //get scoutlist
            // These are not going thru the name filter because they never show

            //			var startIndex= this.responseText.indexOf('Add Leader',1);  //<div class="ui-block-b">  on a line by itself
            //			var endIndex=this.responseText.indexOf('Add Scout',startIndex); //<div id="footer" align="center">

            var startIndex = this.responseText.indexOf('<div class="ui-block-b">', 1); //<div class="ui-block-b">  on a line by itself
            var endIndex = this.responseText.indexOf('<div id="footer" align="center">', startIndex); //<div id="footer" align="center">			

            var scoutlistresp = this.responseText.slice(startIndex, endIndex + 7);

            //first Scout ID is
            //var scoutIDs = this.responseText.match(/id=\"scoutUserID\d+/);
            //var scoutIDn = scoutIDs[0].match(/\d+/);
            //var scoutID=scoutIDn[0];
            //var unitID= /UnitID\=\d+/.exec($('base')[0].href);

            fillScoutRosterArr(scoutlistresp);
            addScoutToList(pageid); // add scout names to mobiscroll

            //$('#footer').append('<a href="#importScoutName" data-rel="popup" data-transition="slideup"    style="hidden"></a>');
            //		$('#importBPMenu').popup('close');
            //$('#importScoutName').popup('open');

            //var noNameMatch=[];
            matchNames();
            if (noNameMatch.length != 0) {
                popupNameMatch(unitID, pageid, leaderapprv);
                //we have names that didn't match.  So we need to handle them
            } else {
                // All names matched!

                getMBfromQE(unitID, pageid, leaderapprv);
                return;
            }
        }

        if (this.readyState == 4 && this.status != 200 && this.status == 500) {
            //console.log('Server Error ' +servErrCnt);
            if (servErrCnt > maxErr) {
                $.mobile.loading('hide');
                alert('Halted due to excessive Server errors');
                return;
            }
            servErrCnt++;
            // mbArrPtr=errmbArrPtr;
            setTimeout(function() {
                getScoutListFromRoster(unitID, pageid, leaderapprv);
            }, 1000); //reset 
        }

    };
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID=' + unitID;

    //console.log('Getting Roster ' +url);
    xhttp.open("GET", url, true);
    xhttp.responseType = "text";

    xhttp.send();
    xhttp.onerror = function() {
        errHandle(getScoutListFromRoster, unitID, pageid, leaderapprv, '', '', '', '');
    };
}

/*	Parses Roster page to get scout names and IDs
 */
function fillScoutRosterArr(scoutlistresp) { //tested used

    var lnk;
    var txt;
    var evname;
    var ttxt;
    var eventid;
    var rankrec = '';
    var evObj = {
        name: '',
        id: '',
        bpscout: '',
        mbApproved: [],
        rank: ''
    };
    scoutArr.length = 0;

    var scoutrec;
    var endrec = 0;
    var startrec = 0;

    startrec = scoutlistresp.indexOf('account.asp?ScoutUserID', endrec);
    endrec = scoutlistresp.indexOf('CURRENT RANK', startrec + 1);

    do {
        scoutrec = scoutlistresp.slice(startrec, endrec);
        rankrec = scoutlistresp.slice(endrec + 25, endrec + 100);

        // Make sure the scout is approved
        if (scoutrec.match(/securityapproved/) != null) {
            if (scoutrec.match(/ScoutUserID=(\d+)/) != null) {
                evObj.id = scoutrec.match(/ScoutUserID=(\d+)/)[1];
            }
            evObj.name = '';
            //find a line in the rec that does not have a < char
            scoutrec.split('\n').forEach(function(tline) {
                if (tline.match(/>/) == undefined) {
                    if (tline.trim() != '') {
                        evname = tline.trim();
                    }
                }
            });
            // If evname contains a comma, it is lastname,firstname
            // Lets put the name as firstname last name.  Why?  If roster sorted on 1st name, it could be joe bob van morrison and how whould you know what is the 1st name?
            if (evname.indexOf(',') != -1) {
                // lastname is first
                firstn = '';
                if (evname.match(/,( \w+)/) != null) {
                    firstn = evname.match(/,( \w+)/)[1];
                }
                lastn = '';
                if (evname.match(/(\w+),/) != null) {
                    lastn = evname.match(/(\w+),/)[1];
                }
                evname = firstn.trim() + ' ' + lastn.trim();
            }

            evObj.name = evname;
            //CURRENT RANK: <strong style="font-size: 11px; color: black; ">Eagle Scout</strong>
            if (rankrec.match(/>[^<]+/) != null) {
                evObj.rank = rankrec.match(/>([^<]+)/)[1];
            }

            scoutArr.push(JSON.parse(JSON.stringify(evObj)));
        }
        startrec = scoutlistresp.indexOf('account.asp?ScoutUserID', endrec);
        endrec = scoutlistresp.indexOf('CURRENT RANK', startrec + 1);
    }
    while (startrec != -1 && endrec != -1);

    // now push into a mobiscroll
    return true;
}

/* Async function.  Ajax call to meritbadgequickentry.asp to get MB names and IDs

This func gets list of ALL MBs in the QE list from Scoutbook.  Loads MB name and ID
*/
function getMBfromQEo(unitID, pageid, leaderapprv) { //tested used

    var unitID = /UnitID\=\d+/.exec($('base')[0].href);
    //nbconsole.log(3,leaderapprv);
    $.mobile.loading('hide');
    $.mobile.loading('show', {
        theme: 'a',
        text: 'loading merit badge data...',
        textonly: false
    });
    //var utype="unit";
    //var mbArr=[{}];

    //alert('got it');
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(getMBfromQEo, unitID, pageid, leaderapprv, '', '', '', ''); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            var startIndex = this.responseText.indexOf('<div id="requirements"', 1);
            var endIndex = this.responseText.indexOf('Notes/Comments:', startIndex);
            var mbraw = this.responseText.slice(startIndex, endIndex + 7);

            var unitID = /UnitID\=\d+/.exec($('base')[0].href);

            fillMBArr(mbraw);

            //console.log(mbArr);

            // begin compare to bp data
            matchMBs(pageid, leaderapprv);

        }
        if (this.readyState == 4 && this.status != 200 && this.status == 500) {
            //console.log('Server Error ' +servErrCnt);
            if (servErrCnt > maxErr) {
                $.mobile.loading('hide');
                alert('Halted due to excessive Server errors');
                return;
            }
            servErrCnt++;
            // mbArrPtr=errmbArrPtr;
            setTimeout(function() {
                getMBfromQE(unitID, pageid, leaderapprv);
            }, 1000); //reset 
        }
    };
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/advancement/meritbadgequickentry.asp?' + unitID;

    //console.log('getMBfromQE ' + url);
    xhttp.open("GET", url, true);
    xhttp.responseType = "text";

    xhttp.send();
    xhttp.onerror = function() {
        errHandle(getMBfromQEo, unitID, pageid, leaderapprv, '', '', '', '');
        if (servErrCnt > maxErr) {
            closeImport(pageid);
        }
    };

}

/* Parses meritbadgequickentry.asp page to get MB names and IDs
	mbraw is the raw text received from the server from a GET meritbadgequickentry.asp?
	THis function populates the mbArr array with merit badge names and id's extracted from the raw text
*/
function fillMBArr(mbraw) { //tested used

    var lnk;
    var txt;
    var evname;
    var ttxt;
    var eventid;
    var evObj = {
        name: '',
        id: '',
        yrid: '',
        bpmbname: '',
        BPDyr: '',
        bpreq: [],
        scoutsAlreadyStartedMB: [],
        reqlist: [],
        scoutsAlreadyStartedRank: []
    };
    mbArr.length = 0;
    //mbArr[y].listscouts=[];

    var mbrec;

    var endrec = 0;
    var startrec = 0;

    //<input type="checkbox" name="MeritBadgeID" id="meritBadgeID128" data-theme="d" value="128">
    //<label for="meritBadgeID128">Woodwork</label>

    startrec = mbraw.indexOf('<label for="meritBadgeID', endrec);
    endrec = mbraw.indexOf('</label>', startrec + 1);

    evObj.bpreq = [];
    do {
        mbrec = mbraw.slice(startrec, endrec);

        // Make sure the scout is approved
        evObj.id = '';
        if (mbrec.match(/(\d+)/) != null) {
            evObj.id = mbrec.match(/(\d+)/)[1];
        }
        if (mbrec.match(/>(.+)/) != null) {
            evObj.name = '';
            evObj.name = mbrec.match(/>(.+)/)[1];
        }

        mbArr.push(JSON.parse(JSON.stringify(evObj)));

        startrec = mbraw.indexOf('<label for="meritBadgeID', endrec);
        endrec = mbraw.indexOf('</label>', startrec + 1);
    }
    while (startrec != -1 && endrec != -1);

    return true;
}

function getMBfromQE(unitID, pageid, leaderapprv) {
    //nbconsole.log(4,leaderapprv);
    getMBfromQEo(unitID, pageid, leaderapprv); //getMBfromQEo
}





/* Function appends columns to bpdata, Name and Reqtag
  this function splits the advancement col in fileObjs.bpdata into two new columns, Name, and ReqTag
  This eliminates redundant processing time later
*/
function preProcessBPdata() { //tested used
    fileObjs.bpdata[0].push('AdvName');
    fileObjs.bpdata[0].push('ReqTag');
    var resObj = {};

    for (var x = 0; x < fileObjs.bpdata[0].length; x++) {

        if (fileObjs.bpdata[0][x] == "Advancement") {
            var advcol = x;
        }
        if (fileObjs.bpdata[0][x] == "Advancement Type") {
            var advtypecol = x;
        }
        if (fileObjs.bpdata[0][x] == "AdvName") {
            var advnm = x;
        }
        if (fileObjs.bpdata[0][x] == "First Name") {
            var fn = x;
        }
        if (fileObjs.bpdata[0][x] == "Last Name") {
            var ln = x;
        }
        if (fileObjs.bpdata[0][x] == "Date Completed") {
            var dt = x;
        }
    }

    //console.log(dt,ln,fn,advcol,advtypecol);
    if ((dt == undefined) || (ln == undefined) || (fn == undefined) || (advcol == undefined) || (advtypecol == undefined)) {
        return false;
    }

    for (var rowcnt = 1; rowcnt < fileObjs.bpdata.length; rowcnt++) {

        if (fileObjs.bpdata[rowcnt].length < advtypecol) {
            if (rowcnt == fileObjs.bpdata.length - 1) {
                fileObjs.bpdata.pop();
            }
            //console.log('bad row #' +rowcnt+ " len="+ fileObjs.bpdata[rowcnt].length);

        } else {
            if (fileObjs.bpdata[rowcnt][advtypecol].match(/Merit Badge Requirement/) != null) {
                var resObj = {};
                //strip the merit badge name - anything preceding a #
                splitAdvCol(fileObjs.bpdata[rowcnt][advcol], resObj);
                fileObjs.bpdata[rowcnt].push(resObj.bpname);
                fileObjs.bpdata[rowcnt].push(resObj.req);

                //fileObjs.bpdata[rowcnt].push(fileObjs.bpdata[rowcnt][advcol].match(/([\w ]+) #/)[1]);	//name
                //fileObjs.bpdata[rowcnt].push(fileObjs.bpdata[rowcnt][advcol].match(/#\w+/)[0]);			//tag


            } else if (fileObjs.bpdata[rowcnt][advtypecol].match(/Merit Badge/) != null) {
                fileObjs.bpdata[rowcnt].push(fileObjs.bpdata[rowcnt][advcol]); //name
            } else {
                fileObjs.bpdata[rowcnt].push('');
            }

        }
    }

    var header = fileObjs.bpdata.shift(); //remove header for sort
    var SortOrder = [ln, fn, advtypecol, advnm, dt];
    fileObjs.bpdata.sort(function(a, b) {
        var a0 = a[SortOrder[0]].toLowerCase(),
            b0 = b[SortOrder[0]].toLowerCase();

        if (a0 === b0) {

            var a1 = a[SortOrder[1]].toLowerCase(),
                b1 = b[SortOrder[1]].toLowerCase();

            if (a1 === b1) {
                var a2 = a[SortOrder[2]].toLowerCase(),
                    b2 = b[SortOrder[2]].toLowerCase();
                if (a2 === b2) {
                    var a3 = a[SortOrder[3]].toLowerCase(),
                        b3 = b[SortOrder[3]].toLowerCase();
                    if (a3 === b3) {
                        var a4 = a[SortOrder[4]].toLowerCase(),
                            b4 = b[SortOrder[4]].toLowerCase();
                        return a4 < b4 ? -1 : a4 > b4 ? 1 : 0;
                    }
                    return a3 < b3 ? -1 : a3 > b3 ? 1 : 0;
                }
                return a2 < b2 ? -1 : a2 > b2 ? 1 : 0;
            }

            return a1 < b1 ? -1 : a1 > b1 ? 1 : 0;
        }
        return a0 < b0 ? -1 : a0 > b0 ? 1 : 0;
    });

    fileObjs.bpdata.unshift(header); //put header back

    return true;
}


// gets for the whole roster; not necessary
/* Async function. Ajax call to meritbadgequickentry.asp?Action=GetMeritBadges&ScoutUserID to get all approved merit badges for a scout
 */
function getScoutMBs(scPtr, leaderapprv, pageid) { //tested used, though gets more than needed
    //nbconsole.log(5,leaderapprv);
    if (scPtr < scoutArr.length) {
        //only get scout data if in bpdata
        //if (bpdataScouts.length==0)
        //	getbpscouts();
        //
        for (var x = scPtr; x < scoutArr.length; x++) {
            if (scoutArr[x].bpscout != '') {
                break; // need mb data for this one
            }
        }
        if (x < scoutArr.length) {
            scPtr = x;
        } else {
            $.mobile.loading('hide');
            setTimeout(function() {
                tag_Ignores(leaderapprv, pageid);
            }, 100);
            return;
        }

    } else {

        $.mobile.loading('hide');
        setTimeout(function() {
            tag_Ignores(leaderapprv, pageid);
        }, 100);
        return;
    }

    var item;
    var re = /#meritBadgeID(\d+)/g;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(getScoutMBs, scPtr, leaderapprv, pageid, '', '', '', '', ''); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            //$('#meritBadgeID25').prop('checked', true).checkboxradio('disable').checkboxradio('refresh');

            // fill array with matches
            while (item = re.exec(this.response))
                scoutArr[scPtr].mbApproved.push(item[1]);

            scPtr++;
            setTimeout(function() {
                getScoutMBs(scPtr, leaderapprv, pageid)
            }, 100); // does this really decouple...
        }
        if (this.readyState == 4 && this.status != 200 && this.status == 500) {
            //console.log('Server Error ' +servErrCnt);
            if (servErrCnt > maxErr) {
                $.mobile.loading('hide');
                alert('Halted due to excessive Server errors');
                return;
            }
            servErrCnt++;
            setTimeout(function() {
                getScoutMBs(scPtr, leaderapprv, pageid)
            }, 1000); //just repeat
        }
    };
    $.mobile.loading('hide');
    $.mobile.loading('show', {
        theme: 'a',
        text: 'Loading completed MBs for  ' + scoutArr[scPtr].name + '...',
        textonly: false
    });
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/advancement/meritbadgequickentry.asp?Action=GetMeritBadges&ScoutUserID=' + scoutArr[scPtr].id;

    //console.log('getting scout mbs '+ scoutArr[scPtr].name+ ' '+ url);
    xhttp.open("GET", url, true);
    xhttp.responseType = 'text';

    xhttp.send();
    xhttp.onerror = function() {
        errHandle(getScoutMBs, scPtr, leaderapprv, pageid, '', '', '', '', '');
        if (servErrCnt > maxErr) {
            closeImport(pageid);
        }
    };

}

/*	Marks merit badges in mbArr that cannot be used for requirement imports.  Uses configuration file Ignorebadge.  Marks years to ignore
 */
function tag_Ignores(leaderapprv, pageid) { //tested used  NA 2017
    //nbconsole.log(6,leaderapprv);
    //remove the BPDmbname property of any object tagged for ignore
    var name = 1;
    var year = 0;

    //alert('done with tag_Ignores');
    $.mobile.loading('show', {
        theme: 'a',
        text: 'Loading merit badge versions...',
        textonly: false
    });
    //loadBPDMB(0,'Merit Badge Requirement');

    //if (($('#meritBadgeComplete').val() == 'off' ) && ($('#meritBadgeRequirement').val()=='off'))

    //termimportstart

    if (mbfirst == true) {
        if ($('#meritBadgeComplete', pageid).val() == 'on') {
            completeMBScout(leaderapprv, pageid);
        } else if ($('#meritBadgeRequirement', pageid).val() == 'on') {
            getYrID(0, leaderapprv, pageid); //async
        }
    } else {
        if ($('#meritBadgeRequirement', pageid).val() == 'on') {
            getYrID(0, leaderapprv, pageid); //async
        } else if ($('#meritBadgeComplete', pageid).val() == 'on') {
            completeMBScout(leaderapprv, pageid);
        }
    }




}

function getbpscouts() { //not used
    for (var x = 0; x < fileObjs.bpdata[0].length; x++) {
        if (fileObjs.bpdata[0][x] == "First Name") {
            var firstname = x;
        }
        if (fileObjs.bpdata[0][x] == "Last Name") {
            var lastname = x;
        }
        if (fileObjs.bpdata[0][x] == "Advancement Type") {
            var advcol = x;
        }
    }

    for (var x = 0; x < fileObjs.bpdata.length; x++) {
        if (fileObjs.bpdata[x][advcol].match(/Merit Badge/) != -1) {
            pushUnique(bpdataScouts, fileObjs.bpdata[x][firstname] + ' ' + fileObjs.bpdata[x][lastname]);
        }
    }
}

/*function builds list of scouts with completed mbs from bpdata*/
function completeMBScout(leaderapprv, pageid) { //tested used
    //nbconsole.log(7,leaderapprv);
    var completeScouts = [];
    for (var x = 0; x < fileObjs.bpdata[0].length; x++) {
        if (fileObjs.bpdata[0][x] == "First Name") {
            var firstname = x;
        }
        if (fileObjs.bpdata[0][x] == "Last Name") {
            var lastname = x;
        }
        if (fileObjs.bpdata[0][x] == "Advancement Type") {
            var advcol = x;
        }
    }

    for (var x = 0; x < fileObjs.bpdata.length; x++) {
        if (fileObjs.bpdata[x][advcol] == 'Merit Badge') {
            pushUnique(completeScouts, fileObjs.bpdata[x][firstname] + ' ' + fileObjs.bpdata[x][lastname]);
        }
    }


    if (completeScouts.length == 0) {
        //alert('Import Complete.');


        //done going thru completed badges
        //If we did completed badges first, and selected requirements to do next then do them		



        if (mbfirst == true && $('#meritBadgeRequirement', pageid).val() == 'on') {
            getYrID(0, leaderapprv, pageid);
        } else {
            //checkBPAdvancement();
            closeImport(pageid); //termimportmb
        }

    } else {
        getScoutUpMBs(completeScouts, leaderapprv, pageid);
    }


}

/*function gets list of completed merit badges from scoutbook for scout in completeScouts*/
function getScoutUpMBs(completeScouts, leaderapprv, pageid) { //tested used
    //nbconsole.log(8,leaderapprv);
    var found = false;
    for (var x = 0; x < completeScouts.length; x++) {
        var bpscout = completeScouts.shift();
        for (var scPtr = 0; scPtr < scoutArr.length; scPtr++) {
            if (scoutArr[scPtr].bpscout == bpscout) {
                found = true;
                break;
            }
        }
        if (found == true) {
            break
        }
    }

    if (scPtr == scoutArr.length) {
        // There are no scouts to process.
        //This scout in CompleteScouts not found  in the array.  Either CompleteScouts should not contain an ignored scout, or this logic should fix
        $.mobile.loading('hide');
        setTimeout(function() {
            processBPApprovedMB(leaderapprv, pageid);
        }, 100);
        return;
    }

    // same as above, safety check
    //if (completeScouts.length==0) {
    //	$.mobile.loading('hide');
    //	setTimeout(function () {processBPApprovedMB(leaderapprv);},100);
    //	return;
    //}	



    var item;
    var re = /#meritBadgeID(\d+)/g;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(getScoutUpMBs, completeScouts, leaderapprv, pageid, '', '', '', '', ''); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            //$('#meritBadgeID25').prop('checked', true).checkboxradio('disable').checkboxradio('refresh');

            // fill array with matches
            scoutArr[scPtr].mbApproved.length = 0; //reset list
            while (item = re.exec(this.response))
                scoutArr[scPtr].mbApproved.push(item[1]);

            if (completeScouts.length == 0) {
                $.mobile.loading('hide');
                setTimeout(function() {
                    processBPApprovedMB(leaderapprv, pageid);
                }, 100);
                return;
            }
            setTimeout(function() {
                getScoutUpMBs(completeScouts, leaderapprv, pageid)
            }, 100); // does this really decouple...
        }
        if (this.readyState == 4 && this.status != 200 && this.status == 500) {
            //console.log('Server Error ' +servErrCnt);
            if (servErrCnt > maxErr) {
                $.mobile.loading('hide');
                alert('Halted due to excessive Server errors');
                return;
            }
            servErrCnt++;
            setTimeout(function() {
                getScoutUpMBs(completeScouts, leaderapprv, pageid)
            }, 1000); //just repeat
        }
    };
    $.mobile.loading('hide');
    $.mobile.loading('show', {
        theme: 'a',
        text: 'Loading completed MBs for  ' + scoutArr[scPtr].name + '...',
        textonly: false
    });
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/advancement/meritbadgequickentry.asp?Action=GetMeritBadges&ScoutUserID=' + scoutArr[scPtr].id;

    //console.log('getting scout mbs '+ scoutArr[scPtr].name+ ' '+ url);
    xhttp.open("GET", url, true);
    xhttp.responseType = 'text';

    xhttp.send();
    xhttp.onerror = function() {
        errHandle(getScoutUpMBs, completeScouts, leaderapprv, pageid, '', '', '', '', '');
        if (servErrCnt > maxErr) {
            closeImport(pageid);
        }

    };

}

/* function builds list of completed mbs to be imported.  Each item is a mb, date, and list of scouts
 */
function processBPApprovedMB(leaderapprv, pageid) { //tested used
    //nbconsole.log(9,leaderapprv);
    //alert('Process Completed MB stub');
    /*
    go thru mbArr

    find matching recs in bpdata, get scout names

    scout(getid)  mb(getid) date

    list of scout mb's already approved is in mbArr

    https://www.scoutbook.com/mobile/dashboard/admin/advancement/meritbadgequickentry.asp?Action=GetMeritBadges&ScoutUserID=xxxxx

    create list of dates to process

    For each date, create list of mbs
    	for each mb for that date
    		create list of ineligible scouts   (date,scout)
    		create list of elibible scouts		(date,scout)
    		append to submitCompleteList the mb for eligible scouts on that date

    	next
    next

    for each scout in ineligible list
      find mbs on that date for that scout
      append to submitCompleteList the mbs for that scout on that date
    next

    for each item in the submit list
      submit
    next

    could be improved.

    async getcookie?  Do we need to know scout eligibility? YES, diff kind. What id scout already completed badge in SB?

    */
    var compDates = [];
    var compDateOneDim = [];
    var compDateOneDim = [];
    createCompleteDateArr(compDateOneDim);

    //compdates is one dimensional

    var mblist = [];

    for (var x = 0; x < compDateOneDim.length; x++) {
        mblist = [];
        getmblist(compDateOneDim[x], mblist);
        //var arr=[compDateOneDim,mblist.slice()];
        compDates.push([compDateOneDim[x], mblist.slice()]);
    }

    compDateOneDim = [];

    var thisRec = {
        mbid: '',
        date: '',
        listscouts: []
    };
    var eligible = [];
    submitCompleteList.length = 0; //clear array

    for (var dt = 0; dt < compDates.length; dt++) {

        for (var mb = 0; mb < compDates[dt][1].length; mb++) {
            //for the mbid given by compDates[dt][1][mb]
            // parse bpdata for the list of scouts that completed this badge on this date
            // then put them into an eligible or ineligible list
            eligible.length = 0; //reset scout list for each merit badge
            sortEligScout(eligible, compDates[dt][1][mb], compDates[dt][0]);
            //create submitrecord
            if (eligible.length > 0) {
                thisRec.mbid = compDates[dt][1][mb];
                thisRec.date = compDates[dt][0];
                thisRec.listscouts = eligible.slice();
                submitCompleteList.push(JSON.parse(JSON.stringify(thisRec)));

            }
            //submitCompleteList.push([compDates[dt][1][mb],compDates[dt][0],eligible.slice()]);

        }
    }

    //console.log(submitCompleteList);
    //alert('done');

    if (submitCompleteList.length > 0) {
        getCompleteCookie(leaderapprv, pageid);
    } else {
        //alert('No Completed Merit Badges to Save.  Import Complete');
        //$.mobile.loading('hide');
        //closeImport();		//termimportmb
        //done going thru completed badges
        //If we did completed badges first, and selected requirements to do next then do them
        if (mbfirst == true && $('#meritBadgeRequirement', pageid).val() == 'on') {
            getYrID(0, leaderapprv, pageid);
        } else {
            //checkBPAdvancement();
            closeImport(pageid); //termimportmb
        }


    }
}

/* Aync function for compl mbs.  Ajax call to meritbadgequickentry.asp?UnitID=   gets either a cookie or sets the Referer field for the next operation, either way, its needed
 */
function getCompleteCookie(leaderapprv, pageid) { //tested used
    //nbconsole.log(10,leaderapprv);

    var unitID = /UnitID\=\d+/.exec($('base')[0].href);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(getCompleteCookie, leaderapprv, pageid, '', '', '', '', '', ''); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            // cookie loaded, call to Post
            postComplete(leaderapprv, pageid);
        }
        if (this.readyState == 4 && this.status != 200 && this.status == 500) {

            //console.log('Server Error ' +servErrCnt);
            if (servErrCnt > maxErr) {
                $.mobile.loading('hide');
                alert('Halted due to excessive Server errors');
                return;
            }
            servErrCnt++;
            setTimeout(function() {
                getCompleteCookie(leaderapprv, pageid);
            }, 1000);
        }
    };
    //https://www.scoutbook.com/mobile/dashboard/admin/advancement/meritbadgequickentry.asp?UnitID=xx
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/advancement/meritbadgequickentry.asp?' + unitID;

    //console.log('getCompleteCookie Getting '+ url);
    xhttp.open("GET", url, true);
    xhttp.responseType = 'document';

    xhttp.send();
    xhttp.onerror = function() {
        errHandle(getCompleteCookie, leaderapprv, pageid, '', '', '', '', '', '');
        if (servErrCnt > maxErr) {
            closeImport(pageid);
        }

    };
}

/* Async Function.  Ajax POST to meritbadgequickentry.asp? to import a MB for a given date and a list of scouts
    Set document = PostIeRequest(HttpReq, "https://www.scoutbook.com/mobile/dashboard/admin/advancement/meritbadgequickentry.asp?PatrolID=", _
    "https://www.scoutbook.com/mobile/dashboard/admin/advancement/meritbadgequickentry.asp?UnitID=" & UnitID, _
    Array("Action", "ScoutUserID", "DateCompleted", "LeaderApproved", "MeritBadgeID", "Comments"), _
    Array("Submit", scoutid, URLEncode(compdt), "1", MbId, ""))

*/
function postComplete(leaderapprv, pageid) { //tested used
    //nbconsole.log(11,leaderapprv);
    var thisRec;
    var scoutidlist = '';
    var scoutnamelist = '';

    thisRec = submitCompleteList.shift();

    for (var x = 0; x < thisRec.listscouts.length; x++) {
        scoutidlist += '&ScoutUserID=' + thisRec.listscouts[x];
        scoutnamelist += scoutIDtoName(thisRec.listscouts[x]) + ' ';
    }

    var DataToPost = 'Action=Submit' + scoutidlist + '&DateCompleted=' + encodeURI(thisRec.date) + '&LeaderApproved=' + leaderapprv + '&MeritBadgeID=' + thisRec.mbid + '&Comments=';
    // add reqs to data

    //referer: https://www.scoutbook.com/mobile/dashboard/admin/advancement/meritbadgequickentry.asp?UnitID=" & UnitID
    $.mobile.loading('hide');
    $.mobile.loading('show', {
        theme: 'a',
        text: 'Saving Complete Merit Badge ' + MBidToName(thisRec.mbid) + ' for  ' + scoutnamelist + '...',
        textonly: false
    });

    if (mbDebug == true) {
        DebugSaveCompReqs('Saving Complete Merit Badge ' + MBidToName(thisRec.mbid) + ' for  ' + scoutnamelist + '...' + DataToPost, scoutnamelist, MBidToName(thisRec.mbid), leaderapprv);
        return;
    }

    //Array("Action", "MeritbadgeID", "MeritBadgeVersionID", "DateCompleted", "LeaderApproved", "ScoutUserID", "MeritBadgeRequirementID", "Comments"), _
    //Array("Submit", MeritBadgeID, MeritBadgeVer, URLEncode(datelist(eachdate)), "1", scoutid, reqString, ""))

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(postComplete, leaderapprv, pageid, '', '', '', '', '', ''); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            if (this.response.match(/Success/) == null) {
                //alert('Error Posting meritbadgequickentry.  Success response not received.');
                //saveErrLog += 'Error Posting meritbadgequickentry ' +MBidToName(thisRec.mbid)+ ' for  '+scoutnamelist+'...'+DataToPost + '\n';
            }

            if (submitCompleteList.length == 0) {
                $.mobile.loading('hide');
                //alert('Done posting completed badges');
                if (mbfirst == true && $('#meritBadgeRequirement', pageid).val() == 'on') {
                    getYrID(0, leaderapprv, pageid);
                } else {
                    //checkBPAdvancement();
                    closeImport(pageid); //termimportmb
                }
                return;
            }

            setTimeout(function() {
                getCompleteCookie(leaderapprv, pageid);
            }, 100); //getscoutmb which then calls getCompleteCookie

        }
        if (this.readyState == 4 && this.status != 200 && this.status == 500) {
            //console.log('Server Error ' +servErrCnt);
            if (servErrCnt > maxErr) {
                $.mobile.loading('hide');
                alert('Halted due to excessive Server errors');
                return;
            }
            servErrCnt++;
            submitCompleteList.push(thisRec);
            setTimeout(function() {
                postComplete(leaderapprv, pageid);
            }, 1000); //reset 
        }
    };


    //console.log('POST Saving '+MBidToName(thisRec.mbid)+ ' for '+scoutnamelist + ' data='+DataToPost);
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/advancement/meritbadgequickentry.asp?PatrolID=';
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(DataToPost);

    xhttp.onerror = function() {
        errHandle(postComplete, leaderapprv, pageid, '', '', '', '', '', '');
        if (servErrCnt > maxErr) {
            closeImport(pageid);
        }
    };

}

/* Debug function, used to avoid actually importing data*/
function DebugSaveCompReqs(DataToPost, scoutnamelist, mbname, leaderapprv) {
    debugData += DataToPost + '\n';
    //debug version to avoid saving
    //nbconsole.log('Saving '+mbname+ ' for '+scoutnamelist + ' data='+DataToPost);


    if (submitCompleteList.length == 0) {
        $.mobile.loading('hide');
        //alert('Done posting completed badges');
        if (mbfirst == true && $('#meritBadgeRequirement', pageid).val() == 'on') {
            getYrID(0, leaderapprv, pageid);
        } else {
            //checkBPAdvancement();
            closeImport(pageid); //termimportmb
        }
        return;
    }

    setTimeout(function() {
        getCompleteCookie(leaderapprv, pageid);
    }, 100); //getscoutmb which then calls getCompleteCookie



}



/* Function parses bpdata for recType records, returnin pointers to beginning and end rows of teh record

function parses fileObjs.bpdata for recType records, beginning at recordPtr.start

When complete, returns (new) recordPtr.start and recordPtr.end to delineate
the start and end of the record rows.  If recordPtr.start is returned with -1, it means the end of data
was reached.

If no scout id exists, do not process record

recType is 'Merit Badge Requirement'
		or 'Merit Badge'
*/
function loadBPDMB(recType, leaderapprv, pageid) { //tested used
    //nbconsole.log(12,leaderapprv);
    var endOffset = -1;
    var newstart = -1;

    for (var x = 0; x < fileObjs.bpdata[0].length; x++) {
        if (fileObjs.bpdata[0][x] == "Advancement Type") {
            var advtypecol = x;
        }
        if (fileObjs.bpdata[0][x] == "AdvName") {
            var advname = x;
        }
        if (fileObjs.bpdata[0][x] == "First Name") {
            var fnIdx = x;
        }
        if (fileObjs.bpdata[0][x] == "Last Name") {
            var lnIdx = x;
        }
        if (fileObjs.bpdata[0][x] == "Date Completed") {
            var dtcol = x;
        }
        if (fileObjs.bpdata[0][x] == "Version") {
            var vercol = x;
        }
    }

    var lasttype = 'start';
    var lastMBname = 'start';
    var lastScout = 'start';
    var newstart = recordPtr.start;
    var thisScout;
    var scoutID = '';
    var thisDate = '';
    var lastDate = 'start';
    var thisMB = '';
    var thisType = '';
    var lastRec = 'start';
    var newstart = -1;
    var goodRecord = false;
    var thisYr = '';

    for (var rowcnt = recordPtr.start; rowcnt < fileObjs.bpdata.length; rowcnt++) {

        thisScout = fileObjs.bpdata[rowcnt][fnIdx] + ' ' + fileObjs.bpdata[rowcnt][lnIdx];
        thisDate = fileObjs.bpdata[rowcnt][dtcol];
        thisMB = fileObjs.bpdata[rowcnt][advname];
        thisType = fileObjs.bpdata[rowcnt][advtypecol];
        thisYr = fileObjs.bpdata[rowcnt][vercol];

        thisRec = thisScout + thisDate + thisMB + thisType + thisYr;

        if (thisRec != lastRec) {
            // end of a record
            if (goodRecord == true) {
                // break to process, it is the end of a good record
                break;
            } else {
                //continue on, simply the end of a don't care record
            }
            goodRecord = false;
            // possible start of a new record
            if (thisType == recType) {
                // yes, met one criteria for the start of a new record
                // also check if this is on the ignore list...

                //				mbArr[x].bpreq ='x'


                // how about we make sure this is a recognizable mb as a record criteria
                if (BPnameToMBid(thisMB) != '') {
                    if (lookupBPScout(thisScout) != -1) {
                        scoutID = lookupBPScout(thisScout);
                        //met a second criteria for the start of a new record
                        if (checkEligible(scoutID, thisMB) == true) {
                            if (scoutHasBadge(scoutID, BPnameToMBid(thisMB)) == false) {
                                goodRecord = true;
                                newstart = rowcnt;
                                lasttype = recType;
                                lastScout = thisScout;
                                lastDate = thisDate;
                            } else {
                                //console.log(thisScout +" previously completed " +thisMB +' in Scoutbook, re-import skipped');
                                appErr(thisScout + " previously completed " + thisMB + ' in Scoutbook, re-import skipped', 'importErrLI');
                                //var msg=$('#importErrLI').text() + '\n' + thisScout + " previously had an approved " +thisMB +' in Scoutbook, re-import skipped';
                                //$('#importErrLI').text(msg);
                            }
                        } else {
                            //console.log("Scout ineligible to have records imported for " +thisMB +' due to probable existing merit badge already started in Scoutbook');
                            //var msg=$('#importErrLI').text() + '\n' + thisScout + ' is ineligible to have records imported for ' +thisMB +' due to probable existing merit badge already started in Scoutbook';
                            //$('#importErrLI').text(msg);
                            appErr(thisScout + ' already started ' + thisMB + ' using a different version in Scoutbook, re-import skipped', 'importErrLI');
                        }
                    } else {
                        //console.log("Unrecognized Scout records skipped for " +thisMB);
                    }
                } else {
                    //console.log('Skipping records for unrecognized merit badge ' + thisMB);
                }

            } else {
                //console.log("Record ignored for " + thisType + ' ' + thisMB);
            }
            lastRec = thisRec;
        }
    }

    if (goodRecord == true) {
        recordPtr.end = rowcnt;
        recordPtr.start = newstart;
        //console.log('Loading records ' + newstart + '-' + rowcnt + ' for ' +lastScout + ' ' +lastMBname + ' ' + lastDate);
        resolveReqs(scoutID, lastScout, leaderapprv, pageid);
    } else {
        //no more records for requirements found
        recordPtr.end = -1;
        recordPtr.start = -1;
        $.mobile.loading('hide');
        //alert(' No more Partials');
        //processBPApprovedMB();
        if (mbfirst == false && $('#meritBadgeComplete', pageid).val() == 'on') {
            completeMBScout(leaderapprv, pageid);
        } else {
            //checkBPAdvancement();

            closeImport(pageid); //termimportreq
        }
    }

}


function appErr(msg, id) {
    var node = document.createElement("DIV"); // Create a <div> node
    var textnode = document.createTextNode(msg); // Create a text node
    node.appendChild(textnode); // Append the text to <div>
    document.getElementById(id).appendChild(node);
}
/*compares given Scoutbook requirements and requirements from Excel file for a given merit badge
'  Subroutine compares given Scoutbook requirements and requirements from Excel file for a given merit badge
'
' Black Pug       Scoutbook      resolution
' #7a             #7a1 #7a2      mark both scoutbook items
' #7a1            #7a            depends if Black Pug expects a 7a2 - does this occur?  Yes, e.g. BP camping has 8a1-3,  SB has 8a
'                                Best course? Flag as exception during import and let user decide
' #7a1            #7a[1]
' {#7                            Black Pug has both 7 and 7a.  If no match on Scoutbook, Need to look ahead; if next item is a 7(x) in Black Pug, ignore
'  #7a            #7a
'  #7b            #7b

'#6a1            #6a Body
'#6a2            #6a something

'  input
recordPtr.start and recordPtr.end  ptrs to bpdata
' mbname  Name of the merit badge from the excel file
' BPDreq   list of requirements from excel file ( e.g. #1, #2a...)  fileObjs.bpdata  fileObjs.bpdata[row][ReqTag]   BPDreq(row)
'    ** the following lists are all the same length as are associated directly
' scoutbookreq  list of requirements from scoutbook ( e.g. #1, #2a...)		mbArr[x].name, mbArr[x].reqlist, reqlist[y].reqTag
' reqTxt        list of requirement texts from scoutbook					mbArr[x].name, mbArr[x].reqlist, reqlist[y].reqTxt
' reqnm         list of the merit badge names from scoutbook.  List is the same length as reqtxt  mbArr[x].name
' reqids        list of teh req IDs for each merit badge from scoutbook		mbArr[x].name, mbArr[x].reqlist, reqlist[y].reqid
'
  recCnt		count of BP requirements for the current MB  = 1+recordPtr.end - recordPtr.start;
' input/output
' reqExcept  Where scoutbook and excel don't directly match, lists excel requirements in same list location as the resultant matched scoutbook requirement

' output

' resultreqID  resultObj.lst.reqID A list of requirement IDs,  THis list may differ from the length of BPDreq.  The ID's are resultant matches to the excel reqs.
' resultcomp  resultObj.lst.date resulatnt dates
' resulttag  resultObj.lst.tag resultant tags
' returns count of requirement ids
'
' resultdts

*/
function resolveReqs(scoutID, scoutname, leaderapprv, pageid) { //tested used  NA 2017
    //nbconsole.log(13,leaderapprv);
    var matched = false;
    var movx = 0;
    var rObj = {};
    //var sublist=[];
    var resObj = {
        matchcnt: '',
        nreq: '',
        sublist: []
    }; //properties  matchcnt, nreq

    var recCnt = recordPtr.end - recordPtr.start;

    for (var x = 0; x < fileObjs.bpdata[0].length; x++) {
        if (fileObjs.bpdata[0][x] == "ReqTag") {
            var reqtag = x;
        }
        if (fileObjs.bpdata[0][x] == "Date Completed") {
            var compdate = x;
        }
        if (fileObjs.bpdata[0][x] == "AdvName") {
            var AdvName = x;
        }
        if (fileObjs.bpdata[0][x] == "Version") {
            var vercol = x;
        }
    }

    var ign;
    // look at each requirement listed for the mb from BP
    for (var x = recordPtr.start; x < recordPtr.end; x++) {
        movx = 0;

        var mbname = fileObjs.bpdata[x][AdvName];
        if (fileObjs.bpdata[x][reqtag] == '') {
            //BPDreq(x) = "" Then Exit For
            break;
        }



        matched = false;
        //'Set istart to point to the first entry for mbname in the reqn list
        // matched the BPD name to the scoutbook name so we can get scoutbook ids

        for (var istart = 0; istart < mbArr.length; istart++) {
            if (mbArr[istart].bpmbname == mbname) {
                //if (mbArr[istart].bpreq != 'x')

                break; // break on good badge to retain istart ptr to it

            }
        }

        if (istart == mbArr.length) {
            //alert('program error resolveReqs');
        }

        var CurrentReq = fileObjs.bpdata[x][reqtag];

        //'we need to look to see if BP had more detail than SB.  In this case, we need to look ahead
        //' and replace the list of BP requirements with a single requirement
        resObj.matchcnt = 0; //' will have the number of reqs that must match
        resObj.nreq = '';
        var reqlist = '';

        var lstcnt = 0;


        //ugh
        var subcnt = 0;

        if ((subcnt >= resObj.matchcnt) && (resObj.matchcnt > 1)) {
            // We have a req to use

            //console.log('Condensed Black Pug Requirements ' + reqlist + ' to Scoutbook requirement');

            CurrentReq = resObj.nreq;
            resObj.sublist[0] = resObj.nreq;

            movx = subcnt - 1;

            subcnt = 1;
        } else {

            resObj.sublist[0] = CurrentReq;
            subcnt = 1;

        }

        // ' Look for simplest match first

        for (var scnt = 0; scnt < subcnt; scnt++) {
            for (var z = 0; z < mbArr[istart].reqlist.length; z++) {

                if (resObj.sublist[scnt].toLowerCase() == mbArr[istart].reqlist[z].reqTag.toLowerCase()) {
                    //'match found, save the scoutbook ID for the requirement

                    rObj.reqID = mbArr[istart].reqlist[z].reqid;
                    rObj.tag = mbArr[istart].reqlist[z].reqTag;
                    //rObj.date =  fileObjs.bpdata[x][compdate];  // recMbCompLst[x];
                    toSaveObj.lst.push(JSON.parse(JSON.stringify(rObj)));
                    //console.log("match", sublist(scnt), ResultTag(res), reqids(z + istart), recMbCompLst(x)
                    //'Debug.Print res & " " & resultreqID(res) & " " & sublist(scnt) & "=" & scoutbookreq(z + istart)
                    matched = true;
                    break;
                }
            }
        }

        //' Now try to associate unmatched requirements

        if (matched == false) {

            //'MsgBox "Black Pug Merit badge " & reqnm(x) & " requirement " & fileObjs.bpdata[x][reqtag] & " was not found in Scoutbook.  You need to manually match and update Scoutbook later.";
            //'Debug.Print "potential"

            //alert('Black Pug Merit badge ' + mbname + ' requirement ' + fileObjs.bpdata[x][reqtag] + ' was not found in Scoutbook.  You need to manually match and update Scoutbook later for ' + scoutID + ' ' + scoutname);
            //console.log('Black Pug Merit badge ' + mbname + ' requirement ' + fileObjs.bpdata[x][reqtag] + ' was not found in Scoutbook.  You need to manually match and update Scoutbook later for ' + scoutID + ' ' + scoutname);

            //'no matter what we tried, could not get a match

        } else {
            toSaveObj.scout = scoutname;
            toSaveObj.scoutid = scoutID;
            toSaveObj.id = mbArr[istart].id;
            toSaveObj.yrid = mbArr[istart].yrid;
            toSaveObj.date = fileObjs.bpdata[x][compdate];
        }
        x = x + movx; //' look ahead

    }

    getPostCookie(leaderapprv, pageid);
}

/* Aync function for mb reqs.  Ajax call to meritbadgequickentry2.asp?PatrolID=&MeritBadgeID=' &MeritBadgeVersionID='   gets either a cookie or sets the Referer field for the next operation, either way, its needed
 */
function getPostCookie(leaderapprv, pageid) { //tested used
    //nbconsole.log(14,leaderapprv);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            closeImport(pageid);
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(getPostCookie, leaderapprv, pageid, '', '', '', '', '', ''); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            // cookie loaded, call to Post
            //console.log('postcookie response rcvd');
            setTimeout(function() {
                postReqs(leaderapprv, pageid);
            }, 100);

        }
        if (this.readyState == 4 && this.status != 200 && this.status == 500) {
            //console.log('Server Error ' +servErrCnt);
            if (servErrCnt > maxErr) {
                $.mobile.loading('hide');
                alert('Halted due to excessive Server errors');
                closeImport(pageid);
                return;
            }
            servErrCnt++;
            setTimeout(function() {
                getPostCookie(leaderapprv, pageid);
            }, 1000); //just repeat
        }
    };
    var unitID = '';
    if (document.baseURI.match(/UnitID=\d+/) != null) {
        unitID = document.baseURI.match(/UnitID=(\d+)/)[1];
    }
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/advancement/meritbadgequickentry2.asp?UnitID=' + unitID + '&PatrolID=&MeritBadgeID=' + toSaveObj.id + '&MeritBadgeVersionID=' + toSaveObj.yrid;

    //console.log('getPostCookie Getting '+ url);
    xhttp.open("GET", url, true);
    xhttp.responseType = 'document';

    xhttp.send();
    xhttp.onerror = function() {
        errHandle(getPostCookie, leaderapprv, pageid, '', '', '', '', '', '');
        if (servErrCnt > maxErr) {
            closeImport(pageid);
        }
    };
}

/* Async function, posts requirements.  Ajax Post meritbadgequickentry2.asp
 */
function postReqs(leaderapprv, pageid) { //tested used
    //nbconsole.log(15,leaderapprv);
    //console.log('post partials ' +MBidToName(toSaveObj.id) + ' for ' + scoutIDtoName(toSaveObj.scoutid));
    var DataToPost = 'Action=Submit&MeritbadgeID=' + toSaveObj.id + '&MeritBadgeVersionID=' + toSaveObj.yrid + '&DateCompleted=' + encodeURI(toSaveObj.date) + '&LeaderApproved=' + leaderapprv + '&ScoutUserID=' + toSaveObj.scoutid;
    // add reqs to data
    for (var x = 0; x < toSaveObj.lst.length; x++) {
        DataToPost += '&MeritBadgeRequirementID=' + toSaveObj.lst[x].reqID;
    }
    DataToPost += '&Comments=';

    $.mobile.loading('hide');
    $.mobile.loading('show', {
        theme: 'a',
        text: 'Saving Requirements for ' + MBidToName(toSaveObj.id) + ' ' + toSaveObj.scout + '...',
        textonly: false
    });
    //console.log('POST ' + DataToPost);
    var unitID = '';
    if (document.baseURI.match(/UnitID=\d+/) != null) {
        unitID = document.baseURI.match(/UnitID=(\d+)/)[1];
    }

    if (mbDebug == true) {
        DebugsaveReqs('Saving Requirements for ' + MBidToName(toSaveObj.id) + ' ' + toSaveObj.scout + '...' + DataToPost, leaderapprv);
        return;
    }
    //Array("Action", "MeritbadgeID", "MeritBadgeVersionID", "DateCompleted", "LeaderApproved", "ScoutUserID", "MeritBadgeRequirementID", "Comments"), _
    //Array("Submit", MeritBadgeID, MeritBadgeVer, URLEncode(datelist(eachdate)), "1", scoutid, reqString, ""))

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            closeImport(pageid);
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(postReqs, leaderapprv, pageid, '', '', '', '', '', ''); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            // Check for Success
            if (this.response.match(/Success/) == null) {
                //alert('Error Posting meritbadgequickentry2.  Success response not received.');
                //saveErrLog += 'Error Posting meritbadgequickentry2 ' +MBidToName(toSaveObj.id)+ ' '+toSaveObj.scout+'...' + DataToPost + '\n';
            }

            if (recordPtr.start != -1) {
                recordPtr.start = recordPtr.end;
                setTimeout(function() {
                    loadBPDMB('Merit Badge Requirement', leaderapprv, pageid);
                }, 100);
            } else {
                /* done going thru requirements*/


                $.mobile.loading('hide');

                if (mbfirst == false && $('#meritBadgeComplete', pageid).val() == 'on') {
                    //console.log('Requirements import complete');
                    $.mobile.loading('show', {
                        theme: 'a',
                        text: 'Saving Completed Badges...',
                        textonly: false
                    });
                    //setTimeout('//processBPApprovedMB()',200);
                    setTimeout(function() {
                        completeMBScout(leaderapprv, pageid);
                    }, 200);
                } else {
                    //alert('No more Requirements to import. Import Completed.');
                    closeImport(pageid); //termimportreq
                    //checkBPAdvancement();
                }

            }

            // clear the post object
            toSaveObj = {
                lst: [],
                scoutid: '',
                id: '',
                yrid: '',
                date: '',
                scout: ''
            };
        }
        if (this.readyState == 4 && this.status != 200 && this.status == 500) {
            //console.log('Server Error ' +servErrCnt);
            if (servErrCnt > maxErr) {
                $.mobile.loading('hide');
                alert('Halted due to excessive Server errors');
                closeImport(pageid);
                return;
            }
            servErrCnt++;
            setTimeout(function() {
                PostReqs(leaderapprv, pageid);
            }, 1000); //just repeat
        }

    };


    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/advancement/meritbadgequickentry2.asp?UnitID=' + unitID + '&PatrolID=&MeritBadgeID=' + toSaveObj.id + '&MeritBadgeVersionID=' + toSaveObj.yrid;
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(DataToPost);

    xhttp.onerror = function() {
        errHandle(postReqs, leaderapprv, pageid, '', '', '', '', '', '');
        if (servErrCnt > maxErr) {
            closeImport(pageid);
        }
    };
}

/*debug so reqs not actually posted*/
function DebugsaveReqs(topost, leaderapprv) {
    debugData += topost + '\n';
    if (recordPtr.start != -1) {
        recordPtr.start = recordPtr.end;
        setTimeout(function() {
            loadBPDMB('Merit Badge Requirement', leaderapprv, pageid);
        }, 100);
    } else {
        /* done going thru requirements*/


        $.mobile.loading('hide');

        if (mbfirst == false && $('#meritBadgeComplete', pageid).val() == 'on') {
            //console.log('Requirements import complete');
            $.mobile.loading('show', {
                theme: 'a',
                text: 'Saving Completed Badges...',
                textonly: false
            });
            //setTimeout('//processBPApprovedMB()',200);
            setTimeout(function() {
                completeMBScout(leaderapprv, pageid);
            }, 200);
        } else {
            //alert('No more Requirements to import. Import Completed.');
            closeImport(pageid); //termimportreq
            //checkBPAdvancement();
        }

    }

    // clear the post object
    toSaveObj = {
        lst: [],
        scoutid: '',
        id: '',
        yrid: '',
        date: '',
        scout: ''
    };


}



/*

goal is to look through bp data, match any mb's to mbArr

Loop through all bp
if not handled as matched or unmatched
	if match found, update mbArr
	otherwise save in unmatched array
find next

ontimer call
*/

/*
  function matches merit badge names between excel file and scoutbook.  Used intelligent matching techniqes and prompts user if
  needed to manually match

 input
 global  fileObjs.bpdata  name of excel file
 mbArr     array of merit badge names from scoutbook
 mbcnt      count of merit badge names from scoutbook

 output
 BPDmbArr  list of same length as mbArr, contains matched names at matching locations to scoutbook names - now just properties of mbArr
   - add property to mbArr
 mbyr       list of version years from excel file, laded with matches at same locations

 */

/* function compares mb names in bp to mb names from scoutbook
  uses scoutbook Merit Badge Names and IDs provided in mbArr
  uses Black Pug Merit Badge Names and version years given in the Global fileObjs.bpdata

  Matches names, and updates mbArr matching objects with properties and values for the BPD MB name and year ( .BPDyr .bpmbname)

  if it shows up in ignorebadge then don't bother

*/
function matchMBs(pageid, leaderapprv) { //tested used
    //nbconsole.log(16,leaderapprv);
    var mapname = '';
    var found;
    var mbObj = {
        name: '',
        id: ''
    };
    var mbYr;

    var mbNameReq;
    var mbNamereq1 = 'xx';
    var mbname;
    var skip = false;

    var mbmatches = 0;
    var compcol = 8;
    var vercol = 7;
    var advcol = 6;
    var advtypecol = 5;
    var resObj = {};

    unmatchedmb.length = 0;
    //  For x = 0 To mbcnt - 1
    //     With Meritbadge.ListBox1
    //             .AddItem mbArr(x)
    //     End With
    //  Next x

    //find the Advancement Type column and Advancement Columns

    for (var x = 0; x < fileObjs.bpdata[0].length; x++) {
        if (fileObjs.bpdata[0][x] == "Advancement") {
            advcol = x;
        }
        if (fileObjs.bpdata[0][x] == "Advancement Type") {
            advtypecol = x;
        }
        if (fileObjs.bpdata[0][x] == "Version") {
            vercol = x;
        }
    }

    // For each Black Pug record might be quicker t build array of unique bp mbs
    for (var rowcnt = 0; rowcnt < fileObjs.bpdata.length; rowcnt++) {

        // that is labeled as a Merit Badge
        if (fileObjs.bpdata[rowcnt].length < advtypecol) {} else {
            if (fileObjs.bpdata[rowcnt][advtypecol].match(/Merit Badge/) != null) {

                //strip the merit badge name - anything preceding a #
                //	if (fileObjs.bpdata[rowcnt][advcol].indexOf('#') != -1) {
                //		mbNameReq = fileObjs.bpdata[rowcnt][advcol].match(/([\w ]+) #/)[1];
                //	} else {
                //		mbNameReq = fileObjs.bpdata[rowcnt][advcol];
                //	}
                resObj = {};
                splitAdvCol(fileObjs.bpdata[rowcnt][advcol], resObj);
                mbNameReq = resObj.bpname;
                mbYr = fileObjs.bpdata[rowcnt][vercol];

                if (mbNameReq == mbNamereq1) {
                    //Already handled
                    //alert('handled');
                } else {
                    mbname = mbNameReq;
                    for (var z = 0; z < mbArr.length; z++) {

                        if (mbname == mbArr[z].name) {

                            //BPDmbArr(z) = mbname;
                            mbArr[z].bpmbname = mbname;
                            //BPDMbYr(z) = mbYr;
                            mbArr[z].BPDyr = mbYr;

                            break;
                        }
                    }
                }

                /*
                
                
                
                
                if (mbNameReq == mbNamereq1) {
                	//Already handled
                	//alert('handled');
                } else {

                	mbname = mbNameReq;
                	mbNamereq1 = mbNameReq;
                	// Check for match in mbname first
                	skip = false;
                	if (mapname != '') {
                	   for (var w=0; w<mbArr.length;w++) {
                		 if (mbArr[0].name == mbname) {
                		   //already handled
                		 //  BPDmbArr(w) = mbArr[0].name;
                		 //  BPDMbYr(w) = mbArr[0].yr;
                		   mbmatches = mbmatches + 1;
                		   skip = true;
                		   break;
                		 }
                	   }
                	}

                	if (skip == false) {
                		found = false;
                		for (var z = 0;z<mbArr.length;z++) {

                		   if (Intellimatch(mbname, mbArr[z].name) == true) {

                			//BPDmbArr(z) = mbname;
                			mbArr[z].bpmbname=mbname;
                			//BPDMbYr(z) = mbYr;
                			mbArr[z].BPDyr=mbYr;
                			offst = z;
                			found = true;
                			mbmatches = mbmatches + 1;
                			break;
                		  }
                		}

                		if (found == false) {
                			mbObj.name=mbname;
                			mbObj.yr=mbYr;
                			  unmatchedmb.push(JSON.parse(JSON.stringify(mbObj)));
                		}
                	}	//skip

                } //End If previos

                
                */
            } // if merit badge record
        }

    }

    //setTimeout("matchMB('#PageX')", 1000);

    // Handle any unmatched mb names
    if (unmatchedmb.length > 0) {
        //console.log("ERROR");
    }
    //next step?
    //alert('mbs all match');

    setTimeout(function() {
        getScoutMBs(0, leaderapprv, pageid);
    }, 200); // was tag_ignores



}

/* attempts to split advcol into a name and a req */

function splitAdvCol(bpval, resObj) {
    if (bpval.indexOf('#') != -1) {
        var sv = bpval.split('#');
        resObj.bpname = sv[0].slice(0, -1);
        resObj.req = '#' + sv[1];
    } else {
        resObj.bpname = bpval;
        resObj.req = '';
    }
    return true;
}



/* Compares two strings to make a choice if they should match
 Function tries to match up string 2 with string1.  String2 may contain abbreviations or miss the word "the"
 string 1 is from excel.  If its length is 1, direct match only

 input
 string1 long unabbreviated text
 string2 text containing possible abbreviations

 output
 returns true if a match is guessed
*/
function Intellimatch(string1, string2) { //tested used

    var wordlist1 = [];
    var wordcnt1 = 0;
    var wordlist2 = [];
    var wordcnt2 = 0;
    var cmpcnt = 0;
    var res = false;
    var altwordlist = '';
    var Intellimatchres;

    wordlist1 = string1.match(/([a-zA-Z\.]+)/g);
    wordcnt1 = wordlist1.length;

    wordlist2 = string2.match(/([a-zA-Z\.]+)/g);
    wordcnt2 = wordlist2.length;

    if (wordcnt1 == 1) {
        if (string1 == string2) {
            return true;
        }
        return false;
    }

    cmpcnt = wordcnt1;

    if (wordcnt1 > wordcnt2) {
        cmpcnt = wordcnt2;
    } else if (wordcnt2 > wordcnt1) {
        cmpcnt = wordcnt1;
    }

    res = true;
    for (var x = 0; x < cmpcnt; x++) {
        if (wordlist1[x] != wordlist2[x]) {
            res = false;
        }
    }

    if (res == true) {
        return true;
    }

    res = true;

    //check if any abbreviations

    if (string1.indexOf('.') != -1) {
        //console.log("string1 has a .");
        for (var x = 0; x < cmpcnt; x++) {
            if (wordlist1[x].indexOf('.') != -1) {
                //Debug.Print wordlist1(x) & " has a ."
                if (wordlist1[x][0] != wordlist2[x][0]) {
                    res = false;
                }
            } else if (wordlist1[x] != wordlist2[x]) {
                res = false;
            }
        }

        if (res == true) {
            return true;
        }
    }

    res = true;

    if (string2.indexOf('.') != -1) {
        //'Debug.Print "string2 has a ."
        for (var x = 0; x < cmpcnt; x++) {
            if (wordlist2[x].indexOf('.') != -1) {
                //'Debug.Print wordlist2(x) & " has a ."
                if (wordlist1[x][0] != wordlist2[x][0]) {
                    res = false;
                }
            } else if (wordlist1[x] != wordlist2[x]) {
                res = false;
            }
        }
        if (res == true) {
            return true;
        }
    }

    // what if one phrase has the word "the".

    skip = false;
    for (x = 0; x < wordcnt1 + 1; x++) {
        if (wordlist1[x] == 'the') {
            //' skip and remember
            //'Debug.Print "skip on " & x
            skip = true;
        } else {
            altwordlist = altwordlist + wordlist1[x] + ' ';
        }
    }

    //'Debug.Print "altwordlist " & altwordlist
    res = false;

    if (skip == true) {
        res = Intellimatch(altwordlist.trim(), string2);
    }
    if (res == true) {
        return true;
    }

    altwordlist = '';
    skip = false;
    for (var x = 0; x < wordcnt2 + 1; x++) {

        if (wordlist2[x] == 'the') {
            //' skip and remember
            //'Debug.Print "skip on " & x
            skip = true;
        } else {
            altwordlist = altwordlist + wordlist2[x] + ' ';
        }
    }

    //'Debug.Print "altwordlist " & altwordlist
    res = false;

    if (skip == true) {
        res = Intellimatch(string1, altwordlist.trim());
    }
    if (res == true) {
        return true;
    }

    return false;

}

/*Async function.  Purpose is to populate mbArr with year IDs.

   

'  function looks up version years and associated versionyear ids from scoutbook for each merit badge in the Black Pug file
'  When year from excel file doesn't match a year in Scoutbook, the user is prompted to select a scoutbook version year

'
'  input

'  mbcnt  - coutn of merit badges in Scoutbook  mbArr.length
'  BPDwb   name of excel file
'  ** each of the following lists is the same length and each index entry is asociated
'  mbid(x)   list of merit badge ids from scoutbook - mbArr[x].id
'  BPDmblist list of merit badge names from excel file.  THese names are adjacent to the Scoutbook name - mbArr[x].bpmbname
'  mbyr  list of version years from the bp excel file  mbArr[x].BPDyr

'  output
'  yrid -list of same lenght as BPDmblist -  matched ID for mbyr, even if manually matched  Updates mbArr items with new property mbArr[x].yrid
'  returns True if able to retrieve years from Scoutbook
'
*/
function getYrID(mbArrPtr, leaderapprv, pageid) { //tested used
    //nbconsole.log(17,leaderapprv);
    var verId = [];
    var yrTxt = [];
    var SByr;
    var NameStr;
    var ContentStr;
    var cnt = 0;
    var yrcnt = 0;
    var newPtr = -1;
    var errmbArrPtr = mbArrPtr;

    for (var x = mbArrPtr; x < mbArr.length; x++) {
        // For each merit Badge listed in Scoutbook

        // Need to choose the year from Scoutbook we need to load.
        // This is where this utility is getting a little sketchy...  it ASSUMES that the Black Pug file only has ONE version of a given merit badge PER FILE
        if (mbArr[x].bpmbname != '') { //was undefined
            //if (mbArr[x].bpreq != 'x')


            newPtr = x;
            break; // break on good badge to retain istart ptr to it

        }
    }

    if (newPtr == -1) {
        //no more found, we are done
        //alert('have all yr ids, do next thing...');
        $.mobile.loading('hide');
        $.mobile.loading('show', {
            theme: 'a',
            text: 'Loading merit badge requirements...',
            textonly: false
        });
        getSBMeritbadgeReqInfo(0, leaderapprv, pageid);
        return;
    }

    mbArrPtr = x + 1;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(getYrID, mbArrPtr, leaderapprv, pageid, '', '', '', ''); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            //$('label[for*="meritBadgeVersion"]').attr('for',(function(index,currentvalue) {console.log(}
            yrcnt = 0;
            $('label[for*="meritBadgeVersion"]', this.response).each(function() {
                yrTxt[yrcnt] = $(this).text().trim();
                verId[yrcnt] = '';
                if ($(this).attr('for').match(/\d+/) != null) {
                    verId[yrcnt] = $(this).attr('for').match(/\d+/)[0];
                }
                yrcnt++;
            });

            if (yrcnt == 0) {
                //alert('Unable to retrieve Merit Badge Version information from Scoutbook for ' & mbArr[x].bpmbname);
                return;
            }


            for (var z = 0; z < yrcnt; z++) {
                //console.log(yrTxt[z] + ' ' + verId[z]);
                if (yrTxt[z] == mbArr[x].BPDyr) {

                    mbArr[x].yrid = verId[z];
                    SByr = mbArr[x].BPDyr; // For information purposes only, remember the Scoutbook Year

                }
            }



            if (mbArr[x].yrid == '') { // was undefined
                //alert('Unable to match version in Scoutbook with Black Pug ' + mbArr[x].BPDyr + ' ' + mbArr[x].bpmbname + ' version  ');
                //mbArr[x].bpreq='x';
                mbArr[x].bpreq.push(mbArr[x].BPDyr);
                //delete mbArr[x].bpmbname;	// remove the property so this merit badge will be skipped
                //return;
            } // yrid is blank

            //var onVar = setTimeout(getYrID(mbArrPtr),100);	//process next
            setTimeout(function() {
                getYrID(mbArrPtr, leaderapprv, pageid);
            }, 100);
        }
        if (this.readyState == 4 && this.status != 200 && this.status == 500) {
            //console.log('Server Error ' +servErrCnt);
            if (servErrCnt > maxErr) {
                $.mobile.loading('hide');
                alert('Halted due to excessive Server errors');
                return;
            }
            servErrCnt++;
            //mbArrPtr=errmbArrPtr;
            setTimeout(function() {
                getYrId(errmbArrPtr, leaderapprv, pageid);
            }, 1000); //reset 
        }
    };

    $.mobile.loading('hide');
    $.mobile.loading('show', {
        theme: 'a',
        text: 'Loading merit badge requirement version for ' + mbArr[x].name + '...',
        textonly: false
    });

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/advancement/meritbadgequickentry2.asp?PatrolID=&MeritBadgeID=' + mbArr[x].id;
    //console.log('getYrID Getting '+ url);
    xhttp.open("GET", url, true);
    xhttp.responseType = 'document';

    xhttp.send();
    xhttp.onerror = function(pageid) {
        errHandle(getYrID, mbArrPtr, leaderapprv, pageid, '', '', '', '');
        if (servErrCnt > maxErr) {
            closeImport();
        }
    };

}

function getbpmbyr(bpmbname) { //not used
    for (var x = 0; x < fileObjs.bpdata[0].length; x++) {
        if (fileObjs.bpdata[0][x] == "AdvName") {
            var nm = x;
        }
        if (fileObjs.bpdata[0][x] == "Version") {
            var vercol = x;
        }
    }

    for (var x = 0; x < fileObjs.bpdata.length; x++) {
        if (fileObjs.bpdata[x][nm] == bpmbname) {
            return fileObjs.bpdata[x][vercol];
        }
    }
    return '';
}

/* Async function.  Ajax to meritbadgequickentry2.asp for given mb and version to get requirements
'
'  This function gets requirement informatuion from scoutbook for a given merit badge and version and appends the data as a reqlist property of regObjs to mbArr
'  hasn't yet been added
'
'  input
mbArr
mbArrPtr - initilaly to 0
'
'  output
'  the mb object that exists in both Black Pug and Scoutbook gets the mblist property appended
	mblist is an array of reqObj objects
	These objsect have the following properties:
	reqid     requirement ids
    reqtag    requirement numbers like #3a
    reqTxt    requirement strings containing text about the requirement

'

*/
function getSBMeritbadgeReqInfo(mbArrPtr, leaderapprv, pageid) { //tested used
    //nbconsole.log(18,leaderapprv);
    var nreqid = [];
    var nreqTag = [];
    var nreqTxt = [];
    var reqObj = {
        reqTag: '',
        reqid: '',
        reqTxt: ''
    };
    var TReqCnt = 0;

    var NameStr;
    var ContentStr;
    var cnt = 0;
    var newPtr = -1;
    var errmbArrPtr = mbArrPtr;

    for (var x = mbArrPtr; x < mbArr.length; x++) {
        // For each merit Badge listed in Scoutbook

        if (mbArr[x].bpmbname != '') { // was undefined
            //if (mbArr[x].bpreq != 'x')
            //	newPtr=x;
            //	break;
            //

            newPtr = x;
            break; // break on good badge to retain istart ptr to it


        }
    }

    if (newPtr == -1) {
        //no more found, we are done
        $.mobile.loading('hide');
        $.mobile.loading('show', {
            theme: 'a',
            text: 'Saving merit badge partial data...',
            textonly: false
        });
        recordPtr.start = 1; // skip header row
        loadBPDMB('Merit Badge Requirement', leaderapprv);

        //alert('have all mb requirements, do next thing...');
        return;
    }
    mbArrPtr = x;
    var MeritBadgeID = mbArr[x].id;
    var MeritBadgeVer = mbArr[x].verId;

    var mbname = mbArr[x].name;

    for (var arrPtr = 0; arrPtr < mbArr.length; arrPtr++) {
        if (mbArr[arrPtr].name == mbname) {
            if (mbArr[arrPtr].reqlist.length != 0) { // was .reqlist != undefined
                //reqlist property exists for this meritBadge
                // don't try to get again
                return mbArr[arrPtr].reqlist.length;
            }
            break;
        }

    }

    mbArr[arrPtr].reqlist = [];

    //' see if reqs already loaded for this name

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(getSBMeritbadgeReqInfo, mbArrPtr, leaderapprv, pageid, '', '', '', ''); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            cnt = 0;

            $('label[for*="meritBadgeRequirementID"]', this.response).each(function() {
                nreqid[cnt] = '';
                if ($(this).attr('for').match(/\d+/) != null) {
                    nreqid[cnt] = $(this).attr('for').match(/\d+/)[0]; //nreqid(cnt)
                }
                nreqTag[cnt] = $(this).contents().filter(function() { //used to be 'span',this
                    return this.nodeType == 3;
                })[0].nodeValue.trim(); //nreqTag[cnt]
                nreqTxt[cnt] = $('div', this).text().trim(); //nreqTxt[cnt]
                cnt++;
            });

            //reqTags may have bracket that need to be stripped out

            for (var x = 0; x < cnt; x++) {

                // nreqTag[x] = nreqTag[x].replace('[', '');
                //nreqTag[x] = nreqTag[x].replace(']', '');

                reqObj.reqTag = nreqTag[x];
                reqObj.reqid = nreqid[x];
                reqObj.reqTxt = nreqTxt[x];

                mbArr[arrPtr].reqlist.push(JSON.parse(JSON.stringify(reqObj)));

            }
            mbArrPtr++;

            //build list of scouts eligible
            inEligibleScouts(MeritBadgeID, this.response);

            setTimeout(function() {
                getSBMeritbadgeReqInfo(mbArrPtr, leaderapprv, pageid);
            }, 100);

        }
        if (this.readyState == 4 && this.status != 200 && this.status == 500) {
            errHandle(getSBMeritbadgeReqInfo, mbArrPtr, leaderapprv, pageid, '', '', '', '');
        }

    };
    //    Set document = getPageContent(HttpReq, "https://www.scoutbook.com/mobile/dashboard/admin/advancement/meritbadgequickentry2.asp?PatrolID=&MeritBadgeID=" & MeritBadgeID & " &meritBadgeVersionID" & MeritBadgeVer)

    $.mobile.loading('hide');
    $.mobile.loading('show', {
        theme: 'a',
        text: 'Loading merit badge requirements for ' + mbname + '...',
        textonly: false
    });
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/advancement/meritbadgequickentry2.asp?PatrolID=&MeritBadgeID=' + mbArr[x].id + '&MeritBadgeVersionID=' + mbArr[x].yrid;

    //console.log('getSBMeritbadgeReqInfo Getting '+ url);
    xhttp.open("GET", url, true);
    xhttp.responseType = 'document';

    xhttp.send();
    xhttp.onerror = function() {
        //window.console &&console.log("error QE " + xhttp.status);
        //alert("Uh-oh... Connection Error - Import Halted. (GET QE page for "+mbname+" requirements failed. " + xhttp.status);
        if (servErrCnt > maxErr) {
            $.mobile.loading('hide');
            alert('Halted due to excessive Server errors');
            closeImport(pageid);
            return;
        }
        servErrCnt++;
        setTimeout(function() {
            getSBMeritbadgeReqInfo(mbArrPtr, leaderapprv, pageid);
        }, 1000); //reset 

    };

}


/* function builds list of scouts that have completed a MB in BP and have NOT already completed the given merit in Scoutbook
 */
function sortEligScout(eligible, mbid, date) { //tested used
    var mbname, bpscout, scoutID;
    for (var x = 0; x < fileObjs.bpdata[0].length; x++) {

        if (fileObjs.bpdata[0][x] == "Advancement Type") {
            var advtypecol = x;
        }
        if (fileObjs.bpdata[0][x] == "Advancement") {
            var adv = x;
        }
        if (fileObjs.bpdata[0][x] == "Date Completed") {
            var dt = x;
        }
        if (fileObjs.bpdata[0][x] == "First Name") {
            var fn = x;
        }
        if (fileObjs.bpdata[0][x] == "Last Name") {
            var ln = x;
        }
    }
    var scoutID;
    for (var x = 0; x < fileObjs.bpdata.length; x++) {
        if (fileObjs.bpdata[x][advtypecol] == 'Merit Badge') {
            // find the mbid
            mbname = MBidToBPName(mbid);
            if (fileObjs.bpdata[x][adv] == mbname) {
                //got a scout
                bpscout = fileObjs.bpdata[x][fn] + ' ' + fileObjs.bpdata[x][ln];
                //get scout id
                scoutID = lookupBPScout(bpscout);
                if (scoutID != -1) {
                    // now llok in scoutArr to see if he already has the badge
                    if (scoutHasBadge(scoutID, mbid) == true) {
                        //noneligible.push([scoutID,mbid,date]);
                        appErr(bpscout + " previously had " + mbname + ' Completed in Scoutbook, re-import skipped', 'importErrLI');
                    } else {
                        eligible.push(scoutID);
                    }
                }
            }
        }
    }

}

/* function determines if scout has already completed a badge in Scoutbook*/
function scoutHasBadge(scoutid, mbid) { //tested used

    //5/30/2017 all badges ow eligible
    //return false;


    for (var x = 0; x < scoutArr.length; x++) {
        if (scoutArr[x].id == scoutid) {
            for (var y = 0; y < scoutArr[x].mbApproved.length; y++) {
                if (scoutArr[x].mbApproved[y] == mbid) {
                    return true;
                }
            }
            break;
        }
    }
    return false;
}


/*function creates a unique list of completed MBs from bpdata*/
function getmblist(indate, inArr) { //tested used
    for (var x = 0; x < fileObjs.bpdata[0].length; x++) {

        if (fileObjs.bpdata[0][x] == "Advancement Type") {
            var advtypecol = x;
        }
        if (fileObjs.bpdata[0][x] == "Advancement") {
            var adv = x;
        }
        if (fileObjs.bpdata[0][x] == "Date Completed") {
            var dt = x;
        }
    }
    for (var x = 0; x < fileObjs.bpdata.length; x++) {
        if (fileObjs.bpdata[x][advtypecol] == 'Merit Badge') {
            // find the mbid
            if (fileObjs.bpdata[x][dt] == indate) {
                var mbid = BPnameToMBid(fileObjs.bpdata[x][adv]);

                if (arrContain(inArr, mbid) == false) {
                    inArr.push(mbid);
                }
            }
        }
    }
}


/* Parses MB Req Quick Entry page to determine if scouts already started this MB using a different version*/
function inEligibleScouts(MeritBadgeID, response) { //tested used

    for (var y = 0; y < mbArr.length; y++) {
        if (mbArr[y].id == MeritBadgeID) {
            break;
        }
    }

    //mbArr[y].listscouts=[];

    var resp = $('input[name="ScoutUserID"][disabled]', response);

    for (var x = 0; x < resp.length; x++) {
        mbArr[y].scoutsAlreadyStartedMB.push(resp[x].value);
    }
}

/*Function looks up which scouts so NOT have the given MB approved in Scoutbook*/
function checkEligible(scoutID, thisMB) { //tested used
    for (var x = 0; x < mbArr.length; x++) {
        if (mbArr[x].bpmbname == thisMB) {
            for (var y = 0; y < mbArr[x].scoutsAlreadyStartedMB.length; y++) {
                if (mbArr[x].scoutsAlreadyStartedMB[y] == scoutID) {
                    return false;
                }
            }
            break;
        }
    }
    return true;
}

/*function creates a unique list of completed MB dates from bpdata*/
function createCompleteDateArr(completeMBdate) { //tested used

    for (var x = 0; x < fileObjs.bpdata[0].length; x++) {

        if (fileObjs.bpdata[0][x] == "Advancement Type") {
            var advtypecol = x;
        }
        if (fileObjs.bpdata[0][x] == "Date Completed") {
            var dt = x;
        }
    }
    for (var x = 0; x < fileObjs.bpdata.length; x++) {
        if (fileObjs.bpdata[x][advtypecol] == 'Merit Badge') {
            if (arrContain(completeMBdate, fileObjs.bpdata[x][dt]) == false) {
                completeMBdate.push(fileObjs.bpdata[x][dt]);
            }
        }
    }

    //return completeMBdate;

}



/* simple lookup functions */
// given a mbid, returns the mb name
function MBidToName(mbid) {
    for (var x = 0; x < mbArr.length; x++) {
        if (mbArr[x].id == mbid) {
            return mbArr[x].name;
        }
    }
}

// given a mb id, returns the mb name as defined in bpdata file
function MBidToBPName(mbid) {
    for (var x = 0; x < mbArr.length; x++) {
        if (mbArr[x].id == mbid) {
            return mbArr[x].bpmbname;
        }
    }
}

// given a bp style mb name, returns the mb id
function BPnameToMBid(bpname) {
    for (var x = 0; x < mbArr.length; x++) {
        if (mbArr[x].bpmbname == bpname) {
            return mbArr[x].id;
        }
    }
    return '';
}

// given a scout id, returns the scout name
function scoutIDtoName(scoutid) {
    for (var x = 0; x < scoutArr.length; x++) {
        if (scoutArr[x].id == scoutid) {
            return scoutArr[x].name;
        }
    }
    return '';
}

// given the scout id, returns the name defined in the bpdata
function scoutIDtoBPName(scoutid) {
    for (var x = 0; x < scoutArr.length; x++) {
        if (scoutArr[x].id == scoutid) {
            return scoutArr[x].bpscout;
        }
    }
    return '';
}

//given the scout name, returns the scout id
function scoutNametoID(scoutname) {
    for (var x = 0; x < scoutArr.length; x++) {
        if (scoutArr[x].name == scoutname) {
            return scoutArr[x].id;
        }
    }
    return '';
}

/*function finds scout id given the bp scout name*/
function BPscoutNametoID(bpscoutname) {
    for (var x = 0; x < scoutArr.length; x++) {
        if (scoutArr[x].bpscout == bpscoutname) {
            return scoutArr[x].id;
        }
    }
    return '';
}

/*function finds scout id given the bp scout name*/
function lookupBPScout(bpscout) {
    for (var x = 0; x < scoutArr.length; x++) {
        // not all scout records have the bpscout property
        if (scoutArr[x].bpscout != undefined) {
            if (scoutArr[x].bpscout.toLowerCase() == bpscout.toLowerCase()) {
                return scoutArr[x].id;
            }
        }
    }
    return -1;
}

function closeImportclr(pageid) {
    alert('Please note the issues listed!');
    $('#importErrLI', pageid).text('');
    closeImport(pageid);

}


function closeImport(pageid) { //tested used
    $.mobile.loading('hide');
    if ($('#importErrLI', pageid).text() != '') {
        setTimeout(function() {
            closeImportclr(pageid);
        }, 1000);
        return;
    }

    $('#buttonImportCancel', pageid).button('enable');
    $('#buttonImport', pageid).button('enable');
    //$('#BPfileSelect').button('enable');
    document.getElementById("BPfileSelect").disabled = false;
    $('#importBPMenu', pageid).popup('close');

}