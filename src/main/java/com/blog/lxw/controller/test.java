package com.blog.lxw.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * @author Lixw
 * @date 2020/2/22
 * 测试
 */
@Controller
@RequestMapping("blog")
public class test {

    @RequestMapping(value = "/test", method = RequestMethod.GET)
    public String test() {
        return "index";
    }



}
