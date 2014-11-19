url=""https://nhlicenses.nh.gov/MyLicense%20Verification/Search.aspx?facility=Y"
ckfile = tempnam("/tmp", "CURLCOOKIE")
useragent = 'Mozilla/5.0 (Windows; U; Windows NT 6.1; en-US) AppleWebKit/533.2 (KHTML, like Gecko) Chrome/5.0.342.3 Safari/533.2'


f = fopen('log.txt', 'w') #file to write request header for debug purpose

/**
    Get __VIEWSTATE & __EVENTVALIDATION
 */
curlSetOpt(CURLOPT_COOKIEJAR, ckfile)
curlSetOpt(CURLOPT_FOLLOWLOCATION, true)
curlSetOpt(CURLOPT_RETURNTRANSFER, true)
curlSetOpt(CURLOPT_USERAGENT, useragent)

html = getURL(url);

preg_match('~<input type="hidden" name="__VIEWSTATE" id="__VIEWSTATE" value="(.*?)" />~', $html, $viewstate);
preg_match('~<input type="hidden" name="__EVENTVALIDATION" id="__EVENTVALIDATION" value="(.*?)" />~', $html, $eventValidation);

$viewstate = $viewstate[1];
$eventValidation = $eventValidation[1];


curlSetOpt( CURLOPT_URL, url);
curlSetOpt( CURLOPT_SSL_VERIFYPEER, false);
curlSetOpt( CURLOPT_RETURNTRANSFER, false);
curlSetOpt( CURLOPT_COOKIEJAR, $ckfile);
curlSetOpt( CURLOPT_COOKIEFILE, $ckfile);
curlSetOpt( CURLOPT_HEADER, FALSE);
curlSetOpt( CURLOPT_FOLLOWLOCATION, true);
curlSetOpt( CURLOPT_REFERER, url);
curlSetOpt( CURLOPT_VERBOSE, 1);
curlSetOpt( CURLOPT_STDERR, $f);
curlSetOpt( CURLOPT_USERAGENT, $useragent);

// Collecting all POST fields
$postfields = array();
$postfields['__EVENTTARGET'] = "";
$postfields['__EVENTARGUMENT'] = "";
$postfields['__VIEWSTATE'] = $viewstate;
$postfields['__EVENTVALIDATION'] = $eventValidation;
$postfields['ctl00$ctl00$ucMarketPlaceSupportNavigation$txtMPTopSignInEmail'] = $username;
$postfields['ctl00$ctl00$ucMarketPlaceSupportNavigation$txtMPTopSignInPasswordTextNormal'] = "Password";
$postfields['ctl00$ctl00$ucMarketPlaceSupportNavigation$txtMPTopSignInPassword'] = $password;
$postfields['ctl00$ctl00$ucMarketPlaceSupportNavigation$btnSigninTop'] = 'Sign in';
$postfields['ctl00$ctl00$cplhMain$cplhContent$txtEmail'] = 'Email address';
$postfields['ctl00$ctl00$cplhMain$cplhContent$rdlPasswordYes'] = 'Password';
$postfields['ctl00$ctl00$cplhMain$cplhContent$txtPassword'] = '';
$postfields['ctl00$ctl00$cplhMain$cplhContent$hdnEmailDefault'] = 'Email address';
$postfields['ctl00$ctl00$cplhMain$cplhContent$hdnPasswordDefault'] = 'Password';

curlSetOpt( CURLOPT_POST, 1);
curlSetOpt( CURLOPT_POSTFIELDS, $postfields);
$ret = curl_exec($ch); // Get result after login page.

print $ret