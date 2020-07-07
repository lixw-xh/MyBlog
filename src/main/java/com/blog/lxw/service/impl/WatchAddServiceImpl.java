package com.blog.lxw.service.impl;

import com.blog.lxw.dao.WatchAddDao;
import com.blog.lxw.service.WatchAddService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author Lixw
 * @date 2020/7/7
 * 增加浏览记录
 */
@Service
public class WatchAddServiceImpl implements WatchAddService {
    private static final Logger logger = LoggerFactory.getLogger(WatchAddServiceImpl.class);

    @Autowired
    private WatchAddDao watchAddDao;

    @Override
    public void watchNumAdd(int id) {
        logger.info("开始添加浏览数");
        watchAddDao.watchNumAdd(id);
    }
}
