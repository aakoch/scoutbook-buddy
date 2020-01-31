// Copyright © 10/4/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.
function addRawRegistrationPopup(data, pageid, unitID) {
    data = data.replace(/home<\/a>/g, 'home');


    var startfunc1 = data.indexOf('Connections Manager');

    if (startfunc1 == -1) {
        return data;
    }
    var startfunc = data.indexOf('</ul>', startfunc1);
    var menuopt = '';
    menuopt += ' <li class="ui-icon-alt">';


    menuopt += '	<a href="#importRegistrationPopup" data-rel="popup" data-transition="slideup">';
    menuopt += '		<div>Import Registration CSV</div>';
    menuopt += '	</a>';

    menuopt += ' </li>';

    var newdata = data.slice(0, startfunc) + menuopt + data.slice(startfunc);
    data = newdata;


    var startfunc = data.indexOf('<div id="footer"');
    newdata = '<div data-role="popup" id="profilePopup" data-overlay-theme="a" data-theme="c" data-transition="fade" data-history="false" class="ui-corner-all"></div>';
    newdata = '	<div data-role="popup" id="importRegistrationPopup" data-dismissible="false" data-theme="d" data-history="false">';

    newdata += '<ul data-role="listview" data-inset="true" style="min-width: 600px;" data-theme="d" >'; //class="ui-icon-alt"
    newdata += '<li data-role="divider" data-theme="e">Choose Registration CSV data file to import:</li>';
    newdata += '<li><input id="regCSVfileSelect" type="file" accept=".csv" /> </li>';

    newdata += '			<li><input type="submit" value="Import Registration File" data-theme="g" id="buttonRegImport" ><input type="submit" value="Cancel" data-theme="g" id="buttonImportRegCancel" ></li>';
    newdata += '			<li id="importErrRegLI">';
    newdata += '			</li>';
    //newdata +=			'</ul>';


    newdata += '			<li data-theme="d" id="userSearchLI">';
    newdata += '				<div class="ui-icon-alt">';
    newdata += '					<ul id="userSearch" data-role="listview">';
    newdata += '				</div>';
    newdata += '			</li>	';


    newdata += '</ul>';

    newdata += '	</div>';
    data = data.slice(0, startfunc) + newdata + '\n' + data.slice(startfunc);


    startfunc = data.indexOf("function showErrorPopup(msg)");
    //console.log('insert1 at '+startfunc);
    var myfunc = '' + rgimpfu;
    myfunc = myfunc.slice(21).slice(0, -1).replace(/\#PageX/g, '#Page' + escapeHTML(escapeHTML(pageid))).replace('unitid', escapeHTML(unitID));
    data = data.slice(0, startfunc) + myfunc + '\n' + data.slice(startfunc);

    //put reimpfu inside of pageinit

    startfunc = data.indexOf("$('#buttonRemoveScout',");
    //console.log('insert2 at '+startfunc);
    var myfunc = '' + reimpfu;
    myfunc = myfunc.slice(21).slice(0, -1).replace(/\#PageX/g, '#Page' + escapeHTML(escapeHTML(pageid))).replace('unitid', escapeHTML(unitID));
    data = data.slice(0, startfunc) + myfunc + '\n' + data.slice(startfunc);
    return data;
}
// begin registration import
function reimpfu() {
    $('#userSearchLI', '#PageX').on('click', '.selectUser', function() {
        parentOptionSelected($(this).attr('data-userid'));
    });
}

function rgimpfu() {
    var fileObjs = {};
    $('#buttonImportRegCancel', '#PageX').click(function() {

        $('#importRegistrationPopup', '#PageX').popup('close');
        $('#buttonRegImport', '#PageX').button('enable');
        $('#buttonImportRegCancel', '#PageX').button('enable');
    });
    $('#buttonRegImport', '#PageX').click(function() {


        // disable all inputs
        $('#buttonRegImport', '#PageX').button('disable');
        $('#buttonImportRegCancel', '#PageX').button('disable');

        var size = 0;
        var files = document.getElementById('regCSVfileSelect').files; //file1

        if (files.length == 0) {
            showErrorPopup('Please select the file you want to import and try again.');
            $('#buttonRegImport', '#PageX').button('enable');
            $('#buttonImportRegCancel', '#PageX').button('enable');
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

        var reader = new FileReader();
        reader.onload = function() {
            var data = reader.result;

            $.mobile.loading('hide');
            $.mobile.loading('show', {
                theme: 'a',
                text: 'saving... this can take several minutes',
                textonly: false
            });
            document.getElementById("regCSVfileSelect").disabled = true;
            fileObjs['regcsvdata'] = parseCSV(data);

            var res = preProcessCSVdataReg();

            if (res != '') {
                res = 'The file you selected does not appear to contain necessary headers.\nAborting import.\n  ' + res;
            } else {
                if (fileObjs.regcsvdata.length < 2) {
                    res += ' CSV file has header only, no data\n';
                } else {
                    if (fileObjs.regcsvdata[1] == '') {
                        res += ' CSV file has header only, no data\n';
                    }
                }
            }

            if (res != '') {
                alert(res);
                closeCSVImportReg('#PageX');
            } else {
                //validateCSVdata(); 
                //NewRegistrationValidate();
                getDenPatrol('#PageX');
            }
        };
        reader.readAsText(file);

        return false;
    });
}


function preProcessCSVdataReg() { //tested used
    //	var cols = ["DenID","FirstName","MiddleName","LastName","Suffix","Nickname","Address1","Address2","City","State","Zip","HomePhone","MobilePhone","BoysLife","CouncilID","DistrictID","BSAMemberID","BSAMemberIDConfirm","dobMonth","dobDay","dobYear","LDS","SchoolGrade","SchoolName","TalentRelease","Gender","ConnectionEmail2","PersonalMessage","FirstName","MiddleName","LastName","Suffix","Nickname","Address1","Address2","City","State","Zip","HomePhone","WorkPhone","MobilePhone","Email","CouncilID","DistrictID","BSAMemberID","Gender","ConnectionEmail2","PersonalMessage","FirstName","MiddleName","LastName","Suffix","Nickname","Address1","Address2","City","State","Zip","HomePhone","WorkPhone","MobilePhone","Email","CouncilID","DistrictID","BSAMemberID"];
    var cols = ["UnitName", "DenPatrolName", "FirstName", "MiddleName", "LastName", "Suffix", "Nickname", "Address1", "Address2", "City", "State", "Zip", "HomePhone", "MobilePhone", "BoysLife", "BSAMemberID", "dobMonth", "dobDay", "dobYear", "Gender", "LDS", "SchoolGrade", "SchoolName", "AddParent1", "P1Gender", "P1Email1", "P1PersonalMessage", "P1FirstName", "P1MiddleName", "P1LastName", "P1Suffix", "P1Nickname", "P1Address1", "P1Address2", "P1City", "P1State", "P1Zip", "P1HomePhone", "P1WorkPhone", "P1MobilePhone", "P1Email2", "P1BSAMemberID", "AddParent2", "P2Gender", "P2Email1", "P2PersonalMessage", "P2FirstName", "P2MiddleName", "P2LastName", "P2Suffix", "P2Nickname", "P2Address1", "P2Address2", "P2City", "P2State", "P2Zip", "P2HomePhone", "P2WorkPhone", "P2MobilePhone", "P2Email2", "P2BSAMemberID"];
    var res = '';
    var rowobj = {};

    if (fileObjs.regcsvdata[0].length != cols.length) {
        return 'invalid number of columns in input file';
    }

    for (var x = 0; x < cols.length; x++) {
        //console.log(x, fileObjs.csvdata[0][x] ,cols[x]);
        if (fileObjs.regcsvdata[0][x].trim() != cols[x].trim()) {
            //console.log('mismatch');
            res += ' ' + fileObjs.regcsvdata[0][x].trim() + ' <> ' + cols[x] + '\n';
        }
    }

    if (res != '') {
        res = 'The following Column names are missing or not in the right location \n' + res;
        return res;
    }

    //make sure all rows have all the fields
    for (var i = 1; i < fileObjs.regcsvdata.length; i++) {
        if (fileObjs.regcsvdata[i].length != cols.length) {
            res += 'Row ' + i + ' does not have all the columns of data.\n'
        }
    }

    if (res != '') {
        res += 'Please check your CSV file.  Hint:  sometimes using Notepad or a similar plain text editor (NOT MS Word) will show you unexpected line breaks the Excel sometimes inserts!'
        return res;
    }




    fileObjs['regcsvObjs'] = [];
    //create an object template and load all rows into 
    for (var i = 1; i < fileObjs.regcsvdata.length; i++) {
        for (var j = 0; j < cols.length; j++) {
            rowobj[cols[j]] = fileObjs.regcsvdata[i][j];
        }
        fileObjs.regcsvObjs.push(JSON.parse(JSON.stringify(rowobj)));
    }

    return res;
}




function closeImportclrReg() {
    //alert('Please note the issues listed!');
    $('#importErrRegLI').text('');
    closeCSVImportReg();

}

function closeCSVImportReg() { //tested used
    $.mobile.loading('hide');
    $('#faOverlay').hide();
    if ($('#importErrRegLI').text() != '') {
        setTimeout(function() {
            closeImportclrReg();
        }, 1000);
        return;
    }

    $('#buttonImportRegCancel').button('enable');
    $('#buttonRegImport').button('enable');
    document.getElementById("regCSVfileSelect").disabled = false;
    $('#importRegistrationPopup').popup('close');
    $.mobile.loading('hide');

    //reload page
    $.mobile.changePage(
        document.baseURI + '&Refresh=1',


        {
            allowSamePageTransition: true,
            transition: 'none',
            showLoadMsg: true,
            reloadPage: true
        }
    );

}



function getDenPatrol(pageid) {
    var unitID;
    if (document.baseURI.match(/UnitID=(\d+)/) == null) {
        $.mobile.loading('hide');
        alert('Halted due unexpected error in getDenPatrol');
        closeCSVImportReg(pageid);
        return;
    }

    unitID = document.baseURI.match(/UnitID=(\d+)/)[1];
    //on uit page
    //id	$('a[href*="denpatrol.asp"]',this.response)[0].href.match(/DenID=(\d+)/)[1]
    //name 	$('a[href*="denpatrol.asp"]')[0].text.trim().split('\n')[0]
    var denpatrolObjs = [];
    var thisObj = {};
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, closeCSVImportReg, [pageid], getDenPatrol, [pageid]);
        }
        if (this.readyState == 4 && this.status == 200) {
            servErrCnt = 0;
            resetLogoutTimer(url);
            for (var i = 0; i < $('a[href*="denpatrol.asp"]', this.response).length; i++) {
                if ($('a[href*="denpatrol.asp"]', this.response)[i].href.match(/DenID=\d+/) != null) {
                    thisObj['id'] = '&' + $('a[href*="denpatrol.asp"]', this.response)[i].href.match(/DenID=\d+/)[0] + '&PatrolID=';

                }
                if ($('a[href*="denpatrol.asp"]', this.response)[i].href.match(/PatrolID=\d+/) != null) {
                    thisObj['id'] = '&DenID=&' + $('a[href*="denpatrol.asp"]', this.response)[i].href.match(/PatrolID=\d+/)[0];

                }
                thisObj['name'] = $('a[href*="denpatrol.asp"]', this.response)[i].text.trim().split('\n')[0];
                denpatrolObjs.push(JSON.parse(JSON.stringify(thisObj)));
            }

            setTimeout(function() {
                NewRegistrationValidate(denpatrolObjs);
            }, 500);
        }
    }
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/unit.asp?UnitID=' + unitID;
    xhttp.open("GET", url, true);
    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, closeCSVImportReg, [], getDenPatrol, [pageid]);
    }

}
//					0			1			3			3		4			5			6		7		8		9		10		11				12			13			14			15		16		          17		18				19			20				21		   22		23				24				25			26			27			28		29			30		31			32	33		34		35			36			37				38		39			40			41			42				43			44			45			46			47		48			49		50			51		52	 53	  54			55					56		57		58																																										
//	var cols = ["FirstName","MiddleName","LastName","Suffix","Nickname","Address1","Address2","City","State","Zip","HomePhone","MobilePhone","BoysLife","BSAMemberID","dobMonth","dobDay","dobYear","Gender","LDS","SchoolGrade","SchoolName","TalentRelease","AddParent1","Gender","Email1","PersonalMessage","FirstName","MiddleName","LastName","Suffix","Nickname","Address1","Address2","City","State","Zip","HomePhone","WorkPhone","MobilePhone","Email2","BSAMemberID","AddParent2","Gender","Email1","PersonalMessage","FirstName","MiddleName","LastName","Suffix","Nickname","Address1","Address2","City","State","Zip","HomePhone","WorkPhone","MobilePhone","Email2","BSAMemberID"];
function NewRegistrationValidate(denpatrolObjs) {

    //Required
    //Scout Firstname, lastname, address, city. state, zip, one of the phones, dobmonth,day,yr,schoolgrade,schoolname

    // Save the Scout Roster. Already on the page, just build a list
    var scoutlist = [];
    var lastfirst = false;
    var csvname;
    var res = '';
    var unitID;

    if (document.baseURI.match(/UnitID=(\d+)/) == null) {
        $.mobile.loading('hide');
        alert('Halted due unexpected error in NewRegistrationValidate');
        closeCSVImportReg();
        return;
    }


    unitID = document.baseURI.match(/UnitID=(\d+)/)[1];

    for (var i = 0; i < $('a[href*="account.asp?ScoutUserID"]').length; i++) {
        scoutlist.push($('a[href*="account.asp?ScoutUserID"]')[i].text.trim());
    }

    if (scoutlist[0].indexOf(",") != -1) {
        lastfirst = true;
    }

    var uniqname = [];
    for (var x = 0; x < fileObjs.regcsvObjs.length; x++) {
        if (fileObjs.regcsvObjs[x].LastName.trim() == "" || fileObjs.regcsvObjs[x].FirstName.trim() == "") {
            alert('Scout names missing on line ' + (x + 1) + ' of your CSV file');
            closeCSVImportReg();
            uniqname = [];
            return;
        } else {
            if (pushUnique(uniqname, fileObjs.regcsvObjs[x].LastName.trim().toLowerCase() + '+' + fileObjs.regcsvObjs[x].FirstName.trim().toLowerCase()) == true) {
                alert('Scout names MUST be unique for this import. Please check your file and remove duplicate names');
                closeCSVImportReg();
                uniqname = [];
                return;
            }
        }
    }



    var xl;
    for (var x = 0; x < fileObjs.regcsvObjs.length; x++) {
        xl = x + 1;

        fileObjs.regcsvObjs[x].UnitName = fileObjs.regcsvObjs[x].UnitName.trim();
        if (fileObjs.regcsvObjs[x].UnitName == '') {
            res = "Unit Name is not defined line " + xl + '\n';
            break;
        }

        if (fileObjs.regcsvObjs[x].UnitName.toLowerCase() != $('#goToUnit').text().trim().toLowerCase()) {
            res = "Unitname " + fileObjs.regcsvObjs[x].UnitName + " doesn't match current unit " + $('#goToUnit').text() + ' line ' + xl + '\n';
            break;
        }

        fileObjs.regcsvObjs[x]['DenPatrolID'] = '';

        fileObjs.regcsvObjs[x].DenPatrolName = fileObjs.regcsvObjs[x].DenPatrolName.trim();
        for (var j = 0; j < denpatrolObjs.length; j++) {
            if (fileObjs.regcsvObjs[x].DenPatrolName == '' && fileObjs.regcsvObjs[x].UnitName.match(/^Pack/) != null) {
                res += 'Pack Registrations require a Den - and a Den is missing on line ' + xl + '\n';
                break;
            }

            if (fileObjs.regcsvObjs[x].DenPatrolName.toLowerCase() == denpatrolObjs[j].name.toLowerCase()) {
                fileObjs.regcsvObjs[x]['DenPatrolID'] = denpatrolObjs[j].id;
            }
        }

        if (fileObjs.regcsvObjs[x]['DenPatrolID'] == '' && fileObjs.regcsvObjs[x].DenPatrolName != '') {
            res += 'Den or Patrol name not found in the Unit ' + fileObjs.regcsvObjs[x].DenPatrolName + ' line ' + xl + '\n';
        } else {
            if (fileObjs.regcsvObjs[x]['DenPatrolID'] == '') {
                fileObjs.regcsvObjs[x]['DenPatrolID'] = '&DenID=&PatrolID=';
            }
        }

        fileObjs.regcsvObjs[x].LastName = fileObjs.regcsvObjs[x].LastName.trim();
        fileObjs.regcsvObjs[x].FirstName = fileObjs.regcsvObjs[x].FirstName.trim();
        //console.log(x, fileObjs.csvdata[0][x] ,cols[x]);
        if (lastfirst == true) {
            csvname = fileObjs.regcsvObjs[x].LastName + ', ' + fileObjs.regcsvObjs[x].FirstName;
        } else {
            csvname = fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName;
        }
        for (var y = 0; y < scoutlist.length; y++) {
            if (csvname.toLowerCase() == scoutlist[y].toLowerCase()) {
                res = 'Scout already exists in Scoutbook ' + csvname + ' line ' + xl + '\n';
                break;
            }
        }

        fileObjs.regcsvObjs[x].Address1 = fileObjs.regcsvObjs[x].Address1.trim();
        if (fileObjs.regcsvObjs[x].Address1 == '') {
            res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' missing address line ' + xl + '\n';
        }

        fileObjs.regcsvObjs[x].City = fileObjs.regcsvObjs[x].City.trim();
        if (fileObjs.regcsvObjs[x].City == '') {
            res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' missing City line ' + xl + '\n';
        }

        fileObjs.regcsvObjs[x].State = fileObjs.regcsvObjs[x].State.toUpperCase().trim();
        if (fileObjs.regcsvObjs[x].State == '') {
            res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' missing State line ' + xl + '\n';
        } else {
            if (statecheck(fileObjs.regcsvObjs[x].State) == false) {
                res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' invalid State line ' + xl + '\n';
            }
        }

        fileObjs.regcsvObjs[x].Zip = fileObjs.regcsvObjs[x].Zip.trim();
        if (fileObjs.regcsvObjs[x].Zip == '') {
            res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' missing Zip line ' + xl + '\n';
        } else {
            if (zipcheck(fileObjs.regcsvObjs[x].Zip) == false) {
                res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' Invalid Zip line ' + xl + '\n';
            }
        }

        fileObjs.regcsvObjs[x].HomePhone = phoneAlt(fileObjs.regcsvObjs[x].HomePhone.trim());
        fileObjs.regcsvObjs[x].MobilePhone = phoneAlt(fileObjs.regcsvObjs[x].MobilePhone.trim());

        if (fileObjs.regcsvObjs[x].HomePhone == '' && fileObjs.regcsvObjs[x].MobilePhone == '') {
            res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' missing phone number, need at least one line ' + xl + '\n';
        }

        if (fileObjs.regcsvObjs[x].HomePhone != '') {
            if (phonecheck(fileObjs.regcsvObjs[x].HomePhone) == false) {
                res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + 'invalid home phone number.  Format must be (nnn) nnn-nnnn line ' + xl + '\n';
            }
        }

        if (fileObjs.regcsvObjs[x].MobilePhone != '') {
            if (phonecheck(fileObjs.regcsvObjs[x].MobilePhone) == false) {
                res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + 'invalid mobile phone number.  Format must be (nnn) nnn-nnnn line ' + xl + '\n';
            }
        }

        fileObjs.regcsvObjs[x].BoysLife = fileObjs.regcsvObjs[x].BoysLife.trim().toLowerCase();

        if (fileObjs.regcsvObjs[x].BoysLife == 'n') fileObjs.regcsvObjs[x].BoysLife = 'no';
        if (fileObjs.regcsvObjs[x].BoysLife == '') fileObjs.regcsvObjs[x].BoysLife = 'no';
        if (fileObjs.regcsvObjs[x].BoysLife == 'y') fileObjs.regcsvObjs[x].BoysLife = 'yes';
        if (fileObjs.regcsvObjs[x].BoysLife != 'no' && fileObjs.regcsvObjs[x].BoysLife != 'yes') {
            res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' BoysLife must by yes or no line ' + xl + '\n';
        }

        fileObjs.regcsvObjs[x].dobMonth = fileObjs.regcsvObjs[x].dobMonth.trim();
        if (fileObjs.regcsvObjs[x].dobMonth != '' && isNaN(fileObjs.regcsvObjs[x].dobMonth) == true) {
            res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' DOB month is invalid line ' + xl + '\n';
        }


        if (fileObjs.regcsvObjs[x].dobMonth == '' || isNaN(fileObjs.regcsvObjs[x].dobMonth) == true) {
            res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' missing DOB Month line ' + xl + '\n';
        } else {
            if (parseInt(fileObjs.regcsvObjs[x].dobMonth) > 12 || parseInt(fileObjs.regcsvObjs[x].dobMonth) < 1) {
                res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' invalid DOB Month line ' + xl + '\n';
            }
        }



        var yr = cyear();
        fileObjs.regcsvObjs[x].dobYear = fileObjs.regcsvObjs[x].dobYear.trim();
        if (fileObjs.regcsvObjs[x].dobYear == '' || isNaN(fileObjs.regcsvObjs[x].dobYear) == true) {
            res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' missing DOB Year line ' + xl + '\n';
        } else {
            if (parseInt(fileObjs.regcsvObjs[x].dobYear) < yr - 18 || parseInt(fileObjs.regcsvObjs[x].dobYear) > yr - 4) {
                res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' invalid DOB Year line ' + xl + '\n';
            }
        }

        var mlen = ["31", "28", "31", "30", "31", "30", "31", "31", "30", "31", "30", "30", "31"];
        var ly = parseInt(fileObjs.regcsvObjs[x].dobYear) / 4;
        if (ly.toString().indexOf(".") == -1) {
            //Leap year
            mlen[1] = "29";
        }

        fileObjs.regcsvObjs[x].dobDay = fileObjs.regcsvObjs[x].dobDay.trim();
        if (fileObjs.regcsvObjs[x].dobDay == '' || isNaN(fileObjs.regcsvObjs[x].dobDay)) {
            res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' missing DOB Day line ' + xl + '\n';
        } else {
            if (parseInt(fileObjs.regcsvObjs[x].dobDay) > mlen[parseInt(fileObjs.regcsvObjs[x].dobMonth) - 1]) {
                res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' invalid DOB Day line ' + xl + '\n';
            }
        }



        fileObjs.regcsvObjs[x].Gender = fileObjs.regcsvObjs[x].Gender.trim().toUpperCase();
        if (fileObjs.regcsvObjs[x].Gender != 'M' && fileObjs.regcsvObjs[x].Gender != 'F') {
            res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' gender must be F or M line ' + xl + '\n';
        }



        fileObjs.regcsvObjs[x].LDS = fileObjs.regcsvObjs[x].LDS.trim().toLowerCase();
        if (fileObjs.regcsvObjs[x].LDS == 'n') fileObjs.regcsvObjs[x].LDS = 'no';
        if (fileObjs.regcsvObjs[x].LDS == '') fileObjs.regcsvObjs[x].LDS = 'no';
        if (fileObjs.regcsvObjs[x].LDS == 'y') fileObjs.regcsvObjs[x].LDS = 'yes';

        if (fileObjs.regcsvObjs[x].LDS != 'no' && fileObjs.regcsvObjs[x].LDS != 'yes') {
            res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' LDS must by yes or no line ' + xl + '\n';
        }

        //school grad k-12
        fileObjs.regcsvObjs[x].SchoolGrade = fileObjs.regcsvObjs[x].SchoolGrade.trim().toLowerCase();
        if (fileObjs.regcsvObjs[x].SchoolGrade == 'k') fileObjs.regcsvObjs[x].SchoolGrade = 0;

        if (isNaN(fileObjs.regcsvObjs[x].SchoolGrade) == true) {
            res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' Grade must be K-12 line ' + xl + '\n';
        } else {
            if (parseInt(fileObjs.regcsvObjs[x].SchoolGrade) > 12 || parseInt(fileObjs.regcsvObjs[x].SchoolGrade) < 0) {
                res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' Grade must be K-12   0-12 line ' + xl + '\n';
            }
        }



        fileObjs.regcsvObjs[x].SchoolName = fileObjs.regcsvObjs[x].SchoolName.trim();
        if (fileObjs.regcsvObjs[x].SchoolName == '') {
            res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' School missing line ' + xl + '\n';
        }

        /*
        fileObjs.regcsvObjs[x].TalentRelease=fileObjs.regcsvObjs[x].TalentRelease.trim().toLowerCase();
        if(fileObjs.regcsvObjs[x].TalentRelease == 'n') fileObjs.regcsvObjs[x].TalentRelease = 'no';
        if(fileObjs.regcsvObjs[x].TalentRelease == '') fileObjs.regcsvObjs[x].TalentRelease = 'no';
        if(fileObjs.regcsvObjs[x].TalentRelease == 'y') fileObjs.regcsvObjs[x].TalentRelease = 'yes';				
        
        if(fileObjs.regcsvObjs[x].TalentRelease != 'no' && fileObjs.regcsvObjs[x].TalentRelease != 'yes') {
        	res+=fileObjs.regcsvObjs[x].FirstName +' '+fileObjs.regcsvObjs[x].LastName + ' Talent Release must by yes or no\n';
        }		
        */






        // Rules for adult stuff...  if gender is marked, validateCSVdata
        //"addParent1" 21

        fileObjs.regcsvObjs[x].AddParent1 = fileObjs.regcsvObjs[x].AddParent1.trim().toLowerCase();
        if (fileObjs.regcsvObjs[x].AddParent1 == 'y') fileObjs.regcsvObjs[x].AddParent1 = 'yes';
        if (fileObjs.regcsvObjs[x].AddParent1 == 'yes') {
            //"Gender",22

            fileObjs.regcsvObjs[x].P1Gender = fileObjs.regcsvObjs[x].P1Gender.trim().toUpperCase();
            if (fileObjs.regcsvObjs[x].P1Gender != 'M' && fileObjs.regcsvObjs[x].P1Gender != 'F') {
                res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' parent1 gender must be F or M line ' + xl + '\n';
            }
            //"Email",//22
            fileObjs.regcsvObjs[x].P1Email1 = fileObjs.regcsvObjs[x].P1Email1.trim();
            if (fileObjs.regcsvObjs[x].P1Email1 != '') {
                if (emailcheck(fileObjs.regcsvObjs[x].P1Email1) == false) {
                    res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' parent1 Email is invalid line ' + xl + '\n';
                }
            } else {
                res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' parent1 Email is missing line ' + xl + '\n';
            }


            //"PersonalMessage",24  no checks needed. If empty will use a default
            //"FirstName",25
            fileObjs.regcsvObjs[x].P1FirstName = fileObjs.regcsvObjs[x].P1FirstName.trim();
            if (fileObjs.regcsvObjs[x].P1FirstName == '') {
                res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' parent1 missing first name line ' + xl + '\n';
            }
            //"MiddleName",26	no check
            //"LastName",27
            fileObjs.regcsvObjs[x].P1MiddleName = fileObjs.regcsvObjs[x].P1MiddleName.trim();
            fileObjs.regcsvObjs[x].P1LastName = fileObjs.regcsvObjs[x].P1LastName.trim();
            if (fileObjs.regcsvObjs[x].P1LastName == '') {
                res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' parent1 missing first name line ' + xl + '\n';
            }

            //"Suffix",28	no check
            //"Nickname",29 no check

            //"Address1",30	no check.  If blank, default to Scout Address
            //"Address2",31 no check.  If blank, default to Scout Address
            //"City",32 no check.  If blank, default to Scouts
            //"State",33    check.  If blank, default to Scouts
            fileObjs.regcsvObjs[x].P1Suffix = fileObjs.regcsvObjs[x].P1Suffix.trim();
            fileObjs.regcsvObjs[x].P1Nickname = fileObjs.regcsvObjs[x].P1Nickname.trim();
            fileObjs.regcsvObjs[x].P1Address1 = fileObjs.regcsvObjs[x].P1Address1.trim();
            fileObjs.regcsvObjs[x].P1Address2 = fileObjs.regcsvObjs[x].P1Address2.trim();
            fileObjs.regcsvObjs[x].P1City = fileObjs.regcsvObjs[x].P1City.trim();
            fileObjs.regcsvObjs[x].P1State = fileObjs.regcsvObjs[x].P1State.trim().toUpperCase();



            if (fileObjs.regcsvObjs[x].P1State != '') {
                if (statecheck(fileObjs.regcsvObjs[x].P1State) == false) {
                    res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + 'invalid parent1 state line ' + xl + '\n';
                }
            }

            //"Zip",34 check.  If blank, default to Scout 
            fileObjs.regcsvObjs[x].P1Zip = fileObjs.regcsvObjs[x].P1Zip.trim();
            if (fileObjs.regcsvObjs[x].P1Zip != '') {
                if (zipcheck(fileObjs.regcsvObjs[x].P1Zip) == false) {
                    res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + 'invalid parent1 zip line ' + xl + '\n';
                }
            }


            //"HomePhone",35  check.  If blank, default to Scouts
            fileObjs.regcsvObjs[x].P1HomePhone = phoneAlt(fileObjs.regcsvObjs[x].P1HomePhone.trim());
            if (fileObjs.regcsvObjs[x].P1HomePhone != '') {
                if (phonecheck(fileObjs.regcsvObjs[x].P1HomePhone) == false) {
                    res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + 'invalid parent1 home phone number.  Format must be (nnn) nnn-nnnn line ' + xl + '\n';
                }
            }

            //"WorkPhone","
            fileObjs.regcsvObjs[x].P1WorkPhone = phoneAlt(fileObjs.regcsvObjs[x].P1WorkPhone.trim());
            if (fileObjs.regcsvObjs[x].P1WorkPhone != '') {
                if (phonecheck(fileObjs.regcsvObjs[x].P1WorkPhone) == false) {
                    res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + 'invalid parent1 work phone number.  Format must be (nnn) nnn-nnnn line ' + xl + '\n';
                }
            }

            //MobilePhone", check.  If blank, default to Scouts

            fileObjs.regcsvObjs[x].P1MobilePhone = phoneAlt(fileObjs.regcsvObjs[x].P1MobilePhone.trim());
            if (fileObjs.regcsvObjs[x].P1MobilePhone != '') {
                if (phonecheck(fileObjs.regcsvObjs[x].P1MobilePhone) == false) {
                    res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + 'invalid parent1 mobile phone number.  Format must be (nnn) nnn-nnnn line ' + xl + '\n';
                }
            }

            //"ConnectionEmail2",

            fileObjs.regcsvObjs[x].P1Email2 = fileObjs.regcsvObjs[x].P1Email2.trim();
            if (fileObjs.regcsvObjs[x].P1Email2 != '') {
                if (emailcheck(fileObjs.regcsvObjs[x].P1Email2) == false) {
                    res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' parent1 ConnectionEmail2 is invalid line ' + xl + '\n';
                }
            }

            //"BSAMemberID",
            fileObjs.regcsvObjs[x].P1BSAMemberID = fileObjs.regcsvObjs[x].P1BSAMemberID.trim();
            if (fileObjs.regcsvObjs[x].P1BSAMemberID != '') {
                if (isNaN(fileObjs.regcsvObjs[x].P1BSAMemberID) == true) {
                    res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' parent1 BSAMemberID is invalid line ' + xl + '\n';
                }
            }
        }

        fileObjs.regcsvObjs[x].AddParent2 = fileObjs.regcsvObjs[x].AddParent2.trim().toLowerCase();
        if (fileObjs.regcsvObjs[x].AddParent2 == 'y') fileObjs.regcsvObjs[x].AddParent2 = 'yes';
        if (fileObjs.regcsvObjs[x].AddParent2 == 'yes') {
            //"Gender",38
            fileObjs.regcsvObjs[x].P2Gender = fileObjs.regcsvObjs[x].P2Gender.trim().toUpperCase();
            if (fileObjs.regcsvObjs[x].P2Gender != 'M' && fileObjs.regcsvObjs[x].P2Gender != 'F') {
                res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' parent2 gender must be F or M line ' + xl + '\n';
            }
            //"Email",//39
            fileObjs.regcsvObjs[x].P2Email1 = fileObjs.regcsvObjs[x].P2Email1.trim();
            if (fileObjs.regcsvObjs[x].P2Email1 != '') {
                if (emailcheck(fileObjs.regcsvObjs[x].P2Email1) == false) {
                    res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' parent2 Email is invalid line ' + xl + '\n';
                }
            } else {
                res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' parent2 Email is missing line ' + xl + '\n';
            }


            //"PersonalMessage",43  no checks needed. If empty will use a default
            //"FirstName",44
            fileObjs.regcsvObjs[x].P2FirstName = fileObjs.regcsvObjs[x].P2FirstName.trim();
            fileObjs.regcsvObjs[x].P2LastName = fileObjs.regcsvObjs[x].P2LastName.trim();
            if (fileObjs.regcsvObjs[x].P2FirstName == '') {
                res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' parent2 missing first name line ' + xl + '\n';
            }
            //"MiddleName",45	no check
            //"LastName",464

            if (fileObjs.regcsvObjs[x].P2LastName == '') {
                res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' parent2 missing first name line ' + xl + '\n';
            }

            //"Suffix",47	no check
            //"Nickname",48 no check

            //"Address1",49	no check.  If blank, default to Scout Address
            //"Address2",50 no check.  If blank, default to Scout Address
            //"City",41 no check.  If blank, default to Scouts
            //"State",52    check.  If blank, default to Scouts
            fileObjs.regcsvObjs[x].P2Suffix = fileObjs.regcsvObjs[x].P2Suffix.trim();
            fileObjs.regcsvObjs[x].P2Nickname = fileObjs.regcsvObjs[x].P2Nickname.trim();
            fileObjs.regcsvObjs[x].P2Address1 = fileObjs.regcsvObjs[x].P2Address1.trim();
            fileObjs.regcsvObjs[x].P2Address2 = fileObjs.regcsvObjs[x].P2Address2.trim();
            fileObjs.regcsvObjs[x].P2City = fileObjs.regcsvObjs[x].P2City.trim();

            fileObjs.regcsvObjs[x].P2State = fileObjs.regcsvObjs[x].P2State.trim().toUpperCase();
            if (fileObjs.regcsvObjs[x].P2State != '') {
                if (statecheck(fileObjs.regcsvObjs[x].P2State) == false) {
                    res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + 'invalid parent2 state line ' + xl + '\n';
                }
            }

            //"Zip",50 check.  If blank, default to Scout 
            fileObjs.regcsvObjs[x].P2Zip = fileObjs.regcsvObjs[x].P2Zip.trim();
            if (fileObjs.regcsvObjs[x].P2Zip != '') {
                if (zipcheck(fileObjs.regcsvObjs[x].P2Zip) == false) {
                    res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + 'invalid parent2 zip line ' + xl + '\n';
                }
            }


            //"HomePhone",51  check.  If blank, default to Scouts
            fileObjs.regcsvObjs[x].P2HomePhone = phoneAlt(fileObjs.regcsvObjs[x].P2HomePhone.trim());
            if (fileObjs.regcsvObjs[x].P2HomePhone != '') {
                if (phonecheck(fileObjs.regcsvObjs[x].P2HomePhone) == false) {
                    res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + 'invalid parent2 home phone number.  Format must be (nnn) nnn-nnnn line ' + xl + '\n';
                }
            }

            //"WorkPhone","
            fileObjs.regcsvObjs[x].P2WorkPhone = phoneAlt(fileObjs.regcsvObjs[x].P2WorkPhone.trim());
            if (fileObjs.regcsvObjs[x].P2WorkPhone != '') {
                if (phonecheck(fileObjs.regcsvObjs[x].P2WorkPhone) == false) {
                    res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + 'invalid parent2 work phone number.  Format must be (nnn) nnn-nnnn line ' + xl + '\n';
                }
            }

            //MobilePhone", check.  If blank, default to Scouts

            fileObjs.regcsvObjs[x].P2MobilePhone = phoneAlt(fileObjs.regcsvObjs[x].P2MobilePhone.trim());
            if (fileObjs.regcsvObjs[x].P2MobilePhone != '') {
                if (phonecheck(fileObjs.regcsvObjs[x].P2MobilePhone) == false) {
                    res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + 'invalid parent2 mobile phone number.  Format must be (nnn) nnn-nnnn line ' + xl + '\n';
                }
            }

            //"ConnectionEmail2",
            fileObjs.regcsvObjs[x].P2Email2 = fileObjs.regcsvObjs[x].P2Email2.trim();
            if (fileObjs.regcsvObjs[x].P2Email2 != '') {
                if (emailcheck(fileObjs.regcsvObjs[x].P2Email2) == false) {
                    res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' parent2 ConnectionEmail2 is invalid line ' + xl + '\n';
                }
            }

            //"BSAMemberID",
            fileObjs.regcsvObjs[x].P2BSAMemberID = fileObjs.regcsvObjs[x].P2BSAMemberID.trim();
            if (fileObjs.regcsvObjs[x].P2BSAMemberID != '') {
                if (isNaN(fileObjs.regcsvObjs[x].P2BSAMemberID) == true) {
                    res += fileObjs.regcsvObjs[x].FirstName + ' ' + fileObjs.regcsvObjs[x].LastName + ' parent2 BSAMemberID is invalid line ' + xl + '\n';
                }
            }
        }
    }

    if (res != '') {
        alert(res);
        closeCSVImportReg();
    } else {
        var tunit = $('#goToUnit').text();
        var denpatrol = '';
        if (tunit.match(/Pack/) != null) denpatrol = "DenID";
        if (tunit.match(/Troop/) != null) denpatrol = "PatrolID";
        if (tunit.match(/Crew/) != null) denpatrol = "PatrolID";
        if (tunit.match(/Team/) != null) denpatrol = "SquadID";

        fileObjs.regcsvdata.shift(); //remove header row

        addScout(unitID, denpatrol);
        //alert ('stub - completed offline file validation');
        //closeCSVImportReg();
    }

}

