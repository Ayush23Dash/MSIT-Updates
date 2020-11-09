Here you can subscribe to this service and get info about latest news and notices of MSIT,via email.
This app scrapes data from :
```
http://www.msit.in/notices
```
and
```
http://www.msit.in/latest_news
```
This application uses cron jobs in order to overcome the sleep times of the Heroku dynos in its free version.

<h1>To run this application locally</h1>
<h4>NOTE:You need to set up your own app password(APP_PASS) for gmail or any other email client(MUA) that you use and create a .env file in the root folder. You also need to set up your own MongoDB cluster and provide its URL(DB_URL) in the aforementioned .env file</h4>
<h5>The basic steps for setting it up locally are: </h5>
<li>Clone this repo</li>
<li>cd MSIT-Updates</li>

<li>Install dependencies</li>

```
npm install
```
<li>Start the server</li>

```
node app.js
```
<li>Open the browser</li>

```
localhost:3000
```

