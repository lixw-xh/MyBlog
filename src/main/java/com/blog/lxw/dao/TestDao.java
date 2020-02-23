package com.blog.lxw.dao;

import com.blog.lxw.entity.Blog;
import org.apache.ibatis.annotations.Mapper;

import java.util.ArrayList;

/**
 * @author Lixw
 * @date 2020/2/23
 */
@Mapper
public interface TestDao {

    ArrayList<Blog> get();
}