function phoneAlt(phonenum) {
    var rphonenum = phonenum;
    if (phonenum.match(/^(\(\d\d\d\)\d\d\d-\d\d\d\d)$/) != null) {

        rphonenum = phonenum.slice(1, 4) + '-' + phonenum.slice(5);
    }
    if (phonenum.match(/^(\(\d\d\d\) \d\d\d-\d\d\d\d)$/) != null) {
        rphonenum = phonenum.slice(1, 4) + '-' + phonenum.slice(6);
    }

    return rphonenum;
}

// get the roster to make sure there is subscription has room  $('a[data-max-users=1]')
function addScout(unitID, denpatrol) {

    if (fileObjs.regcsvObjs.length == 0) {

        closeCSVImportReg();
        return;
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, closeCSVImportReg, [], addScout, [unitID, denpatrol]);
        }
        if (this.readyState == 4 && this.status == 200) {
            servErrCnt = 0;
            resetLogoutTimer(url);

            if ($('a[data-maxusers=1]', this.response).length != 0) {

                $.mobile.loading('hide');
                alert('The Subscription is Full, can\'t import any more');
                closeCSVImportReg();
                return;
            }
            addScoutSpace(unitID, denpatrol);
        }
    };
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID=' + escapeHTML(unitID);
    xhttp.open("GET", url, true);
    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, closeCSVImportReg, [], addScout, [unitID, denpatrol]);
    };

}
// don't know if needed for cookie but just do in case
function addScoutSpace(unitID, denpatrol) {


    //var regData = fileObjs.regcsvdata.shift();


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, closeCSVImportReg, [], addScoutSpace, [unitID, denpatrol]);
        }
        if (this.readyState == 4 && this.status == 200) {
            servErrCnt = 0;
            resetLogoutTimer(url);


            if ($('Title', this.response).length == 0) {
                alert('Halted due to error getting to add scout page');
                closeCSVImportReg();
                return;
            }
            var regData = fileObjs.regcsvObjs.shift();
            setTimeout(function() {
                postNewScout(unitID, denpatrol, regData);
            }, 500);
        }
    };
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/addscout.asp?UnitID=' + escapeHTML(unitID);
    xhttp.open("GET", url, true);
    xhttp.responseType = 'document';
    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, closeCSVImportReg, [], addScoutSpace, [unitID, denpatrol]);
    };
}


