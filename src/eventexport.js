// Copyright © 10/22/2018 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.

function proc_Ajax_InsertCalExportCSVLink(data) {
    if (data.match(/>Create New Event</) != null) {
        // insert the export
        var startfunc = data.indexOf('>Create New Event<');
        var startfunc = data.indexOf('</ul>', startfunc);
        if (startfunc != -1) {
            //data=data.slice(0,startfunc) + '<li> <a href="#"  id="exportCSVEvents" class="showLoading" >Export CSV Events</a></li>' + data.slice(startfunc);

            var newdata = '	<li class="csv" id="csvxDivider" data-theme="d" >';
            newdata += '    <a href="#exportEventMenu" data-rel="popup" data-transition="slideup" >';
            newdata += '	<div id ="exportEvent">';
            newdata += '		<div style="display: inline-block; width: 28px; margin-right: 1px; ">';
            newdata += '			<img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/quickentry48.png" alt="quick entry" title="Export Calendar Event" style="position: absolute; left: 12px; top: 6px; width: 23px; " />'; //class="imageSmall"
            newdata += '		</div>';
            newdata += '		Export Calendar Events to CSV';
            newdata += '	</div>';
            newdata += '	</a>';
            newdata += '</li>';
            //newdata = '	<li class="csvx" id="csvDividerx" data-theme="d" >';							


            data = data.slice(0, startfunc) + newdata + data.slice(startfunc);

        }
    }
    return data;
}

