package com.blog.lxw.controller;


import com.blog.lxw.entity.mysql.MysqlBlog;
import com.blog.lxw.service.EditBlogService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import javax.jws.WebParam;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.io.File;

/**
 * @author Lixw
 * @date 2020/7/5
 * 编写博客
 */
@RestController
@RequestMapping("blog")
public class EditBlogController {
    private static final Logger logger = LoggerFactory.getLogger(EditBlogController.class);

    @Autowired
    private EditBlogService editBlogService;

    @RequestMapping(value = "/editBlog", method = {RequestMethod.GET,RequestMethod.POST})
    private ModelAndView EditBlog(){
        ModelAndView mav = new ModelAndView("edit");
        logger.info("跳转编辑页面");
        return mav;
    }

    @RequestMapping(value = "/addBlog", method = RequestMethod.POST)
    public ModelAndView addBlog(MysqlBlog mysqlBlog){
        String title = mysqlBlog.getTitle();
        String outline = mysqlBlog.getOutline();
        String picture = mysqlBlog.getPicture();
        String content = mysqlBlog.getContent();
        String type = mysqlBlog.getType();
        if ("".equals(title) || "".equals(outline) || "".equals(picture) || "".equals(content) || "".equals(type)){
            logger.info("添加失败，输入信息存在空值，返回添加博客页");
            return new ModelAndView("redirect:/blog/editBlog");
        }else {
            ModelAndView mav = new ModelAndView("index");
            editBlogService.addBlog(title, outline, picture, content, type);
            return mav;
        }
    }
}
