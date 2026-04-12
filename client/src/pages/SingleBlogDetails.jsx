import { Avatar, AvatarImage } from '@/components/ui/avatar';
import Comment from '@/components/ui/Comment';
import CommentList from '@/components/ui/CommentList';
import Loading from '@/components/ui/Loading';
import { usePosts } from '@/hooks/usePosts';
import { decode } from 'entities';
import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';

const SingleBlogDetails = () => {
    const { slug } = useParams();
    const { getPostBySlug, loading, error, post } = usePosts();

    useEffect(() => {
        if (slug) {
            getPostBySlug(slug);
        }
    }, [slug, getPostBySlug]);

    if(loading) return <Loading />;
    if(error) return <div className="p-5 text-red-500">Error: {error}</div>;

  return (
    <div className='flex justify-between gap-20'>
        {post && 
            <>
                <div className='border rounded w-[70%] p-5'>
                <h1 className='text-2xl font-bold p-4 mb-5'>{post.title}</h1>
                    <div className='flex justify-between items-center'>
                      <div className='flex justify-between items-center gap-5'>
                         <Avatar>
                             <AvatarImage src={post.authorId?.avatarUrl || '/default-avatar.png'} />
                         </Avatar>
                         <span>{post.authorId?.username || 'Unknown Author'}</span>
                        </div>
                    </div>
                    {post.postImageUrl && (
                        <div className='my-5'>
                            <img src={post.postImageUrl} alt={post.title} className='w-full h-full object-cover rounded my-5' />
                        </div>
                    )}
                    <div dangerouslySetInnerHTML={{__html: decode(post.content) || ""}}>
                    {/* passing emty string to avoid error when content is null or undefined */}
                    </div>

                    <div className='border-t mt-5 pt-5'>
                        <Comment props={{ blogid: post._id }} />
                    </div>

                    <div className='border-t mt-5 pt-5'>
                        <CommentList props={{ blogid: post._id }} />
                    </div>
                </div>
               
            </>
        }
        <div className='border rounded w-[30%]'> </div>
    </div>
  )
}

export default SingleBlogDetails;