var express = require('express');
var router = express.Router();
const crypto = require('crypto');
const axios = require('axios').default;

////////////////////////////Config///////////////////////////////////

const CommonConfig = dicontainer.get( "CommonConfig" );
const apikey = CommonConfig.Blockchain.apikey_validator;
const secret = CommonConfig.Blockchain.secret_validator;
const ownerWalletAddress = CommonConfig.Blockchain.ownerWalletAddress_validator;
const ownerWalletSecret = CommonConfig.Blockchain.ownerWalletSecret_validator;
const contractId = CommonConfig.Blockchain.contractId_validator;

////////////////////////////sign TX///////////////////////////////////

function jsonToQueryString(json, path) {
    if (json && Object.keys(json).length > 0) {
        return (path.indexOf('?') == -1 ? '?' : '&') +
            Object.keys(json).map(function (key) {
                // return encodeURIComponent(key) + '=' + encodeURIComponent(json[key]);
                return key + '=' + json[key];
            }).join('&');
    } else {
        return '';
    }

}

async function callAPI(method, path, params) {
    const nonce = crypto.randomBytes(16).toString('hex').slice(4, 12);
    const timestamp = Date.now();

    const orderedParams = {};
    if (params) {
        Object.keys(params).sort().forEach(function(key) {
            orderedParams[key] = params[key];
        });
    }

    const signatureBase = `${nonce}${timestamp}${method}${path}${jsonToQueryString(orderedParams, path)}`;
    // console.log(signatureBase);

    const signature = crypto.createHmac('sha512', secret)
        .update(signatureBase)
        .digest('base64');

    // console.log(signature);

    const headers = {
        'service-api-key': apikey,
        'nonce': nonce,
        'timestamp': timestamp,
        'signature': signature

    };

    const config= {
        method: method,
        url: path,
        baseURL: "https://test-api.blockchain.line.me", 
        headers: headers,
        data: orderedParams
    };

    try {
        let result = await axios.request(config);
            console.log("성공",result.data.responseData)
            return result.data.responseData;
    } catch (err) {
        if (err.response) {
            console.error(err.response.status, err.response.statusText);
            console.log(err.response.data);
            console.log(err.response.headers);
            console.log(err.response.config);
        } else {
            console.log(err);
        }
    }
}

/////////////////////////REST API -get//////////////////////


router.get('/retreive/', async function(req,res,next){
    let tokenType = 10000001;//레벨에따른 type변화
    path = `/v1/item-tokens/${contractId}/non-fungibles/${tokenType}`;
    // the request body should be added after keys are sorted in the ascending order.
    let raw_data = await callAPI('GET', path);
    let data = raw_data.token[0];
    res.send({"data": data});
});

router.get('/retreive_prize/', async function(req,res,next){
    let tokenType = '10000001';
    let tokenIndex = '00000001';
    path = `v1/item-tokens/${contractId}/non-fungibles/${tokenType}/${tokenIndex}/children`;
    // the request body should be added after keys are sorted in the ascending order.
    let raw_data = await callAPI('GET', path);
    res.send({"prizename":raw_data[0].name, "prizeindex":raw_data[0].tokenId, "createdAt":raw_data[0].createdAt, "meta":raw_data[0].meta});
});

router.get('/retreive_all_level1/', async function(req,res,next){
    let tokenType = '10000001';
    path = `/v1/item-tokens/${contractId}/non-fungibles/${tokenType}`;
    // the request body should be added after keys are sorted in the ascending order.
    let raw_data = await callAPI('GET', path);
    res.send({"prizename":raw_data[0].name, "prizeindex":raw_data[0].tokenId, "createdAt":raw_data[0].createdAt, "meta":raw_data[0].meta});
});

router.get('/retreive_all_level1/', async function(req,res,next){
    let tokenType = '10000001';
    path = `/v1/item-tokens/${contractId}/non-fungibles/${tokenType}`;
    // the request body should be added after keys are sorted in the ascending order.
    let raw_data = await callAPI('GET', path);
    res.send({"id1" : raw_data.token[0],"id2" : raw_data.token[1], "id3" : raw_data.token[2], "id4" : raw_data.token[3], "id5" : raw_data.token[4]});
});

router.get('/address_explorer', async function(req,res,next){
    let walletAddress = ownerWalletAddress; 
    res.send({"data":`https://explorer.blockchain.line.me/cashew/address/${walletAddress}`});
})
//추후 DB에 TX값 저장한 후 리턴
router.get('/prize_explorer', async function(req,res,next){ 
    let tx = '18B276DCDE2926C569D67C83E8E266377CACB25CBA8D7E113BC85A91E7A0B40B'
    res.send({"data":`https://explorer.blockchain.line.me/cashew/transaction/${tx}`});
})

router.get('/address_explorer', async function(req,res,next){
    let tx = '38A21661B1DFBDD6FC648CBF65F40F70638A813A2BF312FE4708A29EC72A90C5'
    res.send({"data":`https://explorer.blockchain.line.me/cashew/transaction/${tx}`});
})

