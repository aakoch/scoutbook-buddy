// Copyright © 2/24/2018 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.

/*
https://qa.scoutbook.com/mobile/dashboard/admin/counselorlist.asp?UnitID=31097

gives counselor list, seletor for which mbs, dx

Provides list of mbcs on

https://qa.scoutbook.com/mobile/dashboard/admin/counselorresults.asp?UnitID=31097&MeritBadgeID=3&Proximity=50&Availability=Available



"the <img > tag for each MBC contains the data-userid so it is possible.  Need to build a list of scouts and scoutids then use 
connectioninvite.asp?ScoutUserID=xxxxxxx&UnitID=xxxxx&DenID=&PatrolID=

Process would be to click connect, select MB, get list of scouts, click scout(s) then set permissions, then submit
If search was done for a specific badge, preselect that badge


so, don't know mb id's from page except by sort.  Only have names in the icons, so it would be ugly.
For now, easy way is to only show button if filtered on an mb anyway, then no mb list needed

Ideally, if clicking add mbc from scout's MB page, it would remember scout id and mb, preselect them, and a) and process it without further ado  OR b) same screen


build array of strings from beginning to match, then from end of match to next match, finally lat match to end


I think the invite on the Scout's page should be redirected to look up MBCs


 
*/


var scoutlist = [];
// add connect buttons to scoutbook.com/mobile/dashboard/admin/counselorresults.asp
function addRawCounselorResults(data, thisurl, pageid) {

    if (thisurl.match(/MeritBadgeID=\d+/) == null) {
        return data;
    }

    data = addconnbutton(data);

    var newdata = '';
    newdata += '				<div data-role="popup" id="scoutSelectMenu" data-theme="d" data-history="false" style="max-width:none">\n';
    newdata += '				</div>\n';
    var startfunc = data.indexOf('</div><!-- /content -->');
    data = data.slice(0, startfunc) + newdata + data.slice(startfunc);

    // add scripts
    var startfunc = data.indexOf('</div><!-- /content -->');

    if (startfunc == -1) return data;
    if (thisurl.match(/UnitID=(\d+)/) == null) return data;
    startfunc = data.indexOf('pageInit() {', startfunc) + 'pageInit() {'.length;
    data = data.slice(0, startfunc) + '\ncounsRespageScript("' + gInviteScout + '","' + thisurl.match(/UnitID=(\d+)/)[1] + '");\n' + data.slice(startfunc);
    //gInviteScout='';  moved to sb_util





    // var startfunc=data.indexOf('</div><!-- /content -->');
    // data=data.slice(0,startfunc) +  '<style type="text/css">\n #Page'+pageid+' .ui-popup-container, .ui-popup {height: 98%; width: 100%; position: absolute; top: 0;left:0; }\n</style>\n' + data.slice(startfunc);



    return data;

}





