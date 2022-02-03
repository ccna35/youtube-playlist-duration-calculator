import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useState } from "react";

export default function Home() {
  const [playlistID, setPlaylistID] = useState("");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // After the user submits the form we must check if the input is valid.
  const inputRegex =
    /(https:\/\/www\.youtube\.com\/playlist\?list=|www\.youtube\.com\/playlist\?list=|youtube\.com\/playlist\?list=)(?<==)[a-zA-Z0-9-_]+/;
  // This Regex expression filters out teh client side input & gets the playlist ID only.

  const playlistID_Regex = /(?<=\=)[a-zA-Z0-9-_]+/;

  const getPlaylistDuration = async (e) => {
    e.preventDefault();
    setLoading(true);
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
        setPlaylistID("");
        setLoading(false);
      } catch (err) {
        console.log(err.message);
      }
    } else {
      setError("Please check the URL of the playlist and submit again.");
    }
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
        <title>YouTube Playlist Duration Calculator</title>
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
            {loading ? (
              "Loading..."
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
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
