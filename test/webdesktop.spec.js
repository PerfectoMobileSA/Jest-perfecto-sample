var sel      = require('selenium-webdriver');
var perfectoReporting = require('perfecto-reporting');
let describeWithPerfecto = require('../PerReportHelper.js'); // include Perfecto reporter helper
var drv;
// PerfectoReportingDescribe
describeWithPerfecto("desktop-web",   //Config name to select capabilities from config.json   
    'Desktop Web tests',  // suite name
b=>{drv=b.drv;rpt=b.rpt;},  //callback to launch webdriver and perfectoreporting client
function(){

        test(' Verify github home page',  async function() {
          
          try {
            await rpt.testStart('Verify github home page')
            await rpt.stepStart('Navigate to URl')
              await drv.get('https://www.github.com')
              await rpt.stepStart('Click Sign up button')
              await drv.findElement(sel.By.css("header[class*='Header-old'] a[data-ga-click*='Sign up']")).click();
              await rpt.stepStart('Verify Username text')
              var result = await drv.findElement(sel.By.css("label[name='user[login]']")).getText()
              await rpt.reportiumAssert("Verify Username", result == "Username")
            await rpt.testStop({status: perfectoReporting.Constants.results.passed});
          } catch (error) {
              await rpt.testStop({status: perfectoReporting.Constants.results.failed, message: error.message});
              throw error;
          }
              
        });
}
);



