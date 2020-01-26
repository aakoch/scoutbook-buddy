// Copyright © 9/26/2019 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.

var payRptDebug=false;
var recipientlist='';
var myid='';
var payTotalsIn=[];
function addRawGeneralReport(data,pageid,unitID,txtunit,title,content) {
	payRpt=false;
	var startfunc;
	var endfunct;
	var newdata;
	//	<div data-role="content" style="padding-bottom: 0; font-size: 12px; font-weight: normal; "><ul data-role="listview" data-inset="true" style="margin-top: 0; margin-bottom: 0;" class="ui-icon-alt" data-theme="d"><li data-theme="g"><div id="21" class="redBanner" data-dismissable="False">Maintenance Advisory: There will be a brief maintenance window starting at 10:30 AM CDT, Thursday, December 5, 2019 for Scoutbook.com. We apologize for any inconvenience. Thank you.</div></li></ul></div><div data-role="content" style="padding-bottom: 0; font-size: 12px; font-weight: normal; "><ul data-role="listview" data-inset="true" style="margin-top: 0; margin-bottom: 0;" class="ui-icon-alt" data-theme="d"><li data-theme="e"><div id="18" class="goldBanner" data-dismissable="True">Users are reporting issues when using Internet Explorer to view the calendar. Please try using Google Chrome, Firefox, or another browser if you are having this issue.</div></li></ul></div>

	data=data.replace(/<div data-role="page"/,'<div data-role="page" class="printwhite"');
	
	
	//data=data.replace(/data-theme="h"/g,'data-theme="d"');
	
	data=data.replace(/"topHeader/,'"topHeader noprint');
	
	data=data.replace(/<div data-role="content" style="padding-bottom:/g,'<div data-role="content" class="noprint" style="padding-bottom:');
	
//	data=data.replace(/<title>/,'<title>xx');
	
//	startfunc = data.indexOf('<link rel="stylesheet"');
//	data=data.slice(0,startfunc) +'<link rel="stylesheet" type="text/css" href="/includes/mobile-concat.css" media="print">\n<-- injected -->\n' + data.slice(startfunc);


	
	startfunc = data.indexOf("$('#buttonRefresh'",1);
	
	var myfunc = '' + pzscript;				
	myfunc = myfunc.slice(22).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(pageid)).replace(/UnitID=X/g,'UnitID='+ escapeHTML(unitID));
	newdata = data.slice(0,startfunc) + myfunc + '\n'  + data.slice(startfunc);			
	data=newdata;				
	
	
	startfunc = data.indexOf('<span style="margin-left: 5px; ">',1);
	endfunct = data.indexOf('</h1>',1);				
	
	newdata = data.slice(0,startfunc);
	newdata += '<span style="margin-left: 5px; ">';
	newdata += '		<a href="#" id="buttonRefresh1" class="text">'+escapeHTML(txtunit)+'</a>';

	//newdata += '           Scout Payment Balance Report';
	newdata += title;
	newdata += '</span>';
	newdata +=  data.slice(endfunct);
	
	data = newdata;

	

	startfunc = data.indexOf('<a id="goBack"',1);
	endfunct = data.indexOf('<img src',startfunc);
	
	myfunc = '<a href="#" id="buttonRefresh2" >';
	newdata = data.slice(0,startfunc) + myfunc + '\n'  + data.slice(endfunct);
	data = newdata;	
	
    startfunc = data.indexOf('<div data-role="content" style="padding-bottom: 0">');
	endfunct = data.indexOf('style',startfunc);
	
	
	
	newdata= data.slice(0,endfunct) + ' class="noprint" ' + data.slice(endfunct);
	data=newdata;
	
	// replace content
	startfunc = data.indexOf('<div data-role="content">');
	endfunct = data.indexOf('</div><!-- /content -->');
	newdata = data.slice(0,startfunc);				
	
	//newdata += setPayReportPageContent(txtunit);
	newdata += content;
	newdata +=  data.slice(endfunct);				
	data=newdata;
	
	
		// add button function
		
		//  "#Page' + escapeHTML(pageid)+'"

	startfunc = data.indexOf("$('#buttonRefresh");
	newdata = '	$("#buttonSendEmail","#Page' + escapeHTML(pageid)+'").click(function() {\n';	
	newdata += '    	procProfileForPay("'+escapeHTML(unitID)+'","'+escapeHTML(pageid)+'");\n';
	newdata += '	});\n';
	newdata += '	$("#buttonPrepSendEmail","#Page' + escapeHTML(pageid)+'").click(function() {\n';	
	newdata += "	    $('#BalanceMessage','#Page" + escapeHTML(pageid)+"').show()\n";
	newdata += '	});\n';	
	newdata += '	$("#buttonPreviewEmail","#Page' + escapeHTML(pageid)+'").click(function() {\n';	
	newdata += '    	 previewGetID("'+escapeHTML(unitID)+'","'+ escapeHTML(pageid)+'");\n';
	newdata += '	});\n';
	data=data.slice(0,startfunc) + newdata + data.slice(startfunc);
	
	
	
	startfunc = data.indexOf("$('#buttonRefresh");
	newdata = "	$('#buttonTransactionReport','#Page" + escapeHTML(pageid)+"').click(function() {\n";
	newdata += '		initTransReport("'+escapeHTML(unitID)+'","#Page'+ pageid +'","'+txtunit+'");\n';
	newdata += '	});\n';
	data=data.slice(0,startfunc) + newdata + data.slice(startfunc);	
	
	
	
	startfunc = data.indexOf("$('#buttonRefresh");
	newdata = '	$("#divider","#Page' + escapeHTML(pageid)+'").on("click",function() {\n';
	
	newdata += '$("#unitTransDetail","#Page' + escapeHTML(pageid)+'").toggle();\n';
	
	newdata += "	if( $('li.unitTransDetail:visible', '#Page" + escapeHTML(pageid)+"').length == 0) {\n";
	newdata += "		$('li.unitTransDetail','#Page" + escapeHTML(pageid)+"').slideDown(600);\n";
	newdata += "	} else {\n";
	newdata += "		$('li.unitTransDetail','#Page" + escapeHTML(pageid)+"').slideUp(600);	\n";
	newdata += "	}\n";
	newdata += '});\n';
	
	
	newdata += "		$('#periodEndDate', '#Page" + escapeHTML(pageid)+"').bind('change', function() {\n";
	newdata += "			$('div[id="+'"ped"'+"]', '#Page" + escapeHTML(pageid)+"').text($(this).val())\n;";
	newdata += "		});\n";	
	newdata += "		$('#periodStartDate', '#Page" + escapeHTML(pageid)+"').bind(" +'"change"' +", function() {\n";
	newdata += "			$('div[id="+'"psd"'+"]', '#Page" + escapeHTML(pageid) +"').text($(this).val());\n";
	newdata += "		});	\n";	
	

	
	data=data.slice(0,startfunc) + newdata + data.slice(startfunc);	
	
	
	
	var scriptloc=startfunc;
	startfunc = data.indexOf('</script>',scriptloc);
	startfunc +=9;
	//add style
	newdata = data.slice(0,startfunc);
	newdata += '	<style type="text/css">';
	newdata += '		#Page' + escapeHTML(pageid) +' .ui-select .ui-btn-icon-right .ui-btn-inner	{ padding-left: 10px; padding-right: 35px; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' .ui-select .ui-btn-icon-right .ui-icon		{ right: 10px; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' #popupDeleteLog								{ max-width: 400px; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' .smallText		{ color: gray; margin-top: 15px; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' img.imageSmall	{ position: relative; width: 30px; height: 30px; top: -5px; border: 1px solid gray; }\n';

	newdata += '		#Page' + escapeHTML(pageid) +" .divider				{ margin-left: 30px; color: #5f5f5f !important; font-family: 'Roboto Slab', serif !important; }\n";
	newdata += '		#Page' + escapeHTML(pageid) +' .divider:hover,\n';
	newdata += '		#Page' + escapeHTML(pageid) +' .dividerImage:hover		{ cursor: pointer; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' .dividerImage			{ position: absolute; top: 11px; left: 12px; height: 22px; }\n';	

	newdata += '		#Page' + escapeHTML(pageid) +'   td  {  padding-left:3px; padding-right:3px;}';	
	newdata += '		#Page' + escapeHTML(pageid) +'   th  {  padding-left:3px; padding-right:3px;}';	

	//newdata += '		#Page' + escapeHTML(pageid) +'   .printwhite {background:#ffffff;}';		
	
	newdata += '	@media (min-width: 40em) {\n';
	newdata += '		#Page' + escapeHTML(pageid) +' .ui-grid-a .ui-block-a	{ padding-right: 8px; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' .ui-grid-a .ui-block-b	{ padding-left: 8px; }\n';
	newdata += '	}\n';

	newdata += '	@media all and (max-width: 40em) {\n';
	newdata += '		#Page' + escapeHTML(pageid) +' .ui-grid-a .ui-block-a,\n';
	newdata += '		#Page' + escapeHTML(pageid) +' .ui-grid-a .ui-block-b {\n';
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
	newdata += '			@page { width:8.5in !important; margin:0 !important; }\n';
	newdata += '		div {  font-size:x-small;}';
	newdata += '		table {  font-size:x-small;}';	
	newdata += '		td {  padding-left:3px; padding-right:3px;}';	
	newdata += '		th {  padding-left:3px; padding-right:3px;}';	
	newdata += '		.pgbreaka {page-break-after: always;}\n';
	newdata += '		.pgbreakb {page-break-before: always;}\n';
	newdata += '		.printwhite {background:#ffffff !important;}\n';	
	newdata += '		body { \n';
	//newdata += '			background:#ffffff;\n';
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

//	newdata += '		.printwhite {background-color:#ffffff !important;}\n';		
	
	newdata += '	}\n';		
	
	
	
	newdata += '		@media all and (min-width: 8em) {  \n';  //4420
	newdata += '		    .ui-field-contain label.ui-input-text {\n';
	newdata += '		        vertical-align:middle;\n';
	newdata += '		        text-align:right;\n';
	newdata += '		        display: inline-block;\n';
	newdata += '		        width: 45%;		\n';  //increase here 30
	newdata += '		       margin: 0 2% 0 0\n';
	newdata += '		   }\n';

				
	
	newdata += '		   .ui-field-contain input.ui-input-text,.ui-field-contain textarea.ui-input-text,.ui-field-contain .ui-input-search,.ui-field-contain div.ui-input-text {\n';
	newdata += '		       width: 52%;  \n';  //decrease width here 68
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

	newdata += '		#Page' + escapeHTML(pageid) +' div.ui-field-contain.ui-body.ui-br { width: 240px; }\n';
	newdata += '		#Page' + escapeHTML(pageid) +' div.ui-checkbox { width: 223px; }\n';			
	newdata += '	</style>';
	newdata +=  data.slice(startfunc);				
	data=newdata;				

	// add script.  
	startfunc = data.indexOf('</script>',scriptloc);
	
	var myfunc = '' + pyscript;
	
	myfunc = myfunc.slice(22).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(pageid)).replace(/UnitID=X/g,'UnitID='+ escapeHTML(unitID)).replace(/txtunit/g,escapeHTML(txtunit));

	newdata = data.slice(0,startfunc+9) +'<script type="text/javascript">\n'+ myfunc + '\n</script>\n'  + data.slice(startfunc+9);			
	data=newdata;			
	
	startfunc = data.indexOf('<div style="margin-top: 6px;">&copy;');
	newdata = data.slice(0,startfunc);
	newdata += '<div style="margin-top: 6px;">This page was produced by the Feature Assistant Extension/Add-on and is not supported by BSA</div>';	
	data=newdata + data.slice(startfunc);
	
	

	
return data;				
}

/*

Special processing for the Unit Account

Do not include Unit Account at the the Top

Report should look like

Joe	$5
Tom	$10
Pete ($7)

Unit Account with Receivable Balances  $xx
Unit Account Balance $yy

Total Balance		$zz


To calculate the Unit Account Receivables - simply balance sumtot

To calculate the Unit Account Balance - =receivables - sum of negative scout balances)
*/

function setPayReportPageContent(unitid,txtunit) {

	

	var newdata='';
	var offs={acctOffset:-1};
		
	

	
	newdata += '		<div data-role="content" class="ui-content printcontent">';	
	
								//shows to left of previous element
	newdata += '				<div style="float: right; text-align: right; " class="noprint" >\n';	
	newdata+=  '					<input type="checkbox" data-theme="d" data-inline="true" data-mini="true" name="lastInitial" id="LastInitial" value="All">\n';
	newdata+=  '					<label for="LastInitial" >\n';
	newdata+=  '						<div style="margin-left: 10px; ;">\n';
	newdata+=  '							Last Name Initial\n';
	newdata+=  '						</div>\n';
	newdata+=  '					</label>\n';	
	newdata += '				</div>\n';
	newdata += '				<div class="clearRight"></div>';	
	
	
	
	//newdata += ' <a href="javascript:window.print()"><img src="https://d3hdyt7ugiz6do.cloudfront.net/mobile/images/icons/dashboardBSA48.png" alt="print this page" id="print-button" /></a>';
	newdata += '			<ul data-role="listview" data-theme="d" data-inset="true">';   //theme d white  inset means inside a border 
	newdata += '				<li id="payRptTitleLI" data-theme="d">\n';
	
				var d = new Date(Date.now());	
				var yr = d.getFullYear();
				var mon = d.getMonth() +1;
				var day = d.getDate();
				var tm= d.getHours() + ':'+d.getMinutes();
				var tdt= mon+'/'+day+'/'+yr+ ' ' + tm;
				
	newdata += '				'+txtunit+' Payment Balance Report   \n<span style="font-weight:normal;">&nbsp&nbsp&nbsp&nbsp Print Date:' + tdt +'</span>\n';	
	newdata += '				</li>\n';	
	newdata += '				<li id="payrptLI" data-theme="d">';
	newdata += '				  <div id="summaryTable">\n';	
	
	newdata +=                     summaryTable('',offs,txtunit);
	
	newdata += '				  </div>\n';	//	end of id=summaryTable	
	newdata += '				</li>';	
	newdata += '			</ul>';
	
	
	//export csv
	newdata += '	  		<div id="summCSV" style="height:40px;" class="noprint">\n';
	newdata += '				<div  style="float: right; text-align: right;" class="noprint">\n';
	newdata += '					<a data-role="button" data-theme="d" data-inline="true" data-mini="true" href="#" id="buttonExportSumCsv" >\n';
	newdata += '						<div style="margin-left: 30px; position: relative; ">\n';
	newdata += '							<img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/clouddownload48.png" style="position: absolute; width: 24px; left: -30px; top: -4px; " />\n';
	newdata += '							Export Summary Csv\n';
	newdata += '						</div>\n';
	newdata += '					</a>\n';
	newdata += '				</div>\n';	
	newdata += '			</div>\n';	

	var trec=63;
	
	if(offs.acctOffset > -1) {
	  trec-=3;
	  trec-=4; //new
	}
	//manual page break. Yuk.
	newdata += '			<div class="printonly seeprint"><table>';	
	//page can have 87 scout records plus unit account(3) plus header(1) plus footer(1).  If there are more than 87
	//
	
	// New ( page can have 83 scout records plus unit account(7) plus header(1) plus footer(1).  

	if(trec-payTotals.length > 0) {
		for(var i=0;i< trec-payTotals.length;i++) {	//60 -
			newdata += '					<tr><td>&nbsp;</td></tr>\n';
		}		
	}
	newdata += '			</table></div>';	
	
	// page breaks aren't working. Ugh
	//newdata += '			<div class="pgbreaka">&nbsp;</div>';
	//newdata += '			<div class="pgbreakb">&nbsp;</div>';
	//newdata += '			<p style="page-break-after: always;">&nbsp;</p>\n';
	//newdata += '			<p style="page-break-before: always;">&nbsp;</p>\n';

	newdata += '			<ul data-role="listview" id="ulTbl" data-inset="true" style="margin-top: 0;" class="ui-icon-alt noprint" data-theme="d">\n';
	newdata += '				<li id="divider" data-theme="d" class="noprint">\n';
	newdata += '					<div>\n';
	newdata += '						<img class="dividerImage noprint" src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/ReportsBSA100gray.png">\n';
	newdata += '						<div class="divider noprint">Unit Transaction Detail</div>\n';
	newdata += '					</div>\n';
	newdata += '				</li>\n';
			
	newdata += '				<li class="unitTransDetail ui-icon-alt noprint" data-theme="d" style="display:none; height=42px;">\n';
	newdata += '					<form id="trans" action="#" method="post" >';
	newdata += '					<div style="height=42px;" class="noprint"><div class="ui-grid-b ui-responsive" >';
	newdata += '						<div class="ui-block-a" >';
	newdata += '		        			<input type="text" name="PeriodStartDate" id="periodStartDate" value="" class="calendar noprint" placeholder="period start" />';
	newdata += '						</div>\n';
	newdata += '						<div class="ui-block-b" >';
	newdata += '		        			<input type="text" name="PeriodEndDate" id="periodEndDate" value="" class="calendar noprint" placeholder="period end" />';
	newdata += '						</div>\n';
	newdata += '						<div class="ui-block-c" >';
	newdata += '							<div style="float: right; text-align: right; " class="sendEmail noprint">\n';
	newdata += '								<a data-role="button" data-theme="d" data-inline="true" data-mini="true" href="#" id="buttonTransactionReport" >\n';
	newdata += '									<div style="margin-left: 30px; position: relative; ">\n';
	newdata += '										<img src="https://d3hdyt7ugiz6do.cloudfront.net/mobile/images/icons/reportsorange48.png" style="position: absolute; width: 24px; left: -30px; top: -4px; " />\n';
	newdata += '										View Unit Transaction Report\n';
	newdata += '									</div>\n';
	newdata += '								</a>\n';
	newdata += '							</div>\n';	
	for(var i=0;i<payTotals.length;i++) {
		if (payTotals[i].lastname == 'Account' && payTotals[i].firstname == 'UnitPaylog') {

	newdata += '							<div style="float: right; text-align: right; " class="noprint" >\n';	
	newdata+=  '							<input type="checkbox" data-theme="d" data-inline="true" data-mini="true" name="ExternalTransactions" id="ExternalTransactions" value="All">\n';
	newdata+=  '								<label for="ExternalTransactions" >\n';
	newdata+=  '									<div style="margin-left: 10px; ;">\n';
	newdata+=  '										External Transaction Filter\n';
	newdata+=  '									</div>\n';
	newdata+=  '								</label>\n';	
	newdata += '							</div>\n';
	newdata += '							<div class="clearRight noprint"></div>';		

			break;
		}
	}
	newdata += '						</div>\n';
	newdata += '					</div></div>\n';
	
	newdata += '	  		<div id="transCSV" style="display:none; height:40px;" class="noprint">\n';
	newdata += '				<div  style="float: right; text-align: right;" class="noprint">\n';
	newdata += '					<a data-role="button" data-theme="d" data-inline="true" data-mini="true" href="#" id="buttonExportTransCsv" >\n';
	newdata += '						<div style="margin-left: 30px; position: relative; ">\n';
	newdata += '							<img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/clouddownload48.png" style="position: absolute; width: 24px; left: -30px; top: -4px; " />\n';
	newdata += '							Export Transaction Csv\n';
	newdata += '						</div>\n';
	newdata += '					</a>\n';
	newdata += '				</div>\n';	
	newdata += '			</div>\n';		
	
	

	newdata += '					</form>\n';
	

	
	
	newdata += '					<div style="height=42px;" class="printonly"><div class="ui-grid-b ui-responsive" >';
	newdata += '						<div class="ui-block-a" >';
	newdata += '                            Start Date:<div id="psd">earliest</div>\n';
	newdata += '						</div>\n';
	newdata += '						<div class="ui-block-b" >';
	newdata += '                            End Date:<div id="ped">current</div>\n';
	newdata += '						</div>\n';
	newdata += '					</div></div>\n';
	newdata += '				<div id="transTable" onmousedown="isKeyPressed(event)">\n';
	newdata += '				</div>\n';	
	newdata += '				</li>\n';
	
//	newdata += '				<li class="unitTransDetail ui-icon-alt printonly" data-theme="d" style="display:none; height=42px;">\n';	

//	newdata += '				</li>\n';	
	
	newdata += '         	</ul>\n';


	
	newdata += '	  		<div style="height:40px;" class="noprint">\n';
	
	newdata += '				<div style="float: right; text-align: right; " class="sendEmail">\n';
	newdata += '					<a data-role="button" data-theme="d" data-inline="true" data-mini="true" href="#" id="buttonPrepSendEmail">\n';
	newdata += '						<div style="margin-left: 30px; position: relative; ">\n';
//	newdata += '							<img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/clouddownload48.png" style="position: absolute; width: 24px; left: -30px; top: -4px; " />\n';
	newdata += '							<img src="'+localpath+'emailedit48.png" style="position: absolute; width: 24px; left: -30px; top: -4px; " />\n';
	newdata += '							Prepare Balance Message\n';
	newdata += '						</div>\n';
	newdata += '					</a>\n';
	newdata += '				</div>\n';



	
	newdata += '				<div id="BalanceMessage" class="noprint" style="display:none;">\n'	
	newdata += '					<label class="text-orange">';
	newdata += '						Message: NOTE: Use #scout# for personalized Scout name and #balance# for personalized balance and #link# for a link to their Scout account ';
	newdata += '					</label>';
	newdata += '					<textarea name="BalanceMessageText" id="BalTxt" rows="6"  data-theme="d">The Scout Account for #scout# has a [i]balance due[/i] of $#amount#. For transaction details, please #link view #scout#\'s Payment Log# in Scoutbook.</textarea>';



	//newdata += '					<div  class="sendEmail">\n';
	//newdata += '					<a data-role="button" width="max" data-theme="d" data-inline="true"  href="#" id="buttonPreviewEmail">\n';
	
	newdata += '					<div style="float: right; text-align: right; " class="sendEmail">\n';
	newdata += '						<a data-role="button" data-theme="g" data-inline="true" data-mini="true" href="#" id="buttonPreviewEmail">\n';
	newdata += '							<div style="margin-left: 30px; position: relative; ">\n';
	newdata += '								<img src="'+localpath+'emaillook48.png" style="position: absolute; width: 24px; left: -30px; top: -4px; " />\n';
	newdata += '								Preview Balance Message\n';
	newdata += '							</div>\n';
	newdata += '						</a>\n';
	newdata += '					</div>\n';	
	
	newdata += '					<div style="float: right; text-align: right; margin-top: -5px;" >\n';	
	newdata+=  '						<input type="number"  name="dueAmt" id="DueAmt" value="0"  class="ui-input-text" step="0.01" style="font-size:14px">';
//	newdata+=  '						<label for="dueAmt" >\n';
//	newdata+=  '							<div style="margin-left: 10px;  position: relative;">\n';
//	newdata+=  									'Max balance\n';
//	newdata+=  '							</div>\n';
//	newdata+=  '						</label>\n';
	newdata += '					</div>\n';	
	
	newdata += '					<div style="float: right; text-align: right; " >\n';	
	newdata+=  '						<input type="checkbox" style="width:223;" data-theme="d" data-inline="true" data-mini="true" name="PastDueOnly" checked="checked" id="PastDueOnly" value="All">\n';
	newdata+=  '						<label for="PastDueOnly" >\n';
	newdata+=  '							<div style="margin-left: 10px;  position: relative;">\n';
	newdata+=  									'Only Balances Less Than\n';
	newdata+=  '							</div>\n';
	newdata+=  '						</label>\n';
	newdata += '					</div>\n';		

	newdata += '					<div class="clearRight"></div>';
	newdata += '					<div id="PreviewMessageDiv" class="noprint" style="display:none;">\n';
	newdata += '						<ul data-role="listview" data-theme="d" data-inset="true">\n';
	newdata += '							<li id="PreviewMessage" data-theme="d" style="font-weight: normal; white-space:pre-wrap;">';	
	newdata += '							</li>\n';
	newdata += '						</ul>\n';	
	newdata += '					</div>\n';		

	newdata += '					<div style="float: right; text-align: right; " class="sendEmail">\n';
	newdata += '						<a data-role="button" data-theme="g" data-inline="true" data-mini="true" href="#" id="buttonSendEmail">\n';
	newdata += '							<div style="margin-left: 30px; position: relative; ">\n';
	newdata += '								<img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/emailgray48.png" style="position: absolute; width: 24px; left: -30px; top: -4px; " />\n';
	newdata += '								Send Balance Message\n';
	newdata += '							</div>\n';
	newdata += '						</a>\n';
	newdata += '					</div>\n';		
	
	newdata += '					<div style="float: right; text-align: right; " >\n';	
	newdata+=  '						<input type="checkbox" data-theme="d" data-inline="true" data-mini="true" name="Bcc" id="Bcc" value="All">\n';
	newdata+=  '						<label for="Bcc" >\n';
	newdata+=  '							<div style="margin-left: 10px; ;">\n';
	newdata+=  									'BCC\n';
	newdata+=  '							</div>\n';
	newdata+=  '						</label>\n';	
	newdata += '					</div>\n';	

	newdata += '					<div style="float: right; text-align: right; " >\n';	
	newdata+=  '						<input type="checkbox" data-theme="d" data-inline="true" data-mini="true" name="Sender" checked="checked" id="Sender" value="All">\n';
	newdata+=  '						<label for="Sender" >\n';
	newdata+=  '							<div style="margin-left: 10px; ;">\n';
	newdata+=  									'Sender Copy\n';
	newdata+=  '							</div>\n';
	newdata+=  '						</label>\n';	
	newdata += '					</div>\n';		



	newdata += '				</div>'; // end of prepare message div		
	newdata += '			</div>'	
	
	
/*	
newdata += '		<ul data-role="listview" data-theme="d" data-inset="true" data-count-theme="f" style="margin-top: 0;" class="ui-icon-alt;">';
			
newdata += '			<li class="ui-body ui-body-b">';
newdata += '				<div class="ui-grid-a ui-responsive">';

newdata += '					<div class="ui-block-a"><input type="submit" data-role="button" value="Update" data-theme="g" id="buttonSubmit" /></div>';
newdata += '					<div class="ui-block-b"><input type="button" data-role="button" value="Cancel" data-theme="d" id="buttonCancel" /></div>';
newdata += '			    </div>';
newdata += '			</li>	';
						
			

			
newdata += '		</ul>';

*/	

	
	newdata += '		  </div>\n';
	newdata += '		</div>';   //data-role content

	newdata += '		<div data-role="popup" id="errorPopup" data-overlay-theme="a" class="ui-content" data-theme="e" data-transition="fade">';
	newdata += '			<a href="#" id="closePopupButton" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>';
	newdata += '			<div id="errorPopupIcon"></div>';
	newdata += '			<div id="errorPopupContent"></div>';
	newdata += '			<div class="clearRight"></div>';
	newdata += '		</div>';

	newdata += '		<div id="footer" align="center">';
	newdata += '			<div style="margin-top: 6px;">&copy; '+escapeHTML(cyear())+'- Boy Scouts of America &bull; <a href="/mobile/help/privacy.asp">Privacy</a></div>';
	newdata += '			<div><a href="/" data-ajax="false"><img src="https://d1kn0x9vzr5n76.cloudfront.net/mobile/images/scoutbookbsalogo400.png" width="200"></a></div>';
	newdata += '		</div>';
	
	return newdata;	
}

function summaryTable(endDate,offs,txtunit) {
	
var old = false;


	var newdata='';
	var sumtot =parseFloat(0.0);
	var receivable=parseFloat(0.0);
	var liability=parseFloat(0.0);
	
	for(var i=0;i<payTotals.length;i++) {
		if (payTotals[i].lastname == 'Account' && payTotals[i].firstname == 'UnitPaylog') {
			offs.acctOffset=i;
			break;
		}
	}
	
	newdata += '					<table style="font-weight: normal" id="sumTable">\n';
	newdata += '						<tr><th style="border-bottom: 1px solid #ddd;">First Name</th><th style="border-bottom: 1px solid #ddd;">Last Name</th>';
	newdata += '							<th style="border-bottom: 1px solid #ddd; text-align:right; width:100px">Balance</th>\n';
	newdata += '						</tr>\n';	
	
	
//dateDiff(payArray[i][4],endDate)<=0)	
	
	
	for(var i=0;i<payTotals.length;i++) {
		if (payTotals[i].lastname == 'Account' && payTotals[i].firstname == 'UnitPaylog') {
			// do not print the Unit Account in the standard list.
		} else {
			newdata += '						<tr>\n';
			newdata += '							<td style="border-bottom: 1px solid #ddd;">\n';
			newdata += 									escapeHTML(payTotals[i].firstname);
			newdata += '							</td>\n';
			newdata += '							<td name="LastName" style="border-bottom: 1px solid #ddd;" data-baseval="'+ escapeHTML(payTotals[i].lastname) +'">\n';
			newdata += 									escapeHTML(payTotals[i].lastname);
			newdata += '							</td>\n';
			if(parseFloat(payTotals[i].amt) < 0) {
				newdata += '						<td style="border-bottom: 1px solid #ddd; text-align:right; width:100px" class="textRed">\n';
														receivable =  parseFloat(receivable) + parseFloat(payTotals[i].amt);
										
			} else {
				newdata += '						<td style="border-bottom: 1px solid #ddd; text-align:right; width:100px" >\n';
														liability =  parseFloat(liability) + parseFloat(payTotals[i].amt);
			}
			sumtot += parseFloat(payTotals[i].amt);
			newdata += 									escapeHTML(payTotals[i].amt.toFixed(2));
			newdata += '							</td>\n';
			newdata += '						</tr>\n';	
		}
	}

	
	if(offs.acctOffset > -1) {
		// print unit account balance
		// print unit account balance - receivable

			
		//---------------------------------------------- New Acounting --------------------------
		newdata += '					</table>\n';		
	
		newdata += '<br>				'+txtunit+' Statement of Financial Position\n';			
		newdata += '					<table style="font-weight: normal" id="unitSumTable">\n';
		newdata += '						<tr>\n';
		newdata += '							<th style="border-bottom: 1px solid #ddd;">Assets</th>\n';
		newdata += '							<th style="border-bottom: 1px solid #ddd;"></th>\n';
		newdata += '							<th style="border-bottom: 1px solid #ddd;">Liabilities</th>\n';
		newdata += '							<th style="border-bottom: 1px solid #ddd;"></th>\n';
		newdata += '							<th style="border-bottom: 1px solid #ddd;">Net Assets</th>\n';	
		newdata += '							<th style="border-bottom: 1px solid #ddd;"></th>\n';		
		newdata += '						</tr>\n';


		newdata += '						<tr>\n';
		newdata += '							<td style="border-bottom: 1px solid #ddd;">\n';
		newdata += '									Total Cash (Bank Balance)\n';
		newdata += '							</td>\n';

		sumtot = parseFloat(sumtot) + parseFloat(payTotals[offs.acctOffset].amt);

		if(sumtot < 0) {
			newdata += '						<td style="border-bottom: 1px solid #ddd; text-align:right; " class="textRed">\n';
		} else {
			newdata += '						<td style="border-bottom: 1px solid #ddd; text-align:right; " >\n';
		}
		newdata += 									escapeHTML(sumtot.toFixed(2));  //Total Cash 
		newdata += '							</td>\n';
		
		//if (offs.acctOffset != -1) {
		//	newdata += '		   				<td style="border-bottom: 1px solid #ddd;"></td>\n';
		//}
		


		
		//--- liability

		newdata += '							<td style="border-bottom: 1px solid #ddd;">\n';
		newdata += '									Credits to Scout Accounts\n';
		newdata += '							</td>\n';
		if(-liability < 0) {
			newdata += '						<td style="border-bottom: 1px solid #ddd; text-align:right; " class="textRed">\n';
		} else {
			newdata += '						<td style="border-bottom: 1px solid #ddd; text-align:right; " >\n';
		}
		newdata += 									escapeHTML(-liability.toFixed(2));  //liability
		newdata += '							</td>\n';
		//if (offs.acctOffset != -1) {
		//	newdata += '		   				<td style="border-bottom: 1px solid #ddd;"></td>\n';
		//}

		newdata += '							<td style="border-bottom: 1px solid #ddd;"></td>\n';		
		newdata += '							<td style="border-bottom: 1px solid #ddd;"></td>\n';	
		
		newdata += '						</tr>\n';	

		
	
		
		// Receivables

		newdata += '						<tr>\n';


		newdata += '							<td style="border-bottom: 2px solid #ddd;">\n';
		newdata += '									Fees Receivable (Owed by Scouts)\n';
		newdata += '							</td>\n';
		if(-receivable < 0) {
			newdata += '						<td style="border-bottom: 2px solid #ddd; text-align:right; " class="textRed">\n';
		} else {
			newdata += '						<td style="border-bottom: 2px solid #ddd; text-align:right; " >\n';
		}
		newdata += 								escapeHTML(-receivable.toFixed(2));   //subtotal 
		newdata += '							</td>\n';
		newdata += '							<td style="border-bottom: 2px solid #ddd;"></td>\n';		
		newdata += '							<td style="border-bottom: 2px solid #ddd;"></td>\n';	
		newdata += '							<td style="border-bottom: 2px solid #ddd;"></td>\n';		
		newdata += '							<td style="border-bottom: 2px solid #ddd;"></td>\n';	
		newdata += '						</tr>\n';	


		
		//Equity

		newdata += '						<tr>\n';

		newdata += '						<td style="border-bottom: 1px solid #ddd;" >\n';
		newdata += '							Total Assets\n';
		newdata += '						</td>\n';

		newdata += '						<td style="border-bottom: 1px solid #ddd; text-align:right;" >\n';
		newdata += 							escapeHTML((sumtot -receivable).toFixed(2));
		newdata += '						</td>\n';

		newdata += '						<td style="border-bottom: 1px solid #ddd;" >\n';
		newdata += '							Total Liabilities\n';
		newdata += '						</td>\n';

		if(-liability < 0) {
			newdata += '						<td style="border-bottom: 1px solid #ddd; text-align:right; " class="textRed">\n';
		} else {
			newdata += '						<td style="border-bottom: 1px solid #ddd; text-align:right; " >\n';
		}
		newdata += 									escapeHTML(-liability.toFixed(2));  //liability
		newdata += '							</td>\n';
		//if (offs.acctOffset != -1) {
		//	newdata += '		   				<td style="border-bottom: 1px solid #ddd;"></td>\n';
		//}
		
		
		newdata += '							<td style="border-bottom: 1px solid #ddd;">\n';
		newdata += '									Net Assets\n';
		newdata += '							</td>\n';
		if(parseFloat(payTotals[offs.acctOffset].amt) < 0) {
			newdata += '						<td style="border-bottom: 1px solid #ddd; text-align:right; " class="textRed">\n';
		} else {
			newdata += '						<td style="border-bottom: 1px solid #ddd; text-align:right; " >\n';
		}
		newdata += 								escapeHTML(payTotals[offs.acctOffset].amt.toFixed(2)) ;  //subtotal 
		newdata += '							</td>\n';

		newdata += '						</tr>\n';
		
		newdata += '						<tr>\n';	// blank row		
		newdata += '							<td>.</td> <td></td><td></td><td></td><td></td><td></td>\n';	
		newdata += '						</tr>\n';
		


		// Subtotal
		newdata += '						<tr>\n';


		newdata += '							<td >\n';
		newdata += '									<i>Cash Available (conservative)</i>\n';
		newdata += '							</td>\n';
		if(parseFloat(payTotals[offs.acctOffset].amt + receivable) < 0) {
			newdata += '						<td style=" text-align:right; " class="textRed">\n';
		} else {
			newdata += '						<td style=" text-align:right; " >\n';
		}
		newdata += '							<i>';
		newdata += 								escapeHTML((payTotals[offs.acctOffset].amt + receivable).toFixed(2)); ;  //subtotal 
		newdata += '							</i>';
		newdata += '							</td>\n';
		newdata += '							<td></td>\n';		
		newdata += '							<td></td>\n';	
		newdata += '							<td></td>\n';		
		newdata += '							<td></td>\n';	

		newdata += '						</tr>\n';	

		newdata += '					</table>\n';		
		
		
	
	} else {
		newdata += '					</table>\n';	
	}
		
	return newdata;
}


// Main entry function
var payArray=[];
function getPayBalances(pageid,unitID) {

$.mobile.loading('show', { theme: 'a', text: 'processing...this can take several minutes for large units', textonly: false });
	payTotals=[];
	var firstname;
	var lastname;
	var bsanum='';
	var amt=0.0;
	var savenow=false;
	var evObj ={firstname:'',lastname:'',amt:0,scoutid:'',parentids:[],mailSent:false,paybal:'',nickname:''};
	var found=false;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[pageid,unitID,'PB'],  getPayBalances,[pageid,unitID]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			var raw=this.response;
			var res=this.response.trim().split('\n');
			
			payArray.length=0;
			
			payArray=parseCSV(raw);		//gets array of arrays
			//0=BSA Member ID	1=First Name	2=Last Name	3=Payment Type	4=Date	5=Description	6=Amount	7=Transaction ID	8=Category	9=Notes adds 10=trans

			//console.log(payArray);
			
			if(payArray.length >1) {
				
				
				
				
				for(var i=1;i<payArray.length;i++) {
					found=false;
				  for (var j=0;j<payTotals.length;j++) {
					if(payTotals[j].firstname + '&' +  payTotals[j].lastname == payArray[i][1] + '&' + payArray[i][2]) {
						found=true;
						payTotals[j].amt = parseFloat(payTotals[j].amt) + parseFloat(payArray[i][6]);
						if( parseFloat(payTotals[j].amt) < 0) {
							if(parseFloat(payTotals[j].amt) > -.01) {
								payTotals[j].amt =0.0;
							}
						}
						break;
					}
				  }
				  if (found == false) {
					  // create new totals record
					//evObj.bsanum=payArray[i][0];
					if(payArray[i][1] != '' ) {
						//evObj.bsanum=payArray[i][0];
						evObj.firstname=payArray[i][1];
						evObj.lastname=payArray[i][2];	

						evObj.amt=parseFloat(payArray[i][6]);
						payTotals.push(JSON.parse(JSON.stringify(evObj)));
					}					
				  }
				 
					
				}


				// need to validate the the scouts are still scouts and not leaders (to compensate for SB bug in csv export)
				
				validatePayScouts(pageid,unitID);
				
				
				//console.log(payTotals);
				/*
				payRpt=true;
				$.mobile.changePage(
				'/mobile/dashboard/admin/unit.asp?UnitID=' + escapeHTML(unitID),
					{
						allowSamePageTransition: true,
						transition: 'none',
						showLoadMsg: true,
						reloadPage: true
					}
				);	
				*/				
			} else {
				$.mobile.loading('hide');
				alert('Your unit does not have any payment log transactions yet!');
				$('#faOverlay',pageid).hide();
			}
			

		}
	};


	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/unit.asp?UnitID='+escapeHTML(unitID)+'&Action=ExportPaymentLogs';
	xhttp.open("GET",url , true);
	xhttp.responseType="text";

	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,genError,[pageid,unitID,'PB'],  getPayBalances,[pageid,unitID]);
	};
}

