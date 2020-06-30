var sel      = require('selenium-webdriver');
var perfectoReporting = require('perfecto-reporting');
let describeWithPerfecto = require('../PerReportHelper.js'); // include Perfecto reporter helper
var drv;
describeWithPerfecto( "ios-native",     // PerfectoReportingDescribe
    'iOS caculator tests',  // suite name
b=>{drv=b.drv;rpt=b.rpt;},  //callback to launch webdriver and perfectoreporting client
function(){
          test(' test and verify 1 + 2 = 3',  async function() {
            await rpt.testStart('test and verify 1 + 2 = 3')
            try {
                await drv.findElement(sel.By.xpath('//*[@label="1"]')).click();
                await drv.findElement(sel.By.xpath('//*[@label="add"]')).click();
                await drv.findElement(sel.By.xpath('//*[@label="2"]')).click();
                await drv.findElement(sel.By.xpath('//*[@label="equals"]')).click();
                var result = await drv.findElement(sel.By.xpath('//*[@label="Result"]')).getText();
                await rpt.reportiumAssert("Verify result", result == "3")
              await rpt.testStop({status: perfectoReporting.Constants.results.passed});
            } catch (error) {
                await rpt.testStop({status: perfectoReporting.Constants.results.failed, message: error.message});
                throw error;
            }   
          });
}

);



