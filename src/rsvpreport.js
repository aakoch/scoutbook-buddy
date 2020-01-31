// Copyright © 10/4/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.
//

//  To look at - the roster printed is for the 1stcalendar picked up.  If more than one, there should be a selection, such as the autologs? provide


var rsvpObj = {
    title: '',
    date: '',
    rsvpList: [],
    rsvpValues: [],
    leaderYes: 0,
    leaderNo: 0,
    leaderMaybe: 0,
    scoutStats: [],
    parentYes: 0,
    parentNo: 0,
    parentMaybe: 0
};

function rawDataAddRsvpRpt(data, pageid, nowDate) {
    //<select name="RSVP"'
    var startfunc;
    var endfunc;
    var myfunc;
    var unitid;



    startfunc = data.search(/<select[ ]+name[^=]*=[^"]*"RSVP"/);
    if (startfunc == -1) {
        //no insert point for RSVP messaging.  Event already happened.  Not reliable any more.  Autolog is better
        return data;
    }
    if (data.match(/"startDate"[ ]+value[^=]*=[^"]*"([^"]+)/) == null) return data;
    var formDate = data.match(/"startDate"[ ]+value[^=]*=[^"]*"([^"]+)/)[1];
    // is this event in the past?
    if (dateDiff(formDate, nowDate) < 0) {
        return data;
    }



    endfunc = data.slice(startfunc).search(/<\/select>/) + startfunc;
    var onselect = data.slice(startfunc).search(/<option[ ]+value[^=]*=[^"]*"on"[ ]+selected[^=]*=[^"]*"selected"/) + startfunc;

    if (onselect > startfunc && onselect < endfunc) {
        // ok to insert, this is an editevent with a prior RSVP on
        // Need to insert buttons


        var iunit = [];
        var iname = [];
        var aunit;
        var tmp;
        var unitname;
        var unitnum;
        var startfunc = data.search(/<select[ ]+name[^=]*=[^"]*"CalendarID"[ ]+id[^=]*=[^"]*"calendarID"/);
        if (startfunc == -1) {
            return data;
        }
        var endfunct = data.slice(startfunc).search(/<[^\/]*\/select[^>]*>/) + startfunc;
        if (endfunct == -1) {
            return data;
        }
        for (var i = 0; i < data.slice(startfunc, endfunct).match(/<option[ ]+value[^=]*=[^"]*"(UnitID|DenID|PatrolID)\d+"[^<]+/g).length; i++) {
            tmp = data.slice(startfunc, endfunct).match(/<option[ ]+value[^=]*=[^"]*"(UnitID|DenID|PatrolID)\d+"[^<]+/g)[i];
            if (tmp.match(/(UnitID)(\d+)/) != null) {
                aunit = 'UnitID-' + tmp.match(/UnitID(\d+)/)[1];
                unitnum = tmp.match(/UnitID(\d+)/)[1];
                if (tmp.match(/>(.+)/) != null) {
                    unitname = tmp.match(/>(.+)/)[1].trim();
                }
            }


            var den = '';
            var patrol = '';
            var udp = aunit + '&DenID-';
            if (tmp.match(/selected[^=]*=[^"]*"selected"/) != null) {
                if (tmp.match(/DenID(\d+)/) != null) {
                    udp += tmp.match(/DenID(\d+)/)[1];
                }
                udp += '&PatrolID-';
                if (tmp.match(/PatrolID(\d+)/) != null) {
                    udp += tmp.match(/PatrolID(\d+)/)[1];
                }

                if (tmp.match(/>(.+)/) != null) {
                    pushUnique(iname, unitname);
                }

                pushUnique(iunit, unitnum);
            }

        }



        startfunc = data.search(/<span[ ]+id[^=]*=[^"]*"permissionSPAN/);

        var lin1 = '<span style="display: inline;" id="rsvpReportDIV">\n';
        lin1 += '<a data-role="button" data-theme="d" data-inline="true" data-mini="true" href="#rsvpRptMenu" data-rel="popup" data-transition="slideup" id="rsvpReports">\n';
        lin1 += '<div style="margin-left: 25px; position: relative; ">\n';
        lin1 += '<img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/ReportsBSA100gray.png" style="position: absolute; width: 24px; left: -28px; top: -4px; " />\n';
        lin1 += '<span class="text">RSVP Report</span>\n';
        lin1 += '</div>\n';
        lin1 += '</a>\n';
        lin1 += '</span>';

        // var newdata = data.slice(0,startfunc) + lin1 + listanchor  + data.slice(startfunc);
        var newdata = data.slice(0, startfunc) + lin1 + data.slice(startfunc);

        // now need inline functions to handle buttons
        //Determine which unitID is selected or which unitID has a Den or Patrol selected

        var offset = 0;
        var ndata = newdata;

        while (true) {
            ndata = ndata.slice(offset);
            startfunc = ndata.search(/<option[ ]+value[^=]*=[^"]*"UnitID/);
            endfunc = ndata.slice(startfunc + 12).search(/<option[ ]+value[^=]*=[^"]*"UnitID/);

            if (endfunc == -1) {
                // no more to search.  Search for </select instead
                endfunc = ndata.slice(startfunc + 12).search(/<\/select/);
            }

            if (endfunc == -1) {
                return newdata;

            }

            if (ndata.slice(startfunc, endfunc + startfunc + 12).search(/selected=\"selected\"/) != -1) {
                // this is the unit id we want
                unitid = ndata.slice(startfunc).match(/<option[ ]+value[^=]*=[^"]*"UnitID(\d+)\"/);
                break;
            }
            offset = startfunc + 20;
        }
        //"$('#startEndDate', '#Page"
        startfunc = newdata.search(/\$\('#startEndDate',[ ]+'#Page/);
        if (startfunc != -1) {
            myfunc = "$('#rsvpReports','#Page" + escapeHTML(pageid) + "').click(function () { $('#rsvpRecipentID','#Page" + escapeHTML(pageid) + "').mobiscroll('show');});\n"; // action to display mobiscroll
            data = newdata.slice(0, startfunc) + myfunc + newdata.slice(startfunc);
        }

        startfunc = data.search(/\$\('#startEndDate',[ ]+'#Page/);
        if (startfunc != -1) {
            myfunc = '' + dummyfz;
            myfunc = myfunc.slice(20).slice(0, -1).replace(/\#PageX/g, '#Page' + escapeHTML(pageid)).replace(/Xunit/, escapeHTML(unitid[1]));
            data = data.slice(0, startfunc) + myfunc + '\n' + data.slice(startfunc);
        }


        //put the popup for selecting a rsvp report unit here
        //'<li data-role="list-divider" data-theme="a">Scheduled Reminders'
        var startfunc = data.search(/<li[ ]+data-role[^=]*=[^"]*"list-divider"[ ]+data-theme[^=]*=[^"]*"a"[^>]*>[^ ]*Scheduled Reminders/);
        if (startfunc == -1) {
            // can't find insert point for 
            return data;
        }



        var newdata = data.slice(0, startfunc);
        newdata += '	<li id="rsvpDivider" data-theme="d" style="display: none;">'
        newdata += '	<div data-role="popup" id="rsvpRptMenu" data-theme="d" data-history="false">';
        newdata += '		<ul data-role="listview" data-inset="true" style="min-width:210px;" data-theme="d" class="ui-icon-alt">';
        newdata += '			<li data-role="divider" data-theme="a">Choose an action:</li>';

        //#########################
        newdata += '<li>';
        newdata += '						<fieldset data-role="controlgroup" style="margin-top: 1em; ">';
        newdata += '							<legend class="text-orange">';
        newdata += '								Choose Unit:';
        newdata += '							</legend>	';

        // radio button for anything selected?

        var seltxt = ' checked="checked" ';
        for (var i = 0; i < iunit.length; i++) {
            newdata += '								<label for="unitRsvpSelectID' + escapeHTML(i) + '">';
            newdata += escapeHTML(iname[i]);
            newdata += '									</label>';
            newdata += '								<input type="radio"  name="UnitRsvpSelectID" id="unitRsvpSelectID' + escapeHTML(i) + '" data-theme="d" value="' + escapeHTML(iunit[i]) + '"' + escapeHTML(seltxt) + ' />';
            seltxt = '';
        }

        newdata += '						</fieldset>';
        newdata += '</li>';
        //###################


        newdata += '	<li>';
        //newdata += '						<fieldset data-role="controlgroup" style="margin-top: 1em; ">';
        newdata += '							<legend class="text-orange">';
        newdata += '								Choose RSVP type(s):';
        newdata += '							</legend>	';



        newdata += '	<li>';
        newdata += '		<label for="unitRsvpYesSelectID">Yes:</label>';
        newdata += '			<select name="UnitRsvpYesSelectID" id="unitRsvpYesSelectID" data-role="slider" data-mini="true">';
        newdata += '				<option value="off">Off</option>';
        newdata += '				<option value="on">On</option>';
        newdata += '			</select> ';
        newdata += '	</li>';


        newdata += '	<li>';
        newdata += '		<label for="unitRsvpNoSelectID">No:</label>';
        newdata += '			<select name="UnitRsvpNoSelectID" id="unitRsvpNoSelectID" data-role="slider" data-mini="true">';
        newdata += '				<option value="off">Off</option>';
        newdata += '				<option value="on">On</option>';
        newdata += '			</select> ';
        newdata += '	</li>';

        newdata += '	<li>';
        newdata += '		<label for="unitRsvpMaybeSelectID">Maybe:</label>';
        newdata += '			<select name="UnitRsvpMaybeSelectID" id="unitRsvpMaybeSelectID" data-role="slider" data-mini="true">';
        newdata += '				<option value="off">Off</option>';
        newdata += '				<option value="on">On</option>';
        newdata += '			</select> ';

        newdata += '	</li>';
        newdata += '	</li>';

        //now need a submit cancel
        newdata += '			<li>';
        newdata += '				<input type="submit" value="Submit" data-theme="g" id="buttonRsvpSubmit" >';
        newdata += '				<input type="submit" value="Cancel" data-theme="d" id="buttonRsvpCancel" >';
        newdata += '			</li>';




        newdata += '		</ul>';
        newdata += '	</div>';
        newdata += '	</li>';
        newdata += data.slice(startfunc);
        data = newdata;


    }
    return data;
}




//mobiscroll setup for event messaging
//eventmsg
function dummyfz() {

    $('#buttonRsvpCancel', '#PageX').click(function() {

        $('#rsvpRptMenu', '#PageX').popup('close');
        $('#buttonRsvpSubmit', '#PageX').button('enable');
        $('#buttonRsvpCancel', '#PageX').button('enable');
    });
    $('#buttonRsvpSubmit', '#PageX').click(function() {

        if ($('#unitRsvpYesSelectID', '#PageX').val() == 'off') {
            if ($('#unitRsvpNoSelectID', '#PageX').val() == 'off') {
                if ($('#unitRsvpMaybeSelectID', '#PageX').val() == 'off') {
                    alert('Please select one or more RSVP types for the Report.');

                    return false;
                }
            }
        }

        $('#rsvRptMenu', '#PageX').popup('close');

        $.mobile.loading('show', {
            theme: 'a',
            text: 'Loading...',
            textonly: false
        });
        var unit; //=$('#unitRsvpSelectID', '#PageX').val();
        $("input[name*=UnitRsvpSelectID]:checked", '#PageX').each(function() {
            unit = $(this).val();
        });


        createRsvpReport(unit);

        return false;
    });

}
/*
add a button

get the rsvp list

*/

function rawDataModifyRsvp(data, pageid) {
    var startfunc;
    var endfunc;
    var newdata = '';

    if (rsvpObj.rsvpList.length == 0) return data;

    //console.log(data);
    //page has scripts functions that need overwriting

    //copy the style

    startfunc = data.search(/<style/);
    endfunc = data.search(/<\/style/);

    var style = data.slice(startfunc, endfunc) + '</style>';

    startfunc = data.search(/<body>/);

    newdata += '<body>\n';
    newdata += '<div data-role="page" data-theme="d">\n'; //make background white
    newdata += '<script type="text/javascript">\n'; //overload any existing page functions
    newdata += "    function slideStop() { window.console && console.log('slideStop() reset from mobile_jsInit'); }\n";
    newdata += "    function popupAfterClosed() { window.console && console.log('popupAfterClosed() reset from mobile_jsInit'); }\n";
    newdata += "    function popupAfterOpen() { window.console && console.log('popupAfterOpen() reset from mobile_jsInit'); }\n";
    newdata += "    function enableToggle() { window.console && console.log('enableToggle() reset from mobile_jsInit'); }\n";
    newdata += "    function swapCache() { window.console && console.log('swapCache() reset from mobile_jsInit'); }\n";
    newdata += "    function offlineInit() { window.console && console.log('offlineInit() reset from mobile_jsInit'); }\n";
    newdata += "    function pageInit() { window.console && console.log('pageInit() reset from mobile_jsInit'); }\n";
    newdata += "    function pageShow() { window.console && console.log('pageShow() reset from mobile_jsInit'); }\n";
    newdata += "    function pageHide() { window.console && console.log('pageHide() reset from mobile_jsInit'); }\n";
    newdata += "    function headerInit() { window.console && console.log('headerInit() reset from mobile_jsInit'); }\n";
    newdata += '</script>\n'
    newdata += style; //overload the table styles

    //newdata+='<div data-role="content" data-theme="h">\n';

    data = data.slice(0, startfunc) + newdata + data.slice(startfunc + 6);

    //center the title
    //find <div id="title">
    startfunc = data.search(/<div id="title">/);
    //add style  <div style="text-align:center">
    data = data.slice(0, startfunc) + '<div id="title" style="text-align:center">' + data.slice(startfunc + '<div id="title">'.length);


    // Modify the table


    startfunc = data.search(/<table id="scoutRoster"/);
    endfunc = data.indexOf('</table', startfunc);

    var thd = [];
    var tdr = [];

    loadTable(data.slice(startfunc, endfunc), thd, tdr);

    //filter the table, arrange columns
    //start by adding a column
    tdr = insertCol(tdr, 0);
    tdr = insertCol(tdr, 7);
    tdr = insertCol(tdr, 9);
    thd.splice(0, 0, 'RSVP');
    thd.splice(7, 0, 'RSVP');
    thd.splice(9, 0, 'RSVP');

    var tdrFwd;
    //var evObj ={id: '', nameFwd:'', nameRev:'',stat:''};	rsvpList keys



    rsvpObj.scoutStats = [];

    rsvpObj.parentYes = 0;
    rsvpObj.parentNo = 0;
    rsvpObj.parentMaybe = 0;

    rsvpObj.leaderYes = 0;
    rsvpObj.leaderNo = 0;
    rsvpObj.leaderMaybe = 0;

    // update scout rsvp
    updateScoutRSVP(tdr);
    updateParentRSVP(tdr, 7);
    updateParentRSVP(tdr, 9);

    //next, filter based on the column val

    tdr = filterRsvpTbl(tdr, 0, 7, 9);
    tdr = expiryDates(tdr, [2, 3]);
    var htmltable;
    if (tdr.length == 0) {
        data = data.slice(0, startfunc) + '<br><table id="scoutRoster" class="roster"><tr><th>No Scouts or Parents match the Report Criteria</th></tr>' + data.slice(endfunc);
    } else {
        htmltable = makeHtmlTable(thd, tdr);
        data = data.slice(0, startfunc) + '<br><table id="scoutRoster" class="roster">' + htmltable + data.slice(endfunc);
    }

    // separate the tables

    //var endtbl = data.indexOf('>',endfunc);
    //data=data.slice(0,endtbl+1) + '<br>' + data.slice(endtbl+1);


    //------- Leader table
    startfunc = data.search(/<table id="leaders"/);
    endfunc = data.indexOf('</table', startfunc);

    thd = [];
    tdr = [];

    loadTable(data.slice(startfunc, endfunc), thd, tdr);
    tdr = insertCol(tdr, 0);
    thd.splice(0, 0, 'RSVP');
    updateLeaderRSVP(tdr);

    //filter
    tdr = filterRsvpTbl(tdr, 0, -1, -1);
    tdr = expiryDates(tdr, [3, 4]);
    if (tdr.length == 0) {
        data = data.slice(0, startfunc) + '<br><table id="leaders" class="roster"><tr><th>No Leaders match the Report Criteria</th></tr>' + data.slice(endfunc);
    } else {
        htmltable = makeHtmlTable(thd, tdr);
        data = data.slice(0, startfunc) + '<br><table id="leaders" class="roster">' + htmltable + data.slice(endfunc);
    }


    //---------------------
    var totals = '';
    totals += '<div><p></p><p>Totals</p></div>\n';
    totals += '<table class="roster"><tbody>\n';
    totals += '<tr class="borderBottom">\n';
    totals += '<th>Group</th><th>Yes</th><th>No</th><th>Maybe</th><th>Total</th>\n';
    totals += '</tr>\n';

    var totYes = 0;
    var totNo = 0
    var totMaybe = 0;
    linTot = 0;
    var totScoutYes = 0;
    var totScoutNo = 0;
    var totScoutMaybe = 0;

    for (var i = 0; i < rsvpObj.scoutStats.length; i++) {
        totals += '<tr>\n';
        linTot = rsvpObj.scoutStats[i].yes + rsvpObj.scoutStats[i].no + rsvpObj.scoutStats[i].maybe;
        totals += '<td>' + escapeHTML(rsvpObj.scoutStats[i].denpatrol) + ' Scouts</td><td>' + escapeHTML(rsvpObj.scoutStats[i].yes) + '</td><td>' + escapeHTML(rsvpObj.scoutStats[i].no) + '</td><td>' + escapeHTML(rsvpObj.scoutStats[i].maybe) + '</td><td>' + escapeHTML(linTot) + '</td>\n';
        totals += '</tr>\n';
        totYes += rsvpObj.scoutStats[i].yes;
        totNo += rsvpObj.scoutStats[i].no;
        totMaybe += rsvpObj.scoutStats[i].maybe;

        totScoutYes += rsvpObj.scoutStats[i].yes;
        totScoutNo += rsvpObj.scoutStats[i].no;
        totScoutMaybe += rsvpObj.scoutStats[i].maybe;
    }


    //recalc parent numbers based on actual array
    rsvpObj.parentYes = 0;
    rsvpObj.parentNo = 0;
    rsvpObj.parentMaybe = 0;
    for (var i = 0; i < rsvpObj.rsvpList.length; i++) {
        if (rsvpObj.rsvpList[i].id[0] == 'P') {
            switch (rsvpObj.rsvpList[i].stat) {
                case "Yes":
                    rsvpObj.parentYes += 1;
                    break;
                case "No":
                    rsvpObj.parentNo += 1;
                    break;
                case "Maybe":
                    rsvpObj.parentMaybe += 1;
                    break;
            }
        }
    }

    linTot = rsvpObj.parentYes + rsvpObj.parentNo + rsvpObj.parentMaybe;
    totals += '<tr>\n';
    totals += '<td>Parents</td><td>' + escapeHTML(rsvpObj.parentYes) + '</td><td>' + escapeHTML(rsvpObj.parentNo) + '</td><td>' + escapeHTML(rsvpObj.parentMaybe) + '</td><td>' + escapeHTML(linTot) + '</td>\n';
    totals += '</tr>\n';

    totYes += rsvpObj.parentYes;
    totNo += rsvpObj.parentNo;
    totMaybe += rsvpObj.parentMaybe;

    linTot = rsvpObj.leaderYes + rsvpObj.leaderNo + rsvpObj.leaderMaybe;
    totals += '<tr>\n';
    totals += '<td>Leaders</td><td>' + escapeHTML(rsvpObj.leaderYes) + '</td><td>' + escapeHTML(rsvpObj.leaderNo) + '</td><td>' + escapeHTML(rsvpObj.leaderMaybe) + '</td><td>' + escapeHTML(linTot) + '</td>\n';
    totals += '</tr>\n'

    var totAdultYes = rsvpObj.leaderYes + rsvpObj.parentYes;
    var totAdultNo = rsvpObj.leaderNo + rsvpObj.parentNo;
    var totAdultMaybe = rsvpObj.leaderMaybe + rsvpObj.parentMaybe;

    linTot = totScoutYes + totScoutNo + totScoutMaybe;
    totals += '<tr class="borderBottom">\n';
    totals += '<td>Total Scouts</td><td>' + escapeHTML(totScoutYes) + '</td><td>' + escapeHTML(totScoutNo) + '</td><td>' + escapeHTML(totScoutMaybe) + '</td><td>' + escapeHTML(linTot) + '</td>\n';
    totals += '</tr>\n'
    linTot = totAdultYes + totAdultNo + totAdultMaybe;
    totals += '<tr class="borderBottom">\n';
    totals += '<td>Total Adults</td><td>' + escapeHTML(totAdultYes) + '</td><td>' + escapeHTML(totAdultNo) + '</td><td>' + escapeHTML(totAdultMaybe) + '</td><td>' + escapeHTML(linTot) + '</td>\n';
    totals += '</tr>\n'


    totYes += rsvpObj.leaderYes;
    totNo += rsvpObj.leaderNo;
    totMaybe += rsvpObj.leaderMaybe;

    linTot = totYes + totNo + totMaybe;
    totals += '<tr class="borderBottom">\n';
    totals += '<th>Total</th><th>' + escapeHTML(totYes) + '</th><th>' + escapeHTML(totNo) + '</th><th>' + escapeHTML(totMaybe) + '</th><th>' + escapeHTML(linTot) + '</th>\n';
    totals += '</tr>\n'

    totals += '</tbody></table>\n';

    //totals+='<p></p><p>Total Scouts=' 
    totals += '<p></p><p>this page is produced by Feature Assistant and is not supported by BSA</p>\n';

    startfunc = data.search(/<\/body/);
    data = data.slice(0, startfunc) + totals + data.slice(startfunc);

    startfunc = data.search(/<\/body/);
    data = data.slice(0, startfunc) + '<script type="text/javascript">\nsortable();\n</script>\n' + style + '\n' + data.slice(startfunc);


    startfunc = data.search(/<\/body/);
    data = data.slice(0, startfunc) + '</div>\n' + data.slice(startfunc);



    data = data.replace('<link rel="stylesheet" href="/includes/mobile-concat.css" />', '');

    rsvpObj.rsvpList.length == 0;
    return data;
}


function updateScoutRSVP(tdr) {
    //var elem = document.createElement('textarea');
    var tdrFwd;
    for (var i = 0; i < tdr.length; i++) {
        for (var j = 0; j < rsvpObj.rsvpList.length; j++) {
            //if a scout
            if (rsvpObj.rsvpList[j].id.indexOf('Scout') != -1) {
                // if the name matches, update col 0 with the status
                //console.log(tdr[i][5]);
                tdrFwd = tdr[i][1].toLowerCase().match(/, (.+)/)[1] + ' ' + tdr[i][1].toLowerCase().match(/(.+),/)[1];
                //if(tdrFwd == rsvpObj.rsvpList[j].nameFwd.toLowerCase()) {
                var nosuffix = rsvpObj.rsvpList[j].nameRev.match(/([^,]+), ([^,]+)/)[2] + ' ' + rsvpObj.rsvpList[j].nameRev.match(/([^,]+), ([^,]+)/)[1];
                //elem.innerHTML = tdrFwd;

                //console.log(tdrFwd,decodeURI(tdrFwd));

                //tdrFwd=elem.value;
                tdrFwd = unEscapeHTML(tdrFwd);
                if (tdrFwd == nosuffix.toLowerCase()) {
                    tdr[i][0] = rsvpObj.rsvpList[j].stat; //status, yes, No , Maybe


                    addScoutRsvp(tdr[i][0], tdr[i][5]);




                    break;
                }
            }
        }
    }
}

function addScoutRsvp(stat, denpatrol) {
    var found = false;

    for (var i = 0; i < rsvpObj.scoutStats.length; i++) {
        if (rsvpObj.scoutStats[i].denpatrol == denpatrol) {
            found = true; //pointing at record
            break;
        }
    }

    if (found == false) {
        //add it first
        rsvpObj.scoutStats.push({
            denpatrol: denpatrol,
            yes: 0,
            no: 0,
            maybe: 0
        });
        //i=i+1;
    }

    switch (stat) {
        case "Yes":
            rsvpObj.scoutStats[i].yes += 1;
            break;
        case "No":
            rsvpObj.scoutStats[i].no += 1;
            break;
        case "Maybe":
            rsvpObj.scoutStats[i].maybe += 1;
            break;
    }
    //now pointing at proper row, increment


}


function updateParentRSVP(tdr, col) {
    //var elem = document.createElement('textarea');
    var cnum = parseInt(col);
    var parentName;
    for (var i = 0; i < tdr.length; i++) {
        for (var j = 0; j < rsvpObj.rsvpList.length; j++) {
            //if a parent
            if (rsvpObj.rsvpList[j].id.indexOf('Parent') != -1) {
                // if the name matches, update col 0 with the status
                if (tdr[i][cnum + 1] != '') {
                    if (tdr[i][cnum + 1].toLowerCase().match(/[^<]+/) != null) {
                        parentName = tdr[i][cnum + 1].toLowerCase().match(/[^<]+/)[0];
                    } else {
                        parentName = tdr[i][cnum + 1].toLowerCase();
                    }

                    console.log(parentName, unEscapeHTML(parentName));
                    //elem.innerHTML = parentName;
                    //parentName=elem.value;

                    parentName = unEscapeHTML(parentName);

                    var nosuffix = rsvpObj.rsvpList[j].nameRev.match(/([^,]+), ([^,]+)/)[2] + ' ' + rsvpObj.rsvpList[j].nameRev.match(/([^,]+), ([^,]+)/)[1];
                    if (parentName == nosuffix.toLowerCase()) {

                        //if(parentName == rsvpObj.rsvpList[j].nameFwd.toLowerCase()) {
                        tdr[i][cnum] = rsvpObj.rsvpList[j].stat;

                        switch (tdr[i][cnum]) {
                            case "Yes":
                                rsvpObj.parentYes += 1;
                                break;
                            case "No":
                                rsvpObj.parentNo += 1;
                                break;
                            case "Maybe":
                                rsvpObj.parentMaybe += 1;
                                break;
                        }



                        break;
                    }
                }
            }
        }
    }

}

function updateLeaderRSVP(tdr) {
    //var elem = document.createElement('textarea');

    var tdrFwd;
    for (var i = 0; i < tdr.length; i++) {
        for (var j = 0; j < rsvpObj.rsvpList.length; j++) {
            //if a leader
            if (rsvpObj.rsvpList[j].id.indexOf('Leader') != -1) {
                // if the name matches, update col 0 with the status
                tdrFwd = tdr[i][1].toLowerCase().match(/, (.+)/)[1] + ' ' + tdr[i][1].toLowerCase().match(/(.+),/)[1];
                var nosuffix = rsvpObj.rsvpList[j].nameRev.match(/([^,]+), ([^,]+)/)[2] + ' ' + rsvpObj.rsvpList[j].nameRev.match(/([^,]+), ([^,]+)/)[1];
                //if(tdrFwd == rsvpObj.rsvpList[j].nameFwd.toLowerCase()) {
                //elem.innerHTML = tdrFwd;
                //tdrFwd=elem.value;
                tdrFwd = unEscapeHTML(tdrFwd);


                if (tdrFwd == nosuffix.toLowerCase()) {
                    tdr[i][0] = rsvpObj.rsvpList[j].stat;

                    switch (tdr[i][0]) {
                        case "Yes":
                            rsvpObj.leaderYes += 1;
                            break;
                        case "No":
                            rsvpObj.leaderNo += 1;
                            break;
                        case "Maybe":
                            rsvpObj.leaderMaybe += 1;
                            break;
                    }
                    break;
                }
            }
        }
    }
}
//three columns to filter.  Scout and two parents
// challenge.  Two scouts, only one going.  Parent is going.  How to detect?  Push all in first? then, build list of parents 
// Or parent going but no scout.
// Build table.  Get list of parents.  Tag any that have scout meeting criteria.  Id any that show more than once.  2nd pass
/*

If parent meets criteria AND met it before WITH a scout that met it, don't print on scout that DOESN' meet criteria

if parent meets criteria AND there are NO CHILDREN that meet criteria, print ONCE only

tag parents that MEEt criteria that have a scout that MEEts criteia a PARENTHASSCOUT






*/

function expiryDates(tbl, col) {
    var cd;
    for (var j = 0; j < col.length; j++) {
        for (var i = 0; i < tbl.length; i++) {
            cd = tbl[i][parseInt(col[j])].match(/(\d+\/\d+\/)(\d+)/);
            if (cd != null) {
                ny = parseInt(cd[2]) + 1;
                console.log(cd[0], cd[1] + '' + ny);
                if (new Date(cd[1] + '' + ny) < new Date($('#startDate').val())) {
                    tbl[i][parseInt(col[j])] = cd[0] + ' Expires by Event';
                } else {
                    tbl[i][parseInt(col[j])] = cd[0];
                }
            }
        }
    }
    return tbl;
}

function filterRsvpTbl(tbl, s1, p1, p2) {
    if (p1 > 0) {

        var newTbl = []
        var hideMeforNonCriteriaScout;
        var skip;
        var parent2ScoutMeetsCriteria = [];
        var parent2PrintedAlready = [];
        var parent1ScoutMeetsCriteria = [];
        var parent1PrintedAlready = [];

        for (var i = 0; i < tbl.length; i++) {
            for (var j = 0; j < rsvpObj.rsvpValues.length; j++) {
                //scout
                if (tbl[i][parseInt(s1)] == rsvpObj.rsvpValues[j]) {
                    //keep
                    //this scout meets criteria.  If scout's parent meets criteria, save.
                    for (var k = 0; k < rsvpObj.rsvpValues.length; k++) {
                        if (tbl[i][parseInt(p1)] == rsvpObj.rsvpValues[k]) {
                            //save this parent
                            parent1ScoutMeetsCriteria.push(tbl[i][parseInt(p1) + 1]);
                        }
                        if (tbl[i][parseInt(p2)] == rsvpObj.rsvpValues[k]) {
                            //save this parent
                            parent2ScoutMeetsCriteria.push(tbl[i][parseInt(p2) + 1]);
                        }
                    }
                    break;
                }

            }
        }








        for (var i = 0; i < tbl.length; i++) {
            for (var j = 0; j < rsvpObj.rsvpValues.length; j++) {
                hideMeforNonCriteriaScout = false;
                for (var k = 0; k < parent1ScoutMeetsCriteria.length; k++) {
                    if (parent1ScoutMeetsCriteria[k] == tbl[i][parseInt(p1) + 1]) {
                        hideMeforNonCriteriaScout = true;
                        break
                    }
                }
                for (var k = 0; k < parent2ScoutMeetsCriteria.length; k++) {
                    if (parent2ScoutMeetsCriteria[k] == tbl[i][parseInt(p2) + 1]) {
                        hideMeforNonCriteriaScout = true; //print only if Scout is set
                        break
                    }
                }

                if (tbl[i][parseInt(s1)] == rsvpObj.rsvpValues[j]) {
                    //keep
                    newTbl.push(tbl[i].slice(0));
                } else {
                    if (tbl[i][parseInt(p1)] == rsvpObj.rsvpValues[j] || tbl[i][parseInt(p2)] == rsvpObj.rsvpValues[j]) {
                        if (hideMeforNonCriteriaScout == false) {
                            // only print once.  Put in array 
                            skip = false;
                            for (var m = 0; m < parent2PrintedAlready.length; m++) {
                                if (parent2PrintedAlready[m] == tbl[i][parseInt(p2) + 1]) {
                                    skip = true;
                                    break;
                                }
                            }
                            for (var m = 0; m < parent1PrintedAlready.length; m++) {
                                if (parent1PrintedAlready[m] == tbl[i][parseInt(p1) + 1]) {
                                    skip = true;
                                    break;
                                }
                            }
                            if (skip == false) {
                                parent2PrintedAlready.push(tbl[i][parseInt(p2) + 1]);
                                parent1PrintedAlready.push(tbl[i][parseInt(p1) + 1]);
                                newTbl.push(tbl[i].slice(0));
                            }
                        }
                    }

                }
            }
        }

    } else {
        var newTbl = []
        for (var i = 0; i < tbl.length; i++) {
            for (var j = 0; j < rsvpObj.rsvpValues.length; j++) {
                //scout
                if (tbl[i][parseInt(s1)] == rsvpObj.rsvpValues[j]) {
                    //keep
                    newTbl.push(tbl[i].slice(0));
                    break;
                }
            }
        }

    }


    return newTbl;
}

function insertCol(tbl, col) {
    for (var i = 0; i < tbl.length; i++) {
        tbl[i].splice(parseInt(col), 0, '');
    }
    return tbl;
}

function swapcol(tbl, col1, col2) {

}

function createRsvpReport(unitid) {

    // get from the mobiscroll

    rsvpObj.rsvpList = []; //clear the rscp list	

    //var inst = $('#rsvpRecipentID').mobiscroll('getInst');		//gets the instanceof teh mobiscroll object
    //var values = inst.getValues();				//gets the values selecteed in the mobiscroll object

    var values = [];



    if ($('#unitRsvpYesSelectID').val() == 'on') values.push('Yes');
    if ($('#unitRsvpNoSelectID').val() == 'on') values.push('No');
    if ($('#unitRsvpMaybeSelectID').val() == 'on') values.push('Maybe');

    rsvpObj.rsvpValues = values.slice(0);
    loadRespondents(values); //loads global rsvpObj.rsvpList

    if (rsvpObj.rsvpList.length == 0) {
        alert('No invitees matching criteria found');
        $.mobile.loading('hide');
        return;
    }

    rsvpObj.title = $('#name').val();
    rsvpObj.date = $('#startDate').val() + " to " + $('#endDate').val();
    getRsvpReport(unitid);

}

function loadRespondents(rsvpStat) {
    //var rsvpStat = ["Yes","No"];		
    var id;
    var aa;
    var sn;

    var evObj = {
        id: '',
        nameFwd: '',
        nameRev: '',
        stat: ''
    };

    for (var i = 0; i < rsvpStat.length; i++) {
        $('#leadersLI  .attendeeDIV').each(function() {
            $(this).find('.rsvp' + rsvpStat[i]).each(function(index, value) {
                aa = $(this).parent()[0];
                sn = $('.attendeeName', aa)[0].innerText.replace('\n', ' ');
                id = $(aa).attr('data-userid');
                //console.log('Leader ' + sn +id);
                evObj.id = 'LeaderUserID' + id;
                evObj.nameFwd = sn;
                evObj.stat = rsvpStat[i];
                rsvpObj.rsvpList.push(JSON.parse(JSON.stringify(evObj)));
            });

        });

        $('#parentsLI  .attendeeDIV').each(function() {
            $(this).find('.rsvp' + rsvpStat[i]).each(function(index, value) {
                aa = $(this).parent()[0];
                sn = $('.attendeeName', aa)[0].innerText.replace('\n', ' ');
                id = $(aa).attr('data-userid');
                //console.log('Parent '+ sn);
                evObj.id = 'ParentUserID' + id;
                evObj.nameFwd = sn;
                evObj.stat = rsvpStat[i];
                rsvpObj.rsvpList.push(JSON.parse(JSON.stringify(evObj)));
            });
        });


        $('#scoutsLI  .attendeeDIV').each(function() {
            $(this).find('.rsvp' + rsvpStat[i]).each(function(index, value) {
                aa = $(this).parent()[0];
                sn = $('.attendeeName', aa)[0].innerText.replace('\n', ' ');
                id = $(aa).attr('data-userid');
                //console.log('Scout '+ sn);
                evObj.id = 'ScoutUserID' + id;
                evObj.nameFwd = sn;
                evObj.stat = rsvpStat[i];
                rsvpObj.rsvpList.push(JSON.parse(JSON.stringify(evObj)));
            });
        });

    }

    //This gives name as John Doe, with the ID
    // Look up id in page to get reverse order name 


    $('option[value*="LeaderUserID"]').each(function() {
        //console.log($(this).val(), $(this).text());  //id and name in format Doe, John
        id = $(this).val();
        for (var i = 0; i < rsvpObj.rsvpList.length; i++) {
            if (rsvpObj.rsvpList[i].id == id) {
                rsvpObj.rsvpList[i].nameRev = $(this).text().trim();
            }
        }
    });

    $('option[value*="ParentUserID"]').each(function() {
        //console.log($(this).val(), $(this).text());  //id and name in format Doe, John
        id = $(this).val();
        for (var i = 0; i < rsvpObj.rsvpList.length; i++) {
            if (rsvpObj.rsvpList[i].id == id) {
                rsvpObj.rsvpList[i].nameRev = $(this).text().trim();
            }
        }
    });

    $('option[value*="ScoutUserID"]').each(function() {
        //console.log($(this).val(), $(this).text());  //id and name in format Doe, John
        id = $(this).val();
        for (var i = 0; i < rsvpObj.rsvpList.length; i++) {
            if (rsvpObj.rsvpList[i].id == id) {
                rsvpObj.rsvpList[i].nameRev = $(this).text().trim();
            }
        }
    });

    // now have name in reverse order, but last name is all caps.
    //console.log(rsvpObj.rsvpList);

    // Concept now is to create a report, but modify the raw text response
}

function getRsvpReport(unitid) {

    //option A.  Load the page with a changepage post and tweak rawdata with rawDataModifyRsvp
    //Difficulty is parsing since there is no DOM loaded

    //Option B.  Load the page internally, tweak contents in internal DOM, then changeurl and replace content like the balance report

    //Option C.  See if a DOM can be created based on a text content

    var formData = "Action=Print&UnitID=" + escapeHTML(unitid) + "&ShowLeaders=1&ShowScouts=1&ShowParents=1&ShowParentsPhone=1&ShowParentsEmail=1&ShowPhone=1&ShowUnit=1&ShowDenPatrol=1&ShowMedicalDates=1&Title=" + encodeURIComponent(rsvpObj.title + ' ' + rsvpObj.date);
    var url = "/mobile/dashboard/reports/roster.asp?Action=Print&DenID=&PatrolID=&UnitID=";
    var dataurl = $.mobile.activePage.attr('data-url');
    $.mobile.changePage(
        url, {
            type: 'post',
            data: formData,
            dataUrl: dataurl,
            allowSamePageTransition: false,
            transition: 'none',
            showLoadMsg: true,
            reloadPage: true
        }
    );
    //console.log('changed');
}

function loadTable(data, thd, tdr) {
    //get header row
    //var data='<tr><th>a  </th> <th  asdf></th></tr><tr d> <td>1st row 1st td</td> <td>1st row 2nd td </td></tr><tr> <td>ddd</td> </tr>';
    var start = data.search(/<tr/);
    var end = data.indexOf('</tr', start);
    var hdr = data.slice(start, end);
    var rmn = data.slice(end);
    var th = hdr.match(/<th/g);


    var th = hdr.match(/<th[^>]*[^<]+</gm);

    //var thd=[];
    for (var i = 0; i < th.length; i++) {
        if (th[i].match(/>([^<]+)/m) != null) {
            thd.push(th[i].match(/>([^<]+)/m)[1].trim());
        } else {
            thd.push('');
        }
    }

    // now loop through rows
    var td;
    var tdd = []
    //var tdr=[];


    var row;
    var sizermn = rmn.match(/<tr[^>]*?>[\s\S]*?<\/tr/gm).length;
    for (var i = 0; i < sizermn; i++) {

        row = rmn.match(/<tr[^>]*?>[\s\S]*?<\/tr/gm)[i];
        td = row.match(/<td[^>]*?>[\s\S]*?<\/td/gm);
        for (var j = 0; j < td.length; j++) {
            if (td[j].match(/<td[^>]*?>([\s\S]*?)<\/td/m) != null) {
                tdd.push(td[j].match(/<td[^>]*?>([\s\S]*?)<\/td/m)[1].trim());
            } else {
                tdd.push('');
            }
        }
        tdr.push(tdd.slice(0));
        tdd = [];


    }


}

function makeHtmlTable(thd, tdr) {
    var tble = '<tr class="borderBottom">';
    for (var i = 0; i < thd.length; i++) {
        tble += '<th style="cursor: pointer;">' + escapeHTML(thd[i]) + '</th>';
    }
    tble += '</tr>';
    var tval;
    for (var j = 0; j < tdr.length; j++) {
        tble += '<tr>';
        for (var i = 0; i < tdr[j].length; i++) {
            tval = tdr[j][i].replace(/<br>/g, '##br##');
            tval = escapeHTML(tval).replace(/##br##/g, '<br>');
            //tble += '<td>' + escapeHTML(tdr[j][i]) + '</td>';  // don't want to escape <br> formatting
            tble += '<td>' + tval + '</td>';
        }
        tble += '</tr>';
    }


    //tbl+='</table>';
    return tble;
}


function sortable() {

    $('#scoutRoster th').click(function() {

        var column = $(this).index(); //0 is first column
        //return false;
        //need to load table into array then sort array based on field
        //return false;
        var rw = [];
        var tbl = [];
        $('#scoutRoster tr:not(".borderBottom")').each(function() {
            rw = [];
            $('td', this).each(function() {
                rw.push($(this).html());
                //rw.push($(this).text().trim());
            });
            tbl.push(rw);
        });

        var idx = column;
        tbl.sort(function(a, b) {
            var x = a[idx].toLowerCase();
            var y = b[idx].toLowerCase();
            if (x < y) {
                return -1;
            }
            if (x > y) {
                return 1;
            }
            return 0;
        });
        var tblc = 0;
        var rwc = 0;
        $('#scoutRoster tr:not(".borderBottom")').each(function() {
            rwc = 0;
            $('td', this).each(function() {
                $(this).html(tbl[tblc][rwc]);
                rwc += 1;
            });
            tblc += 1;
        });

    });

    $('#leaders th').click(function() {

        var column = $(this).index(); //0 is first column
        //return false;
        //need to load table into array then sort array based on field
        //return false;
        var rw = [];
        var tbl = [];
        $('#leaders tr:not(".borderBottom")').each(function() {
            rw = [];
            $('td', this).each(function() {
                //rw.push($(this).text().trim());
                rw.push($(this).html());
            });
            tbl.push(rw);
        });

        var idx = column;
        tbl.sort(function(a, b) {
            var x = a[idx].toLowerCase();
            var y = b[idx].toLowerCase();
            if (x < y) {
                return -1;
            }
            if (x > y) {
                return 1;
            }
            return 0;
        });
        var tblc = 0;
        var rwc = 0;
        $('#leaders tr:not(".borderBottom")').each(function() {
            rwc = 0;
            $('td', this).each(function() {
                $(this).html(tbl[tblc][rwc]);
                rwc += 1;
            });
            tblc += 1;
        });

    });

}