function showScoutInvMBC(counselorID, mbid, unitID) {
    var newdata = '';
    var bshow = false;
    var cshow = false;
    var listlen = 0;
    var lcnt = 0;
    newdata += '				<div style="margin-bottom: 1em; padding:10px;" >'; //1.5
    newdata += '					<div style="margin-top: 1em; " >';
    newdata += '						<fieldset data-role="controlgroup"   >';
    newdata += '							<legend class="text-orange" >';
    newdata += '								<strong>Choose Scout(s) to connect Counselor to:</strong>';
    newdata += '							</legend>	';
    newdata += '							<div class="ui-grid-b ui-responsive"  >';
    newdata += '							<div class="ui-block-a"  >\n';
    for (var i = 0; i < scoutPermObjList.length; i++) {
        if (scoutPermObjList[i].ok == true && scoutPermObjList[i].approved == true) {
            listlen += 1;
        }
    }
    for (var i = 0; i < scoutPermObjList.length; i++) {

        if (scoutPermObjList[i].ok == true && scoutPermObjList[i].approved == true) {
            lcnt += 1;
            if (lcnt >= listlen / 3 && bshow == false) {
                newdata += '					</div>\n';
                newdata += '					<div class="ui-block-b"  >\n';
                bshow = true;

            }
            if (lcnt >= listlen * 2 / 3 && cshow == false) {

                newdata += '					</div>\n';
                newdata += '					<div class="ui-block-c"  >\n';
                cshow = true;
            }


            newdata += '								<input type="checkbox" name="ScoutUserID" id="scoutUserID' + escapeHTML(scoutPermObjList[i].id) + '"   data-theme="d" value="' + escapeHTML(scoutPermObjList[i].id) + '"   >';
            newdata += '								<label for="scoutUserID' + escapeHTML(scoutPermObjList[i].id) + '">';
            newdata += '									<div style="display: inline-block; width: 30px; margin-right: 5px; ">';
            newdata += '										<img src="' + escapeHTML(scoutPermObjList[i].img) + '" class="imageSmall2" />';
            newdata += '									</div>';
            newdata += '									' + escapeHTML(scoutPermObjList[i].name);
            newdata += '								</label>	';
        }
    }
    newdata += '							</div></div>';
    newdata += '						</fieldset>';
    newdata += '					</div>';
    newdata += '					<a href="#" data-role="button" data-theme="g" style="margin-top: 1em; " id="buttonSubmitInv">Send Invites</a>';
    newdata += '					<p class="normalText" >';
    newdata += '						<strong>NOTE:</strong> This action cannot be undone.  If you make a mistake you must go into selected Scout connections and make any corrections manually.';
    newdata += '					</p>';
    newdata += '				</div>';

    $('#scoutSelectMenu').empty();
    $('#scoutSelectMenu').append(newdata).trigger('create');
    $('#scoutSelectMenu').popup({
        tolerance: '0,0',
        transition: 'pop',
        positionTo: 'window',
        history: false
    }).popup('open'); //10.,40

    scoutlist = [];
    var id;
    $('#buttonSubmitInv', '#' + $('div[data-role="page"]').attr('id')).click(function() {
        //build list of checked names
        $('input[name="ScoutUserID"]:checked').each(function() {
            id = $(this).attr('id');
            if ($(this).attr('id').match(/\d+/) != null) {
                scoutlist.push({
                    id: $(this).attr('id').match(/\d+/)[0],
                    name: $('label[for="' + id + '"]').text().trim(),
                    stat: false
                });
            }
        });


        var counselorID = $('a[data-mbc]').attr('data-mbc');
        var mbid = thispageMB();
        var unitID = $('div[data-url]').attr('data-url').match(/UnitID=(\d+)/)[1];
        iterateInv(counselorID, mbid, unitID);

    });
}


function iterateInv(counselorID, mbid, unitID) {
    var thisscout = '';
    for (var i = 0; i < scoutlist.length; i++) {
        if (scoutlist[i].stat == false) {
            thisscout = scoutlist[i].id;
            break;
        }
    }
    if (thisscout == '') {
        doneInv(unitID, '');
    } else {

        procgetmbScouts(counselorID, mbid, thisscout, unitID);

    }
}

function checkInv(counselorID, mbid, unitID, scoutid) {
    if (scoutlist.length == 0) {
        doneInv(unitID, scoutid);
        return;
    }
    for (var i = 0; i < scoutlist.length; i++) {
        if (scoutlist[i].id == scoutid) {
            scoutlist[i].stat = true;
            break;
        }
    }
    iterateInv(counselorID, mbid, unitID);
}

function doneInv(unitID, scoutid) {
    $.mobile.loading('hide'); // go to
    var lnk;
    if (scoutid == '') {
        lnk = '/mobile/dashboard/admin/unit.asp?UnitID=' + unitID;
    } else {
        //was advancement.asp
        lnk = '/mobile/dashboard/admin/account.asp?ScoutUserID=' + scoutid + '&UnitID=' + unitID;
    }
    $.mobile.changePage(
        lnk, {
            allowSamePageTransition: true,
            transition: 'none',
            showLoadMsg: true,
            reloadPage: true
        }
    );

}

function addRawMeritbadgeInvite(data, thisurl, pageid) {
    //thisurl  https://qa.scoutbook.com/mobile/dashboard/admin/advancement/meritbadge.asp?MeritBadgeID=xx&MeritBadgeVersionID=xxx&ScoutUserID=xxx&UnitID=xxx

    //change 
    //<a href="/mobile/dashboard/admin/connections.asp?ScoutUserID=678699&UnitID=31097" data-theme="g" data-role="button">Invite Counselor</a>
    //<a href="/mobile/dashboard/admin/connections.asp?ScoutUserID=xxx" data-theme="g" data-role="button">Invite Counselor</a>
    //to
    //https://www.scoutbook.com/mobile/dashboard/admin/counselorresults.asp?UnitID=xxx&MeritBadgeID=xx&Proximity=50&Availability=Available

    // should not be shown unless currentuser is a Troop Leader

    if (data.match(/<a href="\/mobile\/dashboard\/admin\/connections\.asp\?ScoutUserID=\d+&UnitID=\d+" data-theme="g" data-role="button">Invite Counselor<\/a>/) == null) {
        return data;
    }
    for (var i = 0; i < myPositions.length; i++) {
        if (myPositions[i].unitName.match(/Troop|Crew|Ship/) != null) {
            mbsearch = true;
            break;
        }
    }
    if (mbsearch == false) {
        return data;
    }

    //gInviteScout=data.match(/<a href="\/mobile\/dashboard\/admin\/connections\.asp\?ScoutUserID=(\d+)" data-theme="g" data-role="button">Invite Counselor<\/a>/)[1];
    //alert('this doesn\'t work when adding a merit badge');
    /*
    	if($('a[id="goToUnit"]',this.response).attr('href').match(/UnitID=(\d+)/)==null) {
    		return data;
    	}
    	var unitid=$('a[id="goToUnit"]',this.response).attr('href').match(/UnitID=(\d+)/)[1];
    */
    if (thisurl.match(/UnitID=(\d+)/) == null) return data;
    var unitid = thisurl.match(/UnitID=(\d+)/)[1];

    //var unitid=thisurl.match(/UnitID=(\d+)/)[1];
    if (thisurl.match(/MeritBadgeID=(\d+)/) == null) return data;
    var mbid = thisurl.match(/MeritBadgeID=(\d+)/)[1];
    var scoutName = '';
    if (data.match(/Invite (.+) merit badge counselor/) != null) {
        scoutName = data.match(/Invite (.+) merit badge counselor/)[1];
    }
    // replace with a button function
    //var newref='<a href="/mobile/dashboard/admin/counselorresults.asp?UnitID='+unitid+'&MeritBadgeID='+mbid+'&Proximity=50&Availability=Available" data-theme="g" data-role="button">Invite Counselor</a>';

    var newref = '<a href="#" id="buttonInviteC" data-unitid="' + unitid + '" data-meritbadgeid="' + mbid + '" data-theme="g" data-role="button">Lookup/Invite Counselor</a>';

    //data=data.replace(/<a href="\/mobile\/dashboard\/admin\/connections\.asp\?ScoutUserID=\d+" data-theme="g" data-role="button">Invite Counselor<\/a>/,newref);


    var startfunc = data.match(/<a href="\/mobile\/dashboard\/admin\/connections\.asp\?ScoutUserID=\d+&UnitID=\d+" data-theme="g" data-role="button">Invite Counselor<\/a>/).index;

    data = data.slice(0, startfunc) + newref + data.slice(startfunc);


    //add button handler to page scripts
    if (data.match(/ScoutUserID=(\d+)"/) != null) {
        //debugger;
        var scoutid = data.match(/ScoutUserID=(\d+)"/)[1];
        var startfunc = data.indexOf("$('#mbCompletedLI a'");
        var newdata = "$('#buttonInviteC').click( function () {\n";
        newdata += 'gotoCres("' + scoutid + '","' + unitid + '","' + mbid + '");\n'
        newdata += '});\n'

        data = data.slice(0, startfunc) + newdata + data.slice(startfunc);
    }
    data = data.replace(/data-role="button">Invite Counselor<\/a>/, 'data-role="button">' + scoutName + ' Connections</a>');
    return data;
}

function gotoCres(scoutid, unitid, mbid) {

    gInviteScout = scoutid;
    $.mobile.changePage(
        '/mobile/dashboard/admin/counselorresults.asp?UnitID=' + unitid + '&MeritBadgeID=' + mbid + '&zip=' + myPositions[0].myZip + '&Proximity=50&Availability=Available', {
            allowSamePageTransition: true,
            transition: 'none',
            showLoadMsg: true,
            reloadPage: true
        });

}

function counsRespageScript(InviteScout, unitID) {
    $('a[name="invite"]').click(function() {
        //alert($(this).attr('id') + ' '+ thispageMB() +'  scout ' + InviteScout);
        if ($(this).attr('id').match(/\d+/) == null) return false;
        $(this).attr('data-mbc', $(this).attr('id').match(/\d+/)[0]);
        if (InviteScout == '') {
            // build list of Scouts if InviteScout is blank..  When doing a standard search, InviteScout is blank.
            // When search was called from a Scout's MB page, it should have the id
            $.mobile.loading('show', {
                theme: 'a',
                text: 'loading eligible scout list... \nthis may take several minutes depending on the number of Scouts in the unit',
                textonly: false
            });
            getmbScouts($(this).attr('id').match(/\d+/)[0], thispageMB(), unitID);
            return false;
        }

        $.mobile.loading('show', {
            theme: 'a',
            text: 'saving...this may take several minutes depending on the number of Scouts selected',
            textonly: false
        });
        procgetmbScouts($(this).attr('id').match(/\d+/)[0], thispageMB(), InviteScout, unitID);

        return false;
        // check if mbc is already a connection, otherwise invite
    });

}

function procgetmbScouts(counselorID, mbid, scoutid, unitID) {

    var msg = '';
    var userid;
    var mbids = [];
    var mbapprov = '';
    var xhttp = new XMLHttpRequest();
    var brk = false;
    var alibrk = false;
    var ret = false;
    var mbconly = false;
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, doneInv, [], procgetmbScouts, [counselorID, mbid, scoutid, unitID]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            //looking for match to counselor.  If match, update the connection.  If not, send invite
            var patrolid = '';
            if ($('a[id="goToDenPatrol"]', this.response).attr('href') != undefined) {
                if ($('a[id="goToDenPatrol"]', this.response).attr('href').match(/PatrolID=(\d+)/) != null) {
                    var patrolid = $('a[id="goToDenPatrol"]', this.response).attr('href').match(/PatrolID=(\d+)/)[1];
                }
            }
            var unitid = $('a[id="goToDenPatrol"]', this.response).attr('href').match(/UnitID=(\d+)/)[1];


            $('li  a[href*="connection.asp"]', this.response).each(function() {
                if (brk == false) {
                    userid = $('img.profilePopup', this).attr('data-userid');
                    //console.log('checkScoutConnection connected adult id ' + userid + ' =? ' +counselorID );

                    //if requested counselor is already a connected adult
                    if ($(this).attr('href').match(/ConnectionID=(\d+)/) != null) {
                        if (userid == counselorID) {
                            //console.log('matched');

                            var connid = $(this).attr('href').match(/ConnectionID=(\d+)/)[1];
                            brk = false;
                            mbids.length = 0;
                            $('.mb.permission', this).each(function() {
                                if (brk == false) {
                                    var cmbid = $(this).attr('data-meritbadgeid');

                                    if (cmbid == mbid) {
                                        alert('already connected as counselor');
                                        brk = true;
                                        //return;
                                    } else {

                                        // 2/24 mbids.push(cmbid);
                                        mbapprov += '&PermissionApproveMBID=' + cmbid;
                                    }
                                }
                            });


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

                                mbapprov += '&PermissionApproveMBID=' + mbid;
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
                                //setTimeout(function() {
                                inUnitAddConnectInv(counselorID, formPost, connid, unitid, patrolid, msg, scoutid, mbid);
                                //},100);
                                ret = true;
                                brk = true;
                            }
                            //return false;
                        }
                    }
                }
            });
            if (ret == true) {
                return false;
            }
            if (brk == true) {
                checkInv(counselorID, mbid, unitID, scoutid);
                return false;
            }

            //requested counselor is not currently in the connection	list		

            // now see if there are any counselors already connected for this mb
            brk = false;
            $('li  a[href*="connection.asp"]', this.response).each(function() {
                if (brk == false) {
                    userid = $('img.profilePopup', this).attr('data-userid');
                    $('.mb.permission', this).each(function() {
                        if (brk == false) {
                            var cmbid = $(this).attr('data-meritbadgeid');
                            if (cmbid == mbid) {
                                brk = true;
                            }
                        }
                    });
                }
            });

            if (brk == true) {
                checkInv(counselorID, mbid, unitID, scoutid);
                return false;
            }
            // counselor is not yet connected.  Send an invite.
            sendMBCinviteA(counselorID, unitid, msg, scoutid, mbid);
            return;

        }
    };
    //console.log('getting connections for scout '+ scoutUserIDMBmbc[sUIindex] + ' sUIindex=' +sUIindex);
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connections.asp?ScoutUserID=' + scoutid + '&UnitID=' + unitID;
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();

    xhttp.onerror = function() {
        errStatusHandle(500, doneInv, [], procgetmbScouts, [counselorID, mbid, scoutid, unitID]);
    };

}