function addTransFilter() {
	//only needed if there is a UnitPaylog
	payArray[0].push('ScoutID');
	payArray[0].push('Nickname');
	var fncol;
	var lncol;
	var dscol;
	var amcol;
	var dtcol;
	var nncil;
	var lscol=payArray[0].length;
	//payArray		
	//0=BSA Member ID	1=First Name	2=Last Name	3=Payment Type	4=Date	5=Description	6=Amount	7=Transaction ID	8=Category	9=Notes

	for(j=0;j<payArray[0].length;j++) {
		if(payArray[0][j]=='First Name') {  
			fncol=j;
		}
		if(payArray[0][j]=='Last Name') {  
			lncol=j;
		}
		if(payArray[0][j]=='Description') {  
			dscol=j;
		}
		if(payArray[0][j]=='Amount') {  
			amcol=j;
		}
		if(payArray[0][j]=='Date') {  
			dtcol=j;
		}
		if(payArray[0][j]=='Nickname') {  
			nncol=j;
		}		
	}	
	var unitPay=false
	for(i=0;i<payArray.length;i++) {

		if(payArray[i][lncol]=="Account" && payArray[i][fncol] =='UnitPaylog') {
			unitPay=true;
		} 
		payArray[i].push(true);  //add filter column
	}	
	var eDescript='';
	var rsDescript='';
	if (unitPay==true) {
		for(i=1;i<payArray.length;i++) {
			payArray[i][lscol] = false;
		}
		for(i=1;i<payArray.length;i++) {
			if(payArray[i][lncol]=="Account" && payArray[i][fncol] =='UnitPaylog') {
				//Only look at non-unit account - these will trace back to the unit accounts
			} else {
				nm=payArray[i][fncol];
				if(payArray[i][nncol]!="") {
					nm=payArray[i][nncol];
				}
					
				if(payArray[i][fncol]!="RemovedScout" ){

					eDescript = payArray[i][dscol] + " for " + payArray[i][lncol][0] + ", " + nm;
					rsDescript ='';
				} else {
					var res = payArray[i][dscol].match(/([ a-zA-Z]+) ([a-zA-Z]) (.+)/);
					if(res != null) {
						eDescript = res[3] + " for " + res[2] + ", " + res[1];
					}
					rsDescript=payArray[i][dscol] + " for " + payArray[i][lncol][0] + ", " + nm;
				}
				//console.log(eDescript);
				var inRow = 0
				for(j=1;j<payArray.length;j++) {
					if(payArray[j][lncol]=="Account" && payArray[j][fncol] =='UnitPaylog') {
						
					  if(payArray[i][dtcol]==payArray[j][dtcol]) {
						//if(payArray[i][fncol] =='JayKathySchabelski') {
						//	console.log(parseFloat(payArray[i][amcol])+ "||"+ -parseFloat(payArray[j][amcol]));
						//	console.log(payArray[j][dscol] + "||"+ eDescript);
						//}
						if(parseFloat(payArray[i][amcol])== -parseFloat(payArray[j][amcol])) {
						//	console.log("val match");
							
							if (payArray[j][dscol] == eDescript) {
							//	console.log("descript match");
								payArray[i][lscol] = true;
								payArray[j][lscol] = true;
							}
							
							// try match for removedScout
							if(rsDescript != '') {
							if (payArray[j][dscol] == rsDescript) {
							//	console.log("descript match");
								payArray[i][lscol] = true;
								payArray[j][lscol] = true;
							}							
							}
							
							
							
						}
					  }
					}
				}
			}
		}		
		
		
	}
}

