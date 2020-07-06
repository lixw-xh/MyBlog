package com.blog.lxw.service.impl;

import com.blog.lxw.dao.CommunityDao;
import com.blog.lxw.entity.mysql.MysqlBlog;
import com.blog.lxw.service.CommunityService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

/**
 * @author Lixw
 * @date 2020/6/7
 * 社区查询服务
 */
@Service
public class CommunityServiceImpl implements CommunityService {
    private static final Logger LOGGER = LoggerFactory.getLogger(CommunityServiceImpl.class);

    @Autowired
    private CommunityDao communityDao;

    @Override
    public MysqlBlog getPageNumber() {
        MysqlBlog dataNumber = communityDao.getPageNumber();
        if (null != dataNumber){
            return dataNumber;
        }
        return null;
    }

    @Override
    public ArrayList<MysqlBlog> getBlogAccordPageNumber(int row) {
        LOGGER.info("根据页码获取数据");
        ArrayList<MysqlBlog> blogDatas = communityDao.getBlogAccordPageNumber(row);
        if (null != blogDatas){
            return blogDatas;
        }
        return null;
    }
}
