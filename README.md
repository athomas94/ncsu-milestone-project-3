# TomeTracker

### Link: https://tome-tracker.onrender.com/

## Description

For this project, we are creating an application used to manage various table top campaigns, through campaign creation, editing, and character creation and updating. Our main goal was to create a "one stop shop" application that can be utilized by both Dungeon Masters and players for various utilities.

## How it works

In our application, a user arrives and creates and account or logs in to an existing account. From there, they can chose an existing campaign or create a new campaign, and based on whether they're the owner of the campaign (the Dungeon Master) or a player within the campaign. After selecting the correct campaign, a user is then directed to a dashboard where they can access a character sheet, note section, and lastly an area where you can roll virtual dice. For dungeon masters, there is also an "at a glance" view where they can see all of the players names, their armor, current health points, and their passive perception.

Please note that devlopment is still a work-in-progress, bookmark us to see what features we're able to bring to you as development continues!

## Development

### Front End Development

Jordan Cox and Andrew Thomas were responsible for the front end portion of this project. They work and effort were directly responsible for establishing the look and feel of the application, as well as functionality regarding JavaScript. While React was a language that Jordan and Andrew were experienced with from Project 2, that didn't take away from the complexity of the application.The amount of components that were interconnected with each other meant that planning and architecting the front end was vital. Had it not been for this step, it would've been very easy to get bogged down by disorganization. Additionally, the API calls that the front end utilizes required extra thought to make the calls come to life. While Kai and Vanessa were the undesputed authorities on this project regarding how to make the API calls happen, it was up to Jordan and Andrew to determine exactly where and when they needed to fire. 

### Back End Development

Together, Vanessa Pursley and Kai Han took charge of the back end systems, combining their talents to bring our database connections to life, as well as navigate the complexity of user authentication. To add an additional layer of challenge, Kai and Vanessa decided to use Python and Flask as the main backend systems for this project. This provided some extra unique challenges as Python was a language that required extra reviewing to really grasp. Once this happened though, Vanessa and Kai were unmatched in speed and effectiveness of implementation of APIs, database management, and state management. For as complex as this project ended up being for the time frame we had, Vanessa and Kai were absolute rock stars. They took on the challenge head on and helped deliver some of the coolest features we have to offer, and most impressively, when one feature was done the only question ever asked was "what else can we add!?" 

## Tech / Frameworks Used

#### Front-End:

- React
- Vite
- Bootstrap

#### Back-End:

- Python
- Flask
- Flask-SQL-Alchemy

## Issues and future states

There are a few thing that aren't quite right with the current iteration of our platform, and the big one is deployment. As of writing, this service was just deployed to Render, though it was not our first, or second choice. We had original aspired to host this application on AWS running a mix of Elastic Beanstalk and S3 buckets, but there were so many errors and head scratching moments that we had to can this idea and just get the platform running somewhere. While we are happy that the application is demo ready, we're not happy with the speed of the hosting site, as well as it's finicky nature. There are other issues we would have liked to iron out if we had had the time, such as button spacing, general look and feel, and some better file structuring, but all of these things are no way henderances to the function of the site. Going forward, the future for a site like this could really be quite high. We would love to eventually be able to incorporate a way for users to interact with each other in real time when taking notes, or just partaking in a campaign together. Additionally, some other features like a initiative tracker, DM monster cards, and API connections with some larger D&D providers, suchs as DnDbeyond.com. Lastly, it would be really neat if we could somehow incorporate AI into the platform to help write session recaps, recomend items or spells to players, or help run the game for DMs, however that is a far future state. Right now, we're happy that we can play a game of D&D with friends using the app we made.

## Personal note

I (Andrew Thomas) would be quite upset if I did not reiterate how phenomenal this team as a whole was. We stayed together from project 2 and the project just seemed to happen out of nowhere. It was so easy to work with every person on this team, and I know they'll all be fantastic devs outside of the program. We took an already fairly ambitious plan for a project, and in 12 days not on met, but greatly surpassed what our original scope was, and it's something I'm just really proud to have been part of. 