//unused function
function validatePayScouts_works_with_byPatrol(unitID,pageid) {		//validatePayScouts function alternate
	//iterate through patrols workaround
	var patrolids=[];
	//missing page unused
	$('a[href*="denpatrol.asp"]','#Page' +pageid).each(function () {
		patrolids.push($(this).attr('href'));
	});
	var nicknameOrNoHistoryScout=[];
	
	validatePayScoutsStep2(unitID,patrolids,nicknameOrNoHistoryScout,pageid);
	
}

//unused function
function validatePayScoutsStep2(unitID,patrolids,nicknameOrNoHistoryScout,pageid) {
	//same problem.  Need to get list of scouts, with no nicknames.  Not roster, not my connections.
	// Also need to put in scouts who have a zero balance but never had any entry in the csv
	
	if(patrolids.length == 0 ) {
		// Check for any scouts on the unit page that are not assigned to dens/patrols
		getUnitUnassignedScout(unitID,nicknameOrNoHistoryScout,pageid);
		
		return;
	}
	
	var url= patrolids[0];
	
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[pageid,unitID,'PB'], validatePayScoutsStep2,[unitID,,patrolids,nicknameOrNoHistoryScout,pageid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			var evObj={};
			var foundAcct=false;
			var found=false;
			
			$('li[data-scoutuserid]',this.response).each( function () {
				foundAcct=true;
				found=false;
				if($('img[src*="securityapproved32.png"]',this).length > 0) {
					evObj={name:'',id:''};	
				
					evObj.name=$('a[href*="ScoutUserID"]',this).text().trim().split('\n')[0].trim();
					evObj.id=$(this).attr('data-scoutuserid');
					
					//If the name has a , in it assume last name first
					for (var i=0;i<payTotals.length;i++) {
						//console.log(evObj.name,payTotals[i].firstname +  ' ' + payTotals[i].lastname);
						if(evObj.name.indexOf(',') == -1) {
							// firstname lastName

							if(evObj.name == payTotals[i].firstname +  ' ' + payTotals[i].lastname ) {
								payTotals[i].scoutid=evObj.id;
								found=true;
								break;
							}
						} else {
							if(evObj.name == payTotals[i].lastname +  ', ' + payTotals[i].firstname ) {
								payTotals[i].scoutid=evObj.id;
								found=true;
								break;
							}						
						}			

					}
					// any scout on the roster that is not in paytotals, is either there because they have a nickname or no previous paylog history.
					// It would be nice to tag these somehow for later use.
					if(found==false) {
						nicknameOrNoHistoryScout.push(evObj.id);
					}
				}
			});
	
			/*
			for (var i=0;i<payTotals.length;i++) {
				if(payTotals[i].scoutid == '') {
					$('li[data-scoutuserid]',this.response).each( function () {
						foundAcct=true;
						if($('img[src*="securityapproved32.png"]',this).length > 0) {
							evObj={name:'',id:''};	
							evObj.name=$('a[href*="ScoutUserID"]',this).text().trim().split('\n')[0].trim();
							evObj.id=$(this).attr('data-scoutuserid');
							// if the name contains the lastname in paytotals, make it a potential
							if(evObj.name.indexOf(payTotals[i].lastname) {
								payTotals[i].potentialID.push(evObj.id);
							}
						}
					});						
					
				}
			}
			*/
	
			//now we have a list to iterate   Getaccout
			//Paytotals with potential IDs to match nicknames
			//and the other list
	
	
		//	if(foundAcct==false) {
		//		alert('error');
		//		return;
		//	}
			
			/* the following code would remove scouts that are not found.  They might be leaders or they might have nicknames.
			var cleanList=false;
			while(cleanList==false) {
				cleanList=true;
				for (var i=0;i<payTotals.length;i++) {
					if(payTotals[i].scoutid == '') {
						payTotals.splice(i,1)
						break;
					}
				}				
			}
			
			At this point, we need to look at scout profiles with a last name match.
			
			
			
		
				payRpt=true;
				$.mobile.changePage(
				'/mobile/dashboard/admin/unit.asp?UnitID=' + escapeHTML(unitID),
					{
						allowSamePageTransition: true,
						transition: 'none',
						showLoadMsg: true,
						reloadPage: true
					}
				);	
			*/
			patrolids.shift();
			validatePayScoutsStep2(unitID,patrolids,nicknameOrNoHistoryScout,pageid);
			
			//getAccountPotentialScout(unitID,nicknameOrNoHistoryScout)
		}
	}		
	
	
	//var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID=' + escapeHTML(unitID);

	xhttp.open("GET",url , true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,genError,[pageid,unitID,'PB'], validatePayScoutsStep2,[unitID,patrolids,nicknameOrNoHistoryScout,pageid]);
	}
	
}