function inUnitAddConnectInv(counselorID, formPost, connid, unitid, patrolid, msg, scoutid, mbid) {
    /*
    Action=Submit
    &ConnectionRelationship=Merit+Badge+Counselor
    &ConnectionRelationship=Adult+Leader
    &PermissionFullControl=on
    &PermissionEditAdvancement=on
    &PermissionViewAdvancement=on
    &PermissionEditProfile=on
    &PermissionApproveMBID=3

    */
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, doneInv, [], inUnitAddConnectInv, [counselorID, formPost, connid, unitid, patrolid, msg, scoutid, mbid]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            if (this.response.match(/ErrorPopup/) != null) {
                alert('There was a problem connecting the counselor from the unit roster');
            }
            checkInv(counselorID, mbid, unitid, scoutid);
            //connectNextMBC(counselorID,unitid,msg);
        }
    };


    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connection.asp?ScoutUserID=' + scoutid + '&ConnectionID=' + connid + '&UnitID=' + unitid + '&DenID=&PatrolID=' + patrolid;
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(formPost);

    xhttp.onerror = function() {
        errStatusHandle(500, doneInv, [], inUnitAddConnectInv, [counselorID, formPost, connid, unitid, patrolid, msg, scoutid, mbid]);
    };
}

function addconnbutton(data) {
    var sArr = [];
    var r;
    var p = 0;
    sdata = data;

    var runit = true;
    while (runit) {

        if (sdata.match(/data-userid="(\d+)" \/>/) != null) {
            id = sdata.match(/data-userid="(\d+)" \/>/)[1];
            r = sdata.match(/data-userid="(\d+)" \/>/).index;
            // find endpoint
            rend = sdata.indexOf('/>', r);
            //adjust r to the new end
            r = rend + 1;
            //font  test
            if (r != -1) {
                sArr.push(sdata.slice(0, r + 1));
                sdata = sdata.slice(r + 1);
                //sArr.push('<span class="miles ui-btn-corner-all">'+id+'</span>');
                sArr.push('<a href="#" data-mini="true" data-role="button" data-inline="true" data-theme="g" style="margin-top: 1em; font-weight: bold; font-size: 8px padding:3px;" name="invite" id="buttonSubmit' + id + '">Invite</a>');
            } else {
                sArr.push(sdata);
                break;
            }
            p = r;
        } else {
            sArr.push(sdata);
            break;
        }
    }
    sdata = '';
    for (var i = 0; i < sArr.length; i++) {
        sdata += sArr[i];
    }
    return sdata;

}

