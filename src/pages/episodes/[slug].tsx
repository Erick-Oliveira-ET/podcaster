import format from "date-fns/format";
import ptBR from "date-fns/locale/pt-BR";
import parseISO from "date-fns/parseISO";
import React, { useContext } from "react";

import Image from "next/image";
import { GetStaticPaths, GetStaticProps } from "next";
import Link from "next/link";

import { convertDurationToTimeString } from "../../utils/convertDurationToTimeString";

import styles from "./episode.module.scss";
import { PlayerContext } from "../../contexts/PlayerContext";
import { Head } from "next/document";

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  durationAsString: string;
  duration: number;
  description: string;
  url: string;
};

type EpisodeProps = {
  episode: Episode;
};

export default function Episode({ episode }: EpisodeProps) {
  const { play } = useContext(PlayerContext);

  return (
    <div className={styles.episodeContainer}>
      <div className={styles.episode}>
        <div className={styles.thumbnailContainer}>
          <Link href="/">
            <button type="button">
              <img src="/arrow-left.svg" alt="Voltar" />
            </button>
          </Link>
          <Image
            width={700}
            height={160}
            src={episode.thumbnail}
            objectFit="cover"
          />

          <button type="button" onClick={() => play(episode)}>
            <img src="/play.svg" alt="Tocar" />
          </button>
        </div>

        <header>
          <h1>{episode.title}</h1>
          <span>{episode.members}</span>
          <span>{episode.publishedAt}</span>
          <span>{episode.durationAsString}</span>
        </header>

        <div
          className={styles.description}
          dangerouslySetInnerHTML={{ __html: episode.description }}
        />
      </div>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
    // O fallback possui configurações de como o Next vai reagir à solicitação de dados da página.
    //   Opções:
    //     - false: se a página não tiver sido construida durante a build,
    // o next vai retornar página não encontrada(404)
    //     - true: o next vai buscar os dados no client
    //     - blocking: ele carrega os dados no servidor next
  };
};

export const getStaticProps: GetStaticProps = async (ctx) => {
  const { slug } = ctx.params;

  let data = require("../../../server.js");
  data = data.default;
  data.episodes.map((ep: Episode) => {
    if (slug === ep.id) {
      data = ep;
    }
  });

  const { id, title, thumbnail, members, file, description } = data;
  const episode = {
    id,
    title,
    thumbnail,
    members,
    publishedAt: format(parseISO(data.published_at), "d MM yy", {
      locale: ptBR,
    }),
    durationAsString: convertDurationToTimeString(Number(file.duration)),
    duration: Number(file.duration),
    description,
    url: file.url,
  };

  return {
    props: {
      episode,
    },
    revalidate: 60 * 60 * 24,
  };
};