//unused function
function getUnitUnassignedScout(unitID,nicknameOrNoHistoryScout,pageid) {
	// we are on the roster page
var evObj={name:'',id:''};
			//missing page unused
			$('li[data-scoutuserid]').each( function () {
				foundAcct=true;
				found=false;
				if($('img[src*="securityapproved32.png"]',this).length > 0) {
					evObj={name:'',id:''};	
				
					evObj.name=$('a[href*="ScoutUserID"]',this).text().trim().split('\n')[0].trim();
					evObj.id=$(this).attr('data-scoutuserid');
					
					//If the name has a , in it assume last name first
					for (var i=0;i<payTotals.length;i++) {
						//console.log(evObj.name,payTotals[i].firstname +  ' ' + payTotals[i].lastname);
						if(evObj.name.indexOf(',') == -1) {
							// firstname lastName

							if(evObj.name == payTotals[i].firstname +  ' ' + payTotals[i].lastname ) {
								payTotals[i].scoutid=evObj.id;
								found=true;
								break;
							}
						} else {
							if(evObj.name == payTotals[i].lastname +  ', ' + payTotals[i].firstname ) {
								payTotals[i].scoutid=evObj.id;
								found=true;
								break;
							}						
						}			

					}
					// any scout on the roster that is not in paytotals, is either there because they have a nickname or no previous paylog history.
					// It would be nice to tag these somehow for later use.
					if(found==false) {
						nicknameOrNoHistoryScout.push(evObj.id);
					}
				}
			});

			




	getAccountPotentialScout(pageid,unitID,nicknameOrNoHistoryScout);

	
}



function validatePayScouts(pageid,unitID) {					// this works with a correct roster
	//same problem.  Need to get list of scouts, with no nicknames.  Not roster, not my connections.
	// Also need to put in scouts who have a zero balance but never had any entry in the csv
	
	var nicknameOrNoHistoryScout=[];
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[pageid,unitID,'PB'], validatePayScouts,[pageid,unitID]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			var evObj={};
			var foundAcct=false;
			var found=false;
			
			$('li[data-scoutuserid]',this.response).each( function () {
				foundAcct=true;
				found=false;
				
				if($('a[href*="' + $(this).attr('data-scoutuserid') + '"]',this).length > 0 ) {


					if($('img[src*="securityapproved32.png"]',this).length > 0) {
						evObj={name:'',id:''};	
					
						evObj.name=$('a[href*="ScoutUserID"]',this).text().trim().split('\n')[0].trim();
						evObj.id=$(this).attr('data-scoutuserid');
						
						//If the name has a , in it assume last name first
						for (var i=0;i<payTotals.length;i++) {
							//console.log(evObj.name,payTotals[i].firstname +  ' ' + payTotals[i].lastname);
							if(evObj.name.indexOf(',') == -1) {
								// firstname lastName

								if(evObj.name == payTotals[i].firstname +  ' ' + payTotals[i].lastname ) {
									payTotals[i].scoutid=evObj.id;
									found=true;
									break;
								}
							} else {
								if(evObj.name == payTotals[i].lastname +  ', ' + payTotals[i].firstname ) {
									payTotals[i].scoutid=evObj.id;
									found=true;
									break;
								}						
							}			

						}
						// any scout on the roster that is not in paytotals, is either there because they have a nickname or no previous paylog history.
						// It would be nice to tag these somehow for later use.
						if(found==false) {
							nicknameOrNoHistoryScout.push(evObj.id);
						}
					}
				}

			});
	
			/*
			for (var i=0;i<payTotals.length;i++) {
				if(payTotals[i].scoutid == '') {
					$('li[data-scoutuserid]',this.response).each( function () {
						foundAcct=true;
						if($('img[src*="securityapproved32.png"]',this).length > 0) {
							evObj={name:'',id:''};	
							evObj.name=$('a[href*="ScoutUserID"]',this).text().trim().split('\n')[0].trim();
							evObj.id=$(this).attr('data-scoutuserid');
							// if the name contains the lastname in paytotals, make it a potential
							if(evObj.name.indexOf(payTotals[i].lastname) {
								payTotals[i].potentialID.push(evObj.id);
							}
						}
					});						
					
				}
			}
			*/
	
			//now we have a list to iterate   Getaccout
			//Paytotals with potential IDs to match nicknames
			//and the other list
	
	
			if(foundAcct==false) {
				alert('error 1');
				return;
			}
			
			/* the following code would remove scouts that are not found.  They might be leaders or they might have nicknames.
			var cleanList=false;
			while(cleanList==false) {
				cleanList=true;
				for (var i=0;i<payTotals.length;i++) {
					if(payTotals[i].scoutid == '') {
						payTotals.splice(i,1)
						break;
					}
				}				
			}
			
			At this point, we need to look at scout profiles with a last name match.
			
			
			
		
				payRpt=true;
				$.mobile.changePage(
				'/mobile/dashboard/admin/unit.asp?UnitID=' + escapeHTML(unitID),
					{
						allowSamePageTransition: true,
						transition: 'none',
						showLoadMsg: true,
						reloadPage: true
					}
				);	
			*/
			getAccountPotentialScout(pageid,unitID,nicknameOrNoHistoryScout);
		}
	}		
	
	
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID=' + escapeHTML(unitID);

	xhttp.open("GET",url , true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,genError,[pageid,unitID,'PB'], validatePayScouts,[pageid,unitID]);
	}
	
}

function sortObj(a,b) {
  if (a.lastname + a.firstname < b.lastname + b.firstname)
    return -1;
  if (a.lastname + a.firstname > b.lastname + b.firstname)
    return 1;
  return 0;
}

//used?
function getAccountPotentialScout(pageid,unitid,nicknameOrNoHistoryScout) {
	
	if (nicknameOrNoHistoryScout.length==0) {
		//Now, any scout in payTotals that has no id is not valid

		// lets copy scoutid's into payArray
		for(var j=1;j<payArray.length;j++) {
			for(var i=0;i<payTotals.length;i++) {
				if (payTotals[i].firstname== payArray[j][1] && payTotals[i].lastname== payArray[j][2] ) {
					payArray[j].push(payTotals[i].scoutid);
					payArray[j].push(payTotals[i].nickname);
					break;
				}
			}
		}
		
		getParForRest(pageid,unitid);
		return;
	} else {
		

		$.mobile.loading('show', { theme: 'a', text: 'processing...this can take several minutes for large units', textonly: false });
		var thisScoutID = nicknameOrNoHistoryScout[0];
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[pageid,unitid,'PB'],getAccountPotentialScout,[pageid,unitid,nicknameOrNoHistoryScout]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			//console.log('get Account responded');
			
	
			/*
			for(var i=0;i<payTotals.length;i++) {
				if(payTotals[i].id == thisScoutID) {
					payTotals[i]['paybal']=$('span[title*="balance"]',this.response).text();
					payTotals[i]['parconns']=[];
					payTotals[i]['parids']=[];

					$('a[href*="ConnectionID"]',this.response).each( function () {
						pushUnique(payTotals[i].parconns,$(this).attr('href').match(/ConnectionID=(\d+)/)[1]);
						pushUnique(parconns,$(this).attr('href').match(/ConnectionID=(\d+)/)[1]);
					});					
					break;
				}
			}
			*/
			
					var parconns=[];
					var parconnsNm=[];
					$('a[href*="ConnectionID"]',this.response).each( function () {
						if($(this).text() !='') {
	
							pushUnique(parconns,$(this).attr('href').match(/ConnectionID=(\d+)/)[1]);
							pushUnique(parconnsNm,$(this).text());
						}
					});
					var paybal=$('span[title*="balance"]',this.response).text();
					
			
			getProfileforPotentialScout(pageid,paybal,parconns,parconnsNm,thisScoutID,unitid,nicknameOrNoHistoryScout);
		}
	};
	
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/account.asp?ScoutUserID=' + escapeHTML(thisScoutID);

	
	xhttp.open("GET",url , true);
	xhttp.responseType="document";

	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,genError,[pageid,unitid,'PB'],getAccountPotentialScout,[pageid,unitid,nicknameOrNoHistoryScout]);
	};
}