function thispageMB() {
    var mbid = '';
    $('a[href*="MeritBadgeID="]').each(function() {
        //console.log($(this).attr('href'));
        if ($(this).attr('href').match(/MeritBadgeID=\d+/) != null) {
            mbid = $(this).attr('href').match(/MeritBadgeID=(\d+)/)[1];
        }
    });
    return mbid;
}



//need a CSRF?
//https://qa.scoutbook.com/mobile/dashboard/admin/connectioninvite.asp?ScoutUserID=xxx&UnitID=xx&DenID=&PatrolID=
function sendMBCinviteA(counselorID, unitid, msg, scoutid, mbid) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, doneInv, [], sendMBCinviteA, [counselorID, unitid, msg, scoutid, mbid]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            if ($('title', this.response).text() == "My Subscriptions") {
                //Scout is not approved
                //if(scoutlist.length==0) {
                alert('Scout is not Approved, so the Merit Badge Counselor cannot be connected');
                //}
                checkInv(counselorID, mbid, unitid, scoutid);
                return;
            }
            var CSRF = $('input[name="CSRF"]', this.response).val();
            sendMBCinviteB(counselorID, unitid, msg, scoutid, mbid, CSRF)
            //gettting page refresh 

            // 2/24 connectNextMBC(counselorID,unitid,msg);			
        }
    };
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connectioninvite.asp?ScoutUserID=' + scoutid + '&UnitID=' + unitid + '&DenID=&PatrolID=';
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();

    xhttp.onerror = function() {
        errStatusHandle(500, doneInv, [], sendMBCinviteA, [counselorID, unitid, msg, scoutid, mbid]);
    };
}

