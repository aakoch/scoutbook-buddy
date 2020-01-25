// Copyright © 2/14/2018 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.


// If TWO Scouts in Roster with same name, skip


function addRawParentPopup(data,pageid,unitID){			
			data=data.replace(/home<\/a>/g,'home');
			//var isAdmin =false;
			//for(var i=0;i<myPositions.length;i++) {
			//	if (myPositions[i].position.match(/(Pack|Troop|Crew) Admin/) != null) {
			//		isAdmin=true;
			//		break;
			//	}
			//}
			
			//if isAdmin == false) {
			//	return data;
			//}
			
			var startfunc1 = data.indexOf('Connections Manager');
			if(startfunc1 == -1) {
				return data;
			}
			
			
			var startfunc = data.indexOf('</ul>',startfunc1);
			var menuopt='';
			menuopt += ' <li class="ui-icon-alt">';


			menuopt += '	<a href="#importParentPopup" data-rel="popup" data-transition="slideup">';
			menuopt += '		<div>Import Parent CSV</div>';
			menuopt += '	</a>';

			menuopt += ' </li>';
			
			var newdata = data.slice(0,startfunc) + menuopt + data.slice(startfunc);
			data=newdata;
	

			var startfunc = data.indexOf('<div id="footer"');
			//newdata = '<div data-role="popup" id="profilePopup" data-overlay-theme="a" data-theme="c" data-transition="fade" data-history="false" class="ui-corner-all"></div>';
			newdata = '	<div data-role="popup" id="importParentPopup" data-dismissible="false" data-theme="d" data-history="false">';
			
			newdata +=			'<ul data-role="listview" data-inset="true" style="min-width: 600px;" data-theme="d" >';  //class="ui-icon-alt"
			newdata +=				'<li data-role="divider" data-theme="e">Choose Parent CSV data file to import:</li>';
			newdata +=				'<li><input id="parCSVfileSelect" type="file" accept=".csv" /> </li>';					
			
			newdata +=	'			<li><input type="submit" value="Import Parent File" data-theme="g" id="buttonParentImport" ><input type="submit" value="Cancel" data-theme="g" id="buttonImportParentCancel" ></li>';
			newdata +=	'			<li id="importErrRegLI">';
			newdata +=	'			</li>';
			//newdata +=			'</ul>';

			
			newdata +=	'			<li data-theme="d" id="userParSearchLI">';
			newdata +=	'				<div class="ui-icon-alt">';
			newdata +=	'					<ul id="userSearch" data-role="listview">';
			newdata +=	'				</div>';
			newdata +=	'			</li>	'	;
			

			newdata +=			'</ul>';	
			
			newdata += '	</div>';				
			data = data.slice(0,startfunc) + newdata + '\n' + data.slice(startfunc);
	

			startfunc = data.indexOf("function showErrorPopup(msg)");
			//console.log('insert1 at '+startfunc);
			var myfunc = '' + pgimpfu;
			myfunc = myfunc.slice(21).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(escapeHTML(pageid))).replace('unitid',escapeHTML(unitID));
			data = data.slice(0,startfunc) + myfunc + '\n' + data.slice(startfunc);

			//put paimpfu inside of pageinit
			
			startfunc = data.indexOf("$('#buttonRemoveScout',");
			//console.log('insert2 at '+startfunc);
			var myfunc = '' + paimpfu;
			myfunc = myfunc.slice(21).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(escapeHTML(pageid))).replace('unitid',escapeHTML(unitID));
			data = data.slice(0,startfunc) + myfunc + '\n' + data.slice(startfunc);
return data;
}
// begin registration import
function paimpfu() {
	$('#userParSearchLI', '#PageX').on('click', '.selectUser', function() {
		parentParOptionSelected($(this).attr('data-userid'));
	});
}
function pgimpfu () {
			var fileObjs={};
			$('#buttonImportParentCancel', '#PageX').click(function () {
				
				$('#importParentPopup','#PageX').popup('close');
				$('#buttonParentImport', '#PageX').button('enable');
				$('#buttonImportParentCancel', '#PageX').button('enable');
			});
			$('#buttonParentImport', '#PageX').click(function () {


				// disable all inputs
				$('#buttonParentImport', '#PageX').button('disable');
				$('#buttonImportParentCancel', '#PageX').button('disable');

				var size = 0;
				var files = document.getElementById('parCSVfileSelect').files;			//file1

				if (files.length == 0) {
					showErrorPopup('Please select the file you want to import and try again.');
					$('#buttonParentImport', '#PageX').button('enable');
					$('#buttonImportParentCancel', '#PageX').button('enable');					
					return false;
				}

				var validFileSet = true;

				var file= files[0];
				size=file.size;
				var fileName = file.name.toLowerCase();

				if (size > 50000000) {
					showErrorPopup('File sizes are too large.  Total size must not be more than 50 MB');
					return false;
				} else if (size > 0) {
					$.mobile.loading('show', { theme: 'a', text: 'reading files...0%', textonly: false });
				} else {
					$.mobile.loading('show', { theme: 'a', text: 'validating...', textonly: false });
				}

				var reader = new FileReader();
				reader.onload = function(){
					var data = reader.result;

					$.mobile.loading('hide');
					$.mobile.loading('show', { theme: 'a', text: 'saving... this can take several minutes', textonly: false });
					document.getElementById("parCSVfileSelect").disabled = true;
					fileObjs['parcsvdata']=parseCSV(data);
					
					var res= preProcessCSVdataPar();
					
					if (res != '') {
						res='The file you selected does not appear to contain necessary headers.\nAborting import.\n  '+res;
					} else {
						if(fileObjs.parcsvdata.length <2 ) {
							res += ' CSV file has header only, no data\n';	
						} else {
							if(fileObjs.parcsvdata[1]=='') {
								res += ' CSV file has header only, no data\n';	
							} 
						}
					}
					
					if (res != '') {
						alert(res);
						closeCSVImportPar('#PageX');						
					} else {

						getDenPatrolPar('#PageX');
					}
				};
				reader.readAsText(file);

				return false;
			});
}


function  preProcessCSVdataPar() {	//
//	var cols = ["UnitName","DenPatrolName","FirstName","MiddleName","LastName","Suffix","Nickname","Address1","Address2","City","State","Zip","HomePhone","MobilePhone","BoysLife","BSAMemberID","dobMonth","dobDay","dobYear","Gender","LDS","SchoolGrade","SchoolName","AddParent1","P1Gender","P1Email1","P1PersonalMessage","P1FirstName","P1MiddleName","P1LastName","P1Suffix","P1Nickname","P1Address1","P1Address2","P1City","P1State","P1Zip","P1HomePhone","P1WorkPhone","P1MobilePhone","P1Email2","P1BSAMemberID","AddParent2","P2Gender","P2Email1","P2PersonalMessage","P2FirstName","P2MiddleName","P2LastName","P2Suffix","P2Nickname","P2Address1","P2Address2","P2City","P2State","P2Zip","P2HomePhone","P2WorkPhone","P2MobilePhone","P2Email2","P2BSAMemberID"];
	var cols = ["UnitName","FirstName","LastName","AddParent1","P1Gender","P1Email1","P1PersonalMessage","P1FirstName","P1MiddleName","P1LastName","P1Suffix","P1Nickname","P1Address1","P1Address2","P1City","P1State","P1Zip","P1HomePhone","P1WorkPhone","P1MobilePhone","P1Email2","P1BSAMemberID","AddParent2","P2Gender","P2Email1","P2PersonalMessage","P2FirstName","P2MiddleName","P2LastName","P2Suffix","P2Nickname","P2Address1","P2Address2","P2City","P2State","P2Zip","P2HomePhone","P2WorkPhone","P2MobilePhone","P2Email2","P2BSAMemberID"];

	var res='';
	var rowobj={};

	if(fileObjs.parcsvdata[0].length != cols.length) {
		return 'invalid number of columns in input file';
	}	

	 for(var x=0;x<cols.length;x++) {
		 //console.log(x, fileObjs.csvdata[0][x] ,cols[x]);
		if (fileObjs.parcsvdata[0][x].trim() != cols[x].trim()) {
			//console.log('mismatch');
			res += ' '+fileObjs.parcsvdata[0][x].trim()+' <> ' + cols[x] +'\n';
		}
	 }
	 
	 if (res != '') {
		 res = 'The following Column names are missing or not in the right location \n' +res;
		return res;
	 }
	
	 //make sure all rows have all the fields
	  for(var i=1;i<fileObjs.parcsvdata.length;i++) {
	    if(fileObjs.parcsvdata[i].length != cols.length) {
			res+='Row '+ i + ' does not have all the columns of data.\n'
		}
	  }

	  if (res != '') {
		 res += 'Please check your CSV file.  Hint:  sometimes using Notepad or a similar plain text editor (NOT MS Word) will show you unexpected line breaks the Excel sometimes inserts!'
		return res;
	 }	  

	  


	 fileObjs['parcsvObjs']=[];
	 //create an object template and load all rows into 
	 for(var i=1;i<fileObjs.parcsvdata.length;i++) {
		 for (var j=0;j<cols.length;j++) {
			 rowobj[cols[j]]=fileObjs.parcsvdata[i][j];
		 }
		 fileObjs.parcsvObjs.push(JSON.parse(JSON.stringify(rowobj)));
	 }
	 
	return res;
}




