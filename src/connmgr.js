// Copyright © 10/19/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.


//  BAD.  In conn mgr, setting permissions to none for all scouts removes the parent connection
//  To AVOID this issue, need to see if any scouts in the row are CHILDREN
//	IF any are children, iterate through columns to set individually and AVOID the children


var parentList = [];
var parentlistset = false;
//function modifies the connectionmanager.asp page
function addRawConMgr(data, pageid, unitID, patrolID, denID) {

    //return data;
    // Do not process if this is a script response
    if (data.indexOf("$('div[data-userid") != -1) {
        //console.log(data);
        return data;
    }



    //insert a line to process the page function outside the page
    var startfunc;
    var ftxt = "$('#buttonSetPermission', '#Page" + pageid + "').click(function () {";
    startfunc = data.indexOf(ftxt);
    data = data.slice(0, startfunc + ftxt.length) + '\n if (offPage(' + unitID + ',"' + patrolID + '","' + denID + '",' + pageid + ',this) != "cont") return;\n' + data.slice(startfunc + ftxt.length);

    //change popup text
    data = data.replace('permissions to ALL Scouts on this page!', 'permissions to ALL Non-Family Scouts on this page!');



    // replace script.  Starsts after <script tag
    var startfunc = data.indexOf("$('#topRow td'");

    var endfunct = data.indexOf('});', startfunc) + 3;
    var myfunc = '' + cmscript;
    myfunc = myfunc.slice(22).slice(0, -1).replace(/\#PageX/g, '#Page' + escapeHTML(pageid)).replace(/UnitID=X/g, 'UnitID=' + escapeHTML(unitID));
    var newdata = data.slice(0, startfunc) + myfunc + '\n' + data.slice(endfunct);

    data = newdata;


    var startfunc = data.indexOf("$('div[data-connectionid]'");
    startfunc = data.indexOf("$('#connectionID'", startfunc);
    data = data.slice(0, startfunc) + 'if(bugcheck(userID) ==true) {\nreturn false\n}\n' + data.slice(startfunc);


    return data;

}


function bugcheck(userID) {

    if (meID.lastname != '') {

        var myname = meID.firstname + ' ' + meID.lastname;
        if (meID.nickname != '') {
            myname = meID.nickname + ' ' + meID.lastname;
        }
        var myid = $('div[data-name="' + myname + '"]').attr('data-connecteduserid');

        var myperm = $('div[data-connecteduserid="' + myid + '"][data-userid="' + userID + '"]').find('img').attr('class');
        if (myperm == undefined || myperm.indexOf('perm3') == -1) {
            alert("You do not have permissions to change this scout's permissions!");
            return true;
        }
    }
    return false;
}

function addSBbugFix(data, pageid, unitID) {

    // workaround for SB bug with a scout the user has no control over resulting in Whoops
    data = data.replace('<a href="/mobile/dashboard/admin/connectionsmanager.asp?UnitID=' + unitID + '" class="showLoading">', '<a href="#" class="showLoading" id="connectionsManager">');

    var buttonFunc = "	$('#connectionsManager','" + '#Page' + pageid + "').click(function() { \n";
    buttonFunc += '		connMgrWhoami("' + unitID + '");\n';
    buttonFunc += '	});\n';

    var startfunc = data.indexOf("$('#buttonRemoveScout',");
    data = data.slice(0, startfunc) + buttonFunc + data.slice(startfunc);

    return data;

}
var toprow = false;
var meID = {
    firstname: '',
    lastname: '',
    nickname: '',
    id: ''
};
//get account, then profile, then change page to connectionmagager
function connMgrWhoami(unitid) {
    //need to get profile


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(connMgrWhoami, unitid, '', '', '', '', '', ''); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            //now get profile
            getMyProfile(unitid);
        }
    }

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/account.asp?';
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();
    xhttp.onerror = function() {
        errHandle(connMgrWhoami, unitid, '', '', '', '', '', '');
        if (servErrCnt > maxErr) {
            closeConMgr(unitID, '', '');
        }
    };
}




