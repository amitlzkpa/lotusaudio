# Lotus Audio
Lotus Audio is a web app to create and share virtual environments from the browser.  

![Lotus Audio Screenshot](./public/imgs/screenshot_01.png)

## Links
- [Main App](https://lotusaudio.herokuapp.com)
- [Sample Recording](https://youtu.be/JYfW5ad76x0)
- [Demo 1 - Lost Time](https://lotusaudio.herokuapp.com/view/5fd50acd4e27b332fcfceb12)
- [Demo 2 - Seeing Sound](https://lotusaudio.herokuapp.com/view/5ee4fe4610a0ec114483fd4e)
- [Demo 3 - Basic Sample](https://lotusaudio.herokuapp.com/view/5ed860cc5b997a27d0c21a69)
- [Instructions](./instructions)
- [Walkthrough](https://www.youtube.com/watch?v=obxwEXdzNnE)

Lotus Audio is a web app for artists to create virtual environments that respond to music. Artists can create scripts written in JavaScript to create 3D environments and shapes which can respond to music. Viewers can experience these visualizations on their computer by visiting a URL and also invite others to join their experience. The platform allows artists to monetize their works of art and tries to attribute a sense of value for the works created.  
Content generated is 3-dimensional and viewers can change their vantage point independent of the visualization. They can experience the artist’s creation on their screens and can optionally have the experience in virtual reality. It works by processing the audio source provided by the viewer locally on the viewer’s computer and passing the parsed audio data to the artist’s script. The visualization scripts follow a template and accept the audio data as input every frame. Artists have complete freedom in how they use this data and the final geometry output is updated in the 3D scene. The scene is then rendered locally on the viewer’s computer and updates synchronized with connected users.  
The application is free and open source and can be easily accessed by visiting a URL. It works entirely within the browser, requiring no installs or setups for viewing or creating. In light of existing applications with similar features it offers an experience with the least barrier to entry for consumption. Creating content on the application is also very easy provided the artist has familiarity with javascript and programming for 3D content. Earlier versions of the application have been used to create artworks for algoraves and a presentation for a conference about visualizing the physics of sound.

## Screenshots

![Lotus Audio Screenshot](./public/imgs/screenshot_01.png)

## Developer

Clone the repo.  

## Project setup
```
npm install
```

### Start server and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
```
