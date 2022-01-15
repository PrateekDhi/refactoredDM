/**
 *
 * file - corsFix.js - The cors fix file
 *
 * @author     Prateek Shukla
 * @version    0.1.0
 * @created    10/11/2021
 * @copyright  Dhi Technologies
 * @license    For use by Dhi Technologies applications
 *
 * @description - The cors fix functionality used for defined hosts
 *
 *
 * 10/11/2021 - PS - Created
 * @todo To be used when allowed hosts are defined
**/

module.exports = hosts => {
    const isPortPresent = /(https?:\/\/.*):(\d*)\/?(.*)/g;

    return hosts.map(host => {
        // eslint-disable-next-line no-eq-null, eqeqeq
        if (host.includes('https:') && host.match(isPortPresent) == null) {
            return [...host, ':443'];
        }

        // eslint-disable-next-line no-eq-null, eqeqeq
        if (host.includes('http:') && host.match(isPortPresent) == null) {
            return [...host, ':80'];
        }
  
        return host;
    });
}