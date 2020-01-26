// Copyright © 10/4/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.
var scoutPayVal=[];
var scoutNote=[];
var unitScoutId='';
function addRawPayLog(data,pageid,unitID,scoutid) 	{
// If an admin or treasurer, get an option to Close Account
	if(myPositionIs(payPos,unitID) == false ) {
		return data;
	}

	if( data.match(/<\/ul>\s+<div id="comments">/)== null ) return data;
	if( data.match(/function commentsInit/)==null) return data;
	
	
	//debugger;
	var startfunc=data.match(/<\/ul>\s+<div id="comments">/).index;
	
	var newdata=data.slice(0,startfunc);

	newdata += '			<li data-theme="d">\n';
	newdata += '					<div class="normalText">\n';
	newdata += '						<a data-role="button" data-theme="g" data-inline="true" data-mini="true"  href="#" id="buttonCloseAccount">\n';
	newdata += '								Close Account\n';
	newdata += '						</a>\n';
	newdata += '					</div>\n';
	newdata += '			</li>\n';

	newdata += data.slice(startfunc);
	data=newdata;
	
	var startfunc=data.match(/function commentsInit/).index;
	var newdata=data.slice(0,startfunc);
	newdata += '	$("#buttonCloseAccount").click(function() {\n';	
	newdata += '    	procCloseAccount("'+escapeHTML(unitID)+'","'+escapeHTML(pageid)+'","'+escapeHTML(scoutid)+'");\n';
	newdata += '	});\n';	
	newdata += data.slice(startfunc);
	data=newdata;	
	
	return data;
	

}
//this handles the new SB QE
function addRawPayQE1(data,pageid,unitID) 	{
	var unitPayLogID ='';
	
	if(data.match(/>\s*UnitPaylog Account\s*</) ==null) {
		addRawPayQE(data,pageid,unitID);	// add the simple stuff
		return data;
	}		
	
	//Remove UnitPaylog from the table
	var startfunc=data.indexOf('<table class="qe-table">');
	if (startfunc ==-1) {
		return data;
	}
	
	
	
	var bodyst=data.indexOf('<tbody>',startfunc) +7;
	var endfunc = data.indexOf('</tbody',startfunc);
	
	var tablestr=data.slice(bodyst,endfunc);
	//parse the string row by row looking for Account
	
	
	var endrow=0;
	var ptr=0;
	var resTable='';
	var rows=tablestr.match(/<tr/g).length;
	for (var i=0;i<rows;i++) {
		endrow=tablestr.indexOf('</tr>',ptr);
		if( tablestr.slice(ptr,endrow).match(/UnitPaylog Account/) == null) {
			// this row does not have an Account in it	
			resTable+= tablestr.slice(ptr,endrow+5) + '\n';
		} else {
			unitPayLogID=tablestr.slice(ptr,endrow+5).match(/id="scoutUserID(\d+)/)[1];
		}
		ptr=endrow+5;
	}
	
	data = data.slice(0,bodyst) + resTable + data.slice(endfunc);
	
	// add links to scout pages  https://www.scoutbook.com/mobile/dashboard/admin/paymentslog.asp?ScoutUserID=xxxx&UnitID=yyyy
	var idNamePairs=data.match(/<label for="scoutUserID\d+|<div class="scout-name">[^<]+/g)	
	
	var snm='';
	for(var i=0;i<idNamePairs.length;i=i+2) {
		//id = idNamePairs[i].match(\d+)[0];
		snm=idNamePairs[i+1].match(/>([^<]+)/)[1];
		data = data.replace(idNamePairs[i+1],'<div class="scout-name"><a href="https://'+host+'scoutbook.com/mobile/dashboard/admin/paymentslog.asp?ScoutUserID='+idNamePairs[i].match(/\d+/)[0]+'&UnitID='+ unitID + '">'+snm+'</a>'); 	
	}
	
	var txtunit="Unit"
	
	if(data.match(/unit\.asp\?UnitID=\d+" class="text" data-direction="reverse">([^<]+)/)!=null) {
		txtunit= data.match(/unit\.asp\?UnitID=\d+" class="text" data-direction="reverse">([^<]+)/)[1];
	}	
		
	var newdata= '				<input type="radio" name="PaymentType" id="paymentTypeTransfer" value="Transfer"  checked="checked"  data-theme="d">';
	newdata+= '				<label for="paymentTypeTransfer">Credit selected Scout Account(s) (Transfer from '+txtunit+')</label>';

	newdata += '			<input type="radio" name="PaymentType" id="paymentTypeWithdraw" value="Withdrawal"   data-theme="d">';
	newdata+= '				<label for="paymentTypeWithdraw">Cash or check withdrawal from selected Scout Account(s)</label>';				
	
	
	data=data.replace(/Record a Payment/,'Deposit Scout cash or checks to selected Scout Account(s)');
	data=data.replace(/Record an Amount Due/,'Charge selected Scout Account(s) (Transfer to '+txtunit+')');

	
	var startfunc = data.indexOf('<input type="radio" name="PaymentType" id="paymentTypePayment"');
	data=data.slice(0,startfunc) + newdata + data.slice(startfunc);
	data=data.replace("if( $(this).val() == 'Payment')","if( $(this).val() == 'Payment' || $(this).val() == 'Transfer')");
	

	// replace the submit function  $('div[data-role="page"]').append(script)
		
		var startfunc = data.indexOf('function submitForm()',1);
		var endfunct = data.indexOf('function deleteLog()',1);
		var myfunc = '' + mySubmitForm;
		
		
		//Replace submitForm() on page
		myfunc= myfunc.replace(/\#PageX/g,'#Page' + escapeHTML(pageid)).replace(/UnitID=X/g,'UnitID='+ escapeHTML(unitID)).replace(/unitPayLogID=X/g,'unitPayLogID='+escapeHTML(unitPayLogID));
		var myfuncb='';
		var newdata = data.slice(0,startfunc) + 'function submitForm()' + myfunc.slice(23) + '\n' + myfuncb + "\n" + data.slice(endfunct);
		data = newdata;



	// Add a quick link to UnitPaylog
	var startfunc = data.match(/<\/ul>\s+<\/form>/).index;
	var newdata = data.slice(0,startfunc) + '<li><a href="https://'+host+'scoutbook.com/mobile/dashboard/admin/paymentslog.asp?ScoutUserID='+unitPayLogID+'&UnitID='+unitID+'" target="_blank" >Open Unit Paylog Account in a new tab</a>\n</li>\n'  +data.slice(startfunc);
	data=newdata;	
	
	data=data.replace(/\$\('#customize'\)\.on\('click'/,"$('#customize','#Page"+pageid+"').on('click'");
	

	var startfunc = data.match(/\$\('#paymentsLogForm', '#Page\d+'\)\.submit\(function/).index;
	var endfunct = data.indexOf("$('#buttonCancel', '#Page");
	var myfunc = '' + myFormSubmit;	
	
		myfunc= myfunc.replace(/\#PageX/g,'#Page' + escapeHTML(pageid)).replace(/UnitID=X/g,'UnitID='+ escapeHTML(unitID)).replace(/unitPayLogID=X/g,'unitPayLogID='+escapeHTML(unitPayLogID));
		var myfuncb='';
		var newdata = data.slice(0,startfunc)  + myfunc.slice(25).slice(0,-1) + "\n" + data.slice(endfunct);
		data = newdata;	
	
	
	return data;
	
	
}

function myFormSubmit() {
			$('#paymentsLogForm', '#PageX').submit(function () {
				formPost = $('#paymentsLogForm', '#PageX').serialize();
				
				formPost=formPost.replace(/PaymentType=Transfer/,'PaymentType=Payment').replace(/PaymentType=Withdrawal/,'PaymentType=Charge');

				$('#buttonCancel, #buttonSubmit, #buttonDelete', '#PageX').button('disable');
				$.mobile.loading('show', { theme: 'a', text: 'saving...', textonly: false });
				setTimeout(function () {
					//debugger;
					submitForm();
				}, 1000);
				return false;
			});	
	
}

function addRawPayQE(data,pageid,unitID) 	{		

	var indata=data;
	
	//fix thousands display
	
	var tmatch=data.match(/value="\d+,\d+/g);
	if (tmatch != null ) {
		for(var i=0;i<tmatch.length;i++) {
			data =data.replace(tmatch[i],tmatch[i].replace(',',''))
		}
	}
	
	if(data.match(/id="buttonDelete"/) != null) {
		return data;
	}
	

	
		   // modify css to position images properly due to Chrome 57 change

	data=data.replace(/\!validateCurrency/,'!validateCurrencyE');	
	
	var newcode = "if (fail) {\n"
	newcode += "showErrorPopup('Amount must be 0.01 or more');\n";
	newcode += "$.mobile.loading('hide');\n";
	newcode += "$('#buttonCancel, #buttonSubmit, #buttonDelete', '#Page" + escapeHTML(pageid)+"').button('enable');\n";
	newcode +=  " return false;\n";
	newcode +=  "}\n";
	
	data=data.replace(/if \(fail\) return false\;/,newcode);
	
	if (scoutlist != '') {
		var txtunit="Unit"
		
		if(data.match(/unit\.asp\?UnitID=\d+" class="text" data-direction="reverse">([^<]+)/)!=null) {
			txtunit= data.match(/unit\.asp\?UnitID=\d+" class="text" data-direction="reverse">([^<]+)/)[1];
		}		
		var newdata=data.replace('{ position: absolute; width: 30px; height: 30px; top: -5px; border: 1px solid gray; }', '{ position: relative; width: 30px; height: 30px; top: -5px; border: 1px solid gray; }');
		data = newdata;			   
	   
	   
	   
	   // insert scoutlist html taken from hiking log form into raw data
		newdata=data.replace('<li data-role="fieldcontain" id="paymentTypeLI">',scoutlist + '\n' + '<li data-role="fieldcontain" id="paymentTypeLI">');
		data = newdata;


		// add a transfer button if UnitPaylog Account is in scoutlist
		var isUnit=false;	
		var unitPayLogID='';
		 for(var i=0;i<scoutPermPayObjList.length;i++) {
			 
		   if(scoutPermPayObjList[i].name == 'ACCOUNT, UnitPaylog') {
			   unitPayLogID=scoutPermPayObjList[i].id;
			   isUnit=true;
				//				<input type="radio" name="PaymentType" id="paymentTypePayment" value="Payment"  checked="checked"  data-theme="d">
				//				<label for="paymentTypePayment">Record a Payment</label>
				
			    newdata= '				<input type="radio" name="PaymentType" id="paymentTypeTransfer" value="Transfer"  checked="checked"  data-theme="d">';
				newdata+= '				<label for="paymentTypeTransfer">Credit selected Scout Account(s) (Transfer from '+txtunit+')</label>';

				newdata += '			<input type="radio" name="PaymentType" id="paymentTypeWithdraw" value="Withdrawal"   data-theme="d">';
				newdata+= '				<label for="paymentTypeWithdraw">Cash or check withdrawal from selected Scout Account(s)</label>';				
				
				
				data=data.replace(/Record a Payment/,'Deposit Scout cash or checks to selected Scout Account(s)');
				data=data.replace(/Record an Amount Due/,'Charge selected Scout Account(s) (Transfer to '+txtunit+')');
	
				
				var startfunc = data.indexOf('<input type="radio" name="PaymentType" id="paymentTypePayment"');
				data=data.slice(0,startfunc) + newdata + data.slice(startfunc);
				data=data.replace("if( $(this).val() == 'Payment')","if( $(this).val() == 'Payment' || $(this).val() == 'Transfer')");
				
				
				break;
		   }
		 }
		 if(isUnit==false) {
				data=data.replace(/Record a Payment/,'Credit selected Accounts');
				data=data.replace(/Record an Amount Due/,'Charge selected Accounts');				 
		 }
	//hide Amount from old form
	data=data.replace(/id="amountLI"/,'id="amountLI" style="display:none"');
	// replace the submit function  $('div[data-role="page"]').append(script)
		
		var startfunc = data.indexOf('function submitForm()',1);
		var endfunct = data.indexOf('function deleteLog()',1);
		var myfunc = '' + mysubmitForm;
		
		
		//Replace submitForm() on page
		myfunc= myfunc.replace(/\#PageX/g,'#Page' + escapeHTML(pageid)).replace(/UnitID=X/g,'UnitID='+ escapeHTML(unitID));
		//var myfuncb =(getPaymentLogIDLI + '').replace(/\#PageX/g,'#Page' + escapeHTML(pageid));
		var myfuncb='';
		var newdata = data.slice(0,startfunc) + 'function submitForm()' + myfunc.slice(23) + '\n' + myfuncb + "\n" + data.slice(endfunct);
		data = newdata;
		
		// modify/add new functions into page for getting paymentlogIDLIs
		
		var startfunc = data.indexOf("$('[name=PaymentType]'",1);
		var endfunct = data.indexOf("$('#category'",startfunc);
		myfunc = '' + wrapper;
		myfunc = myfunc.slice(20).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(pageid)).replace(/UnitID=X/g,'UnitID='+ escapeHTML(unitID));
		var newdata = data.slice(0,startfunc) + myfunc + '\n'  + data.slice(endfunct);
		data = newdata;	

		// Replace the buttonCancel
		var startfunc = data.indexOf("$('#buttonCancel', '#Page",1);
		var endfunct = data.indexOf("$('#buttonSubmit', '#Page",1);
		myfunc = '' + lrapper;
		myfunc = myfunc.slice(20).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(pageid)).replace(/UnitID=X/g,'UnitID='+ escapeHTML(unitID));
		var newdata = data.slice(0,startfunc) + myfunc + '\n'  + data.slice(endfunct);
		data = newdata;						
			
		var startfunc = data.indexOf('<a id="goBack"',1);
		var endfunct = data.indexOf('<img src',startfunc);
		myfunc = '<a id="goBack" href="'+escapeHTML('/mobile/dashboard/admin/unit.asp?UnitID='+escapeHTML(unitID))+'" data-transition="slide" data-direction="reverse";>';
		var newdata = data.slice(0,startfunc) + myfunc + '\n'  + data.slice(endfunct);
		data = newdata;					
		

		if(isUnit == true) {

			//Add easy link to the unit paylog account if there is one;
			if(data.match(/<\/ul>\s+<\/form>/) ==null) {
				for(j=0;j<scoutPermPayObjList.length;j++) {
					if(scoutPermPayObjList[j].payPage == true) {
						alert(scoutPermPayObjList[j].name +" does not have an accessible New Payment Form in Scoutbook.  Unable to create Quick Entry.");
						$.mobile.loading('hide');
						$('#faOverlay',pageid).hide();
						return indata;
						break;
					}
				}
				
			} else {
				var startfunc = data.match(/<\/ul>\s+<\/form>/).index;
				var newdata = data.slice(0,startfunc) + '<li><a href="https://'+host+'scoutbook.com/mobile/dashboard/admin/paymentslog.asp?ScoutUserID='+unitPayLogID+'&UnitID='+unitID+'" target="_blank" >Open Unit Paylog Account in a new tab</a>\n</li>\n'  +data.slice(startfunc);
				data=newdata;
			}
		}


	
		//add modification notice
		//startfunc = data.indexOf('<div style="margin-top: 6px;">&copy;');
		//var newdata = data.slice(0,startfunc);
		//newdata += '<div style="margin-top: 6px;">This page was modified by the Feature Assistant Extension/Add-on and is not supported by BSA</div>';	
		//data=newdata + data.slice(startfunc);	
	} else {

		//debugger;
		data=data.replace(/\$\('#paymentsLogForm', '#Page\d+'\)\.submit\(\);/,"pylgsubmit('#Page" + escapeHTML(pageid)+"');");
		
		
		data=data.replace(/<form /,'<div><input type="hidden" id="UnitPaylogScoutID" value="" ></div><form ');

		var newcode='<input type="radio" name="PaymentType" id="paymentTypeNone" value="None"  checked="checked"  data-theme="d">\n';
		newcode+='<label for="paymentTypeNone">Select Transaction Type</label>\n';


		data=data.replace(/<input type="radio" name="PaymentType" id="paymentTypePayment" value="Payment"  checked="checked"  data-theme="d">/,newcode +'<input type="radio" name="PaymentType" id="paymentTypePayment" value="Payment"  data-theme="d">');

		data=data.replace(/setTimeout('submitForm()', 1000);/,"setTimeout(function () {submitForm();})', 1000)");
			
	}
	scoutlist='';
	data=data.replace(/Record a Payment/,'Credit this Account');
	data=data.replace(/Record an Amount Due/,'Charge this Account');	

	var newdata = '<div style="margin-top: 6px;">This page was modified by the Feature Assistant Extension/Add-on and is not supported by BSA</div>\n';		
	data=data.replace(/<div style="margin-top: 6px;">&copy;/,newdata+ '<div style="margin-top: 6px;">&copy;');
		
	var startfunc = data.indexOf('<div id="footer"');
	
	var newdata = '	<div data-role="popup" id="popupUnitTrans" data-theme="d" data-history="false">';
	
	newdata +=			'<ul data-role="listview" data-inset="true" style="min-width: 300px;" data-theme="d" >';  //class="ui-icon-alt"
	newdata +=				'<li data-role="divider" data-theme="e">Select from the following choices</li>';					
	newdata +=	'			<li>Create matching transactions in UnitPaylog Account (for Scout Charges or simple transfers between accounts)</li>';
	newdata +=	'			<li>';
	newdata +=	'				<input type="submit" value="Match" data-theme="d" id="unitTransMatch" >';
	newdata +=	'			</li>';
	newdata +=	'			<li>Do not match. Create only a single transaction for this Scout.  This is unusual in unit accounting!</li>';
	newdata +=	'			<li>';	
	newdata +=	'				<input type="submit" value="No Match" data-theme="d" id="unitTransContinue" >';
	newdata +=	'			</li>';	
	newdata +=	'			<li>Cash payments received from Scouts, or withdrawals resulting in a cash payment to a Scout</li>';
	newdata +=	'			<li>';	
	newdata +=	'				<input type="submit" value="Cash Transactions" data-theme="d" id="unitTransCash" >';
	newdata +=	'			</li>';
	newdata +=	'			<li>';		
	newdata +=	'				<input type="submit" value="Cancel" data-theme="g" id="unitTransCancel" >';

	newdata +=			'</ul>';						

	
	newdata += '	</div>';				
	data = data.slice(0,startfunc) + newdata + '\n' + data.slice(startfunc);		
	
	startfunc = data.indexOf("$('#buttonSubmit', '#Page");
	var myfunc = '' + pyleact;
	myfunc = myfunc.slice(21).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(escapeHTML(pageid))).replace(/UnitID=X/g,'UnitID='+ escapeHTML(unitID))
	data = data.slice(0,startfunc) + myfunc + '\n' + data.slice(startfunc);		
	

	
	return data;
}

function pyleact() {
	$('#unitTransCancel','#PageX').click( function() {
		$('#popupUnitTrans','#PageX').popup('close');
		$('#faOverlay','#PageX').hide();
		return false;
	});	
	$('#unitTransContinue','#PageX').click( function() {
		$('#popupUnitTrans','#PageX').popup('close');
		$('#faOverlay','#PageX').hide();
		$('#paymentsLogForm','#PageX').submit();
		return false;
	});	
	$('#unitTransMatch','#PageX').click( function() {
		$('#popupUnitTrans','#PageX').popup('close');
		$('#faOverlay','#PageX').hide();
		//$('#paymentsLogForm','#PageX').submit();
		//alert('simply unit transfers not yet handled');
		var UnitID=X;
		var unitPayLogID= $('#UnitPaylogScoutID','#PageX').val();
		var paytype='';
		if ($('[name="PaymentType"]:checked').val() == "Payment") {
			paytype="Transfer";
		}
		if ($('[name="PaymentType"]:checked').val() == "Charge") {
			paytype="Charge";
		}	
		var snote=$('textarea[name="Notes"]').val();
		var thisScout=$('a#account').attr('href').match(/ScoutUserID=(\d+)/)[1];
		var Amt=$('input[name="Amount"]').val();
		var nm=$('a#account').text();
		var pageArray=[{scoutUserID:thisScout, scoutName:nm,scoutAmt:Amt,scoutNote:snote}];
		updateUnitAccountQE('#PageX',UnitID,unitPayLogID,pageArray,false,'',paytype);
		return false;
	});		
	$('#unitTransCash','#PageX').click( function() {
		$('#popupUnitTrans','#PageX').popup('close');
		$('#faOverlay','#PageX').hide();
		//$('#paymentsLogForm','#PageX').submit();
		//alert(' multiple unit transactions not yet handled');
		var UnitID=X;
		var unitPayLogID= $('#UnitPaylogScoutID','#PageX').val();
		var paytype='';
		if ($('[name="PaymentType"]:checked').val() == "Payment") {
			paytype="Payment";
		}
		if ($('[name="PaymentType"]:checked').val() == "Charge") {
			paytype="Withdrawal";
		}
		var snote=$('textarea[name="Notes"]').val();
		var thisScout=$('a#account').attr('href').match(/ScoutUserID=(\d+)/)[1];
		var Amt=$('input[name="Amount"]').val();
		var nm=$('a#account').text();
		var pageArray=[{scoutUserID:thisScout, scoutName:nm,scoutAmt:Amt,scoutNote:snote}];
		
		updateUnitAccountQE('#PageX',UnitID,unitPayLogID,pageArray,false,'',paytype);
		return false;
	});			
	
}
function pylgsubmit(pageid) {
	if($('input[name="PaymentType"]:checked',pageid).val() == 'None') {
			//newcode+="		alert('Please select a transaction type');
		showErrorPopup('Please select a transaction type.');
		return;
	}

	var dnow=new Date(Date.now());
	var dt=$('input#logDate',pageid).val();
	if(dateDiff(dt,dnow)>0 || dt=='') {
		showErrorPopup('Date cannot be blank or in the future');
		return;				
	}	
	
	var ds=$('input#description',pageid).val();
	if(ds=='') {
		showErrorPopup('Please enter a description');
		return;				
	}		
	var ds=$('input#amount',pageid).val();
	if(ds=='') {
		//debugger;
		showErrorPopup('Please enter an amount');
		return;				
	}
	if(validateCurrencyE(ds)==false) {
		//debugger;
		showErrorPopup('Please enter .01 or more');
		return;				
	}	
	
	$('#faOverlay',pageid).show();
	// detect if UnitPaylog exists and matching transactions should be made. Check adultconnections
	isUnitPaylog(pageid);
	
	//$('#paymentsLogForm',pageid).submit();
}

function lrapper() {
	
	$('#buttonCancel', '#PageX').click(function() {
			$.mobile.changePage(
				'/mobile/dashboard/admin/unit.asp?UnitID=X',
			{
				allowSamePageTransition: true,
				transition: 'none',
				showLoadMsg: true,
				reloadPage: true
			}
		);	
	});
}

//payqe
	// This function is inserted as submitForm()
function mysubmitForm() {
			scoutUserID.length=0;
			scoutPayVal.length=0;
			scoutNote.length=0;

			if($('input[name="Description"]','#PageX').val() =='') {
				alert('Need a Description');
				$.mobile.loading('hide');
				$('#buttonCancel, #buttonSubmit, #buttonDelete', '#PageX').button('enable');
				return;
			}
			//if($('input[name="Amount"]','#PageX').val() =='') {
			//	alert('Need an amount');
			//	$.mobile.loading('hide');
			//	$('#buttonCancel, #buttonSubmit, #buttonDelete', '#PageX').button('enable');
			//	return;
			//}			
			var dnow=new Date(Date.now());
			var dt=$('input#logDate','#PageX').val();
			if(dateDiff(dt,dnow)>0 || dt=='') {
				alert('Date cannot be blank or in the future');
				$.mobile.loading('hide');
				$('#buttonCancel, #buttonSubmit, #buttonDelete', '#PageX').button('enable');
				return;				
			}
			

		    var err=false;
			$('input[name="ScoutUserID"]:checked','#PageX').each(function () {
				if(err==false) {
					
					if($('#aID'+ this.value ,'#PageX').val().match(/[0-9]/) == null ) {					
						alert('Selected Scout ' +$('label[for='+ $(this).attr('id') +']').text().trim() +' is missing a payment amount');
						$.mobile.loading('hide');
						$('#buttonCancel, #buttonSubmit, #buttonDelete', '#PageX').button('enable');
						err=true;
					} else {
						// check for non-numeric values
						if(isNumeric($('#aID'+ this.value ,'#PageX').val()) == true ) {				
							scoutPayVal.push($('#aID'+ this.value ,'#PageX').val());
							scoutUserID.push(this.value);
							scoutNote.push(encodeURIComponent($('#nID'+ this.value ,'#PageX').val()));
						} else {
							alert('Selected Scout ' +$('label[for='+ $(this).attr('id') +']').text().trim() +' payment amount must be numeric');
							$.mobile.loading('hide');
							$('#buttonCancel, #buttonSubmit, #buttonDelete', '#PageX').button('enable');
							err=true;
							//return;
						}
					}
				}
				//alert(this.value);
			});
			
			if(err == true) {
				return;
			}
			// reset all LI's to normal color
			$('li[id$=LI]', '#PageX').removeClass('ui-body-e').addClass('ui-btn-up-c');			
			var UnitID=X;		
			externalSubmit('#PageX',UnitID);
}

		function validateCurrencyE(amount) {
			if(amount == 0) return false;
			var regex = /(^[1-9]\d*(?:\.\d{0,2})?$|^[0]*\.\d{1,2}?$)/;
			return regex.test(amount);
		}
		
	// This function is inserted as submitForm() in the updated QE form
function mySubmitForm() {	
			// validate amounts
			var aok=-1;
			var failMsg='';
			var failMsgT='';
			var scoutSelected=false;
			$('[name*=Amount]', '#PageX').each(function () {
				var amount = $(this).val();
				if (amount != '' && !validateCurrencyE(amount)) {
					failMsgT='Amounts must be 0.01 or more. ';
				} else {
					if(amount != '') {
						aok=amount;
					}
				}
			});
			
			failMsg += failMsgT;
			failMsgT='';
			// make sure any checked names have an amount
			$('input[name="ScoutUserID"]:checked', '#PageX').each( function () {
				scoutSelected=true;
				var id=$(this).val();
				if($('[name="Amount'+id+'"]', '#PageX').val() =='' && $('[name="Amount'+id+'"]', '#PageX').attr('placeholder') =='') {
					failMsgT='Make sure Scouts checked have an Amount. ';
					fail=true;
				}
			});

			failMsg += failMsgT;
			failMsgT='';			
			
			if(scoutSelected==false) {
				fail = true;
				failMsg += 'Select at least one Scout. ';
			}
			//xxxx
			
			

			
			var dnow=new Date(Date.now());
			var dt=$('input#logDate','#PageX').val();
			if(dateDiff(dt,dnow)>0 || dt=='') {
				failMsg +='Date cannot be blank or in the future. ';
			}	

			if(aok==-1) {
				failMsg +='Please enter an amount. ';
			} else {			
				var ds=$('input#amount','#PageX').val();
				if(ds=='') {
					$('input#amount','#PageX').val(aok);			
				}
			}	

			
			
			var ds=$('input#description','#PageX').val();
			if(ds=='') {
				failMsg +='Please enter a description. ';
			}


			if($('input[name="PaymentType"]:checked','#PageX').val() =='None') {
				failMsg +='Select Payment Type. ';
			}				

			if (failMsg != '') {
				showErrorPopup(failMsg);
				$.mobile.loading('hide');
				$('#buttonCancel, #buttonSubmit, #buttonDelete', '#PageX').button('enable');				
				return false;
			}


//save all scoutids, values, names, and notes
			var pageArray=[];
			var payObj ={scoutUserID:'', scoutName:'',scoutAmt:'',scoutNote:''};

			$('label[data-icon="checkbox-on"]').each(function () {
				payObj.scoutUserID=$(this).attr('for').match(/\d+/)[0];
				
				payObj.scoutAmt=$('input[name="Amount'+payObj.scoutUserID +'"]').val();
				if(payObj.scoutAmt=='') {
					payObj.scoutAmt=$('input[name="Amount'+payObj.scoutUserID +'"]').attr('placeholder');
				}
				payObj.scoutNote=$('input[name="Notes'+payObj.scoutUserID +'"]').val();
				if(payObj.scoutNote=='') {
					payObj.scoutNote=$('input[name="Notes'+payObj.scoutUserID +'"]').attr('placeholder');
				}
				payObj.scoutName=$(this).text().trim();  // in 'John Doe' format
				pageArray.push(JSON.parse(JSON.stringify(payObj)));
			});

			var UnitID=X;
			var unitPayLogID=X;
			updateUnitAccountQE('#PageX',UnitID,unitPayLogID,pageArray,false,'','')

}

function completeSubmitForm(pageid,unitID) {
			var formPost = $('#paymentsLogForm', pageid).serialize();
			// reset all LI's to normal color
			$('li[id$=LI]', pageid).removeClass('ui-body-e').addClass('ui-btn-up-c');

			var url = '/mobile/dashboard/admin/paymentslogentry.asp?Action=Submit&ScoutUserID=&UnitID='+unitID+'&PaymentLogID=&QuickEntry=1';
			$.ajax({
				url: url,
				type: 'POST',
				dataType: 'script',
				data: formPost,
				error: function (xhr, status, error) {
					$.mobile.loading('hide');
					showErrorPopup('We could not save the log.  Please try again.');
				},
				complete: function() {
					$('#buttonCancel, #buttonSubmit, #buttonDelete', pageid).button('enable');
				}
			});
			
}	
	// end of submitform on page
	



//------------------

function updateUnitAccountQE(pageID,unitID,unitPayLogID,pageArray,cb,payid,PaymentTypeIn) {
	

	if(pageArray.length==0) {
		if(PaymentTypeIn=='') {
			completeSubmitForm(pageID,unitID);
		} else {
			$('#paymentsLogForm',pageID).submit();
		}
		return;
	}
	var payObj=pageArray[0];
	
	var scoutname='';
	
	//PaymentType=Payment&LogDate=1%2F2%2F2020&Description=test+descript&Amount=1&TransactionID=123&Category=Dues&CategoryOther=&ApplyPaymentLogID=&CalendarEventID=&PaymentDueDate=&Notes=some+notes
	
	var formPost='PaymentType=&LogDate=&Description=&Amount=&TransactionID=&Category=&CategoryOther=&ApplyPaymentLogID=&CalendarEventID=&PaymentDueDate=&Notes='

    formPost=tokenVal(formPost,'LogDate',encodeURIComponent($('input[name="LogDate"]',pageID).val()));
	formPost=tokenVal(formPost,'Amount',encodeURIComponent(payObj.scoutAmt));
	formPost=tokenVal(formPost,'Category',encodeURIComponent($('#category option:selected').val()));	
	formPost=tokenVal(formPost,'Notes',encodeURIComponent(payObj.scoutNote));	
	formPost=tokenVal(formPost,'CalendarEventID',encodeURIComponent($('#calendarEventID option:selected').val()));	
	formPost=tokenVal(formPost,'PaymentDueDate',encodeURIComponent($('#paymentDueDate').val()));
	var PaymentType;
	if(PaymentTypeIn=='') {
	   PaymentType=$('input[name="PaymentType"]:checked').val();
	} else {
		PaymentType=PaymentTypeIn;
	}
	
	if (PaymentType=='Transfer') {
		formPost=formPost.replace(/PaymentType=/,'PaymentType=Charge');	//simple case
		formPost=formPost.replace(/ApplyPaymentLogID=[^&]*&/,'');  //just remove it
		cb=false;
	} else {
		if (PaymentType=='Payment') {
			
			//this one is complex.
			//The first time thru, want a charge.  And Second Time - use the correct Apply Payment To
			if(cb==true) {
				//second time thru
				formPost=formPost.replace(/PaymentType=/,'PaymentType=Payment');
				cb=false;	
				// on payments, do not include payment due date or calendar event
				formPost=formPost.replace(/CalendarEventID=[^&]*&/,''); 
				formPost=formPost.replace(/PaymentDueDate=[^&]*&/,''); 			
				formPost=tokenVal(formPost,'ApplyPaymentLogID',payid);		//replace the payid with the one for the Apply Payment To

			} else {
				//first time thru
				cb=true;
				formPost=formPost.replace(/PaymentType=/,'PaymentType=Charge');
				formPost=formPost.replace(/ApplyPaymentLogID=[^&]*&/,'');  //just remove it
				formPost=formPost.replace(/TransactionID=[^&]*&/,'');  //remove check or transaction ID
			}
		} else {
			if (PaymentType=='Charge') {
				// scout had a charge, need to convert to a payment for the unit.  
				// However, for this, the unit had no previous charge so the Apply Payment To can only be to Unassigned
				formPost=formPost.replace(/PaymentType=/,'PaymentType=Payment');
				//formPost=tokenVal(formPost,'ApplyPaymentLogID','');		// same as Unassigned
				formPost=formPost.replace(/ApplyPaymentLogID=[^&]*&/,'');  // not sure it should be eliminated, maybe just blanked out
				// on payments, do not include payment due date or calendar event
				formPost=formPost.replace(/CalendarEventID=[^&]*&/,''); 
				formPost=formPost.replace(/PaymentDueDate=[^&]*&/,''); 
			} else {
				//type is Withdrawal
				//first time thru should be a charge
				//2nd time thru should be a payment
				//this one is complex.
				//The first time thru, want a charge.  And Second Time - use the correct Apply Payment To
				if(cb==true) {
					//second time thru
					cb=false;
					formPost=formPost.replace(/PaymentType=/,'PaymentType=Payment');					
					formPost=tokenVal(formPost,'ApplyPaymentLogID',payid);		//replace the payid with the one for the Apply Payment To

					// on payments, do not include payment due date or calendar event
					formPost=formPost.replace(/CalendarEventID=[^&]*&/,''); 
					formPost=formPost.replace(/PaymentDueDate=[^&]*&/,''); 
				} else {
					//first time thru
					cb=true;	
					formPost=formPost.replace(/PaymentType=/,'PaymentType=Charge');
					formPost=formPost.replace(/ApplyPaymentLogID=[^&]*&/,'');  //just remove it
					formPost=formPost.replace(/TransactionID=[^&]*&/,'');  //remove check or transaction ID

				}
				
				
			}
		}
	}
	
	//check for complex payment

	
	//update the description with the scout name (format firstname lastname)

	var descript = $('input[name="Description"]',pageID).val();
	var lastpos=payObj.scoutName.split(' ').length -1;
	
	descript += ' for ' +payObj.scoutName.split(' ')[lastpos][0] +', ' + payObj.scoutName.split(' ')[0];
	formPost=tokenVal(formPost,'Description',encodeURIComponent(descript));
	
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,payError,[unitID,true],updateUnitAccountQE,[pageID,unitID,unitPayLogID,pageArray,cb,payid,PaymentTypeIn]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			//if result contains 'Saved!' then it is good
			if (this.response.indexOf('Saved!') == -1 ) {
				alert('Something went wrong.  Aborting. URL='+url+'formPost=' + formPost);
				//scoutUserID.length=0;  // kill the remaining
				
				$('#buttonCancel, #buttonSubmit, #buttonDelete', pageID).button('enable');
				payError(unitID);
				return;
			}
			
			
			//unitScoutId 
			
			if(cb==true) {
				// get the new Apply Payment To id that was just created.  Find it by matching to the new description
				
				setTimeout(function(){ getNewPayIDQE(pageID,unitID,unitPayLogID,pageArray,true,descript,PaymentTypeIn); }, 200);
				return;
			}

			pageArray.shift();


		    setTimeout(function(){ updateUnitAccountQE(pageID,unitID,unitPayLogID,pageArray,cb,payid,PaymentTypeIn); }, 200);
			
		}
	};
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/paymentslogentry.asp?Action=Submit&ScoutUserID=' + unitPayLogID+ '&UnitID=' + unitID + '&PaymentLogID=';
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formPost);
	
	xhttp.onerror =function() {
		errStatusHandle(500,payError,[unitID,true],updateUnitAccountQE,[pageID,unitID,unitPayLogID,pageArray,cb,payid,PaymentTypeIn]);
	};	
}


function getNewPayIDQE (pageID,unitID,unitPayLogID,pageArray,rFlag,newdescript,PaymentTypeIn) {

	
	//var formPost = $('#paymentsLogForm', pageID).serialize();
	//var descript=getToken(formPost,'Description');  //uri encoded
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,payError,[unitID,true],getNewPayIDQE,[pageID,unitID,unitPayLogID,pageArray,rFlag,newdescript,PaymentTypeIn]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			/* Search for the paymentlog data.  
				If the list is empty, add them all
				 PaymentLogIDList
				If the list is not empty, subtract items that are not in this scouts list
			*/
					
			//var idlist =$('#applyPaymentLogIDLI > fieldset > input',this.response);
			var idlist =$('input[name="ApplyPaymentLogID"]',this.response);
			var id;
			var idnum;
			var sel;
		
		
		   //console.log(scoutid,payVal,rFlag,newdescript);
		   //debugger;
		
		    var txtlist=[];
		    for (var i=0;i < idlist.length;i++) {
			   id=idlist[i].id;
			   idnum=idlist[i].value;
			   if(newdescript == encodeURIComponent($('label[for="'+id+'"]',this.response)[0].textContent).replace(/%20/g,'+')) {
					break;
			   }
			   idnum='';
		    }
		
			 setTimeout(function(){ updateUnitAccountQE(pageID,unitID,unitPayLogID,pageArray,rFlag,idnum,PaymentTypeIn); }, 200);
		}
	};

	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/paymentslogentry.asp?ScoutUserID=' + unitPayLogID + '&UnitID=' + unitID;
	xhttp.open("GET", url, true);
	xhttp.responseType="document";
	xhttp.send();

	xhttp.onerror =function() {
		errStatusHandle(500,payError,[unitID,true],getNewPayIDQE,[pageID,unitID,unitPayLogID,pageArray,rFlag,newdescript,PaymentTypeIn]);
	};

}



//-----------
//payqe
function externalSubmit(pageID,unitID) {
			if (scoutUserID.length == 0) {
				alert("No scouts selected");
				$('#buttonCancel, #buttonSubmit, #buttonDelete', pageID).button('enable');
				return;
			}


			// verify all selected scouts have a value for payment
			
			//formpost has extra ScoutUserID data fields in it
			submitQuietPay(pageID,unitID);	
}


//payqe
/*  was a script call
function submitPayForm(id,pageID) {			
			var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/paymentslogentry.asp?Action=Submit&ScoutUserID=' + id + '&UnitID=' + unitID + '&PaymentLogID=';
			$.ajax({
				url: url,
				type: 'POST',
				dataType: 'text',
				data: formPost,
				error: function (xhr, status, error) {
					$.mobile.loading('hide');
					showErrorPopup('We could not save the log.  Please try again.');
				},
				complete: function(xhr) {
					//debugger;
					$('#buttonCancel, #buttonSubmit, #buttonDelete', pageID).button('enable');
				}
			});
}
*/
//payqe
function submitQuietPay(pageID,unitID) {
	var scoutid = scoutUserID.shift();
	var payVal=scoutPayVal.shift();
	var sNote=scoutNote.shift();
	var formPost = $('#paymentsLogForm', pageID).serialize();	
	
	//update the value
	
	formPost=tokenVal(formPost,'Amount',payVal);
	
	//remove any scoutuser
	//The form was built based on one Scout's ID.  Paylog IDs on that form are for that scout.  
	//So we need to do some lookups.  For page scout, payid checked, get payid text,  find matching payid texts for current scout and get the new payid
	//For the scout that this form was checked
	

	formPost=formPost.replace(/ScoutUserID=\d+&/g,'');	
	formPost=formPost.replace(/aID\d+=\d+&/g,'');	
	formPost=formPost.replace(/aID\d+=&/g,'');	
	formPost=formPost.replace(/aIDAll=\d+&/g,'');	
	formPost=formPost.replace(/aIDAll+=&/g,'');
	
		var paytxt='';
		var payid='';	
	var pidscoutid=getToken(formPost,'ApplyPaymentLogID');  //should have an id_scoutid value and format
	
	if(pidscoutid == '' || pidscoutid==null) {
		
	} else {

		var pid=pidscoutid.match(/[^_]+/)[0];
		var itemScout=pidscoutid.match(/_(.+)/)[1];
		
		

		for(var i=0;i<payObj.paymentLogIDList.length;i++) {
			if (payObj.paymentLogIDList[i].slice(17)==pid) {
				if(payObj.paymentLogScoutList[i]==itemScout) {
					paytxt=payObj.paymentLogTxtList[i];
					break;
				}
			}
		}
		

		
		for(var i=0;i<payObj.paymentLogIDList.length;i++) {
			if(paytxt==payObj.paymentLogTxtList[i]) {
				if(payObj.paymentLogScoutList[i]==scoutid) {
					//want just teh value portion
					payid=payObj.paymentLogIDList[i].slice(17);
				}
			}
		}


	}

	formPost=tokenVal(formPost,'ApplyPaymentLogID',payid);

	if (formPost.indexOf('PaymentType=Transfer') != -1) {
			formPost=formPost.replace(/PaymentType=Transfer/,'PaymentType=Payment');
	}	

	if (formPost.indexOf('PaymentType=Withdrawal') != -1) {
			formPost=formPost.replace(/PaymentType=Withdrawal/,'PaymentType=Charge');
	}		
	
	formPost=formPost.replace(/aID\d+=[^&]+&/g,'');
	formPost=tokenVal(formPost,'Notes',sNote);
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,payError,[unitID,true],submitQuietPay,[pageID,unitID]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			//if result contains 'Saved!' then it is good
			if (this.response.indexOf('Saved!') == -1 ) {
				alert('Something went wrong.  Aborting. URL='+url+'formPost=' + formPost);
				scoutUserID.length=0;  // kill the remaining dates
				
				$('#buttonCancel, #buttonSubmit, #buttonDelete', pageID).button('enable');
				payError(unitID);
				return;
			}
			
			if(unitScoutId != '') {
				setTimeout(function(){ updateUnitAccount(pageID,unitID,scoutid,payVal,false,'',sNote); }, 200);
				return;
			} 
			
			if (scoutUserID.length == 0) {
				//done.  Change back to unit page
				changepageurl('/mobile/dashboard/admin/unit.asp?UnitID='+unitID);
				return;
			}
			

		    setTimeout(function(){ submitQuietPay(pageID,unitID); }, 200);
			
		}
	};
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/paymentslogentry.asp?Action=Submit&ScoutUserID=' + scoutid + '&UnitID=' + unitID + '&PaymentLogID=';
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formPost);
	
	xhttp.onerror =function() {
		errStatusHandle(500,payError,[unitID,true],submitQuietPay,[pageID,unitID]);
	};
}


/*
payment to unassigned

PaymentType:Payment
LogDate:11/24/2017
Description:test payment
Amount:1
TransactionID:
Category:Dues
CategoryOther:
ApplyPaymentLogID:
CalendarEventID:
PaymentDueDate:
Notes:

payment to a specific
https://www.scoutbook.com/mobile/dashboard/admin/paymentslogentry.asp?Action=Submit&ScoutUserID=xx&UnitID=xx&PaymentLogID=
PaymentType:Payment
LogDate:11/24/2017
Description:test again
Amount:1
TransactionID:
Category:Dues
CategoryOther:
ApplyPaymentLogID:428470
CalendarEventID:
PaymentDueDate:
Notes:


Charge
https://www.scoutbook.com/mobile/dashboard/admin/paymentslogentry.asp?Action=Submit&ScoutUserID=xx&UnitID=xx&PaymentLogID=
PaymentType:Charge
LogDate:11/24/2017
Description:test again
Amount:1
TransactionID:
Category:Dues
CategoryOther:
CalendarEventID:
PaymentDueDate:
Notes:



//On a payment, record both a payment and a charge

//On a charge, record only a payment

//on a transfer, record only a charge

//on a withdrawal, record a payment and a charge

*/
//updates the Unit Account paylog
function updateUnitAccount(pageID,unitID,scoutid,payVal,cb,payid,sNote) {
	//debugger;
	var scoutname='';
	// modify
	var formPost = $('#paymentsLogForm', pageID).serialize();	
	//remove any scoutuser
	formPost=formPost.replace(/ScoutUserID=\d+&/g,'');	
	formPost=formPost.replace(/aID\d+=\d+&/g,'');	
	formPost=formPost.replace(/aID\d+=&/g,'');	
	formPost=formPost.replace(/aIDAll=\d+&/g,'');	
	formPost=formPost.replace(/aIDAll+=&/g,'');	
	//update the value
	
	formPost=tokenVal(formPost,'Amount',payVal);	
	formPost=tokenVal(formPost,'Notes',sNote);	
	
	if (formPost.indexOf('PaymentType=Transfer') != -1) {
		formPost=formPost.replace(/PaymentType=Transfer/,'PaymentType=Charge');	//simple case
		//formPost=tokenVal(formPost,'ApplyPaymentLogID','');		//replace the payid
		formPost=formPost.replace(/ApplyPaymentLogID=[^&]*&/,'');  //just remove it
		cb=false;
	} else {
		if (formPost.indexOf('PaymentType=Payment') != -1) {
			//this one is complex.
			//The first time thru, want a charge.  And Second Time - use the correct Apply Payment To
			if(cb==true) {
				//2nd time thru
				cb=false;	
				formPost=tokenVal(formPost,'ApplyPaymentLogID',payid);		//replace the payid with the one for the Apply Payment To
				//if none exists, add it
				if(formPost.indexOf('ApplyPaymentLogID') == -1) {
					formPost += '&ApplyPaymentLogID=' + payid;
				}
			} else {
				//first time thru
				cb=true;	
				formPost=formPost.replace(/PaymentType=Payment/,'PaymentType=Charge');
				formPost=tokenVal(formPost,'ApplyPaymentLogID','');		//replace the payid
				formPost=formPost.replace(/ApplyPaymentLogID=[^&]*&/,'');  //just remove it
			}
		} else {
			if (formPost.indexOf('PaymentType=Charge') != -1) {
				// scout had a payment, need to convert to charge
				formPost=formPost.replace(/PaymentType=Charge/,'PaymentType=Payment');
				formPost=formPost.replace(/ApplyPaymentLogID=[^&]*&/,'');
			} else {
				//type is Withdrawal
				//first time thru should be a charge
				//2nd time thru should be a payment
				//this one is complex.
				//The first time thru, want a charge.  And Second Time - use the correct Apply Payment To
				if(cb==true) {
					cb=false;
					formPost=formPost.replace(/PaymentType=Withdrawal/,'PaymentType=Payment');					
					formPost=tokenVal(formPost,'ApplyPaymentLogID',payid);		//replace the payid with the one for the Apply Payment To
					//if none exists, add it
					if(formPost.indexOf('ApplyPaymentLogID') == -1) {
						formPost += '&ApplyPaymentLogID=' + payid;
					}
				} else {
					cb=true;	
					formPost=formPost.replace(/PaymentType=Withdrawal/,'PaymentType=Charge');
					formPost=tokenVal(formPost,'ApplyPaymentLogID','');		//replace the payid
					formPost=formPost.replace(/ApplyPaymentLogID=[^&]*&/,'');  //just remove it
				}
				
				
			}
		}
	}
	
	//check for complex payment

	/*
	if (formPost.indexOf('PaymentType=Payment') != -1) {
		formPost=formPost.replace(/PaymentType=Payment/,'PaymentType=Charge');
		//formPost=formPost.replace(/ApplyPaymentLogID=\d+_\d+&/,'');
		formPost=tokenVal(formPost,'ApplyPaymentLogID','');		//replace the payid
	} else {
		formPost=formPost.replace(/PaymentType=Charge/,'PaymentType=Payment');
		formPost=tokenVal(formPost,'ApplyPaymentLogID','');		//replace the payid
	}
	*/
	
	//update the description with the scout name
	var descript=getToken(formPost,'Description');
	for(var i=0;i<scoutPermPayObjList.length;i++) {
		if (scoutPermPayObjList[i].id == scoutid) {
			descript += encodeURIComponent(' for ' +scoutPermPayObjList[i].name.replace(/[^,]+/,scoutPermPayObjList[i].name[0])).replace(/%20/g,'+');
			formPost=tokenVal(formPost,'Description',descript)
			break;
		}
	}	 

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,payError,[unitID,true],updateUnitAccount,[pageID,unitID,scoutid,payVal,cb,payid,sNote]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			//if result contains 'Saved!' then it is good
			if (this.response.indexOf('Saved!') == -1 ) {
				alert('Something went wrong.  Aborting. URL='+url+'formPost=' + formPost);
				scoutUserID.length=0;  // kill the remaining
				
				$('#buttonCancel, #buttonSubmit, #buttonDelete', pageID).button('enable');
				payError(unitID);
				return;
			}
			
			
			//unitScoutId 
			
			if(cb==true) {
				// get the new Apply Payment To id
				
				setTimeout(function(){ getNewPayID(pageID,unitID,scoutid,payVal,true,descript,sNote); }, 200);
				return;
			}

			
			if (scoutUserID.length == 0) {
				//done.  Change back to unit page
				unitScoutId='';
				changepageurl('/mobile/dashboard/admin/unit.asp?UnitID='+unitID);
				return;
			}
			

		    setTimeout(function(){ submitQuietPay(pageID,unitID); }, 200);
			
		}
	};
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/paymentslogentry.asp?Action=Submit&ScoutUserID=' + unitScoutId + '&UnitID=' + unitID + '&PaymentLogID=';
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formPost);
	
	xhttp.onerror =function() {
		errStatusHandle(500,payError,[unitID,true],updateUnitAccount,[pageID,unitID,scoutid,payVal,cb,payid,sNote]);
	};	
}