function getMyProfile(unitid) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(getMyProfile, unitid, '', '', '', '', '', ''); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            //save my name
            meID.firstname = $('#firstName', this.response).val();
            meID.lastname = $('#lastName', this.response).val();
            meID.nickname = $('#nickName', this.response).val();
            //change page to connectionmanager

            $.mobile.loading('hide');
            $.mobile.changePage(
                '/mobile/dashboard/admin/connectionsmanager.asp?UnitID=' + unitid + '&DenID=&PatrolID=', {
                    allowSamePageTransition: true,
                    transition: 'none',
                    showLoadMsg: true,
                    reloadPage: true
                }
            );



        }
    }

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/editprofile.asp?ScoutUserID=&UnitID=&DenID=&PatrolID=';
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();
    xhttp.onerror = function() {
        errHandle(getMyProfile, unitid, '', '', '', '', '', '');
        if (servErrCnt > maxErr) {
            closeConMgr(unitID, '', '');
        }
    };
}





function cmscript() {
    $('#topRow td').on('click', function() {

        // highlight column
        toprow = true;
        var index = $(this).index() + 1; // this is the column number.
        var cindex = index - 1;

        $('#center td').css('background-color', '#FFFFFF'); // selects all center td's and makes 'em white
        $('#center tr td:nth-child(' + index + ')').css('background-color', '#F5F5F5');

        //------new	
        // popup scout permissions 
        var userID = $('#center tr td:eq(' + cindex + ') div').attr('data-userid')
        var name = $('div', this).html().replace(/<br>/, ' ');

        //check permissions - need full to allow an editprofile
        //to do, need to find my id.   
        if (meID.lastname != '') {
            var myname = meID.firstname + ' ' + meID.lastname;
            if (meID.nickname != '') {
                myname = meID.nickname + ' ' + meID.lastname;
            }
            var myid = $('div[data-name="' + myname + '"]').attr('data-connecteduserid');

            var myperm = $('div[data-connecteduserid="' + myid + '"][data-userid="' + userID + '"]').find('img').attr('class');
            if (myperm == undefined || myperm.indexOf('perm3') == -1) {
                alert('You do not have permissions to change ' + name + "'s permissions!");
                return false;
            }
        }

        //$('#connectionID, #userID', '#PageX').val('');  //clears the input popup box?
        $('#connectedUserID', '#PageX').val(''); //clears the input popup box?
        $('#userID', '#PageX').val(''); //clears the input popup box?
        $('#connectionID', '#PageX').val(''); //clears the input popup box?				


        $('#userID', '#PageX').val(userID); //sets the scout id in the popup box
        $('#buttonSetPermission', '#PageX').button({
            theme: 'g'
        });
        $('#setPermissionPopup #warning', '#PageX').html('NOTE: This will reset permissions from ALL adults except parents and Admins to ' + name + '!');
        // set popup state
        $('#setPermissionPopup input:checkbox', '#PageX').prop('checked', false).checkboxradio('enable').checkboxradio('refresh');

        if ($(this, '#PageX').has('img.perm3').length > 0) {
            $('#permissionID3', '#PageX').prop('checked', true).checkboxradio('refresh');
        } else {
            if ($(this, '#PageX').has('img.perm7').length > 0) {
                $('#permissionID7, #permissionID6', '#PageX').prop('checked', true).checkboxradio('refresh');
            } else if ($(this, '#PageX').has('img.perm6').length > 0) {
                $('#permissionID6', '#PageX').prop('checked', true).checkboxradio('refresh');
            }
            if ($(this, '#PageX').has('img.perm5').length > 0) {
                $('#permissionID5, #permissionID4', '#PageX').prop('checked', true).checkboxradio('refresh');
            } else if ($(this, '#PageX').has('img.perm4').length > 0) {
                $('#permissionID4', '#PageX').prop('checked', true).checkboxradio('refresh');
            }
        }

        $('#permissionID3', '#PageX').trigger('change');

        //if(isUnitAdmin == 1) {
        //	$('#permissionID3, #permissionID4, #permissionID5, #permissionID6, #permissionID7', '#PageX').checkboxradio('disable').prop('checked', true).checkboxradio('refresh');				
        //} 

        $('#setPermissionPopup', '#PageX').popup({
            tolerance: '10,40',
            transition: 'pop',
            history: false,
            positionTo: 'origin'
        }).popup('open');

        return false;
    });




}


