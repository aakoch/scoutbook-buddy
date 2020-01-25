// Copyright © 2/20/18 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.


function setYPTPageContent(unitid,txtunit) {
	yptRpt=false;
	var newdata='';
	newdata += '		<div data-role="content" class="ui-content printcontent">';	
	newdata += '			<ul data-role="listview" data-theme="d" data-inset="true">';   //theme d white  inset means inside a border 
	newdata += '				<li id="payrptLI" data-theme="d">';
	newdata += '				  <div id="yptTable" >\n';	//class="printonly seeprint"
	newdata += '				  	<table id="leader" style="font-weight: normal">\n';	
	newdata += '				  	<tr><th style="padding:5px; border-bottom: 1px solid #ddd;">Leader</th><th style="padding:5px; border-bottom: 1px solid #ddd;">Date Trained</th><th style="padding:5px; border-bottom: 1px solid #ddd;">Expiration Date</th><th style="padding:5px; border-bottom: 1px solid #ddd;">Note</th></tr>\n';	
	for(var i=0;i<adultList.length;i++) {
		if(adultList[i].type=='leader') {
			newdata += '				<tr><td style="padding:5px; border-bottom: 1px solid #ddd;">'+adultList[i].name+'</td><td style="padding:5px; border-bottom: 1px solid #ddd;">'+adultList[i].yptDate+'</td><td style="padding:5px; border-bottom: 1px solid #ddd;">'+exdate(adultList[i].yptDate)+'</td><td style="padding:5px; border-bottom: 1px solid #ddd;">'+expYpt(adultList[i].yptDate,'leader')+'</td></tr>\n';
		}
	}
	
	newdata += '				  	</table>\n';
	newdata += '				  	<br><br>\n';	
	newdata += '				  	<table id="parent" style="padding:5px; font-weight: normal">\n';		
	newdata += '				  	<tr><th style="padding:5px; border-bottom: 1px solid #ddd;">Parent</th><th style="padding:5px; border-bottom: 1px solid #ddd;">Date Trained</th><th style="padding:5px; border-bottom: 1px solid #ddd;">Expiration Date</th><th style="padding:5px; border-bottom: 1px solid #ddd;">Note</th></tr>\n';	
	for(var i=0;i<adultList.length;i++) {
		if(adultList[i].type=='parent') {
			newdata += '				<tr><td style="padding:5px; border-bottom: 1px solid #ddd;">'+adultList[i].name+'</td><td style="padding:5px; border-bottom: 1px solid #ddd;">'+adultList[i].yptDate+'</td><td style="padding:5px; border-bottom: 1px solid #ddd;">'+exdate(adultList[i].yptDate)+'</td><td style="padding:5px; border-bottom: 1px solid #ddd;">'+expYpt(adultList[i].yptDate,'parent')+'</td style="padding:5px; border-bottom: 1px solid #ddd;"></tr>\n';
		}
	}	
	newdata += '				  	</table>\n';	
	newdata += '				  </div>\n';	//	end of id=summaryTable	
	newdata += '				</li>';	
	newdata += '			</ul>';
	newdata += '		</div>';   //data-role content
	
	newdata += '		<div id="footer" align="center">';
	newdata += '			<div style="margin-top: 6px;">&copy; '+escapeHTML(cyear())+'- Boy Scouts of America &bull; <a href="/mobile/help/privacy.asp">Privacy</a></div>';
	newdata += '			<div><a href="/" data-ajax="false"><img src="https://d1kn0x9vzr5n76.cloudfront.net/mobile/images/scoutbookbsalogo400.png" width="200"></a></div>';
	newdata += '		</div>';
	
	return newdata;
}
var adultList=[];

