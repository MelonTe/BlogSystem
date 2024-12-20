import request from "@/api/requestUtil";

// 获取分类列表
export const postBlogList = (res: object) => {
  return request.post("bloglist", res);
};

export const getBlogTagNums = () => {
  return request.get("blogandtagnums");
};

export const getTags = () => {
  return request.get("tag");
};

export const postBlogDetail = (blogname: string) => {
  return request.post("blogitem", { blogname: blogname });
};

export const login = async (login: any) => {
  const data: any = await request.post("login", login);
  return data === null ? "" : data;
};

export const deleteItem = (blogname: string) => {
  return request.delete("api/blog", {
    params: {
      blogname,
    },
  });
};

export const modifyBlog = (data: any) => {
  return request.put("api/blog", data);
};

export const uploadBlog = (data: any) => {
  return request.post("api/uploadblog", data);
};

export const getMessage = (data: any) => {
  return request.post("messagerange", data);
};

export const sendMessage = (data: any) => {
  return request.post("message", data);
};

export const deleteMessage = (message: string, createdtime: string) => {
  return request.post("api/deletemessage", { message, createdtime });
};
