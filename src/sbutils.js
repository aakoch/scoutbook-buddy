//import * as undo from "./undo";
// sbutils.js
// Copyright © 10/4/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.
//PUBLIC
//window.console &&console.log("injected script execute event page " );
/*
  Global variables
  well global in the context of a specific SB tab
  Each Chrome tab has its own set
*/
//window.console &&console.log("pagebeforeshow event page " +document.getElementsByClassName("ui-page")[0].id)
//not allowed in inject. var manifestData = chrome.runtime.getManifest();

//console.log('in inject . Reload will cause this to appear.  So does opening a new tab.');
var current
var trainingQA = false;
var enableTrainingQA = false;
var injectver = '0.0.22';
var councilTextName = '';
var mbcCouncils = ['Three Fires Council'];
var scoutlist = '';
var scoutUserID = [];
var payObj = {
    paymentLogIDList: [],
    paymentLogTxtList: [],
    paymentLogScoutList: []
};
//var paymentLogIDList=[];
//var paymentLogTxtList=[];
//var paymentLogScoutList=[];
var mbsearch = false;
var unitID;
var denID;
var patrolID;
var QEPatrol = '';
var QEPatrolID = '';
var scoutPermObjList = [];
var scoutPermPayObjList = [];
var addMBFlag = '';
var MBCdata = [];
var MBCQEMBflag = false;
var MBCqeReqFlag = false;
var pickMBCFlag = false;
var pickMBCFlagUnit = '';
var fulltable = [];
var uniqlist = [];
var counselorApprvLst = [];
var counselorApprvReqLst = [];
var mbclist = [];
var mbcpages = 0;


var addMBID = []; //list of mb ids to be added for each scout selected
var scoutUserIDMB = []; // list of selected scouts for adding mbs
var scoutUserIDMBmbc = []; //duplicate list, used for inviting counselors
var scoutUserIDMBname = []; // list of selected scout names for adding mbs
var sUIindex = -1;
var inviteMBCperm = false;
//var addMBC =[];
var addMBIDindex = -1;
var debug = 0;
//################
var iPage = '';

var payPos = ["Unit Treasurer", "Troop Admin", "Pack Admin", "Crew Admin", "Den Admin", "Patrol Admin", "Ship Admin"];
var payTotals = [];
var iEventID = '';
var initEventID = '';
var stDate = [];
var enDate = [];
var stDateFromArchive = [];
var enDateFromArchive = [];
var calLst = []; // entry list of calendar IDs selected by the user.  May want to move this into the page context

var cPage = ''; // the current pageID for the calendar page
var eventArr = [];
var evMsgObj = {
    scoutid: [],
    leaderid: [],
    parentid: [],
    scoutname: [],
    event: '',
    where: '',
    when: '',
    eventid: '',
    stat: '',
    descript: '',
    units: [],
    shown: false,
    body: '',
    subject: '',
    type: ''
};

var evLst = []; // selected list of event ids used for updating events when adding invitees

var rptArray = new Array();
var eventArray = new Array();
var recurEventIDs;
var preExistEvent; //boolean.  If the event is NEW it will be set to false.  If it is prexisting it will be set to true

var preExistRemind = false;
var preExistAdvance = false;
var hrflist = [];
var links = [];


//######  Black Pug Import Vars
var mbfirst = true; //process mbs before mbreqs
var bpdata = {};
var servErrCnt = 0;
var maxErr = 5;
var firstoff;
var lastoff;

var noNameMatch = [];
var scoutArr = [];
var mbArr = []; //array of objects with .id, .name, .bpmbname
var unitlist = [];
var recordPtr = {}; //pointer to start and end of Black Pug recordset
var mbInQ; // a black pug mb bame that isn't matched and is currently present to user as in question
var toSaveObj = {
    lst: [],
    scoutid: '',
    id: '',
    yrid: '',
    date: '',
    scout: '',
    bpreq: []
};
var myPositions = [];
var submitCompleteList = [];
var tryName = '';
var unmatchedmb = [];
var bpdataScouts = [];

var swimQE = false;
var healthQE = false;
var schoolQE = false;
var oaQE = false;
var oaRpt = false;
var payRpt = false;
//var swimRpt=false;
var MBCRpt = false;
var yptRpt = false;
var cstRpt = false;
var trainQE = false;
var youthLeaderQE = false;
var scoutProfileObjList = [];
var scoutHealthObjList = [];
var scoutHealthObjListPtr = 0;

var scoutSchoolObjList = [];
var scoutSchoolObjListPtr = 0;

var ismobile = navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i);
var lastEvent = 0;
var warned = false;

var stickyDate = '';
var gInviteScout = '';
//ismobile=true;  set true to test mobile version

//##################

// Set URL host
var host = document.baseURI.match(/\/\/([^\.]+)/)[1] + '.';

// Reload the page so scripts may be embedded
//dbconsole.log('inject has loaded');

// bindings moved to bindings.js

function asetup(bindToFilter, cnt) {

    try {
        $.ajaxSetup({
            dataFilter: function(data, type) {
                //console.log('ajax rx '+type, this.url);
                for (var i = 0; i < bindToFilter.funcDefs.length; i++) {
                    var newdata = bindToFilter.funcDefs[i](data, type, this.url);
                    if (newdata != undefined && newdata != '') data = newdata;
                }

                return data;
            },
            beforeSend: function(xhr, settings) {
                if (typeof detectSendLogoff != 'undefined') {
                    detectSendLogoff(settings); //session 
                }
                //return xhr;
            }
        });
    } catch {
        if (cnt > 3) {
            console.log("Can't setup ajax");
        } else {
            console.log("error setup ajax - retry");
            cnt += 1;
            setTimeout(function() {
                asetup(bindToFilter, cnt);
            }, 500);
        }
    }


}



function detectSendLogoff(settings) {
    if (settings.url.indexOf('/mobile/login.asp?Action=Logout') != -1) {
        //alert('logout');
        var msgObj = {
            hostx: "oth",
            text: "LogOff"
        };
        if (host == "www.") {
            msgObj.hostx = host;
        }
        sendTimerMsg(msgObj, "*");
    }
}
/*******************************************************
 *	To bind to the filter, use bindToFilter.addFuncDef(yourfunc);
 *
 *   If you want your function to modify the received data, return it in 
 *   your function
 *
 ********************  End Common Code  *****************/

// Simple pass through func.  Def will be bound to Ajax Call
function faFilter(data, type, thisurl) {
    var newdata = processRawData(data, type, thisurl);
    //if (typeof lastcall === 'undefined') {
    //} else {
    //	data=lastcall(data);
    //}
    return newdata;
}

//bindings moved to bindings.js

function localDataFilter(data, type, url) {
    //console.log('ajax rx '+type, this.url);
    for (var i = 0; i < bindToFilter.funcDefs.length; i++) {
        var newdata = bindToFilter.funcDefs[i](data, type, url);
        if (newdata != undefined && newdata != '') data = newdata;
    }

    return data;
}