function postNewScout(unitID, denpatrol, regData) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, closeCSVImportReg, [], postNewScout, [unitID, denpatrol, regData]);
        }
        if (this.readyState == 4 && this.status == 200) {
            servErrCnt = 0;
            resetLogoutTimer(url);

            if (this.response.indexOf('admin/denpatrol.asp') == -1 && this.response.indexOf('/admin/roster.asp') == -1) {

                var derr = '';
                var errmsg = this.response.match(/showErrorPopup\(([^\)]+)/);
                if (errmsg != null) {
                    derr = errmsg[1].replace(/<strong>|<\/strong>|<p>|<\/p>/g, '');
                }
                alert('Halted due to error adding new scout ' + derr);
                closeCSVImportReg();
                return;
            }

            setTimeout(function() {
                // success means the scout is added to the roster, need to get it to find his id
                getNewRoster(unitID, denpatrol, regData);
            }, 500);
        }
    };
    var formpost = 'Action=Submit';
    formpost += '&FirstName=' + encodeURIComponent(regData.FirstName);
    formpost += '&LastName=' + encodeURIComponent(regData.LastName);
    formpost += '&Zip=' + regData.Zip;

    if (regData.DenPatrolID.match(/DenID=\d+/) != null) {
        var denpatrolid = '&' + regData.DenPatrolID.match(/DenID=\d+/)[0];
    } else {
        if (regData.DenPatrolID == '&DenID=&PatrolID=') {
            var denpatrolid = '&PatrolID=';
        } else {
            if (regData.DenPatrolID.match(/PatrolID=\d+/) == null) {
                $.mobile.loading('hide');
                alert('unexpected Error in postNewScout');
                closeCSVImportReg();
                return;
            }
            var denpatrolid = '&' + regData.DenPatrolID.match(/PatrolID=\d+/)[0];
        }
    }
    formpost += denpatrolid; //leave blank
    formpost += '&dobMonth=' + regData.dobMonth;
    formpost += '&dobDay=' + regData.dobDay;
    formpost += '&dobYear=' + regData.dobYear;
    formpost += '&Gender=' + regData.Gender;

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/addscout.asp?UnitID=' + escapeHTML(unitID);
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(formpost);

    xhttp.onerror = function() {
        errStatusHandle(500, closeCSVImportReg, [], postNewScout, [unitID, denpatrol, regData]);
    };

}