function getAdultIDList(unitid,pageid) {
	$.mobile.loading('show', { theme: 'a', text: 'Please be patient, this can take a while for large units.  loading...', textonly: false });
	adultList=[];
	var found=false;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide',pageid);
			$('#faOverlay',pageid).hide();
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle( getAdultIDList,unitid,pageid,'','','','','');	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			
			$('.leader.checkable',this.response).each(function (index,value) {
				adultList.push({type:'leader',id:$(this).attr('data-userid'),name:$(this)[0].childNodes[1].innerText.trim().split('\n')[0].trim()});
			});	
			$('.parent.checkable',this.response).each(function (index,value) {
				//if id already caught for leader, do not push
				found=false;
				for(var i =0;i<adultList.length;i++) {
					if(adultList[i].id==$(this).attr('data-userid')) {
						found=true;
						break;
					}	
				}
				if(found == false) {
					adultList.push({type:'parent',id:$(this).attr('data-userid'),name:$(this)[0].childNodes[1].innerText.trim().split('\n')[0].trim()});
				}
			});			
			//getOtherAdultIDList(unitid,adultList);
			iterateAdultYPT(unitid,adultList,0,pageid);
		}

	};


	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/messages/default.asp?UnitID='+escapeHTML(unitid);
	xhttp.open("GET", url, true);
	xhttp.responseType="document";
	xhttp.send();

	xhttp.onerror =function() {
		errHandle( getAdultIDList,unitid,pageid,'','','','','');
	}

}
//unused
/*
function getOtherAdultIDList(unitid,adultList) {
	//am2776
	var found=false;
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			$('#faOverlay').hide();
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle( getOtherAdultIDList,unitid,adultList,'','','','','');	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;
			var tid;
			var nm;
			$('a[href*="admin/rosteredit.asp?AdultUserID="]',this.response).each(function (index,value) {
				tid=$(this).attr('href').match(/AdultUserID=(\d+)/)[1];
				nm=$(this).text().trim();
				//if id already caught for leader, do not push
				found=false;
				for(var i =0;i<adultList.length;i++) {
					if(adultList[i].id==tid) {
						found=true;
						break;
					}	
				}
				if(found == false) {
					adultList.push({type:'leader',id:tid,name:nm});
				}
			});			

			iterateAdultYPT(unitid,adultList,0,pageid);
		}

	};


	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/roster.asp?UnitID='+escapeHTML(unitid);
	xhttp.open("GET", url, true);
	xhttp.responseType="document";
	xhttp.send();

	xhttp.onerror =function() {
		errHandle( getOtherAdultIDList,unitid,'','','','','','');
	}

}

*/



function iterateAdultYPT(unitid,adultList,ptr,pageid) {
	if(ptr==adultList.length) {
		//done getting dates
		//console.log(adultList);
		yptRpt=true;
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
	
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status > 399  && this.status < 500) {
			$.mobile.loading('hide');
			$('#faOverlay',pageid).hide();
			alert('Error: '+ this.status);  //page not found etc.  This is unrecoverable
			return;
		}
		if (this.readyState == 4 && this.status > 499) {
			errHandle( iterateAdultYPT,unitid,adultList,ptr,pageid,'','');	//server side error - maybe next try will work
			return;
		}
		if (this.readyState == 4 && this.status == 200) {
			resetLogoutTimer(url);
			servErrCnt=0;	
			//172023
			adultList[ptr]['yptDate']=$('a[href*="TrainingID="]:contains("Y01")',this.response).find('.textBlue').first().text();
			
			ptr+=1;

			setTimeout(function() {
				iterateAdultYPT(unitid,adultList,ptr,pageid);
			},200);
		}
	};
		
	
	
	var adultid=adultList[ptr].id;
	var url= 'https://' + host + 'scoutbook.com/mobile/dashboard/admin/training.asp?AdultUserID='+escapeHTML(adultid)+'&UnitID='+escapeHTML(unitid)+'&DenID=&PatrolID=';
	xhttp.open("GET", url, true);
	xhttp.responseType="document";
	xhttp.send();

	xhttp.onerror =function() {
		errHandle( iterateAdultYPT,unitid,adultList,ptr,pageid,'','');
	}	
}

function expYpt(dt,who) {
	
	if(dt=='' && who =='leader') {
		return('Never Taken');
	}
	var dateTrained=new Date(dt);
	
	var yr=dateTrained.getFullYear() +2;
	var mon=dateTrained.getMonth();
	var day=dateTrained.getDate();
	
	var regularExpiration=new Date(yr,mon,day);
	
	var nowDate=new Date(Date.now());
	var newCourseDate=new Date('2/1/2018');
	var CutoffDate=new Date('10/1/2018');
	if(regularExpiration < nowDate) {
		return 'Expired';
	}
	
	// anything here is not yet expired
	
	if(regularExpiration < CutoffDate) {
		//not expired yet, but will expire before the cutoff
	} else {
		//not expired yet, but will expire after the cutoff
		if(dateTrained < newCourseDate) {
			//and its not the proper course any more
			return('Expires Sep 30 2018')
		}
	}
	 return '';
}


function exdate(dt) {
	if(dt=='') {
		return('');
	}
	var dateTrained=new Date(dt);
	
	var yr=dateTrained.getFullYear() +2;
	var mon=dateTrained.getMonth();
	var day=dateTrained.getDate();
	
	var regularExpiration=new Date(yr,mon,day);
	
	var nowDate=new Date(Date.now());
	var newCourseDate=new Date('2/1/2018');
	var CutoffDate=new Date('10/1/2018');
	var rgexpmon= regularExpiration.getMonth()+1;
	if(regularExpiration < nowDate) {
		return rgexpmon + '/'+ regularExpiration.getDate() +'/'+ regularExpiration.getFullYear() ;
	}
	
	// anything here is not yet expired
	
	if(regularExpiration < CutoffDate) {
		//not expired yet, but will expire before the cutoff
	} else {
		//not expired yet, but will expire after the cutoff
		if(dateTrained < newCourseDate) {
			//and its not the proper course any more
			return('9/30/2018')
		}
	}
	 return rgexpmon + '/'+ regularExpiration.getDate() +'/'+ regularExpiration.getFullYear() ;	
}