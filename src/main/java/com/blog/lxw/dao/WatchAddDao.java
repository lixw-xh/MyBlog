package com.blog.lxw.dao;

import org.apache.ibatis.annotations.Mapper;

/**
 * @author Lixw
 * @date 2020/7/7
 * 增加浏览记录
 */
@Mapper
public interface WatchAddDao {
    public void watchNumAdd(int id);
}