//if its an intersection, return and allow on page processing
function offPage(unitID, patrolID, denID, pageid, thisob) {

    if (toprow == true) {
        $.mobile.loading('show', {
            theme: 'a',
            text: 'saving...',
            textonly: false
        });
        $('#setPermissionPopup').popup('close');
        thisScoutParentConns(unitID, patrolID, denID, pageid, thisob);
        toprow = false;
        return;
    }


    var evObj = {
        scoutID: '',
        parentID: '',
        connid: ''
    };
    var atype = $('#setPermissionPopup input', '#Page' + pageid).serializeArray();
    for (var i = 0; i < atype.length; i++) {
        if (atype[i].name == 'UserID') {
            if (atype[i].value != '') {
                return 'cont';
            }
        }
    }

    $.mobile.loading('show', {
        theme: 'a',
        text: 'saving...',
        textonly: false
    });
    var thisRowuser = $('#connectedUserID', '#Page' + pageid).val();
    //document.querySelectorAll("[data-foo='1']")
    //var thisuserconnections=$('div').find("[data-connecteduserid='" + thisRowuser + "'][data-connectionid]");
    var conlist = [];
    $('div').find("[data-connecteduserid='" + thisRowuser + "'][data-connectionid]").each(
        function() {
            //console.log($(this).attr('data-connectionid'));
            if ($(this).attr('data-connectionid') != '') {
                evObj.connid = $(this).attr('data-connectionid');
                evObj.scoutID = $(this).attr('data-userid');
                evObj.parentID = thisRowuser;
                conlist.push(JSON.parse(JSON.stringify(evObj)));
            }
        }
    );
    /*
	//find the "ConnectedUserID" as shown in the popup so we can find out which row it is in
    var thisRowuser=$('#connectedUserID', '#Page32683').val();
	for(var i=0;i<atype.length;i++) {
	  if(atype[i].name=="ConnectedUserID") {
		 if(atype[i].value!='') {
			 thisRowuser= atype[i].value;
			 break;
		 }
	  }
	}	
	*/
    parentList = [];
    parentlistset = false;
    var atype = $('#setPermissionPopup input', '#Page' + pageid).serialize();

    if (atype.indexOf('PermissionID') == -1) {
        //This is an attempt to clear ALL connections
        // get any parent connections
        getParentListConFromRoster(unitID, patrolID, denID, 'no', conlist); //calls determineContinue when done

    } else {
        //safe

        postRowPosition(unitID, patrolID, denID, atype, pageid);

    }
    // don't process the remainder of the in page function
    return 'stop';
}

function thisScoutParentConns(unitID, patrolID, denID, pageid, thisob) {
    var parentcon = [];
    var nolst = [];
    var denid = '';
    var patrolid = '';
    var scoutid = $('#userID', '#Page' + pageid).val();
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(thisScoutParentConns, unitID, patrolID, denID, pageid, thisob, '', ''); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            //get parent conn ids 

            $('a[href*="ScoutUserID=' + scoutid + '&ConnectionID="]', this.response).each(function() {
                if ($(this).attr('href').match(/ConnectionID=(\d+)/) != null) {
                    pushUnique(parentcon, $(this).attr('href').match(/ConnectionID=(\d+)/)[1]);
                }
            });


            if ($('a[id="goToDenPatrol"]', this.response).attr('href') != undefined) {
                if ($('#goToDenPatrol', this.response).attr('href').match(/PatrolID=\d/) != null) {
                    patrolid = $('#goToDenPatrol', this.response).attr('href').match(/PatrolID=(\d+)/)[1];
                }
                if ($('#goToDenPatrol', this.response).attr('href').match(/DenID=\d/) != null) {
                    denid = $('#goToDenPatrol', this.response).attr('href').match(/DenID=(\d+)/)[1];
                }
            }


            if (denid != '' || patrolid != '') {
                thisScoutDenPatrolAdmins(unitID, patrolID, denID, pageid, thisob, parentcon, patrolid, denid);
            } else {
                identifyMBCs(unitID, patrolID, denID, pageid, thisob, parentcon, nolst);
                //handleTopRow(unitID,patrolID,denID,pageid,thisob,parentcon,nolst);
            }
        }
    }


    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/account.asp?ScoutUserID=' + scoutid;
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();
    xhttp.onerror = function() {
        errHandle(thisScoutParentConns, unitID, patrolID, denID, pageid, thisob, '', '');
        if (servErrCnt > maxErr) {
            closeConMgr(unitID, patrolID, denID);
        }
    };
}


