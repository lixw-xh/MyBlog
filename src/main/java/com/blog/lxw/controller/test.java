package com.blog.lxw.controller;

import com.blog.lxw.entity.Blog;
import com.blog.lxw.service.TestService;
import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.client.transport.TransportClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.Map;

/**
 * @author Lixw
 * @date 2020/2/22
 * 测试
 */
@RestController
@RequestMapping("blog")
public class test {

    @Autowired
    private TransportClient client;

    @Autowired
    private TestService testService;

    @RequestMapping(value = "/test", method = RequestMethod.GET)
    public ModelAndView test() {
        ModelAndView mav = new ModelAndView("index");
        return mav;
    }

    @RequestMapping(value = "/testMysql", method = RequestMethod.GET)
    public void testMysql(){
        ArrayList<Blog> result = testService.get();
        System.out.println(result);
    }

    @RequestMapping(value = "/testEs", method = RequestMethod.GET)
    public void testEs(){
        GetResponse response = client.prepareGet("people","man","1").get();
        Map<String, Object> source = response.getSource();
        System.out.println(source);
    }
}
