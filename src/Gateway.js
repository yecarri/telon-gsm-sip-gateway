import { Endpoint as teleEndpoint } from 'react-native-tele'
import { Endpoint as sipEndpoint } from 'react-native-sip2'
import DeviceInfo from 'react-native-device-info';

//import { getUniqueId, getManufacturer } from 'react-native-device-info';

const sip2tele=true;
const tele2sip=false;

export default class Gateway{
    constructor() {
      //super();
  
      this.teleCall=null;
      this.sipCall=null;
      
      this.tEndpoint = new teleEndpoint();
      this.sEndpoint = new sipEndpoint;
    }
   
    onCreate() {
        this.start().then(() => {console.log("started");});
    }

    async onMount() {
        //this.start();
    }

    async start() {
      await this.tEndpointInit();
      await this.sEndpointInit();
    }
  
    async tEndpointInit() {
      console.log("tEndpointInit()");
  
      let state = await this.tEndpoint.start({ReplaceDialer:true,Permissions:true}); // List of calls when RN context is started, could not be empty because Background service is working on Android
      //let state = await this.tEndpoint.start({ReplaceDialer:false,Permissions:false}); // List of calls when RN context is started, could not be empty because Background service is working on Android
      console.log("tEndpoint started");
  
      let { calls, settings } = state;
      console.log("calls:\n", calls);
      console.log("settings:\n", settings);
        
      // tEndpoint.on("connectivity_changed", (online) => {}); // TODO      
      this.tEndpoint.on("call_received", (call) => {
        console.log("tEndpoint.call_received", call);
        this.onTeleCallReceived(call)
      });
      this.tEndpoint.on("call_changed", (call) => {
        console.log("tEndpoint.call_changed", call);
        this.onTeleCallChanged(call);
      });
      this.tEndpoint.on("call_terminated", (call) => {
        console.log("tEndpoint.call_terminated", call);
        this.onTeleCallTerminated(call);
      });
    }
  