function thisScoutDenPatrolAdmins(unitID, patrolID, denID, pageid, thisob, parentcon, patrolid, denid) {
    var xhttp = new XMLHttpRequest();
    var dpids = [];
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(thisScoutDenPatrolAdmins, unitID, patrolID, denID, pageid, thisob, parentcon, patrolid, denid); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            $('a[href*="AdultUserID"]', this.response).each(function() {
                if ($(this).parent().find('img[src*="key50.png"]').length == 1) {
                    if ($(this).attr('href').match(/AdultUserID=(\d+)/) != null) {
                        pushUnique(dpids, $(this).attr('href').match(/AdultUserID=(\d+)/)[1]);
                    }
                }
            });
            identifyMBCs(unitID, patrolID, denID, pageid, thisob, parentcon, dpids);
            //handleTopRow(unitID,patrolID,denID,pageid,thisob,parentcon,dpids);
        }
    }


    var dp;
    if (denid != '') {
        dp = 'DenID=' + denid;
    }
    if (patrolid != '') {
        dp = 'PatrolID=' + patrolid;
    }
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/denpatrol.asp?UnitID=' + unitID + '&' + dp;
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();
    xhttp.onerror = function() {
        errHandle(thisScoutDenPatrolAdmins, unitID, patrolID, denID, pageid, thisob, parentcon, patrolid, denid); //server side error - maybe next try will work
        if (servErrCnt > maxErr) {
            closeConMgr(unitID, patrolID, denID);
        }
    };
}

function identifyMBCs(unitID, patrolID, denID, pageid, thisob, parentcon, dpids) {
    var mbccon = [];
    var mbcconOlist = [];
    var thisColuser = $('#userID', '#Page' + pageid).val(); // this is the scout id

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(identifyMBCs, unitID, patrolID, denID, pageid, thisob, parentcon, dpids); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            var connectionid = '';
            var brk = false;
            $('li  a[href*="connection.asp"]', this.response).each(function() {
                var leader = false;
                if ($(this).text().match(/Adult Leader/) != null) {
                    leader = true;
                }
                connectionid = $(this).attr('href').match(/ConnectionID=(\d+)/)[1];
                brk = false;
                $('.mb.permission', this).each(function() {
                    if (brk == false) {
                        mbcconOlist.push({
                            connectionid: connectionid,
                            leader: leader
                        });
                        brk = true;
                    }
                });
            });



            if (mbcconOlist.length != 0) {
                var keep = '';
                var tres = true;
                var permission = '';
                var atype = $('#setPermissionPopup input', '#Page' + pageid).serializeArray();
                for (var i = 0; i < atype.length; i++) {
                    if (atype[i].name == 'PermissionID') {
                        permission = atype[i].value;
                    }
                }
                /*
                cases
                	mbc is leader
                		changing permission to nothing
                			-warn that mbc conn may be lost
                		changing permission to more than view
                			-no issue
                	mbc is not leader
                		changing permission to nothing
                			-warn that mbc conn may be lost
                		changing permission to more than view
                			-warn that permissions are too permissive
                
                */
                if (permission == '') {
                    tres = confirm('This Scout has connected Merit Badge Counselors: Do you want to apply these changes to those connections? If you clear the permissions, the MBC will need to be re-invited. Press OK to change anyway, or Cancel to prevent making changes to MBC connections');
                    if (tres == false) {
                        mbccon = [];
                    } else {
                        keep = 'keep';
                        //keep list as is
                    }
                } else if (permission != 4) {
                    //attempting to set mbc permissions higher than needed
                    for (var i = 0; i < mbcconOlist.length; i++) {
                        if (mbcconOlist[i].leader == false) {
                            tres = confirm('This Scout has connected Merit Badge Counselors outside your unit and you are attempting to apply more permissions than they need: Do you want to apply these changes to those connections?  Press OK to change anyway, or Cancel to prevent making changes to MBC connections outside your unit');
                            if (tres == true) {
                                // leave as is
                                keep = 'keep';
                            } else {
                                // remove non leader - only keep leaders
                                keep = 'modify';
                            }
                            break;
                        }
                    }
                }

                for (var i = 0; i < mbcconOlist.length; i++) {
                    if (keep == 'keep') {
                        mbccon.push(mbcconOlist[i].connectionid);
                    } else if (keep == 'modify') {
                        if (mbcconOlist[i].leader == true) {
                            mbccon.push(mbcconOlist[i].connectionid);
                        }
                    }
                }

            }
            //debugger;
            handleTopRow(unitID, patrolID, denID, pageid, thisob, parentcon, dpids, mbccon);



        }
    };
    //console.log('getting connections for scout '+ scoutUserIDMBmbc[sUIindex] + ' sUIindex=' +sUIindex);
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connections.asp?ScoutUserID=' + thisColuser + '&UnitID=' + unitID + '&DenID=' + denID + '&PatrolID=' + patrolID;
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();

    xhttp.onerror = function() {
        errHandle(identifyMBCs, unitID, patrolID, denID, pageid, thisob, parentcon, dpids); //server side error - maybe next try will work
        if (servErrCnt > maxErr) {
            closeConMgr(unitID, patrolID, denID);
        }
    };


}