function closeImportclrPar(pageid){
	//alert('Please note the issues listed!');
	$('#importErrRegLI',pageid).text('');
	closeCSVImportPar(pageid);
	
}
function closeCSVImportPar(pageid) {	//
	$.mobile.loading('hide');
	$('#faOverlay',pageid).hide();
    if($('#importErrRegLI',pageid).text() != '') {
		setTimeout(function () {closeImportclrPar(pageid);},1000);
		return;
	}

	$('#buttonImportParentCancel',pageid).button('enable');
	$('#buttonParentImport',pageid).button('enable');
	document.getElementById("parCSVfileSelect").disabled = false;
	$('#importParentPopup',pageid).popup('close');
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
	


function getDenPatrolPar(pageid) {
	var unitID;
	if(document.baseURI.match(/UnitID=(\d+)/)==null) {
			 $.mobile.loading('hide');
			alert('Halted due unexpected error in getDenPatrolPar');
			closeCSVImportPar(pageid);	
			return;			
	}
	
	unitID=document.baseURI.match(/UnitID=(\d+)/)[1];	
	//on uit page
	//id	$('a[href*="denpatrol.asp"]',this.response)[0].href.match(/DenID=(\d+)/)[1]
	//name 	$('a[href*="denpatrol.asp"]')[0].text.trim().split('\n')[0]
	var denpatrolObjs=[];
	var thisObj={};
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,closeCSVImportPar,[pageid],  getDenPatrolPar,[pageid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			servErrCnt=0;
			resetLogoutTimer(url);	
			for(var i=0;i<$('a[href*="denpatrol.asp"]',this.response).length;i++) {
				if($('a[href*="denpatrol.asp"]',this.response)[i].href.match(/DenID=\d+/) != null) {
					thisObj['id']='&'+ $('a[href*="denpatrol.asp"]',this.response)[i].href.match(/DenID=\d+/)[0] + '&PatrolID=';

				} 
				if($('a[href*="denpatrol.asp"]',this.response)[i].href.match(/PatrolID=\d+/) != null) {
					thisObj['id']='&DenID=&' +$('a[href*="denpatrol.asp"]',this.response)[i].href.match(/PatrolID=\d+/)[0];

				} 				
				thisObj['name']=$('a[href*="denpatrol.asp"]',this.response)[i].text.trim().split('\n')[0];
				denpatrolObjs.push(JSON.parse(JSON.stringify(thisObj)));
			}
			
			setTimeout(function () {
				NewParentValidatePar(denpatrolObjs,pageid);
			},500);					
		}
	}
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/admin/unit.asp?UnitID=' + unitID;
	xhttp.open("GET", url, true);
	xhttp.send();
	xhttp.onerror = function() {
		 errStatusHandle(500,closeCSVImportPar,[pageid],  getDenPatrolPar,[pageid]);
	}	
	
}
//					0			1			3			3		4			5			6		7		8		9		10		11				12			13			14			15		16		          17		18				19			20				21		   22		23				24				25			26			27			28		29			30		31			32	33		34		35			36			37				38		39			40			41			42				43			44			45			46			47		48			49		50			51		52	 53	  54			55					56		57		58																																										
//	var cols = ["FirstName","MiddleName","LastName","Suffix","Nickname","Address1","Address2","City","State","Zip","HomePhone","MobilePhone","BoysLife","BSAMemberID","dobMonth","dobDay","dobYear","Gender","LDS","SchoolGrade","SchoolName","TalentRelease","AddParent1","Gender","Email1","PersonalMessage","FirstName","MiddleName","LastName","Suffix","Nickname","Address1","Address2","City","State","Zip","HomePhone","WorkPhone","MobilePhone","Email2","BSAMemberID","AddParent2","Gender","Email1","PersonalMessage","FirstName","MiddleName","LastName","Suffix","Nickname","Address1","Address2","City","State","Zip","HomePhone","WorkPhone","MobilePhone","Email2","BSAMemberID"];
//	var cols = ["UnitName","FirstName","LastName","dobMonth","dobDay","dobYear","AddParent1","P1Gender","P1Email1","P1PersonalMessage","P1FirstName","P1MiddleName","P1LastName","P1Suffix","P1Nickname","P1Address1","P1Address2","P1City","P1State","P1Zip","P1HomePhone","P1WorkPhone","P1MobilePhone","P1Email2","P1BSAMemberID","AddParent2","P2Gender","P2Email1","P2PersonalMessage","P2FirstName","P2MiddleName","P2LastName","P2Suffix","P2Nickname","P2Address1","P2Address2","P2City","P2State","P2Zip","P2HomePhone","P2WorkPhone","P2MobilePhone","P2Email2","P2BSAMemberID"];