function sendMBCinviteB(counselorID, unitid, msg, scoutid, mbid, CSRF) {
    //console.log('sendMBCinvite id='+counselorID+' scout='+scoutUserIDMBmbc[sUIindex]);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, doneInv, [], sendMBCinviteB, [counselorID, unitid, msg, scoutid, mbid, CSRF]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            //gettting page refresh 

            // 2/24 connectNextMBC(counselorID,unitid,msg);	
            checkInv(counselorID, mbid, unitid, scoutid);
        }
    };

    //var msg='batch invite test';	
    msg = encodeURIComponent(msg).replace(/%20/g, '+');
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connectioninvite.asp?ScoutUserID=' + scoutid;
    var formPost = 'Action=Submit&AdultUserID=' + counselorID + '&ConnectionFirstName=&ConnectionLastName=&ConnectionEmail=&ConnectionEmail2=&ConnectionRelationship=Merit+Badge+Counselor&PermissionFullControl=off&PermissionEditAdvancement=off&PermissionViewAdvancement=off&PermissionEditProfile=off&PermissionApproveMBID=' + mbid + '&PersonalMessage=' + msg;
    formPost += '&CSRF=' + CSRF;
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(formPost);

    xhttp.onerror = function() {
        errStatusHandle(500, doneInv, [], sendMBCinviteB, [counselorID, unitid, msg, scoutid, mbid, CSRF]);
    };
}