function handleTopRow(unitID, patrolID, denID, pageid, thisob, parentcon, dpids, mbccon) {

    var evObj = {
        scoutID: '',
        parentID: '',
        connid: ''
    };
    var atype = $('#setPermissionPopup input', '#Page' + pageid).serializeArray();
    for (var i = 0; i < atype.length; i++) {
        if (atype[i].name == 'ConnectedUserID') {
            if (atype[i].value != '') {
                // there is no adult connected here, 

                return 'cont';
            }
        }
    }


    $.mobile.loading('show', {
        theme: 'a',
        text: 'saving...',
        textonly: false
    });
    //var thisRowuser=$('#connectedUserID', '#Page'+pageid).val();
    var thisColuser = $('#userID', '#Page' + pageid).val();
    //document.querySelectorAll("[data-foo='1']")
    //var thisuserconnections=$('div').find("[data-connecteduserid='" + thisRowuser + "'][data-connectionid]");

    //get the admins
    var adminlist = [];
    $('div').find("[data-isunitadmin='1']").each(
        function() {
            adminlist.push($(this).attr('data-connecteduserid'));
        }
    );


    // get all intersections for this user, except admins and parents
    var found = false;

    var unconlist = [];
    $('div').find("[data-userid='" + thisColuser + "'][data-connectionid]").each(
        function() {

            found = false;
            for (var i = 0; i < adminlist.length; i++) {
                if (adminlist[i] == $(this).attr('data-connecteduserid')) {
                    found = true; //omit the admin from the list
                    break;
                }
            }
            for (var i = 0; i < dpids.length; i++) {
                if (dpids[i] == $(this).attr('data-connecteduserid')) {
                    found = true; //omit the admin from the list
                    break;
                }
            }

            for (var i = 0; i < parentcon.length; i++) {
                if (parentcon[i] == $(this).attr('data-connectionid')) {
                    found = true; //omit the parent from the list
                    break;
                }
            }

            for (var i = 0; i < mbccon.length; i++) {
                if (mbccon[i] == $(this).attr('data-connectionid')) {
                    found = true; //omit the merit badge counselor from the list
                    break;
                }
            }

            if (found == false) {
                evObj.connid = $(this).attr('data-connectionid');
                evObj.parentID = $(this).attr('data-connecteduserid');
                evObj.scoutID = thisColuser;
                unconlist.push(JSON.parse(JSON.stringify(evObj)));
            }

        }
    );


    iteratePostIntersectScout(unitID, patrolID, denID, unconlist)
    // don't process the remainder of the in page function
    return 'stop';
}

function iteratePostIntersectScout(unitID, patrolID, denID, mlist) {

    if (mlist.length == 0) {
        closeConMgr(unitID, patrolID, denID);
        return;
    }

    var formPost = $('#setPermissionPopup input').serialize();
    var evObj = mlist.shift();

    //change the connid and connected user id
    formPost = formPost.replace(/ConnectionID=[^&]*/, 'ConnectionID=' + escapeHTML(evObj.connid));
    formPost = formPost.replace(/ConnectedUserID=[^&]*/, 'ConnectedUserID=' + escapeHTML(evObj.parentID));

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(iteratePostIntersectScout, unitID, patrolID, denID, mlist, '', '', '', ''); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            serveErrCnt = 0;
            setTimeout(function() {
                iteratePostIntersectScout(unitID, patrolID, denID, mlist);
            }, 100);
        }
    };

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connectionsmanager.asp?Action=UpdateConnection&UnitID=' + unitID + '&DenID=' + denID + '&PatrolID=' + patrolID;
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(formPost);

    xhttp.onerror = function() {
        errHandle(iteratePostIntersectScout, unitID, patrolID, denID, mlist, '', '', '', '');
        if (servErrCnt > maxErr) {
            closeConMgr(unitID, patrolID, denID);
        }
    };
}




