var jq = require("jquery");
var Emit  = require("emitter");
function Proxy(url){
        
        this._emitter = new Emit;
        this._url = url;
        this._events = {};
        var self  =  this;
        
        function loop(){
            setTimeout(function(){
                var esk = Object.keys(self._events);
                
                if(esk.length === 0);
                else{ 

                    jq.post(self._url,{method:"on",events:JSON.stringify(self._events)},function(rs){
                        for(var en in rs){
                            if(self._events[en]){
                                var t = Date.now();
                                self._events[en] = t;
                            }
                            self._emitter.emit.apply(self._emitter,rs[en]);
                            
                        }
                        loop();
                        
                    });
                }    
            },3000);
        }
        
        loop();
    }

    Proxy.prototype = {
    
        on:function(eventname,callback){
            if(eventname in this._events){
            }else{
                this._events[eventname] = Date.now();
            }
            this._emitter.on(eventname,callback);
        },
        
        exec:function(commandName,args,callback){
          jq.post(this._url,{method:"exec",commandName:commandName,args:JSON.stringify(args)},callback)
        },
        
        call:function(methodName,id,args,callback){
          args = args?args:[];
          jq.post(this._url,{method:"call",methodName:methodName,id:id,args:JSON.stringify(args)},callback) 
        },
        
        query:function(name,args,callback){
          jq.post(this._url,{method:"query",queryName:name,args:JSON.stringify(args)},callback);
        },
        
        empty:function(){
            var self = this;
            this._events = {};
            var ks = Object.keys(this._events);
            ks.forEach(function(k){
                self._emitter.off(k);
            })
        },
        
        off:function(){
            this._emitter.off.apply(this._emitter,arguments);
        }
        
}
    
module.exports  =  Proxy;

