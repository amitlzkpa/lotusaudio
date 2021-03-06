import Peer from "peerjs";
import $store from "@/store/index.js";
import utils from "@/utils/index.js";



function WebRTCService() {


  let peer = null;
  let conn = null;
  let call = null;
  
  this.myPeerId = "";
  this.theirPeerId = "";
  this.peerIdToConnectTo = "";
  this.peerIsLive = false;

  
  this.msgForPeer = "";
  this.msgsHistory = [];

  
  this.reset = async() => {
    await this.destroy();
    await this.initialize();
  }
  

  this.initialize = async() => {
    this.myPeerId = new Date().getTime().toString().slice(-6);
  }


  this.destroy = async() => {
    
    
    if (peer) {
      peer.destroy();
      peer = null;
    }
    
    
  }


  this.togglePeerOnlineStatus = async() => {
    await this.setPeerOnlineStatus(!this.peerIsLive);
  }


  this.setPeerOnlineStatus = async(isOnline) => {

    this.peerIsLive = isOnline;
    if (this.peerIsLive) {
      
      let peerjsOpts = {
        host: location.hostname,
        port: location.port,
        path: '/peerjs'
      };

      peer = new Peer(this.myPeerId, peerjsOpts);

      // connected to PeerServer
      peer.on('open', function(id) {
        console.log(`Registered with peer id: ${id}`);
      });

      // error in connecting to PeerServer
      peer.on('error', function(err) {
        console.log('Error in connecting.');
        console.log(err);
      });

      let that = this;

      peer.on('connection', function(newConn) {
        if (conn !== null) {
          console.log('Session already running. Ignoring connection.');
          newConn.close();
          return;
        }
        conn = newConn;
        that.theirPeerId = conn.peer;
        that.peerIdToConnectTo = conn.peer;
        
        conn.on('data', function(data) {
          that.recvMsgFmPeer(data);
        });
      
        conn.on('open', function(data) {
          console.log(data);
        });

        // inviter gone
        conn.on('close', function() {
          conn.close();
          conn = null;
          that.theirPeerId = '';
        });

        conn.on('error', function(err) {
          console.log('Error in connection.');
          console.log(err);
          if (conn) {
            conn.close();
            conn = null;
            that.theirPeerId = '';
          }
        });

      });

      peer.on('call', that.onReceiveCall);

    } else {
      peer.destroy();
      peer = null;
    }

  }


  this.toggleConnToPeer = async() => {
    if (conn) {

      conn.close();
      conn = null;
      this.theirPeerId = '';
      
    } else {

      conn = peer.connect(this.peerIdToConnectTo, {});
      this.theirPeerId = conn.peer;
      
      let that = this;

      conn.on('data', function(data) {
        that.recvMsgFmPeer(data);
      });
      
      conn.on('open', function(data) {
        console.log(data);
      });

      // invitee gone
      conn.on('close', function() {
        conn.close();
        conn = null;
        that.theirPeerId = '';
      });

      conn.on('error', function(err) {
        console.log('Error in connection.');
        console.log(err);
        if (conn) {
          conn.close();
          conn = null;
          that.theirPeerId = '';
        }
      });
      
    }

  }

  
  this.recvMsgFmPeer = async (data) => {
    console.log('Mesg received');
    console.log(data);
    console.log('---');
    this.msgsHistory.push({
      peer: this.theirPeerId,
      txt: data.msg
    });
  }


  this.sendMsgToPeer = async() => {
    let data = {
      msg: this.msgForPeer
    };
    conn.send(data);
    console.log('Sending message.');
    console.log(data);
    this.msgsHistory.push({
      peer: this.myPeerId,
      txt: this.msgForPeer
    });
  }


  this.togglePeerAudio = async() => {
    if (call) {
      call.close();
      call = null;
      this.theirPeerId = '';
    } else {
      let stream = await utils.getMedia({ audio: true, video: false });
      call = peer.call(this.peerIdToConnectTo, stream);
      this.theirPeerId = this.peerIdToConnectTo;
    }
  }

  
  this.onReceiveCall = async(recdCall) => {
    call = recdCall;
    call.answer();
    this.theirPeerId = call.peer;
    this.peerIdToConnectTo = call.peer;
    
    let that = this;

    call.on('close', function() {
      call.close();
      call = null;
      that.theirPeerId = '';
    });

    call.on('error', function(err) {
      console.log('Error in call.');
      console.log(err);
      if (call) {
        call.close();
        call = null;
        that.theirPeerId = '';
      }
    });
    
    call.on('stream', onReceiveStream);
  }


  function onReceiveStream(stream) {
    let audioStreamSource = { name: "Peer Audio", stream: stream };
    $store.commit('updateAudioSource', audioStreamSource);
  }
  
  

}


export default new WebRTCService;