// get the new scouts scoutid
function getNewRoster(unitID, denpatrol, regData) {
    var scoutlist = [];
    var scoutIDlist = [];
    var lastfirst = false;
    var sname;
    var scoutid = '';
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, closeCSVImportReg, [], getNewRoster, [unitID, denpatrol, regData]);
        }
        if (this.readyState == 4 && this.status == 200) {
            servErrCnt = 0;
            resetLogoutTimer(url);

            for (var i = 0; i < $('a[href*="account.asp?ScoutUserID"]', this.response).length; i++) {
                scoutlist.push($('a[href*="account.asp?ScoutUserID"]', this.response)[i].text.trim());

                if ($('a[href*="account.asp?ScoutUserID"]', this.response)[i].href.match(/ScoutUserID=(\d+)/) == null) {
                    $.mobile.loading('hide');
                    alert('unexpected Error in getNewRoster');
                    closeCSVImportReg();
                    return;
                }

                scoutIDlist.push($('a[href*="account.asp?ScoutUserID"]', this.response)[i].href.match(/ScoutUserID=(\d+)/)[1]);
            }
            if (scoutlist.length == 0) {
                alert('Halted due to error getting roster');
                closeCSVImportReg();
                return;
            }

            if (scoutlist[0].indexOf(",") != -1) lastfirst = true;

            //console.log(x, fileObjs.csvdata[0][x] ,cols[x]);
            if (lastfirst == true) {
                sname = regData.LastName.trim() + ', ' + regData.FirstName.trim();
            } else {
                sname = regData.FirstName.trim() + ' ' + regData.LastName.trim();
            }
            for (var y = 0; y < scoutlist.length; y++) {
                if (sname.toUpperCase() == scoutlist[y].toUpperCase()) {
                    //found the scout...
                    scoutid = scoutIDlist[y];
                    //don't need to worry about two scouts with same name, already handled earlier
                    break;
                }
            }

            if (scoutid == '') {
                alert('error - scout ' + sname + ' not found as added in roster');
                addScout(unitID, denpatrol); // try for next
            } else {
                setTimeout(function() {
                    editRegNewScout(unitID, denpatrol, regData, scoutid);
                }, 500);
            }
        }
    };
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID=' + escapeHTML(unitID);
    xhttp.open("GET", url, true);
    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, closeCSVImportReg, [], getNewRoster, [unitID, denpatrol, regData]);
    };

}




function editRegNewScout(unitID, denpatrol, regData, scoutid) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, closeCSVImportReg, [], editRegNewScout, [unitID, denpatrol, regData, scoutid]);
        }
        if (this.readyState == 4 && this.status == 200) {
            servErrCnt = 0;
            resetLogoutTimer(url);

            var formPost = $('#editProfileForm', this.response).serialize();

            if (formPost == '') {

                alert('Halted due to error editing scout profile');
                closeCSVImportReg();
                return;
            }

            if ($('a[href="#"][id="disapproveButton"]', this.response).text() != "") {
                formPost = formPost + '&Approved=1';
            }

            //got the form data; replace elements as needed
            /* Fields to update
            	MiddleName 1
            	Suffix 3
            	Nickname 4	
            	Address1  5
            	Address2  6
            	City 7
            	State 8
            	-zip already done-
            	HomePhone 10
            	MobilePhone 111
            	BoysLife 12
            	-council?? already there - but get for parents
            	-district?? already there - but get for parents
            	BSAMemberID 13
            	BSAMemberIDConfirm 13
            	LDS 17
            	SchoolName 18
            	SchoolGrade 19
            	TalentRelease 20
            	encodeURIComponent(regData.P1FirstName).replace(/%20/g,'+');
            */
            //MiddleName 1
            formPost = tokenVal(formPost, 'MiddleName', encodeURIComponent(regData.MiddleName).replace(/%20/g, '+'));
            //Suffix 3
            formPost = tokenVal(formPost, 'Suffix', encodeURIComponent(regData.Suffix).replace(/%20/g, '+'));
            //Nickname 4
            formPost = tokenVal(formPost, 'Nickname', encodeURIComponent(regData.Nickname).replace(/%20/g, '+'));
            //Address1  5
            formPost = tokenVal(formPost, 'Address1', encodeURIComponent(regData.Address1).replace(/%20/g, '+'));
            //Address2  6
            formPost = tokenVal(formPost, 'Address2', encodeURIComponent(regData.Address2).replace(/%20/g, '+'));
            //City 7
            formPost = tokenVal(formPost, 'City', encodeURIComponent(regData.City).replace(/%20/g, '+'));
            //State 8
            formPost = tokenVal(formPost, 'State', regData.State);
            //-zip already done-
            //HomePhone 10
            formPost = tokenVal(formPost, 'HomePhone', regData.HomePhone);
            //MobilePhone 111
            formPost = tokenVal(formPost, 'MobilePhone', regData.MobilePhone);
            //BoysLife 12
            formPost = tokenVal(formPost, 'BoysLife', regData.BoysLife);
            //-council?? already there - but get for parents
            var council = getToken(formPost, 'CouncilID');
            var district = getToken(formPost, 'DistrictID');

            regData['DistrictID'] = district;
            regData['CouncilID'] = council;
            //-district?? already there - but get for parents
            //BSAMemberID 13
            formPost = tokenVal(formPost, 'BSAMemberID', regData.BSAMemberID);
            //BSAMemberIDConfirm 13
            formPost = tokenVal(formPost, 'BSAMemberIDConfirm', regData.BSAMemberID);
            //LDS 17
            formPost = tokenVal(formPost, 'LDS', regData.LDS);
            //SchoolName 18
            formPost = tokenVal(formPost, 'SchoolName', encodeURIComponent(regData.SchoolName).replace(/%20/g, '+'));
            //SchoolGrade 19
            formPost = tokenVal(formPost, 'SchoolGrade', encodeURIComponent(regData.SchoolGrade).replace(/%20/g, '+'));
            //TalentRelease 20
            //			formPost=tokenVal(formPost,'TalentRelease',regData.TalentRelease);				


            var councilname = $('#councilID option:selected', this.response)[0].getAttribute('data-council-name');

            setTimeout(function() {
                postNewScoutProfileUpdate(unitID, denpatrol, regData, scoutid, formPost, councilname);
            }, 500);
        }
    };
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/editprofile.asp?ScoutUserID=' + escapeHTML(scoutid) + '&UnitID=' + escapeHTML(unitID) + '&DenID=&PatrolID=';
    xhttp.open("GET", url, true);
    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, closeCSVImportReg, [], editRegNewScout, [unitID, denpatrol, regData, scoutid]);
    };

}


