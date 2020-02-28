package com.blog.lxw.dao;

import com.blog.lxw.entity.mysql.MysqlBlog;
import org.apache.ibatis.annotations.Mapper;

import java.util.ArrayList;

/**
 * @author Lixw
 * @date 2020/2/23
 */
@Mapper
public interface TestDao {

    ArrayList<MysqlBlog> get();
}