function insertEventExport(data, pageid) {
    var startfunc = data.indexOf('<div id="footer"');

    var newdata = '	<div data-role="popup" id="exportEventMenu" data-theme="d" data-history="false">';
    //newdata += '		<div style="display: inline-block; width: 28px; margin-right: 1px; ">';
    newdata += '<ul data-role="listview" data-inset="true" style="min-width: 300px;" data-theme="d" >'; //class="ui-icon-alt"
    newdata += '<li data-role="divider" data-theme="e">Choose Date Range to export:</li>';
    newdata += '			<li   id="startDateLI" >'; //data-theme="d" style="padding-left:10px"	data-role="fieldcontain"
    newdata += '				<label for="startDate">Start Date:</label>';
    newdata += '				<input type="date" name="StartDate" id="startDate" value="" />';
    //newdata +=	'				<input type="text" name="StartDate" id="startDate" value="" />';  //class="calendar" 
    newdata += '			</li>';
    newdata += '			<li  data-theme="d" id="endDateLI" >'; //style="padding-left:10px	data-role="fieldcontain"				
    newdata += '				<label for="endDate">End Date:</label>';
    newdata += '				<input type="date" name="EndDate" id="endDate" value=""  />';
    //newdata +=	'				<input type="text" name="EndDate" id="endDate" value="" class="calendar" />';
    newdata += '			</li>';
    newdata += '			<li><input type="submit" value="Export Event File" data-theme="g" id="buttonEvExport" ><input type="submit" value="Cancel" data-theme="g" id="buttonExportEvCancel" ></li>';
    newdata += '			<li id="exportErrEvLI">';
    newdata += '			</li>';
    newdata += '</ul>';

    //newdata += '	</div>';			
    newdata += '	</div>';
    data = data.slice(0, startfunc) + newdata + '\n' + data.slice(startfunc);

    // ## Event export
    startfunc = data.indexOf("function showProgress");
    var myfunc = '' + evimpfc;
    myfunc = myfunc.slice(21).slice(0, -1).replace(/\#PageX/g, '#Page' + escapeHTML(escapeHTML(pageid))).replace('unitid', escapeHTML(unitID));
    data = data.slice(0, startfunc) + myfunc + '\n' + data.slice(startfunc);



    startfunc = data.indexOf("@media (min-width:");
    newdata = '';
    newdata += '			#PageX .ui-select .ui-btn-icon-right .ui-btn-inner	{ padding-left: 10px; padding-right: 35px; }\n';
    newdata += '			#PageX .ui-select .ui-btn-icon-right .ui-icon		{ right: 10px; }\n';
    newdata += '			#PageX .smallText		{ color: gray; margin-top: 15px; }\n';
    newdata += '			#PageX img.imageSmall	{ position: relative; width: 30px; height: 30px; top: -5px; border: 1px solid gray; }\n';


    data = data.slice(0, startfunc) + newdata + '\n' + data.slice(startfunc);

    return data;

}

//## Begin CalendarExport Code

function evimpfc() {
    var fileObjs = {};
    $('#buttonExportEvCancel', '#PageX').click(function() {
        $('#exportEventMenu', '#PageX').popup('close');
        $('#buttonEvExport', '#PageX').button('enable');
        $('#buttonExportEvCancel', '#PageX').button('enable');
    });
    $('#buttonEvExport', '#PageX').click(function() {
        $('#faOverlay', '#PageX').show()

        // disable all inputs
        $('#buttonEvExport', '#PageX').button('disable');
        $('#buttonExportEvCancel', '#PageX').button('disable');

        if (processEventExport('#PageX') == false) {
            //$('#exportErrEvLI', '#PageX').text('Make sure the start date is before the end date');
            $('#buttonEvExport', '#PageX').button('enable');
            $('#buttonExportEvCancel', '#PageX').button('enable');
            $('#faOverlay', '#PageX').hide();
        }

    });

    $('.calendar', '#PageX').each(function() {
        var id = $(this).attr('id');
        $(this).width('75%').before('<img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/calendar50.png" style="float: right; width: 25px; margin-top: 5px; cursor: pointer; " class="calendarIcon" />');
        $($(this).closest('form'), '#PageX').prepend('<input type="hidden" id="hidden_' + id + '" value="' + $(this).val() + '" />');
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

function processEventExport(pageid) {
    var startDt = $('#startDate', pageid).val();
    var endDt = $('#endDate', pageid).val();

    if (startDt == '' || endDt == '') {
        $('#exportErrEvLI', '#PageX').text('Please select dates');
        return false;
    }
    startDt = startDt.match(/\d+-(\d+)-\d+/)[1] + '/' + startDt.match(/\d+-\d+-(\d+)/)[1] + '/' + startDt.match(/(\d+)-\d+-\d+/)[1];
    endDt = endDt.match(/\d+-(\d+)-\d+/)[1] + '/' + endDt.match(/\d+-\d+-(\d+)/)[1] + '/' + endDt.match(/(\d+)-\d+-\d+/)[1];

    if (dateDiff(startDt, endDt) > 0) {
        $('#exportErrEvLI', '#PageX').text('Make sure the start date is before the end date');
        return false;
    }

    $.mobile.loading('show', {
        theme: 'a',
        text: 'saving multiple events.  Please be patient...',
        textonly: false
    });
    getCalPagea(pageid, startDt, endDt);
    return true;
}

function getCalPagea(pageid, startDt, endDt) {
    var lnk;
    var txt;
    var evname;
    var ttxt;
    var eventid;
    var evObj = {
        name: '',
        id: ''
    };
    evLst.length = 0;
    eventArr.length = 0;
    var calPageId = '';

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            $('#faOverlay', pageid).hide();
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(getCalPage, pageid, '', '', '', '', '', ''); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            //67
            calPageId = 'Page' + $('div[data-role="page"]', this.response).attr('id').match(/\d+/)[0];

            var dateLst = [];
            $('script[type="text/javascript"]', this.response).each(function() {
                //console.log($(this).html());
                if ($(this).html().match(/d\: new Date\(\d+, \d+, \d+\)/g) != null) {
                    //build date list						

                    var res = $(this).html().match(/d\: new Date\(\d+, \d+, \d+\)/g);
                    for (var i = 0; i < res.length; i++) {
                        var d = res[i].match(/(\d+), (\d+), (\d+)/);
                        var curDate = (parseInt(d[2]) + 1) + '/' + d[3] + '/' + d[1];
                        if (dateDiff(startDt, curDate) < 1) {
                            if (dateDiff(curDate, endDt) < 1) {
                                pushUnique(dateLst, curDate);
                            }
                        }
                    }

                }
            });

            if (dateLst != '') {
                getDateEventIds(dateLst, calPageId, pageid);
            } else {
                $.mobile.loading('hide');
                alert('No events in selected range');
                $('#buttonEvExport', pageid).button('enable');
                $('#buttonExportEvCancel', pageid).button('enable');
                $('#faOverlay', pageid).hide();
            }

        }
    };

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/';
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();
    xhttp.onerror = function() {
        if (servErrCnt > maxErr) {
            evLst.length = 0; // kill the remaining dates
        }
        errHandle(getCalPage, pageid, '', '', '', '', '', '')
    };

}


function getDateEventIds(dateLst, calPageId, pageid) {

    var thisDate = dateLst[0];
    var evData = {
        csv: '"Calendar","EventType","Name","Location","StartDate","StartTime","EndDate","EndTime","RSVP","Permission","Leaders","Parents","Scouts","Description","Reminders","mapURL"\n',
        Calendar: '',
        EventType: '',
        Name: '',
        Location: '',
        StartDate: '',
        StartTime: '',
        EndDate: '',
        EndTime: '',
        RSVP: '',
        Permission: '',
        Leaders: '',
        Parents: '',
        Scouts: '',
        Description: '',
        Reminders: '',
        cids: [],
        mapURL: ''
    };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            $('#faOverlay', pageid).hide();
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(getDateEventIds, dateLst, calPageId, pageid, '', '', '', ''); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            var res = this.response.match(/EventID=\d+/g);
            if (res != null) {
                for (var i = 0; i < res.length; i++) {
                    pushUnique(evLst, res[i].match(/EventID=(\d+)/)[1]);
                }
            }
            dateLst.shift();
            if (dateLst.length > 0) {
                setTimeout(function() {
                    getDateEventIds(dateLst, calPageId, pageid);
                }, 100);
            } else {
                //console.log(evLst);
                saveEventDetails(calPageId, pageid, evData);

                //done

            }
        }
    };
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/default.asp?Action=GetEvents&PageID=' + calPageId + '&Date=' + thisDate;
    xhttp.open("GET", url, true);
    xhttp.responseType = "text";
    xhttp.send();
    xhttp.onerror = function() {
        if (servErrCnt > maxErr) {
            evLst.length = 0; // kill the remaining dates
        }
        errHandle(getDateEventIds, dateLst, calPageId, pageid, '', '', '', '');
    };
}


