"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { Card, CardHeader, CardMedia, CardContent, CardActions, Avatar, IconButton, Typography, Skeleton } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ShareIcon from "@mui/icons-material/Share";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Image from "next/image"; // Import next/image for image optimization

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

interface HomeClientProps {
  articles: Articles[];
}

const HomeClient: React.FC<HomeClientProps> = ({ articles }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Memoizing filtered articles to prevent unnecessary recalculations on each render
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      return (
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tag_list.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())) ||
        article.user.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });
  }, [searchQuery, articles]);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500); // Simulate async loading
    return () => clearTimeout(timer); // Cleanup on unmount
  }, [searchQuery]);

  return (
    <div>
      {/* Search Bar */}
      <div className="flex justify-center mt-8">
        <input
          type="text"
          placeholder="Search by title, description, tags, or author..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border focus:outline-none border-gray-300 rounded-lg w-full sm:w-1/2"
          aria-label="Search articles"
        />
      </div>

      {/* Article Cards */}
      <div className="flex flex-wrap mt-20 justify-center items-center mx-4 sm:mx-8 gap-8 sm:gap-16">
        {isLoading ? (
          // Skeleton Loader for loading state
          [...Array(4)].map((_, index) => (
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2" key={index}>
              <Card sx={{ width: "100%", borderRadius: "12px", boxShadow: 14 }}>
                <Skeleton variant="rectangular" width="100%" height={194} sx={{ animation: "pulse 1.5s infinite" }} />
                <CardContent>
                  <Skeleton variant="text" width="80%" sx={{ animation: "pulse 1.5s infinite" }} />
                  <Skeleton variant="text" width="60%" sx={{ animation: "pulse 1.5s infinite" }} />
                </CardContent>
                <CardActions disableSpacing>
                  <Skeleton variant="circle" width={40} height={40} sx={{ animation: "pulse 1.5s infinite" }} />
                  <Skeleton variant="text" width="30%" sx={{ animation: "pulse 1.5s infinite" }} />
                </CardActions>
              </Card>
            </div>
          ))
        ) : filteredArticles.length === 0 ? (
          // If no articles found, display a message
          <div className="w-full text-center">
            <Typography variant="h6">No articles found</Typography>
          </div>
        ) : (
          // Display articles if found
          filteredArticles.map((article) => (
            <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2" key={article.id}>
              <Card sx={{ width: "100%", height: 500, borderRadius: "12px", boxShadow: 14 }}>
                <Link href={`/blog/${article.id}`}>
                  <CardHeader
                    avatar={<Avatar src={article.user.profile_image_90} />}
                    action={
                      <IconButton aria-label="settings">
                        <MoreVertIcon />
                      </IconButton>
                    }
                    title={<Typography sx={{ color: "rgba(0, 0, 0, 0.87)", fontWeight: 600 }}>{article.user.name}</Typography>}
                    subheader={<Typography sx={{ color: "rgba(0, 0, 0, 0.54)", fontWeight: 500 }}>{article.created_at}</Typography>}
                  />
                </Link>
                <CardMedia component="div" style={{ position: "relative", width: "100%", height: 194 }}>
                  <Link href={`/blog/${article.id}`}>
                    <Image
                      src={article.social_image}
                      alt="Article image"
                      layout="fill"
                      objectFit="contain"
                      quality={75}
                    />
                  </Link>
                </CardMedia>
                <CardContent>
                  <Typography variant="body2" sx={{ fontSize: "1.1rem" }}>
                    {article.description}
                  </Typography>
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                    <Typography variant="body2">{article.reactions_count}</Typography>
                  </IconButton>
                  <IconButton aria-label="share">
                    <ShareIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomeClient;