    async sEndpointInit() {
      console.log("sEndpointInit()");
      //this.sEndpoint = new sipEndpoint;
  
      //let deviceId = DeviceInfo.getDeviceId();
      //console.log(deviceId);


      let configuration = {
        "name": "50015",
  
        
        /*
        "username": "50363",
        "password": "pass50363",
        "domain": "sip.zadarma.com",
        "regServer": "sip.zadarma.com", // Default wildcard
        */

        
    
  
        "username": "50015",
        "password": "pass50015",
        "domain": "192.168.88.254",
        "regServer": "",
        //"regServer": "192.168.88.254", // Default wildcard
        
  
        "proxy": null,
        "transport": "UDP",//null, // Default TCP
        
        "regTimeout": 60, // Default 3600
        //"regTimeout": 3600, // Default 3600
        "regHeaders": {
          //"X-Custom-Header": "Value"
        },
        //"regContactParams": ";unique-device-token-id=XXXXXXXXX",
        "regOnAdd": true,  // Default true, use false for manual REGISTRATION
  
        service: {
          ua: "siptest",
          //stun: ['stun.l.google.com:19302', 'stun4.l.google.com:19302']
        },
  
        network: {
          useAnyway: true,           // Default: true
          useWifi: true,              // Default: true
          use3g: true,                // Default: false
          useEdge: true,             // Default: false
          useGprs: true,             // Default: false
          useInRoaming: true,        // Default: false
          useOtherNetworks: true      // Default: false
        }
      };
  
      let deviceId = DeviceInfo.getDeviceId();
      console.log(deviceId);
      if(deviceId!="sp7731cea"){
        configuration.name="50016";
        configuration.username="50016";
        configuration.password="pass50016";
      }
      console.log(configuration);

      let state = await this.sEndpoint.start();
      console.log("sEndpoint started");
  
      let { accounts, calls, settings, connectivity } = state;
      console.log("accounts:\n", accounts);
      console.log("calls:\n", calls);
      console.log("settings:\n", settings);
      console.log("connectivity:\n", connectivity);
  
      try {
        console.log("endpoint.createAccount");
        this.account = await this.sEndpoint.createAccount(configuration);
        console.log("account created", this.account);
      } catch (err) {
        console.log("err");
        console.error(err);
      }
  
  
  
  
  
      // Subscribe to endpoint events
      this.sEndpoint.on("registration_changed", (account) => {
        console.log("sEndpoint.registration_changed", account);
      });
      this.sEndpoint.on("connectivity_changed", (online) => {
        console.log("sEndpoint.connectivity_changed", online);
      });
      this.sEndpoint.on("call_received", (call) => {
        console.log("sEndpoint.call_received", call);
        this.onSipCallReceived(call)
      });
      this.sEndpoint.on("call_changed", (call) => {
        console.log("sEndpoint.call_changed", call);
        this.onSipCallChanged(call);
      });
      this.sEndpoint.on("call_terminated", (call) => {
        console.log("sEndpoint.call_terminated", call);
        this.onSipCallTerminated(call);
        //Если из SIP пришел сигнал повесить трубку - шлем intent в наш Dialer
      });
      this.sEndpoint.on("call_screen_locked", (call) => {
        console.log("sEndpoint.call_screen_locked", call);
      }); // Android only
    }
  
  
    onSipCallReceived = (call) => {
      if(sip2tele==false) return;
      this.sipCall=call;
  
      let options = {
        headers: {
          "sim": "1" // TODO
        }
      }
      //this.teleCall = /*await*/ this.tEndpoint.makeCall(this.sipCall._localUri, options);
        //this.tEndpoint.makeCall(this.sipCall._localUri, options).then((call1)=>{this.teleCall = call1;});
        /*       
          "_localContact": "\"MyUserName\" <sip:50363@10.42.0.100:43422;ob>", 
          "_localUri": "<sip:900@10.42.0.100;ob>", "_media": [], "_muted": false,
          "_remoteContact": "<sip:asterisk@10.42.0.1:5060>", 
          "_remoteName": null, "_remoteNumber": "50015",
          "_remoteUri": "<sip:50015@172.16.104.17>" 
        */
        
       let destination="+"+call._localNumber; //=call._localUri; <sip:900@10.42.0.100;ob

        if(call._localNumber=="1111")
        {
          console.log("1111 test: make call + fast answer");
          this.sEndpoint.answerCall(call);
          return;
        }

        if(call._localNumber=="3333")
        {
          console.log("3333 test: make call + fast answer");
          
          destination="900";

          this.sEndpoint.answerCall(call);
          return;
        }

        if(call._localNumber=="4444")
        {
          console.log("4444 test: make call + activate audio session");
          
          destination="900";

          this.sEndpoint.activateAudioSession();
          return;
        }


        console.log("standart call");
        destination="+79006367756";
        this.tEndpoint.makeCall(1,destination, options).then((call1)=>{this.teleCall = call1;});
        
        //temporary hack one way audio
        //this.sEndpoint.activateAudioSession();



      
      console.log("ANSWERING");
      this.sEndpoint.answerCall(call);
    }
  
    onSipCallChanged = (call) => {

    }
  
    onSipCallTerminated = (call) => {
      //Если из SIP пришел сигнал повесить трубку - шлем intent в наш Dialer
      this.tEndpoint.hangupCall();
    }
  
  
    onTeleCallReceived = (call) => {
      //if(tele2sip==false) return;
      //this.teleCall=call;
      
    }
  
    onTeleCallChanged = (call) => {
        // Дозвонились, передаем early media
        if (call._state=="PJSIP_INV_STATE_EARLY") 
        {
            this.sEndpoint.activateAudioSession();
        }
        if (call._state=="ANSWER") 
        {
          this.sEndpoint.answerCall(call)
        }
        if (call._state=="HANGUP") 
        {
          this.sEndpoint.hangupCall(call)
        }
        if (call._state=="BUSY") 
        {
          this.sEndpoint.busyCall(call)
        }

      //this.progress();
      //this.answer();
    }
  
    onTeleCallTerminated = (call) => {
        //TODO: add disconnect state
        //declineCall
        this.sEndpoint.hangupCall();
    }
  
  
  /*
    progress = () => {
      console.log("pjsip->progress");
    }
  
    answer = () => {
      console.log("pjsip->answer");
    */
      /*
      let options = {};
      let promise = this.endpoint.answerCall(this.call, options);
      promise.then(() => {
        console.log('Answer complete');
      }).catch((e) => {
        console.error('Answer failed, show error', e);
      });
    }
  
    hangup = () => {
      console.log("pjsip->hangup");
      //this.endpoint.hangup();
    } */
  
    destroy = () => {
      this.tEndpoint.destroy();
      this.sEndpoint.destroy();
    }

}