// Copyright © 9/26/2019 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.

/*Council User Stats

Export the file

District
	Pack
		counts
			30	60	90	beyond
		Percentage
			30	60	90	beyond		
	Troop
		counts
			30	60	90	beyond
		Percentage
			30	60	90	beyond	
	Crew
		counts
			30	60	90	beyond
		Percentage
			30	60	90	beyond	
	Ship
		counts
			30	60	90	beyond
		Percentage
			30	60	90	beyond	

	Totals
		counts
			30	60	90	beyond
		Percentage
			30	60	90	beyond	
District

Council Totals


*/
var districts = [];
var counciltot = [];

function addRawGenericReport(data, pageid, title, content) {



	var startfunc;
	var endfunct;
	var newdata;

	data = data.replace(/"topHeader/, '"topHeader noprint');

	startfunc = data.indexOf('<span style="margin-left: 5px; ">', 1);
	endfunct = data.indexOf('</h1>', 1);

	newdata = data.slice(0, startfunc);
	newdata += '<span style="margin-left: 5px; ">';
	newdata += title;
	newdata += '</span>';
	newdata += data.slice(endfunct);

	data = newdata;

	startfunc = data.indexOf('<div data-role="content" style="padding-bottom: 0">');
	endfunct = data.indexOf('style', startfunc);

	newdata = data.slice(0, endfunct) + ' class="noprint" ' + data.slice(endfunct);
	data = newdata;



	// replace content
	startfunc = data.indexOf('<div data-role="content">');
	endfunct = data.indexOf('</div><!-- /content -->');
	newdata = data.slice(0, startfunc);

	newdata += content;
	/*	
		newdata+= '<div data-role="content">plain text\n';
		newdata+= '<div id="footer" align="center">\n';
				
		
		newdata+= '<div style="margin-top: 6px;">&copy; 2019 Boy Scouts of America &bull; <a href="/mobile/help/privacy.asp">Privacy</a></div>\n';
		newdata+= '	<div><a href="/" data-ajax="false"><img src="https://d1kn0x9vzr5n76.cloudfront.net/mobile/images/scoutbookbsalogo400.png" width="200"></a></div>\n';
	 	newdata+= '   <div style="color:#d2cab6">AWSWEBSCTBK3C</div> \n';           
		
		newdata+= '		</div>\n';

			
		newdata+= '	<div data-role="popup" id="errorPopup" data-overlay-theme="a" class="ui-content" data-theme="e" data-transition="fade">\n';
		newdata+= '		<a href="#" id="closePopupButton" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>\n';
		newdata+= '		<div id="errorPopupIcon"></div>\n';
		newdata+= '		<div id="errorPopupContent"></div>\n';
		newdata+= '		<div class="clearRight"></div>\n';
		newdata+= '	</div>	\n';
		
	*/

	newdata += data.slice(endfunct);
	data = newdata;

	//


	var idx = data.indexOf('function pageShow()');
	startfunc = data.indexOf('function pageShow() {', idx + 1);

	newdata = data.slice(0, startfunc);
	newdata += "window.console && console.log('defining pageShow()');\n";
	newdata += data.slice(startfunc);
	data = newdata;



	var idx = data.indexOf('function pageShow()');
	startfunc = data.indexOf('function pageShow() {', idx + 1);
	//any non space

	startfunc += 'function pageShow() {'.length + 2;


	//startfunc = data.indexOf('function showErrorPopup(msg');

	newdata = data.slice(0, startfunc);


	newdata += "		$('#buttonExportStats','#Page" + pageid + "').click(function () {\n";
	newdata += "			var tdata='';\n";
	newdata += "			$('table','#Page" + pageid + "').each( function () {\n";
	newdata += "				tdata += htmTableToCsv( $(this).attr('id'),'#Page" + pageid + "' );\n";
	newdata += "			});\n";
	newdata += "			saveText('Council User Statistics ' + logTime(Date.now())+'.csv',tdata);\n";
	newdata += "		});	\n";


	newdata += data.slice(startfunc);
	data = newdata;


	var scriptloc = startfunc;
	startfunc = data.indexOf('</script>', scriptloc);
	startfunc += 9;
	//add style
	newdata = data.slice(0, startfunc);
	newdata += '	<style type="text/css">';
	newdata += '		#Page' + escapeHTML(pageid) + ' .ui-select .ui-btn-icon-right .ui-btn-inner	{ padding-left: 10px; padding-right: 35px; }\n';
	newdata += '		#Page' + escapeHTML(pageid) + ' .ui-select .ui-btn-icon-right .ui-icon		{ right: 10px; }\n';
	newdata += '		#Page' + escapeHTML(pageid) + ' #popupDeleteLog								{ max-width: 400px; }\n';
	newdata += '		#Page' + escapeHTML(pageid) + ' .smallText		{ color: gray; margin-top: 15px; }\n';
	newdata += '		#Page' + escapeHTML(pageid) + ' img.imageSmall	{ position: relative; width: 30px; height: 30px; top: -5px; border: 1px solid gray; }\n';

	newdata += '		#Page' + escapeHTML(pageid) + " .divider				{ margin-left: 30px; color: #5f5f5f !important; font-family: 'Roboto Slab', serif !important; }\n";
	newdata += '		#Page' + escapeHTML(pageid) + ' .divider:hover,\n';
	newdata += '		#Page' + escapeHTML(pageid) + ' .dividerImage:hover		{ cursor: pointer; }\n';
	newdata += '		#Page' + escapeHTML(pageid) + ' .dividerImage			{ position: absolute; top: 11px; left: 12px; height: 22px; }\n';

	newdata += '		#Page' + escapeHTML(pageid) + '   td  {  padding-left:3px; padding-right:3px;}';
	newdata += '		#Page' + escapeHTML(pageid) + '   th  {  padding-left:3px; padding-right:3px;}';



	newdata += '	@media (min-width: 40em) {\n';
	newdata += '		#Page' + escapeHTML(pageid) + ' .ui-grid-a .ui-block-a	{ padding-right: 8px; }\n';
	newdata += '		#Page' + escapeHTML(pageid) + ' .ui-grid-a .ui-block-b	{ padding-left: 8px; }\n';
	newdata += '	}\n';

	newdata += '	@media all and (max-width: 40em) {\n';
	newdata += '		#Page' + escapeHTML(pageid) + ' .ui-grid-a .ui-block-a,\n';
	newdata += '		#Page' + escapeHTML(pageid) + ' .ui-grid-a .ui-block-b {\n';
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
	newdata += '		td {  padding-left:3px; padding-right:3px;}';
	newdata += '		th {  padding-left:3px; padding-right:3px;}';
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



	newdata += '		@media all and (min-width: 8em) {  \n'; //4420
	newdata += '		    .ui-field-contain label.ui-input-text {\n';
	newdata += '		        vertical-align:middle;\n';
	newdata += '		        text-align:right;\n';
	newdata += '		        display: inline-block;\n';
	newdata += '		        width: 45%;		\n'; //increase here 30
	newdata += '		       margin: 0 2% 0 0\n';
	newdata += '		   }\n';



	newdata += '		   .ui-field-contain input.ui-input-text,.ui-field-contain textarea.ui-input-text,.ui-field-contain .ui-input-search,.ui-field-contain div.ui-input-text {\n';
	newdata += '		       width: 52%;  \n'; //decrease width here 68
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

	newdata += '		#Page' + escapeHTML(pageid) + ' div.ui-field-contain.ui-body.ui-br { width: 240px; }\n';
	newdata += '		#Page' + escapeHTML(pageid) + ' div.ui-checkbox { width: 223px; }\n';
	newdata += '	</style>';



	newdata += data.slice(startfunc);
	data = newdata;


	startfunc = data.indexOf('<div style="margin-top: 6px;">&copy;');
	newdata = data.slice(0, startfunc);
	newdata += '<div style="margin-top: 6px;">This page was produced by the Feature Assistant Extension/Add-on and is not supported by BSA</div>';
	data = newdata + data.slice(startfunc);




	return data;
}


function addRawCouncilUserStats(data, pageid) {
	// find the firt </ul>  and insert li prior
	var startpt = data.indexOf('_users.csv');

	var startfunc = data.indexOf('</ul>', startpt);
	if (startfunc != -1) {


		var newdata = '	<li class="cstat" id="cstatDivider" data-theme="d" >';
		newdata += '    <a href="#councilStat" id="councilstat" >'; //data-rel="popup" data-transition="slideup"		
		newdata += '	<div id ="statistics">';
		newdata += '		Unit Usage Statistics';
		newdata += '	</div>';
		newdata += '	</a>';
		newdata += '</li>';


		data = data.slice(0, startfunc) + newdata + data.slice(startfunc);

		startfunc = data.indexOf('function showErrorPopup(msg)');
		var myfunc = '' + statscr;
		myfunc = myfunc.slice(21).slice(0, -1).replace(/\#PageX/g, '#Page' + escapeHTML(escapeHTML(pageid)));
		data = data.slice(0, startfunc) + myfunc + '\n' + data.slice(startfunc);


	}
	return data;
}


function statscr() {

	$('#councilstat', '#PageX').click(function () {
		deccu('#PageX');
		return false;
	});

}


function setCSTPageContent() {

	//use districts and counciltot to build a table of html

	var utype = ['pack', 'troop', 'crew', 'ship', 'subtot'];
	var ntype = ['Packs', 'Troops', 'Crews', 'Ships', 'All Units'];
	cstRpt = false;

	var newdata = '';

	newdata += '		<div data-role="content" class="ui-content printcontent">';
	newdata += '			<ul data-role="listview" data-theme="d" data-inset="true">'; //theme d white  inset means inside a border 
	newdata += '				<li id="csttitleLI" data-theme="a">';
	newdata += '				Unit Types with User Activity';
	newdata += '				</li>';
	newdata += '				<li id="cstExplainLI" data-theme="d">';
	newdata += '				<div class="NormalText norm">These reports show counts of units in each unit type with login activity grouped by when the activity took place.  Separate tables are presented for each district and there is also a summary Council wide table</div>';
	newdata += '				</li>';
	newdata += '				<li id="cstrptLI" data-theme="d">';
	newdata += '				  <div id="cstTable" >\n'; //class="printonly seeprint"	

	for (var i = 0; i < districts.length; i++) {

		newdata += '				  	<table id="district' + i + '" style="font-weight: normal">\n';
		newdata += '				  	<tr><th style="padding:5px; border-bottom: 1px solid #ddd;">' + districts[i].District + '</th>';
		newdata += '				  	<th style="padding:5px; border-bottom: 1px solid #ddd;">Within 30 Days</th>';
		newdata += '				  	<th style="padding:5px; border-bottom: 1px solid #ddd;">Within 60 Days</th>';
		newdata += '				  	<th style="padding:5px; border-bottom: 1px solid #ddd;">Within 90 Days</th>';
		newdata += '				  	<th style="padding:5px; border-bottom: 1px solid #ddd;">Over 90 Days</th>';
		newdata += '				  	<th style="padding:5px; border-bottom: 1px solid #ddd;">Total</th></tr>\n';

		for (var u = 0; u < utype.length; u++) {
			newdata += '				<tr><td style="padding:5px; border-bottom: 1px solid #ddd;">' + ntype[u] + '</td>';
			newdata += '				<td style="padding:5px; border-bottom: 1px solid #ddd;"><meter class=" mrotate seeprint greenmeter" value="' + districts[i][utype[u] + '30'] + '" min="0" max="' + districts[i][utype[u] + 'All'] + '"></meter><br>' + districts[i][utype[u] + '30'] + '</td>';
			newdata += '				<td style="padding:5px; border-bottom: 1px solid #ddd;"><meter class=" mrotate seeprint yellowmeter" value="' + districts[i][utype[u] + '60'] + '" min="0" max="' + districts[i][utype[u] + 'All'] + '"></meter><br>' + districts[i][utype[u] + '60'] + '</td>';
			newdata += '				<td style="padding:5px; border-bottom: 1px solid #ddd;"><meter class=" mrotate seeprint orangemeter" value="' + districts[i][utype[u] + '90'] + '" min="0" max="' + districts[i][utype[u] + 'All'] + '"></meter><br>' + districts[i][utype[u] + '90'] + '</td>';
			newdata += '				<td style="padding:5px; border-bottom: 1px solid #ddd;"><meter class=" mrotate seeprint redmeter" value="' + districts[i][utype[u] + 'None'] + '" min="0" max="' + districts[i][utype[u] + 'All'] + '"></meter><br>' + districts[i][utype[u] + 'None'] + '</td>';
			newdata += '				<td style="padding:5px; border-bottom: 1px solid #ddd;"><br>' + districts[i][utype[u] + 'All'] + '</td></tr>\n';
		}


		newdata += '				  	</table>\n';
		newdata += '				  	<br><br>\n';
	}



	newdata += '				  	<table id="council" style="padding:5px; font-weight: normal">\n';
	newdata += '				  	<tr><th style="padding:5px; border-bottom: 1px solid #ddd;">Council</th>';
	newdata += '				  	<th style="padding:5px; border-bottom: 1px solid #ddd;">Within 30 Days</th>';
	newdata += '				  	<th style="padding:5px; border-bottom: 1px solid #ddd;">Within 60 Days</th>';
	newdata += '				  	<th style="padding:5px; border-bottom: 1px solid #ddd;">Within 90 Days</th>';
	newdata += '				  	<th style="padding:5px; border-bottom: 1px solid #ddd;">Over 90 Days</th>';
	newdata += '				  	<th style="padding:5px; border-bottom: 1px solid #ddd;">Total</th></tr>\n';
	for (var u = 0; u < utype.length; u++) {
		newdata += '						<tr><td style="padding:5px; border-bottom: 1px solid #ddd;">' + ntype[u] + '</td>';
		newdata += '						<td style="padding:5px; border-bottom: 1px solid #ddd;"><meter class=" mrotate seeprint greenmeter" value="' + counciltot[utype[u] + '30'] + '" min="0" max="' + counciltot[utype[u] + 'All'] + '"></meter><br>' + counciltot[utype[u] + '30'] + '</td>';
		newdata += '						<td style="padding:5px; border-bottom: 1px solid #ddd;"><meter class=" mrotate seeprint yellowmeter" value="' + counciltot[utype[u] + '60'] + '" min="0" max="' + counciltot[utype[u] + 'All'] + '"></meter><br>' + counciltot[utype[u] + '60'] + '</td>';
		newdata += '						<td style="padding:5px; border-bottom: 1px solid #ddd;"><meter class=" mrotate seeprint orangemeter" value="' + counciltot[utype[u] + '90'] + '" min="0" max="' + counciltot[utype[u] + 'All'] + '"></meter><br>' + counciltot[utype[u] + '90'] + '</td>';
		newdata += '						<td style="padding:5px; border-bottom: 1px solid #ddd;"><meter class=" mrotate seeprint redmeter" value="' + counciltot[utype[u] + 'None'] + '" min="0" max="' + counciltot[utype[u] + 'All'] + '"></meter><br>' + counciltot[utype[u] + 'None'] + '</td>';
		newdata += '				  	    <td style="padding:5px; border-bottom: 1px solid #ddd;"><br>' + counciltot[utype[u] + 'All'] + '</td></tr>\n';
	}


	newdata += '				  	</table>\n';
	newdata += '				  </div>\n'; //	end of id=summaryTable	
	newdata += '				</li>';

	//CSV button
	//export csv
	newdata += '			<li>';
	newdata += '	  		<div id="statCSV" style="height:40px;" class="noprint">\n';
	newdata += '				<div  style="float: right; text-align: right;" class="noprint">\n';
	newdata += '					<a data-role="button" data-theme="d" data-inline="true" data-mini="true" href="#" id="buttonExportStats" >\n';
	newdata += '						<div style="margin-left: 30px; position: relative; ">\n';
	newdata += '							<img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/clouddownload48.png" style="position: absolute; width: 24px; left: -30px; top: -4px; " />\n';
	newdata += '							Export Statistics Csv\n';
	newdata += '						</div>\n';
	newdata += '					</a>\n';
	newdata += '				</div>\n';
	newdata += '			</div>\n';
	newdata += '			</li>';

	newdata += '			</ul>';
	//newdata += '		</div>';   //data-role content

	newdata += '		<div id="footer" align="center">';
	newdata += '			<div style="margin-top: 6px;">&copy; ' + escapeHTML(cyear()) + '- Boy Scouts of America &bull; <a href="/mobile/help/privacy.asp">Privacy</a></div>';
	newdata += '			<div><a href="/" data-ajax="false"><img src="https://d1kn0x9vzr5n76.cloudfront.net/mobile/images/scoutbookbsalogo400.png" width="200"></a></div>';
	newdata += '		</div>';

	newdata += '		<style type="text/css">';

	newdata += '		meter.redmeter::-webkit-meter-optimum-value {';
	newdata += '		    background: red; /* Green */';
	newdata += '		}	';

	newdata += '		meter.yellowmeter::-webkit-meter-optimum-value {';
	newdata += '		    background: yellow; /* Green */';
	newdata += '		}	';

	newdata += '		meter.greenmeter::-webkit-meter-optimum-value {';
	newdata += '		    background: green; /* Green */';
	newdata += '		}	';

	newdata += '		meter.orangemeter::-webkit-meter-optimum-value {';
	newdata += '		    background: #FF8C00; /* Green */';
	newdata += '		}	';

	newdata += '		.norm {font-weight:normal}';

	//newdata += '		meter. mrotate::-webkit-transform:  rotate(90deg)';

	newdata += '		</style>';




	return newdata;

	/*  to be inside of pageShow()
			$('#buttonExportStats','#PageX').click(function () {
				saveText('Council User Statistics ' + logTime(Date.now())+'.csv',htmTableToCsv('sumTable'));
			});
	*/


}

//Scoutbook User ID	BSA Member ID	First Name	Last Name	Adult	Position	Scoutbook Unit ID	Unit	District	Charter Name	Advancement Sync	Date Last Login	Date Invited

function deccu(pageid) {
	var UserStat = {
		csvArray: [],
		ScoutbookUserID: '',
		Adult: '',
		Position: '',
		ScoutbookUnitID: '',
		Unit: '',
		District: '',
		DateLastLogin: '',
		nameArray: [
			['Scoutbook User ID', 'ScoutbookUserID'],
			['Adult', 'Adult'],
			['Position', 'Position'],
			['Scoutbook Unit ID', 'ScoutbookUnitID'],
			['Unit', 'Unit'],
			['District', 'District'],
			['Date Last Login', 'DateLastLogin']
		]
	};
	captureCouncilUsers(UserStat, pageid);
}

function captureCouncilUsers(UserStat, pageid) {

	$.mobile.loading('show', {
		theme: 'a',
		text: 'Getting Council Users Data',
		textonly: false
	});

	var councilid = $('a[href*="councilusers.asp?CouncilID="]', pageid).attr('href').match(/CouncilID=(\d+)/)[1];
	//get from current page

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			$.mobile.loading('hide');
			if (this.response.indexOf('Whoops!') != -1) {
				alert('Scoutbook Whoops! when getting Council Users CSV');
				return;
			} else {
				//debugger;
				UserStat.csvArray = parseCSV(this.response);
				keyFill(UserStat);
				processStats(UserStat);
			}
		}
	}

	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/reports/councilusers.asp?CouncilID=' + councilid + '&Action=Download';
	xhttp.open("GET", url, true);
	xhttp.responseType = "text";
	xhttp.send();
	xhttp.onerror = function () {
		// should handle
	}
}

