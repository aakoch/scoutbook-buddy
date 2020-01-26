//import * as utils from "./sbutils";

//undo

// this is on rank.asp  Will have links to adventures and local rank requirements
// green completed  checkboxdone
//blue approved  checkboxapproved
//gold awarded  checkboxawarded
//started	checkboxgreen

// If the top level item is already awarded, do not allow

function addRawUndo(data,pageid) {

	//add link to undo
			//only if this person is an Admin
			var okshow=false;
			for(var i=0;i<utils.myPositions.length;i++) {
				if(utils.myPositions[i].position.match(/Pack|Troop|Crew|Ship Admin/) != null) {
					if($('a#goToUnit').text().trim() == utils.myPositions[i].unitName) {
						//check unit
						okshow=true;
					}
				}
				//unitName: "Lions Den (4) Pack 194"}    cumbs Den 4    Pack 194
				if(utils.myPositions[i].position.match(/Den Admin/) != null) {
					if(utils.myPositions[i].unitName.match( $('a#goToUnit').text().trim()) != null) {
						//now to match the den
						var den=$('a#goToDenPatrol').text().trim();  //(e.g. Den 4)
						var dnum=den.match(/Den (.+)/)[1];
						if(utils.myPositions[i].unitName.match('Den \\('+dnum+'\\)') !=null) {
							okshow=true;
						}
					//Webelos Den 2 Pack 194
					//check unit and Den
					}
				}
			
	
				if(utils.myPositions[i].position.match(/Patrol Admin/) != null) {
					if(utils.myPositions[i].unitName.match($('a#goToDenPatrol').text().trim() + ' Patrol ' +  $('a#goToUnit').text().trim()) != null) {
						okshow=true;
					}
				}	
			}
			if (okshow==false) {
				return data;
			}	
	
			var startfunc = data.indexOf('<li id="checkboxLegend" data-theme="d">');
			
			if (startfunc ==-1) {
				return data;
			}

			var menuopt='';
			menuopt= '<li><input type="button" value="Undo Requirements" data-theme="g" id="buttonPopUndo" >\n';

			data = data.slice(0,startfunc) + menuopt + '\n' + data.slice(startfunc);
	
			var startfunc = data.indexOf('<div id="footer"');

			newdata = '	<div data-role="popup" id="undoRequirementsPopup" data-dismissible="false" data-theme="d" data-history="false">';
			
			newdata +=			'<ul data-role="listview" data-inset="true" style="min-width: 600px;" data-theme="d" >';  //class="ui-icon-alt"
			newdata +=				'<li data-role="divider" data-theme="e">Undo or Reset Requirements:</li>';
			
			newdata +=			'			<li data-theme="d">\n';
				
			newdata +=			'				<div class="ui-grid-b ui-responsive">\n';
			newdata +=			'					<div class="ui-block-a">\n';
			newdata +=			'						<div>	\n';
			newdata +=			'							<div class="clearRight"></div>\n';
			newdata +=			'							<div style="margin-top: 0; " class="ui-icon-alt">\n';
			newdata +=			'								<fieldset data-role="controlgroup">\n';
			newdata +=			'									<legend class="text-orange">\n';
			newdata +=			'										<strong>Choose what marking you want to undo:</strong>\n';
			newdata +=			'									</legend>\n';
			newdata +=			'									<select name="UndoTypeID" id="undoTypeID" data-theme="d">\n';
			newdata +=			'										<option value="">choose one...</option>\n';
			newdata +=			'											<option value="1" >Marked Completed</option>\n';
			newdata +=			'											<option value="2" >Marked Approved</option>		\n';									
			newdata +=			'											<option value="3" >Marked Either Completed Or Approved</option>	\n';										
			newdata +=			'									</select>\n';
			newdata +=			'								</fieldset>\n';
			newdata +=			'							</div>\n';
			newdata +=			'						</div>\n';
			newdata +=			'						<div style="margin-top: 1.5em; margin-bottom: 1.5em; ">\n';
			newdata +=			'						</div>\n';
			newdata +=			'					</div>\n';
			newdata +=			'					<div class="ui-block-b">\n';
			newdata +=			'						<div>	\n';
			newdata +=			'							<div class="clearRight"></div>\n';
			newdata +=			'							<div style="margin-top: 0; " class="ui-icon-alt">\n';
			newdata +=			'								<fieldset data-role="controlgroup">\n';
			newdata +=			'									<legend class="text-orange">\n';
			newdata +=			'										<strong>Choose date marked you want to undo:</strong>\n';
			newdata +=			'									</legend>\n';
			newdata +=			'									<select name="UndoDateID" id="undoDateID" data-theme="d">\n';
			newdata +=			'										<option value="">choose one...</option>\n';
			newdata +=			'											<option value="1" >All Dates</option>\n';									
			newdata +=			'									</select>\n';
			newdata +=			'								</fieldset>\n';
			newdata +=			'							</div>\n';
			newdata +=			'						</div>\n';
			newdata +=			'						<div style="margin-top: 1.5em; margin-bottom: 1.5em; ">\n';
			newdata +=			'						</div>\n';			
			
			newdata +=			'					</div>\n';
			
			newdata +=			'					<div class="ui-block-c">\n';
			newdata +=			'						<div>	\n';
			newdata +=			'							<div class="clearRight"></div>\n';
			newdata +=			'							<div style="margin-top: 0; " class="ui-icon-alt">\n';
			newdata +=			'								<fieldset data-role="controlgroup">\n';
			newdata +=			'									<legend class="text-orange">\n';
			newdata +=			'										<strong>Choose who\'s marking you want to undo:</strong>\n';
			newdata +=			'									</legend>\n';
			newdata +=			'									<select name="UndoWhoID" id="undoWhoID" data-theme="d">\n';
			newdata +=			'										<option value="">choose one...</option>\n';
			newdata +=			'											<option value="1" >All Persons</option>\n';									
			newdata +=			'									</select>\n';
			newdata +=			'								</fieldset>\n';
			newdata +=			'							</div>\n';
			newdata +=			'						</div>\n';
			newdata +=			'						<div style="margin-top: 1.5em; margin-bottom: 1.5em; ">\n';
			newdata +=			'						</div>\n';			
			
			newdata +=			'					</div>\n';			
			
			newdata +=			'				</div>\n';

			newdata +=			'			</li>		\n';	
					
			newdata +=	'			<li><input type="button" value="Undo Now" data-theme="g" id="buttonUndo" ><input type="button" value="Cancel" data-theme="g" id="buttonUndoCancel" ></li>';
//			newdata +=	'			<li id="importErrRegLI">';
//			newdata +=	'			</li>';

			newdata +=			'</ul>';	
			
			newdata += '	</div>';				
			data = data.slice(0,startfunc) + newdata + '\n' + data.slice(startfunc);	
			
			startfunc = data.indexOf("function showErrorPopup(msg)");
			var myfunc = '' + udreqfu;
			myfunc = myfunc.slice(21).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(escapeHTML(pageid)));		//.replace('unitid',escapeHTML(unitID));
			data = data.slice(0,startfunc) + myfunc + '\n' + data.slice(startfunc);



			
	return data;
}