function getNewPayID (pageID,unitID,scoutid,payVal,rFlag,newdescript,sNote) {
	//var formPost = $('#paymentsLogForm', pageID).serialize();
	//var descript=getToken(formPost,'Description');  //uri encoded
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,payError,[unitID,true],getNewPayID,[pageID,unitID,scoutid,payVal,rFlag,newdescript,sNote]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			/* Search for the paymentlog data.  
				If the list is empty, add them all
				 PaymentLogIDList
				If the list is not empty, subtract items that are not in this scouts list
			*/
					
			//var idlist =$('#applyPaymentLogIDLI > fieldset > input',this.response);
			var idlist =$('input[name="ApplyPaymentLogID"]',this.response);
			var id;
			var idnum;
			var sel;
		
		
		   //console.log(scoutid,payVal,rFlag,newdescript);
		   //debugger;
		
		    var txtlist=[];
		    for (var i=0;i < idlist.length;i++) {
			   id=idlist[i].id;
			   idnum=idlist[i].value;
			   if(newdescript == encodeURIComponent($('label[for="'+id+'"]',this.response)[0].textContent).replace(/%20/g,'+')) {
					break;
			   }
			   idnum='';
		    }
		
			 setTimeout(function(){ updateUnitAccount(pageID,unitID,scoutid,payVal,rFlag,idnum,sNote); }, 200);
		}
	};

	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/paymentslogentry.asp?ScoutUserID=' + unitScoutId + '&UnitID=' + unitID + '&PaymentLogID=';
	xhttp.open("GET", url, true);
	xhttp.responseType="document";
	xhttp.send();

	xhttp.onerror =function() {
		errStatusHandle(500,payError,[unitID,true],getNewPayID,[pageID,unitID,scoutid,payVal,rFlag,newdescript,sNote]);	
	};

}
//payqe
//return true if position in posLst array is found in myPositions arrya and unitIDs match
function myPositionIs(posLst,unitID) {
	for(var x=0;x<posLst.length;x++) {
		for(var y=0;y<myPositions.length;y++) {
			if (unitID == myPositions[y].unitID) {
				if(posLst[x] == myPositions[y].position ) {
					return true;
				}
			}
		
		}
	}
	return false;
}
//payqe
function fixPayFormPost() {
	// Removes RecurEvent=off&RepeatType=Days&RepeatEveryType=&OccurrencesType
	formPost = formPost.replace(/&ScoutUserID=[^&]*/,'');
	formPost = formPost.replace(/ScoutUserID=[^&]*/,'');

	//if it starts with an & remove it
	if (formPost.slice(0,1) == '&') {
	  formPost = formPost.slice(1);
	}
	
}