function NewParentValidatePar(denpatrolObjs,pageid) {
	
	//Required
	//Scout Firstname, lastname, address, city. state, zip, one of the phones, dobmonth,day,yr,schoolgrade,schoolname
	
	// Save the Scout Roster. Already on the page, just build a list
	var scoutlist=[];	
	var lastfirst=false;
	var csvname;
	var res='';
	var unitID;
	
	if(document.baseURI.match(/UnitID=(\d+)/)==null) {
			 $.mobile.loading('hide');
			alert('Halted due unexpected error in NewParentValidatePar');
			closeCSVImportPar(pageid);	
			return;			
	}	
	
	
	unitID=document.baseURI.match(/UnitID=(\d+)/)[1];
	var namelist=[];
	for(var i=0;i<$('a[href*="account.asp?ScoutUserID"]').length;i++) {
		
				namelist=$('a[href*="account.asp?ScoutUserID"]')[i].text.trim().split('\n');
				scoutlist.push(namelist[0].trim());		

	}

	if(scoutlist[0].indexOf(",") != -1) {
		lastfirst=true;
	}
	

	var xl;	
	for(var x=0;x<fileObjs.parcsvObjs.length;x++) {
		xl=x+1;
		
			fileObjs.parcsvObjs[x].UnitName=fileObjs.parcsvObjs[x].UnitName.trim();
			if(fileObjs.parcsvObjs[x].UnitName =='') {
				res="Unit Name is not defined line " +xl +'\n';
				break;
			}
			
			if(fileObjs.parcsvObjs[x].UnitName.toLowerCase()  != $('#goToUnit').text().trim().toLowerCase()) {
				res="Unitname "+fileObjs.parcsvObjs[x].UnitName+" doesn't match current unit " +$('#goToUnit').text()+' line '+xl+'\n';
				break;
			}
			
			fileObjs.parcsvObjs[x]['DenPatrolID']='';
			
				
			fileObjs.parcsvObjs[x].LastName=fileObjs.parcsvObjs[x].LastName.trim();
			fileObjs.parcsvObjs[x].FirstName=fileObjs.parcsvObjs[x].FirstName.trim();
			 //console.log(x, fileObjs.csvdata[0][x] ,cols[x]);
			if (lastfirst==true) {
				csvname=fileObjs.parcsvObjs[x].LastName +', '+fileObjs.parcsvObjs[x].FirstName;
			} else {
				csvname=fileObjs.parcsvObjs[x].FirstName +' '+fileObjs.parcsvObjs[x].LastName;
			}
			var cnt=0;
			for (var y=0;y<scoutlist.length;y++) {
				if(csvname.toLowerCase()==scoutlist[y].toLowerCase()) {
					//res = 'Scout already exists in Scoutbook ' + csvname +' line '+xl+'\n';
					//break;
					cnt+=1;
				}	
			}		
			if(cnt==0 ) {
				res = ' No match for Scout in Scoutbook ' + csvname +' line '+xl+'\n';
				break;
			}
			if(cnt>1) {
				res = 'There is more than one Scout named ' + csvname +'.  Cannot add a parent unless the Scout name is unique.  line '+xl+'\n';
				break;
			}
				
		
		
		// Rules for adult stuff...  if gender is marked, validateCSVdata
		//"addParent1" 21
		
		fileObjs.parcsvObjs[x].AddParent1=fileObjs.parcsvObjs[x].AddParent1.trim().toLowerCase();
		if(fileObjs.parcsvObjs[x].AddParent1 == 'y') fileObjs.parcsvObjs[x].AddParent1 = 'yes';
		if(fileObjs.parcsvObjs[x].AddParent1 == 'yes') {
			//"Gender",22
			
				fileObjs.parcsvObjs[x].P1Gender=fileObjs.parcsvObjs[x].P1Gender.trim().toUpperCase();
				if(fileObjs.parcsvObjs[x].P1Gender != 'M' && fileObjs.parcsvObjs[x].P1Gender != 'F') {
					res+=fileObjs.parcsvObjs[x].FirstName +' '+fileObjs.parcsvObjs[x].LastName + ' parent1 gender must be F or M line '+xl+'\n';
				}
			//"Email",//22
			fileObjs.parcsvObjs[x].P1Email1=fileObjs.parcsvObjs[x].P1Email1.trim();
			if(fileObjs.parcsvObjs[x].P1Email1 != '') { 
				if(emailcheck(fileObjs.parcsvObjs[x].P1Email1) == false) {
					res+=fileObjs.parcsvObjs[x].FirstName +' '+fileObjs.parcsvObjs[x].LastName + ' parent1 Email is invalid line '+xl+'\n';
				}		
			} else {
				res+=fileObjs.parcsvObjs[x].FirstName +' '+fileObjs.parcsvObjs[x].LastName + ' parent1 Email is missing line '+xl+'\n';
			}		
		
			
			//"PersonalMessage",24  no checks needed. If empty will use a default
			//"FirstName",25
			fileObjs.parcsvObjs[x].P1FirstName=fileObjs.parcsvObjs[x].P1FirstName.trim();
			if(fileObjs.parcsvObjs[x].P1FirstName == '') { 		
				res+=fileObjs.parcsvObjs[x].FirstName +' '+fileObjs.parcsvObjs[x].LastName + ' parent1 missing first name line '+xl+'\n';
			}				
			//"MiddleName",26	no check
			//"LastName",27
			fileObjs.parcsvObjs[x].P1MiddleName=fileObjs.parcsvObjs[x].P1MiddleName.trim();
			fileObjs.parcsvObjs[x].P1LastName=fileObjs.parcsvObjs[x].P1LastName.trim();
			if(fileObjs.parcsvObjs[x].P1LastName == '') { 		
				res+=fileObjs.parcsvObjs[x].FirstName +' '+fileObjs.parcsvObjs[x].LastName + ' parent1 missing first name line '+xl+'\n';
			}				
			
			//"Suffix",28	no check
			//"Nickname",29 no check
			
			//"Address1",30	no check.  If blank, default to Scout Address
			//"Address2",31 no check.  If blank, default to Scout Address
			//"City",32 no check.  If blank, default to Scouts
			//"State",33    check.  If blank, default to Scouts
			fileObjs.parcsvObjs[x].P1Suffix=fileObjs.parcsvObjs[x].P1Suffix.trim();
			fileObjs.parcsvObjs[x].P1Nickname=fileObjs.parcsvObjs[x].P1Nickname.trim();
			fileObjs.parcsvObjs[x].P1Address1=fileObjs.parcsvObjs[x].P1Address1.trim();
			fileObjs.parcsvObjs[x].P1Address2=fileObjs.parcsvObjs[x].P1Address2.trim();
			fileObjs.parcsvObjs[x].P1City=fileObjs.parcsvObjs[x].P1City.trim();
			fileObjs.parcsvObjs[x].P1State=fileObjs.parcsvObjs[x].P1State.trim().toUpperCase();
			
			
			
			if(fileObjs.parcsvObjs[x].P1State != '') {
				if(statecheck(fileObjs.parcsvObjs[x].P1State) == false) {
					res+=fileObjs.parcsvObjs[x].FirstName +' '+fileObjs.parcsvObjs[x].LastName + 'invalid parent1 state line '+xl+'\n';
				}
			}
			
			//"Zip",34 check.  If blank, default to Scout 
			fileObjs.parcsvObjs[x].P1Zip=fileObjs.parcsvObjs[x].P1Zip.trim();
			if(fileObjs.parcsvObjs[x].P1Zip != '') {
				if(zipcheck(fileObjs.parcsvObjs[x].P1Zip) == false) {
					res+=fileObjs.parcsvObjs[x].FirstName +' '+fileObjs.parcsvObjs[x].LastName + 'invalid parent1 zip line '+xl+'\n';
				}
			}		
			
		
			//"HomePhone",35  check.  If blank, default to Scouts
			fileObjs.parcsvObjs[x].P1HomePhone=phoneAlt(fileObjs.parcsvObjs[x].P1HomePhone.trim());
			if(fileObjs.parcsvObjs[x].P1HomePhone != '') {
				if(phonecheck(fileObjs.parcsvObjs[x].P1HomePhone) == false) {
					res+=fileObjs.parcsvObjs[x].FirstName +' '+fileObjs.parcsvObjs[x].LastName + 'invalid parent1 home phone number.  Format must be (nnn) nnn-nnnn line '+xl+'\n';
				}
			}			
			
			//"WorkPhone","
			fileObjs.parcsvObjs[x].P1WorkPhone=phoneAlt(fileObjs.parcsvObjs[x].P1WorkPhone.trim());
			if(fileObjs.parcsvObjs[x].P1WorkPhone != '') {
				if(phonecheck(fileObjs.parcsvObjs[x].P1WorkPhone) == false) {
					res+=fileObjs.parcsvObjs[x].FirstName +' '+fileObjs.parcsvObjs[x].LastName + 'invalid parent1 work phone number.  Format must be (nnn) nnn-nnnn line '+xl+'\n';
				}
			}			
			
			//MobilePhone", check.  If blank, default to Scouts

			fileObjs.parcsvObjs[x].P1MobilePhone=phoneAlt(fileObjs.parcsvObjs[x].P1MobilePhone.trim());
			if(fileObjs.parcsvObjs[x].P1MobilePhone != '') {
				if(phonecheck(fileObjs.parcsvObjs[x].P1MobilePhone) == false) {
					res+=fileObjs.parcsvObjs[x].FirstName +' '+fileObjs.parcsvObjs[x].LastName + 'invalid parent1 mobile phone number.  Format must be (nnn) nnn-nnnn line '+xl+'\n';
				}
			}	
			
			//"ConnectionEmail2",
			
			fileObjs.parcsvObjs[x].P1Email2=fileObjs.parcsvObjs[x].P1Email2.trim();
			if(fileObjs.parcsvObjs[x].P1Email2 != '') { 
				if(emailcheck(fileObjs.parcsvObjs[x].P1Email2) == false) {
					res+=fileObjs.parcsvObjs[x].FirstName +' '+fileObjs.parcsvObjs[x].LastName + ' parent1 ConnectionEmail2 is invalid line '+xl+'\n';
				}		
			}		
			
			//"BSAMemberID",
			fileObjs.parcsvObjs[x].P1BSAMemberID=fileObjs.parcsvObjs[x].P1BSAMemberID.trim();
			if(fileObjs.parcsvObjs[x].P1BSAMemberID != '' ) {
				if (isNaN(fileObjs.parcsvObjs[x].P1BSAMemberID) ==true ) {				
					res+=fileObjs.parcsvObjs[x].FirstName +' '+fileObjs.parcsvObjs[x].LastName + ' parent1 BSAMemberID is invalid line '+xl+'\n';	
				}				
			}	
		}

		fileObjs.parcsvObjs[x].AddParent2=fileObjs.parcsvObjs[x].AddParent2.trim().toLowerCase();
		if(fileObjs.parcsvObjs[x].AddParent2 == 'y') fileObjs.parcsvObjs[x].AddParent2 ='yes';
		if(fileObjs.parcsvObjs[x].AddParent2 == 'yes') {
			//"Gender",38
			fileObjs.parcsvObjs[x].P2Gender=fileObjs.parcsvObjs[x].P2Gender.trim().toUpperCase();
				if(fileObjs.parcsvObjs[x].P2Gender != 'M' && fileObjs.parcsvObjs[x].P2Gender != 'F') {
					res+=fileObjs.parcsvObjs[x].FirstName +' '+fileObjs.parcsvObjs[x].LastName + ' parent2 gender must be F or M line '+xl+'\n';
				}
			//"Email",//39
			fileObjs.parcsvObjs[x].P2Email1=fileObjs.parcsvObjs[x].P2Email1.trim();
			if(fileObjs.parcsvObjs[x].P2Email1 != '') { 
				if(emailcheck(fileObjs.parcsvObjs[x].P2Email1) == false) {
					res+=fileObjs.parcsvObjs[x].FirstName +' '+fileObjs.parcsvObjs[x].LastName + ' parent2 Email is invalid line '+xl+'\n';
				}		
			} else {
				res+=fileObjs.parcsvObjs[x].FirstName +' '+fileObjs.parcsvObjs[x].LastName + ' parent2 Email is missing line '+xl+'\n';
			}		
		
			
			//"PersonalMessage",43  no checks needed. If empty will use a default
			//"FirstName",44
			fileObjs.parcsvObjs[x].P2FirstName=fileObjs.parcsvObjs[x].P2FirstName.trim();
			fileObjs.parcsvObjs[x].P2LastName=fileObjs.parcsvObjs[x].P2LastName.trim();
			if(fileObjs.parcsvObjs[x].P2FirstName == '') { 		
				res+=fileObjs.parcsvObjs[x].FirstName +' '+fileObjs.parcsvObjs[x].LastName + ' parent2 missing first name line '+xl+'\n';
			}				
			//"MiddleName",45	no check
			//"LastName",464
			
			if(fileObjs.parcsvObjs[x].P2LastName == '') { 		
				res+=fileObjs.parcsvObjs[x].FirstName +' '+fileObjs.parcsvObjs[x].LastName + ' parent2 missing first name line '+xl+'\n';
			}				
			
			//"Suffix",47	no check
			//"Nickname",48 no check
			
			//"Address1",49	no check.  If blank, default to Scout Address
			//"Address2",50 no check.  If blank, default to Scout Address
			//"City",41 no check.  If blank, default to Scouts
			//"State",52    check.  If blank, default to Scouts
			fileObjs.parcsvObjs[x].P2Suffix=fileObjs.parcsvObjs[x].P2Suffix.trim();
			fileObjs.parcsvObjs[x].P2Nickname=fileObjs.parcsvObjs[x].P2Nickname.trim();
			fileObjs.parcsvObjs[x].P2Address1=fileObjs.parcsvObjs[x].P2Address1.trim();
			fileObjs.parcsvObjs[x].P2Address2=fileObjs.parcsvObjs[x].P2Address2.trim();
			fileObjs.parcsvObjs[x].P2City=fileObjs.parcsvObjs[x].P2City.trim();
			
			fileObjs.parcsvObjs[x].P2State=fileObjs.parcsvObjs[x].P2State.trim().toUpperCase();
			if(fileObjs.parcsvObjs[x].P2State != '') {
				if(statecheck(fileObjs.parcsvObjs[x].P2State) == false) {
					res+=fileObjs.parcsvObjs[x].FirstName +' '+fileObjs.parcsvObjs[x].LastName + 'invalid parent2 state line '+xl+'\n';
				}
			}
			
			//"Zip",50 check.  If blank, default to Scout 
			fileObjs.parcsvObjs[x].P2Zip=fileObjs.parcsvObjs[x].P2Zip.trim();
			if(fileObjs.parcsvObjs[x].P2Zip != '') {
				if(zipcheck(fileObjs.parcsvObjs[x].P2Zip) == false) {
					res+=fileObjs.parcsvObjs[x].FirstName +' '+fileObjs.parcsvObjs[x].LastName + 'invalid parent2 zip line '+xl+'\n';
				}
			}		
			
		
			//"HomePhone",51  check.  If blank, default to Scouts
			fileObjs.parcsvObjs[x].P2HomePhone=phoneAlt(fileObjs.parcsvObjs[x].P2HomePhone.trim());
			if(fileObjs.parcsvObjs[x].P2HomePhone != '') {
				if(phonecheck(fileObjs.parcsvObjs[x].P2HomePhone) == false) {
					res+=fileObjs.parcsvObjs[x].FirstName +' '+fileObjs.parcsvObjs[x].LastName + 'invalid parent2 home phone number.  Format must be (nnn) nnn-nnnn line '+xl+'\n';
				}
			}			
			
			//"WorkPhone","
			fileObjs.parcsvObjs[x].P2WorkPhone=phoneAlt(fileObjs.parcsvObjs[x].P2WorkPhone.trim());
			if(fileObjs.parcsvObjs[x].P2WorkPhone != '') {
				if(phonecheck(fileObjs.parcsvObjs[x].P2WorkPhone) == false) {
					res+=fileObjs.parcsvObjs[x].FirstName +' '+fileObjs.parcsvObjs[x].LastName + 'invalid parent2 work phone number.  Format must be (nnn) nnn-nnnn line '+xl+'\n';
				}
			}			
			
			//MobilePhone", check.  If blank, default to Scouts

			fileObjs.parcsvObjs[x].P2MobilePhone=phoneAlt(fileObjs.parcsvObjs[x].P2MobilePhone.trim());
			if(fileObjs.parcsvObjs[x].P2MobilePhone != '') {
				if(phonecheck(fileObjs.parcsvObjs[x].P2MobilePhone) == false) {
					res+=fileObjs.parcsvObjs[x].FirstName +' '+fileObjs.parcsvObjs[x].LastName + 'invalid parent2 mobile phone number.  Format must be (nnn) nnn-nnnn line '+xl+'\n';
				}
			}	
			
			//"ConnectionEmail2",
			fileObjs.parcsvObjs[x].P2Email2=fileObjs.parcsvObjs[x].P2Email2.trim();
			if(fileObjs.parcsvObjs[x].P2Email2 != '') { 
				if(emailcheck(fileObjs.parcsvObjs[x].P2Email2) == false) {
					res+=fileObjs.parcsvObjs[x].FirstName +' '+fileObjs.parcsvObjs[x].LastName + ' parent2 ConnectionEmail2 is invalid line '+xl+'\n';
				}		
			}		
			
			//"BSAMemberID",
			fileObjs.parcsvObjs[x].P2BSAMemberID=fileObjs.parcsvObjs[x].P2BSAMemberID.trim();
			if(fileObjs.parcsvObjs[x].P2BSAMemberID != '' ) {
				if (isNaN(fileObjs.parcsvObjs[x].P2BSAMemberID) ==true ) {				
					res+=fileObjs.parcsvObjs[x].FirstName +' '+fileObjs.parcsvObjs[x].LastName + ' parent2 BSAMemberID is invalid line '+xl+'\n';	
				}				
			}	
		}	
	}

	if(res!='') {
		alert(res);
		closeCSVImportPar(pageid);
	} else {
		var tunit=$('#goToUnit').text();
		var denpatrol='';
		if(tunit.match(/Pack/) != null) denpatrol="DenID";
		if(tunit.match(/Troop/) != null) denpatrol="PatrolID";
		if(tunit.match(/Crew/) != null) denpatrol="PatrolID";
		if(tunit.match(/Team/) != null) denpatrol="SquadID";
		
		fileObjs.parcsvdata.shift();	//remove header row
		
		getNewRosterPar(unitID,denpatrol,pageid);

	}
	
}


