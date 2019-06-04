The 15Puzzle Game
=================

This repository contains an implementation of the 15Puzzle game.
The game runs over a text-based terminal.

System Requirements
-------------------

NodeJS is required to run the app (tested on versions 10.15.3 and 12.13.1).
Alternatively, it can be run using Docker.

Running without Docker
----------------------
1. `cd` to the project root.
1. If needed, install the `yarn` package manager:
    ```
    npm install -g yarn
    ```
1. Download dependencies:
    ```
    yarn
    ```
1. Build the app:
    ```
    npm run build
    ```

1. (optional) Run tests:
    ```
    npm run test
    ```
    
1. Run the app:
    ```
    # Start a 4x4 board game
    npm start
    
    # Start a 5x3 board game
    npm start -- -h 5 -w 3
    
    # Print the help message
    npm start -- --help
    ```
    Note - board width or height values of less than 2 are not allowed.
    
    
Running with Docker
-------------------
1. `cd` to the project root.

1. Build the docker image:
    ```
    docker build -t 15puzzle .
    ``` 

1. Run the image:

    ```
    # Run tests
    docker run 15puzzle run test 
    
    # Start a 4x4 board game
    docker run -it 15puzzle start
    
    # Start a 5x3 board game
    docker run -it 15puzzle start -- -h 5 -w 3
    
    # Print the help message
    docker run -it 15puzzle start -- --help
    ```

Gameplay
--------
Once running, a puzzle board will be presented. The arrow keys can be used to 'move' the blank tile in each direction (by sliding the corresponding tile onto it).

Code Structure
--------------
* `/game` - A pure implementation of the game logic.
* `/io` -  Abstractions and implementations concerning i/o.
* `/ui` -  The game UI renderer.
* `/puzzle_game_controller.ts` - Orchestration of the various game components. This component is responsible for  connecting the game logic with the UI, and responding to user events.

The code is written in TypeScript and is fairly covered with unit tests for most modules (using `chai` and `mocha`). A module `some_module.ts` usually has a corresponding test file named `some_module.test.ts` in the same directory (see previous sections for how to run the tests). 

A Note Regarding Board Initialization
-------------------------------------
The game board is initialized in a manner that guarantees that (a) The bord is sortable, (b) Boards are drawn uniformly from the set of sortable boards, with the exception that (c) The sorted board will not be drawn, so that the initial board presented to the player will not be sorted.
The initialization process repeatedly draws sortable boards until it encounters an unsorted board.
The process is limited to 100 attempts; however, as the probability of drawing the sorted board is `1/numOfSortableBoards`, 100 attempts is far more than enough and the process is practically guaranteed to complete quickly and successfully.    