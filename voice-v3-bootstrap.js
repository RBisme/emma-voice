[1mdiff --git a/voice-v3-bootstrap.js b/voice-v3-bootstrap.js[m
[1mindex 88722fb..12b2146 100644[m
[1m--- a/voice-v3-bootstrap.js[m
[1m+++ b/voice-v3-bootstrap.js[m
[36m@@ -138,7 +138,7 @@[m [mfunction createVoiceV3({[m
     );[m
 [m
 bridge.attachRuntime([m
[31m-    runtime[m
[32m+[m[32m    voiceRuntime[m
 );[m
 [m
 return voiceRuntime;[m
[1mdiff --git a/voice-v4.js b/voice-v4.js[m
[1mindex cc373ed..8f84724 100644[m
[1m--- a/voice-v4.js[m
[1m+++ b/voice-v4.js[m
[36m@@ -36,9 +36,6 @@[m [mconst {[m
     TwilioMediaStream[m
 } = require("./twilio-media-stream");[m
 [m
[31m-const { startRuntime } =[m
[31m-    require("./OBM/runtime/obm-runtime-engine");[m
[31m-[m
 const server = http.createServer((req, res) => {[m
 [m
 let body = "";[m
[36m@@ -305,16 +302,10 @@[m [mws.on("error", err => {[m
 const twilioStream =[m
     new TwilioMediaStream(ws);[m
 [m
[31m-const businessRuntime =[m
[31m-    startRuntime([m
[31m-        "./OBM/StanleySteemer_Marlborough__BUSINESS_MANIFEST_v1.md"[m
[31m-    );[m
[31m-[m
 const runtime =[m
     createLiveVoiceRuntime({[m
         websocket: ws,[m
[31m-        twilioStream,[m
[31m-        businessRuntime[m
[32m+[m[32m        twilioStream[m
     });[m
 [m
 await runtime.connected(ws);[m
