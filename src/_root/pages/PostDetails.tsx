import PostStats from '@/components/shared/PostStats';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/AuthContext';
import { useGetPostById } from '@/lib/react-query/queriesAndMutations';
import { formatDate } from '@/lib/utils';
import { Loader } from 'lucide-react';
import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDeletePost } from '@/lib/react-query/queriesAndMutations'; // Import your hook

const PostDetails = () => {
  const { id } = useParams();
  const { data: post, isPending } = useGetPostById(id || '');
  const { user } = useUserContext();
  const navigate = useNavigate();
  
  // Use the delete post hook
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();

  const handleDeletePost = () => {
    if (post) {
      // Call the mutation with the necessary parameters
      deletePost({ postId: post.$id, imageId: post.imageId }, {
        onSuccess: () => {
          // Redirect or show a success message
          navigate('/'); // Navigate to the home page or wherever appropriate
        },
        onError: (error) => {
          // Handle error case
          console.error('Error deleting post:', error);
        }
      });
    }
  };

  return (
    <div className="post_details-container">
      {isPending ? (
        <Loader />
      ) : (
        <div className="post_details-card flex flex-col lg:flex-row rounded-lg overflow-hidden">
          <div className="post_details-img-container w-full lg:w-1/2 h-full flex">
            <img
              src={post?.imageUrl}
              alt="post"
              className="post_details-img w-full h-auto lg:h-full object-cover rounded-b-lg lg:rounded-bl-none lg:rounded-br-lg"
            />
          </div>
          
          <div className="post_details-info w-full lg:w-1/2 p-4 flex flex-col">
            <div className="flex-between w-full">
              <Link to={`/profile/${post?.creator.$id}`} className="flex items-center gap-3">
                <img
                  src={post?.creator?.imageUrl || '/assets/icon/profile-placeholder.svg'}
                  alt="creator"
                  className="rounded-full w-8 h-8 lg:w-12 lg:h-12"
                />
                <div className="flex flex-col">
                  <p className="base-medium lg:body-bold text-light-1"></p>
                  <p>{post?.creator.name}</p>
                  <div className="flex-center gap-2 text-light-3">
                    <p className="subtle-semibold lg:small-regular">
                      {formatDate(post?.$createdAt)}
                    </p>
                    -
                    <p className="subtle-semibold lg:small-regular">
                      {post?.location}
                    </p>
                  </div>
                </div>
              </Link>
              <div className="flex-center">
                <Link
                  to={`/update-post/${post?.$id}`}
                  className={`${user.id !== post?.creator.$id && 'hidden'}`}
                >
                  <img src="/assets/icons/edit.svg" width={24} height={24} alt="edit" />
                </Link>
                <Button
                  onClick={handleDeletePost}
                  variant="ghost"
                  className={`ghost_details-delete_btn ${
                    user.id !== post?.creator.$id && 'hidden'
                  }`}
                  disabled={isDeleting} // Disable button while deleting
                >
                  <img src="/assets/icons/delete.svg" alt="delete" width={24} height={24} />
                </Button>
              </div>
            </div>
            <hr className="border w-full border-dark-4/80"/>
            <div className="flex flex-col flex-1 w-full small-medium lg:base-regular">
              <p>{post?.caption}</p>
              <ul className="flex gap-1 mt-2">
                {post?.tags.map((tag: string) => (
                  <li key={tag} className="text-light-3">
                    #{tag}
                  </li>
                ))}
              </ul>
              <div className="w-full">
                <PostStats post={post} userId={user.id} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetails;
