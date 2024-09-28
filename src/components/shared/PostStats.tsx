import { useDeleteSavedPost, useGetCurrentUser, useLikePost, useSavePost } from "@/lib/react-query/queriesAndMutations";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import { Loader } from "lucide-react";
import React, { useState, useEffect } from "react";

type PostStatsProps = {
    post?: Models.Document;
    userId: string;
};

const PostStats = ({ post, userId }: PostStatsProps) => {
    const [likes, setLikes] = useState<string[]>([]);
    const [isSaved, setIsSaved] = useState(false);

    const { mutate: likePost } = useLikePost();
    const { mutate: savePost } = useSavePost();
    const { mutate: deleteSavedPost, isPending: isDeletingSaved } = useDeleteSavedPost();

    const { data: currentUser, isLoading, isError } = useGetCurrentUser();

    useEffect(() => {
        if (post?.likes) {
            setLikes(post.likes.map((user: Models.Document) => user.$id));
        }
    }, [post]);

    useEffect(() => {
        if (currentUser?.save && post) {
            const savedPostRecord = currentUser.save.find(
                (record: Models.Document) => record.post?.$id === post.$id
            );
            setIsSaved(!!savedPostRecord);
        }
    }, [currentUser, post]);

    const handleLikePost = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!post) return;

        let newLikes = [...likes];
        const hasLiked = newLikes.includes(userId);
        if (hasLiked) {
            newLikes = newLikes.filter((id) => id !== userId);
        } else {
            newLikes.push(userId);
        }
        setLikes(newLikes);
        likePost({ postId: post.$id, likesArray: newLikes });
    };

    const handleSavePost = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!post || !currentUser) return;
 // Log userId and postId to see if they are null or undefined
 console.log("userId:", userId);
 console.log("postId:", post?.$id);
        const savedPostRecord = currentUser.save.find(
            (record: Models.Document) => record.post?.$id === post.$id
        );

        if (savedPostRecord) {
            setIsSaved(false);
            deleteSavedPost(savedPostRecord.$id);
        } else {
            savePost({ postId: post.$id, userId });
            setIsSaved(true);
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (isError) {
        return <div>Error loading data</div>; // Or any other error indicator
    }

    return (
        <div className="flex justify-between items-center z-20">
            <div className="flex gap-2 mr-5">
                <img
                    src={checkIsLiked(likes, userId) ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
                    alt="like"
                    width={20}
                    height={20}
                    onClick={handleLikePost}
                    className="cursor-pointer"
                />
                <p className="small-medium lg:base-medium">{likes.length}</p>
            </div>
            <div className="flex gap-2">
                { isDeletingSaved ? (
                    <Loader />
                ) : (
                    <img
                        src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
                        alt="save"
                        width={20}
                        height={20}
                        onClick={handleSavePost}
                        className="cursor-pointer"
                    />
                )}
            </div>
        </div>
    );
};

export default PostStats;