function postNewScoutProfileUpdate(unitID, denpatrol, regData, scoutid, formPost, councilname) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, closeCSVImportReg, [], postNewScoutProfileUpdate, [unitID, denpatrol, regData, scoutid, formPost, councilname]);
        }
        if (this.readyState == 4 && this.status == 200) {
            servErrCnt = 0;
            resetLogoutTimer(url);

            if (this.response.indexOf('Update successful!') == -1) {

                if (this.response.indexOf('If this is a new BSA #') != -1) {
                    formPost = formPost.replace(/BSAMemberIDConfirm=\d+/, 'BSAMemberIDConfirm=1');

                    setTimeout(function() {
                        postNewScoutProfileUpdate(unitID, denpatrol, regData, scoutid, formPost, councilname);
                    }, 500);
                    return;
                }



                var derr = '';
                var errmsg = this.response.match(/showErrorPopup\(([^\)]+)/);
                if (errmsg != null) {
                    derr = errmsg[1].replace(/<strong>|<\/strong>|<p>|<\/p>/g, '');
                }
                alert('Halted due to scout profile update error ' + derr + ' Stopped on ' + getToken(formPost, 'FirstName') + ' ' + getToken(formPost, 'LastName'));
                closeCSVImportReg();
                return;
            }

            //see if sync is set	
            //verifySyncScout(unitID,denpatrol,regData,scoutid,formPost,councilname);
            //return;		// or delete the timeout stuff below

            setTimeout(function() {
                // success means the scout profile has been updated
                // Start processing parents



                if (regData.AddParent1 == 'yes') {
                    // first parent info is available in csv
                    //skip 9/17 just send invite with email checkAdminConnectedByName(unitID,denpatrol,scoutid,regData,true,councilname);
                    var undoleader = false; // this call doesn't need this set
                    checkAdminConnectedByName(unitID, denpatrol, scoutid, regData, true, councilname, undoleader);
                    //getsendNewParentAcctInvite(unitID,denpatrol,scoutid,regData,councilname);

                } else {
                    //complete!
                    //check if more ilines are left.
                    //closeCSVImportReg();
                    addScout(unitID, denpatrol);
                }
            }, 500);
        }
    };

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/editprofile.asp?ScoutUserID=' + scoutid + '&AdultUserID=&UnitID=' + unitID;
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(formPost);

    xhttp.onerror = function() {
        errStatusHandle(500, closeCSVImportReg, [], postNewScoutProfileUpdate, [unitID, denpatrol, regData, scoutid, formPost, councilname]);
    };

}


function verifySyncScout(unitID, denpatrol, regData, scoutid, formPost, councilname) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, closeCSVImportReg, [], checkAdminConnectedByName, [unitID, denpatrol, scoutid, regData, allowleader, councilname, undoleader]);
        }
        if (this.readyState == 4 && this.status == 200) {
            servErrCnt = 0;
            resetLogoutTimer(url);

            setTimeout(function() {
                // success means the scout profile has been updated
                // Start processing parents

                //whatever the response, can't do much.  Maybe notify if sync can't happen

                if (regData.AddParent1 == 'yes') {
                    // first parent info is available in csv
                    //skip 9/17 just send invite with email checkAdminConnectedByName(unitID,denpatrol,scoutid,regData,true,councilname);
                    var undoleader = false; // this call doesn't need this set
                    checkAdminConnectedByName(unitID, denpatrol, scoutid, regData, true, councilname, undoleader);
                    //getsendNewParentAcctInvite(unitID,denpatrol,scoutid,regData,councilname);

                } else {
                    //complete!
                    //check if more ilines are left.
                    //closeCSVImportReg();
                    addScout(unitID, denpatrol);
                }
            }, 500);


        }
    };


    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/account.asp?Action=VerifySyncInfo&ScoutUserID=' + scoutid;
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();

    xhttp.onerror = function() {
        errStatusHandle(500, closeCSVImportReg, [], verifySyncScout, [unitID, denpatrol, regData, scoutid, formPost, councilname]);
    };
}


// check if the adult is already connected to the scout; e.g. is an admin of the unit
// On a new scout, only admins would be initially connected 
// but this routine could get called again if a non-connected parent was updated to have a connection, which defaults a a leader connection
function checkAdminConnectedByName(unitID, denpatrol, scoutid, regData, allowleader, councilname, undoleader) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, closeCSVImportReg, [], checkAdminConnectedByName, [unitID, denpatrol, scoutid, regData, allowleader, councilname, undoleader]);
        }
        if (this.readyState == 4 && this.status == 200) {
            servErrCnt = 0;
            resetLogoutTimer(url);

            //if not connected, see if adult is in the same unit
            var parentid = '';
            var connectionid = [];
            var document = this.response;
            for (var i = 0; i < $('a[href*="ConnectionID"]', document).length; i++) {
                var nrec = [];
                var rec = $('a[href*="ConnectionID"]', document)[i].text.trim().split('\n');
                for (var j = 0; j < rec.length; j++) {
                    if (rec[j].trim() != '') nrec.push(rec[j].trim());
                }
                if (nrec.length == 3) {
                    // Possible that connection is pending
                    //console.log(nrec[0],nrec[2]);

                    if (nameMatch(regData.P1FirstName + ' ' + regData.P1LastName, nrec[0]) == true) {
                        //we have a parent name match
                        //parentid=$('img',rec[j])[0].getAttribute('data-userid');		// don't need I think
                        //get connectionid

                        // maybe look for email match instead

                        if ($('a[href*="ConnectionID"]', document)[i].href.match(/ConnectionID=(\d+)/) == null) {
                            $.mobile.loading('hide');
                            alert('unexpected Error in checkAdminConnectedByName 1');
                            closeCSVImportReg();
                            return;
                        }

                        connectionid.push($('a[href*="ConnectionID"]', document)[i].href.match(/ConnectionID=(\d+)/)[1]);

                    }


                }
                if (nrec.length == 4) {
                    // Possible that connection is pending
                    if (nrec[0] == 'Pending') {
                        //console.log(nrec[1],nrec[3]);
                        if (nameMatch(regData.P1FirstName + ' ' + regData.P1LastName, nrec[1]) == true) {
                            //we have a parent name match
                            //parentid=$('img',rec[j])[0].getAttribute('data-userid');		// don't need I think
                            //get connectionid

                            if ($('a[href*="ConnectionID"]', document)[i].href.match(/ConnectionID=(\d+)/) == null) {
                                $.mobile.loading('hide');
                                alert('unexpected Error in checkAdminConnectedByName 2');
                                closeCSVImportReg();
                                return;
                            }


                            connectionid.push($('a[href*="ConnectionID"]', document)[i].href.match(/ConnectionID=(\d+)/)[1]);

                        }
                    } else {

                        if (nameMatch(regData.P1FirstName + ' ' + regData.P1LastName, nrec[0]) == true) {
                            //we have a parent name match
                            //parentid=$('img',rec[j])[0].getAttribute('data-userid');		// don't need I think
                            //get connectionid

                            // maybe look for email match instead

                            if ($('a[href*="ConnectionID"]', document)[i].href.match(/ConnectionID=(\d+)/) == null) {
                                $.mobile.loading('hide');
                                alert('unexpected Error in checkAdminConnectedByName 1');
                                closeCSVImportReg();
                                return;
                            }

                            connectionid.push($('a[href*="ConnectionID"]', document)[i].href.match(/ConnectionID=(\d+)/)[1]);

                        }

                    }
                }
            }

            if (connectionid.length == 0) {
                // no connected matching adult was found.
                setTimeout(function() {
                    getConnectionsTestParent(unitID, denpatrol, scoutid, regData, councilname);
                }, 500);
            } else {
                // got the adult, must be full control
                //would post as parent/gauridan and adult leader full control
                setTimeout(function() {
                    // Already connected to scout, verify Email be safe to add as a parent.  
                    //addAsParentToScout(unitID,denpatrol,scoutid,regData,connectionid,allowleader,councilname);

                    verifyUnitParentEmail(unitID, denpatrol, scoutid, regData, councilname, connectionid, allowleader, undoleader);
                    // don't have parentid getsendparentinvite(unitID,denpatrol,scoutid,regData,parentid,councilname);  //But this may be better
                }, 500);
            }
        }
    };

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connections.asp?ScoutUserID=' + scoutid + '&UnitID=' + unitID + regData.DenPatrolID; //'&DenID=&PatrolID=';
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();

    xhttp.onerror = function() {
        errStatusHandle(500, closeCSVImportReg, [], checkAdminConnectedByName, [unitID, denpatrol, scoutid, regData, allowleader, councilname, undoleader]);
    };
}



function verifyUnitParentEmail(unitID, denpatrol, scoutid, regData, councilname, connectionid, allowleader, undoleader) {
    // get the profile or something first to verify email address, then we can call this
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, closeCSVImportReg, [], verifyUnitParentEmail, [unitID, denpatrol, scoutid, regData, councilname, connectionid, allowleader, undoleader]);
        }
        if (this.readyState == 4 && this.status == 200) {
            servErrCnt = 0;
            resetLogoutTimer(url);
            //verify the email
            if ($('a[href*="MAILTO"]', this.response).length == 0) {
                if (connectionid.length == 0) {
                    getConnectionsTestParent(unitID, denpatrol, scoutid, regData, councilname);
                    return;
                }
                connectionid.shift();
                verifyUnitParentEmail(unitID, denpatrol, scoutid, regData, councilname, connectionid, allowleader, undoleader);
                return;
            }
            if ($('a[href*="MAILTO"]', this.response)[0].text.trim().toUpperCase() == regData.P1Email1.toUpperCase()) {
                //verified emailm, this IS the right parent		
                var formpost = $('#connectionForm', this.response).serialize();

                //verified emailm, this IS the right parent		
                if (undoleader == true) {
                    formpost = formpost.replace('ConnectionRelationship=Adult+Leader&', '');
                }

                //This is a NEW scout.  shouldn't be added as a MB Counselor.  Just take it out

                formpost = formpost.replace('ConnectionRelationship=Merit+Badge+Counselor&', '');

                addAsParentToScout(unitID, denpatrol, scoutid, regData, connectionid[0], allowleader, councilname, formpost);
            } else {
                if (connectionid.length == 1) {
                    //not sure, just send a new parent account invite
                    getConnectionsTestParent(unitID, denpatrol, scoutid, regData, councilname);
                } else {
                    conectionid.shift();
                    verifyUnitParentEmail(unitID, denpatrol, scoutid, regData, councilname, connectionid, allowleader, undoleader);
                }
            }

        }
    };
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connection.asp?ScoutUserID=' + scoutid + '&ConnectionID=' + connectionid[0] + '&UnitID=' + unitID + regData.DenPatrolID;
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, closeCSVImportReg, [], verifyUnitParentEmail, [unitID, denpatrol, scoutid, regData, councilname, connectionid, allowleader, undoleader]);
    };


}




