package com.blog.lxw.dao;

import org.apache.ibatis.annotations.Mapper;

/**
 * @author Lixw
 * @date 2020/7/5
 * 编写博客
 */
@Mapper
public interface EditBlogDao {
    public void addBlog(String title, String outline, String picture, String content, String type);
}