//payqe
function payError(unitid,reset) {
	$.mobile.loading('hide');
	alert('Error posting Payment data, discontinuing updates.  Not all Scouts Selected are updated');
	if(reset==true) {
		scoutUserID.length=0;
		//$('#buttonCancel, #buttonSubmit', sPage).button('enable');  //no need to reset, changing page anyway
	}
		//$(':input', sPage +' #swimmingForm').attr('disabled', false);
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



//payqe
//build roster list of scouts
function procPayQuickEntryItemNewRos(pageid,unitID,denID,patrolID) {
	
	var rosterIDs=[];
	

		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status != 200) {
				errStatusHandle(this.status,payError,[unitID,true],procPayQuickEntryItemNewRos,[pageid,unitID,denID,patrolID]);
			}
			if (this.readyState == 4 && this.status == 200) {
				resetLogoutTimer(url);
				servErrCnt=0;
			
			
				$('li[data-scoutuserid]',this.response).each(function () {
					rosterIDs.push($(this).attr('data-scoutuserid'));
				});
				// put all scout ids in rosterIDs
				setTimeout(function(){  procPayQuickEntryItemNew(pageid,unitID,denID,patrolID,rosterIDs);}, 200);
			}
		};

		var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID=' + unitID;

		
		xhttp.open("GET",url , true);
		xhttp.responseType="document";

		xhttp.send();
		xhttp.onerror = function() {
			errStatusHandle(500,payError,[unitID,true],procPayQuickEntryItemNewRos,[pageid,unitID,denID,patrolID]);
		};

}

