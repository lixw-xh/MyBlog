package com.blog.lxw.entity.mysql;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


import java.util.Date;

/**
 * @author Lixw
 * @date 2020/2/23
 * 博客
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class MysqlBlog {
    private int id;
    private String title;
    private String outline;
    private String content;
    private String picture;
    private int watch;
    private int comment;
    private int likes;
    private String author;
    private String type;
    private Date createtime;
    private Date updatetime;
    private int dataNumber;

    //搜索条件
    private String factor;

}
