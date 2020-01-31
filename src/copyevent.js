// Copyright © 10/4/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.
function rawDataAddCopyEvent(data, pageid) {
    if (data.indexOf('id="name" value=""') == -1) {

        // add button for copying events
        var replacehtml = '<button type="button" id="buttonDelete" data-theme="c">Delete</button>';
        var startfunc = data.indexOf(replacehtml);
        //   a black  b blue c grey d white e yellow f green g red h white no border i blk 
        newdata = '	<fieldset class="ui-grid-a ui-responsive">';
        newdata += '<legend></legend>';
        newdata += '	<div class="ui-block-a"><button type="button" id="buttonCopy" data-theme="e">Copy New</button></div>';
        newdata += '	<div class="ui-block-b"><button type="button" id="buttonDelete" data-theme="c">Delete</button></div>';
        newdata += '</fieldset>	';


        data = data.slice(0, startfunc) + newdata + data.slice(startfunc + replacehtml.length);
        // add code to handle button press

        var startfunc = data.indexOf("$('#buttonDelete',");
        newdata = "$('#buttonCopy', '#Page" + escapeHTML(pageid) + "').click(function () {\n";
        newdata += "copyEvent();\n";
        newdata += "			return false;\n";
        newdata += "		});\n";
        data = data.slice(0, startfunc) + newdata + data.slice(startfunc);

        var startfunc = data.indexOf('function initAttendees()');

        var newfunc = "    var cancels={state:''};\n";
        newfunc += '	function initAttendees() {\n'
        //newfunc+="    cancels.state=false;\n";
        newfunc += "    $('#attendees', '#Page" + pageid + "').mobiscroll().select({\n";
        newfunc += "		theme: 'scoutbook',\n";
        newfunc += "		display: 'bottom',\n";
        newfunc += "		mode: 'mixed',\n";
        newfunc += '		showInput: false,\n';
        newfunc += '		counter: false,\n';
        newfunc += '		group: true,\n';
        newfunc += "		buttons: ['set', 'cancel', {\n";
        newfunc += "			text: 'Select All', handler: function (ev, inst) {\n";
        newfunc += '				var wheelValues = inst.getValue(true, true), // Get the current wheel values with group\n';
        newfunc += '				groupIndex = wheelValues[0], // Group index is first\n';
        newfunc += '				value = wheelValues[1], // Current wheel value is second\n';
        newfunc += '				currValues = inst.getValues(); // Get the current multiple selection\n';
        newfunc += "				$('#attendees', '#Page" + pageid + "').find('optgroup').eq(groupIndex).find('option').each(function () {\n";
        newfunc += "					currValues.push($(this).attr('value'));\n";
        newfunc += '				});\n';
        newfunc += '				currValues.unshift(value);\n';
        newfunc += '				inst.setValue(currValues, false, 0, true);\n';
        newfunc += '			}\n';

        newfunc += '			},{\n';
        newfunc += "			text: 'Clear Group', handler: function (ev, inst) {\n";
        newfunc += '				alert("Are you sure you want to Clear?  It will un-select all in this group.  Any RSVP or attendance information for this event will be lost if you confirm with Set.");\n';
        // clear this group
        newfunc += '				var wheelValues = inst.getValue(true, true), // Get the current wheel values with group\n';
        newfunc += '				groupIndex = wheelValues[0], // Group index is first\n';
        newfunc += '				value = wheelValues[1], // Current wheel value is second\n';
        newfunc += '				currValues = inst.getValues(); // Get the current multiple selection\n';
        newfunc += "				$('#attendees', '#Page" + pageid + "').find('optgroup').eq(groupIndex).find('option').each(function () {\n";
        newfunc += "					currValues.push($(this).attr('value'));\n";
        newfunc += '				});\n';
        newfunc += '				currValues.unshift(value);\n';
        newfunc += '				var allValues=[];\n';
        //newfunc+='				debugger;\n';		
        newfunc += '				for(var i=0;i<currValues.length;i++) {\n';
        newfunc += '					if(currValues[i].indexOf(value.slice(0,5)) ==-1) {\n';
        newfunc += '						allValues.push(currValues[i]);\n';
        newfunc += '					}\n';
        newfunc += '				}\n';

        newfunc += '				inst.setValue(allValues, false, 0, true);\n';
        newfunc += '			}\n';
        newfunc += '		}],\n';
        newfunc += '		rows: 11,\n';
        newfunc += "		groupLabel: 'Attendees',\n";
        newfunc += '		onClose: updateXAttendeesLI,\n';
        newfunc += '		onCancel: execCanc\n';
        newfunc += '    });\n';
        //newfunc+='    alert("fires after definition");\n';
        newfunc += '    updateAttendeesLI();\n';
        newfunc += '}\n';
        newfunc += 'function execCanc() {\n';
        newfunc += '  clearTimeout(cancels.state);\n';
        newfunc += '   cancels.state="";\n';
        newfunc += '}\n';
        newfunc += 'function updateXAttendeesLI() {\n'; // this is called BEFORE cancel.  Stupid.	
        newfunc += '     cancels.state=setTimeout(function () { saveChgInv();},1000)\n';
        newfunc += '}\n';
        newfunc += 'function saveChgInv() {\n';
        //		newfunc+='     alert("Saving Changes");\n';			
        newfunc += '     updateAttendeesLI();\n';
        newfunc += '}\n';
        var endfunct = data.indexOf('function updateAttendeesLI()');

        newdata = data.slice(0, startfunc) + newfunc + data.slice(endfunct);
        data = newdata;
    }
    return data;
}

