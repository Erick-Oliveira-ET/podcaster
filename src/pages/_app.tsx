import React from "react";
import { Header } from "../components/header";

import "../styles/global.scss";
import styles from "../styles/app.module.scss";
import { Player } from "../components/player";
import { PlayerContextProvider } from "../contexts/PlayerContext";

function MyApp({ Component, pageProps }) {
  return (
    <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Header />
          <Component {...pageProps} />
        </main>
        <Player />
      </div>
    </PlayerContextProvider>
  );
}

export default MyApp;