function getmbScouts(counselorID, mbid, unitID) {

    var utype;
    utype = "unit";
    var evObj = {
        name: '',
        id: '',
        img: '',
        stat: false,
        ok: false,
        approved: false
    };
    var troop = $('#goToUnit').text();

    // need to get my connections to build scout list of scouts that user has edit profile capability for
    //var unitID = $('base')[0].href.match(/\d+/)[0];
    var lastname = '';
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, doneInv, [], getmbScouts, [counselorID, mbid, unitID]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            scoutPermObjList.length = 0;
            $('div [data-role="content"] >ul >li > div[style*="margin-left"]', this.response).each(function() {
                var txtUnit = $('.orangeSmall', this)[0].textContent;
                if (txtUnit.indexOf(troop) != -1) {
                    //this scout is in the unit of interest
                    okToUse = true;
                    if (okToUse == true) {

                        if ($('.permission', this)[0].textContent.indexOf('Full') != -1) {
                            // The User has permission to edit this Scout's profile
                            var p = $(this).parent();
                            evObj.img = $('img', p).attr('src');
                            evObj.id = '';
                            if ($('a', this).attr('href').match(/\d+/) != null) {
                                evObj.id = $('a', this).attr('href').match(/\d+/)[0];
                            }
                            evObj.name = $('a', this)[0].textContent.trim(); //format LASTNAME, firstname
                            lastname = evObj.name.match(/[^,]+/)[0];


                            scoutPermObjList.push(JSON.parse(JSON.stringify(evObj)));

                        }
                    }
                }
            });

            //we have scouts, ok to continue
            permCnt = 0;
            // make sure scouts have the mb, make sure they aren't already connected to a counselor
            verifyScoutApproval(counselorID, mbid, unitID);
            //showScoutInvMBC(counselorID,mbid,unitID);		// build a checkbox list of scouts, with a submit button.
            return;
        }
    };

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/adultconnections.asp';


    xhttp.open("GET", url, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, doneInv, [], getmbScouts, [counselorID, mbid, unitID]);
    };
}

function verifyScoutApproval(counselorID, mbid, unitID) {
    var id;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, doneInv, [], verifyScoutApproval, [counselorID, mbid, unitID]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;



            $('li[data-scoutuserid]', this.response).each(function() {
                if ($('img[src*="securityapproved32.png"]', this).length > 0) {
                    id = $(this).attr('data-scoutuserid');
                    for (var i = 0; i < scoutPermObjList.length; i++) {
                        if (scoutPermObjList[i].id == id) {
                            scoutPermObjList[i].approved = true;
                            break;
                        }
                    }
                }
            });

            iterCheckMbExistCounsAssgn(counselorID, mbid, unitID);

        }
    }


    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID=' + escapeHTML(unitID);

    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, doneInv, [], verifyScoutApproval, [counselorID, mbid, unitID]);
    }
}

function iterCheckMbExistCounsAssgn(counselorID, mbid, unitID) {
    var scoutid = '';
    for (var i = 0; i < scoutPermObjList.length; i++) {
        if (scoutPermObjList[i].stat == false && scoutPermObjList[i].approved == true) {
            scoutid = scoutPermObjList[i].id;
            break;
        }
    }
    if (scoutid == '') {
        //done
        $.mobile.loading('hide');
        for (var i = 0; i < scoutPermObjList.length; i++) {
            if (scoutPermObjList[i].ok == true && scoutPermObjList[i].approved == true) {
                showScoutInvMBC(counselorID, mbid, unitID);
                return;
            }
        }
        alert('No Scouts started this Merit Badge that need a Counselor');
        return;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, doneInv, [], iterCheckMbExistCounsAssgn, [counselorID, mbid, unitID]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;
            scoutPermObjList[i].stat = true; // mark checked
            if ($('a[href*="MeritBadgeID=' + mbid + '&"]', this.response).length != 0) {
                //have the mb.  Check for counselor assigned
                if ($('a[href*="MeritBadgeID=' + mbid + '&"]:contains(Assigned counselor)', this.response).length == 0) {
                    //counselor not assigned. make sure its not already approved, too
                    if ($('a[href*="MeritBadgeID=' + mbid + '&"]:contains(approved by)', this.response).length == 0) {
                        //not approved.  ok to use
                        scoutPermObjList[i].ok = true
                    }
                }
            }
            setTimeout(function() {
                iterCheckMbExistCounsAssgn(counselorID, mbid, unitID);
            }, 50);

        }
    }

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/advancement/default.asp?ScoutUserID=' + scoutid + '&UnitID=' + unitID + '&DenID=&PatrolID=';

    xhttp.open("GET", url, true);
    xhttp.responseType = "document";

    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, doneInv, [], iterCheckMbExistCounsAssgn, [counselorID, mbid, unitID]);
    };
}