//for the current line in fileObjs.parcsvObjs  (a csv file line)
// get the scout's scoutid from the roster
// After getting the id, 
//   call to edit the scout's info, not to change it, but to capture it for the parent's address
//   OR if no parent is marked, just get the next scout's id

function getNewRosterPar(unitID,denpatrol,pageid) {
	var scoutlist=[];
	var scoutIDlist=[];
	var lastfirst=false;
	var sname;
	var scoutid='';
	
	if(fileObjs.parcsvObjs.length==0) {

		closeCSVImportPar(pageid);
		return;
	}	
	

	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,closeCSVImportPar,[pageid],  getNewRosterPar,[unitID,denpatrol,pageid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			servErrCnt=0;
			resetLogoutTimer(url);	

			var regData = fileObjs.parcsvObjs.shift();
			
			for(var i=0;i<$('a[href*="account.asp?ScoutUserID"]',this.response).length;i++) {
				//trim out parents, blanks
				var namelist=$('a[href*="account.asp?ScoutUserID"]',this.response)[i].text.trim().split('\n');
				
				
				
				scoutlist.push(namelist[0].trim());
				
				if($('a[href*="account.asp?ScoutUserID"]',this.response)[i].href.match(/ScoutUserID=(\d+)/) == null) {
					 $.mobile.loading('hide');
					alert('unexpected Error in getNewRosterPar');
					closeCSVImportPar(pageid);
					return;				
				}
				
				scoutIDlist.push($('a[href*="account.asp?ScoutUserID"]',this.response)[i].href.match(/ScoutUserID=(\d+)/)[1]);
			}
			if (scoutlist.length==0) {
				alert('Halted due to error getting roster');
				closeCSVImportPar(pageid);
				return;			
			}
			
			if(scoutlist[0].indexOf(",") != -1) lastfirst=true;

			 //console.log(x, fileObjs.csvdata[0][x] ,cols[x]);
			if (lastfirst==true) {
				sname=regData.LastName.trim() +', '+regData.FirstName.trim();
			} else {
				sname=regData.FirstName.trim() +' '+regData.LastName.trim();
			}
			for (var y=0;y<scoutlist.length;y++) {
				if(sname.toUpperCase()==scoutlist[y].toUpperCase()) {
					//found the scout...
					scoutid = scoutIDlist[y];
					//don't need to worry about two scouts with same name, already handled earlier
					break;
				}	
			}				
			
			if(scoutid=='') {
					alert('error - scout '+sname+' not found as added in roster');
					getNewRosterPar(unitID,denpatrol,pageid);  // try for next
			} else {

				
				setTimeout(function () {
					// success means the scout profile has been updated
					// Start processing parents

					if(regData.AddParent1=='yes') {
						editRegNewScoutPar(unitID,denpatrol,regData,scoutid,pageid);			
					} else {
						//this line means nothing because there is no parent to add.
						getNewRosterPar(unitID,denpatrol,pageid);
						//debugger;
						//closeCSVImportPar(pageid);
					}
				},500);				
						
				
			}			
		}
	};
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID=' + unitID;
	xhttp.open("GET", url, true);
	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,closeCSVImportPar,[pageid],  getNewRosterPar,[unitID,denpatrol,pageid]);
	};
	
}



// capture scout data - address and such to copy over to parent's record

function editRegNewScoutPar(unitID,denpatrol,regData,scoutid,pageid) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,closeCSVImportPar,[pageid],  editRegNewScoutPar,[unitID,denpatrol,regData,scoutid,pageid]);
		}
		if (this.readyState == 4 && this.status == 200) {

			servErrCnt=0;
			resetLogoutTimer(url);	

			var formPost=$('#editProfileForm', this.response).serialize();
			
			if(formPost=='') {
				
				alert('Halted due to error editing scout profile');
				closeCSVImportPar(pageid);
				return;				
			}
			
			if ($('a[href="#"][id="disapproveButton"]',this.response).text() != "") {
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
				//get common data for parent's profiled
				
				regData['Address1']=getToken(formPost,'Address1').replace(/\+/g,' ');
				regData['Address2']=getToken(formPost,'Address2').replace(/\+/g,' ');		
				
				
				regData['City']=getToken(formPost,'City').replace('+',' ');	
				regData['State']=getToken(formPost,'State');	
				regData['Zip']=getToken(formPost,'Zip');	
				regData['HomePhone']=getToken(formPost,'HomePhone');					
				regData['MobilePhone']=getToken(formPost,'MobilePhone');
				

				//-council?? already there - but get for parents
				
				regData['DistrictID']=getToken(formPost,'DistrictID');
				regData['CouncilID']=getToken(formPost,'CouncilID');
		
			
				var councilname=$('#councilID option:selected',this.response)[0].getAttribute('data-council-name');
			
				setTimeout(function () {

					if(regData.AddParent1=='yes') {
						// first parent info is available in csv
						//skip 9/17 just send invite with email checkAdminConnectedByNamePar(unitID,denpatrol,scoutid,regData,true,councilname);
						var undoleader=false;  // this call doesn't need this set
						checkAdminConnectedByNamePar(unitID,denpatrol,scoutid,regData,false,councilname,undoleader,pageid);  //was true
						//getsendNewParentAcctInvitePar(unitID,denpatrol,scoutid,regData,councilname);
						
					} else {
						//changed but should NEver get here, as this func was called aafter this check was already made
						getNewRosterPar(unitID,denpatrol,pageid);
						//closeCSVImportPar(pageid);
					}
				},500);					
		}
	};
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/admin/editprofile.asp?ScoutUserID='+scoutid+'&UnitID=' + unitID + '&DenID=&PatrolID=';
	xhttp.open("GET", url, true);
	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,closeCSVImportPar,[pageid],  editRegNewScoutPar,[unitID,denpatrol,regData,scoutid,pageid]);
	};
	
}


/* Look through this scout's existing connections.

   This function may be called more than once for a Scout.
   
   check if the adult is already connected to the scout; e.g. is an admin of the unit
   On an existing scout the parent COULD already be connected as something else

   NOTE: this routine could get called again if a non-connected parent that existed in the connection manager for the unit was updated to have a connection, which defaults a a leader connection
   
   If the adult is connected based on a simple name match, remember its connection id, then call to check to make sure we have the right one based on an email match.
   
   If not connected, call to see if the adult is already in the unit
   
*/
function checkAdminConnectedByNamePar(unitID,denpatrol,scoutid,regData,allowleader,councilname,undoleader,pageid) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,closeCSVImportPar,[pageid],  checkAdminConnectedByNamePar,[unitID,denpatrol,scoutid,regData,allowleader,councilname,undoleader,pageid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			servErrCnt=0;
			resetLogoutTimer(url);
		
			//if not connected, see if adult is in the same unit
			var parentid='';
			var connectionid=[];
			var document = this.response;
			for (var i=0;i<$('a[href*="ConnectionID"]',document).length;i++) {
				var nrec=[];
				var rec=$('a[href*="ConnectionID"]',document)[i].text.trim().split('\n');
				for(var j=0;j<rec.length;j++) {
					if(rec[j].trim() != '') nrec.push(rec[j].trim());
				}
				
				if(nrec.length==3) {
					if( nameMatch(regData.P1FirstName + ' ' + regData.P1LastName ,nrec[0])==true) {
						//we have a parent name match
						if($('a[href*="ConnectionID"]',document)[i].href.match(/ConnectionID=(\d+)/) == null) {
							 $.mobile.loading('hide');
							alert('unexpected Error in checkAdminConnectedByNamePar 1');
							closeCSVImportPar(pageid);
							return;				
						}
						connectionid.push($('a[href*="ConnectionID"]',document)[i].href.match(/ConnectionID=(\d+)/)[1]);
					}
				}
				if(nrec.length>=4) {
					// Possible that connection is pending
					if(nrec[0]=='Pending') {
						if( nameMatch(regData.P1FirstName + ' ' + regData.P1LastName ,nrec[1])==true) {
							//we have a parent name match
							if($('a[href*="ConnectionID"]',document)[i].href.match(/ConnectionID=(\d+)/) == null) {
								 $.mobile.loading('hide');
								alert('unexpected Error in checkAdminConnectedByNamePar 2');
								closeCSVImportPar(pageid);
								return;				
							}		
							connectionid.push($('a[href*="ConnectionID"]',document)[i].href.match(/ConnectionID=(\d+)/)[1]);
						}
					}else {
						if( nameMatch(regData.P1FirstName + ' ' + regData.P1LastName ,nrec[0])==true) {
							//we have a parent name match

							if($('a[href*="ConnectionID"]',document)[i].href.match(/ConnectionID=(\d+)/) == null) {
								 $.mobile.loading('hide');
								alert('unexpected Error in checkAdminConnectedByNamePar 3');
								closeCSVImportPar(pageid);
								return;				
							}				
							connectionid.push($('a[href*="ConnectionID"]',document)[i].href.match(/ConnectionID=(\d+)/)[1]);	
						}							
					}
				}
			}
			
			if(connectionid.length==0) {
				// no connected matching adult was found.
				setTimeout(function () {
					getConnectionsTestParentPar(unitID,denpatrol,scoutid,regData,councilname,pageid);
				},500);		
			} else {
				setTimeout(function () {
					// Already connected to scout, verify Email be safe to add as a parent.  
					verifyUnitParentEmailPar(unitID,denpatrol,scoutid,regData,councilname,connectionid,allowleader,undoleader,pageid);
				},500);	
			}
		}
	};

    var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connections.asp?ScoutUserID='+scoutid +'&UnitID='+unitID+ regData.DenPatrolID; //'&DenID=&PatrolID=';
	xhttp.open("GET", url, true);
	xhttp.responseType="document";
	xhttp.send();
			
	xhttp.onerror = function() {
		errStatusHandle(500,closeCSVImportPar,[pageid],  checkAdminConnectedByNamePar,[unitID,denpatrol,scoutid,regData,allowleader,councilname,undoleader,pageid]);
	};
}


