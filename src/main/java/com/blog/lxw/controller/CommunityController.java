package com.blog.lxw.controller;

import com.blog.lxw.util.ResultHandle;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.search.SearchHit;
import org.elasticsearch.search.SearchHits;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import sun.java2d.pipe.SpanShapeRenderer;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 * @author Lixw
 * @date 2020/3/7
 * 博客社区
 */
@RestController
@RequestMapping("blog")
public class CommunityController {
    private final static Logger logger = LoggerFactory.getLogger(CommunityController.class);

    @Autowired
    private TransportClient client;

    @Autowired
    private ResultHandle resultHandle;

    //索引
    private final static String INDEX = "blog";


    @RequestMapping(value = "/community", method = RequestMethod.GET)
    public ModelAndView communityView(){
        ModelAndView modelAndView = new ModelAndView("community");
        logger.info("登录社区");
        return modelAndView;
    }

    @RequestMapping(value = "/getBlogData",method = RequestMethod.POST)
    public void getBlogData(HttpServletResponse response) throws IOException, ParseException {
        SearchResponse searchResponse = client.prepareSearch(INDEX)
                .setSize(4)
                .get();
        resultHandle.doHandle(response, searchResponse);
    }
}
