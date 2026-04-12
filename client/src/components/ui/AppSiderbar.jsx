import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import React from "react";
import { Link } from "react-router-dom";
import logo from "@/assets/images/logo-white.png";
import { IoHomeOutline } from "react-icons/io5";
import { BiCategoryAlt } from "react-icons/bi";
import { GrBlog } from "react-icons/gr";
import { FaRegComments } from "react-icons/fa";
import { LuUsers } from "react-icons/lu";
import { GoDot } from "react-icons/go";
import { RouteBlog, RouteCategoryDetails } from "@/helpers/RouteName";
import { useFetch } from "@/hooks/useFetch";
import { getEnv } from "@/helpers/getEnv";

const AppSiderbar = () => {

  const { data: categoryData} = useFetch(`${getEnv("VITE_API_BASE_URL")}/category/all-category`, {
      method: "get",
      credentials: "include",
    });

  return (
    <Sidebar>
      <SidebarHeader className="bg-white">
        <img src={logo} width={120} alt="" />
      </SidebarHeader>

      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="">
                  <IoHomeOutline />
                  Home
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to={RouteCategoryDetails}>
                  <BiCategoryAlt />
                  Categories
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to={RouteBlog}>
                  <GrBlog />
                  Blogs
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="">
                  <FaRegComments />
                  Comments
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <Link to="">
                  <LuUsers />
                  Users
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Categories</SidebarGroupLabel>

          <SidebarMenu>
            {categoryData && categoryData.category.length > 0 && categoryData.category.map(category => 
               <SidebarMenuItem key={category._id}>
              <SidebarMenuButton asChild>
                <Link to="">
                  <GoDot />
                  {category.name}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            )}
           
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSiderbar;