# HTHT chat

See live app on [Heroku](https://htht-chat.herokuapp.com/).

(__Note__: This is hosted on a free Heroku server, so first loads can sometimes take up to 10 seconds.)

## Multi-room Chat App

HTHT chat is a live chat app that allows people to chat according to their topics of interest _at the moment_. If our moods fluctuate as much as we try to deny it, why shouldn't our public chatrooms cater to that? HTHT stands for heart to heart talk, and I built it as my 2nd project at General Assembly as a web development student.

At any point in time there can be tens or hundreds of chat rooms, but you can only belong to one. Each room has a 5 people limit to ensure a personal and meaningful experience.

![HTHT app chat interface](http://i.imgur.com/cwynRVd.gif)

## Features

HTHT chat has the following features:
* Listing of current topics being discussed
* Multiple live chat rooms enabled by socket.io technology
* Ability to join a room without registration
* Automatic size limit of 5 people in each room to encourage focused discussion

## Technology Stack

HTHT chat is built with Facebook's React.js for blazing fast DOM re-rendering and [socket.io](www.socket.io) web sockets.

![tech stack](tech-stack.png)

Detailed stack:

- Node.js - JavaScript runtime server
- Express - node.js web app framework
- React - JavaScript framework
- PostgreSQL - database
- Sequelize - node.js ORM for PostgreSQL
- socket.io - web socket 2-way polling
- Webpack - module bundler for ES6 browser support

## Development Process

__October 2016:__

We were tasked to hack a real-time app that uses web socket technology and had roughly 3 days to complete it.

The HTHT chat concept had always lurked in my mind: a web app that instantly connects me with someone who is thinking about something that I'm also thinking about at the moment. During a particularly long streak of daily morning meditation (like 15 days or so), I started to notice the incongruence of thoughts that I had from day to day. One day I'd be feeling melancholic and asking existential questions and on a different day I'd find myself wondering about the surest way to preventing mid-life crisis, if it still exists in 2016. Surely _someone else_ in the world is also entertaining these thoughts right now?

Building HTHT chat was very interesting for two reasons:
1. Web socket is a specific tool that opens many doors in terms of feature possibilities
2. It works surprisingly well with React.js

__UPDATE March 2018:__

After a bit of time, I revisited this project to do some refactoring and improve the app! :smile:

- Convert ES5 -> ES6 with Webpack + Babel
- Use prop-types for React component validation
- Set up bullet-proof ESLint configuration for React projects (see `.eslintrc.js`)
- Add `OnlineStatusWidget` feature to indicate which other humans are in a chatroom
- Refactor component names and methods
