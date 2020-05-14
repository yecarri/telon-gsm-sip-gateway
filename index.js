/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Gateway from "./src/Gateway.js"

console.log("index.js");
let tGateway=new Gateway();
console.log("index.js.onCreate()");
tGateway.onCreate();

/*
const GatewayService = async (taskData) => {
       //DeviceEventEmitter.addListener('LockScreenOpen', function(e: Event) {
       // handle event.
       console.log("== Debug: GatewayService: Received LockScreen View Open");
       //});
 };
 
 AppRegistry.registerHeadlessTask('GatewayService', () => 
 GatewayService);
*/

App.tGateway=tGateway;
AppRegistry.registerComponent(appName, () => App);
