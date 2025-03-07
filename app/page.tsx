// app/page.tsx

import React from "react";

import HomeClient from "../app/components/HomeClient";

interface Articles {
  id: number;
  title: string;
  description: string;
  social_image: string;
  created_at: string;
  tag_list: string[];
  reactions_count: number;
  user: {
    name: string;
    profile_image_90: string;
  };
}

// Server-side function to fetch articles
const fetchArticles = async (): Promise<Articles[]> => {
  const response = await fetch("https://dev.to/api/articles");
  const articles: Articles[] = await response.json();
  return articles;
};

// Server component that fetches and passes data to the client component
const Home = async () => {
  const articles = await fetchArticles(); // Fetch data server-side
  return <HomeClient articles={articles} />;
};

export default Home;
