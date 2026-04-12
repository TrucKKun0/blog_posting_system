import React, { useState } from 'react'
import { Button } from "@/components/ui/Button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RouteBlogAdd, RouteBlogEdit } from '@/helpers/RouteName';
import { useFetch } from '@/hooks/useFetch';
import { getEnv } from '@/helpers/getEnv';
import { deleteData } from '@/helpers/handleDelete';
import { showToast } from '@/helpers/showToast';
import Loading from '@/components/ui/Loading';
import { FaRegTrashAlt } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import moment from 'moment';


const BlogDetails = () => {

   const [refreshData, setRefreshData] = useState(false);

  const { data: blogData, loading, error} = useFetch(`${getEnv("VITE_API_BASE_URL")}/blog/get-all`, {
    method: "get",
    credentials: "include",
  }, [refreshData]);

  const handleDelete = async (id) => {
    const response = await deleteData(`${getEnv('VITE_API_BASE_URL')}/blog/delete/${id}`); 
    if(response){
        setRefreshData(!refreshData);
        showToast('success', 'Blog deleted successfully.');
    }else{
        showToast('error', 'Failed to delete blog.');
    }
  }

  if (loading) return <Loading />;

  return (
     <div>
      <Card>
        <CardHeader>
          <div>
            <Button asChild>
              <Link to={RouteBlogAdd}>Add Blog</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Author</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Dated</TableHead>
                <TableHead>Action </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {blogData && blogData.blog.length > 0 ? (
                blogData.blog.map(blog => (
                  <TableRow key={blog._id}>

                    <TableCell>{blog?.author?.name}</TableCell>
                    <TableCell>{blog?.category?.name}</TableCell>
                    <TableCell>{blog?.title}</TableCell>
                    <TableCell>{blog?.slug}</TableCell>
                    <TableCell>{moment(blog?.createdAt).format('MMMM Do, YYYY')}</TableCell> 

                    <TableCell className="flex gap-3">
                        <Button variant="outline" className="hover:bg-blue-500 hover:text-white ">
                            <Link to={RouteBlogEdit(blog._id)}>
                            <FiEdit/>
                            </Link>
                        </Button>
                        <Button variant="outline" className="hover:bg-red-500 hover:text-white" onClick={() => handleDelete(blog._id)}>
                            <FaRegTrashAlt />
                        </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="3">Data Not Found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default BlogDetails;