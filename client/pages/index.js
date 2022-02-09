import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import Spinner from "../components/Spinner";

export default function Home() {
  const [playlistID, setPlaylistID] = useState("");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [firstTime, setFirstTime] = useState(true);
  const [error, setError] = useState("");

  // After the user submits the form we must check if the input is valid.
  const inputRegex =
    /(https:\/\/www\.youtube\.com\/playlist\?list=|www\.youtube\.com\/playlist\?list=|youtube\.com\/playlist\?list=)(?<==)[a-zA-Z0-9-_]+/;

  // This Regex expression filters out the client side input & gets the playlist ID only.
  const playlistID_Regex = /(?<=\=)[a-zA-Z0-9-_]+/;

  const getPlaylistDuration = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFirstTime(false);
    setData({});
    setError("");
    // Check if the input content matches this regex expression or not.
    if (playlistID.match(inputRegex)) {
      let newPlaylistID = playlistID.match(playlistID_Regex)[0];

      try {
        // const res = await fetch(`http://localhost:8080/${newPlaylistID}`);
        const res = await fetch(
          `https://ytplaylistserveroriginal.herokuapp.com/${newPlaylistID}`
        );
        const json = await res.json();
        setData(json);
        console.log(json);
        setPlaylistID("");
        setLoading(false);
      } catch (err) {
        console.log(err.message);
      }
    } else {
      setError("Please check the URL of the playlist and submit it again.");
    }
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta
          name="description"
          content="
          YouTube Playlist Length Calculator helps you to find how long a YouTube playlist is easily"
        />
        <link rel="icon" href="/favicon.ico" />
        <title>YouTube Playlist Length Calculator</title>
      </Head>
      <main className={styles.main}>
        <div className={styles.container}>
          <div className={styles.urlExample}>
            <h2>The link of the playlist should be something like this...</h2>
            <p>
              https://www.youtube.com/playlist?list=PLDoPjvoNmBAzjsz06gkzlSrlev53MGIKe
            </p>
          </div>
          <form
            className={styles.form}
            onSubmit={(e) => getPlaylistDuration(e)}
          >
            <input
              type="text"
              placeholder="https://www.youtube.com/playlist?list=ID"
              onChange={(e) => {
                setPlaylistID(e.target.value);
              }}
              value={playlistID}
              autoComplete="on"
            />
            <input type="submit" value="Get Full Duration" />
          </form>
          {error && <p className={styles.errorMsg}>{error}</p>}
          <div className={styles.playlistData}>
            {firstTime ? (
              ""
            ) : loading ? (
              error ? (
                ""
              ) : (
                <Spinner />
              )
            ) : (
              <div className={styles.results}>
                <p>
                  <span>No of videos : </span>
                  {data.numOfVideos}
                </p>

                <p>
                  <span>Total length of playlist :</span>{" "}
                  {data.days !== 0 && <>{data.days} days, </>}
                  {data.hours} hours, {data.minutes} minutes, {data.seconds}{" "}
                  seconds
                </p>

                <p>
                  <span>Average length of every video :</span>{" "}
                  {data.average.days !== 0 && <>{data.average.days} days, </>}
                  {data.average.hours !== 0 && (
                    <>{data.average.hours} hours, </>
                  )}
                  {data.average.minutes} minutes, {data.average.seconds} seconds
                </p>
              </div>
            )}
          </div>
          <div className={styles.info}>
            <h2>
              How to find the total length or duration of any YouTube playlist?
            </h2>
            <p>
              We know how hard it is to get the full length or duration of a
              YouTube's playlist, sometimes it's even harder when it contains
              over 10 or even 100 videos! That's why we created this
              <span> YouTube Playlist Duration Calculator </span> just enter the
              URL or link of the YouTube playlist and then press Enter or just
              click the button right next to it and in a matter of milliseconds
              you're going get a lot of information about that playlist,
              information like:
            </p>
            <ul>
              <li>The number of all videos</li>
              <li>Total duration of the playlist</li>
              <li>Average duration of each video</li>
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