function getParForRest(pageid,unitid) {
	var i=0;
	var scoutid='';
	for(i=0;i<payTotals.length;i++) {
		if(payTotals[i].paybal=='') {
			scoutid=payTotals[i].scoutid;
				break;
		}
	}
	
	
	if(i==payTotals.length) {
		// no more parents to get
		payTotals.sort(sortObj);
		payTotalsIn=payTotals.slice();
		
		addTransFilter();
		
		payRpt=true;
		$.mobile.changePage(
		'/mobile/dashboard/admin/unit.asp?UnitID=' + escapeHTML(unitid),
			{
				allowSamePageTransition: true,
				transition: 'none',
				showLoadMsg: true,
				reloadPage: true
			}
		);	
		return;			
	}
	
	if(scoutid=='') {
		//invalid scout
			var cleanList=false;
			while(cleanList==false) {
				cleanList=true;
				for (var i=0;i<payTotals.length;i++) {
					if(payTotals[i].scoutid == '') {
						
						// these are not current scouts.  Even though historically there were records, the only ones here are for scouts that are not adult leaders
						// which is bug like, so just remove them.
						var cleanPayArray=false;
						while(cleanPayArray==false) {
							cleanPayArray=true;
							for (var j=0;j<payArray.length;j++) {
								if(payArray[j][1]== payTotals[i].firstname && payArray[j][2]== payTotals[i].lastname) {
									payArray.splice(j,1);
									cleanPayArray=false;
									break;
								}
							}
						}						
	
						payTotals.splice(i,1);
						cleanList=false;
						break;
					}
				}				
			}		
			setTimeout(function(){ getParForRest(pageid,unitid); }, 200);
			return;
	}	
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[pageid,unitid,'PB'],getParForRest,[pageid,unitid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
				payTotals[i]['parconns']=[];
				payTotals[i]['parconnsNm']=[];
				$('a[href*="ConnectionID"]',this.response).each( function () {
					
					if($(this).text() != '') {

						pushUnique(payTotals[i].parconns,$(this).attr('href').match(/ConnectionID=(\d+)/)[1]);
						pushUnique(payTotals[i].parconnsNm,$(this).text());
					}
				});
				payTotals[i].paybal=$('span[title*="balance"]',this.response).text();

				setTimeout(function(){ getParForRest(pageid,unitid); }, 200);							
			
		}
	};

	
	
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/account.asp?ScoutUserID=' + escapeHTML(scoutid);

	xhttp.open("GET",url , true);
	xhttp.responseType="document";

	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,genError,[pageid,unitid,'PB'],getParForRest,[pageid,unitid]); 
	};	
}
//used?
function getProfileforPotentialScout(pageid,paybal,parconns,parconnsNm,thisScoutID,unitid,nicknameOrNoHistoryScout) {
	var found=false;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[pageid,unitid,'PB'],getProfileforPotentialScout,[pageid,paybal,parconns,parconnsNm,thisScoutID,unitid,nicknameOrNoHistoryScout]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			//now, look at scout last name and scout first name to match 
			found=false;
			for(var i=0;i<payTotals.length;i++) {
				if (payTotals[i].lastname == $('#lastName',this.response).val() && payTotals[i].firstname == $('#firstName',this.response).val()) {
					payTotals[i].nickname=$('#nickName',this.response).val();
					payTotals[i].scoutid=thisScoutID;		//9_22_18
					//debugger;
					payTotals[i]['paybal']=paybal;
					payTotals[i]['parconns'] = parconns.slice();
					payTotals[i]['parconnsNm'] = parconnsNm.slice();
					// we found it
					found=true;
					break;
				}
			}
			if(found==false) {
				//add this to paytotals
				//debugger;
				var evObj ={firstname:'',lastname:'',amt:0,scoutid:'',parentids:[],mailSent:false,paybal:'',nickname:''};
				evObj.firstname=$('#firstName',this.response).val();
				evObj.lastname=$('#lastName',this.response).val();
				evObj.nickname=$('#nickName',this.response).val();
				evObj.scoutid=thisScoutID;
				evObj['paybal']=paybal;
				evObj['parconns'] = parconns.slice();
				evObj['parconnsNm'] = parconnsNm.slice();
				
				payTotals.push(JSON.parse(JSON.stringify(evObj)));
				//0=BSA Member ID	1=First Name	2=Last Name	3=Payment Type	4=Date	5=Description	6=Amount	7=Transaction ID	8=Category	9=Notes
				var d = new Date(Date.now());	
				var yr = d.getFullYear();
				var mon = d.getMonth() +1;
				var day = d.getDate();
				var tdt= mon+'/'+day+'/'+yr;
	
				payArray.push(['',$('#firstName',this.response).val(),$('#lastName',this.response).val(),'Payment',tdt,'No Payment History',0,'','','']);
			}
			nicknameOrNoHistoryScout.shift();
			setTimeout(function(){ getAccountPotentialScout(pageid,unitid,nicknameOrNoHistoryScout); }, 200);			
		}
	};

	var url = 'https://' + escapeHTML(host) + 'scoutbook.com/mobile/dashboard/admin/editprofile.asp?ScoutUserID=' + escapeHTML(thisScoutID) + '&UnitID=&DenID=&PatrolID=';

	xhttp.open("GET",url , true);
	xhttp.responseType="document";

	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,genError,[pageid,unitid,'PB'],getProfileforPotentialScout,[pageid,paybal,parconns,parconnsNm,thisScoutID,unitid,nicknameOrNoHistoryScout]); 
	};
}
function getPayBalancesEnd(endDate) {
	//save pertinent data
	
	
	payTotals=[];
	
	var firstname;
	var lastname;
	var bsanum='';
	var amt=0.0;
	var savenow=false;
	var evObj ={firstname:'',lastname:'',amt:0,scoutid:'',parentids:[],mailSent:false,paybal:'',nickname:''};
	var found=false;

			
	if(payArray.length >1) {
		
		for(var i=1;i<payArray.length;i++) {
			
			if(dateDiff(payArray[i][4],endDate)<=0 || endDate=='') {
			  found=false;
			  for (var j=0;j<payTotals.length;j++) {
				if(payTotals[j].firstname + '&' +  payTotals[j].lastname == payArray[i][1] + '&' + payArray[i][2]) {
					found=true;
					payTotals[j].amt = parseFloat(payTotals[j].amt) + parseFloat(payArray[i][6]);
						if( parseFloat(payTotals[j].amt) < 0) {
							if(parseFloat(payTotals[j].amt) > -.01) {
								payTotals[j].amt =0.0;
							}
						}
					break;
				}
			  }
			  if (found == false) {
				  // create new totals record
				//evObj.bsanum=payArray[i][0];
				if(payArray[i][1] != '' ) {
					evObj.firstname=payArray[i][1];
					evObj.lastname=payArray[i][2];	
					evObj.amt=parseFloat(payArray[i][6]);
					
					//only add if 
					payTotals.push(JSON.parse(JSON.stringify(evObj)));
				}					
			  }	
			}
		}
		//Sort payTotals
		payTotals.sort(sortObj);
		//add back any lookup data
		
		for(var i=0;i<payTotals.length;i++) {
			for (var j=0;j<payTotalsIn.length;j++) {
				if(payTotals[i].scoutid==payTotalsIn[j].scoutid) {
					payTotals[i]['paybal']=payTotalsIn[j].paybal;
					payTotals[i]['parconns']=payTotalsIn[j].parconns.slice();
					payTotals[i]['parconnsNm']=payTotalsIn[j].parconnsNm.slice();
					payTotals[i]['parentids']=payTotalsIn[j].parentids.slice();
					break;
				}
			}
		}
	}

}

//capture leaders,parents,and scouts
//Here is a problem.  All we know at this point is the Scout name from the CSV file. No ID.  And the CSV file does not have the scout userid, only full name.  The mail page has 
//nicknames and userids.  
// To resolve, we need to find nicknames.  
//  First, go to https://qa.scoutbook.com/mobile/dashboard/admin/adultconnections.asp  to get a list of connections.
//  Given those, go to profile pages for each scout with matching last name
//  edit those profiles to find the nicknames
//  update paytotals with nicknames
//  U G H  what a P I T A

function initSendEmail(unitid,pageid) {

	$.mobile.loading('show', { theme: 'a', text: 'sending notices...', textonly: false });
	var parentList=[];
	var scoutList=[];
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[pageid,unitID,'PB'],initSendEmail,[unitID,pageid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			var evObj={id:'', parentName:'', childNames:''};
			$('.parent.checkable',this.response).each(function (index,value) {
				evObj.id = $(this).attr('data-userid');		//id of the parent
				var names=$(this)[0].childNodes[1].innerText.trim().split('\n');
				evObj.parentName=names[0].trim();
				evObj.childNames=[];
				for (var i=1;i<names.length;i++) {
					evObj.childNames.push(names[i].trim());
				}
				parentList.push(JSON.parse(JSON.stringify(evObj)));
			});			
			var evObj={id:'', scoutName:''};
			$('.scout.checkable',this.response).each(function (index,value) {
				evObj.id = $(this).attr('data-userid');		//id of the parent
				var names=$(this)[0].childNodes[1].innerText.trim().split('\n');
				var nameorder=names[0].split(',');
				evObj.scoutName=nameorder[1].trim() + ' ' + nameorder[0].trim();
				scoutList.push(JSON.parse(JSON.stringify(evObj)));
			});				
			
			// we now have names, ids from what is available in the send message screen.  match up with scouts in the list.
			//BUT there are scouts with no email accounts so we need the roster instead.  Both use nicknames, but roster may be last name first
			
			//
			
			// got the scout id from elsewhere
			for (var i=0;i<payTotals.length;i++) {
				//missing page fix
				if($('#PastDueOnly','#Page' +pageid).prop('checked')==false || parseFloat(payTotals[i].amt) < $('#DueAmt','#Page' +pageid).val()) {
				//if(payTotals[i].amt < 0) 
					var scoutName='';
					if(payTotals[i].nickname != undefined) {
						if(payTotals[i].nickname == '') {
							scoutName=payTotals[i].firstname + ' '+ payTotals[i].lastname;
						} else {
							scoutName=payTotals[i].nickname + ' '+ payTotals[i].lastname;
						}
					} else {
						scoutName=payTotals[i].firstname + ' '+ payTotals[i].lastname;
					}
					payTotals[i]['scoutMail'] = false;
					for(var j=0;j< scoutList.length;j++) {
						if(scoutList[j].scoutName == scoutName) {
							payTotals[i].scoutMail = true;	
							break;
						}
					}
				//debugger;
					for(var j=0;j< parentList.length;j++) {
						for(var k=0;k<parentList[j].childNames.length;k++) {
							var childlist = parentList[j].childNames[k].split(', ');
							for (var m =0; m< childlist.length;m++) {
								if(childlist[m] == scoutName) {
									payTotals[i].parentids.push(parentList[j].id);
									// don't need to look at any more scout names for this parent
									break;
								}
							}
						}
					}
				}
			}				
			/*
			for (var i=0;i<payTotals.length;i++) {
				if($('#PastDueOnly').prop('checked')==false || payTotals[i].amt < 0) {
				//if(payTotals[i].amt < 0) 
					var scoutName='';
					
					if(payTotals[i].nickname != undefined) {
						if(payTotals[i].nickname == '') {
							scoutName=payTotals[i].firstname + ' '+ payTotals[i].lastname;
						} else {
							scoutName=payTotals[i].nickname + ' '+ payTotals[i].lastname;
						}
					} else {
						scoutName=payTotals[i].firstname + ' '+ payTotals[i].lastname;
					}
					
					for(var j=0;j< scoutList.length;j++) {
						if(scoutList[j].scoutName == scoutName) {
							payTotals[i].scoutid = scoutList[j].id;
							break;
						}
					}
					for(var j=0;j< parentList.length;j++) {
						for(var k=0;k<parentList[j].childNames.length;k++) {
							if(parentList[j].childNames[k] == scoutName) {
								payTotals[i].parentids.push(parentList[j].id);
								// don't need to look at any more scout names for this parent
								break;
							}
						}
					}
				}
			}
			*/

			//call to get message page id, then post message
			getMailPage(unitid,pageid);
		}
	}


	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/messages/default.asp?UnitID='+escapeHTML(unitid);
	xhttp.open("GET", url, true);
	xhttp.responseType="document";
	xhttp.send();

	xhttp.onerror =function() {
		errStatusHandle(500,genError,[pageid,unitID,'PB'],initSendEmail,[unitID,pageid])
	}	
}


function getMailPage(unitid,pageid) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[pageid,unitid,'PB'],getMailPage,[unitid,pageid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			var mailpageid='';
			if($('div[data-role="page"]',this.response).attr('id').match(/\d+/) != null) {
				mailpageid= $('div[data-role="page"]',this.response).attr('id').match(/\d+/)[0];
			}
			//getMyID(unitid, pageid);
			setupSendMail(unitid,mailpageid,pageid);
		}
	}		
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/messages/default.asp?UnitID='+escapeHTML(unitid);
	xhttp.open("GET", url, true);
	xhttp.responseType="document";
	xhttp.send();

	xhttp.onerror =function() {
		errStatusHandle(500,genError,[pageid,unitid,'PB'],getMailPage,[unitid,pageid]);
	}		
}

function getMyID(unitID,pageid,troop) {
				
				
	//get me from dashboard
	
	//clear garbage from sender
	
	//formPost=formPost.replace(/CustomGroupID=[^&]*&/,'').replace(/CustGrpName=[^&]*&/,'');
	//missing page fixed
	if($('#Sender','#Page' +pageid).prop('checked')==true) {
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status != 200) {
				errStatusHandle(this.status,'',[], getMyID,[unitID,pageid,troop]);
			}
			if (this.readyState == 4 && this.status == 200) {
				resetLogoutTimer(url);
				servErrCnt=0;
				//var myid='';
				if(this.response.match(/&UserID=\d+/) != null) {
					myid=this.response.match(/&UserID=(\d+)/)[1];
				}
				//setupSendMail(unitid,pageid,myid) 
				
				//debugger;
				getParIdsFromConns(unitID,pageid,troop,'report',initSendEmail,unitID,pageid);
				//getAccountForPayBal(unitID,pageid,troop,'report',initSendEmail,unitID);
				return ;
				
			}
		};
		var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/';
		xhttp.open("GET",url , true);
		xhttp.responseType="text";
		xhttp.send();
		xhttp.onerror = function() {
			errStatusHandle(500,'',[], getMyID,[unitID,pageid,troop]);
		}	
	} else {
		getParIdsFromConns(unitID,pageid,troop,'report',initSendEmail,unitID,pageid);
		//getAccountForPayBal(unitID,pageid,troop,'report',initSendEmail,unitID);
	}
}


