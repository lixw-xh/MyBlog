package com.blog.lxw.controller;

import com.blog.lxw.entity.es.EsBlog;
import com.blog.lxw.util.ResultHandle;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.transport.TransportClient;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.sort.SortOrder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.text.ParseException;

/**
 * @author Lixw
 * @date 2020/7/6
 * 搜索
 */
@RestController
@RequestMapping("blog")
public class SearchController {
    private static final Logger logger = LoggerFactory.getLogger(SearchController.class);

    //Es索引
    private final static String INDEX = "blog";

    @Autowired
    private TransportClient client;

    @Autowired
    private ResultHandle resultHandle;

    @RequestMapping(value = "/searchPage", method = {RequestMethod.GET,RequestMethod.POST})
    public ModelAndView searchPage(EsBlog esBlog){
        ModelAndView mav = new ModelAndView("list");
        logger.info("接收前台的请求参数");
        mav.addObject("factor", esBlog.getFactor());
        return mav;
    }

    @RequestMapping(value = "/searchResult", method = RequestMethod.POST)
    public void searchResult(HttpServletRequest request, HttpServletResponse response) throws IOException, ParseException {
        String factor = request.getParameter("factor");
        logger.info("以前台传的factor字段值: "+factor+", 作为模糊查询条件，得到所有相关博客");
        SearchResponse searchResponse = client.prepareSearch(INDEX)
                .setQuery(QueryBuilders.termQuery("content", factor))
                .get();
        logger.info("得到搜索结果，进行数据处理");
        resultHandle.doHandle(response, searchResponse);
    }

    @RequestMapping(value = "/searchTagPage", method = {RequestMethod.GET,RequestMethod.POST})
    public ModelAndView searchTagPage(HttpServletRequest request){
        ModelAndView mav = new ModelAndView("listTag");
        logger.info("接收前台的请求参数");
        mav.addObject("type", request.getParameter("Type"));
        return mav;
    }

    @RequestMapping(value = "/searchTagResult", method = {RequestMethod.POST,RequestMethod.GET})
    public void searchTagResult(HttpServletRequest request, HttpServletResponse response) throws IOException, ParseException {
        String type = request.getParameter("type");
        logger.info("以前台传的type字段值: "+type+", 作为查询条件，得到所有相关类型博客");
        SearchResponse searchResponse = client.prepareSearch(INDEX)
                .setQuery(QueryBuilders.matchPhraseQuery("type", type))
                .get();
        logger.info("得到搜索结果，进行数据处理");
        resultHandle.doHandle(response, searchResponse);
    }
}
