package com.blog.lxw.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @author Lixw
 * @date 2020/2/23
 * 博客
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Blog {
    private int id;
    private String title;
    private String content;
    private String picture;
    private int watch;
    private int likes;
    private String author;
    private String type;

}