function copyEvent() {
    var formpost = $('#editEventForm').serialize();
    //console.log(formPost);
    //get a new event id
    // post the event with the new id
    if (checkForm(false) == false) {
        return;
    }

    $('#buttonCancel, #buttonSubmit,#buttonDelete, #bottonCopy').button('disable');

    $.mobile.loading('show', {
        theme: 'a',
        text: 'copying event...',
        textonly: false
    });

    //remove any repeating event references	
    formpost = formpost.replace(/&RecurEvent=[^&]*/, '');
    formpost = formpost.replace(/&RepeatType=[^&]*/, '');
    formpost = formpost.replace(/&RepeatEveryType=[^&]*/, '');
    formpost = formpost.replace(/&OccurrencesType=[^&]*/, '');

    var notes = getToken(formpost, 'Notes');
    if (notes.indexOf('%3CRepeat%3A') != -1) {
        //have data to clear out
        notes = decodeURIComponent(notes);
        notes = notes.replace(/<Repeat:[^:]+:[^:]+:[^:]+:[^>]+>/g, '');
        notes = encodeURIComponent(notes);
        formpost = tokenVal(formpost, 'Notes', notes);
    }



    //var eventData = fileObjs.csvdata.shift();
    var calid = '';

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(copyEvent, '', '', '', '', '', '', '', ''); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {

            resetLogoutTimer(url);
            servErrCnt = 0;
            var pageid = '';
            var EventID = '';
            if (this.responseText.match(/id="Page(\d+)/) != null) {
                pageid = this.responseText.match(/id="Page(\d+)/)[1];
            }
            if (this.responseText.match(/EventID=(\d+)/) != null) {
                EventID = this.responseText.match(/EventID=(\d+)/)[1];
            }
            /*
            var calOpts = $('#calendarID',this.response);
            
            for (var i=0;i<$('option',calOpts).length;i++) {
            	if( $('option',calOpts)[i].text == eventData[0]) {
            	    calid=$('option',calOpts)[i].value;
            		break;
            	}
            }
            
            formpost='Action=SaveEvent&CalendarIDs=CalendarID%3D' + calid;
            formpost += '&CalendarID='+calid+'&EventType='+encodeURIComponent(eventData[1]);
            formpost += '&Name='+encodeURIComponent(eventData[2]);
            formpost += '&Location='+encodeURIComponent(eventData[3]);					
            formpost += '&StartDate='+encodeURIComponent(eventData[4] + ' ' +eventData[5] );	
            formpost += '&EndDate='+encodeURIComponent(eventData[6] + ' ' +eventData[7] );				
            formpost += '&GrowthPlan=off&OutdoorActivity=off&ServiceProject=off&ServiceProjectBenefit=off&ParentOrientation=off&BudgetCompleted=off&BudgetIncludesScouts=off&BudgetScoutsParticipate=off&BudgetReviewed=off&ParentalInvolvement=off&ScoutStrong=off&GroupFitness=off&FitnessCompetition=off&MyScoutingTools=off&PatrolTraining=off&PlansReviewedParents=off';
            formpost += '&RSVP='+encodeURIComponent(eventData[8]);
            formpost += '&SlipsRequired='+encodeURIComponent(eventData[9]);	
            formpost += '&Description='+encodeURIComponent(eventData[13]);
            formpost += '&Notes=';
            */

            // need to check advancement too

            //if(formpost.indexOf('Advancement%3A') != -1) {
            //	//set Advancement
            //	setCopyAdvancement(EventID,pageid,formpost,remindpost);
            //	return;
            //}


            var remindpost = '';

            //get any reminders from the formpost
            remindpost = getReminders(formpost);


            //set rsvp
            var rsvp = getToken(formpost, 'RSVP');
            if (rsvp == 'on') {
                setCopyRSVP(EventID, pageid, formpost, remindpost);
                return;
            }

            if (remindpost != '') {
                saveCopyRemind(EventID, pageid, formpost, remindpost);
                return;
            }
            saveCopyEvent(formpost, EventID);


        }
    };
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp';
    xhttp.open("GET", url, true);
    xhttp.send();
    xhttp.onerror = function() {
        errHandle(copyEvent, '', '', '', '', '', '', '', '');
        if (servErrCnt > maxErr) {
            closeCopyEvent();
        }
    };

}



function setCopyAdvancement(EventID, pageid, formpost, remindpost) {

    var advanceList = getAdvancements(formpost);

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(setCopyAdvancement, EventID, pageid, formpost, remindpost); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            //for Each advancement listed, need to do a https://qa.scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID=795767&PageID=Page71631&Action=UpdateRequirementGroupOptions&ID=AdventureID1
            // and parse the response for the requirements selected.
        }
    };

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID=' + EventID + '&Action=UpdateAdvancementLI';
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send('PageID=Page' + pageid + advanceList);
    xhttp.onerror = function() {
        errHandle(setCopyAdvancement, EventID, pageid, formpost, remindpost);
        if (servErrCnt > maxErr) {
            closeCopyEvent();
        }
    };

}
//### Try this	
//https://qa.scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID=795767&Action=UpdateAdvancementLI
//POST formpost='PageID=Page27242&Advancement=RankID13'
//Advancement:AdventureID1