/*
check if the adult in this connectionid list has an email address that matches the adult email in the csv file
	If its a pending connection the email is not listed if the adult was invited to a connection as an MBC
	so in this case, If none of the connection id emails match, alert, skip and move to next parent

	If none of the connection id emails match, check to see if user is in the connectionmanager for the unit but is not connected.  

	If there are more connections to check, iterate through this procedure
*/
function verifyUnitParentEmailPar(unitID,denpatrol,scoutid,regData,councilname,connectionid,allowleader,undoleader,pageid) {
	
	// get the profile or something first to verify email address, then we can call this
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,closeCSVImportPar,[pageid],  verifyUnitParentEmailPar,[unitID,denpatrol,scoutid,regData,councilname,connectionid,allowleader,undoleader,pageid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			servErrCnt=0;
			resetLogoutTimer(url);						
			 //verify the email
			 //may not have email if still a pending connection
			 var usethis=false;
			 if($('a[href*="MAILTO"]',this.response).length==0) {
				 //can't verify on email address -I think this is a MBC, because pending parent emails still show 
				 //if no more potential connections, lets just alert and skip this one
				 var parentid='';
				 if($('img[data-userid]',this.response).length!= 0) {
					 parentid=$('img[data-userid]',this.response).attr('data-userid');
				 }
				 if(connectionid.length ==1) {
					//var res=confirm('Scout '+ regData.FirstName + ' ' + regData.LastName + ' has a pending connection to ' + regData.P1FirstName + ' ' + regData.P1LastName + ', maybe as a MBC.  Continue to connect?');
					var res=true;
					if(res == false) {
						nextParentPar(unitID,denpatrol,scoutid,regData,councilname,pageid);
						return;
					} else {
					//	var verifyByError=parentid;
					var formpost=$('#connectionForm',this.response).serialize();
					  testInvite(unitID,denpatrol,scoutid,regData,councilname,connectionid[0],formpost,allowleader,pageid);
					//	getsendNewParentAcctInvitePar(unitID,denpatrol,scoutid,regData,councilname,verifyByError);
						return;
					}
				 }
			 } else {
				 if($('a[href*="MAILTO"]',this.response)[0].text.trim().toUpperCase() == regData.P1Email1.toUpperCase()) {
					 usethis=true;
				 }
				 
			 }
			 
			 
			if(usethis==true) {
				var formpost=$('#connectionForm',this.response).serialize();

				//verified email, this IS the right parent		
				if(undoleader==true) {
					formpost=formpost.replace('ConnectionRelationship=Adult+Leader&','');
				}
				addAsParentToScoutPar(unitID,denpatrol,scoutid,regData,connectionid,allowleader,councilname,formpost,pageid);
			} else {
				//No email match.  Look in connectionmanager next to see if there is someone there with the same name and email but is not currently connected
				if(connectionid.length==1) {
					getConnectionsTestParentPar(unitID,denpatrol,scoutid,regData,councilname,pageid);
				} else {
					//try next connectionID
					connectionid.shift();
					verifyUnitParentEmailPar(unitID,denpatrol,scoutid,regData,councilname,connectionid,allowleader,undoleader,pageid);
				}
			}
	
		}
	};
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/admin/connection.asp?ScoutUserID='+scoutid+'&ConnectionID='+connectionid[0]+'&UnitID=' + unitID + regData.DenPatrolID;
	xhttp.open("GET", url, true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		 errStatusHandle(500,closeCSVImportPar,[pageid],  verifyUnitParentEmailPar,[unitID,denpatrol,scoutid,regData,councilname,connectionid,allowleader,undoleader,pageid]);
	};
}




//check if already in the unit but not connected
//document.querySelectorAll('[data-name]');
function getConnectionsTestParentPar(unitID,denpatrol,scoutid,regData,councilname,pageid) {
	var parentid='';
	var lkupfirst;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,closeCSVImportPar,[pageid],  getConnectionsTestParentPar,[unitID,denpatrol,scoutid,regData,councilname,pageid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			servErrCnt=0;
			resetLogoutTimer(url);	

			var conid=null;
			var tempscout='';
			var conlist=[];
			var parentlist=[];
			var document=this.response;
			var adultList=document.querySelectorAll('[data-name]');
			for (var i=0;i<adultList.length;i++) {
				//Nickname has preference... weird
				if(regData.P1Nickname !='') {
					lkupfirst=regData.P1Nickname;
				} else {
					lkupfirst=regData.P1FirstName;
				}
				if( nameMatch(lkupfirst + ' ' + regData.P1LastName ,adultList[i].getAttribute('data-name'))==true) {
					// what if there are multiple name matches....
					//var trow=adultList[i].parentElement.parentElement;
		
					parentid=adultList[i].getAttribute('data-connecteduserid');
				    parentlist.push({parentid:parentid,checked:false});
					
					/* 4/9/2019  use jut the parent id and a roster edit
					//search for this parent in the table
					var connectionList=document.querySelectorAll('[data-connecteduserid]');
					for(var j=0;j<connectionList.length;j++) {
						if(connectionList[j].getAttribute('data-connecteduserid')== parentid) {
							conid=connectionList[j].getAttribute('data-connectionid');
							
							//don't care which scout's connection, we just need to look at it to verify te adult email
							if(conid != null&& conid!='') {
								tempscout=connectionList[j].getAttribute('data-userid');
								break;
							}								
						}
					}
					if(conid != null && conid!=''){
					    conlist.push({conid:conid,parentid:parentid,tempscout:tempscout});
						//break;
					}
					*/
					
					
				}
			}
			
			
			
			/* removed 4/9/2019
			if (conlist.length==0) {
				//parent not found here...
				setTimeout(function () {
					//do a lookup to find;
					//  9/15 night out searchparent(unitID,denpatrol,scoutid,regData,councilname);
					var verifyByError='';
					getsendNewParentAcctInvitePar(unitID,denpatrol,scoutid,regData,councilname,verifyByError);
				},500);						
			} else {
				setTimeout(function () {
					//check this adult-temp scout connection to see if it matches the adult's email
					verifyParentEmailPar(unitID,denpatrol,scoutid,regData,councilname,conlist);   //conid, parentid, and tempscout are lists
				},500);		
			}	
			*/

			if (parentlist.length==0) {
				//parent not found here...
				setTimeout(function () {
					//do a lookup to find;
					//  9/15 night out searchparent(unitID,denpatrol,scoutid,regData,councilname);
					var verifyByError='';
					getsendNewParentAcctInvitePar(unitID,denpatrol,scoutid,regData,councilname,verifyByError,pageid);
				},500);						
			} else {
				setTimeout(function () {
					//check this adult-temp scout connection to see if it matches the adult's email
					verifyParentEmailParPF(unitID,denpatrol,scoutid,regData,councilname,parentlist,pageid);   //conid, parentid, and tempscout are lists
				},500);		
			}	




			
		}
	};
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/admin/connectionsmanager.asp?UnitID=' + unitID;
	xhttp.open("GET", url, true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,closeCSVImportPar,[pageid],  getConnectionsTestParentPar,[unitID,denpatrol,scoutid,regData,councilname,pageid]);
	};
	
}

//The import csv file scout is NOT connected to an adult in this list.  Look at a a scout who IS connected to determine if the email for the parent matches.

function verifyParentEmailPar(unitID,denpatrol,scoutid,regData,councilname,conlist,pageid) {
	// get the profile or something first to verify email address, then we can call this
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,closeCSVImportPar,[pageid],  verifyParentEmailPar,[unitID,denpatrol,scoutid,regData,councilname,conlist,pageid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			servErrCnt=0;
			resetLogoutTimer(url);						
			 //verify the email
			 
			 //possible that this person is invited but not yet connected, so they will not have an email listed on this page.
			if($('a[href*="MAILTO"]',this.response).length==0) {
				// can't verify so try send connect
				if(conlist.length==1) {
					var verifyByError=conlist[0].parentid;
					setTimeout(function () {
						getsendNewParentAcctInvitePar(unitID,denpatrol,scoutid,regData,councilname,verifyByError,pageid);
					},200);
					return;
				}
				conlist.shift();
				setTimeout(function () {
					verifyParentEmailPar(unitID,denpatrol,scoutid,regData,councilname,conlist,pageid);
				},200);
				return;
			} 
			
			if($('a[href*="MAILTO"]',this.response)[0].text.trim().toUpperCase() == regData.P1Email1.toUpperCase()) {
				//verified emailm, this IS the right parent	
				//var formpost=$('#connectionForm').serialize();				
				updatescoutconnectionPar(unitID,denpatrol,scoutid,regData,conlist[0].parentid,councilname,pageid);
			} else {
				//not sure, just send a new parent account invite
				if(conlist.length==1) {
					//no more to check
					var verifyByError='';
					setTimeout(function () {
						getsendNewParentAcctInvitePar(unitID,denpatrol,scoutid,regData,councilname,verifyByError,pageid);
					},200);
				} else {
					conlist.shift();
					setTimeout(function () {
					verifyParentEmailPar(unitID,denpatrol,scoutid,regData,councilname,conlist,pageid);
					},200);
				}
			}
	
		}
	};
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/admin/connection.asp?ScoutUserID='+conlist[0].tempscout+'&ConnectionID='+conlist[0].conid+'&UnitID=' + unitID + '&DenID=&PatrolID=';
	xhttp.open("GET", url, true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,closeCSVImportPar,[pageid],  verifyParentEmailPar,[unitID,denpatrol,scoutid,regData,councilname,conlist,pageid]);
	};
}


function verifyParentEmailParPF(unitID,denpatrol,scoutid,regData,councilname,parentlist,pageid) {
	// get the profile or something first to verify email address, then we can call this
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,closeCSVImportPar,[pageid],  verifyParentEmailParPF,[unitID,denpatrol,scoutid,regData,councilname,parentlist,pageid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			servErrCnt=0;
			resetLogoutTimer(url);						
			 //verify the email
			 
			 //possible that this person is invited but not yet connected, so they will not have an email listed on this page.
			 // but who knows anymore with the previously inviable rule of required email addresses being broken with changes in SB in Jan 2019
			if($('a[href*="MAILTO"]',this.response).length==0) {
				// can't verify so try send connect
				if(parentlist.length==1) {
					var verifyByError=parentlist[0].parentid;
					setTimeout(function () {
						getsendNewParentAcctInvitePar(unitID,denpatrol,scoutid,regData,councilname,verifyByError,pageid);
					},200);
					return;
				}
				parentlist.shift();
				setTimeout(function () {
					verifyParentEmailParPF(unitID,denpatrol,scoutid,regData,councilname,parentlist,pageid);
				},200);
				return;
			} 
			
			if($('a[href*="MAILTO"]',this.response)[0].text.trim().toUpperCase() == regData.P1Email1.toUpperCase()) {
				//verified emailm, this IS the right parent	
				//var formpost=$('#connectionForm').serialize();

// create an in unit connection				
				updatescoutconnectionPar(unitID,denpatrol,scoutid,regData,parentlist[0].parentid,councilname,pageid);
			} else {
				//not sure, just send a new parent account invite
				if(parentlist.length==1) {
					//no more to check
					var verifyByError='';
					setTimeout(function () {
						getsendNewParentAcctInvitePar(unitID,denpatrol,scoutid,regData,councilname,verifyByError,pageid);
					},200);
				} else {
					parentlist.shift();
					setTimeout(function () {
					verifyParentEmailParPF(unitID,denpatrol,scoutid,regData,councilname,parentlist,pageid);
					},200);
				}
			}
	
		}
	};
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/admin/rosteredit.asp?AdultUserID='+parentlist[0].parentid+'&UnitID=' + unitID + '&DenID=&PatrolID=';
	xhttp.open("GET", url, true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,closeCSVImportPar,[pageid],  verifyParentEmailParPF,[unitID,denpatrol,scoutid,regData,councilname,parentlist,pageid]);
	};
}

