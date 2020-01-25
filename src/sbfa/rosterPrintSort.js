// Copyright © 2/5/2018 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.

// sorts columns of data in print roster
if(document.baseURI.match(/roster\.asp\?Action=Print/) != null) {
	
  $('th').css("cursor", "pointer");
	
$('#scoutRoster tr:not(".borderBottom")').each(function () {
	if($('td',this).text().trim().split(',')[0]=="Account" ) {
		$(this).remove();
	}
});	
	
	
//add a sort function to this page
	$('#scoutRoster th').click( function () {

		var column=$(this).index();	//0 is first column
		//return false;
		//need to load table into array then sort array based on field
		//return false;
		var rw=[];
		var tbl=[];
		$('#scoutRoster tr:not(".borderBottom")').each(function () {
			rw=[];
			$('td',this).each(function () {
				rw.push($(this).text().trim());
			});
			tbl.push(rw);
		});
		
		var idx=column;
		tbl.sort(function(a,b) {
			var x = a[idx].toLowerCase();
			var y = b[idx].toLowerCase();
			if (x < y) {return -1;}
			if (x > y) {return 1;}
			return 0;			
		});
		var tblc=0;
		var rwc=0;
		$('#scoutRoster tr:not(".borderBottom")').each(function () {
			rwc=0;
			$('td',this).each(function () {
				$(this).html(tbl[tblc][rwc]);
				rwc+=1;
			});
			tblc+=1;
		});
	
	});
	
	$('#leaders th').click( function () {

		var column=$(this).index();	//0 is first column
		//return false;
		//need to load table into array then sort array based on field
		//return false;
		var rw=[];
		var tbl=[];
		$('#leaders tr:not(".borderBottom")').each(function () {
			rw=[];
			$('td',this).each(function () {
				rw.push($(this).text().trim());
			});
			tbl.push(rw);
		});
		
		var idx=column;
		tbl.sort(function(a,b) {
			var x = a[idx].toLowerCase();
			var y = b[idx].toLowerCase();
			if (x < y) {return -1;}
			if (x > y) {return 1;}
			return 0;			
		});
		var tblc=0;
		var rwc=0;
		$('#leaders tr:not(".borderBottom")').each(function () {
			rwc=0;
			$('td',this).each(function () {
				$(this).html(tbl[tblc][rwc]);
				rwc+=1;
			});
			tblc+=1;
		});
	
	});	
	
	
	//$('body').append(logoutWarningPageContent('')).trigger('create');
}

