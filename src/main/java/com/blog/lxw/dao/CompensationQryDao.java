package com.blog.lxw.dao;

import com.blog.lxw.entity.mysql.MysqlBlog;
import org.apache.ibatis.annotations.Mapper;

import java.util.ArrayList;

/**
 * @author Lixw
 * @date 2020/7/7
 * Mysql补偿查询
 */
@Mapper
public interface CompensationQryDao {
    public ArrayList<MysqlBlog> middlePageQry();

    public ArrayList<MysqlBlog> downPageQry();

    public ArrayList<MysqlBlog> bottomPageQry();

    public MysqlBlog accrodingToId(String blogId);

    public ArrayList<MysqlBlog> getBlogData();

    public ArrayList<MysqlBlog> getMostWatch();

    public ArrayList<MysqlBlog> searchResult(String factor);

    public ArrayList<MysqlBlog> searchTagResult(String type);
}
