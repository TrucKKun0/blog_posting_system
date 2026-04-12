import { Button } from "@/components/ui/Button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React from "react";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { RouteIndex, RouteSignIn } from "@/helpers/RouteName";
import { Card } from "@/components/ui/card";
import { getEnv } from "@/helpers/getEnv";
import { showToast } from "@/helpers/showToast";
import GoogleLogin from "@/components/ui/GoogleLogin";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/user/user.slice.js";



const SignUp = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

    const formSchema = z.object({
      name: z.string().min(3, "Name must be at least 3 characters long."),
      email: z.string().email(),
      password: z
        .string()
        .min(8, "Password must be at least 8 characters long."),
      confirmPassword: z
        .string()
        .refine((data) => data.password == data.confirmPassword, {
          message: "Passwords do not match.",
          path: ["confirmPassword"],
        }),
    });

    const form = useForm({
      resolver: zodResolver(formSchema),
      defaultValues: {
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
      },
    });

    async function onSubmit(values) {
      try {
        const response = await fetch(
          `${getEnv("VITE_API_BASE_URL")}/auth/register`,
          {
            method: "post",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(values),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          showToast("error", data.message);
          return;
        }
        dispatch(setUser({...data.user, token: data.AccessToken}));
        navigate(RouteIndex);
        showToast("success", data.message);
      } catch (error) {
        return showToast("error", error.message);
      }
    }
      
  return (
     <div className="flex justify-center items-center h-screen w-screen">
      <Card className="w-[400px] p-5 shadow-lg">
        <h1 className="text-2x1 font-bold text-center mb-5">
          Create New Account
        </h1>
        <div>
          <GoogleLogin />
          <div className="border my-5 flex justify-center items-center">
            <span className=" absolute bg-white text-sm p-1">Or</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="mb-3">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your name"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mb-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your email address"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mb-3">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mb-3">
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="Enter your password again" {...field} />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="mt-5">
              <Button type="submit" className="w-full">
                Sign Up
              </Button>
              <div className='mt-5 text-sm flex justify-center items-center gap-2'>
                <p>Already have account?</p>
                <Link className='text-blue-500 hover:underline' to={RouteSignIn}>Sign In</Link>
              </div>

            </div>
          </form>
        </Form>
      </Card>
    </div>
  )
}

export default SignUp;