function testInvite(unitID,denpatrol,scoutid,regData,councilname,connectionid,formpost,allowleader,pageid) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,closeCSVImportPar,[pageid],  testInvite,[unitID,denpatrol,scoutid,regData,councilname,connectionid,formpost,allowleader,pageid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			servErrCnt=0;
			resetLogoutTimer(url);	

				if($('input[name="CSRF"]',this.response).length==0) {
					alert('Halted due to connection invite errors 1');
					closeCSVImportPar(pageid);
					return;					
				}
				var CSRF=$('input[name="CSRF"]',this.response).val();
				setTimeout(function () {
					testInviteNext(unitID,denpatrol,scoutid,regData,councilname,CSRF,connectionid,formpost,allowleader,pageid);
				},500);						
	
		}
	};
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/admin/connectioninvite.asp?ScoutUserID=' + scoutid+ '&UnitID=' + unitID +'&DenID=&PatrolID=';
	xhttp.open("GET", url, true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,closeCSVImportPar,[pageid],  testInvite,[unitID,denpatrol,scoutid,regData,councilname,connectionid,formpost,allowleader,pageid]);
	};
}


function testInviteNext(unitID,denpatrol,scoutid,regData,councilname,CSRF,connectionid,formpost,allowleader,pageid) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,closeCSVImportPar,[pageid], testInviteNext,[unitID,denpatrol,scoutid,regData,councilname,CSRF,connectionid,formpost,allowleader,pageid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			
			if (this.response.indexOf('Invitation Sent!') == -1 ) {
				if(this.response.indexOf('A user with the same email address is already connected') != -1) {
					testInviteOK(unitID,denpatrol,scoutid,regData,councilname,connectionid,allowleader,pageid);
					return;
				}
			}
			nextParentPar(unitID,denpatrol,scoutid,regData,councilname,pageid);
		}
	};			
    //var msg='batch invite test';	
    var msg=encodeURIComponent(regData.P1PersonalMessage).replace(/%20/g,'+');
    var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connectioninvite.asp?ScoutUserID='+scoutid;
    var formPost='Action=Submit';
	formPost += '&CSRF='+CSRF;
	formPost += '&Gender='+regData.P1Gender;
	formPost += '&AdultUserID=';
	formPost += '&ConnectionFirstName='+encodeURIComponent(regData.P1FirstName).replace(/%20/g,'+');
	formPost += '&ConnectionLastName='+encodeURIComponent(regData.P1LastName).replace(/%20/g,'+');
	formPost += '&ConnectionEmail='+encodeURIComponent( regData.P1Email1);
	formPost += '&ConnectionEmail2='+encodeURIComponent(regData.P1Email2);
	formPost += '&ConnectionRelationship=Parent%2FGuardian';
	//formPost += '&PermissionFullControl=on&';
	formPost += '&PersonalMessage='+msg;

    xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formPost);
			
	xhttp.onerror = function() {
		 errStatusHandle(500,closeCSVImportPar,[pageid], testInviteNext,[unitID,denpatrol,scoutid,regData,councilname,CSRF,connectionid,formpost,allowleader,pageid]);
	};			
			
}	

function testInviteOK(unitID,denpatrol,scoutid,regData,councilname,connectionid,allowleader,pageid) {
	
	// get the profile or something first to verify email address, then we can call this
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,closeCSVImportPar,[pageid], testInviteOK,[unitID,denpatrol,scoutid,regData,councilname,connectionid,allowleader,pageid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			servErrCnt=0;
			resetLogoutTimer(url);						
			 //verify the email

			var formpost=$('#connectionForm',this.response).serialize();

			
			formpost=formpost.replace('ConnectionRelationship=Adult+Leader&','');
			
			addAsParentToScoutPar(unitID,denpatrol,scoutid,regData,connectionid,allowleader,councilname,formpost,pageid);
	
		}
	};
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/admin/connection.asp?ScoutUserID='+scoutid+'&ConnectionID='+connectionid+'&UnitID=' + unitID + regData.DenPatrolID;
	xhttp.open("GET", url, true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,closeCSVImportPar,[pageid], testInviteOK,[unitID,denpatrol,scoutid,regData,councilname,connectionid,allowleader,pageid]);
	};
}




//new 8/29
function searchForParentByEmailPar(unitID,denpatrol,scoutid,regData,councilname,CSRF,verifyByError,pageid) {
	var parentid='';
	var narrow=[];
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			servErrCnt=0;
			resetLogoutTimer(url);
			
			var adultmatches=JSON.parse(this.response);
			if(adultmatches.length ==0 ) {
				// no matches found AT ALL. for the given email.  Invite new parent or maybe check for a name match yuk no, not good because jim jones may have dozens of responses
				sendNewParentAcctInvitePar(unitID,denpatrol,scoutid,regData,councilname,CSRF,verifyByError,pageid);
			} else {
				if(nameMatch(adultmatches[0].name,regData.P1FirstName + ' ' + regData.P1LastName)==true ) {
					//we have a match
					 parentid=adultmatches[0].userID;
					 sendNewParentExistAcctInvitePar(unitID,denpatrol,scoutid,regData,councilname,CSRF,parentid,pageid);
				} else {
					//email matches but not name
					alert('An account in the system with the email for ' +regData.P1FirstName + ' ' + regData.P1LastName + ' was found, but the name on the account is ' +adultmatches[0].name +'.  You will need to invite this parent by manually adding a connection');
					//sendNewParentAcctInvite(unitID,denpatrol,scoutid,regData,councilname,CSRF);
					nextParentPar(unitID,denpatrol,scoutid,regData,councilname,pageid);
				}
			}
		}
	};
   var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connectioninvite.asp?ScoutUserID='+scoutid;
   var formPost='Action=SearchUsers&UserSearch=' + encodeURIComponent(regData.P1Email1).replace(/%20/g,'+');

   xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formPost);
			
	xhttp.onerror = function() {
		 if (servErrCnt > maxErr) {
			 $.mobile.loading('hide');
			alert('Halted due to excessive Server errors');
			closeCSVImportPar(pageid);
			return;
		 }
		 servErrCnt++;
		// mbArrPtr=errmbArrPtr;
		setTimeout(function() {searchForParentByEmailPar(unitID,denpatrol,scoutid,regData,councilname,CSRF,verifyByError,pageid);},1000);
			//window.console &&console.log("error getting scoutlist " + xhttp.status);
			//alert('error sending');
	};
}

//new 8/29
function sendNewParentExistAcctInvitePar(unitID,denpatrol,scoutid,regData,councilname,CSRF,parentid,pageid) {
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,closeCSVImportPar,[pageid],sendNewParentExistAcctInvitePar,[unitID,denpatrol,scoutid,regData,councilname,CSRF,parentid,pageid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			
			if (this.response.indexOf('Invitation Sent!') == -1 ) {
				alert('Halted due to error sending invite Scout ' + regData.FirstName +  ' ' + regData.LastName + ' parent  ' + regData.P1FirstName + ' ' + regData.P1LastName + ' may have a different name with the same the requested email ' + regData.P1Email1 + '.  The parent connection was not made to avoid problems. ');
				nextParentPar(unitID,denpatrol,scoutid,regData,councilname,pageid);
					
				return;
			}
			// go edit the adult's account. 
			
			setTimeout(function () {
				getUpdateParentProfilePar(unitID,denpatrol,scoutid,regData,councilname,parentid,true,pageid)
			},1000);
		}
	};
	
    //var msg='batch invite test';	
    var msg=encodeURIComponent(regData.P1PersonalMessage).replace(/%20/g,'+');
    var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connectioninvite.asp?ScoutUserID='+scoutid;
	
    var formPost='Action=Submit';
	formPost += '&CSRF='+CSRF;
	formPost += '&AdultUserID='+parentid;
	formPost += '&ConnectionFirstName=';
	formPost += '&ConnectionLastName=';
	formPost += '&ConnectionEmail=';
	formPost += '&ConnectionEmail2=';
	formPost += '&ConnectionRelationship=Parent%2FGuardian';
	formPost += '&PersonalMessage='+msg;

    xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formPost);
			
	xhttp.onerror = function() {
		 errStatusHandle(500,closeCSVImportPar,[pageid],sendNewParentExistAcctInvitePar,[unitID,denpatrol,scoutid,regData,councilname,CSRF,parentid,pageid]);
	};
}








// this parent does not have a parentid, not found in scoutbook
function sendNewParentAcctInvitePar(unitID,denpatrol,scoutid,regData,councilname,CSRF,verifyByError,pageid) {
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,closeCSVImportPar,[pageid], sendNewParentAcctInvitePar,[unitID,denpatrol,scoutid,regData,councilname,CSRF,verifyByError,pageid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			
			if (this.response.indexOf('Invitation Sent!') == -1 ) {

				if(verifyByError != '') {

					if(this.response.indexOf('A user with the same email address is already connected') != -1) {

						var parentid=verifyByError;
						setTimeout(function () {
						updatescoutconnectionParConAlready(unitID,denpatrol,scoutid,regData,parentid,councilname,pageid);
						},200);
						return;
					}
				}
				var err='server error';
				if(this.response.indexOf('showErrorPopup') != -1) {
				   err=this.response.match(/showErrorPopup\(([^\)]+)/)[1].replace(/<[^>]+>/g,'');
				}
				if(this.response.indexOf('Whoops') != -1) {
				   err='Whoops error encountered';
				}				
				alert('There was an error sending invite: ' + err);
				//closeCSVImportPar(pageid);
				setTimeout(function () {				
					nextParentPar(unitID,denpatrol,scoutid,regData,councilname,pageid);
				},200);
				return;
			}
			// go edit the adult's account.  But, have to find the adult's id first
			// to get there, go to scouts account page and find the name
			setTimeout(function () {
				getNewParentConnectionIDPar(unitID,denpatrol,scoutid,regData,councilname,pageid);
			},1000);
		}
	};
	
    //var msg='batch invite test';	
    var msg=encodeURIComponent(regData.P1PersonalMessage).replace(/%20/g,'+');
    var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connectioninvite.asp?ScoutUserID='+scoutid;
    var formPost='Action=Submit';
	formPost += '&CSRF='+CSRF;
	formPost += '&Gender='+regData.P1Gender;
	formPost += '&AdultUserID=';
	formPost += '&ConnectionFirstName='+encodeURIComponent(regData.P1FirstName).replace(/%20/g,'+');
	formPost += '&ConnectionLastName='+encodeURIComponent(regData.P1LastName).replace(/%20/g,'+');
	formPost += '&ConnectionEmail='+encodeURIComponent( regData.P1Email1);
	formPost += '&ConnectionEmail2='+encodeURIComponent(regData.P1Email2);
	formPost += '&ConnectionRelationship=Parent%2FGuardian';
	//formPost += '&PermissionFullControl=on&';
	formPost += '&PersonalMessage='+msg;

    xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formPost);
			
	xhttp.onerror = function() {
		errStatusHandle(500,closeCSVImportPar,[pageid], sendNewParentAcctInvitePar,[unitID,denpatrol,scoutid,regData,councilname,CSRF,verifyByError,pageid]);
	};
}


