const express = require("express");
const axios = require("axios");
const cors = require("cors");
const port = 3000;

const app = express();

app.use(cors());

let API_URL =
  "https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&maxResults=50&playlistId=PLDoPjvoNmBAzH72MTPuAAaYfReraNlQgM&key=AIzaSyBvs4W43v1kP4EuE0wER5wbM5Rlfi1LMjk";

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

let videosIDs = [];

let nextPageToken = "";

const getAllVideos = async () => {
  try {
    // if the playlist length is equal to or less than 50 it won't have a nextPageToken.
    while (nextPageToken !== undefined) {
      const response = await axios.get(API_URL);
      nextPageToken = response.data.nextPageToken;
      response.data.items.map((item) => {
        videosIDs.push(item.contentDetails.videoId);
      });
      if (nextPageToken !== undefined) {
        API_URL = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=contentDetails&pageToken=${nextPageToken}&maxResults=50&playlistId=PLDoPjvoNmBAzH72MTPuAAaYfReraNlQgM&key=AIzaSyBvs4W43v1kP4EuE0wER5wbM5Rlfi1LMjk`;
      }
    }
  } catch (err) {
    // Handle Error Here
    console.error(err);
  }
};

let videosDurations = [];

// Run the API again to obtain the duration of each video in the playlist.
const getTotalDuration = async () => {
  let i = 0;
  while (i < videosIDs.length) {
    let API_URL = `https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videosIDs[i]}&key=AIzaSyBvs4W43v1kP4EuE0wER5wbM5Rlfi1LMjk`;

    const response = await axios.get(API_URL);
    videosDurations.push(response.data.items[0].contentDetails.duration);

    i++;
  }
};

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

    console.log(totalMinutes);

    // Phase 2 => convert to teh final format => Days Hours Minutes Seconds.

    // Days
    const finalDays = totalMinutes / (24 * 60);
    const absoluteDays = Math.floor(finalDays);

    console.log(absoluteDays);

    // Hours
    const finalHours = (finalDays - Math.floor(finalDays)) * 24;
    const absoluteHours = Math.floor(finalHours);

    console.log(absoluteHours);

    // Minutes
    const finalMinutes = (finalHours - Math.floor(finalHours)) * 60;
    const absoluteMinutes = Math.floor(finalMinutes);

    console.log(absoluteMinutes);

    // Seconds
    const absoluteSeconds = Math.ceil(
      (finalMinutes - Math.floor(finalMinutes)) * 60
    );

    console.log(absoluteSeconds);
    console.timeEnd();
  });

// const testArr = [
//   "P1DT1H32M59S",
//   "PT9M42S",
//   "PT9M26S",
//   "PT14M15S",
//   "PT12M4S",
//   "PT13M49S",
//   "PT14M48S",
//   "PT1H32M59S",
//   "PT22H32M59S",
//   "PT23H32M59S",
//   "PT19H32M59S",
//   "P4DT4H1S",
// ];

// // Function to Get the sum of all days, hours, minutes or seconds.
// function sumOfArray(testArray, time) {
//   // This RegEx statement gets the number that precedes D,H,M,S.
//   // \d+ means one number or more.
//   // D,H,M,S means Day, Hour, Month or Second.
//   let regExps = {
//     days: /\d+(?=D)/g,
//     hours: /\d+(?=H)/g,
//     minutes: /\d+(?=M)/g,
//     seconds: /\d+(?=S)/g,
//   };

//   let typeOfTime;

//   switch (time) {
//     case "days":
//       typeOfTime = regExps.days;
//       break;
//     case "hours":
//       typeOfTime = regExps.hours;
//       break;
//     case "minutes":
//       typeOfTime = regExps.minutes;
//       break;
//     case "seconds":
//       typeOfTime = regExps.seconds;
//       break;
//   }

//   let sum = testArray
//     .map((item) => {
//       return item.match(typeOfTime);
//     })
//     .filter((item) => item !== null)
//     .reduce((a, b) => parseInt(a) + parseInt(b), 0);

//   return sum;
// }

// let sumOfDays = sumOfArray(testArr, "days");
// let sumOfHours = sumOfArray(testArr, "hours");
// let sumOfMinutes = sumOfArray(testArr, "minutes");
// let sumOfSeconds = sumOfArray(testArr, "seconds");

// // Phase 1 => convert all to minutes.

// const daysToMin = sumOfDays * 24 * 60;
// const hoursToMin = sumOfHours * 60;
// const secToMin = sumOfSeconds / 60;

// const totalMinutes = sumOfMinutes + daysToMin + hoursToMin + secToMin;

// console.log(totalMinutes);

// // Phase 2 => convert to teh final format => Days Hours Minutes Seconds.

// // Days
// const finalDays = totalMinutes / (24 * 60);
// const absoluteDays = Math.floor(finalDays);

// console.log(absoluteDays);

// // Hours
// const finalHours = (finalDays - Math.floor(finalDays)) * 24;
// const absoluteHours = Math.floor(finalHours);

// console.log(absoluteHours);

// // Minutes
// const finalMinutes = (finalHours - Math.floor(finalHours)) * 60;
// const absoluteMinutes = Math.floor(finalMinutes);

// console.log(absoluteMinutes);

// // Seconds
// const absoluteSeconds = Math.ceil(
//   (finalMinutes - Math.floor(finalMinutes)) * 60
// );

// console.log(absoluteSeconds);