// post the changes to all scouts.  Capture the current display state so child scout permisions can be restored. 
function postRowPosition(unitID, patrolID, denID, atype, pageid) {
    var priorConns = [];
    var evObj = {
        class: [],
        connid: '',
        parentID: ''
    };
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(postRowPosition, unitID, patrolID, denID, atype, pageid, '', '', ''); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            serveErrCnt = 0;

            // the response contains scriptlets we can use to capture all of the impacted table ids
            // We will use those to get information off the currently displayed page
            var dres = this.response.match(/div\[data-userid=\d+\]\[data-connecteduserid=\d+\]/g);

            if (dres == null) {
                //Scoutbook error.
                alert('Scoutbook Connection Manager Whoops error, cannot continue');
                closeConMgr(unitID, patrolID, denID);
                return;
            }
            for (var i = 0; i < dres.length; i++) {
                // there may be multiple permissions assigned 
                evObj.class = [];
                $(dres[i] + ' img').each(function() {
                    evObj.class.push($(this).attr('class'));
                });

                evObj.connid = $(dres[i]).attr('data-connectionid');
                evObj.parentID = $(dres[i]).attr('data-connecteduserid');
                priorConns.push(JSON.parse(JSON.stringify(evObj)));
            }

            getParentListFromRoster(unitID, patrolID, denID, 'no', priorConns);
        }
    };

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connectionsmanager.asp?Action=UpdateConnection&UnitID=' + unitID + '&DenID=' + denID + '&PatrolID=' + patrolID;
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(atype);

    xhttp.onerror = function() {
        errHandle(postRowPosition, unitID, patrolID, denID, atype, pageid, '', '', '');
        if (servErrCnt > maxErr) {
            closeConMgr(unitID, patrolID, denID);
        }
    };
}




function rosterConnections(clist, doc) { //works
    var evObj = {
        connectionID: '',
        scoutID: ''
    };


    for (var i = 0; i < $('a[href*="ConnectionID="]', doc).length; i++) {
        evObj.scoutID = '';
        if ($('a[href*="ConnectionID="]', doc)[i].href.match(/ScoutUserID=(\d+)/) != null) {
            evObj.scoutID = $('a[href*="ConnectionID="]', doc)[i].href.match(/ScoutUserID=(\d+)/)[1];
        }
        evObj.connectionID = '';
        if ($('a[href*="ConnectionID="]', doc)[i].href.match(/ConnectionID=(\d+)/) != null) {
            evObj.connectionID = $('a[href*="ConnectionID="]', doc)[i].href.match(/ConnectionID=(\d+)/)[1];
        }
        clist.push(JSON.parse(JSON.stringify(evObj)));
    }

}


// function sets the gear setting on the roster page 
function setScoutRosterShowParent(unitID, cbFunc, cbv1, cbv2, cbv3, cbv4, cbv5, settings) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(setScoutRosterShowParent, unitID, cbFunc, cbv1, cbv2, cbv3, cbv4, cbv5, settings); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            cbFunc(cbv1, cbv2, cbv3, cbv4, cbv5);
        }
    };

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID=' + unitID;
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(settings);

    xhttp.onerror = function() {
        errHandle(setScoutRosterShowParent, unitID, cbFunc, cbv1, cbv2, cbv3, cbv4, cbv5, settings);
        if (servErrCnt > maxErr) {
            closeConMgr(unitID, '', '');
        }
    };
}