function saveEventDetails(calPageId, pageid, evData) {

    evData.Calendar = '';
    evData.EventType = '';
    evData.Name = '';
    evData.Location = '';
    evData.StartDate = '';
    evData.StartTime = '';
    evData.EndDate = '';
    evData.EndTime = '';
    evData.RSVP = '';
    evData.Permission = '';
    evData.Leaders = '';
    evData.Parents = '';
    evData.Scouts = '';
    evData.Description = '';
    evData.Reminders = '';
    evData.cids = [];
    evData.mapURL = '';

    var thisEvent = evLst[0];
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            $('#faOverlay', pageid).hide();
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(getDateEventIds, dateLst, calPageId, pageId, '', '', '', ''); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            //Calendar	EventType	Name	Location	StartDate	StartTime	EndDate	EndTime	RSVP	Permission	Leaders	Parents	Scouts	Description	Reminders
            //Troop 194 B		Leader Meeting	Colchester PD | Kirker Room	3/4/2019	6:00 PM	3/4/2019	7:15 PM	off	off	on	off	off	test	


            evData.cids = $('#calendarID', this.response).val();

            var cal = '';
            $('#calendarID option:selected', this.response).each(function() {
                if (cal != '') {
                    cal += ',';
                }
                cal += $(this).text();
            });
            evData.Calendar = cal;
            var eventtype = 'none';
            for (var x = 0; x < this.response.scripts.length; x++) {
                if (this.response.scripts[x].text.match(/\$\('#eventType', '#Page\d+'\).append\('<option  selected="selected"  value="([^"]+)/) != null) {
                    eventtype = this.response.scripts[x].text.match(/\$\('#eventType', '#Page\d+'\).append\('<option  selected="selected"  value="([^"]+)/)[1];
                    break;
                }
            }

            evData.EventType = eventtype;
            evData.Name = $('#name', this.response).val().replace(/"/g, "'");
            evData.Location = $('#location', this.response).val().replace(/"/g, "'");
            var dtTm = $('#startDate', this.response).val().split(' ');

            if (dtTm.length < 2) {
                dtTm.push('12:00');
                dtTm.push('AM');
            } else {
                if (dtTm[1].match(/(\d+:\d+):\d+/) != null) {
                    dtTm[1] = dtTm[1].match(/(\d+:\d+):\d+/)[1];
                }

            }
            evData.StartDate = dtTm[0];
            evData.StartTime = dtTm[1] + ' ' + dtTm[2];
            var dtTm = $('#endDate', this.response).val().split(' ');
            if (dtTm.length < 2) {
                dtTm.push('12:00');
                dtTm.push('AM');
            } else {
                if (dtTm[1].match(/(\d+:\d+):\d+/) != null) {
                    dtTm[1] = dtTm[1].match(/(\d+:\d+):\d+/)[1];
                }

            }
            evData.EndDate = dtTm[0];
            evData.EndTime = dtTm[1] + ' ' + dtTm[2];
            evData.RSVP = $('#rsvp', this.response).val();
            evData.Permission = $('#slipsRequired', this.response).val();
            evData.Description = $('#description', this.response).val().replace(/"/g, '""');
            evData.mapURL = $('#mapURL', this.response).val();

            postURemind(calPageId, pageid, evData); // get reminders
            return;

        }
    };
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID=' + thisEvent;
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();
    xhttp.onerror = function() {
        if (servErrCnt > maxErr) {
            evLst.length = 0; // kill the remaining dates
        }
        errHandle(getDateEventIds, dateLst, calPageId, pageId, '', '', '', '');
    };
}

function postURemind(calPageId, pageid, evData) {


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            $('#faOverlay', pageid).hide();
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(postURemind, calPageId, pageid, evData, '', '', '', ''); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            var respText = this.responseText.split('\n')

            for (var i = 0; i < respText.length; i++) {
                if (respText[i].match(/append/) != null) {

                    if (respText[i].match(/([0-9]+) hour/) != null) {
                        if (evData.Reminders != '') {
                            evData.Reminders += ' ';
                        }
                        evData.Reminders += respText[i].match(/([0-9]+) hour/)[1] + 'h';
                    }
                    if (respText[i].match(/([0-9]+) day/) != null) {
                        if (evData.Reminders != '') {
                            evData.Reminders += ' ';
                        }
                        evData.Reminders += respText[i].match(/([0-9]+) day/)[1] + 'd';
                    }
                }
            }


            //fill the rest;
            getEditEventPgUAGEx(calPageId, pageid, evData);
        }

    };
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID=' + evLst[0] + '&Action=UpdateRemindersLI&PageID=' + calPageId;
    xhttp.open("POST", url, true);
    xhttp.responseType = "text";
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send();
    xhttp.onerror = function() {
        if (servErrCnt > maxErr) {
            $.mobile.loading('show', {
                theme: 'a',
                text: 'restoring selection...',
                textonly: false
            });
            evLst.length = 0; // kill the remaining dates
            setTimeout(function() {
                //resetCalendarIDs();
            }, 200);
            return;
        }
        errHandle(postURemind, calPageId, pageid, evData, '', '', '', '');
    };
}

function getEditEventPgUAGEx(calPageId, pageid, evData) {

    var CGID = '';
    for (var i = 0; i < evData.cids.length; i++) {
        CGID += '&CalendarID=' + evData.cids[i];
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            $('#faOverlay', pageid).hide();
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(getEditEventPgUAGEx, calPageId, pageid, evData, '', '', '', ''); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            var respText = this.responseText.split('\n')
            var respFilt = '';
            for (var i = 0; i < respText.length; i++) {
                if (respText[i].match(/selected="selected"/) != null) {
                    if (respText[i].indexOf(">ACCOUNT, ") == -1) {
                        if (respText[i].indexOf(">SCOUT, Removed") == -1) {
                            //calPage.users.push(respText[i].match(/value="([^U]+UserID[0-9]+)/)[1]);
                            //calPage.formData += '&Attendees=' +respText[i].match(/value="([^U]+UserID[0-9]+)/)[1];
                            respFilt += respText[i] + '\n';
                        }
                    }
                }
            }

            //var leaderLst=rematchx('selected\\"[ ]+value=\\"(LeaderUserID\\d+)','g',respFilt,1);
            //var parentLst=rematchx('selected\\"[ ]+value=\\"(ParentUserID\\d+)','g',respFilt,1);
            //var scoutLst=rematchx('selected\\"[ ]+value=\\"(ScoutUserID\\d+)','g',respFilt,1);

            evData.Leaders = 'off';
            if (rematchx('selected\\"[ ]+value=\\"(LeaderUserID\\d+)', 'g', respFilt, 1).length == rematchx('value=\\"(LeaderUserID\\d+)', 'g', respFilt, 1).length) {
                evData.Leaders = 'on';
            }
            evData.Parents = 'off';
            if (rematchx('selected\\"[ ]+value=\\"(ParentUserID\\d+)', 'g', respFilt, 1).length == rematchx('value=\\"(ParentUserID\\d+)', 'g', respFilt, 1).length) {
                evData.Parents = 'on';
            }
            evData.Scouts = 'off';
            if (rematchx('selected\\"[ ]+value=\\"(ScoutUserID\\d+)', 'g', respFilt, 1).length == rematchx('value=\\"(ScoutUserID\\d+)', 'g', respFilt, 1).length) {
                evData.Scouts = 'on';
            }

            evData.csv += '"' + evData.Calendar + '","' + evData.EventType + '","' + evData.Name + '","' + evData.Location + '","' + evData.StartDate + '","' + evData.StartTime + '","' + evData.EndDate + '","' + evData.EndTime + '","' + evData.RSVP + '","' + evData.Permission + '","' + evData.Leaders + '","' + evData.Parents + '","' + evData.Scouts + '","' + evData.Description + '","' + evData.Reminders + '","' + evData.mapURL + '"\n';
            evLst.shift();
            if (evLst.length > 0) {
                setTimeout(function() {
                    saveEventDetails(calPageId, pageid, evData);
                }, 100);
            } else {
                saveText('Calendar ' + logTime(Date.now()) + '.csv', evData.csv);
                $('#buttonEvExport', pageid).button('enable');
                $('#buttonExportEvCancel', pageid).button('enable');
                $.mobile.loading('hide');
                $('#faOverlay', pageid).hide();
                alert('Complete');
            }



        }
    };



    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/calendar/editevent.asp?EventID=' + evLst[0] + '&PageID=' + calPageId + '&Action=UpdateAttendeeGroupOptions' + CGID + '&EventType=' + evData.EventType;
    xhttp.open("GET", url, true);
    xhttp.responseType = "text";
    xhttp.send();
    xhttp.onerror = function() {
        //window.console &&console.log("error getting getEditEvent " + xhttp.status);
        // On error, bail.  Set stuff to kill processing



        if (servErrCnt > maxErr) {
            $.mobile.loading('show', {
                theme: 'a',
                text: 'restoring selection...',
                textonly: false
            });
            evLst.length = 0; // kill the remaining dates
            setTimeout(function() {
                //resetCalendarIDs();
            }, 200);
            return;
        }
        servErrCnt++;
        setTimeout(function() {
            getEditEventPgUAGEx(calPageId, pageid, evData);
        }, 1000); //reset 		 

    };
}