function inRoster(id,idList) {
	for(var i=0;i<idList.length;i++) {
		if(id==idList[i]) {
			return true;
		}
	}
	return false;
	
}
function procPayQuickEntryItemNew(pageid,unitID,denID,patrolID,rosterIDs) {
	var utype;
	var patrolScouts=[];
	var DenPatrolName='';
	if (patrolID != '' || denID != '') {
	  utype="denpatrol";
		DenPatrolName=$('Title').text();
	  
		$('li[data-scoutuserid]').each(function () {
			patrolScouts.push($(this).attr('data-scoutuserid'));
		});	  
	  
	} else {
		utype="unit";
	}
	QEPatrol=DenPatrolName.replace(' Patrol','').replace(' Den','');
	QEPatrolID=patrolID;
	$.mobile.loading('show', { theme: 'a', text: 'loading...', textonly: false });
	var evObj = { name : '', id : '', img : '',payPage:false,dual:false};

	//
	
	if ($('base')[0].href.match(/admin\/unit\.asp/) != null) {
		var troop =$('title').text();	//unit page
	} else {
		var troop =$('#goToUnit').text();	//denpatrol page
	}
	
	
	//alert(troop);
	// need to get my connections to build scout list of scouts that user has Full Control capability for
//	var unitID = $('base')[0].href.match(/\d+/)[0];
	
	var single_unit_ScoutID='';
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status != 200) {
				errStatusHandle(this.status,payError,[unitID,true],procPayQuickEntryItemNew,[pageid,unitID,denID,patrolID,rosterIDs]);
			}
			if (this.readyState == 4 && this.status == 200) {
				resetLogoutTimer(url);
				servErrCnt=0;
				
				//console.log(this);	
				scoutPermPayObjList.length=0;		
				var payPage=false;
				$('div [data-role="content"] >ul >li > div[style*="margin-left"]',this.response).each( function () {
				
					evObj = { name : '', id : '', img : '',payPage:false,dual:false};
					
				//console.log('x');
					//console.log($('a',this)[0].textContent + ' ' + $('a',this).attr('href') + ' ' + $('.permission',this)[0].textContent + ' ' + $('.orangeSmall',this)[0].textContent);
					var txtUnit=localDataFilter ($('.orangeSmall',this)[0].textContent,'','local');

					if (txtUnit.indexOf(troop) != -1) {
						
						//this scout is in the unit of interest
						
						//now can we determine if scout is in patrol of interest.  Also look to see if it is a UnitPaylog Account Scout
						var okToUse=false;
						if(patrolScouts.length != 0) {
							for(var i=0; i< patrolScouts.length;i++) {
								if(patrolScouts[i]==$('a',this).attr('href').match(/\d+/)[0]) {
									okToUse=true;
									break;
								}
							}
						
						} else {
							okToUse=true;
						}
						
						if(okToUse==true || $('a',this)[0].textContent== 'ACCOUNT, UnitPaylog') {
							var upl=false;
							if($('a',this)[0].textContent== 'ACCOUNT, UnitPaylog') {
								upl=true;
							}
							if( $('.permission',this)[0].textContent.indexOf('Full') != -1 ) {
									// The User has Full Control permission for this Scout
								var p = $(this).parent();
								evObj.img= $('img',p).attr('src');	
								evObj.id =  $('a',this).attr('href').match(/\d+/)[0];
								evObj.name =  localDataFilter ($('a',this)[0].textContent.trim(),'','local');
								
								if(inRoster(evObj.id,rosterIDs) == true  || upl == true) { 
									if(txtUnit.indexOf(',') != -1) {
										evObj.dual=true;
									} else {
										if( single_unit_ScoutID =='') {
											single_unit_ScoutID=evObj.id;
											evObj.payPage=true;
											payPage=true;
										}
									}
									//console.log(evObj.name,evObj.id);
									scoutPermPayObjList.push(JSON.parse(JSON.stringify(evObj)));
								//	console.log(scoutid + ' ' + scoutname);	
									//set flags for change page
								
								}
							}
						}
					}
				});		


				// build scoutlist based on scoutPermPayObjList
				if(scoutPermPayObjList.length==0) {
					alert('You do not have Full Control permissions for any Scouts');
					genError(pageid,unitID,'');
				} else if(payPage==false) {
					alert('All connected Scouts are in multiple units. Unable to access Scout Add Payment Pages');
					genError(pageid,unitID,'');					
				} else {
					
					checkForUnapprovedScouts(pageid,single_unit_ScoutID,unitID);
					/* removed 11/7/2019
					buildHtmlScoutlist();

				   payObj={paymentLogIDList: [],paymentLogTxtList:[],paymentLogScoutList:[]};
				   
				   
					changepageurl('/mobile/dashboard/admin/paymentslogentry.asp?ScoutUserID=' + single_unit_ScoutID + '&UnitID=' + unitID );
					$(document).one('pagebeforeshow',function() {
						modifyPayLogPage('');
					});	
					*/					
				}
			}
		};

		var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/adultconnections.asp';

		
		xhttp.open("GET",url , true);
		xhttp.responseType="document";

		xhttp.send();
		xhttp.onerror = function() {
			errStatusHandle(500,payError,[unitID,true],procPayQuickEntryItemNew,[pageid,unitID,denID,patrolID,rosterIDs]);
		};
}