function getParIdsFromConns(unitID,pageid,troop,type,initSendEmail,iunitID,ipageid) {


	var parconn='';
	var scoutid='';
	for(var i=0;i<payTotals.length;i++) {
		if(payTotals[i].parconns.length != payTotals[i].parentids.length) {
			parconn=payTotals[i].parconns[payTotals[i].parentids.length];
			scoutid=payTotals[i].scoutid;
			break;
		}
	}

	if(parconn=='') {
		//alert('done getting parent ids');
		getMailPage(unitID,pageid);
		return;		
	}
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[pageid,unitID,'PB'], getParIdsFromConns,[unitID,pageid,troop,type,initSendEmail,iunitID,ipageid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;	
			//$('img[data-userid]').attr('data-userid')
			//payTotals[i].parentids.push($('a[href*="editprofile.asp?AdultUserID="]',this.response).attr('href').match(/AdultUserID=(\d+)/)[1]);  this is only aval to admins
			payTotals[i].parentids.push($('img[data-userid]',this.response).attr('data-userid'));	// this should be avail to treasurers with full control and admins
			setTimeout(function(){ getParIdsFromConns(unitID,pageid,troop,type,initSendEmail,iunitID,ipageid);}, 200);	
		}			
	};	
    var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/connection.asp?ScoutUserID='+scoutid+'&ConnectionID='+parconn+'&UnitID=' + escapeHTML(unitID)+'&DenID=&PatrolID=';

	xhttp.open("GET",url , true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,genError,[pageid,unitID,'PB'], getParIdsFromConns,[unitID,pageid,troop,type,initSendEmail,iunitID,ipageid]);
	}
			
}

function setupSendMail(unitid,mailpageid,pageid) {
	var found=false;
	var pfound=false;
	var skipNoPar=false;
	var due;
	for(var i=0;i<payTotals.length;i++) {
		
		
		if(payTotals[i].mailSent == false) {	
			//missing page fixed		
			if($('#PastDueOnly','#Page' +pageid).prop('checked')==false || parseFloat(payTotals[i].amt) < $('#DueAmt','#Page' +pageid).val()) {
				
			//if (payTotals[i].amt < 0 && payTotals[i].mailSent == false) 
				payTotals[i].mailSent=true;
				pfound=false;
				skipNoPar=false;
				if ( payTotals[i].firstname == 'UnitPaylog' && payTotals[i].lastname =='Account') {
					payTotals[i]['parentExist'] = true;
					//found=true;
					//break;
					skipNoPar=true;
				}
				if ( payTotals[i].firstname == 'RemovedScout' && payTotals[i].lastname =='Account') {
					payTotals[i]['parentExist'] = true;
					//continue looking
					//found=true;
					//break;
					skipNoPar=true;
				}
				if(skipNoPar==false) {
				
					// build message to send, callback to getMailPage
					due='';
					//missing page fixed
					if($('#PastDueOnly','#Page' +pageid).prop('checked')==true) {
						if($('#DueAmt','#Page' +pageid).val() <=0 ) {
							due='Due ';
						}
					}
					var data={UnitID:unitid,MessageType:'email',Subject:'Scout Account Balance '+due+'Notice',Body:'',File:[{filename:'',filedata:''}]};
					var nm=payTotals[i].firstname;
					if(payTotals[i].nickname!=''){
						nm=payTotals[i].nickname;
					}
					
					//data.Body = 'The Scout Account for #scout# has a balance due of #amount#. For transaction details, please view #link abc# Payment Log in Scoutbook.';

					/* convertMsg('The Scout Account for #scout# has a balance due of #amount#. For transaction details, please view #link abc# Payment Log in Scoutbook.',30197,12345,'Joe Puddle','-125.00')
					var defaultlink='#scout#\'s Payment Log';
					var linktxt=$('#BalTxt').val().match(/#link([^#]*)#/);			// #link asdf#
					if(linktxt != null) {
						// there is a link
						if(linktxt[1].trim() != '') {
							//there is a linktext to replace
							defaultlink=linktxt[1].trim();
						}
					}
					
					
					var patlink= '[url=https://'+host+'scoutbook.com/mobile/dashboard/admin/paymentslog.asp?ScoutUserID='+payTotals[i].scoutid+'&UnitID='+unitid+']'+defaultlink+'[/url]';			
					data.Body =$('#BalTxt').val().replace(/#link([^#]*)#/g,patlink).replace(/#scout#/g,nm).replace(/#amount#/g,payTotals[i].amt.toFixed(2)); 
					*/
					var recipienttxt='';
					//missing page fixed
					data.Body=convertMsg($('#BalTxt','#Page' +pageid).val().replace(/\n/g,'\r\n'),unitid,payTotals[i].scoutid,nm,payTotals[i].amt.toFixed(2));
					
					
					var p1='';
					var p2='';
					if(payTotals[i].scoutMail == true) {
						if(payTotals[i].scoutid != '') {
							data['ScoutUserID'] = payTotals[i].scoutid;
							p1='(';
							p2=')';
						}
					}
					//debugger;
					for(j=0;j<payTotals[i].parentids.length;j++) {
						if(j==0) {
							data['ParentUserID']=[];
						}
						data['ParentUserID'].push(payTotals[i].parentids[j]);

						recipienttxt +=  payTotals[i].parconnsNm[j] + ', ';
			
						pfound=true;
					}
					//missing page fixed
					if($('#Bcc','#Page' +pageid).prop('checked')==true) {
						data['BCC'] = '1';
					}
						
					if(myid != '') {
						//missing page fixed
						if($('#Sender','#Page' +pageid).prop('checked')==true) {
							data['LeaderUserID']= myid;
						}
					}
					//only send if there is a valid address
					if(pfound==true) {
						payTotals[i]['parentExist'] = true;
						
						found=true;
						if( payRptDebug==false ) {
							
							
							recipientlist += p1+ nm + ' ' + payTotals[i].lastname +p2+ ', '+ recipienttxt + ' ' +payTotals[i].amt.toFixed(2) + '\n';
							sendEmail(data,mailpageid,unitid,getMailPage,unitid,pageid,nm + ' ' + payTotals[i].lastname);
						} else {
						//	debugger;
							  
							recipientlist += p1+ nm + ' ' + payTotals[i].lastname +p2+ ', '+ recipienttxt + ' ' +payTotals[i].amt.toFixed(2) + '\n';
							setTimeout(function(){ setupSendMail(unitid,mailpageid,pageid); }, 200); 
						}
		
						
						break;
					} else {
						// cannot send to this scout
						payTotals[i]['parentExist'] = false;
						//found=true; 
						//continue looking
					}
				}
			}
		}
	}
	if(found==false) {
		doneSending(unitid);
	} 
		

	
}
// test convertMsg('
function convertMsg(msg,unitid,scoutid,scoutname,amount) {

			msg=msg.replace(/#scout#/g,scoutname).replace(/#amount#/g,amount);
			var defaultlink='#scout#\'s Payment Log';
			var linktxt=msg.match(/#link([^#]*)#/);			// #link asdf#
			if(linktxt != null) {
				// there is a link
				if(linktxt[1].trim() != '') {
					//there is a linktext to replace
					defaultlink=linktxt[1].trim();
				}
			}
			defaultlink=defaultlink.replace(/#scout#/g,scoutname).replace(/#amount#/g,amount);
			var patlink= '[url=https://'+host+'scoutbook.com/mobile/dashboard/admin/paymentslog.asp?ScoutUserID='+scoutid+'&UnitID='+unitid+']'+defaultlink+'[/url]';			
			return msg.replace(/#scout#/g,scoutname).replace(/#amount#/g,amount).replace(/#link([^#]*)#/g,patlink); 	
}

/*

    Bold [b]this is bold[/b]
    Italics [i]italic[/i]
    Underline [u]underline[/u]
    Strikethrough [s]strike this text[/s]
    URL (link) [url]https://www.scoutbook.com[/url]
    URL (text) [url=https://www.scoutbook.com]Scoutbook[/url]
    Image [img]https://www.google.com/logos/doodles/2018/doodle-snow-games-day-9-6192834267840512.2-s.png[/img]

	<a href="https://drive.google.com/file/d/1pZHlcmZ3rZDeOJaJuk5jh1Dws866LEMM/view" target="_blank">Update Scout Youth Leadership Positions</a>
	<img src="/book128.png"   /> 	
*/
function convBB(msg) {
	msg=escapeHTML(msg);
	// everything needs to be escaped
	msg=msg.replace(/\[\/b\]/g,'</b>').replace(/\[b\]/g,'<b>').replace(/\[\/s\]/g,'</s>').replace(/\[s\]/g,'<s>').replace(/\[\/u\]/g,'</u>').replace(/\[u\]/g,'<u>').replace(/\[\/i\]/g,'</i>').replace(/\[i\]/g,'<i>');
	msg=msg.replace(/\[\/img\]/g,'"/>').replace(/\[img\]/g,'<img src="');
	//urls are trickier  Need matched pairs
	var urltxtpairs =msg.match(/\[url=([^\]]+)\]([^\[]*)\[\/url\]/g);
	var urlLine;
	if(urltxtpairs != null) {
		for(var i=0;i<urltxtpairs.length;i++) {
			urlLine=urltxtpairs[i].match(/\[url=([^\]]+)\]([^\[]*)\[\/url\]/);
			msg=msg.replace(urltxtpairs[i],'<a href="' + urlLine[1] + '" target="_blank">'+urlLine[2]+'</a>');
		}
		//  '[url=https://www.scoutbook.com]Scoutbook[/url]'.match(/\[url=([^\]]+)\]([^\[]*)\[\/url\]/);
	}
	// this one may need to be escaped too
	//msg=msg.replace(/\[\/url\]/g,'" target="_blank"></a>').replace(/\[url\]/g,'<a href="');
	
	var urltxtpairs =msg.match(/\[url\]([^\[]*)\[\/url\]/g);
	var urlLine;
	if(urltxtpairs != null) {	
		for(var i=0;i<urltxtpairs.length;i++) {
			urlLine=urltxtpairs[i].match(/\[url\]([^\[]*)\[\/url\]/);
			msg=msg.replace(urltxtpairs[i],'<a href="' + urlLine[1] + '" target="_blank">'+urlLine[1]+'</a>');
		}
	}	

	return msg;
}


function previewGetID(unitID,pageid) {
	var len=0;
	var utype;
	utype="unit";
	var evObj = { name : '', id : '', img : ''};

	
	if ($('base')[0].href.match(/admin\/unit\.asp/) != null) {
		//missing page fixed
		var troop =$('title').text();	//unit page not inside page
	} 
	
	// need to get my connections to build scout list of scouts that user has edit profile capability for
	//var unitID = $('base')[0].href.match(/\d+/)[0];
	var lastname='';
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status != 200) {
				errStatusHandle(this.status,genError,[pageid,unitID,'PB'],previewGetID,[unitID,pageid]);
			}
			if (this.readyState == 4 && this.status == 200) {
				resetLogoutTimer(url);
				servErrCnt=0;

				
				$('div [data-role="content"] >ul >li > div[style*="margin-left"]',this.response).each( function () {
					var txtUnit=$('.orangeSmall',this)[0].textContent;
					if (txtUnit.indexOf(troop) != -1) {
						//this scout is in the unit of interest
						okToUse=true;	
						if(okToUse==true) {
							
							if( $('.permission',this)[0].textContent.indexOf('Full') != -1) {
								// The User has permission to edit this Scout's profile
								var p = $(this).parent();
								evObj.img= $('img',p).attr('src');
								evObj.id ='';
								if( $('a',this).attr('href').match(/\d+/)!=null) {
									evObj.id =  $('a',this).attr('href').match(/\d+/)[0];
								}
								evObj.name = $('a',this)[0].textContent.trim();  //format LASTNAME, firstname
								lastname='';
								if(evObj.name.match(/[^,]+/)!= null) {
									lastname=evObj.name.match(/[^,]+/)[0];
								}
								//debugger;
								//console.log(evObj.name,evObj.id);
								//limit to only scouts in report
								for(var i=0; i< payTotals.length;i++) {
									//firstname in paytotals is NOT a nickname
									if(payTotals[i].lastname.toUpperCase() +', '+payTotals[i].firstname == evObj.name) {
										  payTotals[i].scoutid=evObj.id;
										  len=i;
										  break;
										
									
									}
								}									
							}
						}
					}
				});		
				
				//we have scouts, ok to continue

				procPreview(unitID,len,pageid);
				
				return;
			}
		};

		var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/adultconnections.asp';

		
		xhttp.open("GET",url , true);
		xhttp.responseType="document";

		xhttp.send();
		xhttp.onerror = function() {
			errStatusHandle(500,genError,[pageid,unitID,'PB'],previewGetID,[unitID,pageid]); 
		};
}

//unused
function previewGetID_old(unitid) {


	var parentList=[];
	var scoutList=[];
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[pageid,unitid,'PB'],previewGetID,[pageid,unitid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			var evObj={id:'', scoutName:''};
			$('.scout.checkable',this.response).each(function (index,value) {
				evObj.id = $(this).attr('data-userid');		//id of the scout
				var names=$(this)[0].childNodes[1].innerText.trim().split('\n');
				var nameorder=names[0].split(',');
				evObj.scoutName=nameorder[1].trim() + ' ' + nameorder[0].trim();
				scoutList.push(JSON.parse(JSON.stringify(evObj)));
			});				
			
			// we now have names, ids from what is available in the send message screen.  match up with scouts in the list
			//
			var len=-1;
			for (var i=0;i<payTotals.length;i++) {
				//missing page unused
				if($('#PastDueOnly').prop('checked')==false || parseFloat(payTotals[i].amt) < $('#DueAmt','#Page' +pageid).val()) {
				//if(payTotals[i].amt < 0) 
					var scoutName='';
					if(payTotals[i].nickname != undefined) {
						if(payTotals[i].nickname == '') {
							scoutName=payTotals[i].firstname + ' '+ payTotals[i].lastname;
						} else {
							scoutName=payTotals[i].nickname + ' '+ payTotals[i].lastname;
						}
					} else {
						scoutName=payTotals[i].firstname + ' '+ payTotals[i].lastname;
					}
					
					//9_22_2018
					len=i;
					break;
				/*	for(var j=0;j< scoutList.length;j++) {
						if(scoutList[j].scoutName == scoutName) {
							payTotals[i].scoutid = scoutList[j].id;
							len=i;
							break;
						}
					}
					*/
				}
				if(len !=-1) break;
			}

			//call to get message page id, then post message
			procPreview(unitid,len,pageid);
		}
	}


	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/messages/default.asp?UnitID='+escapeHTML(unitid);
	xhttp.open("GET", url, true);
	xhttp.responseType="document";
	xhttp.send();

	xhttp.onerror =function() {
		errStatusHandle(500,genError,[unitid,'PB'],previewGetID,[unitid]);
	}	
}


function procPreview(unitid,len,pageid) {
				
	var nm=payTotals[len].firstname;
	if(payTotals[len].nickname != undefined) {
		if(payTotals[len].nickname!=''){
			nm=payTotals[len].nickname;
		}
	}
			//missing page fixed
	var msg= convertMsg($('#BalTxt','#Page' +pageid).val(),unitid,payTotals[len].scoutid,nm,payTotals[len].amt.toFixed(2))
	msg=convBB(msg);
	//missing page fixed
	$('#PreviewMessage','#Page' +pageid).empty();
	$('#PreviewMessage','#Page' +pageid).append('<p>'+msg+'</p>');
	$('#PreviewMessageDiv','#Page' +pageid).show();
}


//function unEscapeBB(str) { 
//	var strr = str+'';
//	 return strr.replace(/&amp;|&quot;|&#39;|&lt;|&gt;/g, (m) => unEscapeHTML.replacements[m]); //[&"'<>]
//}
//unEscapeBB.replacements = {  "&amp;" :"&", "&quot;": '"',  "&#39;":"'", "&lt;":"<", "&gt;":">" };



function doneSending(unitid) {
 alert('mail sent to: \n' +recipientlist);
 recipientlist='';
 var errmsg='';
 var comma='';
 for(var i=0;i<payTotals.length;i++) {
	 if(payTotals[i]['parentExist'] == false) {
		 if(errmsg!='') {
			comma=', ';
		 }
		 errmsg = comma + payTotals[i].firstname + ' '+ payTotals[i].lastname;
	 }
 }
 
 if (errmsg != '') {
	 alert('Scout(s) ' +escapeHTML(errmsg)+ ' do not have an associated parent to send a message to.  Please note and contact those parents another way');
 }
 
 $.mobile.loading('hide');
 	$.mobile.changePage(
			'/mobile/dashboard/admin/unit.asp?UnitID=' + unitid,
		{
			allowSamePageTransition: true,
			transition: 'none',
			showLoadMsg: true,
			reloadPage: true
		}
		);
}


/*

LeaderUserID, ParentUserID and ScoutUserID all all 
 data ={UnitID: unitID,MessageType: msgtype, Subject: subj, Body: body,LeaderUserID: thisUserID};
Key Name		Val
---------		-------
 UnitID			numeric SB unit id
 MessageType  	'email'
 LeaderUserID 	numeric SB id
 ParentUserID	numeric SB id
 ScoutUserID	numeric SB id
 Subject 		string
 Body			string
 File			array of objects [{filename: "",filedata:""}]
 
------WebKitFormBoundarynRHKwETPnVxTWniV
Content-Disposition: form-data; name="File"; filename=""
Content-Type: application/octet-stream


------WebKitFormBoundarynRHKwETPnVxTWniV 
 
Accept  text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, *  /*; q=0.01
 
*/

function sendEmail(data,mailpageid,unitID,cb,cbv1,cbv2,scoutname) {


	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[mailpageid,unitID,'PB'],sendEmail,[data,mailpageid,unitID,cb,cbv1,cbv2,scoutname]);
		}
		if (this.readyState == 4 && this.status == 200) {
				resetLogoutTimer(url);
				servErrCnt=0;			
			
			if(this.response.indexOf('Message sent!') == -1) {
				alert('Error Sending Message to ' +escapeHTML(scoutname));
			}
			
			cb(cbv1,cbv2);
		}
	}


	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/messages/default.asp?UnitID='+ escapeHTML(unitID)+'&PageID=Page'+escapeHTML(mailpageid)+'&Action=SendMessage';
	xhttp.open("POST",url , true);
	var boundary='----WebKitFormBoundary' + Math.random().toString().substr(2);
	
	xhttp.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + boundary);
	xhttp.setRequestHeader("Accept", "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript, */*; q=0.01")
	xhttp.responseType="text";
	var multipart='';
	for(var key in data){

		if(Array.isArray(data[key]) == true) {
			for(var i=0;i<data[key].length;i++) {
				if(key == "File") {
					multipart += "--" + boundary
					+ '\r\nContent-Disposition: form-data; name="' + key + '"; filename="' + data[key][i].filename + '"'
					+ "\r\nContent-Type: application/octet-stream"
					+ "\r\n\r\n" + data[key][i].filedata + "\r\n";
				} else {
					multipart += "--" + boundary
					+ '\r\nContent-Disposition: form-data; name="' + key + '"'
					+ "\r\nContent-Type: application/octet-stream"
					+ "\r\n\r\n" + data[key][i]+ "\r\n";					
				}
			}
		} else {
			multipart += "--" + boundary
				   + '\r\nContent-Disposition: form-data; name="' + key + '"'
				   //+ "\r\nContent-type: application/octet-stream"
				   + "\r\n\r\n" + data[key] + "\r\n";
		}
	}
	multipart += "--"+boundary+"--\r\n";			

	xhttp.send(multipart);
	xhttp.onerror = function() {
		errStatusHandle(500,genError,[mailpageid,unitID,'PB'],sendEmail,[data,mailpageid,unitID,cb,cbv1,cbv2,scoutname]);
	}					
}

