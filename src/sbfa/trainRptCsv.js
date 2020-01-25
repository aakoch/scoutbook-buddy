// Copyright © 1/12/2018 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.

//add button to run report
function rawDataModifyLeaderTraining(data,pageid,thisurl) {

	var startfunc=data.indexOf('<div id="footer" align="center">');

	//back up and find </ul>'
	
	startfunc=data.indexOf('</ul>',startfunc-50);
	
	var newlink = '<li>\n';
	newlink += '<a href="#" id="trainingCSV" >\n'; 
	newlink += '	<div>\n';
	newlink += '		Save Training Report CSV\n';	
	newlink += '		<img src="https://d1kn0x9vzr5n76.cloudfront.net/images/icons/clouddownload48.png" style="width: 18px; vertical-align: -2px;">\n';
	newlink += '	</div>\n';
	newlink += '	</a>\n';
	newlink += '</li>\n';

	
	data=data.slice(0,startfunc) + newlink + data.slice(startfunc);
	
	// add control for link, in PageInit
	var startfunc = data.indexOf("$('#unitID',");

    var myfunc=trscript + '';
	myfunc = myfunc.slice(22).slice(0,-1).replace(/\#PageX/g,'#Page' + escapeHTML(pageid));
	var newdata = data.slice(0,startfunc) + myfunc + '\n'  + data.slice(startfunc);			
	data=newdata;
	
	return data;
	

	
	
}

// on training report page
function trscript() {
			$('#trainingCSV', '#PageX').click(function () {

			    captureTraining();
				return false;
			});
}

function captureTraining() {
	var trlist=[];
	var output='';	
	
	tablecsv('scroller',trlist);
	
	for(var i=0;i<trlist.length;i++) {
		for(var j=0;j< trlist[i].length;j++) {
			output += trlist[i][j] + ',';
		}
		output += '\n';
	}	

	output += ',\n,\n';		//add a couple blank rows
	
	trlist=[];
	tablecsv('trainingLegend',trlist);
	
	for(var i=0;i<trlist.length;i++) {
		for(var j=0;j< trlist[i].length;j++) {
			output += trlist[i][j] + ',';
		}
		output += '\n';
	}

	output += ',\n,\n';		//add a couple blank rows
	
	output += 'V,Trained & Verified\n';
	output += 'T,Trained\n';
	output += 'W,Expires in 30 days\n';
	output += 'E,Expired\n';
	output += 'I,Not Completed\n';
	output += 'O,Optional\n';

	var unit=$('#goToUnit').text();
	
	saveText('TrainingReport '+unit+'.csv',output);
}


	
 function saveText(filename, text) {
	var tempElem = document.createElement('a');
	tempElem.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	tempElem.setAttribute('download', filename);
	document.body.appendChild(tempElem);
	tempElem.click();
	tempElem.remove();
 }


function tablecsv(id,trlist) {
	//var trlist=[];
	var tdlist=[];
	var tbl=$('#'+id)[0];
	var val='';
	var newval='';
	var vallst=[];
	var colspan=1;
	var iconbox=false;
	$('tr',tbl).each(function () {
		//tr either has header or data
		hdr=false;
		tdlist=[];
		
		$('td ,th',this).each( function () {
			colspan=1;
			iconbox=false;

			if($(this).attr('colspan') != undefined ) {
				colspan=parseInt($(this).attr('colspan'));
			}
			
			if($('.checkboxIcon',this).length > 0){
			if($('img',this).attr('src') != undefined ) {
			  if($('img',this).attr('src').match(/icons\/([^\.]+)/)!= null) {
				iconbox=true;
			  }
			  
			}
			}
			  if(iconbox==true) {
				var png='';
				switch ($('img',this).attr('src').match(/icons\/([^\.]+)/)[1]) {
				case 'checkboxapproved48':
					png="V";
					//png="Trained & Verified";
					break;
				case 'checkboxemptygray48':
					png="O";
					//png="Optional";
				
					break;
				case 'checkboxdone48':
					png="T";
					//png="Trained";
					break;
				case 'checkboxyellow48':
					png="W";
					//png="Expires in 30 days";
					break;
				case 'checkboxred48':
					png="E";
					//png="Expired";
					break;
				case 'checkboxempty48':
					png="I";
					//png="Not Completed";
					break;
				case 'trained100':
					png="OK";
					break;
				
					
				}				
				tdlist.push(png);
			 } else {
				newval='';
				if($(this).find('.bsaID').length > 0) {
				  //just grab name
				  val=this.textContent.trim().split('\n')[0];
				} else {
					val=this.textContent.trim();
					valLst=val.split('\n');
					for(var i=0;i<valLst.length;i++) {
					  newval += valLst[i].trim() +' ';
					}
					if(newval !='') val=newval;
				}
				tdlist.push(val);
			}
			if(colspan>1) {
				for(var i=1;i<colspan;i++) {
					tdlist.push('');
				}
			}
		});		
	
		trlist.push(tdlist);

		
	});
	//console.log(trlist);	

}
