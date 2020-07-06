package com.blog.lxw.entity.es;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.elasticsearch.annotations.DateFormat;
import org.springframework.data.elasticsearch.annotations.Document;
import org.springframework.data.elasticsearch.annotations.Field;
import org.springframework.data.elasticsearch.annotations.FieldType;

import java.util.Date;

/**
 * @author Lixw
 * @date 2020/2/23
 * 博客
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(indexName = "blog", type = "doc",
        useServerConfiguration = true,createIndex = false)
public class EsBlog {
    @Id
    private int id;
    @Field(type = FieldType.Text,analyzer = "ik_max_word")
    private String title;
    @Field(type = FieldType.Text,analyzer = "ik_max_word")
    private String outline;
    @Field(type = FieldType.Text,analyzer = "ik_max_word")
    private String content;
    @Field(type = FieldType.Text,analyzer = "ik_max_word")
    private String picture;
    @Field(type = FieldType.Integer)
    private int watch;
    @Field(type = FieldType.Integer)
    private int comment;
    @Field(type = FieldType.Integer)
    private int likes;
    @Field(type = FieldType.Text,analyzer = "ik_max_word")
    private String author;
    @Field(type = FieldType.Text,analyzer = "ik_max_word")
    private String type;
    @Field(type = FieldType.Date,format = DateFormat.custom,
            pattern = "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis")
    private Date createtime;
    @Field(type = FieldType.Date,format = DateFormat.custom,
            pattern = "yyyy-MM-dd HH:mm:ss||yyyy-MM-dd||epoch_millis")
    private Date updatetime;

    //搜索条件
    @Field(type = FieldType.Text,analyzer = "ik_max_word")
    private String factor;
}
