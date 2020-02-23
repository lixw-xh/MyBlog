package com.blog.lxw.service.impl;

import com.blog.lxw.dao.TestDao;
import com.blog.lxw.entity.Blog;
import com.blog.lxw.service.TestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

/**
 * @author Lixw
 * @date 2020/2/23
 */
@Service
public class TestServiceImpl implements TestService {

    @Autowired
    private TestDao testDao;

    @Override
    public ArrayList<Blog> get() {
        ArrayList<Blog> result = testDao.get();
        return result;
    }
}