function udreqfu () {
				//var pageASP='awardrequirement';
				//var pageASP='adventurerequirement';
			
			$('#buttonPopUndo','#PageX').click(function () {
				//update the lists

				if(procUndo('#PageX') ==false ) {
					return false;
				}
				$('#undoRequirementsPopup','#PageX').popup('open');
			});
			
			$('#buttonUndoCancel', '#PageX').click(function () {
				$('#undoRequirementsPopup','#PageX').popup('close');
			});
			
			$('#buttonUndo', '#PageX').click(function () {
				//check selections

				if($('#undoWhoID option:selected').text() == 'choose one...' || $('#undoTypeID option:selected').text() == 'choose one...' ||$('#undoDateID option:selected').text() == 'choose one...') {
					alert('Please select your options');
					return false;
				} else {
					
					$('#buttonPopUndo','#PageX').button('disable');
					$('#buttonUndoCancel', '#PageX').button('disable');
					$('#buttonUndo', '#PageX').button('disable');					
					
					if( $('#undoTypeID option:selected').val() ==  3 || $('#undoTypeID option:selected').val() ==  2) {
						var tres=confirm('You opted to remove APPROVED items!!  Are you SURE you want to continue? Press OK to continue and Cancel to quit');
						if(tres == false) {
							return false;
						}
					}
					removeMarkedDates('#PageX');
				}
				
			});			
}