function getNewParentConnectionIDPar(unitID,denpatrol,scoutid,regData,councilname,pageid) {
	var found=false;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,closeCSVImportPar,[pageid], getNewParentConnectionIDPar,[unitID,denpatrol,scoutid,regData,councilname,pageid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			servErrCnt=0;
			//console.log('getNewParentConnectionIDPar response');
			resetLogoutTimer(url);	
			var document=this.response;
			var connectionid=[]
			for(var i=0;i<$('a[href*="ConnectionID"]',document).length;i++) {
				if(nameMatch(regData.P1Nickname + ' ' + regData.P1LastName ,$('a[href*="ConnectionID"]',document)[i].text.trim())==true) {
					
					if(	$('a[href*="ConnectionID"]',document)[i].href.match(/ConnectionID=(\d+)/)==null) {			
						 $.mobile.loading('hide');
						alert('Unexpected error in getNewParentConnectionIDPar 1');
						closeCSVImportPar(pageid);
						return;					
					
					}
					
					connectionid.push($('a[href*="ConnectionID"]',document)[i].href.match(/ConnectionID=(\d+)/)[1]);
					//do a get to find adult id to edit profile? 
					found=true;
				}
			}
			if(found==false) {
				for(var i=0;i<$('a[href*="ConnectionID"]',document).length;i++) {
					if(nameMatch(regData.P1FirstName + ' ' + regData.P1LastName ,$('a[href*="ConnectionID"]',document)[i].text.trim())==true) {
						
					if(	$('a[href*="ConnectionID"]',document)[i].href.match(/ConnectionID=(\d+)/)==null) {			
						 $.mobile.loading('hide');
						alert('Unexpected error in getNewParentConnectionIDPar 2');
						closeCSVImportPar(pageid);
						return;					
					
					}						

						connectionid.push($('a[href*="ConnectionID"]',document)[i].href.match(/ConnectionID=(\d+)/)[1]);

					}				//its possible that the original account does not have a Nickname.
				}
			}
			
			
			// this is an error case; probably Nickname mismatch
			// match on teh last name.  View connection asps of all lastname matches to find one that has an email match.  Crazy.  However; if there IS a Nickname mismatch
			// we know an account already exists, so....  no bother continuing on to edit the profile
			
			if(connectionid.length==0) {
				setTimeout(function () {
				nextParentPar(unitID,denpatrol,scoutid,regData,councilname,pageid);
				},200);	
				return;
			}
			
			setTimeout(function () {
				getParentIDFromConnectionPar(unitID,denpatrol,scoutid,regData,councilname,connectionid,pageid);
			},500);					
			
		}
	};
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/admin/account.asp?UnitID=' + unitID +'&DenID=&PatrolID=&ScoutUserID=' + scoutid;
	xhttp.open("GET", url, true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,closeCSVImportPar,[pageid], getNewParentConnectionIDPar,[unitID,denpatrol,scoutid,regData,councilname,pageid]);
	};
}


function getParentIDFromConnectionPar(unitID,denpatrol,scoutid,regData,councilname,connectionID,pageid) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,closeCSVImportPar,[pageid], getParentIDFromConnectionPar,[unitID,denpatrol,scoutid,regData,councilname,connectionID,pageid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			servErrCnt=0;
			//console.log('getParentIDFromConnectionPar response');
			resetLogoutTimer(url);	
			if($('a[href*="editprofile.asp"]',this.response).length==0) {

				alert('Could not update new parent profile for ' + regData.P1FirstName + ' ' + regData.P1LastName );
				setTimeout(function () {
					nextParentPar(unitID,denpatrol,scoutid,regData,councilname,pageid);
				},200);
				return;
			}
			
			
			//verify the email is correct
			if($('a[href*="MAILTO"]',this.response).length==0) {
				//isn't one.  MBC maybe, skip, try next
				if(connectionID.length==1) {
					// exit out - find next thing that can be processed
					setTimeout(function () {
					nextParentPar(unitID,denpatrol,scoutid,regData,councilname,pageid);
					},200);
					return;
				} 
				connectionID.shift();
				setTimeout(function () {
				getParentIDFromConnectionPar(unitID,denpatrol,scoutid,regData,councilname,connectionID,pageid);
				},200);
				return;
			}
			if($('a[href*="MAILTO"]',this.response)[0].text.trim().toUpperCase() == regData.P1Email1.toUpperCase()) {
		
				if(	$('a[href*="editprofile.asp"]',this.response)[0].href.match(/AdultUserID=(\d+)/)==null) {			
					 $.mobile.loading('hide');
					alert('Unexpected error in getParentIDFromConnectionPar');
					closeCSVImportPar(pageid);
					return;						
				}				

				var parentid=$('a[href*="editprofile.asp"]',this.response)[0].href.match(/AdultUserID=(\d+)/)[1];			
				setTimeout(function () {
					//edit the parent profile
					getUpdateParentProfilePar(unitID,denpatrol,scoutid,regData,councilname,parentid,false,pageid);
				},500);						
			} else {
				if(connectionID.length==1) {
					// exit out - find next thing that can be processed
					setTimeout(function () {
					  nextParentPar(unitID,denpatrol,scoutid,regData,councilname,pageid);
					},200);
					return;
				} 
				connectionID.shift();
				setTimeout(function () {
				  getParentIDFromConnectionPar(unitID,denpatrol,scoutid,regData,councilname,connectionID,pageid);
				},200);
				return;				
				
			}
		}
	};

	var url='https://' + host + 'scoutbook.com/mobile/dashboard/admin/connection.asp?ScoutUserID=' + scoutid +'&ConnectionID='+connectionID[0]+ '&UnitID=' + unitID + regData.DenPatrolID;
	xhttp.open("GET", url, true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		 errStatusHandle(500,closeCSVImportPar,[pageid], getParentIDFromConnectionPar,[unitID,denpatrol,scoutid,regData,councilname,connectionID,pageid]);
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
function getUpdateParentProfilePar(unitID,denpatrol,scoutid,regData,councilname,parentid,exist,pageid) {
	
	if(exist==true) {
		nextParentPar(unitID,denpatrol,scoutid,regData,councilname,pageid);

		return;
	}
	
	
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,closeCSVImportPar,[pageid], getUpdateParentProfilePar,[unitID,denpatrol,scoutid,regData,councilname,parentid,exist,pageid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			servErrCnt=0;
			resetLogoutTimer(url);	
				
				// modify formPost
			var formPost=$('#editProfileForm', this.response).serialize();
			
			if(formPost=='') {
				alert('Could not update parent profile for ' + regData.P1FirstName + ' ' + regData.P1LastName );
				setTimeout(function () {
					nextParent(unitID,denpatrol,scoutid,regData,councilname,pageid);
				},500);				
				return;
			}
			
				
				if(getToken(formPost,'Address1') != '' || getToken(formPost,'Nickname')!=''|| getToken(formPost,'Suffix')!=''|| getToken(formPost,'HomePhone')!=''|| getToken(formPost,'MobilePhone')!=''|| getToken(formPost,'WorkPhone')!='') {
					setTimeout(function () {
						nextParentPar(unitID,denpatrol,scoutid,regData,councilname,pageid);
					},200);	
					return;
				}
			
				formPost=tokenVal(formPost,'MiddleName',encodeURIComponent(regData.P1MiddleName).replace(/%20/g,'+'));
				formPost=tokenVal(formPost,'Suffix',encodeURIComponent(regData.P1Suffix).replace(/%20/g,'+'));	
				formPost=tokenVal(formPost,'Nickname',encodeURIComponent(regData.P1Nickname).replace(/%20/g,'+'));
				if(regData.P1Address1=='') {
					formPost=tokenVal(formPost,'Address1',encodeURIComponent(regData.Address1).replace(/%20/g,'+'));
				} else {
					formPost=tokenVal(formPost,'Address1',encodeURIComponent(regData.P1Address1).replace(/%20/g,'+'));
				}
				if(regData.P1Address2=='') {
					formPost=tokenVal(formPost,'Address2',encodeURIComponent(regData.Address2).replace(/%20/g,'+'));
				} else {
					formPost=tokenVal(formPost,'Address2',encodeURIComponent(regData.P1Address2).replace(/%20/g,'+'));
				}				
				if(regData.P1City=='') {
					formPost=tokenVal(formPost,'City',encodeURIComponent(regData.City).replace(/%20/g,'+'));
				} else {
					formPost=tokenVal(formPost,'City',encodeURIComponent(regData.P1City).replace(/%20/g,'+'));
				}				
				if(regData.P1State=='') {
					formPost=tokenVal(formPost,'State',regData.State);
				} else {
					formPost=tokenVal(formPost,'State',regData.P1State);
				}
				if(regData.P1Zip=='') {
					formPost=tokenVal(formPost,'Zip',regData.Zip);
				} else {
					formPost=tokenVal(formPost,'Zip',regData.P1Zip);
				}				
				if(regData.P1HomePhone=='') {
					formPost=tokenVal(formPost,'HomePhone',regData.HomePhone);
				} else {
					formPost=tokenVal(formPost,'HomePhone',regData.P1HomePhone);
				}					
				formPost=tokenVal(formPost,'WorkPhone',regData.P1WorkPhone);
				if(regData.P1MobilePhone=='') {
					formPost=tokenVal(formPost,'MobilePhone',regData.MobilePhone);
				} else {
					formPost=tokenVal(formPost,'MobilePhone',regData.P1MobilePhone);
				}					
				
				var initBSAnum=getToken(formPost,'BSAMemberID');
				
				if(initBSAnum == '') {
					if(regData.P1BSAMemberID != '') {
						formPost=tokenVal(formPost,'BSAMemberID',regData.P1BSAMemberID);
						//formPost=tokenVal(formPost,'BSAMemberIDConfirm',regData.P1BSAMemberID);  //?????  does this get set if num changes?
					}
				} else {
					if(initBSAnum != regData.P1BSAMemberID) {
						if(regData.P1BSAMemberID != '') {
							formPost=tokenVal(formPost,'BSAMemberID',regData.P1BSAMemberID);
							//formPost=tokenVal(formPost,'BSAMemberIDConfirm',regData.P1BSAMemberID);  //?????	
						}						
					}
				
				}

				if(getToken(formPost,'CouncilID')=='') {
					formPost=tokenVal(formPost,'CouncilID',regData.CouncilID);
				}
				
				if(getToken(formPost,'DistrictID') == '') {
					if(getToken(formPost,'CouncilID')== regData.CouncilID) {
						formPost=tokenVal(formPost,'DistrictID',regData.DistrictID);
					}
					
				}
				setTimeout(function () {
					//edit the parent profile
					postUpdateParentProfilePar(unitID,denpatrol,scoutid,regData,councilname,parentid,formPost,pageid);
				},500);						
	
		}
	};
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/admin/editprofile.asp?AdultUserID='+parentid+'&UnitID=' + unitID +'&DenID=&PatrolID=';
	xhttp.open("GET", url, true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		 errStatusHandle(500,closeCSVImportPar,[pageid], getUpdateParentProfilePar,[unitID,denpatrol,scoutid,regData,councilname,parentid,exist,pageid]);
	};
	
}

