### WEBBIO CODE TEST ###

This assignment focuses on filtering through the list of clients based on their location.
After filtering them, they should be sorted based on the name of the client (a-z).

## Approach ##

As soon as I read the app should filter clients on location, I installed the [geolocation-utils](https://www.npmjs.com/package/geolocation-utils) npm package.
The geolocation-utils package allows the application to calculate the distance between two locations.

Upon downloading the partner-data, I found the json file only had the name and address of the partners.
I had two choices there:
1. Open a site like Google Maps and input the addresses to get the lat-lon data.
2. Add code that does it automatically.

I went for the second option and implemented a Google API.

After I finished those 2 parts, it was only a matter of adding a filter and sorter to the code and print them to the console.

For testing, I added Jest.
Jest allows me to add the test step "match snapshot".  
This helps to automatically check a large batch of data that was (in this case) only filtered or sorted, without having to write a lot of tests by hand.

## Installation ##

To get this application to work, a Google API Key is required. This can be retrieved from the Google Console.
The Geocode API needs to be added to the Google project for the api key to work.

1. Install Node.js
2. Run `npm i`
3. Add the Google Api Key to your environment variables (`GOOGLE_API_KEY=[insert key]`)
4. Either run `npm start` or `npm test`.


 
