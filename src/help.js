// Copyright © 10/19/2017 Gary Feutz - All Rights Reserved
//  You may use, distribute and modify this code for charitable use only.
//  This code was developed to assist the Boy Scouts of America

//modifies https://www.scoutbook.com/mobile/help

function rawDataModifyHelp(data, pageid, dataurl) {
    var newdata = '';
    var startfunc;
    //newdata+='		<li data-theme="d" id="listItem2a">\n';
    //newdata+='			<a  href="/mobile/forums/using-scoutbook/86040/suac-scoutbook-faq-and-resources-table-of-contents/" class="noellipsis">\n';
    //newdata+='				Scoutbook User Advisory Council (SUAC) Scoutbook FAQ and Resources Table of Contents\n';
    //newdata+='			</a>\n';
    //newdata+='		</li>\n';	
    newdata += '		<li data-theme="d" id="listItem2b">\n';
    if (ismobile == null) {
        newdata += '	    	<a href="#" id="showOpts" class="showLoading ui-link-inherit">';
    } else {
        newdata += '			<a  href="https://drive.google.com/file/d/0B4bXAHBshADYVUlHV01xTllYM00/view" class="noellipsis">\n';
    }
    newdata += '				Feature Assistant Chrome Extension - Firefox Add-on Help Documents\n';
    newdata += '			</a>\n';
    newdata += '		</li>\n';
    newdata += '		<li data-theme="d" id="listItem2a">\n';
    //newdata+='			<a  href="/mobile/forums/using-scoutbook/111353/feature-assistant-extension/" class="noellipsis">\n';
    newdata += '			<a  href="https://discussions.scouting.org/c/scoutbook/feature-assistant-extension" class="noellipsis">\n';
    newdata += '				Feature Assistant Forum - including change log\n';
    newdata += '			</a>\n';
    newdata += '		</li>\n';
    var liEl = '<li data-theme="d" id="listItem3">';

    startfunc = data.indexOf(liEl);
    data = data.slice(0, startfunc) + newdata + data.slice(startfunc);


    newdata = "		$('#showOpts').click(function() {\n";
    newdata += "			showFAHelp();\n";
    newdata += "		});\n";


    liEl = "$('#helpPage #buttonSearch').click(function () {";

    startfunc = data.indexOf(liEl);
    data = data.slice(0, startfunc) + newdata + data.slice(startfunc);



    return data;
}

// send message to context or background to open options
function showFAHelp() {

    var msgObj = {
        hostx: "oth",
        text: "showHelp"
    };
    if (ismobile == null) {
        window.postMessage(msgObj, "*");
    }

}