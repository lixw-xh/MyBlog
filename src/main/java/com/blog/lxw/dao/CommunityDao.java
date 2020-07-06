package com.blog.lxw.dao;

import com.blog.lxw.entity.mysql.MysqlBlog;
import org.apache.ibatis.annotations.Mapper;

import java.util.ArrayList;

/**
 * @author Lixw
 * @date 2020/6/7
 * 社区查询服务
 */
@Mapper
public interface CommunityDao {
    public MysqlBlog getPageNumber();

    public ArrayList<MysqlBlog> getBlogAccordPageNumber(int row);
}
