# API Integration Guide

This guide explains how to use the integrated API services in your React components.

## Overview

The client is now integrated with all backend services through the API gateway:

- **Authentication Service** (`/v1/auth`) - User registration, login, logout
- **Post Service** (`/v1/posts`) - CRUD operations for blog posts
- **Profile Service** (`/v1/profile`) - User profile management
- **Social Service** (`/v1/social`) - Follow/unfollow users
- **Feed Service** (`/v1/feed`) - Get user's personalized feed
- **Interaction Service** (`/v1/interactions`) - Comments, likes
- **Media Service** (`/v1/media`) - File uploads
- **Search Service** (`/v1/search`) - Search posts

## Using Custom Hooks (Recommended)

Custom hooks provide a cleaner, React-friendly way to interact with APIs.

### Authentication Hook

```jsx
import { useAuth } from '../hooks/useAuth';

function LoginPage() {
  const { login, loading, error } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await login({
        email: 'user@example.com',
        password: 'password123'
      });
      console.log('Login successful:', response);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      {/* Form fields */}
      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}
    </form>
  );
}
```

### Posts Hook

```jsx
import { usePosts } from '../hooks/usePosts';

function PostList() {
  const { getAllPosts, createPost, loading, error } = usePosts();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getAllPosts();
      setPosts(data);
    };
    fetchPosts();
  }, [getAllPosts]);

  const handleCreatePost = async () => {
    try {
      const newPost = await createPost({
        title: 'My Post',
        content: 'Post content',
        category: 'tech''''
        ;
         ;
         ;
       });
      setPosts([...posts, newPost]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <button onClick={handleCreatePost}>Create Post</button>
      {posts.map(post => <PostCard key={post._id} post={post} />)}
    </div>
  );
}
```

### Profile Hook

```jsx
import { useProfile } from '../hooks/useProfile';

function UserProfile({ userId }) {
  const { getProfile, updateProfile, loading, error } = useProfile();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const data = await getProfile(userId);
      setProfile(data);
    };
    fetchProfile();
  }, [userId, getProfile]);

  const handleUpdate = async () => {
    try {oe'
      });
      const updated =oe'
      }); await updateProfile({
        bio: 'New biooe'',
      });
        name: 'John Doe'
      });
      setProfile(updated);
    } catch (err) {
      console.error(err);
    }
  };

  return <div>{/* Profile UI */}</div>;
}
```

### Social Hook

```jsx
import { useSocial } from '../hooks/useSocial';

function FollowButton({ userId }) {
  const { followUser, unfollowUser, loading } = useSocial();
  const [isFollowing, setIsFollowing] = useState(false);

  const handleFollow = async () => {
    try {
      if (isFollowing) {
        await unfollowUser(userId);
        setIsFollowing(false);
      } else {
        await followUser(userId);
        setIsFollowing(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button onClick={handleFollow} disabled={loading}>
      {isFollowing ? 'Unfollow' : 'Follow'}
    </button>
  );
}
```

### Interactions Hook

```jsx
import { useInteractions } from '../hooks/useInteractions';

function PostInteractio, post 
  };

  const handleComment = async (text) => {
    try {
      const newComment = await postComment({
        postId,
        content: text
      });
      setComments([...comments, newComment]);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <button onClick={handleLike}>Like</button>
      {/* Comment UI */}
    </div>
  );
}
```

### Feed Hook

```jsx
import { useFeed } from '../hooks/useFeed';

function HomeFeed() {
  const { getFeed, loading } = useFeed();
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    const fetchFeed = async () => {
      const data = await getFeed();
      setFeed(data);
    };
    fetchFeed();
  }, [getFeed]);

  return (
    <div>
      {feed.map(post => <PostCard key={post._id} post={post} />)}
    </div>
  );
}
```

### Media Hook

```jsx
import { useMedia } from '../hooks/useMedia';

function FileUploader() {
  const { uploadMedia, loading } = useMedia();

  const handleUpload = async (file) => {
    try {
      const result = await uploadMedia(file);
      console.log('Uploaded:', result);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <input 
      type="file" 
      onChange={(e) => handleUpload(e.target.files[0])}
      disabled={loading}
    />
  );
}
```

### Search Hook

```jsx
import { useSearch } from '../hooks/useSearch';

function SearchBar() {
  const { searchPosts, loading } = useSearch();
  const [results, setResults] = useState([]);

  const handleSearch = async (query) => {
    try {
      const data = await searchPosts(query);
      setResults(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <input 
      type="text" 
      onChange={(e) => handleSearch(e.target.value)}
      placeholder="Search posts..."
    />
  );
}
```

## Using Service Directly

If you prefer not to use hooks, you can import services directly:

```jsx
import { authService, postService } from '../services';

// Direct service usage
const handleLogin = async () => {
  try {
    const response = await authService.login({
      email: 'user@example.com',
      password: 'password'
    });
    console.log(response);
  } catch (err) {
    console.error(err);
  }
};
```

## Features

### Automatic Token Management

The API client automatically:
- Adds authentication tokens to requests
- Handles token refresh on 401 errors
- Manages credentials with cookies

### Error Handling

All hooks and services include:
- Loading states
- Error states
- Automatic error messages

### File Upload Support

Services that handle file uploads (posts, profile, media) accept optional file parameters:

```jsx
await createPost(postData, imageFiacceesecic fifilnms:

```jsx
//Ps mge upoad- ldn: 'posImag'uploadMedia(file);
```{ title, categry, tus, conten }

// Profile avatar upload - field name: 'avatar'
{ bi }

// Media upload - field name: 'file'
## API Endpoints Reference

### Authentication (`/v1/auth`)
- `POST /register` - Register user
- `POST /login` - Login user
- `POST /forget-password` - Reset password
- `POST /refresh-access-token` - Refresh token
- `POST /logout` - Logout user

### Posts (`/v1/posts`)
- `GET /` - Get all posts
- `GET /:slug` - Get post by slug
- `POST /` - Create post (expects: title, category, status, content)
- `PUT /:_id` - Update post (expects: title, category)
- `POST /:_id/publish` - Publish post (expects: title, category, content)
- `POST /:_id/delete` - Delete post

**Post Fields:**
- `title` (string, 5-100 chars, required)
- `category` (enum: 'Technology', 'Health', 'Lifestyle', 'Education', 'Entertainment', 'Business', 'Travel', 'Food', 'Sports', 'Politics', required)
- `status` (enum: 'draft', 'publi (expects: bio)shed', required)
- `content` (string, min 10 etc avahar

**Profile Fialds:**
- `bio` (string, optional)
-r`s, req` (file, optional)uired for create/publish)
- `postImage` (file, optional)

### Profile (`/v1/profile`)
- `GET /:userId` - Get user profile
- `POST /update` - Update profile
- `GET /delete-avatar` - Delete avatar
t (expects: posId, content)
### Social (`/v1/social`) (expects: commentId, content)
- `POST /follow/:userIdost/c`mment (expect : -argetId, targetType) Follow user
- `POST /unfollow/:userId` - ete commUnn (expfcts:ollow usId)er
ts (expec: postId as query param)

**Interaction Fields:**
- `postId` (string, required for comments)
- `commentId` (string, required for replies/delete)
- `content` (string, required for comments/replies)
- `targetId` (string, required for likes)
- `targetType` (enum: 'post', 'comment', required for likes)
### Feed (`/v1/feed`)
- `GET /` - Get user feed

### Interactions (`/v1/interactions`)
- `POST /comment` - Post comment
- `POST /replyComment` - Reply to comment
- `POST /like` - Like post
- `POST /deleteComment` - Delete comment
- `GET /getComments` - Get comments

### Media (`/v1/media`)
- `POST /upload` - Upload media file

### Search (`/v1/search`)
- `GET /` - Search posts

## Displaying Post Data with Conditional Images

The backend returns posts with the following image-related fields:
- `postImageUrl` - Cloudinary URL (may be null or empty if no image)
- `postImagePublicId` - Cloudinary public ID for deletion
- `content` - Post content text

### Dynamic Layout Cards

For cards that should adjust their layout based on image presence (no blank space when no image):

```jsx
function PostCard({ post }) {
  const hasImage = post.postImageUrl && post.postImageUrl.length > 0;
  
  return (
    <div className={`card ${hasImage ? 'h-[450px]' : 'h-auto min-h-[200px]'}`}>
      {/* Only render image area if image exists - no blank space */}
      {hasImage && (
        <img src={post.postImageUrl} alt={post.title} />
      )}
      
      <h3>{post.title}</h3>
      {!hasImage && post.content && (
        <p>{post.content}</p>
      )}
    </div>
  );
}
```

### Using PostImage Component (No Placeholder)

The PostImage component returns `null` by default when there's no image (no blank space):

```jsx
import { PostImage } from '../components/ui/PostImage';

function PostCard({ post }) {
  return (
    <div className="card">
      {/* Only renders if image exists - no blank space */}
      <PostImage
        imageUrl={post.postImageUrl}
        className="w-full h-64"
      />
      <h3>{post.title}</h3>
    </div>
  );
}
```

### Using PostImage Component (With Placeholder)

If you want to show a content preview placeholder when no image:

```jsx
import { PostImage } from '../components/ui/PostImage';

function PostCard({ post }) {
  return (
    <div className="card">
      <PostImage
        imageUrl={post.postImageUrl}
        content={post.content}
        showPlaceholder={true}
        className="w-full h-64"
      />
      <h3>{post.title}</h3>
    </div>
  );
}
```

### Using Utility Functions

```jsx
import { hasPostImage, getPostImageUrl, formatContentPreview } from '../utils/postUtils';

function PostCard({ post }) {
  return (
    <div className="post-card">
      {hasPostImage(post) ? (
        <img src={getPostImageUrl(post)} alt={post.title} />
      ) : (
        <p>{formatContentPreview(post.content)}</p>
      )}
    </div>
  );
}

### Backend Response Structure

**Post Object:**
```json
{
  "_id": "...",
  "title": "Post Title",
  "slug": "post-title",
  "category": "Technology",
  "status": "published",
  "publishedAt": "2024-01-01T00:00:00.000Z",
  "postImageUrl": "https://res.cloudinary.com/...", // May be null
  "postImagePublicId": "posts/abc123", // May be null
  "content": "Post content here...",
  "authorId": {
    "_id": "...",
    "name": "Author Name",
    "avatarUrl": "https://res.cloudinary.com/..."
  },
  "likeCount": 10,
  "commentCount": 5
}
```

## Environment Configuration

Make sure your `.env` file has the correct API base URL:

```
VITE_API_BASE_URL=http://localhost:3001/v1
```

## Redux Integration

The authentication hooks automatically integrate with Redux:
- Login sets user in Redux store
- Logout removes user from Redux store
- Token refresh updates Redux store

Access user state:

```jsx
import { useSelector } from 'react-redux';

function MyComponent() {
  const { user, isLoggedIn } = useSelector(state => state.user);
  
  return <div>{isLoggedIn ? `Welcome, ${user.name}` : 'Please login'}</div>;
}
```