//check if already in the unit but not connected
//document.querySelectorAll('[data-name]');
function getConnectionsTestParent(unitID, denpatrol, scoutid, regData, councilname) {
    var parentid = '';
    var lkupfirst;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, closeCSVImportReg, [], getConnectionsTestParent, [unitID, denpatrol, scoutid, regData, councilname]);
        }
        if (this.readyState == 4 && this.status == 200) {
            servErrCnt = 0;
            resetLogoutTimer(url);

            var conid = null;
            var tempscout = '';
            var conlist = [];
            var document = this.response;
            var adultList = document.querySelectorAll('[data-name]');
            for (var i = 0; i < adultList.length; i++) {
                //Nickname has preference... weird
                if (regData.P1Nickname != '') {
                    lkupfirst = regData.P1Nickname;
                } else {
                    lkupfirst = regData.P1FirstName;
                }
                if (nameMatch(lkupfirst + ' ' + regData.P1LastName, adultList[i].getAttribute('data-name')) == true) {

                    //var trow=adultList[i].parentElement.parentElement;

                    parentid = adultList[i].getAttribute('data-connecteduserid');

                    //search for this parent in the table
                    var connectionList = document.querySelectorAll('[data-connecteduserid]');
                    for (var j = 0; j < connectionList.length; j++) {
                        if (connectionList[j].getAttribute('data-connecteduserid') == parentid) {
                            conid = connectionList[j].getAttribute('data-connectionid');

                            //don't care which scout's connection, we just need to look at it to verify te adult email
                            if (conid != null && conid != '') {
                                tempscout = connectionList[j].getAttribute('data-userid');
                                break;
                            }
                        }
                    }
                    if (conid != null && conid != '') {
                        conlist.push({
                            conid: conid,
                            parentid: parentid,
                            tempscout: tempscout
                        });
                        //break;
                    }

                }
            }


            if (conlist.length == 0) {
                //parent not found here...
                setTimeout(function() {
                    //do a lookup to find;
                    //  9/15 night out searchForParentByEmail(unitID,denpatrol,scoutid,regData,councilname);
                    getsendNewParentAcctInvite(unitID, denpatrol, scoutid, regData, councilname);
                }, 500);
            } else {
                setTimeout(function() {
                    //add this parent id as the connection.. how... by updating this page (get the CSRF)
                    verifyParentEmail(unitID, denpatrol, scoutid, regData, councilname, conlist);
                }, 500);
            }
        }
    };
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connectionsmanager.asp?UnitID=' + unitID;
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, closeCSVImportReg, [], getConnectionsTestParent, [unitID, denpatrol, scoutid, regData, councilname]);
    };

}

function verifyParentEmail(unitID, denpatrol, scoutid, regData, councilname, conlist) {
    // get the profile or something first to verify email address, then we can call this
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, closeCSVImportReg, [], verifyParentEmail, [unitID, denpatrol, scoutid, regData, councilname, conlist]);
        }
        if (this.readyState == 4 && this.status == 200) {
            servErrCnt = 0;
            resetLogoutTimer(url);
            //verify the email

            if ($('a[href*="MAILTO"]', this.response).length == 0) {
                // can't verify, no more conlist items to check.  Time to invite
                if (conlist.length == 1) {
                    getsendNewParentAcctInvite(unitID, denpatrol, scoutid, regData, councilname)
                    return;
                }
                conlist.shift();
                verifyParentEmail(unitID, denpatrol, scoutid, regData, councilname, conlist)
                return;
            }

            if ($('a[href*="MAILTO"]', this.response)[0].text.trim().toUpperCase() == regData.P1Email1.toUpperCase()) {
                //verified emailm, this IS the right parent	

                updatescoutconnection(unitID, denpatrol, scoutid, regData, conlist[0].parentid, councilname);
            } else {
                if (conlist.length == 1) {
                    //email did not match, just send a new parent account invite...  I think this should be an error, don't continue.
                    //alert('Error - Scout ' + regData.FirstName +  ' ' + regData.LastName + ' parent and/or another adult named ' + regData.P1FirstName + ' ' + regData.P1LastName + ' already has an account with a different email ' + $('a[href*="MAILTO"]',this.response)[0].text.trim()  + ' instead of the email submitted ' + regData.P1Email1 + '  so the requested connection was not made');

                    //nextParent(unitID,denpatrol,scoutid,regData,councilname);
                    getsendNewParentAcctInvite(unitID, denpatrol, scoutid, regData, councilname);
                } else {
                    conlist.shift();
                    verifyParentEmail(unitID, denpatrol, scoutid, regData, councilname, conlist)
                }
            }

        }
    };
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connection.asp?ScoutUserID=' + conlist[0].tempscout + '&ConnectionID=' + conlist[0].conid + '&UnitID=' + unitID + '&DenID=&PatrolID=';
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, closeCSVImportReg, [], verifyParentEmail, [unitID, denpatrol, scoutid, regData, councilname, conlist]);
    };


}

function nameMatch(name1, name2) {
    if (name1.toUpperCase().trim() == name2.toUpperCase().trim()) {
        return true;
    }
    return false;

}


/*
// Look at responses for an adult in the same council.  May be more than one. If match but not in council, display choices
function searchForParentByEmail(unitID,denpatrol,scoutid,regData,councilname) {
	var parentid='';
	var narrow=[];
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			servErrCnt=0;
			resetLogoutTimer(url);
			
			//var CSRF=$('input[name="CSRF"]',this.response).val();
			var adultmatches=JSON.parse(this.response);
			if(adultmatches.length ==0 ) {
				// no matches found AT ALL.  Invite new parent
				getsendNewParentAcctInvite(unitID,denpatrol,scoutid,regData,councilname);
			} else {
				//for(var i=0;i<adultmatches.length;i++) {
					// does it match the scout's council... gee, need the council name
					//if(adultmatches[i].positions.indexOf(councilname)!=-1) {
				//		narrow.push(adultmatches[i]);
					//}
				//}
				manualParentMatch(unitID,denpatrol,scoutid,regData,councilname,'in',adultmatches);
				//if(narrow.length==1) {
					//this is the person, most likely, there is only once person in the council with this name
				//	parentid=narrow[0].userID;
				//	getsendparentinvite(unitID,denpatrol,scoutid,regData,parentid,councilname);
				//} else {
					//if(narrow.length >1) {
						//more than one in council, which is it?
						//alert('stub handle more than one match in a council');
						//manualParentMatch(unitID,denpatrol,scoutid,regData,councilname,'in',adultmatches);
					//} else {
						//no council matches at all.
						//alert('stub All matches are outside scouts council');
						//manualParentMatch(unitID,denpatrol,scoutid,regData,councilname,'out',adultmatches);
					//}
				//}
			}
		}
	};
   var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connectioninvite.asp?ScoutUserID='+scoutid;
   var formPost='Action=SearchUsers&UserSearch=' + encodeURIComponent(regData.P1FirstName + ' ' + regData.P1LastName).replace(/%20/g,'+');

   xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formPost);
			
	xhttp.onerror = function() {
		 if (servErrCnt > maxErr) {
			 $.mobile.loading('hide');
			alert('Halted due to excessive Server errors');
			closeCSVImportReg();
			return;
		 }
		 servErrCnt++;
		// mbArrPtr=errmbArrPtr;
		setTimeout(function() {searchForParentByEmail(unitID,denpatrol,scoutid,regData,councilname);},1000);
			//window.console &&console.log("error getting scoutlist " + xhttp.status);
			//alert('error sending');
	};
}

*/
//if parentid is defined, do not include emails, 

/*
function sendparentinvite(unitID,denpatrol,scoutid,regData,parentid,councilname,CSRF) {
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			servErrCnt=0;
			resetLogoutTimer(url);
			
			if (this.response.indexOf('Invite sent!') != -1 ) {
				alert('Halted due to error sending invite 1');
				closeCSVImportReg();	
				return;
			}
			
			// now we n
			// already defined, just invited? getNewParentConnectionID(unitID,denpatrol,scoutid,regData,councilname);
			setTimeout(function () {
				nextParent(unitID,denpatrol,scoutid,regData,councilname);
			},1000);
		}
	};
	
   //var msg='batch invite test';	
   var msg=encodeURIComponent(regData.P1PersonalMessage).replace(/%20/g,'+');
   var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connectioninvite.asp?ScoutUserID='+scoutid;
   var formPost='Action=Submit&CSRF='+CSRF+'AdultUserID='+parentid+'&ConnectionFirstName=&ConnectionLastName=&ConnectionEmail=&ConnectionEmail2=&ConnectionRelationship=Parent%2FGuardian&PermissionFullControl=on&PersonalMessage='+msg;

   xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formPost);
			
	xhttp.onerror = function() {
		 if (servErrCnt > maxErr) {
			 $.mobile.loading('hide');
			alert('Halted due to excessive Server errors');
			closeCSVImportReg();
			return;
		 }
		 servErrCnt++;
		// mbArrPtr=errmbArrPtr;
		setTimeout(function() {sendparentinvite(unitID,denpatrol,scoutid,regData,parentid,councilname,CSRF);},1000);
	};
}
*/

// this parent does not have a parentid, not found in scoutbook IN THE UNIT.  Might be there in another unit though OR they took YPT OR they used the online App process to get a BSA ID...  maybe find out by searching by email, then verifying the name?


/*
https://www.scoutbook.com/mobile/dashboard/admin/connectioninvite.asp?ScoutuserID=10231071
POST
formPost=UserSearch=denise.broz%40gmail.com&Action=SearchUsers

response
[ { "firstname": "Denise", "name": "Denise Broz", "userID": 685976, "image": "/images/icons/no_avatar.png", "positions": "Troop 194 Roselle IL Three Fires Council" } ]

then

https://qa.scoutbook.com/mobile/dashboard/admin/connectioninvite.asp?ScoutUserID=746093&UnitID=31097

Action: Submit
CSRF: 219ADD6885
AdultUserID: 731690
ConnectionFirstName: 
ConnectionLastName: 
ConnectionEmail: 
ConnectionEmail2: 
ConnectionRelationship: Parent/Guardian
PersonalMessage: Hi! An account for you has been created in Scoutbook so you can review your Scout's advancements. Please log in using the credentials and temporary password you see in this email.  If you have any questions give me a call or email me.  Scoutbook assistance can be found at http://help.scoutbook.com .

Action=Submit&CSRF=219ADD6885&AdultUserID=731690&ConnectionFirstName=&ConnectionLastName=&ConnectionEmail=&ConnectionEmail2=&ConnectionRelationship=Parent%2FGuardian&PersonalMessage=Hi!+An+account+for+you+has+been+created+in+Scoutbook+so+you+can+review+your+Scout's+advancements.+Please+log+in+using+the+credentials+and+temporary+password+you+see+in+this+email.++If+you+have+any+questions+give+me+a+call+or+email+me.++Scoutbook+assistance+can+be+found+at+http%3A%2F%2Fhelp.scoutbook.com+.


*/

function searchForParentByEmail(unitID, denpatrol, scoutid, regData, councilname, CSRF) {
    var parentid = '';
    var narrow = [];
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            servErrCnt = 0;
            resetLogoutTimer(url);

            var adultmatches = JSON.parse(this.response);
            if (adultmatches.length == 0) {
                // no matches found AT ALL. for the given email.  Invite new parent or maybe check for a name match yuk no, not good because jim jones may have dozens of responses
                sendNewParentAcctInvite(unitID, denpatrol, scoutid, regData, councilname, CSRF);
            } else {
                if (nameMatch(adultmatches[0].name, regData.P1FirstName + ' ' + regData.P1LastName) == true) {
                    //we have a match
                    parentid = adultmatches[0].userID;
                    sendNewParentExistAcctInvite(unitID, denpatrol, scoutid, regData, councilname, CSRF, parentid);
                } else {
                    //email matches but not name
                    alert('An account in the system with the email for ' + regData.P1FirstName + ' ' + regData.P1LastName + ' was found, but the name on the account is ' + adultmatches[0].name + '.  You will need to invite this parent by manually adding a connection');
                    //sendNewParentAcctInvite(unitID,denpatrol,scoutid,regData,councilname,CSRF);
                    nextParent(unitID, denpatrol, scoutid, regData, councilname);
                }
            }
        }
    };
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connectioninvite.asp?ScoutUserID=' + scoutid;
    var formPost = 'Action=SearchUsers&UserSearch=' + encodeURIComponent(regData.P1Email1).replace(/%20/g, '+');

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(formPost);

    xhttp.onerror = function() {
        if (servErrCnt > maxErr) {
            $.mobile.loading('hide');
            alert('Halted due to excessive Server errors');
            closeCSVImportReg();
            return;
        }
        servErrCnt++;
        // mbArrPtr=errmbArrPtr;
        setTimeout(function() {
            searchForParentByEmail(unitID, denpatrol, scoutid, regData, councilname, CSRF);
        }, 1000);
        //window.console &&console.log("error getting scoutlist " + xhttp.status);
        //alert('error sending');
    };
}

