
(function(modules){var installedModules={};function __webpack_require__(moduleId){if(installedModules[moduleId]){return installedModules[moduleId].exports;}
var module=installedModules[moduleId]={i:moduleId,l:false,exports:{}};modules[moduleId].call(module.exports,module,module.exports,__webpack_require__);module.l=true;return module.exports;}
__webpack_require__.m=modules;__webpack_require__.c=installedModules;__webpack_require__.i=function(value){return value;};__webpack_require__.d=function(exports,name,getter){if(!__webpack_require__.o(exports,name)){Object.defineProperty(exports,name,{configurable:false,enumerable:true,get:getter});}};__webpack_require__.n=function(module){var getter=module&&module.__esModule?function getDefault(){return module['default'];}:function getModuleExports(){return module;};__webpack_require__.d(getter,'a',getter);return getter;};__webpack_require__.o=function(object,property){return Object.prototype.hasOwnProperty.call(object,property);};__webpack_require__.p="";return __webpack_require__(__webpack_require__.s=74);})
([(function(module,exports,__webpack_require__){;(function(root,factory){if(true){module.exports=exports=factory();}
else if(typeof define==="function"&&define.amd){define([],factory);}
else{root.CryptoJS=factory();}}(this,function(){var CryptoJS=CryptoJS||(function(Math,undefined){var create=Object.create||(function(){function F(){};return function(obj){var subtype;F.prototype=obj;subtype=new F();F.prototype=null;return subtype;};}())
var C={};var C_lib=C.lib={};var Base=C_lib.Base=(function(){return{extend:function(overrides){var subtype=create(this);if(overrides){subtype.mixIn(overrides);}
if(!subtype.hasOwnProperty('init')||this.init===subtype.init){subtype.init=function(){subtype.$super.init.apply(this,arguments);};}
subtype.init.prototype=subtype;subtype.$super=this;return subtype;},create:function(){var instance=this.extend();instance.init.apply(instance,arguments);return instance;},init:function(){},mixIn:function(properties){for(var propertyName in properties){if(properties.hasOwnProperty(propertyName)){this[propertyName]=properties[propertyName];}}
if(properties.hasOwnProperty('toString')){this.toString=properties.toString;}},clone:function(){return this.init.prototype.extend(this);}};}());var WordArray=C_lib.WordArray=Base.extend({init:function(words,sigBytes){words=this.words=words||[];if(sigBytes!=undefined){this.sigBytes=sigBytes;}else{this.sigBytes=words.length*4;}},toString:function(encoder){return(encoder||Hex).stringify(this);},concat:function(wordArray){var thisWords=this.words;var thatWords=wordArray.words;var thisSigBytes=this.sigBytes;var thatSigBytes=wordArray.sigBytes;this.clamp();if(thisSigBytes%4){for(var i=0;i<thatSigBytes;i++){var thatByte=(thatWords[i>>>2]>>>(24-(i%4)*8))&0xff;thisWords[(thisSigBytes+i)>>>2]|=thatByte<<(24-((thisSigBytes+i)%4)*8);}}else{for(var i=0;i<thatSigBytes;i+=4){thisWords[(thisSigBytes+i)>>>2]=thatWords[i>>>2];}}
this.sigBytes+=thatSigBytes;return this;},clamp:function(){var words=this.words;var sigBytes=this.sigBytes;words[sigBytes>>>2]&=0xffffffff<<(32-(sigBytes%4)*8);words.length=Math.ceil(sigBytes/4);},clone:function(){var clone=Base.clone.call(this);clone.words=this.words.slice(0);return clone;},random:function(nBytes){var words=[];var r=(function(m_w){var m_w=m_w;var m_z=0x3ade68b1;var mask=0xffffffff;return function(){m_z=(0x9069*(m_z&0xFFFF)+(m_z>>0x10))&mask;m_w=(0x4650*(m_w&0xFFFF)+(m_w>>0x10))&mask;var result=((m_z<<0x10)+m_w)&mask;result/=0x100000000;result+=0.5;return result*(Math.random()>.5?1:-1);}});for(var i=0,rcache;i<nBytes;i+=4){var _r=r((rcache||Math.random())*0x100000000);rcache=_r()*0x3ade67b7;words.push((_r()*0x100000000)|0);}
return new WordArray.init(words,nBytes);}});var C_enc=C.enc={};var Hex=C_enc.Hex={stringify:function(wordArray){var words=wordArray.words;var sigBytes=wordArray.sigBytes;var hexChars=[];for(var i=0;i<sigBytes;i++){var bite=(words[i>>>2]>>>(24-(i%4)*8))&0xff;hexChars.push((bite>>>4).toString(16));hexChars.push((bite&0x0f).toString(16));}
return hexChars.join('');},parse:function(hexStr){var hexStrLength=hexStr.length;var words=[];for(var i=0;i<hexStrLength;i+=2){words[i>>>3]|=parseInt(hexStr.substr(i,2),16)<<(24-(i%8)*4);}
return new WordArray.init(words,hexStrLength/2);}};var Latin1=C_enc.Latin1={stringify:function(wordArray){var words=wordArray.words;var sigBytes=wordArray.sigBytes;var latin1Chars=[];for(var i=0;i<sigBytes;i++){var bite=(words[i>>>2]>>>(24-(i%4)*8))&0xff;latin1Chars.push(String.fromCharCode(bite));}
return latin1Chars.join('');},parse:function(latin1Str){var latin1StrLength=latin1Str.length;var words=[];for(var i=0;i<latin1StrLength;i++){words[i>>>2]|=(latin1Str.charCodeAt(i)&0xff)<<(24-(i%4)*8);}
return new WordArray.init(words,latin1StrLength);}};var Utf8=C_enc.Utf8={stringify:function(wordArray){try{return decodeURIComponent(escape(Latin1.stringify(wordArray)));}catch(e){throw new Error('Malformed UTF-8 data');}},parse:function(utf8Str){return Latin1.parse(unescape(encodeURIComponent(utf8Str)));}};var BufferedBlockAlgorithm=C_lib.BufferedBlockAlgorithm=Base.extend({reset:function(){this._data=new WordArray.init();this._nDataBytes=0;},_append:function(data){if(typeof data=='string'){data=Utf8.parse(data);}
this._data.concat(data);this._nDataBytes+=data.sigBytes;},_process:function(doFlush){var data=this._data;var dataWords=data.words;var dataSigBytes=data.sigBytes;var blockSize=this.blockSize;var blockSizeBytes=blockSize*4;var nBlocksReady=dataSigBytes/blockSizeBytes;if(doFlush){nBlocksReady=Math.ceil(nBlocksReady);}else{nBlocksReady=Math.max((nBlocksReady|0)-this._minBufferSize,0);}
var nWordsReady=nBlocksReady*blockSize;var nBytesReady=Math.min(nWordsReady*4,dataSigBytes);if(nWordsReady){for(var offset=0;offset<nWordsReady;offset+=blockSize){this._doProcessBlock(dataWords,offset);}
var processedWords=dataWords.splice(0,nWordsReady);data.sigBytes-=nBytesReady;}
return new WordArray.init(processedWords,nBytesReady);},clone:function(){var clone=Base.clone.call(this);clone._data=this._data.clone();return clone;},_minBufferSize:0});var Hasher=C_lib.Hasher=BufferedBlockAlgorithm.extend({cfg:Base.extend(),init:function(cfg){this.cfg=this.cfg.extend(cfg);this.reset();},reset:function(){BufferedBlockAlgorithm.reset.call(this);this._doReset();},update:function(messageUpdate){this._append(messageUpdate);this._process();return this;},finalize:function(messageUpdate){if(messageUpdate){this._append(messageUpdate);}
var hash=this._doFinalize();return hash;},blockSize:512/32,_createHelper:function(hasher){return function(message,cfg){return new hasher.init(cfg).finalize(message);};},_createHmacHelper:function(hasher){return function(message,key){return new C_algo.HMAC.init(hasher,key).finalize(message);};}});var C_algo=C.algo={};return C;}(Math));return CryptoJS;}));}),(function(module,exports,__webpack_require__){;(function(root,factory){if(true){module.exports=exports=factory(__webpack_require__(0));}
else if(typeof define==="function"&&define.amd){define(["./core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){CryptoJS.lib.Cipher||(function(undefined){var C=CryptoJS;var C_lib=C.lib;var Base=C_lib.Base;var WordArray=C_lib.WordArray;var BufferedBlockAlgorithm=C_lib.BufferedBlockAlgorithm;var C_enc=C.enc;var Utf8=C_enc.Utf8;var Base64=C_enc.Base64;var C_algo=C.algo;var EvpKDF=C_algo.EvpKDF;var Cipher=C_lib.Cipher=BufferedBlockAlgorithm.extend({cfg:Base.extend(),createEncryptor:function(key,cfg){return this.create(this._ENC_XFORM_MODE,key,cfg);},createDecryptor:function(key,cfg){return this.create(this._DEC_XFORM_MODE,key,cfg);},init:function(xformMode,key,cfg){this.cfg=this.cfg.extend(cfg);this._xformMode=xformMode;this._key=key;this.reset();},reset:function(){BufferedBlockAlgorithm.reset.call(this);this._doReset();},process:function(dataUpdate){this._append(dataUpdate);return this._process();},finalize:function(dataUpdate){if(dataUpdate){this._append(dataUpdate);}
var finalProcessedData=this._doFinalize();return finalProcessedData;},keySize:128/32,ivSize:128/32,_ENC_XFORM_MODE:1,_DEC_XFORM_MODE:2,_createHelper:(function(){function selectCipherStrategy(key){if(typeof key=='string'){return PasswordBasedCipher;}else{return SerializableCipher;}}
return function(cipher){return{encrypt:function(message,key,cfg){return selectCipherStrategy(key).encrypt(cipher,message,key,cfg);},decrypt:function(ciphertext,key,cfg){return selectCipherStrategy(key).decrypt(cipher,ciphertext,key,cfg);}};};}())});var StreamCipher=C_lib.StreamCipher=Cipher.extend({_doFinalize:function(){var finalProcessedBlocks=this._process(!!'flush');return finalProcessedBlocks;},blockSize:1});var C_mode=C.mode={};var BlockCipherMode=C_lib.BlockCipherMode=Base.extend({createEncryptor:function(cipher,iv){return this.Encryptor.create(cipher,iv);},createDecryptor:function(cipher,iv){return this.Decryptor.create(cipher,iv);},init:function(cipher,iv){this._cipher=cipher;this._iv=iv;}});var CBC=C_mode.CBC=(function(){var CBC=BlockCipherMode.extend();CBC.Encryptor=CBC.extend({processBlock:function(words,offset){var cipher=this._cipher;var blockSize=cipher.blockSize;xorBlock.call(this,words,offset,blockSize);cipher.encryptBlock(words,offset);this._prevBlock=words.slice(offset,offset+blockSize);}});CBC.Decryptor=CBC.extend({processBlock:function(words,offset){var cipher=this._cipher;var blockSize=cipher.blockSize;var thisBlock=words.slice(offset,offset+blockSize);cipher.decryptBlock(words,offset);xorBlock.call(this,words,offset,blockSize);this._prevBlock=thisBlock;}});function xorBlock(words,offset,blockSize){var iv=this._iv;if(iv){var block=iv;this._iv=undefined;}else{var block=this._prevBlock;}
for(var i=0;i<blockSize;i++){words[offset+i]^=block[i];}}
return CBC;}());var C_pad=C.pad={};var Pkcs7=C_pad.Pkcs7={pad:function(data,blockSize){var blockSizeBytes=blockSize*4;var nPaddingBytes=blockSizeBytes-data.sigBytes%blockSizeBytes;var paddingWord=(nPaddingBytes<<24)|(nPaddingBytes<<16)|(nPaddingBytes<<8)|nPaddingBytes;var paddingWords=[];for(var i=0;i<nPaddingBytes;i+=4){paddingWords.push(paddingWord);}
var padding=WordArray.create(paddingWords,nPaddingBytes);data.concat(padding);},unpad:function(data){var nPaddingBytes=data.words[(data.sigBytes-1)>>>2]&0xff;data.sigBytes-=nPaddingBytes;}};var BlockCipher=C_lib.BlockCipher=Cipher.extend({cfg:Cipher.cfg.extend({mode:CBC,padding:Pkcs7}),reset:function(){Cipher.reset.call(this);var cfg=this.cfg;var iv=cfg.iv;var mode=cfg.mode;if(this._xformMode==this._ENC_XFORM_MODE){var modeCreator=mode.createEncryptor;}else{var modeCreator=mode.createDecryptor;this._minBufferSize=1;}
this._mode=modeCreator.call(mode,this,iv&&iv.words);},_doProcessBlock:function(words,offset){this._mode.processBlock(words,offset);},_doFinalize:function(){var padding=this.cfg.padding;if(this._xformMode==this._ENC_XFORM_MODE){padding.pad(this._data,this.blockSize);var finalProcessedBlocks=this._process(!!'flush');}else{var finalProcessedBlocks=this._process(!!'flush');padding.unpad(finalProcessedBlocks);}
return finalProcessedBlocks;},blockSize:128/32});var CipherParams=C_lib.CipherParams=Base.extend({init:function(cipherParams){this.mixIn(cipherParams);},toString:function(formatter){return(formatter||this.formatter).stringify(this);}});var C_format=C.format={};var OpenSSLFormatter=C_format.OpenSSL={stringify:function(cipherParams){var ciphertext=cipherParams.ciphertext;var salt=cipherParams.salt;if(salt){var wordArray=WordArray.create([0x53616c74,0x65645f5f]).concat(salt).concat(ciphertext);}else{var wordArray=ciphertext;}
return wordArray.toString(Base64);},parse:function(openSSLStr){var ciphertext=Base64.parse(openSSLStr);var ciphertextWords=ciphertext.words;if(ciphertextWords[0]==0x53616c74&&ciphertextWords[1]==0x65645f5f){var salt=WordArray.create(ciphertextWords.slice(2,4));ciphertextWords.splice(0,4);ciphertext.sigBytes-=16;}
return CipherParams.create({ciphertext:ciphertext,salt:salt});}};var SerializableCipher=C_lib.SerializableCipher=Base.extend({cfg:Base.extend({format:OpenSSLFormatter}),encrypt:function(cipher,message,key,cfg){cfg=this.cfg.extend(cfg);var encryptor=cipher.createEncryptor(key,cfg);var ciphertext=encryptor.finalize(message);var cipherCfg=encryptor.cfg;return CipherParams.create({ciphertext:ciphertext,key:key,iv:cipherCfg.iv,algorithm:cipher,mode:cipherCfg.mode,padding:cipherCfg.padding,blockSize:cipher.blockSize,formatter:cfg.format});},decrypt:function(cipher,ciphertext,key,cfg){cfg=this.cfg.extend(cfg);ciphertext=this._parse(ciphertext,cfg.format);var plaintext=cipher.createDecryptor(key,cfg).finalize(ciphertext.ciphertext);return plaintext;},_parse:function(ciphertext,format){if(typeof ciphertext=='string'){return format.parse(ciphertext,this);}else{return ciphertext;}}});var C_kdf=C.kdf={};var OpenSSLKdf=C_kdf.OpenSSL={execute:function(password,keySize,ivSize,salt){if(!salt){salt=WordArray.random(64/8);}
var key=EvpKDF.create({keySize:keySize+ivSize}).compute(password,salt);var iv=WordArray.create(key.words.slice(keySize),ivSize*4);key.sigBytes=keySize*4;return CipherParams.create({key:key,iv:iv,salt:salt});}};var PasswordBasedCipher=C_lib.PasswordBasedCipher=SerializableCipher.extend({cfg:SerializableCipher.cfg.extend({kdf:OpenSSLKdf}),encrypt:function(cipher,message,password,cfg){cfg=this.cfg.extend(cfg);var derivedParams=cfg.kdf.execute(password,cipher.keySize,cipher.ivSize);cfg.iv=derivedParams.iv;var ciphertext=SerializableCipher.encrypt.call(this,cipher,message,derivedParams.key,cfg);ciphertext.mixIn(derivedParams);return ciphertext;},decrypt:function(cipher,ciphertext,password,cfg){cfg=this.cfg.extend(cfg);ciphertext=this._parse(ciphertext,cfg.format);var derivedParams=cfg.kdf.execute(password,cipher.keySize,cipher.ivSize,ciphertext.salt);cfg.iv=derivedParams.iv;var plaintext=SerializableCipher.decrypt.call(this,cipher,ciphertext,derivedParams.key,cfg);return plaintext;}});}());}));}),(function(module,exports,__webpack_require__){var BigNumber=__webpack_require__(23);var sha3=__webpack_require__(24);var utf8=__webpack_require__(53);var unitMap={'noether':'0','wei':'1','kwei':'1000','Kwei':'1000','babbage':'1000','femtoether':'1000','mwei':'1000000','Mwei':'1000000','lovelace':'1000000','picoether':'1000000','gwei':'1000000000','Gwei':'1000000000','shannon':'1000000000','nanoether':'1000000000','nano':'1000000000','szabo':'1000000000000','microether':'1000000000000','micro':'1000000000000','finney':'1000000000000000','milliether':'1000000000000000','milli':'1000000000000000','ether':'1000000000000000000','kether':'1000000000000000000000','grand':'1000000000000000000000','mether':'1000000000000000000000000','gether':'1000000000000000000000000000','tether':'1000000000000000000000000000000'};var padLeft=function(string,chars,sign){return new Array(chars-string.length+1).join(sign?sign:"0")+string;};var padRight=function(string,chars,sign){return string+(new Array(chars-string.length+1).join(sign?sign:"0"));};var toUtf8=function(hex){var str="";var i=0,l=hex.length;if(hex.substring(0,2)==='0x'){i=2;}
for(;i<l;i+=2){var code=parseInt(hex.substr(i,2),16);if(code===0)
break;str+=String.fromCharCode(code);}
return utf8.decode(str);};var toAscii=function(hex){var str="";var i=0,l=hex.length;if(hex.substring(0,2)==='0x'){i=2;}
for(;i<l;i+=2){var code=parseInt(hex.substr(i,2),16);str+=String.fromCharCode(code);}
return str;};var fromUtf8=function(str){str=utf8.encode(str);var hex="";for(var i=0;i<str.length;i++){var code=str.charCodeAt(i);if(code===0)
break;var n=code.toString(16);hex+=n.length<2?'0'+n:n;}
return"0x"+hex;};var fromAscii=function(str){var hex="";for(var i=0;i<str.length;i++){var code=str.charCodeAt(i);var n=code.toString(16);hex+=n.length<2?'0'+n:n;}
return"0x"+hex;};var transformToFullName=function(json){if(json.name.indexOf('(')!==-1){return json.name;}
var typeName=json.inputs.map(function(i){return i.type;}).join();return json.name+'('+typeName+')';};var extractDisplayName=function(name){var length=name.indexOf('(');return length!==-1?name.substr(0,length):name;};var extractTypeName=function(name){var length=name.indexOf('(');return length!==-1?name.substr(length+1,name.length-1-(length+1)).replace(' ',''):"";};var toDecimal=function(value){return toBigNumber(value).toNumber();};var fromDecimal=function(value){var number=toBigNumber(value);var result=number.toString(16);return number.lessThan(0)?'-0x'+result.substr(1):'0x'+result;};var toHex=function(val){if(isBoolean(val))
return fromDecimal(+val);if(isBigNumber(val))
return fromDecimal(val);if(isObject(val))
return fromUtf8(JSON.stringify(val));if(isString(val)){if(val.indexOf('-0x')===0)
return fromDecimal(val);else if(val.indexOf('0x')===0)
return val;else if(!isFinite(val))
return fromAscii(val);}
return fromDecimal(val);};var getValueOfUnit=function(unit){unit=unit?unit.toLowerCase():'ether';var unitValue=unitMap[unit];if(unitValue===undefined){throw new Error('This unit doesn\'t exists, please use the one of the following units'+JSON.stringify(unitMap,null,2));}
return new BigNumber(unitValue,10);};var fromWei=function(number,unit){var returnValue=toBigNumber(number).dividedBy(getValueOfUnit(unit));return isBigNumber(number)?returnValue:returnValue.toString(10);};var toWei=function(number,unit){var returnValue=toBigNumber(number).times(getValueOfUnit(unit));return isBigNumber(number)?returnValue:returnValue.toString(10);};var toBigNumber=function(number){number=number||0;if(isBigNumber(number))
return number;if(isString(number)&&(number.indexOf('0x')===0||number.indexOf('-0x')===0)){return new BigNumber(number.replace('0x',''),16);}
return new BigNumber(number.toString(10),10);};var toTwosComplement=function(number){var bigNumber=toBigNumber(number).round();if(bigNumber.lessThan(0)){return new BigNumber("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",16).plus(bigNumber).plus(1);}
return bigNumber;};var isStrictAddress=function(address){return/^0x[0-9a-f]{40}$/i.test(address);};var isAddress=function(address){if(!/^(0x)?[0-9a-f]{40}$/i.test(address)){return false;}else if(/^(0x)?[0-9a-f]{40}$/.test(address)||/^(0x)?[0-9A-F]{40}$/.test(address)){return true;}else{return isChecksumAddress(address);}};var isChecksumAddress=function(address){address=address.replace('0x','');var addressHash=sha3(address.toLowerCase());for(var i=0;i<40;i++){if((parseInt(addressHash[i],16)>7&&address[i].toUpperCase()!==address[i])||(parseInt(addressHash[i],16)<=7&&address[i].toLowerCase()!==address[i])){return false;}}
return true;};var toChecksumAddress=function(address){if(typeof address==='undefined')return'';address=address.toLowerCase().replace('0x','');var addressHash=sha3(address);var checksumAddress='0x';for(var i=0;i<address.length;i++){if(parseInt(addressHash[i],16)>7){checksumAddress+=address[i].toUpperCase();}else{checksumAddress+=address[i];}}
return checksumAddress;};var toAddress=function(address){if(isStrictAddress(address)){return address;}
if(/^[0-9a-f]{40}$/.test(address)){return'0x'+address;}
return'0x'+padLeft(toHex(address).substr(2),40);};var isBigNumber=function(object){return object instanceof BigNumber||(object&&object.constructor&&object.constructor.name==='BigNumber');};var isString=function(object){return typeof object==='string'||(object&&object.constructor&&object.constructor.name==='String');};var isFunction=function(object){return typeof object==='function';};var isObject=function(object){return typeof object==='object';};var isBoolean=function(object){return typeof object==='boolean';};var isArray=function(object){return object instanceof Array;};var isJson=function(str){try{return!!JSON.parse(str);}catch(e){return false;}};var isBloom=function(bloom){if(!/^(0x)?[0-9a-f]{512}$/i.test(bloom)){return false;}else if(/^(0x)?[0-9a-f]{512}$/.test(bloom)||/^(0x)?[0-9A-F]{512}$/.test(bloom)){return true;}
return false;};var isTopic=function(topic){if(!/^(0x)?[0-9a-f]{64}$/i.test(topic)){return false;}else if(/^(0x)?[0-9a-f]{64}$/.test(topic)||/^(0x)?[0-9A-F]{64}$/.test(topic)){return true;}
return false;};module.exports={padLeft:padLeft,padRight:padRight,toHex:toHex,toDecimal:toDecimal,fromDecimal:fromDecimal,toUtf8:toUtf8,toAscii:toAscii,fromUtf8:fromUtf8,fromAscii:fromAscii,transformToFullName:transformToFullName,extractDisplayName:extractDisplayName,extractTypeName:extractTypeName,toWei:toWei,fromWei:fromWei,toBigNumber:toBigNumber,toTwosComplement:toTwosComplement,toAddress:toAddress,isBigNumber:isBigNumber,isStrictAddress:isStrictAddress,isAddress:isAddress,isChecksumAddress:isChecksumAddress,toChecksumAddress:toChecksumAddress,isFunction:isFunction,isString:isString,isObject:isObject,isBoolean:isBoolean,isArray:isArray,isJson:isJson,isBloom:isBloom,isTopic:isTopic,};}),(function(module,exports,__webpack_require__){var BigNumber=__webpack_require__(38);var sha3=__webpack_require__(26);var utf8=__webpack_require__(53);var unitMap={'noether':'0','wei':'1','kwei':'1000','Kwei':'1000','babbage':'1000','femtoether':'1000','mwei':'1000000','Mwei':'1000000','lovelace':'1000000','picoether':'1000000','gwei':'1000000000','Gwei':'1000000000','shannon':'1000000000','nanoether':'1000000000','nano':'1000000000','szabo':'1000000000000','microether':'1000000000000','micro':'1000000000000','finney':'1000000000000000','milliether':'1000000000000000','milli':'1000000000000000','ether':'1000000000000000000','kether':'1000000000000000000000','grand':'1000000000000000000000','mether':'1000000000000000000000000','gether':'1000000000000000000000000000','tether':'1000000000000000000000000000000'};var padLeft=function(string,chars,sign){return new Array(chars-string.length+1).join(sign?sign:"0")+string;};var padRight=function(string,chars,sign){return string+(new Array(chars-string.length+1).join(sign?sign:"0"));};var toUtf8=function(hex){var str="";var i=0,l=hex.length;if(hex.substring(0,2)==='0x'){i=2;}
for(;i<l;i+=2){var code=parseInt(hex.substr(i,2),16);if(code===0)
break;str+=String.fromCharCode(code);}
return utf8.decode(str);};var toAscii=function(hex){var str="";var i=0,l=hex.length;if(hex.substring(0,2)==='0x'){i=2;}
for(;i<l;i+=2){var code=parseInt(hex.substr(i,2),16);str+=String.fromCharCode(code);}
return str;};var fromUtf8=function(str){str=utf8.encode(str);var hex="";for(var i=0;i<str.length;i++){var code=str.charCodeAt(i);if(code===0)
break;var n=code.toString(16);hex+=n.length<2?'0'+n:n;}
return"0x"+hex;};var fromAscii=function(str){var hex="";for(var i=0;i<str.length;i++){var code=str.charCodeAt(i);var n=code.toString(16);hex+=n.length<2?'0'+n:n;}
return"0x"+hex;};var transformToFullName=function(json){if(json.name.indexOf('(')!==-1){return json.name;}
var typeName=json.inputs.map(function(i){return i.type;}).join();return json.name+'('+typeName+')';};var extractDisplayName=function(name){var length=name.indexOf('(');return length!==-1?name.substr(0,length):name;};var extractTypeName=function(name){var length=name.indexOf('(');return length!==-1?name.substr(length+1,name.length-1-(length+1)).replace(' ',''):"";};var toDecimal=function(value){return toBigNumber(value).toNumber();};var fromDecimal=function(value){var number=toBigNumber(value);var result=number.toString(16);return number.lessThan(0)?'-0x'+result.substr(1):'0x'+result;};var toHex=function(val){if(isBoolean(val))
return fromDecimal(+val);if(isBigNumber(val))
return fromDecimal(val);if(isObject(val))
return fromUtf8(JSON.stringify(val));if(isString(val)){if(val.indexOf('-0x')===0)
return fromDecimal(val);else if(val.indexOf('0x')===0)
return val;else if(!isFinite(val))
return fromAscii(val);}
return fromDecimal(val);};var getValueOfUnit=function(unit){unit=unit?unit.toLowerCase():'ether';var unitValue=unitMap[unit];if(unitValue===undefined){throw new Error('This unit doesn\'t exists, please use the one of the following units'+JSON.stringify(unitMap,null,2));}
return new BigNumber(unitValue,10);};var fromWei=function(number,unit){var returnValue=toBigNumber(number).dividedBy(getValueOfUnit(unit));return isBigNumber(number)?returnValue:returnValue.toString(10);};var toWei=function(number,unit){var returnValue=toBigNumber(number).times(getValueOfUnit(unit));return isBigNumber(number)?returnValue:returnValue.toString(10);};var toBigNumber=function(number){number=number||0;if(isBigNumber(number))
return number;if(isString(number)&&(number.indexOf('0x')===0||number.indexOf('-0x')===0)){return new BigNumber(number.replace('0x',''),16);}
return new BigNumber(number.toString(10),10);};var toTwosComplement=function(number){var bigNumber=toBigNumber(number);if(bigNumber.lessThan(0)){return new BigNumber("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",16).plus(bigNumber).plus(1);}
return bigNumber;};var isStrictAddress=function(address){return/^0x[0-9a-f]{40}$/i.test(address);};var isAddress=function(address){if(!/^(0x)?[0-9a-f]{40}$/i.test(address)){return false;}else if(/^(0x)?[0-9a-f]{40}$/.test(address)||/^(0x)?[0-9A-F]{40}$/.test(address)){return true;}else{return isChecksumAddress(address);}};var isChecksumAddress=function(address){address=address.replace('0x','');var addressHash=sha3(address.toLowerCase());for(var i=0;i<40;i++){if((parseInt(addressHash[i],16)>7&&address[i].toUpperCase()!==address[i])||(parseInt(addressHash[i],16)<=7&&address[i].toLowerCase()!==address[i])){return false;}}
return true;};var toChecksumAddress=function(address){if(typeof address==='undefined')return'';address=address.toLowerCase().replace('0x','');var addressHash=sha3(address);var checksumAddress='0x';for(var i=0;i<address.length;i++){if(parseInt(addressHash[i],16)>7){checksumAddress+=address[i].toUpperCase();}else{checksumAddress+=address[i];}}
return checksumAddress;};var toAddress=function(address){if(isStrictAddress(address)){return address;}
if(/^[0-9a-f]{40}$/.test(address)){return'0x'+address;}
return'0x'+padLeft(toHex(address).substr(2),40);};var isBigNumber=function(object){return object instanceof BigNumber||(object&&object.constructor&&object.constructor.name==='BigNumber');};var isString=function(object){return typeof object==='string'||(object&&object.constructor&&object.constructor.name==='String');};var isFunction=function(object){return typeof object==='function';};var isObject=function(object){return typeof object==='object';};var isBoolean=function(object){return typeof object==='boolean';};var isArray=function(object){return object instanceof Array;};var isJson=function(str){try{return!!JSON.parse(str);}catch(e){return false;}};module.exports={padLeft:padLeft,padRight:padRight,toHex:toHex,toDecimal:toDecimal,fromDecimal:fromDecimal,toUtf8:toUtf8,toAscii:toAscii,fromUtf8:fromUtf8,fromAscii:fromAscii,transformToFullName:transformToFullName,extractDisplayName:extractDisplayName,extractTypeName:extractTypeName,toWei:toWei,fromWei:fromWei,toBigNumber:toBigNumber,toTwosComplement:toTwosComplement,toAddress:toAddress,isBigNumber:isBigNumber,isStrictAddress:isStrictAddress,isAddress:isAddress,isChecksumAddress:isChecksumAddress,toChecksumAddress:toChecksumAddress,isFunction:isFunction,isString:isString,isObject:isObject,isBoolean:isBoolean,isArray:isArray,isJson:isJson};}),(function(module,exports,__webpack_require__){var BigNumber=__webpack_require__(30);var sha3=__webpack_require__(29);var utf8=__webpack_require__(53);var unitMap={'noether':'0','wei':'1','kwei':'1000','Kwei':'1000','babbage':'1000','femtoether':'1000','mwei':'1000000','Mwei':'1000000','lovelace':'1000000','picoether':'1000000','gwei':'1000000000','Gwei':'1000000000','shannon':'1000000000','nanoether':'1000000000','nano':'1000000000','szabo':'1000000000000','microether':'1000000000000','micro':'1000000000000','finney':'1000000000000000','milliether':'1000000000000000','milli':'1000000000000000','ether':'1000000000000000000','kether':'1000000000000000000000','grand':'1000000000000000000000','mether':'1000000000000000000000000','gether':'1000000000000000000000000000','tether':'1000000000000000000000000000000'};var padLeft=function(string,chars,sign){return new Array(chars-string.length+1).join(sign?sign:"0")+string;};var padRight=function(string,chars,sign){return string+(new Array(chars-string.length+1).join(sign?sign:"0"));};var toUtf8=function(hex){var str="";var i=0,l=hex.length;if(hex.substring(0,2)==='0x'){i=2;}
for(;i<l;i+=2){var code=parseInt(hex.substr(i,2),16);if(code===0)
break;str+=String.fromCharCode(code);}
return utf8.decode(str);};var toAscii=function(hex){var str="";var i=0,l=hex.length;if(hex.substring(0,2)==='0x'){i=2;}
for(;i<l;i+=2){var code=parseInt(hex.substr(i,2),16);str+=String.fromCharCode(code);}
return str;};var fromUtf8=function(str,allowZero){str=utf8.encode(str);var hex="";for(var i=0;i<str.length;i++){var code=str.charCodeAt(i);if(code===0){if(allowZero){hex+='00';}else{break;}}else{var n=code.toString(16);hex+=n.length<2?'0'+n:n;}}
return"0x"+hex;};var fromAscii=function(str){var hex="";for(var i=0;i<str.length;i++){var code=str.charCodeAt(i);var n=code.toString(16);hex+=n.length<2?'0'+n:n;}
return"0x"+hex;};var transformToFullName=function(json){if(json.name.indexOf('(')!==-1){return json.name;}
var typeName=json.inputs.map(function(i){return i.type;}).join();return json.name+'('+typeName+')';};var extractDisplayName=function(name){var stBracket=name.indexOf('(');var endBracket=name.indexOf(')');return(stBracket!==-1&&endBracket!==-1)?name.substr(0,stBracket):name;};var extractTypeName=function(name){var stBracket=name.indexOf('(');var endBracket=name.indexOf(')');return(stBracket!==-1&&endBracket!==-1)?name.substr(stBracket+1,endBracket-stBracket-1).replace(' ',''):"";};var toDecimal=function(value){return toBigNumber(value).toNumber();};var fromDecimal=function(value){var number=toBigNumber(value);var result=number.toString(16);return number.lessThan(0)?'-0x'+result.substr(1):'0x'+result;};var toHex=function(val){if(isBoolean(val))
return fromDecimal(+val);if(isBigNumber(val))
return fromDecimal(val);if(typeof val==='object')
return fromUtf8(JSON.stringify(val));if(isString(val)){if(val.indexOf('-0x')===0)
return fromDecimal(val);else if(val.indexOf('0x')===0)
return val;else if(!isFinite(val))
return fromUtf8(val,1);}
return fromDecimal(val);};var getValueOfUnit=function(unit){unit=unit?unit.toLowerCase():'ether';var unitValue=unitMap[unit];if(unitValue===undefined){throw new Error('This unit doesn\'t exists, please use the one of the following units'+JSON.stringify(unitMap,null,2));}
return new BigNumber(unitValue,10);};var fromWei=function(number,unit){var returnValue=toBigNumber(number).dividedBy(getValueOfUnit(unit));return isBigNumber(number)?returnValue:returnValue.toString(10);};var toWei=function(number,unit){var returnValue=toBigNumber(number).times(getValueOfUnit(unit));return isBigNumber(number)?returnValue:returnValue.toString(10);};var toBigNumber=function(number){number=number||0;if(isBigNumber(number))
return number;if(isString(number)&&(number.indexOf('0x')===0||number.indexOf('-0x')===0)){return new BigNumber(number.replace('0x',''),16);}
return new BigNumber(number.toString(10),10);};var toTwosComplement=function(number){var bigNumber=toBigNumber(number).round();if(bigNumber.lessThan(0)){return new BigNumber("ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",16).plus(bigNumber).plus(1);}
return bigNumber;};var isStrictAddress=function(address){return/^0x[0-9a-f]{40}$/i.test(address);};var isAddress=function(address){if(!/^(0x)?[0-9a-f]{40}$/i.test(address)){return false;}else if(/^(0x)?[0-9a-f]{40}$/.test(address)||/^(0x)?[0-9A-F]{40}$/.test(address)){return true;}else{return isChecksumAddress(address);}};var isChecksumAddress=function(address){address=address.replace('0x','');var addressHash=sha3(address.toLowerCase());for(var i=0;i<40;i++){if((parseInt(addressHash[i],16)>7&&address[i].toUpperCase()!==address[i])||(parseInt(addressHash[i],16)<=7&&address[i].toLowerCase()!==address[i])){return false;}}
return true;};var toChecksumAddress=function(address){if(typeof address==='undefined')return'';address=address.toLowerCase().replace('0x','');var addressHash=sha3(address);var checksumAddress='0x';for(var i=0;i<address.length;i++){if(parseInt(addressHash[i],16)>7){checksumAddress+=address[i].toUpperCase();}else{checksumAddress+=address[i];}}
return checksumAddress;};var toAddress=function(address){if(isStrictAddress(address)){return address;}
if(/^[0-9a-f]{40}$/.test(address)){return'0x'+address;}
return'0x'+padLeft(toHex(address).substr(2),40);};var isBigNumber=function(object){return object instanceof BigNumber||(object&&object.constructor&&object.constructor.name==='BigNumber');};var isString=function(object){return typeof object==='string'||(object&&object.constructor&&object.constructor.name==='String');};var isFunction=function(object){return typeof object==='function';};var isObject=function(object){return object!==null&&!(Array.isArray(object))&&typeof object==='object';};var isBoolean=function(object){return typeof object==='boolean';};var isArray=function(object){return Array.isArray(object);};var isJson=function(str){try{return!!JSON.parse(str);}catch(e){return false;}};var isBloom=function(bloom){if(!/^(0x)?[0-9a-f]{512}$/i.test(bloom)){return false;}else if(/^(0x)?[0-9a-f]{512}$/.test(bloom)||/^(0x)?[0-9A-F]{512}$/.test(bloom)){return true;}
return false;};var isTopic=function(topic){if(!/^(0x)?[0-9a-f]{64}$/i.test(topic)){return false;}else if(/^(0x)?[0-9a-f]{64}$/.test(topic)||/^(0x)?[0-9A-F]{64}$/.test(topic)){return true;}
return false;};module.exports={padLeft:padLeft,padRight:padRight,toHex:toHex,toDecimal:toDecimal,fromDecimal:fromDecimal,toUtf8:toUtf8,toAscii:toAscii,fromUtf8:fromUtf8,fromAscii:fromAscii,transformToFullName:transformToFullName,extractDisplayName:extractDisplayName,extractTypeName:extractTypeName,toWei:toWei,fromWei:fromWei,toBigNumber:toBigNumber,toTwosComplement:toTwosComplement,toAddress:toAddress,isBigNumber:isBigNumber,isStrictAddress:isStrictAddress,isAddress:isAddress,isChecksumAddress:isChecksumAddress,toChecksumAddress:toChecksumAddress,isFunction:isFunction,isString:isString,isObject:isObject,isBoolean:isBoolean,isArray:isArray,isJson:isJson,isBloom:isBloom,isTopic:isTopic,};}),(function(module,exports,__webpack_require__){var BigNumber=__webpack_require__(23);var utils=__webpack_require__(2);var c=__webpack_require__(34);var SolidityParam=__webpack_require__(59);var formatInputInt=function(value){BigNumber.config(c.ETH_BIGNUMBER_ROUNDING_MODE);var result=utils.padLeft(utils.toTwosComplement(value).toString(16),64);return new SolidityParam(result);};var formatInputBytes=function(value){var result=utils.toHex(value).substr(2);var l=Math.floor((result.length+63)/64);result=utils.padRight(result,l*64);return new SolidityParam(result);};var formatInputDynamicBytes=function(value){var result=utils.toHex(value).substr(2);var length=result.length/2;var l=Math.floor((result.length+63)/64);result=utils.padRight(result,l*64);return new SolidityParam(formatInputInt(length).value+result);};var formatInputString=function(value){var result=utils.fromUtf8(value).substr(2);var length=result.length/2;var l=Math.floor((result.length+63)/64);result=utils.padRight(result,l*64);return new SolidityParam(formatInputInt(length).value+result);};var formatInputBool=function(value){var result='000000000000000000000000000000000000000000000000000000000000000'+(value?'1':'0');return new SolidityParam(result);};var formatInputReal=function(value){return formatInputInt(new BigNumber(value).times(new BigNumber(2).pow(128)));};var signedIsNegative=function(value){return(new BigNumber(value.substr(0,1),16).toString(2).substr(0,1))==='1';};var formatOutputInt=function(param){var value=param.staticPart()||"0";if(signedIsNegative(value)){return new BigNumber(value,16).minus(new BigNumber('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',16)).minus(1);}
return new BigNumber(value,16);};var formatOutputUInt=function(param){var value=param.staticPart()||"0";return new BigNumber(value,16);};var formatOutputReal=function(param){return formatOutputInt(param).dividedBy(new BigNumber(2).pow(128));};var formatOutputUReal=function(param){return formatOutputUInt(param).dividedBy(new BigNumber(2).pow(128));};var formatOutputBool=function(param){return param.staticPart()==='0000000000000000000000000000000000000000000000000000000000000001'?true:false;};var formatOutputBytes=function(param,name){var matches=name.match(/^bytes([0-9]*)/);var size=parseInt(matches[1]);return'0x'+param.staticPart().slice(0,2*size);};var formatOutputDynamicBytes=function(param){var length=(new BigNumber(param.dynamicPart().slice(0,64),16)).toNumber()*2;return'0x'+param.dynamicPart().substr(64,length);};var formatOutputString=function(param){var length=(new BigNumber(param.dynamicPart().slice(0,64),16)).toNumber()*2;return utils.toUtf8(param.dynamicPart().substr(64,length));};var formatOutputAddress=function(param){var value=param.staticPart();return"0x"+value.slice(value.length-40,value.length);};module.exports={formatInputInt:formatInputInt,formatInputBytes:formatInputBytes,formatInputDynamicBytes:formatInputDynamicBytes,formatInputString:formatInputString,formatInputBool:formatInputBool,formatInputReal:formatInputReal,formatOutputInt:formatOutputInt,formatOutputUInt:formatOutputUInt,formatOutputReal:formatOutputReal,formatOutputUReal:formatOutputUReal,formatOutputBool:formatOutputBool,formatOutputBytes:formatOutputBytes,formatOutputDynamicBytes:formatOutputDynamicBytes,formatOutputString:formatOutputString,formatOutputAddress:formatOutputAddress};}),(function(module,exports,__webpack_require__){var BigNumber=__webpack_require__(38);var utils=__webpack_require__(3);var c=__webpack_require__(39);var SolidityParam=__webpack_require__(63);var formatInputInt=function(value){BigNumber.config(c.ETH_BIGNUMBER_ROUNDING_MODE);var result=utils.padLeft(utils.toTwosComplement(value).round().toString(16),64);return new SolidityParam(result);};var formatInputBytes=function(value){var result=utils.toHex(value).substr(2);var l=Math.floor((result.length+63)/64);result=utils.padRight(result,l*64);return new SolidityParam(result);};var formatInputDynamicBytes=function(value){var result=utils.toHex(value).substr(2);var length=result.length/2;var l=Math.floor((result.length+63)/64);result=utils.padRight(result,l*64);return new SolidityParam(formatInputInt(length).value+result);};var formatInputString=function(value){var result=utils.fromUtf8(value).substr(2);var length=result.length/2;var l=Math.floor((result.length+63)/64);result=utils.padRight(result,l*64);return new SolidityParam(formatInputInt(length).value+result);};var formatInputBool=function(value){var result='000000000000000000000000000000000000000000000000000000000000000'+(value?'1':'0');return new SolidityParam(result);};var formatInputReal=function(value){return formatInputInt(new BigNumber(value).times(new BigNumber(2).pow(128)));};var signedIsNegative=function(value){return(new BigNumber(value.substr(0,1),16).toString(2).substr(0,1))==='1';};var formatOutputInt=function(param){var value=param.staticPart()||"0";if(signedIsNegative(value)){return new BigNumber(value,16).minus(new BigNumber('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',16)).minus(1);}
return new BigNumber(value,16);};var formatOutputUInt=function(param){var value=param.staticPart()||"0";return new BigNumber(value,16);};var formatOutputReal=function(param){return formatOutputInt(param).dividedBy(new BigNumber(2).pow(128));};var formatOutputUReal=function(param){return formatOutputUInt(param).dividedBy(new BigNumber(2).pow(128));};var formatOutputBool=function(param){return param.staticPart()==='0000000000000000000000000000000000000000000000000000000000000001'?true:false;};var formatOutputBytes=function(param){return'0x'+param.staticPart();};var formatOutputDynamicBytes=function(param){var length=(new BigNumber(param.dynamicPart().slice(0,64),16)).toNumber()*2;return'0x'+param.dynamicPart().substr(64,length);};var formatOutputString=function(param){var length=(new BigNumber(param.dynamicPart().slice(0,64),16)).toNumber()*2;return utils.toUtf8(param.dynamicPart().substr(64,length));};var formatOutputAddress=function(param){var value=param.staticPart();return"0x"+value.slice(value.length-40,value.length);};module.exports={formatInputInt:formatInputInt,formatInputBytes:formatInputBytes,formatInputDynamicBytes:formatInputDynamicBytes,formatInputString:formatInputString,formatInputBool:formatInputBool,formatInputReal:formatInputReal,formatOutputInt:formatOutputInt,formatOutputUInt:formatOutputUInt,formatOutputReal:formatOutputReal,formatOutputUReal:formatOutputUReal,formatOutputBool:formatOutputBool,formatOutputBytes:formatOutputBytes,formatOutputDynamicBytes:formatOutputDynamicBytes,formatOutputString:formatOutputString,formatOutputAddress:formatOutputAddress};}),(function(module,exports,__webpack_require__){var BigNumber=__webpack_require__(30);var utils=__webpack_require__(4);var c=__webpack_require__(43);var SolidityParam=__webpack_require__(66);var formatInputInt=function(value){BigNumber.config(c.ETH_BIGNUMBER_ROUNDING_MODE);var result=utils.padLeft(utils.toTwosComplement(value).toString(16),64);return new SolidityParam(result);};var formatInputBytes=function(value){var result=utils.toHex(value).substr(2);var l=Math.floor((result.length+63)/64);result=utils.padRight(result,l*64);return new SolidityParam(result);};var formatInputDynamicBytes=function(value){var result=utils.toHex(value).substr(2);var length=result.length/2;var l=Math.floor((result.length+63)/64);result=utils.padRight(result,l*64);return new SolidityParam(formatInputInt(length).value+result);};var formatInputString=function(value){var result=utils.fromUtf8(value).substr(2);var length=result.length/2;var l=Math.floor((result.length+63)/64);result=utils.padRight(result,l*64);return new SolidityParam(formatInputInt(length).value+result);};var formatInputBool=function(value){var result='000000000000000000000000000000000000000000000000000000000000000'+(value?'1':'0');return new SolidityParam(result);};var formatInputReal=function(value){return formatInputInt(new BigNumber(value).times(new BigNumber(2).pow(128)));};var signedIsNegative=function(value){return(new BigNumber(value.substr(0,1),16).toString(2).substr(0,1))==='1';};var formatOutputInt=function(param){var value=param.staticPart()||"0";if(signedIsNegative(value)){return new BigNumber(value,16).minus(new BigNumber('ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',16)).minus(1);}
return new BigNumber(value,16);};var formatOutputUInt=function(param){var value=param.staticPart()||"0";return new BigNumber(value,16);};var formatOutputReal=function(param){return formatOutputInt(param).dividedBy(new BigNumber(2).pow(128));};var formatOutputUReal=function(param){return formatOutputUInt(param).dividedBy(new BigNumber(2).pow(128));};var formatOutputBool=function(param){return param.staticPart()==='0000000000000000000000000000000000000000000000000000000000000001'?true:false;};var formatOutputBytes=function(param,name){var matches=name.match(/^bytes([0-9]*)/);var size=parseInt(matches[1]);return'0x'+param.staticPart().slice(0,2*size);};var formatOutputDynamicBytes=function(param){var length=(new BigNumber(param.dynamicPart().slice(0,64),16)).toNumber()*2;return'0x'+param.dynamicPart().substr(64,length);};var formatOutputString=function(param){var length=(new BigNumber(param.dynamicPart().slice(0,64),16)).toNumber()*2;return utils.toUtf8(param.dynamicPart().substr(64,length));};var formatOutputAddress=function(param){var value=param.staticPart();return"0x"+value.slice(value.length-40,value.length);};module.exports={formatInputInt:formatInputInt,formatInputBytes:formatInputBytes,formatInputDynamicBytes:formatInputDynamicBytes,formatInputString:formatInputString,formatInputBool:formatInputBool,formatInputReal:formatInputReal,formatOutputInt:formatOutputInt,formatOutputUInt:formatOutputUInt,formatOutputReal:formatOutputReal,formatOutputUReal:formatOutputUReal,formatOutputBool:formatOutputBool,formatOutputBytes:formatOutputBytes,formatOutputDynamicBytes:formatOutputDynamicBytes,formatOutputString:formatOutputString,formatOutputAddress:formatOutputAddress};}),(function(module,exports,__webpack_require__){var f=__webpack_require__(5);var SolidityParam=__webpack_require__(59);var SolidityType=function(config){this._inputFormatter=config.inputFormatter;this._outputFormatter=config.outputFormatter;};SolidityType.prototype.isType=function(name){throw"this method should be overrwritten for type "+name;};SolidityType.prototype.staticPartLength=function(name){return(this.nestedTypes(name)||['[1]']).map(function(type){return parseInt(type.slice(1,-1),10)||1;}).reduce(function(previous,current){return previous*current;},32);};SolidityType.prototype.isDynamicArray=function(name){var nestedTypes=this.nestedTypes(name);return!!nestedTypes&&!nestedTypes[nestedTypes.length-1].match(/[0-9]{1,}/g);};SolidityType.prototype.isStaticArray=function(name){var nestedTypes=this.nestedTypes(name);return!!nestedTypes&&!!nestedTypes[nestedTypes.length-1].match(/[0-9]{1,}/g);};SolidityType.prototype.staticArrayLength=function(name){var nestedTypes=this.nestedTypes(name);if(nestedTypes){return parseInt(nestedTypes[nestedTypes.length-1].match(/[0-9]{1,}/g)||1);}
return 1;};SolidityType.prototype.nestedName=function(name){var nestedTypes=this.nestedTypes(name);if(!nestedTypes){return name;}
return name.substr(0,name.length-nestedTypes[nestedTypes.length-1].length);};SolidityType.prototype.isDynamicType=function(){return false;};SolidityType.prototype.nestedTypes=function(name){return name.match(/(\[[0-9]*\])/g);};SolidityType.prototype.encode=function(value,name){var self=this;if(this.isDynamicArray(name)){return(function(){var length=value.length;var nestedName=self.nestedName(name);var result=[];result.push(f.formatInputInt(length).encode());value.forEach(function(v){result.push(self.encode(v,nestedName));});return result;})();}else if(this.isStaticArray(name)){return(function(){var length=self.staticArrayLength(name);var nestedName=self.nestedName(name);var result=[];for(var i=0;i<length;i++){result.push(self.encode(value[i],nestedName));}
return result;})();}
return this._inputFormatter(value,name).encode();};SolidityType.prototype.decode=function(bytes,offset,name){var self=this;if(this.isDynamicArray(name)){return(function(){var arrayOffset=parseInt('0x'+bytes.substr(offset*2,64));var length=parseInt('0x'+bytes.substr(arrayOffset*2,64));var arrayStart=arrayOffset+32;var nestedName=self.nestedName(name);var nestedStaticPartLength=self.staticPartLength(nestedName);var roundedNestedStaticPartLength=Math.floor((nestedStaticPartLength+31)/32)*32;var result=[];for(var i=0;i<length*roundedNestedStaticPartLength;i+=roundedNestedStaticPartLength){result.push(self.decode(bytes,arrayStart+i,nestedName));}
return result;})();}else if(this.isStaticArray(name)){return(function(){var length=self.staticArrayLength(name);var arrayStart=offset;var nestedName=self.nestedName(name);var nestedStaticPartLength=self.staticPartLength(nestedName);var roundedNestedStaticPartLength=Math.floor((nestedStaticPartLength+31)/32)*32;var result=[];for(var i=0;i<length*roundedNestedStaticPartLength;i+=roundedNestedStaticPartLength){result.push(self.decode(bytes,arrayStart+i,nestedName));}
return result;})();}else if(this.isDynamicType(name)){return(function(){var dynamicOffset=parseInt('0x'+bytes.substr(offset*2,64));var length=parseInt('0x'+bytes.substr(dynamicOffset*2,64));var roundedLength=Math.floor((length+31)/32);var param=new SolidityParam(bytes.substr(dynamicOffset*2,(1+roundedLength)*64),0);return self._outputFormatter(param,name);})();}
var length=this.staticPartLength(name);var param=new SolidityParam(bytes.substr(offset*2,length*2));return this._outputFormatter(param,name);};module.exports=SolidityType;}),(function(module,exports,__webpack_require__){var utils=__webpack_require__(2);var config=__webpack_require__(34);var Iban=__webpack_require__(36);var outputBigNumberFormatter=function(number){return utils.toBigNumber(number);};var isPredefinedBlockNumber=function(blockNumber){return blockNumber==='latest'||blockNumber==='pending'||blockNumber==='earliest';};var inputDefaultBlockNumberFormatter=function(blockNumber){if(blockNumber===undefined){return config.defaultBlock;}
return inputBlockNumberFormatter(blockNumber);};var inputBlockNumberFormatter=function(blockNumber){if(blockNumber===undefined){return undefined;}else if(isPredefinedBlockNumber(blockNumber)){return blockNumber;}
return utils.toHex(blockNumber);};var inputCallFormatter=function(options){options.from=options.from||config.defaultAccount;if(options.from){options.from=inputAddressFormatter(options.from);}
if(options.to){options.to=inputAddressFormatter(options.to);}
['gasPrice','gas','value','nonce'].filter(function(key){return options[key]!==undefined;}).forEach(function(key){options[key]=utils.fromDecimal(options[key]);});return options;};var inputTransactionFormatter=function(options){options.from=options.from||config.defaultAccount;options.from=inputAddressFormatter(options.from);if(options.to){options.to=inputAddressFormatter(options.to);}
['gasPrice','gas','value','nonce'].filter(function(key){return options[key]!==undefined;}).forEach(function(key){options[key]=utils.fromDecimal(options[key]);});return options;};var outputTransactionFormatter=function(tx){if(tx.blockNumber!==null)
tx.blockNumber=utils.toDecimal(tx.blockNumber);if(tx.transactionIndex!==null)
tx.transactionIndex=utils.toDecimal(tx.transactionIndex);tx.nonce=utils.toDecimal(tx.nonce);tx.gas=utils.toDecimal(tx.gas);tx.gasPrice=utils.toBigNumber(tx.gasPrice);tx.value=utils.toBigNumber(tx.value);return tx;};var outputTransactionReceiptFormatter=function(receipt){if(receipt.blockNumber!==null)
receipt.blockNumber=utils.toDecimal(receipt.blockNumber);if(receipt.transactionIndex!==null)
receipt.transactionIndex=utils.toDecimal(receipt.transactionIndex);receipt.cumulativeGasUsed=utils.toDecimal(receipt.cumulativeGasUsed);receipt.gasUsed=utils.toDecimal(receipt.gasUsed);if(utils.isArray(receipt.logs)){receipt.logs=receipt.logs.map(function(log){return outputLogFormatter(log);});}
return receipt;};var outputBlockFormatter=function(block){block.gasLimit=utils.toDecimal(block.gasLimit);block.gasUsed=utils.toDecimal(block.gasUsed);block.size=utils.toDecimal(block.size);block.timestamp=utils.toDecimal(block.timestamp);if(block.number!==null)
block.number=utils.toDecimal(block.number);block.difficulty=utils.toBigNumber(block.difficulty);block.totalDifficulty=utils.toBigNumber(block.totalDifficulty);if(utils.isArray(block.transactions)){block.transactions.forEach(function(item){if(!utils.isString(item))
return outputTransactionFormatter(item);});}
return block;};var outputLogFormatter=function(log){if(log.blockNumber!==null)
log.blockNumber=utils.toDecimal(log.blockNumber);if(log.transactionIndex!==null)
log.transactionIndex=utils.toDecimal(log.transactionIndex);if(log.logIndex!==null)
log.logIndex=utils.toDecimal(log.logIndex);return log;};var inputPostFormatter=function(post){post.ttl=utils.fromDecimal(post.ttl);post.workToProve=utils.fromDecimal(post.workToProve);post.priority=utils.fromDecimal(post.priority);if(!utils.isArray(post.topics)){post.topics=post.topics?[post.topics]:[];}
post.topics=post.topics.map(function(topic){return(topic.indexOf('0x')===0)?topic:utils.fromUtf8(topic);});return post;};var outputPostFormatter=function(post){post.expiry=utils.toDecimal(post.expiry);post.sent=utils.toDecimal(post.sent);post.ttl=utils.toDecimal(post.ttl);post.workProved=utils.toDecimal(post.workProved);if(!post.topics){post.topics=[];}
post.topics=post.topics.map(function(topic){return utils.toAscii(topic);});return post;};var inputAddressFormatter=function(address){var iban=new Iban(address);if(iban.isValid()&&iban.isDirect()){return'0x'+iban.address();}else if(utils.isStrictAddress(address)){return address;}else if(utils.isAddress(address)){return'0x'+address;}
throw new Error('invalid address');};var outputSyncingFormatter=function(result){result.startingBlock=utils.toDecimal(result.startingBlock);result.currentBlock=utils.toDecimal(result.currentBlock);result.highestBlock=utils.toDecimal(result.highestBlock);if(result.knownStates){result.knownStates=utils.toDecimal(result.knownStates);result.pulledStates=utils.toDecimal(result.pulledStates);}
return result;};module.exports={inputDefaultBlockNumberFormatter:inputDefaultBlockNumberFormatter,inputBlockNumberFormatter:inputBlockNumberFormatter,inputCallFormatter:inputCallFormatter,inputTransactionFormatter:inputTransactionFormatter,inputAddressFormatter:inputAddressFormatter,inputPostFormatter:inputPostFormatter,outputBigNumberFormatter:outputBigNumberFormatter,outputTransactionFormatter:outputTransactionFormatter,outputTransactionReceiptFormatter:outputTransactionReceiptFormatter,outputBlockFormatter:outputBlockFormatter,outputLogFormatter:outputLogFormatter,outputPostFormatter:outputPostFormatter,outputSyncingFormatter:outputSyncingFormatter};}),(function(module,exports,__webpack_require__){var f=__webpack_require__(6);var SolidityParam=__webpack_require__(63);var SolidityType=function(config){this._inputFormatter=config.inputFormatter;this._outputFormatter=config.outputFormatter;};SolidityType.prototype.isType=function(name){throw"this method should be overrwritten for type "+name;};SolidityType.prototype.staticPartLength=function(name){throw"this method should be overrwritten for type: "+name;};SolidityType.prototype.isDynamicArray=function(name){var nestedTypes=this.nestedTypes(name);return!!nestedTypes&&!nestedTypes[nestedTypes.length-1].match(/[0-9]{1,}/g);};SolidityType.prototype.isStaticArray=function(name){var nestedTypes=this.nestedTypes(name);return!!nestedTypes&&!!nestedTypes[nestedTypes.length-1].match(/[0-9]{1,}/g);};SolidityType.prototype.staticArrayLength=function(name){var nestedTypes=this.nestedTypes(name);if(nestedTypes){return parseInt(nestedTypes[nestedTypes.length-1].match(/[0-9]{1,}/g)||1);}
return 1;};SolidityType.prototype.nestedName=function(name){var nestedTypes=this.nestedTypes(name);if(!nestedTypes){return name;}
return name.substr(0,name.length-nestedTypes[nestedTypes.length-1].length);};SolidityType.prototype.isDynamicType=function(){return false;};SolidityType.prototype.nestedTypes=function(name){return name.match(/(\[[0-9]*\])/g);};SolidityType.prototype.encode=function(value,name){var self=this;if(this.isDynamicArray(name)){return(function(){var length=value.length;var nestedName=self.nestedName(name);var result=[];result.push(f.formatInputInt(length).encode());value.forEach(function(v){result.push(self.encode(v,nestedName));});return result;})();}else if(this.isStaticArray(name)){return(function(){var length=self.staticArrayLength(name);var nestedName=self.nestedName(name);var result=[];for(var i=0;i<length;i++){result.push(self.encode(value[i],nestedName));}
return result;})();}
return this._inputFormatter(value,name).encode();};SolidityType.prototype.decode=function(bytes,offset,name){var self=this;if(this.isDynamicArray(name)){return(function(){var arrayOffset=parseInt('0x'+bytes.substr(offset*2,64));var length=parseInt('0x'+bytes.substr(arrayOffset*2,64));var arrayStart=arrayOffset+32;var nestedName=self.nestedName(name);var nestedStaticPartLength=self.staticPartLength(nestedName);var roundedNestedStaticPartLength=Math.floor((nestedStaticPartLength+31)/32)*32;var result=[];for(var i=0;i<length*roundedNestedStaticPartLength;i+=roundedNestedStaticPartLength){result.push(self.decode(bytes,arrayStart+i,nestedName));}
return result;})();}else if(this.isStaticArray(name)){return(function(){var length=self.staticArrayLength(name);var arrayStart=offset;var nestedName=self.nestedName(name);var nestedStaticPartLength=self.staticPartLength(nestedName);var roundedNestedStaticPartLength=Math.floor((nestedStaticPartLength+31)/32)*32;var result=[];for(var i=0;i<length*roundedNestedStaticPartLength;i+=roundedNestedStaticPartLength){result.push(self.decode(bytes,arrayStart+i,nestedName));}
return result;})();}else if(this.isDynamicType(name)){return(function(){var dynamicOffset=parseInt('0x'+bytes.substr(offset*2,64));var length=parseInt('0x'+bytes.substr(dynamicOffset*2,64));var roundedLength=Math.floor((length+31)/32);return self._outputFormatter(new SolidityParam(bytes.substr(dynamicOffset*2,(1+roundedLength)*64),0));})();}
var length=this.staticPartLength(name);return this._outputFormatter(new SolidityParam(bytes.substr(offset*2,length*2)));};module.exports=SolidityType;}),(function(module,exports,__webpack_require__){var utils=__webpack_require__(3);var config=__webpack_require__(39);var Iban=__webpack_require__(41);var outputBigNumberFormatter=function(number){return utils.toBigNumber(number);};var isPredefinedBlockNumber=function(blockNumber){return blockNumber==='latest'||blockNumber==='pending'||blockNumber==='earliest';};var inputDefaultBlockNumberFormatter=function(blockNumber){if(blockNumber===undefined){return config.defaultBlock;}
return inputBlockNumberFormatter(blockNumber);};var inputBlockNumberFormatter=function(blockNumber){if(blockNumber===undefined){return undefined;}else if(isPredefinedBlockNumber(blockNumber)){return blockNumber;}
return utils.toHex(blockNumber);};var inputCallFormatter=function(options){options.from=options.from||config.defaultAccount;if(options.from){options.from=inputAddressFormatter(options.from);}
if(options.to){options.to=inputAddressFormatter(options.to);}
['gasPrice','gas','value','nonce'].filter(function(key){return options[key]!==undefined;}).forEach(function(key){options[key]=utils.fromDecimal(options[key]);});return options;};var inputTransactionFormatter=function(options){options.from=options.from||config.defaultAccount;options.from=inputAddressFormatter(options.from);if(options.to){options.to=inputAddressFormatter(options.to);}
['gasPrice','gas','value','nonce'].filter(function(key){return options[key]!==undefined;}).forEach(function(key){options[key]=utils.fromDecimal(options[key]);});return options;};var outputTransactionFormatter=function(tx){if(tx.blockNumber!==null)
tx.blockNumber=utils.toDecimal(tx.blockNumber);if(tx.transactionIndex!==null)
tx.transactionIndex=utils.toDecimal(tx.transactionIndex);tx.nonce=utils.toDecimal(tx.nonce);tx.gas=utils.toDecimal(tx.gas);tx.gasPrice=utils.toBigNumber(tx.gasPrice);tx.value=utils.toBigNumber(tx.value);return tx;};var outputTransactionReceiptFormatter=function(receipt){if(receipt.blockNumber!==null)
receipt.blockNumber=utils.toDecimal(receipt.blockNumber);if(receipt.transactionIndex!==null)
receipt.transactionIndex=utils.toDecimal(receipt.transactionIndex);receipt.cumulativeGasUsed=utils.toDecimal(receipt.cumulativeGasUsed);receipt.gasUsed=utils.toDecimal(receipt.gasUsed);if(utils.isArray(receipt.logs)){receipt.logs=receipt.logs.map(function(log){return outputLogFormatter(log);});}
return receipt;};var outputBlockFormatter=function(block){block.gasLimit=utils.toDecimal(block.gasLimit);block.gasUsed=utils.toDecimal(block.gasUsed);block.size=utils.toDecimal(block.size);block.timestamp=utils.toDecimal(block.timestamp);if(block.number!==null)
block.number=utils.toDecimal(block.number);block.difficulty=utils.toBigNumber(block.difficulty);block.totalDifficulty=utils.toBigNumber(block.totalDifficulty);if(utils.isArray(block.transactions)){block.transactions.forEach(function(item){if(!utils.isString(item))
return outputTransactionFormatter(item);});}
return block;};var outputLogFormatter=function(log){if(log.blockNumber!==null)
log.blockNumber=utils.toDecimal(log.blockNumber);if(log.transactionIndex!==null)
log.transactionIndex=utils.toDecimal(log.transactionIndex);if(log.logIndex!==null)
log.logIndex=utils.toDecimal(log.logIndex);return log;};var inputPostFormatter=function(post){post.ttl=utils.fromDecimal(post.ttl);post.workToProve=utils.fromDecimal(post.workToProve);post.priority=utils.fromDecimal(post.priority);if(!utils.isArray(post.topics)){post.topics=post.topics?[post.topics]:[];}
post.topics=post.topics.map(function(topic){return(topic.indexOf('0x')===0)?topic:utils.fromUtf8(topic);});return post;};var outputPostFormatter=function(post){post.expiry=utils.toDecimal(post.expiry);post.sent=utils.toDecimal(post.sent);post.ttl=utils.toDecimal(post.ttl);post.workProved=utils.toDecimal(post.workProved);if(!post.topics){post.topics=[];}
post.topics=post.topics.map(function(topic){return utils.toAscii(topic);});return post;};var inputAddressFormatter=function(address){var iban=new Iban(address);if(iban.isValid()&&iban.isDirect()){return'0x'+iban.address();}else if(utils.isStrictAddress(address)){return address;}else if(utils.isAddress(address)){return'0x'+address;}
throw new Error('invalid address');};var outputSyncingFormatter=function(result){result.startingBlock=utils.toDecimal(result.startingBlock);result.currentBlock=utils.toDecimal(result.currentBlock);result.highestBlock=utils.toDecimal(result.highestBlock);return result;};module.exports={inputDefaultBlockNumberFormatter:inputDefaultBlockNumberFormatter,inputBlockNumberFormatter:inputBlockNumberFormatter,inputCallFormatter:inputCallFormatter,inputTransactionFormatter:inputTransactionFormatter,inputAddressFormatter:inputAddressFormatter,inputPostFormatter:inputPostFormatter,outputBigNumberFormatter:outputBigNumberFormatter,outputTransactionFormatter:outputTransactionFormatter,outputTransactionReceiptFormatter:outputTransactionReceiptFormatter,outputBlockFormatter:outputBlockFormatter,outputLogFormatter:outputLogFormatter,outputPostFormatter:outputPostFormatter,outputSyncingFormatter:outputSyncingFormatter};}),(function(module,exports,__webpack_require__){var f=__webpack_require__(7);var SolidityParam=__webpack_require__(66);var SolidityType=function(config){this._inputFormatter=config.inputFormatter;this._outputFormatter=config.outputFormatter;};SolidityType.prototype.isType=function(name){throw"this method should be overrwritten for type "+name;};SolidityType.prototype.staticPartLength=function(name){return(this.nestedTypes(name)||['[1]']).map(function(type){return parseInt(type.slice(1,-1),10)||1;}).reduce(function(previous,current){return previous*current;},32);};SolidityType.prototype.isDynamicArray=function(name){var nestedTypes=this.nestedTypes(name);return!!nestedTypes&&!nestedTypes[nestedTypes.length-1].match(/[0-9]{1,}/g);};SolidityType.prototype.isStaticArray=function(name){var nestedTypes=this.nestedTypes(name);return!!nestedTypes&&!!nestedTypes[nestedTypes.length-1].match(/[0-9]{1,}/g);};SolidityType.prototype.staticArrayLength=function(name){var nestedTypes=this.nestedTypes(name);if(nestedTypes){return parseInt(nestedTypes[nestedTypes.length-1].match(/[0-9]{1,}/g)||1);}
return 1;};SolidityType.prototype.nestedName=function(name){var nestedTypes=this.nestedTypes(name);if(!nestedTypes){return name;}
return name.substr(0,name.length-nestedTypes[nestedTypes.length-1].length);};SolidityType.prototype.isDynamicType=function(){return false;};SolidityType.prototype.nestedTypes=function(name){return name.match(/(\[[0-9]*\])/g);};SolidityType.prototype.encode=function(value,name){var self=this;if(this.isDynamicArray(name)){return(function(){var length=value.length;var nestedName=self.nestedName(name);var result=[];result.push(f.formatInputInt(length).encode());value.forEach(function(v){result.push(self.encode(v,nestedName));});return result;})();}else if(this.isStaticArray(name)){return(function(){var length=self.staticArrayLength(name);var nestedName=self.nestedName(name);var result=[];for(var i=0;i<length;i++){result.push(self.encode(value[i],nestedName));}
return result;})();}
return this._inputFormatter(value,name).encode();};SolidityType.prototype.decode=function(bytes,offset,name){var self=this;if(this.isDynamicArray(name)){return(function(){var arrayOffset=parseInt('0x'+bytes.substr(offset*2,64));var length=parseInt('0x'+bytes.substr(arrayOffset*2,64));var arrayStart=arrayOffset+32;var nestedName=self.nestedName(name);var nestedStaticPartLength=self.staticPartLength(nestedName);var roundedNestedStaticPartLength=Math.floor((nestedStaticPartLength+31)/32)*32;var result=[];for(var i=0;i<length*roundedNestedStaticPartLength;i+=roundedNestedStaticPartLength){result.push(self.decode(bytes,arrayStart+i,nestedName));}
return result;})();}else if(this.isStaticArray(name)){return(function(){var length=self.staticArrayLength(name);var arrayStart=offset;var nestedName=self.nestedName(name);var nestedStaticPartLength=self.staticPartLength(nestedName);var roundedNestedStaticPartLength=Math.floor((nestedStaticPartLength+31)/32)*32;var result=[];for(var i=0;i<length*roundedNestedStaticPartLength;i+=roundedNestedStaticPartLength){result.push(self.decode(bytes,arrayStart+i,nestedName));}
return result;})();}else if(this.isDynamicType(name)){return(function(){var dynamicOffset=parseInt('0x'+bytes.substr(offset*2,64));var length=parseInt('0x'+bytes.substr(dynamicOffset*2,64));var roundedLength=Math.floor((length+31)/32);var param=new SolidityParam(bytes.substr(dynamicOffset*2,(1+roundedLength)*64),0);return self._outputFormatter(param,name);})();}
var length=this.staticPartLength(name);var param=new SolidityParam(bytes.substr(offset*2,length*2));return this._outputFormatter(param,name);};module.exports=SolidityType;}),(function(module,exports,__webpack_require__){"use strict";var utils=__webpack_require__(4);var config=__webpack_require__(43);var Iban=__webpack_require__(45);var outputBigNumberFormatter=function(number){return utils.toBigNumber(number);};var isPredefinedBlockNumber=function(blockNumber){return blockNumber==='latest'||blockNumber==='pending'||blockNumber==='earliest';};var inputDefaultBlockNumberFormatter=function(blockNumber){if(blockNumber===undefined){return config.defaultBlock;}
return inputBlockNumberFormatter(blockNumber);};var inputBlockNumberFormatter=function(blockNumber){if(blockNumber===undefined){return undefined;}else if(isPredefinedBlockNumber(blockNumber)){return blockNumber;}
return utils.toHex(blockNumber);};var inputCallFormatter=function(options){options.from=options.from||config.defaultAccount;if(options.from){options.from=inputAddressFormatter(options.from);}
if(options.to){options.to=inputAddressFormatter(options.to);}
['gasPrice','gas','value','nonce'].filter(function(key){return options[key]!==undefined;}).forEach(function(key){options[key]=utils.fromDecimal(options[key]);});return options;};var inputTransactionFormatter=function(options){options.from=options.from||config.defaultAccount;options.from=inputAddressFormatter(options.from);if(options.to){options.to=inputAddressFormatter(options.to);}
['gasPrice','gas','value','nonce'].filter(function(key){return options[key]!==undefined;}).forEach(function(key){options[key]=utils.fromDecimal(options[key]);});return options;};var outputTransactionFormatter=function(tx){if(tx.blockNumber!==null)
tx.blockNumber=utils.toDecimal(tx.blockNumber);if(tx.transactionIndex!==null)
tx.transactionIndex=utils.toDecimal(tx.transactionIndex);tx.nonce=utils.toDecimal(tx.nonce);tx.gas=utils.toDecimal(tx.gas);tx.gasPrice=utils.toBigNumber(tx.gasPrice);tx.value=utils.toBigNumber(tx.value);return tx;};var outputTransactionReceiptFormatter=function(receipt){if(receipt.blockNumber!==null)
receipt.blockNumber=utils.toDecimal(receipt.blockNumber);if(receipt.transactionIndex!==null)
receipt.transactionIndex=utils.toDecimal(receipt.transactionIndex);receipt.cumulativeGasUsed=utils.toDecimal(receipt.cumulativeGasUsed);receipt.gasUsed=utils.toDecimal(receipt.gasUsed);if(utils.isArray(receipt.logs)){receipt.logs=receipt.logs.map(function(log){return outputLogFormatter(log);});}
return receipt;};var outputBlockFormatter=function(block){block.gasLimit=utils.toDecimal(block.gasLimit);block.gasUsed=utils.toDecimal(block.gasUsed);block.size=utils.toDecimal(block.size);block.timestamp=utils.toDecimal(block.timestamp);if(block.number!==null)
block.number=utils.toDecimal(block.number);block.difficulty=utils.toBigNumber(block.difficulty);block.totalDifficulty=utils.toBigNumber(block.totalDifficulty);if(utils.isArray(block.transactions)){block.transactions.forEach(function(item){if(!utils.isString(item))
return outputTransactionFormatter(item);});}
return block;};var outputLogFormatter=function(log){if(log.blockNumber)
log.blockNumber=utils.toDecimal(log.blockNumber);if(log.transactionIndex)
log.transactionIndex=utils.toDecimal(log.transactionIndex);if(log.logIndex)
log.logIndex=utils.toDecimal(log.logIndex);return log;};var inputPostFormatter=function(post){post.ttl=utils.fromDecimal(post.ttl);post.workToProve=utils.fromDecimal(post.workToProve);post.priority=utils.fromDecimal(post.priority);if(!utils.isArray(post.topics)){post.topics=post.topics?[post.topics]:[];}
post.topics=post.topics.map(function(topic){return(topic.indexOf('0x')===0)?topic:utils.fromUtf8(topic);});return post;};var outputPostFormatter=function(post){post.expiry=utils.toDecimal(post.expiry);post.sent=utils.toDecimal(post.sent);post.ttl=utils.toDecimal(post.ttl);post.workProved=utils.toDecimal(post.workProved);if(!post.topics){post.topics=[];}
post.topics=post.topics.map(function(topic){return utils.toAscii(topic);});return post;};var inputAddressFormatter=function(address){var iban=new Iban(address);if(iban.isValid()&&iban.isDirect()){return'0x'+iban.address();}else if(utils.isStrictAddress(address)){return address;}else if(utils.isAddress(address)){return'0x'+address;}
throw new Error('invalid address');};var outputSyncingFormatter=function(result){if(!result){return result;}
result.startingBlock=utils.toDecimal(result.startingBlock);result.currentBlock=utils.toDecimal(result.currentBlock);result.highestBlock=utils.toDecimal(result.highestBlock);if(result.knownStates){result.knownStates=utils.toDecimal(result.knownStates);result.pulledStates=utils.toDecimal(result.pulledStates);}
return result;};module.exports={inputDefaultBlockNumberFormatter:inputDefaultBlockNumberFormatter,inputBlockNumberFormatter:inputBlockNumberFormatter,inputCallFormatter:inputCallFormatter,inputTransactionFormatter:inputTransactionFormatter,inputAddressFormatter:inputAddressFormatter,inputPostFormatter:inputPostFormatter,outputBigNumberFormatter:outputBigNumberFormatter,outputTransactionFormatter:outputTransactionFormatter,outputTransactionReceiptFormatter:outputTransactionReceiptFormatter,outputBlockFormatter:outputBlockFormatter,outputLogFormatter:outputLogFormatter,outputPostFormatter:outputPostFormatter,outputSyncingFormatter:outputSyncingFormatter};}),(function(module,exports,__webpack_require__){var utils=__webpack_require__(2);var errors=__webpack_require__(25);var Method=function(options){this.name=options.name;this.call=options.call;this.params=options.params||0;this.inputFormatter=options.inputFormatter;this.outputFormatter=options.outputFormatter;this.requestManager=null;};Method.prototype.setRequestManager=function(rm){this.requestManager=rm;};Method.prototype.getCall=function(args){return utils.isFunction(this.call)?this.call(args):this.call;};Method.prototype.extractCallback=function(args){if(utils.isFunction(args[args.length-1])){return args.pop();}};Method.prototype.validateArgs=function(args){if(args.length!==this.params){throw errors.InvalidNumberOfParams();}};Method.prototype.formatInput=function(args){if(!this.inputFormatter){return args;}
return this.inputFormatter.map(function(formatter,index){return formatter?formatter(args[index]):args[index];});};Method.prototype.formatOutput=function(result){return this.outputFormatter&&result?this.outputFormatter(result):result;};Method.prototype.toPayload=function(args){var call=this.getCall(args);var callback=this.extractCallback(args);var params=this.formatInput(args);this.validateArgs(params);return{method:call,params:params,callback:callback};};Method.prototype.attachToObject=function(obj){var func=this.buildCall();func.call=this.call;var name=this.name.split('.');if(name.length>1){obj[name[0]]=obj[name[0]]||{};obj[name[0]][name[1]]=func;}else{obj[name[0]]=func;}};Method.prototype.buildCall=function(){var method=this;var send=function(){var payload=method.toPayload(Array.prototype.slice.call(arguments));if(payload.callback){return method.requestManager.sendAsync(payload,function(err,result){payload.callback(err,method.formatOutput(result));});}
return method.formatOutput(method.requestManager.send(payload));};send.request=this.request.bind(this);return send;};Method.prototype.request=function(){var payload=this.toPayload(Array.prototype.slice.call(arguments));payload.format=this.formatOutput.bind(this);return payload;};module.exports=Method;}),(function(module,exports,__webpack_require__){var utils=__webpack_require__(4);var errors=__webpack_require__(21);var Method=function(options){this.name=options.name;this.call=options.call;this.params=options.params||0;this.inputFormatter=options.inputFormatter;this.outputFormatter=options.outputFormatter;this.requestManager=null;};Method.prototype.setRequestManager=function(rm){this.requestManager=rm;};Method.prototype.getCall=function(args){return utils.isFunction(this.call)?this.call(args):this.call;};Method.prototype.extractCallback=function(args){if(utils.isFunction(args[args.length-1])){return args.pop();}};Method.prototype.validateArgs=function(args){if(args.length!==this.params){throw errors.InvalidNumberOfRPCParams();}};Method.prototype.formatInput=function(args){if(!this.inputFormatter){return args;}
return this.inputFormatter.map(function(formatter,index){return formatter?formatter(args[index]):args[index];});};Method.prototype.formatOutput=function(result){return this.outputFormatter&&result?this.outputFormatter(result):result;};Method.prototype.toPayload=function(args){var call=this.getCall(args);var callback=this.extractCallback(args);var params=this.formatInput(args);this.validateArgs(params);return{method:call,params:params,callback:callback};};Method.prototype.attachToObject=function(obj){var func=this.buildCall();func.call=this.call;var name=this.name.split('.');if(name.length>1){obj[name[0]]=obj[name[0]]||{};obj[name[0]][name[1]]=func;}else{obj[name[0]]=func;}};Method.prototype.buildCall=function(){var method=this;var send=function(){var payload=method.toPayload(Array.prototype.slice.call(arguments));if(payload.callback){return method.requestManager.sendAsync(payload,function(err,result){payload.callback(err,method.formatOutput(result));});}
return method.formatOutput(method.requestManager.send(payload));};send.request=this.request.bind(this);return send;};Method.prototype.request=function(){var payload=this.toPayload(Array.prototype.slice.call(arguments));payload.format=this.formatOutput.bind(this);return payload;};module.exports=Method;}),(function(module,exports,__webpack_require__){;(function(root,factory){if(true){module.exports=exports=factory(__webpack_require__(0));}
else if(typeof define==="function"&&define.amd){define(["./core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){(function(){var C=CryptoJS;var C_lib=C.lib;var WordArray=C_lib.WordArray;var C_enc=C.enc;var Base64=C_enc.Base64={stringify:function(wordArray){var words=wordArray.words;var sigBytes=wordArray.sigBytes;var map=this._map;wordArray.clamp();var base64Chars=[];for(var i=0;i<sigBytes;i+=3){var byte1=(words[i>>>2]>>>(24-(i%4)*8))&0xff;var byte2=(words[(i+1)>>>2]>>>(24-((i+1)%4)*8))&0xff;var byte3=(words[(i+2)>>>2]>>>(24-((i+2)%4)*8))&0xff;var triplet=(byte1<<16)|(byte2<<8)|byte3;for(var j=0;(j<4)&&(i+j*0.75<sigBytes);j++){base64Chars.push(map.charAt((triplet>>>(6*(3-j)))&0x3f));}}
var paddingChar=map.charAt(64);if(paddingChar){while(base64Chars.length%4){base64Chars.push(paddingChar);}}
return base64Chars.join('');},parse:function(base64Str){var base64StrLength=base64Str.length;var map=this._map;var reverseMap=this._reverseMap;if(!reverseMap){reverseMap=this._reverseMap=[];for(var j=0;j<map.length;j++){reverseMap[map.charCodeAt(j)]=j;}}
var paddingChar=map.charAt(64);if(paddingChar){var paddingIndex=base64Str.indexOf(paddingChar);if(paddingIndex!==-1){base64StrLength=paddingIndex;}}
return parseLoop(base64Str,base64StrLength,reverseMap);},_map:'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='};function parseLoop(base64Str,base64StrLength,reverseMap){var words=[];var nBytes=0;for(var i=0;i<base64StrLength;i++){if(i%4){var bits1=reverseMap[base64Str.charCodeAt(i-1)]<<((i%4)*2);var bits2=reverseMap[base64Str.charCodeAt(i)]>>>(6-(i%4)*2);words[nBytes>>>2]|=(bits1|bits2)<<(24-(nBytes%4)*8);nBytes++;}}
return WordArray.create(words,nBytes);}}());return CryptoJS.enc.Base64;}));}),(function(module,exports,__webpack_require__){;(function(root,factory,undef){if(true){module.exports=exports=factory(__webpack_require__(0),__webpack_require__(50),__webpack_require__(48));}
else if(typeof define==="function"&&define.amd){define(["./core","./sha1","./hmac"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){(function(){var C=CryptoJS;var C_lib=C.lib;var Base=C_lib.Base;var WordArray=C_lib.WordArray;var C_algo=C.algo;var MD5=C_algo.MD5;var EvpKDF=C_algo.EvpKDF=Base.extend({cfg:Base.extend({keySize:128/32,hasher:MD5,iterations:1}),init:function(cfg){this.cfg=this.cfg.extend(cfg);},compute:function(password,salt){var cfg=this.cfg;var hasher=cfg.hasher.create();var derivedKey=WordArray.create();var derivedKeyWords=derivedKey.words;var keySize=cfg.keySize;var iterations=cfg.iterations;while(derivedKeyWords.length<keySize){if(block){hasher.update(block);}
var block=hasher.update(password).finalize(salt);hasher.reset();for(var i=1;i<iterations;i++){block=hasher.finalize(block);hasher.reset();}
derivedKey.concat(block);}
derivedKey.sigBytes=keySize*4;return derivedKey;}});C.EvpKDF=function(password,salt,cfg){return EvpKDF.create(cfg).compute(password,salt);};}());return CryptoJS.EvpKDF;}));}),(function(module,exports,__webpack_require__){;(function(root,factory){if(true){module.exports=exports=factory(__webpack_require__(0));}
else if(typeof define==="function"&&define.amd){define(["./core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){(function(Math){var C=CryptoJS;var C_lib=C.lib;var WordArray=C_lib.WordArray;var Hasher=C_lib.Hasher;var C_algo=C.algo;var T=[];(function(){for(var i=0;i<64;i++){T[i]=(Math.abs(Math.sin(i+1))*0x100000000)|0;}}());var MD5=C_algo.MD5=Hasher.extend({_doReset:function(){this._hash=new WordArray.init([0x67452301,0xefcdab89,0x98badcfe,0x10325476]);},_doProcessBlock:function(M,offset){for(var i=0;i<16;i++){var offset_i=offset+i;var M_offset_i=M[offset_i];M[offset_i]=((((M_offset_i<<8)|(M_offset_i>>>24))&0x00ff00ff)|(((M_offset_i<<24)|(M_offset_i>>>8))&0xff00ff00));}
var H=this._hash.words;var M_offset_0=M[offset+0];var M_offset_1=M[offset+1];var M_offset_2=M[offset+2];var M_offset_3=M[offset+3];var M_offset_4=M[offset+4];var M_offset_5=M[offset+5];var M_offset_6=M[offset+6];var M_offset_7=M[offset+7];var M_offset_8=M[offset+8];var M_offset_9=M[offset+9];var M_offset_10=M[offset+10];var M_offset_11=M[offset+11];var M_offset_12=M[offset+12];var M_offset_13=M[offset+13];var M_offset_14=M[offset+14];var M_offset_15=M[offset+15];var a=H[0];var b=H[1];var c=H[2];var d=H[3];a=FF(a,b,c,d,M_offset_0,7,T[0]);d=FF(d,a,b,c,M_offset_1,12,T[1]);c=FF(c,d,a,b,M_offset_2,17,T[2]);b=FF(b,c,d,a,M_offset_3,22,T[3]);a=FF(a,b,c,d,M_offset_4,7,T[4]);d=FF(d,a,b,c,M_offset_5,12,T[5]);c=FF(c,d,a,b,M_offset_6,17,T[6]);b=FF(b,c,d,a,M_offset_7,22,T[7]);a=FF(a,b,c,d,M_offset_8,7,T[8]);d=FF(d,a,b,c,M_offset_9,12,T[9]);c=FF(c,d,a,b,M_offset_10,17,T[10]);b=FF(b,c,d,a,M_offset_11,22,T[11]);a=FF(a,b,c,d,M_offset_12,7,T[12]);d=FF(d,a,b,c,M_offset_13,12,T[13]);c=FF(c,d,a,b,M_offset_14,17,T[14]);b=FF(b,c,d,a,M_offset_15,22,T[15]);a=GG(a,b,c,d,M_offset_1,5,T[16]);d=GG(d,a,b,c,M_offset_6,9,T[17]);c=GG(c,d,a,b,M_offset_11,14,T[18]);b=GG(b,c,d,a,M_offset_0,20,T[19]);a=GG(a,b,c,d,M_offset_5,5,T[20]);d=GG(d,a,b,c,M_offset_10,9,T[21]);c=GG(c,d,a,b,M_offset_15,14,T[22]);b=GG(b,c,d,a,M_offset_4,20,T[23]);a=GG(a,b,c,d,M_offset_9,5,T[24]);d=GG(d,a,b,c,M_offset_14,9,T[25]);c=GG(c,d,a,b,M_offset_3,14,T[26]);b=GG(b,c,d,a,M_offset_8,20,T[27]);a=GG(a,b,c,d,M_offset_13,5,T[28]);d=GG(d,a,b,c,M_offset_2,9,T[29]);c=GG(c,d,a,b,M_offset_7,14,T[30]);b=GG(b,c,d,a,M_offset_12,20,T[31]);a=HH(a,b,c,d,M_offset_5,4,T[32]);d=HH(d,a,b,c,M_offset_8,11,T[33]);c=HH(c,d,a,b,M_offset_11,16,T[34]);b=HH(b,c,d,a,M_offset_14,23,T[35]);a=HH(a,b,c,d,M_offset_1,4,T[36]);d=HH(d,a,b,c,M_offset_4,11,T[37]);c=HH(c,d,a,b,M_offset_7,16,T[38]);b=HH(b,c,d,a,M_offset_10,23,T[39]);a=HH(a,b,c,d,M_offset_13,4,T[40]);d=HH(d,a,b,c,M_offset_0,11,T[41]);c=HH(c,d,a,b,M_offset_3,16,T[42]);b=HH(b,c,d,a,M_offset_6,23,T[43]);a=HH(a,b,c,d,M_offset_9,4,T[44]);d=HH(d,a,b,c,M_offset_12,11,T[45]);c=HH(c,d,a,b,M_offset_15,16,T[46]);b=HH(b,c,d,a,M_offset_2,23,T[47]);a=II(a,b,c,d,M_offset_0,6,T[48]);d=II(d,a,b,c,M_offset_7,10,T[49]);c=II(c,d,a,b,M_offset_14,15,T[50]);b=II(b,c,d,a,M_offset_5,21,T[51]);a=II(a,b,c,d,M_offset_12,6,T[52]);d=II(d,a,b,c,M_offset_3,10,T[53]);c=II(c,d,a,b,M_offset_10,15,T[54]);b=II(b,c,d,a,M_offset_1,21,T[55]);a=II(a,b,c,d,M_offset_8,6,T[56]);d=II(d,a,b,c,M_offset_15,10,T[57]);c=II(c,d,a,b,M_offset_6,15,T[58]);b=II(b,c,d,a,M_offset_13,21,T[59]);a=II(a,b,c,d,M_offset_4,6,T[60]);d=II(d,a,b,c,M_offset_11,10,T[61]);c=II(c,d,a,b,M_offset_2,15,T[62]);b=II(b,c,d,a,M_offset_9,21,T[63]);H[0]=(H[0]+a)|0;H[1]=(H[1]+b)|0;H[2]=(H[2]+c)|0;H[3]=(H[3]+d)|0;},_doFinalize:function(){var data=this._data;var dataWords=data.words;var nBitsTotal=this._nDataBytes*8;var nBitsLeft=data.sigBytes*8;dataWords[nBitsLeft>>>5]|=0x80<<(24-nBitsLeft%32);var nBitsTotalH=Math.floor(nBitsTotal/0x100000000);var nBitsTotalL=nBitsTotal;dataWords[(((nBitsLeft+64)>>>9)<<4)+15]=((((nBitsTotalH<<8)|(nBitsTotalH>>>24))&0x00ff00ff)|(((nBitsTotalH<<24)|(nBitsTotalH>>>8))&0xff00ff00));dataWords[(((nBitsLeft+64)>>>9)<<4)+14]=((((nBitsTotalL<<8)|(nBitsTotalL>>>24))&0x00ff00ff)|(((nBitsTotalL<<24)|(nBitsTotalL>>>8))&0xff00ff00));data.sigBytes=(dataWords.length+1)*4;this._process();var hash=this._hash;var H=hash.words;for(var i=0;i<4;i++){var H_i=H[i];H[i]=(((H_i<<8)|(H_i>>>24))&0x00ff00ff)|(((H_i<<24)|(H_i>>>8))&0xff00ff00);}
return hash;},clone:function(){var clone=Hasher.clone.call(this);clone._hash=this._hash.clone();return clone;}});function FF(a,b,c,d,x,s,t){var n=a+((b&c)|(~b&d))+x+t;return((n<<s)|(n>>>(32-s)))+b;}
function GG(a,b,c,d,x,s,t){var n=a+((b&d)|(c&~d))+x+t;return((n<<s)|(n>>>(32-s)))+b;}
function HH(a,b,c,d,x,s,t){var n=a+(b^c^d)+x+t;return((n<<s)|(n>>>(32-s)))+b;}
function II(a,b,c,d,x,s,t){var n=a+(c^(b|~d))+x+t;return((n<<s)|(n>>>(32-s)))+b;}
C.MD5=Hasher._createHelper(MD5);C.HmacMD5=Hasher._createHmacHelper(MD5);}(Math));return CryptoJS.MD5;}));}),(function(module,exports,__webpack_require__){var utils=__webpack_require__(2);var Property=function(options){this.name=options.name;this.getter=options.getter;this.setter=options.setter;this.outputFormatter=options.outputFormatter;this.inputFormatter=options.inputFormatter;this.requestManager=null;};Property.prototype.setRequestManager=function(rm){this.requestManager=rm;};Property.prototype.formatInput=function(arg){return this.inputFormatter?this.inputFormatter(arg):arg;};Property.prototype.formatOutput=function(result){return this.outputFormatter&&result!==null&&result!==undefined?this.outputFormatter(result):result;};Property.prototype.extractCallback=function(args){if(utils.isFunction(args[args.length-1])){return args.pop();}};Property.prototype.attachToObject=function(obj){var proto={get:this.buildGet(),enumerable:true};var names=this.name.split('.');var name=names[0];if(names.length>1){obj[names[0]]=obj[names[0]]||{};obj=obj[names[0]];name=names[1];}
Object.defineProperty(obj,name,proto);obj[asyncGetterName(name)]=this.buildAsyncGet();};var asyncGetterName=function(name){return'get'+name.charAt(0).toUpperCase()+name.slice(1);};Property.prototype.buildGet=function(){var property=this;return function get(){return property.formatOutput(property.requestManager.send({method:property.getter}));};};Property.prototype.buildAsyncGet=function(){var property=this;var get=function(callback){property.requestManager.sendAsync({method:property.getter},function(err,result){callback(err,property.formatOutput(result));});};get.request=this.request.bind(this);return get;};Property.prototype.request=function(){var payload={method:this.getter,params:[],callback:this.extractCallback(Array.prototype.slice.call(arguments))};payload.format=this.formatOutput.bind(this);return payload;};module.exports=Property;}),(function(module,exports,__webpack_require__){var utils=__webpack_require__(3);var errors=__webpack_require__(27);var Method=function(options){this.name=options.name;this.call=options.call;this.params=options.params||0;this.inputFormatter=options.inputFormatter;this.outputFormatter=options.outputFormatter;this.requestManager=null;};Method.prototype.setRequestManager=function(rm){this.requestManager=rm;};Method.prototype.getCall=function(args){return utils.isFunction(this.call)?this.call(args):this.call;};Method.prototype.extractCallback=function(args){if(utils.isFunction(args[args.length-1])){return args.pop();}};Method.prototype.validateArgs=function(args){if(args.length!==this.params){throw errors.InvalidNumberOfParams();}};Method.prototype.formatInput=function(args){if(!this.inputFormatter){return args;}
return this.inputFormatter.map(function(formatter,index){return formatter?formatter(args[index]):args[index];});};Method.prototype.formatOutput=function(result){return this.outputFormatter&&result?this.outputFormatter(result):result;};Method.prototype.toPayload=function(args){var call=this.getCall(args);var callback=this.extractCallback(args);var params=this.formatInput(args);this.validateArgs(params);return{method:call,params:params,callback:callback};};Method.prototype.attachToObject=function(obj){var func=this.buildCall();func.call=this.call;var name=this.name.split('.');if(name.length>1){obj[name[0]]=obj[name[0]]||{};obj[name[0]][name[1]]=func;}else{obj[name[0]]=func;}};Method.prototype.buildCall=function(){var method=this;var send=function(){var payload=method.toPayload(Array.prototype.slice.call(arguments));if(payload.callback){return method.requestManager.sendAsync(payload,function(err,result){payload.callback(err,method.formatOutput(result));});}
return method.formatOutput(method.requestManager.send(payload));};send.request=this.request.bind(this);return send;};Method.prototype.request=function(){var payload=this.toPayload(Array.prototype.slice.call(arguments));payload.format=this.formatOutput.bind(this);return payload;};module.exports=Method;}),(function(module,exports){module.exports={InvalidNumberOfSolidityArgs:function(){return new Error('Invalid number of arguments to Solidity function');},InvalidNumberOfRPCParams:function(){return new Error('Invalid number of input parameters to RPC method');},InvalidConnection:function(host){return new Error('CONNECTION ERROR: Couldn\'t connect to node '+host+'.');},InvalidProvider:function(){return new Error('Provider not set or invalid');},InvalidResponse:function(result){var message=!!result&&!!result.error&&!!result.error.message?result.error.message:'Invalid JSON RPC response: '+JSON.stringify(result);return new Error(message);},ConnectionTimeout:function(ms){return new Error('CONNECTION TIMEOUT: timeout of '+ms+' ms achived');}};}),(function(module,exports,__webpack_require__){var utils=__webpack_require__(4);var Property=function(options){this.name=options.name;this.getter=options.getter;this.setter=options.setter;this.outputFormatter=options.outputFormatter;this.inputFormatter=options.inputFormatter;this.requestManager=null;};Property.prototype.setRequestManager=function(rm){this.requestManager=rm;};Property.prototype.formatInput=function(arg){return this.inputFormatter?this.inputFormatter(arg):arg;};Property.prototype.formatOutput=function(result){return this.outputFormatter&&result!==null&&result!==undefined?this.outputFormatter(result):result;};Property.prototype.extractCallback=function(args){if(utils.isFunction(args[args.length-1])){return args.pop();}};Property.prototype.attachToObject=function(obj){var proto={get:this.buildGet(),enumerable:true};var names=this.name.split('.');var name=names[0];if(names.length>1){obj[names[0]]=obj[names[0]]||{};obj=obj[names[0]];name=names[1];}
Object.defineProperty(obj,name,proto);obj[asyncGetterName(name)]=this.buildAsyncGet();};var asyncGetterName=function(name){return'get'+name.charAt(0).toUpperCase()+name.slice(1);};Property.prototype.buildGet=function(){var property=this;return function get(){return property.formatOutput(property.requestManager.send({method:property.getter}));};};Property.prototype.buildAsyncGet=function(){var property=this;var get=function(callback){property.requestManager.sendAsync({method:property.getter},function(err,result){callback(err,property.formatOutput(result));});};get.request=this.request.bind(this);return get;};Property.prototype.request=function(){var payload={method:this.getter,params:[],callback:this.extractCallback(Array.prototype.slice.call(arguments))};payload.format=this.formatOutput.bind(this);return payload;};module.exports=Property;}),(function(module,exports,__webpack_require__){var __WEBPACK_AMD_DEFINE_RESULT__;;(function(global){'use strict';var BigNumber,crypto,parseNumeric,isNumeric=/^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,mathceil=Math.ceil,mathfloor=Math.floor,notBool=' not a boolean or binary digit',roundingMode='rounding mode',tooManyDigits='number type has more than 15 significant digits',ALPHABET='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_',BASE=1e14,LOG_BASE=14,MAX_SAFE_INTEGER=0x1fffffffffffff,POWS_TEN=[1,10,100,1e3,1e4,1e5,1e6,1e7,1e8,1e9,1e10,1e11,1e12,1e13],SQRT_BASE=1e7,MAX=1E9;function another(configObj){var div,id=0,P=BigNumber.prototype,ONE=new BigNumber(1),DECIMAL_PLACES=20,ROUNDING_MODE=4,TO_EXP_NEG=-7,TO_EXP_POS=21,MIN_EXP=-1e7,MAX_EXP=1e7,ERRORS=true,isValidInt=intValidatorWithErrors,CRYPTO=false,MODULO_MODE=1,POW_PRECISION=100,FORMAT={decimalSeparator:'.',groupSeparator:',',groupSize:3,secondaryGroupSize:0,fractionGroupSeparator:'\xA0',fractionGroupSize:0};function BigNumber(n,b){var c,e,i,num,len,str,x=this;if(!(x instanceof BigNumber)){if(ERRORS)raise(26,'constructor call without new',n);return new BigNumber(n,b);}
if(b==null||!isValidInt(b,2,64,id,'base')){if(n instanceof BigNumber){x.s=n.s;x.e=n.e;x.c=(n=n.c)?n.slice():n;id=0;return;}
if((num=typeof n=='number')&&n*0==0){x.s=1/n<0?(n=-n,-1):1;if(n===~~n){for(e=0,i=n;i>=10;i/=10,e++);x.e=e;x.c=[n];id=0;return;}
str=n+'';}else{if(!isNumeric.test(str=n+''))return parseNumeric(x,str,num);x.s=str.charCodeAt(0)===45?(str=str.slice(1),-1):1;}}else{b=b|0;str=n+'';if(b==10){x=new BigNumber(n instanceof BigNumber?n:str);return round(x,DECIMAL_PLACES+x.e+1,ROUNDING_MODE);}
if((num=typeof n=='number')&&n*0!=0||!(new RegExp('^-?'+(c='['+ALPHABET.slice(0,b)+']+')+'(?:\\.'+c+')?$',b<37?'i':'')).test(str)){return parseNumeric(x,str,num,b);}
if(num){x.s=1/n<0?(str=str.slice(1),-1):1;if(ERRORS&&str.replace(/^0\.0*|\./,'').length>15){raise(id,tooManyDigits,n);}
num=false;}else{x.s=str.charCodeAt(0)===45?(str=str.slice(1),-1):1;}
str=convertBase(str,10,b,x.s);}
if((e=str.indexOf('.'))>-1)str=str.replace('.','');if((i=str.search(/e/i))>0){if(e<0)e=i;e+=+str.slice(i+1);str=str.substring(0,i);}else if(e<0){e=str.length;}
for(i=0;str.charCodeAt(i)===48;i++);for(len=str.length;str.charCodeAt(--len)===48;);str=str.slice(i,len+1);if(str){len=str.length;if(num&&ERRORS&&len>15)raise(id,tooManyDigits,x.s*n);e=e-i-1;if(e>MAX_EXP){x.c=x.e=null;}else if(e<MIN_EXP){x.c=[x.e=0];}else{x.e=e;x.c=[];i=(e+1)%LOG_BASE;if(e<0)i+=LOG_BASE;if(i<len){if(i)x.c.push(+str.slice(0,i));for(len-=LOG_BASE;i<len;){x.c.push(+str.slice(i,i+=LOG_BASE));}
str=str.slice(i);i=LOG_BASE-str.length;}else{i-=len;}
for(;i--;str+='0');x.c.push(+str);}}else{x.c=[x.e=0];}
id=0;}
BigNumber.another=another;BigNumber.ROUND_UP=0;BigNumber.ROUND_DOWN=1;BigNumber.ROUND_CEIL=2;BigNumber.ROUND_FLOOR=3;BigNumber.ROUND_HALF_UP=4;BigNumber.ROUND_HALF_DOWN=5;BigNumber.ROUND_HALF_EVEN=6;BigNumber.ROUND_HALF_CEIL=7;BigNumber.ROUND_HALF_FLOOR=8;BigNumber.EUCLID=9;BigNumber.config=function(){var v,p,i=0,r={},a=arguments,o=a[0],has=o&&typeof o=='object'?function(){if(o.hasOwnProperty(p))return(v=o[p])!=null;}:function(){if(a.length>i)return(v=a[i++])!=null;};if(has(p='DECIMAL_PLACES')&&isValidInt(v,0,MAX,2,p)){DECIMAL_PLACES=v|0;}
r[p]=DECIMAL_PLACES;if(has(p='ROUNDING_MODE')&&isValidInt(v,0,8,2,p)){ROUNDING_MODE=v|0;}
r[p]=ROUNDING_MODE;if(has(p='EXPONENTIAL_AT')){if(isArray(v)){if(isValidInt(v[0],-MAX,0,2,p)&&isValidInt(v[1],0,MAX,2,p)){TO_EXP_NEG=v[0]|0;TO_EXP_POS=v[1]|0;}}else if(isValidInt(v,-MAX,MAX,2,p)){TO_EXP_NEG=-(TO_EXP_POS=(v<0?-v:v)|0);}}
r[p]=[TO_EXP_NEG,TO_EXP_POS];if(has(p='RANGE')){if(isArray(v)){if(isValidInt(v[0],-MAX,-1,2,p)&&isValidInt(v[1],1,MAX,2,p)){MIN_EXP=v[0]|0;MAX_EXP=v[1]|0;}}else if(isValidInt(v,-MAX,MAX,2,p)){if(v|0)MIN_EXP=-(MAX_EXP=(v<0?-v:v)|0);else if(ERRORS)raise(2,p+' cannot be zero',v);}}
r[p]=[MIN_EXP,MAX_EXP];if(has(p='ERRORS')){if(v===!!v||v===1||v===0){id=0;isValidInt=(ERRORS=!!v)?intValidatorWithErrors:intValidatorNoErrors;}else if(ERRORS){raise(2,p+notBool,v);}}
r[p]=ERRORS;if(has(p='CRYPTO')){if(v===!!v||v===1||v===0){CRYPTO=!!(v&&crypto&&typeof crypto=='object');if(v&&!CRYPTO&&ERRORS)raise(2,'crypto unavailable',crypto);}else if(ERRORS){raise(2,p+notBool,v);}}
r[p]=CRYPTO;if(has(p='MODULO_MODE')&&isValidInt(v,0,9,2,p)){MODULO_MODE=v|0;}
r[p]=MODULO_MODE;if(has(p='POW_PRECISION')&&isValidInt(v,0,MAX,2,p)){POW_PRECISION=v|0;}
r[p]=POW_PRECISION;if(has(p='FORMAT')){if(typeof v=='object'){FORMAT=v;}else if(ERRORS){raise(2,p+' not an object',v);}}
r[p]=FORMAT;return r;};BigNumber.max=function(){return maxOrMin(arguments,P.lt);};BigNumber.min=function(){return maxOrMin(arguments,P.gt);};BigNumber.random=(function(){var pow2_53=0x20000000000000;var random53bitInt=(Math.random()*pow2_53)&0x1fffff?function(){return mathfloor(Math.random()*pow2_53);}:function(){return((Math.random()*0x40000000|0)*0x800000)+
(Math.random()*0x800000|0);};return function(dp){var a,b,e,k,v,i=0,c=[],rand=new BigNumber(ONE);dp=dp==null||!isValidInt(dp,0,MAX,14)?DECIMAL_PLACES:dp|0;k=mathceil(dp/LOG_BASE);if(CRYPTO){if(crypto&&crypto.getRandomValues){a=crypto.getRandomValues(new Uint32Array(k*=2));for(;i<k;){v=a[i]*0x20000+(a[i+1]>>>11);if(v>=9e15){b=crypto.getRandomValues(new Uint32Array(2));a[i]=b[0];a[i+1]=b[1];}else{c.push(v%1e14);i+=2;}}
i=k/2;}else if(crypto&&crypto.randomBytes){a=crypto.randomBytes(k*=7);for(;i<k;){v=((a[i]&31)*0x1000000000000)+(a[i+1]*0x10000000000)+
(a[i+2]*0x100000000)+(a[i+3]*0x1000000)+
(a[i+4]<<16)+(a[i+5]<<8)+a[i+6];if(v>=9e15){crypto.randomBytes(7).copy(a,i);}else{c.push(v%1e14);i+=7;}}
i=k/7;}else if(ERRORS){raise(14,'crypto unavailable',crypto);}}
if(!i){for(;i<k;){v=random53bitInt();if(v<9e15)c[i++]=v%1e14;}}
k=c[--i];dp%=LOG_BASE;if(k&&dp){v=POWS_TEN[LOG_BASE-dp];c[i]=mathfloor(k/v)*v;}
for(;c[i]===0;c.pop(),i--);if(i<0){c=[e=0];}else{for(e=-1;c[0]===0;c.shift(),e-=LOG_BASE);for(i=1,v=c[0];v>=10;v/=10,i++);if(i<LOG_BASE)e-=LOG_BASE-i;}
rand.e=e;rand.c=c;return rand;};})();function convertBase(str,baseOut,baseIn,sign){var d,e,k,r,x,xc,y,i=str.indexOf('.'),dp=DECIMAL_PLACES,rm=ROUNDING_MODE;if(baseIn<37)str=str.toLowerCase();if(i>=0){k=POW_PRECISION;POW_PRECISION=0;str=str.replace('.','');y=new BigNumber(baseIn);x=y.pow(str.length-i);POW_PRECISION=k;y.c=toBaseOut(toFixedPoint(coeffToString(x.c),x.e),10,baseOut);y.e=y.c.length;}
xc=toBaseOut(str,baseIn,baseOut);e=k=xc.length;for(;xc[--k]==0;xc.pop());if(!xc[0])return'0';if(i<0){--e;}else{x.c=xc;x.e=e;x.s=sign;x=div(x,y,dp,rm,baseOut);xc=x.c;r=x.r;e=x.e;}
d=e+dp+1;i=xc[d];k=baseOut/2;r=r||d<0||xc[d+1]!=null;r=rm<4?(i!=null||r)&&(rm==0||rm==(x.s<0?3:2)):i>k||i==k&&(rm==4||r||rm==6&&xc[d-1]&1||rm==(x.s<0?8:7));if(d<1||!xc[0]){str=r?toFixedPoint('1',-dp):'0';}else{xc.length=d;if(r){for(--baseOut;++xc[--d]>baseOut;){xc[d]=0;if(!d){++e;xc.unshift(1);}}}
for(k=xc.length;!xc[--k];);for(i=0,str='';i<=k;str+=ALPHABET.charAt(xc[i++]));str=toFixedPoint(str,e);}
return str;}
div=(function(){function multiply(x,k,base){var m,temp,xlo,xhi,carry=0,i=x.length,klo=k%SQRT_BASE,khi=k/SQRT_BASE|0;for(x=x.slice();i--;){xlo=x[i]%SQRT_BASE;xhi=x[i]/SQRT_BASE|0;m=khi*xlo+xhi*klo;temp=klo*xlo+((m%SQRT_BASE)*SQRT_BASE)+carry;carry=(temp/base|0)+(m/SQRT_BASE|0)+khi*xhi;x[i]=temp%base;}
if(carry)x.unshift(carry);return x;}
function compare(a,b,aL,bL){var i,cmp;if(aL!=bL){cmp=aL>bL?1:-1;}else{for(i=cmp=0;i<aL;i++){if(a[i]!=b[i]){cmp=a[i]>b[i]?1:-1;break;}}}
return cmp;}
function subtract(a,b,aL,base){var i=0;for(;aL--;){a[aL]-=i;i=a[aL]<b[aL]?1:0;a[aL]=i*base+a[aL]-b[aL];}
for(;!a[0]&&a.length>1;a.shift());}
return function(x,y,dp,rm,base){var cmp,e,i,more,n,prod,prodL,q,qc,rem,remL,rem0,xi,xL,yc0,yL,yz,s=x.s==y.s?1:-1,xc=x.c,yc=y.c;if(!xc||!xc[0]||!yc||!yc[0]){return new BigNumber(!x.s||!y.s||(xc?yc&&xc[0]==yc[0]:!yc)?NaN:xc&&xc[0]==0||!yc?s*0:s/0);}
q=new BigNumber(s);qc=q.c=[];e=x.e-y.e;s=dp+e+1;if(!base){base=BASE;e=bitFloor(x.e/LOG_BASE)-bitFloor(y.e/LOG_BASE);s=s/LOG_BASE|0;}
for(i=0;yc[i]==(xc[i]||0);i++);if(yc[i]>(xc[i]||0))e--;if(s<0){qc.push(1);more=true;}else{xL=xc.length;yL=yc.length;i=0;s+=2;n=mathfloor(base/(yc[0]+1));if(n>1){yc=multiply(yc,n,base);xc=multiply(xc,n,base);yL=yc.length;xL=xc.length;}
xi=yL;rem=xc.slice(0,yL);remL=rem.length;for(;remL<yL;rem[remL++]=0);yz=yc.slice();yz.unshift(0);yc0=yc[0];if(yc[1]>=base/2)yc0++;do{n=0;cmp=compare(yc,rem,yL,remL);if(cmp<0){rem0=rem[0];if(yL!=remL)rem0=rem0*base+(rem[1]||0);n=mathfloor(rem0/yc0);if(n>1){if(n>=base)n=base-1;prod=multiply(yc,n,base);prodL=prod.length;remL=rem.length;while(compare(prod,rem,prodL,remL)==1){n--;subtract(prod,yL<prodL?yz:yc,prodL,base);prodL=prod.length;cmp=1;}}else{if(n==0){cmp=n=1;}
prod=yc.slice();prodL=prod.length;}
if(prodL<remL)prod.unshift(0);subtract(rem,prod,remL,base);remL=rem.length;if(cmp==-1){while(compare(yc,rem,yL,remL)<1){n++;subtract(rem,yL<remL?yz:yc,remL,base);remL=rem.length;}}}else if(cmp===0){n++;rem=[0];}
qc[i++]=n;if(rem[0]){rem[remL++]=xc[xi]||0;}else{rem=[xc[xi]];remL=1;}}while((xi++<xL||rem[0]!=null)&&s--);more=rem[0]!=null;if(!qc[0])qc.shift();}
if(base==BASE){for(i=1,s=qc[0];s>=10;s/=10,i++);round(q,dp+(q.e=i+e*LOG_BASE-1)+1,rm,more);}else{q.e=e;q.r=+more;}
return q;};})();function format(n,i,rm,caller){var c0,e,ne,len,str;rm=rm!=null&&isValidInt(rm,0,8,caller,roundingMode)?rm|0:ROUNDING_MODE;if(!n.c)return n.toString();c0=n.c[0];ne=n.e;if(i==null){str=coeffToString(n.c);str=caller==19||caller==24&&ne<=TO_EXP_NEG?toExponential(str,ne):toFixedPoint(str,ne);}else{n=round(new BigNumber(n),i,rm);e=n.e;str=coeffToString(n.c);len=str.length;if(caller==19||caller==24&&(i<=e||e<=TO_EXP_NEG)){for(;len<i;str+='0',len++);str=toExponential(str,e);}else{i-=ne;str=toFixedPoint(str,e);if(e+1>len){if(--i>0)for(str+='.';i--;str+='0');}else{i+=e-len;if(i>0){if(e+1==len)str+='.';for(;i--;str+='0');}}}}
return n.s<0&&c0?'-'+str:str;}
function maxOrMin(args,method){var m,n,i=0;if(isArray(args[0]))args=args[0];m=new BigNumber(args[0]);for(;++i<args.length;){n=new BigNumber(args[i]);if(!n.s){m=n;break;}else if(method.call(m,n)){m=n;}}
return m;}
function intValidatorWithErrors(n,min,max,caller,name){if(n<min||n>max||n!=truncate(n)){raise(caller,(name||'decimal places')+
(n<min||n>max?' out of range':' not an integer'),n);}
return true;}
function normalise(n,c,e){var i=1,j=c.length;for(;!c[--j];c.pop());for(j=c[0];j>=10;j/=10,i++);if((e=i+e*LOG_BASE-1)>MAX_EXP){n.c=n.e=null;}else if(e<MIN_EXP){n.c=[n.e=0];}else{n.e=e;n.c=c;}
return n;}
parseNumeric=(function(){var basePrefix=/^(-?)0([xbo])/i,dotAfter=/^([^.]+)\.$/,dotBefore=/^\.([^.]+)$/,isInfinityOrNaN=/^-?(Infinity|NaN)$/,whitespaceOrPlus=/^\s*\+|^\s+|\s+$/g;return function(x,str,num,b){var base,s=num?str:str.replace(whitespaceOrPlus,'');if(isInfinityOrNaN.test(s)){x.s=isNaN(s)?null:s<0?-1:1;}else{if(!num){s=s.replace(basePrefix,function(m,p1,p2){base=(p2=p2.toLowerCase())=='x'?16:p2=='b'?2:8;return!b||b==base?p1:m;});if(b){base=b;s=s.replace(dotAfter,'$1').replace(dotBefore,'0.$1');}
if(str!=s)return new BigNumber(s,base);}
if(ERRORS)raise(id,'not a'+(b?' base '+b:'')+' number',str);x.s=null;}
x.c=x.e=null;id=0;}})();function raise(caller,msg,val){var error=new Error(['new BigNumber','cmp','config','div','divToInt','eq','gt','gte','lt','lte','minus','mod','plus','precision','random','round','shift','times','toDigits','toExponential','toFixed','toFormat','toFraction','pow','toPrecision','toString','BigNumber'][caller]+'() '+msg+': '+val);error.name='BigNumber Error';id=0;throw error;}
function round(x,sd,rm,r){var d,i,j,k,n,ni,rd,xc=x.c,pows10=POWS_TEN;if(xc){out:{for(d=1,k=xc[0];k>=10;k/=10,d++);i=sd-d;if(i<0){i+=LOG_BASE;j=sd;n=xc[ni=0];rd=n/pows10[d-j-1]%10|0;}else{ni=mathceil((i+1)/LOG_BASE);if(ni>=xc.length){if(r){for(;xc.length<=ni;xc.push(0));n=rd=0;d=1;i%=LOG_BASE;j=i-LOG_BASE+1;}else{break out;}}else{n=k=xc[ni];for(d=1;k>=10;k/=10,d++);i%=LOG_BASE;j=i-LOG_BASE+d;rd=j<0?0:n/pows10[d-j-1]%10|0;}}
r=r||sd<0||xc[ni+1]!=null||(j<0?n:n%pows10[d-j-1]);r=rm<4?(rd||r)&&(rm==0||rm==(x.s<0?3:2)):rd>5||rd==5&&(rm==4||r||rm==6&&((i>0?j>0?n/pows10[d-j]:0:xc[ni-1])%10)&1||rm==(x.s<0?8:7));if(sd<1||!xc[0]){xc.length=0;if(r){sd-=x.e+1;xc[0]=pows10[sd%LOG_BASE];x.e=-sd||0;}else{xc[0]=x.e=0;}
return x;}
if(i==0){xc.length=ni;k=1;ni--;}else{xc.length=ni+1;k=pows10[LOG_BASE-i];xc[ni]=j>0?mathfloor(n/pows10[d-j]%pows10[j])*k:0;}
if(r){for(;;){if(ni==0){for(i=1,j=xc[0];j>=10;j/=10,i++);j=xc[0]+=k;for(k=1;j>=10;j/=10,k++);if(i!=k){x.e++;if(xc[0]==BASE)xc[0]=1;}
break;}else{xc[ni]+=k;if(xc[ni]!=BASE)break;xc[ni--]=0;k=1;}}}
for(i=xc.length;xc[--i]===0;xc.pop());}
if(x.e>MAX_EXP){x.c=x.e=null;}else if(x.e<MIN_EXP){x.c=[x.e=0];}}
return x;}
P.absoluteValue=P.abs=function(){var x=new BigNumber(this);if(x.s<0)x.s=1;return x;};P.ceil=function(){return round(new BigNumber(this),this.e+1,2);};P.comparedTo=P.cmp=function(y,b){id=1;return compare(this,new BigNumber(y,b));};P.decimalPlaces=P.dp=function(){var n,v,c=this.c;if(!c)return null;n=((v=c.length-1)-bitFloor(this.e/LOG_BASE))*LOG_BASE;if(v=c[v])for(;v%10==0;v/=10,n--);if(n<0)n=0;return n;};P.dividedBy=P.div=function(y,b){id=3;return div(this,new BigNumber(y,b),DECIMAL_PLACES,ROUNDING_MODE);};P.dividedToIntegerBy=P.divToInt=function(y,b){id=4;return div(this,new BigNumber(y,b),0,1);};P.equals=P.eq=function(y,b){id=5;return compare(this,new BigNumber(y,b))===0;};P.floor=function(){return round(new BigNumber(this),this.e+1,3);};P.greaterThan=P.gt=function(y,b){id=6;return compare(this,new BigNumber(y,b))>0;};P.greaterThanOrEqualTo=P.gte=function(y,b){id=7;return(b=compare(this,new BigNumber(y,b)))===1||b===0;};P.isFinite=function(){return!!this.c;};P.isInteger=P.isInt=function(){return!!this.c&&bitFloor(this.e/LOG_BASE)>this.c.length-2;};P.isNaN=function(){return!this.s;};P.isNegative=P.isNeg=function(){return this.s<0;};P.isZero=function(){return!!this.c&&this.c[0]==0;};P.lessThan=P.lt=function(y,b){id=8;return compare(this,new BigNumber(y,b))<0;};P.lessThanOrEqualTo=P.lte=function(y,b){id=9;return(b=compare(this,new BigNumber(y,b)))===-1||b===0;};P.minus=P.sub=function(y,b){var i,j,t,xLTy,x=this,a=x.s;id=10;y=new BigNumber(y,b);b=y.s;if(!a||!b)return new BigNumber(NaN);if(a!=b){y.s=-b;return x.plus(y);}
var xe=x.e/LOG_BASE,ye=y.e/LOG_BASE,xc=x.c,yc=y.c;if(!xe||!ye){if(!xc||!yc)return xc?(y.s=-b,y):new BigNumber(yc?x:NaN);if(!xc[0]||!yc[0]){return yc[0]?(y.s=-b,y):new BigNumber(xc[0]?x:ROUNDING_MODE==3?-0:0);}}
xe=bitFloor(xe);ye=bitFloor(ye);xc=xc.slice();if(a=xe-ye){if(xLTy=a<0){a=-a;t=xc;}else{ye=xe;t=yc;}
t.reverse();for(b=a;b--;t.push(0));t.reverse();}else{j=(xLTy=(a=xc.length)<(b=yc.length))?a:b;for(a=b=0;b<j;b++){if(xc[b]!=yc[b]){xLTy=xc[b]<yc[b];break;}}}
if(xLTy)t=xc,xc=yc,yc=t,y.s=-y.s;b=(j=yc.length)-(i=xc.length);if(b>0)for(;b--;xc[i++]=0);b=BASE-1;for(;j>a;){if(xc[--j]<yc[j]){for(i=j;i&&!xc[--i];xc[i]=b);--xc[i];xc[j]+=BASE;}
xc[j]-=yc[j];}
for(;xc[0]==0;xc.shift(),--ye);if(!xc[0]){y.s=ROUNDING_MODE==3?-1:1;y.c=[y.e=0];return y;}
return normalise(y,xc,ye);};P.modulo=P.mod=function(y,b){var q,s,x=this;id=11;y=new BigNumber(y,b);if(!x.c||!y.s||y.c&&!y.c[0]){return new BigNumber(NaN);}else if(!y.c||x.c&&!x.c[0]){return new BigNumber(x);}
if(MODULO_MODE==9){s=y.s;y.s=1;q=div(x,y,0,3);y.s=s;q.s*=s;}else{q=div(x,y,0,MODULO_MODE);}
return x.minus(q.times(y));};P.negated=P.neg=function(){var x=new BigNumber(this);x.s=-x.s||null;return x;};P.plus=P.add=function(y,b){var t,x=this,a=x.s;id=12;y=new BigNumber(y,b);b=y.s;if(!a||!b)return new BigNumber(NaN);if(a!=b){y.s=-b;return x.minus(y);}
var xe=x.e/LOG_BASE,ye=y.e/LOG_BASE,xc=x.c,yc=y.c;if(!xe||!ye){if(!xc||!yc)return new BigNumber(a/0);if(!xc[0]||!yc[0])return yc[0]?y:new BigNumber(xc[0]?x:a*0);}
xe=bitFloor(xe);ye=bitFloor(ye);xc=xc.slice();if(a=xe-ye){if(a>0){ye=xe;t=yc;}else{a=-a;t=xc;}
t.reverse();for(;a--;t.push(0));t.reverse();}
a=xc.length;b=yc.length;if(a-b<0)t=yc,yc=xc,xc=t,b=a;for(a=0;b;){a=(xc[--b]=xc[b]+yc[b]+a)/BASE|0;xc[b]%=BASE;}
if(a){xc.unshift(a);++ye;}
return normalise(y,xc,ye);};P.precision=P.sd=function(z){var n,v,x=this,c=x.c;if(z!=null&&z!==!!z&&z!==1&&z!==0){if(ERRORS)raise(13,'argument'+notBool,z);if(z!=!!z)z=null;}
if(!c)return null;v=c.length-1;n=v*LOG_BASE+1;if(v=c[v]){for(;v%10==0;v/=10,n--);for(v=c[0];v>=10;v/=10,n++);}
if(z&&x.e+1>n)n=x.e+1;return n;};P.round=function(dp,rm){var n=new BigNumber(this);if(dp==null||isValidInt(dp,0,MAX,15)){round(n,~~dp+this.e+1,rm==null||!isValidInt(rm,0,8,15,roundingMode)?ROUNDING_MODE:rm|0);}
return n;};P.shift=function(k){var n=this;return isValidInt(k,-MAX_SAFE_INTEGER,MAX_SAFE_INTEGER,16,'argument')?n.times('1e'+truncate(k)):new BigNumber(n.c&&n.c[0]&&(k<-MAX_SAFE_INTEGER||k>MAX_SAFE_INTEGER)?n.s*(k<0?0:1/0):n);};P.squareRoot=P.sqrt=function(){var m,n,r,rep,t,x=this,c=x.c,s=x.s,e=x.e,dp=DECIMAL_PLACES+4,half=new BigNumber('0.5');if(s!==1||!c||!c[0]){return new BigNumber(!s||s<0&&(!c||c[0])?NaN:c?x:1/0);}
s=Math.sqrt(+x);if(s==0||s==1/0){n=coeffToString(c);if((n.length+e)%2==0)n+='0';s=Math.sqrt(n);e=bitFloor((e+1)/2)-(e<0||e%2);if(s==1/0){n='1e'+e;}else{n=s.toExponential();n=n.slice(0,n.indexOf('e')+1)+e;}
r=new BigNumber(n);}else{r=new BigNumber(s+'');}
if(r.c[0]){e=r.e;s=e+dp;if(s<3)s=0;for(;;){t=r;r=half.times(t.plus(div(x,t,dp,1)));if(coeffToString(t.c).slice(0,s)===(n=coeffToString(r.c)).slice(0,s)){if(r.e<e)--s;n=n.slice(s-3,s+1);if(n=='9999'||!rep&&n=='4999'){if(!rep){round(t,t.e+DECIMAL_PLACES+2,0);if(t.times(t).eq(x)){r=t;break;}}
dp+=4;s+=4;rep=1;}else{if(!+n||!+n.slice(1)&&n.charAt(0)=='5'){round(r,r.e+DECIMAL_PLACES+2,1);m=!r.times(r).eq(x);}
break;}}}}
return round(r,r.e+DECIMAL_PLACES+1,ROUNDING_MODE,m);};P.times=P.mul=function(y,b){var c,e,i,j,k,m,xcL,xlo,xhi,ycL,ylo,yhi,zc,base,sqrtBase,x=this,xc=x.c,yc=(id=17,y=new BigNumber(y,b)).c;if(!xc||!yc||!xc[0]||!yc[0]){if(!x.s||!y.s||xc&&!xc[0]&&!yc||yc&&!yc[0]&&!xc){y.c=y.e=y.s=null;}else{y.s*=x.s;if(!xc||!yc){y.c=y.e=null;}else{y.c=[0];y.e=0;}}
return y;}
e=bitFloor(x.e/LOG_BASE)+bitFloor(y.e/LOG_BASE);y.s*=x.s;xcL=xc.length;ycL=yc.length;if(xcL<ycL)zc=xc,xc=yc,yc=zc,i=xcL,xcL=ycL,ycL=i;for(i=xcL+ycL,zc=[];i--;zc.push(0));base=BASE;sqrtBase=SQRT_BASE;for(i=ycL;--i>=0;){c=0;ylo=yc[i]%sqrtBase;yhi=yc[i]/sqrtBase|0;for(k=xcL,j=i+k;j>i;){xlo=xc[--k]%sqrtBase;xhi=xc[k]/sqrtBase|0;m=yhi*xlo+xhi*ylo;xlo=ylo*xlo+((m%sqrtBase)*sqrtBase)+zc[j]+c;c=(xlo/base|0)+(m/sqrtBase|0)+yhi*xhi;zc[j--]=xlo%base;}
zc[j]=c;}
if(c){++e;}else{zc.shift();}
return normalise(y,zc,e);};P.toDigits=function(sd,rm){var n=new BigNumber(this);sd=sd==null||!isValidInt(sd,1,MAX,18,'precision')?null:sd|0;rm=rm==null||!isValidInt(rm,0,8,18,roundingMode)?ROUNDING_MODE:rm|0;return sd?round(n,sd,rm):n;};P.toExponential=function(dp,rm){return format(this,dp!=null&&isValidInt(dp,0,MAX,19)?~~dp+1:null,rm,19);};P.toFixed=function(dp,rm){return format(this,dp!=null&&isValidInt(dp,0,MAX,20)?~~dp+this.e+1:null,rm,20);};P.toFormat=function(dp,rm){var str=format(this,dp!=null&&isValidInt(dp,0,MAX,21)?~~dp+this.e+1:null,rm,21);if(this.c){var i,arr=str.split('.'),g1=+FORMAT.groupSize,g2=+FORMAT.secondaryGroupSize,groupSeparator=FORMAT.groupSeparator,intPart=arr[0],fractionPart=arr[1],isNeg=this.s<0,intDigits=isNeg?intPart.slice(1):intPart,len=intDigits.length;if(g2)i=g1,g1=g2,g2=i,len-=i;if(g1>0&&len>0){i=len%g1||g1;intPart=intDigits.substr(0,i);for(;i<len;i+=g1){intPart+=groupSeparator+intDigits.substr(i,g1);}
if(g2>0)intPart+=groupSeparator+intDigits.slice(i);if(isNeg)intPart='-'+intPart;}
str=fractionPart?intPart+FORMAT.decimalSeparator+((g2=+FORMAT.fractionGroupSize)?fractionPart.replace(new RegExp('\\d{'+g2+'}\\B','g'),'$&'+FORMAT.fractionGroupSeparator):fractionPart):intPart;}
return str;};P.toFraction=function(md){var arr,d0,d2,e,exp,n,n0,q,s,k=ERRORS,x=this,xc=x.c,d=new BigNumber(ONE),n1=d0=new BigNumber(ONE),d1=n0=new BigNumber(ONE);if(md!=null){ERRORS=false;n=new BigNumber(md);ERRORS=k;if(!(k=n.isInt())||n.lt(ONE)){if(ERRORS){raise(22,'max denominator '+(k?'out of range':'not an integer'),md);}
md=!k&&n.c&&round(n,n.e+1,1).gte(ONE)?n:null;}}
if(!xc)return x.toString();s=coeffToString(xc);e=d.e=s.length-x.e-1;d.c[0]=POWS_TEN[(exp=e%LOG_BASE)<0?LOG_BASE+exp:exp];md=!md||n.cmp(d)>0?(e>0?d:n1):n;exp=MAX_EXP;MAX_EXP=1/0;n=new BigNumber(s);n0.c[0]=0;for(;;){q=div(n,d,0,1);d2=d0.plus(q.times(d1));if(d2.cmp(md)==1)break;d0=d1;d1=d2;n1=n0.plus(q.times(d2=n1));n0=d2;d=n.minus(q.times(d2=d));n=d2;}
d2=div(md.minus(d0),d1,0,1);n0=n0.plus(d2.times(n1));d0=d0.plus(d2.times(d1));n0.s=n1.s=x.s;e*=2;arr=div(n1,d1,e,ROUNDING_MODE).minus(x).abs().cmp(div(n0,d0,e,ROUNDING_MODE).minus(x).abs())<1?[n1.toString(),d1.toString()]:[n0.toString(),d0.toString()];MAX_EXP=exp;return arr;};P.toNumber=function(){var x=this;return+x||(x.s?x.s*0:NaN);};P.toPower=P.pow=function(n){var k,y,i=mathfloor(n<0?-n:+n),x=this;if(!isValidInt(n,-MAX_SAFE_INTEGER,MAX_SAFE_INTEGER,23,'exponent')&&(!isFinite(n)||i>MAX_SAFE_INTEGER&&(n/=0)||parseFloat(n)!=n&&!(n=NaN))){return new BigNumber(Math.pow(+x,n));}
k=POW_PRECISION?mathceil(POW_PRECISION/LOG_BASE+2):0;y=new BigNumber(ONE);for(;;){if(i%2){y=y.times(x);if(!y.c)break;if(k&&y.c.length>k)y.c.length=k;}
i=mathfloor(i/2);if(!i)break;x=x.times(x);if(k&&x.c&&x.c.length>k)x.c.length=k;}
if(n<0)y=ONE.div(y);return k?round(y,POW_PRECISION,ROUNDING_MODE):y;};P.toPrecision=function(sd,rm){return format(this,sd!=null&&isValidInt(sd,1,MAX,24,'precision')?sd|0:null,rm,24);};P.toString=function(b){var str,n=this,s=n.s,e=n.e;if(e===null){if(s){str='Infinity';if(s<0)str='-'+str;}else{str='NaN';}}else{str=coeffToString(n.c);if(b==null||!isValidInt(b,2,64,25,'base')){str=e<=TO_EXP_NEG||e>=TO_EXP_POS?toExponential(str,e):toFixedPoint(str,e);}else{str=convertBase(toFixedPoint(str,e),b|0,10,s);}
if(s<0&&n.c[0])str='-'+str;}
return str;};P.truncated=P.trunc=function(){return round(new BigNumber(this),this.e+1,1);};P.valueOf=P.toJSON=function(){return this.toString();};if(configObj!=null)BigNumber.config(configObj);return BigNumber;}
function bitFloor(n){var i=n|0;return n>0||n===i?i:i-1;}
function coeffToString(a){var s,z,i=1,j=a.length,r=a[0]+'';for(;i<j;){s=a[i++]+'';z=LOG_BASE-s.length;for(;z--;s='0'+s);r+=s;}
for(j=r.length;r.charCodeAt(--j)===48;);return r.slice(0,j+1||1);}
function compare(x,y){var a,b,xc=x.c,yc=y.c,i=x.s,j=y.s,k=x.e,l=y.e;if(!i||!j)return null;a=xc&&!xc[0];b=yc&&!yc[0];if(a||b)return a?b?0:-j:i;if(i!=j)return i;a=i<0;b=k==l;if(!xc||!yc)return b?0:!xc^a?1:-1;if(!b)return k>l^a?1:-1;j=(k=xc.length)<(l=yc.length)?k:l;for(i=0;i<j;i++)if(xc[i]!=yc[i])return xc[i]>yc[i]^a?1:-1;return k==l?0:k>l^a?1:-1;}
function intValidatorNoErrors(n,min,max){return(n=truncate(n))>=min&&n<=max;}
function isArray(obj){return Object.prototype.toString.call(obj)=='[object Array]';}
function toBaseOut(str,baseIn,baseOut){var j,arr=[0],arrL,i=0,len=str.length;for(;i<len;){for(arrL=arr.length;arrL--;arr[arrL]*=baseIn);arr[j=0]+=ALPHABET.indexOf(str.charAt(i++));for(;j<arr.length;j++){if(arr[j]>baseOut-1){if(arr[j+1]==null)arr[j+1]=0;arr[j+1]+=arr[j]/baseOut|0;arr[j]%=baseOut;}}}
return arr.reverse();}
function toExponential(str,e){return(str.length>1?str.charAt(0)+'.'+str.slice(1):str)+
(e<0?'e':'e+')+e;}
function toFixedPoint(str,e){var len,z;if(e<0){for(z='0.';++e;z+='0');str=z+str;}else{len=str.length;if(++e>len){for(z='0',e-=len;--e;z+='0');str+=z;}else if(e<len){str=str.slice(0,e)+'.'+str.slice(e);}}
return str;}
function truncate(n){n=parseFloat(n);return n<0?mathceil(n):mathfloor(n);}
BigNumber=another();if(true){!(__WEBPACK_AMD_DEFINE_RESULT__=function(){return BigNumber;}.call(exports,__webpack_require__,exports,module),__WEBPACK_AMD_DEFINE_RESULT__!==undefined&&(module.exports=__WEBPACK_AMD_DEFINE_RESULT__));}else if(typeof module!='undefined'&&module.exports){module.exports=BigNumber;if(!crypto)try{crypto=require('crypto');}catch(e){}}else{global.BigNumber=BigNumber;}})(this);}),(function(module,exports,__webpack_require__){var CryptoJS=__webpack_require__(49);var sha3=__webpack_require__(32);module.exports=function(value,options){if(options&&options.encoding==='hex'){if(value.length>2&&value.substr(0,2)==='0x'){value=value.substr(2);}
value=CryptoJS.enc.Hex.parse(value);}
return sha3(value,{outputLength:256}).toString();};}),(function(module,exports){module.exports={InvalidNumberOfParams:function(){return new Error('Invalid number of input parameters');},InvalidConnection:function(host){return new Error('CONNECTION ERROR: Couldn\'t connect to node '+host+'.');},InvalidProvider:function(){return new Error('Provider not set or invalid');},InvalidResponse:function(result){var message=!!result&&!!result.error&&!!result.error.message?result.error.message:'Invalid JSON RPC response: '+JSON.stringify(result);return new Error(message);},ConnectionTimeout:function(ms){return new Error('CONNECTION TIMEOUT: timeout of '+ms+' ms achived');}};}),(function(module,exports,__webpack_require__){var CryptoJS=__webpack_require__(49);var sha3=__webpack_require__(32);module.exports=function(value,options){if(options&&options.encoding==='hex'){if(value.length>2&&value.substr(0,2)==='0x'){value=value.substr(2);}
value=CryptoJS.enc.Hex.parse(value);}
return sha3(value,{outputLength:256}).toString();};}),(function(module,exports){module.exports={InvalidNumberOfParams:function(){return new Error('Invalid number of input parameters');},InvalidConnection:function(host){return new Error('CONNECTION ERROR: Couldn\'t connect to node '+host+'.');},InvalidProvider:function(){return new Error('Provider not set or invalid');},InvalidResponse:function(result){var message=!!result&&!!result.error&&!!result.error.message?result.error.message:'Invalid JSON RPC response: '+JSON.stringify(result);return new Error(message);}};}),(function(module,exports,__webpack_require__){var utils=__webpack_require__(3);var Property=function(options){this.name=options.name;this.getter=options.getter;this.setter=options.setter;this.outputFormatter=options.outputFormatter;this.inputFormatter=options.inputFormatter;this.requestManager=null;};Property.prototype.setRequestManager=function(rm){this.requestManager=rm;};Property.prototype.formatInput=function(arg){return this.inputFormatter?this.inputFormatter(arg):arg;};Property.prototype.formatOutput=function(result){return this.outputFormatter&&result!==null?this.outputFormatter(result):result;};Property.prototype.extractCallback=function(args){if(utils.isFunction(args[args.length-1])){return args.pop();}};Property.prototype.attachToObject=function(obj){var proto={get:this.buildGet(),enumerable:true};var names=this.name.split('.');var name=names[0];if(names.length>1){obj[names[0]]=obj[names[0]]||{};obj=obj[names[0]];name=names[1];}
Object.defineProperty(obj,name,proto);obj[asyncGetterName(name)]=this.buildAsyncGet();};var asyncGetterName=function(name){return'get'+name.charAt(0).toUpperCase()+name.slice(1);};Property.prototype.buildGet=function(){var property=this;return function get(){return property.formatOutput(property.requestManager.send({method:property.getter}));};};Property.prototype.buildAsyncGet=function(){var property=this;var get=function(callback){property.requestManager.sendAsync({method:property.getter},function(err,result){callback(err,property.formatOutput(result));});};get.request=this.request.bind(this);return get;};Property.prototype.request=function(){var payload={method:this.getter,params:[],callback:this.extractCallback(Array.prototype.slice.call(arguments))};payload.format=this.formatOutput.bind(this);return payload;};module.exports=Property;}),(function(module,exports,__webpack_require__){var CryptoJS=__webpack_require__(49);var sha3=__webpack_require__(32);module.exports=function(value,options){if(options&&options.encoding==='hex'){if(value.length>2&&value.substr(0,2)==='0x'){value=value.substr(2);}
value=CryptoJS.enc.Hex.parse(value);}
return sha3(value,{outputLength:256}).toString();};}),(function(module,exports,__webpack_require__){var __WEBPACK_AMD_DEFINE_RESULT__;;(function(global){'use strict';var BigNumber,crypto,parseNumeric,isNumeric=/^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,mathceil=Math.ceil,mathfloor=Math.floor,notBool=' not a boolean or binary digit',roundingMode='rounding mode',tooManyDigits='number type has more than 15 significant digits',ALPHABET='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_',BASE=1e14,LOG_BASE=14,MAX_SAFE_INTEGER=0x1fffffffffffff,POWS_TEN=[1,10,100,1e3,1e4,1e5,1e6,1e7,1e8,1e9,1e10,1e11,1e12,1e13],SQRT_BASE=1e7,MAX=1E9;function another(configObj){var div,id=0,P=BigNumber.prototype,ONE=new BigNumber(1),DECIMAL_PLACES=20,ROUNDING_MODE=4,TO_EXP_NEG=-7,TO_EXP_POS=21,MIN_EXP=-1e7,MAX_EXP=1e7,ERRORS=true,isValidInt=intValidatorWithErrors,CRYPTO=false,MODULO_MODE=1,POW_PRECISION=100,FORMAT={decimalSeparator:'.',groupSeparator:',',groupSize:3,secondaryGroupSize:0,fractionGroupSeparator:'\xA0',fractionGroupSize:0};function BigNumber(n,b){var c,e,i,num,len,str,x=this;if(!(x instanceof BigNumber)){if(ERRORS)raise(26,'constructor call without new',n);return new BigNumber(n,b);}
if(b==null||!isValidInt(b,2,64,id,'base')){if(n instanceof BigNumber){x.s=n.s;x.e=n.e;x.c=(n=n.c)?n.slice():n;id=0;return;}
if((num=typeof n=='number')&&n*0==0){x.s=1/n<0?(n=-n,-1):1;if(n===~~n){for(e=0,i=n;i>=10;i/=10,e++);x.e=e;x.c=[n];id=0;return;}
str=n+'';}else{if(!isNumeric.test(str=n+''))return parseNumeric(x,str,num);x.s=str.charCodeAt(0)===45?(str=str.slice(1),-1):1;}}else{b=b|0;str=n+'';if(b==10){x=new BigNumber(n instanceof BigNumber?n:str);return round(x,DECIMAL_PLACES+x.e+1,ROUNDING_MODE);}
if((num=typeof n=='number')&&n*0!=0||!(new RegExp('^-?'+(c='['+ALPHABET.slice(0,b)+']+')+'(?:\\.'+c+')?$',b<37?'i':'')).test(str)){return parseNumeric(x,str,num,b);}
if(num){x.s=1/n<0?(str=str.slice(1),-1):1;if(ERRORS&&str.replace(/^0\.0*|\./,'').length>15){raise(id,tooManyDigits,n);}
num=false;}else{x.s=str.charCodeAt(0)===45?(str=str.slice(1),-1):1;}
str=convertBase(str,10,b,x.s);}
if((e=str.indexOf('.'))>-1)str=str.replace('.','');if((i=str.search(/e/i))>0){if(e<0)e=i;e+=+str.slice(i+1);str=str.substring(0,i);}else if(e<0){e=str.length;}
for(i=0;str.charCodeAt(i)===48;i++);for(len=str.length;str.charCodeAt(--len)===48;);str=str.slice(i,len+1);if(str){len=str.length;if(num&&ERRORS&&len>15)raise(id,tooManyDigits,x.s*n);e=e-i-1;if(e>MAX_EXP){x.c=x.e=null;}else if(e<MIN_EXP){x.c=[x.e=0];}else{x.e=e;x.c=[];i=(e+1)%LOG_BASE;if(e<0)i+=LOG_BASE;if(i<len){if(i)x.c.push(+str.slice(0,i));for(len-=LOG_BASE;i<len;){x.c.push(+str.slice(i,i+=LOG_BASE));}
str=str.slice(i);i=LOG_BASE-str.length;}else{i-=len;}
for(;i--;str+='0');x.c.push(+str);}}else{x.c=[x.e=0];}
id=0;}
BigNumber.another=another;BigNumber.ROUND_UP=0;BigNumber.ROUND_DOWN=1;BigNumber.ROUND_CEIL=2;BigNumber.ROUND_FLOOR=3;BigNumber.ROUND_HALF_UP=4;BigNumber.ROUND_HALF_DOWN=5;BigNumber.ROUND_HALF_EVEN=6;BigNumber.ROUND_HALF_CEIL=7;BigNumber.ROUND_HALF_FLOOR=8;BigNumber.EUCLID=9;BigNumber.config=function(){var v,p,i=0,r={},a=arguments,o=a[0],has=o&&typeof o=='object'?function(){if(o.hasOwnProperty(p))return(v=o[p])!=null;}:function(){if(a.length>i)return(v=a[i++])!=null;};if(has(p='DECIMAL_PLACES')&&isValidInt(v,0,MAX,2,p)){DECIMAL_PLACES=v|0;}
r[p]=DECIMAL_PLACES;if(has(p='ROUNDING_MODE')&&isValidInt(v,0,8,2,p)){ROUNDING_MODE=v|0;}
r[p]=ROUNDING_MODE;if(has(p='EXPONENTIAL_AT')){if(isArray(v)){if(isValidInt(v[0],-MAX,0,2,p)&&isValidInt(v[1],0,MAX,2,p)){TO_EXP_NEG=v[0]|0;TO_EXP_POS=v[1]|0;}}else if(isValidInt(v,-MAX,MAX,2,p)){TO_EXP_NEG=-(TO_EXP_POS=(v<0?-v:v)|0);}}
r[p]=[TO_EXP_NEG,TO_EXP_POS];if(has(p='RANGE')){if(isArray(v)){if(isValidInt(v[0],-MAX,-1,2,p)&&isValidInt(v[1],1,MAX,2,p)){MIN_EXP=v[0]|0;MAX_EXP=v[1]|0;}}else if(isValidInt(v,-MAX,MAX,2,p)){if(v|0)MIN_EXP=-(MAX_EXP=(v<0?-v:v)|0);else if(ERRORS)raise(2,p+' cannot be zero',v);}}
r[p]=[MIN_EXP,MAX_EXP];if(has(p='ERRORS')){if(v===!!v||v===1||v===0){id=0;isValidInt=(ERRORS=!!v)?intValidatorWithErrors:intValidatorNoErrors;}else if(ERRORS){raise(2,p+notBool,v);}}
r[p]=ERRORS;if(has(p='CRYPTO')){if(v===!!v||v===1||v===0){CRYPTO=!!(v&&crypto&&typeof crypto=='object');if(v&&!CRYPTO&&ERRORS)raise(2,'crypto unavailable',crypto);}else if(ERRORS){raise(2,p+notBool,v);}}
r[p]=CRYPTO;if(has(p='MODULO_MODE')&&isValidInt(v,0,9,2,p)){MODULO_MODE=v|0;}
r[p]=MODULO_MODE;if(has(p='POW_PRECISION')&&isValidInt(v,0,MAX,2,p)){POW_PRECISION=v|0;}
r[p]=POW_PRECISION;if(has(p='FORMAT')){if(typeof v=='object'){FORMAT=v;}else if(ERRORS){raise(2,p+' not an object',v);}}
r[p]=FORMAT;return r;};BigNumber.max=function(){return maxOrMin(arguments,P.lt);};BigNumber.min=function(){return maxOrMin(arguments,P.gt);};BigNumber.random=(function(){var pow2_53=0x20000000000000;var random53bitInt=(Math.random()*pow2_53)&0x1fffff?function(){return mathfloor(Math.random()*pow2_53);}:function(){return((Math.random()*0x40000000|0)*0x800000)+
(Math.random()*0x800000|0);};return function(dp){var a,b,e,k,v,i=0,c=[],rand=new BigNumber(ONE);dp=dp==null||!isValidInt(dp,0,MAX,14)?DECIMAL_PLACES:dp|0;k=mathceil(dp/LOG_BASE);if(CRYPTO){if(crypto&&crypto.getRandomValues){a=crypto.getRandomValues(new Uint32Array(k*=2));for(;i<k;){v=a[i]*0x20000+(a[i+1]>>>11);if(v>=9e15){b=crypto.getRandomValues(new Uint32Array(2));a[i]=b[0];a[i+1]=b[1];}else{c.push(v%1e14);i+=2;}}
i=k/2;}else if(crypto&&crypto.randomBytes){a=crypto.randomBytes(k*=7);for(;i<k;){v=((a[i]&31)*0x1000000000000)+(a[i+1]*0x10000000000)+
(a[i+2]*0x100000000)+(a[i+3]*0x1000000)+
(a[i+4]<<16)+(a[i+5]<<8)+a[i+6];if(v>=9e15){crypto.randomBytes(7).copy(a,i);}else{c.push(v%1e14);i+=7;}}
i=k/7;}else if(ERRORS){raise(14,'crypto unavailable',crypto);}}
if(!i){for(;i<k;){v=random53bitInt();if(v<9e15)c[i++]=v%1e14;}}
k=c[--i];dp%=LOG_BASE;if(k&&dp){v=POWS_TEN[LOG_BASE-dp];c[i]=mathfloor(k/v)*v;}
for(;c[i]===0;c.pop(),i--);if(i<0){c=[e=0];}else{for(e=-1;c[0]===0;c.shift(),e-=LOG_BASE);for(i=1,v=c[0];v>=10;v/=10,i++);if(i<LOG_BASE)e-=LOG_BASE-i;}
rand.e=e;rand.c=c;return rand;};})();function convertBase(str,baseOut,baseIn,sign){var d,e,k,r,x,xc,y,i=str.indexOf('.'),dp=DECIMAL_PLACES,rm=ROUNDING_MODE;if(baseIn<37)str=str.toLowerCase();if(i>=0){k=POW_PRECISION;POW_PRECISION=0;str=str.replace('.','');y=new BigNumber(baseIn);x=y.pow(str.length-i);POW_PRECISION=k;y.c=toBaseOut(toFixedPoint(coeffToString(x.c),x.e),10,baseOut);y.e=y.c.length;}
xc=toBaseOut(str,baseIn,baseOut);e=k=xc.length;for(;xc[--k]==0;xc.pop());if(!xc[0])return'0';if(i<0){--e;}else{x.c=xc;x.e=e;x.s=sign;x=div(x,y,dp,rm,baseOut);xc=x.c;r=x.r;e=x.e;}
d=e+dp+1;i=xc[d];k=baseOut/2;r=r||d<0||xc[d+1]!=null;r=rm<4?(i!=null||r)&&(rm==0||rm==(x.s<0?3:2)):i>k||i==k&&(rm==4||r||rm==6&&xc[d-1]&1||rm==(x.s<0?8:7));if(d<1||!xc[0]){str=r?toFixedPoint('1',-dp):'0';}else{xc.length=d;if(r){for(--baseOut;++xc[--d]>baseOut;){xc[d]=0;if(!d){++e;xc.unshift(1);}}}
for(k=xc.length;!xc[--k];);for(i=0,str='';i<=k;str+=ALPHABET.charAt(xc[i++]));str=toFixedPoint(str,e);}
return str;}
div=(function(){function multiply(x,k,base){var m,temp,xlo,xhi,carry=0,i=x.length,klo=k%SQRT_BASE,khi=k/SQRT_BASE|0;for(x=x.slice();i--;){xlo=x[i]%SQRT_BASE;xhi=x[i]/SQRT_BASE|0;m=khi*xlo+xhi*klo;temp=klo*xlo+((m%SQRT_BASE)*SQRT_BASE)+carry;carry=(temp/base|0)+(m/SQRT_BASE|0)+khi*xhi;x[i]=temp%base;}
if(carry)x.unshift(carry);return x;}
function compare(a,b,aL,bL){var i,cmp;if(aL!=bL){cmp=aL>bL?1:-1;}else{for(i=cmp=0;i<aL;i++){if(a[i]!=b[i]){cmp=a[i]>b[i]?1:-1;break;}}}
return cmp;}
function subtract(a,b,aL,base){var i=0;for(;aL--;){a[aL]-=i;i=a[aL]<b[aL]?1:0;a[aL]=i*base+a[aL]-b[aL];}
for(;!a[0]&&a.length>1;a.shift());}
return function(x,y,dp,rm,base){var cmp,e,i,more,n,prod,prodL,q,qc,rem,remL,rem0,xi,xL,yc0,yL,yz,s=x.s==y.s?1:-1,xc=x.c,yc=y.c;if(!xc||!xc[0]||!yc||!yc[0]){return new BigNumber(!x.s||!y.s||(xc?yc&&xc[0]==yc[0]:!yc)?NaN:xc&&xc[0]==0||!yc?s*0:s/0);}
q=new BigNumber(s);qc=q.c=[];e=x.e-y.e;s=dp+e+1;if(!base){base=BASE;e=bitFloor(x.e/LOG_BASE)-bitFloor(y.e/LOG_BASE);s=s/LOG_BASE|0;}
for(i=0;yc[i]==(xc[i]||0);i++);if(yc[i]>(xc[i]||0))e--;if(s<0){qc.push(1);more=true;}else{xL=xc.length;yL=yc.length;i=0;s+=2;n=mathfloor(base/(yc[0]+1));if(n>1){yc=multiply(yc,n,base);xc=multiply(xc,n,base);yL=yc.length;xL=xc.length;}
xi=yL;rem=xc.slice(0,yL);remL=rem.length;for(;remL<yL;rem[remL++]=0);yz=yc.slice();yz.unshift(0);yc0=yc[0];if(yc[1]>=base/2)yc0++;do{n=0;cmp=compare(yc,rem,yL,remL);if(cmp<0){rem0=rem[0];if(yL!=remL)rem0=rem0*base+(rem[1]||0);n=mathfloor(rem0/yc0);if(n>1){if(n>=base)n=base-1;prod=multiply(yc,n,base);prodL=prod.length;remL=rem.length;while(compare(prod,rem,prodL,remL)==1){n--;subtract(prod,yL<prodL?yz:yc,prodL,base);prodL=prod.length;cmp=1;}}else{if(n==0){cmp=n=1;}
prod=yc.slice();prodL=prod.length;}
if(prodL<remL)prod.unshift(0);subtract(rem,prod,remL,base);remL=rem.length;if(cmp==-1){while(compare(yc,rem,yL,remL)<1){n++;subtract(rem,yL<remL?yz:yc,remL,base);remL=rem.length;}}}else if(cmp===0){n++;rem=[0];}
qc[i++]=n;if(rem[0]){rem[remL++]=xc[xi]||0;}else{rem=[xc[xi]];remL=1;}}while((xi++<xL||rem[0]!=null)&&s--);more=rem[0]!=null;if(!qc[0])qc.shift();}
if(base==BASE){for(i=1,s=qc[0];s>=10;s/=10,i++);round(q,dp+(q.e=i+e*LOG_BASE-1)+1,rm,more);}else{q.e=e;q.r=+more;}
return q;};})();function format(n,i,rm,caller){var c0,e,ne,len,str;rm=rm!=null&&isValidInt(rm,0,8,caller,roundingMode)?rm|0:ROUNDING_MODE;if(!n.c)return n.toString();c0=n.c[0];ne=n.e;if(i==null){str=coeffToString(n.c);str=caller==19||caller==24&&ne<=TO_EXP_NEG?toExponential(str,ne):toFixedPoint(str,ne);}else{n=round(new BigNumber(n),i,rm);e=n.e;str=coeffToString(n.c);len=str.length;if(caller==19||caller==24&&(i<=e||e<=TO_EXP_NEG)){for(;len<i;str+='0',len++);str=toExponential(str,e);}else{i-=ne;str=toFixedPoint(str,e);if(e+1>len){if(--i>0)for(str+='.';i--;str+='0');}else{i+=e-len;if(i>0){if(e+1==len)str+='.';for(;i--;str+='0');}}}}
return n.s<0&&c0?'-'+str:str;}
function maxOrMin(args,method){var m,n,i=0;if(isArray(args[0]))args=args[0];m=new BigNumber(args[0]);for(;++i<args.length;){n=new BigNumber(args[i]);if(!n.s){m=n;break;}else if(method.call(m,n)){m=n;}}
return m;}
function intValidatorWithErrors(n,min,max,caller,name){if(n<min||n>max||n!=truncate(n)){raise(caller,(name||'decimal places')+
(n<min||n>max?' out of range':' not an integer'),n);}
return true;}
function normalise(n,c,e){var i=1,j=c.length;for(;!c[--j];c.pop());for(j=c[0];j>=10;j/=10,i++);if((e=i+e*LOG_BASE-1)>MAX_EXP){n.c=n.e=null;}else if(e<MIN_EXP){n.c=[n.e=0];}else{n.e=e;n.c=c;}
return n;}
parseNumeric=(function(){var basePrefix=/^(-?)0([xbo])/i,dotAfter=/^([^.]+)\.$/,dotBefore=/^\.([^.]+)$/,isInfinityOrNaN=/^-?(Infinity|NaN)$/,whitespaceOrPlus=/^\s*\+|^\s+|\s+$/g;return function(x,str,num,b){var base,s=num?str:str.replace(whitespaceOrPlus,'');if(isInfinityOrNaN.test(s)){x.s=isNaN(s)?null:s<0?-1:1;}else{if(!num){s=s.replace(basePrefix,function(m,p1,p2){base=(p2=p2.toLowerCase())=='x'?16:p2=='b'?2:8;return!b||b==base?p1:m;});if(b){base=b;s=s.replace(dotAfter,'$1').replace(dotBefore,'0.$1');}
if(str!=s)return new BigNumber(s,base);}
if(ERRORS)raise(id,'not a'+(b?' base '+b:'')+' number',str);x.s=null;}
x.c=x.e=null;id=0;}})();function raise(caller,msg,val){var error=new Error(['new BigNumber','cmp','config','div','divToInt','eq','gt','gte','lt','lte','minus','mod','plus','precision','random','round','shift','times','toDigits','toExponential','toFixed','toFormat','toFraction','pow','toPrecision','toString','BigNumber'][caller]+'() '+msg+': '+val);error.name='BigNumber Error';id=0;throw error;}
function round(x,sd,rm,r){var d,i,j,k,n,ni,rd,xc=x.c,pows10=POWS_TEN;if(xc){out:{for(d=1,k=xc[0];k>=10;k/=10,d++);i=sd-d;if(i<0){i+=LOG_BASE;j=sd;n=xc[ni=0];rd=n/pows10[d-j-1]%10|0;}else{ni=mathceil((i+1)/LOG_BASE);if(ni>=xc.length){if(r){for(;xc.length<=ni;xc.push(0));n=rd=0;d=1;i%=LOG_BASE;j=i-LOG_BASE+1;}else{break out;}}else{n=k=xc[ni];for(d=1;k>=10;k/=10,d++);i%=LOG_BASE;j=i-LOG_BASE+d;rd=j<0?0:n/pows10[d-j-1]%10|0;}}
r=r||sd<0||xc[ni+1]!=null||(j<0?n:n%pows10[d-j-1]);r=rm<4?(rd||r)&&(rm==0||rm==(x.s<0?3:2)):rd>5||rd==5&&(rm==4||r||rm==6&&((i>0?j>0?n/pows10[d-j]:0:xc[ni-1])%10)&1||rm==(x.s<0?8:7));if(sd<1||!xc[0]){xc.length=0;if(r){sd-=x.e+1;xc[0]=pows10[sd%LOG_BASE];x.e=-sd||0;}else{xc[0]=x.e=0;}
return x;}
if(i==0){xc.length=ni;k=1;ni--;}else{xc.length=ni+1;k=pows10[LOG_BASE-i];xc[ni]=j>0?mathfloor(n/pows10[d-j]%pows10[j])*k:0;}
if(r){for(;;){if(ni==0){for(i=1,j=xc[0];j>=10;j/=10,i++);j=xc[0]+=k;for(k=1;j>=10;j/=10,k++);if(i!=k){x.e++;if(xc[0]==BASE)xc[0]=1;}
break;}else{xc[ni]+=k;if(xc[ni]!=BASE)break;xc[ni--]=0;k=1;}}}
for(i=xc.length;xc[--i]===0;xc.pop());}
if(x.e>MAX_EXP){x.c=x.e=null;}else if(x.e<MIN_EXP){x.c=[x.e=0];}}
return x;}
P.absoluteValue=P.abs=function(){var x=new BigNumber(this);if(x.s<0)x.s=1;return x;};P.ceil=function(){return round(new BigNumber(this),this.e+1,2);};P.comparedTo=P.cmp=function(y,b){id=1;return compare(this,new BigNumber(y,b));};P.decimalPlaces=P.dp=function(){var n,v,c=this.c;if(!c)return null;n=((v=c.length-1)-bitFloor(this.e/LOG_BASE))*LOG_BASE;if(v=c[v])for(;v%10==0;v/=10,n--);if(n<0)n=0;return n;};P.dividedBy=P.div=function(y,b){id=3;return div(this,new BigNumber(y,b),DECIMAL_PLACES,ROUNDING_MODE);};P.dividedToIntegerBy=P.divToInt=function(y,b){id=4;return div(this,new BigNumber(y,b),0,1);};P.equals=P.eq=function(y,b){id=5;return compare(this,new BigNumber(y,b))===0;};P.floor=function(){return round(new BigNumber(this),this.e+1,3);};P.greaterThan=P.gt=function(y,b){id=6;return compare(this,new BigNumber(y,b))>0;};P.greaterThanOrEqualTo=P.gte=function(y,b){id=7;return(b=compare(this,new BigNumber(y,b)))===1||b===0;};P.isFinite=function(){return!!this.c;};P.isInteger=P.isInt=function(){return!!this.c&&bitFloor(this.e/LOG_BASE)>this.c.length-2;};P.isNaN=function(){return!this.s;};P.isNegative=P.isNeg=function(){return this.s<0;};P.isZero=function(){return!!this.c&&this.c[0]==0;};P.lessThan=P.lt=function(y,b){id=8;return compare(this,new BigNumber(y,b))<0;};P.lessThanOrEqualTo=P.lte=function(y,b){id=9;return(b=compare(this,new BigNumber(y,b)))===-1||b===0;};P.minus=P.sub=function(y,b){var i,j,t,xLTy,x=this,a=x.s;id=10;y=new BigNumber(y,b);b=y.s;if(!a||!b)return new BigNumber(NaN);if(a!=b){y.s=-b;return x.plus(y);}
var xe=x.e/LOG_BASE,ye=y.e/LOG_BASE,xc=x.c,yc=y.c;if(!xe||!ye){if(!xc||!yc)return xc?(y.s=-b,y):new BigNumber(yc?x:NaN);if(!xc[0]||!yc[0]){return yc[0]?(y.s=-b,y):new BigNumber(xc[0]?x:ROUNDING_MODE==3?-0:0);}}
xe=bitFloor(xe);ye=bitFloor(ye);xc=xc.slice();if(a=xe-ye){if(xLTy=a<0){a=-a;t=xc;}else{ye=xe;t=yc;}
t.reverse();for(b=a;b--;t.push(0));t.reverse();}else{j=(xLTy=(a=xc.length)<(b=yc.length))?a:b;for(a=b=0;b<j;b++){if(xc[b]!=yc[b]){xLTy=xc[b]<yc[b];break;}}}
if(xLTy)t=xc,xc=yc,yc=t,y.s=-y.s;b=(j=yc.length)-(i=xc.length);if(b>0)for(;b--;xc[i++]=0);b=BASE-1;for(;j>a;){if(xc[--j]<yc[j]){for(i=j;i&&!xc[--i];xc[i]=b);--xc[i];xc[j]+=BASE;}
xc[j]-=yc[j];}
for(;xc[0]==0;xc.shift(),--ye);if(!xc[0]){y.s=ROUNDING_MODE==3?-1:1;y.c=[y.e=0];return y;}
return normalise(y,xc,ye);};P.modulo=P.mod=function(y,b){var q,s,x=this;id=11;y=new BigNumber(y,b);if(!x.c||!y.s||y.c&&!y.c[0]){return new BigNumber(NaN);}else if(!y.c||x.c&&!x.c[0]){return new BigNumber(x);}
if(MODULO_MODE==9){s=y.s;y.s=1;q=div(x,y,0,3);y.s=s;q.s*=s;}else{q=div(x,y,0,MODULO_MODE);}
return x.minus(q.times(y));};P.negated=P.neg=function(){var x=new BigNumber(this);x.s=-x.s||null;return x;};P.plus=P.add=function(y,b){var t,x=this,a=x.s;id=12;y=new BigNumber(y,b);b=y.s;if(!a||!b)return new BigNumber(NaN);if(a!=b){y.s=-b;return x.minus(y);}
var xe=x.e/LOG_BASE,ye=y.e/LOG_BASE,xc=x.c,yc=y.c;if(!xe||!ye){if(!xc||!yc)return new BigNumber(a/0);if(!xc[0]||!yc[0])return yc[0]?y:new BigNumber(xc[0]?x:a*0);}
xe=bitFloor(xe);ye=bitFloor(ye);xc=xc.slice();if(a=xe-ye){if(a>0){ye=xe;t=yc;}else{a=-a;t=xc;}
t.reverse();for(;a--;t.push(0));t.reverse();}
a=xc.length;b=yc.length;if(a-b<0)t=yc,yc=xc,xc=t,b=a;for(a=0;b;){a=(xc[--b]=xc[b]+yc[b]+a)/BASE|0;xc[b]%=BASE;}
if(a){xc.unshift(a);++ye;}
return normalise(y,xc,ye);};P.precision=P.sd=function(z){var n,v,x=this,c=x.c;if(z!=null&&z!==!!z&&z!==1&&z!==0){if(ERRORS)raise(13,'argument'+notBool,z);if(z!=!!z)z=null;}
if(!c)return null;v=c.length-1;n=v*LOG_BASE+1;if(v=c[v]){for(;v%10==0;v/=10,n--);for(v=c[0];v>=10;v/=10,n++);}
if(z&&x.e+1>n)n=x.e+1;return n;};P.round=function(dp,rm){var n=new BigNumber(this);if(dp==null||isValidInt(dp,0,MAX,15)){round(n,~~dp+this.e+1,rm==null||!isValidInt(rm,0,8,15,roundingMode)?ROUNDING_MODE:rm|0);}
return n;};P.shift=function(k){var n=this;return isValidInt(k,-MAX_SAFE_INTEGER,MAX_SAFE_INTEGER,16,'argument')?n.times('1e'+truncate(k)):new BigNumber(n.c&&n.c[0]&&(k<-MAX_SAFE_INTEGER||k>MAX_SAFE_INTEGER)?n.s*(k<0?0:1/0):n);};P.squareRoot=P.sqrt=function(){var m,n,r,rep,t,x=this,c=x.c,s=x.s,e=x.e,dp=DECIMAL_PLACES+4,half=new BigNumber('0.5');if(s!==1||!c||!c[0]){return new BigNumber(!s||s<0&&(!c||c[0])?NaN:c?x:1/0);}
s=Math.sqrt(+x);if(s==0||s==1/0){n=coeffToString(c);if((n.length+e)%2==0)n+='0';s=Math.sqrt(n);e=bitFloor((e+1)/2)-(e<0||e%2);if(s==1/0){n='1e'+e;}else{n=s.toExponential();n=n.slice(0,n.indexOf('e')+1)+e;}
r=new BigNumber(n);}else{r=new BigNumber(s+'');}
if(r.c[0]){e=r.e;s=e+dp;if(s<3)s=0;for(;;){t=r;r=half.times(t.plus(div(x,t,dp,1)));if(coeffToString(t.c).slice(0,s)===(n=coeffToString(r.c)).slice(0,s)){if(r.e<e)--s;n=n.slice(s-3,s+1);if(n=='9999'||!rep&&n=='4999'){if(!rep){round(t,t.e+DECIMAL_PLACES+2,0);if(t.times(t).eq(x)){r=t;break;}}
dp+=4;s+=4;rep=1;}else{if(!+n||!+n.slice(1)&&n.charAt(0)=='5'){round(r,r.e+DECIMAL_PLACES+2,1);m=!r.times(r).eq(x);}
break;}}}}
return round(r,r.e+DECIMAL_PLACES+1,ROUNDING_MODE,m);};P.times=P.mul=function(y,b){var c,e,i,j,k,m,xcL,xlo,xhi,ycL,ylo,yhi,zc,base,sqrtBase,x=this,xc=x.c,yc=(id=17,y=new BigNumber(y,b)).c;if(!xc||!yc||!xc[0]||!yc[0]){if(!x.s||!y.s||xc&&!xc[0]&&!yc||yc&&!yc[0]&&!xc){y.c=y.e=y.s=null;}else{y.s*=x.s;if(!xc||!yc){y.c=y.e=null;}else{y.c=[0];y.e=0;}}
return y;}
e=bitFloor(x.e/LOG_BASE)+bitFloor(y.e/LOG_BASE);y.s*=x.s;xcL=xc.length;ycL=yc.length;if(xcL<ycL)zc=xc,xc=yc,yc=zc,i=xcL,xcL=ycL,ycL=i;for(i=xcL+ycL,zc=[];i--;zc.push(0));base=BASE;sqrtBase=SQRT_BASE;for(i=ycL;--i>=0;){c=0;ylo=yc[i]%sqrtBase;yhi=yc[i]/sqrtBase|0;for(k=xcL,j=i+k;j>i;){xlo=xc[--k]%sqrtBase;xhi=xc[k]/sqrtBase|0;m=yhi*xlo+xhi*ylo;xlo=ylo*xlo+((m%sqrtBase)*sqrtBase)+zc[j]+c;c=(xlo/base|0)+(m/sqrtBase|0)+yhi*xhi;zc[j--]=xlo%base;}
zc[j]=c;}
if(c){++e;}else{zc.shift();}
return normalise(y,zc,e);};P.toDigits=function(sd,rm){var n=new BigNumber(this);sd=sd==null||!isValidInt(sd,1,MAX,18,'precision')?null:sd|0;rm=rm==null||!isValidInt(rm,0,8,18,roundingMode)?ROUNDING_MODE:rm|0;return sd?round(n,sd,rm):n;};P.toExponential=function(dp,rm){return format(this,dp!=null&&isValidInt(dp,0,MAX,19)?~~dp+1:null,rm,19);};P.toFixed=function(dp,rm){return format(this,dp!=null&&isValidInt(dp,0,MAX,20)?~~dp+this.e+1:null,rm,20);};P.toFormat=function(dp,rm){var str=format(this,dp!=null&&isValidInt(dp,0,MAX,21)?~~dp+this.e+1:null,rm,21);if(this.c){var i,arr=str.split('.'),g1=+FORMAT.groupSize,g2=+FORMAT.secondaryGroupSize,groupSeparator=FORMAT.groupSeparator,intPart=arr[0],fractionPart=arr[1],isNeg=this.s<0,intDigits=isNeg?intPart.slice(1):intPart,len=intDigits.length;if(g2)i=g1,g1=g2,g2=i,len-=i;if(g1>0&&len>0){i=len%g1||g1;intPart=intDigits.substr(0,i);for(;i<len;i+=g1){intPart+=groupSeparator+intDigits.substr(i,g1);}
if(g2>0)intPart+=groupSeparator+intDigits.slice(i);if(isNeg)intPart='-'+intPart;}
str=fractionPart?intPart+FORMAT.decimalSeparator+((g2=+FORMAT.fractionGroupSize)?fractionPart.replace(new RegExp('\\d{'+g2+'}\\B','g'),'$&'+FORMAT.fractionGroupSeparator):fractionPart):intPart;}
return str;};P.toFraction=function(md){var arr,d0,d2,e,exp,n,n0,q,s,k=ERRORS,x=this,xc=x.c,d=new BigNumber(ONE),n1=d0=new BigNumber(ONE),d1=n0=new BigNumber(ONE);if(md!=null){ERRORS=false;n=new BigNumber(md);ERRORS=k;if(!(k=n.isInt())||n.lt(ONE)){if(ERRORS){raise(22,'max denominator '+(k?'out of range':'not an integer'),md);}
md=!k&&n.c&&round(n,n.e+1,1).gte(ONE)?n:null;}}
if(!xc)return x.toString();s=coeffToString(xc);e=d.e=s.length-x.e-1;d.c[0]=POWS_TEN[(exp=e%LOG_BASE)<0?LOG_BASE+exp:exp];md=!md||n.cmp(d)>0?(e>0?d:n1):n;exp=MAX_EXP;MAX_EXP=1/0;n=new BigNumber(s);n0.c[0]=0;for(;;){q=div(n,d,0,1);d2=d0.plus(q.times(d1));if(d2.cmp(md)==1)break;d0=d1;d1=d2;n1=n0.plus(q.times(d2=n1));n0=d2;d=n.minus(q.times(d2=d));n=d2;}
d2=div(md.minus(d0),d1,0,1);n0=n0.plus(d2.times(n1));d0=d0.plus(d2.times(d1));n0.s=n1.s=x.s;e*=2;arr=div(n1,d1,e,ROUNDING_MODE).minus(x).abs().cmp(div(n0,d0,e,ROUNDING_MODE).minus(x).abs())<1?[n1.toString(),d1.toString()]:[n0.toString(),d0.toString()];MAX_EXP=exp;return arr;};P.toNumber=function(){var x=this;return+x||(x.s?x.s*0:NaN);};P.toPower=P.pow=function(n){var k,y,i=mathfloor(n<0?-n:+n),x=this;if(!isValidInt(n,-MAX_SAFE_INTEGER,MAX_SAFE_INTEGER,23,'exponent')&&(!isFinite(n)||i>MAX_SAFE_INTEGER&&(n/=0)||parseFloat(n)!=n&&!(n=NaN))){return new BigNumber(Math.pow(+x,n));}
k=POW_PRECISION?mathceil(POW_PRECISION/LOG_BASE+2):0;y=new BigNumber(ONE);for(;;){if(i%2){y=y.times(x);if(!y.c)break;if(k&&y.c.length>k)y.c.length=k;}
i=mathfloor(i/2);if(!i)break;x=x.times(x);if(k&&x.c&&x.c.length>k)x.c.length=k;}
if(n<0)y=ONE.div(y);return k?round(y,POW_PRECISION,ROUNDING_MODE):y;};P.toPrecision=function(sd,rm){return format(this,sd!=null&&isValidInt(sd,1,MAX,24,'precision')?sd|0:null,rm,24);};P.toString=function(b){var str,n=this,s=n.s,e=n.e;if(e===null){if(s){str='Infinity';if(s<0)str='-'+str;}else{str='NaN';}}else{str=coeffToString(n.c);if(b==null||!isValidInt(b,2,64,25,'base')){str=e<=TO_EXP_NEG||e>=TO_EXP_POS?toExponential(str,e):toFixedPoint(str,e);}else{str=convertBase(toFixedPoint(str,e),b|0,10,s);}
if(s<0&&n.c[0])str='-'+str;}
return str;};P.truncated=P.trunc=function(){return round(new BigNumber(this),this.e+1,1);};P.valueOf=P.toJSON=function(){return this.toString();};if(configObj!=null)BigNumber.config(configObj);return BigNumber;}
function bitFloor(n){var i=n|0;return n>0||n===i?i:i-1;}
function coeffToString(a){var s,z,i=1,j=a.length,r=a[0]+'';for(;i<j;){s=a[i++]+'';z=LOG_BASE-s.length;for(;z--;s='0'+s);r+=s;}
for(j=r.length;r.charCodeAt(--j)===48;);return r.slice(0,j+1||1);}
function compare(x,y){var a,b,xc=x.c,yc=y.c,i=x.s,j=y.s,k=x.e,l=y.e;if(!i||!j)return null;a=xc&&!xc[0];b=yc&&!yc[0];if(a||b)return a?b?0:-j:i;if(i!=j)return i;a=i<0;b=k==l;if(!xc||!yc)return b?0:!xc^a?1:-1;if(!b)return k>l^a?1:-1;j=(k=xc.length)<(l=yc.length)?k:l;for(i=0;i<j;i++)if(xc[i]!=yc[i])return xc[i]>yc[i]^a?1:-1;return k==l?0:k>l^a?1:-1;}
function intValidatorNoErrors(n,min,max){return(n=truncate(n))>=min&&n<=max;}
function isArray(obj){return Object.prototype.toString.call(obj)=='[object Array]';}
function toBaseOut(str,baseIn,baseOut){var j,arr=[0],arrL,i=0,len=str.length;for(;i<len;){for(arrL=arr.length;arrL--;arr[arrL]*=baseIn);arr[j=0]+=ALPHABET.indexOf(str.charAt(i++));for(;j<arr.length;j++){if(arr[j]>baseOut-1){if(arr[j+1]==null)arr[j+1]=0;arr[j+1]+=arr[j]/baseOut|0;arr[j]%=baseOut;}}}
return arr.reverse();}
function toExponential(str,e){return(str.length>1?str.charAt(0)+'.'+str.slice(1):str)+
(e<0?'e':'e+')+e;}
function toFixedPoint(str,e){var len,z;if(e<0){for(z='0.';++e;z+='0');str=z+str;}else{len=str.length;if(++e>len){for(z='0',e-=len;--e;z+='0');str+=z;}else if(e<len){str=str.slice(0,e)+'.'+str.slice(e);}}
return str;}
function truncate(n){n=parseFloat(n);return n<0?mathceil(n):mathfloor(n);}
BigNumber=another();if(true){!(__WEBPACK_AMD_DEFINE_RESULT__=function(){return BigNumber;}.call(exports,__webpack_require__,exports,module),__WEBPACK_AMD_DEFINE_RESULT__!==undefined&&(module.exports=__WEBPACK_AMD_DEFINE_RESULT__));}else if(typeof module!='undefined'&&module.exports){module.exports=BigNumber;if(!crypto)try{crypto=require('crypto');}catch(e){}}else{global.BigNumber=BigNumber;}})(this);}),(function(module,exports,__webpack_require__){"use strict";(function(global){var base64=__webpack_require__(75)
var ieee754=__webpack_require__(102)
var isArray=__webpack_require__(104)
exports.Buffer=Buffer
exports.SlowBuffer=SlowBuffer
exports.INSPECT_MAX_BYTES=50
Buffer.TYPED_ARRAY_SUPPORT=global.TYPED_ARRAY_SUPPORT!==undefined?global.TYPED_ARRAY_SUPPORT:typedArraySupport()
exports.kMaxLength=kMaxLength()
function typedArraySupport(){try{var arr=new Uint8Array(1)
arr.__proto__={__proto__:Uint8Array.prototype,foo:function(){return 42}}
return arr.foo()===42&&typeof arr.subarray==='function'&&arr.subarray(1,1).byteLength===0}catch(e){return false}}
function kMaxLength(){return Buffer.TYPED_ARRAY_SUPPORT?0x7fffffff:0x3fffffff}
function createBuffer(that,length){if(kMaxLength()<length){throw new RangeError('Invalid typed array length')}
if(Buffer.TYPED_ARRAY_SUPPORT){that=new Uint8Array(length)
that.__proto__=Buffer.prototype}else{if(that===null){that=new Buffer(length)}
that.length=length}
return that}
function Buffer(arg,encodingOrOffset,length){if(!Buffer.TYPED_ARRAY_SUPPORT&&!(this instanceof Buffer)){return new Buffer(arg,encodingOrOffset,length)}
if(typeof arg==='number'){if(typeof encodingOrOffset==='string'){throw new Error('If encoding is specified then the first argument must be a string')}
return allocUnsafe(this,arg)}
return from(this,arg,encodingOrOffset,length)}
Buffer.poolSize=8192
Buffer._augment=function(arr){arr.__proto__=Buffer.prototype
return arr}
function from(that,value,encodingOrOffset,length){if(typeof value==='number'){throw new TypeError('"value" argument must not be a number')}
if(typeof ArrayBuffer!=='undefined'&&value instanceof ArrayBuffer){return fromArrayBuffer(that,value,encodingOrOffset,length)}
if(typeof value==='string'){return fromString(that,value,encodingOrOffset)}
return fromObject(that,value)}
Buffer.from=function(value,encodingOrOffset,length){return from(null,value,encodingOrOffset,length)}
if(Buffer.TYPED_ARRAY_SUPPORT){Buffer.prototype.__proto__=Uint8Array.prototype
Buffer.__proto__=Uint8Array
if(typeof Symbol!=='undefined'&&Symbol.species&&Buffer[Symbol.species]===Buffer){Object.defineProperty(Buffer,Symbol.species,{value:null,configurable:true})}}
function assertSize(size){if(typeof size!=='number'){throw new TypeError('"size" argument must be a number')}else if(size<0){throw new RangeError('"size" argument must not be negative')}}
function alloc(that,size,fill,encoding){assertSize(size)
if(size<=0){return createBuffer(that,size)}
if(fill!==undefined){return typeof encoding==='string'?createBuffer(that,size).fill(fill,encoding):createBuffer(that,size).fill(fill)}
return createBuffer(that,size)}
Buffer.alloc=function(size,fill,encoding){return alloc(null,size,fill,encoding)}
function allocUnsafe(that,size){assertSize(size)
that=createBuffer(that,size<0?0:checked(size)|0)
if(!Buffer.TYPED_ARRAY_SUPPORT){for(var i=0;i<size;++i){that[i]=0}}
return that}
Buffer.allocUnsafe=function(size){return allocUnsafe(null,size)}
Buffer.allocUnsafeSlow=function(size){return allocUnsafe(null,size)}
function fromString(that,string,encoding){if(typeof encoding!=='string'||encoding===''){encoding='utf8'}
if(!Buffer.isEncoding(encoding)){throw new TypeError('"encoding" must be a valid string encoding')}
var length=byteLength(string,encoding)|0
that=createBuffer(that,length)
var actual=that.write(string,encoding)
if(actual!==length){that=that.slice(0,actual)}
return that}
function fromArrayLike(that,array){var length=array.length<0?0:checked(array.length)|0
that=createBuffer(that,length)
for(var i=0;i<length;i+=1){that[i]=array[i]&255}
return that}
function fromArrayBuffer(that,array,byteOffset,length){array.byteLength
if(byteOffset<0||array.byteLength<byteOffset){throw new RangeError('\'offset\' is out of bounds')}
if(array.byteLength<byteOffset+(length||0)){throw new RangeError('\'length\' is out of bounds')}
if(byteOffset===undefined&&length===undefined){array=new Uint8Array(array)}else if(length===undefined){array=new Uint8Array(array,byteOffset)}else{array=new Uint8Array(array,byteOffset,length)}
if(Buffer.TYPED_ARRAY_SUPPORT){that=array
that.__proto__=Buffer.prototype}else{that=fromArrayLike(that,array)}
return that}
function fromObject(that,obj){if(Buffer.isBuffer(obj)){var len=checked(obj.length)|0
that=createBuffer(that,len)
if(that.length===0){return that}
obj.copy(that,0,0,len)
return that}
if(obj){if((typeof ArrayBuffer!=='undefined'&&obj.buffer instanceof ArrayBuffer)||'length'in obj){if(typeof obj.length!=='number'||isnan(obj.length)){return createBuffer(that,0)}
return fromArrayLike(that,obj)}
if(obj.type==='Buffer'&&isArray(obj.data)){return fromArrayLike(that,obj.data)}}
throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')}
function checked(length){if(length>=kMaxLength()){throw new RangeError('Attempt to allocate Buffer larger than maximum '+'size: 0x'+kMaxLength().toString(16)+' bytes')}
return length|0}
function SlowBuffer(length){if(+length!=length){length=0}
return Buffer.alloc(+length)}
Buffer.isBuffer=function isBuffer(b){return!!(b!=null&&b._isBuffer)}
Buffer.compare=function compare(a,b){if(!Buffer.isBuffer(a)||!Buffer.isBuffer(b)){throw new TypeError('Arguments must be Buffers')}
if(a===b)return 0
var x=a.length
var y=b.length
for(var i=0,len=Math.min(x,y);i<len;++i){if(a[i]!==b[i]){x=a[i]
y=b[i]
break}}
if(x<y)return-1
if(y<x)return 1
return 0}
Buffer.isEncoding=function isEncoding(encoding){switch(String(encoding).toLowerCase()){case'hex':case'utf8':case'utf-8':case'ascii':case'latin1':case'binary':case'base64':case'ucs2':case'ucs-2':case'utf16le':case'utf-16le':return true
default:return false}}
Buffer.concat=function concat(list,length){if(!isArray(list)){throw new TypeError('"list" argument must be an Array of Buffers')}
if(list.length===0){return Buffer.alloc(0)}
var i
if(length===undefined){length=0
for(i=0;i<list.length;++i){length+=list[i].length}}
var buffer=Buffer.allocUnsafe(length)
var pos=0
for(i=0;i<list.length;++i){var buf=list[i]
if(!Buffer.isBuffer(buf)){throw new TypeError('"list" argument must be an Array of Buffers')}
buf.copy(buffer,pos)
pos+=buf.length}
return buffer}
function byteLength(string,encoding){if(Buffer.isBuffer(string)){return string.length}
if(typeof ArrayBuffer!=='undefined'&&typeof ArrayBuffer.isView==='function'&&(ArrayBuffer.isView(string)||string instanceof ArrayBuffer)){return string.byteLength}
if(typeof string!=='string'){string=''+string}
var len=string.length
if(len===0)return 0
var loweredCase=false
for(;;){switch(encoding){case'ascii':case'latin1':case'binary':return len
case'utf8':case'utf-8':case undefined:return utf8ToBytes(string).length
case'ucs2':case'ucs-2':case'utf16le':case'utf-16le':return len*2
case'hex':return len>>>1
case'base64':return base64ToBytes(string).length
default:if(loweredCase)return utf8ToBytes(string).length
encoding=(''+encoding).toLowerCase()
loweredCase=true}}}
Buffer.byteLength=byteLength
function slowToString(encoding,start,end){var loweredCase=false
if(start===undefined||start<0){start=0}
if(start>this.length){return''}
if(end===undefined||end>this.length){end=this.length}
if(end<=0){return''}
end>>>=0
start>>>=0
if(end<=start){return''}
if(!encoding)encoding='utf8'
while(true){switch(encoding){case'hex':return hexSlice(this,start,end)
case'utf8':case'utf-8':return utf8Slice(this,start,end)
case'ascii':return asciiSlice(this,start,end)
case'latin1':case'binary':return latin1Slice(this,start,end)
case'base64':return base64Slice(this,start,end)
case'ucs2':case'ucs-2':case'utf16le':case'utf-16le':return utf16leSlice(this,start,end)
default:if(loweredCase)throw new TypeError('Unknown encoding: '+encoding)
encoding=(encoding+'').toLowerCase()
loweredCase=true}}}
Buffer.prototype._isBuffer=true
function swap(b,n,m){var i=b[n]
b[n]=b[m]
b[m]=i}
Buffer.prototype.swap16=function swap16(){var len=this.length
if(len%2!==0){throw new RangeError('Buffer size must be a multiple of 16-bits')}
for(var i=0;i<len;i+=2){swap(this,i,i+1)}
return this}
Buffer.prototype.swap32=function swap32(){var len=this.length
if(len%4!==0){throw new RangeError('Buffer size must be a multiple of 32-bits')}
for(var i=0;i<len;i+=4){swap(this,i,i+3)
swap(this,i+1,i+2)}
return this}
Buffer.prototype.swap64=function swap64(){var len=this.length
if(len%8!==0){throw new RangeError('Buffer size must be a multiple of 64-bits')}
for(var i=0;i<len;i+=8){swap(this,i,i+7)
swap(this,i+1,i+6)
swap(this,i+2,i+5)
swap(this,i+3,i+4)}
return this}
Buffer.prototype.toString=function toString(){var length=this.length|0
if(length===0)return''
if(arguments.length===0)return utf8Slice(this,0,length)
return slowToString.apply(this,arguments)}
Buffer.prototype.equals=function equals(b){if(!Buffer.isBuffer(b))throw new TypeError('Argument must be a Buffer')
if(this===b)return true
return Buffer.compare(this,b)===0}
Buffer.prototype.inspect=function inspect(){var str=''
var max=exports.INSPECT_MAX_BYTES
if(this.length>0){str=this.toString('hex',0,max).match(/.{2}/g).join(' ')
if(this.length>max)str+=' ... '}
return'<Buffer '+str+'>'}
Buffer.prototype.compare=function compare(target,start,end,thisStart,thisEnd){if(!Buffer.isBuffer(target)){throw new TypeError('Argument must be a Buffer')}
if(start===undefined){start=0}
if(end===undefined){end=target?target.length:0}
if(thisStart===undefined){thisStart=0}
if(thisEnd===undefined){thisEnd=this.length}
if(start<0||end>target.length||thisStart<0||thisEnd>this.length){throw new RangeError('out of range index')}
if(thisStart>=thisEnd&&start>=end){return 0}
if(thisStart>=thisEnd){return-1}
if(start>=end){return 1}
start>>>=0
end>>>=0
thisStart>>>=0
thisEnd>>>=0
if(this===target)return 0
var x=thisEnd-thisStart
var y=end-start
var len=Math.min(x,y)
var thisCopy=this.slice(thisStart,thisEnd)
var targetCopy=target.slice(start,end)
for(var i=0;i<len;++i){if(thisCopy[i]!==targetCopy[i]){x=thisCopy[i]
y=targetCopy[i]
break}}
if(x<y)return-1
if(y<x)return 1
return 0}
function bidirectionalIndexOf(buffer,val,byteOffset,encoding,dir){if(buffer.length===0)return-1
if(typeof byteOffset==='string'){encoding=byteOffset
byteOffset=0}else if(byteOffset>0x7fffffff){byteOffset=0x7fffffff}else if(byteOffset<-0x80000000){byteOffset=-0x80000000}
byteOffset=+byteOffset
if(isNaN(byteOffset)){byteOffset=dir?0:(buffer.length-1)}
if(byteOffset<0)byteOffset=buffer.length+byteOffset
if(byteOffset>=buffer.length){if(dir)return-1
else byteOffset=buffer.length-1}else if(byteOffset<0){if(dir)byteOffset=0
else return-1}
if(typeof val==='string'){val=Buffer.from(val,encoding)}
if(Buffer.isBuffer(val)){if(val.length===0){return-1}
return arrayIndexOf(buffer,val,byteOffset,encoding,dir)}else if(typeof val==='number'){val=val&0xFF
if(Buffer.TYPED_ARRAY_SUPPORT&&typeof Uint8Array.prototype.indexOf==='function'){if(dir){return Uint8Array.prototype.indexOf.call(buffer,val,byteOffset)}else{return Uint8Array.prototype.lastIndexOf.call(buffer,val,byteOffset)}}
return arrayIndexOf(buffer,[val],byteOffset,encoding,dir)}
throw new TypeError('val must be string, number or Buffer')}
function arrayIndexOf(arr,val,byteOffset,encoding,dir){var indexSize=1
var arrLength=arr.length
var valLength=val.length
if(encoding!==undefined){encoding=String(encoding).toLowerCase()
if(encoding==='ucs2'||encoding==='ucs-2'||encoding==='utf16le'||encoding==='utf-16le'){if(arr.length<2||val.length<2){return-1}
indexSize=2
arrLength/=2
valLength/=2
byteOffset/=2}}
function read(buf,i){if(indexSize===1){return buf[i]}else{return buf.readUInt16BE(i*indexSize)}}
var i
if(dir){var foundIndex=-1
for(i=byteOffset;i<arrLength;i++){if(read(arr,i)===read(val,foundIndex===-1?0:i-foundIndex)){if(foundIndex===-1)foundIndex=i
if(i-foundIndex+1===valLength)return foundIndex*indexSize}else{if(foundIndex!==-1)i-=i-foundIndex
foundIndex=-1}}}else{if(byteOffset+valLength>arrLength)byteOffset=arrLength-valLength
for(i=byteOffset;i>=0;i--){var found=true
for(var j=0;j<valLength;j++){if(read(arr,i+j)!==read(val,j)){found=false
break}}
if(found)return i}}
return-1}
Buffer.prototype.includes=function includes(val,byteOffset,encoding){return this.indexOf(val,byteOffset,encoding)!==-1}
Buffer.prototype.indexOf=function indexOf(val,byteOffset,encoding){return bidirectionalIndexOf(this,val,byteOffset,encoding,true)}
Buffer.prototype.lastIndexOf=function lastIndexOf(val,byteOffset,encoding){return bidirectionalIndexOf(this,val,byteOffset,encoding,false)}
function hexWrite(buf,string,offset,length){offset=Number(offset)||0
var remaining=buf.length-offset
if(!length){length=remaining}else{length=Number(length)
if(length>remaining){length=remaining}}
var strLen=string.length
if(strLen%2!==0)throw new TypeError('Invalid hex string')
if(length>strLen/2){length=strLen/2}
for(var i=0;i<length;++i){var parsed=parseInt(string.substr(i*2,2),16)
if(isNaN(parsed))return i
buf[offset+i]=parsed}
return i}
function utf8Write(buf,string,offset,length){return blitBuffer(utf8ToBytes(string,buf.length-offset),buf,offset,length)}
function asciiWrite(buf,string,offset,length){return blitBuffer(asciiToBytes(string),buf,offset,length)}
function latin1Write(buf,string,offset,length){return asciiWrite(buf,string,offset,length)}
function base64Write(buf,string,offset,length){return blitBuffer(base64ToBytes(string),buf,offset,length)}
function ucs2Write(buf,string,offset,length){return blitBuffer(utf16leToBytes(string,buf.length-offset),buf,offset,length)}
Buffer.prototype.write=function write(string,offset,length,encoding){if(offset===undefined){encoding='utf8'
length=this.length
offset=0}else if(length===undefined&&typeof offset==='string'){encoding=offset
length=this.length
offset=0}else if(isFinite(offset)){offset=offset|0
if(isFinite(length)){length=length|0
if(encoding===undefined)encoding='utf8'}else{encoding=length
length=undefined}}else{throw new Error('Buffer.write(string, encoding, offset[, length]) is no longer supported')}
var remaining=this.length-offset
if(length===undefined||length>remaining)length=remaining
if((string.length>0&&(length<0||offset<0))||offset>this.length){throw new RangeError('Attempt to write outside buffer bounds')}
if(!encoding)encoding='utf8'
var loweredCase=false
for(;;){switch(encoding){case'hex':return hexWrite(this,string,offset,length)
case'utf8':case'utf-8':return utf8Write(this,string,offset,length)
case'ascii':return asciiWrite(this,string,offset,length)
case'latin1':case'binary':return latin1Write(this,string,offset,length)
case'base64':return base64Write(this,string,offset,length)
case'ucs2':case'ucs-2':case'utf16le':case'utf-16le':return ucs2Write(this,string,offset,length)
default:if(loweredCase)throw new TypeError('Unknown encoding: '+encoding)
encoding=(''+encoding).toLowerCase()
loweredCase=true}}}
Buffer.prototype.toJSON=function toJSON(){return{type:'Buffer',data:Array.prototype.slice.call(this._arr||this,0)}}
function base64Slice(buf,start,end){if(start===0&&end===buf.length){return base64.fromByteArray(buf)}else{return base64.fromByteArray(buf.slice(start,end))}}
function utf8Slice(buf,start,end){end=Math.min(buf.length,end)
var res=[]
var i=start
while(i<end){var firstByte=buf[i]
var codePoint=null
var bytesPerSequence=(firstByte>0xEF)?4:(firstByte>0xDF)?3:(firstByte>0xBF)?2:1
if(i+bytesPerSequence<=end){var secondByte,thirdByte,fourthByte,tempCodePoint
switch(bytesPerSequence){case 1:if(firstByte<0x80){codePoint=firstByte}
break
case 2:secondByte=buf[i+1]
if((secondByte&0xC0)===0x80){tempCodePoint=(firstByte&0x1F)<<0x6|(secondByte&0x3F)
if(tempCodePoint>0x7F){codePoint=tempCodePoint}}
break
case 3:secondByte=buf[i+1]
thirdByte=buf[i+2]
if((secondByte&0xC0)===0x80&&(thirdByte&0xC0)===0x80){tempCodePoint=(firstByte&0xF)<<0xC|(secondByte&0x3F)<<0x6|(thirdByte&0x3F)
if(tempCodePoint>0x7FF&&(tempCodePoint<0xD800||tempCodePoint>0xDFFF)){codePoint=tempCodePoint}}
break
case 4:secondByte=buf[i+1]
thirdByte=buf[i+2]
fourthByte=buf[i+3]
if((secondByte&0xC0)===0x80&&(thirdByte&0xC0)===0x80&&(fourthByte&0xC0)===0x80){tempCodePoint=(firstByte&0xF)<<0x12|(secondByte&0x3F)<<0xC|(thirdByte&0x3F)<<0x6|(fourthByte&0x3F)
if(tempCodePoint>0xFFFF&&tempCodePoint<0x110000){codePoint=tempCodePoint}}}}
if(codePoint===null){codePoint=0xFFFD
bytesPerSequence=1}else if(codePoint>0xFFFF){codePoint-=0x10000
res.push(codePoint>>>10&0x3FF|0xD800)
codePoint=0xDC00|codePoint&0x3FF}
res.push(codePoint)
i+=bytesPerSequence}
return decodeCodePointsArray(res)}
var MAX_ARGUMENTS_LENGTH=0x1000
function decodeCodePointsArray(codePoints){var len=codePoints.length
if(len<=MAX_ARGUMENTS_LENGTH){return String.fromCharCode.apply(String,codePoints)}
var res=''
var i=0
while(i<len){res+=String.fromCharCode.apply(String,codePoints.slice(i,i+=MAX_ARGUMENTS_LENGTH))}
return res}
function asciiSlice(buf,start,end){var ret=''
end=Math.min(buf.length,end)
for(var i=start;i<end;++i){ret+=String.fromCharCode(buf[i]&0x7F)}
return ret}
function latin1Slice(buf,start,end){var ret=''
end=Math.min(buf.length,end)
for(var i=start;i<end;++i){ret+=String.fromCharCode(buf[i])}
return ret}
function hexSlice(buf,start,end){var len=buf.length
if(!start||start<0)start=0
if(!end||end<0||end>len)end=len
var out=''
for(var i=start;i<end;++i){out+=toHex(buf[i])}
return out}
function utf16leSlice(buf,start,end){var bytes=buf.slice(start,end)
var res=''
for(var i=0;i<bytes.length;i+=2){res+=String.fromCharCode(bytes[i]+bytes[i+1]*256)}
return res}
Buffer.prototype.slice=function slice(start,end){var len=this.length
start=~~start
end=end===undefined?len:~~end
if(start<0){start+=len
if(start<0)start=0}else if(start>len){start=len}
if(end<0){end+=len
if(end<0)end=0}else if(end>len){end=len}
if(end<start)end=start
var newBuf
if(Buffer.TYPED_ARRAY_SUPPORT){newBuf=this.subarray(start,end)
newBuf.__proto__=Buffer.prototype}else{var sliceLen=end-start
newBuf=new Buffer(sliceLen,undefined)
for(var i=0;i<sliceLen;++i){newBuf[i]=this[i+start]}}
return newBuf}
function checkOffset(offset,ext,length){if((offset%1)!==0||offset<0)throw new RangeError('offset is not uint')
if(offset+ext>length)throw new RangeError('Trying to access beyond buffer length')}
Buffer.prototype.readUIntLE=function readUIntLE(offset,byteLength,noAssert){offset=offset|0
byteLength=byteLength|0
if(!noAssert)checkOffset(offset,byteLength,this.length)
var val=this[offset]
var mul=1
var i=0
while(++i<byteLength&&(mul*=0x100)){val+=this[offset+i]*mul}
return val}
Buffer.prototype.readUIntBE=function readUIntBE(offset,byteLength,noAssert){offset=offset|0
byteLength=byteLength|0
if(!noAssert){checkOffset(offset,byteLength,this.length)}
var val=this[offset+--byteLength]
var mul=1
while(byteLength>0&&(mul*=0x100)){val+=this[offset+--byteLength]*mul}
return val}
Buffer.prototype.readUInt8=function readUInt8(offset,noAssert){if(!noAssert)checkOffset(offset,1,this.length)
return this[offset]}
Buffer.prototype.readUInt16LE=function readUInt16LE(offset,noAssert){if(!noAssert)checkOffset(offset,2,this.length)
return this[offset]|(this[offset+1]<<8)}
Buffer.prototype.readUInt16BE=function readUInt16BE(offset,noAssert){if(!noAssert)checkOffset(offset,2,this.length)
return(this[offset]<<8)|this[offset+1]}
Buffer.prototype.readUInt32LE=function readUInt32LE(offset,noAssert){if(!noAssert)checkOffset(offset,4,this.length)
return((this[offset])|(this[offset+1]<<8)|(this[offset+2]<<16))+
(this[offset+3]*0x1000000)}
Buffer.prototype.readUInt32BE=function readUInt32BE(offset,noAssert){if(!noAssert)checkOffset(offset,4,this.length)
return(this[offset]*0x1000000)+
((this[offset+1]<<16)|(this[offset+2]<<8)|this[offset+3])}
Buffer.prototype.readIntLE=function readIntLE(offset,byteLength,noAssert){offset=offset|0
byteLength=byteLength|0
if(!noAssert)checkOffset(offset,byteLength,this.length)
var val=this[offset]
var mul=1
var i=0
while(++i<byteLength&&(mul*=0x100)){val+=this[offset+i]*mul}
mul*=0x80
if(val>=mul)val-=Math.pow(2,8*byteLength)
return val}
Buffer.prototype.readIntBE=function readIntBE(offset,byteLength,noAssert){offset=offset|0
byteLength=byteLength|0
if(!noAssert)checkOffset(offset,byteLength,this.length)
var i=byteLength
var mul=1
var val=this[offset+--i]
while(i>0&&(mul*=0x100)){val+=this[offset+--i]*mul}
mul*=0x80
if(val>=mul)val-=Math.pow(2,8*byteLength)
return val}
Buffer.prototype.readInt8=function readInt8(offset,noAssert){if(!noAssert)checkOffset(offset,1,this.length)
if(!(this[offset]&0x80))return(this[offset])
return((0xff-this[offset]+1)*-1)}
Buffer.prototype.readInt16LE=function readInt16LE(offset,noAssert){if(!noAssert)checkOffset(offset,2,this.length)
var val=this[offset]|(this[offset+1]<<8)
return(val&0x8000)?val|0xFFFF0000:val}
Buffer.prototype.readInt16BE=function readInt16BE(offset,noAssert){if(!noAssert)checkOffset(offset,2,this.length)
var val=this[offset+1]|(this[offset]<<8)
return(val&0x8000)?val|0xFFFF0000:val}
Buffer.prototype.readInt32LE=function readInt32LE(offset,noAssert){if(!noAssert)checkOffset(offset,4,this.length)
return(this[offset])|(this[offset+1]<<8)|(this[offset+2]<<16)|(this[offset+3]<<24)}
Buffer.prototype.readInt32BE=function readInt32BE(offset,noAssert){if(!noAssert)checkOffset(offset,4,this.length)
return(this[offset]<<24)|(this[offset+1]<<16)|(this[offset+2]<<8)|(this[offset+3])}
Buffer.prototype.readFloatLE=function readFloatLE(offset,noAssert){if(!noAssert)checkOffset(offset,4,this.length)
return ieee754.read(this,offset,true,23,4)}
Buffer.prototype.readFloatBE=function readFloatBE(offset,noAssert){if(!noAssert)checkOffset(offset,4,this.length)
return ieee754.read(this,offset,false,23,4)}
Buffer.prototype.readDoubleLE=function readDoubleLE(offset,noAssert){if(!noAssert)checkOffset(offset,8,this.length)
return ieee754.read(this,offset,true,52,8)}
Buffer.prototype.readDoubleBE=function readDoubleBE(offset,noAssert){if(!noAssert)checkOffset(offset,8,this.length)
return ieee754.read(this,offset,false,52,8)}
function checkInt(buf,value,offset,ext,max,min){if(!Buffer.isBuffer(buf))throw new TypeError('"buffer" argument must be a Buffer instance')
if(value>max||value<min)throw new RangeError('"value" argument is out of bounds')
if(offset+ext>buf.length)throw new RangeError('Index out of range')}
Buffer.prototype.writeUIntLE=function writeUIntLE(value,offset,byteLength,noAssert){value=+value
offset=offset|0
byteLength=byteLength|0
if(!noAssert){var maxBytes=Math.pow(2,8*byteLength)-1
checkInt(this,value,offset,byteLength,maxBytes,0)}
var mul=1
var i=0
this[offset]=value&0xFF
while(++i<byteLength&&(mul*=0x100)){this[offset+i]=(value/mul)&0xFF}
return offset+byteLength}
Buffer.prototype.writeUIntBE=function writeUIntBE(value,offset,byteLength,noAssert){value=+value
offset=offset|0
byteLength=byteLength|0
if(!noAssert){var maxBytes=Math.pow(2,8*byteLength)-1
checkInt(this,value,offset,byteLength,maxBytes,0)}
var i=byteLength-1
var mul=1
this[offset+i]=value&0xFF
while(--i>=0&&(mul*=0x100)){this[offset+i]=(value/mul)&0xFF}
return offset+byteLength}
Buffer.prototype.writeUInt8=function writeUInt8(value,offset,noAssert){value=+value
offset=offset|0
if(!noAssert)checkInt(this,value,offset,1,0xff,0)
if(!Buffer.TYPED_ARRAY_SUPPORT)value=Math.floor(value)
this[offset]=(value&0xff)
return offset+1}
function objectWriteUInt16(buf,value,offset,littleEndian){if(value<0)value=0xffff+value+1
for(var i=0,j=Math.min(buf.length-offset,2);i<j;++i){buf[offset+i]=(value&(0xff<<(8*(littleEndian?i:1-i))))>>>(littleEndian?i:1-i)*8}}
Buffer.prototype.writeUInt16LE=function writeUInt16LE(value,offset,noAssert){value=+value
offset=offset|0
if(!noAssert)checkInt(this,value,offset,2,0xffff,0)
if(Buffer.TYPED_ARRAY_SUPPORT){this[offset]=(value&0xff)
this[offset+1]=(value>>>8)}else{objectWriteUInt16(this,value,offset,true)}
return offset+2}
Buffer.prototype.writeUInt16BE=function writeUInt16BE(value,offset,noAssert){value=+value
offset=offset|0
if(!noAssert)checkInt(this,value,offset,2,0xffff,0)
if(Buffer.TYPED_ARRAY_SUPPORT){this[offset]=(value>>>8)
this[offset+1]=(value&0xff)}else{objectWriteUInt16(this,value,offset,false)}
return offset+2}
function objectWriteUInt32(buf,value,offset,littleEndian){if(value<0)value=0xffffffff+value+1
for(var i=0,j=Math.min(buf.length-offset,4);i<j;++i){buf[offset+i]=(value>>>(littleEndian?i:3-i)*8)&0xff}}
Buffer.prototype.writeUInt32LE=function writeUInt32LE(value,offset,noAssert){value=+value
offset=offset|0
if(!noAssert)checkInt(this,value,offset,4,0xffffffff,0)
if(Buffer.TYPED_ARRAY_SUPPORT){this[offset+3]=(value>>>24)
this[offset+2]=(value>>>16)
this[offset+1]=(value>>>8)
this[offset]=(value&0xff)}else{objectWriteUInt32(this,value,offset,true)}
return offset+4}
Buffer.prototype.writeUInt32BE=function writeUInt32BE(value,offset,noAssert){value=+value
offset=offset|0
if(!noAssert)checkInt(this,value,offset,4,0xffffffff,0)
if(Buffer.TYPED_ARRAY_SUPPORT){this[offset]=(value>>>24)
this[offset+1]=(value>>>16)
this[offset+2]=(value>>>8)
this[offset+3]=(value&0xff)}else{objectWriteUInt32(this,value,offset,false)}
return offset+4}
Buffer.prototype.writeIntLE=function writeIntLE(value,offset,byteLength,noAssert){value=+value
offset=offset|0
if(!noAssert){var limit=Math.pow(2,8*byteLength-1)
checkInt(this,value,offset,byteLength,limit-1,-limit)}
var i=0
var mul=1
var sub=0
this[offset]=value&0xFF
while(++i<byteLength&&(mul*=0x100)){if(value<0&&sub===0&&this[offset+i-1]!==0){sub=1}
this[offset+i]=((value/mul)>>0)-sub&0xFF}
return offset+byteLength}
Buffer.prototype.writeIntBE=function writeIntBE(value,offset,byteLength,noAssert){value=+value
offset=offset|0
if(!noAssert){var limit=Math.pow(2,8*byteLength-1)
checkInt(this,value,offset,byteLength,limit-1,-limit)}
var i=byteLength-1
var mul=1
var sub=0
this[offset+i]=value&0xFF
while(--i>=0&&(mul*=0x100)){if(value<0&&sub===0&&this[offset+i+1]!==0){sub=1}
this[offset+i]=((value/mul)>>0)-sub&0xFF}
return offset+byteLength}
Buffer.prototype.writeInt8=function writeInt8(value,offset,noAssert){value=+value
offset=offset|0
if(!noAssert)checkInt(this,value,offset,1,0x7f,-0x80)
if(!Buffer.TYPED_ARRAY_SUPPORT)value=Math.floor(value)
if(value<0)value=0xff+value+1
this[offset]=(value&0xff)
return offset+1}
Buffer.prototype.writeInt16LE=function writeInt16LE(value,offset,noAssert){value=+value
offset=offset|0
if(!noAssert)checkInt(this,value,offset,2,0x7fff,-0x8000)
if(Buffer.TYPED_ARRAY_SUPPORT){this[offset]=(value&0xff)
this[offset+1]=(value>>>8)}else{objectWriteUInt16(this,value,offset,true)}
return offset+2}
Buffer.prototype.writeInt16BE=function writeInt16BE(value,offset,noAssert){value=+value
offset=offset|0
if(!noAssert)checkInt(this,value,offset,2,0x7fff,-0x8000)
if(Buffer.TYPED_ARRAY_SUPPORT){this[offset]=(value>>>8)
this[offset+1]=(value&0xff)}else{objectWriteUInt16(this,value,offset,false)}
return offset+2}
Buffer.prototype.writeInt32LE=function writeInt32LE(value,offset,noAssert){value=+value
offset=offset|0
if(!noAssert)checkInt(this,value,offset,4,0x7fffffff,-0x80000000)
if(Buffer.TYPED_ARRAY_SUPPORT){this[offset]=(value&0xff)
this[offset+1]=(value>>>8)
this[offset+2]=(value>>>16)
this[offset+3]=(value>>>24)}else{objectWriteUInt32(this,value,offset,true)}
return offset+4}
Buffer.prototype.writeInt32BE=function writeInt32BE(value,offset,noAssert){value=+value
offset=offset|0
if(!noAssert)checkInt(this,value,offset,4,0x7fffffff,-0x80000000)
if(value<0)value=0xffffffff+value+1
if(Buffer.TYPED_ARRAY_SUPPORT){this[offset]=(value>>>24)
this[offset+1]=(value>>>16)
this[offset+2]=(value>>>8)
this[offset+3]=(value&0xff)}else{objectWriteUInt32(this,value,offset,false)}
return offset+4}
function checkIEEE754(buf,value,offset,ext,max,min){if(offset+ext>buf.length)throw new RangeError('Index out of range')
if(offset<0)throw new RangeError('Index out of range')}
function writeFloat(buf,value,offset,littleEndian,noAssert){if(!noAssert){checkIEEE754(buf,value,offset,4,3.4028234663852886e+38,-3.4028234663852886e+38)}
ieee754.write(buf,value,offset,littleEndian,23,4)
return offset+4}
Buffer.prototype.writeFloatLE=function writeFloatLE(value,offset,noAssert){return writeFloat(this,value,offset,true,noAssert)}
Buffer.prototype.writeFloatBE=function writeFloatBE(value,offset,noAssert){return writeFloat(this,value,offset,false,noAssert)}
function writeDouble(buf,value,offset,littleEndian,noAssert){if(!noAssert){checkIEEE754(buf,value,offset,8,1.7976931348623157E+308,-1.7976931348623157E+308)}
ieee754.write(buf,value,offset,littleEndian,52,8)
return offset+8}
Buffer.prototype.writeDoubleLE=function writeDoubleLE(value,offset,noAssert){return writeDouble(this,value,offset,true,noAssert)}
Buffer.prototype.writeDoubleBE=function writeDoubleBE(value,offset,noAssert){return writeDouble(this,value,offset,false,noAssert)}
Buffer.prototype.copy=function copy(target,targetStart,start,end){if(!start)start=0
if(!end&&end!==0)end=this.length
if(targetStart>=target.length)targetStart=target.length
if(!targetStart)targetStart=0
if(end>0&&end<start)end=start
if(end===start)return 0
if(target.length===0||this.length===0)return 0
if(targetStart<0){throw new RangeError('targetStart out of bounds')}
if(start<0||start>=this.length)throw new RangeError('sourceStart out of bounds')
if(end<0)throw new RangeError('sourceEnd out of bounds')
if(end>this.length)end=this.length
if(target.length-targetStart<end-start){end=target.length-targetStart+start}
var len=end-start
var i
if(this===target&&start<targetStart&&targetStart<end){for(i=len-1;i>=0;--i){target[i+targetStart]=this[i+start]}}else if(len<1000||!Buffer.TYPED_ARRAY_SUPPORT){for(i=0;i<len;++i){target[i+targetStart]=this[i+start]}}else{Uint8Array.prototype.set.call(target,this.subarray(start,start+len),targetStart)}
return len}
Buffer.prototype.fill=function fill(val,start,end,encoding){if(typeof val==='string'){if(typeof start==='string'){encoding=start
start=0
end=this.length}else if(typeof end==='string'){encoding=end
end=this.length}
if(val.length===1){var code=val.charCodeAt(0)
if(code<256){val=code}}
if(encoding!==undefined&&typeof encoding!=='string'){throw new TypeError('encoding must be a string')}
if(typeof encoding==='string'&&!Buffer.isEncoding(encoding)){throw new TypeError('Unknown encoding: '+encoding)}}else if(typeof val==='number'){val=val&255}
if(start<0||this.length<start||this.length<end){throw new RangeError('Out of range index')}
if(end<=start){return this}
start=start>>>0
end=end===undefined?this.length:end>>>0
if(!val)val=0
var i
if(typeof val==='number'){for(i=start;i<end;++i){this[i]=val}}else{var bytes=Buffer.isBuffer(val)?val:utf8ToBytes(new Buffer(val,encoding).toString())
var len=bytes.length
for(i=0;i<end-start;++i){this[i+start]=bytes[i%len]}}
return this}
var INVALID_BASE64_RE=/[^+\/0-9A-Za-z-_]/g
function base64clean(str){str=stringtrim(str).replace(INVALID_BASE64_RE,'')
if(str.length<2)return''
while(str.length%4!==0){str=str+'='}
return str}
function stringtrim(str){if(str.trim)return str.trim()
return str.replace(/^\s+|\s+$/g,'')}
function toHex(n){if(n<16)return'0'+n.toString(16)
return n.toString(16)}
function utf8ToBytes(string,units){units=units||Infinity
var codePoint
var length=string.length
var leadSurrogate=null
var bytes=[]
for(var i=0;i<length;++i){codePoint=string.charCodeAt(i)
if(codePoint>0xD7FF&&codePoint<0xE000){if(!leadSurrogate){if(codePoint>0xDBFF){if((units-=3)>-1)bytes.push(0xEF,0xBF,0xBD)
continue}else if(i+1===length){if((units-=3)>-1)bytes.push(0xEF,0xBF,0xBD)
continue}
leadSurrogate=codePoint
continue}
if(codePoint<0xDC00){if((units-=3)>-1)bytes.push(0xEF,0xBF,0xBD)
leadSurrogate=codePoint
continue}
codePoint=(leadSurrogate-0xD800<<10|codePoint-0xDC00)+0x10000}else if(leadSurrogate){if((units-=3)>-1)bytes.push(0xEF,0xBF,0xBD)}
leadSurrogate=null
if(codePoint<0x80){if((units-=1)<0)break
bytes.push(codePoint)}else if(codePoint<0x800){if((units-=2)<0)break
bytes.push(codePoint>>0x6|0xC0,codePoint&0x3F|0x80)}else if(codePoint<0x10000){if((units-=3)<0)break
bytes.push(codePoint>>0xC|0xE0,codePoint>>0x6&0x3F|0x80,codePoint&0x3F|0x80)}else if(codePoint<0x110000){if((units-=4)<0)break
bytes.push(codePoint>>0x12|0xF0,codePoint>>0xC&0x3F|0x80,codePoint>>0x6&0x3F|0x80,codePoint&0x3F|0x80)}else{throw new Error('Invalid code point')}}
return bytes}
function asciiToBytes(str){var byteArray=[]
for(var i=0;i<str.length;++i){byteArray.push(str.charCodeAt(i)&0xFF)}
return byteArray}
function utf16leToBytes(str,units){var c,hi,lo
var byteArray=[]
for(var i=0;i<str.length;++i){if((units-=2)<0)break
c=str.charCodeAt(i)
hi=c>>8
lo=c%256
byteArray.push(lo)
byteArray.push(hi)}
return byteArray}
function base64ToBytes(str){return base64.toByteArray(base64clean(str))}
function blitBuffer(src,dst,offset,length){for(var i=0;i<length;++i){if((i+offset>=dst.length)||(i>=src.length))break
dst[i+offset]=src[i]}
return i}
function isnan(val){return val!==val}}.call(exports,__webpack_require__(47)))}),(function(module,exports,__webpack_require__){;(function(root,factory,undef){if(true){module.exports=exports=factory(__webpack_require__(0),__webpack_require__(33));}
else if(typeof define==="function"&&define.amd){define(["./core","./x64-core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){(function(Math){var C=CryptoJS;var C_lib=C.lib;var WordArray=C_lib.WordArray;var Hasher=C_lib.Hasher;var C_x64=C.x64;var X64Word=C_x64.Word;var C_algo=C.algo;var RHO_OFFSETS=[];var PI_INDEXES=[];var ROUND_CONSTANTS=[];(function(){var x=1,y=0;for(var t=0;t<24;t++){RHO_OFFSETS[x+5*y]=((t+1)*(t+2)/2)%64;var newX=y%5;var newY=(2*x+3*y)%5;x=newX;y=newY;}
for(var x=0;x<5;x++){for(var y=0;y<5;y++){PI_INDEXES[x+5*y]=y+((2*x+3*y)%5)*5;}}
var LFSR=0x01;for(var i=0;i<24;i++){var roundConstantMsw=0;var roundConstantLsw=0;for(var j=0;j<7;j++){if(LFSR&0x01){var bitPosition=(1<<j)-1;if(bitPosition<32){roundConstantLsw^=1<<bitPosition;}else{roundConstantMsw^=1<<(bitPosition-32);}}
if(LFSR&0x80){LFSR=(LFSR<<1)^0x71;}else{LFSR<<=1;}}
ROUND_CONSTANTS[i]=X64Word.create(roundConstantMsw,roundConstantLsw);}}());var T=[];(function(){for(var i=0;i<25;i++){T[i]=X64Word.create();}}());var SHA3=C_algo.SHA3=Hasher.extend({cfg:Hasher.cfg.extend({outputLength:512}),_doReset:function(){var state=this._state=[]
for(var i=0;i<25;i++){state[i]=new X64Word.init();}
this.blockSize=(1600-2*this.cfg.outputLength)/32;},_doProcessBlock:function(M,offset){var state=this._state;var nBlockSizeLanes=this.blockSize/2;for(var i=0;i<nBlockSizeLanes;i++){var M2i=M[offset+2*i];var M2i1=M[offset+2*i+1];M2i=((((M2i<<8)|(M2i>>>24))&0x00ff00ff)|(((M2i<<24)|(M2i>>>8))&0xff00ff00));M2i1=((((M2i1<<8)|(M2i1>>>24))&0x00ff00ff)|(((M2i1<<24)|(M2i1>>>8))&0xff00ff00));var lane=state[i];lane.high^=M2i1;lane.low^=M2i;}
for(var round=0;round<24;round++){for(var x=0;x<5;x++){var tMsw=0,tLsw=0;for(var y=0;y<5;y++){var lane=state[x+5*y];tMsw^=lane.high;tLsw^=lane.low;}
var Tx=T[x];Tx.high=tMsw;Tx.low=tLsw;}
for(var x=0;x<5;x++){var Tx4=T[(x+4)%5];var Tx1=T[(x+1)%5];var Tx1Msw=Tx1.high;var Tx1Lsw=Tx1.low;var tMsw=Tx4.high^((Tx1Msw<<1)|(Tx1Lsw>>>31));var tLsw=Tx4.low^((Tx1Lsw<<1)|(Tx1Msw>>>31));for(var y=0;y<5;y++){var lane=state[x+5*y];lane.high^=tMsw;lane.low^=tLsw;}}
for(var laneIndex=1;laneIndex<25;laneIndex++){var lane=state[laneIndex];var laneMsw=lane.high;var laneLsw=lane.low;var rhoOffset=RHO_OFFSETS[laneIndex];if(rhoOffset<32){var tMsw=(laneMsw<<rhoOffset)|(laneLsw>>>(32-rhoOffset));var tLsw=(laneLsw<<rhoOffset)|(laneMsw>>>(32-rhoOffset));}else{var tMsw=(laneLsw<<(rhoOffset-32))|(laneMsw>>>(64-rhoOffset));var tLsw=(laneMsw<<(rhoOffset-32))|(laneLsw>>>(64-rhoOffset));}
var TPiLane=T[PI_INDEXES[laneIndex]];TPiLane.high=tMsw;TPiLane.low=tLsw;}
var T0=T[0];var state0=state[0];T0.high=state0.high;T0.low=state0.low;for(var x=0;x<5;x++){for(var y=0;y<5;y++){var laneIndex=x+5*y;var lane=state[laneIndex];var TLane=T[laneIndex];var Tx1Lane=T[((x+1)%5)+5*y];var Tx2Lane=T[((x+2)%5)+5*y];lane.high=TLane.high^(~Tx1Lane.high&Tx2Lane.high);lane.low=TLane.low^(~Tx1Lane.low&Tx2Lane.low);}}
var lane=state[0];var roundConstant=ROUND_CONSTANTS[round];lane.high^=roundConstant.high;lane.low^=roundConstant.low;;}},_doFinalize:function(){var data=this._data;var dataWords=data.words;var nBitsTotal=this._nDataBytes*8;var nBitsLeft=data.sigBytes*8;var blockSizeBits=this.blockSize*32;dataWords[nBitsLeft>>>5]|=0x1<<(24-nBitsLeft%32);dataWords[((Math.ceil((nBitsLeft+1)/blockSizeBits)*blockSizeBits)>>>5)-1]|=0x80;data.sigBytes=dataWords.length*4;this._process();var state=this._state;var outputLengthBytes=this.cfg.outputLength/8;var outputLengthLanes=outputLengthBytes/8;var hashWords=[];for(var i=0;i<outputLengthLanes;i++){var lane=state[i];var laneMsw=lane.high;var laneLsw=lane.low;laneMsw=((((laneMsw<<8)|(laneMsw>>>24))&0x00ff00ff)|(((laneMsw<<24)|(laneMsw>>>8))&0xff00ff00));laneLsw=((((laneLsw<<8)|(laneLsw>>>24))&0x00ff00ff)|(((laneLsw<<24)|(laneLsw>>>8))&0xff00ff00));hashWords.push(laneLsw);hashWords.push(laneMsw);}
return new WordArray.init(hashWords,outputLengthBytes);},clone:function(){var clone=Hasher.clone.call(this);var state=clone._state=this._state.slice(0);for(var i=0;i<25;i++){state[i]=state[i].clone();}
return clone;}});C.SHA3=Hasher._createHelper(SHA3);C.HmacSHA3=Hasher._createHmacHelper(SHA3);}(Math));return CryptoJS.SHA3;}));}),(function(module,exports,__webpack_require__){;(function(root,factory){if(true){module.exports=exports=factory(__webpack_require__(0));}
else if(typeof define==="function"&&define.amd){define(["./core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){(function(undefined){var C=CryptoJS;var C_lib=C.lib;var Base=C_lib.Base;var X32WordArray=C_lib.WordArray;var C_x64=C.x64={};var X64Word=C_x64.Word=Base.extend({init:function(high,low){this.high=high;this.low=low;}});var X64WordArray=C_x64.WordArray=Base.extend({init:function(words,sigBytes){words=this.words=words||[];if(sigBytes!=undefined){this.sigBytes=sigBytes;}else{this.sigBytes=words.length*8;}},toX32:function(){var x64Words=this.words;var x64WordsLength=x64Words.length;var x32Words=[];for(var i=0;i<x64WordsLength;i++){var x64Word=x64Words[i];x32Words.push(x64Word.high);x32Words.push(x64Word.low);}
return X32WordArray.create(x32Words,this.sigBytes);},clone:function(){var clone=Base.clone.call(this);var words=clone.words=this.words.slice(0);var wordsLength=words.length;for(var i=0;i<wordsLength;i++){words[i]=words[i].clone();}
return clone;}});}());return CryptoJS;}));}),(function(module,exports,__webpack_require__){var BigNumber=__webpack_require__(23);var ETH_UNITS=['wei','kwei','Mwei','Gwei','szabo','finney','femtoether','picoether','nanoether','microether','milliether','nano','micro','milli','ether','grand','Mether','Gether','Tether','Pether','Eether','Zether','Yether','Nether','Dether','Vether','Uether'];module.exports={ETH_PADDING:32,ETH_SIGNATURE_LENGTH:4,ETH_UNITS:ETH_UNITS,ETH_BIGNUMBER_ROUNDING_MODE:{ROUNDING_MODE:BigNumber.ROUND_DOWN},ETH_POLLING_TIMEOUT:1000/2,defaultBlock:'latest',defaultAccount:undefined};}),(function(module,exports,__webpack_require__){var formatters=__webpack_require__(9);var utils=__webpack_require__(2);var toTopic=function(value){if(value===null||typeof value==='undefined')
return null;value=String(value);if(value.indexOf('0x')===0)
return value;else
return utils.fromUtf8(value);};var getOptions=function(options){if(utils.isString(options)){return options;}
options=options||{};options.topics=options.topics||[];options.topics=options.topics.map(function(topic){return(utils.isArray(topic))?topic.map(toTopic):toTopic(topic);});return{topics:options.topics,from:options.from,to:options.to,address:options.address,fromBlock:formatters.inputBlockNumberFormatter(options.fromBlock),toBlock:formatters.inputBlockNumberFormatter(options.toBlock)};};var getLogsAtStart=function(self,callback){if(!utils.isString(self.options)){self.get(function(err,messages){if(err){callback(err);}
if(utils.isArray(messages)){messages.forEach(function(message){callback(null,message);});}});}};var pollFilter=function(self){var onMessage=function(error,messages){if(error){return self.callbacks.forEach(function(callback){callback(error);});}
if(utils.isArray(messages)){messages.forEach(function(message){message=self.formatter?self.formatter(message):message;self.callbacks.forEach(function(callback){callback(null,message);});});}};self.requestManager.startPolling({method:self.implementation.poll.call,params:[self.filterId],},self.filterId,onMessage,self.stopWatching.bind(self));};var Filter=function(requestManager,options,methods,formatter,callback,filterCreationErrorCallback){var self=this;var implementation={};methods.forEach(function(method){method.setRequestManager(requestManager);method.attachToObject(implementation);});this.requestManager=requestManager;this.options=getOptions(options);this.implementation=implementation;this.filterId=null;this.callbacks=[];this.getLogsCallbacks=[];this.pollFilters=[];this.formatter=formatter;this.implementation.newFilter(this.options,function(error,id){if(error){self.callbacks.forEach(function(cb){cb(error);});filterCreationErrorCallback(error);}else{self.filterId=id;self.getLogsCallbacks.forEach(function(cb){self.get(cb);});self.getLogsCallbacks=[];self.callbacks.forEach(function(cb){getLogsAtStart(self,cb);});if(self.callbacks.length>0)
pollFilter(self);if(typeof callback==='function'){return self.watch(callback);}}});return this;};Filter.prototype.watch=function(callback){this.callbacks.push(callback);if(this.filterId){getLogsAtStart(this,callback);pollFilter(this);}
return this;};Filter.prototype.stopWatching=function(callback){this.requestManager.stopPolling(this.filterId);this.callbacks=[];if(callback){this.implementation.uninstallFilter(this.filterId,callback);}else{return this.implementation.uninstallFilter(this.filterId);}};Filter.prototype.get=function(callback){var self=this;if(utils.isFunction(callback)){if(this.filterId===null){this.getLogsCallbacks.push(callback);}else{this.implementation.getLogs(this.filterId,function(err,res){if(err){callback(err);}else{callback(null,res.map(function(log){return self.formatter?self.formatter(log):log;}));}});}}else{if(this.filterId===null){throw new Error('Filter ID Error: filter().get() can\'t be chained synchronous, please provide a callback for the get() method.');}
var logs=this.implementation.getLogs(this.filterId);return logs.map(function(log){return self.formatter?self.formatter(log):log;});}
return this;};module.exports=Filter;}),(function(module,exports,__webpack_require__){var BigNumber=__webpack_require__(23);var padLeft=function(string,bytes){var result=string;while(result.length<bytes*2){result='0'+result;}
return result;};var iso13616Prepare=function(iban){var A='A'.charCodeAt(0);var Z='Z'.charCodeAt(0);iban=iban.toUpperCase();iban=iban.substr(4)+iban.substr(0,4);return iban.split('').map(function(n){var code=n.charCodeAt(0);if(code>=A&&code<=Z){return code-A+10;}else{return n;}}).join('');};var mod9710=function(iban){var remainder=iban,block;while(remainder.length>2){block=remainder.slice(0,9);remainder=parseInt(block,10)%97+remainder.slice(block.length);}
return parseInt(remainder,10)%97;};var Iban=function(iban){this._iban=iban;};Iban.fromAddress=function(address){var asBn=new BigNumber(address,16);var base36=asBn.toString(36);var padded=padLeft(base36,15);return Iban.fromBban(padded.toUpperCase());};Iban.fromBban=function(bban){var countryCode='XE';var remainder=mod9710(iso13616Prepare(countryCode+'00'+bban));var checkDigit=('0'+(98-remainder)).slice(-2);return new Iban(countryCode+checkDigit+bban);};Iban.createIndirect=function(options){return Iban.fromBban('ETH'+options.institution+options.identifier);};Iban.isValid=function(iban){var i=new Iban(iban);return i.isValid();};Iban.prototype.isValid=function(){return/^XE[0-9]{2}(ETH[0-9A-Z]{13}|[0-9A-Z]{30,31})$/.test(this._iban)&&mod9710(iso13616Prepare(this._iban))===1;};Iban.prototype.isDirect=function(){return this._iban.length===34||this._iban.length===35;};Iban.prototype.isIndirect=function(){return this._iban.length===20;};Iban.prototype.checksum=function(){return this._iban.substr(2,2);};Iban.prototype.institution=function(){return this.isIndirect()?this._iban.substr(7,4):'';};Iban.prototype.client=function(){return this.isIndirect()?this._iban.substr(11):'';};Iban.prototype.address=function(){if(this.isDirect()){var base36=this._iban.substr(4);var asBn=new BigNumber(base36,36);return padLeft(asBn.toString(16),20);}
return'';};Iban.prototype.toString=function(){return this._iban;};module.exports=Iban;}),(function(module,exports,__webpack_require__){var Method=__webpack_require__(14);var eth=function(){var newFilterCall=function(args){var type=args[0];switch(type){case'latest':args.shift();this.params=0;return'eth_newBlockFilter';case'pending':args.shift();this.params=0;return'eth_newPendingTransactionFilter';default:return'eth_newFilter';}};var newFilter=new Method({name:'newFilter',call:newFilterCall,params:1});var uninstallFilter=new Method({name:'uninstallFilter',call:'eth_uninstallFilter',params:1});var getLogs=new Method({name:'getLogs',call:'eth_getFilterLogs',params:1});var poll=new Method({name:'poll',call:'eth_getFilterChanges',params:1});return[newFilter,uninstallFilter,getLogs,poll];};var shh=function(){var newFilter=new Method({name:'newFilter',call:'shh_newFilter',params:1});var uninstallFilter=new Method({name:'uninstallFilter',call:'shh_uninstallFilter',params:1});var getLogs=new Method({name:'getLogs',call:'shh_getMessages',params:1});var poll=new Method({name:'poll',call:'shh_getFilterChanges',params:1});return[newFilter,uninstallFilter,getLogs,poll];};module.exports={eth:eth,shh:shh};}),(function(module,exports,__webpack_require__){var __WEBPACK_AMD_DEFINE_RESULT__;;(function(global){'use strict';var BigNumber,crypto,parseNumeric,isNumeric=/^-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,mathceil=Math.ceil,mathfloor=Math.floor,notBool=' not a boolean or binary digit',roundingMode='rounding mode',tooManyDigits='number type has more than 15 significant digits',ALPHABET='0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ$_',BASE=1e14,LOG_BASE=14,MAX_SAFE_INTEGER=0x1fffffffffffff,POWS_TEN=[1,10,100,1e3,1e4,1e5,1e6,1e7,1e8,1e9,1e10,1e11,1e12,1e13],SQRT_BASE=1e7,MAX=1E9;function another(configObj){var div,id=0,P=BigNumber.prototype,ONE=new BigNumber(1),DECIMAL_PLACES=20,ROUNDING_MODE=4,TO_EXP_NEG=-7,TO_EXP_POS=21,MIN_EXP=-1e7,MAX_EXP=1e7,ERRORS=true,isValidInt=intValidatorWithErrors,CRYPTO=false,MODULO_MODE=1,POW_PRECISION=100,FORMAT={decimalSeparator:'.',groupSeparator:',',groupSize:3,secondaryGroupSize:0,fractionGroupSeparator:'\xA0',fractionGroupSize:0};function BigNumber(n,b){var c,e,i,num,len,str,x=this;if(!(x instanceof BigNumber)){if(ERRORS)raise(26,'constructor call without new',n);return new BigNumber(n,b);}
if(b==null||!isValidInt(b,2,64,id,'base')){if(n instanceof BigNumber){x.s=n.s;x.e=n.e;x.c=(n=n.c)?n.slice():n;id=0;return;}
if((num=typeof n=='number')&&n*0==0){x.s=1/n<0?(n=-n,-1):1;if(n===~~n){for(e=0,i=n;i>=10;i/=10,e++);x.e=e;x.c=[n];id=0;return;}
str=n+'';}else{if(!isNumeric.test(str=n+''))return parseNumeric(x,str,num);x.s=str.charCodeAt(0)===45?(str=str.slice(1),-1):1;}}else{b=b|0;str=n+'';if(b==10){x=new BigNumber(n instanceof BigNumber?n:str);return round(x,DECIMAL_PLACES+x.e+1,ROUNDING_MODE);}
if((num=typeof n=='number')&&n*0!=0||!(new RegExp('^-?'+(c='['+ALPHABET.slice(0,b)+']+')+'(?:\\.'+c+')?$',b<37?'i':'')).test(str)){return parseNumeric(x,str,num,b);}
if(num){x.s=1/n<0?(str=str.slice(1),-1):1;if(ERRORS&&str.replace(/^0\.0*|\./,'').length>15){raise(id,tooManyDigits,n);}
num=false;}else{x.s=str.charCodeAt(0)===45?(str=str.slice(1),-1):1;}
str=convertBase(str,10,b,x.s);}
if((e=str.indexOf('.'))>-1)str=str.replace('.','');if((i=str.search(/e/i))>0){if(e<0)e=i;e+=+str.slice(i+1);str=str.substring(0,i);}else if(e<0){e=str.length;}
for(i=0;str.charCodeAt(i)===48;i++);for(len=str.length;str.charCodeAt(--len)===48;);str=str.slice(i,len+1);if(str){len=str.length;if(num&&ERRORS&&len>15)raise(id,tooManyDigits,x.s*n);e=e-i-1;if(e>MAX_EXP){x.c=x.e=null;}else if(e<MIN_EXP){x.c=[x.e=0];}else{x.e=e;x.c=[];i=(e+1)%LOG_BASE;if(e<0)i+=LOG_BASE;if(i<len){if(i)x.c.push(+str.slice(0,i));for(len-=LOG_BASE;i<len;){x.c.push(+str.slice(i,i+=LOG_BASE));}
str=str.slice(i);i=LOG_BASE-str.length;}else{i-=len;}
for(;i--;str+='0');x.c.push(+str);}}else{x.c=[x.e=0];}
id=0;}
BigNumber.another=another;BigNumber.ROUND_UP=0;BigNumber.ROUND_DOWN=1;BigNumber.ROUND_CEIL=2;BigNumber.ROUND_FLOOR=3;BigNumber.ROUND_HALF_UP=4;BigNumber.ROUND_HALF_DOWN=5;BigNumber.ROUND_HALF_EVEN=6;BigNumber.ROUND_HALF_CEIL=7;BigNumber.ROUND_HALF_FLOOR=8;BigNumber.EUCLID=9;BigNumber.config=function(){var v,p,i=0,r={},a=arguments,o=a[0],has=o&&typeof o=='object'?function(){if(o.hasOwnProperty(p))return(v=o[p])!=null;}:function(){if(a.length>i)return(v=a[i++])!=null;};if(has(p='DECIMAL_PLACES')&&isValidInt(v,0,MAX,2,p)){DECIMAL_PLACES=v|0;}
r[p]=DECIMAL_PLACES;if(has(p='ROUNDING_MODE')&&isValidInt(v,0,8,2,p)){ROUNDING_MODE=v|0;}
r[p]=ROUNDING_MODE;if(has(p='EXPONENTIAL_AT')){if(isArray(v)){if(isValidInt(v[0],-MAX,0,2,p)&&isValidInt(v[1],0,MAX,2,p)){TO_EXP_NEG=v[0]|0;TO_EXP_POS=v[1]|0;}}else if(isValidInt(v,-MAX,MAX,2,p)){TO_EXP_NEG=-(TO_EXP_POS=(v<0?-v:v)|0);}}
r[p]=[TO_EXP_NEG,TO_EXP_POS];if(has(p='RANGE')){if(isArray(v)){if(isValidInt(v[0],-MAX,-1,2,p)&&isValidInt(v[1],1,MAX,2,p)){MIN_EXP=v[0]|0;MAX_EXP=v[1]|0;}}else if(isValidInt(v,-MAX,MAX,2,p)){if(v|0)MIN_EXP=-(MAX_EXP=(v<0?-v:v)|0);else if(ERRORS)raise(2,p+' cannot be zero',v);}}
r[p]=[MIN_EXP,MAX_EXP];if(has(p='ERRORS')){if(v===!!v||v===1||v===0){id=0;isValidInt=(ERRORS=!!v)?intValidatorWithErrors:intValidatorNoErrors;}else if(ERRORS){raise(2,p+notBool,v);}}
r[p]=ERRORS;if(has(p='CRYPTO')){if(v===!!v||v===1||v===0){CRYPTO=!!(v&&crypto&&typeof crypto=='object');if(v&&!CRYPTO&&ERRORS)raise(2,'crypto unavailable',crypto);}else if(ERRORS){raise(2,p+notBool,v);}}
r[p]=CRYPTO;if(has(p='MODULO_MODE')&&isValidInt(v,0,9,2,p)){MODULO_MODE=v|0;}
r[p]=MODULO_MODE;if(has(p='POW_PRECISION')&&isValidInt(v,0,MAX,2,p)){POW_PRECISION=v|0;}
r[p]=POW_PRECISION;if(has(p='FORMAT')){if(typeof v=='object'){FORMAT=v;}else if(ERRORS){raise(2,p+' not an object',v);}}
r[p]=FORMAT;return r;};BigNumber.max=function(){return maxOrMin(arguments,P.lt);};BigNumber.min=function(){return maxOrMin(arguments,P.gt);};BigNumber.random=(function(){var pow2_53=0x20000000000000;var random53bitInt=(Math.random()*pow2_53)&0x1fffff?function(){return mathfloor(Math.random()*pow2_53);}:function(){return((Math.random()*0x40000000|0)*0x800000)+
(Math.random()*0x800000|0);};return function(dp){var a,b,e,k,v,i=0,c=[],rand=new BigNumber(ONE);dp=dp==null||!isValidInt(dp,0,MAX,14)?DECIMAL_PLACES:dp|0;k=mathceil(dp/LOG_BASE);if(CRYPTO){if(crypto&&crypto.getRandomValues){a=crypto.getRandomValues(new Uint32Array(k*=2));for(;i<k;){v=a[i]*0x20000+(a[i+1]>>>11);if(v>=9e15){b=crypto.getRandomValues(new Uint32Array(2));a[i]=b[0];a[i+1]=b[1];}else{c.push(v%1e14);i+=2;}}
i=k/2;}else if(crypto&&crypto.randomBytes){a=crypto.randomBytes(k*=7);for(;i<k;){v=((a[i]&31)*0x1000000000000)+(a[i+1]*0x10000000000)+
(a[i+2]*0x100000000)+(a[i+3]*0x1000000)+
(a[i+4]<<16)+(a[i+5]<<8)+a[i+6];if(v>=9e15){crypto.randomBytes(7).copy(a,i);}else{c.push(v%1e14);i+=7;}}
i=k/7;}else if(ERRORS){raise(14,'crypto unavailable',crypto);}}
if(!i){for(;i<k;){v=random53bitInt();if(v<9e15)c[i++]=v%1e14;}}
k=c[--i];dp%=LOG_BASE;if(k&&dp){v=POWS_TEN[LOG_BASE-dp];c[i]=mathfloor(k/v)*v;}
for(;c[i]===0;c.pop(),i--);if(i<0){c=[e=0];}else{for(e=-1;c[0]===0;c.shift(),e-=LOG_BASE);for(i=1,v=c[0];v>=10;v/=10,i++);if(i<LOG_BASE)e-=LOG_BASE-i;}
rand.e=e;rand.c=c;return rand;};})();function convertBase(str,baseOut,baseIn,sign){var d,e,k,r,x,xc,y,i=str.indexOf('.'),dp=DECIMAL_PLACES,rm=ROUNDING_MODE;if(baseIn<37)str=str.toLowerCase();if(i>=0){k=POW_PRECISION;POW_PRECISION=0;str=str.replace('.','');y=new BigNumber(baseIn);x=y.pow(str.length-i);POW_PRECISION=k;y.c=toBaseOut(toFixedPoint(coeffToString(x.c),x.e),10,baseOut);y.e=y.c.length;}
xc=toBaseOut(str,baseIn,baseOut);e=k=xc.length;for(;xc[--k]==0;xc.pop());if(!xc[0])return'0';if(i<0){--e;}else{x.c=xc;x.e=e;x.s=sign;x=div(x,y,dp,rm,baseOut);xc=x.c;r=x.r;e=x.e;}
d=e+dp+1;i=xc[d];k=baseOut/2;r=r||d<0||xc[d+1]!=null;r=rm<4?(i!=null||r)&&(rm==0||rm==(x.s<0?3:2)):i>k||i==k&&(rm==4||r||rm==6&&xc[d-1]&1||rm==(x.s<0?8:7));if(d<1||!xc[0]){str=r?toFixedPoint('1',-dp):'0';}else{xc.length=d;if(r){for(--baseOut;++xc[--d]>baseOut;){xc[d]=0;if(!d){++e;xc.unshift(1);}}}
for(k=xc.length;!xc[--k];);for(i=0,str='';i<=k;str+=ALPHABET.charAt(xc[i++]));str=toFixedPoint(str,e);}
return str;}
div=(function(){function multiply(x,k,base){var m,temp,xlo,xhi,carry=0,i=x.length,klo=k%SQRT_BASE,khi=k/SQRT_BASE|0;for(x=x.slice();i--;){xlo=x[i]%SQRT_BASE;xhi=x[i]/SQRT_BASE|0;m=khi*xlo+xhi*klo;temp=klo*xlo+((m%SQRT_BASE)*SQRT_BASE)+carry;carry=(temp/base|0)+(m/SQRT_BASE|0)+khi*xhi;x[i]=temp%base;}
if(carry)x.unshift(carry);return x;}
function compare(a,b,aL,bL){var i,cmp;if(aL!=bL){cmp=aL>bL?1:-1;}else{for(i=cmp=0;i<aL;i++){if(a[i]!=b[i]){cmp=a[i]>b[i]?1:-1;break;}}}
return cmp;}
function subtract(a,b,aL,base){var i=0;for(;aL--;){a[aL]-=i;i=a[aL]<b[aL]?1:0;a[aL]=i*base+a[aL]-b[aL];}
for(;!a[0]&&a.length>1;a.shift());}
return function(x,y,dp,rm,base){var cmp,e,i,more,n,prod,prodL,q,qc,rem,remL,rem0,xi,xL,yc0,yL,yz,s=x.s==y.s?1:-1,xc=x.c,yc=y.c;if(!xc||!xc[0]||!yc||!yc[0]){return new BigNumber(!x.s||!y.s||(xc?yc&&xc[0]==yc[0]:!yc)?NaN:xc&&xc[0]==0||!yc?s*0:s/0);}
q=new BigNumber(s);qc=q.c=[];e=x.e-y.e;s=dp+e+1;if(!base){base=BASE;e=bitFloor(x.e/LOG_BASE)-bitFloor(y.e/LOG_BASE);s=s/LOG_BASE|0;}
for(i=0;yc[i]==(xc[i]||0);i++);if(yc[i]>(xc[i]||0))e--;if(s<0){qc.push(1);more=true;}else{xL=xc.length;yL=yc.length;i=0;s+=2;n=mathfloor(base/(yc[0]+1));if(n>1){yc=multiply(yc,n,base);xc=multiply(xc,n,base);yL=yc.length;xL=xc.length;}
xi=yL;rem=xc.slice(0,yL);remL=rem.length;for(;remL<yL;rem[remL++]=0);yz=yc.slice();yz.unshift(0);yc0=yc[0];if(yc[1]>=base/2)yc0++;do{n=0;cmp=compare(yc,rem,yL,remL);if(cmp<0){rem0=rem[0];if(yL!=remL)rem0=rem0*base+(rem[1]||0);n=mathfloor(rem0/yc0);if(n>1){if(n>=base)n=base-1;prod=multiply(yc,n,base);prodL=prod.length;remL=rem.length;while(compare(prod,rem,prodL,remL)==1){n--;subtract(prod,yL<prodL?yz:yc,prodL,base);prodL=prod.length;cmp=1;}}else{if(n==0){cmp=n=1;}
prod=yc.slice();prodL=prod.length;}
if(prodL<remL)prod.unshift(0);subtract(rem,prod,remL,base);remL=rem.length;if(cmp==-1){while(compare(yc,rem,yL,remL)<1){n++;subtract(rem,yL<remL?yz:yc,remL,base);remL=rem.length;}}}else if(cmp===0){n++;rem=[0];}
qc[i++]=n;if(rem[0]){rem.push(xc[xi]||0);remL=remL+1;}else{rem=[xc[xi]];remL=1;}}while((xi++<xL||rem[0]!=null)&&s--);more=rem[0]!=null;if(!qc[0])qc.shift();}
if(base==BASE){for(i=1,s=qc[0];s>=10;s/=10,i++);round(q,dp+(q.e=i+e*LOG_BASE-1)+1,rm,more);}else{q.e=e;q.r=+more;}
return q;};})();function format(n,i,rm,caller){var c0,e,ne,len,str;rm=rm!=null&&isValidInt(rm,0,8,caller,roundingMode)?rm|0:ROUNDING_MODE;if(!n.c)return n.toString();c0=n.c[0];ne=n.e;if(i==null){str=coeffToString(n.c);str=caller==19||caller==24&&ne<=TO_EXP_NEG?toExponential(str,ne):toFixedPoint(str,ne);}else{n=round(new BigNumber(n),i,rm);e=n.e;str=coeffToString(n.c);len=str.length;if(caller==19||caller==24&&(i<=e||e<=TO_EXP_NEG)){for(;len<i;str+='0',len++);str=toExponential(str,e);}else{i-=ne;str=toFixedPoint(str,e);if(e+1>len){if(--i>0)for(str+='.';i--;str+='0');}else{i+=e-len;if(i>0){if(e+1==len)str+='.';for(;i--;str+='0');}}}}
return n.s<0&&c0?'-'+str:str;}
function maxOrMin(args,method){var m,n,i=0;if(isArray(args[0]))args=args[0];m=new BigNumber(args[0]);for(;++i<args.length;){n=new BigNumber(args[i]);if(!n.s){m=n;break;}else if(method.call(m,n)){m=n;}}
return m;}
function intValidatorWithErrors(n,min,max,caller,name){if(n<min||n>max||n!=truncate(n)){raise(caller,(name||'decimal places')+
(n<min||n>max?' out of range':' not an integer'),n);}
return true;}
function normalise(n,c,e){var i=1,j=c.length;for(;!c[--j];c.pop());for(j=c[0];j>=10;j/=10,i++);if((e=i+e*LOG_BASE-1)>MAX_EXP){n.c=n.e=null;}else if(e<MIN_EXP){n.c=[n.e=0];}else{n.e=e;n.c=c;}
return n;}
parseNumeric=(function(){var basePrefix=/^(-?)0([xbo])/i,dotAfter=/^([^.]+)\.$/,dotBefore=/^\.([^.]+)$/,isInfinityOrNaN=/^-?(Infinity|NaN)$/,whitespaceOrPlus=/^\s*\+|^\s+|\s+$/g;return function(x,str,num,b){var base,s=num?str:str.replace(whitespaceOrPlus,'');if(isInfinityOrNaN.test(s)){x.s=isNaN(s)?null:s<0?-1:1;}else{if(!num){s=s.replace(basePrefix,function(m,p1,p2){base=(p2=p2.toLowerCase())=='x'?16:p2=='b'?2:8;return!b||b==base?p1:m;});if(b){base=b;s=s.replace(dotAfter,'$1').replace(dotBefore,'0.$1');}
if(str!=s)return new BigNumber(s,base);}
if(ERRORS)raise(id,'not a'+(b?' base '+b:'')+' number',str);x.s=null;}
x.c=x.e=null;id=0;}})();function raise(caller,msg,val){var error=new Error(['new BigNumber','cmp','config','div','divToInt','eq','gt','gte','lt','lte','minus','mod','plus','precision','random','round','shift','times','toDigits','toExponential','toFixed','toFormat','toFraction','pow','toPrecision','toString','BigNumber'][caller]+'() '+msg+': '+val);error.name='BigNumber Error';id=0;throw error;}
function round(x,sd,rm,r){var d,i,j,k,n,ni,rd,xc=x.c,pows10=POWS_TEN;if(xc){out:{for(d=1,k=xc[0];k>=10;k/=10,d++);i=sd-d;if(i<0){i+=LOG_BASE;j=sd;n=xc[ni=0];rd=n/pows10[d-j-1]%10|0;}else{ni=mathceil((i+1)/LOG_BASE);if(ni>=xc.length){if(r){for(;xc.length<=ni;xc.push(0));n=rd=0;d=1;i%=LOG_BASE;j=i-LOG_BASE+1;}else{break out;}}else{n=k=xc[ni];for(d=1;k>=10;k/=10,d++);i%=LOG_BASE;j=i-LOG_BASE+d;rd=j<0?0:n/pows10[d-j-1]%10|0;}}
r=r||sd<0||xc[ni+1]!=null||(j<0?n:n%pows10[d-j-1]);r=rm<4?(rd||r)&&(rm==0||rm==(x.s<0?3:2)):rd>5||rd==5&&(rm==4||r||rm==6&&((i>0?j>0?n/pows10[d-j]:0:xc[ni-1])%10)&1||rm==(x.s<0?8:7));if(sd<1||!xc[0]){xc.length=0;if(r){sd-=x.e+1;xc[0]=pows10[sd%LOG_BASE];x.e=-sd||0;}else{xc[0]=x.e=0;}
return x;}
if(i==0){xc.length=ni;k=1;ni--;}else{xc.length=ni+1;k=pows10[LOG_BASE-i];xc[ni]=j>0?mathfloor(n/pows10[d-j]%pows10[j])*k:0;}
if(r){for(;;){if(ni==0){for(i=1,j=xc[0];j>=10;j/=10,i++);j=xc[0]+=k;for(k=1;j>=10;j/=10,k++);if(i!=k){x.e++;if(xc[0]==BASE)xc[0]=1;}
break;}else{xc[ni]+=k;if(xc[ni]!=BASE)break;xc[ni--]=0;k=1;}}}
for(i=xc.length;xc[--i]===0;xc.pop());}
if(x.e>MAX_EXP){x.c=x.e=null;}else if(x.e<MIN_EXP){x.c=[x.e=0];}}
return x;}
P.absoluteValue=P.abs=function(){var x=new BigNumber(this);if(x.s<0)x.s=1;return x;};P.ceil=function(){return round(new BigNumber(this),this.e+1,2);};P.comparedTo=P.cmp=function(y,b){id=1;return compare(this,new BigNumber(y,b));};P.decimalPlaces=P.dp=function(){var n,v,c=this.c;if(!c)return null;n=((v=c.length-1)-bitFloor(this.e/LOG_BASE))*LOG_BASE;if(v=c[v])for(;v%10==0;v/=10,n--);if(n<0)n=0;return n;};P.dividedBy=P.div=function(y,b){id=3;return div(this,new BigNumber(y,b),DECIMAL_PLACES,ROUNDING_MODE);};P.dividedToIntegerBy=P.divToInt=function(y,b){id=4;return div(this,new BigNumber(y,b),0,1);};P.equals=P.eq=function(y,b){id=5;return compare(this,new BigNumber(y,b))===0;};P.floor=function(){return round(new BigNumber(this),this.e+1,3);};P.greaterThan=P.gt=function(y,b){id=6;return compare(this,new BigNumber(y,b))>0;};P.greaterThanOrEqualTo=P.gte=function(y,b){id=7;return(b=compare(this,new BigNumber(y,b)))===1||b===0;};P.isFinite=function(){return!!this.c;};P.isInteger=P.isInt=function(){return!!this.c&&bitFloor(this.e/LOG_BASE)>this.c.length-2;};P.isNaN=function(){return!this.s;};P.isNegative=P.isNeg=function(){return this.s<0;};P.isZero=function(){return!!this.c&&this.c[0]==0;};P.lessThan=P.lt=function(y,b){id=8;return compare(this,new BigNumber(y,b))<0;};P.lessThanOrEqualTo=P.lte=function(y,b){id=9;return(b=compare(this,new BigNumber(y,b)))===-1||b===0;};P.minus=P.sub=function(y,b){var i,j,t,xLTy,x=this,a=x.s;id=10;y=new BigNumber(y,b);b=y.s;if(!a||!b)return new BigNumber(NaN);if(a!=b){y.s=-b;return x.plus(y);}
var xe=x.e/LOG_BASE,ye=y.e/LOG_BASE,xc=x.c,yc=y.c;if(!xe||!ye){if(!xc||!yc)return xc?(y.s=-b,y):new BigNumber(yc?x:NaN);if(!xc[0]||!yc[0]){return yc[0]?(y.s=-b,y):new BigNumber(xc[0]?x:ROUNDING_MODE==3?-0:0);}}
xe=bitFloor(xe);ye=bitFloor(ye);xc=xc.slice();if(a=xe-ye){if(xLTy=a<0){a=-a;t=xc;}else{ye=xe;t=yc;}
t.reverse();for(b=a;b--;t.push(0));t.reverse();}else{j=(xLTy=(a=xc.length)<(b=yc.length))?a:b;for(a=b=0;b<j;b++){if(xc[b]!=yc[b]){xLTy=xc[b]<yc[b];break;}}}
if(xLTy)t=xc,xc=yc,yc=t,y.s=-y.s;b=(j=yc.length)-(i=xc.length);if(b>0)for(;b--;xc[i++]=0);b=BASE-1;for(;j>a;){if(xc[--j]<yc[j]){for(i=j;i&&!xc[--i];xc[i]=b);--xc[i];xc[j]+=BASE;}
xc[j]-=yc[j];}
for(;xc[0]==0;xc.shift(),--ye);if(!xc[0]){y.s=ROUNDING_MODE==3?-1:1;y.c=[y.e=0];return y;}
return normalise(y,xc,ye);};P.modulo=P.mod=function(y,b){var q,s,x=this;id=11;y=new BigNumber(y,b);if(!x.c||!y.s||y.c&&!y.c[0]){return new BigNumber(NaN);}else if(!y.c||x.c&&!x.c[0]){return new BigNumber(x);}
if(MODULO_MODE==9){s=y.s;y.s=1;q=div(x,y,0,3);y.s=s;q.s*=s;}else{q=div(x,y,0,MODULO_MODE);}
return x.minus(q.times(y));};P.negated=P.neg=function(){var x=new BigNumber(this);x.s=-x.s||null;return x;};P.plus=P.add=function(y,b){var t,x=this,a=x.s;id=12;y=new BigNumber(y,b);b=y.s;if(!a||!b)return new BigNumber(NaN);if(a!=b){y.s=-b;return x.minus(y);}
var xe=x.e/LOG_BASE,ye=y.e/LOG_BASE,xc=x.c,yc=y.c;if(!xe||!ye){if(!xc||!yc)return new BigNumber(a/0);if(!xc[0]||!yc[0])return yc[0]?y:new BigNumber(xc[0]?x:a*0);}
xe=bitFloor(xe);ye=bitFloor(ye);xc=xc.slice();if(a=xe-ye){if(a>0){ye=xe;t=yc;}else{a=-a;t=xc;}
t.reverse();for(;a--;t.push(0));t.reverse();}
a=xc.length;b=yc.length;if(a-b<0)t=yc,yc=xc,xc=t,b=a;for(a=0;b;){a=(xc[--b]=xc[b]+yc[b]+a)/BASE|0;xc[b]%=BASE;}
if(a){xc.unshift(a);++ye;}
return normalise(y,xc,ye);};P.precision=P.sd=function(z){var n,v,x=this,c=x.c;if(z!=null&&z!==!!z&&z!==1&&z!==0){if(ERRORS)raise(13,'argument'+notBool,z);if(z!=!!z)z=null;}
if(!c)return null;v=c.length-1;n=v*LOG_BASE+1;if(v=c[v]){for(;v%10==0;v/=10,n--);for(v=c[0];v>=10;v/=10,n++);}
if(z&&x.e+1>n)n=x.e+1;return n;};P.round=function(dp,rm){var n=new BigNumber(this);if(dp==null||isValidInt(dp,0,MAX,15)){round(n,~~dp+this.e+1,rm==null||!isValidInt(rm,0,8,15,roundingMode)?ROUNDING_MODE:rm|0);}
return n;};P.shift=function(k){var n=this;return isValidInt(k,-MAX_SAFE_INTEGER,MAX_SAFE_INTEGER,16,'argument')?n.times('1e'+truncate(k)):new BigNumber(n.c&&n.c[0]&&(k<-MAX_SAFE_INTEGER||k>MAX_SAFE_INTEGER)?n.s*(k<0?0:1/0):n);};P.squareRoot=P.sqrt=function(){var m,n,r,rep,t,x=this,c=x.c,s=x.s,e=x.e,dp=DECIMAL_PLACES+4,half=new BigNumber('0.5');if(s!==1||!c||!c[0]){return new BigNumber(!s||s<0&&(!c||c[0])?NaN:c?x:1/0);}
s=Math.sqrt(+x);if(s==0||s==1/0){n=coeffToString(c);if((n.length+e)%2==0)n+='0';s=Math.sqrt(n);e=bitFloor((e+1)/2)-(e<0||e%2);if(s==1/0){n='1e'+e;}else{n=s.toExponential();n=n.slice(0,n.indexOf('e')+1)+e;}
r=new BigNumber(n);}else{r=new BigNumber(s+'');}
if(r.c[0]){e=r.e;s=e+dp;if(s<3)s=0;for(;;){t=r;r=half.times(t.plus(div(x,t,dp,1)));if(coeffToString(t.c).slice(0,s)===(n=coeffToString(r.c)).slice(0,s)){if(r.e<e)--s;n=n.slice(s-3,s+1);if(n=='9999'||!rep&&n=='4999'){if(!rep){round(t,t.e+DECIMAL_PLACES+2,0);if(t.times(t).eq(x)){r=t;break;}}
dp+=4;s+=4;rep=1;}else{if(!+n||!+n.slice(1)&&n.charAt(0)=='5'){round(r,r.e+DECIMAL_PLACES+2,1);m=!r.times(r).eq(x);}
break;}}}}
return round(r,r.e+DECIMAL_PLACES+1,ROUNDING_MODE,m);};P.times=P.mul=function(y,b){var c,e,i,j,k,m,xcL,xlo,xhi,ycL,ylo,yhi,zc,base,sqrtBase,x=this,xc=x.c,yc=(id=17,y=new BigNumber(y,b)).c;if(!xc||!yc||!xc[0]||!yc[0]){if(!x.s||!y.s||xc&&!xc[0]&&!yc||yc&&!yc[0]&&!xc){y.c=y.e=y.s=null;}else{y.s*=x.s;if(!xc||!yc){y.c=y.e=null;}else{y.c=[0];y.e=0;}}
return y;}
e=bitFloor(x.e/LOG_BASE)+bitFloor(y.e/LOG_BASE);y.s*=x.s;xcL=xc.length;ycL=yc.length;if(xcL<ycL)zc=xc,xc=yc,yc=zc,i=xcL,xcL=ycL,ycL=i;for(i=xcL+ycL,zc=[];i--;zc.push(0));base=BASE;sqrtBase=SQRT_BASE;for(i=ycL;--i>=0;){c=0;ylo=yc[i]%sqrtBase;yhi=yc[i]/sqrtBase|0;for(k=xcL,j=i+k;j>i;){xlo=xc[--k]%sqrtBase;xhi=xc[k]/sqrtBase|0;m=yhi*xlo+xhi*ylo;xlo=ylo*xlo+((m%sqrtBase)*sqrtBase)+zc[j]+c;c=(xlo/base|0)+(m/sqrtBase|0)+yhi*xhi;zc[j--]=xlo%base;}
zc[j]=c;}
if(c){++e;}else{zc.shift();}
return normalise(y,zc,e);};P.toDigits=function(sd,rm){var n=new BigNumber(this);sd=sd==null||!isValidInt(sd,1,MAX,18,'precision')?null:sd|0;rm=rm==null||!isValidInt(rm,0,8,18,roundingMode)?ROUNDING_MODE:rm|0;return sd?round(n,sd,rm):n;};P.toExponential=function(dp,rm){return format(this,dp!=null&&isValidInt(dp,0,MAX,19)?~~dp+1:null,rm,19);};P.toFixed=function(dp,rm){return format(this,dp!=null&&isValidInt(dp,0,MAX,20)?~~dp+this.e+1:null,rm,20);};P.toFormat=function(dp,rm){var str=format(this,dp!=null&&isValidInt(dp,0,MAX,21)?~~dp+this.e+1:null,rm,21);if(this.c){var i,arr=str.split('.'),g1=+FORMAT.groupSize,g2=+FORMAT.secondaryGroupSize,groupSeparator=FORMAT.groupSeparator,intPart=arr[0],fractionPart=arr[1],isNeg=this.s<0,intDigits=isNeg?intPart.slice(1):intPart,len=intDigits.length;if(g2)i=g1,g1=g2,g2=i,len-=i;if(g1>0&&len>0){i=len%g1||g1;intPart=intDigits.substr(0,i);for(;i<len;i+=g1){intPart+=groupSeparator+intDigits.substr(i,g1);}
if(g2>0)intPart+=groupSeparator+intDigits.slice(i);if(isNeg)intPart='-'+intPart;}
str=fractionPart?intPart+FORMAT.decimalSeparator+((g2=+FORMAT.fractionGroupSize)?fractionPart.replace(new RegExp('\\d{'+g2+'}\\B','g'),'$&'+FORMAT.fractionGroupSeparator):fractionPart):intPart;}
return str;};P.toFraction=function(md){var arr,d0,d2,e,exp,n,n0,q,s,k=ERRORS,x=this,xc=x.c,d=new BigNumber(ONE),n1=d0=new BigNumber(ONE),d1=n0=new BigNumber(ONE);if(md!=null){ERRORS=false;n=new BigNumber(md);ERRORS=k;if(!(k=n.isInt())||n.lt(ONE)){if(ERRORS){raise(22,'max denominator '+(k?'out of range':'not an integer'),md);}
md=!k&&n.c&&round(n,n.e+1,1).gte(ONE)?n:null;}}
if(!xc)return x.toString();s=coeffToString(xc);e=d.e=s.length-x.e-1;d.c[0]=POWS_TEN[(exp=e%LOG_BASE)<0?LOG_BASE+exp:exp];md=!md||n.cmp(d)>0?(e>0?d:n1):n;exp=MAX_EXP;MAX_EXP=1/0;n=new BigNumber(s);n0.c[0]=0;for(;;){q=div(n,d,0,1);d2=d0.plus(q.times(d1));if(d2.cmp(md)==1)break;d0=d1;d1=d2;n1=n0.plus(q.times(d2=n1));n0=d2;d=n.minus(q.times(d2=d));n=d2;}
d2=div(md.minus(d0),d1,0,1);n0=n0.plus(d2.times(n1));d0=d0.plus(d2.times(d1));n0.s=n1.s=x.s;e*=2;arr=div(n1,d1,e,ROUNDING_MODE).minus(x).abs().cmp(div(n0,d0,e,ROUNDING_MODE).minus(x).abs())<1?[n1.toString(),d1.toString()]:[n0.toString(),d0.toString()];MAX_EXP=exp;return arr;};P.toNumber=function(){var x=this;return+x||(x.s?x.s*0:NaN);};P.toPower=P.pow=function(n){var k,y,i=mathfloor(n<0?-n:+n),x=this;if(!isValidInt(n,-MAX_SAFE_INTEGER,MAX_SAFE_INTEGER,23,'exponent')&&(!isFinite(n)||i>MAX_SAFE_INTEGER&&(n/=0)||parseFloat(n)!=n&&!(n=NaN))){return new BigNumber(Math.pow(+x,n));}
k=POW_PRECISION?mathceil(POW_PRECISION/LOG_BASE+2):0;y=new BigNumber(ONE);for(;;){if(i%2){y=y.times(x);if(!y.c)break;if(k&&y.c.length>k)y.c.length=k;}
i=mathfloor(i/2);if(!i)break;x=x.times(x);if(k&&x.c&&x.c.length>k)x.c.length=k;}
if(n<0)y=ONE.div(y);return k?round(y,POW_PRECISION,ROUNDING_MODE):y;};P.toPrecision=function(sd,rm){return format(this,sd!=null&&isValidInt(sd,1,MAX,24,'precision')?sd|0:null,rm,24);};P.toString=function(b){var str,n=this,s=n.s,e=n.e;if(e===null){if(s){str='Infinity';if(s<0)str='-'+str;}else{str='NaN';}}else{str=coeffToString(n.c);if(b==null||!isValidInt(b,2,64,25,'base')){str=e<=TO_EXP_NEG||e>=TO_EXP_POS?toExponential(str,e):toFixedPoint(str,e);}else{str=convertBase(toFixedPoint(str,e),b|0,10,s);}
if(s<0&&n.c[0])str='-'+str;}
return str;};P.truncated=P.trunc=function(){return round(new BigNumber(this),this.e+1,1);};P.valueOf=P.toJSON=function(){return this.toString();};if(configObj!=null)BigNumber.config(configObj);return BigNumber;}
function bitFloor(n){var i=n|0;return n>0||n===i?i:i-1;}
function coeffToString(a){var s,z,i=1,j=a.length,r=a[0]+'';for(;i<j;){s=a[i++]+'';z=LOG_BASE-s.length;for(;z--;s='0'+s);r+=s;}
for(j=r.length;r.charCodeAt(--j)===48;);return r.slice(0,j+1||1);}
function compare(x,y){var a,b,xc=x.c,yc=y.c,i=x.s,j=y.s,k=x.e,l=y.e;if(!i||!j)return null;a=xc&&!xc[0];b=yc&&!yc[0];if(a||b)return a?b?0:-j:i;if(i!=j)return i;a=i<0;b=k==l;if(!xc||!yc)return b?0:!xc^a?1:-1;if(!b)return k>l^a?1:-1;j=(k=xc.length)<(l=yc.length)?k:l;for(i=0;i<j;i++)if(xc[i]!=yc[i])return xc[i]>yc[i]^a?1:-1;return k==l?0:k>l^a?1:-1;}
function intValidatorNoErrors(n,min,max){return(n=truncate(n))>=min&&n<=max;}
function isArray(obj){return Object.prototype.toString.call(obj)=='[object Array]';}
function toBaseOut(str,baseIn,baseOut){var j,arr=[0],arrL,i=0,len=str.length;for(;i<len;){for(arrL=arr.length;arrL--;arr[arrL]*=baseIn);arr[j=0]+=ALPHABET.indexOf(str.charAt(i++));for(;j<arr.length;j++){if(arr[j]>baseOut-1){if(arr[j+1]==null)arr[j+1]=0;arr[j+1]+=arr[j]/baseOut|0;arr[j]%=baseOut;}}}
return arr.reverse();}
function toExponential(str,e){return(str.length>1?str.charAt(0)+'.'+str.slice(1):str)+
(e<0?'e':'e+')+e;}
function toFixedPoint(str,e){var len,z;if(e<0){for(z='0.';++e;z+='0');str=z+str;}else{len=str.length;if(++e>len){for(z='0',e-=len;--e;z+='0');str+=z;}else if(e<len){str=str.slice(0,e)+'.'+str.slice(e);}}
return str;}
function truncate(n){n=parseFloat(n);return n<0?mathceil(n):mathfloor(n);}
BigNumber=another();if(true){!(__WEBPACK_AMD_DEFINE_RESULT__=function(){return BigNumber;}.call(exports,__webpack_require__,exports,module),__WEBPACK_AMD_DEFINE_RESULT__!==undefined&&(module.exports=__WEBPACK_AMD_DEFINE_RESULT__));}else if(typeof module!='undefined'&&module.exports){module.exports=BigNumber;if(!crypto)try{crypto=require('crypto');}catch(e){}}else{global.BigNumber=BigNumber;}})(this);}),(function(module,exports,__webpack_require__){var BigNumber=__webpack_require__(38);var ETH_UNITS=['wei','kwei','Mwei','Gwei','szabo','finney','femtoether','picoether','nanoether','microether','milliether','nano','micro','milli','ether','grand','Mether','Gether','Tether','Pether','Eether','Zether','Yether','Nether','Dether','Vether','Uether'];module.exports={ETH_PADDING:32,ETH_SIGNATURE_LENGTH:4,ETH_UNITS:ETH_UNITS,ETH_BIGNUMBER_ROUNDING_MODE:{ROUNDING_MODE:BigNumber.ROUND_DOWN},ETH_POLLING_TIMEOUT:1000/2,defaultBlock:'latest',defaultAccount:undefined};}),(function(module,exports,__webpack_require__){var formatters=__webpack_require__(11);var utils=__webpack_require__(3);var toTopic=function(value){if(value===null||typeof value==='undefined')
return null;value=String(value);if(value.indexOf('0x')===0)
return value;else
return utils.fromUtf8(value);};var getOptions=function(options){if(utils.isString(options)){return options;}
options=options||{};options.topics=options.topics||[];options.topics=options.topics.map(function(topic){return(utils.isArray(topic))?topic.map(toTopic):toTopic(topic);});return{topics:options.topics,from:options.from,to:options.to,address:options.address,fromBlock:formatters.inputBlockNumberFormatter(options.fromBlock),toBlock:formatters.inputBlockNumberFormatter(options.toBlock)};};var getLogsAtStart=function(self,callback){if(!utils.isString(self.options)){self.get(function(err,messages){if(err){callback(err);}
if(utils.isArray(messages)){messages.forEach(function(message){callback(null,message);});}});}};var pollFilter=function(self){var onMessage=function(error,messages){if(error){return self.callbacks.forEach(function(callback){callback(error);});}
if(utils.isArray(messages)){messages.forEach(function(message){message=self.formatter?self.formatter(message):message;self.callbacks.forEach(function(callback){callback(null,message);});});}};self.requestManager.startPolling({method:self.implementation.poll.call,params:[self.filterId],},self.filterId,onMessage,self.stopWatching.bind(self));};var Filter=function(requestManager,options,methods,formatter,callback){var self=this;var implementation={};methods.forEach(function(method){method.setRequestManager(requestManager);method.attachToObject(implementation);});this.requestManager=requestManager;this.options=getOptions(options);this.implementation=implementation;this.filterId=null;this.callbacks=[];this.getLogsCallbacks=[];this.pollFilters=[];this.formatter=formatter;this.implementation.newFilter(this.options,function(error,id){if(error){self.callbacks.forEach(function(cb){cb(error);});}else{self.filterId=id;self.getLogsCallbacks.forEach(function(cb){self.get(cb);});self.getLogsCallbacks=[];self.callbacks.forEach(function(cb){getLogsAtStart(self,cb);});if(self.callbacks.length>0)
pollFilter(self);if(typeof callback==='function'){return self.watch(callback);}}});return this;};Filter.prototype.watch=function(callback){this.callbacks.push(callback);if(this.filterId){getLogsAtStart(this,callback);pollFilter(this);}
return this;};Filter.prototype.stopWatching=function(){this.requestManager.stopPolling(this.filterId);this.implementation.uninstallFilter(this.filterId,function(){});this.callbacks=[];};Filter.prototype.get=function(callback){var self=this;if(utils.isFunction(callback)){if(this.filterId===null){this.getLogsCallbacks.push(callback);}else{this.implementation.getLogs(this.filterId,function(err,res){if(err){callback(err);}else{callback(null,res.map(function(log){return self.formatter?self.formatter(log):log;}));}});}}else{if(this.filterId===null){throw new Error('Filter ID Error: filter().get() can\'t be chained synchronous, please provide a callback for the get() method.');}
var logs=this.implementation.getLogs(this.filterId);return logs.map(function(log){return self.formatter?self.formatter(log):log;});}
return this;};module.exports=Filter;}),(function(module,exports,__webpack_require__){var BigNumber=__webpack_require__(38);var padLeft=function(string,bytes){var result=string;while(result.length<bytes*2){result='00'+result;}
return result;};var iso13616Prepare=function(iban){var A='A'.charCodeAt(0);var Z='Z'.charCodeAt(0);iban=iban.toUpperCase();iban=iban.substr(4)+iban.substr(0,4);return iban.split('').map(function(n){var code=n.charCodeAt(0);if(code>=A&&code<=Z){return code-A+10;}else{return n;}}).join('');};var mod9710=function(iban){var remainder=iban,block;while(remainder.length>2){block=remainder.slice(0,9);remainder=parseInt(block,10)%97+remainder.slice(block.length);}
return parseInt(remainder,10)%97;};var Iban=function(iban){this._iban=iban;};Iban.fromAddress=function(address){var asBn=new BigNumber(address,16);var base36=asBn.toString(36);var padded=padLeft(base36,15);return Iban.fromBban(padded.toUpperCase());};Iban.fromBban=function(bban){var countryCode='XE';var remainder=mod9710(iso13616Prepare(countryCode+'00'+bban));var checkDigit=('0'+(98-remainder)).slice(-2);return new Iban(countryCode+checkDigit+bban);};Iban.createIndirect=function(options){return Iban.fromBban('ETH'+options.institution+options.identifier);};Iban.isValid=function(iban){var i=new Iban(iban);return i.isValid();};Iban.prototype.isValid=function(){return/^XE[0-9]{2}(ETH[0-9A-Z]{13}|[0-9A-Z]{30,31})$/.test(this._iban)&&mod9710(iso13616Prepare(this._iban))===1;};Iban.prototype.isDirect=function(){return this._iban.length===34||this._iban.length===35;};Iban.prototype.isIndirect=function(){return this._iban.length===20;};Iban.prototype.checksum=function(){return this._iban.substr(2,2);};Iban.prototype.institution=function(){return this.isIndirect()?this._iban.substr(7,4):'';};Iban.prototype.client=function(){return this.isIndirect()?this._iban.substr(11):'';};Iban.prototype.address=function(){if(this.isDirect()){var base36=this._iban.substr(4);var asBn=new BigNumber(base36,36);return padLeft(asBn.toString(16),20);}
return'';};Iban.prototype.toString=function(){return this._iban;};module.exports=Iban;}),(function(module,exports,__webpack_require__){var Method=__webpack_require__(20);var eth=function(){var newFilterCall=function(args){var type=args[0];switch(type){case'latest':args.shift();this.params=0;return'eth_newBlockFilter';case'pending':args.shift();this.params=0;return'eth_newPendingTransactionFilter';default:return'eth_newFilter';}};var newFilter=new Method({name:'newFilter',call:newFilterCall,params:1});var uninstallFilter=new Method({name:'uninstallFilter',call:'eth_uninstallFilter',params:1});var getLogs=new Method({name:'getLogs',call:'eth_getFilterLogs',params:1});var poll=new Method({name:'poll',call:'eth_getFilterChanges',params:1});return[newFilter,uninstallFilter,getLogs,poll];};var shh=function(){var newFilter=new Method({name:'newFilter',call:'shh_newFilter',params:1});var uninstallFilter=new Method({name:'uninstallFilter',call:'shh_uninstallFilter',params:1});var getLogs=new Method({name:'getLogs',call:'shh_getMessages',params:1});var poll=new Method({name:'poll',call:'shh_getFilterChanges',params:1});return[newFilter,uninstallFilter,getLogs,poll];};module.exports={eth:eth,shh:shh};}),(function(module,exports,__webpack_require__){var BigNumber=__webpack_require__(30);var ETH_UNITS=['wei','kwei','Mwei','Gwei','szabo','finney','femtoether','picoether','nanoether','microether','milliether','nano','micro','milli','ether','grand','Mether','Gether','Tether','Pether','Eether','Zether','Yether','Nether','Dether','Vether','Uether'];module.exports={ETH_PADDING:32,ETH_SIGNATURE_LENGTH:4,ETH_UNITS:ETH_UNITS,ETH_BIGNUMBER_ROUNDING_MODE:{ROUNDING_MODE:BigNumber.ROUND_DOWN},ETH_POLLING_TIMEOUT:1000/2,defaultBlock:'latest',defaultAccount:undefined};}),(function(module,exports,__webpack_require__){var formatters=__webpack_require__(13);var utils=__webpack_require__(4);var toTopic=function(value){if(value===null||typeof value==='undefined')
return null;value=String(value);if(value.indexOf('0x')===0)
return value;else
return utils.fromUtf8(value);};var getOptions=function(options,type){if(utils.isString(options)){return options;}
options=options||{};switch(type){case'eth':options.topics=options.topics||[];options.topics=options.topics.map(function(topic){return(utils.isArray(topic))?topic.map(toTopic):toTopic(topic);});return{topics:options.topics,from:options.from,to:options.to,address:options.address,fromBlock:formatters.inputBlockNumberFormatter(options.fromBlock),toBlock:formatters.inputBlockNumberFormatter(options.toBlock)};case'shh':return options;}};var getLogsAtStart=function(self,callback){if(!utils.isString(self.options)){self.get(function(err,messages){if(err){callback(err);}
if(utils.isArray(messages)){messages.forEach(function(message){callback(null,message);});}});}};var pollFilter=function(self){var onMessage=function(error,messages){if(error){return self.callbacks.forEach(function(callback){callback(error);});}
if(utils.isArray(messages)){messages.forEach(function(message){message=self.formatter?self.formatter(message):message;self.callbacks.forEach(function(callback){callback(null,message);});});}};self.requestManager.startPolling({method:self.implementation.poll.call,params:[self.filterId],},self.filterId,onMessage,self.stopWatching.bind(self));};var Filter=function(options,type,requestManager,methods,formatter,callback,filterCreationErrorCallback){var self=this;var implementation={};methods.forEach(function(method){method.setRequestManager(requestManager);method.attachToObject(implementation);});this.requestManager=requestManager;this.options=getOptions(options,type);this.implementation=implementation;this.filterId=null;this.callbacks=[];this.getLogsCallbacks=[];this.pollFilters=[];this.formatter=formatter;this.implementation.newFilter(this.options,function(error,id){if(error){self.callbacks.forEach(function(cb){cb(error);});if(typeof filterCreationErrorCallback==='function'){filterCreationErrorCallback(error);}}else{self.filterId=id;self.getLogsCallbacks.forEach(function(cb){self.get(cb);});self.getLogsCallbacks=[];self.callbacks.forEach(function(cb){getLogsAtStart(self,cb);});if(self.callbacks.length>0)
pollFilter(self);if(typeof callback==='function'){return self.watch(callback);}}});return this;};Filter.prototype.watch=function(callback){this.callbacks.push(callback);if(this.filterId){getLogsAtStart(this,callback);pollFilter(this);}
return this;};Filter.prototype.stopWatching=function(callback){this.requestManager.stopPolling(this.filterId);this.callbacks=[];if(callback){this.implementation.uninstallFilter(this.filterId,callback);}else{return this.implementation.uninstallFilter(this.filterId);}};Filter.prototype.get=function(callback){var self=this;if(utils.isFunction(callback)){if(this.filterId===null){this.getLogsCallbacks.push(callback);}else{this.implementation.getLogs(this.filterId,function(err,res){if(err){callback(err);}else{callback(null,res.map(function(log){return self.formatter?self.formatter(log):log;}));}});}}else{if(this.filterId===null){throw new Error('Filter ID Error: filter().get() can\'t be chained synchronous, please provide a callback for the get() method.');}
var logs=this.implementation.getLogs(this.filterId);return logs.map(function(log){return self.formatter?self.formatter(log):log;});}
return this;};module.exports=Filter;}),(function(module,exports,__webpack_require__){var BigNumber=__webpack_require__(30);var padLeft=function(string,bytes){var result=string;while(result.length<bytes*2){result='0'+result;}
return result;};var iso13616Prepare=function(iban){var A='A'.charCodeAt(0);var Z='Z'.charCodeAt(0);iban=iban.toUpperCase();iban=iban.substr(4)+iban.substr(0,4);return iban.split('').map(function(n){var code=n.charCodeAt(0);if(code>=A&&code<=Z){return code-A+10;}else{return n;}}).join('');};var mod9710=function(iban){var remainder=iban,block;while(remainder.length>2){block=remainder.slice(0,9);remainder=parseInt(block,10)%97+remainder.slice(block.length);}
return parseInt(remainder,10)%97;};var Iban=function(iban){this._iban=iban;};Iban.fromAddress=function(address){var asBn=new BigNumber(address,16);var base36=asBn.toString(36);var padded=padLeft(base36,15);return Iban.fromBban(padded.toUpperCase());};Iban.fromBban=function(bban){var countryCode='XE';var remainder=mod9710(iso13616Prepare(countryCode+'00'+bban));var checkDigit=('0'+(98-remainder)).slice(-2);return new Iban(countryCode+checkDigit+bban);};Iban.createIndirect=function(options){return Iban.fromBban('ETH'+options.institution+options.identifier);};Iban.isValid=function(iban){var i=new Iban(iban);return i.isValid();};Iban.prototype.isValid=function(){return/^XE[0-9]{2}(ETH[0-9A-Z]{13}|[0-9A-Z]{30,31})$/.test(this._iban)&&mod9710(iso13616Prepare(this._iban))===1;};Iban.prototype.isDirect=function(){return this._iban.length===34||this._iban.length===35;};Iban.prototype.isIndirect=function(){return this._iban.length===20;};Iban.prototype.checksum=function(){return this._iban.substr(2,2);};Iban.prototype.institution=function(){return this.isIndirect()?this._iban.substr(7,4):'';};Iban.prototype.client=function(){return this.isIndirect()?this._iban.substr(11):'';};Iban.prototype.address=function(){if(this.isDirect()){var base36=this._iban.substr(4);var asBn=new BigNumber(base36,36);return padLeft(asBn.toString(16),20);}
return'';};Iban.prototype.toString=function(){return this._iban;};module.exports=Iban;}),(function(module,exports,__webpack_require__){var Method=__webpack_require__(15);var eth=function(){var newFilterCall=function(args){var type=args[0];switch(type){case'latest':args.shift();this.params=0;return'eth_newBlockFilter';case'pending':args.shift();this.params=0;return'eth_newPendingTransactionFilter';default:return'eth_newFilter';}};var newFilter=new Method({name:'newFilter',call:newFilterCall,params:1});var uninstallFilter=new Method({name:'uninstallFilter',call:'eth_uninstallFilter',params:1});var getLogs=new Method({name:'getLogs',call:'eth_getFilterLogs',params:1});var poll=new Method({name:'poll',call:'eth_getFilterChanges',params:1});return[newFilter,uninstallFilter,getLogs,poll];};var shh=function(){return[new Method({name:'newFilter',call:'shh_newMessageFilter',params:1}),new Method({name:'uninstallFilter',call:'shh_deleteMessageFilter',params:1}),new Method({name:'getLogs',call:'shh_getFilterMessages',params:1}),new Method({name:'poll',call:'shh_getFilterMessages',params:1})];};module.exports={eth:eth,shh:shh};}),(function(module,exports){var g;g=(function(){return this;})();try{g=g||Function("return this")()||(1,eval)("this");}catch(e){if(typeof window==="object")
g=window;}
module.exports=g;}),(function(module,exports,__webpack_require__){;(function(root,factory){if(true){module.exports=exports=factory(__webpack_require__(0));}
else if(typeof define==="function"&&define.amd){define(["./core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){(function(){var C=CryptoJS;var C_lib=C.lib;var Base=C_lib.Base;var C_enc=C.enc;var Utf8=C_enc.Utf8;var C_algo=C.algo;var HMAC=C_algo.HMAC=Base.extend({init:function(hasher,key){hasher=this._hasher=new hasher.init();if(typeof key=='string'){key=Utf8.parse(key);}
var hasherBlockSize=hasher.blockSize;var hasherBlockSizeBytes=hasherBlockSize*4;if(key.sigBytes>hasherBlockSizeBytes){key=hasher.finalize(key);}
key.clamp();var oKey=this._oKey=key.clone();var iKey=this._iKey=key.clone();var oKeyWords=oKey.words;var iKeyWords=iKey.words;for(var i=0;i<hasherBlockSize;i++){oKeyWords[i]^=0x5c5c5c5c;iKeyWords[i]^=0x36363636;}
oKey.sigBytes=iKey.sigBytes=hasherBlockSizeBytes;this.reset();},reset:function(){var hasher=this._hasher;hasher.reset();hasher.update(this._iKey);},update:function(messageUpdate){this._hasher.update(messageUpdate);return this;},finalize:function(messageUpdate){var hasher=this._hasher;var innerHash=hasher.finalize(messageUpdate);hasher.reset();var hmac=hasher.finalize(this._oKey.clone().concat(innerHash));return hmac;}});}());}));}),(function(module,exports,__webpack_require__){;(function(root,factory,undef){if(true){module.exports=exports=factory(__webpack_require__(0),__webpack_require__(33),__webpack_require__(79),__webpack_require__(77),__webpack_require__(16),__webpack_require__(18),__webpack_require__(50),__webpack_require__(57),__webpack_require__(95),__webpack_require__(58),__webpack_require__(96),__webpack_require__(32),__webpack_require__(94),__webpack_require__(48),__webpack_require__(90),__webpack_require__(17),__webpack_require__(1),__webpack_require__(80),__webpack_require__(82),__webpack_require__(81),__webpack_require__(84),__webpack_require__(83),__webpack_require__(85),__webpack_require__(86),__webpack_require__(87),__webpack_require__(89),__webpack_require__(88),__webpack_require__(78),__webpack_require__(76),__webpack_require__(97),__webpack_require__(93),__webpack_require__(92),__webpack_require__(91));}
else if(typeof define==="function"&&define.amd){define(["./core","./x64-core","./lib-typedarrays","./enc-utf16","./enc-base64","./md5","./sha1","./sha256","./sha224","./sha512","./sha384","./sha3","./ripemd160","./hmac","./pbkdf2","./evpkdf","./cipher-core","./mode-cfb","./mode-ctr","./mode-ctr-gladman","./mode-ofb","./mode-ecb","./pad-ansix923","./pad-iso10126","./pad-iso97971","./pad-zeropadding","./pad-nopadding","./format-hex","./aes","./tripledes","./rc4","./rabbit","./rabbit-legacy"],factory);}
else{root.CryptoJS=factory(root.CryptoJS);}}(this,function(CryptoJS){return CryptoJS;}));}),(function(module,exports,__webpack_require__){;(function(root,factory){if(true){module.exports=exports=factory(__webpack_require__(0));}
else if(typeof define==="function"&&define.amd){define(["./core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){(function(){var C=CryptoJS;var C_lib=C.lib;var WordArray=C_lib.WordArray;var Hasher=C_lib.Hasher;var C_algo=C.algo;var W=[];var SHA1=C_algo.SHA1=Hasher.extend({_doReset:function(){this._hash=new WordArray.init([0x67452301,0xefcdab89,0x98badcfe,0x10325476,0xc3d2e1f0]);},_doProcessBlock:function(M,offset){var H=this._hash.words;var a=H[0];var b=H[1];var c=H[2];var d=H[3];var e=H[4];for(var i=0;i<80;i++){if(i<16){W[i]=M[offset+i]|0;}else{var n=W[i-3]^W[i-8]^W[i-14]^W[i-16];W[i]=(n<<1)|(n>>>31);}
var t=((a<<5)|(a>>>27))+e+W[i];if(i<20){t+=((b&c)|(~b&d))+0x5a827999;}else if(i<40){t+=(b^c^d)+0x6ed9eba1;}else if(i<60){t+=((b&c)|(b&d)|(c&d))-0x70e44324;}else{t+=(b^c^d)-0x359d3e2a;}
e=d;d=c;c=(b<<30)|(b>>>2);b=a;a=t;}
H[0]=(H[0]+a)|0;H[1]=(H[1]+b)|0;H[2]=(H[2]+c)|0;H[3]=(H[3]+d)|0;H[4]=(H[4]+e)|0;},_doFinalize:function(){var data=this._data;var dataWords=data.words;var nBitsTotal=this._nDataBytes*8;var nBitsLeft=data.sigBytes*8;dataWords[nBitsLeft>>>5]|=0x80<<(24-nBitsLeft%32);dataWords[(((nBitsLeft+64)>>>9)<<4)+14]=Math.floor(nBitsTotal/0x100000000);dataWords[(((nBitsLeft+64)>>>9)<<4)+15]=nBitsTotal;data.sigBytes=dataWords.length*4;this._process();return this._hash;},clone:function(){var clone=Hasher.clone.call(this);clone._hash=this._hash.clone();return clone;}});C.SHA1=Hasher._createHelper(SHA1);C.HmacSHA1=Hasher._createHmacHelper(SHA1);}());return CryptoJS.SHA1;}));}),(function(module,exports,__webpack_require__){var f=__webpack_require__(5);var SolidityTypeAddress=__webpack_require__(115);var SolidityTypeBool=__webpack_require__(116);var SolidityTypeInt=__webpack_require__(119);var SolidityTypeUInt=__webpack_require__(122);var SolidityTypeDynamicBytes=__webpack_require__(118);var SolidityTypeString=__webpack_require__(121);var SolidityTypeReal=__webpack_require__(120);var SolidityTypeUReal=__webpack_require__(123);var SolidityTypeBytes=__webpack_require__(117);var isDynamic=function(solidityType,type){return solidityType.isDynamicType(type)||solidityType.isDynamicArray(type);};var SolidityCoder=function(types){this._types=types;};SolidityCoder.prototype._requireType=function(type){var solidityType=this._types.filter(function(t){return t.isType(type);})[0];if(!solidityType){throw Error('invalid solidity type!: '+type);}
return solidityType;};SolidityCoder.prototype.encodeParam=function(type,param){return this.encodeParams([type],[param]);};SolidityCoder.prototype.encodeParams=function(types,params){var solidityTypes=this.getSolidityTypes(types);var encodeds=solidityTypes.map(function(solidityType,index){return solidityType.encode(params[index],types[index]);});var dynamicOffset=solidityTypes.reduce(function(acc,solidityType,index){var staticPartLength=solidityType.staticPartLength(types[index]);var roundedStaticPartLength=Math.floor((staticPartLength+31)/32)*32;return acc+(isDynamic(solidityTypes[index],types[index])?32:roundedStaticPartLength);},0);var result=this.encodeMultiWithOffset(types,solidityTypes,encodeds,dynamicOffset);return result;};SolidityCoder.prototype.encodeMultiWithOffset=function(types,solidityTypes,encodeds,dynamicOffset){var result="";var self=this;types.forEach(function(type,i){if(isDynamic(solidityTypes[i],types[i])){result+=f.formatInputInt(dynamicOffset).encode();var e=self.encodeWithOffset(types[i],solidityTypes[i],encodeds[i],dynamicOffset);dynamicOffset+=e.length/2;}else{result+=self.encodeWithOffset(types[i],solidityTypes[i],encodeds[i],dynamicOffset);}});types.forEach(function(type,i){if(isDynamic(solidityTypes[i],types[i])){var e=self.encodeWithOffset(types[i],solidityTypes[i],encodeds[i],dynamicOffset);dynamicOffset+=e.length/2;result+=e;}});return result;};SolidityCoder.prototype.encodeWithOffset=function(type,solidityType,encoded,offset){var self=this;if(solidityType.isDynamicArray(type)){return(function(){var nestedName=solidityType.nestedName(type);var nestedStaticPartLength=solidityType.staticPartLength(nestedName);var result=encoded[0];(function(){var previousLength=2;if(solidityType.isDynamicArray(nestedName)){for(var i=1;i<encoded.length;i++){previousLength+=+(encoded[i-1])[0]||0;result+=f.formatInputInt(offset+i*nestedStaticPartLength+previousLength*32).encode();}}})();(function(){for(var i=0;i<encoded.length-1;i++){var additionalOffset=result/2;result+=self.encodeWithOffset(nestedName,solidityType,encoded[i+1],offset+additionalOffset);}})();return result;})();}else if(solidityType.isStaticArray(type)){return(function(){var nestedName=solidityType.nestedName(type);var nestedStaticPartLength=solidityType.staticPartLength(nestedName);var result="";if(solidityType.isDynamicArray(nestedName)){(function(){var previousLength=0;for(var i=0;i<encoded.length;i++){previousLength+=+(encoded[i-1]||[])[0]||0;result+=f.formatInputInt(offset+i*nestedStaticPartLength+previousLength*32).encode();}})();}
(function(){for(var i=0;i<encoded.length;i++){var additionalOffset=result/2;result+=self.encodeWithOffset(nestedName,solidityType,encoded[i],offset+additionalOffset);}})();return result;})();}
return encoded;};SolidityCoder.prototype.decodeParam=function(type,bytes){return this.decodeParams([type],bytes)[0];};SolidityCoder.prototype.decodeParams=function(types,bytes){var solidityTypes=this.getSolidityTypes(types);var offsets=this.getOffsets(types,solidityTypes);return solidityTypes.map(function(solidityType,index){return solidityType.decode(bytes,offsets[index],types[index],index);});};SolidityCoder.prototype.getOffsets=function(types,solidityTypes){var lengths=solidityTypes.map(function(solidityType,index){return solidityType.staticPartLength(types[index]);});for(var i=1;i<lengths.length;i++){lengths[i]+=lengths[i-1];}
return lengths.map(function(length,index){var staticPartLength=solidityTypes[index].staticPartLength(types[index]);return length-staticPartLength;});};SolidityCoder.prototype.getSolidityTypes=function(types){var self=this;return types.map(function(type){return self._requireType(type);});};var coder=new SolidityCoder([new SolidityTypeAddress(),new SolidityTypeBool(),new SolidityTypeInt(),new SolidityTypeUInt(),new SolidityTypeDynamicBytes(),new SolidityTypeBytes(),new SolidityTypeString(),new SolidityTypeReal(),new SolidityTypeUReal()]);module.exports=coder;}),(function(module,exports,__webpack_require__){var f=__webpack_require__(6);var SolidityTypeAddress=__webpack_require__(154);var SolidityTypeBool=__webpack_require__(155);var SolidityTypeInt=__webpack_require__(158);var SolidityTypeUInt=__webpack_require__(161);var SolidityTypeDynamicBytes=__webpack_require__(157);var SolidityTypeString=__webpack_require__(160);var SolidityTypeReal=__webpack_require__(159);var SolidityTypeUReal=__webpack_require__(162);var SolidityTypeBytes=__webpack_require__(156);var SolidityCoder=function(types){this._types=types;};SolidityCoder.prototype._requireType=function(type){var solidityType=this._types.filter(function(t){return t.isType(type);})[0];if(!solidityType){throw Error('invalid solidity type!: '+type);}
return solidityType;};SolidityCoder.prototype.encodeParam=function(type,param){return this.encodeParams([type],[param]);};SolidityCoder.prototype.encodeParams=function(types,params){var solidityTypes=this.getSolidityTypes(types);var encodeds=solidityTypes.map(function(solidityType,index){return solidityType.encode(params[index],types[index]);});var dynamicOffset=solidityTypes.reduce(function(acc,solidityType,index){var staticPartLength=solidityType.staticPartLength(types[index]);var roundedStaticPartLength=Math.floor((staticPartLength+31)/32)*32;return acc+roundedStaticPartLength;},0);var result=this.encodeMultiWithOffset(types,solidityTypes,encodeds,dynamicOffset);return result;};SolidityCoder.prototype.encodeMultiWithOffset=function(types,solidityTypes,encodeds,dynamicOffset){var result="";var self=this;var isDynamic=function(i){return solidityTypes[i].isDynamicArray(types[i])||solidityTypes[i].isDynamicType(types[i]);};types.forEach(function(type,i){if(isDynamic(i)){result+=f.formatInputInt(dynamicOffset).encode();var e=self.encodeWithOffset(types[i],solidityTypes[i],encodeds[i],dynamicOffset);dynamicOffset+=e.length/2;}else{result+=self.encodeWithOffset(types[i],solidityTypes[i],encodeds[i],dynamicOffset);}});types.forEach(function(type,i){if(isDynamic(i)){var e=self.encodeWithOffset(types[i],solidityTypes[i],encodeds[i],dynamicOffset);dynamicOffset+=e.length/2;result+=e;}});return result;};SolidityCoder.prototype.encodeWithOffset=function(type,solidityType,encoded,offset){var self=this;if(solidityType.isDynamicArray(type)){return(function(){var nestedName=solidityType.nestedName(type);var nestedStaticPartLength=solidityType.staticPartLength(nestedName);var result=encoded[0];(function(){var previousLength=2;if(solidityType.isDynamicArray(nestedName)){for(var i=1;i<encoded.length;i++){previousLength+=+(encoded[i-1])[0]||0;result+=f.formatInputInt(offset+i*nestedStaticPartLength+previousLength*32).encode();}}})();(function(){for(var i=0;i<encoded.length-1;i++){var additionalOffset=result/2;result+=self.encodeWithOffset(nestedName,solidityType,encoded[i+1],offset+additionalOffset);}})();return result;})();}else if(solidityType.isStaticArray(type)){return(function(){var nestedName=solidityType.nestedName(type);var nestedStaticPartLength=solidityType.staticPartLength(nestedName);var result="";if(solidityType.isDynamicArray(nestedName)){(function(){var previousLength=0;for(var i=0;i<encoded.length;i++){previousLength+=+(encoded[i-1]||[])[0]||0;result+=f.formatInputInt(offset+i*nestedStaticPartLength+previousLength*32).encode();}})();}
(function(){for(var i=0;i<encoded.length;i++){var additionalOffset=result/2;result+=self.encodeWithOffset(nestedName,solidityType,encoded[i],offset+additionalOffset);}})();return result;})();}
return encoded;};SolidityCoder.prototype.decodeParam=function(type,bytes){return this.decodeParams([type],bytes)[0];};SolidityCoder.prototype.decodeParams=function(types,bytes){var solidityTypes=this.getSolidityTypes(types);var offsets=this.getOffsets(types,solidityTypes);return solidityTypes.map(function(solidityType,index){return solidityType.decode(bytes,offsets[index],types[index],index);});};SolidityCoder.prototype.getOffsets=function(types,solidityTypes){var lengths=solidityTypes.map(function(solidityType,index){return solidityType.staticPartLength(types[index]);});for(var i=1;i<lengths.length;i++){lengths[i]+=lengths[i-1];}
return lengths.map(function(length,index){var staticPartLength=solidityTypes[index].staticPartLength(types[index]);return length-staticPartLength;});};SolidityCoder.prototype.getSolidityTypes=function(types){var self=this;return types.map(function(type){return self._requireType(type);});};var coder=new SolidityCoder([new SolidityTypeAddress(),new SolidityTypeBool(),new SolidityTypeInt(),new SolidityTypeUInt(),new SolidityTypeDynamicBytes(),new SolidityTypeBytes(),new SolidityTypeString(),new SolidityTypeReal(),new SolidityTypeUReal()]);module.exports=coder;}),(function(module,exports,__webpack_require__){(function(module,global){var __WEBPACK_AMD_DEFINE_RESULT__;;(function(root){var freeExports=typeof exports=='object'&&exports;var freeModule=typeof module=='object'&&module&&module.exports==freeExports&&module;var freeGlobal=typeof global=='object'&&global;if(freeGlobal.global===freeGlobal||freeGlobal.window===freeGlobal){root=freeGlobal;}
var stringFromCharCode=String.fromCharCode;function ucs2decode(string){var output=[];var counter=0;var length=string.length;var value;var extra;while(counter<length){value=string.charCodeAt(counter++);if(value>=0xD800&&value<=0xDBFF&&counter<length){extra=string.charCodeAt(counter++);if((extra&0xFC00)==0xDC00){output.push(((value&0x3FF)<<10)+(extra&0x3FF)+0x10000);}else{output.push(value);counter--;}}else{output.push(value);}}
return output;}
function ucs2encode(array){var length=array.length;var index=-1;var value;var output='';while(++index<length){value=array[index];if(value>0xFFFF){value-=0x10000;output+=stringFromCharCode(value>>>10&0x3FF|0xD800);value=0xDC00|value&0x3FF;}
output+=stringFromCharCode(value);}
return output;}
function checkScalarValue(codePoint){if(codePoint>=0xD800&&codePoint<=0xDFFF){throw Error('Lone surrogate U+'+codePoint.toString(16).toUpperCase()+' is not a scalar value');}}
function createByte(codePoint,shift){return stringFromCharCode(((codePoint>>shift)&0x3F)|0x80);}
function encodeCodePoint(codePoint){if((codePoint&0xFFFFFF80)==0){return stringFromCharCode(codePoint);}
var symbol='';if((codePoint&0xFFFFF800)==0){symbol=stringFromCharCode(((codePoint>>6)&0x1F)|0xC0);}
else if((codePoint&0xFFFF0000)==0){checkScalarValue(codePoint);symbol=stringFromCharCode(((codePoint>>12)&0x0F)|0xE0);symbol+=createByte(codePoint,6);}
else if((codePoint&0xFFE00000)==0){symbol=stringFromCharCode(((codePoint>>18)&0x07)|0xF0);symbol+=createByte(codePoint,12);symbol+=createByte(codePoint,6);}
symbol+=stringFromCharCode((codePoint&0x3F)|0x80);return symbol;}
function utf8encode(string){var codePoints=ucs2decode(string);var length=codePoints.length;var index=-1;var codePoint;var byteString='';while(++index<length){codePoint=codePoints[index];byteString+=encodeCodePoint(codePoint);}
return byteString;}
function readContinuationByte(){if(byteIndex>=byteCount){throw Error('Invalid byte index');}
var continuationByte=byteArray[byteIndex]&0xFF;byteIndex++;if((continuationByte&0xC0)==0x80){return continuationByte&0x3F;}
throw Error('Invalid continuation byte');}
function decodeSymbol(){var byte1;var byte2;var byte3;var byte4;var codePoint;if(byteIndex>byteCount){throw Error('Invalid byte index');}
if(byteIndex==byteCount){return false;}
byte1=byteArray[byteIndex]&0xFF;byteIndex++;if((byte1&0x80)==0){return byte1;}
if((byte1&0xE0)==0xC0){byte2=readContinuationByte();codePoint=((byte1&0x1F)<<6)|byte2;if(codePoint>=0x80){return codePoint;}else{throw Error('Invalid continuation byte');}}
if((byte1&0xF0)==0xE0){byte2=readContinuationByte();byte3=readContinuationByte();codePoint=((byte1&0x0F)<<12)|(byte2<<6)|byte3;if(codePoint>=0x0800){checkScalarValue(codePoint);return codePoint;}else{throw Error('Invalid continuation byte');}}
if((byte1&0xF8)==0xF0){byte2=readContinuationByte();byte3=readContinuationByte();byte4=readContinuationByte();codePoint=((byte1&0x07)<<0x12)|(byte2<<0x0C)|(byte3<<0x06)|byte4;if(codePoint>=0x010000&&codePoint<=0x10FFFF){return codePoint;}}
throw Error('Invalid UTF-8 detected');}
var byteArray;var byteCount;var byteIndex;function utf8decode(byteString){byteArray=ucs2decode(byteString);byteCount=byteArray.length;byteIndex=0;var codePoints=[];var tmp;while((tmp=decodeSymbol())!==false){codePoints.push(tmp);}
return ucs2encode(codePoints);}
var utf8={'version':'2.1.2','encode':utf8encode,'decode':utf8decode};if(true){!(__WEBPACK_AMD_DEFINE_RESULT__=function(){return utf8;}.call(exports,__webpack_require__,exports,module),__WEBPACK_AMD_DEFINE_RESULT__!==undefined&&(module.exports=__WEBPACK_AMD_DEFINE_RESULT__));}else if(freeExports&&!freeExports.nodeType){if(freeModule){freeModule.exports=utf8;}else{var object={};var hasOwnProperty=object.hasOwnProperty;for(var key in utf8){hasOwnProperty.call(utf8,key)&&(freeExports[key]=utf8[key]);}}}else{root.utf8=utf8;}}(this));}.call(exports,__webpack_require__(55)(module),__webpack_require__(47)))}),(function(module,exports,__webpack_require__){var f=__webpack_require__(7);var SolidityTypeAddress=__webpack_require__(186);var SolidityTypeBool=__webpack_require__(187);var SolidityTypeInt=__webpack_require__(190);var SolidityTypeUInt=__webpack_require__(193);var SolidityTypeDynamicBytes=__webpack_require__(189);var SolidityTypeString=__webpack_require__(192);var SolidityTypeReal=__webpack_require__(191);var SolidityTypeUReal=__webpack_require__(194);var SolidityTypeBytes=__webpack_require__(188);var isDynamic=function(solidityType,type){return solidityType.isDynamicType(type)||solidityType.isDynamicArray(type);};var SolidityCoder=function(types){this._types=types;};SolidityCoder.prototype._requireType=function(type){var solidityType=this._types.filter(function(t){return t.isType(type);})[0];if(!solidityType){throw Error('invalid solidity type!: '+type);}
return solidityType;};SolidityCoder.prototype.encodeParam=function(type,param){return this.encodeParams([type],[param]);};SolidityCoder.prototype.encodeParams=function(types,params){var solidityTypes=this.getSolidityTypes(types);var encodeds=solidityTypes.map(function(solidityType,index){return solidityType.encode(params[index],types[index]);});var dynamicOffset=solidityTypes.reduce(function(acc,solidityType,index){var staticPartLength=solidityType.staticPartLength(types[index]);var roundedStaticPartLength=Math.floor((staticPartLength+31)/32)*32;return acc+(isDynamic(solidityTypes[index],types[index])?32:roundedStaticPartLength);},0);var result=this.encodeMultiWithOffset(types,solidityTypes,encodeds,dynamicOffset);return result;};SolidityCoder.prototype.encodeMultiWithOffset=function(types,solidityTypes,encodeds,dynamicOffset){var result="";var self=this;types.forEach(function(type,i){if(isDynamic(solidityTypes[i],types[i])){result+=f.formatInputInt(dynamicOffset).encode();var e=self.encodeWithOffset(types[i],solidityTypes[i],encodeds[i],dynamicOffset);dynamicOffset+=e.length/2;}else{result+=self.encodeWithOffset(types[i],solidityTypes[i],encodeds[i],dynamicOffset);}});types.forEach(function(type,i){if(isDynamic(solidityTypes[i],types[i])){var e=self.encodeWithOffset(types[i],solidityTypes[i],encodeds[i],dynamicOffset);dynamicOffset+=e.length/2;result+=e;}});return result;};SolidityCoder.prototype.encodeWithOffset=function(type,solidityType,encoded,offset){var self=this;var encodingMode={dynamic:1,static:2,other:3};var mode=(solidityType.isDynamicArray(type)?encodingMode.dynamic:(solidityType.isStaticArray(type)?encodingMode.static:encodingMode.other));if(mode!==encodingMode.other){var nestedName=solidityType.nestedName(type);var nestedStaticPartLength=solidityType.staticPartLength(nestedName);var result=(mode===encodingMode.dynamic?encoded[0]:'');if(solidityType.isDynamicArray(nestedName)){var previousLength=(mode===encodingMode.dynamic?2:0);for(var i=0;i<encoded.length;i++){if(mode===encodingMode.dynamic){previousLength+=+(encoded[i-1])[0]||0;}
else if(mode===encodingMode.static){previousLength+=+(encoded[i-1]||[])[0]||0;}
result+=f.formatInputInt(offset+i*nestedStaticPartLength+previousLength*32).encode();}}
var len=(mode===encodingMode.dynamic?encoded.length-1:encoded.length);for(var c=0;c<len;c++){var additionalOffset=result/2;if(mode===encodingMode.dynamic){result+=self.encodeWithOffset(nestedName,solidityType,encoded[c+1],offset+additionalOffset);}
else if(mode===encodingMode.static){result+=self.encodeWithOffset(nestedName,solidityType,encoded[c],offset+additionalOffset);}}
return result;}
return encoded;};SolidityCoder.prototype.decodeParam=function(type,bytes){return this.decodeParams([type],bytes)[0];};SolidityCoder.prototype.decodeParams=function(types,bytes){var solidityTypes=this.getSolidityTypes(types);var offsets=this.getOffsets(types,solidityTypes);return solidityTypes.map(function(solidityType,index){return solidityType.decode(bytes,offsets[index],types[index],index);});};SolidityCoder.prototype.getOffsets=function(types,solidityTypes){var lengths=solidityTypes.map(function(solidityType,index){return solidityType.staticPartLength(types[index]);});for(var i=1;i<lengths.length;i++){lengths[i]+=lengths[i-1];}
return lengths.map(function(length,index){var staticPartLength=solidityTypes[index].staticPartLength(types[index]);return length-staticPartLength;});};SolidityCoder.prototype.getSolidityTypes=function(types){var self=this;return types.map(function(type){return self._requireType(type);});};var coder=new SolidityCoder([new SolidityTypeAddress(),new SolidityTypeBool(),new SolidityTypeInt(),new SolidityTypeUInt(),new SolidityTypeDynamicBytes(),new SolidityTypeBytes(),new SolidityTypeString(),new SolidityTypeReal(),new SolidityTypeUReal()]);module.exports=coder;}),(function(module,exports){module.exports=function(module){if(!module.webpackPolyfill){module.deprecate=function(){};module.paths=[];if(!module.children)module.children=[];Object.defineProperty(module,"loaded",{enumerable:true,get:function(){return module.l;}});Object.defineProperty(module,"id",{enumerable:true,get:function(){return module.i;}});module.webpackPolyfill=1;}
return module;};}),(function(module,exports,__webpack_require__){(function(module){(function(module,exports){'use strict';function assert(val,msg){if(!val)throw new Error(msg||'Assertion failed');}
function inherits(ctor,superCtor){ctor.super_=superCtor;var TempCtor=function(){};TempCtor.prototype=superCtor.prototype;ctor.prototype=new TempCtor();ctor.prototype.constructor=ctor;}
function BN(number,base,endian){if(BN.isBN(number)){return number;}
this.negative=0;this.words=null;this.length=0;this.red=null;if(number!==null){if(base==='le'||base==='be'){endian=base;base=10;}
this._init(number||0,base||10,endian||'be');}}
if(typeof module==='object'){module.exports=BN;}else{exports.BN=BN;}
BN.BN=BN;BN.wordSize=26;var Buffer;try{Buffer=__webpack_require__(31).Buffer;}catch(e){}
BN.isBN=function isBN(num){if(num instanceof BN){return true;}
return num!==null&&typeof num==='object'&&num.constructor.wordSize===BN.wordSize&&Array.isArray(num.words);};BN.max=function max(left,right){if(left.cmp(right)>0)return left;return right;};BN.min=function min(left,right){if(left.cmp(right)<0)return left;return right;};BN.prototype._init=function init(number,base,endian){if(typeof number==='number'){return this._initNumber(number,base,endian);}
if(typeof number==='object'){return this._initArray(number,base,endian);}
if(base==='hex'){base=16;}
assert(base===(base|0)&&base>=2&&base<=36);number=number.toString().replace(/\s+/g,'');var start=0;if(number[0]==='-'){start++;}
if(base===16){this._parseHex(number,start);}else{this._parseBase(number,base,start);}
if(number[0]==='-'){this.negative=1;}
this.strip();if(endian!=='le')return;this._initArray(this.toArray(),base,endian);};BN.prototype._initNumber=function _initNumber(number,base,endian){if(number<0){this.negative=1;number=-number;}
if(number<0x4000000){this.words=[number&0x3ffffff];this.length=1;}else if(number<0x10000000000000){this.words=[number&0x3ffffff,(number/0x4000000)&0x3ffffff];this.length=2;}else{assert(number<0x20000000000000);this.words=[number&0x3ffffff,(number/0x4000000)&0x3ffffff,1];this.length=3;}
if(endian!=='le')return;this._initArray(this.toArray(),base,endian);};BN.prototype._initArray=function _initArray(number,base,endian){assert(typeof number.length==='number');if(number.length<=0){this.words=[0];this.length=1;return this;}
this.length=Math.ceil(number.length/3);this.words=new Array(this.length);for(var i=0;i<this.length;i++){this.words[i]=0;}
var j,w;var off=0;if(endian==='be'){for(i=number.length-1,j=0;i>=0;i-=3){w=number[i]|(number[i-1]<<8)|(number[i-2]<<16);this.words[j]|=(w<<off)&0x3ffffff;this.words[j+1]=(w>>>(26-off))&0x3ffffff;off+=24;if(off>=26){off-=26;j++;}}}else if(endian==='le'){for(i=0,j=0;i<number.length;i+=3){w=number[i]|(number[i+1]<<8)|(number[i+2]<<16);this.words[j]|=(w<<off)&0x3ffffff;this.words[j+1]=(w>>>(26-off))&0x3ffffff;off+=24;if(off>=26){off-=26;j++;}}}
return this.strip();};function parseHex(str,start,end){var r=0;var len=Math.min(str.length,end);for(var i=start;i<len;i++){var c=str.charCodeAt(i)-48;r<<=4;if(c>=49&&c<=54){r|=c-49+0xa;}else if(c>=17&&c<=22){r|=c-17+0xa;}else{r|=c&0xf;}}
return r;}
BN.prototype._parseHex=function _parseHex(number,start){this.length=Math.ceil((number.length-start)/6);this.words=new Array(this.length);for(var i=0;i<this.length;i++){this.words[i]=0;}
var j,w;var off=0;for(i=number.length-6,j=0;i>=start;i-=6){w=parseHex(number,i,i+6);this.words[j]|=(w<<off)&0x3ffffff;this.words[j+1]|=w>>>(26-off)&0x3fffff;off+=24;if(off>=26){off-=26;j++;}}
if(i+6!==start){w=parseHex(number,start,i+6);this.words[j]|=(w<<off)&0x3ffffff;this.words[j+1]|=w>>>(26-off)&0x3fffff;}
this.strip();};function parseBase(str,start,end,mul){var r=0;var len=Math.min(str.length,end);for(var i=start;i<len;i++){var c=str.charCodeAt(i)-48;r*=mul;if(c>=49){r+=c-49+0xa;}else if(c>=17){r+=c-17+0xa;}else{r+=c;}}
return r;}
BN.prototype._parseBase=function _parseBase(number,base,start){this.words=[0];this.length=1;for(var limbLen=0,limbPow=1;limbPow<=0x3ffffff;limbPow*=base){limbLen++;}
limbLen--;limbPow=(limbPow/base)|0;var total=number.length-start;var mod=total%limbLen;var end=Math.min(total,total-mod)+start;var word=0;for(var i=start;i<end;i+=limbLen){word=parseBase(number,i,i+limbLen,base);this.imuln(limbPow);if(this.words[0]+word<0x4000000){this.words[0]+=word;}else{this._iaddn(word);}}
if(mod!==0){var pow=1;word=parseBase(number,i,number.length,base);for(i=0;i<mod;i++){pow*=base;}
this.imuln(pow);if(this.words[0]+word<0x4000000){this.words[0]+=word;}else{this._iaddn(word);}}};BN.prototype.copy=function copy(dest){dest.words=new Array(this.length);for(var i=0;i<this.length;i++){dest.words[i]=this.words[i];}
dest.length=this.length;dest.negative=this.negative;dest.red=this.red;};BN.prototype.clone=function clone(){var r=new BN(null);this.copy(r);return r;};BN.prototype._expand=function _expand(size){while(this.length<size){this.words[this.length++]=0;}
return this;};BN.prototype.strip=function strip(){while(this.length>1&&this.words[this.length-1]===0){this.length--;}
return this._normSign();};BN.prototype._normSign=function _normSign(){if(this.length===1&&this.words[0]===0){this.negative=0;}
return this;};BN.prototype.inspect=function inspect(){return(this.red?'<BN-R: ':'<BN: ')+this.toString(16)+'>';};var zeros=['','0','00','000','0000','00000','000000','0000000','00000000','000000000','0000000000','00000000000','000000000000','0000000000000','00000000000000','000000000000000','0000000000000000','00000000000000000','000000000000000000','0000000000000000000','00000000000000000000','000000000000000000000','0000000000000000000000','00000000000000000000000','000000000000000000000000','0000000000000000000000000'];var groupSizes=[0,0,25,16,12,11,10,9,8,8,7,7,7,7,6,6,6,6,6,6,6,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5,5];var groupBases=[0,0,33554432,43046721,16777216,48828125,60466176,40353607,16777216,43046721,10000000,19487171,35831808,62748517,7529536,11390625,16777216,24137569,34012224,47045881,64000000,4084101,5153632,6436343,7962624,9765625,11881376,14348907,17210368,20511149,24300000,28629151,33554432,39135393,45435424,52521875,60466176];BN.prototype.toString=function toString(base,padding){base=base||10;padding=padding|0||1;var out;if(base===16||base==='hex'){out='';var off=0;var carry=0;for(var i=0;i<this.length;i++){var w=this.words[i];var word=(((w<<off)|carry)&0xffffff).toString(16);carry=(w>>>(24-off))&0xffffff;if(carry!==0||i!==this.length-1){out=zeros[6-word.length]+word+out;}else{out=word+out;}
off+=2;if(off>=26){off-=26;i--;}}
if(carry!==0){out=carry.toString(16)+out;}
while(out.length%padding!==0){out='0'+out;}
if(this.negative!==0){out='-'+out;}
return out;}
if(base===(base|0)&&base>=2&&base<=36){var groupSize=groupSizes[base];var groupBase=groupBases[base];out='';var c=this.clone();c.negative=0;while(!c.isZero()){var r=c.modn(groupBase).toString(base);c=c.idivn(groupBase);if(!c.isZero()){out=zeros[groupSize-r.length]+r+out;}else{out=r+out;}}
if(this.isZero()){out='0'+out;}
while(out.length%padding!==0){out='0'+out;}
if(this.negative!==0){out='-'+out;}
return out;}
assert(false,'Base should be between 2 and 36');};BN.prototype.toNumber=function toNumber(){var ret=this.words[0];if(this.length===2){ret+=this.words[1]*0x4000000;}else if(this.length===3&&this.words[2]===0x01){ret+=0x10000000000000+(this.words[1]*0x4000000);}else if(this.length>2){assert(false,'Number can only safely store up to 53 bits');}
return(this.negative!==0)?-ret:ret;};BN.prototype.toJSON=function toJSON(){return this.toString(16);};BN.prototype.toBuffer=function toBuffer(endian,length){assert(typeof Buffer!=='undefined');return this.toArrayLike(Buffer,endian,length);};BN.prototype.toArray=function toArray(endian,length){return this.toArrayLike(Array,endian,length);};BN.prototype.toArrayLike=function toArrayLike(ArrayType,endian,length){var byteLength=this.byteLength();var reqLength=length||Math.max(1,byteLength);assert(byteLength<=reqLength,'byte array longer than desired length');assert(reqLength>0,'Requested array length <= 0');this.strip();var littleEndian=endian==='le';var res=new ArrayType(reqLength);var b,i;var q=this.clone();if(!littleEndian){for(i=0;i<reqLength-byteLength;i++){res[i]=0;}
for(i=0;!q.isZero();i++){b=q.andln(0xff);q.iushrn(8);res[reqLength-i-1]=b;}}else{for(i=0;!q.isZero();i++){b=q.andln(0xff);q.iushrn(8);res[i]=b;}
for(;i<reqLength;i++){res[i]=0;}}
return res;};if(Math.clz32){BN.prototype._countBits=function _countBits(w){return 32-Math.clz32(w);};}else{BN.prototype._countBits=function _countBits(w){var t=w;var r=0;if(t>=0x1000){r+=13;t>>>=13;}
if(t>=0x40){r+=7;t>>>=7;}
if(t>=0x8){r+=4;t>>>=4;}
if(t>=0x02){r+=2;t>>>=2;}
return r+t;};}
BN.prototype._zeroBits=function _zeroBits(w){if(w===0)return 26;var t=w;var r=0;if((t&0x1fff)===0){r+=13;t>>>=13;}
if((t&0x7f)===0){r+=7;t>>>=7;}
if((t&0xf)===0){r+=4;t>>>=4;}
if((t&0x3)===0){r+=2;t>>>=2;}
if((t&0x1)===0){r++;}
return r;};BN.prototype.bitLength=function bitLength(){var w=this.words[this.length-1];var hi=this._countBits(w);return(this.length-1)*26+hi;};function toBitArray(num){var w=new Array(num.bitLength());for(var bit=0;bit<w.length;bit++){var off=(bit/26)|0;var wbit=bit%26;w[bit]=(num.words[off]&(1<<wbit))>>>wbit;}
return w;}
BN.prototype.zeroBits=function zeroBits(){if(this.isZero())return 0;var r=0;for(var i=0;i<this.length;i++){var b=this._zeroBits(this.words[i]);r+=b;if(b!==26)break;}
return r;};BN.prototype.byteLength=function byteLength(){return Math.ceil(this.bitLength()/8);};BN.prototype.toTwos=function toTwos(width){if(this.negative!==0){return this.abs().inotn(width).iaddn(1);}
return this.clone();};BN.prototype.fromTwos=function fromTwos(width){if(this.testn(width-1)){return this.notn(width).iaddn(1).ineg();}
return this.clone();};BN.prototype.isNeg=function isNeg(){return this.negative!==0;};BN.prototype.neg=function neg(){return this.clone().ineg();};BN.prototype.ineg=function ineg(){if(!this.isZero()){this.negative^=1;}
return this;};BN.prototype.iuor=function iuor(num){while(this.length<num.length){this.words[this.length++]=0;}
for(var i=0;i<num.length;i++){this.words[i]=this.words[i]|num.words[i];}
return this.strip();};BN.prototype.ior=function ior(num){assert((this.negative|num.negative)===0);return this.iuor(num);};BN.prototype.or=function or(num){if(this.length>num.length)return this.clone().ior(num);return num.clone().ior(this);};BN.prototype.uor=function uor(num){if(this.length>num.length)return this.clone().iuor(num);return num.clone().iuor(this);};BN.prototype.iuand=function iuand(num){var b;if(this.length>num.length){b=num;}else{b=this;}
for(var i=0;i<b.length;i++){this.words[i]=this.words[i]&num.words[i];}
this.length=b.length;return this.strip();};BN.prototype.iand=function iand(num){assert((this.negative|num.negative)===0);return this.iuand(num);};BN.prototype.and=function and(num){if(this.length>num.length)return this.clone().iand(num);return num.clone().iand(this);};BN.prototype.uand=function uand(num){if(this.length>num.length)return this.clone().iuand(num);return num.clone().iuand(this);};BN.prototype.iuxor=function iuxor(num){var a;var b;if(this.length>num.length){a=this;b=num;}else{a=num;b=this;}
for(var i=0;i<b.length;i++){this.words[i]=a.words[i]^b.words[i];}
if(this!==a){for(;i<a.length;i++){this.words[i]=a.words[i];}}
this.length=a.length;return this.strip();};BN.prototype.ixor=function ixor(num){assert((this.negative|num.negative)===0);return this.iuxor(num);};BN.prototype.xor=function xor(num){if(this.length>num.length)return this.clone().ixor(num);return num.clone().ixor(this);};BN.prototype.uxor=function uxor(num){if(this.length>num.length)return this.clone().iuxor(num);return num.clone().iuxor(this);};BN.prototype.inotn=function inotn(width){assert(typeof width==='number'&&width>=0);var bytesNeeded=Math.ceil(width/26)|0;var bitsLeft=width%26;this._expand(bytesNeeded);if(bitsLeft>0){bytesNeeded--;}
for(var i=0;i<bytesNeeded;i++){this.words[i]=~this.words[i]&0x3ffffff;}
if(bitsLeft>0){this.words[i]=~this.words[i]&(0x3ffffff>>(26-bitsLeft));}
return this.strip();};BN.prototype.notn=function notn(width){return this.clone().inotn(width);};BN.prototype.setn=function setn(bit,val){assert(typeof bit==='number'&&bit>=0);var off=(bit/26)|0;var wbit=bit%26;this._expand(off+1);if(val){this.words[off]=this.words[off]|(1<<wbit);}else{this.words[off]=this.words[off]&~(1<<wbit);}
return this.strip();};BN.prototype.iadd=function iadd(num){var r;if(this.negative!==0&&num.negative===0){this.negative=0;r=this.isub(num);this.negative^=1;return this._normSign();}else if(this.negative===0&&num.negative!==0){num.negative=0;r=this.isub(num);num.negative=1;return r._normSign();}
var a,b;if(this.length>num.length){a=this;b=num;}else{a=num;b=this;}
var carry=0;for(var i=0;i<b.length;i++){r=(a.words[i]|0)+(b.words[i]|0)+carry;this.words[i]=r&0x3ffffff;carry=r>>>26;}
for(;carry!==0&&i<a.length;i++){r=(a.words[i]|0)+carry;this.words[i]=r&0x3ffffff;carry=r>>>26;}
this.length=a.length;if(carry!==0){this.words[this.length]=carry;this.length++;}else if(a!==this){for(;i<a.length;i++){this.words[i]=a.words[i];}}
return this;};BN.prototype.add=function add(num){var res;if(num.negative!==0&&this.negative===0){num.negative=0;res=this.sub(num);num.negative^=1;return res;}else if(num.negative===0&&this.negative!==0){this.negative=0;res=num.sub(this);this.negative=1;return res;}
if(this.length>num.length)return this.clone().iadd(num);return num.clone().iadd(this);};BN.prototype.isub=function isub(num){if(num.negative!==0){num.negative=0;var r=this.iadd(num);num.negative=1;return r._normSign();}else if(this.negative!==0){this.negative=0;this.iadd(num);this.negative=1;return this._normSign();}
var cmp=this.cmp(num);if(cmp===0){this.negative=0;this.length=1;this.words[0]=0;return this;}
var a,b;if(cmp>0){a=this;b=num;}else{a=num;b=this;}
var carry=0;for(var i=0;i<b.length;i++){r=(a.words[i]|0)-(b.words[i]|0)+carry;carry=r>>26;this.words[i]=r&0x3ffffff;}
for(;carry!==0&&i<a.length;i++){r=(a.words[i]|0)+carry;carry=r>>26;this.words[i]=r&0x3ffffff;}
if(carry===0&&i<a.length&&a!==this){for(;i<a.length;i++){this.words[i]=a.words[i];}}
this.length=Math.max(this.length,i);if(a!==this){this.negative=1;}
return this.strip();};BN.prototype.sub=function sub(num){return this.clone().isub(num);};function smallMulTo(self,num,out){out.negative=num.negative^self.negative;var len=(self.length+num.length)|0;out.length=len;len=(len-1)|0;var a=self.words[0]|0;var b=num.words[0]|0;var r=a*b;var lo=r&0x3ffffff;var carry=(r/0x4000000)|0;out.words[0]=lo;for(var k=1;k<len;k++){var ncarry=carry>>>26;var rword=carry&0x3ffffff;var maxJ=Math.min(k,num.length-1);for(var j=Math.max(0,k-self.length+1);j<=maxJ;j++){var i=(k-j)|0;a=self.words[i]|0;b=num.words[j]|0;r=a*b+rword;ncarry+=(r/0x4000000)|0;rword=r&0x3ffffff;}
out.words[k]=rword|0;carry=ncarry|0;}
if(carry!==0){out.words[k]=carry|0;}else{out.length--;}
return out.strip();}
var comb10MulTo=function comb10MulTo(self,num,out){var a=self.words;var b=num.words;var o=out.words;var c=0;var lo;var mid;var hi;var a0=a[0]|0;var al0=a0&0x1fff;var ah0=a0>>>13;var a1=a[1]|0;var al1=a1&0x1fff;var ah1=a1>>>13;var a2=a[2]|0;var al2=a2&0x1fff;var ah2=a2>>>13;var a3=a[3]|0;var al3=a3&0x1fff;var ah3=a3>>>13;var a4=a[4]|0;var al4=a4&0x1fff;var ah4=a4>>>13;var a5=a[5]|0;var al5=a5&0x1fff;var ah5=a5>>>13;var a6=a[6]|0;var al6=a6&0x1fff;var ah6=a6>>>13;var a7=a[7]|0;var al7=a7&0x1fff;var ah7=a7>>>13;var a8=a[8]|0;var al8=a8&0x1fff;var ah8=a8>>>13;var a9=a[9]|0;var al9=a9&0x1fff;var ah9=a9>>>13;var b0=b[0]|0;var bl0=b0&0x1fff;var bh0=b0>>>13;var b1=b[1]|0;var bl1=b1&0x1fff;var bh1=b1>>>13;var b2=b[2]|0;var bl2=b2&0x1fff;var bh2=b2>>>13;var b3=b[3]|0;var bl3=b3&0x1fff;var bh3=b3>>>13;var b4=b[4]|0;var bl4=b4&0x1fff;var bh4=b4>>>13;var b5=b[5]|0;var bl5=b5&0x1fff;var bh5=b5>>>13;var b6=b[6]|0;var bl6=b6&0x1fff;var bh6=b6>>>13;var b7=b[7]|0;var bl7=b7&0x1fff;var bh7=b7>>>13;var b8=b[8]|0;var bl8=b8&0x1fff;var bh8=b8>>>13;var b9=b[9]|0;var bl9=b9&0x1fff;var bh9=b9>>>13;out.negative=self.negative^num.negative;out.length=19;lo=Math.imul(al0,bl0);mid=Math.imul(al0,bh0);mid=(mid+Math.imul(ah0,bl0))|0;hi=Math.imul(ah0,bh0);var w0=(((c+lo)|0)+((mid&0x1fff)<<13))|0;c=(((hi+(mid>>>13))|0)+(w0>>>26))|0;w0&=0x3ffffff;lo=Math.imul(al1,bl0);mid=Math.imul(al1,bh0);mid=(mid+Math.imul(ah1,bl0))|0;hi=Math.imul(ah1,bh0);lo=(lo+Math.imul(al0,bl1))|0;mid=(mid+Math.imul(al0,bh1))|0;mid=(mid+Math.imul(ah0,bl1))|0;hi=(hi+Math.imul(ah0,bh1))|0;var w1=(((c+lo)|0)+((mid&0x1fff)<<13))|0;c=(((hi+(mid>>>13))|0)+(w1>>>26))|0;w1&=0x3ffffff;lo=Math.imul(al2,bl0);mid=Math.imul(al2,bh0);mid=(mid+Math.imul(ah2,bl0))|0;hi=Math.imul(ah2,bh0);lo=(lo+Math.imul(al1,bl1))|0;mid=(mid+Math.imul(al1,bh1))|0;mid=(mid+Math.imul(ah1,bl1))|0;hi=(hi+Math.imul(ah1,bh1))|0;lo=(lo+Math.imul(al0,bl2))|0;mid=(mid+Math.imul(al0,bh2))|0;mid=(mid+Math.imul(ah0,bl2))|0;hi=(hi+Math.imul(ah0,bh2))|0;var w2=(((c+lo)|0)+((mid&0x1fff)<<13))|0;c=(((hi+(mid>>>13))|0)+(w2>>>26))|0;w2&=0x3ffffff;lo=Math.imul(al3,bl0);mid=Math.imul(al3,bh0);mid=(mid+Math.imul(ah3,bl0))|0;hi=Math.imul(ah3,bh0);lo=(lo+Math.imul(al2,bl1))|0;mid=(mid+Math.imul(al2,bh1))|0;mid=(mid+Math.imul(ah2,bl1))|0;hi=(hi+Math.imul(ah2,bh1))|0;lo=(lo+Math.imul(al1,bl2))|0;mid=(mid+Math.imul(al1,bh2))|0;mid=(mid+Math.imul(ah1,bl2))|0;hi=(hi+Math.imul(ah1,bh2))|0;lo=(lo+Math.imul(al0,bl3))|0;mid=(mid+Math.imul(al0,bh3))|0;mid=(mid+Math.imul(ah0,bl3))|0;hi=(hi+Math.imul(ah0,bh3))|0;var w3=(((c+lo)|0)+((mid&0x1fff)<<13))|0;c=(((hi+(mid>>>13))|0)+(w3>>>26))|0;w3&=0x3ffffff;lo=Math.imul(al4,bl0);mid=Math.imul(al4,bh0);mid=(mid+Math.imul(ah4,bl0))|0;hi=Math.imul(ah4,bh0);lo=(lo+Math.imul(al3,bl1))|0;mid=(mid+Math.imul(al3,bh1))|0;mid=(mid+Math.imul(ah3,bl1))|0;hi=(hi+Math.imul(ah3,bh1))|0;lo=(lo+Math.imul(al2,bl2))|0;mid=(mid+Math.imul(al2,bh2))|0;mid=(mid+Math.imul(ah2,bl2))|0;hi=(hi+Math.imul(ah2,bh2))|0;lo=(lo+Math.imul(al1,bl3))|0;mid=(mid+Math.imul(al1,bh3))|0;mid=(mid+Math.imul(ah1,bl3))|0;hi=(hi+Math.imul(ah1,bh3))|0;lo=(lo+Math.imul(al0,bl4))|0;mid=(mid+Math.imul(al0,bh4))|0;mid=(mid+Math.imul(ah0,bl4))|0;hi=(hi+Math.imul(ah0,bh4))|0;var w4=(((c+lo)|0)+((mid&0x1fff)<<13))|0;c=(((hi+(mid>>>13))|0)+(w4>>>26))|0;w4&=0x3ffffff;lo=Math.imul(al5,bl0);mid=Math.imul(al5,bh0);mid=(mid+Math.imul(ah5,bl0))|0;hi=Math.imul(ah5,bh0);lo=(lo+Math.imul(al4,bl1))|0;mid=(mid+Math.imul(al4,bh1))|0;mid=(mid+Math.imul(ah4,bl1))|0;hi=(hi+Math.imul(ah4,bh1))|0;lo=(lo+Math.imul(al3,bl2))|0;mid=(mid+Math.imul(al3,bh2))|0;mid=(mid+Math.imul(ah3,bl2))|0;hi=(hi+Math.imul(ah3,bh2))|0;lo=(lo+Math.imul(al2,bl3))|0;mid=(mid+Math.imul(al2,bh3))|0;mid=(mid+Math.imul(ah2,bl3))|0;hi=(hi+Math.imul(ah2,bh3))|0;lo=(lo+Math.imul(al1,bl4))|0;mid=(mid+Math.imul(al1,bh4))|0;mid=(mid+Math.imul(ah1,bl4))|0;hi=(hi+Math.imul(ah1,bh4))|0;lo=(lo+Math.imul(al0,bl5))|0;mid=(mid+Math.imul(al0,bh5))|0;mid=(mid+Math.imul(ah0,bl5))|0;hi=(hi+Math.imul(ah0,bh5))|0;var w5=(((c+lo)|0)+((mid&0x1fff)<<13))|0;c=(((hi+(mid>>>13))|0)+(w5>>>26))|0;w5&=0x3ffffff;lo=Math.imul(al6,bl0);mid=Math.imul(al6,bh0);mid=(mid+Math.imul(ah6,bl0))|0;hi=Math.imul(ah6,bh0);lo=(lo+Math.imul(al5,bl1))|0;mid=(mid+Math.imul(al5,bh1))|0;mid=(mid+Math.imul(ah5,bl1))|0;hi=(hi+Math.imul(ah5,bh1))|0;lo=(lo+Math.imul(al4,bl2))|0;mid=(mid+Math.imul(al4,bh2))|0;mid=(mid+Math.imul(ah4,bl2))|0;hi=(hi+Math.imul(ah4,bh2))|0;lo=(lo+Math.imul(al3,bl3))|0;mid=(mid+Math.imul(al3,bh3))|0;mid=(mid+Math.imul(ah3,bl3))|0;hi=(hi+Math.imul(ah3,bh3))|0;lo=(lo+Math.imul(al2,bl4))|0;mid=(mid+Math.imul(al2,bh4))|0;mid=(mid+Math.imul(ah2,bl4))|0;hi=(hi+Math.imul(ah2,bh4))|0;lo=(lo+Math.imul(al1,bl5))|0;mid=(mid+Math.imul(al1,bh5))|0;mid=(mid+Math.imul(ah1,bl5))|0;hi=(hi+Math.imul(ah1,bh5))|0;lo=(lo+Math.imul(al0,bl6))|0;mid=(mid+Math.imul(al0,bh6))|0;mid=(mid+Math.imul(ah0,bl6))|0;hi=(hi+Math.imul(ah0,bh6))|0;var w6=(((c+lo)|0)+((mid&0x1fff)<<13))|0;c=(((hi+(mid>>>13))|0)+(w6>>>26))|0;w6&=0x3ffffff;lo=Math.imul(al7,bl0);mid=Math.imul(al7,bh0);mid=(mid+Math.imul(ah7,bl0))|0;hi=Math.imul(ah7,bh0);lo=(lo+Math.imul(al6,bl1))|0;mid=(mid+Math.imul(al6,bh1))|0;mid=(mid+Math.imul(ah6,bl1))|0;hi=(hi+Math.imul(ah6,bh1))|0;lo=(lo+Math.imul(al5,bl2))|0;mid=(mid+Math.imul(al5,bh2))|0;mid=(mid+Math.imul(ah5,bl2))|0;hi=(hi+Math.imul(ah5,bh2))|0;lo=(lo+Math.imul(al4,bl3))|0;mid=(mid+Math.imul(al4,bh3))|0;mid=(mid+Math.imul(ah4,bl3))|0;hi=(hi+Math.imul(ah4,bh3))|0;lo=(lo+Math.imul(al3,bl4))|0;mid=(mid+Math.imul(al3,bh4))|0;mid=(mid+Math.imul(ah3,bl4))|0;hi=(hi+Math.imul(ah3,bh4))|0;lo=(lo+Math.imul(al2,bl5))|0;mid=(mid+Math.imul(al2,bh5))|0;mid=(mid+Math.imul(ah2,bl5))|0;hi=(hi+Math.imul(ah2,bh5))|0;lo=(lo+Math.imul(al1,bl6))|0;mid=(mid+Math.imul(al1,bh6))|0;mid=(mid+Math.imul(ah1,bl6))|0;hi=(hi+Math.imul(ah1,bh6))|0;lo=(lo+Math.imul(al0,bl7))|0;mid=(mid+Math.imul(al0,bh7))|0;mid=(mid+Math.imul(ah0,bl7))|0;hi=(hi+Math.imul(ah0,bh7))|0;var w7=(((c+lo)|0)+((mid&0x1fff)<<13))|0;c=(((hi+(mid>>>13))|0)+(w7>>>26))|0;w7&=0x3ffffff;lo=Math.imul(al8,bl0);mid=Math.imul(al8,bh0);mid=(mid+Math.imul(ah8,bl0))|0;hi=Math.imul(ah8,bh0);lo=(lo+Math.imul(al7,bl1))|0;mid=(mid+Math.imul(al7,bh1))|0;mid=(mid+Math.imul(ah7,bl1))|0;hi=(hi+Math.imul(ah7,bh1))|0;lo=(lo+Math.imul(al6,bl2))|0;mid=(mid+Math.imul(al6,bh2))|0;mid=(mid+Math.imul(ah6,bl2))|0;hi=(hi+Math.imul(ah6,bh2))|0;lo=(lo+Math.imul(al5,bl3))|0;mid=(mid+Math.imul(al5,bh3))|0;mid=(mid+Math.imul(ah5,bl3))|0;hi=(hi+Math.imul(ah5,bh3))|0;lo=(lo+Math.imul(al4,bl4))|0;mid=(mid+Math.imul(al4,bh4))|0;mid=(mid+Math.imul(ah4,bl4))|0;hi=(hi+Math.imul(ah4,bh4))|0;lo=(lo+Math.imul(al3,bl5))|0;mid=(mid+Math.imul(al3,bh5))|0;mid=(mid+Math.imul(ah3,bl5))|0;hi=(hi+Math.imul(ah3,bh5))|0;lo=(lo+Math.imul(al2,bl6))|0;mid=(mid+Math.imul(al2,bh6))|0;mid=(mid+Math.imul(ah2,bl6))|0;hi=(hi+Math.imul(ah2,bh6))|0;lo=(lo+Math.imul(al1,bl7))|0;mid=(mid+Math.imul(al1,bh7))|0;mid=(mid+Math.imul(ah1,bl7))|0;hi=(hi+Math.imul(ah1,bh7))|0;lo=(lo+Math.imul(al0,bl8))|0;mid=(mid+Math.imul(al0,bh8))|0;mid=(mid+Math.imul(ah0,bl8))|0;hi=(hi+Math.imul(ah0,bh8))|0;var w8=(((c+lo)|0)+((mid&0x1fff)<<13))|0;c=(((hi+(mid>>>13))|0)+(w8>>>26))|0;w8&=0x3ffffff;lo=Math.imul(al9,bl0);mid=Math.imul(al9,bh0);mid=(mid+Math.imul(ah9,bl0))|0;hi=Math.imul(ah9,bh0);lo=(lo+Math.imul(al8,bl1))|0;mid=(mid+Math.imul(al8,bh1))|0;mid=(mid+Math.imul(ah8,bl1))|0;hi=(hi+Math.imul(ah8,bh1))|0;lo=(lo+Math.imul(al7,bl2))|0;mid=(mid+Math.imul(al7,bh2))|0;mid=(mid+Math.imul(ah7,bl2))|0;hi=(hi+Math.imul(ah7,bh2))|0;lo=(lo+Math.imul(al6,bl3))|0;mid=(mid+Math.imul(al6,bh3))|0;mid=(mid+Math.imul(ah6,bl3))|0;hi=(hi+Math.imul(ah6,bh3))|0;lo=(lo+Math.imul(al5,bl4))|0;mid=(mid+Math.imul(al5,bh4))|0;mid=(mid+Math.imul(ah5,bl4))|0;hi=(hi+Math.imul(ah5,bh4))|0;lo=(lo+Math.imul(al4,bl5))|0;mid=(mid+Math.imul(al4,bh5))|0;mid=(mid+Math.imul(ah4,bl5))|0;hi=(hi+Math.imul(ah4,bh5))|0;lo=(lo+Math.imul(al3,bl6))|0;mid=(mid+Math.imul(al3,bh6))|0;mid=(mid+Math.imul(ah3,bl6))|0;hi=(hi+Math.imul(ah3,bh6))|0;lo=(lo+Math.imul(al2,bl7))|0;mid=(mid+Math.imul(al2,bh7))|0;mid=(mid+Math.imul(ah2,bl7))|0;hi=(hi+Math.imul(ah2,bh7))|0;lo=(lo+Math.imul(al1,bl8))|0;mid=(mid+Math.imul(al1,bh8))|0;mid=(mid+Math.imul(ah1,bl8))|0;hi=(hi+Math.imul(ah1,bh8))|0;lo=(lo+Math.imul(al0,bl9))|0;mid=(mid+Math.imul(al0,bh9))|0;mid=(mid+Math.imul(ah0,bl9))|0;hi=(hi+Math.imul(ah0,bh9))|0;var w9=(((c+lo)|0)+((mid&0x1fff)<<13))|0;c=(((hi+(mid>>>13))|0)+(w9>>>26))|0;w9&=0x3ffffff;lo=Math.imul(al9,bl1);mid=Math.imul(al9,bh1);mid=(mid+Math.imul(ah9,bl1))|0;hi=Math.imul(ah9,bh1);lo=(lo+Math.imul(al8,bl2))|0;mid=(mid+Math.imul(al8,bh2))|0;mid=(mid+Math.imul(ah8,bl2))|0;hi=(hi+Math.imul(ah8,bh2))|0;lo=(lo+Math.imul(al7,bl3))|0;mid=(mid+Math.imul(al7,bh3))|0;mid=(mid+Math.imul(ah7,bl3))|0;hi=(hi+Math.imul(ah7,bh3))|0;lo=(lo+Math.imul(al6,bl4))|0;mid=(mid+Math.imul(al6,bh4))|0;mid=(mid+Math.imul(ah6,bl4))|0;hi=(hi+Math.imul(ah6,bh4))|0;lo=(lo+Math.imul(al5,bl5))|0;mid=(mid+Math.imul(al5,bh5))|0;mid=(mid+Math.imul(ah5,bl5))|0;hi=(hi+Math.imul(ah5,bh5))|0;lo=(lo+Math.imul(al4,bl6))|0;mid=(mid+Math.imul(al4,bh6))|0;mid=(mid+Math.imul(ah4,bl6))|0;hi=(hi+Math.imul(ah4,bh6))|0;lo=(lo+Math.imul(al3,bl7))|0;mid=(mid+Math.imul(al3,bh7))|0;mid=(mid+Math.imul(ah3,bl7))|0;hi=(hi+Math.imul(ah3,bh7))|0;lo=(lo+Math.imul(al2,bl8))|0;mid=(mid+Math.imul(al2,bh8))|0;mid=(mid+Math.imul(ah2,bl8))|0;hi=(hi+Math.imul(ah2,bh8))|0;lo=(lo+Math.imul(al1,bl9))|0;mid=(mid+Math.imul(al1,bh9))|0;mid=(mid+Math.imul(ah1,bl9))|0;hi=(hi+Math.imul(ah1,bh9))|0;var w10=(((c+lo)|0)+((mid&0x1fff)<<13))|0;c=(((hi+(mid>>>13))|0)+(w10>>>26))|0;w10&=0x3ffffff;lo=Math.imul(al9,bl2);mid=Math.imul(al9,bh2);mid=(mid+Math.imul(ah9,bl2))|0;hi=Math.imul(ah9,bh2);lo=(lo+Math.imul(al8,bl3))|0;mid=(mid+Math.imul(al8,bh3))|0;mid=(mid+Math.imul(ah8,bl3))|0;hi=(hi+Math.imul(ah8,bh3))|0;lo=(lo+Math.imul(al7,bl4))|0;mid=(mid+Math.imul(al7,bh4))|0;mid=(mid+Math.imul(ah7,bl4))|0;hi=(hi+Math.imul(ah7,bh4))|0;lo=(lo+Math.imul(al6,bl5))|0;mid=(mid+Math.imul(al6,bh5))|0;mid=(mid+Math.imul(ah6,bl5))|0;hi=(hi+Math.imul(ah6,bh5))|0;lo=(lo+Math.imul(al5,bl6))|0;mid=(mid+Math.imul(al5,bh6))|0;mid=(mid+Math.imul(ah5,bl6))|0;hi=(hi+Math.imul(ah5,bh6))|0;lo=(lo+Math.imul(al4,bl7))|0;mid=(mid+Math.imul(al4,bh7))|0;mid=(mid+Math.imul(ah4,bl7))|0;hi=(hi+Math.imul(ah4,bh7))|0;lo=(lo+Math.imul(al3,bl8))|0;mid=(mid+Math.imul(al3,bh8))|0;mid=(mid+Math.imul(ah3,bl8))|0;hi=(hi+Math.imul(ah3,bh8))|0;lo=(lo+Math.imul(al2,bl9))|0;mid=(mid+Math.imul(al2,bh9))|0;mid=(mid+Math.imul(ah2,bl9))|0;hi=(hi+Math.imul(ah2,bh9))|0;var w11=(((c+lo)|0)+((mid&0x1fff)<<13))|0;c=(((hi+(mid>>>13))|0)+(w11>>>26))|0;w11&=0x3ffffff;lo=Math.imul(al9,bl3);mid=Math.imul(al9,bh3);mid=(mid+Math.imul(ah9,bl3))|0;hi=Math.imul(ah9,bh3);lo=(lo+Math.imul(al8,bl4))|0;mid=(mid+Math.imul(al8,bh4))|0;mid=(mid+Math.imul(ah8,bl4))|0;hi=(hi+Math.imul(ah8,bh4))|0;lo=(lo+Math.imul(al7,bl5))|0;mid=(mid+Math.imul(al7,bh5))|0;mid=(mid+Math.imul(ah7,bl5))|0;hi=(hi+Math.imul(ah7,bh5))|0;lo=(lo+Math.imul(al6,bl6))|0;mid=(mid+Math.imul(al6,bh6))|0;mid=(mid+Math.imul(ah6,bl6))|0;hi=(hi+Math.imul(ah6,bh6))|0;lo=(lo+Math.imul(al5,bl7))|0;mid=(mid+Math.imul(al5,bh7))|0;mid=(mid+Math.imul(ah5,bl7))|0;hi=(hi+Math.imul(ah5,bh7))|0;lo=(lo+Math.imul(al4,bl8))|0;mid=(mid+Math.imul(al4,bh8))|0;mid=(mid+Math.imul(ah4,bl8))|0;hi=(hi+Math.imul(ah4,bh8))|0;lo=(lo+Math.imul(al3,bl9))|0;mid=(mid+Math.imul(al3,bh9))|0;mid=(mid+Math.imul(ah3,bl9))|0;hi=(hi+Math.imul(ah3,bh9))|0;var w12=(((c+lo)|0)+((mid&0x1fff)<<13))|0;c=(((hi+(mid>>>13))|0)+(w12>>>26))|0;w12&=0x3ffffff;lo=Math.imul(al9,bl4);mid=Math.imul(al9,bh4);mid=(mid+Math.imul(ah9,bl4))|0;hi=Math.imul(ah9,bh4);lo=(lo+Math.imul(al8,bl5))|0;mid=(mid+Math.imul(al8,bh5))|0;mid=(mid+Math.imul(ah8,bl5))|0;hi=(hi+Math.imul(ah8,bh5))|0;lo=(lo+Math.imul(al7,bl6))|0;mid=(mid+Math.imul(al7,bh6))|0;mid=(mid+Math.imul(ah7,bl6))|0;hi=(hi+Math.imul(ah7,bh6))|0;lo=(lo+Math.imul(al6,bl7))|0;mid=(mid+Math.imul(al6,bh7))|0;mid=(mid+Math.imul(ah6,bl7))|0;hi=(hi+Math.imul(ah6,bh7))|0;lo=(lo+Math.imul(al5,bl8))|0;mid=(mid+Math.imul(al5,bh8))|0;mid=(mid+Math.imul(ah5,bl8))|0;hi=(hi+Math.imul(ah5,bh8))|0;lo=(lo+Math.imul(al4,bl9))|0;mid=(mid+Math.imul(al4,bh9))|0;mid=(mid+Math.imul(ah4,bl9))|0;hi=(hi+Math.imul(ah4,bh9))|0;var w13=(((c+lo)|0)+((mid&0x1fff)<<13))|0;c=(((hi+(mid>>>13))|0)+(w13>>>26))|0;w13&=0x3ffffff;lo=Math.imul(al9,bl5);mid=Math.imul(al9,bh5);mid=(mid+Math.imul(ah9,bl5))|0;hi=Math.imul(ah9,bh5);lo=(lo+Math.imul(al8,bl6))|0;mid=(mid+Math.imul(al8,bh6))|0;mid=(mid+Math.imul(ah8,bl6))|0;hi=(hi+Math.imul(ah8,bh6))|0;lo=(lo+Math.imul(al7,bl7))|0;mid=(mid+Math.imul(al7,bh7))|0;mid=(mid+Math.imul(ah7,bl7))|0;hi=(hi+Math.imul(ah7,bh7))|0;lo=(lo+Math.imul(al6,bl8))|0;mid=(mid+Math.imul(al6,bh8))|0;mid=(mid+Math.imul(ah6,bl8))|0;hi=(hi+Math.imul(ah6,bh8))|0;lo=(lo+Math.imul(al5,bl9))|0;mid=(mid+Math.imul(al5,bh9))|0;mid=(mid+Math.imul(ah5,bl9))|0;hi=(hi+Math.imul(ah5,bh9))|0;var w14=(((c+lo)|0)+((mid&0x1fff)<<13))|0;c=(((hi+(mid>>>13))|0)+(w14>>>26))|0;w14&=0x3ffffff;lo=Math.imul(al9,bl6);mid=Math.imul(al9,bh6);mid=(mid+Math.imul(ah9,bl6))|0;hi=Math.imul(ah9,bh6);lo=(lo+Math.imul(al8,bl7))|0;mid=(mid+Math.imul(al8,bh7))|0;mid=(mid+Math.imul(ah8,bl7))|0;hi=(hi+Math.imul(ah8,bh7))|0;lo=(lo+Math.imul(al7,bl8))|0;mid=(mid+Math.imul(al7,bh8))|0;mid=(mid+Math.imul(ah7,bl8))|0;hi=(hi+Math.imul(ah7,bh8))|0;lo=(lo+Math.imul(al6,bl9))|0;mid=(mid+Math.imul(al6,bh9))|0;mid=(mid+Math.imul(ah6,bl9))|0;hi=(hi+Math.imul(ah6,bh9))|0;var w15=(((c+lo)|0)+((mid&0x1fff)<<13))|0;c=(((hi+(mid>>>13))|0)+(w15>>>26))|0;w15&=0x3ffffff;lo=Math.imul(al9,bl7);mid=Math.imul(al9,bh7);mid=(mid+Math.imul(ah9,bl7))|0;hi=Math.imul(ah9,bh7);lo=(lo+Math.imul(al8,bl8))|0;mid=(mid+Math.imul(al8,bh8))|0;mid=(mid+Math.imul(ah8,bl8))|0;hi=(hi+Math.imul(ah8,bh8))|0;lo=(lo+Math.imul(al7,bl9))|0;mid=(mid+Math.imul(al7,bh9))|0;mid=(mid+Math.imul(ah7,bl9))|0;hi=(hi+Math.imul(ah7,bh9))|0;var w16=(((c+lo)|0)+((mid&0x1fff)<<13))|0;c=(((hi+(mid>>>13))|0)+(w16>>>26))|0;w16&=0x3ffffff;lo=Math.imul(al9,bl8);mid=Math.imul(al9,bh8);mid=(mid+Math.imul(ah9,bl8))|0;hi=Math.imul(ah9,bh8);lo=(lo+Math.imul(al8,bl9))|0;mid=(mid+Math.imul(al8,bh9))|0;mid=(mid+Math.imul(ah8,bl9))|0;hi=(hi+Math.imul(ah8,bh9))|0;var w17=(((c+lo)|0)+((mid&0x1fff)<<13))|0;c=(((hi+(mid>>>13))|0)+(w17>>>26))|0;w17&=0x3ffffff;lo=Math.imul(al9,bl9);mid=Math.imul(al9,bh9);mid=(mid+Math.imul(ah9,bl9))|0;hi=Math.imul(ah9,bh9);var w18=(((c+lo)|0)+((mid&0x1fff)<<13))|0;c=(((hi+(mid>>>13))|0)+(w18>>>26))|0;w18&=0x3ffffff;o[0]=w0;o[1]=w1;o[2]=w2;o[3]=w3;o[4]=w4;o[5]=w5;o[6]=w6;o[7]=w7;o[8]=w8;o[9]=w9;o[10]=w10;o[11]=w11;o[12]=w12;o[13]=w13;o[14]=w14;o[15]=w15;o[16]=w16;o[17]=w17;o[18]=w18;if(c!==0){o[19]=c;out.length++;}
return out;};if(!Math.imul){comb10MulTo=smallMulTo;}
function bigMulTo(self,num,out){out.negative=num.negative^self.negative;out.length=self.length+num.length;var carry=0;var hncarry=0;for(var k=0;k<out.length-1;k++){var ncarry=hncarry;hncarry=0;var rword=carry&0x3ffffff;var maxJ=Math.min(k,num.length-1);for(var j=Math.max(0,k-self.length+1);j<=maxJ;j++){var i=k-j;var a=self.words[i]|0;var b=num.words[j]|0;var r=a*b;var lo=r&0x3ffffff;ncarry=(ncarry+((r/0x4000000)|0))|0;lo=(lo+rword)|0;rword=lo&0x3ffffff;ncarry=(ncarry+(lo>>>26))|0;hncarry+=ncarry>>>26;ncarry&=0x3ffffff;}
out.words[k]=rword;carry=ncarry;ncarry=hncarry;}
if(carry!==0){out.words[k]=carry;}else{out.length--;}
return out.strip();}
function jumboMulTo(self,num,out){var fftm=new FFTM();return fftm.mulp(self,num,out);}
BN.prototype.mulTo=function mulTo(num,out){var res;var len=this.length+num.length;if(this.length===10&&num.length===10){res=comb10MulTo(this,num,out);}else if(len<63){res=smallMulTo(this,num,out);}else if(len<1024){res=bigMulTo(this,num,out);}else{res=jumboMulTo(this,num,out);}
return res;};function FFTM(x,y){this.x=x;this.y=y;}
FFTM.prototype.makeRBT=function makeRBT(N){var t=new Array(N);var l=BN.prototype._countBits(N)-1;for(var i=0;i<N;i++){t[i]=this.revBin(i,l,N);}
return t;};FFTM.prototype.revBin=function revBin(x,l,N){if(x===0||x===N-1)return x;var rb=0;for(var i=0;i<l;i++){rb|=(x&1)<<(l-i-1);x>>=1;}
return rb;};FFTM.prototype.permute=function permute(rbt,rws,iws,rtws,itws,N){for(var i=0;i<N;i++){rtws[i]=rws[rbt[i]];itws[i]=iws[rbt[i]];}};FFTM.prototype.transform=function transform(rws,iws,rtws,itws,N,rbt){this.permute(rbt,rws,iws,rtws,itws,N);for(var s=1;s<N;s<<=1){var l=s<<1;var rtwdf=Math.cos(2*Math.PI/l);var itwdf=Math.sin(2*Math.PI/l);for(var p=0;p<N;p+=l){var rtwdf_=rtwdf;var itwdf_=itwdf;for(var j=0;j<s;j++){var re=rtws[p+j];var ie=itws[p+j];var ro=rtws[p+j+s];var io=itws[p+j+s];var rx=rtwdf_*ro-itwdf_*io;io=rtwdf_*io+itwdf_*ro;ro=rx;rtws[p+j]=re+ro;itws[p+j]=ie+io;rtws[p+j+s]=re-ro;itws[p+j+s]=ie-io;if(j!==l){rx=rtwdf*rtwdf_-itwdf*itwdf_;itwdf_=rtwdf*itwdf_+itwdf*rtwdf_;rtwdf_=rx;}}}}};FFTM.prototype.guessLen13b=function guessLen13b(n,m){var N=Math.max(m,n)|1;var odd=N&1;var i=0;for(N=N/2|0;N;N=N>>>1){i++;}
return 1<<i+1+odd;};FFTM.prototype.conjugate=function conjugate(rws,iws,N){if(N<=1)return;for(var i=0;i<N/2;i++){var t=rws[i];rws[i]=rws[N-i-1];rws[N-i-1]=t;t=iws[i];iws[i]=-iws[N-i-1];iws[N-i-1]=-t;}};FFTM.prototype.normalize13b=function normalize13b(ws,N){var carry=0;for(var i=0;i<N/2;i++){var w=Math.round(ws[2*i+1]/N)*0x2000+
Math.round(ws[2*i]/N)+
carry;ws[i]=w&0x3ffffff;if(w<0x4000000){carry=0;}else{carry=w/0x4000000|0;}}
return ws;};FFTM.prototype.convert13b=function convert13b(ws,len,rws,N){var carry=0;for(var i=0;i<len;i++){carry=carry+(ws[i]|0);rws[2*i]=carry&0x1fff;carry=carry>>>13;rws[2*i+1]=carry&0x1fff;carry=carry>>>13;}
for(i=2*len;i<N;++i){rws[i]=0;}
assert(carry===0);assert((carry&~0x1fff)===0);};FFTM.prototype.stub=function stub(N){var ph=new Array(N);for(var i=0;i<N;i++){ph[i]=0;}
return ph;};FFTM.prototype.mulp=function mulp(x,y,out){var N=2*this.guessLen13b(x.length,y.length);var rbt=this.makeRBT(N);var _=this.stub(N);var rws=new Array(N);var rwst=new Array(N);var iwst=new Array(N);var nrws=new Array(N);var nrwst=new Array(N);var niwst=new Array(N);var rmws=out.words;rmws.length=N;this.convert13b(x.words,x.length,rws,N);this.convert13b(y.words,y.length,nrws,N);this.transform(rws,_,rwst,iwst,N,rbt);this.transform(nrws,_,nrwst,niwst,N,rbt);for(var i=0;i<N;i++){var rx=rwst[i]*nrwst[i]-iwst[i]*niwst[i];iwst[i]=rwst[i]*niwst[i]+iwst[i]*nrwst[i];rwst[i]=rx;}
this.conjugate(rwst,iwst,N);this.transform(rwst,iwst,rmws,_,N,rbt);this.conjugate(rmws,_,N);this.normalize13b(rmws,N);out.negative=x.negative^y.negative;out.length=x.length+y.length;return out.strip();};BN.prototype.mul=function mul(num){var out=new BN(null);out.words=new Array(this.length+num.length);return this.mulTo(num,out);};BN.prototype.mulf=function mulf(num){var out=new BN(null);out.words=new Array(this.length+num.length);return jumboMulTo(this,num,out);};BN.prototype.imul=function imul(num){return this.clone().mulTo(num,this);};BN.prototype.imuln=function imuln(num){assert(typeof num==='number');assert(num<0x4000000);var carry=0;for(var i=0;i<this.length;i++){var w=(this.words[i]|0)*num;var lo=(w&0x3ffffff)+(carry&0x3ffffff);carry>>=26;carry+=(w/0x4000000)|0;carry+=lo>>>26;this.words[i]=lo&0x3ffffff;}
if(carry!==0){this.words[i]=carry;this.length++;}
return this;};BN.prototype.muln=function muln(num){return this.clone().imuln(num);};BN.prototype.sqr=function sqr(){return this.mul(this);};BN.prototype.isqr=function isqr(){return this.imul(this.clone());};BN.prototype.pow=function pow(num){var w=toBitArray(num);if(w.length===0)return new BN(1);var res=this;for(var i=0;i<w.length;i++,res=res.sqr()){if(w[i]!==0)break;}
if(++i<w.length){for(var q=res.sqr();i<w.length;i++,q=q.sqr()){if(w[i]===0)continue;res=res.mul(q);}}
return res;};BN.prototype.iushln=function iushln(bits){assert(typeof bits==='number'&&bits>=0);var r=bits%26;var s=(bits-r)/26;var carryMask=(0x3ffffff>>>(26-r))<<(26-r);var i;if(r!==0){var carry=0;for(i=0;i<this.length;i++){var newCarry=this.words[i]&carryMask;var c=((this.words[i]|0)-newCarry)<<r;this.words[i]=c|carry;carry=newCarry>>>(26-r);}
if(carry){this.words[i]=carry;this.length++;}}
if(s!==0){for(i=this.length-1;i>=0;i--){this.words[i+s]=this.words[i];}
for(i=0;i<s;i++){this.words[i]=0;}
this.length+=s;}
return this.strip();};BN.prototype.ishln=function ishln(bits){assert(this.negative===0);return this.iushln(bits);};BN.prototype.iushrn=function iushrn(bits,hint,extended){assert(typeof bits==='number'&&bits>=0);var h;if(hint){h=(hint-(hint%26))/26;}else{h=0;}
var r=bits%26;var s=Math.min((bits-r)/26,this.length);var mask=0x3ffffff^((0x3ffffff>>>r)<<r);var maskedWords=extended;h-=s;h=Math.max(0,h);if(maskedWords){for(var i=0;i<s;i++){maskedWords.words[i]=this.words[i];}
maskedWords.length=s;}
if(s===0){}else if(this.length>s){this.length-=s;for(i=0;i<this.length;i++){this.words[i]=this.words[i+s];}}else{this.words[0]=0;this.length=1;}
var carry=0;for(i=this.length-1;i>=0&&(carry!==0||i>=h);i--){var word=this.words[i]|0;this.words[i]=(carry<<(26-r))|(word>>>r);carry=word&mask;}
if(maskedWords&&carry!==0){maskedWords.words[maskedWords.length++]=carry;}
if(this.length===0){this.words[0]=0;this.length=1;}
return this.strip();};BN.prototype.ishrn=function ishrn(bits,hint,extended){assert(this.negative===0);return this.iushrn(bits,hint,extended);};BN.prototype.shln=function shln(bits){return this.clone().ishln(bits);};BN.prototype.ushln=function ushln(bits){return this.clone().iushln(bits);};BN.prototype.shrn=function shrn(bits){return this.clone().ishrn(bits);};BN.prototype.ushrn=function ushrn(bits){return this.clone().iushrn(bits);};BN.prototype.testn=function testn(bit){assert(typeof bit==='number'&&bit>=0);var r=bit%26;var s=(bit-r)/26;var q=1<<r;if(this.length<=s)return false;var w=this.words[s];return!!(w&q);};BN.prototype.imaskn=function imaskn(bits){assert(typeof bits==='number'&&bits>=0);var r=bits%26;var s=(bits-r)/26;assert(this.negative===0,'imaskn works only with positive numbers');if(this.length<=s){return this;}
if(r!==0){s++;}
this.length=Math.min(s,this.length);if(r!==0){var mask=0x3ffffff^((0x3ffffff>>>r)<<r);this.words[this.length-1]&=mask;}
return this.strip();};BN.prototype.maskn=function maskn(bits){return this.clone().imaskn(bits);};BN.prototype.iaddn=function iaddn(num){assert(typeof num==='number');assert(num<0x4000000);if(num<0)return this.isubn(-num);if(this.negative!==0){if(this.length===1&&(this.words[0]|0)<num){this.words[0]=num-(this.words[0]|0);this.negative=0;return this;}
this.negative=0;this.isubn(num);this.negative=1;return this;}
return this._iaddn(num);};BN.prototype._iaddn=function _iaddn(num){this.words[0]+=num;for(var i=0;i<this.length&&this.words[i]>=0x4000000;i++){this.words[i]-=0x4000000;if(i===this.length-1){this.words[i+1]=1;}else{this.words[i+1]++;}}
this.length=Math.max(this.length,i+1);return this;};BN.prototype.isubn=function isubn(num){assert(typeof num==='number');assert(num<0x4000000);if(num<0)return this.iaddn(-num);if(this.negative!==0){this.negative=0;this.iaddn(num);this.negative=1;return this;}
this.words[0]-=num;if(this.length===1&&this.words[0]<0){this.words[0]=-this.words[0];this.negative=1;}else{for(var i=0;i<this.length&&this.words[i]<0;i++){this.words[i]+=0x4000000;this.words[i+1]-=1;}}
return this.strip();};BN.prototype.addn=function addn(num){return this.clone().iaddn(num);};BN.prototype.subn=function subn(num){return this.clone().isubn(num);};BN.prototype.iabs=function iabs(){this.negative=0;return this;};BN.prototype.abs=function abs(){return this.clone().iabs();};BN.prototype._ishlnsubmul=function _ishlnsubmul(num,mul,shift){var len=num.length+shift;var i;this._expand(len);var w;var carry=0;for(i=0;i<num.length;i++){w=(this.words[i+shift]|0)+carry;var right=(num.words[i]|0)*mul;w-=right&0x3ffffff;carry=(w>>26)-((right/0x4000000)|0);this.words[i+shift]=w&0x3ffffff;}
for(;i<this.length-shift;i++){w=(this.words[i+shift]|0)+carry;carry=w>>26;this.words[i+shift]=w&0x3ffffff;}
if(carry===0)return this.strip();assert(carry===-1);carry=0;for(i=0;i<this.length;i++){w=-(this.words[i]|0)+carry;carry=w>>26;this.words[i]=w&0x3ffffff;}
this.negative=1;return this.strip();};BN.prototype._wordDiv=function _wordDiv(num,mode){var shift=this.length-num.length;var a=this.clone();var b=num;var bhi=b.words[b.length-1]|0;var bhiBits=this._countBits(bhi);shift=26-bhiBits;if(shift!==0){b=b.ushln(shift);a.iushln(shift);bhi=b.words[b.length-1]|0;}
var m=a.length-b.length;var q;if(mode!=='mod'){q=new BN(null);q.length=m+1;q.words=new Array(q.length);for(var i=0;i<q.length;i++){q.words[i]=0;}}
var diff=a.clone()._ishlnsubmul(b,1,m);if(diff.negative===0){a=diff;if(q){q.words[m]=1;}}
for(var j=m-1;j>=0;j--){var qj=(a.words[b.length+j]|0)*0x4000000+
(a.words[b.length+j-1]|0);qj=Math.min((qj/bhi)|0,0x3ffffff);a._ishlnsubmul(b,qj,j);while(a.negative!==0){qj--;a.negative=0;a._ishlnsubmul(b,1,j);if(!a.isZero()){a.negative^=1;}}
if(q){q.words[j]=qj;}}
if(q){q.strip();}
a.strip();if(mode!=='div'&&shift!==0){a.iushrn(shift);}
return{div:q||null,mod:a};};BN.prototype.divmod=function divmod(num,mode,positive){assert(!num.isZero());if(this.isZero()){return{div:new BN(0),mod:new BN(0)};}
var div,mod,res;if(this.negative!==0&&num.negative===0){res=this.neg().divmod(num,mode);if(mode!=='mod'){div=res.div.neg();}
if(mode!=='div'){mod=res.mod.neg();if(positive&&mod.negative!==0){mod.iadd(num);}}
return{div:div,mod:mod};}
if(this.negative===0&&num.negative!==0){res=this.divmod(num.neg(),mode);if(mode!=='mod'){div=res.div.neg();}
return{div:div,mod:res.mod};}
if((this.negative&num.negative)!==0){res=this.neg().divmod(num.neg(),mode);if(mode!=='div'){mod=res.mod.neg();if(positive&&mod.negative!==0){mod.isub(num);}}
return{div:res.div,mod:mod};}
if(num.length>this.length||this.cmp(num)<0){return{div:new BN(0),mod:this};}
if(num.length===1){if(mode==='div'){return{div:this.divn(num.words[0]),mod:null};}
if(mode==='mod'){return{div:null,mod:new BN(this.modn(num.words[0]))};}
return{div:this.divn(num.words[0]),mod:new BN(this.modn(num.words[0]))};}
return this._wordDiv(num,mode);};BN.prototype.div=function div(num){return this.divmod(num,'div',false).div;};BN.prototype.mod=function mod(num){return this.divmod(num,'mod',false).mod;};BN.prototype.umod=function umod(num){return this.divmod(num,'mod',true).mod;};BN.prototype.divRound=function divRound(num){var dm=this.divmod(num);if(dm.mod.isZero())return dm.div;var mod=dm.div.negative!==0?dm.mod.isub(num):dm.mod;var half=num.ushrn(1);var r2=num.andln(1);var cmp=mod.cmp(half);if(cmp<0||r2===1&&cmp===0)return dm.div;return dm.div.negative!==0?dm.div.isubn(1):dm.div.iaddn(1);};BN.prototype.modn=function modn(num){assert(num<=0x3ffffff);var p=(1<<26)%num;var acc=0;for(var i=this.length-1;i>=0;i--){acc=(p*acc+(this.words[i]|0))%num;}
return acc;};BN.prototype.idivn=function idivn(num){assert(num<=0x3ffffff);var carry=0;for(var i=this.length-1;i>=0;i--){var w=(this.words[i]|0)+carry*0x4000000;this.words[i]=(w/num)|0;carry=w%num;}
return this.strip();};BN.prototype.divn=function divn(num){return this.clone().idivn(num);};BN.prototype.egcd=function egcd(p){assert(p.negative===0);assert(!p.isZero());var x=this;var y=p.clone();if(x.negative!==0){x=x.umod(p);}else{x=x.clone();}
var A=new BN(1);var B=new BN(0);var C=new BN(0);var D=new BN(1);var g=0;while(x.isEven()&&y.isEven()){x.iushrn(1);y.iushrn(1);++g;}
var yp=y.clone();var xp=x.clone();while(!x.isZero()){for(var i=0,im=1;(x.words[0]&im)===0&&i<26;++i,im<<=1);if(i>0){x.iushrn(i);while(i-->0){if(A.isOdd()||B.isOdd()){A.iadd(yp);B.isub(xp);}
A.iushrn(1);B.iushrn(1);}}
for(var j=0,jm=1;(y.words[0]&jm)===0&&j<26;++j,jm<<=1);if(j>0){y.iushrn(j);while(j-->0){if(C.isOdd()||D.isOdd()){C.iadd(yp);D.isub(xp);}
C.iushrn(1);D.iushrn(1);}}
if(x.cmp(y)>=0){x.isub(y);A.isub(C);B.isub(D);}else{y.isub(x);C.isub(A);D.isub(B);}}
return{a:C,b:D,gcd:y.iushln(g)};};BN.prototype._invmp=function _invmp(p){assert(p.negative===0);assert(!p.isZero());var a=this;var b=p.clone();if(a.negative!==0){a=a.umod(p);}else{a=a.clone();}
var x1=new BN(1);var x2=new BN(0);var delta=b.clone();while(a.cmpn(1)>0&&b.cmpn(1)>0){for(var i=0,im=1;(a.words[0]&im)===0&&i<26;++i,im<<=1);if(i>0){a.iushrn(i);while(i-->0){if(x1.isOdd()){x1.iadd(delta);}
x1.iushrn(1);}}
for(var j=0,jm=1;(b.words[0]&jm)===0&&j<26;++j,jm<<=1);if(j>0){b.iushrn(j);while(j-->0){if(x2.isOdd()){x2.iadd(delta);}
x2.iushrn(1);}}
if(a.cmp(b)>=0){a.isub(b);x1.isub(x2);}else{b.isub(a);x2.isub(x1);}}
var res;if(a.cmpn(1)===0){res=x1;}else{res=x2;}
if(res.cmpn(0)<0){res.iadd(p);}
return res;};BN.prototype.gcd=function gcd(num){if(this.isZero())return num.abs();if(num.isZero())return this.abs();var a=this.clone();var b=num.clone();a.negative=0;b.negative=0;for(var shift=0;a.isEven()&&b.isEven();shift++){a.iushrn(1);b.iushrn(1);}
do{while(a.isEven()){a.iushrn(1);}
while(b.isEven()){b.iushrn(1);}
var r=a.cmp(b);if(r<0){var t=a;a=b;b=t;}else if(r===0||b.cmpn(1)===0){break;}
a.isub(b);}while(true);return b.iushln(shift);};BN.prototype.invm=function invm(num){return this.egcd(num).a.umod(num);};BN.prototype.isEven=function isEven(){return(this.words[0]&1)===0;};BN.prototype.isOdd=function isOdd(){return(this.words[0]&1)===1;};BN.prototype.andln=function andln(num){return this.words[0]&num;};BN.prototype.bincn=function bincn(bit){assert(typeof bit==='number');var r=bit%26;var s=(bit-r)/26;var q=1<<r;if(this.length<=s){this._expand(s+1);this.words[s]|=q;return this;}
var carry=q;for(var i=s;carry!==0&&i<this.length;i++){var w=this.words[i]|0;w+=carry;carry=w>>>26;w&=0x3ffffff;this.words[i]=w;}
if(carry!==0){this.words[i]=carry;this.length++;}
return this;};BN.prototype.isZero=function isZero(){return this.length===1&&this.words[0]===0;};BN.prototype.cmpn=function cmpn(num){var negative=num<0;if(this.negative!==0&&!negative)return-1;if(this.negative===0&&negative)return 1;this.strip();var res;if(this.length>1){res=1;}else{if(negative){num=-num;}
assert(num<=0x3ffffff,'Number is too big');var w=this.words[0]|0;res=w===num?0:w<num?-1:1;}
if(this.negative!==0)return-res|0;return res;};BN.prototype.cmp=function cmp(num){if(this.negative!==0&&num.negative===0)return-1;if(this.negative===0&&num.negative!==0)return 1;var res=this.ucmp(num);if(this.negative!==0)return-res|0;return res;};BN.prototype.ucmp=function ucmp(num){if(this.length>num.length)return 1;if(this.length<num.length)return-1;var res=0;for(var i=this.length-1;i>=0;i--){var a=this.words[i]|0;var b=num.words[i]|0;if(a===b)continue;if(a<b){res=-1;}else if(a>b){res=1;}
break;}
return res;};BN.prototype.gtn=function gtn(num){return this.cmpn(num)===1;};BN.prototype.gt=function gt(num){return this.cmp(num)===1;};BN.prototype.gten=function gten(num){return this.cmpn(num)>=0;};BN.prototype.gte=function gte(num){return this.cmp(num)>=0;};BN.prototype.ltn=function ltn(num){return this.cmpn(num)===-1;};BN.prototype.lt=function lt(num){return this.cmp(num)===-1;};BN.prototype.lten=function lten(num){return this.cmpn(num)<=0;};BN.prototype.lte=function lte(num){return this.cmp(num)<=0;};BN.prototype.eqn=function eqn(num){return this.cmpn(num)===0;};BN.prototype.eq=function eq(num){return this.cmp(num)===0;};BN.red=function red(num){return new Red(num);};BN.prototype.toRed=function toRed(ctx){assert(!this.red,'Already a number in reduction context');assert(this.negative===0,'red works only with positives');return ctx.convertTo(this)._forceRed(ctx);};BN.prototype.fromRed=function fromRed(){assert(this.red,'fromRed works only with numbers in reduction context');return this.red.convertFrom(this);};BN.prototype._forceRed=function _forceRed(ctx){this.red=ctx;return this;};BN.prototype.forceRed=function forceRed(ctx){assert(!this.red,'Already a number in reduction context');return this._forceRed(ctx);};BN.prototype.redAdd=function redAdd(num){assert(this.red,'redAdd works only with red numbers');return this.red.add(this,num);};BN.prototype.redIAdd=function redIAdd(num){assert(this.red,'redIAdd works only with red numbers');return this.red.iadd(this,num);};BN.prototype.redSub=function redSub(num){assert(this.red,'redSub works only with red numbers');return this.red.sub(this,num);};BN.prototype.redISub=function redISub(num){assert(this.red,'redISub works only with red numbers');return this.red.isub(this,num);};BN.prototype.redShl=function redShl(num){assert(this.red,'redShl works only with red numbers');return this.red.shl(this,num);};BN.prototype.redMul=function redMul(num){assert(this.red,'redMul works only with red numbers');this.red._verify2(this,num);return this.red.mul(this,num);};BN.prototype.redIMul=function redIMul(num){assert(this.red,'redMul works only with red numbers');this.red._verify2(this,num);return this.red.imul(this,num);};BN.prototype.redSqr=function redSqr(){assert(this.red,'redSqr works only with red numbers');this.red._verify1(this);return this.red.sqr(this);};BN.prototype.redISqr=function redISqr(){assert(this.red,'redISqr works only with red numbers');this.red._verify1(this);return this.red.isqr(this);};BN.prototype.redSqrt=function redSqrt(){assert(this.red,'redSqrt works only with red numbers');this.red._verify1(this);return this.red.sqrt(this);};BN.prototype.redInvm=function redInvm(){assert(this.red,'redInvm works only with red numbers');this.red._verify1(this);return this.red.invm(this);};BN.prototype.redNeg=function redNeg(){assert(this.red,'redNeg works only with red numbers');this.red._verify1(this);return this.red.neg(this);};BN.prototype.redPow=function redPow(num){assert(this.red&&!num.red,'redPow(normalNum)');this.red._verify1(this);return this.red.pow(this,num);};var primes={k256:null,p224:null,p192:null,p25519:null};function MPrime(name,p){this.name=name;this.p=new BN(p,16);this.n=this.p.bitLength();this.k=new BN(1).iushln(this.n).isub(this.p);this.tmp=this._tmp();}
MPrime.prototype._tmp=function _tmp(){var tmp=new BN(null);tmp.words=new Array(Math.ceil(this.n/13));return tmp;};MPrime.prototype.ireduce=function ireduce(num){var r=num;var rlen;do{this.split(r,this.tmp);r=this.imulK(r);r=r.iadd(this.tmp);rlen=r.bitLength();}while(rlen>this.n);var cmp=rlen<this.n?-1:r.ucmp(this.p);if(cmp===0){r.words[0]=0;r.length=1;}else if(cmp>0){r.isub(this.p);}else{r.strip();}
return r;};MPrime.prototype.split=function split(input,out){input.iushrn(this.n,0,out);};MPrime.prototype.imulK=function imulK(num){return num.imul(this.k);};function K256(){MPrime.call(this,'k256','ffffffff ffffffff ffffffff ffffffff ffffffff ffffffff fffffffe fffffc2f');}
inherits(K256,MPrime);K256.prototype.split=function split(input,output){var mask=0x3fffff;var outLen=Math.min(input.length,9);for(var i=0;i<outLen;i++){output.words[i]=input.words[i];}
output.length=outLen;if(input.length<=9){input.words[0]=0;input.length=1;return;}
var prev=input.words[9];output.words[output.length++]=prev&mask;for(i=10;i<input.length;i++){var next=input.words[i]|0;input.words[i-10]=((next&mask)<<4)|(prev>>>22);prev=next;}
prev>>>=22;input.words[i-10]=prev;if(prev===0&&input.length>10){input.length-=10;}else{input.length-=9;}};K256.prototype.imulK=function imulK(num){num.words[num.length]=0;num.words[num.length+1]=0;num.length+=2;var lo=0;for(var i=0;i<num.length;i++){var w=num.words[i]|0;lo+=w*0x3d1;num.words[i]=lo&0x3ffffff;lo=w*0x40+((lo/0x4000000)|0);}
if(num.words[num.length-1]===0){num.length--;if(num.words[num.length-1]===0){num.length--;}}
return num;};function P224(){MPrime.call(this,'p224','ffffffff ffffffff ffffffff ffffffff 00000000 00000000 00000001');}
inherits(P224,MPrime);function P192(){MPrime.call(this,'p192','ffffffff ffffffff ffffffff fffffffe ffffffff ffffffff');}
inherits(P192,MPrime);function P25519(){MPrime.call(this,'25519','7fffffffffffffff ffffffffffffffff ffffffffffffffff ffffffffffffffed');}
inherits(P25519,MPrime);P25519.prototype.imulK=function imulK(num){var carry=0;for(var i=0;i<num.length;i++){var hi=(num.words[i]|0)*0x13+carry;var lo=hi&0x3ffffff;hi>>>=26;num.words[i]=lo;carry=hi;}
if(carry!==0){num.words[num.length++]=carry;}
return num;};BN._prime=function prime(name){if(primes[name])return primes[name];var prime;if(name==='k256'){prime=new K256();}else if(name==='p224'){prime=new P224();}else if(name==='p192'){prime=new P192();}else if(name==='p25519'){prime=new P25519();}else{throw new Error('Unknown prime '+name);}
primes[name]=prime;return prime;};function Red(m){if(typeof m==='string'){var prime=BN._prime(m);this.m=prime.p;this.prime=prime;}else{assert(m.gtn(1),'modulus must be greater than 1');this.m=m;this.prime=null;}}
Red.prototype._verify1=function _verify1(a){assert(a.negative===0,'red works only with positives');assert(a.red,'red works only with red numbers');};Red.prototype._verify2=function _verify2(a,b){assert((a.negative|b.negative)===0,'red works only with positives');assert(a.red&&a.red===b.red,'red works only with red numbers');};Red.prototype.imod=function imod(a){if(this.prime)return this.prime.ireduce(a)._forceRed(this);return a.umod(this.m)._forceRed(this);};Red.prototype.neg=function neg(a){if(a.isZero()){return a.clone();}
return this.m.sub(a)._forceRed(this);};Red.prototype.add=function add(a,b){this._verify2(a,b);var res=a.add(b);if(res.cmp(this.m)>=0){res.isub(this.m);}
return res._forceRed(this);};Red.prototype.iadd=function iadd(a,b){this._verify2(a,b);var res=a.iadd(b);if(res.cmp(this.m)>=0){res.isub(this.m);}
return res;};Red.prototype.sub=function sub(a,b){this._verify2(a,b);var res=a.sub(b);if(res.cmpn(0)<0){res.iadd(this.m);}
return res._forceRed(this);};Red.prototype.isub=function isub(a,b){this._verify2(a,b);var res=a.isub(b);if(res.cmpn(0)<0){res.iadd(this.m);}
return res;};Red.prototype.shl=function shl(a,num){this._verify1(a);return this.imod(a.ushln(num));};Red.prototype.imul=function imul(a,b){this._verify2(a,b);return this.imod(a.imul(b));};Red.prototype.mul=function mul(a,b){this._verify2(a,b);return this.imod(a.mul(b));};Red.prototype.isqr=function isqr(a){return this.imul(a,a.clone());};Red.prototype.sqr=function sqr(a){return this.mul(a,a);};Red.prototype.sqrt=function sqrt(a){if(a.isZero())return a.clone();var mod3=this.m.andln(3);assert(mod3%2===1);if(mod3===3){var pow=this.m.add(new BN(1)).iushrn(2);return this.pow(a,pow);}
var q=this.m.subn(1);var s=0;while(!q.isZero()&&q.andln(1)===0){s++;q.iushrn(1);}
assert(!q.isZero());var one=new BN(1).toRed(this);var nOne=one.redNeg();var lpow=this.m.subn(1).iushrn(1);var z=this.m.bitLength();z=new BN(2*z*z).toRed(this);while(this.pow(z,lpow).cmp(nOne)!==0){z.redIAdd(nOne);}
var c=this.pow(z,q);var r=this.pow(a,q.addn(1).iushrn(1));var t=this.pow(a,q);var m=s;while(t.cmp(one)!==0){var tmp=t;for(var i=0;tmp.cmp(one)!==0;i++){tmp=tmp.redSqr();}
assert(i<m);var b=this.pow(c,new BN(1).iushln(m-i-1));r=r.redMul(b);c=b.redSqr();t=t.redMul(c);m=i;}
return r;};Red.prototype.invm=function invm(a){var inv=a._invmp(this.m);if(inv.negative!==0){inv.negative=0;return this.imod(inv).redNeg();}else{return this.imod(inv);}};Red.prototype.pow=function pow(a,num){if(num.isZero())return new BN(1);if(num.cmpn(1)===0)return a.clone();var windowSize=4;var wnd=new Array(1<<windowSize);wnd[0]=new BN(1).toRed(this);wnd[1]=a;for(var i=2;i<wnd.length;i++){wnd[i]=this.mul(wnd[i-1],a);}
var res=wnd[0];var current=0;var currentLen=0;var start=num.bitLength()%26;if(start===0){start=26;}
for(i=num.length-1;i>=0;i--){var word=num.words[i];for(var j=start-1;j>=0;j--){var bit=(word>>j)&1;if(res!==wnd[0]){res=this.sqr(res);}
if(bit===0&&current===0){currentLen=0;continue;}
current<<=1;current|=bit;currentLen++;if(currentLen!==windowSize&&(i!==0||j!==0))continue;res=this.mul(res,wnd[current]);currentLen=0;current=0;}
start=26;}
return res;};Red.prototype.convertTo=function convertTo(num){var r=num.umod(this.m);return r===num?r.clone():r;};Red.prototype.convertFrom=function convertFrom(num){var res=num.clone();res.red=null;return res;};BN.mont=function mont(num){return new Mont(num);};function Mont(m){Red.call(this,m);this.shift=this.m.bitLength();if(this.shift%26!==0){this.shift+=26-(this.shift%26);}
this.r=new BN(1).iushln(this.shift);this.r2=this.imod(this.r.sqr());this.rinv=this.r._invmp(this.m);this.minv=this.rinv.mul(this.r).isubn(1).div(this.m);this.minv=this.minv.umod(this.r);this.minv=this.r.sub(this.minv);}
inherits(Mont,Red);Mont.prototype.convertTo=function convertTo(num){return this.imod(num.ushln(this.shift));};Mont.prototype.convertFrom=function convertFrom(num){var r=this.imod(num.mul(this.rinv));r.red=null;return r;};Mont.prototype.imul=function imul(a,b){if(a.isZero()||b.isZero()){a.words[0]=0;a.length=1;return a;}
var t=a.imul(b);var c=t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);var u=t.isub(c).iushrn(this.shift);var res=u;if(u.cmp(this.m)>=0){res=u.isub(this.m);}else if(u.cmpn(0)<0){res=u.iadd(this.m);}
return res._forceRed(this);};Mont.prototype.mul=function mul(a,b){if(a.isZero()||b.isZero())return new BN(0)._forceRed(this);var t=a.mul(b);var c=t.maskn(this.shift).mul(this.minv).imaskn(this.shift).mul(this.m);var u=t.isub(c).iushrn(this.shift);var res=u;if(u.cmp(this.m)>=0){res=u.isub(this.m);}else if(u.cmpn(0)<0){res=u.iadd(this.m);}
return res._forceRed(this);};Mont.prototype.invm=function invm(a){var res=this.imod(a._invmp(this.m).mul(this.r2));return res._forceRed(this);};})(typeof module==='undefined'||module,this);}.call(exports,__webpack_require__(55)(module)))}),(function(module,exports,__webpack_require__){;(function(root,factory){if(true){module.exports=exports=factory(__webpack_require__(0));}
else if(typeof define==="function"&&define.amd){define(["./core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){(function(Math){var C=CryptoJS;var C_lib=C.lib;var WordArray=C_lib.WordArray;var Hasher=C_lib.Hasher;var C_algo=C.algo;var H=[];var K=[];(function(){function isPrime(n){var sqrtN=Math.sqrt(n);for(var factor=2;factor<=sqrtN;factor++){if(!(n%factor)){return false;}}
return true;}
function getFractionalBits(n){return((n-(n|0))*0x100000000)|0;}
var n=2;var nPrime=0;while(nPrime<64){if(isPrime(n)){if(nPrime<8){H[nPrime]=getFractionalBits(Math.pow(n,1/2));}
K[nPrime]=getFractionalBits(Math.pow(n,1/3));nPrime++;}
n++;}}());var W=[];var SHA256=C_algo.SHA256=Hasher.extend({_doReset:function(){this._hash=new WordArray.init(H.slice(0));},_doProcessBlock:function(M,offset){var H=this._hash.words;var a=H[0];var b=H[1];var c=H[2];var d=H[3];var e=H[4];var f=H[5];var g=H[6];var h=H[7];for(var i=0;i<64;i++){if(i<16){W[i]=M[offset+i]|0;}else{var gamma0x=W[i-15];var gamma0=((gamma0x<<25)|(gamma0x>>>7))^((gamma0x<<14)|(gamma0x>>>18))^(gamma0x>>>3);var gamma1x=W[i-2];var gamma1=((gamma1x<<15)|(gamma1x>>>17))^((gamma1x<<13)|(gamma1x>>>19))^(gamma1x>>>10);W[i]=gamma0+W[i-7]+gamma1+W[i-16];}
var ch=(e&f)^(~e&g);var maj=(a&b)^(a&c)^(b&c);var sigma0=((a<<30)|(a>>>2))^((a<<19)|(a>>>13))^((a<<10)|(a>>>22));var sigma1=((e<<26)|(e>>>6))^((e<<21)|(e>>>11))^((e<<7)|(e>>>25));var t1=h+sigma1+ch+K[i]+W[i];var t2=sigma0+maj;h=g;g=f;f=e;e=(d+t1)|0;d=c;c=b;b=a;a=(t1+t2)|0;}
H[0]=(H[0]+a)|0;H[1]=(H[1]+b)|0;H[2]=(H[2]+c)|0;H[3]=(H[3]+d)|0;H[4]=(H[4]+e)|0;H[5]=(H[5]+f)|0;H[6]=(H[6]+g)|0;H[7]=(H[7]+h)|0;},_doFinalize:function(){var data=this._data;var dataWords=data.words;var nBitsTotal=this._nDataBytes*8;var nBitsLeft=data.sigBytes*8;dataWords[nBitsLeft>>>5]|=0x80<<(24-nBitsLeft%32);dataWords[(((nBitsLeft+64)>>>9)<<4)+14]=Math.floor(nBitsTotal/0x100000000);dataWords[(((nBitsLeft+64)>>>9)<<4)+15]=nBitsTotal;data.sigBytes=dataWords.length*4;this._process();return this._hash;},clone:function(){var clone=Hasher.clone.call(this);clone._hash=this._hash.clone();return clone;}});C.SHA256=Hasher._createHelper(SHA256);C.HmacSHA256=Hasher._createHmacHelper(SHA256);}(Math));return CryptoJS.SHA256;}));}),(function(module,exports,__webpack_require__){;(function(root,factory,undef){if(true){module.exports=exports=factory(__webpack_require__(0),__webpack_require__(33));}
else if(typeof define==="function"&&define.amd){define(["./core","./x64-core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){(function(){var C=CryptoJS;var C_lib=C.lib;var Hasher=C_lib.Hasher;var C_x64=C.x64;var X64Word=C_x64.Word;var X64WordArray=C_x64.WordArray;var C_algo=C.algo;function X64Word_create(){return X64Word.create.apply(X64Word,arguments);}
var K=[X64Word_create(0x428a2f98,0xd728ae22),X64Word_create(0x71374491,0x23ef65cd),X64Word_create(0xb5c0fbcf,0xec4d3b2f),X64Word_create(0xe9b5dba5,0x8189dbbc),X64Word_create(0x3956c25b,0xf348b538),X64Word_create(0x59f111f1,0xb605d019),X64Word_create(0x923f82a4,0xaf194f9b),X64Word_create(0xab1c5ed5,0xda6d8118),X64Word_create(0xd807aa98,0xa3030242),X64Word_create(0x12835b01,0x45706fbe),X64Word_create(0x243185be,0x4ee4b28c),X64Word_create(0x550c7dc3,0xd5ffb4e2),X64Word_create(0x72be5d74,0xf27b896f),X64Word_create(0x80deb1fe,0x3b1696b1),X64Word_create(0x9bdc06a7,0x25c71235),X64Word_create(0xc19bf174,0xcf692694),X64Word_create(0xe49b69c1,0x9ef14ad2),X64Word_create(0xefbe4786,0x384f25e3),X64Word_create(0x0fc19dc6,0x8b8cd5b5),X64Word_create(0x240ca1cc,0x77ac9c65),X64Word_create(0x2de92c6f,0x592b0275),X64Word_create(0x4a7484aa,0x6ea6e483),X64Word_create(0x5cb0a9dc,0xbd41fbd4),X64Word_create(0x76f988da,0x831153b5),X64Word_create(0x983e5152,0xee66dfab),X64Word_create(0xa831c66d,0x2db43210),X64Word_create(0xb00327c8,0x98fb213f),X64Word_create(0xbf597fc7,0xbeef0ee4),X64Word_create(0xc6e00bf3,0x3da88fc2),X64Word_create(0xd5a79147,0x930aa725),X64Word_create(0x06ca6351,0xe003826f),X64Word_create(0x14292967,0x0a0e6e70),X64Word_create(0x27b70a85,0x46d22ffc),X64Word_create(0x2e1b2138,0x5c26c926),X64Word_create(0x4d2c6dfc,0x5ac42aed),X64Word_create(0x53380d13,0x9d95b3df),X64Word_create(0x650a7354,0x8baf63de),X64Word_create(0x766a0abb,0x3c77b2a8),X64Word_create(0x81c2c92e,0x47edaee6),X64Word_create(0x92722c85,0x1482353b),X64Word_create(0xa2bfe8a1,0x4cf10364),X64Word_create(0xa81a664b,0xbc423001),X64Word_create(0xc24b8b70,0xd0f89791),X64Word_create(0xc76c51a3,0x0654be30),X64Word_create(0xd192e819,0xd6ef5218),X64Word_create(0xd6990624,0x5565a910),X64Word_create(0xf40e3585,0x5771202a),X64Word_create(0x106aa070,0x32bbd1b8),X64Word_create(0x19a4c116,0xb8d2d0c8),X64Word_create(0x1e376c08,0x5141ab53),X64Word_create(0x2748774c,0xdf8eeb99),X64Word_create(0x34b0bcb5,0xe19b48a8),X64Word_create(0x391c0cb3,0xc5c95a63),X64Word_create(0x4ed8aa4a,0xe3418acb),X64Word_create(0x5b9cca4f,0x7763e373),X64Word_create(0x682e6ff3,0xd6b2b8a3),X64Word_create(0x748f82ee,0x5defb2fc),X64Word_create(0x78a5636f,0x43172f60),X64Word_create(0x84c87814,0xa1f0ab72),X64Word_create(0x8cc70208,0x1a6439ec),X64Word_create(0x90befffa,0x23631e28),X64Word_create(0xa4506ceb,0xde82bde9),X64Word_create(0xbef9a3f7,0xb2c67915),X64Word_create(0xc67178f2,0xe372532b),X64Word_create(0xca273ece,0xea26619c),X64Word_create(0xd186b8c7,0x21c0c207),X64Word_create(0xeada7dd6,0xcde0eb1e),X64Word_create(0xf57d4f7f,0xee6ed178),X64Word_create(0x06f067aa,0x72176fba),X64Word_create(0x0a637dc5,0xa2c898a6),X64Word_create(0x113f9804,0xbef90dae),X64Word_create(0x1b710b35,0x131c471b),X64Word_create(0x28db77f5,0x23047d84),X64Word_create(0x32caab7b,0x40c72493),X64Word_create(0x3c9ebe0a,0x15c9bebc),X64Word_create(0x431d67c4,0x9c100d4c),X64Word_create(0x4cc5d4be,0xcb3e42b6),X64Word_create(0x597f299c,0xfc657e2a),X64Word_create(0x5fcb6fab,0x3ad6faec),X64Word_create(0x6c44198c,0x4a475817)];var W=[];(function(){for(var i=0;i<80;i++){W[i]=X64Word_create();}}());var SHA512=C_algo.SHA512=Hasher.extend({_doReset:function(){this._hash=new X64WordArray.init([new X64Word.init(0x6a09e667,0xf3bcc908),new X64Word.init(0xbb67ae85,0x84caa73b),new X64Word.init(0x3c6ef372,0xfe94f82b),new X64Word.init(0xa54ff53a,0x5f1d36f1),new X64Word.init(0x510e527f,0xade682d1),new X64Word.init(0x9b05688c,0x2b3e6c1f),new X64Word.init(0x1f83d9ab,0xfb41bd6b),new X64Word.init(0x5be0cd19,0x137e2179)]);},_doProcessBlock:function(M,offset){var H=this._hash.words;var H0=H[0];var H1=H[1];var H2=H[2];var H3=H[3];var H4=H[4];var H5=H[5];var H6=H[6];var H7=H[7];var H0h=H0.high;var H0l=H0.low;var H1h=H1.high;var H1l=H1.low;var H2h=H2.high;var H2l=H2.low;var H3h=H3.high;var H3l=H3.low;var H4h=H4.high;var H4l=H4.low;var H5h=H5.high;var H5l=H5.low;var H6h=H6.high;var H6l=H6.low;var H7h=H7.high;var H7l=H7.low;var ah=H0h;var al=H0l;var bh=H1h;var bl=H1l;var ch=H2h;var cl=H2l;var dh=H3h;var dl=H3l;var eh=H4h;var el=H4l;var fh=H5h;var fl=H5l;var gh=H6h;var gl=H6l;var hh=H7h;var hl=H7l;for(var i=0;i<80;i++){var Wi=W[i];if(i<16){var Wih=Wi.high=M[offset+i*2]|0;var Wil=Wi.low=M[offset+i*2+1]|0;}else{var gamma0x=W[i-15];var gamma0xh=gamma0x.high;var gamma0xl=gamma0x.low;var gamma0h=((gamma0xh>>>1)|(gamma0xl<<31))^((gamma0xh>>>8)|(gamma0xl<<24))^(gamma0xh>>>7);var gamma0l=((gamma0xl>>>1)|(gamma0xh<<31))^((gamma0xl>>>8)|(gamma0xh<<24))^((gamma0xl>>>7)|(gamma0xh<<25));var gamma1x=W[i-2];var gamma1xh=gamma1x.high;var gamma1xl=gamma1x.low;var gamma1h=((gamma1xh>>>19)|(gamma1xl<<13))^((gamma1xh<<3)|(gamma1xl>>>29))^(gamma1xh>>>6);var gamma1l=((gamma1xl>>>19)|(gamma1xh<<13))^((gamma1xl<<3)|(gamma1xh>>>29))^((gamma1xl>>>6)|(gamma1xh<<26));var Wi7=W[i-7];var Wi7h=Wi7.high;var Wi7l=Wi7.low;var Wi16=W[i-16];var Wi16h=Wi16.high;var Wi16l=Wi16.low;var Wil=gamma0l+Wi7l;var Wih=gamma0h+Wi7h+((Wil>>>0)<(gamma0l>>>0)?1:0);var Wil=Wil+gamma1l;var Wih=Wih+gamma1h+((Wil>>>0)<(gamma1l>>>0)?1:0);var Wil=Wil+Wi16l;var Wih=Wih+Wi16h+((Wil>>>0)<(Wi16l>>>0)?1:0);Wi.high=Wih;Wi.low=Wil;}
var chh=(eh&fh)^(~eh&gh);var chl=(el&fl)^(~el&gl);var majh=(ah&bh)^(ah&ch)^(bh&ch);var majl=(al&bl)^(al&cl)^(bl&cl);var sigma0h=((ah>>>28)|(al<<4))^((ah<<30)|(al>>>2))^((ah<<25)|(al>>>7));var sigma0l=((al>>>28)|(ah<<4))^((al<<30)|(ah>>>2))^((al<<25)|(ah>>>7));var sigma1h=((eh>>>14)|(el<<18))^((eh>>>18)|(el<<14))^((eh<<23)|(el>>>9));var sigma1l=((el>>>14)|(eh<<18))^((el>>>18)|(eh<<14))^((el<<23)|(eh>>>9));var Ki=K[i];var Kih=Ki.high;var Kil=Ki.low;var t1l=hl+sigma1l;var t1h=hh+sigma1h+((t1l>>>0)<(hl>>>0)?1:0);var t1l=t1l+chl;var t1h=t1h+chh+((t1l>>>0)<(chl>>>0)?1:0);var t1l=t1l+Kil;var t1h=t1h+Kih+((t1l>>>0)<(Kil>>>0)?1:0);var t1l=t1l+Wil;var t1h=t1h+Wih+((t1l>>>0)<(Wil>>>0)?1:0);var t2l=sigma0l+majl;var t2h=sigma0h+majh+((t2l>>>0)<(sigma0l>>>0)?1:0);hh=gh;hl=gl;gh=fh;gl=fl;fh=eh;fl=el;el=(dl+t1l)|0;eh=(dh+t1h+((el>>>0)<(dl>>>0)?1:0))|0;dh=ch;dl=cl;ch=bh;cl=bl;bh=ah;bl=al;al=(t1l+t2l)|0;ah=(t1h+t2h+((al>>>0)<(t1l>>>0)?1:0))|0;}
H0l=H0.low=(H0l+al);H0.high=(H0h+ah+((H0l>>>0)<(al>>>0)?1:0));H1l=H1.low=(H1l+bl);H1.high=(H1h+bh+((H1l>>>0)<(bl>>>0)?1:0));H2l=H2.low=(H2l+cl);H2.high=(H2h+ch+((H2l>>>0)<(cl>>>0)?1:0));H3l=H3.low=(H3l+dl);H3.high=(H3h+dh+((H3l>>>0)<(dl>>>0)?1:0));H4l=H4.low=(H4l+el);H4.high=(H4h+eh+((H4l>>>0)<(el>>>0)?1:0));H5l=H5.low=(H5l+fl);H5.high=(H5h+fh+((H5l>>>0)<(fl>>>0)?1:0));H6l=H6.low=(H6l+gl);H6.high=(H6h+gh+((H6l>>>0)<(gl>>>0)?1:0));H7l=H7.low=(H7l+hl);H7.high=(H7h+hh+((H7l>>>0)<(hl>>>0)?1:0));},_doFinalize:function(){var data=this._data;var dataWords=data.words;var nBitsTotal=this._nDataBytes*8;var nBitsLeft=data.sigBytes*8;dataWords[nBitsLeft>>>5]|=0x80<<(24-nBitsLeft%32);dataWords[(((nBitsLeft+128)>>>10)<<5)+30]=Math.floor(nBitsTotal/0x100000000);dataWords[(((nBitsLeft+128)>>>10)<<5)+31]=nBitsTotal;data.sigBytes=dataWords.length*4;this._process();var hash=this._hash.toX32();return hash;},clone:function(){var clone=Hasher.clone.call(this);clone._hash=this._hash.clone();return clone;},blockSize:1024/32});C.SHA512=Hasher._createHelper(SHA512);C.HmacSHA512=Hasher._createHmacHelper(SHA512);}());return CryptoJS.SHA512;}));}),(function(module,exports,__webpack_require__){var utils=__webpack_require__(2);var SolidityParam=function(value,offset){this.value=value||'';this.offset=offset;};SolidityParam.prototype.dynamicPartLength=function(){return this.dynamicPart().length/2;};SolidityParam.prototype.withOffset=function(offset){return new SolidityParam(this.value,offset);};SolidityParam.prototype.combine=function(param){return new SolidityParam(this.value+param.value);};SolidityParam.prototype.isDynamic=function(){return this.offset!==undefined;};SolidityParam.prototype.offsetAsBytes=function(){return!this.isDynamic()?'':utils.padLeft(utils.toTwosComplement(this.offset).toString(16),64);};SolidityParam.prototype.staticPart=function(){if(!this.isDynamic()){return this.value;}
return this.offsetAsBytes();};SolidityParam.prototype.dynamicPart=function(){return this.isDynamic()?this.value:'';};SolidityParam.prototype.encode=function(){return this.staticPart()+this.dynamicPart();};SolidityParam.encodeList=function(params){var totalOffset=params.length*32;var offsetParams=params.map(function(param){if(!param.isDynamic()){return param;}
var offset=totalOffset;totalOffset+=param.dynamicPartLength();return param.withOffset(offset);});return offsetParams.reduce(function(result,param){return result+param.dynamicPart();},offsetParams.reduce(function(result,param){return result+param.staticPart();},''));};module.exports=SolidityParam;}),(function(module,exports,__webpack_require__){var utils=__webpack_require__(2);var coder=__webpack_require__(51);var formatters=__webpack_require__(9);var sha3=__webpack_require__(24);var Filter=__webpack_require__(35);var watches=__webpack_require__(37);var SolidityEvent=function(requestManager,json,address){this._requestManager=requestManager;this._params=json.inputs;this._name=utils.transformToFullName(json);this._address=address;this._anonymous=json.anonymous;};SolidityEvent.prototype.types=function(indexed){return this._params.filter(function(i){return i.indexed===indexed;}).map(function(i){return i.type;});};SolidityEvent.prototype.displayName=function(){return utils.extractDisplayName(this._name);};SolidityEvent.prototype.typeName=function(){return utils.extractTypeName(this._name);};SolidityEvent.prototype.signature=function(){return sha3(this._name);};SolidityEvent.prototype.encode=function(indexed,options){indexed=indexed||{};options=options||{};var result={};['fromBlock','toBlock'].filter(function(f){return options[f]!==undefined;}).forEach(function(f){result[f]=formatters.inputBlockNumberFormatter(options[f]);});result.topics=[];result.address=this._address;if(!this._anonymous){result.topics.push('0x'+this.signature());}
var indexedTopics=this._params.filter(function(i){return i.indexed===true;}).map(function(i){var value=indexed[i.name];if(value===undefined||value===null){return null;}
if(utils.isArray(value)){return value.map(function(v){return'0x'+coder.encodeParam(i.type,v);});}
return'0x'+coder.encodeParam(i.type,value);});result.topics=result.topics.concat(indexedTopics);return result;};SolidityEvent.prototype.decode=function(data){data.data=data.data||'';data.topics=data.topics||[];var argTopics=this._anonymous?data.topics:data.topics.slice(1);var indexedData=argTopics.map(function(topics){return topics.slice(2);}).join("");var indexedParams=coder.decodeParams(this.types(true),indexedData);var notIndexedData=data.data.slice(2);var notIndexedParams=coder.decodeParams(this.types(false),notIndexedData);var result=formatters.outputLogFormatter(data);result.event=this.displayName();result.address=data.address;result.args=this._params.reduce(function(acc,current){acc[current.name]=current.indexed?indexedParams.shift():notIndexedParams.shift();return acc;},{});delete result.data;delete result.topics;return result;};SolidityEvent.prototype.execute=function(indexed,options,callback){if(utils.isFunction(arguments[arguments.length-1])){callback=arguments[arguments.length-1];if(arguments.length===2)
options=null;if(arguments.length===1){options=null;indexed={};}}
var o=this.encode(indexed,options);var formatter=this.decode.bind(this);return new Filter(this._requestManager,o,watches.eth(),formatter,callback);};SolidityEvent.prototype.attachToContract=function(contract){var execute=this.execute.bind(this);var displayName=this.displayName();if(!contract[displayName]){contract[displayName]=execute;}
contract[displayName][this.typeName()]=this.execute.bind(this,contract);};module.exports=SolidityEvent;}),(function(module,exports){var Jsonrpc={messageId:0};Jsonrpc.toPayload=function(method,params){if(!method)
console.error('jsonrpc method should be specified!');Jsonrpc.messageId++;return{jsonrpc:'2.0',id:Jsonrpc.messageId,method:method,params:params||[]};};Jsonrpc.isValidResponse=function(response){return Array.isArray(response)?response.every(validateSingleMessage):validateSingleMessage(response);function validateSingleMessage(message){return!!message&&!message.error&&message.jsonrpc==='2.0'&&typeof message.id==='number'&&message.result!==undefined;}};Jsonrpc.toBatchPayload=function(messages){return messages.map(function(message){return Jsonrpc.toPayload(message.method,message.params);});};module.exports=Jsonrpc;}),(function(module,exports,__webpack_require__){;(function(root,factory){if(true){module.exports=exports=factory();}
else if(typeof define==="function"&&define.amd){define([],factory);}
else{root.CryptoJS=factory();}}(this,function(){var CryptoJS=CryptoJS||(function(Math,undefined){var create=Object.create||(function(){function F(){};return function(obj){var subtype;F.prototype=obj;subtype=new F();F.prototype=null;return subtype;};}())
var C={};var C_lib=C.lib={};var Base=C_lib.Base=(function(){return{extend:function(overrides){var subtype=create(this);if(overrides){subtype.mixIn(overrides);}
if(!subtype.hasOwnProperty('init')||this.init===subtype.init){subtype.init=function(){subtype.$super.init.apply(this,arguments);};}
subtype.init.prototype=subtype;subtype.$super=this;return subtype;},create:function(){var instance=this.extend();instance.init.apply(instance,arguments);return instance;},init:function(){},mixIn:function(properties){for(var propertyName in properties){if(properties.hasOwnProperty(propertyName)){this[propertyName]=properties[propertyName];}}
if(properties.hasOwnProperty('toString')){this.toString=properties.toString;}},clone:function(){return this.init.prototype.extend(this);}};}());var WordArray=C_lib.WordArray=Base.extend({init:function(words,sigBytes){words=this.words=words||[];if(sigBytes!=undefined){this.sigBytes=sigBytes;}else{this.sigBytes=words.length*4;}},toString:function(encoder){return(encoder||Hex).stringify(this);},concat:function(wordArray){var thisWords=this.words;var thatWords=wordArray.words;var thisSigBytes=this.sigBytes;var thatSigBytes=wordArray.sigBytes;this.clamp();if(thisSigBytes%4){for(var i=0;i<thatSigBytes;i++){var thatByte=(thatWords[i>>>2]>>>(24-(i%4)*8))&0xff;thisWords[(thisSigBytes+i)>>>2]|=thatByte<<(24-((thisSigBytes+i)%4)*8);}}else{for(var i=0;i<thatSigBytes;i+=4){thisWords[(thisSigBytes+i)>>>2]=thatWords[i>>>2];}}
this.sigBytes+=thatSigBytes;return this;},clamp:function(){var words=this.words;var sigBytes=this.sigBytes;words[sigBytes>>>2]&=0xffffffff<<(32-(sigBytes%4)*8);words.length=Math.ceil(sigBytes/4);},clone:function(){var clone=Base.clone.call(this);clone.words=this.words.slice(0);return clone;},random:function(nBytes){var words=[];var r=(function(m_w){var m_w=m_w;var m_z=0x3ade68b1;var mask=0xffffffff;return function(){m_z=(0x9069*(m_z&0xFFFF)+(m_z>>0x10))&mask;m_w=(0x4650*(m_w&0xFFFF)+(m_w>>0x10))&mask;var result=((m_z<<0x10)+m_w)&mask;result/=0x100000000;result+=0.5;return result*(Math.random()>.5?1:-1);}});for(var i=0,rcache;i<nBytes;i+=4){var _r=r((rcache||Math.random())*0x100000000);rcache=_r()*0x3ade67b7;words.push((_r()*0x100000000)|0);}
return new WordArray.init(words,nBytes);}});var C_enc=C.enc={};var Hex=C_enc.Hex={stringify:function(wordArray){var words=wordArray.words;var sigBytes=wordArray.sigBytes;var hexChars=[];for(var i=0;i<sigBytes;i++){var bite=(words[i>>>2]>>>(24-(i%4)*8))&0xff;hexChars.push((bite>>>4).toString(16));hexChars.push((bite&0x0f).toString(16));}
return hexChars.join('');},parse:function(hexStr){var hexStrLength=hexStr.length;var words=[];for(var i=0;i<hexStrLength;i+=2){words[i>>>3]|=parseInt(hexStr.substr(i,2),16)<<(24-(i%8)*4);}
return new WordArray.init(words,hexStrLength/2);}};var Latin1=C_enc.Latin1={stringify:function(wordArray){var words=wordArray.words;var sigBytes=wordArray.sigBytes;var latin1Chars=[];for(var i=0;i<sigBytes;i++){var bite=(words[i>>>2]>>>(24-(i%4)*8))&0xff;latin1Chars.push(String.fromCharCode(bite));}
return latin1Chars.join('');},parse:function(latin1Str){var latin1StrLength=latin1Str.length;var words=[];for(var i=0;i<latin1StrLength;i++){words[i>>>2]|=(latin1Str.charCodeAt(i)&0xff)<<(24-(i%4)*8);}
return new WordArray.init(words,latin1StrLength);}};var Utf8=C_enc.Utf8={stringify:function(wordArray){try{return decodeURIComponent(escape(Latin1.stringify(wordArray)));}catch(e){throw new Error('Malformed UTF-8 data');}},parse:function(utf8Str){return Latin1.parse(unescape(encodeURIComponent(utf8Str)));}};var BufferedBlockAlgorithm=C_lib.BufferedBlockAlgorithm=Base.extend({reset:function(){this._data=new WordArray.init();this._nDataBytes=0;},_append:function(data){if(typeof data=='string'){data=Utf8.parse(data);}
this._data.concat(data);this._nDataBytes+=data.sigBytes;},_process:function(doFlush){var data=this._data;var dataWords=data.words;var dataSigBytes=data.sigBytes;var blockSize=this.blockSize;var blockSizeBytes=blockSize*4;var nBlocksReady=dataSigBytes/blockSizeBytes;if(doFlush){nBlocksReady=Math.ceil(nBlocksReady);}else{nBlocksReady=Math.max((nBlocksReady|0)-this._minBufferSize,0);}
var nWordsReady=nBlocksReady*blockSize;var nBytesReady=Math.min(nWordsReady*4,dataSigBytes);if(nWordsReady){for(var offset=0;offset<nWordsReady;offset+=blockSize){this._doProcessBlock(dataWords,offset);}
var processedWords=dataWords.splice(0,nWordsReady);data.sigBytes-=nBytesReady;}
return new WordArray.init(processedWords,nBytesReady);},clone:function(){var clone=Base.clone.call(this);clone._data=this._data.clone();return clone;},_minBufferSize:0});var Hasher=C_lib.Hasher=BufferedBlockAlgorithm.extend({cfg:Base.extend(),init:function(cfg){this.cfg=this.cfg.extend(cfg);this.reset();},reset:function(){BufferedBlockAlgorithm.reset.call(this);this._doReset();},update:function(messageUpdate){this._append(messageUpdate);this._process();return this;},finalize:function(messageUpdate){if(messageUpdate){this._append(messageUpdate);}
var hash=this._doFinalize();return hash;},blockSize:512/32,_createHelper:function(hasher){return function(message,cfg){return new hasher.init(cfg).finalize(message);};},_createHmacHelper:function(hasher){return function(message,key){return new C_algo.HMAC.init(hasher,key).finalize(message);};}});var C_algo=C.algo={};return C;}(Math));return CryptoJS;}));}),(function(module,exports,__webpack_require__){var utils=__webpack_require__(3);var SolidityParam=function(value,offset){this.value=value||'';this.offset=offset;};SolidityParam.prototype.dynamicPartLength=function(){return this.dynamicPart().length/2;};SolidityParam.prototype.withOffset=function(offset){return new SolidityParam(this.value,offset);};SolidityParam.prototype.combine=function(param){return new SolidityParam(this.value+param.value);};SolidityParam.prototype.isDynamic=function(){return this.offset!==undefined;};SolidityParam.prototype.offsetAsBytes=function(){return!this.isDynamic()?'':utils.padLeft(utils.toTwosComplement(this.offset).toString(16),64);};SolidityParam.prototype.staticPart=function(){if(!this.isDynamic()){return this.value;}
return this.offsetAsBytes();};SolidityParam.prototype.dynamicPart=function(){return this.isDynamic()?this.value:'';};SolidityParam.prototype.encode=function(){return this.staticPart()+this.dynamicPart();};SolidityParam.encodeList=function(params){var totalOffset=params.length*32;var offsetParams=params.map(function(param){if(!param.isDynamic()){return param;}
var offset=totalOffset;totalOffset+=param.dynamicPartLength();return param.withOffset(offset);});return offsetParams.reduce(function(result,param){return result+param.dynamicPart();},offsetParams.reduce(function(result,param){return result+param.staticPart();},''));};module.exports=SolidityParam;}),(function(module,exports,__webpack_require__){var utils=__webpack_require__(3);var coder=__webpack_require__(52);var formatters=__webpack_require__(11);var sha3=__webpack_require__(26);var Filter=__webpack_require__(40);var watches=__webpack_require__(42);var SolidityEvent=function(requestManager,json,address){this._requestManager=requestManager;this._params=json.inputs;this._name=utils.transformToFullName(json);this._address=address;this._anonymous=json.anonymous;};SolidityEvent.prototype.types=function(indexed){return this._params.filter(function(i){return i.indexed===indexed;}).map(function(i){return i.type;});};SolidityEvent.prototype.displayName=function(){return utils.extractDisplayName(this._name);};SolidityEvent.prototype.typeName=function(){return utils.extractTypeName(this._name);};SolidityEvent.prototype.signature=function(){return sha3(this._name);};SolidityEvent.prototype.encode=function(indexed,options){indexed=indexed||{};options=options||{};var result={};['fromBlock','toBlock'].filter(function(f){return options[f]!==undefined;}).forEach(function(f){result[f]=formatters.inputBlockNumberFormatter(options[f]);});result.topics=[];result.address=this._address;if(!this._anonymous){result.topics.push('0x'+this.signature());}
var indexedTopics=this._params.filter(function(i){return i.indexed===true;}).map(function(i){var value=indexed[i.name];if(value===undefined||value===null){return null;}
if(utils.isArray(value)){return value.map(function(v){return'0x'+coder.encodeParam(i.type,v);});}
return'0x'+coder.encodeParam(i.type,value);});result.topics=result.topics.concat(indexedTopics);return result;};SolidityEvent.prototype.decode=function(data){data.data=data.data||'';data.topics=data.topics||[];var argTopics=this._anonymous?data.topics:data.topics.slice(1);var indexedData=argTopics.map(function(topics){return topics.slice(2);}).join("");var indexedParams=coder.decodeParams(this.types(true),indexedData);var notIndexedData=data.data.slice(2);var notIndexedParams=coder.decodeParams(this.types(false),notIndexedData);var result=formatters.outputLogFormatter(data);result.event=this.displayName();result.address=data.address;result.args=this._params.reduce(function(acc,current){acc[current.name]=current.indexed?indexedParams.shift():notIndexedParams.shift();return acc;},{});delete result.data;delete result.topics;return result;};SolidityEvent.prototype.execute=function(indexed,options,callback){if(utils.isFunction(arguments[arguments.length-1])){callback=arguments[arguments.length-1];if(arguments.length===2)
options=null;if(arguments.length===1){options=null;indexed={};}}
var o=this.encode(indexed,options);var formatter=this.decode.bind(this);return new Filter(this._requestManager,o,watches.eth(),formatter,callback);};SolidityEvent.prototype.attachToContract=function(contract){var execute=this.execute.bind(this);var displayName=this.displayName();if(!contract[displayName]){contract[displayName]=execute;}
contract[displayName][this.typeName()]=this.execute.bind(this,contract);};module.exports=SolidityEvent;}),(function(module,exports){var Jsonrpc=function(){if(arguments.callee._singletonInstance){return arguments.callee._singletonInstance;}
arguments.callee._singletonInstance=this;this.messageId=1;};Jsonrpc.getInstance=function(){var instance=new Jsonrpc();return instance;};Jsonrpc.prototype.toPayload=function(method,params){if(!method)
console.error('jsonrpc method should be specified!');return{jsonrpc:'2.0',method:method,params:params||[],id:this.messageId++};};Jsonrpc.prototype.isValidResponse=function(response){return!!response&&!response.error&&response.jsonrpc==='2.0'&&typeof response.id==='number'&&response.result!==undefined;};Jsonrpc.prototype.toBatchPayload=function(messages){var self=this;return messages.map(function(message){return self.toPayload(message.method,message.params);});};module.exports=Jsonrpc;}),(function(module,exports,__webpack_require__){var utils=__webpack_require__(4);var SolidityParam=function(value,offset){this.value=value||'';this.offset=offset;};SolidityParam.prototype.dynamicPartLength=function(){return this.dynamicPart().length/2;};SolidityParam.prototype.withOffset=function(offset){return new SolidityParam(this.value,offset);};SolidityParam.prototype.combine=function(param){return new SolidityParam(this.value+param.value);};SolidityParam.prototype.isDynamic=function(){return this.offset!==undefined;};SolidityParam.prototype.offsetAsBytes=function(){return!this.isDynamic()?'':utils.padLeft(utils.toTwosComplement(this.offset).toString(16),64);};SolidityParam.prototype.staticPart=function(){if(!this.isDynamic()){return this.value;}
return this.offsetAsBytes();};SolidityParam.prototype.dynamicPart=function(){return this.isDynamic()?this.value:'';};SolidityParam.prototype.encode=function(){return this.staticPart()+this.dynamicPart();};SolidityParam.encodeList=function(params){var totalOffset=params.length*32;var offsetParams=params.map(function(param){if(!param.isDynamic()){return param;}
var offset=totalOffset;totalOffset+=param.dynamicPartLength();return param.withOffset(offset);});return offsetParams.reduce(function(result,param){return result+param.dynamicPart();},offsetParams.reduce(function(result,param){return result+param.staticPart();},''));};module.exports=SolidityParam;}),(function(module,exports,__webpack_require__){var utils=__webpack_require__(4);var coder=__webpack_require__(54);var formatters=__webpack_require__(13);var sha3=__webpack_require__(29);var Filter=__webpack_require__(44);var watches=__webpack_require__(46);var SolidityEvent=function(requestManager,json,address){this._requestManager=requestManager;this._params=json.inputs;this._name=utils.transformToFullName(json);this._address=address;this._anonymous=json.anonymous;};SolidityEvent.prototype.types=function(indexed){return this._params.filter(function(i){return i.indexed===indexed;}).map(function(i){return i.type;});};SolidityEvent.prototype.displayName=function(){return utils.extractDisplayName(this._name);};SolidityEvent.prototype.typeName=function(){return utils.extractTypeName(this._name);};SolidityEvent.prototype.signature=function(){return sha3(this._name);};SolidityEvent.prototype.encode=function(indexed,options){indexed=indexed||{};options=options||{};var result={};['fromBlock','toBlock'].filter(function(f){return options[f]!==undefined;}).forEach(function(f){result[f]=formatters.inputBlockNumberFormatter(options[f]);});result.topics=[];result.address=this._address;if(!this._anonymous){result.topics.push('0x'+this.signature());}
var indexedTopics=this._params.filter(function(i){return i.indexed===true;}).map(function(i){var value=indexed[i.name];if(value===undefined||value===null){return null;}
if(utils.isArray(value)){return value.map(function(v){return'0x'+coder.encodeParam(i.type,v);});}
return'0x'+coder.encodeParam(i.type,value);});result.topics=result.topics.concat(indexedTopics);return result;};SolidityEvent.prototype.decode=function(data){data.data=data.data||'';data.topics=data.topics||[];var argTopics=this._anonymous?data.topics:data.topics.slice(1);var indexedData=argTopics.map(function(topics){return topics.slice(2);}).join("");var indexedParams=coder.decodeParams(this.types(true),indexedData);var notIndexedData=data.data.slice(2);var notIndexedParams=coder.decodeParams(this.types(false),notIndexedData);var result=formatters.outputLogFormatter(data);result.event=this.displayName();result.address=data.address;result.args=this._params.reduce(function(acc,current){acc[current.name]=current.indexed?indexedParams.shift():notIndexedParams.shift();return acc;},{});delete result.data;delete result.topics;return result;};SolidityEvent.prototype.execute=function(indexed,options,callback){if(utils.isFunction(arguments[arguments.length-1])){callback=arguments[arguments.length-1];if(arguments.length===2)
options=null;if(arguments.length===1){options=null;indexed={};}}
var o=this.encode(indexed,options);var formatter=this.decode.bind(this);return new Filter(o,'eth',this._requestManager,watches.eth(),formatter,callback);};SolidityEvent.prototype.attachToContract=function(contract){var execute=this.execute.bind(this);var displayName=this.displayName();if(!contract[displayName]){contract[displayName]=execute;}
contract[displayName][this.typeName()]=this.execute.bind(this,contract);};module.exports=SolidityEvent;}),(function(module,exports){var Jsonrpc={messageId:0};Jsonrpc.toPayload=function(method,params){if(!method)
console.error('jsonrpc method should be specified!');Jsonrpc.messageId++;return{jsonrpc:'2.0',id:Jsonrpc.messageId,method:method,params:params||[]};};Jsonrpc.isValidResponse=function(response){return Array.isArray(response)?response.every(validateSingleMessage):validateSingleMessage(response);function validateSingleMessage(message){return!!message&&!message.error&&message.jsonrpc==='2.0'&&typeof message.id==='number'&&message.result!==undefined;}};Jsonrpc.toBatchPayload=function(messages){return messages.map(function(message){return Jsonrpc.toPayload(message.method,message.params);});};module.exports=Jsonrpc;}),(function(module,exports){module.exports=XMLHttpRequest;}),(function(module,exports)
{module.exports=

{
  "contractName": "CSBD",
  "abi": [
    {
      "constant": true,
      "inputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "CEDStructArray",
      "outputs": [
        {
          "name": "id",
          "type": "uint256"
        },
        {
          "name": "cid",
          "type": "string"
        },
        {
          "name": "fullname",
          "type": "string"
        },
        {
          "name": "coursename",
          "type": "string"
        },
        {
          "name": "issuedOn",
          "type": "string"
        },
        {
          "name": "validUntil",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "owner",
      "outputs": [
        {
          "name": "",
          "type": "address"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "CED",
      "outputs": [
        {
          "name": "id",
          "type": "uint256"
        },
        {
          "name": "cid",
          "type": "string"
        },
        {
          "name": "fullname",
          "type": "string"
        },
        {
          "name": "coursename",
          "type": "string"
        },
        {
          "name": "issuedOn",
          "type": "string"
        },
        {
          "name": "validUntil",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "transferOwnership",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "CEDID",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "previousOwner",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "newOwner",
          "type": "address"
        }
      ],
      "name": "OwnershipTransferred",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_cid",
          "type": "string"
        },
        {
          "name": "_fullname",
          "type": "string"
        },
        {
          "name": "_coursename",
          "type": "string"
        },
        {
          "name": "_issuedOn",
          "type": "string"
        },
        {
          "name": "_validUntil",
          "type": "string"
        }
      ],
      "name": "setCED",
      "outputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "i",
          "type": "uint256"
        }
      ],
      "name": "getCEDStructByID",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        },
        {
          "name": "",
          "type": "string"
        },
        {
          "name": "",
          "type": "string"
        },
        {
          "name": "",
          "type": "string"
        },
        {
          "name": "",
          "type": "string"
        },
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_cid",
          "type": "string"
        }
      ],
      "name": "getCEDStructsByCID",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        },
        {
          "name": "",
          "type": "string"
        },
        {
          "name": "",
          "type": "string"
        },
        {
          "name": "",
          "type": "string"
        },
        {
          "name": "",
          "type": "string"
        },
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "countCEDStruct",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "getlastCED",
      "outputs": [
        {
          "name": "_id",
          "type": "uint256"
        },
        {
          "name": "_cid",
          "type": "string"
        },
        {
          "name": "_fullname",
          "type": "string"
        },
        {
          "name": "_coursename",
          "type": "string"
        },
        {
          "name": "_issuedOn",
          "type": "string"
        },
        {
          "name": "_validUntil",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ],
  "bytecode": "0x608060405260006008553480156200001657600080fd5b50336000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff160217905550606060405190810160405280602481526020017f436572746966696365642053656e696f7220426c6f636b636861696e2050726f81526020017f6772616d0000000000000000000000000000000000000000000000000000000081525060099080519060200190620000cb929190620000d2565b5062000181565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200011557805160ff191683800117855562000146565b8280016001018555821562000146579182015b828111156200014557825182559160200191906001019062000128565b5b50905062000155919062000159565b5090565b6200017e91905b808211156200017a57600081600090555060010162000160565b5090565b90565b61278180620001916000396000f3006080604052600436106100a4576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806304277446146100a957806330724d951461022a57806352f95c4c1461025557806362b2dd3e146104b25780638a4ec673146106f95780638da5cb5b14610956578063ca6060c3146109ad578063cbfd4bf014610c46578063f2fde38b14610e8d578063f30490b014610ed0575b600080fd5b3480156100b557600080fd5b50610228600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610efb565b005b34801561023657600080fd5b5061023f611101565b6040518082815260200191505060405180910390f35b34801561026157600080fd5b506102806004803603810190808035906020019092919050505061110e565b60405180878152602001806020018060200180602001806020018060200186810386528b818151815260200191508051906020019080838360005b838110156102d65780820151818401526020810190506102bb565b50505050905090810190601f1680156103035780820380516001836020036101000a031916815260200191505b5086810385528a818151815260200191508051906020019080838360005b8381101561033c578082015181840152602081019050610321565b50505050905090810190601f1680156103695780820380516001836020036101000a031916815260200191505b50868103845289818151815260200191508051906020019080838360005b838110156103a2578082015181840152602081019050610387565b50505050905090810190601f1680156103cf5780820380516001836020036101000a031916815260200191505b50868103835288818151815260200191508051906020019080838360005b838110156104085780820151818401526020810190506103ed565b50505050905090810190601f1680156104355780820380516001836020036101000a031916815260200191505b50868103825287818151815260200191508051906020019080838360005b8381101561046e578082015181840152602081019050610453565b50505050905090810190601f16801561049b5780820380516001836020036101000a031916815260200191505b509b50505050505050505050505060405180910390f35b3480156104be57600080fd5b506104c7611451565b60405180878152602001806020018060200180602001806020018060200186810386528b818151815260200191508051906020019080838360005b8381101561051d578082015181840152602081019050610502565b50505050905090810190601f16801561054a5780820380516001836020036101000a031916815260200191505b5086810385528a818151815260200191508051906020019080838360005b83811015610583578082015181840152602081019050610568565b50505050905090810190601f1680156105b05780820380516001836020036101000a031916815260200191505b50868103845289818151815260200191508051906020019080838360005b838110156105e95780820151818401526020810190506105ce565b50505050905090810190601f1680156106165780820380516001836020036101000a031916815260200191505b50868103835288818151815260200191508051906020019080838360005b8381101561064f578082015181840152602081019050610634565b50505050905090810190601f16801561067c5780820380516001836020036101000a031916815260200191505b50868103825287818151815260200191508051906020019080838360005b838110156106b557808201518184015260208101905061069a565b50505050905090810190601f1680156106e25780820380516001836020036101000a031916815260200191505b509b50505050505050505050505060405180910390f35b34801561070557600080fd5b5061072460048036038101908080359060200190929190505050611799565b60405180878152602001806020018060200180602001806020018060200186810386528b818151815260200191508051906020019080838360005b8381101561077a57808201518184015260208101905061075f565b50505050905090810190601f1680156107a75780820380516001836020036101000a031916815260200191505b5086810385528a818151815260200191508051906020019080838360005b838110156107e05780820151818401526020810190506107c5565b50505050905090810190601f16801561080d5780820380516001836020036101000a031916815260200191505b50868103845289818151815260200191508051906020019080838360005b8381101561084657808201518184015260208101905061082b565b50505050905090810190601f1680156108735780820380516001836020036101000a031916815260200191505b50868103835288818151815260200191508051906020019080838360005b838110156108ac578082015181840152602081019050610891565b50505050905090810190601f1680156108d95780820380516001836020036101000a031916815260200191505b50868103825287818151815260200191508051906020019080838360005b838110156109125780820151818401526020810190506108f7565b50505050905090810190601f16801561093f5780820380516001836020036101000a031916815260200191505b509b50505050505050505050505060405180910390f35b34801561096257600080fd5b5061096b611b9e565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156109b957600080fd5b50610a14600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050611bc3565b60405180878152602001806020018060200180602001806020018060200186810386528b818151815260200191508051906020019080838360005b83811015610a6a578082015181840152602081019050610a4f565b50505050905090810190601f168015610a975780820380516001836020036101000a031916815260200191505b5086810385528a818151815260200191508051906020019080838360005b83811015610ad0578082015181840152602081019050610ab5565b50505050905090810190601f168015610afd5780820380516001836020036101000a031916815260200191505b50868103845289818151815260200191508051906020019080838360005b83811015610b36578082015181840152602081019050610b1b565b50505050905090810190601f168015610b635780820380516001836020036101000a031916815260200191505b50868103835288818151815260200191508051906020019080838360005b83811015610b9c578082015181840152602081019050610b81565b50505050905090810190601f168015610bc95780820380516001836020036101000a031916815260200191505b50868103825287818151815260200191508051906020019080838360005b83811015610c02578082015181840152602081019050610be7565b50505050905090810190601f168015610c2f5780820380516001836020036101000a031916815260200191505b509b50505050505050505050505060405180910390f35b348015610c5257600080fd5b50610c5b6121ac565b60405180878152602001806020018060200180602001806020018060200186810386528b818151815260200191508051906020019080838360005b83811015610cb1578082015181840152602081019050610c96565b50505050905090810190601f168015610cde5780820380516001836020036101000a031916815260200191505b5086810385528a818151815260200191508051906020019080838360005b83811015610d17578082015181840152602081019050610cfc565b50505050905090810190601f168015610d445780820380516001836020036101000a031916815260200191505b50868103845289818151815260200191508051906020019080838360005b83811015610d7d578082015181840152602081019050610d62565b50505050905090810190601f168015610daa5780820380516001836020036101000a031916815260200191505b50868103835288818151815260200191508051906020019080838360005b83811015610de3578082015181840152602081019050610dc8565b50505050905090810190601f168015610e105780820380516001836020036101000a031916815260200191505b50868103825287818151815260200191508051906020019080838360005b83811015610e49578082015181840152602081019050610e2e565b50505050905090810190601f168015610e765780820380516001836020036101000a031916815260200191505b509b50505050505050505050505060405180910390f35b348015610e9957600080fd5b50610ece600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506124ce565b005b348015610edc57600080fd5b50610ee5612623565b6040518082815260200191505060405180910390f35b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610f5657600080fd5b60016008600082825401925050819055506008546002600001819055508460026001019080519060200190610f8c929190612629565b5083600280019080519060200190610fa5929190612629565b508260026003019080519060200190610fbf929190612629565b508160026004019080519060200190610fd9929190612629565b508060026005019080519060200190610ff3929190612629565b5060018060029080600181540180825580915050906001820390600052602060002090600602016000909192909190915060008201548160000155600182018160010190805460018160011615610100020316600290046110559291906126a9565b506002820181600201908054600181600116156101000203166002900461107d9291906126a9565b50600382018160030190805460018160011615610100020316600290046110a59291906126a9565b50600482018160040190805460018160011615610100020316600290046110cd9291906126a9565b50600582018160050190805460018160011615610100020316600290046110f59291906126a9565b50505050505050505050565b6000600180549050905090565b60018181548110151561111d57fe5b9060005260206000209060060201600091509050806000015490806001018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156111cf5780601f106111a4576101008083540402835291602001916111cf565b820191906000526020600020905b8154815290600101906020018083116111b257829003601f168201915b505050505090806002018054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561126d5780601f106112425761010080835404028352916020019161126d565b820191906000526020600020905b81548152906001019060200180831161125057829003601f168201915b505050505090806003018054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561130b5780601f106112e05761010080835404028352916020019161130b565b820191906000526020600020905b8154815290600101906020018083116112ee57829003601f168201915b505050505090806004018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156113a95780601f1061137e576101008083540402835291602001916113a9565b820191906000526020600020905b81548152906001019060200180831161138c57829003601f168201915b505050505090806005018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156114475780601f1061141c57610100808354040283529160200191611447565b820191906000526020600020905b81548152906001019060200180831161142a57829003601f168201915b5050505050905086565b60006060806060806060600260000154600260010160028001600260030160026004016002600501848054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561150e5780601f106114e35761010080835404028352916020019161150e565b820191906000526020600020905b8154815290600101906020018083116114f157829003601f168201915b50505050509450838054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156115aa5780601f1061157f576101008083540402835291602001916115aa565b820191906000526020600020905b81548152906001019060200180831161158d57829003601f168201915b50505050509350828054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156116465780601f1061161b57610100808354040283529160200191611646565b820191906000526020600020905b81548152906001019060200180831161162957829003601f168201915b50505050509250818054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156116e25780601f106116b7576101008083540402835291602001916116e2565b820191906000526020600020905b8154815290600101906020018083116116c557829003601f168201915b50505050509150808054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561177e5780601f106117535761010080835404028352916020019161177e565b820191906000526020600020905b81548152906001019060200180831161176157829003601f168201915b50505050509050955095509550955095509550909192939495565b6000606080606080606060008711156117b7576001870396506117bc565b600096505b6001878154811015156117cb57fe5b9060005260206000209060060201600001546001888154811015156117ec57fe5b906000526020600020906006020160010160018981548110151561180c57fe5b906000526020600020906006020160020160018a81548110151561182c57fe5b906000526020600020906006020160030160018b81548110151561184c57fe5b906000526020600020906006020160040160018c81548110151561186c57fe5b9060005260206000209060060201600501848054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156119125780601f106118e757610100808354040283529160200191611912565b820191906000526020600020905b8154815290600101906020018083116118f557829003601f168201915b50505050509450838054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156119ae5780601f10611983576101008083540402835291602001916119ae565b820191906000526020600020905b81548152906001019060200180831161199157829003601f168201915b50505050509350828054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611a4a5780601f10611a1f57610100808354040283529160200191611a4a565b820191906000526020600020905b815481529060010190602001808311611a2d57829003601f168201915b50505050509250818054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611ae65780601f10611abb57610100808354040283529160200191611ae6565b820191906000526020600020905b815481529060010190602001808311611ac957829003601f168201915b50505050509150808054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611b825780601f10611b5757610100808354040283529160200191611b82565b820191906000526020600020905b815481529060010190602001808311611b6557829003601f168201915b5050505050905095509550955095509550955091939550919395565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060608060608060606000600180805490500390505b6000811015156121a157600181815481101515611bf357fe5b90600052602060002090600602016001016040516020018082805460018160011615610100020316600290048015611c625780601f10611c40576101008083540402835291820191611c62565b820191906000526020600020905b815481529060010190602001808311611c4e575b50509150506040516020818303038152906040526040518082805190602001908083835b602083101515611cab5780518252602082019150602081019050602083039250611c86565b6001836020036101000a038019825116818451168082178552505050505050905001915050604051809103902060001916886040516020018082805190602001908083835b602083101515611d155780518252602082019150602081019050602083039250611cf0565b6001836020036101000a0380198251168184511680821785525050505050509050019150506040516020818303038152906040526040518082805190602001908083835b602083101515611d7e5780518252602082019150602081019050602083039250611d59565b6001836020036101000a038019825116818451168082178552505050505050905001915050604051809103902060001916141561219357600181815481101515611dc457fe5b906000526020600020906006020160000154600182815481101515611de557fe5b9060005260206000209060060201600101600183815481101515611e0557fe5b9060005260206000209060060201600201600184815481101515611e2557fe5b9060005260206000209060060201600301600185815481101515611e4557fe5b9060005260206000209060060201600401600186815481101515611e6557fe5b9060005260206000209060060201600501848054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611f0b5780601f10611ee057610100808354040283529160200191611f0b565b820191906000526020600020905b815481529060010190602001808311611eee57829003601f168201915b50505050509450838054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611fa75780601f10611f7c57610100808354040283529160200191611fa7565b820191906000526020600020905b815481529060010190602001808311611f8a57829003601f168201915b50505050509350828054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156120435780601f1061201857610100808354040283529160200191612043565b820191906000526020600020905b81548152906001019060200180831161202657829003601f168201915b50505050509250818054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156120df5780601f106120b4576101008083540402835291602001916120df565b820191906000526020600020905b8154815290600101906020018083116120c257829003601f168201915b50505050509150808054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561217b5780601f106121505761010080835404028352916020019161217b565b820191906000526020600020905b81548152906001019060200180831161215e57829003601f168201915b505050505090509650965096509650965096506121a2565b808060019003915050611bda565b5b5091939550919395565b6002806000015490806001018054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561224c5780601f106122215761010080835404028352916020019161224c565b820191906000526020600020905b81548152906001019060200180831161222f57829003601f168201915b505050505090806002018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156122ea5780601f106122bf576101008083540402835291602001916122ea565b820191906000526020600020905b8154815290600101906020018083116122cd57829003601f168201915b505050505090806003018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156123885780601f1061235d57610100808354040283529160200191612388565b820191906000526020600020905b81548152906001019060200180831161236b57829003601f168201915b505050505090806004018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156124265780601f106123fb57610100808354040283529160200191612426565b820191906000526020600020905b81548152906001019060200180831161240957829003601f168201915b505050505090806005018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156124c45780601f10612499576101008083540402835291602001916124c4565b820191906000526020600020905b8154815290600101906020018083116124a757829003601f168201915b5050505050905086565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561252957600080fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415151561256557600080fd5b8073ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60085481565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061266a57805160ff1916838001178555612698565b82800160010185558215612698579182015b8281111561269757825182559160200191906001019061267c565b5b5090506126a59190612730565b5090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106126e2578054855561271f565b8280016001018555821561271f57600052602060002091601f016020900482015b8281111561271e578254825591600101919060010190612703565b5b50905061272c9190612730565b5090565b61275291905b8082111561274e576000816000905550600101612736565b5090565b905600a165627a7a723058205e555577321a1ae906337de0841c1da201b7b9bdc91f21332e3b01b66a39b9270029",
  "deployedBytecode": "0x6080604052600436106100a4576000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff16806304277446146100a957806330724d951461022a57806352f95c4c1461025557806362b2dd3e146104b25780638a4ec673146106f95780638da5cb5b14610956578063ca6060c3146109ad578063cbfd4bf014610c46578063f2fde38b14610e8d578063f30490b014610ed0575b600080fd5b3480156100b557600080fd5b50610228600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050610efb565b005b34801561023657600080fd5b5061023f611101565b6040518082815260200191505060405180910390f35b34801561026157600080fd5b506102806004803603810190808035906020019092919050505061110e565b60405180878152602001806020018060200180602001806020018060200186810386528b818151815260200191508051906020019080838360005b838110156102d65780820151818401526020810190506102bb565b50505050905090810190601f1680156103035780820380516001836020036101000a031916815260200191505b5086810385528a818151815260200191508051906020019080838360005b8381101561033c578082015181840152602081019050610321565b50505050905090810190601f1680156103695780820380516001836020036101000a031916815260200191505b50868103845289818151815260200191508051906020019080838360005b838110156103a2578082015181840152602081019050610387565b50505050905090810190601f1680156103cf5780820380516001836020036101000a031916815260200191505b50868103835288818151815260200191508051906020019080838360005b838110156104085780820151818401526020810190506103ed565b50505050905090810190601f1680156104355780820380516001836020036101000a031916815260200191505b50868103825287818151815260200191508051906020019080838360005b8381101561046e578082015181840152602081019050610453565b50505050905090810190601f16801561049b5780820380516001836020036101000a031916815260200191505b509b50505050505050505050505060405180910390f35b3480156104be57600080fd5b506104c7611451565b60405180878152602001806020018060200180602001806020018060200186810386528b818151815260200191508051906020019080838360005b8381101561051d578082015181840152602081019050610502565b50505050905090810190601f16801561054a5780820380516001836020036101000a031916815260200191505b5086810385528a818151815260200191508051906020019080838360005b83811015610583578082015181840152602081019050610568565b50505050905090810190601f1680156105b05780820380516001836020036101000a031916815260200191505b50868103845289818151815260200191508051906020019080838360005b838110156105e95780820151818401526020810190506105ce565b50505050905090810190601f1680156106165780820380516001836020036101000a031916815260200191505b50868103835288818151815260200191508051906020019080838360005b8381101561064f578082015181840152602081019050610634565b50505050905090810190601f16801561067c5780820380516001836020036101000a031916815260200191505b50868103825287818151815260200191508051906020019080838360005b838110156106b557808201518184015260208101905061069a565b50505050905090810190601f1680156106e25780820380516001836020036101000a031916815260200191505b509b50505050505050505050505060405180910390f35b34801561070557600080fd5b5061072460048036038101908080359060200190929190505050611799565b60405180878152602001806020018060200180602001806020018060200186810386528b818151815260200191508051906020019080838360005b8381101561077a57808201518184015260208101905061075f565b50505050905090810190601f1680156107a75780820380516001836020036101000a031916815260200191505b5086810385528a818151815260200191508051906020019080838360005b838110156107e05780820151818401526020810190506107c5565b50505050905090810190601f16801561080d5780820380516001836020036101000a031916815260200191505b50868103845289818151815260200191508051906020019080838360005b8381101561084657808201518184015260208101905061082b565b50505050905090810190601f1680156108735780820380516001836020036101000a031916815260200191505b50868103835288818151815260200191508051906020019080838360005b838110156108ac578082015181840152602081019050610891565b50505050905090810190601f1680156108d95780820380516001836020036101000a031916815260200191505b50868103825287818151815260200191508051906020019080838360005b838110156109125780820151818401526020810190506108f7565b50505050905090810190601f16801561093f5780820380516001836020036101000a031916815260200191505b509b50505050505050505050505060405180910390f35b34801561096257600080fd5b5061096b611b9e565b604051808273ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200191505060405180910390f35b3480156109b957600080fd5b50610a14600480360381019080803590602001908201803590602001908080601f0160208091040260200160405190810160405280939291908181526020018383808284378201915050505050509192919290505050611bc3565b60405180878152602001806020018060200180602001806020018060200186810386528b818151815260200191508051906020019080838360005b83811015610a6a578082015181840152602081019050610a4f565b50505050905090810190601f168015610a975780820380516001836020036101000a031916815260200191505b5086810385528a818151815260200191508051906020019080838360005b83811015610ad0578082015181840152602081019050610ab5565b50505050905090810190601f168015610afd5780820380516001836020036101000a031916815260200191505b50868103845289818151815260200191508051906020019080838360005b83811015610b36578082015181840152602081019050610b1b565b50505050905090810190601f168015610b635780820380516001836020036101000a031916815260200191505b50868103835288818151815260200191508051906020019080838360005b83811015610b9c578082015181840152602081019050610b81565b50505050905090810190601f168015610bc95780820380516001836020036101000a031916815260200191505b50868103825287818151815260200191508051906020019080838360005b83811015610c02578082015181840152602081019050610be7565b50505050905090810190601f168015610c2f5780820380516001836020036101000a031916815260200191505b509b50505050505050505050505060405180910390f35b348015610c5257600080fd5b50610c5b6121ac565b60405180878152602001806020018060200180602001806020018060200186810386528b818151815260200191508051906020019080838360005b83811015610cb1578082015181840152602081019050610c96565b50505050905090810190601f168015610cde5780820380516001836020036101000a031916815260200191505b5086810385528a818151815260200191508051906020019080838360005b83811015610d17578082015181840152602081019050610cfc565b50505050905090810190601f168015610d445780820380516001836020036101000a031916815260200191505b50868103845289818151815260200191508051906020019080838360005b83811015610d7d578082015181840152602081019050610d62565b50505050905090810190601f168015610daa5780820380516001836020036101000a031916815260200191505b50868103835288818151815260200191508051906020019080838360005b83811015610de3578082015181840152602081019050610dc8565b50505050905090810190601f168015610e105780820380516001836020036101000a031916815260200191505b50868103825287818151815260200191508051906020019080838360005b83811015610e49578082015181840152602081019050610e2e565b50505050905090810190601f168015610e765780820380516001836020036101000a031916815260200191505b509b50505050505050505050505060405180910390f35b348015610e9957600080fd5b50610ece600480360381019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506124ce565b005b348015610edc57600080fd5b50610ee5612623565b6040518082815260200191505060405180910390f35b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16141515610f5657600080fd5b60016008600082825401925050819055506008546002600001819055508460026001019080519060200190610f8c929190612629565b5083600280019080519060200190610fa5929190612629565b508260026003019080519060200190610fbf929190612629565b508160026004019080519060200190610fd9929190612629565b508060026005019080519060200190610ff3929190612629565b5060018060029080600181540180825580915050906001820390600052602060002090600602016000909192909190915060008201548160000155600182018160010190805460018160011615610100020316600290046110559291906126a9565b506002820181600201908054600181600116156101000203166002900461107d9291906126a9565b50600382018160030190805460018160011615610100020316600290046110a59291906126a9565b50600482018160040190805460018160011615610100020316600290046110cd9291906126a9565b50600582018160050190805460018160011615610100020316600290046110f59291906126a9565b50505050505050505050565b6000600180549050905090565b60018181548110151561111d57fe5b9060005260206000209060060201600091509050806000015490806001018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156111cf5780601f106111a4576101008083540402835291602001916111cf565b820191906000526020600020905b8154815290600101906020018083116111b257829003601f168201915b505050505090806002018054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561126d5780601f106112425761010080835404028352916020019161126d565b820191906000526020600020905b81548152906001019060200180831161125057829003601f168201915b505050505090806003018054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561130b5780601f106112e05761010080835404028352916020019161130b565b820191906000526020600020905b8154815290600101906020018083116112ee57829003601f168201915b505050505090806004018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156113a95780601f1061137e576101008083540402835291602001916113a9565b820191906000526020600020905b81548152906001019060200180831161138c57829003601f168201915b505050505090806005018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156114475780601f1061141c57610100808354040283529160200191611447565b820191906000526020600020905b81548152906001019060200180831161142a57829003601f168201915b5050505050905086565b60006060806060806060600260000154600260010160028001600260030160026004016002600501848054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561150e5780601f106114e35761010080835404028352916020019161150e565b820191906000526020600020905b8154815290600101906020018083116114f157829003601f168201915b50505050509450838054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156115aa5780601f1061157f576101008083540402835291602001916115aa565b820191906000526020600020905b81548152906001019060200180831161158d57829003601f168201915b50505050509350828054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156116465780601f1061161b57610100808354040283529160200191611646565b820191906000526020600020905b81548152906001019060200180831161162957829003601f168201915b50505050509250818054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156116e25780601f106116b7576101008083540402835291602001916116e2565b820191906000526020600020905b8154815290600101906020018083116116c557829003601f168201915b50505050509150808054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561177e5780601f106117535761010080835404028352916020019161177e565b820191906000526020600020905b81548152906001019060200180831161176157829003601f168201915b50505050509050955095509550955095509550909192939495565b6000606080606080606060008711156117b7576001870396506117bc565b600096505b6001878154811015156117cb57fe5b9060005260206000209060060201600001546001888154811015156117ec57fe5b906000526020600020906006020160010160018981548110151561180c57fe5b906000526020600020906006020160020160018a81548110151561182c57fe5b906000526020600020906006020160030160018b81548110151561184c57fe5b906000526020600020906006020160040160018c81548110151561186c57fe5b9060005260206000209060060201600501848054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156119125780601f106118e757610100808354040283529160200191611912565b820191906000526020600020905b8154815290600101906020018083116118f557829003601f168201915b50505050509450838054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156119ae5780601f10611983576101008083540402835291602001916119ae565b820191906000526020600020905b81548152906001019060200180831161199157829003601f168201915b50505050509350828054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611a4a5780601f10611a1f57610100808354040283529160200191611a4a565b820191906000526020600020905b815481529060010190602001808311611a2d57829003601f168201915b50505050509250818054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611ae65780601f10611abb57610100808354040283529160200191611ae6565b820191906000526020600020905b815481529060010190602001808311611ac957829003601f168201915b50505050509150808054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611b825780601f10611b5757610100808354040283529160200191611b82565b820191906000526020600020905b815481529060010190602001808311611b6557829003601f168201915b5050505050905095509550955095509550955091939550919395565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1681565b600060608060608060606000600180805490500390505b6000811015156121a157600181815481101515611bf357fe5b90600052602060002090600602016001016040516020018082805460018160011615610100020316600290048015611c625780601f10611c40576101008083540402835291820191611c62565b820191906000526020600020905b815481529060010190602001808311611c4e575b50509150506040516020818303038152906040526040518082805190602001908083835b602083101515611cab5780518252602082019150602081019050602083039250611c86565b6001836020036101000a038019825116818451168082178552505050505050905001915050604051809103902060001916886040516020018082805190602001908083835b602083101515611d155780518252602082019150602081019050602083039250611cf0565b6001836020036101000a0380198251168184511680821785525050505050509050019150506040516020818303038152906040526040518082805190602001908083835b602083101515611d7e5780518252602082019150602081019050602083039250611d59565b6001836020036101000a038019825116818451168082178552505050505050905001915050604051809103902060001916141561219357600181815481101515611dc457fe5b906000526020600020906006020160000154600182815481101515611de557fe5b9060005260206000209060060201600101600183815481101515611e0557fe5b9060005260206000209060060201600201600184815481101515611e2557fe5b9060005260206000209060060201600301600185815481101515611e4557fe5b9060005260206000209060060201600401600186815481101515611e6557fe5b9060005260206000209060060201600501848054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611f0b5780601f10611ee057610100808354040283529160200191611f0b565b820191906000526020600020905b815481529060010190602001808311611eee57829003601f168201915b50505050509450838054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015611fa75780601f10611f7c57610100808354040283529160200191611fa7565b820191906000526020600020905b815481529060010190602001808311611f8a57829003601f168201915b50505050509350828054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156120435780601f1061201857610100808354040283529160200191612043565b820191906000526020600020905b81548152906001019060200180831161202657829003601f168201915b50505050509250818054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156120df5780601f106120b4576101008083540402835291602001916120df565b820191906000526020600020905b8154815290600101906020018083116120c257829003601f168201915b50505050509150808054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561217b5780601f106121505761010080835404028352916020019161217b565b820191906000526020600020905b81548152906001019060200180831161215e57829003601f168201915b505050505090509650965096509650965096506121a2565b808060019003915050611bda565b5b5091939550919395565b6002806000015490806001018054600181600116156101000203166002900480601f01602080910402602001604051908101604052809291908181526020018280546001816001161561010002031660029004801561224c5780601f106122215761010080835404028352916020019161224c565b820191906000526020600020905b81548152906001019060200180831161222f57829003601f168201915b505050505090806002018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156122ea5780601f106122bf576101008083540402835291602001916122ea565b820191906000526020600020905b8154815290600101906020018083116122cd57829003601f168201915b505050505090806003018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156123885780601f1061235d57610100808354040283529160200191612388565b820191906000526020600020905b81548152906001019060200180831161236b57829003601f168201915b505050505090806004018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156124265780601f106123fb57610100808354040283529160200191612426565b820191906000526020600020905b81548152906001019060200180831161240957829003601f168201915b505050505090806005018054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156124c45780601f10612499576101008083540402835291602001916124c4565b820191906000526020600020905b8154815290600101906020018083116124a757829003601f168201915b5050505050905086565b6000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614151561252957600080fd5b600073ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff161415151561256557600080fd5b8073ffffffffffffffffffffffffffffffffffffffff166000809054906101000a900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff167f8be0079c531659141344cd1fd0a4f28419497f9722a3daafe3b4186f6b6457e060405160405180910390a3806000806101000a81548173ffffffffffffffffffffffffffffffffffffffff021916908373ffffffffffffffffffffffffffffffffffffffff16021790555050565b60085481565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f1061266a57805160ff1916838001178555612698565b82800160010185558215612698579182015b8281111561269757825182559160200191906001019061267c565b5b5090506126a59190612730565b5090565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106126e2578054855561271f565b8280016001018555821561271f57600052602060002091601f016020900482015b8281111561271e578254825591600101919060010190612703565b5b50905061272c9190612730565b5090565b61275291905b8082111561274e576000816000905550600101612736565b5090565b905600a165627a7a723058205e555577321a1ae906337de0841c1da201b7b9bdc91f21332e3b01b66a39b9270029",
  "sourceMap": "56:2445:0:-;;;337:1;315:23;;462:80;8:9:-1;5:2;;;30:1;27;20:12;5:2;462:80:0;523:10:2;515:5;;:18;;;;;;;;;;;;;;;;;;491:45:0;;;;;;;;;;;;;;;;;;;;;;;:4;:45;;;;;;;;;;;;:::i;:::-;;56:2445;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;:::-;;;;;;;",
  "deployedSourceMap": "56:2445:0:-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;865:399;;8:9:-1;5:2;;;30:1;27;20:12;5:2;865:399:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2147:103;;8:9:-1;5:2;;;30:1;27;20:12;5:2;2147:103:0;;;;;;;;;;;;;;;;;;;;;;;246:33;;8:9:-1;5:2;;;30:1;27;20:12;5:2;246:33:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23:1:-1;8:100;33:3;30:1;27:10;8:100;;;99:1;94:3;90:11;84:18;80:1;75:3;71:11;64:39;52:2;49:1;45:10;40:15;;8:100;;;12:14;246:33:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23:1:-1;8:100;33:3;30:1;27:10;8:100;;;99:1;94:3;90:11;84:18;80:1;75:3;71:11;64:39;52:2;49:1;45:10;40:15;;8:100;;;12:14;246:33:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23:1:-1;8:100;33:3;30:1;27:10;8:100;;;99:1;94:3;90:11;84:18;80:1;75:3;71:11;64:39;52:2;49:1;45:10;40:15;;8:100;;;12:14;246:33:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23:1:-1;8:100;33:3;30:1;27:10;8:100;;;99:1;94:3;90:11;84:18;80:1;75:3;71:11;64:39;52:2;49:1;45:10;40:15;;8:100;;;12:14;246:33:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23:1:-1;8:100;33:3;30:1;27:10;8:100;;;99:1;94:3;90:11;84:18;80:1;75:3;71:11;64:39;52:2;49:1;45:10;40:15;;8:100;;;12:14;246:33:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2256:242;;8:9:-1;5:2;;;30:1;27;20:12;5:2;2256:242:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23:1:-1;8:100;33:3;30:1;27:10;8:100;;;99:1;94:3;90:11;84:18;80:1;75:3;71:11;64:39;52:2;49:1;45:10;40:15;;8:100;;;12:14;2256:242:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23:1:-1;8:100;33:3;30:1;27:10;8:100;;;99:1;94:3;90:11;84:18;80:1;75:3;71:11;64:39;52:2;49:1;45:10;40:15;;8:100;;;12:14;2256:242:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23:1:-1;8:100;33:3;30:1;27:10;8:100;;;99:1;94:3;90:11;84:18;80:1;75:3;71:11;64:39;52:2;49:1;45:10;40:15;;8:100;;;12:14;2256:242:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23:1:-1;8:100;33:3;30:1;27:10;8:100;;;99:1;94:3;90:11;84:18;80:1;75:3;71:11;64:39;52:2;49:1;45:10;40:15;;8:100;;;12:14;2256:242:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23:1:-1;8:100;33:3;30:1;27:10;8:100;;;99:1;94:3;90:11;84:18;80:1;75:3;71:11;64:39;52:2;49:1;45:10;40:15;;8:100;;;12:14;2256:242:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;1272:348;;8:9:-1;5:2;;;30:1;27;20:12;5:2;1272:348:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23:1:-1;8:100;33:3;30:1;27:10;8:100;;;99:1;94:3;90:11;84:18;80:1;75:3;71:11;64:39;52:2;49:1;45:10;40:15;;8:100;;;12:14;1272:348:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23:1:-1;8:100;33:3;30:1;27:10;8:100;;;99:1;94:3;90:11;84:18;80:1;75:3;71:11;64:39;52:2;49:1;45:10;40:15;;8:100;;;12:14;1272:348:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23:1:-1;8:100;33:3;30:1;27:10;8:100;;;99:1;94:3;90:11;84:18;80:1;75:3;71:11;64:39;52:2;49:1;45:10;40:15;;8:100;;;12:14;1272:348:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23:1:-1;8:100;33:3;30:1;27:10;8:100;;;99:1;94:3;90:11;84:18;80:1;75:3;71:11;64:39;52:2;49:1;45:10;40:15;;8:100;;;12:14;1272:348:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23:1:-1;8:100;33:3;30:1;27:10;8:100;;;99:1;94:3;90:11;84:18;80:1;75:3;71:11;64:39;52:2;49:1;45:10;40:15;;8:100;;;12:14;1272:348:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;240:20:2;;8:9:-1;5:2;;;30:1;27;20:12;5:2;240:20:2;;;;;;;;;;;;;;;;;;;;;;;;;;;1631:506:0;;8:9:-1;5:2;;;30:1;27;20:12;5:2;1631:506:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23:1:-1;8:100;33:3;30:1;27:10;8:100;;;99:1;94:3;90:11;84:18;80:1;75:3;71:11;64:39;52:2;49:1;45:10;40:15;;8:100;;;12:14;1631:506:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23:1:-1;8:100;33:3;30:1;27:10;8:100;;;99:1;94:3;90:11;84:18;80:1;75:3;71:11;64:39;52:2;49:1;45:10;40:15;;8:100;;;12:14;1631:506:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23:1:-1;8:100;33:3;30:1;27:10;8:100;;;99:1;94:3;90:11;84:18;80:1;75:3;71:11;64:39;52:2;49:1;45:10;40:15;;8:100;;;12:14;1631:506:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23:1:-1;8:100;33:3;30:1;27:10;8:100;;;99:1;94:3;90:11;84:18;80:1;75:3;71:11;64:39;52:2;49:1;45:10;40:15;;8:100;;;12:14;1631:506:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23:1:-1;8:100;33:3;30:1;27:10;8:100;;;99:1;94:3;90:11;84:18;80:1;75:3;71:11;64:39;52:2;49:1;45:10;40:15;;8:100;;;12:14;1631:506:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;286:20;;8:9:-1;5:2;;;30:1;27;20:12;5:2;286:20:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23:1:-1;8:100;33:3;30:1;27:10;8:100;;;99:1;94:3;90:11;84:18;80:1;75:3;71:11;64:39;52:2;49:1;45:10;40:15;;8:100;;;12:14;286:20:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23:1:-1;8:100;33:3;30:1;27:10;8:100;;;99:1;94:3;90:11;84:18;80:1;75:3;71:11;64:39;52:2;49:1;45:10;40:15;;8:100;;;12:14;286:20:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23:1:-1;8:100;33:3;30:1;27:10;8:100;;;99:1;94:3;90:11;84:18;80:1;75:3;71:11;64:39;52:2;49:1;45:10;40:15;;8:100;;;12:14;286:20:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23:1:-1;8:100;33:3;30:1;27:10;8:100;;;99:1;94:3;90:11;84:18;80:1;75:3;71:11;64:39;52:2;49:1;45:10;40:15;;8:100;;;12:14;286:20:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;23:1:-1;8:100;33:3;30:1;27:10;8:100;;;99:1;94:3;90:11;84:18;80:1;75:3;71:11;64:39;52:2;49:1;45:10;40:15;;8:100;;;12:14;286:20:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;878:188:2;;8:9:-1;5:2;;;30:1;27;20:12;5:2;878:188:2;;;;;;;;;;;;;;;;;;;;;;;;;;;;315:23:0;;8:9:-1;5:2;;;30:1;27;20:12;5:2;315:23:0;;;;;;;;;;;;;;;;;;;;;;;865:399;682:5:2;;;;;;;;;;;668:19;;:10;:19;;;660:28;;;;;;;;1005:1:0;996:5;;:10;;;;;;;;;;;1026:5;;1017:3;:6;;:14;;;;1052:4;1042:3;:7;;:14;;;;;;;;;;;;:::i;:::-;;1082:9;1067:3;:12;;:24;;;;;;;;;;;;:::i;:::-;;1119:11;1102:3;:14;;:28;;;;;;;;;;;;:::i;:::-;;1156:9;1141:3;:12;;:24;;;;;;;;;;;;:::i;:::-;;1193:11;1176:3;:14;;:28;;;;;;;;;;;;:::i;:::-;;1251:1;1225:14;1245:3;1225:24;;39:1:-1;33:3;27:10;23:18;57:10;52:3;45:23;79:10;72:17;;0:93;1225:24:0;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;;:27;;865:399;;;;;:::o;2147:103::-;2194:7;2221:14;:21;;;;2214:28;;2147:103;:::o;246:33::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;2256:242::-;2304:11;2317;2330:16;2347:18;2366:16;2383:18;2418:3;:6;;;2426:3;:7;;2434:3;:12;;2447:3;:14;;2462:3;:12;;2476:3;:14;;2410:82;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;2256:242;;;;;;:::o;1272:348::-;1334:7;1344:6;1353;1361;1369;1377;1401:1;1399;:3;1395:44;;;1411:1;1409;:3;1405:7;;1395:44;;;1435:1;1432:4;;1395:44;1455:14;1470:1;1455:17;;;;;;;;;;;;;;;;;;;;:20;;;1477:14;1492:1;1477:17;;;;;;;;;;;;;;;;;;;;:21;;1499:14;1514:1;1499:17;;;;;;;;;;;;;;;;;;;;:26;;1526:14;1541:1;1526:17;;;;;;;;;;;;;;;;;;;;:28;;1555:14;1570:1;1555:17;;;;;;;;;;;;;;;;;;;;:26;;1583:14;1598:1;1583:17;;;;;;;;;;;;;;;;;;;;:28;;1447:165;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;1272:348;;;;;;;:::o;240:20:2:-;;;;;;;;;;;;;:::o;1631:506:0:-;1697:7;1707:6;1716;1724;1732;1740;1763:9;1798:1;1776:14;:21;;;;:23;1763:37;;1758:368;1807:1;1802;:6;;1758:368;;;1897:14;1912:1;1897:17;;;;;;;;;;;;;;;;;;;;:21;;1880:39;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;49:4:-1;39:7;30;26:21;22:32;13:7;6:49;1880:39:0;;;1870:50;;;;;;;;;;;;;36:153:-1;66:2;61:3;58:11;51:19;36:153;;;182:3;176:10;171:3;164:23;98:2;93:3;89:12;82:19;;123:2;118:3;114:12;107:19;;148:2;143:3;139:12;132:19;;36:153;;;274:1;267:3;263:2;259:12;254:3;250:22;246:30;315:4;311:9;305:3;299:10;295:26;356:4;350:3;344:10;340:21;389:7;380;377:20;372:3;365:33;3:399;;;1870:50:0;;;;;;;;;;;;;;;;1835:85;;;1862:4;1845:22;;;;;;;;;;;;;;;36:153:-1;66:2;61:3;58:11;51:19;36:153;;;182:3;176:10;171:3;164:23;98:2;93:3;89:12;82:19;;123:2;118:3;114:12;107:19;;148:2;143:3;139:12;132:19;;36:153;;;274:1;267:3;263:2;259:12;254:3;250:22;246:30;315:4;311:9;305:3;299:10;295:26;356:4;350:3;344:10;340:21;389:7;380;377:20;372:3;365:33;3:399;;;1845:22:0;;;;;;;;;;;49:4:-1;39:7;30;26:21;22:32;13:7;6:49;1845:22:0;;;1835:33;;;;;;;;;;;;;36:153:-1;66:2;61:3;58:11;51:19;36:153;;;182:3;176:10;171:3;164:23;98:2;93:3;89:12;82:19;;123:2;118:3;114:12;107:19;;148:2;143:3;139:12;132:19;;36:153;;;274:1;267:3;263:2;259:12;254:3;250:22;246:30;315:4;311:9;305:3;299:10;295:26;356:4;350:3;344:10;340:21;389:7;380;377:20;372:3;365:33;3:399;;;1835:33:0;;;;;;;;;;;;;;;;:85;;;;1830:287;;;1946:14;1961:1;1946:17;;;;;;;;;;;;;;;;;;;;:20;;;1968:14;1983:1;1968:17;;;;;;;;;;;;;;;;;;;;:21;;1990:14;2005:1;1990:17;;;;;;;;;;;;;;;;;;;;:26;;2017:14;2032:1;2017:17;;;;;;;;;;;;;;;;;;;;:28;;2046:14;2061:1;2046:17;;;;;;;;;;;;;;;;;;;;:26;;2074:14;2089:1;2074:17;;;;;;;;;;;;;;;;;;;;:28;;1938:165;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;1830:287;1812:3;;;;;;;;1758:368;;;1631:506;;;;;;;;;:::o;286:20::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o;878:188:2:-;682:5;;;;;;;;;;;668:19;;:10;:19;;;660:28;;;;;;;;978:1;958:22;;:8;:22;;;;950:31;;;;;;;;1024:8;996:37;;1017:5;;;;;;;;;;;996:37;;;;;;;;;;;;1051:8;1043:5;;:16;;;;;;;;;;;;;;;;;;878:188;:::o;315:23:0:-;;;;:::o;56:2445::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;;:::i;:::-;;;:::o;:::-;;;;;;;;;;;;;;;;;;;;;;;;;;;:::o",
  "source": "pragma solidity ^0.4.0;\r\n\r\nimport \"./Ownable.sol\";\r\n\r\n\r\ncontract CSBD is Ownable {\r\n\r\n  struct CEDStruct {\r\n    uint256 id;\r\n    string cid;\r\n    string fullname;\r\n    string coursename;\r\n    string issuedOn;\r\n    string validUntil;\r\n  } \r\n\r\n    CEDStruct[] public CEDStructArray;\r\n    CEDStruct public CED;\r\n\r\n    uint256 public CEDID =0 ;\r\n\r\n  /* Define variable cert of the type string */\r\n  string cert;\r\n\r\n  /* This runs when the contract is executed */\r\n  constructor () public {\r\n    cert = \"Certificed Senior Blockchain Program\";\r\n  }\r\n\r\n  /* Main function */\r\n  // CSBD - Certified Senior Blockchain Developer - Forked by George Gao from the version of \"CBED20180201\" created by Sean Xun Cao, some warning issues have been fixed for the latest compiler\r\n  // \"CBED20180201\",\"Sean Xun Cao\",\"Certified Blockchain Ethereum Developer\",\"20180218\",\"20280218\"\r\n  function setCED(string _cid, string _fullname,string _coursename,string _issuedOn,string _validUntil ) public onlyOwner {\r\n        CEDID += 1;\r\n        CED.id = CEDID;\r\n        CED.cid = _cid;\r\n        CED.fullname = _fullname;\r\n        CED.coursename = _coursename;\r\n        CED.issuedOn = _issuedOn;\r\n        CED.validUntil = _validUntil;\r\n        \r\n        CEDStructArray.push(CED) -1;\r\n    \r\n  }\r\n\r\n    function getCEDStructByID(uint256 i) constant public returns (uint256 , string , string ,string ,string ,string ) {\r\n      if (i>0) {i = i-1;} \r\n        else { i =0 ;}\r\n      return (CEDStructArray[i].id, CEDStructArray[i].cid,CEDStructArray[i].fullname,CEDStructArray[i].coursename,CEDStructArray[i].issuedOn, CEDStructArray[i].validUntil);\r\n    }\r\n \r\n\r\n    function getCEDStructsByCID(string _cid) constant public returns (uint256 , string , string ,string ,string ,string ) {\r\n      for (uint256 i = (CEDStructArray.length-1); i >= 0  ; i--) {\r\n          if ( keccak256(abi.encodePacked(_cid))==keccak256(abi.encodePacked(CEDStructArray[i].cid)) ) {\r\n            return (CEDStructArray[i].id, CEDStructArray[i].cid,CEDStructArray[i].fullname,CEDStructArray[i].coursename,CEDStructArray[i].issuedOn, CEDStructArray[i].validUntil);\r\n          }\r\n      }    \r\n    }\r\n\r\n\r\n    function countCEDStruct() view public returns (uint256) {\r\n        return CEDStructArray.length;\r\n    }\r\n\r\n  function getlastCED( ) constant public returns (uint256 _id, string _cid, string _fullname,string _coursename,string _issuedOn,string _validUntil) {\r\n    return (CED.id, CED.cid,CED.fullname,CED.coursename,CED.issuedOn, CED.validUntil );\r\n  }\r\n}",
  "sourcePath": "E:\\Project\\contracts\\CSBD.sol",
  "ast": {
    "absolutePath": "/E/Project/contracts/CSBD.sol",
    "exportedSymbols": {
      "CSBD": [
        277
      ]
    },
    "id": 278,
    "nodeType": "SourceUnit",
    "nodes": [
      {
        "id": 1,
        "literals": [
          "solidity",
          "^",
          "0.4",
          ".0"
        ],
        "nodeType": "PragmaDirective",
        "src": "0:23:0"
      },
      {
        "absolutePath": "/E/Project/contracts/Ownable.sol",
        "file": "./Ownable.sol",
        "id": 2,
        "nodeType": "ImportDirective",
        "scope": 278,
        "sourceUnit": 391,
        "src": "27:23:0",
        "symbolAliases": [],
        "unitAlias": ""
      },
      {
        "baseContracts": [
          {
            "arguments": null,
            "baseName": {
              "contractScope": null,
              "id": 3,
              "name": "Ownable",
              "nodeType": "UserDefinedTypeName",
              "referencedDeclaration": 390,
              "src": "73:7:0",
              "typeDescriptions": {
                "typeIdentifier": "t_contract$_Ownable_$390",
                "typeString": "contract Ownable"
              }
            },
            "id": 4,
            "nodeType": "InheritanceSpecifier",
            "src": "73:7:0"
          }
        ],
        "contractDependencies": [
          390
        ],
        "contractKind": "contract",
        "documentation": null,
        "fullyImplemented": true,
        "id": 277,
        "linearizedBaseContracts": [
          277,
          390
        ],
        "name": "CSBD",
        "nodeType": "ContractDefinition",
        "nodes": [
          {
            "canonicalName": "CSBD.CEDStruct",
            "id": 17,
            "members": [
              {
                "constant": false,
                "id": 6,
                "name": "id",
                "nodeType": "VariableDeclaration",
                "scope": 17,
                "src": "112:10:0",
                "stateVariable": false,
                "storageLocation": "default",
                "typeDescriptions": {
                  "typeIdentifier": "t_uint256",
                  "typeString": "uint256"
                },
                "typeName": {
                  "id": 5,
                  "name": "uint256",
                  "nodeType": "ElementaryTypeName",
                  "src": "112:7:0",
                  "typeDescriptions": {
                    "typeIdentifier": "t_uint256",
                    "typeString": "uint256"
                  }
                },
                "value": null,
                "visibility": "internal"
              },
              {
                "constant": false,
                "id": 8,
                "name": "cid",
                "nodeType": "VariableDeclaration",
                "scope": 17,
                "src": "129:10:0",
                "stateVariable": false,
                "storageLocation": "default",
                "typeDescriptions": {
                  "typeIdentifier": "t_string_storage_ptr",
                  "typeString": "string"
                },
                "typeName": {
                  "id": 7,
                  "name": "string",
                  "nodeType": "ElementaryTypeName",
                  "src": "129:6:0",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_storage_ptr",
                    "typeString": "string"
                  }
                },
                "value": null,
                "visibility": "internal"
              },
              {
                "constant": false,
                "id": 10,
                "name": "fullname",
                "nodeType": "VariableDeclaration",
                "scope": 17,
                "src": "146:15:0",
                "stateVariable": false,
                "storageLocation": "default",
                "typeDescriptions": {
                  "typeIdentifier": "t_string_storage_ptr",
                  "typeString": "string"
                },
                "typeName": {
                  "id": 9,
                  "name": "string",
                  "nodeType": "ElementaryTypeName",
                  "src": "146:6:0",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_storage_ptr",
                    "typeString": "string"
                  }
                },
                "value": null,
                "visibility": "internal"
              },
              {
                "constant": false,
                "id": 12,
                "name": "coursename",
                "nodeType": "VariableDeclaration",
                "scope": 17,
                "src": "168:17:0",
                "stateVariable": false,
                "storageLocation": "default",
                "typeDescriptions": {
                  "typeIdentifier": "t_string_storage_ptr",
                  "typeString": "string"
                },
                "typeName": {
                  "id": 11,
                  "name": "string",
                  "nodeType": "ElementaryTypeName",
                  "src": "168:6:0",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_storage_ptr",
                    "typeString": "string"
                  }
                },
                "value": null,
                "visibility": "internal"
              },
              {
                "constant": false,
                "id": 14,
                "name": "issuedOn",
                "nodeType": "VariableDeclaration",
                "scope": 17,
                "src": "192:15:0",
                "stateVariable": false,
                "storageLocation": "default",
                "typeDescriptions": {
                  "typeIdentifier": "t_string_storage_ptr",
                  "typeString": "string"
                },
                "typeName": {
                  "id": 13,
                  "name": "string",
                  "nodeType": "ElementaryTypeName",
                  "src": "192:6:0",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_storage_ptr",
                    "typeString": "string"
                  }
                },
                "value": null,
                "visibility": "internal"
              },
              {
                "constant": false,
                "id": 16,
                "name": "validUntil",
                "nodeType": "VariableDeclaration",
                "scope": 17,
                "src": "214:17:0",
                "stateVariable": false,
                "storageLocation": "default",
                "typeDescriptions": {
                  "typeIdentifier": "t_string_storage_ptr",
                  "typeString": "string"
                },
                "typeName": {
                  "id": 15,
                  "name": "string",
                  "nodeType": "ElementaryTypeName",
                  "src": "214:6:0",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_storage_ptr",
                    "typeString": "string"
                  }
                },
                "value": null,
                "visibility": "internal"
              }
            ],
            "name": "CEDStruct",
            "nodeType": "StructDefinition",
            "scope": 277,
            "src": "88:149:0",
            "visibility": "public"
          },
          {
            "constant": false,
            "id": 20,
            "name": "CEDStructArray",
            "nodeType": "VariableDeclaration",
            "scope": 277,
            "src": "246:33:0",
            "stateVariable": true,
            "storageLocation": "default",
            "typeDescriptions": {
              "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
              "typeString": "struct CSBD.CEDStruct[]"
            },
            "typeName": {
              "baseType": {
                "contractScope": null,
                "id": 18,
                "name": "CEDStruct",
                "nodeType": "UserDefinedTypeName",
                "referencedDeclaration": 17,
                "src": "246:9:0",
                "typeDescriptions": {
                  "typeIdentifier": "t_struct$_CEDStruct_$17_storage_ptr",
                  "typeString": "struct CSBD.CEDStruct"
                }
              },
              "id": 19,
              "length": null,
              "nodeType": "ArrayTypeName",
              "src": "246:11:0",
              "typeDescriptions": {
                "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage_ptr",
                "typeString": "struct CSBD.CEDStruct[]"
              }
            },
            "value": null,
            "visibility": "public"
          },
          {
            "constant": false,
            "id": 22,
            "name": "CED",
            "nodeType": "VariableDeclaration",
            "scope": 277,
            "src": "286:20:0",
            "stateVariable": true,
            "storageLocation": "default",
            "typeDescriptions": {
              "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
              "typeString": "struct CSBD.CEDStruct"
            },
            "typeName": {
              "contractScope": null,
              "id": 21,
              "name": "CEDStruct",
              "nodeType": "UserDefinedTypeName",
              "referencedDeclaration": 17,
              "src": "286:9:0",
              "typeDescriptions": {
                "typeIdentifier": "t_struct$_CEDStruct_$17_storage_ptr",
                "typeString": "struct CSBD.CEDStruct"
              }
            },
            "value": null,
            "visibility": "public"
          },
          {
            "constant": false,
            "id": 25,
            "name": "CEDID",
            "nodeType": "VariableDeclaration",
            "scope": 277,
            "src": "315:23:0",
            "stateVariable": true,
            "storageLocation": "default",
            "typeDescriptions": {
              "typeIdentifier": "t_uint256",
              "typeString": "uint256"
            },
            "typeName": {
              "id": 23,
              "name": "uint256",
              "nodeType": "ElementaryTypeName",
              "src": "315:7:0",
              "typeDescriptions": {
                "typeIdentifier": "t_uint256",
                "typeString": "uint256"
              }
            },
            "value": {
              "argumentTypes": null,
              "hexValue": "30",
              "id": 24,
              "isConstant": false,
              "isLValue": false,
              "isPure": true,
              "kind": "number",
              "lValueRequested": false,
              "nodeType": "Literal",
              "src": "337:1:0",
              "subdenomination": null,
              "typeDescriptions": {
                "typeIdentifier": "t_rational_0_by_1",
                "typeString": "int_const 0"
              },
              "value": "0"
            },
            "visibility": "public"
          },
          {
            "constant": false,
            "id": 27,
            "name": "cert",
            "nodeType": "VariableDeclaration",
            "scope": 277,
            "src": "395:11:0",
            "stateVariable": true,
            "storageLocation": "default",
            "typeDescriptions": {
              "typeIdentifier": "t_string_storage",
              "typeString": "string"
            },
            "typeName": {
              "id": 26,
              "name": "string",
              "nodeType": "ElementaryTypeName",
              "src": "395:6:0",
              "typeDescriptions": {
                "typeIdentifier": "t_string_storage_ptr",
                "typeString": "string"
              }
            },
            "value": null,
            "visibility": "internal"
          },
          {
            "body": {
              "id": 34,
              "nodeType": "Block",
              "src": "484:58:0",
              "statements": [
                {
                  "expression": {
                    "argumentTypes": null,
                    "id": 32,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftHandSide": {
                      "argumentTypes": null,
                      "id": 30,
                      "name": "cert",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 27,
                      "src": "491:4:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_string_storage",
                        "typeString": "string storage ref"
                      }
                    },
                    "nodeType": "Assignment",
                    "operator": "=",
                    "rightHandSide": {
                      "argumentTypes": null,
                      "hexValue": "436572746966696365642053656e696f7220426c6f636b636861696e2050726f6772616d",
                      "id": 31,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": true,
                      "kind": "string",
                      "lValueRequested": false,
                      "nodeType": "Literal",
                      "src": "498:38:0",
                      "subdenomination": null,
                      "typeDescriptions": {
                        "typeIdentifier": "t_stringliteral_2b38542bfd92924ef861e9e4fcb810522a8a256164cc0fc7ffdd427f8d844f07",
                        "typeString": "literal_string \"Certificed Senior Blockchain Program\""
                      },
                      "value": "Certificed Senior Blockchain Program"
                    },
                    "src": "491:45:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage",
                      "typeString": "string storage ref"
                    }
                  },
                  "id": 33,
                  "nodeType": "ExpressionStatement",
                  "src": "491:45:0"
                }
              ]
            },
            "documentation": null,
            "id": 35,
            "implemented": true,
            "isConstructor": true,
            "isDeclaredConst": false,
            "modifiers": [],
            "name": "",
            "nodeType": "FunctionDefinition",
            "parameters": {
              "id": 28,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "474:2:0"
            },
            "payable": false,
            "returnParameters": {
              "id": 29,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "484:0:0"
            },
            "scope": 277,
            "src": "462:80:0",
            "stateMutability": "nonpayable",
            "superFunction": null,
            "visibility": "public"
          },
          {
            "body": {
              "id": 98,
              "nodeType": "Block",
              "src": "985:279:0",
              "statements": [
                {
                  "expression": {
                    "argumentTypes": null,
                    "id": 52,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftHandSide": {
                      "argumentTypes": null,
                      "id": 50,
                      "name": "CEDID",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 25,
                      "src": "996:5:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "nodeType": "Assignment",
                    "operator": "+=",
                    "rightHandSide": {
                      "argumentTypes": null,
                      "hexValue": "31",
                      "id": 51,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": true,
                      "kind": "number",
                      "lValueRequested": false,
                      "nodeType": "Literal",
                      "src": "1005:1:0",
                      "subdenomination": null,
                      "typeDescriptions": {
                        "typeIdentifier": "t_rational_1_by_1",
                        "typeString": "int_const 1"
                      },
                      "value": "1"
                    },
                    "src": "996:10:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    }
                  },
                  "id": 53,
                  "nodeType": "ExpressionStatement",
                  "src": "996:10:0"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "id": 58,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftHandSide": {
                      "argumentTypes": null,
                      "expression": {
                        "argumentTypes": null,
                        "id": 54,
                        "name": "CED",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 22,
                        "src": "1017:3:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                          "typeString": "struct CSBD.CEDStruct storage ref"
                        }
                      },
                      "id": 56,
                      "isConstant": false,
                      "isLValue": true,
                      "isPure": false,
                      "lValueRequested": true,
                      "memberName": "id",
                      "nodeType": "MemberAccess",
                      "referencedDeclaration": 6,
                      "src": "1017:6:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "nodeType": "Assignment",
                    "operator": "=",
                    "rightHandSide": {
                      "argumentTypes": null,
                      "id": 57,
                      "name": "CEDID",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 25,
                      "src": "1026:5:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "src": "1017:14:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    }
                  },
                  "id": 59,
                  "nodeType": "ExpressionStatement",
                  "src": "1017:14:0"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "id": 64,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftHandSide": {
                      "argumentTypes": null,
                      "expression": {
                        "argumentTypes": null,
                        "id": 60,
                        "name": "CED",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 22,
                        "src": "1042:3:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                          "typeString": "struct CSBD.CEDStruct storage ref"
                        }
                      },
                      "id": 62,
                      "isConstant": false,
                      "isLValue": true,
                      "isPure": false,
                      "lValueRequested": true,
                      "memberName": "cid",
                      "nodeType": "MemberAccess",
                      "referencedDeclaration": 8,
                      "src": "1042:7:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_string_storage",
                        "typeString": "string storage ref"
                      }
                    },
                    "nodeType": "Assignment",
                    "operator": "=",
                    "rightHandSide": {
                      "argumentTypes": null,
                      "id": 63,
                      "name": "_cid",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 37,
                      "src": "1052:4:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_string_memory_ptr",
                        "typeString": "string memory"
                      }
                    },
                    "src": "1042:14:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage",
                      "typeString": "string storage ref"
                    }
                  },
                  "id": 65,
                  "nodeType": "ExpressionStatement",
                  "src": "1042:14:0"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "id": 70,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftHandSide": {
                      "argumentTypes": null,
                      "expression": {
                        "argumentTypes": null,
                        "id": 66,
                        "name": "CED",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 22,
                        "src": "1067:3:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                          "typeString": "struct CSBD.CEDStruct storage ref"
                        }
                      },
                      "id": 68,
                      "isConstant": false,
                      "isLValue": true,
                      "isPure": false,
                      "lValueRequested": true,
                      "memberName": "fullname",
                      "nodeType": "MemberAccess",
                      "referencedDeclaration": 10,
                      "src": "1067:12:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_string_storage",
                        "typeString": "string storage ref"
                      }
                    },
                    "nodeType": "Assignment",
                    "operator": "=",
                    "rightHandSide": {
                      "argumentTypes": null,
                      "id": 69,
                      "name": "_fullname",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 39,
                      "src": "1082:9:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_string_memory_ptr",
                        "typeString": "string memory"
                      }
                    },
                    "src": "1067:24:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage",
                      "typeString": "string storage ref"
                    }
                  },
                  "id": 71,
                  "nodeType": "ExpressionStatement",
                  "src": "1067:24:0"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "id": 76,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftHandSide": {
                      "argumentTypes": null,
                      "expression": {
                        "argumentTypes": null,
                        "id": 72,
                        "name": "CED",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 22,
                        "src": "1102:3:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                          "typeString": "struct CSBD.CEDStruct storage ref"
                        }
                      },
                      "id": 74,
                      "isConstant": false,
                      "isLValue": true,
                      "isPure": false,
                      "lValueRequested": true,
                      "memberName": "coursename",
                      "nodeType": "MemberAccess",
                      "referencedDeclaration": 12,
                      "src": "1102:14:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_string_storage",
                        "typeString": "string storage ref"
                      }
                    },
                    "nodeType": "Assignment",
                    "operator": "=",
                    "rightHandSide": {
                      "argumentTypes": null,
                      "id": 75,
                      "name": "_coursename",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 41,
                      "src": "1119:11:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_string_memory_ptr",
                        "typeString": "string memory"
                      }
                    },
                    "src": "1102:28:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage",
                      "typeString": "string storage ref"
                    }
                  },
                  "id": 77,
                  "nodeType": "ExpressionStatement",
                  "src": "1102:28:0"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "id": 82,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftHandSide": {
                      "argumentTypes": null,
                      "expression": {
                        "argumentTypes": null,
                        "id": 78,
                        "name": "CED",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 22,
                        "src": "1141:3:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                          "typeString": "struct CSBD.CEDStruct storage ref"
                        }
                      },
                      "id": 80,
                      "isConstant": false,
                      "isLValue": true,
                      "isPure": false,
                      "lValueRequested": true,
                      "memberName": "issuedOn",
                      "nodeType": "MemberAccess",
                      "referencedDeclaration": 14,
                      "src": "1141:12:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_string_storage",
                        "typeString": "string storage ref"
                      }
                    },
                    "nodeType": "Assignment",
                    "operator": "=",
                    "rightHandSide": {
                      "argumentTypes": null,
                      "id": 81,
                      "name": "_issuedOn",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 43,
                      "src": "1156:9:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_string_memory_ptr",
                        "typeString": "string memory"
                      }
                    },
                    "src": "1141:24:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage",
                      "typeString": "string storage ref"
                    }
                  },
                  "id": 83,
                  "nodeType": "ExpressionStatement",
                  "src": "1141:24:0"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "id": 88,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftHandSide": {
                      "argumentTypes": null,
                      "expression": {
                        "argumentTypes": null,
                        "id": 84,
                        "name": "CED",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 22,
                        "src": "1176:3:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                          "typeString": "struct CSBD.CEDStruct storage ref"
                        }
                      },
                      "id": 86,
                      "isConstant": false,
                      "isLValue": true,
                      "isPure": false,
                      "lValueRequested": true,
                      "memberName": "validUntil",
                      "nodeType": "MemberAccess",
                      "referencedDeclaration": 16,
                      "src": "1176:14:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_string_storage",
                        "typeString": "string storage ref"
                      }
                    },
                    "nodeType": "Assignment",
                    "operator": "=",
                    "rightHandSide": {
                      "argumentTypes": null,
                      "id": 87,
                      "name": "_validUntil",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 45,
                      "src": "1193:11:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_string_memory_ptr",
                        "typeString": "string memory"
                      }
                    },
                    "src": "1176:28:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage",
                      "typeString": "string storage ref"
                    }
                  },
                  "id": 89,
                  "nodeType": "ExpressionStatement",
                  "src": "1176:28:0"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "commonType": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "id": 96,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftExpression": {
                      "argumentTypes": null,
                      "arguments": [
                        {
                          "argumentTypes": null,
                          "id": 93,
                          "name": "CED",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 22,
                          "src": "1245:3:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref"
                          }
                        }
                      ],
                      "expression": {
                        "argumentTypes": [
                          {
                            "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref"
                          }
                        ],
                        "expression": {
                          "argumentTypes": null,
                          "id": 90,
                          "name": "CEDStructArray",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 20,
                          "src": "1225:14:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                          }
                        },
                        "id": 92,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "push",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": null,
                        "src": "1225:19:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_function_arraypush_nonpayable$_t_struct$_CEDStruct_$17_storage_$returns$_t_uint256_$",
                          "typeString": "function (struct CSBD.CEDStruct storage ref) returns (uint256)"
                        }
                      },
                      "id": 94,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "kind": "functionCall",
                      "lValueRequested": false,
                      "names": [],
                      "nodeType": "FunctionCall",
                      "src": "1225:24:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "nodeType": "BinaryOperation",
                    "operator": "-",
                    "rightExpression": {
                      "argumentTypes": null,
                      "hexValue": "31",
                      "id": 95,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": true,
                      "kind": "number",
                      "lValueRequested": false,
                      "nodeType": "Literal",
                      "src": "1251:1:0",
                      "subdenomination": null,
                      "typeDescriptions": {
                        "typeIdentifier": "t_rational_1_by_1",
                        "typeString": "int_const 1"
                      },
                      "value": "1"
                    },
                    "src": "1225:27:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    }
                  },
                  "id": 97,
                  "nodeType": "ExpressionStatement",
                  "src": "1225:27:0"
                }
              ]
            },
            "documentation": null,
            "id": 99,
            "implemented": true,
            "isConstructor": false,
            "isDeclaredConst": false,
            "modifiers": [
              {
                "arguments": null,
                "id": 48,
                "modifierName": {
                  "argumentTypes": null,
                  "id": 47,
                  "name": "onlyOwner",
                  "nodeType": "Identifier",
                  "overloadedDeclarations": [],
                  "referencedDeclaration": 364,
                  "src": "975:9:0",
                  "typeDescriptions": {
                    "typeIdentifier": "t_modifier$__$",
                    "typeString": "modifier ()"
                  }
                },
                "nodeType": "ModifierInvocation",
                "src": "975:9:0"
              }
            ],
            "name": "setCED",
            "nodeType": "FunctionDefinition",
            "parameters": {
              "id": 46,
              "nodeType": "ParameterList",
              "parameters": [
                {
                  "constant": false,
                  "id": 37,
                  "name": "_cid",
                  "nodeType": "VariableDeclaration",
                  "scope": 99,
                  "src": "881:11:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 36,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "881:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 39,
                  "name": "_fullname",
                  "nodeType": "VariableDeclaration",
                  "scope": 99,
                  "src": "894:16:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 38,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "894:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 41,
                  "name": "_coursename",
                  "nodeType": "VariableDeclaration",
                  "scope": 99,
                  "src": "911:18:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 40,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "911:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 43,
                  "name": "_issuedOn",
                  "nodeType": "VariableDeclaration",
                  "scope": 99,
                  "src": "930:16:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 42,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "930:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 45,
                  "name": "_validUntil",
                  "nodeType": "VariableDeclaration",
                  "scope": 99,
                  "src": "947:18:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 44,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "947:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                }
              ],
              "src": "880:87:0"
            },
            "payable": false,
            "returnParameters": {
              "id": 49,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "985:0:0"
            },
            "scope": 277,
            "src": "865:399:0",
            "stateMutability": "nonpayable",
            "superFunction": null,
            "visibility": "public"
          },
          {
            "body": {
              "id": 158,
              "nodeType": "Block",
              "src": "1386:234:0",
              "statements": [
                {
                  "condition": {
                    "argumentTypes": null,
                    "commonType": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "id": 118,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftExpression": {
                      "argumentTypes": null,
                      "id": 116,
                      "name": "i",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 101,
                      "src": "1399:1:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "nodeType": "BinaryOperation",
                    "operator": ">",
                    "rightExpression": {
                      "argumentTypes": null,
                      "hexValue": "30",
                      "id": 117,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": true,
                      "kind": "number",
                      "lValueRequested": false,
                      "nodeType": "Literal",
                      "src": "1401:1:0",
                      "subdenomination": null,
                      "typeDescriptions": {
                        "typeIdentifier": "t_rational_0_by_1",
                        "typeString": "int_const 0"
                      },
                      "value": "0"
                    },
                    "src": "1399:3:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_bool",
                      "typeString": "bool"
                    }
                  },
                  "falseBody": {
                    "id": 130,
                    "nodeType": "Block",
                    "src": "1430:9:0",
                    "statements": [
                      {
                        "expression": {
                          "argumentTypes": null,
                          "id": 128,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "leftHandSide": {
                            "argumentTypes": null,
                            "id": 126,
                            "name": "i",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 101,
                            "src": "1432:1:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "nodeType": "Assignment",
                          "operator": "=",
                          "rightHandSide": {
                            "argumentTypes": null,
                            "hexValue": "30",
                            "id": 127,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": true,
                            "kind": "number",
                            "lValueRequested": false,
                            "nodeType": "Literal",
                            "src": "1435:1:0",
                            "subdenomination": null,
                            "typeDescriptions": {
                              "typeIdentifier": "t_rational_0_by_1",
                              "typeString": "int_const 0"
                            },
                            "value": "0"
                          },
                          "src": "1432:4:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        },
                        "id": 129,
                        "nodeType": "ExpressionStatement",
                        "src": "1432:4:0"
                      }
                    ]
                  },
                  "id": 131,
                  "nodeType": "IfStatement",
                  "src": "1395:44:0",
                  "trueBody": {
                    "id": 125,
                    "nodeType": "Block",
                    "src": "1404:10:0",
                    "statements": [
                      {
                        "expression": {
                          "argumentTypes": null,
                          "id": 123,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "leftHandSide": {
                            "argumentTypes": null,
                            "id": 119,
                            "name": "i",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 101,
                            "src": "1405:1:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "nodeType": "Assignment",
                          "operator": "=",
                          "rightHandSide": {
                            "argumentTypes": null,
                            "commonType": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            },
                            "id": 122,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "lValueRequested": false,
                            "leftExpression": {
                              "argumentTypes": null,
                              "id": 120,
                              "name": "i",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 101,
                              "src": "1409:1:0",
                              "typeDescriptions": {
                                "typeIdentifier": "t_uint256",
                                "typeString": "uint256"
                              }
                            },
                            "nodeType": "BinaryOperation",
                            "operator": "-",
                            "rightExpression": {
                              "argumentTypes": null,
                              "hexValue": "31",
                              "id": 121,
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": true,
                              "kind": "number",
                              "lValueRequested": false,
                              "nodeType": "Literal",
                              "src": "1411:1:0",
                              "subdenomination": null,
                              "typeDescriptions": {
                                "typeIdentifier": "t_rational_1_by_1",
                                "typeString": "int_const 1"
                              },
                              "value": "1"
                            },
                            "src": "1409:3:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "src": "1405:7:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        },
                        "id": 124,
                        "nodeType": "ExpressionStatement",
                        "src": "1405:7:0"
                      }
                    ]
                  }
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "components": [
                      {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "baseExpression": {
                            "argumentTypes": null,
                            "id": 132,
                            "name": "CEDStructArray",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 20,
                            "src": "1455:14:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                              "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                            }
                          },
                          "id": 134,
                          "indexExpression": {
                            "argumentTypes": null,
                            "id": 133,
                            "name": "i",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 101,
                            "src": "1470:1:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "isConstant": false,
                          "isLValue": true,
                          "isPure": false,
                          "lValueRequested": false,
                          "nodeType": "IndexAccess",
                          "src": "1455:17:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref"
                          }
                        },
                        "id": 135,
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "id",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 6,
                        "src": "1455:20:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "baseExpression": {
                            "argumentTypes": null,
                            "id": 136,
                            "name": "CEDStructArray",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 20,
                            "src": "1477:14:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                              "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                            }
                          },
                          "id": 138,
                          "indexExpression": {
                            "argumentTypes": null,
                            "id": 137,
                            "name": "i",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 101,
                            "src": "1492:1:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "isConstant": false,
                          "isLValue": true,
                          "isPure": false,
                          "lValueRequested": false,
                          "nodeType": "IndexAccess",
                          "src": "1477:17:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref"
                          }
                        },
                        "id": 139,
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "cid",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 8,
                        "src": "1477:21:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_string_storage",
                          "typeString": "string storage ref"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "baseExpression": {
                            "argumentTypes": null,
                            "id": 140,
                            "name": "CEDStructArray",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 20,
                            "src": "1499:14:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                              "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                            }
                          },
                          "id": 142,
                          "indexExpression": {
                            "argumentTypes": null,
                            "id": 141,
                            "name": "i",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 101,
                            "src": "1514:1:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "isConstant": false,
                          "isLValue": true,
                          "isPure": false,
                          "lValueRequested": false,
                          "nodeType": "IndexAccess",
                          "src": "1499:17:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref"
                          }
                        },
                        "id": 143,
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "fullname",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 10,
                        "src": "1499:26:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_string_storage",
                          "typeString": "string storage ref"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "baseExpression": {
                            "argumentTypes": null,
                            "id": 144,
                            "name": "CEDStructArray",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 20,
                            "src": "1526:14:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                              "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                            }
                          },
                          "id": 146,
                          "indexExpression": {
                            "argumentTypes": null,
                            "id": 145,
                            "name": "i",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 101,
                            "src": "1541:1:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "isConstant": false,
                          "isLValue": true,
                          "isPure": false,
                          "lValueRequested": false,
                          "nodeType": "IndexAccess",
                          "src": "1526:17:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref"
                          }
                        },
                        "id": 147,
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "coursename",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 12,
                        "src": "1526:28:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_string_storage",
                          "typeString": "string storage ref"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "baseExpression": {
                            "argumentTypes": null,
                            "id": 148,
                            "name": "CEDStructArray",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 20,
                            "src": "1555:14:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                              "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                            }
                          },
                          "id": 150,
                          "indexExpression": {
                            "argumentTypes": null,
                            "id": 149,
                            "name": "i",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 101,
                            "src": "1570:1:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "isConstant": false,
                          "isLValue": true,
                          "isPure": false,
                          "lValueRequested": false,
                          "nodeType": "IndexAccess",
                          "src": "1555:17:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref"
                          }
                        },
                        "id": 151,
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "issuedOn",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 14,
                        "src": "1555:26:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_string_storage",
                          "typeString": "string storage ref"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "baseExpression": {
                            "argumentTypes": null,
                            "id": 152,
                            "name": "CEDStructArray",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 20,
                            "src": "1583:14:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                              "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                            }
                          },
                          "id": 154,
                          "indexExpression": {
                            "argumentTypes": null,
                            "id": 153,
                            "name": "i",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 101,
                            "src": "1598:1:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "isConstant": false,
                          "isLValue": true,
                          "isPure": false,
                          "lValueRequested": false,
                          "nodeType": "IndexAccess",
                          "src": "1583:17:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref"
                          }
                        },
                        "id": 155,
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "validUntil",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 16,
                        "src": "1583:28:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_string_storage",
                          "typeString": "string storage ref"
                        }
                      }
                    ],
                    "id": 156,
                    "isConstant": false,
                    "isInlineArray": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "nodeType": "TupleExpression",
                    "src": "1454:158:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_tuple$_t_uint256_$_t_string_storage_$_t_string_storage_$_t_string_storage_$_t_string_storage_$_t_string_storage_$",
                      "typeString": "tuple(uint256,string storage ref,string storage ref,string storage ref,string storage ref,string storage ref)"
                    }
                  },
                  "functionReturnParameters": 115,
                  "id": 157,
                  "nodeType": "Return",
                  "src": "1447:165:0"
                }
              ]
            },
            "documentation": null,
            "id": 159,
            "implemented": true,
            "isConstructor": false,
            "isDeclaredConst": true,
            "modifiers": [],
            "name": "getCEDStructByID",
            "nodeType": "FunctionDefinition",
            "parameters": {
              "id": 102,
              "nodeType": "ParameterList",
              "parameters": [
                {
                  "constant": false,
                  "id": 101,
                  "name": "i",
                  "nodeType": "VariableDeclaration",
                  "scope": 159,
                  "src": "1298:9:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_uint256",
                    "typeString": "uint256"
                  },
                  "typeName": {
                    "id": 100,
                    "name": "uint256",
                    "nodeType": "ElementaryTypeName",
                    "src": "1298:7:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                }
              ],
              "src": "1297:11:0"
            },
            "payable": false,
            "returnParameters": {
              "id": 115,
              "nodeType": "ParameterList",
              "parameters": [
                {
                  "constant": false,
                  "id": 104,
                  "name": "",
                  "nodeType": "VariableDeclaration",
                  "scope": 159,
                  "src": "1334:7:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_uint256",
                    "typeString": "uint256"
                  },
                  "typeName": {
                    "id": 103,
                    "name": "uint256",
                    "nodeType": "ElementaryTypeName",
                    "src": "1334:7:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 106,
                  "name": "",
                  "nodeType": "VariableDeclaration",
                  "scope": 159,
                  "src": "1344:6:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 105,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "1344:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 108,
                  "name": "",
                  "nodeType": "VariableDeclaration",
                  "scope": 159,
                  "src": "1353:6:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 107,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "1353:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 110,
                  "name": "",
                  "nodeType": "VariableDeclaration",
                  "scope": 159,
                  "src": "1361:6:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 109,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "1361:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 112,
                  "name": "",
                  "nodeType": "VariableDeclaration",
                  "scope": 159,
                  "src": "1369:6:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 111,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "1369:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 114,
                  "name": "",
                  "nodeType": "VariableDeclaration",
                  "scope": 159,
                  "src": "1377:6:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 113,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "1377:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                }
              ],
              "src": "1333:52:0"
            },
            "scope": 277,
            "src": "1272:348:0",
            "stateMutability": "view",
            "superFunction": null,
            "visibility": "public"
          },
          {
            "body": {
              "id": 236,
              "nodeType": "Block",
              "src": "1749:388:0",
              "statements": [
                {
                  "body": {
                    "id": 234,
                    "nodeType": "Block",
                    "src": "1817:309:0",
                    "statements": [
                      {
                        "condition": {
                          "argumentTypes": null,
                          "commonType": {
                            "typeIdentifier": "t_bytes32",
                            "typeString": "bytes32"
                          },
                          "id": 205,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "leftExpression": {
                            "argumentTypes": null,
                            "arguments": [
                              {
                                "argumentTypes": null,
                                "arguments": [
                                  {
                                    "argumentTypes": null,
                                    "id": 193,
                                    "name": "_cid",
                                    "nodeType": "Identifier",
                                    "overloadedDeclarations": [],
                                    "referencedDeclaration": 161,
                                    "src": "1862:4:0",
                                    "typeDescriptions": {
                                      "typeIdentifier": "t_string_memory_ptr",
                                      "typeString": "string memory"
                                    }
                                  }
                                ],
                                "expression": {
                                  "argumentTypes": [
                                    {
                                      "typeIdentifier": "t_string_memory_ptr",
                                      "typeString": "string memory"
                                    }
                                  ],
                                  "expression": {
                                    "argumentTypes": null,
                                    "id": 191,
                                    "name": "abi",
                                    "nodeType": "Identifier",
                                    "overloadedDeclarations": [],
                                    "referencedDeclaration": 392,
                                    "src": "1845:3:0",
                                    "typeDescriptions": {
                                      "typeIdentifier": "t_magic_abi",
                                      "typeString": "abi"
                                    }
                                  },
                                  "id": 192,
                                  "isConstant": false,
                                  "isLValue": false,
                                  "isPure": true,
                                  "lValueRequested": false,
                                  "memberName": "encodePacked",
                                  "nodeType": "MemberAccess",
                                  "referencedDeclaration": null,
                                  "src": "1845:16:0",
                                  "typeDescriptions": {
                                    "typeIdentifier": "t_function_abiencodepacked_pure$__$returns$_t_bytes_memory_ptr_$",
                                    "typeString": "function () pure returns (bytes memory)"
                                  }
                                },
                                "id": 194,
                                "isConstant": false,
                                "isLValue": false,
                                "isPure": false,
                                "kind": "functionCall",
                                "lValueRequested": false,
                                "names": [],
                                "nodeType": "FunctionCall",
                                "src": "1845:22:0",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_bytes_memory_ptr",
                                  "typeString": "bytes memory"
                                }
                              }
                            ],
                            "expression": {
                              "argumentTypes": [
                                {
                                  "typeIdentifier": "t_bytes_memory_ptr",
                                  "typeString": "bytes memory"
                                }
                              ],
                              "id": 190,
                              "name": "keccak256",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 399,
                              "src": "1835:9:0",
                              "typeDescriptions": {
                                "typeIdentifier": "t_function_sha3_pure$__$returns$_t_bytes32_$",
                                "typeString": "function () pure returns (bytes32)"
                              }
                            },
                            "id": 195,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "kind": "functionCall",
                            "lValueRequested": false,
                            "names": [],
                            "nodeType": "FunctionCall",
                            "src": "1835:33:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_bytes32",
                              "typeString": "bytes32"
                            }
                          },
                          "nodeType": "BinaryOperation",
                          "operator": "==",
                          "rightExpression": {
                            "argumentTypes": null,
                            "arguments": [
                              {
                                "argumentTypes": null,
                                "arguments": [
                                  {
                                    "argumentTypes": null,
                                    "expression": {
                                      "argumentTypes": null,
                                      "baseExpression": {
                                        "argumentTypes": null,
                                        "id": 199,
                                        "name": "CEDStructArray",
                                        "nodeType": "Identifier",
                                        "overloadedDeclarations": [],
                                        "referencedDeclaration": 20,
                                        "src": "1897:14:0",
                                        "typeDescriptions": {
                                          "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                                          "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                                        }
                                      },
                                      "id": 201,
                                      "indexExpression": {
                                        "argumentTypes": null,
                                        "id": 200,
                                        "name": "i",
                                        "nodeType": "Identifier",
                                        "overloadedDeclarations": [],
                                        "referencedDeclaration": 177,
                                        "src": "1912:1:0",
                                        "typeDescriptions": {
                                          "typeIdentifier": "t_uint256",
                                          "typeString": "uint256"
                                        }
                                      },
                                      "isConstant": false,
                                      "isLValue": true,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "nodeType": "IndexAccess",
                                      "src": "1897:17:0",
                                      "typeDescriptions": {
                                        "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                                        "typeString": "struct CSBD.CEDStruct storage ref"
                                      }
                                    },
                                    "id": 202,
                                    "isConstant": false,
                                    "isLValue": true,
                                    "isPure": false,
                                    "lValueRequested": false,
                                    "memberName": "cid",
                                    "nodeType": "MemberAccess",
                                    "referencedDeclaration": 8,
                                    "src": "1897:21:0",
                                    "typeDescriptions": {
                                      "typeIdentifier": "t_string_storage",
                                      "typeString": "string storage ref"
                                    }
                                  }
                                ],
                                "expression": {
                                  "argumentTypes": [
                                    {
                                      "typeIdentifier": "t_string_storage",
                                      "typeString": "string storage ref"
                                    }
                                  ],
                                  "expression": {
                                    "argumentTypes": null,
                                    "id": 197,
                                    "name": "abi",
                                    "nodeType": "Identifier",
                                    "overloadedDeclarations": [],
                                    "referencedDeclaration": 392,
                                    "src": "1880:3:0",
                                    "typeDescriptions": {
                                      "typeIdentifier": "t_magic_abi",
                                      "typeString": "abi"
                                    }
                                  },
                                  "id": 198,
                                  "isConstant": false,
                                  "isLValue": false,
                                  "isPure": true,
                                  "lValueRequested": false,
                                  "memberName": "encodePacked",
                                  "nodeType": "MemberAccess",
                                  "referencedDeclaration": null,
                                  "src": "1880:16:0",
                                  "typeDescriptions": {
                                    "typeIdentifier": "t_function_abiencodepacked_pure$__$returns$_t_bytes_memory_ptr_$",
                                    "typeString": "function () pure returns (bytes memory)"
                                  }
                                },
                                "id": 203,
                                "isConstant": false,
                                "isLValue": false,
                                "isPure": false,
                                "kind": "functionCall",
                                "lValueRequested": false,
                                "names": [],
                                "nodeType": "FunctionCall",
                                "src": "1880:39:0",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_bytes_memory_ptr",
                                  "typeString": "bytes memory"
                                }
                              }
                            ],
                            "expression": {
                              "argumentTypes": [
                                {
                                  "typeIdentifier": "t_bytes_memory_ptr",
                                  "typeString": "bytes memory"
                                }
                              ],
                              "id": 196,
                              "name": "keccak256",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 399,
                              "src": "1870:9:0",
                              "typeDescriptions": {
                                "typeIdentifier": "t_function_sha3_pure$__$returns$_t_bytes32_$",
                                "typeString": "function () pure returns (bytes32)"
                              }
                            },
                            "id": 204,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "kind": "functionCall",
                            "lValueRequested": false,
                            "names": [],
                            "nodeType": "FunctionCall",
                            "src": "1870:50:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_bytes32",
                              "typeString": "bytes32"
                            }
                          },
                          "src": "1835:85:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_bool",
                            "typeString": "bool"
                          }
                        },
                        "falseBody": null,
                        "id": 233,
                        "nodeType": "IfStatement",
                        "src": "1830:287:0",
                        "trueBody": {
                          "id": 232,
                          "nodeType": "Block",
                          "src": "1923:194:0",
                          "statements": [
                            {
                              "expression": {
                                "argumentTypes": null,
                                "components": [
                                  {
                                    "argumentTypes": null,
                                    "expression": {
                                      "argumentTypes": null,
                                      "baseExpression": {
                                        "argumentTypes": null,
                                        "id": 206,
                                        "name": "CEDStructArray",
                                        "nodeType": "Identifier",
                                        "overloadedDeclarations": [],
                                        "referencedDeclaration": 20,
                                        "src": "1946:14:0",
                                        "typeDescriptions": {
                                          "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                                          "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                                        }
                                      },
                                      "id": 208,
                                      "indexExpression": {
                                        "argumentTypes": null,
                                        "id": 207,
                                        "name": "i",
                                        "nodeType": "Identifier",
                                        "overloadedDeclarations": [],
                                        "referencedDeclaration": 177,
                                        "src": "1961:1:0",
                                        "typeDescriptions": {
                                          "typeIdentifier": "t_uint256",
                                          "typeString": "uint256"
                                        }
                                      },
                                      "isConstant": false,
                                      "isLValue": true,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "nodeType": "IndexAccess",
                                      "src": "1946:17:0",
                                      "typeDescriptions": {
                                        "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                                        "typeString": "struct CSBD.CEDStruct storage ref"
                                      }
                                    },
                                    "id": 209,
                                    "isConstant": false,
                                    "isLValue": true,
                                    "isPure": false,
                                    "lValueRequested": false,
                                    "memberName": "id",
                                    "nodeType": "MemberAccess",
                                    "referencedDeclaration": 6,
                                    "src": "1946:20:0",
                                    "typeDescriptions": {
                                      "typeIdentifier": "t_uint256",
                                      "typeString": "uint256"
                                    }
                                  },
                                  {
                                    "argumentTypes": null,
                                    "expression": {
                                      "argumentTypes": null,
                                      "baseExpression": {
                                        "argumentTypes": null,
                                        "id": 210,
                                        "name": "CEDStructArray",
                                        "nodeType": "Identifier",
                                        "overloadedDeclarations": [],
                                        "referencedDeclaration": 20,
                                        "src": "1968:14:0",
                                        "typeDescriptions": {
                                          "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                                          "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                                        }
                                      },
                                      "id": 212,
                                      "indexExpression": {
                                        "argumentTypes": null,
                                        "id": 211,
                                        "name": "i",
                                        "nodeType": "Identifier",
                                        "overloadedDeclarations": [],
                                        "referencedDeclaration": 177,
                                        "src": "1983:1:0",
                                        "typeDescriptions": {
                                          "typeIdentifier": "t_uint256",
                                          "typeString": "uint256"
                                        }
                                      },
                                      "isConstant": false,
                                      "isLValue": true,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "nodeType": "IndexAccess",
                                      "src": "1968:17:0",
                                      "typeDescriptions": {
                                        "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                                        "typeString": "struct CSBD.CEDStruct storage ref"
                                      }
                                    },
                                    "id": 213,
                                    "isConstant": false,
                                    "isLValue": true,
                                    "isPure": false,
                                    "lValueRequested": false,
                                    "memberName": "cid",
                                    "nodeType": "MemberAccess",
                                    "referencedDeclaration": 8,
                                    "src": "1968:21:0",
                                    "typeDescriptions": {
                                      "typeIdentifier": "t_string_storage",
                                      "typeString": "string storage ref"
                                    }
                                  },
                                  {
                                    "argumentTypes": null,
                                    "expression": {
                                      "argumentTypes": null,
                                      "baseExpression": {
                                        "argumentTypes": null,
                                        "id": 214,
                                        "name": "CEDStructArray",
                                        "nodeType": "Identifier",
                                        "overloadedDeclarations": [],
                                        "referencedDeclaration": 20,
                                        "src": "1990:14:0",
                                        "typeDescriptions": {
                                          "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                                          "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                                        }
                                      },
                                      "id": 216,
                                      "indexExpression": {
                                        "argumentTypes": null,
                                        "id": 215,
                                        "name": "i",
                                        "nodeType": "Identifier",
                                        "overloadedDeclarations": [],
                                        "referencedDeclaration": 177,
                                        "src": "2005:1:0",
                                        "typeDescriptions": {
                                          "typeIdentifier": "t_uint256",
                                          "typeString": "uint256"
                                        }
                                      },
                                      "isConstant": false,
                                      "isLValue": true,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "nodeType": "IndexAccess",
                                      "src": "1990:17:0",
                                      "typeDescriptions": {
                                        "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                                        "typeString": "struct CSBD.CEDStruct storage ref"
                                      }
                                    },
                                    "id": 217,
                                    "isConstant": false,
                                    "isLValue": true,
                                    "isPure": false,
                                    "lValueRequested": false,
                                    "memberName": "fullname",
                                    "nodeType": "MemberAccess",
                                    "referencedDeclaration": 10,
                                    "src": "1990:26:0",
                                    "typeDescriptions": {
                                      "typeIdentifier": "t_string_storage",
                                      "typeString": "string storage ref"
                                    }
                                  },
                                  {
                                    "argumentTypes": null,
                                    "expression": {
                                      "argumentTypes": null,
                                      "baseExpression": {
                                        "argumentTypes": null,
                                        "id": 218,
                                        "name": "CEDStructArray",
                                        "nodeType": "Identifier",
                                        "overloadedDeclarations": [],
                                        "referencedDeclaration": 20,
                                        "src": "2017:14:0",
                                        "typeDescriptions": {
                                          "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                                          "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                                        }
                                      },
                                      "id": 220,
                                      "indexExpression": {
                                        "argumentTypes": null,
                                        "id": 219,
                                        "name": "i",
                                        "nodeType": "Identifier",
                                        "overloadedDeclarations": [],
                                        "referencedDeclaration": 177,
                                        "src": "2032:1:0",
                                        "typeDescriptions": {
                                          "typeIdentifier": "t_uint256",
                                          "typeString": "uint256"
                                        }
                                      },
                                      "isConstant": false,
                                      "isLValue": true,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "nodeType": "IndexAccess",
                                      "src": "2017:17:0",
                                      "typeDescriptions": {
                                        "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                                        "typeString": "struct CSBD.CEDStruct storage ref"
                                      }
                                    },
                                    "id": 221,
                                    "isConstant": false,
                                    "isLValue": true,
                                    "isPure": false,
                                    "lValueRequested": false,
                                    "memberName": "coursename",
                                    "nodeType": "MemberAccess",
                                    "referencedDeclaration": 12,
                                    "src": "2017:28:0",
                                    "typeDescriptions": {
                                      "typeIdentifier": "t_string_storage",
                                      "typeString": "string storage ref"
                                    }
                                  },
                                  {
                                    "argumentTypes": null,
                                    "expression": {
                                      "argumentTypes": null,
                                      "baseExpression": {
                                        "argumentTypes": null,
                                        "id": 222,
                                        "name": "CEDStructArray",
                                        "nodeType": "Identifier",
                                        "overloadedDeclarations": [],
                                        "referencedDeclaration": 20,
                                        "src": "2046:14:0",
                                        "typeDescriptions": {
                                          "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                                          "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                                        }
                                      },
                                      "id": 224,
                                      "indexExpression": {
                                        "argumentTypes": null,
                                        "id": 223,
                                        "name": "i",
                                        "nodeType": "Identifier",
                                        "overloadedDeclarations": [],
                                        "referencedDeclaration": 177,
                                        "src": "2061:1:0",
                                        "typeDescriptions": {
                                          "typeIdentifier": "t_uint256",
                                          "typeString": "uint256"
                                        }
                                      },
                                      "isConstant": false,
                                      "isLValue": true,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "nodeType": "IndexAccess",
                                      "src": "2046:17:0",
                                      "typeDescriptions": {
                                        "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                                        "typeString": "struct CSBD.CEDStruct storage ref"
                                      }
                                    },
                                    "id": 225,
                                    "isConstant": false,
                                    "isLValue": true,
                                    "isPure": false,
                                    "lValueRequested": false,
                                    "memberName": "issuedOn",
                                    "nodeType": "MemberAccess",
                                    "referencedDeclaration": 14,
                                    "src": "2046:26:0",
                                    "typeDescriptions": {
                                      "typeIdentifier": "t_string_storage",
                                      "typeString": "string storage ref"
                                    }
                                  },
                                  {
                                    "argumentTypes": null,
                                    "expression": {
                                      "argumentTypes": null,
                                      "baseExpression": {
                                        "argumentTypes": null,
                                        "id": 226,
                                        "name": "CEDStructArray",
                                        "nodeType": "Identifier",
                                        "overloadedDeclarations": [],
                                        "referencedDeclaration": 20,
                                        "src": "2074:14:0",
                                        "typeDescriptions": {
                                          "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                                          "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                                        }
                                      },
                                      "id": 228,
                                      "indexExpression": {
                                        "argumentTypes": null,
                                        "id": 227,
                                        "name": "i",
                                        "nodeType": "Identifier",
                                        "overloadedDeclarations": [],
                                        "referencedDeclaration": 177,
                                        "src": "2089:1:0",
                                        "typeDescriptions": {
                                          "typeIdentifier": "t_uint256",
                                          "typeString": "uint256"
                                        }
                                      },
                                      "isConstant": false,
                                      "isLValue": true,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "nodeType": "IndexAccess",
                                      "src": "2074:17:0",
                                      "typeDescriptions": {
                                        "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                                        "typeString": "struct CSBD.CEDStruct storage ref"
                                      }
                                    },
                                    "id": 229,
                                    "isConstant": false,
                                    "isLValue": true,
                                    "isPure": false,
                                    "lValueRequested": false,
                                    "memberName": "validUntil",
                                    "nodeType": "MemberAccess",
                                    "referencedDeclaration": 16,
                                    "src": "2074:28:0",
                                    "typeDescriptions": {
                                      "typeIdentifier": "t_string_storage",
                                      "typeString": "string storage ref"
                                    }
                                  }
                                ],
                                "id": 230,
                                "isConstant": false,
                                "isInlineArray": false,
                                "isLValue": false,
                                "isPure": false,
                                "lValueRequested": false,
                                "nodeType": "TupleExpression",
                                "src": "1945:158:0",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_tuple$_t_uint256_$_t_string_storage_$_t_string_storage_$_t_string_storage_$_t_string_storage_$_t_string_storage_$",
                                  "typeString": "tuple(uint256,string storage ref,string storage ref,string storage ref,string storage ref,string storage ref)"
                                }
                              },
                              "functionReturnParameters": 175,
                              "id": 231,
                              "nodeType": "Return",
                              "src": "1938:165:0"
                            }
                          ]
                        }
                      }
                    ]
                  },
                  "condition": {
                    "argumentTypes": null,
                    "commonType": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "id": 186,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftExpression": {
                      "argumentTypes": null,
                      "id": 184,
                      "name": "i",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 177,
                      "src": "1802:1:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "nodeType": "BinaryOperation",
                    "operator": ">=",
                    "rightExpression": {
                      "argumentTypes": null,
                      "hexValue": "30",
                      "id": 185,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": true,
                      "kind": "number",
                      "lValueRequested": false,
                      "nodeType": "Literal",
                      "src": "1807:1:0",
                      "subdenomination": null,
                      "typeDescriptions": {
                        "typeIdentifier": "t_rational_0_by_1",
                        "typeString": "int_const 0"
                      },
                      "value": "0"
                    },
                    "src": "1802:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_bool",
                      "typeString": "bool"
                    }
                  },
                  "id": 235,
                  "initializationExpression": {
                    "assignments": [
                      177
                    ],
                    "declarations": [
                      {
                        "constant": false,
                        "id": 177,
                        "name": "i",
                        "nodeType": "VariableDeclaration",
                        "scope": 237,
                        "src": "1763:9:0",
                        "stateVariable": false,
                        "storageLocation": "default",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        },
                        "typeName": {
                          "id": 176,
                          "name": "uint256",
                          "nodeType": "ElementaryTypeName",
                          "src": "1763:7:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        },
                        "value": null,
                        "visibility": "internal"
                      }
                    ],
                    "id": 183,
                    "initialValue": {
                      "argumentTypes": null,
                      "components": [
                        {
                          "argumentTypes": null,
                          "commonType": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          },
                          "id": 181,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "leftExpression": {
                            "argumentTypes": null,
                            "expression": {
                              "argumentTypes": null,
                              "id": 178,
                              "name": "CEDStructArray",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 20,
                              "src": "1776:14:0",
                              "typeDescriptions": {
                                "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                                "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                              }
                            },
                            "id": 179,
                            "isConstant": false,
                            "isLValue": true,
                            "isPure": false,
                            "lValueRequested": false,
                            "memberName": "length",
                            "nodeType": "MemberAccess",
                            "referencedDeclaration": null,
                            "src": "1776:21:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "nodeType": "BinaryOperation",
                          "operator": "-",
                          "rightExpression": {
                            "argumentTypes": null,
                            "hexValue": "31",
                            "id": 180,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": true,
                            "kind": "number",
                            "lValueRequested": false,
                            "nodeType": "Literal",
                            "src": "1798:1:0",
                            "subdenomination": null,
                            "typeDescriptions": {
                              "typeIdentifier": "t_rational_1_by_1",
                              "typeString": "int_const 1"
                            },
                            "value": "1"
                          },
                          "src": "1776:23:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        }
                      ],
                      "id": 182,
                      "isConstant": false,
                      "isInlineArray": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "nodeType": "TupleExpression",
                      "src": "1775:25:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "nodeType": "VariableDeclarationStatement",
                    "src": "1763:37:0"
                  },
                  "loopExpression": {
                    "expression": {
                      "argumentTypes": null,
                      "id": 188,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "nodeType": "UnaryOperation",
                      "operator": "--",
                      "prefix": false,
                      "src": "1812:3:0",
                      "subExpression": {
                        "argumentTypes": null,
                        "id": 187,
                        "name": "i",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 177,
                        "src": "1812:1:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "id": 189,
                    "nodeType": "ExpressionStatement",
                    "src": "1812:3:0"
                  },
                  "nodeType": "ForStatement",
                  "src": "1758:368:0"
                }
              ]
            },
            "documentation": null,
            "id": 237,
            "implemented": true,
            "isConstructor": false,
            "isDeclaredConst": true,
            "modifiers": [],
            "name": "getCEDStructsByCID",
            "nodeType": "FunctionDefinition",
            "parameters": {
              "id": 162,
              "nodeType": "ParameterList",
              "parameters": [
                {
                  "constant": false,
                  "id": 161,
                  "name": "_cid",
                  "nodeType": "VariableDeclaration",
                  "scope": 237,
                  "src": "1659:11:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 160,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "1659:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                }
              ],
              "src": "1658:13:0"
            },
            "payable": false,
            "returnParameters": {
              "id": 175,
              "nodeType": "ParameterList",
              "parameters": [
                {
                  "constant": false,
                  "id": 164,
                  "name": "",
                  "nodeType": "VariableDeclaration",
                  "scope": 237,
                  "src": "1697:7:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_uint256",
                    "typeString": "uint256"
                  },
                  "typeName": {
                    "id": 163,
                    "name": "uint256",
                    "nodeType": "ElementaryTypeName",
                    "src": "1697:7:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 166,
                  "name": "",
                  "nodeType": "VariableDeclaration",
                  "scope": 237,
                  "src": "1707:6:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 165,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "1707:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 168,
                  "name": "",
                  "nodeType": "VariableDeclaration",
                  "scope": 237,
                  "src": "1716:6:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 167,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "1716:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 170,
                  "name": "",
                  "nodeType": "VariableDeclaration",
                  "scope": 237,
                  "src": "1724:6:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 169,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "1724:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 172,
                  "name": "",
                  "nodeType": "VariableDeclaration",
                  "scope": 237,
                  "src": "1732:6:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 171,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "1732:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 174,
                  "name": "",
                  "nodeType": "VariableDeclaration",
                  "scope": 237,
                  "src": "1740:6:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 173,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "1740:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                }
              ],
              "src": "1696:52:0"
            },
            "scope": 277,
            "src": "1631:506:0",
            "stateMutability": "view",
            "superFunction": null,
            "visibility": "public"
          },
          {
            "body": {
              "id": 245,
              "nodeType": "Block",
              "src": "2203:47:0",
              "statements": [
                {
                  "expression": {
                    "argumentTypes": null,
                    "expression": {
                      "argumentTypes": null,
                      "id": 242,
                      "name": "CEDStructArray",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 20,
                      "src": "2221:14:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                        "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                      }
                    },
                    "id": 243,
                    "isConstant": false,
                    "isLValue": true,
                    "isPure": false,
                    "lValueRequested": false,
                    "memberName": "length",
                    "nodeType": "MemberAccess",
                    "referencedDeclaration": null,
                    "src": "2221:21:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    }
                  },
                  "functionReturnParameters": 241,
                  "id": 244,
                  "nodeType": "Return",
                  "src": "2214:28:0"
                }
              ]
            },
            "documentation": null,
            "id": 246,
            "implemented": true,
            "isConstructor": false,
            "isDeclaredConst": true,
            "modifiers": [],
            "name": "countCEDStruct",
            "nodeType": "FunctionDefinition",
            "parameters": {
              "id": 238,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "2170:2:0"
            },
            "payable": false,
            "returnParameters": {
              "id": 241,
              "nodeType": "ParameterList",
              "parameters": [
                {
                  "constant": false,
                  "id": 240,
                  "name": "",
                  "nodeType": "VariableDeclaration",
                  "scope": 246,
                  "src": "2194:7:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_uint256",
                    "typeString": "uint256"
                  },
                  "typeName": {
                    "id": 239,
                    "name": "uint256",
                    "nodeType": "ElementaryTypeName",
                    "src": "2194:7:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                }
              ],
              "src": "2193:9:0"
            },
            "scope": 277,
            "src": "2147:103:0",
            "stateMutability": "view",
            "superFunction": null,
            "visibility": "public"
          },
          {
            "body": {
              "id": 275,
              "nodeType": "Block",
              "src": "2403:95:0",
              "statements": [
                {
                  "expression": {
                    "argumentTypes": null,
                    "components": [
                      {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "id": 261,
                          "name": "CED",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 22,
                          "src": "2418:3:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref"
                          }
                        },
                        "id": 262,
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "id",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 6,
                        "src": "2418:6:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "id": 263,
                          "name": "CED",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 22,
                          "src": "2426:3:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref"
                          }
                        },
                        "id": 264,
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "cid",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 8,
                        "src": "2426:7:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_string_storage",
                          "typeString": "string storage ref"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "id": 265,
                          "name": "CED",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 22,
                          "src": "2434:3:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref"
                          }
                        },
                        "id": 266,
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "fullname",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 10,
                        "src": "2434:12:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_string_storage",
                          "typeString": "string storage ref"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "id": 267,
                          "name": "CED",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 22,
                          "src": "2447:3:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref"
                          }
                        },
                        "id": 268,
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "coursename",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 12,
                        "src": "2447:14:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_string_storage",
                          "typeString": "string storage ref"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "id": 269,
                          "name": "CED",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 22,
                          "src": "2462:3:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref"
                          }
                        },
                        "id": 270,
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "issuedOn",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 14,
                        "src": "2462:12:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_string_storage",
                          "typeString": "string storage ref"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "id": 271,
                          "name": "CED",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 22,
                          "src": "2476:3:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref"
                          }
                        },
                        "id": 272,
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "validUntil",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 16,
                        "src": "2476:14:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_string_storage",
                          "typeString": "string storage ref"
                        }
                      }
                    ],
                    "id": 273,
                    "isConstant": false,
                    "isInlineArray": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "nodeType": "TupleExpression",
                    "src": "2417:75:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_tuple$_t_uint256_$_t_string_storage_$_t_string_storage_$_t_string_storage_$_t_string_storage_$_t_string_storage_$",
                      "typeString": "tuple(uint256,string storage ref,string storage ref,string storage ref,string storage ref,string storage ref)"
                    }
                  },
                  "functionReturnParameters": 260,
                  "id": 274,
                  "nodeType": "Return",
                  "src": "2410:82:0"
                }
              ]
            },
            "documentation": null,
            "id": 276,
            "implemented": true,
            "isConstructor": false,
            "isDeclaredConst": true,
            "modifiers": [],
            "name": "getlastCED",
            "nodeType": "FunctionDefinition",
            "parameters": {
              "id": 247,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "2275:3:0"
            },
            "payable": false,
            "returnParameters": {
              "id": 260,
              "nodeType": "ParameterList",
              "parameters": [
                {
                  "constant": false,
                  "id": 249,
                  "name": "_id",
                  "nodeType": "VariableDeclaration",
                  "scope": 276,
                  "src": "2304:11:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_uint256",
                    "typeString": "uint256"
                  },
                  "typeName": {
                    "id": 248,
                    "name": "uint256",
                    "nodeType": "ElementaryTypeName",
                    "src": "2304:7:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 251,
                  "name": "_cid",
                  "nodeType": "VariableDeclaration",
                  "scope": 276,
                  "src": "2317:11:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 250,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "2317:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 253,
                  "name": "_fullname",
                  "nodeType": "VariableDeclaration",
                  "scope": 276,
                  "src": "2330:16:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 252,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "2330:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 255,
                  "name": "_coursename",
                  "nodeType": "VariableDeclaration",
                  "scope": 276,
                  "src": "2347:18:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 254,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "2347:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 257,
                  "name": "_issuedOn",
                  "nodeType": "VariableDeclaration",
                  "scope": 276,
                  "src": "2366:16:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 256,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "2366:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 259,
                  "name": "_validUntil",
                  "nodeType": "VariableDeclaration",
                  "scope": 276,
                  "src": "2383:18:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 258,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "2383:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                }
              ],
              "src": "2303:99:0"
            },
            "scope": 277,
            "src": "2256:242:0",
            "stateMutability": "view",
            "superFunction": null,
            "visibility": "public"
          }
        ],
        "scope": 278,
        "src": "56:2445:0"
      }
    ],
    "src": "0:2501:0"
  },
  "legacyAST": {
    "absolutePath": "/E/Project/contracts/CSBD.sol",
    "exportedSymbols": {
      "CSBD": [
        277
      ]
    },
    "id": 278,
    "nodeType": "SourceUnit",
    "nodes": [
      {
        "id": 1,
        "literals": [
          "solidity",
          "^",
          "0.4",
          ".0"
        ],
        "nodeType": "PragmaDirective",
        "src": "0:23:0"
      },
      {
        "absolutePath": "/E/Project/contracts/Ownable.sol",
        "file": "./Ownable.sol",
        "id": 2,
        "nodeType": "ImportDirective",
        "scope": 278,
        "sourceUnit": 391,
        "src": "27:23:0",
        "symbolAliases": [],
        "unitAlias": ""
      },
      {
        "baseContracts": [
          {
            "arguments": null,
            "baseName": {
              "contractScope": null,
              "id": 3,
              "name": "Ownable",
              "nodeType": "UserDefinedTypeName",
              "referencedDeclaration": 390,
              "src": "73:7:0",
              "typeDescriptions": {
                "typeIdentifier": "t_contract$_Ownable_$390",
                "typeString": "contract Ownable"
              }
            },
            "id": 4,
            "nodeType": "InheritanceSpecifier",
            "src": "73:7:0"
          }
        ],
        "contractDependencies": [
          390
        ],
        "contractKind": "contract",
        "documentation": null,
        "fullyImplemented": true,
        "id": 277,
        "linearizedBaseContracts": [
          277,
          390
        ],
        "name": "CSBD",
        "nodeType": "ContractDefinition",
        "nodes": [
          {
            "canonicalName": "CSBD.CEDStruct",
            "id": 17,
            "members": [
              {
                "constant": false,
                "id": 6,
                "name": "id",
                "nodeType": "VariableDeclaration",
                "scope": 17,
                "src": "112:10:0",
                "stateVariable": false,
                "storageLocation": "default",
                "typeDescriptions": {
                  "typeIdentifier": "t_uint256",
                  "typeString": "uint256"
                },
                "typeName": {
                  "id": 5,
                  "name": "uint256",
                  "nodeType": "ElementaryTypeName",
                  "src": "112:7:0",
                  "typeDescriptions": {
                    "typeIdentifier": "t_uint256",
                    "typeString": "uint256"
                  }
                },
                "value": null,
                "visibility": "internal"
              },
              {
                "constant": false,
                "id": 8,
                "name": "cid",
                "nodeType": "VariableDeclaration",
                "scope": 17,
                "src": "129:10:0",
                "stateVariable": false,
                "storageLocation": "default",
                "typeDescriptions": {
                  "typeIdentifier": "t_string_storage_ptr",
                  "typeString": "string"
                },
                "typeName": {
                  "id": 7,
                  "name": "string",
                  "nodeType": "ElementaryTypeName",
                  "src": "129:6:0",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_storage_ptr",
                    "typeString": "string"
                  }
                },
                "value": null,
                "visibility": "internal"
              },
              {
                "constant": false,
                "id": 10,
                "name": "fullname",
                "nodeType": "VariableDeclaration",
                "scope": 17,
                "src": "146:15:0",
                "stateVariable": false,
                "storageLocation": "default",
                "typeDescriptions": {
                  "typeIdentifier": "t_string_storage_ptr",
                  "typeString": "string"
                },
                "typeName": {
                  "id": 9,
                  "name": "string",
                  "nodeType": "ElementaryTypeName",
                  "src": "146:6:0",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_storage_ptr",
                    "typeString": "string"
                  }
                },
                "value": null,
                "visibility": "internal"
              },
              {
                "constant": false,
                "id": 12,
                "name": "coursename",
                "nodeType": "VariableDeclaration",
                "scope": 17,
                "src": "168:17:0",
                "stateVariable": false,
                "storageLocation": "default",
                "typeDescriptions": {
                  "typeIdentifier": "t_string_storage_ptr",
                  "typeString": "string"
                },
                "typeName": {
                  "id": 11,
                  "name": "string",
                  "nodeType": "ElementaryTypeName",
                  "src": "168:6:0",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_storage_ptr",
                    "typeString": "string"
                  }
                },
                "value": null,
                "visibility": "internal"
              },
              {
                "constant": false,
                "id": 14,
                "name": "issuedOn",
                "nodeType": "VariableDeclaration",
                "scope": 17,
                "src": "192:15:0",
                "stateVariable": false,
                "storageLocation": "default",
                "typeDescriptions": {
                  "typeIdentifier": "t_string_storage_ptr",
                  "typeString": "string"
                },
                "typeName": {
                  "id": 13,
                  "name": "string",
                  "nodeType": "ElementaryTypeName",
                  "src": "192:6:0",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_storage_ptr",
                    "typeString": "string"
                  }
                },
                "value": null,
                "visibility": "internal"
              },
              {
                "constant": false,
                "id": 16,
                "name": "validUntil",
                "nodeType": "VariableDeclaration",
                "scope": 17,
                "src": "214:17:0",
                "stateVariable": false,
                "storageLocation": "default",
                "typeDescriptions": {
                  "typeIdentifier": "t_string_storage_ptr",
                  "typeString": "string"
                },
                "typeName": {
                  "id": 15,
                  "name": "string",
                  "nodeType": "ElementaryTypeName",
                  "src": "214:6:0",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_storage_ptr",
                    "typeString": "string"
                  }
                },
                "value": null,
                "visibility": "internal"
              }
            ],
            "name": "CEDStruct",
            "nodeType": "StructDefinition",
            "scope": 277,
            "src": "88:149:0",
            "visibility": "public"
          },
          {
            "constant": false,
            "id": 20,
            "name": "CEDStructArray",
            "nodeType": "VariableDeclaration",
            "scope": 277,
            "src": "246:33:0",
            "stateVariable": true,
            "storageLocation": "default",
            "typeDescriptions": {
              "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
              "typeString": "struct CSBD.CEDStruct[]"
            },
            "typeName": {
              "baseType": {
                "contractScope": null,
                "id": 18,
                "name": "CEDStruct",
                "nodeType": "UserDefinedTypeName",
                "referencedDeclaration": 17,
                "src": "246:9:0",
                "typeDescriptions": {
                  "typeIdentifier": "t_struct$_CEDStruct_$17_storage_ptr",
                  "typeString": "struct CSBD.CEDStruct"
                }
              },
              "id": 19,
              "length": null,
              "nodeType": "ArrayTypeName",
              "src": "246:11:0",
              "typeDescriptions": {
                "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage_ptr",
                "typeString": "struct CSBD.CEDStruct[]"
              }
            },
            "value": null,
            "visibility": "public"
          },
          {
            "constant": false,
            "id": 22,
            "name": "CED",
            "nodeType": "VariableDeclaration",
            "scope": 277,
            "src": "286:20:0",
            "stateVariable": true,
            "storageLocation": "default",
            "typeDescriptions": {
              "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
              "typeString": "struct CSBD.CEDStruct"
            },
            "typeName": {
              "contractScope": null,
              "id": 21,
              "name": "CEDStruct",
              "nodeType": "UserDefinedTypeName",
              "referencedDeclaration": 17,
              "src": "286:9:0",
              "typeDescriptions": {
                "typeIdentifier": "t_struct$_CEDStruct_$17_storage_ptr",
                "typeString": "struct CSBD.CEDStruct"
              }
            },
            "value": null,
            "visibility": "public"
          },
          {
            "constant": false,
            "id": 25,
            "name": "CEDID",
            "nodeType": "VariableDeclaration",
            "scope": 277,
            "src": "315:23:0",
            "stateVariable": true,
            "storageLocation": "default",
            "typeDescriptions": {
              "typeIdentifier": "t_uint256",
              "typeString": "uint256"
            },
            "typeName": {
              "id": 23,
              "name": "uint256",
              "nodeType": "ElementaryTypeName",
              "src": "315:7:0",
              "typeDescriptions": {
                "typeIdentifier": "t_uint256",
                "typeString": "uint256"
              }
            },
            "value": {
              "argumentTypes": null,
              "hexValue": "30",
              "id": 24,
              "isConstant": false,
              "isLValue": false,
              "isPure": true,
              "kind": "number",
              "lValueRequested": false,
              "nodeType": "Literal",
              "src": "337:1:0",
              "subdenomination": null,
              "typeDescriptions": {
                "typeIdentifier": "t_rational_0_by_1",
                "typeString": "int_const 0"
              },
              "value": "0"
            },
            "visibility": "public"
          },
          {
            "constant": false,
            "id": 27,
            "name": "cert",
            "nodeType": "VariableDeclaration",
            "scope": 277,
            "src": "395:11:0",
            "stateVariable": true,
            "storageLocation": "default",
            "typeDescriptions": {
              "typeIdentifier": "t_string_storage",
              "typeString": "string"
            },
            "typeName": {
              "id": 26,
              "name": "string",
              "nodeType": "ElementaryTypeName",
              "src": "395:6:0",
              "typeDescriptions": {
                "typeIdentifier": "t_string_storage_ptr",
                "typeString": "string"
              }
            },
            "value": null,
            "visibility": "internal"
          },
          {
            "body": {
              "id": 34,
              "nodeType": "Block",
              "src": "484:58:0",
              "statements": [
                {
                  "expression": {
                    "argumentTypes": null,
                    "id": 32,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftHandSide": {
                      "argumentTypes": null,
                      "id": 30,
                      "name": "cert",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 27,
                      "src": "491:4:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_string_storage",
                        "typeString": "string storage ref"
                      }
                    },
                    "nodeType": "Assignment",
                    "operator": "=",
                    "rightHandSide": {
                      "argumentTypes": null,
                      "hexValue": "436572746966696365642053656e696f7220426c6f636b636861696e2050726f6772616d",
                      "id": 31,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": true,
                      "kind": "string",
                      "lValueRequested": false,
                      "nodeType": "Literal",
                      "src": "498:38:0",
                      "subdenomination": null,
                      "typeDescriptions": {
                        "typeIdentifier": "t_stringliteral_2b38542bfd92924ef861e9e4fcb810522a8a256164cc0fc7ffdd427f8d844f07",
                        "typeString": "literal_string \"Certificed Senior Blockchain Program\""
                      },
                      "value": "Certificed Senior Blockchain Program"
                    },
                    "src": "491:45:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage",
                      "typeString": "string storage ref"
                    }
                  },
                  "id": 33,
                  "nodeType": "ExpressionStatement",
                  "src": "491:45:0"
                }
              ]
            },
            "documentation": null,
            "id": 35,
            "implemented": true,
            "isConstructor": true,
            "isDeclaredConst": false,
            "modifiers": [],
            "name": "",
            "nodeType": "FunctionDefinition",
            "parameters": {
              "id": 28,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "474:2:0"
            },
            "payable": false,
            "returnParameters": {
              "id": 29,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "484:0:0"
            },
            "scope": 277,
            "src": "462:80:0",
            "stateMutability": "nonpayable",
            "superFunction": null,
            "visibility": "public"
          },
          {
            "body": {
              "id": 98,
              "nodeType": "Block",
              "src": "985:279:0",
              "statements": [
                {
                  "expression": {
                    "argumentTypes": null,
                    "id": 52,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftHandSide": {
                      "argumentTypes": null,
                      "id": 50,
                      "name": "CEDID",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 25,
                      "src": "996:5:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "nodeType": "Assignment",
                    "operator": "+=",
                    "rightHandSide": {
                      "argumentTypes": null,
                      "hexValue": "31",
                      "id": 51,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": true,
                      "kind": "number",
                      "lValueRequested": false,
                      "nodeType": "Literal",
                      "src": "1005:1:0",
                      "subdenomination": null,
                      "typeDescriptions": {
                        "typeIdentifier": "t_rational_1_by_1",
                        "typeString": "int_const 1"
                      },
                      "value": "1"
                    },
                    "src": "996:10:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    }
                  },
                  "id": 53,
                  "nodeType": "ExpressionStatement",
                  "src": "996:10:0"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "id": 58,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftHandSide": {
                      "argumentTypes": null,
                      "expression": {
                        "argumentTypes": null,
                        "id": 54,
                        "name": "CED",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 22,
                        "src": "1017:3:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                          "typeString": "struct CSBD.CEDStruct storage ref"
                        }
                      },
                      "id": 56,
                      "isConstant": false,
                      "isLValue": true,
                      "isPure": false,
                      "lValueRequested": true,
                      "memberName": "id",
                      "nodeType": "MemberAccess",
                      "referencedDeclaration": 6,
                      "src": "1017:6:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "nodeType": "Assignment",
                    "operator": "=",
                    "rightHandSide": {
                      "argumentTypes": null,
                      "id": 57,
                      "name": "CEDID",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 25,
                      "src": "1026:5:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "src": "1017:14:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    }
                  },
                  "id": 59,
                  "nodeType": "ExpressionStatement",
                  "src": "1017:14:0"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "id": 64,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftHandSide": {
                      "argumentTypes": null,
                      "expression": {
                        "argumentTypes": null,
                        "id": 60,
                        "name": "CED",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 22,
                        "src": "1042:3:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                          "typeString": "struct CSBD.CEDStruct storage ref"
                        }
                      },
                      "id": 62,
                      "isConstant": false,
                      "isLValue": true,
                      "isPure": false,
                      "lValueRequested": true,
                      "memberName": "cid",
                      "nodeType": "MemberAccess",
                      "referencedDeclaration": 8,
                      "src": "1042:7:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_string_storage",
                        "typeString": "string storage ref"
                      }
                    },
                    "nodeType": "Assignment",
                    "operator": "=",
                    "rightHandSide": {
                      "argumentTypes": null,
                      "id": 63,
                      "name": "_cid",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 37,
                      "src": "1052:4:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_string_memory_ptr",
                        "typeString": "string memory"
                      }
                    },
                    "src": "1042:14:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage",
                      "typeString": "string storage ref"
                    }
                  },
                  "id": 65,
                  "nodeType": "ExpressionStatement",
                  "src": "1042:14:0"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "id": 70,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftHandSide": {
                      "argumentTypes": null,
                      "expression": {
                        "argumentTypes": null,
                        "id": 66,
                        "name": "CED",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 22,
                        "src": "1067:3:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                          "typeString": "struct CSBD.CEDStruct storage ref"
                        }
                      },
                      "id": 68,
                      "isConstant": false,
                      "isLValue": true,
                      "isPure": false,
                      "lValueRequested": true,
                      "memberName": "fullname",
                      "nodeType": "MemberAccess",
                      "referencedDeclaration": 10,
                      "src": "1067:12:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_string_storage",
                        "typeString": "string storage ref"
                      }
                    },
                    "nodeType": "Assignment",
                    "operator": "=",
                    "rightHandSide": {
                      "argumentTypes": null,
                      "id": 69,
                      "name": "_fullname",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 39,
                      "src": "1082:9:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_string_memory_ptr",
                        "typeString": "string memory"
                      }
                    },
                    "src": "1067:24:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage",
                      "typeString": "string storage ref"
                    }
                  },
                  "id": 71,
                  "nodeType": "ExpressionStatement",
                  "src": "1067:24:0"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "id": 76,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftHandSide": {
                      "argumentTypes": null,
                      "expression": {
                        "argumentTypes": null,
                        "id": 72,
                        "name": "CED",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 22,
                        "src": "1102:3:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                          "typeString": "struct CSBD.CEDStruct storage ref"
                        }
                      },
                      "id": 74,
                      "isConstant": false,
                      "isLValue": true,
                      "isPure": false,
                      "lValueRequested": true,
                      "memberName": "coursename",
                      "nodeType": "MemberAccess",
                      "referencedDeclaration": 12,
                      "src": "1102:14:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_string_storage",
                        "typeString": "string storage ref"
                      }
                    },
                    "nodeType": "Assignment",
                    "operator": "=",
                    "rightHandSide": {
                      "argumentTypes": null,
                      "id": 75,
                      "name": "_coursename",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 41,
                      "src": "1119:11:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_string_memory_ptr",
                        "typeString": "string memory"
                      }
                    },
                    "src": "1102:28:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage",
                      "typeString": "string storage ref"
                    }
                  },
                  "id": 77,
                  "nodeType": "ExpressionStatement",
                  "src": "1102:28:0"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "id": 82,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftHandSide": {
                      "argumentTypes": null,
                      "expression": {
                        "argumentTypes": null,
                        "id": 78,
                        "name": "CED",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 22,
                        "src": "1141:3:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                          "typeString": "struct CSBD.CEDStruct storage ref"
                        }
                      },
                      "id": 80,
                      "isConstant": false,
                      "isLValue": true,
                      "isPure": false,
                      "lValueRequested": true,
                      "memberName": "issuedOn",
                      "nodeType": "MemberAccess",
                      "referencedDeclaration": 14,
                      "src": "1141:12:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_string_storage",
                        "typeString": "string storage ref"
                      }
                    },
                    "nodeType": "Assignment",
                    "operator": "=",
                    "rightHandSide": {
                      "argumentTypes": null,
                      "id": 81,
                      "name": "_issuedOn",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 43,
                      "src": "1156:9:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_string_memory_ptr",
                        "typeString": "string memory"
                      }
                    },
                    "src": "1141:24:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage",
                      "typeString": "string storage ref"
                    }
                  },
                  "id": 83,
                  "nodeType": "ExpressionStatement",
                  "src": "1141:24:0"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "id": 88,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftHandSide": {
                      "argumentTypes": null,
                      "expression": {
                        "argumentTypes": null,
                        "id": 84,
                        "name": "CED",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 22,
                        "src": "1176:3:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                          "typeString": "struct CSBD.CEDStruct storage ref"
                        }
                      },
                      "id": 86,
                      "isConstant": false,
                      "isLValue": true,
                      "isPure": false,
                      "lValueRequested": true,
                      "memberName": "validUntil",
                      "nodeType": "MemberAccess",
                      "referencedDeclaration": 16,
                      "src": "1176:14:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_string_storage",
                        "typeString": "string storage ref"
                      }
                    },
                    "nodeType": "Assignment",
                    "operator": "=",
                    "rightHandSide": {
                      "argumentTypes": null,
                      "id": 87,
                      "name": "_validUntil",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 45,
                      "src": "1193:11:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_string_memory_ptr",
                        "typeString": "string memory"
                      }
                    },
                    "src": "1176:28:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage",
                      "typeString": "string storage ref"
                    }
                  },
                  "id": 89,
                  "nodeType": "ExpressionStatement",
                  "src": "1176:28:0"
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "commonType": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "id": 96,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftExpression": {
                      "argumentTypes": null,
                      "arguments": [
                        {
                          "argumentTypes": null,
                          "id": 93,
                          "name": "CED",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 22,
                          "src": "1245:3:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref"
                          }
                        }
                      ],
                      "expression": {
                        "argumentTypes": [
                          {
                            "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref"
                          }
                        ],
                        "expression": {
                          "argumentTypes": null,
                          "id": 90,
                          "name": "CEDStructArray",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 20,
                          "src": "1225:14:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                          }
                        },
                        "id": 92,
                        "isConstant": false,
                        "isLValue": false,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "push",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": null,
                        "src": "1225:19:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_function_arraypush_nonpayable$_t_struct$_CEDStruct_$17_storage_$returns$_t_uint256_$",
                          "typeString": "function (struct CSBD.CEDStruct storage ref) returns (uint256)"
                        }
                      },
                      "id": 94,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "kind": "functionCall",
                      "lValueRequested": false,
                      "names": [],
                      "nodeType": "FunctionCall",
                      "src": "1225:24:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "nodeType": "BinaryOperation",
                    "operator": "-",
                    "rightExpression": {
                      "argumentTypes": null,
                      "hexValue": "31",
                      "id": 95,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": true,
                      "kind": "number",
                      "lValueRequested": false,
                      "nodeType": "Literal",
                      "src": "1251:1:0",
                      "subdenomination": null,
                      "typeDescriptions": {
                        "typeIdentifier": "t_rational_1_by_1",
                        "typeString": "int_const 1"
                      },
                      "value": "1"
                    },
                    "src": "1225:27:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    }
                  },
                  "id": 97,
                  "nodeType": "ExpressionStatement",
                  "src": "1225:27:0"
                }
              ]
            },
            "documentation": null,
            "id": 99,
            "implemented": true,
            "isConstructor": false,
            "isDeclaredConst": false,
            "modifiers": [
              {
                "arguments": null,
                "id": 48,
                "modifierName": {
                  "argumentTypes": null,
                  "id": 47,
                  "name": "onlyOwner",
                  "nodeType": "Identifier",
                  "overloadedDeclarations": [],
                  "referencedDeclaration": 364,
                  "src": "975:9:0",
                  "typeDescriptions": {
                    "typeIdentifier": "t_modifier$__$",
                    "typeString": "modifier ()"
                  }
                },
                "nodeType": "ModifierInvocation",
                "src": "975:9:0"
              }
            ],
            "name": "setCED",
            "nodeType": "FunctionDefinition",
            "parameters": {
              "id": 46,
              "nodeType": "ParameterList",
              "parameters": [
                {
                  "constant": false,
                  "id": 37,
                  "name": "_cid",
                  "nodeType": "VariableDeclaration",
                  "scope": 99,
                  "src": "881:11:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 36,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "881:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 39,
                  "name": "_fullname",
                  "nodeType": "VariableDeclaration",
                  "scope": 99,
                  "src": "894:16:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 38,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "894:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 41,
                  "name": "_coursename",
                  "nodeType": "VariableDeclaration",
                  "scope": 99,
                  "src": "911:18:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 40,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "911:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 43,
                  "name": "_issuedOn",
                  "nodeType": "VariableDeclaration",
                  "scope": 99,
                  "src": "930:16:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 42,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "930:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 45,
                  "name": "_validUntil",
                  "nodeType": "VariableDeclaration",
                  "scope": 99,
                  "src": "947:18:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 44,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "947:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                }
              ],
              "src": "880:87:0"
            },
            "payable": false,
            "returnParameters": {
              "id": 49,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "985:0:0"
            },
            "scope": 277,
            "src": "865:399:0",
            "stateMutability": "nonpayable",
            "superFunction": null,
            "visibility": "public"
          },
          {
            "body": {
              "id": 158,
              "nodeType": "Block",
              "src": "1386:234:0",
              "statements": [
                {
                  "condition": {
                    "argumentTypes": null,
                    "commonType": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "id": 118,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftExpression": {
                      "argumentTypes": null,
                      "id": 116,
                      "name": "i",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 101,
                      "src": "1399:1:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "nodeType": "BinaryOperation",
                    "operator": ">",
                    "rightExpression": {
                      "argumentTypes": null,
                      "hexValue": "30",
                      "id": 117,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": true,
                      "kind": "number",
                      "lValueRequested": false,
                      "nodeType": "Literal",
                      "src": "1401:1:0",
                      "subdenomination": null,
                      "typeDescriptions": {
                        "typeIdentifier": "t_rational_0_by_1",
                        "typeString": "int_const 0"
                      },
                      "value": "0"
                    },
                    "src": "1399:3:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_bool",
                      "typeString": "bool"
                    }
                  },
                  "falseBody": {
                    "id": 130,
                    "nodeType": "Block",
                    "src": "1430:9:0",
                    "statements": [
                      {
                        "expression": {
                          "argumentTypes": null,
                          "id": 128,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "leftHandSide": {
                            "argumentTypes": null,
                            "id": 126,
                            "name": "i",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 101,
                            "src": "1432:1:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "nodeType": "Assignment",
                          "operator": "=",
                          "rightHandSide": {
                            "argumentTypes": null,
                            "hexValue": "30",
                            "id": 127,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": true,
                            "kind": "number",
                            "lValueRequested": false,
                            "nodeType": "Literal",
                            "src": "1435:1:0",
                            "subdenomination": null,
                            "typeDescriptions": {
                              "typeIdentifier": "t_rational_0_by_1",
                              "typeString": "int_const 0"
                            },
                            "value": "0"
                          },
                          "src": "1432:4:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        },
                        "id": 129,
                        "nodeType": "ExpressionStatement",
                        "src": "1432:4:0"
                      }
                    ]
                  },
                  "id": 131,
                  "nodeType": "IfStatement",
                  "src": "1395:44:0",
                  "trueBody": {
                    "id": 125,
                    "nodeType": "Block",
                    "src": "1404:10:0",
                    "statements": [
                      {
                        "expression": {
                          "argumentTypes": null,
                          "id": 123,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "leftHandSide": {
                            "argumentTypes": null,
                            "id": 119,
                            "name": "i",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 101,
                            "src": "1405:1:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "nodeType": "Assignment",
                          "operator": "=",
                          "rightHandSide": {
                            "argumentTypes": null,
                            "commonType": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            },
                            "id": 122,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "lValueRequested": false,
                            "leftExpression": {
                              "argumentTypes": null,
                              "id": 120,
                              "name": "i",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 101,
                              "src": "1409:1:0",
                              "typeDescriptions": {
                                "typeIdentifier": "t_uint256",
                                "typeString": "uint256"
                              }
                            },
                            "nodeType": "BinaryOperation",
                            "operator": "-",
                            "rightExpression": {
                              "argumentTypes": null,
                              "hexValue": "31",
                              "id": 121,
                              "isConstant": false,
                              "isLValue": false,
                              "isPure": true,
                              "kind": "number",
                              "lValueRequested": false,
                              "nodeType": "Literal",
                              "src": "1411:1:0",
                              "subdenomination": null,
                              "typeDescriptions": {
                                "typeIdentifier": "t_rational_1_by_1",
                                "typeString": "int_const 1"
                              },
                              "value": "1"
                            },
                            "src": "1409:3:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "src": "1405:7:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        },
                        "id": 124,
                        "nodeType": "ExpressionStatement",
                        "src": "1405:7:0"
                      }
                    ]
                  }
                },
                {
                  "expression": {
                    "argumentTypes": null,
                    "components": [
                      {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "baseExpression": {
                            "argumentTypes": null,
                            "id": 132,
                            "name": "CEDStructArray",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 20,
                            "src": "1455:14:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                              "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                            }
                          },
                          "id": 134,
                          "indexExpression": {
                            "argumentTypes": null,
                            "id": 133,
                            "name": "i",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 101,
                            "src": "1470:1:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "isConstant": false,
                          "isLValue": true,
                          "isPure": false,
                          "lValueRequested": false,
                          "nodeType": "IndexAccess",
                          "src": "1455:17:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref"
                          }
                        },
                        "id": 135,
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "id",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 6,
                        "src": "1455:20:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "baseExpression": {
                            "argumentTypes": null,
                            "id": 136,
                            "name": "CEDStructArray",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 20,
                            "src": "1477:14:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                              "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                            }
                          },
                          "id": 138,
                          "indexExpression": {
                            "argumentTypes": null,
                            "id": 137,
                            "name": "i",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 101,
                            "src": "1492:1:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "isConstant": false,
                          "isLValue": true,
                          "isPure": false,
                          "lValueRequested": false,
                          "nodeType": "IndexAccess",
                          "src": "1477:17:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref"
                          }
                        },
                        "id": 139,
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "cid",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 8,
                        "src": "1477:21:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_string_storage",
                          "typeString": "string storage ref"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "baseExpression": {
                            "argumentTypes": null,
                            "id": 140,
                            "name": "CEDStructArray",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 20,
                            "src": "1499:14:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                              "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                            }
                          },
                          "id": 142,
                          "indexExpression": {
                            "argumentTypes": null,
                            "id": 141,
                            "name": "i",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 101,
                            "src": "1514:1:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "isConstant": false,
                          "isLValue": true,
                          "isPure": false,
                          "lValueRequested": false,
                          "nodeType": "IndexAccess",
                          "src": "1499:17:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref"
                          }
                        },
                        "id": 143,
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "fullname",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 10,
                        "src": "1499:26:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_string_storage",
                          "typeString": "string storage ref"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "baseExpression": {
                            "argumentTypes": null,
                            "id": 144,
                            "name": "CEDStructArray",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 20,
                            "src": "1526:14:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                              "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                            }
                          },
                          "id": 146,
                          "indexExpression": {
                            "argumentTypes": null,
                            "id": 145,
                            "name": "i",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 101,
                            "src": "1541:1:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "isConstant": false,
                          "isLValue": true,
                          "isPure": false,
                          "lValueRequested": false,
                          "nodeType": "IndexAccess",
                          "src": "1526:17:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref"
                          }
                        },
                        "id": 147,
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "coursename",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 12,
                        "src": "1526:28:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_string_storage",
                          "typeString": "string storage ref"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "baseExpression": {
                            "argumentTypes": null,
                            "id": 148,
                            "name": "CEDStructArray",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 20,
                            "src": "1555:14:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                              "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                            }
                          },
                          "id": 150,
                          "indexExpression": {
                            "argumentTypes": null,
                            "id": 149,
                            "name": "i",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 101,
                            "src": "1570:1:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "isConstant": false,
                          "isLValue": true,
                          "isPure": false,
                          "lValueRequested": false,
                          "nodeType": "IndexAccess",
                          "src": "1555:17:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref"
                          }
                        },
                        "id": 151,
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "issuedOn",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 14,
                        "src": "1555:26:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_string_storage",
                          "typeString": "string storage ref"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "baseExpression": {
                            "argumentTypes": null,
                            "id": 152,
                            "name": "CEDStructArray",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 20,
                            "src": "1583:14:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                              "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                            }
                          },
                          "id": 154,
                          "indexExpression": {
                            "argumentTypes": null,
                            "id": 153,
                            "name": "i",
                            "nodeType": "Identifier",
                            "overloadedDeclarations": [],
                            "referencedDeclaration": 101,
                            "src": "1598:1:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "isConstant": false,
                          "isLValue": true,
                          "isPure": false,
                          "lValueRequested": false,
                          "nodeType": "IndexAccess",
                          "src": "1583:17:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref"
                          }
                        },
                        "id": 155,
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "validUntil",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 16,
                        "src": "1583:28:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_string_storage",
                          "typeString": "string storage ref"
                        }
                      }
                    ],
                    "id": 156,
                    "isConstant": false,
                    "isInlineArray": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "nodeType": "TupleExpression",
                    "src": "1454:158:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_tuple$_t_uint256_$_t_string_storage_$_t_string_storage_$_t_string_storage_$_t_string_storage_$_t_string_storage_$",
                      "typeString": "tuple(uint256,string storage ref,string storage ref,string storage ref,string storage ref,string storage ref)"
                    }
                  },
                  "functionReturnParameters": 115,
                  "id": 157,
                  "nodeType": "Return",
                  "src": "1447:165:0"
                }
              ]
            },
            "documentation": null,
            "id": 159,
            "implemented": true,
            "isConstructor": false,
            "isDeclaredConst": true,
            "modifiers": [],
            "name": "getCEDStructByID",
            "nodeType": "FunctionDefinition",
            "parameters": {
              "id": 102,
              "nodeType": "ParameterList",
              "parameters": [
                {
                  "constant": false,
                  "id": 101,
                  "name": "i",
                  "nodeType": "VariableDeclaration",
                  "scope": 159,
                  "src": "1298:9:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_uint256",
                    "typeString": "uint256"
                  },
                  "typeName": {
                    "id": 100,
                    "name": "uint256",
                    "nodeType": "ElementaryTypeName",
                    "src": "1298:7:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                }
              ],
              "src": "1297:11:0"
            },
            "payable": false,
            "returnParameters": {
              "id": 115,
              "nodeType": "ParameterList",
              "parameters": [
                {
                  "constant": false,
                  "id": 104,
                  "name": "",
                  "nodeType": "VariableDeclaration",
                  "scope": 159,
                  "src": "1334:7:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_uint256",
                    "typeString": "uint256"
                  },
                  "typeName": {
                    "id": 103,
                    "name": "uint256",
                    "nodeType": "ElementaryTypeName",
                    "src": "1334:7:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 106,
                  "name": "",
                  "nodeType": "VariableDeclaration",
                  "scope": 159,
                  "src": "1344:6:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 105,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "1344:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 108,
                  "name": "",
                  "nodeType": "VariableDeclaration",
                  "scope": 159,
                  "src": "1353:6:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 107,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "1353:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 110,
                  "name": "",
                  "nodeType": "VariableDeclaration",
                  "scope": 159,
                  "src": "1361:6:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 109,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "1361:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 112,
                  "name": "",
                  "nodeType": "VariableDeclaration",
                  "scope": 159,
                  "src": "1369:6:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 111,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "1369:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 114,
                  "name": "",
                  "nodeType": "VariableDeclaration",
                  "scope": 159,
                  "src": "1377:6:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 113,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "1377:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                }
              ],
              "src": "1333:52:0"
            },
            "scope": 277,
            "src": "1272:348:0",
            "stateMutability": "view",
            "superFunction": null,
            "visibility": "public"
          },
          {
            "body": {
              "id": 236,
              "nodeType": "Block",
              "src": "1749:388:0",
              "statements": [
                {
                  "body": {
                    "id": 234,
                    "nodeType": "Block",
                    "src": "1817:309:0",
                    "statements": [
                      {
                        "condition": {
                          "argumentTypes": null,
                          "commonType": {
                            "typeIdentifier": "t_bytes32",
                            "typeString": "bytes32"
                          },
                          "id": 205,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "leftExpression": {
                            "argumentTypes": null,
                            "arguments": [
                              {
                                "argumentTypes": null,
                                "arguments": [
                                  {
                                    "argumentTypes": null,
                                    "id": 193,
                                    "name": "_cid",
                                    "nodeType": "Identifier",
                                    "overloadedDeclarations": [],
                                    "referencedDeclaration": 161,
                                    "src": "1862:4:0",
                                    "typeDescriptions": {
                                      "typeIdentifier": "t_string_memory_ptr",
                                      "typeString": "string memory"
                                    }
                                  }
                                ],
                                "expression": {
                                  "argumentTypes": [
                                    {
                                      "typeIdentifier": "t_string_memory_ptr",
                                      "typeString": "string memory"
                                    }
                                  ],
                                  "expression": {
                                    "argumentTypes": null,
                                    "id": 191,
                                    "name": "abi",
                                    "nodeType": "Identifier",
                                    "overloadedDeclarations": [],
                                    "referencedDeclaration": 392,
                                    "src": "1845:3:0",
                                    "typeDescriptions": {
                                      "typeIdentifier": "t_magic_abi",
                                      "typeString": "abi"
                                    }
                                  },
                                  "id": 192,
                                  "isConstant": false,
                                  "isLValue": false,
                                  "isPure": true,
                                  "lValueRequested": false,
                                  "memberName": "encodePacked",
                                  "nodeType": "MemberAccess",
                                  "referencedDeclaration": null,
                                  "src": "1845:16:0",
                                  "typeDescriptions": {
                                    "typeIdentifier": "t_function_abiencodepacked_pure$__$returns$_t_bytes_memory_ptr_$",
                                    "typeString": "function () pure returns (bytes memory)"
                                  }
                                },
                                "id": 194,
                                "isConstant": false,
                                "isLValue": false,
                                "isPure": false,
                                "kind": "functionCall",
                                "lValueRequested": false,
                                "names": [],
                                "nodeType": "FunctionCall",
                                "src": "1845:22:0",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_bytes_memory_ptr",
                                  "typeString": "bytes memory"
                                }
                              }
                            ],
                            "expression": {
                              "argumentTypes": [
                                {
                                  "typeIdentifier": "t_bytes_memory_ptr",
                                  "typeString": "bytes memory"
                                }
                              ],
                              "id": 190,
                              "name": "keccak256",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 399,
                              "src": "1835:9:0",
                              "typeDescriptions": {
                                "typeIdentifier": "t_function_sha3_pure$__$returns$_t_bytes32_$",
                                "typeString": "function () pure returns (bytes32)"
                              }
                            },
                            "id": 195,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "kind": "functionCall",
                            "lValueRequested": false,
                            "names": [],
                            "nodeType": "FunctionCall",
                            "src": "1835:33:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_bytes32",
                              "typeString": "bytes32"
                            }
                          },
                          "nodeType": "BinaryOperation",
                          "operator": "==",
                          "rightExpression": {
                            "argumentTypes": null,
                            "arguments": [
                              {
                                "argumentTypes": null,
                                "arguments": [
                                  {
                                    "argumentTypes": null,
                                    "expression": {
                                      "argumentTypes": null,
                                      "baseExpression": {
                                        "argumentTypes": null,
                                        "id": 199,
                                        "name": "CEDStructArray",
                                        "nodeType": "Identifier",
                                        "overloadedDeclarations": [],
                                        "referencedDeclaration": 20,
                                        "src": "1897:14:0",
                                        "typeDescriptions": {
                                          "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                                          "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                                        }
                                      },
                                      "id": 201,
                                      "indexExpression": {
                                        "argumentTypes": null,
                                        "id": 200,
                                        "name": "i",
                                        "nodeType": "Identifier",
                                        "overloadedDeclarations": [],
                                        "referencedDeclaration": 177,
                                        "src": "1912:1:0",
                                        "typeDescriptions": {
                                          "typeIdentifier": "t_uint256",
                                          "typeString": "uint256"
                                        }
                                      },
                                      "isConstant": false,
                                      "isLValue": true,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "nodeType": "IndexAccess",
                                      "src": "1897:17:0",
                                      "typeDescriptions": {
                                        "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                                        "typeString": "struct CSBD.CEDStruct storage ref"
                                      }
                                    },
                                    "id": 202,
                                    "isConstant": false,
                                    "isLValue": true,
                                    "isPure": false,
                                    "lValueRequested": false,
                                    "memberName": "cid",
                                    "nodeType": "MemberAccess",
                                    "referencedDeclaration": 8,
                                    "src": "1897:21:0",
                                    "typeDescriptions": {
                                      "typeIdentifier": "t_string_storage",
                                      "typeString": "string storage ref"
                                    }
                                  }
                                ],
                                "expression": {
                                  "argumentTypes": [
                                    {
                                      "typeIdentifier": "t_string_storage",
                                      "typeString": "string storage ref"
                                    }
                                  ],
                                  "expression": {
                                    "argumentTypes": null,
                                    "id": 197,
                                    "name": "abi",
                                    "nodeType": "Identifier",
                                    "overloadedDeclarations": [],
                                    "referencedDeclaration": 392,
                                    "src": "1880:3:0",
                                    "typeDescriptions": {
                                      "typeIdentifier": "t_magic_abi",
                                      "typeString": "abi"
                                    }
                                  },
                                  "id": 198,
                                  "isConstant": false,
                                  "isLValue": false,
                                  "isPure": true,
                                  "lValueRequested": false,
                                  "memberName": "encodePacked",
                                  "nodeType": "MemberAccess",
                                  "referencedDeclaration": null,
                                  "src": "1880:16:0",
                                  "typeDescriptions": {
                                    "typeIdentifier": "t_function_abiencodepacked_pure$__$returns$_t_bytes_memory_ptr_$",
                                    "typeString": "function () pure returns (bytes memory)"
                                  }
                                },
                                "id": 203,
                                "isConstant": false,
                                "isLValue": false,
                                "isPure": false,
                                "kind": "functionCall",
                                "lValueRequested": false,
                                "names": [],
                                "nodeType": "FunctionCall",
                                "src": "1880:39:0",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_bytes_memory_ptr",
                                  "typeString": "bytes memory"
                                }
                              }
                            ],
                            "expression": {
                              "argumentTypes": [
                                {
                                  "typeIdentifier": "t_bytes_memory_ptr",
                                  "typeString": "bytes memory"
                                }
                              ],
                              "id": 196,
                              "name": "keccak256",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 399,
                              "src": "1870:9:0",
                              "typeDescriptions": {
                                "typeIdentifier": "t_function_sha3_pure$__$returns$_t_bytes32_$",
                                "typeString": "function () pure returns (bytes32)"
                              }
                            },
                            "id": 204,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": false,
                            "kind": "functionCall",
                            "lValueRequested": false,
                            "names": [],
                            "nodeType": "FunctionCall",
                            "src": "1870:50:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_bytes32",
                              "typeString": "bytes32"
                            }
                          },
                          "src": "1835:85:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_bool",
                            "typeString": "bool"
                          }
                        },
                        "falseBody": null,
                        "id": 233,
                        "nodeType": "IfStatement",
                        "src": "1830:287:0",
                        "trueBody": {
                          "id": 232,
                          "nodeType": "Block",
                          "src": "1923:194:0",
                          "statements": [
                            {
                              "expression": {
                                "argumentTypes": null,
                                "components": [
                                  {
                                    "argumentTypes": null,
                                    "expression": {
                                      "argumentTypes": null,
                                      "baseExpression": {
                                        "argumentTypes": null,
                                        "id": 206,
                                        "name": "CEDStructArray",
                                        "nodeType": "Identifier",
                                        "overloadedDeclarations": [],
                                        "referencedDeclaration": 20,
                                        "src": "1946:14:0",
                                        "typeDescriptions": {
                                          "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                                          "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                                        }
                                      },
                                      "id": 208,
                                      "indexExpression": {
                                        "argumentTypes": null,
                                        "id": 207,
                                        "name": "i",
                                        "nodeType": "Identifier",
                                        "overloadedDeclarations": [],
                                        "referencedDeclaration": 177,
                                        "src": "1961:1:0",
                                        "typeDescriptions": {
                                          "typeIdentifier": "t_uint256",
                                          "typeString": "uint256"
                                        }
                                      },
                                      "isConstant": false,
                                      "isLValue": true,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "nodeType": "IndexAccess",
                                      "src": "1946:17:0",
                                      "typeDescriptions": {
                                        "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                                        "typeString": "struct CSBD.CEDStruct storage ref"
                                      }
                                    },
                                    "id": 209,
                                    "isConstant": false,
                                    "isLValue": true,
                                    "isPure": false,
                                    "lValueRequested": false,
                                    "memberName": "id",
                                    "nodeType": "MemberAccess",
                                    "referencedDeclaration": 6,
                                    "src": "1946:20:0",
                                    "typeDescriptions": {
                                      "typeIdentifier": "t_uint256",
                                      "typeString": "uint256"
                                    }
                                  },
                                  {
                                    "argumentTypes": null,
                                    "expression": {
                                      "argumentTypes": null,
                                      "baseExpression": {
                                        "argumentTypes": null,
                                        "id": 210,
                                        "name": "CEDStructArray",
                                        "nodeType": "Identifier",
                                        "overloadedDeclarations": [],
                                        "referencedDeclaration": 20,
                                        "src": "1968:14:0",
                                        "typeDescriptions": {
                                          "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                                          "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                                        }
                                      },
                                      "id": 212,
                                      "indexExpression": {
                                        "argumentTypes": null,
                                        "id": 211,
                                        "name": "i",
                                        "nodeType": "Identifier",
                                        "overloadedDeclarations": [],
                                        "referencedDeclaration": 177,
                                        "src": "1983:1:0",
                                        "typeDescriptions": {
                                          "typeIdentifier": "t_uint256",
                                          "typeString": "uint256"
                                        }
                                      },
                                      "isConstant": false,
                                      "isLValue": true,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "nodeType": "IndexAccess",
                                      "src": "1968:17:0",
                                      "typeDescriptions": {
                                        "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                                        "typeString": "struct CSBD.CEDStruct storage ref"
                                      }
                                    },
                                    "id": 213,
                                    "isConstant": false,
                                    "isLValue": true,
                                    "isPure": false,
                                    "lValueRequested": false,
                                    "memberName": "cid",
                                    "nodeType": "MemberAccess",
                                    "referencedDeclaration": 8,
                                    "src": "1968:21:0",
                                    "typeDescriptions": {
                                      "typeIdentifier": "t_string_storage",
                                      "typeString": "string storage ref"
                                    }
                                  },
                                  {
                                    "argumentTypes": null,
                                    "expression": {
                                      "argumentTypes": null,
                                      "baseExpression": {
                                        "argumentTypes": null,
                                        "id": 214,
                                        "name": "CEDStructArray",
                                        "nodeType": "Identifier",
                                        "overloadedDeclarations": [],
                                        "referencedDeclaration": 20,
                                        "src": "1990:14:0",
                                        "typeDescriptions": {
                                          "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                                          "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                                        }
                                      },
                                      "id": 216,
                                      "indexExpression": {
                                        "argumentTypes": null,
                                        "id": 215,
                                        "name": "i",
                                        "nodeType": "Identifier",
                                        "overloadedDeclarations": [],
                                        "referencedDeclaration": 177,
                                        "src": "2005:1:0",
                                        "typeDescriptions": {
                                          "typeIdentifier": "t_uint256",
                                          "typeString": "uint256"
                                        }
                                      },
                                      "isConstant": false,
                                      "isLValue": true,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "nodeType": "IndexAccess",
                                      "src": "1990:17:0",
                                      "typeDescriptions": {
                                        "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                                        "typeString": "struct CSBD.CEDStruct storage ref"
                                      }
                                    },
                                    "id": 217,
                                    "isConstant": false,
                                    "isLValue": true,
                                    "isPure": false,
                                    "lValueRequested": false,
                                    "memberName": "fullname",
                                    "nodeType": "MemberAccess",
                                    "referencedDeclaration": 10,
                                    "src": "1990:26:0",
                                    "typeDescriptions": {
                                      "typeIdentifier": "t_string_storage",
                                      "typeString": "string storage ref"
                                    }
                                  },
                                  {
                                    "argumentTypes": null,
                                    "expression": {
                                      "argumentTypes": null,
                                      "baseExpression": {
                                        "argumentTypes": null,
                                        "id": 218,
                                        "name": "CEDStructArray",
                                        "nodeType": "Identifier",
                                        "overloadedDeclarations": [],
                                        "referencedDeclaration": 20,
                                        "src": "2017:14:0",
                                        "typeDescriptions": {
                                          "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                                          "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                                        }
                                      },
                                      "id": 220,
                                      "indexExpression": {
                                        "argumentTypes": null,
                                        "id": 219,
                                        "name": "i",
                                        "nodeType": "Identifier",
                                        "overloadedDeclarations": [],
                                        "referencedDeclaration": 177,
                                        "src": "2032:1:0",
                                        "typeDescriptions": {
                                          "typeIdentifier": "t_uint256",
                                          "typeString": "uint256"
                                        }
                                      },
                                      "isConstant": false,
                                      "isLValue": true,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "nodeType": "IndexAccess",
                                      "src": "2017:17:0",
                                      "typeDescriptions": {
                                        "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                                        "typeString": "struct CSBD.CEDStruct storage ref"
                                      }
                                    },
                                    "id": 221,
                                    "isConstant": false,
                                    "isLValue": true,
                                    "isPure": false,
                                    "lValueRequested": false,
                                    "memberName": "coursename",
                                    "nodeType": "MemberAccess",
                                    "referencedDeclaration": 12,
                                    "src": "2017:28:0",
                                    "typeDescriptions": {
                                      "typeIdentifier": "t_string_storage",
                                      "typeString": "string storage ref"
                                    }
                                  },
                                  {
                                    "argumentTypes": null,
                                    "expression": {
                                      "argumentTypes": null,
                                      "baseExpression": {
                                        "argumentTypes": null,
                                        "id": 222,
                                        "name": "CEDStructArray",
                                        "nodeType": "Identifier",
                                        "overloadedDeclarations": [],
                                        "referencedDeclaration": 20,
                                        "src": "2046:14:0",
                                        "typeDescriptions": {
                                          "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                                          "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                                        }
                                      },
                                      "id": 224,
                                      "indexExpression": {
                                        "argumentTypes": null,
                                        "id": 223,
                                        "name": "i",
                                        "nodeType": "Identifier",
                                        "overloadedDeclarations": [],
                                        "referencedDeclaration": 177,
                                        "src": "2061:1:0",
                                        "typeDescriptions": {
                                          "typeIdentifier": "t_uint256",
                                          "typeString": "uint256"
                                        }
                                      },
                                      "isConstant": false,
                                      "isLValue": true,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "nodeType": "IndexAccess",
                                      "src": "2046:17:0",
                                      "typeDescriptions": {
                                        "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                                        "typeString": "struct CSBD.CEDStruct storage ref"
                                      }
                                    },
                                    "id": 225,
                                    "isConstant": false,
                                    "isLValue": true,
                                    "isPure": false,
                                    "lValueRequested": false,
                                    "memberName": "issuedOn",
                                    "nodeType": "MemberAccess",
                                    "referencedDeclaration": 14,
                                    "src": "2046:26:0",
                                    "typeDescriptions": {
                                      "typeIdentifier": "t_string_storage",
                                      "typeString": "string storage ref"
                                    }
                                  },
                                  {
                                    "argumentTypes": null,
                                    "expression": {
                                      "argumentTypes": null,
                                      "baseExpression": {
                                        "argumentTypes": null,
                                        "id": 226,
                                        "name": "CEDStructArray",
                                        "nodeType": "Identifier",
                                        "overloadedDeclarations": [],
                                        "referencedDeclaration": 20,
                                        "src": "2074:14:0",
                                        "typeDescriptions": {
                                          "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                                          "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                                        }
                                      },
                                      "id": 228,
                                      "indexExpression": {
                                        "argumentTypes": null,
                                        "id": 227,
                                        "name": "i",
                                        "nodeType": "Identifier",
                                        "overloadedDeclarations": [],
                                        "referencedDeclaration": 177,
                                        "src": "2089:1:0",
                                        "typeDescriptions": {
                                          "typeIdentifier": "t_uint256",
                                          "typeString": "uint256"
                                        }
                                      },
                                      "isConstant": false,
                                      "isLValue": true,
                                      "isPure": false,
                                      "lValueRequested": false,
                                      "nodeType": "IndexAccess",
                                      "src": "2074:17:0",
                                      "typeDescriptions": {
                                        "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                                        "typeString": "struct CSBD.CEDStruct storage ref"
                                      }
                                    },
                                    "id": 229,
                                    "isConstant": false,
                                    "isLValue": true,
                                    "isPure": false,
                                    "lValueRequested": false,
                                    "memberName": "validUntil",
                                    "nodeType": "MemberAccess",
                                    "referencedDeclaration": 16,
                                    "src": "2074:28:0",
                                    "typeDescriptions": {
                                      "typeIdentifier": "t_string_storage",
                                      "typeString": "string storage ref"
                                    }
                                  }
                                ],
                                "id": 230,
                                "isConstant": false,
                                "isInlineArray": false,
                                "isLValue": false,
                                "isPure": false,
                                "lValueRequested": false,
                                "nodeType": "TupleExpression",
                                "src": "1945:158:0",
                                "typeDescriptions": {
                                  "typeIdentifier": "t_tuple$_t_uint256_$_t_string_storage_$_t_string_storage_$_t_string_storage_$_t_string_storage_$_t_string_storage_$",
                                  "typeString": "tuple(uint256,string storage ref,string storage ref,string storage ref,string storage ref,string storage ref)"
                                }
                              },
                              "functionReturnParameters": 175,
                              "id": 231,
                              "nodeType": "Return",
                              "src": "1938:165:0"
                            }
                          ]
                        }
                      }
                    ]
                  },
                  "condition": {
                    "argumentTypes": null,
                    "commonType": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    },
                    "id": 186,
                    "isConstant": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "leftExpression": {
                      "argumentTypes": null,
                      "id": 184,
                      "name": "i",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 177,
                      "src": "1802:1:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "nodeType": "BinaryOperation",
                    "operator": ">=",
                    "rightExpression": {
                      "argumentTypes": null,
                      "hexValue": "30",
                      "id": 185,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": true,
                      "kind": "number",
                      "lValueRequested": false,
                      "nodeType": "Literal",
                      "src": "1807:1:0",
                      "subdenomination": null,
                      "typeDescriptions": {
                        "typeIdentifier": "t_rational_0_by_1",
                        "typeString": "int_const 0"
                      },
                      "value": "0"
                    },
                    "src": "1802:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_bool",
                      "typeString": "bool"
                    }
                  },
                  "id": 235,
                  "initializationExpression": {
                    "assignments": [
                      177
                    ],
                    "declarations": [
                      {
                        "constant": false,
                        "id": 177,
                        "name": "i",
                        "nodeType": "VariableDeclaration",
                        "scope": 237,
                        "src": "1763:9:0",
                        "stateVariable": false,
                        "storageLocation": "default",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        },
                        "typeName": {
                          "id": 176,
                          "name": "uint256",
                          "nodeType": "ElementaryTypeName",
                          "src": "1763:7:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        },
                        "value": null,
                        "visibility": "internal"
                      }
                    ],
                    "id": 183,
                    "initialValue": {
                      "argumentTypes": null,
                      "components": [
                        {
                          "argumentTypes": null,
                          "commonType": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          },
                          "id": 181,
                          "isConstant": false,
                          "isLValue": false,
                          "isPure": false,
                          "lValueRequested": false,
                          "leftExpression": {
                            "argumentTypes": null,
                            "expression": {
                              "argumentTypes": null,
                              "id": 178,
                              "name": "CEDStructArray",
                              "nodeType": "Identifier",
                              "overloadedDeclarations": [],
                              "referencedDeclaration": 20,
                              "src": "1776:14:0",
                              "typeDescriptions": {
                                "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                                "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                              }
                            },
                            "id": 179,
                            "isConstant": false,
                            "isLValue": true,
                            "isPure": false,
                            "lValueRequested": false,
                            "memberName": "length",
                            "nodeType": "MemberAccess",
                            "referencedDeclaration": null,
                            "src": "1776:21:0",
                            "typeDescriptions": {
                              "typeIdentifier": "t_uint256",
                              "typeString": "uint256"
                            }
                          },
                          "nodeType": "BinaryOperation",
                          "operator": "-",
                          "rightExpression": {
                            "argumentTypes": null,
                            "hexValue": "31",
                            "id": 180,
                            "isConstant": false,
                            "isLValue": false,
                            "isPure": true,
                            "kind": "number",
                            "lValueRequested": false,
                            "nodeType": "Literal",
                            "src": "1798:1:0",
                            "subdenomination": null,
                            "typeDescriptions": {
                              "typeIdentifier": "t_rational_1_by_1",
                              "typeString": "int_const 1"
                            },
                            "value": "1"
                          },
                          "src": "1776:23:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_uint256",
                            "typeString": "uint256"
                          }
                        }
                      ],
                      "id": 182,
                      "isConstant": false,
                      "isInlineArray": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "nodeType": "TupleExpression",
                      "src": "1775:25:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "nodeType": "VariableDeclarationStatement",
                    "src": "1763:37:0"
                  },
                  "loopExpression": {
                    "expression": {
                      "argumentTypes": null,
                      "id": 188,
                      "isConstant": false,
                      "isLValue": false,
                      "isPure": false,
                      "lValueRequested": false,
                      "nodeType": "UnaryOperation",
                      "operator": "--",
                      "prefix": false,
                      "src": "1812:3:0",
                      "subExpression": {
                        "argumentTypes": null,
                        "id": 187,
                        "name": "i",
                        "nodeType": "Identifier",
                        "overloadedDeclarations": [],
                        "referencedDeclaration": 177,
                        "src": "1812:1:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      "typeDescriptions": {
                        "typeIdentifier": "t_uint256",
                        "typeString": "uint256"
                      }
                    },
                    "id": 189,
                    "nodeType": "ExpressionStatement",
                    "src": "1812:3:0"
                  },
                  "nodeType": "ForStatement",
                  "src": "1758:368:0"
                }
              ]
            },
            "documentation": null,
            "id": 237,
            "implemented": true,
            "isConstructor": false,
            "isDeclaredConst": true,
            "modifiers": [],
            "name": "getCEDStructsByCID",
            "nodeType": "FunctionDefinition",
            "parameters": {
              "id": 162,
              "nodeType": "ParameterList",
              "parameters": [
                {
                  "constant": false,
                  "id": 161,
                  "name": "_cid",
                  "nodeType": "VariableDeclaration",
                  "scope": 237,
                  "src": "1659:11:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 160,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "1659:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                }
              ],
              "src": "1658:13:0"
            },
            "payable": false,
            "returnParameters": {
              "id": 175,
              "nodeType": "ParameterList",
              "parameters": [
                {
                  "constant": false,
                  "id": 164,
                  "name": "",
                  "nodeType": "VariableDeclaration",
                  "scope": 237,
                  "src": "1697:7:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_uint256",
                    "typeString": "uint256"
                  },
                  "typeName": {
                    "id": 163,
                    "name": "uint256",
                    "nodeType": "ElementaryTypeName",
                    "src": "1697:7:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 166,
                  "name": "",
                  "nodeType": "VariableDeclaration",
                  "scope": 237,
                  "src": "1707:6:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 165,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "1707:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 168,
                  "name": "",
                  "nodeType": "VariableDeclaration",
                  "scope": 237,
                  "src": "1716:6:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 167,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "1716:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 170,
                  "name": "",
                  "nodeType": "VariableDeclaration",
                  "scope": 237,
                  "src": "1724:6:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 169,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "1724:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 172,
                  "name": "",
                  "nodeType": "VariableDeclaration",
                  "scope": 237,
                  "src": "1732:6:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 171,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "1732:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 174,
                  "name": "",
                  "nodeType": "VariableDeclaration",
                  "scope": 237,
                  "src": "1740:6:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 173,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "1740:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                }
              ],
              "src": "1696:52:0"
            },
            "scope": 277,
            "src": "1631:506:0",
            "stateMutability": "view",
            "superFunction": null,
            "visibility": "public"
          },
          {
            "body": {
              "id": 245,
              "nodeType": "Block",
              "src": "2203:47:0",
              "statements": [
                {
                  "expression": {
                    "argumentTypes": null,
                    "expression": {
                      "argumentTypes": null,
                      "id": 242,
                      "name": "CEDStructArray",
                      "nodeType": "Identifier",
                      "overloadedDeclarations": [],
                      "referencedDeclaration": 20,
                      "src": "2221:14:0",
                      "typeDescriptions": {
                        "typeIdentifier": "t_array$_t_struct$_CEDStruct_$17_storage_$dyn_storage",
                        "typeString": "struct CSBD.CEDStruct storage ref[] storage ref"
                      }
                    },
                    "id": 243,
                    "isConstant": false,
                    "isLValue": true,
                    "isPure": false,
                    "lValueRequested": false,
                    "memberName": "length",
                    "nodeType": "MemberAccess",
                    "referencedDeclaration": null,
                    "src": "2221:21:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    }
                  },
                  "functionReturnParameters": 241,
                  "id": 244,
                  "nodeType": "Return",
                  "src": "2214:28:0"
                }
              ]
            },
            "documentation": null,
            "id": 246,
            "implemented": true,
            "isConstructor": false,
            "isDeclaredConst": true,
            "modifiers": [],
            "name": "countCEDStruct",
            "nodeType": "FunctionDefinition",
            "parameters": {
              "id": 238,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "2170:2:0"
            },
            "payable": false,
            "returnParameters": {
              "id": 241,
              "nodeType": "ParameterList",
              "parameters": [
                {
                  "constant": false,
                  "id": 240,
                  "name": "",
                  "nodeType": "VariableDeclaration",
                  "scope": 246,
                  "src": "2194:7:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_uint256",
                    "typeString": "uint256"
                  },
                  "typeName": {
                    "id": 239,
                    "name": "uint256",
                    "nodeType": "ElementaryTypeName",
                    "src": "2194:7:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                }
              ],
              "src": "2193:9:0"
            },
            "scope": 277,
            "src": "2147:103:0",
            "stateMutability": "view",
            "superFunction": null,
            "visibility": "public"
          },
          {
            "body": {
              "id": 275,
              "nodeType": "Block",
              "src": "2403:95:0",
              "statements": [
                {
                  "expression": {
                    "argumentTypes": null,
                    "components": [
                      {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "id": 261,
                          "name": "CED",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 22,
                          "src": "2418:3:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref"
                          }
                        },
                        "id": 262,
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "id",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 6,
                        "src": "2418:6:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_uint256",
                          "typeString": "uint256"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "id": 263,
                          "name": "CED",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 22,
                          "src": "2426:3:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref"
                          }
                        },
                        "id": 264,
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "cid",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 8,
                        "src": "2426:7:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_string_storage",
                          "typeString": "string storage ref"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "id": 265,
                          "name": "CED",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 22,
                          "src": "2434:3:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref"
                          }
                        },
                        "id": 266,
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "fullname",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 10,
                        "src": "2434:12:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_string_storage",
                          "typeString": "string storage ref"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "id": 267,
                          "name": "CED",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 22,
                          "src": "2447:3:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref"
                          }
                        },
                        "id": 268,
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "coursename",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 12,
                        "src": "2447:14:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_string_storage",
                          "typeString": "string storage ref"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "id": 269,
                          "name": "CED",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 22,
                          "src": "2462:3:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref"
                          }
                        },
                        "id": 270,
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "issuedOn",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 14,
                        "src": "2462:12:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_string_storage",
                          "typeString": "string storage ref"
                        }
                      },
                      {
                        "argumentTypes": null,
                        "expression": {
                          "argumentTypes": null,
                          "id": 271,
                          "name": "CED",
                          "nodeType": "Identifier",
                          "overloadedDeclarations": [],
                          "referencedDeclaration": 22,
                          "src": "2476:3:0",
                          "typeDescriptions": {
                            "typeIdentifier": "t_struct$_CEDStruct_$17_storage",
                            "typeString": "struct CSBD.CEDStruct storage ref"
                          }
                        },
                        "id": 272,
                        "isConstant": false,
                        "isLValue": true,
                        "isPure": false,
                        "lValueRequested": false,
                        "memberName": "validUntil",
                        "nodeType": "MemberAccess",
                        "referencedDeclaration": 16,
                        "src": "2476:14:0",
                        "typeDescriptions": {
                          "typeIdentifier": "t_string_storage",
                          "typeString": "string storage ref"
                        }
                      }
                    ],
                    "id": 273,
                    "isConstant": false,
                    "isInlineArray": false,
                    "isLValue": false,
                    "isPure": false,
                    "lValueRequested": false,
                    "nodeType": "TupleExpression",
                    "src": "2417:75:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_tuple$_t_uint256_$_t_string_storage_$_t_string_storage_$_t_string_storage_$_t_string_storage_$_t_string_storage_$",
                      "typeString": "tuple(uint256,string storage ref,string storage ref,string storage ref,string storage ref,string storage ref)"
                    }
                  },
                  "functionReturnParameters": 260,
                  "id": 274,
                  "nodeType": "Return",
                  "src": "2410:82:0"
                }
              ]
            },
            "documentation": null,
            "id": 276,
            "implemented": true,
            "isConstructor": false,
            "isDeclaredConst": true,
            "modifiers": [],
            "name": "getlastCED",
            "nodeType": "FunctionDefinition",
            "parameters": {
              "id": 247,
              "nodeType": "ParameterList",
              "parameters": [],
              "src": "2275:3:0"
            },
            "payable": false,
            "returnParameters": {
              "id": 260,
              "nodeType": "ParameterList",
              "parameters": [
                {
                  "constant": false,
                  "id": 249,
                  "name": "_id",
                  "nodeType": "VariableDeclaration",
                  "scope": 276,
                  "src": "2304:11:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_uint256",
                    "typeString": "uint256"
                  },
                  "typeName": {
                    "id": 248,
                    "name": "uint256",
                    "nodeType": "ElementaryTypeName",
                    "src": "2304:7:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_uint256",
                      "typeString": "uint256"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 251,
                  "name": "_cid",
                  "nodeType": "VariableDeclaration",
                  "scope": 276,
                  "src": "2317:11:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 250,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "2317:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 253,
                  "name": "_fullname",
                  "nodeType": "VariableDeclaration",
                  "scope": 276,
                  "src": "2330:16:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 252,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "2330:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 255,
                  "name": "_coursename",
                  "nodeType": "VariableDeclaration",
                  "scope": 276,
                  "src": "2347:18:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 254,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "2347:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 257,
                  "name": "_issuedOn",
                  "nodeType": "VariableDeclaration",
                  "scope": 276,
                  "src": "2366:16:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 256,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "2366:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                },
                {
                  "constant": false,
                  "id": 259,
                  "name": "_validUntil",
                  "nodeType": "VariableDeclaration",
                  "scope": 276,
                  "src": "2383:18:0",
                  "stateVariable": false,
                  "storageLocation": "default",
                  "typeDescriptions": {
                    "typeIdentifier": "t_string_memory_ptr",
                    "typeString": "string"
                  },
                  "typeName": {
                    "id": 258,
                    "name": "string",
                    "nodeType": "ElementaryTypeName",
                    "src": "2383:6:0",
                    "typeDescriptions": {
                      "typeIdentifier": "t_string_storage_ptr",
                      "typeString": "string"
                    }
                  },
                  "value": null,
                  "visibility": "internal"
                }
              ],
              "src": "2303:99:0"
            },
            "scope": 277,
            "src": "2256:242:0",
            "stateMutability": "view",
            "superFunction": null,
            "visibility": "public"
          }
        ],
        "scope": 278,
        "src": "56:2445:0"
      }
    ],
    "src": "0:2501:0"
  },
  "compiler": {
    "name": "solc",
    "version": "0.4.24+commit.e67f0147.Emscripten.clang"
  },
  "networks": {
    "20130123": {
      "events": {},
      "links": {},
      "address": "0x7c88459b4fd8166cfce3b97a6e83ac9785de92b2",
      "transactionHash": "0x3a16471d351fe43c638872804756f325bb840e15c590758f0d4122e56b6b11ca"
    }
  },
  "schemaVersion": "2.0.1",
  "updatedAt": "2018-10-06T00:20:34.246Z"
}

}),
(function(module,exports,__webpack_require__){var content=__webpack_require__(98);if(typeof content==='string')content=[[module.i,content,'']];var update=__webpack_require__(109)(content,{});if(content.locals)module.exports=content.locals;if(false){if(!content.locals){module.hot.accept("!!../node_modules/css-loader/index.js!./app.css",function(){var newContent=require("!!../node_modules/css-loader/index.js!./app.css");if(typeof newContent==='string')newContent=[[module.id,newContent,'']];update(newContent);});}
module.hot.dispose(function(){update();});}}),(function(module,exports,__webpack_require__){var Schema=__webpack_require__(145);var Contract=__webpack_require__(149);var contract=function(options){options=Schema.normalizeOptions(options);var binary=Schema.generateBinary(options,{},{dirty:false});return Contract.clone(binary);};contract.fromSolJS=function(soljs_abstraction,ignore_default_network){if(ignore_default_network==null){ignore_default_network=false;}
var latest_network=null;var latest_network_updated_at=0;var networks={};Object.keys(soljs_abstraction.all_networks).forEach(function(network_name){if(network_name=="default"){if(ignore_default_network==true){return;}else{throw new Error(soljs_abstraction.contract_name+" has legacy 'default' network artifacts stored within it. Generally these artifacts were a result of running Truffle on a development environment -- in order to store contracts with truffle-contract, all networks must have an identified id. If you're sure this default network represents your development environment, you can ignore processing of the default network by passing `true` as the second argument to this function. However, if you think this network represents artifacts you'd like to keep (i.e., addresses deployed to the main network), you'll need to edit your .sol.js file yourself and change the default network id to be the id of your desired network. For most people, ignoring the default network is the correct option.");}}
if(soljs_abstraction.all_networks[network_name].updated_at>latest_network_updated_at){latest_network=network_name;latest_network_updated_at=soljs_abstraction.all_networks[network_name].updated_at;}
networks[network_name]={};["address","events","links","updated_at"].forEach(function(key){networks[network_name][key]=soljs_abstraction.all_networks[network_name][key];})});latest_network=soljs_abstraction.all_networks[latest_network]||{};var json={contract_name:soljs_abstraction.contract_name,unlinked_binary:latest_network.unlinked_binary,abi:latest_network.abi,networks:networks,updated_at:latest_network_updated_at==0?undefined:latest_network_updated_at};return contract(json);};module.exports=contract;if(typeof window!=="undefined"){window.TruffleContract=contract;}}),(function(module,exports,__webpack_require__){var Web3=__webpack_require__(197);if(typeof window!=='undefined'&&typeof window.Web3==='undefined'){window.Web3=Web3;}
module.exports=Web3;}),(function(module,__webpack_exports__,__webpack_require__){"use strict";Object.defineProperty(__webpack_exports__,"__esModule",{value:true});var __WEBPACK_IMPORTED_MODULE_0__app_css__=__webpack_require__(71);var __WEBPACK_IMPORTED_MODULE_0__app_css___default=__webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__app_css__);var __WEBPACK_IMPORTED_MODULE_1_web3__=__webpack_require__(73);var __WEBPACK_IMPORTED_MODULE_1_web3___default=__webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_web3__);var __WEBPACK_IMPORTED_MODULE_2_truffle_contract__=__webpack_require__(72);var __WEBPACK_IMPORTED_MODULE_2_truffle_contract___default=__webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_truffle_contract__);var __WEBPACK_IMPORTED_MODULE_3__build_contracts_CSBD_json__=__webpack_require__(70);var __WEBPACK_IMPORTED_MODULE_3__build_contracts_CSBD_json___default=__webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3__build_contracts_CSBD_json__);var CSBD=__WEBPACK_IMPORTED_MODULE_2_truffle_contract___default()(__WEBPACK_IMPORTED_MODULE_3__build_contracts_CSBD_json___default.a);var accounts;var account;var lic;var EndPoint="./post.php";var pdfPoint="./pdf/index.php";var netId;var network;window.App={start:function(){var self=this;CSBD.setProvider(web3.currentProvider);web3.eth.getAccounts(function(err,accs){if(err!=null){return;}
if(accs.length==0){return;}
accounts=accs;account=accounts[0];netId=web3.version.network;switch(netId){case"1":network='https://etherscan.io/tx/';break
case"3":network='https://ropsten.etherscan.io/tx/';break
case"4":network='https://rinkeby.etherscan.io/tx/';break
case"42":network='https://kovan.etherscan.io/tx/';break
case"20130123":network='CSBD Private test network';break
default:netId=1;network='This is an unknown network.';}
self.refreshBalance();});},setStatus:function(message){var status=document.getElementById("status");status.innerHTML=message;},refreshBalance:function(){var self=this;var cert;CSBD.deployed().then(function(instance){cert=instance;return cert.getlastCED();}).then(function(ced){var id_element=document.getElementById("id");id_element.value=ced[0].valueOf();var cid_element=document.getElementById("cid");cid_element.value=ced[1].valueOf();var fullname_element=document.getElementById("fullname");fullname_element.value=ced[2].valueOf();var coursename_element=document.getElementById("coursename");coursename_element.value=ced[3].valueOf();var issuedOn_element=document.getElementById("issuedOn");issuedOn_element.value=ced[4].valueOf();var validUntil_element=document.getElementById("validUntil");validUntil_element.value=ced[5].valueOf();}).catch(function(e){console.log(e);self.setStatus("Error getting cid; see log.");});},getCEDByID:function(){var self=this;var cert;var id=parseInt(document.getElementById("id").value);CSBD.deployed().then(function(instance){cert=instance;return cert.getCEDStructByID(id,{from:account});}).then(function(ced){var id_element=document.getElementById("id");id_element.value=ced[0].valueOf();var cid_element=document.getElementById("cid");cid_element.value=ced[1].valueOf();var fullname_element=document.getElementById("fullname");fullname_element.value=ced[2].valueOf();var coursename_element=document.getElementById("coursename");coursename_element.value=ced[3].valueOf();var issuedOn_element=document.getElementById("issuedOn");issuedOn_element.value=ced[4].valueOf();var validUntil_element=document.getElementById("validUntil");validUntil_element.value=ced[5].valueOf();}).catch(function(e){console.log(e);self.setStatus("Error getting cid; see log.");});},getCEDByCID:function(){var self=this;var cert;var cid=document.getElementById("cid").value;var id_element=document.getElementById("id");var hash_element=document.getElementById("hash");var cid_element=document.getElementById("cid");var pdf_element=document.getElementById("pdf");var fullname_element=document.getElementById("fullname");var coursename_element=document.getElementById("coursename");var issuedOn_element=document.getElementById("issuedOn");var validUntil_element=document.getElementById("validUntil");pdf_element.innerHTML='';hash_element.innerHTML='';CSBD.deployed().then(function(instance){cert=instance;return cert.getCEDStructsByCID(cid,{from:account});}).then(function(ced){if(hash_element.innerHTML=='')
{cid_element.value=ced[1].valueOf();id_element.value=ced[0].valueOf();fullname_element.value=ced[2].valueOf();coursename_element.value=ced[3].valueOf();issuedOn_element.value=ced[4].valueOf();validUntil_element.value=ced[5].valueOf();}}).catch(function(e){console.log(e);self.setStatus("Error getting cid; see log.");});var mode="r";lic=netId+"_"+cid;var req=self.createXHR();req.onreadystatechange=function()
{if(req.readyState==4)
{if(req.status==200)
{var res=req.responseText;if(res==404){var msg="license number do not exist";self.setStatus(msg);alert(msg);}
else{res=JSON.parse(res);var certification=`
                                    <a href="${res.tx}" target="_blank">Verify on Blockchain</a>
                            `;hash_element.innerHTML=certification;cid_element.value=res.license_no;fullname_element.value=res.fullname;coursename_element.value=res.coursename;issuedOn_element.value=res.issuedOn;validUntil_element.value=res.validUntil;var pdftx=pdfPoint+"?license_no="+res.license_no+"&fullname="+res.fullname+"&coursename="+res.coursename+"&issuedOn="+res.issuedOn+"&tx="+res.tx;var pdf_certification=`
                                 <a href="${pdftx}" target="_self">Download</a>
                            `;if(res.tx==null){pdf_certification='';}
pdf_element.innerHTML=pdf_certification;}}
else
{self.setStatus("Error: returned status code "+req.status+" "+req.statusText);}}};req.open("POST",EndPoint,true);req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");req.send("license="+lic+"&mode="+mode);},listCEDByCID:function(){var self=this;var cert;var cid=document.getElementById("license_no").value;var hash_element=document.getElementById("hash");var cid_element=document.getElementById("license_no");var pdf_element=document.getElementById("pdf");var fullname_element=document.getElementById("fullname");var coursename_element=document.getElementById("coursename");var issuedOn_element=document.getElementById("issuedOn");var validUntil_element=document.getElementById("validUntil");pdf_element.innerHTML='';hash_element.innerHTML='';CSBD.deployed().then(function(instance){cert=instance;return cert.getCEDStructsByCID(cid,{from:account});}).then(function(ced){if(hash_element.innerHTML=='')
{cid_element.innerHTML=ced[1].valueOf();fullname_element.innerHTML=ced[2].valueOf();coursename_element.innerHTML=ced[3].valueOf();issuedOn_element.innerHTML=ced[4].valueOf();validUntil_element.innerHTML=ced[5].valueOf();}}).catch(function(e){console.log(e);self.setStatus("Error getting cid; see log.");});var mode="r";if(netId==null){netId=1;}
lic=netId+"_"+cid;var req=self.createXHR();req.onreadystatechange=function()
{if(req.readyState==4)
{if(req.status==200)
{var res=req.responseText;if(res==404){var msg="license number do not exist";alert(msg);}
else{res=JSON.parse(res);var certification=`
                                    <a href="${res.tx}" target="_blank">Verify on Blockchain</a>
                            `;hash_element.innerHTML=certification;cid_element.innerHTML=res.license_no;fullname_element.innerHTML=res.fullname;coursename_element.innerHTML=res.coursename;issuedOn_element.innerHTML=res.issuedOn;validUntil_element.innerHTML=res.validUntil;var pdftx=pdfPoint+"?license_no="+res.license_no+"&fullname="+res.fullname+"&coursename="+res.coursename+"&issuedOn="+res.issuedOn+"&tx="+res.tx;var pdf_certification=`
                                 <a href="${pdftx}" target="_self">Download</a>
                            `;if(res.tx==null){pdf_certification='';}
pdf_element.innerHTML=pdf_certification;}}
else
{}}};req.open("POST",EndPoint,true);req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");req.send("license="+lic+"&mode="+mode);},createXHR:function(){var request=false;try{request=new ActiveXObject('Msxml2.XMLHTTP');}
catch(err2){try{request=new ActiveXObject('Microsoft.XMLHTTP');}
catch(err3){try{request=new XMLHttpRequest();}
catch(err1)
{request=false;}}}
return request;},Write:function(url,content)
{var xhr=this.createXHR();xhr.onreadystatechange=function()
{if(xhr.readyState==4)
{}};xhr.open("POST",url,true);xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");xhr.send(content);},setCED:function(){var self=this;var cid=document.getElementById("cid").value;var fullname=document.getElementById("fullname").value;var coursename=document.getElementById("coursename").value;var issuedOn=document.getElementById("issuedOn").value;var validUntil=document.getElementById("validUntil").value;this.setStatus("Initiating transaction... (please wait)");var cert;CSBD.deployed().then(function(instance){cert=instance;return cert.setCED(cid,fullname,coursename,issuedOn,validUntil,{from:account});}).then(function(transaction){var mode="w";var req={};req.netId=netId;req.network=network;req.license_no=cid;lic=netId+"_"+cid;req.fullname=fullname;req.coursename=coursename;req.issuedOn=issuedOn;req.validUntil=validUntil;req.hash=transaction.tx;req.tx=req.network+req.hash;var content;content=JSON.stringify(req);self.Write(EndPoint,"license="+lic+"&content="+content+"&mode="+mode);self.setStatus("setCED updated on blockchain");self.refreshBalance();}).catch(function(e){console.log(e);self.setStatus("Error setCED; see log.");});}};window.addEventListener('load',function(){if(typeof web3!=='undefined'){console.warn("Using web3 detected from external source. If you find that your accounts don't appear or you have 0 CSBD, ensure you've configured that source properly. If using certMask, see the following link. Feel free to delete this warning. :) http://truffleframework.com/tutorials/truffle-and-certmask")
window.web3=new __WEBPACK_IMPORTED_MODULE_1_web3___default.a(web3.currentProvider);}else{console.warn("No web3 detected. Falling back to http://127.0.0.1:8545. You should remove this fallback when you deploy live, as it's inherently insecure. Consider switching to certmask for development. More info here: http://truffleframework.com/tutorials/truffle-and-certmask");window.web3=new __WEBPACK_IMPORTED_MODULE_1_web3___default.a(new __WEBPACK_IMPORTED_MODULE_1_web3___default.a.providers.HttpProvider("http://127.0.0.1:8545"));}
App.start();});}),(function(module,exports,__webpack_require__){"use strict";exports.byteLength=byteLength
exports.toByteArray=toByteArray
exports.fromByteArray=fromByteArray
var lookup=[]
var revLookup=[]
var Arr=typeof Uint8Array!=='undefined'?Uint8Array:Array
var code='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for(var i=0,len=code.length;i<len;++i){lookup[i]=code[i]
revLookup[code.charCodeAt(i)]=i}
revLookup['-'.charCodeAt(0)]=62
revLookup['_'.charCodeAt(0)]=63
function placeHoldersCount(b64){var len=b64.length
if(len%4>0){throw new Error('Invalid string. Length must be a multiple of 4')}
return b64[len-2]==='='?2:b64[len-1]==='='?1:0}
function byteLength(b64){return(b64.length*3/4)-placeHoldersCount(b64)}
function toByteArray(b64){var i,l,tmp,placeHolders,arr
var len=b64.length
placeHolders=placeHoldersCount(b64)
arr=new Arr((len*3/4)-placeHolders)
l=placeHolders>0?len-4:len
var L=0
for(i=0;i<l;i+=4){tmp=(revLookup[b64.charCodeAt(i)]<<18)|(revLookup[b64.charCodeAt(i+1)]<<12)|(revLookup[b64.charCodeAt(i+2)]<<6)|revLookup[b64.charCodeAt(i+3)]
arr[L++]=(tmp>>16)&0xFF
arr[L++]=(tmp>>8)&0xFF
arr[L++]=tmp&0xFF}
if(placeHolders===2){tmp=(revLookup[b64.charCodeAt(i)]<<2)|(revLookup[b64.charCodeAt(i+1)]>>4)
arr[L++]=tmp&0xFF}else if(placeHolders===1){tmp=(revLookup[b64.charCodeAt(i)]<<10)|(revLookup[b64.charCodeAt(i+1)]<<4)|(revLookup[b64.charCodeAt(i+2)]>>2)
arr[L++]=(tmp>>8)&0xFF
arr[L++]=tmp&0xFF}
return arr}
function tripletToBase64(num){return lookup[num>>18&0x3F]+lookup[num>>12&0x3F]+lookup[num>>6&0x3F]+lookup[num&0x3F]}
function encodeChunk(uint8,start,end){var tmp
var output=[]
for(var i=start;i<end;i+=3){tmp=((uint8[i]<<16)&0xFF0000)+((uint8[i+1]<<8)&0xFF00)+(uint8[i+2]&0xFF)
output.push(tripletToBase64(tmp))}
return output.join('')}
function fromByteArray(uint8){var tmp
var len=uint8.length
var extraBytes=len%3
var output=''
var parts=[]
var maxChunkLength=16383
for(var i=0,len2=len-extraBytes;i<len2;i+=maxChunkLength){parts.push(encodeChunk(uint8,i,(i+maxChunkLength)>len2?len2:(i+maxChunkLength)))}
if(extraBytes===1){tmp=uint8[len-1]
output+=lookup[tmp>>2]
output+=lookup[(tmp<<4)&0x3F]
output+='=='}else if(extraBytes===2){tmp=(uint8[len-2]<<8)+(uint8[len-1])
output+=lookup[tmp>>10]
output+=lookup[(tmp>>4)&0x3F]
output+=lookup[(tmp<<2)&0x3F]
output+='='}
parts.push(output)
return parts.join('')}}),(function(module,exports,__webpack_require__){;(function(root,factory,undef){if(true){module.exports=exports=factory(__webpack_require__(0),__webpack_require__(16),__webpack_require__(18),__webpack_require__(17),__webpack_require__(1));}
else if(typeof define==="function"&&define.amd){define(["./core","./enc-base64","./md5","./evpkdf","./cipher-core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){(function(){var C=CryptoJS;var C_lib=C.lib;var BlockCipher=C_lib.BlockCipher;var C_algo=C.algo;var SBOX=[];var INV_SBOX=[];var SUB_MIX_0=[];var SUB_MIX_1=[];var SUB_MIX_2=[];var SUB_MIX_3=[];var INV_SUB_MIX_0=[];var INV_SUB_MIX_1=[];var INV_SUB_MIX_2=[];var INV_SUB_MIX_3=[];(function(){var d=[];for(var i=0;i<256;i++){if(i<128){d[i]=i<<1;}else{d[i]=(i<<1)^0x11b;}}
var x=0;var xi=0;for(var i=0;i<256;i++){var sx=xi^(xi<<1)^(xi<<2)^(xi<<3)^(xi<<4);sx=(sx>>>8)^(sx&0xff)^0x63;SBOX[x]=sx;INV_SBOX[sx]=x;var x2=d[x];var x4=d[x2];var x8=d[x4];var t=(d[sx]*0x101)^(sx*0x1010100);SUB_MIX_0[x]=(t<<24)|(t>>>8);SUB_MIX_1[x]=(t<<16)|(t>>>16);SUB_MIX_2[x]=(t<<8)|(t>>>24);SUB_MIX_3[x]=t;var t=(x8*0x1010101)^(x4*0x10001)^(x2*0x101)^(x*0x1010100);INV_SUB_MIX_0[sx]=(t<<24)|(t>>>8);INV_SUB_MIX_1[sx]=(t<<16)|(t>>>16);INV_SUB_MIX_2[sx]=(t<<8)|(t>>>24);INV_SUB_MIX_3[sx]=t;if(!x){x=xi=1;}else{x=x2^d[d[d[x8^x2]]];xi^=d[d[xi]];}}}());var RCON=[0x00,0x01,0x02,0x04,0x08,0x10,0x20,0x40,0x80,0x1b,0x36];var AES=C_algo.AES=BlockCipher.extend({_doReset:function(){if(this._nRounds&&this._keyPriorReset===this._key){return;}
var key=this._keyPriorReset=this._key;var keyWords=key.words;var keySize=key.sigBytes/4;var nRounds=this._nRounds=keySize+6;var ksRows=(nRounds+1)*4;var keySchedule=this._keySchedule=[];for(var ksRow=0;ksRow<ksRows;ksRow++){if(ksRow<keySize){keySchedule[ksRow]=keyWords[ksRow];}else{var t=keySchedule[ksRow-1];if(!(ksRow%keySize)){t=(t<<8)|(t>>>24);t=(SBOX[t>>>24]<<24)|(SBOX[(t>>>16)&0xff]<<16)|(SBOX[(t>>>8)&0xff]<<8)|SBOX[t&0xff];t^=RCON[(ksRow/keySize)|0]<<24;}else if(keySize>6&&ksRow%keySize==4){t=(SBOX[t>>>24]<<24)|(SBOX[(t>>>16)&0xff]<<16)|(SBOX[(t>>>8)&0xff]<<8)|SBOX[t&0xff];}
keySchedule[ksRow]=keySchedule[ksRow-keySize]^t;}}
var invKeySchedule=this._invKeySchedule=[];for(var invKsRow=0;invKsRow<ksRows;invKsRow++){var ksRow=ksRows-invKsRow;if(invKsRow%4){var t=keySchedule[ksRow];}else{var t=keySchedule[ksRow-4];}
if(invKsRow<4||ksRow<=4){invKeySchedule[invKsRow]=t;}else{invKeySchedule[invKsRow]=INV_SUB_MIX_0[SBOX[t>>>24]]^INV_SUB_MIX_1[SBOX[(t>>>16)&0xff]]^INV_SUB_MIX_2[SBOX[(t>>>8)&0xff]]^INV_SUB_MIX_3[SBOX[t&0xff]];}}},encryptBlock:function(M,offset){this._doCryptBlock(M,offset,this._keySchedule,SUB_MIX_0,SUB_MIX_1,SUB_MIX_2,SUB_MIX_3,SBOX);},decryptBlock:function(M,offset){var t=M[offset+1];M[offset+1]=M[offset+3];M[offset+3]=t;this._doCryptBlock(M,offset,this._invKeySchedule,INV_SUB_MIX_0,INV_SUB_MIX_1,INV_SUB_MIX_2,INV_SUB_MIX_3,INV_SBOX);var t=M[offset+1];M[offset+1]=M[offset+3];M[offset+3]=t;},_doCryptBlock:function(M,offset,keySchedule,SUB_MIX_0,SUB_MIX_1,SUB_MIX_2,SUB_MIX_3,SBOX){var nRounds=this._nRounds;var s0=M[offset]^keySchedule[0];var s1=M[offset+1]^keySchedule[1];var s2=M[offset+2]^keySchedule[2];var s3=M[offset+3]^keySchedule[3];var ksRow=4;for(var round=1;round<nRounds;round++){var t0=SUB_MIX_0[s0>>>24]^SUB_MIX_1[(s1>>>16)&0xff]^SUB_MIX_2[(s2>>>8)&0xff]^SUB_MIX_3[s3&0xff]^keySchedule[ksRow++];var t1=SUB_MIX_0[s1>>>24]^SUB_MIX_1[(s2>>>16)&0xff]^SUB_MIX_2[(s3>>>8)&0xff]^SUB_MIX_3[s0&0xff]^keySchedule[ksRow++];var t2=SUB_MIX_0[s2>>>24]^SUB_MIX_1[(s3>>>16)&0xff]^SUB_MIX_2[(s0>>>8)&0xff]^SUB_MIX_3[s1&0xff]^keySchedule[ksRow++];var t3=SUB_MIX_0[s3>>>24]^SUB_MIX_1[(s0>>>16)&0xff]^SUB_MIX_2[(s1>>>8)&0xff]^SUB_MIX_3[s2&0xff]^keySchedule[ksRow++];s0=t0;s1=t1;s2=t2;s3=t3;}
var t0=((SBOX[s0>>>24]<<24)|(SBOX[(s1>>>16)&0xff]<<16)|(SBOX[(s2>>>8)&0xff]<<8)|SBOX[s3&0xff])^keySchedule[ksRow++];var t1=((SBOX[s1>>>24]<<24)|(SBOX[(s2>>>16)&0xff]<<16)|(SBOX[(s3>>>8)&0xff]<<8)|SBOX[s0&0xff])^keySchedule[ksRow++];var t2=((SBOX[s2>>>24]<<24)|(SBOX[(s3>>>16)&0xff]<<16)|(SBOX[(s0>>>8)&0xff]<<8)|SBOX[s1&0xff])^keySchedule[ksRow++];var t3=((SBOX[s3>>>24]<<24)|(SBOX[(s0>>>16)&0xff]<<16)|(SBOX[(s1>>>8)&0xff]<<8)|SBOX[s2&0xff])^keySchedule[ksRow++];M[offset]=t0;M[offset+1]=t1;M[offset+2]=t2;M[offset+3]=t3;},keySize:256/32});C.AES=BlockCipher._createHelper(AES);}());return CryptoJS.AES;}));}),(function(module,exports,__webpack_require__){;(function(root,factory){if(true){module.exports=exports=factory(__webpack_require__(0));}
else if(typeof define==="function"&&define.amd){define(["./core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){(function(){var C=CryptoJS;var C_lib=C.lib;var WordArray=C_lib.WordArray;var C_enc=C.enc;var Utf16BE=C_enc.Utf16=C_enc.Utf16BE={stringify:function(wordArray){var words=wordArray.words;var sigBytes=wordArray.sigBytes;var utf16Chars=[];for(var i=0;i<sigBytes;i+=2){var codePoint=(words[i>>>2]>>>(16-(i%4)*8))&0xffff;utf16Chars.push(String.fromCharCode(codePoint));}
return utf16Chars.join('');},parse:function(utf16Str){var utf16StrLength=utf16Str.length;var words=[];for(var i=0;i<utf16StrLength;i++){words[i>>>1]|=utf16Str.charCodeAt(i)<<(16-(i%2)*16);}
return WordArray.create(words,utf16StrLength*2);}};C_enc.Utf16LE={stringify:function(wordArray){var words=wordArray.words;var sigBytes=wordArray.sigBytes;var utf16Chars=[];for(var i=0;i<sigBytes;i+=2){var codePoint=swapEndian((words[i>>>2]>>>(16-(i%4)*8))&0xffff);utf16Chars.push(String.fromCharCode(codePoint));}
return utf16Chars.join('');},parse:function(utf16Str){var utf16StrLength=utf16Str.length;var words=[];for(var i=0;i<utf16StrLength;i++){words[i>>>1]|=swapEndian(utf16Str.charCodeAt(i)<<(16-(i%2)*16));}
return WordArray.create(words,utf16StrLength*2);}};function swapEndian(word){return((word<<8)&0xff00ff00)|((word>>>8)&0x00ff00ff);}}());return CryptoJS.enc.Utf16;}));}),(function(module,exports,__webpack_require__){;(function(root,factory,undef){if(true){module.exports=exports=factory(__webpack_require__(0),__webpack_require__(1));}
else if(typeof define==="function"&&define.amd){define(["./core","./cipher-core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){(function(undefined){var C=CryptoJS;var C_lib=C.lib;var CipherParams=C_lib.CipherParams;var C_enc=C.enc;var Hex=C_enc.Hex;var C_format=C.format;var HexFormatter=C_format.Hex={stringify:function(cipherParams){return cipherParams.ciphertext.toString(Hex);},parse:function(input){var ciphertext=Hex.parse(input);return CipherParams.create({ciphertext:ciphertext});}};}());return CryptoJS.format.Hex;}));}),(function(module,exports,__webpack_require__){;(function(root,factory){if(true){module.exports=exports=factory(__webpack_require__(0));}
else if(typeof define==="function"&&define.amd){define(["./core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){(function(){if(typeof ArrayBuffer!='function'){return;}
var C=CryptoJS;var C_lib=C.lib;var WordArray=C_lib.WordArray;var superInit=WordArray.init;var subInit=WordArray.init=function(typedArray){if(typedArray instanceof ArrayBuffer){typedArray=new Uint8Array(typedArray);}
if(typedArray instanceof Int8Array||(typeof Uint8ClampedArray!=="undefined"&&typedArray instanceof Uint8ClampedArray)||typedArray instanceof Int16Array||typedArray instanceof Uint16Array||typedArray instanceof Int32Array||typedArray instanceof Uint32Array||typedArray instanceof Float32Array||typedArray instanceof Float64Array){typedArray=new Uint8Array(typedArray.buffer,typedArray.byteOffset,typedArray.byteLength);}
if(typedArray instanceof Uint8Array){var typedArrayByteLength=typedArray.byteLength;var words=[];for(var i=0;i<typedArrayByteLength;i++){words[i>>>2]|=typedArray[i]<<(24-(i%4)*8);}
superInit.call(this,words,typedArrayByteLength);}else{superInit.apply(this,arguments);}};subInit.prototype=WordArray;}());return CryptoJS.lib.WordArray;}));}),(function(module,exports,__webpack_require__){;(function(root,factory,undef){if(true){module.exports=exports=factory(__webpack_require__(0),__webpack_require__(1));}
else if(typeof define==="function"&&define.amd){define(["./core","./cipher-core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){CryptoJS.mode.CFB=(function(){var CFB=CryptoJS.lib.BlockCipherMode.extend();CFB.Encryptor=CFB.extend({processBlock:function(words,offset){var cipher=this._cipher;var blockSize=cipher.blockSize;generateKeystreamAndEncrypt.call(this,words,offset,blockSize,cipher);this._prevBlock=words.slice(offset,offset+blockSize);}});CFB.Decryptor=CFB.extend({processBlock:function(words,offset){var cipher=this._cipher;var blockSize=cipher.blockSize;var thisBlock=words.slice(offset,offset+blockSize);generateKeystreamAndEncrypt.call(this,words,offset,blockSize,cipher);this._prevBlock=thisBlock;}});function generateKeystreamAndEncrypt(words,offset,blockSize,cipher){var iv=this._iv;if(iv){var keystream=iv.slice(0);this._iv=undefined;}else{var keystream=this._prevBlock;}
cipher.encryptBlock(keystream,0);for(var i=0;i<blockSize;i++){words[offset+i]^=keystream[i];}}
return CFB;}());return CryptoJS.mode.CFB;}));}),(function(module,exports,__webpack_require__){;(function(root,factory,undef){if(true){module.exports=exports=factory(__webpack_require__(0),__webpack_require__(1));}
else if(typeof define==="function"&&define.amd){define(["./core","./cipher-core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){CryptoJS.mode.CTRGladman=(function(){var CTRGladman=CryptoJS.lib.BlockCipherMode.extend();function incWord(word)
{if(((word>>24)&0xff)===0xff){var b1=(word>>16)&0xff;var b2=(word>>8)&0xff;var b3=word&0xff;if(b1===0xff)
{b1=0;if(b2===0xff)
{b2=0;if(b3===0xff)
{b3=0;}
else
{++b3;}}
else
{++b2;}}
else
{++b1;}
word=0;word+=(b1<<16);word+=(b2<<8);word+=b3;}
else
{word+=(0x01<<24);}
return word;}
function incCounter(counter)
{if((counter[0]=incWord(counter[0]))===0)
{counter[1]=incWord(counter[1]);}
return counter;}
var Encryptor=CTRGladman.Encryptor=CTRGladman.extend({processBlock:function(words,offset){var cipher=this._cipher
var blockSize=cipher.blockSize;var iv=this._iv;var counter=this._counter;if(iv){counter=this._counter=iv.slice(0);this._iv=undefined;}
incCounter(counter);var keystream=counter.slice(0);cipher.encryptBlock(keystream,0);for(var i=0;i<blockSize;i++){words[offset+i]^=keystream[i];}}});CTRGladman.Decryptor=Encryptor;return CTRGladman;}());return CryptoJS.mode.CTRGladman;}));}),(function(module,exports,__webpack_require__){;(function(root,factory,undef){if(true){module.exports=exports=factory(__webpack_require__(0),__webpack_require__(1));}
else if(typeof define==="function"&&define.amd){define(["./core","./cipher-core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){CryptoJS.mode.CTR=(function(){var CTR=CryptoJS.lib.BlockCipherMode.extend();var Encryptor=CTR.Encryptor=CTR.extend({processBlock:function(words,offset){var cipher=this._cipher
var blockSize=cipher.blockSize;var iv=this._iv;var counter=this._counter;if(iv){counter=this._counter=iv.slice(0);this._iv=undefined;}
var keystream=counter.slice(0);cipher.encryptBlock(keystream,0);counter[blockSize-1]=(counter[blockSize-1]+1)|0
for(var i=0;i<blockSize;i++){words[offset+i]^=keystream[i];}}});CTR.Decryptor=Encryptor;return CTR;}());return CryptoJS.mode.CTR;}));}),(function(module,exports,__webpack_require__){;(function(root,factory,undef){if(true){module.exports=exports=factory(__webpack_require__(0),__webpack_require__(1));}
else if(typeof define==="function"&&define.amd){define(["./core","./cipher-core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){CryptoJS.mode.ECB=(function(){var ECB=CryptoJS.lib.BlockCipherMode.extend();ECB.Encryptor=ECB.extend({processBlock:function(words,offset){this._cipher.encryptBlock(words,offset);}});ECB.Decryptor=ECB.extend({processBlock:function(words,offset){this._cipher.decryptBlock(words,offset);}});return ECB;}());return CryptoJS.mode.ECB;}));}),(function(module,exports,__webpack_require__){;(function(root,factory,undef){if(true){module.exports=exports=factory(__webpack_require__(0),__webpack_require__(1));}
else if(typeof define==="function"&&define.amd){define(["./core","./cipher-core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){CryptoJS.mode.OFB=(function(){var OFB=CryptoJS.lib.BlockCipherMode.extend();var Encryptor=OFB.Encryptor=OFB.extend({processBlock:function(words,offset){var cipher=this._cipher
var blockSize=cipher.blockSize;var iv=this._iv;var keystream=this._keystream;if(iv){keystream=this._keystream=iv.slice(0);this._iv=undefined;}
cipher.encryptBlock(keystream,0);for(var i=0;i<blockSize;i++){words[offset+i]^=keystream[i];}}});OFB.Decryptor=Encryptor;return OFB;}());return CryptoJS.mode.OFB;}));}),(function(module,exports,__webpack_require__){;(function(root,factory,undef){if(true){module.exports=exports=factory(__webpack_require__(0),__webpack_require__(1));}
else if(typeof define==="function"&&define.amd){define(["./core","./cipher-core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){CryptoJS.pad.AnsiX923={pad:function(data,blockSize){var dataSigBytes=data.sigBytes;var blockSizeBytes=blockSize*4;var nPaddingBytes=blockSizeBytes-dataSigBytes%blockSizeBytes;var lastBytePos=dataSigBytes+nPaddingBytes-1;data.clamp();data.words[lastBytePos>>>2]|=nPaddingBytes<<(24-(lastBytePos%4)*8);data.sigBytes+=nPaddingBytes;},unpad:function(data){var nPaddingBytes=data.words[(data.sigBytes-1)>>>2]&0xff;data.sigBytes-=nPaddingBytes;}};return CryptoJS.pad.Ansix923;}));}),(function(module,exports,__webpack_require__){;(function(root,factory,undef){if(true){module.exports=exports=factory(__webpack_require__(0),__webpack_require__(1));}
else if(typeof define==="function"&&define.amd){define(["./core","./cipher-core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){CryptoJS.pad.Iso10126={pad:function(data,blockSize){var blockSizeBytes=blockSize*4;var nPaddingBytes=blockSizeBytes-data.sigBytes%blockSizeBytes;data.concat(CryptoJS.lib.WordArray.random(nPaddingBytes-1)).concat(CryptoJS.lib.WordArray.create([nPaddingBytes<<24],1));},unpad:function(data){var nPaddingBytes=data.words[(data.sigBytes-1)>>>2]&0xff;data.sigBytes-=nPaddingBytes;}};return CryptoJS.pad.Iso10126;}));}),(function(module,exports,__webpack_require__){;(function(root,factory,undef){if(true){module.exports=exports=factory(__webpack_require__(0),__webpack_require__(1));}
else if(typeof define==="function"&&define.amd){define(["./core","./cipher-core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){CryptoJS.pad.Iso97971={pad:function(data,blockSize){data.concat(CryptoJS.lib.WordArray.create([0x80000000],1));CryptoJS.pad.ZeroPadding.pad(data,blockSize);},unpad:function(data){CryptoJS.pad.ZeroPadding.unpad(data);data.sigBytes--;}};return CryptoJS.pad.Iso97971;}));}),(function(module,exports,__webpack_require__){;(function(root,factory,undef){if(true){module.exports=exports=factory(__webpack_require__(0),__webpack_require__(1));}
else if(typeof define==="function"&&define.amd){define(["./core","./cipher-core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){CryptoJS.pad.NoPadding={pad:function(){},unpad:function(){}};return CryptoJS.pad.NoPadding;}));}),(function(module,exports,__webpack_require__){;(function(root,factory,undef){if(true){module.exports=exports=factory(__webpack_require__(0),__webpack_require__(1));}
else if(typeof define==="function"&&define.amd){define(["./core","./cipher-core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){CryptoJS.pad.ZeroPadding={pad:function(data,blockSize){var blockSizeBytes=blockSize*4;data.clamp();data.sigBytes+=blockSizeBytes-((data.sigBytes%blockSizeBytes)||blockSizeBytes);},unpad:function(data){var dataWords=data.words;var i=data.sigBytes-1;while(!((dataWords[i>>>2]>>>(24-(i%4)*8))&0xff)){i--;}
data.sigBytes=i+1;}};return CryptoJS.pad.ZeroPadding;}));}),(function(module,exports,__webpack_require__){;(function(root,factory,undef){if(true){module.exports=exports=factory(__webpack_require__(0),__webpack_require__(50),__webpack_require__(48));}
else if(typeof define==="function"&&define.amd){define(["./core","./sha1","./hmac"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){(function(){var C=CryptoJS;var C_lib=C.lib;var Base=C_lib.Base;var WordArray=C_lib.WordArray;var C_algo=C.algo;var SHA1=C_algo.SHA1;var HMAC=C_algo.HMAC;var PBKDF2=C_algo.PBKDF2=Base.extend({cfg:Base.extend({keySize:128/32,hasher:SHA1,iterations:1}),init:function(cfg){this.cfg=this.cfg.extend(cfg);},compute:function(password,salt){var cfg=this.cfg;var hmac=HMAC.create(cfg.hasher,password);var derivedKey=WordArray.create();var blockIndex=WordArray.create([0x00000001]);var derivedKeyWords=derivedKey.words;var blockIndexWords=blockIndex.words;var keySize=cfg.keySize;var iterations=cfg.iterations;while(derivedKeyWords.length<keySize){var block=hmac.update(salt).finalize(blockIndex);hmac.reset();var blockWords=block.words;var blockWordsLength=blockWords.length;var intermediate=block;for(var i=1;i<iterations;i++){intermediate=hmac.finalize(intermediate);hmac.reset();var intermediateWords=intermediate.words;for(var j=0;j<blockWordsLength;j++){blockWords[j]^=intermediateWords[j];}}
derivedKey.concat(block);blockIndexWords[0]++;}
derivedKey.sigBytes=keySize*4;return derivedKey;}});C.PBKDF2=function(password,salt,cfg){return PBKDF2.create(cfg).compute(password,salt);};}());return CryptoJS.PBKDF2;}));}),(function(module,exports,__webpack_require__){;(function(root,factory,undef){if(true){module.exports=exports=factory(__webpack_require__(0),__webpack_require__(16),__webpack_require__(18),__webpack_require__(17),__webpack_require__(1));}
else if(typeof define==="function"&&define.amd){define(["./core","./enc-base64","./md5","./evpkdf","./cipher-core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){(function(){var C=CryptoJS;var C_lib=C.lib;var StreamCipher=C_lib.StreamCipher;var C_algo=C.algo;var S=[];var C_=[];var G=[];var RabbitLegacy=C_algo.RabbitLegacy=StreamCipher.extend({_doReset:function(){var K=this._key.words;var iv=this.cfg.iv;var X=this._X=[K[0],(K[3]<<16)|(K[2]>>>16),K[1],(K[0]<<16)|(K[3]>>>16),K[2],(K[1]<<16)|(K[0]>>>16),K[3],(K[2]<<16)|(K[1]>>>16)];var C=this._C=[(K[2]<<16)|(K[2]>>>16),(K[0]&0xffff0000)|(K[1]&0x0000ffff),(K[3]<<16)|(K[3]>>>16),(K[1]&0xffff0000)|(K[2]&0x0000ffff),(K[0]<<16)|(K[0]>>>16),(K[2]&0xffff0000)|(K[3]&0x0000ffff),(K[1]<<16)|(K[1]>>>16),(K[3]&0xffff0000)|(K[0]&0x0000ffff)];this._b=0;for(var i=0;i<4;i++){nextState.call(this);}
for(var i=0;i<8;i++){C[i]^=X[(i+4)&7];}
if(iv){var IV=iv.words;var IV_0=IV[0];var IV_1=IV[1];var i0=(((IV_0<<8)|(IV_0>>>24))&0x00ff00ff)|(((IV_0<<24)|(IV_0>>>8))&0xff00ff00);var i2=(((IV_1<<8)|(IV_1>>>24))&0x00ff00ff)|(((IV_1<<24)|(IV_1>>>8))&0xff00ff00);var i1=(i0>>>16)|(i2&0xffff0000);var i3=(i2<<16)|(i0&0x0000ffff);C[0]^=i0;C[1]^=i1;C[2]^=i2;C[3]^=i3;C[4]^=i0;C[5]^=i1;C[6]^=i2;C[7]^=i3;for(var i=0;i<4;i++){nextState.call(this);}}},_doProcessBlock:function(M,offset){var X=this._X;nextState.call(this);S[0]=X[0]^(X[5]>>>16)^(X[3]<<16);S[1]=X[2]^(X[7]>>>16)^(X[5]<<16);S[2]=X[4]^(X[1]>>>16)^(X[7]<<16);S[3]=X[6]^(X[3]>>>16)^(X[1]<<16);for(var i=0;i<4;i++){S[i]=(((S[i]<<8)|(S[i]>>>24))&0x00ff00ff)|(((S[i]<<24)|(S[i]>>>8))&0xff00ff00);M[offset+i]^=S[i];}},blockSize:128/32,ivSize:64/32});function nextState(){var X=this._X;var C=this._C;for(var i=0;i<8;i++){C_[i]=C[i];}
C[0]=(C[0]+0x4d34d34d+this._b)|0;C[1]=(C[1]+0xd34d34d3+((C[0]>>>0)<(C_[0]>>>0)?1:0))|0;C[2]=(C[2]+0x34d34d34+((C[1]>>>0)<(C_[1]>>>0)?1:0))|0;C[3]=(C[3]+0x4d34d34d+((C[2]>>>0)<(C_[2]>>>0)?1:0))|0;C[4]=(C[4]+0xd34d34d3+((C[3]>>>0)<(C_[3]>>>0)?1:0))|0;C[5]=(C[5]+0x34d34d34+((C[4]>>>0)<(C_[4]>>>0)?1:0))|0;C[6]=(C[6]+0x4d34d34d+((C[5]>>>0)<(C_[5]>>>0)?1:0))|0;C[7]=(C[7]+0xd34d34d3+((C[6]>>>0)<(C_[6]>>>0)?1:0))|0;this._b=(C[7]>>>0)<(C_[7]>>>0)?1:0;for(var i=0;i<8;i++){var gx=X[i]+C[i];var ga=gx&0xffff;var gb=gx>>>16;var gh=((((ga*ga)>>>17)+ga*gb)>>>15)+gb*gb;var gl=(((gx&0xffff0000)*gx)|0)+(((gx&0x0000ffff)*gx)|0);G[i]=gh^gl;}
X[0]=(G[0]+((G[7]<<16)|(G[7]>>>16))+((G[6]<<16)|(G[6]>>>16)))|0;X[1]=(G[1]+((G[0]<<8)|(G[0]>>>24))+G[7])|0;X[2]=(G[2]+((G[1]<<16)|(G[1]>>>16))+((G[0]<<16)|(G[0]>>>16)))|0;X[3]=(G[3]+((G[2]<<8)|(G[2]>>>24))+G[1])|0;X[4]=(G[4]+((G[3]<<16)|(G[3]>>>16))+((G[2]<<16)|(G[2]>>>16)))|0;X[5]=(G[5]+((G[4]<<8)|(G[4]>>>24))+G[3])|0;X[6]=(G[6]+((G[5]<<16)|(G[5]>>>16))+((G[4]<<16)|(G[4]>>>16)))|0;X[7]=(G[7]+((G[6]<<8)|(G[6]>>>24))+G[5])|0;}
C.RabbitLegacy=StreamCipher._createHelper(RabbitLegacy);}());return CryptoJS.RabbitLegacy;}));}),(function(module,exports,__webpack_require__){;(function(root,factory,undef){if(true){module.exports=exports=factory(__webpack_require__(0),__webpack_require__(16),__webpack_require__(18),__webpack_require__(17),__webpack_require__(1));}
else if(typeof define==="function"&&define.amd){define(["./core","./enc-base64","./md5","./evpkdf","./cipher-core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){(function(){var C=CryptoJS;var C_lib=C.lib;var StreamCipher=C_lib.StreamCipher;var C_algo=C.algo;var S=[];var C_=[];var G=[];var Rabbit=C_algo.Rabbit=StreamCipher.extend({_doReset:function(){var K=this._key.words;var iv=this.cfg.iv;for(var i=0;i<4;i++){K[i]=(((K[i]<<8)|(K[i]>>>24))&0x00ff00ff)|(((K[i]<<24)|(K[i]>>>8))&0xff00ff00);}
var X=this._X=[K[0],(K[3]<<16)|(K[2]>>>16),K[1],(K[0]<<16)|(K[3]>>>16),K[2],(K[1]<<16)|(K[0]>>>16),K[3],(K[2]<<16)|(K[1]>>>16)];var C=this._C=[(K[2]<<16)|(K[2]>>>16),(K[0]&0xffff0000)|(K[1]&0x0000ffff),(K[3]<<16)|(K[3]>>>16),(K[1]&0xffff0000)|(K[2]&0x0000ffff),(K[0]<<16)|(K[0]>>>16),(K[2]&0xffff0000)|(K[3]&0x0000ffff),(K[1]<<16)|(K[1]>>>16),(K[3]&0xffff0000)|(K[0]&0x0000ffff)];this._b=0;for(var i=0;i<4;i++){nextState.call(this);}
for(var i=0;i<8;i++){C[i]^=X[(i+4)&7];}
if(iv){var IV=iv.words;var IV_0=IV[0];var IV_1=IV[1];var i0=(((IV_0<<8)|(IV_0>>>24))&0x00ff00ff)|(((IV_0<<24)|(IV_0>>>8))&0xff00ff00);var i2=(((IV_1<<8)|(IV_1>>>24))&0x00ff00ff)|(((IV_1<<24)|(IV_1>>>8))&0xff00ff00);var i1=(i0>>>16)|(i2&0xffff0000);var i3=(i2<<16)|(i0&0x0000ffff);C[0]^=i0;C[1]^=i1;C[2]^=i2;C[3]^=i3;C[4]^=i0;C[5]^=i1;C[6]^=i2;C[7]^=i3;for(var i=0;i<4;i++){nextState.call(this);}}},_doProcessBlock:function(M,offset){var X=this._X;nextState.call(this);S[0]=X[0]^(X[5]>>>16)^(X[3]<<16);S[1]=X[2]^(X[7]>>>16)^(X[5]<<16);S[2]=X[4]^(X[1]>>>16)^(X[7]<<16);S[3]=X[6]^(X[3]>>>16)^(X[1]<<16);for(var i=0;i<4;i++){S[i]=(((S[i]<<8)|(S[i]>>>24))&0x00ff00ff)|(((S[i]<<24)|(S[i]>>>8))&0xff00ff00);M[offset+i]^=S[i];}},blockSize:128/32,ivSize:64/32});function nextState(){var X=this._X;var C=this._C;for(var i=0;i<8;i++){C_[i]=C[i];}
C[0]=(C[0]+0x4d34d34d+this._b)|0;C[1]=(C[1]+0xd34d34d3+((C[0]>>>0)<(C_[0]>>>0)?1:0))|0;C[2]=(C[2]+0x34d34d34+((C[1]>>>0)<(C_[1]>>>0)?1:0))|0;C[3]=(C[3]+0x4d34d34d+((C[2]>>>0)<(C_[2]>>>0)?1:0))|0;C[4]=(C[4]+0xd34d34d3+((C[3]>>>0)<(C_[3]>>>0)?1:0))|0;C[5]=(C[5]+0x34d34d34+((C[4]>>>0)<(C_[4]>>>0)?1:0))|0;C[6]=(C[6]+0x4d34d34d+((C[5]>>>0)<(C_[5]>>>0)?1:0))|0;C[7]=(C[7]+0xd34d34d3+((C[6]>>>0)<(C_[6]>>>0)?1:0))|0;this._b=(C[7]>>>0)<(C_[7]>>>0)?1:0;for(var i=0;i<8;i++){var gx=X[i]+C[i];var ga=gx&0xffff;var gb=gx>>>16;var gh=((((ga*ga)>>>17)+ga*gb)>>>15)+gb*gb;var gl=(((gx&0xffff0000)*gx)|0)+(((gx&0x0000ffff)*gx)|0);G[i]=gh^gl;}
X[0]=(G[0]+((G[7]<<16)|(G[7]>>>16))+((G[6]<<16)|(G[6]>>>16)))|0;X[1]=(G[1]+((G[0]<<8)|(G[0]>>>24))+G[7])|0;X[2]=(G[2]+((G[1]<<16)|(G[1]>>>16))+((G[0]<<16)|(G[0]>>>16)))|0;X[3]=(G[3]+((G[2]<<8)|(G[2]>>>24))+G[1])|0;X[4]=(G[4]+((G[3]<<16)|(G[3]>>>16))+((G[2]<<16)|(G[2]>>>16)))|0;X[5]=(G[5]+((G[4]<<8)|(G[4]>>>24))+G[3])|0;X[6]=(G[6]+((G[5]<<16)|(G[5]>>>16))+((G[4]<<16)|(G[4]>>>16)))|0;X[7]=(G[7]+((G[6]<<8)|(G[6]>>>24))+G[5])|0;}
C.Rabbit=StreamCipher._createHelper(Rabbit);}());return CryptoJS.Rabbit;}));}),(function(module,exports,__webpack_require__){;(function(root,factory,undef){if(true){module.exports=exports=factory(__webpack_require__(0),__webpack_require__(16),__webpack_require__(18),__webpack_require__(17),__webpack_require__(1));}
else if(typeof define==="function"&&define.amd){define(["./core","./enc-base64","./md5","./evpkdf","./cipher-core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){(function(){var C=CryptoJS;var C_lib=C.lib;var StreamCipher=C_lib.StreamCipher;var C_algo=C.algo;var RC4=C_algo.RC4=StreamCipher.extend({_doReset:function(){var key=this._key;var keyWords=key.words;var keySigBytes=key.sigBytes;var S=this._S=[];for(var i=0;i<256;i++){S[i]=i;}
for(var i=0,j=0;i<256;i++){var keyByteIndex=i%keySigBytes;var keyByte=(keyWords[keyByteIndex>>>2]>>>(24-(keyByteIndex%4)*8))&0xff;j=(j+S[i]+keyByte)%256;var t=S[i];S[i]=S[j];S[j]=t;}
this._i=this._j=0;},_doProcessBlock:function(M,offset){M[offset]^=generateKeystreamWord.call(this);},keySize:256/32,ivSize:0});function generateKeystreamWord(){var S=this._S;var i=this._i;var j=this._j;var keystreamWord=0;for(var n=0;n<4;n++){i=(i+1)%256;j=(j+S[i])%256;var t=S[i];S[i]=S[j];S[j]=t;keystreamWord|=S[(S[i]+S[j])%256]<<(24-n*8);}
this._i=i;this._j=j;return keystreamWord;}
C.RC4=StreamCipher._createHelper(RC4);var RC4Drop=C_algo.RC4Drop=RC4.extend({cfg:RC4.cfg.extend({drop:192}),_doReset:function(){RC4._doReset.call(this);for(var i=this.cfg.drop;i>0;i--){generateKeystreamWord.call(this);}}});C.RC4Drop=StreamCipher._createHelper(RC4Drop);}());return CryptoJS.RC4;}));}),(function(module,exports,__webpack_require__){;(function(root,factory){if(true){module.exports=exports=factory(__webpack_require__(0));}
else if(typeof define==="function"&&define.amd){define(["./core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){(function(Math){var C=CryptoJS;var C_lib=C.lib;var WordArray=C_lib.WordArray;var Hasher=C_lib.Hasher;var C_algo=C.algo;var _zl=WordArray.create([0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,7,4,13,1,10,6,15,3,12,0,9,5,2,14,11,8,3,10,14,4,9,15,8,1,2,7,0,6,13,11,5,12,1,9,11,10,0,8,12,4,13,3,7,15,14,5,6,2,4,0,5,9,7,12,2,10,14,1,3,8,11,6,15,13]);var _zr=WordArray.create([5,14,7,0,9,2,11,4,13,6,15,8,1,10,3,12,6,11,3,7,0,13,5,10,14,15,8,12,4,9,1,2,15,5,1,3,7,14,6,9,11,8,12,2,10,0,4,13,8,6,4,1,3,11,15,0,5,12,2,13,9,7,10,14,12,15,10,4,1,5,8,7,6,2,13,14,0,3,9,11]);var _sl=WordArray.create([11,14,15,12,5,8,7,9,11,13,14,15,6,7,9,8,7,6,8,13,11,9,7,15,7,12,15,9,11,7,13,12,11,13,6,7,14,9,13,15,14,8,13,6,5,12,7,5,11,12,14,15,14,15,9,8,9,14,5,6,8,6,5,12,9,15,5,11,6,8,13,12,5,12,13,14,11,8,5,6]);var _sr=WordArray.create([8,9,9,11,13,15,15,5,7,7,8,11,14,14,12,6,9,13,15,7,12,8,9,11,7,7,12,7,6,15,13,11,9,7,15,11,8,6,6,14,12,13,5,14,13,13,7,5,15,5,8,11,14,14,6,14,6,9,12,9,12,5,15,8,8,5,12,9,12,5,14,6,8,13,6,5,15,13,11,11]);var _hl=WordArray.create([0x00000000,0x5A827999,0x6ED9EBA1,0x8F1BBCDC,0xA953FD4E]);var _hr=WordArray.create([0x50A28BE6,0x5C4DD124,0x6D703EF3,0x7A6D76E9,0x00000000]);var RIPEMD160=C_algo.RIPEMD160=Hasher.extend({_doReset:function(){this._hash=WordArray.create([0x67452301,0xEFCDAB89,0x98BADCFE,0x10325476,0xC3D2E1F0]);},_doProcessBlock:function(M,offset){for(var i=0;i<16;i++){var offset_i=offset+i;var M_offset_i=M[offset_i];M[offset_i]=((((M_offset_i<<8)|(M_offset_i>>>24))&0x00ff00ff)|(((M_offset_i<<24)|(M_offset_i>>>8))&0xff00ff00));}
var H=this._hash.words;var hl=_hl.words;var hr=_hr.words;var zl=_zl.words;var zr=_zr.words;var sl=_sl.words;var sr=_sr.words;var al,bl,cl,dl,el;var ar,br,cr,dr,er;ar=al=H[0];br=bl=H[1];cr=cl=H[2];dr=dl=H[3];er=el=H[4];var t;for(var i=0;i<80;i+=1){t=(al+M[offset+zl[i]])|0;if(i<16){t+=f1(bl,cl,dl)+hl[0];}else if(i<32){t+=f2(bl,cl,dl)+hl[1];}else if(i<48){t+=f3(bl,cl,dl)+hl[2];}else if(i<64){t+=f4(bl,cl,dl)+hl[3];}else{t+=f5(bl,cl,dl)+hl[4];}
t=t|0;t=rotl(t,sl[i]);t=(t+el)|0;al=el;el=dl;dl=rotl(cl,10);cl=bl;bl=t;t=(ar+M[offset+zr[i]])|0;if(i<16){t+=f5(br,cr,dr)+hr[0];}else if(i<32){t+=f4(br,cr,dr)+hr[1];}else if(i<48){t+=f3(br,cr,dr)+hr[2];}else if(i<64){t+=f2(br,cr,dr)+hr[3];}else{t+=f1(br,cr,dr)+hr[4];}
t=t|0;t=rotl(t,sr[i]);t=(t+er)|0;ar=er;er=dr;dr=rotl(cr,10);cr=br;br=t;}
t=(H[1]+cl+dr)|0;H[1]=(H[2]+dl+er)|0;H[2]=(H[3]+el+ar)|0;H[3]=(H[4]+al+br)|0;H[4]=(H[0]+bl+cr)|0;H[0]=t;},_doFinalize:function(){var data=this._data;var dataWords=data.words;var nBitsTotal=this._nDataBytes*8;var nBitsLeft=data.sigBytes*8;dataWords[nBitsLeft>>>5]|=0x80<<(24-nBitsLeft%32);dataWords[(((nBitsLeft+64)>>>9)<<4)+14]=((((nBitsTotal<<8)|(nBitsTotal>>>24))&0x00ff00ff)|(((nBitsTotal<<24)|(nBitsTotal>>>8))&0xff00ff00));data.sigBytes=(dataWords.length+1)*4;this._process();var hash=this._hash;var H=hash.words;for(var i=0;i<5;i++){var H_i=H[i];H[i]=(((H_i<<8)|(H_i>>>24))&0x00ff00ff)|(((H_i<<24)|(H_i>>>8))&0xff00ff00);}
return hash;},clone:function(){var clone=Hasher.clone.call(this);clone._hash=this._hash.clone();return clone;}});function f1(x,y,z){return((x)^(y)^(z));}
function f2(x,y,z){return(((x)&(y))|((~x)&(z)));}
function f3(x,y,z){return(((x)|(~(y)))^(z));}
function f4(x,y,z){return(((x)&(z))|((y)&(~(z))));}
function f5(x,y,z){return((x)^((y)|(~(z))));}
function rotl(x,n){return(x<<n)|(x>>>(32-n));}
C.RIPEMD160=Hasher._createHelper(RIPEMD160);C.HmacRIPEMD160=Hasher._createHmacHelper(RIPEMD160);}(Math));return CryptoJS.RIPEMD160;}));}),(function(module,exports,__webpack_require__){;(function(root,factory,undef){if(true){module.exports=exports=factory(__webpack_require__(0),__webpack_require__(57));}
else if(typeof define==="function"&&define.amd){define(["./core","./sha256"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){(function(){var C=CryptoJS;var C_lib=C.lib;var WordArray=C_lib.WordArray;var C_algo=C.algo;var SHA256=C_algo.SHA256;var SHA224=C_algo.SHA224=SHA256.extend({_doReset:function(){this._hash=new WordArray.init([0xc1059ed8,0x367cd507,0x3070dd17,0xf70e5939,0xffc00b31,0x68581511,0x64f98fa7,0xbefa4fa4]);},_doFinalize:function(){var hash=SHA256._doFinalize.call(this);hash.sigBytes-=4;return hash;}});C.SHA224=SHA256._createHelper(SHA224);C.HmacSHA224=SHA256._createHmacHelper(SHA224);}());return CryptoJS.SHA224;}));}),(function(module,exports,__webpack_require__){;(function(root,factory,undef){if(true){module.exports=exports=factory(__webpack_require__(0),__webpack_require__(33),__webpack_require__(58));}
else if(typeof define==="function"&&define.amd){define(["./core","./x64-core","./sha512"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){(function(){var C=CryptoJS;var C_x64=C.x64;var X64Word=C_x64.Word;var X64WordArray=C_x64.WordArray;var C_algo=C.algo;var SHA512=C_algo.SHA512;var SHA384=C_algo.SHA384=SHA512.extend({_doReset:function(){this._hash=new X64WordArray.init([new X64Word.init(0xcbbb9d5d,0xc1059ed8),new X64Word.init(0x629a292a,0x367cd507),new X64Word.init(0x9159015a,0x3070dd17),new X64Word.init(0x152fecd8,0xf70e5939),new X64Word.init(0x67332667,0xffc00b31),new X64Word.init(0x8eb44a87,0x68581511),new X64Word.init(0xdb0c2e0d,0x64f98fa7),new X64Word.init(0x47b5481d,0xbefa4fa4)]);},_doFinalize:function(){var hash=SHA512._doFinalize.call(this);hash.sigBytes-=16;return hash;}});C.SHA384=SHA512._createHelper(SHA384);C.HmacSHA384=SHA512._createHmacHelper(SHA384);}());return CryptoJS.SHA384;}));}),(function(module,exports,__webpack_require__){;(function(root,factory,undef){if(true){module.exports=exports=factory(__webpack_require__(0),__webpack_require__(16),__webpack_require__(18),__webpack_require__(17),__webpack_require__(1));}
else if(typeof define==="function"&&define.amd){define(["./core","./enc-base64","./md5","./evpkdf","./cipher-core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){(function(){var C=CryptoJS;var C_lib=C.lib;var WordArray=C_lib.WordArray;var BlockCipher=C_lib.BlockCipher;var C_algo=C.algo;var PC1=[57,49,41,33,25,17,9,1,58,50,42,34,26,18,10,2,59,51,43,35,27,19,11,3,60,52,44,36,63,55,47,39,31,23,15,7,62,54,46,38,30,22,14,6,61,53,45,37,29,21,13,5,28,20,12,4];var PC2=[14,17,11,24,1,5,3,28,15,6,21,10,23,19,12,4,26,8,16,7,27,20,13,2,41,52,31,37,47,55,30,40,51,45,33,48,44,49,39,56,34,53,46,42,50,36,29,32];var BIT_SHIFTS=[1,2,4,6,8,10,12,14,15,17,19,21,23,25,27,28];var SBOX_P=[{0x0:0x808200,0x10000000:0x8000,0x20000000:0x808002,0x30000000:0x2,0x40000000:0x200,0x50000000:0x808202,0x60000000:0x800202,0x70000000:0x800000,0x80000000:0x202,0x90000000:0x800200,0xa0000000:0x8200,0xb0000000:0x808000,0xc0000000:0x8002,0xd0000000:0x800002,0xe0000000:0x0,0xf0000000:0x8202,0x8000000:0x0,0x18000000:0x808202,0x28000000:0x8202,0x38000000:0x8000,0x48000000:0x808200,0x58000000:0x200,0x68000000:0x808002,0x78000000:0x2,0x88000000:0x800200,0x98000000:0x8200,0xa8000000:0x808000,0xb8000000:0x800202,0xc8000000:0x800002,0xd8000000:0x8002,0xe8000000:0x202,0xf8000000:0x800000,0x1:0x8000,0x10000001:0x2,0x20000001:0x808200,0x30000001:0x800000,0x40000001:0x808002,0x50000001:0x8200,0x60000001:0x200,0x70000001:0x800202,0x80000001:0x808202,0x90000001:0x808000,0xa0000001:0x800002,0xb0000001:0x8202,0xc0000001:0x202,0xd0000001:0x800200,0xe0000001:0x8002,0xf0000001:0x0,0x8000001:0x808202,0x18000001:0x808000,0x28000001:0x800000,0x38000001:0x200,0x48000001:0x8000,0x58000001:0x800002,0x68000001:0x2,0x78000001:0x8202,0x88000001:0x8002,0x98000001:0x800202,0xa8000001:0x202,0xb8000001:0x808200,0xc8000001:0x800200,0xd8000001:0x0,0xe8000001:0x8200,0xf8000001:0x808002},{0x0:0x40084010,0x1000000:0x4000,0x2000000:0x80000,0x3000000:0x40080010,0x4000000:0x40000010,0x5000000:0x40084000,0x6000000:0x40004000,0x7000000:0x10,0x8000000:0x84000,0x9000000:0x40004010,0xa000000:0x40000000,0xb000000:0x84010,0xc000000:0x80010,0xd000000:0x0,0xe000000:0x4010,0xf000000:0x40080000,0x800000:0x40004000,0x1800000:0x84010,0x2800000:0x10,0x3800000:0x40004010,0x4800000:0x40084010,0x5800000:0x40000000,0x6800000:0x80000,0x7800000:0x40080010,0x8800000:0x80010,0x9800000:0x0,0xa800000:0x4000,0xb800000:0x40080000,0xc800000:0x40000010,0xd800000:0x84000,0xe800000:0x40084000,0xf800000:0x4010,0x10000000:0x0,0x11000000:0x40080010,0x12000000:0x40004010,0x13000000:0x40084000,0x14000000:0x40080000,0x15000000:0x10,0x16000000:0x84010,0x17000000:0x4000,0x18000000:0x4010,0x19000000:0x80000,0x1a000000:0x80010,0x1b000000:0x40000010,0x1c000000:0x84000,0x1d000000:0x40004000,0x1e000000:0x40000000,0x1f000000:0x40084010,0x10800000:0x84010,0x11800000:0x80000,0x12800000:0x40080000,0x13800000:0x4000,0x14800000:0x40004000,0x15800000:0x40084010,0x16800000:0x10,0x17800000:0x40000000,0x18800000:0x40084000,0x19800000:0x40000010,0x1a800000:0x40004010,0x1b800000:0x80010,0x1c800000:0x0,0x1d800000:0x4010,0x1e800000:0x40080010,0x1f800000:0x84000},{0x0:0x104,0x100000:0x0,0x200000:0x4000100,0x300000:0x10104,0x400000:0x10004,0x500000:0x4000004,0x600000:0x4010104,0x700000:0x4010000,0x800000:0x4000000,0x900000:0x4010100,0xa00000:0x10100,0xb00000:0x4010004,0xc00000:0x4000104,0xd00000:0x10000,0xe00000:0x4,0xf00000:0x100,0x80000:0x4010100,0x180000:0x4010004,0x280000:0x0,0x380000:0x4000100,0x480000:0x4000004,0x580000:0x10000,0x680000:0x10004,0x780000:0x104,0x880000:0x4,0x980000:0x100,0xa80000:0x4010000,0xb80000:0x10104,0xc80000:0x10100,0xd80000:0x4000104,0xe80000:0x4010104,0xf80000:0x4000000,0x1000000:0x4010100,0x1100000:0x10004,0x1200000:0x10000,0x1300000:0x4000100,0x1400000:0x100,0x1500000:0x4010104,0x1600000:0x4000004,0x1700000:0x0,0x1800000:0x4000104,0x1900000:0x4000000,0x1a00000:0x4,0x1b00000:0x10100,0x1c00000:0x4010000,0x1d00000:0x104,0x1e00000:0x10104,0x1f00000:0x4010004,0x1080000:0x4000000,0x1180000:0x104,0x1280000:0x4010100,0x1380000:0x0,0x1480000:0x10004,0x1580000:0x4000100,0x1680000:0x100,0x1780000:0x4010004,0x1880000:0x10000,0x1980000:0x4010104,0x1a80000:0x10104,0x1b80000:0x4000004,0x1c80000:0x4000104,0x1d80000:0x4010000,0x1e80000:0x4,0x1f80000:0x10100},{0x0:0x80401000,0x10000:0x80001040,0x20000:0x401040,0x30000:0x80400000,0x40000:0x0,0x50000:0x401000,0x60000:0x80000040,0x70000:0x400040,0x80000:0x80000000,0x90000:0x400000,0xa0000:0x40,0xb0000:0x80001000,0xc0000:0x80400040,0xd0000:0x1040,0xe0000:0x1000,0xf0000:0x80401040,0x8000:0x80001040,0x18000:0x40,0x28000:0x80400040,0x38000:0x80001000,0x48000:0x401000,0x58000:0x80401040,0x68000:0x0,0x78000:0x80400000,0x88000:0x1000,0x98000:0x80401000,0xa8000:0x400000,0xb8000:0x1040,0xc8000:0x80000000,0xd8000:0x400040,0xe8000:0x401040,0xf8000:0x80000040,0x100000:0x400040,0x110000:0x401000,0x120000:0x80000040,0x130000:0x0,0x140000:0x1040,0x150000:0x80400040,0x160000:0x80401000,0x170000:0x80001040,0x180000:0x80401040,0x190000:0x80000000,0x1a0000:0x80400000,0x1b0000:0x401040,0x1c0000:0x80001000,0x1d0000:0x400000,0x1e0000:0x40,0x1f0000:0x1000,0x108000:0x80400000,0x118000:0x80401040,0x128000:0x0,0x138000:0x401000,0x148000:0x400040,0x158000:0x80000000,0x168000:0x80001040,0x178000:0x40,0x188000:0x80000040,0x198000:0x1000,0x1a8000:0x80001000,0x1b8000:0x80400040,0x1c8000:0x1040,0x1d8000:0x80401000,0x1e8000:0x400000,0x1f8000:0x401040},{0x0:0x80,0x1000:0x1040000,0x2000:0x40000,0x3000:0x20000000,0x4000:0x20040080,0x5000:0x1000080,0x6000:0x21000080,0x7000:0x40080,0x8000:0x1000000,0x9000:0x20040000,0xa000:0x20000080,0xb000:0x21040080,0xc000:0x21040000,0xd000:0x0,0xe000:0x1040080,0xf000:0x21000000,0x800:0x1040080,0x1800:0x21000080,0x2800:0x80,0x3800:0x1040000,0x4800:0x40000,0x5800:0x20040080,0x6800:0x21040000,0x7800:0x20000000,0x8800:0x20040000,0x9800:0x0,0xa800:0x21040080,0xb800:0x1000080,0xc800:0x20000080,0xd800:0x21000000,0xe800:0x1000000,0xf800:0x40080,0x10000:0x40000,0x11000:0x80,0x12000:0x20000000,0x13000:0x21000080,0x14000:0x1000080,0x15000:0x21040000,0x16000:0x20040080,0x17000:0x1000000,0x18000:0x21040080,0x19000:0x21000000,0x1a000:0x1040000,0x1b000:0x20040000,0x1c000:0x40080,0x1d000:0x20000080,0x1e000:0x0,0x1f000:0x1040080,0x10800:0x21000080,0x11800:0x1000000,0x12800:0x1040000,0x13800:0x20040080,0x14800:0x20000000,0x15800:0x1040080,0x16800:0x80,0x17800:0x21040000,0x18800:0x40080,0x19800:0x21040080,0x1a800:0x0,0x1b800:0x21000000,0x1c800:0x1000080,0x1d800:0x40000,0x1e800:0x20040000,0x1f800:0x20000080},{0x0:0x10000008,0x100:0x2000,0x200:0x10200000,0x300:0x10202008,0x400:0x10002000,0x500:0x200000,0x600:0x200008,0x700:0x10000000,0x800:0x0,0x900:0x10002008,0xa00:0x202000,0xb00:0x8,0xc00:0x10200008,0xd00:0x202008,0xe00:0x2008,0xf00:0x10202000,0x80:0x10200000,0x180:0x10202008,0x280:0x8,0x380:0x200000,0x480:0x202008,0x580:0x10000008,0x680:0x10002000,0x780:0x2008,0x880:0x200008,0x980:0x2000,0xa80:0x10002008,0xb80:0x10200008,0xc80:0x0,0xd80:0x10202000,0xe80:0x202000,0xf80:0x10000000,0x1000:0x10002000,0x1100:0x10200008,0x1200:0x10202008,0x1300:0x2008,0x1400:0x200000,0x1500:0x10000000,0x1600:0x10000008,0x1700:0x202000,0x1800:0x202008,0x1900:0x0,0x1a00:0x8,0x1b00:0x10200000,0x1c00:0x2000,0x1d00:0x10002008,0x1e00:0x10202000,0x1f00:0x200008,0x1080:0x8,0x1180:0x202000,0x1280:0x200000,0x1380:0x10000008,0x1480:0x10002000,0x1580:0x2008,0x1680:0x10202008,0x1780:0x10200000,0x1880:0x10202000,0x1980:0x10200008,0x1a80:0x2000,0x1b80:0x202008,0x1c80:0x200008,0x1d80:0x0,0x1e80:0x10000000,0x1f80:0x10002008},{0x0:0x100000,0x10:0x2000401,0x20:0x400,0x30:0x100401,0x40:0x2100401,0x50:0x0,0x60:0x1,0x70:0x2100001,0x80:0x2000400,0x90:0x100001,0xa0:0x2000001,0xb0:0x2100400,0xc0:0x2100000,0xd0:0x401,0xe0:0x100400,0xf0:0x2000000,0x8:0x2100001,0x18:0x0,0x28:0x2000401,0x38:0x2100400,0x48:0x100000,0x58:0x2000001,0x68:0x2000000,0x78:0x401,0x88:0x100401,0x98:0x2000400,0xa8:0x2100000,0xb8:0x100001,0xc8:0x400,0xd8:0x2100401,0xe8:0x1,0xf8:0x100400,0x100:0x2000000,0x110:0x100000,0x120:0x2000401,0x130:0x2100001,0x140:0x100001,0x150:0x2000400,0x160:0x2100400,0x170:0x100401,0x180:0x401,0x190:0x2100401,0x1a0:0x100400,0x1b0:0x1,0x1c0:0x0,0x1d0:0x2100000,0x1e0:0x2000001,0x1f0:0x400,0x108:0x100400,0x118:0x2000401,0x128:0x2100001,0x138:0x1,0x148:0x2000000,0x158:0x100000,0x168:0x401,0x178:0x2100400,0x188:0x2000001,0x198:0x2100000,0x1a8:0x0,0x1b8:0x2100401,0x1c8:0x100401,0x1d8:0x400,0x1e8:0x2000400,0x1f8:0x100001},{0x0:0x8000820,0x1:0x20000,0x2:0x8000000,0x3:0x20,0x4:0x20020,0x5:0x8020820,0x6:0x8020800,0x7:0x800,0x8:0x8020000,0x9:0x8000800,0xa:0x20800,0xb:0x8020020,0xc:0x820,0xd:0x0,0xe:0x8000020,0xf:0x20820,0x80000000:0x800,0x80000001:0x8020820,0x80000002:0x8000820,0x80000003:0x8000000,0x80000004:0x8020000,0x80000005:0x20800,0x80000006:0x20820,0x80000007:0x20,0x80000008:0x8000020,0x80000009:0x820,0x8000000a:0x20020,0x8000000b:0x8020800,0x8000000c:0x0,0x8000000d:0x8020020,0x8000000e:0x8000800,0x8000000f:0x20000,0x10:0x20820,0x11:0x8020800,0x12:0x20,0x13:0x800,0x14:0x8000800,0x15:0x8000020,0x16:0x8020020,0x17:0x20000,0x18:0x0,0x19:0x20020,0x1a:0x8020000,0x1b:0x8000820,0x1c:0x8020820,0x1d:0x20800,0x1e:0x820,0x1f:0x8000000,0x80000010:0x20000,0x80000011:0x800,0x80000012:0x8020020,0x80000013:0x20820,0x80000014:0x20,0x80000015:0x8020000,0x80000016:0x8000000,0x80000017:0x8000820,0x80000018:0x8020820,0x80000019:0x8000020,0x8000001a:0x8000800,0x8000001b:0x0,0x8000001c:0x20800,0x8000001d:0x820,0x8000001e:0x20020,0x8000001f:0x8020800}];var SBOX_MASK=[0xf8000001,0x1f800000,0x01f80000,0x001f8000,0x0001f800,0x00001f80,0x000001f8,0x8000001f];var DES=C_algo.DES=BlockCipher.extend({_doReset:function(){var key=this._key;var keyWords=key.words;var keyBits=[];for(var i=0;i<56;i++){var keyBitPos=PC1[i]-1;keyBits[i]=(keyWords[keyBitPos>>>5]>>>(31-keyBitPos%32))&1;}
var subKeys=this._subKeys=[];for(var nSubKey=0;nSubKey<16;nSubKey++){var subKey=subKeys[nSubKey]=[];var bitShift=BIT_SHIFTS[nSubKey];for(var i=0;i<24;i++){subKey[(i/6)|0]|=keyBits[((PC2[i]-1)+bitShift)%28]<<(31-i%6);subKey[4+((i/6)|0)]|=keyBits[28+(((PC2[i+24]-1)+bitShift)%28)]<<(31-i%6);}
subKey[0]=(subKey[0]<<1)|(subKey[0]>>>31);for(var i=1;i<7;i++){subKey[i]=subKey[i]>>>((i-1)*4+3);}
subKey[7]=(subKey[7]<<5)|(subKey[7]>>>27);}
var invSubKeys=this._invSubKeys=[];for(var i=0;i<16;i++){invSubKeys[i]=subKeys[15-i];}},encryptBlock:function(M,offset){this._doCryptBlock(M,offset,this._subKeys);},decryptBlock:function(M,offset){this._doCryptBlock(M,offset,this._invSubKeys);},_doCryptBlock:function(M,offset,subKeys){this._lBlock=M[offset];this._rBlock=M[offset+1];exchangeLR.call(this,4,0x0f0f0f0f);exchangeLR.call(this,16,0x0000ffff);exchangeRL.call(this,2,0x33333333);exchangeRL.call(this,8,0x00ff00ff);exchangeLR.call(this,1,0x55555555);for(var round=0;round<16;round++){var subKey=subKeys[round];var lBlock=this._lBlock;var rBlock=this._rBlock;var f=0;for(var i=0;i<8;i++){f|=SBOX_P[i][((rBlock^subKey[i])&SBOX_MASK[i])>>>0];}
this._lBlock=rBlock;this._rBlock=lBlock^f;}
var t=this._lBlock;this._lBlock=this._rBlock;this._rBlock=t;exchangeLR.call(this,1,0x55555555);exchangeRL.call(this,8,0x00ff00ff);exchangeRL.call(this,2,0x33333333);exchangeLR.call(this,16,0x0000ffff);exchangeLR.call(this,4,0x0f0f0f0f);M[offset]=this._lBlock;M[offset+1]=this._rBlock;},keySize:64/32,ivSize:64/32,blockSize:64/32});function exchangeLR(offset,mask){var t=((this._lBlock>>>offset)^this._rBlock)&mask;this._rBlock^=t;this._lBlock^=t<<offset;}
function exchangeRL(offset,mask){var t=((this._rBlock>>>offset)^this._lBlock)&mask;this._lBlock^=t;this._rBlock^=t<<offset;}
C.DES=BlockCipher._createHelper(DES);var TripleDES=C_algo.TripleDES=BlockCipher.extend({_doReset:function(){var key=this._key;var keyWords=key.words;this._des1=DES.createEncryptor(WordArray.create(keyWords.slice(0,2)));this._des2=DES.createEncryptor(WordArray.create(keyWords.slice(2,4)));this._des3=DES.createEncryptor(WordArray.create(keyWords.slice(4,6)));},encryptBlock:function(M,offset){this._des1.encryptBlock(M,offset);this._des2.decryptBlock(M,offset);this._des3.encryptBlock(M,offset);},decryptBlock:function(M,offset){this._des3.decryptBlock(M,offset);this._des2.encryptBlock(M,offset);this._des1.decryptBlock(M,offset);},keySize:192/32,ivSize:64/32,blockSize:64/32});C.TripleDES=BlockCipher._createHelper(TripleDES);}());return CryptoJS.TripleDES;}));}),(function(module,exports,__webpack_require__){exports=module.exports=__webpack_require__(99)();exports.push([module.i,"    * {box-sizing: border-box}\r\n    body {font-family: Verdana, sans-serif; margin:0}\r\n    .mySlides {display: none}\r\n    img {vertical-align: middle;}\r\n\r\n    table, th, td {\r\n        border: 1px solid gray;\r\n        border-collapse: collapse;\r\n    }\r\n\r\n    a {\r\n        color: pink;\r\n    }\r\n\r\n    .button{\r\n      padding: 7px 22px;\r\n      font-size: 20px;\r\n    }\r\n\r\n    .fixed{\r\n      max-width: 100%;\r\n      position: relative;\r\n      margin: auto;\r\n      text-align: center;\r\n\r\n    }\r\n\r\n\r\n\r\n    .topimage{\r\n      position: absolute;\r\n      left: 10%;\r\n      width: 80%;\r\n      text-align: center;\r\n    }\r\n\r\n    .vicjpg{\r\n      position: absolute;\r\n      top: 40px;\r\n      left: 106px;\r\n      width: 66px;\r\n    }\r\n\r\n    .blockchaincedjpg{\r\n      position: absolute;\r\n      top: 20px;\r\n      left: 20px;\r\n      width: 66px;\r\n    }\r\n\r\n\r\n\r\n    .CSBDcontainer{\r\n      color: #f2f2f2;\r\n      font-size: 20px;\r\n      padding: 8px 12px;\r\n      position: absolute;\r\n      top: 5%;\r\n      left: 15%;\r\n      width: 70%;\r\n      text-align: center;\r\n    }\r\n\r\n    .tabletext{\r\n      color: #f2f2f2;\r\n      font-size: 24px;\r\n      padding: 8px 12px;\r\n      position: relative;\r\n      left: 10%;\r\n      width: 80%;\r\n      text-align: left;\r\n    }\r\n\r\n    input[type=text], select {\r\n      width: 100%;\r\n      padding: 12px 20px;\r\n      margin: 8px 10;\r\n      display: inline-block;\r\n      border: 1px solid #ccc;\r\n      border-radius: 4px;\r\n      box-sizing: border-box;\r\n      font-size: 24px;\r\n    }\r\n\r\n\r\n\r\n    /* Slideshow container */\r\n    .slideshow-container {\r\n      top: 3%;\r\n      left: 10%;\r\n      right: 10%;\r\n      position: absolute;\r\n      padding: 8px 12px;\r\n      text-align: center;\r\n    }\r\n\r\n    /* Next & previous buttons */\r\n    .prev, .next {\r\n      cursor: pointer;\r\n      position: absolute;\r\n      top: 50%;\r\n      width: auto;\r\n      padding: 16px;\r\n      margin-top: -22px;\r\n      color: white;\r\n      font-weight: bold;\r\n      font-size: 18px;\r\n      transition: 0.6s ease;\r\n      border-radius: 0 3px 3px 0;\r\n    }\r\n\r\n    /* Position the \"next button\" to the right */\r\n    .next {\r\n      right: 0;\r\n      border-radius: 3px 0 0 3px;\r\n    }\r\n\r\n    /* Position the \"next button\" to the right */\r\n    .prev {\r\n      left: 0;\r\n    }\r\n\r\n    /* On hover, add a black background color with a little bit see-through */\r\n    .prev:hover, .next:hover {\r\n      background-color: rgba(0,0,0,0.8);\r\n    }\r\n\r\n    /* Caption text */\r\n    .text {\r\n      color: #f2f2f2;\r\n      font-size: 15px;\r\n      padding: 10px 15px;\r\n      position: absolute;\r\n      top: 3%;\r\n      width: 98%;\r\n      text-align: center;\r\n    }\r\n\r\n    /* Number text (1/3 etc) */\r\n    .numbertext {\r\n      color: springgreen;\r\n      font-size: 20px;\r\n      left: 5%;\r\n      right: 5%;\r\n      bottom: 8px;\r\n      position: absolute;\r\n      padding: 8px 12px;\r\n      text-align: center;\r\n    }\r\n\r\n    /* The dots/bullets/indicators */\r\n    .dot {\r\n      cursor: pointer;\r\n      height: 15px;\r\n      width: 15px;\r\n      margin: 0 2px;\r\n      background-color: #bbb;\r\n      border-radius: 50%;\r\n      display: inline-block;\r\n      transition: background-color 0.6s ease;\r\n    }\r\n\r\n    .active, .dot:hover {\r\n      background-color: #717171;\r\n    }\r\n\r\n    /* Fading animation */\r\n    .fade {\r\n      -webkit-animation-name: fade;\r\n      -webkit-animation-duration: 1.5s;\r\n      animation-name: fade;\r\n      animation-duration: 1.5s;\r\n    }\r\n\r\n\r\n\r\n    @-webkit-keyframes fade {\r\n      from {opacity: .4} \r\n      to {opacity: 1}\r\n    }\r\n\r\n    @keyframes fade {\r\n      from {opacity: .4} \r\n      to {opacity: 1}\r\n    }\r\n\r\n    /* On smaller screens, decrease text size */\r\n    @media only screen and (max-width: 300px) {\r\n      .prev, .next,.text {font-size: 11px}\r\n    }\r\n",""]);}),(function(module,exports){module.exports=function(){var list=[];list.toString=function toString(){var result=[];for(var i=0;i<this.length;i++){var item=this[i];if(item[2]){result.push("@media "+item[2]+"{"+item[1]+"}");}else{result.push(item[1]);}}
return result.join("");};list.i=function(modules,mediaQuery){if(typeof modules==="string")
modules=[[null,modules,""]];var alreadyImportedModules={};for(var i=0;i<this.length;i++){var id=this[i][0];if(typeof id==="number")
alreadyImportedModules[id]=true;}
for(i=0;i<modules.length;i++){var item=modules[i];if(typeof item[0]!=="number"||!alreadyImportedModules[item[0]]){if(mediaQuery&&!item[2]){item[2]=mediaQuery;}else if(mediaQuery){item[2]="("+item[2]+") and ("+mediaQuery+")";}
list.push(item);}}};return list;};}),(function(module,exports,__webpack_require__){"use strict";(function(Buffer){var utils=__webpack_require__(101);var uint256Coder=utils.uint256Coder;var coderBoolean=utils.coderBoolean;var coderFixedBytes=utils.coderFixedBytes;var coderAddress=utils.coderAddress;var coderDynamicBytes=utils.coderDynamicBytes;var coderString=utils.coderString;var coderArray=utils.coderArray;var paramTypePart=utils.paramTypePart;var getParamCoder=utils.getParamCoder;function Result(){}
function encodeParams(types,values){if(types.length!==values.length){throw new Error('[ethjs-abi] while encoding params, types/values mismatch, types length '+types.length+' should be '+values.length);}
var parts=[];types.forEach(function(type,index){var coder=getParamCoder(type);parts.push({dynamic:coder.dynamic,value:coder.encode(values[index])});});function alignSize(size){return parseInt(32*Math.ceil(size/32));}
var staticSize=0,dynamicSize=0;parts.forEach(function(part){if(part.dynamic){staticSize+=32;dynamicSize+=alignSize(part.value.length);}else{staticSize+=alignSize(part.value.length);}});var offset=0,dynamicOffset=staticSize;var data=new Buffer(staticSize+dynamicSize);parts.forEach(function(part,index){if(part.dynamic){uint256Coder.encode(dynamicOffset).copy(data,offset);offset+=32;part.value.copy(data,dynamicOffset);dynamicOffset+=alignSize(part.value.length);}else{part.value.copy(data,offset);offset+=alignSize(part.value.length);}});return'0x'+data.toString('hex');}
function decodeParams(names,types,data){if(arguments.length<3){data=types;types=names;names=[];}
data=utils.hexOrBuffer(data);var values=new Result();var offset=0;types.forEach(function(type,index){var coder=getParamCoder(type);if(coder.dynamic){var dynamicOffset=uint256Coder.decode(data,offset);var result=coder.decode(data,dynamicOffset.value.toNumber());offset+=dynamicOffset.consumed;}else{var result=coder.decode(data,offset);offset+=result.consumed;}
values[index]=result.value;if(names[index]){values[names[index]]=result.value;}});return values;}
function encodeMethod(method,values){var signature=method.name+'('+utils.getKeys(method.inputs,'type').join(',')+')';var signatureEncoded='0x'+new Buffer(utils.keccak256(signature),'hex').slice(0,4).toString('hex');var paramsEncoded=encodeParams(utils.getKeys(method.inputs,'type'),values).substring(2);return''+signatureEncoded+paramsEncoded;}
function decodeMethod(method,data){var outputNames=utils.getKeys(method.outputs,'name',true);var outputTypes=utils.getKeys(method.outputs,'type');return decodeParams(outputNames,outputTypes,utils.hexOrBuffer(data));}
function encodeEvent(eventObject,values){return encodeMethod(eventObject,values);}
function decodeEvent(eventObject,data){var inputNames=utils.getKeys(eventObject.inputs,'name',true);var inputTypes=utils.getKeys(eventObject.inputs,'type');return decodeParams(inputNames,inputTypes,utils.hexOrBuffer(data));}
module.exports={encodeParams:encodeParams,decodeParams:decodeParams,encodeMethod:encodeMethod,decodeMethod:decodeMethod,encodeEvent:encodeEvent,decodeEvent:decodeEvent};}.call(exports,__webpack_require__(31).Buffer))}),(function(module,exports,__webpack_require__){"use strict";(function(Buffer){var BN=__webpack_require__(56);var numberToBN=__webpack_require__(106);var keccak256=__webpack_require__(105).keccak_256;function stripZeros(aInput){var a=aInput;var first=a[0];while(a.length>0&&first.toString()==='0'){a=a.slice(1);first=a[0];}
return a;}
function bnToBuffer(bnInput){var bn=bnInput;var hex=bn.toString(16);if(hex.length%2){hex='0'+hex;}
return stripZeros(new Buffer(hex,'hex'));}
function isHexString(value,length){if(typeof value!=='string'||!value.match(/^0x[0-9A-Fa-f]*$/)){return false;}
if(length&&value.length!==2+2*length){return false;}
return true;}
function hexOrBuffer(valueInput,name){var value=valueInput;if(!Buffer.isBuffer(value)){if(!isHexString(value)){var error=new Error(name?'[ethjs-abi] invalid '+name:'[ethjs-abi] invalid hex or buffer, must be a prefixed alphanumeric even length hex string');error.reason='[ethjs-abi] invalid hex string, hex must be prefixed and alphanumeric (e.g. 0x023..)';error.value=value;throw error;}
value=value.substring(2);if(value.length%2){value='0'+value;}
value=new Buffer(value,'hex');}
return value;}
function hexlify(value){if(typeof value==='number'){return'0x'+bnToBuffer(new BN(value)).toString('hex');}else if(value.mod||value.modulo){return'0x'+bnToBuffer(value).toString('hex');}else{return'0x'+hexOrBuffer(value).toString('hex');}}
function getKeys(params,key,allowEmpty){var result=[];if(!Array.isArray(params)){throw new Error('[ethjs-abi] while getting keys, invalid params value '+JSON.stringify(params));}
for(var i=0;i<params.length;i++){var value=params[i][key];if(allowEmpty&&!value){value='';}else if(typeof value!=='string'){throw new Error('[ethjs-abi] while getKeys found invalid ABI data structure, type value not string');}
result.push(value);}
return result;}
function coderNumber(size,signed){return{encode:function encodeNumber(valueInput){var value=valueInput;if(typeof value==='object'&&value.toString&&(value.toTwos||value.dividedToIntegerBy)){value=value.toString(10).split('.')[0];}
if(typeof value==='string'||typeof value==='number'){value=String(value).split('.')[0];}
value=numberToBN(value);value=value.toTwos(size*8).maskn(size*8);if(signed){value=value.fromTwos(size*8).toTwos(256);}
return value.toArrayLike(Buffer,'be',32);},decode:function decodeNumber(data,offset){var junkLength=32-size;var value=new BN(data.slice(offset+junkLength,offset+32));if(signed){value=value.fromTwos(size*8);}else{value=value.maskn(size*8);}
return{consumed:32,value:new BN(value.toString(10))};}};}
var uint256Coder=coderNumber(32,false);var coderBoolean={encode:function encodeBoolean(value){return uint256Coder.encode(value?1:0);},decode:function decodeBoolean(data,offset){var result=uint256Coder.decode(data,offset);return{consumed:result.consumed,value:!result.value.isZero()};}};function coderFixedBytes(length){return{encode:function encodeFixedBytes(valueInput){var value=valueInput;value=hexOrBuffer(value);if(value.length===32){return value;}
var result=new Buffer(32);result.fill(0);value.copy(result);return result;},decode:function decodeFixedBytes(data,offset){if(data.length<offset+32){throw new Error('[ethjs-abi] while decoding fixed bytes, invalid bytes data length: '+length);}
return{consumed:32,value:'0x'+data.slice(offset,offset+length).toString('hex')};}};}
var coderAddress={encode:function encodeAddress(valueInput){var value=valueInput;var result=new Buffer(32);if(!isHexString(value,20)){throw new Error('[ethjs-abi] while encoding address, invalid address value, not alphanumeric 20 byte hex string');}
value=hexOrBuffer(value);result.fill(0);value.copy(result,12);return result;},decode:function decodeAddress(data,offset){if(data.length===0){return{consumed:32,value:'0x'};}
if(data.length<offset+32){throw new Error('[ethjs-abi] while decoding address data, invalid address data, invalid byte length '+data.length);}
return{consumed:32,value:'0x'+data.slice(offset+12,offset+32).toString('hex')};}};function encodeDynamicBytesHelper(value){var dataLength=parseInt(32*Math.ceil(value.length/32));var padding=new Buffer(dataLength-value.length);padding.fill(0);return Buffer.concat([uint256Coder.encode(value.length),value,padding]);}
function decodeDynamicBytesHelper(data,offset){if(data.length<offset+32){throw new Error('[ethjs-abi] while decoding dynamic bytes data, invalid bytes length: '+data.length+' should be less than '+(offset+32));}
var length=uint256Coder.decode(data,offset).value;length=length.toNumber();if(data.length<offset+32+length){throw new Error('[ethjs-abi] while decoding dynamic bytes data, invalid bytes length: '+data.length+' should be less than '+(offset+32+length));}
return{consumed:parseInt(32+32*Math.ceil(length/32),10),value:data.slice(offset+32,offset+32+length)};}
var coderDynamicBytes={encode:function encodeDynamicBytes(value){return encodeDynamicBytesHelper(hexOrBuffer(value));},decode:function decodeDynamicBytes(data,offset){var result=decodeDynamicBytesHelper(data,offset);result.value='0x'+result.value.toString('hex');return result;},dynamic:true};var coderString={encode:function encodeString(value){return encodeDynamicBytesHelper(new Buffer(value,'utf8'));},decode:function decodeString(data,offset){var result=decodeDynamicBytesHelper(data,offset);result.value=result.value.toString('utf8');return result;},dynamic:true};function coderArray(coder,lengthInput){return{encode:function encodeArray(value){var result=new Buffer(0);var length=lengthInput;if(!Array.isArray(value)){throw new Error('[ethjs-abi] while encoding array, invalid array data, not type Object (Array)');}
if(length===-1){length=value.length;result=uint256Coder.encode(length);}
if(length!==value.length){throw new Error('[ethjs-abi] while encoding array, size mismatch array length '+length+' does not equal '+value.length);}
value.forEach(function(resultValue){result=Buffer.concat([result,coder.encode(resultValue)]);});return result;},decode:function decodeArray(data,offsetInput){var length=lengthInput;var offset=offsetInput;var consumed=0;var decodeResult;if(length===-1){decodeResult=uint256Coder.decode(data,offset);length=decodeResult.value.toNumber();consumed+=decodeResult.consumed;offset+=decodeResult.consumed;}
var value=[];for(var i=0;i<length;i++){var loopResult=coder.decode(data,offset);consumed+=loopResult.consumed;offset+=loopResult.consumed;value.push(loopResult.value);}
return{consumed:consumed,value:value};},dynamic:lengthInput===-1};}
var paramTypePart=new RegExp(/^((u?int|bytes)([0-9]*)|(address|bool|string)|(\[([0-9]*)\]))/);function getParamCoder(typeInput){var type=typeInput;var coder=null;var invalidTypeErrorMessage='[ethjs-abi] while getting param coder (getParamCoder) type value '+JSON.stringify(type)+' is either invalid or unsupported by ethjs-abi.';while(type){var part=type.match(paramTypePart);if(!part){throw new Error(invalidTypeErrorMessage);}
type=type.substring(part[0].length);var prefix=part[2]||part[4]||part[5];switch(prefix){case'int':case'uint':if(coder){throw new Error(invalidTypeErrorMessage);}
var intSize=parseInt(part[3]||256);if(intSize===0||intSize>256||intSize%8!==0){throw new Error('[ethjs-abi] while getting param coder for type '+type+', invalid '+prefix+'<N> width: '+type);}
coder=coderNumber(intSize/8,prefix==='int');break;case'bool':if(coder){throw new Error(invalidTypeErrorMessage);}
coder=coderBoolean;break;case'string':if(coder){throw new Error(invalidTypeErrorMessage);}
coder=coderString;break;case'bytes':if(coder){throw new Error(invalidTypeErrorMessage);}
if(part[3]){var size=parseInt(part[3]);if(size===0||size>32){throw new Error('[ethjs-abi] while getting param coder for prefix bytes, invalid type '+type+', size '+size+' should be 0 or greater than 32');}
coder=coderFixedBytes(size);}else{coder=coderDynamicBytes;}
break;case'address':if(coder){throw new Error(invalidTypeErrorMessage);}
coder=coderAddress;break;case'[]':if(!coder||coder.dynamic){throw new Error(invalidTypeErrorMessage);}
coder=coderArray(coder,-1);break;default:if(!coder||coder.dynamic){throw new Error(invalidTypeErrorMessage);}
var defaultSize=parseInt(part[6]);coder=coderArray(coder,defaultSize);}}
if(!coder){throw new Error(invalidTypeErrorMessage);}
return coder;}
module.exports={BN:BN,bnToBuffer:bnToBuffer,isHexString:isHexString,hexOrBuffer:hexOrBuffer,hexlify:hexlify,stripZeros:stripZeros,keccak256:keccak256,getKeys:getKeys,numberToBN:numberToBN,coderNumber:coderNumber,uint256Coder:uint256Coder,coderBoolean:coderBoolean,coderFixedBytes:coderFixedBytes,coderAddress:coderAddress,coderDynamicBytes:coderDynamicBytes,coderString:coderString,coderArray:coderArray,paramTypePart:paramTypePart,getParamCoder:getParamCoder};}.call(exports,__webpack_require__(31).Buffer))}),(function(module,exports){exports.read=function(buffer,offset,isLE,mLen,nBytes){var e,m
var eLen=(nBytes*8)-mLen-1
var eMax=(1<<eLen)-1
var eBias=eMax>>1
var nBits=-7
var i=isLE?(nBytes-1):0
var d=isLE?-1:1
var s=buffer[offset+i]
i+=d
e=s&((1<<(-nBits))-1)
s>>=(-nBits)
nBits+=eLen
for(;nBits>0;e=(e*256)+buffer[offset+i],i+=d,nBits-=8){}
m=e&((1<<(-nBits))-1)
e>>=(-nBits)
nBits+=mLen
for(;nBits>0;m=(m*256)+buffer[offset+i],i+=d,nBits-=8){}
if(e===0){e=1-eBias}else if(e===eMax){return m?NaN:((s?-1:1)*Infinity)}else{m=m+Math.pow(2,mLen)
e=e-eBias}
return(s?-1:1)*m*Math.pow(2,e-mLen)}
exports.write=function(buffer,value,offset,isLE,mLen,nBytes){var e,m,c
var eLen=(nBytes*8)-mLen-1
var eMax=(1<<eLen)-1
var eBias=eMax>>1
var rt=(mLen===23?Math.pow(2,-24)-Math.pow(2,-77):0)
var i=isLE?0:(nBytes-1)
var d=isLE?1:-1
var s=value<0||(value===0&&1/value<0)?1:0
value=Math.abs(value)
if(isNaN(value)||value===Infinity){m=isNaN(value)?1:0
e=eMax}else{e=Math.floor(Math.log(value)/Math.LN2)
if(value*(c=Math.pow(2,-e))<1){e--
c*=2}
if(e+eBias>=1){value+=rt/c}else{value+=rt*Math.pow(2,1-eBias)}
if(value*c>=2){e++
c/=2}
if(e+eBias>=eMax){m=0
e=eMax}else if(e+eBias>=1){m=((value*c)-1)*Math.pow(2,mLen)
e=e+eBias}else{m=value*Math.pow(2,eBias-1)*Math.pow(2,mLen)
e=0}}
for(;mLen>=8;buffer[offset+i]=m&0xff,i+=d,m/=256,mLen-=8){}
e=(e<<mLen)|m
eLen+=mLen
for(;eLen>0;buffer[offset+i]=e&0xff,i+=d,e/=256,eLen-=8){}
buffer[offset+i-d]|=s*128}}),(function(module,exports){module.exports=function isHexPrefixed(str){if(typeof str!=='string'){throw new Error("[is-hex-prefixed] value must be type 'string', is currently type "+(typeof str)+", while checking isHexPrefixed.");}
return str.slice(0,2)==='0x';}}),(function(module,exports){var toString={}.toString;module.exports=Array.isArray||function(arr){return toString.call(arr)=='[object Array]';};}),(function(module,exports,__webpack_require__){(function(process,global){(function(root){'use strict';var NODE_JS=typeof process=='object'&&process.versions&&process.versions.node;if(NODE_JS){root=global;}
var COMMON_JS=!root.JS_SHA3_TEST&&typeof module=='object'&&module.exports;var HEX_CHARS='0123456789abcdef'.split('');var SHAKE_PADDING=[31,7936,2031616,520093696];var KECCAK_PADDING=[1,256,65536,16777216];var PADDING=[6,1536,393216,100663296];var SHIFT=[0,8,16,24];var RC=[1,0,32898,0,32906,2147483648,2147516416,2147483648,32907,0,2147483649,0,2147516545,2147483648,32777,2147483648,138,0,136,0,2147516425,0,2147483658,0,2147516555,0,139,2147483648,32905,2147483648,32771,2147483648,32770,2147483648,128,2147483648,32778,0,2147483658,2147483648,2147516545,2147483648,32896,2147483648,2147483649,0,2147516424,2147483648];var BITS=[224,256,384,512];var SHAKE_BITS=[128,256];var OUTPUT_TYPES=['hex','buffer','arrayBuffer','array'];var createOutputMethod=function(bits,padding,outputType){return function(message){return new Keccak(bits,padding,bits).update(message)[outputType]();}};var createShakeOutputMethod=function(bits,padding,outputType){return function(message,outputBits){return new Keccak(bits,padding,outputBits).update(message)[outputType]();}};var createMethod=function(bits,padding){var method=createOutputMethod(bits,padding,'hex');method.create=function(){return new Keccak(bits,padding,bits);};method.update=function(message){return method.create().update(message);};for(var i=0;i<OUTPUT_TYPES.length;++i){var type=OUTPUT_TYPES[i];method[type]=createOutputMethod(bits,padding,type);}
return method;};var createShakeMethod=function(bits,padding){var method=createShakeOutputMethod(bits,padding,'hex');method.create=function(outputBits){return new Keccak(bits,padding,outputBits);};method.update=function(message,outputBits){return method.create(outputBits).update(message);};for(var i=0;i<OUTPUT_TYPES.length;++i){var type=OUTPUT_TYPES[i];method[type]=createShakeOutputMethod(bits,padding,type);}
return method;};var algorithms=[{name:'keccak',padding:KECCAK_PADDING,bits:BITS,createMethod:createMethod},{name:'sha3',padding:PADDING,bits:BITS,createMethod:createMethod},{name:'shake',padding:SHAKE_PADDING,bits:SHAKE_BITS,createMethod:createShakeMethod}];var methods={};for(var i=0;i<algorithms.length;++i){var algorithm=algorithms[i];var bits=algorithm.bits;for(var j=0;j<bits.length;++j){methods[algorithm.name+'_'+bits[j]]=algorithm.createMethod(bits[j],algorithm.padding);}}
function Keccak(bits,padding,outputBits){this.blocks=[];this.s=[];this.padding=padding;this.outputBits=outputBits;this.reset=true;this.block=0;this.start=0;this.blockCount=(1600-(bits<<1))>>5;this.byteCount=this.blockCount<<2;this.outputBlocks=outputBits>>5;this.extraBytes=(outputBits&31)>>3;for(var i=0;i<50;++i){this.s[i]=0;}};Keccak.prototype.update=function(message){var notString=typeof message!='string';if(notString&&message.constructor==root.ArrayBuffer){message=new Uint8Array(message);}
var length=message.length,blocks=this.blocks,byteCount=this.byteCount,blockCount=this.blockCount,index=0,s=this.s,i,code;while(index<length){if(this.reset){this.reset=false;blocks[0]=this.block;for(i=1;i<blockCount+1;++i){blocks[i]=0;}}
if(notString){for(i=this.start;index<length&&i<byteCount;++index){blocks[i>>2]|=message[index]<<SHIFT[i++&3];}}else{for(i=this.start;index<length&&i<byteCount;++index){code=message.charCodeAt(index);if(code<0x80){blocks[i>>2]|=code<<SHIFT[i++&3];}else if(code<0x800){blocks[i>>2]|=(0xc0|(code>>6))<<SHIFT[i++&3];blocks[i>>2]|=(0x80|(code&0x3f))<<SHIFT[i++&3];}else if(code<0xd800||code>=0xe000){blocks[i>>2]|=(0xe0|(code>>12))<<SHIFT[i++&3];blocks[i>>2]|=(0x80|((code>>6)&0x3f))<<SHIFT[i++&3];blocks[i>>2]|=(0x80|(code&0x3f))<<SHIFT[i++&3];}else{code=0x10000+(((code&0x3ff)<<10)|(message.charCodeAt(++index)&0x3ff));blocks[i>>2]|=(0xf0|(code>>18))<<SHIFT[i++&3];blocks[i>>2]|=(0x80|((code>>12)&0x3f))<<SHIFT[i++&3];blocks[i>>2]|=(0x80|((code>>6)&0x3f))<<SHIFT[i++&3];blocks[i>>2]|=(0x80|(code&0x3f))<<SHIFT[i++&3];}}}
this.lastByteIndex=i;if(i>=byteCount){this.start=i-byteCount;this.block=blocks[blockCount];for(i=0;i<blockCount;++i){s[i]^=blocks[i];}
f(s);this.reset=true;}else{this.start=i;}}
return this;};Keccak.prototype.finalize=function(){var blocks=this.blocks,i=this.lastByteIndex,blockCount=this.blockCount,s=this.s;blocks[i>>2]|=this.padding[i&3];if(this.lastByteIndex==this.byteCount){blocks[0]=blocks[blockCount];for(i=1;i<blockCount+1;++i){blocks[i]=0;}}
blocks[blockCount-1]|=0x80000000;for(i=0;i<blockCount;++i){s[i]^=blocks[i];}
f(s);};Keccak.prototype.toString=Keccak.prototype.hex=function(){this.finalize();var blockCount=this.blockCount,s=this.s,outputBlocks=this.outputBlocks,extraBytes=this.extraBytes,i=0,j=0;var hex='',block;while(j<outputBlocks){for(i=0;i<blockCount&&j<outputBlocks;++i,++j){block=s[i];hex+=HEX_CHARS[(block>>4)&0x0F]+HEX_CHARS[block&0x0F]+
HEX_CHARS[(block>>12)&0x0F]+HEX_CHARS[(block>>8)&0x0F]+
HEX_CHARS[(block>>20)&0x0F]+HEX_CHARS[(block>>16)&0x0F]+
HEX_CHARS[(block>>28)&0x0F]+HEX_CHARS[(block>>24)&0x0F];}
if(j%blockCount==0){f(s);i=0;}}
if(extraBytes){block=s[i];if(extraBytes>0){hex+=HEX_CHARS[(block>>4)&0x0F]+HEX_CHARS[block&0x0F];}
if(extraBytes>1){hex+=HEX_CHARS[(block>>12)&0x0F]+HEX_CHARS[(block>>8)&0x0F];}
if(extraBytes>2){hex+=HEX_CHARS[(block>>20)&0x0F]+HEX_CHARS[(block>>16)&0x0F];}}
return hex;};Keccak.prototype.arrayBuffer=function(){this.finalize();var blockCount=this.blockCount,s=this.s,outputBlocks=this.outputBlocks,extraBytes=this.extraBytes,i=0,j=0;var bytes=this.outputBits>>3;var buffer;if(extraBytes){buffer=new ArrayBuffer((outputBlocks+1)<<2);}else{buffer=new ArrayBuffer(bytes);}
var array=new Uint32Array(buffer);while(j<outputBlocks){for(i=0;i<blockCount&&j<outputBlocks;++i,++j){array[j]=s[i];}
if(j%blockCount==0){f(s);}}
if(extraBytes){array[i]=s[i];buffer=buffer.slice(0,bytes);}
return buffer;};Keccak.prototype.buffer=Keccak.prototype.arrayBuffer;Keccak.prototype.digest=Keccak.prototype.array=function(){this.finalize();var blockCount=this.blockCount,s=this.s,outputBlocks=this.outputBlocks,extraBytes=this.extraBytes,i=0,j=0;var array=[],offset,block;while(j<outputBlocks){for(i=0;i<blockCount&&j<outputBlocks;++i,++j){offset=j<<2;block=s[i];array[offset]=block&0xFF;array[offset+1]=(block>>8)&0xFF;array[offset+2]=(block>>16)&0xFF;array[offset+3]=(block>>24)&0xFF;}
if(j%blockCount==0){f(s);}}
if(extraBytes){offset=j<<2;block=s[i];if(extraBytes>0){array[offset]=block&0xFF;}
if(extraBytes>1){array[offset+1]=(block>>8)&0xFF;}
if(extraBytes>2){array[offset+2]=(block>>16)&0xFF;}}
return array;};var f=function(s){var h,l,n,c0,c1,c2,c3,c4,c5,c6,c7,c8,c9,b0,b1,b2,b3,b4,b5,b6,b7,b8,b9,b10,b11,b12,b13,b14,b15,b16,b17,b18,b19,b20,b21,b22,b23,b24,b25,b26,b27,b28,b29,b30,b31,b32,b33,b34,b35,b36,b37,b38,b39,b40,b41,b42,b43,b44,b45,b46,b47,b48,b49;for(n=0;n<48;n+=2){c0=s[0]^s[10]^s[20]^s[30]^s[40];c1=s[1]^s[11]^s[21]^s[31]^s[41];c2=s[2]^s[12]^s[22]^s[32]^s[42];c3=s[3]^s[13]^s[23]^s[33]^s[43];c4=s[4]^s[14]^s[24]^s[34]^s[44];c5=s[5]^s[15]^s[25]^s[35]^s[45];c6=s[6]^s[16]^s[26]^s[36]^s[46];c7=s[7]^s[17]^s[27]^s[37]^s[47];c8=s[8]^s[18]^s[28]^s[38]^s[48];c9=s[9]^s[19]^s[29]^s[39]^s[49];h=c8^((c2<<1)|(c3>>>31));l=c9^((c3<<1)|(c2>>>31));s[0]^=h;s[1]^=l;s[10]^=h;s[11]^=l;s[20]^=h;s[21]^=l;s[30]^=h;s[31]^=l;s[40]^=h;s[41]^=l;h=c0^((c4<<1)|(c5>>>31));l=c1^((c5<<1)|(c4>>>31));s[2]^=h;s[3]^=l;s[12]^=h;s[13]^=l;s[22]^=h;s[23]^=l;s[32]^=h;s[33]^=l;s[42]^=h;s[43]^=l;h=c2^((c6<<1)|(c7>>>31));l=c3^((c7<<1)|(c6>>>31));s[4]^=h;s[5]^=l;s[14]^=h;s[15]^=l;s[24]^=h;s[25]^=l;s[34]^=h;s[35]^=l;s[44]^=h;s[45]^=l;h=c4^((c8<<1)|(c9>>>31));l=c5^((c9<<1)|(c8>>>31));s[6]^=h;s[7]^=l;s[16]^=h;s[17]^=l;s[26]^=h;s[27]^=l;s[36]^=h;s[37]^=l;s[46]^=h;s[47]^=l;h=c6^((c0<<1)|(c1>>>31));l=c7^((c1<<1)|(c0>>>31));s[8]^=h;s[9]^=l;s[18]^=h;s[19]^=l;s[28]^=h;s[29]^=l;s[38]^=h;s[39]^=l;s[48]^=h;s[49]^=l;b0=s[0];b1=s[1];b32=(s[11]<<4)|(s[10]>>>28);b33=(s[10]<<4)|(s[11]>>>28);b14=(s[20]<<3)|(s[21]>>>29);b15=(s[21]<<3)|(s[20]>>>29);b46=(s[31]<<9)|(s[30]>>>23);b47=(s[30]<<9)|(s[31]>>>23);b28=(s[40]<<18)|(s[41]>>>14);b29=(s[41]<<18)|(s[40]>>>14);b20=(s[2]<<1)|(s[3]>>>31);b21=(s[3]<<1)|(s[2]>>>31);b2=(s[13]<<12)|(s[12]>>>20);b3=(s[12]<<12)|(s[13]>>>20);b34=(s[22]<<10)|(s[23]>>>22);b35=(s[23]<<10)|(s[22]>>>22);b16=(s[33]<<13)|(s[32]>>>19);b17=(s[32]<<13)|(s[33]>>>19);b48=(s[42]<<2)|(s[43]>>>30);b49=(s[43]<<2)|(s[42]>>>30);b40=(s[5]<<30)|(s[4]>>>2);b41=(s[4]<<30)|(s[5]>>>2);b22=(s[14]<<6)|(s[15]>>>26);b23=(s[15]<<6)|(s[14]>>>26);b4=(s[25]<<11)|(s[24]>>>21);b5=(s[24]<<11)|(s[25]>>>21);b36=(s[34]<<15)|(s[35]>>>17);b37=(s[35]<<15)|(s[34]>>>17);b18=(s[45]<<29)|(s[44]>>>3);b19=(s[44]<<29)|(s[45]>>>3);b10=(s[6]<<28)|(s[7]>>>4);b11=(s[7]<<28)|(s[6]>>>4);b42=(s[17]<<23)|(s[16]>>>9);b43=(s[16]<<23)|(s[17]>>>9);b24=(s[26]<<25)|(s[27]>>>7);b25=(s[27]<<25)|(s[26]>>>7);b6=(s[36]<<21)|(s[37]>>>11);b7=(s[37]<<21)|(s[36]>>>11);b38=(s[47]<<24)|(s[46]>>>8);b39=(s[46]<<24)|(s[47]>>>8);b30=(s[8]<<27)|(s[9]>>>5);b31=(s[9]<<27)|(s[8]>>>5);b12=(s[18]<<20)|(s[19]>>>12);b13=(s[19]<<20)|(s[18]>>>12);b44=(s[29]<<7)|(s[28]>>>25);b45=(s[28]<<7)|(s[29]>>>25);b26=(s[38]<<8)|(s[39]>>>24);b27=(s[39]<<8)|(s[38]>>>24);b8=(s[48]<<14)|(s[49]>>>18);b9=(s[49]<<14)|(s[48]>>>18);s[0]=b0^(~b2&b4);s[1]=b1^(~b3&b5);s[10]=b10^(~b12&b14);s[11]=b11^(~b13&b15);s[20]=b20^(~b22&b24);s[21]=b21^(~b23&b25);s[30]=b30^(~b32&b34);s[31]=b31^(~b33&b35);s[40]=b40^(~b42&b44);s[41]=b41^(~b43&b45);s[2]=b2^(~b4&b6);s[3]=b3^(~b5&b7);s[12]=b12^(~b14&b16);s[13]=b13^(~b15&b17);s[22]=b22^(~b24&b26);s[23]=b23^(~b25&b27);s[32]=b32^(~b34&b36);s[33]=b33^(~b35&b37);s[42]=b42^(~b44&b46);s[43]=b43^(~b45&b47);s[4]=b4^(~b6&b8);s[5]=b5^(~b7&b9);s[14]=b14^(~b16&b18);s[15]=b15^(~b17&b19);s[24]=b24^(~b26&b28);s[25]=b25^(~b27&b29);s[34]=b34^(~b36&b38);s[35]=b35^(~b37&b39);s[44]=b44^(~b46&b48);s[45]=b45^(~b47&b49);s[6]=b6^(~b8&b0);s[7]=b7^(~b9&b1);s[16]=b16^(~b18&b10);s[17]=b17^(~b19&b11);s[26]=b26^(~b28&b20);s[27]=b27^(~b29&b21);s[36]=b36^(~b38&b30);s[37]=b37^(~b39&b31);s[46]=b46^(~b48&b40);s[47]=b47^(~b49&b41);s[8]=b8^(~b0&b2);s[9]=b9^(~b1&b3);s[18]=b18^(~b10&b12);s[19]=b19^(~b11&b13);s[28]=b28^(~b20&b22);s[29]=b29^(~b21&b23);s[38]=b38^(~b30&b32);s[39]=b39^(~b31&b33);s[48]=b48^(~b40&b42);s[49]=b49^(~b41&b43);s[0]^=RC[n];s[1]^=RC[n+1];}}
if(COMMON_JS){module.exports=methods;}else if(root){for(var key in methods){root[key]=methods[key];}}}(this));}.call(exports,__webpack_require__(107),__webpack_require__(47)))}),(function(module,exports,__webpack_require__){var BN=__webpack_require__(56);var stripHexPrefix=__webpack_require__(108);module.exports=function numberToBN(arg){if(typeof arg==='string'||typeof arg==='number'){var multiplier=new BN(1);var formattedString=String(arg).toLowerCase().trim();var isHexPrefixed=formattedString.substr(0,2)==='0x'||formattedString.substr(0,3)==='-0x';var stringArg=stripHexPrefix(formattedString);if(stringArg.substr(0,1)==='-'){stringArg=stripHexPrefix(stringArg.slice(1));multiplier=new BN(-1,10);}
stringArg=stringArg===''?'0':stringArg;if((!stringArg.match(/^-?[0-9]+$/)&&stringArg.match(/^[0-9A-Fa-f]+$/))||stringArg.match(/^[a-fA-F]+$/)||(isHexPrefixed===true&&stringArg.match(/^[0-9A-Fa-f]+$/))){return new BN(stringArg,16).mul(multiplier);}
if((stringArg.match(/^-?[0-9]+$/)||stringArg==='')&&isHexPrefixed===false){return new BN(stringArg,10).mul(multiplier);}}else if(typeof arg==='object'&&arg.toString&&(!arg.pop&&!arg.push)){if(arg.toString(10).match(/^-?[0-9]+$/)&&(arg.mul||arg.dividedToIntegerBy)){return new BN(arg.toString(10),10);}}
throw new Error('[number-to-bn] while converting number '+JSON.stringify(arg)+' to BN.js instance, error: invalid number value. Value must be an integer, hex string, BN or BigNumber instance. Note, decimals are not supported.');}}),(function(module,exports){var process=module.exports={};var cachedSetTimeout;var cachedClearTimeout;function defaultSetTimout(){throw new Error('setTimeout has not been defined');}
function defaultClearTimeout(){throw new Error('clearTimeout has not been defined');}
(function(){try{if(typeof setTimeout==='function'){cachedSetTimeout=setTimeout;}else{cachedSetTimeout=defaultSetTimout;}}catch(e){cachedSetTimeout=defaultSetTimout;}
try{if(typeof clearTimeout==='function'){cachedClearTimeout=clearTimeout;}else{cachedClearTimeout=defaultClearTimeout;}}catch(e){cachedClearTimeout=defaultClearTimeout;}}())
function runTimeout(fun){if(cachedSetTimeout===setTimeout){return setTimeout(fun,0);}
if((cachedSetTimeout===defaultSetTimout||!cachedSetTimeout)&&setTimeout){cachedSetTimeout=setTimeout;return setTimeout(fun,0);}
try{return cachedSetTimeout(fun,0);}catch(e){try{return cachedSetTimeout.call(null,fun,0);}catch(e){return cachedSetTimeout.call(this,fun,0);}}}
function runClearTimeout(marker){if(cachedClearTimeout===clearTimeout){return clearTimeout(marker);}
if((cachedClearTimeout===defaultClearTimeout||!cachedClearTimeout)&&clearTimeout){cachedClearTimeout=clearTimeout;return clearTimeout(marker);}
try{return cachedClearTimeout(marker);}catch(e){try{return cachedClearTimeout.call(null,marker);}catch(e){return cachedClearTimeout.call(this,marker);}}}
var queue=[];var draining=false;var currentQueue;var queueIndex=-1;function cleanUpNextTick(){if(!draining||!currentQueue){return;}
draining=false;if(currentQueue.length){queue=currentQueue.concat(queue);}else{queueIndex=-1;}
if(queue.length){drainQueue();}}
function drainQueue(){if(draining){return;}
var timeout=runTimeout(cleanUpNextTick);draining=true;var len=queue.length;while(len){currentQueue=queue;queue=[];while(++queueIndex<len){if(currentQueue){currentQueue[queueIndex].run();}}
queueIndex=-1;len=queue.length;}
currentQueue=null;draining=false;runClearTimeout(timeout);}
process.nextTick=function(fun){var args=new Array(arguments.length-1);if(arguments.length>1){for(var i=1;i<arguments.length;i++){args[i-1]=arguments[i];}}
queue.push(new Item(fun,args));if(queue.length===1&&!draining){runTimeout(drainQueue);}};function Item(fun,array){this.fun=fun;this.array=array;}
Item.prototype.run=function(){this.fun.apply(null,this.array);};process.title='browser';process.browser=true;process.env={};process.argv=[];process.version='';process.versions={};function noop(){}
process.on=noop;process.addListener=noop;process.once=noop;process.off=noop;process.removeListener=noop;process.removeAllListeners=noop;process.emit=noop;process.prependListener=noop;process.prependOnceListener=noop;process.listeners=function(name){return[]}
process.binding=function(name){throw new Error('process.binding is not supported');};process.cwd=function(){return'/'};process.chdir=function(dir){throw new Error('process.chdir is not supported');};process.umask=function(){return 0;};}),(function(module,exports,__webpack_require__){var isHexPrefixed=__webpack_require__(103);module.exports=function stripHexPrefix(str){if(typeof str!=='string'){return str;}
return isHexPrefixed(str)?str.slice(2):str;}}),(function(module,exports){var stylesInDom={},memoize=function(fn){var memo;return function(){if(typeof memo==="undefined")memo=fn.apply(this,arguments);return memo;};},isOldIE=memoize(function(){return/msie[6-9]\b/.test(self.navigator.userAgent.toLowerCase());}),getHeadElement=memoize(function(){return document.head||document.getElementsByTagName("head")[0];}),singletonElement=null,singletonCounter=0,styleElementsInsertedAtTop=[];module.exports=function(list,options){if(typeof DEBUG!=="undefined"&&DEBUG){if(typeof document!=="object")throw new Error("The style-loader cannot be used in a non-browser environment");}
options=options||{};if(typeof options.singleton==="undefined")options.singleton=isOldIE();if(typeof options.insertAt==="undefined")options.insertAt="bottom";var styles=listToStyles(list);addStylesToDom(styles,options);return function update(newList){var mayRemove=[];for(var i=0;i<styles.length;i++){var item=styles[i];var domStyle=stylesInDom[item.id];domStyle.refs--;mayRemove.push(domStyle);}
if(newList){var newStyles=listToStyles(newList);addStylesToDom(newStyles,options);}
for(var i=0;i<mayRemove.length;i++){var domStyle=mayRemove[i];if(domStyle.refs===0){for(var j=0;j<domStyle.parts.length;j++)
domStyle.parts[j]();delete stylesInDom[domStyle.id];}}};}
function addStylesToDom(styles,options){for(var i=0;i<styles.length;i++){var item=styles[i];var domStyle=stylesInDom[item.id];if(domStyle){domStyle.refs++;for(var j=0;j<domStyle.parts.length;j++){domStyle.parts[j](item.parts[j]);}
for(;j<item.parts.length;j++){domStyle.parts.push(addStyle(item.parts[j],options));}}else{var parts=[];for(var j=0;j<item.parts.length;j++){parts.push(addStyle(item.parts[j],options));}
stylesInDom[item.id]={id:item.id,refs:1,parts:parts};}}}
function listToStyles(list){var styles=[];var newStyles={};for(var i=0;i<list.length;i++){var item=list[i];var id=item[0];var css=item[1];var media=item[2];var sourceMap=item[3];var part={css:css,media:media,sourceMap:sourceMap};if(!newStyles[id])
styles.push(newStyles[id]={id:id,parts:[part]});else
newStyles[id].parts.push(part);}
return styles;}
function insertStyleElement(options,styleElement){var head=getHeadElement();var lastStyleElementInsertedAtTop=styleElementsInsertedAtTop[styleElementsInsertedAtTop.length-1];if(options.insertAt==="top"){if(!lastStyleElementInsertedAtTop){head.insertBefore(styleElement,head.firstChild);}else if(lastStyleElementInsertedAtTop.nextSibling){head.insertBefore(styleElement,lastStyleElementInsertedAtTop.nextSibling);}else{head.appendChild(styleElement);}
styleElementsInsertedAtTop.push(styleElement);}else if(options.insertAt==="bottom"){head.appendChild(styleElement);}else{throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");}}
function removeStyleElement(styleElement){styleElement.parentNode.removeChild(styleElement);var idx=styleElementsInsertedAtTop.indexOf(styleElement);if(idx>=0){styleElementsInsertedAtTop.splice(idx,1);}}
function createStyleElement(options){var styleElement=document.createElement("style");styleElement.type="text/css";insertStyleElement(options,styleElement);return styleElement;}
function createLinkElement(options){var linkElement=document.createElement("link");linkElement.rel="stylesheet";insertStyleElement(options,linkElement);return linkElement;}
function addStyle(obj,options){var styleElement,update,remove;if(options.singleton){var styleIndex=singletonCounter++;styleElement=singletonElement||(singletonElement=createStyleElement(options));update=applyToSingletonTag.bind(null,styleElement,styleIndex,false);remove=applyToSingletonTag.bind(null,styleElement,styleIndex,true);}else if(obj.sourceMap&&typeof URL==="function"&&typeof URL.createObjectURL==="function"&&typeof URL.revokeObjectURL==="function"&&typeof Blob==="function"&&typeof btoa==="function"){styleElement=createLinkElement(options);update=updateLink.bind(null,styleElement);remove=function(){removeStyleElement(styleElement);if(styleElement.href)
URL.revokeObjectURL(styleElement.href);};}else{styleElement=createStyleElement(options);update=applyToTag.bind(null,styleElement);remove=function(){removeStyleElement(styleElement);};}
update(obj);return function updateStyle(newObj){if(newObj){if(newObj.css===obj.css&&newObj.media===obj.media&&newObj.sourceMap===obj.sourceMap)
return;update(obj=newObj);}else{remove();}};}
var replaceText=(function(){var textStore=[];return function(index,replacement){textStore[index]=replacement;return textStore.filter(Boolean).join('\n');};})();function applyToSingletonTag(styleElement,index,remove,obj){var css=remove?"":obj.css;if(styleElement.styleSheet){styleElement.styleSheet.cssText=replaceText(index,css);}else{var cssNode=document.createTextNode(css);var childNodes=styleElement.childNodes;if(childNodes[index])styleElement.removeChild(childNodes[index]);if(childNodes.length){styleElement.insertBefore(cssNode,childNodes[index]);}else{styleElement.appendChild(cssNode);}}}
function applyToTag(styleElement,obj){var css=obj.css;var media=obj.media;if(media){styleElement.setAttribute("media",media)}
if(styleElement.styleSheet){styleElement.styleSheet.cssText=css;}else{while(styleElement.firstChild){styleElement.removeChild(styleElement.firstChild);}
styleElement.appendChild(document.createTextNode(css));}}
function updateLink(linkElement,obj){var css=obj.css;var sourceMap=obj.sourceMap;if(sourceMap){css+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))))+" */";}
var blob=new Blob([css],{type:"text/css"});var oldSrc=linkElement.href;linkElement.href=URL.createObjectURL(blob);if(oldSrc)
URL.revokeObjectURL(oldSrc);}}),(function(module,exports,__webpack_require__){var Web3=__webpack_require__(111);var Blockchain={parse:function(uri){var parsed={};if(uri.indexOf("blockchain://")!=0)return parsed;uri=uri.replace("blockchain://","");var pieces=uri.split("/block/");parsed.genesis_hash="0x"+pieces[0];parsed.block_hash="0x"+pieces[1];return parsed;},asURI:function(provider,callback){var web3=new Web3(provider);web3.eth.getBlock(0,function(err,genesis){if(err)return callback(err);web3.eth.getBlock("latest",function(err,latest){if(err)return callback(err);var url="blockchain://"+genesis.hash.replace("0x","")+"/block/"+latest.hash.replace("0x","");callback(null,url);});});},matches:function(uri,provider,callback){uri=this.parse(uri);var expected_genesis=uri.genesis_hash;var expected_block=uri.block_hash;var web3=new Web3(provider);web3.eth.getBlock(0,function(err,block){if(err)return callback(err);if(block.hash!=expected_genesis)return callback(null,false);web3.eth.getBlock(expected_block,function(err,block){if(err||block==null){return callback(null,false);}
callback(null,true);});});}};module.exports=Blockchain;}),(function(module,exports,__webpack_require__){var Web3=__webpack_require__(126);if(typeof window!=='undefined'&&typeof window.Web3==='undefined'){window.Web3=Web3;}
module.exports=Web3;}),(function(module,exports){module.exports=[{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"name","outputs":[{"name":"o_name","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"owner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"content","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"addr","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"}],"name":"reserve","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"subRegistrar","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_newOwner","type":"address"}],"name":"transfer","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_registrar","type":"address"}],"name":"setSubRegistrar","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"Registrar","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_a","type":"address"},{"name":"_primary","type":"bool"}],"name":"setAddress","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_content","type":"bytes32"}],"name":"setContent","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"}],"name":"disown","outputs":[],"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_name","type":"bytes32"},{"indexed":false,"name":"_winner","type":"address"}],"name":"AuctionEnded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_name","type":"bytes32"},{"indexed":false,"name":"_bidder","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"NewBid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"name","type":"bytes32"}],"name":"Changed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"name","type":"bytes32"},{"indexed":true,"name":"addr","type":"address"}],"name":"PrimaryChanged","type":"event"}]}),(function(module,exports){module.exports=[{"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"owner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_refund","type":"address"}],"name":"disown","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"addr","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"}],"name":"reserve","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_newOwner","type":"address"}],"name":"transfer","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_a","type":"address"}],"name":"setAddr","outputs":[],"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"name","type":"bytes32"}],"name":"Changed","type":"event"}]}),(function(module,exports){module.exports=[{"constant":false,"inputs":[{"name":"from","type":"bytes32"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"from","type":"bytes32"},{"name":"to","type":"address"},{"name":"indirectId","type":"bytes32"},{"name":"value","type":"uint256"}],"name":"icapTransfer","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"to","type":"bytes32"}],"name":"deposit","outputs":[],"payable":true,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"AnonymousDeposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"bytes32"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"bytes32"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"bytes32"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"indirectId","type":"bytes32"},{"indexed":false,"name":"value","type":"uint256"}],"name":"IcapTransfer","type":"event"}]}),(function(module,exports,__webpack_require__){var f=__webpack_require__(5);var SolidityType=__webpack_require__(8);var SolidityTypeAddress=function(){this._inputFormatter=f.formatInputInt;this._outputFormatter=f.formatOutputAddress;};SolidityTypeAddress.prototype=new SolidityType({});SolidityTypeAddress.prototype.constructor=SolidityTypeAddress;SolidityTypeAddress.prototype.isType=function(name){return!!name.match(/address(\[([0-9]*)\])?/);};module.exports=SolidityTypeAddress;}),(function(module,exports,__webpack_require__){var f=__webpack_require__(5);var SolidityType=__webpack_require__(8);var SolidityTypeBool=function(){this._inputFormatter=f.formatInputBool;this._outputFormatter=f.formatOutputBool;};SolidityTypeBool.prototype=new SolidityType({});SolidityTypeBool.prototype.constructor=SolidityTypeBool;SolidityTypeBool.prototype.isType=function(name){return!!name.match(/^bool(\[([0-9]*)\])*$/);};module.exports=SolidityTypeBool;}),(function(module,exports,__webpack_require__){var f=__webpack_require__(5);var SolidityType=__webpack_require__(8);var SolidityTypeBytes=function(){this._inputFormatter=f.formatInputBytes;this._outputFormatter=f.formatOutputBytes;};SolidityTypeBytes.prototype=new SolidityType({});SolidityTypeBytes.prototype.constructor=SolidityTypeBytes;SolidityTypeBytes.prototype.isType=function(name){return!!name.match(/^bytes([0-9]{1,})(\[([0-9]*)\])*$/);};module.exports=SolidityTypeBytes;}),(function(module,exports,__webpack_require__){var f=__webpack_require__(5);var SolidityType=__webpack_require__(8);var SolidityTypeDynamicBytes=function(){this._inputFormatter=f.formatInputDynamicBytes;this._outputFormatter=f.formatOutputDynamicBytes;};SolidityTypeDynamicBytes.prototype=new SolidityType({});SolidityTypeDynamicBytes.prototype.constructor=SolidityTypeDynamicBytes;SolidityTypeDynamicBytes.prototype.isType=function(name){return!!name.match(/^bytes(\[([0-9]*)\])*$/);};SolidityTypeDynamicBytes.prototype.isDynamicType=function(){return true;};module.exports=SolidityTypeDynamicBytes;}),(function(module,exports,__webpack_require__){var f=__webpack_require__(5);var SolidityType=__webpack_require__(8);var SolidityTypeInt=function(){this._inputFormatter=f.formatInputInt;this._outputFormatter=f.formatOutputInt;};SolidityTypeInt.prototype=new SolidityType({});SolidityTypeInt.prototype.constructor=SolidityTypeInt;SolidityTypeInt.prototype.isType=function(name){return!!name.match(/^int([0-9]*)?(\[([0-9]*)\])*$/);};module.exports=SolidityTypeInt;}),(function(module,exports,__webpack_require__){var f=__webpack_require__(5);var SolidityType=__webpack_require__(8);var SolidityTypeReal=function(){this._inputFormatter=f.formatInputReal;this._outputFormatter=f.formatOutputReal;};SolidityTypeReal.prototype=new SolidityType({});SolidityTypeReal.prototype.constructor=SolidityTypeReal;SolidityTypeReal.prototype.isType=function(name){return!!name.match(/real([0-9]*)?(\[([0-9]*)\])?/);};module.exports=SolidityTypeReal;}),(function(module,exports,__webpack_require__){var f=__webpack_require__(5);var SolidityType=__webpack_require__(8);var SolidityTypeString=function(){this._inputFormatter=f.formatInputString;this._outputFormatter=f.formatOutputString;};SolidityTypeString.prototype=new SolidityType({});SolidityTypeString.prototype.constructor=SolidityTypeString;SolidityTypeString.prototype.isType=function(name){return!!name.match(/^string(\[([0-9]*)\])*$/);};SolidityTypeString.prototype.isDynamicType=function(){return true;};module.exports=SolidityTypeString;}),(function(module,exports,__webpack_require__){var f=__webpack_require__(5);var SolidityType=__webpack_require__(8);var SolidityTypeUInt=function(){this._inputFormatter=f.formatInputInt;this._outputFormatter=f.formatOutputUInt;};SolidityTypeUInt.prototype=new SolidityType({});SolidityTypeUInt.prototype.constructor=SolidityTypeUInt;SolidityTypeUInt.prototype.isType=function(name){return!!name.match(/^uint([0-9]*)?(\[([0-9]*)\])*$/);};module.exports=SolidityTypeUInt;}),(function(module,exports,__webpack_require__){var f=__webpack_require__(5);var SolidityType=__webpack_require__(8);var SolidityTypeUReal=function(){this._inputFormatter=f.formatInputReal;this._outputFormatter=f.formatOutputUReal;};SolidityTypeUReal.prototype=new SolidityType({});SolidityTypeUReal.prototype.constructor=SolidityTypeUReal;SolidityTypeUReal.prototype.isType=function(name){return!!name.match(/^ureal([0-9]*)?(\[([0-9]*)\])*$/);};module.exports=SolidityTypeUReal;}),(function(module,exports,__webpack_require__){"use strict";if(typeof XMLHttpRequest==='undefined'){exports.XMLHttpRequest={};}else{exports.XMLHttpRequest=XMLHttpRequest;}}),(function(module,exports){module.exports={"version":"0.18.4"}}),(function(module,exports,__webpack_require__){var RequestManager=__webpack_require__(141);var Iban=__webpack_require__(36);var Eth=__webpack_require__(135);var DB=__webpack_require__(134);var Shh=__webpack_require__(138);var Net=__webpack_require__(136);var Personal=__webpack_require__(137);var Swarm=__webpack_require__(139);var Settings=__webpack_require__(142);var version=__webpack_require__(125);var utils=__webpack_require__(2);var sha3=__webpack_require__(24);var extend=__webpack_require__(130);var Batch=__webpack_require__(128);var Property=__webpack_require__(19);var HttpProvider=__webpack_require__(132);var IpcProvider=__webpack_require__(133);var BigNumber=__webpack_require__(23);function Web3(provider){this._requestManager=new RequestManager(provider);this.currentProvider=provider;this.eth=new Eth(this);this.db=new DB(this);this.shh=new Shh(this);this.net=new Net(this);this.personal=new Personal(this);this.bzz=new Swarm(this);this.settings=new Settings();this.version={api:version.version};this.providers={HttpProvider:HttpProvider,IpcProvider:IpcProvider};this._extend=extend(this);this._extend({properties:properties()});}
Web3.providers={HttpProvider:HttpProvider,IpcProvider:IpcProvider};Web3.prototype.setProvider=function(provider){this._requestManager.setProvider(provider);this.currentProvider=provider;};Web3.prototype.reset=function(keepIsSyncing){this._requestManager.reset(keepIsSyncing);this.settings=new Settings();};Web3.prototype.BigNumber=BigNumber;Web3.prototype.toHex=utils.toHex;Web3.prototype.toAscii=utils.toAscii;Web3.prototype.toUtf8=utils.toUtf8;Web3.prototype.fromAscii=utils.fromAscii;Web3.prototype.fromUtf8=utils.fromUtf8;Web3.prototype.toDecimal=utils.toDecimal;Web3.prototype.fromDecimal=utils.fromDecimal;Web3.prototype.toBigNumber=utils.toBigNumber;Web3.prototype.toWei=utils.toWei;Web3.prototype.fromWei=utils.fromWei;Web3.prototype.isAddress=utils.isAddress;Web3.prototype.isChecksumAddress=utils.isChecksumAddress;Web3.prototype.toChecksumAddress=utils.toChecksumAddress;Web3.prototype.isIBAN=utils.isIBAN;Web3.prototype.sha3=function(string,options){return'0x'+sha3(string,options);};Web3.prototype.fromICAP=function(icap){var iban=new Iban(icap);return iban.address();};var properties=function(){return[new Property({name:'version.node',getter:'web3_clientVersion'}),new Property({name:'version.network',getter:'net_version',inputFormatter:utils.toDecimal}),new Property({name:'version.ethereum',getter:'eth_protocolVersion',inputFormatter:utils.toDecimal}),new Property({name:'version.whisper',getter:'shh_version',inputFormatter:utils.toDecimal})];};Web3.prototype.isConnected=function(){return(this.currentProvider&&this.currentProvider.isConnected());};Web3.prototype.createBatch=function(){return new Batch(this);};module.exports=Web3;}),(function(module,exports,__webpack_require__){var sha3=__webpack_require__(24);var SolidityEvent=__webpack_require__(60);var formatters=__webpack_require__(9);var utils=__webpack_require__(2);var Filter=__webpack_require__(35);var watches=__webpack_require__(37);var AllSolidityEvents=function(requestManager,json,address){this._requestManager=requestManager;this._json=json;this._address=address;};AllSolidityEvents.prototype.encode=function(options){options=options||{};var result={};['fromBlock','toBlock'].filter(function(f){return options[f]!==undefined;}).forEach(function(f){result[f]=formatters.inputBlockNumberFormatter(options[f]);});result.address=this._address;return result;};AllSolidityEvents.prototype.decode=function(data){data.data=data.data||'';data.topics=data.topics||[];var eventTopic=data.topics[0].slice(2);var match=this._json.filter(function(j){return eventTopic===sha3(utils.transformToFullName(j));})[0];if(!match){console.warn('cannot find event for log');return data;}
var event=new SolidityEvent(this._requestManager,match,this._address);return event.decode(data);};AllSolidityEvents.prototype.execute=function(options,callback){if(utils.isFunction(arguments[arguments.length-1])){callback=arguments[arguments.length-1];if(arguments.length===1)
options=null;}
var o=this.encode(options);var formatter=this.decode.bind(this);return new Filter(this._requestManager,o,watches.eth(),formatter,callback);};AllSolidityEvents.prototype.attachToContract=function(contract){var execute=this.execute.bind(this);contract.allEvents=execute;};module.exports=AllSolidityEvents;}),(function(module,exports,__webpack_require__){var Jsonrpc=__webpack_require__(61);var errors=__webpack_require__(25);var Batch=function(web3){this.requestManager=web3._requestManager;this.requests=[];};Batch.prototype.add=function(request){this.requests.push(request);};Batch.prototype.execute=function(){var requests=this.requests;this.requestManager.sendBatch(requests,function(err,results){results=results||[];requests.map(function(request,index){return results[index]||{};}).forEach(function(result,index){if(requests[index].callback){if(!Jsonrpc.isValidResponse(result)){return requests[index].callback(errors.InvalidResponse(result));}
requests[index].callback(null,(requests[index].format?requests[index].format(result.result):result.result));}});});};module.exports=Batch;}),(function(module,exports,__webpack_require__){var utils=__webpack_require__(2);var coder=__webpack_require__(51);var SolidityEvent=__webpack_require__(60);var SolidityFunction=__webpack_require__(131);var AllEvents=__webpack_require__(127);var encodeConstructorParams=function(abi,params){return abi.filter(function(json){return json.type==='constructor'&&json.inputs.length===params.length;}).map(function(json){return json.inputs.map(function(input){return input.type;});}).map(function(types){return coder.encodeParams(types,params);})[0]||'';};var addFunctionsToContract=function(contract){contract.abi.filter(function(json){return json.type==='function';}).map(function(json){return new SolidityFunction(contract._eth,json,contract.address);}).forEach(function(f){f.attachToContract(contract);});};var addEventsToContract=function(contract){var events=contract.abi.filter(function(json){return json.type==='event';});var All=new AllEvents(contract._eth._requestManager,events,contract.address);All.attachToContract(contract);events.map(function(json){return new SolidityEvent(contract._eth._requestManager,json,contract.address);}).forEach(function(e){e.attachToContract(contract);});};var checkForContractAddress=function(contract,callback){var count=0,callbackFired=false;var filter=contract._eth.filter('latest',function(e){if(!e&&!callbackFired){count++;if(count>50){filter.stopWatching(function(){});callbackFired=true;if(callback)
callback(new Error('Contract transaction couldn\'t be found after 50 blocks'));else
throw new Error('Contract transaction couldn\'t be found after 50 blocks');}else{contract._eth.getTransactionReceipt(contract.transactionHash,function(e,receipt){if(receipt&&!callbackFired){contract._eth.getCode(receipt.contractAddress,function(e,code){if(callbackFired||!code)
return;filter.stopWatching(function(){});callbackFired=true;if(code.length>3){contract.address=receipt.contractAddress;addFunctionsToContract(contract);addEventsToContract(contract);if(callback)
callback(null,contract);}else{if(callback)
callback(new Error('The contract code couldn\'t be stored, please check your gas amount.'));else
throw new Error('The contract code couldn\'t be stored, please check your gas amount.');}});}});}}});};var ContractFactory=function(eth,abi){this.eth=eth;this.abi=abi;this.new=function(){var contract=new Contract(this.eth,this.abi);var options={};var callback;var args=Array.prototype.slice.call(arguments);if(utils.isFunction(args[args.length-1])){callback=args.pop();}
var last=args[args.length-1];if(utils.isObject(last)&&!utils.isArray(last)){options=args.pop();}
if(options.value>0){var constructorAbi=abi.filter(function(json){return json.type==='constructor'&&json.inputs.length===args.length;})[0]||{};if(!constructorAbi.payable){throw new Error('Cannot send value to non-payable constructor');}}
var bytes=encodeConstructorParams(this.abi,args);options.data+=bytes;if(callback){this.eth.sendTransaction(options,function(err,hash){if(err){callback(err);}else{contract.transactionHash=hash;callback(null,contract);checkForContractAddress(contract,callback);}});}else{var hash=this.eth.sendTransaction(options);contract.transactionHash=hash;checkForContractAddress(contract);}
return contract;};this.new.getData=this.getData.bind(this);};ContractFactory.prototype.at=function(address,callback){var contract=new Contract(this.eth,this.abi,address);addFunctionsToContract(contract);addEventsToContract(contract);if(callback){callback(null,contract);}
return contract;};ContractFactory.prototype.getData=function(){var options={};var args=Array.prototype.slice.call(arguments);var last=args[args.length-1];if(utils.isObject(last)&&!utils.isArray(last)){options=args.pop();}
var bytes=encodeConstructorParams(this.abi,args);options.data+=bytes;return options.data;};var Contract=function(eth,abi,address){this._eth=eth;this.transactionHash=null;this.address=address;this.abi=abi;};module.exports=ContractFactory;}),(function(module,exports,__webpack_require__){var formatters=__webpack_require__(9);var utils=__webpack_require__(2);var Method=__webpack_require__(14);var Property=__webpack_require__(19);var extend=function(web3){var ex=function(extension){var extendedObject;if(extension.property){if(!web3[extension.property]){web3[extension.property]={};}
extendedObject=web3[extension.property];}else{extendedObject=web3;}
if(extension.methods){extension.methods.forEach(function(method){method.attachToObject(extendedObject);method.setRequestManager(web3._requestManager);});}
if(extension.properties){extension.properties.forEach(function(property){property.attachToObject(extendedObject);property.setRequestManager(web3._requestManager);});}};ex.formatters=formatters;ex.utils=utils;ex.Method=Method;ex.Property=Property;return ex;};module.exports=extend;}),(function(module,exports,__webpack_require__){var coder=__webpack_require__(51);var utils=__webpack_require__(2);var formatters=__webpack_require__(9);var sha3=__webpack_require__(24);var SolidityFunction=function(eth,json,address){this._eth=eth;this._inputTypes=json.inputs.map(function(i){return i.type;});this._outputTypes=json.outputs.map(function(i){return i.type;});this._constant=json.constant;this._payable=json.payable;this._name=utils.transformToFullName(json);this._address=address;};SolidityFunction.prototype.extractCallback=function(args){if(utils.isFunction(args[args.length-1])){return args.pop();}};SolidityFunction.prototype.extractDefaultBlock=function(args){if(args.length>this._inputTypes.length&&!utils.isObject(args[args.length-1])){return formatters.inputDefaultBlockNumberFormatter(args.pop());}};SolidityFunction.prototype.toPayload=function(args){var options={};if(args.length>this._inputTypes.length&&utils.isObject(args[args.length-1])){options=args[args.length-1];}
options.to=this._address;options.data='0x'+this.signature()+coder.encodeParams(this._inputTypes,args);return options;};SolidityFunction.prototype.signature=function(){return sha3(this._name).slice(0,8);};SolidityFunction.prototype.unpackOutput=function(output){if(!output){return;}
output=output.length>=2?output.slice(2):output;var result=coder.decodeParams(this._outputTypes,output);return result.length===1?result[0]:result;};SolidityFunction.prototype.call=function(){var args=Array.prototype.slice.call(arguments).filter(function(a){return a!==undefined;});var callback=this.extractCallback(args);var defaultBlock=this.extractDefaultBlock(args);var payload=this.toPayload(args);if(!callback){var output=this._eth.call(payload,defaultBlock);return this.unpackOutput(output);}
var self=this;this._eth.call(payload,defaultBlock,function(error,output){if(error)return callback(error,null);var unpacked=null;try{unpacked=self.unpackOutput(output);}
catch(e){error=e;}
callback(error,unpacked);});};SolidityFunction.prototype.sendTransaction=function(){var args=Array.prototype.slice.call(arguments).filter(function(a){return a!==undefined;});var callback=this.extractCallback(args);var payload=this.toPayload(args);if(payload.value>0&&!this._payable){throw new Error('Cannot send value to non-payable function');}
if(!callback){return this._eth.sendTransaction(payload);}
this._eth.sendTransaction(payload,callback);};SolidityFunction.prototype.estimateGas=function(){var args=Array.prototype.slice.call(arguments);var callback=this.extractCallback(args);var payload=this.toPayload(args);if(!callback){return this._eth.estimateGas(payload);}
this._eth.estimateGas(payload,callback);};SolidityFunction.prototype.getData=function(){var args=Array.prototype.slice.call(arguments);var payload=this.toPayload(args);return payload.data;};SolidityFunction.prototype.displayName=function(){return utils.extractDisplayName(this._name);};SolidityFunction.prototype.typeName=function(){return utils.extractTypeName(this._name);};SolidityFunction.prototype.request=function(){var args=Array.prototype.slice.call(arguments);var callback=this.extractCallback(args);var payload=this.toPayload(args);var format=this.unpackOutput.bind(this);return{method:this._constant?'eth_call':'eth_sendTransaction',callback:callback,params:[payload],format:format};};SolidityFunction.prototype.execute=function(){var transaction=!this._constant;if(transaction){return this.sendTransaction.apply(this,Array.prototype.slice.call(arguments));}
return this.call.apply(this,Array.prototype.slice.call(arguments));};SolidityFunction.prototype.attachToContract=function(contract){var execute=this.execute.bind(this);execute.request=this.request.bind(this);execute.call=this.call.bind(this);execute.sendTransaction=this.sendTransaction.bind(this);execute.estimateGas=this.estimateGas.bind(this);execute.getData=this.getData.bind(this);var displayName=this.displayName();if(!contract[displayName]){contract[displayName]=execute;}
contract[displayName][this.typeName()]=execute;};module.exports=SolidityFunction;}),(function(module,exports,__webpack_require__){var errors=__webpack_require__(25);if(typeof window!=='undefined'&&window.XMLHttpRequest){XMLHttpRequest=window.XMLHttpRequest;}else{XMLHttpRequest=__webpack_require__(124).XMLHttpRequest;}
var XHR2=__webpack_require__(69);var HttpProvider=function(host,timeout){this.host=host||'http://localhost:8545';this.timeout=timeout||0;};HttpProvider.prototype.prepareRequest=function(async){var request;if(async){request=new XHR2();request.timeout=this.timeout;}else{request=new XMLHttpRequest();}
request.open('POST',this.host,async);request.setRequestHeader('Content-Type','application/json');return request;};HttpProvider.prototype.send=function(payload){var request=this.prepareRequest(false);try{request.send(JSON.stringify(payload));}catch(error){throw errors.InvalidConnection(this.host);}
var result=request.responseText;try{result=JSON.parse(result);}catch(e){throw errors.InvalidResponse(request.responseText);}
return result;};HttpProvider.prototype.sendAsync=function(payload,callback){var request=this.prepareRequest(true);request.onreadystatechange=function(){if(request.readyState===4&&request.timeout!==1){var result=request.responseText;var error=null;try{result=JSON.parse(result);}catch(e){error=errors.InvalidResponse(request.responseText);}
callback(error,result);}};request.ontimeout=function(){callback(errors.ConnectionTimeout(this.timeout));};try{request.send(JSON.stringify(payload));}catch(error){callback(errors.InvalidConnection(this.host));}};HttpProvider.prototype.isConnected=function(){try{this.send({id:9999999999,jsonrpc:'2.0',method:'net_listening',params:[]});return true;}catch(e){return false;}};module.exports=HttpProvider;}),(function(module,exports,__webpack_require__){"use strict";var utils=__webpack_require__(2);var errors=__webpack_require__(25);var IpcProvider=function(path,net){var _this=this;this.responseCallbacks={};this.path=path;this.connection=net.connect({path:this.path});this.connection.on('error',function(e){console.error('IPC Connection Error',e);_this._timeout();});this.connection.on('end',function(){_this._timeout();});this.connection.on('data',function(data){_this._parseResponse(data.toString()).forEach(function(result){var id=null;if(utils.isArray(result)){result.forEach(function(load){if(_this.responseCallbacks[load.id])
id=load.id;});}else{id=result.id;}
if(_this.responseCallbacks[id]){_this.responseCallbacks[id](null,result);delete _this.responseCallbacks[id];}});});};IpcProvider.prototype._parseResponse=function(data){var _this=this,returnValues=[];var dechunkedData=data.replace(/\}[\n\r]?\{/g,'}|--|{').replace(/\}\][\n\r]?\[\{/g,'}]|--|[{').replace(/\}[\n\r]?\[\{/g,'}|--|[{').replace(/\}\][\n\r]?\{/g,'}]|--|{').split('|--|');dechunkedData.forEach(function(data){if(_this.lastChunk)
data=_this.lastChunk+data;var result=null;try{result=JSON.parse(data);}catch(e){_this.lastChunk=data;clearTimeout(_this.lastChunkTimeout);_this.lastChunkTimeout=setTimeout(function(){_this._timeout();throw errors.InvalidResponse(data);},1000*15);return;}
clearTimeout(_this.lastChunkTimeout);_this.lastChunk=null;if(result)
returnValues.push(result);});return returnValues;};IpcProvider.prototype._addResponseCallback=function(payload,callback){var id=payload.id||payload[0].id;var method=payload.method||payload[0].method;this.responseCallbacks[id]=callback;this.responseCallbacks[id].method=method;};IpcProvider.prototype._timeout=function(){for(var key in this.responseCallbacks){if(this.responseCallbacks.hasOwnProperty(key)){this.responseCallbacks[key](errors.InvalidConnection('on IPC'));delete this.responseCallbacks[key];}}};IpcProvider.prototype.isConnected=function(){var _this=this;if(!_this.connection.writable)
_this.connection.connect({path:_this.path});return!!this.connection.writable;};IpcProvider.prototype.send=function(payload){if(this.connection.writeSync){var result;if(!this.connection.writable)
this.connection.connect({path:this.path});var data=this.connection.writeSync(JSON.stringify(payload));try{result=JSON.parse(data);}catch(e){throw errors.InvalidResponse(data);}
return result;}else{throw new Error('You tried to send "'+payload.method+'" synchronously. Synchronous requests are not supported by the IPC provider.');}};IpcProvider.prototype.sendAsync=function(payload,callback){if(!this.connection.writable)
this.connection.connect({path:this.path});this.connection.write(JSON.stringify(payload));this._addResponseCallback(payload,callback);};module.exports=IpcProvider;}),(function(module,exports,__webpack_require__){var Method=__webpack_require__(14);var DB=function(web3){this._requestManager=web3._requestManager;var self=this;methods().forEach(function(method){method.attachToObject(self);method.setRequestManager(web3._requestManager);});};var methods=function(){var putString=new Method({name:'putString',call:'db_putString',params:3});var getString=new Method({name:'getString',call:'db_getString',params:2});var putHex=new Method({name:'putHex',call:'db_putHex',params:3});var getHex=new Method({name:'getHex',call:'db_getHex',params:2});return[putString,getString,putHex,getHex];};module.exports=DB;}),(function(module,exports,__webpack_require__){"use strict";var formatters=__webpack_require__(9);var utils=__webpack_require__(2);var Method=__webpack_require__(14);var Property=__webpack_require__(19);var c=__webpack_require__(34);var Contract=__webpack_require__(129);var watches=__webpack_require__(37);var Filter=__webpack_require__(35);var IsSyncing=__webpack_require__(143);var namereg=__webpack_require__(140);var Iban=__webpack_require__(36);var transfer=__webpack_require__(144);var blockCall=function(args){return(utils.isString(args[0])&&args[0].indexOf('0x')===0)?"eth_getBlockByHash":"eth_getBlockByNumber";};var transactionFromBlockCall=function(args){return(utils.isString(args[0])&&args[0].indexOf('0x')===0)?'eth_getTransactionByBlockHashAndIndex':'eth_getTransactionByBlockNumberAndIndex';};var uncleCall=function(args){return(utils.isString(args[0])&&args[0].indexOf('0x')===0)?'eth_getUncleByBlockHashAndIndex':'eth_getUncleByBlockNumberAndIndex';};var getBlockTransactionCountCall=function(args){return(utils.isString(args[0])&&args[0].indexOf('0x')===0)?'eth_getBlockTransactionCountByHash':'eth_getBlockTransactionCountByNumber';};var uncleCountCall=function(args){return(utils.isString(args[0])&&args[0].indexOf('0x')===0)?'eth_getUncleCountByBlockHash':'eth_getUncleCountByBlockNumber';};function Eth(web3){this._requestManager=web3._requestManager;var self=this;methods().forEach(function(method){method.attachToObject(self);method.setRequestManager(self._requestManager);});properties().forEach(function(p){p.attachToObject(self);p.setRequestManager(self._requestManager);});this.iban=Iban;this.sendIBANTransaction=transfer.bind(null,this);}
Object.defineProperty(Eth.prototype,'defaultBlock',{get:function(){return c.defaultBlock;},set:function(val){c.defaultBlock=val;return val;}});Object.defineProperty(Eth.prototype,'defaultAccount',{get:function(){return c.defaultAccount;},set:function(val){c.defaultAccount=val;return val;}});var methods=function(){var getBalance=new Method({name:'getBalance',call:'eth_getBalance',params:2,inputFormatter:[formatters.inputAddressFormatter,formatters.inputDefaultBlockNumberFormatter],outputFormatter:formatters.outputBigNumberFormatter});var getStorageAt=new Method({name:'getStorageAt',call:'eth_getStorageAt',params:3,inputFormatter:[null,utils.toHex,formatters.inputDefaultBlockNumberFormatter]});var getCode=new Method({name:'getCode',call:'eth_getCode',params:2,inputFormatter:[formatters.inputAddressFormatter,formatters.inputDefaultBlockNumberFormatter]});var getBlock=new Method({name:'getBlock',call:blockCall,params:2,inputFormatter:[formatters.inputBlockNumberFormatter,function(val){return!!val;}],outputFormatter:formatters.outputBlockFormatter});var getUncle=new Method({name:'getUncle',call:uncleCall,params:2,inputFormatter:[formatters.inputBlockNumberFormatter,utils.toHex],outputFormatter:formatters.outputBlockFormatter,});var getCompilers=new Method({name:'getCompilers',call:'eth_getCompilers',params:0});var getBlockTransactionCount=new Method({name:'getBlockTransactionCount',call:getBlockTransactionCountCall,params:1,inputFormatter:[formatters.inputBlockNumberFormatter],outputFormatter:utils.toDecimal});var getBlockUncleCount=new Method({name:'getBlockUncleCount',call:uncleCountCall,params:1,inputFormatter:[formatters.inputBlockNumberFormatter],outputFormatter:utils.toDecimal});var getTransaction=new Method({name:'getTransaction',call:'eth_getTransactionByHash',params:1,outputFormatter:formatters.outputTransactionFormatter});var getTransactionFromBlock=new Method({name:'getTransactionFromBlock',call:transactionFromBlockCall,params:2,inputFormatter:[formatters.inputBlockNumberFormatter,utils.toHex],outputFormatter:formatters.outputTransactionFormatter});var getTransactionReceipt=new Method({name:'getTransactionReceipt',call:'eth_getTransactionReceipt',params:1,outputFormatter:formatters.outputTransactionReceiptFormatter});var getTransactionCount=new Method({name:'getTransactionCount',call:'eth_getTransactionCount',params:2,inputFormatter:[null,formatters.inputDefaultBlockNumberFormatter],outputFormatter:utils.toDecimal});var sendRawTransaction=new Method({name:'sendRawTransaction',call:'eth_sendRawTransaction',params:1,inputFormatter:[null]});var sendTransaction=new Method({name:'sendTransaction',call:'eth_sendTransaction',params:1,inputFormatter:[formatters.inputTransactionFormatter]});var signTransaction=new Method({name:'signTransaction',call:'eth_signTransaction',params:1,inputFormatter:[formatters.inputTransactionFormatter]});var sign=new Method({name:'sign',call:'eth_sign',params:2,inputFormatter:[formatters.inputAddressFormatter,null]});var call=new Method({name:'call',call:'eth_call',params:2,inputFormatter:[formatters.inputCallFormatter,formatters.inputDefaultBlockNumberFormatter]});var estimateGas=new Method({name:'estimateGas',call:'eth_estimateGas',params:1,inputFormatter:[formatters.inputCallFormatter],outputFormatter:utils.toDecimal});var compileSolidity=new Method({name:'compile.solidity',call:'eth_compileSolidity',params:1});var compileLLL=new Method({name:'compile.lll',call:'eth_compileLLL',params:1});var compileSerpent=new Method({name:'compile.serpent',call:'eth_compileSerpent',params:1});var submitWork=new Method({name:'submitWork',call:'eth_submitWork',params:3});var getWork=new Method({name:'getWork',call:'eth_getWork',params:0});return[getBalance,getStorageAt,getCode,getBlock,getUncle,getCompilers,getBlockTransactionCount,getBlockUncleCount,getTransaction,getTransactionFromBlock,getTransactionReceipt,getTransactionCount,call,estimateGas,sendRawTransaction,signTransaction,sendTransaction,sign,compileSolidity,compileLLL,compileSerpent,submitWork,getWork];};var properties=function(){return[new Property({name:'coinbase',getter:'eth_coinbase'}),new Property({name:'mining',getter:'eth_mining'}),new Property({name:'hashrate',getter:'eth_hashrate',outputFormatter:utils.toDecimal}),new Property({name:'syncing',getter:'eth_syncing',outputFormatter:formatters.outputSyncingFormatter}),new Property({name:'gasPrice',getter:'eth_gasPrice',outputFormatter:formatters.outputBigNumberFormatter}),new Property({name:'accounts',getter:'eth_accounts'}),new Property({name:'blockNumber',getter:'eth_blockNumber',outputFormatter:utils.toDecimal}),new Property({name:'protocolVersion',getter:'eth_protocolVersion'})];};Eth.prototype.contract=function(abi){var factory=new Contract(this,abi);return factory;};Eth.prototype.filter=function(fil,callback){return new Filter(this._requestManager,fil,watches.eth(),formatters.outputLogFormatter,callback);};Eth.prototype.namereg=function(){return this.contract(namereg.global.abi).at(namereg.global.address);};Eth.prototype.icapNamereg=function(){return this.contract(namereg.icap.abi).at(namereg.icap.address);};Eth.prototype.isSyncing=function(callback){return new IsSyncing(this._requestManager,callback);};module.exports=Eth;}),(function(module,exports,__webpack_require__){var utils=__webpack_require__(2);var Property=__webpack_require__(19);var Net=function(web3){this._requestManager=web3._requestManager;var self=this;properties().forEach(function(p){p.attachToObject(self);p.setRequestManager(web3._requestManager);});};var properties=function(){return[new Property({name:'listening',getter:'net_listening'}),new Property({name:'peerCount',getter:'net_peerCount',outputFormatter:utils.toDecimal})];};module.exports=Net;}),(function(module,exports,__webpack_require__){"use strict";var Method=__webpack_require__(14);var Property=__webpack_require__(19);var formatters=__webpack_require__(9);function Personal(web3){this._requestManager=web3._requestManager;var self=this;methods().forEach(function(method){method.attachToObject(self);method.setRequestManager(self._requestManager);});properties().forEach(function(p){p.attachToObject(self);p.setRequestManager(self._requestManager);});}
var methods=function(){var newAccount=new Method({name:'newAccount',call:'personal_newAccount',params:1,inputFormatter:[null]});var unlockAccount=new Method({name:'unlockAccount',call:'personal_unlockAccount',params:3,inputFormatter:[formatters.inputAddressFormatter,null,null]});var sendTransaction=new Method({name:'sendTransaction',call:'personal_sendTransaction',params:2,inputFormatter:[formatters.inputTransactionFormatter,null]});var lockAccount=new Method({name:'lockAccount',call:'personal_lockAccount',params:1,inputFormatter:[formatters.inputAddressFormatter]});return[newAccount,unlockAccount,sendTransaction,lockAccount];};var properties=function(){return[new Property({name:'listAccounts',getter:'personal_listAccounts'})];};module.exports=Personal;}),(function(module,exports,__webpack_require__){var Method=__webpack_require__(14);var formatters=__webpack_require__(9);var Filter=__webpack_require__(35);var watches=__webpack_require__(37);var Shh=function(web3){this._requestManager=web3._requestManager;var self=this;methods().forEach(function(method){method.attachToObject(self);method.setRequestManager(self._requestManager);});};Shh.prototype.filter=function(fil,callback){return new Filter(this._requestManager,fil,watches.shh(),formatters.outputPostFormatter,callback);};var methods=function(){var post=new Method({name:'post',call:'shh_post',params:1,inputFormatter:[formatters.inputPostFormatter]});var newIdentity=new Method({name:'newIdentity',call:'shh_newIdentity',params:0});var hasIdentity=new Method({name:'hasIdentity',call:'shh_hasIdentity',params:1});var newGroup=new Method({name:'newGroup',call:'shh_newGroup',params:0});var addToGroup=new Method({name:'addToGroup',call:'shh_addToGroup',params:0});return[post,newIdentity,hasIdentity,newGroup,addToGroup];};module.exports=Shh;}),(function(module,exports,__webpack_require__){"use strict";var Method=__webpack_require__(14);var Property=__webpack_require__(19);function Swarm(web3){this._requestManager=web3._requestManager;var self=this;methods().forEach(function(method){method.attachToObject(self);method.setRequestManager(self._requestManager);});properties().forEach(function(p){p.attachToObject(self);p.setRequestManager(self._requestManager);});}
var methods=function(){var blockNetworkRead=new Method({name:'blockNetworkRead',call:'bzz_blockNetworkRead',params:1,inputFormatter:[null]});var syncEnabled=new Method({name:'syncEnabled',call:'bzz_syncEnabled',params:1,inputFormatter:[null]});var swapEnabled=new Method({name:'swapEnabled',call:'bzz_swapEnabled',params:1,inputFormatter:[null]});var download=new Method({name:'download',call:'bzz_download',params:2,inputFormatter:[null,null]});var upload=new Method({name:'upload',call:'bzz_upload',params:2,inputFormatter:[null,null]});var retrieve=new Method({name:'retrieve',call:'bzz_retrieve',params:1,inputFormatter:[null]});var store=new Method({name:'store',call:'bzz_store',params:2,inputFormatter:[null,null]});var get=new Method({name:'get',call:'bzz_get',params:1,inputFormatter:[null]});var put=new Method({name:'put',call:'bzz_put',params:2,inputFormatter:[null,null]});var modify=new Method({name:'modify',call:'bzz_modify',params:4,inputFormatter:[null,null,null,null]});return[blockNetworkRead,syncEnabled,swapEnabled,download,upload,retrieve,store,get,put,modify];};var properties=function(){return[new Property({name:'hive',getter:'bzz_hive'}),new Property({name:'info',getter:'bzz_info'})];};module.exports=Swarm;}),(function(module,exports,__webpack_require__){var globalRegistrarAbi=__webpack_require__(112);var icapRegistrarAbi=__webpack_require__(113);var globalNameregAddress='0xc6d9d2cd449a754c494264e1809c50e34d64562b';var icapNameregAddress='0xa1a111bc074c9cfa781f0c38e63bd51c91b8af00';module.exports={global:{abi:globalRegistrarAbi,address:globalNameregAddress},icap:{abi:icapRegistrarAbi,address:icapNameregAddress}};}),(function(module,exports,__webpack_require__){var Jsonrpc=__webpack_require__(61);var utils=__webpack_require__(2);var c=__webpack_require__(34);var errors=__webpack_require__(25);var RequestManager=function(provider){this.provider=provider;this.polls={};this.timeout=null;};RequestManager.prototype.send=function(data){if(!this.provider){console.error(errors.InvalidProvider());return null;}
var payload=Jsonrpc.toPayload(data.method,data.params);var result=this.provider.send(payload);if(!Jsonrpc.isValidResponse(result)){throw errors.InvalidResponse(result);}
return result.result;};RequestManager.prototype.sendAsync=function(data,callback){if(!this.provider){return callback(errors.InvalidProvider());}
var payload=Jsonrpc.toPayload(data.method,data.params);this.provider.sendAsync(payload,function(err,result){if(err){return callback(err);}
if(!Jsonrpc.isValidResponse(result)){return callback(errors.InvalidResponse(result));}
callback(null,result.result);});};RequestManager.prototype.sendBatch=function(data,callback){if(!this.provider){return callback(errors.InvalidProvider());}
var payload=Jsonrpc.toBatchPayload(data);this.provider.sendAsync(payload,function(err,results){if(err){return callback(err);}
if(!utils.isArray(results)){return callback(errors.InvalidResponse(results));}
callback(err,results);});};RequestManager.prototype.setProvider=function(p){this.provider=p;};RequestManager.prototype.startPolling=function(data,pollId,callback,uninstall){this.polls[pollId]={data:data,id:pollId,callback:callback,uninstall:uninstall};if(!this.timeout){this.poll();}};RequestManager.prototype.stopPolling=function(pollId){delete this.polls[pollId];if(Object.keys(this.polls).length===0&&this.timeout){clearTimeout(this.timeout);this.timeout=null;}};RequestManager.prototype.reset=function(keepIsSyncing){for(var key in this.polls){if(!keepIsSyncing||key.indexOf('syncPoll_')===-1){this.polls[key].uninstall();delete this.polls[key];}}
if(Object.keys(this.polls).length===0&&this.timeout){clearTimeout(this.timeout);this.timeout=null;}};RequestManager.prototype.poll=function(){this.timeout=setTimeout(this.poll.bind(this),c.ETH_POLLING_TIMEOUT);if(Object.keys(this.polls).length===0){return;}
if(!this.provider){console.error(errors.InvalidProvider());return;}
var pollsData=[];var pollsIds=[];for(var key in this.polls){pollsData.push(this.polls[key].data);pollsIds.push(key);}
if(pollsData.length===0){return;}
var payload=Jsonrpc.toBatchPayload(pollsData);var pollsIdMap={};payload.forEach(function(load,index){pollsIdMap[load.id]=pollsIds[index];});var self=this;this.provider.sendAsync(payload,function(error,results){if(error){return;}
if(!utils.isArray(results)){throw errors.InvalidResponse(results);}
results.map(function(result){var id=pollsIdMap[result.id];if(self.polls[id]){result.callback=self.polls[id].callback;return result;}else
return false;}).filter(function(result){return!!result;}).filter(function(result){var valid=Jsonrpc.isValidResponse(result);if(!valid){result.callback(errors.InvalidResponse(result));}
return valid;}).forEach(function(result){result.callback(null,result.result);});});};module.exports=RequestManager;}),(function(module,exports){var Settings=function(){this.defaultBlock='latest';this.defaultAccount=undefined;};module.exports=Settings;}),(function(module,exports,__webpack_require__){var formatters=__webpack_require__(9);var utils=__webpack_require__(2);var count=1;var pollSyncing=function(self){var onMessage=function(error,sync){if(error){return self.callbacks.forEach(function(callback){callback(error);});}
if(utils.isObject(sync)&&sync.startingBlock)
sync=formatters.outputSyncingFormatter(sync);self.callbacks.forEach(function(callback){if(self.lastSyncState!==sync){if(!self.lastSyncState&&utils.isObject(sync))
callback(null,true);setTimeout(function(){callback(null,sync);},0);self.lastSyncState=sync;}});};self.requestManager.startPolling({method:'eth_syncing',params:[],},self.pollId,onMessage,self.stopWatching.bind(self));};var IsSyncing=function(requestManager,callback){this.requestManager=requestManager;this.pollId='syncPoll_'+count++;this.callbacks=[];this.addCallback(callback);this.lastSyncState=false;pollSyncing(this);return this;};IsSyncing.prototype.addCallback=function(callback){if(callback)
this.callbacks.push(callback);return this;};IsSyncing.prototype.stopWatching=function(){this.requestManager.stopPolling(this.pollId);this.callbacks=[];};module.exports=IsSyncing;}),(function(module,exports,__webpack_require__){var Iban=__webpack_require__(36);var exchangeAbi=__webpack_require__(114);var transfer=function(eth,from,to,value,callback){var iban=new Iban(to);if(!iban.isValid()){throw new Error('invalid iban address');}
if(iban.isDirect()){return transferToAddress(eth,from,iban.address(),value,callback);}
if(!callback){var address=eth.icapNamereg().addr(iban.institution());return deposit(eth,from,address,value,iban.client());}
eth.icapNamereg().addr(iban.institution(),function(err,address){return deposit(eth,from,address,value,iban.client(),callback);});};var transferToAddress=function(eth,from,to,value,callback){return eth.sendTransaction({address:to,from:from,value:value},callback);};var deposit=function(eth,from,to,value,client,callback){var abi=exchangeAbi;return eth.contract(abi).at(to).deposit(client,{from:from,value:value},callback);};module.exports=transfer;}),(function(module,exports,__webpack_require__){var sha3=__webpack_require__(146);var schema_version=__webpack_require__(148).version;var TruffleSchema={normalizeOptions:function(options,extra_options){extra_options=extra_options||{};var normalized={};var expected_keys=["contract_name","abi","binary","unlinked_binary","address","networks","links","events","network_id","default_network","updated_at"];expected_keys.forEach(function(key){var value;try{value=options[key];if(value!=undefined){normalized[key]=value;}}catch(e){}
try{value=extra_options[key];if(value!=undefined){normalized[key]=value;}}catch(e){}});if(options.interface!=null){normalized.abi=JSON.parse(options.interface);}
if(options.bytecode!=null){normalized.unlinked_binary=options.bytecode}
if(normalized.unlinked_binary==null&&normalized.binary){normalized.unlinked_binary=normalized.binary;}
delete normalized.binary;this.copyCustomOptions(options,normalized);return normalized;},generateBinary:function(options,existing_binary,extra_options){extra_options=extra_options||{};existing_binary=existing_binary||{};if(options.overwrite==true){existing_binary={};}
existing_binary.contract_name=options.contract_name||existing_binary.contract_name||"Contract";existing_binary.default_network=options.default_network||existing_binary.default_network;existing_binary.abi=options.abi||existing_binary.abi;existing_binary.unlinked_binary=options.unlinked_binary||existing_binary.unlinked_binary;if(existing_binary.unlinked_binary&&existing_binary.unlinked_binary.indexOf("0x")<0){existing_binary.unlinked_binary="0x"+existing_binary.unlinked_binary;}
existing_binary.networks=existing_binary.networks||{};options.networks=options.networks||{};Object.keys(options.networks).forEach(function(network_id){existing_binary.networks[network_id]=options.networks[network_id];});var updated_at=new Date().getTime();if(options.network_id){existing_binary.networks[options.network_id]=existing_binary.networks[options.network_id]||{};var network=existing_binary.networks[options.network_id];network.address=options.address||network.address;network.links=options.links;network.events=network.events||{};options.events=options.events||{};Object.keys(options.events).forEach(function(event_id){options.events[event_id]=options.events[event_id];});existing_binary.abi.forEach(function(item){if(item.type!="event")return;var signature=item.name+"("+item.inputs.map(function(param){return param.type;}).join(",")+")";network.events["0x"+sha3(signature,{outputLength:256})]=item;});if(extra_options.dirty!==false){network.updated_at=updated_at;}}else{if(options.address){throw new Error("Cannot set address without network id");}}
Object.keys(existing_binary.networks).forEach(function(network_id){var network=existing_binary.networks[network_id];network.links=network.links||{};});existing_binary.schema_version=schema_version;if(extra_options.dirty!==false){existing_binary.updated_at=updated_at;}else{existing_binary.updated_at=options.updated_at||existing_binary.updated_at||updated_at;}
this.copyCustomOptions(options,existing_binary);return existing_binary;},copyCustomOptions:function(from,to){Object.keys(from).forEach(function(key){if(key.indexOf("x-")!=0)return;try{value=from[key];if(value!=undefined){to[key]=value;}}catch(e){}});}};module.exports=TruffleSchema;}),(function(module,exports,__webpack_require__){;(function(root,factory,undef){if(true){module.exports=exports=factory(__webpack_require__(62),__webpack_require__(147));}
else if(typeof define==="function"&&define.amd){define(["./core","./x64-core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){(function(Math){var C=CryptoJS;var C_lib=C.lib;var WordArray=C_lib.WordArray;var Hasher=C_lib.Hasher;var C_x64=C.x64;var X64Word=C_x64.Word;var C_algo=C.algo;var RHO_OFFSETS=[];var PI_INDEXES=[];var ROUND_CONSTANTS=[];(function(){var x=1,y=0;for(var t=0;t<24;t++){RHO_OFFSETS[x+5*y]=((t+1)*(t+2)/2)%64;var newX=y%5;var newY=(2*x+3*y)%5;x=newX;y=newY;}
for(var x=0;x<5;x++){for(var y=0;y<5;y++){PI_INDEXES[x+5*y]=y+((2*x+3*y)%5)*5;}}
var LFSR=0x01;for(var i=0;i<24;i++){var roundConstantMsw=0;var roundConstantLsw=0;for(var j=0;j<7;j++){if(LFSR&0x01){var bitPosition=(1<<j)-1;if(bitPosition<32){roundConstantLsw^=1<<bitPosition;}else{roundConstantMsw^=1<<(bitPosition-32);}}
if(LFSR&0x80){LFSR=(LFSR<<1)^0x71;}else{LFSR<<=1;}}
ROUND_CONSTANTS[i]=X64Word.create(roundConstantMsw,roundConstantLsw);}}());var T=[];(function(){for(var i=0;i<25;i++){T[i]=X64Word.create();}}());var SHA3=C_algo.SHA3=Hasher.extend({cfg:Hasher.cfg.extend({outputLength:512}),_doReset:function(){var state=this._state=[]
for(var i=0;i<25;i++){state[i]=new X64Word.init();}
this.blockSize=(1600-2*this.cfg.outputLength)/32;},_doProcessBlock:function(M,offset){var state=this._state;var nBlockSizeLanes=this.blockSize/2;for(var i=0;i<nBlockSizeLanes;i++){var M2i=M[offset+2*i];var M2i1=M[offset+2*i+1];M2i=((((M2i<<8)|(M2i>>>24))&0x00ff00ff)|(((M2i<<24)|(M2i>>>8))&0xff00ff00));M2i1=((((M2i1<<8)|(M2i1>>>24))&0x00ff00ff)|(((M2i1<<24)|(M2i1>>>8))&0xff00ff00));var lane=state[i];lane.high^=M2i1;lane.low^=M2i;}
for(var round=0;round<24;round++){for(var x=0;x<5;x++){var tMsw=0,tLsw=0;for(var y=0;y<5;y++){var lane=state[x+5*y];tMsw^=lane.high;tLsw^=lane.low;}
var Tx=T[x];Tx.high=tMsw;Tx.low=tLsw;}
for(var x=0;x<5;x++){var Tx4=T[(x+4)%5];var Tx1=T[(x+1)%5];var Tx1Msw=Tx1.high;var Tx1Lsw=Tx1.low;var tMsw=Tx4.high^((Tx1Msw<<1)|(Tx1Lsw>>>31));var tLsw=Tx4.low^((Tx1Lsw<<1)|(Tx1Msw>>>31));for(var y=0;y<5;y++){var lane=state[x+5*y];lane.high^=tMsw;lane.low^=tLsw;}}
for(var laneIndex=1;laneIndex<25;laneIndex++){var lane=state[laneIndex];var laneMsw=lane.high;var laneLsw=lane.low;var rhoOffset=RHO_OFFSETS[laneIndex];if(rhoOffset<32){var tMsw=(laneMsw<<rhoOffset)|(laneLsw>>>(32-rhoOffset));var tLsw=(laneLsw<<rhoOffset)|(laneMsw>>>(32-rhoOffset));}else{var tMsw=(laneLsw<<(rhoOffset-32))|(laneMsw>>>(64-rhoOffset));var tLsw=(laneMsw<<(rhoOffset-32))|(laneLsw>>>(64-rhoOffset));}
var TPiLane=T[PI_INDEXES[laneIndex]];TPiLane.high=tMsw;TPiLane.low=tLsw;}
var T0=T[0];var state0=state[0];T0.high=state0.high;T0.low=state0.low;for(var x=0;x<5;x++){for(var y=0;y<5;y++){var laneIndex=x+5*y;var lane=state[laneIndex];var TLane=T[laneIndex];var Tx1Lane=T[((x+1)%5)+5*y];var Tx2Lane=T[((x+2)%5)+5*y];lane.high=TLane.high^(~Tx1Lane.high&Tx2Lane.high);lane.low=TLane.low^(~Tx1Lane.low&Tx2Lane.low);}}
var lane=state[0];var roundConstant=ROUND_CONSTANTS[round];lane.high^=roundConstant.high;lane.low^=roundConstant.low;;}},_doFinalize:function(){var data=this._data;var dataWords=data.words;var nBitsTotal=this._nDataBytes*8;var nBitsLeft=data.sigBytes*8;var blockSizeBits=this.blockSize*32;dataWords[nBitsLeft>>>5]|=0x1<<(24-nBitsLeft%32);dataWords[((Math.ceil((nBitsLeft+1)/blockSizeBits)*blockSizeBits)>>>5)-1]|=0x80;data.sigBytes=dataWords.length*4;this._process();var state=this._state;var outputLengthBytes=this.cfg.outputLength/8;var outputLengthLanes=outputLengthBytes/8;var hashWords=[];for(var i=0;i<outputLengthLanes;i++){var lane=state[i];var laneMsw=lane.high;var laneLsw=lane.low;laneMsw=((((laneMsw<<8)|(laneMsw>>>24))&0x00ff00ff)|(((laneMsw<<24)|(laneMsw>>>8))&0xff00ff00));laneLsw=((((laneLsw<<8)|(laneLsw>>>24))&0x00ff00ff)|(((laneLsw<<24)|(laneLsw>>>8))&0xff00ff00));hashWords.push(laneLsw);hashWords.push(laneMsw);}
return new WordArray.init(hashWords,outputLengthBytes);},clone:function(){var clone=Hasher.clone.call(this);var state=clone._state=this._state.slice(0);for(var i=0;i<25;i++){state[i]=state[i].clone();}
return clone;}});C.SHA3=Hasher._createHelper(SHA3);C.HmacSHA3=Hasher._createHmacHelper(SHA3);}(Math));return CryptoJS.SHA3;}));}),(function(module,exports,__webpack_require__){;(function(root,factory){if(true){module.exports=exports=factory(__webpack_require__(62));}
else if(typeof define==="function"&&define.amd){define(["./core"],factory);}
else{factory(root.CryptoJS);}}(this,function(CryptoJS){(function(undefined){var C=CryptoJS;var C_lib=C.lib;var Base=C_lib.Base;var X32WordArray=C_lib.WordArray;var C_x64=C.x64={};var X64Word=C_x64.Word=Base.extend({init:function(high,low){this.high=high;this.low=low;}});var X64WordArray=C_x64.WordArray=Base.extend({init:function(words,sigBytes){words=this.words=words||[];if(sigBytes!=undefined){this.sigBytes=sigBytes;}else{this.sigBytes=words.length*8;}},toX32:function(){var x64Words=this.words;var x64WordsLength=x64Words.length;var x32Words=[];for(var i=0;i<x64WordsLength;i++){var x64Word=x64Words[i];x32Words.push(x64Word.high);x32Words.push(x64Word.low);}
return X32WordArray.create(x32Words,this.sigBytes);},clone:function(){var clone=Base.clone.call(this);var words=clone.words=this.words.slice(0);var wordsLength=words.length;for(var i=0;i<wordsLength;i++){words[i]=words[i].clone();}
return clone;}});}());return CryptoJS;}));}),(function(module,exports){module.exports={"_from":"truffle-contract-schema@0.0.5","_id":"truffle-contract-schema@0.0.5","_inBundle":false,"_integrity":"sha1-Xp0gvQvyon/pQxB0gknUhO7kmWE=","_location":"/truffle-contract-schema","_phantomChildren":{},"_requested":{"type":"version","registry":true,"raw":"truffle-contract-schema@0.0.5","name":"truffle-contract-schema","escapedName":"truffle-contract-schema","rawSpec":"0.0.5","saveSpec":null,"fetchSpec":"0.0.5"},"_requiredBy":["/truffle-contract"],"_resolved":"https://registry.npmjs.org/truffle-contract-schema/-/truffle-contract-schema-0.0.5.tgz","_shasum":"5e9d20bd0bf2a27fe94310748249d484eee49961","_spec":"truffle-contract-schema@0.0.5","_where":"D:\\temp\\1\\class\\demo2\\node_modules\\truffle-contract","author":{"name":"Tim Coulter","email":"tim.coulter@consensys.net"},"bugs":{"url":"https://github.com/trufflesuite/truffle-schema/issues"},"bundleDependencies":false,"dependencies":{"crypto-js":"^3.1.9-1"},"deprecated":false,"description":"JSON schema for contract artifacts","devDependencies":{"mocha":"^3.2.0"},"homepage":"https://github.com/trufflesuite/truffle-schema#readme","keywords":["ethereum","json","schema","contract","artifacts"],"license":"MIT","main":"index.js","name":"truffle-contract-schema","repository":{"type":"git","url":"git+https://github.com/trufflesuite/truffle-schema.git"},"scripts":{"test":"mocha"},"version":"0.0.5"}}),(function(module,exports,__webpack_require__){(function(global,module){var ethJSABI=__webpack_require__(100);var BlockchainUtils=__webpack_require__(110);var Web3=__webpack_require__(150);if(typeof Web3=="object"&&Object.keys(Web3).length==0){Web3=global.Web3;}
var contract=(function(module){function Provider(provider){this.provider=provider;}
Provider.prototype.send=function(){return this.provider.send.apply(this.provider,arguments);};Provider.prototype.sendAsync=function(){return this.provider.sendAsync.apply(this.provider,arguments);};var BigNumber=(new Web3()).toBigNumber(0).constructor;var Utils={is_object:function(val){return typeof val=="object"&&!Array.isArray(val);},is_big_number:function(val){if(typeof val!="object")return false;try{new BigNumber(val);return true;}catch(e){return false;}},decodeLogs:function(C,instance,logs){return logs.map(function(log){var logABI=C.events[log.topics[0]];if(logABI==null){return null;}
var copy=Utils.merge({},log);function partialABI(fullABI,indexed){var inputs=fullABI.inputs.filter(function(i){return i.indexed===indexed;});var partial={inputs:inputs,name:fullABI.name,type:fullABI.type,anonymous:fullABI.anonymous};return partial;}
var argTopics=logABI.anonymous?copy.topics:copy.topics.slice(1);var indexedData="0x"+argTopics.map(function(topics){return topics.slice(2);}).join("");var indexedParams=ethJSABI.decodeEvent(partialABI(logABI,true),indexedData);var notIndexedData=copy.data;var notIndexedParams=ethJSABI.decodeEvent(partialABI(logABI,false),notIndexedData);copy.event=logABI.name;copy.args=logABI.inputs.reduce(function(acc,current){var val=indexedParams[current.name];if(val===undefined){val=notIndexedParams[current.name];}
acc[current.name]=val;return acc;},{});Object.keys(copy.args).forEach(function(key){var val=copy.args[key];if(val.constructor.isBN){copy.args[key]=C.web3.toBigNumber("0x"+val.toString(16));}});delete copy.data;delete copy.topics;return copy;}).filter(function(log){return log!=null;});},promisifyFunction:function(fn,C){var self=this;return function(){var instance=this;var args=Array.prototype.slice.call(arguments);var tx_params={};var last_arg=args[args.length-1];if(Utils.is_object(last_arg)&&!Utils.is_big_number(last_arg)){tx_params=args.pop();}
tx_params=Utils.merge(C.class_defaults,tx_params);return C.detectNetwork().then(function(){return new Promise(function(accept,reject){var callback=function(error,result){if(error!=null){reject(error);}else{accept(result);}};args.push(tx_params,callback);fn.apply(instance.contract,args);});});};},synchronizeFunction:function(fn,instance,C){var self=this;return function(){var args=Array.prototype.slice.call(arguments);var tx_params={};var last_arg=args[args.length-1];if(Utils.is_object(last_arg)&&!Utils.is_big_number(last_arg)){tx_params=args.pop();}
tx_params=Utils.merge(C.class_defaults,tx_params);return C.detectNetwork().then(function(){return new Promise(function(accept,reject){var callback=function(error,tx){if(error!=null){reject(error);return;}
var timeout=C.synchronization_timeout||240000;var start=new Date().getTime();var make_attempt=function(){C.web3.eth.getTransactionReceipt(tx,function(err,receipt){if(err)return reject(err);if(receipt!=null){return accept({tx:tx,receipt:receipt,logs:Utils.decodeLogs(C,instance,receipt.logs)});}
if(timeout>0&&new Date().getTime()-start>timeout){return reject(new Error("Transaction "+tx+" wasn't processed in "+(timeout/1000)+" seconds!"));}
setTimeout(make_attempt,1000);});};make_attempt();};args.push(tx_params,callback);fn.apply(self,args);});});};},merge:function(){var merged={};var args=Array.prototype.slice.call(arguments);for(var i=0;i<args.length;i++){var object=args[i];var keys=Object.keys(object);for(var j=0;j<keys.length;j++){var key=keys[j];var value=object[key];merged[key]=value;}}
return merged;},parallel:function(arr,callback){callback=callback||function(){};if(!arr.length){return callback(null,[]);}
var index=0;var results=new Array(arr.length);arr.forEach(function(fn,position){fn(function(err,result){if(err){callback(err);callback=function(){};}else{index++;results[position]=result;if(index>=arr.length){callback(null,results);}}});});},bootstrap:function(fn){Object.keys(fn._static_methods).forEach(function(key){fn[key]=fn._static_methods[key].bind(fn);});Object.keys(fn._properties).forEach(function(key){fn.addProp(key,fn._properties[key]);});return fn;}};function Contract(contract){var self=this;var constructor=this.constructor;this.abi=constructor.abi;if(typeof contract=="string"){var address=contract;var contract_class=constructor.web3.eth.contract(this.abi);contract=contract_class.at(address);}
this.contract=contract;for(var i=0;i<this.abi.length;i++){var item=this.abi[i];if(item.type=="function"){if(item.constant==true){this[item.name]=Utils.promisifyFunction(contract[item.name],constructor);}else{this[item.name]=Utils.synchronizeFunction(contract[item.name],this,constructor);}
this[item.name].call=Utils.promisifyFunction(contract[item.name].call,constructor);this[item.name].sendTransaction=Utils.promisifyFunction(contract[item.name].sendTransaction,constructor);this[item.name].request=contract[item.name].request;this[item.name].estimateGas=Utils.promisifyFunction(contract[item.name].estimateGas,constructor);}
if(item.type=="event"){this[item.name]=contract[item.name];}}
this.sendTransaction=Utils.synchronizeFunction(function(tx_params,callback){if(typeof tx_params=="function"){callback=tx_params;tx_params={};}
tx_params.to=self.address;constructor.web3.eth.sendTransaction.apply(constructor.web3.eth,[tx_params,callback]);},this,constructor);this.send=function(value){return self.sendTransaction({value:value});};this.allEvents=contract.allEvents;this.address=contract.address;this.transactionHash=contract.transactionHash;};Contract._static_methods={setProvider:function(provider){if(!provider){throw new Error("Invalid provider passed to setProvider(); provider is "+provider);}
var wrapped=new Provider(provider);this.web3.setProvider(wrapped);this.currentProvider=provider;},new:function(){var self=this;if(this.currentProvider==null){throw new Error(this.contract_name+" error: Please call setProvider() first before calling new().");}
var args=Array.prototype.slice.call(arguments);if(!this.unlinked_binary){throw new Error(this._json.contract_name+" error: contract binary not set. Can't deploy new instance.");}
return self.detectNetwork().then(function(network_id){var regex=/__[^_]+_+/g;var unlinked_libraries=self.binary.match(regex);if(unlinked_libraries!=null){unlinked_libraries=unlinked_libraries.map(function(name){return name.replace(/_/g,"");}).sort().filter(function(name,index,arr){if(index+1>=arr.length){return true;}
return name!=arr[index+1];}).join(", ");throw new Error(self.contract_name+" contains unresolved libraries. You must deploy and link the following libraries before you can deploy a new version of "+self._json.contract_name+": "+unlinked_libraries);}}).then(function(){return new Promise(function(accept,reject){var contract_class=self.web3.eth.contract(self.abi);var tx_params={};var last_arg=args[args.length-1];if(Utils.is_object(last_arg)&&!Utils.is_big_number(last_arg)){tx_params=args.pop();}
tx_params=Utils.merge(self.class_defaults,tx_params);if(tx_params.data==null){tx_params.data=self.binary;}
var intermediary=function(err,web3_instance){if(err!=null){reject(err);return;}
if(err==null&&web3_instance!=null&&web3_instance.address!=null){accept(new self(web3_instance));}};args.push(tx_params,intermediary);contract_class.new.apply(contract_class,args);});});},at:function(address){var self=this;if(address==null||typeof address!="string"||address.length!=42){throw new Error("Invalid address passed to "+this._json.contract_name+".at(): "+address);}
var contract=new this(address);contract.then=function(fn){return self.detectNetwork().then(function(network_id){var instance=new self(address);return new Promise(function(accept,reject){self.web3.eth.getCode(address,function(err,code){if(err)return reject(err);if(!code||new BigNumber(code).eq(0)){return reject(new Error("Cannot create instance of "+self.contract_name+"; no code at address "+address));}
accept(instance);});});}).then(fn);};return contract;},deployed:function(){var self=this;return self.detectNetwork().then(function(){if(self._json.networks[self.network_id]==null){throw new Error(self.contract_name+" has not been deployed to detected network (network/artifact mismatch)");}
if(!self.isDeployed()){throw new Error(self.contract_name+" has not been deployed to detected network ("+self.network_id+")");}
return new self(self.address);});},defaults:function(class_defaults){if(this.class_defaults==null){this.class_defaults={};}
if(class_defaults==null){class_defaults={};}
var self=this;Object.keys(class_defaults).forEach(function(key){var value=class_defaults[key];self.class_defaults[key]=value;});return this.class_defaults;},hasNetwork:function(network_id){return this._json.networks[network_id+""]!=null;},isDeployed:function(){if(this.network_id==null){return false;}
if(this._json.networks[this.network_id]==null){return false;}
return!!this.network.address;},detectNetwork:function(){var self=this;return new Promise(function(accept,reject){if(self.network_id){if(self.networks[self.network_id]!=null){return accept(self.network_id);}}
self.web3.version.getNetwork(function(err,result){if(err)return reject(err);var network_id=result.toString();if(self.hasNetwork(network_id)){self.setNetwork(network_id);return accept();}
var uris=Object.keys(self._json.networks).filter(function(network){return network.indexOf("blockchain://")==0;});var matches=uris.map(function(uri){return BlockchainUtils.matches.bind(BlockchainUtils,uri,self.web3.currentProvider);});Utils.parallel(matches,function(err,results){if(err)return reject(err);for(var i=0;i<results.length;i++){if(results[i]){self.setNetwork(uris[i]);return accept();}}
self.setNetwork(network_id);accept();});});});},setNetwork:function(network_id){if(!network_id)return;this.network_id=network_id+"";},resetAddress:function(){delete this.network.address;},link:function(name,address){var self=this;if(typeof name=="function"){var contract=name;if(contract.isDeployed()==false){throw new Error("Cannot link contract without an address.");}
this.link(contract.contract_name,contract.address);Object.keys(contract.events).forEach(function(topic){self.network.events[topic]=contract.events[topic];});return;}
if(typeof name=="object"){var obj=name;Object.keys(obj).forEach(function(name){var a=obj[name];self.link(name,a);});return;}
if(this._json.networks[this.network_id]==null){this._json.networks[this.network_id]={events:{},links:{}};}
this.network.links[name]=address;},clone:function(options){var self=this;var temp=function TruffleContract(){this.constructor=temp;return Contract.apply(this,arguments);};var json=options;var network_id;if(typeof options!="object"){json=self._json;network_id=options;options={};}
temp.prototype=Object.create(self.prototype);temp._static_methods=this._static_methods;temp._properties=this._properties;temp._property_values={};temp._json=json||{};Utils.bootstrap(temp);temp.web3=new Web3();temp.class_defaults=temp.prototype.defaults||{};if(network_id){temp.setNetwork(network_id);}
Object.keys(options).forEach(function(key){if(key.indexOf("x-")!=0)return;temp[key]=options[key];});return temp;},addProp:function(key,fn){var self=this;var getter=function(){if(fn.get!=null){return fn.get.call(self);}
return self._property_values[key]||fn.call(self);}
var setter=function(val){if(fn.set!=null){fn.set.call(self,val);return;}
throw new Error(key+" property is immutable");};var definition={};definition.enumerable=false;definition.configurable=false;definition.get=getter;definition.set=setter;Object.defineProperty(this,key,definition);},toJSON:function(){return this._json;}};Contract._properties={contract_name:{get:function(){return this._json.contract_name;},set:function(val){this._json.contract_name=val;}},abi:{get:function(){return this._json.abi;},set:function(val){this._json.abi=val;}},network:function(){var network_id=this.network_id;if(network_id==null){throw new Error(this.contract_name+" has no network id set, cannot lookup artifact data. Either set the network manually using "+this.contract_name+".setNetwork(), run "+this.contract_name+".detectNetwork(), or use new(), at() or deployed() as a thenable which will detect the network automatically.");}
if(this._json.networks[network_id]==null){throw new Error(this.contract_name+" has no network configuration for its current network id ("+network_id+").");}
return this._json.networks[network_id];},networks:function(){return this._json.networks;},address:{get:function(){var address=this.network.address;if(address==null){throw new Error("Cannot find deployed address: "+this.contract_name+" not deployed or address not set.");}
return address;},set:function(val){if(val==null){throw new Error("Cannot set deployed address; malformed value: "+val);}
var network_id=this.network_id;if(network_id==null){throw new Error(this.contract_name+" has no network id set, cannot lookup artifact data. Either set the network manually using "+this.contract_name+".setNetwork(), run "+this.contract_name+".detectNetwork(), or use new(), at() or deployed() as a thenable which will detect the network automatically.");}
if(this._json.networks[network_id]==null){this._json.networks[network_id]={events:{},links:{}};}
this.network.address=val;}},links:function(){if(this._json.networks[this.network_id]==null){return{};}
return this.network.links||{};},events:function(){var web3=new Web3();var events;if(this._json.networks[this.network_id]==null){events={};}else{events=this.network.events||{};}
var abi=this.abi;abi.forEach(function(item){if(item.type!="event")return;var signature=item.name+"(";item.inputs.forEach(function(input,index){signature+=input.type;if(index<item.inputs.length-1){signature+=",";}});signature+=")";var topic=web3.sha3(signature);events[topic]=item;});return events;},binary:function(){var self=this;var binary=this.unlinked_binary;Object.keys(this.links).forEach(function(library_name){var library_address=self.links[library_name];var regex=new RegExp("__"+library_name+"_*","g");binary=binary.replace(regex,library_address.replace("0x",""));});return binary;},unlinked_binary:{get:function(){return this._json.unlinked_binary;},set:function(val){this._json.unlinked_binary=val;}},schema_version:function(){return this._json.schema_version;},updated_at:function(){try{return this.network.updated_at||this._json.updated_at;}catch(e){return this._json.updated_at;}}};Utils.bootstrap(Contract);module.exports=Contract;return Contract;})(module||{});}.call(exports,__webpack_require__(47),__webpack_require__(55)(module)))}),(function(module,exports,__webpack_require__){var Web3=__webpack_require__(165);if(typeof window!=='undefined'&&typeof window.Web3==='undefined'){window.Web3=Web3;}
module.exports=Web3;}),(function(module,exports){module.exports=[{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"name","outputs":[{"name":"o_name","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"owner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"content","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"addr","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"}],"name":"reserve","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"subRegistrar","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_newOwner","type":"address"}],"name":"transfer","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_registrar","type":"address"}],"name":"setSubRegistrar","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"Registrar","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_a","type":"address"},{"name":"_primary","type":"bool"}],"name":"setAddress","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_content","type":"bytes32"}],"name":"setContent","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"}],"name":"disown","outputs":[],"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_name","type":"bytes32"},{"indexed":false,"name":"_winner","type":"address"}],"name":"AuctionEnded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_name","type":"bytes32"},{"indexed":false,"name":"_bidder","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"NewBid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"name","type":"bytes32"}],"name":"Changed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"name","type":"bytes32"},{"indexed":true,"name":"addr","type":"address"}],"name":"PrimaryChanged","type":"event"}]}),(function(module,exports){module.exports=[{"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"owner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_refund","type":"address"}],"name":"disown","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"addr","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"}],"name":"reserve","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_newOwner","type":"address"}],"name":"transfer","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_a","type":"address"}],"name":"setAddr","outputs":[],"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"name","type":"bytes32"}],"name":"Changed","type":"event"}]}),(function(module,exports){module.exports=[{"constant":false,"inputs":[{"name":"from","type":"bytes32"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"from","type":"bytes32"},{"name":"to","type":"address"},{"name":"indirectId","type":"bytes32"},{"name":"value","type":"uint256"}],"name":"icapTransfer","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"to","type":"bytes32"}],"name":"deposit","outputs":[],"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"AnonymousDeposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"bytes32"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"bytes32"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"bytes32"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"indirectId","type":"bytes32"},{"indexed":false,"name":"value","type":"uint256"}],"name":"IcapTransfer","type":"event"}]}),(function(module,exports,__webpack_require__){var f=__webpack_require__(6);var SolidityType=__webpack_require__(10);var SolidityTypeAddress=function(){this._inputFormatter=f.formatInputInt;this._outputFormatter=f.formatOutputAddress;};SolidityTypeAddress.prototype=new SolidityType({});SolidityTypeAddress.prototype.constructor=SolidityTypeAddress;SolidityTypeAddress.prototype.isType=function(name){return!!name.match(/address(\[([0-9]*)\])?/);};SolidityTypeAddress.prototype.staticPartLength=function(name){return 32*this.staticArrayLength(name);};module.exports=SolidityTypeAddress;}),(function(module,exports,__webpack_require__){var f=__webpack_require__(6);var SolidityType=__webpack_require__(10);var SolidityTypeBool=function(){this._inputFormatter=f.formatInputBool;this._outputFormatter=f.formatOutputBool;};SolidityTypeBool.prototype=new SolidityType({});SolidityTypeBool.prototype.constructor=SolidityTypeBool;SolidityTypeBool.prototype.isType=function(name){return!!name.match(/^bool(\[([0-9]*)\])*$/);};SolidityTypeBool.prototype.staticPartLength=function(name){return 32*this.staticArrayLength(name);};module.exports=SolidityTypeBool;}),(function(module,exports,__webpack_require__){var f=__webpack_require__(6);var SolidityType=__webpack_require__(10);var SolidityTypeBytes=function(){this._inputFormatter=f.formatInputBytes;this._outputFormatter=f.formatOutputBytes;};SolidityTypeBytes.prototype=new SolidityType({});SolidityTypeBytes.prototype.constructor=SolidityTypeBytes;SolidityTypeBytes.prototype.isType=function(name){return!!name.match(/^bytes([0-9]{1,})(\[([0-9]*)\])*$/);};SolidityTypeBytes.prototype.staticPartLength=function(name){var matches=name.match(/^bytes([0-9]*)/);var size=parseInt(matches[1]);return size*this.staticArrayLength(name);};module.exports=SolidityTypeBytes;}),(function(module,exports,__webpack_require__){var f=__webpack_require__(6);var SolidityType=__webpack_require__(10);var SolidityTypeDynamicBytes=function(){this._inputFormatter=f.formatInputDynamicBytes;this._outputFormatter=f.formatOutputDynamicBytes;};SolidityTypeDynamicBytes.prototype=new SolidityType({});SolidityTypeDynamicBytes.prototype.constructor=SolidityTypeDynamicBytes;SolidityTypeDynamicBytes.prototype.isType=function(name){return!!name.match(/^bytes(\[([0-9]*)\])*$/);};SolidityTypeDynamicBytes.prototype.staticPartLength=function(name){return 32*this.staticArrayLength(name);};SolidityTypeDynamicBytes.prototype.isDynamicType=function(){return true;};module.exports=SolidityTypeDynamicBytes;}),(function(module,exports,__webpack_require__){var f=__webpack_require__(6);var SolidityType=__webpack_require__(10);var SolidityTypeInt=function(){this._inputFormatter=f.formatInputInt;this._outputFormatter=f.formatOutputInt;};SolidityTypeInt.prototype=new SolidityType({});SolidityTypeInt.prototype.constructor=SolidityTypeInt;SolidityTypeInt.prototype.isType=function(name){return!!name.match(/^int([0-9]*)?(\[([0-9]*)\])*$/);};SolidityTypeInt.prototype.staticPartLength=function(name){return 32*this.staticArrayLength(name);};module.exports=SolidityTypeInt;}),(function(module,exports,__webpack_require__){var f=__webpack_require__(6);var SolidityType=__webpack_require__(10);var SolidityTypeReal=function(){this._inputFormatter=f.formatInputReal;this._outputFormatter=f.formatOutputReal;};SolidityTypeReal.prototype=new SolidityType({});SolidityTypeReal.prototype.constructor=SolidityTypeReal;SolidityTypeReal.prototype.isType=function(name){return!!name.match(/real([0-9]*)?(\[([0-9]*)\])?/);};SolidityTypeReal.prototype.staticPartLength=function(name){return 32*this.staticArrayLength(name);};module.exports=SolidityTypeReal;}),(function(module,exports,__webpack_require__){var f=__webpack_require__(6);var SolidityType=__webpack_require__(10);var SolidityTypeString=function(){this._inputFormatter=f.formatInputString;this._outputFormatter=f.formatOutputString;};SolidityTypeString.prototype=new SolidityType({});SolidityTypeString.prototype.constructor=SolidityTypeString;SolidityTypeString.prototype.isType=function(name){return!!name.match(/^string(\[([0-9]*)\])*$/);};SolidityTypeString.prototype.staticPartLength=function(name){return 32*this.staticArrayLength(name);};SolidityTypeString.prototype.isDynamicType=function(){return true;};module.exports=SolidityTypeString;}),(function(module,exports,__webpack_require__){var f=__webpack_require__(6);var SolidityType=__webpack_require__(10);var SolidityTypeUInt=function(){this._inputFormatter=f.formatInputInt;this._outputFormatter=f.formatOutputUInt;};SolidityTypeUInt.prototype=new SolidityType({});SolidityTypeUInt.prototype.constructor=SolidityTypeUInt;SolidityTypeUInt.prototype.isType=function(name){return!!name.match(/^uint([0-9]*)?(\[([0-9]*)\])*$/);};SolidityTypeUInt.prototype.staticPartLength=function(name){return 32*this.staticArrayLength(name);};module.exports=SolidityTypeUInt;}),(function(module,exports,__webpack_require__){var f=__webpack_require__(6);var SolidityType=__webpack_require__(10);var SolidityTypeUReal=function(){this._inputFormatter=f.formatInputReal;this._outputFormatter=f.formatOutputUReal;};SolidityTypeUReal.prototype=new SolidityType({});SolidityTypeUReal.prototype.constructor=SolidityTypeUReal;SolidityTypeUReal.prototype.isType=function(name){return!!name.match(/^ureal([0-9]*)?(\[([0-9]*)\])*$/);};SolidityTypeUReal.prototype.staticPartLength=function(name){return 32*this.staticArrayLength(name);};module.exports=SolidityTypeUReal;}),(function(module,exports,__webpack_require__){"use strict";if(typeof XMLHttpRequest==='undefined'){exports.XMLHttpRequest={};}else{exports.XMLHttpRequest=XMLHttpRequest;}}),(function(module,exports){module.exports={"version":"0.16.0"}}),(function(module,exports,__webpack_require__){var RequestManager=__webpack_require__(179);var Iban=__webpack_require__(41);var Eth=__webpack_require__(174);var DB=__webpack_require__(173);var Shh=__webpack_require__(177);var Net=__webpack_require__(175);var Personal=__webpack_require__(176);var Settings=__webpack_require__(180);var version=__webpack_require__(164);var utils=__webpack_require__(3);var sha3=__webpack_require__(26);var extend=__webpack_require__(169);var Batch=__webpack_require__(167);var Property=__webpack_require__(28);var HttpProvider=__webpack_require__(171);var IpcProvider=__webpack_require__(172);function Web3(provider){this._requestManager=new RequestManager(provider);this.currentProvider=provider;this.eth=new Eth(this);this.db=new DB(this);this.shh=new Shh(this);this.net=new Net(this);this.personal=new Personal(this);this.settings=new Settings();this.version={api:version.version};this.providers={HttpProvider:HttpProvider,IpcProvider:IpcProvider};this._extend=extend(this);this._extend({properties:properties()});}
Web3.providers={HttpProvider:HttpProvider,IpcProvider:IpcProvider};Web3.prototype.setProvider=function(provider){this._requestManager.setProvider(provider);this.currentProvider=provider;};Web3.prototype.reset=function(keepIsSyncing){this._requestManager.reset(keepIsSyncing);this.settings=new Settings();};Web3.prototype.toHex=utils.toHex;Web3.prototype.toAscii=utils.toAscii;Web3.prototype.toUtf8=utils.toUtf8;Web3.prototype.fromAscii=utils.fromAscii;Web3.prototype.fromUtf8=utils.fromUtf8;Web3.prototype.toDecimal=utils.toDecimal;Web3.prototype.fromDecimal=utils.fromDecimal;Web3.prototype.toBigNumber=utils.toBigNumber;Web3.prototype.toWei=utils.toWei;Web3.prototype.fromWei=utils.fromWei;Web3.prototype.isAddress=utils.isAddress;Web3.prototype.isChecksumAddress=utils.isChecksumAddress;Web3.prototype.toChecksumAddress=utils.toChecksumAddress;Web3.prototype.isIBAN=utils.isIBAN;Web3.prototype.sha3=function(string,options){return'0x'+sha3(string,options);};Web3.prototype.fromICAP=function(icap){var iban=new Iban(icap);return iban.address();};var properties=function(){return[new Property({name:'version.node',getter:'web3_clientVersion'}),new Property({name:'version.network',getter:'net_version',inputFormatter:utils.toDecimal}),new Property({name:'version.ethereum',getter:'eth_protocolVersion',inputFormatter:utils.toDecimal}),new Property({name:'version.whisper',getter:'shh_version',inputFormatter:utils.toDecimal})];};Web3.prototype.isConnected=function(){return(this.currentProvider&&this.currentProvider.isConnected());};Web3.prototype.createBatch=function(){return new Batch(this);};module.exports=Web3;}),(function(module,exports,__webpack_require__){var sha3=__webpack_require__(26);var SolidityEvent=__webpack_require__(64);var formatters=__webpack_require__(11);var utils=__webpack_require__(3);var Filter=__webpack_require__(40);var watches=__webpack_require__(42);var AllSolidityEvents=function(requestManager,json,address){this._requestManager=requestManager;this._json=json;this._address=address;};AllSolidityEvents.prototype.encode=function(options){options=options||{};var result={};['fromBlock','toBlock'].filter(function(f){return options[f]!==undefined;}).forEach(function(f){result[f]=formatters.inputBlockNumberFormatter(options[f]);});result.address=this._address;return result;};AllSolidityEvents.prototype.decode=function(data){data.data=data.data||'';data.topics=data.topics||[];var eventTopic=data.topics[0].slice(2);var match=this._json.filter(function(j){return eventTopic===sha3(utils.transformToFullName(j));})[0];if(!match){console.warn('cannot find event for log');return data;}
var event=new SolidityEvent(this._requestManager,match,this._address);return event.decode(data);};AllSolidityEvents.prototype.execute=function(options,callback){if(utils.isFunction(arguments[arguments.length-1])){callback=arguments[arguments.length-1];if(arguments.length===1)
options=null;}
var o=this.encode(options);var formatter=this.decode.bind(this);return new Filter(this._requestManager,o,watches.eth(),formatter,callback);};AllSolidityEvents.prototype.attachToContract=function(contract){var execute=this.execute.bind(this);contract.allEvents=execute;};module.exports=AllSolidityEvents;}),(function(module,exports,__webpack_require__){var Jsonrpc=__webpack_require__(65);var errors=__webpack_require__(27);var Batch=function(web3){this.requestManager=web3._requestManager;this.requests=[];};Batch.prototype.add=function(request){this.requests.push(request);};Batch.prototype.execute=function(){var requests=this.requests;this.requestManager.sendBatch(requests,function(err,results){results=results||[];requests.map(function(request,index){return results[index]||{};}).forEach(function(result,index){if(requests[index].callback){if(!Jsonrpc.getInstance().isValidResponse(result)){return requests[index].callback(errors.InvalidResponse(result));}
requests[index].callback(null,(requests[index].format?requests[index].format(result.result):result.result));}});});};module.exports=Batch;}),(function(module,exports,__webpack_require__){var utils=__webpack_require__(3);var coder=__webpack_require__(52);var SolidityEvent=__webpack_require__(64);var SolidityFunction=__webpack_require__(170);var AllEvents=__webpack_require__(166);var encodeConstructorParams=function(abi,params){return abi.filter(function(json){return json.type==='constructor'&&json.inputs.length===params.length;}).map(function(json){return json.inputs.map(function(input){return input.type;});}).map(function(types){return coder.encodeParams(types,params);})[0]||'';};var addFunctionsToContract=function(contract){contract.abi.filter(function(json){return json.type==='function';}).map(function(json){return new SolidityFunction(contract._eth,json,contract.address);}).forEach(function(f){f.attachToContract(contract);});};var addEventsToContract=function(contract){var events=contract.abi.filter(function(json){return json.type==='event';});var All=new AllEvents(contract._eth._requestManager,events,contract.address);All.attachToContract(contract);events.map(function(json){return new SolidityEvent(contract._eth._requestManager,json,contract.address);}).forEach(function(e){e.attachToContract(contract);});};var checkForContractAddress=function(contract,callback){var count=0,callbackFired=false;var filter=contract._eth.filter('latest',function(e){if(!e&&!callbackFired){count++;if(count>50){filter.stopWatching();callbackFired=true;if(callback)
callback(new Error('Contract transaction couldn\'t be found after 50 blocks'));else
throw new Error('Contract transaction couldn\'t be found after 50 blocks');}else{contract._eth.getTransactionReceipt(contract.transactionHash,function(e,receipt){if(receipt&&!callbackFired){contract._eth.getCode(receipt.contractAddress,function(e,code){if(callbackFired||!code)
return;filter.stopWatching();callbackFired=true;if(code.length>2){contract.address=receipt.contractAddress;addFunctionsToContract(contract);addEventsToContract(contract);if(callback)
callback(null,contract);}else{if(callback)
callback(new Error('The contract code couldn\'t be stored, please check your gas amount.'));else
throw new Error('The contract code couldn\'t be stored, please check your gas amount.');}});}});}}});};var ContractFactory=function(eth,abi){this.eth=eth;this.abi=abi;this.new=function(){var contract=new Contract(this.eth,this.abi);var options={};var callback;var args=Array.prototype.slice.call(arguments);if(utils.isFunction(args[args.length-1])){callback=args.pop();}
var last=args[args.length-1];if(utils.isObject(last)&&!utils.isArray(last)){options=args.pop();}
var bytes=encodeConstructorParams(this.abi,args);options.data+=bytes;if(callback){this.eth.sendTransaction(options,function(err,hash){if(err){callback(err);}else{contract.transactionHash=hash;callback(null,contract);checkForContractAddress(contract,callback);}});}else{var hash=this.eth.sendTransaction(options);contract.transactionHash=hash;checkForContractAddress(contract);}
return contract;};this.new.getData=this.getData.bind(this);};ContractFactory.prototype.at=function(address,callback){var contract=new Contract(this.eth,this.abi,address);addFunctionsToContract(contract);addEventsToContract(contract);if(callback){callback(null,contract);}
return contract;};ContractFactory.prototype.getData=function(){var options={};var args=Array.prototype.slice.call(arguments);var last=args[args.length-1];if(utils.isObject(last)&&!utils.isArray(last)){options=args.pop();}
var bytes=encodeConstructorParams(this.abi,args);options.data+=bytes;return options.data;};var Contract=function(eth,abi,address){this._eth=eth;this.transactionHash=null;this.address=address;this.abi=abi;};module.exports=ContractFactory;}),(function(module,exports,__webpack_require__){var formatters=__webpack_require__(11);var utils=__webpack_require__(3);var Method=__webpack_require__(20);var Property=__webpack_require__(28);var extend=function(web3){var ex=function(extension){var extendedObject;if(extension.property){if(!web3[extension.property]){web3[extension.property]={};}
extendedObject=web3[extension.property];}else{extendedObject=web3;}
if(extension.methods){extension.methods.forEach(function(method){method.attachToObject(extendedObject);method.setRequestManager(web3._requestManager);});}
if(extension.properties){extension.properties.forEach(function(property){property.attachToObject(extendedObject);property.setRequestManager(web3._requestManager);});}};ex.formatters=formatters;ex.utils=utils;ex.Method=Method;ex.Property=Property;return ex;};module.exports=extend;}),(function(module,exports,__webpack_require__){var coder=__webpack_require__(52);var utils=__webpack_require__(3);var formatters=__webpack_require__(11);var sha3=__webpack_require__(26);var SolidityFunction=function(eth,json,address){this._eth=eth;this._inputTypes=json.inputs.map(function(i){return i.type;});this._outputTypes=json.outputs.map(function(i){return i.type;});this._constant=json.constant;this._name=utils.transformToFullName(json);this._address=address;};SolidityFunction.prototype.extractCallback=function(args){if(utils.isFunction(args[args.length-1])){return args.pop();}};SolidityFunction.prototype.extractDefaultBlock=function(args){if(args.length>this._inputTypes.length&&!utils.isObject(args[args.length-1])){return formatters.inputDefaultBlockNumberFormatter(args.pop());}};SolidityFunction.prototype.toPayload=function(args){var options={};if(args.length>this._inputTypes.length&&utils.isObject(args[args.length-1])){options=args[args.length-1];}
options.to=this._address;options.data='0x'+this.signature()+coder.encodeParams(this._inputTypes,args);return options;};SolidityFunction.prototype.signature=function(){return sha3(this._name).slice(0,8);};SolidityFunction.prototype.unpackOutput=function(output){if(!output){return;}
output=output.length>=2?output.slice(2):output;var result=coder.decodeParams(this._outputTypes,output);return result.length===1?result[0]:result;};SolidityFunction.prototype.call=function(){var args=Array.prototype.slice.call(arguments).filter(function(a){return a!==undefined;});var callback=this.extractCallback(args);var defaultBlock=this.extractDefaultBlock(args);var payload=this.toPayload(args);if(!callback){var output=this._eth.call(payload,defaultBlock);return this.unpackOutput(output);}
var self=this;this._eth.call(payload,defaultBlock,function(error,output){callback(error,self.unpackOutput(output));});};SolidityFunction.prototype.sendTransaction=function(){var args=Array.prototype.slice.call(arguments).filter(function(a){return a!==undefined;});var callback=this.extractCallback(args);var payload=this.toPayload(args);if(!callback){return this._eth.sendTransaction(payload);}
this._eth.sendTransaction(payload,callback);};SolidityFunction.prototype.estimateGas=function(){var args=Array.prototype.slice.call(arguments);var callback=this.extractCallback(args);var payload=this.toPayload(args);if(!callback){return this._eth.estimateGas(payload);}
this._eth.estimateGas(payload,callback);};SolidityFunction.prototype.getData=function(){var args=Array.prototype.slice.call(arguments);var payload=this.toPayload(args);return payload.data;};SolidityFunction.prototype.displayName=function(){return utils.extractDisplayName(this._name);};SolidityFunction.prototype.typeName=function(){return utils.extractTypeName(this._name);};SolidityFunction.prototype.request=function(){var args=Array.prototype.slice.call(arguments);var callback=this.extractCallback(args);var payload=this.toPayload(args);var format=this.unpackOutput.bind(this);return{method:this._constant?'eth_call':'eth_sendTransaction',callback:callback,params:[payload],format:format};};SolidityFunction.prototype.execute=function(){var transaction=!this._constant;if(transaction){return this.sendTransaction.apply(this,Array.prototype.slice.call(arguments));}
return this.call.apply(this,Array.prototype.slice.call(arguments));};SolidityFunction.prototype.attachToContract=function(contract){var execute=this.execute.bind(this);execute.request=this.request.bind(this);execute.call=this.call.bind(this);execute.sendTransaction=this.sendTransaction.bind(this);execute.estimateGas=this.estimateGas.bind(this);execute.getData=this.getData.bind(this);var displayName=this.displayName();if(!contract[displayName]){contract[displayName]=execute;}
contract[displayName][this.typeName()]=execute;};module.exports=SolidityFunction;}),(function(module,exports,__webpack_require__){"use strict";var errors=__webpack_require__(27);var XMLHttpRequest;if(typeof Meteor!=='undefined'&&Meteor.isServer){XMLHttpRequest=Npm.require('xmlhttprequest').XMLHttpRequest;}else if(typeof window!=='undefined'&&window.XMLHttpRequest){XMLHttpRequest=window.XMLHttpRequest;}else{XMLHttpRequest=__webpack_require__(163).XMLHttpRequest;}
var HttpProvider=function(host){this.host=host||'http://localhost:8545';};HttpProvider.prototype.prepareRequest=function(async){var request=new XMLHttpRequest();request.open('POST',this.host,async);request.setRequestHeader('Content-Type','application/json');return request;};HttpProvider.prototype.send=function(payload){var request=this.prepareRequest(false);try{request.send(JSON.stringify(payload));}catch(error){throw errors.InvalidConnection(this.host);}
var result=request.responseText;try{result=JSON.parse(result);}catch(e){throw errors.InvalidResponse(request.responseText);}
return result;};HttpProvider.prototype.sendAsync=function(payload,callback){var request=this.prepareRequest(true);request.onreadystatechange=function(){if(request.readyState===4){var result=request.responseText;var error=null;try{result=JSON.parse(result);}catch(e){error=errors.InvalidResponse(request.responseText);}
callback(error,result);}};try{request.send(JSON.stringify(payload));}catch(error){callback(errors.InvalidConnection(this.host));}};HttpProvider.prototype.isConnected=function(){try{this.send({id:9999999999,jsonrpc:'2.0',method:'net_listening',params:[]});return true;}catch(e){return false;}};module.exports=HttpProvider;}),(function(module,exports,__webpack_require__){"use strict";var utils=__webpack_require__(3);var errors=__webpack_require__(27);var IpcProvider=function(path,net){var _this=this;this.responseCallbacks={};this.path=path;this.connection=net.connect({path:this.path});this.connection.on('error',function(e){console.error('IPC Connection Error',e);_this._timeout();});this.connection.on('end',function(){_this._timeout();});this.connection.on('data',function(data){_this._parseResponse(data.toString()).forEach(function(result){var id=null;if(utils.isArray(result)){result.forEach(function(load){if(_this.responseCallbacks[load.id])
id=load.id;});}else{id=result.id;}
if(_this.responseCallbacks[id]){_this.responseCallbacks[id](null,result);delete _this.responseCallbacks[id];}});});};IpcProvider.prototype._parseResponse=function(data){var _this=this,returnValues=[];var dechunkedData=data.replace(/\}[\n\r]?\{/g,'}|--|{').replace(/\}\][\n\r]?\[\{/g,'}]|--|[{').replace(/\}[\n\r]?\[\{/g,'}|--|[{').replace(/\}\][\n\r]?\{/g,'}]|--|{').split('|--|');dechunkedData.forEach(function(data){if(_this.lastChunk)
data=_this.lastChunk+data;var result=null;try{result=JSON.parse(data);}catch(e){_this.lastChunk=data;clearTimeout(_this.lastChunkTimeout);_this.lastChunkTimeout=setTimeout(function(){_this._timeout();throw errors.InvalidResponse(data);},1000*15);return;}
clearTimeout(_this.lastChunkTimeout);_this.lastChunk=null;if(result)
returnValues.push(result);});return returnValues;};IpcProvider.prototype._addResponseCallback=function(payload,callback){var id=payload.id||payload[0].id;var method=payload.method||payload[0].method;this.responseCallbacks[id]=callback;this.responseCallbacks[id].method=method;};IpcProvider.prototype._timeout=function(){for(var key in this.responseCallbacks){if(this.responseCallbacks.hasOwnProperty(key)){this.responseCallbacks[key](errors.InvalidConnection('on IPC'));delete this.responseCallbacks[key];}}};IpcProvider.prototype.isConnected=function(){var _this=this;if(!_this.connection.writable)
_this.connection.connect({path:_this.path});return!!this.connection.writable;};IpcProvider.prototype.send=function(payload){if(this.connection.writeSync){var result;if(!this.connection.writable)
this.connection.connect({path:this.path});var data=this.connection.writeSync(JSON.stringify(payload));try{result=JSON.parse(data);}catch(e){throw errors.InvalidResponse(data);}
return result;}else{throw new Error('You tried to send "'+payload.method+'" synchronously. Synchronous requests are not supported by the IPC provider.');}};IpcProvider.prototype.sendAsync=function(payload,callback){if(!this.connection.writable)
this.connection.connect({path:this.path});this.connection.write(JSON.stringify(payload));this._addResponseCallback(payload,callback);};module.exports=IpcProvider;}),(function(module,exports,__webpack_require__){var Method=__webpack_require__(20);var DB=function(web3){this._requestManager=web3._requestManager;var self=this;methods().forEach(function(method){method.attachToObject(self);method.setRequestManager(web3._requestManager);});};var methods=function(){var putString=new Method({name:'putString',call:'db_putString',params:3});var getString=new Method({name:'getString',call:'db_getString',params:2});var putHex=new Method({name:'putHex',call:'db_putHex',params:3});var getHex=new Method({name:'getHex',call:'db_getHex',params:2});return[putString,getString,putHex,getHex];};module.exports=DB;}),(function(module,exports,__webpack_require__){"use strict";var formatters=__webpack_require__(11);var utils=__webpack_require__(3);var Method=__webpack_require__(20);var Property=__webpack_require__(28);var c=__webpack_require__(39);var Contract=__webpack_require__(168);var watches=__webpack_require__(42);var Filter=__webpack_require__(40);var IsSyncing=__webpack_require__(181);var namereg=__webpack_require__(178);var Iban=__webpack_require__(41);var transfer=__webpack_require__(182);var blockCall=function(args){return(utils.isString(args[0])&&args[0].indexOf('0x')===0)?"eth_getBlockByHash":"eth_getBlockByNumber";};var transactionFromBlockCall=function(args){return(utils.isString(args[0])&&args[0].indexOf('0x')===0)?'eth_getTransactionByBlockHashAndIndex':'eth_getTransactionByBlockNumberAndIndex';};var uncleCall=function(args){return(utils.isString(args[0])&&args[0].indexOf('0x')===0)?'eth_getUncleByBlockHashAndIndex':'eth_getUncleByBlockNumberAndIndex';};var getBlockTransactionCountCall=function(args){return(utils.isString(args[0])&&args[0].indexOf('0x')===0)?'eth_getBlockTransactionCountByHash':'eth_getBlockTransactionCountByNumber';};var uncleCountCall=function(args){return(utils.isString(args[0])&&args[0].indexOf('0x')===0)?'eth_getUncleCountByBlockHash':'eth_getUncleCountByBlockNumber';};function Eth(web3){this._requestManager=web3._requestManager;var self=this;methods().forEach(function(method){method.attachToObject(self);method.setRequestManager(self._requestManager);});properties().forEach(function(p){p.attachToObject(self);p.setRequestManager(self._requestManager);});this.iban=Iban;this.sendIBANTransaction=transfer.bind(null,this);}
Object.defineProperty(Eth.prototype,'defaultBlock',{get:function(){return c.defaultBlock;},set:function(val){c.defaultBlock=val;return val;}});Object.defineProperty(Eth.prototype,'defaultAccount',{get:function(){return c.defaultAccount;},set:function(val){c.defaultAccount=val;return val;}});var methods=function(){var getBalance=new Method({name:'getBalance',call:'eth_getBalance',params:2,inputFormatter:[formatters.inputAddressFormatter,formatters.inputDefaultBlockNumberFormatter],outputFormatter:formatters.outputBigNumberFormatter});var getStorageAt=new Method({name:'getStorageAt',call:'eth_getStorageAt',params:3,inputFormatter:[null,utils.toHex,formatters.inputDefaultBlockNumberFormatter]});var getCode=new Method({name:'getCode',call:'eth_getCode',params:2,inputFormatter:[formatters.inputAddressFormatter,formatters.inputDefaultBlockNumberFormatter]});var getBlock=new Method({name:'getBlock',call:blockCall,params:2,inputFormatter:[formatters.inputBlockNumberFormatter,function(val){return!!val;}],outputFormatter:formatters.outputBlockFormatter});var getUncle=new Method({name:'getUncle',call:uncleCall,params:2,inputFormatter:[formatters.inputBlockNumberFormatter,utils.toHex],outputFormatter:formatters.outputBlockFormatter,});var getCompilers=new Method({name:'getCompilers',call:'eth_getCompilers',params:0});var getBlockTransactionCount=new Method({name:'getBlockTransactionCount',call:getBlockTransactionCountCall,params:1,inputFormatter:[formatters.inputBlockNumberFormatter],outputFormatter:utils.toDecimal});var getBlockUncleCount=new Method({name:'getBlockUncleCount',call:uncleCountCall,params:1,inputFormatter:[formatters.inputBlockNumberFormatter],outputFormatter:utils.toDecimal});var getTransaction=new Method({name:'getTransaction',call:'eth_getTransactionByHash',params:1,outputFormatter:formatters.outputTransactionFormatter});var getTransactionFromBlock=new Method({name:'getTransactionFromBlock',call:transactionFromBlockCall,params:2,inputFormatter:[formatters.inputBlockNumberFormatter,utils.toHex],outputFormatter:formatters.outputTransactionFormatter});var getTransactionReceipt=new Method({name:'getTransactionReceipt',call:'eth_getTransactionReceipt',params:1,outputFormatter:formatters.outputTransactionReceiptFormatter});var getTransactionCount=new Method({name:'getTransactionCount',call:'eth_getTransactionCount',params:2,inputFormatter:[null,formatters.inputDefaultBlockNumberFormatter],outputFormatter:utils.toDecimal});var sendRawTransaction=new Method({name:'sendRawTransaction',call:'eth_sendRawTransaction',params:1,inputFormatter:[null]});var sendTransaction=new Method({name:'sendTransaction',call:'eth_sendTransaction',params:1,inputFormatter:[formatters.inputTransactionFormatter]});var sign=new Method({name:'sign',call:'eth_sign',params:2,inputFormatter:[formatters.inputAddressFormatter,null]});var call=new Method({name:'call',call:'eth_call',params:2,inputFormatter:[formatters.inputCallFormatter,formatters.inputDefaultBlockNumberFormatter]});var estimateGas=new Method({name:'estimateGas',call:'eth_estimateGas',params:1,inputFormatter:[formatters.inputCallFormatter],outputFormatter:utils.toDecimal});var compileSolidity=new Method({name:'compile.solidity',call:'eth_compileSolidity',params:1});var compileLLL=new Method({name:'compile.lll',call:'eth_compileLLL',params:1});var compileSerpent=new Method({name:'compile.serpent',call:'eth_compileSerpent',params:1});var submitWork=new Method({name:'submitWork',call:'eth_submitWork',params:3});var getWork=new Method({name:'getWork',call:'eth_getWork',params:0});return[getBalance,getStorageAt,getCode,getBlock,getUncle,getCompilers,getBlockTransactionCount,getBlockUncleCount,getTransaction,getTransactionFromBlock,getTransactionReceipt,getTransactionCount,call,estimateGas,sendRawTransaction,sendTransaction,sign,compileSolidity,compileLLL,compileSerpent,submitWork,getWork];};var properties=function(){return[new Property({name:'coinbase',getter:'eth_coinbase'}),new Property({name:'mining',getter:'eth_mining'}),new Property({name:'hashrate',getter:'eth_hashrate',outputFormatter:utils.toDecimal}),new Property({name:'syncing',getter:'eth_syncing',outputFormatter:formatters.outputSyncingFormatter}),new Property({name:'gasPrice',getter:'eth_gasPrice',outputFormatter:formatters.outputBigNumberFormatter}),new Property({name:'accounts',getter:'eth_accounts'}),new Property({name:'blockNumber',getter:'eth_blockNumber',outputFormatter:utils.toDecimal})];};Eth.prototype.contract=function(abi){var factory=new Contract(this,abi);return factory;};Eth.prototype.filter=function(fil,callback){return new Filter(this._requestManager,fil,watches.eth(),formatters.outputLogFormatter,callback);};Eth.prototype.namereg=function(){return this.contract(namereg.global.abi).at(namereg.global.address);};Eth.prototype.icapNamereg=function(){return this.contract(namereg.icap.abi).at(namereg.icap.address);};Eth.prototype.isSyncing=function(callback){return new IsSyncing(this._requestManager,callback);};module.exports=Eth;}),(function(module,exports,__webpack_require__){var utils=__webpack_require__(3);var Property=__webpack_require__(28);var Net=function(web3){this._requestManager=web3._requestManager;var self=this;properties().forEach(function(p){p.attachToObject(self);p.setRequestManager(web3._requestManager);});};var properties=function(){return[new Property({name:'listening',getter:'net_listening'}),new Property({name:'peerCount',getter:'net_peerCount',outputFormatter:utils.toDecimal})];};module.exports=Net;}),(function(module,exports,__webpack_require__){"use strict";var Method=__webpack_require__(20);var Property=__webpack_require__(28);var formatters=__webpack_require__(11);function Personal(web3){this._requestManager=web3._requestManager;var self=this;methods().forEach(function(method){method.attachToObject(self);method.setRequestManager(self._requestManager);});properties().forEach(function(p){p.attachToObject(self);p.setRequestManager(self._requestManager);});}
var methods=function(){var newAccount=new Method({name:'newAccount',call:'personal_newAccount',params:1,inputFormatter:[null]});var unlockAccount=new Method({name:'unlockAccount',call:'personal_unlockAccount',params:3,inputFormatter:[formatters.inputAddressFormatter,null,null]});var lockAccount=new Method({name:'lockAccount',call:'personal_lockAccount',params:1,inputFormatter:[formatters.inputAddressFormatter]});return[newAccount,unlockAccount,lockAccount];};var properties=function(){return[new Property({name:'listAccounts',getter:'personal_listAccounts'})];};module.exports=Personal;}),(function(module,exports,__webpack_require__){var Method=__webpack_require__(20);var formatters=__webpack_require__(11);var Filter=__webpack_require__(40);var watches=__webpack_require__(42);var Shh=function(web3){this._requestManager=web3._requestManager;var self=this;methods().forEach(function(method){method.attachToObject(self);method.setRequestManager(self._requestManager);});};Shh.prototype.filter=function(fil,callback){return new Filter(this._requestManager,fil,watches.shh(),formatters.outputPostFormatter,callback);};var methods=function(){var post=new Method({name:'post',call:'shh_post',params:1,inputFormatter:[formatters.inputPostFormatter]});var newIdentity=new Method({name:'newIdentity',call:'shh_newIdentity',params:0});var hasIdentity=new Method({name:'hasIdentity',call:'shh_hasIdentity',params:1});var newGroup=new Method({name:'newGroup',call:'shh_newGroup',params:0});var addToGroup=new Method({name:'addToGroup',call:'shh_addToGroup',params:0});return[post,newIdentity,hasIdentity,newGroup,addToGroup];};module.exports=Shh;}),(function(module,exports,__webpack_require__){var globalRegistrarAbi=__webpack_require__(151);var icapRegistrarAbi=__webpack_require__(152);var globalNameregAddress='0xc6d9d2cd449a754c494264e1809c50e34d64562b';var icapNameregAddress='0xa1a111bc074c9cfa781f0c38e63bd51c91b8af00';module.exports={global:{abi:globalRegistrarAbi,address:globalNameregAddress},icap:{abi:icapRegistrarAbi,address:icapNameregAddress}};}),(function(module,exports,__webpack_require__){var Jsonrpc=__webpack_require__(65);var utils=__webpack_require__(3);var c=__webpack_require__(39);var errors=__webpack_require__(27);var RequestManager=function(provider){this.provider=provider;this.polls={};this.timeout=null;};RequestManager.prototype.send=function(data){if(!this.provider){console.error(errors.InvalidProvider());return null;}
var payload=Jsonrpc.getInstance().toPayload(data.method,data.params);var result=this.provider.send(payload);if(!Jsonrpc.getInstance().isValidResponse(result)){throw errors.InvalidResponse(result);}
return result.result;};RequestManager.prototype.sendAsync=function(data,callback){if(!this.provider){return callback(errors.InvalidProvider());}
var payload=Jsonrpc.getInstance().toPayload(data.method,data.params);this.provider.sendAsync(payload,function(err,result){if(err){return callback(err);}
if(!Jsonrpc.getInstance().isValidResponse(result)){return callback(errors.InvalidResponse(result));}
callback(null,result.result);});};RequestManager.prototype.sendBatch=function(data,callback){if(!this.provider){return callback(errors.InvalidProvider());}
var payload=Jsonrpc.getInstance().toBatchPayload(data);this.provider.sendAsync(payload,function(err,results){if(err){return callback(err);}
if(!utils.isArray(results)){return callback(errors.InvalidResponse(results));}
callback(err,results);});};RequestManager.prototype.setProvider=function(p){this.provider=p;};RequestManager.prototype.startPolling=function(data,pollId,callback,uninstall){this.polls[pollId]={data:data,id:pollId,callback:callback,uninstall:uninstall};if(!this.timeout){this.poll();}};RequestManager.prototype.stopPolling=function(pollId){delete this.polls[pollId];if(Object.keys(this.polls).length===0&&this.timeout){clearTimeout(this.timeout);this.timeout=null;}};RequestManager.prototype.reset=function(keepIsSyncing){for(var key in this.polls){if(!keepIsSyncing||key.indexOf('syncPoll_')===-1){this.polls[key].uninstall();delete this.polls[key];}}
if(Object.keys(this.polls).length===0&&this.timeout){clearTimeout(this.timeout);this.timeout=null;}};RequestManager.prototype.poll=function(){this.timeout=setTimeout(this.poll.bind(this),c.ETH_POLLING_TIMEOUT);if(Object.keys(this.polls).length===0){return;}
if(!this.provider){console.error(errors.InvalidProvider());return;}
var pollsData=[];var pollsIds=[];for(var key in this.polls){pollsData.push(this.polls[key].data);pollsIds.push(key);}
if(pollsData.length===0){return;}
var payload=Jsonrpc.getInstance().toBatchPayload(pollsData);var pollsIdMap={};payload.forEach(function(load,index){pollsIdMap[load.id]=pollsIds[index];});var self=this;this.provider.sendAsync(payload,function(error,results){if(error){return;}
if(!utils.isArray(results)){throw errors.InvalidResponse(results);}
results.map(function(result){var id=pollsIdMap[result.id];if(self.polls[id]){result.callback=self.polls[id].callback;return result;}else
return false;}).filter(function(result){return!!result;}).filter(function(result){var valid=Jsonrpc.getInstance().isValidResponse(result);if(!valid){result.callback(errors.InvalidResponse(result));}
return valid;}).forEach(function(result){result.callback(null,result.result);});});};module.exports=RequestManager;}),(function(module,exports){var Settings=function(){this.defaultBlock='latest';this.defaultAccount=undefined;};module.exports=Settings;}),(function(module,exports,__webpack_require__){var formatters=__webpack_require__(11);var utils=__webpack_require__(3);var count=1;var pollSyncing=function(self){var onMessage=function(error,sync){if(error){return self.callbacks.forEach(function(callback){callback(error);});}
if(utils.isObject(sync)&&sync.startingBlock)
sync=formatters.outputSyncingFormatter(sync);self.callbacks.forEach(function(callback){if(self.lastSyncState!==sync){if(!self.lastSyncState&&utils.isObject(sync))
callback(null,true);setTimeout(function(){callback(null,sync);},0);self.lastSyncState=sync;}});};self.requestManager.startPolling({method:'eth_syncing',params:[],},self.pollId,onMessage,self.stopWatching.bind(self));};var IsSyncing=function(requestManager,callback){this.requestManager=requestManager;this.pollId='syncPoll_'+count++;this.callbacks=[];this.addCallback(callback);this.lastSyncState=false;pollSyncing(this);return this;};IsSyncing.prototype.addCallback=function(callback){if(callback)
this.callbacks.push(callback);return this;};IsSyncing.prototype.stopWatching=function(){this.requestManager.stopPolling(this.pollId);this.callbacks=[];};module.exports=IsSyncing;}),(function(module,exports,__webpack_require__){var Iban=__webpack_require__(41);var exchangeAbi=__webpack_require__(153);var transfer=function(eth,from,to,value,callback){var iban=new Iban(to);if(!iban.isValid()){throw new Error('invalid iban address');}
if(iban.isDirect()){return transferToAddress(eth,from,iban.address(),value,callback);}
if(!callback){var address=eth.icapNamereg().addr(iban.institution());return deposit(eth,from,address,value,iban.client());}
eth.icapNamereg().addr(iban.institution(),function(err,address){return deposit(eth,from,address,value,iban.client(),callback);});};var transferToAddress=function(eth,from,to,value,callback){return eth.sendTransaction({address:to,from:from,value:value},callback);};var deposit=function(eth,from,to,value,client,callback){var abi=exchangeAbi;return eth.contract(abi).at(to).deposit(client,{from:from,value:value},callback);};module.exports=transfer;}),(function(module,exports){module.exports=[{"constant":true,"inputs":[{"name":"_owner","type":"address"}],"name":"name","outputs":[{"name":"o_name","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"owner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"content","outputs":[{"name":"","type":"bytes32"}],"type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"addr","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"}],"name":"reserve","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"subRegistrar","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_newOwner","type":"address"}],"name":"transfer","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_registrar","type":"address"}],"name":"setSubRegistrar","outputs":[],"type":"function"},{"constant":false,"inputs":[],"name":"Registrar","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_a","type":"address"},{"name":"_primary","type":"bool"}],"name":"setAddress","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_content","type":"bytes32"}],"name":"setContent","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"}],"name":"disown","outputs":[],"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_name","type":"bytes32"},{"indexed":false,"name":"_winner","type":"address"}],"name":"AuctionEnded","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"_name","type":"bytes32"},{"indexed":false,"name":"_bidder","type":"address"},{"indexed":false,"name":"_value","type":"uint256"}],"name":"NewBid","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"name","type":"bytes32"}],"name":"Changed","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"name","type":"bytes32"},{"indexed":true,"name":"addr","type":"address"}],"name":"PrimaryChanged","type":"event"}]}),(function(module,exports){module.exports=[{"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"owner","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_refund","type":"address"}],"name":"disown","outputs":[],"type":"function"},{"constant":true,"inputs":[{"name":"_name","type":"bytes32"}],"name":"addr","outputs":[{"name":"","type":"address"}],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"}],"name":"reserve","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_newOwner","type":"address"}],"name":"transfer","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"_name","type":"bytes32"},{"name":"_a","type":"address"}],"name":"setAddr","outputs":[],"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"name","type":"bytes32"}],"name":"Changed","type":"event"}]}),(function(module,exports){module.exports=[{"constant":false,"inputs":[{"name":"from","type":"bytes32"},{"name":"to","type":"address"},{"name":"value","type":"uint256"}],"name":"transfer","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"from","type":"bytes32"},{"name":"to","type":"address"},{"name":"indirectId","type":"bytes32"},{"name":"value","type":"uint256"}],"name":"icapTransfer","outputs":[],"type":"function"},{"constant":false,"inputs":[{"name":"to","type":"bytes32"}],"name":"deposit","outputs":[],"payable":true,"type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"AnonymousDeposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"bytes32"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Deposit","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"bytes32"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"bytes32"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"indirectId","type":"bytes32"},{"indexed":false,"name":"value","type":"uint256"}],"name":"IcapTransfer","type":"event"}]}),(function(module,exports,__webpack_require__){var f=__webpack_require__(7);var SolidityType=__webpack_require__(12);var SolidityTypeAddress=function(){this._inputFormatter=f.formatInputInt;this._outputFormatter=f.formatOutputAddress;};SolidityTypeAddress.prototype=new SolidityType({});SolidityTypeAddress.prototype.constructor=SolidityTypeAddress;SolidityTypeAddress.prototype.isType=function(name){return!!name.match(/address(\[([0-9]*)\])?/);};module.exports=SolidityTypeAddress;}),(function(module,exports,__webpack_require__){var f=__webpack_require__(7);var SolidityType=__webpack_require__(12);var SolidityTypeBool=function(){this._inputFormatter=f.formatInputBool;this._outputFormatter=f.formatOutputBool;};SolidityTypeBool.prototype=new SolidityType({});SolidityTypeBool.prototype.constructor=SolidityTypeBool;SolidityTypeBool.prototype.isType=function(name){return!!name.match(/^bool(\[([0-9]*)\])*$/);};module.exports=SolidityTypeBool;}),(function(module,exports,__webpack_require__){var f=__webpack_require__(7);var SolidityType=__webpack_require__(12);var SolidityTypeBytes=function(){this._inputFormatter=f.formatInputBytes;this._outputFormatter=f.formatOutputBytes;};SolidityTypeBytes.prototype=new SolidityType({});SolidityTypeBytes.prototype.constructor=SolidityTypeBytes;SolidityTypeBytes.prototype.isType=function(name){return!!name.match(/^bytes([0-9]{1,})(\[([0-9]*)\])*$/);};module.exports=SolidityTypeBytes;}),(function(module,exports,__webpack_require__){var f=__webpack_require__(7);var SolidityType=__webpack_require__(12);var SolidityTypeDynamicBytes=function(){this._inputFormatter=f.formatInputDynamicBytes;this._outputFormatter=f.formatOutputDynamicBytes;};SolidityTypeDynamicBytes.prototype=new SolidityType({});SolidityTypeDynamicBytes.prototype.constructor=SolidityTypeDynamicBytes;SolidityTypeDynamicBytes.prototype.isType=function(name){return!!name.match(/^bytes(\[([0-9]*)\])*$/);};SolidityTypeDynamicBytes.prototype.isDynamicType=function(){return true;};module.exports=SolidityTypeDynamicBytes;}),(function(module,exports,__webpack_require__){var f=__webpack_require__(7);var SolidityType=__webpack_require__(12);var SolidityTypeInt=function(){this._inputFormatter=f.formatInputInt;this._outputFormatter=f.formatOutputInt;};SolidityTypeInt.prototype=new SolidityType({});SolidityTypeInt.prototype.constructor=SolidityTypeInt;SolidityTypeInt.prototype.isType=function(name){return!!name.match(/^int([0-9]*)?(\[([0-9]*)\])*$/);};module.exports=SolidityTypeInt;}),(function(module,exports,__webpack_require__){var f=__webpack_require__(7);var SolidityType=__webpack_require__(12);var SolidityTypeReal=function(){this._inputFormatter=f.formatInputReal;this._outputFormatter=f.formatOutputReal;};SolidityTypeReal.prototype=new SolidityType({});SolidityTypeReal.prototype.constructor=SolidityTypeReal;SolidityTypeReal.prototype.isType=function(name){return!!name.match(/real([0-9]*)?(\[([0-9]*)\])?/);};module.exports=SolidityTypeReal;}),(function(module,exports,__webpack_require__){var f=__webpack_require__(7);var SolidityType=__webpack_require__(12);var SolidityTypeString=function(){this._inputFormatter=f.formatInputString;this._outputFormatter=f.formatOutputString;};SolidityTypeString.prototype=new SolidityType({});SolidityTypeString.prototype.constructor=SolidityTypeString;SolidityTypeString.prototype.isType=function(name){return!!name.match(/^string(\[([0-9]*)\])*$/);};SolidityTypeString.prototype.isDynamicType=function(){return true;};module.exports=SolidityTypeString;}),(function(module,exports,__webpack_require__){var f=__webpack_require__(7);var SolidityType=__webpack_require__(12);var SolidityTypeUInt=function(){this._inputFormatter=f.formatInputInt;this._outputFormatter=f.formatOutputUInt;};SolidityTypeUInt.prototype=new SolidityType({});SolidityTypeUInt.prototype.constructor=SolidityTypeUInt;SolidityTypeUInt.prototype.isType=function(name){return!!name.match(/^uint([0-9]*)?(\[([0-9]*)\])*$/);};module.exports=SolidityTypeUInt;}),(function(module,exports,__webpack_require__){var f=__webpack_require__(7);var SolidityType=__webpack_require__(12);var SolidityTypeUReal=function(){this._inputFormatter=f.formatInputReal;this._outputFormatter=f.formatOutputUReal;};SolidityTypeUReal.prototype=new SolidityType({});SolidityTypeUReal.prototype.constructor=SolidityTypeUReal;SolidityTypeUReal.prototype.isType=function(name){return!!name.match(/^ureal([0-9]*)?(\[([0-9]*)\])*$/);};module.exports=SolidityTypeUReal;}),(function(module,exports,__webpack_require__){"use strict";if(typeof XMLHttpRequest==='undefined'){exports.XMLHttpRequest={};}else{exports.XMLHttpRequest=XMLHttpRequest;}}),(function(module,exports){module.exports={"version":"0.20.6"}}),(function(module,exports,__webpack_require__){var RequestManager=__webpack_require__(212);var Iban=__webpack_require__(45);var Eth=__webpack_require__(206);var DB=__webpack_require__(205);var Shh=__webpack_require__(209);var Net=__webpack_require__(207);var Personal=__webpack_require__(208);var Swarm=__webpack_require__(210);var Settings=__webpack_require__(213);var version=__webpack_require__(196);var utils=__webpack_require__(4);var sha3=__webpack_require__(29);var extend=__webpack_require__(201);var Batch=__webpack_require__(199);var Property=__webpack_require__(22);var HttpProvider=__webpack_require__(203);var IpcProvider=__webpack_require__(204);var BigNumber=__webpack_require__(30);function Web3(provider){this._requestManager=new RequestManager(provider);this.currentProvider=provider;this.eth=new Eth(this);this.db=new DB(this);this.shh=new Shh(this);this.net=new Net(this);this.personal=new Personal(this);this.bzz=new Swarm(this);this.settings=new Settings();this.version={api:version.version};this.providers={HttpProvider:HttpProvider,IpcProvider:IpcProvider};this._extend=extend(this);this._extend({properties:properties()});}
Web3.providers={HttpProvider:HttpProvider,IpcProvider:IpcProvider};Web3.prototype.setProvider=function(provider){this._requestManager.setProvider(provider);this.currentProvider=provider;};Web3.prototype.reset=function(keepIsSyncing){this._requestManager.reset(keepIsSyncing);this.settings=new Settings();};Web3.prototype.BigNumber=BigNumber;Web3.prototype.toHex=utils.toHex;Web3.prototype.toAscii=utils.toAscii;Web3.prototype.toUtf8=utils.toUtf8;Web3.prototype.fromAscii=utils.fromAscii;Web3.prototype.fromUtf8=utils.fromUtf8;Web3.prototype.toDecimal=utils.toDecimal;Web3.prototype.fromDecimal=utils.fromDecimal;Web3.prototype.toBigNumber=utils.toBigNumber;Web3.prototype.toWei=utils.toWei;Web3.prototype.fromWei=utils.fromWei;Web3.prototype.isAddress=utils.isAddress;Web3.prototype.isChecksumAddress=utils.isChecksumAddress;Web3.prototype.toChecksumAddress=utils.toChecksumAddress;Web3.prototype.isIBAN=utils.isIBAN;Web3.prototype.padLeft=utils.padLeft;Web3.prototype.padRight=utils.padRight;Web3.prototype.sha3=function(string,options){return'0x'+sha3(string,options);};Web3.prototype.fromICAP=function(icap){var iban=new Iban(icap);return iban.address();};var properties=function(){return[new Property({name:'version.node',getter:'web3_clientVersion'}),new Property({name:'version.network',getter:'net_version',inputFormatter:utils.toDecimal}),new Property({name:'version.ethereum',getter:'eth_protocolVersion',inputFormatter:utils.toDecimal}),new Property({name:'version.whisper',getter:'shh_version',inputFormatter:utils.toDecimal})];};Web3.prototype.isConnected=function(){return(this.currentProvider&&this.currentProvider.isConnected());};Web3.prototype.createBatch=function(){return new Batch(this);};module.exports=Web3;}),(function(module,exports,__webpack_require__){var sha3=__webpack_require__(29);var SolidityEvent=__webpack_require__(67);var formatters=__webpack_require__(13);var utils=__webpack_require__(4);var Filter=__webpack_require__(44);var watches=__webpack_require__(46);var AllSolidityEvents=function(requestManager,json,address){this._requestManager=requestManager;this._json=json;this._address=address;};AllSolidityEvents.prototype.encode=function(options){options=options||{};var result={};['fromBlock','toBlock'].filter(function(f){return options[f]!==undefined;}).forEach(function(f){result[f]=formatters.inputBlockNumberFormatter(options[f]);});result.address=this._address;return result;};AllSolidityEvents.prototype.decode=function(data){data.data=data.data||'';var eventTopic=(utils.isArray(data.topics)&&utils.isString(data.topics[0]))?data.topics[0].slice(2):'';var match=this._json.filter(function(j){return eventTopic===sha3(utils.transformToFullName(j));})[0];if(!match){return formatters.outputLogFormatter(data);}
var event=new SolidityEvent(this._requestManager,match,this._address);return event.decode(data);};AllSolidityEvents.prototype.execute=function(options,callback){if(utils.isFunction(arguments[arguments.length-1])){callback=arguments[arguments.length-1];if(arguments.length===1)
options=null;}
var o=this.encode(options);var formatter=this.decode.bind(this);return new Filter(o,'eth',this._requestManager,watches.eth(),formatter,callback);};AllSolidityEvents.prototype.attachToContract=function(contract){var execute=this.execute.bind(this);contract.allEvents=execute;};module.exports=AllSolidityEvents;}),(function(module,exports,__webpack_require__){var Jsonrpc=__webpack_require__(68);var errors=__webpack_require__(21);var Batch=function(web3){this.requestManager=web3._requestManager;this.requests=[];};Batch.prototype.add=function(request){this.requests.push(request);};Batch.prototype.execute=function(){var requests=this.requests;this.requestManager.sendBatch(requests,function(err,results){results=results||[];requests.map(function(request,index){return results[index]||{};}).forEach(function(result,index){if(requests[index].callback){if(!Jsonrpc.isValidResponse(result)){return requests[index].callback(errors.InvalidResponse(result));}
requests[index].callback(null,(requests[index].format?requests[index].format(result.result):result.result));}});});};module.exports=Batch;}),(function(module,exports,__webpack_require__){var utils=__webpack_require__(4);var coder=__webpack_require__(54);var SolidityEvent=__webpack_require__(67);var SolidityFunction=__webpack_require__(202);var AllEvents=__webpack_require__(198);var encodeConstructorParams=function(abi,params){return abi.filter(function(json){return json.type==='constructor'&&json.inputs.length===params.length;}).map(function(json){return json.inputs.map(function(input){return input.type;});}).map(function(types){return coder.encodeParams(types,params);})[0]||'';};var addFunctionsToContract=function(contract){contract.abi.filter(function(json){return json.type==='function';}).map(function(json){return new SolidityFunction(contract._eth,json,contract.address);}).forEach(function(f){f.attachToContract(contract);});};var addEventsToContract=function(contract){var events=contract.abi.filter(function(json){return json.type==='event';});var All=new AllEvents(contract._eth._requestManager,events,contract.address);All.attachToContract(contract);events.map(function(json){return new SolidityEvent(contract._eth._requestManager,json,contract.address);}).forEach(function(e){e.attachToContract(contract);});};var checkForContractAddress=function(contract,callback){var count=0,callbackFired=false;var filter=contract._eth.filter('latest',function(e){if(!e&&!callbackFired){count++;if(count>50){filter.stopWatching(function(){});callbackFired=true;if(callback)
callback(new Error('Contract transaction couldn\'t be found after 50 blocks'));else
throw new Error('Contract transaction couldn\'t be found after 50 blocks');}else{contract._eth.getTransactionReceipt(contract.transactionHash,function(e,receipt){if(receipt&&receipt.blockHash&&!callbackFired){contract._eth.getCode(receipt.contractAddress,function(e,code){if(callbackFired||!code)
return;filter.stopWatching(function(){});callbackFired=true;if(code.length>3){contract.address=receipt.contractAddress;addFunctionsToContract(contract);addEventsToContract(contract);if(callback)
callback(null,contract);}else{if(callback)
callback(new Error('The contract code couldn\'t be stored, please check your gas amount.'));else
throw new Error('The contract code couldn\'t be stored, please check your gas amount.');}});}});}}});};var ContractFactory=function(eth,abi){this.eth=eth;this.abi=abi;this.new=function(){var contract=new Contract(this.eth,this.abi);var options={};var callback;var args=Array.prototype.slice.call(arguments);if(utils.isFunction(args[args.length-1])){callback=args.pop();}
var last=args[args.length-1];if(utils.isObject(last)&&!utils.isArray(last)){options=args.pop();}
if(options.value>0){var constructorAbi=abi.filter(function(json){return json.type==='constructor'&&json.inputs.length===args.length;})[0]||{};if(!constructorAbi.payable){throw new Error('Cannot send value to non-payable constructor');}}
var bytes=encodeConstructorParams(this.abi,args);options.data+=bytes;if(callback){this.eth.sendTransaction(options,function(err,hash){if(err){callback(err);}else{contract.transactionHash=hash;callback(null,contract);checkForContractAddress(contract,callback);}});}else{var hash=this.eth.sendTransaction(options);contract.transactionHash=hash;checkForContractAddress(contract);}
return contract;};this.new.getData=this.getData.bind(this);};ContractFactory.prototype.at=function(address,callback){var contract=new Contract(this.eth,this.abi,address);addFunctionsToContract(contract);addEventsToContract(contract);if(callback){callback(null,contract);}
return contract;};ContractFactory.prototype.getData=function(){var options={};var args=Array.prototype.slice.call(arguments);var last=args[args.length-1];if(utils.isObject(last)&&!utils.isArray(last)){options=args.pop();}
var bytes=encodeConstructorParams(this.abi,args);options.data+=bytes;return options.data;};var Contract=function(eth,abi,address){this._eth=eth;this.transactionHash=null;this.address=address;this.abi=abi;};module.exports=ContractFactory;}),(function(module,exports,__webpack_require__){var formatters=__webpack_require__(13);var utils=__webpack_require__(4);var Method=__webpack_require__(15);var Property=__webpack_require__(22);var extend=function(web3){var ex=function(extension){var extendedObject;if(extension.property){if(!web3[extension.property]){web3[extension.property]={};}
extendedObject=web3[extension.property];}else{extendedObject=web3;}
if(extension.methods){extension.methods.forEach(function(method){method.attachToObject(extendedObject);method.setRequestManager(web3._requestManager);});}
if(extension.properties){extension.properties.forEach(function(property){property.attachToObject(extendedObject);property.setRequestManager(web3._requestManager);});}};ex.formatters=formatters;ex.utils=utils;ex.Method=Method;ex.Property=Property;return ex;};module.exports=extend;}),(function(module,exports,__webpack_require__){var coder=__webpack_require__(54);var utils=__webpack_require__(4);var errors=__webpack_require__(21);var formatters=__webpack_require__(13);var sha3=__webpack_require__(29);var SolidityFunction=function(eth,json,address){this._eth=eth;this._inputTypes=json.inputs.map(function(i){return i.type;});this._outputTypes=json.outputs.map(function(i){return i.type;});this._constant=json.constant;this._payable=json.payable;this._name=utils.transformToFullName(json);this._address=address;};SolidityFunction.prototype.extractCallback=function(args){if(utils.isFunction(args[args.length-1])){return args.pop();}};SolidityFunction.prototype.extractDefaultBlock=function(args){if(args.length>this._inputTypes.length&&!utils.isObject(args[args.length-1])){return formatters.inputDefaultBlockNumberFormatter(args.pop());}};SolidityFunction.prototype.validateArgs=function(args){var inputArgs=args.filter(function(a){return!((utils.isObject(a)===true)&&(utils.isArray(a)===false)&&(utils.isBigNumber(a)===false));});if(inputArgs.length!==this._inputTypes.length){throw errors.InvalidNumberOfSolidityArgs();}};SolidityFunction.prototype.toPayload=function(args){var options={};if(args.length>this._inputTypes.length&&utils.isObject(args[args.length-1])){options=args[args.length-1];}
this.validateArgs(args);options.to=this._address;options.data='0x'+this.signature()+coder.encodeParams(this._inputTypes,args);return options;};SolidityFunction.prototype.signature=function(){return sha3(this._name).slice(0,8);};SolidityFunction.prototype.unpackOutput=function(output){if(!output){return;}
output=output.length>=2?output.slice(2):output;var result=coder.decodeParams(this._outputTypes,output);return result.length===1?result[0]:result;};SolidityFunction.prototype.call=function(){var args=Array.prototype.slice.call(arguments).filter(function(a){return a!==undefined;});var callback=this.extractCallback(args);var defaultBlock=this.extractDefaultBlock(args);var payload=this.toPayload(args);if(!callback){var output=this._eth.call(payload,defaultBlock);return this.unpackOutput(output);}
var self=this;this._eth.call(payload,defaultBlock,function(error,output){if(error)return callback(error,null);var unpacked=null;try{unpacked=self.unpackOutput(output);}
catch(e){error=e;}
callback(error,unpacked);});};SolidityFunction.prototype.sendTransaction=function(){var args=Array.prototype.slice.call(arguments).filter(function(a){return a!==undefined;});var callback=this.extractCallback(args);var payload=this.toPayload(args);if(payload.value>0&&!this._payable){throw new Error('Cannot send value to non-payable function');}
if(!callback){return this._eth.sendTransaction(payload);}
this._eth.sendTransaction(payload,callback);};SolidityFunction.prototype.estimateGas=function(){var args=Array.prototype.slice.call(arguments);var callback=this.extractCallback(args);var payload=this.toPayload(args);if(!callback){return this._eth.estimateGas(payload);}
this._eth.estimateGas(payload,callback);};SolidityFunction.prototype.getData=function(){var args=Array.prototype.slice.call(arguments);var payload=this.toPayload(args);return payload.data;};SolidityFunction.prototype.displayName=function(){return utils.extractDisplayName(this._name);};SolidityFunction.prototype.typeName=function(){return utils.extractTypeName(this._name);};SolidityFunction.prototype.request=function(){var args=Array.prototype.slice.call(arguments);var callback=this.extractCallback(args);var payload=this.toPayload(args);var format=this.unpackOutput.bind(this);return{method:this._constant?'eth_call':'eth_sendTransaction',callback:callback,params:[payload],format:format};};SolidityFunction.prototype.execute=function(){var transaction=!this._constant;if(transaction){return this.sendTransaction.apply(this,Array.prototype.slice.call(arguments));}
return this.call.apply(this,Array.prototype.slice.call(arguments));};SolidityFunction.prototype.attachToContract=function(contract){var execute=this.execute.bind(this);execute.request=this.request.bind(this);execute.call=this.call.bind(this);execute.sendTransaction=this.sendTransaction.bind(this);execute.estimateGas=this.estimateGas.bind(this);execute.getData=this.getData.bind(this);var displayName=this.displayName();if(!contract[displayName]){contract[displayName]=execute;}
contract[displayName][this.typeName()]=execute;};module.exports=SolidityFunction;}),(function(module,exports,__webpack_require__){(function(Buffer){var errors=__webpack_require__(21);if(typeof window!=='undefined'&&window.XMLHttpRequest){XMLHttpRequest=window.XMLHttpRequest;}else{XMLHttpRequest=__webpack_require__(195).XMLHttpRequest;}
var XHR2=__webpack_require__(69);var HttpProvider=function(host,timeout,user,password,headers){this.host=host||'http://localhost:8545';this.timeout=timeout||0;this.user=user;this.password=password;this.headers=headers;};HttpProvider.prototype.prepareRequest=function(async){var request;if(async){request=new XHR2();request.timeout=this.timeout;}else{request=new XMLHttpRequest();}
request.open('POST',this.host,async);if(this.user&&this.password){var auth='Basic '+new Buffer(this.user+':'+this.password).toString('base64');request.setRequestHeader('Authorization',auth);}request.setRequestHeader('Content-Type','application/json');if(this.headers){this.headers.forEach(function(header){request.setRequestHeader(header.name,header.value);});}
return request;};HttpProvider.prototype.send=function(payload){var request=this.prepareRequest(false);try{request.send(JSON.stringify(payload));}catch(error){throw errors.InvalidConnection(this.host);}
var result=request.responseText;try{result=JSON.parse(result);}catch(e){throw errors.InvalidResponse(request.responseText);}
return result;};HttpProvider.prototype.sendAsync=function(payload,callback){var request=this.prepareRequest(true);request.onreadystatechange=function(){if(request.readyState===4&&request.timeout!==1){var result=request.responseText;var error=null;try{result=JSON.parse(result);}catch(e){error=errors.InvalidResponse(request.responseText);}
callback(error,result);}};request.ontimeout=function(){callback(errors.ConnectionTimeout(this.timeout));};try{request.send(JSON.stringify(payload));}catch(error){callback(errors.InvalidConnection(this.host));}};HttpProvider.prototype.isConnected=function(){try{this.send({id:9999999999,jsonrpc:'2.0',method:'net_listening',params:[]});return true;}catch(e){return false;}};module.exports=HttpProvider;}.call(exports,__webpack_require__(31).Buffer))}),(function(module,exports,__webpack_require__){"use strict";var utils=__webpack_require__(4);var errors=__webpack_require__(21);var IpcProvider=function(path,net){var _this=this;this.responseCallbacks={};this.path=path;this.connection=net.connect({path:this.path});this.connection.on('error',function(e){console.error('IPC Connection Error',e);_this._timeout();});this.connection.on('end',function(){_this._timeout();});this.connection.on('data',function(data){_this._parseResponse(data.toString()).forEach(function(result){var id=null;if(utils.isArray(result)){result.forEach(function(load){if(_this.responseCallbacks[load.id])
id=load.id;});}else{id=result.id;}
if(_this.responseCallbacks[id]){_this.responseCallbacks[id](null,result);delete _this.responseCallbacks[id];}});});};IpcProvider.prototype._parseResponse=function(data){var _this=this,returnValues=[];var dechunkedData=data.replace(/\}[\n\r]?\{/g,'}|--|{').replace(/\}\][\n\r]?\[\{/g,'}]|--|[{').replace(/\}[\n\r]?\[\{/g,'}|--|[{').replace(/\}\][\n\r]?\{/g,'}]|--|{').split('|--|');dechunkedData.forEach(function(data){if(_this.lastChunk)
data=_this.lastChunk+data;var result=null;try{result=JSON.parse(data);}catch(e){_this.lastChunk=data;clearTimeout(_this.lastChunkTimeout);_this.lastChunkTimeout=setTimeout(function(){_this._timeout();throw errors.InvalidResponse(data);},1000*15);return;}
clearTimeout(_this.lastChunkTimeout);_this.lastChunk=null;if(result)
returnValues.push(result);});return returnValues;};IpcProvider.prototype._addResponseCallback=function(payload,callback){var id=payload.id||payload[0].id;var method=payload.method||payload[0].method;this.responseCallbacks[id]=callback;this.responseCallbacks[id].method=method;};IpcProvider.prototype._timeout=function(){for(var key in this.responseCallbacks){if(this.responseCallbacks.hasOwnProperty(key)){this.responseCallbacks[key](errors.InvalidConnection('on IPC'));delete this.responseCallbacks[key];}}};IpcProvider.prototype.isConnected=function(){var _this=this;if(!_this.connection.writable)
_this.connection.connect({path:_this.path});return!!this.connection.writable;};IpcProvider.prototype.send=function(payload){if(this.connection.writeSync){var result;if(!this.connection.writable)
this.connection.connect({path:this.path});var data=this.connection.writeSync(JSON.stringify(payload));try{result=JSON.parse(data);}catch(e){throw errors.InvalidResponse(data);}
return result;}else{throw new Error('You tried to send "'+payload.method+'" synchronously. Synchronous requests are not supported by the IPC provider.');}};IpcProvider.prototype.sendAsync=function(payload,callback){if(!this.connection.writable)
this.connection.connect({path:this.path});this.connection.write(JSON.stringify(payload));this._addResponseCallback(payload,callback);};module.exports=IpcProvider;}),(function(module,exports,__webpack_require__){var Method=__webpack_require__(15);var DB=function(web3){this._requestManager=web3._requestManager;var self=this;methods().forEach(function(method){method.attachToObject(self);method.setRequestManager(web3._requestManager);});};var methods=function(){var putString=new Method({name:'putString',call:'db_putString',params:3});var getString=new Method({name:'getString',call:'db_getString',params:2});var putHex=new Method({name:'putHex',call:'db_putHex',params:3});var getHex=new Method({name:'getHex',call:'db_getHex',params:2});return[putString,getString,putHex,getHex];};module.exports=DB;}),(function(module,exports,__webpack_require__){"use strict";var formatters=__webpack_require__(13);var utils=__webpack_require__(4);var Method=__webpack_require__(15);var Property=__webpack_require__(22);var c=__webpack_require__(43);var Contract=__webpack_require__(200);var watches=__webpack_require__(46);var Filter=__webpack_require__(44);var IsSyncing=__webpack_require__(214);var namereg=__webpack_require__(211);var Iban=__webpack_require__(45);var transfer=__webpack_require__(215);var blockCall=function(args){return(utils.isString(args[0])&&args[0].indexOf('0x')===0)?"eth_getBlockByHash":"eth_getBlockByNumber";};var transactionFromBlockCall=function(args){return(utils.isString(args[0])&&args[0].indexOf('0x')===0)?'eth_getTransactionByBlockHashAndIndex':'eth_getTransactionByBlockNumberAndIndex';};var uncleCall=function(args){return(utils.isString(args[0])&&args[0].indexOf('0x')===0)?'eth_getUncleByBlockHashAndIndex':'eth_getUncleByBlockNumberAndIndex';};var getBlockTransactionCountCall=function(args){return(utils.isString(args[0])&&args[0].indexOf('0x')===0)?'eth_getBlockTransactionCountByHash':'eth_getBlockTransactionCountByNumber';};var uncleCountCall=function(args){return(utils.isString(args[0])&&args[0].indexOf('0x')===0)?'eth_getUncleCountByBlockHash':'eth_getUncleCountByBlockNumber';};function Eth(web3){this._requestManager=web3._requestManager;var self=this;methods().forEach(function(method){method.attachToObject(self);method.setRequestManager(self._requestManager);});properties().forEach(function(p){p.attachToObject(self);p.setRequestManager(self._requestManager);});this.iban=Iban;this.sendIBANTransaction=transfer.bind(null,this);}
Object.defineProperty(Eth.prototype,'defaultBlock',{get:function(){return c.defaultBlock;},set:function(val){c.defaultBlock=val;return val;}});Object.defineProperty(Eth.prototype,'defaultAccount',{get:function(){return c.defaultAccount;},set:function(val){c.defaultAccount=val;return val;}});var methods=function(){var getBalance=new Method({name:'getBalance',call:'eth_getBalance',params:2,inputFormatter:[formatters.inputAddressFormatter,formatters.inputDefaultBlockNumberFormatter],outputFormatter:formatters.outputBigNumberFormatter});var getStorageAt=new Method({name:'getStorageAt',call:'eth_getStorageAt',params:3,inputFormatter:[null,utils.toHex,formatters.inputDefaultBlockNumberFormatter]});var getCode=new Method({name:'getCode',call:'eth_getCode',params:2,inputFormatter:[formatters.inputAddressFormatter,formatters.inputDefaultBlockNumberFormatter]});var getBlock=new Method({name:'getBlock',call:blockCall,params:2,inputFormatter:[formatters.inputBlockNumberFormatter,function(val){return!!val;}],outputFormatter:formatters.outputBlockFormatter});var getUncle=new Method({name:'getUncle',call:uncleCall,params:2,inputFormatter:[formatters.inputBlockNumberFormatter,utils.toHex],outputFormatter:formatters.outputBlockFormatter,});var getCompilers=new Method({name:'getCompilers',call:'eth_getCompilers',params:0});var getBlockTransactionCount=new Method({name:'getBlockTransactionCount',call:getBlockTransactionCountCall,params:1,inputFormatter:[formatters.inputBlockNumberFormatter],outputFormatter:utils.toDecimal});var getBlockUncleCount=new Method({name:'getBlockUncleCount',call:uncleCountCall,params:1,inputFormatter:[formatters.inputBlockNumberFormatter],outputFormatter:utils.toDecimal});var getTransaction=new Method({name:'getTransaction',call:'eth_getTransactionByHash',params:1,outputFormatter:formatters.outputTransactionFormatter});var getTransactionFromBlock=new Method({name:'getTransactionFromBlock',call:transactionFromBlockCall,params:2,inputFormatter:[formatters.inputBlockNumberFormatter,utils.toHex],outputFormatter:formatters.outputTransactionFormatter});var getTransactionReceipt=new Method({name:'getTransactionReceipt',call:'eth_getTransactionReceipt',params:1,outputFormatter:formatters.outputTransactionReceiptFormatter});var getTransactionCount=new Method({name:'getTransactionCount',call:'eth_getTransactionCount',params:2,inputFormatter:[null,formatters.inputDefaultBlockNumberFormatter],outputFormatter:utils.toDecimal});var sendRawTransaction=new Method({name:'sendRawTransaction',call:'eth_sendRawTransaction',params:1,inputFormatter:[null]});var sendTransaction=new Method({name:'sendTransaction',call:'eth_sendTransaction',params:1,inputFormatter:[formatters.inputTransactionFormatter]});var signTransaction=new Method({name:'signTransaction',call:'eth_signTransaction',params:1,inputFormatter:[formatters.inputTransactionFormatter]});var sign=new Method({name:'sign',call:'eth_sign',params:2,inputFormatter:[formatters.inputAddressFormatter,null]});var call=new Method({name:'call',call:'eth_call',params:2,inputFormatter:[formatters.inputCallFormatter,formatters.inputDefaultBlockNumberFormatter]});var estimateGas=new Method({name:'estimateGas',call:'eth_estimateGas',params:1,inputFormatter:[formatters.inputCallFormatter],outputFormatter:utils.toDecimal});var compileSolidity=new Method({name:'compile.solidity',call:'eth_compileSolidity',params:1});var compileLLL=new Method({name:'compile.lll',call:'eth_compileLLL',params:1});var compileSerpent=new Method({name:'compile.serpent',call:'eth_compileSerpent',params:1});var submitWork=new Method({name:'submitWork',call:'eth_submitWork',params:3});var getWork=new Method({name:'getWork',call:'eth_getWork',params:0});return[getBalance,getStorageAt,getCode,getBlock,getUncle,getCompilers,getBlockTransactionCount,getBlockUncleCount,getTransaction,getTransactionFromBlock,getTransactionReceipt,getTransactionCount,call,estimateGas,sendRawTransaction,signTransaction,sendTransaction,sign,compileSolidity,compileLLL,compileSerpent,submitWork,getWork];};var properties=function(){return[new Property({name:'coinbase',getter:'eth_coinbase'}),new Property({name:'mining',getter:'eth_mining'}),new Property({name:'hashrate',getter:'eth_hashrate',outputFormatter:utils.toDecimal}),new Property({name:'syncing',getter:'eth_syncing',outputFormatter:formatters.outputSyncingFormatter}),new Property({name:'gasPrice',getter:'eth_gasPrice',outputFormatter:formatters.outputBigNumberFormatter}),new Property({name:'accounts',getter:'eth_accounts'}),new Property({name:'blockNumber',getter:'eth_blockNumber',outputFormatter:utils.toDecimal}),new Property({name:'protocolVersion',getter:'eth_protocolVersion'})];};Eth.prototype.contract=function(abi){var factory=new Contract(this,abi);return factory;};Eth.prototype.filter=function(options,callback,filterCreationErrorCallback){return new Filter(options,'eth',this._requestManager,watches.eth(),formatters.outputLogFormatter,callback,filterCreationErrorCallback);};Eth.prototype.namereg=function(){return this.contract(namereg.global.abi).at(namereg.global.address);};Eth.prototype.icapNamereg=function(){return this.contract(namereg.icap.abi).at(namereg.icap.address);};Eth.prototype.isSyncing=function(callback){return new IsSyncing(this._requestManager,callback);};module.exports=Eth;}),(function(module,exports,__webpack_require__){var utils=__webpack_require__(4);var Property=__webpack_require__(22);var Net=function(web3){this._requestManager=web3._requestManager;var self=this;properties().forEach(function(p){p.attachToObject(self);p.setRequestManager(web3._requestManager);});};var properties=function(){return[new Property({name:'listening',getter:'net_listening'}),new Property({name:'peerCount',getter:'net_peerCount',outputFormatter:utils.toDecimal})];};module.exports=Net;}),(function(module,exports,__webpack_require__){"use strict";var Method=__webpack_require__(15);var Property=__webpack_require__(22);var formatters=__webpack_require__(13);function Personal(web3){this._requestManager=web3._requestManager;var self=this;methods().forEach(function(method){method.attachToObject(self);method.setRequestManager(self._requestManager);});properties().forEach(function(p){p.attachToObject(self);p.setRequestManager(self._requestManager);});}
var methods=function(){var newAccount=new Method({name:'newAccount',call:'personal_newAccount',params:1,inputFormatter:[null]});var importRawKey=new Method({name:'importRawKey',call:'personal_importRawKey',params:2});var sign=new Method({name:'sign',call:'personal_sign',params:3,inputFormatter:[null,formatters.inputAddressFormatter,null]});var ecRecover=new Method({name:'ecRecover',call:'personal_ecRecover',params:2});var unlockAccount=new Method({name:'unlockAccount',call:'personal_unlockAccount',params:3,inputFormatter:[formatters.inputAddressFormatter,null,null]});var sendTransaction=new Method({name:'sendTransaction',call:'personal_sendTransaction',params:2,inputFormatter:[formatters.inputTransactionFormatter,null]});var lockAccount=new Method({name:'lockAccount',call:'personal_lockAccount',params:1,inputFormatter:[formatters.inputAddressFormatter]});return[newAccount,importRawKey,unlockAccount,ecRecover,sign,sendTransaction,lockAccount];};var properties=function(){return[new Property({name:'listAccounts',getter:'personal_listAccounts'})];};module.exports=Personal;}),(function(module,exports,__webpack_require__){var Method=__webpack_require__(15);var Filter=__webpack_require__(44);var watches=__webpack_require__(46);var Shh=function(web3){this._requestManager=web3._requestManager;var self=this;methods().forEach(function(method){method.attachToObject(self);method.setRequestManager(self._requestManager);});};Shh.prototype.newMessageFilter=function(options,callback,filterCreationErrorCallback){return new Filter(options,'shh',this._requestManager,watches.shh(),null,callback,filterCreationErrorCallback);};var methods=function(){return[new Method({name:'version',call:'shh_version',params:0}),new Method({name:'info',call:'shh_info',params:0}),new Method({name:'setMaxMessageSize',call:'shh_setMaxMessageSize',params:1}),new Method({name:'setMinPoW',call:'shh_setMinPoW',params:1}),new Method({name:'markTrustedPeer',call:'shh_markTrustedPeer',params:1}),new Method({name:'newKeyPair',call:'shh_newKeyPair',params:0}),new Method({name:'addPrivateKey',call:'shh_addPrivateKey',params:1}),new Method({name:'deleteKeyPair',call:'shh_deleteKeyPair',params:1}),new Method({name:'hasKeyPair',call:'shh_hasKeyPair',params:1}),new Method({name:'getPublicKey',call:'shh_getPublicKey',params:1}),new Method({name:'getPrivateKey',call:'shh_getPrivateKey',params:1}),new Method({name:'newSymKey',call:'shh_newSymKey',params:0}),new Method({name:'addSymKey',call:'shh_addSymKey',params:1}),new Method({name:'generateSymKeyFromPassword',call:'shh_generateSymKeyFromPassword',params:1}),new Method({name:'hasSymKey',call:'shh_hasSymKey',params:1}),new Method({name:'getSymKey',call:'shh_getSymKey',params:1}),new Method({name:'deleteSymKey',call:'shh_deleteSymKey',params:1}),new Method({name:'post',call:'shh_post',params:1,inputFormatter:[null]})];};module.exports=Shh;}),(function(module,exports,__webpack_require__){"use strict";var Method=__webpack_require__(15);var Property=__webpack_require__(22);function Swarm(web3){this._requestManager=web3._requestManager;var self=this;methods().forEach(function(method){method.attachToObject(self);method.setRequestManager(self._requestManager);});properties().forEach(function(p){p.attachToObject(self);p.setRequestManager(self._requestManager);});}
var methods=function(){var blockNetworkRead=new Method({name:'blockNetworkRead',call:'bzz_blockNetworkRead',params:1,inputFormatter:[null]});var syncEnabled=new Method({name:'syncEnabled',call:'bzz_syncEnabled',params:1,inputFormatter:[null]});var swapEnabled=new Method({name:'swapEnabled',call:'bzz_swapEnabled',params:1,inputFormatter:[null]});var download=new Method({name:'download',call:'bzz_download',params:2,inputFormatter:[null,null]});var upload=new Method({name:'upload',call:'bzz_upload',params:2,inputFormatter:[null,null]});var retrieve=new Method({name:'retrieve',call:'bzz_retrieve',params:1,inputFormatter:[null]});var store=new Method({name:'store',call:'bzz_store',params:2,inputFormatter:[null,null]});var get=new Method({name:'get',call:'bzz_get',params:1,inputFormatter:[null]});var put=new Method({name:'put',call:'bzz_put',params:2,inputFormatter:[null,null]});var modify=new Method({name:'modify',call:'bzz_modify',params:4,inputFormatter:[null,null,null,null]});return[blockNetworkRead,syncEnabled,swapEnabled,download,upload,retrieve,store,get,put,modify];};var properties=function(){return[new Property({name:'hive',getter:'bzz_hive'}),new Property({name:'info',getter:'bzz_info'})];};module.exports=Swarm;}),(function(module,exports,__webpack_require__){var globalRegistrarAbi=__webpack_require__(183);var icapRegistrarAbi=__webpack_require__(184);var globalNameregAddress='0xc6d9d2cd449a754c494264e1809c50e34d64562b';var icapNameregAddress='0xa1a111bc074c9cfa781f0c38e63bd51c91b8af00';module.exports={global:{abi:globalRegistrarAbi,address:globalNameregAddress},icap:{abi:icapRegistrarAbi,address:icapNameregAddress}};}),(function(module,exports,__webpack_require__){var Jsonrpc=__webpack_require__(68);var utils=__webpack_require__(4);var c=__webpack_require__(43);var errors=__webpack_require__(21);var RequestManager=function(provider){this.provider=provider;this.polls={};this.timeout=null;};RequestManager.prototype.send=function(data){if(!this.provider){console.error(errors.InvalidProvider());return null;}
var payload=Jsonrpc.toPayload(data.method,data.params);var result=this.provider.send(payload);if(!Jsonrpc.isValidResponse(result)){throw errors.InvalidResponse(result);}
return result.result;};RequestManager.prototype.sendAsync=function(data,callback){if(!this.provider){return callback(errors.InvalidProvider());}
var payload=Jsonrpc.toPayload(data.method,data.params);this.provider.sendAsync(payload,function(err,result){if(err){return callback(err);}
if(!Jsonrpc.isValidResponse(result)){return callback(errors.InvalidResponse(result));}
callback(null,result.result);});};RequestManager.prototype.sendBatch=function(data,callback){if(!this.provider){return callback(errors.InvalidProvider());}
var payload=Jsonrpc.toBatchPayload(data);this.provider.sendAsync(payload,function(err,results){if(err){return callback(err);}
if(!utils.isArray(results)){return callback(errors.InvalidResponse(results));}
callback(err,results);});};RequestManager.prototype.setProvider=function(p){this.provider=p;};RequestManager.prototype.startPolling=function(data,pollId,callback,uninstall){this.polls[pollId]={data:data,id:pollId,callback:callback,uninstall:uninstall};if(!this.timeout){this.poll();}};RequestManager.prototype.stopPolling=function(pollId){delete this.polls[pollId];if(Object.keys(this.polls).length===0&&this.timeout){clearTimeout(this.timeout);this.timeout=null;}};RequestManager.prototype.reset=function(keepIsSyncing){for(var key in this.polls){if(!keepIsSyncing||key.indexOf('syncPoll_')===-1){this.polls[key].uninstall();delete this.polls[key];}}
if(Object.keys(this.polls).length===0&&this.timeout){clearTimeout(this.timeout);this.timeout=null;}};RequestManager.prototype.poll=function(){this.timeout=setTimeout(this.poll.bind(this),c.ETH_POLLING_TIMEOUT);if(Object.keys(this.polls).length===0){return;}
if(!this.provider){console.error(errors.InvalidProvider());return;}
var pollsData=[];var pollsIds=[];for(var key in this.polls){pollsData.push(this.polls[key].data);pollsIds.push(key);}
if(pollsData.length===0){return;}
var payload=Jsonrpc.toBatchPayload(pollsData);var pollsIdMap={};payload.forEach(function(load,index){pollsIdMap[load.id]=pollsIds[index];});var self=this;this.provider.sendAsync(payload,function(error,results){if(error){return;}
if(!utils.isArray(results)){throw errors.InvalidResponse(results);}
results.map(function(result){var id=pollsIdMap[result.id];if(self.polls[id]){result.callback=self.polls[id].callback;return result;}else
return false;}).filter(function(result){return!!result;}).filter(function(result){var valid=Jsonrpc.isValidResponse(result);if(!valid){result.callback(errors.InvalidResponse(result));}
return valid;}).forEach(function(result){result.callback(null,result.result);});});};module.exports=RequestManager;}),(function(module,exports){var Settings=function(){this.defaultBlock='latest';this.defaultAccount=undefined;};module.exports=Settings;}),(function(module,exports,__webpack_require__){var formatters=__webpack_require__(13);var utils=__webpack_require__(4);var count=1;var pollSyncing=function(self){var onMessage=function(error,sync){if(error){return self.callbacks.forEach(function(callback){callback(error);});}
if(utils.isObject(sync)&&sync.startingBlock)
sync=formatters.outputSyncingFormatter(sync);self.callbacks.forEach(function(callback){if(self.lastSyncState!==sync){if(!self.lastSyncState&&utils.isObject(sync))
callback(null,true);setTimeout(function(){callback(null,sync);},0);self.lastSyncState=sync;}});};self.requestManager.startPolling({method:'eth_syncing',params:[],},self.pollId,onMessage,self.stopWatching.bind(self));};var IsSyncing=function(requestManager,callback){this.requestManager=requestManager;this.pollId='syncPoll_'+count++;this.callbacks=[];this.addCallback(callback);this.lastSyncState=false;pollSyncing(this);return this;};IsSyncing.prototype.addCallback=function(callback){if(callback)
this.callbacks.push(callback);return this;};IsSyncing.prototype.stopWatching=function(){this.requestManager.stopPolling(this.pollId);this.callbacks=[];};module.exports=IsSyncing;}),(function(module,exports,__webpack_require__){var Iban=__webpack_require__(45);var exchangeAbi=__webpack_require__(185);var transfer=function(eth,from,to,value,callback){var iban=new Iban(to);if(!iban.isValid()){throw new Error('invalid iban address');}
if(iban.isDirect()){return transferToAddress(eth,from,iban.address(),value,callback);}
if(!callback){var address=eth.icapNamereg().addr(iban.institution());return deposit(eth,from,address,value,iban.client());}
eth.icapNamereg().addr(iban.institution(),function(err,address){return deposit(eth,from,address,value,iban.client(),callback);});};var transferToAddress=function(eth,from,to,value,callback){return eth.sendTransaction({address:to,from:from,value:value},callback);};var deposit=function(eth,from,to,value,client,callback){var abi=exchangeAbi;return eth.contract(abi).at(to).deposit(client,{from:from,value:value},callback);};module.exports=transfer;})]);