function procUndo(pageid) {
	var pageASP;
	var li;
	if(document.URL.match('adventure.asp') != null) {
		pageASP='adventurerequirement';
		li='adventureCompletedLI';
	}

	if(document.URL.match('meritbadge.asp') != null) {

		pageASP='meritbadgerequirement';
		li='mbCompletedLI';
	}

	if(document.URL.match('award.asp') != null) {

		pageASP='awardrequirement';
		li='awardCompletedLI';
	}
	
	var itemAwarded=false;
	$('#'+li).find('.dateCompleted').each( function () {
		if($(this).attr('id').match(/^A-/) != null) {
			itemAwarded=true;
		}
	});
	

	if($('#'+li + ' img[src*="checkboxawarded"]').length >0) {
			itemAwarded=true;
	}	
	
	
	if(itemAwarded==true) {
		alert('This achievement has already been awarded. The Undo feature only works for Completed or Approved Achievements.');
		$('#faOverlay',pageid).hide();
		return false;
	}
	
	
	
	
	var whoMarkList=[];
	var dateMarkList=[];
	var whoMarkList=[];
	var dateMarkList=[];
	

$('#'+li).each( function () {	

	pushUniqueV(dateMarkList,$('div.textBlue').text().trim());

	if($('img[src*="checkboxapproved"]',this).length != 0) {
			//console.log($(this).attr('href'));
			var parTr=this;
			if(parTr.length!=0) {
		

				if( $('.dateCompleted[id*="MC-"]',parTr).length != 0) {

					if($('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/(\d\d\d\d| on ) by .+/) != null) {
						pushUniqueV(whoMarkList,$('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/(\d\d\d\d| on ) by (.+)/)[2]);		
					}
					if($('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/\S+ \d+, \d\d\d\d/) != null) {
						pushUniqueV(dateMarkList,$('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/\S+ \d+, \d\d\d\d/)[0]);
					}
				}

				$('.dateCompleted',parTr).each(function() {
					//might have no id
					if($(this).attr('id') == undefined) {
					   	if($(this).text().trim().match(/\S+ \d+, \d\d\d\d/) != null) {
							pushUniqueV(dateMarkList,$(this).text().trim().match(/\S+ \d+, \d\d\d\d/)[0]);
						}
					}
				});				
				
				
				
				
				
				
				if( $('.dateCompleted[id*="LA-"]',parTr).length != 0) {
					if($('.dateCompleted[id*="LA-"]',parTr).text().trim().match(/(\d\d\d\d| on ) by .+/) != null) {
						pushUniqueV(whoMarkList,$('.dateCompleted[id*="LA-"]',parTr).text().trim().match(/(\d\d\d\d| on ) by (.+)/)[2]);
					}
					if($('.dateCompleted[id*="LA-"]',parTr).text().trim().match(/\S+ \d+, \d\d\d\d/) != null) {
						pushUniqueV(dateMarkList,$('.dateCompleted[id*="LA-"]',parTr).text().trim().match(/\S+ \d+, \d\d\d\d/)[0]);
					}
				}
			}
				
		}
		
		if($('img[src*="checkboxdone"]',this).length != 0) {
			//console.log($(this).attr('href'));
			var parTr=$(this).parentsUntil('table','tr');
			if(parTr.length!=0) {
				if( $('.dateCompleted[id*="MC-"]',parTr).length != 0) {
					if($('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/(\d\d\d\d| on ) by .+/) != null) {
						pushUniqueV(whoMarkList,$('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/(\d\d\d\d| on ) by (.+)/)[2]);
					}
					if($('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/\S+ \d+, \d\d\d\d/) != null) {
						pushUniqueV(dateMarkList,$('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/\S+ \d+, \d\d\d\d/)[0]);
					}
				}
			}
		}	
		
});
	
	
	
	

	$('a[href*="'+pageASP+'.asp?"]').each( function () {
		if($('img[src*="checkboxapproved"]',this).length != 0) {
			//console.log($(this).attr('href'));
			var parTr=$(this).parentsUntil('table','tr');
			if(parTr.length!=0) {
		


				if( $('.dateCompleted[id*="MC-"]',parTr).length != 0) {

					if($('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/(\d\d\d\d| on ) by .+/) != null) {
						pushUniqueV(whoMarkList,$('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/(\d\d\d\d| on ) by (.+)/)[2]);		
					}
					if($('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/\S+ \d+, \d\d\d\d/) != null) {
						pushUniqueV(dateMarkList,$('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/\S+ \d+, \d\d\d\d/)[0]);
					}
				}

				$('.dateCompleted',parTr).each(function() {
					//might have no id
					if($(this).attr('id') == undefined) {
					   	if($(this).text().trim().match(/\S+ \d+, \d\d\d\d/) != null) {
							pushUniqueV(dateMarkList,$(this).text().trim().match(/\S+ \d+, \d\d\d\d/)[0]);
						}
					}
				});				
				
				
				
				
				
				
				if( $('.dateCompleted[id*="LA-"]',parTr).length != 0) {
					if($('.dateCompleted[id*="LA-"]',parTr).text().trim().match(/(\d\d\d\d| on ) by .+/) != null) {
						pushUniqueV(whoMarkList,$('.dateCompleted[id*="LA-"]',parTr).text().trim().match(/(\d\d\d\d| on ) by (.+)/)[2]);
					}
					if($('.dateCompleted[id*="LA-"]',parTr).text().trim().match(/\S+ \d+, \d\d\d\d/) != null) {
						pushUniqueV(dateMarkList,$('.dateCompleted[id*="LA-"]',parTr).text().trim().match(/\S+ \d+, \d\d\d\d/)[0]);
					}
				}
			}
				
		}
		
		if($('img[src*="checkboxdone"]',this).length != 0) {
			//console.log($(this).attr('href'));
			var parTr=$(this).parentsUntil('table','tr');
			if(parTr.length!=0) {
				if( $('.dateCompleted[id*="MC-"]',parTr).length != 0) {
					if($('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/(\d\d\d\d| on ) by .+/) != null) {
						pushUniqueV(whoMarkList,$('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/(\d\d\d\d| on ) by (.+)/)[2]);
					}
					if($('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/\S+ \d+, \d\d\d\d/) != null) {
						pushUniqueV(dateMarkList,$('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/\S+ \d+, \d\d\d\d/)[0]);
					}
				}
			}
		}	
		
		
	});

	//update the options now

	if($('#undoDateID option').size() < 3) {
		for(var i=0;i<dateMarkList.length;i++) {
			$('#undoDateID').append('<option value="'+(i+1)+'">'+dateMarkList[i]+'</option>');
		}
	}
	if($('#undoWhoID option').size() < 3) {
		for(var i=0;i<whoMarkList.length;i++) {
			$('#undoWhoID').append('<option value="'+(i+1)+'">'+whoMarkList[i]+'</option>');
		}
	}

	return true;
}

function pushUniqueV(arr,val) {
	if(val.trim() =='') return;
	pushUnique(arr,val);
}

function removeMarkedDates(pageid) {
	var removeReqList=[];
    $.mobile.loading('show', { theme: 'a', text: 'Updating...', textonly: false });
	var	url='';
	var	dateComplete='';
	var	whoComplete='';
	var	dateApproved='';
	var	whoApproved='';
	var pageASP='';
	var urlVarID='';
	
	var li='';
	var typeComplete='';
	if(document.URL.match('adventure.asp') != null) {
		typeComplete='AdventureCompleted';
		li='adventureCompletedLI';
		pageASP='adventurerequirement';
		urlVarID='&AdventureRequirementID=';
		//for adventures, the top level must be cleared first
		topItem(typeComplete,li,pageASP,urlVarID);
	}

	if(document.URL.match('meritbadge.asp') != null) {
		typeComplete='MBCompleted';
		li='mbCompletedLI';
		pageASP='meritbadgerequirement';
		urlVarID='&MeritbadgeRequirementID=';
	}

	if(document.URL.match('award.asp') != null) {
		typeComplete='AwardEarned';
		li='awardCompletedLI';
		pageASP='awardrequirement';
		urlVarID='&AwardRequirementID=';
	}


	$('a[href*="'+pageASP+'.asp?"]').each( function () {
		url='';
		dateComplete='';
		whoComplete='';
		dateApproved='';
		whoApproved='';
		if($('img[src*="checkboxapproved"]',this).length != 0) {
			url=$(this).attr('href');
			var parTr=$(this).parentsUntil('table','tr');
			whoComplete='';
			dateComplete='';
			whoApproved='';
			dateApproved='';
			if(parTr.length!=0) {
				if( $('.dateCompleted[id*="MC-"]',parTr) != null) {
					if($('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/(\d\d\d\d| on ) by .+/) != null) {
						whoComplete=$('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/(\d\d\d\d| on ) by (.+)/)[2];
					} 
					if($('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/\S+ \d+, \d\d\d\d/)!= null) {
						dateComplete=$('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/\S+ \d+, \d\d\d\d/)[0];
					}
				}

				if(dateComplete=='') {
					$('.dateCompleted',parTr).each(function() {
						//might have no id
						if($(this).attr('id') == undefined) {
							if($(this).text().trim().match(/\S+ \d+, \d\d\d\d/) != null) {
								dateComplete=$(this).text().trim().match(/\S+ \d+, \d\d\d\d/)[0];
							}
						}
					});
				}
				
				
				if( $('.dateCompleted[id*="LA-"]',parTr) != null) {
					if($('.dateCompleted[id*="LA-"]',parTr).text().trim().match(/(\d\d\d\d| on ) by .+/) != null) {
						whoApproved=$('.dateCompleted[id*="LA-"]',parTr).text().trim().match(/(\d\d\d\d| on ) by (.+)/)[2];
					}
					if($('.dateCompleted[id*="LA-"]',parTr).text().trim().match(/\S+ \d+, \d\d\d\d/)!= null) {
						dateApproved=$('.dateCompleted[id*="LA-"]',parTr).text().trim().match(/\S+ \d+, \d\d\d\d/)[0];
					}
					
				}
				determineFormPost(url,dateComplete,whoComplete,dateApproved,whoApproved,removeReqList,'SubmitDateCompleted');
			}
				
		}
		
		whoComplete='';
		dateComplete='';
		if($('img[src*="checkboxdone"]',this).length != 0) {
			url=$(this).attr('href');
			//console.log($(this).attr('href'));
			var parTr=$(this).parentsUntil('table','tr');
			if(parTr.length!=0) {
				if( $('.dateCompleted[id*="MC-"]',parTr) != null) {
					if($('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/\d\d\d\d by .+/) != null) {
						whoComplete=$('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/\d\d\d\d by (.+)/)[1];
					}
					if($('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/\S+ \d+, \d\d\d\d/)!= null) {
						dateComplete=$('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/\S+ \d+, \d\d\d\d/)[0];
					}
					
					if(dateComplete=='') {
						$('.dateCompleted',parTr).each(function() {
							//might have no id
							if($(this).attr('id') == undefined) {
								if($(this).text().trim().match(/\S+ \d+, \d\d\d\d/) != null) {
									dateComplete=$(this).text().trim().match(/\S+ \d+, \d\d\d\d/)[0];
								}
							}
						});
					}					
					
					
					determineFormPost(url,dateComplete,whoComplete,dateApproved,whoApproved,removeReqList,'SubmitDateCompleted');
				}
			}
		}	
		



		
	});	

	if(typeComplete!='AdventureCompleted') {
		//do this last
		topItem(typeComplete,li,pageASP,urlVarID,removeReqList);
	}	
	postUndos(removeReqList,pageid);

	
	
}

function topItem(typeComplete,li,pageASP,urlVarID,removeReqList) {
	var	url='';
	var	dateComplete='';
	var	whoComplete='';
	var	dateApproved='';
	var	whoApproved='';


	
	$('#'+li).each( function () {
		if($('img[src*="checkboxapproved"]',this).length != 0) {
			//url=$(this).attr('href');
			//https://qa.scoutbook.com/mobile/dashboard/admin/awards/award.asp?UserAwardID=4469956&ScoutUserID=746078&UnitID=31252&refresh=1
			//https://qa.scoutbook.com/mobile/dashboard/admin/awards/award.asp?UserAwardID=4469956&ScoutUserID=746078&AwardRequirementID=&UnitID=31252
			url = document.URL.replace(/&refresh=1/,'').replace(/&UnitID/,urlVarID + '&UnitID');
			//var parTr=$(this).parentsUntil('table','tr');
			var parTr=this;
			whoComplete='';
			dateComplete='';
			whoApproved='';
			dateApproved='';
			if(parTr.length!=0) {
				if( $('.dateCompleted[id*="MC-"]',parTr) != null) {
					if($('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/(\d\d\d\d| on ) by .+/) != null) {
						whoComplete=$('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/(\d\d\d\d| on ) by (.+)/)[2];
					} 
					if($('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/\S+ \d+, \d\d\d\d/)!= null) {
						dateComplete=$('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/\S+ \d+, \d\d\d\d/)[0];
					}
				}

				if(dateComplete=='') {
					$('.dateCompleted',parTr).each(function() {
						//might have no id
						if($(this).attr('id') == undefined) {
							if($(this).text().trim().match(/\S+ \d+, \d\d\d\d/) != null) {
								dateComplete=$(this).text().trim().match(/\S+ \d+, \d\d\d\d/)[0];
							}
						}
					});
				}
				
				if(dateComplete=='') {
					dateComplete=$('div.textBlue').text().trim();
				}
				
				
				if( $('.dateCompleted[id*="LA-"]',parTr) != null) {
					if($('.dateCompleted[id*="LA-"]',parTr).text().trim().match(/(\d\d\d\d| on ) by .+/) != null) {
						whoApproved=$('.dateCompleted[id*="LA-"]',parTr).text().trim().match(/(\d\d\d\d| on ) by (.+)/)[2];
					}
					if($('.dateCompleted[id*="LA-"]',parTr).text().trim().match(/\S+ \d+, \d\d\d\d/)!= null) {
						dateApproved=$('.dateCompleted[id*="LA-"]',parTr).text().trim().match(/\S+ \d+, \d\d\d\d/)[0];
					}
					if(dateApproved=='') {
						dateApproved=$('div.textBlue').text().trim();
					}					
					
				}
				determineFormPost(url,dateComplete,whoComplete,dateApproved,whoApproved,removeReqList,typeComplete);
			}
				
		}
		
		whoComplete='';
		dateComplete='';
		if($('img[src*="checkboxdone"]',this).length != 0) {
			url = document.URL.replace(/&refresh=1/,'') + urlVarID;
			//console.log($(this).attr('href'));
			var parTr=this;
			if(parTr.length!=0) {
				if( $('.dateCompleted[id*="MC-"]',parTr) != null) {
					if($('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/\d\d\d\d by .+/) != null) {
						whoComplete=$('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/\d\d\d\d by (.+)/)[1];
					}
					if($('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/\S+ \d+, \d\d\d\d/)!= null) {
						dateComplete=$('.dateCompleted[id*="MC-"]',parTr).text().trim().match(/\S+ \d+, \d\d\d\d/)[0];
					}
					
					if(dateComplete=='') {
						$('.dateCompleted',parTr).each(function() {
							//might have no id
							if($(this).attr('id') == undefined) {
								if($(this).text().trim().match(/\S+ \d+, \d\d\d\d/) != null) {
									dateComplete=$(this).text().trim().match(/\S+ \d+, \d\d\d\d/)[0];
								}
							}
						});
					}
					
					if(dateComplete=='') {
						dateComplete=$('div.textBlue').text().trim();
					}					
					
					determineFormPost(url,dateComplete,whoComplete,dateApproved,whoApproved,removeReqList,typeComplete);
				}
			}
		}		
	});

}


function determineFormPost(url,dateComplete,whoComplete,dateApproved,whoApproved,removeReqList,action) {
		var dID = $('#undoDateID option:selected').text();
		var wID=$('#undoWhoID option:selected').text();
		var email=false;
		var formData='';
		
		if ($('#undoTypeID option:selected').val() ==  3) {									//user selects Completed and Approved
			if (whoApproved != '')	{														//exists
				if ((dID ==dateApproved && dID==dateComplete) || dID=='All Dates') {		//user selected Date Matches (dateApproved AND dateComplete) OR ALL Dates selected
					if ((wID==whoApproved && wID==whoComplete) || wID=='All Persons')	{	//user selected name matches (whoApproved AND whoComplete) OR ALL names selected
						formData='Action=' + action + '&DateCompleted=';				//remove date
						email=true;															//add to email list
					} else if (wID==whoApproved  || wID=='All Persons') {					//selected name matches whoApproved OR selected name = ALL
						formData='Action=' + action + '&DateCompleted='+ encodeURIComponent(mm_dd_yyyy(dateComplete));		//clear approved checkbox
						email=true;															//add to email list
					}  																		// else maybe the name matches on completed but do nothing because can't remove approval
				} else if (dID==dateApproved || dID=='All Dates') {							//selected Date Matches dateApproved OR selected date = ALL
					formData='Action=' + action + '&DateCompleted='+ encodeURIComponent(mm_dd_yyyy(dateComplete));			//clear approved checkbox
					email=true;																//add to email list
				}
			} else {	// this req isn't marked approved, only completed
				if ((wID==whoComplete || wID=='All Persons') && (dID==dateComplete || dID=='All Dates' )) {	//(selected name matches whoComplete OR selected name = ALL) AND (selected date matches dateComplete OR selected date = ALL)
					formData='Action=' + action + '&DateCompleted=';					//remove date
				}				
			} //endif
		} else if ($('#undoTypeID option:selected').val() ==  2) {							//user selected approved
			if (whoApproved != '')	{														//whoApproved exists
				if ((wID==whoApproved ||wID=='All Persons') &&(dID==dateApproved ||dID=='All Dates')) {		//(selected name matches whoApproved OR selected name = ALL) AND (selected date matches dateApproved OR selected date = ALL)
					formData='Action=' + action + '&DateCompleted='+ encodeURIComponent(mm_dd_yyyy(dateComplete));			//clear approved checkbox
					email=true;																//add to email list
				}
			}
		} else if ($('#undoTypeID option:selected').val() ==  1) {							//user selects completed
		    if (whoApproved == '') {														// only clear completes if not approved
				if ((wID==whoComplete ||wID=='All Persons') &&( dID==dateComplete ||dID=='All Dates')) {	//(selected name matches whoComplete OR selected name = ALL) AND (selected date matches dateComplete OR selected date = ALL)
					formData='Action=' + action + '&DateCompleted=';					//remove date
				}
			}
		}
	
		//if an award, change DateCompleted to DateEarned


		
		if(formData != '') {
			if(document.URL.match('award.asp') != null) {
				formData=formData.replace(/DateCompleted/g,'DateEarned');
			}			
			
			removeReqList.push({url:url,formData:formData,email:email,who:wID,dates:dID,undone:false});	
		}
}


function postUndos(removeReqList,pageid) {
	
	if(removeReqList.length == 0) {
		//nothing to change
		alert('Nothing matches the selection criteria');
		$('#undoRequirementsPopup').popup('close');
		return;
	}
	var url='';
	for (var i=0;i<removeReqList.length;i++) {
		if(removeReqList[i].undone==false) {
			url=removeReqList[i].url;
			break;
		}
	}
	if(url=='') {
		$('#undoRequirementsPopup','#PageX').popup('close');

		$('#buttonPopUndo','#PageX').button('enable');
		$('#buttonUndoCancel', '#PageX').button('enable');
		$('#buttonUndo', '#PageX').button('enable');
		
		url=document.URL.match(/scoutbook\.com(.+)/)[1];
		//reload current page
				$.mobile.loading('hide'); // go to
				$.mobile.changePage(
						url,
					{
					    allowSamePageTransition: true,
					    transition: 'none',
					    showLoadMsg: true,
					    reloadPage: true
					}
				);				
		// tally up the email stuff to send
		return;
	}
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			$('#faOverlay',pageid).hide();
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(postUndos,removeReqList,pageid);	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			removeReqList[i].undone=true;

			postUndos(removeReqList,pageid)
			
		}
	};
	
	
	xhttp.open("POST",url, true);
	xhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
	xhttp.send(removeReqList[i].formData);
			
	xhttp.onerror = function() {
		errHandle(postUndos,removeReqList,pageid);
		if (servErrCnt > maxErr) {
			//closeConMgr(unitID,'','');
			alert('Error Processing');
			$('#faOverlay',pageid).hide();
		}
	};	
		
	
}


function mm_dd_yyyy(dtin) {
	var d = new Date(dtin);	
    return d.getMonth()+1 +'/'+ d.getDate() + '/'+d.getFullYear();	
}
	
// export {addRawUndo};