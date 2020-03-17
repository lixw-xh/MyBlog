package com.blog.lxw.controller;

import com.alibaba.fastjson.JSONObject;
import com.blog.lxw.entity.es.EsBlog;
import com.blog.lxw.util.ResultHandle;

import org.elasticsearch.action.get.GetResponse;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.index.query.QueryBuilders;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.lang.reflect.InvocationTargetException;
import java.text.ParseException;
import java.util.Map;

import static org.apache.commons.beanutils.BeanUtils.populate;

/**
 * @author Lixw
 * @date 2020/3/17
 * 博客信息
 */
@RestController
@RequestMapping("blog")
public class BlogInformationController {
    private final static Logger logger = LoggerFactory.getLogger(BlogInformationController.class);

    @Autowired
    private TransportClient client;

    @Autowired
    private ResultHandle resultHandle;

    //索引
    private final static String INDEX = "blog";

    @RequestMapping(value = "/idQry", method = RequestMethod.GET)
    public ModelAndView idQry(EsBlog esBlog){
        ModelAndView modelAndView = new ModelAndView("article");
        int id = esBlog.getId();
        modelAndView.addObject("blogId", id);
        logger.info("跳转至具体博客页");
        return modelAndView;
    }

    @RequestMapping(value = "/accrodingToId",method = RequestMethod.POST)
    public void accrodingToId(HttpServletRequest request, HttpServletResponse response, EsBlog esBlog) throws IOException, ParseException, InvocationTargetException, IllegalAccessException {
        String blogId = request.getParameter("blogId");
        GetResponse searchResponse = client.prepareGet(INDEX,"_doc",blogId).get();
        Map<String,Object> source = searchResponse.getSource();
        JSONObject result = new JSONObject(source);
        response.setCharacterEncoding("utf-8");
        response.setContentType("application/json; charset=utf-8");
        logger.info("AJAX返回数据信息");
        response.getWriter().write(com.alibaba.fastjson.JSONObject.toJSONString(result));
    }
}
