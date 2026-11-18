import "server-only";
import { cache } from "react";
import { getTweet } from "react-tweet/api";

/** One fetch per tweet per build render, shared by the list sort and the embeds. */
export const fetchTweet = cache(async (id: string) => getTweet(id).catch(() => undefined));