function pyscript() {
	
		function pageInit() {	
		
			$('#buttonCancel', '#PageX').click(function () {
				
				
				payRpt=false;
					
				$.mobile.changePage(
					
						'https://' + host + '.scoutbook.com/mobile/dashboard/admin/unit.asp?UnitID=X&DenID=&PatrolID=&Refresh=1',
					
					{
					    allowSamePageTransition: true,
					    transition: 'none',
					    showLoadMsg: true,
					    reloadPage: true
					}
				);					
							
					
					//$.mobile.changePage('/mobile/dashboard/admin/unit.asp?UnitID=X');

				return false;
			});
			
			$('#buttonRefresh', '#PageX').click(function () {
				
				
				payRpt=false;
				$.mobile.loading('hide');
				$.mobile.changePage(
					
						'https://'+host+'scoutbook.com/mobile/dashboard/admin/unit.asp?UnitID=X&Refresh=1',
					
					{
					    allowSamePageTransition: true,
					    transition: 'none',
					    showLoadMsg: true,
					    reloadPage: true
					}
				);					
	
				//return false;
			});		
			$('#buttonRefresh2', '#PageX').click(function () {
				
				
				payRpt=false;
				$.mobile.loading('hide');
				$.mobile.changePage(
					
						'https://'+host+'scoutbook.com/mobile/dashboard/admin/unit.asp?UnitID=X&Refresh=1',
					
					{
					    allowSamePageTransition: true,
					    transition: 'none',
					    showLoadMsg: true,
					    reloadPage: true
					}
				);					
	
				//return false;
			});	
			$('#buttonRefresh1', '#PageX').click(function () {
				
				
				payRpt=false;
				$.mobile.loading('hide');
				$.mobile.changePage(
					
						'https://'+host+'scoutbook.com/mobile/dashboard/admin/unit.asp?UnitID=X&Refresh=1',
					
					{
					    allowSamePageTransition: true,
					    transition: 'none',
					    showLoadMsg: true,
					    reloadPage: true
					}
				);					
	
				//return false;
			});	
		}

		function pageShow() {
			
	$('.calendar', '#PageX').each(function() {
		var id = $(this).attr('id');
		$(this).width('75%').before('<img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/calendar50.png" style="float: right; width: 25px; margin-top: 5px; cursor: pointer; " class="calendarIcon" />');
		$($(this).closest('form'), '#PageX').prepend('<input type="hidden" id="hidden_' + escapeHTML(id) + '" value="' + escapeHTML($(this).val()) + '" />');
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
			$('#' + id, '#PageX').val(valueText).trigger('change');
		}
	});
			
	$('.calendarIcon', '#PageX').on('click', function() {
		
		var id = $(this).next('input').attr('id');

		$('#hidden_' + id, '#PageX').mobiscroll('show');
	});
	
	
		$('#LastInitial', '#PageX').click(function () {			
			if ($(this).is(':checked')) {
				$('td[name="LastName"]', '#PageX').each( function () {
					if($(this).text().trim() != 'Account') {
						$(this).text($(this).attr('data-baseval')[0] + '.');
					}
					
				});
				
			} else {
				$('td[name="LastName"]', '#PageX').each( function () {
					$(this).text($(this).attr('data-baseval'));
				});
			}
		});		
	




		$('#buttonExportTransCsv','#PageX').click(function () {
			
			saveText('Paybalance Trans Rpt txtunit ' + logTime(Date.now())+'.csv',htmTableToCsv('transTable', '#PageX'));
		});
		
		$('#buttonExportSumCsv','#PageX').click(function () {
			saveText('Paybalance Summary Rpt txtunit ' + logTime(Date.now())+'.csv',htmTableToCsv('sumTable', '#PageX') + htmTableToCsv('unitSumTable', '#PageX'));
			//saveText('Paybalance Summary Rpt Unit txtunit ' + logTime(Date.now())+'.csv',htmTableToCsv('unitSumTable', '#PageX'));
		});

		$('#DueAmt','#PageX').change(function () {
			if($('#DueAmt','#PageX').val()=='') {
					alert('Reference value must be a number');
					$('#DueAmt','#PageX').val(0);
					return false;
			}

		})	

		$('body').css('background','#ffffff');		
	
		}

		var altPress=false;
		function isKeyPressed(event) {
			if (event.altKey) {
				altPress=true;
			} else {
				altPress=false;
			}
		}		

		function showErrorPopup(msg) {
			$('#errorPopupContent', '#PageX').html(msg);
			$('#errorPopup', '#PageX').popup({ tolerance: '10,40', transition: 'pop', positionTo: 'window', history: false }).popup('open');
		}
		
		
		function escapeHTML(str) { 
var strr = str+'';
 return strr.replace(/[&"'<>]/g, (m) => escapeHTML.replacements[m]); }
		escapeHTML.replacements = { "&": "&amp;", '"': "&quot;", "'": "&#39;", "<": "&lt;", ">": "&gt;" };
		
}



function initTransReport(unitid,tpage,txtunit) {
	// verify dates are set.  If none set, include all history.  If last set but not first, history from beginning to last.  If first set but not last, hostory from start point.
	
	$('body').css('background','#ffffff');
	$('#transTable',tpage).empty();
	$('#summaryTable',tpage).empty();
	
	var startDate=$('#periodStartDate',tpage).val();
	var endDate=$('#periodEndDate',tpage).val();
	var offs={acctOffset:-1};
	

	getPayBalancesEnd(endDate);
	var newdata='<div>End Date: '+escapeHTML(endDate)+'</div>' + summaryTable(endDate,offs,txtunit);
	$(newdata).appendTo('#summaryTable');

	// if lastinitial is checked, apply
	//
			if($('#LastInitial',tpage).prop('checked')==true) {			
				$('td[name="LastName"]',tpage).each( function () {
					if($(this).text().trim() != 'Account') {
						$(this).text($(this).attr('data-baseval')[0] + '.');
					}
					
				});
				
			} else {
				$('td[name="LastName"]',tpage).each( function () {
					$(this).text($(this).attr('data-baseval'));
				});
			}

			
	var tdname;
	var idcol;
	var fncol;
	var lncol;
	//payArray		
	//0=BSA Member ID	1=First Name	2=Last Name	3=Payment Type	4=Date	5=Description	6=Amount	7=Transaction ID	8=Category	9=Notes

	for(j=0;j<payArray[0].length;j++) {
		if(payArray[0][j]=='BSA Member ID') {  
			idcol=j;
		}
		if(payArray[0][j]=='First Name') {  
			fncol=j;
		}
		if(payArray[0][j]=='Last Name') {  
			lncol=j;
		}
	}

	var beginBalance=parseFloat('0');
	if(startDate!='') {
		//get the balance for all dates before the start date
		for(var i=1;i<payArray.length;i++) {
			if(dateDiff(payArray[i][4],startDate)<0) {
				//record is from before the start date
				beginBalance += parseFloat(payArray[i][6]);
			}
		}
	}
	var endBalance=parseFloat('0');
	if(endDate!='') {
		//get the balance for all dates up to and including the end date
		for(var i=1;i<payArray.length;i++) {
			if(dateDiff(payArray[i][4],endDate)<=0) {
				//record is from before the start date
				endBalance += parseFloat(payArray[i][6]);
			}
		}		
	} else {
		for(var i=1;i<payArray.length;i++) {
			endBalance += parseFloat(payArray[i][6]);
		}			
	}
	

	var goodstart=false;
	var goodend=false;
	var ln='';
	var aln='';
	var html= '<div ><p></p><p>Beginning Balance: ' + escapeHTML(beginBalance.toFixed(2)) + '<\p><p>End Balance: '+escapeHTML(endBalance.toFixed(2))+'</p><p></p></div>';
	    html += '<table style="font-weight: normal;border-collapse: collapse;" id="transreport">';
		html += '<thead><tr>';
		
		// these lines could be click to sort
		html += '<th style="border-bottom: 1px solid #ddd;">Ln#</th>';  // 6/4/19
		for (var j=1;j<10;j++ ) {
			html += '<th style="border-bottom: 1px solid #ddd;">' + escapeHTML(payArray[0][j]) + '</th>';
		}
		html += "</tr></thead>";
	var ls=payArray[0].length-1;	
	for (var i=1;i<payArray.length;i++) {
		if(payArray[i][5]!='No Payment History') {
		
			goodstart=false;
			if(startDate == '' ) {
				goodstart=true;
			} else {
				if(dateDiff(startDate,payArray[i][4])<=0) {
					goodstart=true;
				}
			}
			
			var goodend=false;
			if(endDate == '' ) {
				goodend=true;
			} else {
				if(dateDiff(payArray[i][4],endDate)<=0) {
					goodend=true;
				}
			}		
			
			if(goodstart==true && goodend==true) {
				html += '<tr data-filter="">';
				//if(payArray[i][ls]==true) {
				//	console.log(payArray[i]);
				//}
				html += '<td name="Ln#"style="border-bottom: 1px solid #ddd; '+escapeHTML(aln)+'" data-baseval="'+ i +'" data-filter="'+payArray[i][ls]+'">' + i + '</td>';   // 6/4/2019
				
				for (var j=1;j<10;j++ ) {

					if(j==lncol) {
						ln=payArray[i][lncol];
						if($('#LastInitial',tpage).prop('checked')==true) {
							ln=payArray[i][lncol][0] + '.';
						}
						if(payArray[i][lncol]=="Account" && payArray[i][fncol] =='UnitPaylog') {
							ln=payArray[i][lncol];
						} 
					} else {
						
						ln=payArray[i][j];
						aln='';
						if(j==6) {
							ln=parseFloat(payArray[i][j]).toFixed(2);
							aln='text-align:right;';
						}
					}
					tdname=payArray[0][j].replace(/ /,'');
					html += '<td name="'+ escapeHTML(tdname) +'"style="border-bottom: 1px solid #ddd; '+escapeHTML(aln)+'" data-baseval="'+ escapeHTML(payArray[i][j]) +'">' + escapeHTML(ln) + '</td>';
					
				}
				html += "</tr>";
			}
		}
	}
	html += '</tbody></table>';

    //console.log(html);


	html=localDataFilter (html,'','local');
	$('#transCSV',tpage).attr("style","height:40px;");		//make visible
	//$('#ulTbl',tpage).attr("style","margin-top: 0;");		//make visible  change classe
	$('#ulTbl',tpage).removeClass('noprint');
	$(html).appendTo('#transTable');	
	
	

	
	//payArray		
	//0=BSA Member ID	1=First Name	2=Last Name	3=Payment Type	4=Date	5=Description	6=Amount	7=Transaction ID	8=Category	9=Notes
	
	
	var orderlist=[[0,1,3,4],[1,0,3,4],[2,3,1,0],[3,1,0,4],[4,1,0,3],[5,1,0,3],[6,1,0,3],[7,1,0,3],[8,1,0,3]];
	// 0=Ln# 1=First Name	2=Last Name	3=Payment Type	4=Date	5=Description	6=Amount	7=Transaction ID	8=Category	9=Notes
	var orderlist=[[0,4,5,2],[1,2,4,5],[2,1,4,5],[3,4,2,1],[4,2,1,5],[5,2,1,4],[6,2,1,4],[7,2,1,4],[8,2,1,4],[9,2,1,4]];	// 6/4/2019
	
	$("th",tpage).css("cursor", "pointer");
	$("#transreport th",tpage).click( function () {
		var column=$(this).index();	//0 is first column
		var rw=[];
		var tbl=[];
		
		var rt=0;
		var evObj={txt:'',data:'',datafilter:''};
		//'#transreport tr:not(".borderBottom")'
		$('#transreport tbody tr',tpage).each(function () {
			rw=[];
			var rc=0;
			$("td",this).each(function () {				
				evObj.txt=$(this).text().trim();
				evObj.data=$(this).attr('data-baseval');
				evObj.datafilter='';
				if(rc==0) {
					evObj.datafilter=$(this).attr('data-filter');
					//console.log(evObj.datafilter);
					rw[0]=JSON.parse(JSON.stringify(evObj));

				} else {
					rw.push(JSON.parse(JSON.stringify(evObj)));
				}
				rc+=1;
			});
			if(rw.length!=0) {
				if(rt==0){
					tbl[0]=rw;
				} else {
					tbl.push(rw);
				}
				rt+=1;
			} 
			
		});

		var idx=column;
		var res=[];

		tbl.sort(function(a,b) {


			for (var i=0;i<4;i++) {
				//if (orderlist[idx][i] == 3) {
				if (orderlist[idx][i] == 4) {	// 6/4/2019
					//debugger;
					//date
					var stdt = new Date(b[orderlist[idx][i]].data);
					var endt = new Date(a[orderlist[idx][i]].data);
					var stOffst=stdt.getTimezoneOffset();
					var enOffst=endt.getTimezoneOffset();   
					var minOffset= stOffst-enOffst;
					if(altPress==false) {
						var dt=Date.parse(a[orderlist[idx][i]].data) - Date.parse(b[orderlist[idx][i]].data) + minOffset*60*1000;  
					} else {
						var dt=Date.parse(b[orderlist[idx][i]].data) - Date.parse(a[orderlist[idx][i]].data) + minOffset*60*1000;  
					}
					
					res[i]=dt;
				//} else if (orderlist[idx][i] == 5) {
				} else if (orderlist[idx][i] == 6 || orderlist[idx][i] == 0) { //6/4/2019
					res[i]=0;
					if(parseFloat(a[orderlist[idx][i]].data)> parseFloat(b[orderlist[idx][i]].data)) {
						res[i]=1;
					}
					if(parseFloat(b[orderlist[idx][i]].data)> parseFloat(a[orderlist[idx][i]].data)) {
						res[i]=-1;
					}
				
					if(altPress==true) {
						res[i]=parseInt(res[i])*-1;
					}
				} else {
					res[i]=0;
					if(a[orderlist[idx][i]].data.toLowerCase()> b[orderlist[idx][i]].data.toLowerCase()) {
						res[i]=1;
					}
					if(b[orderlist[idx][i]].data.toLowerCase()> a[orderlist[idx][i]].data.toLowerCase()) {
						res[i]=-1;
					}
				}
			}

			if(res[0]==0) {
				if(res[1]==0) {
					if(res[2]==0) {
						return res[3];
					} else {
						return res[2];
					}
				} else {
					return res[1];
				}
			} else {
				return res[0];
			}
							
		});
		
		
		//renumber line numbers
		
		for (var i =0; i<tbl.length;i++) {
			tbl[i][0].txt=i;
			tbl[i][0].data=i;
		}
			
		
		var tblc=0;
		var rwc=0;
		//'#transreport tr:not(".borderBottom")'
		i=0;
		$('#transreport tbody tr',tpage).each(function () {
			var thisrw=this;

			
			rwc=0;

			$("td",this).each(function () {
				$(this).html(tbl[tblc][rwc].txt);
				$(this).attr('data-baseval',tbl[tblc][rwc].data);
				$(this).attr('data-filter',tbl[tblc][rwc].datafilter);
				if(rwc==0) {
					//if this is a filtered line hide or display
					if($('#ExternalTransactions',tpage).prop('checked')==true && $(this).attr('data-filter')=="true") {
						$(thisrw).attr('style',"display:none;");
						$(this).text('');	// blank it out.  Useful for export filtering
					} else {
						$(thisrw).attr('style',"");
						$(this).text(i);
						i+=1;
					}					
				}
				rwc+=1;
			});
			tblc+=1;
		});
		$('body').css("background","#ffffff");
	});	

	//$('#transreport thead th:eq(3)').trigger('click');
	
	$('#transreport thead th:eq(4)',tpage).trigger('click');	//sort

	$('body').css('background','#ffffff');

}


//function called when attempting to send mail messages
// look at the adult's connections to get a list of scouts.
var permCnt=0;
function procProfileForPay(unitID,pageid) {
	recipientlist='';
	$.mobile.loading('show', { theme: 'a', text: 'preparing and sending notices.  This may take a long time for large units...', textonly: false });
	var utype;
	utype="unit";
	var evObj = { name : '', id : '', img : ''};

	
	if ($('base')[0].href.match(/admin\/unit\.asp/) != null) {
		var troop =$('title').text();	//unit page
	} 
	
	// need to get my connections to build scout list of scouts that user has edit profile capability for
	//var unitID = $('base')[0].href.match(/\d+/)[0];
	var lastname='';
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status != 200) {
				errStatusHandle(this.status,genError,[pageid,unitID,'PB'],procProfileForPay,[unitID,pageid]);
			}
			if (this.readyState == 4 && this.status == 200) {
				resetLogoutTimer(url);
				servErrCnt=0;
				scoutPermObjList.length=0;				
				$('div [data-role="content"] >ul >li > div[style*="margin-left"]',this.response).each( function () {
					var txtUnit=$('.orangeSmall',this)[0].textContent;
					if (txtUnit.indexOf(troop) != -1) {
						//this scout is in the unit of interest
						okToUse=true;	
						if(okToUse==true) {
							
							if( $('.permission',this)[0].textContent.indexOf('Full') != -1) {
								// The User has permission to edit this Scout's profile
								var p = $(this).parent();
								evObj.img= $('img',p).attr('src');
								evObj.id ='';
								if( $('a',this).attr('href').match(/\d+/)!=null) {
									evObj.id =  $('a',this).attr('href').match(/\d+/)[0];
								}
								evObj.name = $('a',this)[0].textContent.trim();  //format LASTNAME, firstname
								lastname='';
								if(evObj.name.match(/[^,]+/)!= null) {
									lastname=evObj.name.match(/[^,]+/)[0];
								}
								//console.log(evObj.name,evObj.id);
								//limit to only scouts in report
								for(var i=0; i< payTotals.length;i++) {
									//firstname in paytotals is NOT a nickname
									if(payTotals[i].lastname.toLowerCase() == lastname.toLowerCase()) {
										var thisobj=JSON.stringify(evObj);
										var found=false;
										for(var j=0;j<scoutPermObjList.length;j++) {
											if(JSON.stringify(scoutPermObjList[j]) == thisobj) {
												found=true;
												break;
											}
										}
										if(found==false) {
											scoutPermObjList.push(JSON.parse(JSON.stringify(evObj)));	// this list has more than one record if two scouts share a lst name.
										}
									}
								}									
							}
						}
					}
				});		
				
				//we have scouts, ok to continue
				permCnt=0;
				getMyID(unitID,pageid,troop);
				
				//getAccountForPayBal(unitID,pageid,troop,'report',initSendEmail,unitID); // end that event string with the changepage
				return;
			}
		};

		var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/adultconnections.asp';

		
		xhttp.open("GET",url , true);
		xhttp.responseType="document";

		xhttp.send();
		xhttp.onerror = function() {
			errStatusHandle(500,genError,[pageid,unitID,'PB'],procProfileForPay,[unitID,pageid]); 
		};
}


