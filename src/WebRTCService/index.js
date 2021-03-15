import Peer from 'peerjs';


function WebRTCService() {

  let peer = null;
  let conn = null;
  
  this.myPeerId = "";
  this.theirPeerId = "";
  this.peerIdToConnectTo = "";
  this.peerIsLive = false;


  
  this.reset = async() => {
    await this.destroy();
    await this.initialize();
  }
  

  this.initialize = async() => {
    this.myPeerId = new Date().getTime().toString().slice(-6);
    console.log(this.myPeerId);
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

      // connection received
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
    // this.msgsHistory.push({
    //   peer: this.theirPeerId,
    //   txt: data.msg
    // });
  }


  this.sendMsgToPeer = async() => {
    let data = {
      msg: this.msgForPeer
    };
    conn.send(data);
    console.log('Sending message.');
    console.log(data);
    // this.msgsHistory.push({
    //   peer: this.myPeerId,
    //   txt: this.msgForPeer
    // });
  }


}

export default new WebRTCService;