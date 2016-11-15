# HTHT chat

HTHT chat is a live chat app that allows people to chat according to their topics of interest _at the moment_. If our moods fluctuate as much as we try to deny them, why shouldn't "chat with a stranger" chatrooms reflect our day-to-day variations in thoughts? HTHT stands for heart to heart talk.

Live demo [here](https://htht-chat.herokuapp.com/)

![HTHT app chat interface](http://i.giphy.com/l0HlDtaMQbalFoOkM.gif)

## Features

HTHT chat has the following features:
* Listing of current topics being discussed
* Multiple live chat rooms enabled by socket.io technology
* Ability to join a room without registration
* Automatic size limit of 5 people in each room to encourage focused discussion

## Technology stack

HTHT chat is built with Facebook's React.js for blazing fast DOM re-rendering and [socket.io](www.socket.io) web sockets.

![node.js](https://upload.wikimedia.org/wikipedia/commons/7/7e/Node.js_logo_2015.svg)
![socket.io](http://www.gamedev.net/uploads/c306ef24cacc68adbb5695d3fcf67e9d.png)
![facebook reactJS](https://platform-user-uploads.s3.amazonaws.com/blog/category/logo/291/react.png)

## Development process

We were tasked to hack a real-time app that uses web socket technology and had roughly 3 days to complete it.

The HTHT chat concept had always lurked in my mind: a web app that instantly connects me with someone who is thinking about something that I'm also thinking about at the moment. During a particularly long streak of daily morning meditation (like 15 days or so), I started to notice the incongruence of thoughts that I had from day to day. One day I'd be feeling melancholic and asking existential questions and on a different day I'd find myself wondering about the surest way to preventing mid-life crisis, if it still exists in 2016. Surely _someone else_ in the world is also entertaining these thoughts right now?

Building HTHT chat was very interesting for two reasons:
1. Web socket is a specific tool that opens many doors in terms of feature possibilities
2. It works surprisingly well with React.js, Facebook's modern single-page app framework