function sendNewParentExistAcctInvite(unitID, denpatrol, scoutid, regData, councilname, CSRF, parentid) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, closeCSVImportReg, [], sendNewParentAcctInvite, [unitID, denpatrol, scoutid, regData, councilname, CSRF]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            if (this.response.indexOf('Invitation Sent!') == -1) {
                alert('Halted due to error sending invite Scout ' + regData.FirstName + ' ' + regData.LastName + ' parent  ' + regData.P1FirstName + ' ' + regData.P1LastName + ' may have a different name with the same the requested email ' + regData.P1Email1 + '.  The parent connection was not made to avoid problems. ');
                nextParent(unitID, denpatrol, scoutid, regData, councilname);
                //closeCSVImportReg();	
                return;
            }
            // go edit the adult's account. 

            setTimeout(function() {
                getUpdateParentProfile(unitID, denpatrol, scoutid, regData, councilname, parentid, true)
            }, 1000);
        }
    };

    //var msg='batch invite test';	
    var msg = encodeURIComponent(regData.P1PersonalMessage).replace(/%20/g, '+');
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connectioninvite.asp?ScoutUserID=' + scoutid;

    var formPost = 'Action=Submit';
    formPost += '&CSRF=' + CSRF;
    formPost += '&AdultUserID=' + parentid;
    formPost += '&ConnectionFirstName=';
    formPost += '&ConnectionLastName=';
    formPost += '&ConnectionEmail=';
    formPost += '&ConnectionEmail2=';
    formPost += '&ConnectionRelationship=Parent%2FGuardian';
    formPost += '&PersonalMessage=' + msg;

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(formPost);

    xhttp.onerror = function() {
        errStatusHandle(500, closeCSVImportReg, [], sendNewParentExistAcctInvite, [unitID, denpatrol, scoutid, regData, councilname, CSRF, parentid]);
    };
}


function sendNewParentAcctInvite(unitID, denpatrol, scoutid, regData, councilname, CSRF) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, closeCSVImportReg, [], sendNewParentAcctInvite, [unitID, denpatrol, scoutid, regData, councilname, CSRF]);
        }
        if (this.readyState == 4 && this.status == 200) {
            resetLogoutTimer(url);
            servErrCnt = 0;

            if (this.response.indexOf('Invitation Sent!') == -1) {
                alert('Halted due to error sending invite Scout ' + regData.FirstName + ' ' + regData.LastName + ' parent  ' + regData.P1FirstName + ' ' + regData.P1LastName + ' may have a different name with the same the requested email ' + regData.P1Email1 + '.  The parent connection was not made to avoid problems. ');
                nextParent(unitID, denpatrol, scoutid, regData, councilname);
                //closeCSVImportReg();	
                return;
            }
            // go edit the adult's account.  But, have to find the adult's id first
            // to get there, go to scouts account page and find the name
            setTimeout(function() {
                getNewParentConnectionID(unitID, denpatrol, scoutid, regData, councilname);
            }, 1000);
        }
    };

    //var msg='batch invite test';	
    var msg = encodeURIComponent(regData.P1PersonalMessage).replace(/%20/g, '+');
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connectioninvite.asp?ScoutUserID=' + scoutid;
    var formPost = 'Action=Submit';
    formPost += '&CSRF=' + CSRF;
    formPost += '&Gender=' + regData.P1Gender;
    formPost += '&AdultUserID=';
    formPost += '&ConnectionFirstName=' + encodeURIComponent(regData.P1FirstName).replace(/%20/g, '+');
    formPost += '&ConnectionLastName=' + encodeURIComponent(regData.P1LastName).replace(/%20/g, '+');
    formPost += '&ConnectionEmail=' + encodeURIComponent(regData.P1Email1);
    formPost += '&ConnectionEmail2=' + encodeURIComponent(regData.P1Email2);
    formPost += '&ConnectionRelationship=Parent%2FGuardian';
    //	formPost += '&PermissionFullControl=on&';
    formPost += '&PersonalMessage=' + msg;

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(formPost);

    xhttp.onerror = function() {
        errStatusHandle(500, closeCSVImportReg, [], sendNewParentAcctInvite, [unitID, denpatrol, scoutid, regData, councilname, CSRF]);
    };
}


function getNewParentConnectionID(unitID, denpatrol, scoutid, regData, councilname) {
    var found = false;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, closeCSVImportReg, [], getNewParentConnectionID, [unitID, denpatrol, scoutid, regData, councilname]);
        }
        if (this.readyState == 4 && this.status == 200) {
            servErrCnt = 0;
            //console.log('getNewParentConnectionID response');
            resetLogoutTimer(url);
            var document = this.response;
            for (var i = 0; i < $('a[href*="ConnectionID"]', document).length; i++) {
                if (nameMatch(regData.P1Nickname + ' ' + regData.P1LastName, $('a[href*="ConnectionID"]', document)[i].text.trim()) == true) {

                    if ($('a[href*="ConnectionID"]', document)[i].href.match(/ConnectionID=(\d+)/) == null) {
                        $.mobile.loading('hide');
                        alert('Unexpected error in getNewParentConnectionID 1');
                        closeCSVImportReg();
                        return;

                    }

                    var connectionid = $('a[href*="ConnectionID"]', document)[i].href.match(/ConnectionID=(\d+)/)[1];
                    //do a get to find adult id to edit profile? 
                    found = true;
                    setTimeout(function() {
                        getParentIDFromConnection(unitID, denpatrol, scoutid, regData, councilname, connectionid);
                    }, 500);
                }
            }
            if (found == false) {
                for (var i = 0; i < $('a[href*="ConnectionID"]', document).length; i++) {
                    if (nameMatch(regData.P1FirstName + ' ' + regData.P1LastName, $('a[href*="ConnectionID"]', document)[i].text.trim()) == true) {

                        if ($('a[href*="ConnectionID"]', document)[i].href.match(/ConnectionID=(\d+)/) == null) {
                            $.mobile.loading('hide');
                            alert('Unexpected error in getNewParentConnectionID 2');
                            closeCSVImportReg();
                            return;

                        }




                        var connectionid = $('a[href*="ConnectionID"]', document)[i].href.match(/ConnectionID=(\d+)/)[1];

                        setTimeout(function() {
                            getParentIDFromConnection(unitID, denpatrol, scoutid, regData, councilname, connectionid);
                        }, 500);
                        return;
                    } //its possible that the original account does not have a Nickname.
                }
            }
            // this is an error case; probably Nickname mismatch
            // match on teh last name.  View connection asps of all lastname matches to find one that has an email match.  Crazy.  However; if there IS a Nickname mismatch
            // we know an account already exists, so....  no bother continuing on to edit the profile
            nextParent(unitID, denpatrol, scoutid, regData, councilname);


        }
    };
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/account.asp?UnitID=' + unitID + '&DenID=&PatrolID=&ScoutUserID=' + scoutid;
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, closeCSVImportReg, [], getNewParentConnectionID, [unitID, denpatrol, scoutid, regData, councilname]);
    };
}


function getParentIDFromConnection(unitID, denpatrol, scoutid, regData, councilname, connectionID) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, closeCSVImportReg, [], getParentIDFromConnection, [unitID, denpatrol, scoutid, regData, councilname, connectionID]);
        }
        if (this.readyState == 4 && this.status == 200) {
            servErrCnt = 0;
            //console.log('getParentIDFromConnection response');
            resetLogoutTimer(url);
            if ($('a[href*="editprofile.asp"]', this.response).length == 0) {
                alert('Could not update new parent profile for ' + regData.P1FirstName + ' ' + regData.P1LastName);
                setTimeout(function() {
                    nextParent(unitID, denpatrol, scoutid, regData, councilname);
                }, 200);
                return;
            }

            if ($('a[href*="editprofile.asp"]', this.response)[0].href.match(/AdultUserID=(\d+)/) == null) {
                $.mobile.loading('hide');
                alert('Unexpected error in getParentIDFromConnection');
                closeCSVImportReg();
                return;

            }



            var parentid = $('a[href*="editprofile.asp"]', this.response)[0].href.match(/AdultUserID=(\d+)/)[1];
            setTimeout(function() {
                //edit the parent profile
                getUpdateParentProfile(unitID, denpatrol, scoutid, regData, councilname, parentid, false);
            }, 500);

        }
    };

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connection.asp?ScoutUserID=' + scoutid + '&ConnectionID=' + connectionID + '&UnitID=' + unitID + regData.DenPatrolID;
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, closeCSVImportReg, [], getParentIDFromConnection, [unitID, denpatrol, scoutid, regData, councilname, connectionID]);
    };
}


/* now we have to decide if we really want to update the Profile, because it may already exist
How would we know?  If any 
address 
middlename
suffixe
Nickname
bsamemberid

was filled in, it existed

*/
function getUpdateParentProfile(unitID, denpatrol, scoutid, regData, councilname, parentid, exist) {


    if (exist == true) {
        nextParent(unitID, denpatrol, scoutid, regData, councilname);
        return;
    }


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, closeCSVImportReg, [], getUpdateParentProfile, [unitID, denpatrol, scoutid, regData, councilname, parentid, exist]);
        }
        if (this.readyState == 4 && this.status == 200) {
            servErrCnt = 0;
            resetLogoutTimer(url);

            // modify formPost
            var formPost = $('#editProfileForm', this.response).serialize();

            if (formPost == '') {
                alert('Could not update parent profile for ' + regData.P1FirstName + ' ' + regData.P1LastName);
                setTimeout(function() {
                    nextParent(unitID, denpatrol, scoutid, regData, councilname);
                }, 500);
                return;
            }


            if (getToken(formPost, 'Address1') != '' || getToken(formPost, 'Nickname') != '' || getToken(formPost, 'Suffix') != '' || getToken(formPost, 'HomePhone') != '' || getToken(formPost, 'MobilePhone') != '' || getToken(formPost, 'WorkPhone') != '') {
                nextParent(unitID, denpatrol, scoutid, regData, councilname);
                return;
            }

            formPost = tokenVal(formPost, 'MiddleName', encodeURIComponent(regData.P1MiddleName).replace(/%20/g, '+'));
            formPost = tokenVal(formPost, 'Suffix', encodeURIComponent(regData.P1Suffix).replace(/%20/g, '+'));
            formPost = tokenVal(formPost, 'Nickname', encodeURIComponent(regData.P1Nickname).replace(/%20/g, '+'));
            if (regData.P1Address1 == '') {
                formPost = tokenVal(formPost, 'Address1', encodeURIComponent(regData.Address1).replace(/%20/g, '+'));
            } else {
                formPost = tokenVal(formPost, 'Address1', encodeURIComponent(regData.P1Address1).replace(/%20/g, '+'));
            }
            if (regData.P1Address2 == '') {
                formPost = tokenVal(formPost, 'Address2', encodeURIComponent(regData.Address2).replace(/%20/g, '+'));
            } else {
                formPost = tokenVal(formPost, 'Address2', encodeURIComponent(regData.P1Address2).replace(/%20/g, '+'));
            }
            if (regData.P1City == '') {
                formPost = tokenVal(formPost, 'City', encodeURIComponent(regData.City).replace(/%20/g, '+'));
            } else {
                formPost = tokenVal(formPost, 'City', encodeURIComponent(regData.P1City).replace(/%20/g, '+'));
            }
            if (regData.P1State == '') {
                formPost = tokenVal(formPost, 'State', regData.State);
            } else {
                formPost = tokenVal(formPost, 'State', regData.P1State);
            }
            if (regData.P1Zip == '') {
                formPost = tokenVal(formPost, 'Zip', regData.Zip);
            } else {
                formPost = tokenVal(formPost, 'Zip', regData.P1Zip);
            }
            if (regData.P1HomePhone == '') {
                formPost = tokenVal(formPost, 'HomePhone', regData.HomePhone);
            } else {
                formPost = tokenVal(formPost, 'HomePhone', regData.P1HomePhone);
            }
            formPost = tokenVal(formPost, 'WorkPhone', regData.P1WorkPhone);
            if (regData.P1MobilePhone == '') {
                formPost = tokenVal(formPost, 'MobilePhone', regData.MobilePhone);
            } else {
                formPost = tokenVal(formPost, 'MobilePhone', regData.P1MobilePhone);
            }

            var initBSAnum = getToken(formPost, 'BSAMemberID');

            if (initBSAnum == '') {
                if (regData.P1BSAMemberID != '') {
                    formPost = tokenVal(formPost, 'BSAMemberID', regData.P1BSAMemberID);
                    //formPost=tokenVal(formPost,'BSAMemberIDConfirm',regData.P1BSAMemberID);  //?????  does this get set if num changes?
                }
            } else {
                if (initBSAnum != regData.P1BSAMemberID) {
                    if (regData.P1BSAMemberID != '') {
                        formPost = tokenVal(formPost, 'BSAMemberID', regData.P1BSAMemberID);
                        //formPost=tokenVal(formPost,'BSAMemberIDConfirm',regData.P1BSAMemberID);  //?????	
                    }
                }

            }

            if (getToken(formPost, 'CouncilID') == '') {
                formPost = tokenVal(formPost, 'CouncilID', regData.CouncilID);
            }

            if (getToken(formPost, 'DistrictID') == '') {
                if (getToken(formPost, 'CouncilID') == regData.CouncilID) {
                    formPost = tokenVal(formPost, 'DistrictID', regData.DistrictID);
                }

            }
            setTimeout(function() {
                //edit the parent profile
                postUpdateParentProfile(unitID, denpatrol, scoutid, regData, councilname, parentid, formPost);
            }, 500);

        }
    };
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/editprofile.asp?AdultUserID=' + parentid + '&UnitID=' + unitID + '&DenID=&PatrolID=';
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, closeCSVImportReg, [], getUpdateParentProfile, [unitID, denpatrol, scoutid, regData, councilname, parentid, exist]);
    };

}

