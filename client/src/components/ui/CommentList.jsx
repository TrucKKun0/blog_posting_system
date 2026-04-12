import { getEnv } from "@/helpers/getEnv";
import { useFetch } from "@/hooks/useFetch";
import React from "react";
import { Avatar, AvatarImage } from "./avatar";
import usericon from "@/assets/images/user.png";
import moment from "moment";

const CommentList = ({ blogid, refresh }) => {
  const { data, loading, error } = useFetch(
    `${getEnv("VITE_API_BASE_URL")}/comment/get/${blogid}`,
    {
      method: "get",
      credentials: "include",
    },
    [refresh]
  );

  if (loading) return <div> Loading...</div>;

  return (
    <div>
      {/* <h4 className="text-2xl font-bold">
        {props.newComment ?
            <>
            {data && data.comments.length ||0}
            </>
            :
            <>{data && data.comments.length}</>
        }Comments
      </h4> */}

      {/* <h4 className="text-2xl font-bold">
        {data?.comments?.length || 0} Comments
      </h4> */}

      <div className="mt-5">
        {data && data.comments.length > 0 && data?.comments?.map((comment) => {
            return (
              <div key={comment._id} className="flex gap-2 pb-4 mb-4 border-b border-gray-300">
                <Avatar>
                  <AvatarImage src={comment?.author.avatar || usericon} />
                </Avatar>

                <div className="items-center">
                  <p className="font-bold">{comment?.author.name}</p>
                  <span className="text-sm text-gray-500">{moment(comment?.createdAt).format("MMMM Do, YYYY")}</span>
                  <div className="mt-1">{comment?.comment}</div>
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentList;
