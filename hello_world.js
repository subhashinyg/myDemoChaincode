const shim = require('fabric-shim');
const util = require('util');

var Chaincode = class {

     async Init(stub) {
        console.info('========= helloworldchaincode Init =========');
        let ret = stub.getFunctionAndParameters();
        console.info(ret);
        let args = ret.params;

        if (args.length != 2) {
          return shim.error('Incorrect number of arguments. Expecting 2');
        }
        let key = args[0];
        let keyval = args[1];
   
        try {
                await stub.putState(key, Buffer.from(keyval));
                return shim.success();
        }
        catch (err){
                return shim.error(err);
        }
    }

      async Invoke(stub, args) {
        let ret = stub.getFunctionAndParameters();
        console.info(ret);
        let method = this[ret.fcn];
        if (!method) {
                console.error('no method of name:' + ret.fcn + ' found');
                return shim.error('no method of name:' + ret.fcn + ' found');
              }
    
        console.info('\nCalling method : ' + ret.fcn);
        try {
                console.log(method,ret.params);
                let payload = await method(stub, ret.params);
                // console.info(payload);
                return shim.success(payload);
        } catch (err) {
                console.log(err);
                return shim.error(err);
        }
}

        async update(stub,args){

                console.log("this is args",args);
                
                let A = args[0];
                let B = args[1];
                console.log("calling update method");
                console.log(B);
                // if (!B){
                //         jsonRep.error = 'failed to ge state for ' + A;
                //         throw new Error(JSON.stringify(jsonRep));
                // }              
                await stub.putState(A, Buffer.from(B.toString()));

        }
            
      
	
	async query(stub, args) {
                // if (args.length != 1) {
                //   throw new Error('Incorrect number of arguments. Expecting name of the person to query')
                // }
            
                let jsonRep = {};
                let key = args[0];
            
                // Get the state from the ledger
                let keyval = await stub.getState(key);
                if (!keyval) {
                  jsonRep.error = 'Failed to get state for ' + key;
                  throw new Error(JSON.stringify(jsonResp));
                }
                else{
                        jsonRep.name = key;
                        jsonRep.keyval = keyval.toString();
                        console.info("Query Response:", jsonRep);
                        return keyval;
                }

        }
};

shim.start(new Chaincode());
