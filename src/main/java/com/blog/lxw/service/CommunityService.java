package com.blog.lxw.service;

import com.blog.lxw.entity.mysql.MysqlBlog;

import java.util.ArrayList;

/**
 * @author Lixw
 * @date 2020/6/7
 * 社区查询服务
 */
public interface CommunityService {
    public MysqlBlog getPageNumber();

    public ArrayList<MysqlBlog> getBlogAccordPageNumber(int row);
}
