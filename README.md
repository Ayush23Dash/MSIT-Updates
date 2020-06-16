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
<i>The email data will be stored in my cluster made on cloud using Atlas</i>
