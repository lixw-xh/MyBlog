package com.blog.lxw.service.impl;

import com.blog.lxw.dao.EditBlogDao;
import com.blog.lxw.service.EditBlogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @author Lixw
 * @date 2020/7/5
 * 编写博客实现类
 */
@Service
public class EditBlogServiceImpl implements EditBlogService {
    private static final Logger logger = LoggerFactory.getLogger(EditBlogServiceImpl.class);

    @Autowired
    private EditBlogDao editBlogDao;

    @Override
    public void addBlog(String title, String outline, String picture, String content, String type) {
        logger.info("添加博客信息");
        editBlogDao.addBlog(title, outline, picture, content, type);
    }
}
