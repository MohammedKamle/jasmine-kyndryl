const webdriver = require('selenium-webdriver');
// Input capabilities
var username = process.env.BROWSERSTACK_USERNAME;
var accessKey = process.env.BROWSERSTACK_ACCESS_KEY;
var buildName = process.env.BROWSERSTACK_BUILD_NAME;


const capabilities = {
    'device': 'iPhone 6',
    'realMobile': 'true',
    'os_version': '11',
    'browserName': 'iPhone',
    'name': 'BStack-[NodeJS] Sample Test', // test name
    'build': buildName // CI/CD job or build name
}
async function runTestWithCaps() {
    let driver = new webdriver.Builder()
        .usingServer('http://' + username + ':' + accessKey + '@hub-cloud.browserstack.com/wd/hub')
        .withCapabilities(capabilities)
        .build();
    await driver.get("http://www.google.com");
    const inputField = await driver.findElement(webdriver.By.name("q"));
    await inputField.sendKeys("BrowserStack", webdriver.Key.ENTER); // this submits on desktop browsers
    try {
        await driver.wait(webdriver.until.titleMatches(/BrowserStack/i), 5000);
    } catch (e) {
        await inputField.submit(); // this helps in mobile browsers
    }
    try {
        await driver.wait(webdriver.until.titleMatches(/BrowserStack/i), 5000);
        console.log(await driver.getTitle());
        await driver.executeScript(
            'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"passed","reason": "Title contains BrowserStack!"}}'
        );
    } catch (e) {
        await driver.executeScript(
            'browserstack_executor: {"action": "setSessionStatus", "arguments": {"status":"failed","reason": "Page could not load in time"}}'
        );
    }
    await driver.quit();
}
runTestWithCaps();