function postUpdateParentProfilePar(unitID,denpatrol,scoutid,regData,councilname,parentid,formPost,pageid) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,closeCSVImportPar,[pageid], postUpdateParentProfilePar,[unitID,denpatrol,scoutid,regData,councilname,parentid,formPost,pageid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			servErrCnt=0;
			resetLogoutTimer(url);

			if (this.response.indexOf('Update successful!') == -1 ) {
				
				if (this.response.indexOf('If this is a new BSA #') != -1) {
					formPost = formPost.replace(/BSAMemberIDConfirm=\d*&/,'BSAMemberIDConfirm=1&');
					
					setTimeout(function () {
						postUpdateParentProfile(unitID,denpatrol,scoutid,regData,councilname,parentid,formPost,pageid);
					},500);	
					return;
				}					
				
				
				//got an error.  
				var derr='';
				var errmsg=this.response.match(/showErrorPopup\(([^\)]+)/);
				if(errmsg != null) {
					 derr=errmsg[1].replace(/<strong>|<\/strong>|<p>|<\/p>/g,'');
				}
				alert('Halted due to parent profile update error ' + derr  + ' Stopped on ' + getToken(formPost,'FirstName') + ' ' + getToken(formPost,'LastName'));
				closeCSVImportPar(pageid);
				return;					
			}
			
			setTimeout(function () {
				nextParentPar(unitID,denpatrol,scoutid,regData,councilname,pageid);
			},500);
		}
	};
	
 
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/editprofile.asp?ScoutUserID=&AdultUserID='+parentid+'&UnitID=' + unitID;
    xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formPost);
			
	xhttp.onerror = function() {
		errStatusHandle(500,closeCSVImportPar,[pageid], postUpdateParentProfilePar,[unitID,denpatrol,scoutid,regData,councilname,parentid,formPost,pageid]);
	};
	
}

//updates an existing connection to add as parent
//if allowleader is true, the Adult Leader connection should be posted.  Otherwise, it should be removed
function addAsParentToScoutPar(unitID,denpatrol,scoutid,regData,connectionid,allowleader,councilname,formpost,pageid) {
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,closeCSVImportPar,[pageid], addAsParentToScoutPar,[unitID,denpatrol,scoutid,regData,connectionid,allowleader,councilname,formpost,pageid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			servErrCnt=0;
			resetLogoutTimer(url);
			
			if(this.response.indexOf(".mobile.changePage('connections.asp?ScoutUserID=") == -1 ) {
				alert('Halted due to error setting connection to parent');	
				closeCSVImportPar(pageid);
				return;			
			}
			//next scout	
			setTimeout(function () {
				//nextparent
				nextParentPar(unitID,denpatrol,scoutid,regData,councilname,pageid);
	
			},500);
		}
	};
	
	var leader='';
	
	if (allowleader==true) leader='&ConnectionRelationship=Adult+Leader';

    var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connection.asp?ScoutUserID='+scoutid+'&ConnectionID='+connectionid+'&UnitID='+unitID+  regData.DenPatrolID;//'&DenID=&PatrolID=';
    var formPost='Action=Submit&ConnectionRelationship=Parent%2FGuardian'+leader+'&PermissionFullControl=on';

	if(formpost.match(/Guardian/) == null) {
		var formPost=formpost.replace('Action=Submit&','Action=Submit&ConnectionRelationship=Parent%2FGuardian&');
	} else {
		var formPost=formpost;
	}
	
	
	
    xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formPost);
			
	xhttp.onerror = function() {
		 errStatusHandle(500,closeCSVImportPar,[pageid], addAsParentToScoutPar,[unitID,denpatrol,scoutid,regData,connectionid,allowleader,councilname,formpost,pageid]);
	};
}

function nextParentPar(unitID,denpatrol,scoutid,regData,councilname,pageid) {
	if(regData.AddParent2 == 'yes') {
		//copy data over
		//for(i=21;i<40;i++) {
		//	regData[i]=regData[i+19];
		//}
		for(var propt in regData){
			if(propt.slice(0,2)=='P1') {
				regData[propt] = regData['P2'+propt.slice(2)];	
			    //alert(propt + ': ' + regData[propt]);
			}
		}
		
		regData.AddParent1=regData.AddParent2;
		//reg[40]='no';
		regData.AddParent2='no'
		
		
		var undoleader=false;  // not needed here
		checkAdminConnectedByNamePar(unitID,denpatrol,scoutid,regData,false,councilname,undoleader,pageid);		//why true???
	} else {
		getNewRosterPar(unitID,denpatrol,pageid);
	}
}

function updatescoutconnectionPar(unitID,denpatrol,scoutid,regData,parentid,councilname,pageid) {
// Then , go back to the scout connection page because they are now a connected leader and need to be added as a parent.  NOTE..  a leader NOT a parent
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,closeCSVImportPar,[pageid], updatescoutconnectionPar,[unitID,denpatrol,scoutid,regData,parentid,councilname,pageid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			servErrCnt=0;
			resetLogoutTimer(url);
				
		
			if(this.response.indexOf(".attr('data-connectionid',") == -1 ) {
				alert('Halted due to error setting connectionmanager to parent');	
				closeCSVImportPar(pageid);
				return;			
			}
			
			setTimeout(function () {
				var undoleader=true;
				checkAdminConnectedByNamePar(unitID,denpatrol,scoutid,regData,false,councilname,undoleader,pageid);  //will call addAsParentToScoutPar(unitID,denpatrol,scoutid,regData,connectionid);
			},500);
		}
	};

    var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connectionsmanager.asp?Action=UpdateConnection&UnitID='+unitID+ regData.DenPatrolID;//'&DenID=&PatrolID=';
    var formPost='PermissionID=3&ConnectionID=&UserID='+scoutid+'&ConnectedUserID='+parentid;
 
    xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formPost);
			
	xhttp.onerror = function() {
		errStatusHandle(500,closeCSVImportPar,[pageid], updatescoutconnectionPar,[unitID,denpatrol,scoutid,regData,parentid,councilname,pageid]);
	};
}

function updatescoutconnectionParConAlready(unitID,denpatrol,scoutid,regData,parentid,councilname,pageid) {
// Then , go back to the scout connection page because they are now a connected leader and need to be added as a parent.  NOTE..  a leader NOT a parent
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,closeCSVImportPar,[pageid], updatescoutconnectionParConAlready,[unitID,denpatrol,scoutid,regData,parentid,councilname,pageid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			servErrCnt=0;
			resetLogoutTimer(url);
				
		
			if(this.response.indexOf(".attr('data-connectionid',") == -1 ) {
				alert('Halted due to error setting connectionmanager to parent');	
				closeCSVImportPar(pageid);
				return;			
			}
			
			setTimeout(function () {
				var undoleader=false;
				checkAdminConnectedByNamePar(unitID,denpatrol,scoutid,regData,false,councilname,undoleader,pageid);  //will call addAsParentToScoutPar(unitID,denpatrol,scoutid,regData,connectionid);
			},500);
		}
	};

    var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connectionsmanager.asp?Action=UpdateConnection&UnitID='+unitID+ regData.DenPatrolID;//'&DenID=&PatrolID=';
    var formPost='PermissionID=3&ConnectionID=&UserID='+scoutid+'&ConnectedUserID='+parentid;
 
    xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formPost);
			
	xhttp.onerror = function() {
		errStatusHandle(500,closeCSVImportPar,[pageid], updatescoutconnectionParConAlready,[unitID,denpatrol,scoutid,regData,parentid,councilname,pageid]);
	};
}



// need to present user with search choices
var globunitID; 
var globdenpatrol; 
var globscoutid; 
var globregData; 
var globcouncilname; 
var globadultlist=[];




function getsendNewParentAcctInvitePar(unitID,denpatrol,scoutid,regData,councilname,verifyByError,pageid) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,closeCSVImportPar,[pageid], getsendNewParentAcctInvitePar,[unitID,denpatrol,scoutid,regData,councilname,verifyByError,pageid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			servErrCnt=0;
			resetLogoutTimer(url);	

				if($('input[name="CSRF"]',this.response).length==0) {
					alert('Halted due to connection invite errors 1');
					closeCSVImportPar(pageid);				
				}
				var CSRF=$('input[name="CSRF"]',this.response).val();
				setTimeout(function () {
					searchForParentByEmailPar(unitID,denpatrol,scoutid,regData,councilname,CSRF, verifyByError,pageid);
					//sendNewParentAcctInvitePar(unitID,denpatrol,scoutid,regData,councilname,CSRF,verifyByError);
				},500);						
	
		}
	};
	var url='https://' + host + 'scoutbook.com/mobile/dashboard/admin/connectioninvite.asp?ScoutUserID=' + scoutid+ '&UnitID=' + unitID +'&DenID=&PatrolID=';
	xhttp.open("GET", url, true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,closeCSVImportPar,[pageid], getsendNewParentAcctInvitePar,[unitID,denpatrol,scoutid,regData,councilname,verifyByError,pageid]);
	};
}