function isUnitPaylog(pageid) {
		var troop =$('#goToUnit',pageid).text();
		var thisScout=$('a#account').attr('href').match(/ScoutUserID=(\d+)/)[1];

		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status != 200) {
				errStatusHandle(this.status,payError,[unitID,true],isUnitPaylog,[pageid]);
			}
			if (this.readyState == 4 && this.status == 200) {
				resetLogoutTimer(url);
				servErrCnt=0;
				//look through users for UnitPaylog Account in current unit			
				var isUnit=false;
				var unitPaylogScoutID='';
				$('div [data-role="content"] >ul >li > div[style*="margin-left"]',this.response).each( function () {
					var txtUnit=localDataFilter ($('.orangeSmall',this)[0].textContent,'','local');
					if (txtUnit.indexOf(troop) != -1) {		
						if($('a',this)[0].textContent== 'ACCOUNT, UnitPaylog') {	
							if( $('.permission',this)[0].textContent.indexOf('Full') != -1 ) {
									// The User has Full Control permission for this Scout
								var p = $(this).parent();
								var id =  $('a',this).attr('href').match(/\d+/)[0];
								//Flag only if the current user is NOT unitPaylog Account
								if(id != thisScout) {		
									isUnit=true;
									unitPaylogScoutID=id;
								}
							}
						}
					}					
				});
				
				if(isUnit==true) {
					//alert('This scout is in a unitPaylog unit');
					//$('#paymentsLogForm',pageid).submit();
					$('#faOverlay',pageid).hide();
					$('#popupUnitTrans', pageid).popup('open');
					$('#UnitPaylogScoutID',pageid).val(unitPaylogScoutID);
				} else {
					$('#paymentsLogForm',pageid).submit();
				}
			}

		};

		var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/adultconnections.asp';

		
		xhttp.open("GET",url , true);
		xhttp.responseType="document";

		xhttp.send();
		xhttp.onerror = function() {
			errStatusHandle(500,payError,[unitID,true],isUnitPaylog,[pageid]);
		};
}
function checkForUnapprovedScouts(pageid,single_unit_ScoutID,unitID) {

		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function() {
			if (this.readyState == 4 && this.status != 200) {
				errStatusHandle(this.status,payError,[unitID,true],checkForUnapprovedScouts,[pageid,single_unit_ScoutID,unitID]);
			}
			if (this.readyState == 4 && this.status == 200) {
				resetLogoutTimer(url);
				servErrCnt=0;	
				
				//make sure each scout is approved
				
				$('li[data-scoutuserid]',this.response).each( function () {
					if ($('img[src*="securityapproved"]',this).length == 0) {
						// these scouts not approved. Remove from scoutPermPayObjList
						unapprovedID=$(this).attr('data-scoutuserid');
						
						for (var i=0;i<scoutPermPayObjList.length;i++) {
							if(scoutPermPayObjList[i].id==unapprovedID) {
								scoutPermPayObjList.splice(i,1);
								break;
							}
						}
					}						
					
				});
				var single_ok=false;
				//find a new single unit scout
				for (var i=0;i<scoutPermPayObjList.length;i++) {
					if(scoutPermPayObjList[i].payPage==true) {
						single_ok=true;
						break;
					}
				}
					
				if(single_ok==false) {
					for (var i=0;i<scoutPermPayObjList.length;i++) {
						if(scoutPermPayObjList[i].dual==false) {
							single_unit_ScoutID =scoutPermPayObjList[i].id;
							scoutPermPayObjList[i].payPage=true;
							break;
						}
					}
				}
				
				
				
				
				
					buildHtmlScoutlist();

				   payObj={paymentLogIDList: [],paymentLogTxtList:[],paymentLogScoutList:[]};

				   
				   
					changepageurl('/mobile/dashboard/admin/paymentslogentry.asp?ScoutUserID=' + single_unit_ScoutID + '&UnitID=' + unitID );
					$(document).one('pagebeforeshow',function() {
						modifyPayLogPage(pageid,unitID);
					});	

			}
		};

		var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID=' +unitID;

		
		xhttp.open("GET",url , true);
		xhttp.responseType="document";

		xhttp.send();
		xhttp.onerror = function() {
			errStatusHandle(500,payError,[unitID,true],checkForUnapprovedScouts,[pageid,single_unit_ScoutID,unitID]);
		};
					
}

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

