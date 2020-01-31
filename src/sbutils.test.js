import * as utils from "./sbutils";
import * as undo from "./undo";

// function procRaw_Dashboard_Admin_Advancement_Adventure(data,thisurl,pageid) {

// 	if(thisurl.match(/dashboard\/admin\/advancement\/adventure\.asp/) != null  || thisurl.match(/dashboard\/admin\/advancement\/meritbadge\.asp/) != null  || thisurl.match(/dashboard\/admin\/awards\/award\.asp/) != null ) {
// 		//var unitID= /UnitID\=(\d+)/.exec(thisurl)[1]; 

// 		data=addRawUndo(data,pageid);
// 	}
// 	return data;	
// }

test('procRaw_Dashboard_Admin_Advancement_Adventure with adventure.asp', () => {
    let data = '<body>test</body>',
        thisurl = 'https://www.scoutbook.com/mobile/dashboard/admin/advancement/adventure.asp',
        pageid = '';
    expect(utils.procRaw_Dashboard_Admin_Advancement_Adventure(data, thisurl, pageid)).toBe(undo.addRawUndo(data));
});

test('procRaw_Dashboard_Admin_Advancement_Adventure with shorter adventure.asp', () => {
    let data = '<body>test</body>',
        thisurl = 'dashboard/admin/advancement/adventure.asp',
        pageid = '';
    expect(utils.procRaw_Dashboard_Admin_Advancement_Adventure(data, thisurl, pageid)).toBe(undo.addRawUndo(data));
});

test('procRaw_Dashboard_Admin_Advancement_Adventure with meritbadge.asp', () => {
    let data = '<body>test</body>',
        thisurl = 'https://www.scoutbook.com/mobile/dashboard/admin/advancement/meritbadge.asp',
        pageid = '';
    expect(utils.procRaw_Dashboard_Admin_Advancement_Adventure(data, thisurl, pageid)).toBe(undo.addRawUndo(data));
});

test('procRaw_Dashboard_Admin_Advancement_Adventure with award.asp', () => {
    let data = '<body>test</body>',
        thisurl = 'https://www.scoutbook.com/mobile/dashboard/admin/awards/award.asp',
        pageid = '';
    expect(utils.procRaw_Dashboard_Admin_Advancement_Adventure(data, thisurl, pageid)).toBe(undo.addRawUndo(data));
});

// I don't know how to check that a function isn't called without creating a mock object, which I don't have a mocking
// framework yet, so I can't create one and test
// test('procRaw_Dashboard_Admin_Advancement_Adventure with not.asp', () => {
//   let data = '<body>test</body>', thisurl = 'https://www.scoutbook.com/mobile/dashboard/admin/awards/not.asp', pageid = '';
//   expect(utils.procRaw_Dashboard_Admin_Advancement_Adventure(data,thisurl,pageid)).not.toBe(undo.addRawUndo(data));
// });