/*
	get the roster.  
	Check if parents are shown.  
	If not shown, 
		post to show.  Then get roster again
    if shown
		capture list of parent connection ids from roster page
		if previously changed to show, post to not show
*/
function getParentListFromRoster(unitID, patrolID, denID, setState, priorConns) {

    if (parentlistset == true) {
        //don't need to get it again
        allowContinue(unitID, patrolID, denID, priorConns);
        return;
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(getParentListFromRoster, unitID, patrolID, denID, setState, priorConns, '', '', ''); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            settings = $('#customizeScoutRosterForm', this.response).serialize();
            if (settings.indexOf('ShowParents') != -1) {
                rosterConnections(parentList, this.response); //sets global parentList
                //do we need to change back?
                if (setState == 'yes') {
                    //change roster prefs back
                    settings = settings.replace('CustomizeScoutRoster&ShowParents=1', 'CustomizeScoutRoster');
                    setScoutRosterShowParent(unitID, allowContinue, unitID, patrolID, denID, priorConns, '', settings);
                    return;
                } else {
                    //we now have the parentList
                    allowContinue(unitID, patrolID, denID, priorConns);
                }
            } else {
                // set roster prefs
                settings = settings.replace('CustomizeScoutRoster', 'CustomizeScoutRoster&ShowParents=1');
                setScoutRosterShowParent(unitID, getParentListFromRoster, unitID, patrolID, denID, 'yes', priorConns, settings);
            }

        }

    };
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID=' + unitID;

    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();
    xhttp.onerror = function() {
        errHandle(getParentListFromRoster, unitID, patrolID, denID, setState, priorConns, '', '', '');
        if (servErrCnt > maxErr) {
            closeConMgr(unitID, patrolID, denID);
        }
        servErrCnt++;
    };
}

// using list of parent connection ids from roster, and the ids from the connectionmanager line just changed
// find out which table intersections match the roster connectionids - these are the adult's children
// build a list of the intersections that need to be restored to their prior permisison state
function allowContinue(unitID, patrolID, denID, priorConns) {
    //global parentList is set

    var evObj = {
        connid: '',
        scoutID: '',
        parentID: '',
        class: ''
    };
    var mlist = []
    for (var i = 0; i < priorConns.length; i++) {
        for (var j = 0; j < parentList.length; j++) {
            //console.log(priorConns[i].connid,parentList[j].connectionID);
            if (priorConns[i].connid == parentList[j].connectionID) {
                //match
                evObj.scoutID = parentList[j].scoutID;
                evObj.connid = priorConns[i].connid;
                evObj.class = priorConns[i].class;
                evObj.parentID = priorConns[i].parentID;
                mlist.push(JSON.parse(JSON.stringify(evObj)));
                break;
            }
        }
    }

    resetConn(unitID, patrolID, denID, mlist);

}

function closeConMgr(unitID, patrolID, denID) {
    $('#setPermissionPopup').popup('close');
    var denpatrol = '';
    if (denID != '' || patrolID != '') {
        denpatrol = '&DenID=' + denID + '&PatrolID=' + patrolID;
    }
    $.mobile.loading('hide');
    $.mobile.changePage(
        '/mobile/dashboard/admin/connectionsmanager.asp?UnitID=' + unitID + denpatrol, {
            allowSamePageTransition: true,
            transition: 'none',
            showLoadMsg: true,
            reloadPage: true
        }
    );

}

// iterate a list of table intersections and permissions, post to set them
function resetConn(unitID, patrolID, denID, mlist) {
    var denpatrol = '';
    var id = '';
    if (mlist.length == 0) {
        //reload page
        closeConMgr(unitID, patrolID, denID);
        return;
    }

    var evObj = mlist.shift();
    //3  class=perm3
    //5 7	class=perm5  class=perm7
    //5 6	class=perm5  class=perm6
    //5		class=perm5 
    //4		class=perm4
    //4 7	class=perm4  class=perm7
    //4 6	class=perm4  class=perm6


    for (var i = 0; i < evObj.class.length; i++) {
        if (evObj.class[i].match(/perm(\d)/) != null) {
            id += 'PermissionID=' + evObj.class[i].match(/perm(\d)/)[1] + '&';
        }
    }

    var formPost = id + 'ConnectionID=' + evObj.connid + '&UserID=' + evObj.scoutID + '&ConnectedUserID=' + evObj.parentID;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(resetConn, unitID, patrolID, denID, mlist, '', '', '', ''); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            serveErrCnt = 0;
            resetConn(unitID, patrolID, denID, mlist);
        }
    };

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connectionsmanager.asp?Action=UpdateConnection&UnitID=' + unitID + '&DenID=&PatrolID=';
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(formPost);

    xhttp.onerror = function() {
        errHandle(resetConn, unitID, patrolID, denID, mlist, '', '', '', '');
        if (servErrCnt > maxErr) {
            closeConMgr(unitID, patrolID, denID);
        }
    };

}