//payqe
function buildHtmlScoutlist() {
 scoutlist =  '<li id="scoutsLI" data-theme="d">\n';
 scoutlist+=  '						<p class="normalText">Now you can quickly and easily enter payment logs for the entire troop or pack!.</p>\n';

// scoutlist+=  '							<fieldset data-role="controlgroup">\n';
 scoutlist+=  '								<legend class="text-orange">\n';
 scoutlist+=  '									<strong>Choose Scout(s):</strong>\n';
 scoutlist+=  '								</legend>\n';
 
											//<div class="ui-grid-b ui-responsive">';	
 scoutlist += '								<div class="ui-grid-b ui-responsive">';
 scoutlist += '									<div class="ui-block-a" >Scout</div>';  
 scoutlist += '									<div class="ui-block-b">Amount</div>';	   
 scoutlist += '									<div class="ui-block-c">Notes</div>';	

 scoutlist += '									<div class="ui-block-a" style="height:46px;">';	//line-height:45px;font-size: 16px;
 scoutlist+=  '														<input type="checkbox" data-theme="d" name="allUserID" id="AllUserID" value="All">\n';
 scoutlist+=  '														<label for="AllUserID" >\n';
 scoutlist+=  '															<div style="margin-left: 40px; ">\n';
 scoutlist+=  '																Select All\n';
 scoutlist+=  '															</div>\n';
 scoutlist+=  '														</label>\n';
 scoutlist +='            						 	</div>';
 
 scoutlist += '										<div class="ui-block-b" style="height:46px;">';
 		//scoutlist += '				<div style="float: left;  "  >\n';	
 scoutlist += '										   <input type="number"  name="aIDAll" id="AllaID" value=""  class="ui-input-text" step="0.01" min="0" placeholder="Value to apply to all..">'; //style="font-size: 12px; width: 70%;    ui-body-a ui-corner-all ui-shadow-inset"		
  //scoutlist +='            				</div>'; 
  //		scoutlist += '				<div style="float: left;  "  >\n';	 
 //scoutlist += '										   <input type="text"  name="nIDAll" id="NllaID" value=""  class="ui-input-text"  placeholder="Note to apply to all..">'; //style="font-size: 12px; width: 70%;    ui-body-a ui-corner-all ui-shadow-inset"		
 //scoutlist +='            				</div>';  
 scoutlist +='            						 	</div>'; 
 
 scoutlist += '										<div class="ui-block-c" style="height:46px;">';
 scoutlist += '										   <input type="text"  name="nIDAll" id="NllaID" value=""  class="ui-input-text"  placeholder="Note to apply to all..">'; //style="font-size: 12px; width: 70%;    ui-body-a ui-corner-all ui-shadow-inset"		
 
 scoutlist +='            						 	</div>'; 
 
 unitScoutId='';
 for(var i=0;i<scoutPermPayObjList.length;i++) {
   if(scoutPermPayObjList[i].name == 'ACCOUNT, UnitPaylog') {
	   // do not add to list to select
	   unitScoutId=scoutPermPayObjList[i].id;
   } else {
	   	   
	   
	   

 scoutlist += '									<div class="ui-block-a" style="height:46px;">';	//line-height:45px;font-size: 16px;
 scoutlist+=  '														<input type="checkbox" data-theme="d" name="ScoutUserID" id="scoutUserID'+escapeHTML(scoutPermPayObjList[i].id)+'" value="'+escapeHTML(scoutPermPayObjList[i].id)+'">\n';
 scoutlist+=  '														<label for="scoutUserID'+escapeHTML(scoutPermPayObjList[i].id)+'" >\n';
 scoutlist+=  '															<div style="float: left; width: 30px; ">\n';
 scoutlist+=  '																<img src="'+escapeHTML(scoutPermPayObjList[i].img)+'" class="imageSmall" />\n';
 scoutlist+=  '															</div>\n';
 scoutlist+=  '															<div style="margin-left: 40px; ">\n';
 scoutlist+=  '																'+escapeHTML(scoutPermPayObjList[i].name)+'\n';
 scoutlist+=  '															</div>\n';
 scoutlist+=  '														</label>\n';
		scoutlist +='            						 	</div>';
		
		scoutlist += '										<div class="ui-block-b" style="height:46px;">';
		//scoutlist += '				<div style="float: left;  "  >\n';	
		scoutlist += '										   <input type="number" style="height:43px;" name="aID'+escapeHTML(scoutPermPayObjList[i].id)+'" id="aID'+escapeHTML(scoutPermPayObjList[i].id)  + '" value=""  step="0.01" min="0" class="ui-input-text ">'; //style="font-size: 12px; width: 70%;    ui-body-a ui-corner-all ui-shadow-inset"		
		//scoutlist += '				</div>\n'; 	
		//scoutlist += '				<div style="float: left; "  >\n';	
		//scoutlist += '										   <input type="text" style="height:43px;" name="nID'+escapeHTML(scoutPermPayObjList[i].id)+'" id="nID'+escapeHTML(scoutPermPayObjList[i].id)  + '" value="" class="ui-input-text ">'
		//scoutlist += '				</div>\n'; 	
		scoutlist +='            						 	</div>';
		
 		scoutlist += '										<div class="ui-block-c" style="height:46px;">';
		scoutlist += '										   <input type="text" style="height:43px;" name="nID'+escapeHTML(scoutPermPayObjList[i].id)+'" id="nID'+escapeHTML(scoutPermPayObjList[i].id)  + '" value="" class="ui-input-text ">'
		
		scoutlist +='            						 	</div>';
  }
 }

		scoutlist +='            			</div>'; 
 //scoutlist+=  '							</fieldset>\n';
 scoutlist+=  '				</li>\n';
 
 
 
}
//payqe
/*
function getPayLogPage(scoutID,unitID,scoutlist,utype) {
	//$('#footer').append('<a href="/mobile/dashboard/admin/paymentslogentry.asp?ScoutUserID=' + scoutID + '&amp;' + unitID +'" data-role="button" data-icon="add" data-theme="g" data-inline="true" data-mini="true" id="addButton" data-corners="true" data-shadow="true" data-iconshadow="true" data-wrapperels="span" class="ui-btn ui-shadow ui-btn-corner-all ui-mini ui-btn-inline ui-btn-icon-left ui-btn-up-g" style="hidden"></a>');
    //var bname = 'addMyButton' + utype;
	//$('#footer').append('<a href="/mobile/dashboard/admin/paymentslogentry.asp?ScoutUserID=' + scoutID + '&amp;UnitID=' + unitID +'"   id="' + bname + '"    style="hidden"></a>');
	//$('#' + bname).trigger('click');
	
	changepageurl('/mobile/dashboard/admin/paymentslogentry.asp?ScoutUserID=' + scoutID + '&UnitID=' + unitID );
	$(document).one('pagebeforeshow',function() {
		modifyPayLogPage(scoutlist);
	});
}
*/
//payqe
function modifyPayLogPage(ipageid,unitID) {
	//Change the title of the page
	var scoutid='';
	var scoutname='';
	
	//Get the PageID of this page  ( This is the unit page which is fully loaded)
	//The payment page is not loaded
	var pageid='#'+ $('div[id^="Page"]').attr('id');
	
	if(document.getElementById("goToUnit") == null) {
		
		for (var i=0;i<scoutPermPayObjList.length;i++) {
			if(scoutPermPayObjList[i].payPage == true) {
				scoutid=scoutPermPayObjList[i].id;
				scoutname=scoutPermPayObjList[i].name;
				break;
			}
		}
		
		
		alert('There was a problem building the QE page for ' +scoutname);
		genError(pageid,unitID,'PayQE ');
		return;
	}
	
	$('#goToDenPatrol').remove();
	$('#account').remove();
	$('#notesLI').hide();

	//Change title to say Multiple Payments Log
	
	$('title').text('Multiple Payments Log');
	//$('h1.ui-title span:last')[0].textContent = $('h1.ui-title span:last')[0].textContent.replace('Payments','Multiple Payments');
	document.getElementById("goToUnit").nextSibling.nodeValue='Multiple';

	
	//Change the page description
	$('#scoutsLI > div > p.normalText.ui-li-desc').text('Now you can quickly and easily enter payment logs for the entire troop or pack!');
	
	//$('input[name="PaymentType"][value="Charge"]').trigger('click').trigger('click');
	$('#paymentTypeCharge').trigger('click').trigger('click');
	
	$('#calendarEventIDLI, #paymentDueDateLI').slideDown();

	// close
	$('#applyPaymentLogIDLI, #transactionIDLI').slideUp();
	
}


