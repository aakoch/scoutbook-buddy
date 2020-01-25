// Copyright © 10/3/2018 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.


function rawDataModifyCounselorList(data,pageid,thisurl,unitID) {
	return data;
	if(testUnique(mbcCouncils,councilTextName) == false) {
		return data;
	}


	var newlink='';
	startfunc=data.indexOf('</form');
	//newlink +='<ul data-role="listview" data-inset="true" style="margin-top: 0; " class="ui-icon-alt ui-listview ui-listview-inset ui-corner-all ui-shadow" data-theme="d">\n';
	newlink +='<ul data-role="listview" data-inset="true" style="margin: 5px 0; " class="ui-icon-alt">\n';
	//newlink +='<li class="ui-icon-alt ui-btn ui-btn-icon-right ui-li-has-arrow ui-li ui-btn-up-d" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="div" data-icon="arrow-r" data-iconpos="right" data-theme="d">\n';
	newlink +='<li class="ui-icon-alt" >\n'; 
 //newlink +='<div class="ui-btn-inner ui-li">\n';
	
	
	//newlink +='<div class="ui-btn-text">\n';
	newlink += '<a href="#" id="exportMBListCSV" class="ui-link-inherit">\n'; 
	newlink += '	<div>\n';
	newlink += '		Save Merit Badge Counselor List CSV\n';	
	newlink += '		<img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/clouddownload48.png" style="width: 18px; vertical-align: -2px;">\n';
	newlink += '	</div>\n';
    newlink += '<span class="ui-icon ui-icon-arrow-r ui-icon-shadow">&nbsp;</span>\n';
	newlink += '</a>\n';
	//newlink += '</div>\n';
	//newlink += '</div>\n';
	newlink +='</li></ul>\n';

	
	
	
	
	
	
	
	
	data=data.slice(0,startfunc) + newlink + data.slice(startfunc);
	
	// add control for link, in PageInit
	var startfunc = data.indexOf("$('#buttonSubmit");

    var myfunc=mcscript + '';
	myfunc = myfunc.slice(22).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(pageid)).replace('unitid',escapeHTML(unitID));;
	var newdata = data.slice(0,startfunc) + myfunc + '\n'  + data.slice(startfunc);			
	data=newdata;
	
	return data;	
	
}
	
// on training report page
function mcscript() {
			
			$('#exportMBListCSV', '#PageX').click(function () {
				var mbpages=[1];
				var listallmbs='';
				// get options
				var avail = $(':radio[name=Availability]:checked').val();
				var prox= $(':radio[name=Proximity]:checked').val();
				var mbid=$('#meritBadgeID option:selected').val();
				$.mobile.loading('show', { theme: 'a', text: 'loading... NOTE: Large units can take several minutes', textonly: false });
			    
				document.getElementById("exportMBListCSV").disabled = true;
				$(':input', '#PageX #form1').attr('disabled', true);
				getNextMBCPage(unitid,mbpages,listallmbs,avail,prox,mbid, '#PageX');
				return false;
			});
}
	
	




function captureMBCs(mbpages,resp) {
	//var listallmbs='';
	//var mbpages=[];
	var pgnum=0;
	var lpgnum=0;
	var npg=0;

	//capture all the page links
	$('a[href*="counselorresults.asp"]',resp).each(function (index,value) {
		var lnk=$(this)[0].href;
		//don't want anything that is missing page=
		if(lnk.match(/Page=\d+/) != null) {
			//skip page 1, already have it.
			pgnum=lnk.match(/Page=(\d+)/)[1];
			
			//console.log(lnk.match(/Page=(\d+)/));
			if(pgnum != '1') {
				// Check for gaps.
				
				npg=parseInt(lpgnum)+parseInt(2);
				if (pgnum > npg) {
					//pre = lnk.match(/.+Page=/)[0];
					//console.log(pre);
					for(var i=parseInt(lpgnum)+parseInt(1);i<parseInt(pgnum);i++) {
						pushUnique(mbpages,i);
					}
				}
				
				lpgnum=pgnum;
			}
			pushUnique(mbpages,pgnum);
		}
	});

}


// gets all the mbcs from the current page.  
function getMBCsFromPage(listallmbs,resp) {
	


	var miles;
	//var listallmbs='';
	$('ul[data-count-theme="f"] li',resp).each(function (index,value) {
		miles=$('.miles',this)[0].textContent;
		//console.log($('div[style*="margin-left"]',this)[0].textContent);
		var name=$('div[style*="margin-left"]',this)[0].firstChild.textContent.trim()
		var address=$('.address',this)[0].firstChild.textContent.trim();
		var addPhones=$('.address',this)[0].textContent;
		var homePhone='';
		var res= addPhones.match(/Home \(\d+\) \d+-\d+/);
		if (res != null) { 
			homePhone=res[0];
		}

		var mobilePhone= '';
		res=addPhones.match(/Mobile \(\d+\) \d+-\d+/);
		if (res != null) { 
			mobilePhone=res[0];
		}
		var listedWith=$('.listedWith',this)[0].firstChild.textContent.trim();
		// mbs are separate

		var mbs=[];
		var mbstr='';
		var com='';
		$('.mb',this).each(function (index,value) {
			mbs.push($(this)[0].textContent);

			mbstr += com + $(this)[0].textContent;
			com=', ';
		});

		var email=$('a',this)[0].text;
		var ypt = $('.yptDate',this)[0].textContent.trim();
		//console.log(miles,name,address,homePhone,mobilePhone,email,listedWith,ypt,mbstr);
		 listallmbs += '"' +miles+'","'+name+'","'+address+'","'+homePhone+'","'+mobilePhone+'","'+email+'","'+listedWith+'","'+ypt+'","'+mbstr + '"\n';



		//console.log($(this)[0].textContent);
	});
	//console.log(listallmbs);
	return listallmbs;

}

function getNextMBCPage(unitid,mbpages,listallmbs,avail,prox,mbid,pageid) {


	if(mbpages.length == 0) {
		//done
		var unit=$('#goToUnit').text();
		saveText('MBC List ' + unit+' '+Date.now()+'.csv',listallmbs);
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
			
		return;
	} 
	
	var pagenum=mbpages[0];

	var xhttp = new XMLHttpRequest();
	formPost = '';
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			$('#faOverlay',pageid).hide();
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle(getNextMBCPage,unitid,mbpages,listallmbs,avail,prox,mbid,pageid);	//server side error - maybe next try will work
			return;
		}		
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;

			if(mbpages.length==1) {
				if (mbpages[0]==1) {
					// fill mbpages
					captureMBCs(mbpages,this.response);	// get array of remaining page numbers
				}
			}			
			
			mbpages.shift();
			// keep going un til none left
			listallmbs= getMBCsFromPage(listallmbs,this.response);
			setTimeout(function () {getNextMBCPage(unitid,mbpages,listallmbs,avail,prox,mbid,pageid);}, 200);	
			
			
		}
	};

	var url='https://' + host + 'scoutbook.com/mobile/dashboard/admin/counselorresults.asp?UnitID='+unitid+'&MeritBadgeID='+mbid+'&zip='+myPositions[0].myZip+'&Proximity='+prox+'&Availability='+avail+'&Page='+pagenum;
	xhttp.open("GET", url, true);
	xhttp.send();
	xhttp.onerror = function() {
		errHandle(getNextMBCPage,unitid,mbpages,listallmbs,avail,prox,mbid,pageid);	//server side error - maybe next try will work
	};
	
	
}
