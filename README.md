# [faisals.me](http://faisals.me)

A website I made using HTML, CSS, and Javascript as a place to introduce myself informally. This site also features a very interactive pong game with several different views, modes, and features! Employers who are interested in seeing my professional website should visit here: [faisals.ca](https://faisals.ca) (repo link: [LINK](#)). 

## Content

### About Me
This is the first website I've ever made, consisting mainly of text about me. Here are the topics I cover:

- **Who I am as a person**
- **Interests and Hobbies**
- **Music Preferences and Favorite Bands**
- **Current and Long-term Life Plan and Goals**
- **Courses Taken at UofT to Date**

### Pong Game
Users can also play an advanced version of pong I coded from scratch! Has several menus and various difficulties of selection (see features below).


## General Features

### Scale Responsive Design
The site features a scale responsive design with navigation buttons in the top bar. They collapse into a tray icon when the screen width is less than 1280px. In this state, users can toggle a vertical pop-up menu by clicking on the tray icon, providing a clean interface. The pong game also adjusts itself based on the viewport's size.

## Pong Features

### Single-Player
Users can select a single player option for the pong game if they would like to play alone against a computer of their choosen difficulty level.

### Multiplayer
Users can also select a multiplayer option, allowing up to 2 users to play against each other.

### Selection of Modes
- Single-Player features: `Easy`, `Medium`, `Hard`, and `Insane`. Increases slider speed of the computer and the speed of the ball with harder difficulties.
- Multiplayer features: `Slow`, `Medium`, `Fast`, and `Blitz`. Increases the speed of the ball with harder difficulties.
- Blitz & Impossible: These particular modes provide an exclusive slider boost feature which can be activated by double tapping in a direction (up or down).

### QoL:
- Customizable keybinds
- Pausing and resuming
- Draggable sliders for mobile
- Additional on screen buttons for slider movement enabling dash feature on mobile

### Touch Events API:
- The game is built to manage and handle several simultaneous touches at once, providing touch screen users with smooth gameplay.

### Controls:
Features several ways to control the sliders:
- Keyboard (customizable binds).
- Drag sliders (mouse or touch).
- On screen buttons with toggleable visibility (intended for touch, but you can click as well).

### Several Interactive Views:
- All of the listed pong features above make use of several different interactive views that can be switched between using clicks or specified keypresses!

### Game Sounds & Music (Coming Soon):
- Togglable sound and music providing a more immersive feel for players.
- Several different soundtracks depending on the choosen mode and difficulty.
- A quick way to mute all volume is provided in every screen as well as user adjustable slider for both music and sound separately.
