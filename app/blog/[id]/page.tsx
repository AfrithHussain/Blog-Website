"use client"
import { notFound } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import FavoriteSharpIcon from '@mui/icons-material/FavoriteSharp';
import ChatBubbleOutlineSharpIcon from '@mui/icons-material/ChatBubbleOutlineSharp';
import SendSharpIcon from '@mui/icons-material/SendSharp';
import TurnedInNotSharpIcon from '@mui/icons-material/TurnedInNotSharp';
import Skeleton from '@mui/material/Skeleton';
import Image from 'next/image';

// TypeScript interface for the article data
interface Article {
  id: number;
  title: string;
  description: string;
  body_html: string;
  social_image: string;
  created_at: string;
  comments_count: string;
  public_reactions_count: string;
  positive_reactions_count: string;
  url: string;
  user: {
    name: string;
    profile_image_90: string;
    twitter_username: string;
    github_username: string;
    website_url: string;
  };
  tags: string | string[]; // This can be either a string or an array of strings
  canonical_url: string;
  last_comment_at: string;
  reading_time_minutes: number;
}

// Format the date to a more readable format
const formatDate = (date: string) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return new Date(date).toLocaleDateString('en-US', options);
};

export default function Post() {
  const { id } = useParams(); // Use useParams to unwrap the params
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return; // Prevent fetch if no id is available

    const fetchData = async () => {
      const articleRes = await fetch(`https://dev.to/api/articles/${id}`);
      if (!articleRes.ok) {
        setLoading(false);
        return notFound(); // Handle not found scenario
      }
      const fetchedArticle: Article = await articleRes.json();
      setArticle(fetchedArticle);
      setLoading(false);
    };

    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="w-full">
        <div className="w-full md:w-3/4 lg:w-[80%] shadow-2xl mx-auto mt-6 py-5 px-4 sm:px-6 md:px-8">
          {/* Skeleton for article content */}
          <Skeleton variant="text" width="60%" height={40} />
          <Skeleton variant="rectangular" width="100%" height={250} className="mt-5" />
          <Skeleton variant="text" width="40%" height={30} className="mt-5" />
          <Skeleton variant="text" width="80%" height={30} className="mt-3" />
          <Skeleton variant="rectangular" width="100%" height={150} className="mt-7" />
        </div>
      </div>
    );
  }

  if (!article) return notFound(); // Ensure if no data is returned

  const tags = Array.isArray(article.tags) ? article.tags : article.tags.split(',');

  return (
    <div className="w-full">
      <div className="w-full md:w-3/4 lg:w-[80%] shadow-2xl mx-auto mt-6 py-5 px-4 sm:px-6 md:px-8">
        {/* Article Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4 md:gap-6">
            <Image
              src={article.user.profile_image_90}
              className="w-12 sm:w-14 md:w-16 rounded-full"
              alt="Profile"
              width={64}
              height={64}
            />
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold">{article.user.name}</h1>
              <p className="text-neutral-600 text-sm">{formatDate(article.created_at)}</p>
            </div>
          </div>
          <div>
            <MoreVertIcon />
          </div>
        </div>

        {/* Article Image */}
        <div className="mt-5">
          <Image
            src={article.social_image}
            className="w-full rounded-lg"
            alt="Article Image"
            width={1000}
            height={500}
          />
        </div>

        {/* Article Description and Body */}
        <div className="mt-5 text-sm sm:text-base">
          <p className="text-neutral-700">{article.description}</p>
          <div
            className="mt-7 text-lg prose leading-10"
            dangerouslySetInnerHTML={{ __html: article.body_html }}
          />
        </div>

        {/* Article Tags */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Tags</h3>
          <div className="flex flex-wrap gap-2 mt-2">
            {tags.map((tag, index) => (
              <span key={index} className="bg-gray-200 px-3 py-1 rounded-full text-sm">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Social Interaction Icons */}
        <div className="flex justify-between mt-6 items-center">
          <div className="flex gap-4 sm:gap-6">
            <div className="flex items-center gap-1">
              <FavoriteSharpIcon sx={{ color: 'red', cursor: 'pointer' }} />
              <p className="text-lg">{article.public_reactions_count}</p>
            </div>
            <div className="flex items-center gap-1">
              <ChatBubbleOutlineSharpIcon />
              <p className="text-lg">{article.comments_count}</p>
            </div>
            <SendSharpIcon sx={{ color: '#2196f3', cursor: 'pointer' }} />
          </div>
          <button>
            <TurnedInNotSharpIcon sx={{ color: 'grey', cursor: 'pointer' }} />
          </button>
        </div>

        {/* Article URL Link */}
        <div className="mt-6">
          <a
            href={article.canonical_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            Read the full article on Dev.to
          </a>
        </div>

        {/* Author's Social Links */}
        <div className="mt-6 flex items-center gap-4">
          <a
            href={`https://github.com/${article.user.github_username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-800 hover:underline"
          >
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
