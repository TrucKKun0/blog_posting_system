import React, { useState } from "react";
import { FaRegComments } from "react-icons/fa";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import z, { set } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";
import { Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Textarea } from "./textarea";
import { useSelector } from "react-redux";
import { RouteCategoryDetails, RouteSignIn } from "@/helpers/RouteName";
import CommentList from "./CommentList";

const Comment = ({ props }) => {
  const [refreshComments, setRefreshComments] = useState(false);
  // const [ newComment, setNewComment] = useState(); 
  const user = useSelector((state) => state.user);
  const formSchema = z.object({
    comment: z.string().min(3, "Comment must be at least 3 characters long."),
  });

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      comment: "",
    },
  });

  async function onSubmit(values) {
    try {
        const newValues = { ...values, blogid: props.blogid, author: user.user._id};
      const response = await fetch(`${getEnv("VITE_API_BASE_URL")}/comment/add`,
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newValues),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        showToast("error", data.message);
        return;
      }
      // setNewComment(data.comment);
      form.reset();
      setRefreshComments(prev => !prev);
      showToast("success", data.message);
    } catch (error) {
      return showToast("error", error.message);
    }
  }

  return (
    <div>
      <h4 className="flex items-center gap-2 text-2xl font-bold">
        <FaRegComments className="text-blue-500" /> Comments
      </h4>
      {user && user.isLoggedIn 
      ? 
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-3">
              <FormField
                control={form.control}
                name="comment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Comment</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Type your comment here..."
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="">
              Submit
            </Button>
          </form>
        </Form>
      : 
        <Button asChild>
            <Link to={RouteSignIn}>Sign In</Link>
        </Button>
      }

      <div className="mt-5">
        <CommentList blogid={ props.blogid } refresh={refreshComments} />
      </div>
      
    </div>
  );
};

export default Comment;
