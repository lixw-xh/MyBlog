package com.blog.lxw.controller;

import com.blog.lxw.entity.es.EsBlog;
import com.blog.lxw.entity.mysql.MysqlBlog;
import com.blog.lxw.service.CompensationQryService;
import com.blog.lxw.util.MysqlResultHandle;
import com.blog.lxw.util.ResultHandle;
import net.sf.json.JSONArray;
import net.sf.json.JSONObject;
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
import java.text.SimpleDateFormat;
import java.util.ArrayList;

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

    @Autowired
    private MysqlResultHandle mysqlResultHandle;

    @Autowired
    private CompensationQryService compensationQryService;

    //日期格式处理
    private final static SimpleDateFormat SDF = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    private final static SimpleDateFormat SIMPLE_DATE_FORMAT = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS");

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
        if ("".equals(searchResponse) || null == searchResponse){
            logger.info("开始Mysql补偿查询");
            ArrayList<MysqlBlog> searchResults = compensationQryService.searchResult(factor);
            logger.info("Mysql数据格式处理");
            mysqlResultHandle.doMysqlHandle(response, searchResults);
        }else{
            logger.info("得到Es搜索结果，进行数据处理");
            resultHandle.doHandle(response, searchResponse);
        }
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
        if ("".equals(searchResponse) || null == searchResponse){
            logger.info("开始Mysql补偿查询");
            ArrayList<MysqlBlog> searchTagResults = compensationQryService.searchTagResult(type);
            logger.info("Mysql数据格式处理");
            mysqlResultHandle.doMysqlHandle(response, searchTagResults);
        }else{
            logger.info("得到Es搜索结果，进行数据处理");
            resultHandle.doHandle(response, searchResponse);
        }
    }
}
