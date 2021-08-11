# Audio Processing

The engine uses the WebAudio API to process audio. It does a basic FFT analysis on the audio parsing it into 512 bins. The samples are also processed into lows, mids and highs and made available every frame. Some helper methods available within the framework allows the artist to do simple processing of the samples like computing averages, medians, extremes across bins or frequency ranges on demand.  

# Visualization Scripting

Visualizations are created using javascript and threejs. The editing happens within the browser. The edit screen opens up a code editor which accepts the javascript snippet to be added to the scene. The scripts are expected to follow an interface. The engine hotloads these scripts and calls the interface method at the appropriate time. Parsed audio information is passed every frame as a javascript object.  

### Viz Object Interface Methods

**Load Resources**  
```

/**
Load external JavaScript resources by passing in their URL.
The file from the source will be fetched and injected into the environment
before initializing the visualization.
*/
function getRefs() {
  return  [
  ]
}

```

**Initialization**  
```

/**
Method to initialize the viz environment.
Use this to setup the viz environment.
*/
this.init = async function() {
	// initialize the viz
}

```

**Render Viz**  
```

/**
Method called every frame along with sampled audio data at the frame.
Use this to update the viz environment.
*/
this.renderFrame = async function(FREQOBJ) {
	// code to update the viz
}

```

**Object containing parsed audio data**
```
let FREQOBJ = {
	FREQOBJ['allFreqArray'] = array;
	FREQOBJ['lowFreqArray'] = lowFreqArray;
	FREQOBJ['midFreqArray'] = midFreqArray;
	FREQOBJ['higFreqArray'] = higFreqArray;
}

```

# Accessing

The application is an entirely frontend application and allows loading scripts from any resource accessible over HTTP and the script is defined with the specified interface. For convenience in the demo application the created scripts are stored on a NoSQL database and served on request.  

# Liveshare

# Monetization

Lotus uses Web Monetization to allow artists to earn streams of micro payments for their scripts. Web Monetization (WM) is a proposed API standard that allows websites to request a stream of very small payments (e.g. fractions of a cent) from a user.

It's a proof of concept for an alternative model of content monetization. Currently the most common model of content monetization involves a platform provider setting up the monetization infrastructure for content contributed by independent creators on the platform.

Lotus itself does not handle any transactions or store any information related to consumption of content created by the artists. It only provides a mechanism for artists to add _payment pointers_ to their scripts and enable/disable access to scripts based on their preferences. For monetized content Lotus restricts access to only viewers who have enabled streaming payments. It loads the initialized state as preview for all users regardless if the content is monetized or not.

Creators need to signup for a web monetization receiver wallet to receive payments with a third-party provider. The Interledger Protocol used by Web Monetization protocol defines for these providers to generate a payment pointer for receivers. Lotus accepts and stores  this pointer along with toggle options whether monetization is enabled or not with the scripts.


When a viewer visits monetized content Lotus includes the payment pointer for the script with the page. The Web Monetization specification guides the browser to direct the payments sent by viewer to this pointer. To start sending payments viewers would need to have a Web monetization enabled browser or suitable plugin installed. The setup would also need to be configured with a funded Web Monetization sender wallet.

The wallet provider and the Web Monetization specifications takes care of transfering the payments from the sender to receiver. They often also includes ways for the creators to withdraw the payments in a medium of their choosing.

A list of provider is available [here](https://webmonetization.org/#providers)
