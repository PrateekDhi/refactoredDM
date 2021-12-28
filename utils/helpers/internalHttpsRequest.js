const https = require('https');

const config = require('../config').development; 
const definedErrors = require('../../errors');
const ApplicationError = definedErrors.ApplicationError;

const DEFAULT_HEADERS = {
    'Content-Type': 'application/json',
}

const IAM_DEFAULT_HEADERS = {
    'X-API-KEY': config.iam_server_details.apiKey,
}

const DEVELOPER_DEFAULT_HEADERS = {
    // 'X-API-KEY': config.iam_server_details.apiKey,
}

const CORPORATE_DEFAULT_HEADERS = {
    // 'X-API-KEY': config.iam_server_details.apiKey,
}

const IAM_DEFAULT_OPTIONS = {
    protocol: config.iam_server_details.protocol,
    host: config.iam_server_details.host,
    port: config.iam_server_details.port
}

const DEVELOPER_DEFAULT_OPTIONS = {
    // protocol: config.iam_server_details.protocol,
    // host: config.iam_server_details.host,
    // port: config.iam_server_details.port
}

const CORPORATE_DEFAULT_OPTIONS = {
    // protocol: config.iam_server_details.protocol,
    // host: config.iam_server_details.host,
    // port: config.iam_server_details.port
}

module.exports = (server, path, method, additionalHeaders, bodyData) => {
    return new Promise(function(resolve,reject){
        if(!server || !path || !method) {
            const caughtError = new definedErrors.InternalServerError();
            caughtError.setAdditionalDetails("https request helper needs server, path and method, got - server-", server, ", path-", path, ", method-", method);
            return reject(caughtError)
        }
        let headers;
        let options;
        // const postData = JSON.stringify(bodyData);
        //Setting HEADERS
        if(server === 'iam') headers = Object.assign({}, DEFAULT_HEADERS, IAM_DEFAULT_HEADERS, additionalHeaders);
        else if(server === 'developer') headers = Object.assign({}, DEFAULT_HEADERS, DEVELOPER_DEFAULT_HEADERS, additionalHeaders);
        else if(server === 'corporate') headers = Object.assign({}, DEFAULT_HEADERS, CORPORATE_DEFAULT_HEADERS, additionalHeaders);
    
        //Setting HEADER for request with request body
        if(bodyData != null) headers = Object.assign({}, headers, {'Content-Length': Buffer.byteLength(JSON.stringify(bodyData))});
        else headers = Object.assign({}, headers, {'Content-Length': 0});
    
        //Setting OPTIONS
        if(server === 'iam') options = Object.assign({}, IAM_DEFAULT_OPTIONS, {path, method, headers});
        if(server === 'developer') options = Object.assign({}, IAM_DEFAULT_OPTIONS, {path, method, headers});
        if(server === 'corporate') options = Object.assign({}, IAM_DEFAULT_OPTIONS, {path, method, headers});
        if(!headers || !options){
            const caughtError = new definedErrors.InternalServerError();
            caughtError.setAdditionalDetails("Failed to set header and/or options, headers -", headers, ", options -", options);
            return reject(caughtError)
        }
        const reqs = https.request(options, function(resp){
            let body = '';
            // console.log('STATUS: ' + resp.statusCode);
            // console.log('HEADERS: ' + JSON.stringify(res.headers));
            resp.setEncoding('utf8');
            resp.on('data', function(chunk){
                body += chunk.toString();
                // console.log('BODY: '+body);
            });
            resp.on('end', function(){
                //No more data in response
                parseAsync(body).then(function(parsedData){
                    parsedData.statusCode = resp.statusCode;  //Because we will also need status code on the caller
                    resolve(parsedData);
                }).catch((err) => reject(err));
            });
        })
        if(bodyData != null) reqs.write(JSON.stringify(bodyData));
    
        reqs.on('error', function(e){
            console.error(`Problem with token validation request: ${e}`);
        });
    
        reqs.end();
    })
}