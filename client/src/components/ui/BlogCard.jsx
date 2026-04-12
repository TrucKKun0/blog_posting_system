import React from "react";
import { Card, CardContent } from "./card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage } from "./avatar";
import { FaRegCalendarDays } from "react-icons/fa6";
import usericon from "@/assets/images/user.png";
import moment from "moment";
import { Link } from "react-router-dom";
import { RouteBlogDetails } from "@/helpers/RouteName";

const BlogCard = ({ post }) => {
  const hasImage = post.postImageUrl && post.postImageUrl.length > 0;
  
  return (
    <Link to={RouteBlogDetails(post.slug)}>
      <Card className={`group relative overflow-hidden rounded-2xl border border-gray-200 bg-white
             transition-all duration-300 ease-in-out
             hover:shadow-xl hover:-translate-y-1
             hover:border-blue-500/60 pt-5 flex flex-col ${hasImage ? 'h-[450px]' : 'h-auto min-h-[200px]'}`}>
        <CardContent className="flex flex-col h-full justify-between">
          <div className="flex items-center justify-between">
            <div className="flex justify-between items-center gap-2">
              <Avatar>
                <AvatarImage src={post.authorId?.avatarUrl || usericon} />
              </Avatar>
              <span>{post.authorId?.username || 'Unknown Author'}</span>
            </div>
            {post.category && (
              <Badge variant="outline" className="bg-blue-500">
                {post.category}
              </Badge>
            )}
          </div>
          
          {/* Conditional: Show Image if exists, otherwise skip image area entirely */}
          {hasImage && (
            <div className="my-2 w-full aspect-square bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              <img
                src={post.postImageUrl}
                alt="Post Image"
                className="rounded w-full h-full object-cover"
              />
            </div>
          )}
          
          {/* Title & Date  */}
          <div className={hasImage ? '' : 'mt-2'}>
            <p className="flex items-center gap-2 mb-2">
              <FaRegCalendarDays />
              <span>{moment(post.publishedAt || post.createdAt).format("MMMM Do, YYYY")}</span>
            </p>
            <h2 className="text-2xl font-bold line-clamp-2">{post.title}</h2>
            {!hasImage && post.content && (
              <p className="text-gray-600 mt-2 line-clamp-3">
                {post.content}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};
export default BlogCard;