//payqe
/* Changed page event. this function is never called directly
   rather it is used as sort of a protoype to insert the embedded event handler into the page
*/
function xwrapper() {$('[name=PaymentType]', '#PageX').change(function() {
				
				if( $(this).val() == 'Payment') {
					pregetPaymentLogIDLI('#PageX');
				} else {
					// open
					$('#calendarEventIDLI, #paymentDueDateLI', '#PageX').slideDown();

					// close
					$('#applyPaymentLogIDLI, #transactionIDLI', '#PageX').slideUp();
				}
});}

//payqe		 
function wrapper() {
	
					$('#paymentTypePayment', '#PageX').change(function(handle) {
					    var UnitID=X;
						pregetPaymentLogIDLI('#PageX',handle,UnitID);
	
					});

					$('#paymentTypeTransfer', '#PageX').change(function(handle) {
					    var UnitID=X;
						pregetPaymentLogIDLI('#PageX',handle,UnitID);
	
					});					
					
					$('[name=ScoutUserID]', '#PageX').change(function(handle) {
						var UnitID=X;
						testScoutUncheck('#PageX',handle,UnitID);
	
					});
				    $('#paymentTypeCharge', '#PageX').change(function() {
						// open
						$('#calendarEventIDLI, #paymentDueDateLI', '#PageX').slideDown();

						// close
						$('#applyPaymentLogIDLI, #transactionIDLI', '#PageX').slideUp();
				
					});

					$('#AllUserID', '#PageX').click(function () {
						
						if ($(this).is(':checked')) {
							
							$('input[id*=scoutUserID]', '#PageX').prop('checked',true).checkboxradio("refresh");
						} else {
							
							$('input[id*="scoutUserID"]', '#PageX').prop('checked',false).checkboxradio("refresh");
						}
					});	


					$('input[id=AllaID]', '#PageX' ).bind( "change", function(event, ui) {						
						if($('input[id=AllaID]', '#PageX' ).val()=='') {
							 $('input[id^=aID]', '#PageX' ).val($(this).val());
						} else {

							if($('input[id=AllaID]', '#PageX' ).val().match(/\-/) == null && Number($('input[id=AllaID]', '#PageX' ).val()).toFixed(2) == Number($('input[id=AllaID]', '#PageX' ).val())) {
								$('input[id^=aID]', '#PageX' ).val($(this).val());
							} else {
								//one or two things wrong
								var errMsg='';
								if($('input[id=AllaID]', '#PageX' ).val().match(/\-/) != null ) {
									errMsg ='Amount must be a positive number'
								}
								if (Number($('input[id=AllaID]', '#PageX' ).val()).toFixed(2) != Number($('input[id=AllaID]', '#PageX' ).val())) {
									if (errMsg != '') { 
										errMsg+= ' and ';
									}
									errMsg += 'Amount must be rounded to the cent'
								}
								alert(errMsg);
								var v = $(this).val().replace(/\-/g,'');
								$('input[id*=aID]', '#PageX' ).val(Number(v).toFixed(2));
							}
						}
					});

					$('input[id=NllaID]', '#PageX' ).bind( "change", function(event, ui) {						
							 $('input[id^=nID]', '#PageX' ).val($(this).val());
					});


					
					$('input[id^=aID]', '#PageX' ).bind( "change", function(event, ui) {
						//this id??
						if ($(this ).val()!='') {		
							if($(this).val().match(/\-/) == null && Number($(this ).val()).toFixed(2) == Number($(this ).val())) {
								// ok
							} else {
								//one or two things wrong
								var errMsg='';
								if( $(this).val().match(/\-/) != null) {
									errMsg ='Amount must be a positive number'
								}
								
								if (Number($(this ).val()).toFixed(2) != Number($(this ).val())   ) {
									if (errMsg != '') { 
										errMsg+= ' and ';
									}
									errMsg += 'Amount must be rounded to the cent'
								}
								alert(errMsg);
								var v = $(this).val().replace(/\-/g,'');
								$(this).val(Number(v).toFixed(2));
							}
						}
					});						
						
}

//payqe
function testScoutUncheck(pageId,handle,unitID) {

if ($('input[name="ScoutUserID"]:checked',pageId)[0] == null && $('[name="PaymentType"]:checked').val() == "Payment") {
	alert('You unselected a scout.  A scout must be selected for the Payment option.  Changing transaction type to Charge');
	$('#paymentTypeCharge').trigger('click');
} else {
	// if a scout has been added or removed with the payment option selected, need to readjust the list
	if ($('[name="PaymentType"]:checked').val() == "Payment") {
		pregetPaymentLogIDLI(pageId,handle,unitID);
	}
}

}
/*
	Begins the process of rebuilding the PaymentLogIDLI element
	which began as elements for an individual scout but needs to
	be modified to have only common elements betwee multiple scouts

*/	

//payqe
function pregetPaymentLogIDLI(pageId,handle,unitID) {
					//allow only if scouts are selected.  
					
					if ($('input[name="ScoutUserID"]:checked',pageId)[0] == null) {
						
							handle.preventDefault();
							handle.stopImmediatePropagation();
							handle.stopPropagation();
							if (warned == false) {
								warned=true;
								alert('You must select scouts prior to choosing Payment');
							} else {
								warned = false;
							}
							$('#paymentTypeCharge', pageId).checked=false;
							$('#paymentTypePayment', pageId).checked=true;
							 setTimeout(function(){ resetPayType(); }, 200);
						return false;
						
					}
					
					// Now need to loop through each selected scout to find common payment choices
					// to build the list in #applyPaymentLogIDLI
					
					// Temp disable submit button
					// show spinner

					$('#buttonSubmit', pageId).button('disable');
					
					$.mobile.loading('show', { theme: 'a', text: 'loading Apply Payment To choices...', textonly: false });
					
					scoutUserID.length=0;
					$('input[name="ScoutUserID"]:checked',pageId).each(function () {
						scoutUserID.push(this.value);					
					});					

					payObj.paymentLogIDList.length=0;
					payObj.paymentLogTxtList.length=0;
					payObj.paymentLogScoutList.length=0;
					// and clear the existing selection choices
					$('#applyPaymentLogIDLI > fieldset > .ui-controlgroup-controls > .ui-radio').remove();	
					getPaymentLogIDLI(pageId,unitID);

}

//payqe
function resetPayType() {
	// clickback trigger
	$('#paymentTypeCharge').trigger('click');
	
	$('#calendarEventIDLI, #paymentDueDateLI').slideDown();

	// close
	$('#applyPaymentLogIDLI, #transactionIDLI').slideUp();		
}

/*
	Iterates through the global scoutUserID array to gather payment IDs

*/
		//new func to be added
