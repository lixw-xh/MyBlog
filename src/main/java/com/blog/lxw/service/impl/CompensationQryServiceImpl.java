package com.blog.lxw.service.impl;

import com.blog.lxw.dao.CompensationQryDao;
import com.blog.lxw.entity.mysql.MysqlBlog;
import com.blog.lxw.service.CompensationQryService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

/**
 * @author Lixw
 * @date 2020/7/7
 * Msql补偿查询服务
 */
@Service
public class CompensationQryServiceImpl implements CompensationQryService {
    private static final Logger logger = LoggerFactory.getLogger(CompensationQryServiceImpl.class);

    @Autowired
    private CompensationQryDao compensationQryDao;

    @Override
    public ArrayList<MysqlBlog> middlePageQry() {
        ArrayList<MysqlBlog> middleDatas = compensationQryDao.middlePageQry();
        if (null != middleDatas || middleDatas.size() > 0){
            logger.info("返回Mysql查询数据");
            return middleDatas;
        }
        return null;
    }

    @Override
    public ArrayList<MysqlBlog> downPageQry() {
        ArrayList<MysqlBlog> downDatas = compensationQryDao.downPageQry();
        if (null != downDatas || downDatas.size() > 0){
            logger.info("返回Mysql查询数据");
            return downDatas;
        }
        return null;
    }

    @Override
    public ArrayList<MysqlBlog> bottomPageQry() {
        ArrayList<MysqlBlog> bottomDatas = compensationQryDao.bottomPageQry();
        if (null != bottomDatas || bottomDatas.size() > 0){
            logger.info("返回Mysql查询数据");
            return bottomDatas;
        }
        return null;
    }

    @Override
    public MysqlBlog accrodingToId(String blogId) {
        MysqlBlog accrodingToIdData = compensationQryDao.accrodingToId(blogId);
        if (null != accrodingToIdData || !"".equals(accrodingToIdData)){
            logger.info("返回Mysql查询数据");
            return accrodingToIdData;
        }
        return null;
    }

    @Override
    public ArrayList<MysqlBlog> getBlogData() {
        ArrayList<MysqlBlog> getBlogDatas = compensationQryDao.getBlogData();
        if (null != getBlogDatas || getBlogDatas.size() > 0){
            logger.info("返回Mysql查询数据");
            return getBlogDatas;
        }
        return null;
    }

    @Override
    public ArrayList<MysqlBlog> getMostWatch() {
        ArrayList<MysqlBlog> mostWatchDatas = compensationQryDao.getMostWatch();
        if (null != mostWatchDatas || mostWatchDatas.size() > 0){
            logger.info("返回Mysql查询数据");
            return mostWatchDatas;
        }
        return null;
    }

    @Override
    public ArrayList<MysqlBlog> searchResult(String factor) {
        ArrayList<MysqlBlog> searchResults = compensationQryDao.searchResult(factor);
        if (null != searchResults || searchResults.size() > 0){
            logger.info("返回Mysql查询数据");
            return searchResults;
        }
        return null;
    }

    @Override
    public ArrayList<MysqlBlog> searchTagResult(String type) {
        ArrayList<MysqlBlog> searchTagResults = compensationQryDao.searchTagResult(type);
        if (null != searchTagResults || searchTagResults.size() > 0){
            logger.info("返回Mysql查询数据");
            return searchTagResults;
        }
        return null;
    }
}
