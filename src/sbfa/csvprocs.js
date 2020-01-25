// Copyright © 10/4/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America.

/* function is injected.  Parses a line of csv data
 based on http://stackoverflow.com/questions/7431268/how-to-read-data-from-csv-file-using-javascript
 These two functions to be injected onto the page
*/


function rowparse(data) {
	var entries=[];
	var q_cnt;
	var lastfield='';
	var field2check='';
	
	data.split(',').forEach(function (field) {
		if(field == '') {
			if (lastfield=='') {
				entries.push('');
			} else {
				// get next field
			}
		} else {
			field2check=lastfield +field;
			if (field2check.match(/"/g) == null) {
				q_cnt=0;
			} else {
				q_cnt = field2check.match(/"/g).length;
			}
			if (parseInt(q_cnt)/2 == Math.trunc(parseInt(q_cnt)/2)) {
			  
			  entries.push(field2check);

			  field2check='';
			  lastfield='';
			} else {
				// add next field and try again
				lastfield = field2check + ',';
				field2check='';
			}
		}
		
	});
	//remove escape quote containers
  for(var i=0;i<entries.length;i++) {
	  entries[i]=entries[i].trim();
	  if(entries.length > 1) {
		  if(entries[i][0] == '"' && entries[i][entries[i].length-1] == '"') {
			  entries[i] = entries[i].slice(1,entries[i].length-1);
		  }
		  entries[i] = entries[i].replace(/""/g,'"');
	  }
 	  //console.log(entries[i]);
  }
  return entries;	
}
/*
function rowparse(row){
  var insideQuote = false,
      entries = [],
      entry = [];
  row.split('').forEach(function (character) {
    if(character === '"') {
      insideQuote = !insideQuote;
    } else {
      if(character == "," && !insideQuote) {
        entries.push(entry.join(''));
        entry = [];
      } else {
        entry.push(character);
      }
    }
  });
  entries.push(entry.join(''));
  
  for(var i=0;i<entries.length;i++) {
	  entries[i]=entries[i].trim();
  }
  return entries;
}
*/

var injrowparse= rowparse;

/* function is injected. Splits a CSV file into lines to be parsed, returns parsed file

This function uses this logic:
new lines separate roes
rows always have an even number of escape quotes, regardless of the field content
fields always have an even number of escape quotes, regardless of the field content (some fields have 0 quotes wich is even
Any field with a newline character is preceded with a single quote (odd number).  So piecing together a row can be done by adding "rows" together until the 
aggregate quote count is even


*/


function parseCSV(data) {
	data=cleanString(data);	// gets rid of excel junk chars
	var fres=[];
	

	var endline='\n';
	if(data.indexOf('\r\n') != -1) {
		endline='\r\n';		//windows
	} else {
		if(data.indexOf('\r') != -1) {
			endline='\r';		//windows	
		}		
	}
	var q_cnt;
	var lastrow='';
	var row2check='';
	data.split(endline).forEach(function (row) {
		
		if(row != "") {
			row2check=lastrow +row;
			if(row2check.match(/"/g)==null) {
				q_cnt=0;
			} else {
				q_cnt = row2check.match(/"/g).length;
			}
			if (parseInt(q_cnt)/2 == Math.trunc(parseInt(q_cnt)/2)) {
				// add next line and try again
			
			  if(rowparse(row2check) != "") {
				fres.push(rowparse(row2check));
			  }
			  row2check='';
			  lastrow='';
			} else {
				lastrow = row2check + '\n'; 
				row2check='';
			}
		} else {
			lastrow += '\n';
		}

	});
		
   return fres;
}

var injparse= parseCSV;