function getAccountForPayBal(unitid,sPage,txtunit,type,cb,cbv1,cbv2,pageid) {
	
	if (permCnt == scoutPermObjList.length) {
		cb(cbv1,cbv2);		//execute the callback
		return;
	} else {
		
		var offst=permCnt;

		$.mobile.loading('show', { theme: 'a', text: 'processing...this can take several minutes for large units', textonly: false });
		var thisScoutID = scoutPermObjList[offst].id;
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[pageid,unitid,'PB'],getAccountForPayBal,[unitid,sPage,txtunit,type,cb,cbv1,cbv2,pageid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			//console.log('get Account responded');
			getProfileforPayBal(thisScoutID,unitid,sPage,txtunit,type,pageid);
		}
	};
	
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/account.asp?ScoutUserID=' + escapeHTML(thisScoutID);

	
	xhttp.open("GET",url , true);
	xhttp.responseType="text";

	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,genError,[pageid,unitid,'PB'],getAccountForPayBal,[unitid,sPage,txtunit,type,cb,cbv1,cbv2,pageid]);
	};
}

// got the profile - pull the nickname out
function getProfileforPayBal(thisScoutID,unitid,sPage,txtunit,type,pageid) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[pageid,unitid,'PB'],getProfileforPayBal,[thisScoutID,unitid,sPage,txtunit,type,pageid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			//now, look at scout last name and scout first name to match 
			
			for(var i=0;i<payTotals.length;i++) {
				if (payTotals[i].lastname == $('#lastName',this.response).val() && payTotals[i].firstname == $('#firstName',this.response).val()) {
					payTotals[i].nickname=$('#nickName',this.response).val()
					payTotals[i].scoutid=thisScoutID;		//9_22_18
					break;
				}
			}
			permCnt+=1;		
			setTimeout(function(){ getAccountForPayBal(unitid,sPage,txtunit,type,initSendEmail,unitid,pageid,pageid); }, 200);			
		}
	};

	var url = 'https://' + escapeHTML(host) + 'scoutbook.com/mobile/dashboard/admin/editprofile.asp?ScoutUserID=' + escapeHTML(thisScoutID) + '&UnitID=&DenID=&PatrolID=';

	xhttp.open("GET",url , true);
	xhttp.responseType="document";

	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,genError,[pageid,unitid,'PB'],getProfileforPayBal,[thisScoutID,unitid,sPage,txtunit,type,pageid]); 
	};
}
/*
function escapeHTML(str) { 
	var strr = str+'';
	 return strr.replace(/[&"'<>]/g, (m) => escapeHTML.replacements[m]); 
}
escapeHTML.replacements = { "&": "&amp;", '"': "&quot;", "'": "&#39;", "<": "&lt;", ">": "&gt;" };
*/

function htmTableToCsv(id,pageid) {
	var tblCSV='';
	var tbl=$('#'+id,pageid)[0];
	$('tr',tbl).each(function () {
		var firstc=true;
		$('td ,th',this).each( function () {
			if(firstc ==false) {
				tblCSV += ',';
			} else {
				firstc=false;
			}
			tblCSV += '"'+ $(this).text().trim() + '"';
		});		
		tblCSV += '\r\n';		
	});
	return tblCSV;	
}


function logTime(dt) {
	if (dt==-1) {
		return 'notSet';
	}
var d=new Date(dt);
return d.getMonth()+1 +'/'+ d.getDate() + '/'+d.getFullYear()+' '+d.getHours()+':'+d.getMinutes()+':'+d.getSeconds()+'.'+d.getMilliseconds();
}