import BlogCard from '@/components/ui/BlogCard';
import Loading from '@/components/ui/Loading';
import { useFeed } from '@/hooks/useFeed';
import React, { useEffect } from 'react';

const Index = () => {
  const { getFeed, loading, error, feedData } = useFeed();

  useEffect(() => {
    const fetchFeed = async () => {
      await getFeed();
    };
    fetchFeed();
  }, [getFeed]);

  if(loading) return <Loading/>;
  
  const posts = feedData?.data || [];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
      {posts.length > 0 ? (
        posts.map(post => <BlogCard post={post} key={post._id} />)
      ) : (
        <div className="col-span-full text-center text-gray-500 py-10">
          No posts available in your feed.
        </div>
      )}
    </div>
  );
};

export default Index;