/*
	get the roster.  
	Check if parents are shown.  
	If not shown, 
		post to show.  Then get roster again
    if shown
		capture list of parent connection ids from roster page
		if previously changed to show, post to not show
*/
function getParentListConFromRoster(unitID, patrolID, denID, setState, conlist) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(getParentListConFromRoster, unitID, patrolID, denID, setState, conlist, '', '', ''); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            settings = $('#customizeScoutRosterForm', this.response).serialize();
            if (settings.indexOf('ShowParents') != -1) {
                rosterConnections(parentList, this.response);
                parentlistset = true;
                //do we need to change back?
                if (setState == 'yes') {
                    //change roster prefs back
                    settings = settings.replace('CustomizeScoutRoster&ShowParents=1', 'CustomizeScoutRoster');
                    setScoutRosterShowParent(unitID, determineContinue, unitID, patrolID, denID, conlist, '', settings);
                    return;
                } else {
                    //we now have the parentList
                    determineContinue(unitID, patrolID, denID, conlist);
                }
            } else {
                // set roster prefs
                settings = settings.replace('CustomizeScoutRoster', 'CustomizeScoutRoster&ShowParents=1');
                setScoutRosterShowParent(unitID, getParentListConFromRoster, unitID, patrolID, denID, 'yes', conlist, settings);
            }

        }

    };
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID=' + unitID;

    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();
    xhttp.onerror = function() {
        errHandle(getParentListConFromRoster, unitID, patrolID, denID, setState, conlist, '', '', '');
        if (servErrCnt > maxErr) {
            closeConMgr(unitID, patrolID, denID);
        }
    };
}

// if any children in the row, indicate not safe
function determineContinue(unitID, patrolID, denID, conlist) {
    //conlist has simple list of connection ids for the current row
    var notsafe = false;
    var found = false;
    var mlist = [];
    for (var i = 0; i < conlist.length; i++) {
        found = false;
        for (var j = 0; j < parentList.length; j++) {
            if (conlist[i].connid == parentList[j].connectionID) {
                //console.log(i,conlist[i].connid, j,parentList[j].connectionID);
                notsafe = true;
                found = true;
                break;
            }
        }
        if (found == false) {
            var evObj = conlist[i];
            mlist.push(JSON.parse(JSON.stringify(evObj)));
        }
    }

    if (notsafe == true) {
        //iterate
        iteratePostIntersect(unitID, patrolID, denID, mlist);
    } else {
        var atype = $('#setPermissionPopup input').serialize();

        postRowPosition(unitID, patrolID, denID, atype, '');
    }
}

//used to clear permissions on a list
function iteratePostIntersect(unitID, patrolID, denID, mlist) {

    if (mlist.length == 0) {
        closeConMgr(unitID, patrolID, denID);
        return;
    }

    var evObj = mlist.shift();

    var formPost = 'ConnectionID=' + evObj.connid + '&UserID=' + evObj.scoutID + '&ConnectedUserID=' + evObj.parentID;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status > 399 && this.status < 500) {
            $.mobile.loading('hide');
            alert('Error: ' + this.status); //page not found etc.  This is unrecoverable
            return;
        }
        if (this.readyState == 4 && this.status > 499) {
            errHandle(iteratePostIntersect, unitID, patrolID, denID, mlist, '', '', '', ''); //server side error - maybe next try will work
            return;
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            serveErrCnt = 0;
            iteratePostIntersect(unitID, patrolID, denID, mlist);
        }
    };

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connectionsmanager.asp?Action=UpdateConnection&UnitID=' + unitID + '&DenID=' + denID + '&PatrolID=' + patrolID;
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(formPost);

    xhttp.onerror = function() {
        errHandle(iteratePostIntersect, unitID, patrolID, denID, mlist, '', '', '', '');
        if (servErrCnt > maxErr) {
            closeConMgr(unitID, patrolID, denID);
        }
    };

}