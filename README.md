# Parsun chat

Parsun is a live chat app that allows people to chat according to their topics of interest _at the moment_. If our moods fluctuate as much as we try to deny them, why shouldn't "chat with a stranger" chatrooms reflect our day-to-day variations in thoughts?

(screenshots)

## Features

Parsun has the following features:
* Listing of current topics being discussed
* Multiple live chat rooms enabled by socket.io technology
* Ability to join a room without registration
* Automatic size limit of 5 people in each room to encourage focused discussion

## Technology stack

Parsun is built with Facebook's React.js for blazing fast DOM re-rendering and [socket.io](www.socket.io) web sockets.

(logos of React and Socket.io)

## Development process

We were tasked to hack a real-time app that uses web socket technology and had roughly 3 days to complete it.

The Parsun concept had always lurked in my mind: a web app that instantly connects me with someone who is thinking about something that I'm also thinking about at the moment. During a particularly long streak of daily morning meditation (like 15 days or so), I started to notice the incongruence of thoughts that I had from day to day. One day I'd be feeling melancholic and asking existential questions and on a different day I'd find myself wondering about the surest way to preventing mid-life crisis, if it still exists in 2016. Surely _someone else_ in the world is also entertaining these thoughts right now?

Building Parsun was very interesting for two reasons:
1. Web socket is a specific tool that opens many doors in terms of feature possibilities
2. It works surprisingly well with React.js, Facebook's modern single-page app framework