//payqe
function getPaymentLogIDLI(pageId,unitID) {
			
	var goodlogid = [];
	var goodlogtxt =[];
	var goodlogscout =[];		
	if (scoutUserID.length == 0) {
		// Got them all, build the list and show it
		addPayDiv();
		
		// open
		$('#applyPaymentLogIDLI, #transactionIDLI', pageId).slideDown();

		// close
		$('#calendarEventIDLI, #paymentDueDateLI', pageId).slideUp();

		$('#buttonSubmit', pageId).button('enable');	
		$.mobile.loading('hide');
		return;
	}
	var scoutid = scoutUserID.shift();

		
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,payError,[unitID,true],getPaymentLogIDLI,[pageId,unitID]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			/* Search for the paymentlog data.  
				If the list is empty, add them all
				 PaymentLogIDList
				If the list is not empty, subtract items that are not in this scouts list
			*/
					
			//var idlist =$('#applyPaymentLogIDLI > fieldset > input',this.response);
			var idlist =$('input[name="ApplyPaymentLogID"]',this.response);
			var id;
			var idtxt;
			var sel;
		
		    var txtlist=[];
		    for (var i=0;i < idlist.length;i++) {
			   id=idlist[i].id;
			   //if(id=='unassigned') {
				//	txtlist.push('unassigned');
				//} else {
				   txtlist.push($('label[for="'+id+'"]',this.response)[0].textContent);
				//}
		    }
		   
		   //try changing from == 0 to >= 0 so it runs all the time
			if (payObj.paymentLogIDList.length >= 0) {
//debugger;
				//get the list for just this scout
				for (var i=0;i < idlist.length;i++) {
					id=idlist[i].id;
					//idtxt=$('#applyPaymentLogIDLI > fieldset > label[for="'+ id + '"]',this.response).text();
					//if(id=='unassigned') {
					//	idtxt='unassigned';
					//} else {
						idtxt=$('label[for="'+id+'"]',this.response)[0].textContent;
					//}
					//debugger;
					payObj.paymentLogIDList.push(id);
					payObj.paymentLogTxtList.push(idtxt);
					payObj.paymentLogScoutList.push(scoutid);
		
				}	
				
			} else {
				//add for next scout, when common texts found
				for (var j = 0;j < payObj.paymentLogIDList.length; j++) {
					keepid=false;
					for (var i = 0; i < idlist.length; i++) {
						//if( payObj.paymentLogIDList[j]  == idlist[i].id) {
						if( payObj.paymentLogTxtList[j]  == txtlist[i]) {
							//this ID can stay
							goodlogid.push(payObj.paymentLogIDList[j]);
							goodlogtxt.push(payObj.paymentLogTxtList[j]);
							goodlogscout.push(payObj.paymentLogScoutList[j]);
							
						}
					}	
				}
				payObj.paymentLogIDList = goodlogid.slice(0);
				payObj.paymentLogTxtList = goodlogtxt.slice(0);
				payObj.paymentLogScoutList = goodlogscout.slice(0);
			}
			
			 setTimeout(function(){ getPaymentLogIDLI(pageId,unitID); }, 200);
		}
	};

	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/paymentslogentry.asp?ScoutUserID=' + scoutid + '&UnitID=' + unitID + '&PaymentLogID=';
	xhttp.open("GET", url, true);
	xhttp.responseType="document";
	xhttp.send();

	xhttp.onerror =function() {
		errStatusHandle(500,payError,[unitID,true],getPaymentLogIDLI,[pageId,unitID]);
	};
}


/*
	Appends the ApplyPaymentLog IDs to the list
*/
//payqe	
function addPayDiv() {


	// there is no way to avoid dynamically setting these values.

		var found;
		var idplus='';
		var val='';
		var txtlistused=[];
		for	(var i=0;i<payObj.paymentLogIDList.length;i++) {
			found=false;
			for( var j=0;j<txtlistused.length;j++) {
				if(payObj.paymentLogTxtList[i] == txtlistused[j]) {
					found=true;
					break;
				}
			}
			if (found==false) {
					txtlistused.push(payObj.paymentLogTxtList[i]);

					idplus=payObj.paymentLogIDList[i]+'_'+payObj.paymentLogScoutList[i];
					if(idplus.indexOf('applyPaymentLogID') ==-1) {
						idplus='applyPaymentLogID'+idplus;
					}
					val=idplus.slice(17);
			//alert(' modify submitform()  Find the id in formPost, then replace it with the proper one. add only for unique texts.  Later, when user selects, we need to identify the proper scoutid payment idfor this');
			
			
					$('#applyPaymentLogIDLI > fieldset > .ui-controlgroup-controls').append(
						'<div class="ui-radio"><input type="radio" name="ApplyPaymentLogID" id="' + escapeHTML(idplus) + '" value="' + escapeHTML(val) + '" data-theme="d"><label for="' +escapeHTML(idplus) + '" data-corners="true" data-shadow="false" data-iconshadow="true" data-wrapperels="span" data-icon="radio-off" data-theme="d" data-mini="false" class="ui-radio-off ui-btn ui-btn-corner-all ui-fullsize ui-btn-icon-left ui-first-child ui-btn-up-d">' +escapeHTML(payObj.paymentLogTxtList[i]) +'</label></div>'
					).trigger('create');
				
			}			
		}					
}	
	
function procCloseAccount(unitID,pageid,scoutid) {
	//need to find RemovedScout ID
	// get the balance from this page
	/*
	var amt=$('.total').text().replace('$','');
	var due=false;
	if(amt.match(/-/) != null) {
		amt.replace('-','');
		due=true;
	}
	*/

	var name= $('a[href*="account.asp?ScoutUserID="]').text();
	var firstname=name.slice(0,name.length-3);
	var lastname=name.slice(name.length-2);
	
	//fill up an array with transactions
	var payArray=[];
	var dt='';
	var descript='';
	var notes='';
	var tamt='';
	var type='';
	$('a[href*="PaymentLogID="]').each( function () {
		dt=$('div[style*="font-size: 11"]',this).text();
		descript=$('.noellipsis',this).text();
		notes=$('div[style*="margin"]',this).text();
		tamt=$('span',this).text();
		type='Charge';
		if(tamt.match(/-/) == null) {
			type='Payment';
		}
		tamt=tamt.slice(2);
		payArray.push(['',firstname,lastname,type,dt,descript,tamt,'','',notes,scoutid]);
	});
	



	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[pageid,unitID,'PB'], procCloseAccount,[unitID,pageid,scoutid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			var name;
			var id='';

			$('li[data-scoutuserid]',this.response).each( function () {

				if($('img[src*="securityapproved32.png"]',this).length > 0) {
					name=$('a[href*="ScoutUserID"]',this).text().trim().split('\n')[0].trim();	

					if(name=="Account, RemovedScout" || name=="RemovedScout Account") {
						id=$(this).attr('data-scoutuserid');
					}
					//If the name has a , in it assume last name first
				}
			});
			zeroScoutAccount(pageid,unitID,scoutid,id,0,payArray);
		}
	}		
	

	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID=' + escapeHTML(unitID);

	xhttp.open("GET",url , true);
	xhttp.responseType="document";
	xhttp.send();
	xhttp.onerror = function() {
		errStatusHandle(500,genError,[pageid,unitID,'PB'], procCloseAccount,[unitID,pageid,scoutid]);
	}	
	//find the removed scout id, if any
	//zeroScoutAccount(unitID,scoutid,removedscoutid,0,payArray);
}

function zeroScoutAccount(pageid,unitID,scoutid,removedscoutid,transCnt,payArray) {

if(removedscoutid=='') {
	zeroScoutBal(pageid,unitID,scoutid);
	return;	
}

var cnt=0;
var thisTransCnt=0;
for(var i=0;i< payArray.length;i++) {
	if(payArray[i][10] == scoutid) {
		if(cnt == transCnt) {
		   thisTransCnt=i;
		}
		cnt +=1;
	}
}
if (cnt == transCnt) {
	//alert('done, now zero out scoutid account');
	zeroScoutBal(pageid,unitID,scoutid);
	return;
}


//0: (10) ["BSA Member ID", "First Name", "Last Name", "Payment Type", "Date", "Description", "Amount", "Transaction ID", "Category", "Notes"]

	var formPost = 'PaymentType='+payArray[thisTransCnt][3]+'&LogDate='+encodeURIComponent(payArray[thisTransCnt][4])+'&Description='+encodeURIComponent(payArray[thisTransCnt][1] + ' ' + payArray[thisTransCnt][2][0] + ' ' + payArray[thisTransCnt][5])+'&Amount='+encodeURIComponent(payArray[thisTransCnt][6].replace('-',''))+'&TransactionID='+encodeURIComponent(payArray[thisTransCnt][7])+'&Category='+encodeURIComponent(payArray[thisTransCnt][8])+'&CategoryOther=&CalendarEventID=&PaymentDueDate=&Notes='+encodeURIComponent(payArray[thisTransCnt][9]);

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[pageid,unitID,'PB'], zeroScoutAccount,[pageid,unitID,scoutid,removedscoutid,transCnt,payArray]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;	

			transCnt += 1;
			setTimeout(function(){ zeroScoutAccount(pageid,unitID,scoutid,removedscoutid,transCnt,payArray);}, 200);	
			

		}
	};
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/paymentslogentry.asp?Action=Submit&ScoutUserID=' + removedscoutid + '&UnitID=' + unitID + '&PaymentLogID=';
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formPost);
	
	xhttp.onerror =function() {
		errStatusHandle(500,genError,[pageid,unitID,'PB'],zeroScoutAccount,[pageid,unitID,scoutid,removedscoutid,transCnt,payArray]);
	};
			
}

function zeroScoutBal(pageid,unitID,scoutid) {


	/*
	var amt='';
	for(var i =0;i<payTotals.length;i++) {
		if(payTotals[i].scoutid==scoutid) {
			amt=round(payTotals[i].amt,2);
			break;
		}
	}
	*/

	// get the balance from this page
	var amt=$('.total').text().replace('$','');
	var due=false;
	if(amt.match(/-/) != null) {
		amt.replace('-','');
		due=true;
	}


if(parseInt(amt)==0) {
		showLog(unitID,scoutid);
		return;
}

var payType='Payment';
if(parseInt(amt) > 0) {
	payType='Charge';
} else {
	amt= amt*(-1);
}
	// find the balance of the scout
	var formPost = 'PaymentType='+payType+'&LogDate='+encodeURIComponent(nowDate())+'&Description='+encodeURIComponent('Closing this Scout Account, Transactions and outstanding balance copied to RemovedScout')+'&Amount='+encodeURIComponent(amt)+'&TransactionID=&Category=&CategoryOther=&CalendarEventID=&PaymentDueDate=&Notes=';

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status,genError,[pageid,unitID,'PB'], zeroScoutBal,[pageid,unitID,scoutid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;	
			showLog(unitID,scoutid);
		}
	};
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/paymentslogentry.asp?Action=Submit&ScoutUserID=' + scoutid + '&UnitID=' + unitID + '&PaymentLogID=';
	xhttp.open("POST", url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(formPost);
	
	xhttp.onerror =function() {
		errStatusHandle(500,genError,[pageid,unitID,'PB'],zeroScoutBal,[pageid,unitID,scoutid]);
	};	
	
	
}

function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}

function showLog(unitID,scoutid) {
			$.mobile.changePage(
				'/mobile/dashboard/admin/paymentslog.asp?ScoutUserID='+scoutid+'&UnitID='+unitID,
			{
				allowSamePageTransition: true,
				transition: 'none',
				showLoadMsg: true,
				reloadPage: true
			});	
}