function processRawData(data, type, thisurl) {
    //console.log(thisurl);
    //get a fuller url for ajax responses
    if (thisurl.match(/\/includes\/ajax\.asp/) != null) {
        thisurl = 'scoutbook.com/mobile' + thisurl;
    }


    // DO NOT PROCESS FURTHER IF THIS PAGE IS DETECTED
    if (thisurl.match(/scoutbook\.com\/mobile\/signup/) != null) {
        //console.log('This page is undisturbed -signup'+thisurl);
        return data;
    }

    if (enableTrainingQA == true) {
        if (thisurl.match(/qa\.scoutbook\.com\/mobile\//) != null) {
            //hide qa data

            startfunc = data.indexOf('>ANSWEB');
            startfunc = data.indexOf('<div style="text-align: left;">', startfunc);
            var wdata = '';

            if (data.match(/id[^=]*=[^"]*\"Page(\d+)/) != null) {
                var pageid = data.match(/id[^=]*=[^"]*\"Page(\d+)/)[1];

                wdata += '					<div style="float: right; text-align: right; " class="sendEmail">\n'; //colors
                wdata += '						<a data-role="button" data-theme="h" data-inline="true" data-mini="true" href="#" id="buttonAssist">\n';
                wdata += '							<div style="margin-left: 30px; position: relative; ">\n';
                //wdata += '								<img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/emailgray48.png" style="position: absolute; width: 24px; left: -30px; top: -4px; " />\n';
                wdata += '								\n';
                wdata += '							</div>\n';
                wdata += '						</a>\n';
                wdata += '					</div>\n';

                wdata += '<script>\n';
                wdata += '$("#buttonAssist","#Page' + pageid + '").click(function() {\n';
                //wdata += '    debugger;\n';
                wdata += '    if(trainingQA==true) {\n';
                wdata += '		trainingQA=false;\n';
                wdata += '	} else {\n';
                wdata += "	    trainingQA=true;\n";
                wdata += '	}\n';
                wdata += '});\n';
                wdata += '</script>\n';

            }

            newdata = data.slice(0, startfunc) + wdata + '<div style="text-align: left;" hidden>' + data.slice(startfunc + '<div style="text-align: left;">'.length);
            data = newdata;


            // hide new reports
            startfunc = data.indexOf('RBType=New');
            if (startfunc != -1) {
                startfunc -= 100;
                startfunc = data.indexOf('<li', startfunc);
                newdata = data.slice(0, startfunc);
                startfunc = data.indexOf('</li', startfunc);
                newdata += data.slice(startfunc + 5);
                data = newdata;
            }


            startfunc = data.indexOf('<li><a href="https://reportsqa.scoutbook.com/vim2/webscript/output/sbreports.aspx?Method=ExecuteScriptSet&ScriptSetCode=SBReportBuilderDesigne');
            if (startfunc != -1) {
                newdata = data.slice(0, startfunc);
                startfunc = data.indexOf('</li', startfunc);
                newdata += data.slice(startfunc + 5);
                data = newdata;
            }


            startfunc = data.indexOf('<li><a href="setupsso.asp');
            if (startfunc != -1) {
                newdata = data.slice(0, startfunc);
                startfunc = data.indexOf('</li', startfunc);
                newdata += data.slice(startfunc + 5);
                data = newdata;
            }
            if (trainingQA == true) {
                return data;

                /*		<li class="reports ui-icon-alt">
                				<a href="/mobile/dashboard/reports/reportbuilder.asp?RBType=New">
                					New Report Builder
                				</a>
                			</li>
                */
            }
        }
    }
    //handle Site Wide functions and Monitors
    if (thisurl.match(/scoutbook\.com\/mobile\//) != null) {

        if (thisurl.match(/\/mobile\/includes\/ajax/) == null) {
            procOnMobilePageRcvd(thisurl); //this response is a full Page
        } else {
            data = proc_AjaxSnippet(data, thisurl); // This response is a snippet 
            return data;
        }

        if (data == 'mobile_refreshPage();') return data;

        //common pageid handling
        //Reports do not have pageids

        var pageid = '';
        var tpageid = '';
        // For some reason, this code was added.
        // 10/31 if(thisurl.match(/mobile\/dashboard\/reports/) == null ) {
        //  When looking now, the only pages I see issue with are roster reports witn a reports/roster.asp?Action=Print		or /dashboard/reports/individualrecord.asp?ReportType=
        if (thisurl.match(/mobile\/dashboard\/reports\/individualrecord\.asp\?ReportType=/) == null && thisurl.match(/mobile\/dashboard\/reports\/roster\.asp\?Action=Print/) == null) {
            if (data.match(/id[^=]*=[^"]*\"Page(\d+)/) == null) {
                //possible default page
                if (data.match(/id[^=]*[^"]*=\"defaultPage/) == null) {
                    if (data.match(/id[^=]*[^"]*=\"helpPage/) != null) {
                        tpageid = 'helpPage';
                    } else {
                        //No page ID, posible user session timeout or unrecognized snippet;
                        //No further processing
                        return data;
                    }
                } else {
                    tpageid = 'defaultPage';
                }
            } else {
                pageid = data.match(/id[^=]*=[^"]*\"Page(\d+)/)[1]; // pageid is num
                tpageid = 'Page' + pageid;
            }




            var err = false;
            data = rawDataFullPageSession(data, tpageid, err, thisurl);
            if (err == true) {
                return data; //page is unrecognized
            }

        }
        /*  10/31 else {
			if(thisurl.match(/mobile\/dashboard\/reports\/reportbuilder/) != null ) {
				if(data.match(/id[^=]*=[^"]*\"Page(\d+)/) != null) {
					pageid = data.match(/id[^=]*=[^"]*\"Page(\d+)/)[1];		// pageid is num
					tpageid='Page'+pageid;					
				}
			}
		}*/
        var newdata = '';
        //add modification notice to all pages
        if (pageid != '') {
            startfunc = data.indexOf('<div style="margin-top: 6px;">&copy;');
            newdata = data.slice(0, startfunc);
            newdata += '<div style="margin-top: 6px;">Feature Assistant Active</div>';
            data = newdata + data.slice(startfunc);
        }



    }



    // page specific modifications defined her
    if (thisurl.match(/mobile\/dashboard\//) != null) {


        if (data.match(/<title>Scoutbook<\/title>/) != null) {
            //alert('Scoutbook has terminated your session');
            //the session terminated for some unknown reason, just return
            return data;
        }



        //if(thisurl.match(/scoutbook\.com\/mobile\/dashboard\/reports\/roster\.asp/) != null ) {
        //if(thisurl.match(/Action=Print/) != null) {
        //	data=data.replace('formPost','');
        //	alert('got it');
        //	console.log('replace formPost');
        //}
        //data=data.replace(/target="_blank"/g,'');
        //}	





        data = procRaw_Dashboard_Admin_Connectionsmanager(data, thisurl, pageid);

        data = procRaw_Dashboard_Reports_Roster(data, thisurl, pageid);

        //data=procRaw_Dashboard_Reports_ReportBuilder(data,thisurl,pageid);

        data = procRaw_Dashboard_Calendar_Edit_Event(data, thisurl, pageid);

        data = procRaw_Dashboard_Calendar_Event(data, thisurl, pageid);

        data = procRaw_Dashboard_Messages_Default(data, thisurl, pageid);

        data = procRaw_Dashboard_Calendar(data, thisurl, pageid);

        data = procRaw_Dashboard(data, thisurl, pageid);

        data = procRaw_Admin_Unit(data, thisurl, pageid);

        data = procRaw_Admin_Denpatrol(data, thisurl, pageid);

        data = procRaw_Admin_Paymentslogentry(data, thisurl, pageid);

        data = procRaw_Admin_Paymentslog(data, thisurl, pageid);

        //data=procRaw_Dashboard_Reports_Leadertraining(data,thisurl,pageid);

        data = procRaw_Dashboard_Admin_Adultconnections(data, thisurl, pageid);

        data = procRaw_Dashboard_Admin_Counseloresults(data, thisurl, pageid);

        //	data=procRaw_Dashboard_Admin_Counselorlist(data,thisurl,pageid);

        data = procRaw_Dashboard_Admin_Advancement_Meritbadge(data, thisurl, pageid);

        if (MBCqeReqFlag == true) {
            data = procRaw_Admin_Advancement_Meritbadgequickentry2(data, thisurl, pageid);
        }

        if (addMBFlag != '') {
            data = procRaw_Admin_Advancement_Meritbadgequickentry(data, thisurl, pageid);
            addMBFlag = '';
        }

        data = procRaw_Admin_Roster(data, thisurl, pageid);

        data = procRaw_Dashboard_Admin_Advancement_Adventure(data, thisurl, pageid);

        data = procRaw_Dashboard_Reports_CouncilUser(data, thisurl, pageid);

        data = procRaw_Admin_XXXlog(data, thisurl, pageid);

        data = addOverlay(data, thisurl, pageid);
    }

    data = procRaw_Help(data, thisurl, pageid);
    data = procRaw_forums(data, thisurl, pageid);
    return data;
}

function proc_AjaxSnippet(data, thisurl) {
    // process an ajax response to insert calendar import link
    data = proc_Ajax_InsertCalImportCSVLink(data);
    data = proc_Ajax_InsertCalExportCSVLink(data);
    data = addRawAddBirthdayAjax(data);
    pokeSessionAjax(thisurl);


    return data;
}

//function gets called when a full page (no snippet) is received
function procOnMobilePageRcvd(thisurl) {
    $(document).one('pageshow', function() {
        // this code will run when the DOM is ready
        //console.log('loaded-------------------');

        //	setGlobalPasteFilter();

        // Session Timer Screen Resets
        pokeSession(thisurl);
    });
}

function procRaw_Help(data, thisurl, pageid) {
    if (thisurl.match(/scoutbook\.com\/mobile\/help\//) != null) {
        data = rawDataModifyHelp(data, pageid, thisurl);
    }
    return data;
}


function procRaw_forums(data, thisurl, pageid) {
    if (thisurl.match(/scoutbook\.com\/mobile\/forums\//) != null) {
        var startfunc;
        startfunc = data.indexOf("$('#followForum', '#Page");
        if (startfunc == -1) {
            return data;
        }



        startfunc = data.indexOf('var url', startfunc);

        var myfunc = '';



        myfunc += "var tres=confirm('Are you sure you want to change the subscription status to all threads in this forum?  Press OK to continue and Cancel to quit');\n";
        myfunc += "if(tres==false) {\n"

        myfunc += "   if($(this).val() == 'off') {\n";
        myfunc += "			 $('#followForum option[value=" + '"on"' + "]', '#Page" + pageid + "').prop('selected',true).trigger('change');\n";
        myfunc += "   } else {\n";
        myfunc += "			 $('#followForum option[value=" + '"off"' + "]', '#Page" + pageid + "').prop('selected',true).trigger('change');\n";
        myfunc += "   }\n";
        myfunc += "	return false;\n"
        myfunc += "}\n"


        var newdata = data.slice(0, startfunc) + myfunc + data.slice(startfunc);
        data = newdata;
    }
    return data;
}



function procRaw_Dashboard_Reports_Roster(data, thisurl, pageid) {

    if (thisurl.match(/scoutbook\.com\/mobile\/dashboard\/reports\/roster\.asp/) != null) {

        data = rawDataModifyRsvp(data, pageid);

        //data=rawDataModifyRosterExtended(data,pageid);	//intercept  submit

        //data=rawDataModifyRosterColAdd(data,pageid);  //handle swimdate
    }
    return data;
}


/* Leader Training Reports have been removed from Scoutbook.  This feature no longer available
function procRaw_Dashboard_Reports_Leadertraining(data,thisurl,pageid) {

	if(thisurl.match(/scoutbook\.com\/mobile\/dashboard\/reports\/leadertraining\.asp/) != null ) {	
	
		data=rawDataModifyLeaderTraining(data,pageid,thisurl);

	}
	return data;
}
*/
function procRaw_Dashboard_Admin_Adultconnections(data, thisurl, pageid) {

    if (thisurl.match(/scoutbook\.com\/mobile\/dashboard\/admin\/adultconnections\.asp/) != null) {
        data = addRawMyConnection(data, thisurl, pageid);
    }
    return data;
}

function procRaw_Dashboard_Admin_Counseloresults(data, thisurl, pageid) {
    if (thisurl.match(/scoutbook\.com\/mobile\/dashboard\/admin\/counselorresults\.asp/) != null) {
        data = addRawCounselorResults(data, thisurl, pageid);
    } else {
        gInviteScout = '';
    }
    return data;

}

function procRaw_Dashboard_Admin_Advancement_Meritbadge(data, thisurl, pageid) {
    if (thisurl.match(/scoutbook\.com\/mobile\/dashboard\/admin\/advancement\/meritbadge\.asp/) != null) {
        data = addRawMeritbadgeInvite(data, thisurl, pageid);
    }
    return data;

}


function procRaw_Dashboard_Admin_Counselorlist(data, thisurl, pageid) {

    if (thisurl.match(/scoutbook\.com\/mobile\/dashboard\/admin\/counselorlist\.asp/) != null) {
        if (thisurl.match(/UnitID\=(\d+)/) == null) {
            return data;
        }

        var unitID = /UnitID\=(\d+)/.exec(thisurl)[1];
        //alert(pageid);
        data = rawDataModifyCounselorList(data, pageid, thisurl, unitID);
    }
    return data;
}

/*  unused now.  Old Report Builder is no longer available
function procRaw_Dashboard_Reports_ReportBuilder(data,thisurl,pageid) {
	
	if(thisurl.match(/scoutbook\.com\/mobile\/dashboard\/reports\/reportbuilder\.asp/) != null ) {	

		//alert(pageid);
		data=rawDataModifyReportBuilder(data,pageid,thisurl);
	}
	return data;	
}
*/

//new temp
function procRaw_Dashboard_Calendar_Event(data, thisurl, pageid) {

    if (thisurl.match(/scoutbook\.com\/mobile\/dashboard\/calendar\/event\.asp/) != null) {
        //<div class="headerValue">Wed, Jan 17, 2018, 7pm - 9pm</div>	
        dt = data.match(/<div class="headerValue">(Sun|Mon|Tue|Wed|Thu|Fri|Sat), ([^ ]+ \d+, \d\d\d\d)/);
        if (dt != null) {
            stickyDate = 'new Date("' + dt[2] + '")';
        }
    }
    return data;
}
//end new temp

function procRaw_Dashboard_Calendar_Edit_Event(data, thisurl, pageid) {

    if (thisurl.match(/scoutbook\.com\/mobile\/dashboard\/calendar\/editevent\.asp/) != null) {
        //debugger;
        // string matches. Make sure it doesn't have additional parameters - there should be no &

        if (thisurl.indexOf("&") == -1) {

            //temp test
            //<input type="text" name="StartDate" id="startDate" value="1/17/2018 7:00:00 PM" /
            var dt = data.match(/<input type="text" name="StartDate" id="startDate" value="(\d+\/\d+\/\d+)/);
            if (dt != null) {
                var yr = dt[0].match(/\d+\/\d+\/(\d+)/)[1];
                var mon = parseInt(dt[0].match(/(\d+)\/\d+\/\d+/)[1]) - 1;
                var day = dt[0].match(/\d+\/(\d+)\/\d+/)[1];
                stickyDate = 'new Date(' + yr + ',' + mon + ',' + day + ')';
            }

            //end temp test

            waitforShow(); //recur event func

            //data=rawDataAddRepeatEvent(data,pageid);	//try to replace waitforshow

            var nowDate = sbDateFormat(Date.now());
            if (data.match(/"startDate"[ ]+value[^=]*=[^=]*"([^"]+)/) == null) {
                //if nothing found, just return
                return data;
            }

            data = rawDataAddAutoLog(data, pageid, nowDate);

            data = rawDataAddEvMsg(data, pageid, nowDate);

            data = rawDataAddRsvpRpt(data, pageid, nowDate); //new

            data = rawDataAddCopyEvent(data, pageid);




            //$(document).one('pageshow',function() {
            //preCal(pageid);		//add invitees
            //});		

        }
    } else {

        if (thisurl.match(/mobile\/dashboard\/calendar\/editevent\.asp/) != null) {
            //debugger;
            if (thisurl.indexOf("Action=UpdateAttendeeGroupOptions") != -1) {
                //filter out Account Scouts 
                var datasplit = data.split('\n');
                var newdata = '';
                for (var i = 0; i < datasplit.length; i++) {
                    if (datasplit[i].indexOf(">ACCOUNT, ") == -1) {
                        if (datasplit[i].indexOf(">SCOUT, Removed") == -1) {
                            newdata = newdata + datasplit[i] + '\n';
                        }
                    }
                }
                data = newdata;
            }
        }

    }

    return data;
}

function procRaw_Dashboard_Messages_Default(data, thisurl, pageid) {

    if (thisurl.match(/scoutbook.com\/mobile\/dashboard\/messages\/default\.asp/) != null) {

        data = addRawSubunitMsgSel(data, thisurl, pageid);
        data = addRawCustomMailGroup(data, thisurl, pageid);
    }

    if (thisurl.match(/scoutbook.com\/mobile\/dashboard\/messages\/default\.asp\?UnitID/) != null) {


        $(document).one('pageshow', function() {
            presetMsg(pageid);
        });

    } else {
        if (thisurl.match(/Action=SendMessage/) == null) {
            if (evMsgObj.shown == true) {
                clrEvMsgOb();
            }
        }
    }

    return data;
}

function procRaw_Dashboard_Calendar(data, thisurl, pageid) {

    if (thisurl.slice(-1) == "/") {
        if (thisurl.match(/scoutbook.com\/mobile\/dashboard\/calendar\//) != null) {


            //temp test



            if (stickyDate != '') {
                var startfunc = data.indexOf('markedText: true,');
                data = data.slice(0, startfunc) + 'defaultValue: ' + stickyDate + ',\n' + data.slice(startfunc);
            }
            //debugger;

            //end temp test		


            /* SB Push on 10/26/17 incorporated a workaround so this code is no longer needed
			//Firefox bug workaround so calendar events will display
			if(navigator.userAgent.indexOf('Firefox') != -1) {
				var startfunc = data.search(/<[^\/]*\/style[^>]*>/);

				var newdata = data.slice(0,startfunc);	
				newdata += '#Page'+escapeHTML(pageid)+ ' .dw-cal-day   {margin:0; padding:5px; border:0;overflow:visible;}';
				newdata += '#Page'+escapeHTML(pageid)+ ' .dw-i   {margin:0; padding:5px; border:0;overflow:visible;}';
				newdata +=  data.slice(startfunc);				
				data=newdata;	
			}
		    */
            //looking at data... not url here
            if (data.match(/editevent\.asp/) != null) {

                data = addInviteButton(data, pageid);
                data = noteMultEvent(data);

                $(document).one('pageshow', function() {
                    //remove hw-sel class from button to make it visible
                    $('#addInvitees').removeClass('dw-hsel');
                });

            }

        }
    }
    return data;
}

function addOverlay(data, thisurl, pageid) {
    var st = data.indexOf('</div><!-- /content');

    if (st != -1) {
        data = data.slice(0, st) + '<div id="faOverlay"  style="display:none; position:fixed; width:100%; height:100%; top: 0; left:0; right:0; bottom:0; cursor:pointer; background-color: rgba(0,0,0,0.5); z-index: 2;"></div>\n' + data.slice(st);
    } else {
        console.log('no faOverlay ' + thisurl);
    }

    return data;
}

function procRaw_Admin_XXXlog(data, thisurl, pageid) {
    if (thisurl.match(/admin\/(hiking|camping|service)log\.asp/) != null) {
        if (thisurl.match(/UserID=\d+/) == null) {
            data = addRawLogImport(data, thisurl, pageid);
        }
    }
    return data;
}


function procRaw_Dashboard(data, thisurl, pageid) {

    if (thisurl.match(/dashboard\/./) == null) {

        if (MBCRpt == true) {
            data = addRawGeneralDashReport(data, pageid, 'Merit Badge Counselor Report', setMBCReportPageContent());
        } else {
            data = addRawMBC(data, pageid);
            data = addRawBirthday(data, pageid);
        }

        //data=addOverlay(data);

    }
    return data;
}

function procRaw_Admin_Unit(data, thisurl, pageid) {

    if (thisurl.match(/dashboard\/admin\/unit\.asp/) != null) {

        if (data.match(/<title>([^<]+)/) == null) {
            //console.log('No Title, posible user session timeout');
            return data;
        }
        if (data.match(/MB Counselor List/) == null) {
            mbsearch = false;
        } else {
            mbsearch = true;
        }
        if (data.match(/class="councilPatchDIV" title="([^"]+)/) != null) {
            councilTextName = data.match(/class="councilPatchDIV" title="([^"]+)/)[1];
        }

        var txtunit = data.match(/<title>([^<]+)/)[1];

        if (thisurl.match(/UnitID\=(\d+)/) == null) {
            return data;
        }
        var unitID = /UnitID\=(\d+)/.exec(thisurl)[1];

        // add a hidden popup

        //data=addOverlay(data);


        if (swimQE == true) {
            data = addRawSwimQE(data, pageid, unitID, txtunit);

        } else if (healthQE == true) {
            data = addRawHealthQE(data, pageid, unitID, txtunit);
        } else if (schoolQE == true) {
            data = addRawSchoolQE(data, pageid, unitID, txtunit);
        } else if (youthLeaderQE == true) {
            data = addRawYouthLeadershipQE(data, pageid, unitID, txtunit);
            //		} else if (addScWiz==true) {
            //			data = addRawScPage(data,pageid,unitID,txtunit);
        } else if (posPerm == true) {
            data = addRawPosPermPage(data, pageid, unitID, txtunit);
        } else if (oaQE == true) {
            data = addRawOAQE(data, pageid, unitID, txtunit);
        } else if (trainQE == true) {
            data = addRawTrainQE(data, pageid, unitID, txtunit);
        } else if (payRpt == true) {
            data = addRawGeneralReport(data, pageid, unitID, txtunit, 'Payment Balance Report', setPayReportPageContent(unitID, txtunit));
            //		} else if (swimRpt==true) {		
            //			data = addRawGeneralReport(data,pageid,unitID,txtunit,'Swim Report',setSwimReportPageContent(unitID,txtunit));

        } else if (yptRpt == true) {
            data = addRawGeneralReport(data, pageid, unitID, txtunit, 'Youth Protection Training Report', setYPTPageContent(unitID, txtunit));

        } else if (oaRpt == true) {
            data = addRawGeneralReport(data, pageid, unitID, txtunit, 'OA Membership Data Report', setOAReportPageContent(txtunit));
            //		} else if( cstRpt==true) {
            //			data = addRawGeneralReport(data,pageid,unitID,txtunit,'Council Usage Statistics',setCSTPageContent());
        } else {
            $(document).one('pagebeforeshow', function() {
                addQuickEntryMenuItem(unitID, '', '', '#Page' + escapeHTML(escapeHTML(pageid)), txtunit);
            });
        }

        //###  Black Pug Import Menu, show if QE for MBs is shown	and if a leader	and if a valid subscription
        if (data.indexOf(/subscriptions.asp/) == -1) {
            if (unitPosition(unitID) == true) data = addRawBlackPugPopup(data, pageid, unitID);
        }
    }
    return data;
}

function procRaw_Admin_Denpatrol(data, thisurl, pageid) {

    if (thisurl.match(/dashboard\/admin\/denpatrol\.asp/) != null) {

        if (data.slice(0, 6) == 'mobile') {
            return data;
        }
        var unitID = /UnitID\=(\d+)/.exec(thisurl)[1];
        var denID = /DenID\=\d+/.exec(thisurl);
        var patrolID = /PatrolID\=\d+/.exec(thisurl);


        var txtunit = data.match(/"reverse">([^<]+)/)[1];


        if (patrolID != undefined) {
            patrolID = /\d+/.exec(patrolID)[0];
        }
        if (denID != undefined) {
            denID = /\d+/.exec(denID)[0];
        }

        //data=addOverlay(data);


        $(document).one('pagebeforeshow', function() {
            addQuickEntryMenuItem(unitID, denID, patrolID, '#Page' + escapeHTML(escapeHTML(pageid)), txtunit);
        });
    }
    return data;
}

function procRaw_Admin_Paymentslogentry(data, thisurl, pageid) {


    if (thisurl.match(/^https:\/\/(www|qa).scoutbook.com\/mobile\/dashboard\/admin\/paymentslogentry\.asp\?QuickEntry=1/) != null) {
        var unitID = /UnitID\=(\d+)/.exec(thisurl)[1];

        data = addRawPayQE1(data, pageid, unitID);
    } else if (thisurl.match(/^https:\/\/(www|qa).scoutbook.com\/mobile\/dashboard\/admin\/paymentslogentry\.asp/) != null) {
        var unitID = /UnitID\=(\d+)/.exec(thisurl)[1];

        data = addRawPayQE(data, pageid, unitID);
    }

    return data;
}

function procRaw_Admin_Paymentslog(data, thisurl, pageid) {

    if (thisurl.match(/dashboard\/admin\/paymentslog\.asp/) != null) {
        var unitID = /UnitID\=(\d+)/.exec(thisurl)[1];
        if (thisurl.match(/ScoutUserID=\d+/) == null) {
            return data;
        }
        var scoutid = thisurl.match(/ScoutUserID=(\d+)/)[1];
        data = addRawPayLog(data, pageid, unitID, scoutid);
    }

    return data;
}

function procRaw_Admin_Roster(data, thisurl, pageid) {

    if (thisurl.match(/mobile\/dashboard\/admin\/roster\.asp/) != null) {
        var unitID = /UnitID\=(\d+)/.exec(thisurl)[1];
        if (data.match(/mobile_refreshPage/) != null) {
            //alert('no match');
            //ignore if post

        } else {
            data = addRawRegistrationPopup(data, pageid, unitID);
            data = addRawParentPopup(data, pageid, unitID);
            //data=addRawRegistrationScreenButton(data,pageid,unitID);
            data = addRawPositionPermission(data, pageid, unitID);
            data = addSBbugFix(data, pageid, unitID);
        }
    }
    return data;
}


function procRaw_Dashboard_Admin_Advancement_Adventure(data, thisurl, pageid) {

    if (thisurl.match(/dashboard\/admin\/advancement\/adventure\.asp/) != null || thisurl.match(/dashboard\/admin\/advancement\/meritbadge\.asp/) != null || thisurl.match(/dashboard\/admin\/awards\/award\.asp/) != null) {
        //var unitID= /UnitID\=(\d+)/.exec(thisurl)[1]; 

        data = addRawUndo(data, pageid);
    }
    return data;
}

function procRaw_Dashboard_Reports_CouncilUser(data, thisurl, pageid) {

    if (thisurl.match(/dashboard\/reports\/councilusers\.asp/) != null) {
        if (cstRpt == true) {
            data = addRawGenericReport(data, pageid, 'Unit Usage Statistics', setCSTPageContent());
        } else {
            data = addRawCouncilUserStats(data, pageid);
        }
        //data=addOverlay(data);		
    }
    return data;

}

function procRaw_Admin_Advancement_Meritbadgequickentry(data, thisurl, pageid) {

    if (thisurl.match(/dashboard\/admin\/advancement\/meritbadgequickentry\.asp/) != null) {
        var unitID = /UnitID\=(\d+)/.exec(thisurl)[1];
        data = addRawAddMB(data, pageid, unitID);
    }
    return data;
}

function procRaw_Admin_Advancement_Meritbadgequickentry2(data, thisurl, pageid) {

    if (thisurl.match(/dashboard\/admin\/advancement\/meritbadgequickentry2\.asp/) == null) {
        //reset flag if NOT this url
        MBCqeReqFlag = false;
        return data;
        //alert('set false');
    }

    data = addRawAddMB2(data, pageid, thisurl);

    return data;

}
//&DenID=50966&PatrolID=

function procRaw_Dashboard_Admin_Connectionsmanager(data, thisurl, pageid) {
    var unitID = '';
    var denID = '';
    var patrolID = '';
    if (thisurl.match(/dashboard\/admin\/connectionsmanager\.asp/) != null) {
        unitID = /UnitID\=(\d+)/.exec(thisurl)[1];
        if (thisurl.match(/PatrolID=(\d+)/) != null) patrolID = thisurl.match(/PatrolID=(\d+)/)[1];
        if (thisurl.match(/DenID=(\d+)/) != null) denID = thisurl.match(/DenID=(\d+)/)[1];
        data = addRawConMgr(data, pageid, unitID, patrolID, denID);
    }

    return data;
}

/*
adds menu item to QE popup
*/

function addQuickEntryMenuItem(unitID, denID, patrolID, pageid, txtunit) {
    denID = denID || '';
    patrolID = patrolID || '';
    var utype;
    if (patrolID != '' || denID != '') {
        utype = "denpatrol";
    } else {
        utype = "unit";
    }


    if ($('#quickEntryMenu >ul')[0] == null) {
        return;
    }
    var payQE = false;
    if ($('a[href*="paymentslogentry.asp?QuickEntry=1"]', pageid).length == 1) {
        payQE = true;
    }

    // stupid inefficient fix to remove dynamic var var sel = 'payLogEntry' + utype;
    //var payPos = ["Committee Treasurer","Troop Admin","Pack Admin","Crew Admin","Den Admin","Patrol Admin"];
    var adminPos = ["Troop Admin", "Pack Admin", "Crew Admin", "Ship Admin"];
    if (utype == 'denpatrol') {
        if (myPositionIs(payPos, unitID) == true) {
            if (payQE == false) $('#quickEntryMenu >ul').append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-last-child ui-btn-up-d"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#" id="payLogEntrydenpatrol" class="showLoading ui-link-inherit">Enter Payment Log</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
        }
        $('#quickEntryMenu >ul').append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-last-child ui-btn-up-d"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#" id="healthEntrydenpatrol" class="showLoading ui-link-inherit">Enter Health Record Dates</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
        if (myPositionIs(adminPos, unitID) == true) {
            $('#quickEntryMenu >ul').append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-last-child ui-btn-up-d"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#" id="swimmerEntrydenpatrol" class="showLoading ui-link-inherit">Enter Swimmer Classification</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
            $('#quickEntryMenu >ul').append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-last-child ui-btn-up-d"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#" id="schoolEntrydenpatrol" class="showLoading ui-link-inherit">Update School Information</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
        }
        if (unitPosition(unitID) == true) $('#quickEntryMenu >ul').append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-last-child ui-btn-up-d"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#" id="trainingEntrydenpatrol" class="showLoading ui-link-inherit">Enter Scout Training</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');

        if (txtunit.match(/Troop|Team/) != null) {
            $('#quickEntryMenu >ul').append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-last-child ui-btn-up-d"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#" id="oaEntrydenpatrol" class="showLoading ui-link-inherit">Enter OA Member Data</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
        }
    } else {
        if (payQE == false) {
            if (myPositionIs(payPos, unitID) == true) $('#quickEntryMenu >ul').append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-last-child ui-btn-up-d"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#" id="payLogEntryunit" class="showLoading ui-link-inherit">Enter Payment Log</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
        }
        $('#quickEntryMenu >ul').append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-last-child ui-btn-up-d"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#" id="healthEntryunit" class="showLoading ui-link-inherit">Enter Health Record Dates</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');

        if (myPositionIs(adminPos, unitID) == true) {
            $('#quickEntryMenu >ul').append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-last-child ui-btn-up-d"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#" id="swimmerEntryunit" class="showLoading ui-link-inherit">Enter Swimmer Classification</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
            $('#quickEntryMenu >ul').append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-last-child ui-btn-up-d"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#" id="schoolEntryunit" class="showLoading ui-link-inherit">Update School Information</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
        }
        if (unitPosition(unitID) == true) $('#quickEntryMenu >ul').append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-last-child ui-btn-up-d"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#" id="trainingEntryunit" class="showLoading ui-link-inherit">Enter Scout Training</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');

        if (unitPosition(unitID) == true) $('#quickEntryMenu >ul').append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-last-child ui-btn-up-d"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#" id="youthLeaderEntryunit" class="showLoading ui-link-inherit">Enter Scout Leadership</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');


        if (txtunit.match(/Troop|Team/) != null) {
            $('#quickEntryMenu >ul').append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-last-child ui-btn-up-d"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#" id="oaEntryunit" class="showLoading ui-link-inherit">Enter OA Member Data</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');

            $('#reportsMenu >ul').append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-last-child ui-btn-up-d"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#" id="oaReport" class="showLoading ui-link-inherit">Show OA Membership Data</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
            $('#reportsMenu2 >ul').append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-last-child ui-btn-up-d"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#" id="oaReport" class="showLoading ui-link-inherit">Show OA Membership Data</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');

        }
        var adminPos = ["Troop Admin", "Pack Admin", "Crew Admin", "Ship Admin"];
        if (myPositionIs(payPos, unitID) == true || payQE == true) $('#reportsMenu >ul').append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-last-child ui-btn-up-d"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#" id="paylogReport" class="showLoading ui-link-inherit">Show Payment Log Balances</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
        if (myPositionIs(payPos, unitID) == true || payQE == true) $('#reportsMenu2 >ul').append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-last-child ui-btn-up-d"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#" id="paylogReport" class="showLoading ui-link-inherit">Show Payment Log Balances</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');

        //	if(myPositionIs(adminPos,unitID) == true ) $('#reportsMenu >ul').append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-last-child ui-btn-up-d"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#" id="swimReport" class="showLoading ui-link-inherit">Show Swim Report</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');

        $('#reportsMenu >ul').append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-last-child ui-btn-up-d"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#" id="yptReport" class="showLoading ui-link-inherit">Show Adult YPT Status</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
        $('#reportsMenu2 >ul').append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-last-child ui-btn-up-d"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#" id="yptReport" class="showLoading ui-link-inherit">Show Adult YPT Status</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');

    }

    if (myPositions.length > 0) {
        if ($('#enterMeritBadges').length > 0) {
            if (utype == 'denpatrol') {
                //var sel = 'mbAddEntry' + utype;
                $('#quickEntryMenu >ul').append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-last-child ui-btn-up-d"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#" id="mbAddEntrydenpatrol" class="showLoading ui-link-inherit">Start Merit Badges</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
            } else {
                $('#quickEntryMenu >ul').append('<li data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d" class="ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-last-child ui-btn-up-d"><div class="ui-btn-inner ui-li"><div class="ui-btn-text"><a href="#" id="mbAddEntryunit" class="showLoading ui-link-inherit">Start Merit Badges</a></div><span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span></div></li>');
            }

        }
    }


    if (utype == 'unit') {
        // this should only show for admins and treasurers

        $('#payLogEntryunit', pageid).click(function() {
            //hide popup, lock page
            $('#quickEntryMenu', pageid).popup('close');
            $('#faOverlay', pageid).show();
            //document.getElementById("faOverlay").style.display = "block";
            procPayQuickEntryItemNewRos(pageid, unitID, denID, patrolID);

        });

        $('#youthLeaderEntryunit', pageid).click(function() {
            //alert('stub');
            //hide popup, lock page
            $('#quickEntryMenu', pageid).popup('close');
            $('#faOverlay', pageid).show();
            procYouthLeadershipQuickEntryItem(unitID, denID, patrolID, pageid, txtunit);
        });



        $('#trainingEntryunit', pageid).click(function() {
            //alert('stub');
            //hide popup, lock page
            $('#quickEntryMenu', pageid).popup('close');
            $('#faOverlay', pageid).show();
            procTrainingQuickEntryItem(unitID, denID, patrolID, pageid);

        });

        $('#swimmerEntryunit', pageid).click(function() {
            //hide popup, lock page
            $('#quickEntryMenu', pageid).popup('close');
            $('#faOverlay', pageid).show();
            procProfileQuickEntryItem(unitID, denID, patrolID, 'swim', pageid);

        });
        $('#healthEntryunit', pageid).click(function() {
            //hide popup, lock page
            $('#quickEntryMenu', pageid).popup('close');
            $('#faOverlay', pageid).show();
            procProfileQuickEntryItem(unitID, denID, patrolID, 'health', pageid);

        });
        $('#schoolEntryunit', pageid).click(function() {
            //hide popup, lock page
            $('#quickEntryMenu', pageid).popup('close');
            $('#faOverlay', pageid).show();
            procProfileQuickEntryItem(unitID, denID, patrolID, 'school', pageid);

        });
        $('#oaEntryunit', pageid).click(function() {
            //hide popup, lock page
            $('#quickEntryMenu', pageid).popup('close');
            $('#faOverlay', pageid).show();
            procProfileQuickEntryItem(unitID, denID, patrolID, 'oa', pageid);

        });

        $('#oaReport', pageid).click(function() {
            //hide popup, lock page
            $('#reportsMenu2', pageid).popup('close');
            $('#faOverlay', pageid).show();
            procProfileGetEditScouts(unitID, pageid);
        });

        $('#mbAddEntryunit', pageid).click(function() {
            //hide popup, lock page
            $('#quickEntryMenu', pageid).popup('close');
            $('#faOverlay', pageid).show();
            procMbAddQuickEntryItem(unitID, denID, patrolID, txtunit);

        });

        $('#paylogReport', pageid).click(function() {
            //hide popup, lock page
            $('#reportsMenu2', pageid).popup('close');
            $('#faOverlay', pageid).show();
            getPayBalances(pageid, unitID);

        });
        $('#yptReport', pageid).click(function() {
            //hide popup, lock page
            $('#reportsMenu2', pageid).popup('close');
            $('#faOverlay', pageid).show();
            getAdultIDList(unitID, pageid);

        });

        $('#swimReport', pageid).click(function() {
            //hide popup, lock page
            $('#reportsMenu2', pageid).popup('close');
            $('#faOverlay', pageid).show();
            swimFromCSV(pageid, unitID);

        });


    } else {
        $('#payLogEntrydenpatrol', pageid).click(function() {
            //hide popup, lock page
            $('#quickEntryMenu', pageid).popup('close');
            $('#faOverlay', pageid).show();
            procPayQuickEntryItemNewRos(pageid, unitID, denID, patrolID);

        });

        $('#trainingEntrydenpatrol', pageid).click(function() {
            //alert('stub');
            //hide popup, lock page
            $('#quickEntryMenu', pageid).popup('close');
            $('#faOverlay', pageid).show();
            procTrainingQuickEntryItem(unitID, denID, patrolID, pageid);

        });

        $('#swimmerEntrydenpatrol', pageid).click(function() {
            //hide popup, lock page
            $('#quickEntryMenu', pageid).popup('close');
            $('#faOverlay', pageid).show();
            procProfileQuickEntryItem(unitID, denID, patrolID, 'swim', pageid);

        });
        $('#healthEntrydenpatrol', pageid).click(function() {
            //hide popup, lock page
            $('#quickEntryMenu', pageid).popup('close');
            $('#faOverlay', pageid).show();
            procProfileQuickEntryItem(unitID, denID, patrolID, 'health', pageid);

        });
        $('#schoolEntrydenpatrol', pageid).click(function() {
            //hide popup, lock page
            $('#quickEntryMenu', pageid).popup('close');
            $('#faOverlay', pageid).show();
            procProfileQuickEntryItem(unitID, denID, patrolID, 'school', pageid);

        });
        $('#oaEntrydenpatrol', pageid).click(function() {
            //hide popup, lock page
            $('#quickEntryMenu', pageid).popup('close');
            $('#faOverlay', pageid).show();
            procProfileQuickEntryItem(unitID, denID, patrolID, 'oa', pageid);

        });
        $('#mbAddEntrydenpatrol', pageid).click(function() {
            //hide popup, lock page
            $('#quickEntryMenu', pageid).popup('close');
            $('#faOverlay', pageid).show();
            procMbAddQuickEntryItem(unitID, denID, patrolID, txtunit);

        });
    }

}

function unitPosition(unitID) {
    for (var i = 0; i < myPositions.length; i++) {
        if (myPositions[i].unitID == unitID) {
            return true;
        }
    }
    return false;
}

function procProfileQuickEntryItem(unitID, denID, patrolID, qetype, pageid) {
    var utype;
    var patrolScouts = [];
    var DenPatrolName = '';
    if (patrolID != '' || denID != '') {
        utype = "denpatrol";
        DenPatrolName = $('Title').text();

        $('li[data-scoutuserid]').each(function() {
            patrolScouts.push($(this).attr('data-scoutuserid'));
        });

    } else {
        utype = "unit";
    }
    QEPatrol = DenPatrolName.replace(' Patrol', '').replace(' Den', '');
    QEPatrolID = patrolID;
    $.mobile.loading('show', {
        theme: 'a',
        text: 'loading...',
        textonly: false
    });
    var evObj = {
        name: '',
        id: '',
        img: ''
    };


    if ($('base')[0].href.match(/admin\/unit\.asp/) != null) {
        var troop = $('title').text(); //unit page
    } else {
        var troop = $('#goToUnit').text(); //denpatrol page
    }


    // need to get my connections to build scout list of scouts that user has edit profile capability for
    var unitID = $('base')[0].href.match(/\d+/)[0];

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, genError, [pageid, unitID, ''], procProfileQuickEntryItem, [unitID, denID, patrolID, qetype, pageid]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            //console.log(this);	
            scoutPermObjList.length = 0;
            $('div [data-role="content"] >ul >li > div[style*="margin-left"]', this.response).each(function() {
                //console.log('x');
                //console.log($('a',this)[0].textContent + ' ' + $('a',this).attr('href') + ' ' + $('.permission',this)[0].textContent + ' ' + $('.orangeSmall',this)[0].textContent);
                var txtUnit = localDataFilter($('.orangeSmall', this)[0].textContent, '', 'local');
                if (txtUnit.indexOf(troop) != -1) {

                    //this scout is in the unit of interest

                    //now can we determine if scout is in patrol of interest
                    var okToUse = false;
                    if (patrolScouts.length != 0) {
                        for (var i = 0; i < patrolScouts.length; i++) {
                            if (patrolScouts[i] == $('a', this).attr('href').match(/\d+/)[0]) {
                                okToUse = true;
                                break;
                            }
                        }

                    } else {
                        okToUse = true;
                    }


                    if (okToUse == true) {

                        if ($('.permission', this)[0].textContent.indexOf('Full') != -1 || $('.permission', this)[0].textContent.indexOf('Edit Profile') != -1) {
                            // The User has permission to edit this Scout's profile
                            var p = $(this).parent();
                            evObj.img = $('img', p).attr('src');
                            evObj.id = $('a', this).attr('href').match(/\d+/)[0];
                            evObj.name = localDataFilter($('a', this)[0].textContent.trim(), '', 'local');
                            //console.log(evObj.name,evObj.id);
                            scoutPermObjList.push(JSON.parse(JSON.stringify(evObj)));
                            //	console.log(scoutid + ' ' + scoutname);	
                            //set flags for change page
                            if (qetype == "swim") {
                                swimQE = true;
                            }
                            if (qetype == "health") {
                                // Get profile records
                                healthQE = true;

                            }
                            if (qetype == "oa") {
                                // Get profile records
                                oaQE = true;

                            }
                            if (qetype == "school") {
                                // Get profile records
                                schoolQE = true;

                            }
                        }
                    }
                }
            });
            if (oaQE == true) {
                //we have scouts, ok to continue
                scoutProfileObjList = [];
                getAccount2(unitID, pageid, troop, "qe", oaCB, unitID); // end that event string with the changepage
                return;
            }
            if (healthQE == true) {
                //we have scouts, ok to continue
                scoutProfileObjList = [];
                scoutHealthObjList = [];
                if (utype == "unit") {
                    checkAdultAdmin(pageid, unitID, troop); //on the unit page, check if the user is an admin
                } else {
                    reportBuilderHealth(pageid, unitID, false, []);
                }

                return;
            }

            if (swimQE == true) {
                //we have scouts, ok to continue
                //scoutProfileObjList=[];
                //scoutHealthObjList=[];
                if (utype == "unit") {
                    checkAdultAdminSwim(pageid, unitID, troop); //on the unit page, check if the user is an admin
                    return;
                } //else on a unit page, work as it did before
            }

            if (schoolQE == true) {
                //we have scouts, ok to continue
                scoutProfileObjList = [];
                scoutSchoolObjList = [];
                getDOBs(pageid, unitID);
                //schoolFromCSV(unitID);
                return;
            }

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

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/adultconnections.asp';


    xhttp.open("GET", url, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, genError, [pageid, unitID, ''], procProfileQuickEntryItem, [unitID, denID, patrolID, qetype, pageid]);
    };
}


function procTrainingQuickEntryItem(unitID, denID, patrolID, pageid) {
    var utype;
    var patrolScouts = [];
    var DenPatrolName = '';
    if (patrolID != '' || denID != '') {
        utype = "denpatrol";
        DenPatrolName = $('Title').text();

        $('li[data-scoutuserid]').each(function() {
            patrolScouts.push($(this).attr('data-scoutuserid'));
        });

    } else {
        utype = "unit";
    }
    QEPatrol = DenPatrolName.replace(' Patrol', '').replace(' Den', '');
    QEPatrolID = patrolID;
    $.mobile.loading('show', {
        theme: 'a',
        text: 'loading...',
        textonly: false
    });
    var evObj = {
        name: '',
        id: '',
        img: ''
    };


    if ($('base')[0].href.match(/admin\/unit\.asp/) != null) {
        var troop = $('title').text(); //unit page
    } else {
        var troop = $('#goToUnit').text(); //denpatrol page
    }


    // need to get my connections to build scout list of scouts that user has view profile capability for
    var unitID = $('base')[0].href.match(/\d+/)[0];

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, genError, [pageid, unitID, ''], procTrainingQuickEntryItem, [unitID, denID, patrolID, pageid]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            scoutPermObjList.length = 0;
            $('div [data-role="content"] >ul >li > div[style*="margin-left"]', this.response).each(function() {

                var txtUnit = localDataFilter($('.orangeSmall', this)[0].textContent, '', 'local');
                if (txtUnit.indexOf(troop) != -1) {

                    //this scout is in the unit of interest

                    //now can we determine if scout is in patrol of interest
                    var okToUse = false;
                    if (patrolScouts.length != 0) {
                        for (var i = 0; i < patrolScouts.length; i++) {
                            if (patrolScouts[i] == $('a', this).attr('href').match(/\d+/)[0]) {
                                okToUse = true;
                                break;
                            }
                        }

                    } else {
                        okToUse = true;
                    }

                    if (okToUse == true) {

                        if ($('.permission', this)[0].textContent.indexOf('Full') != -1 || $('.permission', this)[0].textContent.indexOf('Edit Profile') != -1 || $('.permission', this)[0].textContent.indexOf('View Profile') != -1) {
                            // The User has permission to view this Scout's profile
                            var p = $(this).parent();
                            evObj.img = $('img', p).attr('src');
                            evObj.id = $('a', this).attr('href').match(/\d+/)[0];
                            evObj.name = localDataFilter($('a', this)[0].textContent.trim(), '', 'local');

                            scoutPermObjList.push(JSON.parse(JSON.stringify(evObj)));

                            //set flags for change page
                            trainQE = true;
                        }
                    }
                }
            });

            scoutProfileObjList = [];

            getTrainingLists(unitID, pageid);
            return;

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

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/adultconnections.asp';


    xhttp.open("GET", url, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, genError, [pageid, unitID, ''], procTrainingQuickEntryItem, [unitID, denID, patrolID, pageid]);

    };
}

function procYouthLeadershipQuickEntryItem(unitID, denID, patrolID, pageid, txtunit) {
    var utype;
    var patrolScouts = [];
    var DenPatrolName = '';
    if (patrolID != '' || denID != '') {
        utype = "denpatrol";
        DenPatrolName = $('Title').text();

        $('li[data-scoutuserid]').each(function() {
            patrolScouts.push($(this).attr('data-scoutuserid'));
        });

    } else {
        utype = "unit";
    }
    QEPatrol = DenPatrolName.replace(' Patrol', '').replace(' Den', '');
    QEPatrolID = patrolID;
    $.mobile.loading('show', {
        theme: 'a',
        text: 'loading...',
        textonly: false
    });
    var evObj = {
        name: '',
        id: '',
        img: ''
    };


    if ($('base')[0].href.match(/admin\/unit\.asp/) != null) {
        var troop = $('title').text(); //unit page
    } else {
        var troop = $('#goToUnit').text(); //denpatrol page
    }


    // need to get my connections to build scout list of scouts that user has view profile capability for
    var unitID = $('base')[0].href.match(/\d+/)[0];

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, genError, [pageid, unitID, ''], procYouthLeadershipQuickEntryItem, [unitID, denID, patrolID, pageid, txtunit]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            scoutPermObjList.length = 0;
            $('div [data-role="content"] >ul >li > div[style*="margin-left"]', this.response).each(function() {

                var txtUnit = localDataFilter($('.orangeSmall', this)[0].textContent, '', 'local');
                if (txtUnit.indexOf(troop) != -1) {

                    //this scout is in the unit of interest

                    //now can we determine if scout is in patrol of interest
                    var okToUse = false;
                    if (patrolScouts.length != 0) {
                        for (var i = 0; i < patrolScouts.length; i++) {
                            if (patrolScouts[i] == $('a', this).attr('href').match(/\d+/)[0]) {
                                okToUse = true;
                                break;
                            }
                        }

                    } else {
                        okToUse = true;
                    }

                    if (okToUse == true) {

                        if ($('.permission', this)[0].textContent.indexOf('Full') != -1 || $('.permission', this)[0].textContent.indexOf('Edit Profile') != -1 || $('.permission', this)[0].textContent.indexOf('View Profile') != -1) {
                            // The User has permission to view this Scout's profile
                            var p = $(this).parent();
                            evObj.img = $('img', p).attr('src');
                            evObj.id = $('a', this).attr('href').match(/\d+/)[0];
                            evObj.name = localDataFilter($('a', this)[0].textContent.trim(), '', 'local');

                            scoutPermObjList.push(JSON.parse(JSON.stringify(evObj)));

                            //set flags for change page

                        }
                    }
                }
            });

            scoutProfileObjList = [];

            getLeadershipLIs(pageid, unitID, txtunit);
            return;

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

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/adultconnections.asp';


    xhttp.open("GET", url, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, genError, [pageid, unitID, ''], procYouthLeadershipQuickEntryItem, [unitID, denID, patrolID, pageid, txtunit]);
    };
}

function genError(pageid, unitid, typemsg) {
    $.mobile.loading('hide');
    healthQE = false;
    swimQE = false;
    schoolQE = false;

    $('#faOverlay', pageid).hide();

    if (unitid == '') {
        if (/UnitID\=\d+/.exec($('base')[0].href) != null) {
            unitid = /UnitID\=\d+/.exec($('base')[0].href)
        }
    }
    if (typemsg == '') {
        alert('Error , halted');
    } else {
        alert('Error posting ' + typemsg + ' data, discontinuing updates.  Not all Scouts Selected are updated');
    }
    try {
        $('#buttonCancel, #buttonSubmit').button('enable');
    } catch {}
    //		$(':input', sPage +' #swimmingForm').attr('disabled', false);
    $.mobile.changePage(
        '/mobile/dashboard/admin/unit.asp?UnitID=' + unitid, {
            allowSamePageTransition: true,
            transition: 'none',
            showLoadMsg: true,
            reloadPage: true
        }
    );
}





function procProfileGetEditScouts(unitID, pageid) {
    var utype;

    utype = "unit";


    $.mobile.loading('show', {
        theme: 'a',
        text: 'loading...',
        textonly: false
    });
    var evObj = {
        name: '',
        id: '',
        img: ''
    };


    if ($('base')[0].href.match(/admin\/unit\.asp/) != null) {
        var troop = $('title').text(); //unit page
    }


    // need to get my connections to build scout list of scouts that user has edit profile capability for
    var unitID = $('base')[0].href.match(/\d+/)[0];

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, genError, [pageid, unitID, ''], procProfileGetEditScouts, [unitID, pageid]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            //console.log(this);	
            scoutPermObjList.length = 0;
            $('div [data-role="content"] >ul >li > div[style*="margin-left"]', this.response).each(function() {
                //console.log('x');
                //console.log($('a',this)[0].textContent + ' ' + $('a',this).attr('href') + ' ' + $('.permission',this)[0].textContent + ' ' + $('.orangeSmall',this)[0].textContent);
                var txtUnit = $('.orangeSmall', this)[0].textContent;
                if (txtUnit.indexOf(troop) != -1) {

                    //this scout is in the unit of interest


                    okToUse = true;


                    if (okToUse == true) {

                        if ($('.permission', this)[0].textContent.indexOf('Full') != -1 || $('.permission', this)[0].textContent.indexOf('Edit Profile') != -1) {
                            // The User has permission to edit this Scout's profile
                            var p = $(this).parent();
                            evObj.img = $('img', p).attr('src');
                            evObj.id = $('a', this).attr('href').match(/\d+/)[0];
                            evObj.name = $('a', this)[0].textContent.trim();
                            //console.log(evObj.name,evObj.id);
                            scoutPermObjList.push(JSON.parse(JSON.stringify(evObj)));
                        }
                    }
                }
            });

            //we have scouts, ok to continue
            scoutProfileObjList = [];
            getAccount2(unitID, pageid, troop, 'report', oaCB, unitID); // end that event string with the changepage
            return;


        }
    };

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/adultconnections.asp';


    xhttp.open("GET", url, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, genError, [pageid, unitID, ''], procProfileGetEditScouts, [unitID, pageid]);
    };
}


//export {procRaw_Dashboard_Admin_Advancement_Adventure, myPositions};