//then a GET
//https://qa.scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID=795767&PageID=Page27242&Action=UpdateRequirementGroupOptions&ID=RankID13

// ### then this if rank reqs defined?
// then a post
//https://qa.scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID=795767&Action=StoreRequirements
//Post
/*
PageID:Page27242
Requirements:AtEventRankID_13_326
Requirements:AtEventRankID_13_328
Requirements:AtEventRankID_13_329
Requirements:AtEventRankID_13_330
Requirements:AtEventRankID_13_331
Requirements:AtEventRankID_13_332
*/


//then click SAVE
//another post..?
//https://qa.scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID=795767&Action=UpdateAdvancementLI
//POST
//Advancement:RankID13


//then the event post
//https://qa.scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID=795767
//POST adds all this stuff
/*	
Requirements:AtEventRankID_13_326
Requirements:AtEventRankID_13_328
Requirements:AtEventRankID_13_329
Requirements:AtEventRankID_13_330
Requirements:AtEventRankID_13_331
Requirements:AtEventRankID_13_332
Advancement:RankID13	
*/


function getAdvancements(formpost) {
    var rstr = '';
    var res = formpost.match(/Advancement=([^&]+)/g);
    if (res != null) {
        for (var i = 0; i < res.length; i++) {
            rstr += '&' + res[i];
        }
    }
    return rstr;
}



function closeCopyEvent() {
    $('#buttonCancel, #buttonSubmit,#buttonDelete, #bottonCopy').button('enable');

    $.mobile.loading('hide');
}

function getReminders(formpost) {
    var rstr = ''
    var res = formpost.match(/Reminders=([^&]+)/g);
    if (res != null) {
        for (var i = 0; i < res.length; i++) {
            rstr += '&' + res[i];
        }
    }
    return rstr;
}

function setCopyRSVP(eventid, pageid, formpost, remindpost) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(setCopyRSVP, eventid, pageid, formpost, remindpost); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            if (remindpost != '') {
                saveCopyRemind(eventid, pageid, formpost, remindpost);
                return;
            }
            saveCopyEvent(formpost, eventid);

        }
    };

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID=' + eventid + '&Action=UpdateRSVP&RSVP=1';
    xhttp.open("GET", url, true);
    xhttp.send();
    xhttp.onerror = function() {
        errClHandle(pageid, closeCopyEvent, [pageid], setCopyRSVP, [eventid, pageid, formpost, remindpost]);
    };
}

function saveCopyRemind(eventid, pageid, formpost, remindpost) {


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(saveCopyRemind, eventid, pageid, formpost, remindpost); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            saveCopyEvent(formpost, eventid, pageid);
        }
    };

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID=' + eventid + '&Action=SaveReminders';
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send('PageID=Page' + pageid + remindpost);
    xhttp.onerror = function() {
        errClHandle(pageid, closeCopyEvent, [pageid], saveCopyRemind, [eventid, pageid, formpost, remindpost]);
    };
}

function saveCopyEvent(formpost, eventid, pageid) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(saveCopyEvent, formpost, eventid, pageid); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            // nav to new event;
            closeCopyEvent();
            changepageurl('/mobile/dashboard/calendar/event.asp?EventID=' + eventid);
        }
    };

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID=' + eventid;
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(formpost);
    xhttp.onerror = function() {
        errClHandle(pageid, closeCopyEvent, [pageid], saveCopyEvent, [formpost, eventid, pageid]);
    };
}