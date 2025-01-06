# Commute Dashboards of Various Flavors

## TODO:

1. fix Vue + JS sticky navbar (not sticky)
2. fix Vue + JS apexchart not drawing boxplot until chart is interacted with
3. refactor dashboards: 
	- clean up project structure
	- clean up bad code
	- clean up component architecture

## About

I built and rebuilt a web app that forcasts traffic conditions along the user's commute and in the hours and days surrounding the inputted day and time. 

[This website](https://zachrichards.dev/) is a React + Javascript version of the dashboard hosted on AWS.

I've built the app in the following flavors:

1. React + JavaScript
2. React + Typescript
3. Vue + Javascript

And I plan to add the following:

4. Svelte + Javascript
5. Django
6. AngularJS

Each flavor interacts with the locally hosted server, built in Node, available in the server directory. I've included some configuration options to help you get it up and running.

## Setup:

### Obtaining Google Maps API Key and Map ID

I did not include my API key and Map ID in this repository, but I did include `.env` files with variable names for you to fill out. Follow the instructions listed below to set up and use your own keys in this project:

1. [Google Maps API Key Setup](https://developers.google.com/maps/documentation/javascript/get-api-key) If restricting your key's access, ensure that your key is given Route and Places API permissions
2. [Google Maps Map ID Setup](https://developers.google.com/maps/documentation/get-map-id) You just need to complete the steps through generating an ID

### Database Setup

The server uses a MySQL database to persist data obtained from Google Maps.
To set up the database:

1. ensure your local MySQL instance is running
2. add your MySQL credentials to TODO
3. navigate to the server/config directory
4. execute the command `python3 setupTeardown.py COMMAND` replacing COMMAND with 'create' or 'delete'

## Run the server

1. Navigate to the `server` directory
2. Ensure the environment variables are set. Add them if missing
3. `npm install`
4. `node index.js`

## Run a Dashboard:

### Javascript and Typescript:

1. Navigate to the dashboard of your choosing
2. Ensure the environment variables are set. Add them if missing
3. `npm install`
4. `npm run dev`