router.get('/level_explorer', async function(req,res,next){
    let tx = 'DC4A7EBA6C15F4D67CEF7429A3E776B7A8604D09220AF964E2CDBAC64190769B'
    res.send({"data":`https://explorer.blockchain.line.me/cashew/transaction/${tx}`});
})

/////////////////////////REST API -POST//////////////////////


router.post('/mint/', async function(req,res,next){ //검증인 ID 최초 생성

   let tokenType = 10000001;
   let toAddress = "tlink1ka77g4jt5eery5m8fyz85rs4ys4rl783euec64";
   let validator_info = 'leeSG@blimit.com';
   let tokenIdNname = 'LeeSG';
   path = `/v1/item-tokens/${contractId}/non-fungibles/${tokenType}/mint`;
   // the request body should be added after keys are sorted in the ascending order.
   let data = await callAPI('POST', path, {
       "ownerAddress": ownerWalletAddress,
       "ownerSecret": ownerWalletSecret,
       "name": tokenIdNname,
       "toAddress": toAddress,
       "meta" : validator_info
   });
   res.send({"data":data});
});

//////////////////////////////관리자 권한들-백엔드(백오피스) 에서만 실행////////////////////////////////////////////////////////
    async function attach_nft(){
        let tokenType = '10000002';
        let tokenIndex = '00000001';
        let parentTokenId = '1000000100000001';

        path = `/v1/item-tokens/${contractId}/non-fungibles/${tokenType}/${tokenIndex}/parent`;
        // the request body should be added after keys are sorted in the ascending order.
        let data = await callAPI('POST', path, {
            "parentTokenId": parentTokenId,
            "serviceWalletAddress": ownerWalletAddress,
            "serviceWalletSecret": ownerWalletSecret,
            "tokenHolderAddress": ownerWalletAddress
        })
    };

    async function mint_nft_prize(){
        let tokenType = 10000002;
        let toAddress = ownerWalletAddress;
        let validator_info = '2020년 12월 고객만족도 1위 검증가';
        let tokenIdNname = 'BestValidator2020';
        path = `/v1/item-tokens/${contractId}/non-fungibles/${tokenType}/mint`;
        // the request body should be added after keys are sorted in the ascending order.
        let data = await callAPI('POST', path, {
            "ownerAddress": ownerWalletAddress,
            "ownerSecret": ownerWalletSecret,
            "name": tokenIdNname,
            "toAddress": toAddress,
            "meta" : validator_info
        });
        console.log(data);
    }

    async function create_nft(){
        let tokenType = 10000001;
        let tokenIdNname = 'Team0221';
        let info = '신발전문 검증자들로 구성되어 있습니다.';
        let toAddress = "tlink1tefs8lma3zwcsxl4qa4gq0r8fqvm30qh8jdem2";
        path = `/v1/item-tokens/${contractId}/non-fungibles/${tokenType}/mint`;
        // the request body should be added after keys are sorted in the ascending order.
        await callAPI('POST', path, {
            "ownerAddress": ownerWalletAddress,
            "ownerSecret": ownerWalletSecret,
            "name": tokenIdNname,
            "toAddress": toAddress,
            "meta" : info 
        });
    };

    async function update_nft(){
        let tokenType = '10000001';
        let tokenIndex = '00000001';
        path = `/v1/item-tokens/${contractId}/non-fungibles/${tokenType}/${tokenIndex}`;
        let newmeta = "gold"
        await callAPI('PUT',path, {
            "meta": newmeta,
            "ownerAddress": ownerWalletAddress,
            "ownerSecret": ownerWalletSecret
        })
    }
    
    // (async function () { 
    //    // attach_nft();
    //    // mint_nft_prize();
    //    // update_nft();
    //    let tokenType = 10000001;
    //    let toAddress = "tlink1ka77g4jt5eery5m8fyz85rs4ys4rl783euec64";
    //    let validator_info = 'leeSG@blimit.com';
    //    let tokenIdNname = 'LeeSG';
    //    path = `/v1/item-tokens/${contractId}/non-fungibles/${tokenType}/mint`;
    //    // the request body should be added after keys are sorted in the ascending order.
    //    let data = await callAPI('POST', path, {
    //        "ownerAddress": ownerWalletAddress,
    //        "ownerSecret": ownerWalletSecret,
    //        "name": tokenIdNname,
    //        "toAddress": toAddress,
    //        "meta" : validator_info
    //    });
    //    console.log(data)

    // })()
    router.get('/get_transfer/', async function(req,res,next){
        let walletAddress = ownerWalletAddress; 
        path  = `/v1/wallets/${walletAddress}/transactions`
        let raw_data = await callAPI('GET', path, {
            "msgType" : "collection/MsgTransferNFT"
        });
        let result_data_tx = [];
        let result_data_timestamp = [];
        for(i=0;i<raw_data.length;i++){
            let timestamp = raw_data[i].timestamp;
            let txhash = raw_data[i].txhash;
            
            let blockLink = `https://explorer.blockchain.line.me/cashew/transaction/${txhash}`
            result_data_tx.push(blockLink);
            result_data_timestamp.push(timestamp);
        }
        res.send({result_data_tx,result_data_timestamp})
    } )
    
module.exports = router;