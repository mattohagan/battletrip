# battletrip
game of battleships with uber @ mhacks6


## game plan
###apps
- authorize user’s uber account (on phone or server?)
- status checks
- push notifications for when they hit or went by a ship 

- polling of details every 4 seconds 
- once trip ends get location and 
- geo fences from backend or client doesn't matter but lets do server 
- background running app - navigation app 

###server
- keep track of battleship locations
- sync with uber api
- a user’s final destination
- parse cloud code to push notifications
- give web app info to render on city hits

###web app
- map of hits - is this ethical and would it be allowed? just anonymous data on where people are landing
- can put a delay of 1-2 hours on it so it’s not realtime
- based off of html5 geolocation for their city
- pulls info from server for that city
