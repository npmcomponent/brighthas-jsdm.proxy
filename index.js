var sockets = require("socket.io-client");
var uuid = require("uuid");
var Emit  = require("emitter");

function Proxy(socket,domainName){
    this._domainName = domainName;
    this._socket = socket;
    var emitter =  this._emitter = new Emit;

    // for query
    var emitter2 = this._emitter2 = new Emit;

    this._socket.on(this._domainName+"-query-result",function(rs){
        emitter2.emit(rs.qid,rs.data);
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
        
        exec:function(commandName,args){
            this.socket.emit(this._domainName+"-exec",{commandName:commandName,args:args});
        },
        
        call:function(methodName,id,args){
            this.socket.emit(this._domainName+"-call",{methodName:methodName,id:id,args:args});
        }
        
}
    
module.exports  =  Proxy;

