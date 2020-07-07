package com.blog.lxw.service;

import com.blog.lxw.entity.mysql.MysqlBlog;

import java.util.ArrayList;

/**
 * @author Lixw
 * @date 2020/7/7
 * Mysql补偿查询服务
 */
public interface CompensationQryService {
    public ArrayList<MysqlBlog> middlePageQry();

    public ArrayList<MysqlBlog> downPageQry();

    public ArrayList<MysqlBlog> bottomPageQry();

    public MysqlBlog accrodingToId(String blogId);

    public ArrayList<MysqlBlog> getBlogData();

    public ArrayList<MysqlBlog> getMostWatch();

    public ArrayList<MysqlBlog> searchResult(String factor);

    public ArrayList<MysqlBlog> searchTagResult(String type);
}
