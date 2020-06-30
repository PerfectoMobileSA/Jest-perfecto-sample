var sel      = require('selenium-webdriver');
var perfectoReporting = require('perfecto-reporting');
var config = require('./config.json')

// Helper function to launch and provide browser object and reporting client for our test cases. Usage
//
//  describeWithPerfecto(
//   'capName'
//   'name'
//  )
//
module.exports = function describeWithPerfecto(capName, name, callback, body) {
  let browser;
  let reportingClient;
  describe(name, function() {
    jest.setTimeout(50000);
    // as we using beforeEach here, new browser will be received for every test case
    beforeEach(async function() {
            try{
              // Setting the capabilities based on the 
                const capabilities = {
                    'platformName' : config[capName].platformName,
                    'model' : config[capName].model,
                    'platformVersion':config[capName].platformVersion,
                    'bundleId' : config[capName].bundleId, //your app bundle id
                    'browserName' : config[capName].browserName,
                    'browserVersion' : config[capName].browserVersion,
                    'location': config[capName].location,
                    'resolution': config[capName].resolution,
                    'securityToken' : process.env.token, //Replace process.env.token your securityToken 'eyJhbGciOiJIUz....'
                    'takesScreenshot' : config[capName].takesScreenshot
                  }
                    //launch the remoteWebDriver
                    var REMOTE_URL = 'https://'+process.env.cloudName+'.perfectomobile.com/nexperience/perfectomobile/wd/hub/fast'; //Replace process.env.cloudName with your demo 'demo'
                    browser =  await  new sel.Builder().withCapabilities(capabilities).usingServer(REMOTE_URL).build();
                    await browser.manage().setTimeouts({implicit:20000});
                    var perfectoExecutionContext =  
                        await new perfectoReporting.Perfecto.PerfectoExecutionContext({
                            webdriver: browser,
                            //set the CI job name and CI job number, replace process.env.jobName with jobname 'MyJobName' and process.env.jobNumber with jobnumber '1'
                            job: {jobName: process.env.jobName,buildNumber:parseInt(process.env.jobNumber)},
                            //Set the tags
                            tags: ['Jest-Perfecto', 'JestSample']
                        }
                    );
                    reportingClient = 
                        await new perfectoReporting.Perfecto.PerfectoReportingClient(perfectoExecutionContext);
    
             }catch(e)
            {
                console.log(e);
            }
            r={};
            r.drv=browser;
            r.rpt=reportingClient;
      callback(r);
    });

    body();

    // we should shut down browser when we don't need it anymore, in order to avoid
    // dead sessions. Always ensure that you are ending your session in the test end!
    afterEach(function() {
      return browser.quit();
    });
  });
};