function postUpdateParentProfile(unitID, denpatrol, scoutid, regData, councilname, parentid, formPost) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, closeCSVImportReg, [], postUpdateParentProfile, [unitID, denpatrol, scoutid, regData, councilname, parentid, formPost]);
        }
        if (this.readyState == 4 && this.status == 200) {
            servErrCnt = 0;
            resetLogoutTimer(url);

            if (this.response.indexOf('Update successful!') == -1) {

                if (this.response.indexOf('If this is a new BSA #') != -1) {
                    formPost = formPost.replace(/BSAMemberIDConfirm=\d*&/, 'BSAMemberIDConfirm=1&');

                    setTimeout(function() {
                        postUpdateParentProfile(unitID, denpatrol, scoutid, regData, councilname, parentid, formPost);
                    }, 500);
                    return;
                }


                //got an error.  
                var derr = '';
                var errmsg = this.response.match(/showErrorPopup\(([^\)]+)/);
                if (errmsg != null) {
                    derr = errmsg[1].replace(/<strong>|<\/strong>|<p>|<\/p>/g, '');
                }
                alert('Halted due to parent profile update error ' + derr + ' Stopped on ' + getToken(formPost, 'FirstName') + ' ' + getToken(formPost, 'LastName'));
                closeCSVImportReg();
                return;
            }

            setTimeout(function() {
                nextParent(unitID, denpatrol, scoutid, regData, councilname);
            }, 500);
        }
    };


    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/editprofile.asp?ScoutUserID=&AdultUserID=' + parentid + '&UnitID=' + unitID;
    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(formPost);

    xhttp.onerror = function() {
        errStatusHandle(500, closeCSVImportReg, [], postUpdateParentProfile, [unitID, denpatrol, scoutid, regData, councilname, parentid, formPost]);
    };

}

//updates an existing connection to add as parent
//if allowleader is true, the Adult Leader connection should be posted.  Otherwise, it should be removed
function addAsParentToScout(unitID, denpatrol, scoutid, regData, connectionid, allowleader, councilname, formpost) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, closeCSVImportReg, [], addAsParentToScout, [unitID, denpatrol, scoutid, regData, connectionid, allowleader, councilname, formpost]);
        }
        if (this.readyState == 4 && this.status == 200) {
            servErrCnt = 0;
            resetLogoutTimer(url);

            if (this.response.indexOf(".mobile.changePage('connections.asp?ScoutUserID=") == -1) {
                alert('Halted due to error setting connection to parent');
                closeCSVImportReg();
                return;
            }
            //next scout	
            setTimeout(function() {
                //nextparent
                nextParent(unitID, denpatrol, scoutid, regData, councilname);

            }, 500);
        }
    };

    var leader = '';
    if (allowleader == true) leader = '&ConnectionRelationship=Adult+Leader';

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connection.asp?ScoutUserID=' + scoutid + '&ConnectionID=' + connectionid + '&UnitID=' + unitID + regData.DenPatrolID; //'&DenID=&PatrolID=';
    var formPost = 'Action=Submit&ConnectionRelationship=Parent%2FGuardian' + leader + '&PermissionFullControl=on';

    if (formpost.match(/Guardian/) == null) {
        var formPost = formpost.replace('Action=Submit&', 'Action=Submit&ConnectionRelationship=Parent%2FGuardian&');
    } else {
        var formPost = formpost;
    }


    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(formPost);

    xhttp.onerror = function() {
        errStatusHandle(500, closeCSVImportReg, [], addAsParentToScout, [unitID, denpatrol, scoutid, regData, connectionid, allowleader, councilname, formpost]);
    };
}

function nextParent(unitID, denpatrol, scoutid, regData, councilname) {
    if (regData.AddParent2 == 'yes') {
        //copy data over
        //for(i=21;i<40;i++) {
        //	regData[i]=regData[i+19];
        //}
        for (var propt in regData) {
            if (propt.slice(0, 2) == 'P1') {
                regData[propt] = regData['P2' + propt.slice(2)];
                //alert(propt + ': ' + regData[propt]);
            }
        }

        regData.AddParent1 = regData.AddParent2;
        //reg[40]='no';
        regData.AddParent2 = 'no'


        var undoleader = false; //not needed here
        checkAdminConnectedByName(unitID, denpatrol, scoutid, regData, true, councilname, undoleader);
    } else {
        addScout(unitID, denpatrol);
    }
}

function updatescoutconnection(unitID, denpatrol, scoutid, regData, parentid, councilname) {
    // Then , go back to the scout connection page because they are now a connected leader and need to be added as a parent.
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, closeCSVImportReg, [], updatescoutconnection, [unitID, denpatrol, scoutid, regData, parentid, councilname]);
        }
        if (this.readyState == 4 && this.status == 200) {
            servErrCnt = 0;
            resetLogoutTimer(url);


            if (this.response.indexOf(".attr('data-connectionid',") == -1) {
                alert('Halted due to error setting connectionmanager to parent');
                closeCSVImportReg();
                return;
            }

            setTimeout(function() {
                var undoleader = true; //adding a connection in connection manager defalts to a leader so we need to fix it
                checkAdminConnectedByName(unitID, denpatrol, scoutid, regData, false, councilname, undoleader); //will call addAsParentToScout(unitID,denpatrol,scoutid,regData,connectionid);
            }, 500);
        }
    };

    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connectionsmanager.asp?Action=UpdateConnection&UnitID=' + unitID + regData.DenPatrolID; //'&DenID=&PatrolID=';
    var formPost = 'PermissionID=3&ConnectionID=&UserID=' + scoutid + '&ConnectedUserID=' + parentid;

    xhttp.open("POST", url, true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(formPost);

    xhttp.onerror = function() {
        errStatusHandle(500, closeCSVImportReg, [], updatescoutconnection, [unitID, denpatrol, scoutid, regData, parentid, councilname]);
    };
}

// need to present user with search choices
var globunitID;
var globdenpatrol;
var globscoutid;
var globregData;
var globcouncilname;
var globadultlist = [];

/*
function manualParentMatch(unitID,denpatrol,scoutid,regData,councilname,inout,adultmatches) {

$('#importErrRegLI').text('Please select the parent for ' +regData.FirstName + ' '+ regData.LastName);

	adultmatches.push({firstname: 'new',name: 'None of the Adults listed are correct. Select this option to create a NEW account for this adult',userID: 'none',positions:'',image: '/images/icons/addscoutorange48.png'});
	adultmatches.push({firstname: 'skip',name: 'None of the Adults listed are correct. Adult has Scoutbook Account but is not listed',userID: 'skip',positions:'',image: '/images/icons/back100bsa.png'});
	var $ul =$('#userSearch'),html = "";
	$ul.html( "" );
	$ul.html( "<li class='ui-icon-alt'><div class='ui-loader'><span class='ui-icon ui-icon-loading'></span></div></li>" );
	$ul.listview( "refresh" );
	for(var i=0;i<adultmatches.length;i++) {
		html += "<li data-theme='d' class='ui-icon-alt'><a href='#' data-firstname='" + adultmatches[i].firstname + "' data-name='" + adultmatches[i].name+ "' data-userid='" +  adultmatches[i].userID + "' class='selectUser' >";
		html += "	<div style='float: left; width: 30px; position: relative; '>";
		html += "		<img src='https://d3hdyt7ugiz6do.cloudfront.net" + adultmatches[i].image + "' class='imageSmall profilePopup' data-userid='" + adultmatches[i].userID + "' />";
		html += "	</div>";
		html += "	<div style='margin-left: 36px; '>";
		html += "		" + adultmatches[i].name;
		html += "		<div class='label permissions noellipsis'>" + adultmatches[i].positions + "&nbsp;</div>";
		html += "	</div>";
		html += "</a></li>";
	}
	$ul.html( html );
	$ul.listview('refresh');
	$ul.trigger('updatelayout');
						
	// when an option is clicked, results will be sent on, but YUCK I need to get data across too

globunitID=unitID; 
globdenpatrol=denpatrol; 
globscoutid=scoutid; 
globregData=regData; 
globcouncilname=councilname; 
globadultlist=adultmatches;

$.mobile.loading('hide');

}
*/

/*
function parentOptionSelected(parentid) {
	$.mobile.loading('show', { theme: 'a', text: 'loading...this can take several minutes for large units', textonly: false });
	
	var $ul =$('#userSearch'),html = "";
	//clear the popup
	$ul.html( '' );
	$ul.listview('refresh');
	$ul.trigger('updatelayout');
	$('#importErrRegLI').text('');
	
	var unitID=globunitID; 
	var denpatrol=globdenpatrol; 
	var scoutid=globscoutid; 
	var regData=globregData; 
	var councilname=globcouncilname; 
		

	globunitID=''; 
	globdenpatrol=''; 
	globscoutid=''; 
	globregData=[]; 
	globcouncilname=''; 
	globadultlist=[];
	
	// now back to business
	
	if(parentid=='none') {
		// Need to ADD new adult account
		getsendNewParentAcctInvite(unitID,denpatrol,scoutid,regData,councilname);
	} else {
		if(parentid!='skip'){
		// need to add connection
			getsendparentinvite(unitID,denpatrol,scoutid,regData,parentid,councilname);
		} else {
						
				nextParent(unitID,denpatrol,scoutid,regData,councilname);
			
		}
	}
}
*/


function getsendNewParentAcctInvite(unitID, denpatrol, scoutid, regData, councilname) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status != 200) {
            errStatusHandle(this.status, closeCSVImportReg, [], getsendNewParentAcctInvite, [unitID, denpatrol, scoutid, regData, councilname]);
        }
        if (this.readyState == 4 && this.status == 200) {
            servErrCnt = 0;
            resetLogoutTimer(url);

            if ($('input[name="CSRF"]', this.response).length == 0) {
                alert('Halted due to connection invite errors 1');
                closeCSVImportReg();
            }
            var CSRF = $('input[name="CSRF"]', this.response).val();
            setTimeout(function() {
                searchForParentByEmail(unitID, denpatrol, scoutid, regData, councilname, CSRF);
            }, 500);

        }
    };
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connectioninvite.asp?ScoutUserID=' + scoutid + '&UnitID=' + unitID + '&DenID=&PatrolID=';
    xhttp.open("GET", url, true);
    xhttp.responseType = "document";
    xhttp.send();
    xhttp.onerror = function() {
        errStatusHandle(500, closeCSVImportReg, [], getsendNewParentAcctInvite, [unitID, denpatrol, scoutid, regData, councilname]);
    };
}

/*
function getsendparentinvite(unitID,denpatrol,scoutid,regData,parentid,councilname) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			servErrCnt=0;
			resetLogoutTimer(url);	
				var CSRF=$('input[name="CSRF"]',this.response).val();
				if(CSRF==undefined) {
					alert('Halted due to connection invite errors 2');
					closeCSVImportReg();				
				}
				setTimeout(function () {
					sendparentinvite(unitID,denpatrol,scoutid,regData,parentid,councilname,CSRF);
				},500);						
	
		}
	};
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/admin/connectioninvite.asp?ScoutUserID=' + scoutid+ '&UnitID=' + unitID +'&DenID=&PatrolID=';
	xhttp.open("GET", url, true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		if (servErrCnt > maxErr) {
			 $.mobile.loading('hide');
			alert('Halted due to excessive Server errors');
			closeCSVImportReg();
			return;
		 }
		 servErrCnt++;
		// mbArrPtr=errmbArrPtr;
		setTimeout(function() {getsendparentinvite(unitID,denpatrol,scoutid,regData,parentid,councilname);},1000);
	};
}
*/