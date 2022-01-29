const express = require("express");
require("dotenv").config();
const axios = require("axios");
const cors = require("cors");
const port = 8080;

const app = express();

app.use(cors());

let data = {};

const API_KEY = process.env.API_KEY;
const playlistId = "PLDoPjvoNmBAy3siU1b04xY24ZlstofO9M";

let API_URL = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`;

app.get("/", (req, res) => {
  res.send(data);
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Example app listening on port ${port}`);
});

let videosIDs = [];

let nextPageToken = "";

const getAllVideos = async () => {
  try {
    // if the playlist length is equal to or less than 50 it won't have a nextPageToken (undefined).
    while (nextPageToken !== undefined) {
      const response = await axios.get(API_URL);
      nextPageToken = response.data.nextPageToken;
      response.data.items.map((item) => {
        videosIDs.push(item.contentDetails.videoId);
      });
      if (nextPageToken !== undefined) {
        API_URL = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&pageToken=${nextPageToken}&maxResults=50&playlistId=${playlistId}&key=${API_KEY}`;
      }
    }
    // console.log(videosIDs);
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

let videosDurations = [];

// Run the API again to obtain the duration of each video in the playlist.
const getTotalDuration = async () => {
  // calculating how many times this API will be called.
  const numOfRounds =
    videosIDs.length % 50 > 0
      ? Math.floor(videosIDs.length / 50) + 1
      : videosIDs.length / 50;
  if (videosIDs.length <= 50) {
    try {
      let API_URL = `https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videosIDs.join(
        "%2C"
      )}&maxResults=50&key=${API_KEY}`;
      const response = await axios.get(API_URL);
      response.data.items.map((item) => {
        videosDurations.push(item.contentDetails.duration);
      });
      // console.log(videosDurations);
    } catch (err) {
      // Handle Error Here
      console.error(err);
    }
  } else {
    // amount of increment every time the API is called.
    let increment = 50;
    let start = 0;
    for (let i = 0; i < numOfRounds; i++) {
      if (numOfRounds - i === 1) {
        increment = videosIDs.length;
      }
      try {
        // 0, 50
        // 50, 100
        // 100, 128
        let API_URL = `https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videosIDs
          .slice(start, increment)
          .join("%2C")}&maxResults=50&key=${API_KEY}`;
        const response = await axios.get(API_URL);
        response.data.items.map((item) => {
          videosDurations.push(item.contentDetails.duration);
        });
      } catch (err) {
        // Handle Error Here
        console.error(err);
      }
      increment += 50;
      start += 50;
    }
    // console.log(videosDurations);
  }
};

// getAllVideos()
//   .then(getTotalDuration)
//   .then(() => {
//     console.log(videosDurations.length);
//     console.time();
//   });

console.time();

getAllVideos()
  .then(getTotalDuration)
  .then(() => {
    // Function to Get the sum of all days, hours, minutes or seconds.
    function sumOfArray(videosDurations, time) {
      // This RegEx statement gets the number that precedes D,H,M,S.
      // \d+ means one number or more.
      // D,H,M,S means Day, Hour, Month or Second.
      let regExps = {
        days: /\d+(?=D)/g,
        hours: /\d+(?=H)/g,
        minutes: /\d+(?=M)/g,
        seconds: /\d+(?=S)/g,
      };

      let typeOfTime;

      switch (time) {
        case "days":
          typeOfTime = regExps.days;
          break;
        case "hours":
          typeOfTime = regExps.hours;
          break;
        case "minutes":
          typeOfTime = regExps.minutes;
          break;
        case "seconds":
          typeOfTime = regExps.seconds;
          break;
      }

      let sum = videosDurations
        .map((item) => {
          return item.match(typeOfTime);
        })
        .filter((item) => item !== null)
        .reduce((a, b) => parseInt(a) + parseInt(b), 0);

      return sum;
    }

    let sumOfDays = sumOfArray(videosDurations, "days");
    let sumOfHours = sumOfArray(videosDurations, "hours");
    let sumOfMinutes = sumOfArray(videosDurations, "minutes");
    let sumOfSeconds = sumOfArray(videosDurations, "seconds");

    // Phase 1 => convert all to minutes.

    const daysToMin = sumOfDays * 24 * 60;
    const hoursToMin = sumOfHours * 60;
    const secToMin = sumOfSeconds / 60;

    const totalMinutes = sumOfMinutes + daysToMin + hoursToMin + secToMin;

    // Phase 2 => convert to teh final format => Days Hours Minutes Seconds.

    // Days
    const finalDays = totalMinutes / (24 * 60);
    const absoluteDays = Math.floor(finalDays);

    console.log(absoluteDays, "Days");
    data.days = absoluteDays;

    // Hours
    const finalHours = (finalDays - Math.floor(finalDays)) * 24;
    const absoluteHours = Math.floor(finalHours);

    console.log(absoluteHours, "Hours");
    data.hours = absoluteHours;

    // Minutes
    const finalMinutes = (finalHours - Math.floor(finalHours)) * 60;
    const absoluteMinutes = Math.floor(finalMinutes);

    console.log(absoluteMinutes, "Minutes");
    data.minutes = absoluteMinutes;

    // Seconds
    const absoluteSeconds = Math.ceil(
      (finalMinutes - Math.floor(finalMinutes)) * 60
    );

    console.log(absoluteSeconds, "Seconds");
    data.seconds = absoluteSeconds;

    console.timeEnd();
  });
