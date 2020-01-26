// Copyright © 9/26/2019 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.

/*
Custom EmailGroups [droplist]   [_________]   [save] [delete] [show]

Droplist defaults blank
Select from droplist populates blank field.
Fields is editable
Save remembers recipents in field name
Delete deletes recipients from field name
Show preselects users from fieldname

*/
var mailGroups = [];

function addRawCustomMailGroup(data, thisurl, pageid) {

	// add retain div
	// after $('#bccDIV')	
	var idx = data.indexOf('<div id="bccDIV">');
	var startfunc = data.indexOf('<div', idx + 1);

	var ipt = '<div id="keepMediv"><label for="keepContentID" >Keep Message Content to Send to Another Unit</label><input type="checkbox" name="keepContent" id="keepContentID" value="1" data-theme="d" checked="checked"></div>';
	data = data.slice(0, startfunc) + ipt + data.slice(startfunc);
	//$('[type="checkbox"]').checkboxradio();


	var insertpt = data.indexOf('<div id="footer"');
	data = data.slice(0, insertpt) + buttonPreview() + data.slice(insertpt);

	var startfunc = data.indexOf("$('#buttonInsertEvents',");
	var myfunc = '' + chscript;
	myfunc = myfunc.slice(22).slice(0, -1).replace(/\#PageX/g, '#Page' + escapeHTML(pageid)).replace(/UnitID=X/g, 'UnitID=' + escapeHTML(unitID));
	var data = data.slice(0, startfunc) + myfunc + '\n' + data.slice(startfunc);



	if (ismobile != null) {
		//won't work with firefox mobile yet, no messaging to get to storage available
		return data;
	}
	var unitID = '';
	if (data.match(/default\.asp\?UnitID=(\d+)/) == null) {
		return data;
	}
	unitID = data.match(/default\.asp\?UnitID=(\d+)/)[1];

	var insertpt = data.indexOf('<div class="ui-grid-b ui-responsive"');
	data = data.slice(0, insertpt) + buttonCustGrp() + data.slice(insertpt);








	//add button code

	var startfunc = data.indexOf("$('#buttonInsertEvents',");
	var myfunc = '' + cgscript;
	myfunc = myfunc.slice(22).slice(0, -1).replace(/\#PageX/g, '#Page' + escapeHTML(pageid)).replace(/UnitID=X/g, 'UnitID=' + escapeHTML(unitID));
	var data = data.slice(0, startfunc) + myfunc + '\n' + data.slice(startfunc);


	var startfunc = data.indexOf("formPost = $('#messageForm'");
	var myfunc = '' + biscript;
	myfunc = myfunc.slice(22).slice(0, -1).replace(/\#PageX/g, '#Page' + escapeHTML(pageid)).replace(/UnitID=X/g, 'UnitID=' + escapeHTML(unitID));
	var data = data.slice(0, startfunc) + myfunc + '\n' + data.slice(startfunc);


	return data;
}


function biscript() {

	if ($('#keepContentID:checked').length == 1) {
		// keep the content
		evMsgObj.mevent = 'manual';
		evMsgObj.body = $('#body').val();
		evMsgObj.subject = $('#subject').val();
		evMsgObj.shown = true;
		//remove the div for the form
		$('#keepMediv').remove();
	} else {
		clrEvMsgOb();
	}
}

function buttonPreview() {
	var newdata = `	
		<div style="margin-top: 1.5em; margin-bottom: 2em; ">
			<input type="button" value="Preview Message" data-theme="c" id="buttonPreviewEmail" />
		</div>
					<div id="PreviewMessageDiv" class="noprint" style="display:none;">
						<ul data-role="listview" data-theme="d" data-inset="true" style="font-weight: normal; "><li id="PreviewMessage" data-theme="d" style="font-weight: normal; white-space:pre-wrap;">
					</li></ul>
					</div>
			<div data-role="popup" id="impexpPopup" data-overlay-theme="a" class="ui-content" data-theme="e" data-transition="fade">
				<a href="#" id="closeImportPopupButton" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>
				<div id="impexpPopupContent">
		<ul data-role="listview" data-inset="true" style="min-width: 300px;" data-theme="d" >
		<li data-role="divider" data-theme="a">Import or Export Mail Groups File</li>
		<li data-role="divider" data-theme="e">Export as json:</li>
					<li><input type="button" value="Export" data-theme="g" id="buttonExp" ></li>
		<li data-role="divider" data-theme="e">Import as json: Choose file to import</li>
		<li><input id="JSONfileSelect" type="file" accept=".json" /> </li>
					<li><input type="button" value="Import" data-theme="g" id="buttonImp" ><input type="button" value="Cancel" data-theme="g" id="buttonImpExpCancel" ></li>
					<li id="importErrEvLI">
					</li>
		</ul>'
		</div>
				<div class="clearRight"></div>
			</div>`
	return newdata;
}

function buttonCustGrp() {

	var newdata = '';
	newdata += '				<div class="ui-grid-b ui-responsive">';
	newdata += '					<div class="ui-block-a">';
	newdata += '						<fieldset data-role="controlgroup">';
	newdata += '							<select name="CustomGroupID" id="customGroupID" data-theme="d" data-mini="true">';
	newdata += '									<option value="">choose email group...</option>';
	for (var i = 1; i < mailGroups.length + 1; i++) {
		newdata += '									<option value="' + i + '" >' + mailGroups[i - 1].name + '</option>';
	}
	newdata += '							</select>';
	newdata += '						</fieldset>';
	newdata += '					</div>	';

	newdata += '					<div class="ui-block-b">';
	newdata += '						<input type="text" name="CustGrpName" id="custGrpName" data-mini="true" value="" placeholder="new group name..." >'; //style="font-size: 12px; width: 70%;"
	newdata += '           			</div>';
	newdata += '					<div class="ui-block-c ">';

	newdata += '						<div style="float: left; width: 160px; padding-left:5px; padding-right:2px;">\n';
	newdata += '				        	<input type="button"  data-role="button" data-mini="true" value="Save Group" data-theme="g" id="buttonSave" />';
	newdata += '					    </div >';
	newdata += '						<div style="float: left; width: 160px; padding-left:5px; padding-right:2px;">\n';
	newdata += '				        	<input type="button"  data-role="button" data-mini="true" value="Show Group" data-theme="d" id="buttonShow" />';
	newdata += '					    </div >';
	newdata += '						<div style="float: left; width: 160px; padding-left:5px; padding-right:2px;">\n';
	newdata += '				        	<input type="button"  data-role="button" data-mini="true" value="Delete Group" data-theme="c" id="buttonDelete" />';
	newdata += '					    </div >';
	newdata += '						<div style="float: left; width: 160px; padding-left:5px; padding-right:2px;">\n';
	newdata += '				        	<input type="button"  data-role="button" data-mini="true" value="Import/Export" data-theme="d" id="buttonImpExp" />';
	newdata += '					    </div >';
	newdata += '           			</div>';
	newdata += '           		</div>';

	return newdata;



}

function cgscript() {



	$('#buttonImpExp', '#PageX').click(function () {
		$('#impexpPopup', '#PageX').popup({
			tolerance: '10,40',
			transition: 'pop',
			positionTo: 'window',
			history: false
		}).popup('open');
		return false;
	});

	$('#buttonImpExpCancel', '#PageX').click(function () {

		$('#impexpPopup', '#PageX').popup('close');
		$('#buttonImp', '#PageX').button('enable');
		$('#buttonExp', '#PageX').button('enable');
		$('#buttonImpExpCancel', '#PageX').button('enable');

	});

	$('#buttonImp', '#PageX').click(function () {
		// disable all inputs
		$('#buttonImp', '#PageX').button('disable');
		$('#buttonExp', '#PageX').button('disable');
		$('#buttonImpExpCancel', '#PageX').button('disable');
		var size = 0;
		var files = document.getElementById('JSONfileSelect').files; //file1

		if (files.length == 0) {
			showErrorPopup('Please select the file you want to import and try again.');
			$('#buttonImpExpCancel', '#PageX').button('enable');
			$('#buttonImp', '#PageX').button('enable');
			$('#buttonExp', '#PageX').button('enable');
			document.getElementById("JSONfileSelect").disabled = false;
			return false;
		}
		var file = files[0];
		$.mobile.loading('show', {
			theme: 'a',
			text: 'Loading...',
			textonly: false
		});


		var reader = new FileReader();
		reader.onload = function () {
			var data = reader.result;

			$.mobile.loading('hide');
			//$.mobile.loading('show', { theme: 'a', text: 'saving... this can take several minutes for large numbers of events', textonly: false });
			document.getElementById("JSONfileSelect").disabled = true;

			var mailGroups2 = JSON.parse(data);
			var fileok = false;

			// go thru each
			if (Array.isArray(mailGroups2) == true) {
				for (var i = 0; i < mailGroups2.length; i++) {
					if (typeof mailGroups2[0].name == "string") {
						if (Array.isArray(mailGroups2[0].leaderlist) == true) {
							if (Array.isArray(mailGroups2[0].scoutlist) == true) {
								if (Array.isArray(mailGroups2[0].parentlist) == true) {
									fileok = true
								}
							}
						}
					}
				}
			}

			$.mobile.loading('hide');
			//alert('Loaded.')
			if (fileok == true) {
				mergeMailGrp(mailGroups2, '#PageX')
			} else {
				alert('The file you selected does not match current definitions and cannot be used');
			}
			$('#impexpPopup', '#PageX').popup('close');
			$('#buttonImp', '#PageX').button('enable');
			$('#buttonExp', '#PageX').button('enable');
			$('#buttonImpExpCancel', '#PageX').button('enable');
			document.getElementById("JSONfileSelect").disabled = false;

		};
		reader.readAsText(file);
		return false;
	});

	$('#buttonExp', '#PageX').click(function () {
		saveText('mailgroups.JSON', JSON.stringify(mailGroups));
		$('#impexpPopup', '#PageX').popup('close');
		$('#buttonImp', '#PageX').button('enable');
		$('#buttonExp', '#PageX').button('enable');
		$('#buttonImpExpCancel', '#PageX').button('enable');
		document.getElementById("JSONfileSelect").disabled = false;

		return false;
	});



	$('#buttonDelete', '#PageX').click(function () {
		delMailGrp('#PageX');
		return false;
	});
	$('#buttonSave', '#PageX').click(function () {
		saveMailGrp('#PageX');
		return false;
	});
	$('#buttonShow', '#PageX').click(function () {
		setCustSel('#PageX');
		return false;
	});

	$('#customGroupID', '#PageX').change(function () {
		$('#custGrpName').val($('#customGroupID option:selected').text());
		setCustSel('#PageX');
		return false;
	});


}

function chscript() {
	$("#buttonPreviewEmail", '#PageX').click(function () {
		addMeToSenderPrev('#PageX');
	});
}

function addMeToSenderPrev(pageid) {
	//get me from dashboard

	//clear garbage from sender

	//formPost=formPost.replace(/CustomGroupID=[^&]*&/,'').replace(/CustGrpName=[^&]*&/,'');


	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status != 200) {
			errStatusHandle(this.status, '', [], addMeToSenderPrev, [pageid]);
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt = 0;
			if (this.response.match(/&UserID=\d+/) != null) {
				var id = this.response.match(/&UserID=(\d+)/)[1];
				//Add to formPost if button not selected
				var me;
				$('li.leader.ui-btn-up-d').each(function () {
					if (id == $(this).attr('data-userid')) {
						me = $(this);
						//$(this).append('<div class="full-circle"><img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/checkmark256.png"></div>').removeClass('ui-btn-up-d').addClass('ui-btn-up-e');

					}
				});
				if (me != undefined) {
					me.append('<div class="full-circle"><img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/checkmark256.png"></div>').removeClass('ui-btn-up-d').addClass('ui-btn-up-e');
				}
				var me;
				$('li.parent.ui-btn-up-d').each(function () {
					if (id == $(this).attr('data-userid')) {
						me = $(this);
						//$(this).append('<div class="full-circle"><img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/checkmark256.png"></div>').removeClass('ui-btn-up-d').addClass('ui-btn-up-e');

					}
				});
				if (me != undefined) {
					me.append('<div class="full-circle"><img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/checkmark256.png"></div>').removeClass('ui-btn-up-d').addClass('ui-btn-up-e');
				}
				var me;
				$('li.scout.ui-btn-up-d').each(function () {
					if (id == $(this).attr('data-userid')) {
						me = $(this);
						//$(this).append('<div class="full-circle"><img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/checkmark256.png"></div>').removeClass('ui-btn-up-d').addClass('ui-btn-up-e');

					}
				});
				if (me != undefined) {
					me.append('<div class="full-circle"><img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/checkmark256.png"></div>').removeClass('ui-btn-up-d').addClass('ui-btn-up-e');
				}


				previewMail(pageid);
			}

			return;

		}
	};
	var url = 'https://' + host + 'scoutbook.com/mobile/dashboard/';
	xhttp.open("GET", url, true);
	xhttp.responseType = "text";
	xhttp.send();
	xhttp.onerror = function () {
		errStatusHandle(500, '', [], addMeToSenderPrev, [pageid]);
	}

}

function includePrevDisclaimer(pageid) {

	if ($('input[name="MessageType"]', pageid).val() == 'email') {

		var ev = {
			namestr: '',
			scoutpresent: false
		};

		getRecipientNames(ev);
		//console.log(ev.namestr,ev.scoutpresent);

		var disclaim = '';
		if ($('input[name="YPT"]', pageid).is(':checked') == true) {
			if (ev.scoutpresent == true) {
				disclaim = "Scouts! In keeping with Youth Protection's no one-on-one contact rules, please remember to CC your parents when replying to this message.\n";
				disclaim += "Adults! In keeping with Youth Protection's no one-on-one contact rules, please remember to CC any Scout's parents if you include a Scout in a reply.\n\n";
			}
		}
		if ($('input[name="BCC"]', pageid).is(':checked') == true) {
			if ($('input[name="NAMELST"]', pageid).is(':checked') == true) {
				disclaim += 'This message was sent to : ' + ev.namestr;
			}
		}
		if (disclaim != '') {

			return '\n\n[i]' + disclaim + '[/i]';
		}
	}
	return '';
}


function previewMail(pageid) {
	var msg = convBB($('#body', pageid).val() + includePrevDisclaimer(pageid));
	$('#PreviewMessage', pageid).empty();
	$('#PreviewMessage', pageid).append('<p style="white-space:pre-wrap;">' + msg + '</p>');
	$('#PreviewMessageDiv', pageid).show();
}

function setCustSel(pageid) {

	if ($('#custGrpName', pageid).val() == '') {
		alert('No mailgroup selected...');
		return false;
	}
	var found = false;
	for (var i = 0; i < mailGroups.length; i++) {
		if (mailGroups[i].name == $('#custGrpName', pageid).val()) {
			found = true;
			for (var j = 0; j < mailGroups[i].scoutlist.length; j++) {
				$('.scout.checkable[data-userid="' + mailGroups[i].scoutlist[j] + '"]', pageid).append('<div class="full-circle"><img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/checkmark256.png"></div>').removeClass('ui-btn-up-d').addClass('ui-btn-up-e');
			}
			for (var j = 0; j < mailGroups[i].leaderlist.length; j++) {
				$('.leader.checkable[data-userid="' + mailGroups[i].leaderlist[j] + '"]', pageid).append('<div class="full-circle"><img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/checkmark256.png"></div>').removeClass('ui-btn-up-d').addClass('ui-btn-up-e');
			}
			for (var j = 0; j < mailGroups[i].parentlist.length; j++) {
				$('.parent.checkable[data-userid="' + mailGroups[i].parentlist[j] + '"]', pageid).append('<div class="full-circle"><img src="https://d3hdyt7ugiz6do.cloudfront.net/images/icons/checkmark256.png"></div>').removeClass('ui-btn-up-d').addClass('ui-btn-up-e');
			}
		}
	}

	if (found == false) {
		alert('No "' + $('#custGrpName', pageid).val() + '" group found...');
	}

}

function mergeMailGrp(mailGroups2, pageid) {
	var newg = false;
	for (var j = 0; j < mailGroups2.length; j++) {
		var mgfound = false;
		for (var k = 0; k < mailGroups.length; k++) {
			if (mailGroups2[j].name == mailGroups[k].name) {
				mgfound = true;
				break;
			}
		}
		if (mgfound == false) {
			newg = true;
			//add new
			var i = mailGroups.length;
			mailGroups.push(JSON.parse(JSON.stringify(mailGroups2[j])));

			//find max option val
			var max = 0;
			$('#customGroupID', pageid).each(function () {
				if (parseInt($(this).val()) > max) {
					max = parseInt($(this).val());
				}
			});
			max += 1;
			$('#customGroupID', pageid).append('<option value="' + max + '" >' + mailGroups2[j].name + '</option>');
		}
	}

	if (newg == true) {
		alert('New Group Names loaded, saving');
		var msgObj = {
			hostx: "oth",
			text: "setMailGrps",
			mailGroups: JSON.stringify(mailGroups)
		};
		if (host == "www.") {
			msgObj.hostx = host;
		}
		sendTimerMsg(msgObj, "*");
	} else {
		alert('Did not find any new group names to load');
	}

}

function saveMailGrp(pageid) {

	var grpName = $('#custGrpName', pageid).val();

	if (grpName == '') {
		alert('Specify a group name before saving');
		return false;
	}

	var found = false;
	//see if it exists first
	for (var i = 0; i < mailGroups.length; i++) {
		if (mailGroups[i].name == grpName) {
			mailGroups[i].scoutlist = [];
			mailGroups[i].leaderlist = [];
			mailGroups[i].parentlist = [];
			$('.scout.checkable.ui-btn-up-e', pageid).each(function () {
				mailGroups[i].scoutlist.push($(this).attr('data-userid'));
			});
			$('.leader.checkable.ui-btn-up-e', pageid).each(function () {
				mailGroups[i].leaderlist.push($(this).attr('data-userid'));
			});
			$('.parent.checkable.ui-btn-up-e', pageid).each(function () {
				mailGroups[i].parentlist.push($(this).attr('data-userid'));
			});
			found = true;
			break;
		}
	}

	if (found == false) {
		//add new
		var i = mailGroups.length;
		mailGroups.push({
			name: grpName,
			scoutlist: [],
			leaderlist: [],
			parentlist: []
		});
		$('.scout.checkable.ui-btn-up-e', pageid).each(function () {
			mailGroups[i].scoutlist.push($(this).attr('data-userid'));
		});
		$('.leader.checkable.ui-btn-up-e', pageid).each(function () {
			mailGroups[i].leaderlist.push($(this).attr('data-userid'));
		});
		$('.parent.checkable.ui-btn-up-e', pageid).each(function () {
			mailGroups[i].parentlist.push($(this).attr('data-userid'));
		});

		//find max option val
		var max = 0;
		$('#customGroupID', pageid).each(function () {
			if (parseInt($(this).val()) > max) {
				max = parseInt($(this).val());
			}
		});
		max += 1;
		$('#customGroupID', pageid).append('<option value="' + max + '" >' + grpName + '</option>');
	}


	var msgObj = {
		hostx: "oth",
		text: "setMailGrps",
		mailGroups: JSON.stringify(mailGroups)
	};
	if (host == "www.") {
		msgObj.hostx = host;
	}
	sendTimerMsg(msgObj, "*");

}

function delMailGrp(pageid) {


	if ($('#custGrpName').val() == '') {
		alert('No mailgroup selected...');
		return false;
	}

	var optVal = '';
	var oldname = $('#custGrpName', pageid).val();
	$('#customGroupID option', pageid).each(function () {
		if ($(this).text() == oldname) {
			optVal = parseInt($(this).val());
		}
	});

	if (optVal != '') {

		$('#customGroupID option[value="' + optVal + '"]', pageid).remove();
		$('#customGroupID', pageid).selectmenu('refresh');
		$('#custGrpName', pageid).val('');
		//remove from mailGroups
		for (var i = 0; i < mailGroups.length; i++) {
			if (mailGroups[i].name == oldname) {
				mailGroups.splice(i, 1);
				break;
			}
		}
		//mailGroups.splice($.inArray(oldname, mailGroups),1);

		//remove from extension save location.  Simply re-save array
		alert(oldname + ' removed, list to be updated...');
		var msgObj = {
			hostx: "oth",
			text: "setMailGrps",
			mailGroups: JSON.stringify(mailGroups)
		};
		if (host == "www.") {
			msgObj.hostx = host;
		}
		sendTimerMsg(msgObj, "*");
	} else {
		alert('"' + oldname + '" not found to remove from MailGroups.  Check your spelling.')
	}
}