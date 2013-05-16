var sockets = require("socket.io-client");
var uuid = require("uuid");
var Emit  = require("emitter");

function Proxy(socket,domainName){
    this._domainName = domainName;
    this._socket = socket;
    var emitter =  this._emitter = new Emit;

    // for query
    var emitter2 = this._emitter2 = new Emit;

    // for exec
    var emitter3 = this._emitter3 = new Emit;

    // for call
    var emitter4 =  this._emitter4 = new Emit;

    this._socket.on(this._domainName+"-query-result",function(rs){
        emitter2.emit.apply(emitter2,rs);
    })


    this._socket.on(this._domainName+"-exec-result",function(rs){
        emitter3.emit.apply(emitter3,rs);
    })


    this._socket.on(this._domainName+"-call-result",function(rs){
        emitter4.emit.apply(emitter4,rs);
    })

    this._socket.on(this._domainName+"-emit",function(event){
        emitter.emit.apply(emitter,event);
    })

}

Proxy.prototype = {

        query:function(queryName,args,callback){

            var qid = uuid();
            this._emitter2.once(qid,callback);
            this._socket.emit(this._domainName+"-query",{qid:qid,queryName:queryName,args:args});

        },

        on:function(eventname,callback){
            this.emitter.on(eventname,callback);
            this.socket.emit(this._domainName+"-on",eventname);
        },

        once:function(eventname,callback){
            this.emitter.once(eventname,callback);
            this.socket.emit(this._domainName+"-once",eventname);
        },
        
        exec:function(commandName,args,callback){
            var commandId = uuid();
            this._emitter3.once(commandId,callback);
            this.socket.emit(this._domainName+"-exec",{commandId:commandId,commandName:commandName,args:args});
        },
        
        call:function(methodName,id,args,callback){
            var callId = uuid();
            this._emitter4.once(callId,callback);
            this.socket.emit(this._domainName+"-call",{callId:callId,methodName:methodName,id:id,args:args});
        }
        
}
    
module.exports  =  Proxy;

