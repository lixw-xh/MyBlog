package com.blog.lxw.controller;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

/**
 * @author Lixw
 * @date 2020/2/29
 * 登录首页
 */
@RestController
@RequestMapping("blog")
public class IntoHomePage {
    private final static Logger logger = LoggerFactory.getLogger(IntoHomePage.class);

    @RequestMapping(value = "/index", method = {RequestMethod.GET,RequestMethod.POST})
    public ModelAndView index(){
        ModelAndView mav = new ModelAndView("index");
        logger.info("登录首页");
        return mav;
    }
}