// this function associates csv column to the UserStat key names
function keyFill(UserStat) {
	for (var i = 0; i < UserStat.nameArray.length; i++) {
		for (var j = 0; j < UserStat.csvArray[0].length; j++) {
			if (UserStat.csvArray[0][j] == UserStat.nameArray[i][0]) {
				UserStat[UserStat.nameArray[i][1]] = j;
				break;
			}
		}
	}

}

function processStats(UserStat) {

	var hdr = UserStat.csvArray.shift();
	var idx = UserStat.ScoutbookUnitID;
	UserStat.csvArray.sort(function (a, b) {
		var x = a[idx].toLowerCase();
		var y = b[idx].toLowerCase();
		if (x < y) {
			return -1;
		}
		else if (x > y) {
			return 1;
		}
		return 0;
	});

	// put header row back
	UserStat.csvArray.unshift(hdr);
	var unitObj = [];

	var lastunit = '';
	var foundunit = '';
	for (var i = 1; i < UserStat.csvArray.length; i++) {

		if (lastunit != UserStat.csvArray[i][UserStat.ScoutbookUnitID]) {
			unitObj.push({
				recent: 100,
				ScoutbookUnitID: UserStat.csvArray[i][UserStat.ScoutbookUnitID],
				Unit: UserStat.csvArray[i][UserStat.Unit],
				District: UserStat.csvArray[i][UserStat.District]
			});
		}

		if (parseInt(unitObj[unitObj.length - 1].recent) != 30) {

			//unitObj['ScoutbookUnitID']=UserStat.csvArray[i][UserStat.ScoutbookUnitID];
			if (UserStat.csvArray[i][UserStat.Adult] == "True") {
				if (parseInt(recentDate(UserStat.csvArray[i][UserStat.DateLastLogin])) < parseInt(unitObj[unitObj.length - 1].recent)) {
					unitObj[unitObj.length - 1].recent = parseInt(recentDate(UserStat.csvArray[i][UserStat.DateLastLogin]));
				}
			}
		}



		lastunit = UserStat.csvArray[i][UserStat.ScoutbookUnitID]
	}




	//stats by district, unit type, 30, 60, 90
	districts = [];
	for (var i = 0; i < unitObj.length; i++) {
		// array  object Key, Object val
		pushUniqueKey(districts, 'District', unitObj[i].District);
	}

	//init counts int he array of objects
	for (var d = 0; d < districts.length; d++) {
		districts[d]['pack30'] = 0;
		districts[d]['pack60'] = 0;
		districts[d]['pack90'] = 0;
		districts[d]['packNone'] = 0;
		districts[d]['packAll'] = 0;

		districts[d]['troop30'] = 0;
		districts[d]['troop60'] = 0;
		districts[d]['troop90'] = 0;
		districts[d]['troopNone'] = 0;
		districts[d]['troopAll'] = 0;

		districts[d]['crew30'] = 0;
		districts[d]['crew60'] = 0;
		districts[d]['crew90'] = 0;
		districts[d]['crewNone'] = 0;
		districts[d]['crewAll'] = 0;

		districts[d]['ship30'] = 0;
		districts[d]['ship60'] = 0;
		districts[d]['ship90'] = 0;
		districts[d]['shipNone'] = 0;
		districts[d]['shipAll'] = 0;

		districts[d]['subtot30'] = 0;
		districts[d]['subtot60'] = 0;
		districts[d]['subtot90'] = 0;
		districts[d]['subtotNone'] = 0;
		districts[d]['subtotAll'] = 0;

		districts[d]['unitAll'] = 0;
	}

	counciltot = {};
	counciltot['pack30'] = 0;
	counciltot['pack60'] = 0;
	counciltot['pack90'] = 0;
	counciltot['packNone'] = 0;
	counciltot['packAll'] = 0;

	counciltot['troop30'] = 0;
	counciltot['troop60'] = 0;
	counciltot['troop90'] = 0;
	counciltot['troopNone'] = 0;
	counciltot['troopAll'] = 0;

	counciltot['crew30'] = 0;
	counciltot['crew60'] = 0;
	counciltot['crew90'] = 0;
	counciltot['crewNone'] = 0;
	counciltot['crewAll'] = 0;

	counciltot['ship30'] = 0;
	counciltot['ship60'] = 0;
	counciltot['ship90'] = 0;
	counciltot['shipNone'] = 0;
	counciltot['shipAll'] = 0;

	counciltot['subtot30'] = 0;
	counciltot['subtot60'] = 0;
	counciltot['subtot90'] = 0;
	counciltot['subtotNone'] = 0;
	counciltot['subtotAll'] = 0;

	for (var d = 0; d < districts.length; d++) {
		for (var i = 0; i < unitObj.length; i++) {
			if (unitObj[i].District == districts[d].District) {

				var unitType = unitObj[i].Unit.match(/Pack|Troop|Crew|Ship/)[0];
				unitType = unitType.toLowerCase();

				//if(unitObj[i].Unit.match(/Pack/) != null) {
				if (unitObj[i].recent == 30) {
					//inc this district unit 30 cnt
					districts[d][unitType + '30'] += 1;
					districts[d].subtot30 += 1; //any unit
					districts[d][unitType + 'All'] += 1;
					districts[d].unitAll += 1;
					districts[d].subtotAll += 1;

					counciltot[unitType + '30'] += 1;
					counciltot[unitType + 'All'] += 1;
					counciltot.subtot30 += 1;
					counciltot.subtotAll += 1;
				}
				if (unitObj[i].recent == 60) {
					//inc this district pack 60 cnt
					districts[d][unitType + '60'] += 1;
					districts[d].subtot60 += 1;
					districts[d][unitType + 'All'] += 1;
					districts[d].unitAll += 1;
					districts[d].subtotAll += 1;

					counciltot[unitType + '60'] += 1;
					counciltot[unitType + 'All'] += 1;
					counciltot.subtot60 += 1;
					counciltot.subtotAll += 1;

				}
				if (unitObj[i].recent == 90) {
					//inc this district pack 90 cnt
					districts[d][unitType + '90'] += 1;
					districts[d].subtot90 += 1;
					districts[d][unitType + 'All'] += 1;
					districts[d].unitAll += 1;
					districts[d].subtotAll += 1;

					counciltot[unitType + '90'] += 1;
					counciltot[unitType + 'All'] += 1;
					counciltot.subtot90 += 1;
					counciltot.subtotAll += 1;

				}

				if (unitObj[i].recent == 100) {
					//inc this district pack none
					districts[d][unitType + 'None'] += 1;
					districts[d].subtotNone += 1;
					districts[d][unitType + 'All'] += 1;
					districts[d].unitAll += 1;
					districts[d].subtotAll += 1;

					counciltot[unitType + 'None'] += 1;
					counciltot[unitType + 'All'] += 1;
					counciltot.subtotNone += 1;
					counciltot.subtotAll += 1;
				}

				// }
			}
		}
	}

	/*
	var outdata='';
	for(var d=0;d<districts.length;d++) {
		for(var i=0;i<unitObj.length;i++) {
			if(unitObj[i].District == districts[d].District) {
				  
				var unitType=unitObj[i].Unit.match(/Pack|Troop|Crew|Ship/)[0];
				unitType=unitType.toLowerCase();
				  
				if(unitObj[i].recent == 100) {
					outdata += unitObj[i].District +','+ unitObj[i].Unit +'\r\n';

				}
			}
		}
	}
	saveText('District NonUsers.csv',outdata);
	*/

	//hav data
	//debugger;
	//var unitid=$('a[href*="UnitID="]').attr('href').match(/\d+/)[0];

	cstRpt = true;
	$.mobile.changePage(
		//'/mobile/dashboard/',
		'/mobile/dashboard/reports/councilusers.asp', {
			allowSamePageTransition: true,
			transition: 'none',
			showLoadMsg: true,
			reloadPage: true
		}
	);
}

function recentDate(indate) {
	if (indate == '') {
		return 100;
	}

	var dv = dateDiff(nowDate(), indate) / 1000 / 60 / 60 / 24;

	if (parseInt(dv) < 31) {
		return 30;
	}
	else if (parseInt(dv) < 61) {
		return 60;
	}
	else if (parseInt(dv) < 91) {
		return 90;
	}
	return 100;
}

function pushUniqueKey(arr, key, val) {
	if (arr.length > 0) {
		
		for (var x = 0; x < arr.length; x++) {
			if (arr[x][key] == val) {
				return true;
			}
		}
	}
	var obj = {};
	obj[key] = val;
	arr.push(JSON.parse(JSON.stringify(obj)));
	return false;
}

function saveText(filename, text) {
	var tempElem = document.createElement('a');
	tempElem.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	tempElem.setAttribute('download', filename);
	document.body.appendChild(tempElem);
	tempElem.click();
	tempElem.remove();
}