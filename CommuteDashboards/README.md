# Commute Dashboards of Various Flavors

I built and rebuilt a web app that forcasts traffic conditions along the user's commute and in the hours and days surrounding the inputted day and time. 

[This website](https://zachrichards.dev/) is a React + Javascript version of the dashboard hosted on AWS.

I've built the app in the following flavors:

1. React + JavaScript
2. React + Typescript
3. Vue + Javascript

And I plan to add the following:

4. Svelte + Javascript
5. AngularJS

Each flavor interacts with a locally hosted server, built in Node, available in the server directory. I've included some configuration options to help you get it up and running.


Setup:

The server uses a MySQL database to persist data obtained from Google Maps.
To set up the database:

1. ensure your local MySQL instance is running
2. add your MySQL credentials to TODO
3. navigate to the server/config directory
4. execute the command `python3 setupTeardown.py COMMAND` replacing COMMAND with 'create' or 'delete'



To run the server:



To run a front end:



