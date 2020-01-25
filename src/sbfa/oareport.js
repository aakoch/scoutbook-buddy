// Copyright © 10/19/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.

function setOAReportPageContent(txtunit) {
	var newdata='';
	newdata += '		<div data-role="content" class="ui-content">';	
	newdata += '		<ul data-role="listview" data-theme="d" data-inset="true">';
	newdata += '				<li id="payrptLI" data-theme="d">';

	newdata += '		<table style="border: 1px solid black;  border-collapse: collapse;  padding: 5px 5px 5px 5px;">\n';
	
	
	newdata += '		<tr><th style="border: 1px solid black; padding: 5px 5px 5px 5px;">Scout Name</th>';
	newdata += '		<th style="border: 1px solid black; padding: 5px 5px 5px 5px;">OA Member</th>';
	newdata += '		<th style="border: 1px solid black; padding: 5px 5px 5px 5px;">Active</th>';
	newdata += '		<th style="border: 1px solid black; padding: 5px 5px 5px 5px;">OA Member Number</th>';
	newdata += '		<th style="border: 1px solid black; padding: 5px 5px 5px 5px;">Election Date</th>';
	newdata += '		<th style="border: 1px solid black; padding: 5px 5px 5px 5px;">Ordeal Date</th>';
	newdata += '		<th style="border: 1px solid black; padding: 5px 5px 5px 5px;">Brotherhood Date</th>';
	newdata += '		<th style="border: 1px solid black; padding: 5px 5px 5px 5px;">Vigil Date</th></tr>\n';		
		
	var found=false;
	for(var i=0;i<scoutProfileObjList.length;i++){
		if(getFormVal(scoutProfileObjList[i].profileData,'OAMember') =='yes') {
			found=true;
	newdata += '		<tr>\n';
	newdata += '			<td style="border: 1px solid black; padding: 5px 5px 5px 5px;">\n';
	newdata += '				<b>' + escapeHTML(decodeURIComponent(getFormVal(scoutProfileObjList[i].profileData,'LastName'))) +', '+ escapeHTML(decodeURIComponent(getFormVal(scoutProfileObjList[i].profileData,'FirstName'))) +' '+ escapeHTML(decodeURIComponent(getFormVal(scoutProfileObjList[i].profileData,'MiddleName'))) +' '+ escapeHTML(decodeURIComponent(getFormVal(scoutProfileObjList[i].profileData,'Suffix')));
	newdata += '			</td>\n';
	newdata += '			<td style="border: 1px solid black; padding: 5px 5px 5px 5px;">\n';
	newdata += 					escapeHTML(decodeURIComponent(getFormVal(scoutProfileObjList[i].profileData,'OAMember')));
	newdata += '			</td>\n';	
	
	newdata += '			<td style="border: 1px solid black; padding: 5px 5px 5px 5px;">\n';
	newdata += 							escapeHTML(decodeURIComponent(getFormVal(scoutProfileObjList[i].profileData,'OAActive')));
	newdata += '			</td>\n';
	
	newdata += '			<td style="border: 1px solid black; padding: 5px 5px 5px 5px;">\n';	
	newdata += 							escapeHTML(decodeURIComponent(getFormVal(scoutProfileObjList[i].profileData,'OAMemberNumber')));
	newdata += '			</td>\n';	
	
	
	newdata += '			<td style="border: 1px solid black; padding: 5px 5px 5px 5px;">\n';
	newdata += 							escapeHTML(decodeURIComponent(getFormVal(scoutProfileObjList[i].profileData,'OAElectionDate')));
	newdata += '			</td>\n';


	newdata += '			<td style="border: 1px solid black; padding: 5px 5px 5px 5px;">\n';
	newdata += 							escapeHTML(decodeURIComponent(getFormVal(scoutProfileObjList[i].profileData,'OAOrdealDate')));
	newdata += '			</td>\n';


	newdata += '			<td style="border: 1px solid black; padding: 5px 5px 5px 5px;">\n';
	newdata += 							escapeHTML(decodeURIComponent(getFormVal(scoutProfileObjList[i].profileData,'OABrotherhoodDate')));
	newdata += '			</td>\n';


	newdata += '			<td style="border: 1px solid black; padding: 5px 5px 5px 5px;">\n';
	newdata += 							escapeHTML(decodeURIComponent(getFormVal(scoutProfileObjList[i].profileData,'OAVigilDate')));
	newdata += '			</td>\n';	
	

	
	newdata += '		</tr>\n';	
		}
	}
	


	newdata += '		</table>\n';

	if (found==false) {
		newdata += 'No Scouts found with OA Membership set to yes\n';
	}
	newdata += '	</li>';
	newdata += '	</ul>';

	newdata += '	</div>';

	newdata += '	<div data-role="popup" id="errorPopup" data-overlay-theme="a" class="ui-content" data-theme="e" data-transition="fade">';
	newdata += '		<a href="#" id="closePopupButton" data-rel="back" data-role="button" data-theme="a" data-icon="delete" data-iconpos="notext" class="ui-btn-right">Close</a>';
	newdata += '		<div id="errorPopupIcon"></div>';
	newdata += '		<div id="errorPopupContent"></div>';
	newdata += '		<div class="clearRight"></div>';
	newdata += '	</div>';

	newdata += '		<div id="footer" align="center">';
				
		
	newdata += '	<div style="margin-top: 6px;">&copy; '+escapeHTML(cyear())+'- Boy Scouts of America &bull; <a href="/mobile/help/privacy.asp">Privacy</a></div>';
	newdata += '	<div><a href="/" data-ajax="false"><img src="https://d1kn0x9vzr5n76.cloudfront.net/mobile/images/scoutbookbsalogo400.png" width="200"></a></div>';
		
	newdata += '		</div>';


	oaRpt=false;
	return newdata;	
}

